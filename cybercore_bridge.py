#!/usr/bin/env python3
"""
CyberCore Bridge (The Telemetry)
Port: 9005
Collects live telemetry from AutonomousCyberCore, monitors OODA loop state transitions,
and syncs real-time events directly with the Super Agent Wallet Web UI.
"""

import json
import time
from http.server import HTTPServer, BaseHTTPRequestHandler
import sys
import urllib.request

PORT = 9005

# In-memory telemetry log buffer
telemetry_events = []
current_loop_state = {
    "stage": "OBSERVE",
    "heartbeat_interval_seconds": 60,
    "last_pulse": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    "total_pulses": 0,
    "active_signals": 0,
    "total_alpha_generated_usd": 0.0,
    "status": "AUTONOMOUS_ONLINE",
}


class TelemetryBridgeHandler(BaseHTTPRequestHandler):
    def _set_headers(self, status=200):
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers(200)

    def do_GET(self):
        if self.path == "/health" or self.path == "/":
            self._set_headers(200)
            self.wfile.write(json.dumps({
                "status": "ONLINE",
                "service": "CyberCore Telemetry Bridge",
                "port": PORT,
                "buffered_events": len(telemetry_events),
                "loop_state": current_loop_state,
            }).encode("utf-8"))
        elif self.path == "/events":
            self._set_headers(200)
            self.wfile.write(json.dumps({
                "events": telemetry_events[-50:],
                "loop_state": current_loop_state,
            }).encode("utf-8"))
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Not found"}).encode("utf-8"))

    def do_POST(self):
        if self.path == "/telemetry/push" or self.path == "/push":
            content_length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_length) if content_length > 0 else b"{}"
            try:
                event = json.loads(body.decode("utf-8"))
            except Exception:
                event = {}

            event["received_at"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
            telemetry_events.append(event)
            if len(telemetry_events) > 100:
                telemetry_events.pop(0)

            # Update loop state
            if "stage" in event:
                current_loop_state["stage"] = event["stage"]
            if "alpha_usd" in event:
                current_loop_state["total_alpha_generated_usd"] += float(event["alpha_usd"])
            current_loop_state["total_pulses"] += 1
            current_loop_state["last_pulse"] = event["received_at"]

            # Forward to Super Agent Wallet Web Server on Port 3000 if available
            try:
                req = urllib.request.Request(
                    "http://localhost:3000/api/telemetry",
                    data=json.dumps(event).encode("utf-8"),
                    headers={"Content-Type": "application/json"},
                    method="POST",
                )
                urllib.request.urlopen(req, timeout=0.8)
            except Exception:
                # Dashboard UI might be running independently or on different port
                pass

            self._set_headers(200)
            self.wfile.write(json.dumps({
                "status": "TELEMETRY_ACKNOWLEDGED",
                "total_events": len(telemetry_events),
            }).encode("utf-8"))
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Not found"}).encode("utf-8"))


def run(port=PORT):
    server_address = ("0.0.0.0", port)
    httpd = HTTPServer(server_address, TelemetryBridgeHandler)
    print(f"[*] CYBERCORE TELEMETRY BRIDGE active on http://0.0.0.0:{port}")
    print("[*] Listening for autonomous heartbeat events from Orchestrator...")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[*] Shutting down Telemetry Bridge...")
        httpd.server_close()


if __name__ == "__main__":
    port_arg = int(sys.argv[1]) if len(sys.argv) > 1 else PORT
    run(port_arg)
