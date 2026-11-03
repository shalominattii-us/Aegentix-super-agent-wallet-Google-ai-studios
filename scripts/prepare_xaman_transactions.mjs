import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

async function prepareXamanTransactions() {
  console.log('=== PREPARING XAMAN (ZAMAN) XRPL REVENUE TRANSACTIONS ===\n');

  const BASE_URL = 'http://127.0.0.1:3000';
  const strategies = [
    {
      id: 'EOC_CIRCULATION',
      name: '1. EOC Public Circulation Ladder',
      badge: 'TOP PRIORITY — EOC CIRCULATION',
      desc: 'Places 50,000 Sovereign EOC on XRPL decentralized orderbook. 100% of proceeds (5.0 XRP) store directly in wallet.',
      projectedReturn: '+5.00 XRP Instant',
    },
    {
      id: 'AMM_YIELD',
      name: '2. EOC / XRP Native AMM Pool Seed',
      badge: 'XLS-30 LIQUIDITY YIELD',
      desc: 'Deposits 50,000 EOC into verified live AMM pool (r4jLfSSKK1GG7b3ZUKQ8ha4swvEftpFN26) to earn 16.8% APR fee yield in XRP.',
      projectedReturn: '16.8% APR Continuous Yield',
    },
    {
      id: 'RESERVE_HARVEST',
      name: '3. Dormant Trustline Reserve Reclaim',
      badge: 'CAPITAL RECOVERY',
      desc: 'Sets limit to 0 for dormant zero-balance trustlines, instantly unlocking +0.60 XRP from ledger reserves to spendable balance.',
      projectedReturn: '+0.60 XRP Unlocked Instantly',
    },
    {
      id: 'TOKEN_SWEEP',
      name: '4. Multi-Token Profit Sweep to XRP',
      badge: 'PORTFOLIO ARBITRAGE SWEEP',
      desc: 'Liquidates verified surplus tokens (APL, LOAN, XRPALPHA) through their AMM pools, converting 100% of realized value to XRP.',
      projectedReturn: 'Continuous Multi-Token Sweep',
    }
  ];

  const generatedPayloads = [];

  for (const s of strategies) {
    try {
      const res = await fetch(`${BASE_URL}/api/xaman/create-payload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ strategy: s.id })
      });
      const data = await res.json();
      if (data.success && data.payload) {
        console.log(`✅ [${s.id}] Payload Ready: ${data.payload.payloadId}`);
        console.log(`   Title:     ${data.payload.title}`);
        console.log(`   TxType:    ${data.payload.txJson?.TransactionType}`);
        console.log(`   Deep Link: ${data.payload.xamanDeepLink}`);
        generatedPayloads.push({
          ...s,
          ...data.payload
        });
      } else {
        console.error(`❌ [${s.id}] Failed:`, data.error);
      }
    } catch (e) {
      console.error(`❌ [${s.id}] Request error:`, e.message);
    }
  }

  // Build a dedicated, ultra-clean HTML visualizer: public/xaman-hub.html
  const html = `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Xaman (Zaman) XRPL Transaction Command Center</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Plus+Jakarta+Sans:wght@500;700;800&display=swap');
    body { font-family: 'Plus Jakarta Sans', sans-serif; background: #06090e; color: #e2e8f0; }
    .mono { font-family: 'JetBrains Mono', monospace; }
  </style>
</head>
<body class="min-h-screen p-4 md:p-8">
  <div class="max-w-6xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 border border-purple-500/30 shadow-2xl">
      <div>
        <div class="flex items-center gap-3">
          <span class="px-3 py-1 rounded-full text-xs font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-400/40">
            SOVEREIGN XRPL GATEWAY
          </span>
          <span class="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
            TREASURY MANDATE: ALL PROFITS TO XRP
          </span>
        </div>
        <h1 class="text-2xl md:text-3xl font-extrabold text-white mt-2">
          Xaman (Zaman) Transaction Command Center
        </h1>
        <p class="text-sm text-slate-300 mt-1">
          Scan QR codes below using the <span class="text-purple-300 font-semibold">Xaman (Xumm)</span> app on your phone to sign and broadcast.
        </p>
      </div>
      <div class="p-4 rounded-xl bg-slate-950/90 border border-slate-800 text-right mono text-xs">
        <div class="text-slate-400">Target Wallet</div>
        <div class="text-cyan-300 font-bold">rwB7JKKc5gJ47pPnWCFvQuhVW85mejYF1M</div>
        <div class="text-emerald-400 font-semibold mt-1">4 Active Live Transactions Prepared</div>
      </div>
    </div>

    <!-- Payload Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      ${generatedPayloads.map(p => `
        <div class="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/50 transition-all shadow-xl flex flex-col justify-between">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-600/40">
                ${p.badge}
              </span>
              <span class="text-emerald-400 font-mono font-bold text-xs">${p.projectedReturn}</span>
            </div>

            <div>
              <h2 class="text-lg font-bold text-white">${p.name}</h2>
              <p class="text-xs text-slate-300 mt-1 leading-relaxed">${p.desc}</p>
            </div>

            <!-- QR Code Section -->
            <div class="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center gap-4">
              <div class="p-2 rounded-lg bg-white shadow-md flex-shrink-0">
                <img src="${p.qrDataUrl}" alt="Xaman QR" class="w-32 h-32 block">
              </div>
              <div class="space-y-2 mono text-xs text-slate-300 flex-1 w-full">
                <div><span class="text-slate-500">Payload ID:</span> <span class="text-cyan-300 font-bold">${p.payloadId}</span></div>
                <div><span class="text-slate-500">TxType:</span> <span class="text-purple-300 font-bold">${p.txJson?.TransactionType}</span></div>
                <div><span class="text-slate-500">Fee:</span> <span class="text-slate-400">${p.txJson?.Fee || '12'} drops</span></div>
                <div class="pt-2">
                  <a href="${p.xamanDeepLink}" target="_blank" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition">
                    <span>Open in Xaman</span>
                    <span>&rarr;</span>
                  </a>
                </div>
              </div>
            </div>

            <!-- JSON Details -->
            <details class="text-[11px] mono text-slate-400">
              <summary class="cursor-pointer hover:text-slate-200">View On-Chain Raw JSON Payload</summary>
              <pre class="mt-2 p-3 rounded-lg bg-slate-950 border border-slate-800 overflow-x-auto text-cyan-200">${JSON.stringify(p.txJson, null, 2)}</pre>
            </details>
          </div>
        </div>
      `).join('')}
    </div>

    <!-- Quick Navigation -->
    <div class="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs mono">
      <span class="text-slate-400">Aegentix Sovereign Cockpit:</span>
      <div class="flex items-center gap-3">
        <a href="/" class="text-cyan-400 hover:underline">Super Agent Wallet</a>
        <span class="text-slate-600">|</span>
        <a href="/fincept.html" class="text-cyan-400 hover:underline">Fincept Terminal</a>
        <span class="text-slate-600">|</span>
        <a href="/jarvis.html" class="text-cyan-400 hover:underline">Jarvis 3D HUD</a>
      </div>
    </div>
  </div>
</body>
</html>`;

  fs.writeFileSync('C:/Users/eagle/antigravity/Aegentix-Super-Agent-Wallet/public/xaman-hub.html', html, 'utf8');
  console.log('\n🌟 Xaman Hub Visualizer Written to: public/xaman-hub.html');
  console.log('Available at: http://127.0.0.1:3000/xaman-hub.html');
}

prepareXamanTransactions().catch(console.error);
