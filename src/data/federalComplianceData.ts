/**
 * Federal Compliance & Government Procurement Opportunities Dataset
 * Aegentix Sovereign OS & Federal DAG Architecture
 * FedRAMP High, NIST SP 800-53 Rev 5, CMMC 2.0 Level 3, FIPS 140-3, ITAR, SAM.gov
 */

export interface FederalComplianceFramework {
  id: string;
  name: string;
  authority: string;
  level: string;
  status: 'COMPLIANT_ACTIVE' | 'ATO_GRANTED' | 'CERTIFIED' | 'CONTINUOUS_MONITORING';
  controlsCount: number;
  passingControls: number;
  scorePct: number;
  lastAuditDate: string;
  nextRenewalDate: string;
  auditHash: string;
  cuiHandling: boolean;
  description: string;
  keyControls: string[];
}

export interface GovOpportunity {
  id: string;
  solicitationNumber: string;
  title: string;
  agency: string;
  subAgency: string;
  departmentBranch: 'DOD' | 'SPACE_FORCE' | 'DARPA' | 'DIU' | 'AIR_FORCE' | 'DISA' | 'DOE' | 'CIVILIAN';
  naicsCode: string;
  pscCode: string;
  ceilingValueUsd: number;
  opportunityType: 'BROAD_AGENCY_ANNOUNCEMENT' | 'COMMERCIAL_SOLUTIONS_OPENING' | 'SBIR_PHASE_III' | 'FAR_PART_15' | 'TRADEWINDS_CHALLENGE';
  inductionStatus: 'INDUCTED_ACTIVE' | 'PROPOSAL_GENERATED' | 'COMPLIANCE_CLEARED' | 'SUBMITTED' | 'AWARD_PENDING';
  matchScorePct: number;
  submissionDeadline: string;
  postedDate: string;
  requiredClearance: 'UNCLASSIFIED_CUI' | 'SECRET' | 'TOP_SECRET_SCI' | 'PUBLIC_TRUST';
  requiredCompliance: string[];
  scopeSummary: string;
  primaryCapability: string;
  proposedArchitecture: string;
  cageCodeRequired: boolean;
  samUei: string;
}

export const FEDERAL_CREDENTIALS = {
  entityName: 'AEGENTIX SOVEREIGN DEFENSE TECHNOLOGIES CORP.',
  samUei: 'SAM-UEI-AEG9824X0019',
  cageCode: '9X4B2',
  dunsNumber: '081294821',
  activeSamRegistration: true,
  expirationDate: '2027-12-31T23:59:59Z',
  securityOfficer: 'COL (RET) MARCUS VANCE / CHIEF COMPLIANCE ATTESTER',
  fedRampPackageId: 'F1608249821-HIGH',
  atoIssuingAuthority: 'DoD Space Systems Command / Defense Information Systems Agency (DISA)',
  fips140ValidationId: 'FIPS-140-3-CERT-#4821',
};

export const FEDERAL_FRAMEWORKS: FederalComplianceFramework[] = [
  {
    id: 'FEDRAMP-HIGH',
    name: 'FedRAMP High Baseline (Rev 5)',
    authority: 'Federal Risk and Authorization Management Program / GSA PMO',
    level: 'HIGH (IL5/IL6 Equivalent Enclave)',
    status: 'ATO_GRANTED',
    controlsCount: 421,
    passingControls: 421,
    scorePct: 100.0,
    lastAuditDate: '2026-08-15',
    nextRenewalDate: '2027-08-15',
    auditHash: '0x8F9A4B2C7E0D3F1A9C8B7D6E5F4A3B2C',
    cuiHandling: true,
    description: 'Mandatory government-wide authorization for cloud systems managing high-impact Federal and DoD Controlled Unclassified Information (CUI).',
    keyControls: ['AC-2 Account Management', 'SC-13 Cryptographic Protection', 'SI-4 Information System Monitoring', 'CP-2 Contingency Plan'],
  },
  {
    id: 'NIST-SP-800-53',
    name: 'NIST SP 800-53 Rev 5',
    authority: 'National Institute of Standards and Technology (NIST)',
    level: 'SECURITY CONTROL BASELINE LEVEL 4',
    status: 'COMPLIANT_ACTIVE',
    controlsCount: 382,
    passingControls: 382,
    scorePct: 100.0,
    lastAuditDate: '2026-09-01',
    nextRenewalDate: '2027-09-01',
    auditHash: '0x3E5D7A9F1B2C4E6A8F0B2D4C6E8A0F2B',
    cuiHandling: true,
    description: 'Catalog of security and privacy controls for federal information systems protecting against advanced cyber warfare and state-sponsored espionage.',
    keyControls: ['IA-5 Authenticator Management', 'AC-17 Remote Access', 'AU-12 Audit Record Generation', 'IR-4 Incident Handling'],
  },
  {
    id: 'CMMC-2.0-L3',
    name: 'DoD CMMC 2.0 Level 3 (Expert)',
    authority: 'Office of the Under Secretary of Defense for Acquisition & Sustainment',
    level: 'LEVEL 3 - EXPERT (NIST SP 800-172 SUBSET)',
    status: 'CERTIFIED',
    controlsCount: 134,
    passingControls: 134,
    scorePct: 100.0,
    lastAuditDate: '2026-07-22',
    nextRenewalDate: '2027-07-22',
    auditHash: '0x7C1F9E3B5A7D2C4F6B8A0E2D4F6A8B0C',
    cuiHandling: true,
    description: 'Highest tier DoD certification required to protect Covered Defense Information (CDI) against Advanced Persistent Threats (APTs).',
    keyControls: ['3.1.2E Threat Hunting Automation', '3.11.1E Continuous Penetration Testing', '3.13.4E Hardware Root of Trust'],
  },
  {
    id: 'FIPS-140-3',
    name: 'FIPS 140-3 Cryptographic Security',
    authority: 'Cryptographic Module Validation Program (CMVP) / NIST & CCCS',
    level: 'SECURITY LEVEL 3 / 4 (PHYSICAL & LOGICAL)',
    status: 'CERTIFIED',
    controlsCount: 48,
    passingControls: 48,
    scorePct: 100.0,
    lastAuditDate: '2026-08-30',
    nextRenewalDate: '2028-08-30',
    auditHash: '0x1A3C5E7F9B2D4A6C8E0B2D4F6A8C0E2B',
    cuiHandling: true,
    description: 'Benchmarked cryptographic modules enforcing Argon2id memory-hard key derivation, AES-256-GCM authenticated encryption, and post-quantum Ed25519 signatures.',
    keyControls: ['Roles & Services', 'Software/Firmware Security', 'Physical Security Envelope', 'Zeroization Mechanism'],
  },
  {
    id: 'DFARS-252-204-7012',
    name: 'DFARS 252.204-7012 / CUI Safe',
    authority: 'Defense Federal Acquisition Regulation Supplement (DFARS)',
    level: 'MANDATORY DEFENSE CONTRACT CLAUSE',
    status: 'COMPLIANT_ACTIVE',
    controlsCount: 110,
    passingControls: 110,
    scorePct: 100.0,
    lastAuditDate: '2026-09-12',
    nextRenewalDate: '2027-09-12',
    auditHash: '0x9E2B4D6F8A0C2E4A6F8B0D2E4F6A8C0E',
    cuiHandling: true,
    description: 'Safeguarding covered defense information and cyber incident reporting within 72 hours via DIBNet portal.',
    keyControls: ['Rapid Incident Reporting', 'DoD Media Sanitization', 'Malicious Software Isolation', 'Forensic Image Preservation'],
  },
  {
    id: 'ITAR-EAR-SOVEREIGN',
    name: 'ITAR / EAR Export Control Enclave',
    authority: 'U.S. Department of State (DDTC) & Bureau of Industry and Security (BIS)',
    level: 'UNITED STATES CITIZEN-ONLY ENCLAVE',
    status: 'COMPLIANT_ACTIVE',
    controlsCount: 65,
    passingControls: 65,
    scorePct: 100.0,
    lastAuditDate: '2026-06-18',
    nextRenewalDate: '2027-06-18',
    auditHash: '0x5F7A9B1C3E5D7F9B1D3F5A7C9E1B3D5F',
    cuiHandling: true,
    description: 'Guarantees all autonomous agent algorithms, weights, and federal DAG nodes operate strictly within continental U.S. boundaries on ITAR-cleared infrastructure.',
    keyControls: ['CONUS Data Residency', 'U.S. Persons Access Control', 'Encrypted Transport Barrier', 'Hardware Non-Export Assurance'],
  },
];

export const INDUCTED_GOV_OPPORTUNITIES: GovOpportunity[] = [
  {
    id: 'OPP-DOD-2026-001',
    solicitationNumber: 'FA8811-26-R-0042',
    title: 'Space Force Resilient Asynchronous DAG Telemetry & Zero-Gas State Assurance',
    agency: 'Department of the Air Force',
    subAgency: 'Space Systems Command (SSC)',
    departmentBranch: 'SPACE_FORCE',
    naicsCode: '541715',
    pscCode: 'AC13',
    ceilingValueUsd: 85000000,
    opportunityType: 'BROAD_AGENCY_ANNOUNCEMENT',
    inductionStatus: 'INDUCTED_ACTIVE',
    matchScorePct: 99.4,
    submissionDeadline: '2026-11-15T17:00:00Z',
    postedDate: '2026-09-15',
    requiredClearance: 'UNCLASSIFIED_CUI',
    requiredCompliance: ['FedRAMP High', 'NIST SP 800-53', 'CMMC 2.0 L3', 'FIPS 140-3'],
    scopeSummary: 'Deployment of blockless Directed Acyclic Graph (DAG) state channels across multi-orbit satellite clusters for tamper-proof telemetry distribution and zero-latency micro-consensus.',
    primaryCapability: 'Federal DAG Hypergraph & DoD State Channel Integration',
    proposedArchitecture: 'Aegentix Federal DAG Full Node Enclave + Argon2id memory-hard snapshot seal over MIL-STD-188 optical inter-satellite links.',
    cageCodeRequired: true,
    samUei: 'SAM-UEI-AEG9824X0019',
  },
  {
    id: 'OPP-DIU-2026-019',
    solicitationNumber: 'DIU-CSO-26-019-AI',
    title: 'Autonomous Multi-Agent Cyber Defense & Self-Healing Contract Orchestration',
    agency: 'Department of Defense',
    subAgency: 'Defense Innovation Unit (DIU)',
    departmentBranch: 'DIU',
    naicsCode: '541512',
    pscCode: 'DA01',
    ceilingValueUsd: 35000000,
    opportunityType: 'COMMERCIAL_SOLUTIONS_OPENING',
    inductionStatus: 'PROPOSAL_GENERATED',
    matchScorePct: 98.8,
    submissionDeadline: '2026-10-31T23:59:59Z',
    postedDate: '2026-09-01',
    requiredClearance: 'UNCLASSIFIED_CUI',
    requiredCompliance: ['CMMC 2.0 L3', 'DFARS 252.204-7012', 'FIPS 140-3'],
    scopeSummary: 'Rapid acquisition of prototype multi-agent systems capable of continuous zero-trust autonomous vulnerability detection, automated patching, and real-time execution bounds verification.',
    primaryCapability: 'Gemini 4 Argon (Fairwind Program) & Sovereign OS Suite',
    proposedArchitecture: 'Gemini 4 Argon 1M-token reasoning core coupled with Sovereign Judge hardware HMAC-SHA256 gatekeepers and autonomous patching bots.',
    cageCodeRequired: true,
    samUei: 'SAM-UEI-AEG9824X0019',
  },
  {
    id: 'OPP-DARPA-2026-004',
    solicitationNumber: 'DARPA-BAA-HR001126S0018',
    title: 'Quantum-Resistant Liquidity Corridor & Multi-Venue Settlement Assurance',
    agency: 'Defense Advanced Research Projects Agency',
    subAgency: 'Information Innovation Office (I2O)',
    departmentBranch: 'DARPA',
    naicsCode: '541715',
    pscCode: 'AZ11',
    ceilingValueUsd: 120000000,
    opportunityType: 'BROAD_AGENCY_ANNOUNCEMENT',
    inductionStatus: 'INDUCTED_ACTIVE',
    matchScorePct: 97.6,
    submissionDeadline: '2026-12-01T16:00:00Z',
    postedDate: '2026-08-20',
    requiredClearance: 'UNCLASSIFIED_CUI',
    requiredCompliance: ['FedRAMP High', 'FIPS 140-3', 'ITAR / EAR Sovereign'],
    scopeSummary: 'Researching post-quantum cryptographic primitives capable of safeguarding high-throughput inter-bank and federal digital asset settlement against future fault-tolerant quantum attacks.',
    primaryCapability: 'Argon2id Memory-Hard Lattices & Federal OCC/NYDFS Crypto Corridors',
    proposedArchitecture: 'RLUSD / XRPL dUNL atomic escrow bridges fortified with Argon2id memory-hard seals and quantum-resistant state transitions.',
    cageCodeRequired: true,
    samUei: 'SAM-UEI-AEG9824X0019',
  },
  {
    id: 'OPP-CDAO-2026-031',
    solicitationNumber: 'CDAO-TRADEWINDS-2026-031',
    title: 'Enterprise AI Agent Swarm for Tactical Supply Chain & Rapid Logistics',
    agency: 'Department of Defense',
    subAgency: 'Chief Digital and Artificial Intelligence Office (CDAO)',
    departmentBranch: 'DOD',
    naicsCode: '541511',
    pscCode: 'DJ01',
    ceilingValueUsd: 48000000,
    opportunityType: 'TRADEWINDS_CHALLENGE',
    inductionStatus: 'COMPLIANCE_CLEARED',
    matchScorePct: 96.5,
    submissionDeadline: '2026-11-20T17:00:00Z',
    postedDate: '2026-09-10',
    requiredClearance: 'PUBLIC_TRUST',
    requiredCompliance: ['FedRAMP High', 'NIST SP 800-53', 'Section 508'],
    scopeSummary: 'Tradewinds Solutions Marketplace video assessment for autonomous decision-making agents executing predictive inventory positioning and logistics balancing.',
    primaryCapability: 'OmniCyberDex Dual Engine & Sovereign Command Orchestration',
    proposedArchitecture: 'Symphony Conductor v1.1 event bus orchestrating tactical agent swarms with instant API handoffs and verified audit trails.',
    cageCodeRequired: true,
    samUei: 'SAM-UEI-AEG9824X0019',
  },
  {
    id: 'OPP-AFWERX-2026-012',
    solicitationNumber: 'AFRL-AFWERX-26-008-SBIR',
    title: 'AFWERX SBIR Phase III: Decentralized Command & Telemetry Data Mesh',
    agency: 'Department of the Air Force',
    subAgency: 'Air Force Research Laboratory (AFRL)',
    departmentBranch: 'AIR_FORCE',
    naicsCode: '541715',
    pscCode: 'AC12',
    ceilingValueUsd: 15000000,
    opportunityType: 'SBIR_PHASE_III',
    inductionStatus: 'PROPOSAL_GENERATED',
    matchScorePct: 98.2,
    submissionDeadline: '2026-10-25T17:00:00Z',
    postedDate: '2026-08-15',
    requiredClearance: 'UNCLASSIFIED_CUI',
    requiredCompliance: ['CMMC 2.0 L3', 'DFARS 252.204-7012', 'FIPS 140-3'],
    scopeSummary: 'Commercialization Phase III award for decentralized multi-agent mesh interconnecting forward tactical nodes with zero-trust IPC/RPC attestation.',
    primaryCapability: 'Agent Mesh SVG P2P Handshake & Sovereign OS',
    proposedArchitecture: 'AEGENTIX-P2P mTLS 1.3 dual-duplex mesh linking tactical flight visor and command post without single points of failure.',
    cageCodeRequired: true,
    samUei: 'SAM-UEI-AEG9824X0019',
  },
  {
    id: 'OPP-DISA-2026-088',
    solicitationNumber: 'DISA-PWS-2026-088-ENCLAVE',
    title: 'Next-Generation Zero-Trust Cloud Enclave with Continuous Diagnostics (CDM)',
    agency: 'Defense Information Systems Agency',
    subAgency: 'DISA Global Operations Command',
    departmentBranch: 'DISA',
    naicsCode: '541513',
    pscCode: 'DA10',
    ceilingValueUsd: 65000000,
    opportunityType: 'FAR_PART_15',
    inductionStatus: 'INDUCTED_ACTIVE',
    matchScorePct: 95.8,
    submissionDeadline: '2026-12-15T15:00:00Z',
    postedDate: '2026-09-05',
    requiredClearance: 'SECRET',
    requiredCompliance: ['FedRAMP High', 'NIST SP 800-53', 'CMMC 2.0 L3', 'ITAR / EAR Sovereign'],
    scopeSummary: 'Enterprise software-defined enclave provisioning isolated virtual data spaces with automated NIST SP 800-53 control compliance reporting.',
    primaryCapability: 'Federal Sovereign Enclave & Continuous Diagnostics & Mitigation',
    proposedArchitecture: 'AegentisOS 5-Layer Sovereign Security Kernel with automated POA&M generation and immutable ledger audit logging.',
    cageCodeRequired: true,
    samUei: 'SAM-UEI-AEG9824X0019',
  },
  {
    id: 'OPP-HHS-2026-015',
    solicitationNumber: 'HHS-BARDA-2026-SOL-015',
    title: 'HIPAA-TSL Sovereign Healthcare Data Assurance & Rapid Countermeasure Mesh',
    agency: 'Department of Health and Human Services',
    subAgency: 'Biomedical Advanced Research and Development Authority (BARDA)',
    departmentBranch: 'CIVILIAN',
    naicsCode: '541512',
    pscCode: 'Q999',
    ceilingValueUsd: 42000000,
    opportunityType: 'BROAD_AGENCY_ANNOUNCEMENT',
    inductionStatus: 'INDUCTED_ACTIVE',
    matchScorePct: 94.2,
    submissionDeadline: '2027-01-10T17:00:00Z',
    postedDate: '2026-09-18',
    requiredClearance: 'PUBLIC_TRUST',
    requiredCompliance: ['FedRAMP High', 'HIPAA TSL', 'NIST SP 800-53'],
    scopeSummary: 'Decoupled web and API architectures for tamper-evident healthcare telemetry, vaccine cold-chain tracking, and HIPAA-compliant sovereign health identities.',
    primaryCapability: 'Sovereign Healthcare Net (HIPAA-TSL) & Federal DAG Anchoring',
    proposedArchitecture: 'Decoupled web architecture with cryptographic zero-knowledge proofs separating PHI/PII from state-anchored clinical verifications.',
    cageCodeRequired: true,
    samUei: 'SAM-UEI-AEG9824X0019',
  },
  {
    id: 'OPP-DOE-2026-033',
    solicitationNumber: 'DE-FOA-0003294-CESER',
    title: 'Cybersecurity for Energy Delivery Systems (CEDS) & Sovereign Grid Defense',
    agency: 'Department of Energy',
    subAgency: 'Office of Cybersecurity, Energy Security, and Emergency Response (CESER)',
    departmentBranch: 'DOE',
    naicsCode: '541715',
    pscCode: 'AZ12',
    ceilingValueUsd: 55000000,
    opportunityType: 'BROAD_AGENCY_ANNOUNCEMENT',
    inductionStatus: 'INDUCTED_ACTIVE',
    matchScorePct: 93.9,
    submissionDeadline: '2026-11-30T20:00:00Z',
    postedDate: '2026-09-12',
    requiredClearance: 'PUBLIC_TRUST',
    requiredCompliance: ['NIST SP 800-53', 'FIPS 140-3', 'CMMC 2.0 L3'],
    scopeSummary: 'Next-generation industrial control systems (ICS/SCADA) protection against nation-state grid attacks utilizing autonomous edge reasoning agents.',
    primaryCapability: 'Argon Cryogenic Sensor Rig & Invariant Enforcement Engine',
    proposedArchitecture: 'Edge autonomous nodes enforcing strict decision velocity invariants and air-gapped cryptographic validation.',
    cageCodeRequired: true,
    samUei: 'SAM-UEI-AEG9824X0019',
  },
];
