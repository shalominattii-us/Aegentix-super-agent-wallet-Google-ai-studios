/**
 * Zero-Capital Self-Funding Flywheel – Types
 * Sovereign Aegentix / CyberCore
 */

export type StreamType =
  | "swap_routing"
  | "flash_liquidation"
  | "agent_micropayment"
  | "other";

export interface Stream {
  id: string;
  name: string;
  protocol: string;
  type: StreamType;
  status: "active" | "paused" | "disabled";
  totalEarnedUsd: number;
  transactionCount: number;
  description: string;
  capitalRequired: number; // always 0 for true zero-cap
}

export interface InflowRecord {
  id: string;
  timestamp: string;
  streamId: string;
  streamName: string;
  volumeUsd: number;
  grossFeeEarnedUsd: number;
  gasTankSplitUsd: number;
  treasurySplitUsd: number;
  txHash: string;
  description: string;
  mode: "simulated" | "live";
}

export interface ZeroCapState {
  totalRevenueEarnedUsd: number;
  gasTankBalanceUsd: number;
  gasTankEth: number;
  gasTankSol: number;
  treasuryVaultBalanceUsd: number;
  gasRefuelRatioPct: number; // 35
  treasuryRatioPct: number;  // 65
  payoutWalletSol: string;
  payoutWalletEvm: string;
  integratorBps: number;
  streams: Stream[];
  recentInflows: InflowRecord[];
  coinbaseSink: {
    enabled: boolean;
    portfolioUuid: string;
    walletName: string;
    mode: "treasury_primary" | "gas_and_treasury";
  };
  risk: RiskControls;
  lastUpdated: string;
}

export interface RiskControls {
  maxSingleInflowUsd: number;
  maxDailyVolumeUsd: number;
  maxDailyGrossFeeUsd: number;
  minGasTankFloorUsd: number;
  requireLiveFlagForRealExecution: boolean;
  velocityWindowMinutes: number;
  maxInflowsPerWindow: number;
}

export interface SwapRoutingRequest {
  pair: string;
  volumeUsd: number;
  protocol?: string;
  feeBps?: number; // default 25 = 0.25%
  live?: boolean;
}

export interface FlashLiquidationRequest {
  protocol: string;
  debtToRepayUsd: number;
  collateralSeizedBonusPct: number;
  live?: boolean;
}

export interface AgentApiRequest {
  callerAgent: string;
  service: string;
  feeUsd: number;
  live?: boolean;
}

export interface ZeroCapActionResult {
  success: boolean;
  message: string;
  state: ZeroCapState;
  inflow?: InflowRecord;
  riskBlocked?: boolean;
  reason?: string;
}
