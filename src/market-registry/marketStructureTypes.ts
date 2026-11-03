/**
 * AEGENTIX MARKET REGISTRY PHASE 1.2B — MARKET STRUCTURE & OBSERVATION TYPES
 * 
 * Strict Structural Separation Invariants:
 * 1. MARKET STRUCTURE != MARKET LIQUIDITY:
 *    - A venue supporting an order book does NOT imply verified live liquidity is present.
 * 2. CLOB != AMM / DEX:
 *    - Centralized discrete order books (CLOB) and automated market maker (AMM)
 *      concentrated pool reserves are distinct liquidity paradigms and cannot be merged.
 * 3. OBSERVATION != EXECUTION:
 *    - Observing an order book, pool state, indicative quote, or derivative spec
 *      creates ZERO authority to trade, sign, or custody assets (execution_authorized: false).
 * 4. OBSERVATION FRESHNESS & STALENESS:
 *    - Every observation carries its own retrieval timestamp, SLA freshness status,
 *      and fixture flag. Stale observations are flagged and never silently reused.
 */

import { MarketStructure, EvidenceOrigin } from './canonicalTypes.ts';

export type FreshnessStatus = 'FRESH' | 'AGING' | 'STALE' | 'EXPIRED';

export interface OrderBookLevel {
  price: number;
  size: number;
  order_count?: number;
}

export interface ClobDepthSnapshot {
  structure: 'CLOB';
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
  top_of_book: {
    best_bid: number;
    best_ask: number;
    mid_price: number;
    spread_usd: number;
    spread_bps: number;
  };
  depth_metrics: {
    depth_1pct_bid_usd: number;
    depth_1pct_ask_usd: number;
    depth_2pct_bid_usd: number;
    depth_2pct_ask_usd: number;
    total_depth_bid_usd: number;
    total_depth_ask_usd: number;
  };
  snapshot_timestamp: string;
  source_sequence?: number | null;
  observed_origin: EvidenceOrigin;
}

export interface ConversionDeskQuote {
  structure: 'CONVERSION_DESK';
  indicative_bid: number;
  indicative_ask: number;
  mid_price: number;
  markup_bps: number;
  quote_timestamp: string;
  min_conversion_size_usd: number;
  max_single_trade_usd: number;
  daily_conversion_limit_usd: number;
  settlement_delay_seconds: number;
  physical_custody_terms?: {
    vault_operator: string;             // e.g. "Brink's Global Services (London/Zurich)"
    physical_redemption_minimum: string; // e.g. "400 troy oz (1 London Good Delivery gold bar)"
    vault_custody_fee_bps_annual: number; // e.g. 15.0 bps
    fabrication_and_shipping_required: boolean;
  } | null;
  observed_origin: EvidenceOrigin;
}

export type BrokerExecutionRoutingModel = 
  | 'PAYMENT_FOR_ORDER_FLOW' 
  | 'INTERNALIZED_MARKET_MAKER' 
  | 'CLEARING_BROKER_OMNIBUS';

export interface BrokerRoutedMarketProfile {
  structure: 'BROKER_ROUTED';
  execution_routing_model: BrokerExecutionRoutingModel;
  clearing_broker_entity: string;        // e.g. "Apex Clearing Corporation" or "Robinhood Securities LLC"
  payment_for_order_flow_disclosed: boolean;
  direct_market_access_supported: false; // Structural invariant: retail brokers do not provide DMA
  level_2_depth_visible: false;          // Structural invariant: internalized flow does not expose L2 CLOB
  supported_order_types: ('MARKET' | 'LIMIT' | 'STOP_LOSS' | 'STOP_LIMIT')[];
  observed_indicative_quote: {
    bid: number;
    ask: number;
    spread_bps: number;
    quoted_at: string;
  };
  retail_access_tier: 'standard_cash' | 'margin_tier_1' | 'margin_tier_2';
  observed_origin: EvidenceOrigin;
}

export type SettlementMethod = 'CASH_SETTLED' | 'PHYSICAL_DELIVERY';
export type DerivativeExpirationStyle = 'AMERICAN' | 'EUROPEAN' | 'BINARY_EVENT_EXPIRATION';

export interface DerivativeContractSpecification {
  structure: 'CFTC_DERIVATIVE_DCM';
  contract_symbol: string;               // e.g. "BTCX26", "KXDEMPRES28", "BIT"
  underlying_instrument_or_index: string; // e.g. "CME CF Bitcoin Reference Rate (BRR)"
  contract_size_multiplier: number;      // e.g. 5.0 for CME BTC, 0.1 for MBT, 0.01 for BIT
  contract_size_unit: string;            // e.g. "BTC", "USD", "INDEX_POINTS"
  settlement_method: SettlementMethod;
  expiration_style: DerivativeExpirationStyle;
  expiration_timestamp: string;
  price_tick_size: number;
  tick_value_usd: number;
  initial_margin_requirement_tier: 'CFTC_STANDARD_SPEC' | 'ECP_INSTITUTIONAL' | 'FULLY_COLLATERALIZED';
  clearing_house_entity: string;         // e.g. "CME Clearing", "Nodal Clear LLC", "Nadex DCO", "Kalshi DCO"
  statutory_rulebook_filing_ref: string; // e.g. "CFTC Rule 40.2(a) Self-Certification"
  observed_origin: EvidenceOrigin;
}

export type AmmModelType = 'CONSTANT_PRODUCT_XYK' | 'CONCENTRATED_LIQUIDITY_V3' | 'STABLE_SWAP_CURVE';

export interface AmmPoolStateObservation {
  structure: 'AMM_POOL';
  protocol_name: string;                 // e.g. "Uniswap v3", "Curve Finance"
  chain_id: number;                      // e.g. 1 (Ethereum Mainnet), 8453 (Base), 42161 (Arbitrum)
  pool_contract_address: string;         // Verified EVM address
  amm_model: AmmModelType;
  token0: {
    symbol: string;
    address: string;
    decimals: number;
    reserve: string;
  };
  token1: {
    symbol: string;
    address: string;
    decimals: number;
    reserve: string;
  };
  fee_tier_bps: number;                  // e.g. 5 bps (0.05%), 30 bps (0.30%), 100 bps (1.00%)
  concentrated_liquidity_params?: {
    sqrt_price_x96: string;
    liquidity: string;
    current_tick: number;
    tick_spacing: number;
  } | null;
  observed_block_number: number;
  observed_block_hash: string;
  observed_block_timestamp: string;
  estimated_price_token0_in_token1: number;
  slip_impact_model: {
    depth_10k_usd_slip_bps: number;
    depth_100k_usd_slip_bps: number;
  };
  observed_origin: EvidenceOrigin;
}

export type MarketStructureObservationData = 
  | ClobDepthSnapshot
  | ConversionDeskQuote
  | BrokerRoutedMarketProfile
  | DerivativeContractSpecification
  | AmmPoolStateObservation;

export interface MarketStructureObservationRecord {
  observation_id: string;                // e.g. `obs:${instrument_id}:${timestamp}`
  instrument_id: string;
  venue: string;
  market_structure: MarketStructure;
  freshness_status: FreshnessStatus;
  observation_timestamp: string;
  freshness_ttl_seconds: number;
  is_stale: boolean;
  is_fixture: boolean;
  evidence_origin: EvidenceOrigin;
  data: MarketStructureObservationData;
}
