import { 
  CanonicalInstrumentRecord, 
  QuoteClass, 
  VerificationStatus, 
  EvidenceOrigin,
  InstrumentEligibilityProfile 
} from '../canonicalTypes.ts';
import { AdapterIngestionResult } from './coinbaseAdapter.ts';

export interface GeminiSymbolDetailRaw {
  symbol: string; // e.g. "btcusd", "ethusd"
  base_currency: string;
  quote_currency: string;
  status: string; // "open", "closed"
  tick_size: number;
  quote_increment: number;
  min_order_size: string;
}

export function normalizeGeminiSymbol(
  raw: GeminiSymbolDetailRaw,
  evidenceOrigin: EvidenceOrigin = 'LOCAL_FIXTURE',
  verificationStatus: VerificationStatus = 'LOCAL_FIXTURE',
  lastSuccessfulLivePoll: string | null = null,
  recordObservedAt: string = new Date().toISOString()
): CanonicalInstrumentRecord {
  const baseAsset = (raw.base_currency || '').toUpperCase().trim();
  const quoteAsset = (raw.quote_currency || '').toUpperCase().trim();

  let quoteClass: QuoteClass = 'crypto_quote';
  if (['USD', 'EUR', 'GBP', 'SGD'].includes(quoteAsset)) {
    quoteClass = 'fiat';
  } else if (['USDC', 'USDT', 'PYUSD', 'DAI', 'GUSD', 'RLUSD', 'USDS', 'FDUSD', 'USD1'].includes(quoteAsset)) {
    quoteClass = 'stablecoin';
  }

  const isOpen = raw.status === 'open';

  const instrumentEligibility: InstrumentEligibilityProfile = {
    asset_approved: true,
    asset_approval_authority: 'NYDFS_TRUST_CHARTER',
    venue_authorized: true, // Gemini Trust Company, LLC holds NYDFS Trust Charter & BitLicense
    pair_available: isOpen ? true : null,
    customer_eligibility_tier: 'us_available',
    prohibited_states: [],
    eligibility_notes: 'Gemini Trust Company, LLC NYDFS Trust Charter and BitLicense authorized trading pair.',
    evidence_basis: {
      statutory_charter_checked: true,
      asset_classification_checked: true,
      orderbook_trading_observed: false,
    },
  };

  return {
    instrument_id: `gemini:${baseAsset}-${quoteAsset}:spot`,
    venue: 'gemini',
    jurisdiction: 'US',
    market_class: 'digital_assets',
    market_type: 'spot',
    market_structure: 'CLOB',
    base_asset: baseAsset,
    quote_asset: quoteAsset,
    quote_class: quoteClass,
    trading_status: isOpen ? 'active' : 'halted',
    orderbook_supported: true,
    orderbook_available: false, // Invariant: Listing API does not verify L2 orderbook depth
    orderbook_verified_at: null,
    orderbook_depth_verified_at: null,
    withdrawal_supported: null,
    network: null,
    us_eligibility: 'us_available', // Gemini holds NYDFS Trust Charter & BitLicense
    instrument_eligibility: instrumentEligibility,
    instrument_eligibility_notes: instrumentEligibility.eligibility_notes,
    evidence_origin: evidenceOrigin,
    verification_status: verificationStatus,
    record_observed_at: recordObservedAt,
    source_document_updated_at: '2026-10-01T00:00:00Z',
    last_successful_live_poll: lastSuccessfulLivePoll,
    execution_authorized: false,
    source_api: 'https://api.gemini.com/v1/symbols/details',
    venue_native_symbol: raw.symbol,
    maker_fee_bps: 20.0,
    taker_fee_bps: 40.0,
    min_order_size: parseFloat(raw.min_order_size) || null,
    price_tick_size: raw.tick_size || null,
    notes: 'Ingested via Gemini Trust Company, LLC official symbols/details REST API.',
  };
}

export const GEMINI_SAMPLE_DETAILS: GeminiSymbolDetailRaw[] = [
  { symbol: 'btcusd', base_currency: 'BTC', quote_currency: 'USD', status: 'open', tick_size: 0.01, quote_increment: 0.01, min_order_size: '0.00001' },
  { symbol: 'ethusd', base_currency: 'ETH', quote_currency: 'USD', status: 'open', tick_size: 0.01, quote_increment: 0.01, min_order_size: '0.001' },
  { symbol: 'solusd', base_currency: 'SOL', quote_currency: 'USD', status: 'open', tick_size: 0.01, quote_increment: 0.01, min_order_size: '0.01' },
  { symbol: 'gusdusd', base_currency: 'GUSD', quote_currency: 'USD', status: 'open', tick_size: 0.0001, quote_increment: 0.0001, min_order_size: '1.0' },
  { symbol: 'btcgusd', base_currency: 'BTC', quote_currency: 'GUSD', status: 'open', tick_size: 0.01, quote_increment: 0.01, min_order_size: '0.00001' },
  { symbol: 'ethgusd', base_currency: 'ETH', quote_currency: 'GUSD', status: 'open', tick_size: 0.01, quote_increment: 0.01, min_order_size: '0.001' },
  { symbol: 'dogeusd', base_currency: 'DOGE', quote_currency: 'USD', status: 'open', tick_size: 0.00001, quote_increment: 0.00001, min_order_size: '10' },
  { symbol: 'ltcusd', base_currency: 'LTC', quote_currency: 'USD', status: 'open', tick_size: 0.01, quote_increment: 0.01, min_order_size: '0.01' },
  { symbol: 'bchusd', base_currency: 'BCH', quote_currency: 'USD', status: 'open', tick_size: 0.01, quote_increment: 0.01, min_order_size: '0.001' },
  { symbol: 'linkusd', base_currency: 'LINK', quote_currency: 'USD', status: 'open', tick_size: 0.001, quote_increment: 0.001, min_order_size: '0.1' },
];

export function processGeminiRawDetails(
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
    const symbol = item.symbol;
    const base = item.base_currency;
    const quote = item.quote_currency;

    if (!symbol || typeof symbol !== 'string' || symbol.trim() === '') {
      rejectedReasons.push({ id: symbol || 'missing_symbol', reason: 'Missing mandatory symbol identifier' });
      continue;
    }
    if (!base || typeof base !== 'string' || base.trim() === '') {
      rejectedReasons.push({ id: symbol, reason: 'Missing mandatory base_currency' });
      continue;
    }
    if (!quote || typeof quote !== 'string' || quote.trim() === '') {
      rejectedReasons.push({ id: symbol, reason: 'Missing mandatory quote_currency' });
      continue;
    }

    const rec = normalizeGeminiSymbol(
      item as GeminiSymbolDetailRaw,
      evidenceOrigin,
      verificationStatus,
      lastSuccessfulLivePoll,
      lastAttemptedPoll
    );
    records.push(rec);
  }

  return {
    venue: 'gemini',
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

export async function pollGeminiMarketplace(liveFetch: boolean = false): Promise<AdapterIngestionResult> {
  const start = Date.now();
  const now = new Date().toISOString();
  let rawItems: GeminiSymbolDetailRaw[] = [];
  let isLive = false;
  let fetchError: string | null = null;
  let emptyPayload = false;

  if (liveFetch) {
    try {
      const resp = await fetch('https://api.gemini.com/v1/symbols/details', {
        headers: { 'User-Agent': 'Aegentix-Market-Discovery/1.1' },
        signal: AbortSignal.timeout(4000),
      });
      if (resp.ok) {
        const json = await resp.json();
        if (Array.isArray(json)) {
          if (json.length === 0) {
            emptyPayload = true;
            fetchError = 'Gemini symbols/details API returned an empty array';
          } else {
            rawItems = json;
            isLive = true;
          }
        } else {
          fetchError = 'Unexpected Gemini JSON structure (not an array)';
        }
      } else {
        fetchError = `HTTP ${resp.status}: ${resp.statusText}`;
      }
    } catch (e: any) {
      fetchError = e?.message || 'Network timeout';
    }
  }

  if (isLive) {
    return processGeminiRawDetails(
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
      venue: 'gemini',
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
  return processGeminiRawDetails(
    GEMINI_SAMPLE_DETAILS,
    'LOCAL_FIXTURE',
    'LOCAL_FIXTURE',
    null, // STRICT INVARIANT: never populate last_successful_live_poll on fixture fallback
    now,
    Date.now() - start,
    fallbackStatus,
    fetchError
  );
}
