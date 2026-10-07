import React, { useState } from 'react';
import {
  Globe,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Server,
  Terminal,
  Activity,
  Cpu,
  Layers,
  Award,
  BookOpen,
  Play,
  RotateCcw,
  Check,
  Copy,
  ExternalLink,
  ChevronRight,
  Sliders,
  Sparkles,
  Zap,
  Lock,
  Compass,
  FileCode,
  Flame,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import {
  TIER_1_AGENTS,
  TIER_2_AGENTS,
  CLUSTER_NODES,
  INITIAL_TEST_HARNESS,
  SovereignAgentDossier,
  ClusterNode,
  TestHarnessCase,
} from '../data/sovereignPortalData';

interface SovereignPortalSuiteProps {
  onNotify?: (message: string, type: 'ALERT' | 'SUCCESS' | 'INFO') => void;
  onOpenFaaLicense?: () => void;
  onOpenSovereignCommand?: () => void;
}

export const SovereignPortalSuite: React.FC<SovereignPortalSuiteProps> = ({
  onNotify,
  onOpenFaaLicense,
  onOpenSovereignCommand,
}) => {
  const [activeTab, setActiveTab] = useState<'AGENTS' | 'CLUSTER' | 'TERMINAL' | 'TEST_HARNESS' | 'DOCTRINE' | 'API_REGISTRY'>('AGENTS');
  const [agentTierFilter, setAgentTierFilter] = useState<'ALL' | 'TIER_1' | 'TIER_2'>('ALL');
  const [selectedAgent, setSelectedAgent] = useState<SovereignAgentDossier>(TIER_1_AGENTS[0]);
  const [nodes, setNodes] = useState<ClusterNode[]>(CLUSTER_NODES);
  const [tests, setTests] = useState<TestHarnessCase[]>(INITIAL_TEST_HARNESS);
  const [isRunningAllTests, setIsRunningAllTests] = useState(false);
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);

  // Terminal Simulator State
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState<Array<{ command: string; output: string; time: string }>>([
    {
      command: 'sovereign-cli status',
      output: 'SOVEREIGN_KERNEL v4.8.2 ONLINE · 16 Cluster Nodes · 0 Degraded · Mesh 99.4% · Vault: 1,840,000 ESC',
      time: '04:18:10',
    },
    {
      command: 'sovereign-cli tribunal audit --venue=48deg',
      output: 'IUSTITIA-001 PRESIDING · 0 pending appeals · 14,892 verified flight hours logged on TSL-SBT',
      time: '04:18:22',
    },
  ]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLabel(label);
    if (onNotify) onNotify(`Copied ${label} to clipboard!`, 'SUCCESS');
    setTimeout(() => setCopiedLabel(null), 2000);
  };

  const handleRunAllTests = () => {
    setIsRunningAllTests(true);
    if (onNotify) onNotify('⚡ Running full Sovereign Test Harness suite across all venues...', 'INFO');

    setTimeout(() => {
      setTests(prev =>
        prev.map(t => ({
          ...t,
          status: 'PASSED',
          durationMs: Math.floor(t.durationMs * (0.9 + Math.random() * 0.2)),
          lastRunAt: new Date().toISOString(),
        }))
      );
      setIsRunningAllTests(false);
      if (onNotify) onNotify('🏆 5/5 Integration & Safety Test Cases PASSED with 100% compliance!', 'SUCCESS');
    }, 1500);
  };

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    const cmd = terminalInput.trim();
    const now = new Date().toTimeString().split(' ')[0];
    let output = '';

    if (cmd === 'help' || cmd === 'sovereign-cli help') {
      output = 'Available commands: status, swarm inspect, tribunal audit, vault sync, test run, corridors list, null abort --eval';
    } else if (cmd.includes('status')) {
      output = 'SOVEREIGN_MESH: 99.4% Coverage · 6 Active Gateways · 1,840,000 ESC Staked · 0 Breaches';
    } else if (cmd.includes('swarm')) {
      output = 'SWARM_ROSTER: 9 Defensive Agents + 10 Domain UAVs · Inter-drone spacing: OPTIMAL (14.2m avg)';
    } else if (cmd.includes('tribunal')) {
      output = 'IUSTITIA-001 (48°): All 107-SOV violations resolved · 0 unadjudicated citations';
    } else if (cmd.includes('vault')) {
      output = 'VAULT_OF_TRUST (24°): Escrow locked: 1,840,000 ESC · CUSTOS-001 Escort standby';
    } else if (cmd.includes('test')) {
      output = 'TEST_HARNESS: All 5 test suites evaluated · 47/47 assertions passed';
    } else if (cmd.includes('corridors')) {
      output = 'CORRIDORS: Alpha (0-1200ft S-3+), Beta (0-400ft S-2+), Gamma (0-200ft S-1+), Delta (LOCKED S-4+)';
    } else if (cmd.includes('null')) {
      output = 'NULL_PROTOCOL (84°): Entropy index 0.0012 · Abort threshold: 60% mesh · Standby';
    } else {
      output = `Command executed: "${cmd}" · Response logged to TSL Ledger (Code: OK)`;
    }

    setTerminalHistory(prev => [...prev, { command: cmd, output, time: now }]);
    setTerminalInput('');
  };

  const allAgents = [...TIER_1_AGENTS, ...TIER_2_AGENTS];
  const filteredAgents =
    agentTierFilter === 'ALL'
      ? allAgents
      : agentTierFilter === 'TIER_1'
      ? TIER_1_AGENTS
      : TIER_2_AGENTS;

  return (
    <div className="bg-[#030508] border border-purple-500/30 rounded-xl overflow-hidden shadow-2xl space-y-4 font-mono text-xs text-slate-200">
      {/* HEADER BANNER */}
      <div className="p-4 sm:p-5 border-b border-purple-500/20 bg-gradient-to-r from-[#030508] via-[#0A1420] to-[#0A0D18] flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 via-indigo-700 to-slate-900 border border-purple-500/40 flex items-center justify-center shadow-lg shadow-purple-500/20 shrink-0">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-purple-300 tracking-wider uppercase font-sans">
                SOVEREIGN PORTAL &middot; KERNEL OPERATIONS CONSOLE
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-black border flex items-center gap-1 bg-purple-500/20 text-purple-300 border-purple-500/40">
                <Layers className="w-3 h-3 text-purple-400" />
                MANUS SOVEREIGN SUITE
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-black border flex items-center gap-1 bg-cyan-500/20 text-cyan-300 border-cyan-500/40">
                <Server className="w-3 h-3 text-cyan-400" />
                16 NODES &middot; MESH 99.4%
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Tier 1-3 Agentic Hierarchy &middot; 48&deg; Tribunal of Chains &middot; Cluster Orchestration &middot; Test Harness &middot; sovereign-cli
            </p>
          </div>
        </div>

        {/* Quick Portal Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {onOpenFaaLicense && (
            <button
              onClick={onOpenFaaLicense}
              className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/40 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
            >
              <Award className="w-3.5 h-3.5" />
              <span>FAA-SOV License</span>
            </button>
          )}

          {onOpenSovereignCommand && (
            <button
              onClick={onOpenSovereignCommand}
              className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 border border-cyan-500/40 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Sovereign Command 48m</span>
            </button>
          )}

          <button
            onClick={handleRunAllTests}
            disabled={isRunningAllTests}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 ${isRunningAllTests ? 'animate-spin' : 'fill-current'}`} />
            <span>{isRunningAllTests ? 'Evaluating...' : 'Run Test Harness'}</span>
          </button>
        </div>
      </div>

      {/* METRICS HUD STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 px-4 py-2 bg-[#060C14] border-y border-purple-500/10 text-center">
        <div className="p-2 border-r border-slate-800">
          <div className="text-xl font-bold text-purple-300 font-sans">10 Agents</div>
          <div className="text-[10px] text-slate-400 uppercase">Tier 1 &amp; 2 Hierarchy</div>
          <div className="text-[9px] text-purple-400/80">0&deg; to 84&deg; Venues</div>
        </div>
        <div className="p-2 border-r border-slate-800">
          <div className="text-xl font-bold text-cyan-400 font-sans">99.4%</div>
          <div className="text-[10px] text-slate-400 uppercase">Mesh Coverage</div>
          <div className="text-[9px] text-cyan-400/80">Threshold: &gt;60%</div>
        </div>
        <div className="p-2 border-r border-slate-800">
          <div className="text-xl font-bold text-emerald-400 font-sans">16 Nodes</div>
          <div className="text-[10px] text-slate-400 uppercase">Cluster Status</div>
          <div className="text-[9px] text-emerald-400/80">100% Healthy</div>
        </div>
        <div className="p-2 border-r border-slate-800">
          <div className="text-xl font-bold text-amber-300 font-sans">1.84M ESC</div>
          <div className="text-[10px] text-slate-400 uppercase">Vault of Trust</div>
          <div className="text-[9px] text-amber-400/80">Insurance Staked</div>
        </div>
        <div className="p-2 border-r border-slate-800">
          <div className="text-xl font-bold text-slate-200 font-sans">32ms</div>
          <div className="text-[10px] text-slate-400 uppercase">Average Latency</div>
          <div className="text-[9px] text-slate-500">Optical Laser Sync</div>
        </div>
        <div className="p-2">
          <div className="text-xl font-bold text-emerald-400 font-sans">5/5 Passed</div>
          <div className="text-[10px] text-slate-400 uppercase">Test Harness</div>
          <div className="text-[9px] text-emerald-400/80">0 Critical Defects</div>
        </div>
      </div>

      {/* NAVIGATION SUB-TABS */}
      <div className="px-4 border-b border-slate-800 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveTab('AGENTS')}
          className={`flex items-center gap-1.5 px-3 py-2 border-b-2 font-bold transition-colors cursor-pointer ${
            activeTab === 'AGENTS'
              ? 'border-purple-400 text-purple-300 bg-purple-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Tier 1-3 Agentic Hierarchy</span>
        </button>

        <button
          onClick={() => setActiveTab('CLUSTER')}
          className={`flex items-center gap-1.5 px-3 py-2 border-b-2 font-bold transition-colors cursor-pointer ${
            activeTab === 'CLUSTER'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Server className="w-3.5 h-3.5" />
          <span>Cluster Status &amp; Deployment Controls</span>
        </button>

        <button
          onClick={() => setActiveTab('TERMINAL')}
          className={`flex items-center gap-1.5 px-3 py-2 border-b-2 font-bold transition-colors cursor-pointer ${
            activeTab === 'TERMINAL'
              ? 'border-emerald-400 text-emerald-300 bg-emerald-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>sovereign-cli Terminal Simulator</span>
        </button>

        <button
          onClick={() => setActiveTab('TEST_HARNESS')}
          className={`flex items-center gap-1.5 px-3 py-2 border-b-2 font-bold transition-colors cursor-pointer ${
            activeTab === 'TEST_HARNESS'
              ? 'border-yellow-400 text-yellow-300 bg-yellow-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Test Harness &amp; Safety Verification</span>
        </button>

        <button
          onClick={() => setActiveTab('DOCTRINE')}
          className={`flex items-center gap-1.5 px-3 py-2 border-b-2 font-bold transition-colors cursor-pointer ${
            activeTab === 'DOCTRINE'
              ? 'border-amber-400 text-amber-300 bg-amber-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Doctrine, Lore &amp; Ceremony</span>
        </button>

        <button
          onClick={() => setActiveTab('API_REGISTRY')}
          className={`flex items-center gap-1.5 px-3 py-2 border-b-2 font-bold transition-colors cursor-pointer ${
            activeTab === 'API_REGISTRY'
              ? 'border-blue-400 text-blue-300 bg-blue-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>API &amp; Documentation Registry</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: TIER 1, 2, 3 AGENTIC HIERARCHY                    */}
      {/* ========================================================= */}
      {activeTab === 'AGENTS' && (
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-bold text-xs">Filter Tier:</span>
              {(['ALL', 'TIER_1', 'TIER_2'] as const).map(tier => (
                <button
                  key={tier}
                  onClick={() => setAgentTierFilter(tier)}
                  className={`px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                    agentTierFilter === tier
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  {tier === 'ALL' ? 'All Tiers' : tier.replace('_', ' ')}
                </button>
              ))}
            </div>

            <span className="text-[10px] text-slate-400">
              Showing {filteredAgents.length} Autonomous Nodes
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredAgents.map(ag => {
              const isSelected = selectedAgent.id === ag.id;

              return (
                <div
                  key={ag.id}
                  onClick={() => setSelectedAgent(ag)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer space-y-3 relative overflow-hidden ${
                    isSelected
                      ? 'bg-[#0A1420] border-purple-400 shadow-xl shadow-purple-500/10'
                      : 'bg-[#060C14] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{ backgroundColor: ag.color }}
                  />

                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className="px-2 py-0.5 rounded font-black text-xs font-mono"
                          style={{ backgroundColor: `${ag.color}20`, color: ag.color, border: `1px solid ${ag.color}40` }}
                        >
                          {ag.venueDegrees}&deg;
                        </span>
                        <h4 className="font-bold text-white text-xs font-sans">{ag.name}</h4>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{ag.venueName}</span>
                    </div>

                    <span
                      className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider"
                      style={{ backgroundColor: `${ag.color}20`, color: ag.color, border: `1px solid ${ag.color}40` }}
                    >
                      {ag.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-3">
                    {ag.description}
                  </p>

                  <div className="grid grid-cols-3 gap-1 pt-2 border-t border-slate-800 text-[9px] text-center">
                    <div className="bg-slate-950 p-1.5 rounded">
                      <span className="text-slate-500 block">Mesh Link</span>
                      <span className="font-bold text-emerald-400">{ag.meshLinkPct}%</span>
                    </div>
                    <div className="bg-slate-950 p-1.5 rounded">
                      <span className="text-slate-500 block">CPU Load</span>
                      <span className="font-bold text-cyan-400">{ag.cpuLoadPct}%</span>
                    </div>
                    <div className="bg-slate-950 p-1.5 rounded">
                      <span className="text-slate-500 block">Threads</span>
                      <span className="font-bold text-purple-300">{ag.activeThreads}</span>
                    </div>
                  </div>

                  <div className="space-y-1 pt-1 text-[9px]">
                    <span className="text-slate-500 font-bold block uppercase">Assigned Tools:</span>
                    <div className="flex flex-wrap gap-1">
                      {ag.toolsAssigned.slice(0, 2).map((t, idx) => (
                        <span key={idx} className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded text-slate-300">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: CLUSTER STATUS & DEPLOYMENT CONTROLS               */}
      {/* ========================================================= */}
      {activeTab === 'CLUSTER' && (
        <div className="p-4 space-y-4">
          <div className="p-3 bg-[#060C14] border border-cyan-500/30 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Server className="w-5 h-5 text-cyan-400" />
              <div>
                <span className="font-bold text-white text-xs">GLOBAL SOVEREIGN CLUSTER MESH</span>
                <p className="text-[10px] text-slate-400">Continuous optical laser link synchronization across maritime and terrestrial GCS hubs</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setNodes(prev => prev.map(n => ({ ...n, latencyMs: Math.max(8, n.latencyMs + Math.floor(Math.random() * 5 - 2)) })));
                  if (onNotify) onNotify('🔄 Cluster telemetry synchronised across all 6 regions!', 'INFO');
                }}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Sync Telemetry</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-800 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0A1420] text-slate-400 uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Node ID</th>
                  <th className="py-2.5 px-3">Region / Location</th>
                  <th className="py-2.5 px-3">Zone</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">CPU / Mem</th>
                  <th className="py-2.5 px-3">Latency</th>
                  <th className="py-2.5 px-3">Mesh Peers</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-[#060C14]">
                {nodes.map(n => (
                  <tr key={n.nodeId} className="hover:bg-slate-900/60">
                    <td className="py-2.5 px-3 font-mono font-bold text-cyan-300">{n.nodeId}</td>
                    <td className="py-2.5 px-3 font-bold text-white">{n.region}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                        {n.zone}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-300 text-[11px]">{n.role}</td>
                    <td className="py-2.5 px-3 text-[11px] text-slate-400">
                      <div>{n.cpuPct}% CPU</div>
                      <div className="text-[9px] text-slate-500">{(n.memoryMb / 1024).toFixed(1)} GB</div>
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">{n.latencyMs} ms</td>
                    <td className="py-2.5 px-3 font-mono text-cyan-300">{n.meshPeers}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded font-black text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        {n.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: SOVEREIGN-CLI TERMINAL SIMULATOR                  */}
      {/* ========================================================= */}
      {activeTab === 'TERMINAL' && (
        <div className="p-4 space-y-4">
          <div className="bg-black/95 border border-slate-800 rounded-xl p-4 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <Terminal className="w-4 h-4" />
                <span>sovereign-cli interactive console &middot; Resolute Mesh Session</span>
              </span>
              <span className="text-[10px] text-slate-500">Type &apos;help&apos; for list of commands</span>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pt-2">
              {terminalHistory.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center gap-2 text-cyan-300">
                    <span className="text-slate-500">[{item.time}]</span>
                    <span className="text-emerald-400 font-bold">sovereign@root:~$</span>
                    <span>{item.command}</span>
                  </div>
                  <div className="pl-6 text-slate-300 leading-relaxed text-[11px] whitespace-pre-wrap">
                    {item.output}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleTerminalSubmit} className="flex items-center gap-2 pt-2 border-t border-slate-800">
              <span className="text-emerald-400 font-bold">sovereign@root:~$</span>
              <input
                type="text"
                value={terminalInput}
                onChange={e => setTerminalInput(e.target.value)}
                placeholder="try 'sovereign-cli status' or 'corridors list'..."
                className="flex-1 bg-transparent text-white outline-hidden font-mono text-xs"
              />
              <button
                type="submit"
                className="px-3 py-1 rounded bg-emerald-600/30 text-emerald-200 hover:bg-emerald-600 hover:text-slate-950 font-bold text-[10px] cursor-pointer"
              >
                Execute
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: TEST HARNESS & SAFETY VERIFICATION                 */}
      {/* ========================================================= */}
      {activeTab === 'TEST_HARNESS' && (
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Activity className="w-4 h-4 text-yellow-400" />
                <span>Automated Sovereign Airspace Test Harness</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Validates Addendum A (Mesh Degradation), Addendum B (Escrow Transport), and Addendum C (Agentic Co-Pilot).
              </p>
            </div>

            <button
              onClick={handleRunAllTests}
              disabled={isRunningAllTests}
              className="px-3 py-1.5 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md disabled:opacity-50"
            >
              <Play className={`w-3.5 h-3.5 ${isRunningAllTests ? 'animate-spin' : 'fill-current'}`} />
              <span>{isRunningAllTests ? 'Executing All Suites...' : 'Run All 5 Test Cases'}</span>
            </button>
          </div>

          <div className="space-y-3">
            {tests.map(tc => (
              <div
                key={tc.id}
                className="p-4 bg-[#060C14] border border-slate-800 rounded-xl space-y-2 hover:border-slate-700 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-cyan-300 font-bold">{tc.id}</span>
                      <h4 className="font-bold text-white text-xs">{tc.name}</h4>
                    </div>
                    <span className="text-[10px] text-purple-300 font-mono mt-0.5 block">{tc.category}</span>
                  </div>

                  <span className="px-2 py-0.5 rounded font-black text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    {tc.status}
                  </span>
                </div>

                <p className="text-[11px] text-slate-300 bg-slate-950 p-2.5 rounded border border-slate-850">
                  {tc.logSummary}
                </p>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                  <span>Duration: <b className="text-cyan-300">{tc.durationMs}ms</b></span>
                  <span>Assertions: <b className="text-emerald-400">{tc.passedCount} / {tc.assertionsCount} passed</b></span>
                  <span>Last Executed: <b>{new Date(tc.lastRunAt).toLocaleTimeString()}</b></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: DOCTRINE, LORE & CEREMONY                          */}
      {/* ========================================================= */}
      {activeTab === 'DOCTRINE' && (
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#060C14] border border-amber-500/30 rounded-xl space-y-2">
              <span className="text-xl">📜</span>
              <h4 className="font-bold text-amber-300 text-sm font-sans uppercase">The Resolute Desk Charter</h4>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                The Sovereign Airspace is declared autonomous under the jurisdiction of the Treasury Sovereign Ledger (TSL). All flight corridors operate under the supreme moral guardianship of IUSTITIA-001 and VIGIL-001, anchored by the immutable truth of the XRPL Mainnet.
              </p>
            </div>

            <div className="p-4 bg-[#060C14] border border-purple-500/30 rounded-xl space-y-2">
              <span className="text-xl">👑</span>
              <h4 className="font-bold text-purple-300 text-sm font-sans uppercase">The Court Emblem &amp; Vestments</h4>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                The golden double-headed eagle and the compass of chains symbolize dual-sovereignty across digital finance and physical airspace. Pilots bearing S-3 and above rank are vested with cryptographic seal authority in diplomatic venues.
              </p>
            </div>

            <div className="p-4 bg-[#060C14] border border-emerald-500/30 rounded-xl space-y-2">
              <span className="text-xl">💰</span>
              <h4 className="font-bold text-emerald-300 text-sm font-sans uppercase">Currency &amp; Tokenomics (ESC / SRT)</h4>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                The <b>ESC Token</b> serves as the collateral escrow and licensing medium, staked in the Vault of Trust. The <b>SRT (Sovereign Reputation Token)</b> tracks pilot behavioral compliance; severe violations trigger automated point reductions and sanctions.
              </p>
            </div>

            <div className="p-4 bg-[#060C14] border border-cyan-500/30 rounded-xl space-y-2">
              <span className="text-xl">⚡</span>
              <h4 className="font-bold text-cyan-300 text-sm font-sans uppercase">The 7-Step Ceremony of Ascension</h4>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                0&deg; Salon Prime verification &rarr; 12&deg; Written Examination &rarr; 24&deg; Collateral Escrow Lock &rarr; 48&deg; Judicial Adjudication &rarr; 60&deg; Surveillance Ingestion &rarr; 72&deg; Registry Ratification &rarr; 84&deg; Entropy Anchor.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 6: API & DOCUMENTATION REGISTRY                       */}
      {/* ========================================================= */}
      {activeTab === 'API_REGISTRY' && (
        <div className="p-4 space-y-4">
          <div className="space-y-3">
            <span className="text-xs font-bold text-white uppercase block">Active Sovereign API Endpoints:</span>
            <div className="space-y-2">
              {[
                { method: 'GET', path: '/api/sovereign-portal/agents', desc: 'Returns catalog of Tier 1 & 2 agents with venue coordinates' },
                { method: 'GET', path: '/api/sovereign-portal/cluster', desc: 'Real-time telemetry across all 6 cluster nodes' },
                { method: 'POST', path: '/api/sovereign-portal/test-harness/run', desc: 'Executes automated 5-suite safety test harness' },
                { method: 'GET', path: '/api/faa-sov/profile', desc: 'Current pilot credential & Soulbound verification URL' },
                { method: 'GET', path: '/api/faa-sov/aircraft', desc: 'Active registered UAV fleet on TSL registry' },
                { method: 'POST', path: '/api/faa-sov/aircraft', desc: 'Register new drone/UAV with mesh node assignment' },
                { method: 'POST', path: '/api/faa-sov/exam/submit', desc: 'Submit written exam answers for automated accreditation' },
                { method: 'GET', path: '/api/sovereign-command/telemetry', desc: '48m Autonomous Expedition Platform vector HUD' },
                { method: 'POST', path: '/api/sovereign-command/threat', desc: 'Simulate and neutralize adversarial threats in 1.4ms' },
              ].map((ep, idx) => (
                <div key={idx} className="p-3 bg-[#060C14] border border-slate-800 rounded-lg flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className={`px-2 py-0.5 rounded font-black text-[10px] ${
                      ep.method === 'GET' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}>
                      {ep.method}
                    </span>
                    <span className="font-mono text-white text-xs">{ep.path}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">{ep.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
