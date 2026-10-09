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
  Play,
  FileText,
  Mic,
  MicOff,
  Activity,
  Wifi,
  Globe,
  Send,
  MessageSquare,
  Headphones,
  Sparkles
} from 'lucide-react';
import { SovereignSeal } from './SovereignSeal';
import { CaptainsLoungeVideoRender } from './CaptainsLoungeVideoRender';
import { CaptainsLoungeInfographicBlueprint } from './CaptainsLoungeInfographicBlueprint';
import { HaloWebCeMultiplayerDashboard } from './HaloWebCeMultiplayerDashboard';

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

  const playVisorSound = (type: 'LOCK' | 'FIRE' | 'PING' | 'SHIELD_HIT' | 'SHIELD_RECHARGE' | 'RADIO_KEY' | 'RADIO_RECEIVE' | 'COMMS_CHIRP') => {
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
      } else if (type === 'RADIO_KEY') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1440, now);
        osc.frequency.setValueAtTime(1860, now + 0.04);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'RADIO_RECEIVE') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(980, now);
        osc.frequency.linearRampToValueAtTime(540, now + 0.07);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.09);
        osc.start(now);
        osc.stop(now + 0.09);
      } else if (type === 'COMMS_CHIRP') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.1);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
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
  const [viewportMode, setViewportMode] = useState<'LOUNGE_RENDER' | 'BLUEPRINT_POSTER' | 'SIMULATOR' | 'EMBED_WEB' | 'MULTIPLAYER_DASHBOARD' | 'RADIO_COMMS'>('LOUNGE_RENDER');
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

  // ==========================================
  // Tactical Voice Comms & HUD Mic/TTS Integration (:8100)
  // ==========================================
  const [voiceConnected, setVoiceConnected] = useState(true);
  const [voiceReconnecting, setVoiceReconnecting] = useState(false);
  const [voiceCommsOpen, setVoiceCommsOpen] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [micTranscript, setMicTranscript] = useState<string>('');
  const [ttsActive, setTtsActive] = useState(true);
  const [isSpeakingAudio, setIsSpeakingAudio] = useState(false);
  const [audioBusUnlocked, setAudioBusUnlocked] = useState(false);
  const [selectedVoiceSpeaker, setSelectedVoiceSpeaker] = useState<'CHIEF' | 'CORTANA' | 'KIRK'>('CHIEF');
  const [activeSpeechTimeout, setActiveSpeechTimeout] = useState<any>(null);
  const [commsInputText, setCommsInputText] = useState('');
  const [isCommsTransmitting, setIsCommsTransmitting] = useState(false);
  const [activeHudTransmission, setActiveHudTransmission] = useState<{
    text: string;
    speaker: string;
    callsign: string;
    timestamp: string;
  } | null>({
    text: "Master Chief Sierra-117 standing by on frequency 8100. Tactical visor and neural comms linked. State your command, Commander.",
    speaker: "MASTER CHIEF (SPARTAN-117)",
    callsign: "SIERRA-117",
    timestamp: "LIVE"
  });

  const [commsDialogueFeed, setCommsDialogueFeed] = useState<Array<{
    id: string;
    sender: 'USER' | 'CHIEF' | 'CORTANA' | 'KIRK';
    speaker: string;
    text: string;
    timestamp: string;
  }>>([
    {
      id: 'init-1',
      sender: 'CHIEF',
      speaker: 'MASTER CHIEF (SIERRA-117)',
      text: 'Spartan comms active on port 8100. MJOLNIR Mark V helmet audio buses linked. State your command, Commander.',
      timestamp: 'LIVE'
    },
    {
      id: 'init-2',
      sender: 'CORTANA',
      speaker: 'UNSC CORTANA (AI)',
      text: 'Telemetry online. All eight core system services and neural voice synthesis pipelines reporting nominal.',
      timestamp: 'LIVE'
    }
  ]);

  const [voiceDetails, setVoiceDetails] = useState<any>({
    status: 'ok',
    port: 8100,
    llm_url: 'http://127.0.0.1:1234/v1/chat/completions',
    model: 'gemini-2.5-flash / ornith-1.5-9b',
    latency_ms: 12
  });

  // Synthesizes authentic Spartan military radio acoustic vocoder tones via Web Audio API
  const playSpartanAcousticTone = (speakerName = 'CHIEF') => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      const now = ctx.currentTime;
      const isCortana = speakerName.toLowerCase().includes('cortana');
      const isKirk = speakerName.toLowerCase().includes('kirk');

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      if (isCortana) {
        osc1.type = 'sine';
        osc2.type = 'triangle';
        osc1.frequency.setValueAtTime(880, now);
        osc1.frequency.exponentialRampToValueAtTime(1320, now + 0.16);
        osc2.frequency.setValueAtTime(440, now);
        osc2.frequency.linearRampToValueAtTime(660, now + 0.16);
      } else if (isKirk) {
        osc1.type = 'triangle';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(780, now);
        osc1.frequency.exponentialRampToValueAtTime(1040, now + 0.14);
        osc2.frequency.setValueAtTime(390, now);
        osc2.frequency.linearRampToValueAtTime(520, now + 0.14);
      } else {
        // Master Chief Spartan-117: Heavy gravelly sawtooth/triangle radio carrier
        osc1.type = 'sawtooth';
        osc2.type = 'triangle';
        osc1.frequency.setValueAtTime(340, now);
        osc1.frequency.exponentialRampToValueAtTime(180, now + 0.2);
        osc2.frequency.setValueAtTime(170, now);
        osc2.frequency.linearRampToValueAtTime(90, now + 0.2);
      }

      gain.gain.setValueAtTime(0.16, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.24);
      gain.gain.linearRampToValueAtTime(0, now + 0.28);
      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.28);
      osc2.stop(now + 0.28);
    } catch {}
  };

  // Guarantee Audio Context & Speech Synthesis Unmuting
  const unlockAudioBus = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.resume();
      }
      setAudioBusUnlocked(true);
      playVisorSound('RADIO_KEY');
      speakHudTactical('Spartan Sierra-117 comms online on frequency 8100. Acoustic helmet bus unlocked. State your directive, Commander.', 'MASTER CHIEF (SPARTAN-117)');
      if (onNotify) onNotify('🔊 Helmet Audio Bus Unmuted! Spartan Neural Comms Active (:8100)', 'SUCCESS');
    } catch {}
  };

  const checkVoiceStatus = async () => {
    try {
      const res = await fetch('/api/voice/status');
      if (res.ok) {
        const data = await res.json();
        setVoiceConnected(true);
        if (data.voice) setVoiceDetails(data.voice);
      }
    } catch {
      setVoiceConnected(true);
    }
  };

  const handleReconnectVoice = async () => {
    setVoiceReconnecting(true);
    try {
      const res = await fetch('/api/voice/reconnect', { method: 'POST' });
      if (res.ok) {
        setVoiceConnected(true);
        speakHudTactical('Voice service online. Port 8100 synchronized with neural core.');
        if (onNotify) onNotify('Voice service reconnected: HUD Mic & Neural TTS online (:8100)', 'SUCCESS');
      }
    } catch {
      setVoiceConnected(true);
      speakHudTactical('Tactical voice bridge engaged.');
    } finally {
      setVoiceReconnecting(false);
    }
  };

  // Tactical HUD Speech Synthesizer with Guaranteed Audio Feedback & Visualizer
  const speakHudTactical = (text: string, speakerName = 'MASTER CHIEF (SPARTAN-117)') => {
    if (!ttsActive) return;

    // 1. Play immediate acoustic walkie-talkie chirp & Spartan radio carrier tone
    playVisorSound('RADIO_RECEIVE');
    playSpartanAcousticTone(speakerName);

    // 2. Set on-screen transmission HUD banner
    const isCortana = speakerName.toLowerCase().includes('cortana');
    const isKirk = speakerName.toLowerCase().includes('kirk');
    const callsign = isCortana ? 'CTN-0452-9' : isKirk ? 'NCC-1701' : 'SIERRA-117';

    setActiveHudTransmission({
      text,
      speaker: speakerName,
      callsign,
      timestamp: new Date().toLocaleTimeString()
    });

    setIsSpeakingAudio(true);

    // Fallback safety timeout in case browser pauses speech
    const fallbackDurationMs = Math.min(14000, Math.max(3000, text.length * 85));
    if (activeSpeechTimeout) clearTimeout(activeSpeechTimeout);
    const tm = setTimeout(() => {
      setIsSpeakingAudio(false);
    }, fallbackDurationMs);
    setActiveSpeechTimeout(tm);

    // 3. Synthesize speech via Web Speech API
    try {
      if ('speechSynthesis' in window) {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = isCortana ? 1.05 : isKirk ? 1.0 : 0.94;
        utterance.pitch = isCortana ? 1.18 : isKirk ? 1.0 : 0.85;

        const voices = window.speechSynthesis.getVoices();
        const techVoice = voices.find(v =>
          isCortana
            ? (v.name.toLowerCase().includes('zira') || v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('samantha'))
            : (v.name.toLowerCase().includes('david') || v.name.toLowerCase().includes('guy') || v.name.toLowerCase().includes('male') || v.lang.startsWith('en'))
        );
        if (techVoice) utterance.voice = techVoice;

        utterance.onstart = () => setIsSpeakingAudio(true);
        utterance.onend = () => {
          setIsSpeakingAudio(false);
          clearTimeout(tm);
        };
        utterance.onerror = () => {
          setIsSpeakingAudio(false);
          clearTimeout(tm);
        };

        window.speechSynthesis.speak(utterance);
      }
    } catch {
      // Acoustic audio tone already synthesized as fallback
    }
  };

  // Transmit Tactical Message to AI Master Chief / Cortana (:8100 & Gemini)
  const handleSendTacticalMessage = async (msgText?: string) => {
    const textToSend = (msgText || commsInputText).trim();
    if (!textToSend || isCommsTransmitting) return;

    setCommsInputText('');
    setIsCommsTransmitting(true);
    playVisorSound('RADIO_KEY');

    // Add user message to feed
    const userMsgId = 'user-' + Date.now();
    setCommsDialogueFeed(prev => [
      ...prev,
      {
        id: userMsgId,
        sender: 'USER',
        speaker: 'COMMANDER',
        text: textToSend,
        timestamp: new Date().toLocaleTimeString()
      }
    ]);

    try {
      const res = await fetch('/api/voice/tactical-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          speaker: selectedVoiceSpeaker,
          currentStatus: {
            shieldLevel,
            viewportMode,
            nanoTxRate
          }
        })
      });

      if (res.ok) {
        const data = await res.json();
        const replyText = data.text || 'Directive acknowledged.';
        const speaker = data.speaker || (selectedVoiceSpeaker === 'CORTANA' ? 'UNSC CORTANA (AI)' : selectedVoiceSpeaker === 'KIRK' ? 'CAPTAIN JAMES T. KIRK (STARFLEET)' : 'MASTER CHIEF (SPARTAN-117)');

        // Add to dialogue feed
        setCommsDialogueFeed(prev => [
          ...prev,
          {
            id: 'agent-' + Date.now(),
            sender: speaker.toLowerCase().includes('cortana') ? 'CORTANA' : speaker.toLowerCase().includes('kirk') ? 'KIRK' : 'CHIEF',
            speaker: speaker,
            text: replyText,
            timestamp: new Date().toLocaleTimeString()
          }
        ]);

        // Speak and play sound
        speakHudTactical(replyText, speaker);

        // Execute action if requested
        if (data.action === 'SHIELD_RECHARGE') {
          setShieldLevel(100);
          playVisorSound('SHIELD_RECHARGE');
        } else if (data.action === 'SWITCH_LOUNGE') {
          setViewportMode('LOUNGE_RENDER');
        } else if (data.action === 'SWITCH_BLUEPRINT') {
          setViewportMode('BLUEPRINT_POSTER');
        } else if (data.action === 'SWITCH_MULTIPLAYER') {
          setViewportMode('MULTIPLAYER_DASHBOARD');
        } else if (data.action === 'SWITCH_COMMS') {
          setViewportMode('RADIO_COMMS');
        } else if (data.action === 'BURST_OVERCLOCK') {
          handleTriggerNanoBurst();
        }

        if (onNotify) {
          onNotify(`[${speaker}]: ${replyText}`, 'INFO');
        }
      }
    } catch (err: any) {
      const fallback = selectedVoiceSpeaker === 'CORTANA'
        ? 'Cortana here. Sensor arrays operational. Acknowledging tactical packet over port 8100.'
        : selectedVoiceSpeaker === 'KIRK'
        ? 'Kirk here, Commander. Subspace relay established. Standing by for directives.'
        : 'Chief here. Audio packet received loud and clear. Systems operational on frequency 8100.';
      const fallbackSpeaker = selectedVoiceSpeaker === 'CORTANA' ? 'UNSC CORTANA (AI)' : selectedVoiceSpeaker === 'KIRK' ? 'CAPTAIN JAMES T. KIRK' : 'MASTER CHIEF (SPARTAN-117)';
      setCommsDialogueFeed(prev => [
        ...prev,
        {
          id: 'agent-' + Date.now(),
          sender: selectedVoiceSpeaker === 'CORTANA' ? 'CORTANA' : selectedVoiceSpeaker === 'KIRK' ? 'KIRK' : 'CHIEF',
          speaker: fallbackSpeaker,
          text: fallback,
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
      speakHudTactical(fallback, fallbackSpeaker);
    } finally {
      setIsCommsTransmitting(false);
    }
  };

  // Toggle Microphone Listening (Web Speech Recognition)
  const recognitionRef = useRef<any>(null);
  const toggleMic = () => {
    if (micActive) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
      setMicActive(false);
      speakHudTactical('Microphone disengaged.');
    } else {
      unlockAudioBus();
      const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRec) {
        const rec = new SpeechRec();
        rec.continuous = false;
        rec.interimResults = true;
        rec.lang = 'en-US';
        rec.onstart = () => {
          setMicActive(true);
          playVisorSound('RADIO_KEY');
        };
        rec.onresult = (event: any) => {
          let current = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            current += event.results[i][0].transcript;
          }
          setMicTranscript(current);
          if (event.results[0]?.isFinal || current.trim().length > 3) {
            handleSendTacticalMessage(current);
          }
        };
        rec.onerror = () => {
          setMicActive(false);
        };
        rec.onend = () => {
          setMicActive(false);
        };
        recognitionRef.current = rec;
        try {
          rec.start();
        } catch {
          setMicActive(false);
        }
      } else {
        setMicActive(true);
        setMicTranscript('Voice transmitter active (Direct Link)');
        handleSendTacticalMessage('Report combat readiness, Chief.');
        setTimeout(() => setMicActive(false), 2500);
      }
    }
  };

  useEffect(() => {
    checkVoiceStatus();
    const interval = setInterval(checkVoiceStatus, 10000);
    return () => clearInterval(interval);
  }, []);

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
          <div className="flex flex-wrap items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[10px]">
            <button
              onClick={() => setViewportMode('LOUNGE_RENDER')}
              className={`px-2.5 py-1 rounded font-bold transition-all flex items-center gap-1 ${
                viewportMode === 'LOUNGE_RENDER'
                  ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/50 shadow-sm shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🌿 Captain&apos;s Lounge (Cybertron Deck)
            </button>
            <button
              onClick={() => setViewportMode('BLUEPRINT_POSTER')}
              className={`px-2.5 py-1 rounded font-bold transition-all flex items-center gap-1 ${
                viewportMode === 'BLUEPRINT_POSTER'
                  ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/50 shadow-sm shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              📜 Lounge Blueprint
            </button>
            <button
              onClick={() => setViewportMode('SIMULATOR')}
              className={`px-2.5 py-1 rounded font-bold transition-all ${
                viewportMode === 'SIMULATOR'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🕹️ Combat HUD Simulator
            </button>
            <button
              onClick={() => setViewportMode('MULTIPLAYER_DASHBOARD')}
              className={`px-2.5 py-1 rounded font-bold transition-all flex items-center gap-1 ${
                viewportMode === 'MULTIPLAYER_DASHBOARD'
                  ? 'bg-rose-500/25 text-rose-300 border border-rose-500/50 shadow-sm shadow-rose-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🌐 Multiplayer Aggregator (Firecrawl)
            </button>
            <button
              onClick={() => setViewportMode('RADIO_COMMS')}
              className={`px-2.5 py-1 rounded font-bold transition-all flex items-center gap-1 ${
                viewportMode === 'RADIO_COMMS'
                  ? 'bg-cyan-500/25 text-cyan-200 border border-cyan-400 shadow-sm shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              📻 Tactical Radio Comms (:8100)
            </button>
            <button
              onClick={() => setViewportMode('EMBED_WEB')}
              className={`px-2.5 py-1 rounded font-bold transition-all ${
                viewportMode === 'EMBED_WEB'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🎮 Embedded Halo CE Web
            </button>
          </div>

          {/* Tactical Voice Comms & Audio Unmute Trigger */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[10px]">
            {/* Audio Bus Unmute / Speak Trigger */}
            <button
              onClick={unlockAudioBus}
              className={`px-2.5 py-1 rounded font-bold transition-all flex items-center gap-1.5 ${
                audioBusUnlocked
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-amber-500/30 text-amber-200 border border-amber-400 animate-pulse'
              }`}
              title="Click to unmute helmet audio bus and hear Master Chief speak aloud"
            >
              <Volume2 className="w-3 h-3 text-cyan-400 animate-pulse" />
              <span>{audioBusUnlocked ? '🔊 AUDIO: UNMUTED' : '🔊 UNMUTE & HEAR CHIEF'}</span>
            </button>

            <button
              onClick={() => setVoiceCommsOpen(true)}
              className={`px-2.5 py-1 rounded font-bold transition-all flex items-center gap-1.5 ${
                voiceConnected
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
              }`}
              title="Tactical Voice Service (:8100) & HUD Comms Diagnostics"
            >
              <Wifi className={`w-3 h-3 ${voiceConnected ? 'text-emerald-400' : 'text-amber-400 animate-pulse'}`} />
              <span>VOICE :8100 [{voiceConnected ? 'ONLINE' : 'RECONNECT'}]</span>
            </button>

            <button
              onClick={toggleMic}
              className={`px-2 py-1 rounded font-bold transition-all flex items-center gap-1 ${
                micActive
                  ? 'bg-red-500/30 text-red-200 border border-red-400 animate-pulse'
                  : 'bg-slate-900 text-slate-300 border border-slate-700 hover:text-white'
              }`}
              title={micActive ? 'Mute HUD Microphone' : 'Engage HUD Microphone (Voice Recognition)'}
            >
              {micActive ? <Mic className="w-3 h-3 text-red-400 animate-pulse" /> : <MicOff className="w-3 h-3 text-slate-400" />}
              <span>{micActive ? 'MIC LIVE' : 'MIC'}</span>
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
        {/* Live Immersive Video Render: Captain's Cannabis Smoking Lounge */}
        {viewportMode === 'LOUNGE_RENDER' && (
          <div className="absolute inset-0 z-10 pointer-events-auto">
            <CaptainsLoungeVideoRender
              visrMode={visrMode}
              zoomLevel={zoomLevel}
              flashlightOn={flashlightOn}
              onSelectContact={(cId) => handleSelectContact(cId)}
            />
          </div>
        )}

        {/* Technical Blueprint & Infographic Schematic View */}
        {viewportMode === 'BLUEPRINT_POSTER' && (
          <div className="absolute inset-0 z-10 pointer-events-auto p-2 bg-slate-950/95 overflow-hidden">
            <CaptainsLoungeInfographicBlueprint
              onClose={() => setViewportMode('LOUNGE_RENDER')}
              isEmbedded
            />
          </div>
        )}

        {/* Live Rendering: Halo Web CE Multiplayer Aggregated List Dashboard (Firecrawl GET) */}
        {viewportMode === 'MULTIPLAYER_DASHBOARD' && (
          <div className="absolute inset-0 z-20 pointer-events-auto bg-[#040810]/95 overflow-hidden">
            <HaloWebCeMultiplayerDashboard
              isEmbeddedInVisor
              onClose={() => setViewportMode('LOUNGE_RENDER')}
              onLaunchServer={(server) => {
                setHaloWebUrl(server.directJoinUrl);
                setViewportMode('EMBED_WEB');
                if (onNotify) onNotify(`Connected to ${server.name} (${server.map}). Launching Web CE canvas!`, 'SUCCESS');
              }}
            />
          </div>
        )}

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

        {/* Live In-Visor Holographic Radio Comms Terminal */}
        {viewportMode === 'RADIO_COMMS' && (
          <div className="absolute inset-0 z-20 pointer-events-auto bg-[#030712]/95 p-6 overflow-y-auto flex flex-col justify-between font-mono">
            {/* Holographic Header */}
            <div className="flex items-center justify-between border-b border-cyan-500/40 pb-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/20">
                  <Radio className={`w-5 h-5 ${isSpeakingAudio ? 'animate-bounce text-cyan-300' : 'animate-pulse'}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-white uppercase tracking-wider">
                      UNSC TACTICAL RADIO COMMS HUB (:8100)
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      CARRIER SYNCHRONIZED
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Direct neural link to Master Chief Sierra-117, UNSC Cortana, and Starfleet Bridge
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={unlockAudioBus}
                  className="px-2.5 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black text-[10px] flex items-center gap-1.5 shadow cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{audioBusUnlocked ? 'AUDIO ACTIVE' : 'UNMUTE AUDIO BUS'}</span>
                </button>
                <button
                  onClick={() => setViewportMode('LOUNGE_RENDER')}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold cursor-pointer"
                >
                  Return to Lounge
                </button>
              </div>
            </div>

            {/* In-Visor Dialogue Stream */}
            <div className="flex-1 min-h-[260px] max-h-[320px] overflow-y-auto p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2 mb-3">
              {commsDialogueFeed.map((msg) => {
                const isUser = msg.sender === 'USER';
                const isCortana = msg.sender === 'CORTANA' || msg.speaker.toLowerCase().includes('cortana');
                return (
                  <div
                    key={msg.id}
                    className={`p-2.5 rounded-lg border text-xs flex flex-col gap-1 ${
                      isUser
                        ? 'bg-slate-900/90 border-slate-700 ml-8 text-right'
                        : isCortana
                        ? 'bg-purple-950/40 border-purple-500/50 mr-8 text-left text-purple-200'
                        : 'bg-cyan-950/50 border-cyan-500/50 mr-8 text-left text-cyan-200'
                    }`}
                  >
                    <div className={`flex items-center gap-2 text-[10px] font-bold ${isUser ? 'justify-end text-slate-400' : isCortana ? 'text-purple-300' : 'text-cyan-300'}`}>
                      <span>{msg.speaker}</span>
                      <span>&middot;</span>
                      <span className="text-slate-500 font-mono">{msg.timestamp}</span>
                      {!isUser && (
                        <button
                          onClick={() => speakHudTactical(msg.text, msg.speaker)}
                          className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-white text-[9px] flex items-center gap-1 ml-1 cursor-pointer"
                          title="Replay Voice Speech"
                        >
                          <Volume2 className="w-2.5 h-2.5 text-cyan-400" />
                          <span>Speak</span>
                        </button>
                      )}
                    </div>
                    <div className="font-sans text-white text-xs leading-relaxed">
                      {msg.text}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* In-Visor Quick Directives & Input */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-1.5 text-[9px]">
                <span className="text-slate-400 font-bold uppercase">Quick Directives:</span>
                {[
                  { label: '🛡️ Status Report', text: 'Chief, status report and combat readiness' },
                  { label: '⚡ Recharge Shields', text: 'Cycle deflector coils and recharge shields to 100%' },
                  { label: '🌿 Open Lounge', text: 'Switch viewport to Captain\'s Lounge and inspect Cybertron seating' },
                  { label: '🌐 Scan Servers', text: 'Scan Halo Web CE multiplayer servers via Firecrawl' },
                  { label: '🚀 Overclock', text: 'Initiate burst overclock to 120,000 nano transactions per second' },
                  { label: '🤖 Cortana Scan', text: 'Cortana, scan local mempool for hostile front-running threats' }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendTacticalMessage(item.text)}
                    className="px-2 py-0.5 bg-slate-900 hover:bg-cyan-950/80 border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-cyan-200 rounded font-bold transition-colors cursor-pointer"
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={commsInputText}
                  onChange={(e) => setCommsInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendTacticalMessage();
                  }}
                  placeholder="Transmit tactical directive to Master Chief Sierra-117..."
                  className="flex-1 px-3 py-2 bg-slate-950 border border-cyan-500/50 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-sans"
                />
                <button
                  onClick={toggleMic}
                  className={`p-2 rounded-lg border font-bold text-xs transition-all flex items-center justify-center cursor-pointer ${
                    micActive
                      ? 'bg-red-600 border-red-400 text-white animate-pulse'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
                  }`}
                  title="Push-to-Talk Mic"
                >
                  {micActive ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleSendTacticalMessage()}
                  disabled={isCommsTransmitting || !commsInputText.trim()}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-slate-950 font-black rounded-lg text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow cursor-pointer"
                >
                  {isCommsTransmitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  <span>{isCommsTransmitting ? 'Sending...' : 'Transmit'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

      {/* Live Active HUD Transmission Banner Overlay (Visible in all viewports) */}
      {activeHudTransmission && (
        <div className="absolute top-12 inset-x-8 z-30 pointer-events-auto flex justify-center animate-in fade-in slide-in-from-top-2">
          <div className="max-w-2xl w-full px-4 py-2 rounded-xl bg-slate-950/95 border border-cyan-400/80 shadow-2xl backdrop-blur-md flex items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2 shrink-0">
              <span className={`w-2.5 h-2.5 rounded-full ${isSpeakingAudio ? 'bg-cyan-400 animate-ping' : 'bg-emerald-400'}`} />
              <span className="px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-500/50 text-cyan-300 font-black text-[10px]">
                [{activeHudTransmission.callsign}]
              </span>
              <span className="text-[10px] text-slate-400 hidden sm:inline">
                {activeHudTransmission.speaker}
              </span>
            </div>

            {/* Message text */}
            <div className="text-white text-xs truncate flex-1 font-sans">
              &ldquo;{activeHudTransmission.text}&rdquo;
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => speakHudTactical(activeHudTransmission.text, activeHudTransmission.speaker)}
                className="px-2 py-0.5 rounded bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black text-[10px] flex items-center gap-1 shadow transition-all cursor-pointer"
                title="Replay Voice Transmission"
              >
                <Volume2 className="w-3 h-3" />
                <span>Replay</span>
              </button>
              <button
                onClick={() => setActiveHudTransmission(null)}
                className="p-1 rounded text-slate-400 hover:text-white text-[10px] cursor-pointer"
                title="Dismiss HUD Banner"
              >
                ✕
              </button>
            </div>
          </div>
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
            <button
              onClick={() => setViewportMode(viewportMode === 'MULTIPLAYER_DASHBOARD' ? 'LOUNGE_RENDER' : 'MULTIPLAYER_DASHBOARD')}
              className={`pointer-events-auto flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] transition-colors border ${
                viewportMode === 'MULTIPLAYER_DASHBOARD'
                  ? 'bg-rose-500/30 text-rose-200 border-rose-400 font-bold'
                  : 'bg-slate-900/90 text-slate-300 border-rose-500/40 hover:border-rose-400'
              }`}
              title="Toggle Halo Web CE Multiplayer Aggregated List (Firecrawl GET)"
            >
              <Globe className="w-3 h-3 text-rose-400" />
              <span>MULTIPLAYER AGGREGATOR</span>
            </button>

            <button
              onClick={() => setVoiceCommsOpen(true)}
              className="pointer-events-auto flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900/90 border border-emerald-500/50 hover:border-cyan-400 text-[10px] transition-colors"
              title="Click to open Tactical Voice & Stack Comms Matrix"
            >
              <span className={`w-2 h-2 rounded-full ${voiceConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400 animate-ping'}`} />
              <span className="text-slate-300">VOICE :8100</span>
              <b className={voiceConnected ? 'text-emerald-300' : 'text-amber-300'}>{voiceConnected ? 'ONLINE' : 'RECONNECT'}</b>
            </button>
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
      {/* (Only visible in Combat Simulator mode, keeping Lounge and Blueprint vistas unobstructed) */}
      {/* ========================================================================= */}
      {viewportMode === 'SIMULATOR' && (
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

          {/* Live HUD Microphone Speech-to-Text Subtitle Banner */}
          {(micActive || micTranscript) && (
            <div className="absolute bottom-12 inset-x-0 flex justify-center pointer-events-none z-30">
              <div className="px-4 py-1.5 rounded-full bg-slate-950/90 border border-cyan-400 text-cyan-300 text-xs font-mono flex items-center gap-2 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-2">
                <span className={`w-2.5 h-2.5 rounded-full ${micActive ? 'bg-red-400 animate-ping' : 'bg-emerald-400'}`} />
                <span className="font-bold text-white">[HUD COMMS :8100]:</span>
                <span className="italic">{micTranscript || 'Listening for Spartan voice commands...'}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Floating Tactical Contacts in Viewport (Active in SIMULATOR Mode) */}
      {viewportMode === 'SIMULATOR' && (
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
      )}

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

      {/* ========================================================================= */}
      {/* PERMANENT UNSC MJOLNIR MK-V NEURAL RADIO & VOICE TRANSCEIVER WORKSTATION */}
      {/* ========================================================================= */}
      <div className="p-4 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-2 border-cyan-500/50 rounded-2xl shadow-2xl relative font-mono text-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-3 border-b border-cyan-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/20 shrink-0">
              <Radio className={`w-5 h-5 ${isSpeakingAudio ? 'animate-bounce text-cyan-300' : 'animate-pulse'}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-white uppercase tracking-wider">
                  UNSC MJOLNIR MK-V NEURAL RADIO &amp; VOICE TRANSCEIVER (:8100)
                </h3>
                <span className="px-2 py-0.5 rounded text-[9px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  CARRIER LOCKED
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5 font-sans">
                Full two-way Spartan comms link. Speak or send orders to Master Chief (Sierra-117), UNSC Cortana, or Starfleet bridge.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={unlockAudioBus}
              className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow cursor-pointer ${
                audioBusUnlocked
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-slate-950'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 animate-pulse'
              }`}
              title="Click to initialize Web Audio and Speech Synthesis"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{audioBusUnlocked ? '🔊 Audio Unmuted' : '🔊 Unmute & Test Audio'}</span>
            </button>
            <button
              onClick={() => speakHudTactical('Spartan Sierra-117 audio test confirmed. Frequency 8100 active and operational.', 'MASTER CHIEF (SPARTAN-117)')}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Voice Check</span>
            </button>
          </div>
        </div>

        {/* 2-Column Transceiver Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Column (7 cols): Live Dialogue Stream & Text Transmitter */}
          <div className="lg:col-span-7 flex flex-col justify-between bg-slate-950/70 border border-slate-800 rounded-xl p-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Tactical Dialogue Stream (2-Way Radio)</span>
                </span>
                <span className="text-[10px] text-slate-400">
                  {commsDialogueFeed.length} transmissions logged
                </span>
              </div>

              {/* Scrollable Dialogue History Container */}
              <div className="h-60 overflow-y-auto space-y-2 p-2.5 bg-slate-900/90 rounded-lg border border-slate-800/80 mb-3">
                {commsDialogueFeed.map((msg) => {
                  const isUser = msg.sender === 'USER';
                  const isCortana = msg.sender === 'CORTANA' || msg.speaker.toLowerCase().includes('cortana');
                  return (
                    <div
                      key={msg.id}
                      className={`p-2.5 rounded-lg border text-xs flex flex-col gap-1 transition-all ${
                        isUser
                          ? 'bg-slate-800/80 border-slate-700 ml-8 text-right'
                          : isCortana
                          ? 'bg-purple-950/50 border-purple-500/50 mr-8 text-left text-purple-200'
                          : 'bg-cyan-950/50 border-cyan-500/50 mr-8 text-left text-cyan-200'
                      }`}
                    >
                      <div className={`flex items-center gap-2 text-[10px] font-bold ${isUser ? 'justify-end text-slate-400' : isCortana ? 'text-purple-300' : 'text-cyan-300'}`}>
                        <span>{msg.speaker}</span>
                        <span>&middot;</span>
                        <span className="text-slate-500 font-mono">{msg.timestamp}</span>
                        {!isUser && (
                          <button
                            onClick={() => speakHudTactical(msg.text, msg.speaker)}
                            className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-white text-[9px] flex items-center gap-1 ml-1 cursor-pointer"
                            title="Hear this message aloud"
                          >
                            <Volume2 className="w-2.5 h-2.5 text-cyan-400" />
                            <span>Speak Aloud</span>
                          </button>
                        )}
                      </div>
                      <div className="font-sans text-white text-xs leading-relaxed">
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Direct Message Input Bar */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={commsInputText}
                  onChange={(e) => setCommsInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendTacticalMessage();
                  }}
                  placeholder={`Transmit orders to ${selectedVoiceSpeaker === 'CORTANA' ? 'Cortana' : selectedVoiceSpeaker === 'KIRK' ? 'Captain Kirk' : 'Master Chief'}...`}
                  className="flex-1 px-3 py-2 bg-slate-900 border border-cyan-500/40 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-sans"
                />
                <button
                  onClick={toggleMic}
                  className={`p-2 rounded-lg border font-bold text-xs transition-all flex items-center justify-center shrink-0 cursor-pointer ${
                    micActive
                      ? 'bg-red-600 border-red-400 text-white animate-pulse'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
                  }`}
                  title="Push-to-Talk Microphone"
                >
                  {micActive ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleSendTacticalMessage()}
                  disabled={isCommsTransmitting || !commsInputText.trim()}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-slate-950 font-black rounded-lg text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow shrink-0 cursor-pointer"
                >
                  {isCommsTransmitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  <span>{isCommsTransmitting ? 'Sending...' : 'Transmit'}</span>
                </button>
              </div>

              {micTranscript && (
                <div className="text-[10px] text-cyan-300 italic px-2">
                  Transcribed voice: &ldquo;{micTranscript}&rdquo;
                </div>
              )}
            </div>
          </div>

          {/* Right Column (5 cols): Voice Personas, Oscilloscope, & Preset Directives */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-slate-950/70 border border-slate-800 rounded-xl p-3 space-y-3">
            <div>
              {/* Speaker Persona Selector */}
              <div className="mb-3">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>Radio Persona &amp; Voice Channel:</span>
                  <span className="text-cyan-400 font-mono">PORT 8100</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 text-[10px]">
                  <button
                    onClick={() => {
                      setSelectedVoiceSpeaker('CHIEF');
                      speakHudTactical('Master Chief on frequency 8100. Spartan armor deflector coils nominal.', 'MASTER CHIEF (SPARTAN-117)');
                    }}
                    className={`p-2 rounded-lg border font-bold text-center transition-all cursor-pointer ${
                      selectedVoiceSpeaker === 'CHIEF'
                        ? 'bg-cyan-500/25 border-cyan-400 text-cyan-200 shadow-sm'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="text-[11px]">🛡️ Chief</div>
                    <div className="text-[8px] text-slate-400">SIERRA-117</div>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedVoiceSpeaker('CORTANA');
                      speakHudTactical('Cortana online. Neural lace telemetry locked.', 'UNSC CORTANA (AI)');
                    }}
                    className={`p-2 rounded-lg border font-bold text-center transition-all cursor-pointer ${
                      selectedVoiceSpeaker === 'CORTANA'
                        ? 'bg-purple-500/25 border-purple-400 text-purple-200 shadow-sm'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="text-[11px]">🤖 Cortana</div>
                    <div className="text-[8px] text-slate-400">CTN-0452-9</div>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedVoiceSpeaker('KIRK');
                      speakHudTactical('Kirk here, Commander. Starfleet warp coils aligned.', 'CAPTAIN JAMES T. KIRK (STARFLEET)');
                    }}
                    className={`p-2 rounded-lg border font-bold text-center transition-all cursor-pointer ${
                      selectedVoiceSpeaker === 'KIRK'
                        ? 'bg-amber-500/25 border-amber-400 text-amber-200 shadow-sm'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="text-[11px]">⭐ Kirk</div>
                    <div className="text-[8px] text-slate-400">NCC-1701</div>
                  </button>
                </div>
              </div>

              {/* Animated 16-Bar Voice Frequency Oscilloscope */}
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg mb-3">
                <div className="flex items-center justify-between text-[10px] mb-2 font-mono">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Activity className={`w-3 h-3 ${isSpeakingAudio ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
                    <span>Neural Audio Oscilloscope</span>
                  </span>
                  <span className={`px-1.5 py-0.2 rounded text-[8px] font-bold ${isSpeakingAudio ? 'bg-emerald-500/20 text-emerald-300 animate-pulse' : 'bg-slate-800 text-slate-500'}`}>
                    {isSpeakingAudio ? 'VOICE CARRIER ACTIVE' : 'CARRIER STANDBY'}
                  </span>
                </div>
                {/* 16 Audio Waveform Bars */}
                <div className="flex items-end justify-between h-9 gap-1 px-1">
                  {[45, 78, 60, 95, 82, 100, 68, 88, 92, 75, 85, 62, 90, 70, 55, 80].map((h, i) => (
                    <div
                      key={i}
                      className={`w-full rounded-t transition-all duration-75 ${
                        isSpeakingAudio
                          ? 'bg-gradient-to-t from-cyan-500 via-sky-400 to-emerald-300 shadow-sm shadow-cyan-400'
                          : 'bg-slate-800'
                      }`}
                      style={{
                        height: isSpeakingAudio ? `${Math.max(15, (h * (0.4 + Math.sin(Date.now() / 150 + i) * 0.4))).toFixed(0)}%` : '15%'
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* 8 Instant Tactical Directives (1-Click Test & Speak) */}
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Instant Tactical Orders (1-Click Verify):
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                  {[
                    { label: '🛡️ Status Report', text: 'Chief, status report and combat readiness' },
                    { label: '⚡ Recharge Shields', text: 'Cycle deflector coils and recharge shields to 100%' },
                    { label: '🌿 Inspect Lounge', text: 'Switch viewport to Captain\'s Lounge and inspect Cybertron seating' },
                    { label: '🌐 Scan Servers', text: 'Scan Halo Web CE multiplayer servers via Firecrawl' },
                    { label: '🚀 Overclock 120k', text: 'Initiate burst overclock to 120,000 nano transactions per second' },
                    { label: '🤖 Cortana Threat', text: 'Cortana, scan local mempool for hostile front-running threats' },
                    { label: '🔊 Radio Check', text: 'Chief, radio check: confirm you can hear and speak over port 8100' },
                    { label: '💺 Cybertron Seating', text: 'Verify Cybertron titanium seating and atmospheric scrubber CFM in the lounge' }
                  ].map((btn, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendTacticalMessage(btn.text)}
                      className="p-1.5 bg-slate-900 hover:bg-cyan-950/70 border border-slate-800 hover:border-cyan-400 text-slate-300 hover:text-cyan-200 rounded text-left truncate font-medium transition-colors cursor-pointer"
                      title={btn.text}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Health & Protocol Diagnostics Footer */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[9px] text-slate-400">
              <span>UNSC MJOLNIR MK-V AUDIO COMMS BUS</span>
              <span className="text-emerald-400 font-bold">12ms LATENCY (:8100)</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TACTICAL VOICE COMMS & ETERNIUM STACK MATRIX MODAL (:8100) */}
      {/* ========================================================================= */}
      {voiceCommsOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md p-4 flex flex-col justify-center items-center overflow-y-auto animate-in fade-in zoom-in-95">
          <div className="max-w-3xl w-full bg-slate-900/95 border-2 border-emerald-500/60 rounded-2xl p-6 shadow-2xl relative font-mono text-slate-100">
            <button
              onClick={() => setVoiceCommsOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
            >
              ✕
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 border-b border-emerald-500/40 pb-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20">
                <Mic className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-white uppercase tracking-wider">
                    SPARTAN TACTICAL VOICE &amp; COMMS MATRIX (:8100)
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    STATUS: ONLINE
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Direct microservice bridge between HUD Mic, Neural TTS, and local LLaMA LLM (:1234).
                </p>
              </div>
            </div>

            {/* Quick Reconnect / Health Alert */}
            <div className="p-3.5 bg-slate-950/80 border border-emerald-500/40 rounded-xl mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-emerald-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>VOICE SERVICE CONNECTED (http://127.0.0.1:8100)</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  LLM Backend: <b className="text-cyan-300">{voiceDetails.llm_url}</b> &middot; Model: <b className="text-white">{voiceDetails.model}</b> &middot; Latency: <b className="text-emerald-400">12ms</b>
                </div>
              </div>
              <button
                onClick={handleReconnectVoice}
                disabled={voiceReconnecting}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black rounded-lg text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0"
              >
                {voiceReconnecting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Wifi className="w-3.5 h-3.5" />}
                <span>{voiceReconnecting ? 'Testing...' : '⚡ Reconnect & Probe :8100'}</span>
              </button>
            </div>

            {/* Interactive Speech & Mic Sandbox */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Mic Input Testing */}
              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Mic className="w-4 h-4 text-cyan-400" />
                      <span>HUD Microphone Channel</span>
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${micActive ? 'bg-red-500/30 text-red-300 border border-red-500/50' : 'bg-slate-800 text-slate-400'}`}>
                      {micActive ? 'MIC OPEN' : 'STANDBY'}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mb-3">
                    Transcribes spoken Spartan commands into tactical actions (e.g. &ldquo;Recharge shields&rdquo;, &ldquo;Open lounge&rdquo;, &ldquo;Show blueprint&rdquo;).
                  </p>
                  <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-cyan-300 min-h-[50px] italic">
                    {micTranscript ? `&ldquo;${micTranscript}&rdquo;` : micActive ? 'Listening to voice stream...' : 'Click button below to engage HUD mic.'}
                  </div>
                </div>

                <button
                  onClick={toggleMic}
                  className={`mt-3 w-full py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                    micActive
                      ? 'bg-red-600 hover:bg-red-500 text-white animate-pulse'
                      : 'bg-cyan-600 hover:bg-cyan-500 text-slate-950'
                  }`}
                >
                  {micActive ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  <span>{micActive ? 'Disengage Microphone' : 'Engage Microphone (Push-to-Talk)'}</span>
                </button>
              </div>

              {/* Neural TTS Testing */}
              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Volume2 className="w-4 h-4 text-emerald-400" />
                      <span>Neural TTS Synthesizer</span>
                    </span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      SPEECH ENGINE READY
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mb-3">
                    Synthesizes tactical AI voice confirmations and environment hazard alerts directly into Spartan helmet audio buses.
                  </p>
                  <div className="space-y-1.5 text-[10px]">
                    <div className="p-2 bg-slate-900 border border-slate-800 rounded text-slate-300">
                      Sample: <b className="text-emerald-300">&ldquo;Spartan voice service online. All 8 stack daemons reporting nominal.&rdquo;</b>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => speakHudTactical('Master Chief, Spartan comms channel established on port 8100. Environmental scrubbers running at 480 CFM.')}
                  className="mt-3 w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Test Neural Tactical TTS</span>
                </button>
              </div>
            </div>

            {/* Eternium 8-Service Stack Health Matrix */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 mb-4">
              <div className="text-[11px] font-bold text-slate-300 mb-2 flex items-center justify-between">
                <span>ETERNIUM &amp; SOVEREIGN STACK MESH (8 SERVICES)</span>
                <span className="text-emerald-400 text-[10px]">8/8 ONLINE</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
                {[
                  { name: 'llama-server', port: 1234, status: 'ONLINE', role: 'LLM Engine' },
                  { name: 'voice', port: 8100, status: 'ONLINE', role: 'Mic & TTS' },
                  { name: 'openjarvis', port: 8000, status: 'ONLINE', role: 'Jarvis Core' },
                  { name: 'eternium', port: 9007, status: 'ONLINE', role: 'DAG Chain' },
                  { name: 'conductor', port: 9005, status: 'ONLINE', role: 'Symphony' },
                  { name: 'telemetry', port: 9004, status: 'ONLINE', role: 'Hardware' },
                  { name: 'judge', port: 9001, status: 'ONLINE', role: 'Compliance' },
                  { name: 'sovereign hud', port: 3000, status: 'ONLINE', role: 'Tactical UI' }
                ].map((s) => (
                  <div key={s.port} className="p-2 bg-slate-900/80 rounded border border-slate-800 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">:{s.port}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    </div>
                    <div className="text-cyan-300 font-bold">{s.name}</div>
                    <div className="text-[9px] text-slate-400">{s.role}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center text-xs text-slate-400 pt-2 border-t border-slate-800">
              <span>UNSC MJOLNIR MK-V AUDIO COMMS BUS</span>
              <button
                onClick={() => setVoiceCommsOpen(false)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded"
              >
                Close Comms Matrix
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
  );
};
