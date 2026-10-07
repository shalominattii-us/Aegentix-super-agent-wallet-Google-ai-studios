import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Activity, 
  RefreshCw, 
  AlertTriangle, 
  Clock, 
  Cpu, 
  TrendingUp, 
  Layers, 
  SlidersHorizontal,
  Info
} from 'lucide-react';

interface HeatmapCell {
  window: string;
  riskScore: number;
  riskTier: 'LOW' | 'MODERATE' | 'ELEVATED' | 'CRITICAL';
  slippageDriftBps: number;
  velocityBreaches: number;
  invariantsPassed: boolean;
  sampleCount: number;
}

interface AssetRiskRow {
  asset: string;
  name: string;
  currentSpreadPct: number;
  currentVolatility: 'low' | 'medium' | 'high';
  aggregateRiskScore: number;
  windows: HeatmapCell[];
}

interface ComplianceMetrics {
  total_transactions: number;
  compliance_rate: number;
  active_invariants: number;
  mean_integrity_score: number;
}

interface HeatmapResponse {
  success: boolean;
  isConnected9001: boolean;
  enginePort: number;
  lastCheckTimestamp: string;
  complianceMetrics: ComplianceMetrics;
  auditTrailLength: number;
  trackedAssets: string[];
  timeWindows: string[];
  matrix: AssetRiskRow[];
}

interface ComplianceHeatmapProps {
  onNotify?: (message: string, type: 'ALERT' | 'SUCCESS' | 'INFO') => void;
}

export const ComplianceHeatmap: React.FC<ComplianceHeatmapProps> = ({ onNotify }) => {
  const [data, setData] = useState<HeatmapResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{ asset: string; cell: HeatmapCell } | null>(null);
  const [filterThreshold, setFilterThreshold] = useState<number>(0);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchHeatmapData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/compliance/heatmap');
      if (!res.ok) return;
      const json: HeatmapResponse = await res.json();
      setData(json);
      if (!selectedCell && json.matrix.length > 0 && json.matrix[0].windows.length > 0) {
        setSelectedCell({
          asset: json.matrix[0].asset,
          cell: json.matrix[0].windows[0]
        });
      }
    } catch (err: any) {
      if (onNotify) onNotify(`Failed to fetch compliance heatmap: ${err.message}`, 'ALERT');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHeatmapData();
    let interval: any = null;
    if (autoRefresh) {
      interval = setInterval(fetchHeatmapData, 8000);
    }
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const getRiskColor = (score: number) => {
    if (score >= 75) {
      return 'bg-red-500/80 border-red-400 text-white shadow-md shadow-red-500/20';
    }
    if (score >= 50) {
      return 'bg-amber-500/70 border-amber-400 text-amber-950 font-bold';
    }
    if (score >= 30) {
      return 'bg-yellow-500/40 border-yellow-500/60 text-yellow-200';
    }
    return 'bg-emerald-500/30 border-emerald-500/40 text-emerald-300';
  };

  const getRiskBadge = (tier: string) => {
    switch (tier) {
      case 'CRITICAL':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-500/20 text-red-300 border border-red-500/40 font-bold">CRITICAL RISK</span>;
      case 'ELEVATED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">ELEVATED</span>;
      case 'MODERATE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 font-medium">MODERATE</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-medium">NOMINAL (SAFE)</span>;
    }
  };

  return (
    <div className="bg-[#0B0F17] border border-slate-800 rounded-xl overflow-hidden shadow-2xl space-y-4">
      {/* Header Banner */}
      <div className="p-4 sm:p-5 border-b border-slate-800 bg-gradient-to-r from-red-950/30 via-[#0B0F17] to-cyan-950/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-amber-600 flex items-center justify-center shadow-lg shadow-red-500/20 shrink-0">
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-wide font-mono uppercase">
                COMPLIANCE CHAIN RISK HEATMAP
              </h2>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1 ${
                data?.isConnected9001 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {data?.isConnected9001 ? ':9001 DIRECT ENGINE' : ':9001 COMPLIANCE FEED'}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Live multi-window risk audit · Invariant violation telemetry · Slippage drift anomalies
            </p>
          </div>
        </div>

        {/* Top Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-2.5 py-1.5 rounded text-xs font-mono border transition-all ${
              autoRefresh 
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            Auto: {autoRefresh ? 'ON' : 'OFF'}
          </button>
          <button
            onClick={fetchHeatmapData}
            disabled={isLoading}
            className="p-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 rounded transition-all cursor-pointer"
            title="Refresh Heatmap Metrics"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Top Metrics Row */}
      {data && (
        <div className="px-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg">
            <span className="text-[10px] font-mono text-slate-500 block">TOTAL AUDIT BLOCKS</span>
            <span className="text-sm font-bold font-mono text-cyan-400">
              #{data.complianceMetrics.total_transactions.toLocaleString()}
            </span>
          </div>
          <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg">
            <span className="text-[10px] font-mono text-slate-500 block">COMPLIANCE PASS RATE</span>
            <span className="text-sm font-bold font-mono text-emerald-400">
              {data.complianceMetrics.compliance_rate}%
            </span>
          </div>
          <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg">
            <span className="text-[10px] font-mono text-slate-500 block">ACTIVE INVARIANTS</span>
            <span className="text-sm font-bold font-mono text-indigo-300">
              {data.complianceMetrics.active_invariants} Verified Gates
            </span>
          </div>
          <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg">
            <span className="text-[10px] font-mono text-slate-500 block">MEAN INTEGRITY SCORE</span>
            <span className="text-sm font-bold font-mono text-yellow-400">
              {data.complianceMetrics.mean_integrity_score} / 100
            </span>
          </div>
        </div>
      )}

      {/* Heatmap Matrix Table */}
      <div className="px-4 overflow-x-auto">
        <table className="w-full border-collapse font-mono text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
              <th className="py-2 px-3 text-left">ASSET / PAIR</th>
              <th className="py-2 px-2 text-center">AGGREGATE</th>
              {data?.timeWindows.map((win) => (
                <th key={win} className="py-2 px-2 text-center whitespace-nowrap">
                  {win}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {data?.matrix.map((row) => (
              <tr key={row.asset} className="hover:bg-slate-900/40 transition-colors">
                <td className="py-2.5 px-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{row.asset}</span>
                    <span className="text-[10px] text-slate-500">({row.currentVolatility} vol)</span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    Spread: {(row.currentSpreadPct || 0).toFixed(2)}%
                  </span>
                </td>

                <td className="py-2.5 px-2 text-center">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    row.aggregateRiskScore >= 60 ? 'text-red-400 bg-red-950/40 border border-red-500/30' :
                    row.aggregateRiskScore >= 40 ? 'text-amber-300 bg-amber-950/40 border border-amber-500/30' :
                    'text-emerald-400 bg-emerald-950/40 border border-emerald-500/30'
                  }`}>
                    {row.aggregateRiskScore}
                  </span>
                </td>

                {row.windows.map((cell) => {
                  const isSelected = selectedCell?.asset === row.asset && selectedCell?.cell.window === cell.window;
                  return (
                    <td key={cell.window} className="p-1 text-center">
                      <button
                        onClick={() => setSelectedCell({ asset: row.asset, cell })}
                        className={`w-full py-2 px-1 rounded border text-center transition-all cursor-pointer font-bold text-[11px] ${getRiskColor(cell.riskScore)} ${
                          isSelected ? 'ring-2 ring-white scale-105 z-10' : 'hover:opacity-90'
                        }`}
                        title={`${row.asset} @ ${cell.window}: Risk ${cell.riskScore} (${cell.riskTier})`}
                      >
                        {cell.riskScore}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Selected Cell Drilldown Card */}
      {selectedCell && (
        <div className="m-4 p-4 bg-[#070A0F] border border-slate-700/80 rounded-xl font-mono text-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="text-white font-bold text-sm">{selectedCell.asset} / USDT</span>
              <span className="text-slate-400">Time Window: <strong className="text-cyan-300">{selectedCell.cell.window}</strong></span>
              {getRiskBadge(selectedCell.cell.riskTier)}
            </div>
            <span className="text-slate-500 text-[11px]">
              Engine Port: :9001 · Physical ROG Invariant Check
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div className="p-2.5 bg-slate-900/80 rounded border border-slate-800">
              <span className="text-[10px] text-slate-500 block">RISK SCORE</span>
              <span className={`text-base font-bold ${
                selectedCell.cell.riskScore >= 70 ? 'text-red-400' :
                selectedCell.cell.riskScore >= 40 ? 'text-amber-300' :
                'text-emerald-400'
              }`}>
                {selectedCell.cell.riskScore} / 100
              </span>
            </div>

            <div className="p-2.5 bg-slate-900/80 rounded border border-slate-800">
              <span className="text-[10px] text-slate-500 block">SLIPPAGE DRIFT</span>
              <span className="text-base font-bold text-cyan-300">
                {selectedCell.cell.slippageDriftBps} bps
              </span>
            </div>

            <div className="p-2.5 bg-slate-900/80 rounded border border-slate-800">
              <span className="text-[10px] text-slate-500 block">VELOCITY BREACHES</span>
              <span className={`text-base font-bold ${
                selectedCell.cell.velocityBreaches > 0 ? 'text-amber-400' : 'text-slate-300'
              }`}>
                {selectedCell.cell.velocityBreaches} events
              </span>
            </div>

            <div className="p-2.5 bg-slate-900/80 rounded border border-slate-800">
              <span className="text-[10px] text-slate-500 block">INVARIANT POSTURE</span>
              <span className="text-base font-bold text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                {selectedCell.cell.invariantsPassed ? 'NOMINAL' : 'RESTRICTED'}
              </span>
            </div>
          </div>

          <div className="p-2.5 bg-slate-950 border border-slate-800/80 rounded text-[11px] text-slate-300 leading-relaxed">
            <strong className="text-cyan-400">Automated Remediation Directive: </strong>
            {selectedCell.cell.riskScore >= 75 ? (
              <span>High volatility window detected. Engine restricts execution size by 50% and mandates double HMAC confirmation before settlement.</span>
            ) : selectedCell.cell.riskScore >= 50 ? (
              <span>Elevated spread slippage. Dynamic priority fee scalar active; execution size throttled to 1.5x standard slippage budget.</span>
            ) : (
              <span>Execution conditions nominal. Unrestricted sovereign arbitrage routing enabled across all synchronized venues.</span>
            )}
          </div>
        </div>
      )}

      {/* Heatmap Legend */}
      <div className="p-3 border-t border-slate-800 bg-[#090D14] flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-4">
          <span className="text-slate-500 font-semibold">LEGEND:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-500/40 border border-emerald-500/60" />
            <span>0-29 Nominal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-yellow-500/40 border border-yellow-500/60" />
            <span>30-49 Moderate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-500/70 border border-amber-400" />
            <span>50-74 Elevated</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-red-500/80 border border-red-400" />
            <span>75-100 Critical</span>
          </div>
        </div>

        <span className="text-slate-500">
          Source: Direct compliance telemetry stream (:9001)
        </span>
      </div>
    </div>
  );
};
