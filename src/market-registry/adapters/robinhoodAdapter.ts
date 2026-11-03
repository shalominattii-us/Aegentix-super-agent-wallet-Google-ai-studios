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

export interface RobinhoodInstrumentRaw {
  symbol: string; // e.g. "BTC-USD", "ETH-USD", "NVDA", "AAPL"
  asset_type: 'crypto' | 'equity';
  name: string;
  tradable: boolean;
  state: 'active' | 'inactive';
  min_order_size?: string;
}

export function normalizeRobinhoodInstrument(
  raw: RobinhoodInstrumentRaw,
  evidenceOrigin: EvidenceOrigin = 'LOCAL_FIXTURE',
  verificationStatus: VerificationStatus = 'LOCAL_FIXTURE',
  lastSuccessfulLivePoll: string | null = null,
  recordObservedAt: string = new Date().toISOString()
): CanonicalInstrumentRecord {
  const isCrypto = raw.asset_type === 'crypto';
  let baseAsset = raw.symbol.toUpperCase().trim();
  let quoteAsset = 'USD';

  if (isCrypto && baseAsset.includes('-')) {
    const parts = baseAsset.split('-');
    baseAsset = parts[0];
    quoteAsset = parts[1] || 'USD';
  }

  const venueId = isCrypto ? 'robinhood_crypto' : 'robinhood_financial';
  const marketClass: MarketClass = isCrypto ? 'digital_assets' : 'traditional_markets';
  const marketType: MarketType = isCrypto ? 'broker_routed_spot' : 'broker_equity';

  // Per-instrument eligibility modeling
  let usEligibility: UsEligibilityStatus = 'us_available';
  let eligibilityNotes = 'Robinhood Financial SEC/FINRA retail brokerage tradable equity.';

  if (isCrypto) {
    const NYDFS_GREENLIST = ['BTC', 'ETH', 'LTC', 'BCH', 'USDC'];
    if (NYDFS_GREENLIST.includes(baseAsset)) {
      usEligibility = 'us_available';
      eligibilityNotes = 'Robinhood Crypto LLC (NYDFS BitLicense); approved for NY residents.';
    } else {
      usEligibility = 'us_excluding_ny';
      eligibilityNotes = 'Robinhood Crypto LLC; available in participating US states, restricted for NY residents.';
    }
  }

  const instrumentEligibility: InstrumentEligibilityProfile = {
    asset_approved: isCrypto ? (usEligibility === 'us_available' ? true : null) : true,
    asset_approval_authority: isCrypto ? (usEligibility === 'us_available' ? 'NYDFS_BITLICENSE' : null) : 'SEC_EXCHANGE_ACT',
    venue_authorized: true,
    pair_available: (raw.tradable && raw.state === 'active') ? true : null,
    customer_eligibility_tier: usEligibility,
    prohibited_states: isCrypto && usEligibility === 'us_excluding_ny' ? ['NY'] : [],
    eligibility_notes: eligibilityNotes,
    evidence_basis: {
      statutory_charter_checked: true,
      asset_classification_checked: isCrypto ? usEligibility === 'us_available' : true,
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
    trading_status: raw.tradable && raw.state === 'active' ? 'active' : 'halted',
    orderbook_supported: false, // Invariant: Introducing broker routes to market makers, no internal CLOB
    orderbook_available: false, // Invariant: Retail broker routes orders to market makers, not an internal orderbook
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
    source_api: isCrypto ? 'https://trading.robinhood.com/api/v1/crypto/trading/pairs/' : 'https://api.robinhood.com/instruments/',
    venue_native_symbol: raw.symbol,
    maker_fee_bps: 0.0,
    taker_fee_bps: 0.0, // Commission-free; internalized order flow / PFOF
    min_order_size: parseFloat(raw.min_order_size || '1.0') || 1.0,
    notes: isCrypto 
      ? 'Broker-routed spot crypto via Robinhood Crypto LLC (NYDFS BitLicense).' 
      : 'Retail equity routed via Robinhood Financial LLC (SEC/FINRA Broker-Dealer).',
  };
}

export const ROBINHOOD_SAMPLE_INSTRUMENTS: RobinhoodInstrumentRaw[] = [
  { symbol: 'BTC-USD', asset_type: 'crypto', name: 'Bitcoin', tradable: true, state: 'active', min_order_size: '0.00001' },
  { symbol: 'ETH-USD', asset_type: 'crypto', name: 'Ethereum', tradable: true, state: 'active', min_order_size: '0.0001' },
  { symbol: 'SOL-USD', asset_type: 'crypto', name: 'Solana', tradable: true, state: 'active', min_order_size: '0.01' },
  { symbol: 'DOGE-USD', asset_type: 'crypto', name: 'Dogecoin', tradable: true, state: 'active', min_order_size: '1.0' },
  { symbol: 'SHIB-USD', asset_type: 'crypto', name: 'Shiba Inu', tradable: true, state: 'active', min_order_size: '1000' },
  { symbol: 'NVDA', asset_type: 'equity', name: 'NVIDIA Corporation', tradable: true, state: 'active', min_order_size: '0.001' },
  { symbol: 'AAPL', asset_type: 'equity', name: 'Apple Inc.', tradable: true, state: 'active', min_order_size: '0.001' },
  { symbol: 'MSFT', asset_type: 'equity', name: 'Microsoft Corporation', tradable: true, state: 'active', min_order_size: '0.001' },
];

export function processRobinhoodRawInstruments(
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
    const assetType = item.asset_type;

    if (!symbol || typeof symbol !== 'string' || symbol.trim() === '') {
      rejectedReasons.push({ id: symbol || 'missing_symbol', reason: 'Missing mandatory symbol' });
      continue;
    }
    if (!assetType || !['crypto', 'equity'].includes(assetType)) {
      rejectedReasons.push({ id: symbol, reason: 'Invalid or missing asset_type (must be crypto or equity)' });
      continue;
    }

    const rec = normalizeRobinhoodInstrument(
      item as RobinhoodInstrumentRaw,
      evidenceOrigin,
      verificationStatus,
      lastSuccessfulLivePoll,
      lastAttemptedPoll
    );
    records.push(rec);
  }

  return {
    venue: 'robinhood',
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

export async function pollRobinhoodBroker(liveFetch: boolean = false): Promise<AdapterIngestionResult> {
  const start = Date.now();
  const now = new Date().toISOString();
  let rawItems: RobinhoodInstrumentRaw[] = [];
  let isLive = false;
  let fetchError: string | null = null;
  let emptyPayload = false;

  if (liveFetch) {
    try {
      const resp = await fetch('https://trading.robinhood.com/api/v1/crypto/trading/pairs/', {
        headers: { 'User-Agent': 'Aegentix-Market-Discovery/1.2' },
        signal: AbortSignal.timeout(4000),
      });
      if (resp.ok) {
        const json = await resp.json();
        if (json && Array.isArray(json.results)) {
          if (json.results.length === 0) {
            emptyPayload = true;
            fetchError = 'Robinhood crypto pairs returned empty results array';
          } else {
            rawItems = json.results.map((r: any) => ({
              symbol: r.symbol,
              asset_type: 'crypto',
              name: r.asset_currency?.name || r.symbol,
              tradable: r.tradability === 'tradable',
              state: 'active',
            }));
            isLive = true;
          }
        } else {
          fetchError = 'Unexpected Robinhood response structure';
        }
      } else {
        fetchError = `HTTP ${resp.status}: ${resp.statusText}`;
      }
    } catch (e: any) {
      fetchError = e?.message || 'Network timeout';
    }
  }

  if (isLive) {
    return processRobinhoodRawInstruments(
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
      venue: 'robinhood',
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
  return processRobinhoodRawInstruments(
    ROBINHOOD_SAMPLE_INSTRUMENTS,
    'LOCAL_FIXTURE',
    'LOCAL_FIXTURE',
    null,
    now,
    Date.now() - start,
    fallbackStatus,
    fetchError
  );
}
