/**
 * SOVEREIGN COMMAND — Autonomous Expedition Platform & AI Security Division
 * Data models, 9-agent swarm catalog, live packet captures, vessel specs, and acquisition tiers.
 */

export interface SovereignAgent {
  id: string;
  code: string;
  name: string;
  role: string;
  description: string;
  badgeClass: string;
  themeColor: string;
  status: 'HUNTING' | 'SECURED' | 'ACTIVE' | 'STANDBY';
  tools: string[];
  detections: number;
  mitigations: number;
}

export interface WiresharkPacket {
  id: string;
  time: string;
  srcIp: string;
  dstIp: string;
  protocol: 'DNS' | 'TCP' | 'UDP' | 'ARP' | 'NMEA' | 'OSPF' | 'ICMP' | 'TLS';
  length: number;
  info: string;
  status: 'OK' | 'NORMAL' | 'WATCH' | 'AUTH' | 'BLOCKED' | 'MITIGATED';
  segment: 'BRIDGE-NET' | 'CREW-NET' | 'COMMAND-NET' | 'OT-NET' | 'SATELLITE-UPLINK';
}

export interface VesselTelemetry {
  loaMeters: number;
  beamMeters: number;
  draftFoilsUp: number;
  draftFoilsDown: number;
  maxSpeedKnots: number;
  cruiseSpeedKnots: number;
  rangeKm: number;
  telesatDownlinkGbps: number;
  telesatUplinkGbps: number;
  telesatLatencyMs: number;
  starlinkBackupStatus: string;
  bonded5GStatus: string;
  currentCoordinates: {
    lat: number;
    lng: number;
    headingDeg: number;
    speedKnots: number;
    seaState: string;
  };
  gpuCluster: {
    modules: number;
    model: string;
    fp4TflopsTotal: number;
    powerDrawKw: number;
    tempC: number;
  };
  threatCount24h: number;
  breachesDetected: number;
}

export interface AcquisitionTier {
  id: string;
  name: string;
  priceUsd: number;
  deliveryYear: number;
  featured?: boolean;
  tagline: string;
  features: string[];
}

export const SOVEREIGN_AGENTS: SovereignAgent[] = [
  {
    id: 'RED_AGENT',
    code: 'RT',
    name: 'Red Team Agent',
    role: 'Offensive Penetration · Ethical Hacking',
    description: 'Continuously simulates adversarial attacks against all vessel systems. Exploits vulnerabilities before external actors can. Executes zero-day research, privilege escalation attempts, and lateral movement across all network segments.',
    badgeClass: 'red',
    themeColor: '#FF3355',
    status: 'HUNTING',
    tools: ['Metasploit', 'Nmap', 'Burp Suite', 'MITRE ATT&CK', 'Custom LLM Agent'],
    detections: 42,
    mitigations: 42,
  },
  {
    id: 'BLUE_AGENT',
    code: 'BT',
    name: 'Blue Team Agent',
    role: 'Defensive Response · SOC Operations',
    description: 'Real-time threat detection, containment, and incident response. Monitors all traffic across vessel segments, correlates SIEM alerts, and executes automated countermeasures within milliseconds of anomaly detection.',
    badgeClass: 'blue',
    themeColor: '#00D4FF',
    status: 'ACTIVE',
    tools: ['SIEM Stack', 'Suricata IDS', 'OSSEC HIDS', 'Elastic Security', 'Auto-Isolate'],
    detections: 89,
    mitigations: 89,
  },
  {
    id: 'PURPLE_AGENT',
    code: 'PT',
    name: 'Purple Team Agent',
    role: 'Red-Blue Integration · Adaptive Learning',
    description: 'Bridges Red and Blue agents — takes offensive findings and immediately translates them into defensive countermeasures. Validates that Blue detects what Red discovers through continuous adversarial simulation.',
    badgeClass: 'purple',
    themeColor: '#AA55FF',
    status: 'ACTIVE',
    tools: ['CALDERA', 'Atomic Red Team', 'VECTR', 'Sigma Rules'],
    detections: 31,
    mitigations: 31,
  },
  {
    id: 'WHITE_AGENT',
    code: 'WT',
    name: 'White Team Agent',
    role: 'Command, Control & Governance',
    description: 'The orchestrator. Manages all other agents, sets strategy, enforces compliance frameworks, and maintains the master security posture. Arbitrates conflicts and maintains immutable audit ledgers.',
    badgeClass: 'white-t',
    themeColor: '#F0EDE6',
    status: 'SECURED',
    tools: ['GRC Platform', 'NIST CSF', 'ISO 27001', 'Audit Ledger'],
    detections: 12,
    mitigations: 12,
  },
  {
    id: 'YELLOW_AGENT',
    code: 'YT',
    name: 'Yellow Team Agent',
    role: 'Secure Development · Code Hardening',
    description: 'Oversees all onboard software and firmware development pipelines. Enforces secure coding standards, performs continuous static analysis and SAST scanning before any updates deploy.',
    badgeClass: 'yellow',
    themeColor: '#FFD700',
    status: 'ACTIVE',
    tools: ['SAST / DAST', 'Semgrep', 'SonarQube', 'DevSecOps CI'],
    detections: 18,
    mitigations: 18,
  },
  {
    id: 'GREEN_AGENT',
    code: 'GT',
    name: 'Green Team Agent',
    role: 'Infrastructure Hardening · Resilience',
    description: 'Integrates security into vessel infrastructure at the deepest level. Manages network segmentation, zero-trust policy enforcement, microsegmentation of OT from IT, and CIS benchmark baselines.',
    badgeClass: 'green',
    themeColor: '#00FF88',
    status: 'ACTIVE',
    tools: ['Zero Trust', 'Network Seg.', 'CIS Benchmarks', 'OT Isolation'],
    detections: 24,
    mitigations: 24,
  },
  {
    id: 'ORANGE_AGENT',
    code: 'OT',
    name: 'Orange Team Agent',
    role: 'Threat Intelligence · Crew Awareness',
    description: 'Bridges attacker knowledge to system builders. Gathers live threat intelligence from global feeds, translates Red Team findings into developer briefings, and trains crew against social engineering.',
    badgeClass: 'orange',
    themeColor: '#FF8833',
    status: 'ACTIVE',
    tools: ['OSINT Feeds', 'CTI Platform', 'MISP', 'Crew Briefings'],
    detections: 15,
    mitigations: 15,
  },
  {
    id: 'FIREWIRE_AGENT',
    code: 'FW',
    name: 'FireWire Agent',
    role: 'Physical Interface Monitoring · Exfiltration Detection',
    description: 'Monitors all FireWire (IEEE 1394) physical interfaces and high-speed peripheral buses across the vessel. Detects unauthorized DMA access attempts and triggers instant hardware port lockdowns.',
    badgeClass: 'fw',
    themeColor: '#FF6600',
    status: 'SECURED',
    tools: ['IEEE 1394 Monitor', 'DMA Guard', 'Bus Analyser', 'Port Kill Switch'],
    detections: 7,
    mitigations: 7,
  },
  {
    id: 'TRIPWIRE_AGENT',
    code: 'TW',
    name: 'TripWire Agent',
    role: 'File Integrity Monitoring · Honeypot Operations',
    description: 'Maintains cryptographically signed baselines of every critical file, registry entry, and configuration across all vessel systems. Deploys honeypot trap files to expose stealthy intruders instantly.',
    badgeClass: 'tw',
    themeColor: '#AA88FF',
    status: 'SECURED',
    tools: ['Tripwire FIM', 'Honeypot Files', 'SHA-512 Baseline', 'Active Directory', 'HIDS'],
    detections: 9,
    mitigations: 9,
  },
];

export const INITIAL_WIRESHARK_PACKETS: WiresharkPacket[] = [
  {
    id: 'pkt-101',
    time: '04:17:40.112',
    srcIp: '10.1.0.5',
    dstIp: '198.41.0.4',
    protocol: 'DNS',
    length: 74,
    info: 'Standard query A api.telesat.com',
    status: 'OK',
    segment: 'SATELLITE-UPLINK',
  },
  {
    id: 'pkt-102',
    time: '04:17:40.228',
    srcIp: '10.2.0.12',
    dstIp: '10.2.0.1',
    protocol: 'TCP',
    length: 66,
    info: '443→53982 [ACK] Seq=1 Ack=1',
    status: 'NORMAL',
    segment: 'CREW-NET',
  },
  {
    id: 'pkt-103',
    time: '04:17:40.441',
    srcIp: '10.3.0.88',
    dstIp: '10.0.0.1',
    protocol: 'ARP',
    length: 42,
    info: 'Who has 10.0.0.1? Tell 10.3.0.88 — UNUSUAL FREQ',
    status: 'WATCH',
    segment: 'COMMAND-NET',
  },
  {
    id: 'pkt-104',
    time: '04:17:40.553',
    srcIp: '10.1.0.5',
    dstIp: '162.159.200.1',
    protocol: 'UDP',
    length: 1200,
    info: 'Starlink keepalive · encrypted · valid cert',
    status: 'AUTH',
    segment: 'SATELLITE-UPLINK',
  },
  {
    id: 'pkt-105',
    time: '04:17:40.661',
    srcIp: '10.4.0.3',
    dstIp: '10.4.0.255',
    protocol: 'NMEA',
    length: 88,
    info: 'Navigation data broadcast · ECDIS feed · $GPRMC',
    status: 'NORMAL',
    segment: 'BRIDGE-NET',
  },
  {
    id: 'pkt-106',
    time: '04:17:40.774',
    srcIp: '203.0.113.42',
    dstIp: '10.1.0.5',
    protocol: 'TCP',
    length: 60,
    info: 'SYN flood attempt · 847 packets in 2s · EXT SOURCE',
    status: 'BLOCKED',
    segment: 'SATELLITE-UPLINK',
  },
  {
    id: 'pkt-107',
    time: '04:17:40.890',
    srcIp: '10.1.0.5',
    dstIp: '203.0.113.42',
    protocol: 'TCP',
    length: 54,
    info: 'RST sent · Source auto-blacklisted · FW rule applied',
    status: 'MITIGATED',
    segment: 'SATELLITE-UPLINK',
  },
  {
    id: 'pkt-108',
    time: '04:17:41.002',
    srcIp: '10.2.0.15',
    dstIp: '8.8.8.8',
    protocol: 'DNS',
    length: 78,
    info: 'Query AAAA crew-portal.internal',
    status: 'NORMAL',
    segment: 'CREW-NET',
  },
  {
    id: 'pkt-109',
    time: '04:17:41.114',
    srcIp: '10.5.0.1',
    dstIp: '10.5.0.0/24',
    protocol: 'OSPF',
    length: 68,
    info: 'Hello packet · Routing table sync · COMMAND-NET',
    status: 'AUTH',
    segment: 'COMMAND-NET',
  },
  {
    id: 'pkt-110',
    time: '04:17:41.330',
    srcIp: '10.3.0.44',
    dstIp: '10.1.0.5',
    protocol: 'ICMP',
    length: 84,
    info: 'Large ping 65500 bytes · potential recon attempt',
    status: 'WATCH',
    segment: 'OT-NET',
  },
];

export const SOVEREIGN_ACQUISITION_TIERS: AcquisitionTier[] = [
  {
    id: 'open-water',
    name: 'Open Water',
    priceUsd: 5200000,
    deliveryYear: 2027,
    tagline: 'Base autonomous expedition platform with Series I classification.',
    features: [
      '48m Expedition Hull · Hydrofoil Assist (42 knots sprint)',
      'Telesat Lightspeed 7.5 Gbps Downlink Terminal',
      'Starlink Maritime Gen 3 active secondary (400+ Mbps)',
      'AEGIS Autonomous Navigation Core with 240-sensor fusion',
      '9-Agent AI Security Swarm (Red, Blue, Purple, White, etc.)',
      'Wireshark Continuous Capture across all subnets',
      'FireWire (IEEE 1394) + TripWire FIM Monitoring',
      'Zero Trust Microsegmentation Architecture',
      '2yr White Glove Support & Monaco Sea Trials',
    ],
  },
  {
    id: 'command',
    name: 'Command',
    priceUsd: 7800000,
    deliveryYear: 2027,
    featured: true,
    tagline: 'Dual Telesat phased array with NVIDIA DGX Spark AI Lab onboard.',
    features: [
      'Everything in Open Water',
      'Dual Telesat Lightspeed Arrays (15 Gbps aggregated pipe)',
      'NVIDIA DGX Spark Onboard AI Laboratory',
      'Hardened Armour Hull Grade A (ballistic & ice-class rated)',
      'Extended Swarm — 16 Specialized Autonomous Agents',
      'Dedicated 24/7 Remote SOC Team Escort',
      'Pininfarina Bespoke Interior & 8-Screen Tactical Array',
      '4yr Full Support & Worldwide Spares SLA',
    ],
  },
  {
    id: 'sovereign',
    name: 'Sovereign',
    priceUsd: 12400000,
    deliveryYear: 2027,
    tagline: 'Bespoke naval commission with terminal-to-terminal direct laser links.',
    features: [
      'Everything in Command',
      'Full Commission Tailored to Sovereign Specifications',
      'Gold & Carbon Fibre Exterior Stealth Treatment',
      'Classified Sovereign Security Hardening Package',
      'Dedicated Naval Architect & Chief AI Engineer on Call',
      'Private Liaison Captain & Lifetime Priority SLA',
      'Terminal-to-Terminal Optical Laser Links (bypass internet)',
      'Military Ka-Band Fallback Transceiver Option',
    ],
  },
];

export const INITIAL_VESSEL_TELEMETRY: VesselTelemetry = {
  loaMeters: 48,
  beamMeters: 10.4,
  draftFoilsUp: 2.1,
  draftFoilsDown: 3.8,
  maxSpeedKnots: 42,
  cruiseSpeedKnots: 28,
  rangeKm: 4800,
  telesatDownlinkGbps: 7.42,
  telesatUplinkGbps: 0.96,
  telesatLatencyMs: 34,
  starlinkBackupStatus: 'STANDBY · HOT FAILOVER',
  bonded5GStatus: 'ACTIVE · 4x CARRIER AGGREGATED',
  currentCoordinates: {
    lat: 43.7384,
    lng: 7.4246,
    headingDeg: 142.5,
    speedKnots: 28.4,
    seaState: 'SLIGHT (SS2) · FOILS ENGAGED',
  },
  gpuCluster: {
    modules: 6,
    model: 'NVIDIA Jetson Thor',
    fp4TflopsTotal: 2070 * 6,
    powerDrawKw: 1.84,
    tempC: 48.2,
  },
  threatCount24h: 312,
  breachesDetected: 0,
};
