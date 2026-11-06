#!/usr/bin/env node
/**
 * Redacted secret scan. Prints rule, path, line, length, and a short fingerprint.
 * Never prints secret values.
 */
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { isAbsolute, join, relative, resolve, sep } from 'node:path';
import { EXPOSED_SECRET_ENTRIES } from '../src/security/exposed-secret-denylist.mjs';

const ROOT = process.argv[2]
  ? (isAbsolute(process.argv[2]) ? process.argv[2] : resolve(process.cwd(), process.argv[2]))
  : process.cwd();
const SKIP_DIRS = new Set(['.git', 'node_modules', 'dist', 'build', 'coverage', '.agents']);
const SKIP_EXT = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.ico', '.woff', '.woff2', '.ttf', '.eot', '.mp3', '.mp4', '.wav', '.als', '.mid', '.pdf', '.zip', '.gz', '.lock', '.exe', '.qcow2', '.iso', '.vdi', '.vmdk']);

const HASHES = new Map(EXPOSED_SECRET_ENTRIES.map((entry) => [entry.sha256, entry.id]));

const HIGH_CONFIDENCE = [
  ['private_key_block', /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/],
  ['aws_access_key', /\bAKIA[0-9A-Z]{16}\b/],
  ['github_pat', /\bgithub_pat_[A-Za-z0-9_]{20,}\b/],
  ['github_token', /\bghp_[A-Za-z0-9]{20,}\b/],
  ['google_api_key', /\bAIza[0-9A-Za-z_-]{35}\b/],
  ['openrouter_key', /\bsk-or-v1-[A-Za-z0-9]{20,}\b/],
  ['openai_project_key', /\bsk-proj-[A-Za-z0-9_-]{20,}\b/],
  ['slack_token', /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/],
  ['moltbook_credential', /\bmoltbook_(?:sk_|claim_)?[A-Za-z0-9]{16,}\b/],
];

function fingerprint(value) {
  return createHash('sha256').update(value).digest('hex').slice(0, 12);
}

function walk(dir, out) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const full = join(dir, name);
    let st;
    try { st = statSync(full); } catch { continue; }
    if (st.isDirectory()) walk(full, out);
    else if (st.isFile() && st.size <= 2_500_000 && !SKIP_EXT.has(extname(name))) out.push(full);
  }
}

function extname(name) {
  const i = name.lastIndexOf('.');
  return i >= 0 ? name.slice(i).toLowerCase() : '';
}

function scanText(rel, text) {
  const findings = [];
  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const tokens = line.match(/[A-Za-z0-9+/_.=-]{8,}/g) || [];
    const seen = new Set();
    for (const token of tokens) {
      const hash = createHash('sha256').update(token).digest('hex');
      if (HASHES.has(hash) && !seen.has(hash)) {
        seen.add(hash);
        findings.push({
          rule: 'known_exposed_sha256',
          label: HASHES.get(hash),
          file: rel,
          line: i + 1,
          length: token.length,
          fingerprint: hash.slice(0, 12),
        });
      }
    }
    for (const [rule, pattern] of HIGH_CONFIDENCE) {
      pattern.lastIndex = 0;
      const match = pattern.exec(line);
      if (!match) continue;
      const value = match[0];
      const hash = createHash('sha256').update(value).digest('hex');
      if (HASHES.has(hash)) continue;
      findings.push({
        rule,
        label: rule,
        file: rel,
        line: i + 1,
        length: value.length,
        fingerprint: fingerprint(value),
      });
    }
  }
  return findings;
}

const files = [];
walk(ROOT, files);
const findings = [];
for (const file of files) {
  let text;
  try { text = readFileSync(file, 'utf8'); } catch { continue; }
  if (text.includes('\u0000')) continue;
  const rel = relative(ROOT, file).split(sep).join('/');
  findings.push(...scanText(rel, text));
}

const unique = [];
const seen = new Set();
for (const finding of findings) {
  const key = `${finding.rule}|${finding.file}|${finding.line}|${finding.fingerprint}`;
  if (seen.has(key)) continue;
  seen.add(key);
  unique.push(finding);
}

if (unique.length === 0) {
  console.log(JSON.stringify({ ok: true, filesScanned: files.length, findings: 0 }, null, 2));
  process.exit(0);
}

console.error(JSON.stringify({
  ok: false,
  filesScanned: files.length,
  findings: unique.length,
  results: unique,
}, null, 2));
console.error('Secret scan failed. Findings above are redacted (rule, path, line, length, fingerprint only).');
process.exit(1);
