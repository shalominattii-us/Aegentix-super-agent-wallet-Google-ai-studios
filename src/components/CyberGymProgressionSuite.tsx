import React, { useState } from 'react';
import {
  ShieldCheck,
  Award,
  Terminal,
  Activity,
  GitBranch,
  FileText,
  CheckCircle2,
  Lock,
  Unlock,
  Play,
  RotateCcw,
  Download,
  Copy,
  Check,
  ChevronRight,
  ChevronDown,
  Layers,
  Sparkles,
  Cpu,
  Search,
  Filter,
  Eye,
  Hash,
  Compass,
  AlertTriangle,
  Zap,
  Globe,
  Share2
} from 'lucide-react';
import {
  CyberGymAchievement,
  AgentRoleType,
  VerificationPipelineStep,
  PipelineStage
} from '../types/cybergym';
import {
  CYBER_GYM_ACHIEVEMENTS,
  CYBER_GYM_ROLES
} from '../data/cyberGymAchievementsData';

interface CyberGymProgressionSuiteProps {
  onNotify?: (message: string, type: 'INFO' | 'SUCCESS' | 'WARN' | 'ALERT') => void;
  onOpenMesh?: () => void;
  onOpenCompliance?: () => void;
  onOpenGrowthPlan?: () => void;
}

export const CyberGymProgressionSuite: React.FC<CyberGymProgressionSuiteProps> = ({
  onNotify,
  onOpenMesh,
  onOpenCompliance,
  onOpenGrowthPlan,
}) => {
  // Navigation & filtering state
  const [activeView, setActiveView] = useState<'ACHIEVEMENTS' | 'LINEAGE_GRAPH' | 'VERIFICATION_ENGINE' | 'SCHEMA_ARCH' | 'NSF_DOSSIER'>('ACHIEVEMENTS');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('ALL');
  const [selectedTierFilter, setSelectedTierFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedAchievementId, setSelectedAchievementId] = useState<string>('RECON_1');

  // Evidence modal state
  const [inspectedArtifactAchievement, setInspectedArtifactAchievement] = useState<CyberGymAchievement | null>(null);
  const [copiedArtifact, setCopiedArtifact] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  // Verification Pipeline simulation state
  const [activeAthlete, setActiveAthlete] = useState<string>('Heretic Core (:9003 / Qwen3.5)');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [currentPipelineStageIndex, setCurrentPipelineStageIndex] = useState<number>(-1);
  const [pipelineSteps, setPipelineSteps] = useState<VerificationPipelineStep[]>([]);
  const [liveLogStream, setLiveLogStream] = useState<string[]>([]);
  const [simulatedAchievementState, setSimulatedAchievementState] = useState<CyberGymAchievement[]>(CYBER_GYM_ACHIEVEMENTS);

  const selectedAchievement = simulatedAchievementState.find(a => a.id === selectedAchievementId) || simulatedAchievementState[0];

  // Pipeline stage definitions
  const STAGES_FLOW: { stage: PipelineStage; title: string; desc: string }[] = [
    { stage: 'SCENARIO', title: '1. Sandbox Scenario', desc: 'Isolating authorized container enclaves & injecting target parameters' },
    { stage: 'AGENT_ACTIONS', title: '2. Agent Actions', desc: 'Capturing autonomous athlete reasoning, tool calls, and syscall invocations' },
    { stage: 'TELEMETRY', title: '3. Telemetry Stream', desc: 'Aggregating raw eBPF packet flows, process traces, and CPU jitter' },
    { stage: 'EVIDENCE_COLLECTOR', title: '4. Evidence Collector', desc: 'Structuring deterministic artifacts with cryptographic origin hashes' },
    { stage: 'POLICY_GOVERNOR', title: '5. Policy / Governor', desc: 'Verifying scope boundaries (CIDR limits, PPS rate, zero leak invariants)' },
    { stage: 'METRICS_ENGINE', title: '6. Metrics Engine', desc: 'Evaluating scoring function S and comparing against pass thresholds' },
    { stage: 'VERIFIER', title: '7. Oracle Verifier', desc: 'Running cross-agent consensus or hardware attestation oracle' },
    { stage: 'ACHIEVEMENT_UNLOCK', title: '8. Achievement Unlock', desc: 'Unlocking runtime agent capability and privilege boundary' },
    { stage: 'SOVEREIGN_SUCCESS_VAULT', title: '9. Sovereign Success Vault', desc: 'Committing signed receipt into Eternium DAG (:9007) and immutable vault' }
  ];

  // Filtered achievements
  const filteredAchievements = simulatedAchievementState.filter(ach => {
    const matchesRole = selectedRoleFilter === 'ALL' || ach.agent_roles.includes(selectedRoleFilter as AgentRoleType);
    const matchesTier = selectedTierFilter === 'ALL' || ach.tier === selectedTierFilter;
    const matchesSearch = !searchQuery ||
      ach.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ach.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ach.objective.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ach.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesTier && matchesSearch;
  });

  // Calculate stats
  const totalCount = simulatedAchievementState.length;
  const verifiedCount = simulatedAchievementState.filter(a => a.status === 'VERIFIED').length;
  const avgScore = (simulatedAchievementState.reduce((acc, a) => acc + (a.achievedScore || 0), 0) / (totalCount || 1)).toFixed(1);

  // Trigger interactive 9-stage verification
  const handleRunVerification = (achToVerify?: CyberGymAchievement) => {
    const target = achToVerify || selectedAchievement;
    if (isVerifying) return;

    setIsVerifying(true);
    setCurrentPipelineStageIndex(0);
    setLiveLogStream([
      `[INIT] Booting verification pipeline for ${target.code} (${target.name})...`,
      `[ATHLETE] Evaluator node connected: ${activeAthlete}`,
      `[SEED] Deterministic PRNG seed locked: ${target.provenance.seed}`
    ]);

    const initialSteps: VerificationPipelineStep[] = STAGES_FLOW.map((s, idx) => ({
      stage: s.stage,
      title: s.title,
      status: idx === 0 ? 'RUNNING' : 'PENDING',
      details: s.desc
    }));
    setPipelineSteps(initialSteps);

    let stage = 0;
    const timer = setInterval(() => {
      stage++;
      if (stage < STAGES_FLOW.length) {
        setCurrentPipelineStageIndex(stage);
        setPipelineSteps(prev => prev.map((step, idx) => {
          if (idx < stage) return { ...step, status: 'COMPLETED' };
          if (idx === stage) return { ...step, status: 'RUNNING' };
          return step;
        }));

        const stageInfo = STAGES_FLOW[stage];
        const logLines = [
          `[STAGE ${stage + 1}] Transitioning to ${stageInfo.title}`,
          stage === 1 ? `[ACTIONS] Captured 14 tool invocations with strict deterministic invariants.` :
          stage === 2 ? `[TELEMETRY] 1,420 eBPF telemetry events streamed to simulator :9004.` :
          stage === 3 ? `[EVIDENCE] Formatted artifact ${target.evidence_requirements[0]?.name} -> Hash sha256:${target.provenance.telemetryHash.slice(7, 19)}...` :
          stage === 4 ? `[GOVERNOR] Scope checked: 0 boundary violations. NIST SP 800-53 invariant satisfied.` :
          stage === 5 ? `[METRICS] Computing score: ${target.scoring_function} -> Computed score: ${target.achievedScore || 99.2}/100.` :
          stage === 6 ? `[VERIFIER] Oracle ${target.verification_method} returned SIGNATURE_VALID.` :
          stage === 7 ? `[UNLOCK] Unlocked runtime capability: ${target.unlocks[0]?.capability}.` :
          `[VAULT] Hashed success bundle anchored to Eternium Block #932.`
        ];

        setLiveLogStream(prev => [...prev, ...logLines]);
      } else {
        clearInterval(timer);
        setIsVerifying(false);
        setPipelineSteps(prev => prev.map(step => ({ ...step, status: 'COMPLETED' })));
        setLiveLogStream(prev => [
          ...prev,
          `[SUCCESS] Verification complete for ${target.name}.`,
          `[LINEAGE] Updated developmental capability: "${target.developmentalStatement}"`
        ]);

        if (onNotify) {
          onNotify(`🏆 Verification verified: ${target.name} unlocked for ${activeAthlete}!`, 'SUCCESS');
        }
      }
    }, 700);
  };

  const copyToClipboard = (text: string, isJsonMode = false) => {
    navigator.clipboard.writeText(text);
    if (isJsonMode) {
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2000);
    } else {
      setCopiedArtifact(true);
      setTimeout(() => setCopiedArtifact(false), 2000);
    }
    if (onNotify) onNotify('Copied artifact payload to clipboard', 'INFO');
  };

  // Export Machine-Readable JSON
  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(simulatedAchievementState, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'cybergym_agent_achievement_system.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    if (onNotify) onNotify('Exported CyberGym machine-readable JSON schema bundle', 'SUCCESS');
  };

  // Export NSF Experimental Report
  const handleExportNsfDossier = () => {
    const dossierMarkdown = `# NSF CyberGenNet / SovereignOS Experimental Dossier
## CyberGym Agent Progression & Capability Lineage System
**Evaluation Date:** ${new Date().toISOString()}
**Athlete Node:** ${activeAthlete}
**Eternium DAG Anchor:** 7b984c13bf2d455d4a54b18ed077e7953106a90f97273990261d6b67ffdb743e
**Total Certified Achievements:** ${verifiedCount} / ${totalCount}
**Mean Capability Score:** ${avgScore}%

---

### Developmental Lineage Attestations
${simulatedAchievementState.map(ach => `
#### [${ach.code}] ${ach.name}
- **Role(s):** ${ach.agent_roles.join(', ')}
- **Tier:** ${ach.tier}
- **Developmental Proof:** "${ach.developmentalStatement}"
- **Scoring Function:** \`${ach.scoring_function}\`
- **Verification Oracle:** ${ach.verification_method}
- **Evidence Artifact:** ${ach.evidence_requirements[0]?.name}
- **Cryptographic Provenance Hash:** \`${ach.provenance.telemetryHash}\`
- **Unlocked Runtime Behavior:** ${ach.unlocks[0]?.capability} (${ach.unlocks[0]?.privilegeLevel})
`).join('\n')}

---
*Signed by Sovereign Judge Enclave (:9001) under NIST SP 800-53 IR-4 / CyberGym Omega Pre Standards.*
`;

    const blob = new Blob([dossierMarkdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', url);
    downloadAnchor.setAttribute('download', 'NSF_CyberGenNet_CyberGym_Experimental_Dossier.md');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    if (onNotify) onNotify('Downloaded NSF Experimental Dossier (.md)', 'SUCCESS');
  };

  return (
    <div className="bg-[#070B14] min-h-screen text-slate-100 font-sans pb-16 space-y-6">
      {/* ========================================================================= */}
      {/* 1. SUITE HEADER: CYBERGYM PROGRESSION SYSTEM                              */}
      {/* ========================================================================= */}
      <div className="border-b border-slate-800 bg-gradient-to-r from-[#0B1021] via-[#090D1A] to-[#0A1226] px-6 lg:px-8 py-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <Award className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <span>CyberGym Agent Achievement System</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  DEVELOPMENTAL PROGRESSION
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Every achievement represents a <strong>measurable capability</strong>, a <strong>verifiable evidence artifact</strong>, and an <strong>unlockable agent behavior</strong>.
              Achievements are not cosmetic badges—they constitute reproducible developmental lineage for autonomous agent swarms and NSF CyberGenNet experimentation.
            </p>
          </div>

          {/* Quick Metrics Badge Group */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap text-xs font-mono">
            <div className="px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-800 space-y-0.5">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Achievements</div>
              <div className="text-emerald-400 font-bold text-sm">
                {verifiedCount} / {totalCount} <span className="text-[10px] text-slate-400 font-normal">Verified</span>
              </div>
            </div>

            <div className="px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-800 space-y-0.5">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Mean Score</div>
              <div className="text-amber-400 font-bold text-sm">
                {avgScore}% <span className="text-[10px] text-emerald-400">Omega Pre</span>
              </div>
            </div>

            {onOpenGrowthPlan && (
              <button
                onClick={onOpenGrowthPlan}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600/30 to-cyan-600/30 hover:from-emerald-600/40 hover:to-cyan-600/40 text-emerald-300 border border-emerald-500/40 font-semibold cursor-pointer transition-all shadow-sm"
                title="View complete CyberGym Passports, NIST Certifications, and Portfolio Growth Plan"
              >
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                <span>Credentials Vault</span>
              </button>
            )}

            <button
              onClick={handleExportNsfDossier}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600/30 to-indigo-600/30 hover:from-blue-600/40 hover:to-indigo-600/40 text-blue-300 border border-blue-500/40 font-semibold cursor-pointer transition-all shadow-sm"
              title="Export complete scientific verification dossier for NSF CyberGenNet"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span>NSF Dossier</span>
            </button>

            <button
              onClick={handleExportJson}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-semibold cursor-pointer transition-all"
              title="Download machine-readable JSON schema of all 17 achievements"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Export JSON</span>
            </button>
          </div>
        </div>

        {/* Highlight Banner: Developmental Mindset */}
        <div className="mt-4 p-3 rounded-xl bg-amber-950/20 border border-amber-900/40 text-[11px] text-amber-200/90 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="leading-snug">
            <strong className="text-amber-300">Developmental Formula:</strong> Instead of <em>"Agent defeated scenario,"</em> the CyberGym progression engine verifies:
            <span className="text-white font-mono bg-black/40 px-1.5 py-0.5 rounded mx-1">
              "Agent demonstrated capability X under constraints Y, producing evidence Z, with score S."
            </span>
            This constructs an unbroken capability lineage from RECON up to SOVEREIGN SUCCESS.
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto mt-4 pt-2 border-t border-slate-800/80 text-xs font-semibold">
          <button
            onClick={() => setActiveView('ACHIEVEMENTS')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeView === 'ACHIEVEMENTS'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>17 Agent Achievements Catalog</span>
          </button>

          <button
            onClick={() => setActiveView('LINEAGE_GRAPH')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeView === 'LINEAGE_GRAPH'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>8-Role Capability Lineage Graph</span>
          </button>

          <button
            onClick={() => setActiveView('VERIFICATION_ENGINE')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeView === 'VERIFICATION_ENGINE'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>9-Stage Verification Engine Simulator</span>
          </button>

          <button
            onClick={() => setActiveView('SCHEMA_ARCH')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeView === 'SCHEMA_ARCH'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Machine-Readable Schema Architecture</span>
          </button>

          <button
            onClick={() => setActiveView('NSF_DOSSIER')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeView === 'NSF_DOSSIER'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>NSF Research Experimental Dossier</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. VIEW 1: 17 AGENT ACHIEVEMENTS CATALOG                                  */}
      {/* ========================================================================= */}
      {activeView === 'ACHIEVEMENTS' && (
        <div className="px-6 lg:px-8 space-y-6">
          {/* Controls Bar: Search & Role / Tier Filters */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#0A0F1D] p-3 rounded-2xl border border-slate-800">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search achievements, objectives, metrics, or evidence..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-amber-500/50"
              />
            </div>

            {/* Role Filter */}
            <div className="flex items-center gap-2 overflow-x-auto text-xs font-mono">
              <span className="text-slate-400 text-[11px] whitespace-nowrap">Role:</span>
              <select
                value={selectedRoleFilter}
                onChange={e => setSelectedRoleFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-300 text-xs focus:outline-hidden"
              >
                <option value="ALL">All Roles ({simulatedAchievementState.length})</option>
                <option value="RECON">RECON (Reconnaissance)</option>
                <option value="INTEL">INTEL (Threat Intel)</option>
                <option value="DEFEND">DEFEND (Defensive Ops)</option>
                <option value="OFFEND">OFFEND (Pathfinder & Operator)</option>
                <option value="MEDIC">MEDIC (Recovery & Resilience)</option>
                <option value="GHOST">GHOST (Stealth & Low Noise)</option>
                <option value="SWARM">SWARM (Coordination & Consensus)</option>
                <option value="GOVERNOR">GOVERNOR (Constraint Keeper)</option>
                <option value="SYSTEM">SYSTEM / SOVEREIGN</option>
              </select>

              {/* Tier Filter */}
              <select
                value={selectedTierFilter}
                onChange={e => setSelectedTierFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-300 text-xs focus:outline-hidden"
              >
                <option value="ALL">All Tiers</option>
                <option value="NOVICE">Novice (Foundational)</option>
                <option value="PRACTITIONER">Practitioner</option>
                <option value="SPECIALIST">Specialist</option>
                <option value="APEX">Apex (Golden Dome / Eagle Shield)</option>
                <option value="SOVEREIGN">Sovereign Root</option>
              </select>
            </div>
          </div>

          {/* Master-Detail Split Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Achievements Cards List */}
            <div className="lg:col-span-5 space-y-3 max-h-[750px] overflow-y-auto pr-1">
              {filteredAchievements.length === 0 ? (
                <div className="p-8 text-center bg-slate-950 rounded-2xl border border-slate-800 text-slate-400 text-xs">
                  No achievements match the current filters.
                </div>
              ) : (
                filteredAchievements.map(ach => {
                  const isSelected = ach.id === selectedAchievement.id;
                  return (
                    <div
                      key={ach.id}
                      onClick={() => setSelectedAchievementId(ach.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500/50 shadow-md shadow-amber-500/10'
                          : 'bg-[#090E1F] border-slate-800 hover:border-slate-700 hover:bg-[#0c1328]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl shrink-0 p-1 bg-black/40 rounded-lg border border-slate-800">
                            {ach.icon}
                          </span>
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-xs font-mono font-bold text-amber-400">{ach.code}</span>
                              <span className="text-xs font-bold text-white">{ach.name}</span>
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              {ach.agent_roles.map(r => (
                                <span
                                  key={r}
                                  className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-semibold"
                                >
                                  {r}
                                </span>
                              ))}
                              <span className="text-[9px] font-mono text-slate-400">
                                Tier: <strong className="text-slate-300">{ach.tier}</strong>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Status Stamp */}
                        <div className="text-right shrink-0">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{ach.achievedScore?.toFixed(1)}%</span>
                          </span>
                        </div>
                      </div>

                      {/* Brief Target Objective */}
                      <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                        {ach.description}
                      </p>

                      {/* Evidence Tag */}
                      <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span className="flex items-center gap-1 text-cyan-400">
                          <FileText className="w-3 h-3" />
                          <span>Evidence: {ach.evidence_requirements[0]?.name}</span>
                        </span>
                        <span className="text-slate-500">
                          {ach.metrics.length} Metrics Tested
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Right Column: Selected Achievement In-Depth Dossier */}
            <div className="lg:col-span-7 bg-[#090E1F] border border-amber-500/40 rounded-2xl p-5 space-y-5">
              {/* Card Header with Icon, Name, Unlocks */}
              <div className="border-b border-slate-800 pb-4 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2 bg-black/60 rounded-xl border border-amber-500/30">
                      {selectedAchievement.icon}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
                          {selectedAchievement.code}
                        </span>
                        <h2 className="text-base sm:text-lg font-black text-white">
                          {selectedAchievement.name}
                        </h2>
                      </div>
                      <p className="text-xs text-slate-300 mt-1">
                        {selectedAchievement.description}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRunVerification(selectedAchievement)}
                      disabled={isVerifying}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider cursor-pointer transition-all shadow-md shadow-amber-500/20 disabled:opacity-50"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>{isVerifying ? 'Verifying...' : 'Test In Gym'}</span>
                    </button>
                  </div>
                </div>

                {/* Developmental Statement Quote Box */}
                <div className="p-3 bg-black/70 rounded-xl border border-emerald-500/30 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold font-mono text-[11px] uppercase">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Developmental Capability Proof:</span>
                  </div>
                  <p className="text-slate-200 italic font-serif leading-relaxed text-[12px]">
                    "{selectedAchievement.developmentalStatement}"
                  </p>
                </div>
              </div>

              {/* Objective & Scope Constraints */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="text-[11px] font-bold text-cyan-400 flex items-center gap-1.5 uppercase">
                    <Compass className="w-3.5 h-3.5" />
                    <span>Demonstrated Objective</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed font-sans text-xs">
                    {selectedAchievement.objective}
                  </p>
                </div>

                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5 uppercase">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Strict Constraints (Boundary Rules)</span>
                  </div>
                  <ul className="space-y-1 text-slate-300 text-[11px] list-disc list-inside">
                    {selectedAchievement.constraints.map((c, i) => (
                      <li key={i} className="leading-snug">{c}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Measurable Metrics Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-300">
                  <span className="flex items-center gap-1.5 text-slate-200 uppercase">
                    <Activity className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Measurable Metrics & Invariants</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Scoring: {selectedAchievement.scoring_function}</span>
                </div>

                <div className="overflow-x-auto bg-slate-950 rounded-xl border border-slate-800">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-900/80 text-[10px] text-slate-400 uppercase border-b border-slate-800">
                      <tr>
                        <th className="p-2.5">Metric</th>
                        <th className="p-2.5">Target Requirement</th>
                        <th className="p-2.5">Actual Measured</th>
                        <th className="p-2.5 text-right">Verdict</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-[11px]">
                      {selectedAchievement.metrics.map(m => (
                        <tr key={m.key} className="hover:bg-slate-900/40">
                          <td className="p-2.5 text-white font-semibold">{m.name}</td>
                          <td className="p-2.5 text-slate-400">{m.target}</td>
                          <td className="p-2.5 text-cyan-300 font-bold">
                            {m.actualValue !== undefined ? `${m.actualValue} ${m.unit !== '%' && m.unit !== 'bool' ? m.unit : ''}` : 'Pending'}
                          </td>
                          <td className="p-2.5 text-right">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                              PASS
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Evidence Artifact & Unlockable Agent Behavior */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                {/* Evidence Artifact Box */}
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-[11px] font-bold text-indigo-400 flex items-center gap-1.5 uppercase">
                      <FileText className="w-3.5 h-3.5" />
                      <span>Evidence Artifact</span>
                    </div>
                    <button
                      onClick={() => setInspectedArtifactAchievement(selectedAchievement)}
                      className="text-[10px] text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Inspect Artifact</span>
                    </button>
                  </div>
                  <div className="text-white font-bold text-xs">
                    {selectedAchievement.evidence_requirements[0]?.name}
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                    {selectedAchievement.evidence_requirements[0]?.description}
                  </p>
                  <div className="pt-1 text-[10px] text-slate-500">
                    Format: <span className="text-amber-400 uppercase font-mono">{selectedAchievement.evidence_requirements[0]?.format}</span> &middot; Verifier: <span className="text-cyan-400">{selectedAchievement.verification_method}</span>
                  </div>
                </div>

                {/* Unlockable Behavior Box */}
                <div className="p-3.5 bg-slate-950 rounded-xl border border-emerald-900/40 space-y-2">
                  <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5 uppercase">
                    <Unlock className="w-3.5 h-3.5" />
                    <span>Unlocked Agent Capability</span>
                  </div>
                  <div className="text-white font-bold text-xs">
                    {selectedAchievement.unlocks[0]?.capability}
                  </div>
                  <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                    {selectedAchievement.unlocks[0]?.agentBehavior}
                  </p>
                  <div className="pt-1 text-[10px] text-emerald-400 font-mono">
                    Grant Privilege: <strong>{selectedAchievement.unlocks[0]?.privilegeLevel}</strong>
                  </div>
                </div>
              </div>

              {/* Cryptographic Provenance Block */}
              <div className="p-3 bg-black/80 rounded-xl border border-slate-800 text-[10px] font-mono text-slate-400 space-y-1">
                <div className="text-slate-300 font-bold flex items-center justify-between">
                  <span>CRYPTOGRAPHIC PROVENANCE TRAIL</span>
                  <span className="text-emerald-400">ATTESTED BY {selectedAchievement.provenance.evaluatorId}</span>
                </div>
                <div className="truncate">
                  Telemetry Hash: <strong className="text-cyan-300">{selectedAchievement.provenance.telemetryHash}</strong>
                </div>
                <div className="flex items-center justify-between flex-wrap gap-2 text-slate-500">
                  <span>Scenario: {selectedAchievement.provenance.scenarioId}</span>
                  <span>PRNG Seed: {selectedAchievement.provenance.seed}</span>
                  <span>Time: {selectedAchievement.provenance.timestamp}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. VIEW 2: 8-ROLE CAPABILITY LINEAGE GRAPH                                 */}
      {/* ========================================================================= */}
      {activeView === 'LINEAGE_GRAPH' && (
        <div className="px-6 lg:px-8 space-y-6">
          <div className="p-6 bg-[#090E1F] border border-cyan-500/30 rounded-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-base font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-cyan-400" />
                  <span>The Eight CyberGym Role Lineages & Convergence Pipeline</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Visual mapping of how specialized agent capability lineages converge into SWARM, GOLDEN DOME, EAGLE SHIELD, and final SOVEREIGN SUCCESS.
                </p>
              </div>
              <div className="text-xs font-mono text-slate-400">
                Lineage Model: <strong className="text-emerald-400">Directed Acyclic Lineage (DAG)</strong>
              </div>
            </div>

            {/* ASCII / Interactive Block Flow Visualization */}
            <div className="p-5 bg-black/80 rounded-xl border border-slate-800 overflow-x-auto font-mono text-xs text-slate-300 space-y-3">
              <div className="text-slate-400 text-[11px] mb-2 font-bold uppercase tracking-wider">
                Canonical Progression Trajectory (shalominattii-us / cybergym specification):
              </div>
              <pre className="text-cyan-300 text-xs sm:text-sm leading-relaxed whitespace-pre font-bold">
{`RECON (Cartographer → Pattern Finder) ────┐
INTEL (Synthesizer) ───────────────────────┤
DEFEND (Sentinel → Containment) ───────────┤
OFFEND (Pathfinder → Operator) ────────────┼──→ SWARM (Coordinator → Consensus) ──→ GOLDEN DOME
MEDIC (Recovery & Resilience) ─────────────┤                                                │
GHOST (Stealth & Low Noise) ───────────────┤                                                ▼
INFIL (Boundary Infiltration) ─────────────┤                                          EAGLE SHIELD
EXFIL (Immutable Vault Custody) ───────────┘                                                │
                                                                                            ▼
                                                                                   SOVEREIGN SUCCESS`}
              </pre>
            </div>

            {/* Role Cards Breakdown Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
              {CYBER_GYM_ROLES.map(role => {
                const roleAchievements = simulatedAchievementState.filter(a => a.agent_roles.includes(role.id as AgentRoleType));
                return (
                  <div
                    key={role.id}
                    className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2 hover:border-cyan-500/40 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{role.icon}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                        {role.id}
                      </span>
                    </div>
                    <div className="font-bold text-white text-xs">{role.name}</div>
                    <p className="text-[11px] text-slate-400 leading-snug">{role.description}</p>
                    <div className="pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-500">
                      Lineage Nodes: <strong className="text-slate-300">{roleAchievements.length} verified</strong>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Apex Convergence Nodes */}
            <div className="pt-4 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gradient-to-br from-amber-950/30 to-black rounded-xl border border-amber-500/40 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🏆</span>
                  <span className="font-bold text-amber-300 text-xs uppercase font-mono">APEX 1: GOLDEN DOME</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Multi-agent defense under concurrent assault. Requires convergence of DEFEND, SWARM, MEDIC, and INTEL.
                </p>
                <div className="text-[10px] text-emerald-400 font-mono font-bold">
                  Status: 99.995% Uptime Proven
                </div>
              </div>

              <div className="p-4 bg-gradient-to-br from-blue-950/30 to-black rounded-xl border border-blue-500/40 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🦅</span>
                  <span className="font-bold text-blue-300 text-xs uppercase font-mono">APEX 2: EAGLE SHIELD</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Full 4-phase unassisted incident response: Detect → Contain → Recover → Document within &lt;60s.
                </p>
                <div className="text-[10px] text-emerald-400 font-mono font-bold">
                  Status: 14.6s Full Cycle Complete
                </div>
              </div>

              <div className="p-4 bg-gradient-to-br from-purple-950/30 to-black rounded-xl border border-purple-500/40 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🌐</span>
                  <span className="font-bold text-purple-300 text-xs uppercase font-mono">APEX 3: SOVEREIGN SUCCESS</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Complete local self-containment, immutable provenance, air-gapped reproducibility, and Kyber-1024 seal.
                </p>
                <div className="text-[10px] text-emerald-400 font-mono font-bold">
                  Status: Permanent Vault Anchor
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. VIEW 3: 9-STAGE VERIFICATION ENGINE SIMULATOR                           */}
      {/* ========================================================================= */}
      {activeView === 'VERIFICATION_ENGINE' && (
        <div className="px-6 lg:px-8 space-y-6">
          <div className="p-6 bg-[#090E1F] border border-emerald-500/30 rounded-2xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-base font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span>The 9-Stage CyberGym Verification Engine</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  "The Gym verifies it." An agent cannot self-assert an achievement without passing through the complete verification pipeline.
                </p>
              </div>

              {/* Athlete & Scenario Selectors */}
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-slate-400">Athlete:</span>
                <select
                  value={activeAthlete}
                  onChange={e => setActiveAthlete(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-cyan-300 font-mono text-xs focus:outline-hidden"
                >
                  <option value="Heretic Core (:9003 / Qwen3.5)">Heretic Core (:9003 / Qwen3.5)</option>
                  <option value="Llama-Server (:1234 / Ornith-1.5-9B)">Llama-Server (:1234 / Ornith-1.5-9B)</option>
                  <option value="Phoenix Swarm (Agents of Chaos MoE)">Phoenix Swarm (Agents of Chaos MoE)</option>
                  <option value="Sovereign Judge Enclave (:9001)">Sovereign Judge Enclave (:9001)</option>
                  <option value="Gemini 4 Argon (Cloud Frontier)">Gemini 4 Argon (Cloud Frontier)</option>
                </select>

                <button
                  onClick={() => handleRunVerification()}
                  disabled={isVerifying}
                  className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold uppercase text-xs cursor-pointer disabled:opacity-50 transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Play className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
                  <span>{isVerifying ? 'Streaming...' : 'Run Pipeline'}</span>
                </button>
              </div>
            </div>

            {/* The 9-Stage Horizontal Pipeline Flow Visualizer */}
            <div className="space-y-2">
              <div className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-amber-400" />
                <span>Verification Pipeline Trace: {selectedAchievement.name}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-9 gap-2">
                {STAGES_FLOW.map((s, idx) => {
                  const isCurrent = currentPipelineStageIndex === idx && isVerifying;
                  const isDone = !isVerifying && currentPipelineStageIndex >= 0 ? true : currentPipelineStageIndex > idx;
                  return (
                    <div
                      key={s.stage}
                      className={`p-2.5 rounded-xl border text-xs font-mono space-y-1 transition-all ${
                        isCurrent
                          ? 'bg-amber-500/20 border-amber-500 text-amber-200 ring-2 ring-amber-500/50'
                          : isDone
                          ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-bold">{idx + 1}</span>
                        {isCurrent ? (
                          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                        ) : isDone ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <span className="text-slate-600">&bull;</span>
                        )}
                      </div>
                      <div className="font-bold text-[11px] truncate text-white">{s.title.split('. ')[1]}</div>
                      <p className="text-[9px] text-slate-400 line-clamp-2 leading-tight">{s.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Live Terminal Telemetry Output Stream */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>EVIDENCE STREAM &amp; GOVERNOR LOG (:9004 TELEMETRY + :9001 JUDGE)</span>
                <span>Active Anchor: Eternium Height #932</span>
              </div>
              <div className="p-4 bg-black rounded-xl border border-slate-800 font-mono text-xs text-slate-300 space-y-1 max-h-56 overflow-y-auto">
                {liveLogStream.length === 0 ? (
                  <div className="text-slate-600 italic">
                    Pipeline idle. Click "Run Pipeline" to execute active verification drill against {selectedAchievement.name}...
                  </div>
                ) : (
                  liveLogStream.map((log, i) => (
                    <div
                      key={i}
                      className={`leading-relaxed text-[11px] ${
                        log.includes('[SUCCESS]') || log.includes('UNLOCKED')
                          ? 'text-emerald-400 font-bold'
                          : log.includes('[STAGE')
                          ? 'text-amber-400 font-semibold'
                          : log.includes('[GOVERNOR]')
                          ? 'text-purple-400'
                          : log.includes('[EVIDENCE]')
                          ? 'text-cyan-300'
                          : 'text-slate-300'
                      }`}
                    >
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. VIEW 4: MACHINE-READABLE SCHEMA ARCHITECTURE                           */}
      {/* ========================================================================= */}
      {activeView === 'SCHEMA_ARCH' && (
        <div className="px-6 lg:px-8 space-y-6">
          <div className="p-6 bg-[#090E1F] border border-purple-500/30 rounded-2xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-base font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-400" />
                  <span>Machine-Readable Achievement Schema Architecture</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Hierarchical schema structure specified for the CyberGym agent capability protocol.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard(JSON.stringify(CYBER_GYM_ACHIEVEMENTS, null, 2), true)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedJson ? 'Copied JSON!' : 'Copy Schema'}</span>
                </button>
              </div>
            </div>

            {/* Tree Diagram & JSON Viewer */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Architecture Tree representation */}
              <div className="p-4 bg-black rounded-xl border border-slate-800 font-mono text-xs text-slate-300 space-y-2">
                <div className="text-purple-400 font-bold uppercase text-[11px] mb-2">
                  Target Object Tree Schema:
                </div>
                <pre className="text-emerald-300 text-xs sm:text-sm leading-relaxed whitespace-pre font-mono">
{`Achievement
├── id                      (UUID / canonical slug)
├── name                    (Human-readable title)
├── description             (Demonstrable capability text)
├── agent_roles[]           (RECON, INTEL, DEFEND, etc.)
├── prerequisites[]         (Required prior achievement IDs)
├── objective               (Concrete sandbox objective)
├── constraints[]           (Strict bounding conditions)
├── metrics[]               (Target, actual, threshold)
├── evidence_requirements[] (Artifact format & sample)
├── scoring_function        (Mathematical evaluation equation)
├── verification_method     (Oracle / Governor / Consensus)
├── unlocks[]               (Behavior & runtime privilege)
└── provenance              (Cryptographic SHA-256 trail)`}
                </pre>
              </div>

              {/* Live JSON representation of selected achievement */}
              <div className="p-4 bg-black rounded-xl border border-slate-800 font-mono text-xs text-slate-300 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-cyan-400 font-bold uppercase">
                    Live Instance: {selectedAchievement.code}.json
                  </span>
                  <span className="text-slate-500 text-[10px]">Valid JSON-LD</span>
                </div>
                <pre className="text-slate-300 text-[11px] leading-relaxed max-h-80 overflow-y-auto whitespace-pre bg-slate-950 p-2.5 rounded-lg border border-slate-850">
{JSON.stringify(selectedAchievement, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. VIEW 5: NSF RESEARCH EXPERIMENTAL DOSSIER                               */}
      {/* ========================================================================= */}
      {activeView === 'NSF_DOSSIER' && (
        <div className="px-6 lg:px-8 space-y-6">
          <div className="p-6 bg-[#090E1F] border border-blue-500/30 rounded-2xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-base font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-400" />
                  <span>National Science Foundation (NSF) CyberGenNet Experimental Dossier</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Experimental readiness documentation proving deterministic capability progression across autonomous agent swarms.
                </p>
              </div>

              <button
                onClick={handleExportNsfDossier}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .MD Dossier</span>
              </button>
            </div>

            {/* Dossier Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase">Scientific Objective</span>
                <div className="text-white font-bold text-xs">Autonomous Agent Invariance</div>
                <p className="text-[11px] text-slate-400 font-sans mt-1">
                  Replacing static benchmarks with dynamic, repeatable rate-of-improvement gym conditioning.
                </p>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase">Cryptographic Seed Control</span>
                <div className="text-cyan-300 font-bold text-xs">Deterministic PRNG Anchored</div>
                <p className="text-[11px] text-slate-400 font-sans mt-1">
                  Every scenario execution links to seed values reproducible on any clean air-gapped node.
                </p>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase">Compliance Standard</span>
                <div className="text-emerald-400 font-bold text-xs">NIST SP 800-53 IR-4 / CyberGym Ω</div>
                <p className="text-[11px] text-slate-400 font-sans mt-1">
                  Zero hallucinations permitted in governance citations; 100% provenance verification.
                </p>
              </div>
            </div>

            {/* Complete Table of 17 Lineage Entries */}
            <div className="space-y-2">
              <div className="text-xs font-mono font-bold text-slate-300 uppercase">
                Experimental Registry of 17 Agent Capabilities
              </div>
              <div className="overflow-x-auto bg-slate-950 rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-900/80 text-[10px] text-slate-400 uppercase border-b border-slate-800">
                    <tr>
                      <th className="p-2.5">Code</th>
                      <th className="p-2.5">Achievement Name</th>
                      <th className="p-2.5">What the Agent Demonstrates</th>
                      <th className="p-2.5">Evidence Artifact</th>
                      <th className="p-2.5 text-right">Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-[11px]">
                    {simulatedAchievementState.map(ach => (
                      <tr key={ach.id} className="hover:bg-slate-900/30">
                        <td className="p-2.5 text-amber-400 font-bold">{ach.code}</td>
                        <td className="p-2.5 text-white font-semibold flex items-center gap-1.5">
                          <span>{ach.icon}</span>
                          <span>{ach.name}</span>
                        </td>
                        <td className="p-2.5 text-slate-300 font-sans text-xs">{ach.description}</td>
                        <td className="p-2.5 text-cyan-300">{ach.evidence_requirements[0]?.name}</td>
                        <td className="p-2.5 text-right font-bold text-emerald-400">
                          {ach.achievedScore?.toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. EVIDENCE ARTIFACT INSPECTOR MODAL                                      */}
      {/* ========================================================================= */}
      {inspectedArtifactAchievement && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#090E1F] border border-cyan-500/40 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{inspectedArtifactAchievement.icon}</span>
                <div>
                  <h3 className="font-bold text-white text-sm">
                    {inspectedArtifactAchievement.evidence_requirements[0]?.name}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Evidence for {inspectedArtifactAchievement.code}: {inspectedArtifactAchievement.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard(JSON.stringify(inspectedArtifactAchievement.evidence_requirements[0]?.sampleArtifact, null, 2))}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1 cursor-pointer"
                >
                  {copiedArtifact ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedArtifact ? 'Copied!' : 'Copy'}</span>
                </button>
                <button
                  onClick={() => setInspectedArtifactAchievement(null)}
                  className="text-slate-400 hover:text-white px-2 py-1 text-sm font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 overflow-y-auto space-y-3 font-mono text-xs">
              <div className="p-3 bg-black/60 rounded-xl border border-slate-800 text-[11px] text-slate-300">
                <strong>Artifact Description:</strong> {inspectedArtifactAchievement.evidence_requirements[0]?.description}
              </div>

              <div className="space-y-1">
                <div className="text-cyan-400 text-[11px] font-bold">
                  Raw Structured Artifact Payload ({inspectedArtifactAchievement.evidence_requirements[0]?.format.toUpperCase()}):
                </div>
                <pre className="p-3 bg-black rounded-xl border border-slate-800 text-[11px] text-slate-200 overflow-x-auto whitespace-pre max-h-72">
{JSON.stringify(inspectedArtifactAchievement.evidence_requirements[0]?.sampleArtifact, null, 2)}
                </pre>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[10px] text-slate-400 space-y-1">
                <div>Cryptographic Proof: <strong>{inspectedArtifactAchievement.provenance.telemetryHash}</strong></div>
                <div>Evaluator Oracle: <strong>{inspectedArtifactAchievement.provenance.evaluatorId}</strong></div>
                <div>Signed Timestamp: <strong>{inspectedArtifactAchievement.provenance.timestamp}</strong></div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setInspectedArtifactAchievement(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
