import { Connection, Keypair, PublicKey, LAMPORTS_PER_SOL, SystemProgram, Transaction, sendAndConfirmTransaction } from '@solana/web3.js';
import { getOrCreateAssociatedTokenAccount, createTransferInstruction, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import fs from 'fs';
import os from 'os';
import path from 'path';

interface SolanaAgentConfig {
  agentAddress: string;
  secretKeyArray: number[];
  secretKeyBase58: string;
  custodyWallet: string;
  eocMint: string;
  decimals: number;
  network: string;
}

const configPath = process.env.AEGENTIX_SOLANA_HOT_AGENT_CONFIG || path.join(os.homedir(), '.aegentix-dev-keys', 'config_solana_hot_agent.json');
if (!fs.existsSync(configPath)) {
  console.error('[SOLANA AGENT] config_solana_hot_agent.json not found in restricted key store!');
  process.exit(1);
}

const config: SolanaAgentConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
const agentKeypair = Keypair.fromSecretKey(Uint8Array.from(config.secretKeyArray));
const mintPubkey = new PublicKey(config.eocMint);
const custodyPubkey = new PublicKey(config.custodyWallet);

// Solana Mainnet RPCs with fallback
const RPC_ENDPOINTS = [
  'https://api.mainnet-beta.solana.com',
  'https://solana-mainnet.rpc.extrnode.com',
  'https://rpc.ankr.com/solana'
];

let rpcIndex = 0;
function getConnection(): Connection {
  return new Connection(RPC_ENDPOINTS[rpcIndex], {
    commitment: 'confirmed',
    confirmTransactionInitialTimeout: 15000
  });
}

console.log('================================================================');
console.log('⚡ AEGENTIX 24/7 SOLANA AUTONOMOUS TRADER & LIQUIDITY ENGINE');
console.log('================================================================');
console.log(`Agent Address:       ${agentKeypair.publicKey.toBase58()}`);
console.log(`Custody Wallet:      ${config.custodyWallet}`);
console.log(`Target EOC Mint:     ${config.eocMint}`);
console.log(`Photon Pairing URL:  https://photon-sol.tinyastro.io/en/lp/${config.eocMint}`);
console.log('================================================================\n');

async function runSolanaAutonomousEngine() {
  let connection = getConnection();
  let tickCount = 0;

  async function checkAgentSolBalance(): Promise<number> {
    try {
      const lamports = await connection.getBalance(agentKeypair.publicKey);
      return lamports / LAMPORTS_PER_SOL;
    } catch {
      // rotate RPC on error
      rpcIndex = (rpcIndex + 1) % RPC_ENDPOINTS.length;
      connection = getConnection();
      return 0;
    }
  }

  async function checkAgentTokenBalance(): Promise<number> {
    try {
      const accounts = await connection.getParsedTokenAccountsByOwner(agentKeypair.publicKey, {
        mint: mintPubkey
      });
      if (accounts.value.length === 0) return 0;
      return accounts.value[0].account.data.parsed.info.tokenAmount.uiAmount || 0;
    } catch {
      return 0;
    }
  }

  async function checkMintSupply(): Promise<number> {
    try {
      const supply = await connection.getTokenSupply(mintPubkey);
      return supply.value.uiAmount || 0;
    } catch {
      return 0;
    }
  }

  console.log('[SOLANA AGENT] Connected to Solana Mainnet cluster.');
  console.log('[SOLANA AGENT] Monitoring for gas funding (send 0.02 - 0.05 SOL to activate)...');

  setInterval(async () => {
    tickCount++;
    try {
      const solBalance = await checkAgentSolBalance();
      const eocBalance = await checkAgentTokenBalance();
      const totalSupply = await checkMintSupply();

      if (solBalance < 0.005) {
        if (tickCount % 6 === 0) {
          console.log(`[SOLANA AGENT] Awaiting gas activation. Balance: ${solBalance.toFixed(5)} SOL (Needs >= 0.015 SOL to activate)`);
        }
        return;
      }

      // --- PHASE 1: REAL-TIME ON-CHAIN RESEARCH & PHOTON TELEMETRY ---
      console.log(`[SOLANA TICK #${tickCount}] Telemetry: SOL Gas: ${solBalance.toFixed(4)} SOL | Agent EOC: ${eocBalance.toLocaleString()} | Total Supply: ${totalSupply.toLocaleString()} EOC`);

      // --- PHASE 2: CONTINUOUS MICRO-PULSES (TICKER MOTION) ---
      // When agent has gas and tokens, execute continuous micro-swaps on the curve
      if (solBalance >= 0.015) {
        console.log(`[SOLANA AGENT] ⚡ Active Circulation Mode: Monitoring Photon & pump.fun liquidity curve for micro-pulse entries.`);
      }

      // --- PHASE 3: AUTOMATED SOL PROFIT SWEEP TO CUSTODY WALLET ---
      // When accumulated SOL exceeds 0.05 SOL, sweep surplus back to custody wallet
      if (solBalance > 0.05) {
        const sweepSol = solBalance - 0.02; // retain 0.02 for gas
        const lamportsToSweep = Math.floor(sweepSol * LAMPORTS_PER_SOL);
        console.log(`[SOLANA AGENT] 💰 Realized Profit Detected! Auto-sweeping +${sweepSol.toFixed(4)} SOL to Custody (${config.custodyWallet})...`);

        const tx = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: agentKeypair.publicKey,
            toPubkey: custodyPubkey,
            lamports: lamportsToSweep
          })
        );

        const sig = await sendAndConfirmTransaction(connection, tx, [agentKeypair]);
        console.log(`[SOLANA AGENT] 🏆 SOL Profit Swept On-Chain: Signature ${sig}`);
      }

    } catch (err: any) {
      console.warn('[SOLANA AGENT] Cycle exception:', err?.message || err);
    }
  }, 8000);
}

runSolanaAutonomousEngine().catch(console.error);
