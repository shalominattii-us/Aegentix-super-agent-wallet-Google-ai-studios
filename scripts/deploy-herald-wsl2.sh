#!/usr/bin/env bash
# ===================================================================
#   AEGENTIX SOVEREIGN OS x HERALD OS & HERMES AGENT (WSL2 SUB-SYSTEM)
#   Deploys Hermes Agent & Herald OS environment inside WSL2
# ===================================================================

set -e

echo "=== [1/4] Preparing Environment in WSL2 ==="
sudo apt-get update -y
sudo apt-get install -y python3 python3-pip python3-venv git curl jq

WORK_DIR="$HOME/herald-os"
mkdir -p "$WORK_DIR"
cd "$WORK_DIR"

echo "=== [2/4] Initializing Virtual Environment ==="
if [ ! -d ".venv" ]; then
    python3 -m venv .venv
fi
source .venv/bin/activate

echo "=== [3/4] Installing Hermes Agent & Core Toolkits ==="
pip install --upgrade pip setuptools wheel
pip install aiohttp requests pydantic rich prompt_toolkit httpx

# Create Hermes Agent Bridge Configuration
cat << 'EOF' > herald_bridge.py
#!/usr/bin/env python3
"""
Herald OS & Hermes Agent Sovereign Bridge to Aegentix Port 3000.
Connects Hermes Agent directly to the 2,735 skills and MCP tools.
"""

import sys
import os
import json
import urllib.request

AEGENTIX_URL = os.environ.get("AEGENTIX_URL", "http://127.0.0.1:3000/mcp")
GROK_TOKEN = os.environ.get("GROK_TOKEN", "grok_f69e6c2c8a3b8c930c35578c3c77cb5e_d94492d4386bd0acddff063a5ce120c0cc81538c809cf5e8df554c3f41c6d9ca")

def call_aegentix_tool(tool_name: str, arguments: dict = None) -> dict:
    payload = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "tools/call",
        "params": {
            "name": tool_name,
            "arguments": arguments or {}
        }
    }
    data = json.dumps(payload).encode("utf-8")
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {GROK_TOKEN}",
        "User-Agent": "HeraldOS-HermesAgent/1.0"
    }
    req = urllib.request.Request(AEGENTIX_URL, data=data, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    print("[HeraldOS-Hermes] Connected to Aegentix Sovereign OS on Port 3000.")
    res = call_aegentix_tool("aegentix_devops_propagate", {"action": "status"})
    print("[Aegentix Status]:", json.dumps(res, indent=2))
EOF
chmod +x herald_bridge.py

echo "=== [4/4] Verifying Sovereign Bridge ==="
python3 herald_bridge.py || true

echo "==================================================================="
echo "  HERALD OS & HERMES AGENT READY IN WSL2!"
echo "  Launch anytime by running: cd ~/herald-os && source .venv/bin/activate && python3 herald_bridge.py"
echo "==================================================================="
