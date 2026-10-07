/**
 * INSTITUTIONAL TRADING RUNBOOK, PLAYBOOK, QUANTITATIVE METHODOLOGY & SIGNAL GENERATION SPECIFICATION
 * Desk: Sovereign Quantitative Trading & Arbitrage Desk (TSL / CEX / DEX / Federal DAG)
 */

export interface InstitutionalPlaybook {
  id: string;
  title: string;
  tagline: string;
  category: 'ARBITRAGE' | 'DELTA_NEUTRAL' | 'VOLATILITY' | 'LIQUIDITY_PROVISION' | 'FEDERAL_SETTLEMENT' | 'DAG_MEV_SHIELD';
  status: 'ACTIVE' | 'WARMING_UP' | 'PAUSED' | 'SIMULATION';
  targetAssets: string[];
  venues: string[];
  winRatePct: number;
  sharpeRatio: number;
  profitFactor: number;
  maxDrawdownPct: number;
  annualizedYieldPct: number;
  avgHoldDuration: string;
  executionLatency: string;
  edgeMechanic: string;
  riskControls: string[];
  triggerConditions: string[];
  exitProtocol: string;
  capitalAllocatedUsd: number;
  currentPnl24hUsd: number;
}

export interface RunbookSopStep {
  id: string;
  code: string;
  phase: 'PRE_MARKET' | 'EXECUTION_LOOP' | 'CIRCUIT_BREAKER' | 'SETTLEMENT_RECON' | 'OVERNIGHT_POSTURE';
  title: string;
  mandatoryAction: string;
  automatedCheckCommand: string;
  failCondition: string;
  recoveryAction: string;
  status: 'VERIFIED' | 'RUNNING' | 'PENDING' | 'ACTION_REQUIRED';
  lastVerifiedAt: string;
}

export interface QuantitativeMethodology {
  id: string;
  name: string;
  mathematicalModel: string;
  formula: string;
  institutionalApplication: string;
  currentReading: string;
  regimeState: string;
  recommendedAction: string;
}

export interface InstitutionalSignal {
  id: string;
  pair: string;
  direction: 'STRONG_BUY' | 'BUY' | 'DELTA_NEUTRAL_HEDGE' | 'TAKE_PROFIT' | 'LIQUIDITY_HARVEST';
  confidencePct: number;
  expectedAlphaBps: number;
  signalSources: string[];
  cexPrice: number;
  dexPrice: number;
  spreadBps: number;
  vpinToxicityScore: number;
  orderBookImbalanceRatio: number;
  suggestedSizeUsd: number;
  stopLossUsd: number;
  targetPriceUsd: number;
  timeHorizon: string;
  status: 'GENERATED' | 'VALIDATED' | 'EXECUTING' | 'FILLED';
  timestamp: string;
}

export const INSTITUTIONAL_PLAYBOOKS: InstitutionalPlaybook[] = [
  {
    id: 'PB-01-ATOMIC-ARB',
    title: 'Atomic Cross-Venue Latency & Triangular Arbitrage',
    tagline: 'High-frequency sub-20ms atomic dual-leg execution across Binance US & Finance US CEX/DEX',
    category: 'ARBITRAGE',
    status: 'ACTIVE',
    targetAssets: ['XRP/USD', 'RLUSD/USD', 'SOL/USD'],
    venues: ['Binance US (CEX)', 'Finance US (CEX/DEX)', 'XRPL AMM'],
    winRatePct: 91.4,
    sharpeRatio: 3.82,
    profitFactor: 2.85,
    maxDrawdownPct: 1.15,
    annualizedYieldPct: 48.6,
    avgHoldDuration: '850 ms - 4.2 s',
    executionLatency: '14.2 ms avg',
    edgeMechanic: 'Captures order-book dislocation between centralized order books and automated market maker bonding curves prior to global price convergence.',
    riskControls: [
      'Dual-leg atomic commit (simultaneous execution or rollback)',
      'Slippage budget capped at 1.8 bps maximum',
      'Individual trade size limited to 4% of Tier-1 book depth',
    ],
    triggerConditions: [
      'Bid/Ask price disparity exceeds 18 basis points across venues',
      'Combined book depth supports >$25,000 fill without adverse impact',
      'Gas & taker fee hurdle rate cleared with >12 bps net margin',
    ],
    exitProtocol: 'Instant atomic fill on both exchanges; delta immediately reconciled to neutral.',
    capitalAllocatedUsd: 150000,
    currentPnl24hUsd: 4892.4,
  },
  {
    id: 'PB-02-DELTA-NEUTRAL',
    title: 'Perp-Spot Basis & Federal Yield Carry Engine',
    tagline: 'Risk-off cash & carry extracting positive funding rate yield combined with tokenized T-Bill backing',
    category: 'DELTA_NEUTRAL',
    status: 'ACTIVE',
    targetAssets: ['BTC/USD', 'ETH/USD', 'SOL/USD'],
    venues: ['Institutional Perp DEX', 'Spot Custody Vault', 'BUIDL Treasury'],
    winRatePct: 98.7,
    sharpeRatio: 4.15,
    profitFactor: 4.20,
    maxDrawdownPct: 0.85,
    annualizedYieldPct: 24.8,
    avgHoldDuration: '7 - 28 Days',
    executionLatency: 'Scheduled VWAP',
    edgeMechanic: 'Long spot token collateralized in BlackRock BUIDL earning 4.9% annualized yield while shorting matching perpetual futures at 18-35% annualized funding premium.',
    riskControls: [
      'Continuous delta monitoring maintaining net market exposure between -0.05% and +0.05%',
      'Margin buffer maintained at 300% collateralization to survive 40% tail-risk price swings',
      'Automated funding exhaustion exit when 7-day rolling APR drops below 8.0%',
    ],
    triggerConditions: [
      'Perpetual funding rate APR exceeds 16.0% annualized',
      'Basis spread between spot index and perp mark price >0.6%',
      'Spot collateral qualifies for FedNow / TSL prime custody',
    ],
    exitProtocol: 'TWAP unwinding of spot collateral and simultaneous short cover over 30-minute intervals.',
    capitalAllocatedUsd: 250000,
    currentPnl24hUsd: 2140.8,
  },
  {
    id: 'PB-03-FED-SETTLEMENT',
    title: 'RLUSD / USDC Peg Stabilization & Federal Liquidity Corridor',
    tagline: 'Regulatory-compliant stablecoin mint/burn arbitrage spanning NYDFS trust accounts & FedNow gateways',
    category: 'FEDERAL_SETTLEMENT',
    status: 'ACTIVE',
    targetAssets: ['RLUSD', 'USDC', 'USD'],
    venues: ['NYDFS Escrow', 'Circle CCTP', 'FedNow Real-Time Gateway', 'XRPL Ledger'],
    winRatePct: 99.8,
    sharpeRatio: 5.40,
    profitFactor: 8.90,
    maxDrawdownPct: 0.20,
    annualizedYieldPct: 18.2,
    avgHoldDuration: 'Intraday (T+0 Finality)',
    executionLatency: '9.8 ms gateway sync',
    edgeMechanic: 'Exploits micro-deviations ($0.9985 - $1.0018) in institutional stablecoin secondary markets by executing guaranteed 1:1 parity redemptions through primary Federal trust reserves.',
    riskControls: [
      'Only 100% cash/T-bill audited reserves eligible (NYDFS & FinCEN chartered only)',
      'Single corridor exposure restricted to $500,000 per settlement tranche',
      'Zero unhedged FX or fiat de-peg tolerance',
    ],
    triggerConditions: [
      'Secondary market RLUSD or USDC price drifts beyond $1.0000 ± 0.0012',
      'FedNow or Circle CCTP liquidity bridge confirms instant clearing window',
    ],
    exitProtocol: 'Direct primary issuer redemption or secondary market rebalancing upon mean reversion to $1.0000.',
    capitalAllocatedUsd: 200000,
    currentPnl24hUsd: 1840.5,
  },
  {
    id: 'PB-04-DAG-MEV-SHIELD',
    title: 'Blockless Asynchronous DAG Front-Running Shield & Micro-Consensus Arb',
    tagline: 'Zero-gas asynchronous DAG state channel notarization preventing EVM sandwich attacks & MEV slippage',
    category: 'DAG_MEV_SHIELD',
    status: 'ACTIVE',
    targetAssets: ['DAG/USD', 'XRP/USD', 'ETH/USD'],
    venues: ['Federal DAG Hypergraph', 'DoD State Channels', 'Decentralized Swaps'],
    winRatePct: 94.2,
    sharpeRatio: 3.60,
    profitFactor: 3.10,
    maxDrawdownPct: 1.40,
    annualizedYieldPct: 36.5,
    avgHoldDuration: 'Sub-second to 15 min',
    executionLatency: '4.8 ms DAG checkpoint',
    edgeMechanic: 'Routes institutional orders through asynchronous DAG state channels with cryptographic zero-knowledge timestamps, rendering public mempool front-running algorithms mathematically blind.',
    riskControls: [
      'NIST SP 800-53 Level 4 security attestation required on all DAG full nodes',
      'Automatic state-channel rollover if peer latency exceeds 25 ms',
      'Anti-MEV slippage abort threshold set at 0.5 bps',
    ],
    triggerConditions: [
      'Public mempool toxicity score (VPIN) exceeds 0.72',
      'Sandwich bot activity detected on public DEX mempool',
      'DAG Hypergraph node reports sub-5ms consensus confirmation',
    ],
    exitProtocol: 'Asynchronous DAG state channel snapshot notarization into global state ledger.',
    capitalAllocatedUsd: 100000,
    currentPnl24hUsd: 1420.0,
  },
  {
    id: 'PB-05-VOL-DISPERSION',
    title: 'Multi-Regime OODA Volatility Dispersion & Statistical Mean Reversion',
    tagline: 'Swarm intelligence dynamically toggling between momentum breakout and statistical mean reversion',
    category: 'VOLATILITY',
    status: 'ACTIVE',
    targetAssets: ['SOL/USD', 'XRP/USD', 'ETH/USD', 'BTC/USD'],
    venues: ['Binance US', 'Finance US', 'Raydium', 'Uniswap v3'],
    winRatePct: 86.8,
    sharpeRatio: 3.25,
    profitFactor: 2.45,
    maxDrawdownPct: 2.10,
    annualizedYieldPct: 42.0,
    avgHoldDuration: '15 min - 4 hours',
    executionLatency: '18.5 ms',
    edgeMechanic: 'Calculates the implied volatility correlation dispersion across top-tier digital assets. Sells high-IV overextended outliers while buying low-IV undervalued assets with cointegrated pairs.',
    riskControls: [
      'Hard portfolio stop-loss at 2.5% daily drawdown',
      'Kelly Criterion sizing capped at half-Kelly (f*/2)',
      'Trailing stop-loss ratcheted at 1.5 ATR intervals',
    ],
    triggerConditions: [
      'Asset z-score exceeds 2.4 standard deviations from 20-period moving average',
      'Order Book Imbalance (OBI) shows exhaustion on the dominant side',
      'Council AI agents (IUSTITIA, REGENT, VIGIL) reach >85% unanimous consensus',
    ],
    exitProtocol: 'Scale out 50% at mean reversion target; trail remaining 50% with parabolic SAR stop.',
    capitalAllocatedUsd: 175000,
    currentPnl24hUsd: 3820.6,
  },
];

export const INSTITUTIONAL_RUNBOOK: RunbookSopStep[] = [
  {
    id: 'SOP-01',
    code: 'RUN-01-PRE',
    phase: 'PRE_MARKET',
    title: 'Pre-Market Liquidity Sweep & Order Book Depth Audit',
    mandatoryAction: 'Audit top 5 bid/ask depth across Binance US, Finance US, and XRPL AMM. Verify minimum $100k depth within 10 bps.',
    automatedCheckCommand: 'omnicyberdex --audit-depth --min-depth 100000 --max-slippage 0.0010',
    failCondition: 'Book depth <$50k or bid-ask spread >15 bps.',
    recoveryAction: 'Engage liquidity harvest mode; switch execution engines to passive icebergs only.',
    status: 'VERIFIED',
    lastVerifiedAt: '03:00 UTC',
  },
  {
    id: 'SOP-02',
    code: 'RUN-02-CEX',
    phase: 'PRE_MARKET',
    title: 'Dual-Engine WebSocket & API Latency Certification',
    mandatoryAction: 'Ping CEX REST and WebSocket feeds. Confirm round-trip latency <25ms on Binance US and <30ms on Finance US.',
    automatedCheckCommand: 'ping-mesh --target binance_us,finance_us --max-latency 25',
    failCondition: 'WebSocket heartbeat timeout >500ms or 3 consecutive dropped frames.',
    recoveryAction: 'Relaunch Python subprocess engines via supervisor console; fallback to secondary AWS Direct Connect gateway.',
    status: 'VERIFIED',
    lastVerifiedAt: '03:02 UTC',
  },
  {
    id: 'SOP-03',
    code: 'RUN-03-EXEC',
    phase: 'EXECUTION_LOOP',
    title: 'Live Arbitrage Spread Detection & Atomic Execution',
    mandatoryAction: 'Continuously compute synthetic cross-venue spread matrix. Fire atomic dual-leg orders when spread >18 bps.',
    automatedCheckCommand: 'exec-arb --threshold-bps 18 --atomic-commit true',
    failCondition: 'One leg fills, counterparty leg fails or rejects (execution desync).',
    recoveryAction: 'Execute emergency hedge protocol via market taker within 150ms to eliminate unhedged inventory.',
    status: 'RUNNING',
    lastVerifiedAt: '03:05 UTC (Continuous)',
  },
  {
    id: 'SOP-04',
    code: 'RUN-04-CIRCUIT',
    phase: 'CIRCUIT_BREAKER',
    title: 'Automated Flash-Crash Drawdown Quarantine',
    mandatoryAction: 'Monitor rolling 1-hour PnL. If drawdown touches 2.5%, immediately quarantine desk and cancel all resting limit orders.',
    automatedCheckCommand: 'circuit-breaker --max-drawdown 0.025 --action QUARANTINE',
    failCondition: 'Unrealized portfolio loss exceeds $3,500 within rolling 60 minutes.',
    recoveryAction: 'Halt all algorithmic execution; shift all capital into BUIDL Treasury & RLUSD escrow; alert Chief Risk Officer.',
    status: 'VERIFIED',
    lastVerifiedAt: '03:04 UTC',
  },
  {
    id: 'SOP-05',
    code: 'RUN-05-SETTLE',
    phase: 'SETTLEMENT_RECON',
    title: 'EOD Federal Settlement & Vault of Trust Reconciliation',
    mandatoryAction: 'Reconcile on-chain balances across Federal DAG nodes, NYDFS RLUSD reserve escrow, and XRPL Vault of Trust.',
    automatedCheckCommand: 'reconcile-treasury --vault rB2fKokBsnHCoFWLqZ89dqp2VCbVkKoY2k --audit-seal true',
    failCondition: 'Discrepancy >0.0001 ESC or unconfirmed FedNow bridge transfers >10 minutes.',
    recoveryAction: 'Initiate manual cryptographic ledger audit; re-verify state channel snapshot signatures.',
    status: 'PENDING',
    lastVerifiedAt: 'Scheduled at 00:00 UTC',
  },
  {
    id: 'SOP-06',
    code: 'RUN-06-OVERNIGHT',
    phase: 'OVERNIGHT_POSTURE',
    title: 'Overnight Delta-Neutral Positioning & TWAP Scheduler',
    mandatoryAction: 'Hedge overnight inventory to absolute zero delta. Stash 60% of idle stablecoin reserves into BUIDL 4.9% yield vault.',
    automatedCheckCommand: 'overnight-posture --delta-target 0.000 --yield-alloc 0.60',
    failCondition: 'Net delta exposure >$5,000 or un-staked idle cash >$50,000.',
    recoveryAction: 'Trigger automated spot-perp basis hedge and sweep excess USDC/RLUSD into yield escrow.',
    status: 'PENDING',
    lastVerifiedAt: 'Scheduled at 22:00 UTC',
  },
];

export const QUANTITATIVE_METHODOLOGIES: QuantitativeMethodology[] = [
  {
    id: 'QM-01',
    name: 'Order Flow Toxicity (VPIN - Volume-Synchronized Probability of Toxicity)',
    mathematicalModel: 'Easley, López de Prado, O’Hara Microstructure Toxicity Model',
    formula: 'VPIN = Σ |V_t^B - V_t^S| / (N × V)',
    institutionalApplication: 'Detects stealth informed institutional accumulation or dumps before price breaks out. Values >0.70 indicate toxic flow.',
    currentReading: '0.34 (Normal Market Microstructure)',
    regimeState: 'LOW_TOXICITY_LIQUIDITY',
    recommendedAction: 'Safe to maintain tight resting limit bids and aggressive market-making spreads.',
  },
  {
    id: 'QM-02',
    name: 'Order Book Imbalance (OBI - Top 5 Tiers Weighted)',
    mathematicalModel: 'Cont, Kukanov & Stoikov Price Dynamics Imbalance Metric',
    formula: 'OBI = (Σ Bid_qty × w_i - Σ Ask_qty × w_i) / (Σ Bid_qty × w_i + Σ Ask_qty × w_i)',
    institutionalApplication: 'Predicts immediate next-tick price direction with 78% accuracy by measuring supply/demand pressure across the top 5 levels.',
    currentReading: '+0.42 (Strong Buying Pressure)',
    regimeState: 'BULLISH_ORDER_FLOW_PRESSURE',
    recommendedAction: 'Position aggressive bids on bid step 1; front-run anticipated ask-side liquidity vacuum.',
  },
  {
    id: 'QM-03',
    name: 'Kelly Criterion Fractional Sizing (Half-Kelly Optimization)',
    mathematicalModel: 'J.L. Kelly Optimal Growth Asset Allocation',
    formula: 'f* = 0.5 × [ (p × (b + 1) - 1) / b ]',
    institutionalApplication: 'Maximizes geometric portfolio growth rate while mathematically safeguarding against risk-of-ruin drawdowns.',
    currentReading: '3.8% Optimal Position Sizing',
    regimeState: 'BALANCED_AGGRESSION',
    recommendedAction: 'Cap maximum trade size at $15,000 USD per signal execution.',
  },
  {
    id: 'QM-04',
    name: 'Value at Risk (VaR 99% Historical & Monte Carlo 10,000 Paths)',
    mathematicalModel: 'Parametric Cornish-Fisher Expansion & Historical Simulation',
    formula: 'VaR_α = - [ μ + z_α × σ + (z_α^2 - 1)/6 × S + (z_α^3 - 3z_α)/24 × K ]',
    institutionalApplication: 'Computes maximum expected portfolio loss over a 24-hour horizon at 99% confidence level under extreme fat-tail kurtosis.',
    currentReading: '$1,240 USD (1.58% Portfolio Equity)',
    regimeState: 'WITHIN_RISK_MANDATE',
    recommendedAction: 'Desk authorized to run full playbook capacity across all 5 strategies.',
  },
];

export const INITIAL_INSTITUTIONAL_SIGNALS: InstitutionalSignal[] = [
  {
    id: 'SIG-98401',
    pair: 'XRP/USD',
    direction: 'STRONG_BUY',
    confidencePct: 94.6,
    expectedAlphaBps: 42.0,
    signalSources: ['Binance US / Finance US Spread (24 bps)', 'XRPL Vault Escrow Seal', 'OBI +0.48'],
    cexPrice: 2.6840,
    dexPrice: 2.6780,
    spreadBps: 22.4,
    vpinToxicityScore: 0.28,
    orderBookImbalanceRatio: 0.48,
    suggestedSizeUsd: 12500,
    stopLossUsd: 2.6450,
    targetPriceUsd: 2.7450,
    timeHorizon: '15 - 45 min',
    status: 'VALIDATED',
    timestamp: '2026-10-01T23:58:12Z',
  },
  {
    id: 'SIG-98402',
    pair: 'RLUSD/USD',
    direction: 'LIQUIDITY_HARVEST',
    confidencePct: 98.2,
    expectedAlphaBps: 18.5,
    signalSources: ['NYDFS Peg Drift ($0.9984)', 'FedNow Settlement Corridor', 'Circle CCTP Parity'],
    cexPrice: 0.9985,
    dexPrice: 1.0000,
    spreadBps: 15.0,
    vpinToxicityScore: 0.12,
    orderBookImbalanceRatio: 0.65,
    suggestedSizeUsd: 50000,
    stopLossUsd: 0.9960,
    targetPriceUsd: 1.0000,
    timeHorizon: 'T+0 Intraday',
    status: 'VALIDATED',
    timestamp: '2026-10-01T23:59:04Z',
  },
  {
    id: 'SIG-98403',
    pair: 'DAG/USD',
    direction: 'STRONG_BUY',
    confidencePct: 91.8,
    expectedAlphaBps: 65.0,
    signalSources: ['DoD Space Systems State Channel Sync', 'Zero-Gas Hypergraph Snapshot', 'VPIN 0.22'],
    cexPrice: 0.0842,
    dexPrice: 0.0838,
    spreadBps: 47.6,
    vpinToxicityScore: 0.22,
    orderBookImbalanceRatio: 0.52,
    suggestedSizeUsd: 10000,
    stopLossUsd: 0.0815,
    targetPriceUsd: 0.0910,
    timeHorizon: '2 - 6 hours',
    status: 'VALIDATED',
    timestamp: '2026-10-02T00:01:20Z',
  },
  {
    id: 'SIG-98404',
    pair: 'SOL/USD',
    direction: 'DELTA_NEUTRAL_HEDGE',
    confidencePct: 89.4,
    expectedAlphaBps: 28.0,
    signalSources: ['Perp Funding Spike (32% APR)', 'Raydium Liquidity Imbalance', 'OODA Regime Neutral'],
    cexPrice: 218.40,
    dexPrice: 218.85,
    spreadBps: 20.6,
    vpinToxicityScore: 0.44,
    orderBookImbalanceRatio: 0.15,
    suggestedSizeUsd: 15000,
    stopLossUsd: 212.00,
    targetPriceUsd: 226.00,
    timeHorizon: '4 - 12 hours',
    status: 'GENERATED',
    timestamp: '2026-10-02T00:03:15Z',
  },
  {
    id: 'SIG-98405',
    pair: 'ETH/USD',
    direction: 'BUY',
    confidencePct: 88.5,
    expectedAlphaBps: 34.0,
    signalSources: ['Uniswap v3 Concentrated Depth Skew', 'BUIDL Yield Collateral Flow'],
    cexPrice: 3840.50,
    dexPrice: 3832.20,
    spreadBps: 21.6,
    vpinToxicityScore: 0.36,
    orderBookImbalanceRatio: 0.38,
    suggestedSizeUsd: 20000,
    stopLossUsd: 3780.00,
    targetPriceUsd: 3950.00,
    timeHorizon: '1 - 3 hours',
    status: 'GENERATED',
    timestamp: '2026-10-02T00:04:45Z',
  },
];
