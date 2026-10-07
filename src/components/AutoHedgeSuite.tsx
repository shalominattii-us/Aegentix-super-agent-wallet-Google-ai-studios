import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  ShieldCheck, 
  TrendingUp, 
  TrendingDown, 
  RefreshCw, 
  Zap, 
  Play, 
  AlertCircle, 
  Sliders, 
  ExternalLink,
  PlusCircle,
  Activity,
  CheckCircle2,
  Cpu
} from 'lucide-react';

interface AutoHedgeAgent {
  role: string;
  id: string;
  model: string;
  status: string;
  lastDecision: string;
  activeTasks: string[];
}

interface AutoHedgePosition {
  id: string;
  pair: string;
  direction: string;
  spotVenue: string;
  perpVenue: string;
  sizeUsd: number;
  entryDelta: number;
  currentFundingBps: number;
  unrealizedPnlUsd: number;
  status: string;
  riskScore: number;
  openedAt: string;
}

interface AutoHedgeData {
  success: boolean;
  framework: string;
  config: {
    activeStrategy: string;
    riskTolerance: string;
    maxPositionSizeUsd: number;
    stopLossPct: number;
    takeProfitPct: number;
    solanaRpcUrl: string;
    isSwarmRunning: boolean;
  };
  agents: AutoHedgeAgent[];
  positions: AutoHedgePosition[];
  consensusLogs?: Array<{
    id: string;
    timestamp: string;
    cycleNumber: number;
    strategy: string;
    pair: string;
    quantPreChaosSpread: number;
    quantPostChaosSpread: number;
    syntheticVolatilityPct: number;
    liquidityDrainPct: number;
    vulnerabilityScore: number;
    anomieRatio: number;
    verdict: string;
    pgpWords?: string;
    summary: string;
  }>;
  stats: {
    totalHedgedUsd: number;
    totalUnrealizedPnlUsd: number;
    aggregateDelta: number;
    annualizedYieldPct: number;
    swarmConsensus: string;
    timestamp: string;
  };
}

interface AutoHedgeSuiteProps {
  onNotify?: (message: string, type: 'ALERT' | 'SUCCESS' | 'INFO') => void;
}

export const AutoHedgeSuite: React.FC<AutoHedgeSuiteProps> = ({ onNotify }) => {
  const [data, setData] = useState<AutoHedgeData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCycling, setIsCycling] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState('DELTA_NEUTRAL_STAT_ARB');
  const [newPair, setNewPair] = useState('SOL/USDC');
  const [newSize, setNewSize] = useState('5000');
  const [isDeploying, setIsDeploying] = useState(false);

  const fetchStatus = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/autohedge/status');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err: any) {
      if (onNotify) onNotify(`AutoHedge fetch failed: ${err.message}`, 'ALERT');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleRunSwarmCycle = async () => {
    setIsCycling(true);
    try {
      const res = await fetch('/api/autohedge/cycle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ strategy: selectedStrategy }),
      });
      const json = await res.json();
      if (json.success) {
        if (onNotify) onNotify(`AutoHedge Swarm Cycle completed! Block Hash: ${json.blockHash?.slice(0, 10)}...`, 'SUCCESS');
        fetchStatus();
      }
    } catch (err: any) {
      if (onNotify) onNotify(`Cycle failed: ${err.message}`, 'ALERT');
    } finally {
      setIsCycling(false);
    }
  };

  const handleOpenHedgePosition = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDeploying(true);
    try {
      const res = await fetch('/api/autohedge/position', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pair: newPair,
          sizeUsd: parseFloat(newSize) || 5000,
          direction: 'LONG_SPOT_SHORT_PERP',
        }),
      });
      const json = await res.json();
      if (json.success) {
        if (onNotify) onNotify(`Hedge position opened on ${newPair} for $${newSize}!`, 'SUCCESS');
        fetchStatus();
      }
    } catch (err: any) {
      if (onNotify) onNotify(`Failed to open hedge position: ${err.message}`, 'ALERT');
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="bg-[#0B0F17] border border-slate-800 rounded-xl overflow-hidden shadow-2xl space-y-4 font-mono text-xs">
      {/* Header Banner */}
      <div className="p-4 sm:p-5 border-b border-slate-800 bg-gradient-to-r from-emerald-950/40 via-[#0B0F17] to-cyan-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-teal-500/20 shrink-0">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-wide uppercase">
                AUTOHEDGE SWARM INTELLIGENCE
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                SWARM CORP v1.0
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
              <span>Autonomous Hedge Fund Swarm Architecture · Solana DEX &amp; Perp Delta-Neutral Routing</span>
              <a 
                href="https://github.com/The-Swarm-Corporation/AutoHedge" 
                target="_blank" 
                rel="noreferrer"
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5"
              >
                <span>[GitHub]</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunSwarmCycle}
            disabled={isCycling}
            className="px-3 py-1.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white rounded text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 ${isCycling ? 'animate-spin' : ''}`} />
            <span>{isCycling ? 'Cycling Swarm...' : 'Trigger Swarm Cycle'}</span>
          </button>
          <button
            onClick={fetchStatus}
            disabled={isLoading}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 rounded transition-all cursor-pointer"
            title="Refresh Swarm Status"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Aggregate Stats */}
      {data?.stats && (
        <div className="px-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg">
            <span className="text-[10px] text-slate-500 block">TOTAL HEDGED CAPITAL</span>
            <span className="text-sm font-bold text-cyan-300">
              ${data.stats.totalHedgedUsd.toLocaleString()} USD
            </span>
          </div>
          <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg">
            <span className="text-[10px] text-slate-500 block">UNREALIZED BASIS P&amp;L</span>
            <span className="text-sm font-bold text-emerald-400">
              +${data.stats.totalUnrealizedPnlUsd.toFixed(2)} USD
            </span>
          </div>
          <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg">
            <span className="text-[10px] text-slate-500 block">PORTFOLIO NET DELTA</span>
            <span className="text-sm font-bold text-indigo-300">
              {data.stats.aggregateDelta >= 0 ? `+${data.stats.aggregateDelta}` : data.stats.aggregateDelta} (Delta-Neutral)
            </span>
          </div>
          <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg">
            <span className="text-[10px] text-slate-500 block">ANNUALIZED BASIS YIELD</span>
            <span className="text-sm font-bold text-yellow-400">
              {data.stats.annualizedYieldPct}% APY
            </span>
          </div>
        </div>
      )}

      {/* AutoHedge Specialized Swarm Agents (The 4 Swarm Pillars) */}
      <div className="px-4 space-y-2">
        <span className="text-[11px] font-bold text-slate-400 block uppercase">
          SWARM SPECIALIZED AGENT TEAMS:
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {data?.agents.map((agent) => (
            <div key={agent.id} className="p-3 bg-[#070A0F] border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white leading-tight">{agent.role}</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  {agent.status}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 italic">
                "{agent.lastDecision}"
              </p>
              <div className="pt-1 border-t border-slate-800/80 space-y-1">
                {agent.activeTasks.map((task, idx) => (
                  <div key={idx} className="flex items-center gap-1 text-[9px] text-slate-500">
                    <span className="w-1 h-1 rounded-full bg-cyan-400" />
                    <span>{task}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CyberGym Swarm Consensus Log: Quant Chaos Injections & Vulnerability Scores */}
      {data?.consensusLogs && data.consensusLogs.length > 0 && (
        <div className="px-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 block uppercase flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
              <span>CyberGym Consensus Log: Quant Volatility &amp; Liquidity Drain Injections</span>
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              Relativistic Anomie Barrier &le; 1.50 Max
            </span>
          </div>

          <div className="border border-slate-800 rounded-xl bg-[#070A0F] overflow-hidden">
            <div className="divide-y divide-slate-800/60 max-h-[240px] overflow-y-auto font-mono text-[10px]">
              {data.consensusLogs.map((log) => (
                <div key={log.id} className="p-3 hover:bg-slate-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold text-xs">{log.pair}</span>
                      <span className="text-slate-400">Cycle #{log.cycleNumber}</span>
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                        log.verdict === 'APPROVED_BY_CYBERGYM'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}>
                        {log.verdict}
                      </span>
                      {log.pgpWords && (
                        <span className="text-purple-300 text-[9px] font-mono">
                          PGP: <b>"{log.pgpWords}"</b>
                        </span>
                      )}
                    </div>
                    <div className="text-slate-400 text-[10px]">{log.summary}</div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 text-right sm:text-right">
                    <div>
                      <span className="text-slate-500 block text-[9px]">VULNERABILITY</span>
                      <span className={`font-bold ${
                        log.vulnerabilityScore < 45 ? 'text-emerald-400' : log.vulnerabilityScore < 80 ? 'text-amber-400' : 'text-rose-400'
                      }`}>
                        {log.vulnerabilityScore}/100
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px]">ANOMIE</span>
                      <span className="text-cyan-400 font-bold">{log.anomieRatio}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px]">TIME</span>
                      <span className="text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Active Hedged Positions & Open Position Form */}
      <div className="px-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Active Positions Table */}
        <div className="lg:col-span-2 space-y-2">
          <span className="text-[11px] font-bold text-slate-400 block uppercase">
            ACTIVE DELTA-NEUTRAL POSITIONS ({data?.positions.length || 0})
          </span>
          <div className="space-y-2">
            {data?.positions.map((pos) => (
              <div key={pos.id} className="p-3 bg-[#070A0F] border border-slate-800 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-xs">{pos.pair}</span>
                    <span className="px-1.5 py-0.2 bg-slate-800 text-slate-300 rounded text-[9px]">
                      {pos.direction}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-emerald-400">
                    +${pos.unrealizedPnlUsd.toFixed(2)}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] text-slate-400 pt-1">
                  <div>
                    <span className="text-slate-500 block">Spot Venue:</span>
                    <span className="text-slate-200">{pos.spotVenue}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Perp Venue:</span>
                    <span className="text-slate-200">{pos.perpVenue}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Size:</span>
                    <span className="text-cyan-300 font-bold">${pos.sizeUsd.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Funding Rate:</span>
                    <span className="text-yellow-400">{pos.currentFundingBps} bps</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Deploy New Hedge Form */}
        <div className="p-4 bg-[#070A0F] border border-slate-800 rounded-xl space-y-3">
          <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs">
            <PlusCircle className="w-4 h-4 text-cyan-400" />
            <span>DEPLOY NEW HEDGE (SOLANA/DEX)</span>
          </div>

          <form onSubmit={handleOpenHedgePosition} className="space-y-2.5">
            <div>
              <label className="text-[10px] text-slate-500 block mb-1">PAIR</label>
              <select
                value={newPair}
                onChange={(e) => setNewPair(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white"
              >
                <option value="SOL/USDC">SOL/USDC (Jupiter / Drift)</option>
                <option value="ETH/USDT">ETH/USDT (Uniswap / Coinbase)</option>
                <option value="BTC/USDC">BTC/USDC (Orca / Binance)</option>
                <option value="JUP/USDC">JUP/USDC (Jupiter Spot & Perp)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-slate-500 block mb-1">CAPITAL SIZE ($ USD)</label>
              <input
                type="number"
                value={newSize}
                onChange={(e) => setNewSize(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white"
              />
            </div>

            <button
              type="submit"
              disabled={isDeploying}
              className="w-full py-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white rounded text-xs font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isDeploying ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Routing Atomic Swarm...</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5" />
                  <span>Execute AutoHedge Position</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
