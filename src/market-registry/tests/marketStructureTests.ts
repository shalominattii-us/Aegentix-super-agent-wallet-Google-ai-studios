/**
 * AEGENTIX MARKET REGISTRY PHASE 1.2B — MARKET STRUCTURE TESTS
 * 
 * Verifies the 5 market structure paradigms:
 * 1. CLOB depth snapshots, top of book & depth bands
 * 2. Conversion desk quotes & physical bullion bailment
 * 3. Broker-routed execution profiles & PFOF isolation
 * 4. CFTC DCM derivative contract specifications
 * 5. Decentralized liquidity (DEX / AMM) pool reserves
 * 6. Observation freshness & stale-data detection
 */

import {
  marketStructureRegistry,
  buildClobDepthSnapshot,
  StaleObservationDetector
} from '../marketStructureRegistry.ts';
import { ClobDepthSnapshot, AmmPoolStateObservation, ConversionDeskQuote } from '../marketStructureTypes.ts';

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(`MARKET STRUCTURE TEST ASSERTION FAILED: ${msg}`);
}

export async function runMarketStructureTests(): Promise<{ passed: number; failed: number }> {
  console.log('--- [SUITE 6/6] MARKET STRUCTURE & OBSERVATION REGISTRY (PHASE 1.2B) ---');
  let passed = 0;

  // 1. CLOB Depth Normalization & Metrics Calculation
  const testBids = [
    { price: 68000, size: 2.0 },
    { price: 67950, size: 3.0 },
    { price: 67500, size: 10.0 },
  ];
  const testAsks = [
    { price: 68010, size: 1.5 },
    { price: 68050, size: 4.0 },
    { price: 68500, size: 12.0 },
  ];
  const snap = buildClobDepthSnapshot(testBids, testAsks, new Date().toISOString(), 'LOCAL_FIXTURE');
  assert(snap.structure === 'CLOB', 'Snapshot structure must be CLOB');
  assert(snap.top_of_book.best_bid === 68000, 'Best bid must be 68000');
  assert(snap.top_of_book.best_ask === 68010, 'Best ask must be 68010');
  assert(snap.top_of_book.mid_price === 68005, 'Mid price must be 68005');
  assert(snap.top_of_book.spread_usd === 10, 'Spread USD must be 10');
  assert(snap.top_of_book.spread_bps > 0, 'Spread bps must be > 0');
  assert(snap.depth_metrics.total_depth_bid_usd > 0, 'Total bid depth must be positive');
  assert(snap.depth_metrics.total_depth_ask_usd > 0, 'Total ask depth must be positive');
  passed++;
  console.log('  [PASS] 6.1: CLOB depth snapshot top-of-book and multi-tier depth calculations verified.');

  // 2. Conversion Desk Indicative Quotes & Physical Bullion Bailment
  const goldObs = marketStructureRegistry.getObservation('uphold:UPXAU-USD:digital_ledger_entitlement');
  assert(Boolean(goldObs), 'Gold entitlement observation must exist');
  assert(goldObs!.market_structure === 'CONVERSION_DESK', 'Structure must be CONVERSION_DESK');
  const goldData = goldObs!.data as ConversionDeskQuote;
  assert(goldData.indicative_ask > goldData.indicative_bid, 'Ask must exceed bid');
  assert(goldData.markup_bps > 0, 'Markup bps must be > 0');
  assert(Boolean(goldData.physical_custody_terms), 'Physical custody terms must be populated');
  assert(goldData.physical_custody_terms!.vault_operator.includes("Brink's"), 'Vault operator must cite Brink\'s');
  assert(goldData.physical_custody_terms!.physical_redemption_minimum.includes('400 troy oz'), 'Redemption min must be 400 oz');
  passed++;
  console.log('  [PASS] 6.2: Conversion desk indicative quote & Brink\'s bullion bailment custody terms verified.');

  // 3. Retail Broker-Routed Market Profile & Non-DMA Invariant
  const rhObs = marketStructureRegistry.getObservation('robinhood_financial:NVDA-USD:broker_equity');
  assert(Boolean(rhObs), 'Robinhood equity observation must exist');
  assert(rhObs!.market_structure === 'BROKER_ROUTED', 'Structure must be BROKER_ROUTED');
  const rhData = rhObs!.data as any;
  assert(rhData.execution_routing_model === 'PAYMENT_FOR_ORDER_FLOW', 'Execution model must be PFOF');
  assert(rhData.direct_market_access_supported === false, 'Direct market access must be false');
  assert(rhData.level_2_depth_visible === false, 'L2 depth visible must be false');
  passed++;
  console.log('  [PASS] 6.3: Retail broker-routed execution profile & zero DMA invariant verified.');

  // 4. CFTC Derivative Contract Specifications (CME MBT)
  const cmeObs = marketStructureRegistry.getObservation('cme_group:MBT-FUT-2026M11:calendar_futures');
  assert(Boolean(cmeObs), 'CME MBT observation must exist');
  assert(cmeObs!.market_structure === 'CFTC_DERIVATIVE_DCM', 'Structure must be CFTC_DERIVATIVE_DCM');
  const cmeData = cmeObs!.data as any;
  assert(cmeData.contract_size_multiplier === 0.1, 'Micro Bitcoin contract size must be 0.1 BTC');
  assert(cmeData.settlement_method === 'CASH_SETTLED', 'Settlement must be CASH_SETTLED');
  assert(cmeData.clearing_house_entity.includes('CME Clearing'), 'Clearing house must be CME Clearing');
  assert(cmeData.tick_value_usd === 0.50, 'Tick value must be $0.50');
  passed++;
  console.log('  [PASS] 6.4: CFTC DCM derivative contract specifications & CME Clearing attribution verified.');

  // 5. Decentralized Liquidity (DEX / AMM) Concentrated Pool Reserves
  const ammObs = marketStructureRegistry.getObservation('uniswap_v3:USDC-WETH:amm_pool');
  assert(Boolean(ammObs), 'Uniswap v3 AMM observation must exist');
  assert(ammObs!.market_structure === 'AMM_POOL', 'Structure must be AMM_POOL');
  const ammData = ammObs!.data as AmmPoolStateObservation;
  assert(ammData.amm_model === 'CONCENTRATED_LIQUIDITY_V3', 'AMM model must be CONCENTRATED_LIQUIDITY_V3');
  assert(ammData.chain_id === 1, 'Chain must be Ethereum Mainnet (1)');
  assert(Boolean(ammData.concentrated_liquidity_params?.sqrt_price_x96), 'sqrt_price_x96 must exist');
  assert(ammData.fee_tier_bps === 5.0, 'Fee tier must be 5 bps');
  assert(ammData.observed_block_number > 0, 'Observed block number must be > 0');
  assert(Boolean(ammData.observed_block_hash), 'Block hash must be populated');
  passed++;
  console.log('  [PASS] 6.5: Decentralized liquidity concentrated pool state & block freshness verified.');

  // 6. Freshness Status & Stale Observation Detection Engine
  const baseTime = Date.now();
  const tFresh = new Date(baseTime - 2000).toISOString();    // 2s old -> FRESH for CLOB (TTL 15s)
  const tAging = new Date(baseTime - 10000).toISOString();   // 10s old -> AGING for CLOB
  const tStale = new Date(baseTime - 20000).toISOString();   // 20s old -> STALE for CLOB
  const tExpired = new Date(baseTime - 60000).toISOString(); // 60s old -> EXPIRED for CLOB

  const evalFresh = StaleObservationDetector.evaluateFreshness('CLOB', tFresh);
  const evalAging = StaleObservationDetector.evaluateFreshness('CLOB', tAging);
  const evalStale = StaleObservationDetector.evaluateFreshness('CLOB', tStale);
  const evalExpired = StaleObservationDetector.evaluateFreshness('CLOB', tExpired);

  assert(evalFresh.status === 'FRESH' && !evalFresh.isStale, '2s old CLOB must be FRESH');
  assert(evalAging.status === 'AGING' && !evalAging.isStale, '10s old CLOB must be AGING');
  assert(evalStale.status === 'STALE' && evalStale.isStale, '20s old CLOB must be STALE');
  assert(evalExpired.status === 'EXPIRED' && evalExpired.isStale, '60s old CLOB must be EXPIRED');
  passed++;
  console.log('  [PASS] 6.6: StaleObservationDetector multi-tier freshness SLA evaluation verified.');

  console.log(`  Summary: ${passed} Market Structure Tests Passed.\n`);
  return { passed, failed: 0 };
}
