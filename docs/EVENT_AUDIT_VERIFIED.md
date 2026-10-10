# Sovereign System Portal - Verified Event Audit

## Overview
This document enumerates **verified** event types actually emitted in the codebase, based on direct code analysis.

## Verified Event Types by Module

### 1. Socket.io Connection Events (socket-server.ts)

#### Connection & Subscription
- `connected` - Client connected to Socket.io
- `subscribed` - Client subscribed to channel (ledger, treasury, agents, all)
- `unsubscribed` - Client unsubscribed from channel

### 2. Ledger Module Events (socket-server.ts)

#### Ledger Channel Events
- `ledger:event` - Broadcast to ledger-channel subscribers
  - Structure: `{ type: string, hash?: string, timestamp: ISO8601, data?: Record<string, unknown> }`

### 3. Treasury Module Events (socket-server.ts)

#### Treasury Channel Events
- `treasury:event` - Broadcast to treasury-channel subscribers
  - Structure: `{ type: string, transactionId?: string, chain?: string, timestamp: ISO8601, data?: Record<string, unknown> }`

### 4. Monitor Module Events (socket-monitor.ts)

#### Session Management
- `monitor:init` - Monitor session initialized
- `monitor:filtered` - Filtered results returned
- `monitor:details` - Detailed information provided
- `monitor:error` - Error occurred

#### Status Updates
- `monitor:retry_initiated` - Retry started
- `monitor:update` - Status updated
- `monitor:status_changed` - Status changed
- `monitor:confirmed` - Operation confirmed
- `monitor:failed` - Operation failed

### 5. VR Backend Module Events (vr-backend-router.ts)

#### Metrics Pipeline Events
- `vr.sessions.frame_rate` - Frame rate metric
  - Labels: `session_id`
- `vr.sessions.latency` - Latency metric
- `gentis.decisions.total` - Gentis decision counter
  - Labels: `tool`, `success`
- `geogentic.queries.total` - GeoGentic query counter
  - Labels: `type`
- `geogentic.queries.latency` - GeoGentic latency metric
  - Labels: `type`

### 6. AEGENTIS CloudShell Module Events (aegentis-cloudshell.router.ts)

#### Event Bus Emissions
- `ledger-entry` - New ledger entry from CloudShell
- `manifest-update` - Manifest updated
- `telemetry` - System telemetry data
- `directive` - Operational directive

### 7. AEGENTIS Agentic Operations (esc-agentic-operations.ts)

#### EventEmitter Emissions
- `threat:assessed` - Threat assessment completed
- `decision:made` - Decision made
- `policy:updated` - Policy updated

## Verified Event Mapping to Canonical Ontology

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
- `geogentic.queries.latency` → `Hologram.spatial_query_latency`

### Ledger.* Events
- `ledger:event` → `Ledger.transaction_recorded`
- `ledger-entry` → `Ledger.entry_appended`

### Treasury.* Events
- `treasury:event` → `Treasury.transaction_initiated`

### Authority.* Events
- `threat:assessed` → `Authority.threat_assessed`
- `decision:made` → `Authority.decision_made`
- `policy:updated` → `Authority.policy_updated`

### Reality.* Events (Not Yet Verified)
- Federation events not yet emitted in current codebase

### Compliance.* Events (Not Yet Verified)
- Compliance events not yet emitted in current codebase

## Unimplemented Event Categories

The following canonical event categories are defined but not yet emitted:

1. **Compliance.*** - Investigation, alerts, resolutions
2. **Federation.*** - Peer connections, consensus, sync
3. **Reality.*** - Layer connections, state synchronization

These should be implemented in Phase 16-18 as per the roadmap.

## Event Emission Patterns

### Pattern 1: Socket.io Broadcast
```typescript
io.to('channel-name').emit('event:name', data);
```
Used for: Ledger, Treasury, Monitor events

### Pattern 2: EventEmitter
```typescript
this.emit('event:name', data);
```
Used for: AEGENTIS operations

### Pattern 3: Metrics Pipeline
```typescript
metricsPipeline.emit('metric.name', value, labels);
```
Used for: VR metrics

### Pattern 4: Event Bus
```typescript
eventBus.emit('event-name', data);
```
Used for: CloudShell integration

## Verification Status

| Module | Status | Evidence |
|--------|--------|----------|
| Socket.io Connection | ✅ Verified | socket-server.ts |
| Ledger | ✅ Verified | socket-server.ts |
| Treasury | ✅ Verified | socket-server.ts |
| Monitor | ✅ Verified | socket-monitor.ts |
| VR Backend | ✅ Verified | vr-backend-router.ts |
| AEGENTIS CloudShell | ✅ Verified | aegentis-cloudshell.router.ts |
| AEGENTIS Operations | ✅ Verified | esc-agentic-operations.ts |
| Compliance | ❌ Not Verified | No emit calls found |
| Federation | ❌ Not Verified | No emit calls found |
| Reality | ❌ Not Verified | No emit calls found |

## Next Steps

1. Implement Compliance event emissions (investigation, alerts)
2. Implement Federation event emissions (peer, consensus, sync)
3. Implement Reality layer event emissions
4. Add authority enforcement to event emissions
5. Add replay permission checks
6. Create end-to-end event flow tests
