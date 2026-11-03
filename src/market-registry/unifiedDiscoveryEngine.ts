import {
  CanonicalInstrumentRecord,
  MarketClass,
  QuoteClass,
  VerificationStatus,
  EvidenceOrigin,
  UsEligibilityStatus,
  VenueRegistryProfile,
  QuoteCurrencyDiscoveryMeta,
} from './canonicalTypes.ts';
import { marketStructureRegistry, MarketStructureRegistry } from './marketStructureRegistry.ts';
import { MarketStructureObservationRecord } from './marketStructureTypes.ts';
import { SovereignMarketIntelligenceEngine } from './intelligence/marketIntelligenceEngine.ts';
import {
  CrossVenuePriceComparison,
  AggregatedLiquidityAnalysis,
  PriceDiscrepancyRecord,
  MarketOpportunityScore,
  SuperAgentIntelligenceFeed
} from './intelligence/marketIntelligenceTypes.ts';
import { industryReferenceRegistry, IndustryReferenceRegistry } from './reference/referenceRegistry.ts';
import { referenceAgentSwarm, ReferenceAgentSwarm } from './reference/referenceAgents.ts';
import {
  ReferenceOrganization,
  ReferenceSystem,
  ReferenceMethodology,
  MethodologyComparisonRecord,
  PrePublicationValidationReport
} from './reference/referenceTypes.ts';
import { INITIAL_QUOTE_CURRENCIES } from './quoteCurrencyCatalog.ts';
import { US_VENUE_REGISTRY_PHASE1_1 } from './venueCatalog.ts';
import { pollCoinbaseExchange, AdapterIngestionResult } from './adapters/coinbaseAdapter.ts';
import { pollBinanceUs } from './adapters/binanceUsAdapter.ts';
import { pollKrakenPro } from './adapters/krakenAdapter.ts';
import { pollGeminiMarketplace } from './adapters/geminiAdapter.ts';
import { pollBitstampExchange } from './adapters/bitstampAdapter.ts';
import { pollUpholdDesk } from './adapters/upholdAdapter.ts';
import { pollRobinhoodBroker } from './adapters/robinhoodAdapter.ts';
import { pollWebullBroker } from './adapters/webullAdapter.ts';
import { EXPANDED_MARKET_INSTRUMENTS_CATALOG } from './adapters/traditionalAndRwaAdapter.ts';

export type EngineInitializationState = 'UNINITIALIZED' | 'INITIALIZING' | 'READY' | 'ERROR';
export type EngineOperationalStatus = 'HEALTHY' | 'DEGRADED' | 'OFFLINE' | 'INITIALIZING';

export const EXPECTED_DIGITAL_ADAPTER_REGISTRY = [
  'coinbase',
  'binance_us',
  'kraken',
  'gemini',
  'bitstamp',
  'uphold',
  'robinhood',
  'webull',
] as const;
export type ExpectedAdapterVenue = typeof EXPECTED_DIGITAL_ADAPTER_REGISTRY[number];

export interface MarketDiscoveryFilter {
  market_class?: MarketClass;
  venue?: string;
  base_asset?: string;
  quote_asset?: string;
  quote_class?: QuoteClass;
  us_eligibility?: UsEligibilityStatus;
  verification_status?: VerificationStatus;
  evidence_origin?: EvidenceOrigin;
}

export interface SymbolCollisionReport {
  base_asset: string;
  quote_asset: string;
  canonical_count: number;
  venues_carrying: string[];
  canonical_ids: string[];
}

export interface CoverageReport {
  generated_at: string;
  phase: string;
  initialization_state: EngineInitializationState;
  operational_status: EngineOperationalStatus;
  treasury_invariant_enforced: boolean;
  invariant_audit: {
    total_instruments_audited: number;
    unauthorized_execution_count: number;
    discovery_isolation_verified: boolean;
  };
  evidence_origin_breakdown: Record<EvidenceOrigin, number>;
  verification_status_breakdown: Record<VerificationStatus, number>;
  market_class_breakdown: Record<MarketClass, number>;
  quote_currency_distribution: Record<string, number>;
  venue_adapter_health: AdapterIngestionResult[];
  symbol_collisions_detected: SymbolCollisionReport[];
  us_eligibility_matrix: Record<UsEligibilityStatus, number>;
  market_structure_breakdown: Record<string, number>;
  rejected_pairs_summary: { venue: string; id: string; reason: string }[];
}

export class UnifiedMarketDiscoveryEngine {
  private venues: Map<string, VenueRegistryProfile> = new Map();
  private quoteCurrencies: Map<string, QuoteCurrencyDiscoveryMeta> = new Map();
  private instruments: Map<string, CanonicalInstrumentRecord> = new Map();
  private adapterResults: Map<string, AdapterIngestionResult> = new Map();
  private initState: EngineInitializationState = 'UNINITIALIZED';
  private initPromise: Promise<void> | null = null;

  constructor() {
    this.initializeDirectory();
    // Non-blocking background boot that tracks state deterministically
    this.initPromise = this.initialize(false).catch(err => {
      console.error('[MarketDiscoveryEngine] Initialization failed:', err);
      this.initState = 'ERROR';
    });
  }

  private initializeDirectory(): void {
    for (const [id, entry] of Object.entries(US_VENUE_REGISTRY_PHASE1_1)) {
      this.venues.set(id.toLowerCase(), JSON.parse(JSON.stringify(entry)));
    }
    for (const [sym, meta] of Object.entries(INITIAL_QUOTE_CURRENCIES)) {
      this.quoteCurrencies.set(sym.toUpperCase(), JSON.parse(JSON.stringify(meta)));
    }
  }

  /**
   * Deterministic initialization: awaits all initial ingestions and promotes state to READY
   */
  public async initialize(liveFetch: boolean = false): Promise<void> {
    this.initState = 'INITIALIZING';

    // 1. Ingest expanded traditional, derivatives, event contracts, and RWA records
    for (const item of EXPANDED_MARKET_INSTRUMENTS_CATALOG) {
      this.instruments.set(item.instrument_id, { ...item });
    }

    // 2. Poll all eight exchange & broker adapters in parallel
    const [cbRes, bnRes, krkRes, gemRes, bsRes, uphRes, rhRes, wbRes] = await Promise.all([
      pollCoinbaseExchange(liveFetch),
      pollBinanceUs(liveFetch),
      pollKrakenPro(liveFetch),
      pollGeminiMarketplace(liveFetch),
      pollBitstampExchange(liveFetch),
      pollUpholdDesk(liveFetch),
      pollRobinhoodBroker(liveFetch),
      pollWebullBroker(liveFetch),
    ]);

    this.applyAdapterResult(cbRes);
    this.applyAdapterResult(bnRes);
    this.applyAdapterResult(krkRes);
    this.applyAdapterResult(gemRes);
    this.applyAdapterResult(bsRes);
    this.applyAdapterResult(uphRes);
    this.applyAdapterResult(rhRes);
    this.applyAdapterResult(wbRes);

    this.initState = 'READY';
  }

  public async awaitReady(): Promise<void> {
    if (this.initPromise) {
      await this.initPromise;
    }
  }

  public getInitializationState(): EngineInitializationState {
    return this.initState;
  }

  /**
   * Re-ingest discovery feeds with explicit liveFetch flag
   */
  public async refreshLiveDiscovery(liveFetch: boolean = true): Promise<CoverageReport> {
    await this.initialize(liveFetch);
    return this.generateCoverageReport();
  }

  public ingestAllInitialVenues(): void {
    // Synchronous alias that triggers initial ingestion
    this.initialize(false).catch(() => {});
  }

  private applyAdapterResult(res: AdapterIngestionResult): void {
    this.adapterResults.set(res.venue, res);
    for (const rec of res.records) {
      this.instruments.set(rec.instrument_id, rec);
    }
    const venueEntry = this.venues.get(res.venue);
    if (venueEntry) {
      venueEntry.live_api_health = {
        status: res.status,
        last_attempted_poll: res.last_attempted_poll,
        last_successful_live_poll: res.last_successful_live_poll,
        last_error: res.error,
      };
    }
  }

  // ── Query APIs ────────────────────────────────────────────────────────────

  public getVenues(): VenueRegistryProfile[] {
    return Array.from(this.venues.values());
  }

  public getVenue(venueId: string): VenueRegistryProfile | undefined {
    return this.venues.get(venueId.toLowerCase());
  }

  public getQuoteCurrencies(): QuoteCurrencyDiscoveryMeta[] {
    return Array.from(this.quoteCurrencies.values());
  }

  public getQuoteCurrency(symbol: string): QuoteCurrencyDiscoveryMeta | undefined {
    return this.quoteCurrencies.get(symbol.toUpperCase());
  }

  public queryInstruments(filter?: MarketDiscoveryFilter): CanonicalInstrumentRecord[] {
    let result = Array.from(this.instruments.values());
    if (!filter) return result;

    if (filter.market_class) {
      result = result.filter(i => i.market_class === filter.market_class);
    }
    if (filter.venue) {
      const v = filter.venue.toLowerCase();
      result = result.filter(i => i.venue.toLowerCase() === v);
    }
    if (filter.base_asset) {
      const b = filter.base_asset.toUpperCase();
      result = result.filter(i => i.base_asset.toUpperCase() === b);
    }
    if (filter.quote_asset) {
      const q = filter.quote_asset.toUpperCase();
      result = result.filter(i => i.quote_asset.toUpperCase() === q);
    }
    if (filter.quote_class) {
      result = result.filter(i => i.quote_class === filter.quote_class);
    }
    if (filter.us_eligibility) {
      result = result.filter(i => i.us_eligibility === filter.us_eligibility);
    }
    if (filter.verification_status) {
      result = result.filter(i => i.verification_status === filter.verification_status);
    }
    if (filter.evidence_origin) {
      result = result.filter(i => i.evidence_origin === filter.evidence_origin);
    }
    return result;
  }

  public detectSymbolCollisions(): SymbolCollisionReport[] {
    const map = new Map<string, { venues: Set<string>; ids: string[] }>();
    for (const inst of this.instruments.values()) {
      const key = `${inst.base_asset}-${inst.quote_asset}`;
      if (!map.has(key)) map.set(key, { venues: new Set(), ids: [] });
      const entry = map.get(key)!;
      entry.venues.add(inst.venue);
      entry.ids.push(inst.instrument_id);
    }
    const collisions: SymbolCollisionReport[] = [];
    for (const [key, val] of map.entries()) {
      if (val.venues.size > 1) {
        const [base_asset, quote_asset] = key.split('-');
        collisions.push({
          base_asset,
          quote_asset,
          canonical_count: val.ids.length,
          venues_carrying: Array.from(val.venues),
          canonical_ids: val.ids,
        });
      }
    }
    return collisions.sort((a, b) => b.venues_carrying.length - a.venues_carrying.length);
  }

  public getBaseAssetCoverage(targetBaseAsset?: string): SymbolCollisionReport[] {
    const collisions = this.detectSymbolCollisions();
    if (targetBaseAsset) {
      const match = collisions.find(c => c.base_asset.toUpperCase() === targetBaseAsset.toUpperCase());
      return match ? [match] : [];
    }
    return collisions;
  }

  // ── Market Structure Observation APIs (Phase 1.2B) ─────────────────────────

  public getMarketStructureObservations(filter?: {
    market_structure?: any;
    venue?: string;
    is_stale?: boolean;
    is_fixture?: boolean;
  }): MarketStructureObservationRecord[] {
    return marketStructureRegistry.queryObservations(filter);
  }

  public getMarketStructureObservation(instrumentId: string): MarketStructureObservationRecord | undefined {
    return marketStructureRegistry.getObservation(instrumentId);
  }

  public getMarketStructureRegistry(): MarketStructureRegistry {
    return marketStructureRegistry;
  }

  // --- PHASE 1.3 SOVEREIGN MARKET INTELLIGENCE LAYER ---
  private intelligenceEngine: SovereignMarketIntelligenceEngine = new SovereignMarketIntelligenceEngine(marketStructureRegistry);

  public getIntelligenceEngine(): SovereignMarketIntelligenceEngine {
    return this.intelligenceEngine;
  }

  public comparePrices(baseAsset: string): CrossVenuePriceComparison {
    return this.intelligenceEngine.comparePrices(baseAsset);
  }

  public analyzeDepth(baseAsset: string): AggregatedLiquidityAnalysis {
    return this.intelligenceEngine.analyzeDepth(baseAsset);
  }

  public detectDiscrepancies(thresholdBps?: number): PriceDiscrepancyRecord[] {
    return this.intelligenceEngine.detectDiscrepancies(thresholdBps);
  }

  public scoreOpportunities(): MarketOpportunityScore[] {
    return this.intelligenceEngine.scoreOpportunities();
  }

  public getSuperAgentFeed(): SuperAgentIntelligenceFeed {
    return this.intelligenceEngine.generateSuperAgentFeed();
  }

  // --- PHASE 1.4 INDUSTRY REFERENCE & PRE-PUBLICATION VALIDATION LAYER ---
  private referenceRegistry: IndustryReferenceRegistry = industryReferenceRegistry;
  private agentSwarm: ReferenceAgentSwarm = referenceAgentSwarm;

  public getReferenceRegistry(): IndustryReferenceRegistry {
    return this.referenceRegistry;
  }

  public getReferenceAgentSwarm(): ReferenceAgentSwarm {
    return this.agentSwarm;
  }

  public validateOpportunityWithSwarm(opportunityId?: string): PrePublicationValidationReport {
    const opportunities = this.scoreOpportunities();
    const target = opportunityId
      ? opportunities.find(o => o.opportunity_id === opportunityId)
      : opportunities[0];

    if (!target) {
      throw new Error(`Target opportunity ${opportunityId || 'default'} not found for validation`);
    }

    return this.agentSwarm.validateAnalysis(target);
  }

  public getAllReferenceOrganizations(): ReferenceOrganization[] {
    return this.referenceRegistry.getAllOrganizations();
  }

  public getAllReferenceSystems(): ReferenceSystem[] {
    return this.referenceRegistry.getAllSystems();
  }

  public getAllReferenceMethodologies(): ReferenceMethodology[] {
    return this.referenceRegistry.getAllMethodologies();
  }

  public getAllMethodologyComparisons(): MethodologyComparisonRecord[] {
    return this.referenceRegistry.getAllComparisons();
  }

  /**
   * Dynamically evaluates system operational health based on actual adapter telemetry
   * Invariant: Must account for missing or unpolled adapters against EXPECTED_DIGITAL_ADAPTER_REGISTRY.
   */
  public computeOperationalStatus(): EngineOperationalStatus {
    if (this.initState === 'INITIALIZING') return 'INITIALIZING';
    if (this.initState === 'ERROR') return 'OFFLINE';

    const expectedCount = EXPECTED_DIGITAL_ADAPTER_REGISTRY.length;
    const reportedAdapters = EXPECTED_DIGITAL_ADAPTER_REGISTRY.filter(venue => this.adapterResults.has(venue));
    
    // If not all expected adapters have completed their poll cycle, we are still initializing
    if (reportedAdapters.length < expectedCount) {
      return 'INITIALIZING';
    }

    const results = reportedAdapters.map(venue => this.adapterResults.get(venue)!);
    const onlineCount = results.filter(r => r.status === 'ONLINE').length;
    const failedCount = results.filter(r => r.status === 'POLLING_FAILED' || r.status === 'EMPTY_PAYLOAD').length;

    // Only HEALTHY if ALL expected adapters are present and reporting ONLINE
    if (onlineCount === expectedCount) return 'HEALTHY';
    // Only OFFLINE if ALL expected adapters are failing
    if (failedCount === expectedCount) return 'OFFLINE';
    return 'DEGRADED';
  }

  /**
   * Runtime proof of treasury isolation: audits all in-memory instruments
   */
  public auditTreasuryIsolation() {
    const all = Array.from(this.instruments.values());
    const violations = all.filter(i => (i.execution_authorized as any) !== false);
    return {
      total_instruments_audited: all.length,
      unauthorized_execution_count: violations.length,
      discovery_isolation_verified: violations.length === 0,
    };
  }

  public generateCoverageReport(): CoverageReport {
    const all = Array.from(this.instruments.values());
    const invariantAudit = this.auditTreasuryIsolation();

    const originBreakdown: Record<EvidenceOrigin, number> = {
      LIVE_API: 0,
      OFFICIAL_STATIC_SOURCE: 0,
      LOCAL_FIXTURE: 0,
      MANUAL_CATALOG: 0,
      UNVERIFIED: 0,
    };

    const statusBreakdown: Record<VerificationStatus, number> = {
      CATALOGED: 0,
      LOCAL_FIXTURE: 0,
      OFFICIAL_STATIC_DOC: 0,
      LISTED_PRODUCT_VERIFIED: 0,
      ORDERBOOK_VERIFIED: 0,
      RECENT_TRADES_VERIFIED: 0,
      US_ELIGIBILITY_VERIFIED: 0,
      EXECUTION_AUTHORIZED: 0,
    };

    const classBreakdown: Record<MarketClass, number> = {
      digital_assets: 0,
      traditional_markets: 0,
      derivatives: 0,
      tokenized_rwa: 0,
      event_contracts: 0,
    };

    const quoteDist: Record<string, number> = {};
    const eligMatrix: Record<UsEligibilityStatus, number> = {
      us_available: 0,
      us_excluding_ny: 0,
      requires_verification: 0,
      restricted_jurisdiction: 0,
      accredited_only: 0,
      ecp_institutional_only: 0,
      prohibited: 0,
    };

    for (const inst of all) {
      originBreakdown[inst.evidence_origin] = (originBreakdown[inst.evidence_origin] || 0) + 1;
      statusBreakdown[inst.verification_status] = (statusBreakdown[inst.verification_status] || 0) + 1;
      classBreakdown[inst.market_class] = (classBreakdown[inst.market_class] || 0) + 1;
      quoteDist[inst.quote_asset] = (quoteDist[inst.quote_asset] || 0) + 1;
      eligMatrix[inst.us_eligibility] = (eligMatrix[inst.us_eligibility] || 0) + 1;
    }

    const structureBreakdown: Record<string, number> = {
      CLOB: 0,
      BROKER_ROUTED: 0,
      CONVERSION_DESK: 0,
      CFTC_DERIVATIVE_DCM: 0,
      AMM_POOL: 0,
      NAV_ISSUANCE: 0,
    };
    for (const inst of all) {
      if (inst.market_structure) {
        structureBreakdown[inst.market_structure] = (structureBreakdown[inst.market_structure] || 0) + 1;
      }
    }

    const rejectedSummary: { venue: string; id: string; reason: string }[] = [];
    for (const res of this.adapterResults.values()) {
      for (const r of res.rejected_reasons) {
        rejectedSummary.push({ venue: res.venue, id: r.id, reason: r.reason });
      }
    }

    return {
      generated_at: new Date().toISOString(),
      phase: 'Phase 1.4 — Industry Reference Intelligence & Analytical Validation',
      initialization_state: this.initState,
      operational_status: this.computeOperationalStatus(),
      treasury_invariant_enforced: invariantAudit.discovery_isolation_verified,
      invariant_audit: invariantAudit,
      evidence_origin_breakdown: originBreakdown,
      verification_status_breakdown: statusBreakdown,
      market_class_breakdown: classBreakdown,
      quote_currency_distribution: quoteDist,
      venue_adapter_health: Array.from(this.adapterResults.values()),
      symbol_collisions_detected: this.detectSymbolCollisions(),
      us_eligibility_matrix: eligMatrix,
      market_structure_breakdown: structureBreakdown,
      rejected_pairs_summary: rejectedSummary,
    };
  }

  public getOverview() {
    const report = this.generateCoverageReport();
    return {
      system: 'AEGENTIX_UNIFIED_MARKET_DISCOVERY_SYSTEM',
      initialization_state: report.initialization_state,
      operational_status: report.operational_status,
      phase: report.phase,
      total_venues_mapped: this.venues.size,
      total_canonical_instruments: this.instruments.size,
      evidence_origin_breakdown: report.evidence_origin_breakdown,
      verification_status_breakdown: report.verification_status_breakdown,
      market_class_breakdown: report.market_class_breakdown,
      market_structure_breakdown: report.market_structure_breakdown,
      quote_currency_distribution: report.quote_currency_distribution,
      symbol_collisions_count: report.symbol_collisions_detected.length,
      treasury_policy_invariant: 'DISCOVERY_NEVER_AUTHORIZES_TRADING_OR_TREASURY_CUSTODY',
      treasury_invariant_enforced: report.treasury_invariant_enforced,
      read_only_mode: true,
      generated_at: report.generated_at,
    };
  }
}

export const unifiedDiscoveryEngine = new UnifiedMarketDiscoveryEngine();
