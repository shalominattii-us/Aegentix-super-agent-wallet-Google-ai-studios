#!/usr/bin/env node
/**
 * Restores server.ts from the last known-good commit and injects the
 * Zero-Cap Flywheel router mount.
 *
 * Usage:
 *   node scripts/restore-server-with-zero-cap.mjs
 *
 * What it does:
 * 1. Downloads server.ts from commit 24df936 (full zero-cap engine commit)
 * 2. Injects: import { zeroCapRouter } from './server/zero-cap/routes.ts'
 * 3. Injects: app.use('/api/zero-cap', zeroCapRouter)
 * 4. Writes the result to ./server.ts
 */

import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const outFile = join(root, 'server.ts');

const GOOD_COMMIT = '24df936f5908108a50ac296044f4384764a14279';
const RAW_URL = `https://raw.githubusercontent.com/shalominattii-us/Aegentix-super-agent-wallet-Google-ai-studios/${GOOD_COMMIT}/server.ts`;

const IMPORT_ANCHOR = "import { grokMcpRouter } from './src/mcp/grokMcpServer.ts';";
const IMPORT_LINE = "import { zeroCapRouter } from './server/zero-cap/routes.ts';";

const MOUNT_ANCHOR = "app.use('/mcp', grokMcpRouter);\napp.use('/api/mcp', grokMcpRouter);";
const MOUNT_LINE = "app.use('/api/zero-cap', zeroCapRouter);";

async function main() {
  console.log('Downloading good server.ts from', GOOD_COMMIT, '...');
  const res = await fetch(RAW_URL);
  if (!res.ok) {
    throw new Error(`Failed to download: ${res.status} ${res.statusText}`);
  }
  let text = await res.text();
  console.log(`Downloaded ${text.length} chars`);

  if (!text.includes(IMPORT_ANCHOR)) {
    throw new Error('Import anchor not found – file format may have changed');
  }
  if (!text.includes(MOUNT_ANCHOR)) {
    throw new Error('Mount anchor not found – file format may have changed');
  }

  if (text.includes('zeroCapRouter')) {
    console.log('zeroCapRouter already present – writing as-is');
  } else {
    text = text.replace(IMPORT_ANCHOR, `${IMPORT_ANCHOR}\n${IMPORT_LINE}`);
    text = text.replace(MOUNT_ANCHOR, `${MOUNT_ANCHOR}\n${MOUNT_LINE}`);
    console.log('Injected zeroCapRouter import + /api/zero-cap mount');
  }

  writeFileSync(outFile, text, 'utf8');
  console.log(`Wrote ${outFile} (${text.length} chars)`);
  console.log('Verified import:', text.includes(IMPORT_LINE));
  console.log('Verified mount:', text.includes("app.use('/api/zero-cap', zeroCapRouter)"));
  console.log('Done. Restart the server (npm run dev).');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
