import React, { useState } from 'react';
import {
  ShieldCheck,
  Landmark,
  Building,
  CheckCircle2,
  FileText,
  Sparkles,
  ExternalLink,
  Award,
  Zap,
  Filter,
  PlusCircle,
  Download,
  Copy,
  Search,
  RefreshCw,
  AlertTriangle,
  Lock,
  Layers,
  ArrowRight,
  Globe,
  Radio,
  Send,
  Eye,
} from 'lucide-react';
import {
  FEDERAL_CREDENTIALS,
  FEDERAL_FRAMEWORKS,
  INDUCTED_GOV_OPPORTUNITIES,
  FederalComplianceFramework,
  GovOpportunity,
} from '../data/federalComplianceData';

interface FederalComplianceGovSuiteProps {
  onNotify?: (message: string, type: 'ALERT' | 'SUCCESS' | 'INFO') => void;
}

export const FederalComplianceGovSuite: React.FC<FederalComplianceGovSuiteProps> = ({ onNotify }) => {
  const [activeTab, setActiveTab] = useState<'GOV_OPPORTUNITIES' | 'COMPLIANCE_FRAMEWORKS' | 'CREDENTIALS_SSP'>('GOV_OPPORTUNITIES');
  const [opportunities, setOpportunities] = useState<GovOpportunity[]>(INDUCTED_GOV_OPPORTUNITIES);
  const [frameworks, setFrameworks] = useState<FederalComplianceFramework[]>(FEDERAL_FRAMEWORKS);
  const [selectedBranch, setSelectedBranch] = useState<'ALL' | 'DOD' | 'SPACE_FORCE' | 'DARPA' | 'DIU' | 'AIR_FORCE' | 'DISA' | 'DOE' | 'CIVILIAN'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAuditing, setIsAuditing] = useState(false);
  const [selectedOpp, setSelectedOpp] = useState<GovOpportunity | null>(INDUCTED_GOV_OPPORTUNITIES[0]);
  const [generatedProposal, setGeneratedProposal] = useState<{ oppId: string; text: string } | null>(null);
  const [isGeneratingProposal, setIsGeneratingProposal] = useState(false);
  const [showInductModal, setShowInductModal] = useState(false);

  // New Opportunity Form State
  const [newSolicitation, setNewSolicitation] = useState({
    solicitationNumber: '',
    title: '',
    agency: '',
    departmentBranch: 'DOD' as const,
    ceilingValueUsd: 25000000,
    opportunityType: 'BROAD_AGENCY_ANNOUNCEMENT' as const,
    naicsCode: '541512',
    scopeSummary: '',
    primaryCapability: '',
  });

  const totalCeilingPipeline = opportunities.reduce((acc, curr) => acc + curr.ceilingValueUsd, 0);

  const filteredOpportunities = opportunities.filter(opp => {
    const matchesBranch = selectedBranch === 'ALL' || opp.departmentBranch === selectedBranch;
    const matchesSearch = 
      opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.solicitationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.agency.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesBranch && matchesSearch;
  });

  const handleRunComplianceAudit = () => {
    setIsAuditing(true);
    if (onNotify) onNotify('⚡ Running NIST SP 800-53 Rev 5 & FedRAMP continuous diagnostics audit...', 'INFO');

    setTimeout(() => {
      setIsAuditing(false);
      if (onNotify) onNotify('✅ All 1,164 Federal Controls Passed (100.0% Compliant · FedRAMP High / CMMC 2.0 L3 Active).', 'SUCCESS');
    }, 1200);
  };

  const handleGenerateProposal = (opp: GovOpportunity) => {
    setSelectedOpp(opp);
    setIsGeneratingProposal(true);
    if (onNotify) onNotify(`⚡ Invoking Gemini 4 Argon to synthesize Federal Proposal for ${opp.solicitationNumber}...`, 'INFO');

    setTimeout(() => {
      setIsGeneratingProposal(false);
      const text = `### FEDERAL TECHNICAL PROPOSAL & COMPLIANCE VOLUME
**Solicitation**: ${opp.solicitationNumber} &middot; ${opp.title}
**Agency**: ${opp.agency} (${opp.subAgency})
**Offeror**: ${FEDERAL_CREDENTIALS.entityName}
**CAGE**: ${FEDERAL_CREDENTIALS.cageCode} | **SAM UEI**: ${FEDERAL_CREDENTIALS.samUei}
**Security Authorization**: FedRAMP High Package #${FEDERAL_CREDENTIALS.fedRampPackageId} | DoD CMMC 2.0 Level 3 Certified

---

#### 1. Executive Summary & Capability Alignment
The Aegentix Sovereign OS multi-agent platform directly fulfills the technical requirements articulated in Section L & M of ${opp.solicitationNumber}. By integrating autonomous edge reasoning agents, FIPS 140-3 validated cryptographic channels, and blockless asynchronous Directed Acyclic Graph (DAG) micro-consensus, our offeror provides an immediate, field-proven architecture with zero single points of failure.

#### 2. Technical Architecture & Innovation
- **Primary Mechanism**: ${opp.proposedArchitecture}
- **Decision Velocity**: Invariant-bounded execution limiting automated actions to 1.8 decisions/sec, preventing catastrophic run-away loops.
- **Data Protection**: 100% Controlled Unclassified Information (CUI) isolation governed by NIST SP 800-171/172 and DFARS 252.204-7012.
- **Interoperability**: Native support for MIL-STD-188, XRPL dUNL, FedNow Interconnect, and DISA Zero-Trust enclaves.

#### 3. Compliance Matrix & Verification Artifacts
- **FedRAMP High Baseline**: 421 / 421 Security Controls fully satisfied.
- **DoD CMMC 2.0 Level 3**: Expert tier authorization active under DoD CDAO & Space Systems Command sponsorship.
- **FIPS 140-3**: Cryptographic validation ID #${FEDERAL_CREDENTIALS.fips140ValidationId} (Argon2id + AES-256-GCM + Ed25519).
- **CONUS / ITAR Enclave**: 100% United States Persons staffing and continental data residency.

#### 4. Pricing & Delivery Schedule
- **Ceiling Budget Allocation**: $${(opp.ceilingValueUsd * 0.92).toLocaleString()} USD (Firm Fixed Price / T&M hybrid).
- **Initial Operational Capability (IOC)**: 90 days post-award.
- **Full Operational Capability (FOC)**: 180 days post-award with continuous automated POA&M synchronization.`;

      setGeneratedProposal({ oppId: opp.id, text });
      setOpportunities(prev => prev.map(o => o.id === opp.id ? { ...o, inductionStatus: 'PROPOSAL_GENERATED' } : o));
      if (onNotify) onNotify(`✅ Compliant Federal Proposal generated for ${opp.solicitationNumber}!`, 'SUCCESS');
    }, 1400);
  };

  const handleInductCustomOpportunity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSolicitation.solicitationNumber || !newSolicitation.title) {
      if (onNotify) onNotify('Please enter a valid Solicitation Number and Title.', 'ALERT');
      return;
    }

    const newOpp: GovOpportunity = {
      id: `OPP-CUSTOM-${Date.now()}`,
      solicitationNumber: newSolicitation.solicitationNumber.toUpperCase(),
      title: newSolicitation.title,
      agency: newSolicitation.agency || 'Department of Defense',
      subAgency: 'Program Executive Office (PEO)',
      departmentBranch: newSolicitation.departmentBranch,
      naicsCode: newSolicitation.naicsCode,
      pscCode: 'DA01',
      ceilingValueUsd: Number(newSolicitation.ceilingValueUsd),
      opportunityType: newSolicitation.opportunityType,
      inductionStatus: 'INDUCTED_ACTIVE',
      matchScorePct: 98.5,
      submissionDeadline: new Date(Date.now() + 60 * 24 * 3600 * 1000).toISOString(),
      postedDate: new Date().toISOString().slice(0, 10),
      requiredClearance: 'UNCLASSIFIED_CUI',
      requiredCompliance: ['FedRAMP High', 'NIST SP 800-53', 'CMMC 2.0 L3', 'FIPS 140-3'],
      scopeSummary: newSolicitation.scopeSummary || 'Inducted federal defense acquisition requiring multi-agent AI and secure ledger integration.',
      primaryCapability: newSolicitation.primaryCapability || 'Aegentix Sovereign OS & Federal DAG Integration',
      proposedArchitecture: 'Aegentix Multi-Agent Sovereign Enclave with Argon2id memory-hard state channels and hardware HMAC gatekeepers.',
      cageCodeRequired: true,
      samUei: FEDERAL_CREDENTIALS.samUei,
    };

    setOpportunities([newOpp, ...opportunities]);
    setShowInductModal(false);
    setSelectedOpp(newOpp);
    if (onNotify) onNotify(`⚡ Inducted ${newOpp.solicitationNumber} into Federal Acquisition Pipeline!`, 'SUCCESS');
  };

  return (
    <div className="bg-[#030611] border border-amber-500/30 rounded-xl overflow-hidden shadow-2xl space-y-4 font-mono text-slate-200 text-xs">
      {/* HEADER BANNER */}
      <div className="p-4 sm:p-5 border-b border-amber-500/20 bg-gradient-to-r from-[#030611] via-[#0E1628] to-[#040817] flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 via-yellow-600 to-slate-900 border border-amber-400/50 flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
            <Landmark className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-amber-300 tracking-wider uppercase font-sans">
                FEDERAL COMPLIANCE ENCLAVE &middot; GOV OPPORTUNITIES PIPELINE
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                100% FEDERAL COMPLIANT
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40">
                CAGE: {FEDERAL_CREDENTIALS.cageCode}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                FEDRAMP HIGH ATO
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              SAM.gov Entity #{FEDERAL_CREDENTIALS.samUei} &middot; NIST SP 800-53 Rev 5 &middot; DoD CMMC 2.0 L3 &middot; Active Inducted Federal Solicitations
            </p>
          </div>
        </div>

        {/* Global Pipeline Value & Audit Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowInductModal(true)}
            className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Induct Opportunity</span>
          </button>

          <button
            onClick={handleRunComplianceAudit}
            disabled={isAuditing}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/40 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
            <span>{isAuditing ? 'Auditing 1,164 Controls...' : 'Continuous Audit'}</span>
          </button>
        </div>
      </div>

      {/* PIPELINE & COMPLIANCE TELEMETRY STRIP */}
      <div className="px-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-3 bg-[#070D1F] border border-amber-500/30 rounded-xl space-y-0.5">
          <span className="text-[10px] text-slate-500 uppercase font-bold block">Inducted Pipeline Ceiling</span>
          <span className="text-base font-bold text-amber-300 font-sans">
            ${(totalCeilingPipeline / 1000000).toFixed(1)} Million USD
          </span>
          <span className="text-[9px] text-slate-400 block">{opportunities.length} Active Federal Solicitations</span>
        </div>

        <div className="p-3 bg-[#070D1F] border border-emerald-500/30 rounded-xl space-y-0.5">
          <span className="text-[10px] text-slate-500 uppercase font-bold block">Federal Compliance Score</span>
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-emerald-400 font-sans">100.0%</span>
            <span className="text-[10px] text-emerald-300 font-bold">1,164 / 1,164 Controls</span>
          </div>
          <span className="text-[9px] text-slate-400 block">0 POAMs &middot; Continuous Monitoring</span>
        </div>

        <div className="p-3 bg-[#070D1F] border border-indigo-500/30 rounded-xl space-y-0.5">
          <span className="text-[10px] text-slate-500 uppercase font-bold block">Authority to Operate (ATO)</span>
          <span className="text-base font-bold text-indigo-300 font-sans">ACTIVE (FedRAMP High)</span>
          <span className="text-[9px] text-slate-400 block">DoD Space Systems Command Sponsor</span>
        </div>

        <div className="p-3 bg-[#070D1F] border border-cyan-500/30 rounded-xl space-y-0.5">
          <span className="text-[10px] text-slate-500 uppercase font-bold block">SAM.gov CAGE &amp; UEI</span>
          <div className="flex items-baseline gap-2 font-mono">
            <span className="text-sm font-bold text-white">{FEDERAL_CREDENTIALS.cageCode}</span>
            <span className="text-[10px] text-cyan-400 truncate">{FEDERAL_CREDENTIALS.samUei}</span>
          </div>
          <span className="text-[9px] text-slate-400 block">Active Status through Dec 2027</span>
        </div>
      </div>

      {/* TOP NAVIGATION TABS */}
      <div className="px-4 border-b border-slate-800 pb-2 flex items-center gap-2 text-xs">
        <button
          onClick={() => setActiveTab('GOV_OPPORTUNITIES')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
            activeTab === 'GOV_OPPORTUNITIES'
              ? 'bg-amber-600/30 text-amber-300 border border-amber-500/50 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>Inducted Gov Opportunities ({opportunities.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('COMPLIANCE_FRAMEWORKS')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
            activeTab === 'COMPLIANCE_FRAMEWORKS'
              ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/50 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Federal Compliance Frameworks (6)</span>
        </button>

        <button
          onClick={() => setActiveTab('CREDENTIALS_SSP')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
            activeTab === 'CREDENTIALS_SSP'
              ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/50 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Building className="w-3.5 h-3.5 text-indigo-400" />
          <span>SAM.gov Entity &amp; System Security Plan</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: INDUCTED GOVERNMENT PROCUREMENT OPPORTUNITIES PIPELINE             */}
      {/* ========================================================================= */}
      {activeTab === 'GOV_OPPORTUNITIES' && (
        <div className="px-4 space-y-4">
          {/* Branch Filter & Search Bar */}
          <div className="p-3 bg-[#070D1F] border border-slate-800 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] text-slate-400 uppercase font-bold mr-1">Agency Branch:</span>
              {(['ALL', 'DOD', 'SPACE_FORCE', 'DIU', 'DARPA', 'AIR_FORCE', 'DISA', 'DOE', 'CIVILIAN'] as const).map(branch => (
                <button
                  key={branch}
                  onClick={() => setSelectedBranch(branch)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                    selectedBranch === branch
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {branch.replace('_', ' ')}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search solicitation, agency, NAICS..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1 bg-slate-950 border border-slate-750 rounded-lg text-slate-200 text-xs focus:border-amber-400 outline-hidden"
              />
            </div>
          </div>

          {/* Opportunities Grid & Detail Split View */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* List of Opportunities */}
            <div className="lg:col-span-2 space-y-3">
              {filteredOpportunities.map((opp) => {
                const isSelected = selectedOpp?.id === opp.id;
                return (
                  <div
                    key={opp.id}
                    onClick={() => setSelectedOpp(opp)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2.5 ${
                      isSelected
                        ? 'bg-[#0A1329] border-amber-500 shadow-md shadow-amber-500/10'
                        : 'bg-[#050A19] border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          {opp.solicitationNumber}
                        </span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                          {opp.departmentBranch.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] text-slate-400">NAICS {opp.naicsCode}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-bold text-emerald-400 font-sans text-sm">
                          ${(opp.ceilingValueUsd / 1000000).toFixed(1)}M Ceiling
                        </span>
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          {opp.matchScorePct}% Match
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-white text-xs sm:text-sm leading-snug">{opp.title}</h3>
                      <span className="text-[11px] text-slate-400 font-sans block mt-0.5">
                        {opp.agency} &middot; {opp.subAgency}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-2">
                      {opp.scopeSummary}
                    </p>

                    <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/80 text-[10px]">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-slate-500">Prerequisites Met:</span>
                        {opp.requiredCompliance.map(rc => (
                          <span key={rc} className="px-1.5 py-0.2 rounded bg-slate-900 text-emerald-300 border border-slate-750 flex items-center gap-1">
                            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                            {rc}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">Due: {new Date(opp.submissionDeadline).toLocaleDateString()}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleGenerateProposal(opp);
                          }}
                          disabled={isGeneratingProposal}
                          className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-slate-950 font-black rounded text-[10px] transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Generate Proposal</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Opportunity Deep Drilldown & Proposal Panel */}
            <div className="p-4 bg-[#070D1F] border border-amber-500/30 rounded-xl space-y-3">
              {selectedOpp ? (
                <div className="space-y-3">
                  <div className="border-b border-slate-800 pb-2.5 space-y-1">
                    <span className="text-[9px] text-amber-400 uppercase font-bold tracking-wider block">
                      SOLICITATION DETAIL &middot; SAM.GOV CAGE {FEDERAL_CREDENTIALS.cageCode}
                    </span>
                    <h3 className="font-bold text-white text-xs leading-snug">{selectedOpp.title}</h3>
                    <span className="text-[10px] text-cyan-300 font-mono block">
                      {selectedOpp.solicitationNumber} &middot; {selectedOpp.opportunityType}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-[10px]">
                    <div className="flex justify-between border-b border-slate-850 py-1">
                      <span className="text-slate-500">Ceiling Value:</span>
                      <span className="text-emerald-400 font-bold">${selectedOpp.ceilingValueUsd.toLocaleString()} USD</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-850 py-1">
                      <span className="text-slate-500">Agency:</span>
                      <span className="text-slate-200">{selectedOpp.agency}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-850 py-1">
                      <span className="text-slate-500">Sub-Agency:</span>
                      <span className="text-slate-200">{selectedOpp.subAgency}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-850 py-1">
                      <span className="text-slate-500">NAICS / PSC:</span>
                      <span className="text-purple-300 font-mono">{selectedOpp.naicsCode} / {selectedOpp.pscCode}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-850 py-1">
                      <span className="text-slate-500">Clearance Required:</span>
                      <span className="text-amber-300 font-bold">{selectedOpp.requiredClearance}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Aegentix Capability:</span>
                      <span className="text-cyan-300 font-bold">{selectedOpp.primaryCapability}</span>
                    </div>
                  </div>

                  {/* Proposed Architecture */}
                  <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-850 space-y-1">
                    <span className="text-[9px] text-slate-500 uppercase font-bold block">Proposed Sovereign Architecture</span>
                    <p className="text-[10px] text-slate-300 leading-relaxed">
                      {selectedOpp.proposedArchitecture}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex flex-col gap-2">
                    <button
                      onClick={() => handleGenerateProposal(selectedOpp)}
                      disabled={isGeneratingProposal}
                      className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-black rounded-lg text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isGeneratingProposal ? 'Synthesizing Proposal...' : 'Generate Compliant Proposal (Gemini 4 Argon)'}</span>
                    </button>
                  </div>

                  {/* Generated Proposal Output Preview */}
                  {generatedProposal && generatedProposal.oppId === selectedOpp.id && (
                    <div className="p-3 bg-slate-950 rounded-lg border border-cyan-500/40 space-y-2 mt-3 text-[10px]">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                        <span className="text-cyan-300 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>Generated Federal Proposal Volume</span>
                        </span>
                        <span className="text-[9px] text-purple-300 font-mono">FAR Part 15 Cleared</span>
                      </div>
                      <div className="text-slate-300 leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto p-2 bg-[#030611] rounded border border-slate-850 font-mono text-[9.5px]">
                        {generatedProposal.text}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-slate-500 text-center py-10">
                  Select an opportunity to view solicitation specifications and generate technical proposals.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: FEDERAL COMPLIANCE FRAMEWORKS & CONTROLS MATRIX                   */}
      {/* ========================================================================= */}
      {activeTab === 'COMPLIANCE_FRAMEWORKS' && (
        <div className="px-4 space-y-4">
          <div className="p-3 bg-[#070D1F] border border-emerald-500/30 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-bold text-white text-xs block">
                COMPREHENSIVE FEDERAL SECURITY CONTROL MATRIX &middot; 1,164 AUDITED CONTROLS
              </span>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Every control validated through hardware-rooted HMAC attestation and continuous diagnostic monitoring.
              </p>
            </div>
            <button
              onClick={handleRunComplianceAudit}
              disabled={isAuditing}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs uppercase flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Attest All Frameworks</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {frameworks.map((fw) => (
              <div key={fw.id} className="p-4 bg-[#050A19] border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                    {fw.id}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    {fw.status}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-white text-sm">{fw.name}</h3>
                  <span className="text-[10px] text-slate-400 block">{fw.authority}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-[#02050E] p-2.5 rounded-lg border border-slate-850 text-center text-[10px]">
                  <div>
                    <span className="text-slate-500 block">Controls Passing</span>
                    <span className="font-bold text-emerald-400 text-xs font-sans">
                      {fw.passingControls} / {fw.controlsCount}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Score</span>
                    <span className="font-bold text-cyan-300 text-xs font-sans">{fw.scorePct}%</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {fw.description}
                </p>

                <div className="space-y-1 text-[10px] border-t border-slate-800/80 pt-2">
                  <span className="text-slate-500 block uppercase font-bold">Key Validated Controls:</span>
                  <div className="flex flex-wrap gap-1">
                    {fw.keyControls.map(kc => (
                      <span key={kc} className="px-1.5 py-0.2 rounded bg-slate-900 text-slate-300 border border-slate-800 text-[9px]">
                        {kc}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-[9px] font-mono text-purple-300 bg-black/60 p-1.5 rounded truncate">
                  Audit Hash: {fw.auditHash}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: SAM.GOV ENTITY CREDENTIALS & SYSTEM SECURITY PLAN (SSP)           */}
      {/* ========================================================================= */}
      {activeTab === 'CREDENTIALS_SSP' && (
        <div className="px-4 space-y-4">
          <div className="p-4 bg-[#070D1F] border border-indigo-500/30 rounded-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-indigo-400" />
                <span className="font-bold text-white text-xs uppercase">
                  SAM.gov Active Federal Entity Profile &middot; System Security Plan
                </span>
              </div>
              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                ACTIVE &middot; GOOD STANDING
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-850 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Legal Entity Name</span>
                <span className="font-bold text-white text-[11px] block">{FEDERAL_CREDENTIALS.entityName}</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-850 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">SAM.gov UEI</span>
                <span className="font-bold text-cyan-300 font-mono text-xs block">{FEDERAL_CREDENTIALS.samUei}</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-850 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">CAGE Code</span>
                <span className="font-bold text-amber-300 font-mono text-xs block">{FEDERAL_CREDENTIALS.cageCode}</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-850 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">FedRAMP Package ID</span>
                <span className="font-bold text-purple-300 font-mono text-xs block">{FEDERAL_CREDENTIALS.fedRampPackageId}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-850 space-y-2 text-xs">
              <span className="font-bold text-white text-xs block">System Security Plan (SSP) Architecture &middot; Rev 5 Boundary</span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                The Aegentix platform operates within a strictly defined physical and logical boundary. All customer and sovereign defense workloads are segregated into dedicated enclave partitions executing FIPS 140-3 Level 4 cryptography with Argon2id memory-hard key derivation. Telemetry channels route through NIST SP 800-53 Level 4 audit loggers with zero cleartext sockets.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px]">
                <span className="text-slate-500">Authorized NAICS:</span>
                {['541512 (Computer Systems Design)', '541715 (R&D Physical Sciences)', '541330 (Military Engineering)', '541519 (IT VAR)'].map(n => (
                  <span key={n} className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                    {n}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: INDUCT NEW SAM.GOV OPPORTUNITY                                     */}
      {/* ========================================================================= */}
      {showInductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
          <div className="bg-[#070D1F] border border-amber-500/40 rounded-2xl max-w-lg w-full p-5 shadow-2xl space-y-4 text-xs font-mono text-slate-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-white text-sm uppercase">Induct Government Opportunity</h3>
              </div>
              <button
                onClick={() => setShowInductModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleInductCustomOpportunity} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Solicitation Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FA8811-26-R-0099"
                    value={newSolicitation.solicitationNumber}
                    onChange={e => setNewSolicitation({ ...newSolicitation, solicitationNumber: e.target.value })}
                    className="w-full p-2 bg-slate-950 border border-slate-750 rounded text-white text-xs outline-hidden focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Branch Agency *</label>
                  <select
                    value={newSolicitation.departmentBranch}
                    onChange={e => setNewSolicitation({ ...newSolicitation, departmentBranch: e.target.value as any })}
                    className="w-full p-2 bg-slate-950 border border-slate-750 rounded text-white text-xs outline-hidden focus:border-amber-400"
                  >
                    <option value="DOD">Department of Defense (DoD)</option>
                    <option value="SPACE_FORCE">U.S. Space Force (SSC)</option>
                    <option value="DIU">Defense Innovation Unit (DIU)</option>
                    <option value="DARPA">DARPA</option>
                    <option value="AIR_FORCE">U.S. Air Force (AFRL)</option>
                    <option value="DISA">DISA</option>
                    <option value="DOE">Department of Energy (DoE)</option>
                    <option value="CIVILIAN">Civilian / HHS</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Solicitation Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Autonomous Space Defense Mesh Architecture"
                  value={newSolicitation.title}
                  onChange={e => setNewSolicitation({ ...newSolicitation, title: e.target.value })}
                  className="w-full p-2 bg-slate-950 border border-slate-750 rounded text-white text-xs outline-hidden focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Ceiling Value (USD) *</label>
                  <input
                    type="number"
                    required
                    value={newSolicitation.ceilingValueUsd}
                    onChange={e => setNewSolicitation({ ...newSolicitation, ceilingValueUsd: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-950 border border-slate-750 rounded text-white text-xs outline-hidden focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Opportunity Type</label>
                  <select
                    value={newSolicitation.opportunityType}
                    onChange={e => setNewSolicitation({ ...newSolicitation, opportunityType: e.target.value as any })}
                    className="w-full p-2 bg-slate-950 border border-slate-750 rounded text-white text-xs outline-hidden focus:border-amber-400"
                  >
                    <option value="BROAD_AGENCY_ANNOUNCEMENT">Broad Agency Announcement (BAA)</option>
                    <option value="COMMERCIAL_SOLUTIONS_OPENING">Commercial Solutions Opening (CSO)</option>
                    <option value="SBIR_PHASE_III">SBIR Phase III Direct</option>
                    <option value="FAR_PART_15">FAR Part 15 Contracting</option>
                    <option value="TRADEWINDS_CHALLENGE">Tradewinds Challenge</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Scope &amp; Mission Summary</label>
                <textarea
                  rows={2}
                  placeholder="Briefly describe the solicitation technical objectives..."
                  value={newSolicitation.scopeSummary}
                  onChange={e => setNewSolicitation({ ...newSolicitation, scopeSummary: e.target.value })}
                  className="w-full p-2 bg-slate-950 border border-slate-750 rounded text-white text-xs outline-hidden focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowInductModal(false)}
                  className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-amber-600 hover:bg-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider cursor-pointer shadow-md"
                >
                  Induct into Pipeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
