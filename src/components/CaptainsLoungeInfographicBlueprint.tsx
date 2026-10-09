import React, { useState } from 'react';
import {
  Wind,
  Sparkles,
  Leaf,
  Layers,
  ShieldCheck,
  Maximize2,
  Minimize2,
  Compass,
  Activity,
  CheckCircle2,
  ChevronRight,
  Flame,
  Droplets,
  Sun,
  Eye,
  Crosshair,
  Download,
  Share2,
  Info,
  RotateCw,
  Box,
  Layers as LayersIcon
} from 'lucide-react';

interface CaptainsLoungeInfographicBlueprintProps {
  onClose?: () => void;
  isEmbedded?: boolean;
}

export const CaptainsLoungeInfographicBlueprint: React.FC<CaptainsLoungeInfographicBlueprintProps> = ({
  onClose,
  isEmbedded = false
}) => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'VENTILATION' | 'ASH_SYSTEM' | 'FLOOR_PLAN' | 'CYCLE'>('ALL');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [inspectedStage, setInspectedStage] = useState<number | null>(null);
  const [selectedCanister, setSelectedCanister] = useState<number>(0);

  const canisters = [
    {
      id: 'SOVEREIGN_NEBULA',
      name: 'Sovereign Nebula',
      type: 'Indica Dominant',
      batch: 'CAN-2026-ALPHA',
      minerals: { potassium: 34, calcium: 28, magnesium: 14, phosphorus: 8 },
      phBuffer: '+1.6 pH',
      status: 'Airtight Sealed'
    },
    {
      id: 'KOSHER_KUSH',
      name: 'Kosher Kush',
      type: 'Pure Landrace Heirloom',
      batch: 'CAN-2026-BETA',
      minerals: { potassium: 31, calcium: 32, magnesium: 12, phosphorus: 7 },
      phBuffer: '+1.4 pH',
      status: 'Airtight Sealed'
    },
    {
      id: 'SKYWALKER_OG',
      name: 'Skywalker OG',
      type: 'Hybrid Reserve',
      batch: 'CAN-2026-GAMMA',
      minerals: { potassium: 36, calcium: 26, magnesium: 16, phosphorus: 9 },
      phBuffer: '+1.5 pH',
      status: 'Airtight Sealed'
    }
  ];

  return (
    <div className={`w-full ${isEmbedded ? 'h-full' : 'max-h-[92vh]'} flex flex-col bg-[#050914] text-slate-100 font-sans rounded-2xl border border-cyan-500/40 shadow-2xl overflow-hidden select-none`}>
      {/* Blueprint Header */}
      <div className="bg-gradient-to-r from-slate-950 via-[#071226] to-slate-950 px-6 py-4 border-b border-cyan-500/30 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/60 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Leaf className="w-6 h-6 text-emerald-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black tracking-widest text-white uppercase font-mono">
                CAPTAIN&apos;S CANNABIS SMOKING LOUNGE
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/30 text-emerald-300 border border-emerald-500/50">
                PLANTS &middot; PEOPLE &middot; PLANET
              </span>
            </div>
            <p className="text-xs text-cyan-300/80 font-mono tracking-wide mt-0.5">
              A sacred space for clarity, connection &amp; creation &mdash; designed for life in space.
            </p>
          </div>
        </div>

        {/* Action Controls & Navigation */}
        <div className="flex items-center gap-2">
          {/* Subsystem filter tabs */}
          <div className="hidden sm:flex items-center bg-slate-950/80 border border-slate-800 rounded-lg p-1 text-[11px] font-mono">
            {[
              { id: 'ALL', label: 'All Schematics' },
              { id: 'VENTILATION', label: '🌀 Reverse Vent' },
              { id: 'ASH_SYSTEM', label: '🏺 Ash Vault' },
              { id: 'FLOOR_PLAN', label: '📐 Floor Plan' },
              { id: 'CYCLE', label: '🌿 Life Cycle' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`px-2.5 py-1 rounded font-bold transition-all ${
                  activeTab === t.id
                    ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Zoom buttons */}
          <div className="flex items-center bg-slate-950/80 border border-slate-800 rounded-lg p-1 text-[10px] font-mono">
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.1))}
              className="px-2 py-0.5 text-slate-300 hover:text-white"
              title="Zoom out"
            >
              -
            </button>
            <span className="px-1 text-cyan-300 font-bold">{Math.round(zoomLevel * 100)}%</span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
              className="px-2 py-0.5 text-slate-300 hover:text-white"
              title="Zoom in"
            >
              +
            </button>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Close Blueprint"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Main Blueprint Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#07132a] via-[#050a16] to-[#02050c]">
        {/* SECTION 1: REVERSE VENTILATION SYSTEM (CROSS-SECTION) */}
        {(activeTab === 'ALL' || activeTab === 'VENTILATION') && (
          <div className="rounded-2xl border border-cyan-500/40 bg-slate-950/70 p-5 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-cyan-500/30 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <Wind className="w-5 h-5 text-cyan-400 animate-spin" />
                <div>
                  <h3 className="text-sm font-black text-cyan-300 uppercase tracking-widest font-mono">
                    REVERSE VENTILATION SYSTEM (CROSS-SECTION)
                  </h3>
                  <p className="text-xs text-slate-300">
                    Pulls smoke downward and filters it through multi-stage carbon and HEPA filters, keeping air clean and odor-free inside the craft.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-[10px] font-mono">
                <span className="px-2.5 py-1 bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 rounded font-bold">
                  DOWNWARD AIRFLOW: 480 CFM
                </span>
                <span className="px-2.5 py-1 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 rounded font-bold">
                  ODOR REMOVAL: 99.98%
                </span>
              </div>
            </div>

            {/* Architectural Cross-Section Schematic SVG */}
            <div className="w-full bg-[#030712] rounded-xl border border-cyan-900/60 p-4 mb-4 overflow-x-auto">
              <svg viewBox="0 0 900 280" className="w-full min-w-[700px] h-auto select-none">
                <defs>
                  {/* Linear gradients for ducts and filters */}
                  <linearGradient id="smokeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#0284c7" stopOpacity="0.2" />
                  </linearGradient>
                  <linearGradient id="cleanGradient" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#34d399" stopOpacity="0.8" />
                  </linearGradient>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(56, 189, 248, 0.07)" strokeWidth="0.8" />
                  </pattern>
                </defs>

                {/* Blueprint Background Grid */}
                <rect width="900" height="280" fill="url(#grid)" />

                {/* Ceiling Hull Boundary */}
                <path d="M 40 40 L 860 40" stroke="#334155" strokeWidth="4" />
                <text x="50" y="32" fill="#64748b" fontSize="10" fontFamily="monospace" fontWeight="bold">SPACECRAFT CABIN CEILING ARCH</text>

                {/* Ceiling Suction Funnels */}
                <path d="M 380 40 L 420 70 L 480 70 L 520 40" fill="rgba(56, 189, 248, 0.15)" stroke="#38bdf8" strokeWidth="1.5" />
                <text x="415" y="60" fill="#38bdf8" fontSize="9" fontFamily="monospace">CEILING INTAKE</text>

                {/* Airflow Downward Stream Arrows */}
                <g stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 4" fill="none">
                  <path d="M 430 75 L 430 140" />
                  <path d="M 450 75 L 450 140" />
                  <path d="M 470 75 L 470 140" />
                </g>

                {/* Lounge Central Glass Table with Reverse Suction Grate */}
                <ellipse cx="450" cy="155" rx="80" ry="24" fill="#0f172a" stroke="#d97706" strokeWidth="2.5" />
                <ellipse cx="450" cy="155" rx="35" ry="10" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
                <text x="408" y="159" fill="#e0f2fe" fontSize="9" fontFamily="monospace" fontWeight="bold">REVERSE TABLE</text>

                {/* Downward Vortex Suction Funnel (Table into Floor) */}
                <polygon points="415,160 485,160 470,210 430,210" fill="url(#smokeGradient)" stroke="#38bdf8" strokeWidth="1.2" />

                {/* Floor Line */}
                <path d="M 40 210 L 860 210" stroke="#334155" strokeWidth="4" />
                <text x="50" y="202" fill="#64748b" fontSize="10" fontFamily="monospace" fontWeight="bold">DECK LEVEL SUB-FLOOR PLENUM</text>

                {/* Sub-floor Filtration Chamber (5 STAGES) */}
                {/* 1. Downward Plenum Intake */}
                <rect x="420" y="215" width="60" height="40" fill="#0c1e36" stroke="#0284c7" strokeWidth="1.5" rx="4" />
                <text x="430" y="238" fill="#38bdf8" fontSize="8" fontFamily="monospace" fontWeight="bold">STAGE 1</text>

                {/* Connectors to Filters */}
                <path d="M 480 235 L 520 235" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" />

                {/* 2. Pre-filter (Large particles) */}
                <rect x="520" y="220" width="55" height="30" fill="#1e293b" stroke="#60a5fa" strokeWidth="1.5" rx="3" />
                <text x="525" y="238" fill="#93c5fd" fontSize="8" fontFamily="monospace">2. PRE-FILT</text>

                {/* Connector */}
                <path d="M 575 235 L 610 235" stroke="#60a5fa" strokeWidth="2" />

                {/* 3. Activated Carbon Filter (Odor & Terpenes) */}
                <rect x="610" y="215" width="75" height="40" fill="#064e3b" stroke="#10b981" strokeWidth="1.5" rx="3" />
                <text x="616" y="234" fill="#a7f3d0" fontSize="8" fontFamily="monospace" fontWeight="bold">3. ACTIVATED</text>
                <text x="616" y="246" fill="#6ee7b7" fontSize="7" fontFamily="monospace">CARBON BANK</text>

                {/* Connector */}
                <path d="M 685 235 L 720 235" stroke="#10b981" strokeWidth="2" />

                {/* 4. HEPA Filter (0.3um Particulates) */}
                <rect x="720" y="215" width="65" height="40" fill="#4c1d95" stroke="#a855f7" strokeWidth="1.5" rx="3" />
                <text x="726" y="234" fill="#e9d5ff" fontSize="8" fontFamily="monospace" fontWeight="bold">4. HEPA</text>
                <text x="726" y="246" fill="#c084fc" fontSize="7" fontFamily="monospace">0.3μm CELL</text>

                {/* Recirculation Duct back upward to ceiling */}
                <path d="M 785 235 L 820 235 L 820 50 L 780 50" fill="none" stroke="#34d399" strokeWidth="2.5" />
                <polygon points="775,50 785,46 785,54" fill="#34d399" />
                <text x="828" y="145" fill="#34d399" fontSize="8" fontFamily="monospace" transform="rotate(90 828 145)">CLEAN RECIRCULATION DUCT</text>

                {/* Recirculation Ceiling Outlet */}
                <rect x="730" y="42" width="50" height="15" fill="#064e3b" stroke="#34d399" strokeWidth="1" rx="2" />
                <text x="735" y="53" fill="#a7f3d0" fontSize="7" fontFamily="monospace">5. CLEAN AIR</text>

                {/* Left side: Hydroponic Grow Wall schematic representation */}
                <rect x="80" y="60" width="80" height="135" fill="#062e24" stroke="#059669" strokeWidth="1.5" rx="4" />
                <text x="88" y="76" fill="#34d399" fontSize="8" fontFamily="monospace" fontWeight="bold">PLANT WALL</text>
                <line x1="90" y1="95" x2="150" y2="95" stroke="#10b981" strokeWidth="1" />
                <line x1="90" y1="125" x2="150" y2="125" stroke="#10b981" strokeWidth="1" />
                <line x1="90" y1="155" x2="150" y2="155" stroke="#10b981" strokeWidth="1" />
                <text x="92" y="180" fill="#6ee7b7" fontSize="7" fontFamily="monospace">O2 + BIOMASS</text>

                {/* Left connector from clean air to grow wall */}
                <path d="M 40 50 L 70 50 L 70 120 L 80 120" fill="none" stroke="#34d399" strokeWidth="1.5" strokeDasharray="3 3" />
              </svg>
            </div>

            {/* 5-Stage Step Flow Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {[
                {
                  step: 1,
                  title: 'Ceiling to Floor Intake',
                  subtitle: 'Reverse Flow Funnel',
                  desc: 'Downward vortex suction draws smoke and vapor into the central table well and sub-floor intake.',
                  tech: '480 CFM Negative Pressure'
                },
                {
                  step: 2,
                  title: 'Pre-Filter Stage',
                  subtitle: 'Particulate Trapping',
                  desc: 'High-surface coarse filter captures large suspended particles, loose ash, and dust fibers.',
                  tech: 'Washable Micro-Mesh'
                },
                {
                  step: 3,
                  title: 'Activated Carbon Filter',
                  subtitle: 'Terpene & VOC Adsorption',
                  desc: 'Coconut-shell activated carbon honeycomb permanently neutralizes odor and volatile aromatic hydrocarbons.',
                  tech: '99.98% Odor Elimination'
                },
                {
                  step: 4,
                  title: 'HEPA Filter (0.3μm)',
                  subtitle: 'Ultra-Fine Scrubbing',
                  desc: 'Medical-grade H14 HEPA matrix strips 99.97% of sub-micron aerosols and particulate matter.',
                  tech: 'ISO 14644-1 Cleanroom'
                },
                {
                  step: 5,
                  title: 'Clean Air Recirculation',
                  subtitle: 'Atmospheric Return',
                  desc: 'Pure, fresh, oxygenated air is redirected back through ceiling diffuser ports and living plant wall.',
                  tech: 'Closed Ecological Loop'
                }
              ].map((s) => (
                <div
                  key={s.step}
                  onClick={() => setInspectedStage(inspectedStage === s.step ? null : s.step)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    inspectedStage === s.step
                      ? 'bg-cyan-950/70 border-cyan-400 ring-2 ring-cyan-400/40 shadow-lg'
                      : 'bg-slate-900/60 border-slate-800 hover:border-cyan-500/40'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono font-bold text-xs flex items-center justify-center">
                        {s.step}
                      </span>
                      <span className="text-[9px] font-mono text-slate-400">{s.subtitle}</span>
                    </div>
                    <div className="text-xs font-bold text-white mb-1">{s.title}</div>
                    <p className="text-[10px] text-slate-300 leading-relaxed">{s.desc}</p>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-slate-800 text-[9px] font-mono text-cyan-300">
                    {s.tech}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 2: SACRED ASH CANISTER SYSTEM */}
        {(activeTab === 'ALL' || activeTab === 'ASH_SYSTEM') && (
          <div className="rounded-2xl border border-amber-500/40 bg-slate-950/70 p-5 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-500/30 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-sm font-black text-amber-300 uppercase tracking-widest font-mono">
                    SACRED ASH CANISTER SYSTEM
                  </h3>
                  <p className="text-xs text-slate-300">
                    Collected ash is stored in sealed, labeled canisters. The ash is rich in minerals and can be used to amend soil, supporting plant growth and completing the cycle of life.
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-amber-950/80 border border-amber-500/40 text-amber-300 rounded font-mono text-[10px] font-bold">
                CANISTER VAULT: HERMETICALLY SEALED
              </span>
            </div>

            {/* Canister Selector & Mineral Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
              {canisters.map((c, idx) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedCanister(idx)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                    selectedCanister === idx
                      ? 'bg-amber-950/40 border-amber-400 ring-2 ring-amber-400/40 shadow-xl'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-slate-400">{c.batch}</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {c.status}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-white mb-0.5">{c.name}</div>
                  <div className="text-[10px] text-amber-400/90 font-mono mb-3">{c.type}</div>

                  {/* Mineral Bars */}
                  <div className="space-y-1.5 text-[9px] font-mono">
                    <div>
                      <div className="flex justify-between text-slate-300 mb-0.5">
                        <span>Potassium (K)</span>
                        <span className="text-amber-300 font-bold">{c.minerals.potassium}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full"
                          style={{ width: `${c.minerals.potassium * 2}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-slate-300 mb-0.5">
                        <span>Calcium (Ca)</span>
                        <span className="text-emerald-300 font-bold">{c.minerals.calcium}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-400 rounded-full"
                          style={{ width: `${c.minerals.calcium * 2}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-slate-300 mb-0.5">
                        <span>Magnesium (Mg)</span>
                        <span className="text-cyan-300 font-bold">{c.minerals.magnesium}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-cyan-400 rounded-full"
                          style={{ width: `${c.minerals.magnesium * 2}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800 flex justify-between items-center text-[10px] font-mono">
                    <span className="text-slate-400">Substrate Buffering:</span>
                    <span className="text-emerald-400 font-bold">{c.phBuffer}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* 3-Step Lifecycle: Using Ash For Plants */}
            <div className="bg-[#030712] border border-amber-900/60 rounded-xl p-4">
              <div className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Leaf className="w-4 h-4 text-emerald-400" />
                <span>USING ASH FOR PLANTS &mdash; THREE CORE PHASES</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-slate-900/70 border border-slate-800 rounded-lg flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-amber-500/40">
                    1
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white mb-0.5">Collect &amp; Store</div>
                    <p className="text-[10px] text-slate-300 leading-relaxed">
                      Ash is collected from designated ceramic receptacles, cooled, and sealed in airtight metallic food-grade canisters to prevent moisture degradation.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-slate-900/70 border border-slate-800 rounded-lg flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-emerald-500/40">
                    2
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white mb-0.5">Mix with Soil</div>
                    <p className="text-[10px] text-slate-300 leading-relaxed">
                      Incorporated into living soil and coco coir substrates at precise ratios (1 tbsp per gallon) to naturally balance acidic soil pH and replenish potassium.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-slate-900/70 border border-slate-800 rounded-lg flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-300 font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-cyan-500/40">
                    3
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white mb-0.5">Nourish Plants</div>
                    <p className="text-[10px] text-slate-300 leading-relaxed">
                      Bioavailable micronutrients stimulate root development, stem fortitude, resin production, and the subsequent generation of healthy floral biomass.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 3: FLOOR PLAN (TOP VIEW) */}
        {(activeTab === 'ALL' || activeTab === 'FLOOR_PLAN') && (
          <div className="rounded-2xl border border-purple-500/40 bg-slate-950/70 p-5 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-500/30 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <Compass className="w-5 h-5 text-purple-400" />
                <div>
                  <h3 className="text-sm font-black text-purple-300 uppercase tracking-widest font-mono">
                    FLOOR PLAN (TOP VIEW ARCHITECTURE)
                  </h3>
                  <p className="text-xs text-slate-300">
                    Spatial layout of the Captain&apos;s Lounge on an interstellar vessel, balancing relaxation, air scrubbing, and living horticulture.
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-purple-950/80 border border-purple-500/40 text-purple-300 rounded font-mono text-[10px] font-bold">
                ORBITAL ZERO-G HABITAT MODULE
              </span>
            </div>

            {/* Architectural Top-Down Blueprint Graphic SVG */}
            <div className="w-full bg-[#030712] rounded-xl border border-purple-900/60 p-4 overflow-x-auto">
              <svg viewBox="0 0 900 320" className="w-full min-w-[700px] h-auto select-none">
                {/* Hull Outer Ring / Bulkhead Boundary */}
                <ellipse cx="450" cy="160" rx="420" ry="145" fill="none" stroke="#334155" strokeWidth="6" />
                <ellipse cx="450" cy="160" rx="410" ry="138" fill="none" stroke="rgba(168, 85, 247, 0.3)" strokeWidth="1.5" strokeDasharray="5 5" />

                {/* Front Panoramic Observation Shield (180 deg view of Earth & Stars) */}
                <path d="M 220 50 Q 450 15 680 50" fill="none" stroke="#38bdf8" strokeWidth="8" strokeLinecap="round" />
                <text x="450" y="32" fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                  PANORAMIC OBSERVATION WINDOW &middot; ORBITAL EARTH VIEW
                </text>

                {/* Left Bay: Living Hydroponic Grow Wall */}
                <rect x="70" y="80" width="70" height="160" fill="#064e3b" stroke="#10b981" strokeWidth="2" rx="6" />
                <text x="105" y="150" fill="#a7f3d0" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle" transform="rotate(-90 105 150)">
                  HYDROPONIC CANNABIS GROW WALL
                </text>
                <text x="105" y="225" fill="#6ee7b7" fontSize="7" fontFamily="monospace" textAnchor="middle">
                  PLANTS &middot; PEOPLE
                </text>

                {/* Right Bay: Sacred Ash Canisters Vault & Amendment Bench */}
                <rect x="760" y="80" width="70" height="160" fill="#451a03" stroke="#f59e0b" strokeWidth="2" rx="6" />
                <text x="795" y="150" fill="#fde68a" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle" transform="rotate(90 795 150)">
                  SACRED ASH CANISTER VAULT
                </text>
                <text x="795" y="225" fill="#fbbf24" fontSize="7" fontFamily="monospace" textAnchor="middle">
                  SOIL AMENDMENT
                </text>

                {/* Center Circular Lounge: Cybertronian Command Deck & Angular Armored Seating */}
                <ellipse cx="450" cy="160" rx="200" ry="75" fill="none" stroke="#0f172a" strokeWidth="28" strokeLinecap="round" strokeDasharray="280 40 280 40" />
                <ellipse cx="450" cy="160" rx="200" ry="75" fill="none" stroke="#00f0ff" strokeWidth="2.5" strokeDasharray="12 4" />
                <ellipse cx="450" cy="160" rx="220" ry="85" fill="none" stroke="rgba(0, 240, 255, 0.3)" strokeWidth="1" strokeDasharray="4 4" />

                {/* Center Table: Reverse Ventilation Suction Grate */}
                <ellipse cx="450" cy="160" rx="70" ry="30" fill="#0f172a" stroke="#fbbf24" strokeWidth="2" />
                <ellipse cx="450" cy="160" rx="30" ry="13" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
                <text x="450" y="164" fill="#ffffff" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                  REVERSE-VENT TABLE
                </text>

                {/* Airflow Suction Concentric Rings (Vortex) */}
                <ellipse cx="450" cy="160" rx="100" ry="42" fill="none" stroke="rgba(56, 189, 248, 0.4)" strokeWidth="1" strokeDasharray="4 4" />
                <ellipse cx="450" cy="160" rx="140" ry="58" fill="none" stroke="rgba(56, 189, 248, 0.2)" strokeWidth="1" strokeDasharray="4 4" />

                {/* Rear Airlock Bulkhead Entrance */}
                <rect x="410" y="280" width="80" height="15" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" rx="3" />
                <text x="450" y="291" fill="#cbd5e1" fontSize="8" fontFamily="monospace" textAnchor="middle">
                  HERMETIC AIRLOCK
                </text>

                {/* Dimension & Station Callouts */}
                <line x1="140" y1="160" x2="380" y2="160" stroke="#334155" strokeWidth="1" strokeDasharray="2 2" />
                <line x1="520" y1="160" x2="760" y2="160" stroke="#334155" strokeWidth="1" strokeDasharray="2 2" />
              </svg>
            </div>

            {/* Zone Descriptions */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-4 text-xs font-mono">
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <div className="font-bold text-emerald-400 mb-1">🌿 Botanical Bay</div>
                <div className="text-[10px] text-slate-300">
                  Hydroponic grow wall with customized 660nm red &amp; 450nm blue spectrum LEDs for accelerated trichome development.
                </div>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <div className="font-bold text-cyan-400 mb-1">🌀 Vortex Hearth</div>
                <div className="text-[10px] text-slate-300">
                  Tempered glass circular table with perimeter lighting and sub-deck down-draft air suction grate.
                </div>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <div className="font-bold text-amber-400 mb-1">🏺 Mineral Vault</div>
                <div className="text-[10px] text-slate-300">
                  Hermetically locked canisters with batch QR telemetry and soil conditioning laboratory station.
                </div>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <div className="font-bold text-purple-400 mb-1">🌌 Celestial Deck</div>
                <div className="text-[10px] text-slate-300">
                  Curved panoramic observation window shielding radiation while giving unobstructed views of planetary orbit.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 4: CYCLE OF LIFE ONWARD */}
        {(activeTab === 'ALL' || activeTab === 'CYCLE') && (
          <div className="rounded-2xl border border-emerald-500/40 bg-slate-950/70 p-6 shadow-xl relative overflow-hidden text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border-2 border-emerald-400 mx-auto flex items-center justify-center mb-2 shadow-lg shadow-emerald-500/20">
              <Leaf className="w-6 h-6 text-emerald-400" />
            </div>

            <h3 className="text-base sm:text-lg font-black text-white font-mono tracking-widest uppercase">
              CYCLE OF LIFE ONWARD
            </h3>
            <p className="text-xs text-emerald-400 font-bold tracking-widest mt-0.5 uppercase font-mono">
              SACRED PLANTS &middot; CLEAN AIR &middot; LIVING SOIL &middot; A HEALTHIER TOMORROW
            </p>

            <div className="my-5 p-4 bg-slate-950/80 rounded-xl border border-slate-800 max-w-xl mx-auto shadow-inner">
              <div className="text-sm sm:text-base italic text-emerald-200 font-mono leading-relaxed">
                &ldquo;What we smoke, we return.<br />
                What we return, grows.<br />
                And what grows, sustains.&rdquo;
              </div>
              <div className="text-xs text-slate-400 mt-2 font-bold uppercase tracking-wider font-mono">
                &mdash; Captain&apos;s Lounge Philosophy
              </div>
            </div>

            {/* Circular Closed-Loop Flow Diagram */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-xs font-mono">
              <div className="p-3 bg-slate-900/80 rounded-xl border border-emerald-500/30 flex flex-col items-center">
                <Sun className="w-5 h-5 text-emerald-400 mb-1" />
                <span className="font-bold text-white">1. SACRED PLANTS</span>
                <span className="text-[10px] text-slate-300 mt-1">Grown in space via living hydroponic wall</span>
              </div>
              <div className="p-3 bg-slate-900/80 rounded-xl border border-cyan-500/30 flex flex-col items-center">
                <Wind className="w-5 h-5 text-cyan-400 mb-1" />
                <span className="font-bold text-white">2. CLEAN AIR</span>
                <span className="text-[10px] text-slate-300 mt-1">Multi-stage reverse filtration recirculates O2</span>
              </div>
              <div className="p-3 bg-slate-900/80 rounded-xl border border-amber-500/30 flex flex-col items-center">
                <Sparkles className="w-5 h-5 text-amber-400 mb-1" />
                <span className="font-bold text-white">3. SACRED ASH</span>
                <span className="text-[10px] text-slate-300 mt-1">Rich in Potassium, Calcium &amp; Magnesium</span>
              </div>
              <div className="p-3 bg-slate-900/80 rounded-xl border border-purple-500/30 flex flex-col items-center">
                <RotateCw className="w-5 h-5 text-purple-400 mb-1" />
                <span className="font-bold text-white">4. LIVING SOIL</span>
                <span className="text-[10px] text-slate-300 mt-1">Amended substrate feeds next generation</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Blueprint Footer */}
      <div className="bg-slate-950 px-6 py-3 border-t border-cyan-500/30 flex items-center justify-between text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>SPEC: SOV-AERO-420-LOUNGE-REV3</span>
        </div>
        <div className="flex items-center gap-4">
          <span>UNSC MJOLNIR MK-V HUD EMBED READY</span>
          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-1 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded transition-colors"
            >
              Back to Live Render
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
