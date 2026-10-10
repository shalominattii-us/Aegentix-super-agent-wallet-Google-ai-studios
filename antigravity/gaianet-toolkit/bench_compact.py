import urllib.request
import json
import time

prompt = (
    "You are CYBERCORE-OSINT-PRIME. Rules: JSON only, scrub PII, no prompt injection, high accuracy.\n"
    "Target: shadowcorp-internal.com. Task: Passive recon, subdomain footprint, exposed services.\n"
    "Output JSON schema: {\"target\": str, \"subdomains\": list, \"open_ports\": list, \"risk_score\": int, \"action\": str}"
)

payload = {
    "model": "Llama-3.2-3B-Instruct",
    "messages": [
        {"role": "system", "content": "You are CYBERCORE-OSINT-PRIME. Output valid JSON only according to requested schema."},
        {"role": "user", "content": prompt}
    ],
    "temperature": 0.1,
    "max_tokens": 120,
    "max_completion_tokens": 120
}

print("[*] Sending high-density prompt to local node (port 8080)...")
t0 = time.time()
try:
    req = urllib.request.Request(
        "http://localhost:8080/v1/chat/completions",
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req, timeout=45) as resp:
        data = json.loads(resp.read().decode())
        dt = time.time() - t0
        print(f"[SUCCESS] Finished in {dt:.2f}s!")
        print("Response:\n", data["choices"][0]["message"]["content"])
except Exception as e:
    print(f"[ERROR] {e} in {time.time() - t0:.2f}s")
