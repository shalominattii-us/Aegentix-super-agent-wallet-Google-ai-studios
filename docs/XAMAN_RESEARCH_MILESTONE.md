# Xaman and OmniCyberDex research milestone

This milestone keeps the Xaman entry and the OmniCyberDex execute path in explicit research/simulation mode. Live execution is false. Nothing here activates trading, signing, or a daemon.

## What is usable

- `XamanXApp` is the research console and is rendered on the existing Xaman revenue bridge.
- `public/xaman-hub.html` is a static mirror with the same labels and no sign links.
- `GET /api/xaman/research-status` reports readiness and whether credentials are configured. It does not return secret values.
- `GET /api/xaman/wallet` returns the embedded static snapshot labeled `SAMPLE_FIXTURE`. It does not query XRPL.
- `POST /api/xaman/research/spot-simulation` runs a Coinbase Advanced spot worksheet for `BTC-USD` or `XRP-USD` from inline fixtures. The response has no order, payload, or fill.
- `runEvidenceLabelingDrill` awards `RESEARCH-EVIDENCE-01` only when its local checks pass. That badge is a local drill result. It is not external certification and it does not authorize trading.
- Research swarm roles are readiness cartographer, evidence scribe, fixture simulator, and fail-closed auditor.

## Server rejections

These posts return HTTP 403 before the older handler bodies run:

- `POST /api/omnicyberdex/execute`
- `POST /api/agent/execute`
- `POST /api/agent/batch-execute-top`
- `POST /api/trading/signals/execute`
- `POST /api/xaman/create-payload`
- `POST /api/xaman/save-credentials`
- `POST /api/xaman/submit-payload`

`GET /api/omnicyberdex/engines` labels the historical engine table as a sample fixture and sets status to `RESEARCH_SIMULATION`.

The XRPL account poll in `server.ts` is behind `XAMAN_LIVE_SYNC_ENABLED = false` and is not started.

The unmounted `xrplRouter` rejects account reads, order book reads, AMM routes, drafts, payload fetch, and payload creation. `executeAutonomousTestnetTrade` returns the same rejection and does not connect, fund, sign, or submit.

## Evidence rules

- Embedded Xaman numbers and the retired portal headline are sample fixtures, not balances.
- APR and spread-cost figures are projected estimates. They do not establish an edge.
- The old OmniCyberDex `FILLED` body is a synthetic fill.
- CyberGym rows whose stored status is `VERIFIED` are seeded claims.
- A Xaman API key is not signing permission.

## Blockers

1. `docs/XAMAN_INTEGRATION.md` describes a daemon, SDK wrapper, and tRPC router that are not in this tree. That document is not an activation guide.
2. `XrplDevSuite` class methods still contain XRPL client calls. The HTTP handlers reject, and the router is not mounted from `server.ts`. Direct method calls are still a network path.
3. `ledger-integrity/run_testnet_quorum_anchor.mjs` still contains an XRPL testnet faucet funding call. This milestone does not run it.
4. Naval surf scoring still computes tier math from caller-supplied PnL. That result is labeled and is not an earned badge. `evaluate_round_trip_wave` does not mint a badge unless the caller passes `reproducible_observation=True`. The sample loop does not pass that flag. In-memory treasury settlement still accepts caller-supplied PnL.
5. `desktop/cybergym-certifier.js` still targets `C:/Aegentix` and `C:/Users/eagle/CyberGym`. Missing drill scores are not treated as passes. Its record is not external certification or trading authorization.
6. `public/omnicyberdex.html` still contains historical cockpit copy and wallet-extension connect buttons. Sign links and the SOL transfer constructor were removed.
7. `scripts/restore-server-with-zero-cap.mjs` downloads `server.ts` from GitHub during `predev` and `prebuild`. It re-applies this guard and keeps the XRPL poll disabled. Running it is a network call and can overwrite unrelated server edits.
8. No deployment and no live activation is part of this milestone.
