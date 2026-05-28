import subprocess, os, json, urllib.request

token = None
env_path = os.path.expanduser("~/.hermes/.env")
with open(env_path) as f:
    for line in f:
        line = line.strip()
        if line.startswith("GITHUB_TOKEN=") and not line.startswith("#"):
            token = line.split("=", 1)[1].strip()
            token = token.strip('"').strip("'")
            break

if not token:
    print("ERROR: No GITHUB_TOKEN found")
    exit(1)

branch = os.environ.get("BRANCH", "feat/add-validation-scripts")
title = os.environ.get("TITLE", "feat: add root-level validation workflow scripts")
body = os.environ.get("BODY", "")

cred_file = os.path.expanduser("~/.git-credentials")
with open(cred_file, "w") as f:
    f.write("https://faisalnugroho:" + token + "@github.com\n")

subprocess.run(["git", "config", "credential.helper", "store"], check=True)

env2 = os.environ.copy()
env2["GIT_TERMINAL_PROMPT"] = "0"

result = subprocess.run(
    ["git", "push", "origin", branch],
    capture_output=True, text=True, env=env2
)
print("Push:", result.stdout, result.stderr)

subprocess.run(["git", "remote", "set-url", "origin",
    "https://github.com/faisalnugroho/onchainkit.git"], check=True)

if result.returncode != 0:
    print("Push failed")
    exit(1)

pr_data = json.dumps({
    "title": title,
    "body": body,
    "head": "faisalnugroho:" + branch,
    "base": "main"
}).encode()

req = urllib.request.Request(
    "https://api.github.com/repos/coinbase/onchainkit/pulls",
    data=pr_data,
    headers={
        "Authorization": "token " + token,
        "Accept": "application/vnd.github+json",
        "Content-Type": "application/json"
    },
    method="POST"
)

try:
    resp = urllib.request.urlopen(req)
    result = json.loads(resp.read())
    print("PR #" + str(result["number"]) + ": " + result["html_url"])
except urllib.error.HTTPError as e:
    print("Error:", e.read().decode()[:500])
