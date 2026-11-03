/**
 * ANCHOR — rolls the chain into a Merkle root and emits a publishable bundle.
 * The bundle is what you post in a tx memo or serve from /mirror/proof.
 * Anyone with the ledger can rebuild the root and match it.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { merkleRoot, leafHash } = require('./merkle.js');

const sha256hex = (s) => crypto.createHash('sha256').update(s).digest('hex');

function loadEntries(file) {
  if (!fs.existsSync(file)) return [];
  return fs.readFileSync(file, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
}

function anchor(file, label) {
  const entries = loadEntries(file);
  const leaves = entries.map((e) => require('./merkle.js').leafFromEntry(e));
  const root = merkleRoot(leaves);
  const head = entries.length ? entries[entries.length - 1].hash : null;
  const bundle = {
    label,
    ledgerFile: file,
    entries: entries.length,
    firstEntryAt: entries.length ? entries[0].at : null,
    lastEntryAt: entries.length ? entries[entries.length - 1].at : null,
    chainHead: head,
    merkleRoot: root,
    computedAt: new Date().toISOString(),
  };
  bundle.bundleHash = sha256hex(JSON.stringify(bundle));
  return bundle;
}

if (require.main === module) {
  const cmd = process.argv[2] || 'emit';
  const targets = [
    ['aegentix-trading/local/session.meter.jsonl', 'session-meter'],
    ['local/mirror.chain.jsonl', 'machine-mirror'],
  ];

  if (cmd === 'emit') {
    const bundles = targets.map(([f, l]) => anchor(f, l));
    const out = { generatedAt: new Date().toISOString(), anchors: bundles };
    const file = `anchors/anchor-${Date.now()}.json`;
    fs.writeFileSync(file, JSON.stringify(out, null, 2));
    for (const b of bundles) {
      console.log(`${b.label.padEnd(16)} entries ${String(b.entries).padStart(4)}  root ${b.merkleRoot || '(empty)'}`);
    }
    console.log(`\nwritten: ${file}`);
    console.log(`publish this one line:  merkleRoot=${bundles.map((b) => b.merkleRoot).join(' ')}`);
  } else if (cmd === 'verify') {
    const files = fs.readdirSync('anchors').filter((f) => f.startsWith('anchor-')).sort();
    const latest = files.pop();
    if (!latest) return console.log('no anchor found');
    const saved = JSON.parse(fs.readFileSync(path.join('anchors', latest), 'utf8'));
    let worst = 'MATCH';
    console.log(`verifying against ${latest}\n`);
    for (const b of saved.anchors) {
      const entries = loadEntries(b.ledgerFile);
      const now = entries.length;
      // THE REAL CHECK: re-derive the root over exactly the prefix the anchor committed to.
      const prefixLeaves = entries.slice(0, b.entries).map((e) => require('./merkle.js').leafFromEntry(e));
      const prefixRoot = merkleRoot(prefixLeaves);
      let status;
      if (now < b.entries) status = 'TRUNCATED — entries deleted since anchor';
      else if (prefixRoot !== b.merkleRoot) status = 'MISMATCH — committed history was rewritten';
      else if (now > b.entries) status = 'GREW — prefix intact, ledger added ' + (now - b.entries) + ' entries';
      else status = 'MATCH';
      if (status.startsWith('MISMATCH') || status.startsWith('TRUNCATED')) worst = 'TAMPERED';
      console.log(`${b.label.padEnd(16)} anchored ${String(b.entries).padStart(4)} -> now ${String(now).padStart(4)} | ${status}`);
      if (prefixRoot !== b.merkleRoot && now >= b.entries) {
        console.log(`${''.padEnd(16)}   committed root ${b.merkleRoot.slice(0,16)}…  recomputed ${prefixRoot.slice(0,16)}…`);
      }
    }
    console.log(`\nverdict: ${worst === 'MATCH' ? 'CONSISTENT' : 'TAMPERED — investigate'}`);
    process.exit(worst === 'MATCH' ? 0 : 1);
  } else {
    console.log('usage: node anchor.js emit | node anchor.js verify');
  }
}

module.exports = { anchor };
