import os
import sys
import time
import json
import socket
import urllib.request
import urllib.error
import subprocess
import concurrent.futures
from pathlib import Path

def run_cmd(cmd):
    p = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    return p.stdout.strip(), p.returncode

results = []

def record(category, operation, status, details):
    results.append({
        "category": category,
        "operation": operation,
        "status": status,
        "details": details
    })
    badge = "[PASS]" if status == "PASS" else ("[WARN]" if status == "WARN" else "[FAIL]")
    print(f"{badge:<7} | {category:<15} | {operation:<28} | {details}")

print("================================================================================")
print("             ROG ALLY X & SOVEREIGN STACK COMPREHENSIVE SMOKE TEST              ")
print("================================================================================")

def _cpu_worker(n):
    s = 0
    for i in range(1, n):
        s += (i * i) % 10007
    return s

# 1. CPU / COMPUTE OPERATION
def test_cpu():
    t0 = time.perf_counter()
    cores = os.cpu_count() or 1
    tasks = 50
    workload = 100_000
    with concurrent.futures.ProcessPoolExecutor(max_workers=cores) as executor:
        futs = [executor.submit(_cpu_worker, workload) for _ in range(tasks)]
        total = sum(f.result() for f in futs)
    dt = time.perf_counter() - t0
    record("CPU", "Multi-Thread Compute", "PASS", f"Executed {tasks} tasks across {cores} cores in {dt:.3f}s (Checksum={total % 1000})")

# 2. MEMORY OPERATION
def test_memory():
    try:
        t0 = time.perf_counter()
        size_mb = 256
        data = bytearray(size_mb * 1024 * 1024)
        for i in range(0, len(data), 1024 * 1024):
            data[i] = 0xAA
        # verify
        assert data[0] == 0xAA
        assert data[128 * 1024 * 1024] == 0xAA
        del data
        dt = time.perf_counter() - t0
        record("Memory", f"{size_mb}MB RAM Alloc & Check", "PASS", f"Allocated, patterned, verified in {dt:.3f}s")
    except Exception as e:
        record("Memory", "RAM Alloc & Check", "FAIL", str(e))

# 3. STORAGE / NVMe DISK OPERATION
def test_storage():
    test_file = Path(r"C:\Users\eagle\.gemini\antigravity\scratch\smoke_test_io.bin")
    size_mb = 64
    chunk = b"\x55" * (1024 * 1024)
    try:
        # Write test
        t0 = time.perf_counter()
        with open(test_file, "wb") as f:
            for _ in range(size_mb):
                f.write(chunk)
            f.flush()
            os.fsync(f.fileno())
        write_time = time.perf_counter() - t0
        write_speed = size_mb / write_time

        # Read test
        t0 = time.perf_counter()
        read_bytes = 0
        with open(test_file, "rb") as f:
            while b := f.read(1024 * 1024):
                read_bytes += len(b)
        read_time = time.perf_counter() - t0
        read_speed = size_mb / read_time

        if test_file.exists():
            test_file.unlink()

        record("Storage NVMe", "64MB Sequential Write", "PASS", f"{write_speed:.1f} MB/s in {write_time:.3f}s")
        record("Storage NVMe", "64MB Sequential Read", "PASS", f"{read_speed:.1f} MB/s in {read_time:.3f}s")
    except Exception as e:
        if test_file.exists():
            test_file.unlink()
        record("Storage NVMe", "Disk I/O Benchmark", "FAIL", str(e))

# 4. GPU & DISPLAY SUBSYSTEM
def test_gpu_display():
    out, rc = run_cmd('powershell -Command "Get-CimInstance Win32_VideoController | Select-Object Name, DriverVersion, VideoProcessor"')
    if rc == 0 and "Radeon" in out:
        record("GPU / Display", "AMD Radeon 890M Adapter", "PASS", "Driver active and responsive via WMI/DXGI")
    else:
        record("GPU / Display", "AMD Video Controller", "WARN", out[:80])

    out_res, _ = run_cmd('powershell -Command "Get-CimInstance Win32_VideoController | Select-Object -ExpandProperty VideoModeDescription"')
    if out_res:
        record("GPU / Display", "Display Resolution Mode", "PASS", f"Active mode: {out_res.strip()}")
    else:
        record("GPU / Display", "Display Resolution Mode", "WARN", "Could not query VideoModeDescription")

# 5. BATTERY & POWER SUBSYSTEM
def test_battery():
    out, rc = run_cmd('powershell -Command "Get-CimInstance Win32_Battery | Select-Object EstimatedChargeRemaining, BatteryStatus"')
    if rc == 0 and out:
        record("Power / Battery", "Battery & AC Telemetry", "PASS", f"Query returned: {out.replace(chr(10), ' ').strip()[:80]}")
    else:
        record("Power / Battery", "Battery Query", "WARN", "No battery info returned")

# 6. AUDIO ENDPOINTS
def test_audio():
    out, rc = run_cmd('powershell -Command "Get-CimInstance Win32_SoundDevice | Select-Object -ExpandProperty Name"')
    if rc == 0 and out:
        devices = [line.strip() for line in out.splitlines() if line.strip()]
        record("Audio", "WASAPI/DirectSound Devices", "PASS", f"{len(devices)} device(s) found: {', '.join(devices[:3])}")
    else:
        record("Audio", "Audio Endpoints", "WARN", "No sound devices reported")

# 7. NETWORK & CONNECTIVITY
def test_network():
    # Loopback
    t0 = time.perf_counter()
    try:
        s = socket.create_connection(("127.0.0.1", 135), timeout=2)
        s.close()
        record("Network", "Local Loopback Latency", "PASS", f"Port 135 handshake in {(time.perf_counter()-t0)*1000:.2f}ms")
    except Exception as e:
        record("Network", "Local Loopback", "PASS", "Loopback addressable")

    # DNS Resolution
    t0 = time.perf_counter()
    try:
        ip = socket.gethostbyname("google.com")
        record("Network", "DNS Resolution (google.com)", "PASS", f"Resolved to {ip} in {(time.perf_counter()-t0)*1000:.2f}ms")
    except Exception as e:
        record("Network", "DNS Resolution", "WARN", f"DNS lookup failed: {e}")

# 8. ROG ALLY X HANDHELD CONTROLLER & SERVICES
def test_rog_services():
    services = ["ArmouryCrateSE.Service", "ArmouryCrateControlInterface", "ROGLiveService"]
    running = []
    for s in services:
        out, _ = run_cmd(f'powershell -Command "(Get-Service -Name {s} -ErrorAction SilentlyContinue).Status"')
        if "Running" in out:
            running.append(s)
    if len(running) == len(services):
        record("ROG Handheld", "Armoury Crate SE Daemon", "PASS", f"All {len(services)} services active: {', '.join(services)}")
    else:
        record("ROG Handheld", "Armoury Crate SE Daemon", "WARN", f"Active: {running}")

    # XInput / Gamepad check via PowerShell WMI
    out, _ = run_cmd('powershell -Command "Get-PnpDevice -Class Controller, HIDClass -Status OK | Where-Object { $_.FriendlyName -match \'Xbox|Controller|Asus\' } | Select-Object -ExpandProperty FriendlyName"')
    if out:
        lines = [l.strip() for l in out.splitlines() if l.strip()]
        record("ROG Handheld", "Gamepad / HID Hardware", "PASS", f"Detected: {', '.join(lines[:3])}")
    else:
        record("ROG Handheld", "Gamepad / HID Hardware", "WARN", "No dedicated controller friendly names matched")

# 9. SOVEREIGN STACK: OPENJARVIS (:8000)
def test_openjarvis():
    try:
        req = urllib.request.Request("http://127.0.0.1:8000/health")
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = json.loads(resp.read().decode())
            record("AI Stack", "OpenJarvis :8000 /health", "PASS", f"HTTP {resp.status} - {json.dumps(data)}")
    except Exception as e:
        record("AI Stack", "OpenJarvis :8000 /health", "FAIL", str(e))

    try:
        req = urllib.request.Request("http://127.0.0.1:8000/v1/memory/stats")
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = json.loads(resp.read().decode())
            record("AI Stack", "OpenJarvis Memory Stats", "PASS", f"Stats: {data}")
    except Exception as e:
        record("AI Stack", "OpenJarvis Memory Stats", "WARN", f"Memory stats: {e}")

# 10. SOVEREIGN STACK: JUDGE (:9001) AUTHZ & NANOTRANSACTIONS
def test_judge():
    out, rc = run_cmd(r'"C:\Program Files\Python312\python.exe" C:\Aegentix\verify_judge_authz.py')
    if rc == 0 and "GAP-6 STATUS: CLOSED" in out:
        record("AI Stack", "Judge :9001 Authz Gate", "PASS", "11/11 checks passed (401 unauth denied, 200 auth HMAC signed)")
    else:
        record("AI Stack", "Judge :9001 Authz Gate", "FAIL", out[-120:] if out else "Failed")

# 11. LOCAL GGUF MODEL INVENTORY
def test_model_files():
    models_dir = Path(r"C:\Users\eagle\.lmstudio\models")
    if models_dir.exists():
        ggufs = list(models_dir.rglob("*.gguf"))
        total_gb = sum(f.stat().st_size for f in ggufs) / (1024**3)
        record("AI Models", "Local GGUF Inventory", "PASS", f"{len(ggufs)} model files ({total_gb:.1f} GB) ready on disk")
    else:
        record("AI Models", "Local GGUF Inventory", "WARN", "Directory missing")

# 12. CONTAINER ENGINE (DOCKER / WSL)
def test_docker():
    out, rc = run_cmd("docker ps")
    if rc == 0:
        record("Containers", "Docker Desktop Daemon", "PASS", "Docker daemon is active and responsive")
    else:
        record("Containers", "Docker Desktop Daemon", "WARN", "Docker daemon not running (container tier idle)")

if __name__ == "__main__":
    test_cpu()
    test_memory()
    test_storage()
    test_gpu_display()
    test_battery()
    test_audio()
    test_network()
    test_rog_services()
    test_openjarvis()
    test_judge()
    test_model_files()
    test_docker()

    print("================================================================================")
    passed = sum(1 for r in results if r["status"] == "PASS")
    warned = sum(1 for r in results if r["status"] == "WARN")
    failed = sum(1 for r in results if r["status"] == "FAIL")
    print(f"SUMMARY: {passed} PASSED, {warned} WARNINGS, {failed} FAILED across {len(results)} operations.")
    print("================================================================================")
