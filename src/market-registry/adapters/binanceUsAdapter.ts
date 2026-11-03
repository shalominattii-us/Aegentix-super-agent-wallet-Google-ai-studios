import { 
  CanonicalInstrumentRecord, 
  QuoteClass, 
  VerificationStatus, 
  EvidenceOrigin,
  InstrumentEligibilityProfile 
} from '../canonicalTypes.ts';
import { AdapterIngestionResult } from './coinbaseAdapter.ts';

export interface BinanceUsSymbolRaw {
  symbol: string; // e.g. "BTCUSD", "ETHUSDT"
  status: string; // "TRADING", "BREAK", "HALT"
  baseAsset: string;
  quoteAsset: string;
  isSpotTradingAllowed: boolean;
  filters?: any[];
}

export function normalizeBinanceUsSymbol(
  raw: BinanceUsSymbolRaw,
  evidenceOrigin: EvidenceOrigin = 'LOCAL_FIXTURE',
  verificationStatus: VerificationStatus = 'LOCAL_FIXTURE',
  lastSuccessfulLivePoll: string | null = null,
  recordObservedAt: string = new Date().toISOString()
): CanonicalInstrumentRecord {
  const baseAsset = (raw.baseAsset || '').toUpperCase().trim();
  const quoteAsset = (raw.quoteAsset || '').toUpperCase().trim();

  let quoteClass: QuoteClass = 'crypto_quote';
  if (['USD', 'EUR', 'GBP'].includes(quoteAsset)) {
    quoteClass = 'fiat';
  } else if (['USDC', 'USDT', 'PYUSD', 'DAI', 'GUSD', 'RLUSD', 'USDS', 'FDUSD', 'USD1'].includes(quoteAsset)) {
    quoteClass = 'stablecoin';
  }

  const isTrading = raw.status === 'TRADING' && raw.isSpotTradingAllowed;

  const instrumentEligibility: InstrumentEligibilityProfile = {
    asset_approved: null, // Binance.US lists assets under internal review; no federal or NYDFS approval
    asset_approval_authority: null,
    venue_authorized: true, // BAM Trading Services Inc. FinCEN MSB & State MTLs
    pair_available: isTrading ? true : null,
    customer_eligibility_tier: 'us_excluding_ny',
    prohibited_states: ['NY', 'TX', 'VT', 'HI'],
    eligibility_notes: 'BAM Trading Services Inc. Multi-state MTL operation; prohibited in NY, TX, VT, HI.',
    evidence_basis: {
      statutory_charter_checked: true,
      asset_classification_checked: false,
      orderbook_trading_observed: false,
    },
  };

  return {
    instrument_id: `binance_us:${baseAsset}-${quoteAsset}:spot`,
    venue: 'binance_us',
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
    us_eligibility: 'us_excluding_ny', // BAM Trading Services prohibited in NY, TX, VT, etc.
    instrument_eligibility: instrumentEligibility,
    instrument_eligibility_notes: instrumentEligibility.eligibility_notes,
    evidence_origin: evidenceOrigin,
    verification_status: verificationStatus,
    record_observed_at: recordObservedAt,
    source_document_updated_at: '2026-10-01T00:00:00Z',
    last_successful_live_poll: lastSuccessfulLivePoll,
    execution_authorized: false,
    source_api: 'https://api.binance.us/api/v3/exchangeInfo',
    venue_native_symbol: raw.symbol,
    maker_fee_bps: 10.0,
    taker_fee_bps: 20.0,
    notes: 'Ingested via Binance.US (BAM Trading Services Inc.) official exchangeInfo API.',
  };
}

export const BINANCE_US_SAMPLE_SYMBOLS: BinanceUsSymbolRaw[] = [
  { symbol: 'BTCUSD', baseAsset: 'BTC', quoteAsset: 'USD', status: 'TRADING', isSpotTradingAllowed: true },
  { symbol: 'BTCUSDT', baseAsset: 'BTC', quoteAsset: 'USDT', status: 'TRADING', isSpotTradingAllowed: true },
  { symbol: 'BTCUSDC', baseAsset: 'BTC', quoteAsset: 'USDC', status: 'TRADING', isSpotTradingAllowed: true },
  { symbol: 'ETHUSD', baseAsset: 'ETH', quoteAsset: 'USD', status: 'TRADING', isSpotTradingAllowed: true },
  { symbol: 'ETHUSDT', baseAsset: 'ETH', quoteAsset: 'USDT', status: 'TRADING', isSpotTradingAllowed: true },
  { symbol: 'ETHUSDC', baseAsset: 'ETH', quoteAsset: 'USDC', status: 'TRADING', isSpotTradingAllowed: true },
  { symbol: 'SOLUSD', baseAsset: 'SOL', quoteAsset: 'USD', status: 'TRADING', isSpotTradingAllowed: true },
  { symbol: 'SOLUSDT', baseAsset: 'SOL', quoteAsset: 'USDT', status: 'TRADING', isSpotTradingAllowed: true },
  { symbol: 'ADAUSDT', baseAsset: 'ADA', quoteAsset: 'USDT', status: 'TRADING', isSpotTradingAllowed: true },
  { symbol: 'DOGEUSDT', baseAsset: 'DOGE', quoteAsset: 'USDT', status: 'TRADING', isSpotTradingAllowed: true },
  { symbol: 'AVAXUSDT', baseAsset: 'AVAX', quoteAsset: 'USDT', status: 'TRADING', isSpotTradingAllowed: true },
  { symbol: 'LINKUSDT', baseAsset: 'LINK', quoteAsset: 'USDT', status: 'TRADING', isSpotTradingAllowed: true },
  { symbol: 'USDCUSD', baseAsset: 'USDC', quoteAsset: 'USD', status: 'TRADING', isSpotTradingAllowed: true },
  { symbol: 'USDTUSD', baseAsset: 'USDT', quoteAsset: 'USD', status: 'TRADING', isSpotTradingAllowed: true },
  { symbol: 'USDCUSDT', baseAsset: 'USDC', quoteAsset: 'USDT', status: 'TRADING', isSpotTradingAllowed: true },
];

export function processBinanceUsRawSymbols(
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
    const baseAsset = item.baseAsset;
    const quoteAsset = item.quoteAsset;

    if (!symbol || typeof symbol !== 'string' || symbol.trim() === '') {
      rejectedReasons.push({ id: symbol || 'missing_symbol', reason: 'Missing mandatory symbol identifier' });
      continue;
    }
    if (!baseAsset || typeof baseAsset !== 'string' || baseAsset.trim() === '') {
      rejectedReasons.push({ id: symbol, reason: 'Missing mandatory baseAsset' });
      continue;
    }
    if (!quoteAsset || typeof quoteAsset !== 'string' || quoteAsset.trim() === '') {
      rejectedReasons.push({ id: symbol, reason: 'Missing mandatory quoteAsset' });
      continue;
    }

    const rec = normalizeBinanceUsSymbol(
      item as BinanceUsSymbolRaw,
      evidenceOrigin,
      verificationStatus,
      lastSuccessfulLivePoll,
      lastAttemptedPoll
    );
    records.push(rec);
  }

  return {
    venue: 'binance_us',
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

export async function pollBinanceUs(liveFetch: boolean = false): Promise<AdapterIngestionResult> {
  const start = Date.now();
  const now = new Date().toISOString();
  let rawItems: BinanceUsSymbolRaw[] = [];
  let isLive = false;
  let fetchError: string | null = null;
  let emptyPayload = false;

  if (liveFetch) {
    try {
      const resp = await fetch('https://api.binance.us/api/v3/exchangeInfo', {
        headers: { 'User-Agent': 'Aegentix-Market-Discovery/1.1' },
        signal: AbortSignal.timeout(4000),
      });
      if (resp.ok) {
        const json = await resp.json();
        if (json && Array.isArray(json.symbols)) {
          if (json.symbols.length === 0) {
            emptyPayload = true;
            fetchError = 'Binance.US exchangeInfo returned empty symbols array';
          } else {
            rawItems = json.symbols;
            isLive = true;
          }
        } else {
          fetchError = 'Unexpected Binance.US JSON response structure (missing symbols array)';
        }
      } else {
        fetchError = `HTTP ${resp.status}: ${resp.statusText}`;
      }
    } catch (e: any) {
      fetchError = e?.message || 'Network timeout';
    }
  }

  if (isLive) {
    return processBinanceUsRawSymbols(
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
      venue: 'binance_us',
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
  return processBinanceUsRawSymbols(
    BINANCE_US_SAMPLE_SYMBOLS,
    'LOCAL_FIXTURE',
    'LOCAL_FIXTURE',
    null, // STRICT INVARIANT: never populate last_successful_live_poll on fixture fallback
    now,
    Date.now() - start,
    fallbackStatus,
    fetchError
  );
}
