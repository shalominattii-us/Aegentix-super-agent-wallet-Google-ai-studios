import { processCoinbaseRawItems, pollCoinbaseExchange } from '../adapters/coinbaseAdapter.ts';
import { processBinanceUsRawSymbols, pollBinanceUs } from '../adapters/binanceUsAdapter.ts';
import { processKrakenRawPairs, pollKrakenPro } from '../adapters/krakenAdapter.ts';
import { processGeminiRawDetails, pollGeminiMarketplace } from '../adapters/geminiAdapter.ts';
import { processBitstampRawPairs, pollBitstampExchange } from '../adapters/bitstampAdapter.ts';
import { processUpholdRawTickers, pollUpholdDesk } from '../adapters/upholdAdapter.ts';
import { processRobinhoodRawInstruments, pollRobinhoodBroker } from '../adapters/robinhoodAdapter.ts';
import { processWebullRawTickers, pollWebullBroker } from '../adapters/webullAdapter.ts';

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(`ADAPTER CONTRACT TEST ASSERTION FAILED: ${msg}`);
}

export async function runAdapterContractTests(): Promise<{ passed: number; failed: number }> {
  console.log('--- [SUITE 2/5] ADAPTER CONTRACT TESTS: Rejections, Empty Payloads & Provenance Isolation ---');
  let passed = 0;
  const now = new Date().toISOString();

  // 1. Coinbase Ingestion Rejection Loop Contract
  const malformedCoinbasePayload = [
    null,
    'not_an_object',
    { id: '', base_currency: 'BTC', quote_currency: 'USD' },
    { id: 'NO-BASE', base_currency: '', quote_currency: 'USD' },
    { id: 'NO-QUOTE', base_currency: 'BTC', quote_currency: '' },
    { id: 'VALID-PAIR', base_currency: 'BTC', quote_currency: 'USD', status: 'online', quote_increment: '0.01', base_min_size: '0.001' },
  ];
  const cbIngestRes = processCoinbaseRawItems(malformedCoinbasePayload, 'LOCAL_FIXTURE', 'LOCAL_FIXTURE', null, now, 10, 'FALLBACK_FIXTURE', null);
  assert(cbIngestRes.source_pair_count === 6 && cbIngestRes.ingested_count === 1 && cbIngestRes.rejected_count === 5, 'Coinbase rejection counts mismatch');
  passed++;
  console.log('  [PASS] 2.1: Coinbase malformed payload rejection loop verified.');

  // 2. Binance.US Ingestion Rejection Loop Contract
  const malformedBinancePayload = [
    { symbol: '', baseAsset: 'BTC', quoteAsset: 'USD' },
    { symbol: 'MISSINGBASE', baseAsset: '', quoteAsset: 'USDT' },
    { symbol: 'MISSINGQUOTE', baseAsset: 'ETH', quoteAsset: '' },
    { symbol: 'VALIDBN', baseAsset: 'SOL', quoteAsset: 'USDT', status: 'TRADING', isSpotTradingAllowed: true },
  ];
  const bnIngestRes = processBinanceUsRawSymbols(malformedBinancePayload, 'LOCAL_FIXTURE', 'LOCAL_FIXTURE', null, now, 10, 'FALLBACK_FIXTURE', null);
  assert(bnIngestRes.source_pair_count === 4 && bnIngestRes.ingested_count === 1 && bnIngestRes.rejected_count === 3, 'Binance rejection counts mismatch');
  passed++;
  console.log('  [PASS] 2.2: Binance.US malformed symbol rejection loop verified.');

  // 3. Kraken Ingestion Rejection Loop Contract
  const malformedKrakenPayload = [
    { altname: '', base: 'XXBT', quote: 'ZUSD' },
    { altname: 'NOBASE', base: '', quote: 'ZUSD' },
    { altname: 'NOQUOTE', base: 'XXBT', quote: '' },
    { altname: 'VALIDKRK', wsname: 'BTC/USD', base: 'XXBT', quote: 'ZUSD', status: 'online' },
  ];
  const krkIngestRes = processKrakenRawPairs(malformedKrakenPayload, 'LOCAL_FIXTURE', 'LOCAL_FIXTURE', null, now, 10, 'FALLBACK_FIXTURE', null);
  assert(krkIngestRes.source_pair_count === 4 && krkIngestRes.ingested_count === 1 && krkIngestRes.rejected_count === 3, 'Kraken rejection counts mismatch');
  passed++;
  console.log('  [PASS] 2.3: Kraken malformed pair rejection loop verified.');

  // 4. Gemini Ingestion Rejection Loop Contract
  const malformedGeminiPayload = [
    { symbol: '', base_currency: 'BTC', quote_currency: 'USD' },
    { symbol: 'nogembase', base_currency: '', quote_currency: 'USD' },
    { symbol: 'nogemquote', base_currency: 'ETH', quote_currency: '' },
    { symbol: 'validgem', base_currency: 'LINK', quote_currency: 'USD', status: 'open', tick_size: 0.01, quote_increment: 0.01, min_order_size: '0.1' },
  ];
  const gemIngestRes = processGeminiRawDetails(malformedGeminiPayload, 'LOCAL_FIXTURE', 'LOCAL_FIXTURE', null, now, 10, 'FALLBACK_FIXTURE', null);
  assert(gemIngestRes.source_pair_count === 4 && gemIngestRes.ingested_count === 1 && gemIngestRes.rejected_count === 3, 'Gemini rejection counts mismatch');
  passed++;
  console.log('  [PASS] 2.4: Gemini malformed symbol rejection loop verified.');

  // 5. Bitstamp Ingestion Rejection Loop Contract
  const malformedBitstampPayload = [
    null,
    { name: '', url_symbol: 'btcusd' },
    { name: 'INVALIDNAME', url_symbol: 'btcusd' }, // Missing slash delimiter
    { name: 'BTC/USD', url_symbol: '' },          // Missing url_symbol
    { name: 'BTC/USD', url_symbol: 'btcusd', base_decimals: 8, counter_decimals: 2, minimum_order: '10.0 USD', trading: 'Enabled' },
  ];
  const bsIngestRes = processBitstampRawPairs(malformedBitstampPayload, 'LOCAL_FIXTURE', 'LOCAL_FIXTURE', null, now, 10, 'FALLBACK_FIXTURE', null);
  assert(bsIngestRes.source_pair_count === 5 && bsIngestRes.ingested_count === 1 && bsIngestRes.rejected_count === 4, 'Bitstamp rejection counts mismatch');
  passed++;
  console.log('  [PASS] 2.5: Bitstamp USA malformed pair rejection loop verified.');

  // 6. Uphold Ingestion Rejection Loop Contract
  const malformedUpholdPayload = [
    { pair: 'INVALIDPAIR' }, // Missing hyphen
    { pair: '' },
    { pair: 'BTC-USD', ask: '68000', bid: '67900', currency: 'USD' },
  ];
  const uphIngestRes = processUpholdRawTickers(malformedUpholdPayload, 'LOCAL_FIXTURE', 'LOCAL_FIXTURE', null, now, 10, 'FALLBACK_FIXTURE', null);
  assert(uphIngestRes.source_pair_count === 3 && uphIngestRes.ingested_count === 1 && uphIngestRes.rejected_count === 2, 'Uphold rejection counts mismatch');
  passed++;
  console.log('  [PASS] 2.6: Uphold conversion desk malformed ticker rejection loop verified.');

  // 7. Robinhood Ingestion Rejection Loop Contract
  const malformedRobinhoodPayload = [
    { symbol: '', asset_type: 'crypto' },
    { symbol: 'BTC', asset_type: 'unknown_type' },
    { symbol: 'BTC-USD', asset_type: 'crypto', name: 'Bitcoin', tradable: true, state: 'active' },
  ];
  const rhIngestRes = processRobinhoodRawInstruments(malformedRobinhoodPayload, 'LOCAL_FIXTURE', 'LOCAL_FIXTURE', null, now, 10, 'FALLBACK_FIXTURE', null);
  assert(rhIngestRes.source_pair_count === 3 && rhIngestRes.ingested_count === 1 && rhIngestRes.rejected_count === 2, 'Robinhood rejection counts mismatch');
  passed++;
  console.log('  [PASS] 2.7: Robinhood broker instrument rejection loop verified.');

  // 8. Webull Ingestion Rejection Loop Contract
  const malformedWebullPayload = [
    { symbol: '', type: 'crypto' },
    { symbol: 'BTCUSD', type: 'invalid' },
    { tickerId: '123', symbol: 'BTCUSD', name: 'Bitcoin', type: 'crypto', status: 'T', currency: 'USD' },
  ];
  const wbIngestRes = processWebullRawTickers(malformedWebullPayload, 'LOCAL_FIXTURE', 'LOCAL_FIXTURE', null, now, 10, 'FALLBACK_FIXTURE', null);
  assert(wbIngestRes.source_pair_count === 3 && wbIngestRes.ingested_count === 1 && wbIngestRes.rejected_count === 2, 'Webull rejection counts mismatch');
  passed++;
  console.log('  [PASS] 2.8: Webull introducing broker rejection loop verified.');

  // 9. Fallback Evidence Isolation across all 8 adapters
  const [cb, bn, krk, gem, bs, uph, rh, wb] = await Promise.all([
    pollCoinbaseExchange(false),
    pollBinanceUs(false),
    pollKrakenPro(false),
    pollGeminiMarketplace(false),
    pollBitstampExchange(false),
    pollUpholdDesk(false),
    pollRobinhoodBroker(false),
    pollWebullBroker(false),
  ]);

  for (const res of [cb, bn, krk, gem, bs, uph, rh, wb]) {
    assert(res.evidence_origin === 'LOCAL_FIXTURE', `${res.venue} fallback must have evidence_origin: LOCAL_FIXTURE`);
    assert(res.last_successful_live_poll === null, `${res.venue} fallback last_successful_live_poll MUST be null`);
    for (const rec of res.records) {
      assert(Boolean(rec.market_structure), `Instrument ${rec.instrument_id} must have market_structure`);
      assert(typeof rec.orderbook_supported === 'boolean', `Instrument ${rec.instrument_id} must have boolean orderbook_supported`);
      assert(rec.orderbook_available === false, `Fallback instrument ${rec.instrument_id} must have orderbook_available: false`);
      assert(rec.orderbook_verified_at === null, `Fallback instrument ${rec.instrument_id} must have orderbook_verified_at: null`);
      assert(rec.orderbook_depth_verified_at === null, `Fallback instrument ${rec.instrument_id} must have orderbook_depth_verified_at: null`);
      assert(Boolean(rec.instrument_eligibility), `Instrument ${rec.instrument_id} must have instrument_eligibility profile`);
      assert(Boolean(rec.instrument_eligibility.evidence_basis), `Instrument ${rec.instrument_id} must have evidence_basis`);
      if (['coinbase', 'binance_us', 'kraken', 'gemini', 'bitstamp'].includes(rec.venue)) {
        assert(rec.orderbook_supported === true, `CLOB venue ${rec.venue} must have orderbook_supported: true`);
      }
      if (['uphold', 'robinhood_crypto', 'robinhood_financial', 'webull_pay', 'webull_financial'].includes(rec.venue)) {
        assert(rec.orderbook_supported === false, `Desk/Broker venue ${rec.venue} must have orderbook_supported: false`);
      }
      if (rec.venue === 'uphold') {
        assert(rec.withdrawal_supported === null, `Uphold instrument ${rec.instrument_id} must have withdrawal_supported: null`);
      }
    }
  }
  passed++;
  console.log('  [PASS] 2.9: Fallback evidence isolation & null live timestamp verified across all 8 adapters.');

  // 10. Operational Health accounting for all 8 expected adapters
  const { unifiedDiscoveryEngine, EXPECTED_DIGITAL_ADAPTER_REGISTRY } = await import('../unifiedDiscoveryEngine.ts');
  assert(EXPECTED_DIGITAL_ADAPTER_REGISTRY.length === 8, 'Must expect exactly 8 digital and broker adapters');
  const currentStatus = unifiedDiscoveryEngine.computeOperationalStatus();
  assert(currentStatus !== 'HEALTHY', `Operational status on fallback must not be HEALTHY (got: ${currentStatus})`);
  passed++;
  console.log('  [PASS] 2.10: Operational status correctly accounts for missing/unpolled adapters across all 8 venues.');

  console.log(`  Summary: ${passed} Adapter Contract Tests Passed.\n`);
  return { passed, failed: 0 };
}
