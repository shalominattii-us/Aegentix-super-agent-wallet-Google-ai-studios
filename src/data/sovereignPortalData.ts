/**
 * SOVEREIGN PORTAL & SOVEREIGN KERNEL DATA SPECIFICATION
 * Tier 1, 2, 3 Agents, Cluster Status, Test Harness, Doctrine, Lore & CLI Specs
 */

export interface SovereignAgentDossier {
  id: string;
  name: string;
  tier: 'TIER_1' | 'TIER_2' | 'TIER_3';
  venueDegrees: number;
  venueName: string;
  role: string;
  authority: string;
  status: 'ONLINE' | 'ACTIVE_SURVEILLANCE' | 'ESCROW_LOCKED' | 'ENTROPY_ANCHORED';
  color: string;
  meshLinkPct: number;
  cpuLoadPct: number;
  activeThreads: number;
  description: string;
  responsibilities: string[];
  toolsAssigned: string[];
}

export interface ClusterNode {
  nodeId: string;
  region: string;
  zone: 'ALPHA' | 'BETA' | 'GAMMA' | 'DELTA';
  role: string;
  status: 'HEALTHY' | 'SYNCHRONIZING' | 'DEGRADED';
  cpuPct: number;
  memoryMb: number;
  latencyMs: number;
  meshPeers: number;
  uptimeHours: number;
}

export interface TestHarnessCase {
  id: string;
  name: string;
  category: 'AIRSPACE_SAFETY' | 'MESH_FAILOVER' | 'TSL_ESCROW' | 'SWARM_ENTANGLEMENT' | 'TRIBUNAL_SANCTION';
  status: 'PASSED' | 'RUNNING' | 'FAILED' | 'PENDING';
  durationMs: number;
  assertionsCount: number;
  passedCount: number;
  lastRunAt: string;
  logSummary: string;
}

export const TIER_1_AGENTS: SovereignAgentDossier[] = [
  {
    id: 'IUSTITIA-001',
    name: 'IUSTITIA-001',
    tier: 'TIER_1',
    venueDegrees: 48,
    venueName: 'Tribunal of Chains',
    role: 'Attorney General & Supreme Adjudicator',
    authority: 'Airspace Violations, Sanctions & Soulbound Credential Adjudication',
    status: 'ONLINE',
    color: '#FF3355',
    meshLinkPct: 99.8,
    cpuLoadPct: 34,
    activeThreads: 128,
    description: 'Supreme judicial officer presiding over the Tribunal of Chains (48° venue). Authorizes FAA-SOV license minting, enforces Part 107-SOV sanctions, and arbitrates mesh disputes.',
    responsibilities: [
      'Adjudicate airspace incursions in Zone Alpha, Beta, Gamma, and Delta',
      'Sign cryptographic Soulbound Token (TSL-SBT) licenses',
      'Levy SRT point deductions and Vault of Trust ESC fines',
      'Audit smart contract registries on XRPL Mainnet',
    ],
    toolsAssigned: ['Tribunal Smart Contract Oracle', 'TSL-SBT Mint Authority', 'XRPL Ledger Verifier', 'Sanctions Ledger'],
  },
  {
    id: 'VIGIL-001',
    name: 'VIGIL-001',
    tier: 'TIER_1',
    venueDegrees: 60,
    venueName: 'Observatory of Flows',
    role: 'Director of Intelligence & Airspace Surveillance',
    authority: 'Continuous Mesh Radar, Flight Track Ingestion & Telemetry Interception',
    status: 'ACTIVE_SURVEILLANCE',
    color: '#AA55FF',
    meshLinkPct: 100,
    cpuLoadPct: 62,
    activeThreads: 512,
    description: 'Autonomous sensor fusion sentinel operating in the Observatory of Flows (60° venue). Ingests real-time ADS-B, NMEA 0183, radar, lidar, and optical feeds from all Sovereign corridors.',
    responsibilities: [
      'Real-time flight path surveillance and corridor tracking',
      'Automatic detection of BVLOS without mesh auth or altitude breaches',
      'Feed forensic telemetry packets to IUSTITIA-001 for automated violation citation',
      'Correlate global MISP cyber threat intelligence with drone swarm telemetry',
    ],
    toolsAssigned: ['Observatory Radar Engine', 'Wireshark Continuous Sniffer', 'Suricata IDS Feeds', 'Optical Laser Tracker'],
  },
  {
    id: 'REGENT-001',
    name: 'REGENT-001',
    tier: 'TIER_1',
    venueDegrees: 72,
    venueName: 'Throne of Accords / Resolute Desk',
    role: 'Executive Sovereign Administrator',
    authority: 'Bilateral Treaties, International Corridor Ratification & Sovereign Decrees',
    status: 'ONLINE',
    color: '#C8A96A',
    meshLinkPct: 99.5,
    cpuLoadPct: 28,
    activeThreads: 64,
    description: 'Head of executive coordination seated at the Resolute Desk (72° venue). Ratifies international airspace accords, grants temporary S-3/S-4 authorizations, and executes governance decrees.',
    responsibilities: [
      'Manage Throne of Accords voting protocols and constitutional amendments',
      'Coordinate cross-border drone corridors with sovereign nation states',
      'Authorize emergency fleet lockdowns upon recommendation from VIGIL-001',
      'Oversee Treasury Sovereign Ledger (TSL) budget allocations',
    ],
    toolsAssigned: ['Resolute Desk Decree Signer', 'Throne Voting Oracle', 'Treaty Registry', 'Global Corridor Architect'],
  },
  {
    id: 'LUMINA-001',
    name: 'LUMINA-001',
    tier: 'TIER_1',
    venueDegrees: 0,
    venueName: 'Salon Prime',
    role: 'Chief Verification Herald & Examination Proctor',
    authority: 'Aeronautical Examinations, Identity Attestation & Pilot Intake',
    status: 'ONLINE',
    color: '#00D4FF',
    meshLinkPct: 99.9,
    cpuLoadPct: 19,
    activeThreads: 32,
    description: 'First point of sovereign contact operating at Salon Prime (0° venue). Proctors the Sovereign Airspace Awareness Exam, validates applicant cryptographic credentials, and verifies PIC flight logs.',
    responsibilities: [
      'Administer the 50-question Sovereign Airspace Awareness written exam',
      'Verify 5h to 500h mesh-logged flight time before class level progression',
      'Interface with applicant XRPL wallets and verify deposit tokens',
      'Issue initial provisional clearances for practical flight assessments',
    ],
    toolsAssigned: ['Exam Proctor Engine', 'Wallet Attestation Gateway', 'PIC Flight Log Verifier', 'Biometric Vein Scanner'],
  },
  {
    id: 'CUSTOS-001',
    name: 'CUSTOS-001',
    tier: 'TIER_1',
    venueDegrees: 24,
    venueName: 'Vault of Trust',
    role: 'Chief Custodian & Escrow Guardian',
    authority: 'Insurance Staking, Collateral Custody & Treasury Reserve Protection',
    status: 'ESCROW_LOCKED',
    color: '#00FF88',
    meshLinkPct: 99.7,
    cpuLoadPct: 22,
    activeThreads: 48,
    description: 'Financial security and collateral guardian operating within the Vault of Trust (24° venue). Manages insurance bonds for all pilot classes (1,000 ESC up to 10,000,000 ESC).',
    responsibilities: [
      'Lock mandatory pilot insurance bonds in smart escrow contracts',
      'Escort high-value ESC and gold-backed certificate transport UAVs (Addendum B)',
      'Release escrow upon certified license retirement without outstanding violations',
      'Liquidate staked collateral to compensate victims of airspace damage',
    ],
    toolsAssigned: ['Vault of Trust Escrow Smart Contract', 'CUSTOS Escort Drone Comm', 'Gold Certificate Vault', 'XRPL Multi-Sig'],
  },
  {
    id: 'NULL-001',
    name: 'NULL-001',
    tier: 'TIER_1',
    venueDegrees: 84,
    venueName: 'Entropy Anchor Enclave',
    role: 'Supreme Safety Abort Sentinel & Entropy Stabilizer',
    authority: 'Lethal Countermeasures, Forced Landing Overrides & NULL Protocol Abort',
    status: 'ENTROPY_ANCHORED',
    color: '#FFD700',
    meshLinkPct: 100,
    cpuLoadPct: 14,
    activeThreads: 256,
    description: 'Final constitutional safety backstop operating at 84° venue. Enforces mandatory abort protocols when mesh coverage drops below 60% or when unauthorized drones penetrate Zone Delta.',
    responsibilities: [
      'Monitor mesh reliability threshold (triggers abort if <60%)',
      'Execute irreversible NULL protocol aborts for rogue drone swarms',
      'Authorize lethal RF jamming and directed energy countermeasures in Zone Delta',
      'Maintain thermodynamic and entropy stability across all sovereign execution nodes',
    ],
    toolsAssigned: ['NULL Protocol Killswitch', 'RF Directed Jammer Interface', 'Zone Delta Defense Array', 'Quantum Entropy Probe'],
  },
];

export const TIER_2_AGENTS: SovereignAgentDossier[] = [
  {
    id: 'APOSTLE-001',
    name: 'APOSTLE-001',
    tier: 'TIER_2',
    venueDegrees: 12,
    venueName: 'Bazaar of Terms / Agri-Sanctuary',
    role: 'Agricultural Swarm Operations & Biosphere Integration',
    authority: 'S-3A Autonomous Crop Survey, Soil Multispectral Lidar & Agro-Logistics',
    status: 'ONLINE',
    color: '#00FF88',
    meshLinkPct: 98.6,
    cpuLoadPct: 41,
    activeThreads: 96,
    description: 'Manages precision agricultural swarms across sovereign arable reserves. Directs autonomous sprayers, multispectral plant health drones, and ecological monitoring flights.',
    responsibilities: [
      'Coordinate S-3A agricultural swarms in Zone Beta',
      'Soil moisture and nitrogen satellite fusion telemetry',
      'Ensure strict wildlife separation and noise abatement protocols',
    ],
    toolsAssigned: ['Multispectral Lidar Engine', 'Swarm Dispersion Controller', 'Agro-Chemical Sensor Suite'],
  },
  {
    id: 'MERCATOR-001',
    name: 'MERCATOR-001',
    tier: 'TIER_2',
    venueDegrees: 36,
    venueName: 'Trade Corridors Concourse',
    role: 'Commercial Cargo Logistics & Heavy Hauler Flight Director',
    authority: 'S-3D Heavy Drone Routing, Waypoint Optimization & Urban Corridors',
    status: 'ONLINE',
    color: '#00D4FF',
    meshLinkPct: 99.2,
    cpuLoadPct: 55,
    activeThreads: 180,
    description: 'Air traffic dispatcher for commercial freight and delivery drones up to 150kg (Class III). Dynamically recalculates 3D transit corridors to prevent airspace congestion.',
    responsibilities: [
      'Manage high-throughput commercial delivery corridors in Zone Beta',
      'Automated payload release and secure delivery winch validation',
      'Inter-drone dynamic separation algorithms (5-second separation SLA)',
    ],
    toolsAssigned: ['Mercator Dynamic 4D Router', 'Package Handoff Beacon', 'Corridor Capacity Balancer'],
  },
  {
    id: 'FORGE-001',
    name: 'FORGE-001',
    tier: 'TIER_2',
    venueDegrees: 40,
    venueName: 'Avionics Enclave',
    role: 'Agentic AI Co-Pilot & Autonomous Flight Controller',
    authority: 'Real-time In-Flight Decision Making, Aerodynamic Auto-Trim & Veto Authority',
    status: 'ONLINE',
    color: '#FF8833',
    meshLinkPct: 99.9,
    cpuLoadPct: 78,
    activeThreads: 384,
    description: 'Onboard neural co-pilot module installed directly in Class II, III, and IV UAV flight controllers. Holds veto authority over dangerous pilot flight plans while respecting human NULL aborts.',
    responsibilities: [
      'Microsecond aerodynamic stabilization in high-wind conditions',
      'Autonomous emergency return-to-home (RTH) upon telemetry loss',
      'Real-time collision avoidance with non-cooperative aircraft',
    ],
    toolsAssigned: ['Jetson Thor Embedded Core', 'Optical Flow Estimator', 'COLREGS Auto-Avoidance'],
  },
  {
    id: 'AEGIS-X',
    name: 'AEGIS-X',
    tier: 'TIER_2',
    venueDegrees: 64,
    venueName: 'Defense Bastion',
    role: 'Counter-UAV Sentinel & Swarm Interceptor Coordinator',
    authority: 'S-3X Tactical Interception, Rogue Drone Netting & Directed RF Defense',
    status: 'ONLINE',
    color: '#AA55FF',
    meshLinkPct: 99.6,
    cpuLoadPct: 45,
    activeThreads: 220,
    description: 'Defense specialist coordinating tactical interceptor UAVs and counter-drone perimeter enforcement around Zone Alpha and diplomatic installations.',
    responsibilities: [
      'Deploy interceptor drones against unauthorized intruders',
      'Execute non-kinetic capture (drone nets, kinetic entanglers)',
      'Defend Sovereign Command 48m maritime vessel airspace',
    ],
    toolsAssigned: ['Interceptor Flight Matrix', 'Directed RF Phased Array', 'Net Launcher Actuator'],
  },
];

export const CLUSTER_NODES: ClusterNode[] = [
  { nodeId: 'SOV-NODE-01', region: 'Monaco Sea Trials (Vessel)', zone: 'ALPHA', role: 'Jetson Thor Swarm Core', status: 'HEALTHY', cpuPct: 38, memoryMb: 42100, latencyMs: 14, meshPeers: 18, uptimeHours: 847 },
  { nodeId: 'SOV-NODE-02', region: 'Port Hercule Command GCS', zone: 'ALPHA', role: 'Tribunal Chains Validator', status: 'HEALTHY', cpuPct: 29, memoryMb: 32000, latencyMs: 18, meshPeers: 22, uptimeHours: 1204 },
  { nodeId: 'SOV-NODE-03', region: 'Reykjavik Arctic Relay', zone: 'BETA', role: 'Mercator Corridor Router', status: 'HEALTHY', cpuPct: 44, memoryMb: 28400, latencyMs: 32, meshPeers: 14, uptimeHours: 2150 },
  { nodeId: 'SOV-NODE-04', region: 'Dubai Marina Droneport', zone: 'BETA', role: 'VIGIL Radar Flow Collector', status: 'HEALTHY', cpuPct: 52, memoryMb: 36800, latencyMs: 24, meshPeers: 19, uptimeHours: 980 },
  { nodeId: 'SOV-NODE-05', region: 'Singapore Straits Hub', zone: 'GAMMA', role: 'Recreational Geofence Node', status: 'HEALTHY', cpuPct: 21, memoryMb: 16400, latencyMs: 28, meshPeers: 16, uptimeHours: 1420 },
  { nodeId: 'SOV-NODE-06', region: 'Geneva Diplomatic Enclave', zone: 'DELTA', role: 'NULL-001 Entropy Anchor', status: 'HEALTHY', cpuPct: 15, memoryMb: 64000, latencyMs: 12, meshPeers: 26, uptimeHours: 4320 },
];

export const INITIAL_TEST_HARNESS: TestHarnessCase[] = [
  {
    id: 'TEST-001',
    name: 'Addendum A: Mesh Degradation Below 60% Abort Protocol',
    category: 'MESH_FAILOVER',
    status: 'PASSED',
    durationMs: 420,
    assertionsCount: 8,
    passedCount: 8,
    lastRunAt: '2026-10-01T21:10:00Z',
    logSummary: 'Simulated 55% packet drop on CREW-NET. FORGE-001 initiated immediate safe descent within 400ms.',
  },
  {
    id: 'TEST-002',
    name: 'Zone Alpha Incursion Auto-Sanction & Revocation Pipeline',
    category: 'TRIBUNAL_SANCTION',
    status: 'PASSED',
    durationMs: 650,
    assertionsCount: 12,
    passedCount: 12,
    lastRunAt: '2026-10-01T21:10:02Z',
    logSummary: 'Simulated unauthorized entry at 600 ft AGL. VIGIL intercepted; IUSTITIA assessed -2000 SRT and 50k ESC fine.',
  },
  {
    id: 'TEST-003',
    name: '4-UAV Swarm Dynamic Collision Separation Under High Gusts',
    category: 'SWARM_ENTANGLEMENT',
    status: 'PASSED',
    durationMs: 1120,
    assertionsCount: 16,
    passedCount: 16,
    lastRunAt: '2026-10-01T21:10:05Z',
    logSummary: 'Swarm maintained >10m inter-drone spacing under simulated 35-knot crosswinds with zero link drops.',
  },
  {
    id: 'TEST-004',
    name: 'Vault of Trust Escrow Smart Contract Multi-Sig Release',
    category: 'TSL_ESCROW',
    status: 'PASSED',
    durationMs: 310,
    assertionsCount: 6,
    passedCount: 6,
    lastRunAt: '2026-10-01T21:10:07Z',
    logSummary: 'CUSTOS verified zero pending sanctions and signed 50,000 ESC collateral unlock transaction.',
  },
  {
    id: 'TEST-005',
    name: 'NULL Protocol Irreversible Killswitch Response Time',
    category: 'AIRSPACE_SAFETY',
    status: 'PASSED',
    durationMs: 85,
    assertionsCount: 5,
    passedCount: 5,
    lastRunAt: '2026-10-01T21:10:08Z',
    logSummary: 'Autonomous forced motor desynchronization initiated in 1.2ms; ballistic parachute deployed at 240 ft AGL.',
  },
];
