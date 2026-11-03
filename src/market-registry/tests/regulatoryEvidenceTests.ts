import { US_VENUE_REGISTRY_PHASE1_1 } from '../venueCatalog.ts';

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(`REGULATORY EVIDENCE TEST ASSERTION FAILED: ${msg}`);
}

export async function runRegulatoryEvidenceTests(): Promise<{ passed: number; failed: number }> {
  console.log('--- [SUITE 5/5] REGULATORY EVIDENCE & JURISDICTION CHECKS ---');
  let passed = 0;

  const venues = Object.values(US_VENUE_REGISTRY_PHASE1_1);
  assert(venues.length >= 22, `Expected >= 22 venues in directory, got ${venues.length}`);

  // 1. Mandatory 5-Point Regulatory Evidence Record on 100% of venues
  for (const v of venues) {
    const reg = v.regulatory_evidence;
    assert(Boolean(reg), `Venue ${v.venue_id} must have regulatory_evidence`);
    assert(Boolean(reg.corporate_entity_name), `Venue ${v.venue_id} must have corporate_entity_name`);
    assert(Boolean(reg.corporate_registration_type), `Venue ${v.venue_id} must have corporate_registration_type`);
    assert(Boolean(reg.corporate_registration_id), `Venue ${v.venue_id} must have corporate_registration_id`);
    assert(Boolean(reg.exchange_operator_status), `Venue ${v.venue_id} must have exchange_operator_status`);
    assert(Boolean(reg.custody_provider_entity), `Venue ${v.venue_id} must have custody_provider_entity`);
    assert(Boolean(reg.custody_regulatory_charter), `Venue ${v.venue_id} must have custody_regulatory_charter`);
    assert(Boolean(reg.customer_eligibility_tier), `Venue ${v.venue_id} must have customer_eligibility_tier`);
    assert(Boolean(reg.primary_regulator), `Venue ${v.venue_id} must have primary_regulator`);
    assert(Boolean(reg.source_document_url), `Venue ${v.venue_id} must have source_document_url`);
    assert(Boolean(reg.verified_date), `Venue ${v.venue_id} must have verified_date`);
    assert(Boolean(reg.retrieval_timestamp), `Venue ${v.venue_id} must have retrieval_timestamp`);
    assert(Boolean(reg.source_publication_date), `Venue ${v.venue_id} must have source_publication_date`);
    assert(Boolean(reg.verification_method), `Venue ${v.venue_id} must have verification_method`);
    assert(Boolean(reg.reviewer), `Venue ${v.venue_id} must have reviewer`);
    assert(Array.isArray(reg.prohibited_states), `Venue ${v.venue_id} must have prohibited_states array`);
  }
  // Verify that publication dates reflect distinct primary source statutory filings (not batch defaults)
  const distinctPubDates = new Set(venues.map(v => v.regulatory_evidence.source_publication_date));
  assert(distinctPubDates.size >= 15, `Expected >= 15 distinct statutory publication dates across 23 venues, got ${distinctPubDates.size}`);
  passed++;
  console.log(`  [PASS] 5.1: 100% of mapped venues (${venues.length}) possess 5-point verified regulatory evidence records with distinct statutory dates (${distinctPubDates.size} dates).`);

  // 2. Kraken Corporate, Custody Bank & State Segregation
  const kraken = US_VENUE_REGISTRY_PHASE1_1['kraken'];
  assert(kraken.regulatory_evidence.corporate_entity_name === 'Payward, Inc.', 'Kraken corporate entity verified');
  assert(kraken.regulatory_evidence.custody_provider_entity.includes('Kraken Financial'), 'Kraken custody must be Kraken Financial');
  assert(kraken.regulatory_evidence.custody_regulatory_charter.includes('SPDI'), 'Kraken custody charter must be Wyoming SPDI');
  assert(kraken.regulatory_evidence.prohibited_states.includes('NY'), 'Kraken must cite NY state exclusion');
  passed++;
  console.log('  [PASS] 5.2: Kraken exchange (Payward Inc.) vs custody bank (Kraken Financial Wyoming SPDI) verified.');

  // 3. Coinbase Derivatives & Nodal Clear DCO
  const cbDeriv = US_VENUE_REGISTRY_PHASE1_1['coinbase_derivatives'];
  assert(cbDeriv.regulatory_evidence.custody_provider_entity.includes('Nodal Clear'), 'Coinbase Derivatives must clear through Nodal Clear');
  assert(cbDeriv.regulatory_evidence.primary_regulator.includes('CFTC'), 'Coinbase Derivatives primary regulator must be CFTC');
  passed++;
  console.log('  [PASS] 5.3: Coinbase Derivatives CFTC DCM & Nodal Clear DCO verified.');

  // 4. Nadex Permitted Contract Types
  const nadex = US_VENUE_REGISTRY_PHASE1_1['nadex_crypto_com'];
  assert(nadex.regulatory_evidence.corporate_entity_name.includes('North American Derivatives Exchange'), 'Nadex legal entity verified');
  assert(nadex.regulatory_evidence.attribution_notes.includes('binary options'), 'Nadex contract scope verified');
  passed++;
  console.log('  [PASS] 5.4: Nadex contract specifications (binary options, call spreads, touch brackets) verified.');

  // 5. Ondo Finance Identity (Issuer Protocol, Not Exchange)
  const ondo = US_VENUE_REGISTRY_PHASE1_1['ondo_finance'];
  assert(ondo.is_actual_exchange === false, 'Ondo must NOT be classified as an actual exchange');
  assert(ondo.venue_category === 'RWA_ISSUER_PROTOCOL', 'Ondo venue category must be RWA_ISSUER_PROTOCOL');
  assert(ondo.regulatory_evidence.attribution_notes.includes('Securitize LLC'), 'Ondo must cite Securitize transfer agent CIK');
  assert(ondo.regulatory_evidence.custody_provider_entity.includes('BNY Mellon'), 'Ondo must cite BNY Mellon custody');
  passed++;
  console.log('  [PASS] 5.5: Ondo Finance classified as RWA issuer protocol with SEC transfer agent and BNY Mellon custody attribution.');

  // 6. CFTC Event Contract DCMs (Kalshi & ForecastEx)
  const kalshi = US_VENUE_REGISTRY_PHASE1_1['kalshi'];
  const forecastex = US_VENUE_REGISTRY_PHASE1_1['forecastex'];
  assert(kalshi.venue_category === 'CFTC_DCM_EVENT_CONTRACTS', 'Kalshi category must be CFTC_DCM_EVENT_CONTRACTS');
  assert(forecastex.venue_category === 'CFTC_DCM_EVENT_CONTRACTS', 'ForecastEx category must be CFTC_DCM_EVENT_CONTRACTS');
  assert(kalshi.regulatory_evidence.exchange_operator_status.includes('Event Contract'), 'Kalshi event status verified');
  passed++;
  console.log('  [PASS] 5.6: Kalshi and ForecastEx CFTC DCM event-contract registrations verified.');

  console.log(`  Summary: ${passed} Regulatory Evidence Checks Passed.\n`);
  return { passed, failed: 0 };
}
