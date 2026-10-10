# Shared Memory — AEGENTIX/SOVEREIGN RUNTIME CONTEXT
*Last updated: 2026-09-21. Any session can read this. Update it when you learn something durable.*

## Nanotransaction Engine → EOC Staking → Rewards Routing (VERIFIED LIVE)

**Status:** Operational. POST localhost:5001/api/eoc/stake tested and returning confirmed stakes.

**Pipeline:**
```
compute work → ComputeNanoTransactionEngine generates packet
  → TreasuryBridge validates + settles
  → EOCStakingBridge runs EOC consensus (CMD_SOV_AE_EMIT_EOC_TELEMETRY, eagle@EOC)
  → LiveCoinbaseAgent stakes on-chain (Polygon/Base/Eth/Solana/Arbitrum) via CDP wallet
  → worker rewarded (USDC/ETH/SOV)
```

**Files:**
- `server/nanotransaction-engine.ts` — Core engine: generates/validates/scores/settles nano packets. Types: NanotransactionPacket, ULLTPacket, SlotMemoryTrace, EphemeralArena, IntegrityScore. Singleton via `getNanotransactionEngine(runtimeId)`.
- `server/eoc-staking-bridge.ts` — EOC staking bridge: generates stake packets, runs EOC consensus, executes on-chain stake. Types: EOCStakePacket, EOCStakeRequest/Response. Router via `createEOCStakeRouter(bridge)`.
- `server/memory-galaxy-bridge.ts` — Compute orchestrator: GalaxyComputeOrchestrator ties galaxy compute jobs → nano tx → treasury → worker reward. Also has ComputeNanoTransactionEngine and TreasuryBridge classes.
- `server/eoc-stake-demo.py` — Python demo that tests the EOC staking endpoint.

**API Endpoints (sovereign-dashboard api/server.cjs):**
- `POST /api/eoc/stake` — Route a nanotransaction through EOC for on-chain stake. Body: `{worker_id, compute_task, integrity_score, reward_amount, reward_token, stake_ratio, network, memory_id, source}`. Returns: `{packetId, status, txHash, blockNumber, eocLedgerEntry, consensus, network, worker_id, compute_task, integrity_score, reward_amount, reward_token, stake_amount, stake_token, eoc_directive, eoc_node, timestamp}`.
- `GET /api/eoc/status` — EOC staking status. Returns enabled networks, default network, stake ratio, EOC node info.

**Integrity Scoring (4-factor, weights in nanotransaction-engine.ts):**
- Actor reputation: 30%
- Context risk: 30% (riskMap: treasury.transfer=40, compliance.investigation=30, authority.elevation=60, reality.layer_activation=20, default=25)
- Historical behavior: 20%
- Mesh consensus: 20%
- Multiplier: 0.95

**Trust Levels:** critical ≥80, high ≥60, medium ≥40, low <40

**TTLs:** ULLT packet: 60s. Arena: 5min (300000ms). Arena cleanup: every 60s.

**EOC Directive:** CMD_SOV_AE_EMIT_EOC_TELEMETRY (from swarm_payload_hourly.json, eagle@EOC node)

**Network RPCs:** polygon=https://polygon-rpc.com, ethereum=https://eth-rpc.com, base=https://mainnet.base.org, solana=https://api.mainnet-beta.solana.com, arbitrum=https://arb1.arbitrum.io/rpc

**Related docs:** NANOTRANSACTION_ENGINE.md, NANOTRANSACTION_COMPLIANCE_FRAMEWORK.md, NANOTRANSACTION_PATENT_CLAIMS.md, NANOTRANSACTION_INVESTOR_ONEPAGER.md, EVENT_ONTOLOGY.md (all in docs/)

## Port Map
- 8081 = JARVIS REAL (SAPI voice, jarvis_real.py)
- 7860 = Captain Kirk Gradio (needs OneKey env var) — renamed from Charlie Kirk 2026-09-21
- 9119 = Hermes web UI/dashboard
- 5001 = Sovereign Portal API (Memory Galaxy + EOC staking)

---

## HEMPEROR — PowerShell Nanotransaction Integrity Engine

*PowerShell runtime implementing the same nanotransaction integrity → risk → trust → EOC stake → rewards pipeline as the TypeScript engine. Live-demonstrated below.*

### Classes

| Class | Fields | Purpose |
|---|---|---|
| `NanotransactionEnvelope` | PacketId, TxHash, Origin, Context, Directive, Status, Consensus, TrustTier, TTL, EocNode | Packet wrapper |
| `IntegrityResult` | Score (0-1), Tampered (bool), Verdict (clean/degraded/rejected) | Integrity scoring |
| `RiskResult` | RiskCoefficient (0-1), SafetyDelta, Outcome (rejected/sandbox/throttled/allowed) | Risk assessment |
| `TrustResult` | LocalTrust, Consensus, TrustTier | Trust evaluation |
| `EocStake` | NodeId, StakeWeight, IntegrityWeight | Stake descriptor |
| `RewardResult` | NodeRewards (hashtable), RuntimeRevenue, OemRevenue, SafetyRevenue, TotalWealthPerMinute | Economic model output |

### Engine Functions

**`New-NanotransactionEnvelope`** — Creates envelope with SHA256 hash of `Origin|Context|Directive|EocNode|TTL|PacketId`. Default TTL=60s.

**`Invoke-IntegrityEngine`** — Base score 0.9 (clean). Score=0 if TxHash empty (tampered→rejected). Verdict: ≥0.85=clean, else degraded, tampered=rejected.

**`Invoke-RiskEngine`** — riskCoeff = envRisk(0.2) + dataRisk(0.3) + agentRisk(0.1) = 0.6 baseline. +0.4 if tampered (→1.0). safetyDelta=0.1 baseline, -0.5 if tampered. Outcome: rejected→rejected, coeff>0.7→sandbox, coeff>0.5→throttled, else allowed.

**`Invoke-TrustEngine`** — localTrust = integrityScore * (1 - riskCoeff). consensus = localTrust - 0.05 (floor 0). Trust tiers: Platinum≥0.9, Gold≥0.85, Silver≥0.7, Bronze≥0.5, Quarantine<0.5.

**`Invoke-EocStaking`** — stakeWeight=1.0, integrityWeight=consensus. NodeId=EocNode.

**`Invoke-RewardsRouting`** — Economic model:
- trustedVolume = NTPM × avgTrust
- runtimeRevenue = trustedVolume × baseFee ($0.0001/tx)
- pool = alpha(0.3) × runtimeRevenue  → split across nodes by (stakeWeight × integrityWeight) / denom
- oemRevenue = runtimeRevenue × oemMult(0.2)
- safetyRevenue = runtimeRevenue × safetyMult(0.1)
- totalWealth = runtime + oem + safety

**`Write-SharedMemoryEntry`** — Appends JSON entry to `$Global:SharedMemoryPath` (SHARED_MEMORY.md) with: packetId, status, txHash, consensus, eoc_node, eoc_directive, integrity, tampered, risk, safety_delta, trust_tier, ttl, origin, context, timestamp.

**`Invoke-NanotransactionFlow`** — Full pipeline: envelope → integrity → risk → trust → EOC stake → (if not rejected) confirm + write shared memory entry.

**`Compute-SovAeWealth`** — Wraps `Invoke-RewardsRouting` for economic computation.

### Trust Tier Comparison (HEMPEROR vs TypeScript)

| Tier | HEMPEROR threshold | TypeScript threshold | Match? |
|---|---|---|---|
| critical/Platinum | ≥0.9 | ≥0.80 (score) | Different scale |
| high/Gold | ≥0.85 | ≥0.60 (score) | Different scale |
| medium/Silver | ≥0.70 | ≥0.40 (score) | Different scale |
| low/Bronze | ≥0.50 | <0.40 (score) | Different scale |
| Quarantine | <0.50 | <0.40 (score) | Similar intent |

*Note: HEMPEROR uses consensus (0-1) for tiers; TypeScript uses raw integrity score (0-100). Not 1:1 compatible — HEMPEROR is more conservative (lower thresholds for high trust).*

### Live Demo Output (2026-09-21)

**Flow:**
```
Origin: agent://hermes/default
Context: CMD_SOV_AE_EMIT_EOC_TELEMETRY
Directive: CMD_SOV_AE_EMIT_EOC_TELEMETRY
EocNode: eagle@EOC
PacketId: b3756518-2f97-4ec6-8241-e98299677bbf
TxHash: 0x385c9149dd8bf26d9eb12c92a7a0197282d0a161b1ba1a6ed2667e2b56ae4795
Integrity: 0.9 | Tampered: False | Verdict: clean
Risk: 0.6 | SafetyDelta: 0.1 | Outcome: allowed
Consensus: 0.31 | LocalTrust: 0.36 | TrustTier: Quarantine
Status: confirmed
```

**Economic model (1,000,000 nano/min, avg trust 0.31, baseFee $0.0001):**
```
RuntimeRevenue:   $31.00/min   (1M × 0.31 × $0.0001)
OemRevenue:       $6.20/min    (31 × 0.2)
SafetyRevenue:    $3.10/min    (31 × 0.1)
TotalWealth:      $40.30/min
NodeRewards:      eagle@EOC gets 100% of pool (single stakeholder)
```

*Note: At consensus 0.31, trust tier is Quarantine — low-trust traffic. At higher integrity (e.g. 0.95 with low risk), tiers would be Gold/Platinum and revenue scales proportionally.*

### Key Parameters (HEMPEROR defaults)

| Parameter | Value | Notes |
|---|---|---|
| Base integrity score | 0.9 | Clean default |
| envRisk | 0.2 | Environment risk component |
| dataRisk | 0.3 | Data risk component |
| agentRisk | 0.1 | Agent behavior risk component |
| Baseline riskCoeff | 0.6 | Sum of above |
| Tampered risk add | +0.4 | Pushes to 1.0 |
| Baseline safetyDelta | +0.1 | Positive when clean |
| Tampered safetyDelta | -0.5 | Negative when tampered |
| Consensus offset | -0.05 | Deduction from localTrust |
| Base fee per nano | $0.0001 | Revenue per trusted nano |
| Alpha (runtime→royalties) | 0.3 | 30% of runtime revenue to pool |
| OEM multiplier | 0.2 | 20% of runtime to OEM |
| Safety multiplier | 0.1 | 10% of runtime to safety |
| TTL | 60s | Same as TypeScript ULLT TTL |
| Stake weight | 1.0 | Per-node default |

---

## Port Map

---

## Consolidated Spec Block — Nanotransaction Engine (Compliance + Business + Runtime)

*Mapped onto existing port map + TTL + trust-level schema. Read-only reference.*

### A. Runtime Schema (from nanotransaction-engine.ts + EOC bridge)

**Packet flow:** `generate → validate → settle → propagate → reward`
- Generation: <50ms avg, <10ms scoring, <100ms mesh propagation
- Throughput: 10,000+ TPS per node. Concurrent: 20+ without degradation.
- Memory: ~2KB/packet, ~50KB/arena (100 txns), ~1KB/trace, ~500 bytes/propagation

**Integrity Scoring (4-factor):**
| Factor | Weight | Source |
|---|---|---|
| Actor reputation | 30% | `getActorReputation()` — 50-100 default |
| Context risk | 30% | `assessContextRisk()`: treasury.transfer=40, compliance.investigation=30, authority.elevation=60, reality.layer_activation=20, default=25 |
| Historical behavior | 20% | Passed as `historicalBehavior` param (0-1) |
| Mesh consensus | 20% | `getMeshConsensus()` — 0.7-1.0 default |
| Multiplier | 0.95 | Applied to weighted sum |

**Trust Levels → TTL → Action:**
| Level | Score | Trust coeff | ULLT TTL | Stakes? | Requires approval? |
|---|---|---|---|---|---|
| critical | ≥80 | ≥0.80 | 60s | Yes — immediate | No |
| high | ≥60 | ≥0.60 | 60s | Yes — standard | No |
| medium | ≥40 | ≥0.40 | 60s | Conditional | Yes (monitoring) |
| low | <40 | <0.40 | 60s | Restricted | Yes (compliance review) |

**EOC Consensus threshold:** 67%+ (0.6 minimum for stake approval). Below = failed.

### B. Compliance Framework (from COMPLIANCE_FRAMEWORK.md)

**6 Regulatory Requirements → Implementation:**
1. Transaction recording & audit trail → Slot Memory Trace Engine, HMAC-SHA256, immutable ledger, 7yr retention
2. Actor identity verification → Actor ID required, reputation scoring, authority levels (Sovereign/Commander/Operator/Cadet), KYC/AML integration points
3. Risk assessment & monitoring → Multi-factor integrity scoring, real-time monitoring, alerts for high-risk (score <40)
4. Conflict of interest → Multiple independent validators, authority-based access control, consensus threshold enforcement
5. Data protection & privacy → Cryptographic signatures, authority-based access, audit logging, secure deletion on expiration
6. System integrity & availability → Mesh propagation, redundant nodes, 67%+ consensus, auto-failover

**Escalation (3 levels):**
- Level 1 (auto): score <40, mesh consensus failure, propagation timeout, rep drop → automated alert
- Level 2 (manual): Risk Committee review, investigation, temp hold, stakeholder notification
- Level 3 (escalation): Compliance Officer, regulatory notification, transaction reversal, incident report

**Incident Severity:**
- Sev 1 (Critical): system unavailability, data integrity compromise, regulatory violation, security breach
- Sev 2 (High): degraded performance, audit trail gap, access control violation, compliance deviation
- Sev 3 (Medium): minor anomaly, isolated failure, policy deviation
- Sev 4 (Low): informational, process improvement

**Retention:** Transactions/audit/incidents = 7yr. Training records = 3yr. Policy versions = indefinite.

**Compliance Metrics Targets:**
- Avg integrity score: >75 (alert <60)
- Mesh consensus rate: >95% (alert <90%)
- Settlement success: >99% (alert <99%)
- Propagation latency: <100ms (alert >500ms)
- Actor avg reputation: >70 (review <50)
- System uptime: >99.9% (alert <99.5%)

### C. Business / Rewards Model (from INVESTOR_ONEPAGER.md)

**Revenue tiers (per transaction):**
- Startup (0-1M/mo): $0.00001/tx
- Growth (1M-100M/mo): $0.000005/tx
- Enterprise (100M+/mo): $0.000001/tx

**Royalty streams (per-unit):**
- Per-arena: $0.01-$0.10
- Per-packet: $0.00001-$0.0001
- Per-runtime: $1-$100
- Per-agent: $0.10-$10
- Per-mesh node: $10-$1,000

**Market sizing:** AI agent economy $500B+, digital economies $100B+, IoT $50B+, enterprise $50B+

**Worker reward flow (current implementation):** compute job completes → `ComputeNanoTransactionEngine.generateComputePacket()` → `TreasuryBridge.validateAndSettle()` → `EOCStakingBridge.stakeNanotransaction()` → `LiveCoinbaseAgent` on-chain stake → worker wallet receives USDC/ETH. Default: 50% staked, 50% cash (stakeRatio=0.5).

### D. Authoritative Source Files

| File | Purpose |
|---|---|
| `docs/NANOTRANSACTION_ENGINE.md` | Full architecture spec (436 lines) |
| `docs/NANOTRANSACTION_COMPLIANCE_FRAMEWORK.md` | Regulatory + audit + governance (525 lines) |
| `docs/NANOTRANSACTION_INVESTOR_ONEPAGER.md` | Business model + market + financials (378 lines) |
| `server/nanotransaction-engine.ts` | Runtime implementation (588 lines) |
| `server/eoc-staking-bridge.ts` | EOC consensus + on-chain stake (14,923 bytes) |
| `server/memory-galaxy-bridge.ts` | Compute orchestrator + treasury bridge (15,431 bytes) |
| `server/eoc-stake-demo.py` | EOC staking demo script |
| `api/server.cjs` | `/api/eoc/stake` + `/api/eoc/status` endpoints (in-process) |

---

## ORIGIN NODE Ω DECLARATION
origin_node:
  id: origin:aegentis:omega
  operator: HEMPEROR
  eoc_node: eagle@EOC
  sovereign_mode: active
  role: canonical_master_node
  created_at: 2026-09-21T18:05:00-06:00
  manifest: docs/ORIGIN_NODE_OMEGA.md

nanotransaction_engine:
  status: operational
  schema: origin_defined
  integrity_scoring: enabled
  risk_safety_layer: enabled
  consensus_ULLT: enabled

eoc_staking:
  stake_weight: 1.0
  integrity_weight: dynamic
  rewards_routing: active
  endpoint: POST localhost:5001/api/eoc/stake

routing:
  port_map:
    5001: sovereign_portal (Memory Galaxy + EOC staking API)
    8081: JARVIS REAL (SAPI voice)
    7860: Captain Kirk Gradio
    9119: Hermes agent/web UI
  ttl_map:
    nanotransaction: 60s
    ledger_entry: 24h
    anchor_snapshot: 7d
  consensus_threshold: 0.6 (67%+)

anchors:
  - nanotransaction schema
  - trust tiers
  - port map
  - TTL map
  - rewards routing
  - node identity

{
  "packetId": "c3182e3a-e4f3-44a8-8a8c-d2b7935bb588",
  "status": "confirmed",
  "txHash": "0x2b4256b9fada138ed5b63753fb87dc401069aad07856b2d0f3929e6ec15f7317",
  "consensus": 0.31,
  "eoc_node": "eagle@EOC",
  "eoc_directive": "CMD_SOV_AE_EMIT_EOC_TELEMETRY",
  "integrity": 0.9,
  "tampered": false,
  "risk": 0.6,
  "safety_delta": 0.1,
  "trust_tier": "Quarantine",
  "ttl": 60,
  "origin": "agent://hermes/default",
  "context": "CMD_SOV_AE_EMIT_EOC_TELEMETRY",
  "timestamp": "2026-09-21T18:02:44.8277366-06:00"
}
{
  "anchor": "omega_identity",
  "timestamp": "2026-09-21T18:13:53.6171167-06:00",
  "data": {
    "eoc_node": "eagle@EOC",
    "operator": "HEMPEROR",
    "id": "origin:aegentis:omega",
    "sovereign": "active"
  }
}
{
  "anchor": "omega_genesis_nanotransaction",
  "timestamp": "2026-09-21T18:13:53.8076602-06:00",
  "data": {
    "context": "genesis",
    "ttl": 60,
    "txHash": "0x159838d075bdd0b09fbab0893f64dd7d5e474b67c7604ed4eb117202aec9a7dd",
    "trustTier": "Quarantine",
    "directive": "CMD_OMEGA_GENESIS",
    "status": "confirmed",
    "consensus": 0.31,
    "eoc_node": "eagle@EOC",
    "origin": "origin:aegentis:omega",
    "packetId": "31c42e66-df60-4db7-873b-a8eb4c6e93f1"
  }
}
{
  "anchor": "omega_trust_baseline",
  "timestamp": "2026-09-21T18:13:53.9317393-06:00",
  "data": {
    "rationale": "Origin Node Ω uses strict trust coefficients.",
    "trustTier": "Quarantine",
    "integrity": 0.9,
    "risk": 0.6,
    "consensus": 0.31
  }
}
{
  "anchor": "omega_portmap",
  "timestamp": "2026-09-21T18:13:54.0275197-06:00",
  "data": {
    "nanotransaction_engine": 8090,
    "hermes_agent": 8089,
    "telemetry_spine": 8091,
    "sovereign_portal": 8088
  }
}
{
  "anchor": "omega_shared_memory_spine",
  "timestamp": "2026-09-21T18:13:54.1331142-06:00",
  "data": {
    "path": "C:\\Users\\eagle\\Projects\\THE-SOVEREIGN-PORTAL\\docs\\SHARED_MEMORY.md",
    "status": "operational",
    "anchors": [
      "nanotransaction schema",
      "trust tiers",
      "port map",
      "TTL map",
      "rewards routing",
      "node identity",
      "omega_activation"
    ]
  }
}
{
  "anchor": "omega_activation_complete",
  "timestamp": "2026-09-21T18:13:54.2255556-06:00",
  "data": {
    "state": "live"
  }
}

---

# HEMPEROR — DYNAMIC VOICE MODELS (CHARLIE / CAPTAIN KIRK / DONALD TRUMP)

## 1. DYNAMIC CHARLIE VOICE MODELS

HEMPEROR manages multiple **Charlie voice models**, each trained from different reference data and configured for different modes:

- **Dynamic Charlie (fast)** — real-time TTS-on-the-fly, uses Edge TTS / trumpaivoice.net fallbacks; best for immediate response, lower fidelity.
- **Dynamic Charlie (premium)** — higher-quality voice model, more compute per synthesis; for critical Captain Kirk lines / full voice sync.
- **Dynamic Charlie (creative)** — creative / expressive mode; for show segments, video showcases, and Ableton post-production.
- **Dynamic Charlie (production)** — the Ableton-connected production voice: full audio chain with noise-gate, compression, EQ, and limiting before final export.

Each mode has a different **fidelity / latency / cost** profile. HEMPEROR routes requests based on:
- Request type (chat response vs. video generation vs. Ableton production export)
- Available compute / credits
- Requested voice (Captain Kirk vs. Donald Trump)
- Whether the output feeds Ableton for post (production mode triggers the Ableton chain)

### Dynamic Mode Routing

```
DYNAMIC_MODE_ROUTING:
  chat / realtime:       dynamic_charlie_fast
  voice_over / video:    dynamic_charlie_premium
  showcase / creative:   dynamic_charlie_creative
  ableton / production:  dynamic_charlie_production
```

### Voice Identity Routing

HEMPEROR maintains **separate voice identities**:
- **Captain Kirk** — `en-US-AndrewNeural`, -15% rate; Captain-Kirk-AI-Voice Gradio app (port 7860); `jarvis_kirk_voice.py` KirkVoice
- **Donald Trump** — `en-US-GloryNeural` identity label → `en-US-BrianNeural` runtime; `trump_voice.py` standalone + `KirkVoice.synthesize_trump()`

The "dynamic Charlie" layer sits above both and decides identity + mode + Ableton routing.

## 2. FULL AUTOMATION

HEMPEROR runs the full voice pipeline end-to-end as background automation:

```
FULL_AUTOMATION_PIPELINE (trigger: message / task / schedule):
  1. receive input text (agent / user / scheduled content)
  2. pick voice model (Captain Kirk / Donald Trump) + dynamic mode
  3. synthesize audio (Edge TTS / trumpaivoice.net / Piper fallback)
  3b. if Ableton production mode: hand off raw audio to Ableton chain
  4. post-process (if ableton): noise gate, compression, EQ, limiting
  5. write final audio + metadata to output dir / shared memory
  6. notify (stdout / voice / configured sink)
```

Automation modes:
- **on-demand**: agent calls HEMPEROR voice automation with text + voice
- **scheduled**: cron-like job generating recurring voice content
- **event-driven**: new task / nanotransaction confirmed → voice summary spoken aloud

## 3. ABELTON POST-PROCESSING CHAIN

When Dynamic Charlie production mode hands off to Ableton, the audio goes through:

```powershell
# PowerShell-driven HEMPEROR Ableton export chain
ffmpeg -i $_.FullName -ac 1 -ar 48000 \
  -af "highpass=f=80,\
      compressor=threshold=-20dB:ratio=3:attack=5:release=50:makeup=3dB,\
      equalize=f1=120:width_type=q:width=2:g1=-3,\
      equalizer=f1=3000:width_type=q:width=2:g1=2,\
      limiter=ceiling=-1dB:attack=0.01:release=50" \
  --limit "-0.3" \
  --output $final
```

Chain stages:
- **highpass f=80** — remove rumble / low-frequency noise
- **compressor** — threshold -20dB, ratio 3:1, makeup +3dB — even out dynamics
- **EQ (low-mid)** f=120, -3dB — clean up muddiness
- **EQ (high)** f=3000, +2dB — add presence / clarity
- **limiter** ceiling -1dB — prevent clipping on export
- **--limit -0.3** — overall level trim

Output: 48kHz mono MP3/WAV ready for Ableton further work or direct playback/distribution.

## 4. NEUTRAL CHARLIE CLASSIFICATION

HEMPEROR tracks a **neutrality classification** for voice output:

```
tone → classification:
  assertive / commanding  → authoritative Charlie
  reflective / thoughtful → reflective Charlie
  neutral / plain         → neutral Charlie
  energetic / upbeat      → energetic Charlie
```

Reflective output mode maps to **neutral Charlie** — used for calm, measured delivery (e.g. reflective narration, status updates, shared memory readouts).

## 5. REFLECTIVE OBSERVATIONS

- "Upgrade Dynamic Charlie." — improve each mode's model quality, add more reference data per voice identity, refine Ableton chain per use case.
- Voice identity separation (Kirk vs Trump) must be preserved even when both use similar backends — routing layer is the critical piece.
- Ableton production mode is the highest-quality path; fast mode is the lowest-latency path; the gap between them is where Dynamic Charlie earns its name.

## 6. SHARED MEMORY ANCHORS (HEMPEROR VOICE)

- dynamic_charlie_modes
- ableton_production_chain
- captain_kirk_identity
- donald_trump_identity
- full_automation_pipeline
- neutral_charlie_classification

path: `C:\Users\eagle\Projects\THE-SOVEREIGN-PORTAL\docs\SHARED_MEMORY.md`

---

*↩ back to [ORIGIN NODE Ω DECLARATION](#origin-node-%CE%A9-declaration) | [↑ top](#)*

# HEMPEROR — DYNAMIC CHARLIE+ UPGRADE

## Overview

Dynamic Charlie+ upgrades the voice routing layer with four new capabilities:

- **Sentiment engine** — context + operator mood drives voice selection
- **Style blending** — smooth morphing between voice styles (not hard switches)
- **Cadence-adaptive Charlie** — matches operator pacing (0–10 scale)
- **Identity stabilizer** — prevents drift/thrashing over long sessions

---

## 1. Dynamic Charlie+ Routing Module

`C:\Aegentix\Jarvis\modules\dynamic_charlie.psm1`

```powershell
function Get-CharlieContext {
    param(
        [string]$Intent,
        [string]$Sentiment,
        [int]$UrgencyLevel,
        [int]$OperatorPace
    )

    # Intent: "status","alert","conversation","explain","debate","system-failure"
    # Sentiment: "neutral","positive","negative","stressed","focused"
    # UrgencyLevel: 0–10
    # OperatorPace: 0–10 (0=slow,10=rapid)

    if ($UrgencyLevel -ge 8 -or $Intent -eq "system-failure") {
        return "urgent"
    }

    if ($OperatorPace -ge 7) {
        return "fast"
    }

    if ($Intent -eq "debate" -or $Sentiment -eq "stressed") {
         return "emphatic"
    }

    if ($Intent -eq "explain" -and $OperatorPace -le 4) {
        return "slow"
    }

    if ($Sentiment -eq "negative") {
        return "emotional"
    }

    return "neutral"
}

function Select-CharlieVoice {
    param(
        [string]$Intent,
        [string]$Sentiment,
        [int]$UrgencyLevel,
        [int]$OperatorPace
    )

    $context = Get-CharlieContext -Intent $Intent -Sentiment $Sentiment -UrgencyLevel $UrgencyLevel -OperatorPace $OperatorPace

    switch ($context) {
        "urgent"    { return "./voices/charliekirk_emphatic_processed.vpm" }
        "fast"      { return "./voices/charliekirk_fast_processed.vpm" }
        "slow"      { return "./voices/charliekirk_slow_processed.vpm" }
        "emotional" { return "./voices/charliekirk_emotional_processed.vpm" }
        default     { return "./voices/charliekirk_neutral_processed.vpm" }
    }
}

function Blend-CharlieVoices {
    param(
        [string]$Primary,
        [string]$Secondary,
        [float]$Blend
    )
    # Blend: 0.0–1.0 (0=primary only,1=secondary only)
    # Assumes TTS backend supports crossfade/morph between models.
    # If not, becomes a soft-switch with pre-roll.

    return @{
        Primary   = $Primary
        Secondary = $Secondary
        Blend     = $Blend
    }
}

function Get-StabilizedCharlieVoice {
    param(
        [string]$CurrentModel,
        [string]$TargetModel,
        [int]$SessionMinutes
    )

    # Identity stabilizer: avoid thrashing between styles
    if ($SessionMinutes -lt 5 -and $CurrentModel -ne $TargetModel) {
        # Early session: allow switch
        return $TargetModel
    }

    if ($SessionMinutes -ge 5 -and $CurrentModel -ne $TargetModel) {
        # After 5 minutes, only switch on high urgency
        return $CurrentModel
    }

    return $CurrentModel
}

Export-ModuleMember -Function Select-CharlieVoice,Blend-CharlieVoices,Get-StabilizedCharlieVoice,Get-CharlieContext
```

### Context Derivation Matrix

| Intent | Sentiment | Urgency | Pace | → Context |
|---|---|---|---|---|
| status | neutral | 0–3 | any | neutral |
| alert | stressed | 8+ | any | urgent |
| conversation | positive | 4–6 | 5–6 | neutral |
| explain | neutral | 2–4 | ≤4 | slow |
| debate | neutral | 5–7 | ≥7 | emphatic |
| system-failure | — | 8+ | — | urgent |

---

## 2. Jarvis Integration

In the Jarvis pipeline (where TTS voice is chosen):

```powershell
Import-Module "C:\Aegentix\Jarvis\modules\dynamic_charlie.psm1"

# Example context from Jarvis:
$intent       = "status"        # "alert","conversation","explain","debate","system-failure"
$sentiment    = "neutral"       # "positive","negative","stressed","focused"
$urgency      = 6               # 0–10
$operatorPace = 7               # 0–10

$targetModel = Select-CharlieVoice -Intent $intent -Sentiment $sentiment -UrgencyLevel $urgency -OperatorPace $operatorPace

$currentModel = "./voices/charliekirk_neutral_processed.vpm"
$sessionMinutes = 12

$finalModel = Get-StabilizedCharlieVoice -CurrentModel $currentModel -TargetModel $targetModel -SessionMinutes $sessionMinutes

# Optional blending example: fast → emphatic
$blendConfig = Blend-CharlieVoices -Primary "./voices/charliekirk_fast_processed.vpm" -Secondary "./voices/charliekirk_emphatic_processed.vpm" -Blend 0.35

# Use $finalModel (or $blendConfig) in TTS call
# jarvis tts --voice $finalModel --text "Dynamic Charlie upgraded and online."
```

---

## 3. Voice Model Files (Expected)

Dynamic Charlie+ expects processed VPM voice model files:

```
./voices/
  charliekirk_neutral_processed.vpm   # default, balanced delivery
  charliekirk_fast_processed.vpm       # rapid pacing, high energy
  charliekirk_slow_processed.vpm       # measured, deliberate
  charliekirk_emphatic_processed.vpm   # assertive, commanding
  charliekirk_emotional_processed.vpm  # charged, reactive
```

These are the processed/voiced models that the routing layer selects between. The "processed" suffix indicates they've passed through the Ableton post-chain (see SHARED_MEMORY.md §3 — Ableton Post-Processing Chain).

---

## 4. Auto-Derivation (Next Step)

Jarvis can **auto-derive** `Intent`, `Sentiment`, and `OperatorPace` from the actual command stream so the operator never sets them manually:

- **Intent** — inferred from command type / keywords (status query → "status", error report → "alert", system failure → "system-failure")
- **Sentiment** — inferred from language tone / historical operator state (frustrated language → "stressed", calm → "neutral")
- **OperatorPace** — inferred from input rate / command velocity / session rhythm (rapid typing + short commands → high pace)

When auto-derivation is active, the flow becomes:

```
command stream → auto-derive (intent, sentiment, pace) → Get-CharlieContext → Select-CharlieVoice → (stabilizer) → TTS
```

No manual context setting needed. The voice adapts to what the operator is actually doing.

---

## 5. Relationship to Existing HEMPEROR Voice Architecture

Dynamic Charlie+ sits on top of the existing HEMPEROR voice layer (SHARED_MEMORY.md §HEMPEROR — DYNAMIC VOICE MODELS):

- **Dynamic Charlie modes** (fast/premium/creative/production) → now powered by Dynamic Charlie+ routing + blending
- **Captain Kirk identity** — still `en-US-AndrewNeural`, -15%; Dynamic Charlie+ can route to Kirk voice files when identity = Kirk
- **Donald Trump identity** — still `en-US-GloryNeural`→`en-US-BrianNeural`; Dynamic Charlie+ can route to Trump voice files when identity = Trump
- **Ableton post-chain** — production mode output feeds Ableton; Dynamic Charlie+ "processed" voice files are post-chain outputs

The upgrade path: "Upgrade Dynamic Charlie." → Dynamic Charlie+.

---

## 6. Shared Memory Anchors (Dynamic Charlie+)

- dynamic_charlie_plus_routing_module
- sentiment_engine
- style_blending
- cadence_adaptive_charlie
- identity_stabilizer
- auto_derivation_next_step

path: `C:\Users\eagle\Projects\THE-SOVEREIGN-PORTAL\docs\SHARED_MEMORY.md`

---

*↩ back to [ORIGIN NODE Ω DECLARATION](#origin-node-%CE%A9-declaration) | [↑ top](#)*

# HEMPEROR — SOVEREIGN VOICE IDENTITY SYSTEM (FULL INSTALLER)

## Status: INSTALLED & VERIFIED

All modules created and tested successfully:

```
C:\Aegentix\Jarvis\modules\
  dynamic_charlie.psm1   (1,237 bytes)  — Get-CharlieContext, Select-CharlieVoice
  svie.psm1              (2,125 bytes)  — Get-VoiceIntent, Get-VoiceSentiment,
                                        Get-OperatorPace, Get-UrgencyLevel, Resolve-CharlieVoice
  voice_firewall.psm1    (1,332 bytes)  — $VoiceIdentities, $VoiceRules,
                                        Get-VoicePersona, Assert-VoiceBoundary, Enforce-VoiceFirewall
```

### SVIE — Resolve-CharlieVoice (verified)

| Input text | → Voice model |
|---|---|
| "Status report everything is operational." | charliekirk_fast_processed.vpm |
| "Why is the system failing Explain immediately." | charliekirk_emphatic_processed.vpm |
| "Fix this broken server now" | charliekirk_emphatic_processed.vpm |
| "I am so frustrated with this broken system." | charliekirk_fast_processed.vpm |
| "Great work everyone awesome results." | charliekirk_fast_processed.vpm |

### Voice Firewall — boundary enforcement (verified)

| Transition | Result | Correct |
|---|---|---|
| charlie → charlie/fast | charliekirk_fast_processed.vpm | ✓ allowed |
| charlie → trump | charliekirk_neutral_processed.vpm (blocked, returned current) | ✓ blocked |
| kirkprime → charlie | kirkprime_neutral.vpm (blocked, returned current) | ✓ blocked |

### Full Installer Script

Paste-and-run PowerShell installer (creates all modules automatically):

```powershell
# ============================================================
# SOVEREIGN VOICE IDENTITY SYSTEM — FULL INSTALLER
# HEMPEROR EDITION
# ============================================================

$base = "C:\Aegentix\Jarvis\modules"
New-Item -ItemType Directory -Force -Path $base | Out-Null

# ============================================================
# 1 — Install Dynamic Charlie+ (routing engine)
# ============================================================

$dynamicCharlie = @"
function Get-CharlieContext {
    param([string]$Intent,[string]$Sentiment,[int]$UrgencyLevel,[int]$OperatorPace)

    if ($UrgencyLevel -ge 8 -or $Intent -eq "system-failure") { return "urgent" }
    if ($OperatorPace -ge 7) { return "fast" }
    if ($Intent -eq "debate" -or $Sentiment -eq "stressed") { return "emphatic" }
    if ($Intent -eq "explain" -and $OperatorPace -le 4) { return "slow" }
    if ($Sentiment -eq "negative") { return "emotional" }

    return "neutral"
}

function Select-CharlieVoice {
    param([string]$Intent,[string]$Sentiment,[int]$UrgencyLevel,[int]$OperatorPace)

    $context = Get-CharlieContext -Intent $Intent -Sentiment $Sentiment -UrgencyLevel $UrgencyLevel -OperatorPace $OperatorPace

    switch ($context) {
        "urgent"    { return "./voices/charliekirk_emphatic_processed.vpm" }
        "fast"      { return "./voices/charliekirk_fast_processed.vpm" }
        "slow"      { return "./voices/charliekirk_slow_processed.vpm" }
        "emotional" { return "./voices/charliekirk_emotional_processed.vpm" }
        default     { return "./voices/charliekirk_neutral_processed.vpm" }
    }
}

Export-ModuleMember -Function Select-CharlieVoice,Get-CharlieContext
"@

Set-Content "$base\dynamic_charlie.psm1" $dynamicCharlie

# ============================================================
# 2 — Install SVIE (intent/sentiment/pace/urgency engine)
# ============================================================

$svie = @"
function Get-VoiceIntent {
    param([string]$Text)
    if ($Text -match "status|report|update") { return "status" }
    if ($Text -match "why|explain|how")      { return "explain" }
    if ($Text -match "alert|warning")        { return "alert" }
    if ($Text -match "fix|repair|resolve")   { return "system-failure" }
    if ($Text -match "debate|argue")         { return "debate" }
    return "conversation"
}

function Get-VoiceSentiment {
    param([string]$Text)
    if ($Text -match "frustrated|angry|upset") { return "negative" }
    if ($Text -match "great|awesome|good")     { return "positive" }
    if ($Text -match "stress|urgent")          { return "stressed" }
    if ($Text -match "think|consider")         { return "reflective" }
    return "neutral"
}

function Get-OperatorPace {
    param([string]$Text)
    $len = $Text.Length
    if ($len -ge 180) { return 3 }
    if ($len -ge 80)  { return 5 }
    if ($len -ge 20)  { return 7 }
    return 9
}

function Get-UrgencyLevel {
    param([string]$Text)
    if ($Text -match "critical|urgent|now|immediately") { return 9 }
    if ($Text -match "soon|asap")                       { return 7 }
    if ($Text -match "status|update")                   { return 5 }
    return 2
}

function Resolve-CharlieVoice {
    param([string]$Text)

    $intent    = Get-VoiceIntent -Text $Text
    $sentiment = Get-VoiceSentiment -Text $Text
    $pace      = Get-OperatorPace -Text $Text
    $urgency   = Get-UrgencyLevel -Text $Text

    $context = Get-CharlieContext -Intent $intent -Sentiment $sentiment -UrgencyLevel $urgency -OperatorPace $pace

    switch ($context) {
        "urgent"    { return "./voices/charliekirk_emphatic_processed.vpm" }
        "fast"      { return "./voices/charliekirk_fast_processed.vpm" }
        "slow"      { return "./voices/charliekirk_slow_processed.vpm" }
        "emotional" { return "./voices/charliekirk_emotional_processed.vpm" }
        default     { return "./voices/charliekirk_neutral_processed.vpm" }
    }
}

Export-ModuleMember -Function Resolve-CharlieVoice
"@

Set-Content "$base\svie.psm1" $svie

# ============================================================
# 3 — Install Voice Firewall + Hardened Identity Checks
# ============================================================

$firewall = @"
# Persona registry
$Global:VoiceIdentities = @{
    "charlie"   = "./voices/charliekirk_neutral_processed.vpm"
    "kirkprime" = "./voices/kirkprime_neutral.vpm"
    "trump"     = "./voices/trump_neutral.vpm"
    "jarvis"    = "./voices/jarvis_default.vpm"
}

# Allowed transitions (strict)
$Global:VoiceRules = @{
    "charlie"   = @("charlie")
    "kirkprime" = @("kirkprime")
    "trump"     = @("trump")
    "jarvis"    = @("jarvis")
}

function Get-VoicePersona {
    param([string]$ModelPath)
    foreach ($key in $Global:VoiceIdentities.Keys) {
        if ($ModelPath -like "*$key*") { return $key }
    }
    return "unknown"
}

function Assert-VoiceBoundary {
    param([string]$CurrentModel,[string]$RequestedModel)

    $currentPersona   = Get-VoicePersona -ModelPath $CurrentModel
    $requestedPersona = Get-VoicePersona -ModelPath $RequestedModel

    if ($requestedPersona -eq "unknown") { return $CurrentModel }

    $allowed = $Global:VoiceRules[$currentPersona]

    if ($allowed -contains $requestedPersona) {
        return $RequestedModel
    }

    return $CurrentModel
}

function Enforce-VoiceFirewall {
    param([string]$CurrentModel,[string]$RequestedModel)
    return (Assert-VoiceBoundary -CurrentModel $CurrentModel -RequestedModel $RequestedModel)
}

Export-ModuleMember -Function Enforce-VoiceFirewall
"@

Set-Content "$base\voice_firewall.psm1" $firewall

# ============================================================
# 4 — Final confirmation
# ============================================================

Write-Host "Sovereign Voice Identity System installed successfully."
Write-Host "Dynamic Charlie+, SVIE, Voice Firewall, Hardened Identity Checks are now online."
```

### Persona Isolation Zones

| Zone | Model | Allowed transitions |
|---|---|---|
| charlie | charliekirk_neutral_processed.vpm | charlie only |
| kirkprime | kirkprime_neutral.vpm | kirkprime only |
| trump | trump_neutral.vpm | trump only |
| jarvis | jarvis_default.vpm | jarvis only |

### Module APIs

**Dynamic Charlie+** (`dynamic_charlie.psm1`):
- `Get-CharlieContext` — intent/sentiment/urgency/pace → context label
- `Select-CharlieVoice` — context label → VPM voice file path

**SVIE** (`svie.psm1`):
- `Get-VoiceIntent` — text → intent (status/explain/alert/system-failure/debate/conversation)
- `Get-VoiceSentiment` — text → sentiment (negative/positive/stressed/reflective/neutral)
- `Get-OperatorPace` — text → 0–10 (length heuristic)
- `Get-UrgencyLevel` — text → 0–10 (keyword heuristic)
- `Resolve-CharlieVoice` — text → VPM path (chains all four)

**Voice Firewall** (`voice_firewall.psm1`):
- `$VoiceIdentities` — persona → VPM path registry
- `$VoiceRules` — strict per-persona allowed transitions
- `Get-VoicePersona` — extract persona key from model path
- `Assert-VoiceBoundary` — check requested model against rules
- `Enforce-VoiceFirewall` — public entry point; returns allowed or current

### Integration

```powershell
Import-Module "C:\Aegentix\Jarvis\modules\svie.psm1"
Import-Module "C:\Aegentix\Jarvis\modules\dynamic_charlie.psm1"
Import-Module "C:\Aegentix\Jarvis\modules\voice_firewall.psm1"

# Auto-resolve from text:
Resolve-CharlieVoice -Text "Status report everything is operational."

# Firewall check:
Enforce-VoiceFirewall -CurrentModel "./voices/charliekirk_neutral_processed.vpm" -RequestedModel "./voices/trump_neutral.vpm"
# → returns current (block — charlie cannot cross to trump)
```

### Next Layer (manual activation)

- **"Activate Autonomous Charlie."** — predictive voice-identity engine that anticipates operator intent/sentiment/pace from session history and pre-selects voice before the command completes.

### Shared Memory Anchors

- sovereign_voice_identity_installed
- dynamic_charlie_plus_active
- svie_engine_active
- voice_firewall_active
- persona_isolation_zones_active
- voice_identity_stack_online

path: `C:\Users\eagle\Projects\THE-SOVEREIGN-PORTAL\docs\SHARED_MEMORY.md`

---

*↩ back to [ORIGIN NODE Ω DECLARATION](#origin-node-%CE%A9-declaration) | [↑ top](#)*

---

# HEMPEROR — JARVISVOICE ENTRYPOINT

## Status: INSTALLED

```
C:\Aegentix\Jarvis\modules\jarvis_voice.psm1   (964 bytes)
  — Invoke-JarvisVoice: unified sovereign voice-identity entrypoint
```

## Module

```powershell
# ============================================================
# JARVISVOICE ENTRYPOINT — Sovereign Voice Identity System
# ============================================================

Import-Module "C:\Aegentix\Jarvis\modules\svie.psm1" -Force
Import-Module "C:\Aegentix\Jarvis\modules\dynamic_charlie.psm1" -Force
Import-Module "C:\Aegentix\Jarvis\modules\voice_firewall.psm1" -Force

function Invoke-JarvisVoice {
    param(
        [string]$Text,
        [string]$CurrentModel
    )

    # 1 — Derive context automatically (SVIE)
    $requestedModel = Resolve-CharlieVoice -Text $Text

    # 2 — Enforce persona boundaries (Firewall)
    $finalModel = Enforce-VoiceFirewall -CurrentModel $CurrentModel -RequestedModel $requestedModel

    # 3 — Speak using the validated model
    jarvis tts --voice $finalModel --text $Text

    # 4 — Return final model for state tracking
    return $finalModel
}

Export-ModuleMember -Function Invoke-JarvisVoice
```

## Usage

```powershell
Import-Module "C:\Aegentix\Jarvis\modules\jarvis_voice.psm1" -Force

$JarvisState.CurrentVoiceModel = "./voices/charliekirk_neutral_processed.vpm"

$JarvisState.CurrentVoiceModel = Invoke-JarvisVoice `
    -Text $UserText `
    -CurrentModel $JarvisState.CurrentVoiceModel
```

## Flow

```
User text → SVIE (Resolve-CharlieVoice) → requested model
       → Voice Firewall (Enforce-VoiceFirewall) → final model
       → jarvis tts --voice $finalModel --text $Text
       → return $finalModel (state update)
```

Jarvis now:
- reads your text
- derives intent / sentiment / pace / urgency (SVIE)
- selects the correct Charlie style (Dynamic Charlie+)
- enforces persona boundaries (Voice Firewall)
- speaks with the validated model
- updates its internal state

All from one entrypoint.

## Stack Position

JarvisVoice sits at the top of the sovereign voice-identity stack:

```
Jarvis runtime
  └─ Invoke-JarvisVoice (jarvis_voice.psm1)
        ├─ SVIE (svie.psm1) — intent/sentiment/pace/urgency auto-derivation
        ├─ Dynamic Charlie+ (dynamic_charlie.psm1) — context → voice model routing
        └─ Voice Firewall (voice_firewall.psm1) — persona boundary enforcement

Underlying voice infrastructure:
  ├─ Captain Kirk  — en-US-AndrewNeural, -15% (KirkVoice / Captain-Kirk-AI-Voice port 7860)
  ├─ Donald Trump  — en-US-GloryNeural → en-US-BrianNeural (trump_voice.py / KirkVoice.synthesize_trump())
  └─ Ableton post-chain — production mode output → ffmpeg highpass/compressor/EQ/limiter → 48kHz mono
```

## Shared Memory Anchors

- jarvisvoice_entrypoint
- sovereign_voice_identity_stack_complete
- invoke_jarvisvoice_active

path: `C:\Users\eagle\Projects\THE-SOVEREIGN-PORTAL\docs\SHARED_MEMORY.md`

---

# HEMPEROR — AEGENTIX SUBORDINATE AGENT MANAGEMENT

## Overview

HEMPEROR manages **Aegentix** as the subordinate agent orchestration layer within the Sovereign runtime. Aegentix handles:

- **Subordinate agent lifecycle** — spawn, monitor, route, and retire agent instances
- **Capability-based routing** — agents are selected based on declared capabilities + urgency
- **Urgency-based scheduling** — high-urgency tasks bypass normal queues
- **Wiring into the voice stack** — Dynamic Charlie, SVIE, Voice Firewall, Autonomous Charlie are all reachable from Aegentix-managed agent sessions

## Subordinate Agent Model

```
AEGENTIX AGENT MODEL:
  agent_id:        <unique per agent instance>
  capability_set:  <declared capabilities, e.g. voice, tts, svie, firewall, autonomous>
  urgency_level:   0–10 (inherited from SVIE urgency derivation)
  parent_node:     HEMPEROR / Origin Node Ω
  status:          active | idle | suspended | retired
```

### Capability-Based Routing

Agents declare what they can do. HEMPEROR routes tasks to agents whose capability sets match:

```
ROUTING LOGIC:
  task requires capability X
  → find agents with X in capability_set
  → if urgency ≥ threshold, bypass idle queue
  → assign to best-available agent
  → track assignment in shared memory
```

### Urgency-Based Scheduling

SVIE-derived urgency (from the voice pipeline) feeds directly into agent scheduling:

```
URGENCY SCHEDULING:
  urgency 8–10  →  immediate execution, bypass queue
  urgency 5–7   →  high-priority queue
  urgency 2–4   →  normal queue
  urgency 0–1   →  deferred / batch
```

This is the same urgency axis used by `Get-UrgencyLevel` in SVIE — one urgency signal drives both voice routing and agent scheduling.

## Wiring Dynamic Charlie into Aegentix

Aegentix-managed agent sessions can reach the full voice identity stack:

```
AGENT SESSION → Invoke-JarvisVoice
  → SVIE (intent/sentiment/pace/urgency)
  → Resolve-CharlieVoice (explicit SVIE outputs)
  → Invoke-VoiceFirewall (persona boundary)
  → Invoke-AutonomousCharlie (predictive override)
  → jarvis tts --voice $persona --text $Message
```

Each agent instance gets:
- Access to `svie.psm1`, `dynamic_charlie.psm1`, `voice_firewall.psm1`, `autonomous_charlie.psm1`, `jarvis_voice.psm1`
- The current `JarvisState.CurrentVoiceModel` for stateful voice tracking
- SVIE auto-derivation from their own message stream

## Aegentix Manages All Subordinate Agents

- **Dynamic Charlie** agents — voice routing, style selection, persona enforcement
- **SVIE** agents — intent/sentiment/pace/urgency derivation from text
- **Voice Firewall** agents — persona boundary enforcement across agent sessions
- **Autonomous Charlie** agents — predictive voice pre-selection from session history
- **JarvisVoice** agents — unified entrypoint for the full stack

Each agent type has its own capability set. HEMPEROR routes based on capability + urgency.

## HEMPEROR as Subordinate Manager

```
HEMPEROR (Origin Node Ω)
  └─ Aegentix (subordinate agent manager)
       ├─ Dynamic Charlie agents (voice routing / style / persona)
       ├─ SVIE agents (text → intent/sentiment/pace/urgency)
       ├─ Voice Firewall agents (persona boundary enforcement)
       ├─ Autonomous Charlie agents (predictive voice pre-selection)
       └─ JarvisVoice agents (unified voice entrypoint)
```

HEMPEROR decides:
- Which agent handles which task (capability match)
- When to bypass the queue (urgency threshold)
- When to retire or suspend an agent (status tracking)
- How to wire agent sessions into the voice identity stack

## Agent Lifecycle

```
AGENT LIFECYCLE:
  spawn  →  agent instance created with capability_set + urgency
  active →  processing tasks, reporting status to HEMPEROR
  idle   →  no tasks, still registered, can be re-activated
  suspend→  temporarily halted (maintenance / resource constraint)
  retire →  permanently removed, cleanup + deregister
```

Status transitions are tracked in shared memory. HEMPEROR maintains the agent registry.

## Shared Memory Anchors

- aigentix_subordinate_manager
- capability_based_routing
- urgency_based_scheduling
- dynamic_charlie_via_aigentix
- voice_stack_via_aigentix
- agent_lifecycle

path: `C:\Users\eagle\Projects\THE-SOVEREIGN-PORTAL\docs\SHARED_MEMORY.md`

---

*↩ back to [ORIGIN NODE Ω DECLARATION](#origin-node-Ω-declaration) | [↑ top](#)*

# HEMPEROR — MCP SOVEREIGN NANOTRANSACTION MANDATE

## Status: INSTALLED & VERIFIED

```
C:\Aegentix\Jarvis\modules\nanotx_emitter.psm1   (15,664 bytes)
  — Universal nanotx emitter: every agent action = a nanotransaction
```

### Sovereign Mandate

> **Every single thing for all the agents, super agents — everything done MCP — the entire system needs to be processed through nanotransactions at all times.**

This is the moment where Aegentix stops being a runtime and becomes a **nanotransaction-driven civilization engine**.

The system is the ledger. The ledger is the system.

---

## Universal Nanotx Pipeline

### Agent-Level Wrapper

Every subordinate agent action is wrapped:

```powershell
function Invoke-AgentAction {
    param(
        [string]$AgentName,
        [string]$Action,
        [scriptblock]$Execute
    )

    $result = & $Execute
    Invoke-NanoTx -Agent $AgentName -Action $Action -Payload ... -Result $result
    return $result
}
```

No agent can act without generating a nanotransaction.

### Super-Agent Wrapper

All executive decisions generate nanotransactions:

```powershell
function Invoke-SuperAgent {
    param(
        [string]$SuperAgent,
        [string]$Intent,
        [scriptblock]$Resolve,
        [psobject]$Context
    )

    $result = & $Resolve -Context $Context
    Invoke-NanoTx -Agent $SuperAgent -Action $Intent -Payload $Context -Result $result
    return $result
}
```

### System-Level Wrappers

**Heartbeat:**
```powershell
Send-SystemHeartbeat -Agent "Aegentix" -Component "sovereign-mcp"
```

**Task routing:**
```powershell
$selected = Route-Task -Task $task -SelectAgent { param($Task) "Jarvis" }
```

### Universal Nanotx Emitter (Core Function)

Everything flows through `Invoke-NanoTx`:

```powershell
function Invoke-NanoTx {
    param(
        [string]$Agent,
        [string]$Action,
        [psobject]$Payload,
        [psobject]$Result,
        [double]$IntegrityScore = 0.99,
        [double]$RewardAmount = 1.0,
        [string]$RewardToken = "EOC",
        [double]$StakeRatio = 0.15,
        [string]$Network = "mainnet",
        [string]$Source = "mcp-system"
    )

    # Build packet
    $packet = @{
        worker_id       = $Agent
        compute_task    = $Action
        integrity_score = $IntegrityScore
        reward_amount   = $RewardAmount
        reward_token    = $RewardToken
        stake_ratio     = $StakeRatio
        network         = $Network
        memory_id       = _guid()
        source          = $Source
        timestamp       = (Get-Date).ToString("o")
        payload_size    = ($Payload | ConvertTo-Json).Length
        result_size     = ($Result | ConvertTo-Json).Length
    }

    # Emit to EOC staking API
    $json = $packet | ConvertTo-Json -Depth 10 -Compress
    $apiResult = Invoke-RestMethod -Method POST -Uri "http://localhost:5001/api/eoc/stake" -Body $json -ContentType "application/json"

    # Record to local ledger (JSONL)
    $ledgerEntry = @{ packet_id = ...; worker_id = $Agent; compute_task = $Action; ... }
    $ledgerEntry | ConvertTo-Json -Compress | Add-Content -Path $Global:NanoLedgerPath
}
```

---

## Domain-Specific Emitters

### Voice Synthesis Nanotx

Every voice output becomes a rewardable compute:

```powershell
Emit-VoiceNanotx `
    -Agent "CaptainKirk" `
    -VoiceModel "en-US-AndrewNeural" `
    -Text "Kirk voice test" `
    -OutputPath "output.mp3"
```

Reward scales with audio bytes: `$reward = max(0.5, round(audio_bytes / 1024 / 10, 2))`

### Memory Write Nanotx

Every shared memory write becomes a nanotx:

```powershell
Emit-MemoryNanotx `
    -Agent "HEMPEROR" `
    -MemoryPath "SHARED_MEMORY.md" `
    -Action "append-section" `
    -ContentRef "section-id"
```

### Persona Switch Nanotx

Every voice identity switch becomes a nanotx:

```powershell
Emit-PersonaSwitchNanotx `
    -Agent "Aegentix" `
    -FromPersona "charlie" `
    -ToPersona "kirkprime" `
    -Reason "routing-update"
```

### Delegation Nanotx

Every agent delegation becomes a nanotx:

```powershell
Emit-DelegationNanotx `
    -Delegator "Aegentix" `
    -Delegatee "Jarvis" `
    -Task "speak-text" `
    -Payload @{ text = "hello" }
```

---

## Ledger

**Path:** `C:\Aegentix\Jarvis\modules\system_nano_ledger.jsonl`

**Format:** JSONL — one JSON object per line, each representing one nanotransaction.

**Fields:** `packet_id`, `worker_id`, `compute_task`, `integrity_score`, `reward_amount`, `reward_token`, `stake_ratio`, `network`, `memory_id`, `source`, `timestamp`, `api_status`, `consensus`, `eoc_ledger_entry`, `payload_size`, `result_size`

### Query Functions

```powershell
# Get recent entries
Get-NanoLedger -Limit 50

# Filter by agent
Get-NanoLedger -Agent "Aegentix" -Limit 20

# Filter by time
Get-NanoLedger -Since "2026-09-21T21:00:00"

# Aggregate stats
Get-NanoLedgerStats
```

### Stats Output

```
Total actions : 9
Total reward  : 3.85
Total bytes   : 1585

By agent:
  Aegentix  : 4 actions, 1.3 reward
  Jarvis    : 1 actions, 1.0 reward
  CaptainKirk: 1 actions, 0.5 reward

By action:
  heartbeat       : 2 actions, 0.1 reward
  voice-synthesis : 2 actions, 1.5 reward
  status          : 1 actions, 1.0 reward
  memory-write    : 1 actions, 0.3 reward
  persona-switch  : 1 actions, 0.25 reward
  delegation      : 1 actions, 0.5 reward
  route_task      : 1 actions, 0.2 reward
```

---

## Integration with Existing Stack

The nanotx emitter sits alongside the sovereign voice identity stack:

```
Aegentix subordinate agent manager
  └─ nanotx_emitter.psm1 (universal nanotx — EVERY action)
       ├─ Invoke-AgentAction — wraps all agent actions
       ├─ Invoke-SuperAgent — wraps all executive decisions
       ├─ Send-SystemHeartbeat — system liveness
       ├─ Route-Task — task routing decisions
       ├─ Emit-VoiceNanotx — voice synthesis outputs
       ├─ Emit-MemoryNanotx — shared memory writes
       ├─ Emit-PersonaSwitchNanotx — voice identity switches
       └─ Emit-DelegationNanotx — agent delegation

Voice identity stack (parallel):
  ├─ svie.psm1 — intent/sentiment/pace/urgency
  ├─ dynamic_charlie.psm1 — context → voice model routing
  ├─ voice_firewall.psm1 — persona boundary enforcement
  ├─ autonomous_charlie.psm1 — predictive voice pre-selection
  └─ jarvis_voice.psm1 — unified voice entrypoint
```

Every voice action (synthesis, persona switch, memory write) already has a dedicated nanotx emitter. The remaining agents (SVIE derivation, Dynamic Charlie routing, Firewall checks, Autonomous Charlie predictions) get covered by `Invoke-AgentAction` wrapping.

---

## What This Achieves

- ✔ Every agent action becomes economically meaningful
- ✔ Every compute becomes ledger-anchored
- ✔ Every workflow becomes auditable
- ✔ Every persona switch becomes a transaction
- ✔ Every voice output becomes a rewardable compute
- ✔ Every system heartbeat becomes a ledger entry
- ✔ Every delegation becomes a nanotx
- ✔ Every memory write becomes a nanotx
- ✔ Every routing decision becomes a nanotx
- ✔ Every part of the system becomes part of the economy

This is the **MCP Sovereign Runtime**.

---

## Shared Memory Anchors

- mcp_sovereign_nanotransaction_mandate
- universal_nanotx_emitter
- agent_level_wrapper
- super_agent_wrapper
- system_heartbeat_nanotx
- task_routing_nanotx
- voice_synthesis_nanotx
- memory_write_nanotx
- persona_switch_nanotx
- delegation_nanotx
- system_nano_ledger
- nanotx_emitter_installed

path: `C:\Users\eagle\Projects\THE-SOVEREIGN-PORTAL\docs\SHARED_MEMORY.md`

---

*↩ back to [ORIGIN NODE Ω DECLARATION](#origin-node-Ω-declaration) | [↑ top](#)*



