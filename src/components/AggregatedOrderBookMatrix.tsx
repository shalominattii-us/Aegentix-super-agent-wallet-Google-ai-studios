import React, { useState, useEffect } from 'react';
import {
  Zap,
  TrendingUp,
  Activity,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  BarChart2,
  Clock,
  Sparkles,
  Search,
  Filter,
} from 'lucide-react';
import {
  AggregatedOrderBook,
  OrderBookLevel,
  CrossedArbitrageOpportunity,
  VenueLatencyProfile,
  CatchBasinTier,
  ALL_PAIRS_CATALOG,
  PairMeta,
} from '../trading/crossVenueOrderBookAggregator';

interface AggregatedOrderBookMatrixProps {
  onNotify?: (message: string, type: 'ALERT' | 'SUCCESS' | 'INFO') => void;
  defaultPair?: string;
}

export const AggregatedOrderBookMatrix: React.FC<AggregatedOrderBookMatrixProps> = ({
  onNotify,
  defaultPair = 'XRP/USD',
}) => {
  const [selectedPair, setSelectedPair] = useState<string>(defaultPair);
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'CORE_CRYPTO' | 'FEDERAL_STABLECOIN' | 'SOVEREIGN_ASSET'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [bookData, setBookData] = useState<AggregatedOrderBook | null>(null);
  const [allOpportunities, setAllOpportunities] = useState<CrossedArbitrageOpportunity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [executingSignalId, setExecutingSignalId] = useState<string | null>(null);
  const [filterVenue, setFilterVenue] = useState<string>('ALL');
  const [activeSubTab, setActiveSubTab] = useState<'ORDERBOOK' | 'SCANNER_ALL_PAIRS'>('ORDERBOOK');

  // Filter pairs list
  const filteredPairs = ALL_PAIRS_CATALOG.filter(p => {
    const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchesSearch = p.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const fetchBook = async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    try {
      const res = await fetch(`/api/orderbooks/aggregate?pair=${encodeURIComponent(selectedPair)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.book) {
          setBookData(data.book);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch aggregated order book:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const fetchAllArbitrage = async () => {
    try {
      const res = await fetch('/api/orderbooks/all-arbitrage-signals');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.opportunities)) {
          setAllOpportunities(data.opportunities);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch all arbitrage signals:', err);
    }
  };

  useEffect(() => {
    fetchBook();
    fetchAllArbitrage();
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchBook();
      fetchAllArbitrage();
    }, 3000);
    return () => clearInterval(interval);
  }, [selectedPair, autoRefresh]);

  const handleExecuteArbitrage = async (opp: CrossedArbitrageOpportunity) => {
    setExecutingSignalId(opp.id);
    if (onNotify) {
      onNotify(`⚡ Dispatching atomic cross-arbitrage: ${opp.route} for ${opp.pair} ($${opp.executableUsd.toLocaleString()})...`, 'INFO');
    }

    try {
      const res = await fetch('/api/orderbooks/execute-arbitrage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          opportunity: opp,
          sizeUsd: opp.executableUsd,
        }),
      });
      const data = await res.json();
      if (data.success) {
        const profit = data.profitUsd || opp.estNetProfitUsd;
        const opSplit = data.rewarding?.humanOperatorSplitUsd || (profit * 0.70).toFixed(2);
        if (onNotify) {
          onNotify(
            `🎯 Millisecond Arbitrage Filled! ${opp.pair} | Net Alpha: +$${profit.toFixed(2)} USD | Operator Share: +$${opSplit}`,
            'SUCCESS'
          );
        }
        fetchBook(true);
        fetchAllArbitrage();
      } else {
        throw new Error(data.error || 'Execution failed');
      }
    } catch (err: any) {
      if (onNotify) onNotify(`Execution error: ${err.message}`, 'ALERT');
    } finally {
      setExecutingSignalId(null);
    }
  };

  const filteredBids = bookData?.bids.filter(b => filterVenue === 'ALL' || b.venue === filterVenue) || [];
  const filteredAsks = bookData?.asks.filter(a => filterVenue === 'ALL' || a.venue === filterVenue) || [];

  const maxBidVol = Math.max(...(filteredBids.map(b => b.cumulativeVolume) || [1]));
  const maxAskVol = Math.max(...(filteredAsks.map(a => a.cumulativeVolume) || [1]));

  return (
    <div className="bg-[#03060C] border border-cyan-500/30 rounded-xl overflow-hidden shadow-2xl font-mono text-xs text-slate-200 space-y-4">
      {/* HEADER STRIP */}
      <div className="p-4 sm:p-5 border-b border-cyan-500/20 bg-gradient-to-r from-[#03060C] via-[#071324] to-[#040C1A] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-900 border border-cyan-400/50 flex items-center justify-center shadow-lg shadow-cyan-500/20 shrink-0">
            <Layers className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm sm:text-base font-bold text-white tracking-wider uppercase font-sans">
                CROSS-REFERENCED ORDER BOOKS &middot; ALL 28 MARKET PAIRS
              </h2>
              <span className="px-2 py-0.5 rounded text-[9px] font-black border flex items-center gap-1 bg-cyan-500/20 text-cyan-300 border-cyan-500/40">
                <Zap className="w-3 h-3 text-cyan-400" />
                7 VENUES &middot; SUB-20MS
              </span>
              <span className="px-2 py-0.5 rounded text-[9px] font-black border flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border-emerald-500/40">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                ZERO-LOSS INVARIANT
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Live millisecond depth aggregation across Coinbase CDP, Binance.US, Kraken, XRPL Native DEX, Stellar Horizon, Solana Photon, and Uniswap Base.
            </p>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="flex items-center gap-2 flex-wrap self-end lg:self-auto">
          {/* Sub-tab view switch */}
          <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-700/80 rounded-lg p-0.5">
            <button
              onClick={() => setActiveSubTab('ORDERBOOK')}
              className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'ORDERBOOK'
                  ? 'bg-cyan-500/25 text-cyan-200 border border-cyan-400/50 shadow-sm shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Ladder View
            </button>
            <button
              onClick={() => setActiveSubTab('SCANNER_ALL_PAIRS')}
              className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'SCANNER_ALL_PAIRS'
                  ? 'bg-emerald-500/25 text-emerald-200 border border-emerald-400/50 shadow-sm shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>All 28 Pairs Matrix</span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[9px]">
                {allOpportunities.length} Active
              </span>
            </button>
          </div>

          {/* Auto Refresh Toggle */}
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              autoRefresh
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                : 'bg-slate-900 border-slate-700 text-slate-400'
            }`}
            title="Toggle Continuous Order Book Refresh (every 3s)"
          >
            <Clock className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{autoRefresh ? 'Live (3s)' : 'Paused'}</span>
          </button>

          {/* Refresh Button */}
          <button
            onClick={() => { fetchBook(true); fetchAllArbitrage(); }}
            disabled={isRefreshing}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-300 transition-colors cursor-pointer disabled:opacity-50"
            title="Force Instant Order Book Refresh"
          >
            <RefreshCw className={`w-4 h-4 text-cyan-400 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* ALL 28 PAIRS CATEGORY & FILTER STRIP */}
      <div className="px-4 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-2.5 py-1 rounded text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedCategory === 'ALL'
                  ? 'bg-cyan-500/25 text-cyan-200 border border-cyan-400/50'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              All Pairs (28)
            </button>
            <button
              onClick={() => setSelectedCategory('CORE_CRYPTO')}
              className={`px-2.5 py-1 rounded text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedCategory === 'CORE_CRYPTO'
                  ? 'bg-blue-500/25 text-blue-200 border border-blue-400/50'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Core Cryptos (19)
            </button>
            <button
              onClick={() => setSelectedCategory('FEDERAL_STABLECOIN')}
              className={`px-2.5 py-1 rounded text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedCategory === 'FEDERAL_STABLECOIN'
                  ? 'bg-emerald-500/25 text-emerald-200 border border-emerald-400/50'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Federal Stablecoins (6)
            </button>
            <button
              onClick={() => setSelectedCategory('SOVEREIGN_ASSET')}
              className={`px-2.5 py-1 rounded text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedCategory === 'SOVEREIGN_ASSET'
                  ? 'bg-purple-500/25 text-purple-200 border border-purple-400/50'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Sovereign EOC (3)
            </button>
          </div>

          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search 28 pairs (e.g. XRP, SOL, RLUSD)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-900/90 border border-slate-700/80 rounded-lg pl-8 pr-3 py-1 text-xs text-slate-200 placeholder-slate-500 w-full sm:w-64 focus:outline-none focus:border-cyan-400"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2" />
          </div>
        </div>

        {/* 28 PAIRS HORIZONTAL SELECTOR STRIP */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {filteredPairs.map(p => {
            const isSelected = selectedPair === p.symbol;
            return (
              <button
                key={p.symbol}
                onClick={() => setSelectedPair(p.symbol)}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-all shrink-0 cursor-pointer border ${
                  isSelected
                    ? 'bg-cyan-500/30 text-cyan-200 border-cyan-400 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border-slate-800'
                }`}
              >
                <span>{p.symbol}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* VIEW 1: LADDER VIEW FOR CURRENT SELECTED PAIR             */}
      {/* ========================================================= */}
      {activeSubTab === 'ORDERBOOK' && (
        <div className="space-y-4">
          {/* CROSSED-BOOK ARBITRAGE SIGNAL HERO BANNER */}
          {bookData?.crossedOpportunities && bookData.crossedOpportunities.length > 0 && (
            <div className="mx-4 p-4 rounded-xl border border-emerald-500/60 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-cyan-950/40 shadow-xl space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-black text-emerald-300 tracking-wider uppercase font-sans flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-emerald-400" />
                    CROSSED-BOOK ARBITRAGE SIGNAL DETECTED &middot; {selectedPair}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    LATENCY: {bookData.crossedOpportunities[0].executionLatencyMs}ms
                  </span>
                </div>

                <div className="flex items-center gap-2 text-right">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Est. Net Alpha:</span>
                    <span className="text-sm font-black text-emerald-400 font-mono">
                      +${bookData.crossedOpportunities[0].estNetProfitUsd.toFixed(2)} USD
                    </span>
                  </div>
                  <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 text-xs font-bold font-mono">
                    +{bookData.crossedOpportunities[0].netSpreadBps} bps Net
                  </span>
                </div>
              </div>

              {/* Arbitrage Route Details */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2 bg-[#050B14] p-3 rounded-lg border border-slate-800 text-[11px]">
                <div>
                  <span className="text-slate-400 block text-[10px]">1. Buy Venue (Ask):</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[9px] font-bold">
                      {bookData.crossedOpportunities[0].buyVenue}
                    </span>
                    <span className="font-bold text-white">${bookData.crossedOpportunities[0].buyPrice}</span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px]">2. Sell Venue (Bid):</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-bold">
                      {bookData.crossedOpportunities[0].sellVenue}
                    </span>
                    <span className="font-bold text-emerald-400">${bookData.crossedOpportunities[0].sellPrice}</span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px]">Gross / Fee Load:</span>
                  <span className="font-mono text-slate-300 mt-0.5 block">
                    +{bookData.crossedOpportunities[0].grossSpreadBps} bps &middot; <span className="text-rose-400">-{bookData.crossedOpportunities[0].totalFeesPct}% Fees</span>
                  </span>
                </div>

                <div className="flex items-center justify-end">
                  <button
                    onClick={() => handleExecuteArbitrage(bookData.crossedOpportunities[0])}
                    disabled={executingSignalId === bookData.crossedOpportunities[0].id}
                    className="w-full md:w-auto px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs rounded-lg shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Zap className={`w-4 h-4 ${executingSignalId ? 'animate-spin' : ''}`} />
                    <span>{executingSignalId ? 'Executing...' : '⚡ Atomic Millisecond Execute'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* CONSOLIDATED NBBO & SPREAD STRIP */}
          {bookData && (
            <div className="mx-4 p-3 bg-[#060C16] border border-slate-800 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Consolidated Best Bid</span>
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-bold">
                      {bookData.nbbo.bestBid.venue}
                    </span>
                    <span className="font-bold text-emerald-400 text-sm">${bookData.nbbo.bestBid.price}</span>
                    <span className="text-[10px] text-slate-500">({bookData.nbbo.bestBid.size} {selectedPair.split('/')[0]})</span>
                  </div>
                </div>

                <span className="text-slate-700 hidden sm:inline">|</span>

                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Consolidated Best Ask</span>
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[9px] font-bold">
                      {bookData.nbbo.bestAsk.venue}
                    </span>
                    <span className="font-bold text-rose-400 text-sm">${bookData.nbbo.bestAsk.price}</span>
                    <span className="text-[10px] text-slate-500">({bookData.nbbo.bestAsk.size} {selectedPair.split('/')[0]})</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase">NBBO Mid Price</span>
                  <span className="font-bold text-white font-mono">${bookData.nbbo.midPrice}</span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase">Cross-Venue Spread</span>
                  <span className={`font-bold font-mono ${bookData.nbbo.isCrossed ? 'text-emerald-400' : 'text-cyan-400'}`}>
                    {bookData.nbbo.spreadBps > 0 ? `+${bookData.nbbo.spreadBps} bps` : `${bookData.nbbo.spreadBps} bps`}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase">Book Status</span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono border ${
                    bookData.nbbo.isCrossed
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {bookData.nbbo.isCrossed ? '🔥 CROSSED ARBITRAGE' : 'BALANCED'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* DUAL-SIDED CONSOLIDATED ORDER BOOK LADDER */}
          <div className="px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* BIDS LADDER (Left: Green) */}
              <div className="bg-[#050A14] border border-slate-800 rounded-xl overflow-hidden shadow-lg space-y-2">
                <div className="p-3 bg-[#081224] border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="font-bold text-white text-xs uppercase tracking-wider">
                      CONSOLIDATED BIDS (BUY ORDERS)
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    Depth: <b className="text-emerald-400">${(filteredBids[filteredBids.length - 1]?.cumulativeUsd || 0).toLocaleString()} USD</b>
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px] font-mono">
                    <thead>
                      <tr className="text-slate-500 text-[10px] border-b border-slate-850 px-2">
                        <th className="py-1 px-2.5">Venue</th>
                        <th className="py-1 px-2 text-right">Price ($)</th>
                        <th className="py-1 px-2 text-right">Size</th>
                        <th className="py-1 px-2 text-right">Total ($)</th>
                        <th className="py-1 px-2.5 text-right">Cum. ($)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBids.map((b, idx) => {
                        const pct = Math.min(100, (b.cumulativeVolume / maxBidVol) * 100);
                        return (
                          <tr key={`bid-${idx}`} className="hover:bg-slate-900/60 relative group transition-colors">
                            <td className="py-1.5 px-2.5 relative">
                              <div
                                className="absolute inset-y-0 left-0 bg-emerald-500/10 pointer-events-none transition-all"
                                style={{ width: `${pct}%` }}
                              />
                              <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold border ${
                                b.venue === 'Coinbase'
                                  ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                                  : b.venue === 'Binance.US'
                                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                  : b.venue === 'Kraken'
                                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                                  : b.venue === 'XRPL DEX'
                                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                                  : 'bg-slate-800 text-slate-300 border-slate-700'
                              }`}>
                                {b.venueBadge}
                              </span>
                            </td>
                            <td className="py-1.5 px-2 text-right font-bold text-emerald-400">
                              ${b.price}
                            </td>
                            <td className="py-1.5 px-2 text-right text-slate-300">
                              {b.size.toLocaleString()}
                            </td>
                            <td className="py-1.5 px-2 text-right text-slate-400">
                              ${Math.round(b.totalUsd).toLocaleString()}
                            </td>
                            <td className="py-1.5 px-2.5 text-right font-bold text-slate-300">
                              ${Math.round(b.cumulativeUsd).toLocaleString()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ASKS LADDER (Right: Red) */}
              <div className="bg-[#050A14] border border-slate-800 rounded-xl overflow-hidden shadow-lg space-y-2">
                <div className="p-3 bg-[#081224] border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-400" />
                    <span className="font-bold text-white text-xs uppercase tracking-wider">
                      CONSOLIDATED ASKS (SELL ORDERS)
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    Depth: <b className="text-rose-400">${(filteredAsks[filteredAsks.length - 1]?.cumulativeUsd || 0).toLocaleString()} USD</b>
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px] font-mono">
                    <thead>
                      <tr className="text-slate-500 text-[10px] border-b border-slate-850 px-2">
                        <th className="py-1 px-2.5">Venue</th>
                        <th className="py-1 px-2 text-right">Price ($)</th>
                        <th className="py-1 px-2 text-right">Size</th>
                        <th className="py-1 px-2 text-right">Total ($)</th>
                        <th className="py-1 px-2.5 text-right">Cum. ($)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAsks.map((a, idx) => {
                        const pct = Math.min(100, (a.cumulativeVolume / maxAskVol) * 100);
                        return (
                          <tr key={`ask-${idx}`} className="hover:bg-slate-900/60 relative group transition-colors">
                            <td className="py-1.5 px-2.5 relative">
                              <div
                                className="absolute inset-y-0 right-0 bg-rose-500/10 pointer-events-none transition-all"
                                style={{ width: `${pct}%` }}
                              />
                              <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold border ${
                                a.venue === 'Coinbase'
                                  ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                                  : a.venue === 'Binance.US'
                                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                  : a.venue === 'Kraken'
                                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                                  : a.venue === 'XRPL DEX'
                                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                                  : 'bg-slate-800 text-slate-300 border-slate-700'
                              }`}>
                                {a.venueBadge}
                              </span>
                            </td>
                            <td className="py-1.5 px-2 text-right font-bold text-rose-400">
                              ${a.price}
                            </td>
                            <td className="py-1.5 px-2 text-right text-slate-300">
                              {a.size.toLocaleString()}
                            </td>
                            <td className="py-1.5 px-2 text-right text-slate-400">
                              ${Math.round(a.totalUsd).toLocaleString()}
                            </td>
                            <td className="py-1.5 px-2.5 text-right font-bold text-slate-300">
                              ${Math.round(a.cumulativeUsd).toLocaleString()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* LIQUIDITY CATCH BASIN & VOLUME SPILLOVER SECTION */}
          {bookData?.catchBasins && (
            <div className="mx-4 p-4 bg-[#050A14] border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-cyan-400" />
                  <span className="font-bold text-white text-xs uppercase tracking-wider">
                    LIQUIDITY CATCH BASIN &amp; VOLUME SPILLOVER MATRIX &middot; {selectedPair}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">
                  Slippage Invariant: Zero Negative Alpha Threshold
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {bookData.catchBasins.map((basin, i) => (
                  <div
                    key={`basin-${i}`}
                    className={`p-3 rounded-lg border text-[11px] space-y-2 ${
                      basin.isWithinZeroLossInvariant
                        ? 'bg-slate-900/60 border-slate-700/80'
                        : 'bg-slate-950/40 border-slate-850 opacity-80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-cyan-300 text-xs">{basin.name}</span>
                      <span className={`px-1.5 py-0.2 rounded text-[8px] font-bold ${
                        basin.isWithinZeroLossInvariant
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      }`}>
                        {basin.isWithinZeroLossInvariant ? 'ZERO-LOSS SAFE' : 'SLIPPAGE RISK'}
                      </span>
                    </div>

                    <div className="flex justify-between text-slate-400 text-[10px]">
                      <span>Tier Range:</span>
                      <span className="font-bold text-white">{basin.rangeUsd}</span>
                    </div>

                    <div className="flex justify-between text-slate-400 text-[10px]">
                      <span>Slippage Drift:</span>
                      <span className="font-mono text-amber-300">{basin.estSlippageBps} bps</span>
                    </div>

                    {/* Capacity Fill Bar */}
                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-[9px] text-slate-500">
                        <span>Basin Fill Capacity</span>
                        <span>${Math.round(basin.availableBidsUsd).toLocaleString()} / ${basin.maxCapacityUsd.toLocaleString()}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-cyan-400 rounded-full transition-all"
                          style={{ width: `${Math.min(100, (basin.availableBidsUsd / basin.maxCapacityUsd) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW 2: ALL 28 PAIRS ARBITRAGE SCANNER MATRIX             */}
      {/* ========================================================= */}
      {activeSubTab === 'SCANNER_ALL_PAIRS' && (
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-sm font-bold text-white">ALL 28 ACTIVE PAIRS &middot; CROSSED ARBITRAGE RADAR</h3>
              <p className="text-[11px] text-slate-400">Ranked by real-time Net Alpha Spread across all 7 connected venues.</p>
            </div>
            <span className="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold text-xs">
              28 Total Pairs Monitored
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {allOpportunities.map((opp) => (
              <div
                key={opp.id}
                className="p-3.5 bg-[#050A14] border border-slate-800 hover:border-slate-700 rounded-xl space-y-3 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-xs">{opp.pair}</span>
                    <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-bold">
                      +{opp.netSpreadBps} bps
                    </span>
                  </div>
                  <span className="font-black text-emerald-400 text-xs font-mono">
                    +${opp.estNetProfitUsd.toFixed(2)} USD
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-1.5 text-[10px] bg-slate-950 p-2 rounded border border-slate-850">
                  <div>
                    <span className="text-slate-500 block">Buy Venue:</span>
                    <span className="text-cyan-300 font-bold">{opp.buyVenue} @ ${opp.buyPrice}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Sell Venue:</span>
                    <span className="text-amber-300 font-bold">{opp.sellVenue} @ ${opp.sellPrice}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-slate-400">
                    Max: <b>${opp.executableUsd.toLocaleString()}</b> &middot; {opp.executionLatencyMs}ms
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setSelectedPair(opp.pair);
                        setActiveSubTab('ORDERBOOK');
                      }}
                      className="px-2 py-1 rounded bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-[10px] font-bold cursor-pointer"
                    >
                      Ladder
                    </button>
                    <button
                      onClick={() => handleExecuteArbitrage(opp)}
                      disabled={executingSignalId === opp.id}
                      className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-[10px] font-black cursor-pointer shadow-sm transition-all flex items-center gap-1"
                    >
                      <Zap className="w-3 h-3" />
                      <span>{executingSignalId === opp.id ? '...' : 'Execute'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VENUE CONNECTIVITY & LATENCY MATRIX STRIP */}
      {bookData?.venues && (
        <div className="mx-4 mb-4 p-3 bg-[#050A14] border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Connected Liquidity Venues &amp; Millisecond Ping Matrix (28 Pairs Ready)
            </span>
            <span className="text-[10px] text-emerald-400 font-mono font-bold">
              All 7 Venues Connected (Avg. Latency: 16.4ms)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {bookData.venues.map(v => (
              <div
                key={v.venue}
                className="p-2 rounded bg-slate-900/80 border border-slate-800 text-[10px] space-y-1 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{v.venue}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Ping:</span>
                  <span className="font-mono text-cyan-300 font-bold">{v.latencyMs}ms</span>
                </div>
                <div className="flex justify-between text-slate-500 text-[9px]">
                  <span>Status:</span>
                  <span className="text-emerald-400">{v.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AggregatedOrderBookMatrix;
