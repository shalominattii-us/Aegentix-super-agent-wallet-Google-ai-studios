# Gold Dome Agents — Configuration Guide

## Environment Variables

Add these variables to your `.env` file for Gold Dome Agents integration:

```bash
# Gold Dome Agents Configuration
VITE_GOLD_DOME_API=http://localhost:3001/api/gold-dome
GOLD_DOME_ENABLED=true
GOLD_DOME_DATA_DIR=./data/gold-dome
GOLD_DOME_LEDGER_PATH=./data/gold-dome/ledger.jsonl
GOLD_DOME_AGENT_REGISTRY=./data/gold-dome/agents.json

# SOVEREIGN Kernel Integration
VITE_SOVEREIGN_KERNEL_URL=http://localhost:9000
VITE_SOVEREIGN_KERNEL_API_KEY=sovereign-kernel-key

# Feature Flags
FEATURE_GOLD_DOME=true
FEATURE_RESOLUTE_DESK=true
FEATURE_AGENT_ORCHESTRATION=true
```

## Features

### Gold Dome Agents
- **Status:** ✅ Enabled by default
- **API Endpoint:** `/api/gold-dome`
- **Components:** 4 default agents (Content Generator, Monetization, Compliance, Constellation)
- **Features:** Agent registry, action governance, tamper-evident ledger, approval workflows

### ResoluteDesk Integration
- **Status:** ✅ Enabled by default
- **Purpose:** Executive approval layer with civic integrity scoring
- **Features:** Governance ledger, approval gating, audit trails

### Agent Orchestration
- **Status:** ✅ Enabled by default
- **Purpose:** Real-time agent coordination and monitoring
- **Features:** Live status dashboard, communication logs, deployment controls

## API Endpoints

### Health & Status
```
GET /api/gold-dome/health
```

### Agent Management
```
GET /api/gold-dome/agents
POST /api/gold-dome/agents/register
```

### Action Governance
```
POST /api/gold-dome/agents/action/submit
POST /api/gold-dome/agents/action/approve
POST /api/gold-dome/agents/action/reject
GET /api/gold-dome/agents/actions/pending
```

### Ledger & Verification
```
GET /api/gold-dome/ledger?limit=100
GET /api/gold-dome/ledger/verify
```

## Portal Pages

### Gold Dome Agents Dashboard
**Route:** `/gold-dome`
**Component:** `GoldDomeAgents.tsx`
**Features:**
- Real-time agent status
- Pending actions queue
- Governance ledger viewer
- Approve/Reject controls

### Agent Orchestration Dashboard
**Route:** `/orchestration`
**Component:** `AgentOrchestration.tsx`
**Features:**
- Multi-agent coordination metrics
- Real-time communication logs
- Inter-agent message streaming
- Performance analytics

### Deployment Manager
**Route:** `/deployment`
**Component:** `AgentDeploymentManager.tsx`
**Features:**
- Agent lifecycle management
- Resource allocation
- Deployment templates
- Health monitoring

## Data Storage

### Ledger
**Path:** `./data/gold-dome/ledger.jsonl`
**Format:** JSONL (one entry per line)
**Purpose:** Tamper-evident governance log
**Verification:** SHA3-256 chaining

### Agent Registry
**Path:** `./data/gold-dome/agents.json`
**Format:** JSON
**Purpose:** Agent metadata and capabilities
**Auto-sync:** On registration/update

## Security Considerations

### Production Deployment
1. ✅ Enable JWT authentication
2. ✅ Configure CORS for your domain
3. ✅ Set up SSL/TLS certificates
4. ✅ Add rate limiting
5. ✅ Implement audit logging

### Ledger Integrity
- ✅ SHA3-256 hashing
- ✅ Append-only enforcement
- ✅ Chain verification
- ✅ Tamper detection

### Agent Isolation
- ✅ Registry-based access control
- ✅ Capability-based authorization
- ✅ Risk assessment
- ✅ Approval gating

## Integration with SOVEREIGN Kernel

The Gold Dome system integrates with the SOVEREIGN kernel for:
- Agent lifecycle management
- Autonomous operation coordination
- Governance enforcement
- System-wide compliance

**Configuration:**
```bash
VITE_SOVEREIGN_KERNEL_URL=http://localhost:9000
VITE_SOVEREIGN_KERNEL_API_KEY=your-api-key
```

## Troubleshooting

### Agents Not Loading
1. Check `GOLD_DOME_ENABLED=true`
2. Verify `GOLD_DOME_DATA_DIR` exists
3. Check server logs for errors
4. Verify API endpoint is accessible

### Ledger Verification Failed
1. Check ledger file integrity
2. Verify no manual edits to `ledger.jsonl`
3. Restart the service
4. Check for disk space issues

### Actions Not Persisting
1. Verify write permissions to `GOLD_DOME_DATA_DIR`
2. Check disk space
3. Verify database connectivity
4. Check server logs

## Support

For issues:
1. Check Portal logs: `tail -f .manus-logs/devserver.log`
2. Check API health: `curl http://localhost:3001/api/gold-dome/health`
3. Verify ledger: `curl http://localhost:3001/api/gold-dome/ledger/verify`
4. Review agent registry: `cat ./data/gold-dome/agents.json`
