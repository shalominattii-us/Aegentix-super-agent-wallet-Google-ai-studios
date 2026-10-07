/**
 * FAA-SOV CLASS LICENSE SPECIFICATION & DATA
 * Build: SOV-FAA-001 | Jurisdiction: TSL/XRPL | Principal: shalominattii-us
 * Issuing Authority: IUSTITIA-001 (Attorney General, Tribunal of Chains, 48°)
 * Enforcement: VIGIL-001 (Director of Intelligence, Observatory of Flows, 60°)
 */

export interface FaaSovClass {
  classId: 'S-0' | 'S-1' | 'S-2' | 'S-3' | 'S-4' | 'S-5';
  title: string;
  scope: string;
  requirements: string[];
  aircraftAllowed: string;
  altitudeCeiling: string;
  nightOperations: string;
  bvlosAllowed: string;
  tokenGateEsc: number;
  insuranceBondEsc: number;
  renewalMonths: number;
  badgeColor: string;
  authorityLevel: string;
  specializationTracks?: string[];
}

export interface AirspaceZone {
  zoneId: 'Zone Alpha' | 'Zone Beta' | 'Zone Gamma' | 'Zone Delta';
  name: string;
  altitudeRange: string;
  minClass: string;
  purpose: string;
  enforcement: string;
  status: 'CLEAR' | 'CAUTION' | 'RESTRICTED' | 'LOCKED';
  activeUavs: number;
  color: string;
}

export interface AircraftRegistration {
  regNumber: string;
  manufacturer: string;
  model: string;
  serialHash: string;
  weightClass: 'Class I (<250g)' | 'Class II (250g-2kg)' | 'Class III (25kg-150kg)' | 'Class IV (>150kg)';
  propulsion: 'Electric' | 'Hybrid Turbine' | 'Hydrogen Fuel Cell';
  meshNodeId: string;
  insuranceBondEsc: number;
  ownerAddress: string;
  registeredAt: string;
  expiresAt: string;
  airworthinessStatus: 'AIRWORTHY' | 'INSPECTION_DUE' | 'GROUNDED';
}

export interface ViolationRecord {
  violationId: string;
  title: string;
  severity: 'Minor' | 'Moderate' | 'Serious' | 'Critical' | 'Severe' | 'Existential';
  srtPenalty: number;
  escFine: number;
  licenseAction: string;
  description: string;
}

export interface PilotLicenseProfile {
  licenseId: string;
  principal: string;
  ownerAddress: string;
  classLevel: 'S-0' | 'S-1' | 'S-2' | 'S-3' | 'S-4' | 'S-5';
  issueDate: string;
  expiryDate: string;
  escStaked: number;
  flightHoursLogged: number;
  picHoursLogged: number;
  swarmHoursLogged: number;
  meshReliabilityPct: number;
  registryContract: string;
  qrVerificationUrl: string;
  status: 'ACTIVE_CERTIFIED' | 'SUSPENDED' | 'EXPIRED' | 'PENDING_EXAM';
  specializations: string[];
  endorsements: string[];
}

export const FAA_SOV_CLASSES: FaaSovClass[] = [
  {
    classId: 'S-0',
    title: 'Sovereign Observer',
    scope: 'Visual monitoring only. No flight control.',
    requirements: [
      'Pass Sovereign Airspace Awareness written exam (50 questions, 80% minimum)',
      'Basic mesh node authentication verification',
    ],
    aircraftAllowed: 'None assigned (Ground Station Console only)',
    altitudeCeiling: 'N/A (Ground Operations)',
    nightOperations: 'Prohibited',
    bvlosAllowed: 'Prohibited',
    tokenGateEsc: 0,
    insuranceBondEsc: 0,
    renewalMonths: 24,
    badgeColor: '#6A8099',
    authorityLevel: 'Observer / Telemetry Monitor',
  },
  {
    classId: 'S-1',
    title: 'Recreational Sovereign Pilot',
    scope: 'Non-commercial flight within Sovereign recreational zones (Zone Gamma)',
    requirements: [
      'S-0 certification active',
      '5 hours logged flight time verified by Sovereign mesh telemetry',
      'Practical demonstration: takeoff, hover, waypoint circle, emergency RTH',
    ],
    aircraftAllowed: 'Class I (<250g) or Class II (250g-2kg)',
    altitudeCeiling: '400 ft AGL',
    nightOperations: 'Prohibited',
    bvlosAllowed: 'Prohibited (VLOS only)',
    tokenGateEsc: 100,
    insuranceBondEsc: 1000,
    renewalMonths: 12,
    badgeColor: '#00FF88',
    authorityLevel: 'Recreational Pilot',
  },
  {
    classId: 'S-2',
    title: 'Commercial Sovereign Operator (Part 107-SOV Equivalent)',
    scope: 'Commercial operations, package delivery, infrastructure surveillance, precision agriculture',
    requirements: [
      'S-1 certification active',
      '25 hours logged flight time (10 hours PIC)',
      'Written exam: Airspace law, weather, aerodynamics, Sovereign mesh protocols',
      'Practical exam: precision landing, waypoint navigation, payload drop, mesh handoff',
    ],
    aircraftAllowed: 'Class II (250g-25kg) or Class III (25kg-150kg)',
    altitudeCeiling: '400 ft AGL / 500 ft in Sovereign corridors',
    nightOperations: 'Permitted with anti-collision lighting (SOV-LIGHT-001 compliant)',
    bvlosAllowed: 'Permitted within Sovereign mesh coverage (max 3 miles from GCS)',
    tokenGateEsc: 5000,
    insuranceBondEsc: 50000,
    renewalMonths: 12,
    badgeColor: '#00D4FF',
    authorityLevel: 'Commercial Pilot in Command',
  },
  {
    classId: 'S-3',
    title: 'Advanced Sovereign Operator',
    scope: 'Swarm operations, urban canyon flight, hazardous material transport, counter-UAV defense',
    requirements: [
      'S-2 certification + 2 years operational experience',
      '100 hours logged flight time (50 hours PIC, 20 hours autonomous swarm)',
      'Advanced exam: swarm coordination, mesh entanglement, threat evasion, NULL protocol abort',
      'Practical exam: 4-UAV swarm formation, mesh-degraded navigation, emergency exfil',
    ],
    aircraftAllowed: 'Class III (25kg-150kg) or Class IV (>150kg, Sovereign-rated only)',
    altitudeCeiling: '1,200 ft AGL in Sovereign corridors',
    nightOperations: 'Permitted with thermal imaging and mesh-illuminated waypoints',
    bvlosAllowed: 'Permitted up to 10 miles with relay UAV mesh',
    tokenGateEsc: 25000,
    insuranceBondEsc: 250000,
    renewalMonths: 6,
    badgeColor: '#AA55FF',
    authorityLevel: 'Swarm Mission Specialist',
    specializationTracks: [
      'S-3A: Agricultural swarm (APOSTLE integration)',
      'S-3D: Delivery/logistics (MERCATOR integration)',
      'S-3I: Intelligence/surveillance (VIGIL integration)',
      'S-3X: Counter-UAV / defense (AEGIS-X integration)',
    ],
  },
  {
    classId: 'S-4',
    title: 'Sovereign Flight Commander',
    scope: 'Fleet command, mission planning, corridor coordination, treaty enforcement, lockdown control',
    requirements: [
      'S-3 certification + 5 years experience',
      '500 hours logged (200 hours PIC, 100 hours command)',
      'Command exam: fleet logistics, airspace treaties, sanctions enforcement, emergency NULL abort',
      'Practical exam: 16-UAV fleet coordination, multi-venue airspace negotiation, Resolute Desk integration',
    ],
    aircraftAllowed: 'All classes + command authority over subordinate pilots',
    altitudeCeiling: 'Unlimited in Sovereign-controlled corridors',
    nightOperations: 'Unlimited within mesh coverage',
    bvlosAllowed: 'Unlimited within mesh coverage',
    tokenGateEsc: 100000,
    insuranceBondEsc: 1000000,
    renewalMonths: 6,
    badgeColor: '#FFD700',
    authorityLevel: 'Flight Commander (ARPD-1 Clearance)',
  },
  {
    classId: 'S-5',
    title: 'Sovereign Airspace Architect',
    scope: 'Airspace design, corridor creation, mesh tower placement, international treaty drafting',
    requirements: [
      'S-4 certification + 10 years experience',
      '2,000 hours logged (500 hours command)',
      'Architect exam: international aviation law, mesh topology, Sovereign governance',
      'Thesis: Propose and defend a new airspace corridor with full economic and security analysis',
    ],
    aircraftAllowed: 'All classes + supreme corridor designation authority',
    altitudeCeiling: 'Unlimited / Orbital Transition Corridor Authority',
    nightOperations: 'Unlimited',
    bvlosAllowed: 'Unlimited',
    tokenGateEsc: 1000000,
    insuranceBondEsc: 10000000,
    renewalMonths: 12,
    badgeColor: '#C8A96A',
    authorityLevel: 'Airspace Architect (ARPD-3 Clearance)',
  },
];

export const AIRSPACE_ZONES: AirspaceZone[] = [
  {
    zoneId: 'Zone Alpha',
    name: 'Sovereign Core',
    altitudeRange: '0 - 1,200 ft AGL',
    minClass: 'S-3 and above',
    purpose: 'Diplomatic venues, executive transport, high-value cargo',
    enforcement: 'Active mesh surveillance, automatic sanctions for unauthorized entry',
    status: 'RESTRICTED',
    activeUavs: 3,
    color: '#AA55FF',
  },
  {
    zoneId: 'Zone Beta',
    name: 'Sovereign Commercial',
    altitudeRange: '0 - 400 ft AGL (500 ft in corridors)',
    minClass: 'S-2 and above',
    purpose: 'Delivery, agriculture, infrastructure inspection',
    enforcement: 'Periodic VIGIL sweeps, ESC fines for violations',
    status: 'CLEAR',
    activeUavs: 18,
    color: '#00D4FF',
  },
  {
    zoneId: 'Zone Gamma',
    name: 'Sovereign Recreational',
    altitudeRange: '0 - 200 ft AGL',
    minClass: 'S-1 and above',
    purpose: 'Personal flight, training, photography',
    enforcement: 'Community reporting, SRT deduction for reckless operation',
    status: 'CLEAR',
    activeUavs: 24,
    color: '#00FF88',
  },
  {
    zoneId: 'Zone Delta',
    name: 'Sovereign Restricted',
    altitudeRange: 'Variable / Surface to Unlimited',
    minClass: 'S-4 and above with mission auth',
    purpose: 'Military, intelligence, NULL protocol operations',
    enforcement: 'Lethal countermeasures authorized for unauthorized entry',
    status: 'LOCKED',
    activeUavs: 1,
    color: '#FF3355',
  },
];

export const VIOLATIONS_TABLE: ViolationRecord[] = [
  {
    violationId: 'VIO-001',
    title: 'VLOS breach (Visual Line of Sight)',
    severity: 'Minor',
    srtPenalty: -50,
    escFine: 500,
    licenseAction: 'Formal Warning',
    description: 'Operating beyond unassisted visual line of sight without authorized S-2/S-3 BVLOS permit.',
  },
  {
    violationId: 'VIO-002',
    title: 'Altitude exceedance (>400 ft AGL)',
    severity: 'Moderate',
    srtPenalty: -200,
    escFine: 2000,
    licenseAction: '30-day suspension',
    description: 'Exceeding designated altitude ceiling outside of approved Sovereign 3D transit corridors.',
  },
  {
    violationId: 'VIO-003',
    title: 'BVLOS without mesh authorization',
    severity: 'Serious',
    srtPenalty: -500,
    escFine: 10000,
    licenseAction: '90-day suspension',
    description: 'Operating BVLOS when Sovereign mesh coverage is degraded below 60% threshold.',
  },
  {
    violationId: 'VIO-004',
    title: 'Airspace intrusion into Zone Alpha',
    severity: 'Critical',
    srtPenalty: -2000,
    escFine: 50000,
    licenseAction: 'License Revocation',
    description: 'Unauthorized penetration into sovereign diplomatic venues or executive security enclaves.',
  },
  {
    violationId: 'VIO-005',
    title: 'Autonomous swarm collision / loss of sep',
    severity: 'Critical',
    srtPenalty: -5000,
    escFine: 100000,
    licenseAction: 'Revocation + Blacklist',
    description: 'Loss of inter-UAV separation resulting in swarm desynchronization or ground hazard.',
  },
  {
    violationId: 'VIO-006',
    title: 'Treaty airspace violation',
    severity: 'Severe',
    srtPenalty: -10000,
    escFine: 500000,
    licenseAction: 'Permanent ban + sanctions',
    description: 'Breaching international bilateral airspace corridors without Throne of Accords ratification.',
  },
  {
    violationId: 'VIO-007',
    title: 'NULL protocol abort failure',
    severity: 'Existential',
    srtPenalty: -50000,
    escFine: 1000000,
    licenseAction: 'Permanent ban + full quarantine',
    description: 'Failure to yield immediate flight control to supreme safety NULL protocol directive.',
  },
];

export const INITIAL_AIRCRAFT_REGISTRATIONS: AircraftRegistration[] = [
  {
    regNumber: 'SOV-UAV-001',
    manufacturer: 'Aegentix Aerospace',
    model: 'Apex Valkyrie X4',
    serialHash: '0x8f3c7e91d24a0b5c98',
    weightClass: 'Class II (250g-2kg)',
    propulsion: 'Electric',
    meshNodeId: 'MESH-NODE-48A',
    insuranceBondEsc: 50000,
    ownerAddress: 'rFAA-SOV-PILOT-SHALOMINATTII',
    registeredAt: '2026-03-15T08:00:00Z',
    expiresAt: '2028-03-15T08:00:00Z',
    airworthinessStatus: 'AIRWORTHY',
  },
  {
    regNumber: 'SOV-UAV-002',
    manufacturer: 'Sovereign Dynamics',
    model: 'Mercator Heavy Hauler 120',
    serialHash: '0x3b194a2ef77c6109dc',
    weightClass: 'Class III (25kg-150kg)',
    propulsion: 'Hybrid Turbine',
    meshNodeId: 'MESH-NODE-72B',
    insuranceBondEsc: 250000,
    ownerAddress: 'rFAA-SOV-PILOT-SHALOMINATTII',
    registeredAt: '2026-06-20T12:00:00Z',
    expiresAt: '2028-06-20T12:00:00Z',
    airworthinessStatus: 'AIRWORTHY',
  },
  {
    regNumber: 'SOV-UAV-003',
    manufacturer: 'Aegis Swarm Lab',
    model: 'Hornet Interceptor S-3X',
    serialHash: '0x44a17cd8939ef2a01b',
    weightClass: 'Class II (250g-2kg)',
    propulsion: 'Electric',
    meshNodeId: 'MESH-NODE-99X',
    insuranceBondEsc: 50000,
    ownerAddress: 'rAEGIS-DEFENSE-SWARM',
    registeredAt: '2026-08-10T14:30:00Z',
    expiresAt: '2028-08-10T14:30:00Z',
    airworthinessStatus: 'AIRWORTHY',
  },
];

export const INITIAL_PILOT_PROFILE: PilotLicenseProfile = {
  licenseId: 'FAA-SOV-2026-008492',
  principal: 'shalominattii-us',
  ownerAddress: 'rFAA-SOV-PILOT-SHALOMINATTII',
  classLevel: 'S-2',
  issueDate: '2026-04-12',
  expiryDate: '2027-04-12',
  escStaked: 50000,
  flightHoursLogged: 48.5,
  picHoursLogged: 22.0,
  swarmHoursLogged: 8.5,
  meshReliabilityPct: 99.4,
  registryContract: 'rFAA-SOV-REGISTRY',
  qrVerificationUrl: 'https://xrpl.org/tx/SOV-FAA-001-SHALOMINATTII-VERIFIED',
  status: 'ACTIVE_CERTIFIED',
  specializations: ['Part 107-SOV Commercial', 'Night Vision (SOV-LIGHT-001)', '3-Mile Mesh BVLOS'],
  endorsements: ['IUSTITIA-001 Legal Accreditation', 'VIGIL-001 Radar Clearance', 'CUSTOS Escrow Bond Locked'],
};

export const SAMPLE_EXAM_QUESTIONS = [
  {
    id: 1,
    question: 'Under Addendum A, what is the mandatory action when Sovereign mesh coverage drops below 60% during commercial flight?',
    options: [
      'Increase throttle and climb to Zone Alpha to acquire satellite link',
      'Abort flight immediately and execute safe landing in nearest designated safe zone',
      'Switch to non-Sovereign cellular fallback and continue delivery',
      'Request automated override from FORGE-001 co-pilot',
    ],
    correctAnswer: 1,
    explanation: 'Addendum A specifies: If mesh degrades below 60% coverage, operations must abort to nearest safe zone. Failure triggers automatic NULL protocol evaluation.',
  },
  {
    id: 2,
    question: 'What is the maximum permissible altitude for Class S-2 Commercial Operators in designated Sovereign Corridors?',
    options: [
      '200 ft AGL',
      '400 ft AGL outside corridors / 500 ft AGL inside Sovereign corridors',
      '1,200 ft AGL without restriction',
      'Unlimited under optical laser relay',
    ],
    correctAnswer: 1,
    explanation: 'Class S-2 permits 400 ft AGL standard, expanding to 500 ft AGL inside established Sovereign corridors.',
  },
  {
    id: 3,
    question: 'Which authority holds jurisdiction over FAA-SOV license adjudication and airspace sanctions?',
    options: [
      'Federal District Court of Delaware',
      'IUSTITIA-001 presiding in the Tribunal of Chains (48° Venue)',
      'Local municipal municipal police department',
      'Unanchored decentralized autonomous organization',
    ],
    correctAnswer: 1,
    explanation: 'Issuing and adjudicating authority is IUSTITIA-001 (Attorney General, Tribunal of Chains, 48° venue).',
  },
  {
    id: 4,
    question: 'What is the penalty for an unauthorized airspace intrusion into Zone Alpha (Sovereign Core)?',
    options: [
      'Written warning and 50 ESC administrative fee',
      '10-day suspension and 500 ESC fine',
      'Loss of 2,000 SRT, 50,000 ESC fine, and immediate License Revocation',
      'Temporary reroute with zero financial penalty',
    ],
    correctAnswer: 2,
    explanation: 'Zone Alpha intrusion is categorized as Critical severity: -2,000 SRT, 50,000 ESC fine, and license revocation.',
  },
];
