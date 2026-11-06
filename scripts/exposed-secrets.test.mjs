import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { sha256Hex } from '../src/security/sha256.mjs';
import { findExposedEnvNames, isExposedSecret, readSecretEnv, EXPOSED_SECRET_ENTRIES } from '../src/security/exposedSecrets.mjs';

test('sha256 matches Node crypto for the standard vector', () => {
  const vector = 'abc';
  const expected = createHash('sha256').update(vector).digest('hex');
  assert.equal(sha256Hex(vector), expected);
  assert.equal(expected, 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
});

test('denylist entries are fingerprints only', () => {
  assert.ok(EXPOSED_SECRET_ENTRIES.length > 0);
  for (const entry of EXPOSED_SECRET_ENTRIES) {
    assert.match(entry.sha256, /^[a-f0-9]{64}$/);
    assert.ok(entry.id);
    assert.ok(entry.provider);
    assert.ok(Array.isArray(entry.env));
    assert.ok(Array.isArray(entry.sources));
    assert.equal(Object.hasOwn(entry, 'value'), false);
  }
});

test('known-exposed values are rejected and missing values fail closed', () => {
  const sample = EXPOSED_SECRET_ENTRIES[0];
  assert.equal(isExposedSecret(''), false);
  assert.equal(readSecretEnv({}, sample.env[0] || 'UNSET_SECRET'), '');
  const synthetic = 'synthetic-not-in-denylist';
  assert.equal(isExposedSecret(synthetic), false);
  assert.equal(readSecretEnv({ DEMO_KEY: synthetic }, 'DEMO_KEY'), synthetic);
  assert.equal(readSecretEnv({ DEMO_KEY: `  ${synthetic}  ` }, 'DEMO_KEY'), synthetic);
});

test('findExposedEnvNames returns names only', () => {
  const names = findExposedEnvNames({ SAFE: 'not-a-listed-secret', EMPTY: '' });
  assert.deepEqual(names, []);
  const marker = 'cursor-secret-scan-fixture-value';
  const hit = findExposedEnvNames({ SAFE_NAME: marker });
  assert.equal(hit.includes('SAFE_NAME'), false);
  assert.equal(JSON.stringify(hit).includes(marker), false);
});

test('scanner reports a fixture without echoing it', () => {
  const dir = mkdtempSync(join(tmpdir(), 'secret-scan-'));
  const fixture = ['AIza', 'SyTESTONLYNOTAREALKEY00000000000000'].join('');
  try {
    writeFileSync(join(dir, 'leak.txt'), `apiKey=${fixture}\n`);
    const result = spawnSync(process.execPath, ['scripts/scan-secrets.mjs', dir], {
      cwd: process.cwd(),
      encoding: 'utf8',
    });
    const combined = `${result.stdout}\n${result.stderr}`;
    assert.notEqual(result.status, 0);
    assert.equal(combined.includes(fixture), false);
    assert.match(combined, /google_api_key/);
    assert.match(combined, /leak\.txt/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('repository scan output does not contain denylist preimage markers', () => {
  const result = spawnSync(process.execPath, ['scripts/scan-secrets.mjs'], {
    cwd: process.cwd(),
    encoding: 'utf8',
  });
  const combined = `${result.stdout}\n${result.stderr}`;
  assert.equal(combined.includes('AIzaSy'), false);
  assert.equal(combined.includes('sk-or-v1-'), false);
  assert.equal(combined.includes('moltbook_claim_'), false);
  if (result.status !== 0) {
    throw new Error(`repository secret scan failed:\n${combined}`);
  }
});
