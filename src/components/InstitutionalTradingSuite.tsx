import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Zap,
  Cpu,
  Layers,
  Activity,
  CheckCircle2,
  Clock,
  ArrowRight,
  DollarSign,
  BarChart3,
  Percent,
  RefreshCw,
  Sliders,
  Play,
  Pause,
  AlertTriangle,
  Terminal,
  Lock,
  ChevronRight,
  Copy,
  ExternalLink,
  Sparkles,
  Target,
  FileText,
  Workflow,
  Crosshair,
} from 'lucide-react';
import {
  INSTITUTIONAL_PLAYBOOKS,
  INSTITUTIONAL_RUNBOOK,
  QUANTITATIVE_METHODOLOGIES,
  INITIAL_INSTITUTIONAL_SIGNALS,
  InstitutionalPlaybook,
  RunbookSopStep,
  QuantitativeMethodology,
  InstitutionalSignal,
} from '../data/institutionalTradingData';

interface InstitutionalTradingSuiteProps {
  onNotify?: (message: string, type: 'ALERT' | 'SUCCESS' | 'INFO') => void;
  onOpenOmniCyberDex?: () => void;
}

export const InstitutionalTradingSuite: React.FC<InstitutionalTradingSuiteProps> = ({
  onNotify,
  onOpenOmniCyberDex,
}) => {
  const [activeTab, setActiveTab] = useState<'PLAYBOOKS' | 'RUNBOOK' | 'QUANT_METHODS' | 'SIGNALS' | 'CONSOLE'>('PLAYBOOKS');
  const [playbooks, setPlaybooks] = useState<InstitutionalPlaybook[]>(INSTITUTIONAL_PLAYBOOKS);
  const [runbookSteps, setRunbookSteps] = useState<RunbookSopStep[]>(INSTITUTIONAL_RUNBOOK);
  const [methodologies] = useState<QuantitativeMethodology[]>(QUANTITATIVE_METHODOLOGIES);
  const [signals, setSignals] = useState<InstitutionalSignal[]>(INITIAL_INSTITUTIONAL_SIGNALS);
  const [selectedPlaybook, setSelectedPlaybook] = useState<InstitutionalPlaybook>(INSTITUTIONAL_PLAYBOOKS[0]);
  const [executingSignalId, setExecutingSignalId] = useState<string | null>(null);
  const [isVerifyingStep, setIsVerifyingStep] = useState<string | null>(null);

  // Live simulation ticker for alpha generation
  const [livePnlUsd, setLivePnlUsd] = useState(14114.40);
  const [activeTps, setActiveTps] = useState(84200);

  useEffect(() => {
    const timer = setInterval(() => {
      setLivePnlUsd(prev => Number((prev + (Math.random() * 8.5 - 2.1)).toFixed(2)));
      setActiveTps(Math.floor(82000 + Math.random() * 4500));
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const handleTogglePlaybook = (id: string) => {
    setPlaybooks(prev =>
      prev.map(pb => {
        if (pb.id === id) {
          const nextStatus = pb.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
          if (onNotify) {
            onNotify(`Playbook [${pb.title}] shifted to ${nextStatus}`, nextStatus === 'ACTIVE' ? 'SUCCESS' : 'ALERT');
          }
          return { ...pb, status: nextStatus };
        }
        return pb;
      })
    );
  };

  const handleExecuteSopStep = (stepId: string) => {
    setIsVerifyingStep(stepId);
    if (onNotify) onNotify(`⚡ Running automated verification: ${stepId}...`, 'INFO');

    setTimeout(() => {
      setIsVerifyingStep(null);
      setRunbookSteps(prev =>
        prev.map(s => {
          if (s.id === stepId) {
            return {
              ...s,
              status: 'VERIFIED',
              lastVerifiedAt: new Date().toLocaleTimeString('en-US', { hour12: false }) + ' UTC',
            };
          }
          return s;
        })
      );
      if (onNotify) onNotify(`✅ SOP Step [${stepId}] verified compliant with zero audit infractions!`, 'SUCCESS');
    }, 1100);
  };

  const handleExecuteSignal = (sig: InstitutionalSignal) => {
    setExecutingSignalId(sig.id);
    if (onNotify) {
      onNotify(`🚀 Dispatching ${sig.direction} order for ${sig.pair} ($${sig.suggestedSizeUsd.toLocaleString()}) via OmniCyberDex...`, 'INFO');
    }

    setTimeout(() => {
      setExecutingSignalId(null);
      setSignals(prev =>
        prev.map(s => (s.id === sig.id ? { ...s, status: 'FILLED' } : s))
      );
      setLivePnlUsd(prev => prev + sig.expectedAlphaBps * 2.5);
      if (onNotify) {
        onNotify(`🎯 Signal ${sig.id} Filled at ${sig.cexPrice} / ${sig.dexPrice} (Spread: ${sig.spreadBps} bps). Alpha captured!`, 'SUCCESS');
      }
    }, 1200);
  };

  const totalAllocated = playbooks.reduce((acc, p) => acc + p.capitalAllocatedUsd, 0);

  return (
    <div className="bg-[#030508] border border-cyan-500/30 rounded-xl overflow-hidden shadow-2xl space-y-4 font-mono text-xs text-slate-200">
      {/* HEADER HUD */}
      <div className="p-4 sm:p-5 border-b border-cyan-500/20 bg-gradient-to-r from-[#030508] via-[#081524] to-[#040C1A] flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-slate-900 border border-cyan-500/40 flex items-center justify-center shadow-lg shadow-cyan-500/20 shrink-0">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-cyan-300 tracking-wider uppercase font-sans">
                INSTITUTIONAL TRADING COMMAND &middot; QUANT SUITE
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-black border flex items-center gap-1 bg-cyan-500/20 text-cyan-300 border-cyan-500/40">
                <ShieldCheck className="w-3 h-3 text-cyan-400" />
                SHARPE 3.82 &middot; KELLY SIZED
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-black border flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border-emerald-500/40">
                <Zap className="w-3 h-3 text-emerald-400" />
                SUB-20MS DUAL ENGINE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Cross-Exchange Atomic Arbitrage &middot; Delta-Neutral Carry &middot; VPIN Order Toxicity &middot; OODA Regime Switching
            </p>
          </div>
        </div>

        {/* Real-Time Metrics Strip */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700 flex items-center gap-2">
            <span className="text-[10px] text-slate-400">Desk Capital:</span>
            <span className="font-bold text-white font-sans">${(totalAllocated / 1000).toFixed(0)}K USD</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 flex items-center gap-2">
            <span className="text-[10px] text-slate-400">24h Net Alpha:</span>
            <span className="font-bold text-emerald-400 font-sans">+${livePnlUsd.toLocaleString()}</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-indigo-950/40 border border-indigo-500/40 flex items-center gap-2">
            <span className="text-[10px] text-slate-400">DAG Throughput:</span>
            <span className="font-bold text-indigo-300 font-sans">{activeTps.toLocaleString()} TPS</span>
          </div>
        </div>
      </div>

      {/* SUB-TABS */}
      <div className="px-4 border-b border-slate-800 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveTab('PLAYBOOKS')}
          className={`flex items-center gap-1.5 px-3 py-2 border-b-2 font-bold transition-colors cursor-pointer ${
            activeTab === 'PLAYBOOKS'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Strategic Playbooks</span>
          <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 text-[9px] font-bold">
            {playbooks.filter(p => p.status === 'ACTIVE').length} Active
          </span>
        </button>

        <button
          onClick={() => setActiveTab('RUNBOOK')}
          className={`flex items-center gap-1.5 px-3 py-2 border-b-2 font-bold transition-colors cursor-pointer ${
            activeTab === 'RUNBOOK'
              ? 'border-amber-400 text-amber-300 bg-amber-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Workflow className="w-3.5 h-3.5" />
          <span>Operational Runbook (SOPs)</span>
          <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-bold">
            6 Protocols
          </span>
        </button>

        <button
          onClick={() => setActiveTab('QUANT_METHODS')}
          className={`flex items-center gap-1.5 px-3 py-2 border-b-2 font-bold transition-colors cursor-pointer ${
            activeTab === 'QUANT_METHODS'
              ? 'border-purple-400 text-purple-300 bg-purple-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Quantitative Methodologies</span>
        </button>

        <button
          onClick={() => setActiveTab('SIGNALS')}
          className={`flex items-center gap-1.5 px-3 py-2 border-b-2 font-bold transition-colors cursor-pointer ${
            activeTab === 'SIGNALS'
              ? 'border-emerald-400 text-emerald-300 bg-emerald-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Crosshair className="w-3.5 h-3.5 text-emerald-400" />
          <span>Live Signal Generation</span>
          <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-bold">
            {signals.length} Signals
          </span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: STRATEGIC INSTITUTIONAL PLAYBOOKS                  */}
      {/* ========================================================= */}
      {activeTab === 'PLAYBOOKS' && (
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {playbooks.map(pb => {
              const isSelected = selectedPlaybook.id === pb.id;
              const isActive = pb.status === 'ACTIVE';

              return (
                <div
                  key={pb.id}
                  onClick={() => setSelectedPlaybook(pb)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer space-y-3 relative overflow-hidden ${
                    isSelected
                      ? 'bg-[#061220] border-cyan-400 shadow-xl shadow-cyan-500/10'
                      : 'bg-[#060C14] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-cyan-300 font-mono text-xs">{pb.id}</span>
                        <span className={`px-1.5 py-0.2 rounded text-[8px] font-black ${
                          isActive ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {pb.status}
                        </span>
                      </div>
                      <h4 className="font-bold text-white text-xs mt-1 leading-snug">{pb.title}</h4>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTogglePlaybook(pb.id);
                      }}
                      className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-emerald-600/20 border-emerald-500/50 text-emerald-300 hover:bg-emerald-600/30'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-2">
                    {pb.tagline}
                  </p>

                  <div className="grid grid-cols-3 gap-1.5 p-2 bg-slate-950 rounded border border-slate-850 text-center text-[10px]">
                    <div>
                      <span className="text-slate-500 block">Win Rate</span>
                      <span className="font-bold text-emerald-400">{pb.winRatePct}%</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Sharpe</span>
                      <span className="font-bold text-cyan-300">{pb.sharpeRatio}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Ann. Yield</span>
                      <span className="font-bold text-amber-300">+{pb.annualizedYieldPct}%</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-[10px]">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Venues:</span>
                      <span className="text-slate-200 truncate max-w-[170px]">{pb.venues.join(' &middot; ')}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Latency:</span>
                      <span className="text-emerald-400 font-mono">{pb.executionLatency}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Capital:</span>
                      <span className="text-white font-bold">${pb.capitalAllocatedUsd.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
                    <span className="text-slate-400">24h PnL:</span>
                    <span className="font-bold text-emerald-400 font-mono">+${pb.currentPnl24hUsd.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Playbook Dossier Inspector */}
          {selectedPlaybook && (
            <div className="p-4 bg-[#060C14] border border-cyan-500/40 rounded-xl space-y-3">
              <div className="flex items-start justify-between flex-wrap gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-cyan-300 font-bold">{selectedPlaybook.id}</span>
                    <h3 className="font-bold text-white text-sm">{selectedPlaybook.title}</h3>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{selectedPlaybook.tagline}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                    CATEGORY: {selectedPlaybook.category}
                  </span>
                  {onOpenOmniCyberDex && (
                    <button
                      onClick={onOpenOmniCyberDex}
                      className="px-3 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>Open in OmniCyberDex</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1.5">
                  <span className="text-amber-400 font-bold text-xs uppercase flex items-center gap-1">
                    <Target className="w-3.5 h-3.5" />
                    <span>Edge Mechanics</span>
                  </span>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {selectedPlaybook.edgeMechanic}
                  </p>
                </div>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1.5">
                  <span className="text-emerald-400 font-bold text-xs uppercase flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Trigger Conditions</span>
                  </span>
                  <ul className="space-y-1 text-[11px] text-slate-300">
                    {selectedPlaybook.triggerConditions.map((cond, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-400">&bull;</span>
                        <span>{cond}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1.5">
                  <span className="text-rose-400 font-bold text-xs uppercase flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Risk Controls &amp; Stops</span>
                  </span>
                  <ul className="space-y-1 text-[11px] text-slate-300">
                    {selectedPlaybook.riskControls.map((ctrl, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-rose-400">&bull;</span>
                        <span>{ctrl}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: OPERATIONAL RUNBOOK (SOPs)                         */}
      {/* ========================================================= */}
      {activeTab === 'RUNBOOK' && (
        <div className="p-4 space-y-4">
          <div className="p-3 bg-[#060C14] border border-amber-500/30 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Workflow className="w-5 h-5 text-amber-400" />
              <div>
                <span className="font-bold text-white text-xs">MANDATORY DESK STANDARD OPERATING PROCEDURES</span>
                <p className="text-[10px] text-slate-400">Institutional Pre-Flight &middot; Execution Loops &middot; Circuit Breakers &middot; EOD Settlement</p>
              </div>
            </div>

            <button
              onClick={() => {
                if (onNotify) onNotify('⚡ Running full runbook suite audit...', 'INFO');
                runbookSteps.forEach(s => handleExecuteSopStep(s.id));
              }}
              className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Audit All 6 SOP Steps</span>
            </button>
          </div>

          <div className="space-y-3">
            {runbookSteps.map(step => (
              <div
                key={step.id}
                className="p-4 bg-[#060C14] border border-slate-800 rounded-xl space-y-2 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-slate-800 text-cyan-300">
                      {step.code}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                      {step.phase}
                    </span>
                    <h4 className="font-bold text-white text-xs">{step.title}</h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black ${
                      step.status === 'VERIFIED'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : step.status === 'RUNNING'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}>
                      {step.status}
                    </span>
                    <button
                      onClick={() => handleExecuteSopStep(step.id)}
                      disabled={isVerifyingStep === step.id}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold border border-slate-700 cursor-pointer disabled:opacity-50"
                    >
                      {isVerifyingStep === step.id ? 'Verifying...' : 'Run Automated Check'}
                    </button>
                  </div>
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed">
                  <b className="text-white">Action:</b> {step.mandatoryAction}
                </p>

                <div className="p-2 bg-slate-950 rounded border border-slate-850 font-mono text-[10px] text-cyan-300 flex items-center justify-between">
                  <span>$ {step.automatedCheckCommand}</span>
                  <span className="text-slate-500 text-[9px]">Last: {step.lastVerifiedAt}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] pt-1">
                  <div className="text-rose-400">
                    <span className="text-slate-500 block">Fail Condition:</span>
                    <span>{step.failCondition}</span>
                  </div>
                  <div className="text-amber-300">
                    <span className="text-slate-500 block">Recovery Protocol:</span>
                    <span>{step.recoveryAction}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: QUANTITATIVE METHODOLOGIES                         */}
      {/* ========================================================= */}
      {activeTab === 'QUANT_METHODS' && (
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {methodologies.map(m => (
              <div key={m.id} className="p-4 bg-[#060C14] border border-purple-500/30 rounded-xl space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-purple-300 font-bold text-xs">{m.id}</span>
                    <h4 className="font-bold text-white text-xs mt-0.5">{m.name}</h4>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[8px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    {m.regimeState}
                  </span>
                </div>

                <div className="p-2 bg-slate-950 rounded border border-slate-850 space-y-1">
                  <span className="text-slate-500 text-[9px] uppercase block font-bold">Mathematical Formulation:</span>
                  <div className="font-mono text-amber-300 text-[11px] font-bold break-all">
                    {m.formula}
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-1">{m.mathematicalModel}</span>
                </div>

                <div className="space-y-1.5 text-[11px]">
                  <p className="text-slate-300 leading-relaxed">
                    <b className="text-white">Institutional Logic:</b> {m.institutionalApplication}
                  </p>
                  <div className="p-2 bg-slate-900/80 rounded border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-400">Current Reading:</span>
                      <span className="font-mono text-emerald-400 font-bold">{m.currentReading}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-400">Action:</span>
                      <span className="text-cyan-300">{m.recommendedAction}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: LIVE SIGNAL GENERATION                             */}
      {/* ========================================================= */}
      {activeTab === 'SIGNALS' && (
        <div className="p-4 space-y-4">
          <div className="p-3 bg-[#060C14] border border-emerald-500/30 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Crosshair className="w-5 h-5 text-emerald-400" />
              <div>
                <span className="font-bold text-white text-xs">SYNTHETIC ARBITRAGE &amp; HIGH-ALPHA SIGNAL FEED</span>
                <p className="text-[10px] text-slate-400">Multi-Exchange Book Imbalance &middot; VPIN Microstructure &middot; Federal DAG Attestation</p>
              </div>
            </div>

            <span className="text-[10px] text-slate-400">
              Confidence Filter: <b className="text-emerald-400">&gt;88.0%</b>
            </span>
          </div>

          <div className="space-y-3">
            {signals.map(sig => {
              const isFilled = sig.status === 'FILLED';
              const isExecuting = executingSignalId === sig.id;

              return (
                <div
                  key={sig.id}
                  className="p-4 bg-[#060C14] border border-slate-800 rounded-xl space-y-3 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-cyan-300 font-bold text-sm">{sig.pair}</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black ${
                        sig.direction === 'STRONG_BUY' || sig.direction === 'BUY'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : sig.direction === 'DELTA_NEUTRAL_HEDGE'
                          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}>
                        {sig.direction.replace(/_/g, ' ')}
                      </span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                        {sig.confidencePct}% CONFIDENCE
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <span className="font-mono text-emerald-400 font-bold text-xs block">
                          +{sig.expectedAlphaBps} bps Alpha
                        </span>
                        <span className="text-[9px] text-slate-500">{sig.timeHorizon}</span>
                      </div>

                      <button
                        onClick={() => handleExecuteSignal(sig)}
                        disabled={isFilled || isExecuting}
                        className={`px-3 py-1.5 rounded-lg font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                          isFilled
                            ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-slate-950 shadow-md'
                        }`}
                      >
                        <Zap className={`w-3.5 h-3.5 ${isExecuting ? 'animate-spin' : ''}`} />
                        <span>{isFilled ? 'FILLED' : isExecuting ? 'Executing...' : '1-Click Execute'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-950 p-2 rounded-lg text-center text-[10px]">
                    <div>
                      <span className="text-slate-500 block">CEX Price</span>
                      <span className="font-bold text-white font-mono">${sig.cexPrice}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">DEX Price</span>
                      <span className="font-bold text-white font-mono">${sig.dexPrice}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Cross Spread</span>
                      <span className="font-bold text-emerald-400 font-mono">{sig.spreadBps} bps</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Suggested Sizing</span>
                      <span className="font-bold text-cyan-300 font-mono">${sig.suggestedSizeUsd.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-850 flex-wrap gap-2">
                    <div>
                      <span>Sources: </span>
                      <span className="text-slate-200">{sig.signalSources.join(' &middot; ')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>SL: <b className="text-rose-400 font-mono">${sig.stopLossUsd}</b></span>
                      <span>TP: <b className="text-emerald-400 font-mono">${sig.targetPriceUsd}</b></span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
