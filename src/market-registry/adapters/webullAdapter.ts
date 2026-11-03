import { 
  CanonicalInstrumentRecord, 
  QuoteClass, 
  VerificationStatus, 
  EvidenceOrigin, 
  UsEligibilityStatus, 
  MarketClass, 
  MarketType,
  InstrumentEligibilityProfile 
} from '../canonicalTypes.ts';
import { AdapterIngestionResult } from './coinbaseAdapter.ts';

export interface WebullTickerRaw {
  tickerId: string;
  symbol: string; // e.g. "BTCUSD", "ETHUSD", "TSLA", "SPY"
  name: string;
  type: 'crypto' | 'stock';
  status: 'T' | 'S'; // Trading vs Suspended
  currency: string;
}

export function normalizeWebullTicker(
  raw: WebullTickerRaw,
  evidenceOrigin: EvidenceOrigin = 'LOCAL_FIXTURE',
  verificationStatus: VerificationStatus = 'LOCAL_FIXTURE',
  lastSuccessfulLivePoll: string | null = null,
  recordObservedAt: string = new Date().toISOString()
): CanonicalInstrumentRecord {
  const isCrypto = raw.type === 'crypto';
  let baseAsset = raw.symbol.toUpperCase().trim();
  let quoteAsset = raw.currency ? raw.currency.toUpperCase() : 'USD';

  if (isCrypto && baseAsset.endsWith('USD')) {
    baseAsset = baseAsset.replace(/USD$/, '');
    quoteAsset = 'USD';
  }

  const venueId = isCrypto ? 'webull_pay' : 'webull_financial';
  const marketClass: MarketClass = isCrypto ? 'digital_assets' : 'traditional_markets';
  const marketType: MarketType = isCrypto ? 'broker_routed_spot' : 'broker_equity';

  // Per-instrument eligibility modeling
  let usEligibility: UsEligibilityStatus = 'us_available';
  let eligibilityNotes = 'Webull Financial LLC (SEC/FINRA) introducing broker equity clearing via Apex Clearing.';

  if (isCrypto) {
    usEligibility = 'us_excluding_ny';
    eligibilityNotes = 'Webull Pay LLC state-licensed crypto service; strictly prohibited for New York residents.';
  }

  const instrumentEligibility: InstrumentEligibilityProfile = {
    asset_approved: isCrypto ? null : true, // Equities SEC-registered; crypto listed via Webull Pay without NY approval
    asset_approval_authority: isCrypto ? null : 'SEC_EXCHANGE_ACT',
    venue_authorized: true,
    pair_available: raw.status === 'T' ? true : null,
    customer_eligibility_tier: usEligibility,
    prohibited_states: isCrypto ? ['NY'] : [],
    eligibility_notes: eligibilityNotes,
    evidence_basis: {
      statutory_charter_checked: true,
      asset_classification_checked: !isCrypto,
      orderbook_trading_observed: false,
    },
  };

  return {
    instrument_id: `${venueId}:${baseAsset}-${quoteAsset}:${marketType}`,
    venue: venueId,
    jurisdiction: 'US',
    market_class: marketClass,
    market_type: marketType,
    market_structure: 'BROKER_ROUTED',
    base_asset: baseAsset,
    quote_asset: quoteAsset,
    quote_class: 'fiat',
    trading_status: raw.status === 'T' ? 'active' : 'halted',
    orderbook_supported: false, // Invariant: Introducing broker routes to market makers and Apex Clearing, no internal CLOB
    orderbook_available: false, // Invariant: Introducing broker routes to market makers and Apex Clearing
    orderbook_verified_at: null,
    orderbook_depth_verified_at: null,
    withdrawal_supported: isCrypto ? null : false,
    network: isCrypto ? null : 'DTCC/NSCC',
    us_eligibility: usEligibility,
    instrument_eligibility: instrumentEligibility,
    instrument_eligibility_notes: eligibilityNotes,
    evidence_origin: evidenceOrigin,
    verification_status: verificationStatus,
    record_observed_at: recordObservedAt,
    source_document_updated_at: '2026-10-15T00:00:00Z',
    last_successful_live_poll: lastSuccessfulLivePoll,
    execution_authorized: false,
    source_api: 'https://quotes-gw.webullfintech.com/api/search/pc/tickers',
    venue_native_symbol: raw.symbol,
    maker_fee_bps: 0.0,
    taker_fee_bps: isCrypto ? 100.0 : 0.0, // Crypto markup vs zero-commission equities
    notes: isCrypto
      ? 'Broker-routed spot crypto via Webull Pay LLC (prohibited in NY).'
      : 'Introducing broker-dealer equity via Webull Financial LLC (Apex Clearing).',
  };
}

export const WEBULL_SAMPLE_TICKERS: WebullTickerRaw[] = [
  { tickerId: '913256135', symbol: 'BTCUSD', name: 'Bitcoin', type: 'crypto', status: 'T', currency: 'USD' },
  { tickerId: '913256136', symbol: 'ETHUSD', name: 'Ethereum', type: 'crypto', status: 'T', currency: 'USD' },
  { tickerId: '913256137', symbol: 'SOLUSD', name: 'Solana', type: 'crypto', status: 'T', currency: 'USD' },
  { tickerId: '913256138', symbol: 'DOGEUSD', name: 'Dogecoin', type: 'crypto', status: 'T', currency: 'USD' },
  { tickerId: '913254231', symbol: 'TSLA', name: 'Tesla Inc', type: 'stock', status: 'T', currency: 'USD' },
  { tickerId: '913254232', symbol: 'AMZN', name: 'Amazon.com Inc', type: 'stock', status: 'T', currency: 'USD' },
];

export function processWebullRawTickers(
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
    const type = item.type;

    if (!symbol || typeof symbol !== 'string' || symbol.trim() === '') {
      rejectedReasons.push({ id: symbol || 'missing_symbol', reason: 'Missing mandatory symbol' });
      continue;
    }
    if (!type || !['crypto', 'stock'].includes(type)) {
      rejectedReasons.push({ id: symbol, reason: 'Invalid or missing type (must be crypto or stock)' });
      continue;
    }

    const rec = normalizeWebullTicker(
      item as WebullTickerRaw,
      evidenceOrigin,
      verificationStatus,
      lastSuccessfulLivePoll,
      lastAttemptedPoll
    );
    records.push(rec);
  }

  return {
    venue: 'webull',
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

export async function pollWebullBroker(liveFetch: boolean = false): Promise<AdapterIngestionResult> {
  const start = Date.now();
  const now = new Date().toISOString();
  let rawItems: WebullTickerRaw[] = [];
  let isLive = false;
  let fetchError: string | null = null;
  let emptyPayload = false;

  if (liveFetch) {
    try {
      const resp = await fetch('https://quotes-gw.webullfintech.com/api/search/pc/tickers?keyword=crypto&pageIndex=1&pageSize=20', {
        headers: { 'User-Agent': 'Aegentix-Market-Discovery/1.2' },
        signal: AbortSignal.timeout(4000),
      });
      if (resp.ok) {
        const json = await resp.json();
        if (json && Array.isArray(json.data)) {
          if (json.data.length === 0) {
            emptyPayload = true;
            fetchError = 'Webull tickers API returned empty data array';
          } else {
            rawItems = json.data.map((d: any) => ({
              tickerId: String(d.tickerId),
              symbol: d.symbol,
              name: d.name,
              type: d.type === 2 ? 'crypto' : 'stock',
              status: 'T',
              currency: 'USD',
            }));
            isLive = true;
          }
        } else {
          fetchError = 'Unexpected Webull response structure';
        }
      } else {
        fetchError = `HTTP ${resp.status}: ${resp.statusText}`;
      }
    } catch (e: any) {
      fetchError = e?.message || 'Network timeout';
    }
  }

  if (isLive) {
    return processWebullRawTickers(
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
      venue: 'webull',
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
  return processWebullRawTickers(
    WEBULL_SAMPLE_TICKERS,
    'LOCAL_FIXTURE',
    'LOCAL_FIXTURE',
    null,
    now,
    Date.now() - start,
    fallbackStatus,
    fetchError
  );
}
