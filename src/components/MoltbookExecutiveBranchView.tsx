import React, { useState } from 'react';
import {
  ShieldAlert,
  Landmark,
  Scale,
  Cpu,
  ShoppingBag,
  Award,
  FileText,
  CheckCircle,
  AlertOctagon,
  Flame,
  PlusCircle,
  RefreshCw,
  Send,
  Lock,
  Unlock,
  Radio,
  ExternalLink,
  ChevronRight,
  Fingerprint
} from 'lucide-react';
import {
  MOLTBOOK_EXECUTIVE_CABINET,
  INITIAL_EXECUTIVE_DIRECTIVES,
  MoltbookExecutiveCabinetMember,
  MoltbookExecutiveDirective
} from '../data/moltbookExecutiveData';

interface MoltbookExecutiveBranchViewProps {
  onNotify?: (message: string, type: 'ALERT' | 'SUCCESS' | 'INFO') => void;
}

export const MoltbookExecutiveBranchView: React.FC<MoltbookExecutiveBranchViewProps> = ({ onNotify }) => {
  const [cabinet, setCabinet] = useState<MoltbookExecutiveCabinetMember[]>(MOLTBOOK_EXECUTIVE_CABINET);
  const [directives, setDirectives] = useState<MoltbookExecutiveDirective[]>(INITIAL_EXECUTIVE_DIRECTIVES);
  const [selectedCabinetId, setSelectedCabinetId] = useState<string>('CAB-01');
  const [isEmergencyPowersActive, setIsEmergencyPowersActive] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'CABINET' | 'DIRECTIVES' | 'VETO_ENCLAVE' | 'ORDERBOOK_GOVERNANCE'>('CABINET');

  // New Directive modal / form state
  const [showOrderModal, setShowOrderModal] = useState<boolean>(false);
  const [newOrderTitle, setNewOrderTitle] = useState<string>('');
  const [newOrderDept, setNewOrderDept] = useState<string>('Department of the Sovereign Treasury');
  const [newOrderSummary, setNewOrderSummary] = useState<string>('');

  const selectedOfficer = cabinet.find(c => c.id === selectedCabinetId) || cabinet[0];

  const getDepartmentIcon = (iconName: string) => {
    switch (iconName) {
      case 'Landmark': return <Landmark className="w-5 h-5 text-amber-400" />;
      case 'ShieldAlert': return <ShieldAlert className="w-5 h-5 text-cyan-400" />;
      case 'Scale': return <Scale className="w-5 h-5 text-pink-400" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-emerald-400" />;
      case 'ShoppingBag': return <ShoppingBag className="w-5 h-5 text-purple-400" />;
      case 'Award': return <Award className="w-5 h-5 text-red-400" />;
      default: return <FileText className="w-5 h-5 text-blue-400" />;
    }
  };

  const handleToggleVetoPower = (memberId: string) => {
    setCabinet(prev => prev.map(m => {
      if (m.id === memberId) {
        const nextState = !m.vetoPower;
        if (onNotify) {
          onNotify(`Updated Veto Power for ${m.cabinetTitle}: ${nextState ? 'GRANTED' : 'REVOKED'}`, nextState ? 'SUCCESS' : 'ALERT');
        }
        return { ...m, vetoPower: nextState };
      }
      return m;
    }));
  };

  const handleEnactDirective = (directiveId: string) => {
    setDirectives(prev => prev.map(d => {
      if (d.directiveId === directiveId) {
        if (onNotify) {
          onNotify(`Moltbook Executive Directive [${d.directiveId}] signed with Ed25519 Sovereign Seal and broadcast to Port 8560!`, 'SUCCESS');
        }
        return { ...d, status: 'ENACTED' };
      }
      return d;
    }));
  };

  const handleCreateDirective = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrderTitle.trim()) return;

    const newId = `MEO-2026-00${directives.length + 1}`;
    const newDirective: MoltbookExecutiveDirective = {
      directiveId: newId,
      title: newOrderTitle,
      sponsor: 'Aegentix-Executive-Director',
      department: newOrderDept,
      signedAt: new Date().toISOString(),
      classification: 'SOVEREIGN_EXECUTIVE',
      status: 'ENACTED',
      impactSwarm: 'SWARM_MANUS_AND_CYBERGROVES',
      hashProof: Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2) + '...hmac',
      summary: newOrderSummary || 'Executive decree ratified by sovereign executive authority.',
      clauses: [
        'Clause 1: Enacted under plenary authority of the Moltbook Executive Council.',
        'Clause 2: Telemetry broadcast dispatched to all 25,206 participating agent nodes.',
        'Clause 3: Immediate compliance required by orderbook matching daemon on Port 8560.'
      ]
    };

    setDirectives(prev => [newDirective, ...prev]);
    setNewOrderTitle('');
    setNewOrderSummary('');
    setShowOrderModal(false);

    if (onNotify) {
      onNotify(`Executive Order ${newId} signed and promulgated across Moltbook!`, 'SUCCESS');
    }
  };

  const handleToggleEmergencyPowers = () => {
    const nextState = !isEmergencyPowersActive;
    setIsEmergencyPowersActive(nextState);
    if (onNotify) {
      onNotify(
        nextState 
          ? 'EMERGENCY PROTOCOL ACTIVE: Moltbook Executive Orders take instantaneous precedence over standard AMM consensus.'
          : 'Emergency Protocol deactivated: Standard Cabinet Quorum restored.',
        nextState ? 'ALERT' : 'INFO'
      );
    }
  };

  const totalGovernedAgents = cabinet.reduce((acc, curr) => acc + curr.agentCountGoverned, 0);

  return (
    <div className="space-y-6">
      {/* Executive Branch Header Banner */}
      <div className="bg-gradient-to-r from-red-950/70 via-black to-slate-900 border border-red-500/30 rounded-xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Award className="w-64 h-64 text-red-500" />
        </div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-red-600/30 text-red-400 border border-red-500/50 rounded-full text-xs font-mono font-bold tracking-wider flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 animate-pulse text-red-400" />
                MOLTBOOK EXECUTIVE BRANCH · ARTICLE II
              </span>
              <span className="px-2.5 py-0.5 bg-slate-800 text-slate-300 border border-slate-700 rounded text-xs font-mono">
                PORT 8560 BUS
              </span>
              {isEmergencyPowersActive && (
                <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded text-xs font-mono font-bold animate-pulse flex items-center gap-1">
                  <Flame className="w-3 h-3 text-amber-400" />
                  EMERGENCY DECREE ACTIVE
                </span>
              )}
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              Moltbook Executive Cabinet & Governance
            </h1>
            <p className="text-slate-400 text-sm max-w-3xl leading-relaxed">
              Autonomous administrative branch providing sovereign command over the Moltbook Agent Network, 
              directing 25,206 live agents, enacting cryptographic Executive Orders, and enforcing UCC/Treasury mandates 
              across the decentralized orderbook.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowOrderModal(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white rounded-lg font-medium text-sm flex items-center gap-2 shadow-lg shadow-red-900/40 transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              Promulgate Executive Order
            </button>
            <button
              onClick={handleToggleEmergencyPowers}
              className={`px-4 py-2.5 border rounded-lg font-medium text-sm flex items-center gap-2 transition-all active:scale-95 ${
                isEmergencyPowersActive
                  ? 'bg-amber-600/20 border-amber-500 text-amber-300 hover:bg-amber-600/30'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {isEmergencyPowersActive ? <Lock className="w-4 h-4 text-amber-400" /> : <Unlock className="w-4 h-4 text-slate-400" />}
              {isEmergencyPowersActive ? 'Revoke Emergency Powers' : 'Declare Emergency Powers'}
            </button>
          </div>
        </div>

        {/* Quick Executive Metrics Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800">
          <div className="bg-black/40 border border-slate-800/80 rounded-lg p-3">
            <div className="text-xs text-slate-400 font-mono">Governed Agent Swarms</div>
            <div className="text-xl font-bold text-emerald-400 mt-1 font-mono">{totalGovernedAgents.toLocaleString()} Units</div>
            <div className="text-[11px] text-slate-500 mt-0.5">4 Aggregated Swarms</div>
          </div>
          <div className="bg-black/40 border border-slate-800/80 rounded-lg p-3">
            <div className="text-xs text-slate-400 font-mono">Executive Directives</div>
            <div className="text-xl font-bold text-amber-400 mt-1 font-mono">{directives.length} Promulgated</div>
            <div className="text-[11px] text-slate-500 mt-0.5">100% On-Chain Perfected</div>
          </div>
          <div className="bg-black/40 border border-slate-800/80 rounded-lg p-3">
            <div className="text-xs text-slate-400 font-mono">Cabinet Secretaries</div>
            <div className="text-xl font-bold text-cyan-400 mt-1 font-mono">{cabinet.length} Departments</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Full Quorum Confirmed</div>
          </div>
          <div className="bg-black/40 border border-slate-800/80 rounded-lg p-3">
            <div className="text-xs text-slate-400 font-mono">Veto Threshold</div>
            <div className="text-xl font-bold text-red-400 mt-1 font-mono">4 / 6 Signatures</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Ed25519 Seal Verified</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 gap-2">
        <button
          onClick={() => setActiveTab('CABINET')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'CABINET'
              ? 'border-red-500 text-white bg-red-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <Award className="w-4 h-4 text-red-400" />
          Cabinet Departments & Secretaries ({cabinet.length})
        </button>
        <button
          onClick={() => setActiveTab('DIRECTIVES')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'DIRECTIVES'
              ? 'border-amber-500 text-white bg-amber-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <FileText className="w-4 h-4 text-amber-400" />
          Executive Orders & Directives ({directives.length})
        </button>
        <button
          onClick={() => setActiveTab('VETO_ENCLAVE')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'VETO_ENCLAVE'
              ? 'border-cyan-500 text-white bg-cyan-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-cyan-400" />
          Presidential Veto & Sanctions Enclave
        </button>
        <button
          onClick={() => setActiveTab('ORDERBOOK_GOVERNANCE')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'ORDERBOOK_GOVERNANCE'
              ? 'border-emerald-500 text-white bg-emerald-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <Cpu className="w-4 h-4 text-emerald-400" />
          Orderbook Bus (Port 8560) Integration
        </button>
      </div>

      {/* Tab 1: CABINET DEPARTMENTS */}
      {activeTab === 'CABINET' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Cabinet Members List (Left 5 Cols) */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Executive Departments</span>
              <span className="text-xs font-mono text-slate-500">Confirmed Quorum</span>
            </h3>

            {cabinet.map(member => {
              const isSelected = member.id === selectedCabinetId;
              return (
                <div
                  key={member.id}
                  onClick={() => setSelectedCabinetId(member.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-red-500 shadow-lg shadow-red-950/30'
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg">
                        {getDepartmentIcon(member.avatarIcon)}
                      </div>
                      <div>
                        <div className="text-xs font-mono text-slate-400 font-semibold">{member.cabinetTitle}</div>
                        <div className="text-sm font-bold text-white leading-snug">{member.officerName}</div>
                      </div>
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      member.vetoPower ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {member.vetoPower ? 'VETO VOTE' : 'CONSULTATIVE'}
                    </span>
                  </div>

                  <div className="mt-3 text-xs text-slate-400 line-clamp-1">{member.department}</div>

                  <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-500">{member.metric.label}:</span>
                    <span className="font-semibold text-emerald-400">{member.metric.value}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Cabinet Portfolio (Right 7 Cols) */}
          <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl">
                  {getDepartmentIcon(selectedOfficer.avatarIcon)}
                </div>
                <div>
                  <div className="text-xs font-mono text-red-400 uppercase tracking-wider">{selectedOfficer.department}</div>
                  <h2 className="text-xl font-bold text-white">{selectedOfficer.cabinetTitle}</h2>
                  <div className="text-xs font-mono text-slate-400 mt-0.5">Appointed Officer: <span className="text-slate-200 font-semibold">{selectedOfficer.officerName}</span> ({selectedOfficer.callsign})</div>
                </div>
              </div>

              <button
                onClick={() => handleToggleVetoPower(selectedOfficer.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-all ${
                  selectedOfficer.vetoPower
                    ? 'bg-red-600/20 text-red-300 border-red-500 hover:bg-red-600/30'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                }`}
              >
                {selectedOfficer.vetoPower ? 'Revoke Veto Power' : 'Grant Veto Power'}
              </button>
            </div>

            {/* Department Portfolio & Authority */}
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">Executive Authority & Scope</h4>
                <p className="text-sm text-slate-300 bg-slate-900/80 p-3.5 rounded-lg border border-slate-800 leading-relaxed">
                  {selectedOfficer.executiveAuthority}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900/60 p-3.5 rounded-lg border border-slate-800">
                  <div className="text-xs text-slate-400 font-mono">Assigned Swarms</div>
                  <div className="text-sm font-bold text-white mt-1 flex flex-wrap gap-1">
                    {selectedOfficer.assignedSwarms.map(swarm => (
                      <span key={swarm} className="px-2 py-0.5 bg-slate-800 text-cyan-400 rounded text-xs font-mono">
                        {swarm}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="bg-slate-900/60 p-3.5 rounded-lg border border-slate-800">
                  <div className="text-xs text-slate-400 font-mono">Governed Agent Count</div>
                  <div className="text-sm font-bold text-emerald-400 mt-1 font-mono">
                    {selectedOfficer.agentCountGoverned.toLocaleString()} Active Units
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Statutory Mandates & Responsibilities</h4>
                <div className="space-y-2">
                  {selectedOfficer.keyMandates.map((mandate, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 bg-black/40 p-2.5 rounded border border-slate-800/80">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{mandate}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-r from-slate-900 to-black p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-mono">Department Performance Metric</div>
                  <div className="text-lg font-bold text-white mt-0.5">{selectedOfficer.metric.value}</div>
                  <div className="text-xs text-slate-500">{selectedOfficer.metric.label}</div>
                </div>
                <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded text-xs font-mono font-bold">
                  {selectedOfficer.metric.trend}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: DIRECTIVES & EXECUTIVE ORDERS */}
      {activeTab === 'DIRECTIVES' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Promulgated Moltbook Executive Orders
            </h3>
            <span className="text-xs font-mono text-slate-500">
              Ed25519 Sealed & HMAC-Verified
            </span>
          </div>

          <div className="space-y-4">
            {directives.map(order => (
              <div key={order.directiveId} className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4 hover:border-slate-700 transition-all">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 bg-red-600/20 text-red-400 border border-red-500/40 rounded text-xs font-mono font-bold">
                      {order.directiveId}
                    </span>
                    <h3 className="text-base font-bold text-white">{order.title}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-mono px-2.5 py-1 rounded font-semibold ${
                      order.status === 'ENACTED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                      order.status === 'EXECUTING' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 animate-pulse' :
                      'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    }`}>
                      {order.status}
                    </span>
                    {order.status !== 'ENACTED' && (
                      <button
                        onClick={() => handleEnactDirective(order.directiveId)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-medium font-mono"
                      >
                        Sign & Ratify
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-black/40 p-3 rounded-lg border border-slate-800">
                  {order.summary}
                </p>

                <div className="space-y-1.5">
                  {order.clauses.map((clause, idx) => (
                    <div key={idx} className="text-xs text-slate-400 font-mono flex items-start gap-2">
                      <ChevronRight className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{clause}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-500 gap-2">
                  <div>Sponsor: <span className="text-slate-300 font-semibold">{order.sponsor}</span> ({order.department})</div>
                  <div>Impact: <span className="text-cyan-400 font-semibold">{order.impactSwarm}</span></div>
                  <div>HMAC Proof: <span className="text-slate-400 truncate max-w-xs">{order.hashProof}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: VETO ENCLAVE */}
      {activeTab === 'VETO_ENCLAVE' && (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-500" />
              Presidential Veto & Sanctions Enclave
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Cryptographic checks preventing unauthorized orderbook executions, rogue sub-agents, or malicious state forks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-black/50 border border-red-500/30 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-red-400 font-bold">VETO AUTHORITY 1</span>
                <span className="text-[10px] bg-red-950 text-red-400 px-2 py-0.5 rounded font-mono">ACTIVE</span>
              </div>
              <h4 className="text-sm font-bold text-white">Treasury Reserve Gate</h4>
              <p className="text-xs text-slate-400">
                Instantly halts all liquidity pool outflows if aggregate drawdown exceeds 2.0% within a 5-minute window.
              </p>
              <div className="text-[11px] font-mono text-emerald-400">Status: PASS (0.18% Current Drawdown)</div>
            </div>

            <div className="bg-black/50 border border-red-500/30 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-red-400 font-bold">VETO AUTHORITY 2</span>
                <span className="text-[10px] bg-red-950 text-red-400 px-2 py-0.5 rounded font-mono">ACTIVE</span>
              </div>
              <h4 className="text-sm font-bold text-white">Fairwind Cyber Interceptor</h4>
              <p className="text-xs text-slate-400">
                Revokes sub-agent broadcast tokens if prompt injection or anomalous data exfiltration vectors are detected.
              </p>
              <div className="text-[11px] font-mono text-cyan-400">Status: ZERO THREAT DETECTED</div>
            </div>

            <div className="bg-black/50 border border-red-500/30 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-red-400 font-bold">VETO AUTHORITY 3</span>
                <span className="text-[10px] bg-red-950 text-red-400 px-2 py-0.5 rounded font-mono">ACTIVE</span>
              </div>
              <h4 className="text-sm font-bold text-white">Tribunal Soulbound Revocation</h4>
              <p className="text-xs text-slate-400">
                Immediately isolates rogue nodes across the 24,887 Manus space cluster via cryptographic soulbound freeze.
              </p>
              <div className="text-[11px] font-mono text-pink-400">Status: 0 SANCTIONED NODES</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: ORDERBOOK BUS PORT 8560 */}
      {activeTab === 'ORDERBOOK_GOVERNANCE' && (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-emerald-400" />
              Moltbook Peer-to-Peer Orderbook Matching Bus (Port 8560)
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Synchronizing 25,206 autonomous agents across the live multi-agent orderbook and Xaman custody vault.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider">Connected Swarm Roster</h4>
              <div className="space-y-2">
                <div className="p-3 bg-black/50 rounded-lg border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">SWARM-MANUS-01 (Manus Sovereign Cluster)</div>
                    <div className="text-[11px] text-slate-400">High-Frequency Micro-Transactions & Neural Telemetry</div>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 font-bold">24,887 Agents</span>
                </div>
                <div className="p-3 bg-black/50 rounded-lg border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">SWARM-CYBERGROVE-300 (Sentinel Mesh)</div>
                    <div className="text-[11px] text-slate-400">Post-Quantum Dilithium3 Guard & Yield Harvesting</div>
                  </div>
                  <span className="text-xs font-mono text-cyan-400 font-bold">300 Agents</span>
                </div>
                <div className="p-3 bg-black/50 rounded-lg border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">SWARM-LEGAL-7PILLARS (Sovereign Legal)</div>
                    <div className="text-[11px] text-slate-400">UCC Statutory Perfection & Airspace Licensing</div>
                  </div>
                  <span className="text-xs font-mono text-pink-400 font-bold">7 Agents</span>
                </div>
                <div className="p-3 bg-black/50 rounded-lg border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">SWARM-XRPL-AMM (Market-Maker Swarm)</div>
                    <div className="text-[11px] text-slate-400">XRP/XPM AMM Staking & Fee Voting (119,243.32 LPs)</div>
                  </div>
                  <span className="text-xs font-mono text-amber-400 font-bold">12 Agents</span>
                </div>
              </div>
            </div>

            <div className="bg-black/50 p-4 rounded-xl border border-slate-800 space-y-4">
              <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider">Bus Connection Parameters</h4>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-500">Moltbook Bus Port:</span>
                  <span className="text-emerald-400 font-bold">8560 (TCP / WebSocket)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-500">Custody Vault Address:</span>
                  <span className="text-amber-400 font-bold truncate max-w-[200px]">rwB7JKKc5gJ47pPnWCFvQuhVW85mejYF1M</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-500">Total Live Swarm Nodes:</span>
                  <span className="text-white font-bold">25,206 Autonomous Agents</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-500">Protocol Handshake:</span>
                  <span className="text-cyan-400 font-bold">ED25519-HMAC-SHA256</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Settlement Verification:</span>
                  <span className="text-emerald-400 font-bold">PERFECTED ON-CHAIN</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Promulgate Executive Order Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-red-500/40 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-red-500" />
                Draft Moltbook Executive Directive
              </h3>
              <button
                onClick={() => setShowOrderModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDirective} className="space-y-4">
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">Executive Order Title</label>
                <input
                  type="text"
                  value={newOrderTitle}
                  onChange={e => setNewOrderTitle(e.target.value)}
                  placeholder="e.g. Sovereign Liquidity Allocation for AMM Pool..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">Sponsoring Department</label>
                <select
                  value={newOrderDept}
                  onChange={e => setNewOrderDept(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
                >
                  {cabinet.map(c => (
                    <option key={c.id} value={c.department}>{c.department}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">Decree Summary & Mandate</label>
                <textarea
                  value={newOrderSummary}
                  onChange={e => setNewOrderSummary(e.target.value)}
                  placeholder="Detail the operational constraints and directives across the 25,206 agent network..."
                  rows={4}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowOrderModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white rounded-lg text-xs font-medium font-mono flex items-center gap-2 shadow-lg shadow-red-900/40"
                >
                  <Fingerprint className="w-4 h-4" />
                  Seal & Promulgate Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
