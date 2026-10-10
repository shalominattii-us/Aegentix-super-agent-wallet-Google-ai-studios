# Backup Domains & Causal Structures

**Continuity-Oriented Operational Physics for Sovereign Runtime Preservation**

---

## Executive Summary

The Sovereign System Portal operates as a continuity-preserving infrastructure where identity, authority, causality, and operational legitimacy must survive failure, rollback, migration, federation drift, and deployment evolution. This document defines the causal domains that constitute sovereign continuity—not as storage artifacts, but as the essential structures that preserve the system's identity and operational integrity across all failure scenarios.

Rather than backing up machines or databases, we preserve continuity domains: distinct causal structures that, when reconstructed together in proper sequence, restore the system to a state where it remains the same sovereign entity.

---

## Part 1: The Continuity Model

### 1.1 Continuity as Primary Truth Layer

In traditional infrastructure, the primary truth is:

- Databases contain data
- Filesystems contain files
- Repositories contain code
- Deployments contain running processes

In continuity-oriented infrastructure, the primary truth is:

**Continuity is the substrate. Everything else is an embodiment of continuity.**

This means:

- A database is an embodiment of runtime continuity
- A repository is an embodiment of release continuity
- A deployment is an embodiment of operational continuity
- A federation node is an embodiment of distributed continuity

When we preserve continuity, we preserve the system's identity. When we lose continuity, we lose the system's legitimacy—even if we restore all data.

### 1.2 The Core Question

> "What exact continuity structures must survive for AEGENTIS to remain the same sovereign system after failure?"

This is the foundational question that drives all backup, recovery, and operational design.

The answer is not: "All the data."

The answer is: "All the causal domains that constitute sovereign identity."

---

## Part 2: The Five Continuity Domains

### 2.1 Runtime Continuity Domain

**Purpose**: Preserves the operational identity and causal history of the sovereign runtime.

**What It Preserves**:

| Structure | Purpose | Criticality |
|-----------|---------|------------|
| Continuity Ledgers | Immutable event log of all runtime decisions | Tier 0 |
| Snapshots | Point-in-time state representations | Tier 0 |
| Replay Metadata | Causality markers, ordering, dependencies | Tier 0 |
| Lifecycle State | Current runtime phase, initialization markers | Tier 1 |
| Manifest History | Universe identity, version lineage | Tier 0 |
| Causality Hashes | Cryptographic proof of causal ordering | Tier 0 |

**Invariant**: Universe identity survives reconstruction.

**What This Means**: After recovery, the system must be able to answer: "Am I the same Universe that existed before failure?" This is answered through manifest identity and causality hash verification.

**Example Preservation Scenario**:

```
Before Failure:
  Universe ID: 0x7f3a9c2e...
  Manifest Version: 42
  Last Causality Hash: 0xabcd1234...
  Event Log Position: 1,847,293

Failure Occurs
  (Process crash, hardware failure, network partition)

Recovery Process:
  1. Restore continuity ledger (all events)
  2. Verify causality hash chain
  3. Restore manifest to version 42
  4. Verify Universe ID matches
  5. Resume from event 1,847,294

After Recovery:
  Universe ID: 0x7f3a9c2e... ✓ SAME
  Manifest Version: 42 ✓ SAME
  Causality Chain: Verified ✓
  Event Log: Continuous ✓
```

**Backup Frequency**: Continuous (every event) for ledger, hourly for snapshots

**Retention**: Indefinite (7-year minimum for compliance)

---

### 2.2 Governance Continuity Domain

**Purpose**: Preserves the authority structure, policy decisions, and compliance state that govern runtime operations.

**What It Preserves**:

| Structure | Purpose | Criticality |
|-----------|---------|------------|
| Authority Grants | Role assignments, capability delegations | Tier 1 |
| Attestation Records | Signed proofs of authority legitimacy | Tier 1 |
| Compliance Rulings | Policy decisions, exception approvals | Tier 1 |
| Revocations | Authority removals, capability restrictions | Tier 1 |
| Operational Approvals | Release authorizations, deployment sanctions | Tier 1 |
| Policy Lineage | Historical policy evolution, change tracking | Tier 1 |

**Invariant**: Authority legitimacy survives rollback.

**What This Means**: After recovery, the system must be able to answer: "Are the same authorities still legitimate?" This is answered through attestation record verification and policy lineage reconstruction.

**Example Preservation Scenario**:

```
Before Failure:
  Sovereign Authority: alice@aegentis.io
    - Granted: 2026-01-15 by master-key
    - Attestation: 0xsig1234...
    - Capabilities: [deploy, approve-release, manage-federation]
  
  Commander Authority: bob@aegentis.io
    - Granted: 2026-02-01 by alice
    - Attestation: 0xsig5678...
    - Capabilities: [deploy, manage-nodes]

Failure Occurs
  (Authority database corrupted)

Recovery Process:
  1. Restore authority grant records
  2. Verify attestation signatures
  3. Reconstruct authority hierarchy
  4. Verify policy lineage
  5. Restore capability assignments

After Recovery:
  Sovereign Authority: alice@aegentis.io ✓ VERIFIED
    - Attestation: Valid ✓
    - Capabilities: Restored ✓
  Commander Authority: bob@aegentis.io ✓ VERIFIED
    - Attestation: Valid ✓
    - Capabilities: Restored ✓
```

**Backup Frequency**: On every authority change, daily full snapshot

**Retention**: Indefinite (compliance requirement)

---

### 2.3 Federation Continuity Domain

**Purpose**: Preserves the distributed trust relationships, consensus state, and replication watermarks that enable multi-node operation.

**What It Preserves**:

| Structure | Purpose | Criticality |
|-----------|---------|------------|
| Node Trust Graph | Peer relationships, trust scores | Tier 2 |
| Replication Watermarks | Replication progress per peer | Tier 2 |
| Consensus Checkpoints | Agreed-upon state across federation | Tier 0 |
| Authority Leases | Time-bound authority delegations | Tier 1 |
| Reconciliation State | Conflict resolution history | Tier 2 |
| Topology Lineage | Node join/leave history | Tier 2 |

**Invariant**: Distributed trust survives failover.

**What This Means**: After recovery, the system must be able to answer: "Can I rejoin the federation without creating split-brain or trust violations?" This is answered through replication watermark verification and consensus checkpoint validation.

**Example Preservation Scenario**:

```
Before Failure:
  Federation Nodes:
    - node-1 (primary): watermark=1,847,293
    - node-2 (replica): watermark=1,847,290
    - node-3 (replica): watermark=1,847,285
  
  Consensus Checkpoint: 1,847,280 (all nodes agreed)
  Last Topology Change: node-3 joined 2026-05-20

Failure Occurs
  (node-1 crashes, network partition)

Recovery Process:
  1. Restore replication watermarks
  2. Verify consensus checkpoint
  3. Determine safe recovery point (1,847,280)
  4. Restore federation trust graph
  5. Rejoin federation at watermark 1,847,280

After Recovery:
  node-1 rejoins at watermark: 1,847,280 ✓
  Federation detects: node-2 ahead by 10 events
  Replication resumes: 1,847,280 → 1,847,293 ✓
  Trust Graph: Verified ✓
```

**Backup Frequency**: Every consensus checkpoint, continuous watermark tracking

**Retention**: 30 days (sufficient for recovery window)

---

### 2.4 Release Continuity Domain

**Purpose**: Preserves the operational lineage, deployment history, and rollback legality that enable safe release management.

**What It Preserves**:

| Structure | Purpose | Criticality |
|-----------|---------|------------|
| Release Manifests | Version metadata, artifact signatures | Tier 1 |
| Artifact Signatures | Cryptographic proof of artifact authenticity | Tier 1 |
| Schema Compatibility Lineage | Version compatibility graph | Tier 1 |
| Deployment Attestations | Proof of deployment authorization | Tier 1 |
| Rollback Legality | Which versions can safely rollback to | Tier 1 |
| Migration History | Schema migration records, reversibility | Tier 1 |

**Invariant**: Operational lineage survives deployment cycles.

**What This Means**: After recovery, the system must be able to answer: "Which versions are safe to deploy to or rollback from?" This is answered through schema compatibility verification and deployment attestation validation.

**Example Preservation Scenario**:

```
Before Failure:
  Current Release: v2.1.0
    - Deployed: 2026-05-24 by alice
    - Attestation: 0xsig9999...
    - Schema Version: 42
  
  Previous Release: v2.0.0
    - Deployed: 2026-04-15 by bob
    - Schema Version: 41
    - Compatibility: v2.1.0 can rollback to v2.0.0 ✓
  
  Schema Migration: v41 → v42
    - Reversible: Yes
    - Rollback Script: migration-v42-to-v41.sql

Deployment Failure Occurs
  (v2.1.0 causes data corruption)

Recovery Process:
  1. Restore release manifest for v2.0.0
  2. Verify deployment attestation
  3. Check schema compatibility (v41 ← v42)
  4. Verify migration reversibility
  5. Execute rollback to v2.0.0

After Recovery:
  Current Release: v2.0.0 ✓
  Schema Version: 41 ✓
  Migration Reversed: v42 → v41 ✓
  Attestation: Valid ✓
```

**Backup Frequency**: On every release, continuous manifest tracking

**Retention**: Indefinite (operational history)

---

### 2.5 Embodiment Continuity Domain

**Purpose**: Preserves the XR/VR presence bindings, spatial state, and session continuity that enable immersive operations.

**What It Preserves**:

| Structure | Purpose | Criticality |
|-----------|---------|------------|
| Presence Bindings | User-to-runtime mappings | Tier 3 |
| Portal Mappings | Portal instance-to-node mappings | Tier 3 |
| Hologram State | Spatial object state, position, properties | Tier 3 |
| XR Session Continuity | Session tokens, authentication state | Tier 3 |
| Spatial Manifests | Spatial layout, coordinate systems | Tier 3 |

**Invariant**: Embodied traversal survives runtime interruption.

**What This Means**: After recovery, users should be able to resume their immersive experience without losing spatial context or session state. This is answered through presence binding verification and spatial manifest restoration.

**Example Preservation Scenario**:

```
Before Failure:
  User: commander@aegentis.io
    - Portal: portal-us-east-1
    - Session Token: 0xtoken1234...
    - Position: (100.5, 200.3, 50.1)
    - Hologram State: "briefing-room-active"
  
  Portal Instance: portal-us-east-1
    - Node: node-1
    - Spatial Manifest: briefing-room-v3
    - Active Holograms: 12

Runtime Failure Occurs
  (Portal process crashes)

Recovery Process:
  1. Restore presence binding
  2. Restore session token
  3. Restore spatial manifest
  4. Restore hologram state
  5. Restore user position

After Recovery:
  User reconnects: commander@aegentis.io
  Session resumes: 0xtoken1234... ✓
  Position restored: (100.5, 200.3, 50.1) ✓
  Hologram state: "briefing-room-active" ✓
  User experience: Seamless ✓
```

**Backup Frequency**: On every session change, every 5 minutes for active sessions

**Retention**: 7 days (sufficient for session recovery)

---

## Part 3: Cross-Domain Dependency Graphs

### 3.1 Domain Restoration Order

The five continuity domains are not independent. Certain domains must be restored before others to maintain causal integrity.

**Restoration Dependency Graph**:

```
Governance Domain (Authority Legitimacy)
    ↓
    ├→ Release Domain (Deployment Legality)
    │   ↓
    │   └→ Runtime Domain (Operational Identity)
    │       ↓
    │       └→ Federation Domain (Distributed Trust)
    │           ↓
    │           └→ Embodiment Domain (User Experience)
    │
    └→ Federation Domain (Direct)
        ↓
        └→ Embodiment Domain
```

**Why This Order?**

1. **Governance First**: Authority must be restored before any operational decision can be made. Without legitimate authority, all subsequent operations are invalid.

2. **Release Second**: Release lineage must be verified before runtime state is restored. This ensures we're deploying a legal version.

3. **Runtime Third**: Runtime identity and causality can now be safely restored, knowing that authority and release legality are established.

4. **Federation Fourth**: Federation trust can be reestablished once runtime identity is confirmed. Peers can verify that the rejoining node is legitimate.

5. **Embodiment Last**: User sessions and spatial state can be restored once the runtime is fully operational and federation is stable.

### 3.2 Dependency Violation Scenarios

**Scenario 1: Restoring Runtime Without Governance**

```
❌ INVALID RECOVERY:
  1. Restore runtime state
  2. Restore governance state

Problem:
  - Runtime may have executed invalid operations
  - Authority grants may contradict runtime decisions
  - Compliance violations may exist

✓ CORRECT RECOVERY:
  1. Restore governance state
  2. Verify authority legitimacy
  3. Restore runtime state
  4. Verify runtime decisions against governance
```

**Scenario 2: Restoring Federation Without Runtime**

```
❌ INVALID RECOVERY:
  1. Restore federation trust graph
  2. Restore runtime state

Problem:
  - Federation may accept node as legitimate
  - But runtime identity may not match
  - Creates split-brain or identity mismatch

✓ CORRECT RECOVERY:
  1. Restore runtime identity
  2. Verify causality hash
  3. Restore federation trust graph
  4. Verify federation accepts runtime identity
```

**Scenario 3: Restoring Embodiment Without Federation**

```
❌ INVALID RECOVERY:
  1. Restore user sessions
  2. Restore federation state

Problem:
  - User sessions may reference stale nodes
  - Portal mappings may be invalid
  - User experiences disconnection

✓ CORRECT RECOVERY:
  1. Restore federation state
  2. Verify node availability
  3. Restore portal mappings
  4. Restore user sessions
```

---

## Part 4: Continuity Criticality Levels

### 4.1 Criticality Tier Definition

Not all continuity structures are equally critical. The system defines six criticality tiers that determine backup frequency, replication priority, retention policies, recovery order, and integrity verification depth.

| Tier | Name | Characteristics | Examples | Backup Frequency | Retention |
|------|------|-----------------|----------|------------------|-----------|
| 0 | Causality-Critical | Loss causes identity loss | Ledgers, manifests, causality hashes | Continuous | Indefinite |
| 1 | Authority-Critical | Loss causes legitimacy loss | Authority grants, attestations, policies | Per-change | Indefinite |
| 2 | Federation-Critical | Loss causes trust loss | Node graph, watermarks, reconciliation | Per-checkpoint | 30 days |
| 3 | Operational-Critical | Loss causes availability loss | Lifecycle state, current config | Hourly | 90 days |
| 4 | Embodiment-Critical | Loss causes UX degradation | Session state, spatial manifests | Per-session | 7 days |
| 5 | Recoverable Cache | Loss causes temporary delay | Cached data, computed results | Daily | 1 day |

### 4.2 Criticality-Driven Backup Strategy

**Tier 0 (Causality-Critical)**:
- Backup: Every event (continuous)
- Replication: 3+ replicas, synchronous
- Verification: Cryptographic hash chain
- Recovery: Immediate, no data loss

**Tier 1 (Authority-Critical)**:
- Backup: On every change, daily full
- Replication: 2+ replicas, synchronous
- Verification: Signature verification
- Recovery: Within 1 hour

**Tier 2 (Federation-Critical)**:
- Backup: Per consensus checkpoint
- Replication: 2 replicas, asynchronous
- Verification: Watermark verification
- Recovery: Within 5 minutes

**Tier 3 (Operational-Critical)**:
- Backup: Hourly
- Replication: 1 replica
- Verification: Checksum verification
- Recovery: Within 30 minutes

**Tier 4 (Embodiment-Critical)**:
- Backup: Per session change
- Replication: 1 replica
- Verification: Session token verification
- Recovery: Within 5 minutes

**Tier 5 (Recoverable Cache)**:
- Backup: Daily
- Replication: None
- Verification: None
- Recovery: Recompute on demand

---

## Part 5: Continuity Verification

### 5.1 Pre-Recovery Verification

Before recovery begins, the system must verify that all continuity domains are restorable:

**Causality Verification**:
```
For each event in ledger:
  1. Verify event signature
  2. Verify causality hash
  3. Verify event ordering
  4. Verify no gaps in sequence
```

**Authority Verification**:
```
For each authority grant:
  1. Verify attestation signature
  2. Verify grantor authority
  3. Verify grant timestamp
  4. Verify no revocation
```

**Federation Verification**:
```
For each replication watermark:
  1. Verify watermark <= consensus checkpoint
  2. Verify no watermark regression
  3. Verify node trust score
```

**Release Verification**:
```
For each release manifest:
  1. Verify artifact signatures
  2. Verify schema compatibility
  3. Verify deployment attestation
  4. Verify rollback legality
```

**Embodiment Verification**:
```
For each session:
  1. Verify session token
  2. Verify spatial manifest
  3. Verify portal mapping
  4. Verify user binding
```

### 5.2 Post-Recovery Verification

After recovery, the system must verify that all domains are correctly restored:

**Identity Verification**:
```
Verify:
  - Universe ID matches pre-failure
  - Manifest version matches
  - Causality hash chain is continuous
  - No events lost
```

**Authority Verification**:
```
Verify:
  - Authority hierarchy is intact
  - All attestations are valid
  - No authority grants lost
  - Policy lineage is continuous
```

**Federation Verification**:
```
Verify:
  - Node trust graph is complete
  - Replication watermarks are valid
  - Consensus checkpoint is reached
  - No split-brain condition
```

**Release Verification**:
```
Verify:
  - Current release is legal
  - Schema version matches runtime
  - No migration reversibility issues
  - Deployment attestation is valid
```

**Embodiment Verification**:
```
Verify:
  - User sessions are restored
  - Spatial manifests are valid
  - Portal mappings are correct
  - No user data loss
```

---

## Part 6: Continuity Scoring

### 6.1 Continuity Health Score

The system calculates a continuity health score that indicates the likelihood of successful recovery:

```
Continuity Score = (
  (Causality Verification Score × 0.30) +
  (Authority Verification Score × 0.25) +
  (Federation Verification Score × 0.20) +
  (Release Verification Score × 0.15) +
  (Embodiment Verification Score × 0.10)
) × 100
```

**Score Interpretation**:

| Score | Status | Recovery Recommendation |
|-------|--------|------------------------|
| 95-100 | Excellent | Proceed with recovery |
| 85-94 | Good | Proceed with caution |
| 75-84 | Fair | Investigate anomalies |
| 65-74 | Poor | Manual intervention required |
| <65 | Critical | Do not recover, escalate |

### 6.2 Continuity Anomaly Detection

The system detects anomalies that may indicate continuity corruption:

- **Causality Anomalies**: Hash chain breaks, event ordering violations
- **Authority Anomalies**: Signature verification failures, grant inconsistencies
- **Federation Anomalies**: Watermark regressions, split-brain conditions
- **Release Anomalies**: Schema incompatibility, deployment attestation failures
- **Embodiment Anomalies**: Session token expiration, spatial manifest corruption

---

## Conclusion

Backup Domains & Causal Structures transform backup from storage copying into causality preservation. By defining five distinct continuity domains, establishing restoration dependencies, implementing criticality levels, and verifying continuity integrity, the system ensures that recovery preserves not just data, but sovereign identity, authority legitimacy, distributed trust, operational lineage, and user experience.

The core principle is simple: **Continuity is the primary truth layer. Everything else is an embodiment of continuity.**

When we preserve continuity, we preserve the system's identity. When we restore continuity in the correct order, we restore the system to a state where it remains the same sovereign entity—not just a restored database, but a legitimate continuation of the same operational authority.

---

## References

This document establishes the foundational model for continuity-oriented operational physics. The next phase will define Cross-Domain Dependency Graphs and Criticality Levels in greater detail, followed by Continuity-Aware Recovery Procedures that operationalize this model.
