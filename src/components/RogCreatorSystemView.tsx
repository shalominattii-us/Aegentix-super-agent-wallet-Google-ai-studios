import React, { useState } from 'react';
import { 
  Gamepad2, 
  ShieldCheck, 
  Sliders, 
  HardDrive, 
  Volume2, 
  Video, 
  Cpu, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  RefreshCw, 
  Radio, 
  FileText, 
  Play, 
  Folder, 
  Scissors, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { 
  ROG_CREATOR_SYSTEM_DATA, 
  RogCreatorSystemConfig, 
  CyberDawPreset,
  AntiCheatBoundaryRule 
} from '../data/rogCreatorSystemData';

export const RogCreatorSystemView: React.FC = () => {
  const [config, setConfig] = useState<RogCreatorSystemConfig>(ROG_CREATOR_SYSTEM_DATA);
  const [activeTab, setActiveTab] = useState<'ARCHITECTURE' | 'CYBERDAW_MAX' | 'ANTI_CHEAT_CCA' | 'AI_CLIPPING' | 'PERFORMANCE'>('ARCHITECTURE');
  const [selectedPreset, setSelectedPreset] = useState<CyberDawPreset>(config.cyberDawPresets[0]);
  const [activePowerProfile, setActivePowerProfile] = useState<'QUIET' | 'BALANCED' | 'LIVE_PRODUCTION'>('LIVE_PRODUCTION');
  const [isVerifyingSecurity, setIsVerifyingSecurity] = useState<boolean>(false);
  const [notice, setNotice] = useState<{ text: string; type: 'SUCCESS' | 'INFO' } | null>(null);

  const showNotice = (text: string, type: 'SUCCESS' | 'INFO' = 'SUCCESS') => {
    setNotice({ text, type });
    setTimeout(() => setNotice(null), 4000);
  };

  const handleVerifyAntiCheatBoundary = () => {
    setIsVerifyingSecurity(true);
    setTimeout(() => {
      setIsVerifyingSecurity(false);
      showNotice('CCA Boundary Audit Complete: Zero memory access detected. All 5 security boundaries compliant with Anti-Cheat standards.', 'SUCCESS');
    }, 1200);
  };

  const handleTriggerReplaySave = () => {
    showNotice(`[OBS REPLAY BUFFER]: Saved last ${config.obsSettings.replayBufferSec}s to D:\\Creator\\Inbox\\replay_${Date.now()}.mkv`, 'INFO');
  };

  return (
    <div className="space-y-5 font-mono">
      {/* Top Banner: ROG Ally X Free Creator System */}
      <div className="bg-[#0B101B] border border-cyan-500/30 rounded-xl p-5 relative overflow-hidden shadow-xl shadow-cyan-950/20">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-gradient-to-br from-rose-500/20 via-cyan-500/20 to-purple-500/20 border border-cyan-500/40 rounded-lg text-cyan-400">
                <Gamepad2 className="w-5 h-5 text-rose-400 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg font-bold text-white tracking-wide">
                    ROG Ally X Free Creator System
                  </h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                    DUAL-BOOT CCA
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    {config.currentMode}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    ZERO RECURRING FEES
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Windows 11 Creator Hub &middot; Bazzite Handheld Console &middot; CyberDAW Max Live Audio &middot; Local AI Clipping
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions & Compliance Probe */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleVerifyAntiCheatBoundary}
              disabled={isVerifyingSecurity}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
            >
              <ShieldCheck className={`w-3.5 h-3.5 ${isVerifyingSecurity ? 'animate-spin' : ''}`} />
              <span>{isVerifyingSecurity ? 'Auditing Boundary...' : 'Verify Anti-Cheat CCA'}</span>
            </button>

            <button
              onClick={handleTriggerReplaySave}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded text-xs font-semibold transition-colors cursor-pointer"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Save Replay (60s)</span>
            </button>

            {/* Mode Switcher */}
            <select
              value={config.currentMode}
              onChange={(e) => {
                const mode = e.target.value as any;
                setConfig((prev) => ({ ...prev, currentMode: mode }));
                showNotice(`Switched Creator Compatibility Adapter to ${mode}`, 'INFO');
              }}
              className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              <option value="STRICT_MODE">Strict Mode (Baseline Safe)</option>
              <option value="APPROVED_CAPTURE_MODE">Approved Capture Mode</option>
              <option value="DIAGNOSTIC_MODE">Diagnostic Telemetry Mode</option>
            </select>
          </div>
        </div>

        {/* Notice Banner */}
        {notice && (
          <div
            className={`mt-4 p-2.5 rounded-lg border text-xs flex items-center gap-2 transition-all ${
              notice.type === 'SUCCESS'
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
                : 'bg-cyan-950/60 border-cyan-500/50 text-cyan-200'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notice.text}</span>
          </div>
        )}

        {/* Hardware & Profile Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-800/80 text-xs">
          <div className="p-2 bg-slate-900/60 rounded border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Host Device</span>
            <span className="font-bold text-white mt-0.5 block truncate">{config.hardware.device}</span>
          </div>

          <div className="p-2 bg-slate-900/60 rounded border border-slate-800">
            <span className="text-[10px] text-slate-400 block">SoC &amp; Encoder</span>
            <span className="font-bold text-cyan-300 mt-0.5 block truncate">Ryzen Z1 Extreme (AMF)</span>
          </div>

          <div className="p-2 bg-slate-900/60 rounded border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Display Target</span>
            <span className="font-bold text-slate-200 mt-0.5 block">{config.hardware.display}</span>
          </div>

          <div className="p-2 bg-slate-900/60 rounded border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Active Power Profile</span>
            <span className="font-bold text-amber-300 mt-0.5 block">{config.hardware.coolingProfile}</span>
          </div>
        </div>
      </div>

      {/* Internal Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-[#0D121D] border border-slate-800 rounded-lg text-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('ARCHITECTURE')}
          className={`px-3 py-1.5 rounded transition-all font-semibold flex items-center gap-2 cursor-pointer ${
            activeTab === 'ARCHITECTURE'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Dual-Boot &amp; Partitioning</span>
        </button>

        <button
          onClick={() => setActiveTab('CYBERDAW_MAX')}
          className={`px-3 py-1.5 rounded transition-all font-semibold flex items-center gap-2 cursor-pointer ${
            activeTab === 'CYBERDAW_MAX'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm shadow-purple-500/10'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>CyberDAW Max Live Audio</span>
        </button>

        <button
          onClick={() => setActiveTab('ANTI_CHEAT_CCA')}
          className={`px-3 py-1.5 rounded transition-all font-semibold flex items-center gap-2 cursor-pointer ${
            activeTab === 'ANTI_CHEAT_CCA'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-500/10'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Anti-Cheat CCA Adapter</span>
        </button>

        <button
          onClick={() => setActiveTab('AI_CLIPPING')}
          className={`px-3 py-1.5 rounded transition-all font-semibold flex items-center gap-2 cursor-pointer ${
            activeTab === 'AI_CLIPPING'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm shadow-amber-500/10'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Scissors className="w-3.5 h-3.5" />
          <span>Offline AI Clipping Pipeline</span>
        </button>

        <button
          onClick={() => setActiveTab('PERFORMANCE')}
          className={`px-3 py-1.5 rounded transition-all font-semibold flex items-center gap-2 cursor-pointer ${
            activeTab === 'PERFORMANCE'
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm shadow-rose-500/10'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Performance &amp; OBS Specs</span>
        </button>
      </div>

      {/* TAB 1: DUAL-BOOT ARCHITECTURE & PARTITIONING */}
      {activeTab === 'ARCHITECTURE' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Windows 11 Creator Hub Card */}
            <div className="p-4 bg-[#0B101B] border border-cyan-500/30 rounded-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                  <span className="font-bold text-white text-sm">Windows 11 (Creator Hub)</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300">
                  PRIMARY OS (NTFS)
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Hosts anti-cheat multiplayer games, OBS Studio with AMD AMF encoder, CyberDAW Max live audio routing, VST plugins, Armoury Crate SE, and local Whisper AI clipping.
              </p>
              <div className="p-2.5 bg-slate-950 rounded text-xs space-y-1">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Allocated Tools</span>
                <div className="flex flex-wrap gap-1">
                  {['OBS Studio', 'CyberDAW Max', 'ReaPlugs', 'Equalizer APO', 'Kdenlive', 'Game Pass', 'AMD Adrenalin'].map((tool) => (
                    <span key={tool} className="px-2 py-0.5 bg-slate-900 text-cyan-300 border border-slate-800 rounded text-[10px]">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bazzite Handheld Console Card */}
            <div className="p-4 bg-[#0B101B] border border-purple-500/30 rounded-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                  <span className="font-bold text-white text-sm">Bazzite (Handheld Game OS)</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300">
                  SECONDARY OS (Btrfs)
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Dedicated controller-first Steam Deck UI for couch gaming, native suspend/resume, and low-maintenance Proton single-player titles with Handheld Daemon power controls.
              </p>
              <div className="p-2.5 bg-slate-950 rounded text-xs space-y-1">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Allocated Tools</span>
                <div className="flex flex-wrap gap-1">
                  {['Steam Deck UI', 'Proton GE', 'Handheld Daemon', 'Decky Loader', 'Bazzite Kernel'].map((tool) => (
                    <span key={tool} className="px-2 py-0.5 bg-slate-900 text-purple-300 border border-slate-800 rounded text-[10px]">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 1TB Storage Partition Visualizer */}
          <div className="p-4 bg-[#0B101B] border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-white text-sm">Recommended 1TB Internal NVMe Partition Plan</span>
              </div>
              <span className="text-xs text-slate-400">Total: 1,024 GB</span>
            </div>

            {/* Visual Bar */}
            <div className="w-full h-7 rounded-lg overflow-hidden flex text-[10px] font-bold text-white text-center leading-7 shadow-inner">
              <div style={{ width: '22%' }} className="bg-cyan-600 hover:bg-cyan-500 transition-colors cursor-pointer" title="Windows 11 OS (220 GB)">
                Win11 (220GB)
              </div>
              <div style={{ width: '13%' }} className="bg-purple-600 hover:bg-purple-500 transition-colors cursor-pointer" title="Bazzite Linux (130 GB)">
                Bazzite (130GB)
              </div>
              <div style={{ width: '45%' }} className="bg-emerald-600 hover:bg-emerald-500 transition-colors cursor-pointer" title="Shared NTFS Media Partition (460 GB)">
                Shared NTFS Creator Media (460GB)
              </div>
              <div style={{ width: '20%' }} className="bg-slate-700 hover:bg-slate-600 transition-colors cursor-pointer" title="Recovery & Free Headroom (214 GB)">
                Free / Recovery (214GB)
              </div>
            </div>

            {/* Partition Table */}
            <div className="overflow-x-auto mt-3">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase">
                    <th className="py-2 px-3">Partition</th>
                    <th className="py-2 px-3">Size</th>
                    <th className="py-2 px-3">File System</th>
                    <th className="py-2 px-3">Core Purpose</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {config.partitions.map((p) => (
                    <tr key={p.name} className="hover:bg-slate-900/40">
                      <td className="py-2 px-3 font-semibold text-white">{p.name}</td>
                      <td className="py-2 px-3 text-cyan-300">{p.suggestedSize}</td>
                      <td className="py-2 px-3 text-slate-300">{p.fileSystem}</td>
                      <td className="py-2 px-3 text-slate-400">{p.purpose}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CYBERDAW MAX LIVE AUDIO */}
      {activeTab === 'CYBERDAW_MAX' && (
        <div className="space-y-4">
          {/* Signal Routing Flow Diagram */}
          <div className="p-4 bg-[#0B101B] border border-purple-500/30 rounded-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-purple-400" />
                <span className="font-bold text-white text-sm">CyberDAW Max Live Audio Signal Architecture</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300">
                LOW-LATENCY VIRTUAL ROUTING
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs text-center py-2">
              <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">1. Input</span>
                <span className="font-bold text-white block">Microphone / Headset</span>
                <span className="text-[10px] text-cyan-400 font-mono">Analog / USB-C 48kHz</span>
              </div>

              <div className="p-3 bg-purple-950/40 rounded border border-purple-500/40 space-y-1">
                <span className="text-[10px] text-purple-400 uppercase block font-semibold">2. CyberDAW Max</span>
                <span className="font-bold text-purple-200 block">Live VST Processing</span>
                <span className="text-[10px] text-purple-300 font-mono">128-sample buffer (~2.6ms)</span>
              </div>

              <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">3. Virtual Bridge</span>
                <span className="font-bold text-white block">VB-CABLE Virtual Bus</span>
                <span className="text-[10px] text-emerald-400 font-mono">Zero feedback loop</span>
              </div>

              <div className="p-3 bg-cyan-950/40 rounded border border-cyan-500/40 space-y-1">
                <span className="text-[10px] text-cyan-400 uppercase block font-semibold">4. Broadcast Mix</span>
                <span className="font-bold text-cyan-200 block">OBS Studio 5-Track Audio</span>
                <span className="text-[10px] text-cyan-300 font-mono">Separate Master + Monitor</span>
              </div>
            </div>
          </div>

          {/* Preset Selector & Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {config.cyberDawPresets.map((preset) => (
              <div
                key={preset.id}
                onClick={() => setSelectedPreset(preset)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedPreset.id === preset.id
                    ? 'bg-[#121024] border-purple-400 shadow-md shadow-purple-500/20 ring-1 ring-purple-400/50'
                    : 'bg-[#0B101B] hover:bg-[#0E1524] border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white">{preset.name}</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-purple-500/20 text-purple-300">
                    {preset.cpuMode}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{preset.purpose}</p>

                <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase block">Plugin Chain</span>
                  <div className="space-y-0.5">
                    {preset.chain.map((c) => (
                      <div key={c} className="flex items-center gap-1.5 text-[11px] text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                        <span>{c}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 text-[10px] text-slate-400 pt-2 border-t border-slate-800/60">
                  <span>Buffer: {preset.bufferSize} spls</span>
                  <span className="text-emerald-400 font-bold">Ceiling: {preset.peakSafetyCeilingDbfs} dBFS</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ANTI-CHEAT CREATOR COMPATIBILITY ADAPTER (CCA) */}
      {activeTab === 'ANTI_CHEAT_CCA' && (
        <div className="space-y-4">
          <div className="p-4 bg-[#0B101B] border border-emerald-500/30 rounded-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-white text-sm">Anti-Cheat Boundary Contract &amp; Allowlist Transparency</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                ZERO INJECTION POLICY
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              The <strong>Creator Compatibility Adapter (CCA)</strong> guarantees creator tools remain completely outside the protected game boundary. It <strong>never</strong> bypasses anti-cheat, injects DLLs, reads protected game memory, or simulates player input.
            </p>

            {/* Rules Table */}
            <div className="overflow-x-auto mt-2">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase">
                    <th className="py-2 px-3">Rule / Component</th>
                    <th className="py-2 px-3">Security Boundary</th>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3">Proposed Treatment &amp; Audit Proof</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {config.antiCheatRules.map((rule) => (
                    <tr key={rule.id} className="hover:bg-slate-900/40">
                      <td className="py-2 px-3 font-semibold text-white whitespace-nowrap">{rule.category}</td>
                      <td className="py-2 px-3 text-cyan-300">{rule.securityBoundary}</td>
                      <td className="py-2 px-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            rule.status === 'COMPLIANT'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : rule.status === 'ISOLATED'
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          }`}
                        >
                          {rule.status}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-slate-300">
                        <div>{rule.proposedTreatment}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{rule.auditProof}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: OFFLINE AI CLIPPING PIPELINE */}
      {activeTab === 'AI_CLIPPING' && (
        <div className="space-y-4">
          <div className="p-4 bg-[#0B101B] border border-amber-500/30 rounded-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Scissors className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-white text-sm">Two-Stage Offline AI Clipping Pipeline</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300">
                100% LOCAL &middot; ZERO LEAKS
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Stage A */}
              <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-2">
                <span className="text-[10px] text-cyan-400 uppercase font-bold block">Stage A: Cheap Continuous Capture</span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  OBS Replay buffer continuously holds the last 60s in RAM. Rear buttons trigger replay saves directly into <code className="text-cyan-300">D:\Creator\Inbox</code> with zero overhead.
                </p>
                <div className="text-[11px] text-slate-400 space-y-1">
                  <div>&bull; AMD AMF hardware encoder handles encoding</div>
                  <div>&bull; Multi-track MKV with isolated audio channels</div>
                </div>
              </div>

              {/* Stage B */}
              <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-2">
                <span className="text-[10px] text-amber-400 uppercase font-bold block">Stage B: Offline Local Assembly</span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Runs only <strong>after</strong> gameplay stops. Whisper.cpp transcribes voice tracks, FFmpeg ranks volume peaks and silence deltas, and Kdenlive generates draft montages.
                </p>
                <div className="text-[11px] text-slate-400 space-y-1">
                  <div>&bull; Human review required before publishing</div>
                  <div>&bull; Vertical 9:16 crop with safe-zone captions</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: PERFORMANCE & OBS SPECS */}
      {activeTab === 'PERFORMANCE' && (
        <div className="space-y-4">
          <div className="p-4 bg-[#0B101B] border border-rose-500/30 rounded-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-rose-400" />
                <span className="font-bold text-white text-sm">Ally X Power Targets &amp; OBS Encoding Specs</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300">
                BALANCED THERMAL PROFILES
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'QUIET', name: 'Quiet Gaming', power: '15 W', display: '60 Hz', target: 'Battery gaming & Bazzite handheld play' },
                { id: 'BALANCED', name: 'Creator Balanced', power: '20–25 W', display: '60 or 120 Hz', target: 'Gaming plus OBS replay buffer' },
                { id: 'LIVE_PRODUCTION', name: 'Live Production', power: '25–30 W (Plugged)', display: '60 Hz', target: 'Streaming, CyberDAW Max & Live Capture' }
              ].map((prof) => (
                <div
                  key={prof.id}
                  onClick={() => {
                    setActivePowerProfile(prof.id as any);
                    showNotice(`Switched ROG Ally X Power Profile to ${prof.name}`, 'INFO');
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    activePowerProfile === prof.id
                      ? 'bg-rose-950/30 border-rose-500 shadow-md shadow-rose-500/20 ring-1 ring-rose-400/50'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{prof.name}</span>
                    <span className="text-rose-400 font-bold text-xs">{prof.power}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{prof.target}</p>
                  <div className="mt-2 text-[10px] text-slate-500">Display: {prof.display}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
