import { cleanKrakenAsset, normalizeKrakenPair } from '../adapters/krakenAdapter.ts';
import { normalizeCoinbaseProduct } from '../adapters/coinbaseAdapter.ts';
import { normalizeBinanceUsSymbol } from '../adapters/binanceUsAdapter.ts';
import { normalizeGeminiSymbol } from '../adapters/geminiAdapter.ts';
import { normalizeBitstampPair } from '../adapters/bitstampAdapter.ts';
import { normalizeUpholdTicker } from '../adapters/upholdAdapter.ts';
import { normalizeRobinhoodInstrument } from '../adapters/robinhoodAdapter.ts';
import { normalizeWebullTicker } from '../adapters/webullAdapter.ts';

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(`UNIT TEST ASSERTION FAILED: ${msg}`);
}

export async function runUnitTests(): Promise<{ passed: number; failed: number }> {
  console.log('--- [SUITE 1/5] UNIT TESTS: Normalizers, Asset Taxonomy & Market Structure ---');
  let passed = 0;

  // 1. Kraken cleanKrakenAsset tests
  assert(cleanKrakenAsset('XXBT') === 'BTC', 'XXBT must resolve to BTC');
  assert(cleanKrakenAsset('XDG') === 'DOGE', 'XDG must resolve to DOGE');
  assert(cleanKrakenAsset('XXDG') === 'DOGE', 'XXDG must resolve to DOGE');
  assert(cleanKrakenAsset('ZUSD') === 'USD', 'ZUSD must resolve to USD');
  passed++;
  console.log('  [PASS] 1.1: cleanKrakenAsset ticker stripping verified.');

  // 2. Kraken wsname normalizer fix test (XDG/USD -> DOGE-USD)
  const krakenDoge = normalizeKrakenPair({
    altname: 'XDGUSD',
    wsname: 'XDG/USD',
    base: 'XXDG',
    quote: 'ZUSD',
    status: 'online',
  }, 'LOCAL_FIXTURE', 'LOCAL_FIXTURE', null, '2026-10-31T00:00:00Z');

  assert(krakenDoge.base_asset === 'DOGE', `Kraken wsname XDG must normalize base_asset to DOGE, got: ${krakenDoge.base_asset}`);
  assert(krakenDoge.quote_asset === 'USD', `Kraken wsname ZUSD must normalize quote_asset to USD, got: ${krakenDoge.quote_asset}`);
  assert(krakenDoge.instrument_id === 'kraken:DOGE-USD:spot', `Instrument ID must be kraken:DOGE-USD:spot, got ${krakenDoge.instrument_id}`);
  passed++;
  console.log('  [PASS] 1.2: Kraken wsname XDG/USD to DOGE-USD normalization verified.');

  // 3. Kraken XBT/USD wsname normalizer test
  const krakenBtc = normalizeKrakenPair({
    altname: 'XBTUSD',
    wsname: 'XBT/USD',
    base: 'XXBT',
    quote: 'ZUSD',
    status: 'online',
  }, 'LOCAL_FIXTURE', 'LOCAL_FIXTURE', null, '2026-10-31T00:00:00Z');
  assert(krakenBtc.base_asset === 'BTC', 'Kraken wsname XBT must resolve to BTC');
  assert(krakenBtc.instrument_id === 'kraken:BTC-USD:spot', 'Instrument ID must be kraken:BTC-USD:spot');
  passed++;
  console.log('  [PASS] 1.3: Kraken wsname XBT/USD to BTC-USD normalization verified.');

  // 4. Coinbase Quote Class classification & null preservation
  const cbUsdc = normalizeCoinbaseProduct({
    id: 'BTC-USDC',
    base_currency: 'BTC',
    quote_currency: 'USDC',
    status: 'online',
    quote_increment: '0.01',
    base_min_size: '0.0001',
  }, 'LOCAL_FIXTURE', 'LOCAL_FIXTURE', null, '2026-10-31T00:00:00Z');
  assert(cbUsdc.quote_class === 'stablecoin', 'USDC quote must be classified as stablecoin');
  assert(cbUsdc.market_structure === 'CLOB', 'Coinbase market_structure must be CLOB');
  assert(cbUsdc.orderbook_supported === true, 'Coinbase orderbook_supported must be true');
  assert(cbUsdc.orderbook_available === false, 'Listing normalizer must NOT claim orderbook_available: true');
  assert(cbUsdc.orderbook_verified_at === null, 'orderbook_verified_at must be null');
  assert(cbUsdc.orderbook_depth_verified_at === null, 'orderbook_depth_verified_at must be null');
  assert(cbUsdc.withdrawal_supported === null, 'withdrawal_supported must be null');
  assert(cbUsdc.network === null, 'network must be null');
  assert(cbUsdc.last_successful_live_poll === null, 'last_successful_live_poll must be null on fixture');
  passed++;
  console.log('  [PASS] 1.4: Coinbase quote classification and explicit null preservation verified.');

  // 5. Binance.US Symbol Normalization
  const bnEth = normalizeBinanceUsSymbol({
    symbol: 'ETHUSDT',
    baseAsset: 'ETH',
    quoteAsset: 'USDT',
    status: 'TRADING',
    isSpotTradingAllowed: true,
  }, 'LOCAL_FIXTURE', 'LOCAL_FIXTURE', null, '2026-10-31T00:00:00Z');
  assert(bnEth.base_asset === 'ETH', 'Binance.US baseAsset must normalize to ETH');
  assert(bnEth.quote_asset === 'USDT', 'Binance.US quoteAsset must normalize to USDT');
  assert(bnEth.quote_class === 'stablecoin', 'USDT quote must be classified as stablecoin');
  assert(bnEth.market_structure === 'CLOB', 'Binance.US market_structure must be CLOB');
  assert(bnEth.orderbook_supported === true, 'Binance.US orderbook_supported must be true');
  assert(bnEth.us_eligibility === 'us_excluding_ny', 'Binance.US must reflect NY exclusion');
  passed++;
  console.log('  [PASS] 1.5: Binance.US symbol normalization and state eligibility verified.');

  // 6. Gemini Details Normalization
  const gemGusd = normalizeGeminiSymbol({
    symbol: 'gusdusd',
    base_currency: 'GUSD',
    quote_currency: 'USD',
    status: 'open',
    tick_size: 0.0001,
    quote_increment: 0.0001,
    min_order_size: '1.0',
  }, 'LOCAL_FIXTURE', 'LOCAL_FIXTURE', null, '2026-10-31T00:00:00Z');
  assert(gemGusd.base_asset === 'GUSD', 'Gemini GUSD base must normalize');
  assert(gemGusd.quote_asset === 'USD', 'Gemini USD quote must normalize');
  assert(gemGusd.quote_class === 'fiat', 'USD quote must be classified as fiat');
  assert(gemGusd.market_structure === 'CLOB', 'Gemini market_structure must be CLOB');
  assert(gemGusd.orderbook_supported === true, 'Gemini orderbook_supported must be true');
  assert(gemGusd.orderbook_available === false, 'Listing API normalizer must NOT claim orderbook_available: true');
  passed++;
  console.log('  [PASS] 1.6: Gemini symbol details normalization verified.');

  // 7. Bitstamp Pair Normalization & Per-Instrument NYDFS Greenlist Modeling
  const bsBtc = normalizeBitstampPair({
    name: 'BTC/USD',
    url_symbol: 'btcusd',
    base_decimals: 8,
    counter_decimals: 2,
    minimum_order: '10.0 USD',
    trading: 'Enabled',
  }, 'LOCAL_FIXTURE', 'LOCAL_FIXTURE', null, '2026-10-31T00:00:00Z');
  assert(bsBtc.instrument_id === 'bitstamp:BTC-USD:spot', 'Bitstamp BTC must normalize to bitstamp:BTC-USD:spot');
  assert(bsBtc.market_structure === 'CLOB', 'Bitstamp market_structure must be CLOB');
  assert(bsBtc.orderbook_supported === true, 'Bitstamp orderbook_supported must be true');
  assert(bsBtc.orderbook_available === false, 'Bitstamp orderbook_available must be false');
  assert(bsBtc.orderbook_verified_at === null, 'Bitstamp orderbook_verified_at must be null');
  assert(bsBtc.us_eligibility === 'us_available', 'BTC on Bitstamp is NYDFS Greenlist approved');
  assert(bsBtc.instrument_eligibility.asset_approved === true, 'BTC must be marked asset_approved: true');
  assert(bsBtc.instrument_eligibility.asset_approval_authority === 'NYDFS_GREENLIST', 'BTC authority must be NYDFS_GREENLIST');
  assert(bsBtc.instrument_eligibility.venue_authorized === true, 'Bitstamp USA venue_authorized must be true');

  const bsXrp = normalizeBitstampPair({
    name: 'XRP/USD',
    url_symbol: 'xrpusd',
    base_decimals: 8,
    counter_decimals: 4,
    minimum_order: '10.0 USD',
    trading: 'Enabled',
  }, 'LOCAL_FIXTURE', 'LOCAL_FIXTURE', null, '2026-10-31T00:00:00Z');
  assert(bsXrp.us_eligibility === 'us_excluding_ny', 'XRP on Bitstamp USA is excluded in NY');
  assert(bsXrp.instrument_eligibility.asset_approved === null, 'XRP must be marked asset_approved: null (unverified in NY, non-greenlist)');
  assert(bsXrp.instrument_eligibility.customer_eligibility_tier === 'us_excluding_ny', 'XRP must be tier us_excluding_ny');
  assert(bsXrp.instrument_eligibility.prohibited_states.includes('NY'), 'XRP must list NY in prohibited_states');
  assert(bsXrp.instrument_eligibility.evidence_basis.statutory_charter_checked === true, 'Statutory charter must be checked');
  passed++;
  console.log('  [PASS] 1.7: Bitstamp USA pair normalization & per-instrument NYDFS eligibility verified.');

  // 8. Uphold Multi-Asset Conversion Desk & Precious Metal Entitlement
  const uphGold = normalizeUpholdTicker({
    pair: 'UPXAU-USD',
    ask: '2750.00',
    bid: '2735.00',
    currency: 'USD',
  }, 'LOCAL_FIXTURE', 'LOCAL_FIXTURE', null, '2026-10-31T00:00:00Z');
  assert(uphGold.market_type === 'digital_ledger_entitlement', 'Uphold gold must be classified as digital_ledger_entitlement');
  assert(uphGold.market_class === 'traditional_markets', 'Physical gold must be classified as traditional_markets');
  assert(uphGold.market_structure === 'CONVERSION_DESK', 'Uphold market_structure must be CONVERSION_DESK');
  assert(uphGold.orderbook_supported === false, 'Uphold orderbook_supported must be false');
  assert(uphGold.orderbook_available === false, 'Uphold must have orderbook_available: false');
  assert(uphGold.orderbook_verified_at === null, 'Uphold orderbook_verified_at must be null');
  assert(uphGold.withdrawal_supported === null, 'Critical invariant: Uphold withdrawal_supported must be preserved as null');
  assert(uphGold.instrument_eligibility.asset_approval_authority === 'COMMODITY_BAILMENT_CONTRACT', 'Gold must have COMMODITY_BAILMENT_CONTRACT authority');
  assert(uphGold.instrument_eligibility.eligibility_notes?.includes("Brink's"), "Eligibility notes must mention Brink's bailment storage");
  assert(uphGold.us_eligibility === 'us_excluding_ny', 'Uphold is prohibited in NY');
  passed++;
  console.log('  [PASS] 1.8: Uphold conversion desk ticker & Brink\'s vaulted gold entitlement verified.');

  // 9. Robinhood Broker Routing Segregation (Crypto vs Securities)
  const rhBtc = normalizeRobinhoodInstrument({
    symbol: 'BTC-USD',
    asset_type: 'crypto',
    name: 'Bitcoin',
    tradable: true,
    state: 'active',
  }, 'LOCAL_FIXTURE', 'LOCAL_FIXTURE', null, '2026-10-31T00:00:00Z');
  assert(rhBtc.venue === 'robinhood_crypto', 'Robinhood crypto must map to robinhood_crypto');
  assert(rhBtc.market_type === 'broker_routed_spot', 'Robinhood crypto must be broker_routed_spot');
  assert(rhBtc.market_structure === 'BROKER_ROUTED', 'Robinhood market_structure must be BROKER_ROUTED');
  assert(rhBtc.orderbook_supported === false, 'Robinhood orderbook_supported must be false');

  const rhNvda = normalizeRobinhoodInstrument({
    symbol: 'NVDA',
    asset_type: 'equity',
    name: 'NVIDIA Corporation',
    tradable: true,
    state: 'active',
  }, 'LOCAL_FIXTURE', 'LOCAL_FIXTURE', null, '2026-10-31T00:00:00Z');
  assert(rhNvda.venue === 'robinhood_financial', 'Robinhood stock must map to robinhood_financial');
  assert(rhNvda.market_type === 'broker_equity', 'Robinhood stock must be broker_equity');
  assert(rhNvda.market_structure === 'BROKER_ROUTED', 'Robinhood equity market_structure must be BROKER_ROUTED');
  assert(rhNvda.orderbook_supported === false, 'Robinhood equity orderbook_supported must be false');
  assert(rhNvda.network === 'DTCC/NSCC', 'Securities clear through DTCC/NSCC');
  passed++;
  console.log('  [PASS] 1.9: Robinhood broker routing segregation (Robinhood Crypto LLC vs Robinhood Financial LLC) verified.');

  // 10. Webull Introducing Broker-Dealer Segregation (Crypto vs Apex Clearing Equities)
  const wbBtc = normalizeWebullTicker({
    tickerId: '913256135',
    symbol: 'BTCUSD',
    name: 'Bitcoin',
    type: 'crypto',
    status: 'T',
    currency: 'USD',
  }, 'LOCAL_FIXTURE', 'LOCAL_FIXTURE', null, '2026-10-31T00:00:00Z');
  assert(wbBtc.venue === 'webull_pay', 'Webull crypto must map to webull_pay');
  assert(wbBtc.market_structure === 'BROKER_ROUTED', 'Webull crypto market_structure must be BROKER_ROUTED');
  assert(wbBtc.orderbook_supported === false, 'Webull crypto orderbook_supported must be false');
  assert(wbBtc.us_eligibility === 'us_excluding_ny', 'Webull Pay is prohibited in NY');

  const wbTsla = normalizeWebullTicker({
    tickerId: '913254231',
    symbol: 'TSLA',
    name: 'Tesla Inc',
    type: 'stock',
    status: 'T',
    currency: 'USD',
  }, 'LOCAL_FIXTURE', 'LOCAL_FIXTURE', null, '2026-10-31T00:00:00Z');
  assert(wbTsla.venue === 'webull_financial', 'Webull equity must map to webull_financial');
  assert(wbTsla.market_type === 'broker_equity', 'Webull stock must be broker_equity');
  assert(wbTsla.market_structure === 'BROKER_ROUTED', 'Webull equity market_structure must be BROKER_ROUTED');
  assert(wbTsla.orderbook_supported === false, 'Webull equity orderbook_supported must be false');
  passed++;
  console.log('  [PASS] 1.10: Webull introducing broker segregation (Webull Pay LLC vs Webull Financial LLC) verified.');

  console.log(`  Summary: ${passed} Unit Tests Passed.\n`);
  return { passed, failed: 0 };
}
