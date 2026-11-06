/**
 * OMNICYBERDEX — MASTER ORCHESTRATOR DATA SPECIFICATION
 * Dual Engine Architecture: binance_us_engine.py & finance_us_engine.py
 */

export interface TradingEngineState {
  id: string;
  name: string;
  scriptPath: string;
  exchange: 'Binance US' | 'Finance US CEX/DEX';
  status: 'ONLINE' | 'ACTIVE_TRADING' | 'STANDBY' | 'PAUSED' | 'NOT_OPERATIONAL';
  latencyMs: number | null;
  uptimeSeconds: number | null;
  activePairs: string[];
  totalVolume24hUsd: number | null;
  ordersExecuted24h: number | null;
  pnl24hUsd: number | null;
  pnl24hPct: number | null;
  lastHeartbeat: string | null;
  pid: number | null;
}

export interface ArbitrageOpportunity {
  pair: string;
  binancePrice: number;
  financeUsPrice: number;
  spreadPct: number;
  estProfitUsd: number;
  route: 'BUY_BINANCE_SELL_FINANCE' | 'BUY_FINANCE_SELL_BINANCE';
  confidencePct: number;
  liquidityUsd: number;
}

export const INITIAL_ENGINES: TradingEngineState[] = [
  {
    id: 'binance_us',
    name: 'Binance US Engine',
    scriptPath: 'C:\\AEGENTIX-WORKSPACE\\omnicyberdex\\engines\\binance_us_engine.py',
    exchange: 'Binance US',
    status: 'NOT_OPERATIONAL',
    latencyMs: null,
    uptimeSeconds: null,
    activePairs: [],
    totalVolume24hUsd: null,
    ordersExecuted24h: null,
    pnl24hUsd: null,
    pnl24hPct: null,
    lastHeartbeat: null,
    pid: null,
  },
  {
    id: 'finance_us',
    name: 'Finance US CEX/DEX Engine',
    scriptPath: 'C:\\AEGENTIX-WORKSPACE\\src\\python\\finance_us_engine.py',
    exchange: 'Finance US CEX/DEX',
    status: 'NOT_OPERATIONAL',
    latencyMs: null,
    uptimeSeconds: null,
    activePairs: [],
    totalVolume24hUsd: null,
    ordersExecuted24h: null,
    pnl24hUsd: null,
    pnl24hPct: null,
    lastHeartbeat: null,
    pid: null,
  },
];

/** No measured spreads. An empty list is not a zero-profit result. */
export const INITIAL_ARBITRAGE: ArbitrageOpportunity[] = [];
