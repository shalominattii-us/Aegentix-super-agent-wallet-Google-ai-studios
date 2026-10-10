# Nanotransaction Engine Architecture

## Overview

The Nanotransaction Engine is the atomic economic substrate of the Sovereign Runtime, generating, validating, scoring, and settling ultra-lightweight transactions as the currency of trust across all AEGENTIX systems.

## Core Architecture

### 1. Nanotransaction Packet Structure

```typescript
interface NanotransactionPacket {
  packetId: string;                // Unique identifier
  arenaId: string;                 // Ephemeral computation space
  actorId: string;                 // Actor performing transaction
  actorSignature: string;          // Cryptographic signature
  actionHash: string;              // SHA256 hash of action
  integrityScore: number;          // 0-100 trust score
  safetyDelta: number;             // -100 to +100 risk adjustment
  timestamp: string;               // ISO 8601 timestamp
  trustCoefficient: number;        // 0-1 normalized trust
  ulltPacket: ULLTPacket;         // Ultra-light ledger token
  slotMemoryTrace: SlotMemoryTrace; // Forensic record
}
```

### 2. Integrity Scoring Module

Multi-factor integrity scoring based on:

- **Actor Reputation** (30%): Historical behavior and trust record
- **Context Risk** (30%): Action type and environmental factors
- **Historical Behavior** (20%): Actor's past performance
- **Mesh Consensus** (20%): Network agreement on action validity

```typescript
interface IntegrityScore {
  score: number;                   // 0-100 final score
  safetyDelta: number;             // Risk adjustment
  trustCoefficient: number;        // Normalized 0-1
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  factors: {
    actorReputation: number;
    actionType: string;
    contextRisk: number;
    historicalBehavior: number;
    meshConsensus: number;
  };
}
```

### 3. ULLT Packet Generation

Ultra-Light Ledger Token packets with trust levels:

```typescript
interface ULLTPacket {
  packetId: string;                // Unique ULLT identifier
  actorSignature: string;          // Cryptographic proof
  actionHash: string;              // Action fingerprint
  integrityScore: number;          // Integrity score
  safetyDelta: number;             // Risk adjustment
  timestamp: string;               // Creation time
  arenaId: string;                 // Associated arena
  trustLevel: 'critical' | 'high' | 'medium' | 'low';
  expiresAt: string;               // Expiration time (1 minute TTL)
}
```

**Trust Levels:**
- **Critical**: Score ≥ 80 (highest trust, immediate execution)
- **High**: Score ≥ 60 (trusted, standard execution)
- **Medium**: Score ≥ 40 (monitored, conditional execution)
- **Low**: Score < 40 (restricted, requires approval)

### 4. Ephemeral Arena Manager

Temporary computation spaces for transaction batching and consensus:

```typescript
interface EphemeralArena {
  arenaId: string;                 // Unique arena identifier
  createdAt: string;               // Creation timestamp
  expiresAt: string;               // Expiration (5 minute TTL)
  runtimeId: string;               // Associated runtime
  status: 'active' | 'completed' | 'expired';
  nanotransactionCount: number;    // Transaction count
  totalValue: number;              // Aggregated trust value
  packets: NanotransactionPacket[]; // Contained packets
}
```

**Lifecycle:**
1. **Active**: Accepting new transactions
2. **Completed**: All transactions settled
3. **Expired**: TTL exceeded, archived

### 5. Slot Memory Trace Engine

Forensic recording for audit and replay:

```typescript
interface SlotMemoryTrace {
  traceId: string;                 // Unique trace identifier
  arenaId: string;                 // Associated arena
  actorId: string;                 // Actor reference
  actionHash: string;              // Action fingerprint
  integrityScore: number;          // Score at time of trace
  ulltPacketId: string;            // Associated ULLT
  replayPointer: number;           // Replay sequence number
  timestamp: string;               // Trace timestamp
  forensicData: Record<string, unknown>; // Audit data
}
```

**Forensic Data:**
- Runtime ID and state
- Arena count and packet count
- Execution context
- Environmental conditions

### 6. Mesh Propagation Module

Distributed execution across network:

```typescript
interface MeshPropagationEvent {
  eventId: string;                 // Event identifier
  packetId: string;                // Nanotransaction reference
  sourceNode: string;              // Originating node
  targetNodes: string[];           // Target nodes
  status: 'pending' | 'propagated' | 'confirmed';
  timestamp: string;               // Event time
  consensusReached: boolean;       // Consensus status
}
```

## Transaction Flow

### 1. Generation Phase

```
Actor Action
    ↓
Hash Action (SHA256)
    ↓
Sign Action (HMAC-SHA256)
    ↓
Score Integrity (Multi-factor)
    ↓
Generate ULLT Packet
    ↓
Create Slot Memory Trace
    ↓
Create Nanotransaction Packet
```

### 2. Validation Phase

```
Validate Packet Structure
    ↓
Verify Integrity Score (0-100)
    ↓
Verify Trust Coefficient (0-1)
    ↓
Validate ULLT Packet
    ↓
Validate Slot Memory Trace
    ↓
Packet Valid ✓
```

### 3. Settlement Phase

```
Propagate to Mesh Nodes
    ↓
Achieve Consensus
    ↓
Record in Slot Memory
    ↓
Update Actor Reputation
    ↓
Archive in Ledger
    ↓
Transaction Settled ✓
```

## Performance Characteristics

### Throughput

- **Nanotransaction Generation**: < 50ms average latency
- **Integrity Scoring**: < 10ms per transaction
- **Mesh Propagation**: < 100ms network propagation
- **Concurrent Transactions**: 20+ simultaneous without degradation

### Resource Usage

- **Memory per Packet**: ~2KB
- **Memory per Arena**: ~50KB (100 transactions)
- **Storage per Trace**: ~1KB
- **Network per Propagation**: ~500 bytes

### Scalability

- **Arenas per Runtime**: Unlimited (TTL-based cleanup)
- **Transactions per Arena**: 1000+ (configurable)
- **Mesh Nodes**: 100+ supported
- **Trust Coefficient Precision**: 0.01 (100 levels)

## Security Model

### Signature Verification

- **Algorithm**: HMAC-SHA256
- **Key**: Runtime ID (unique per instance)
- **Verification**: Signature matches action hash

### Integrity Scoring

- **Reputation Tracking**: Per-actor historical scores
- **Context Risk Assessment**: Action-type specific
- **Mesh Consensus**: Distributed agreement
- **Safety Delta**: Risk-adjusted scoring

### Audit Trail

- **Immutable Records**: Slot memory traces
- **Forensic Data**: Complete execution context
- **Replay Capability**: Deterministic replay from traces
- **Compliance**: Full regulatory audit trail

## Integration Points

### 1. Portal System

- Display nanotransaction metrics
- Monitor integrity scores
- Track actor reputation
- View mesh propagation status

### 2. VR System

- Spatial representation of transactions
- Arena visualization
- Actor reputation avatars
- Real-time mesh network display

### 3. Federation System

- Distributed consensus
- Cross-node propagation
- Federated ledger recording
- Authority-based settlement

### 4. Ledger System

- Immutable transaction recording
- Compliance audit trail
- Regulatory reporting
- Historical analysis

## Configuration

### Arena TTL

```typescript
// Default: 5 minutes (300000 ms)
const arenaTTL = 300000;
```

### ULLT Expiration

```typescript
// Default: 1 minute (60000 ms)
const ulltTTL = 60000;
```

### Integrity Thresholds

```typescript
const TRUST_LEVELS = {
  CRITICAL: 80,  // Score ≥ 80
  HIGH: 60,      // Score ≥ 60
  MEDIUM: 40,    // Score ≥ 40
  LOW: 0,        // Score < 40
};
```

### Scoring Weights

```typescript
const SCORING_WEIGHTS = {
  ACTOR_REPUTATION: 0.3,
  CONTEXT_RISK: 0.3,
  HISTORICAL_BEHAVIOR: 0.2,
  MESH_CONSENSUS: 0.2,
};
```

## API Reference

### Engine Creation

```typescript
import { getNanotransactionEngine } from './nanotransaction-engine';

const engine = getNanotransactionEngine('runtime-id');
```

### Generate Nanotransaction

```typescript
const packet = await engine.generateNanotransaction(
  actorId,           // Actor performing action
  actionType,        // 'treasury.transfer', 'compliance.investigation', etc.
  context,           // Action-specific context
  historicalBehavior // 0-1 historical score
);
```

### Validate Packet

```typescript
const isValid = engine.validatePacket(packet);
```

### Settle Transaction

```typescript
const settled = await engine.settleNanotransaction(packetId);
```

### Propagate to Mesh

```typescript
const event = await engine.propagateToMesh(
  packetId,
  ['node-1', 'node-2', 'node-3']
);
```

### Get System Status

```typescript
const status = engine.getStatus();
// {
//   runtimeId: string,
//   arenaCount: number,
//   activeArenas: number,
//   packetCount: number,
//   traceCount: number,
//   propagationEventCount: number,
//   totalValue: number
// }
```

## Monitoring & Observability

### Metrics

- **Nanotransactions per Second**: Throughput metric
- **Average Integrity Score**: Quality metric
- **Mesh Propagation Success Rate**: Reliability metric
- **Arena Utilization**: Efficiency metric
- **Actor Reputation Distribution**: Health metric

### Events

- `transaction_created`: New nanotransaction generated
- `integrity_scored`: Integrity score calculated
- `ullt_packet_generated`: ULLT packet created
- `arena_created`: New ephemeral arena created
- `mesh_node_registered`: Mesh node joined
- `consensus_achieved`: Mesh consensus reached
- `arena_finalized`: Arena completed and finalized
- `arena_expired`: Arena TTL exceeded

### Logging

```typescript
engine.on('transaction_created', (packet) => {
  console.log(`[NANOTX] Created: ${packet.packetId}`);
});

engine.on('integrity_scored', (score) => {
  console.log(`[INTEGRITY] Score: ${score.score} (${score.riskLevel})`);
});

engine.on('consensus_achieved', ({ arenaId, nodes }) => {
  console.log(`[CONSENSUS] Arena ${arenaId} reached consensus with ${nodes} nodes`);
});
```

## Best Practices

1. **Batch Transactions**: Group related transactions in same arena
2. **Monitor Scores**: Track integrity score trends per actor
3. **Propagate Widely**: Ensure mesh propagation to all nodes
4. **Archive Traces**: Regularly export forensic traces
5. **Validate Always**: Never skip packet validation
6. **Monitor Reputation**: Track and update actor reputation scores
7. **Clean Up Arenas**: Implement TTL-based arena cleanup
8. **Audit Regularly**: Review slot memory traces for compliance

## Troubleshooting

### Low Integrity Scores

- Check actor reputation history
- Review context risk assessment
- Verify historical behavior data
- Validate mesh consensus

### Propagation Failures

- Verify target nodes are online
- Check network connectivity
- Review mesh node status
- Retry with exponential backoff

### Arena Expiration

- Increase arena TTL if needed
- Batch transactions more efficiently
- Monitor arena utilization
- Archive before expiration

## References

- [Patent Claims](./NANOTRANSACTION_PATENT_CLAIMS.md)
- [Compliance Framework](./NANOTRANSACTION_COMPLIANCE_FRAMEWORK.md)
- [Investor Materials](./NANOTRANSACTION_INVESTOR_ONEPAGER.md)
- [Event Ontology](./EVENT_ONTOLOGY.md)
