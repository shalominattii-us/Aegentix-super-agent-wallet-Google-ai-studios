# Cross-Domain Dependency Graphs & Criticality Levels

**Formal Specification of Domain Restoration Order and Operational Priorities**

---

## Executive Summary

The five continuity domains do not exist in isolation. They form a complex dependency graph where certain domains must be restored before others to maintain causal integrity, authority legitimacy, and operational validity. This document formalizes those dependencies and establishes criticality levels that drive backup frequency, replication strategy, retention policies, recovery sequencing, and integrity verification depth.

The result is a system where recovery is not arbitrary data restoration, but deterministic continuity reconstruction governed by formal dependencies and criticality rules.

---

## Part 1: Formal Dependency Graph

### 1.1 Domain Dependency Model

The five continuity domains form a directed acyclic graph (DAG) where edges represent "must be restored before" relationships:

```
┌─────────────────────────────────────────────────────────────┐
│                  GOVERNANCE DOMAIN                          │
│  (Authority Legitimacy)                                     │
│  Tier: 1 (Authority-Critical)                               │
└────────────┬────────────────────────────────────────────────┘
             │
             ├─────────────────────────────────────┐
             │                                     │
             ▼                                     ▼
    ┌──────────────────┐            ┌──────────────────────┐
    │ RELEASE DOMAIN   │            │ FEDERATION DOMAIN    │
    │ (Deployment      │            │ (Distributed Trust)  │
    │  Legality)       │            │ Tier: 2              │
    │ Tier: 1          │            │ (Federation-Critical)│
    └────────┬─────────┘            └──────────┬───────────┘
             │                                 │
             ▼                                 │
    ┌──────────────────┐                      │
    │ RUNTIME DOMAIN   │                      │
    │ (Operational     │◄─────────────────────┘
    │  Identity)       │
    │ Tier: 0          │
    │ (Causality-      │
    │  Critical)       │
    └────────┬─────────┘
             │
             ▼
    ┌──────────────────────┐
    │ EMBODIMENT DOMAIN    │
    │ (User Experience)    │
    │ Tier: 3-4            │
    │ (Operational/        │
    │  Embodiment-Critical)│
    └──────────────────────┘
```

### 1.2 Dependency Rules

**Rule 1: Governance Must Precede All Operations**

Before any domain can be restored, governance state must be established. This ensures that all subsequent operations are authorized and legitimate.

```
Recovery Sequence:
  1. Restore Governance Domain
  2. Verify authority legitimacy
  3. Only then restore other domains
```

**Rationale**: Without authority, all operational decisions are invalid. A system that restores data without authority is not a legitimate continuation of the sovereign system—it's a corrupted state.

**Rule 2: Release Legality Must Precede Runtime Restoration**

Before runtime state is restored, the release that produced that state must be verified as legal and deployable.

```
Recovery Sequence:
  1. Restore Governance Domain
  2. Restore Release Domain
  3. Verify release legality
  4. Verify schema compatibility
  5. Restore Runtime Domain
```

**Rationale**: Runtime state is meaningless without knowing which release produced it. If the release is illegal or incompatible, restoring runtime state creates an invalid system state.

**Rule 3: Runtime Identity Must Precede Federation Reintegration**

Before the system rejoins the federation, its runtime identity must be verified and causality must be confirmed.

```
Recovery Sequence:
  1. Restore Governance Domain
  2. Restore Release Domain
  3. Restore Runtime Domain
  4. Verify causality hash chain
  5. Restore Federation Domain
```

**Rationale**: Federation peers must trust that the rejoining node is the same entity that left. If runtime identity is not verified first, the federation may accept a corrupted or impersonated node.

**Rule 4: Federation Stability Must Precede Embodiment Restoration**

Before user sessions are restored, the federation must be stable and consensus must be reached.

```
Recovery Sequence:
  1. Restore Governance Domain
  2. Restore Release Domain
  3. Restore Runtime Domain
  4. Restore Federation Domain
  5. Verify consensus reached
  6. Restore Embodiment Domain
```

**Rationale**: User sessions depend on stable portal mappings and node availability. If the federation is unstable, user sessions will fail or experience data loss.

---

## Part 2: Dependency Violation Scenarios

### 2.1 Scenario: Restoring Runtime Without Release Verification

**Violation**: Restoring runtime state before verifying release legality

```
❌ INVALID SEQUENCE:
  1. Restore runtime state (version 2.1.0)
  2. Restore release domain
  3. Discover: v2.1.0 has schema incompatibility
  4. Runtime state is now invalid

✓ CORRECT SEQUENCE:
  1. Restore release domain
  2. Verify v2.1.0 schema compatibility
  3. Restore runtime state
  4. Runtime state is guaranteed valid
```

**Consequence**: System boots with invalid schema, causing data corruption or crashes.

### 2.2 Scenario: Restoring Federation Without Runtime Identity

**Violation**: Rejoining federation before verifying runtime identity

```
❌ INVALID SEQUENCE:
  1. Restore federation domain
  2. Rejoin federation (peers accept node)
  3. Restore runtime domain
  4. Discover: runtime identity doesn't match federation expectation
  5. Federation is now split-brain

✓ CORRECT SEQUENCE:
  1. Restore runtime domain
  2. Verify causality hash chain
  3. Verify Universe ID matches
  4. Restore federation domain
  5. Rejoin federation (peers verify identity first)
```

**Consequence**: Split-brain condition, data divergence, federation inconsistency.

### 2.3 Scenario: Restoring Embodiment Without Federation Stability

**Violation**: Restoring user sessions before federation consensus

```
❌ INVALID SEQUENCE:
  1. Restore embodiment domain (user sessions)
  2. User connects to portal
  3. Restore federation domain
  4. Federation discovers split-brain
  5. User session is now invalid

✓ CORRECT SEQUENCE:
  1. Restore federation domain
  2. Verify consensus reached
  3. Verify all nodes synchronized
  4. Restore embodiment domain
  5. User connects to stable federation
```

**Consequence**: User sessions fail, spatial state is lost, user experience is degraded.

### 2.4 Scenario: Restoring Any Domain Without Governance

**Violation**: Restoring operational domains before verifying authority

```
❌ INVALID SEQUENCE:
  1. Restore runtime domain
  2. Restore federation domain
  3. Restore release domain
  4. Restore governance domain
  5. Discover: authority grants are invalid
  6. All restored operations are now unauthorized

✓ CORRECT SEQUENCE:
  1. Restore governance domain
  2. Verify authority legitimacy
  3. Verify policy constraints
  4. Restore runtime domain
  5. All operations are authorized
```

**Consequence**: System boots with invalid authority, all operations are illegitimate.

---

## Part 3: Criticality Levels

### 3.1 Criticality Tier Definitions

The system defines six criticality tiers that determine backup frequency, replication strategy, retention policies, recovery order, and integrity verification depth.

#### Tier 0: Causality-Critical

**Definition**: Loss causes identity loss. The system cannot answer "Am I the same entity?"

**Structures**:
- Continuity ledgers (immutable event log)
- Causality hashes (cryptographic proof of ordering)
- Manifest history (Universe identity)
- Replay metadata (event dependencies)

**Backup Frequency**: Continuous (every event)

**Replication**: 3+ replicas, synchronous

**Retention**: Indefinite (7-year minimum)

**Recovery Order**: First (must be restored before any other domain)

**Integrity Verification**: Cryptographic hash chain verification, event ordering verification

**Example**:
```
Event 1,847,293: Transfer 100 units from account A to account B
  - Causality Hash: 0xabcd1234...
  - Signature: 0xsig5678...
  - Timestamp: 2026-05-24T23:00:00Z
  - Dependencies: [Event 1,847,292]

If this event is lost:
  - System cannot prove it executed
  - Causality chain is broken
  - Identity is lost
  - Recovery is impossible

Tier 0 Backup:
  - Backed up immediately (within milliseconds)
  - Replicated to 3 nodes synchronously
  - Verified before next event
```

#### Tier 1: Authority-Critical

**Definition**: Loss causes legitimacy loss. The system cannot answer "Are these authorities still legitimate?"

**Structures**:
- Authority grants (role assignments)
- Attestation records (signed proofs)
- Compliance rulings (policy decisions)
- Revocations (authority removals)
- Operational approvals (deployment sanctions)
- Policy lineage (historical evolution)

**Backup Frequency**: On every change, daily full snapshot

**Replication**: 2+ replicas, synchronous

**Retention**: Indefinite (compliance requirement)

**Recovery Order**: Second (after Tier 0, before Tier 2-5)

**Integrity Verification**: Signature verification, attestation chain verification, policy consistency

**Example**:
```
Authority Grant:
  - Grantee: alice@aegentis.io
  - Role: Sovereign
  - Granted by: master-key
  - Attestation: 0xsig1234...
  - Timestamp: 2026-01-15T00:00:00Z

If this grant is lost:
  - System cannot verify alice's authority
  - Deployments authorized by alice are invalid
  - Governance decisions are illegitimate
  - Recovery requires manual intervention

Tier 1 Backup:
  - Backed up immediately on grant
  - Replicated to 2 nodes synchronously
  - Verified before accepting any operation from alice
```

#### Tier 2: Federation-Critical

**Definition**: Loss causes trust loss. The system cannot answer "Can I rejoin the federation?"

**Structures**:
- Node trust graph (peer relationships)
- Replication watermarks (progress per peer)
- Consensus checkpoints (agreed-upon state)
- Authority leases (time-bound delegations)
- Reconciliation state (conflict history)
- Topology lineage (join/leave history)

**Backup Frequency**: Per consensus checkpoint, continuous watermark tracking

**Replication**: 2 replicas, asynchronous

**Retention**: 30 days (sufficient for recovery window)

**Recovery Order**: Third (after Tier 0-1, before Tier 3-5)

**Integrity Verification**: Watermark verification, consensus checkpoint validation, trust score verification

**Example**:
```
Replication Watermark:
  - Node: node-1
  - Watermark: 1,847,293
  - Consensus Checkpoint: 1,847,280
  - Last Update: 2026-05-24T23:00:00Z

If this watermark is lost:
  - System doesn't know how far behind node-1 is
  - Federation cannot determine safe recovery point
  - Replication may diverge
  - Split-brain is possible

Tier 2 Backup:
  - Backed up per consensus checkpoint
  - Replicated to 2 nodes asynchronously
  - Verified before rejoining federation
```

#### Tier 3: Operational-Critical

**Definition**: Loss causes availability loss. The system cannot answer "What is my current state?"

**Structures**:
- Lifecycle state (current runtime phase)
- Configuration (current settings)
- Metrics (operational statistics)
- Logs (operational history)
- Snapshots (point-in-time state)

**Backup Frequency**: Hourly

**Replication**: 1 replica

**Retention**: 90 days

**Recovery Order**: Fourth (after Tier 0-2, before Tier 4-5)

**Integrity Verification**: Checksum verification, timestamp verification

**Example**:
```
Lifecycle State:
  - Phase: operational
  - Uptime: 45 days
  - Last Restart: 2026-04-09T12:00:00Z
  - Current Config Version: 42

If this state is lost:
  - System doesn't know if it's operational
  - Configuration may be inconsistent
  - Metrics are lost
  - Availability is degraded

Tier 3 Backup:
  - Backed up hourly
  - Replicated to 1 node
  - Verified before resuming operations
```

#### Tier 4: Embodiment-Critical

**Definition**: Loss causes UX degradation. Users lose spatial context or session state.

**Structures**:
- Presence bindings (user-to-runtime mappings)
- Portal mappings (instance-to-node mappings)
- Hologram state (spatial object state)
- XR session continuity (session tokens)
- Spatial manifests (coordinate systems)

**Backup Frequency**: Per session change, every 5 minutes for active sessions

**Replication**: 1 replica

**Retention**: 7 days

**Recovery Order**: Fifth (after Tier 0-3)

**Integrity Verification**: Session token verification, spatial manifest verification

**Example**:
```
User Session:
  - User: commander@aegentis.io
  - Session Token: 0xtoken1234...
  - Portal: portal-us-east-1
  - Position: (100.5, 200.3, 50.1)
  - Last Update: 2026-05-24T23:00:00Z

If this session is lost:
  - User loses spatial context
  - User must reconnect
  - User experience is degraded
  - But system remains operational

Tier 4 Backup:
  - Backed up per session change
  - Replicated to 1 node
  - Verified before user reconnection
```

#### Tier 5: Recoverable Cache

**Definition**: Loss causes temporary delay. System recomputes on demand.

**Structures**:
- Cached data (computed results)
- Temporary state (session caches)
- Computed metrics (derived statistics)
- Indexes (search indexes)

**Backup Frequency**: Daily

**Replication**: None

**Retention**: 1 day

**Recovery Order**: Not critical (can be recovered on demand)

**Integrity Verification**: None (can be recomputed)

**Example**:
```
Cached Query Result:
  - Query: "All deployments in last 7 days"
  - Result: [deploy-1, deploy-2, ..., deploy-47]
  - Cached: 2026-05-24T12:00:00Z
  - TTL: 24 hours

If this cache is lost:
  - Query is recomputed
  - Takes 5 seconds instead of 50ms
  - But result is correct
  - System remains operational

Tier 5 Backup:
  - Backed up daily
  - Not replicated
  - Not verified (can be recomputed)
```

---

## Part 4: Criticality-Driven Backup Strategy

### 4.1 Backup Frequency Matrix

| Tier | Frequency | Trigger | Replication | Sync |
|------|-----------|---------|-------------|------|
| 0 | Continuous | Every event | 3+ | Sync |
| 1 | Per-change + daily | Authority change | 2+ | Sync |
| 2 | Per-checkpoint | Consensus | 2 | Async |
| 3 | Hourly | Timer | 1 | Async |
| 4 | Per-session | Session change | 1 | Async |
| 5 | Daily | Timer | 0 | N/A |

### 4.2 Retention Policies

| Tier | Retention | Reason | Recovery Window |
|------|-----------|--------|-----------------|
| 0 | Indefinite | Compliance | Immediate |
| 1 | Indefinite | Compliance | Within 1 hour |
| 2 | 30 days | Federation recovery | Within 5 minutes |
| 3 | 90 days | Operational history | Within 30 minutes |
| 4 | 7 days | Session recovery | Within 5 minutes |
| 5 | 1 day | Cache refresh | On demand |

### 4.3 Recovery Order

The system recovers domains in this order:

1. **Tier 0 (Causality-Critical)**: Restore causality ledger, verify hash chain
2. **Tier 1 (Authority-Critical)**: Restore authority grants, verify attestations
3. **Tier 2 (Federation-Critical)**: Restore federation state, verify consensus
4. **Tier 3 (Operational-Critical)**: Restore lifecycle state, verify configuration
5. **Tier 4 (Embodiment-Critical)**: Restore user sessions, verify spatial state
6. **Tier 5 (Recoverable Cache)**: Recompute on demand

---

## Part 5: Criticality-Driven Verification

### 5.1 Verification Depth by Tier

**Tier 0 Verification** (Deepest):
- Cryptographic hash chain verification
- Event ordering verification
- Causality dependency verification
- Signature verification
- No gaps in sequence

**Tier 1 Verification** (Deep):
- Attestation signature verification
- Authority hierarchy verification
- Policy consistency verification
- Revocation verification
- Timestamp verification

**Tier 2 Verification** (Medium):
- Watermark verification
- Consensus checkpoint verification
- Trust score verification
- Topology consistency verification

**Tier 3 Verification** (Light):
- Checksum verification
- Timestamp verification
- Configuration consistency

**Tier 4 Verification** (Light):
- Session token verification
- Spatial manifest verification
- Portal mapping verification

**Tier 5 Verification** (None):
- Cache can be recomputed on demand

### 5.2 Verification Failure Handling

**Tier 0 Verification Failure**:
- **Action**: Stop recovery, escalate to human
- **Reason**: Cannot proceed without causality integrity
- **Recovery**: Manual intervention required

**Tier 1 Verification Failure**:
- **Action**: Stop recovery, escalate to human
- **Reason**: Cannot proceed without authority legitimacy
- **Recovery**: Manual intervention required

**Tier 2 Verification Failure**:
- **Action**: Recover locally, do not rejoin federation
- **Reason**: Cannot trust federation state
- **Recovery**: Wait for federation to stabilize

**Tier 3 Verification Failure**:
- **Action**: Recover with degraded state
- **Reason**: Can operate with stale configuration
- **Recovery**: Recompute configuration on demand

**Tier 4 Verification Failure**:
- **Action**: Skip session recovery
- **Reason**: Users can reconnect
- **Recovery**: Users reconnect manually

**Tier 5 Verification Failure**:
- **Action**: Skip cache recovery
- **Reason**: Cache can be recomputed
- **Recovery**: Recompute on demand

---

## Part 6: Criticality Scoring

### 6.1 Domain Criticality Score

Each domain receives a criticality score based on the criticality of its constituent structures:

```
Domain Criticality Score = (
  (Tier 0 Structures × 0.40) +
  (Tier 1 Structures × 0.30) +
  (Tier 2 Structures × 0.15) +
  (Tier 3 Structures × 0.10) +
  (Tier 4 Structures × 0.04) +
  (Tier 5 Structures × 0.01)
) / Total Structures
```

**Domain Criticality Scores**:

| Domain | Tier 0 | Tier 1 | Tier 2 | Tier 3 | Tier 4 | Score |
|--------|--------|--------|--------|--------|--------|-------|
| Runtime | 6 | 0 | 0 | 2 | 0 | 0.92 |
| Governance | 0 | 6 | 0 | 0 | 0 | 1.00 |
| Federation | 0 | 0 | 6 | 0 | 0 | 0.90 |
| Release | 0 | 3 | 0 | 3 | 0 | 0.85 |
| Embodiment | 0 | 0 | 0 | 0 | 5 | 0.40 |

---

## Conclusion

Cross-Domain Dependency Graphs and Criticality Levels transform recovery from arbitrary data restoration into deterministic continuity reconstruction governed by formal dependencies and criticality rules.

By establishing clear restoration order, defining criticality tiers, implementing criticality-driven backup strategy, and verifying integrity at appropriate depths, the system ensures that recovery preserves not just data, but sovereign identity, authority legitimacy, distributed trust, operational lineage, and user experience.

The core principle is: **Recovery must follow the dependency graph and criticality levels. Violating this order results in invalid system state.**

---

## References

This document formalizes the dependency relationships and criticality levels introduced in the Backup Domains & Causal Structures document. The next phase will define Continuity-Aware Recovery Procedures that operationalize these dependencies and criticality levels.
