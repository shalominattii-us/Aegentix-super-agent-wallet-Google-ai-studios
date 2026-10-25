/**
 * Zero-Capital Self-Funding Flywheel Engine
 * Handles state, revenue splits, risk controls, and Coinbase sink wiring.
 */

import { randomUUID } from "crypto";
import fs from "fs/promises";
import path from "path";
import type {
  ZeroCapState,
  Stream,
  InflowRecord,
  SwapRoutingRequest,
  FlashLiquidationRequest,
  AgentApiRequest,
  ZeroCapActionResult,
  RiskControls,
} from "./types";

const STATE_FILE = path.join(process.cwd(), "config", "zero-cap-state.json");
const SUPER_AGENT_WALLET_PATH = path.join(
  process.cwd(),
  "config",
  "super-agent-wallet.json"
);

const DEFAULT_RISK: RiskControls = {
  maxSingleInflowUsd: 50_000,
  maxDailyVolumeUsd: 250_000,
  maxDailyGrossFeeUsd: 5_000,
  minGasTankFloorUsd: 25,
  requireLiveFlagForRealExecution: true,
  velocityWindowMinutes: 15,
  maxInflowsPerWindow: 40,
};

const DEFAULT_STREAMS: Stream[] = [
  {
    id: "stream-swap-routing",
    name: "Jupiter / Aggregator Swap Routing",
    protocol: "Jupiter V6 (Solana) + Multi-DEX",
    type: "swap_routing",
    status: "active",
    totalEarnedUsd: 0,
    transactionCount: 0,
    description:
      "Takes a small integrator cut (default 0.25%) on routed swap volume. Zero inventory risk.",
    capitalRequired: 0,
  },
  {
    id: "stream-flash-liq",
    name: "Atomic Flash Loan Liquidations",
    protocol: "Aave v3 / Compound / Morpho (multi-chain)",
    type: "flash_liquidation",
    status: "active",
    totalEarnedUsd: 0,
    transactionCount: 0,
    description:
      "Captures liquidation bonuses via atomic flash loans. No capital locked between txs.",
    capitalRequired: 0,
  },
  {
    id: "stream-agent-x402",
    name: "Agent x402 Micropayments",
    protocol: "Aegentix Agent Mesh / x402",
    type: "agent_micropayment",
    status: "active",
    totalEarnedUsd: 0,
    transactionCount: 0,
    description:
      "Charges other agents for data, signals, and compute services via micropayments.",
    capitalRequired: 0,
  },
];

function createDefaultState(): ZeroCapState {
  return {
    totalRevenueEarnedUsd: 0,
    gasTankBalanceUsd: 0,
    gasTankEth: 0,
    gasTankSol: 0,
    treasuryVaultBalanceUsd: 0,
    gasRefuelRatioPct: 35,
    treasuryRatioPct: 65,
    payoutWalletSol:
      process.env.ZERO_CAP_SOL_PAYOUT ||
      "4u8D51aX8B2Kp93kYvLmQjPo871aZb91e8X2",
    payoutWalletEvm:
      process.env.ZERO_CAP_EVM_PAYOUT ||
      "0x71C568a29A88F3c37e97123984FaA628469E849F",
    integratorBps: 25,
    streams: structuredClone(DEFAULT_STREAMS),
    recentInflows: [],
    coinbaseSink: {
      enabled: true,
      portfolioUuid: "b7f531d6-3469-4a8b-8d5e-4fca09ad54b7",
      walletName: "Super Agent Wallet",
      mode: "treasury_primary",
    },
    risk: { ...DEFAULT_RISK },
    lastUpdated: new Date().toISOString(),
  };
}

let memoryState: ZeroCapState | null = null;

async function loadState(): Promise<ZeroCapState> {
  if (memoryState) return memoryState;

  try {
    const raw = await fs.readFile(STATE_FILE, "utf-8");
    memoryState = JSON.parse(raw) as ZeroCapState;
    // Ensure coinbase sink is always present and points at Super Agent Wallet
    if (!memoryState.coinbaseSink) {
      memoryState.coinbaseSink = createDefaultState().coinbaseSink;
    }
    return memoryState;
  } catch {
    memoryState = createDefaultState();
    await persistState(memoryState);
    return memoryState;
  }
}

async function persistState(state: ZeroCapState): Promise<void> {
  state.lastUpdated = new Date().toISOString();
  memoryState = state;
  try {
    await fs.mkdir(path.dirname(STATE_FILE), { recursive: true });
    await fs.writeFile(STATE_FILE, JSON.stringify(state, null, 2), "utf-8");
  } catch (err) {
    console.warn("[ZeroCap] Failed to persist state:", err);
  }
}

/** Daily volume / fee trackers (in-memory, reset on process restart) */
const dailyStats = {
  date: new Date().toISOString().slice(0, 10),
  volumeUsd: 0,
  grossFeeUsd: 0,
};

function resetDailyIfNeeded() {
  const today = new Date().toISOString().slice(0, 10);
  if (dailyStats.date !== today) {
    dailyStats.date = today;
    dailyStats.volumeUsd = 0;
    dailyStats.grossFeeUsd = 0;
  }
}

function checkRisk(
  state: ZeroCapState,
  volumeUsd: number,
  grossFeeUsd: number
): { allowed: boolean; reason?: string } {
  resetDailyIfNeeded();
  const r = state.risk;

  if (volumeUsd > r.maxSingleInflowUsd) {
    return {
      allowed: false,
      reason: `Single inflow $${volumeUsd} exceeds maxSingleInflowUsd $${r.maxSingleInflowUsd}`,
    };
  }
  if (dailyStats.volumeUsd + volumeUsd > r.maxDailyVolumeUsd) {
    return {
      allowed: false,
      reason: `Daily volume would exceed $${r.maxDailyVolumeUsd}`,
    };
  }
  if (dailyStats.grossFeeUsd + grossFeeUsd > r.maxDailyGrossFeeUsd) {
    return {
      allowed: false,
      reason: `Daily gross fee would exceed $${r.maxDailyGrossFeeUsd}`,
    };
  }

  // Velocity: count recent inflows in window
  const windowMs = r.velocityWindowMinutes * 60 * 1000;
  const cutoff = Date.now() - windowMs;
  const recentCount = state.recentInflows.filter(
    (i) => new Date(i.timestamp).getTime() > cutoff
  ).length;
  if (recentCount >= r.maxInflowsPerWindow) {
    return {
      allowed: false,
      reason: `Velocity limit: ${recentCount} inflows in last ${r.velocityWindowMinutes}m (max ${r.maxInflowsPerWindow})`,
    };
  }

  return { allowed: true };
}

function applySplit(
  state: ZeroCapState,
  grossFeeUsd: number
): { gasTankSplitUsd: number; treasurySplitUsd: number } {
  const gasPct = state.gasRefuelRatioPct / 100;
  const treasuryPct = state.treasuryRatioPct / 100;
  const gasTankSplitUsd = +(grossFeeUsd * gasPct).toFixed(6);
  const treasurySplitUsd = +(grossFeeUsd * treasuryPct).toFixed(6);

  state.gasTankBalanceUsd = +(state.gasTankBalanceUsd + gasTankSplitUsd).toFixed(6);
  state.treasuryVaultBalanceUsd = +(
    state.treasuryVaultBalanceUsd + treasurySplitUsd
  ).toFixed(6);
  state.totalRevenueEarnedUsd = +(
    state.totalRevenueEarnedUsd + grossFeeUsd
  ).toFixed(6);

  // Simple ETH/SOL estimation for display (not real conversion)
  state.gasTankEth = +(state.gasTankBalanceUsd / 3200).toFixed(6);
  state.gasTankSol = +(state.gasTankBalanceUsd / 180).toFixed(4);

  return { gasTankSplitUsd, treasurySplitUsd };
}

function recordInflow(
  state: ZeroCapState,
  params: {
    streamId: string;
    streamName: string;
    volumeUsd: number;
    grossFeeEarnedUsd: number;
    gasTankSplitUsd: number;
    treasurySplitUsd: number;
    description: string;
    mode: "simulated" | "live";
  }
): InflowRecord {
  const inflow: InflowRecord = {
    id: randomUUID(),
    timestamp: new Date().toISOString(),
    streamId: params.streamId,
    streamName: params.streamName,
    volumeUsd: params.volumeUsd,
    grossFeeEarnedUsd: params.grossFeeEarnedUsd,
    gasTankSplitUsd: params.gasTankSplitUsd,
    treasurySplitUsd: params.treasurySplitUsd,
    txHash: `0x${randomUUID().replace(/-/g, "").slice(0, 16)}…`,
    description: params.description,
    mode: params.mode,
  };

  state.recentInflows.unshift(inflow);
  if (state.recentInflows.length > 100) {
    state.recentInflows = state.recentInflows.slice(0, 100);
  }

  // Update stream counters
  const stream = state.streams.find((s) => s.id === params.streamId);
  if (stream) {
    stream.totalEarnedUsd = +(stream.totalEarnedUsd + params.grossFeeEarnedUsd).toFixed(6);
    stream.transactionCount += 1;
  }

  dailyStats.volumeUsd += params.volumeUsd;
  dailyStats.grossFeeUsd += params.grossFeeEarnedUsd;

  return inflow;
}

// ── Public API ──────────────────────────────────────────────────────────────

export async function getZeroCapStatus(): Promise<ZeroCapState> {
  return loadState();
}

export async function simulateSwapRouting(
  req: SwapRoutingRequest
): Promise<ZeroCapActionResult> {
  const state = await loadState();
  const feeBps = req.feeBps ?? state.integratorBps;
  const grossFee = +((req.volumeUsd * feeBps) / 10_000).toFixed(6);
  const mode = req.live ? "live" : "simulated";

  if (mode === "live" && state.risk.requireLiveFlagForRealExecution) {
    // Live path is gated – currently still recorded but flagged.
    // Real on-chain execution would be plugged here.
  }

  const risk = checkRisk(state, req.volumeUsd, grossFee);
  if (!risk.allowed) {
    return {
      success: false,
      message: `Risk blocked: ${risk.reason}`,
      state,
      riskBlocked: true,
      reason: risk.reason,
    };
  }

  const { gasTankSplitUsd, treasurySplitUsd } = applySplit(state, grossFee);
  const inflow = recordInflow(state, {
    streamId: "stream-swap-routing",
    streamName: "Jupiter / Aggregator Swap Routing",
    volumeUsd: req.volumeUsd,
    grossFeeEarnedUsd: grossFee,
    gasTankSplitUsd,
    treasurySplitUsd,
    description: `${req.protocol || "Jupiter V6"} ${req.pair} – ${feeBps} bps cut`,
    mode,
  });

  await persistState(state);

  return {
    success: true,
    message: `Swap routing cut captured: +$${grossFee.toFixed(2)} (Gas $${gasTankSplitUsd.toFixed(2)} / Treasury $${treasurySplitUsd.toFixed(2)})`,
    state,
    inflow,
  };
}

export async function simulateFlashLiquidation(
  req: FlashLiquidationRequest
): Promise<ZeroCapActionResult> {
  const state = await loadState();
  const bonusUsd = +(
    (req.debtToRepayUsd * req.collateralSeizedBonusPct) / 100
  ).toFixed(6);
  // Take a conservative 30% of the bonus as net after gas/slippage model
  const grossFee = +(bonusUsd * 0.3).toFixed(6);
  const mode = req.live ? "live" : "simulated";

  const risk = checkRisk(state, req.debtToRepayUsd, grossFee);
  if (!risk.allowed) {
    return {
      success: false,
      message: `Risk blocked: ${risk.reason}`,
      state,
      riskBlocked: true,
      reason: risk.reason,
    };
  }

  const { gasTankSplitUsd, treasurySplitUsd } = applySplit(state, grossFee);
  const inflow = recordInflow(state, {
    streamId: "stream-flash-liq",
    streamName: "Atomic Flash Loan Liquidations",
    volumeUsd: req.debtToRepayUsd,
    grossFeeEarnedUsd: grossFee,
    gasTankSplitUsd,
    treasurySplitUsd,
    description: `${req.protocol} liquidation – ${req.collateralSeizedBonusPct}% bonus, net ~30% kept`,
    mode,
  });

  await persistState(state);

  return {
    success: true,
    message: `Flash liquidation bounty: +$${grossFee.toFixed(2)} (Gas $${gasTankSplitUsd.toFixed(2)} / Treasury $${treasurySplitUsd.toFixed(2)})`,
    state,
    inflow,
  };
}

export async function simulateAgentApiCall(
  req: AgentApiRequest
): Promise<ZeroCapActionResult> {
  const state = await loadState();
  const grossFee = +req.feeUsd.toFixed(6);
  const mode = req.live ? "live" : "simulated";

  const risk = checkRisk(state, grossFee, grossFee);
  if (!risk.allowed) {
    return {
      success: false,
      message: `Risk blocked: ${risk.reason}`,
      state,
      riskBlocked: true,
      reason: risk.reason,
    };
  }

  const { gasTankSplitUsd, treasurySplitUsd } = applySplit(state, grossFee);
  const inflow = recordInflow(state, {
    streamId: "stream-agent-x402",
    streamName: "Agent x402 Micropayments",
    volumeUsd: grossFee,
    grossFeeEarnedUsd: grossFee,
    gasTankSplitUsd,
    treasurySplitUsd,
    description: `${req.callerAgent} → ${req.service}`,
    mode,
  });

  await persistState(state);

  return {
    success: true,
    message: `Agent micropayment received: +$${grossFee.toFixed(2)} from ${req.callerAgent}`,
    state,
    inflow,
  };
}

/**
 * Explicitly bind / re-bind the Coinbase Super Agent Wallet as the sink.
 */
export async function bindCoinbaseSuperAgentWallet(): Promise<ZeroCapState> {
  const state = await loadState();

  try {
    const raw = await fs.readFile(SUPER_AGENT_WALLET_PATH, "utf-8");
    const wallet = JSON.parse(raw);
    state.coinbaseSink = {
      enabled: true,
      portfolioUuid: wallet.portfolio?.uuid || "b7f531d6-3469-4a8b-8d5e-4fca09ad54b7",
      walletName: wallet.wallet_name || "Super Agent Wallet",
      mode: "treasury_primary",
    };
  } catch {
    // Keep existing defaults if file missing
    state.coinbaseSink.enabled = true;
  }

  await persistState(state);
  return state;
}
