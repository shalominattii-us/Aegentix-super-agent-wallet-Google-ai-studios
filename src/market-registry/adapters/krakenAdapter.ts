import { 
  CanonicalInstrumentRecord, 
  QuoteClass, 
  VerificationStatus, 
  EvidenceOrigin,
  InstrumentEligibilityProfile 
} from '../canonicalTypes.ts';
import { AdapterIngestionResult } from './coinbaseAdapter.ts';

export interface KrakenPairRaw {
  altname: string; // e.g. "XBTUSD", "ETHUSDC"
  wsname?: string; // e.g. "XBT/USD"
  base: string;    // e.g. "XXBT"
  quote: string;   // e.g. "ZUSD"
  status: string;  // "online", "cancel_only", "post_only"
  ordermin?: string;
  costmin?: string;
  tick_size?: string;
}

export function cleanKrakenAsset(rawAsset: string): string {
  let sym = (rawAsset || '').toUpperCase().trim();
  if (sym.length === 4 && (sym.startsWith('X') || sym.startsWith('Z'))) {
    sym = sym.substring(1);
  }
  if (sym === 'XBT') return 'BTC';
  if (sym === 'XDG') return 'DOGE';
  return sym;
}

export function normalizeKrakenPair(
  raw: KrakenPairRaw,
  evidenceOrigin: EvidenceOrigin = 'LOCAL_FIXTURE',
  verificationStatus: VerificationStatus = 'LOCAL_FIXTURE',
  lastSuccessfulLivePoll: string | null = null,
  recordObservedAt: string = new Date().toISOString()
): CanonicalInstrumentRecord {
  let baseAsset = cleanKrakenAsset(raw.base);
  let quoteAsset = cleanKrakenAsset(raw.quote);

  if (raw.wsname && raw.wsname.includes('/')) {
    const parts = raw.wsname.split('/');
    if (parts.length === 2) {
      baseAsset = parts[0].trim().toUpperCase();
      quoteAsset = parts[1].trim().toUpperCase();
      // Apply asset aliases for standard Kraken ws tickers
      if (baseAsset === 'XBT') baseAsset = 'BTC';
      if (baseAsset === 'XDG') baseAsset = 'DOGE';
      if (quoteAsset === 'XBT') quoteAsset = 'BTC';
      if (quoteAsset === 'XDG') quoteAsset = 'DOGE';
    }
  }

  let quoteClass: QuoteClass = 'crypto_quote';
  if (['USD', 'EUR', 'GBP', 'CAD', 'JPY'].includes(quoteAsset)) {
    quoteClass = 'fiat';
  } else if (['USDC', 'USDT', 'PYUSD', 'DAI', 'GUSD', 'RLUSD', 'USDS', 'FDUSD', 'USD1'].includes(quoteAsset)) {
    quoteClass = 'stablecoin';
  }

  const isOnline = raw.status === 'online';

  const instrumentEligibility: InstrumentEligibilityProfile = {
    asset_approved: null, // Kraken lists under exchange compliance framework; no blanket federal or NY approval
    asset_approval_authority: null,
    venue_authorized: true, // Payward, Inc. state money transmitter operation; banking by Kraken Financial (Wyoming SPDI)
    pair_available: isOnline ? true : null,
    customer_eligibility_tier: 'us_excluding_ny',
    prohibited_states: ['NY', 'WA'],
    eligibility_notes: 'Payward, Inc. state money transmitter operation; banking/custody by Kraken Financial (Wyoming SPDI). Prohibited in NY.',
    evidence_basis: {
      statutory_charter_checked: true,
      asset_classification_checked: false,
      orderbook_trading_observed: false,
    },
  };

  return {
    instrument_id: `kraken:${baseAsset}-${quoteAsset}:spot`,
    venue: 'kraken',
    jurisdiction: 'US',
    market_class: 'digital_assets',
    market_type: 'spot',
    market_structure: 'CLOB',
    base_asset: baseAsset,
    quote_asset: quoteAsset,
    quote_class: quoteClass,
    trading_status: isOnline ? 'active' : 'halted',
    orderbook_supported: true,
    orderbook_available: false, // Invariant: Listing API does not verify L2 orderbook depth
    orderbook_verified_at: null,
    orderbook_depth_verified_at: null,
    withdrawal_supported: null,
    network: null,
    us_eligibility: 'us_excluding_ny', // Payward Inc. does not hold NY BitLicense
    instrument_eligibility: instrumentEligibility,
    instrument_eligibility_notes: instrumentEligibility.eligibility_notes,
    evidence_origin: evidenceOrigin,
    verification_status: verificationStatus,
    record_observed_at: recordObservedAt,
    source_document_updated_at: '2026-10-01T00:00:00Z',
    last_successful_live_poll: lastSuccessfulLivePoll,
    execution_authorized: false,
    source_api: 'https://api.kraken.com/0/public/AssetPairs',
    venue_native_symbol: raw.altname,
    maker_fee_bps: 16.0,
    taker_fee_bps: 26.0,
    notes: 'Ingested via Payward, Inc. (Kraken Pro) official AssetPairs API. Banking/custody handled by Kraken Financial (Wyoming SPDI).',
  };
}

export const KRAKEN_SAMPLE_PAIRS: KrakenPairRaw[] = [
  { altname: 'XBTUSD', wsname: 'XBT/USD', base: 'XXBT', quote: 'ZUSD', status: 'online' },
  { altname: 'XBTUSDT', wsname: 'XBT/USDT', base: 'XXBT', quote: 'USDT', status: 'online' },
  { altname: 'XBTUSDC', wsname: 'XBT/USDC', base: 'XXBT', quote: 'USDC', status: 'online' },
  { altname: 'ETHUSD', wsname: 'ETH/USD', base: 'XETH', quote: 'ZUSD', status: 'online' },
  { altname: 'ETHUSDT', wsname: 'ETH/USDT', base: 'XETH', quote: 'USDT', status: 'online' },
  { altname: 'ETHUSDC', wsname: 'ETH/USDC', base: 'XETH', quote: 'USDC', status: 'online' },
  { altname: 'SOLUSD', wsname: 'SOL/USD', base: 'SOL', quote: 'ZUSD', status: 'online' },
  { altname: 'SOLUSDT', wsname: 'SOL/USDT', base: 'SOL', quote: 'USDT', status: 'online' },
  { altname: 'SOLUSDC', wsname: 'SOL/USDC', base: 'SOL', quote: 'USDC', status: 'online' },
  { altname: 'USDCUSD', wsname: 'USDC/USD', base: 'USDC', quote: 'ZUSD', status: 'online' },
  { altname: 'USDTUSD', wsname: 'USDT/USD', base: 'USDT', quote: 'ZUSD', status: 'online' },
  { altname: 'USDTUSDC', wsname: 'USDT/USDC', base: 'USDT', quote: 'USDC', status: 'online' },
  { altname: 'PYUSDUSD', wsname: 'PYUSD/USD', base: 'PYUSD', quote: 'ZUSD', status: 'online' },
  { altname: 'DAIUSD', wsname: 'DAI/USD', base: 'DAI', quote: 'ZUSD', status: 'online' },
  { altname: 'RLUSDUSD', wsname: 'RLUSD/USD', base: 'RLUSD', quote: 'ZUSD', status: 'online' },
  { altname: 'DOGEUSD', wsname: 'XDG/USD', base: 'XXDG', quote: 'ZUSD', status: 'online' },
];

export function processKrakenRawPairs(
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
    const altname = item.altname;
    const base = item.base;
    const quote = item.quote;

    if (!altname || typeof altname !== 'string' || altname.trim() === '') {
      rejectedReasons.push({ id: altname || 'missing_altname', reason: 'Missing mandatory altname identifier' });
      continue;
    }
    if (!base || typeof base !== 'string' || base.trim() === '') {
      rejectedReasons.push({ id: altname, reason: 'Missing mandatory base asset ticker' });
      continue;
    }
    if (!quote || typeof quote !== 'string' || quote.trim() === '') {
      rejectedReasons.push({ id: altname, reason: 'Missing mandatory quote asset ticker' });
      continue;
    }

    const rec = normalizeKrakenPair(
      item as KrakenPairRaw,
      evidenceOrigin,
      verificationStatus,
      lastSuccessfulLivePoll,
      lastAttemptedPoll
    );
    records.push(rec);
  }

  return {
    venue: 'kraken',
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

export async function pollKrakenPro(liveFetch: boolean = false): Promise<AdapterIngestionResult> {
  const start = Date.now();
  const now = new Date().toISOString();
  let rawItems: KrakenPairRaw[] = [];
  let isLive = false;
  let fetchError: string | null = null;
  let emptyPayload = false;

  if (liveFetch) {
    try {
      const resp = await fetch('https://api.kraken.com/0/public/AssetPairs', {
        headers: { 'User-Agent': 'Aegentix-Market-Discovery/1.1' },
        signal: AbortSignal.timeout(4000),
      });
      if (resp.ok) {
        const json = await resp.json();
        if (json && json.result && typeof json.result === 'object') {
          const keys = Object.keys(json.result);
          if (keys.length === 0) {
            emptyPayload = true;
            fetchError = 'Kraken AssetPairs API returned an empty result object';
          } else {
            rawItems = Object.values(json.result);
            isLive = true;
          }
        } else {
          fetchError = 'Unexpected Kraken JSON structure (missing or invalid result field)';
        }
      } else {
        fetchError = `HTTP ${resp.status}: ${resp.statusText}`;
      }
    } catch (e: any) {
      fetchError = e?.message || 'Network timeout';
    }
  }

  if (isLive) {
    return processKrakenRawPairs(
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
      venue: 'kraken',
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
  return processKrakenRawPairs(
    KRAKEN_SAMPLE_PAIRS,
    'LOCAL_FIXTURE',
    'LOCAL_FIXTURE',
    null, // STRICT INVARIANT: never populate last_successful_live_poll on fixture fallback
    now,
    Date.now() - start,
    fallbackStatus,
    fetchError
  );
}
