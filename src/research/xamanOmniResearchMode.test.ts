import test from 'node:test';
import assert from 'node:assert/strict';
import { CYBER_GYM_ACHIEVEMENTS } from '../data/cyberGymAchievementsData.ts';
import { presentTrainingEvidence } from './cyberGymTrainingEvidence.ts';
import {
  assessScriptBlockers,
  buildEngineReport,
  buildOrchestratorStatus,
  deriveHud,
  handleOmniCyberDexExecute,
  handleXamanCreatePayload,
  handleXamanSaveCredentials,
  inspectXamanServerConfig,
  MISSING_WINDOWS_SCRIPTS,
  presentXamanWallet,
  reportedProfit,
  simulateCoinbaseSpot,
} from './xamanOmniResearchMode.ts';

const SAMPLE_KEY = 'sample-key-not-a-real-credential';
const SAMPLE_SECRET = 'sample-secret-not-a-real-credential';

function assertNoSecretLeak(payload: unknown) {
  const serialized = JSON.stringify(payload);
  assert.equal(serialized.includes(SAMPLE_KEY), false);
  assert.equal(serialized.includes(SAMPLE_SECRET), false);
  assert.equal(serialized.includes('txHash":"'), false);
  assert.equal(serialized.includes('FILLED'), false);
  assert.equal(serialized.includes('0.05'), false);
}

test('XAMAN_API_KEY presence is boolean and the value stays out of the payload', () => {
  const empty = inspectXamanServerConfig({});
  assert.equal(empty.xamanApiKeyConfigured, false);
  assert.equal(empty.xamanApiSecretConfigured, false);
  assert.equal(empty.destination.fileName, '.env');
  assert.equal(empty.destination.pathRelativeToRepoRoot, '.env');
  assert.equal(empty.destination.variable, 'XAMAN_API_KEY');
  assert.equal(empty.destination.secretVariable, 'XAMAN_API_SECRET');
  assert.match(empty.destination.loader, /dotenv\.config\(\)/);
  assert.match(empty.destination.consumer, /xrplDevSuite\.ts/);
  assert.equal(empty.worksWithoutApiSecret.some((item) => item.path === '/api/omnicyberdex/research/spot'), true);

  const keyOnly = inspectXamanServerConfig({
    XAMAN_API_KEY: `  ${SAMPLE_KEY}  `,
    XUMM_API_KEY: SAMPLE_SECRET,
  });
  assert.equal(keyOnly.xamanApiKeyConfigured, true);
  assert.equal(keyOnly.xamanApiSecretConfigured, false);
  assert.equal(keyOnly.legacyXummApiKeyConfigured, true);
  assert.equal(keyOnly.keyValueIncluded, false);
  assert.equal(keyOnly.unconfigured.some((line) => line.startsWith('XANAN') || line.includes('XAMAN_API_SECRET is empty')), true);
  assertNoSecretLeak(keyOnly);
});

test('whitespace and a legacy XUMM name do not count as the OmniCyberDex key', () => {
  const report = inspectXamanServerConfig({
    XAMAN_API_KEY: '   ',
    XUMM_API_KEY: SAMPLE_KEY,
    XUMM_API_SECRET: SAMPLE_SECRET,
  });
  assert.equal(report.xamanApiKeyConfigured, false);
  assert.equal(report.legacyXummApiKeyConfigured, true);
  assert.equal(report.unconfigured.some((line) => line.includes('XUMM_API_KEY is set')), true);
  assertNoSecretLeak(report);
});

test('credential routes do not store or echo a posted key', () => {
  const saved = handleXamanSaveCredentials();
  const created = handleXamanCreatePayload();
  assert.equal(saved.httpStatus, 403);
  assert.equal(saved.body.stored, false);
  assert.equal(saved.body.destination.variable, 'XAMAN_API_KEY');
  assert.equal(created.httpStatus, 403);
  assert.equal(created.body.payload, null);
  assert.equal(created.body.submitted, false);
  assertNoSecretLeak(saved);
  assertNoSecretLeak(created);
});

test('execute keeps zero profit at zero and leaves an omitted profit unknown', () => {
  const zero = handleOmniCyberDexExecute({
    mode: 'LIVE_ATOMIC_DISPATCH',
    netProfitUsd: 0,
    pair: 'XRP-USD',
  });
  assert.equal(zero.httpStatus, 403);
  assert.equal(zero.body.executed, false);
  assert.equal(zero.body.netProfitUsd, 0);
  assert.equal(zero.body.txHash, null);
  assert.equal(zero.body.ledgerIndex, null);
  assert.equal(zero.body.status, 'NOT_EXECUTED');

  const omitted = handleOmniCyberDexExecute({ mode: 'LIVE_ATOMIC_DISPATCH' });
  assert.equal(omitted.body.netProfitUsd, null);
  assert.equal(omitted.body.pnlUsd, null);
  assert.equal(reportedProfit(undefined), null);
  assert.equal(reportedProfit(0), 0);
  assertNoSecretLeak(zero);
  assertNoSecretLeak(omitted);
});

test('spot research accepts only Coinbase Advanced BTC-USD and XRP-USD and does not fill', () => {
  const btc = simulateCoinbaseSpot({ productId: 'BTC-USD' });
  const xrp = simulateCoinbaseSpot({ productId: 'XRP-USD', netProfitUsd: 0 });
  const eth = simulateCoinbaseSpot({ productId: 'ETH-USD', netProfitUsd: 12 });
  assert.equal(btc.executed, false);
  assert.equal(btc.status, 'SIMULATED_NO_ORDER');
  assert.equal(btc.netProfitUsd, null);
  assert.equal(btc.txHash, null);
  assert.equal(xrp.netProfitUsd, 0);
  assert.equal(eth.status, 'OUT_OF_SCOPE');
  assert.equal(eth.netProfitUsd, null);
  assert.equal(btc.profitableStrategyValidated, false);
  assert.equal(btc.zeroLossGuarantee, false);
});

test('orchestrator status does not treat a scan as execution or invent launched engines', () => {
  const status = buildOrchestratorStatus({ XAMAN_API_KEY: SAMPLE_KEY }, () => false);
  assert.equal(status.probed, false);
  assert.equal(status.reachability, 'NOT_PROBED');
  assert.equal(status.scanIsExecution, false);
  assert.equal(status.enginesLaunched, null);
  assert.equal(status.liveExecutionEnabled, false);
  assert.equal(status.activePipelines.xaman_omnicyberdex_xrpl.apiKeyConfigured, true);
  assert.equal(status.activePipelines.xaman_omnicyberdex_xrpl.status, 'RESEARCH_SIMULATION');
  const blockers = assessScriptBlockers(() => false);
  assert.equal(blockers.length, MISSING_WINDOWS_SCRIPTS.length);
  assert.equal(blockers.every((item) => item.presentInRepo === false), true);
  const engines = buildEngineReport(() => false);
  assert.equal(engines.every((engine) => engine.pnl24hUsd === null && engine.status === 'NOT_OPERATIONAL'), true);
  assertNoSecretLeak(status);

  const hud = deriveHud(status, null);
  assert.equal(hud.isLive, false);
  assert.equal(hud.executionEnabled, false);
  assert.equal(hud.xamanApiKeyConfigured, true);

  const forcedOnline = deriveHud({
    mode: 'RESEARCH_SIMULATION',
    liveExecutionEnabled: false,
    timestamp: status.timestamp,
    xamanSetup: status.xamanSetup,
    activePipelines: { desk: { status: 'ONLINE' } },
  }, null);
  assert.equal(forcedOnline.isLive, false);
});

test('an unconfirmed wallet does not promote seed balances, and a real zero balance stays zero', () => {
  const unknown = presentXamanWallet(null, { queriedAccount: 'rExample' });
  assert.equal(unknown.nativeXrpBalance, null);
  assert.equal(unknown.nativeXrpUsd, null);
  assert.equal(unknown.previousTxnLgrSeq, null);
  assert.equal(unknown.balanceTrust, 'UNKNOWN');
  assert.deepEqual(unknown.activeRevenueStrategies, []);

  const zero = presentXamanWallet({
    nativeXrpBalance: 0,
    ownerCount: 0,
    sequence: 10,
    previousTxnLgrSeq: 20,
    trustlineCount: 0,
    readAt: '2026-11-06T00:00:00.000Z',
  });
  assert.equal(zero.nativeXrpBalance, 0);
  assert.equal(zero.ownerCount, 0);
  assert.equal(zero.nativeXrpUsd, null);
  assert.equal(zero.balanceTrust, 'PUBLIC_LEDGER_XRP_AMOUNT_ONLY');
});

test('seed VERIFIED CyberGym rows are catalog evidence and are not earned', () => {
  const evidence = presentTrainingEvidence(CYBER_GYM_ACHIEVEMENTS);
  assert.equal(evidence.proposedNameOnly, true);
  assert.equal(evidence.renamed, false);
  assert.equal(evidence.earnedCount, 0);
  assert.equal(evidence.externalAccreditationCount, 0);
  assert.ok(evidence.seedCatalogCount > 0);
  assert.equal(evidence.rows.every((row) => row.earned === false && row.evidenceClass === 'SEED_FIXTURE'), true);
  assert.equal(evidence.seedCatalogCount, CYBER_GYM_ACHIEVEMENTS.filter((row) => row.status === 'VERIFIED').length);
});
