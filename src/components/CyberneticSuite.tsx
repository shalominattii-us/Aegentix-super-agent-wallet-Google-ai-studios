import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Cpu, 
  Sparkles, 
  RefreshCw, 
  CheckCircle2, 
  Flame, 
  ShieldCheck, 
  Layers, 
  Activity, 
  Sliders, 
  Zap, 
  Trash2, 
  Lock, 
  Unlock, 
  Terminal, 
  GitBranch, 
  Gauge, 
  Radio, 
  Workflow, 
  Fingerprint,
  ArrowRight,
  TrendingUp,
  RotateCcw,
  Search,
  Copy,
  Check,
  ExternalLink,
  Folder,
  FileCode,
  Play,
  Ship
} from 'lucide-react';
import { 
  CYBERNETICS_CORE_BASE, 
  CYBERNETICS_CORE_CATALOG, 
  CyberneticsCoreItem 
} from '../data/cyberneticsCoreCatalog';

interface CyberneticSubsystem {
  id: string;
  name: string;
  category: 'AUTONOMIC' | 'HOMEOSTASIS' | 'HYGIENE' | 'ACTUATION';
  healthScore: number;
  status: 'OPTIMAL' | 'DEGRADED' | 'HEALING';
  lastCycleMs: number;
  autoRemediationsCount: number;
  entropyBps: number;
}

interface CyberneticEngineState {
  isAutonomousActive: boolean;
  homeostasisPurityPct: number;
  cyberneticPhase: 'PERCEPTION' | 'HOMEOSTASIS' | 'DECISION' | 'ACTUATION' | 'ENTROPY_REDUCTION';
  cycleRateHz: number;
  totalEntropyPurgedBytes: number;
  activeRemediationRules: number;
  lastAutonomousCycleAt: string;
  subsystems: CyberneticSubsystem[];
  telemetryLogs: Array<{
    id: string;
    timestamp: string;
    type: 'HYGIENIC_PURGE' | 'HOMEOSTATIC_CORRECTION' | 'AUTONOMIC_DECISION' | 'ENTROPY_RESET';
    description: string;
    actionResult: string;
    deltaEntropy: number;
  }>;
}

interface CyberneticSuiteProps {
  onNotify?: (message: string, type: 'ALERT' | 'SUCCESS' | 'INFO') => void;
  onOpenSovereignCommand?: () => void;
}

export const CyberneticSuite: React.FC<CyberneticSuiteProps> = ({ onNotify, onOpenSovereignCommand }) => {
  const [state, setState] = useState<CyberneticEngineState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTogglingAutonomy, setIsTogglingAutonomy] = useState(false);
  const [isPurgingHygiene, setIsPurgingHygiene] = useState(false);
  const [activeCycleTab, setActiveCycleTab] = useState<'OVERVIEW' | 'SUBSYSTEMS' | 'HOMEOSTASIS' | 'TELEMETRY'>('OVERVIEW');
  const [coreCategoryFilter, setCoreCategoryFilter] = useState<string>('ALL');
  const [coreSearchQuery, setCoreSearchQuery] = useState<string>('');
  const [copiedItemPath, setCopiedItemPath] = useState<string | null>(null);
  const [executingItemName, setExecutingItemName] = useState<string | null>(null);

  const handleCopyPath = (path: string) => {
    navigator.clipboard.writeText(path);
    setCopiedItemPath(path);
    setTimeout(() => setCopiedItemPath(null), 2000);
    if (onNotify) onNotify(`Copied Path: "${path}"`, 'SUCCESS');
  };

  const handleExecuteScript = async (item: CyberneticsCoreItem) => {
    setExecutingItemName(item.name);
    try {
      const res = await fetch('/api/cybernetics-core/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemName: item.name, scriptPath: item.fullPath }),
      });
      const data = await res.json();
      if (res.ok) {
        if (onNotify) onNotify(data.message || `Executed ${item.name}`, 'SUCCESS');
      } else {
        if (onNotify) onNotify(`Execution error for ${item.name}`, 'ALERT');
      }
    } catch (err: any) {
      if (onNotify) onNotify(`Execution failed: ${err.message}`, 'ALERT');
    } finally {
      setTimeout(() => setExecutingItemName(null), 1000);
    }
  };

  const filteredCoreItems = CYBERNETICS_CORE_CATALOG.filter((item) => {
    const matchesCategory = coreCategoryFilter === 'ALL' || item.category === coreCategoryFilter;
    const q = coreSearchQuery.toLowerCase().trim();
    const matchesSearch = !q ||
      item.name.toLowerCase().includes(q) ||
      item.relativePath.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.type.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const fetchCybernetics = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/cybernetics/state');
      if (res.ok) {
        const json = await res.json();
        setState(json.cyberneticState);
      }
    } catch (err: any) {
      console.error('Failed to load cybernetic state:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCybernetics();
    const interval = setInterval(fetchCybernetics, 3500);
    return () => clearInterval(interval);
  }, []);

  const handleToggleAutonomy = async () => {
    setIsTogglingAutonomy(true);
    try {
      const res = await fetch('/api/cybernetics/toggle-autonomy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const json = await res.json();
      if (json.success) {
        setState(json.cyberneticState);
        const mode = json.isAutonomousActive ? 'ENGAGED (AUTONOMOUS HARMONY)' : 'PAUSED (MANUAL COUPLING)';
        if (onNotify) onNotify(`Cybernetic Feedback Control Loop ${mode}`, json.isAutonomousActive ? 'SUCCESS' : 'INFO');
      }
    } catch (err: any) {
      if (onNotify) onNotify(`Toggle failed: ${err.message}`, 'ALERT');
    } finally {
      setIsTogglingAutonomy(false);
    }
  };

  const handleHygienicSweep = async () => {
    setIsPurgingHygiene(true);
    try {
      const res = await fetch('/api/cybernetics/run-hygiene-sweep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const json = await res.json();
      if (json.success) {
        setState(json.cyberneticState);
        if (onNotify) {
          onNotify(
            `Hygienic Sweep Complete: Purged ${(json.bytesPurged / 1048576).toFixed(2)} MB entropy. Homeostasis purity: ${json.purityPct}%.`,
            'SUCCESS'
          );
        }
      }
    } catch (err: any) {
      if (onNotify) onNotify(`Hygienic sweep error: ${err.message}`, 'ALERT');
    } finally {
      setIsPurgingHygiene(false);
    }
  };

  return (
    <div className="bg-[#0B0F17] border border-slate-800 rounded-xl overflow-hidden shadow-2xl space-y-4 font-mono text-xs">
      {/* Header Banner */}
      <div className="p-4 sm:p-5 border-b border-slate-800 bg-gradient-to-r from-emerald-950/40 via-[#0B0F17] to-cyan-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 via-emerald-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
            <Workflow className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-wide uppercase">
                CYBERNETIC AUTONOMOUS &amp; HYGIENIC ENGINE
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-black border flex items-center gap-1 bg-cyan-500/20 text-cyan-300 border-cyan-500/40">
                <ShieldCheck className="w-3 h-3 text-cyan-400" />
                GEMINI CYBER VERSION: 4.0-ARGON (FAIRWIND)
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border flex items-center gap-1 ${
                state?.isAutonomousActive 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${state?.isAutonomousActive ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
                {state?.isAutonomousActive ? 'AUTONOMOUS LOOP ENGAGED' : 'AUTONOMY PAUSED'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Closed-Loop Homeostatic Equilibrium &middot; Gemini Cyber Fairwind Protection &middot; Zero-Entropy Memory Hygiene
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleHygienicSweep}
            disabled={isPurgingHygiene}
            className="px-3.5 py-1.5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white rounded font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-600/20 cursor-pointer disabled:opacity-50"
            title="Purge stale memory entropy and garbage collect orphan feeds"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isPurgingHygiene ? 'animate-spin' : ''}`} />
            <span>{isPurgingHygiene ? 'Purging Entropy...' : 'Run Hygienic Sweep'}</span>
          </button>

          <button
            onClick={handleToggleAutonomy}
            disabled={isTogglingAutonomy}
            className={`px-3.5 py-1.5 rounded font-bold text-xs flex items-center gap-1.5 shadow-lg transition-all cursor-pointer disabled:opacity-50 ${
              state?.isAutonomousActive
                ? 'bg-amber-600/90 hover:bg-amber-500 text-white shadow-amber-600/20'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
            }`}
          >
            {state?.isAutonomousActive ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
            <span>{state?.isAutonomousActive ? 'Pause Autonomy' : 'Engage Autonomous Loop'}</span>
          </button>

          <button
            onClick={fetchCybernetics}
            disabled={isLoading}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 rounded transition-all cursor-pointer"
            title="Refresh Cybernetic Telemetry"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Cybernetic Feedback Cycle Diagram */}
      <div className="px-4">
        <div className="p-3.5 bg-[#070A0F] border border-slate-800 rounded-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-slate-200 text-xs uppercase flex items-center gap-2">
              <Radio className="w-3.5 h-3.5 text-cyan-400" />
              <span>Cybernetic Sensory-Actuator Feedback Cycle (Wiener-Ashby Homeostasis)</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-bold">
              Cycle Rate: {state?.cycleRateHz || 4.0} Hz (Real-Time)
            </span>
          </div>

          {/* 5-Phase Cybernetic Ring / Pipeline */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-center text-[10px]">
            <div className="p-2.5 bg-slate-900/80 border border-cyan-500/40 rounded-lg relative overflow-hidden">
              <span className="text-cyan-400 font-bold block text-xs">1. SENSORY PERCEPTION</span>
              <span className="text-slate-400 text-[9px] mt-0.5 block">Binance, Uniswap, Drive &amp; Gmail inputs</span>
              <div className="mt-1.5 text-slate-500 text-[9px]">Latency: 1.2ms</div>
            </div>

            <div className="p-2.5 bg-slate-900/80 border border-emerald-500/40 rounded-lg relative overflow-hidden">
              <span className="text-emerald-400 font-bold block text-xs">2. HOMEOSTASIS GATE</span>
              <span className="text-slate-400 text-[9px] mt-0.5 block">DEX/CEX 50:50 parity &amp; 3.5% VaR barrier</span>
              <div className="mt-1.5 text-emerald-300 font-bold text-[9px]">Purity: {state?.homeostasisPurityPct}%</div>
            </div>

            <div className="p-2.5 bg-slate-900/80 border border-purple-500/40 rounded-lg relative overflow-hidden">
              <span className="text-purple-400 font-bold block text-xs">3. AUTONOMIC DECISION</span>
              <span className="text-slate-400 text-[9px] mt-0.5 block">Gemini 4 Argon Cyber (1M Context)</span>
              <div className="mt-1.5 text-cyan-300 font-bold text-[9px]">Fairwind Protected</div>
            </div>

            <div className="p-2.5 bg-slate-900/80 border border-rose-500/40 rounded-lg relative overflow-hidden">
              <span className="text-rose-400 font-bold block text-xs">4. ATOMIC ACTUATION</span>
              <span className="text-slate-400 text-[9px] mt-0.5 block">Flash loan routing, rebalances &amp; auto-hedges</span>
              <div className="mt-1.5 text-slate-500 text-[9px]">Tx Hash Verified</div>
            </div>

            <div className="p-2.5 bg-slate-900/80 border border-amber-500/40 rounded-lg relative overflow-hidden">
              <span className="text-amber-400 font-bold block text-xs">5. HYGIENIC ENTROPY PURGE</span>
              <span className="text-slate-400 text-[9px] mt-0.5 block">Continuous garbage collector &amp; cache sweep</span>
              <div className="mt-1.5 text-amber-300 font-bold text-[9px]">
                {((state?.totalEntropyPurgedBytes || 0) / 1048576).toFixed(1)} MB Purged
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cybernetic Key Performance Indicators */}
      <div className="px-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-slate-900/70 border border-slate-800 rounded-lg">
          <span className="text-[10px] text-slate-500 block">HOMEOSTATIC PURITY</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-base font-bold text-emerald-400">
              {state?.homeostasisPurityPct}%
            </span>
          </div>
          <span className="text-[9px] text-emerald-500 block mt-1">Zero thermodynamic drift</span>
        </div>

        <div className="p-3 bg-slate-900/70 border border-slate-800 rounded-lg">
          <span className="text-[10px] text-slate-500 block">ENTROPY REMEDIATIONS</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-base font-bold text-cyan-400">
              {state?.subsystems.reduce((acc, s) => acc + s.autoRemediationsCount, 0)}
            </span>
            <span className="text-[10px] text-slate-400">Autonomous actions</span>
          </div>
          <span className="text-[9px] text-slate-500 block mt-1">Self-healing feedback active</span>
        </div>

        <div className="p-3 bg-slate-900/70 border border-slate-800 rounded-lg">
          <span className="text-[10px] text-slate-500 block">MEMORY HYGIENE FOOTPRINT</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-base font-bold text-teal-300">
              {((state?.totalEntropyPurgedBytes || 0) / 1048576).toFixed(2)} MB
            </span>
          </div>
          <span className="text-[9px] text-teal-500 block mt-1">Garbage collected</span>
        </div>

        <div className="p-3 bg-slate-900/70 border border-slate-800 rounded-lg">
          <span className="text-[10px] text-slate-500 block">ACTIVE REMEDIATION GATES</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-base font-bold text-purple-400">
              {state?.activeRemediationRules} Rules
            </span>
            <span className="text-[10px] text-emerald-400 font-bold">100% Armed</span>
          </div>
          <span className="text-[9px] text-slate-500 block mt-1">Non-human interlocks</span>
        </div>
      </div>

      {/* Cybernetic Subsystem Matrix & Autonomous Telemetry Stream */}
      <div className="px-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Subsystems Matrix (7 cols) */}
        <div className="lg:col-span-7 p-3.5 bg-[#070A0F] border border-slate-800 rounded-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <span className="font-bold text-slate-200 text-xs uppercase flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              <span>Cybernetic Subsystems &amp; Self-Healing Units ({state?.subsystems.length || 0})</span>
            </span>
            <span className="text-[10px] text-slate-400">All Nodes Homeostatic</span>
          </div>

          <div className="space-y-2">
            {state?.subsystems.map((sub) => (
              <div
                key={sub.id}
                className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-[11px]"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-xs">{sub.name}</span>
                    <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded text-[9px] font-bold">
                      {sub.status}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-3">
                    <span>Category: <b className="text-cyan-400">{sub.category}</b></span>
                    <span>·</span>
                    <span>Loop: <b className="text-slate-200">{sub.lastCycleMs}ms</b></span>
                    <span>·</span>
                    <span>Entropy: <b className="text-amber-400">{sub.entropyBps} bps</b></span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <div className="text-right">
                    <span className="text-emerald-400 font-bold block">{sub.healthScore}% Health</span>
                    <span className="text-[9px] text-slate-500">{sub.autoRemediationsCount} auto-fixes</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Autonomous Feedback & Hygienic Telemetry Stream (5 cols) */}
        <div className="lg:col-span-5 p-3.5 bg-[#070A0F] border border-slate-800 rounded-xl space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <span className="font-bold text-slate-200 text-xs uppercase flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>Autonomous Feedback &amp; Hygiene Stream</span>
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>

            <div className="space-y-2 max-h-[380px] overflow-y-auto">
              {state?.telemetryLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-2.5 bg-slate-900/60 border border-slate-800 rounded-lg space-y-1 text-[10px]"
                >
                  <div className="flex items-center justify-between text-slate-400">
                    <span className={`px-1.5 py-0.2 rounded font-bold text-[9px] ${
                      log.type === 'HYGIENIC_PURGE' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                      log.type === 'HOMEOSTATIC_CORRECTION' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    }`}>
                      {log.type}
                    </span>
                    <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-slate-200 text-[11px] leading-relaxed">
                    {log.description}
                  </p>
                  <div className="text-emerald-400 font-semibold text-[10px]">
                    ↳ {log.actionResult}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-2.5 bg-slate-900/80 border border-slate-800 rounded-lg text-[10px] text-slate-400 mt-2">
            <span className="text-cyan-300 font-bold block mb-0.5">Cybernetic Autonomic Principle:</span>
            System acts continuously without manual intervention. State entropy is automatically cleansed every 4 seconds.
          </div>
        </div>
      </div>

      {/* AEGENTIX-CYBERNETICS-CORE WORKSTATION REPOSITORY DIRECTORY */}
      <div className="px-4 pb-6 space-y-4">
        <div className="p-4 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40 border border-cyan-500/40 rounded-xl space-y-3 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <Folder className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                  AEGENTIX-CYBERNETICS-CORE Workstation Repository
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {CYBERNETICS_CORE_CATALOG.length} INDEXED ARTIFACTS
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <code className="text-[11px] text-cyan-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 font-mono select-all">
                  {CYBERNETICS_CORE_BASE}
                </code>
                <button
                  onClick={() => handleCopyPath(CYBERNETICS_CORE_BASE)}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[10px] font-bold flex items-center gap-1 border border-slate-700 transition-colors cursor-pointer"
                  title="Copy root directory path"
                >
                  {copiedItemPath === CYBERNETICS_CORE_BASE ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedItemPath === CYBERNETICS_CORE_BASE ? 'Copied Root!' : 'Copy Root Path'}</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleExecuteScript(CYBERNETICS_CORE_CATALOG.find(c => c.name === 'bring_everything_online.py') || CYBERNETICS_CORE_CATALOG[0])}
                disabled={executingItemName === 'bring_everything_online.py'}
                className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-slate-950 font-black rounded-lg text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>{executingItemName === 'bring_everything_online.py' ? 'Bootstrapping...' : '⚡ Bring Everything Online'}</span>
              </button>
            </div>
          </div>

          {/* Filter Pills & Live Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
              {(
                [
                  { id: 'ALL', label: `All (${CYBERNETICS_CORE_CATALOG.length})` },
                  { id: 'OMNICHAIN_SOLVER', label: 'Omnichain Solver' },
                  { id: 'SECURITY_INTELLIGENCE', label: 'Security Intel' },
                  { id: 'XRPL_DEFI', label: 'XRPL & DeFi' },
                  { id: 'AGENT_SWARM', label: 'Agent Swarm' },
                  { id: 'HARDWARE_ROBOTICS', label: 'Hardware & Nano-TXs' },
                  { id: 'CYBERCORE_DEFENSE', label: 'CyberCore Defense' },
                  { id: 'MISSION_CONTROL', label: 'Mission Control' },
                  { id: 'GOVERNANCE_PATENTS', label: 'Governance & Patents' },
                  { id: 'DATA_BACKUPS', label: 'Data Backups' }
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setCoreCategoryFilter(tab.id)}
                  className={`px-2.5 py-1 rounded-lg font-bold border transition-all cursor-pointer ${
                    coreCategoryFilter === tab.id
                      ? 'bg-cyan-600 border-cyan-400 text-slate-950 font-black shadow-sm'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search scripts, xbox, xaman, drone..."
                value={coreSearchQuery}
                onChange={(e) => setCoreSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Catalog Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredCoreItems.map((item) => {
              const isCopied = copiedItemPath === item.fullPath;
              const isRunning = executingItemName === item.name;

              return (
                <div
                  key={item.name}
                  className="p-3 bg-slate-950/80 border border-slate-800 hover:border-cyan-500/50 rounded-xl space-y-2 transition-all flex flex-col justify-between group shadow-sm hover:shadow-cyan-500/5"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <FileCode className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span className="font-bold text-white text-xs truncate max-w-[170px]" title={item.name}>
                          {item.name}
                        </span>
                      </div>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider shrink-0 ${
                          item.status === 'ONLINE'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : item.status === 'ENCLAVE_READY'
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                            : item.status === 'DOCUMENTED'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-900 space-y-1.5">
                    <div className="text-[9px] text-slate-500 font-mono truncate select-all" title={item.fullPath}>
                      {item.fullPath}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.name === 'cybergenetic-starship' && onOpenSovereignCommand && (
                        <button
                          onClick={onOpenSovereignCommand}
                          className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 border border-amber-500/40 text-[10px] font-black flex items-center gap-1 transition-all cursor-pointer shadow-xs shrink-0"
                          title="Open Sovereign Command 48m Autonomous Expedition Platform"
                        >
                          <Ship className="w-3 h-3 text-amber-400" />
                          <span>Launch Vessel</span>
                        </button>
                      )}
                      <button
                        onClick={() => handleCopyPath(item.fullPath)}
                        className="flex-1 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        title="Copy absolute workstation path"
                      >
                        {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{isCopied ? 'Copied Path!' : 'Copy Path'}</span>
                      </button>

                      {item.type === 'SCRIPT' && (
                        <button
                          disabled={isRunning}
                          onClick={() => handleExecuteScript(item)}
                          className="px-2.5 py-1 rounded bg-cyan-600/30 hover:bg-cyan-600 border border-cyan-500/40 text-cyan-200 hover:text-slate-950 font-bold text-[10px] flex items-center gap-1 transition-all cursor-pointer disabled:opacity-50"
                          title="Execute in local workstation enclave"
                        >
                          <Play className={`w-2.5 h-2.5 ${isRunning ? 'animate-spin' : 'fill-current'}`} />
                          <span>{isRunning ? 'Running...' : 'Run'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
