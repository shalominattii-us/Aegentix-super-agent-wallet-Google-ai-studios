import React from 'react';
import { 
  Shield, 
  Activity, 
  Sliders, 
  Sparkles, 
  Globe, 
  CheckCircle2, 
  AlertCircle,
  FileCode,
  Zap,
  Lock,
  Trophy
} from 'lucide-react';
import { SecurityPostures, ExchangeBridge, ComplianceBlock } from '../types';

interface AgentSidebarProps {
  isAutopilot: boolean;
  onToggleAutopilot: () => void;
  strategy: string;
  onSelectStrategy: (s: string) => void;
  maxSlippage: number;
  onChangeMaxSlippage: (val: number) => void;
  gasLimitGwei: number;
  onChangeGasLimit: (val: number) => void;
  cycleIntervalSeconds: number;
  onChangeCycleInterval: (val: number) => void;
  onRunAutonomousCycle: () => void;
  isGeneratingSignal: boolean;
  onFormulateTopSignals?: () => void;
  isFormulatingTopSignals?: boolean;
  securityPostures: SecurityPostures;
  exchangeBridges: ExchangeBridge[];
  latestComplianceBlock?: ComplianceBlock;
  onOpenPromptModal: () => void;
}

export const AgentSidebar: React.FC<AgentSidebarProps> = ({
  isAutopilot,
  onToggleAutopilot,
  strategy,
  onSelectStrategy,
  maxSlippage,
  onChangeMaxSlippage,
  gasLimitGwei,
  onChangeGasLimit,
  cycleIntervalSeconds,
  onChangeCycleInterval,
  onRunAutonomousCycle,
  isGeneratingSignal,
  onFormulateTopSignals,
  isFormulatingTopSignals,
  securityPostures,
  exchangeBridges,
  latestComplianceBlock,
  onOpenPromptModal,
}) => {
  return (
    <aside className="w-full lg:w-80 shrink-0 flex flex-col gap-4 font-mono text-xs">
      {/* SECTION 1: Cybernetic Autonomous Controls */}
      <div className="bg-[#0D121D] border border-slate-800 rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold tracking-wide uppercase text-[11px]">
            <Sliders className="w-3.5 h-3.5" />
            <span>Cybernetic Control</span>
          </div>
          <span className="text-[10px] text-slate-400">Heretic v3.5</span>
        </div>

        {/* Autopilot Master Switch */}
        <div className="flex items-center justify-between p-2.5 bg-slate-900/60 rounded border border-slate-800 mb-3">
          <div>
            <div className="text-slate-200 font-medium text-xs">Autonomous Mode</div>
            <div className="text-[10px] text-slate-400">Self-triggers research & execution</div>
          </div>
          <button
            onClick={onToggleAutopilot}
            className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
              isAutopilot ? 'bg-cyan-500' : 'bg-slate-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                isAutopilot ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Strategy Selector */}
        <div className="space-y-1.5 mb-3">
          <label className="text-[10px] text-slate-400 uppercase tracking-wider">Trading Strategy</label>
          <select
            value={strategy}
            onChange={(e) => onSelectStrategy(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-cyan-400"
          >
            <option value="arbitrage_balanced">arbitrage_balanced (DEX &lt;-&gt; CEX)</option>
            <option value="cross_dex_rebalance">cross_dex_rebalance (Pool Equalizer)</option>
            <option value="triangular_hedging">triangular_hedging (Risk Neutral)</option>
            <option value="momentum_alpha">momentum_alpha (RSI / Spread Divergence)</option>
          </select>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <div className="flex justify-between text-[10px] text-slate-400 mb-1">
              <span>Max Slippage</span>
              <span className="text-cyan-400">{maxSlippage}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="2.0"
              step="0.05"
              value={maxSlippage}
              onChange={(e) => onChangeMaxSlippage(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 h-1 bg-slate-800 rounded appearance-none cursor-pointer"
            />
          </div>
          <div>
            <div className="flex justify-between text-[10px] text-slate-400 mb-1">
              <span>Gas Ceiling</span>
              <span className="text-amber-400">{gasLimitGwei} Gwei</span>
            </div>
            <input
              type="range"
              min="10"
              max="60"
              step="5"
              value={gasLimitGwei}
              onChange={(e) => onChangeGasLimit(parseInt(e.target.value))}
              className="w-full accent-amber-400 h-1 bg-slate-800 rounded appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Interval Selector */}
        <div className="flex items-center justify-between text-[10px] text-slate-400 mb-3">
          <span>Pulse Interval:</span>
          <div className="flex items-center gap-1">
            {[5, 15, 30, 60].map((sec) => (
              <button
                key={sec}
                onClick={() => onChangeCycleInterval(sec)}
                className={`px-2 py-0.5 rounded text-[10px] transition-colors ${
                  cycleIntervalSeconds === sec
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-300'
                }`}
              >
                {sec}s
              </button>
            ))}
          </div>
        </div>

        {/* Action Triggers */}
        <div className="space-y-2">
          {onFormulateTopSignals && (
            <button
              onClick={onFormulateTopSignals}
              disabled={isFormulatingTopSignals}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-bold text-xs rounded transition-all shadow-md shadow-amber-500/20 disabled:opacity-50"
            >
              {isFormulatingTopSignals ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Formulating Top Signals (LIA)...</span>
                </>
              ) : (
                <>
                  <Trophy className="w-3.5 h-3.5 fill-current" />
                  <span>Formulate Top Signals (LIA Engine)</span>
                </>
              )}
            </button>
          )}

          {/* Manual Trigger Button */}
          <button
            onClick={onRunAutonomousCycle}
            disabled={isGeneratingSignal}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-black font-semibold text-xs rounded transition-all shadow-md shadow-cyan-500/10 disabled:opacity-50"
          >
            {isGeneratingSignal ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span>Scanning Markets & Synthesizing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Force Autonomous Market Scan</span>
              </>
            )}
          </button>
        </div>

        {/* Prompt Template Link */}
        <div className="mt-2.5 text-center">
          <button
            onClick={onOpenPromptModal}
            className="text-[10px] text-slate-400 hover:text-cyan-400 underline underline-offset-2 flex items-center justify-center gap-1 mx-auto"
          >
            <FileCode className="w-3 h-3" />
            <span>View Heretic Prompt Evaluation Formula</span>
          </button>
        </div>
      </div>

      {/* SECTION 2: Exchange Bridges */}
      <div className="bg-[#0D121D] border border-slate-800 rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold tracking-wide uppercase text-[11px]">
            <Globe className="w-3.5 h-3.5" />
            <span>Exchange Bridges</span>
          </div>
          <span className="text-[10px] text-emerald-400">All Connected</span>
        </div>

        <div className="space-y-2">
          {exchangeBridges.map((bridge) => (
            <div
              key={bridge.name}
              className="flex items-center justify-between p-2 bg-slate-900/50 rounded border border-slate-800/60"
            >
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-slate-300 font-medium text-xs">{bridge.name}</span>
              </div>
              <div className="flex items-center gap-2 text-[10px]">
                <span className="text-slate-400 font-mono">{bridge.latencyMs}ms</span>
                <span className="text-slate-400 border border-slate-700 rounded px-1.5 py-0.2 text-[9px]">
                  {bridge.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: Security Engine & Nanotransaction Compliance */}
      <div className="bg-[#0D121D] border border-slate-800 rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold tracking-wide uppercase text-[11px]">
            <Shield className="w-3.5 h-3.5" />
            <span>Security & Compliance</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Port 9001 Gate</span>
        </div>

        {/* 5 Indicators */}
        <div className="space-y-1.5 mb-3">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">
            5 Behavioral Invariants
          </div>
          {securityPostures.activeIndicators.map((ind) => (
            <div
              key={ind.name}
              className="flex items-center justify-between p-1.5 bg-slate-900/40 rounded border border-slate-800/40 text-[10px]"
            >
              <span className="text-slate-300">{ind.name}</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-cyan-400">{ind.value}</span>
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              </div>
            </div>
          ))}
        </div>

        {/* Compliance Block Head */}
        {latestComplianceBlock && (
          <div className="p-2 bg-emerald-500/5 border border-emerald-500/20 rounded text-[10px]">
            <div className="flex items-center justify-between text-emerald-400 font-semibold mb-1">
              <span>HMAC Hash Chain</span>
              <span>Block #{latestComplianceBlock.height}</span>
            </div>
            <div className="text-slate-400 font-mono truncate text-[9px]">
              Head: {latestComplianceBlock.hash}
            </div>
            <div className="flex items-center justify-between mt-1 text-[9px] text-slate-400">
              <span>Actor: {latestComplianceBlock.actorId}</span>
              <span className="text-emerald-400 font-bold">Score: {latestComplianceBlock.integrityScore}/100</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
