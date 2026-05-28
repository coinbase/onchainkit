import subprocess, os, json, urllib.request

# Read token
token = None
with open(os.path.expanduser("~/.hermes/.env")) as f:
    for line in f:
        if line.startswith("GITHUB_TOKEN=") and not line.startswith("#"):
            token = line.split("=", 1)[1].strip()
            break

if not token:
    print("ERROR: No GITHUB_TOKEN found")
    exit(1)

branch = os.environ.get("BRANCH", "feat/add-validation-scripts")
title = os.environ.get("TITLE", "feat: add root-level validation workflow scripts")
body = os.environ.get("BODY", "")
closes = os.environ.get("CLOSES", "")

# Push
subprocess.run(["git", "remote", "set-url", "origin",
    f"https://faisalnugroho:***@github.com/faisalnugroho/onchainkit.git"],
    check=True)

result = subprocess.run(["git", "push", "origin", branch],
    capture_output=True, text=True)
print("Push:", result.stdout or result.stderr)

subprocess.run(["git", "remote", "set-url", "origin",
    "https://github.com/faisalnugroho/onchainkit.git"], check=True)

# Create PR
pr_data = json.dumps({
    "title": title,
    "body": body,
    "head": f"faisalnugroho:{branch}",
    "base": "main"
}).encode()

req = urllib.request.Request(
    "https://api.github.com/repos/coinbase/onchainkit/pulls",
    data=pr_data,
    headers={
        "Authorization": f"token {token}",
        "Accept": "application/vnd.github+json",
        "Content-Type": "application/json"
    },
    method="POST"
)

try:
    resp = urllib.request.urlopen(req)
    result = json.loads(resp.read())
    print(f"PR #{result['number']}: {result['html_url']}")
except Exception as e:
    err_body = e.read().decode() if hasattr(e, 'read') else str(e)
    print(f"Error: {err_body[:500]}")
