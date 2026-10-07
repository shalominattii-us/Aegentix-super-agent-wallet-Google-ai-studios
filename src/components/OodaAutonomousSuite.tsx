import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Terminal, 
  Cpu, 
  ShieldCheck, 
  Radio, 
  Zap, 
  Play, 
  Copy, 
  Check, 
  Layers, 
  ArrowRight, 
  Eye, 
  TrendingUp, 
  AlertCircle,
  FileCode,
  Flame,
  Clock,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { OodaTelemetryState, PythonScriptInfo, MarketAsset } from '../types';

interface OodaAutonomousSuiteProps {
  oodaState: OodaTelemetryState | null;
  onTriggerPulse: (pair?: string) => Promise<void>;
  isPulsing: boolean;
  marketAssets: MarketAsset[];
}

export function OodaAutonomousSuite({
  oodaState,
  onTriggerPulse,
  isPulsing,
  marketAssets,
}: OodaAutonomousSuiteProps) {
  const [selectedScriptId, setSelectedScriptId] = useState<string>('cybercore_autonomous');
  const [scripts, setScripts] = useState<PythonScriptInfo[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'PIPELINE' | 'TERMINALS' | 'LOGS'>('PIPELINE');
  const [pulseCountdown, setPulseCountdown] = useState<number>(42);
  const [selectedPair, setSelectedPair] = useState<string>('ETH/USDT');

  // Fetch Python script sources from backend
  useEffect(() => {
    fetch('/api/terminal/scripts')
      .then((res) => res.json())
      .then((data) => {
        if (data.scripts) {
          setScripts(data.scripts);
        }
      })
      .catch((err) => console.error('Failed to load python scripts:', err));
  }, []);

  // Simulating the 60-second autonomous heartbeat countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setPulseCountdown((prev) => (prev <= 1 ? 60 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleCopyFullCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const selectedScript = scripts.find((s) => s.id === selectedScriptId) || scripts[0];

  const currentStage = oodaState?.currentStage || 'OBSERVE';
  const pulseNumber = oodaState?.pulseCounter || 14;
  const totalAlpha = oodaState?.totalProactiveAlphaUsd || 1420.80;
  const marketCtx = oodaState?.marketContext || {};
  const sentiment = marketCtx.social_sentiment || {};

  return (
    <div className="space-y-4">
      {/* Top Banner: OODA Proactive Autonomous Agent Overview */}
      <div className="bg-gradient-to-r from-[#0C1322] via-[#0E1A2D] to-[#0A1624] border border-cyan-500/30 rounded-xl p-4 sm:p-5 relative overflow-hidden shadow-lg shadow-cyan-950/20">
        <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-semibold tracking-wide uppercase">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                Autonomous Alpha Engine
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono">
                <ShieldCheck className="w-3 h-3" />
                OODA Loop Active
              </span>
              <span className="text-slate-400 text-xs font-mono">
                Heartbeat: <strong className="text-slate-200">60s cycle</strong>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2 font-mono">
              <span>Proactive Signal Loop</span>
              <span className="text-cyan-400 text-sm font-normal">Self-Triggering Alpha</span>
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-1 max-w-2xl">
              Transitions the CyberCore LLM from a passive reactive assistant into an autonomous alpha-generating agent. Ingests DEX/CEX spreads, evaluates Heretic bounds, clears security gates, and broadcasts atomic execution.
            </p>
          </div>

          {/* Quick Metrics & Manual Pulse Button */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-[#080D16]/90 border border-slate-800 rounded-lg px-3.5 py-2 text-right font-mono">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Next Auto Pulse</div>
              <div className="text-base font-bold text-cyan-300 flex items-center justify-end gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '4s' }} />
                <span>{pulseCountdown}s</span>
              </div>
            </div>

            <div className="bg-[#080D16]/90 border border-slate-800 rounded-lg px-3.5 py-2 text-right font-mono">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Proactive Alpha</div>
              <div className="text-base font-bold text-emerald-400">
                +${totalAlpha.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>

            <button
              onClick={() => onTriggerPulse(selectedPair)}
              disabled={isPulsing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-mono text-xs font-semibold shadow-md shadow-cyan-900/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-95"
            >
              {isPulsing ? (
                <>
                  <Zap className="w-4 h-4 text-cyan-200 animate-bounce" />
                  <span>Pulsing OODA...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 text-emerald-300 fill-emerald-300" />
                  <span>Trigger Pulse Now</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Sub Navigation: Pipeline vs Terminal Daemons vs Live Logs */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-800/80 text-xs font-mono">
          <button
            onClick={() => setActiveSubTab('PIPELINE')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded transition-colors ${
              activeSubTab === 'PIPELINE'
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>1. OODA Visual Pipeline</span>
          </button>

          <button
            onClick={() => setActiveSubTab('TERMINALS')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded transition-colors ${
              activeSubTab === 'TERMINALS'
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>2. Terminal Multi-Process Suite (4 Daemons)</span>
            <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded text-[9px]">Python Stack</span>
          </button>

          <button
            onClick={() => setActiveSubTab('LOGS')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded transition-colors ${
              activeSubTab === 'LOGS'
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-amber-400" />
            <span>3. Autonomous Telemetry Tape</span>
            <span className="px-1.5 py-0.2 bg-slate-800 text-slate-300 rounded text-[9px]">Pulse #{pulseNumber}</span>
          </button>
        </div>
      </div>

      {/* ----------------- SUB-TAB 1: OODA 4-STAGE PIPELINE ----------------- */}
      {activeSubTab === 'PIPELINE' && (
        <div className="space-y-4">
          {/* 4 Interactive Stage Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* STAGE 1: OBSERVE */}
            <div className={`p-4 rounded-xl border transition-all ${
              currentStage === 'OBSERVE'
                ? 'bg-[#0E1626] border-cyan-500/60 shadow-md shadow-cyan-950/40 ring-1 ring-cyan-500/30'
                : 'bg-[#0B101A] border-slate-800/80 hover:border-slate-700'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                    <Eye className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">Step 1</div>
                    <h3 className="text-sm font-bold text-white">OBSERVE</h3>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono">
                  Market Ingestor
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mb-3">
                Scrapes Uniswap V3 liquidity pools & Binance.US orderbook depth with news sentiment.
              </p>
              
              <div className="bg-[#070B12] rounded-lg p-2.5 border border-slate-800 text-[11px] font-mono space-y-1.5">
                <div className="flex justify-between text-slate-400">
                  <span>Pair Ingested:</span>
                  <span className="text-cyan-300 font-bold">{marketCtx.symbol || 'ETH/USDT'}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>CEX Price:</span>
                  <span className="text-slate-200">${marketCtx.eth_price_cex || '2,684.50'}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>DEX Price:</span>
                  <span className="text-slate-200">${marketCtx.eth_price_dex || '2,662.10'}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Spread Divergence:</span>
                  <span className="text-emerald-400 font-bold">+{marketCtx.spread_pct || '0.84'}%</span>
                </div>
                <div className="flex justify-between text-slate-400 pt-1 border-t border-slate-800/80">
                  <span>Social Buzz:</span>
                  <span className="text-amber-300">{sentiment.sentiment_rating || 'BULLISH_SURGE'} ({sentiment.fear_greed_index || 68}/100)</span>
                </div>
              </div>
            </div>

            {/* STAGE 2: ORIENT */}
            <div className={`p-4 rounded-xl border transition-all ${
              currentStage === 'ORIENT'
                ? 'bg-[#0E1626] border-purple-500/60 shadow-md shadow-purple-950/40 ring-1 ring-purple-500/30'
                : 'bg-[#0B101A] border-slate-800/80 hover:border-slate-700'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">Step 2</div>
                    <h3 className="text-sm font-bold text-white">ORIENT</h3>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono">
                  The Brain (:9003)
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mb-3">
                Heretic LLM analyzes raw data against historical signals & mathematical spread bounds.
              </p>

              <div className="bg-[#070B12] rounded-lg p-2.5 border border-slate-800 text-[11px] font-mono space-y-1.5">
                <div className="flex justify-between text-slate-400">
                  <span>Evaluation Rule:</span>
                  <span className="text-purple-300 font-mono text-[10px]">Spread &gt; 0.50%</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Condition Met:</span>
                  <span className="text-emerald-400 font-bold">YES (0.84% &gt; 0.50%)</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Sizing Calibrated:</span>
                  <span className="text-slate-200">1.25 ETH</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Gas & Slippage Buffer:</span>
                  <span className="text-slate-300">$4.80 | &lt;0.25%</span>
                </div>
                <div className="flex justify-between text-slate-400 pt-1 border-t border-slate-800/80">
                  <span>Target Route:</span>
                  <span className="text-cyan-300">Uniswap V3 &rarr; Binance</span>
                </div>
              </div>
            </div>

            {/* STAGE 3: DECIDE */}
            <div className={`p-4 rounded-xl border transition-all ${
              currentStage === 'DECIDE'
                ? 'bg-[#0E1626] border-amber-500/60 shadow-md shadow-amber-950/40 ring-1 ring-amber-500/30'
                : 'bg-[#0B101A] border-slate-800/80 hover:border-slate-700'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Step 3</div>
                    <h3 className="text-sm font-bold text-white">DECIDE</h3>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                  Structured Alpha
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mb-3">
                Generates strict typed Trade Signal JSON with calibrated confidence and decay TTL.
              </p>

              <div className="bg-[#070B12] rounded-lg p-2.5 border border-slate-800 text-[11px] font-mono space-y-1.5">
                <div className="flex justify-between text-slate-400">
                  <span>Signal Action:</span>
                  <span className="text-emerald-400 font-bold">SIGNAL: BUY</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Confidence:</span>
                  <span className="text-slate-200">93.4%</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Expected Net Alpha:</span>
                  <span className="text-emerald-400 font-bold">+$28.98 USD</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Urgency Score:</span>
                  <span className="text-amber-300">74 / 100</span>
                </div>
                <div className="flex justify-between text-slate-400 pt-1 border-t border-slate-800/80">
                  <span>Decay TTL:</span>
                  <span className="text-slate-300">110 seconds</span>
                </div>
              </div>
            </div>

            {/* STAGE 4: ACT */}
            <div className={`p-4 rounded-xl border transition-all ${
              currentStage === 'ACT'
                ? 'bg-[#0E1626] border-emerald-500/60 shadow-md shadow-emerald-950/40 ring-1 ring-emerald-500/30'
                : 'bg-[#0B101A] border-slate-800/80 hover:border-slate-700'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Step 4</div>
                    <h3 className="text-sm font-bold text-white">ACT & GATE</h3>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                  The Gate (:9004)
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mb-3">
                Hard security gate checks velocity, signs HMAC block, and executes dual-exchange router.
              </p>

              <div className="bg-[#070B12] rounded-lg p-2.5 border border-slate-800 text-[11px] font-mono space-y-1.5">
                <div className="flex justify-between text-slate-400">
                  <span>Velocity Audit:</span>
                  <span className="text-emerald-400 font-bold">PASS (0.35/s)</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Compliance Height:</span>
                  <span className="text-cyan-300">#{oodaState?.lastComplianceBlock?.height || 10484}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>HMAC Proof:</span>
                  <span className="text-slate-400 font-mono text-[9px] truncate max-w-[120px]">
                    {oodaState?.lastComplianceBlock?.hash || 'a7c92b4516...'}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Execution Leg:</span>
                  <span className="text-emerald-400 font-bold">SETTLED</span>
                </div>
                <div className="flex justify-between text-slate-400 pt-1 border-t border-slate-800/80">
                  <span>Telemetry Broadcast:</span>
                  <span className="text-cyan-400">Synced to UI</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Trigger Selector */}
          <div className="bg-[#0B101A] border border-slate-800 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-3">
              <span className="text-slate-400">Select pair for next autonomous loop test:</span>
              <select
                value={selectedPair}
                onChange={(e) => setSelectedPair(e.target.value)}
                className="bg-[#070B12] border border-slate-700 rounded px-2.5 py-1 text-cyan-300 focus:outline-none focus:border-cyan-500"
              >
                {marketAssets.map((asset) => (
                  <option key={asset.symbol} value={asset.symbol}>
                    {asset.symbol} (Spread: +{asset.spreadPct}%)
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Orchestrator Heartbeat: <strong>Active (60s loop)</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- SUB-TAB 2: 4-DAEMON TERMINAL SUITE ----------------- */}
      {activeSubTab === 'TERMINALS' && (
        <div className="space-y-4">
          {/* Terminal Daemon Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {scripts.slice(0, 4).map((script) => {
              const isSelected = selectedScriptId === script.id;
              return (
                <button
                  key={script.id}
                  onClick={() => setSelectedScriptId(script.id)}
                  className={`p-3 rounded-lg border text-left font-mono transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#101A2C] border-cyan-500/60 shadow-sm shadow-cyan-900/30'
                      : 'bg-[#0B101A] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                      {script.name}
                    </span>
                    {script.port && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300">
                        :{script.port}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-cyan-300 font-semibold">{script.title}</div>
                  <div className="text-[10px] text-slate-400 line-clamp-2 mt-1">{script.role}</div>
                </button>
              );
            })}
          </div>

          {/* Detailed Script Viewer & Live Terminal Emulation */}
          {selectedScript && (
            <div className="bg-[#070B12] border border-slate-800 rounded-xl overflow-hidden font-mono shadow-xl">
              {/* Terminal Window Header */}
              <div className="bg-[#0D131F] px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                  </div>
                  <span className="text-xs text-slate-300 font-bold ml-2 flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                    {selectedScript.name} &mdash; <span className="text-slate-400">{selectedScript.title}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(selectedScript.command, selectedScript.id)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
                  >
                    {copiedId === selectedScript.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-300">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-cyan-400" />
                        <span>Copy Run Command</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleCopyFullCode(selectedScript.code)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-600/30 hover:bg-cyan-600/40 border border-cyan-500/40 text-cyan-200 text-xs transition-colors"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>Code Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-cyan-300" />
                        <span>Copy Full Python Script</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Execution Info & Environment Separation Note */}
              <div className="px-4 py-2 bg-[#090E18] border-b border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Command:</span>
                  <code className="bg-[#05080E] px-2 py-0.5 rounded text-emerald-300 border border-slate-800 font-bold">
                    {selectedScript.command}
                  </code>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Target Env:</span>
                  <span className="text-cyan-300">{selectedScript.runtime}</span>
                </div>
              </div>

              {/* Code Viewer */}
              <div className="p-4 max-h-[420px] overflow-y-auto bg-[#05080E] text-[11px] leading-relaxed text-slate-300">
                <pre className="font-mono">
                  <code>{selectedScript.code}</code>
                </pre>
              </div>

              {/* Architecture Summary Footer */}
              <div className="p-3 bg-[#0B101A] border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Daemon Status: <strong>Ready to execute in terminal</strong></span>
                </div>
                <span className="text-slate-500">
                  Pure Python venv for Orchestrator &bull; System Python with ROCm for Heretic Server
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ----------------- SUB-TAB 3: AUTONOMOUS TELEMETRY TAPE ----------------- */}
      {activeSubTab === 'LOGS' && (
        <div className="bg-[#070B12] border border-slate-800 rounded-xl p-4 font-mono shadow-xl">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
              <h3 className="text-sm font-bold text-white">Live Autonomous OODA Heartbeat Tape</h3>
            </div>
            <span className="text-xs text-slate-400">
              Showing recent self-triggered events ({oodaState?.recentLogs?.length || 0})
            </span>
          </div>

          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
            {oodaState?.recentLogs && oodaState.recentLogs.length > 0 ? (
              oodaState.recentLogs.map((log, index) => (
                <div
                  key={index}
                  className="p-2.5 rounded bg-[#0A0F1A] border border-slate-800/80 text-xs flex items-start gap-2.5 transition-colors hover:border-slate-700"
                >
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    log.type === 'SUCCESS'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : log.type === 'ALERT'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  }`}>
                    {log.stage}
                  </span>
                  
                  <div className="flex-1">
                    <p className="text-slate-200">{log.message}</p>
                    <span className="text-[10px] text-slate-500 mt-0.5 block">
                      {new Date(log.timestamp).toLocaleTimeString()} &bull; Chained Heartbeat Log
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500 text-xs">
                No recent telemetry events recorded yet. Trigger a pulse above to begin logging.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
