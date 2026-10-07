/**
 * OMNICYBERDEX — MASTER ORCHESTRATOR DATA SPECIFICATION
 * Dual Engine Architecture: binance_us_engine.py & finance_us_engine.py
 */

export interface TradingEngineState {
  id: string;
  name: string;
  scriptPath: string;
  exchange: 'Binance US' | 'Finance US CEX/DEX';
  status: 'ONLINE' | 'ACTIVE_TRADING' | 'STANDBY' | 'PAUSED';
  latencyMs: number;
  uptimeSeconds: number;
  activePairs: string[];
  totalVolume24hUsd: number;
  ordersExecuted24h: number;
  pnl24hUsd: number;
  pnl24hPct: number;
  lastHeartbeat: string;
  pid: number;
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
    status: 'ACTIVE_TRADING',
    latencyMs: 14.2,
    uptimeSeconds: 84620,
    activePairs: ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'XRP/USDT', 'RLUSD/USDT'],
    totalVolume24hUsd: 1425800,
    ordersExecuted24h: 312,
    pnl24hUsd: 4892.4,
    pnl24hPct: 3.42,
    lastHeartbeat: '2026-10-01T21:20:00Z',
    pid: 14920,
  },
  {
    id: 'finance_us',
    name: 'Finance US CEX/DEX Engine',
    scriptPath: 'C:\\AEGENTIX-WORKSPACE\\src\\python\\finance_us_engine.py',
    exchange: 'Finance US CEX/DEX',
    status: 'ACTIVE_TRADING',
    latencyMs: 18.5,
    uptimeSeconds: 84618,
    activePairs: ['BTC/USD', 'ETH/USD', 'SOL/USD', 'XRP/USD', 'RLUSD/USD'],
    totalVolume24hUsd: 1894200,
    ordersExecuted24h: 428,
    pnl24hUsd: 6140.2,
    pnl24hPct: 4.18,
    lastHeartbeat: '2026-10-01T21:20:01Z',
    pid: 15104,
  },
];

export const INITIAL_ARBITRAGE: ArbitrageOpportunity[] = [
  {
    pair: 'XRP/USD',
    binancePrice: 2.684,
    financeUsPrice: 2.712,
    spreadPct: 1.04,
    estProfitUsd: 284.5,
    route: 'BUY_BINANCE_SELL_FINANCE',
    confidencePct: 98.4,
    liquidityUsd: 85000,
  },
  {
    pair: 'SOL/USD',
    binancePrice: 194.2,
    financeUsPrice: 196.1,
    spreadPct: 0.98,
    estProfitUsd: 380.0,
    route: 'BUY_BINANCE_SELL_FINANCE',
    confidencePct: 96.2,
    liquidityUsd: 120000,
  },
  {
    pair: 'ETH/USD',
    binancePrice: 2688.5,
    financeUsPrice: 2682.1,
    spreadPct: 0.24,
    estProfitUsd: 190.2,
    route: 'BUY_FINANCE_SELL_BINANCE',
    confidencePct: 92.5,
    liquidityUsd: 240000,
  },
  {
    pair: 'RLUSD/USD',
    binancePrice: 1.0001,
    financeUsPrice: 1.0018,
    spreadPct: 0.17,
    estProfitUsd: 85.0,
    route: 'BUY_BINANCE_SELL_FINANCE',
    confidencePct: 99.8,
    liquidityUsd: 500000,
  },
];
