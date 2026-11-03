/**
 * ARCHIVE-FIRST — nothing is ever deleted.
 *
 * Owner rule: any file leaving a repo or system is MOVED into its own archive
 * with a manifest entry (original path, hash, size, reason, timestamp), so it can
 * always be restored.
 *
 * HONEST DESCRIPTION: this is a MOVE, not a copy. archiveOne() copies the file,
 * verifies the copy's hash, then calls fs.unlinkSync(srcPath) on the original.
 * So the source path is GONE from the working tree after archiving — that is the
 * point of "archive before delete". Consequence: you cannot archive a live file
 * you still need (e.g. server.ts) and expect it to keep running. Snapshot first,
 * then archive the snapshot. There is no --force.
 *
 *   node archive_first.js list                                  # show archive contents
 *   node archive_first.js move <path> --reason "why"            # archive one file
 *   node archive_first.js move-batch <file-with-paths> --reason "why"
 *   node archive_first.js restore <archiveId> [--to <dir>]      # put it back
 *   node archive_first.js verify                                # check hashes still match
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = process.env.AEGENTIX_ARCHIVE_DIR || path.join(__dirname, 'archive');
const MANIFEST = path.join(ROOT, 'manifest.json');

function loadManifest() {
  if (!fs.existsSync(MANIFEST)) return { created: new Date().toISOString(), entries: [] };
  return JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
}
function saveManifest(m) {
  fs.mkdirSync(ROOT, { recursive: true, mode: 0o700 });
  fs.writeFileSync(MANIFEST, JSON.stringify(m, null, 2), { mode: 0o600 });
}
function sha256(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

function archiveOne(srcPath, reason) {
  if (!fs.existsSync(srcPath)) return console.error('not found:', srcPath);
  const stat = fs.statSync(srcPath);
  if (stat.isDirectory()) return console.error('directories must be archived file-by-file:', srcPath);

  const m = loadManifest();
  const id = `ARC-${Date.now()}-${m.entries.length}`;
  const rel = path.resolve(srcPath).replace(/^([A-Za-z]):/, '$1').replace(/^[\/\\]+/, '');
  const dest = path.join(ROOT, 'files', id, path.basename(srcPath));

  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const hash = sha256(srcPath);
  fs.copyFileSync(srcPath, dest);
  // verify the copy before anything else happens to the original
  if (sha256(dest) !== hash) return console.error('COPY FAILED VERIFICATION — original left untouched');

  m.entries.push({
    id, originalPath: path.resolve(srcPath), archivedPath: dest,
    bytes: stat.size, sha256: hash, reason, at: new Date().toISOString(), restored: false,
  });
  saveManifest(m);

  // Only after a verified copy exists do we remove the original.
  fs.unlinkSync(srcPath);
  console.log(`archived ${srcPath} -> ${dest}`);
  console.log(`  id ${id} | ${stat.size} bytes | sha256 ${hash.slice(0, 16)}…`);
  console.log(`  restore: node archive_first.js restore ${id}`);
  return id;
}

function list() {
  const m = loadManifest();
  if (!m.entries.length) return console.log('archive is empty');
  console.log(`\n=== ARCHIVE (${m.entries.length} entries) ===\n`);
  for (const e of m.entries) {
    console.log(`${e.id}  ${(e.bytes / 1048576).toFixed(2)} MB  ${e.restored ? '[restored]' : ''}`);
    console.log(`   from: ${e.originalPath}`);
    console.log(`   why : ${e.reason}`);
    console.log(`   at  : ${e.at}\n`);
  }
}

function restore(id, to) {
  const m = loadManifest();
  const e = m.entries.find(x => x.id === id);
  if (!e) return console.error('no such archive entry:', id);
  if (!fs.existsSync(e.archivedPath)) return console.error('archived copy missing:', e.archivedPath);
  const target = to ? path.join(to, path.basename(e.originalPath)) : e.originalPath;
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(e.archivedPath, target);
  if (sha256(target) !== e.sha256) return console.error('restored file hash mismatch — investigate');
  e.restored = true; e.restoredAt = new Date().toISOString(); e.restoredTo = target;
  saveManifest(m);
  console.log('restored ->', target, '(hash verified)');
}

function verify() {
  const m = loadManifest();
  let bad = 0;
  for (const e of m.entries) {
    if (!fs.existsSync(e.archivedPath)) { console.log('MISSING', e.id, e.archivedPath); bad++; continue; }
    if (sha256(e.archivedPath) !== e.sha256) { console.log('ALTERED', e.id, e.archivedPath); bad++; }
  }
  console.log(bad === 0 ? `all ${m.entries.length} archived files verified intact` : `${bad} problem(s) found`);
}

module.exports = { archiveOne, restore, verify, loadManifest };

const [cmd, ...rest] = process.argv.slice(2);
const reasonIdx = rest.indexOf('--reason');
const reason = reasonIdx >= 0 ? rest[reasonIdx + 1] : 'unspecified';
const toIdx = rest.indexOf('--to');
if (cmd === 'move') archiveOne(rest[0], reason);
else if (cmd === 'move-batch') {
  const listFile = rest[0];
  if (!fs.existsSync(listFile)) console.error('list file not found:', listFile);
  else fs.readFileSync(listFile, 'utf8').split('\n').map(l => l.trim()).filter(Boolean).forEach(p => archiveOne(p, reason));
}
else if (cmd === 'list') list();
else if (cmd === 'restore') restore(rest[0], toIdx >= 0 ? rest[toIdx + 1] : null);
else if (cmd === 'verify') verify();
else console.log('commands: move <path> --reason "..." | move-batch <listfile> | list | restore <id> [--to dir] | verify');
