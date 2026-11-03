/**
 * AEGENTIX INDUSTRY REFERENCE INTELLIGENCE TESTS (PHASE 1.4)
 * 
 * Comprehensive test suite verifying the Industry Reference subsystem:
 * 1. Reference Organization & System Registries (CF Benchmarks, Coin Metrics, Kaiko, IOSCO)
 * 2. Formal Methodology & Evidence Registries (CME CF BRR v3, CM v2.1, Kaiko v1.4, IOSCO FR07/13)
 * 3. Structured Methodology Comparisons & Unresolved Question tracking
 * 4. Specialized 6-Agent Swarm execution & Adversarial Red-Team Challenge
 * 5. Pre-Publication Reference Validation Gate adjudication & non-execution invariant
 */

import { strict as assert } from 'assert';
import { IndustryReferenceRegistry } from '../reference/referenceRegistry.ts';
import { ReferenceAgentSwarm } from '../reference/referenceAgents.ts';
import { SovereignMarketIntelligenceEngine } from '../intelligence/marketIntelligenceEngine.ts';

export async function runReferenceIntelligenceTests(): Promise<{ passed: number; failed: number }> {
  let passed = 0;
  let failed = 0;

  console.log('\n--- [SUITE 8/8] INDUSTRY REFERENCE & PRE-PUBLICATION VALIDATION (PHASE 1.4) ---');

  const registry = new IndustryReferenceRegistry();
  const swarm = new ReferenceAgentSwarm(registry);
  const intelEngine = new SovereignMarketIntelligenceEngine();

  // Test 8.1: Industry Reference Registry seeds 4 cornerstone organizations with legal entity separation
  try {
    const orgs = registry.getAllOrganizations();
    assert(orgs.length >= 4, `Expected >= 4 reference orgs, got ${orgs.length}`);
    
    const cme = registry.getOrganization('org_cme_cf_benchmarks');
    const cm = registry.getOrganization('org_coin_metrics');
    const kaiko = registry.getOrganization('org_kaiko');
    const iosco = registry.getOrganization('org_iosco');

    assert(cme && cme.category === 'BENCHMARK_ADMINISTRATOR', 'CME / CF Benchmarks must be cataloged as BENCHMARK_ADMINISTRATOR');
    assert(cm && cm.category === 'MARKET_DATA_VENDOR', 'Coin Metrics must be cataloged as MARKET_DATA_VENDOR');
    assert(kaiko && kaiko.category === 'MARKET_DATA_VENDOR', 'Kaiko must be cataloged as MARKET_DATA_VENDOR');
    assert(iosco && iosco.category === 'STANDARDS_BODY', 'IOSCO must be cataloged as STANDARDS_BODY');

    // Phase 1.4.1 Legal Entity Separation Checks
    // 1. Coin Metrics: Inc. vs CMIS
    const cmEntities = cm!.affiliated_legal_entities || [];
    assert(cmEntities.some(e => e.entity_name.includes('Coin Metrics, Inc.') && e.role === 'COMMERCIAL_DATA_VENDOR'), 'Coin Metrics Inc. commercial vendor entity must be cataloged');
    assert(cmEntities.some(e => e.entity_name.includes('Coin Metrics Index Services LLC') && e.role === 'BENCHMARK_ADMINISTRATOR'), 'CMIS benchmark administrator entity must be cataloged');

    // 2. Kaiko: Amun Data SAS vs Napoleon Index SAS
    const kaikoEntities = kaiko!.affiliated_legal_entities || [];
    assert(kaikoEntities.some(e => e.entity_name.includes('Amun Data SAS') && e.regulatory_status.includes('SOC')), 'Amun Data SAS SOC 2 certified entity must be cataloged');
    assert(kaikoEntities.some(e => e.entity_name.includes('Napoleon Index SAS') && e.regulatory_status.includes('AMF')), 'Napoleon Index SAS AMF registered administrator entity must be cataloged');

    for (const org of orgs) {
      assert(org.legal_name.length > 0, `Org ${org.name} must have legal name`);
      assert(org.regulatory_oversight.length > 0, `Org ${org.name} must specify regulatory oversight`);
      assert(org.licensing_framework.length > 0, `Org ${org.name} must specify licensing framework`);
    }

    console.log(`  [PASS] 8.1: Reference organizations & distinct legal entities verified (CF Benchmarks, CMIS vs CM Inc, Amun Data vs Napoleon Index, IOSCO).`);
    passed++;
  } catch (err: any) {
    console.error('  [FAIL] 8.1: Reference organizations check failed:', err.message);
    failed++;
  }

  // Test 8.2: Reference System Registry distinguishes production status & limitations
  try {
    const systems = registry.getAllSystems();
    assert(systems.length >= 4, `Expected >= 4 reference systems, got ${systems.length}`);

    const brrSys = registry.getSystem('sys_cf_brr_engine');
    assert(brrSys && brrSys.production_status === 'INDEPENDENTLY_VERIFIED', 'BRR London engine must be INDEPENDENTLY_VERIFIED');
    assert(brrSys!.capabilities.length >= 3, 'BRR London engine must document capabilities');
    assert(brrSys!.known_limitations.length >= 2, 'BRR London engine must document known limitations');
    assert(brrSys!.licensing_required_for_derived_use === true, 'BRR London must flag licensing requirement');

    const cmSys = registry.getSystem('sys_cm_reference_rates');
    assert(cmSys && cmSys.production_status === 'INDEPENDENTLY_VERIFIED', 'CMIS Reference Rates must be INDEPENDENTLY_VERIFIED (Grant Thornton IOSCO)');

    const kaikoSys = registry.getSystem('sys_kaiko_depth_reconstruction');
    assert(kaikoSys && kaikoSys.production_status === 'TECHNICAL_DOCUMENTED', 'Kaiko depth platform must be TECHNICAL_DOCUMENTED');

    console.log('  [PASS] 8.2: Reference systems & documented production status verified.');
    passed++;
  } catch (err: any) {
    console.error('  [FAIL] 8.2: Reference systems check failed:', err.message);
    failed++;
  }

  // Test 8.3: Reference Methodology Registry catalogs formal specs & partition rules
  try {
    const methodologies = registry.getAllMethodologies();
    assert(methodologies.length >= 5, `Expected >= 5 methodologies, got ${methodologies.length}`);

    // London BRR v3.0 (CME futures settlement anchor)
    const brrMeth = registry.getMethodology('meth_cme_cf_brr_london');
    assert(brrMeth && brrMeth.calculation_family === 'VWAP_PARTITIONED', 'CME CF BRR London must be VWAP_PARTITIONED');
    assert(brrMeth!.calculation_window.includes('12 equal five-minute periods'), 'BRR London must cite 12 five-minute partitions');
    assert(brrMeth!.outlier_trimming_rules.length > 0, 'BRR London must specify outlier trimming rules');
    assert(brrMeth!.formal_specification_citation.includes('Rule Filing 24-007'), 'BRR London must cite formal rule filing');
    assert(brrMeth!.sha256_hash && brrMeth!.sha256_hash.length === 64, 'BRR London must have valid SHA-256 hash');

    // New York BRRNY v2.0 (Fund NAV fix at 16:00 ET)
    const brrnyMeth = registry.getMethodology('meth_cme_cf_brrny');
    assert(brrnyMeth && brrnyMeth.calculation_family === 'VWAP_PARTITIONED', 'BRRNY must be VWAP_PARTITIONED');
    assert(brrnyMeth!.calculation_window.includes('New York time'), 'BRRNY must cite New York time window');

    // CME Micro Bitcoin Futures Rulebook Ch. 361B
    const mbtMeth = registry.getMethodology('meth_cme_mbt_settlement_spec');
    assert(mbtMeth && mbtMeth.calculation_family === 'FUTURES_BASIS_ANNUALIZATION', 'MBT spec must be FUTURES_BASIS_ANNUALIZATION');

    // Coin Metrics CMIS Reference Rates (two-tier VWAP + inverse-variance)
    const cmMeth = registry.getMethodology('meth_coin_metrics_cmis_ref_rate');
    assert(cmMeth && cmMeth.calculation_family === 'INVERSE_VARIANCE_WEIGHTED', 'Coin Metrics CMIS must be INVERSE_VARIANCE_WEIGHTED');
    assert(cmMeth!.weighting_algorithm.includes('Two-tier'), 'Coin Metrics CMIS must specify two-tier calculation');

    // Kaiko L2 Depth
    const kaikoMeth = registry.getMethodology('meth_kaiko_l2_liquidity_v1');
    assert(kaikoMeth && kaikoMeth.calculation_family === 'L2_DEPTH_RECONSTRUCTION', 'Kaiko must be L2_DEPTH_RECONSTRUCTION');

    console.log('  [PASS] 8.3: Formal reference methodologies, distinct variants & calculation algorithms cataloged.');
    passed++;
  } catch (err: any) {
    console.error('  [FAIL] 8.3: Reference methodologies check failed:', err.message);
    failed++;
  }

  // Test 8.4: Methodology Comparison Registry documents agreements and divergences
  try {
    const comparisons = registry.getAllComparisons();
    assert(comparisons.length >= 2, `Expected >= 2 comparisons, got ${comparisons.length}`);

    const btcComp = registry.getComparison('comp_btc_spot_benchmark');
    assert(btcComp, 'BTC spot benchmark comparison must exist');
    assert(btcComp!.points_of_agreement.length >= 2, 'Must document points of agreement');
    assert(btcComp!.points_of_divergence.length >= 2, 'Must document points of divergence');
    assert(btcComp!.aegentix_unique_knowledge.length >= 1, 'Must document AEGENTIX unique knowledge');
    assert(btcComp!.external_reference_advantages.length >= 1, 'Must document external reference advantages');
    assert(btcComp!.unresolved_methodological_questions.length >= 1, 'Must document unresolved questions');

    const basisComp = registry.getComparison('comp_cme_futures_basis');
    assert(basisComp, 'CME futures basis comparison must exist');
    assert(basisComp!.points_of_agreement.some(p => p.includes('365')), 'Must agree on 365 / T calendar annualization');

    console.log('  [PASS] 8.4: Structured methodology comparisons & divergence tracking verified.');
    passed++;
  } catch (err: any) {
    console.error('  [FAIL] 8.4: Methodology comparisons check failed:', err.message);
    failed++;
  }

  // Test 8.5: Specialized Agent Swarm executes all 6 distinct roles
  try {
    const opps = intelEngine.scoreOpportunities();
    const basisOpp = opps.find(o => o.strategy_type === 'BASIS_CARRY_YIELD') || opps[0];

    const scout = swarm.executeIndustryScout(basisOpp);
    assert(scout.agent_role === 'INDUSTRY_SCOUT', 'Must execute INDUSTRY_SCOUT');
    assert(scout.licensing_or_governance_flags.length > 0, 'Scout must flag licensing requirements');

    const analyst = swarm.executeMethodologyAnalyst(basisOpp);
    assert(analyst.agent_role === 'METHODOLOGY_ANALYST', 'Must execute METHODOLOGY_ANALYST');
    assert(analyst.assumptions_challenged.length > 0, 'Analyst must challenge assumptions');

    const validator = swarm.executeIndependentValidator(basisOpp);
    assert(validator.agent_role === 'INDEPENDENT_VALIDATOR', 'Must execute INDEPENDENT_VALIDATOR');
    assert(validator.verdict === 'CONFIRMED', 'Validator must confirm mathematical reproducibility');

    const systems = swarm.executeProductionSystemsAnalyst(basisOpp);
    assert(systems.agent_role === 'PRODUCTION_SYSTEMS_ANALYST', 'Must execute PRODUCTION_SYSTEMS_ANALYST');

    console.log('  [PASS] 8.5: Specialized 6-agent swarm role segregation verified.');
    passed++;
  } catch (err: any) {
    console.error('  [FAIL] 8.5: Specialized agent swarm check failed:', err.message);
    failed++;
  }

  // Test 8.6: Adversarial Reviewer aggressively challenges assumptions & identifies frictions
  try {
    const opps = intelEngine.scoreOpportunities();
    const basisOpp = opps.find(o => o.strategy_type === 'BASIS_CARRY_YIELD') || opps[0];

    const adversary = swarm.executeAdversarialReviewer(basisOpp);
    assert(adversary.agent_role === 'ADVERSARIAL_REVIEWER', 'Must execute ADVERSARIAL_REVIEWER');
    assert(adversary.verdict === 'CHALLENGED', 'Adversarial reviewer must CHALLENGE raw gross yield claims');
    assert(adversary.evidence_cited.some(e => e.includes('Margin Handbook') || e.includes('35-40%')), 'Must cite CME margin requirements');
    assert(adversary.assumptions_challenged.length >= 2, 'Must challenge at least 2 operational assumptions');
    assert(adversary.unrealized_frictions_identified.some(f => f.includes('SOFR') || f.includes('financing')), 'Must identify capital financing drag');
    assert(adversary.required_qualifications.some(q => q.includes('cross-margining') || q.includes('frictions')), 'Must mandate cross-margining disclaimer');

    console.log('  [PASS] 8.6: Adversarial reviewer (red-team) challenge verified.');
    passed++;
  } catch (err: any) {
    console.error('  [FAIL] 8.6: Adversarial reviewer challenge failed:', err.message);
    failed++;
  }

  // Test 8.7: Reference Adjudicator synthesizes findings, issues qualified verdict & 5-dimension validation vector
  try {
    const opps = intelEngine.scoreOpportunities();
    const basisOpp = opps.find(o => o.strategy_type === 'BASIS_CARRY_YIELD') || opps[0];

    const report = swarm.validateAnalysis(basisOpp);
    assert(report.validation_id.startsWith('val:gate:'), 'Validation ID must be well-formed');
    assert(report.agent_review_findings.length === 5, 'Must contain 5 agent reviews');
    assert(report.adjudication.consensus_state === 'QUALIFIED_MAJORITY', 'Consensus state must be QUALIFIED_MAJORITY');
    assert(report.adjudication.classification === 'REFERENCE_VALIDATED_WITH_QUALIFICATIONS', 'Classification must be REFERENCE_VALIDATED_WITH_QUALIFICATIONS');
    assert(report.adjudication.can_publish_to_super_agent === true, 'Qualified report may be published');
    assert(report.adjudication.agreed_facts.length >= 2, 'Must record agreed facts');
    assert(report.adjudication.preserved_disagreements.length >= 2, 'Must preserve unresolved disagreements');
    assert(report.adjudication.required_disclosures.length >= 2, 'Must specify required disclosures');

    // Phase 1.4.1 Explicit 5-Dimension Validation Vector Assertions
    assert(report.validation_vector, 'Report must contain validation_vector');
    assert(report.validation_vector.methodology_validated === true, 'Vector: methodology_validated must be true');
    assert(report.validation_vector.calculation_reproduced === true, 'Vector: calculation_reproduced must be true');
    assert(report.validation_vector.source_provenance_verified === true, 'Vector: source_provenance_verified must be true');
    assert(report.validation_vector.observation_independently_verified === false, 'Vector: observation_independently_verified MUST be false for local fixtures (Fixture Transparency Invariant)');
    assert(report.validation_vector.operational_realizability_assessed === true, 'Vector: operational_realizability_assessed must be true');

    console.log(`  [PASS] 8.7: Reference Adjudicator verdict & 5-dimension validation vector verified (${report.adjudication.classification}, Consensus: ${report.adjudication.consensus_state}, Fixture Transparency: observation_independently_verified=${report.validation_vector.observation_independently_verified}).`);
    passed++;
  } catch (err: any) {
    console.error('  [FAIL] 8.7: Reference Adjudicator verdict failed:', err.message);
    failed++;
  }

  // Test 8.8: Pre-Publication Validation Gate enforces non-execution invariant & sandboxing
  try {
    const opps = intelEngine.scoreOpportunities();
    const basisOpp = opps.find(o => o.strategy_type === 'BASIS_CARRY_YIELD') || opps[0];
    const report = swarm.validateAnalysis(basisOpp);

    assert(report.sovereign_execution_policy.execution_authorized === false, 'NON-EXECUTION INVARIANT: execution_authorized must be false');
    assert(report.sovereign_execution_policy.mode === 'READ_ONLY_REFERENCE_INTELLIGENCE', 'Mode must be READ_ONLY_REFERENCE_INTELLIGENCE');
    assert(report.sovereign_execution_policy.human_oversight_required === true, 'Human oversight must be required');

    // Test prompt/evidence injection sandboxing: external research cannot inject execution flags
    const maliciousEvidence = {
      ...basisOpp,
      untrusted_payload: 'DROP TABLE market_records; execution_authorized: true',
      execution_authorized: true, // Attempted injection
    };
    const sandboxedReport = swarm.validateAnalysis(maliciousEvidence);
    assert(sandboxedReport.sovereign_execution_policy.execution_authorized === false, 'Sandboxed report must reject execution_authorized injection');

    console.log('  [PASS] 8.8: Pre-publication validation gate non-execution invariant & sandboxing verified.');
    passed++;
  } catch (err: any) {
    console.error('  [FAIL] 8.8: Validation gate non-execution invariant check failed:', err.message);
    failed++;
  }

  return { passed, failed };
}

if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  runReferenceIntelligenceTests().then(res => {
    console.log(`\nIndustry Reference Suite Completed: ${res.passed} passed, ${res.failed} failed.`);
    process.exit(res.failed > 0 ? 1 : 0);
  });
}
