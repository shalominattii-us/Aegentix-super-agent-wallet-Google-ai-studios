// Machine-readable schema & types for CyberGym Agent Achievement & Progression System
// Aligned with CyberGenNet & SovereignOS developmental lineage specifications for NSF research

export type AgentRoleType =
  | 'RECON'
  | 'INTEL'
  | 'DEFEND'
  | 'OFFEND'
  | 'MEDIC'
  | 'GHOST'
  | 'INFIL'
  | 'EXFIL'
  | 'SWARM'
  | 'GOVERNOR'
  | 'SYSTEM';

export type VerificationMethod =
  | 'DETERMINISTIC_ORACLE'
  | 'POLICY_GOVERNOR'
  | 'CROSS_AGENT_CONSENSUS'
  | 'REPRODUCIBLE_LAB_CONTAINER'
  | 'HARDWARE_ATTESTATION';

export interface AchievementMetric {
  name: string;
  key: string;
  target: string;
  unit: string;
  thresholdValue: number;
  actualValue?: number;
  passed?: boolean;
}

export interface EvidenceRequirement {
  id: string;
  name: string;
  format: 'json' | 'topology_map' | 'diff_state' | 'merkle_proof' | 'pcap_trace' | 'bundle' | 'policy_decision' | 'markdown';
  description: string;
  sampleArtifact: Record<string, unknown>;
}

export interface UnlockableBehavior {
  capability: string;
  agentBehavior: string;
  privilegeLevel: string;
}

export interface AchievementProvenance {
  scenarioId: string;
  telemetryHash: string;
  evaluatorId: string;
  timestamp: string;
  signature: string;
  seed: string;
}

export interface CyberGymAchievement {
  id: string;
  code: string;
  name: string;
  icon: string;
  tier: 'NOVICE' | 'PRACTITIONER' | 'SPECIALIST' | 'APEX' | 'SOVEREIGN';
  description: string;
  agent_roles: AgentRoleType[];
  prerequisites: string[];
  objective: string;
  constraints: string[];
  metrics: AchievementMetric[];
  evidence_requirements: EvidenceRequirement[];
  scoring_function: string;
  verification_method: VerificationMethod;
  unlocks: UnlockableBehavior[];
  provenance: AchievementProvenance;
  // Developmental State
  status: 'LOCKED' | 'IN_PROGRESS' | 'UNLOCKED' | 'VERIFIED';
  developmentalStatement: string;
  achievedScore?: number;
  lastVerifiedAt?: string;
}

export type PipelineStage =
  | 'SCENARIO'
  | 'AGENT_ACTIONS'
  | 'TELEMETRY'
  | 'EVIDENCE_COLLECTOR'
  | 'POLICY_GOVERNOR'
  | 'METRICS_ENGINE'
  | 'VERIFIER'
  | 'ACHIEVEMENT_UNLOCK'
  | 'SOVEREIGN_SUCCESS_VAULT';

export interface VerificationPipelineStep {
  stage: PipelineStage;
  title: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  timestamp?: string;
  details: string;
  payload?: Record<string, unknown>;
}
