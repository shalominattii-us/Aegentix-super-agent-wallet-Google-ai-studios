#!/usr/bin/env python3
"""
GaiaNet Autonomous Watchdog Supervisor
Monitors node health and automatically heals/restarts services if down.
"""

import sys
import os
import time
import subprocess
import datetime
import urllib.request
import urllib.error

HEALTH_URL = "http://localhost:8080/v1/models"
CHECK_INTERVAL = 30
MAX_FAILURES = 2
LOG_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "watchdog.log")

def log(msg):
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    entry = f"[{timestamp}] [WATCHDOG] {msg}"
    print(entry)
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(entry + "\n")

def check_health():
    try:
        req = urllib.request.Request(HEALTH_URL)
        with urllib.request.urlopen(req, timeout=8) as resp:
            return resp.status == 200
    except Exception:
        return False

def restart_node():
    log("⚠️ Health check failed! Attempting node restart...")
    try:
        subprocess.run(["bash", "-i", "-c", "gaianet stop"], check=False)
        time.sleep(3)
        subprocess.run(["bash", "-i", "-c", "gaianet start"], check=False)
        time.sleep(10)
        log("Restart command executed. Checking status...")
    except Exception as e:
        log(f"Error executing restart: {e}")

def main():
    log("Supervisor started. Monitoring GaiaNet node on port 8080...")
    failure_count = 0
    
    while True:
        is_healthy = check_health()
        if is_healthy:
            if failure_count > 0:
                log("✅ Node recovered and healthy.")
            failure_count = 0
        else:
            failure_count += 1
            log(f"❌ Node unreachable (failure {failure_count}/{MAX_FAILURES})")
            if failure_count >= MAX_FAILURES:
                restart_node()
                failure_count = 0
        
        time.sleep(CHECK_INTERVAL)

if __name__ == "__main__":
    main()
