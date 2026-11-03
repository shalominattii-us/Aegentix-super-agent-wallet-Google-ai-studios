/**
 * AEGENTIX MARKET REGISTRY PHASE 1.1R — EVIDENCE INTEGRITY & CANONICAL TYPES
 * 
 * Strict Evidence & Verification Invariants:
 * 1. FIXTURE RECORDS CANNOT RECEIVE LIVE OR SOURCE-VERIFIED STATUS.
 *    - Explicit evidence_origin is required: LIVE_API, OFFICIAL_STATIC_SOURCE, LOCAL_FIXTURE, MANUAL_CATALOG, UNVERIFIED.
 * 2. TIMESTAMPS MUST BE UNAMBIGUOUS AND SEGREGATED:
 *    - last_attempted_poll (always populated on poll attempt)
 *    - last_successful_live_poll (strictly null if poll failed or fixture used)
 *    - record_observed_at (timestamp when normalizer created this record)
 *    - source_document_updated_at (timestamp of official regulatory or documentation filing)
 * 3. PRODUCT LISTING != ORDERBOOK != ACTIVE TRADING:
 *    - Product endpoint polls produce LISTED_PRODUCT_VERIFIED.
 *    - orderbook_available is false until an actual L2 book is fetched.
 * 4. DISCOVERY NEVER AUTHORIZES TRADING OR TREASURY CUSTODY:
 *    - execution_authorized: false is permanently enforced.
 *    - Runtime isolation prevents private keys, signing, and treasury mutations.
 */

export type MarketClass = 
  | 'digital_assets' 
  | 'traditional_markets' 
  | 'derivatives' 
  | 'tokenized_rwa'
  | 'event_contracts'; // Event/prediction markets (CFTC DCMs e.g. Kalshi, ForecastEx)

export type MarketType = 
  | 'spot' 
  | 'calendar_futures' 
  | 'perpetual' 
  | 'binary_options' 
  | 'touch_brackets' 
  | 'call_spreads' 
  | 'event_derivative' 
  | 'equity' 
  | 'etf' 
  | 'bond' 
  | 'commodity' 
  | 'forex' 
  | 'tokenized_treasury'
  | 'tokenized_fund'
  | 'tokenized_credit'
  | 'broker_routed_spot'           // Retail broker-routed digital assets (Robinhood Crypto, Webull Pay)
  | 'broker_equity'                // Retail introducing broker-dealer equities (Robinhood Financial, Webull Financial)
  | 'broker_option'                // Retail introducing broker-dealer options
  | 'digital_ledger_entitlement';   // Multi-asset conversion desk ledger entitlements (Uphold metals & assets)

export type QuoteClass = 'fiat' | 'stablecoin' | 'crypto_quote';

export type TradingStatus = 'active' | 'halted' | 'delisted' | 'post_only' | 'auction' | 'unknown';

export type EvidenceOrigin = 
  | 'LIVE_API'
  | 'OFFICIAL_STATIC_SOURCE'
  | 'LOCAL_FIXTURE'
  | 'MANUAL_CATALOG'
  | 'UNVERIFIED';

export type VerificationStatus = 
  | 'CATALOGED'
  | 'LOCAL_FIXTURE'
  | 'OFFICIAL_STATIC_DOC'
  | 'LISTED_PRODUCT_VERIFIED'
  | 'ORDERBOOK_VERIFIED'
  | 'RECENT_TRADES_VERIFIED'
  | 'US_ELIGIBILITY_VERIFIED'
  | 'EXECUTION_AUTHORIZED';

export type UsEligibilityStatus = 
  | 'us_available'
  | 'us_excluding_ny'
  | 'requires_verification'
  | 'restricted_jurisdiction'
  | 'accredited_only'
  | 'ecp_institutional_only'
  | 'prohibited';

export type VenueCategory = 
  | 'SPOT_EXCHANGE' 
  | 'CFTC_DCM_DERIVATIVES'
  | 'CFTC_DCM_EVENT_CONTRACTS'
  | 'EQUITIES_EXCHANGE' 
  | 'HYBRID_BROKER_DEALER' 
  | 'RWA_ISSUER_PROTOCOL'      // e.g. Ondo Finance (NOT an exchange)
  | 'CLEARING_HOUSE'           // e.g. OCC, Nodal Clear (NOT an exchange)
  | 'REGULATORY_DATA_PROVIDER'; // e.g. FINRA (NOT an exchange)

export type MarketStructure = 
  | 'CLOB' 
  | 'BROKER_ROUTED' 
  | 'CONVERSION_DESK' 
  | 'AMM_POOL' 
  | 'NAV_ISSUANCE' 
  | 'CFTC_DERIVATIVE_DCM';

export interface InstrumentEligibilityProfile {
  asset_approved: boolean | null;          // true = explicit greenlist/registration; null = unverified/requires inquiry; false = denied
  asset_approval_authority: string | null;  // 'NYDFS_GREENLIST' | 'SEC_REGISTERED' | 'CFTC_DCM_LISTED' | 'STATE_MTL_GENERAL' | 'COMMODITY_BAILMENT_CONTRACT' | null
  venue_authorized: boolean | null;         // true = venue holds statutory charter; null = pending jurisdiction review
  pair_available: boolean | null;           // true = verified active in API; null = unpolled/unverified
  customer_eligibility_tier: UsEligibilityStatus; // 'us_available' | 'us_excluding_ny' | 'accredited_only' etc.
  prohibited_states: string[];            // Explicit state exclusions e.g. ['NY'] or []
  eligibility_notes?: string;
  evidence_basis: {
    statutory_charter_checked: boolean;
    asset_classification_checked: boolean;
    orderbook_trading_observed: boolean;
  };
}

export interface RegulatoryEvidenceRecord {
  // 1. Corporate Entity Registration
  corporate_entity_name: string;
  corporate_registration_type: string;   // e.g. NYDFS BitLicense, FinCEN MSB, State MTL
  corporate_registration_id: string;     // e.g. FinCEN MSB #31000176593821, NYDFS-BL-2017-001
  
  // 2. Exchange & Trading Venue Operation
  exchange_operator_status: string;      // e.g. CFTC Designated Contract Market (DCM), SEC Section 6 National Exchange
  exchange_operator_id: string;          // e.g. CFTC DCM 20-002, SEC Release 34-53382
  
  // 3. Custody & Banking Provider
  custody_provider_entity: string;       // e.g. Payward Financial Inc. (Wyoming SPDI), Nodal Clear LLC (CFTC DCO), Securitize LLC
  custody_regulatory_charter: string;    // e.g. Wyoming SPDI Banking Charter, CFTC DCO Order 15-001
  
  // 4. Customer Eligibility & Jurisdiction Scope
  customer_eligibility_tier: UsEligibilityStatus;
  prohibited_states: string[];           // Known state exceptions (e.g. ['NY', 'TX', 'VT'])
  
  // 5. Statutory Documentation & Verification Audit Provenance
  primary_regulator: string;
  source_document_url: string;           // Direct governmental registry URL
  verified_date: string;                 // ISO-8601 audit date
  retrieval_timestamp: string;           // Exact ISO-8601 timestamp of data retrieval/audit
  source_publication_date: string;       // Statutory or filing publication date
  verification_method: string;           // e.g. 'REGULATORY_SIRT_AUDIT', 'SEC_EDGAR_LOOKUP', 'CFTC_DCM_REGISTRY', 'NYDFS_PUBLIC_REGISTRY', 'FINCEN_MSB_REGISTRY'
  reviewer: string;                      // e.g. 'AEGENTIX_COMPLIANCE_GATE', 'AEGENTIX_REGULATORY_SIRT'
  attribution_notes: string;             // Detailed statutory rationale
}

export interface VenueCorporateStructure {
  product_brand: string;
  trading_venue_name: string;
  legal_entity_operating_venue: string;
  parent_company: string;
  banking_or_custody_subsidiary?: string; // e.g. Kraken Financial (Wyoming SPDI) distinct from Payward Inc.
  clearing_organization?: string;         // e.g. Nodal Clear, LLC for Coinbase Derivatives
  primary_regulator: string;
  registration_type: string;
  jurisdiction: string;
}

export interface CanonicalInstrumentRecord {
  instrument_id: string; // Canonical: `${venue_id}:${base_asset}-${quote_asset}:${market_type}`
  venue: string;
  jurisdiction: string;
  market_class: MarketClass;
  market_type: MarketType;
  market_structure: MarketStructure;      // Disentangled structural capability: CLOB, BROKER_ROUTED, CONVERSION_DESK, etc.
  base_asset: string;
  quote_asset: string;
  quote_class: QuoteClass;
  trading_status: TradingStatus;
  orderbook_supported: boolean;           // Structural capability: Does the market mechanism support an L2 orderbook?
  orderbook_available: boolean;           // Current observation: Is L2 orderbook currently observed/available?
  orderbook_verified_at: string | null;   // Timestamp when orderbook was observed
  orderbook_depth_verified_at: string | null; // Timestamp when depth was validated
  withdrawal_supported: boolean | null;    // Preserved as null: discovery does not invent withdrawal capability
  network: string | null;                 // Preserved as null: discovery does not invent chain compatibility
  us_eligibility: UsEligibilityStatus;
  instrument_eligibility: InstrumentEligibilityProfile; // Granular 5-dimension eligibility model
  instrument_eligibility_notes?: string;   // Explicit per-instrument regulatory/jurisdictional bounds
  evidence_origin: EvidenceOrigin;        // MANDATORY: Discloses data lineage (e.g. LOCAL_FIXTURE vs LIVE_API)
  verification_status: VerificationStatus;
  record_observed_at: string;             // Timestamp when this record was generated in engine
  source_document_updated_at: string | null;
  last_successful_live_poll: string | null; // NULL if from fixture or if live poll failed
  execution_authorized: false;            // Sovereign invariant: False in Phase 1
  
  // Secondary metadata
  source_api?: string;
  poll_latency_ms?: number | null;
  venue_native_symbol?: string;
  maker_fee_bps?: number | null;
  taker_fee_bps?: number | null;
  min_order_size?: number | null;
  price_tick_size?: number | null;
  notes?: string;
}

export interface VenueRegistryProfile {
  venue_id: string;
  name: string;
  venue_category: VenueCategory;
  is_actual_exchange: boolean; // False for Ondo (issuer), FINRA (regulator), OCC (clearing), Nodal Clear
  corporate_structure: VenueCorporateStructure;
  regulatory_evidence: RegulatoryEvidenceRecord;
  market_classes: MarketClass[];
  supported_quote_currencies: string[];
  api_endpoints: {
    public_rest_base?: string;
    public_ws_base?: string;
    products_path?: string;
    orderbook_path?: string;
  };
  live_api_health: {
    status: 'ONLINE' | 'POLLING_FAILED' | 'EMPTY_PAYLOAD' | 'FALLBACK_FIXTURE' | 'UNCONFIGURED' | 'NOT_APPLICABLE';
    last_attempted_poll: string | null;
    last_successful_live_poll: string | null;
    last_http_status?: number | null;
    last_error?: string | null;
  };
  notes: string;
}

export interface QuoteCurrencyDiscoveryMeta {
  symbol: string;
  name: string;
  quote_class: QuoteClass;
  issuer: string;
  primary_chains: string[];
  redemption_mechanism: string;
  reserve_type: string;
  sovereign_treasury_eligible: boolean;
  notes: string;
}
