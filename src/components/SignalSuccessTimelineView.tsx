import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Legend
} from 'recharts';
import {
  Clock,
  Sliders,
  TrendingUp,
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Award,
  Layers,
  Sparkles,
  ArrowRight,
  Filter,
  BarChart2
} from 'lucide-react';
import { AutonomousSignal } from '../types';

interface SignalSuccessTimelineViewProps {
  signals: AutonomousSignal[];
  onApplyStrategyParams?: (params: {
    minConfidence: number;
    minSpreadPct: number;
    riskTier: 'ALL' | 'LOW_ONLY' | 'MED_LOW';
    minUrgency: number;
  }) => void;
}

interface TimelineDataPoint {
  id: string;
  time: string;
  timestamp: string;
  pair: string;
  action: string;
  confidence: number; // 0 - 100
  confidenceColor: string;
  confidenceTier: 'VERY_HIGH' | 'HIGH' | 'MODERATE' | 'LOW';
  outcome: 'SUCCESS' | 'DEGRADED';
  successRatePct: number; // Rolling historical win rate
  spreadPct: number;
  profitUsd: number;
  urgency: number;
  drawdownRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  isFilteredIn: boolean;
}

export const SignalSuccessTimelineView: React.FC<SignalSuccessTimelineViewProps> = ({
  signals,
  onApplyStrategyParams,
}) => {
  // Strategy Parameter Optimizer State
  const [minConfidence, setMinConfidence] = useState<number>(75); // 50 - 95%
  const [minSpreadPct, setMinSpreadPct] = useState<number>(0.30); // 0.10 - 1.50%
  const [riskTier, setRiskTier] = useState<'ALL' | 'LOW_ONLY' | 'MED_LOW'>('ALL');
  const [minUrgency, setMinUrgency] = useState<number>(60); // 0 - 90
  const [timeHorizon, setTimeHorizon] = useState<'12H' | '24H' | '7D' | 'ALL'>('24H');
  const [selectedSignalId, setSelectedSignalId] = useState<string | null>(null);

  // Baseline Historical Signal Execution Timeline Points
  const baselineHistoricalTimeline: Array<Omit<TimelineDataPoint, 'confidenceColor' | 'confidenceTier' | 'successRatePct' | 'isFilteredIn'>> = useMemo(() => [
    { id: 'sig-hist-01', time: '08:00', timestamp: '2026-10-06T08:00:00Z', pair: 'ETH/USDT', action: 'ARBITRAGE', confidence: 94, outcome: 'SUCCESS', spreadPct: 0.65, profitUsd: 18.40, urgency: 88, drawdownRisk: 'LOW' },
    { id: 'sig-hist-02', time: '08:45', timestamp: '2026-10-06T08:45:00Z', pair: 'BTC/USDT', action: 'REBALANCE', confidence: 88, outcome: 'SUCCESS', spreadPct: 0.42, profitUsd: 24.50, urgency: 92, drawdownRisk: 'LOW' },
    { id: 'sig-hist-03', time: '09:30', timestamp: '2026-10-06T09:30:00Z', pair: 'SOL/USDC', action: 'ARBITRAGE', confidence: 68, outcome: 'DEGRADED', spreadPct: 0.22, profitUsd: -2.10, urgency: 55, drawdownRisk: 'HIGH' },
    { id: 'sig-hist-04', time: '10:15', timestamp: '2026-10-06T10:15:00Z', pair: 'SBA/SOL', action: 'ARBITRAGE', confidence: 96, outcome: 'SUCCESS', spreadPct: 3.04, profitUsd: 42.80, urgency: 95, drawdownRisk: 'LOW' },
    { id: 'sig-hist-05', time: '11:00', timestamp: '2026-10-06T11:00:00Z', pair: 'ETH/USDC', action: 'ARBITRAGE', confidence: 91, outcome: 'SUCCESS', spreadPct: 0.78, profitUsd: 28.90, urgency: 90, drawdownRisk: 'LOW' },
    { id: 'sig-hist-06', time: '11:45', timestamp: '2026-10-06T11:45:00Z', pair: 'XRP/USDT', action: 'HEDGE', confidence: 74, outcome: 'SUCCESS', spreadPct: 0.35, profitUsd: 14.20, urgency: 72, drawdownRisk: 'MEDIUM' },
    { id: 'sig-hist-07', time: '12:30', timestamp: '2026-10-06T12:30:00Z', pair: 'ARB/USDT', action: 'ARBITRAGE', confidence: 62, outcome: 'DEGRADED', spreadPct: 0.18, profitUsd: -1.50, urgency: 58, drawdownRisk: 'HIGH' },
    { id: 'sig-hist-08', time: '13:15', timestamp: '2026-10-06T13:15:00Z', pair: 'BTC/USDT', action: 'ARBITRAGE', confidence: 93, outcome: 'SUCCESS', spreadPct: 0.52, profitUsd: 31.60, urgency: 94, drawdownRisk: 'LOW' },
    { id: 'sig-hist-09', time: '14:00', timestamp: '2026-10-06T14:00:00Z', pair: 'ETH/USDT', action: 'REBALANCE', confidence: 86, outcome: 'SUCCESS', spreadPct: 0.48, profitUsd: 22.10, urgency: 82, drawdownRisk: 'LOW' },
    { id: 'sig-hist-10', time: '14:45', timestamp: '2026-10-06T14:45:00Z', pair: 'SOL/USDC', action: 'ARBITRAGE', confidence: 78, outcome: 'SUCCESS', spreadPct: 0.38, profitUsd: 16.50, urgency: 76, drawdownRisk: 'MEDIUM' },
    { id: 'sig-hist-11', time: '15:15', timestamp: '2026-10-06T15:15:00Z', pair: 'LINK/USDT', action: 'HEDGE', confidence: 71, outcome: 'DEGRADED', spreadPct: 0.25, profitUsd: 0.40, urgency: 64, drawdownRisk: 'MEDIUM' },
    { id: 'sig-hist-12', time: '15:45', timestamp: '2026-10-06T15:45:00Z', pair: 'SBA/SOL', action: 'ARBITRAGE', confidence: 95, outcome: 'SUCCESS', spreadPct: 3.12, profitUsd: 46.20, urgency: 96, drawdownRisk: 'LOW' },
  ], []);

  // Compute Full Timeline with Rolling Success Rates and Live Signals
  const timelineData: TimelineDataPoint[] = useMemo(() => {
    // Combine baseline historical points with live executed/evaluated signals
    const allEvents: Array<Omit<TimelineDataPoint, 'confidenceColor' | 'confidenceTier' | 'successRatePct' | 'isFilteredIn'>> = [
      ...baselineHistoricalTimeline
    ];

    // Append signals from state
    signals.forEach((s, idx) => {
      const conf = s.confidence ? (s.confidence <= 1 ? Math.round(s.confidence * 100) : Math.round(s.confidence)) : 85;
      const d = new Date(s.timestamp);
      const timeStr = isNaN(d.getTime()) ? `T+${idx * 15}m` : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const isSuccess = (s.estimatedProfitUsd || 0) > 0 && (s.spreadPct || 0) >= 0.20;

      allEvents.push({
        id: s.id || `sig-live-${idx}`,
        time: timeStr,
        timestamp: s.timestamp || new Date().toISOString(),
        pair: s.pair || 'ETH/USDT',
        action: s.action || 'ARBITRAGE',
        confidence: conf,
        outcome: isSuccess ? 'SUCCESS' : 'DEGRADED',
        spreadPct: s.spreadPct || 0.45,
        profitUsd: s.estimatedProfitUsd || 18.0,
        urgency: s.urgencyScore || 80,
        drawdownRisk: s.drawdownRisk || 'LOW',
      });
    });

    // Compute rolling success rate and color-coding by confidence score
    let totalSuccess = 0;
    return allEvents.map((ev, index) => {
      if (ev.outcome === 'SUCCESS') totalSuccess += 1;
      const rollingRate = Number(((totalSuccess / (index + 1)) * 100).toFixed(1));

      // Color coding strictly by Confidence Score:
      // >= 90%: Neon Emerald (#10b981) - Very High Conviction
      // 80 - 89%: Cyber Cyan (#06b6d4) - High Conviction
      // 70 - 79%: Amber Gold (#f59e0b) - Moderate Conviction
      // < 70%: Coral Rose (#f43f5e) - Speculative / Low Conviction
      let color = '#f43f5e';
      let tier: TimelineDataPoint['confidenceTier'] = 'LOW';

      if (ev.confidence >= 90) {
        color = '#10b981';
        tier = 'VERY_HIGH';
      } else if (ev.confidence >= 80) {
        color = '#06b6d4';
        tier = 'HIGH';
      } else if (ev.confidence >= 70) {
        color = '#f59e0b';
        tier = 'MODERATE';
      }

      // Check if this signal passes active strategy parameters
      const passesConfidence = ev.confidence >= minConfidence;
      const passesSpread = ev.spreadPct >= minSpreadPct;
      const passesUrgency = ev.urgency >= minUrgency;
      const passesRisk =
        riskTier === 'ALL'
          ? true
          : riskTier === 'LOW_ONLY'
          ? ev.drawdownRisk === 'LOW'
          : ev.drawdownRisk !== 'HIGH';

      const isFilteredIn = passesConfidence && passesSpread && passesUrgency && passesRisk;

      return {
        ...ev,
        confidenceColor: color,
        confidenceTier: tier,
        successRatePct: rollingRate,
        isFilteredIn,
      };
    });
  }, [baselineHistoricalTimeline, signals, minConfidence, minSpreadPct, minUrgency, riskTier]);

  // Strategy Optimization Simulation Analytics
  const strategySimulation = useMemo(() => {
    const totalSignals = timelineData.length;
    const filteredCohort = timelineData.filter((d) => d.isFilteredIn);
    const passedCount = filteredCohort.length;

    const successfulPassed = filteredCohort.filter((d) => d.outcome === 'SUCCESS').length;
    const optimizedSuccessRate = passedCount > 0 ? Number(((successfulPassed / passedCount) * 100).toFixed(1)) : 0;

    const totalUnfilteredSuccess = timelineData.filter((d) => d.outcome === 'SUCCESS').length;
    const baselineSuccessRate = totalSignals > 0 ? Number(((totalUnfilteredSuccess / totalSignals) * 100).toFixed(1)) : 0;

    const totalOptimizedProfit = filteredCohort.reduce((acc, curr) => acc + Math.max(0, curr.profitUsd), 0);
    const degradedEliminated = timelineData.filter((d) => !d.isFilteredIn && d.outcome === 'DEGRADED').length;

    const winRateEdge = Number((optimizedSuccessRate - baselineSuccessRate).toFixed(1));

    return {
      totalSignals,
      passedCount,
      optimizedSuccessRate,
      baselineSuccessRate,
      winRateEdge,
      totalOptimizedProfit,
      degradedEliminated,
    };
  }, [timelineData]);

  const selectedSignal = useMemo(() => {
    return timelineData.find((d) => d.id === selectedSignalId) || null;
  }, [timelineData, selectedSignalId]);

  // Custom Dot Renderer: Colored by Confidence Score with Glow for Apex Signals
  const renderConfidenceDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (!cx || !cy || !payload) return null;

    const isApex = payload.confidence >= 90;
    const isFiltered = payload.isFilteredIn;
    const isSelected = payload.id === selectedSignalId;

    return (
      <g
        key={`dot-${payload.id}`}
        onClick={() => setSelectedSignalId(selectedSignalId === payload.id ? null : payload.id)}
        className="cursor-pointer"
      >
        {/* Selection Ring */}
        {isSelected && (
          <circle
            cx={cx}
            cy={cy}
            r={10}
            fill="none"
            stroke="#38bdf8"
            strokeWidth={2}
            strokeDasharray="2 2"
            className="animate-spin"
            style={{ transformBox: 'fill-box', transformOrigin: 'center', animationDuration: '4s' }}
          />
        )}
        {/* Glow halo for Very High Confidence (>= 90%) */}
        {isApex && isFiltered && !isSelected && (
          <circle
            cx={cx}
            cy={cy}
            r={8.5}
            fill={payload.confidenceColor}
            opacity={0.3}
            className="animate-pulse"
          />
        )}
        {/* Main Confidence Node */}
        <circle
          cx={cx}
          cy={cy}
          r={isSelected ? 6.5 : isApex ? 5.5 : 4.5}
          fill={payload.confidenceColor}
          stroke={isSelected ? '#ffffff' : isFiltered ? '#ffffff' : '#475569'}
          strokeWidth={isSelected ? 2.5 : isFiltered ? 1.5 : 1}
          opacity={isFiltered ? 1 : 0.35}
          className="transition-all duration-200 hover:scale-125"
        />
      </g>
    );
  };

  // Custom Interactive Tooltip
  const CustomTimelineTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data: TimelineDataPoint = payload[0].payload;
      return (
        <div className="bg-[#070A0F]/95 border border-cyan-500/50 p-3 rounded-xl shadow-2xl text-xs font-mono space-y-2 backdrop-blur-md max-w-xs">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
            <span className="font-bold text-white text-xs">{data.pair}</span>
            <span className="text-[10px] text-slate-400">{data.time}</span>
          </div>

          {/* Confidence Badge & Tier */}
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-[11px]">Confidence Score:</span>
            <span
              className="px-2 py-0.5 rounded font-bold text-xs border"
              style={{
                backgroundColor: `${data.confidenceColor}20`,
                color: data.confidenceColor,
                borderColor: `${data.confidenceColor}50`,
              }}
            >
              {data.confidence}% ({data.confidenceTier.replace('_', ' ')})
            </span>
          </div>

          {/* Rolling Success Rate */}
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-[11px]">Rolling Success Rate:</span>
            <span className="font-bold text-white text-xs tabular-nums">
              {data.successRatePct}%
            </span>
          </div>

          {/* Outcome & Yield */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[11px]">
            <span className="text-slate-400">Trade Outcome:</span>
            <span
              className={`font-bold ${
                data.outcome === 'SUCCESS' ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {data.outcome === 'SUCCESS' ? '✓ TARGET FILLED' : '✕ DEGRADED / SLIP'}
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Spread / Net Yield:</span>
            <span className="text-amber-300 font-bold">
              +{data.spreadPct}% (+${data.profitUsd.toFixed(2)})
            </span>
          </div>

          {/* Filter Status Badge */}
          <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
            <span className="text-slate-400">Strategy Filter:</span>
            <span
              className={`font-bold px-1.5 py-0.2 rounded ${
                data.isFilteredIn
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {data.isFilteredIn ? 'PASSED FILTER' : 'FILTERED OUT'}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  const handleApplyOptimal = () => {
    if (onApplyStrategyParams) {
      onApplyStrategyParams({
        minConfidence,
        minSpreadPct,
        riskTier,
        minUrgency,
      });
    }
  };

  return (
    <div className="bg-gradient-to-b from-slate-950/95 via-slate-900/70 to-slate-950/95 border border-cyan-500/40 rounded-xl p-4 sm:p-5 font-mono shadow-xl space-y-4">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 via-cyan-500 to-indigo-600 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-emerald-500/20">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Signal Success Rate Timeline &amp; Strategy Parameter Optimizer
              </h3>
              <span className="px-1.5 py-0.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded text-[9px] font-bold">
                TIMELINE VIEW
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              Historical success trajectory colored strictly by confidence score &middot; Dynamic parameter calibration
            </p>
          </div>
        </div>

        {/* Confidence Color Legend Strip */}
        <div className="flex items-center gap-2 flex-wrap text-[10px] bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
          <span className="text-slate-500 uppercase font-semibold">Confidence Colors:</span>
          <span className="flex items-center gap-1 text-emerald-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            &ge;90%
          </span>
          <span className="flex items-center gap-1 text-cyan-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            80-89%
          </span>
          <span className="flex items-center gap-1 text-amber-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            70-79%
          </span>
          <span className="flex items-center gap-1 text-rose-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            &lt;70%
          </span>
        </div>
      </div>

      {/* KPI Cards: Simulated Edge & Parameters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
        {/* Metric 1: Optimized Success Rate */}
        <div className="p-3 bg-slate-950/80 border border-slate-800/90 rounded-lg space-y-1">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block flex items-center justify-between">
            <span>Calibrated Win Rate</span>
            <Award className="w-3 h-3 text-emerald-400" />
          </span>
          <div className="text-lg font-bold text-emerald-400 tabular-nums">
            {strategySimulation.optimizedSuccessRate}%
          </div>
          <div className="text-[10px] text-emerald-300 font-semibold flex items-center gap-1">
            <span>+{strategySimulation.winRateEdge}% vs baseline</span>
          </div>
        </div>

        {/* Metric 2: Filtered Cohort Retention */}
        <div className="p-3 bg-slate-950/80 border border-slate-800/90 rounded-lg space-y-1">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block flex items-center justify-between">
            <span>Signals Retained</span>
            <Filter className="w-3 h-3 text-cyan-400" />
          </span>
          <div className="text-lg font-bold text-cyan-300 tabular-nums">
            {strategySimulation.passedCount} <span className="text-xs text-slate-400 font-normal">/ {strategySimulation.totalSignals}</span>
          </div>
          <div className="text-[10px] text-slate-400">
            {strategySimulation.degradedEliminated} false breakouts eliminated
          </div>
        </div>

        {/* Metric 3: Total Calibrated Yield */}
        <div className="p-3 bg-slate-950/80 border border-slate-800/90 rounded-lg space-y-1">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block flex items-center justify-between">
            <span>Expected Net Alpha</span>
            <Flame className="w-3 h-3 text-amber-400" />
          </span>
          <div className="text-lg font-bold text-amber-300 tabular-nums">
            +${strategySimulation.totalOptimizedProfit.toFixed(2)}
          </div>
          <div className="text-[10px] text-emerald-400">
            Zero slippage loss capture
          </div>
        </div>

        {/* Metric 4: Minimum Confidence Filter */}
        <div className="p-3 bg-slate-950/80 border border-slate-800/90 rounded-lg space-y-1">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block flex items-center justify-between">
            <span>Active Confidence Floor</span>
            <Sliders className="w-3 h-3 text-indigo-400" />
          </span>
          <div className="text-lg font-bold text-indigo-300 tabular-nums">
            &ge;{minConfidence}%
          </div>
          <div className="text-[10px] text-cyan-300">
            Min Spread: &ge;{minSpreadPct.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* RECHARTS TIMELINE GRAPH: SUCCESS RATE OVER TIME COLORED BY CONFIDENCE SCORE */}
      <div className="bg-[#070A0F] border border-slate-800 rounded-xl p-3.5 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-white text-xs">
              Rolling Signal Success Rate (%) Curve &middot; Discrete Signal Nodes
            </span>
          </div>
          <div className="text-[10px] text-slate-400 flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-gradient-to-r from-emerald-400 to-cyan-400" />
              <span>Rolling Success Curve</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-purple-400 border-dashed" />
              <span>85% Hurdle Baseline</span>
            </span>
          </div>
        </div>

        <div className="w-full h-60 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={timelineData} margin={{ top: 10, right: 15, left: -20, bottom: 5 }}>
              <defs>
                <linearGradient id="successLineGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="50%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.7} />
              <XAxis
                dataKey="time"
                stroke="#64748b"
                fontSize={10}
                tickLine={false}
              />
              <YAxis
                stroke="#64748b"
                fontSize={10}
                domain={[50, 100]}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip content={<CustomTimelineTooltip />} />
              <ReferenceLine
                y={85}
                stroke="#a855f7"
                strokeDasharray="3 3"
                label={{ value: '85% Target Hurdle', fill: '#c084fc', fontSize: 9, position: 'right' }}
              />
              <Line
                type="monotone"
                dataKey="successRatePct"
                name="Success Rate (%)"
                stroke="url(#successLineGrad)"
                strokeWidth={2.5}
                dot={renderConfidenceDot}
                activeDot={{ r: 7, stroke: '#ffffff', strokeWidth: 2 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Selected Signal Node Inspection Drawer */}
        {selectedSignal && (
          <div className="mt-3 p-3 bg-slate-950/90 border border-cyan-500/50 rounded-lg text-xs space-y-2.5 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedSignal.confidenceColor }} />
                <span className="font-bold text-white text-sm">{selectedSignal.pair}</span>
                <span className="text-slate-400 text-[11px]">&middot; {selectedSignal.action}</span>
                <span className="text-slate-500 text-[10px] tabular-nums">{selectedSignal.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="px-2 py-0.5 rounded font-bold text-xs border"
                  style={{
                    backgroundColor: `${selectedSignal.confidenceColor}20`,
                    color: selectedSignal.confidenceColor,
                    borderColor: `${selectedSignal.confidenceColor}50`,
                  }}
                >
                  {selectedSignal.confidence}% Confidence ({selectedSignal.confidenceTier.replace('_', ' ')})
                </span>
                <button
                  onClick={() => setSelectedSignalId(null)}
                  className="text-slate-400 hover:text-white px-2 py-0.5 rounded hover:bg-slate-800 text-[11px]"
                >
                  ✕ Close Inspector
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div className="p-2 bg-slate-900/80 rounded border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Rolling Success Rate</span>
                <span className="font-bold text-white tabular-nums">{selectedSignal.successRatePct}%</span>
              </div>
              <div className="p-2 bg-slate-900/80 rounded border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Spread & Profit</span>
                <span className="font-bold text-amber-300 tabular-nums">+{selectedSignal.spreadPct}% (+${selectedSignal.profitUsd.toFixed(2)})</span>
              </div>
              <div className="p-2 bg-slate-900/80 rounded border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Urgency Score</span>
                <span className="font-bold text-cyan-300 tabular-nums">{selectedSignal.urgency} / 100</span>
              </div>
              <div className="p-2 bg-slate-900/80 rounded border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Drawdown Risk</span>
                <span className={`font-bold ${selectedSignal.drawdownRisk === 'LOW' ? 'text-emerald-400' : selectedSignal.drawdownRisk === 'MEDIUM' ? 'text-amber-400' : 'text-rose-400'}`}>
                  {selectedSignal.drawdownRisk}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-slate-900/60 rounded border border-slate-800/80 text-[10px]">
              <span className="text-slate-400 font-medium">Strategy Parameter Calibration Fit:</span>
              <div className="flex items-center gap-3">
                <span className={selectedSignal.confidence >= minConfidence ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                  {selectedSignal.confidence >= minConfidence ? '✓' : '✕'} Confidence ({selectedSignal.confidence}% vs &ge;{minConfidence}%)
                </span>
                <span className={selectedSignal.spreadPct >= minSpreadPct ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                  {selectedSignal.spreadPct >= minSpreadPct ? '✓' : '✕'} Spread ({selectedSignal.spreadPct}% vs &ge;{minSpreadPct.toFixed(2)}%)
                </span>
                <span className={selectedSignal.urgency >= minUrgency ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                  {selectedSignal.urgency >= minUrgency ? '✓' : '✕'} Urgency ({selectedSignal.urgency} vs &ge;{minUrgency})
                </span>
                <span className={`font-bold px-1.5 py-0.2 rounded ${selectedSignal.isFilteredIn ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                  {selectedSignal.isFilteredIn ? 'PASSED CALIBRATION' : 'FILTERED OUT'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* STRATEGY PARAMETER OPTIMIZER CONSOLE */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 space-y-3 text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-white uppercase tracking-wider text-xs">
              Strategy Parameter Calibration Controls
            </span>
          </div>
          <span className="text-[10px] text-slate-400">
            Adjust sliders to simulate win rate changes across historical signals
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Parameter 1: Minimum Confidence Cutoff */}
          <div className="p-2.5 bg-slate-950/80 border border-slate-800 rounded-lg space-y-1.5">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400 font-semibold">Min Confidence:</span>
              <span className="text-emerald-400 font-bold">{minConfidence}%</span>
            </div>
            <input
              type="range"
              min={50}
              max={95}
              step={1}
              value={minConfidence}
              onChange={(e) => setMinConfidence(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-slate-500">
              <span>50% (Lenient)</span>
              <span>95% (Strict)</span>
            </div>
          </div>

          {/* Parameter 2: Minimum Spread % */}
          <div className="p-2.5 bg-slate-950/80 border border-slate-800 rounded-lg space-y-1.5">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400 font-semibold">Min Spread %:</span>
              <span className="text-cyan-300 font-bold">+{minSpreadPct.toFixed(2)}%</span>
            </div>
            <input
              type="range"
              min={0.10}
              max={1.50}
              step={0.05}
              value={minSpreadPct}
              onChange={(e) => setMinSpreadPct(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-slate-500">
              <span>0.10%</span>
              <span>1.50%</span>
            </div>
          </div>

          {/* Parameter 3: Minimum Urgency Cutoff */}
          <div className="p-2.5 bg-slate-950/80 border border-slate-800 rounded-lg space-y-1.5">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400 font-semibold">Min Urgency Score:</span>
              <span className="text-amber-300 font-bold">{minUrgency}</span>
            </div>
            <input
              type="range"
              min={0}
              max={90}
              step={5}
              value={minUrgency}
              onChange={(e) => setMinUrgency(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-slate-500">
              <span>0 (All)</span>
              <span>90 (Flash Arb)</span>
            </div>
          </div>

          {/* Parameter 4: Drawdown Risk Filter */}
          <div className="p-2.5 bg-slate-950/80 border border-slate-800 rounded-lg space-y-1.5">
            <span className="text-slate-400 font-semibold block text-[11px]">Max Drawdown Risk:</span>
            <div className="grid grid-cols-3 gap-1">
              {[
                { id: 'ALL', label: 'All' },
                { id: 'MED_LOW', label: 'Med/Low' },
                { id: 'LOW_ONLY', label: 'Low Only' },
              ].map((tier) => (
                <button
                  key={tier.id}
                  onClick={() => setRiskTier(tier.id as any)}
                  className={`py-1 rounded text-[10px] font-bold transition-all border ${
                    riskTier === tier.id
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {tier.label}
                </button>
              ))}
            </div>
            <div className="text-[9px] text-slate-500 text-center">
              Bounds capital drawdown risk tier
            </div>
          </div>
        </div>

        {/* AI Strategy Optimization Insights Banner & Action */}
        <div className="p-3 bg-gradient-to-r from-cyan-950/40 via-slate-950 to-emerald-950/40 border border-cyan-500/30 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-300 leading-relaxed">
              <strong className="text-cyan-300">Optimal Parameter Recommendation:</strong> Filtering at{' '}
              <strong className="text-emerald-300">&ge;{minConfidence}% Confidence</strong> and{' '}
              <strong className="text-amber-300">&ge;{minSpreadPct.toFixed(2)}% Spread</strong> projects a{' '}
              <strong className="text-emerald-400">{strategySimulation.optimizedSuccessRate}% Win Rate</strong> (+
              {strategySimulation.winRateEdge}% alpha expansion) by shedding false breakout traps.
            </p>
          </div>

          <button
            onClick={handleApplyOptimal}
            className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold rounded-lg text-xs transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5 shrink-0"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Apply Parameters to Leaderboard</span>
          </button>
        </div>
      </div>
    </div>
  );
};
