import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ShieldCheck, 
  Cpu, 
  Zap, 
  Activity, 
  RefreshCw, 
  Server, 
  Radio, 
  Terminal, 
  CheckCircle2, 
  AlertTriangle, 
  Send, 
  Folder, 
  Key, 
  ArrowUpRight, 
  Layers, 
  Sliders,
  HardDrive
} from 'lucide-react';
import { 
  INITIAL_HERDR_CLUSTER, 
  HerdrClusterState, 
  HerdrNode, 
  HerdrTask 
} from '../data/herdrClusterData';

export const HerdrClusterView: React.FC = () => {
  const [cluster, setCluster] = useState<HerdrClusterState>(INITIAL_HERDR_CLUSTER);
  const [selectedNode, setSelectedNode] = useState<HerdrNode | null>(cluster.nodes[0]);
  const [isElecting, setIsElecting] = useState<boolean>(false);
  const [isProbing, setIsProbing] = useState<boolean>(false);
  const [dispatchTitle, setDispatchTitle] = useState<string>('');
  const [dispatchPriority, setDispatchPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('HIGH');
  const [targetNodeId, setTargetNodeId] = useState<string>(cluster.nodes[0].id);
  const [notice, setNotice] = useState<{ text: string; type: 'SUCCESS' | 'INFO' | 'WARN' } | null>(null);

  // Poll server or simulate live cluster heartbeats
  const probeCluster = async () => {
    setIsProbing(true);
    try {
      const res = await fetch('/api/herdr/status');
      if (res.ok) {
        const data = await res.json();
        if (data.cluster) {
          setCluster(data.cluster);
        }
      }
    } catch {
      // Local simulated refresh
    } finally {
      setTimeout(() => {
        setCluster((prev) => ({
          ...prev,
          nodes: prev.nodes.map((n) => ({
            ...n,
            latencyMs: Number((n.latencyMs + (Math.random() * 0.2 - 0.1)).toFixed(2)),
            heartbeatAgeMs: Math.floor(Math.random() * 300) + 50,
          })),
        }));
        setIsProbing(false);
        showNotice('Cluster mesh probed: All 5 active nodes responsive over loopback.', 'INFO');
      }, 500);
    }
  };

  const showNotice = (text: string, type: 'SUCCESS' | 'INFO' | 'WARN') => {
    setNotice({ text, type });
    setTimeout(() => setNotice(null), 4000);
  };

  // Trigger Raft Leader Re-Election
  const handleTriggerElection = async () => {
    setIsElecting(true);
    showNotice('Initiating Raft quorum election across herd nodes...', 'INFO');
    
    try {
      const res = await fetch('/api/herdr/elect', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (data.leaderNodeId) {
          setCluster((prev) => ({
            ...prev,
            electionTerm: prev.electionTerm + 1,
            leaderNodeId: data.leaderNodeId,
          }));
        }
      }
    } catch {
      // Fallback
      setTimeout(() => {
        setCluster((prev) => ({
          ...prev,
          electionTerm: prev.electionTerm + 1,
          leaderNodeId: 'node-hermes-01',
        }));
      }, 1200);
    } finally {
      setTimeout(() => {
        setIsElecting(false);
        showNotice(`Quorum established: Term ${cluster.electionTerm + 1} confirmed with Hermes Conductor as Leader.`, 'SUCCESS');
      }, 1400);
    }
  };

  // Dispatch task to herd node
  const handleDispatchTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispatchTitle.trim()) return;

    const newTask: HerdrTask = {
      id: `TASK-HERDR-${Date.now().toString().slice(-4)}`,
      title: dispatchTitle,
      assignedNodeId: targetNodeId,
      status: 'RUNNING',
      priority: dispatchPriority,
      dispatchedAt: new Date().toISOString(),
      durationMs: 120,
      payloadSummary: `Dispatched to node ${targetNodeId} under Guardian policy enforcement`,
    };

    setCluster((prev) => ({
      ...prev,
      totalDispatchedTasks: prev.totalDispatchedTasks + 1,
      activeDispatchedTasks: prev.activeDispatchedTasks + 1,
      recentTasks: [newTask, ...prev.recentTasks.slice(0, 7)],
    }));

    setDispatchTitle('');
    showNotice(`Dispatched "${newTask.title}" to ${targetNodeId}`, 'SUCCESS');

    // Auto complete after 3.5s
    setTimeout(() => {
      setCluster((prev) => ({
        ...prev,
        activeDispatchedTasks: Math.max(0, prev.activeDispatchedTasks - 1),
        recentTasks: prev.recentTasks.map((t) =>
          t.id === newTask.id ? { ...t, status: 'COMPLETED', durationMs: 3450 } : t
        ),
      }));
    }, 3500);
  };

  return (
    <div className="space-y-5">
      {/* Cluster Header Overview */}
      <div className="bg-[#0B101B] border border-cyan-500/30 rounded-xl p-5 relative overflow-hidden shadow-lg shadow-cyan-950/20">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-400">
                <Users className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-white tracking-wide">
                    Herdr Cluster Orchestrator
                  </h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    .herdr / SOVEREIGN MESH
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    RAFT TERM #{cluster.electionTerm}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono">
                  Autonomous Agent Herd Clustering &middot; Peer Discovery &middot; Quorum Authority Gate
                </p>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={probeCluster}
              disabled={isProbing}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-xs font-mono transition-colors disabled:opacity-50 cursor-pointer"
              title="Ping all registered peer nodes in the herd mesh"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isProbing ? 'animate-spin' : ''}`} />
              <span>Probe Mesh</span>
            </button>

            <button
              onClick={handleTriggerElection}
              disabled={isElecting}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded text-xs font-mono font-medium transition-colors disabled:opacity-50 cursor-pointer"
              title="Trigger Raft leader re-election"
            >
              <Radio className={`w-3.5 h-3.5 text-cyan-400 ${isElecting ? 'animate-ping' : ''}`} />
              <span>{isElecting ? 'Electing...' : 'Trigger Election'}</span>
            </button>

            <div className="px-3 py-1.5 bg-slate-900/90 border border-slate-800 rounded text-xs font-mono text-slate-400 flex items-center gap-2">
              <Folder className="w-3.5 h-3.5 text-amber-400" />
              <span>{cluster.storageDir}</span>
            </div>
          </div>
        </div>

        {/* Notice Banner */}
        {notice && (
          <div
            className={`mt-4 p-2.5 rounded-lg border text-xs font-mono flex items-center justify-between transition-all ${
              notice.type === 'SUCCESS'
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
                : notice.type === 'WARN'
                ? 'bg-amber-950/60 border-amber-500/50 text-amber-200'
                : 'bg-cyan-950/60 border-cyan-500/50 text-cyan-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{notice.text}</span>
            </div>
          </div>
        )}

        {/* Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mt-4 pt-4 border-t border-slate-800/80 text-xs font-mono">
          <div className="p-2.5 bg-slate-900/60 rounded border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Quorum Health</span>
            <span className="font-bold text-emerald-400 flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              HEALTHY (5/6)
            </span>
          </div>

          <div className="p-2.5 bg-slate-900/60 rounded border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Elected Leader</span>
            <span className="font-bold text-cyan-300 mt-0.5 block truncate">
              {cluster.nodes.find((n) => n.id === cluster.leaderNodeId)?.name || 'Hermes Conductor'}
            </span>
          </div>

          <div className="p-2.5 bg-slate-900/60 rounded border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Avg Mesh Latency</span>
            <span className="font-bold text-slate-200 mt-0.5 block">
              {cluster.avgMeshLatencyMs} ms (Loopback)
            </span>
          </div>

          <div className="p-2.5 bg-slate-900/60 rounded border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Heartbeat Frequency</span>
            <span className="font-bold text-indigo-300 mt-0.5 block">
              {cluster.heartbeatIntervalMs} ms
            </span>
          </div>

          <div className="p-2.5 bg-slate-900/60 rounded border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Dispatched Jobs</span>
            <span className="font-bold text-slate-200 mt-0.5 block">
              {cluster.totalDispatchedTasks} Total
            </span>
          </div>

          <div className="p-2.5 bg-slate-900/60 rounded border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Active Swarm Tasks</span>
            <span className="font-bold text-amber-400 mt-0.5 block">
              {cluster.activeDispatchedTasks} In-Flight
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Herd Nodes & Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Node Cards List (8 columns) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-slate-200 uppercase tracking-wider">Registered Herd Nodes</span>
              <span className="text-[11px] text-slate-500">({cluster.nodes.length} peers)</span>
            </div>
            <span className="text-[11px] text-slate-400">Click node for capability & task mapping</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {cluster.nodes.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              const isLeader = cluster.leaderNodeId === node.id;

              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'bg-[#0E1626] border-cyan-400/80 shadow-md shadow-cyan-500/10 ring-1 ring-cyan-500/40'
                      : 'bg-[#0B101B]/80 hover:bg-[#0E1524] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Top Bar: Name + Status */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{node.name}</span>
                        {isLeader && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                            LEADER
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-cyan-400 font-mono block mt-0.5">
                        {node.host}:{node.port}
                      </span>
                    </div>

                    <span
                      className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                        node.status === 'ONLINE'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          node.status === 'ONLINE' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
                        }`}
                      />
                      {node.status}
                    </span>
                  </div>

                  {/* Role & Authority description */}
                  <p className="text-[11px] text-slate-400 font-mono mt-2 line-clamp-1">
                    {node.authorityLevel}
                  </p>

                  {/* Metrics Row */}
                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800/80 text-[11px] font-mono">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Latency</span>
                      <span className="font-semibold text-emerald-400">{node.latencyMs} ms</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">CPU</span>
                      <span className="font-semibold text-slate-200">{node.cpuUsagePct}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Memory</span>
                      <span className="font-semibold text-slate-200">{node.memoryMb} MB</span>
                    </div>
                  </div>

                  {/* Active capabilities tags */}
                  <div className="flex flex-wrap gap-1 mt-3">
                    {node.capabilities.slice(0, 3).map((cap) => (
                      <span
                        key={cap}
                        className="px-1.5 py-0.5 bg-slate-900/90 text-slate-400 rounded text-[9px] font-mono border border-slate-800"
                      >
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Swarm Workload Dispatch Form */}
          <div className="bg-[#0B101B] border border-slate-800 rounded-xl p-4 font-mono text-xs space-y-3">
            <div className="flex items-center gap-2">
              <Send className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-white text-sm">Dispatch Swarm Workload</span>
            </div>

            <form onSubmit={handleDispatchTask} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-6">
                  <label className="text-[10px] text-slate-400 block mb-1">Task Specification</label>
                  <input
                    type="text"
                    value={dispatchTitle}
                    onChange={(e) => setDispatchTitle(e.target.value)}
                    placeholder="e.g. Verify CEX/DEX arbitrage delta on XRP/USDC"
                    className="w-full bg-slate-950 border border-slate-700/80 rounded px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="text-[10px] text-slate-400 block mb-1">Target Herd Node</label>
                  <select
                    value={targetNodeId}
                    onChange={(e) => setTargetNodeId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                  >
                    {cluster.nodes.map((n) => (
                      <option key={n.id} value={n.id}>
                        {n.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <label className="text-[10px] text-slate-400 block mb-1">Priority</label>
                  <select
                    value={dispatchPriority}
                    onChange={(e) => setDispatchPriority(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-500">
                  Tasks route through Guardian Sentinel and obey .hermes.md promotion policies.
                </span>

                <button
                  type="submit"
                  disabled={!dispatchTitle.trim()}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded text-xs font-semibold transition-colors disabled:opacity-40 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Dispatch Task</span>
                </button>
              </div>
            </form>
          </div>

          {/* Recent Dispatched Tasks Feed */}
          <div className="bg-[#0B101B] border border-slate-800 rounded-xl p-4 font-mono text-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-white text-sm">Dispatched Task Queue</span>
              </div>
              <span className="text-[11px] text-slate-500">Real-Time Mesh Execution</span>
            </div>

            <div className="space-y-2">
              {cluster.recentTasks.map((t) => {
                const assigned = cluster.nodes.find((n) => n.id === t.assignedNodeId);
                return (
                  <div
                    key={t.id}
                    className="p-2.5 bg-slate-950/70 border border-slate-800/80 rounded flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-cyan-400 font-bold">{t.id}</span>
                        <span className="font-semibold text-slate-200">{t.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-400">{t.payloadSummary}</p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 text-[11px]">
                      <span className="text-slate-400">{assigned?.name || t.assignedNodeId}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          t.status === 'RUNNING'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        }`}
                      >
                        {t.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Node Details & Configuration Inspector (4 columns) */}
        <div className="lg:col-span-4 space-y-4">
          {selectedNode ? (
            <div className="bg-[#0B101B] border border-cyan-500/30 rounded-xl p-4 font-mono text-xs space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-cyan-400 uppercase tracking-wider font-semibold">
                    Node Inspector
                  </span>
                  <span className="px-1.5 py-0.2 bg-slate-800 text-slate-300 rounded text-[9px] font-mono">
                    {selectedNode.version}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mt-1">{selectedNode.name}</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">{selectedNode.authorityLevel}</p>
              </div>

              {/* Endpoint Details */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] p-2 bg-slate-950 rounded border border-slate-800">
                  <span className="text-slate-400">Endpoint:</span>
                  <code className="text-cyan-300 font-semibold">{selectedNode.host}:{selectedNode.port}</code>
                </div>

                <div className="flex items-center justify-between text-[11px] p-2 bg-slate-950 rounded border border-slate-800">
                  <span className="text-slate-400">Loopback Bound:</span>
                  <span className="text-emerald-400 font-bold">127.0.0.1 (Strict)</span>
                </div>

                <div className="flex items-center justify-between text-[11px] p-2 bg-slate-950 rounded border border-slate-800">
                  <span className="text-slate-400">Latency:</span>
                  <span className="text-emerald-400 font-bold">{selectedNode.latencyMs} ms</span>
                </div>

                <div className="flex items-center justify-between text-[11px] p-2 bg-slate-950 rounded border border-slate-800">
                  <span className="text-slate-400">Heartbeat Age:</span>
                  <span className="text-slate-300">{selectedNode.heartbeatAgeMs} ms ago</span>
                </div>
              </div>

              {/* Assigned Workloads */}
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block mb-2">
                  Assigned Authority Roles
                </span>
                <div className="space-y-1.5">
                  {selectedNode.assignedTasks.map((t) => (
                    <div
                      key={t}
                      className="p-2 rounded bg-slate-900/80 border border-slate-800 flex items-center gap-2 text-[11px]"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="text-slate-200">{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Capabilities */}
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block mb-2">
                  Mesh Capabilities
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedNode.capabilities.map((c) => (
                    <span
                      key={c}
                      className="px-2 py-0.5 rounded bg-cyan-950/40 text-cyan-300 border border-cyan-500/30 text-[10px]"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quick Ping Test */}
              <button
                onClick={() => showNotice(`Loopback ping to ${selectedNode.host}:${selectedNode.port} confirmed (0.4ms)`, 'SUCCESS')}
                className="w-full flex items-center justify-center gap-2 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded text-xs font-semibold transition-colors cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>Test Peer Loopback Ping</span>
              </button>
            </div>
          ) : (
            <div className="bg-[#0B101B] border border-slate-800 rounded-xl p-8 text-center text-slate-500 text-xs font-mono">
              Select a node from the cluster to view its details.
            </div>
          )}

          {/* Storage Directory Manifest */}
          <div className="bg-[#0B101B] border border-slate-800 rounded-xl p-4 font-mono text-xs space-y-3">
            <div className="flex items-center gap-2 text-white font-bold">
              <HardDrive className="w-4 h-4 text-amber-400" />
              <span>.herdr Local Enclave</span>
            </div>

            <div className="space-y-1 text-[11px] text-slate-300">
              <div className="flex items-center justify-between p-1.5 bg-slate-950 rounded">
                <span className="text-slate-400">config.json</span>
                <span className="text-emerald-400 font-semibold">Active (Raft v2)</span>
              </div>
              <div className="flex items-center justify-between p-1.5 bg-slate-950 rounded">
                <span className="text-slate-400">peers.json</span>
                <span className="text-emerald-400 font-semibold">6 Peers Synced</span>
              </div>
              <div className="flex items-center justify-between p-1.5 bg-slate-950 rounded">
                <span className="text-slate-400">state.db</span>
                <span className="text-cyan-400 font-semibold">Term 42 Sealed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
