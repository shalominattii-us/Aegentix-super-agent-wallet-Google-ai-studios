# Sovereign System - API Integration Guide

**Version:** 1.0.0  
**Audience:** Frontend Developers, Backend Developers  
**Last Updated:** 2026-05-05

---

## Overview

The Sovereign System Portal communicates with the SOVEREIGN OS Kernel through a RESTful API. This guide covers integration patterns, authentication, error handling, and best practices.

---

## API Client Setup

### Installation

The API client is pre-configured in `client/src/lib/api-client.ts`:

```typescript
import { apiClient, Agent, CommunicationLog } from '@/lib/api-client';

// Set authentication token (if needed)
apiClient.setToken('your-jwt-token');

// Use in components
const response = await apiClient.getAgents();
```

### Environment Configuration

```env
# .env.local
VITE_API_URL=http://localhost:9999
```

---

## Core Endpoints

### Health & Status

#### Check Kernel Health
```typescript
const response = await apiClient.checkHealth();
// Returns: { success: true, data: { status: 'operational' } }
```

#### Get Mesh Status
```typescript
const response = await apiClient.getMeshStatus();
// Returns: { 
//   success: true, 
//   data: { 
//     total_agents: 10,
//     active_agents: 8,
//     message_throughput: '1.2K msg/s',
//     avg_latency_ms: 45,
//     coordination_success_rate: 0.98
//   } 
// }
```

---

## Agent Management

### List All Agents

```typescript
// Get all agents
const response = await apiClient.getAgents();

// Get agents by tier
const tier1 = await apiClient.getAgents(1);
const tier2 = await apiClient.getAgents(2);
const tier3 = await apiClient.getAgents(3);
```

### Get Single Agent

```typescript
const response = await apiClient.getAgent('agent-id');
// Returns: { 
//   success: true, 
//   data: { 
//     id: 'agent-id',
//     name: 'Data Collection Agent',
//     tier: 1,
//     status: 'active',
//     agent_type: 'data_collector',
//     uptime: '48h 23m',
//     tasks: 156,
//     last_heartbeat: '2026-05-05T10:30:00Z'
//   } 
// }
```

### Deploy Agent

```typescript
const response = await apiClient.deployAgent({
  name: 'New Agent',
  tier: 2,
  agent_type: 'orchestrator',
  description: 'Workflow orchestration agent',
  configuration: {
    max_tasks: 100,
    timeout_ms: 30000,
    retry_attempts: 3
  }
});
```

### Update Agent

```typescript
const response = await apiClient.updateAgent('agent-id', {
  configuration: {
    max_tasks: 200,
    timeout_ms: 60000
  }
});
```

### Control Agent

```typescript
// Start agent
await apiClient.startAgent('agent-id');

// Stop agent
await apiClient.stopAgent('agent-id');
```

---

## Agent Tasks

### Get Agent Tasks

```typescript
const response = await apiClient.getAgentTasks('agent-id');
// Returns: [
//   {
//     id: 'task-id',
//     agent_id: 'agent-id',
//     task_name: 'collect_data',
//     status: 'completed',
//     priority: 'high',
//     payload: { source: 'api', limit: 1000 },
//     result: { records: 1000, duration_ms: 5000 },
//     created_at: '2026-05-05T10:00:00Z',
//     completed_at: '2026-05-05T10:05:00Z'
//   }
// ]
```

### Create Task

```typescript
const response = await apiClient.createAgentTask('agent-id', {
  task_name: 'collect_data',
  priority: 'high',
  payload: {
    source: 'api',
    limit: 1000
  }
});
```

### Get Task Status

```typescript
const response = await apiClient.getTaskStatus('agent-id', 'task-id');
```

### Cancel Task

```typescript
const response = await apiClient.cancelTask('agent-id', 'task-id');
```

---

## Communication Logs

### Fetch Historical Logs

```typescript
// Get recent logs
const response = await apiClient.getCommunicationLogs({
  limit: 100
});

// Filter by priority
const critical = await apiClient.getCommunicationLogs({
  priority: 'critical',
  limit: 50
});

// Filter by status
const errors = await apiClient.getCommunicationLogs({
  status: 'error',
  limit: 50
});

// Filter by agent
const agentLogs = await apiClient.getCommunicationLogs({
  agent_id: 'agent-id',
  limit: 100
});
```

### Stream Real-Time Logs

```typescript
const eventSource = apiClient.streamCommunicationLogs(
  (log: CommunicationLog) => {
    console.log('New message:', log);
    // Update UI with new log
  },
  (error: Error) => {
    console.error('Stream error:', error);
  }
);

// Stop streaming
eventSource.close();
```

### React Hook Usage

```typescript
import { useCommunicationLogs, useFilteredCommunicationLogs } from '@/hooks/useCommunicationLogs';

function LogViewer() {
  const { logs, loading, error, isLive, setIsLive } = useCommunicationLogs(100);
  
  const filtered = useFilteredCommunicationLogs(logs, {
    priority: 'critical',
    status: 'error'
  });

  return (
    <div>
      <button onClick={() => setIsLive(!isLive)}>
        {isLive ? 'Pause' : 'Resume'}
      </button>
      {filtered.map(log => (
        <LogEntry key={log.id} log={log} />
      ))}
    </div>
  );
}
```

---

## Governance Policies

### List Policies

```typescript
const response = await apiClient.getGovernancePolicies();
```

### Create Policy

```typescript
const response = await apiClient.createGovernancePolicy({
  policy_name: 'resource_limit',
  description: 'Limit resource usage per agent',
  policy_type: 'resource_constraint',
  rules: {
    max_cpu_percent: 80,
    max_memory_mb: 2048,
    max_concurrent_tasks: 100
  }
});
```

### Update Policy

```typescript
const response = await apiClient.updateGovernancePolicy('policy-id', {
  rules: {
    max_cpu_percent: 90,
    max_memory_mb: 4096
  }
});
```

### Delete Policy

```typescript
const response = await apiClient.deleteGovernancePolicy('policy-id');
```

---

## Deployments

### Deploy System

```typescript
const response = await apiClient.deploySystem({
  deployment_name: 'v1.2.0-production',
  environment: 'production',
  version: '1.2.0',
  manifest: {
    portal: { image: 'sovereign-portal:1.2.0' },
    kernel: { image: 'sovereign-kernel:1.2.0' },
    replicas: 3
  }
});
```

### Get Deployment Status

```typescript
const response = await apiClient.getDeploymentStatus('deployment-id');
```

### Get Deployment History

```typescript
const response = await apiClient.getDeploymentHistory(10);
```

### Rollback Deployment

```typescript
const response = await apiClient.rollbackDeployment('deployment-id');
```

---

## Metrics & Monitoring

### Get System Metrics

```typescript
// Last hour
const response = await apiClient.getSystemMetrics('1h');

// Last 24 hours
const response = await apiClient.getSystemMetrics('24h');

// Last 7 days
const response = await apiClient.getSystemMetrics('7d');
```

### Get Agent Metrics

```typescript
const response = await apiClient.getAgentMetrics('agent-id', '1h');
```

---

## Error Handling

### Response Structure

All API responses follow this structure:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}
```

### Error Handling Pattern

```typescript
try {
  const response = await apiClient.getAgents();
  
  if (response.success && response.data) {
    // Handle success
    console.log('Agents:', response.data);
  } else {
    // Handle API error
    console.error('API Error:', response.error);
  }
} catch (error) {
  // Handle network error
  console.error('Network Error:', error);
}
```

### Common Error Codes

| Code | Meaning | Action |
|------|---------|--------|
| 200 | Success | Process response |
| 400 | Bad Request | Check request parameters |
| 401 | Unauthorized | Refresh authentication token |
| 403 | Forbidden | Check permissions |
| 404 | Not Found | Verify resource ID |
| 500 | Server Error | Retry with exponential backoff |
| 503 | Service Unavailable | Retry with exponential backoff |

---

## React Hooks

### useAgents

```typescript
import { useAgents, useAgent } from '@/hooks/useAgents';

// Get all agents
function AgentList() {
  const { agents, loading, error, refetch } = useAgents();
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {agents.map(agent => (
        <div key={agent.id}>{agent.name}</div>
      ))}
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}

// Get single agent
function AgentDetail({ agentId }) {
  const { agent, loading, error, startAgent, stopAgent } = useAgent(agentId);
  
  return (
    <div>
      {agent && (
        <>
          <h2>{agent.name}</h2>
          <p>Status: {agent.status}</p>
          <button onClick={startAgent}>Start</button>
          <button onClick={stopAgent}>Stop</button>
        </>
      )}
    </div>
  );
}
```

### useCommunicationLogs

```typescript
import { useCommunicationLogs, useFilteredCommunicationLogs } from '@/hooks/useCommunicationLogs';

function LogViewer() {
  const { logs, loading, error, isLive, setIsLive, clearLogs } = useCommunicationLogs(100);
  
  const filtered = useFilteredCommunicationLogs(logs, {
    priority: 'critical'
  });

  return (
    <div>
      <button onClick={() => setIsLive(!isLive)}>
        {isLive ? 'Pause' : 'Resume'} Streaming
      </button>
      <button onClick={clearLogs}>Clear Logs</button>
      
      {filtered.map(log => (
        <div key={log.id}>
          <p>{log.message_type}</p>
          <p>Priority: {log.priority}</p>
          <p>Status: {log.status}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## Best Practices

### 1. Error Handling

Always handle both success and error cases:

```typescript
try {
  const response = await apiClient.getAgents();
  if (response.success && response.data) {
    // Handle success
  } else {
    // Handle API error
    showErrorToast(response.error);
  }
} catch (error) {
  // Handle network error
  showErrorToast('Network error: ' + error.message);
}
```

### 2. Loading States

Use loading state to improve UX:

```typescript
const { agents, loading, error } = useAgents();

if (loading) return <Skeleton />;
if (error) return <ErrorMessage error={error} />;
return <AgentList agents={agents} />;
```

### 3. Polling vs Streaming

- **Polling**: Use for periodic updates (every 30 seconds)
- **Streaming**: Use for real-time updates (communication logs)

```typescript
// Polling (useAgents hook)
const { agents, refetch } = useAgents();
useEffect(() => {
  const interval = setInterval(refetch, 30000);
  return () => clearInterval(interval);
}, [refetch]);

// Streaming (useCommunicationLogs hook)
const { logs, isLive, setIsLive } = useCommunicationLogs();
```

### 4. Caching

Implement caching to reduce API calls:

```typescript
const cache = new Map();

async function getCachedAgents() {
  if (cache.has('agents')) {
    return cache.get('agents');
  }
  
  const response = await apiClient.getAgents();
  cache.set('agents', response.data);
  return response.data;
}
```

### 5. Retry Logic

Implement exponential backoff for retries:

```typescript
async function retryWithBackoff(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => 
        setTimeout(resolve, Math.pow(2, i) * 1000)
      );
    }
  }
}

// Usage
const response = await retryWithBackoff(() => apiClient.getAgents());
```

---

## Testing

### Unit Tests

```typescript
import { describe, it, expect, vi } from 'vitest';
import { apiClient } from '@/lib/api-client';

describe('apiClient', () => {
  it('should fetch agents', async () => {
    vi.spyOn(apiClient, 'getAgents').mockResolvedValue({
      success: true,
      data: [{ id: '1', name: 'Agent 1' }],
      timestamp: new Date().toISOString()
    });

    const response = await apiClient.getAgents();
    expect(response.success).toBe(true);
    expect(response.data).toHaveLength(1);
  });
});
```

### Integration Tests

```typescript
describe('Agent Integration', () => {
  it('should deploy and retrieve agent', async () => {
    // Deploy
    const deployResponse = await apiClient.deployAgent({
      name: 'Test Agent',
      tier: 1,
      agent_type: 'test'
    });
    expect(deployResponse.success).toBe(true);

    // Retrieve
    const getResponse = await apiClient.getAgent(deployResponse.data!.id);
    expect(getResponse.data?.name).toBe('Test Agent');
  });
});
```

---

## Troubleshooting

### API Connection Issues

```bash
# Check if API is running
curl http://localhost:9999/health

# Check network connectivity
ping localhost

# Check firewall rules
sudo ufw status
```

### Authentication Issues

```typescript
// Verify token is set
console.log(apiClient.token);

// Refresh token
apiClient.setToken(newToken);

// Clear token
apiClient.clearToken();
```

### Timeout Issues

```typescript
// Increase timeout in api-client.ts
this.client = axios.create({
  timeout: 60000, // 60 seconds
});
```

---

## Additional Resources

- [API Reference](./API_REFERENCE.md)
- [Deployment Architecture](./DEPLOYMENT_ARCHITECTURE.md)
- [Monitoring & Logging](./MONITORING.md)

---

**Status:** 🟢 **PRODUCTION READY**

For questions or issues, contact the development team.
