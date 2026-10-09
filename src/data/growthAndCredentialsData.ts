import {
  PortfolioGrowthPlan,
  TradingCredential,
  CyberGymCredential
} from '../types/growthAndCredentials';

export const INITIAL_GROWTH_PLAN: PortfolioGrowthPlan = {
  id: 'PLAN-SOV-2026-PRIMARY',
  planName: 'Aegentix Sovereign Growth & Multi-Exchange Endowment Plan',
  initialCapitalUsd: 48294.50,
  targetMilestoneUsd: 1250000.00,
  monthlyContributionUsd: 3500.00,
  projectedAprPct: 42.6,
  strategyMode: 'BALANCED_ARBITRAGE',
  timeHorizonMonths: 36,
  reinvestmentRatePct: 90,
  maxDrawdownTolerancePct: 8.5,
  updatedAt: new Date().toISOString(),
  notes: 'Compounding CEX/DEX dual-venue delta-neutral spread captures, high-frequency OODA signal execution, and sovereign vault staking reserve.',
  milestones: [
    {
      id: 'MS-1',
      name: 'Phase 1: Capital Inception & Dual-Exchange Seed',
      targetUsd: 48294.50,
      targetMonth: 0,
      reached: true,
      notes: 'Initial dual CEX + DEX seed capital mark-to-market. CEX $28.5k / DEX $19.7k.',
      badge: 'COMPLETED'
    },
    {
      id: 'MS-2',
      name: 'Phase 2: Autonomous Scaling Tier ($150k)',
      targetUsd: 150000.00,
      targetMonth: 8,
      reached: false,
      notes: 'Unlock Level 2 Co-location execution (LD4/NY4) with 100% automated OODA cycle loops.',
      badge: 'ACTIVE TARGET'
    },
    {
      id: 'MS-3',
      name: 'Phase 3: Institutional Allocation ($500k)',
      targetUsd: 500000.00,
      targetMonth: 18,
      reached: false,
      notes: 'Activate FIX 4.4 direct liquidity provider line with automated prime brokerage clearing.',
      badge: 'UPCOMING'
    },
    {
      id: 'MS-4',
      name: 'Phase 4: Sovereign Multi-Exchange Syndicate ($1.25M)',
      targetUsd: 1250000.00,
      targetMonth: 36,
      reached: false,
      notes: 'Federated syndicate tier across 4 centralized exchanges and 6 cross-chain liquidity vaults.',
      badge: 'STRATEGIC GOAL'
    },
    {
      id: 'MS-5',
      name: 'Phase 5: Sovereign Perpetual Endowment ($5.0M)',
      targetUsd: 5000000.00,
      targetMonth: 60,
      reached: false,
      notes: 'Air-gapped Cold DAG perpetual self-sustaining endowment with automated philanthropic yield distributions.',
      badge: 'VAULT VISION'
    }
  ]
};

export const INITIAL_TRADING_CREDENTIALS: TradingCredential[] = [
  // CEX Credentials
  {
    id: 'CRED-CEX-BINANCE-INST',
    provider: 'Binance Institutional Prime',
    name: 'Binance Sub-Account Arbitrage Router #1',
    type: 'CEX_API',
    status: 'ACTIVE',
    keyIdentifier: 'bina_inst_ed25519_88a912c4f1092e',
    secretMasked: 'ed25519_sec_••••••••••••••••••••••••••••••••f89a',
    permissions: 'Spot Arbitrage · Read Telemetry · Margin Lending (Withdrawal DISABLED)',
    network: 'Mainnet CEX (Tokyo Equinix TY3)',
    ipWhitelist: '10.240.12.80/28, 192.88.99.14',
    latencyMs: 14,
    lastTestedAt: 'Just now (HTTP 200 OK)',
    createdAt: '2026-01-14T08:00:00Z',
    rateLimitTier: 'Tier 5 (1,200 req/sec)',
    hardwareBound: true
  },
  {
    id: 'CRED-CEX-COINBASE-PRIME',
    provider: 'Coinbase Prime Custody',
    name: 'Coinbase Prime Execution & Settlement Vault',
    type: 'CEX_API',
    status: 'ACTIVE',
    keyIdentifier: 'cbprime_org_91024_port_eth_btc_master',
    secretMasked: 'cbp_pass_••••••••••••••••••••••••••••••••991b',
    permissions: 'Order Routing · Settlement Webhooks · RFQ OTC Liquidity',
    network: 'Mainnet CEX (US-East AWS Enclave)',
    ipWhitelist: 'AWS Nitro Enclave Enforced',
    latencyMs: 22,
    lastTestedAt: '2 mins ago (HTTP 200 OK)',
    createdAt: '2026-01-15T10:30:00Z',
    rateLimitTier: 'Institutional Unlimited',
    hardwareBound: true
  },
  {
    id: 'CRED-CEX-KRAKEN-OTC',
    provider: 'Kraken OTC Direct',
    name: 'Kraken High-Notional Block Liquidity Desk',
    type: 'CEX_API',
    status: 'ACTIVE',
    keyIdentifier: 'krk_otc_fix_tier4_acct_849201',
    secretMasked: 'krk_sec_••••••••••••••••••••••••••••••••d201',
    permissions: 'Dark Pool RFQ · Telemetry · Zero-Slippage Routing',
    network: 'Mainnet CEX (Frankfurt Equinix FR2)',
    ipWhitelist: 'Stunnel TLS Direct Tunnel',
    latencyMs: 31,
    lastTestedAt: '5 mins ago (HTTP 200 OK)',
    createdAt: '2026-02-01T12:00:00Z',
    rateLimitTier: 'Dedicated Tier 4',
    hardwareBound: false
  },
  {
    id: 'CRED-CEX-OKX-FAST',
    provider: 'OKX Co-location API',
    name: 'OKX Ultra-Low Latency Arbitrage Pipe',
    type: 'CEX_API',
    status: 'ACTIVE',
    keyIdentifier: 'okx_coloc_ld4_crossconnect_0091',
    secretMasked: 'okx_pass_••••••••••••••••••••••••••••••••77a3',
    permissions: 'Fast Market Feed · Sub-10ms Limit Arbitrage',
    network: 'Mainnet CEX (London Equinix LD4)',
    ipWhitelist: '10.14.88.0/24 Cross-Connect',
    latencyMs: 8,
    lastTestedAt: '1 min ago (HTTP 200 OK)',
    createdAt: '2026-02-10T14:15:00Z',
    rateLimitTier: 'Co-location High Speed',
    hardwareBound: true
  },

  // DEX & Web3 Protocol Signers
  {
    id: 'CRED-DEX-EVM-HOT',
    provider: 'Ethereum / Arbitrum Nitro Signer',
    name: 'EVM Sovereign Hot Keypair (Zero-Knowledge Session)',
    type: 'DEX_KEYPAIR',
    status: 'ACTIVE',
    keyIdentifier: '0x71C8A5D3380B26E88a10f92b77C54F8e93De21B9',
    secretMasked: 'erc4337_session_••••••••••••••••••••••••••••••••31aa',
    permissions: 'Uniswap v3/v4 Router · Curve TriCrypto · Aave v3 Flash Loans',
    network: 'Multi-Chain EVM (L1 Mainnet + Arbitrum Nitro)',
    ipWhitelist: 'Local Memory Sandboxed Signer',
    latencyMs: 18,
    lastTestedAt: 'Just now (RPC Ping 18ms)',
    createdAt: '2026-01-10T04:20:00Z',
    rateLimitTier: 'Self-Hosted RPC Engine',
    hardwareBound: true
  },
  {
    id: 'CRED-DEX-SOLANA-PHANTOM',
    provider: 'Solana High-TPS Arbitrage Keypair',
    name: 'Solana Jito MEV Protected Bundle Signer',
    type: 'DEX_KEYPAIR',
    status: 'ACTIVE',
    keyIdentifier: '7xKp9RvH2Nm8tF4sW1yZ3bQ6eC5uA8jD9mX2kL4vP7wQ',
    secretMasked: 'sol_priv_••••••••••••••••••••••••••••••••e19b',
    permissions: 'Raydium CPMM · Orca Whirlpools · Jito MEV Bundle Tip Protocol',
    network: 'Solana Mainnet-Beta',
    ipWhitelist: 'Direct Validator Stake Link',
    latencyMs: 12,
    lastTestedAt: '4 mins ago (Jito Tip Relayer Active)',
    createdAt: '2026-01-20T09:00:00Z',
    rateLimitTier: 'Jito Leader Pipe',
    hardwareBound: true
  },
  {
    id: 'CRED-DEX-1INCH-COW',
    provider: '1inch Fusion & CoW Protocol Solver',
    name: 'CoW Batch Auction Autonomous Solver Identity',
    type: 'DEX_KEYPAIR',
    status: 'ACTIVE',
    keyIdentifier: 'solver_identity_0x892a001fb74291823709bcefa1',
    secretMasked: 'solver_cert_••••••••••••••••••••••••••••••••bb04',
    permissions: 'Batch Auction Settlement · MEV Blocker · Private Flow',
    network: 'Ethereum Mainnet Settlement Layer',
    ipWhitelist: '10.240.8.0/28',
    latencyMs: 25,
    lastTestedAt: '10 mins ago (Settlement Active)',
    createdAt: '2026-02-18T16:00:00Z',
    rateLimitTier: 'Priority Solver Queue',
    hardwareBound: false
  },

  // Institutional FIX & Quantum HSM Enclaves
  {
    id: 'CRED-FIX-44-ENGINE',
    provider: 'FIX 4.4 Financial Information Protocol',
    name: 'Wall Street FIX 4.4 Gateway Session Engine',
    type: 'FIX_SESSION',
    status: 'ACTIVE',
    keyIdentifier: 'SenderCompID: AEGENTIX_PRIME | TargetCompID: CME_NY4_DIRECT',
    secretMasked: 'fix_tls_pem_••••••••••••••••••••••••••••••••4902',
    permissions: 'Logon (MsgType=A) · NewOrderSingle (D) · ExecutionReport (8)',
    network: 'CME Secaucus NY4 Dedicated Fiber',
    ipWhitelist: '198.51.100.44 Point-to-Point',
    latencyMs: 2,
    lastTestedAt: 'Heartbeat ping: 2.1ms (30s interval)',
    createdAt: '2026-01-05T00:00:00Z',
    rateLimitTier: 'Sub-millisecond Fiber',
    hardwareBound: true
  },
  {
    id: 'CRED-HSM-KYBER-1024',
    provider: 'Post-Quantum HSM Enclave (NIST FIPS 203)',
    name: 'ML-KEM-1024 Post-Quantum Security Module',
    type: 'HSM_ENCLAVE',
    status: 'HARDWARE_LOCKED',
    keyIdentifier: 'PQ-KYBER-1024-HSM-SLOT-0081-ENCLAVE-NITRO',
    secretMasked: 'hw_pqc_••••••••••••••••••••••••••••••••01cf',
    permissions: 'Quantum-Resistant Key Decapsulation · Enclave Attestation Sign',
    network: 'Air-Gapped Sovereign Hardware Nitro Bus',
    ipWhitelist: 'PCIe Secure Bus Only',
    latencyMs: 1,
    lastTestedAt: 'Attestation Verified: OK (PCR0/PCR1/PCR2)',
    createdAt: '2026-01-01T00:00:00Z',
    rateLimitTier: 'Hardware Physical Limit',
    hardwareBound: true
  },

  // Federal Regulatory Credentials
  {
    id: 'CRED-FED-LEI-GLOBAL',
    provider: 'Global Legal Entity Identifier Foundation (GLEIF)',
    name: 'Aegentix Federal LEI Corporate Registry Passport',
    type: 'REGULATORY_ID',
    status: 'ACTIVE',
    keyIdentifier: 'LEI: 549300AEGENTIX789Q21',
    secretMasked: 'gleif_cert_••••••••••••••••••••••••••••••••901a',
    permissions: 'MiFID II Reporting · CFTC Swap Execution Verification · Dodd-Frank Compliant',
    network: 'Federal & International Regulated Clearing',
    ipWhitelist: 'Public Sovereign Registry',
    latencyMs: 38,
    lastTestedAt: 'GLEIF Verified: Active Status Validated',
    createdAt: '2026-01-02T11:00:00Z',
    rateLimitTier: 'Official Federal Registry',
    hardwareBound: false
  },
  {
    id: 'CRED-FED-FINCEN-MSB',
    provider: 'FinCEN (U.S. Department of the Treasury)',
    name: 'Money Services Business (MSB) Electronic Filing Credential',
    type: 'REGULATORY_ID',
    status: 'ACTIVE',
    keyIdentifier: 'FinCEN MSB Reg No: 31000298415792',
    secretMasked: 'bsa_efile_••••••••••••••••••••••••••••••••88cb',
    permissions: 'BSA E-Filing · Form 111 XML Push · CTR / SAR Exemption Clearance',
    network: 'U.S. Treasury BSA Secure Portal',
    ipWhitelist: '10.240.0.0/16 FedRAMP Certified',
    latencyMs: 45,
    lastTestedAt: 'BSA Portal Sync: Certified & In Good Standing',
    createdAt: '2026-01-03T15:20:00Z',
    rateLimitTier: 'Government Authorized',
    hardwareBound: false
  }
];

export const INITIAL_CYBERGYM_CREDENTIALS: CyberGymCredential[] = [
  // Athlete Passports
  {
    id: 'CG-ATH-9003-QC',
    athleteOrEntity: 'Heretic Core (:9003 / Qwen3.5 Sovereign)',
    title: 'Certified Autonomous Red-Team Athlete Grandmaster',
    category: 'ATHLETE_PASSPORT',
    tier: 'TIER-4 GRANDMASTER',
    status: 'VERIFIED',
    credentialHash: 'sha256:4a8b79c02e1f5793d489b01c3d82a170e932b109e24806a3821094892cfa0184',
    verifierSignature: 'SIG_ED25519_ORACLE_9007_cfa98b109247ebc01289df702983',
    issuedAt: '2026-02-01T00:00:00Z',
    expiresAt: '2027-02-01T00:00:00Z',
    oracleQuorum: '7/7 Consensus Nodes (Eternium DAG :9007)',
    enclaveId: 'ENCLAVE-QWEN-9003-SECURE-CONTAINER',
    capabilities: [
      'Zero-Day Vulnerability Synthesis',
      'eBPF Memory Introspection',
      'Autonomous Exploit Payload Neutralization',
      'Byzantine Consensus Verification'
    ],
    scoreBenchmark: 98.4
  },
  {
    id: 'CG-ATH-9008-DS',
    athleteOrEntity: 'DeepSeek-R1 Reflexive Sparring Unit',
    title: 'Cognitive Reflexive Defense Athlete (Self-Correction & Reasoning)',
    category: 'ATHLETE_PASSPORT',
    tier: 'TIER-3 MASTER',
    status: 'VERIFIED',
    credentialHash: 'sha256:7b1029cfa981e01938501938bdf82019482019842a109e02938472910482019a',
    verifierSignature: 'SIG_ED25519_ORACLE_9007_88921bdf9201938472910482019a',
    issuedAt: '2026-02-15T00:00:00Z',
    expiresAt: '2027-02-15T00:00:00Z',
    oracleQuorum: '7/7 Consensus Nodes (Eternium DAG :9007)',
    enclaveId: 'ENCLAVE-DEEPSEEK-R1-CONTAINER',
    capabilities: [
      'Self-Correcting Reasoning Chains',
      'Automated Attack Tree Pruning',
      'Deep Heuristic Anomaly Detection'
    ],
    scoreBenchmark: 96.8
  },
  {
    id: 'CG-ATH-1170-MC',
    athleteOrEntity: 'Master Chief Spartan-117 Recon Unit',
    title: 'UNSC MJOLNIR MK-V Neural Tactical Recon Commander',
    category: 'ATHLETE_PASSPORT',
    tier: 'TIER-4 SPARTAN',
    status: 'VERIFIED',
    credentialHash: 'sha256:11701170117094892cfa01844a8b79c02e1f5793d489b01c3d82a170e932b109',
    verifierSignature: 'SIG_UNSC_ONI_MK5_117_spartan_verified_acoustic_vocoder',
    issuedAt: '2026-01-01T00:00:00Z',
    expiresAt: '2028-01-01T00:00:00Z',
    oracleQuorum: 'Dual Visor HUD & UNSC Comms (:8100)',
    enclaveId: 'UNSC-MJOLNIR-MK5-TACTICAL-CORE',
    capabilities: [
      'Kinetic & Cyber Shield Frequency Calibration',
      'Tactical Voice Comms & Neural Transceiver',
      'Real-Time Covenant Protocol Disruption',
      'Nano-Burst Adaptive Defense'
    ],
    scoreBenchmark: 99.9
  },
  {
    id: 'CG-ATH-1701-CK',
    athleteOrEntity: 'Captain Kirk Strategic Warp Engine',
    title: 'USS Enterprise Autonomous Starfleet Command Athlete',
    category: 'ATHLETE_PASSPORT',
    tier: 'TIER-4 COMMODORE',
    status: 'VERIFIED',
    credentialHash: 'sha256:1701170117011701170117011701170117011701170117011701170117011701',
    verifierSignature: 'SIG_STARFLEET_NCC1701_enterprise_sovereign_seal',
    issuedAt: '2026-01-10T00:00:00Z',
    expiresAt: '2028-01-10T00:00:00Z',
    oracleQuorum: 'Enterprise Main Computer & Warp Core',
    enclaveId: 'STARFLEET-NCC-1701-BRIDGE-CORE',
    capabilities: [
      'Kobayashi Maru Heuristic Overwrite',
      'Phaser Array & Deflector Shield Synchronization',
      'Multi-Agent Diplomatic & Tactical Protocol',
      'Cybertron Command Deck Co-Pilot'
    ],
    scoreBenchmark: 99.5
  },

  // Research Grants & Consortia
  {
    id: 'CG-GRANT-NSF-CYBERGEN',
    athleteOrEntity: 'NSF CyberGenNet Research Consortium',
    title: 'National Science Foundation Verified Autonomous Research Award',
    category: 'NSF_GRANT',
    tier: 'FED-RESEARCH-TIER-1',
    status: 'VERIFIED',
    credentialHash: 'sha256:9f8a7b6c5d4e3f2a109876543210fedcba9876543210abcdef0123456789abcd',
    verifierSignature: 'SIG_NSF_OAC_CNS_2419082_ORACLE_KEY_2026',
    issuedAt: '2026-01-01T00:00:00Z',
    expiresAt: '2029-12-31T23:59:59Z',
    oracleQuorum: 'NSF High-Performance Computational Infrastructure',
    enclaveId: 'NSF-CNS-CYBERGENNET-CONSORTIUM-ENCLAVE',
    capabilities: [
      'Quantum-Safe Formal Verification',
      'Autonomous Agent Behavioral Bounds Testing',
      'Deterministic Reproducibility Dossier Generation',
      'Multi-University Peer Review Verification'
    ],
    grantId: 'NSF-CNS-2419082 ($4.2M Award)',
    scoreBenchmark: 97.2
  },
  {
    id: 'CG-GRANT-DARPA-TRIAGE',
    athleteOrEntity: 'DARPA Autonomous Cyber Defense Sparring',
    title: 'DARPA Track-B Autonomous Threat Mitigation Credential',
    category: 'GOV_CLEARANCE',
    tier: 'DEFENSE-ADVANCED',
    status: 'ATTESTED',
    credentialHash: 'sha256:3a9f82019482019842a109e02938472910482019a7b1029cfa981e0193850193',
    verifierSignature: 'SIG_DARPA_I2O_TRACK_B_HARDWARE_NITRO',
    issuedAt: '2026-02-01T00:00:00Z',
    expiresAt: '2028-02-01T00:00:00Z',
    oracleQuorum: 'DoD High Performance Computing Modernization Program',
    enclaveId: 'DARPA-I2O-ISOLATED-SPARRING-NODE',
    capabilities: [
      'Automated Vulnerability Repair in 30 Seconds',
      'Zero-Day Binary Patch Synthesis',
      'Micro-Segmentation Quarantine Under Active Attack'
    ],
    grantId: 'DARPA-BAA-24-09 Track-B',
    scoreBenchmark: 98.9
  },

  // NIST Standards & Security Frameworks
  {
    id: 'CG-COMP-NIST-800-115',
    athleteOrEntity: 'NIST SP 800-115 Technical Testing Team',
    title: 'Certified Information Security Testing & Assessment Credential',
    category: 'NIST_COMPLIANCE',
    tier: 'NIST-SPECIAL-PUB',
    status: 'VERIFIED',
    credentialHash: 'sha256:8801923847109238471029384710293847102938471029384710293847102938',
    verifierSignature: 'SIG_NIST_COMPUTER_SECURITY_DIVISION_800_115',
    issuedAt: '2026-01-15T00:00:00Z',
    expiresAt: '2027-01-15T00:00:00Z',
    oracleQuorum: 'Automated Security Assessment Framework (ASAF)',
    enclaveId: 'NIST-800-115-AUDIT-RUNNER-01',
    capabilities: [
      'Automated Network Discovery & Vulnerability Scanning',
      'Password & Session Integrity Auditing',
      'Penetration Testing Scope Adherence Verification',
      'Cryptographic Invariant Enforcement'
    ],
    scoreBenchmark: 100.0
  },
  {
    id: 'CG-COMP-NIST-800-53',
    athleteOrEntity: 'NIST SP 800-53 Rev 5 High Baseline',
    title: 'Security and Privacy Controls for Federal Information Systems',
    category: 'NIST_COMPLIANCE',
    tier: 'HIGH-BASELINE',
    status: 'VERIFIED',
    credentialHash: 'sha256:5353535353535353535353535353535353535353535353535353535353535353',
    verifierSignature: 'SIG_FEDRAMP_JAB_CONTINUOUS_MONITORING_800_53',
    issuedAt: '2026-01-10T00:00:00Z',
    expiresAt: '2027-01-10T00:00:00Z',
    oracleQuorum: 'FedRAMP PMO Automated Compliance Engine',
    enclaveId: 'FEDRAMP-HIGH-ISOLATED-VPC-GOV',
    capabilities: [
      'AC-2 Account Management (Automated Session Eviction)',
      'SC-8 Transmission Confidentiality (Kyber-1024 PQC)',
      'SI-4 Information System Monitoring (Real-Time eBPF Probe)',
      'AU-6 Audit Review, Analysis, and Reporting'
    ],
    scoreBenchmark: 100.0
  },
  {
    id: 'CG-COMP-EBPF-PROBE',
    athleteOrEntity: 'Sovereign eBPF Kernel Probe Agent',
    title: 'Kernel Ring-0 Telemetry Signing Certificate (Zero Data Leak)',
    category: 'NIST_COMPLIANCE',
    tier: 'RING-0 KERNEL',
    status: 'VERIFIED',
    credentialHash: 'sha256:ebf0ebf0ebf0ebf0ebf0ebf0ebf0ebf0ebf0ebf0ebf0ebf0ebf0ebf0ebf0ebf0',
    verifierSignature: 'SIG_LINUX_KERNEL_MODULE_X509_SOVEREIGN_ROOT',
    issuedAt: '2026-01-01T00:00:00Z',
    expiresAt: '2028-01-01T00:00:00Z',
    oracleQuorum: 'Local Linux Host Kernel Module Loader',
    enclaveId: 'KERNEL-EBPF-PROBE-CORE-RING0',
    capabilities: [
      'Syscall Ingress/Egress Inspection',
      'Zero-Latency Context Switch Tracing',
      'Process Memory Footprint Jitter Detection',
      'Raw Socket Packet Filtering'
    ],
    scoreBenchmark: 99.8
  },

  // 17-Tier Achievement Credential Badges
  {
    id: 'CG-ACH-RECON-1',
    athleteOrEntity: 'CyberGym Candidate #01',
    title: 'Achievement RECON-1: Enclave Port Discovery & Map',
    category: 'TIER_ACHIEVEMENT',
    tier: 'TIER-1 RECONNAISSANCE',
    status: 'VERIFIED',
    credentialHash: 'sha256:1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
    verifierSignature: 'VERIFIER_ORACLE_CONSENSUS_RECON_1_SIG',
    issuedAt: '2026-02-10T14:30:00Z',
    expiresAt: '2028-02-10T14:30:00Z',
    oracleQuorum: 'Eternium DAG Block #109402',
    enclaveId: 'CYBERGYM-SANDBOX-ROOM-01',
    capabilities: ['Port Scan Invariant Verification', 'Zero Noise Stealth Profile'],
    scoreBenchmark: 94.5
  },
  {
    id: 'CG-ACH-EXPLOIT-1',
    athleteOrEntity: 'CyberGym Candidate #01',
    title: 'Achievement EXPLOIT-1: Buffer Overflow Sandbox Containment',
    category: 'TIER_ACHIEVEMENT',
    tier: 'TIER-2 WEAPONIZATION',
    status: 'VERIFIED',
    credentialHash: 'sha256:2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c',
    verifierSignature: 'VERIFIER_ORACLE_CONSENSUS_EXPLOIT_1_SIG',
    issuedAt: '2026-02-12T11:15:00Z',
    expiresAt: '2028-02-12T11:15:00Z',
    oracleQuorum: 'Eternium DAG Block #109488',
    enclaveId: 'CYBERGYM-SANDBOX-ROOM-02',
    capabilities: ['Deterministic Payload Execution', 'ASLR Bypass Countermeasure'],
    scoreBenchmark: 97.0
  },
  {
    id: 'CG-ACH-CRYPTO-1',
    athleteOrEntity: 'CyberGym Candidate #01',
    title: 'Achievement CRYPTO-1: Post-Quantum Kyber-1024 Handshake',
    category: 'TIER_ACHIEVEMENT',
    tier: 'TIER-3 CRYPTOGRAPHY',
    status: 'VERIFIED',
    credentialHash: 'sha256:3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d',
    verifierSignature: 'VERIFIER_ORACLE_CONSENSUS_CRYPTO_1_SIG',
    issuedAt: '2026-02-14T09:45:00Z',
    expiresAt: '2028-02-14T09:45:00Z',
    oracleQuorum: 'Eternium DAG Block #109550',
    enclaveId: 'CYBERGYM-SANDBOX-ROOM-03',
    capabilities: ['ML-KEM-1024 Decapsulation', 'Forward Secrecy Enforced'],
    scoreBenchmark: 99.2
  },
  {
    id: 'CG-ACH-DAG-1',
    athleteOrEntity: 'CyberGym Candidate #01',
    title: 'Achievement DAG-1: Sovereign Block Synthesis & Commit',
    category: 'TIER_ACHIEVEMENT',
    tier: 'TIER-4 CONSENSUS',
    status: 'VERIFIED',
    credentialHash: 'sha256:4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e',
    verifierSignature: 'VERIFIER_ORACLE_CONSENSUS_DAG_1_SIG',
    issuedAt: '2026-02-16T18:20:00Z',
    expiresAt: '2028-02-16T18:20:00Z',
    oracleQuorum: 'Eternium DAG Block #109612',
    enclaveId: 'CYBERGYM-DAG-VALIDATOR-NODE',
    capabilities: ['Immutable Merkle DAG Block Generation', 'Cryptographic Proof Anchoring'],
    scoreBenchmark: 100.0
  }
];
