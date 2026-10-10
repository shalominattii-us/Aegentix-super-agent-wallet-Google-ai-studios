#!/usr/bin/env python3
"""
GaiaNet Autonomous Interaction & Heartbeat Bot (Optimized for CPU Inference)
Continuously interacts with the local GaiaNet node to maintain active inference traffic,
record metrics, and monitor node responsiveness.
"""

import sys
import os
import time
import json
import random
import datetime
import urllib.request
import urllib.error

ENDPOINT = "http://localhost:8080/v1/chat/completions"
MODELS_ENDPOINT = "http://localhost:8080/v1/models"
LOG_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "auto_chatter.log")

PROMPTS = [
    "What is 25 * 4? Answer in one word.",
    "Name the closest planet to the Sun in one word.",
    "What is the chemical symbol for Gold?",
    "What is the capital of Japan? One word.",
    "Is Python an interpreted language? Answer yes or no.",
    "What is the speed of light in vacuum approximately in km/s?",
    "Who wrote Hamlet? Answer with author name only.",
    "What is 1024 divided by 8? Number only.",
    "What does CPU stand for? Concise phrase only.",
    "What is the primary gas in Earth's atmosphere?",
    "Name one major cryptocurrency besides Bitcoin.",
    "What is the freezing point of water in Celsius? Number only.",
    "What does HTTP stand for? Concise phrase only.",
    "Is the Earth the 3rd planet from the Sun? Yes or no.",
    "What is the square root of 144? Number only.",
    "Name the largest ocean on Earth.",
    "What color is chlorophyll?",
    "What is the binary representation of decimal 5?",
    "Name one sorting algorithm. Name only.",
    "What does AI stand for in computer science?"
]

def log(msg, also_print=True):
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    entry = f"[{timestamp}] {msg}"
    if also_print:
        print(entry)
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(entry + "\n")

def get_active_model():
    try:
        req = urllib.request.Request(MODELS_ENDPOINT)
        with urllib.request.urlopen(req, timeout=5) as response:
            data = json.loads(response.read().decode())
            if "data" in data and len(data["data"]) > 0:
                for m in data["data"]:
                    if "embed" not in m.get("id", "").lower():
                        return m.get("id")
                return data["data"][0].get("id")
    except Exception:
        pass
    return "Llama-3.2-3B-Instruct"

def send_chat_request(prompt, model_name):
    payload = {
        "model": model_name,
        "messages": [
            {"role": "system", "content": "You are a concise AI assistant. Answer in as few words as possible."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.3,
        "max_tokens": 30
    }
    
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        ENDPOINT,
        data=data,
        headers={"Content-Type": "application/json"}
    )
    
    start_time = time.time()
    try:
        with urllib.request.urlopen(req, timeout=120) as response:
            elapsed = time.time() - start_time
            res_data = json.loads(response.read().decode())
            choice = res_data.get("choices", [{}])[0]
            content = choice.get("message", {}).get("content", "").strip()
            usage = res_data.get("usage", {})
            total_tokens = usage.get("total_tokens", 0)
            return True, content, elapsed, total_tokens
    except Exception as e:
        elapsed = time.time() - start_time
        return False, str(e), elapsed, 0

def main():
    print("=" * 65)
    print("      GaiaNet Autonomous Auto-Chatter & Heartbeat Bot")
    print("=" * 65)
    
    min_interval = int(os.environ.get("MIN_INTERVAL", "20"))
    max_interval = int(os.environ.get("MAX_INTERVAL", "40"))
    
    log(f"Starting auto-chatter daemon. Target: {ENDPOINT}")
    log(f"Request interval: {min_interval}s - {max_interval}s")
    
    model_name = get_active_model()
    log(f"Active Chat Model: {model_name}")
    
    total_requests = 0
    successful_requests = 0
    total_tokens_accumulated = 0
    start_session = time.time()
    
    try:
        while True:
            prompt = random.choice(PROMPTS)
            total_requests += 1
            log(f"[{total_requests}] Asking: \"{prompt}\"")
            
            success, result, latency, tokens = send_chat_request(prompt, model_name)
            
            if success:
                successful_requests += 1
                total_tokens_accumulated += tokens
                snippet = result.replace("\n", " ")[:90] + ("..." if len(result) > 90 else "")
                log(f"  --> [OK] Response ({latency:.2f}s, {tokens} tokens): \"{snippet}\"")
            else:
                log(f"  --> [ERROR] Request failed ({latency:.2f}s): {result}")
            
            if total_requests % 5 == 0:
                uptime_min = (time.time() - start_session) / 60
                success_rate = (successful_requests / total_requests) * 100
                log(f"--- Stats: {successful_requests}/{total_requests} success ({success_rate:.1f}%), {total_tokens_accumulated} tokens, {uptime_min:.1f}m uptime ---")
            
            sleep_time = random.randint(min_interval, max_interval)
            time.sleep(sleep_time)
            
    except KeyboardInterrupt:
        uptime_min = (time.time() - start_session) / 60
        log("Auto-chatter stopped by user.")
        log(f"Final summary: {successful_requests}/{total_requests} requests successful | {total_tokens_accumulated} tokens | {uptime_min:.1f}m runtime")
        sys.exit(0)

if __name__ == "__main__":
    main()
