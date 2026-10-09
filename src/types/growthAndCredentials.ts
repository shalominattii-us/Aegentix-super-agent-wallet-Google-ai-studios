export type StrategyMode = 
  | 'BALANCED_ARBITRAGE' 
  | 'AGGRESSIVE_ALPHA' 
  | 'DELTA_NEUTRAL' 
  | 'SOVEREIGN_ENDOWMENT' 
  | 'CUSTOM';

export interface MilestoneTarget {
  id: string;
  name: string;
  targetUsd: number;
  targetMonth: number;
  reached: boolean;
  notes: string;
  badge: string;
}

export interface PortfolioGrowthPlan {
  id: string;
  planName: string;
  initialCapitalUsd: number;
  targetMilestoneUsd: number;
  monthlyContributionUsd: number;
  projectedAprPct: number;
  strategyMode: StrategyMode;
  timeHorizonMonths: number;
  reinvestmentRatePct: number;
  maxDrawdownTolerancePct: number;
  milestones: MilestoneTarget[];
  updatedAt: string;
  notes?: string;
}

export type TradingCredentialType = 
  | 'CEX_API' 
  | 'DEX_KEYPAIR' 
  | 'FIX_SESSION' 
  | 'REGULATORY_ID' 
  | 'HSM_ENCLAVE';

export type TradingCredentialStatus = 
  | 'ACTIVE' 
  | 'TESTING' 
  | 'HARDWARE_LOCKED' 
  | 'READ_ONLY' 
  | 'REVOKED';

export interface TradingCredential {
  id: string;
  provider: string;
  name: string;
  type: TradingCredentialType;
  status: TradingCredentialStatus;
  keyIdentifier: string;
  secretMasked: string;
  permissions: string;
  network: string;
  ipWhitelist?: string;
  latencyMs?: number;
  lastTestedAt: string;
  createdAt: string;
  rateLimitTier?: string;
  hardwareBound?: boolean;
}

export type CyberGymCredentialCategory = 
  | 'ATHLETE_PASSPORT' 
  | 'NSF_GRANT' 
  | 'NIST_COMPLIANCE' 
  | 'GOV_CLEARANCE' 
  | 'TIER_ACHIEVEMENT';

export type CyberGymCredentialStatus = 
  | 'VERIFIED' 
  | 'ACTIVE' 
  | 'ATTESTED' 
  | 'AIR_GAPPED';

export interface CyberGymCredential {
  id: string;
  athleteOrEntity: string;
  title: string;
  category: CyberGymCredentialCategory;
  tier: string;
  status: CyberGymCredentialStatus;
  credentialHash: string;
  verifierSignature: string;
  issuedAt: string;
  expiresAt: string;
  oracleQuorum: string;
  enclaveId: string;
  capabilities: string[];
  grantId?: string;
  scoreBenchmark?: number;
}
