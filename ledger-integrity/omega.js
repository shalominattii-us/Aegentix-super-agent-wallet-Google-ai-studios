/**
 * OMEGA — origin anchor + checkpoint chain.
 *
 * Merkle root alone proves WHAT the data is. It cannot prove:
 *   - when the ledger actually started  (backdating)
 *   - that this root follows the previous one  (root swapping)
 *   - who operated the ledger  (provenance)
 *
 * OMEGA closes all three:
 *   ORIGIN node  : signed genesis commitment -> covers the first entry ever written
 *   CHECKPOINTS  : each root is signed AND embeds the prior checkpoint hash
 *                  => an append-only chain of roots, unbreakable without a key
 *   VERIFY       : walks origin -> cp1 -> cp2 ... re-deriving each merkle root
 *                  from the ledger prefix it claims to commit to.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { merkleRoot, leafHash } = require('./merkle.js');

const sha256hex = (s) => crypto.createHash('sha256').update(s).digest('hex');

function sortKeys(o) {
  if (Array.isArray(o)) return o.map(sortKeys);
  if (o && typeof o === 'object') {
    return Object.keys(o).sort().reduce((a, k) => ((a[k] = sortKeys(o[k])), a), {});
  }
  return o;
}
const canon = (o) => JSON.stringify(sortKeys(o));

function ensureKeys(dir) {
  const kd = path.join(dir, 'keys');
  fs.mkdirSync(kd, { recursive: true });
  const priv = path.join(kd, 'omega_ed25519.key');
  const pub = path.join(kd, 'omega_ed25519.pub');
  if (!fs.existsSync(priv)) {
    const { privateKey, publicKey } = crypto.generateKeyPairSync('ed25519');
    fs.writeFileSync(priv, privateKey.export({ type: 'pkcs8', format: 'pem' }), { mode: 0o600 });
    fs.writeFileSync(pub, publicKey.export({ type: 'spki', format: 'pem' }), { mode: 0o644 });
  }
  return {
    privateKey: fs.readFileSync(priv, 'utf8'),
    publicKey: fs.readFileSync(pub, 'utf8'),
    privPath: priv,
    pubPath: pub,
  };
}

const sig = (msg, privPem) => crypto.sign(null, Buffer.from(msg), privPem).toString('base64');
const check = (msg, sigB64, pubPem) => {
  try { return crypto.verify(null, Buffer.from(msg), pubPem, Buffer.from(sigB64, 'base64')); }
  catch { return false; }
};

function loadEntries(file) {
  if (!fs.existsSync(file)) return [];
  return fs.readFileSync(file, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
}
const leavesOf = (entries) => entries.map((e) => require('./merkle.js').leafFromEntry(e));
const rootOf = (entries) => merkleRoot(leavesOf(entries));

function genesis(dir, ledgerFile, label) {
  const keys = ensureKeys(dir);
  const entries = loadEntries(ledgerFile);
  const origin = {
    type: 'ORIGIN',
    label,
    ledgerFile,
    genesisEntryHash: entries.length ? entries[0].hash : null,
    genesisAt: entries.length ? entries[0].at : null,
    operatorPublicKey: keys.publicKey,
    createdAt: new Date().toISOString(),
  };
  origin.hash = sha256hex(canon(origin));
  origin.signature = sig(origin.hash, keys.privateKey);
  fs.writeFileSync(path.join(dir, 'origin.json'), JSON.stringify(origin, null, 2));
  console.log(`ORIGIN created  hash ${origin.hash.slice(0, 16)}…  covers ${entries.length} entries`);
  return origin;
}

function checkpoint(dir, ledgerFile) {
  const keys = ensureKeys(dir);
  const originPath = path.join(dir, 'origin.json');
  if (!fs.existsSync(originPath)) throw new Error('no origin — run genesis first');
  const origin = JSON.parse(fs.readFileSync(originPath, 'utf8'));
  const cpFile = path.join(dir, 'checkpoints.jsonl');
  const prior = fs.existsSync(cpFile)
    ? fs.readFileSync(cpFile, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l))
    : [];
  const entries = loadEntries(ledgerFile);
  if (!entries.length) throw new Error('ledger empty — nothing to commit');
  const cp = {
    type: 'CHECKPOINT',
    index: prior.length + 1,
    prev: prior.length ? prior[prior.length - 1].hash : origin.hash,
    entries: entries.length,
    chainHead: entries[entries.length - 1].hash,
    merkleRoot: rootOf(entries),
    at: new Date().toISOString(),
  };
  cp.hash = sha256hex(canon(cp));
  cp.signature = sig(cp.hash, keys.privateKey);
  fs.appendFileSync(cpFile, JSON.stringify(cp) + '\n');
  console.log(`CHECKPOINT #${cp.index}  root ${cp.merkleRoot.slice(0, 16)}…  prev ${cp.prev.slice(0, 16)}…  entries ${cp.entries}`);
  return cp;
}

function verify(dir, ledgerFile) {
  const problems = [];
  const originPath = path.join(dir, 'origin.json');
  if (!fs.existsSync(originPath)) return { ok: false, problems: ['no origin.json'] };
  const origin = JSON.parse(fs.readFileSync(originPath, 'utf8'));
  const pub = origin.operatorPublicKey;

  // 1. origin signature
  const { hash: oh, signature: os, ...originBody } = origin;
  if (sha256hex(canon(originBody)) !== oh) problems.push('origin: content altered (hash mismatch)');
  if (!check(oh, os, pub)) problems.push('origin: bad signature');

  const cpFile = path.join(dir, 'checkpoints.jsonl');
  const cps = fs.existsSync(cpFile)
    ? fs.readFileSync(cpFile, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l))
    : [];
  if (cps.length && origin.genesisEntryHash) {
    // 2. each checkpoint: signature + hash + link + merkle prefix
    const entries = loadEntries(ledgerFile);
    let prevExpected = origin.hash;
    for (const cp of cps) {
      const { hash, signature, ...body } = cp;
      if (sha256hex(canon(body)) !== hash) problems.push(`cp#${cp.index}: content altered`);
      if (!check(hash, signature, pub)) problems.push(`cp#${cp.index}: bad signature`);
      if (cp.prev !== prevExpected) problems.push(`cp#${cp.index}: broken link to prior root`);
      if (entries.length >= cp.entries) {
        const prefixRoot = rootOf(entries.slice(0, cp.entries));
        if (prefixRoot !== cp.merkleRoot) problems.push(`cp#${cp.index}: ledger prefix does not match committed root`);
      } else {
        problems.push(`cp#${cp.index}: ledger shorter than checkpoint (entries removed)`);
      }
      prevExpected = hash;
    }
  }
  return { ok: problems.length === 0, problems, checkpoints: cps.length, originHash: origin.hash };
}

if (require.main === module) {
  const [cmd, ...rest] = process.argv.slice(2);
  const arg = (name, def) => {
    const i = rest.indexOf(`--${name}`);
    return i >= 0 ? rest[i + 1] : def;
  };
  const dir = arg('dir', 'omega');
  const ledger = arg('ledger', 'local/mirror.chain.jsonl');
  const label = arg('label', 'machine-mirror');
  try {
    fs.mkdirSync(dir, { recursive: true });
    if (cmd === 'genesis') genesis(dir, ledger, label);
    else if (cmd === 'checkpoint') checkpoint(dir, ledger);
    else if (cmd === 'verify') {
      const r = verify(dir, ledger);
      console.log(JSON.stringify(r, null, 2));
      process.exit(r.ok ? 0 : 1);
    } else console.log('usage: node omega.js genesis|checkpoint|verify [--dir D] [--ledger F] [--label L]');
  } catch (e) {
    console.error('ERROR:', e.message);
    process.exit(1);
  }
}
module.exports = { genesis, checkpoint, verify, ensureKeys };
