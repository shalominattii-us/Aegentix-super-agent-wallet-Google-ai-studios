/**
 * AEGENTIX INDUSTRY REFERENCE & METHODOLOGY INTELLIGENCE TYPES (PHASE 1.4.1)
 * 
 * Formal schemas for the Industry Reference subsystem:
 * 1. Five core registries: Organizations, Systems, Methodologies, Evidence, Comparisons
 * 2. Specialized Reference Agent Swarm roles and adversarial challenge models
 * 3. 5-Dimension Structured Validation Vector (Methodology, Calculation, Provenance, Observation, Realizability)
 * 4. Evidence Source Tier hierarchy (Regulator, Independent Audit, Vendor, Research, Reproduced)
 * 5. Pre-publication reference validation gate and publication contracts
 * 6. Untrusted evidence sandboxing and non-execution sovereign boundary
 */

export type OrganizationCategory =
  | 'BENCHMARK_ADMINISTRATOR'
  | 'MARKET_DATA_VENDOR'
  | 'EXCHANGE_DERIVATIVES'
  | 'QUANTITATIVE_RESEARCH'
  | 'AI_AGENT_PLATFORM'
  | 'STANDARDS_BODY';

export interface AffiliatedLegalEntity {
  entity_name: string;
  jurisdiction: string;
  regulatory_status: string;
  role: string; // e.g. "BENCHMARK_ADMINISTRATOR", "COMMERCIAL_DATA_VENDOR", "DERIVATIVES_DCO"
}

export interface ReferenceOrganization {
  organization_id: string;
  name: string;
  legal_name: string;
  headquarters: string;
  category: OrganizationCategory;
  established_year: number;
  primary_website: string;
  regulatory_oversight: string;
  licensing_framework: string;
  data_redistribution_policy: string;
  core_domain_expertise: string[];
  affiliated_legal_entities: AffiliatedLegalEntity[];
}

export type ProductionVerificationStatus =
  | 'CLAIMED_ONLY'
  | 'TECHNICAL_DOCUMENTED'
  | 'INDEPENDENTLY_VERIFIED'
  | 'HISTORICAL_DEFUNCT'
  | 'UNKNOWN';

export interface ReferenceSystem {
  system_id: string;
  organization_id: string;
  system_name: string;
  production_status: ProductionVerificationStatus;
  primary_purpose: string;
  capabilities: string[];
  operational_latency_tier: string; // e.g. "SUB_SECOND_REALTIME", "5_MINUTE_PARTITIONS", "DAILY_EOD"
  known_limitations: string[];
  public_documentation_available: boolean;
  licensing_required_for_derived_use: boolean;
}

export type CalculationFamily =
  | 'VWAP_PARTITIONED'
  | 'INVERSE_VARIANCE_WEIGHTED'
  | 'L2_DEPTH_RECONSTRUCTION'
  | 'FUTURES_BASIS_ANNUALIZATION'
  | 'IOSCO_BENCHMARK_GOVERNANCE';

export interface ReferenceMethodology {
  methodology_id: string;
  organization_id: string;
  methodology_name: string;
  version: string;
  effective_date: string;
  calculation_family: CalculationFamily;
  constituent_input_criteria: string[];
  calculation_window: string;
  weighting_algorithm: string;
  outlier_trimming_rules: string;
  contingency_fallback_rules: string;
  key_assumptions: string[];
  formal_specification_citation: string;
  sha256_hash: string;
  permitted_usage_tier: 'OPEN_PUBLIC' | 'COMMERCIAL_LICENSE_MANDATORY' | 'RESEARCH_FAIR_USE';
}

export type DocumentType =
  | 'OFFICIAL_RULEBOOK'
  | 'TECHNICAL_METHODOLOGY'
  | 'RESEARCH_WHITEPAPER'
  | 'IOSCO_STANDARD'
  | 'REGULATORY_FILING'
  | 'AUDIT_ASSURANCE_REPORT';

export type EvidenceSourceTier =
  | 'REGULATOR_PUBLISHED'      // Official government or regulatory authority publication
  | 'INDEPENDENT_AUDIT'        // Third-party accounting / assurance firm audit report
  | 'VENDOR_PUBLISHED'          // Self-published vendor documentation, whitepapers, or marketing
  | 'INDEPENDENT_RESEARCH'     // Academic or unaligned open-source quantitative research
  | 'AEGENTIX_REPRODUCED';     // Mathematical recalculation directly within AEGENTIX harness

export interface ReferenceEvidenceRecord {
  evidence_id: string;
  organization_id: string;
  title: string;
  publication_date: string;
  retrieval_timestamp: string;
  document_type: DocumentType;
  source_tier: EvidenceSourceTier;
  source_uri: string;
  sha256_hash: string;
  licensing_terms: 'OPEN_RESEARCH' | 'PROPRIETARY_LICENSED' | 'RESTRICTED_DERIVATIVE';
  verified_claims: string[];
  unverified_or_marketing_claims: string[];
  auditor_or_regulator_entity?: string;
  confidence_rating: number; // 0.0 to 1.0
}

export interface MethodologyComparisonRecord {
  comparison_id: string;
  analytical_domain: string; // e.g. "BTC_SPOT_BENCHMARK", "CME_FUTURES_BASIS"
  aegentix_internal_methodology: string;
  external_reference_methodology_id: string;
  points_of_agreement: string[];
  points_of_divergence: string[];
  aegentix_unique_knowledge: string[];
  external_reference_advantages: string[];
  unresolved_methodological_questions: string[];
  reconciliation_recommendation: string;
}

export type AgentRole =
  | 'INDUSTRY_SCOUT'
  | 'METHODOLOGY_ANALYST'
  | 'INDEPENDENT_VALIDATOR'
  | 'ADVERSARIAL_REVIEWER'
  | 'PRODUCTION_SYSTEMS_ANALYST'
  | 'REFERENCE_ADJUDICATOR';

export type ReviewVerdict =
  | 'CONFIRMED'
  | 'CHALLENGED'
  | 'QUALIFIED'
  | 'REJECTED';

export interface AgentReviewFinding {
  review_id: string;
  agent_role: AgentRole;
  agent_identity: string;
  target_analysis_id: string;
  finding_timestamp: string;
  verdict: ReviewVerdict;
  core_finding: string;
  evidence_cited: string[];
  assumptions_challenged: string[];
  unrealized_frictions_identified: string[];
  licensing_or_governance_flags: string[];
  required_qualifications: string[];
}

export type PublicationClassification =
  | 'PRELIMINARY_OBSERVATION'
  | 'REFERENCE_VALIDATED_WITH_QUALIFICATIONS'
  | 'FULLY_OUTCOME_VALIDATED'
  | 'HELD_ADVERSARIAL_DISAGREEMENT'
  | 'REJECTED_UNSUPPORTED';

/**
 * Split validation into 5 independent structured dimensions
 */
export interface StructuredValidationVector {
  methodology_validated: boolean;             // The referenced methodology is accurately represented
  calculation_reproduced: boolean;            // The mathematics can be reconstructed from inputs
  source_provenance_verified: boolean;        // The referenced sources are authentic and traceable
  observation_independently_verified: boolean;// The actual market observations are supported by independent live data (false for fixtures!)
  operational_realizability_assessed: boolean;// Assumptions about costs, liquidity, execution, and settlement have been evaluated
}

export interface PrePublicationValidationReport {
  validation_id: string;
  target_analysis_id: string;
  base_asset: string;
  validated_at: string;
  internal_calculation_summary: {
    analysis_type: string;
    raw_metric: number;
    raw_metric_units: string;
    calculated_opportunity_score: number;
  };
  validation_vector: StructuredValidationVector;
  external_references_evaluated: string[];
  agent_review_findings: AgentReviewFinding[];
  adjudication: {
    adjudicator_agent: string;
    consensus_state: 'UNANIMOUS' | 'QUALIFIED_MAJORITY' | 'ADVERSARIAL_HOLD' | 'REJECTED';
    classification: PublicationClassification;
    can_publish_to_super_agent: boolean;
    agreed_facts: string[];
    preserved_disagreements: string[];
    required_disclosures: string[];
    open_research_questions: string[];
  };
  sovereign_execution_policy: {
    execution_authorized: false;
    mode: 'READ_ONLY_REFERENCE_INTELLIGENCE';
    human_oversight_required: true;
    policy_invariant: 'Industry reference intelligence validates and challenges market models. It cannot authorize capital allocation or order execution.';
  };
}
