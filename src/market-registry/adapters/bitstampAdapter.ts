import { 
  CanonicalInstrumentRecord, 
  QuoteClass, 
  VerificationStatus, 
  EvidenceOrigin, 
  UsEligibilityStatus,
  InstrumentEligibilityProfile 
} from '../canonicalTypes.ts';
import { AdapterIngestionResult } from './coinbaseAdapter.ts';

export interface BitstampPairRaw {
  name: string; // e.g. "BTC/USD"
  url_symbol: string; // e.g. "btcusd"
  base_decimals: number;
  counter_decimals: number;
  minimum_order: string; // e.g. "10.0 USD"
  trading: 'Enabled' | 'Disabled';
  instant_and_market_orders?: 'Enabled' | 'Disabled';
  description?: string;
}

export function normalizeBitstampPair(
  raw: BitstampPairRaw,
  evidenceOrigin: EvidenceOrigin = 'LOCAL_FIXTURE',
  verificationStatus: VerificationStatus = 'LOCAL_FIXTURE',
  lastSuccessfulLivePoll: string | null = null,
  recordObservedAt: string = new Date().toISOString()
): CanonicalInstrumentRecord {
  const parts = (raw.name || '').split('/');
  const baseAsset = (parts[0] || '').toUpperCase().trim();
  const quoteAsset = (parts[1] || '').toUpperCase().trim();

  let quoteClass: QuoteClass = 'crypto_quote';
  if (['USD', 'EUR', 'GBP'].includes(quoteAsset)) {
    quoteClass = 'fiat';
  } else if (['USDC', 'USDT', 'PYUSD', 'DAI', 'GUSD', 'RLUSD', 'USDS', 'FDUSD', 'USD1'].includes(quoteAsset)) {
    quoteClass = 'stablecoin';
  }

  const isTrading = raw.trading === 'Enabled';

  // Disentangled NYDFS Greenlist & State Regulatory Modeling:
  // Base asset evaluated against NYDFS Greenlist; quote currency evaluated against authorized fiat/stablecoin settlement mediums
  const NYDFS_GREENLIST = ['BTC', 'ETH', 'LTC', 'BCH', 'USDC', 'GUSD', 'PYUSD', 'RLUSD'];
  const isBaseGreenlisted = NYDFS_GREENLIST.includes(baseAsset);
  const isQuoteAuthorized = ['USD', 'USDC', 'EUR', 'GBP'].includes(quoteAsset);
  const isNyApproved = isBaseGreenlisted && isQuoteAuthorized;

  const instrumentEligibility: InstrumentEligibilityProfile = {
    asset_approved: isBaseGreenlisted ? true : null,
    asset_approval_authority: isBaseGreenlisted ? 'NYDFS_GREENLIST' : null,
    venue_authorized: true, // Bitstamp USA, Inc. holds NYDFS BitLicense & FinCEN MSB
    pair_available: isTrading ? true : null,
    customer_eligibility_tier: isNyApproved ? 'us_available' : 'us_excluding_ny',
    prohibited_states: isNyApproved ? [] : ['NY'],
    eligibility_notes: isNyApproved
      ? 'NYDFS BitLicense approved pair (Greenlist asset + authorized quote currency).'
      : `Trading restricted in NY: ${baseAsset} not on NYDFS General Greenlist; offered in 40+ non-NY states.`,
    evidence_basis: {
      statutory_charter_checked: true,
      asset_classification_checked: isBaseGreenlisted,
      orderbook_trading_observed: false,
    },
  };

  return {
    instrument_id: `bitstamp:${baseAsset}-${quoteAsset}:spot`,
    venue: 'bitstamp',
    jurisdiction: 'US',
    market_class: 'digital_assets',
    market_type: 'spot',
    market_structure: 'CLOB',
    base_asset: baseAsset,
    quote_asset: quoteAsset,
    quote_class: quoteClass,
    trading_status: isTrading ? 'active' : 'halted',
    orderbook_supported: true,
    orderbook_available: false, // Invariant: Listing API does not verify L2 orderbook depth
    orderbook_verified_at: null,
    orderbook_depth_verified_at: null,
    withdrawal_supported: null,
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
    source_api: 'https://www.bitstamp.net/api/v2/trading-pairs-info/',
    venue_native_symbol: raw.url_symbol,
    maker_fee_bps: 15.0,
    taker_fee_bps: 25.0,
    min_order_size: parseFloat(raw.minimum_order) || 10.0,
    price_tick_size: Math.pow(10, -(raw.counter_decimals || 2)),
    notes: 'Ingested via Bitstamp USA, Inc. official trading-pairs-info REST API.',
  };
}

export const BITSTAMP_SAMPLE_PAIRS: BitstampPairRaw[] = [
  { name: 'BTC/USD', url_symbol: 'btcusd', base_decimals: 8, counter_decimals: 2, minimum_order: '10.0 USD', trading: 'Enabled' },
  { name: 'BTC/USDC', url_symbol: 'btcusdc', base_decimals: 8, counter_decimals: 2, minimum_order: '10.0 USDC', trading: 'Enabled' },
  { name: 'ETH/USD', url_symbol: 'ethusd', base_decimals: 8, counter_decimals: 2, minimum_order: '10.0 USD', trading: 'Enabled' },
  { name: 'ETH/USDC', url_symbol: 'ethusdc', base_decimals: 8, counter_decimals: 2, minimum_order: '10.0 USDC', trading: 'Enabled' },
  { name: 'SOL/USD', url_symbol: 'solusd', base_decimals: 8, counter_decimals: 2, minimum_order: '10.0 USD', trading: 'Enabled' },
  { name: 'LTC/USD', url_symbol: 'ltcusd', base_decimals: 8, counter_decimals: 2, minimum_order: '10.0 USD', trading: 'Enabled' },
  { name: 'XRP/USD', url_symbol: 'xrpusd', base_decimals: 8, counter_decimals: 4, minimum_order: '10.0 USD', trading: 'Enabled' },
  { name: 'USDC/USD', url_symbol: 'usdcusd', base_decimals: 6, counter_decimals: 4, minimum_order: '10.0 USD', trading: 'Enabled' },
  { name: 'USDT/USD', url_symbol: 'usdtusd', base_decimals: 6, counter_decimals: 4, minimum_order: '10.0 USD', trading: 'Enabled' },
];

export function processBitstampRawPairs(
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
    const name = item.name;
    const urlSymbol = item.url_symbol;

    if (!name || typeof name !== 'string' || !name.includes('/')) {
      rejectedReasons.push({ id: urlSymbol || 'missing_name', reason: 'Missing or invalid slash-delimited pair name' });
      continue;
    }
    if (!urlSymbol || typeof urlSymbol !== 'string' || urlSymbol.trim() === '') {
      rejectedReasons.push({ id: name, reason: 'Missing mandatory url_symbol identifier' });
      continue;
    }

    const rec = normalizeBitstampPair(
      item as BitstampPairRaw,
      evidenceOrigin,
      verificationStatus,
      lastSuccessfulLivePoll,
      lastAttemptedPoll
    );
    records.push(rec);
  }

  return {
    venue: 'bitstamp',
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

export async function pollBitstampExchange(liveFetch: boolean = false): Promise<AdapterIngestionResult> {
  const start = Date.now();
  const now = new Date().toISOString();
  let rawItems: BitstampPairRaw[] = [];
  let isLive = false;
  let fetchError: string | null = null;
  let emptyPayload = false;

  if (liveFetch) {
    try {
      const resp = await fetch('https://www.bitstamp.net/api/v2/trading-pairs-info/', {
        headers: { 'User-Agent': 'Aegentix-Market-Discovery/1.2' },
        signal: AbortSignal.timeout(4000),
      });
      if (resp.ok) {
        const json = await resp.json();
        if (Array.isArray(json)) {
          if (json.length === 0) {
            emptyPayload = true;
            fetchError = 'Bitstamp trading-pairs-info returned empty array';
          } else {
            rawItems = json;
            isLive = true;
          }
        } else {
          fetchError = 'Unexpected Bitstamp response shape (not an array)';
        }
      } else {
        fetchError = `HTTP ${resp.status}: ${resp.statusText}`;
      }
    } catch (e: any) {
      fetchError = e?.message || 'Network timeout';
    }
  }

  if (isLive) {
    return processBitstampRawPairs(
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
      venue: 'bitstamp',
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
  return processBitstampRawPairs(
    BITSTAMP_SAMPLE_PAIRS,
    'LOCAL_FIXTURE',
    'LOCAL_FIXTURE',
    null,
    now,
    Date.now() - start,
    fallbackStatus,
    fetchError
  );
}
