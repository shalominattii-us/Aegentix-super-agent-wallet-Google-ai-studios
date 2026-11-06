import assert from 'node:assert/strict';
import http from 'node:http';
import test from 'node:test';
import express from 'express';
import { xamanResearchGuard } from '../server/research/xamanResearchGuard.ts';
import {
  CONSEQUENTIAL_ACTIONS,
  EMBEDDED_XAMAN_STATIC_SNAPSHOT,
  LIVE_EXECUTION_ENABLED,
  RESEARCH_MODE,
  RESEARCH_SWARM_ROLES,
  RETIRED_PORTAL_HEADLINE,
  buildIntegrationReadiness,
  buildResearchWalletBody,
  classifyOmniExecuteStub,
  classifySeededClaim,
  guardSpotSimulationRequest,
  rejectConsequentialAction,
  runEvidenceLabelingDrill,
  signingPermissionFromKeyPresence,
} from '../src/research/xamanOmniResearch.ts';

const SECRET_MARKER = 'unit-test-secret-marker-do-not-leak';

function listen(app: express.Express): Promise<{ base: string; close: () => Promise<void> }> {
  const server = http.createServer(app);
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      if (!address || typeof address === 'string') throw new Error('no port');
      resolve({
        base: `http://127.0.0.1:${address.port}`,
        close: () => new Promise((done, fail) => server.close((err) => err ? fail(err) : done())),
      });
    });
  });
}

test('mode stays research/simulation and live execution stays false', () => {
  assert.equal(RESEARCH_MODE, 'RESEARCH_SIMULATION');
  assert.equal(LIVE_EXECUTION_ENABLED, false);
  const status = buildIntegrationReadiness({
    xummKeyConfigured: true,
    xummSecretConfigured: true,
    coinbaseJwtConfigured: true,
  });
  assert.equal(status.liveExecutionEnabled, false);
  assert.equal(status.signingPermission, false);
  assert.equal(status.apiKeyIsSigningPermission, false);
  assert.equal(status.tradingAuthorization, false);
  assert.equal(signingPermissionFromKeyPresence(true), false);
  assert.equal(RESEARCH_SWARM_ROLES.every((role) => role.authorizesTrading === false && role.authorizesSigning === false), true);
});

test('consequential actions are rejected before any payload or order exists', () => {
  for (const action of CONSEQUENTIAL_ACTIONS) {
    const rejection = rejectConsequentialAction(action);
    assert.equal(rejection.rejected, true);
    assert.equal(rejection.httpStatus, 403);
    assert.equal(rejection.liveExecutionEnabled, false);
    assert.equal(rejection.payloadCreated, false);
    assert.equal(rejection.orderCreated, false);
    assert.equal(rejection.fundsMoved, false);
    assert.equal(rejection.signingPermission, false);
    assert.equal('txJson' in rejection, false);
    assert.equal('xamanDeepLink' in rejection, false);
  }
});

test('evidence classes stay distinct and seeded VERIFIED is not certification', () => {
  assert.equal(EMBEDDED_XAMAN_STATIC_SNAPSHOT.evidenceClass, 'SAMPLE_FIXTURE');
  assert.equal(EMBEDDED_XAMAN_STATIC_SNAPSHOT.countsAsBalance, false);
  assert.equal(RETIRED_PORTAL_HEADLINE.countsAsBalance, false);
  const synthetic = classifyOmniExecuteStub();
  assert.equal(synthetic.evidenceClass, 'SYNTHETIC_FILL');
  assert.equal(synthetic.countsAsFill, false);
  const seeded = classifySeededClaim({ id: 'RECON_1', status: 'VERIFIED' });
  assert.equal(seeded.evidenceClass, 'SEEDED_CLAIM');
  assert.equal(seeded.externalCertification, false);
  assert.equal(seeded.tradingAuthorization, false);
  assert.equal(seeded.earnedByReproducibleTest, false);
  assert.match(seeded.displayLabel, /not external certification/);
});

test('Coinbase Advanced spot worksheet is isolated from orders and XRPL', () => {
  const spot = guardSpotSimulationRequest({ product: 'XRP-USD', side: 'buy', quoteSize: 50 });
  assert.equal(spot.success, true);
  if (!spot.success) return;
  assert.equal(spot.venue, 'COINBASE_ADVANCED_SPOT');
  assert.equal(spot.product, 'XRP-USD');
  assert.deepEqual(spot.fills, []);
  assert.equal(spot.order, null);
  assert.equal(spot.payload, null);
  assert.equal(spot.signed, false);
  assert.equal(spot.submitted, false);
  assert.equal(spot.establishesEdge, false);
  assert.equal(spot.fixture.evidenceClass, 'SAMPLE_FIXTURE');
  assert.equal(spot.spreadCostEvidenceClass, 'PROJECTED_ESTIMATE');

  const blocked = guardSpotSimulationRequest({ product: 'BTC-USD', side: 'sell', quoteSize: 10, execute: true });
  assert.equal(blocked.success, false);
  if (blocked.success) return;
  assert.equal(blocked.httpStatus, 403);
  assert.equal(blocked.order, null);

  const otherVenue = guardSpotSimulationRequest({ product: 'XRP/USD', side: 'buy', quoteSize: 10 });
  assert.equal(otherVenue.success, false);
});

test('evidence drill earns a local badge only when its checks pass', () => {
  const drill = runEvidenceLabelingDrill();
  assert.equal(drill.passed, true);
  assert.ok(drill.badge);
  assert.equal(drill.badge?.id, 'RESEARCH-EVIDENCE-01');
  assert.equal(drill.badge?.earned, true);
  assert.equal(drill.badge?.evidenceClass, 'REAL_OBSERVATION');
  assert.equal(drill.badge?.observationScope, 'LOCAL_DRILL_RESULT');
  assert.equal(drill.badge?.marketObservation, false);
  assert.equal(drill.badge?.externalCertification, false);
  assert.equal(drill.badge?.tradingAuthorization, false);
  assert.equal(drill.checks.some((check) => check.pass === false), false);
});

test('HTTP guard rejects execution and does not echo secrets', async () => {
  const previous = {
    key: process.env.XUMM_API_KEY,
    secret: process.env.XUMM_API_SECRET,
  };
  process.env.XUMM_API_KEY = SECRET_MARKER;
  process.env.XUMM_API_SECRET = SECRET_MARKER;

  const app = express();
  app.use(express.json());
  app.use(xamanResearchGuard);
  app.post('/api/omnicyberdex/execute', (_req, res) => {
    res.json({ success: true, status: 'FILLED', pnlUsd: 184.2, txId: 'should-not-win' });
  });
  app.post('/api/xaman/save-credentials', (req, res) => {
    process.env.XUMM_API_KEY = req.body?.apiKey;
    res.json({ success: true, hasXummCredentials: true });
  });

  const server = await listen(app);
  try {
    const execute = await fetch(`${server.base}/api/omnicyberdex/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pair: 'XRP/USD', amountUsd: 10000 }),
    });
    const executeBody = await execute.json();
    assert.equal(execute.status, 403);
    assert.equal(executeBody.rejected, true);
    assert.equal(executeBody.status, undefined);
    assert.equal(executeBody.success, false);
    assert.equal(executeBody.status, undefined);
    assert.equal(executeBody.txId, undefined);
    assert.equal(executeBody.pnlUsd, undefined);
    assert.equal(executeBody.payloadCreated, false);
    assert.equal(JSON.stringify(executeBody).includes(SECRET_MARKER), false);

    const wallet = await fetch(`${server.base}/api/xaman/wallet`);
    const walletText = await wallet.text();
    assert.equal(wallet.status, 200);
    assert.equal(walletText.includes(SECRET_MARKER), false);
    assert.equal(walletText.includes('SAMPLE_FIXTURE'), true);
    assert.equal(walletText.includes('RESEARCH-EVIDENCE-01'), true);
    assert.equal(walletText.includes('"liveExecutionEnabled":false'), true);
    const walletJson = JSON.parse(walletText);
    assert.equal(walletJson.wallet.countsAsBalance, false);
    assert.equal(walletJson.signingPermission, false);
    assert.equal(walletJson.research.credentialPresence.xummKeyConfigured, true);

    const save = await fetch(`${server.base}/api/xaman/save-credentials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey: 'replacement-secret', apiSecret: 'replacement-secret' }),
    });
    assert.equal(save.status, 403);
    assert.equal(process.env.XUMM_API_KEY, SECRET_MARKER);

    const payload = await fetch(`${server.base}/api/xaman/create-payload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ strategy: 'DEX_ARBITRAGE' }),
    });
    const payloadBody = await payload.json();
    assert.equal(payload.status, 403);
    assert.equal(payloadBody.payloadCreated, false);
    assert.equal('txJson' in payloadBody, false);

    const spot = await fetch(`${server.base}/api/xaman/research/spot-simulation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product: 'BTC-USD', side: 'buy', quoteSize: 100 }),
    });
    const spotBody = await spot.json();
    assert.equal(spot.status, 200);
    assert.equal(spotBody.venue, 'COINBASE_ADVANCED_SPOT');
    assert.deepEqual(spotBody.fills, []);
    assert.equal(spotBody.order, null);

    const signalExecute = await fetch(`${server.base}/api/trading/signals/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-guardian-token': 'not-authorization' },
      body: JSON.stringify({ signalId: 'SIG-1', pair: 'XRP/USD', sizeUsd: 100 }),
    });
    const signalBody = await signalExecute.json();
    assert.equal(signalExecute.status, 403);
    assert.equal(signalBody.rejected, true);
    assert.equal(signalBody.orderCreated, false);

    const engines = await fetch(`${server.base}/api/omnicyberdex/engines`);
    const enginesBody = await engines.json();
    assert.equal(enginesBody.evidenceClass, 'SAMPLE_FIXTURE');
    assert.equal(enginesBody.engines[0].status, 'RESEARCH_SIMULATION');
    assert.equal(enginesBody.engines[0].countsAsPnl, false);
  } finally {
    await server.close();
    if (previous.key === undefined) delete process.env.XUMM_API_KEY;
    else process.env.XUMM_API_KEY = previous.key;
    if (previous.secret === undefined) delete process.env.XUMM_API_SECRET;
    else process.env.XUMM_API_SECRET = previous.secret;
  }
});

test('wallet builder never includes credential values it was not given', () => {
  const body = buildResearchWalletBody({
    xummKeyConfigured: false,
    xummSecretConfigured: false,
    coinbaseJwtConfigured: false,
  });
  const text = JSON.stringify(body);
  assert.equal(text.includes('apiSecret'), false);
  assert.equal(body.research.credentialPresence.xummKeyConfigured, false);
  assert.equal(body.signingPermission, false);
  assert.equal(body.liveExecutionEnabled, false);
});
