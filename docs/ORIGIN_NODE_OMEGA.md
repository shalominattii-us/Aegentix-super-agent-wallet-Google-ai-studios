# ORIGIN NODE Ω (OMEGA)
# Sovereign Runtime – Canonical Master Node Manifest
# Node Identity: eagle@EOC

## 1. PURPOSE
The Origin Node Ω is the first sovereign node in the SOV.AE network.
It defines the canonical:
- nanotransaction schema
- EOC staking rules
- trust tiers
- routing policies
- TTL map
- port map
- economic model
- shared memory spine

All other nodes derive their behavior from Ω.

---

## 2. NODE IDENTITY
node_id: origin:aegentis:omega
display_name: ORIGIN NODE Ω
operator: HEMPEROR
machine_fingerprint: localhost-eagle-Windows
created_at: 2026-09-21T18:05:00-06:00

---

## 3. SOVEREIGN DOMAIN
domain: starship://flagship-alpha
jurisdiction: physical_ai.macro_agent
scope:
  - navigation
  - engineering
  - life_support
  - tactical
constraints:
  - must_preserve_crew_life
  - must_preserve_ship_integrity
  - must_obey_captain_override

---

## 4. NANOTRANSACTION SCHEMA
packet:
  fields:
    - packetId
    - txHash
    - origin
    - context
    - directive
    - status
    - consensus
    - trustTier
    - TTL
    - eoc_node
integrity:
  scoring:
    - correctness
    - reproducibility
    - policy_adherence
    - tamper_check
risk:
  coefficients:
    - environment
    - data_sensitivity
    - agent_reputation
    - route_volatility
safety:
  deltas:
    - positive
    - neutral
    - negative

---

## 5. TRUST & CONSENSUS
ULLT:
  tiers:
    - Platinum: ≥0.90
    - Gold: ≥0.85
    - Silver: ≥0.70
    - Bronze: ≥0.50
    - Quarantine: <0.50
consensus_algorithm: local_integrity × (1 - risk)

---

## 6. EOC STAKING
eoc_node: eagle@EOC
stake_weight: 1.0
integrity_weight: dynamic (consensus)
rewards:
  runtime: enabled
  safety: enabled
  OEM: enabled

---

## 7. ROUTING & PORT MAP
ports:
  - 5001: sovereign portal (Memory Galaxy + EOC staking API)
  - 8081: JARVIS REAL (SAPI voice)
  - 7860: Captain Kirk Gradio
  - 9119: Hermes agent/web UI
TTLs:
  - nanotransaction: 60s
  - ledger_entry: 24h
  - anchor_snapshot: 7d

---

## 8. SHARED MEMORY SPINE
path: C:/Users/eagle/Projects/THE-SOVEREIGN-PORTAL/docs/SHARED_MEMORY.md
anchors:
  - nanotransaction schema
  - trust tiers
  - port map
  - TTL map
  - rewards routing
  - EOC staking
  - node identity

---

## 9. VERSIONING
manifest_version: 1.0.0
last_updated: 2026-09-21T18:05:00-06:00
