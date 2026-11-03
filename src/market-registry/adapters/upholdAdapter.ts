import { 
  CanonicalInstrumentRecord, 
  QuoteClass, 
  VerificationStatus, 
  EvidenceOrigin, 
  UsEligibilityStatus, 
  MarketClass,
  InstrumentEligibilityProfile 
} from '../canonicalTypes.ts';
import { AdapterIngestionResult } from './coinbaseAdapter.ts';

export interface UpholdTickerRaw {
  pair: string; // e.g. "BTC-USD", "UPXAU-USD", "ETH-USD"
  ask: string;
  bid: string;
  currency: string;
}

export function normalizeUpholdTicker(
  raw: UpholdTickerRaw,
  evidenceOrigin: EvidenceOrigin = 'LOCAL_FIXTURE',
  verificationStatus: VerificationStatus = 'LOCAL_FIXTURE',
  lastSuccessfulLivePoll: string | null = null,
  recordObservedAt: string = new Date().toISOString()
): CanonicalInstrumentRecord {
  const parts = (raw.pair || '').split('-');
  const baseAsset = (parts[0] || '').toUpperCase().trim();
  const quoteAsset = (parts[1] || '').toUpperCase().trim();

  let quoteClass: QuoteClass = 'crypto_quote';
  if (['USD', 'EUR', 'GBP'].includes(quoteAsset)) {
    quoteClass = 'fiat';
  } else if (['USDC', 'USDT', 'PYUSD', 'DAI', 'GUSD'].includes(quoteAsset)) {
    quoteClass = 'stablecoin';
  }

  // Determine market class: Precious metals vs Crypto
  const isMetal = ['UPXAU', 'XAU', 'UPXAG', 'XAG', 'UPXPT', 'UPXPD'].includes(baseAsset);
  const marketClass: MarketClass = isMetal ? 'traditional_markets' : 'digital_assets';

  // Granular eligibility & bailment custody profile
  const instrumentEligibility: InstrumentEligibilityProfile = {
    asset_approved: isMetal ? true : null, // Metals have physical custody contracts; crypto requires token-by-token state review
    asset_approval_authority: isMetal ? 'COMMODITY_BAILMENT_CONTRACT' : null,
    venue_authorized: true, // Uphold HQ Inc. holds FinCEN MSB & 40+ State MTLs (No NY BitLicense)
    pair_available: true,
    customer_eligibility_tier: 'us_excluding_ny',
    prohibited_states: ['NY', 'VI'],
    eligibility_notes: isMetal
      ? 'Vaulted precious metal bailment storage with Brink\'s. Physical delivery requires LBMA standard bar minimums (e.g. 400 oz gold / 1000 oz silver) and vault custody fees. Prohibited in NY.'
      : 'Uphold multi-asset bilateral conversion desk entitlement. State MTL regulated; prohibited for NY residents due to absence of NYDFS BitLicense.',
    evidence_basis: {
      statutory_charter_checked: true,
      asset_classification_checked: isMetal,
      orderbook_trading_observed: false,
    },
  };

  return {
    instrument_id: `uphold:${baseAsset}-${quoteAsset}:digital_ledger_entitlement`,
    venue: 'uphold',
    jurisdiction: 'US',
    market_class: marketClass,
    market_type: 'digital_ledger_entitlement', // Market structure distinction: Conversion desk, NOT an exchange CLOB
    market_structure: 'CONVERSION_DESK',
    base_asset: baseAsset,
    quote_asset: quoteAsset,
    quote_class: quoteClass,
    trading_status: 'active',
    orderbook_supported: false, // Invariant: Conversion desk does not operate a CLOB
    orderbook_available: false, // Invariant: Uphold operates a bilateral conversion desk, not an orderbook
    orderbook_verified_at: null,
    orderbook_depth_verified_at: null,
    withdrawal_supported: null, // Strict invariant: Discovery does not presume withdrawal capability for either crypto or metal entitlements
    network: null,
    us_eligibility: instrumentEligibility.customer_eligibility_tier,
    instrument_eligibility: instrumentEligibility,
    instrument_eligibility_notes: instrumentEligibility.eligibility_notes,
    evidence_origin: evidenceOrigin,
    verification_status: verificationStatus,
    record_observed_at: recordObservedAt,
    source_document_updated_at: '2026-10-15T00:00:00Z',
    last_successful_live_poll: lastSuccessfulLivePoll,
    execution_authorized: false,
    source_api: 'https://api.uphold.com/v0/ticker',
    venue_native_symbol: raw.pair,
    maker_fee_bps: 0.0,
    taker_fee_bps: 65.0, // Bid/ask spread spread markup
    notes: 'Ingested via Uphold HQ Inc. multi-asset conversion desk ticker API.',
  };
}

export const UPHOLD_SAMPLE_TICKERS: UpholdTickerRaw[] = [
  { pair: 'BTC-USD', ask: '68500.00', bid: '68200.00', currency: 'USD' },
  { pair: 'ETH-USD', ask: '3550.00', bid: '3530.00', currency: 'USD' },
  { pair: 'SOL-USD', ask: '185.00', bid: '183.50', currency: 'USD' },
  { pair: 'XRP-USD', ask: '0.55', bid: '0.54', currency: 'USD' },
  { pair: 'UPXAU-USD', ask: '2750.00', bid: '2735.00', currency: 'USD' }, // Physical Gold Entitlement
  { pair: 'UPXAG-USD', ask: '33.50', bid: '33.10', currency: 'USD' },   // Physical Silver Entitlement
  { pair: 'USDC-USD', ask: '1.0005', bid: '0.9995', currency: 'USD' },
  { pair: 'USDT-USD', ask: '1.0005', bid: '0.9995', currency: 'USD' },
];

export function processUpholdRawTickers(
  rawItems: any[],
  evidenceOrigin: EvidenceOrigin,
  verificationStatus: VerificationStatus,
  lastSuccessfulLivePoll: string | null,
  lastAttemptedPoll: string,
  pollLatencyMs: number | null,
  status: 'ONLINE' | 'POLLING_FAILED' | 'EMPTY_PAYLOAD' | 'FALLBACK_FIXTURE',
  error: string | null
): AdapterIngestionResult {
  const records: CanonicalInstrumentRecord[] = [];
  const rejectedReasons: { id: string; reason: string }[] = [];

  for (const item of rawItems) {
    if (!item || typeof item !== 'object') {
      rejectedReasons.push({ id: 'invalid_item', reason: 'Payload item is not an object' });
      continue;
    }
    const pair = item.pair;

    if (!pair || typeof pair !== 'string' || !pair.includes('-')) {
      rejectedReasons.push({ id: pair || 'missing_pair', reason: 'Missing or invalid hyphen-delimited ticker pair' });
      continue;
    }

    const rec = normalizeUpholdTicker(
      item as UpholdTickerRaw,
      evidenceOrigin,
      verificationStatus,
      lastSuccessfulLivePoll,
      lastAttemptedPoll
    );
    records.push(rec);
  }

  return {
    venue: 'uphold',
    evidence_origin: evidenceOrigin,
    source_pair_count: rawItems.length,
    ingested_count: records.length,
    rejected_count: rejectedReasons.length,
    rejected_reasons: rejectedReasons,
    records,
    last_attempted_poll: lastAttemptedPoll,
    last_successful_live_poll: lastSuccessfulLivePoll,
    poll_latency_ms: pollLatencyMs,
    status,
    error,
  };
}

export async function pollUpholdDesk(liveFetch: boolean = false): Promise<AdapterIngestionResult> {
  const start = Date.now();
  const now = new Date().toISOString();
  let rawItems: UpholdTickerRaw[] = [];
  let isLive = false;
  let fetchError: string | null = null;
  let emptyPayload = false;

  if (liveFetch) {
    try {
      const resp = await fetch('https://api.uphold.com/v0/ticker', {
        headers: { 'User-Agent': 'Aegentix-Market-Discovery/1.2' },
        signal: AbortSignal.timeout(4000),
      });
      if (resp.ok) {
        const json = await resp.json();
        if (Array.isArray(json)) {
          if (json.length === 0) {
            emptyPayload = true;
            fetchError = 'Uphold ticker returned empty array';
          } else {
            rawItems = json;
            isLive = true;
          }
        } else {
          fetchError = 'Unexpected Uphold response shape (not an array)';
        }
      } else {
        fetchError = `HTTP ${resp.status}: ${resp.statusText}`;
      }
    } catch (e: any) {
      fetchError = e?.message || 'Network timeout';
    }
  }

  if (isLive) {
    return processUpholdRawTickers(
      rawItems,
      'LIVE_API',
      'LISTED_PRODUCT_VERIFIED',
      now,
      now,
      Date.now() - start,
      'ONLINE',
      null
    );
  }

  if (emptyPayload) {
    return {
      venue: 'uphold',
      evidence_origin: 'UNVERIFIED',
      source_pair_count: 0,
      ingested_count: 0,
      rejected_count: 0,
      rejected_reasons: [],
      records: [],
      last_attempted_poll: now,
      last_successful_live_poll: null,
      poll_latency_ms: Date.now() - start,
      status: 'EMPTY_PAYLOAD',
      error: fetchError,
    };
  }

  const fallbackStatus = liveFetch ? 'POLLING_FAILED' : 'FALLBACK_FIXTURE';
  return processUpholdRawTickers(
    UPHOLD_SAMPLE_TICKERS,
    'LOCAL_FIXTURE',
    'LOCAL_FIXTURE',
    null,
    now,
    Date.now() - start,
    fallbackStatus,
    fetchError
  );
}
