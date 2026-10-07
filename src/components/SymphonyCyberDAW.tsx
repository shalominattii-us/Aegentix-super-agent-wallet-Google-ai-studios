import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  Square,
  Volume2,
  VolumeX,
  Sliders,
  Sparkles,
  Zap,
  Activity,
  Layers,
  Cpu,
  ShieldCheck,
  Share2,
  Brain,
  RotateCcw,
  Music,
  Flame,
  Radio,
  Clock,
  Gauge,
  SlidersHorizontal,
} from 'lucide-react';

export interface DAWTrack {
  id: string;
  name: string;
  role: string;
  color: string;
  accentBg: string;
  icon: 'BRAIN' | 'JUDGE' | 'TELEMETRY' | 'ARGON' | 'DAG' | 'EXECUTION';
  volume: number; // 0 - 1
  pan: number; // -1 to 1
  muted: boolean;
  soloed: boolean;
  soundType: 'SYNTH_LEAD' | 'SUB_BASS' | 'PERCUSSION' | 'PAD' | 'METALLIC' | 'ACID_PLUCK';
  baseFreq: number;
  steps: boolean[]; // 16 steps
}

interface SymphonyCyberDAWProps {
  onNotify?: (message: string, type: 'ALERT' | 'SUCCESS' | 'INFO') => void;
  externalTriggerEvent?: { source: string; payload: string; timestamp: number } | null;
}

const PRESET_PATTERNS: Record<string, { bpm: number; tracks: Array<{ id: string; steps: boolean[]; volume?: number }> }> = {
  NEON_CONSENSUS_132: {
    bpm: 132,
    tracks: [
      { id: 'track-brain', steps: [true, false, false, true, false, false, true, false, true, false, false, true, false, true, false, false] },
      { id: 'track-judge', steps: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false] },
      { id: 'track-telemetry', steps: [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, true] },
      { id: 'track-argon', steps: [true, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false] },
      { id: 'track-dag', steps: [false, true, false, false, false, true, false, true, false, true, false, false, false, true, true, false] },
      { id: 'track-execution', steps: [false, false, true, true, false, false, true, true, false, false, true, true, false, true, false, true] },
    ],
  },
  SOVEREIGN_CYBER_ENCLAVE_118: {
    bpm: 118,
    tracks: [
      { id: 'track-brain', steps: [false, false, true, false, false, false, false, true, false, false, true, false, false, false, false, false] },
      { id: 'track-judge', steps: [true, false, false, false, false, false, false, false, true, false, false, false, false, false, true, false] },
      { id: 'track-telemetry', steps: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false] },
      { id: 'track-argon', steps: [true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false] },
      { id: 'track-dag', steps: [false, false, true, false, false, true, false, false, false, false, true, false, false, true, false, false] },
      { id: 'track-execution', steps: [false, false, false, false, false, false, true, false, false, false, false, false, false, false, true, false] },
    ],
  },
  HIGH_FREQUENCY_ARBITRAGE_144: {
    bpm: 144,
    tracks: [
      { id: 'track-brain', steps: [true, true, false, true, true, false, true, true, false, true, true, false, true, true, true, false] },
      { id: 'track-judge', steps: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false] },
      { id: 'track-telemetry', steps: [true, false, true, false, true, false, true, false, true, false, true, false, true, true, true, true] },
      { id: 'track-argon', steps: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false] },
      { id: 'track-dag', steps: [false, true, true, false, false, true, true, false, false, true, true, false, false, true, true, false] },
      { id: 'track-execution', steps: [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true] },
    ],
  },
};

export const SymphonyCyberDAW: React.FC<SymphonyCyberDAWProps> = ({
  onNotify,
  externalTriggerEvent,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [bpm, setBpm] = useState(132);
  const [masterVolume, setMasterVolume] = useState(0.85);
  const [filterCutoff, setFilterCutoff] = useState(4800);
  const [filterResonance, setFilterResonance] = useState(3.5);
  const [isSonifyingLiveEvents, setIsSonifyingLiveEvents] = useState(true);
  const [activePreset, setActivePreset] = useState('NEON_CONSENSUS_132');

  // Tracks State
  const [tracks, setTracks] = useState<DAWTrack[]>([
    {
      id: 'track-brain',
      name: 'Heretic Core',
      role: 'INFERENCE_LEAD_SYNTH',
      color: '#06B6D4', // Cyan
      accentBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      icon: 'BRAIN',
      volume: 0.8,
      pan: -0.2,
      muted: false,
      soloed: false,
      soundType: 'SYNTH_LEAD',
      baseFreq: 440, // A4
      steps: [true, false, false, true, false, false, true, false, true, false, false, true, false, true, false, false],
    },
    {
      id: 'track-judge',
      name: 'Sovereign Judge',
      role: 'HMAC_SUB_BASS',
      color: '#10B981', // Emerald
      accentBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      icon: 'JUDGE',
      volume: 0.9,
      pan: 0.0,
      muted: false,
      soloed: false,
      soundType: 'SUB_BASS',
      baseFreq: 55, // A1
      steps: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false],
    },
    {
      id: 'track-telemetry',
      name: 'Orderbook Ingest',
      role: 'TICK_PERCUSSION',
      color: '#F59E0B', // Amber
      accentBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      icon: 'TELEMETRY',
      volume: 0.75,
      pan: 0.3,
      muted: false,
      soloed: false,
      soundType: 'PERCUSSION',
      baseFreq: 800,
      steps: [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, true],
    },
    {
      id: 'track-argon',
      name: 'Gemini 4 Argon',
      role: 'QUANTUM_CHORD_PAD',
      color: '#38BDF8', // Sky Blue
      accentBg: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      icon: 'ARGON',
      volume: 0.7,
      pan: -0.4,
      muted: false,
      soloed: false,
      soundType: 'PAD',
      baseFreq: 220, // A3
      steps: [true, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false],
    },
    {
      id: 'track-dag',
      name: 'Federal DAG',
      role: 'CONSENSUS_CLAVE',
      color: '#F43F5E', // Rose
      accentBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      icon: 'DAG',
      volume: 0.7,
      pan: 0.4,
      muted: false,
      soloed: false,
      soundType: 'METALLIC',
      baseFreq: 1200,
      steps: [false, true, false, false, false, true, false, true, false, true, false, false, false, true, true, false],
    },
    {
      id: 'track-execution',
      name: 'OmniCyberDex',
      role: 'HIGH_FREQ_ACID_ARP',
      color: '#A855F7', // Purple
      accentBg: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      icon: 'EXECUTION',
      volume: 0.8,
      pan: 0.1,
      muted: false,
      soloed: false,
      soundType: 'ACID_PLUCK',
      baseFreq: 660, // E5
      steps: [false, false, true, true, false, false, true, true, false, false, true, true, false, true, false, true],
    },
  ]);

  // Web Audio Context & Nodes References
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stepTimerRef = useRef<any>(null);
  const currentStepRef = useRef(0);
  const isPlayingRef = useRef(false);

  // Initialize Web Audio Engine
  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        const ctx = new AudioCtxClass();
        const masterGain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        const analyser = ctx.createAnalyser();

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(filterCutoff, ctx.currentTime);
        filter.Q.setValueAtTime(filterResonance, ctx.currentTime);

        analyser.fftSize = 256;
        masterGain.gain.setValueAtTime(masterVolume, ctx.currentTime);

        filter.connect(masterGain);
        masterGain.connect(analyser);
        analyser.connect(ctx.destination);

        audioCtxRef.current = ctx;
        masterGainRef.current = masterGain;
        filterNodeRef.current = filter;
        analyserRef.current = analyser;
      }
    } else if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  }, [filterCutoff, filterResonance, masterVolume]);

  // Update Master Controls
  useEffect(() => {
    if (masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.setValueAtTime(masterVolume, audioCtxRef.current.currentTime);
    }
  }, [masterVolume]);

  useEffect(() => {
    if (filterNodeRef.current && audioCtxRef.current) {
      filterNodeRef.current.frequency.setValueAtTime(filterCutoff, audioCtxRef.current.currentTime);
      filterNodeRef.current.Q.setValueAtTime(filterResonance, audioCtxRef.current.currentTime);
    }
  }, [filterCutoff, filterResonance]);

  // Trigger sound generator for a specific track
  const playTrackSound = (track: DAWTrack, time: number) => {
    if (!audioCtxRef.current || !filterNodeRef.current) return;
    const ctx = audioCtxRef.current;

    const trackGain = ctx.createGain();
    trackGain.gain.setValueAtTime(track.volume, time);

    if (track.soundType === 'SUB_BASS') {
      // 808 Sub-Bass Pitch Sweep
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(track.baseFreq * 1.5, time);
      osc.frequency.exponentialRampToValueAtTime(track.baseFreq, time + 0.08);

      trackGain.gain.setValueAtTime(track.volume * 1.2, time);
      trackGain.gain.exponentialRampToValueAtTime(0.001, time + 0.45);

      osc.connect(trackGain);
      trackGain.connect(filterNodeRef.current);
      osc.start(time);
      osc.stop(time + 0.45);
    } else if (track.soundType === 'SYNTH_LEAD') {
      // Neuro Lead with Filter Sweep
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      osc1.type = 'sawtooth';
      osc2.type = 'triangle';

      osc1.frequency.setValueAtTime(track.baseFreq, time);
      osc2.frequency.setValueAtTime(track.baseFreq * 1.01, time); // detuned chorus

      trackGain.gain.setValueAtTime(track.volume * 0.7, time);
      trackGain.gain.exponentialRampToValueAtTime(0.001, time + 0.25);

      osc1.connect(trackGain);
      osc2.connect(trackGain);
      trackGain.connect(filterNodeRef.current);

      osc1.start(time);
      osc2.start(time);
      osc1.stop(time + 0.25);
      osc2.stop(time + 0.25);
    } else if (track.soundType === 'PERCUSSION') {
      // Cyber Percussive Noise Click / Snare
      const bufferSize = ctx.sampleRate * 0.08;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const pFilter = ctx.createBiquadFilter();
      pFilter.type = 'bandpass';
      pFilter.frequency.setValueAtTime(1400, time);

      trackGain.gain.setValueAtTime(track.volume * 0.9, time);
      trackGain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);

      noise.connect(pFilter);
      pFilter.connect(trackGain);
      trackGain.connect(filterNodeRef.current);

      noise.start(time);
      noise.stop(time + 0.08);
    } else if (track.soundType === 'PAD') {
      // Quantum Reverb Pad
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(track.baseFreq * 1.5, time);

      trackGain.gain.setValueAtTime(0.001, time);
      trackGain.gain.linearRampToValueAtTime(track.volume * 0.6, time + 0.1);
      trackGain.gain.exponentialRampToValueAtTime(0.001, time + 0.6);

      osc.connect(trackGain);
      trackGain.connect(filterNodeRef.current);
      osc.start(time);
      osc.stop(time + 0.6);
    } else if (track.soundType === 'METALLIC') {
      // Federal DAG Metallic Clave Ping
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(track.baseFreq, time);
      osc.frequency.exponentialRampToValueAtTime(track.baseFreq * 0.7, time + 0.12);

      trackGain.gain.setValueAtTime(track.volume * 0.8, time);
      trackGain.gain.exponentialRampToValueAtTime(0.001, time + 0.14);

      osc.connect(trackGain);
      trackGain.connect(filterNodeRef.current);
      osc.start(time);
      osc.stop(time + 0.14);
    } else {
      // Acid Arp Pluck
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      const stepPitch = track.baseFreq * (1 + (currentStepRef.current % 4) * 0.25);
      osc.frequency.setValueAtTime(stepPitch, time);

      trackGain.gain.setValueAtTime(track.volume * 0.85, time);
      trackGain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);

      osc.connect(trackGain);
      trackGain.connect(filterNodeRef.current);
      osc.start(time);
      osc.stop(time + 0.12);
    }
  };

  // Step Sequencer Engine Loop
  const runSequencerStep = useCallback(() => {
    if (!isPlayingRef.current) return;

    const step = currentStepRef.current;
    setCurrentStep(step);

    const hasAnySolo = tracks.some(t => t.soloed);

    tracks.forEach((track) => {
      const isAudible = hasAnySolo ? track.soloed : !track.muted;
      if (isAudible && track.steps[step]) {
        playTrackSound(track, audioCtxRef.current?.currentTime || 0);
      }
    });

    currentStepRef.current = (step + 1) % 16;

    // 16th note interval at given BPM: (60 / BPM) / 4 * 1000
    const stepDurationMs = ((60 / bpm) / 4) * 1000;
    stepTimerRef.current = setTimeout(runSequencerStep, stepDurationMs);
  }, [bpm, tracks]);

  // Handle Play / Stop Transport
  const handleTogglePlay = () => {
    initAudio();
    if (isPlaying) {
      isPlayingRef.current = false;
      setIsPlaying(false);
      if (stepTimerRef.current) clearTimeout(stepTimerRef.current);
    } else {
      isPlayingRef.current = true;
      setIsPlaying(true);
      runSequencerStep();
      if (onNotify) onNotify(`CyberDAW Transport Running at ${bpm} BPM`, 'SUCCESS');
    }
  };

  const handleStop = () => {
    isPlayingRef.current = false;
    setIsPlaying(false);
    if (stepTimerRef.current) clearTimeout(stepTimerRef.current);
    currentStepRef.current = 0;
    setCurrentStep(0);
  };

  // Preset Pattern Loader
  const handleLoadPreset = (presetKey: string) => {
    const preset = PRESET_PATTERNS[presetKey];
    if (!preset) return;

    setActivePreset(presetKey);
    setBpm(preset.bpm);
    setTracks(prev => prev.map(t => {
      const pTrack = preset.tracks.find(pt => pt.id === t.id);
      if (pTrack) {
        return { ...t, steps: [...pTrack.steps] };
      }
      return t;
    }));

    if (onNotify) onNotify(`Loaded CyberDAW Preset: ${presetKey.replace(/_/g, ' ')}`, 'INFO');
  };

  // Toggle Step Trigger on a Track
  const handleToggleStep = (trackId: string, stepIndex: number) => {
    initAudio();
    setTracks(prev => prev.map(t => {
      if (t.id === trackId) {
        const nextSteps = [...t.steps];
        nextSteps[stepIndex] = !nextSteps[stepIndex];
        // Preview sound on manual arm
        if (nextSteps[stepIndex] && !isPlaying) {
          playTrackSound(t, audioCtxRef.current?.currentTime || 0);
        }
        return { ...t, steps: nextSteps };
      }
      return t;
    }));
  };

  // Toggle Track Mute
  const handleToggleMute = (trackId: string) => {
    setTracks(prev => prev.map(t => t.id === trackId ? { ...t, muted: !t.muted } : t));
  };

  // Toggle Track Solo
  const handleToggleSolo = (trackId: string) => {
    setTracks(prev => prev.map(t => t.id === trackId ? { ...t, soloed: !t.soloed } : t));
  };

  // Update Track Volume
  const handleTrackVolume = (trackId: string, val: number) => {
    setTracks(prev => prev.map(t => t.id === trackId ? { ...t, volume: val } : t));
  };

  // Live Oscilloscope Visualizer Animation
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const renderOscilloscope = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw subtle background grid lines
      ctx.strokeStyle = '#0F172A';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 15) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      if (analyserRef.current && isPlaying) {
        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteTimeDomainData(dataArray);

        // Draw glowing neon waveform
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = '#06B6D4'; // Cyan neon
        ctx.shadowColor = '#06B6D4';
        ctx.shadowBlur = 8;
        ctx.beginPath();

        const sliceWidth = (canvas.width * 1.0) / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * canvas.height) / 2;
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
          x += sliceWidth;
        }

        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
      } else {
        // Flat standby resting laser line
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = '#1E293B';
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
      }

      animId = requestAnimationFrame(renderOscilloscope);
    };

    renderOscilloscope();
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  // Sonify External Live Symphony Events
  useEffect(() => {
    if (externalTriggerEvent && isSonifyingLiveEvents) {
      initAudio();
      // Trigger a special sonification chord
      const now = audioCtxRef.current?.currentTime || 0;
      const targetTrack = tracks[Math.floor(Math.random() * tracks.length)];
      playTrackSound(targetTrack, now);
      if (onNotify) onNotify(`Sonified event from ${externalTriggerEvent.source}`, 'INFO');
    }
  }, [externalTriggerEvent, isSonifyingLiveEvents]);

  const getTrackIcon = (icon: DAWTrack['icon']) => {
    switch (icon) {
      case 'BRAIN': return <Brain className="w-3.5 h-3.5 text-cyan-400" />;
      case 'JUDGE': return <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />;
      case 'TELEMETRY': return <Activity className="w-3.5 h-3.5 text-amber-400" />;
      case 'ARGON': return <Sparkles className="w-3.5 h-3.5 text-blue-400" />;
      case 'DAG': return <Share2 className="w-3.5 h-3.5 text-rose-400" />;
      case 'EXECUTION': return <Zap className="w-3.5 h-3.5 text-purple-400" />;
    }
  };

  return (
    <div className="bg-[#050811] border border-purple-500/40 rounded-2xl overflow-hidden shadow-2xl font-mono text-slate-200 text-xs space-y-4">
      {/* ========================================================================= */}
      {/* 1. MASTER TRANSPORT & CYBERDAW HEADER BAR                                  */}
      {/* ========================================================================= */}
      <div className="p-4 sm:p-5 border-b border-purple-500/20 bg-gradient-to-r from-[#030611] via-[#0F0A1E] to-[#050914] flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 via-indigo-700 to-cyan-500 border border-purple-400/50 flex items-center justify-center shadow-lg shadow-purple-500/20 shrink-0">
            <Music className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-white tracking-wider uppercase font-sans">
                SYMPHONY CYBERDAW &middot; MULTI-AGENT AUDIO WORKSTATION
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-purple-500/20 text-purple-300 border border-purple-500/40">
                16-STEP SONIFICATION ENGINE
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                WEB AUDIO SYNTH
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Conductor Event Bus (:9005) &middot; Real-time acoustic telemetry, neuro-synths, sub-bass gates &amp; hypergraph polyrhythms
            </p>
          </div>
        </div>

        {/* Master Transport Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Preset Selector */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Preset:</span>
            <select
              value={activePreset}
              onChange={(e) => handleLoadPreset(e.target.value)}
              className="bg-slate-900 border border-slate-750 rounded-lg px-2.5 py-1 text-cyan-300 font-mono text-[11px] outline-hidden focus:border-cyan-400"
            >
              <option value="NEON_CONSENSUS_132">Neon Consensus (132 BPM)</option>
              <option value="SOVEREIGN_CYBER_ENCLAVE_118">Sovereign Enclave (118 BPM)</option>
              <option value="HIGH_FREQUENCY_ARBITRAGE_144">HF Arbitrage (144 BPM)</option>
            </select>
          </div>

          {/* Master Transport Buttons */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-750 p-1 rounded-xl">
            <button
              onClick={handleTogglePlay}
              className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all shadow-md ${
                isPlaying
                  ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                  : 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 hover:opacity-90'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
            </button>

            <button
              onClick={handleStop}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg cursor-pointer transition-colors"
              title="Stop &amp; Rewind"
            >
              <Square className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* BPM Tempo Control */}
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-750 px-3 py-1 rounded-xl">
            <Clock className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-[10px] text-slate-400 font-bold">BPM:</span>
            <input
              type="number"
              min={60}
              max={220}
              value={bpm}
              onChange={(e) => setBpm(Number(e.target.value))}
              className="w-12 bg-transparent text-white font-mono font-bold text-xs outline-hidden text-center"
            />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. REAL-TIME OSCILLOSCOPE CANVAS & MASTER BUS CONTROLS                    */}
      {/* ========================================================================= */}
      <div className="px-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Oscilloscope Canvas */}
        <div className="lg:col-span-2 p-3 bg-[#02050E] border border-cyan-500/30 rounded-xl space-y-1.5">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-cyan-400 font-bold flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-cyan-400 animate-pulse' : 'bg-slate-600'}`} />
              <span>REAL-TIME OSCILLOSCOPE &middot; TIME-DOMAIN ACOUSTIC SPECTRUM</span>
            </span>
            <span className="text-slate-400 font-mono">
              Step: <strong className="text-emerald-400">{currentStep + 1} / 16</strong> &middot; 44.1 kHz
            </span>
          </div>

          <div className="h-16 w-full rounded-lg overflow-hidden bg-black/60 relative">
            <canvas
              ref={canvasRef}
              width={640}
              height={64}
              className="w-full h-full block"
            />
          </div>
        </div>

        {/* Master Filter & Volume Knobs */}
        <div className="p-3 bg-[#070D1F] border border-purple-500/30 rounded-xl flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-[10px] border-b border-slate-800 pb-1.5">
            <span className="font-bold text-purple-300 uppercase flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3" />
              <span>Master Cyber Bus</span>
            </span>
            <span className="text-slate-400 font-mono">{(masterVolume * 100).toFixed(0)}% Vol</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-[10px]">
            <div>
              <span className="text-slate-500 block mb-1">Lowpass Cutoff: {filterCutoff}Hz</span>
              <input
                type="range"
                min={200}
                max={16000}
                step={100}
                value={filterCutoff}
                onChange={(e) => setFilterCutoff(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>
            <div>
              <span className="text-slate-500 block mb-1">Master Volume</span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={masterVolume}
                onChange={(e) => setMasterVolume(Number(e.target.value))}
                className="w-full accent-purple-400"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 text-[10px]">
            <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={isSonifyingLiveEvents}
                onChange={(e) => setIsSonifyingLiveEvents(e.target.checked)}
                className="rounded accent-purple-500"
              />
              <span>Sonify Symphony Intents</span>
            </label>
            <span className="text-emerald-400 font-mono">0.0ms Jitter</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. MULTI-TRACK 16-STEP SEQUENCER GRID                                     */}
      {/* ========================================================================= */}
      <div className="px-4 space-y-2 pb-4">
        {/* Step Marker Numbers Header */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-slate-400 uppercase font-bold">
            Orchestra Tracks &middot; 16-Step Sequencing Matrix:
          </span>
          <span className="text-[9px] text-slate-500">
            Click any step to arm/disarm triggers &middot; Bar partitions marked every 4 steps
          </span>
        </div>

        <div className="bg-[#070D1F] border border-slate-800 rounded-xl overflow-hidden p-3 space-y-3">
          {/* 16 Step Header Markers */}
          <div className="flex items-center gap-2">
            <div className="w-56 shrink-0 text-[10px] text-slate-500 font-bold uppercase">
              Agent Track Channel
            </div>

            <div className="grid grid-cols-16 gap-1 flex-1">
              {Array.from({ length: 16 }, (_, i) => (
                <div
                  key={i}
                  className={`text-center text-[9px] font-bold font-mono py-0.5 rounded ${
                    currentStep === i
                      ? 'bg-cyan-500 text-slate-950 font-black'
                      : i % 4 === 0
                      ? 'text-slate-300'
                      : 'text-slate-500'
                  }`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Tracks Rows */}
          {tracks.map((track) => (
            <div key={track.id} className="flex flex-col sm:flex-row sm:items-center gap-2 border-t border-slate-800/80 pt-2.5">
              {/* Track Left Controls */}
              <div className="w-full sm:w-56 shrink-0 flex items-center justify-between pr-2">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded bg-slate-900 border border-slate-800">
                    {getTrackIcon(track.icon)}
                  </div>
                  <div>
                    <span className="font-bold text-white text-xs block leading-tight">{track.name}</span>
                    <span className="text-[9px] text-slate-400 font-mono truncate block max-w-[120px]">
                      {track.role.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                {/* Track Mute / Solo Controls */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleToggleMute(track.id)}
                    className={`w-5 h-5 rounded text-[9px] font-black cursor-pointer transition-colors ${
                      track.muted
                        ? 'bg-red-600 text-white'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                    title="Mute Track"
                  >
                    M
                  </button>
                  <button
                    onClick={() => handleToggleSolo(track.id)}
                    className={`w-5 h-5 rounded text-[9px] font-black cursor-pointer transition-colors ${
                      track.soloed
                        ? 'bg-yellow-500 text-slate-950'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                    title="Solo Track"
                  >
                    S
                  </button>
                </div>
              </div>

              {/* 16 Step Trigger Buttons */}
              <div className="grid grid-cols-16 gap-1 flex-1">
                {track.steps.map((isActive, stepIdx) => {
                  const isCurrent = currentStep === stepIdx && isPlaying;
                  const isBarStart = stepIdx % 4 === 0;

                  return (
                    <button
                      key={stepIdx}
                      onClick={() => handleToggleStep(track.id, stepIdx)}
                      className={`h-9 rounded-md transition-all cursor-pointer relative overflow-hidden flex items-center justify-center ${
                        isActive
                          ? isCurrent
                            ? 'bg-white shadow-lg shadow-cyan-400/80 scale-105 z-10'
                            : `${track.accentBg} shadow-xs font-bold`
                          : isCurrent
                          ? 'bg-slate-700/60'
                          : isBarStart
                          ? 'bg-slate-900 hover:bg-slate-800 border border-slate-750'
                          : 'bg-slate-950 hover:bg-slate-850 border border-slate-850'
                      }`}
                    >
                      {isActive && (
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: track.color }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
