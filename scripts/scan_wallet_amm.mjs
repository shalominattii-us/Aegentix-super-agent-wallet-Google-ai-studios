import fetch from 'node-fetch';
import { Client } from 'xrpl';

async function analyzeWalletHoldings() {
  const WALLET_ADDR = 'rwB7JKKc5gJ47pPnWCFvQuhVW85mejYF1M';
  console.log(`Connecting to XRPL Mainnet for wallet: ${WALLET_ADDR}...`);

  const client = new Client('wss://xrplcluster.com');
  await client.connect();

  console.log('Connected to XRPL Mainnet.');

  // 1. Account Info (Native XRP)
  const acctInfo = await client.request({
    command: 'account_info',
    account: WALLET_ADDR,
    ledger_index: 'validated'
  });

  const xrpDrops = acctInfo.result.account_data.Balance;
  const xrpBalance = parseFloat(xrpDrops) / 1000000;
  const ownerCount = acctInfo.result.account_data.OwnerCount;
  const sequence = acctInfo.result.account_data.Sequence;

  console.log(`\nNative XRP Balance: ${xrpBalance.toFixed(6)} XRP`);
  console.log(`Sequence: ${sequence} | Owner Count: ${ownerCount}`);

  // 2. Account Lines (Trustlines & tokens)
  const linesRes = await client.request({
    command: 'account_lines',
    account: WALLET_ADDR,
    ledger_index: 'validated'
  });

  const lines = linesRes.result.lines;
  console.log(`Total Trustlines: ${lines.length}`);

  const nonZeroTokens = lines
    .filter(l => parseFloat(l.balance) > 0)
    .map(l => ({
      currency: l.currency,
      currencyCode: l.currency.length === 40 ? Buffer.from(l.currency, 'hex').toString('utf8').replace(/\0/g, '') : l.currency,
      issuer: l.account,
      balance: parseFloat(l.balance),
      limit: l.limit
    }))
    .sort((a, b) => b.balance - a.balance);

  console.log(`\nTokens with positive balance (${nonZeroTokens.length}):`);
  nonZeroTokens.forEach((t, i) => {
    console.log(`  [${(i + 1).toString().padStart(2)}] ${t.currencyCode.padEnd(16)} Balance: ${t.balance.toLocaleString()} | Issuer: ${t.issuer}`);
  });

  // 3. Check AMM pools & Orderbooks for the top tokens held
  console.log('\n--- SCANNING AMM POOLS & ORDERBOOKS FOR HELD TOKENS ---');
  
  for (const token of nonZeroTokens) {
    // Check if an AMM pool exists for XRP <-> Token
    try {
      const ammInfo = await client.request({
        command: 'amm_info',
        asset: { currency: 'XRP' },
        asset2: { currency: token.currency, issuer: token.issuer },
        ledger_index: 'validated'
      });

      if (ammInfo.result && ammInfo.result.amm) {
        const amm = ammInfo.result.amm;
        console.log(`\n🔥 ACTIVE AMM POOL FOUND: XRP / ${token.currencyCode}!`);
        console.log(`   AMM Account: ${amm.account}`);
        console.log(`   Pool Reserves: ${JSON.stringify(amm.amount)} <-> ${JSON.stringify(amm.amount2)}`);
        console.log(`   Trading Fee: ${(amm.trading_fee / 1000).toFixed(3)}%`);
        console.log(`   LP Token: ${JSON.stringify(amm.lp_token)}`);
      }
    } catch (e) {
      // No AMM pool for this pair
    }

    // Also check book_offers (CLOB DEX orderbook) for Token -> XRP
    try {
      const bookOffers = await client.request({
        command: 'book_offers',
        taker_gets: { currency: token.currency, issuer: token.issuer },
        taker_pays: { currency: 'XRP' },
        limit: 3,
        ledger_index: 'validated'
      });

      const bids = bookOffers.result.offers || [];
      if (bids.length > 0) {
        console.log(`   📈 DEX Orderbook Bids found for ${token.currencyCode} -> XRP: ${bids.length} active bids`);
      }
    } catch (e) {}
  }

  await client.disconnect();
  console.log('\nScan completed.');
}

analyzeWalletHoldings().catch(console.error);
