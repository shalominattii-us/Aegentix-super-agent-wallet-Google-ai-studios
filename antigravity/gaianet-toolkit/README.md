# GaiaNet Autonomous Node Toolkit

A complete autonomous suite for managing, monitoring, and operating your GaiaNet node.

---

## Node Information

* **Node ID:** `0x0f9bcea18e16c4c08d67d8140b94078484212eb6`
* **Device ID:** `device-41c56364ddb55201b5718c5c`
* **Local Web Dashboard:** [http://localhost:8080](http://localhost:8080)
* **Chatbot UI:** [http://localhost:8080/chatbot-ui/index.html](http://localhost:8080/chatbot-ui/index.html)
* **OpenAI API Base URL:** `http://localhost:8080/v1`

---

## Toolkit Features

1. **Autonomous Operation (`start-autonomy.ps1`):**
   * Automatically boots the GaiaNet node.
   * Runs an auto-healing **Watchdog** that continuously monitors health and auto-restarts the node if needed.
   * Runs an **Auto-Chatter Bot** that continuously sends varied prompts to generate active inference traffic and keep the node active.

2. **Management Scripts:**
   * `start-node.ps1` - Starts the node and opens the Chatbot UI in your browser.
   * `stop-node.ps1` - Stops all running GaiaNet services.
   * `status-node.ps1` - Displays Node ID, Device ID, API health status, and active processes.
   * `stop-autonomy.ps1` - Gracefully terminates autonomous bots and services.

3. **Secure Backups (`backup/`):**
   * Preserved copies of `nodeid.json`, `deviceid.txt`, and `config.json`.

---

## How to Run

Open PowerShell in this directory:

### Start Full Autonomous Mode:
```powershell
.\start-autonomy.ps1
```

### Monitor Live Auto-Chat Traffic:
```powershell
Get-Content -Wait .\scripts\auto_chatter.log
```

### Stop Autonomous Operations:
```powershell
.\stop-autonomy.ps1
```
