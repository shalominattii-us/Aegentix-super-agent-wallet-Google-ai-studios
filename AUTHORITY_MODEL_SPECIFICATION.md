# Authority Model Specification for Sovereign System

## Overview

The Sovereign System employs a hierarchical authority model with four distinct levels: sovereign, commander, operator, and cadet. This specification formalizes the authority hierarchy, defines capability scopes, establishes mutation permissions, and creates federation authority rules that ensure coherent governance across distributed runtime nodes.

---

## Authority Hierarchy

The authority hierarchy reflects operational responsibility and decision-making power:

```
┌─────────────────────────────────────────┐
│         SOVEREIGN (Level 4)             │
│  - System initialization & shutdown     │
│  - Charter creation & revocation        │
│  - Authority elevation/revocation       │
│  - Federation governance                │
│  - Continuity guarantees                │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│        COMMANDER (Level 3)              │
│  - Treasury operations                  │
│  - Compliance investigations            │
│  - Reality layer management             │
│  - Failover & recovery                  │
│  - Multi-sig approval authority         │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│         OPERATOR (Level 2)              │
│  - Transaction execution                │
│  - Evidence collection                  │
│  - Session management                   │
│  - Spatial presence control             │
│  - Event emission                       │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│          CADET (Level 1)                │
│  - View-only access                     │
│  - Limited session creation             │
│  - No mutation permissions              │
│  - Observational telemetry              │
└─────────────────────────────────────────┘
```

---

## Capability Scopes

Each authority level has defined capability scopes that determine what operations are permitted.

### Sovereign Capabilities

Sovereign authority has unrestricted access to all system operations:

| Capability | Scope | Description |
|-----------|-------|-------------|
| `system.initialize` | Global | Initialize sovereign runtime |
| `system.shutdown` | Global | Shutdown runtime cleanly |
| `charter.create` | Global | Create new charters for reality layers |
| `charter.revoke` | Global | Revoke or suspend charters |
| `authority.elevate` | Global | Elevate user authority levels |
| `authority.revoke` | Global | Revoke user authority |
| `federation.join` | Global | Add nodes to federation |
| `federation.remove` | Global | Remove nodes from federation |
| `federation.decide` | Global | Make federation governance decisions |
| `continuity.guarantee` | Global | Ensure continuity preservation |
| `event.replay` | Global | Replay all events for state reconstruction |
| `event.seal` | Global | Seal critical events with cryptographic signature |

### Commander Capabilities

Commander authority manages operational governance:

| Capability | Scope | Description |
|-----------|-------|-------------|
| `treasury.approve` | Treasury | Approve treasury operations |
| `treasury.custody` | Treasury | Manage custody positions |
| `treasury.reconcile` | Treasury | Reconcile multi-chain treasury |
| `compliance.investigate` | Compliance | Initiate compliance investigations |
| `compliance.resolve` | Compliance | Resolve investigations |
| `reality.manage` | Reality | Manage reality layer state |
| `reality.sync` | Reality | Synchronize cross-layer state |
| `failover.trigger` | System | Trigger failover operations |
| `recovery.execute` | System | Execute recovery procedures |
| `multisig.approve` | Treasury | Approve multi-sig transactions |
| `authority.capability` | Authority | Grant/revoke operator capabilities |

### Operator Capabilities

Operator authority executes approved operations:

| Capability | Scope | Description |
|-----------|-------|-------------|
| `transaction.execute` | Ledger | Execute approved transactions |
| `transaction.sign` | Ledger | Sign transactions with keys |
| `evidence.collect` | Compliance | Collect evidence for investigations |
| `evidence.analyze` | Compliance | Analyze evidence with AI |
| `session.create` | Presence | Create user sessions |
| `session.end` | Presence | End user sessions |
| `hologram.create` | Hologram | Create avatar/presence in reality layer |
| `hologram.transform` | Hologram | Transform spatial presence |
| `hologram.destroy` | Hologram | Destroy avatar/presence |
| `event.emit` | Event | Emit operational events |
| `audit.log` | Audit | Create audit log entries |

### Cadet Capabilities

Cadet authority has view-only access:

| Capability | Scope | Description |
|-----------|-------|-------------|
| `view.ledger` | Ledger | View transaction history |
| `view.treasury` | Treasury | View treasury positions |
| `view.compliance` | Compliance | View compliance status |
| `view.reality` | Reality | View reality layer status |
| `view.events` | Event | View event stream (non-sensitive) |
| `session.create` | Presence | Create limited read-only session |
| `telemetry.observe` | Observability | Receive telemetry updates |

---

## Mutation Permission Matrix

The mutation permission matrix defines which authority levels can perform which mutations:

| Operation | Sovereign | Commander | Operator | Cadet |
|-----------|:---------:|:---------:|:--------:|:-----:|
| Create charter | ✓ | ✗ | ✗ | ✗ |
| Revoke charter | ✓ | ✗ | ✗ | ✗ |
| Elevate authority | ✓ | ✗ | ✗ | ✗ |
| Approve treasury op | ✓ | ✓ | ✗ | ✗ |
| Execute transaction | ✓ | ✓ | ✓ | ✗ |
| Sign transaction | ✓ | ✓ | ✓ | ✗ |
| Initiate investigation | ✓ | ✓ | ✗ | ✗ |
| Collect evidence | ✓ | ✓ | ✓ | ✗ |
| Manage reality layer | ✓ | ✓ | ✗ | ✗ |
| Create avatar | ✓ | ✓ | ✓ | ✗ |
| Emit event | ✓ | ✓ | ✓ | ✗ |
| View ledger | ✓ | ✓ | ✓ | ✓ |
| View treasury | ✓ | ✓ | ✓ | ✓ |
| View compliance | ✓ | ✓ | ✓ | ✓ |

---

## Federation Authority Rules

In a federated deployment, authority decisions must be coordinated across nodes:

### Federation Decision Rules

**Rule 1: Sovereign Decisions Require Quorum**

Sovereign-level decisions (charter creation, authority elevation, federation governance) require approval from at least 51% of federation nodes:

```
decision_valid = (approving_nodes / total_nodes) >= 0.51
```

**Rule 2: Commander Decisions Require Consensus**

Commander-level decisions (treasury approval, investigation resolution) require approval from at least 66% of federation nodes:

```
decision_valid = (approving_nodes / total_nodes) >= 0.66
```

**Rule 3: Operator Decisions Are Local**

Operator-level decisions (transaction execution, evidence collection) can be made locally but must be replicated to all federation nodes.

**Rule 4: Authority Elevation Requires Sovereign Quorum**

Authority elevation (cadet → operator → commander → sovereign) requires sovereign-level quorum approval.

**Rule 5: Capability Grants Require Commander Consensus**

Capability grants to operators require commander-level consensus approval.

### Federation Conflict Resolution

When federation nodes disagree on a decision:

1. **Causality Chain Wins**: Event with longest causality chain is canonical
2. **Timestamp Tiebreaker**: Earlier timestamp wins if causality chains are equal
3. **Node ID Tiebreaker**: Lexicographically smaller node ID wins if timestamps are equal
4. **Reconciliation**: Minority nodes replay majority decision and converge

---

## Replay Permissions

Events can only be replayed by authorities with sufficient permissions:

| Event Domain | Sovereign | Commander | Operator | Cadet |
|-------------|:---------:|:---------:|:--------:|:-----:|
| Universe.* | ✓ | ✓ | ✓ | ✓ |
| Presence.* | ✓ | ✓ | ✓ | ✓ |
| Hologram.* | ✓ | ✓ | ✓ | ✓ |
| Ledger.* | ✓ | ✓ | ✓ | ✓ |
| Treasury.* | ✓ | ✓ | ✗ | ✗ |
| Compliance.* | ✓ | ✓ | ✗ | ✗ |
| Authority.* | ✓ | ✗ | ✗ | ✗ |
| Reality.* | ✓ | ✓ | ✗ | ✗ |

**Replay Constraints:**

- Sovereign can replay all events
- Commander can replay operational events (Universe, Presence, Hologram, Ledger)
- Operator can replay non-sensitive events
- Cadet can only view event stream, not replay

---

## Attestation Privileges

Attestation privileges determine who can attest to charter compliance:

| Attestation Type | Required Authority | Quorum |
|-----------------|-------------------|--------|
| Charter creation | Sovereign | 1 (self) |
| Charter verification | Commander | 1 (any commander) |
| Charter attestation | Sovereign | 51% of sovereigns |
| Capability grant | Commander | 1 (any commander) |
| Authority elevation | Sovereign | 51% of sovereigns |
| Federation decision | Sovereign | 51% of sovereigns |

---

## Authority Audit Trail

All authority changes are logged in an immutable audit trail:

```typescript
interface AuthorityAuditEntry {
  auditId: string;
  timestamp: ISO8601;
  action: "elevate" | "revoke" | "grant" | "revoke_capability";
  actor: string;                    // Authority who made change
  target: string;                   // User affected
  fromLevel?: AuthorityLevel;
  toLevel?: AuthorityLevel;
  capability?: string;
  reason?: string;
  signature: string;                // Cryptographic signature
  causality_chain: string[];        // Event causality
}
```

---

## Authority Enforcement

Authority enforcement is implemented at multiple layers:

### 1. tRPC Procedure Level

```typescript
// Example: Protected procedure requiring commander authority
const commanderProcedure = protectedProcedure
  .use(async ({ ctx, next }) => {
    if (ctx.user.authorityLevel !== "commander" && ctx.user.authorityLevel !== "sovereign") {
      throw new TRPCError({ code: "FORBIDDEN", message: "Commander authority required" });
    }
    return next({ ctx });
  });
```

### 2. Event Emission Level

```typescript
// Example: Validate authority before emitting event
function validateEventAuthority(event: CanonicalEvent, user: User): boolean {
  const requiredAuthority = getRequiredAuthority(event.type);
  return hasAuthority(user.authorityLevel, requiredAuthority);
}
```

### 3. Event Replay Level

```typescript
// Example: Validate authority before replaying event
function validateReplayAuthority(event: CanonicalEvent, user: User): boolean {
  const replayableAuthorities = getReplayableAuthorities(event.type);
  return replayableAuthorities.includes(user.authorityLevel);
}
```

### 4. Federation Decision Level

```typescript
// Example: Validate federation quorum for sovereign decision
async function validateFederationDecision(
  decision: FederationDecision,
  requiredQuorum: number
): Promise<boolean> {
  const approvals = await getFederationApprovals(decision.id);
  return (approvals.length / totalNodes) >= requiredQuorum;
}
```

---

## Capability Scope Enforcement

Capabilities are enforced using a scope-based access control model:

```typescript
interface CapabilityScope {
  capability: string;
  scope: "global" | "treasury" | "compliance" | "reality" | "ledger";
  resources?: string[];            // Optional: specific resource IDs
  expiresAt?: ISO8601;              // Optional: expiration time
}

function hasCapability(user: User, capability: string, scope: string): boolean {
  return user.capabilities.some(cap =>
    cap.capability === capability &&
    (cap.scope === "global" || cap.scope === scope) &&
    (!cap.expiresAt || new Date(cap.expiresAt) > new Date())
  );
}
```

---

## Authority Transitions

Authority levels can be elevated or revoked through formal processes:

### Authority Elevation Process

1. **Request**: User or commander requests authority elevation
2. **Verification**: Sovereign verifies user qualifications
3. **Quorum Vote**: 51% of sovereigns must approve
4. **Attestation**: Elevation is attested and sealed
5. **Event Emission**: `Authority.AuthorityElevated` event emitted
6. **Audit Trail**: Entry added to authority audit trail

### Authority Revocation Process

1. **Trigger**: Sovereign or commander initiates revocation
2. **Reason**: Reason documented in audit trail
3. **Notification**: User notified of revocation
4. **Enforcement**: All sessions terminated, capabilities revoked
5. **Event Emission**: `Authority.AuthorityRevoked` event emitted
6. **Audit Trail**: Entry added to authority audit trail

---

## Testing Authority Model

Comprehensive tests verify authority enforcement:

```typescript
describe("Authority Model", () => {
  describe("Mutation Permissions", () => {
    test("Sovereign can create charter", async () => { /* ... */ });
    test("Commander cannot create charter", async () => { /* ... */ });
    test("Operator cannot create charter", async () => { /* ... */ });
    test("Cadet cannot create charter", async () => { /* ... */ });
  });

  describe("Federation Decisions", () => {
    test("Sovereign decision requires 51% quorum", async () => { /* ... */ });
    test("Commander decision requires 66% consensus", async () => { /* ... */ });
    test("Minority nodes reconcile to majority", async () => { /* ... */ });
  });

  describe("Replay Permissions", () => {
    test("Sovereign can replay all events", async () => { /* ... */ });
    test("Commander cannot replay Authority events", async () => { /* ... */ });
    test("Cadet cannot replay events", async () => { /* ... */ });
  });

  describe("Authority Transitions", () => {
    test("Authority elevation requires quorum", async () => { /* ... */ });
    test("Authority revocation terminates sessions", async () => { /* ... */ });
    test("Audit trail records all changes", async () => { /* ... */ });
  });
});
```

---

## Next Steps

1. **Implement authority validation** in all tRPC procedures
2. **Create capability registry** with all capabilities and scopes
3. **Build federation decision engine** for quorum voting
4. **Implement authority audit trail** with immutable logging
5. **Create authority management UI** for sovereign operators
6. **Write comprehensive tests** for authority enforcement
7. **Document authority policies** for operators

---

This authority model specification ensures coherent governance across the Sovereign System, enabling secure, auditable, and federated decision-making at all operational levels.
