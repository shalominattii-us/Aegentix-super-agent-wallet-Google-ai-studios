import React, { useState, useEffect, useRef } from 'react';
import {
  Shield,
  Crosshair,
  Radio,
  Eye,
  Zap,
  Target,
  AlertTriangle,
  Compass,
  Layers,
  Lock,
  Unlock,
  Volume2,
  VolumeX,
  Maximize2,
  Cpu,
  Flame,
  CheckCircle2,
  RefreshCw,
  Search,
  ExternalLink,
  Copy,
  Check,
  Terminal,
  Settings,
  Play
} from 'lucide-react';
import { SovereignSeal } from './SovereignSeal';

interface ContactEntity {
  id: string;
  name: string;
  type: 'OPPORTUNITY' | 'THREAT' | 'ALLY' | 'POOL';
  venue: string;
  spreadPct: number;
  distanceMeters: number;
  angleDeg: number;
  confidence: number;
  status: 'LOCKED' | 'TRACKING' | 'DISENGAGED';
  depthUsd: number;
  mevRisk: 'LOW' | 'MEDIUM' | 'HIGH';
}

interface HaloCeVisorFPVProps {
  onExecuteTrade?: (pair: string, action: string) => void;
  onNotify?: (msg: string, type: 'SUCCESS' | 'ALERT' | 'INFO') => void;
}

export const HaloCeVisorFPV: React.FC<HaloCeVisorFPVProps> = ({ onExecuteTrade, onNotify }) => {
  // Audio FX generator using Web Audio API
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const playVisorSound = (type: 'LOCK' | 'FIRE' | 'PING' | 'SHIELD_HIT' | 'SHIELD_RECHARGE') => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === 'LOCK') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(1760, now + 0.12);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'FIRE') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.2);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'PING') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'SHIELD_HIT') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(240, now);
        osc.frequency.linearRampToValueAtTime(120, now + 0.15);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.18);
        osc.start(now);
        osc.stop(now + 0.18);
      } else if (type === 'SHIELD_RECHARGE') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.linearRampToValueAtTime(880, now + 0.3);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      }
    } catch {}
  };

  // Visor Status State
  const [shieldLevel, setShieldLevel] = useState(100);
  const [healthSegments, setHealthSegments] = useState(5);
  const [ammoCount, setAmmoCount] = useState(60); // MA5B 60-round mag
  const [reserveAmmo, setReserveAmmo] = useState(600);
  const [fragGrenades, setFragGrenades] = useState(4);
  const [plasmaGrenades, setPlasmaGrenades] = useState(4);
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [visrMode, setVisrMode] = useState<'STANDARD' | 'TACTICAL_NV' | 'MEMPOOL_THERMAL'>('STANDARD');
  const [zoomLevel, setZoomLevel] = useState<1 | 2 | 10>(1);
  const [radarRange, setRadarRange] = useState<15 | 25 | 50>(25);
  const [radarAngle, setRadarAngle] = useState(0);

  // Halo CE Web Desktop Shortcut Bridge State
  const haloShortcutPath = 'C:\\Users\\eagle\\OneDrive\\Desktop\\Halo CE Web.lnk';
  const [viewportMode, setViewportMode] = useState<'SIMULATOR' | 'EMBED_WEB'>('SIMULATOR');
  const [haloWebUrl, setHaloWebUrl] = useState(() => {
    return localStorage.getItem('halo_ce_web_url') || 'http://localhost:8080';
  });
  const [tempUrl, setTempUrl] = useState(haloWebUrl);
  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const [copiedLaunchCmd, setCopiedLaunchCmd] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [gameInputFocus, setGameInputFocus] = useState(false);

  const handleSaveUrl = () => {
    localStorage.setItem('halo_ce_web_url', tempUrl);
    setHaloWebUrl(tempUrl);
    setIsEditingUrl(false);
    setIframeKey((prev) => prev + 1);
    if (onNotify) onNotify(`Halo CE Web URL linked to ${tempUrl}`, 'INFO');
  };

  const handleCopyLaunchCommand = () => {
    const cmd = `Start-Process "${haloShortcutPath}"`;
    navigator.clipboard.writeText(cmd);
    setCopiedLaunchCmd(true);
    setTimeout(() => setCopiedLaunchCmd(false), 2500);
    if (onNotify) onNotify(`Copied Launch Command: ${cmd}`, 'SUCCESS');
  };

  // Live Nano-Transactions & Halo CE Web Compute/s Engine
  const [isOverclocked, setIsOverclocked] = useState(false);
  const [nanoTxRate, setNanoTxRate] = useState(34850);
  const [totalNanoTxsSettled, setTotalNanoTxsSettled] = useState(14829040);
  const [computeGflops, setComputeGflops] = useState(48.6);
  const [nanoLatencyNs, setNanoLatencyNs] = useState(380);
  const [burstActive, setBurstActive] = useState(false);
  const [nanoTxFeed, setNanoTxFeed] = useState<Array<{ id: number; symbol: string; amount: string; venue: string; latencyNs: number; status: string }>>([
    { id: 98401, symbol: 'ETH-ARB', amount: '0.00014 ETH', venue: 'Uniswap-V3', latencyNs: 340, status: 'SETTLED' },
    { id: 98402, symbol: 'SOL-NANO', amount: '0.0082 SOL', venue: 'Raydium', latencyNs: 290, status: 'SETTLED' },
    { id: 98403, symbol: 'USDC-TSL', amount: '0.4500 USDC', venue: 'Hermes-L2', latencyNs: 420, status: 'SETTLED' },
    { id: 98404, symbol: 'BTC-MICRO', amount: '0.000008 BTC', venue: 'Mempool-Zero', latencyNs: 310, status: 'SETTLED' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const multiplier = isOverclocked ? 3.45 : 1.0;
      const baseJitter = (Math.random() - 0.5) * 1600;
      const newRate = Math.round((34500 + baseJitter) * multiplier);
      setNanoTxRate(newRate);

      setTotalNanoTxsSettled((prev) => prev + Math.round(newRate * 0.1));

      const computeJitter = (Math.random() - 0.5) * 2.4;
      setComputeGflops(Number(((48.6 + computeJitter) * multiplier).toFixed(1)));

      const latencyJitter = Math.round((Math.random() - 0.5) * 30);
      setNanoLatencyNs(Math.max(95, Math.round((isOverclocked ? 190 : 380) + latencyJitter)));
    }, 150);

    return () => clearInterval(interval);
  }, [isOverclocked]);

  const handleTriggerNanoBurst = () => {
    playVisorSound('FIRE');
    setBurstActive(true);
    setIsOverclocked(true);
    if (onNotify) {
      onNotify('⚡ NANO-TX BURST CORE ACTIVATED: 120,000+ COMPUTE/S ENGAGED', 'SUCCESS');
    }
    setTimeout(() => {
      setBurstActive(false);
      setIsOverclocked(false);
    }, 8000);
  };

  // Contacts
  const [contacts, setContacts] = useState<ContactEntity[]>([
    {
      id: 'c1',
      name: 'ETH/USDC Flash Arb',
      type: 'OPPORTUNITY',
      venue: 'Uniswap V3 ↔ Binance.US',
      spreadPct: 1.869,
      distanceMeters: 18.4,
      angleDeg: 35,
      confidence: 0.98,
      status: 'LOCKED',
      depthUsd: 842000,
      mevRisk: 'LOW'
    },
    {
      id: 'c2',
      name: 'MEV Sandwich Vector #81',
      type: 'THREAT',
      venue: 'Ethereum Mempool (:8545)',
      spreadPct: -0.42,
      distanceMeters: 9.2,
      angleDeg: 145,
      confidence: 0.94,
      status: 'TRACKING',
      depthUsd: 140000,
      mevRisk: 'HIGH'
    },
    {
      id: 'c3',
      name: 'Sovereign Worker #1 (Legal)',
      type: 'ALLY',
      venue: 'Local Compose (9980B)',
      spreadPct: 0.0,
      distanceMeters: 4.8,
      angleDeg: 280,
      confidence: 1.0,
      status: 'TRACKING',
      depthUsd: 50000,
      mevRisk: 'LOW'
    },
    {
      id: 'c4',
      name: 'XRPL DEX XRP/USD Ripple Orderbook',
      type: 'POOL',
      venue: 'XRPL Ledger L1',
      spreadPct: 0.74,
      distanceMeters: 22.0,
      angleDeg: 215,
      confidence: 0.91,
      status: 'TRACKING',
      depthUsd: 380000,
      mevRisk: 'LOW'
    },
    {
      id: 'c5',
      name: 'BTC/USDT Cross-Venue Orderflow',
      type: 'OPPORTUNITY',
      venue: 'Coinbase Orchards ↔ Binance',
      spreadPct: 0.65,
      distanceMeters: 38.5,
      angleDeg: 80,
      confidence: 0.89,
      status: 'TRACKING',
      depthUsd: 1250000,
      mevRisk: 'LOW'
    }
  ]);

  const [activeContactId, setActiveContactId] = useState<string>('c1');
  const lockedContact = contacts.find((c) => c.id === activeContactId) || contacts[0];

  // Radar sweep animation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setRadarAngle((prev) => (prev + 4) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // Shield fluctuation simulation
  const triggerShieldHit = () => {
    playVisorSound('SHIELD_HIT');
    setShieldLevel((prev) => Math.max(15, prev - 25));
    if (onNotify) onNotify('VISOR WARNING: Volatility shock hit shield perimeter!', 'ALERT');
    setTimeout(() => {
      playVisorSound('SHIELD_RECHARGE');
      setShieldLevel(100);
    }, 2800);
  };

  // Fire MA5B / Execute Atomic Flash Arb
  const handleFireContact = () => {
    if (ammoCount <= 0) {
      if (onNotify) onNotify('MA5B OUT OF ROUNDS: Reloading gas headroom...', 'ALERT');
      setTimeout(() => setAmmoCount(60), 1200);
      return;
    }

    playVisorSound('FIRE');
    setAmmoCount((prev) => Math.max(0, prev - 1));

    if (lockedContact) {
      if (onExecuteTrade) {
        onExecuteTrade(lockedContact.name, lockedContact.type === 'THREAT' ? 'PURGE_THREAT' : 'ARBITRAGE');
      }
      if (onNotify) {
        onNotify(
          `MJOLNIR CONTACT ENGAGED: ${lockedContact.name} on ${lockedContact.venue} (+${lockedContact.spreadPct}% spread)`,
          'SUCCESS'
        );
      }
    }
  };

  // Lock target
  const handleSelectContact = (id: string) => {
    playVisorSound('LOCK');
    setActiveContactId(id);
    setContacts((prev) =>
      prev.map((c) => ({
        ...c,
        status: c.id === id ? 'LOCKED' : 'TRACKING'
      }))
    );
  };

  // Visor color themes
  const isNightVision = visrMode === 'TACTICAL_NV';
  const isMempoolThermal = visrMode === 'MEMPOOL_THERMAL';

  return (
    <div className="space-y-3 font-mono">
      {/* HALO CE WEB DESKTOP SHORTCUT BRIDGE BAR */}
      <div className="p-3 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-cyan-500/40 rounded-xl flex flex-col lg:flex-row lg:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Halo CE Web Shortcut Bridge
              </span>
              <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded text-[9px] font-bold">
                LINKED SHORTCUT
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-0.5">
              <code className="text-[11px] text-cyan-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 font-mono select-all">
                {haloShortcutPath}
              </code>
              <button
                onClick={handleCopyLaunchCommand}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[10px] font-bold flex items-center gap-1 border border-slate-700 transition-colors"
                title="Copy PowerShell Start-Process command"
              >
                {copiedLaunchCmd ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedLaunchCmd ? 'Copied Launch Cmd!' : 'Copy Launch Command'}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[10px]">
            <button
              onClick={() => setViewportMode('SIMULATOR')}
              className={`px-2.5 py-1 rounded font-bold transition-all ${
                viewportMode === 'SIMULATOR'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🕹️ HUD Simulator
            </button>
            <button
              onClick={() => setViewportMode('EMBED_WEB')}
              className={`px-2.5 py-1 rounded font-bold transition-all ${
                viewportMode === 'EMBED_WEB'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🌐 Embedded Halo CE Web
            </button>
          </div>

          {/* Web Target Config (when EMBED_WEB is active) */}
          {viewportMode === 'EMBED_WEB' && (
            <div className="flex items-center gap-1.5 text-[10px]">
              {isEditingUrl ? (
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={tempUrl}
                    onChange={(e) => setTempUrl(e.target.value)}
                    className="px-2 py-1 bg-slate-950 border border-cyan-500/50 rounded text-cyan-300 font-mono text-[10px] w-40"
                    placeholder="http://localhost:8080"
                  />
                  <button
                    onClick={handleSaveUrl}
                    className="px-2 py-1 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <span className="text-slate-400">Target:</span>
                  <code className="text-cyan-300 font-bold bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                    {haloWebUrl}
                  </code>
                  <button
                    onClick={() => {
                      setTempUrl(haloWebUrl);
                      setIsEditingUrl(true);
                    }}
                    className="p-1 text-slate-400 hover:text-white"
                    title="Change local web port/URL"
                  >
                    <Settings className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <button
                onClick={() => setGameInputFocus(!gameInputFocus)}
                className={`px-2 py-1 rounded font-bold border transition-colors ${
                  gameInputFocus
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
                title="When ON, clicks interact directly with the game canvas. When OFF, clicks lock market contacts."
              >
                {gameInputFocus ? '🎮 Game Input: ACTIVE' : '🎯 HUD Targeting: ACTIVE'}
              </button>

              <a
                href={haloWebUrl}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                title="Open Halo CE Web in dedicated window"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>
      </div>

      {/* NANO-TXS & HALO CE WEB COMPUTE/S TELEMETRY STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-2.5 bg-slate-950/80 border border-emerald-500/40 rounded-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Zap className={`w-3.5 h-3.5 ${isOverclocked ? 'animate-bounce text-amber-300' : ''}`} />
              Nano-TXs / Sec
            </span>
            <span className={`px-1 rounded text-[8px] font-black ${isOverclocked ? 'bg-amber-500/30 text-amber-300 animate-pulse' : 'bg-emerald-500/20 text-emerald-300'}`}>
              {isOverclocked ? 'BURST 3.5X' : 'TSL MESH'}
            </span>
          </div>
          <div className="text-xl font-black text-white mt-1 font-mono tracking-tight flex items-baseline gap-1.5">
            <span className={isOverclocked ? 'text-amber-300' : 'text-emerald-300'}>
              {nanoTxRate.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-500 font-normal">tx/s</span>
          </div>
          <div className="text-[9px] text-slate-400 mt-0.5 truncate font-mono">
            Zero-gas sub-ms settlement stream
          </div>
        </div>

        <div className="p-2.5 bg-slate-950/80 border border-cyan-500/40 rounded-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <Cpu className="w-3.5 h-3.5" />
              Halo Web Compute/s
            </span>
            <span className="px-1 rounded text-[8px] font-black bg-cyan-500/20 text-cyan-300">
              WASM / GPU
            </span>
          </div>
          <div className="text-xl font-black text-cyan-300 mt-1 font-mono tracking-tight flex items-baseline gap-1.5">
            <span>{computeGflops}</span>
            <span className="text-[10px] text-slate-500 font-normal">GFLOPS/s</span>
          </div>
          <div className="text-[9px] text-slate-400 mt-0.5 truncate font-mono">
            Direct SIMD parallel matrix execution
          </div>
        </div>

        <div className="p-2.5 bg-slate-950/80 border border-purple-500/40 rounded-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1.5 text-purple-400">
              <Layers className="w-3.5 h-3.5" />
              Cumulative Nano TXs
            </span>
            <span className="px-1 rounded text-[8px] font-black bg-purple-500/20 text-purple-300">
              SETTLED
            </span>
          </div>
          <div className="text-xl font-black text-purple-300 mt-1 font-mono tracking-tight">
            {(totalNanoTxsSettled / 1000000).toFixed(2)}M
          </div>
          <div className="text-[9px] text-slate-400 mt-0.5 truncate font-mono">
            {totalNanoTxsSettled.toLocaleString()} verified on MPC
          </div>
        </div>

        <div className="p-2.5 bg-slate-950/80 border border-amber-500/40 rounded-xl relative overflow-hidden group flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1.5 text-amber-400">
              <Radio className="w-3.5 h-3.5" />
              Sub-Micro Latency
            </span>
            <button
              onClick={handleTriggerNanoBurst}
              className={`px-1.5 py-0.5 rounded text-[8px] font-black transition-colors ${
                isOverclocked
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-amber-500/30 text-amber-300 hover:bg-amber-500 hover:text-slate-950'
              }`}
            >
              {isOverclocked ? 'BURSTING...' : '⚡ OVERCLOCK'}
            </button>
          </div>
          <div className="text-xl font-black text-amber-300 mt-1 font-mono tracking-tight flex items-baseline gap-1.5">
            <span>{nanoLatencyNs}</span>
            <span className="text-[10px] text-slate-500 font-normal">ns / tx</span>
          </div>
          <div className="text-[9px] text-slate-400 mt-0.5 truncate font-mono">
            Hardware-timed ring buffer dispatch
          </div>
        </div>
      </div>

      {/* Main Visor Viewport */}
      <div
        className={`relative w-full h-[620px] rounded-2xl overflow-hidden font-mono select-none transition-all duration-300 border-2 ${
          isNightVision
            ? 'bg-[#031508] border-emerald-500/80 text-emerald-400'
            : isMempoolThermal
            ? 'bg-[#1a001a] border-purple-500/80 text-purple-300'
            : 'bg-[#040810] border-cyan-500/60 text-cyan-300'
        }`}
        style={{
          boxShadow: isNightVision
            ? 'inset 0 0 80px rgba(16, 185, 129, 0.25), 0 0 30px rgba(16, 185, 129, 0.3)'
            : isMempoolThermal
            ? 'inset 0 0 80px rgba(168, 85, 247, 0.25), 0 0 30px rgba(168, 85, 247, 0.3)'
            : 'inset 0 0 80px rgba(6, 182, 212, 0.2), 0 0 30px rgba(6, 182, 212, 0.25)'
        }}
      >
        {/* Live Embedded Halo CE Web Iframe (when EMBED_WEB is active) */}
        {viewportMode === 'EMBED_WEB' && (
          <div className={`absolute inset-0 z-10 ${gameInputFocus ? 'pointer-events-auto' : 'pointer-events-none'}`}>
            <iframe
              key={iframeKey}
              src={haloWebUrl}
              title="Halo CE Web"
              className="w-full h-full border-0 bg-black"
              allow="autoplay; fullscreen; keyboard-map; cross-origin-isolated"
            />
          </div>
        )}
      {/* Curved Visor Edge Overlays (Helmet Bezel) */}
      <div className="absolute inset-0 pointer-events-none z-30">
        {/* Top curved helmet rim */}
        <div className="absolute top-0 inset-x-0 h-10 bg-gradient-to-b from-slate-950 via-slate-950/80 to-transparent border-b border-cyan-500/30 flex items-center justify-between px-8 text-[11px] font-bold tracking-widest text-slate-400">
          <div className="flex items-center gap-2.5">
            <SovereignSeal size={22} interactive={false} />
            <span className="text-cyan-400 font-black">UNSC MJOLNIR MK-V</span>
            <span>&middot;</span>
            <span className="text-white">AEGENTIS TACTICAL HUD v1.17</span>
            <span>&middot;</span>
            <span className="text-emerald-400 font-mono">SOVEREIGN COMPUTE ACTIVE</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span>NANO TXS: <b className={`transition-colors ${isOverclocked ? 'text-amber-300 animate-pulse' : 'text-emerald-300'}`}>{nanoTxRate.toLocaleString()} /s</b></span>
            <span>COMPUTE: <b className="text-cyan-300">{computeGflops} GFLOPS</b></span>
            <span>LATENCY: <b className="text-emerald-300">{nanoLatencyNs} ns</b></span>
            <span>SYSTEM: <b className="text-cyan-400">100%</b></span>
          </div>
        </div>

        {/* Scanlines Effect */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4) 1px, transparent 1px, transparent 2px)',
            backgroundSize: '100% 2px'
          }}
        />

        {/* Outer curved frame vignette */}
        <div className="absolute inset-0 rounded-2xl ring-1 ring-cyan-400/40 pointer-events-none" />
      </div>

      {/* ========================================================================= */}
      {/* TOP RIGHT: SHIELD & HEALTH BARS (ICONIC HALO CE) */}
      {/* ========================================================================= */}
      <div className="absolute top-12 right-6 z-40 flex flex-col items-end space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black tracking-widest uppercase text-cyan-300">SHIELDS</span>
          <div className="w-44 h-4 bg-slate-950/90 border border-cyan-400/60 rounded-sm p-0.5 overflow-hidden shadow-lg shadow-cyan-500/20">
            <div
              className={`h-full transition-all duration-300 rounded-xs ${
                shieldLevel > 50
                  ? 'bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 shadow-cyan-400'
                  : shieldLevel > 20
                  ? 'bg-gradient-to-r from-amber-400 to-orange-500 animate-pulse'
                  : 'bg-gradient-to-r from-rose-500 to-red-600 animate-ping'
              }`}
              style={{ width: `${shieldLevel}%` }}
            />
          </div>
          <span className="text-xs font-black text-cyan-300 font-mono w-9 text-right">{shieldLevel}%</span>
        </div>

        {/* Health Blocks */}
        <div className="flex items-center gap-1.5 pt-0.5">
          <span className="text-[9px] font-bold text-rose-400 tracking-wider">HEALTH</span>
          <div className="w-2.5 h-2.5 bg-rose-500 rounded-xs flex items-center justify-center text-[7px] font-bold text-white">
            +
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((idx) => (
              <div
                key={idx}
                className={`w-5 h-2 rounded-xs border ${
                  idx <= healthSegments
                    ? 'bg-rose-500/80 border-rose-400 shadow-xs shadow-rose-500/40'
                    : 'bg-slate-900 border-slate-800'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TOP LEFT: WEAPON, AMMO & GRENADES (HALO CE MA5B HUD) */}
      {/* ========================================================================= */}
      <div className="absolute top-12 left-6 z-40 space-y-1">
        <div className="flex items-center gap-3">
          <div className="p-1 px-2 bg-slate-950/80 border border-cyan-500/50 rounded flex items-center gap-2">
            <Flame className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs font-black text-white tracking-wider">MA5B / NANO-TX CORE</span>
          </div>

          <div className="flex items-baseline gap-1 text-cyan-300">
            <span className="text-2xl font-black tabular-nums tracking-tighter text-white">{ammoCount}</span>
            <span className="text-xs text-slate-400 font-semibold">/ {reserveAmmo}</span>
          </div>

          {/* Nano-TX Compute Tag */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-950/90 border border-emerald-500/50 rounded shadow-md">
            <Zap className={`w-3 h-3 ${isOverclocked ? 'text-amber-400 animate-bounce' : 'text-emerald-400'}`} />
            <span className="text-[10px] font-bold text-emerald-300 font-mono">{nanoTxRate.toLocaleString()} NANO-TX/S</span>
            <span className="text-slate-600">&bull;</span>
            <span className="text-[10px] font-bold text-cyan-300 font-mono">{computeGflops} GFLOPS</span>
          </div>
        </div>

        {/* Grenades (Frag & Plasma) */}
        <div className="flex items-center gap-3 text-[10px] text-slate-300 font-bold pt-1">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>FRAG: <b>{fragGrenades}</b></span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span>PLASMA: <b>{plasmaGrenades}</b></span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CENTER VIEWPORT: TARGET RETICLE & FIRST-PERSON CONTACT HUD */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
        {/* Halo CE Circular Crosshair Reticle */}
        <div className="relative flex items-center justify-center">
          {/* Outer circle with brackets */}
          <div
            className={`w-32 h-32 rounded-full border-2 border-dashed flex items-center justify-center transition-all duration-300 ${
              lockedContact?.type === 'THREAT'
                ? 'border-rose-400/80 animate-pulse'
                : lockedContact?.type === 'OPPORTUNITY'
                ? 'border-cyan-400/80 shadow-lg shadow-cyan-500/20'
                : 'border-emerald-400/70'
            }`}
            style={{ transform: `scale(${zoomLevel === 10 ? 1.6 : zoomLevel === 2 ? 1.25 : 1.0})` }}
          >
            {/* Center dot & crosshair pips */}
            <div className="w-2 h-2 rounded-full bg-cyan-300" />
            <div className="absolute top-0 w-0.5 h-3 bg-cyan-400" />
            <div className="absolute bottom-0 w-0.5 h-3 bg-cyan-400" />
            <div className="absolute left-0 w-3 h-0.5 bg-cyan-400" />
            <div className="absolute right-0 w-3 h-0.5 bg-cyan-400" />
          </div>

          {/* Locked Contact Callout Box */}
          {lockedContact && (
            <div className="absolute -top-20 left-20 bg-slate-950/90 border border-cyan-400/60 p-2.5 rounded-lg shadow-2xl min-w-[220px] pointer-events-auto backdrop-blur-md">
              <div className="flex items-center justify-between pb-1 border-b border-slate-800 text-[10px]">
                <span className="flex items-center gap-1 font-bold text-white">
                  <Target className="w-3 h-3 text-cyan-400" />
                  {lockedContact.name}
                </span>
                <span
                  className={`px-1 rounded text-[8px] font-black ${
                    lockedContact.type === 'THREAT'
                      ? 'bg-rose-500/30 text-rose-300 border border-rose-500/40'
                      : 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                  }`}
                >
                  {lockedContact.status}
                </span>
              </div>

              <div className="text-[10px] space-y-0.5 pt-1 text-slate-300 font-mono">
                <div className="flex justify-between">
                  <span>Venue:</span>
                  <b className="text-white">{lockedContact.venue}</b>
                </div>
                <div className="flex justify-between">
                  <span>Spread Delta:</span>
                  <b className={lockedContact.spreadPct > 0 ? 'text-emerald-400' : 'text-rose-400'}>
                    {lockedContact.spreadPct > 0 ? `+${lockedContact.spreadPct}%` : `${lockedContact.spreadPct}%`}
                  </b>
                </div>
                <div className="flex justify-between">
                  <span>Distance:</span>
                  <b className="text-cyan-300">{lockedContact.distanceMeters.toFixed(1)} m</b>
                </div>
                <div className="flex justify-between">
                  <span>Certainty:</span>
                  <b className="text-purple-300">{(lockedContact.confidence * 100).toFixed(0)}%</b>
                </div>
              </div>

              <button
                onClick={handleFireContact}
                className="mt-2 w-full py-1 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black rounded text-[10px] uppercase tracking-wider transition-all shadow"
              >
                {lockedContact.type === 'THREAT' ? 'Purge MEV Threat' : 'Execute Flash Capture'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Floating Tactical Contacts in Viewport */}
      <div className="absolute inset-0 z-20 pointer-events-auto p-12 overflow-hidden flex items-center justify-around">
        {contacts.map((contact) => {
          const isSelected = contact.id === activeContactId;
          return (
            <div
              key={contact.id}
              onClick={() => handleSelectContact(contact.id)}
              className={`p-2 rounded-lg border cursor-pointer transition-all duration-300 backdrop-blur-sm ${
                isSelected
                  ? 'bg-cyan-950/80 border-cyan-400 ring-2 ring-cyan-400/40 scale-105 shadow-xl'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-cyan-500/50 hover:scale-100 opacity-75'
              }`}
              style={{
                transform: `scale(${zoomLevel === 10 ? 1.3 : zoomLevel === 2 ? 1.15 : 1.0})`
              }}
            >
              <div className="flex items-center gap-1.5 text-[10px] font-bold">
                <span
                  className={`w-2 h-2 rounded-full ${
                    contact.type === 'OPPORTUNITY'
                      ? 'bg-cyan-400 animate-ping'
                      : contact.type === 'THREAT'
                      ? 'bg-rose-500 animate-bounce'
                      : 'bg-emerald-400'
                  }`}
                />
                <span className="text-white truncate max-w-[120px]">{contact.name}</span>
              </div>
              <div className="text-[9px] text-slate-400 mt-1 flex justify-between">
                <span>{contact.distanceMeters}m</span>
                <span className="text-emerald-400 font-bold">+{contact.spreadPct}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* BOTTOM LEFT: HALO CE MOTION TRACKER (RADAR SENSOR) */}
      {/* ========================================================================= */}
      <div className="absolute bottom-6 left-6 z-40 flex items-end gap-3">
        <div className="relative w-36 h-36 rounded-full bg-slate-950/90 border-2 border-emerald-500/60 overflow-hidden shadow-2xl shadow-emerald-500/20 backdrop-blur-md">
          {/* Radar Distance Rings */}
          <div className="absolute inset-2 rounded-full border border-emerald-500/30" />
          <div className="absolute inset-8 rounded-full border border-emerald-500/20" />
          <div className="absolute top-1/2 left-0 right-0 h-px bg-emerald-500/30" />
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-emerald-500/30" />

          {/* Player Center Blip (Master Chief) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-yellow-300 shadow-md shadow-yellow-300" />

          {/* Rotating Radar Sweep Line */}
          <div
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{
              transform: `rotate(${radarAngle}deg)`,
              transformOrigin: '50% 50%'
            }}
          >
            <div className="w-1/2 h-full bg-gradient-to-l from-emerald-400/40 to-transparent" />
          </div>

          {/* Contact Blips on Radar */}
          {contacts.map((c) => {
            const rad = (c.angleDeg * Math.PI) / 180;
            const distRatio = Math.min(c.distanceMeters / radarRange, 0.9);
            const x = 72 + distRatio * 60 * Math.cos(rad);
            const y = 72 + distRatio * 60 * Math.sin(rad);

            return (
              <div
                key={c.id}
                onClick={() => handleSelectContact(c.id)}
                className={`absolute w-2 h-2 rounded-full cursor-pointer transition-all ${
                  c.type === 'THREAT'
                    ? 'bg-rose-500 shadow-md shadow-rose-500 animate-pulse'
                    : c.type === 'OPPORTUNITY'
                    ? 'bg-cyan-400 shadow-md shadow-cyan-400'
                    : 'bg-emerald-400 shadow-md shadow-emerald-400'
                }`}
                style={{ top: `${y}px`, left: `${x}px` }}
                title={`${c.name} (${c.distanceMeters}m)`}
              />
            );
          })}

          {/* Motion Tracker Label */}
          <div className="absolute bottom-1.5 inset-x-0 text-center text-[8px] font-black text-emerald-400 tracking-widest uppercase">
            {radarRange}M SENSOR
          </div>
        </div>

        {/* Radar Range Selector Controls */}
        <div className="flex flex-col gap-1 text-[9px] font-bold">
          {([15, 25, 50] as const).map((r) => (
            <button
              key={r}
              onClick={() => {
                playVisorSound('PING');
                setRadarRange(r);
              }}
              className={`px-1.5 py-0.5 rounded border transition-colors ${
                radarRange === r
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800'
              }`}
            >
              {r}m
            </button>
          ))}
        </div>

        {/* Live Nano-TX Settlement Stream */}
        <div className="hidden sm:flex flex-col gap-1 p-2 bg-slate-950/90 border border-emerald-500/40 rounded-lg backdrop-blur-md w-52 text-[9px] font-mono shadow-xl">
          <div className="flex items-center justify-between text-emerald-400 font-bold border-b border-emerald-500/30 pb-0.5">
            <span className="flex items-center gap-1">
              <Zap className="w-2.5 h-2.5 text-emerald-400" />
              NANO-TX STREAM
            </span>
            <span className="text-[8px] text-cyan-300 font-mono">{nanoLatencyNs}ns</span>
          </div>
          <div className="space-y-0.5">
            {nanoTxFeed.map((tx) => (
              <div key={tx.id} className="flex justify-between items-center text-slate-300">
                <span className="text-cyan-300">#{tx.id} {tx.symbol}</span>
                <span className="text-emerald-400 font-bold">{tx.latencyNs}ns</span>
                <span className="text-[7px] px-1 bg-emerald-500/20 text-emerald-300 rounded font-black">OK</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BOTTOM RIGHT: VISOR CONTROLS & SACTICAL ACTION HUB */}
      {/* ========================================================================= */}
      <div className="absolute bottom-6 right-6 z-40 flex items-center gap-2">
        {/* Sound FX Toggle */}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`p-2 rounded-lg border text-xs font-bold transition-all ${
            soundEnabled
              ? 'bg-cyan-950/70 border-cyan-400 text-cyan-300'
              : 'bg-slate-900 border-slate-800 text-slate-500'
          }`}
          title="Toggle Tactical Audio Feedback"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Flashlight Toggle */}
        <button
          onClick={() => {
            playVisorSound('PING');
            setFlashlightOn(!flashlightOn);
          }}
          className={`px-3 py-2 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all ${
            flashlightOn
              ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md shadow-amber-500/20'
              : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>FLASHLIGHT: {flashlightOn ? 'ON' : 'OFF'}</span>
        </button>

        {/* VISR Mode Switcher */}
        <button
          onClick={() => {
            playVisorSound('PING');
            setVisrMode((prev) =>
              prev === 'STANDARD' ? 'TACTICAL_NV' : prev === 'TACTICAL_NV' ? 'MEMPOOL_THERMAL' : 'STANDARD'
            );
          }}
          className={`px-3 py-2 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all ${
            visrMode === 'TACTICAL_NV'
              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
              : visrMode === 'MEMPOOL_THERMAL'
              ? 'bg-purple-500/20 border-purple-400 text-purple-300'
              : 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>VISR: {visrMode}</span>
        </button>

        {/* Zoom Scope Toggle */}
        <button
          onClick={() => {
            playVisorSound('LOCK');
            setZoomLevel((prev) => (prev === 1 ? 2 : prev === 2 ? 10 : 1));
          }}
          className="px-3 py-2 rounded-lg border bg-slate-900 border-slate-800 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
        >
          <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>SCOPE: {zoomLevel}X</span>
        </button>

        {/* Simulate Volatility Hit */}
        <button
          onClick={triggerShieldHit}
          className="px-3 py-2 rounded-lg border bg-rose-950/40 border-rose-800 text-rose-300 hover:bg-rose-900/60 text-xs font-bold flex items-center gap-1.5 transition-colors"
          title="Simulate volatility shock to MJOLNIR shield"
        >
          <Shield className="w-3.5 h-3.5 text-rose-400" />
          <span>TEST SHIELD</span>
        </button>

        {/* Burst Nano-TX Compute Toggle */}
        <button
          onClick={handleTriggerNanoBurst}
          className={`px-3 py-2 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg ${
            isOverclocked
              ? 'bg-gradient-to-r from-amber-600 via-rose-600 to-purple-600 border-amber-400 text-white animate-pulse'
              : 'bg-emerald-950/50 border-emerald-600 text-emerald-300 hover:bg-emerald-900/60'
          }`}
          title="Supercharge Halo CE Web compute pipeline to 120,000+ nano-tx/s"
        >
          <Zap className={`w-3.5 h-3.5 ${isOverclocked ? 'animate-bounce text-amber-200' : 'text-emerald-400'}`} />
          <span>{isOverclocked ? 'BURST ACTIVE: 120K TX/S' : '⚡ BURST NANO TX'}</span>
        </button>
      </div>
    </div>
  </div>
  );
};
