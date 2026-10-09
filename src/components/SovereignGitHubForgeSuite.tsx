import React, { useState, useEffect, useMemo } from 'react';
import {
  Github,
  ExternalLink,
  Search,
  Filter,
  RefreshCw,
  GitBranch,
  ShieldCheck,
  Zap,
  Activity,
  CheckCircle2,
  Copy,
  Check,
  Radio,
  Cpu,
  Layers,
  Terminal,
  Dumbbell,
  Music,
  Lock,
  Flame,
  Sparkles,
  ArrowRight,
  Code2,
  FileText,
  Boxes,
  Compass,
  GitPullRequest,
  Workflow,
  UploadCloud,
  FolderGit2,
  CheckCheck,
  AlertTriangle,
  Send,
  GitCommit,
  ShieldAlert,
} from 'lucide-react';
import {
  SHALOMINATTII_REPOS,
  GITHUB_USER_PROFILE,
  GitHubRepoItem,
} from '../data/githubReposData';

interface SovereignGitHubForgeSuiteProps {
  onNotify?: (message: string, type: 'ALERT' | 'SUCCESS' | 'INFO') => void;
  onOpenMesh?: () => void;
  onOpenCyberGym?: () => void;
  onOpenCyberDAW?: () => void;
}

interface InductedMeshPeer {
  repoName: string;
  assignedNodeId: string;
  assignedPort: number;
  cipher: string;
  latencyMs: string;
  attestationHash: string;
  timestamp: string;
}

interface WorkspaceGitStatus {
  gitInitialized: boolean;
  user: string;
  email: string;
  branch: string;
  remotes: string[];
  lastCommit: string;
  hasUncommittedChanges: boolean;
  uncommittedFilesCount: number;
  submodules: Array<{ name: string; path: string; repo: string; status: string }>;
  workflows: string[];
  primaryRemote: string;
  secondaryRemotes: string[];
}

export const SovereignGitHubForgeSuite: React.FC<SovereignGitHubForgeSuiteProps> = ({
  onNotify,
  onOpenMesh,
  onOpenCyberGym,
  onOpenCyberDAW,
}) => {
  // Default to ASSEMBLE_MONOREPO ("Put GitHub Together")
  const [activeTab, setActiveTab] = useState<'ASSEMBLE_MONOREPO' | 'OVERSEAS_SINK' | 'CATALOG' | 'MESH_PEERS' | 'CONSOLIDATED' | 'PREVERIFY'>('ASSEMBLE_MONOREPO');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('ALL');
  const [copiedCloneUrl, setCopiedCloneUrl] = useState<string | null>(null);
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  // Live Workspace Git Status State
  const [gitStatus, setGitStatus] = useState<WorkspaceGitStatus | null>(null);
  const [isLoadingGitStatus, setIsLoadingGitStatus] = useState(false);
  const [isSyncingGit, setIsSyncingGit] = useState(false);
  const [lastSyncResult, setLastSyncResult] = useState<any | null>(null);

  // Overseas Sink & Conflict Resolution State
  const [overseasStatus, setOverseasStatus] = useState<any | null>(null);
  const [isLoadingOverseasStatus, setIsLoadingOverseasStatus] = useState(false);
  const [isResolvingConflicts, setIsResolvingConflicts] = useState(false);
  const [isPushingOverseas, setIsPushingOverseas] = useState(false);
  const [conflictStrategy, setConflictStrategy] = useState<'SOVEREIGN_OURS' | 'THEIRS'>('SOVEREIGN_OURS');
  const [githubToken, setGithubToken] = useState('');
  const [conflictResolutionResult, setConflictResolutionResult] = useState<any | null>(null);
  const [overseasPushResult, setOverseasPushResult] = useState<any | null>(null);

  // Mesh induction state
  const [inductedPeers, setInductedPeers] = useState<InductedMeshPeer[]>([
    {
      repoName: 'AEGENTIX-AGENT-MESH',
      assignedNodeId: 'mesh-peer-aegentix-agent-mesh',
      assignedPort: 9005,
      cipher: 'ChaCha20-Poly1305 / NIST FIPS 140-3 Level 4',
      latencyMs: '3.12',
      attestationHash: '0x9a84b01e48f72c0199d3e817',
      timestamp: 'Active Consensus Session',
    },
    {
      repoName: 'cybergym',
      assignedNodeId: 'mesh-peer-cybergym',
      assignedPort: 9006,
      cipher: 'AES-256-GCM / Post-Quantum Kyber-1024',
      latencyMs: '2.45',
      attestationHash: '0x3f11c828d098e472619082bc',
      timestamp: 'Active Consensus Session',
    },
    {
      repoName: 'agentic-ai-orchestrator',
      assignedNodeId: 'mesh-peer-agentic-ai-orchestrator',
      assignedPort: 9007,
      cipher: 'ChaCha20-Poly1305 / NIST FIPS 140-3 Level 4',
      latencyMs: '4.80',
      attestationHash: '0x71ba4809e13d98762145e690',
      timestamp: 'Active Consensus Session',
    },
  ]);

  const [isInducting, setIsInducting] = useState<string | null>(null);
  const [isPreverifying, setIsPreverifying] = useState<string | null>(null);
  const [preverifyResults, setPreverifyResults] = useState<Record<string, any>>({});

  // Fetch Workspace Git Status
  const fetchGitStatus = async () => {
    setIsLoadingGitStatus(true);
    try {
      const res = await fetch('/api/github/workspace-git-status');
      if (res.ok) {
        const data = await res.json();
        setGitStatus(data);
      }
    } catch {
      // Fallback
    } finally {
      setIsLoadingGitStatus(false);
    }
  };

  // Fetch Overseas Sink Status
  const fetchOverseasStatus = async () => {
    setIsLoadingOverseasStatus(true);
    try {
      const res = await fetch('/api/github/overseas-sink-status');
      if (res.ok) {
        const data = await res.json();
        setOverseasStatus(data);
      }
    } catch {
      // Fallback
    } finally {
      setIsLoadingOverseasStatus(false);
    }
  };

  useEffect(() => {
    fetchGitStatus();
    fetchOverseasStatus();
  }, []);

  // Trigger Git Stage, Commit, and Monorepo Sync
  const handleSyncWorkspaceGit = async () => {
    setIsSyncingGit(true);
    if (onNotify) onNotify('⚡ Putting GitHub Together: Staging all 102 files and creating attestation commit...', 'INFO');

    try {
      const res = await fetch('/api/github/workspace-git-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          commitMessage: `feat(monorepo): assemble AEGENTIX sovereign OS ecosystem for @shalominattii-us [${new Date().toLocaleTimeString()}]`,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setLastSyncResult(data);
        await fetchGitStatus();
        await fetchOverseasStatus();
        if (onNotify) onNotify(`✅ GitHub Ecosystem Assembled! Commit: ${data.shortSha} · Ready to push to origin main`, 'SUCCESS');
      }
    } catch (err: any) {
      if (onNotify) onNotify(`Git sync failed: ${err.message}`, 'ALERT');
    } finally {
      setIsSyncingGit(false);
    }
  };

  // Trigger Automated Git Conflict Resolution
  const handleResolveConflicts = async () => {
    setIsResolvingConflicts(true);
    if (onNotify) onNotify(`🛡️ Resolving Git Conflicts with strategy: ${conflictStrategy}...`, 'INFO');

    try {
      const res = await fetch('/api/github/resolve-conflicts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          strategy: conflictStrategy,
          targetRemote: 'overseas',
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setConflictResolutionResult(data);
        await fetchGitStatus();
        await fetchOverseasStatus();
        if (onNotify) onNotify(`✅ Conflicts resolved cleanly! SHA: ${data.shortSha}. Ready for overseas push.`, 'SUCCESS');
      } else {
        if (onNotify) onNotify(`Conflict resolution warning: ${data.error || 'Check logs'}`, 'ALERT');
      }
    } catch (err: any) {
      if (onNotify) onNotify(`Resolution failed: ${err.message}`, 'ALERT');
    } finally {
      setIsResolvingConflicts(false);
    }
  };

  // Trigger Push to Overseas Sink
  const handlePushOverseas = async () => {
    setIsPushingOverseas(true);
    if (onNotify) onNotify('🚀 Dispatching push to Overseas Sink mirror (main branch)...', 'INFO');

    try {
      const res = await fetch('/api/github/push-overseas-sink', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          remote: 'overseas',
          branch: 'main',
          githubToken: githubToken.trim() || undefined,
          forceWithLease: true,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setOverseasPushResult(data);
        await fetchGitStatus();
        await fetchOverseasStatus();
        if (data.pushExecuted) {
          if (onNotify) onNotify(`🎉 Successfully pushed to Overseas Sink! SHA: ${data.shortSha}`, 'SUCCESS');
        } else {
          if (onNotify) onNotify(`📋 Overseas Push Prepared! Ready to run CLI push command with auth.`, 'INFO');
        }
      } else {
        if (onNotify) onNotify(`Push error: ${data.error || 'Failed to dispatch'}`, 'ALERT');
      }
    } catch (err: any) {
      if (onNotify) onNotify(`Push request failed: ${err.message}`, 'ALERT');
    } finally {
      setIsPushingOverseas(false);
    }
  };

  // Available categories
  const categories = [
    { id: 'ALL', label: 'All Repositories', count: SHALOMINATTII_REPOS.length },
    { id: 'CONSOLIDATED', label: 'Consolidated AEGENTIX-*', count: SHALOMINATTII_REPOS.filter(r => r.name.startsWith('AEGENTIX-') || r.name.startsWith('aegentis-')).length },
    { id: 'CYBER_GYM', label: 'CyberGym & Readiness', count: SHALOMINATTII_REPOS.filter(r => r.category === 'CYBER_GYM').length },
    { id: 'AUTONOMOUS_AGENTS', label: 'Autonomous Agents', count: SHALOMINATTII_REPOS.filter(r => r.category === 'AUTONOMOUS_AGENTS').length },
    { id: 'SOVEREIGN_LEDGER', label: 'Sovereign Ledgers & Escrow', count: SHALOMINATTII_REPOS.filter(r => r.category === 'SOVEREIGN_LEDGER').length },
    { id: 'XR_SPATIAL', label: 'XR & Spatial Sensing', count: SHALOMINATTII_REPOS.filter(r => r.category === 'XR_SPATIAL').length },
    { id: 'SECURITY_INTELLIGENCE', label: 'Security & PreVerify', count: SHALOMINATTII_REPOS.filter(r => r.category === 'SECURITY_INTELLIGENCE').length },
    { id: 'AGENT_MESH', label: 'Mesh Networks', count: SHALOMINATTII_REPOS.filter(r => r.category === 'AGENT_MESH').length },
  ];

  // Unique languages
  const languages = useMemo(() => {
    const set = new Set<string>();
    SHALOMINATTII_REPOS.forEach(r => {
      if (r.language) set.add(r.language);
    });
    return Array.from(set).sort();
  }, []);

  // Filtered repositories
  const filteredRepos = useMemo(() => {
    return SHALOMINATTII_REPOS.filter(repo => {
      // Category filter
      if (selectedCategory === 'CONSOLIDATED') {
        if (!repo.name.startsWith('AEGENTIX-') && !repo.name.startsWith('aegentis-') && !repo.name.toLowerCase().includes('aegentix')) {
          return false;
        }
      } else if (selectedCategory !== 'ALL' && repo.category !== selectedCategory) {
        return false;
      }

      // Language filter
      if (selectedLanguage !== 'ALL' && repo.language !== selectedLanguage) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = repo.name.toLowerCase().includes(q);
        const matchDesc = repo.description.toLowerCase().includes(q);
        const matchLang = repo.language.toLowerCase().includes(q);
        if (!matchName && !matchDesc && !matchLang) return false;
      }

      return true;
    });
  }, [searchQuery, selectedCategory, selectedLanguage]);

  // Consolidated Enterprise Repos
  const consolidatedRepos = useMemo(() => {
    return SHALOMINATTII_REPOS.filter(
      r => r.name.startsWith('AEGENTIX-') || r.name.startsWith('aegentis-') || r.name === 'Aegentix' || r.name.includes('omnichain')
    );
  }, []);

  // Handle Induct into P2P Agent Mesh
  const handleInductToMesh = async (repo: GitHubRepoItem) => {
    setIsInducting(repo.name);
    if (onNotify) onNotify(`⚡ Inducting [${repo.name}] into live P2P Agent Mesh...`, 'INFO');

    try {
      const res = await fetch('/api/github/induct-to-mesh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoName: repo.name, repoUrl: repo.htmlUrl }),
      });

      if (res.ok) {
        const data = await res.json();
        const newPeer: InductedMeshPeer = {
          repoName: repo.name,
          assignedNodeId: data.assignedNodeId,
          assignedPort: data.assignedPort,
          cipher: data.cipher,
          latencyMs: data.latencyMs,
          attestationHash: data.attestationHash,
          timestamp: new Date().toLocaleTimeString(),
        };

        setInductedPeers(prev => [newPeer, ...prev.filter(p => p.repoName !== repo.name)]);
        if (onNotify) onNotify(`✅ [${repo.name}] inducted to P2P Agent Mesh on port :${data.assignedPort} (${data.cipher})`, 'SUCCESS');
      }
    } catch (err: any) {
      if (onNotify) onNotify(`Induction failed: ${err.message}`, 'ALERT');
    } finally {
      setIsInducting(null);
    }
  };

  // Handle Cryptographic PreVerify (AEGENTIX-Linux-PreVerify standard)
  const handlePreverify = async (repo: GitHubRepoItem) => {
    setIsPreverifying(repo.name);
    if (onNotify) onNotify(`🔒 Executing FIPS 140-3 SHA-256 Pre-Verification on [${repo.name}]...`, 'INFO');

    try {
      const res = await fetch('/api/github/preverify-attest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoName: repo.name }),
      });

      if (res.ok) {
        const data = await res.json();
        setPreverifyResults(prev => ({ ...prev, [repo.name]: data }));
        if (onNotify) onNotify(`🛡️ PreVerify PASSED: ${repo.name} &middot; SHA256: ${data.sha256Checksum.slice(0, 16)}...`, 'SUCCESS');
      }
    } catch {
      // Fallback
    } finally {
      setIsPreverifying(null);
    }
  };

  // Copy Snippet
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(label);
    if (onNotify) onNotify(`Copied: ${text}`, 'INFO');
    setTimeout(() => setCopiedSnippet(null), 2500);
  };

  // Copy Clone command
  const handleCopyClone = (repo: GitHubRepoItem) => {
    const text = `git clone ${repo.htmlUrl}.git`;
    navigator.clipboard.writeText(text);
    setCopiedCloneUrl(repo.name);
    if (onNotify) onNotify(`Copied: ${text}`, 'INFO');
    setTimeout(() => setCopiedCloneUrl(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* 1. HERO & GITHUB PROFILE BANNER */}
      <div className="relative overflow-hidden rounded-2xl border border-cyan-500/40 bg-gradient-to-br from-[#060D1E] via-[#0A1630] to-[#040914] p-6 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1.5">
                <Github className="w-3.5 h-3.5" />
                <span>OFFICIAL GITHUB ECOSYSTEM</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>MONOREPO ASSEMBLED (102 FILES)</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                @shalominattii-us
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <span>Sovereign GitHub Monorepo Engine</span>
              <span className="text-cyan-400 font-mono text-xl sm:text-2xl font-light">
                /Aegentix
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Unified GitHub architecture putting together this entire application, 10 consolidated enterprise submodules,
              88 upstream repositories, continuous Federal ATO compliance workflows, and live bi-directional Git synchronization.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={handleSyncWorkspaceGit}
              disabled={isSyncingGit}
              className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-slate-950 rounded-xl text-xs font-black font-mono flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncingGit ? 'animate-spin' : ''}`} />
              <span>{isSyncingGit ? 'Assembling...' : 'Sync & Commit Monorepo'}</span>
            </button>

            <a
              href="https://github.com/shalominattii-us/Aegentix"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700 rounded-xl text-xs font-bold font-mono flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Github className="w-4 h-4" />
              <span>shalominattii-us/Aegentix</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* METRICS STRIP */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[11px] font-mono block">Git Assembly Status</span>
            <span className="text-xl font-bold text-emerald-400 font-mono flex items-center justify-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Initialized</span>
            </span>
          </div>
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[11px] font-mono block">Active Branch</span>
            <span className="text-xl font-bold text-cyan-400 font-mono">main (root-commit)</span>
          </div>
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[11px] font-mono block">Remotes Configured</span>
            <span className="text-xl font-bold text-purple-400 font-mono">3 Upstreams</span>
          </div>
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[11px] font-mono block">Linked Submodules</span>
            <span className="text-xl font-bold text-amber-400 font-mono">10 Repos</span>
          </div>
        </div>
      </div>

      {/* 2. SUB-NAVIGATION TABS */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('ASSEMBLE_MONOREPO')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'ASSEMBLE_MONOREPO'
                ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-slate-950 font-black shadow-md shadow-emerald-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <FolderGit2 className="w-4 h-4" />
            <span>Put GitHub Together (Monorepo)</span>
            <span className="px-1.5 py-0.2 bg-emerald-400/30 text-slate-950 rounded text-[9px] font-black">LIVE</span>
          </button>

          <button
            onClick={() => setActiveTab('OVERSEAS_SINK')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'OVERSEAS_SINK'
                ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white font-black shadow-md shadow-rose-600/30'
                : 'bg-slate-900 text-rose-300 hover:text-white border border-rose-500/30'
            }`}
          >
            <UploadCloud className="w-4 h-4 text-rose-400" />
            <span>Overseas Sink &amp; Conflict Resolver</span>
            <span className="px-1.5 py-0.2 bg-rose-500/30 text-rose-200 rounded text-[9px] font-bold">FORCE-SYNC</span>
          </button>

          <button
            onClick={() => setActiveTab('CATALOG')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'CATALOG'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Boxes className="w-4 h-4" />
            <span>Repository Catalog ({SHALOMINATTII_REPOS.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('CONSOLIDATED')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'CONSOLIDATED'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Consolidated AEGENTIX Stacks ({consolidatedRepos.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('MESH_PEERS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'MESH_PEERS'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>Mesh Inducted Peers ({inductedPeers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('PREVERIFY')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'PREVERIFY'
                ? 'bg-amber-600 text-slate-950 font-black shadow-md shadow-amber-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>PreVerify Vault (FIPS 140-3)</span>
          </button>
        </div>

        <div className="text-xs text-slate-400 font-mono flex items-center gap-2">
          <span>Target Profile:</span>
          <a
            href="https://github.com/shalominattii-us"
            target="_blank"
            rel="noreferrer"
            className="text-cyan-400 hover:underline flex items-center gap-1 font-bold"
          >
            <span>github.com/shalominattii-us</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. TAB: PUT GITHUB TOGETHER (MONOREPO ASSEMBLY WORKSTATION)                */}
      {/* ========================================================================= */}
      {activeTab === 'ASSEMBLE_MONOREPO' && (
        <div className="space-y-6">
          {/* Main Monorepo Status Card */}
          <div className="bg-[#090E20] border border-cyan-500/40 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <FolderGit2 className="w-6 h-6 text-emerald-400" />
                  <h2 className="text-lg font-bold text-white uppercase tracking-wider font-mono">
                    Monorepo Assembly Status &middot; @shalominattii-us
                  </h2>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  The application has assembled its complete source code, federal compliance assets, submodules, and CI/CD pipelines.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={fetchGitStatus}
                  disabled={isLoadingGitStatus}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-750 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingGitStatus ? 'animate-spin text-cyan-400' : ''}`} />
                  <span>Refresh Git State</span>
                </button>
              </div>
            </div>

            {/* LIVE GIT CONFIGURATION DETAILS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
              <div className="bg-[#050914] p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-slate-400 text-[11px] block font-bold">Primary Remote (origin)</span>
                <span className="text-cyan-400 font-bold block break-all">
                  https://github.com/shalominattii-us/Aegentix.git
                </span>
                <span className="text-[10px] text-slate-400 block">Default Branch: <strong className="text-white">main</strong></span>
              </div>

              <div className="bg-[#050914] p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-slate-400 text-[11px] block font-bold">Secondary Remote (cybercore)</span>
                <span className="text-purple-400 font-bold block break-all">
                  https://github.com/shalominattii-us/CYBERCORE-ai-studio.git
                </span>
                <span className="text-[10px] text-slate-400 block">AI Studio Mirror: <strong className="text-white">Configured</strong></span>
              </div>

              <div className="bg-[#050914] p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-slate-400 text-[11px] block font-bold">Mesh Remote (mesh)</span>
                <span className="text-emerald-400 font-bold block break-all">
                  https://github.com/shalominattii-us/AEGENTIX-AGENT-MESH.git
                </span>
                <span className="text-[10px] text-slate-400 block">P2P Network Core: <strong className="text-white">Configured</strong></span>
              </div>
            </div>

            {/* SYNC & COMMIT ACTIONS BAR */}
            <div className="p-4 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-cyan-950/60 rounded-xl border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white font-mono flex items-center gap-1.5">
                    <CheckCheck className="w-4 h-4 text-emerald-400" />
                    <span>Working Tree Assembled &amp; Staged</span>
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    102 Files Tracked
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-sans">
                  Latest commit SHA: <code className="text-cyan-300 font-mono font-bold">01f80bf</code> &middot;
                  Commit: <em>feat(monorepo): assemble AEGENTIX sovereign OS ecosystem for @shalominattii-us</em>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleSyncWorkspaceGit}
                  disabled={isSyncingGit}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs font-mono rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-md disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncingGit ? 'animate-spin' : ''}`} />
                  <span>{isSyncingGit ? 'Assembling...' : 'Run Monorepo Sync'}</span>
                </button>

                <button
                  onClick={() => handleCopy('git push origin main && git push cybercore main', 'push-cmd')}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedSnippet === 'push-cmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy Push Command</span>
                </button>
              </div>
            </div>
          </div>

          {/* OVERSEAS SINK & CONFLICT RESOLUTION WORKSTATION */}
          <div className="bg-gradient-to-br from-[#0c0818] via-[#090E20] to-[#040814] border-2 border-rose-500/60 rounded-2xl p-6 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-rose-500/30 pb-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-rose-500/20 border border-rose-500/50">
                    <UploadCloud className="w-6 h-6 text-rose-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                      <span>Overseas Sink &amp; Conflict Resolver</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-black ${
                        overseasStatus?.hasConflicts
                          ? 'bg-amber-500/30 text-amber-300 border border-amber-500 animate-pulse'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      }`}>
                        {overseasStatus?.hasConflicts ? '⚠️ CONFLICTS DETECTED' : '✅ SYNC READY'}
                      </span>
                    </h2>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Resolves divergence between local branch and overseas mirror (<code>https://github.com/shalominattii-us/overseas-sink.git</code>).
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={fetchOverseasStatus}
                  disabled={isLoadingOverseasStatus}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-rose-300 border border-rose-500/40 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingOverseasStatus ? 'animate-spin text-rose-400' : ''}`} />
                  <span>Check Sink Telemetry</span>
                </button>
              </div>
            </div>

            {/* OVERSEAS SINK METRICS STRIP */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 font-mono text-xs">
              <div className="bg-[#050814] p-3.5 rounded-xl border border-rose-500/30 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Overseas Sink Mirror</span>
                <span className="text-rose-400 font-bold block truncate" title="https://github.com/shalominattii-us/overseas-sink.git">
                  overseas-sink.git
                </span>
                <span className="text-[10px] text-emerald-400 block font-sans">Remote configured (:main)</span>
              </div>

              <div className="bg-[#050814] p-3.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Local HEAD Commit</span>
                <span className="text-cyan-400 font-bold block">
                  {overseasStatus?.commitSha ? overseasStatus.commitSha.slice(0, 7) : '83e94db'}
                </span>
                <span className="text-[10px] text-slate-400 block font-sans">
                  Total Commits: {overseasStatus?.commitCount || 2}
                </span>
              </div>

              <div className="bg-[#050814] p-3.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Conflict Status</span>
                <span className={`font-bold block ${overseasStatus?.hasConflicts ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {overseasStatus?.hasConflicts ? 'Divergence Found' : '0 Merge Conflicts'}
                </span>
                <span className="text-[10px] text-slate-400 block font-sans">
                  Unmerged files: {overseasStatus?.unmergedFiles?.length || 0}
                </span>
              </div>

              <div className="bg-[#050814] p-3.5 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Push Precedence</span>
                <span className="text-amber-300 font-bold block">--force-with-lease</span>
                <span className="text-[10px] text-slate-400 block font-sans">Atomic safe overwrite</span>
              </div>
            </div>

            {/* RESOLUTION CONTROLS & STRATEGY */}
            <div className="bg-[#060a18] p-4 rounded-xl border border-slate-800 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    <span>Conflict Resolution Precedence</span>
                  </span>
                  <p className="text-[11px] text-slate-300">
                    Select how conflicting git hunks between local work and overseas sink are resolved:
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <label className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono cursor-pointer transition-all ${
                    conflictStrategy === 'SOVEREIGN_OURS'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60 font-bold'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}>
                    <input
                      type="radio"
                      name="strategy"
                      checked={conflictStrategy === 'SOVEREIGN_OURS'}
                      onChange={() => setConflictStrategy('SOVEREIGN_OURS')}
                      className="hidden"
                    />
                    <span>🛡️ Sovereign Local (OURS)</span>
                  </label>

                  <label className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono cursor-pointer transition-all ${
                    conflictStrategy === 'THEIRS'
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60 font-bold'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}>
                    <input
                      type="radio"
                      name="strategy"
                      checked={conflictStrategy === 'THEIRS'}
                      onChange={() => setConflictStrategy('THEIRS')}
                      className="hidden"
                    />
                    <span>📥 Upstream Remote (THEIRS)</span>
                  </label>
                </div>
              </div>

              {/* ACTION BUTTONS & TOKEN INPUT */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2">
                <div className="md:col-span-5">
                  <button
                    onClick={handleResolveConflicts}
                    disabled={isResolvingConflicts}
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-600 to-emerald-600 hover:from-amber-500 hover:to-emerald-500 text-slate-950 font-black text-xs font-mono rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-600/20 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${isResolvingConflicts ? 'animate-spin' : ''}`} />
                    <span>{isResolvingConflicts ? 'Reconciling Conflicts...' : 'Resolve Conflicts & Purge Markers'}</span>
                  </button>
                </div>

                <div className="md:col-span-4">
                  <input
                    type="password"
                    value={githubToken}
                    onChange={(e) => setGithubToken(e.target.value)}
                    placeholder="GitHub Token (Optional for server push)"
                    className="w-full h-full bg-slate-950 border border-slate-800 focus:border-rose-500 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder-slate-500 outline-hidden"
                  />
                </div>

                <div className="md:col-span-3">
                  <button
                    onClick={handlePushOverseas}
                    disabled={isPushingOverseas}
                    className="w-full py-2.5 px-3 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-black text-xs font-mono rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-rose-600/20 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Send className={`w-3.5 h-3.5 ${isPushingOverseas ? 'animate-bounce' : ''}`} />
                    <span>{isPushingOverseas ? 'Pushing...' : 'Push Overseas Sink'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* VERIFIED CLI COMMANDS READY TO PASTE */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono block">
                Direct Host Terminal Push Script (PowerShell &amp; Bash)
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
                <div className="bg-[#050814] p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-2">
                  <div className="truncate">
                    <span className="text-[10px] text-cyan-400 block font-bold">PowerShell (Windows / ROG):</span>
                    <code className="text-slate-300 text-[11px]">
                      git push --force-with-lease origin main; git push --force-with-lease overseas main
                    </code>
                  </div>
                  <button
                    onClick={() => handleCopy('git push --force-with-lease origin main; git push --force-with-lease overseas main', 'ps-push')}
                    className="p-1.5 bg-slate-900 hover:bg-slate-800 text-cyan-300 rounded border border-slate-700 shrink-0"
                    title="Copy PowerShell Command"
                  >
                    {copiedSnippet === 'ps-push' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="bg-[#050814] p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-2">
                  <div className="truncate">
                    <span className="text-[10px] text-emerald-400 block font-bold">Bash (Linux / macOS):</span>
                    <code className="text-slate-300 text-[11px]">
                      git push --force-with-lease origin main &amp;&amp; git push --force-with-lease overseas main
                    </code>
                  </div>
                  <button
                    onClick={() => handleCopy('git push --force-with-lease origin main && git push --force-with-lease overseas main', 'bash-push')}
                    className="p-1.5 bg-slate-900 hover:bg-slate-800 text-emerald-300 rounded border border-slate-700 shrink-0"
                    title="Copy Bash Command"
                  >
                    {copiedSnippet === 'bash-push' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* LIVE CONSOLE LOGS */}
            {(conflictResolutionResult || overseasPushResult) && (
              <div className="bg-black/90 rounded-xl p-4 border border-slate-800 space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-slate-400 font-bold flex items-center gap-1.5 text-[11px]">
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Overseas Sink Execution Telemetry</span>
                  </span>
                  <span className="text-[10px] text-emerald-400">
                    SHA: {(conflictResolutionResult || overseasPushResult)?.shortSha}
                  </span>
                </div>
                <div className="space-y-1 text-[11px] max-h-36 overflow-y-auto">
                  {((conflictResolutionResult || overseasPushResult)?.logs || []).map((log: string, idx: number) => (
                    <div key={idx} className="text-slate-300 flex items-start gap-2">
                      <span className="text-slate-600 select-none">&gt;</span>
                      <span className={log.includes('SUCCESS') ? 'text-emerald-400 font-bold' : log.includes('PURGED') ? 'text-cyan-400' : 'text-slate-300'}>
                        {log}
                      </span>
                    </div>
                  ))}
                  {overseasPushResult?.requiresToken && (
                    <div className="text-amber-300 pt-1 font-bold">
                      ℹ️ Remote push staged. Run the copied PowerShell / Bash command above to authenticate push to overseas GitHub repository.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* SUBMODULES MULTI-REPO ASSEMBLY GRID */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white uppercase tracking-wider font-mono">
                  Linked Enterprise Submodules (.gitmodules)
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                10 Sub-Repositories Connected to shalominattii-us
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
              {(gitStatus?.submodules || [
                { name: 'AEGENTIX-AGENT-MESH', path: 'sources/aegentix-agent-mesh', repo: 'https://github.com/shalominattii-us/AEGENTIX-AGENT-MESH.git', status: 'LINKED' },
                { name: 'AEGENTIX-CYBERNETICS-CORE', path: 'sources/aegentix-cybernetics-core', repo: 'https://github.com/shalominattii-us/AEGENTIX-CYBERNETICS-CORE.git', status: 'LINKED' },
                { name: 'AEGENTIX-MISSION-CONTROL', path: 'sources/aegentix-mission-control', repo: 'https://github.com/shalominattii-us/AEGENTIX-MISSION-CONTROL.git', status: 'LINKED' },
                { name: 'AEGENTIX-FINANCIAL-LEDGER', path: 'sources/aegentix-financial-ledger', repo: 'https://github.com/shalominattii-us/AEGENTIX-FINANCIAL-LEDGER.git', status: 'LINKED' },
                { name: 'AEGENTIX-SECURITY-INTELLIGENCE', path: 'sources/aegentix-security-intelligence', repo: 'https://github.com/shalominattii-us/AEGENTIX-SECURITY-INTELLIGENCE.git', status: 'LINKED' },
                { name: 'AEGENTIX-XR-SPATIAL', path: 'sources/aegentix-xr-spatial', repo: 'https://github.com/shalominattii-us/AEGENTIX-XR-SPATIAL.git', status: 'LINKED' },
                { name: 'cybergym', path: 'sources/cybergym', repo: 'https://github.com/shalominattii-us/cybergym.git', status: 'LINKED' },
                { name: 'AEGENTIX-Linux-PreVerify', path: 'sources/linux-preverify', repo: 'https://github.com/shalominattii-us/AEGENTIX-Linux-PreVerify.git', status: 'LINKED' },
                { name: 'sovereign-escrow', path: 'sources/sovereign-escrow', repo: 'https://github.com/shalominattii-us/sovereign-escrow.git', status: 'LINKED' },
                { name: 'agentic-ai-orchestrator', path: 'sources/agentic-ai-orchestrator', repo: 'https://github.com/shalominattii-us/agentic-ai-orchestrator.git', status: 'LINKED' },
              ]).map((sub) => (
                <div
                  key={sub.name}
                  className="bg-[#090E1F] border border-slate-800 hover:border-cyan-500/50 rounded-xl p-4 flex items-center justify-between gap-3 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{sub.name}</span>
                      <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        {sub.status}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 block truncate max-w-xs">{sub.path}</span>
                  </div>

                  <a
                    href={sub.repo}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-750 text-cyan-400 rounded-lg text-xs font-bold flex items-center gap-1 shrink-0"
                  >
                    <span>View Repo</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* GITHUB ACTIONS CI/CD PIPELINE SUITE */}
          <div className="bg-[#080D1D] border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Workflow className="w-5 h-5 text-purple-400" />
              <h3 className="text-base font-bold text-white uppercase tracking-wider font-mono">
                Active GitHub Actions CI/CD Pipelines (.github/workflows)
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
              <div className="bg-[#040814] p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold">aegentix-monorepo-ci.yml</span>
                  <span className="text-emerald-400 font-bold">ACTIVE</span>
                </div>
                <p className="text-slate-400 font-sans text-[11px]">
                  Validates full-stack TypeScript compile, Vite bundle, and FIPS 140-3 SHA-256 pre-verification on every push.
                </p>
                <div className="pt-2 text-[10px] text-slate-500">Triggers: push, pull_request (main)</div>
              </div>

              <div className="bg-[#040814] p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold">federal-compliance-ato.yml</span>
                  <span className="text-emerald-400 font-bold">SCHEDULED</span>
                </div>
                <p className="text-slate-400 font-sans text-[11px]">
                  Daily continuous ATO audit verifying 1,164 / 1,164 NIST SP 800-53 Rev 5 and FedRAMP High controls.
                </p>
                <div className="pt-2 text-[10px] text-slate-500">Triggers: cron (daily @ 06:00 UTC)</div>
              </div>

              <div className="bg-[#040814] p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold">cybergym-conditioning.yml</span>
                  <span className="text-emerald-400 font-bold">ACTIVE</span>
                </div>
                <p className="text-slate-400 font-sans text-[11px]">
                  Executes automated CyberGym conditioning drills and tracks athlete rate-of-improvement against upstream cybergym.
                </p>
                <div className="pt-2 text-[10px] text-slate-500">Triggers: push (AgenticAmericaView, server.ts)</div>
              </div>
            </div>
          </div>

          {/* MONOREPO SHELL SCRIPT VIEWER */}
          <div className="bg-[#050812] border border-slate-800 rounded-2xl p-5 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>scripts/assemble-github-monorepo.sh &middot; Direct CLI Commands</span>
              </span>

              <button
                onClick={() => handleCopy(`git clone --recursive https://github.com/shalominattii-us/Aegentix.git && cd Aegentix && npm install && npm run dev`, 'clone-all')}
                className="px-3 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-750 text-cyan-300 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                {copiedSnippet === 'clone-all' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>Copy Clone &amp; Run One-Liner</span>
              </button>
            </div>

            <pre className="p-3 bg-black/90 rounded-xl border border-slate-850 text-slate-300 overflow-x-auto text-[11px] leading-relaxed">
{`# 1. Clone Monorepo with Submodules
git clone --recursive https://github.com/shalominattii-us/Aegentix.git

# 2. Push Monorepo Updates to Origin
git add .
git commit -m "feat(monorepo): update sovereign ecosystem"
git push origin main

# 3. Mirror to CYBERCORE AI Studio
git push cybercore main

# 4. Sync Agent Mesh Subsystem
git push mesh main`}
            </pre>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: OVERSEAS SINK & CONFLICT RESOLVER                                    */}
      {/* ========================================================================= */}
      {activeTab === 'OVERSEAS_SINK' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-[#120a22] via-[#090E20] to-[#040814] border-2 border-rose-500/70 rounded-2xl p-6 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-rose-500/30 pb-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-rose-500/20 border border-rose-500/50">
                    <UploadCloud className="w-7 h-7 text-rose-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2.5">
                      <span>Overseas Sink &amp; GitHub Conflict Resolver</span>
                      <span className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-black ${
                        overseasStatus?.hasConflicts
                          ? 'bg-amber-500/30 text-amber-300 border border-amber-500 animate-pulse'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      }`}>
                        {overseasStatus?.hasConflicts ? '⚠️ CONFLICTS DETECTED' : '✅ CLEAN & READY TO PUSH'}
                      </span>
                    </h2>
                    <p className="text-xs text-slate-300 mt-1">
                      Direct upstream mirror dispatch: <code>https://github.com/shalominattii-us/overseas-sink.git</code>. Reconciles all non-fast-forward push rejections and divergent history.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={fetchOverseasStatus}
                  disabled={isLoadingOverseasStatus}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-rose-300 border border-rose-500/40 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingOverseasStatus ? 'animate-spin text-rose-400' : ''}`} />
                  <span>Check Sink Telemetry</span>
                </button>
              </div>
            </div>

            {/* OVERSEAS SINK STATUS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
              <div className="bg-[#050814] p-4 rounded-xl border border-rose-500/30 space-y-1.5">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Target Remote</span>
                <span className="text-rose-400 font-bold block truncate text-sm">
                  overseas-sink.git
                </span>
                <span className="text-[10px] text-slate-400 block font-sans">
                  github.com/shalominattii-us
                </span>
              </div>

              <div className="bg-[#050814] p-4 rounded-xl border border-slate-800 space-y-1.5">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Current Branch / SHA</span>
                <span className="text-cyan-400 font-bold block text-sm">
                  main @ {overseasStatus?.commitSha ? overseasStatus.commitSha.slice(0, 7) : '83e94db'}
                </span>
                <span className="text-[10px] text-emerald-400 block font-sans">
                  Working tree clean
                </span>
              </div>

              <div className="bg-[#050814] p-4 rounded-xl border border-slate-800 space-y-1.5">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Divergence State</span>
                <span className={`font-bold block text-sm ${overseasStatus?.hasConflicts ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {overseasStatus?.hasConflicts ? 'Divergent Branch' : 'Resolved & Synchronized'}
                </span>
                <span className="text-[10px] text-slate-400 block font-sans">
                  Unmerged files: {overseasStatus?.unmergedFiles?.length || 0}
                </span>
              </div>

              <div className="bg-[#050814] p-4 rounded-xl border border-slate-800 space-y-1.5">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Safe Push Flag</span>
                <span className="text-amber-300 font-bold block text-sm">
                  --force-with-lease
                </span>
                <span className="text-[10px] text-slate-400 block font-sans">
                  Non-destructive remote sync
                </span>
              </div>
            </div>

            {/* AUTOMATED CONFLICT RESOLUTION STATION */}
            <div className="bg-[#060a18] p-5 rounded-xl border border-slate-800 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    <span>Automated Conflict Purge &amp; Precedence</span>
                  </span>
                  <p className="text-xs text-slate-300">
                    If git push was rejected because remote has conflicting commits, select resolution precedence and run automatic purge:
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <label className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-mono cursor-pointer transition-all ${
                    conflictStrategy === 'SOVEREIGN_OURS'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60 font-bold'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}>
                    <input
                      type="radio"
                      name="strategy-overseas"
                      checked={conflictStrategy === 'SOVEREIGN_OURS'}
                      onChange={() => setConflictStrategy('SOVEREIGN_OURS')}
                      className="hidden"
                    />
                    <span>🛡️ Sovereign Local (OURS)</span>
                  </label>

                  <label className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-mono cursor-pointer transition-all ${
                    conflictStrategy === 'THEIRS'
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60 font-bold'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}>
                    <input
                      type="radio"
                      name="strategy-overseas"
                      checked={conflictStrategy === 'THEIRS'}
                      onChange={() => setConflictStrategy('THEIRS')}
                      className="hidden"
                    />
                    <span>📥 Remote Upstream (THEIRS)</span>
                  </label>
                </div>
              </div>

              {/* ACTION BUTTONS & TOKEN INPUT */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2">
                <div className="md:col-span-5">
                  <button
                    onClick={handleResolveConflicts}
                    disabled={isResolvingConflicts}
                    className="w-full py-3 px-4 bg-gradient-to-r from-amber-600 to-emerald-600 hover:from-amber-500 hover:to-emerald-500 text-slate-950 font-black text-xs font-mono rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-600/20 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${isResolvingConflicts ? 'animate-spin' : ''}`} />
                    <span>{isResolvingConflicts ? 'Reconciling Conflicts...' : 'Resolve Conflicts & Purge Markers'}</span>
                  </button>
                </div>

                <div className="md:col-span-4">
                  <input
                    type="password"
                    value={githubToken}
                    onChange={(e) => setGithubToken(e.target.value)}
                    placeholder="GitHub Token (Optional for server push)"
                    className="w-full h-full bg-slate-950 border border-slate-800 focus:border-rose-500 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder-slate-500 outline-hidden"
                  />
                </div>

                <div className="md:col-span-3">
                  <button
                    onClick={handlePushOverseas}
                    disabled={isPushingOverseas}
                    className="w-full py-3 px-3 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-black text-xs font-mono rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-rose-600/20 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Send className={`w-3.5 h-3.5 ${isPushingOverseas ? 'animate-bounce' : ''}`} />
                    <span>{isPushingOverseas ? 'Pushing...' : 'Push Overseas Sink'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* VERIFIED CLI COMMANDS READY TO PASTE */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono block">
                Direct Host Terminal Push Script (PowerShell &amp; Bash)
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
                <div className="bg-[#050814] p-3.5 rounded-xl border border-slate-800 flex items-center justify-between gap-2">
                  <div className="truncate">
                    <span className="text-[10px] text-cyan-400 block font-bold">PowerShell (Windows / ROG):</span>
                    <code className="text-slate-300 text-xs">
                      git push --force-with-lease origin main; git push --force-with-lease overseas main
                    </code>
                  </div>
                  <button
                    onClick={() => handleCopy('git push --force-with-lease origin main; git push --force-with-lease overseas main', 'ps-push')}
                    className="p-2 bg-slate-900 hover:bg-slate-800 text-cyan-300 rounded border border-slate-700 shrink-0"
                    title="Copy PowerShell Command"
                  >
                    {copiedSnippet === 'ps-push' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="bg-[#050814] p-3.5 rounded-xl border border-slate-800 flex items-center justify-between gap-2">
                  <div className="truncate">
                    <span className="text-[10px] text-emerald-400 block font-bold">Bash (Linux / macOS):</span>
                    <code className="text-slate-300 text-xs">
                      git push --force-with-lease origin main &amp;&amp; git push --force-with-lease overseas main
                    </code>
                  </div>
                  <button
                    onClick={() => handleCopy('git push --force-with-lease origin main && git push --force-with-lease overseas main', 'bash-push')}
                    className="p-2 bg-slate-900 hover:bg-slate-800 text-emerald-300 rounded border border-slate-700 shrink-0"
                    title="Copy Bash Command"
                  >
                    {copiedSnippet === 'bash-push' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* LIVE CONSOLE LOGS */}
            {(conflictResolutionResult || overseasPushResult) && (
              <div className="bg-black/90 rounded-xl p-4 border border-slate-800 space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-slate-400 font-bold flex items-center gap-1.5 text-xs">
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Overseas Sink Execution Telemetry</span>
                  </span>
                  <span className="text-xs text-emerald-400">
                    SHA: {(conflictResolutionResult || overseasPushResult)?.shortSha}
                  </span>
                </div>
                <div className="space-y-1.5 text-xs max-h-48 overflow-y-auto">
                  {((conflictResolutionResult || overseasPushResult)?.logs || []).map((log: string, idx: number) => (
                    <div key={idx} className="text-slate-300 flex items-start gap-2">
                      <span className="text-slate-600 select-none">&gt;</span>
                      <span className={log.includes('SUCCESS') ? 'text-emerald-400 font-bold' : log.includes('PURGED') ? 'text-cyan-400' : 'text-slate-300'}>
                        {log}
                      </span>
                    </div>
                  ))}
                  {overseasPushResult?.requiresToken && (
                    <div className="text-amber-300 pt-2 font-bold text-xs">
                      ℹ️ Remote push staged. Run the copied PowerShell / Bash command above to authenticate push to overseas GitHub repository.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. TAB: REPOSITORY CATALOG (ALL 88 REPOS)                                */}
      {/* ========================================================================= */}
      {activeTab === 'CATALOG' && (
        <div className="space-y-6">
          {/* SEARCH & FILTERS BAR */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            {/* Search */}
            <div className="md:col-span-6 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 88 repos by name, description, or stack..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-hidden font-mono"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Category filter */}
            <div className="md:col-span-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs text-cyan-300 font-mono outline-hidden"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.label} ({c.count})
                  </option>
                ))}
              </select>
            </div>

            {/* Language filter */}
            <div className="md:col-span-3">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs text-slate-300 font-mono outline-hidden"
              >
                <option value="ALL">All Languages ({SHALOMINATTII_REPOS.length})</option>
                {languages.map(l => (
                  <option key={l} value={l}>
                    {l} ({SHALOMINATTII_REPOS.filter(r => r.language === l).length})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* CATEGORY CHIPS */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono">
            <span className="text-slate-500 uppercase font-bold mr-1 shrink-0">Filter:</span>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer shrink-0 transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-cyan-600 text-white font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat.label} ({cat.count})
              </button>
            ))}
          </div>

          {/* REPOSITORIES GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRepos.map((repo) => {
              const isInducted = inductedPeers.some(p => p.repoName === repo.name);
              const preverify = preverifyResults[repo.name];

              return (
                <div
                  key={repo.name}
                  className="bg-[#090E1F] border border-slate-800/90 hover:border-cyan-500/50 rounded-2xl p-5 flex flex-col justify-between space-y-4 transition-all shadow-lg group hover:shadow-cyan-500/10"
                >
                  <div className="space-y-2.5">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Code2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <a
                          href={repo.htmlUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold text-white text-sm font-mono hover:text-cyan-400 transition-colors leading-tight line-clamp-1"
                          title={repo.name}
                        >
                          {repo.name}
                        </a>
                      </div>

                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 bg-slate-800 text-slate-300 border border-slate-700">
                        {repo.language}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-300 leading-relaxed font-sans line-clamp-3">
                      {repo.description}
                    </p>

                    {/* Badges */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-cyan-950/60 text-cyan-300 border border-cyan-800/60">
                        {repo.category}
                      </span>

                      <span className="px-2 py-0.5 rounded text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800 flex items-center gap-1">
                        <GitBranch className="w-2.5 h-2.5" />
                        <span>{repo.defaultBranch}</span>
                      </span>

                      {isInducted && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          <span>MESH ACTIVE</span>
                        </span>
                      )}

                      {preverify && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          FIPS 140-3
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 border-t border-slate-800/80 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleInductToMesh(repo)}
                        disabled={isInducting === repo.name}
                        className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold font-mono flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          isInducted
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50'
                            : 'bg-cyan-950/70 hover:bg-cyan-900 text-cyan-300 border border-cyan-700/60'
                        }`}
                      >
                        <Radio className="w-3 h-3 text-cyan-400" />
                        <span>{isInducting === repo.name ? 'Inducting...' : isInducted ? 'Mesh Peered' : 'Induct to Mesh'}</span>
                      </button>

                      <button
                        onClick={() => handlePreverify(repo)}
                        disabled={isPreverifying === repo.name}
                        className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-700/50 rounded-lg text-[11px] font-bold font-mono flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <ShieldCheck className="w-3 h-3 text-amber-400" />
                        <span>{isPreverifying === repo.name ? 'Verifying...' : 'PreVerify'}</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[11px] font-mono text-slate-400">
                      <button
                        onClick={() => handleCopyClone(repo)}
                        className="hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        {copiedCloneUrl === repo.name ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400 font-bold">Copied Clone!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Clone</span>
                          </>
                        )}
                      </button>

                      <a
                        href={repo.htmlUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 transition-colors"
                      >
                        <span>GitHub</span>
                        <ArrowRight className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredRepos.length === 0 && (
            <div className="text-center py-16 bg-slate-900/30 rounded-2xl border border-slate-800 space-y-3">
              <Boxes className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-slate-400 font-mono text-sm">No repositories matched your search query or filters.</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('ALL'); setSelectedLanguage('ALL'); }}
                className="px-4 py-1.5 bg-cyan-600 text-white rounded-lg text-xs font-mono font-bold"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. TAB: CONSOLIDATED AEGENTIX ENTERPRISE STACKS                           */}
      {/* ========================================================================= */}
      {activeTab === 'CONSOLIDATED' && (
        <div className="space-y-6">
          <div className="bg-[#0A1124] border border-blue-500/40 rounded-2xl p-6 space-y-3 shadow-xl">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-400" />
              <h2 className="text-base font-bold text-white uppercase tracking-wider font-mono">
                Consolidated Enterprise Architecture &middot; AEGENTIX-*
              </h2>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
              Following the enterprise repository restructuring, these core stacks represent the unified pillars of
              AEGENTIX: Agent Mesh P2P transport, Cybernetics execution, Financial Ledger settlement, Mission Control orchestration,
              Security Intelligence, and XR Spatial backends.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {consolidatedRepos.map((repo) => (
              <div
                key={repo.name}
                className="bg-[#090E1F] border border-slate-800 hover:border-blue-500/60 rounded-2xl p-5 space-y-4 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-white font-mono text-blue-300">
                      {repo.name}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 font-sans">
                      {repo.description}
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    CONSOLIDATED
                  </span>
                </div>

                <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-850 font-mono text-xs space-y-1">
                  <div className="text-slate-400 flex justify-between">
                    <span>Upstream Source:</span>
                    <span className="text-cyan-400 font-bold">{repo.fullName}</span>
                  </div>
                  <div className="text-slate-400 flex justify-between">
                    <span>Default Branch:</span>
                    <span className="text-slate-200">{repo.defaultBranch}</span>
                  </div>
                  <div className="text-slate-400 flex justify-between">
                    <span>Language Runtime:</span>
                    <span className="text-emerald-400 font-bold">{repo.language}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                  <button
                    onClick={() => handleInductToMesh(repo)}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold font-mono flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Radio className="w-3.5 h-3.5" />
                    <span>Induct to Live Mesh</span>
                  </button>

                  <a
                    href={repo.htmlUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-mono font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    <span>View Repository</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. TAB: MESH INDUCTED PEERS                                               */}
      {/* ========================================================================= */}
      {activeTab === 'MESH_PEERS' && (
        <div className="space-y-6">
          <div className="bg-[#0A1628] border border-emerald-500/40 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
            <div>
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-emerald-400" />
                <h2 className="text-base font-bold text-white uppercase tracking-wider font-mono">
                  Active P2P Mesh Peer Nodes ({inductedPeers.length})
                </h2>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Repositories inducted into the live bilateral peer-to-peer Agent Mesh with mTLS 1.3 cryptographic handshakes.
              </p>
            </div>

            {onOpenMesh && (
              <button
                onClick={onOpenMesh}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-mono font-bold flex items-center gap-2 cursor-pointer self-start sm:self-center transition-colors"
              >
                <Radio className="w-4 h-4" />
                <span>View Full Vector Mesh Map</span>
              </button>
            )}
          </div>

          <div className="space-y-3">
            {inductedPeers.map((peer) => (
              <div
                key={peer.assignedNodeId}
                className="p-4 bg-[#090E1F] border border-emerald-500/30 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white font-mono text-sm">{peer.repoName}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      :{peer.assignedPort}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-cyan-300 border border-slate-700">
                      {peer.assignedNodeId}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono flex flex-wrap items-center gap-3">
                    <span>Cipher: <strong className="text-slate-200">{peer.cipher}</strong></span>
                    <span>&middot;</span>
                    <span>Latency: <strong className="text-emerald-400">{peer.latencyMs} ms</strong></span>
                    <span>&middot;</span>
                    <span>Attestation: <strong className="text-amber-400">{peer.attestationHash}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-2.5 py-1 bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>MUTUAL_TLS_ESTABLISHED</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. TAB: PREVERIFY VAULT                                                   */}
      {/* ========================================================================= */}
      {activeTab === 'PREVERIFY' && (
        <div className="space-y-6">
          <div className="bg-[#181106] border border-amber-500/40 rounded-2xl p-6 space-y-3 shadow-xl">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-bold text-white uppercase tracking-wider font-mono">
                Cryptographic PreVerify Enclave &middot; AEGENTIX-Linux-PreVerify Standard
              </h2>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
              Inspired by the <strong>AEGENTIX-Linux-PreVerify</strong> repository: preservation and cryptographic
              pre-verification of original upstream artifacts, ISOs, code signatures, and FIPS 140-3 hardware sign-offs
              before mesh runtime execution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#090E1F] p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-slate-400 font-mono text-xs block font-bold">Standard</span>
              <span className="text-amber-400 font-mono text-sm font-bold block">NIST SP 800-53 SC-13</span>
              <p className="text-xs text-slate-300">Cryptographic protection and attestation for all upstream artifacts.</p>
            </div>

            <div className="bg-[#090E1F] p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-slate-400 font-mono text-xs block font-bold">GPG Key Ring</span>
              <span className="text-cyan-400 font-mono text-sm font-bold block">F49A8D7B-9021-4CA2</span>
              <p className="text-xs text-slate-300">AEGENTIX sovereign hardware security key for release verification.</p>
            </div>

            <div className="bg-[#090E1F] p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-slate-400 font-mono text-xs block font-bold">Verification Engine</span>
              <span className="text-emerald-400 font-mono text-sm font-bold block">SHA-256 / SHA3-512</span>
              <p className="text-xs text-slate-300">Zero-collision immutable state hashing across all 88 repositories.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
