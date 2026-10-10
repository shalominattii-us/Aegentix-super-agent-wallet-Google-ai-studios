# AEGENTIX Event Ontology & Taxonomy

## Overview

The AEGENTIX Event Ontology defines a unified taxonomy of all events across Portal, VR, Federation, and Ledger systems. This document serves as the canonical reference for event types, structures, and semantics.

## Event Hierarchy

```
Event
├── Portal Events
│   ├── Transaction Events
│   ├── User Action Events
│   ├── State Change Events
│   └── Authentication Events
├── VR Events
│   ├── Command Events
│   ├── Spatial Update Events
│   ├── Interaction Events
│   └── Reality Layer Events
├── Federation Events
│   ├── Synchronization Events
│   ├── Decision Events
│   ├── Node Lifecycle Events
│   └── Consensus Events
└── Ledger Events
    ├── Transaction Events
    ├── Verification Events
    ├── State Commit Events
    └── Audit Events
```

## Event Structure

### Base Event Schema

```typescript
interface CanonicalEvent {
  // Unique identifier
  eventId: string;                    // UUID v4
  
  // Event classification
  type: string;                       // Taxonomy path (e.g., "portal:transaction:transfer")
  
  // Temporal information
  timestamp: string;                  // ISO 8601 datetime
  
  // Authority information
  authorityLevel: AuthorityLevel;     // sovereign | commander | operator | cadet
  
  // Source information
  emittedBy: string;                  // System/node identifier
  
  // Causality information
  causality_chain: string[];          // Array of dependent event IDs
  
  // Version information
  version: string;                    // Schema version (e.g., "1.0")
  
  // Optional signature
  signature?: string;                 // Cryptographic signature
}
```

## Portal Events

### Transaction Events

**portal:transaction:initiate**
```json
{
  "type": "portal:transaction:initiate",
  "authorityLevel": "sovereign",
  "emittedBy": "portal-system",
  "payload": {
    "transactionId": "txn-uuid",
    "fromAccount": "account-id",
    "toAccount": "account-id",
    "amount": 1000.00,
    "currency": "USD",
    "description": "Payment for services"
  }
}
```

**portal:transaction:approve**
```json
{
  "type": "portal:transaction:approve",
  "authorityLevel": "commander",
  "emittedBy": "portal-system",
  "causality_chain": ["txn-initiate-id"],
  "payload": {
    "transactionId": "txn-uuid",
    "approvedBy": "user-id",
    "approvalTime": "2026-07-03T23:00:00Z"
  }
}
```

**portal:transaction:complete**
```json
{
  "type": "portal:transaction:complete",
  "authorityLevel": "sovereign",
  "emittedBy": "portal-system",
  "causality_chain": ["txn-initiate-id", "txn-approve-id"],
  "payload": {
    "transactionId": "txn-uuid",
    "status": "completed",
    "completionTime": "2026-07-03T23:00:05Z",
    "finalAmount": 1000.00
  }
}
```

### User Action Events

**portal:user_action:login**
```json
{
  "type": "portal:user_action:login",
  "authorityLevel": "cadet",
  "emittedBy": "portal-system",
  "payload": {
    "userId": "user-id",
    "loginTime": "2026-07-03T23:00:00Z",
    "ipAddress": "192.168.1.1",
    "userAgent": "Mozilla/5.0..."
  }
}
```

**portal:user_action:logout**
```json
{
  "type": "portal:user_action:logout",
  "authorityLevel": "cadet",
  "emittedBy": "portal-system",
  "causality_chain": ["login-event-id"],
  "payload": {
    "userId": "user-id",
    "logoutTime": "2026-07-03T23:30:00Z",
    "sessionDuration": 1800
  }
}
```

### State Change Events

**portal:state_change:account_update**
```json
{
  "type": "portal:state_change:account_update",
  "authorityLevel": "commander",
  "emittedBy": "portal-system",
  "payload": {
    "accountId": "account-id",
    "changes": {
      "balance": 5000.00,
      "status": "active"
    },
    "previousValues": {
      "balance": 4000.00,
      "status": "pending"
    }
  }
}
```

### Authentication Events

**portal:auth:mfa_enabled**
```json
{
  "type": "portal:auth:mfa_enabled",
  "authorityLevel": "sovereign",
  "emittedBy": "portal-system",
  "payload": {
    "userId": "user-id",
    "mfaMethod": "totp",
    "enabledTime": "2026-07-03T23:00:00Z"
  }
}
```

## VR Events

### Command Events

**vr:command:execute**
```json
{
  "type": "vr:command:execute",
  "authorityLevel": "operator",
  "emittedBy": "vr-system",
  "payload": {
    "commandId": "cmd-uuid",
    "commandType": "move",
    "targetPosition": [100, 200, 300],
    "executionTime": "2026-07-03T23:00:00Z"
  }
}
```

**vr:command:complete**
```json
{
  "type": "vr:command:complete",
  "authorityLevel": "operator",
  "emittedBy": "vr-system",
  "causality_chain": ["cmd-execute-id"],
  "payload": {
    "commandId": "cmd-uuid",
    "status": "completed",
    "finalPosition": [100, 200, 300],
    "completionTime": "2026-07-03T23:00:05Z"
  }
}
```

### Spatial Update Events

**vr:spatial_update:position**
```json
{
  "type": "vr:spatial_update:position",
  "authorityLevel": "operator",
  "emittedBy": "vr-system",
  "payload": {
    "entityId": "entity-uuid",
    "position": [100, 200, 300],
    "rotation": [0, 45, 0],
    "updateTime": "2026-07-03T23:00:00Z"
  }
}
```

**vr:spatial_update:scale**
```json
{
  "type": "vr:spatial_update:scale",
  "authorityLevel": "operator",
  "emittedBy": "vr-system",
  "payload": {
    "entityId": "entity-uuid",
    "scale": [1.0, 1.0, 1.0],
    "updateTime": "2026-07-03T23:00:00Z"
  }
}
```

### Interaction Events

**vr:interaction:grab**
```json
{
  "type": "vr:interaction:grab",
  "authorityLevel": "operator",
  "emittedBy": "vr-system",
  "payload": {
    "userId": "user-id",
    "objectId": "object-uuid",
    "grabTime": "2026-07-03T23:00:00Z",
    "grabPoint": [100, 200, 300]
  }
}
```

**vr:interaction:release**
```json
{
  "type": "vr:interaction:release",
  "authorityLevel": "operator",
  "emittedBy": "vr-system",
  "causality_chain": ["grab-event-id"],
  "payload": {
    "userId": "user-id",
    "objectId": "object-uuid",
    "releaseTime": "2026-07-03T23:00:05Z",
    "releaseVelocity": [10, 0, 0]
  }
}
```

### Reality Layer Events

**vr:reality_layer:init**
```json
{
  "type": "vr:reality_layer:init",
  "authorityLevel": "sovereign",
  "emittedBy": "vr-system",
  "payload": {
    "layerId": "layer-uuid",
    "layerName": "Main Reality",
    "layerType": "primary",
    "initTime": "2026-07-03T23:00:00Z"
  }
}
```

**vr:reality_layer:sync**
```json
{
  "type": "vr:reality_layer:sync",
  "authorityLevel": "commander",
  "emittedBy": "vr-system",
  "causality_chain": ["layer-init-id"],
  "payload": {
    "layerId": "layer-uuid",
    "syncTime": "2026-07-03T23:00:00Z",
    "entityCount": 1000,
    "stateHash": "hash-value"
  }
}
```

## Federation Events

### Synchronization Events

**federation:sync:initiate**
```json
{
  "type": "federation:sync:initiate",
  "authorityLevel": "commander",
  "emittedBy": "federation-system",
  "payload": {
    "syncId": "sync-uuid",
    "sourceNode": "node-1",
    "targetNodes": ["node-2", "node-3"],
    "initiateTime": "2026-07-03T23:00:00Z"
  }
}
```

**federation:sync:complete**
```json
{
  "type": "federation:sync:complete",
  "authorityLevel": "commander",
  "emittedBy": "federation-system",
  "causality_chain": ["sync-initiate-id"],
  "payload": {
    "syncId": "sync-uuid",
    "status": "completed",
    "nodesSync": ["node-2", "node-3"],
    "completeTime": "2026-07-03T23:00:05Z"
  }
}
```

### Decision Events

**federation:decision:propose**
```json
{
  "type": "federation:decision:propose",
  "authorityLevel": "commander",
  "emittedBy": "federation-system",
  "payload": {
    "decisionId": "decision-uuid",
    "proposalType": "governance",
    "proposal": {
      "title": "Update federation policy",
      "description": "Proposed policy changes"
    },
    "proposalTime": "2026-07-03T23:00:00Z"
  }
}
```

**federation:decision:approve**
```json
{
  "type": "federation:decision:approve",
  "authorityLevel": "sovereign",
  "emittedBy": "federation-system",
  "causality_chain": ["decision-propose-id"],
  "payload": {
    "decisionId": "decision-uuid",
    "approvedBy": "node-1",
    "approvalTime": "2026-07-03T23:00:05Z"
  }
}
```

### Node Lifecycle Events

**federation:node:join**
```json
{
  "type": "federation:node:join",
  "authorityLevel": "sovereign",
  "emittedBy": "federation-system",
  "payload": {
    "nodeId": "node-4",
    "nodeAddress": "192.168.1.4",
    "authority": "commander",
    "joinTime": "2026-07-03T23:00:00Z"
  }
}
```

**federation:node:leave**
```json
{
  "type": "federation:node:leave",
  "authorityLevel": "sovereign",
  "emittedBy": "federation-system",
  "payload": {
    "nodeId": "node-4",
    "reason": "graceful_shutdown",
    "leaveTime": "2026-07-03T23:00:00Z"
  }
}
```

## Ledger Events

### Transaction Events

**ledger:transaction:record**
```json
{
  "type": "ledger:transaction:record",
  "authorityLevel": "sovereign",
  "emittedBy": "ledger-system",
  "payload": {
    "transactionId": "txn-uuid",
    "fromAccount": "account-1",
    "toAccount": "account-2",
    "amount": 1000.00,
    "recordTime": "2026-07-03T23:00:00Z",
    "blockNumber": 12345
  }
}
```

### Verification Events

**ledger:verification:start**
```json
{
  "type": "ledger:verification:start",
  "authorityLevel": "commander",
  "emittedBy": "ledger-system",
  "causality_chain": ["transaction-record-id"],
  "payload": {
    "transactionId": "txn-uuid",
    "verificationTime": "2026-07-03T23:00:00Z"
  }
}
```

**ledger:verification:complete**
```json
{
  "type": "ledger:verification:complete",
  "authorityLevel": "sovereign",
  "emittedBy": "ledger-system",
  "causality_chain": ["transaction-record-id", "verification-start-id"],
  "payload": {
    "transactionId": "txn-uuid",
    "status": "verified",
    "completionTime": "2026-07-03T23:00:05Z"
  }
}
```

### State Commit Events

**ledger:state_commit:prepare**
```json
{
  "type": "ledger:state_commit:prepare",
  "authorityLevel": "commander",
  "emittedBy": "ledger-system",
  "payload": {
    "commitId": "commit-uuid",
    "blockNumber": 12345,
    "prepareTime": "2026-07-03T23:00:00Z"
  }
}
```

**ledger:state_commit:finalize**
```json
{
  "type": "ledger:state_commit:finalize",
  "authorityLevel": "sovereign",
  "emittedBy": "ledger-system",
  "causality_chain": ["commit-prepare-id"],
  "payload": {
    "commitId": "commit-uuid",
    "blockNumber": 12345,
    "stateHash": "hash-value",
    "finalizeTime": "2026-07-03T23:00:05Z"
  }
}
```

### Audit Events

**ledger:audit:access**
```json
{
  "type": "ledger:audit:access",
  "authorityLevel": "cadet",
  "emittedBy": "ledger-system",
  "payload": {
    "userId": "user-id",
    "accessType": "read",
    "resource": "transaction-12345",
    "accessTime": "2026-07-03T23:00:00Z"
  }
}
```

## Event Patterns

### Pattern 1: Simple Transaction

```
portal:transaction:initiate
    ↓
portal:transaction:approve (depends on initiate)
    ↓
portal:transaction:complete (depends on initiate, approve)
    ↓
ledger:transaction:record (depends on complete)
```

### Pattern 2: VR Interaction

```
vr:command:execute
    ↓
vr:spatial_update:position (depends on execute)
    ↓
vr:interaction:grab (depends on position)
    ↓
vr:interaction:release (depends on grab)
```

### Pattern 3: Federation Sync

```
federation:sync:initiate
    ↓
vr:reality_layer:sync (depends on sync:initiate)
    ↓
federation:sync:complete (depends on sync:initiate, reality_layer:sync)
```

## Event Validation Rules

### Authority Rules

- **Sovereign:** Can emit any event type
- **Commander:** Can emit operations and governance (with approval)
- **Operator:** Can emit local operations only
- **Cadet:** Can emit read-only events only

### Causality Rules

- All events must have valid causality chains
- Dependencies must exist in event store
- Circular dependencies are not allowed
- Events must be applied in causal order

### Timestamp Rules

- Timestamps must be in ISO 8601 format
- Timestamps must be chronologically ordered
- Timestamps must be within acceptable drift (±1 minute)

## Event Versioning

### Version 1.0

Current stable version with full support for:
- Portal, VR, Federation, Ledger events
- Authority-based access control
- Causality tracking
- Event signatures

### Future: Version 2.0

Planned enhancements:
- Additional event types
- Enhanced metadata
- Improved compression
- New security features

## References

- [Canonical Events Implementation](../server/canonical-events.ts)
- [Event Store Implementation](../server/unified-event-store.ts)
- [Consolidated Architecture](./CONSOLIDATED_ARCHITECTURE.md)
