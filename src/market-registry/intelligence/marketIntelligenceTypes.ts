/**
 * AEGENTIX SOVEREIGN MARKET INTELLIGENCE ENGINE TYPES (PHASE 1.3)
 * 
 * Formal type definitions for the analytical intelligence layer:
 * 1. Cross-venue price comparison and benchmark calculations
 * 2. Order-book depth aggregation and multi-tier slippage modeling
 * 3. Cross-venue price discrepancy and anomalous observation detection
 * 4. Opportunity scoring with freshness penalties and evidence quality weights
 * 5. Sovereign super-agent intelligence feed specifications
 * 
 * Invariant:
 * Pure read-only intelligence layer.
 * Zero private keys, zero wallet signing, zero custody mutations.
 * execution_authorized: false is permanently enforced across all models.
 */

import { MarketStructure, EvidenceOrigin } from '../canonicalTypes.ts';
import { FreshnessStatus } from '../marketStructureTypes.ts';

export interface VenuePricePoint {
  venue: string;
  venue_name: string;
  instrument_id: string;
  market_structure: MarketStructure;
  quote_currency: string;
  bid: number | null;
  ask: number | null;
  mid_price: number;
  spread_usd: number | null;
  spread_bps: number | null;
  deviation_from_benchmark_usd: number;
  deviation_from_benchmark_bps: number;
  freshness_status: FreshnessStatus;
  is_stale: boolean;
  evidence_origin: EvidenceOrigin;
  observed_timestamp: string;
}

export interface CrossVenuePriceComparison {
  base_asset: string;
  benchmark_price_usd: number;
  benchmark_source: string; // e.g., 'VOLUME_WEIGHTED_MEDIAN'
  venues_compared_count: number;
  min_price: number;
  max_price: number;
  max_price_dispersion_bps: number;
  lowest_ask_venue: string;
  highest_bid_venue: string;
  venue_prices: VenuePricePoint[];
  compared_at: string;
}

export interface SlippageTierAnalysis {
  notional_usd: number;
  effective_fill_price_bid: number;
  effective_fill_price_ask: number;
  estimated_slippage_bid_bps: number;
  estimated_slippage_ask_bps: number;
  executable_depth_sufficient: boolean;
  best_venue_for_size: string;
}

export interface VenueDepthSummary {
  venue: string;
  instrument_id: string;
  market_structure: MarketStructure;
  bid_depth_1pct_usd: number;
  ask_depth_1pct_usd: number;
  bid_depth_2pct_usd: number;
  ask_depth_2pct_usd: number;
  total_bid_depth_usd: number;
  total_ask_depth_usd: number;
  top_bid_size: number;
  top_ask_size: number;
  evidence_origin: EvidenceOrigin;
}

export interface AggregatedLiquidityAnalysis {
  base_asset: string;
  total_available_bid_depth_usd: number;
  total_available_ask_depth_usd: number;
  venues_analyzed_count: number;
  clob_venues_count: number;
  depth_tiers: SlippageTierAnalysis[];
  liquidity_concentration_index_hhi: number; // 0 to 10,000 (Herfindahl-Hirschman Index)
  primary_liquidity_venue: string;
  thin_orderbook_warning: boolean;
  venue_breakdown: VenueDepthSummary[];
  analyzed_at: string;
}

export type PriceDiscrepancyType =
  | 'CROSS_EXCHANGE_SPREAD'
  | 'SPOT_VS_FUTURES_BASIS'
  | 'CONVERSION_DESK_PREMIUM'
  | 'WIDE_SPREAD_ANOMALY'
  | 'STALE_QUOTE_DIVERGENCE'
  | 'CROSSED_MARKET_ANOMALY';

export type DiscrepancySeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface PriceDiscrepancyRecord {
  discrepancy_id: string;
  base_asset: string;
  type: PriceDiscrepancyType;
  venue_a: string;
  price_a: number;
  venue_b: string;
  price_b: number;
  absolute_difference_usd: number;
  discrepancy_bps: number;
  annualized_basis_pct?: number; // Present for futures calendar basis
  days_to_expiration?: number;
  severity: DiscrepancySeverity;
  anomalous_flag: boolean;
  description: string;
  evidence_origins: [EvidenceOrigin, EvidenceOrigin];
  detected_at: string;
}

export type OpportunityStrategyType =
  | 'ARBITRAGE_DISCREPANCY'
  | 'BASIS_CARRY_YIELD'
  | 'LIQUIDITY_REBALANCING'
  | 'ANOMALOUS_DISLOCATION_WATCH';

export interface DisaggregatedScoreComponents {
  observed_gross_yield_pct: number;
  estimated_financing_and_carry_friction_pct: number;
  net_realizable_yield_pct: number;
  evidence_quality_factor: number; // 0.0 to 1.0 based on statutory charter and orderbook verification
  freshness_factor: number; // 1.0 = fresh, decays on aging/stale
  clearing_and_execution_realizability_factor: number; // 0.0 to 1.0 (penalizes disjoint custody/clearing)
  composite_actionability_score: number; // Risk-adjusted normalized actionability
  assumptions: string[];
  missing_live_inputs: string[];
}

export interface MarketOpportunityScore {
  opportunity_id: string;
  base_asset: string;
  strategy_type: OpportunityStrategyType;
  buy_venue: string;
  buy_price: number;
  sell_venue: string;
  sell_price: number;
  gross_spread_bps: number;
  estimated_execution_cost_bps: number; // Taker fees + estimated slippage + network transfer
  net_spread_bps: number;
  evidence_quality_score: number; // 0.0 to 1.0 based on statutory charter and live orderbook
  freshness_penalty_pct: number; // 0% to 100% deduction for aging/stale data
  confidence_score: number; // 0.0 to 1.0 composite confidence
  composite_opportunity_score: number; // 0 to 100 normalized score
  score_breakdown: DisaggregatedScoreComponents;
  actionable_insight: string;
  risk_factors: string[];
  execution_authorized: false; // Permanent non-execution boundary
  evaluated_at: string;
}

export interface SuperAgentIntelligenceFeed {
  feed_id: string;
  feed_timestamp: string;
  system_phase: string;
  operational_status: 'NOMINAL' | 'DEGRADED' | 'ELEVATED_VOLATILITY';
  summary_metrics: {
    assets_monitored: number;
    venues_monitored: number;
    active_discrepancies: number;
    anomalous_observations_count: number;
    high_conviction_opportunities_count: number;
    aggregate_liquidity_monitored_usd: number;
  };
  price_comparisons: Record<string, CrossVenuePriceComparison>;
  liquidity_analyses: Record<string, AggregatedLiquidityAnalysis>;
  detected_discrepancies: PriceDiscrepancyRecord[];
  top_opportunities: MarketOpportunityScore[];
  sovereign_execution_policy: {
    execution_authorized: false;
    mode: 'READ_ONLY_INTELLIGENCE';
    human_oversight_required: true;
    policy_guideline: 'Market intelligence provides observation and analytics only. Execution, capital allocation, and transaction signing remain strictly isolated.';
  };
}
