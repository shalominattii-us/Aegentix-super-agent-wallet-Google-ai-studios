# Sovereign System Portal - Event Audit Document

## Overview
This document enumerates all current event types across Portal, Treasury, VR, Federation, and Compliance modules, mapping them to the canonical event ontology.

## Current Event Types by Module

### 1. Portal Module Events

#### Connection & Subscription Events
- `connected` - Socket.io client connection established
- `subscribed` - Client subscribed to event channel (ledger, treasury, agents, all)
- `unsubscribed` - Client unsubscribed from event channel

#### Monitor Events (socket-monitor.ts)
- `monitor:init` - Monitor session initialized
- `monitor:filtered` - Filtered monitor results returned
- `monitor:details` - Detailed monitor information
- `monitor:error` - Monitor error occurred
- `monitor:retry_initiated` - Retry initiated for failed operation
- `monitor:update` - Monitor status updated
- `monitor:status_changed` - Monitor status changed
- `monitor:confirmed` - Operation confirmed
- `monitor:failed` - Operation failed

### 2. Ledger Module Events (socket-server.ts)

#### Transaction Events
- `ledger:event` - Generic ledger event (broadcast to ledger-channel)
- `ledger-entry` - New ledger entry created (from aegentis-cloudshell)

#### Event Structure
```typescript
{
  type: 'transaction' | 'verification' | 'attestation',
  hash: string,
  timestamp: ISO8601,
  data: Record<string, unknown>
}
```

### 3. Treasury Module Events (socket-server.ts)

#### Multi-Sig Events
- `treasury:event` - Generic treasury event (broadcast to treasury-channel)
- `multi-sig:approval` - Multi-sig approval requested
- `multi-sig:signed` - Multi-sig signature added
- `multi-sig:executed` - Multi-sig transaction executed

#### Custody Events
- `custody:update` - Custody status updated
- `custody:transfer` - Custody transferred between chains

#### Event Structure
```typescript
{
  type: 'approval' | 'execution' | 'custody',
  transactionId: string,
  chain: string,
  timestamp: ISO8601,
  data: Record<string, unknown>
}
```

### 4. VR Module Events (vr-backend-router.ts)

#### Session Events
- `vr.sessions.frame_rate` - VR frame rate metric
- `vr.sessions.latency` - VR latency metric

#### Gentis AI Events
- `gentis.decisions.total` - Gentis AI decision made
  - Labels: `tool`, `success`

#### GeoGentic Events
- `geogentic.queries.total` - GeoGentic spatial query executed
  - Labels: `type`
- `geogentic.queries.latency` - GeoGentic query latency
  - Labels: `type`

#### Custom Metrics
- `custom:metric` - Custom metric emission (generic)
  - Parameters: `name`, `value`, `labels`

### 5. Compliance Module Events

#### Investigation Events
- `compliance:investigation_started` - Investigation initiated
- `compliance:investigation_updated` - Investigation state changed
- `compliance:investigation_resolved` - Investigation completed

#### Alert Events
- `compliance:alert_raised` - Compliance alert triggered
- `compliance:alert_acknowledged` - Alert acknowledged
- `compliance:alert_resolved` - Alert resolved

#### Event Structure
```typescript
{
  type: 'investigation' | 'alert',
  id: string,
  severity: 'low' | 'medium' | 'high' | 'critical',
  timestamp: ISO8601,
  data: Record<string, unknown>
}
```

### 6. Federation Module Events

#### Federation Events
- `federation:peer_connected` - Peer connected to federation
- `federation:peer_disconnected` - Peer disconnected
- `federation:consensus_reached` - Federation consensus achieved
- `federation:state_synced` - Federation state synchronized

#### Event Structure
```typescript
{
  type: 'peer' | 'consensus' | 'sync',
  peerId: string,
  timestamp: ISO8601,
  data: Record<string, unknown>
}
```

### 7. AEGENTIS Module Events (esc-agentic-operations.ts)

#### Threat Assessment Events
- `threat:assessed` - Threat assessment completed
- `threat:escalated` - Threat escalated

#### Decision Events
- `decision:made` - AEGENTIS decision made
- `decision:executed` - Decision executed

#### Policy Events
- `policy:updated` - Policy updated
- `policy:enforced` - Policy enforced

#### Event Structure
```typescript
{
  type: 'threat' | 'decision' | 'policy',
  authority: 'sovereign' | 'commander' | 'operator' | 'cadet',
  timestamp: ISO8601,
  data: Record<string, unknown>
}
```

### 8. AEGENTIS CloudShell Events (aegentis-cloudshell.router.ts)

#### Ledger Events
- `ledger-entry` - New ledger entry from CloudShell

#### Manifest Events
- `manifest-update` - Manifest updated

#### Telemetry Events
- `telemetry` - System telemetry data

#### Directive Events
- `directive` - Operational directive

## Mapping to Canonical Ontology

### Universe.* Events
- `connected` → `Universe.initialized`
- `subscribed` → `Universe.channel_subscribed`
- `unsubscribed` → `Universe.channel_unsubscribed`

### Presence.* Events
- `monitor:init` → `Presence.session_started`
- `monitor:status_changed` → `Presence.status_changed`
- `monitor:confirmed` → `Presence.confirmed`
- `monitor:failed` → `Presence.failed`

### Hologram.* Events
- `vr.sessions.frame_rate` → `Hologram.frame_rate_updated`
- `vr.sessions.latency` → `Hologram.latency_updated`
- `gentis.decisions.total` → `Hologram.decision_made`
- `geogentic.queries.total` → `Hologram.spatial_query_executed`

### Ledger.* Events
- `ledger:event` → `Ledger.transaction_recorded`
- `ledger-entry` → `Ledger.entry_appended`

### Treasury.* Events
- `treasury:event` → `Treasury.transaction_initiated`
- `multi-sig:approval` → `Treasury.approval_requested`
- `multi-sig:signed` → `Treasury.signature_added`
- `multi-sig:executed` → `Treasury.execution_completed`
- `custody:update` → `Treasury.custody_updated`

### Compliance.* Events
- `compliance:investigation_started` → `Compliance.investigation_initiated`
- `compliance:investigation_updated` → `Compliance.investigation_progressed`
- `compliance:investigation_resolved` → `Compliance.investigation_completed`
- `compliance:alert_raised` → `Compliance.alert_triggered`

### Authority.* Events
- `threat:assessed` → `Authority.threat_assessed`
- `decision:made` → `Authority.decision_made`
- `policy:updated` → `Authority.policy_updated`
- `federation:consensus_reached` → `Authority.consensus_reached`

### Reality.* Events
- `federation:peer_connected` → `Reality.layer_connected`
- `federation:peer_disconnected` → `Reality.layer_disconnected`
- `federation:state_synced` → `Reality.state_synchronized`

## Event Version Registry

### Current Version: 1.0

#### Version 1.0 Events
- All events listed above
- No migration rules (baseline)

#### Compatibility Rules
- Events are forward-compatible within major version
- Minor version bumps add optional fields
- Major version bumps require migration

## Legacy Event Mapping

### From Previous Implementations
- `Agent event: error` → `Authority.error_reported`
- `Agent event: deployment` → `Authority.deployment_initiated`
- `Ledger event: transaction` → `Ledger.transaction_recorded`
- `Treasury event: multi-sig` → `Treasury.approval_requested`

## Event Flow Paths

### Portal → Treasury → Ledger
1. User initiates transaction (Portal)
2. Multi-sig approval requested (Treasury)
3. Signatures collected (Treasury)
4. Transaction executed (Treasury)
5. Ledger entry appended (Ledger)

### VR → Gentis → GeoGentic → Authority
1. VR session starts (Hologram)
2. Gentis AI decision made (Hologram)
3. GeoGentic spatial query (Hologram)
4. Authority decision made (Authority)
5. Policy enforced (Authority)

### Compliance → Investigation → Resolution
1. Alert triggered (Compliance)
2. Investigation initiated (Compliance)
3. Evidence collected (Compliance)
4. AI analysis completed (Compliance)
5. Resolution documented (Compliance)

### Federation → Consensus → Sync
1. Peer connected (Reality)
2. State exchange initiated (Reality)
3. Consensus reached (Authority)
4. State synchronized (Reality)

## Next Steps

1. Implement event version registry with compatibility/migration rules
2. Add Vitest coverage for canonical event schema validation
3. Implement authority enforcement for event emission
4. Add replay permission enforcement
5. Create event audit trail with immutable store
6. Wire authority validation into all tRPC procedures
7. Test end-to-end event flows across all modules
