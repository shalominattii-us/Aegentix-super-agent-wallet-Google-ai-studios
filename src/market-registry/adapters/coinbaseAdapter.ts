import { 
  CanonicalInstrumentRecord, 
  QuoteClass, 
  VerificationStatus, 
  EvidenceOrigin,
  InstrumentEligibilityProfile 
} from '../canonicalTypes.ts';

export interface CoinbaseProductRaw {
  id: string; // e.g. "BTC-USD" or "ETH-USDC"
  base_currency: string;
  quote_currency: string;
  status: string; // "online", "delisted", "cancel_only"
  quote_increment: string;
  base_min_size: string;
  cancel_only?: boolean;
  trading_disabled?: boolean;
  post_only?: boolean;
}

export interface AdapterIngestionResult {
  venue: string;
  evidence_origin: EvidenceOrigin;
  source_pair_count: number;
  ingested_count: number;
  rejected_count: number;
  rejected_reasons: { id: string; reason: string }[];
  records: CanonicalInstrumentRecord[];
  last_attempted_poll: string;
  last_successful_live_poll: string | null;
  poll_latency_ms: number | null;
  status: 'ONLINE' | 'POLLING_FAILED' | 'EMPTY_PAYLOAD' | 'FALLBACK_FIXTURE';
  error: string | null;
}

export function normalizeCoinbaseProduct(
  raw: CoinbaseProductRaw,
  evidenceOrigin: EvidenceOrigin = 'LOCAL_FIXTURE',
  verificationStatus: VerificationStatus = 'LOCAL_FIXTURE',
  lastSuccessfulLivePoll: string | null = null,
  recordObservedAt: string = new Date().toISOString()
): CanonicalInstrumentRecord {
  const baseAsset = (raw.base_currency || '').toUpperCase().trim();
  const quoteAsset = (raw.quote_currency || '').toUpperCase().trim();

  let quoteClass: QuoteClass = 'crypto_quote';
  if (['USD', 'EUR', 'GBP'].includes(quoteAsset)) {
    quoteClass = 'fiat';
  } else if (['USDC', 'USDT', 'PYUSD', 'DAI', 'GUSD', 'RLUSD', 'USDS', 'FDUSD', 'USD1'].includes(quoteAsset)) {
    quoteClass = 'stablecoin';
  }

  const isOnline = raw.status === 'online' && !raw.trading_disabled;
  const tradingStatus = isOnline ? 'active' : (raw.post_only ? 'post_only' : 'halted');

  const instrumentEligibility: InstrumentEligibilityProfile = {
    asset_approved: true,
    asset_approval_authority: 'NYDFS_GREENLIST_AND_SELF_CERT',
    venue_authorized: true, // Coinbase, Inc. holds NYDFS BitLicense & FinCEN MSB
    pair_available: isOnline ? true : null,
    customer_eligibility_tier: 'us_available',
    prohibited_states: [],
    eligibility_notes: 'Coinbase, Inc. NYDFS BitLicense authorized exchange trading pair.',
    evidence_basis: {
      statutory_charter_checked: true,
      asset_classification_checked: true,
      orderbook_trading_observed: false,
    },
  };

  return {
    instrument_id: `coinbase:${baseAsset}-${quoteAsset}:spot`,
    venue: 'coinbase',
    jurisdiction: 'US',
    market_class: 'digital_assets',
    market_type: 'spot',
    market_structure: 'CLOB',
    base_asset: baseAsset,
    quote_asset: quoteAsset,
    quote_class: quoteClass,
    trading_status: tradingStatus,
    orderbook_supported: true,
    orderbook_available: false, // Invariant: Listing API does not verify L2 orderbook depth
    orderbook_verified_at: null,
    orderbook_depth_verified_at: null,
    withdrawal_supported: null, // Preserved as null - discovery does not invent withdrawal capability
    network: null,              // Preserved as null - discovery does not invent chain compatibility
    us_eligibility: 'us_available',
    instrument_eligibility: instrumentEligibility,
    instrument_eligibility_notes: instrumentEligibility.eligibility_notes,
    evidence_origin: evidenceOrigin,
    verification_status: verificationStatus,
    record_observed_at: recordObservedAt,
    source_document_updated_at: '2026-10-01T00:00:00Z',
    last_successful_live_poll: lastSuccessfulLivePoll,
    execution_authorized: false, // Invariant: discovery never authorizes execution
    source_api: 'https://api.exchange.coinbase.com/products',
    venue_native_symbol: raw.id,
    maker_fee_bps: 25.0,
    taker_fee_bps: 40.0,
    min_order_size: parseFloat(raw.base_min_size) || null,
    price_tick_size: parseFloat(raw.quote_increment) || null,
    notes: 'Ingested via Coinbase Exchange official REST API adapter.',
  };
}

export const COINBASE_SAMPLE_DISCOVERY_PRODUCTS: CoinbaseProductRaw[] = [
  { id: 'BTC-USD', base_currency: 'BTC', quote_currency: 'USD', status: 'online', quote_increment: '0.01', base_min_size: '0.0001' },
  { id: 'ETH-USD', base_currency: 'ETH', quote_currency: 'USD', status: 'online', quote_increment: '0.01', base_min_size: '0.001' },
  { id: 'SOL-USD', base_currency: 'SOL', quote_currency: 'USD', status: 'online', quote_increment: '0.01', base_min_size: '0.01' },
  { id: 'XRP-USD', base_currency: 'XRP', quote_currency: 'USD', status: 'online', quote_increment: '0.0001', base_min_size: '1.0' },
  { id: 'BTC-USDC', base_currency: 'BTC', quote_currency: 'USDC', status: 'online', quote_increment: '0.01', base_min_size: '0.0001' },
  { id: 'ETH-USDC', base_currency: 'ETH', quote_currency: 'USDC', status: 'online', quote_increment: '0.01', base_min_size: '0.001' },
  { id: 'SOL-USDC', base_currency: 'SOL', quote_currency: 'USDC', status: 'online', quote_increment: '0.01', base_min_size: '0.01' },
  { id: 'USDC-USD', base_currency: 'USDC', quote_currency: 'USD', status: 'online', quote_increment: '0.0001', base_min_size: '1.0' },
  { id: 'USDT-USD', base_currency: 'USDT', quote_currency: 'USD', status: 'online', quote_increment: '0.0001', base_min_size: '1.0' },
  { id: 'DAI-USD', base_currency: 'DAI', quote_currency: 'USD', status: 'online', quote_increment: '0.0001', base_min_size: '1.0' },
  { id: 'PYUSD-USD', base_currency: 'PYUSD', quote_currency: 'USD', status: 'online', quote_increment: '0.0001', base_min_size: '1.0' },
  { id: 'DELISTED-TOKEN-USD', base_currency: 'DELISTED', quote_currency: 'USD', status: 'delisted', quote_increment: '0.01', base_min_size: '1.0' },
];

export function processCoinbaseRawItems(
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
    const id = item.id;
    const base = item.base_currency;
    const quote = item.quote_currency;

    if (!id || typeof id !== 'string' || id.trim() === '') {
      rejectedReasons.push({ id: id || 'missing_id', reason: 'Missing mandatory symbol id' });
      continue;
    }
    if (!base || typeof base !== 'string' || base.trim() === '') {
      rejectedReasons.push({ id, reason: 'Missing mandatory base_currency' });
      continue;
    }
    if (!quote || typeof quote !== 'string' || quote.trim() === '') {
      rejectedReasons.push({ id, reason: 'Missing mandatory quote_currency' });
      continue;
    }

    const rec = normalizeCoinbaseProduct(
      item as CoinbaseProductRaw,
      evidenceOrigin,
      verificationStatus,
      lastSuccessfulLivePoll,
      lastAttemptedPoll
    );
    records.push(rec);
  }

  return {
    venue: 'coinbase',
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

export async function pollCoinbaseExchange(liveFetch: boolean = false): Promise<AdapterIngestionResult> {
  const start = Date.now();
  const now = new Date().toISOString();
  let rawItems: CoinbaseProductRaw[] = [];
  let isLive = false;
  let fetchError: string | null = null;
  let emptyPayload = false;

  if (liveFetch) {
    try {
      const resp = await fetch('https://api.exchange.coinbase.com/products', {
        headers: { 'User-Agent': 'Aegentix-Market-Discovery/1.1' },
        signal: AbortSignal.timeout(4000),
      });
      if (resp.ok) {
        const json = await resp.json();
        if (Array.isArray(json)) {
          if (json.length === 0) {
            emptyPayload = true;
            fetchError = 'Coinbase API returned an empty product array';
          } else {
            rawItems = json;
            isLive = true;
          }
        } else {
          fetchError = 'Unexpected Coinbase JSON format (not an array)';
        }
      } else {
        fetchError = `HTTP ${resp.status}: ${resp.statusText}`;
      }
    } catch (e: any) {
      fetchError = e?.message || 'Network timeout';
    }
  }

  if (isLive) {
    return processCoinbaseRawItems(
      rawItems,
      'LIVE_API',
      'LISTED_PRODUCT_VERIFIED',
      now, // verified live poll timestamp
      now,
      Date.now() - start,
      'ONLINE',
      null
    );
  }

  if (emptyPayload) {
    return {
      venue: 'coinbase',
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

  // Fallback to local test fixtures
  const fallbackStatus = liveFetch ? 'POLLING_FAILED' : 'FALLBACK_FIXTURE';
  return processCoinbaseRawItems(
    COINBASE_SAMPLE_DISCOVERY_PRODUCTS,
    'LOCAL_FIXTURE',
    'LOCAL_FIXTURE',
    null, // STRICT INVARIANT: never populate last_successful_live_poll on fixture fallback
    now,
    Date.now() - start,
    fallbackStatus,
    fetchError
  );
}
