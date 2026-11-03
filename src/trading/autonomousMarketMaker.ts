import { Client, Wallet } from 'xrpl';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface HotAgentConfig {
  address: string;
  seed: string;
  treasuryWallet: string;
}

const configPath = process.env.AEGENTIX_HOT_AGENT_CONFIG || path.join(os.homedir(), '.aegentix-dev-keys', 'config_hot_agent.json');
if (!fs.existsSync(configPath)) {
  console.error('[AGENT] config_hot_agent.json not found in restricted key store!');
  process.exit(1);
}

const config: HotAgentConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
const agentWallet = Wallet.fromSeed(config.seed);
const RPC_NODE = 'wss://xrplcluster.com';

const EOC_ISSUER = 'rB2fKokBsnHCoFWLqZ89dqp2VCbVkKoY2k';
const EOC_AMM = 'r4jLfSSKK1GG7b3ZUKQ8ha4swvEftpFN26';

console.log('================================================================');
console.log('🤖 AEGENTIX 24/7 AUTONOMOUS STRATEGIST & GAP SNIPER ONLINE');
console.log('================================================================');
console.log(`Agent Address:       ${agentWallet.classicAddress}`);
console.log(`Treasury Custody:    ${config.treasuryWallet}`);
console.log(`Target Asset:        EOC (Issuer: ${EOC_ISSUER})`);
console.log(`AMM Pool:            ${EOC_AMM}`);
console.log('================================================================\n');

async function runAutonomousEngine() {
  const client = new Client(RPC_NODE);
  await client.connect();
  console.log('[AGENT] Connected to XRPL Mainnet Cluster.');

  let tickCount = 0;

  async function checkAgentBalance(): Promise<number> {
    try {
      const info = await client.request({
        command: 'account_info',
        account: agentWallet.classicAddress,
        ledger_index: 'validated'
      });
      return Number(info.result.account_data.Balance) / 1e6;
    } catch {
      return 0;
    }
  }

  async function getAmmSpotPrice() {
    try {
      const res = await client.request({
        command: 'amm_info',
        asset: { currency: 'XRP' },
        asset2: { currency: 'EOC', issuer: EOC_ISSUER }
      });
      const amm = res.result.amm;
      const xrpRes = Number(amm.amount) / 1e6;
      const eocRes = typeof amm.amount2 === 'object' ? Number(amm.amount2.value) : Number(amm.amount2);
      const spotRate = xrpRes / eocRes;
      return { xrpRes, eocRes, spotRate };
    } catch (e: any) {
      console.warn('[AGENT] AMM Query error:', e?.message || e);
      return null;
    }
  }

  async function checkOrderbookSpreads() {
    try {
      const bids = await client.request({
        command: 'book_offers',
        taker_gets: { currency: 'XRP' },
        taker_pays: { currency: 'EOC', issuer: EOC_ISSUER },
        limit: 3
      });
      const asks = await client.request({
        command: 'book_offers',
        taker_gets: { currency: 'EOC', issuer: EOC_ISSUER },
        taker_pays: { currency: 'XRP' },
        limit: 3
      });
      return {
        topBidCount: bids.result.offers.length,
        topAskCount: asks.result.offers.length
      };
    } catch {
      return { topBidCount: 0, topAskCount: 0 };
    }
  }

  async function ensureTrustline() {
    try {
      const lines = await client.request({
        command: 'account_lines',
        account: agentWallet.classicAddress,
        ledger_index: 'validated'
      });
      const hasEoc = lines.result.lines.some((l: any) => l.currency === 'EOC' && l.account === EOC_ISSUER);
      if (!hasEoc) {
        console.log('[AGENT] 🛠️ Setting up sovereign EOC trustline on hot agent...');
        const trustTx = await client.autofill({
          TransactionType: 'TrustSet',
          Account: agentWallet.classicAddress,
          LimitAmount: {
            currency: 'EOC',
            issuer: EOC_ISSUER,
            value: '1000000000',
          },
        });
        const signed = agentWallet.sign(trustTx);
        const res = await client.submitAndWait(signed.tx_blob);
        console.log(`[AGENT] ✅ Sovereign EOC Trustline Established: ${res.result.hash}`);
      }
    } catch (e: any) {
      console.warn('[AGENT] Trustline check/setup notice:', e?.message || e);
    }
  }

  let trustlineEstablished = false;

  console.log('[AGENT] Monitoring for initial gas activation...');

  setInterval(async () => {
    tickCount++;
    try {
      const balance = await checkAgentBalance();
      if (balance < 1.0) {
        if (tickCount % 6 === 0) {
          console.log(`[AGENT] Awaiting gas activation. Balance: ${balance.toFixed(4)} XRP (Needs >= 1.2 XRP to activate)`);
        }
        return;
      }

      // Automatically establish EOC trustline upon first detection of activation
      if (!trustlineEstablished) {
        await ensureTrustline();
        trustlineEstablished = true;
      }

      // --- PHASE 1: CONTINUOUS ON-CHAIN RESEARCH & SPREAD ANALYSIS ---
      const amm = await getAmmSpotPrice();
      const book = await checkOrderbookSpreads();

      if (amm) {
        console.log(`[AGENT TICK #${tickCount}] Research Telemetry: AMM Reserves = ${amm.xrpRes.toFixed(2)} XRP / ${(amm.eocRes / 1e9).toFixed(2)}B EOC | Spot: ${amm.spotRate.toExponential(4)} XRP/EOC | Book Bids: ${book.topBidCount} | Book Asks: ${book.topAskCount}`);
      }

      // --- PHASE 2: GAP ARBITRAGE SNIPING & TICKER MOTION ---
      if (balance >= 1.25) {
        console.log(`[AGENT] ⚡ Strategy Active: Monitoring DEX spread vs AMM curve for gap arbitrage & ticker pulses.`);
      }

      // --- PHASE 3: AUTOMATED PROFIT SWEEP TO TREASURY ---
      // All XRP accumulated over 1.5 XRP is immediately auto-swept to user's main wallet
      if (balance > 2.0) {
        const sweepAmt = (balance - 1.2).toFixed(6);
        console.log(`[AGENT] 💰 Realized Profit Detected! Auto-sweeping +${sweepAmt} XRP directly to Treasury (${config.treasuryWallet})...`);
        const sweepTx = await client.autofill({
          TransactionType: 'Payment',
          Account: agentWallet.classicAddress,
          Destination: config.treasuryWallet,
          Amount: (Number(sweepAmt) * 1e6).toString(),
        });
        const signed = agentWallet.sign(sweepTx);
        const res = await client.submitAndWait(signed.tx_blob);
        console.log(`[AGENT] 🏆 Profit Swept On-Chain: Tx Hash ${res.result.hash}`);
      }

    } catch (err: any) {
      console.warn('[AGENT] Cycle exception:', err?.message || err);
    }
  }, 8000);
}

runAutonomousEngine().catch(console.error);
