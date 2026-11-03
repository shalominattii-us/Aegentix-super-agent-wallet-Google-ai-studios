import { Client } from 'xrpl';

async function verifyLiveTrades() {
  const WALLET_ADDR = 'rwB7JKKc5gJ47pPnWCFvQuhVW85mejYF1M';
  const client = new Client('wss://xrplcluster.com');
  await client.connect();

  console.log('=== VERIFYING REAL TRADES ON XRPL MAINNET FOR WALLET ===');
  console.log('Account:', WALLET_ADDR);

  const targets = [
    {
      name: 'APL',
      currency: 'APL',
      issuer: 'r3ANgbGHbWYX5Fuh7ve6j8HraDZMz4ifvh',
      held: 11,
      testSellAmount: '5',
      testBuyXrp: '0.5'
    },
    {
      name: 'LOAN',
      currency: '4C4F414E00000000000000000000000000000000',
      issuer: 'rKuSXFEE7ZbMMeJ55788u8dGe6VCLG9Cif',
      held: 97,
      testSellAmount: '20',
      testBuyXrp: '0.2'
    },
    {
      name: 'XRPALPHA',
      currency: '585250414C504841000000000000000000000000',
      issuer: 'rHZjr5PTAqZf2AYnZSNiB7aHJ68Adv33hi',
      held: 834,
      testSellAmount: '200',
      testBuyXrp: '0.2'
    },
    {
      name: 'SECURITIES',
      currency: '5345435552495449455300000000000000000000',
      issuer: 'rEamgsH2AxHd7Nsx3j2cjzi1ZVvHGACMYi',
      held: 55,
      testSellAmount: '10',
      testBuyXrp: '0.2'
    },
    {
      name: 'xBUZZ',
      currency: '7842555A5A000000000000000000000000000000',
      issuer: 'rNr5q1zg5kRXhfhwmckupRbUqsfUascbBN',
      held: 161,
      testSellAmount: '50',
      testBuyXrp: '0.2'
    }
  ];

  for (const t of targets) {
    console.log(`\n======================================================`);
    console.log(`TOKEN: ${t.name} (Held: ${t.held}) | Issuer: ${t.issuer}`);
    console.log(`======================================================`);

    // 1. Fetch live AMM Info
    try {
      const ammRes = await client.request({
        command: 'amm_info',
        asset: { currency: 'XRP' },
        asset2: { currency: t.currency, issuer: t.issuer },
        ledger_index: 'validated'
      });

      const amm = ammRes.result.amm;
      const xrpReserve = parseFloat(amm.amount) / 1000000;
      const tokenReserve = parseFloat(amm.amount2.value);
      const feePct = (amm.trading_fee / 1000);

      console.log(`[AMM Pool Details]`);
      console.log(`- AMM Account: ${amm.account}`);
      console.log(`- Pool Reserves: ${xrpReserve.toFixed(4)} XRP <-> ${tokenReserve.toLocaleString()} ${t.name}`);
      console.log(`- Trading Fee: ${feePct.toFixed(3)}%`);

      // 2. Ripple Path Find: SELL Token -> Receive XRP
      console.log(`\n[Simulating Sell: ${t.testSellAmount} ${t.name} -> XRP]`);
      try {
        const pathFindSell = await client.request({
          command: 'ripple_path_find',
          source_account: WALLET_ADDR,
          destination_account: WALLET_ADDR,
          destination_amount: '-1', // Any XRP
          send_max: {
            currency: t.currency,
            issuer: t.issuer,
            value: t.testSellAmount
          },
          ledger_index: 'validated'
        });

        const alts = pathFindSell.result.alternatives || [];
        if (alts.length > 0) {
          const best = alts[0];
          const outDrops = typeof best.destination_amount === 'string' ? best.destination_amount : best.destination_amount.value;
          const outXrp = parseFloat(outDrops) / 1000000;
          console.log(`  VERIFIED ROUTE FOUND!`);
          console.log(`  Expected Output: ~${outXrp.toFixed(6)} XRP for ${t.testSellAmount} ${t.name}`);
          console.log(`  Rate: 1 ${t.name} = ${(outXrp / parseFloat(t.testSellAmount)).toFixed(6)} XRP`);
          console.log(`  Path Steps:`, JSON.stringify(best.paths_computed || []));
        } else {
          console.log(`  No multi-hop path, checking direct AMM swap quote...`);
          // Constant product formula with fee:
          // dy = (y * dx * (1 - fee)) / (x + dx * (1 - fee))
          const feeFactor = 1 - (amm.trading_fee / 100000);
          const dx = parseFloat(t.testSellAmount);
          const dy = (xrpReserve * dx * feeFactor) / (tokenReserve + dx * feeFactor);
          console.log(`  Calculated Direct AMM Swap Output: ~${dy.toFixed(6)} XRP for ${t.testSellAmount} ${t.name}`);
        }
      } catch (pe) {
        console.log(`  Path find note: ${pe.message}`);
      }

      // 3. Ripple Path Find: BUY Token with XRP
      console.log(`\n[Simulating Buy: Swap ${t.testBuyXrp} XRP -> ${t.name}]`);
      try {
        const pathFindBuy = await client.request({
          command: 'ripple_path_find',
          source_account: WALLET_ADDR,
          destination_account: WALLET_ADDR,
          destination_amount: {
            currency: t.currency,
            issuer: t.issuer,
            value: '-1'
          },
          send_max: (parseFloat(t.testBuyXrp) * 1000000).toString(),
          ledger_index: 'validated'
        });

        const altsBuy = pathFindBuy.result.alternatives || [];
        if (altsBuy.length > 0) {
          const bestBuy = altsBuy[0];
          const outTokens = typeof bestBuy.destination_amount === 'string' ? bestBuy.destination_amount : bestBuy.destination_amount.value;
          console.log(`  VERIFIED ROUTE FOUND!`);
          console.log(`  Expected Output: ~${parseFloat(outTokens).toLocaleString()} ${t.name} for ${t.testBuyXrp} XRP`);
        } else {
          const feeFactor = 1 - (amm.trading_fee / 100000);
          const dx = parseFloat(t.testBuyXrp);
          const dy = (tokenReserve * dx * feeFactor) / (xrpReserve + dx * feeFactor);
          console.log(`  Calculated Direct AMM Swap Output: ~${dy.toLocaleString()} ${t.name} for ${t.testBuyXrp} XRP`);
        }
      } catch (pbe) {
        console.log(`  Buy path find note: ${pbe.message}`);
      }

    } catch (err) {
      console.log(`Error analyzing ${t.name}:`, err.message);
    }
  }

  await client.disconnect();
  console.log('\nAll simulations and route verifications complete.');
}

verifyLiveTrades().catch(console.error);
