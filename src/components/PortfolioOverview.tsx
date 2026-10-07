import React, { useState } from 'react';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Layers, PieChart as PieIcon, RefreshCw } from 'lucide-react';
import { WalletBalances } from '../types';

interface PortfolioOverviewProps {
  balances: WalletBalances;
  onQuickRebalance: (symbol: string) => void;
}

export const PortfolioOverview: React.FC<PortfolioOverviewProps> = ({
  balances,
  onQuickRebalance,
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1H' | '24H' | '7D' | '30D' | 'ALL'>('24H');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Timeframe-specific simulated curve points
  const chartPointsByTimeframe = {
    '1H': [48120, 48150, 48190, 48160, 48210, 48240, 48294],
    '24H': [46870, 47120, 47050, 47400, 47850, 47620, 48100, 48294],
    '7D': [44200, 44900, 45600, 45200, 46700, 47400, 48294],
    '30D': [39800, 41200, 42500, 44100, 43800, 46100, 48294],
    'ALL': [31500, 36200, 41000, 44500, 45800, 47200, 48294],
  };

  const points = chartPointsByTimeframe[selectedTimeframe];
  const minVal = Math.min(...points) * 0.99;
  const maxVal = Math.max(...points) * 1.01;
  const range = maxVal - minVal;

  const width = 600;
  const height = 180;
  const paddingX = 20;
  const paddingY = 20;

  // Build SVG path
  const svgCoords = points.map((p, idx) => {
    const x = paddingX + (idx / (points.length - 1)) * (width - paddingX * 2);
    const y = height - paddingY - ((p - minVal) / range) * (height - paddingY * 2);
    return { x, y, val: p };
  });

  const pathD = svgCoords.reduce((acc, coord, idx) => {
    if (idx === 0) return `M ${coord.x} ${coord.y}`;
    const prev = svgCoords[idx - 1];
    const cx1 = (prev.x + coord.x) / 2;
    const cy1 = prev.y;
    const cx2 = (prev.x + coord.x) / 2;
    const cy2 = coord.y;
    return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${coord.x} ${coord.y}`;
  }, '');

  const areaD = `${pathD} L ${width - paddingX} ${height} L ${paddingX} ${height} Z`;

  const hoveredVal = hoverIndex !== null ? svgCoords[hoverIndex].val : balances.totalUsd;
  const cexShare = ((balances.cexUsd / balances.totalUsd) * 100).toFixed(1);
  const dexShare = ((balances.dexUsd / balances.totalUsd) * 100).toFixed(1);

  return (
    <div className="bg-[#0D121D] border border-slate-800 rounded-lg p-5 font-mono shadow-sm">
      {/* Top Value Banner */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div>
          <div className="text-slate-400 text-xs tracking-wider uppercase flex items-center gap-2 mb-1">
            <span>Unified Net Worth (DEX + CEX)</span>
            <span className="text-[10px] text-cyan-400">· Real-Time Mark-to-Market</span>
          </div>
          <div className="flex items-baseline gap-3">
            <h2 className="text-3xl font-bold tracking-tight text-white tabular-nums">
              ${hoveredVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
            <div className="flex items-center text-xs font-semibold text-emerald-400">
              <ArrowUpRight className="w-4 h-4" />
              <span>+${balances.dailyPnlUsd.toFixed(2)} ({balances.dailyPnlPct}%)</span>
            </div>
          </div>
        </div>

        {/* Timeframe selector */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 rounded border border-slate-800 self-start">
          {(['1H', '24H', '7D', '30D', 'ALL'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setSelectedTimeframe(tf)}
              className={`px-2.5 py-1 text-[11px] rounded transition-colors ${
                selectedTimeframe === tf
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Interactive Valuation Graph */}
      <div className="relative w-full h-44 mb-6">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0.25, 0.5, 0.75].map((pct) => (
            <line
              key={pct}
              x1={paddingX}
              y1={height * pct}
              x2={width - paddingX}
              y2={height * pct}
              stroke="#1E293B"
              strokeDasharray="4 4"
            />
          ))}

          {/* Area fill */}
          <path d={areaD} fill="url(#areaGradient)" />

          {/* Stroke path */}
          <path
            d={pathD}
            fill="none"
            stroke="#06B6D4"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive Points */}
          {svgCoords.map((coord, idx) => (
            <circle
              key={idx}
              cx={coord.x}
              cy={coord.y}
              r={hoverIndex === idx ? 5 : 3}
              fill={hoverIndex === idx ? '#38BDF8' : '#06B6D4'}
              className="cursor-pointer transition-all"
              onMouseEnter={() => setHoverIndex(idx)}
              onMouseLeave={() => setHoverIndex(null)}
            />
          ))}
        </svg>
      </div>

      {/* CEX vs DEX Dual Balance Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <div className="p-3 bg-slate-900/60 rounded border-l-2 border-cyan-400 border border-slate-800">
          <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1">
            <span>OFF-CHAIN CEX (Binance.US / Coinbase)</span>
            <span className="text-cyan-400 font-bold">{cexShare}%</span>
          </div>
          <div className="text-base font-bold text-white tabular-nums">
            ${balances.cexUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
        </div>

        <div className="p-3 bg-slate-900/60 rounded border-l-2 border-indigo-500 border border-slate-800">
          <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1">
            <span>ON-CHAIN DEX (Uniswap / Jupiter)</span>
            <span className="text-indigo-400 font-bold">{dexShare}%</span>
          </div>
          <div className="text-base font-bold text-white tabular-nums">
            ${balances.dexUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
        </div>

        <div className="p-3 bg-slate-900/60 rounded border-l-2 border-emerald-400 border border-slate-800">
          <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1">
            <span>24H REALIZED ARBITRAGE ALPHA</span>
            <span className="text-emerald-400 font-bold">100% Retained</span>
          </div>
          <div className="text-base font-bold text-emerald-400 tabular-nums">
            +${balances.dailyPnlUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      {/* Asset Distribution Table */}
      <div>
        <div className="flex items-center justify-between text-xs text-slate-400 pb-2 mb-2 border-b border-slate-800/80">
          <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wide">
            Dual-Exchange Asset Balances
          </span>
          <span className="text-[10px] text-slate-400">Total 6 Token Pools</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[10px] text-slate-400 border-b border-slate-800/60">
                <th className="py-2 font-normal">Asset</th>
                <th className="py-2 font-normal text-right">CEX Allocation</th>
                <th className="py-2 font-normal text-right">DEX Allocation</th>
                <th className="py-2 font-normal text-right">Total Valuation</th>
                <th className="py-2 font-normal text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {balances.holdings.map((h) => {
                const totalQty = h.cexQty + h.dexQty;
                const totalVal = totalQty * h.priceUsd;
                return (
                  <tr key={h.symbol} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-2.5 font-medium text-slate-200">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-cyan-400" />
                        <span>{h.symbol}</span>
                        <span className="text-slate-400 text-[10px]">({h.name})</span>
                      </div>
                    </td>
                    <td className="py-2.5 text-right tabular-nums text-slate-300">
                      {h.cexQty.toLocaleString()} {h.symbol}
                    </td>
                    <td className="py-2.5 text-right tabular-nums text-slate-300">
                      {h.dexQty.toLocaleString()} {h.symbol}
                    </td>
                    <td className="py-2.5 text-right tabular-nums font-semibold text-white">
                      ${totalVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-2.5 text-right">
                      <button
                        onClick={() => onQuickRebalance(h.symbol)}
                        className="px-2 py-1 bg-slate-800 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-slate-700 hover:border-cyan-500/40 rounded text-[10px] transition-colors"
                      >
                        Rebalance
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
