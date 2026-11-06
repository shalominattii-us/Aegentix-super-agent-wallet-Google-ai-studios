/**
 * Research/simulation contract for the Xaman entry and OmniCyberDex routes.
 * Live execution stays off. Credential values are never returned.
 */

export const RESEARCH_MODE = 'RESEARCH_SIMULATION' as const;

export const COINBASE_ADVANCED_SPOT_PRODUCTS = ['BTC-USD', 'XRP-USD'] as const;

export const MISSING_WINDOWS_SCRIPTS = [
  'omni_cyberdex_harness.py',
  'sovereign_aether_harness.py',
  'stratus_harness.py',
  'aether_stratus.py',
  'omnicyberdex_master_orchestrator.py',
  'test_aether_harness_end_to_end.py',
] as const;

export interface EnvSource {
  XAMAN_API_KEY?: string;
  XAMAN_API_SECRET?: string;
  XUMM_API_KEY?: string;
  XUMM_API_SECRET?: string;
}

export interface PublicLedgerRead {
  nativeXrpBalance: number;
  ownerCount: number | null;
  sequence: number | null;
  previousTxnLgrSeq: number | null;
  trustlineCount: number | null;
  readAt: string;
}

const SETUP_DESTINATION = {
  kind: 'server_env_file',
  app: 'OmniCyberDex XRPL (Xaman)',
  fileName: '.env',
  pathRelativeToRepoRoot: '.env',
  exampleFile: '.env.example',
  directory: 'Repository root, the same folder as server.ts and package.json',
  loader: 'dotenv.config() with no path argument, called in server.ts before routes are registered',
  variable: 'XAMAN_API_KEY',
  secretVariable: 'XAMAN_API_SECRET',
  consumer: 'src/integrations/xrplDevSuite.ts reads process.env.XAMAN_API_KEY for the OmniCyberDex XRPL app',
  presenceEndpoint: 'GET /api/xaman/readiness',
  reload: 'Restart the Node process after editing .env. dotenv reads the file once at startup.',
  notCollectedIn: [
    'Browser inputs',
    'localStorage or sessionStorage',
    'POST /api/xaman/save-credentials',
  ],
} as const;

function configured(value: string | undefined): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}

/** A reported profit stays numeric, including zero. Missing or non-numeric stays unknown. */
export function reportedProfit(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '' || trimmed.toLowerCase() === 'unknown') return null;
    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : null;
  }
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  return null;
}

export function inspectXamanServerConfig(env: EnvSource = process.env) {
  const apiKeyConfigured = configured(env.XAMAN_API_KEY);
  const apiSecretConfigured = configured(env.XAMAN_API_SECRET);
  const legacyXummApiKeyConfigured = configured(env.XUMM_API_KEY);
  const legacyXummApiSecretConfigured = configured(env.XUMM_API_SECRET);

  const unconfigured: string[] = [];
  if (!apiKeyConfigured) {
    unconfigured.push('XAMAN_API_KEY is empty in the repository root .env.');
  }
  if (!apiSecretConfigured) {
    unconfigured.push('XAMAN_API_SECRET is empty. Simulation features do not need it.');
  }
  if (!apiKeyConfigured && legacyXummApiKeyConfigured) {
    unconfigured.push('XUMM_API_KEY is set, and that name is not the OmniCyberDex XRPL app variable. Set XAMAN_API_KEY.');
  }
  unconfigured.push(...MISSING_WINDOWS_SCRIPTS.map((file) => `${file} is not part of this repo.`));

  return {
    mode: RESEARCH_MODE,
    liveExecutionEnabled: false,
    signingEnabled: false,
    payloadSubmissionEnabled: false,
    destination: SETUP_DESTINATION,
    xamanApiKeyConfigured: apiKeyConfigured,
    xamanApiSecretConfigured: apiSecretConfigured,
    legacyXummApiKeyConfigured,
    legacyXummApiSecretConfigured,
    keyValueIncluded: false,
    secretValueIncluded: false,
    unconfigured,
    worksWithoutApiSecret: [
      {
        id: 'readiness',
        method: 'GET',
        path: '/api/xaman/readiness',
        detail: 'Reports whether XAMAN_API_KEY and XAMAN_API_SECRET are present. Values are not included.',
      },
      {
        id: 'omni_status',
        method: 'GET',
        path: '/api/omnicyberdex/status',
        detail: 'Research status. No exchange scan and no orders.',
      },
      {
        id: 'engines',
        method: 'GET',
        path: '/api/omnicyberdex/engines',
        detail: 'Engine catalog with unknown volume and PnL.',
      },
      {
        id: 'orchestrator',
        method: 'GET',
        path: '/api/orchestrator/status',
        detail: 'Local research status. Reachability is not probed.',
      },
      {
        id: 'spot_research',
        method: 'POST',
        path: '/api/omnicyberdex/research/spot',
        detail: 'Coinbase Advanced spot research for BTC-USD and XRP-USD. No order is sent.',
        products: COINBASE_ADVANCED_SPOT_PRODUCTS,
      },
      {
        id: 'xaman_entry',
        method: 'UI',
        path: '/xaman-hub.html',
        detail: 'Xaman research entry and this setup guide.',
      },
    ],
    disabledThisMilestone: [
      'Xaman payload create, sign, and submit',
      'POST /api/omnicyberdex/execute',
      'Credential collection in the browser',
    ],
  };
}

export function assessScriptBlockers(exists: (relativeOrAbsolute: string) => boolean) {
  return MISSING_WINDOWS_SCRIPTS.map((file) => ({
    file,
    presentInRepo: exists(file),
    blocker: exists(file)
      ? null
      : 'Named in the external Windows checkout and absent from this repo. No replacement was added.',
  }));
}

const ENGINE_CATALOG = [
  {
    id: 'binance_us',
    name: 'Binance US Engine',
    scriptPath: 'C:\\AEGENTIX-WORKSPACE\\omnicyberdex\\engines\\binance_us_engine.py',
    exchange: 'Binance US',
  },
  {
    id: 'finance_us',
    name: 'Finance US CEX/DEX Engine',
    scriptPath: 'C:\\AEGENTIX-WORKSPACE\\src\\python\\finance_us_engine.py',
    exchange: 'Finance US CEX/DEX',
  },
] as const;

export function buildEngineReport(exists: (path: string) => boolean) {
  return ENGINE_CATALOG.map((engine) => ({
    ...engine,
    scriptPresent: exists(engine.scriptPath),
    status: 'NOT_OPERATIONAL',
    execution: 'DISABLED',
    latencyMs: null,
    totalVolume24hUsd: null,
    ordersExecuted24h: null,
    pnl24hUsd: null,
    pnl24hPct: null,
    label: 'No measurement. Unknown volume and PnL are not zero.',
  }));
}

export function buildOmniCyberDexStatus(env: EnvSource, exists: (path: string) => boolean) {
  return {
    mode: RESEARCH_MODE,
    liveExecutionEnabled: false,
    execution: 'DISABLED',
    probed: false,
    reachability: 'NOT_PROBED',
    scanIsExecution: false,
    enginesLaunched: null,
    engines: buildEngineReport(exists),
    scriptBlockers: assessScriptBlockers(exists),
    xaman: inspectXamanServerConfig(env),
    spotResearch: {
      venue: 'COINBASE_ADVANCED',
      market: 'SPOT',
      products: COINBASE_ADVANCED_SPOT_PRODUCTS,
      profitableStrategyValidated: false,
      zeroLossGuarantee: false,
    },
  };
}

export function buildOrchestratorStatus(env: EnvSource, exists: (path: string) => boolean) {
  const xaman = inspectXamanServerConfig(env);
  return {
    mode: RESEARCH_MODE,
    liveExecutionEnabled: false,
    timestamp: new Date().toISOString(),
    probed: false,
    reachability: 'NOT_PROBED',
    scanIsExecution: false,
    enginesLaunched: null,
    xamanSetup: xaman,
    activePipelines: {
      xaman_omnicyberdex_xrpl: {
        status: 'RESEARCH_SIMULATION',
        execution: 'DISABLED',
        apiKeyConfigured: xaman.xamanApiKeyConfigured,
        apiSecretConfigured: xaman.xamanApiSecretConfigured,
      },
      coinbase_advanced_spot_research: {
        status: 'RESEARCH_SIMULATION',
        execution: 'DISABLED',
        products: COINBASE_ADVANCED_SPOT_PRODUCTS.join(','),
      },
    },
  };
}

export function handleOmniCyberDexExecute(body: Record<string, unknown> | null | undefined) {
  const requested = body ?? {};
  const profit = reportedProfit(requested.netProfitUsd !== undefined ? requested.netProfitUsd : requested.pnlUsd);
  return {
    httpStatus: 403,
    body: {
      success: false,
      executed: false,
      signed: false,
      submitted: false,
      mode: RESEARCH_MODE,
      requestedMode: typeof requested.mode === 'string' ? requested.mode : null,
      liveExecutionEnabled: false,
      status: 'NOT_EXECUTED',
      pair: requested.pair ?? null,
      route: requested.route ?? null,
      amountUsd: reportedProfit(requested.amountUsd),
      netProfitUsd: profit,
      pnlUsd: profit,
      txHash: null,
      txId: null,
      orderId: null,
      ledgerIndex: null,
      fillStatus: 'NO_FILL',
      scanIsExecution: false,
      profitableStrategyValidated: false,
      zeroLossGuarantee: false,
      atomicCrossVenueSettlement: false,
      message: 'Execution was not run. No order, signature, or settlement receipt was created.',
    },
  };
}

export function simulateCoinbaseSpot(body: Record<string, unknown> | null | undefined) {
  const requested = body ?? {};
  const productId = typeof requested.productId === 'string' ? requested.productId : null;
  const allowed = productId === 'BTC-USD' || productId === 'XRP-USD';
  const profit = allowed ? reportedProfit(requested.netProfitUsd) : null;
  return {
    executed: false,
    signed: false,
    submitted: false,
    mode: RESEARCH_MODE,
    venue: 'COINBASE_ADVANCED',
    market: 'SPOT',
    productId,
    status: allowed ? 'SIMULATED_NO_ORDER' : 'OUT_OF_SCOPE',
    referencePriceUsd: null,
    netProfitUsd: profit,
    txHash: null,
    orderId: null,
    ledgerIndex: null,
    profitableStrategyValidated: false,
    zeroLossGuarantee: false,
    atomicCrossVenueSettlement: false,
    label: allowed
      ? 'Simulation output for a Coinbase Advanced spot product. This is not a fill or a validated strategy.'
      : 'This milestone only simulates Coinbase Advanced spot BTC-USD and XRP-USD.',
  };
}

export function presentXamanWallet(
  read: PublicLedgerRead | null,
  options?: { queriedAccount?: string | null },
) {
  const queriedAccount = options?.queriedAccount ?? null;
  if (!read || !Number.isFinite(read.nativeXrpBalance)) {
    return {
      mode: RESEARCH_MODE,
      liveExecutionEnabled: false,
      status: 'UNKNOWN',
      balanceTrust: 'UNKNOWN',
      queriedAccount,
      queriedAccountTrust: queriedAccount ? 'CONFIGURED_QUERY_TARGET' : 'UNKNOWN',
      nativeXrpBalance: null,
      nativeXrpUsd: null,
      ownerCount: null,
      sequence: null,
      previousTxnLgrSeq: null,
      gasCapacityTransactions: null,
      totalTrustlines: null,
      nonZeroTrustlines: null,
      reclaimableReserveXrp: null,
      sovereignEocHolding: null,
      tokens: [],
      nfts: [],
      activeRevenueStrategies: [],
      lastSyncAt: null,
      label: 'No confirmed public ledger read. Stored seed figures are not balances.',
    };
  }
  return {
    mode: RESEARCH_MODE,
    liveExecutionEnabled: false,
    status: 'PUBLIC_LEDGER_READ',
    balanceTrust: 'PUBLIC_LEDGER_XRP_AMOUNT_ONLY',
    tradingSession: false,
    queriedAccount,
    queriedAccountTrust: 'CONFIGURED_QUERY_TARGET',
    nativeXrpBalance: read.nativeXrpBalance,
    nativeXrpUsd: null,
    ownerCount: read.ownerCount,
    sequence: read.sequence,
    previousTxnLgrSeq: read.previousTxnLgrSeq,
    gasCapacityTransactions: null,
    totalTrustlines: read.trustlineCount,
    nonZeroTrustlines: null,
    reclaimableReserveXrp: null,
    sovereignEocHolding: null,
    tokens: [],
    nfts: [],
    activeRevenueStrategies: [],
    lastSyncAt: read.readAt,
    label: 'Public XRP amount only. The USD price is unknown. This is not a trading session.',
  };
}

export function handleXamanCreatePayload() {
  return {
    httpStatus: 403,
    body: {
      success: false,
      executed: false,
      signed: false,
      submitted: false,
      payload: null,
      txHash: null,
      qrDataUrl: null,
      mode: RESEARCH_MODE,
      readiness: 'GET /api/xaman/readiness',
      message: 'Payload creation is off. Put XAMAN_API_KEY in the repository root .env. This route does not accept or store the key.',
    },
  };
}

export function handleXamanSaveCredentials() {
  return {
    httpStatus: 403,
    body: {
      success: false,
      stored: false,
      mode: RESEARCH_MODE,
      destination: SETUP_DESTINATION,
      message: 'The server did not read or store a key from this request. Set XAMAN_API_KEY in the repository root .env and restart the process.',
    },
  };
}

export function deriveHud(
  status: {
    timestamp?: string;
    mode?: string;
    liveExecutionEnabled?: boolean;
    xamanSetup?: { xamanApiKeyConfigured?: boolean; xamanApiSecretConfigured?: boolean };
    activePipelines?: Record<string, { status?: string }>;
  } | null,
  health: { status?: string; uptime?: number } | null,
) {
  const pipelines = status?.activePipelines ?? {};
  const names = Object.keys(pipelines);
  const online = names.filter((name) => String(pipelines[name]?.status).toUpperCase() === 'ONLINE');
  const researchMode = status?.mode === 'RESEARCH_SIMULATION' || status?.liveExecutionEnabled === false;
  return {
    pipelineCount: names.length,
    pipelinesOnline: online.length,
    pipelinesOnlineNames: online,
    backendStatus: health?.status ?? null,
    backendUptimeSeconds: typeof health?.uptime === 'number' ? health.uptime : null,
    orchestratorTimestamp: status?.timestamp ?? null,
    mode: status?.mode ?? null,
    executionEnabled: researchMode ? false : null,
    xamanApiKeyConfigured: status?.xamanSetup?.xamanApiKeyConfigured ?? null,
    xamanApiSecretConfigured: status?.xamanSetup?.xamanApiSecretConfigured ?? null,
    isLive: researchMode ? false : names.length > 0 && online.length === names.length,
  };
}

export function xamanResearchEntryModel() {
  return {
    title: 'OmniCyberDex for Xaman',
    proposedAcademyName: 'AEGENTIX Academy',
    proposedNameOnly: true,
    mode: RESEARCH_MODE,
    setup: SETUP_DESTINATION,
    simulationProducts: COINBASE_ADVANCED_SPOT_PRODUCTS,
  };
}
