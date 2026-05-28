import os, json, urllib.request

token = None
with open(os.path.expanduser("~/.hermes/.env")) as f:
    for line in f:
        line = line.strip()
        if line.startswith("GITHUB_TOKEN=") and not line.startswith("#"):
            token = line.split("=", 1)[1].strip().strip('"').strip("'")
            break

print("Token length:", len(token) if token else 0)

# Test the token
req = urllib.request.Request(
    "https://api.github.com/user",
    headers={"Authorization": "token " + token}
)
try:
    resp = urllib.request.urlopen(req)
    user = json.loads(resp.read())
    print("Authenticated as:", user["login"])
except urllib.error.HTTPError as e:
    print("Auth error:", e.code, e.read().decode()[:200])
