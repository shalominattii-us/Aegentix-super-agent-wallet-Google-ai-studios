# Canonical Event Taxonomy for Sovereign System

## Overview

The Sovereign System Portal has evolved through three distinct evolutionary stages: operational infrastructure, financial/compliance sovereignty, and multi-reality embodiment. This document unifies all event streams across these stages into a single canonical event taxonomy that serves as the civilization protocol language for the sovereign runtime.

The event taxonomy is organized into eight primary domains that reflect the architecture's core concerns: universe-level operations, presence and authority, holographic manifestation, ledger continuity, treasury operations, compliance governance, authority hierarchy, and reality layer management.

---

## Event Taxonomy Structure

### Universe.* Events

Universe events represent system-level operations and lifecycle events that affect the entire sovereign runtime.

| Event | Payload | Authority | Description |
|-------|---------|-----------|-------------|
| `Universe.Initialized` | `{ runtimeId, timestamp, version }` | sovereign | Sovereign runtime initialized with canonical event store |
| `Universe.RuntimeStarted` | `{ runtimeId, nodeId, timestamp }` | sovereign | Runtime node started and joined federation |
| `Universe.RuntimeStopped` | `{ runtimeId, nodeId, reason, timestamp }` | sovereign | Runtime node stopped or failed |
| `Universe.FederationJoined` | `{ runtimeId, federationId, peerId, timestamp }` | sovereign | New runtime node joined federation |
| `Universe.FederationLeft` | `{ runtimeId, federationId, peerId, reason, timestamp }` | sovereign | Runtime node left or was removed from federation |
| `Universe.ConsensusReached` | `{ runtimeId, consensusId, decision, participants, timestamp }` | sovereign | Distributed consensus decision finalized |
| `Universe.FailoverTriggered` | `{ runtimeId, failoverReason, primaryNode, backupNode, timestamp }` | commander | Failover activated due to node failure |
| `Universe.RecoveryCompleted` | `{ runtimeId, recoveryType, recoveredState, timestamp }` | commander | System recovered from failure or inconsistency |

### Presence.* Events

Presence events track authority hierarchy, entity manifestation, and sovereign presence across reality layers.

| Event | Payload | Authority | Description |
|-------|---------|-----------|-------------|
| `Presence.EntityManifested` | `{ entityId, form, realityLayer, timestamp }` | sovereign/commander | Entity manifested in specific reality layer |
| `Presence.EntityDematerialized` | `{ entityId, realityLayer, reason, timestamp }` | sovereign/commander | Entity dematerialized from reality layer |
| `Presence.AuthorityElevated` | `{ userId, fromLevel, toLevel, grantedBy, timestamp }` | sovereign | User authority level elevated (cadet → operator → commander → sovereign) |
| `Presence.AuthorityRevoked` | `{ userId, fromLevel, revokedBy, reason, timestamp }` | sovereign | User authority level revoked |
| `Presence.CapabilityGranted` | `{ userId, capability, scope, grantedBy, timestamp }` | sovereign/commander | Specific capability granted to user |
| `Presence.CapabilityRevoked` | `{ userId, capability, revokedBy, reason, timestamp }` | sovereign/commander | Capability revoked from user |
| `Presence.SessionStarted` | `{ sessionId, userId, authorityLevel, timestamp }` | operator | User session started |
| `Presence.SessionEnded` | `{ sessionId, userId, duration, timestamp }` | operator | User session ended |

### Hologram.* Events

Hologram events represent immersive VR/XR manifestation, spatial presence, and embodiment state.

| Event | Payload | Authority | Description |
|-------|---------|-----------|-------------|
| `Hologram.AvatarCreated` | `{ avatarId, userId, form, realityLayer, timestamp }` | operator | Avatar created for user in reality layer |
| `Hologram.AvatarTransformed` | `{ avatarId, form, position, orientation, timestamp }` | operator | Avatar form or spatial position changed |
| `Hologram.AvatarDestroyed` | `{ avatarId, reason, timestamp }` | operator | Avatar destroyed or dematerialized |
| `Hologram.CommanderManifested` | `{ commanderId, form, realityLayer, timestamp }` | sovereign | AEGENTIS-X Commander manifested |
| `Hologram.CommanderDematerialized` | `{ commanderId, reason, timestamp }` | sovereign | AEGENTIS-X Commander dematerialized |
| `Hologram.SpatialAnchorCreated` | `{ anchorId, position, realityLayer, timestamp }` | operator | Spatial anchor created for persistent placement |
| `Hologram.SpatialAnchorRemoved` | `{ anchorId, reason, timestamp }` | operator | Spatial anchor removed |
| `Hologram.GestureRecognized` | `{ gestureType, userId, confidence, timestamp }` | operator | Gesture recognized in immersive environment |
| `Hologram.VoiceCommandReceived` | `{ commandId, command, userId, confidence, timestamp }` | operator | Voice command received and parsed |

### Ledger.* Events

Ledger events represent immutable transaction history, verification, and continuity guarantees.

| Event | Payload | Authority | Description |
|-------|---------|-----------|-------------|
| `Ledger.TransactionCreated` | `{ txId, type, amount, from, to, timestamp }` | operator | Transaction created and recorded |
| `Ledger.TransactionSigned` | `{ txId, signer, algorithm, signature, timestamp }` | operator | Transaction signed with cryptographic key |
| `Ledger.TransactionVerified` | `{ txId, verifier, valid, timestamp }` | operator | Transaction verified and validated |
| `Ledger.TransactionExecuted` | `{ txId, chain, blockHash, status, timestamp }` | operator | Transaction executed on blockchain |
| `Ledger.TransactionFailed` | `{ txId, reason, retryCount, timestamp }` | operator | Transaction failed with retry logic |
| `Ledger.BlockCreated` | `{ blockId, blockNumber, txCount, hash, timestamp }` | sovereign | New block created in ledger |
| `Ledger.BlockFinalized` | `{ blockId, blockNumber, timestamp }` | sovereign | Block finalized and immutable |
| `Ledger.LedgerReconciled` | `{ reconciliationId, chains, status, timestamp }` | commander | Multi-chain ledger reconciliation completed |
| `Ledger.ContinuityPreserved` | `{ continuityId, fromState, toState, timestamp }` | sovereign | Continuity preserved across runtime restart |

### Treasury.* Events

Treasury events represent financial operations, custody, and multi-chain asset management.

| Event | Payload | Authority | Description |
|-------|---------|-----------|-------------|
| `Treasury.CustodyCreated` | `{ custodyId, asset, amount, chain, timestamp }` | commander | Custody position created |
| `Treasury.CustodyUpdated` | `{ custodyId, asset, newAmount, change, timestamp }` | operator | Custody position updated |
| `Treasury.CustodyTransferred` | `{ custodyId, fromCustodian, toCustodian, timestamp }` | commander | Custody transferred between custodians |
| `Treasury.MultiSigApprovalRequested` | `{ approvalId, txId, requiredSignatures, timestamp }` | operator | Multi-sig approval requested |
| `Treasury.MultiSigApprovalGiven` | `{ approvalId, signer, signature, timestamp }` | operator | Multi-sig approval given |
| `Treasury.MultiSigThresholdMet` | `{ approvalId, txId, signatures, timestamp }` | operator | Multi-sig threshold reached, transaction approved |
| `Treasury.AssetTransferred` | `{ transferId, asset, amount, from, to, chain, timestamp }` | operator | Asset transferred across chain |
| `Treasury.ReconciliationStarted` | `{ reconciliationId, timestamp }` | commander | Treasury reconciliation started |
| `Treasury.ReconciliationCompleted` | `{ reconciliationId, discrepancies, status, timestamp }` | commander | Treasury reconciliation completed |

### Compliance.* Events

Compliance events represent governance, investigation, and regulatory operations.

| Event | Payload | Authority | Description |
|-------|---------|-----------|-------------|
| `Compliance.InvestigationStarted` | `{ investigationId, subject, initiator, timestamp }` | commander | Compliance investigation initiated |
| `Compliance.EvidenceCollected` | `{ investigationId, evidenceId, type, timestamp }` | operator | Evidence collected for investigation |
| `Compliance.EvidenceAnalyzed` | `{ investigationId, evidenceId, findings, timestamp }` | operator | Evidence analyzed with AI assistance |
| `Compliance.RiskAssessed` | `{ investigationId, riskScore, riskLevel, timestamp }` | commander | Risk assessment completed |
| `Compliance.InvestigationResolved` | `{ investigationId, resolution, timestamp }` | commander | Investigation resolved |
| `Compliance.AlertRaised` | `{ alertId, alertType, severity, timestamp }` | operator | Compliance alert raised |
| `Compliance.AlertAcknowledged` | `{ alertId, acknowledgedBy, timestamp }` | operator | Alert acknowledged by operator |
| `Compliance.ReportGenerated` | `{ reportId, format, period, timestamp }` | commander | Regulatory report generated |
| `Compliance.AuditLogCreated` | `{ auditId, action, actor, resource, timestamp }` | operator | Audit log entry created |

### Authority.* Events

Authority events represent governance decisions, charter management, and sovereign attestation.

| Event | Payload | Authority | Description |
|-------|---------|-----------|-------------|
| `Authority.CharterCreated` | `{ charterId, realityLayer, preamble, principles, timestamp }` | sovereign | Charter created for reality layer |
| `Authority.CharterSealed` | `{ charterId, seal, sealedBy, timestamp }` | sovereign | Charter sealed with cryptographic seal |
| `Authority.CharterRevoked` | `{ charterId, revokedBy, reason, timestamp }` | sovereign | Charter revoked or suspended |
| `Authority.AttestationRequested` | `{ attestationId, charterId, timestamp }` | commander | Charter attestation requested |
| `Authority.AttestationVerified` | `{ attestationId, verifier, valid, timestamp }` | commander | Attestation verified |
| `Authority.AttestationAttested` | `{ attestationId, attestedBy, timestamp }` | sovereign | Attestation finalized |
| `Authority.GovernanceDecisionMade` | `{ decisionId, decision, votingResult, timestamp }` | sovereign | Governance decision made |
| `Authority.PermissionGranted` | `{ permissionId, grantee, permission, grantedBy, timestamp }` | sovereign | Permission granted |
| `Authority.PermissionRevoked` | `{ permissionId, revokedBy, reason, timestamp }` | sovereign | Permission revoked |

### Reality.* Events

Reality events represent multi-layer synchronization, cross-reality operations, and layer persistence.

| Event | Payload | Authority | Description |
|-------|---------|-----------|-------------|
| `Reality.LayerInitialized` | `{ layerId, layerName, properties, timestamp }` | sovereign | Reality layer initialized |
| `Reality.LayerActivated` | `{ layerId, timestamp }` | commander | Reality layer activated |
| `Reality.LayerDeactivated` | `{ layerId, reason, timestamp }` | commander | Reality layer deactivated |
| `Reality.CrossLayerSyncStarted` | `{ syncId, sourceLayer, targetLayer, timestamp }` | commander | Cross-layer synchronization started |
| `Reality.CrossLayerSyncCompleted` | `{ syncId, sourceLayer, targetLayer, status, timestamp }` | commander | Cross-layer synchronization completed |
| `Reality.LayerStateSnapshot` | `{ snapshotId, layerId, state, timestamp }` | sovereign | Layer state snapshot created |
| `Reality.LayerStateRestored` | `{ snapshotId, layerId, timestamp }` | sovereign | Layer state restored from snapshot |
| `Reality.LayerDriftDetected` | `{ driftId, layerId, driftAmount, timestamp }` | commander | Layer drift detected and corrected |
| `Reality.LayerPersistenceVerified` | `{ verificationId, layerId, valid, timestamp }` | commander | Layer persistence verified |

---

## Event Causality & Ordering

All events are timestamped and include a `causality_chain` field that links to parent events, enabling:

- **Event replay**: Reconstruct system state from event log
- **Causality tracking**: Understand event dependencies
- **Consistency verification**: Detect and correct divergence
- **Federation synchronization**: Coordinate events across distributed nodes

### Causality Chain Format

```json
{
  "eventId": "evt_12345",
  "type": "Ledger.TransactionExecuted",
  "timestamp": "2026-05-24T23:00:00Z",
  "causality_chain": [
    "evt_12344",  // Parent event
    "evt_12343",  // Grandparent event
    "evt_12340"   // Root event
  ],
  "payload": { }
}
```

---

## Authority Levels & Event Permissions

Each event type is associated with a minimum authority level required to emit or replay it.

| Authority Level | Capabilities |
|-----------------|--------------|
| **sovereign** | Create/revoke charters, make governance decisions, seal authorities, initialize runtime, manage federation |
| **commander** | Approve transactions, manage custody, initiate investigations, trigger failover, manage reality layers |
| **operator** | Execute transactions, collect evidence, create sessions, emit telemetry, manage spatial presence |
| **cadet** | View-only access, limited session creation, no mutation permissions |

---

## Event Validation & Schema

Each event must conform to a strict schema:

```typescript
interface CanonicalEvent {
  eventId: string;                    // Unique event identifier
  type: string;                       // Event type (e.g., "Ledger.TransactionExecuted")
  timestamp: ISO8601;                 // Event timestamp in UTC
  authorityLevel: "sovereign" | "commander" | "operator" | "cadet";
  emittedBy: string;                  // User or system ID that emitted event
  causality_chain: string[];          // Parent event IDs
  payload: Record<string, unknown>;   // Event-specific payload
  signature?: string;                 // Cryptographic signature (for critical events)
  version: string;                    // Event schema version
}
```

---

## Event Store & Replay

The canonical event store is immutable and append-only. All events are persisted and can be replayed to reconstruct system state at any point in time.

### Event Store Operations

- **Append**: Add new event to store (atomic, idempotent)
- **Query**: Retrieve events by type, authority, time range, or causality chain
- **Replay**: Reconstruct state from event sequence
- **Snapshot**: Create point-in-time state snapshot for performance

### Replay Semantics

When replaying events:

1. Events are replayed in causality order (not just timestamp order)
2. Authority permissions are enforced during replay
3. State mutations are deterministic and idempotent
4. Consistency is verified after each batch of events
5. Divergence is detected and corrected

---

## Federation & Cross-Node Events

In a federated deployment, events are synchronized across nodes using the canonical taxonomy:

- **Local events**: Emitted on primary node, replicated to federation
- **Consensus events**: Require quorum approval before finalization
- **Conflict resolution**: Causality chain determines event ordering
- **Eventual consistency**: All nodes converge to same state

---

## Monitoring & Observability

All events are observable through:

- **Event stream**: Real-time event feed via WebSocket
- **Event metrics**: Count, latency, error rate per event type
- **Event audit trail**: Complete history with authority tracking
- **Event replay dashboard**: Visualize causality chains and state reconstruction

---

## Migration & Versioning

The event taxonomy is versioned to support evolution:

- **v1.0**: Initial taxonomy (8 domains, 80+ event types)
- **v1.1+**: Backward-compatible extensions (new event types, new domains)
- **v2.0+**: Breaking changes (new schema, new authority model)

Events include `version` field to support multi-version replay during upgrades.

---

## Next Steps

1. **Implement event schema validation** in tRPC procedures
2. **Create event registry** with all event types and handlers
3. **Build event replay engine** for state reconstruction
4. **Implement causality tracking** in event store
5. **Create federation sync protocol** for distributed events
6. **Build observability dashboards** for event monitoring
7. **Write comprehensive tests** for event taxonomy and replay

---

This canonical event taxonomy serves as the civilization protocol language for the Sovereign System, unifying all operational, financial, compliance, and reality-layer concerns into a single coherent event model.
