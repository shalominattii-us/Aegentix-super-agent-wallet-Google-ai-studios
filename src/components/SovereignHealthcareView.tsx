import React, { useState } from 'react';
import {
  HeartPulse,
  Building2,
  UserCheck,
  Calendar,
  ShieldCheck,
  Activity,
  Lock,
  Stethoscope,
  Bed,
  FileText,
  CheckCircle2,
  Copy,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Server,
  Layers,
  Search,
} from 'lucide-react';
import {
  INITIAL_HEALTHCARE_PROVIDERS,
  INITIAL_HEALTHCARE_FACILITIES,
  INITIAL_APPOINTMENTS,
  MedicalProvider,
  MedicalFacility,
  PatientAppointment,
} from '../data/sovereignHealthcareData';

interface SovereignHealthcareViewProps {
  onNotify?: (message: string, type: 'ALERT' | 'SUCCESS' | 'INFO') => void;
}

export const SovereignHealthcareView: React.FC<SovereignHealthcareViewProps> = ({ onNotify }) => {
  const [activeTab, setActiveTab] = useState<'PROVIDERS' | 'FACILITIES' | 'APPOINTMENTS' | 'ARCHITECTURE'>('PROVIDERS');
  const [providers, setProviders] = useState<MedicalProvider[]>(INITIAL_HEALTHCARE_PROVIDERS);
  const [facilities, setFacilities] = useState<MedicalFacility[]>(INITIAL_HEALTHCARE_FACILITIES);
  const [appointments, setAppointments] = useState<PatientAppointment[]>(INITIAL_APPOINTMENTS);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProviders = providers.filter(
    p =>
      p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.primaryFacility.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleEmergency = (facId: string) => {
    setFacilities(prev =>
      prev.map(f => {
        if (f.id === facId) {
          const nextStatus = f.emergencyStatus === 'ACCEPTING_CRITICAL' ? 'DIVERTING' : 'ACCEPTING_CRITICAL';
          if (onNotify) onNotify(`Facility [${f.name}] emergency triage status updated to ${nextStatus}`, 'INFO');
          return { ...f, emergencyStatus: nextStatus };
        }
        return f;
      })
    );
  };

  return (
    <div className="bg-[#030508] border border-rose-500/30 rounded-xl overflow-hidden shadow-2xl space-y-4 font-mono text-xs text-slate-200">
      {/* HEADER BANNER */}
      <div className="p-4 sm:p-5 border-b border-rose-500/20 bg-gradient-to-r from-[#030508] via-[#12060C] to-[#08050C] flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 via-pink-600 to-slate-900 border border-rose-500/40 flex items-center justify-center shadow-lg shadow-rose-500/20 shrink-0">
            <HeartPulse className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-rose-300 tracking-wider uppercase font-sans">
                SOVEREIGN HEALTHCARE NETWORK &middot; TSL ZERO-TRUST
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-black border flex items-center gap-1 bg-rose-500/20 text-rose-300 border-rose-500/40">
                <ShieldCheck className="w-3 h-3 text-rose-400" />
                HIPAA-TSL LEVEL 4
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-black border flex items-center gap-1 bg-cyan-500/20 text-cyan-300 border-cyan-500/40">
                <Server className="w-3 h-3 text-cyan-400" />
                FASTAPI + NEXT.JS WEB
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Decentralized Provider Credentialing &middot; Verifiable TSL Medical Licenses &middot; Bed Capacity Routing
            </p>
          </div>
        </div>

        {/* Header Stats */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700 flex items-center gap-2">
            <span className="text-[10px] text-slate-400">Total Beds:</span>
            <span className="font-bold text-white">{facilities.reduce((acc, f) => acc + f.totalBeds, 0)} Managed</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700 flex items-center gap-2">
            <span className="text-[10px] text-slate-400">TSL Escrow:</span>
            <span className="font-bold text-rose-300">325,000 ESC</span>
          </div>
        </div>
      </div>

      {/* SUB-TABS */}
      <div className="px-4 border-b border-slate-800 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveTab('PROVIDERS')}
          className={`flex items-center gap-1.5 px-3 py-2 border-b-2 font-bold transition-colors cursor-pointer ${
            activeTab === 'PROVIDERS'
              ? 'border-rose-400 text-rose-300 bg-rose-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Stethoscope className="w-3.5 h-3.5" />
          <span>Medical Providers</span>
          <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 text-[9px] font-bold">
            {providers.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('FACILITIES')}
          className={`flex items-center gap-1.5 px-3 py-2 border-b-2 font-bold transition-colors cursor-pointer ${
            activeTab === 'FACILITIES'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Facilities &amp; Bed Capacity</span>
          <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 text-[9px] font-bold">
            {facilities.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('APPOINTMENTS')}
          className={`flex items-center gap-1.5 px-3 py-2 border-b-2 font-bold transition-colors cursor-pointer ${
            activeTab === 'APPOINTMENTS'
              ? 'border-purple-400 text-purple-300 bg-purple-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Appointments &amp; Telehealth</span>
          <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 text-[9px] font-bold">
            {appointments.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('ARCHITECTURE')}
          className={`flex items-center gap-1.5 px-3 py-2 border-b-2 font-bold transition-colors cursor-pointer ${
            activeTab === 'ARCHITECTURE'
              ? 'border-amber-400 text-amber-300 bg-amber-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Decoupled Architecture &amp; Docker</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: MEDICAL PROVIDERS                                  */}
      {/* ========================================================= */}
      {activeTab === 'PROVIDERS' && (
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search provider, specialty, or facility..."
                className="w-full pl-8 pr-3 py-1.5 bg-[#060C14] border border-slate-800 rounded-lg text-white text-xs outline-hidden focus:border-rose-400"
              />
            </div>

            <span className="text-[10px] text-slate-400">
              Showing {filteredProviders.length} Accredited Sovereign Physicians
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredProviders.map(prov => (
              <div
                key={prov.id}
                className="p-4 bg-[#060C14] border border-slate-800 rounded-xl space-y-3 relative overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-white text-xs font-sans">{prov.fullName}</h3>
                    <span className="text-[10px] text-rose-300 block font-bold">{prov.specialty}</span>
                    <span className="text-[9px] text-slate-500 block">{prov.title}</span>
                  </div>

                  <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    {prov.credentialStatus}
                  </span>
                </div>

                <div className="p-2 bg-slate-950 rounded border border-slate-850 space-y-1 text-[10px]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">NPI:</span>
                    <span className="font-mono text-cyan-300">{prov.npiNumber}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">TSL Med License:</span>
                    <span className="font-mono text-amber-300">{prov.sovereignLicenseId}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Primary Facility:</span>
                    <span className="text-slate-200 truncate max-w-[160px]">{prov.primaryFacility}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Consultation Fee:</span>
                    <span className="font-bold text-emerald-400">{prov.consultationFeeEsc} ESC</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[10px]">
                  <span className="text-slate-500">Node: {prov.meshNodeId}</span>
                  <button
                    onClick={() => {
                      if (onNotify) onNotify(`Encrypted consultation request sent to ${prov.fullName}`, 'SUCCESS');
                    }}
                    className="px-2.5 py-1 rounded bg-rose-600/30 hover:bg-rose-600 text-rose-200 hover:text-slate-950 font-bold text-[10px] cursor-pointer transition-all"
                  >
                    Request Consult
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: FACILITIES & BED CAPACITY                          */}
      {/* ========================================================= */}
      {activeTab === 'FACILITIES' && (
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {facilities.map(fac => (
              <div
                key={fac.id}
                className="p-4 bg-[#060C14] border border-slate-800 rounded-xl space-y-3 relative overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-white text-xs">{fac.name}</h3>
                    <span className="text-[10px] text-slate-400 block">{fac.location}</span>
                  </div>

                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-black border ${
                      fac.emergencyStatus === 'ACCEPTING_CRITICAL'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : fac.emergencyStatus === 'DIVERTING'
                        ? 'bg-red-500/20 text-red-300 border-red-500/40'
                        : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                    }`}
                  >
                    {fac.emergencyStatus}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 bg-slate-950 p-2.5 rounded-lg text-center text-[10px]">
                  <div>
                    <span className="text-slate-500 block">Total Beds</span>
                    <span className="font-bold text-white">{fac.totalBeds}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Available</span>
                    <span className="font-bold text-emerald-400">{fac.availableBeds}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">ICU Load</span>
                    <span className="font-bold text-amber-300">{fac.icuCapacityPct}%</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">OR Suites</span>
                    <span className="font-bold text-cyan-300">{fac.operatingRooms}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[10px]">
                  <span className="text-slate-500">Rating: {fac.complianceRating}</span>
                  <button
                    onClick={() => handleToggleEmergency(fac.id)}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold cursor-pointer"
                  >
                    Toggle Divert Status
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: APPOINTMENTS & TELEHEALTH                          */}
      {/* ========================================================= */}
      {activeTab === 'APPOINTMENTS' && (
        <div className="p-4 space-y-4">
          <div className="overflow-x-auto border border-slate-800 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0A1420] text-slate-400 text-[10px] uppercase border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Appt ID</th>
                  <th className="py-2.5 px-3">Patient Hash</th>
                  <th className="py-2.5 px-3">Provider</th>
                  <th className="py-2.5 px-3">Facility</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Fee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-[#060C14]">
                {appointments.map(apt => (
                  <tr key={apt.id} className="hover:bg-slate-900/60">
                    <td className="py-2.5 px-3 font-mono font-bold text-cyan-300">{apt.id}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-400">{apt.patientHash}</td>
                    <td className="py-2.5 px-3 font-bold text-white">{apt.providerName}</td>
                    <td className="py-2.5 px-3 text-slate-300 text-[11px]">{apt.facilityName}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                        {apt.type}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        {apt.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-amber-300">{apt.feeEsc} ESC</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: DECOUPLED ARCHITECTURE & DOCKER                   */}
      {/* ========================================================= */}
      {activeTab === 'ARCHITECTURE' && (
        <div className="p-4 space-y-4">
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 font-mono text-xs">
            <span className="text-rose-400 font-bold block uppercase">
              sovereign-healthcare-network docker-compose.yml
            </span>
            <pre className="text-slate-300 text-[11px] leading-relaxed overflow-x-auto">
{`version: '3.8'

services:
  web:
    build:
      context: ./apps/web
      dockerfile: Dockerfile
    ports:
      - "3001:3000"
    environment:
      - NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
    depends_on:
      - api

  api:
    build:
      context: ./apps/api
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://sovereign:pass@db:5432/healthcare
      - SECRET_KEY=tsl-zero-trust-hipaa-level4-secret
    depends_on:
      - db

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=healthcare
      - POSTGRES_USER=sovereign
      - POSTGRES_PASSWORD=pass
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
