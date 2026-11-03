# Aegentix Ledger Integrity Bundle

Five files, no dependencies, Node 18+. Everything runs on local disk.

| File | Purpose |
|---|---|
| `merkle.js` | Merkle tree over ledger entries. Content-bound leaves. |
| `omega.js` | ORIGIN commitment + signed checkpoint chain (ed25519). |
| `quorum.js` | 4-of-7 threshold certificates over checkpoint roots. |
| `anchor.js` | Anchor bundle emitter (root + counts + bundleHash). |
| `archive_first.js` | Move-to-archive with manifest. Removes the source after a verified copy. |

## Critical: leaves are content-bound

`merkle.js` exports `leafFromEntry(entry)`, which hashes the entry **excluding its
self-declared `hash` field**. This is not a detail. The first version hashed the
declared hash, and an edited record produced an unchanged Merkle root. Verified
failure mode, then fixed. Do not "optimize" this back.

## Order of integration

1. `archive_first.js` first — the server.ts sweep needs it before anything is removed.
2. `merkle.js` + `omega.js` — checkpoint your existing ledger as-is to establish origin.
3. `quorum.js` — certify checkpoints with 4-of-7.
4. `anchor.js` — emit roots for publication.

## archive_first.js — the manifest format you were looking for

    node archive_first.js move <path> --reason "why"
    node archive_first.js move-batch <file-of-paths> --reason "why"
    node archive_first.js restore <archiveId> [--to <dir>]
    node archive_first.js list

Manifest lives at `./archive/manifest.json`. Each entry:

    { id, originalPath, archivedPath, bytes, sha256, reason, at, restored }

**Move semantics, stated plainly.** `archiveOne()` calls `copyFileSync`, verifies
`sha256(dest) !== hash` (aborting with the original untouched if it fails), then
calls `fs.unlinkSync(srcPath)` on the original. So the source path is gone from
the working tree once archived — that is the intended "archive before delete"
behavior, not a bug. There is no `--force` and no bulk wipe.

Consequence for the server.ts sweep: you cannot archive a live file and expect it
to keep serving. Snapshot first, archive the snapshot, then remove the relevant
route from the working file. That is the correct pattern and the one in use.

## anchor.js verify — why it now checks the prefix

The first version reported CONSISTENT whenever the entry count had merely grown,
which meant an edit to committed history passed as long as anything was appended
afterwards. That was wrong. It now re-derives a Merkle root over exactly the
prefix the anchor committed to and compares:

    now < anchored        -> TRUNCATED
    prefix root != anchor -> MISMATCH  (committed history rewritten)
    now > anchored        -> GREW      (prefix intact)
    equal                 -> MATCH

`omega.js` goes further because each checkpoint is signed and carries the entry
count at signing time. Use anchor verify for a quick batch check; use omega
verify when the answer has to be defensible.

## Wiring quorum into trader_gate.js

Current gate: agent proposes, owner approves (2-of-2). To make it a real quorum:

    const { certify, verifyCert } = require('./quorum.js');

    // after the batch is assembled, before marking approved:
    const subject = batchDigest;              // sha256 of the batch body
    const result = certify(GATE_DIR, subject, ['signer-1','signer-2','signer-3','signer-4']);
    if (!result.ok) throw new Error('quorum not met: ' + result.reason);
    batch.quorumCert = result.cert;           // persist alongside approvedBy

Keep the existing owner approval. Quorum is additive — it does not replace
human authorization.

## Dilithium (ML-DSA) profile

`quorum.js` has two profiles. `ed25519` works now. `dilithium` is wired through
the identical interface (`keygen` / `sign` / `verify`) but declares
`available: false` and throws rather than silently downgrading.

To enable:

    npm install @noble/post-quantum

Then in the `dilithium` profile:

    const { ml_dsa65 } = require('@noble/post-quantum/ml-dsa');
    keygen() {
      const seed = crypto.randomBytes(32);
      const kp = ml_dsa65.keygen(seed);
      return { priv: Buffer.from(kp.secretKey).toString('base64'),
               pub:  Buffer.from(kp.publicKey).toString('base64') };
    }

Set `available: true` only after a round-trip test passes: keygen → sign →
verify → tampered message must fail.

## What can never be on-chain

XRPL verifies secp256k1 and ed25519 only. A 4-of-7 ML-DSA certificate cannot be
validated by the ledger. The certificate is verified off-chain; only its
SHA-256 is anchored in a memo, together with the checkpoint index and the prior
checkpoint hash. Anchoring a hash you cannot verify on-chain is still worth it:
it timestamps the commitment and makes backdating detectable.

## Verified test results (this build)

| Case | Result |
|---|---|
| 4 of 7 signers | ok, good=4 |
| 3 of 7 signers | rejected: below threshold |
| duplicate signer | deduped 4->3, then rejected |
| flipped signature byte | rejected: content altered |
| edited committed ledger entry | rejected: prefix does not match root |
| anchor verify, clean ledger | CONSISTENT (MATCH) |
| anchor verify, appended entry | CONSISTENT (GREW, prefix intact) |
| anchor verify, old entry edited after growth | TAMPERED (MISMATCH) |
| anchor verify, committed entries deleted | TAMPERED (TRUNCATED) |
| deleted committed entry | rejected: ledger shorter than checkpoint |
| dilithium profile requested | refused honestly |

## Before mainnet

- Regenerate all seven keys on the target device. Test keys are sandbox-only.
- Do not keep 4-of-7 on one disk. Four keys on one machine is a quorum in name only.
- Bind services to 127.0.0.1. `server.ts` currently binds `::` (all interfaces).
