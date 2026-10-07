import React, { useState } from 'react';
import { Shield, Award, CheckCircle2, X } from 'lucide-react';

interface SovereignSealProps {
  size?: number;
  className?: string;
  interactive?: boolean;
}

export const SovereignSeal: React.FC<SovereignSealProps> = ({
  size = 48,
  className = '',
  interactive = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => interactive && setIsOpen(true)}
        className={`relative inline-block transition-transform duration-200 ${
          interactive ? 'cursor-pointer hover:scale-105 active:scale-95' : ''
        } ${className}`}
        style={{ width: size, height: size }}
        title="Official Seal of the Sovereign System · Governance, Integrity, Continuity"
      >
        <svg
          viewBox="0 0 400 400"
          className="w-full h-full drop-shadow-xl select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Metallic Gradients */}
            <linearGradient id="sovMetalBorder" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#CBD5E1" />
              <stop offset="25%" stopColor="#64748B" />
              <stop offset="50%" stopColor="#94A3B8" />
              <stop offset="75%" stopColor="#475569" />
              <stop offset="100%" stopColor="#E2E8F0" />
            </linearGradient>

            <linearGradient id="sovInnerRing" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="50%" stopColor="#0B132B" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>

            <linearGradient id="sovShieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0F172A" />
              <stop offset="50%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>

            <linearGradient id="sovEagleSilver" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="30%" stopColor="#CBD5E1" />
              <stop offset="70%" stopColor="#94A3B8" />
              <stop offset="100%" stopColor="#64748B" />
            </linearGradient>

            <linearGradient id="sovRubyGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F43F5E" />
              <stop offset="100%" stopColor="#9F1239" />
            </linearGradient>

            {/* Circular Text Paths */}
            <path
              id="sovTopArc"
              d="M 50, 200 A 150, 150 0 1, 1 350, 200"
              fill="none"
            />
            <path
              id="sovBottomArc"
              d="M 350, 200 A 150, 150 0 0, 1 50, 200"
              fill="none"
            />
          </defs>

          {/* Outer Metallic Beveled Rim */}
          <circle cx="200" cy="200" r="194" fill="url(#sovMetalBorder)" stroke="#0F172A" strokeWidth="3" />
          <circle cx="200" cy="200" r="182" fill="#0B132B" stroke="#94A3B8" strokeWidth="2" />
          <circle cx="200" cy="200" r="176" fill="none" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />

          {/* Deep Navy Medallion Background */}
          <circle cx="200" cy="200" r="168" fill="url(#sovInnerRing)" />

          {/* Subtle Guilloche / Circuit Labyrinth Rings */}
          <circle cx="200" cy="200" r="150" fill="none" stroke="#334155" strokeWidth="1.5" opacity="0.6" />
          <circle cx="200" cy="200" r="142" fill="none" stroke="#E11D48" strokeWidth="1.5" opacity="0.85" />
          <circle cx="200" cy="200" r="110" fill="none" stroke="#38BDF8" strokeWidth="1" opacity="0.3" strokeDasharray="4 4" />
          <circle cx="200" cy="200" r="85" fill="none" stroke="#64748B" strokeWidth="1" opacity="0.4" />

          {/* Geometric Cross-Ties (Labyrinth Circuit Grid) */}
          <path
            d="M 60,200 L 120,200 M 280,200 L 340,200 M 200,60 L 200,100 M 200,300 L 200,340
               M 100,100 L 140,140 M 260,140 L 300,100 M 100,300 L 140,260 M 260,260 L 300,300"
            stroke="#475569"
            strokeWidth="1.5"
            opacity="0.4"
          />

          {/* Arced Text: TOP - "SOVEREIGN SYSTEM" */}
          <text
            fill="#E2E8F0"
            fontSize="24"
            fontFamily="'Cinzel', 'Times New Roman', serif, system-ui"
            fontWeight="900"
            letterSpacing="5"
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
          >
            <textPath href="#sovTopArc" startOffset="50%" textAnchor="middle">
              SOVEREIGN SYSTEM
            </textPath>
          </text>

          {/* Arced Text: BOTTOM - "GOVERNANCE · INTEGRITY · CONTINUITY" */}
          <text
            fill="#CBD5E1"
            fontSize="14.5"
            fontFamily="'Cinzel', 'Times New Roman', serif, system-ui"
            fontWeight="bold"
            letterSpacing="3.5"
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
          >
            <textPath href="#sovBottomArc" startOffset="50%" textAnchor="middle">
              GOVERNANCE ◆ INTEGRITY ◆ CONTINUITY
            </textPath>
          </text>

          {/* Laurel Branches (Left & Right Rims) */}
          {/* Left Laurel */}
          <g stroke="#94A3B8" fill="none" strokeWidth="1.5" opacity="0.75">
            <path d="M 65,190 Q 55,230 75,270" />
            <path d="M 60,195 Q 48,190 55,185" fill="#94A3B8" />
            <path d="M 58,215 Q 46,215 54,208" fill="#94A3B8" />
            <path d="M 62,235 Q 52,240 58,230" fill="#94A3B8" />
            <path d="M 70,255 Q 60,265 68,252" fill="#94A3B8" />
          </g>
          {/* Right Laurel */}
          <g stroke="#94A3B8" fill="none" strokeWidth="1.5" opacity="0.75">
            <path d="M 335,190 Q 345,230 325,270" />
            <path d="M 340,195 Q 352,190 345,185" fill="#94A3B8" />
            <path d="M 342,215 Q 354,215 346,208" fill="#94A3B8" />
            <path d="M 338,235 Q 348,240 342,230" fill="#94A3B8" />
            <path d="M 330,255 Q 340,265 332,252" fill="#94A3B8" />
          </g>

          {/* Mini Crowns at 9 o'clock and 3 o'clock */}
          <g transform="translate(42, 195) scale(0.6)" fill="#94A3B8">
            <polygon points="0,15 5,0 10,8 15,0 20,15" />
          </g>
          <g transform="translate(346, 195) scale(0.6)" fill="#94A3B8">
            <polygon points="0,15 5,0 10,8 15,0 20,15" />
          </g>

          {/* ================================================================= */}
          {/* IMPERIAL EAGLE WITH WINGS OUTSPREAD */}
          {/* ================================================================= */}
          <g id="sovImperialEagle">
            {/* Left Wing Primary & Secondary Feathers */}
            <path
              d="M 200,165 
                 C 170,120 120,90 60,95 
                 C 75,115 95,130 115,140
                 C 90,140 75,150 70,165
                 C 90,165 110,170 125,180
                 C 100,185 85,195 82,215
                 C 105,210 125,210 145,215
                 C 125,225 110,240 112,255
                 C 135,245 155,240 175,235
                 Z"
              fill="url(#sovEagleSilver)"
              stroke="#1E293B"
              strokeWidth="2"
            />
            {/* Left Wing Inset Highlights */}
            <path
              d="M 180,165 C 150,135 110,115 75,110 C 95,125 125,145 140,160"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="1.2"
              opacity="0.6"
            />

            {/* Right Wing Primary & Secondary Feathers (Mirrored) */}
            <path
              d="M 200,165 
                 C 230,120 280,90 340,95 
                 C 325,115 305,130 285,140
                 C 310,140 325,150 330,165
                 C 310,165 290,170 275,180
                 C 300,185 315,195 318,215
                 C 295,210 275,210 255,215
                 C 275,225 290,240 288,255
                 C 265,245 245,240 225,235
                 Z"
              fill="url(#sovEagleSilver)"
              stroke="#1E293B"
              strokeWidth="2"
            />
            {/* Right Wing Inset Highlights */}
            <path
              d="M 220,165 C 250,135 290,115 325,110 C 305,125 275,145 260,160"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="1.2"
              opacity="0.6"
            />

            {/* Eagle Tail Feathers */}
            <polygon
              points="180,260 200,320 220,260 210,290 200,305 190,290"
              fill="url(#sovEagleSilver)"
              stroke="#1E293B"
              strokeWidth="1.5"
            />

            {/* Eagle Claws Grasping Shield */}
            <g fill="#CBD5E1" stroke="#0F172A" strokeWidth="1">
              <path d="M 140,250 C 135,260 145,270 155,260 Z" />
              <path d="M 150,255 C 145,265 155,275 165,265 Z" />
              <path d="M 245,260 C 255,270 265,260 260,250 Z" />
              <path d="M 235,265 C 245,275 255,265 250,255 Z" />
            </g>

            {/* Eagle Head & Crest Facing Left */}
            <path
              d="M 200,135
                 C 190,135 180,140 175,150
                 C 170,160 178,168 185,165
                 C 178,168 172,175 180,180
                 C 190,185 200,185 205,180
                 C 215,185 225,178 220,165
                 C 225,155 220,140 200,135 Z"
              fill="url(#sovEagleSilver)"
              stroke="#0F172A"
              strokeWidth="1.5"
            />
            {/* Eagle Beak */}
            <path
              d="M 175,155 C 160,158 165,168 178,165 Z"
              fill="#E2E8F0"
              stroke="#0F172A"
              strokeWidth="1.2"
            />
            {/* Eagle Eye */}
            <circle cx="185" cy="152" r="2.5" fill="#0F172A" />
            <circle cx="184.5" cy="151.5" r="0.8" fill="#FFFFFF" />

            {/* Royal Crown Resting on Eagle Head */}
            <g id="sovImperialCrown" transform="translate(168, 100) scale(1.6)">
              {/* Crown Base */}
              <rect x="5" y="22" width="30" height="4" rx="1" fill="#E2E8F0" stroke="#1E293B" strokeWidth="0.8" />
              {/* Crown Spikes */}
              <polygon
                points="5,22 8,10 14,16 20,5 26,16 32,10 35,22"
                fill="url(#sovEagleSilver)"
                stroke="#1E293B"
                strokeWidth="1"
              />
              {/* Center Ruby on Crown */}
              <polygon points="20,10 22,14 20,18 18,14" fill="url(#sovRubyGlow)" />
              <circle cx="8" cy="10" r="1.5" fill="url(#sovRubyGlow)" />
              <circle cx="32" cy="10" r="1.5" fill="url(#sovRubyGlow)" />
            </g>
          </g>

          {/* ================================================================= */}
          {/* CENTER ESCUTCHEON SHIELD (HEART SHIELD) */}
          {/* ================================================================= */}
          <g id="sovEscutcheonShield">
            {/* Outer Shield Border */}
            <path
              d="M 155,185 
                 L 245,185 
                 L 245,245 
                 C 245,285 200,305 200,305 
                 C 200,305 155,285 155,245 
                 Z"
              fill="url(#sovShieldGradient)"
              stroke="#CBD5E1"
              strokeWidth="3.5"
            />
            {/* Inner Shield Inset */}
            <path
              d="M 160,190 
                 L 240,190 
                 L 240,242 
                 C 240,278 200,298 200,298 
                 C 200,298 160,278 160,242 
                 Z"
              fill="#090E17"
              stroke="#475569"
              strokeWidth="1"
            />

            {/* Classical Greek/Roman Ionic Column (Center of Shield) */}
            <g id="sovIonicPillar" transform="translate(186, 202) scale(1.1)">
              {/* Capital (Top scrolled Ionic volutes) */}
              <rect x="3" y="0" width="20" height="3" rx="0.5" fill="#E2E8F0" stroke="#0F172A" strokeWidth="0.5" />
              <circle cx="4" cy="4" r="2.5" fill="#E2E8F0" stroke="#0F172A" strokeWidth="0.5" />
              <circle cx="22" cy="4" r="2.5" fill="#E2E8F0" stroke="#0F172A" strokeWidth="0.5" />
              <rect x="5" y="4" width="16" height="2" fill="#CBD5E1" />

              {/* Fluted Column Shaft */}
              <rect x="7" y="7" width="12" height="50" fill="url(#sovEagleSilver)" stroke="#0F172A" strokeWidth="0.8" />
              <line x1="9" y1="7" x2="9" y2="57" stroke="#64748B" strokeWidth="0.6" />
              <line x1="11" y1="7" x2="11" y2="57" stroke="#FFFFFF" strokeWidth="0.6" />
              <line x1="13" y1="7" x2="13" y2="57" stroke="#64748B" strokeWidth="0.6" />
              <line x1="15" y1="7" x2="15" y2="57" stroke="#FFFFFF" strokeWidth="0.6" />
              <line x1="17" y1="7" x2="17" y2="57" stroke="#64748B" strokeWidth="0.6" />

              {/* Base Pedestal */}
              <rect x="5" y="57" width="16" height="3" fill="#CBD5E1" stroke="#0F172A" strokeWidth="0.5" />
              <rect x="3" y="60" width="20" height="4" rx="0.5" fill="#E2E8F0" stroke="#0F172A" strokeWidth="0.5" />
            </g>

            {/* Left of Column: Scales of Justice */}
            <g id="sovScalesOfJustice" transform="translate(164, 225) scale(0.75)">
              <line x1="12" y1="0" x2="12" y2="24" stroke="#CBD5E1" strokeWidth="1.2" />
              <line x1="0" y1="4" x2="24" y2="4" stroke="#CBD5E1" strokeWidth="1.5" />
              {/* Left Pan */}
              <line x1="3" y1="4" x2="0" y2="14" stroke="#94A3B8" strokeWidth="0.8" />
              <line x1="3" y1="4" x2="6" y2="14" stroke="#94A3B8" strokeWidth="0.8" />
              <path d="M -2,14 Q 3,18 8,14 Z" fill="#E2E8F0" />
              {/* Right Pan */}
              <line x1="21" y1="4" x2="18" y2="14" stroke="#94A3B8" strokeWidth="0.8" />
              <line x1="21" y1="4" x2="24" y2="14" stroke="#94A3B8" strokeWidth="0.8" />
              <path d="M 16,14 Q 21,18 26,14 Z" fill="#E2E8F0" />
            </g>

            {/* Right of Column: Open Book of Law / Constitution */}
            <g id="sovOpenBook" transform="translate(216, 228) scale(0.8)">
              {/* Left Page */}
              <path d="M 10,0 C 5,2 0,0 0,16 C 5,18 10,16 10,16 Z" fill="#E2E8F0" stroke="#0F172A" strokeWidth="0.8" />
              {/* Right Page */}
              <path d="M 10,0 C 15,2 20,0 20,16 C 15,18 10,16 10,16 Z" fill="#CBD5E1" stroke="#0F172A" strokeWidth="0.8" />
              {/* Text lines */}
              <line x1="2" y1="5" x2="8" y2="5" stroke="#64748B" strokeWidth="0.6" />
              <line x1="2" y1="9" x2="8" y2="9" stroke="#64748B" strokeWidth="0.6" />
              <line x1="12" y1="5" x2="18" y2="5" stroke="#64748B" strokeWidth="0.6" />
              <line x1="12" y1="9" x2="18" y2="9" stroke="#64748B" strokeWidth="0.6" />
            </g>

            {/* Diamond Ruby at bottom point of shield */}
            <polygon points="200,285 204,291 200,297 196,291" fill="url(#sovRubyGlow)" stroke="#FFF" strokeWidth="0.5" />
          </g>

          {/* Top Diamond Accent at 12 o'clock */}
          <polygon points="200,24 204,32 200,40 196,32" fill="url(#sovRubyGlow)" stroke="#FFF" strokeWidth="0.5" />
        </svg>
      </div>

      {/* Sovereign System Inspection Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-mono">
          <div className="relative w-full max-w-xl bg-gradient-to-b from-[#0E1524] to-[#070B12] border-2 border-cyan-500/50 rounded-2xl p-6 shadow-2xl shadow-cyan-950/50 space-y-5">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header with Enlarged Seal */}
            <div className="flex flex-col sm:flex-row items-center gap-5 pb-4 border-b border-slate-800">
              <div className="w-32 h-32 shrink-0">
                <SovereignSeal size={128} interactive={false} />
              </div>
              <div className="text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h2 className="text-xl font-black text-white uppercase tracking-wider">
                    Sovereign System
                  </h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    CANONICAL CREST
                  </span>
                </div>
                <p className="text-xs text-amber-300 font-bold mt-1 tracking-widest uppercase">
                  Governance &middot; Integrity &middot; Continuity
                </p>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  The constitutional foundation of the AEGENTIS Sovereign OS and True Swarm architecture.
                </p>
              </div>
            </div>

            {/* Three Pillar Tenets */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-cyan-400" />
                  <span>GOVERNANCE</span>
                </span>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Deterministic 5-layer consensus, legal worker scaling (5x), and self-authorizing Bayesian causal inference without third-party cloud dependence.
                </p>
              </div>

              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>INTEGRITY</span>
                </span>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Cryptographic HMAC-SHA256 nonces, TSL MPC custody enclaves, and memory detour defenses powered by cybersecurity/halo-ce-universal.
                </p>
              </div>

              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                <span className="font-bold text-purple-300 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-purple-400" />
                  <span>CONTINUITY</span>
                </span>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Verified 9,980-byte canonical compose topology, local AMD Ryzen execution, and automated Model Rotation across Free Tier buckets.
                </p>
              </div>
            </div>

            {/* Footer Sign-off */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
              <span>Authentication: <b className="text-emerald-400">0x9980_CANONICAL_SWARM</b></span>
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-lg text-xs transition-colors"
              >
                Dismiss Seal
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
