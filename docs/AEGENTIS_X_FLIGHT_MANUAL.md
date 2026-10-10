# AEGENTIS-X Flight Manual

**Version:** 1.0  
**Classification:** OPERATIONAL / COMMAND AUTHORITY  
**Effective Date:** June 2026  
**Authority Level Required:** COMMANDER or higher  
**Platforms:** VR Portal (Meta Quest 3, Apple Vision Pro, Windows MR)

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Authority Model](#authority-model)
3. [Command Protocol](#command-protocol)
4. [Core Commands](#core-commands)
5. [Voice Command Reference](#voice-command-reference)
6. [Gesture Controls](#gesture-controls)
7. [Decision Engine](#decision-engine)
8. [Operational Workflows](#operational-workflows)
9. [Emergency Procedures](#emergency-procedures)
10. [Troubleshooting](#troubleshooting)

---

## System Overview

### What is AEGENTIS-X?

**AEGENTIS-X** is an immersive-only sovereign AI entity that serves as the primary commander interface within the VR Portal. Unlike the web-based AEGENTIS, AEGENTIS-X is designed exclusively for VR environments and provides:

- **Spatial Presence:** Appears as a holographic entity in your VR environment
- **Voice Interface:** Natural language command processing
- **Gesture Recognition:** Hand and eye-gaze based control
- **Real-Time Decision Making:** Autonomous decision engine with authority hierarchy
- **Immersive Feedback:** Spatial audio, haptic feedback, visual indicators

### Core Capabilities

| Capability | Description | Authority Required |
|-----------|-------------|-------------------|
| **Identity Management** | Query and verify identity, seals, authority | CADET+ |
| **Command Execution** | Execute treasury and compliance operations | COMMANDER+ |
| **Skill Synthesis** | Mint assets and create new operations | COMMANDER+ |
| **Federation Management** | Peer discovery, sync, consensus | COMMANDER+ |
| **Charter Management** | Seal/revoke reality layer charters | SOVEREIGN |
| **System Diagnostics** | Health checks, performance monitoring | OPERATOR+ |
| **Emergency Response** | Lockdown, revocation, incident response | SOVEREIGN |

### Architecture

```
VR Portal (User Interface)
    ↓
AEGENTIS-X (Immersive Commander)
    ├─ Voice Recognition Engine
    ├─ Gesture Recognition Engine
    ├─ Decision Engine (Authority-Based)
    └─ Real-Time Execution Layer
    ↓
cogn8tives Gateway (HTTP Proxy)
    ├─ JWT Forwarding
    ├─ Nonce Verification
    └─ mTLS Header Injection
    ↓
AEGENTIS Core (Fastify Source of Truth)
    ├─ Event-Sourced State
    ├─ Authority Enforcement
    └─ Hash-Chained Integrity
```

---

## Authority Model

### Authority Hierarchy

AEGENTIS-X enforces a strict authority hierarchy for all operations:

```
SOVEREIGN (Highest)
    ├─ Can modify governance rules
    ├─ Can revoke other authorities
    ├─ Can execute critical operations
    └─ Requires dual authentication
         ↓
COMMANDER
    ├─ Can execute treasury operations
    ├─ Can manage federation peers
    ├─ Can approve multi-sig transactions
    └─ Requires biometric authentication
         ↓
OPERATOR
    ├─ Can execute routine commands
    ├─ Can query system state
    ├─ Can approve routine transactions
    └─ Requires PIN + biometric
         ↓
CADET (Lowest)
    ├─ Can view dashboards
    ├─ Can query data
    ├─ Cannot execute commands
    └─ Requires PIN only
```

### Capability Scopes

**SOVEREIGN Capabilities:**
- Modify authority rules
- Revoke authorities
- Execute critical operations
- Seal/revoke charters
- Access all logs
- Override decisions
- Manage federation consensus

**COMMANDER Capabilities:**
- Execute treasury operations
- Manage federation peers
- Approve multi-sig transactions
- Execute skill synthesis
- Access operational logs
- Delegate authority
- Approve compliance decisions

**OPERATOR Capabilities:**
- Execute routine commands
- Query system state
- Approve routine transactions
- View compliance alerts
- Access operational dashboards
- Request authority elevation

**CADET Capabilities:**
- View dashboards
- Query data
- View audit logs (limited)
- Request operations
- Cannot execute commands

### Authority Verification

Every command execution requires authority verification:

1. **Check Authority Level** - Confirm user has required authority
2. **Verify Expiration** - Ensure authority not expired
3. **Check Delegation** - Verify if authority is delegated
4. **Confirm Capability** - Ensure authority includes required capability
5. **Require Authentication** - Request appropriate authentication factor
6. **Log Authorization** - Record authorization decision
7. **Execute Command** - Proceed with operation

---

## Command Protocol

### Command Structure

Every command sent to AEGENTIS-X follows this structure:

```json
{
  "command_id": "cmd_1717584000_a1b2c3d4",
  "timestamp": 1717584000000,
  "authority": "COMMANDER",
  "command_type": "EXECUTE",
  "operation": {
    "type": "SKILL_SYNTHESIS",
    "action": "MINT_ASSET",
    "parameters": {
      "asset_type": "TREASURY_TOKEN",
      "quantity": 1000,
      "recipient": "operator@sovereignsystem.gov"
    }
  },
  "authentication": {
    "method": "BIOMETRIC",
    "factor": "FINGERPRINT",
    "nonce": "nonce_abc123xyz789"
  },
  "signature": "hmac_sha256_signature_here"
}
```

### Command Lifecycle

```
User Issues Command
    ↓
AEGENTIS-X Receives Command
    ├─ Parse command
    ├─ Validate syntax
    └─ Check authority
    ↓
Authority Verification
    ├─ Check authority level
    ├─ Verify expiration
    ├─ Check capability scope
    └─ Require authentication
    ↓
Decision Engine
    ├─ Evaluate command
    ├─ Check federation consensus (if required)
    ├─ Verify compliance
    └─ Generate decision
    ↓
Execution
    ├─ Send to AEGENTIS Core
    ├─ Monitor execution
    ├─ Collect results
    └─ Update state
    ↓
Response
    ├─ Return results to user
    ├─ Log command execution
    ├─ Send notifications
    └─ Update dashboards
```

---

## Core Commands

### Identity Commands

#### `get_identity`

Retrieve current identity and authority information.

**Syntax:**
```
"Get identity" or "Show identity"
```

**Parameters:**
- None

**Returns:**
```json
{
  "user_id": "user_12345",
  "name": "Commander Smith",
  "authority": "COMMANDER",
  "authority_expiration": "2026-12-31T23:59:59Z",
  "seals": ["SEAL_001", "SEAL_002"],
  "federation_status": "ACTIVE",
  "multi_factor_enabled": true,
  "last_authentication": "2026-06-05T02:50:00Z"
}
```

**Authority Required:** CADET+

---

#### `check_authority`

Verify current authority level and capabilities.

**Syntax:**
```
"Check authority" or "What is my authority level?"
```

**Parameters:**
- None

**Returns:**
```json
{
  "authority": "COMMANDER",
  "capabilities": [
    "EXECUTE_TREASURY",
    "MANAGE_FEDERATION",
    "SKILL_SYNTHESIS",
    "APPROVE_MULTISIG"
  ],
  "restrictions": [
    "CANNOT_REVOKE_AUTHORITY",
    "CANNOT_MODIFY_RULES"
  ],
  "expiration": "2026-12-31T23:59:59Z"
}
```

**Authority Required:** CADET+

---

### Treasury Commands

#### `execute_treasury_operation`

Execute a treasury operation (mint, transfer, burn, etc.).

**Syntax:**
```
"Mint 1000 tokens for operator@sovereignsystem.gov"
"Transfer 500 tokens to peer_federation_01"
"Burn 100 tokens from reserve"
```

**Parameters:**
- `operation_type`: MINT | TRANSFER | BURN | SWAP | STAKE
- `amount`: Numeric quantity
- `recipient`: User ID or federation peer
- `asset_type`: TREASURY_TOKEN | COMPLIANCE_TOKEN | etc.

**Returns:**
```json
{
  "transaction_id": "txn_1717584000_xyz789",
  "status": "PENDING",
  "operation_type": "MINT",
  "amount": 1000,
  "recipient": "operator@sovereignsystem.gov",
  "timestamp": 1717584000000,
  "confirmation_required": true,
  "multi_sig_approvers": ["commander_01", "commander_02"]
}
```

**Authority Required:** COMMANDER+

**Multi-Sig Required:** Yes (for amounts >10,000)

---

#### `approve_multisig`

Approve a multi-signature transaction.

**Syntax:**
```
"Approve transaction txn_1717584000_xyz789"
"Approve multi-sig for 5000 tokens"
```

**Parameters:**
- `transaction_id`: Transaction to approve
- `approval_reason`: Optional reason for approval

**Returns:**
```json
{
  "transaction_id": "txn_1717584000_xyz789",
  "approval_count": 2,
  "approvals_required": 3,
  "status": "PENDING",
  "approvers": ["commander_01", "commander_02"],
  "remaining_approvers": ["commander_03"]
}
```

**Authority Required:** COMMANDER+

---

### Skill Synthesis Commands

#### `execute_skill_synthesis`

Execute a skill synthesis command to create or modify assets.

**Syntax:**
```
"Synthesize new treasury token"
"Create compliance report"
"Execute federation sync"
```

**Parameters:**
- `skill_type`: MINT_ASSET | CREATE_REPORT | SYNC_FEDERATION | etc.
- `parameters`: Skill-specific parameters

**Returns:**
```json
{
  "skill_id": "skill_1717584000_abc123",
  "status": "EXECUTING",
  "skill_type": "MINT_ASSET",
  "progress": 0,
  "estimated_completion": "2026-06-05T02:51:00Z",
  "results": {}
}
```

**Authority Required:** COMMANDER+

---

### Federation Commands

#### `get_federation_status`

Query federation peer status and connectivity.

**Syntax:**
```
"Show federation status"
"List federation peers"
"Check peer connectivity"
```

**Parameters:**
- None

**Returns:**
```json
{
  "federation_status": "ACTIVE",
  "peers": [
    {
      "peer_id": "peer_001",
      "name": "Federation Node 1",
      "status": "ONLINE",
      "latency_ms": 25,
      "last_sync": "2026-06-05T02:50:00Z"
    },
    {
      "peer_id": "peer_002",
      "name": "Federation Node 2",
      "status": "ONLINE",
      "latency_ms": 35,
      "last_sync": "2026-06-05T02:49:30Z"
    }
  ],
  "consensus_status": "AGREED"
}
```

**Authority Required:** OPERATOR+

---

#### `sync_federation`

Synchronize state with federation peers.

**Syntax:**
```
"Sync federation"
"Synchronize with peers"
"Update federation state"
```

**Parameters:**
- None

**Returns:**
```json
{
  "sync_id": "sync_1717584000_def456",
  "status": "IN_PROGRESS",
  "peers_synced": 2,
  "peers_total": 2,
  "progress": 50,
  "estimated_completion": "2026-06-05T02:51:30Z"
}
```

**Authority Required:** COMMANDER+

---

### Charter Management Commands

#### `seal_charter`

Seal a reality layer charter (SOVEREIGN only).

**Syntax:**
```
"Seal charter for layer 1"
"Activate charter CHARTER_001"
```

**Parameters:**
- `charter_id`: Charter to seal
- `reason`: Reason for sealing

**Returns:**
```json
{
  "charter_id": "CHARTER_001",
  "status": "SEALED",
  "layer": "REALITY_LAYER_1",
  "sealed_by": "sovereign_authority",
  "sealed_at": "2026-06-05T02:50:00Z",
  "seal_hash": "sha256_hash_here"
}
```

**Authority Required:** SOVEREIGN

---

#### `revoke_charter`

Revoke a reality layer charter (SOVEREIGN only).

**Syntax:**
```
"Revoke charter for layer 2"
"Suspend charter CHARTER_002"
```

**Parameters:**
- `charter_id`: Charter to revoke
- `reason`: Reason for revocation

**Returns:**
```json
{
  "charter_id": "CHARTER_002",
  "status": "REVOKED",
  "layer": "REALITY_LAYER_2",
  "revoked_by": "sovereign_authority",
  "revoked_at": "2026-06-05T02:50:30Z",
  "revocation_hash": "sha256_hash_here"
}
```

**Authority Required:** SOVEREIGN

---

### System Commands

#### `get_system_health`

Query system health and status.

**Syntax:**
```
"Show system health"
"Get health status"
"Check system status"
```

**Parameters:**
- None

**Returns:**
```json
{
  "system_status": "HEALTHY",
  "components": {
    "aegentis_core": "ONLINE",
    "gateway": "ONLINE",
    "database": "ONLINE",
    "federation": "ONLINE"
  },
  "metrics": {
    "uptime_hours": 720,
    "command_throughput": 150,
    "error_rate": 0.01,
    "avg_latency_ms": 35
  },
  "alerts": []
}
```

**Authority Required:** OPERATOR+

---

#### `emergency_lockdown`

Initiate system lockdown (SOVEREIGN only).

**Syntax:**
```
"Emergency lockdown"
"Activate lockdown"
"System lockdown"
```

**Parameters:**
- `reason`: Reason for lockdown

**Returns:**
```json
{
  "lockdown_id": "lockdown_1717584000_ghi789",
  "status": "ACTIVE",
  "initiated_by": "sovereign_authority",
  "initiated_at": "2026-06-05T02:50:00Z",
  "affected_sessions": 5,
  "affected_commands": 12,
  "system_mode": "READ_ONLY"
}
```

**Authority Required:** SOVEREIGN

---

## Voice Command Reference

### Quick Reference Table

| Voice Command | Function | Authority | Multi-Sig |
|---------------|----------|-----------|-----------|
| "Show identity" | Get identity info | CADET+ | No |
| "Check authority" | Verify authority level | CADET+ | No |
| "Mint 1000 tokens" | Mint treasury tokens | COMMANDER+ | Yes (>10k) |
| "Approve transaction" | Approve multi-sig | COMMANDER+ | No |
| "Synthesize asset" | Execute skill synthesis | COMMANDER+ | No |
| "Show federation" | Get federation status | OPERATOR+ | No |
| "Sync federation" | Synchronize peers | COMMANDER+ | No |
| "Seal charter" | Seal reality layer | SOVEREIGN | No |
| "Revoke charter" | Revoke reality layer | SOVEREIGN | No |
| "System health" | Get system status | OPERATOR+ | No |
| "Emergency lockdown" | Initiate lockdown | SOVEREIGN | No |

### Natural Language Variations

AEGENTIS-X understands many variations of commands:

**Identity Queries:**
- "Show identity"
- "Who am I?"
- "Display my authority"
- "Check my permissions"
- "What is my authority level?"

**Treasury Operations:**
- "Mint 1000 tokens"
- "Create 1000 tokens for operator"
- "Generate 1000 treasury tokens"
- "Issue 1000 tokens to operator@sovereignsystem.gov"

**Approvals:**
- "Approve transaction"
- "Approve multi-sig"
- "Sign off on transaction"
- "Authorize transaction"

**Federation:**
- "Show federation"
- "List peers"
- "Check peer status"
- "Synchronize federation"
- "Sync with peers"

---

## Gesture Controls

### Hand Gestures

| Gesture | Action | Command Type |
|---------|--------|--------------|
| **Point + Pinch** | Select command | Any |
| **Grab + Hold** | Grab command panel | Navigation |
| **Rotate Hands** | Rotate panel | Navigation |
| **Swipe Down** | Dismiss panel | Navigation |
| **Two-Hand Grab** | Resize panel | Navigation |
| **Thumbs Up** | Approve/Confirm | Approval |
| **Thumbs Down** | Reject/Cancel | Rejection |
| **Open Palm** | Show menu | Navigation |
| **Fist** | Grab/Hold | Interaction |

### Eye Gaze Controls

AEGENTIS-X supports eye-gaze based interaction:

- **Gaze at command** - Highlight command
- **Gaze + Dwell** - Select command (1-2 second dwell)
- **Gaze + Blink** - Confirm selection
- **Gaze away** - Deselect

**Note:** Eye gaze available on Apple Vision Pro and Windows MR with eye tracking.

---

## Decision Engine

### How AEGENTIS-X Makes Decisions

AEGENTIS-X uses a multi-factor decision engine to evaluate commands:

```
Command Received
    ↓
1. Authority Check
   ├─ Is authority level sufficient?
   ├─ Is authority expired?
   └─ Is capability in scope?
    ↓
2. Compliance Check
   ├─ Does command violate policies?
   ├─ Are there pending investigations?
   └─ Is user in good standing?
    ↓
3. Federation Consensus (if required)
   ├─ Query federation peers
   ├─ Collect votes
   └─ Verify consensus threshold
    ↓
4. Risk Assessment
   ├─ Calculate transaction risk
   ├─ Check for anomalies
   └─ Verify patterns
    ↓
5. Final Decision
   ├─ APPROVE - Proceed with execution
   ├─ REQUIRE_APPROVAL - Require multi-sig
   ├─ DENY - Reject command
   └─ ESCALATE - Escalate to higher authority
```

### Decision Factors

**Authority Factors:**
- User authority level
- Authority expiration date
- Capability scope
- Delegation status
- Multi-factor authentication status

**Compliance Factors:**
- Active investigations
- Compliance violations
- Regulatory restrictions
- User standing
- Recent incidents

**Federation Factors:**
- Peer consensus requirement
- Peer availability
- Peer agreement status
- Consensus threshold
- Peer authority levels

**Risk Factors:**
- Transaction amount
- Transaction frequency
- User behavior patterns
- System load
- Federation status

### Approval Requirements

| Operation | Authority | Multi-Sig Required | Conditions |
|-----------|-----------|-------------------|-----------|
| Mint <1k tokens | COMMANDER | No | Always |
| Mint 1k-10k tokens | COMMANDER | No | If <5 per day |
| Mint >10k tokens | COMMANDER | Yes | Always |
| Transfer <1k tokens | COMMANDER | No | Always |
| Transfer >1k tokens | COMMANDER | Yes | If >3 per day |
| Burn tokens | COMMANDER | Yes | Always |
| Seal charter | SOVEREIGN | No | Always |
| Revoke charter | SOVEREIGN | No | Always |
| Lockdown system | SOVEREIGN | No | Always |

---

## Operational Workflows

### Workflow 1: Mint Treasury Tokens

**Objective:** Create new treasury tokens

**Steps:**

1. **Initiate Command**
   - Say: "Mint 5000 tokens for operator@sovereignsystem.gov"
   - AEGENTIS-X displays command confirmation

2. **Verify Details**
   - Check recipient address
   - Verify amount
   - Confirm token type

3. **Authenticate**
   - Provide biometric (fingerprint or face)
   - System verifies authentication

4. **Execute**
   - AEGENTIS-X sends command to AEGENTIS Core
   - System processes mint operation
   - Tokens created and assigned

5. **Confirm**
   - Receive confirmation with transaction ID
   - Tokens appear in recipient account
   - Event logged to audit trail

**Time:** ~5-10 seconds

**Authority Required:** COMMANDER+

---

### Workflow 2: Approve Multi-Signature Transaction

**Objective:** Approve a pending multi-signature transaction

**Steps:**

1. **Receive Notification**
   - Alert appears: "Multi-sig approval required"
   - Transaction details displayed

2. **Review Transaction**
   - Check transaction ID
   - Verify amount and recipient
   - Review transaction history

3. **Make Decision**
   - Say: "Approve transaction" or use gesture (thumbs up)
   - Provide reason for approval

4. **Authenticate**
   - Provide biometric confirmation
   - System verifies authentication

5. **Submit Approval**
   - AEGENTIS-X sends approval to AEGENTIS Core
   - Approval recorded in multi-sig log
   - Check if threshold met

6. **Completion**
   - If threshold met: Transaction executes
   - If threshold not met: Waiting for other approvers
   - Notification sent to all parties

**Time:** ~3-5 seconds per approval

**Authority Required:** COMMANDER+

---

### Workflow 3: Synchronize Federation

**Objective:** Synchronize state with federation peers

**Steps:**

1. **Initiate Sync**
   - Say: "Sync federation" or select from menu
   - AEGENTIS-X initiates synchronization

2. **Connect to Peers**
   - System connects to all federation peers
   - Peers respond with their state
   - Latency measured for each peer

3. **Compare States**
   - Local state compared to peer states
   - Differences identified
   - Consensus algorithm applied

4. **Resolve Conflicts**
   - If conflicts exist: Require higher authority
   - If no conflicts: Proceed with sync

5. **Update State**
   - Local state updated with peer data
   - Peer states updated with local data
   - Hash chains verified

6. **Confirm Sync**
   - Sync complete notification
   - All peers in agreement
   - Event logged

**Time:** ~10-30 seconds (depending on peer count and latency)

**Authority Required:** COMMANDER+

---

### Workflow 4: Emergency Lockdown

**Objective:** Initiate system lockdown in response to security incident

**Steps:**

1. **Detect Incident**
   - Security alert received
   - Unauthorized access detected
   - Or manual lockdown initiated

2. **Initiate Lockdown**
   - Say: "Emergency lockdown" or press emergency button
   - AEGENTIS-X requests confirmation

3. **Authenticate**
   - Provide biometric + voice confirmation
   - System verifies SOVEREIGN authority

4. **Execute Lockdown**
   - All sessions revoked
   - All pending commands cancelled
   - System enters READ_ONLY mode
   - Security team alerted

5. **Log Incident**
   - Incident recorded with timestamp
   - All affected sessions logged
   - Reason for lockdown recorded

6. **Recovery**
   - Security team investigates
   - Incident cleared by SOVEREIGN
   - System returns to normal operation

**Time:** ~2-3 seconds for lockdown

**Authority Required:** SOVEREIGN

---

## Emergency Procedures

### Procedure 1: Unauthorized Access Detected

**Symptoms:**
- Unexpected commands executed
- Authority level changed
- Unusual transaction activity
- Session from unknown location

**Response:**

1. **Immediate Actions:**
   - Say: "Emergency lockdown"
   - Confirm with biometric + voice
   - System locks down immediately

2. **Investigation:**
   - Review audit logs
   - Check for unauthorized access
   - Identify affected operations
   - Preserve evidence

3. **Recovery:**
   - Revoke compromised authority
   - Reset credentials
   - Restore from backup if needed
   - Re-authenticate all sessions

4. **Prevention:**
   - Enable additional security factors
   - Increase monitoring
   - Review access controls
   - Update security policies

---

### Procedure 2: System Failure

**Symptoms:**
- AEGENTIS-X offline
- Commands not executing
- High latency (>500ms)
- Federation peers unreachable

**Response:**

1. **Verify Status:**
   - Check system health
   - Verify network connectivity
   - Check federation peer status
   - Review error logs

2. **Attempt Recovery:**
   - Restart AEGENTIS-X service
   - Restart gateway service
   - Check database connectivity
   - Verify federation peers

3. **If Recovery Fails:**
   - Contact system administrator
   - Provide error details and logs
   - Switch to backup system if available
   - Document incident

4. **Post-Incident:**
   - Root cause analysis
   - Implement fixes
   - Test recovery procedures
   - Update documentation

---

### Procedure 3: Multi-Signature Timeout

**Symptoms:**
- Multi-sig transaction pending >24 hours
- Approvers not responding
- Transaction cannot proceed

**Response:**

1. **Escalate:**
   - Contact remaining approvers
   - Request approval or rejection
   - Set deadline for response

2. **If No Response:**
   - Request SOVEREIGN override
   - Provide justification
   - Document escalation

3. **Resolution:**
   - Either get approval and proceed
   - Or reject transaction and retry
   - Update approvers list if needed

---

## Troubleshooting

### Issue: "Command Not Recognized"

**Symptoms:** Voice command not understood

**Solutions:**
1. Speak clearly and slowly
2. Use exact command syntax
3. Check microphone is enabled
4. Reduce background noise
5. Try alternative phrasing
6. Check authority level

**Example:**
- ❌ "Make tokens"
- ✅ "Mint 1000 tokens for operator@sovereignsystem.gov"

---

### Issue: "Authority Insufficient"

**Symptoms:** Command rejected due to insufficient authority

**Solutions:**
1. Check current authority level
2. Request authority elevation
3. Contact SOVEREIGN for approval
4. Use lower-authority command
5. Verify authority not expired

---

### Issue: "Multi-Sig Approval Required"

**Symptoms:** Command requires additional approvals

**Solutions:**
1. Contact other approvers
2. Request their approval
3. Monitor approval status
4. Wait for threshold to be met
5. Or request SOVEREIGN override

---

### Issue: "Federation Consensus Failed"

**Symptoms:** Federation peers cannot agree

**Solutions:**
1. Check peer connectivity
2. Verify peer authority levels
3. Review peer state
4. Resolve conflicts manually
5. Contact federation administrator

---

### Issue: "High Latency"

**Symptoms:** Commands delayed, slow response

**Solutions:**
1. Check network connectivity
2. Verify WiFi signal strength
3. Switch to wired Ethernet
4. Check federation peer latency
5. Reduce system load
6. Contact network administrator

---

## Quick Reference Card

### Essential Commands

```
IDENTITY:
  "Show identity"
  "Check authority"

TREASURY:
  "Mint 1000 tokens for operator@sovereignsystem.gov"
  "Approve transaction"
  "Transfer 500 tokens to peer"

FEDERATION:
  "Show federation status"
  "Sync federation"

CHARTERS:
  "Seal charter CHARTER_001"
  "Revoke charter CHARTER_002"

SYSTEM:
  "System health"
  "Emergency lockdown"
```

### Authority Requirements

```
CADET:      View dashboards, query data
OPERATOR:   Execute routine commands, approve transactions
COMMANDER:  Execute treasury, manage federation
SOVEREIGN:  Modify rules, revoke authorities, lockdown
```

### Authentication Factors

```
CADET:      PIN only
OPERATOR:   PIN + Biometric
COMMANDER:  Biometric only
SOVEREIGN:  Voice + Biometric
```

---

## Support & Resources

**Documentation:**
- VR Portal Operator Manual
- AEGENTIS-X Flight Manual (this document)
- Authority Management Guide
- Compliance Procedures

**Support Contacts:**
- Email: aegentis-support@sovereignsystem.gov
- Phone: +1-555-AEGENTIS (1-555-234-3684)
- Portal: https://support.sovereignsystem.gov

**Emergency:**
- Security: security@sovereignsystem.gov
- Ops: ops@sovereignsystem.gov
- Admin: admin@sovereignsystem.gov

---

**Document Classification:** OPERATIONAL / COMMAND AUTHORITY  
**Last Updated:** June 2026  
**Next Review:** December 2026  
**Approved By:** AEGENTIS-X Command Authority  
**Distribution:** COMMANDER+ Only
