# OmniCyberDex XRPL app — Xaman server setup

This repository loads environment variables from the repository-root `.env` file. `server.ts` calls `dotenv.config()` with no path, so the file must sit next to `server.ts` and `package.json`.

## Variables

```env
XAMAN_API_KEY=
XAMAN_API_SECRET=
```

`XAMAN_API_KEY` is the OmniCyberDex XRPL app key. `src/integrations/xrplDevSuite.ts` is the reader. `XAMAN_API_SECRET` is optional for this milestone.

`XUMM_API_KEY` is a different name. Setting only that variable leaves `XAMAN_API_KEY` unconfigured.

Do not put either value in frontend code, browser storage, docs, or `POST /api/xaman/save-credentials`. That route does not store a posted key. Restart the Node process after editing `.env`.

## How to see whether it is set

`GET /api/xaman/readiness` returns booleans:

- `xamanApiKeyConfigured`
- `xamanApiSecretConfigured`

The same report is at `GET /api/omnicyberdex/xaman-readiness`. The Xaman research entry is `public/xaman-hub.html` and the Xaman tab (`XamanXApp`). None of these responses include the key or the secret.

## What works with the secret empty

- `GET /api/xaman/readiness`
- `GET /api/omnicyberdex/status`
- `GET /api/omnicyberdex/engines`
- `GET /api/orchestrator/status`
- `POST /api/omnicyberdex/research/spot` for Coinbase Advanced `BTC-USD` and `XRP-USD`

Those routes do not place orders. An omitted profit stays unknown. A reported profit of zero stays zero.

## What stays unconfigured in this milestone

- Creating, signing, or submitting a Xaman payload
- `POST /api/omnicyberdex/execute`
- Windows scripts that are not in this repo: `omni_cyberdex_harness.py`, `sovereign_aether_harness.py`, `stratus_harness.py`, `aether_stratus.py`, `omnicyberdex_master_orchestrator.py`, `test_aether_harness_end_to_end.py`

A configured key does not turn those on. Wallet amounts stay unknown until a public ledger read confirms them, and a USD price is not invented from that read.
