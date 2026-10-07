import React from 'react';
import { Cpu, ShieldCheck, Zap, AlertTriangle, Key, Wallet, Sparkles, Globe, BookOpen, Maximize2, Minimize2, Monitor } from 'lucide-react';
import { SovereignSeal } from './SovereignSeal';
import { AuthIndicator } from './AuthIndicator';
import { LLMStatus } from '../types';

interface HeaderProps {
  isAutopilot: boolean;
  onToggleAutopilot: () => void;
  onOpenWalletModal: () => void;
  onOpenPromptModal: () => void;
  onOpenTocModal?: () => void;
  onTriggerStressTest: () => void;
  isStressTesting: boolean;
  connectedWallet: { address: string; type: string } | null;
  gasPriceGwei: number;
  lastSyncTime: string;
  llmStatus?: LLMStatus | null;
  isExpandedCanvas?: boolean;
  onToggleExpandedCanvas?: () => void;
  onOpenDeviceMapping?: () => void;
  onOpenSpaceBunny?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isAutopilot,
  onToggleAutopilot,
  onOpenWalletModal,
  onOpenPromptModal,
  onOpenTocModal,
  onTriggerStressTest,
  isStressTesting,
  connectedWallet,
  gasPriceGwei,
  lastSyncTime,
  llmStatus,
  isExpandedCanvas,
  onToggleExpandedCanvas,
  onOpenDeviceMapping,
  onOpenSpaceBunny,
}) => {
  return (
    <header className="border-b border-slate-800/80 bg-[#0B0F17]/90 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-6 py-2.5">
      <div className="flex items-center justify-between gap-4">
        {/* Zone 1: Brand Mark with Sovereign Seal */}
        <div className="flex items-center gap-3 shrink-0">
          <SovereignSeal size={42} />
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold tracking-tight text-white uppercase">Aegentix</span>
              <span className="text-xs text-cyan-400 font-medium tracking-wide">Sovereign System</span>
              <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded text-[9px] font-bold">
                CANONICAL
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono hidden sm:block">
              Governance &middot; Integrity &middot; Continuity &middot; Cross-Exchange Orchestrator
            </p>
          </div>
        </div>

        {/* Zone 2: Navigation & Telemetry */}
        <div className="hidden md:flex items-center gap-4 text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300">Gas: {gasPriceGwei} Gwei</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>actor-001 [SOVEREIGN]</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1.5" title={llmStatus?.cooldownReason || 'Autonomous decision engine'}>
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span className="text-slate-300">
              {llmStatus?.inCooldown
                ? 'Engine: Sovereign Algo Core'
                : 'Engine: Gemini 3.8 / Sovereign'}
            </span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1.5" title="Moltbook AI-Agent Network (m/trading, m/crypto)">
            <Globe className="w-3 h-3 text-indigo-400" />
            <span className="text-slate-300">
              Moltbook: <span className="text-emerald-400 font-semibold">Registered</span>
            </span>
          </div>
        </div>

        {/* Zone 3: Actions & Auth Status */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Modular Auth Indicator for Google OAuth session cookie */}
          <AuthIndicator />

          {/* Autopilot Quick Toggle */}
          <button
            onClick={onToggleAutopilot}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-mono font-medium transition-all ${
              isAutopilot
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/60'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isAutopilot ? 'bg-cyan-400 animate-ping' : 'bg-slate-500'}`} />
            <span>{isAutopilot ? 'AUTOPILOT ON' : 'STANDBY'}</span>
          </button>

          {/* Table of Contents / System Index */}
          <button
            onClick={onOpenTocModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 hover:from-cyan-500/30 hover:to-indigo-500/30 text-cyan-300 border border-cyan-500/40 rounded text-xs font-mono font-semibold transition-all shadow-sm"
            title="Open Table of Contents (34 Subsystems Index)"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Table of Contents</span>
          </button>

          {/* Canvas Focus / Triage View Toggle */}
          {onToggleExpandedCanvas && (
            <button
              onClick={onToggleExpandedCanvas}
              className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-medium transition-all border ${
                isExpandedCanvas
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm shadow-cyan-500/20 font-bold'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/60'
              }`}
              title={isExpandedCanvas ? 'Return to 3-column triage layout' : 'Expand active subsystem canvas to full width'}
            >
              {isExpandedCanvas ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Triage View</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Focus Canvas</span>
                </>
              )}
            </button>
          )}

          {/* Prompt Template Inspector */}
          <button
            onClick={onOpenPromptModal}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/70 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 rounded text-xs font-mono transition-colors"
            title="Inspect Heretic LLM Prompt Template"
          >
            <Key className="w-3.5 h-3.5 text-amber-400" />
            <span>Inference Prompt</span>
          </button>

          {/* Flash Crash Stress Test */}
          <button
            onClick={onTriggerStressTest}
            disabled={isStressTesting}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded text-xs font-mono transition-colors disabled:opacity-50"
            title="Simulate sudden market crash to test autonomous stop-loss and hedging"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">{isStressTesting ? 'Simulating...' : 'Stress Test'}</span>
          </button>

          {/* Space Bunny Alpha AI Chat Quick Access */}
          {onOpenSpaceBunny && (
            <button
              onClick={onOpenSpaceBunny}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-fuchsia-500/20 via-purple-500/20 to-cyan-500/20 hover:from-fuchsia-500/30 hover:to-cyan-500/30 text-fuchsia-300 border border-fuchsia-500/40 rounded text-xs font-mono font-semibold transition-all shadow-sm shadow-fuchsia-950/30"
              title="Open Space Bunny Alpha Live Chat (OpenRouter / GPT-4o)"
            >
              <span className="text-sm">🐰</span>
              <span className="hidden sm:inline">Space Bunny Chat</span>
              <span className="sm:hidden">Space Bunny</span>
              <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 animate-pulse" />
            </button>
          )}

          {/* Desktop & Device Sandbox Link */}
          {onOpenDeviceMapping && (
            <button
              onClick={onOpenDeviceMapping}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-blue-500/20 hover:from-emerald-500/30 hover:to-blue-500/30 text-emerald-300 border border-emerald-500/40 rounded text-xs font-mono font-semibold transition-all shadow-sm"
              title="Map AI Studio sandbox container to local Desktop / Device"
            >
              <Monitor className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Desktop &amp; Device</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </button>
          )}

          {/* Wallet / API Connection */}
          <button
            onClick={onOpenWalletModal}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-white text-slate-950 hover:bg-cyan-300 rounded text-xs font-bold transition-all shadow-sm"
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>
              {connectedWallet
                ? `${connectedWallet.address.slice(0, 6)}...${connectedWallet.address.slice(-4)}`
                : 'Connect Wallet'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
