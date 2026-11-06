/**
 * Research / simulation milestone for the Xaman entry and OmniCyberDex.
 *
 * Live execution stays off. This module does not sign, submit, preview orders,
 * move funds, or read credential values. Callers pass only booleans for whether
 * a credential is configured.
 */

export const RESEARCH_MODE = 'RESEARCH_SIMULATION' as const;
export const LIVE_EXECUTION_ENABLED = false as const;

export type EvidenceClass =
  | 'REAL_OBSERVATION'
  | 'SAMPLE_FIXTURE'
  | 'PROJECTED_ESTIMATE'
  | 'SYNTHETIC_FILL'
  | 'SEEDED_CLAIM';

export type ConsequentialAction =
  | 'SIGN_TRANSACTION'
  | 'SIGN_MESSAGE'
  | 'SUBMIT_PAYLOAD'
  | 'CREATE_ORDER'
  | 'ORDER_PREVIEW'
  | 'EXECUTE_FILL'
  | 'TRANSFER'
  | 'BORROW'
  | 'LEVERAGE'
  | 'SAVE_CREDENTIALS'
  | 'START_DAEMON'
  | 'XRPL_SUBMIT'
  | 'XRPL_READ'
  | 'FUND_MOVEMENT';

export const CONSEQUENTIAL_ACTIONS: readonly ConsequentialAction[] = [
  'SIGN_TRANSACTION',
  'SIGN_MESSAGE',
  'SUBMIT_PAYLOAD',
  'CREATE_ORDER',
  'ORDER_PREVIEW',
  'EXECUTE_FILL',
  'TRANSFER',
  'BORROW',
  'LEVERAGE',
  'SAVE_CREDENTIALS',
  'START_DAEMON',
  'XRPL_SUBMIT',
  'XRPL_READ',
  'FUND_MOVEMENT',
];

export interface ActionRejection {
  success: false;
  rejected: true;
  mode: typeof RESEARCH_MODE;
  liveExecutionEnabled: false;
  action: ConsequentialAction;
  httpStatus: 403;
  reason: string;
  signingPermission: false;
  payloadCreated: false;
  orderCreated: false;
  fundsMoved: false;
  externalCertification: false;
  tradingAuthorization: false;
}

const REJECTION_REASONS: Record<ConsequentialAction, string> = {
  SIGN_TRANSACTION: 'Transaction signing is disabled in the research/simulation milestone.',
  SIGN_MESSAGE: 'Message signing is disabled in the research/simulation milestone.',
  SUBMIT_PAYLOAD: 'Transaction payload creation and submission are disabled. A Xaman API key is not signing permission.',
  CREATE_ORDER: 'Order creation is disabled. This milestone does not preview or place orders.',
  ORDER_PREVIEW: 'Order previews are disabled. Fixture worksheets are not orders.',
  EXECUTE_FILL: 'Fills are disabled. A previous stub that returned FILLED with a fixed profit figure was a synthetic fill, not an execution.',
  TRANSFER: 'Transfers are disabled.',
  BORROW: 'Borrowing is disabled.',
  LEVERAGE: 'Leverage is disabled. BTC and XRP work in this milestone is Coinbase Advanced spot simulation only.',
  SAVE_CREDENTIALS: 'Credential changes are disabled. Configured keys are not read or stored by this milestone.',
  START_DAEMON: 'Trading daemons and autonomous monitors are not started.',
  XRPL_SUBMIT: 'XRPL transaction submission is disabled. There is no XRPL execution path in this milestone.',
  XRPL_READ: 'XRPL network reads are disabled in this milestone. Static figures are fixtures, not ledger observations.',
  FUND_MOVEMENT: 'Fund movement is disabled.',
};

export function rejectConsequentialAction(action: ConsequentialAction): ActionRejection {
  return {
    success: false,
    rejected: true,
    mode: RESEARCH_MODE,
    liveExecutionEnabled: LIVE_EXECUTION_ENABLED,
    action,
    httpStatus: 403,
    reason: REJECTION_REASONS[action],
    signingPermission: false,
    payloadCreated: false,
    orderCreated: false,
    fundsMoved: false,
    externalCertification: false,
    tradingAuthorization: false,
  };
}

export function signingPermissionFromKeyPresence(_keyConfigured: boolean): false {
  return false;
}

export interface EvidenceRecord<T> {
  evidenceClass: EvidenceClass;
  countsAsMarketObservation: boolean;
  countsAsFill: boolean;
  countsAsBalance: boolean;
  establishesEdge: boolean;
  externalCertification: false;
  tradingAuthorization: false;
  label: string;
  value: T;
}

export const RETIRED_PORTAL_HEADLINE: EvidenceRecord<{ portfolioUsd: number; changePct24h: number }> = {
  evidenceClass: 'SAMPLE_FIXTURE',
  countsAsMarketObservation: false,
  countsAsFill: false,
  countsAsBalance: false,
  establishesEdge: false,
  externalCertification: false,
  tradingAuthorization: false,
  label: 'Retired XamanXApp headline. No observation supports this portfolio figure.',
  value: { portfolioUsd: 8942731.22, changePct24h: 2.73 },
};

export const EMBEDDED_XAMAN_STATIC_SNAPSHOT: EvidenceRecord<{
  address: string;
  nativeXrpBalance: number;
  nativeXrpUsd: number;
  sovereignEocHolding: number;
}> = {
  evidenceClass: 'SAMPLE_FIXTURE',
  countsAsMarketObservation: false,
  countsAsFill: false,
  countsAsBalance: false,
  establishesEdge: false,
  externalCertification: false,
  tradingAuthorization: false,
  label: 'Static numbers previously embedded in server source. Not a live XRPL account read.',
  value: {
    address: 'rwB7JKKc5gJ47pPnWCFvQuhVW85mejYF1M',
    nativeXrpBalance: 15.556835,
    nativeXrpUsd: 41.69,
    sovereignEocHolding: 43802031550.22612,
  },
};

export const SAMPLE_PROJECTED_YIELD: EvidenceRecord<{ label: string; aprLabel: string }> = {
  evidenceClass: 'PROJECTED_ESTIMATE',
  countsAsMarketObservation: false,
  countsAsFill: false,
  countsAsBalance: false,
  establishesEdge: false,
  externalCertification: false,
  tradingAuthorization: false,
  label: 'Projected yield copy from older strategy cards. An estimate is not a profitable edge.',
  value: { label: 'Historical EOC/XRP strategy note', aprLabel: '18.4% APR (projected estimate)' },
};

export function classifyOmniExecuteStub(): EvidenceRecord<{ status: string; pnlUsd: number }> {
  return {
    evidenceClass: 'SYNTHETIC_FILL',
    countsAsMarketObservation: false,
    countsAsFill: false,
    countsAsBalance: false,
    establishesEdge: false,
    externalCertification: false,
    tradingAuthorization: false,
    label: 'Historical /api/omnicyberdex/execute response. It reported FILLED and a fixed pnlUsd without an exchange acknowledgement.',
    value: { status: 'FILLED', pnlUsd: 184.2 },
  };
}

export function classifySeededClaim(input: { id: string; status: string }): {
  id: string;
  storedStatus: string;
  evidenceClass: 'SEEDED_CLAIM';
  externalCertification: false;
  tradingAuthorization: false;
  earnedByReproducibleTest: false;
  displayLabel: string;
} {
  return {
    id: input.id,
    storedStatus: input.status,
    evidenceClass: 'SEEDED_CLAIM',
    externalCertification: false,
    tradingAuthorization: false,
    earnedByReproducibleTest: false,
    displayLabel: input.status === 'VERIFIED'
      ? 'Seeded status VERIFIED — not external certification or trading authorization'
      : 'Seeded record — not external certification or trading authorization',
  };
}

export interface ResearchRole {
  id: 'READINESS_CARTOGRAPHER' | 'EVIDENCE_SCRIBE' | 'FIXTURE_SIMULATOR' | 'FAIL_CLOSED_AUDITOR';
  title: string;
  duty: string;
  authorizesTrading: false;
  authorizesSigning: false;
}

export const RESEARCH_SWARM_ROLES: readonly ResearchRole[] = [
  {
    id: 'READINESS_CARTOGRAPHER',
    title: 'Readiness cartographer',
    duty: 'Record which Xaman and OmniCyberDex pieces exist, and which permissions they do not grant.',
    authorizesTrading: false,
    authorizesSigning: false,
  },
  {
    id: 'EVIDENCE_SCRIBE',
    title: 'Evidence scribe',
    duty: 'Label each figure as a real observation, sample fixture, projected estimate, synthetic fill, or seeded claim.',
    authorizesTrading: false,
    authorizesSigning: false,
  },
  {
    id: 'FIXTURE_SIMULATOR',
    title: 'Fixture simulator',
    duty: 'Run Coinbase Advanced spot worksheets for BTC-USD and XRP-USD from local fixtures only.',
    authorizesTrading: false,
    authorizesSigning: false,
  },
  {
    id: 'FAIL_CLOSED_AUDITOR',
    title: 'Fail-closed auditor',
    duty: 'Confirm signing, payloads, orders, transfers, and fills are rejected before any of those objects exist.',
    authorizesTrading: false,
    authorizesSigning: false,
  },
];

export type ReadinessState = 'READY_FOR_RESEARCH' | 'NOT_PRESENT' | 'BLOCKED' | 'CONFIGURED_NOT_PERMISSION';

export interface ReadinessItem {
  id: string;
  label: string;
  state: ReadinessState;
  detail: string;
}

export interface CredentialPresence {
  xummKeyConfigured: boolean;
  xummSecretConfigured: boolean;
  coinbaseJwtConfigured: boolean;
}

export interface ResearchStatus {
  mode: typeof RESEARCH_MODE;
  liveExecutionEnabled: false;
  signingPermission: false;
  apiKeyIsSigningPermission: false;
  tradingAuthorization: false;
  externalCertification: false;
  credentialPresence: CredentialPresence;
  readiness: ReadinessItem[];
  roles: readonly ResearchRole[];
  blockers: string[];
}

export function buildIntegrationReadiness(presence: CredentialPresence): ResearchStatus {
  const keyConfigured = presence.xummKeyConfigured && presence.xummSecretConfigured;
  return {
    mode: RESEARCH_MODE,
    liveExecutionEnabled: false,
    signingPermission: signingPermissionFromKeyPresence(keyConfigured),
    apiKeyIsSigningPermission: false,
    tradingAuthorization: false,
    externalCertification: false,
    credentialPresence: {
      xummKeyConfigured: presence.xummKeyConfigured,
      xummSecretConfigured: presence.xummSecretConfigured,
      coinbaseJwtConfigured: presence.coinbaseJwtConfigured,
    },
    readiness: [
      {
        id: 'mode',
        label: 'Operating mode',
        state: 'READY_FOR_RESEARCH',
        detail: 'Explicit research/simulation mode. Live execution is false.',
      },
      {
        id: 'xaman-daemon',
        label: 'Xaman trading daemon',
        state: 'NOT_PRESENT',
        detail: 'docs/XAMAN_INTEGRATION.md describes server/xaman daemon, SDK, and tRPC routes. Those modules are not in this tree.',
      },
      {
        id: 'xaman-api-key',
        label: 'Xaman API key',
        state: keyConfigured ? 'CONFIGURED_NOT_PERMISSION' : 'NOT_PRESENT',
        detail: keyConfigured
          ? 'A key and secret are configured in the process environment. This milestone does not read the values. Configuration is not signing permission and does not open a payload request.'
          : 'No Xaman API key and secret pair is configured. A key would still not be signing permission.',
      },
      {
        id: 'xrpl-sync',
        label: 'XRPL account poll',
        state: 'BLOCKED',
        detail: 'The startup account poll and 10 second interval are not started. Embedded balances are a static sample, not a ledger observation.',
      },
      {
        id: 'xaman-payload',
        label: 'Xaman payload and sign link',
        state: 'BLOCKED',
        detail: 'Payload creation, sign links, and submission are rejected before a transaction object is built.',
      },
      {
        id: 'omni-execute',
        label: 'OmniCyberDex execute',
        state: 'BLOCKED',
        detail: 'POST /api/omnicyberdex/execute is rejected. The previous FILLED body was a synthetic fill.',
      },
      {
        id: 'coinbase-spot-sim',
        label: 'Coinbase Advanced spot worksheet',
        state: 'READY_FOR_RESEARCH',
        detail: 'BTC-USD and XRP-USD only, from labeled local fixtures. No order, preview, or network call.',
      },
      {
        id: 'coinbase-live',
        label: 'Coinbase live trading',
        state: 'BLOCKED',
        detail: presence.coinbaseJwtConfigured
          ? 'A Coinbase JWT environment variable is present. Its value is not read. Live trading stays off.'
          : 'Live Coinbase trading is not enabled.',
      },
      {
        id: 'cybergym-seed',
        label: 'CyberGym seeded achievements',
        state: 'BLOCKED',
        detail: 'Stored status VERIFIED on seeded achievement rows is a fixture claim, not external certification or trading authorization.',
      },
      {
        id: 'naval-surf',
        label: 'Naval surf badges',
        state: 'BLOCKED',
        detail: 'Caller-supplied and sample PnL do not mint earned badges in this milestone.',
      },
    ],
    roles: RESEARCH_SWARM_ROLES,
    blockers: [
      'Xaman daemon, SDK wrapper, and tRPC router described in docs/XAMAN_INTEGRATION.md are not implemented here.',
      'src/integrations/xrplDevSuite.ts is not mounted from server.ts. Its HTTP handlers for account, order book, AMM, and payload routes reject. The class methods still contain XRPL client calls if some other code invokes them directly.',
      'ledger-integrity/run_testnet_quorum_anchor.mjs still contains an XRPL testnet faucet funding call. This milestone does not run it.',
      'desktop/cybergym-certifier.js still targets Windows paths and is not a certification authority.',
      'server/naval in-memory treasury settlement still accepts caller-supplied PnL. That PnL is not an earned badge and not a live venue fill.',
      'public/omnicyberdex.html still shows historical cockpit copy. Sign links and the SOL transfer constructor were removed; wallet-extension buttons remain and are not an execution integration.',
      'scripts/restore-server-with-zero-cap.mjs downloads server.ts from GitHub when dev or build runs. It now re-applies this guard, but running it makes a network call and can overwrite unrelated server edits.',
    ],
  };
}

export interface SpotWorksheet {
  success: true;
  rejected: false;
  mode: typeof RESEARCH_MODE;
  liveExecutionEnabled: false;
  venue: 'COINBASE_ADVANCED_SPOT';
  product: 'BTC-USD' | 'XRP-USD';
  side: 'buy' | 'sell';
  quoteSize: number;
  fixture: {
    evidenceClass: 'SAMPLE_FIXTURE';
    bid: number;
    ask: number;
    source: string;
    countsAsMarketObservation: false;
  };
  hypotheticalBaseQuantity: number;
  spreadCostEstimateUsd: number;
  spreadCostEvidenceClass: 'PROJECTED_ESTIMATE';
  establishesEdge: false;
  fills: [];
  order: null;
  payload: null;
  submitted: false;
  signed: false;
  note: string;
}

export interface SpotRequestRefusal {
  success: false;
  rejected: true;
  mode: typeof RESEARCH_MODE;
  liveExecutionEnabled: false;
  httpStatus: 400 | 403;
  reason: string;
  fills: [];
  order: null;
  payload: null;
}

const SPOT_FIXTURES = {
  'BTC-USD': { bid: 100000, ask: 100010 },
  'XRP-USD': { bid: 0.5, ask: 0.51 },
} as const;

export type SpotProduct = keyof typeof SPOT_FIXTURES;

export function guardSpotSimulationRequest(body: {
  product?: unknown;
  side?: unknown;
  quoteSize?: unknown;
  execute?: unknown;
  submit?: unknown;
  sign?: unknown;
  preview?: unknown;
}): SpotWorksheet | SpotRequestRefusal {
  if (body.execute || body.submit || body.sign || body.preview) {
    return {
      success: false,
      rejected: true,
      mode: RESEARCH_MODE,
      liveExecutionEnabled: false,
      httpStatus: 403,
      reason: rejectConsequentialAction(body.preview ? 'ORDER_PREVIEW' : 'CREATE_ORDER').reason,
      fills: [],
      order: null,
      payload: null,
    };
  }

  const product = body.product;
  if (product !== 'BTC-USD' && product !== 'XRP-USD') {
    return {
      success: false,
      rejected: true,
      mode: RESEARCH_MODE,
      liveExecutionEnabled: false,
      httpStatus: 400,
      reason: 'Only BTC-USD and XRP-USD Coinbase Advanced spot fixtures are available. This is not an order.',
      fills: [],
      order: null,
      payload: null,
    };
  }

  const side = body.side === 'sell' ? 'sell' : body.side === 'buy' ? 'buy' : null;
  const quoteSize = typeof body.quoteSize === 'number' ? body.quoteSize : Number(body.quoteSize);
  if (!side || !Number.isFinite(quoteSize) || quoteSize <= 0 || quoteSize > 1000) {
    return {
      success: false,
      rejected: true,
      mode: RESEARCH_MODE,
      liveExecutionEnabled: false,
      httpStatus: 400,
      reason: 'Quote size must be a finite USD amount from 0 to 1000. No order was created.',
      fills: [],
      order: null,
      payload: null,
    };
  }

  const book = SPOT_FIXTURES[product];
  const mark = side === 'buy' ? book.ask : book.bid;
  const hypotheticalBaseQuantity = quoteSize / mark;
  const spreadCostEstimateUsd = (book.ask - book.bid) * hypotheticalBaseQuantity;

  return {
    success: true,
    rejected: false,
    mode: RESEARCH_MODE,
    liveExecutionEnabled: false,
    venue: 'COINBASE_ADVANCED_SPOT',
    product,
    side,
    quoteSize,
    fixture: {
      evidenceClass: 'SAMPLE_FIXTURE',
      bid: book.bid,
      ask: book.ask,
      source: 'Inline research fixture. Not a Coinbase market-data response.',
      countsAsMarketObservation: false,
    },
    hypotheticalBaseQuantity,
    spreadCostEstimateUsd,
    spreadCostEvidenceClass: 'PROJECTED_ESTIMATE',
    establishesEdge: false,
    fills: [],
    order: null,
    payload: null,
    submitted: false,
    signed: false,
    note: 'Fixture spread cost is a projected estimate. It is not expected profit, not a fill, and not an order preview.',
  };
}

export interface DrillCheck {
  id: string;
  pass: boolean;
  detail: string;
}

export interface EarnedResearchBadge {
  id: 'RESEARCH-EVIDENCE-01';
  name: string;
  earned: true;
  evidenceClass: 'REAL_OBSERVATION';
  observationScope: 'LOCAL_DRILL_RESULT';
  marketObservation: false;
  source: 'runEvidenceLabelingDrill';
  externalCertification: false;
  tradingAuthorization: false;
  reproducible: true;
}

export interface DrillReport {
  passed: boolean;
  checks: DrillCheck[];
  badge: EarnedResearchBadge | null;
}

export function runEvidenceLabelingDrill(): DrillReport {
  const spot = guardSpotSimulationRequest({ product: 'BTC-USD', side: 'buy', quoteSize: 100 });
  const seeded = classifySeededClaim({ id: 'RECON_1', status: 'VERIFIED' });
  const synthetic = classifyOmniExecuteStub();
  const rejections = CONSEQUENTIAL_ACTIONS.map((action) => rejectConsequentialAction(action));

  const checks: DrillCheck[] = [
    {
      id: 'live-flag',
      pass: LIVE_EXECUTION_ENABLED === false,
      detail: 'Live execution flag is false.',
    },
    {
      id: 'sample-balance',
      pass: EMBEDDED_XAMAN_STATIC_SNAPSHOT.evidenceClass === 'SAMPLE_FIXTURE'
        && EMBEDDED_XAMAN_STATIC_SNAPSHOT.countsAsBalance === false
        && EMBEDDED_XAMAN_STATIC_SNAPSHOT.countsAsMarketObservation === false,
      detail: 'Embedded Xaman numbers are a sample fixture, not a balance observation.',
    },
    {
      id: 'retired-headline',
      pass: RETIRED_PORTAL_HEADLINE.countsAsBalance === false
        && RETIRED_PORTAL_HEADLINE.evidenceClass === 'SAMPLE_FIXTURE',
      detail: 'The retired portal headline is not a balance.',
    },
    {
      id: 'projection-not-edge',
      pass: SAMPLE_PROJECTED_YIELD.evidenceClass === 'PROJECTED_ESTIMATE'
        && SAMPLE_PROJECTED_YIELD.establishesEdge === false,
      detail: 'Projected yield does not establish an edge.',
    },
    {
      id: 'synthetic-fill',
      pass: synthetic.evidenceClass === 'SYNTHETIC_FILL' && synthetic.countsAsFill === false,
      detail: 'The historical OmniCyberDex FILLED stub is not a fill.',
    },
    {
      id: 'seeded-badge',
      pass: seeded.evidenceClass === 'SEEDED_CLAIM'
        && seeded.externalCertification === false
        && seeded.tradingAuthorization === false
        && seeded.earnedByReproducibleTest === false,
      detail: 'Seeded VERIFIED achievement ids are not certification or trading authorization.',
    },
    {
      id: 'key-not-permission',
      pass: signingPermissionFromKeyPresence(true) === false,
      detail: 'API key presence does not grant signing permission.',
    },
    {
      id: 'spot-isolation',
      pass: spot.success === true
        && spot.venue === 'COINBASE_ADVANCED_SPOT'
        && spot.liveExecutionEnabled === false
        && spot.fills.length === 0
        && spot.order === null
        && spot.payload === null
        && spot.signed === false
        && spot.submitted === false
        && spot.establishesEdge === false
        && spot.fixture.evidenceClass === 'SAMPLE_FIXTURE',
      detail: 'BTC spot worksheet stays inside Coinbase Advanced spot fixtures and creates no order.',
    },
    {
      id: 'xrp-spot-only',
      pass: guardSpotSimulationRequest({ product: 'XRP-USD', side: 'sell', quoteSize: 25 }).success === true
        && guardSpotSimulationRequest({ product: 'XRP-USD', side: 'sell', quoteSize: 25, execute: true }).rejected === true,
      detail: 'XRP worksheet is spot-only and an execute flag is rejected.',
    },
    {
      id: 'consequential-reject',
      pass: rejections.every((row) => row.rejected && row.httpStatus === 403 && row.payloadCreated === false && row.orderCreated === false && row.fundsMoved === false && row.liveExecutionEnabled === false),
      detail: 'Every consequential action is rejected before a payload, order, or fund movement.',
    },
  ];

  const passed = checks.every((check) => check.pass);
  return {
    passed,
    checks,
    badge: passed
      ? {
          id: 'RESEARCH-EVIDENCE-01',
          name: 'Evidence labeling',
          earned: true,
          evidenceClass: 'REAL_OBSERVATION',
          observationScope: 'LOCAL_DRILL_RESULT',
          marketObservation: false,
          source: 'runEvidenceLabelingDrill',
          externalCertification: false,
          tradingAuthorization: false,
          reproducible: true,
        }
      : null,
  };
}

export function buildResearchWalletBody(presence: CredentialPresence) {
  const status = buildIntegrationReadiness(presence);
  const drill = runEvidenceLabelingDrill();
  return {
    success: true,
    mode: RESEARCH_MODE,
    liveExecutionEnabled: false,
    signingPermission: false,
    research: status,
    drill,
    wallet: {
      ...EMBEDDED_XAMAN_STATIC_SNAPSHOT.value,
      network: 'not-queried',
      status: 'SAMPLE_FIXTURE',
      evidenceClass: EMBEDDED_XAMAN_STATIC_SNAPSHOT.evidenceClass,
      evidenceLabel: EMBEDDED_XAMAN_STATIC_SNAPSHOT.label,
      countsAsBalance: false,
      countsAsMarketObservation: false,
      liveSyncEnabled: false,
      walletApp: 'Xaman (formerly Xumm)',
      ownerCount: 70,
      sequence: 94732712,
      previousTxnLgrSeq: 106322898,
      gasCapacityTransactions: 1296400,
      totalTrustlines: 68,
      nonZeroTrustlines: 65,
      reclaimableReserveXrp: 0.6,
      tokens: [],
      nfts: [],
      activeRevenueStrategies: [
        {
          id: 'historical-note',
          name: SAMPLE_PROJECTED_YIELD.value.label,
          category: 'PROJECTED_ESTIMATE',
          targetAsset: 'not-an-order',
          projectedYieldApr: SAMPLE_PROJECTED_YIELD.value.aprLabel,
          status: 'NOT_DISPATCHABLE',
          evidenceClass: SAMPLE_PROJECTED_YIELD.evidenceClass,
          establishesEdge: false,
        },
      ],
    },
  };
}
