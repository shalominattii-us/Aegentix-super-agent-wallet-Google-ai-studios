/**
 * RIPPLE TREASURY MANAGEMENT SYSTEM (TMS) SPECIFICATION
 * Powered by GTreasury & Ripple Enterprise Settlement Infrastructure
 * Architecture: ERP Connectors (SAP/Oracle) -> GTreasury Core -> Ripple ODL / RLUSD -> Multi-Bank Rails
 */

export interface TreasuryAccount {
  id: string;
  bankName: string;
  accountType: 'OPERATING' | 'CONCENTRATION' | 'ODL_ESCROW' | 'STABLECOIN_RESERVE';
  currency: string;
  balance: number;
  balanceUsd: number;
  jurisdiction: string;
  lastReconciled: string;
  autoSweepEnabled: boolean;
  targetBalanceUsd: number;
}

export interface LiquidityCorridor {
  id: string;
  sourceCurrency: string;
  targetCurrency: string;
  route: string;
  settlementRail: 'RIPPLE_ODL' | 'SWIFT_GPI' | 'FEDNOW_INSTANT' | 'SEPA_INSTANT';
  averageLatency: string;
  traditionalCostUsd: number;
  rippleCostUsd: number;
  costSavingsPct: number;
  fxSpreadBps: number;
  status: 'OPTIMAL' | 'CONGESTED' | 'MAINTENANCE';
  volume24hUsd: number;
}

export interface ArchitectureLayer {
  id: string;
  layerNumber: number;
  name: string;
  tagline: string;
  technologies: string[];
  responsibilities: string[];
  protocols: string[];
  slaMetrics: string;
}

export interface TreasurySimulationResult {
  simulationId: string;
  name: string;
  type: 'LIQUIDITY_SWEEP' | 'ODL_PAYMENT' | 'FX_AUTO_HEDGE' | 'BANK_RECONCILIATION';
  timestamp: string;
  status: 'COMPLETED' | 'IN_PROGRESS';
  executionTimeMs: number;
  details: Record<string, any>;
  costSavingsUsd?: number;
  auditHash: string;
}

export const INITIAL_TREASURY_ACCOUNTS: TreasuryAccount[] = [
  {
    id: 'ACC-JPM-01',
    bankName: 'JPMorgan Chase (US Hub)',
    accountType: 'CONCENTRATION',
    currency: 'USD',
    balance: 62450000,
    balanceUsd: 62450000,
    jurisdiction: 'United States (Fedwire/ACH)',
    lastReconciled: '2026-10-27 15:40 UTC',
    autoSweepEnabled: true,
    targetBalanceUsd: 50000000,
  },
  {
    id: 'ACC-BNP-02',
    bankName: 'BNP Paribas (EU Treasury)',
    accountType: 'OPERATING',
    currency: 'EUR',
    balance: 28300000,
    balanceUsd: 30847000,
    jurisdiction: 'Eurozone (TARGET2 / SEPA)',
    lastReconciled: '2026-10-27 15:35 UTC',
    autoSweepEnabled: true,
    targetBalanceUsd: 25000000,
  },
  {
    id: 'ACC-DBS-03',
    bankName: 'DBS Bank (APAC Regional)',
    accountType: 'OPERATING',
    currency: 'SGD',
    balance: 41200000,
    balanceUsd: 31212000,
    jurisdiction: 'Singapore (FAST / MEPS+)',
    lastReconciled: '2026-10-27 15:30 UTC',
    autoSweepEnabled: true,
    targetBalanceUsd: 25000000,
  },
  {
    id: 'ACC-ODL-04',
    bankName: 'Ripple ODL Liquidity Vault',
    accountType: 'ODL_ESCROW',
    currency: 'XRP / RLUSD',
    balance: 38500000,
    balanceUsd: 38500000,
    jurisdiction: 'Global XRPL Cryptographic Escrow',
    lastReconciled: '2026-10-27 15:45 UTC',
    autoSweepEnabled: false,
    targetBalanceUsd: 40000000,
  },
  {
    id: 'ACC-HSBC-05',
    bankName: 'HSBC Holdings (UK Pool)',
    accountType: 'OPERATING',
    currency: 'GBP',
    balance: 16400000,
    balanceUsd: 21241000,
    jurisdiction: 'United Kingdom (CHAPS / Faster Payments)',
    lastReconciled: '2026-10-27 15:20 UTC',
    autoSweepEnabled: true,
    targetBalanceUsd: 18000000,
  },
];

export const INITIAL_LIQUIDITY_CORRIDORS: LiquidityCorridor[] = [
  {
    id: 'COR-USD-EUR',
    sourceCurrency: 'USD',
    targetCurrency: 'EUR',
    route: 'US Clearing -> Ripple ODL -> SEPA Instant',
    settlementRail: 'RIPPLE_ODL',
    averageLatency: '3.2 seconds',
    traditionalCostUsd: 45.0,
    rippleCostUsd: 4.8,
    costSavingsPct: 89.3,
    fxSpreadBps: 1.4,
    status: 'OPTIMAL',
    volume24hUsd: 18450000,
  },
  {
    id: 'COR-USD-SGD',
    sourceCurrency: 'USD',
    targetCurrency: 'SGD',
    route: 'US Clearing -> RLUSD Stablecoin -> FAST Hub',
    settlementRail: 'RIPPLE_ODL',
    averageLatency: '2.8 seconds',
    traditionalCostUsd: 52.0,
    rippleCostUsd: 5.2,
    costSavingsPct: 90.0,
    fxSpreadBps: 1.8,
    status: 'OPTIMAL',
    volume24hUsd: 14200000,
  },
  {
    id: 'COR-USD-MXN',
    sourceCurrency: 'USD',
    targetCurrency: 'MXN',
    route: 'US Anchor -> Ripple ODL (Bitso) -> SPEI',
    settlementRail: 'RIPPLE_ODL',
    averageLatency: '4.1 seconds',
    traditionalCostUsd: 65.0,
    rippleCostUsd: 6.5,
    costSavingsPct: 90.0,
    fxSpreadBps: 2.2,
    status: 'OPTIMAL',
    volume24hUsd: 8750000,
  },
  {
    id: 'COR-EUR-GBP',
    sourceCurrency: 'EUR',
    targetCurrency: 'GBP',
    route: 'TARGET2 -> Bank Direct Gateway -> Faster Payments',
    settlementRail: 'SEPA_INSTANT',
    averageLatency: '15.0 seconds',
    traditionalCostUsd: 28.0,
    rippleCostUsd: 6.2,
    costSavingsPct: 77.8,
    fxSpreadBps: 3.1,
    status: 'OPTIMAL',
    volume24hUsd: 6400000,
  },
];

export const TMS_ARCHITECTURE_LAYERS: ArchitectureLayer[] = [
  {
    id: 'LAYER-1-ERP',
    layerNumber: 1,
    name: 'Enterprise ERP & Multi-Bank Ingestion Layer',
    tagline: 'Standard host-to-host connectivity bridging enterprise financial ledgers to treasury',
    technologies: ['SAP S/4HANA Finance API', 'Oracle Financials Cloud', 'NetSuite SuiteTalk', 'SWIFT Alliance Lite2', 'Host-to-Host SFTP'],
    responsibilities: [
      'Ingests real-time intraday bank account statements (ISO 20022 camt.052/camt.053)',
      'Receives outgoing accounts payable / vendor invoices from corporate ERPs',
      'Normalizes disparate payment instructions into standard pacs.008 credit transfer format',
    ],
    protocols: ['ISO 20022 XML (camt, pacs, pain)', 'REST / mTLS v1.3', 'SWIFT MT940 / MT101'],
    slaMetrics: 'Sub-second invoice ingestion; 99.999% data pipeline availability',
  },
  {
    id: 'LAYER-2-GTREASURY',
    layerNumber: 2,
    name: 'GTreasury Core Cash & Risk Engine',
    tagline: 'Institutional cash positioning, predictive liquidity forecasting, and debt/investment management',
    technologies: ['GTreasury Global Cash Hub', 'AI Liquidity Forecasting Model', 'Multilateral Netting Engine', 'FX Exposure Hedging Module'],
    responsibilities: [
      'Calculates global multi-currency net cash position across 40+ corporate legal entities',
      'Executes rule-based automated cash sweeping and zero-balance account (ZBA) pooling',
      'Forecasts 30/60/90-day cash requirements using historical seasonality & receivables',
      'Identifies unhedged currency variance and suggests automated micro-hedges',
    ],
    protocols: ['Open Banking APIs', 'GTreasury Enterprise REST SDK', 'FpML (Financial products Markup Language)'],
    slaMetrics: 'Real-time multi-entity cash visibility; sub-100ms position re-evaluations',
  },
  {
    id: 'LAYER-3-RIPPLE',
    layerNumber: 3,
    name: 'Ripple Payments & On-Demand Liquidity (ODL) Engine',
    tagline: 'Instant cross-border settlement using XRPL cryptographic liquidity and RLUSD fiat-backed reserves',
    technologies: ['Ripple Payments Core API', 'XRPL On-Demand Liquidity Bridge', 'Ripple USD (RLUSD) NYDFS Regulated Reserves', 'FedNow Service Adapter'],
    responsibilities: [
      'Eliminates pre-funding in foreign destination bank accounts via on-demand programmatic liquidity',
      'Executes atomic 3-to-5 second cross-border settlement directly into recipient local domestic clearing rails',
      'Maps ISO 20022 messages natively to XRPL payment primitives with deterministic proof of finality',
      'Guarantees end-to-end payment delivery with automated rollback upon settlement exception',
    ],
    protocols: ['XRPL Consensus Protocol', 'ISO 20022 pacs.008.001.08', 'FedNow Real-Time Clearing'],
    slaMetrics: '3.2s median settlement finality; 99.85% first-attempt success rate',
  },
  {
    id: 'LAYER-4-GOVERNANCE',
    layerNumber: 4,
    name: 'Zero-Trust Enclave & Governance Framework',
    tagline: 'Multi-party cryptographic authorization, dual-approval workflows, and immutable regulatory audit trails',
    technologies: ['Hardware Security Modules (HSM FIPS 140-3)', 'Multi-Party Computation (MPC)', 'SOC 1 Type II & SOC 2 Type II Enclaves', 'Real-Time Sanction Screening (OFAC / EU / UN)'],
    responsibilities: [
      'Enforces dual-custody authorization matrices for treasury transfers exceeding defined thresholds',
      'Screens all incoming and outgoing counterparties against global PEP and sanctions watchlists in sub-50ms',
      'Maintains an immutable cryptographic audit ledger recording every transaction signature and approval event',
    ],
    protocols: ['FIPS 140-3 Level 4', 'PKCS#11', 'OpenID Connect / SAML 2.0 with Hardware FIDO2'],
    slaMetrics: 'Zero unauthorized payouts; 100% auditable regulatory compliance',
  },
];

export const INITIAL_SIMULATION_HISTORY: TreasurySimulationResult[] = [
  {
    simulationId: 'SIM-SWEEP-8821',
    name: 'Automated Zero-Balance Liquidity Sweep',
    type: 'LIQUIDITY_SWEEP',
    timestamp: '2026-10-27 15:42:10 UTC',
    status: 'COMPLETED',
    executionTimeMs: 142,
    details: {
      sourceEntity: 'Aegentix Europe B.V. (EUR)',
      targetPool: 'Global Treasury Concentration (JPMorgan USD)',
      sweptAmountEur: 3300000,
      convertedAmountUsd: 3597000,
      fxRateApplied: 1.0900,
      ruleApplied: 'ZBA_EXCESS_SWEEP_THRESHOLD_25M',
    },
    costSavingsUsd: 3820,
    auditHash: '0x9f4a12c8b74e6d2105a398bb1e24c567890aef12',
  },
  {
    simulationId: 'SIM-ODL-8822',
    name: 'Instant Cross-Border Supplier Payout (ODL)',
    type: 'ODL_PAYMENT',
    timestamp: '2026-10-27 15:44:05 UTC',
    status: 'COMPLETED',
    executionTimeMs: 3120,
    details: {
      beneficiary: 'Tokyo Precision Micro-Sensors KK',
      sourceAmountUsd: 750000,
      targetAmountJpy: 114750000,
      effectiveRate: 153.00,
      settlementRail: 'Ripple ODL -> Zengin Instant Rail',
      swiftComparisonTime: '48 hours -> 3.12 seconds',
    },
    costSavingsUsd: 14850,
    auditHash: '0x2e817a0b5c9284fd67e3a10988ccbb9045ef8812',
  },
];
