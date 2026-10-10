# Coinbase Agent API Documentation

## Overview

The Coinbase Agent provides a comprehensive REST API and tRPC integration for autonomous cryptocurrency operations within the AEGENTIS-X Sovereign System. It supports multi-signature coordination, tiered approval thresholds, and real-time transaction monitoring.

## Quick Start

### 1. Create a Session

Call the REST API to create a new session with your Coinbase Developer Platform credentials:

```bash
curl -X POST https://sovereign-system-portal.manus.space/api/coinbase/session/create \
  -H "Content-Type: application/json" \
  -d '{
    "apiKeyId": "YOUR_CDP_API_KEY_ID",
    "apiKeySecret": "YOUR_CDP_API_KEY_SECRET",
    "walletSecret": "YOUR_WALLET_SECRET"
  }'
```

**Response:**
```json
{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "expiresIn": 1800000,
  "message": "Session created successfully"
}
```

### 2. Execute a Transfer

Submit a USDC transfer request:

```bash
curl -X POST https://sovereign-system-portal.manus.space/api/coinbase/transfer \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "550e8400-e29b-41d4-a716-446655440000",
    "amount": "1000",
    "destinationAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f42bE",
    "network": "polygon"
  }'
```

**Response:**
```json
{
  "jobId": "job-123456",
  "status": "completed",
  "amount": "1000",
  "destination": "0x742d35Cc6634C0532925a3b844Bc9e7595f42bE",
  "transactionHash": "0x1234567890abcdef...",
  "createdAt": "2026-06-25T21:47:00.000Z",
  "executedAt": "2026-06-25T21:47:30.000Z"
}
```

## REST API Endpoints

### Session Management

#### Create Session
- **Endpoint:** `POST /api/coinbase/session/create`
- **Description:** Create a new session with Coinbase credentials
- **Body:**
  ```json
  {
    "apiKeyId": "string",
    "apiKeySecret": "string",
    "walletSecret": "string"
  }
  ```
- **Response:** `{ sessionId, expiresIn, message }`
- **Timeout:** 30 minutes

#### Destroy Session
- **Endpoint:** `POST /api/coinbase/session/destroy`
- **Description:** Terminate a session and cleanup resources
- **Body:** `{ sessionId: string }`
- **Response:** `{ message: "Session destroyed" }`

### Operations

#### Execute Transfer
- **Endpoint:** `POST /api/coinbase/transfer`
- **Description:** Execute a USDC transfer with automatic job execution
- **Body:**
  ```json
  {
    "sessionId": "string",
    "amount": "string",
    "destinationAddress": "string",
    "network": "polygon|base|ethereum"
  }
  ```
- **Response:** Transfer job result with transaction hash

#### Get Job Status
- **Endpoint:** `GET /api/coinbase/job/:jobId?sessionId=SESSION_ID`
- **Description:** Check status of a transfer job
- **Response:**
  ```json
  {
    "jobId": "string",
    "status": "pending|executing|completed|failed",
    "amount": "string",
    "destination": "string",
    "transactionHash": "string",
    "error": "string (if failed)"
  }
  ```

#### Get Wallet Info
- **Endpoint:** `GET /api/coinbase/wallet?sessionId=SESSION_ID`
- **Description:** Retrieve wallet address and network info
- **Response:**
  ```json
  {
    "walletAddress": "0x...",
    "network": "polygon"
  }
  ```

### Health & Monitoring

#### Health Check
- **Endpoint:** `GET /api/coinbase/health`
- **Description:** Check API health status
- **Response:**
  ```json
  {
    "status": "healthy",
    "activeSessions": 5,
    "timestamp": "2026-06-25T21:47:00.000Z"
  }
  ```

## tRPC Integration

### Usage in Frontend

```typescript
import { trpc } from "@/lib/trpc";

// Create operation
const { data: operation } = await trpc.aegentisCoinbase.createOperation.mutate({
  type: "transfer",
  amount: "1000",
  destinationAddress: "0x...",
  network: "polygon"
});

// Add signature
const { data: approved } = await trpc.aegentisCoinbase.addSignature.mutate({
  operationId: operation.operationId,
  signerId: "signer-1",
  signature: "0x..."
});

// Execute if approved
if (approved.isApproved) {
  const { data: result } = await trpc.aegentisCoinbase.executeOperation.mutate({
    operationId: operation.operationId
  });
}

// Get coordination matrix
const { data: matrix } = await trpc.aegentisCoinbase.getCoordinationMatrix.query();
```

## Multi-Signature Coordination

### Approval Thresholds

Transfers are automatically categorized by amount and require corresponding signatures:

| Amount | Threshold | Required Signatures |
|--------|-----------|-------------------|
| < $1M | Small | 1 |
| $1M - $100M | Medium | 2 |
| $100M - $1B | Large | 3 |
| > $1B | Critical | 4 |

### Operation Lifecycle

1. **Create Operation** - Operation created in `pending` state
2. **Add Signatures** - Authorized signers add cryptographic signatures
3. **Approval** - Once threshold reached, status changes to `approved`
4. **Execute** - Operation is executed and status becomes `executing`
5. **Complete** - Transaction confirmed, status becomes `completed` or `failed`

### Example: Multi-Sig Transfer

```typescript
// 1. Create operation
const op = await trpc.aegentisCoinbase.createOperation.mutate({
  type: "transfer",
  amount: "50000000", // $50M - requires 2 signatures
  destinationAddress: "0x...",
  network: "polygon"
});

// 2. First signer approves
await trpc.aegentisCoinbase.addSignature.mutate({
  operationId: op.operationId,
  signerId: "signer-1",
  signature: "0x..." // Signature from signer 1
});

// 3. Second signer approves
const approval = await trpc.aegentisCoinbase.addSignature.mutate({
  operationId: op.operationId,
  signerId: "signer-2",
  signature: "0x..." // Signature from signer 2
});

// 4. Operation is now approved, execute it
if (approval.isApproved) {
  const result = await trpc.aegentisCoinbase.executeOperation.mutate({
    operationId: op.operationId
  });
  console.log("Transaction:", result.transactionHash);
}
```

## Monitoring & Analytics

### Coordination Matrix

Get real-time metrics on all operations:

```typescript
const matrix = await trpc.aegentisCoinbase.getCoordinationMatrix.query();

console.log({
  totalOperations: matrix.totalOperations,
  pendingApproval: matrix.pendingApproval,
  executing: matrix.executing,
  completed: matrix.completed,
  failed: matrix.failed,
  successRate: matrix.successRate,
  averageExecutionTime: matrix.averageExecutionTime,
  totalValueTransferred: matrix.totalValueTransferred
});
```

### Operation History

Retrieve historical operations:

```typescript
const history = await trpc.aegentisCoinbase.getOperationHistory.query({
  limit: 100
});

history.forEach(op => {
  console.log(`${op.type}: ${op.status} - ${op.amount} USDC`);
});
```

## Kubernetes Deployment

### Install Helm Chart

```bash
# Create namespace
kubectl create namespace sovereign

# Create secrets
kubectl create secret generic coinbase-credentials \
  --from-literal=api-key-id=YOUR_API_KEY_ID \
  --from-literal=api-key-secret=YOUR_API_KEY_SECRET \
  --from-literal=wallet-secret=YOUR_WALLET_SECRET \
  -n sovereign

# Install chart
helm install coinbase-agent ./helm/coinbase-agent \
  --namespace sovereign \
  --values helm/coinbase-agent/values.yaml
```

### Access Agent

```bash
# Port forward to local machine
kubectl port-forward -n sovereign svc/coinbase-agent 8080:8080

# Call API
curl http://localhost:8080/api/coinbase/health
```

## Security Considerations

1. **Credential Isolation** - Each session maintains isolated credential context
2. **Session Timeout** - Sessions expire after 30 minutes of inactivity
3. **Multi-Signature** - All significant operations require multiple approvals
4. **Audit Trail** - All operations logged in immutable ledger
5. **Network Policies** - Kubernetes network policies restrict egress to blockchain RPC endpoints

## Error Handling

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `Invalid or expired session` | Session not found or expired | Create new session |
| `Missing required credentials` | CDP credentials not provided | Provide all three credentials |
| `Operation not in pending state` | Cannot add signatures to non-pending operation | Check operation status |
| `Insufficient balance` | Wallet doesn't have enough USDC | Fund wallet with USDC |
| `Transfer execution failed` | Transaction submission failed | Check network and gas settings |

## Rate Limiting

- **Session Creation:** 10 per minute per IP
- **Transfer Execution:** 100 per minute per session
- **Job Status Queries:** 1000 per minute per session

## Support

For issues and questions:
- GitHub Issues: https://github.com/sovereign-ae/aegentis-x/issues
- Documentation: https://docs.sovereign.ae
- Email: ops@sovereign.ae

## Changelog

### v1.0.0 (2026-06-25)
- Initial release
- REST API with session management
- tRPC integration
- Multi-signature coordination
- Kubernetes Helm chart
- Real-time monitoring dashboards
