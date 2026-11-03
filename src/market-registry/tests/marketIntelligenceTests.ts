/**
 * AEGENTIX MARKET INTELLIGENCE TESTS (PHASE 1.3)
 * 
 * Comprehensive test suite verifying the 5 core deliverables of the Sovereign Market Intelligence Engine:
 * 1. Cross-venue price comparison and median benchmark calculations
 * 2. Order-book depth aggregation, slippage modeling ($10k-$500k), and HHI concentration
 * 3. Price discrepancy and anomaly detection (Basis, Spreads, Stale Divergence)
 * 4. Opportunity scoring with freshness penalties and evidence quality weights
 * 5. Sovereign read-only feed publication for the AEGENTIX super-agent
 * 
 * Strict Sovereign Boundary:
 * execution_authorized: false is permanently enforced across all models.
 */

import { strict as assert } from 'assert';
import { SovereignMarketIntelligenceEngine } from '../intelligence/marketIntelligenceEngine.ts';

export async function runMarketIntelligenceTests(): Promise<{ passed: number; failed: number }> {
  let passed = 0;
  let failed = 0;

  console.log('\n--- [SUITE 7/7] SOVEREIGN MARKET INTELLIGENCE ENGINE (PHASE 1.3) ---');

  const engine = new SovereignMarketIntelligenceEngine();

  // Test 7.1: Cross-venue price comparison & median benchmark calculation
  try {
    const btcComp = engine.comparePrices('BTC');
    assert(btcComp.base_asset === 'BTC', 'Base asset must be BTC');
    assert(btcComp.venues_compared_count >= 5, `Expected >= 5 BTC venues, got ${btcComp.venues_compared_count}`);
    assert(btcComp.benchmark_price_usd > 60000, 'BTC benchmark price should be > $60,000');
    assert(btcComp.benchmark_source === 'CLOB_SPOT_MEDIAN', 'Benchmark source must be CLOB_SPOT_MEDIAN');
    assert(btcComp.max_price_dispersion_bps > 0, 'Price dispersion should be non-zero');
    assert(btcComp.lowest_ask_venue !== 'NONE', 'Lowest ask venue must be identified');
    assert(btcComp.highest_bid_venue !== 'NONE', 'Highest bid venue must be identified');

    // Verify individual venue deviations
    for (const vp of btcComp.venue_prices) {
      assert(typeof vp.deviation_from_benchmark_usd === 'number', 'Deviation USD must be numeric');
      assert(typeof vp.deviation_from_benchmark_bps === 'number', 'Deviation bps must be numeric');
      assert(vp.is_stale === false, 'Fresh observations must not be marked stale');
    }

    console.log('  [PASS] 7.1: Cross-venue price comparison & median benchmark verified.');
    passed++;
  } catch (err: any) {
    console.error('  [FAIL] 7.1: Cross-venue price comparison failed:', err.message);
    failed++;
  }

  // Test 7.2: Order-book depth aggregation and HHI concentration index
  try {
    const btcDepth = engine.analyzeDepth('BTC');
    assert(btcDepth.base_asset === 'BTC', 'Base asset must be BTC');
    assert(btcDepth.clob_venues_count >= 4, `Expected >= 4 CLOB venues, got ${btcDepth.clob_venues_count}`);
    assert(btcDepth.total_available_bid_depth_usd > 1000000, 'Total bid depth should exceed $1M');
    assert(btcDepth.total_available_ask_depth_usd > 1000000, 'Total ask depth should exceed $1M');
    assert(btcDepth.liquidity_concentration_index_hhi > 0 && btcDepth.liquidity_concentration_index_hhi <= 10000, 'HHI must be in range 0-10000');
    assert(btcDepth.thin_orderbook_warning === false, 'Deep BTC books must not trigger thin orderbook warning');
    assert(btcDepth.primary_liquidity_venue !== 'NONE', 'Primary venue must be identified');

    console.log(`  [PASS] 7.2: Order-book depth aggregation & HHI concentration verified (HHI: ${btcDepth.liquidity_concentration_index_hhi}).`);
    passed++;
  } catch (err: any) {
    console.error('  [FAIL] 7.2: Order-book depth aggregation failed:', err.message);
    failed++;
  }

  // Test 7.3: Multi-tier slippage modeling across notional sizes ($10k-$500k)
  try {
    const btcDepth = engine.analyzeDepth('BTC');
    assert(btcDepth.depth_tiers.length === 4, 'Must evaluate 4 notional tiers');
    
    const [tier10k, tier50k, tier100k, tier500k] = btcDepth.depth_tiers;
    assert(tier10k.notional_usd === 10000, 'Tier 1 must be $10k');
    assert(tier50k.notional_usd === 50000, 'Tier 2 must be $50k');
    assert(tier100k.notional_usd === 100000, 'Tier 3 must be $100k');
    assert(tier500k.notional_usd === 500000, 'Tier 4 must be $500k');

    // Monotonic slippage increase with size
    assert(tier10k.estimated_slippage_bid_bps < tier50k.estimated_slippage_bid_bps, 'Slippage must increase with size');
    assert(tier50k.estimated_slippage_bid_bps < tier100k.estimated_slippage_bid_bps, 'Slippage must increase with size');
    assert(tier100k.estimated_slippage_bid_bps < tier500k.estimated_slippage_bid_bps, 'Slippage must increase with size');
    assert(tier10k.executable_depth_sufficient === true, '$10k must be executable');
    assert(tier500k.executable_depth_sufficient === true, '$500k must be executable across aggregate depth');

    console.log('  [PASS] 7.3: Multi-tier slippage modeling ($10k-$500k) verified.');
    passed++;
  } catch (err: any) {
    console.error('  [FAIL] 7.3: Multi-tier slippage modeling failed:', err.message);
    failed++;
  }

  // Test 7.4: Discrepancy detector identifies CME futures vs spot calendar basis
  try {
    const discrepancies = engine.detectDiscrepancies(5);
    const basisDisc = discrepancies.find(d => d.type === 'SPOT_VS_FUTURES_BASIS');
    assert(basisDisc, 'Must detect CME spot vs futures basis discrepancy');
    assert(basisDisc!.venue_a === 'coinbase', 'Spot venue must be Coinbase');
    assert(basisDisc!.venue_b === 'cme_group', 'Futures venue must be CME Group');
    assert(basisDisc!.discrepancy_bps > 50, 'Futures basis should exceed 50 bps contango');
    assert(basisDisc!.annualized_basis_pct !== undefined && basisDisc!.annualized_basis_pct > 0, 'Must calculate annualized basis yield');
    assert(basisDisc!.days_to_expiration === 27, 'Must report days to expiration');
    assert(basisDisc!.anomalous_flag === false, 'Standard contango should not be flagged anomalous');

    console.log(`  [PASS] 7.4: CME spot vs futures basis verified (${basisDisc!.discrepancy_bps} bps, ${basisDisc!.annualized_basis_pct}% ann.).`);
    passed++;
  } catch (err: any) {
    console.error('  [FAIL] 7.4: CME spot vs futures basis detection failed:', err.message);
    failed++;
  }

  // Test 7.5: Discrepancy detector identifies cross-exchange spread (Binance.US vs Coinbase)
  try {
    const discrepancies = engine.detectDiscrepancies(5);
    const spreadDisc = discrepancies.find(d => d.type === 'CROSS_EXCHANGE_SPREAD');
    assert(spreadDisc, 'Must detect cross-exchange spread');
    assert(spreadDisc!.venue_a === 'coinbase' && spreadDisc!.venue_b === 'binance_us', 'Venues must match Coinbase and Binance.US');
    assert(spreadDisc!.discrepancy_bps >= 5, 'Spread must exceed threshold');
    assert(spreadDisc!.severity === 'MEDIUM' || spreadDisc!.severity === 'HIGH', 'Severity must be evaluated');

    console.log(`  [PASS] 7.5: Cross-exchange spread verified (${spreadDisc!.discrepancy_bps} bps).`);
    passed++;
  } catch (err: any) {
    console.error('  [FAIL] 7.5: Cross-exchange spread detection failed:', err.message);
    failed++;
  }

  // Test 7.6: Conversion desk bullion premium evaluation (Uphold Brink's custody)
  try {
    const discrepancies = engine.detectDiscrepancies(5);
    const convDisc = discrepancies.find(d => d.type === 'CONVERSION_DESK_PREMIUM');
    assert(convDisc, 'Must detect conversion desk bullion premium');
    assert(convDisc!.venue_a === 'uphold', 'Venue must be Uphold');
    assert(convDisc!.discrepancy_bps > 40, 'Bullion markup should reflect physical custody spread');
    assert(convDisc!.description.includes("Brink's"), 'Description must cite Brink\'s physical vault custody');

    console.log(`  [PASS] 7.6: Conversion desk bullion premium verified (${convDisc!.discrepancy_bps} bps markup).`);
    passed++;
  } catch (err: any) {
    console.error('  [FAIL] 7.6: Conversion desk bullion premium failed:', err.message);
    failed++;
  }

  // Test 7.7: Opportunity scoring engine applies freshness penalties & non-execution invariant
  try {
    const opportunities = engine.scoreOpportunities();
    assert(opportunities.length >= 2, `Expected >= 2 scored opportunities, got ${opportunities.length}`);
    
    for (const opp of opportunities) {
      assert(opp.execution_authorized === false, 'IMMUTABLE INVARIANT: execution_authorized must be false');
      assert(opp.composite_opportunity_score >= 0 && opp.composite_opportunity_score <= 100, 'Score must be in 0-100 range');
      assert(opp.evidence_quality_score > 0, 'Evidence quality score must be positive');
      assert(opp.confidence_score > 0, 'Confidence score must be positive');
      assert(opp.actionable_insight.length > 10, 'Actionable insight must be populated');
      assert(opp.risk_factors.length > 0, 'Risk factors must be documented');
      assert(opp.score_breakdown, 'Disaggregated score breakdown must be present');
      assert(opp.score_breakdown.assumptions.length > 0, 'Assumptions must be disclosed');
      assert(opp.score_breakdown.missing_live_inputs.length > 0, 'Missing live inputs must be disclosed');
    }

    // Top opportunity should be the basis carry yield
    assert(opportunities[0].strategy_type === 'BASIS_CARRY_YIELD', 'Top opportunity should be basis carry yield');

    console.log(`  [PASS] 7.7: Opportunity scoring verified (Top Score: ${opportunities[0].composite_opportunity_score}, Strategy: ${opportunities[0].strategy_type}).`);
    passed++;
  } catch (err: any) {
    console.error('  [FAIL] 7.7: Opportunity scoring failed:', err.message);
    failed++;
  }

  // Test 7.8: Super-Agent Read-Only Intelligence Feed publication
  try {
    const feed = engine.generateSuperAgentFeed();
    assert(feed.feed_id.startsWith('feed:aegentix:'), 'Feed ID must be correctly formatted');
    assert(feed.system_phase.includes('Phase 1.3'), 'Feed must reference Phase 1.3');
    assert(feed.sovereign_execution_policy.execution_authorized === false, 'FEED INVARIANT: execution_authorized must be false');
    assert(feed.sovereign_execution_policy.mode === 'READ_ONLY_INTELLIGENCE', 'Mode must be READ_ONLY_INTELLIGENCE');
    assert(feed.sovereign_execution_policy.human_oversight_required === true, 'Human oversight must be required');
    assert(feed.summary_metrics.assets_monitored >= 4, 'Must monitor at least 4 assets');
    assert(feed.summary_metrics.aggregate_liquidity_monitored_usd > 1000000, 'Monitored liquidity must exceed $1M');
    assert(Object.keys(feed.price_comparisons).length >= 4, 'Must contain price comparisons for monitored assets');
    assert(Object.keys(feed.liquidity_analyses).length >= 2, 'Must contain liquidity depth analyses');

    console.log('  [PASS] 7.8: Super-Agent Read-Only Intelligence Feed publication verified.');
    passed++;
  } catch (err: any) {
    console.error('  [FAIL] 7.8: Super-Agent Intelligence Feed publication failed:', err.message);
    failed++;
  }

  return { passed, failed };
}

if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  runMarketIntelligenceTests().then(res => {
    console.log(`\nMarket Intelligence Suite Completed: ${res.passed} passed, ${res.failed} failed.`);
    process.exit(res.failed > 0 ? 1 : 0);
  });
}
