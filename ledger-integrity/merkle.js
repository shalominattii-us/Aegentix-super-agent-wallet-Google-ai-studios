/**
 * MERKLE ANCHOR for the hash-chained ledger.
 *
 * The chain proves order and tamper-evidence link by link.
 * The Merkle root collapses every entry into ONE 32-byte fingerprint.
 * That root is what you anchor publicly: post it in a transaction memo, publish it
 * in /mirror/proof, or timestamp it anywhere. Anyone holding the ledger can then
 * prove any single entry belongs to that root without trusting you.
 *
 * Leaf  = sha256(entry.hash)        (entry.hash is the chain link)
 * Node  = sha256(left || right)     (right = left when a level is odd)
 */
const crypto = require('crypto');
const fs = require('fs');

const sha256 = (buf) => crypto.createHash('sha256').update(buf).digest();
const leafHash = (entryHashHex) => sha256(Buffer.from(entryHashHex, 'utf8'));

function merkleRoot(leafHashes) {
  if (!leafHashes.length) return null;
  let level = leafHashes.map((h) => (Buffer.isBuffer(h) ? h : Buffer.from(h, 'hex')));
  while (level.length > 1) {
    const next = [];
    for (let i = 0; i < level.length; i += 2) {
      const a = level[i];
      const b = level[i + 1] || level[i];
      next.push(sha256(Buffer.concat([a, b])));
    }
    level = next;
  }
  return level[0].toString('hex');
}

function merkleProof(leafHashes, index) {
  if (!leafHashes.length) throw new Error('no leaves');
  let level = leafHashes.map((h) => (Buffer.isBuffer(h) ? h : Buffer.from(h, 'hex')));
  let idx = index;
  if (idx < 0 || idx >= level.length) throw new Error('index out of range');
  const path = [];
  while (level.length > 1) {
    const sibIdx = idx % 2 === 0 ? idx + 1 : idx - 1;
    const sibling = level[sibIdx] || level[idx];
    path.push({ sibling: sibling.toString('hex'), side: idx % 2 === 0 ? 'right' : 'left' });
    const next = [];
    for (let i = 0; i < level.length; i += 2) {
      const a = level[i];
      const b = level[i + 1] || level[i];
      next.push(sha256(Buffer.concat([a, b])));
    }
    level = next;
    idx = Math.floor(idx / 2);
  }
  return path;
}

function verifyProof(leafHashHex, path, expectedRoot) {
  let acc = Buffer.from(leafHashHex, 'hex');
  for (const step of path) {
    const sib = Buffer.from(step.sibling, 'hex');
    acc = step.side === 'right' ? sha256(Buffer.concat([acc, sib])) : sha256(Buffer.concat([sib, acc]));
  }
  return acc.toString('hex') === expectedRoot;
}

function readLedger(pathToLedger) {
  if (!fs.existsSync(pathToLedger)) return [];
  return fs.readFileSync(pathToLedger, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
}

if (require.main === module) {
  const [cmd, arg1, arg2] = process.argv.slice(2);
  const file = arg2 && arg2.startsWith('--file=') ? arg2.split('=')[1] : (process.env.LEDGER || 'aegentix-trading/local/ledger.chain.jsonl');
  const entries = readLedger(file);
  const leaves = entries.map((e) => leafHash(e.hash));
  if (cmd === 'root') {
    console.log(JSON.stringify({ file, entries: entries.length, merkleRoot: merkleRoot(leaves) }, null, 2));
  } else if (cmd === 'proof') {
    const i = parseInt(arg1 || '0', 10);
    const root = merkleRoot(leaves);
    const path = merkleProof(leaves, i);
    const ok = verifyProof(leaves[i], path, root);
    console.log(JSON.stringify({ index: i, entryHash: entries[i].hash, root, pathLength: path.length, proof: path, verifiesAgainstRoot: ok }, null, 2));
  } else {
    console.log('usage: node merkle.js root [--file=path] | node merkle.js proof <index> [--file=path]');
  }
}

function canonical(o) {
  const sort = (v) => Array.isArray(v) ? v.map(sort)
    : (v && typeof v === 'object' ? Object.keys(v).sort().reduce((a, k) => ((a[k] = sort(v[k])), a), {}) : v);
  return JSON.stringify(sort(o));
}

/**
 * Leaf bound to CONTENT, not to the entry's self-declared hash.
 * Without this, editing a committed record leaves the root unchanged.
 */
function leafFromEntry(entry) {
  const { hash, signature, ...rest } = entry;
  return sha256(Buffer.from(canonical(rest))).toString('hex');
}

module.exports = { merkleRoot, merkleProof, verifyProof, leafHash };

module.exports.leafFromEntry = leafFromEntry;
module.exports.canonical = canonical;
