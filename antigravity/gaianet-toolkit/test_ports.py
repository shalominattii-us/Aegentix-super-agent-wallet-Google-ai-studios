import urllib.request
import json
import time

for port in [9068, 8080]:
    url = f"http://localhost:{port}/v1/chat/completions"
    payload = {
        "model": "Llama-3.2-3B-Instruct",
        "messages": [{"role": "user", "content": "Ping test: reply with 'PONG'"}],
        "max_tokens": 5,
        "temperature": 0.1
    }
    print(f"Testing port {port}...")
    t0 = time.time()
    try:
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"}
        )
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            dt = time.time() - t0
            print(f"[{port} OK] in {dt:.2f}s: {data.get('choices', [{}])[0].get('message', {}).get('content')}")
    except Exception as e:
        dt = time.time() - t0
        print(f"[{port} FAIL] in {dt:.2f}s: {e}")
