# Aegentix Autonomous CyberCore: Proactive OODA Alpha Engine

This guide details how to operate the autonomous, self-triggering alpha loop bridging Centralized (CEX) and Decentralized (DEX) exchanges.

---

## 🏛️ Architecture: The 4-Process Terminal Suite

```text
┌───────────────────────────────┐     ┌──────────────────────────────────┐
│  heretic_server.py (Port 9003) │     │  compliance_engine.py (Port 9004)│
│          [The Brain]          │     │            [The Gate]            │
└──────────────▲────────────────┘     └────────────────▲─────────────────┘
               │ (Inference / Orient)                  │ (Audit / Invariants)
┌──────────────┴───────────────────────────────────────┴─────────────────┐
│                     cybercore_autonomous.py                             │
│                  [The Autonomous Orchestrator]                         │
│   1. OBSERVE (DEX/CEX + Sentiment) ──▶ 2. ORIENT & DECIDE (Heretic)    │
│   3. GATE (Compliance HMAC)        ──▶ 4. ACT & BROADCAST (DEX + CEX) │
└──────────────────────────────┬─────────────────────────────────────────┘
                               │ (Telemetry Push)
┌──────────────────────────────▼─────────────────────────────────────────┐
│                    cybercore_bridge.py (Port 9005)                      │
│                           [The Telemetry]                              │
│                                  │                                     │
│                     npm run dev (Port 3000)                            │
│                 [Super Agent Wallet Dashboard]                         │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Running the Terminal Suite

Open 4 separate terminal tabs:

### Terminal 1: The Brain (Port 9003)
```bash
python heretic_server.py
```
*Evaluates market contexts, enforces mathematical spread invariants, and outputs bounded trade decisions.*

### Terminal 2: The Gate (Port 9004)
```bash
python compliance_engine.py
```
*Enforces hard behavioral invariants (velocity limit, max burst rate) and mints chained HMAC-SHA256 compliance blocks.*

### Terminal 3: The Telemetry (Port 9005)
```bash
python cybercore_bridge.py
```
*Bridges live telemetry events between the python orchestrator and the Super Agent Wallet web interface.*

### Terminal 4: The Autonomous Orchestrator (Heartbeat)
```bash
python cybercore_autonomous.py
```
*The self-triggering proactive heartbeat loop running every 60 seconds.*

### Web Dashboard
```bash
npm run dev
```
*Runs the full-stack Super Agent Wallet UI on http://localhost:3000.*

---

## ⚙️ Environment Separation (ROCm vs Pure-Python venv)

- **Heretic Server (`heretic_server.py`)**: Uses system Python with AMD ROCm (`/opt/rocm`) and GPU drivers for local tensor weights.
- **Orchestrator (`cybercore_autonomous.py`)**: Can run in standard pure-Python virtual environment (`httpx`, `pydantic`, `asyncio`).
- **Web UI & Backend (`server.ts`)**: Built-in virtual OODA simulator ensures the dashboard operates seamlessly even before external Python terminals are attached!
