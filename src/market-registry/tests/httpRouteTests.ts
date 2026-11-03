function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(`HTTP ROUTE ACCEPTANCE TEST ASSERTION FAILED: ${msg}`);
}

const BASE_URL = 'http://localhost:3000';

export async function runHttpRouteTests(): Promise<{ passed: number; failed: number }> {
  console.log('--- [SUITE 3/5] HTTP ROUTE ACCEPTANCE TESTS: Live Endpoints & Query Filtering ---');
  let passed = 0;

  // 1. GET /api/market/discovery/overview
  const overviewResp = await fetch(`${BASE_URL}/api/market/discovery/overview`);
  assert(overviewResp.status === 200, `GET /api/market/discovery/overview must return 200, got ${overviewResp.status}`);
  const overviewJson: any = await overviewResp.json();
  assert(overviewJson.success === true, 'Response success must be true');
  assert(overviewJson.overview.system === 'AEGENTIX_UNIFIED_MARKET_DISCOVERY_SYSTEM', 'System identifier match');
  assert(Boolean(overviewJson.overview.initialization_state), 'initialization_state must be present');
  assert(Boolean(overviewJson.overview.evidence_origin_breakdown), 'evidence_origin_breakdown must be present');
  assert(overviewJson.overview.evidence_origin_breakdown.LOCAL_FIXTURE > 0, 'LOCAL_FIXTURE counts must be explicitly disclosed');
  assert(overviewJson.overview.treasury_policy_invariant === 'DISCOVERY_NEVER_AUTHORIZES_TRADING_OR_TREASURY_CUSTODY', 'Treasury invariant confirmed');
  passed++;
  console.log('  [PASS] 3.1: GET /api/market/discovery/overview live schema & evidence disclosure verified.');

  // 2. GET /api/market/discovery/instruments (Query Filtering)
  const usdcFilterResp = await fetch(`${BASE_URL}/api/market/discovery/instruments?quote_asset=USDC`);
  assert(usdcFilterResp.status === 200, 'Instruments USDC filter must return 200');
  const usdcJson: any = await usdcFilterResp.json();
  assert(usdcJson.total_matched > 0, 'Should match USDC instruments');
  assert(usdcJson.instruments.every((i: any) => i.quote_asset === 'USDC'), 'All returned instruments must have quote_asset USDC');
  assert(usdcJson.instruments.every((i: any) => i.execution_authorized === false), 'All returned instruments must have execution_authorized: false');
  passed++;
  console.log(`  [PASS] 3.2: GET /api/market/discovery/instruments?quote_asset=USDC verified (${usdcJson.total_matched} matches).`);

  // 3. GET /api/market/discovery/instruments?venue=coinbase
  const cbFilterResp = await fetch(`${BASE_URL}/api/market/discovery/instruments?venue=coinbase`);
  assert(cbFilterResp.status === 200, 'Instruments Coinbase filter must return 200');
  const cbJson: any = await cbFilterResp.json();
  assert(cbJson.total_matched > 0, 'Should match Coinbase instruments');
  assert(cbJson.instruments.every((i: any) => i.venue === 'coinbase'), 'All returned instruments must have venue coinbase');
  passed++;
  console.log(`  [PASS] 3.3: GET /api/market/discovery/instruments?venue=coinbase verified (${cbJson.total_matched} matches).`);

  // 3b. GET /api/market/discovery/instruments?venue=bitstamp
  const bsFilterResp = await fetch(`${BASE_URL}/api/market/discovery/instruments?venue=bitstamp`);
  assert(bsFilterResp.status === 200, 'Instruments Bitstamp filter must return 200');
  const bsJson: any = await bsFilterResp.json();
  assert(bsJson.total_matched > 0, 'Should match Bitstamp instruments');
  assert(bsJson.instruments.every((i: any) => i.venue === 'bitstamp'), 'All returned instruments must have venue bitstamp');
  passed++;
  console.log(`  [PASS] 3.4: GET /api/market/discovery/instruments?venue=bitstamp verified (${bsJson.total_matched} matches).`);

  // 3c. GET /api/market/discovery/instruments?venue=uphold
  const uphFilterResp = await fetch(`${BASE_URL}/api/market/discovery/instruments?venue=uphold`);
  assert(uphFilterResp.status === 200, 'Instruments Uphold filter must return 200');
  const uphJson: any = await uphFilterResp.json();
  assert(uphJson.total_matched > 0, 'Should match Uphold instruments');
  assert(uphJson.instruments.every((i: any) => i.market_type === 'digital_ledger_entitlement'), 'Uphold must have market_type digital_ledger_entitlement');
  passed++;
  console.log(`  [PASS] 3.5: GET /api/market/discovery/instruments?venue=uphold verified (${uphJson.total_matched} conversion desk entitlements).`);

  // 4. GET /api/market/discovery/venues
  const venuesResp = await fetch(`${BASE_URL}/api/market/discovery/venues`);
  assert(venuesResp.status === 200, 'Venues directory must return 200');
  const venuesJson: any = await venuesResp.json();
  assert(venuesJson.total_venues >= 22, `Expected >= 22 venues mapped, got ${venuesJson.total_venues}`);
  const krakenVenue = venuesJson.venues.find((v: any) => v.venue_id === 'kraken');
  assert(Boolean(krakenVenue), 'Kraken venue profile must exist');
  assert(krakenVenue.regulatory_evidence.primary_regulator.includes('Wyoming'), 'Kraken regulatory evidence must cite Wyoming SPDI');
  passed++;
  console.log(`  [PASS] 3.6: GET /api/market/discovery/venues verified (${venuesJson.total_venues} mapped venues with regulatory evidence).`);

  // 5. GET /api/market/discovery/stablecoins
  const stablecoinsResp = await fetch(`${BASE_URL}/api/market/discovery/stablecoins`);
  assert(stablecoinsResp.status === 200, 'Stablecoins endpoint must return 200');
  const stablecoinsJson: any = await stablecoinsResp.json();
  assert(stablecoinsJson.quote_currencies.length === 10, `Expected 10 cataloged quote currencies, got ${stablecoinsJson.quote_currencies.length}`);
  passed++;
  console.log('  [PASS] 3.7: GET /api/market/discovery/stablecoins verified (10 quote assets cataloged).');

  // 6. GET /api/market/discovery/coverage
  const coverageResp = await fetch(`${BASE_URL}/api/market/discovery/coverage?base_asset=BTC`);
  assert(coverageResp.status === 200, 'Coverage endpoint must return 200');
  const coverageJson: any = await coverageResp.json();
  assert(coverageJson.total_symbol_collisions > 0, 'Should return symbol collisions for BTC');
  assert(coverageJson.coverage[0].venues_carrying.length >= 3, 'BTC must exist across >= 3 venues');
  passed++;
  console.log(`  [PASS] 3.8: GET /api/market/discovery/coverage?base_asset=BTC verified (${coverageJson.coverage[0].venues_carrying.length} venues carry BTC).`);

  // 7. POST /api/market/discovery/refresh
  const refreshResp = await fetch(`${BASE_URL}/api/market/discovery/refresh`, { method: 'POST' });
  assert(refreshResp.status === 200, 'Refresh endpoint must return 200');
  const refreshJson: any = await refreshResp.json();
  assert(refreshJson.success === true, 'Refresh must succeed');
  assert(Boolean(refreshJson.report), 'Refresh must return full coverage report');
  passed++;
  console.log('  [PASS] 3.9: POST /api/market/discovery/refresh read-only refresh verified.');

  console.log(`  Summary: ${passed} HTTP Route Acceptance Tests Passed.\n`);
  return { passed, failed: 0 };
}
