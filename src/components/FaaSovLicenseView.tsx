import React, { useState } from 'react';
import {
  Plane,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Award,
  Radio,
  FileCheck,
  AlertTriangle,
  QrCode,
  Lock,
  Compass,
  Layers,
  Activity,
  Sliders,
  CheckCircle2,
  Copy,
  ExternalLink,
  ChevronRight,
  Sparkles,
  RefreshCw,
  Terminal,
  Zap,
} from 'lucide-react';
import {
  FAA_SOV_CLASSES,
  AIRSPACE_ZONES,
  VIOLATIONS_TABLE,
  INITIAL_AIRCRAFT_REGISTRATIONS,
  INITIAL_PILOT_PROFILE,
  SAMPLE_EXAM_QUESTIONS,
  FaaSovClass,
  AirspaceZone,
  AircraftRegistration,
  PilotLicenseProfile,
} from '../data/faaSovLicenseData';

interface FaaSovLicenseViewProps {
  onNotify?: (message: string, type: 'ALERT' | 'SUCCESS' | 'INFO') => void;
}

export const FaaSovLicenseView: React.FC<FaaSovLicenseViewProps> = ({ onNotify }) => {
  const [activeTab, setActiveTab] = useState<'CREDENTIAL' | 'CLASSES' | 'EXAM' | 'AIRSPACE' | 'AIRCRAFT' | 'SANCTIONS' | 'CLI'>('CREDENTIAL');
  const [pilot, setPilot] = useState<PilotLicenseProfile>(INITIAL_PILOT_PROFILE);
  const [aircraftList, setAircraftList] = useState<AircraftRegistration[]>(INITIAL_AIRCRAFT_REGISTRATIONS);
  const [selectedClass, setSelectedClass] = useState<FaaSovClass>(FAA_SOV_CLASSES[2]); // Default S-2
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Exam State
  const [examAnswers, setExamAnswers] = useState<Record<number, number>>({});
  const [examSubmitted, setExamSubmitted] = useState<boolean>(false);
  const [examScore, setExamScore] = useState<number>(0);

  // New Aircraft Form State
  const [newManufacturer, setNewManufacturer] = useState('');
  const [newModel, setNewModel] = useState('');
  const [newWeightClass, setNewWeightClass] = useState<'Class I (<250g)' | 'Class II (250g-2kg)' | 'Class III (25kg-150kg)' | 'Class IV (>150kg)'>('Class II (250g-2kg)');
  const [newPropulsion, setNewPropulsion] = useState<'Electric' | 'Hybrid Turbine' | 'Hydrogen Fuel Cell'>('Electric');
  const [newMeshNode, setNewMeshNode] = useState('MESH-NODE-' + Math.floor(100 + Math.random() * 900));

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    if (onNotify) onNotify(`Copied ${label} to clipboard!`, 'SUCCESS');
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleAnswerSelect = (qId: number, optionIdx: number) => {
    setExamAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const handleSubmitExam = (e: React.FormEvent) => {
    e.preventDefault();
    let correct = 0;
    SAMPLE_EXAM_QUESTIONS.forEach(q => {
      if (examAnswers[q.id] === q.correctAnswer) correct++;
    });
    const percentage = Math.round((correct / SAMPLE_EXAM_QUESTIONS.length) * 100);
    setExamScore(percentage);
    setExamSubmitted(true);

    if (percentage >= 75) {
      if (onNotify) onNotify(`🏆 Exam Passed with ${percentage}%! Accreditation recorded on TSL Registry.`, 'SUCCESS');
    } else {
      if (onNotify) onNotify(`⚠️ Score ${percentage}% (80% minimum required). Review FAA-SOV Addendums and retry.`, 'ALERT');
    }
  };

  const handleRegisterAircraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newManufacturer || !newModel) {
      if (onNotify) onNotify('Please specify both manufacturer and model.', 'ALERT');
      return;
    }

    const regNum = `SOV-UAV-00${aircraftList.length + 1}`;
    const hash = '0x' + Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const newReg: AircraftRegistration = {
      regNumber: regNum,
      manufacturer: newManufacturer,
      model: newModel,
      serialHash: hash,
      weightClass: newWeightClass,
      propulsion: newPropulsion,
      meshNodeId: newMeshNode,
      insuranceBondEsc: newWeightClass.includes('Class I') ? 500 : newWeightClass.includes('Class II') ? 2500 : 10000,
      ownerAddress: pilot.ownerAddress,
      registeredAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 365 * 2 * 24 * 3600 * 1000).toISOString(),
      airworthinessStatus: 'AIRWORTHY',
    };

    setAircraftList([newReg, ...aircraftList]);
    setNewManufacturer('');
    setNewModel('');
    if (onNotify) onNotify(`✅ Aircraft ${regNum} registered on TSL with Mesh Node ${newMeshNode}!`, 'SUCCESS');
  };

  return (
    <div className="bg-[#030508] border border-amber-500/30 rounded-xl overflow-hidden shadow-2xl space-y-4 font-mono text-xs text-slate-200">
      {/* HEADER BANNER */}
      <div className="p-4 sm:p-5 border-b border-amber-500/20 bg-gradient-to-r from-[#030508] via-[#0A1420] to-[#030810] flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 via-yellow-600 to-slate-900 border border-amber-500/40 flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
            <Plane className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-amber-300 tracking-wider uppercase font-sans">
                FAA-SOV CLASS LICENSE &middot; SOVEREIGN OPERATIONS CERTIFICATION
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-black border flex items-center gap-1 bg-amber-500/20 text-amber-300 border-amber-500/40">
                <ShieldCheck className="w-3 h-3 text-amber-400" />
                BUILD: SOV-FAA-001
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-black border flex items-center gap-1 bg-cyan-500/20 text-cyan-300 border-cyan-500/40">
                <Radio className="w-3 h-3 text-cyan-400" />
                JURISDICTION: TSL/XRPL
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Principal: <span className="text-amber-200 font-bold">shalominattii-us</span> &middot; Issuing: <span className="text-cyan-300">IUSTITIA-001 (48&deg;)</span> &middot; Enforcement: <span className="text-purple-300">VIGIL-001 (60&deg;)</span> &middot; Token: <span className="text-emerald-300">TSL-SBT (Soulbound)</span>
            </p>
          </div>
        </div>

        {/* Quick Credentials Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700 flex items-center gap-2">
            <span className="text-[10px] text-slate-400">Class:</span>
            <span className="font-bold text-cyan-300">{pilot.classLevel} Commercial</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700 flex items-center gap-2">
            <span className="text-[10px] text-slate-400">Staked Bond:</span>
            <span className="font-bold text-amber-300">{pilot.escStaked.toLocaleString()} ESC</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 flex items-center gap-1.5 text-emerald-300 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>CERTIFIED ACTIVE</span>
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="px-4 border-b border-slate-800 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveTab('CREDENTIAL')}
          className={`flex items-center gap-1.5 px-3 py-2 border-b-2 font-bold transition-colors cursor-pointer ${
            activeTab === 'CREDENTIAL'
              ? 'border-amber-400 text-amber-300 bg-amber-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Sovereign Pilot Credential</span>
        </button>

        <button
          onClick={() => setActiveTab('CLASSES')}
          className={`flex items-center gap-1.5 px-3 py-2 border-b-2 font-bold transition-colors cursor-pointer ${
            activeTab === 'CLASSES'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Certification Classes (S-0 to S-5)</span>
          <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 text-[9px] font-bold">6</span>
        </button>

        <button
          onClick={() => setActiveTab('EXAM')}
          className={`flex items-center gap-1.5 px-3 py-2 border-b-2 font-bold transition-colors cursor-pointer ${
            activeTab === 'EXAM'
              ? 'border-yellow-400 text-yellow-300 bg-yellow-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileCheck className="w-3.5 h-3.5" />
          <span>Aeronautical Exam Enclave</span>
        </button>

        <button
          onClick={() => setActiveTab('AIRSPACE')}
          className={`flex items-center gap-1.5 px-3 py-2 border-b-2 font-bold transition-colors cursor-pointer ${
            activeTab === 'AIRSPACE'
              ? 'border-purple-400 text-purple-300 bg-purple-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Airspace Corridors &amp; Zones</span>
          <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 text-[9px] font-bold">4 Zones</span>
        </button>

        <button
          onClick={() => setActiveTab('AIRCRAFT')}
          className={`flex items-center gap-1.5 px-3 py-2 border-b-2 font-bold transition-colors cursor-pointer ${
            activeTab === 'AIRCRAFT'
              ? 'border-emerald-400 text-emerald-300 bg-emerald-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Plane className="w-3.5 h-3.5" />
          <span>Aircraft Registry</span>
          <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-bold">
            {aircraftList.length} UAVs
          </span>
        </button>

        <button
          onClick={() => setActiveTab('SANCTIONS')}
          className={`flex items-center gap-1.5 px-3 py-2 border-b-2 font-bold transition-colors cursor-pointer ${
            activeTab === 'SANCTIONS'
              ? 'border-red-400 text-red-300 bg-red-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Tribunal Sanctions &amp; Violations</span>
        </button>

        <button
          onClick={() => setActiveTab('CLI')}
          className={`flex items-center gap-1.5 px-3 py-2 border-b-2 font-bold transition-colors cursor-pointer ${
            activeTab === 'CLI'
              ? 'border-amber-400 text-amber-300 bg-amber-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>sovereign-cli Commands</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: PILOT CREDENTIAL (SOULBOUND TOKEN TSL-SBT)        */}
      {/* ========================================================= */}
      {activeTab === 'CREDENTIAL' && (
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left: Holographic Pilot License Card (7 cols) */}
            <div className="lg:col-span-7 bg-gradient-to-br from-[#0A1420] via-[#060C14] to-[#0A1828] border-2 border-amber-500/50 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
              {/* Holographic Watermark Background */}
              <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none">
                <Plane className="w-96 h-96 text-amber-400" />
              </div>

              {/* Card Header */}
              <div className="flex items-start justify-between border-b border-amber-500/30 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border border-amber-400/80 bg-amber-500/10 flex items-center justify-center font-black text-amber-300 text-sm shadow-inner">
                    SOV
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm tracking-widest font-sans uppercase">
                      FEDERAL AVIATION ADMINISTRATION
                    </h3>
                    <p className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">
                      SOVEREIGN OPERATIONS PILOT CERTIFICATE &middot; TSL-SBT
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/50">
                    CLASS {pilot.classLevel} COMMERCIAL
                  </span>
                  <div className="text-[9px] text-slate-400 font-mono mt-1">{pilot.licenseId}</div>
                </div>
              </div>

              {/* Pilot Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-4 text-xs">
                <div>
                  <span className="text-[9px] text-slate-400 uppercase block font-bold">Principal / Pilot:</span>
                  <span className="text-white font-bold font-sans text-sm">{pilot.principal}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 uppercase block font-bold">XRPL Anchor Address:</span>
                  <span className="text-cyan-300 font-mono text-[11px] truncate block" title={pilot.ownerAddress}>
                    {pilot.ownerAddress.slice(0, 16)}...
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 uppercase block font-bold">Valid Until:</span>
                  <span className="text-amber-300 font-bold">{pilot.expiryDate}</span>
                </div>

                <div>
                  <span className="text-[9px] text-slate-400 uppercase block font-bold">Logged Flight Time:</span>
                  <span className="text-white font-bold">{pilot.flightHoursLogged} hrs ({pilot.picHoursLogged} PIC)</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 uppercase block font-bold">Swarm Coordination:</span>
                  <span className="text-purple-300 font-bold">{pilot.swarmHoursLogged} hrs</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 uppercase block font-bold">Mesh Telemetry Link:</span>
                  <span className="text-emerald-400 font-bold">{pilot.meshReliabilityPct}% Reliable</span>
                </div>
              </div>

              {/* Specializations & Endorsements */}
              <div className="space-y-2 pt-3 border-t border-slate-800">
                <span className="text-[9px] text-slate-400 uppercase font-bold block">Accredited Specializations:</span>
                <div className="flex flex-wrap gap-1.5">
                  {pilot.specializations.map((spec, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[10px] bg-slate-900 border border-slate-700 text-slate-200"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer with Signatures */}
              <div className="pt-4 mt-3 border-t border-amber-500/30 flex items-center justify-between text-[10px]">
                <div className="space-y-0.5">
                  <span className="text-slate-400 block text-[9px]">ISSUING AUTHORITY:</span>
                  <span className="text-amber-300 font-bold">IUSTITIA-001 (Tribunal of Chains, 48&deg;)</span>
                </div>
                <div className="space-y-0.5 text-right">
                  <span className="text-slate-400 block text-[9px]">ENFORCEMENT ORACLE:</span>
                  <span className="text-purple-300 font-bold">VIGIL-001 (Observatory of Flows, 60&deg;)</span>
                </div>
              </div>
            </div>

            {/* Right: Verification & Soulbound Token Ledger (5 cols) */}
            <div className="lg:col-span-5 bg-[#060C14] border border-amber-500/20 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-white text-xs flex items-center gap-1.5">
                    <QrCode className="w-4 h-4 text-cyan-400" />
                    <span>Soulbound Token (TSL-SBT) Verification</span>
                  </span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                    NON-TRANSFERABLE
                  </span>
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Anchored to the XRPL Mainnet via TSL Registry smart contract. Real-time law enforcement &amp; mesh nodes verify this credential prior to allowing flight controller handoffs.
                </p>

                {/* QR Code Simulation */}
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center gap-4">
                  <div className="w-20 h-20 bg-white p-1 rounded-lg flex items-center justify-center shrink-0 shadow-md">
                    <QrCode className="w-18 h-18 text-slate-950" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Cryptographic Hash:</span>
                    <span className="text-[10px] text-cyan-400 font-mono break-all select-all">
                      SHA256: 0x8a99c0d12e84f51b...
                    </span>
                    <button
                      onClick={() => handleCopy('https://xrpl.org/tx/SOV-FAA-001-SHALOMINATTII-VERIFIED', 'XRPL Proof')}
                      className="text-[10px] text-amber-300 hover:text-amber-200 underline flex items-center gap-1 pt-1 cursor-pointer"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>{copiedText === 'XRPL Proof' ? 'Copied URL!' : 'View On-Ledger Proof'}</span>
                    </button>
                  </div>
                </div>

                {/* Insurance Escrow Status */}
                <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-xl space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-bold flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Vault of Trust Escrow</span>
                    </span>
                    <span className="text-amber-300 font-black">50,000 ESC</span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Mandatory S-2 commercial insurance collateral staked at <code>rSOVEREIGN-TREASURY-VAULT</code>.
                  </p>
                </div>
              </div>

              {/* Bottom Quick Action */}
              <button
                onClick={() => {
                  setSelectedClass(FAA_SOV_CLASSES[3]); // S-3
                  setActiveTab('CLASSES');
                }}
                className="w-full py-2 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-all"
              >
                <span>Upgrade to Class S-3 Advanced Swarm</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: CERTIFICATION CLASSES (S-0 to S-5)                */}
      {/* ========================================================= */}
      {activeTab === 'CLASSES' && (
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>FAA-SOV Hierarchical Certification Matrix</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                From visual ground observation (S-0) to supreme international airspace architecture (S-5).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {FAA_SOV_CLASSES.map((cls) => {
              const isSelected = selectedClass.classId === cls.classId;
              const isCurrent = pilot.classLevel === cls.classId;

              return (
                <div
                  key={cls.classId}
                  onClick={() => setSelectedClass(cls)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer space-y-3 relative overflow-hidden ${
                    isSelected
                      ? 'bg-[#0A1420] border-amber-400 shadow-lg shadow-amber-500/10'
                      : 'bg-[#060C14] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{ backgroundColor: cls.badgeColor }}
                  />

                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className="px-2 py-0.5 rounded font-black text-xs"
                          style={{ backgroundColor: `${cls.badgeColor}20`, color: cls.badgeColor, border: `1px solid ${cls.badgeColor}40` }}
                        >
                          Class {cls.classId}
                        </span>
                        {isCurrent && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                            Current
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-white text-xs mt-1 font-sans">{cls.title}</h4>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-amber-300 font-bold block">
                        {cls.tokenGateEsc === 0 ? 'Free Gate' : `${cls.tokenGateEsc.toLocaleString()} ESC`}
                      </span>
                      <span className="text-[9px] text-slate-400">Gate Fee</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {cls.scope}
                  </p>

                  {/* Requirements List */}
                  <div className="space-y-1 pt-2 border-t border-slate-800 text-[10px]">
                    <span className="text-slate-400 uppercase font-bold block">Key Requirements:</span>
                    <ul className="space-y-1 text-slate-300">
                      {cls.requirements.slice(0, 2).map((req, rIdx) => (
                        <li key={rIdx} className="flex items-start gap-1">
                          <span className="text-amber-400 mt-0.5">&bull;</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Specs Pill Grid */}
                  <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-800 text-[10px]">
                    <div className="bg-slate-950 p-1.5 rounded border border-slate-850">
                      <span className="text-slate-400 block text-[9px]">Ceiling:</span>
                      <span className="font-bold text-cyan-300">{cls.altitudeCeiling}</span>
                    </div>
                    <div className="bg-slate-950 p-1.5 rounded border border-slate-850">
                      <span className="text-slate-400 block text-[9px]">Insurance Bond:</span>
                      <span className="font-bold text-amber-300">{cls.insuranceBondEsc.toLocaleString()} ESC</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: AERONAUTICAL EXAM ENCLAVE                          */}
      {/* ========================================================= */}
      {activeTab === 'EXAM' && (
        <div className="p-4 space-y-4">
          <div className="p-4 bg-[#060C14] border border-yellow-500/30 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-yellow-400" />
                  <span>Sovereign Airspace Awareness &amp; Law Examination</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Required for initial S-0/S-1 certification and S-2 Part 107-SOV commercial renewal.
                </p>
              </div>
              {examSubmitted && (
                <div className={`px-3 py-1.5 rounded-lg border font-bold text-xs ${
                  examScore >= 75
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-red-500/20 text-red-300 border-red-500/40'
                }`}>
                  Score: {examScore}% ({examScore >= 75 ? 'PASSED' : 'RETAKE REQUIRED'})
                </div>
              )}
            </div>

            <form onSubmit={handleSubmitExam} className="space-y-4 pt-2">
              {SAMPLE_EXAM_QUESTIONS.map((q, idx) => (
                <div key={q.id} className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                      Q{idx + 1}
                    </span>
                    <span className="font-bold text-white text-xs leading-relaxed">{q.question}</span>
                  </div>

                  <div className="space-y-1.5 pl-6 pt-1">
                    {q.options.map((opt, oIdx) => {
                      const isSelected = examAnswers[q.id] === oIdx;
                      const isCorrect = q.correctAnswer === oIdx;

                      return (
                        <label
                          key={oIdx}
                          className={`flex items-center gap-2 p-2 rounded-lg border transition-all cursor-pointer text-xs ${
                            examSubmitted
                              ? isCorrect
                                ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200'
                                : isSelected
                                ? 'bg-red-950/40 border-red-500 text-red-200'
                                : 'bg-slate-900/40 border-slate-800 text-slate-400'
                              : isSelected
                              ? 'bg-amber-500/10 border-amber-400 text-amber-200'
                              : 'bg-slate-900/40 border-slate-800 text-slate-300 hover:bg-slate-850'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${q.id}`}
                            checked={isSelected}
                            onChange={() => handleAnswerSelect(q.id, oIdx)}
                            className="text-amber-500"
                          />
                          <span>{opt}</span>
                        </label>
                      );
                    })}
                  </div>

                  {examSubmitted && (
                    <div className="mt-2 p-2 bg-slate-900 rounded text-[11px] text-slate-300 border-l-2 border-amber-400 pl-3">
                      <span className="font-bold text-amber-300">Reference: </span>
                      {q.explanation}
                    </div>
                  )}
                </div>
              ))}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setExamAnswers({});
                    setExamSubmitted(false);
                    setExamScore(0);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 cursor-pointer"
                >
                  Clear Answers
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider cursor-pointer shadow-md"
                >
                  Grade &amp; Record Telemetry on TSL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: AIRSPACE CORRIDORS & ZONES                         */}
      {/* ========================================================= */}
      {activeTab === 'AIRSPACE' && (
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {AIRSPACE_ZONES.map((zone) => (
              <div
                key={zone.zoneId}
                className="p-4 bg-[#060C14] border border-slate-800 rounded-xl space-y-3 relative overflow-hidden"
              >
                <div
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ backgroundColor: zone.color }}
                />

                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-white text-xs">{zone.zoneId}</h4>
                    <span className="text-[10px] text-slate-400 font-bold">{zone.name}</span>
                  </div>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-black border ${
                      zone.status === 'CLEAR'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : zone.status === 'RESTRICTED'
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                        : 'bg-red-500/20 text-red-300 border-red-500/40'
                    }`}
                  >
                    {zone.status}
                  </span>
                </div>

                <div className="p-2 bg-slate-950 rounded border border-slate-850 space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-400">Ceiling:</span>
                    <span className="font-bold text-cyan-300">{zone.altitudeRange}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-400">Min Class:</span>
                    <span className="font-bold text-amber-300">{zone.minClass}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-400">Active UAVs:</span>
                    <span className="font-bold text-emerald-400">{zone.activeUavs} tracked</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {zone.purpose}
                </p>

                <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400">
                  <span className="font-bold text-slate-300 block">Enforcement:</span>
                  <span>{zone.enforcement}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: AIRCRAFT REGISTRATION ENCLAVE                      */}
      {/* ========================================================= */}
      {activeTab === 'AIRCRAFT' && (
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Registered UAVs Table (7 cols) */}
            <div className="lg:col-span-7 bg-[#060C14] border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs flex items-center gap-1.5">
                  <Plane className="w-4 h-4 text-emerald-400" />
                  <span>TSL Aircraft Registry (`rFAA-SOV-REGISTRY`)</span>
                </span>
                <span className="text-[10px] text-slate-400">24-Month Airworthiness SLA</span>
              </div>

              <div className="overflow-x-auto border border-slate-800 rounded-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0A1420] text-slate-400 text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="py-2 px-3">Reg #</th>
                      <th className="py-2 px-3">Model</th>
                      <th className="py-2 px-3">Class / Prop</th>
                      <th className="py-2 px-3">Mesh Node</th>
                      <th className="py-2 px-3">Bond</th>
                      <th className="py-2 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 bg-slate-950/60">
                    {aircraftList.map((ac) => (
                      <tr key={ac.regNumber} className="hover:bg-slate-900/60">
                        <td className="py-2.5 px-3 font-bold text-cyan-300">{ac.regNumber}</td>
                        <td className="py-2.5 px-3">
                          <div className="font-bold text-white">{ac.model}</div>
                          <div className="text-[9px] text-slate-500">{ac.manufacturer}</div>
                        </td>
                        <td className="py-2.5 px-3 text-[11px] text-slate-300">
                          <div>{ac.weightClass.split(' ')[0]} {ac.weightClass.split(' ')[1]}</div>
                          <div className="text-[9px] text-amber-400/80">{ac.propulsion}</div>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-[10px] text-purple-300">{ac.meshNodeId}</td>
                        <td className="py-2.5 px-3 font-bold text-amber-300">{ac.insuranceBondEsc.toLocaleString()} ESC</td>
                        <td className="py-2.5 px-3">
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                            {ac.airworthinessStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Register New Aircraft Form (5 cols) */}
            <div className="lg:col-span-5 bg-[#060C14] border border-emerald-500/30 rounded-xl p-4 space-y-3">
              <span className="font-bold text-white text-xs flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Register New Sovereign UAV</span>
              </span>

              <form onSubmit={handleRegisterAircraft} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase font-bold block">Manufacturer:</label>
                  <input
                    type="text"
                    value={newManufacturer}
                    onChange={e => setNewManufacturer(e.target.value)}
                    placeholder="e.g. Sovereign Dynamics"
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded text-white text-xs focus:outline-hidden focus:border-emerald-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase font-bold block">Model Name:</label>
                  <input
                    type="text"
                    value={newModel}
                    onChange={e => setNewModel(e.target.value)}
                    placeholder="e.g. Apex Valkyrie 800"
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded text-white text-xs focus:outline-hidden focus:border-emerald-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 uppercase font-bold block">Weight Class:</label>
                    <select
                      value={newWeightClass}
                      onChange={e => setNewWeightClass(e.target.value as any)}
                      className="w-full p-2 bg-slate-950 border border-slate-700 rounded text-white text-xs"
                    >
                      <option value="Class I (<250g)">Class I (&lt;250g)</option>
                      <option value="Class II (250g-2kg)">Class II (250g-2kg)</option>
                      <option value="Class III (25kg-150kg)">Class III (25kg-150kg)</option>
                      <option value="Class IV (>150kg)">Class IV (&gt;150kg)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 uppercase font-bold block">Propulsion:</label>
                    <select
                      value={newPropulsion}
                      onChange={e => setNewPropulsion(e.target.value as any)}
                      className="w-full p-2 bg-slate-950 border border-slate-700 rounded text-white text-xs"
                    >
                      <option value="Electric">Electric</option>
                      <option value="Hybrid Turbine">Hybrid Turbine</option>
                      <option value="Hydrogen Fuel Cell">Hydrogen Fuel Cell</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase font-bold block">Assigned Mesh Node ID:</label>
                  <input
                    type="text"
                    value={newMeshNode}
                    onChange={e => setNewMeshNode(e.target.value)}
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded text-cyan-300 font-mono text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider cursor-pointer shadow-md transition-all mt-2"
                >
                  Sign &amp; Register on TSL
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 6: TRIBUNAL SANCTIONS & VIOLATIONS                    */}
      {/* ========================================================= */}
      {activeTab === 'SANCTIONS' && (
        <div className="p-4 space-y-4">
          <div className="p-3 bg-red-950/20 border border-red-500/40 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-400" />
              <div>
                <span className="font-bold text-white text-xs">Tribunal of Chains (48&deg; Venue) Adjudication Matrix</span>
                <p className="text-[10px] text-slate-400">Presided over by Attorney General IUSTITIA-001 with VIGIL-001 surveillance logs.</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-800 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0A1420] text-slate-400 text-[10px] border-b border-slate-800 uppercase">
                <tr>
                  <th className="py-2.5 px-3">Violation</th>
                  <th className="py-2.5 px-3">Severity</th>
                  <th className="py-2.5 px-3">SRT Penalty</th>
                  <th className="py-2.5 px-3">ESC Fine</th>
                  <th className="py-2.5 px-3">License Action</th>
                  <th className="py-2.5 px-3">Adjudication Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-[#060C14]">
                {VIOLATIONS_TABLE.map((vio) => (
                  <tr key={vio.violationId} className="hover:bg-slate-900/60">
                    <td className="py-2.5 px-3 font-bold text-white">{vio.title}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-black border ${
                          vio.severity === 'Minor'
                            ? 'bg-slate-800 text-slate-300 border-slate-700'
                            : vio.severity === 'Moderate'
                            ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40'
                            : vio.severity === 'Serious'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-red-500/20 text-red-300 border-red-500/40'
                        }`}
                      >
                        {vio.severity}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-red-400">{vio.srtPenalty} SRT</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-amber-300">{vio.escFine.toLocaleString()} ESC</td>
                    <td className="py-2.5 px-3 font-bold text-slate-200">{vio.licenseAction}</td>
                    <td className="py-2.5 px-3 text-[11px] text-slate-400">{vio.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 7: SOVEREIGN-CLI QUICKSTART                           */}
      {/* ========================================================= */}
      {activeTab === 'CLI' && (
        <div className="p-4 space-y-4">
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-amber-400 font-bold flex items-center gap-1.5">
                <Terminal className="w-4 h-4" />
                <span>sovereign-cli FAA-SOV Execution Suite</span>
              </span>
              <button
                onClick={() => handleCopy(
`# 1. Connect wallet
sovereign-cli wallet connect

# 2. Deposit exam fee
sovereign-cli treasury deposit --allocation=diplomaticReserve --amount=100 --currency=ESC

# 3. Take exam
sovereign-cli faa exam --class=S-1 --venue=salon-prime

# 4. Schedule practical
sovereign-cli faa practical --class=S-1 --instructor=LUMINA-001

# 5. Stake insurance bond
sovereign-cli vault lock --amount=1000 --currency=ESC --purpose=S-1-insurance

# 6. Receive license
sovereign-cli faa license --class=S-1 --mint`, 'CLI Script')}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3 h-3" />
                <span>Copy Script</span>
              </button>
            </div>

            <pre className="text-slate-300 text-[11px] leading-relaxed overflow-x-auto">
{`# 1. Connect wallet
sovereign-cli wallet connect

# 2. Deposit exam fee
sovereign-cli treasury deposit --allocation=diplomaticReserve --amount=100 --currency=ESC

# 3. Take exam
sovereign-cli faa exam --class=S-1 --venue=salon-prime

# 4. Schedule practical
sovereign-cli faa practical --class=S-1 --instructor=LUMINA-001

# 5. Stake insurance bond
sovereign-cli vault lock --amount=1000 --currency=ESC --purpose=S-1-insurance

# 6. Receive license
sovereign-cli faa license --class=S-1 --mint

# License appears in wallet as TSL-SBT (Soulbound Token)
# QR code generated for law enforcement verification`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
