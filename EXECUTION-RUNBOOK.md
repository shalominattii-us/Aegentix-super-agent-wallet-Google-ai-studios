# Execution runbook: exposed credentials

Source scrub in this branch removes confirmed secrets from the working tree and refuses to boot if a process environment value matches a known-exposed fingerprint. That does not undo copies already published in git history or in anyone's checkout. Rotation and revocation come first. History cleanup is a separate, explicitly approved step after rotation.

Do not test old values against providers. Do not print values into tickets, logs, or shell history. Do not merge, deploy, rewrite history, force-push, or rotate from this document's automation. Those are operator actions.

## Minimal next action

Sign in to each provider console below and revoke or rotate the listed credentials. Put replacements only in the server environment. Then run the verify commands.

## Automated in this branch

- Confirmed literals replaced with server environment reads.
- Startup exits before listen if any environment value matches `src/security/exposed-secret-denylist.mjs`. The log names the variable only.
- Empty secret slots in `.env.example`.
- `.gitignore` keeps filled env files and service-account JSON out of git.
- `node scripts/scan-secrets.mjs` fails on denylist matches and high-confidence key shapes. Output is rule, path, line, length, and a short fingerprint.
- `node --test scripts/exposed-secrets.test.mjs`.
- Xaman routes return HTTP 503 when `XAMAN_API_KEY` and `XAMAN_API_SECRET` are unset. They do not call Xaman.
- Moltbook remote posts and the heartbeat stay off unless `MOLTBOOK_API_KEY` is set to a non-exposed value. The heartbeat also requires `MOLTBOOK_HEARTBEAT=1`.
- Firebase client code does not initialize when `VITE_FIREBASE_API_KEY` is missing or known-exposed.
- OBS WebSocket auth fails closed when `OBS_WEBSOCKET_PASSWORD` is missing or known-exposed.
- The hardcoded session bypass no longer marks the process authenticated.

## Operator-only

- Revoke or rotate every row in the inventory at the provider.
- Install new values in the host environment or secret manager. Never commit them.
- Confirm the old values no longer work by the provider's own console (key deleted / disabled). Do not send the old value to the provider API from this repo.
- Merge and deploy only after that confirmation.
- Git history rewrite, mirror cleanup, and force-push only under a separate approval after rotation. Scrubbing the current tree leaves the old commits intact.

## Apply, test, verify

From a clean checkout of this branch:

```bash
git fetch origin cursor/secret-exposure-remediation-4139
git checkout cursor/secret-exposure-remediation-4139
node scripts/scan-secrets.mjs
node --test scripts/exposed-secrets.test.mjs
```

Optional typecheck after dependencies are installed (this repo's full `npm run lint` has unrelated failures; see the PR for the latest result):

```bash
npm ci
npm run lint
```

Boot guard, after new values are in the environment and old ones are gone:

```bash
node --input-type=module -e "
import { findExposedEnvNames } from './src/security/exposedSecrets.mjs';
const names = findExposedEnvNames(process.env);
if (names.length) {
  console.error('Refusing: exposed variable names: ' + names.join(', '));
  process.exit(1);
}
console.log('env guard ok');
"
```

Compare one candidate without printing it. Replace `NAME` with the variable name. Exit 1 means it is still a known-exposed value.

```bash
node --input-type=module -e "
import { sha256Hex } from './src/security/sha256.mjs';
import { EXPOSED_SECRET_ENTRIES } from './src/security/exposed-secret-denylist.mjs';
const name = process.argv[1];
const value = process.env[name];
if (!value) { console.error('unset ' + name); process.exit(2); }
const hit = EXPOSED_SECRET_ENTRIES.some((entry) => entry.sha256 === sha256Hex(value.trim()));
console.log(name + (hit ? ' EXPOSED' : ' not-listed'));
process.exit(hit ? 1 : 0);
" NAME
```

## Inventory (labels only)

Fingerprints live in `src/security/exposed-secret-denylist.mjs`. This table has no secret values.

| Label | Provider | Env names | Source paths |
| --- | --- | --- | --- |
| OPENROUTER_API_KEY | OpenRouter | OPENROUTER_API_KEY | server.ts |
| OPENROUTER_API_KEY_BASE64 | OpenRouter | OPENROUTER_API_KEY | server.ts (same credential, base64 form) |
| MOLTBOOK_API_KEY_1 .. _9 | Moltbook | MOLTBOOK_API_KEY | server.ts roster and heartbeat |
| MOLTBOOK_CLAIM_URL | Moltbook | MOLTBOOK_CLAIM_URL | server.ts |
| MOLTBOOK_CLAIM_TOKEN | Moltbook | MOLTBOOK_CLAIM_URL | server.ts |
| MOLTBOOK_VERIFICATION_CODE | Moltbook | MOLTBOOK_VERIFICATION_CODE | server.ts, src/components/MoltbookHub.tsx |
| LOCAL_AUTH_BYPASS_SENTINEL | Local session bypass | SERVER_AUTH_SESSION_TOKEN | server.ts |
| XAMAN_API_KEY | Xaman | XAMAN_API_KEY, XUMM_API_KEY | src/integrations/xrplDevSuite.ts, docs/XAMAN_INTEGRATION.md |
| XAMAN_API_SECRET | Xaman | XAMAN_API_SECRET, XUMM_API_SECRET | src/integrations/xrplDevSuite.ts, docs/XAMAN_INTEGRATION.md |
| FIREBASE_API_KEY | Google Firebase | VITE_FIREBASE_API_KEY, FIREBASE_API_KEY | firebase-applet-config.json, src/lib/firebase.ts, src/lib/driveAuth.ts |
| OBS_WEBSOCKET_PASSWORD | OBS Studio WebSocket | OBS_WEBSOCKET_PASSWORD | src/utils/obsStudioBridge.ts, scripts/test_obs_connect.ts |

`LOCAL_AUTH_BYPASS_SENTINEL` is not a provider credential. Do not put that old sentinel back. It made the process look authenticated.

Nine distinct Moltbook API keys were hardcoded. Rotate each agent from the owner dashboard, not only `MOLTBOOK_API_KEY_1`.

## Provider consoles (verified)

- Xaman API key and secret: [Xaman Developer Console](https://apps.xaman.dev/). Regenerate the secret on the application that owned the leaked pair. Docs: [Authorization & Credentials](https://docs.xaman.dev/concepts/authorization). Permission: the Xaman account that owns the application.
- OpenRouter key, including the base64 copy: [OpenRouter API keys](https://openrouter.ai/settings/keys). Delete the exposed key and create a replacement. Permission: the OpenRouter account that owns the key.
- Moltbook API keys, claim URL, and verification code: [Moltbook login](https://www.moltbook.com/login) and [lost API key help](https://www.moltbook.com/help/lost-api-key). The owner rotates a key from the dashboard. Permission: the human who claimed each agent.
- Firebase / Google browser API key: [Google Cloud credentials](https://console.cloud.google.com/apis/credentials) and [Firebase console](https://console.firebase.google.com/). Delete or restrict the exposed browser key and set `VITE_FIREBASE_API_KEY` to the replacement. Permission: project Editor or Owner on the Firebase/Google Cloud project that issued the key. The project id remains in `firebase-applet-config.json` because it is not the secret.
- OBS WebSocket password: OBS Studio on the machine that runs the socket, Tools → WebSocket Server Settings. Set a new password and `OBS_WEBSOCKET_PASSWORD`. Permission: local administrator of that machine. No vendor console.

## Permissions this change does not grant

No cloud IAM, billing, DNS, or GitHub settings are changed. No provider account is accessed. The operator needs the console permissions above plus permission to set environment variables on the host that runs `server.ts`.

## Rollback and stop

Stop if:

- `node scripts/scan-secrets.mjs` reports `known_exposed_sha256` or a high-confidence key rule.
- The env guard prints any variable name. Do not continue by deleting the denylist.
- A provider console is unavailable. Leave the old key disabled if you already revoked it; do not paste it back into git.
- A proposed fix reintroduces a literal, weakens the startup exit, or starts live orders, signing, or transfers.

Rollback of this branch is `git revert` of its commit. Do not restore the removed literals. Reverting the scrub without rotation leaves the exposure in the new tip.

## Overlap and follow-up (not remediated here)

- Studios PR 3 (`cursor/xaman-research-simulation-4f16`) and PR 4 (`cursor/xaman-research-simulation-fbc1`) already blank Xaman example keys on their branches and fail closed the research/simulation labeling. This branch does not restyle OmniCyberDex, naval surf scores, or simulated fill/PnL. Expect overlap on `docs/XAMAN_INTEGRATION.md`, `src/integrations/xrplDevSuite.ts`, and possibly `.env.example`.
- Wallet repo `Aegentix-super-agent-wallet` PR 2 disarms the Coinbase module. This branch does not edit that repo. A working-tree scan of that checkout on 2026-11-06 still matched the Firebase, OpenRouter base64, nine Moltbook, Moltbook verification, OBS WebSocket, and local auth-bypass fingerprints in the same paths (`firebase-applet-config.json`, `server.ts`, `src/utils/obsStudioBridge.ts`, `scripts/test_obs_connect.ts`, `src/components/MoltbookHub.tsx`). That repo is not remediated. The Xaman fingerprints were not in that working tree.
- `CYBERCORE-ai-studio` has `firebase-applet-config.json` whose API key fingerprint matches `FIREBASE_API_KEY`. That file was checked by hash only. The rest of that repo was not scanned, and nothing there was changed.
- Other public repositories under the same owner were not scrubbed. Treat them as follow-up until a fingerprint scan of each working tree says otherwise.
- Simulated fill and PnL text on `main` stays labeled however those open PRs change it. This branch does not add fills, PnL, or live execution.

## Order

1. Rotate and revoke at the consoles.
2. Set new environment values.
3. Run the scan, the secret tests, and the env guard.
4. Only then merge or deploy this branch.
5. History cleanup, if approved later, happens after step 1. Doing it earlier just preserves a window where the old values still work.
