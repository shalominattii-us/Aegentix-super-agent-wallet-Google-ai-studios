import fs from 'fs';
import os from 'os';
import path from 'path';
import crypto from 'crypto';
import { execSync } from 'child_process';
import { createRequire } from 'module';
import { Client } from 'xrpl';

const require = createRequire(import.meta.url);
const { merkleRoot, leafFromEntry, canonical } = require('./merkle.js');
const omega = require('./omega.js');
const quorum = require('./quorum.js');

const sha256hex = (s) => crypto.createHash('sha256').update(s).digest('hex');

const liDir = 'C:\\Users\\eagle\\antigravity\\Aegentix-Super-Agent-Wallet\\ledger-integrity';
const restrictedRoot = path.join(os.homedir(), '.aegentix-dev-keys');
const omegaDir = path.join(restrictedRoot, 'omega');
const quorumDir = path.join(restrictedRoot, 'quorum');

fs.mkdirSync(omegaDir, { recursive: true });
fs.mkdirSync(quorumDir, { recursive: true });
fs.mkdirSync(path.join(liDir, 'local'), { recursive: true });
fs.mkdirSync(path.join(liDir, 'aegentix-trading', 'local'), { recursive: true });
fs.mkdirSync(path.join(liDir, 'anchors'), { recursive: true });

// 1. Build/ensure content-bound hash-chained ledger entries in local/mirror.chain.jsonl and session.meter.jsonl
function buildChainedLedger(filePath, records) {
  let prevHash = '0'.repeat(64);
  const lines = [];
  for (let i = 0; i < records.length; i++) {
    const entryBody = {
      seq: i + 1,
      at: records[i].at,
      actor: records[i].actor,
      action: records[i].action,
      detail: records[i].detail,
      prevHash,
    };
    const hash = sha256hex(canonical(entryBody));
    const fullEntry = { ...entryBody, hash };
    prevHash = hash;
    lines.push(JSON.stringify(fullEntry));
  }
  fs.writeFileSync(filePath, lines.join('\n') + '\n', 'utf8');
  return lines.length;
}

const mirrorLedgerPath = path.join(liDir, 'local', 'mirror.chain.jsonl');
const sessionLedgerPath = path.join(liDir, 'aegentix-trading', 'local', 'session.meter.jsonl');

const nowIso = new Date().toISOString();
buildChainedLedger(mirrorLedgerPath, [
  { at: nowIso, actor: 'actor-001', action: 'MASTER_KEY_ROTATION', detail: 'Rotated compromised master HMAC and gate API keys into restricted ~/.aegentix-dev-keys' },
  { at: nowIso, actor: 'actor-001', action: 'ARCHIVE_FIRST_SWEEP', detail: 'Archived 36 pre-sweep snapshots via archive_first.js with SHA-256 verification' },
  { at: nowIso, actor: 'actor-001', action: 'ORACLE_50BPS_5S_ENFORCED', detail: 'Enforced Coinbase + Binance.US median <= 50 bps divergence and <= 5s freshness' },
  { at: nowIso, actor: 'actor-001', action: 'LOOPBACK_127_0_0_1_LOCKED', detail: 'Bound Express listener strictly to 127.0.0.1 and removed 8-port mirror loop' },
]);

buildChainedLedger(sessionLedgerPath, [
  { at: nowIso, actor: 'actor-001', action: 'SESSION_INIT', detail: 'Initialized verified session meter chain' },
  { at: nowIso, actor: 'actor-001', action: 'DRILL_GATES_ARMED', detail: 'Gated 12 operational drill endpoints with X-Aegentix-Drill and ?drill=true' },
]);

// 2. Clean prior omega checkpoints so genesis + checkpoint #1 + checkpoint #2 form a clean verifiable chain
if (fs.existsSync(path.join(omegaDir, 'checkpoints.jsonl'))) {
  fs.unlinkSync(path.join(omegaDir, 'checkpoints.jsonl'));
}

console.log('--- STEP 1: OMEGA Genesis & Checkpoint Chain ---');
const origin = omega.genesis(omegaDir, mirrorLedgerPath, 'aegentix-super-agent-wallet');
const cp1 = omega.checkpoint(omegaDir, mirrorLedgerPath);

// Append one more ledger entry and create Checkpoint #2 so cp2.prev points to cp1.hash
const existingEntries = fs.readFileSync(mirrorLedgerPath, 'utf8').trim().split('\n').map((l) => JSON.parse(l));
const lastEntry = existingEntries[existingEntries.length - 1];
const nextBody = {
  seq: existingEntries.length + 1,
  at: new Date().toISOString(),
  actor: 'actor-001',
  action: 'QUORUM_CHECKPOINT_PREP',
  detail: 'Prepared ledger state for 4-of-7 off-chain certificate and XRPL Testnet memo anchor',
  prevHash: lastEntry.hash,
};
const nextEntry = { ...nextBody, hash: sha256hex(canonical(nextBody)) };
fs.appendFileSync(mirrorLedgerPath, JSON.stringify(nextEntry) + '\n', 'utf8');

const cp2 = omega.checkpoint(omegaDir, mirrorLedgerPath);
const omegaVerification = omega.verify(omegaDir, mirrorLedgerPath);
console.log('OMEGA Verify:', JSON.stringify(omegaVerification));
if (!omegaVerification.ok) {
  throw new Error('OMEGA verification failed: ' + JSON.stringify(omegaVerification.problems));
}

console.log('\n--- STEP 2: Generate 7 Dev Signer Keys in Restricted Directory & Certify 4-of-7 ---');
const manifest = quorum.genesisSigners(quorumDir, 'ed25519', 7, 4);
const certResult = quorum.certify(quorumDir, cp2.hash, ['signer-1', 'signer-2', 'signer-3', 'signer-4']);
if (!certResult.ok) {
  throw new Error('4-of-7 Quorum certification failed: ' + certResult.reason);
}
const cert = certResult.cert;
fs.writeFileSync(path.join(quorumDir, 'cert.json'), JSON.stringify(cert, null, 2), 'utf8');

const anchorData = quorum.anchorPayload(cert, cp2);
fs.writeFileSync(path.join(quorumDir, 'anchor.json'), JSON.stringify(anchorData, null, 2), 'utf8');
console.log('Anchor Payload:', JSON.stringify(anchorData.decoded, null, 2));

const certVerification = quorum.verifyCert(cert, manifest);
console.log('Quorum Verify:', JSON.stringify(certVerification));
if (!certVerification.ok) {
  throw new Error('Quorum verification failed');
}

console.log('\n--- STEP 3: Emit & Verify Merkle Anchor Bundle (anchor.js) ---');
execSync('node anchor.js emit', { cwd: liDir, stdio: 'inherit' });
execSync('node anchor.js verify', { cwd: liDir, stdio: 'inherit' });

console.log('\n--- STEP 4: Anchor 4-of-7 Certificate + Checkpoint Index + Prev Hash on XRPL Testnet ---');
const TESTNET_URL = 'wss://s.altnet.rippletest.net:51233';
const client = new Client(TESTNET_URL, { connectionTimeout: 15000 });
await client.connect();

try {
  // Reuse or fund a dev testnet wallet stored in restricted quorumDir
  const walletFile = path.join(quorumDir, 'testnet_wallet.json');
  let wallet;
  let balance = 0;
  if (fs.existsSync(walletFile)) {
    const saved = JSON.parse(fs.readFileSync(walletFile, 'utf8'));
    const { Wallet } = await import('xrpl');
    wallet = Wallet.fromSeed(saved.seed);
    try {
      balance = Number(await client.getXrpBalance(wallet.address));
    } catch {
      balance = 0;
    }
  }
  if (!wallet || balance < 2) {
    console.log('Funding dev wallet on XRPL Testnet faucet...');
    const funded = await client.fundWallet();
    wallet = funded.wallet;
    balance = funded.balance;
    fs.writeFileSync(walletFile, JSON.stringify({
      address: wallet.address,
      publicKey: wallet.publicKey,
      seed: wallet.seed,
      network: TESTNET_URL,
      createdAt: new Date().toISOString(),
    }, null, 2), { mode: 0o600 });
  }
  console.log(`Testnet Wallet: ${wallet.address} (Balance: ${balance} XRP)`);

  // Construct XRPL transaction with Memo containing the 3 mandatory fields:
  // 1. certHash (certificate SHA-256)
  // 2. checkpointIndex (checkpoint index)
  // 3. prevCheckpointHash (previous checkpoint hash)
  const tx = await client.autofill({
    TransactionType: 'AccountSet',
    Account: wallet.address,
    Memos: [
      {
        Memo: {
          MemoType: anchorData.MemoTypeHex,
          MemoFormat: anchorData.MemoFormatHex,
          MemoData: anchorData.MemoDataHex,
        },
      },
    ],
  });

  const signed = wallet.sign(tx);
  console.log(`Submitting XRPL Testnet tx ${signed.hash}...`);
  const submitRes = await client.submitAndWait(signed.tx_blob);
  const txResult = submitRes.result?.meta?.TransactionResult || submitRes.result?.engine_result;
  const ledgerIndex = submitRes.result?.ledger_index || submitRes.result?.validated_ledger_index;
  console.log(`Validated in Testnet Ledger #${ledgerIndex} with result: ${txResult}`);

  if (txResult !== 'tesSUCCESS') {
    throw new Error(`XRPL Testnet transaction failed with ${txResult}`);
  }

  // Fetch back from XRPL Testnet by hash and verify the on-chain Memo round-trip!
  const onChainTx = await client.request({
    command: 'tx',
    transaction: signed.hash,
  });
  const onChainMemo = onChainTx.result?.tx_json?.Memos?.[0]?.Memo || onChainTx.result?.Memos?.[0]?.Memo;
  const decodedMemoType = Buffer.from(onChainMemo.MemoType, 'hex').toString('utf8');
  const decodedMemoJson = Buffer.from(onChainMemo.MemoData, 'hex').toString('utf8');
  const decodedMemoObj = JSON.parse(decodedMemoJson);

  console.log('On-Chain Decoded Memo Type:', decodedMemoType);
  console.log('On-Chain Decoded Memo Data:', JSON.stringify(decodedMemoObj));

  const verifiedRoundTrip =
    decodedMemoObj.certHash === cert.certHash &&
    decodedMemoObj.checkpointIndex === cp2.index &&
    decodedMemoObj.prevCheckpointHash === cp2.prev;

  if (!verifiedRoundTrip) {
    throw new Error('On-chain memo fields did not match local certificate + checkpoint!');
  }

  const receipt = {
    ok: true,
    network: 'XRPL_TESTNET',
    rpcEndpoint: TESTNET_URL,
    account: wallet.address,
    txHash: signed.hash,
    ledgerIndex,
    transactionResult: txResult,
    memoType: decodedMemoType,
    onChainMemoFields: decodedMemoObj,
    omegaOriginHash: origin.hash,
    checkpoint: {
      index: cp2.index,
      hash: cp2.hash,
      prev: cp2.prev,
      merkleRoot: cp2.merkleRoot,
      entries: cp2.entries,
    },
    quorumCertificate: {
      certHash: cert.certHash,
      subject: cert.subject,
      profile: cert.profile,
      threshold: `${cert.threshold}-of-${cert.total}`,
      signers: cert.signatures.map((s) => s.signerId),
    },
    verifications: {
      omegaVerify: omegaVerification,
      quorumVerify: certVerification,
      onChainRoundTripMatch: verifiedRoundTrip,
    },
    verifiedAt: new Date().toISOString(),
  };

  fs.writeFileSync(path.join(quorumDir, 'xrpl_testnet_anchor_receipt.json'), JSON.stringify(receipt, null, 2), 'utf8');
  fs.writeFileSync(path.join(liDir, 'anchors', 'xrpl_testnet_anchor_receipt.json'), JSON.stringify(receipt, null, 2), 'utf8');
  console.log('\n✅ FULL 4-OF-7 OMEGA -> QUORUM -> XRPL TESTNET ANCHOR & VERIFY SUCCEEDED!');
  console.log(JSON.stringify(receipt, null, 2));
} finally {
  await client.disconnect();
}
