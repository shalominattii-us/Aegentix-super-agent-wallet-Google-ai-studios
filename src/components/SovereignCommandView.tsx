import React, { useState, useEffect, useRef } from 'react';
import {
  Ship,
  Radio,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Terminal,
  Activity,
  Cpu,
  Wifi,
  Lock,
  Flame,
  Download,
  ExternalLink,
  Play,
  Pause,
  RotateCcw,
  Check,
  Copy,
  AlertTriangle,
  Layers,
  Globe,
  Sliders,
  Sparkles,
  Maximize2,
  DollarSign,
  Compass,
} from 'lucide-react';
import {
  SOVEREIGN_AGENTS,
  INITIAL_WIRESHARK_PACKETS,
  SOVEREIGN_ACQUISITION_TIERS,
  INITIAL_VESSEL_TELEMETRY,
  SovereignAgent,
  WiresharkPacket,
  VesselTelemetry,
  AcquisitionTier,
} from '../data/sovereignCommandData';

interface SovereignCommandViewProps {
  onNotify?: (message: string, type: 'SUCCESS' | 'ALERT' | 'INFO') => void;
}

export const SovereignCommandView: React.FC<SovereignCommandViewProps> = ({ onNotify }) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'SWARM_AGENTS' | 'WIRESHARK' | 'VESSEL_SPECS' | 'ACQUISITION' | 'STANDALONE_VIEW'>('OVERVIEW');
  const [agents, setAgents] = useState<SovereignAgent[]>(SOVEREIGN_AGENTS);
  const [packets, setPackets] = useState<WiresharkPacket[]>(INITIAL_WIRESHARK_PACKETS);
  const [telemetry, setTelemetry] = useState<VesselTelemetry>(INITIAL_VESSEL_TELEMETRY);
  const [selectedPacket, setSelectedPacket] = useState<WiresharkPacket | null>(null);
  const [packetFilter, setPacketFilter] = useState<string>('ALL');
  const [isLivePacketStream, setIsLivePacketStream] = useState<boolean>(true);
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'RLUSD' | 'USDC' | 'ETH'>('USD');
  const [selectedTier, setSelectedTier] = useState<AcquisitionTier | null>(null);
  const [reservationModalOpen, setReservationModalOpen] = useState<boolean>(false);
  const [selectedPort, setSelectedPort] = useState<string>('Monaco');
  const [reserveSuccess, setReserveSuccess] = useState<boolean>(false);
  const [hasCopied, setHasCopied] = useState<string | null>(null);

  // Live Terminal Log state
  const [terminalLogs, setTerminalLogs] = useState<Array<{ time: string; agent: string; color: string; message: string }>>([
    { time: '04:17:32.441', agent: 'RED_AGENT', color: 'text-red-400', message: '→ Port scan initiated on segment CREW-NET (192.168.4.0/24) · 65535 ports · SYN stealth mode' },
    { time: '04:17:32.889', agent: 'BLUE_AGENT', color: 'text-cyan-400', message: '→ Anomalous SYN flood detected · Source: INTERNAL RED · Classification: AUTHORISED · No action taken' },
    { time: '04:17:33.104', agent: 'RED_AGENT', color: 'text-yellow-400', message: '→ VULNERABILITY FOUND · SSH port 22 banner disclosure · CVE-2024-6387 potential · Escalating to WHITE_TEAM' },
    { time: '04:17:33.201', agent: 'WHITE_AGENT', color: 'text-slate-200', message: '→ Vuln logged · Patch priority: CRITICAL · Assigning GREEN_AGENT for remediation' },
    { time: '04:17:33.445', agent: 'GREEN_AGENT', color: 'text-emerald-400', message: '→ Deploying SSH config hardening patch · Disabling banner · Restricting cipher suite · Applying now' },
    { time: '04:17:33.891', agent: 'GREEN_AGENT', color: 'text-emerald-400', message: '→ PATCH APPLIED · SSH banner suppressed · CREW-NET hardened · Confirming to WHITE' },
    { time: '04:17:34.002', agent: 'PURPLE_AGENT', color: 'text-purple-400', message: "→ Validating Blue detection of Red's CVE-2024-6387 attempt · Detection confirmed 100% · Rule: sigma-ssh-banner-002" },
    { time: '04:17:35.330', agent: 'FW_AGENT', color: 'text-orange-400', message: '→ FireWire bus scan · IEEE-1394 ports: 4 · Status: ALL LOCKED · No unauthorized DMA access' },
    { time: '04:17:36.110', agent: 'TW_AGENT', color: 'text-indigo-400', message: '→ Integrity check: 14,882 files · 0 modifications · Honeypot files: 48 · 0 access events · CLEAN' },
    { time: '04:17:37.004', agent: 'WIRESHARK', color: 'text-cyan-300', message: '→ tshark capture eth0 · 2,341 packets/sec · 0 suspicious flows · No anomalous TCP RST clusters' },
    { time: '04:17:38.220', agent: 'ORANGE_AGENT', color: 'text-amber-400', message: '→ CTI feed update · 3 new IOCs ingested from MISP · Signatures pushed to BLUE_AGENT IDS rules' },
    { time: '04:17:39.001', agent: 'YELLOW_AGENT', color: 'text-yellow-300', message: '→ Firmware SAST complete · 0 critical findings · 2 medium · Scheduled for next patch window' },
    { time: '04:17:40.114', agent: 'WHITE_AGENT', color: 'text-emerald-400', message: '→ POSTURE: HARDENED · Attack surface: -12% vs baseline · Swarm uptime: 847h 22m · SOVEREIGN_NET: SECURE' },
    { time: '04:17:40.999', agent: 'SYSTEM', color: 'text-cyan-400', message: '→ Telesat Lightspeed uplink: 7.42 Gbps ↓ · 960 Mbps ↑ · Latency: 34ms · Starlink backup: STANDBY' },
  ]);

  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Periodic simulated packet feed
  useEffect(() => {
    if (!isLivePacketStream) return;
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0] + '.' + Math.floor(now.getMilliseconds()).toString().padStart(3, '0');
      const randomIps = ['10.1.0.5', '10.2.0.12', '10.3.0.44', '10.4.0.3', '10.5.0.1', '198.41.0.4', '162.159.200.1'];
      const protocols: Array<'DNS' | 'TCP' | 'UDP' | 'ARP' | 'NMEA' | 'OSPF'> = ['DNS', 'TCP', 'UDP', 'NMEA', 'OSPF'];
      const pickedProto = protocols[Math.floor(Math.random() * protocols.length)];

      const newPacket: WiresharkPacket = {
        id: `pkt-${Date.now()}`,
        time: timeStr,
        srcIp: randomIps[Math.floor(Math.random() * randomIps.length)],
        dstIp: randomIps[Math.floor(Math.random() * randomIps.length)],
        protocol: pickedProto,
        length: Math.floor(Math.random() * 600) + 54,
        info: pickedProto === 'NMEA' ? 'Autonav heading sync $GPHDT 142.5' : pickedProto === 'DNS' ? 'Standard query A lightsats.telesat.com' : 'Encrypted socket telemetry payload',
        status: 'NORMAL',
        segment: pickedProto === 'NMEA' ? 'BRIDGE-NET' : 'SATELLITE-UPLINK',
      };

      setPackets(prev => [newPacket, ...prev.slice(0, 30)]);
    }, 4000);

    return () => clearInterval(interval);
  }, [isLivePacketStream]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setHasCopied(label);
    if (onNotify) onNotify(`Copied ${label} to clipboard!`, 'SUCCESS');
    setTimeout(() => setHasCopied(null), 2000);
  };

  const handleInjectThreat = (threatType: 'SYN_FLOOD' | 'DMA_BREACH' | 'HONEYPOT' | 'BANNER_LEAK') => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0] + '.' + Math.floor(now.getMilliseconds()).toString().padStart(3, '0');

    if (threatType === 'SYN_FLOOD') {
      const pkt: WiresharkPacket = {
        id: `threat-${Date.now()}`,
        time: timeStr,
        srcIp: '203.0.113.88',
        dstIp: '10.1.0.5',
        protocol: 'TCP',
        length: 60,
        info: '⚠ SYN FLOOD ATTACK · 1,420 pkts/sec on Port 443 · EXT ATTACKER',
        status: 'BLOCKED',
        segment: 'SATELLITE-UPLINK',
      };
      setPackets(prev => [pkt, ...prev]);
      setTerminalLogs(prev => [
        ...prev,
        { time: timeStr, agent: 'BLUE_AGENT', color: 'text-red-400', message: '🛑 SYN flood detected from 203.0.113.88. Source blacklisted at edge firewall in 1.4ms!' },
        { time: timeStr, agent: 'PURPLE_AGENT', color: 'text-purple-400', message: '→ Generated Sigma rule for rate anomaly. Verified zero packet leakage to BRIDGE-NET.' },
      ]);
      setAgents(prev => prev.map(a => a.id === 'BLUE_AGENT' ? { ...a, mitigations: a.mitigations + 1 } : a));
      if (onNotify) onNotify('🛑 SYN Flood intercepted by Blue Team Agent! Threat source auto-isolated.', 'ALERT');
    } else if (threatType === 'DMA_BREACH') {
      const pkt: WiresharkPacket = {
        id: `threat-${Date.now()}`,
        time: timeStr,
        srcIp: 'PORT-IEEE-1394-02',
        dstIp: 'BRIDGE-BUS-01',
        protocol: 'TCP',
        length: 128,
        info: '⚠ DIRECT MEMORY ACCESS (DMA) EXPLOIT ATTEMPT ON FIREWIRE PORT 2',
        status: 'BLOCKED',
        segment: 'BRIDGE-NET',
      };
      setPackets(prev => [pkt, ...prev]);
      setTerminalLogs(prev => [
        ...prev,
        { time: timeStr, agent: 'FW_AGENT', color: 'text-orange-400', message: '⚡ UNAUTHORIZED DMA ACCESS DETECTED ON FIREWIRE PORT 2! Hardware kill switch tripped!' },
        { time: timeStr, agent: 'WHITE_AGENT', color: 'text-slate-200', message: '→ Port IEEE-1394-02 power isolated. Bridge bus locked. Biometric alert sent to Captain.' },
      ]);
      setAgents(prev => prev.map(a => a.id === 'FIREWIRE_AGENT' ? { ...a, mitigations: a.mitigations + 1 } : a));
      if (onNotify) onNotify('⚡ FireWire Agent tripped hardware kill switch on physical bus! Exfiltration blocked.', 'ALERT');
    } else if (threatType === 'HONEYPOT') {
      setTerminalLogs(prev => [
        ...prev,
        { time: timeStr, agent: 'TW_AGENT', color: 'text-indigo-400', message: '🚨 HONEYPOT TRIGGERED: Unauthorized read attempt on /etc/secrets/vault_master.key' },
        { time: timeStr, agent: 'BLUE_AGENT', color: 'text-cyan-400', message: '→ Session quarantined. Memory dump captured for forensic analysis by Orange Team.' },
      ]);
      setAgents(prev => prev.map(a => a.id === 'TRIPWIRE_AGENT' ? { ...a, mitigations: a.mitigations + 1 } : a));
      if (onNotify) onNotify('🚨 TripWire Agent caught unauthorized honeypot file read! Session quarantined.', 'ALERT');
    } else {
      setTerminalLogs(prev => [
        ...prev,
        { time: timeStr, agent: 'RED_AGENT', color: 'text-red-400', message: '🎯 Red Team simulating external zero-day API exploit against Telesat proxy endpoint...' },
        { time: timeStr, agent: 'GREEN_AGENT', color: 'text-emerald-400', message: '→ Applied kernel runtime eBPF filter. Microsegmentation intact. 0 privileges granted.' },
      ]);
      if (onNotify) onNotify('🎯 Red Team simulated zero-day exploit. Green Team hardened eBPF envelope.', 'INFO');
    }
  };

  const handleReserve = (e: React.FormEvent) => {
    e.preventDefault();
    setReserveSuccess(true);
    if (onNotify) onNotify(`🎉 Sovereign Command Tier [${selectedTier?.name}] successfully registered for ${selectedPort} delivery window!`, 'SUCCESS');
    setTimeout(() => {
      setReserveSuccess(false);
      setReservationModalOpen(false);
    }, 2500);
  };

  const getCurrencyPrice = (usd: number) => {
    switch (currency) {
      case 'EUR': return `€${(usd * 0.92 / 1000000).toFixed(1)}M`;
      case 'RLUSD': return `${(usd / 1000000).toFixed(1)}M RLUSD`;
      case 'USDC': return `${(usd / 1000000).toFixed(1)}M USDC`;
      case 'ETH': return `${(usd / 3100).toFixed(0)} ETH`;
      default: return `$${(usd / 1000000).toFixed(1)}M`;
    }
  };

  return (
    <div className="bg-[#030508] border border-amber-500/30 rounded-xl overflow-hidden shadow-2xl space-y-4 font-mono text-xs text-slate-200">
      {/* HEADER BANNER */}
      <div className="p-4 sm:p-5 border-b border-amber-500/20 bg-gradient-to-r from-[#030508] via-[#0A1420] to-[#030810] flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 via-cyan-600 to-slate-900 border border-amber-500/40 flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
            <Ship className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-amber-300 tracking-wider uppercase font-sans">
                SOVEREIGN COMMAND &middot; 48M AUTONOMOUS EXPEDITION PLATFORM
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-black border flex items-center gap-1 bg-cyan-500/20 text-cyan-300 border-cyan-500/40">
                <Wifi className="w-3 h-3 text-cyan-400" />
                TELESAT LIGHTSPEED 7.5 Gbps
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-black border flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border-emerald-500/40">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                SWARM ACTIVE &middot; 9 AGENTS
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Dual LEO Satellite Backbone &middot; Jetson Thor FP4 AI Cluster &middot; 24/7 Offensive-Defensive Autonomous Hunting &middot; Zero Trust
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Threat Simulator Dropdown */}
          <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-700 rounded-lg p-1">
            <span className="text-[10px] text-red-400 font-bold px-1.5 flex items-center gap-1">
              <Flame className="w-3 h-3" />
              <span>Simulate Threat:</span>
            </span>
            <button
              onClick={() => handleInjectThreat('SYN_FLOOD')}
              className="px-2 py-0.5 rounded bg-red-600/30 hover:bg-red-600 text-red-200 hover:text-white text-[10px] font-bold cursor-pointer transition-colors"
            >
              SYN Flood
            </button>
            <button
              onClick={() => handleInjectThreat('DMA_BREACH')}
              className="px-2 py-0.5 rounded bg-orange-600/30 hover:bg-orange-600 text-orange-200 hover:text-white text-[10px] font-bold cursor-pointer transition-colors"
            >
              FireWire DMA
            </button>
            <button
              onClick={() => handleInjectThreat('HONEYPOT')}
              className="px-2 py-0.5 rounded bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 hover:text-white text-[10px] font-bold cursor-pointer transition-colors"
            >
              Honeypot
            </button>
          </div>

          <a
            href="/sovereign-command.html"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg bg-cyan-600/30 hover:bg-cyan-600 text-cyan-200 hover:text-slate-950 border border-cyan-500/40 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
            title="Open pure standalone HTML experience"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Launch Standalone HTML</span>
          </a>

          <button
            onClick={() => {
              setSelectedTier(SOVEREIGN_ACQUISITION_TIERS[1]);
              setReservationModalOpen(true);
            }}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Acquire Series I</span>
          </button>
        </div>
      </div>

      {/* SPECS STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 px-4 py-2 bg-[#060C14] border-y border-amber-500/10 text-center">
        <div className="p-2 border-r border-slate-800">
          <div className="text-xl font-bold text-amber-300 font-sans">{telemetry.loaMeters}m</div>
          <div className="text-[10px] text-slate-400 uppercase">Length Overall</div>
          <div className="text-[9px] text-slate-500">Expedition Hull</div>
        </div>
        <div className="p-2 border-r border-slate-800">
          <div className="text-xl font-bold text-cyan-400 font-sans">{telemetry.telesatDownlinkGbps} Gbps</div>
          <div className="text-[10px] text-slate-400 uppercase">Downlink LEO</div>
          <div className="text-[9px] text-cyan-400/80">Telesat Lightspeed</div>
        </div>
        <div className="p-2 border-r border-slate-800">
          <div className="text-xl font-bold text-emerald-400 font-sans">9 Active</div>
          <div className="text-[10px] text-slate-400 uppercase">Swarm Agents</div>
          <div className="text-[9px] text-emerald-400/80">Continuous Hunt</div>
        </div>
        <div className="p-2 border-r border-slate-800">
          <div className="text-xl font-bold text-amber-300 font-sans">{telemetry.gpuCluster.fp4TflopsTotal}</div>
          <div className="text-[10px] text-slate-400 uppercase">FP4 TFLOPS</div>
          <div className="text-[9px] text-slate-500">6x Jetson Thor</div>
        </div>
        <div className="p-2 border-r border-slate-800">
          <div className="text-xl font-bold text-slate-200 font-sans">{telemetry.rangeKm} km</div>
          <div className="text-[10px] text-slate-400 uppercase">Ocean Autonomy</div>
          <div className="text-[9px] text-slate-500">42 kn Sprint Foils</div>
        </div>
        <div className="p-2">
          <div className="text-xl font-bold text-emerald-400 font-sans">{telemetry.breachesDetected} Breaches</div>
          <div className="text-[10px] text-slate-400 uppercase">0ms Lockdown</div>
          <div className="text-[9px] text-emerald-400/80">100% Defense SLA</div>
        </div>
      </div>

      {/* SUB-TABS */}
      <div className="px-4 border-b border-slate-800 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveTab('OVERVIEW')}
          className={`flex items-center gap-1.5 px-3 py-2 border-b-2 font-bold transition-colors cursor-pointer ${
            activeTab === 'OVERVIEW'
              ? 'border-amber-400 text-amber-300 bg-amber-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Vessel Bridge &amp; Tactical Radar</span>
        </button>

        <button
          onClick={() => setActiveTab('SWARM_AGENTS')}
          className={`flex items-center gap-1.5 px-3 py-2 border-b-2 font-bold transition-colors cursor-pointer ${
            activeTab === 'SWARM_AGENTS'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>9-Agent Security Swarm</span>
          <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 text-[9px] font-bold">9</span>
        </button>

        <button
          onClick={() => setActiveTab('WIRESHARK')}
          className={`flex items-center gap-1.5 px-3 py-2 border-b-2 font-bold transition-colors cursor-pointer ${
            activeTab === 'WIRESHARK'
              ? 'border-blue-400 text-blue-300 bg-blue-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Wireshark Live Capture</span>
          <span className="px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 text-[9px] font-bold">tshark</span>
        </button>

        <button
          onClick={() => setActiveTab('VESSEL_SPECS')}
          className={`flex items-center gap-1.5 px-3 py-2 border-b-2 font-bold transition-colors cursor-pointer ${
            activeTab === 'VESSEL_SPECS'
              ? 'border-purple-400 text-purple-300 bg-purple-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Engineering Specifications</span>
        </button>

        <button
          onClick={() => setActiveTab('ACQUISITION')}
          className={`flex items-center gap-1.5 px-3 py-2 border-b-2 font-bold transition-colors cursor-pointer ${
            activeTab === 'ACQUISITION'
              ? 'border-yellow-400 text-yellow-300 bg-yellow-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Series I Acquisition Matrix</span>
          <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-bold">8 Units</span>
        </button>

        <button
          onClick={() => setActiveTab('STANDALONE_VIEW')}
          className={`flex items-center gap-1.5 px-3 py-2 border-b-2 font-bold transition-colors cursor-pointer ${
            activeTab === 'STANDALONE_VIEW'
              ? 'border-emerald-400 text-emerald-300 bg-emerald-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>Embedded HTML Portal</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: OVERVIEW & TACTICAL BRIDGE                         */}
      {/* ========================================================= */}
      {activeTab === 'OVERVIEW' && (
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left: Vessel Vector & Telemetry (7 cols) */}
            <div className="lg:col-span-7 bg-[#060C14] border border-amber-500/20 rounded-xl p-4 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300 uppercase flex items-center gap-1.5">
                  <Ship className="w-4 h-4 text-amber-400" />
                  <span>Sovereign Command Vector HUD &middot; Monaco Sea Trials</span>
                </span>
                <span className="text-[10px] text-cyan-400 font-mono">
                  LAT: {telemetry.currentCoordinates.lat}&deg;N &middot; LNG: {telemetry.currentCoordinates.lng}&deg;E
                </span>
              </div>

              {/* Vessel Graphic */}
              <div className="relative w-full h-56 flex items-center justify-center bg-radial from-[#0C1A2E]/60 via-transparent to-transparent rounded-lg border border-slate-800/80">
                <svg viewBox="0 0 700 400" className="w-full h-full max-h-52 drop-shadow-2xl">
                  <ellipse cx="350" cy="330" rx="320" ry="18" fill="rgba(0,20,50,.6)" />
                  <path d="M40 290 Q120 260 350 255 Q580 260 660 290 Q580 320 350 325 Q120 320 40 290Z" fill="rgba(10,20,35,.95)" stroke="rgba(200,169,106,.4)" strokeWidth="1.2" />
                  <path d="M40 290 Q350 300 660 290 Q580 318 350 323 Q120 318 40 290Z" fill="rgba(6,12,22,1)" stroke="rgba(0,212,255,.2)" strokeWidth="0.8" />
                  <path d="M180 290 Q220 200 270 180 Q350 165 430 180 Q480 200 520 290Z" fill="rgba(8,18,32,.98)" stroke="rgba(200,169,106,.2)" strokeWidth="0.8" />
                  <path d="M240 280 Q280 225 320 212 Q350 205 380 212 Q420 225 460 280Z" fill="rgba(6,14,24,.9)" stroke="rgba(0,212,255,.2)" strokeWidth="0.8" />
                  
                  {/* Bridge windows */}
                  <rect x="298" y="218" width="36" height="22" rx="2" fill="rgba(0,212,255,.3)" stroke="rgba(0,212,255,.6)" strokeWidth="0.8" />
                  <rect x="342" y="216" width="42" height="24" rx="2" fill="rgba(0,212,255,.4)" stroke="rgba(0,212,255,.8)" strokeWidth="0.8" />
                  <rect x="392" y="218" width="36" height="22" rx="2" fill="rgba(0,212,255,.3)" stroke="rgba(0,212,255,.6)" strokeWidth="0.8" />
                  
                  {/* Telesat phased array mast */}
                  <line x1="350" y1="210" x2="350" y2="155" stroke="rgba(200,169,106,.7)" strokeWidth="1.5" />
                  <line x1="310" y1="175" x2="390" y2="175" stroke="rgba(200,169,106,.4)" strokeWidth="1" />
                  <ellipse cx="350" cy="155" rx="20" ry="4" fill="rgba(0,212,255,.5)" stroke="rgba(0,212,255,.9)" strokeWidth="1.2" />
                  <line x1="350" y1="155" x2="350" y2="140" stroke="rgba(200,169,106,.8)" strokeWidth="1.5" />
                  
                  {/* Signal arcs */}
                  <path d="M328 128 Q350 110 372 128" stroke="rgba(0,212,255,.6)" strokeWidth="1" fill="none" strokeDasharray="3,2" className="animate-pulse" />
                  <path d="M315 116 Q350 92 385 116" stroke="rgba(0,212,255,.4)" strokeWidth="1" fill="none" strokeDasharray="3,3" />
                  <path d="M300 104 Q350 73 400 104" stroke="rgba(0,212,255,.2)" strokeWidth="1" fill="none" strokeDasharray="3,4" />

                  {/* GPU cluster vents */}
                  <rect x="395" y="240" width="30" height="6" rx="1" fill="rgba(0,255,136,.2)" stroke="rgba(0,255,136,.4)" strokeWidth="0.5" />
                  <rect x="395" y="250" width="30" height="6" rx="1" fill="rgba(0,255,136,.2)" stroke="rgba(0,255,136,.4)" strokeWidth="0.5" />

                  {/* Nav lights */}
                  <circle cx="652" cy="293" r="4" fill="#00FF44" className="animate-ping" />
                  <circle cx="652" cy="293" r="3" fill="#00FF44" />
                  <circle cx="48" cy="293" r="3" fill="#FF2222" />
                  
                  {/* Gold trim */}
                  <path d="M120 278 L580 278" stroke="rgba(200,169,106,.6)" strokeWidth="2" />
                </svg>

                {/* Hydrofoil Status Overlay */}
                <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-black/80 border border-amber-500/40 rounded text-[10px] text-amber-300">
                  <span>Hydrofoils: </span>
                  <span className="text-emerald-400 font-bold">DEPLOYED (+40cm LIFT)</span>
                </div>
                <div className="absolute bottom-2 right-2 px-2.5 py-1 bg-black/80 border border-cyan-500/40 rounded text-[10px] text-cyan-300">
                  <span>Speed: </span>
                  <span className="text-white font-bold">{telemetry.currentCoordinates.speedKnots} KNOTS</span>
                </div>
              </div>

              {/* Subnet Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800 text-[10px]">
                <div className="p-2 bg-slate-950 rounded border border-slate-800">
                  <span className="text-slate-400 block">BRIDGE-NET:</span>
                  <span className="text-emerald-400 font-bold">ECDIS / NMEA SECURED</span>
                </div>
                <div className="p-2 bg-slate-950 rounded border border-slate-800">
                  <span className="text-slate-400 block">COMMAND-NET:</span>
                  <span className="text-cyan-400 font-bold">OSPF MESH &middot; MTLS</span>
                </div>
                <div className="p-2 bg-slate-950 rounded border border-slate-800">
                  <span className="text-slate-400 block">OT-NET:</span>
                  <span className="text-purple-400 font-bold">PHYSICALLY AIR-GAPPED</span>
                </div>
                <div className="p-2 bg-slate-950 rounded border border-slate-800">
                  <span className="text-slate-400 block">CREW-NET:</span>
                  <span className="text-amber-400 font-bold">ZERO TRUST DMZ</span>
                </div>
              </div>
            </div>

            {/* Right: Live Swarm Terminal Stream (5 cols) */}
            <div className="lg:col-span-5 bg-[#060C14] border border-amber-500/20 rounded-xl p-4 space-y-3 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <span className="font-bold text-white text-xs">SOVEREIGN_SWARM_OS v4.1</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-[10px] text-emerald-300">LIVE FEED</span>
                </div>
              </div>

              {/* Log Stream */}
              <div className="bg-black/95 p-3 rounded-lg border border-slate-800/80 space-y-2 font-mono text-[10px] leading-relaxed max-h-80 overflow-y-auto">
                {terminalLogs.map((log, idx) => (
                  <div key={idx} className="space-x-1.5">
                    <span className="text-slate-500">[{log.time}]</span>
                    <span className={`font-bold ${log.color}`}>{log.agent}</span>
                    <span className="text-slate-300">{log.message}</span>
                  </div>
                ))}
                <div ref={terminalEndRef} />
              </div>

              {/* Terminal Quick Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[10px]">
                <button
                  onClick={() => handleInjectThreat('BANNER_LEAK')}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <Play className="w-3 h-3 text-cyan-400" />
                  <span>Simulate Zero-Day</span>
                </button>
                <button
                  onClick={() => setTerminalLogs(prev => prev.slice(0, 10))}
                  className="text-slate-400 hover:text-slate-200 underline cursor-pointer"
                >
                  Clear Buffer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: 9-AGENT AI SECURITY DIVISION MATRIX               */}
      {/* ========================================================= */}
      {activeTab === 'SWARM_AGENTS' && (
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyan-400" />
                <span>The Sovereign 9-Agent Autonomous Security Division</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                The only vessel on Earth that continuously hacks itself — so no external adversary can find an unsealed vector.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/30">
                100% SWARM HEALTH &middot; 0 UNMITIGATED THREATS
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className="p-4 bg-[#060C14] border border-slate-800 hover:border-slate-700 rounded-xl space-y-3 transition-all shadow-md relative overflow-hidden"
              >
                <div
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ backgroundColor: agent.themeColor }}
                />

                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded flex items-center justify-center font-bold text-xs"
                      style={{ backgroundColor: `${agent.themeColor}20`, color: agent.themeColor, border: `1px solid ${agent.themeColor}40` }}
                    >
                      {agent.code}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-xs">{agent.name}</h4>
                      <span className="text-[10px] text-slate-400 block">{agent.role}</span>
                    </div>
                  </div>
                  <span
                    className="px-2 py-0.5 rounded text-[9px] font-black border"
                    style={{ backgroundColor: `${agent.themeColor}20`, color: agent.themeColor, borderColor: `${agent.themeColor}50` }}
                  >
                    {agent.status}
                  </span>
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {agent.description}
                </p>

                {/* Detections & Mitigations */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-[11px]">
                  <div className="bg-slate-950 p-2 rounded border border-slate-850">
                    <span className="text-[10px] text-slate-400 block">Detections:</span>
                    <span className="font-bold text-amber-300">{agent.detections}</span>
                  </div>
                  <div className="bg-slate-950 p-2 rounded border border-slate-850">
                    <span className="text-[10px] text-slate-400 block">Mitigations:</span>
                    <span className="font-bold text-emerald-400">{agent.mitigations}</span>
                  </div>
                </div>

                {/* Tool Pills */}
                <div className="space-y-1">
                  <span className="text-[9px] text-slate-400 uppercase font-bold block">Assigned Tools &amp; Protocols:</span>
                  <div className="flex flex-wrap gap-1">
                    {agent.tools.map((tool, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-slate-900 text-slate-300 border border-slate-800"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: WIRESHARK / TSHARK LIVE PACKET CAPTURE             */}
      {/* ========================================================= */}
      {activeTab === 'WIRESHARK' && (
        <div className="p-4 space-y-4">
          <div className="p-3 bg-[#060C14] border border-blue-500/30 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-400" />
              <div>
                <span className="font-bold text-white text-xs">WIRESHARK / tshark CONTINUOUS PACKET CAPTURE</span>
                <p className="text-[10px] text-slate-400">Monitoring BRIDGE-NET, CREW-NET, COMMAND-NET, OT-NET &amp; Telesat LEO uplink</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsLivePacketStream(!isLivePacketStream)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border flex items-center gap-1.5 cursor-pointer ${
                  isLivePacketStream
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                {isLivePacketStream ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{isLivePacketStream ? 'Pause Capture' : 'Resume Capture'}</span>
              </button>

              <button
                onClick={() => setPackets(INITIAL_WIRESHARK_PACKETS)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 flex items-center gap-1 cursor-pointer"
                title="Reset packet ledger"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
            {['ALL', 'TCP', 'UDP', 'DNS', 'NMEA', 'ARP', 'ICMP'].map((f) => (
              <button
                key={f}
                onClick={() => setPacketFilter(f)}
                className={`px-2.5 py-1 rounded border font-bold cursor-pointer transition-colors ${
                  packetFilter === f
                    ? 'bg-blue-600 text-white border-blue-400'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Packet Table */}
          <div className="overflow-x-auto border border-slate-800 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0A1420] text-slate-400 uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Time</th>
                  <th className="py-2.5 px-3">Source IP</th>
                  <th className="py-2.5 px-3">Dest IP</th>
                  <th className="py-2.5 px-3">Protocol</th>
                  <th className="py-2.5 px-3">Segment</th>
                  <th className="py-2.5 px-3">Len</th>
                  <th className="py-2.5 px-3">Packet Info</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-[#060C14]">
                {packets
                  .filter(p => packetFilter === 'ALL' || p.protocol === packetFilter)
                  .map((pkt) => (
                    <tr
                      key={pkt.id}
                      onClick={() => setSelectedPacket(pkt)}
                      className={`hover:bg-slate-900/60 cursor-pointer transition-colors ${
                        pkt.status === 'BLOCKED' ? 'bg-red-950/20' : ''
                      }`}
                    >
                      <td className="py-2 px-3 font-mono text-slate-400 text-[11px]">{pkt.time}</td>
                      <td className="py-2 px-3 font-mono text-cyan-300 text-[11px]">{pkt.srcIp}</td>
                      <td className="py-2 px-3 font-mono text-slate-300 text-[11px]">{pkt.dstIp}</td>
                      <td className="py-2 px-3">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-cyan-300 border border-slate-700">
                          {pkt.protocol}
                        </span>
                      </td>
                      <td className="py-2 px-3 font-mono text-slate-400 text-[10px]">{pkt.segment}</td>
                      <td className="py-2 px-3 font-mono text-slate-500 text-[11px]">{pkt.length} B</td>
                      <td className="py-2 px-3 text-slate-200 text-[11px] truncate max-w-xs">{pkt.info}</td>
                      <td className="py-2 px-3">
                        <span
                          className={`px-2 py-0.5 rounded font-black text-[10px] border ${
                            pkt.status === 'BLOCKED'
                              ? 'bg-red-500/20 text-red-300 border-red-500/40'
                              : pkt.status === 'MITIGATED'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : pkt.status === 'WATCH'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              : 'bg-slate-800 text-slate-300 border-slate-700'
                          }`}
                        >
                          {pkt.status}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: ENGINEERING & VESSEL SPECIFICATIONS                */}
      {/* ========================================================= */}
      {activeTab === 'VESSEL_SPECS' && (
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="p-4 bg-[#060C14] border border-slate-800 rounded-xl space-y-2">
              <span className="text-xl">⚓</span>
              <h4 className="font-bold text-white text-xs uppercase">AEGIS Autonomous Navigation</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                240-sensor fusion core — radar, lidar, AIS, thermal, sonar. IMO-compliant COLREGS autonomous avoidance. Set a waypoint across any ocean and sleep soundly.
              </p>
            </div>

            <div className="p-4 bg-[#060C14] border border-slate-800 rounded-xl space-y-2">
              <span className="text-xl">⚡</span>
              <h4 className="font-bold text-white text-xs uppercase">NVIDIA Jetson Thor Cluster</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Six Jetson Thor modules delivering 2070 FP4 TFLOPS each (12,420 TFLOPS aggregated). Runs all 9 swarm agents, autonomous navigation AI, and sensor fusion simultaneously — air-cooled, saltwater-hardened.
              </p>
            </div>

            <div className="p-4 bg-[#060C14] border border-slate-800 rounded-xl space-y-2">
              <span className="text-xl">🛡️</span>
              <h4 className="font-bold text-white text-xs uppercase">Zero Trust Architecture</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Every network transaction is verified. No implicit trust. Micro-segmented BRIDGE-NET, CREW-NET, COMMAND-NET, and OT-NET. Role-based biometric access.
              </p>
            </div>

            <div className="p-4 bg-[#060C14] border border-slate-800 rounded-xl space-y-2">
              <span className="text-xl">🌊</span>
              <h4 className="font-bold text-white text-xs uppercase">Hydrofoil Assist Package</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Active foils deploy at 22 knots lifting the hull 40cm. 35% fuel saving in transit. 42-knot sprint capability on full hybrid power. 4,800km autonomous range.
              </p>
            </div>

            <div className="p-4 bg-[#060C14] border border-slate-800 rounded-xl space-y-2">
              <span className="text-xl">🔬</span>
              <h4 className="font-bold text-white text-xs uppercase">Pininfarina Command Interior</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Expedition-grade command deck with natural oak veneer, carbon fibre accents, and an 8-screen tactical display array. The SOC and salon are one luxury space.
              </p>
            </div>

            <div className="p-4 bg-[#060C14] border border-slate-800 rounded-xl space-y-2">
              <span className="text-xl">🔐</span>
              <h4 className="font-bold text-white text-xs uppercase">Biometric Sovereign Access</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Facial recognition, vein-pattern mapping, and multi-factor cryptographic authentication. Quantum-resistant encryption across all data channels. Zero physical keys.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: SERIES I ACQUISITION MATRIX                        */}
      {/* ========================================================= */}
      {activeTab === 'ACQUISITION' && (
        <div className="p-4 space-y-6">
          <div className="text-center space-y-2">
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest">// SERIES I &middot; 8 UNITS ONLY</span>
            <h3 className="text-3xl font-black text-amber-300 font-sans tracking-wide">
              {getCurrencyPrice(5200000)} &mdash; {getCurrencyPrice(12400000)}
            </h3>
            <p className="text-xs text-slate-400 max-w-xl mx-auto">
              Base configuration delivered Ex. Works Monaco, 2027. Full sea trials and 72-hour AI swarm commissioning included.
            </p>

            {/* Currency Selector */}
            <div className="inline-flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1 text-[10px]">
              {(['USD', 'EUR', 'RLUSD', 'USDC', 'ETH'] as const).map(c => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={`px-2.5 py-1 rounded font-bold cursor-pointer transition-colors ${
                    currency === c ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {SOVEREIGN_ACQUISITION_TIERS.map((tier) => (
              <div
                key={tier.id}
                className={`p-5 rounded-xl border flex flex-col justify-between space-y-4 transition-all relative ${
                  tier.featured
                    ? 'bg-gradient-to-b from-amber-950/20 via-[#0A1420] to-[#060C14] border-amber-500 shadow-xl shadow-amber-500/10'
                    : 'bg-[#060C14] border-slate-800'
                }`}
              >
                {tier.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-amber-500 text-slate-950 rounded-full text-[9px] font-black uppercase tracking-wider">
                    Most Configured Tier
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-baseline justify-between">
                    <h4 className="font-bold text-white text-base font-sans">{tier.name}</h4>
                    <span className="text-2xl font-black text-amber-300 font-sans">
                      {getCurrencyPrice(tier.priceUsd)}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{tier.tagline}</p>

                  <ul className="space-y-1.5 pt-3 border-t border-slate-800 text-[11px] text-slate-300">
                    {tier.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-1.5">
                        <span className="text-amber-400 shrink-0 mt-0.5">&mdash;</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => {
                    setSelectedTier(tier);
                    setReservationModalOpen(true);
                  }}
                  className={`w-full py-2 rounded-lg font-black text-xs uppercase tracking-wider cursor-pointer transition-all ${
                    tier.featured
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md'
                      : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700'
                  }`}
                >
                  Configure &amp; Enquire
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 6: EMBEDDED STANDALONE HTML VIEW                      */}
      {/* ========================================================= */}
      {activeTab === 'STANDALONE_VIEW' && (
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Embedded View of <code>/sovereign-command.html</code> (Starfield Canvas, Parallax Vector, Audio &amp; Full Presentation)</span>
            <a
              href="/sovereign-command.html"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 rounded bg-amber-500 text-slate-950 font-bold flex items-center gap-1"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Open in New Window</span>
            </a>
          </div>
          <div className="w-full h-[700px] rounded-xl overflow-hidden border border-slate-800 shadow-2xl">
            <iframe
              src="/sovereign-command.html"
              title="Sovereign Command Standalone View"
              className="w-full h-full border-none"
            />
          </div>
        </div>
      )}

      {/* RESERVATION ENQUIRY MODAL */}
      {reservationModalOpen && selectedTier && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0A1420] border border-amber-500/40 rounded-xl p-5 max-w-lg w-full space-y-4 shadow-2xl font-mono text-xs">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-white text-base font-sans uppercase">
                  Reserve Sovereign Command [{selectedTier.name}]
                </h3>
                <span className="text-amber-400 text-xs font-bold">
                  {getCurrencyPrice(selectedTier.priceUsd)} &middot; Series I Commission
                </span>
              </div>
              <button
                onClick={() => setReservationModalOpen(false)}
                className="text-slate-400 hover:text-white text-base font-bold px-2 py-0.5 rounded bg-slate-800 cursor-pointer"
              >
                &times;
              </button>
            </div>

            {reserveSuccess ? (
              <div className="p-6 text-center space-y-2 bg-emerald-950/30 border border-emerald-500/40 rounded-lg">
                <Check className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-white text-sm">Commission Request Registered</h4>
                <p className="text-xs text-slate-300">
                  Your confidential acquisition dossier has been assigned to the Monaco Naval Architect &amp; Sovereign AI Division liaison.
                </p>
              </div>
            ) : (
              <form onSubmit={handleReserve} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase font-bold block">Delivery Window &amp; Port:</label>
                  <select
                    value={selectedPort}
                    onChange={e => setSelectedPort(e.target.value)}
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded text-white text-xs focus:outline-hidden focus:border-amber-400"
                  >
                    <option value="Monaco">Port Hercule, Monaco (2027 Sea Trials)</option>
                    <option value="Dubai">Dubai Harbour Marina (2027 Delivery)</option>
                    <option value="Singapore">Marina Bay, Singapore (2027 Delivery)</option>
                    <option value="Reykjavik">Reykjavik Old Harbour (Arctic Expedition Outfitting)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase font-bold block">Preferred Settlement Channel:</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['FIAT (USD/EUR)', 'RLUSD / USDC', 'CRYPTO (ETH)'].map(c => (
                      <div key={c} className="p-2 bg-slate-950 border border-slate-800 rounded text-center text-[10px] text-slate-300 font-bold">
                        {c}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-black/60 border border-slate-800 rounded text-[11px] text-slate-400 leading-relaxed">
                  Includes: 48m Expedition Hull, 7.5 Gbps Telesat Lightspeed Phased Array, Jetson Thor Cluster, and 72hr AI Swarm Commissioning sea trials.
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setReservationModalOpen(false)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider cursor-pointer shadow-md"
                  >
                    Confirm Confidential Reservation
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
