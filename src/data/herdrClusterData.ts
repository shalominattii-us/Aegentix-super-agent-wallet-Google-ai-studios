// Herdr - Agent Herd Clustering & Peer Discovery Engine
// Maps to C:\Users\eagle\.herdr\config.json, peers.json, and cluster topology

export type NodeRole = 
  | 'CLUSTER_LEADER' 
  | 'GUARDIAN_GATE' 
  | 'INFERENCE_WORKER' 
  | 'ENCLAVE_EXECUTOR' 
  | 'SIGNING_ORACLE' 
  | 'REMOTE_RELAY';

export type NodeStatus = 'ONLINE' | 'STANDBY' | 'DEGRADED' | 'ELECTION';

export interface HerdrNode {
  id: string;
  name: string;
  role: NodeRole;
  status: NodeStatus;
  host: string;
  port: number;
  latencyMs: number;
  heartbeatAgeMs: number;
  cpuUsagePct: number;
  memoryMb: number;
  version: string;
  authorityLevel: string;
  assignedTasks: string[];
  lastHeartbeat: string;
  capabilities: string[];
}

export interface HerdrTask {
  id: string;
  title: string;
  assignedNodeId: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  dispatchedAt: string;
  durationMs: number;
  payloadSummary: string;
}

export interface HerdrClusterState {
  clusterId: string;
  protocol: string;
  electionTerm: number;
  leaderNodeId: string;
  quorumStatus: 'QUORUM_HEALTHY' | 'PARTITION_DETECTED' | 'ELECTION_IN_PROGRESS';
  heartbeatIntervalMs: number;
  totalNodes: number;
  activeNodes: number;
  totalDispatchedTasks: number;
  activeDispatchedTasks: number;
  avgMeshLatencyMs: number;
  storageDir: string;
  nodes: HerdrNode[];
  recentTasks: HerdrTask[];
}

export const INITIAL_HERDR_CLUSTER: HerdrClusterState = {
  clusterId: 'herdr-sovereign-mesh-01',
  protocol: 'Raft-Sovereign-v2.4',
  electionTerm: 42,
  leaderNodeId: 'node-hermes-01',
  quorumStatus: 'QUORUM_HEALTHY',
  heartbeatIntervalMs: 1500,
  totalNodes: 6,
  activeNodes: 5,
  totalDispatchedTasks: 1842,
  activeDispatchedTasks: 4,
  avgMeshLatencyMs: 0.85,
  storageDir: 'C:\\Users\\eagle\\.herdr',
  nodes: [
    {
      id: 'node-hermes-01',
      name: 'Hermes Conductor',
      role: 'CLUSTER_LEADER',
      status: 'ONLINE',
      host: '127.0.0.1',
      port: 3001,
      latencyMs: 0.4,
      heartbeatAgeMs: 120,
      cpuUsagePct: 14.2,
      memoryMb: 348,
      version: 'v2.8.4',
      authorityLevel: 'Conductor / Judge Promotion',
      assignedTasks: ['Task Scheduling', 'Authority Verification', 'Mesh Telemetry Relay'],
      lastHeartbeat: 'Just now',
      capabilities: ['TASK_DISPATCH', 'CONSENSUS_VOTE', 'CODE_PROMOTION', 'HEALTH_BROADCAST'],
    },
    {
      id: 'node-guardian-01',
      name: 'Guardian Sentinel',
      role: 'GUARDIAN_GATE',
      status: 'ONLINE',
      host: '127.0.0.1',
      port: 9090,
      latencyMs: 0.7,
      heartbeatAgeMs: 250,
      cpuUsagePct: 8.5,
      memoryMb: 192,
      version: 'v1.9.1',
      authorityLevel: 'Strict Egress & Signer Gatekeeper',
      assignedTasks: ['x-guardian-token Audit', 'Header Signature Verification', 'Port Whitelisting'],
      lastHeartbeat: 'Just now',
      capabilities: ['GATE_ENFORCEMENT', 'SECURITY_AUDIT', 'NETWORK_EGRESS_CHECK'],
    },
    {
      id: 'node-heretic-01',
      name: 'Heretic Reasoning Engine',
      role: 'INFERENCE_WORKER',
      status: 'ONLINE',
      host: '127.0.0.1',
      port: 8081,
      latencyMs: 1.1,
      heartbeatAgeMs: 400,
      cpuUsagePct: 28.4,
      memoryMb: 612,
      version: 'v3.2.0',
      authorityLevel: 'System 1 / System 2 Inference Authority',
      assignedTasks: ['Arbitrage Spread Analysis', 'OODA Pulse Formulation', 'Risk Scenario Stress'],
      lastHeartbeat: '1s ago',
      capabilities: ['REASONING_PIPELINE', 'PROMPT_SYNTHESIS', 'MARKET_HEURISTICS'],
    },
    {
      id: 'node-cybernetics-01',
      name: 'Cybernetics Core Enclave',
      role: 'ENCLAVE_EXECUTOR',
      status: 'ONLINE',
      host: '127.0.0.1',
      port: 9005,
      latencyMs: 0.3,
      heartbeatAgeMs: 180,
      cpuUsagePct: 6.8,
      memoryMb: 144,
      version: 'v4.1.0',
      authorityLevel: 'PowerShell / Subprocess Isolation',
      assignedTasks: ['Local Shell Sandbox', 'Host Directory Mirroring', 'Integrity Proof Generation'],
      lastHeartbeat: 'Just now',
      capabilities: ['SHELL_EXECUTION', 'FILE_INTEGRITY', 'SUBPROCESS_MONITOR'],
    },
    {
      id: 'node-actor-001',
      name: 'Actor-001 Sovereign Signer',
      role: 'SIGNING_ORACLE',
      status: 'ONLINE',
      host: '127.0.0.1',
      port: 8545,
      latencyMs: 1.4,
      heartbeatAgeMs: 520,
      cpuUsagePct: 4.1,
      memoryMb: 110,
      version: 'v1.0.8',
      authorityLevel: 'Cold Signer & Hardware Stamping',
      assignedTasks: ['Ledger Stamping', 'Signature Verification', 'Hardware Key Attestation'],
      lastHeartbeat: '2s ago',
      capabilities: ['CRYPTO_SIGNING', 'LEDGER_ATTESTATION', 'NONCE_SEQUENCING'],
    },
    {
      id: 'node-rog-bridge',
      name: 'ROG Gemini Hardware Bridge',
      role: 'REMOTE_RELAY',
      status: 'STANDBY',
      host: '192.168.1.185',
      port: 8081,
      latencyMs: 12.8,
      heartbeatAgeMs: 1840,
      cpuUsagePct: 2.0,
      memoryMb: 96,
      version: 'v2.1.0',
      authorityLevel: 'Hardware GPU & Voice Synthesizer',
      assignedTasks: ['Lyria Music Gen', 'Deep Research Grounding', 'Offloaded Batch Matrix'],
      lastHeartbeat: '3s ago',
      capabilities: ['GPU_OFFLOAD', 'REMOTE_PROXY', 'VOICE_PIPELINE'],
    },
  ],
  recentTasks: [
    {
      id: 'TASK-HERDR-901',
      title: 'Real-Time CEX/DEX Spread Invariant Evaluation',
      assignedNodeId: 'node-heretic-01',
      status: 'RUNNING',
      priority: 'HIGH',
      dispatchedAt: new Date(Date.now() - 4000).toISOString(),
      durationMs: 4000,
      payloadSummary: 'ETH/USDC & BTC/USDT price disparity matrix over 12 orderbooks',
    },
    {
      id: 'TASK-HERDR-902',
      title: 'Host Enclave Integrity Scan on C:\\Aegentix',
      assignedNodeId: 'node-cybernetics-01',
      status: 'RUNNING',
      priority: 'MEDIUM',
      dispatchedAt: new Date(Date.now() - 8500).toISOString(),
      durationMs: 8500,
      payloadSummary: 'Hashing 597 modified source files against Git SHA commit d01422f9',
    },
    {
      id: 'TASK-HERDR-903',
      title: 'Port 3001 Whitelist Guardian Verification',
      assignedNodeId: 'node-guardian-01',
      status: 'COMPLETED',
      priority: 'CRITICAL',
      dispatchedAt: new Date(Date.now() - 32000).toISOString(),
      durationMs: 42,
      payloadSummary: 'Loopback 127.0.0.1:3001 verified against Hermes authority policy',
    },
    {
      id: 'TASK-HERDR-904',
      title: 'Quorum Heartbeat Wave & Peer Mesh Discovery',
      assignedNodeId: 'node-hermes-01',
      status: 'COMPLETED',
      priority: 'LOW',
      dispatchedAt: new Date(Date.now() - 1500).toISOString(),
      durationMs: 12,
      payloadSummary: 'Gossip pulse acknowledged by 5/6 cluster peer members',
    },
  ],
};
