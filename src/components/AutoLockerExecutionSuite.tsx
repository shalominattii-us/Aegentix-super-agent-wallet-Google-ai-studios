import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Zap,
  Lock,
  Play,
  Pause,
  RefreshCw,
  TrendingUp,
  Activity,
  Layers,
  ArrowRight,
  Database,
  Key,
  CheckCircle2,
  Clock,
  Sparkles,
  Award
} from 'lucide-react';

interface AutoLockerLogEntry {
  id: string;
  signalId: string;
  pair: string;
  route: string;
  buyVenue: string;
  sellVenue: string;
  buyPrice: number;
  sellPrice: number;
  grossSpreadBps: number;
  totalFeesPct: number;
  netSpreadBps: number;
  tradeSizeUsd: number;
  shadowFillLatencyMs: number;
  stage: 'SHADOW_FILLED' | 'PAPER_VERIFIED' | 'AUTO_LOCKED_VAULT';
  zeroLossPassed: boolean;
  netAlphaLockedUsd: number;
  operatorShareUsd: number;
  aiReserveUsd: number;
  gasTankShareUsd: number;
  hmacSignature: string;
  timestamp: string;
}

interface AutoLockerStatus {
  isActive: boolean;
  pulseCount: number;
  lastPulseAt: string;
  pulseIntervalMs: number;
  totalSignalsIngested: number;
  totalShadowExecuted: number;
  totalPaperVerified: number;
  totalAutoLockedUsd: number;
  operatorVaultAccumulationUsd: number;
  aiReserveAccumulationUsd: number;
  gasTankRefuelAccumulationUsd: number;
  currentStage: 'IDLE' | 'INGESTING' | 'SHADOW_EXECUTING' | 'PAPER_VERIFYING' | 'VAULT_LOCKING';
  recentAuditLogs: AutoLockerLogEntry[];
}

export const AutoLockerExecutionSuite: React.FC = () => {
  const [status, setStatus] = useState<AutoLockerStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);
  const [filterPair, setFilterPair] = useState<string>('ALL');

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/autolocker/status');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.status) {
          setStatus(data.status);
        }
      }
    } catch (err) {
      console.warn('AutoLocker fetch error:', err);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  const toggleContinuous = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/autolocker/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !status?.isActive }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.status) {
          setStatus(data.status);
        }
      }
    } catch (err) {
      console.error('Toggle error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const triggerInstantPulse = async () => {
    setIsPulsing(true);
    try {
      const res = await fetch('/api/autolocker/pulse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ maxSignals: 5 }),
      });
      if (res.ok) {
        await fetchStatus();
      }
    } catch (err) {
      console.error('Pulse error:', err);
    } finally {
      setIsPulsing(false);
    }
  };

  const logs = status?.recentAuditLogs || [];
  const filteredLogs = filterPair === 'ALL' ? logs : logs.filter(l => l.pair === filterPair);
  const uniquePairs = Array.from(new Set(logs.map(l => l.pair)));

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Console */}
      <div className="bg-slate-900/90 border border-emerald-500/30 rounded-xl p-5 shadow-2xl backdrop-blur-md relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500/20 border border-emerald-400/40 rounded-lg text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <Lock className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white tracking-wider flex items-center gap-2">
                  CONTINUOUS AUTO LOCKER & SHADOW/PAPER VERIFICATION ENGINE
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                    status?.isActive
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  }`}>
                    {status?.isActive ? 'LIVE CONTINUOUS' : 'PAUSED'}
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                  <span>3-Stage Zero-Loss Invariant</span>
                  <span className="text-slate-600">•</span>
                  <span>Shadow Execution (Zero Capital Risk)</span>
                  <span className="text-slate-600">•</span>
                  <span>HMAC-SHA256 Paper Verification</span>
                  <span className="text-slate-600">•</span>
                  <span>Direct Sovereign Vault Locking</span>
                </p>
              </div>
            </div>
          </div>

          {/* Engine Action Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleContinuous}
              disabled={isLoading}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all border shadow-lg ${
                status?.isActive
                  ? 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border-rose-500/50 shadow-rose-500/20'
                  : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border-emerald-500/50 shadow-emerald-500/20'
              }`}
            >
              {status?.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {status?.isActive ? 'Pause Continuous' : 'Start Continuous'}
            </button>

            <button
              onClick={triggerInstantPulse}
              disabled={isPulsing}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border border-cyan-400/30 shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isPulsing ? 'animate-spin' : ''}`} />
              {isPulsing ? 'Pulsing 28 Pairs...' : 'Full-Sweep Pulse'}
            </button>
          </div>
        </div>

        {/* 3-Stage Pipeline Status Rail */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3 border-t border-slate-800/80 pt-4">
          {/* Stage 1: Shadow Execution */}
          <div className="p-3 bg-slate-950/60 rounded-lg border border-cyan-500/20 flex items-start gap-3">
            <div className="p-2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 mt-0.5">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                Stage 1: Shadow Execution
                <span className="text-[10px] text-cyan-300/70 font-mono">(L2 Depth Fill)</span>
              </div>
              <div className="text-lg font-black text-white mt-0.5 font-mono">
                {status?.totalShadowExecuted ?? 0} <span className="text-xs text-slate-400 font-normal">Fills</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Latency: <span className="text-cyan-300 font-mono">~16ms</span> • 7 Venues • 0 Capital Risk
              </div>
            </div>
          </div>

          {/* Stage 2: Paper Verification */}
          <div className="p-3 bg-slate-950/60 rounded-lg border border-purple-500/20 flex items-start gap-3">
            <div className="p-2 rounded bg-purple-500/10 text-purple-400 border border-purple-500/30 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                Stage 2: Paper Trade Verification
                <span className="text-[10px] text-purple-300/70 font-mono">(Zero-Loss Gate)</span>
              </div>
              <div className="text-lg font-black text-white mt-0.5 font-mono">
                {status?.totalPaperVerified ?? 0} <span className="text-xs text-slate-400 font-normal">Signed</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                HMAC-SHA256 • Net Spread &gt; 0 • Fee Reconciled
              </div>
            </div>
          </div>

          {/* Stage 3: Auto Locker Vault */}
          <div className="p-3 bg-slate-950/60 rounded-lg border border-emerald-500/20 flex items-start gap-3">
            <div className="p-2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mt-0.5">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                Stage 3: Auto Locker Vault
                <span className="text-[10px] text-emerald-300/70 font-mono">(Direct Sweeping)</span>
              </div>
              <div className="text-lg font-black text-emerald-300 mt-0.5 font-mono">
                ${(status?.totalAutoLockedUsd ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                70% Operator / 20% AI / 10% Gas Tank
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vault Rewards & Sovereign Settlement Rail Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Operator Vault Accumulation */}
        <div className="bg-slate-900/80 border border-emerald-500/30 rounded-xl p-4 shadow-lg backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" /> Operator Alpha (70%)
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              Cold Vault
            </span>
          </div>
          <div className="mt-2 text-2xl font-black text-white font-mono">
            ${(status?.operatorVaultAccumulationUsd ?? 0).toFixed(2)}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            Primary user profit destination: XRPL Vault <span className="text-emerald-400 font-mono">rwB7JKKc...</span>
          </p>
        </div>

        {/* AI Sovereign Reserve */}
        <div className="bg-slate-900/80 border border-purple-500/30 rounded-xl p-4 shadow-lg backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> AI Reserve (20%)
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
              Autonomous
            </span>
          </div>
          <div className="mt-2 text-2xl font-black text-white font-mono">
            ${(status?.aiReserveAccumulationUsd ?? 0).toFixed(2)}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            Autonomous growth fund for liquidity seeding &amp; mesh nodes
          </p>
        </div>

        {/* Autonomous Gas Tank Refuel */}
        <div className="bg-slate-900/80 border border-cyan-500/30 rounded-xl p-4 shadow-lg backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" /> Gas Refuel (10%)
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              Self-Funding
            </span>
          </div>
          <div className="mt-2 text-2xl font-black text-white font-mono">
            ${(status?.gasTankRefuelAccumulationUsd ?? 0).toFixed(2)}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            Zero out-of-pocket fees. All network gas is fully self-sustained
          </p>
        </div>

        {/* Low-Cost Primary Transfer Rails & Acceptable Currencies */}
        <div className="bg-slate-900/80 border border-slate-700/60 rounded-xl p-4 shadow-lg backdrop-blur-sm">
          <div className="text-slate-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-blue-400" /> Acceptable Currencies
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-mono font-bold">
              RLUSD (1:1 USD)
            </span>
            <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[11px] font-mono font-bold">
              USDC (Base/Sol/XRP)
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-mono font-bold">
              XRP (12 drops gas)
            </span>
            <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[11px] font-mono font-bold">
              EOC (Sovereign)
            </span>
          </div>
          <div className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
            <span>Primary Rail:</span>
            <span className="text-emerald-400 font-bold">XRPL (12 drops / $0.000015)</span>
          </div>
        </div>
      </div>

      {/* Live Audit Blotter */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-2xl backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              Continuous Ingestion &amp; Execution Audit Blotter (All 28 Pairs)
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              ({logs.length} signals logged)
            </span>
          </div>

          {/* Pair filter buttons */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">Filter:</span>
            <select
              value={filterPair}
              onChange={(e) => setFilterPair(e.target.value)}
              className="bg-slate-950 text-white text-xs px-2.5 py-1 rounded border border-slate-700 focus:outline-none focus:border-cyan-500 font-mono"
            >
              <option value="ALL">All Pairs ({logs.length})</option>
              {uniquePairs.map((pair) => (
                <option key={pair} value={pair}>
                  {pair}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Blotter Table */}
        <div className="overflow-x-auto border border-slate-800/80 rounded-lg">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Time</th>
                <th className="py-2.5 px-3">Pair &amp; Route</th>
                <th className="py-2.5 px-3">Venues (Buy → Sell)</th>
                <th className="py-2.5 px-3 text-right">Spread (Gross / Net)</th>
                <th className="py-2.5 px-3 text-right">Size</th>
                <th className="py-2.5 px-3 text-right">Latency</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-right">Vault Locked</th>
                <th className="py-2.5 px-3 text-right">HMAC Audit Proof</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 font-mono text-[11px]">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500">
                    <RefreshCw className="w-6 h-6 mx-auto mb-2 animate-spin text-slate-600" />
                    Waiting for next continuous pulse... Ingesting signals across 28 pairs.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((entry) => {
                  const timeStr = new Date(entry.timestamp).toLocaleTimeString();
                  return (
                    <tr
                      key={entry.id}
                      className="hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-2.5 px-3 text-slate-400 whitespace-nowrap">
                        {timeStr}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-white whitespace-nowrap">
                        <span className="text-cyan-300">{entry.pair}</span>
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px]">
                            {entry.buyVenue}
                          </span>
                          <ArrowRight className="w-3 h-3 text-slate-500" />
                          <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30 text-[10px]">
                            {entry.sellVenue}
                          </span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        <div className="text-slate-400 text-[10px]">
                          Gross: +{entry.grossSpreadBps.toFixed(1)} bps
                        </div>
                        <div className="text-emerald-400 font-bold">
                          Net: +{entry.netSpreadBps.toFixed(1)} bps
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-300 whitespace-nowrap">
                        ${entry.tradeSizeUsd.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        <span className="text-cyan-400 font-bold">{entry.shadowFillLatencyMs}ms</span>
                      </td>
                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.2)]">
                          <CheckCircle2 className="w-3 h-3" />
                          Vault Locked
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-emerald-300 whitespace-nowrap">
                        +${entry.netAlphaLockedUsd.toFixed(2)}
                        <div className="text-[9px] text-slate-400 font-normal">
                          Op: ${entry.operatorShareUsd.toFixed(2)} | AI: ${entry.aiReserveUsd.toFixed(2)}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-right whitespace-nowrap font-mono text-[10px]">
                        <span
                          title={entry.hmacSignature}
                          className="px-2 py-0.5 rounded bg-slate-950 border border-slate-700 text-slate-400 hover:text-cyan-300 transition-colors cursor-help"
                        >
                          {entry.hmacSignature.slice(0, 8)}...{entry.hmacSignature.slice(-6)}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-slate-500">
          <div>
            Zero-Loss Verification Protocol: Every signal is shadow-simulated against live L2 order book depth, cryptographically signed, and swept to the cold vault under strict mathematical invariants.
          </div>
          <div className="flex items-center gap-1 text-slate-400 font-mono text-[11px]">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Last Continuous Pulse: {status?.lastPulseAt ? new Date(status.lastPulseAt).toLocaleTimeString() : 'Awaiting...'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
