/**
 * QUORUM — 4-of-7 threshold certificates over OMEGA checkpoint roots.
 *
 * Why off-chain: XRPL verifies only secp256k1 and ed25519. A Dilithium 4-of-7
 * certificate cannot be validated on-chain. So the certificate is assembled and
 * verified locally, and only its SHA-256 is anchored in an XRPL memo alongside
 * the checkpoint index and the prior checkpoint hash.
 *
 * Threshold Separation & Anti-Co-Location Enforcement:
 * - A 4-of-7 quorum is 1-of-7 in practice if >= 4 private keys reside on the
 *   same local filesystem accessible to the same OS user.
 * - `checkKeyColocation(dir, threshold)` inspects `dir/keys` and refuses local
 *   signing if `localKeyCount >= threshold` (or `> 1` in strict mode) unless
 *   detached external signatures (`signDetached` / `certifyDetached`) or
 *   distinct external media volumes are used.
 * - Coordinator nodes require ONLY `signers.json` (public keys) and at most 1
 *   local host key (`signer-1.key`), collecting detached `{ signerId, sig }`
 *   attestations from >= 3 external signers/tokens to reach the 4-of-7 threshold.
 *
 * Signature profile is pluggable:
 *   'ed25519'  -> works today (node crypto)
 *   'dilithium'-> wired through the same interface; throws until a PQC lib is present
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const sha256hex = (s) => crypto.createHash('sha256').update(s).digest('hex');
const canon = (o) => {
  const sort = (v) => Array.isArray(v) ? v.map(sort)
    : (v && typeof v === 'object' ? Object.keys(v).sort().reduce((a, k) => ((a[k] = sort(v[k])), a), {}) : v);
  return JSON.stringify(sort(o));
};

// ---------- signature profiles ----------
const PROFILES = {
  ed25519: {
    available: true,
    keygen() {
      const { privateKey, publicKey } = crypto.generateKeyPairSync('ed25519');
      return {
        priv: privateKey.export({ type: 'pkcs8', format: 'pem' }),
        pub: publicKey.export({ type: 'spki', format: 'pem' }),
      };
    },
    sign(msg, privPem) { return crypto.sign(null, Buffer.from(msg), privPem).toString('base64'); },
    verify(msg, sigB64, pubPem) {
      try { return crypto.verify(null, Buffer.from(msg), pubPem, Buffer.from(sigB64, 'base64')); }
      catch { return false; }
    },
  },
  dilithium: {
    available: false, // flip to true when a PQC library is installed
    keygen() { throw new Error('dilithium profile not wired: install a PQC library (e.g. @noble/post-quantum ML-DSA) and implement keygen'); },
    sign() { throw new Error('dilithium profile not wired'); },
    verify() { throw new Error('dilithium profile not wired'); },
  },
};

const profileOf = (name) => {
  const p = PROFILES[name];
  if (!p) throw new Error(`unknown signature profile: ${name}`);
  return p;
};

/**
 * Checks how many private keys exist in `dir/keys`.
 * If `>= threshold` private keys reside in the same local directory, any process
 * running as the current OS user can forge a quorum certificate unilaterally
 * ("1-of-7 in practice").
 */
function checkKeyColocation(dir, threshold = 4, maxLocalKeysAllowed = 1) {
  const kd = path.join(dir, 'keys');
  if (!fs.existsSync(kd)) {
    return { ok: true, localKeyCount: 0, localKeyFiles: [], threshold, maxLocalKeysAllowed };
  }
  const files = fs.readdirSync(kd).filter((f) => f.endsWith('.key') || f.endsWith('.pem'));
  const reachesThresholdSingleHost = files.length >= threshold;
  const exceedsLocalPolicy = files.length > maxLocalKeysAllowed;
  return {
    ok: !reachesThresholdSingleHost && !exceedsLocalPolicy,
    reachesThresholdSingleHost,
    exceedsLocalPolicy,
    localKeyCount: files.length,
    localKeyFiles: files,
    threshold,
    maxLocalKeysAllowed,
    reason: reachesThresholdSingleHost
      ? `QUORUM_COLOCATION_VIOLATION: ${files.length} private keys found in ${kd} (>= threshold ${threshold}). Single-host co-location reduces ${threshold}-of-7 to 1-of-7 in practice. Evict at least ${files.length - maxLocalKeysAllowed} keys to external hardware tokens or offline media and use detached signatures.`
      : exceedsLocalPolicy
        ? `QUORUM_LOCAL_KEY_LIMIT_EXCEEDED: ${files.length} private keys found in ${kd} (max allowed on coordinator host: ${maxLocalKeysAllowed}). Use detached external signatures for remaining signers.`
        : null,
  };
}

// ---------- signer set ----------
function registerSignersManifest(dir, signers, profile = 'ed25519', total = 7, threshold = 4) {
  if (threshold > total) throw new Error('threshold exceeds signer count');
  if (!Array.isArray(signers) || signers.length !== total) {
    throw new Error(`expected ${total} signer public key entries`);
  }
  fs.mkdirSync(dir, { recursive: true });
  const manifest = {
    profile,
    total,
    threshold,
    custodyModel: 'DETACHED_MULTI_DEVICE_QUORUM',
    signers: signers.map((s) => ({ id: s.id, publicKey: s.publicKey, custodyLocation: s.custodyLocation || 'external-signer' })),
    createdAt: new Date().toISOString(),
  };
  fs.writeFileSync(path.join(dir, 'signers.json'), JSON.stringify(manifest, null, 2));
  return manifest;
}

function genesisSigners(dir, profile = 'ed25519', total = 7, threshold = 4, options = {}) {
  if (threshold > total) throw new Error('threshold exceeds signer count');
  const prof = profileOf(profile);
  if (!prof.available) throw new Error(`profile ${profile} unavailable`);
  const allowDevColocated = Boolean(options.allowDevColocated || process.env.AEGENTIX_ALLOW_DEV_COLOCATED_QUORUM === '1');
  const maxLocalKeys = allowDevColocated ? total : 1;

  const kd = path.join(dir, 'keys');
  fs.mkdirSync(kd, { recursive: true });
  const signers = [];
  const detachedExportBundle = [];
  for (let i = 1; i <= total; i++) {
    const k = prof.keygen();
    const id = `signer-${i}`;
    if (i <= maxLocalKeys) {
      const privPath = path.join(kd, `${id}.key`);
      fs.writeFileSync(privPath, k.priv, { mode: 0o600 });
    } else {
      detachedExportBundle.push({ id, privateKeyPem: k.priv, note: 'Move immediately to offline media / hardware token and delete bundle' });
    }
    signers.push({
      id,
      publicKey: k.pub,
      custodyLocation: i <= maxLocalKeys ? 'local-host-coordinator' : 'external-detached-media',
    });
  }
  const manifest = {
    profile, total, threshold,
    custodyModel: allowDevColocated ? 'DEV_COLOCATED_1_OF_N_WARNING' : 'DETACHED_THRESHOLD_CUSTODY',
    maxLocalKeysOnHost: maxLocalKeys,
    signers,
    createdAt: new Date().toISOString(),
    note: allowDevColocated
      ? 'DEV KEY SET (CO-LOCATED) — NOT THRESHOLD SAFE ON SINGLE HOST'
      : `THRESHOLD CUSTODY: only ${maxLocalKeys} key stored on host; remaining ${total - maxLocalKeys} keys require detached external signing`,
  };
  fs.writeFileSync(path.join(dir, 'signers.json'), JSON.stringify(manifest, null, 2));
  console.log(`signer set: ${total} keys, threshold ${threshold}-of-${total}, profile ${profile} (local keys stored: ${maxLocalKeys})`);
  return { ...manifest, detachedExportBundle };
}

const loadManifest = (dir) => JSON.parse(fs.readFileSync(path.join(dir, 'signers.json'), 'utf8'));
const attestMessage = (subject, threshold, total) => `ATTEST|${subject}|${threshold}of${total}`;

function privateKeyOf(dir, signerId, externalKeyMap = {}) {
  if (externalKeyMap && externalKeyMap[signerId]) {
    const extPath = externalKeyMap[signerId];
    if (!fs.existsSync(extPath)) throw new Error(`missing external private key for ${signerId} at ${extPath}`);
    return fs.readFileSync(extPath, 'utf8');
  }
  const p = path.join(dir, 'keys', `${signerId}.key`);
  if (!fs.existsSync(p)) {
    throw new Error(`private key for ${signerId} is not on this host (${p}). Provide a detached signature from ${signerId}'s external token/media.`);
  }
  return fs.readFileSync(p, 'utf8');
}

/**
 * Produces a single detached signature `{ signerId, sig }` using an external key file or PEM string.
 * Intended to be run on an air-gapped signer device or with a mounted hardware token / removable volume.
 */
function signDetached(keyPemOrPath, signerId, subject, threshold = 4, total = 7, profile = 'ed25519') {
  const prof = profileOf(profile);
  const privPem = keyPemOrPath.includes('BEGIN PRIVATE KEY')
    ? keyPemOrPath
    : fs.readFileSync(keyPemOrPath, 'utf8');
  const msg = attestMessage(subject, threshold, total);
  return {
    signerId,
    subject,
    threshold,
    total,
    profile,
    sig: prof.sign(msg, privPem),
    signedAt: new Date().toISOString(),
  };
}

/**
 * Assembles and verifies a 4-of-7 certificate from pre-signed detached signature objects
 * `[{ signerId, sig }, ...]` without requiring private keys to reside in `dir/keys`.
 */
function certifyDetached(dir, subject, detachedSignatures = [], localSignerIds = [], options = {}) {
  const m = loadManifest(dir);
  const prof = profileOf(m.profile);
  const allowDevColocated = Boolean(options.allowDevColocated || process.env.AEGENTIX_ALLOW_DEV_COLOCATED_QUORUM === '1');
  if (!allowDevColocated) {
    const colocation = checkKeyColocation(dir, m.threshold, options.maxLocalKeysAllowed ?? 1);
    if (!colocation.ok) {
      console.log(`REJECTED: ${colocation.reason}`);
      return { ok: false, reason: colocation.reason, colocation };
    }
  }

  const known = new Map(m.signers.map((s) => [s.id, s.publicKey]));
  const msg = attestMessage(subject, m.threshold, m.total);
  const sigMap = new Map();

  for (const item of detachedSignatures) {
    if (!item || !item.signerId || !item.sig) continue;
    if (!known.has(item.signerId)) throw new Error(`unknown signer in detached signatures: ${item.signerId}`);
    sigMap.set(item.signerId, { signerId: item.signerId, sig: item.sig });
  }

  for (const id of localSignerIds) {
    if (!known.has(id)) throw new Error(`unknown local signer: ${id}`);
    if (!sigMap.has(id)) {
      const priv = privateKeyOf(dir, id, options.externalKeyMap);
      sigMap.set(id, { signerId: id, sig: prof.sign(msg, priv) });
    }
  }

  const signatures = Array.from(sigMap.values());
  const body = { subject, threshold: m.threshold, total: m.total, profile: m.profile, signatures };
  const cert = { ...body, certHash: sha256hex(canon(body)), createdAt: new Date().toISOString() };

  const valid = verifyCert(cert, m);
  if (!valid.ok) {
    console.log(`REJECTED: ${valid.reason}`);
    return { ok: false, reason: valid.reason, cert };
  }
  console.log(`CERTIFIED: ${signatures.length}-of-${m.total} on ${subject.slice(0, 16)}…  certHash ${cert.certHash.slice(0, 16)}…`);
  return { ok: true, cert };
}

// ---------- certify ----------
function certify(dir, subject, signerIds, options = {}) {
  const m = loadManifest(dir);
  const allowDevColocated = Boolean(options.allowDevColocated || process.env.AEGENTIX_ALLOW_DEV_COLOCATED_QUORUM === '1');
  if (!allowDevColocated) {
    const colocation = checkKeyColocation(dir, m.threshold, options.maxLocalKeysAllowed ?? 1);
    if (!colocation.ok) {
      console.log(`REJECTED: ${colocation.reason}`);
      return { ok: false, reason: colocation.reason, colocation };
    }
  }

  // Support passing detached signature objects directly in signerIds or options.detachedSignatures
  const detachedList = Array.isArray(options.detachedSignatures) ? [...options.detachedSignatures] : [];
  const localIds = [];
  for (const item of (signerIds || [])) {
    if (item && typeof item === 'object' && item.signerId && item.sig) {
      detachedList.push(item);
    } else if (typeof item === 'string') {
      localIds.push(item);
    }
  }
  const dedupedLocalIds = [...new Set(localIds)];
  if (dedupedLocalIds.length !== localIds.length) {
    console.log(`  note: duplicate signer ids removed (${localIds.length} -> ${dedupedLocalIds.length})`);
  }

  return certifyDetached(dir, subject, detachedList, dedupedLocalIds, { ...options, allowDevColocated });
}

// ---------- verify ----------
function verifyCert(cert, manifest) {
  const m = manifest || null;
  const pubOf = m ? new Map(m.signers.map((s) => [s.id, s.publicKey])) : null;
  const prof = profileOf(cert.profile);

  const { certHash, createdAt, ...body } = cert;
  if (sha256hex(canon(body)) !== certHash) return { ok: false, reason: 'certificate content altered (hash mismatch)' };

  const seen = new Set();
  for (const s of cert.signatures) {
    if (seen.has(s.signerId)) return { ok: false, reason: `duplicate signature from ${s.signerId}` };
    seen.add(s.signerId);
  }
  const threshold = cert.threshold;
  if (cert.signatures.length < threshold) {
    return { ok: false, reason: `below threshold: ${cert.signatures.length} of ${threshold} required` };
  }
  const msg = attestMessage(cert.subject, cert.threshold, cert.total);
  let good = 0;
  for (const s of cert.signatures) {
    const pub = pubOf ? pubOf.get(s.signerId) : null;
    if (!pub) return { ok: false, reason: `signer ${s.signerId} not in manifest` };
    if (!prof.verify(msg, s.sig, pub)) return { ok: false, reason: `bad signature from ${s.signerId}` };
    good++;
  }
  if (good < threshold) return { ok: false, reason: `only ${good} valid of ${threshold} required` };
  return { ok: true, good, threshold, total: cert.total };
}

// ---------- XRPL anchor payload ----------
function anchorPayload(cert, checkpoint) {
  const memoFields = {
    certHash: cert.certHash,
    checkpointIndex: checkpoint ? checkpoint.index : null,
    prevCheckpointHash: checkpoint ? checkpoint.prev : null,
  };
  const memoJson = JSON.stringify(memoFields);
  return {
    MemoData: memoJson,
    MemoDataHex: Buffer.from(memoJson, 'utf8').toString('hex').toUpperCase(),
    MemoType: 'aegentix/quorum-cert',
    MemoTypeHex: Buffer.from('aegentix/quorum-cert', 'utf8').toString('hex').toUpperCase(),
    MemoFormat: 'application/json',
    MemoFormatHex: Buffer.from('application/json', 'utf8').toString('hex').toUpperCase(),
    decoded: {
      ...memoFields,
      threshold: `${cert.threshold}-of-${cert.total}`,
      subject: cert.subject,
      anchoredAt: new Date().toISOString(),
    },
  };
}

if (require.main === module) {
  const [cmd, ...rest] = process.argv.slice(2);
  const arg = (n, d) => { const i = rest.indexOf(`--${n}`); return i >= 0 ? rest[i + 1] : d; };
  const hasFlag = (n) => rest.includes(`--${n}`);
  const dir = arg('dir', 'quorum');
  try {
    fs.mkdirSync(dir, { recursive: true });
    if (cmd === 'genesis-signers') {
      genesisSigners(dir, arg('profile', 'ed25519'), Number(arg('total', 7)), Number(arg('threshold', 4)), {
        allowDevColocated: hasFlag('allow-dev-colocated'),
      });
    } else if (cmd === 'check-colocation') {
      const m = fs.existsSync(path.join(dir, 'signers.json')) ? loadManifest(dir) : { threshold: 4 };
      const res = checkKeyColocation(dir, m.threshold, Number(arg('max-local', 1)));
      console.log(JSON.stringify(res, null, 2));
      process.exit(res.ok ? 0 : 1);
    } else if (cmd === 'sign-detached') {
      const keyPath = arg('key');
      const signerId = arg('signer');
      const subject = arg('subject');
      if (!keyPath || !signerId || !subject) throw new Error('--key <path> --signer <id> --subject <hash> required');
      const sigObj = signDetached(keyPath, signerId, subject, Number(arg('threshold', 4)), Number(arg('total', 7)), arg('profile', 'ed25519'));
      const out = arg('out');
      if (out) fs.writeFileSync(out, JSON.stringify(sigObj, null, 2));
      else console.log(JSON.stringify(sigObj, null, 2));
    } else if (cmd === 'certify') {
      const subject = arg('subject');
      const ids = (arg('signers', '') || '').split(',').filter(Boolean);
      const detachedFile = arg('detached-sigs');
      const detachedSignatures = detachedFile ? JSON.parse(fs.readFileSync(detachedFile, 'utf8')) : [];
      if (!subject) throw new Error('--subject <hex root> required');
      const r = certify(dir, subject, ids, {
        detachedSignatures,
        allowDevColocated: hasFlag('allow-dev-colocated'),
      });
      if (r.ok) {
        const out = arg('out', path.join(dir, 'cert.json'));
        fs.writeFileSync(out, JSON.stringify(r.cert, null, 2));
        console.log(`written: ${out}`);
      } else process.exitCode = 1;
    } else if (cmd === 'certify-checkpoint') {
      const cpFile = path.join(arg('omega', 'omega'), 'checkpoints.jsonl');
      if (!fs.existsSync(cpFile)) throw new Error(`no checkpoints at ${cpFile}`);
      const cps = fs.readFileSync(cpFile, 'utf8').split('\n').filter(Boolean).map(JSON.parse);
      const cp = cps[cps.length - 1];
      console.log(`checkpoint #${cp.index}  root ${cp.merkleRoot.slice(0, 16)}…`);
      const ids = (arg('signers', '') || '').split(',').filter(Boolean);
      const detachedFile = arg('detached-sigs');
      const detachedSignatures = detachedFile ? JSON.parse(fs.readFileSync(detachedFile, 'utf8')) : [];
      const r = certify(dir, cp.hash, ids, {
        detachedSignatures,
        allowDevColocated: hasFlag('allow-dev-colocated'),
      });
      if (r.ok) {
        const out = arg('out', path.join(dir, 'cert.json'));
        fs.writeFileSync(out, JSON.stringify(r.cert, null, 2));
        const payload = anchorPayload(r.cert, cp);
        fs.writeFileSync(path.join(dir, 'anchor.json'), JSON.stringify(payload, null, 2));
        console.log(`written: ${out} + ${path.join(dir, 'anchor.json')}`);
        console.log(`XRPL memo -> ${payload.MemoData.slice(0, 24)}… (index ${cp.index}, prev ${cp.prev.slice(0, 12)}…)`);
      } else process.exitCode = 1;
    } else if (cmd === 'verify') {
      const cert = JSON.parse(fs.readFileSync(arg('cert', path.join(dir, 'cert.json')), 'utf8'));
      const r = verifyCert(cert, loadManifest(dir));
      console.log(JSON.stringify(r, null, 2));
      process.exit(r.ok ? 0 : 1);
    } else {
      console.log('usage: quorum.js genesis-signers | check-colocation | sign-detached | certify --subject H [--detached-sigs file] | certify-checkpoint | verify');
    }
  } catch (e) { console.error('ERROR:', e.message); process.exitCode = 1; }
}
module.exports = {
  genesisSigners,
  registerSignersManifest,
  signDetached,
  certify,
  certifyDetached,
  checkKeyColocation,
  verifyCert,
  anchorPayload,
  PROFILES,
};
