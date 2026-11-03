import React from 'react';
import {
  Globe,
  Shield,
  Activity,
  Layers,
  Fuel,
  Terminal,
  Cpu,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import { SovereignSeal } from './SovereignSeal';

interface MinimalHeaderProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  gasPriceGwei: number;
  gasTankUsd: number;
}

export const MinimalHeader: React.FC<MinimalHeaderProps> = ({
  currentTab,
  onSelectTab,
  gasPriceGwei,
  gasTankUsd,
}) => {
  const primaryNavItems = [
    { id: 'AEGENTIS_OS', label: '🎛️ Full Cyberdeck', tag: 'All 34 Mods' },
    { id: 'DESKTOP_DEEPMIND', label: '🧠 DeepMind Suite', tag: 'Grant $3.5M' },
    { id: 'HALO_CE_VISOR', label: '🥽 Visor HUD', tag: 'Overlay' },
    { id: 'JARVIS_BUILDER', label: '🤖 JARVIS Studio', tag: 'Kirk Voice' },
    { id: 'TRADING_COMMAND', label: 'Execution', tag: 'Live' },
    { id: 'XAMAN_REVENUE_BRIDGE', label: '⚡ Xaman (rwB7)', tag: 'XRPL DEX' },
    { id: 'SOVEREIGN_ORIGIN_NODE', label: 'Origin Node', tag: 'Primary Root' },
    { id: 'ZERO_CAP_FLYWHEEL', label: 'Gas Reserves', tag: `$${gasTankUsd.toFixed(0)}` },
    { id: 'NEXUS_REGISTRY', label: 'Skill Matrix', tag: '2,710' },
    { id: 'ANTI_TRAFFICKING_SENTINEL', label: 'Anti-Trafficking', tag: 'Armed' },
    { id: 'PORTAL_LANDING', label: 'Overview', tag: null },
  ];

  return (
    <header className="border-b border-white/[0.06] bg-[#090A0F]/80 backdrop-blur-xl sticky top-0 z-50 w-full max-w-full overflow-x-clip">
      <div className="max-w-[1720px] mx-auto px-3 sm:px-6 h-14 flex items-center justify-between gap-3">
        {/* Brand Anchor */}
        <div 
          onClick={() => onSelectTab('SOVEREIGN_ORIGIN_NODE')}
          className="flex items-center gap-2.5 cursor-pointer select-none group shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center group-hover:border-white/20 transition-colors">
            <Shield className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-semibold text-sm tracking-tight text-white">AEGENTIX</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                Sovereign Core
              </span>
            </div>
          </div>
        </div>

        {/* Clean Center Navigation (Responsive & Non-Overflowing) */}
        <nav className="hidden lg:flex items-center gap-1 bg-white/[0.02] border border-white/[0.06] p-1 rounded-xl overflow-x-auto max-w-2xl scrollbar-none shrink">
          {primaryNavItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-white/[0.08] text-white shadow-sm border border-white/[0.08]'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03] border border-transparent'
                }`}
              >
                <span>{item.label}</span>
                {item.tag && (
                  <span className={`text-[9px] font-mono px-1 py-0.2 rounded ${
                    isActive ? 'bg-white/10 text-white' : 'bg-white/[0.04] text-zinc-400'
                  }`}>
                    {item.tag}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Status Indicator */}
        <div className="flex items-center gap-2 font-mono text-xs shrink-0">
          <a
            href="/jarvis"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 transition-all cursor-pointer shadow-sm shadow-cyan-500/20 shrink-0"
            title="Open J.A.R.V.I.S. Mark-LV Tactical HUD in Fullscreen"
          >
            <span>🛡️</span>
            <span>JARVIS HUD</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>

          <a
            href="http://localhost:8765"
            target="_blank"
            rel="noreferrer"
            className="hidden xl:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-all cursor-pointer shadow-sm shadow-amber-500/20 shrink-0"
            title="Open Hermes Apollo Voice OS (:8765) with Authentic Charlie Kirk"
          >
            <span>🎙️</span>
            <span>Apollo Voice (:8765)</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>

          <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/[0.02] border border-white/[0.06] text-zinc-400 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Gas: {gasPriceGwei} Gwei</span>
          </div>

          <a
            href="http://localhost:3001/dashboard/"
            target="_blank"
            rel="noreferrer"
            className="hidden 2xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-blue-500/10 text-blue-300 border border-blue-500/20 hover:bg-blue-500/20 transition-all cursor-pointer shrink-0"
          >
            <span>Qualixar OS</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>

          <a
            href="http://localhost:8890/ui"
            target="_blank"
            rel="noreferrer"
            className="hidden 2xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all cursor-pointer shrink-0"
          >
            <span>Bastet UI</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>
        </div>
      </div>
    </header>
  );
};

export default MinimalHeader;
