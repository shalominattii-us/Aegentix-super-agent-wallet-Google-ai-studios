import { Client } from 'xrpl';

export const VERIFIED_XRPL_AMM_POOLS = [
  {
    pair: 'XRP/USD (Bitstamp)',
    baseSymbol: 'XRP',
    quoteSymbol: 'USD',
    asset: { currency: 'XRP' },
    asset2: { currency: 'USD', issuer: 'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B' },
    issuerName: 'Bitstamp'
  },
  {
    pair: 'XRP/EUR (Gatehub)',
    baseSymbol: 'XRP',
    quoteSymbol: 'EUR',
    asset: { currency: 'XRP' },
    asset2: { currency: 'EUR', issuer: 'rhub8qNmAMVxCQAwKyqPRUvtj5Ue4rexhm' },
    issuerName: 'Gatehub'
  },
  {
    pair: 'XRP/USD (Gatehub)',
    baseSymbol: 'XRP',
    quoteSymbol: 'USD',
    asset: { currency: 'XRP' },
    asset2: { currency: 'USD', issuer: 'rhub8qNmAMVxCQAwKyqPRUvtj5Ue4rexhm' },
    issuerName: 'Gatehub'
  },
  {
    pair: 'XRP/RLUSD (Ripple Labs)',
    baseSymbol: 'XRP',
    quoteSymbol: 'RLUSD',
    asset: { currency: 'XRP' },
    asset2: { currency: '524C555344000000000000000000000000000000', issuer: 'rQhWct2fv4Vc4KRjRgMrxa8xPN9Zx9iLKV' },
    issuerName: 'Ripple Labs'
  }
];

async function main() {
  const client = new Client('wss://xrplcluster.com');
  console.log('Connecting to XRPL Mainnet...');
  await client.connect();
  console.log('Connected! Scanning verified AMM pools...');

  for (const p of VERIFIED_XRPL_AMM_POOLS) {
    try {
      const res = await client.request({
        command: 'amm_info',
        asset: p.asset,
        asset2: p.asset2,
        ledger_index: 'validated'
      });
      const amm = res.result.amm;
      const xrpAmount = typeof amm.amount === 'string' ? (parseInt(amm.amount) / 1_000_000).toFixed(2) : amm.amount.value;
      const tokAmount = typeof amm.amount2 === 'string' ? amm.amount2 : amm.amount2.value;
      const feePct = (amm.trading_fee / 1000).toFixed(2);
      console.log(`[SUCCESS] Pool: ${p.pair}`);
      console.log(`  AMM Account: ${amm.account}`);
      console.log(`  Reserves: ${xrpAmount} XRP <-> ${tokAmount} ${p.quoteSymbol}`);
      console.log(`  Fee: ${feePct}% | Total LP Tokens: ${amm.lp_token.value}`);
    } catch (e: any) {
      console.log(`[NOTE] Pool ${p.pair}: ${e.message}`);
    }
  }

  await client.disconnect();
}

main().catch(console.error);
