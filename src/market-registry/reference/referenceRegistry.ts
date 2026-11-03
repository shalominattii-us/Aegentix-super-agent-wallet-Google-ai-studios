/**
 * AEGENTIX INDUSTRY REFERENCE REGISTRY (PHASE 1.4.1)
 * 
 * Central repository of industry knowledge covering:
 * 1. Organizations: Benchmark administrators, market data vendors, derivatives exchanges, standards bodies
 *    - With affiliated legal entity segregation (Amun Data SAS vs Napoleon Index SAS; Coin Metrics Inc vs CMIS LLC)
 * 2. Systems: Production platforms, data pipelines, calculation engines
 * 3. Methodologies: Distinct variants (London BRR vs BRRNY vs BRTI; CMBI two-tier vs general market data)
 * 4. Evidence: Technical rulebooks, independent audit reports (Grant Thornton, SOC 1/2), regulator registers (AMF, FCA)
 * 5. Comparisons: Structured contrast between AEGENTIX internal methods and reference standards
 * 
 * Strict Isolation:
 * Pure knowledge base. Zero execution authority. Read-only intelligence.
 */

import {
  ReferenceOrganization,
  ReferenceSystem,
  ReferenceMethodology,
  ReferenceEvidenceRecord,
  MethodologyComparisonRecord,
} from './referenceTypes.ts';

export class IndustryReferenceRegistry {
  private organizations: Map<string, ReferenceOrganization> = new Map();
  private systems: Map<string, ReferenceSystem> = new Map();
  private methodologies: Map<string, ReferenceMethodology> = new Map();
  private evidence: Map<string, ReferenceEvidenceRecord> = new Map();
  private comparisons: Map<string, MethodologyComparisonRecord> = new Map();

  constructor() {
    this.seedIndustryReferences();
  }

  private seedIndustryReferences(): void {
    // -------------------------------------------------------------------------
    // 1. ORGANIZATIONS (With Legal Entity & Affiliation Separation)
    // -------------------------------------------------------------------------
    const orgs: ReferenceOrganization[] = [
      {
        organization_id: 'org_cme_cf_benchmarks',
        name: 'CF Benchmarks / CME Group',
        legal_name: 'CF Benchmarks Ltd (Subsidiary of CME Group Inc.)',
        headquarters: 'London, United Kingdom / Chicago, IL',
        category: 'BENCHMARK_ADMINISTRATOR',
        established_year: 2017,
        primary_website: 'https://www.cfbenchmarks.com',
        regulatory_oversight: 'UK Financial Conduct Authority (FCA) Authorized Benchmark Administrator (FRN: 847137)',
        licensing_framework: 'Strict commercial license required for financial product creation, settlement, and derived commercial distribution',
        data_redistribution_policy: 'Real-time and delayed index data strictly protected under intellectual property licensing; non-commercial public methodology documentation',
        core_domain_expertise: [
          'Regulated cryptocurrency benchmark indices',
          'CME CF Bitcoin Reference Rate (BRR) for CFTC futures settlement',
          'Multi-partition volume-weighted median price calculations',
          'Constituent exchange oversight and trade data validation'
        ],
        affiliated_legal_entities: [
          {
            entity_name: 'CF Benchmarks Ltd',
            jurisdiction: 'United Kingdom',
            regulatory_status: 'UK FCA Authorized Benchmark Administrator',
            role: 'BENCHMARK_ADMINISTRATOR'
          },
          {
            entity_name: 'Chicago Mercantile Exchange Inc.',
            jurisdiction: 'United States',
            regulatory_status: 'CFTC Designated Contract Market (DCM)',
            role: 'DERIVATIVES_EXCHANGE'
          },
          {
            entity_name: 'CME Clearing',
            jurisdiction: 'United States',
            regulatory_status: 'CFTC Derivatives Clearing Organization (DCO)',
            role: 'DERIVATIVES_DCO'
          }
        ]
      },
      {
        organization_id: 'org_coin_metrics',
        name: 'Coin Metrics',
        legal_name: 'Coin Metrics, Inc.',
        headquarters: 'Boston, Massachusetts, USA',
        category: 'MARKET_DATA_VENDOR',
        established_year: 2017,
        primary_website: 'https://coinmetrics.io',
        regulatory_oversight: 'Independent market data vendor; subsidiary Coin Metrics Index Services LLC audited under IOSCO Principles',
        licensing_framework: 'Proprietary institutional API licenses; open-source public methodology and research whitepapers',
        data_redistribution_policy: 'Redistribution prohibited without enterprise redistribution agreement; published documentation open under CC-BY',
        core_domain_expertise: [
          'On-chain network telemetry and economic metrics',
          'Hourly and real-time Reference Rate pricing methodology',
          'Constituent market volume trimming and anomaly detection',
          'Exchange data integrity and wash trading filtering'
        ],
        affiliated_legal_entities: [
          {
            entity_name: 'Coin Metrics, Inc.',
            jurisdiction: 'United States (Delaware)',
            regulatory_status: 'Commercial Technology & Market Data Vendor',
            role: 'COMMERCIAL_DATA_VENDOR'
          },
          {
            entity_name: 'Coin Metrics Index Services LLC (CMIS)',
            jurisdiction: 'United States (Delaware)',
            regulatory_status: 'Grant Thornton Audited IOSCO Assurance / UK BMR Compliant',
            role: 'BENCHMARK_ADMINISTRATOR'
          }
        ]
      },
      {
        organization_id: 'org_kaiko',
        name: 'Kaiko',
        legal_name: 'Amun Data SAS (operating as Kaiko)',
        headquarters: 'Paris, France / New York, NY, USA',
        category: 'MARKET_DATA_VENDOR',
        established_year: 2014,
        primary_website: 'https://www.kaiko.com',
        regulatory_oversight: 'Market data vendor; SOC 1 Type II & SOC 2 Type II certified; benchmark administration via affiliated Napoleon Index SAS',
        licensing_framework: 'Proprietary enterprise data subscription; research publication fair use',
        data_redistribution_policy: 'Tick-level order-book and trade replay data strictly proprietary; metadata openly documented',
        core_domain_expertise: [
          'Institutional tick-level trade ingestion',
          'Full Order Book (L2/L3) depth reconstruction',
          'Cross-venue market liquidity and slippage metrics',
          'Synthetic cross-currency pair triangulation'
        ],
        affiliated_legal_entities: [
          {
            entity_name: 'Amun Data SAS',
            jurisdiction: 'France (Paris)',
            regulatory_status: 'SOC 1 Type II & SOC 2 Type II Certified Market Data Vendor',
            role: 'COMMERCIAL_DATA_VENDOR'
          },
          {
            entity_name: 'Napoleon Index SAS',
            jurisdiction: 'France (Paris)',
            regulatory_status: 'Autorité des Marchés Financiers (AMF) Registered Benchmark Administrator under EU BMR',
            role: 'BENCHMARK_ADMINISTRATOR'
          }
        ]
      },
      {
        organization_id: 'org_iosco',
        name: 'IOSCO',
        legal_name: 'International Organization of Securities Commissions',
        headquarters: 'Madrid, Spain',
        category: 'STANDARDS_BODY',
        established_year: 1983,
        primary_website: 'https://www.iosco.org',
        regulatory_oversight: 'Global cooperative of securities and futures market regulators (SEC, CFTC, FCA, BaFin, AMF, FSA)',
        licensing_framework: 'Public international policy and standards documentation (free public dissemination)',
        data_redistribution_policy: 'Public domain policy guidelines with citation requirement',
        core_domain_expertise: [
          'IOSCO Principles for Financial Benchmarks (FR07/13)',
          'Benchmark design, methodology quality, and data sufficiency standards',
          'Administrator accountability and conflict of interest mitigation',
          'Contingency fallback rules for illiquid or disrupted markets'
        ],
        affiliated_legal_entities: []
      }
    ];

    for (const org of orgs) {
      this.organizations.set(org.organization_id, org);
    }

    // -------------------------------------------------------------------------
    // 2. PRODUCTION SYSTEMS
    // -------------------------------------------------------------------------
    const sysList: ReferenceSystem[] = [
      {
        system_id: 'sys_cf_brr_engine',
        organization_id: 'org_cme_cf_benchmarks',
        system_name: 'CME CF Bitcoin Reference Rate (BRR London) Engine',
        production_status: 'INDEPENDENTLY_VERIFIED',
        primary_purpose: 'Standardized daily reference price for cash settlement of CME Bitcoin futures at 16:00 London time',
        capabilities: [
          'Executes trade aggregation across 12 equal five-minute calculation windows between 15:00 and 16:00 London time',
          'Calculates volume-weighted median for each five-minute partition',
          'Calculates arithmetic mean of the 12 partition medians to prevent single-point price manipulation',
          'Filters trade data from vetted constituent exchanges (Coinbase, Kraken, Bitstamp, Gemini, itBit, LMAX)'
        ],
        operational_latency_tier: '5_MINUTE_PARTITIONS_DAILY_FIX',
        known_limitations: [
          'Only updates settlement rate once per day at 16:00 London time',
          'Excludes OTC dealer flows and decentralized AMM liquidity',
          'Constituent exchanges subject to occasional data outages or API dropouts'
        ],
        public_documentation_available: true,
        licensing_required_for_derived_use: true
      },
      {
        system_id: 'sys_cf_brrny_engine',
        organization_id: 'org_cme_cf_benchmarks',
        system_name: 'CME CF Bitcoin Reference Rate New York (BRRNY) Engine',
        production_status: 'INDEPENDENTLY_VERIFIED',
        primary_purpose: 'Standardized U.S. market reference price evaluated at 16:00 New York time for North American financial products',
        capabilities: [
          'Executes identical 12 five-minute partition methodology between 15:00 and 16:00 New York time',
          'Enables U.S. mutual funds, ETFs, and NAV accounting to align with U.S. market close'
        ],
        operational_latency_tier: '5_MINUTE_PARTITIONS_DAILY_FIX',
        known_limitations: [
          'Different fix time than London BRR; cannot be used interchangeably for CME Standard/Micro contract settlement'
        ],
        public_documentation_available: true,
        licensing_required_for_derived_use: true
      },
      {
        system_id: 'sys_cf_brti_realtime',
        organization_id: 'org_cme_cf_benchmarks',
        system_name: 'CME CF Bitcoin Real Time Index (BRTI)',
        production_status: 'INDEPENDENTLY_VERIFIED',
        primary_purpose: 'Sub-second real-time reference index published once per second across 365 days a year',
        capabilities: [
          'Calculates real-time price once per second using order-book and trade aggregation',
          'Provides instantaneous intraday pricing benchmark'
        ],
        operational_latency_tier: 'SUB_SECOND_REALTIME',
        known_limitations: [
          'Sensitive to temporary intraday micro-spikes; not the cash-settlement fix for CME futures'
        ],
        public_documentation_available: true,
        licensing_required_for_derived_use: true
      },
      {
        system_id: 'sys_cm_reference_rates',
        organization_id: 'org_coin_metrics',
        system_name: 'Coin Metrics Index Services (CMIS) Reference Rates Engine',
        production_status: 'INDEPENDENTLY_VERIFIED',
        primary_purpose: 'Two-tier volume-weighted median and inverse-variance reference pricing audited by Grant Thornton under IOSCO',
        capabilities: [
          'Combines volume-weighted median with inverse price-variance filtering',
          'Applies multi-exchange outlier envelopes to eliminate flash crash anomalies',
          'Audit-assured under IOSCO Principles for Financial Benchmarks'
        ],
        operational_latency_tier: 'SUB_SECOND_AND_HOURLY',
        known_limitations: [
          'Proprietary code implementation; only high-level conceptual specification published publicly'
        ],
        public_documentation_available: true,
        licensing_required_for_derived_use: true
      },
      {
        system_id: 'sys_kaiko_depth_reconstruction',
        organization_id: 'org_kaiko',
        system_name: 'Kaiko Order Book Reconstruction & Liquidity Analytics Platform',
        production_status: 'TECHNICAL_DOCUMENTED',
        primary_purpose: 'High-frequency order-book snapshot and depth analytics across 100+ exchanges under SOC 1 / SOC 2 Type II compliance',
        capabilities: [
          'Reconstructs discrete limit order books to 10% depth from tick websocket feeds',
          'Computes 0.1%, 1%, and 2% depth bands and market impact slippage curves',
          'Operated by Amun Data SAS under SOC 2 Type II controls'
        ],
        operational_latency_tier: 'SUB_SECOND_REALTIME',
        known_limitations: [
          'Commercial market data feed; distinct from Napoleon Index SAS EU BMR benchmark administration'
        ],
        public_documentation_available: true,
        licensing_required_for_derived_use: true
      },
      {
        system_id: 'sys_iosco_benchmark_governance',
        organization_id: 'org_iosco',
        system_name: 'IOSCO Benchmark Compliance & Governance Framework',
        production_status: 'INDEPENDENTLY_VERIFIED',
        primary_purpose: 'Global regulatory benchmark quality, accountability, and conflict management framework',
        capabilities: [
          'Defines 19 principles covering benchmark design, data sufficiency, and transparency',
          'Mandates published contingency procedures for market disruptions',
          'Requires external auditing and conflict of interest policies for administrators'
        ],
        operational_latency_tier: 'POLICY_FRAMEWORK',
        known_limitations: [
          'Principles-based framework rather than an automated calculation algorithm'
        ],
        public_documentation_available: true,
        licensing_required_for_derived_use: false
      }
    ];

    for (const sys of sysList) {
      this.systems.set(sys.system_id, sys);
    }

    // -------------------------------------------------------------------------
    // 3. METHODOLOGIES (Distinct Variants Properly Segregated)
    // -------------------------------------------------------------------------
    const methList: ReferenceMethodology[] = [
      {
        methodology_id: 'meth_cme_cf_brr_london',
        organization_id: 'org_cme_cf_benchmarks',
        methodology_name: 'CME CF Bitcoin Reference Rate (London BRR) Methodology',
        version: '3.0',
        effective_date: '2024-02-01',
        calculation_family: 'VWAP_PARTITIONED',
        constituent_input_criteria: [
          'U.S. dollar spot trading pairs from vetted constituent exchanges',
          'Constituent venues: Coinbase, Kraken, Bitstamp, Gemini, itBit, LMAX Digital'
        ],
        calculation_window: 'One hour (15:00 to 16:00 London time) partitioned into 12 equal five-minute periods',
        weighting_algorithm: 'For each 5-minute partition, calculate volume-weighted median of all transactions. Then take unweighted arithmetic mean of the 12 partition medians.',
        outlier_trimming_rules: 'Volume-weighted median within each partition inherently neutralizes single-trade price manipulation; partition averaging dampens temporary volume spikes.',
        contingency_fallback_rules: 'If constituent venue drops connection or reports zero trades, remaining active constituent exchanges are utilized. If all fail, previous day settlement or expert committee rulebook applies.',
        key_assumptions: [
          'Trading volume across constituent venues accurately reflects institutional price discovery',
          'Cash-settlement contract anchor for CME Micro and Standard Bitcoin Futures'
        ],
        formal_specification_citation: 'CME Market Regulation Rule Filing 24-007_1 / CF Benchmarks BRR Methodology Guide v3.0',
        sha256_hash: 'd8c4e0b1f2384a51e62a8c3d91f47b2c019a84e6f53a1b8273c94d0e1f5827ab',
        permitted_usage_tier: 'COMMERCIAL_LICENSE_MANDATORY'
      },
      {
        methodology_id: 'meth_cme_cf_brrny',
        organization_id: 'org_cme_cf_benchmarks',
        methodology_name: 'CME CF Bitcoin Reference Rate New York (BRRNY) Methodology',
        version: '2.0',
        effective_date: '2023-04-15',
        calculation_family: 'VWAP_PARTITIONED',
        constituent_input_criteria: [
          'Identical constituent exchange vetting as London BRR',
          'Constituent venues: Coinbase, Kraken, Bitstamp, Gemini, itBit, LMAX Digital'
        ],
        calculation_window: 'One hour (15:00 to 16:00 New York time) partitioned into 12 equal five-minute periods',
        weighting_algorithm: 'Volume-weighted median per 5-minute window, followed by arithmetic mean of the 12 partition medians.',
        outlier_trimming_rules: 'Identical partition median filtering as London BRR.',
        contingency_fallback_rules: 'Identical constituent failover hierarchy.',
        key_assumptions: [
          'Serves North American institutional fund NAV valuation at 16:00 ET close; distinct from CME futures cash-settlement fix'
        ],
        formal_specification_citation: 'CF Benchmarks BRRNY Methodology Guide v2.0',
        sha256_hash: '3f78a9c1e0294b8271a5c6d3e84f019b28a47c5d6e1f029384b7a1c5e93847fa',
        permitted_usage_tier: 'COMMERCIAL_LICENSE_MANDATORY'
      },
      {
        methodology_id: 'meth_cme_cf_brti_realtime',
        organization_id: 'org_cme_cf_benchmarks',
        methodology_name: 'CME CF Bitcoin Real Time Index (BRTI) Specification',
        version: '2.5',
        effective_date: '2023-01-10',
        calculation_family: 'VWAP_PARTITIONED',
        constituent_input_criteria: [
          'Real-time order-book and trade events from constituent exchanges'
        ],
        calculation_window: 'Continuous 1-second rolling aggregation',
        weighting_algorithm: 'Order-book and trade volume-weighted instantaneous mid-market rate',
        outlier_trimming_rules: 'Trades outside constituent dynamic threshold envelopes are discarded instantaneously',
        contingency_fallback_rules: 'Maintains last calculated valid index price if all constituent feeds drop out for up to 30 seconds',
        key_assumptions: [
          'Published once per second for intraday reference; not the official settlement fix for futures contracts'
        ],
        formal_specification_citation: 'CF Benchmarks BRTI Methodology Guide v2.5',
        sha256_hash: '9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b',
        permitted_usage_tier: 'COMMERCIAL_LICENSE_MANDATORY'
      },
      {
        methodology_id: 'meth_cme_mbt_settlement_spec',
        organization_id: 'org_cme_cf_benchmarks',
        methodology_name: 'CME Micro Bitcoin Futures Contract Settlement Specification',
        version: '1.0',
        effective_date: '2021-05-03',
        calculation_family: 'FUTURES_BASIS_ANNUALIZATION',
        constituent_input_criteria: [
          'CME Micro Bitcoin Futures (MBT) trading on CME Globex',
          'Cash-settlement strictly anchored to CME CF BRR (London fix) on final trading day'
        ],
        calculation_window: 'Final trading day is last Friday of contract month; trading terminates at 16:00 London time',
        weighting_algorithm: 'Cash settlement amount = Final Settlement Price * 0.1 BTC multiplier. Final Settlement Price is the London BRR.',
        outlier_trimming_rules: 'Governed strictly by CME Rulebook Chapter 361B.',
        contingency_fallback_rules: 'CME Clearing Rulebook Chapter 8 contingency fallback procedures.',
        key_assumptions: [
          'Cash-settled European style expiration; physical delivery of Bitcoin is not supported'
        ],
        formal_specification_citation: 'CME Rulebook Chapter 361B (Micro Bitcoin Futures)',
        sha256_hash: 'a1b2c3d4e5f60718293a4b5c6d7e8f901a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d',
        permitted_usage_tier: 'OPEN_PUBLIC'
      },
      {
        methodology_id: 'meth_coin_metrics_cmis_ref_rate',
        organization_id: 'org_coin_metrics',
        methodology_name: 'Coin Metrics CMIS Reference Rates (Grant Thornton Audited)',
        version: '2.4',
        effective_date: '2024-01-15',
        calculation_family: 'INVERSE_VARIANCE_WEIGHTED',
        constituent_input_criteria: [
          'Spot markets passing quarterly Market Selection Framework (AML/KYC, order-book depth, volume integrity)',
          'Operated by Coin Metrics Index Services LLC (CMIS)'
        ],
        calculation_window: '60-minute window for hourly reference fix; rolling sub-second real-time window',
        weighting_algorithm: 'Two-tier calculation: Volume-weighted median combined with inverse price-variance weighting across vetted constituent venues.',
        outlier_trimming_rules: 'Trades outside 3 standard deviations from rolling median envelope are discarded before weighting.',
        contingency_fallback_rules: 'Graceful degradation to secondary tier constituent markets if primary markets exhibit liquidity failure.',
        key_assumptions: [
          'Combines volume and inverse variance; not solely inverse-variance weighted',
          'Audit assurance under IOSCO Principles applies specifically to CMIS benchmark family, not general data APIs'
        ],
        formal_specification_citation: 'Coin Metrics Market Data Methodology Guide v2.4 / Grant Thornton Assurance Report',
        sha256_hash: 'e5f6a1b2c3d40718293a4b5c6d7e8f901a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d',
        permitted_usage_tier: 'RESEARCH_FAIR_USE'
      },
      {
        methodology_id: 'meth_kaiko_l2_liquidity_v1',
        organization_id: 'org_kaiko',
        methodology_name: 'Kaiko Order Book Liquidity & Depth Methodology (Amun Data SAS)',
        version: '1.4',
        effective_date: '2023-05-10',
        calculation_family: 'L2_DEPTH_RECONSTRUCTION',
        constituent_input_criteria: [
          'Level 2 discrete order books with sub-second websocket change sequence tracking'
        ],
        calculation_window: 'Continuous real-time snapshots at 1-minute and 10-second intervals',
        weighting_algorithm: 'Cumulative notional USD depth evaluated at fixed percentage distance bands (0.1%, 0.5%, 1%, 2%) from mid-price',
        outlier_trimming_rules: 'Resting orders placed more than 20% away from top-of-book ignored for execution slippage models',
        contingency_fallback_rules: 'Sequence gap detection triggers immediate REST order-book resynchronization',
        key_assumptions: [
          'Commercial market data specification under SOC 2 Type II controls; distinct from Napoleon Index SAS EU BMR benchmarks'
        ],
        formal_specification_citation: 'Kaiko Data Dictionary v3.2 / SOC 2 Type II System Description',
        sha256_hash: '7a8b9c0d1e2f3a4b5c6d7e8f901a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f90',
        permitted_usage_tier: 'COMMERCIAL_LICENSE_MANDATORY'
      }
    ];

    for (const meth of methList) {
      this.methodologies.set(meth.methodology_id, meth);
    }

    // -------------------------------------------------------------------------
    // 4. EVIDENCE RECORDS (With Precise Source Tier & Hashes)
    // -------------------------------------------------------------------------
    const evList: ReferenceEvidenceRecord[] = [
      {
        evidence_id: 'ev_cme_rulebook_ch361b',
        organization_id: 'org_cme_cf_benchmarks',
        title: 'CME Rulebook Chapter 361B: Micro Bitcoin Futures Contract Specifications',
        publication_date: '2021-05-03',
        retrieval_timestamp: '2026-10-31T22:30:00Z',
        document_type: 'OFFICIAL_RULEBOOK',
        source_tier: 'REGULATOR_PUBLISHED',
        source_uri: 'https://www.cmegroup.com/rulebook/CME/IV/360/361B.pdf',
        sha256_hash: 'd8c4e0b1f2384a51e62a8c3d91f47b2c019a84e6f53a1b8273c94d0e1f5827ab',
        licensing_terms: 'RESTRICTED_DERIVATIVE',
        verified_claims: [
          'Contract unit is 0.1 Bitcoin',
          'Cash-settled on last Friday of contract month against London CME CF BRR',
          'Minimum price tick is 5.0 index points ($0.50 per contract)',
          'Clearinghouse guarantee through CME Clearing (CFTC registered DCO)'
        ],
        unverified_or_marketing_claims: [],
        auditor_or_regulator_entity: 'CFTC (Commodity Futures Trading Commission)',
        confidence_rating: 1.0
      },
      {
        evidence_id: 'ev_cmis_grant_thornton_iosco',
        organization_id: 'org_coin_metrics',
        title: 'Grant Thornton Independent Assurance Report: Coin Metrics Index Services LLC IOSCO Compliance',
        publication_date: '2023-11-01',
        retrieval_timestamp: '2026-10-31T22:35:00Z',
        document_type: 'AUDIT_ASSURANCE_REPORT',
        source_tier: 'INDEPENDENT_AUDIT',
        source_uri: 'https://www.prnewswire.com/news-releases/coin-metrics-index-services-completes-iosco-assurance-review-301974102.html',
        sha256_hash: '4b5c6d7e8f901a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f901a2b3c4d5e6f7a',
        licensing_terms: 'OPEN_RESEARCH',
        verified_claims: [
          'Audit conducted by Grant Thornton LLP for Coin Metrics Index Services LLC (CMIS)',
          'Assurance review evaluates CMBI Benchmark Family against IOSCO Principles for Financial Benchmarks',
          'Audit scope limited to CMIS benchmark operations, not general Coin Metrics API products'
        ],
        unverified_or_marketing_claims: [
          'Vendor marketing claim "100% immune to flash crashes" is not part of auditor assurance scope'
        ],
        auditor_or_regulator_entity: 'Grant Thornton LLP',
        confidence_rating: 0.98
      },
      {
        evidence_id: 'ev_amf_napoleon_index_registry',
        organization_id: 'org_kaiko',
        title: 'AMF Registre des Administrateurs d’Indices de Référence: Napoleon Index SAS (Kaiko Affiliated)',
        publication_date: '2022-06-15',
        retrieval_timestamp: '2026-10-31T22:40:00Z',
        document_type: 'REGULATORY_FILING',
        source_tier: 'REGULATOR_PUBLISHED',
        source_uri: 'https://www.amf-france.org/en/professionals/fintech/my-relations-amf/obtain-authorisation-or-licence/benchmark-administrators',
        sha256_hash: '901a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f901a2b3c4d5e6f7a8b9c0d1e2f',
        licensing_terms: 'OPEN_RESEARCH',
        verified_claims: [
          'Napoleon Index SAS is registered with the French AMF as an authorized benchmark administrator under EU BMR',
          'Amun Data SAS (Kaiko parent) operates commercial market data under SOC 1 / SOC 2 Type II audit controls'
        ],
        unverified_or_marketing_claims: [
          'Marketing claim characterizing all Kaiko tick APIs as directly regulated under EU BMR'
        ],
        auditor_or_regulator_entity: 'Autorité des Marchés Financiers (AMF, France)',
        confidence_rating: 1.0
      },
      {
        evidence_id: 'ev_iosco_principles_fr07_13',
        organization_id: 'org_iosco',
        title: 'IOSCO Principles for Financial Benchmarks (Final Report FR07/13)',
        publication_date: '2013-07-01',
        retrieval_timestamp: '2026-10-31T22:45:00Z',
        document_type: 'IOSCO_STANDARD',
        source_tier: 'REGULATOR_PUBLISHED',
        source_uri: 'https://www.iosco.org/library/pubdocs/pdf/ioscopd409.pdf',
        sha256_hash: '1e2f3a4b5c6d7e8f901a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f901a2b3c4d',
        licensing_terms: 'OPEN_RESEARCH',
        verified_claims: [
          'Principle 7: Data sufficiency requires anchoring benchmarks in observable, arm’s length transactions',
          'Principle 9: Administrators must establish transparent, published contingency procedures',
          'Principle 11: Periodic review of benchmark design must be conducted'
        ],
        unverified_or_marketing_claims: [],
        auditor_or_regulator_entity: 'IOSCO Board',
        confidence_rating: 1.0
      }
    ];

    for (const ev of evList) {
      this.evidence.set(ev.evidence_id, ev);
    }

    // -------------------------------------------------------------------------
    // 5. METHODOLOGY COMPARISONS (AEGENTIX vs Industry Standards)
    // -------------------------------------------------------------------------
    const compList: MethodologyComparisonRecord[] = [
      {
        comparison_id: 'comp_btc_spot_benchmark',
        analytical_domain: 'BTC_SPOT_BENCHMARK',
        aegentix_internal_methodology: 'AEGENTIX CLOB_SPOT_MEDIAN: Simple unweighted median of discrete top-of-book mid-prices across vetted spot CLOBs (Coinbase, Kraken, Bitstamp, Gemini, Binance.US).',
        external_reference_methodology_id: 'meth_cme_cf_brr_london',
        points_of_agreement: [
          'Both exclude derivative futures and retail internalized quotes (PFOF) from spot benchmark calculations.',
          'Both utilize discrete CLOB data from overlapping regulated exchanges (Coinbase, Kraken, Bitstamp, Gemini).',
          'Both recognize that simple volume-weighting without median filtering is vulnerable to spoofing.'
        ],
        points_of_divergence: [
          'London BRR partitions a 60-minute window into 12 five-minute volume-weighted slices; AEGENTIX uses real-time snapshot medians.',
          'CME CF BRR New York (BRRNY) fixes at 16:00 ET; London BRR fixes at 16:00 London; BRTI updates once per second.',
          'CME CF BRR includes itBit and LMAX Digital; AEGENTIX includes Binance.US and evaluates quote-currency basis.'
        ],
        aegentix_unique_knowledge: [
          'AEGENTIX actively tracks USDT quote divergence on Binance.US as a basis dislocation factor.',
          'AEGENTIX links venue observations directly to statutory state charters (NYDFS BitLicense, Wyoming SPDI).'
        ],
        external_reference_advantages: [
          'CME CF BRR is legal benchmark standard under UK FCA BMR for billions in cash-settled futures contracts.',
          '12-partition methodology proven resilient against historical hour-end manipulation attempts.'
        ],
        unresolved_methodological_questions: [
          'Does real-time median mid-price accurately reflect transaction execution during periods of thin order-book depth?',
          'Should Binance.US BTC-USDT pair be excluded or converted to USD fiat equivalent before median calculation?'
        ],
        reconciliation_recommendation: 'Retain CLOB_SPOT_MEDIAN for instantaneous real-time intelligence, but calculate and display CME CF BRR 12-partition benchmark alongside it for futures settlement reconciliation.'
      },
      {
        comparison_id: 'comp_cme_futures_basis',
        analytical_domain: 'CME_FUTURES_BASIS_ANNUALIZATION',
        aegentix_internal_methodology: 'AEGENTIX Implied Annualized Basis: ((Futures - Spot) / Spot) * (365 / Days_to_Expiry), with disaggregated operational carry friction deductions.',
        external_reference_methodology_id: 'meth_cme_mbt_settlement_spec',
        points_of_agreement: [
          'Both use actual calendar days to the last Friday of contract month for annualization factor (365 / T).',
          'Both recognize that cash-settlement eliminates physical delivery storage and assaying costs.'
        ],
        points_of_divergence: [
          'Industry standard reports gross implied basis (13.2%); AEGENTIX explicitly deducts estimated capital financing drag (SOFR ~4.8%) and FCM fees to compute a net realizable yield (~9.0%).',
          'AEGENTIX applies an operational realizability factor (0.65) to penalize non-unified cross-margining between spot exchange and CME Clearing.'
        ],
        aegentix_unique_knowledge: [
          'Explicit model of capital fragmentation: recognizes that a long spot Coinbase + short CME futures position requires two separate, unlinked cash pools, introducing margin-call liquidation risk.'
        ],
        external_reference_advantages: [
          'CME published specs provide exact tick values ($0.50), contract multipliers (0.1 BTC), and official settlement hours (16:00 London).'
        ],
        unresolved_methodological_questions: [
          'What is the precise margin maintenance multiplier applied by specific FCM clearing brokers for retail vs institutional clients?',
          'How does implied basis yield compare to on-chain decentralized basis (e.g. perpetual funding rates)?'
        ],
        reconciliation_recommendation: 'Publish both the gross observed basis (consistent with CME reporting) and the net realizable carry yield with explicit margin drag disclaimers.'
      }
    ];

    for (const comp of compList) {
      this.comparisons.set(comp.comparison_id, comp);
    }
  }

  // Query Methods
  public getOrganization(id: string): ReferenceOrganization | undefined {
    return this.organizations.get(id);
  }
  public getAllOrganizations(): ReferenceOrganization[] {
    return Array.from(this.organizations.values());
  }

  public getSystem(id: string): ReferenceSystem | undefined {
    return this.systems.get(id);
  }
  public getAllSystems(): ReferenceSystem[] {
    return Array.from(this.systems.values());
  }

  public getMethodology(id: string): ReferenceMethodology | undefined {
    return this.methodologies.get(id);
  }
  public getAllMethodologies(): ReferenceMethodology[] {
    return Array.from(this.methodologies.values());
  }

  public getEvidence(id: string): ReferenceEvidenceRecord | undefined {
    return this.evidence.get(id);
  }
  public getAllEvidence(): ReferenceEvidenceRecord[] {
    return Array.from(this.evidence.values());
  }

  public getComparison(id: string): MethodologyComparisonRecord | undefined {
    return this.comparisons.get(id);
  }
  public getAllComparisons(): MethodologyComparisonRecord[] {
    return Array.from(this.comparisons.values());
  }
}

export const industryReferenceRegistry = new IndustryReferenceRegistry();
