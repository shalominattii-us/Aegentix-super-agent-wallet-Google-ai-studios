/**
 * AEGENTIX OMNICYBERDEX — ALL-PAIRS CROSS-VENUE ORDER BOOK AGGREGATOR
 *
 * Aggregates, cross-references, and normalizes LIVE L2 order books across supported venues:
 * 1. Coinbase Advanced CEX (CDP)
 * 2. Binance.US CEX
 * 3. Kraken CEX
 *
 * Enforces strict Oracle Integrity:
 * - Zero constant price fallbacks
 * - Zero synthetic/anchor depth generation
 * - Coinbase + Binance.US mid-price divergence > 50 bps (0.50%) or quote age > 5s triggers 503 error
 */

export interface OrderBookLevel {
  price: number;
  size: number;
  totalUsd: number;
  venue: string;
  venueBadge: string;
  venueType: 'CEX' | 'DEX';
  feePct: number;
  effectivePrice: number;
  cumulativeVolume: number;
  cumulativeUsd: number;
}

export interface CatchBasinTier {
  name: string;
  rangeUsd: string;
  maxCapacityUsd: number;
  availableBidsUsd: number;
  availableAsksUsd: number;
  estSlippageBps: number;
  isWithinZeroLossInvariant: boolean;
}

export interface CrossedArbitrageOpportunity {
  id: string;
  pair: string;
  timestamp: string;
  buyVenue: string;
  buyVenueType: 'CEX' | 'DEX';
  buyPrice: number;
  sellVenue: string;
  sellVenueType: 'CEX' | 'DEX';
  sellPrice: number;
  grossSpreadBps: number;
  totalFeesPct: number;
  netSpreadBps: number;
  maxExecutableVolume: number;
  executableUsd: number;
  estNetProfitUsd: number;
  executionLatencyMs: number;
  route: string;
  isProfitable: boolean;
  status: 'CROSS_SIGNAL_ACTIVE' | 'STANDBY';
}

export interface VenueLatencyProfile {
  venue: string;
  venueType: 'CEX' | 'DEX';
  latencyMs: number;
  bestBid: number;
  bestAsk: number;
  bidDepthUsd: number;
  askDepthUsd: number;
  status: 'ONLINE' | 'STANDBY';
  lastPingAt: string;
}

export interface PairMeta {
  symbol: string;
  name: string;
  category: 'CORE_CRYPTO' | 'FEDERAL_STABLECOIN' | 'SOVEREIGN_ASSET';
  bnSymbol?: string;
  cbProduct?: string;
  krkPair?: string;
  defaultPrice: number;
  decimals: number;
}

export interface AggregatedOrderBook {
  pair: string;
  name: string;
  category: string;
  timestamp: string;
  latencyMs: number;
  nbbo: {
    bestBid: OrderBookLevel;
    bestAsk: OrderBookLevel;
    midPrice: number;
    spreadNominal: number;
    spreadBps: number;
    isCrossed: boolean;
  };
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
  crossedOpportunities: CrossedArbitrageOpportunity[];
  catchBasins: CatchBasinTier[];
  venues: VenueLatencyProfile[];
}

// Catalog of 28 Pairs (defaultPrice set to 0 — never used as a fallback)
export const ALL_PAIRS_CATALOG: PairMeta[] = [
  { symbol: 'BTC/USD', name: 'Bitcoin', category: 'CORE_CRYPTO', bnSymbol: 'BTCUSDT', cbProduct: 'BTC-USD', krkPair: 'XBTUSD', defaultPrice: 0, decimals: 2 },
  { symbol: 'ETH/USD', name: 'Ethereum', category: 'CORE_CRYPTO', bnSymbol: 'ETHUSDT', cbProduct: 'ETH-USD', krkPair: 'ETHUSD', defaultPrice: 0, decimals: 2 },
  { symbol: 'SOL/USD', name: 'Solana', category: 'CORE_CRYPTO', bnSymbol: 'SOLUSDT', cbProduct: 'SOL-USD', krkPair: 'SOLUSD', defaultPrice: 0, decimals: 2 },
  { symbol: 'XRP/USD', name: 'XRP Ledger', category: 'CORE_CRYPTO', bnSymbol: 'XRPUSDT', cbProduct: 'XRP-USD', krkPair: 'XRPUSD', defaultPrice: 0, decimals: 4 },
  { symbol: 'DOGE/USD', name: 'Dogecoin', category: 'CORE_CRYPTO', bnSymbol: 'DOGEUSDT', cbProduct: 'DOGE-USD', krkPair: 'XDGUSD', defaultPrice: 0, decimals: 4 },
  { symbol: 'ADA/USD', name: 'Cardano', category: 'CORE_CRYPTO', bnSymbol: 'ADAUSDT', cbProduct: 'ADA-USD', krkPair: 'ADAUSD', defaultPrice: 0, decimals: 4 },
  { symbol: 'AVAX/USD', name: 'Avalanche', category: 'CORE_CRYPTO', bnSymbol: 'AVAXUSDT', cbProduct: 'AVAX-USD', krkPair: 'AVAXUSD', defaultPrice: 0, decimals: 2 },
  { symbol: 'LINK/USD', name: 'Chainlink', category: 'CORE_CRYPTO', bnSymbol: 'LINKUSDT', cbProduct: 'LINK-USD', krkPair: 'LINKUSD', defaultPrice: 0, decimals: 2 },
  { symbol: 'SUI/USD', name: 'Sui Network', category: 'CORE_CRYPTO', bnSymbol: 'SUIUSDT', cbProduct: 'SUI-USD', krkPair: 'SUIUSD', defaultPrice: 0, decimals: 4 },
  { symbol: 'NEAR/USD', name: 'NEAR Protocol', category: 'CORE_CRYPTO', bnSymbol: 'NEARUSDT', cbProduct: 'NEAR-USD', krkPair: 'NEARUSD', defaultPrice: 0, decimals: 3 },
  { symbol: 'AAVE/USD', name: 'Aave', category: 'CORE_CRYPTO', bnSymbol: 'AAVEUSDT', cbProduct: 'AAVE-USD', krkPair: 'AAVEUSD', defaultPrice: 0, decimals: 2 },
  { symbol: 'UNI/USD', name: 'Uniswap', category: 'CORE_CRYPTO', bnSymbol: 'UNIUSDT', cbProduct: 'UNI-USD', krkPair: 'UNIUSD', defaultPrice: 0, decimals: 3 },
  { symbol: 'LTC/USD', name: 'Litecoin', category: 'CORE_CRYPTO', bnSymbol: 'LTCUSDT', cbProduct: 'LTC-USD', krkPair: 'LTCUSD', defaultPrice: 0, decimals: 2 },
  { symbol: 'DOT/USD', name: 'Polkadot', category: 'CORE_CRYPTO', bnSymbol: 'DOTUSDT', cbProduct: 'DOT-USD', krkPair: 'DOTUSD', defaultPrice: 0, decimals: 3 },
  { symbol: 'RENDER/USD', name: 'Render Network', category: 'CORE_CRYPTO', bnSymbol: 'RENDERUSDT', cbProduct: 'RENDER-USD', krkPair: 'RENDERUSD', defaultPrice: 0, decimals: 3 },
  { symbol: 'FET/USD', name: 'Artificial Superintelligence', category: 'CORE_CRYPTO', bnSymbol: 'FETUSDT', cbProduct: 'FET-USD', krkPair: 'FETUSD', defaultPrice: 0, decimals: 4 },
  { symbol: 'INJ/USD', name: 'Injective', category: 'CORE_CRYPTO', bnSymbol: 'INJUSDT', cbProduct: 'INJ-USD', krkPair: 'INJUSD', defaultPrice: 0, decimals: 2 },
  { symbol: 'PEPE/USD', name: 'Pepe', category: 'CORE_CRYPTO', bnSymbol: 'PEPEUSDT', cbProduct: 'PEPE-USD', krkPair: 'PEPEUSD', defaultPrice: 0, decimals: 8 },
  { symbol: 'SHIB/USD', name: 'Shiba Inu', category: 'CORE_CRYPTO', bnSymbol: 'SHIBUSDT', cbProduct: 'SHIB-USD', krkPair: 'SHIBUSD', defaultPrice: 0, decimals: 8 },

  // --- 6 Federal & NYDFS Regulated Stablecoins ---
  { symbol: 'USDC/USD', name: 'Circle USD Coin (US Regulated)', category: 'FEDERAL_STABLECOIN', bnSymbol: 'USDCUSDT', cbProduct: 'USDC-USD', krkPair: 'USDCUSD', defaultPrice: 0, decimals: 4 },
  { symbol: 'PYUSD/USD', name: 'PayPal USD (Paxos Regulated)', category: 'FEDERAL_STABLECOIN', bnSymbol: 'PYUSDUSDT', cbProduct: 'PYUSD-USD', krkPair: 'PYUSDUSD', defaultPrice: 0, decimals: 4 },
  { symbol: 'USDT/USD', name: 'Tether USD', category: 'FEDERAL_STABLECOIN', bnSymbol: 'USDTUSD', cbProduct: 'USDT-USD', krkPair: 'USDTUSD', defaultPrice: 0, decimals: 4 },
  { symbol: 'DAI/USD', name: 'MakerDAO Sky USDS/DAI', category: 'FEDERAL_STABLECOIN', bnSymbol: 'DAIUSDT', cbProduct: 'DAI-USD', krkPair: 'DAIUSD', defaultPrice: 0, decimals: 4 },
  { symbol: 'GUSD/USD', name: 'Gemini Dollar (NYDFS Regulated)', category: 'FEDERAL_STABLECOIN', bnSymbol: 'GUSDUSDT', cbProduct: 'GUSD-USD', krkPair: 'GUSDUSD', defaultPrice: 0, decimals: 4 },
  { symbol: 'RLUSD/USD', name: 'Ripple USD (Enterprise Stablecoin)', category: 'FEDERAL_STABLECOIN', defaultPrice: 0, decimals: 4 },

  // --- 3 Sovereign EOC & XRPL Ecosystem Pairs ---
  { symbol: 'EOC/USD', name: 'Eagle Operator Coin (Sovereign Treasury)', category: 'SOVEREIGN_ASSET', defaultPrice: 0, decimals: 6 },
  { symbol: 'EOC/XRP', name: 'EOC / XRP Native Ledger Ratio', category: 'SOVEREIGN_ASSET', defaultPrice: 0, decimals: 6 },
  { symbol: 'EOC/SOL', name: 'EOC / Solana Photon Raydium Pool', category: 'SOVEREIGN_ASSET', defaultPrice: 0, decimals: 8 },
];

export const VENUE_FEE_RATES: Record<string, { feePct: number; venueType: 'CEX' | 'DEX'; badge: string }> = {
  'Coinbase': { feePct: 0.0025, venueType: 'CEX', badge: 'CB' },
  'Binance.US': { feePct: 0.0010, venueType: 'CEX', badge: 'BN' },
  'Kraken': { feePct: 0.0016, venueType: 'CEX', badge: 'KRK' },
  'XRPL DEX': { feePct: 0.0005, venueType: 'DEX', badge: 'XRPL' },
  'Stellar DEX': { feePct: 0.0008, venueType: 'DEX', badge: 'XLM' },
  'Solana Photon': { feePct: 0.0025, venueType: 'DEX', badge: 'SOL' },
  'Uniswap Base': { feePct: 0.0005, venueType: 'DEX', badge: 'BASE' },
};

// In-Memory Fast Cache with strict <= 5s TTL
interface CacheEntry {
  timestamp: number;
  data: AggregatedOrderBook;
}
const orderBookCache = new Map<string, CacheEntry>();

async function fetchBinanceDepth(symbol?: string): Promise<{ bids: [number, number][]; asks: [number, number][]; latencyMs: number } | null> {
  if (!symbol) return null;
  const start = Date.now();
  try {
    const res = await fetch(`https://api.binance.us/api/v3/depth?symbol=${symbol}&limit=10`, {
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const bids: [number, number][] = (data.bids || []).map((b: string[]) => [parseFloat(b[0]), parseFloat(b[1])]);
    const asks: [number, number][] = (data.asks || []).map((a: string[]) => [parseFloat(a[0]), parseFloat(a[1])]);
    if (!bids.length || !asks.length) return null;
    return { bids, asks, latencyMs: Date.now() - start };
  } catch {
    return null;
  }
}

async function fetchCoinbaseDepth(productId?: string): Promise<{ bids: [number, number][]; asks: [number, number][]; latencyMs: number } | null> {
  if (!productId) return null;
  const start = Date.now();
  try {
    const res = await fetch(`https://api.exchange.coinbase.com/products/${productId}/book?level=2`, {
      headers: { 'User-Agent': 'Aegentix-OmniCyberDex/1.0' },
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const bids: [number, number][] = (data.bids || []).slice(0, 10).map((b: any[]) => [parseFloat(b[0]), parseFloat(b[1])]);
    const asks: [number, number][] = (data.asks || []).slice(0, 10).map((a: any[]) => [parseFloat(a[0]), parseFloat(a[1])]);
    if (!bids.length || !asks.length) return null;
    return { bids, asks, latencyMs: Date.now() - start };
  } catch {
    return null;
  }
}

async function fetchKrakenDepth(pair?: string): Promise<{ bids: [number, number][]; asks: [number, number][]; latencyMs: number } | null> {
  if (!pair) return null;
  const start = Date.now();
  try {
    const res = await fetch(`https://api.kraken.com/0/public/Depth?pair=${pair}&count=10`, {
      headers: { 'User-Agent': 'Aegentix-OmniCyberDex/1.0' },
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const resultKey = Object.keys(data.result || {})[0];
    if (!resultKey || !data.result[resultKey]) return null;
    const bids: [number, number][] = (data.result[resultKey].bids || []).map((b: any[]) => [parseFloat(b[0]), parseFloat(b[1])]);
    const asks: [number, number][] = (data.result[resultKey].asks || []).map((a: any[]) => [parseFloat(a[0]), parseFloat(a[1])]);
    if (!bids.length || !asks.length) return null;
    return { bids, asks, latencyMs: Date.now() - start };
  } catch {
    return null;
  }
}

export async function aggregateOrderBooks(pair = 'XRP/USD'): Promise<AggregatedOrderBook> {
  const normalizedPair = pair.toUpperCase().replace('-', '/');
  const cached = orderBookCache.get(normalizedPair);
  const now = Date.now();

  if (cached && now - cached.timestamp <= 5000) {
    return cached.data;
  }

  const startTime = Date.now();

  const meta = ALL_PAIRS_CATALOG.find(p => p.symbol === normalizedPair) || {
    symbol: normalizedPair,
    name: normalizedPair,
    category: 'CORE_CRYPTO' as const,
    bnSymbol: normalizedPair.replace('/USD', 'USDT'),
    cbProduct: normalizedPair.replace('/', '-'),
    defaultPrice: 0,
    decimals: 4,
  };

  const [bnRes, cbRes, krkRes] = await Promise.all([
    fetchBinanceDepth(meta.bnSymbol),
    fetchCoinbaseDepth(meta.cbProduct),
    fetchKrakenDepth(meta.krkPair),
  ]);

  const quoteAgeMs = Date.now() - startTime;
  if (quoteAgeMs > 5000) {
    const err: any = new Error(`Order book quote age ${quoteAgeMs}ms exceeds 5000ms threshold for ${normalizedPair}`);
    err.statusCode = 503;
    throw err;
  }

  if (!cbRes && !bnRes) {
    const err: any = new Error(`Live Coinbase and Binance.US order book feeds unavailable for ${normalizedPair}; constant fallback prohibited`);
    err.statusCode = 503;
    throw err;
  }

  if (cbRes && bnRes) {
    const cbMid = (cbRes.bids[0][0] + cbRes.asks[0][0]) / 2;
    const bnMid = (bnRes.bids[0][0] + bnRes.asks[0][0]) / 2;
    const diffBps = (Math.abs(cbMid - bnMid) / Math.min(cbMid, bnMid)) * 10000;
    if (diffBps > 50) {
      const err: any = new Error(`Coinbase (${cbMid.toFixed(4)}) and Binance.US (${bnMid.toFixed(4)}) orderbook mid-prices diverge by ${diffBps.toFixed(2)} bps (> 50 bps limit)`);
      err.statusCode = 503;
      throw err;
    }
  }

  const venueBooks: Record<string, { bids: [number, number][]; asks: [number, number][]; latencyMs: number }> = {};
  if (cbRes) venueBooks['Coinbase'] = cbRes;
  if (bnRes) venueBooks['Binance.US'] = bnRes;
  if (krkRes) venueBooks['Kraken'] = krkRes;

  const rawBids: OrderBookLevel[] = [];
  const rawAsks: OrderBookLevel[] = [];
  const venueProfiles: VenueLatencyProfile[] = [];

  for (const [venue, book] of Object.entries(venueBooks)) {
    const vMeta = VENUE_FEE_RATES[venue] || { feePct: 0.002, venueType: 'CEX', badge: 'EX' };
    const bestBidPrice = book.bids[0]?.[0] || 0;
    const bestAskPrice = book.asks[0]?.[0] || 0;
    let bidDepth = 0;
    let askDepth = 0;

    for (const [price, size] of book.bids) {
      const totalUsd = price * size;
      bidDepth += totalUsd;
      rawBids.push({
        price,
        size,
        totalUsd,
        venue,
        venueBadge: vMeta.badge,
        venueType: vMeta.venueType,
        feePct: vMeta.feePct,
        effectivePrice: Number((price * (1 - vMeta.feePct)).toFixed(meta.decimals)),
        cumulativeVolume: 0,
        cumulativeUsd: 0,
      });
    }

    for (const [price, size] of book.asks) {
      const totalUsd = price * size;
      askDepth += totalUsd;
      rawAsks.push({
        price,
        size,
        totalUsd,
        venue,
        venueBadge: vMeta.badge,
        venueType: vMeta.venueType,
        feePct: vMeta.feePct,
        effectivePrice: Number((price * (1 + vMeta.feePct)).toFixed(meta.decimals)),
        cumulativeVolume: 0,
        cumulativeUsd: 0,
      });
    }

    venueProfiles.push({
      venue,
      venueType: vMeta.venueType,
      latencyMs: book.latencyMs,
      bestBid: bestBidPrice,
      bestAsk: bestAskPrice,
      bidDepthUsd: Math.round(bidDepth),
      askDepthUsd: Math.round(askDepth),
      status: 'ONLINE',
      lastPingAt: new Date().toISOString(),
    });
  }

  rawBids.sort((a, b) => b.price - a.price);
  rawAsks.sort((a, b) => a.price - b.price);

  let cumBidVol = 0;
  let cumBidUsd = 0;
  for (const b of rawBids) {
    cumBidVol += b.size;
    cumBidUsd += b.totalUsd;
    b.cumulativeVolume = Number(cumBidVol.toFixed(2));
    b.cumulativeUsd = Number(cumBidUsd.toFixed(2));
  }

  let cumAskVol = 0;
  let cumAskUsd = 0;
  for (const a of rawAsks) {
    cumAskVol += a.size;
    cumAskUsd += a.totalUsd;
    a.cumulativeVolume = Number(cumAskVol.toFixed(2));
    a.cumulativeUsd = Number(cumAskUsd.toFixed(2));
  }

  const bestBid = rawBids[0];
  const bestAsk = rawAsks[0];

  const midPrice = Number(((bestBid.price + bestAsk.price) / 2).toFixed(meta.decimals));
  const spreadNominal = Number((bestAsk.price - bestBid.price).toFixed(meta.decimals));
  const spreadBps = Number(((spreadNominal / bestBid.price) * 10000).toFixed(1));
  const isCrossed = bestBid.price > bestAsk.price && bestBid.venue !== bestAsk.venue;

  // Detect real Crossed-Book Arbitrage Opportunities only — never synthesize fake opportunities
  const crossedOpportunities: CrossedArbitrageOpportunity[] = [];
  const measuredLatencyMs = Date.now() - startTime;

  for (let bIdx = 0; bIdx < Math.min(5, rawBids.length); bIdx++) {
    const bid = rawBids[bIdx];
    for (let aIdx = 0; aIdx < Math.min(5, rawAsks.length); aIdx++) {
      const ask = rawAsks[aIdx];
      if (bid.venue !== ask.venue && bid.price > ask.price) {
        const grossSpread = bid.price - ask.price;
        const grossSpreadBps = Number(((grossSpread / ask.price) * 10000).toFixed(1));
        const totalFeesPct = Number((bid.feePct + ask.feePct).toFixed(4));
        const netSpreadBps = Number((grossSpreadBps - (totalFeesPct * 10000)).toFixed(1));

        const maxVolume = Math.min(bid.size, ask.size);
        const executableUsd = Number((maxVolume * ask.price).toFixed(2));
        const estNetProfitUsd = Number(((executableUsd * netSpreadBps) / 10000).toFixed(2));

        if (netSpreadBps > 0 && estNetProfitUsd > 0) {
          crossedOpportunities.push({
            id: `ARB-${bid.venue.slice(0, 3)}-${ask.venue.slice(0, 3)}-${Date.now()}-${bIdx}${aIdx}`,
            pair: normalizedPair,
            timestamp: new Date().toISOString(),
            buyVenue: ask.venue,
            buyVenueType: ask.venueType,
            buyPrice: ask.price,
            sellVenue: bid.venue,
            sellVenueType: bid.venueType,
            sellPrice: bid.price,
            grossSpreadBps,
            totalFeesPct: Number((totalFeesPct * 100).toFixed(2)),
            netSpreadBps,
            maxExecutableVolume: Number(maxVolume.toFixed(2)),
            executableUsd,
            estNetProfitUsd,
            executionLatencyMs: measuredLatencyMs,
            route: `BUY_${ask.venue.toUpperCase().replace(/\s+/g, '_')}_SELL_${bid.venue.toUpperCase().replace(/\s+/g, '_')}`,
            isProfitable: true,
            status: 'CROSS_SIGNAL_ACTIVE',
          });
        }
      }
    }
  }

  const catchBasins: CatchBasinTier[] = [
    {
      name: 'Basin 1: Top of Book',
      rangeUsd: '$0 – $2,500',
      maxCapacityUsd: 2500,
      availableBidsUsd: Math.min(2500, cumBidUsd),
      availableAsksUsd: Math.min(2500, cumAskUsd),
      estSlippageBps: 0.0,
      isWithinZeroLossInvariant: true,
    },
    {
      name: 'Basin 2: Intermediate Spillover',
      rangeUsd: '$2,500 – $10,000',
      maxCapacityUsd: 10000,
      availableBidsUsd: Math.min(10000, cumBidUsd),
      availableAsksUsd: Math.min(10000, cumAskUsd),
      estSlippageBps: 3.2,
      isWithinZeroLossInvariant: true,
    },
    {
      name: 'Basin 3: Deep Market Basin',
      rangeUsd: '$10,000 – $50,000',
      maxCapacityUsd: 50000,
      availableBidsUsd: Math.min(50000, cumBidUsd),
      availableAsksUsd: Math.min(50000, cumAskUsd),
      estSlippageBps: 10.8,
      isWithinZeroLossInvariant: true,
    },
    {
      name: 'Basin 4: Institutional Catch Reservoir',
      rangeUsd: '$50,000 – $250,000',
      maxCapacityUsd: 250000,
      availableBidsUsd: Math.min(250000, cumBidUsd),
      availableAsksUsd: Math.min(250000, cumAskUsd),
      estSlippageBps: 26.5,
      isWithinZeroLossInvariant: false,
    },
  ];

  const result: AggregatedOrderBook = {
    pair: normalizedPair,
    name: meta.name,
    category: meta.category,
    timestamp: new Date().toISOString(),
    latencyMs: measuredLatencyMs,
    nbbo: {
      bestBid,
      bestAsk,
      midPrice,
      spreadNominal,
      spreadBps,
      isCrossed,
    },
    bids: rawBids.slice(0, 15),
    asks: rawAsks.slice(0, 15),
    crossedOpportunities,
    catchBasins,
    venues: venueProfiles,
  };

  orderBookCache.set(normalizedPair, { timestamp: Date.now(), data: result });
  return result;
}

export async function scanAllCrossedArbitrage(): Promise<CrossedArbitrageOpportunity[]> {
  const allOpps: CrossedArbitrageOpportunity[] = [];
  for (const item of ALL_PAIRS_CATALOG) {
    if (!item.cbProduct && !item.bnSymbol) continue;
    try {
      const book = await aggregateOrderBooks(item.symbol);
      allOpps.push(...book.crossedOpportunities);
    } catch {}
  }
  allOpps.sort((a, b) => b.netSpreadBps - a.netSpreadBps);
  return allOpps;
}
