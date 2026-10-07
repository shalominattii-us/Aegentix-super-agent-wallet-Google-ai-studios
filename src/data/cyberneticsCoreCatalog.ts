export interface WorkstationRepo {
  id: string;
  name: string;
  basePath: string;
  description: string;
  badge: string;
  artifactCount?: number;
}

export interface CyberneticsCoreItem {
  name: string;
  relativePath: string;
  fullPath: string;
  repoId?: 'AEGENTIX-CYBERNETICS-CORE' | 'AEGENTIX-MISSION-CONTROL' | 'aegentix-omnichain-solver' | 'AEGENTIX-SECURITY-INTELLIGENCE';
  category: 'AGENT_SWARM' | 'XRPL_DEFI' | 'CYBERCORE_DEFENSE' | 'HARDWARE_ROBOTICS' | 'MISSION_CONTROL' | 'GOVERNANCE_PATENTS' | 'DATA_BACKUPS' | 'OMNICHAIN_SOLVER' | 'SECURITY_INTELLIGENCE';
  type: 'FILE' | 'DIRECTORY' | 'ARCHIVE' | 'SCRIPT' | 'NOTEBOOK' | 'CONFIG';
  status: 'ONLINE' | 'STANDBY' | 'SYNCED' | 'DOCUMENTED' | 'ENCLAVE_READY';
  description: string;
  quickCommand?: string;
}

export const EAGLE_ROOT = 'C:\\Users\\eagle';
export const CYBERNETICS_CORE_BASE = 'C:\\Users\\eagle\\AEGENTIX-CYBERNETICS-CORE';
export const MISSION_CONTROL_BASE = 'C:\\Users\\eagle\\AEGENTIX-MISSION-CONTROL';
export const OMNICHAIN_SOLVER_BASE = 'C:\\Users\\eagle\\aegentix-omnichain-solver';
export const SECURITY_INTELLIGENCE_BASE = 'C:\\Users\\eagle\\AEGENTIX-SECURITY-INTELLIGENCE';

export const WORKSTATION_REPOSITORIES: WorkstationRepo[] = [
  {
    id: 'AEGENTIX-CYBERNETICS-CORE',
    name: 'AEGENTIX-CYBERNETICS-CORE',
    basePath: CYBERNETICS_CORE_BASE,
    description: 'Workstation nucleus for autonomous agents, XRPL trading bots, CyberCore defense engines, and hardware drivers.',
    badge: 'Nucleus Core'
  },
  {
    id: 'AEGENTIX-MISSION-CONTROL',
    name: 'AEGENTIX-MISSION-CONTROL',
    basePath: MISSION_CONTROL_BASE,
    description: 'Mission Control center hosting agent mesh coordination, Cybergenetic Starship 3D UI, and operational sources.',
    badge: 'Mission Control'
  },
  {
    id: 'aegentix-omnichain-solver',
    name: 'aegentix-omnichain-solver',
    basePath: OMNICHAIN_SOLVER_BASE,
    description: '300-node omnichain distributed consensus, edge-c11 solver, cross-chain arbitrage, and Node.js orchestrator.',
    badge: 'Omnichain Solver'
  },
  {
    id: 'AEGENTIX-SECURITY-INTELLIGENCE',
    name: 'AEGENTIX-SECURITY-INTELLIGENCE',
    basePath: SECURITY_INTELLIGENCE_BASE,
    description: 'Security operations intelligence, OSINT/DFIR machine learning, threat charts, and Gemini conversational log aggregation.',
    badge: 'Security Intel'
  }
];

export const CYBERNETICS_CORE_CATALOG: CyberneticsCoreItem[] = [
  // --- XRPL & WALLET DEFI BRIDGES ---
  {
    name: 'xrp_bot_bridge.py',
    relativePath: 'xrp_bot_bridge.py',
    fullPath: `${CYBERNETICS_CORE_BASE}\\xrp_bot_bridge.py`,
    category: 'XRPL_DEFI',
    type: 'SCRIPT',
    status: 'ONLINE',
    description: 'Autonomous high-frequency bot bridging XRPL orderbooks with real-time liquidity pools.',
    quickCommand: `python "${CYBERNETICS_CORE_BASE}\\xrp_bot_bridge.py"`
  },
  {
    name: 'zaman_wallet_connector.py',
    relativePath: 'zaman_wallet_connector.py',
    fullPath: `${CYBERNETICS_CORE_BASE}\\zaman_wallet_connector.py`,
    category: 'XRPL_DEFI',
    type: 'SCRIPT',
    status: 'ONLINE',
    description: 'Direct Xaman (formerly Xumm) WebSocket wallet connector for cryptographic authorization and signature validation.',
    quickCommand: `python "${CYBERNETICS_CORE_BASE}\\zaman_wallet_connector.py"`
  },
  {
    name: 'xaman_custody_websocket.py',
    relativePath: 'xaman_custody_websocket.py',
    fullPath: `${CYBERNETICS_CORE_BASE}\\xaman_custody_websocket.py`,
    category: 'XRPL_DEFI',
    type: 'SCRIPT',
    status: 'ONLINE',
    description: 'Bi-directional WebSocket client for Xaman non-custodial transaction broadcast and payload resolution.',
    quickCommand: `python "${CYBERNETICS_CORE_BASE}\\xaman_custody_websocket.py"`
  },
  {
    name: 'xaman_secret_numbers_converter.py',
    relativePath: 'xaman_secret_numbers_converter.py',
    fullPath: `${CYBERNETICS_CORE_BASE}\\xaman_secret_numbers_converter.py`,
    category: 'XRPL_DEFI',
    type: 'SCRIPT',
    status: 'ONLINE',
    description: 'Hardware-safe converter from Xaman 8-block secret numbers to deterministic cryptographic seeds.',
    quickCommand: `python "${CYBERNETICS_CORE_BASE}\\xaman_secret_numbers_converter.py"`
  },
  {
    name: 'xpmarket_portfolio_trader.py',
    relativePath: 'xpmarket_portfolio_trader.py',
    fullPath: `${CYBERNETICS_CORE_BASE}\\xpmarket_portfolio_trader.py`,
    category: 'XRPL_DEFI',
    type: 'SCRIPT',
    status: 'ONLINE',
    description: 'XPMarket DEX programmatic portfolio rebalancing agent with volume breakout triggers.',
    quickCommand: `python "${CYBERNETICS_CORE_BASE}\\xpmarket_portfolio_trader.py"`
  },
  {
    name: 'trade_tokens_fill_bags.py',
    relativePath: 'trade_tokens_fill_bags.py',
    fullPath: `${CYBERNETICS_CORE_BASE}\\trade_tokens_fill_bags.py`,
    category: 'XRPL_DEFI',
    type: 'SCRIPT',
    status: 'ONLINE',
    description: 'DEX bag accumulator agent targeting discounted algorithmic orders during market sell-offs.',
    quickCommand: `python "${CYBERNETICS_CORE_BASE}\\trade_tokens_fill_bags.py"`
  },
  {
    name: 'xaman-xpmarket-dashboard',
    relativePath: 'xaman-xpmarket-dashboard',
    fullPath: `${CYBERNETICS_CORE_BASE}\\xaman-xpmarket-dashboard`,
    category: 'XRPL_DEFI',
    type: 'DIRECTORY',
    status: 'ONLINE',
    description: 'Integrated UI dashboard connecting Xaman custodial telemetry with XPMarket orderbook feeds.'
  },

  // --- AGENT SWARM & CORE AUTOMATION ---
  {
    name: 'bring_everything_online.py',
    relativePath: 'bring_everything_online.py',
    fullPath: `${CYBERNETICS_CORE_BASE}\\bring_everything_online.py`,
    category: 'AGENT_SWARM',
    type: 'SCRIPT',
    status: 'ONLINE',
    description: 'Master workstation bootstrapping script orchestrating all daemons, ports, agents, and bridges simultaneously.',
    quickCommand: `python "${CYBERNETICS_CORE_BASE}\\bring_everything_online.py"`
  },
  {
    name: 'omnichain_300_node_mesh.py',
    relativePath: 'omnichain_300_node_mesh.py',
    fullPath: `${CYBERNETICS_CORE_BASE}\\omnichain_300_node_mesh.py`,
    category: 'AGENT_SWARM',
    type: 'SCRIPT',
    status: 'ONLINE',
    description: '300-node simulated omnichain liquidity solver grid utilizing peer gossip and zero-latency state transfers.',
    quickCommand: `python "${CYBERNETICS_CORE_BASE}\\omnichain_300_node_mesh.py"`
  },
  {
    name: 'autonomous_coin_agents_mesh.py',
    relativePath: 'autonomous_coin_agents_mesh.py',
    fullPath: `${CYBERNETICS_CORE_BASE}\\autonomous_coin_agents_mesh.py`,
    category: 'AGENT_SWARM',
    type: 'SCRIPT',
    status: 'ONLINE',
    description: 'Multi-agent trading mesh evaluating coin volatility, slippage variance, and arbitrage spread invariance.',
    quickCommand: `python "${CYBERNETICS_CORE_BASE}\\autonomous_coin_agents_mesh.py"`
  },
  {
    name: 'aegentis_llm_bridge.py',
    relativePath: 'aegentis_llm_bridge.py',
    fullPath: `${CYBERNETICS_CORE_BASE}\\aegentis_llm_bridge.py`,
    category: 'AGENT_SWARM',
    type: 'SCRIPT',
    status: 'ONLINE',
    description: 'Rotational LLM proxy bridge managing Gemini, DeepSeek, and Kimi AI inference without 429 quota exhaustion.',
    quickCommand: `python "${CYBERNETICS_CORE_BASE}\\aegentis_llm_bridge.py"`
  },
  {
    name: 'kimi_web_bridge.py',
    relativePath: 'kimi_web_bridge.py',
    fullPath: `${CYBERNETICS_CORE_BASE}\\kimi_web_bridge.py`,
    category: 'AGENT_SWARM',
    type: 'SCRIPT',
    status: 'ONLINE',
    description: 'Long-context web search and document reasoning bridge connecting Kimi AI analysis with Aegentis.',
    quickCommand: `python "${CYBERNETICS_CORE_BASE}\\kimi_web_bridge.py"`
  },
  {
    name: 'aegentis_diagnostics.py',
    relativePath: 'aegentis_diagnostics.py',
    fullPath: `${CYBERNETICS_CORE_BASE}\\aegentis_diagnostics.py`,
    category: 'AGENT_SWARM',
    type: 'SCRIPT',
    status: 'ONLINE',
    description: 'System-wide diagnostic runner verifying memory constraints, port bindings, and cryptographic nonces.',
    quickCommand: `python "${CYBERNETICS_CORE_BASE}\\aegentis_diagnostics.py"`
  },

  // --- HARDWARE, ROBOTICS & NANO-TRANSACTIONS ---
  {
    name: 'xbox_nanotransactions.html',
    relativePath: 'xbox_nanotransactions.html',
    fullPath: `${CYBERNETICS_CORE_BASE}\\xbox_nanotransactions.html`,
    category: 'HARDWARE_ROBOTICS',
    type: 'FILE',
    status: 'ONLINE',
    description: 'Interactive high-frequency web compute sandbox delivering 34,800+ nano-transactions/s for Xbox & gaming consoles.'
  },
  {
    name: 'ROG Ally X modular controller and dock design',
    relativePath: 'ROG Ally X modular controller and dock design',
    fullPath: `${CYBERNETICS_CORE_BASE}\\ROG Ally X modular controller and dock design`,
    category: 'HARDWARE_ROBOTICS',
    type: 'DIRECTORY',
    status: 'DOCUMENTED',
    description: 'CAD schematics, button mappings, and thermal dissipation docking designs for the AMD Ryzen ROG Ally X terminal.'
  },
  {
    name: 'Autonomous Multi-Domain Torpedo Drone Design',
    relativePath: 'Autonomous Multi-Domain Torpedo Drone Design',
    fullPath: `${CYBERNETICS_CORE_BASE}\\Autonomous Multi-Domain Torpedo Drone Design`,
    category: 'HARDWARE_ROBOTICS',
    type: 'DIRECTORY',
    status: 'DOCUMENTED',
    description: 'Sub-surface naval telemetry, autonomous navigation waypoints, and acoustic hydrophone communication protocols.'
  },
  {
    name: 'FlipperOne_6_Issues.md',
    relativePath: 'FlipperOne_6_Issues.md',
    fullPath: `${CYBERNETICS_CORE_BASE}\\FlipperOne_6_Issues.md`,
    category: 'HARDWARE_ROBOTICS',
    type: 'FILE',
    status: 'DOCUMENTED',
    description: 'Hardware audit and RF radio firmware vulnerability analysis for Flipper One modular penetration tool.'
  },
  {
    name: 'build_omega_rockchip.sh',
    relativePath: 'build_omega_rockchip.sh',
    fullPath: `${CYBERNETICS_CORE_BASE}\\build_omega_rockchip.sh`,
    category: 'HARDWARE_ROBOTICS',
    type: 'SCRIPT',
    status: 'ENCLAVE_READY',
    description: 'Cross-compilation toolchain for Rockchip RK3588 embedded NPU acceleration and edge deployment.'
  },

  // --- CYBERCORE & ADVERSARIAL DEFENSE ---
  {
    name: 'cybercore_baking_engine.py',
    relativePath: 'cybercore_baking_engine.py',
    fullPath: `${CYBERNETICS_CORE_BASE}\\cybercore_baking_engine.py`,
    category: 'CYBERCORE_DEFENSE',
    type: 'SCRIPT',
    status: 'ONLINE',
    description: 'Industrial cybersecurity baking engine generating isolated security policy profiles for target infrastructures.',
    quickCommand: `python "${CYBERNETICS_CORE_BASE}\\cybercore_baking_engine.py"`
  },
  {
    name: 'deploy_cybercore.py',
    relativePath: 'deploy_cybercore.py',
    fullPath: `${CYBERNETICS_CORE_BASE}\\deploy_cybercore.py`,
    category: 'CYBERCORE_DEFENSE',
    type: 'SCRIPT',
    status: 'ONLINE',
    description: 'Deployment pipeline packaging Cybercore subscriptions ($499/mo Pro, $2,499/mo Enterprise).',
    quickCommand: `python "${CYBERNETICS_CORE_BASE}\\deploy_cybercore.py"`
  },
  {
    name: 'AEGENTIX-SECURITY-INTELLIGENCE',
    relativePath: 'AEGENTIX-SECURITY-INTELLIGENCE',
    fullPath: `${CYBERNETICS_CORE_BASE}\\AEGENTIX-SECURITY-INTELLIGENCE`,
    category: 'CYBERCORE_DEFENSE',
    type: 'DIRECTORY',
    status: 'ONLINE',
    description: 'Automated threat hunting, CVE correlation, and OSINT intelligence ingestion repository.'
  },
  {
    name: 'log_forensics.py',
    relativePath: 'log_forensics.py',
    fullPath: `${CYBERNETICS_CORE_BASE}\\log_forensics.py`,
    category: 'CYBERCORE_DEFENSE',
    type: 'SCRIPT',
    status: 'ONLINE',
    description: 'Deep mempool and packet log forensics extractor identifying sandwich attacks and front-running bots.',
    quickCommand: `python "${CYBERNETICS_CORE_BASE}\\log_forensics.py"`
  },
  {
    name: 'memory_dump.py',
    relativePath: 'memory_dump.py',
    fullPath: `${CYBERNETICS_CORE_BASE}\\memory_dump.py`,
    category: 'CYBERCORE_DEFENSE',
    type: 'SCRIPT',
    status: 'ONLINE',
    description: 'Ring-0 memory extraction and signature scanner for process integrity attestation.'
  },

  // --- MISSION CONTROL & TELEMETRY ---
  {
    name: 'AEGENTIX-MISSION-CONTROL',
    relativePath: 'AEGENTIX-MISSION-CONTROL',
    fullPath: `${CYBERNETICS_CORE_BASE}\\AEGENTIX-MISSION-CONTROL`,
    category: 'MISSION_CONTROL',
    type: 'DIRECTORY',
    status: 'ONLINE',
    description: 'Root Mission Control directory containing AEGENTIX-AGENT-MESH, cybergenetic-starship, and sources.'
  },
  {
    name: 'worldmonitor',
    relativePath: 'worldmonitor',
    fullPath: `${CYBERNETICS_CORE_BASE}\\worldmonitor`,
    category: 'MISSION_CONTROL',
    type: 'DIRECTORY',
    status: 'ONLINE',
    description: 'Global geopolitical and financial market volatility monitoring dashboard.'
  },
  {
    name: 'worldmonitor_bridge.py',
    relativePath: 'worldmonitor_bridge.py',
    fullPath: `${CYBERNETICS_CORE_BASE}\\worldmonitor_bridge.py`,
    category: 'MISSION_CONTROL',
    type: 'SCRIPT',
    status: 'ONLINE',
    description: 'Real-time bridge channeling world event triggers into autonomous risk parameter adjustments.',
    quickCommand: `python "${CYBERNETICS_CORE_BASE}\\worldmonitor_bridge.py"`
  },
  {
    name: 'AEGENTIX zero point wall monitoring.txt',
    relativePath: 'AEGENTIX zero point wall monitoring.txt',
    fullPath: `${CYBERNETICS_CORE_BASE}\\AEGENTIX zero point wall monitoring.txt`,
    category: 'MISSION_CONTROL',
    type: 'FILE',
    status: 'DOCUMENTED',
    description: 'Zero-point boundary specifications for hardware thermal limits and mempool defense walls.'
  },
  {
    name: 'MASTER_INDEX.md',
    relativePath: 'MASTER_INDEX.md',
    fullPath: `${CYBERNETICS_CORE_BASE}\\MASTER_INDEX.md`,
    category: 'MISSION_CONTROL',
    type: 'FILE',
    status: 'DOCUMENTED',
    description: 'Master index cataloging all 112+ local repositories, scripts, and sovereign components.'
  },
  {
    name: 'README.md',
    relativePath: 'README.md',
    fullPath: `${CYBERNETICS_CORE_BASE}\\README.md`,
    category: 'MISSION_CONTROL',
    type: 'FILE',
    status: 'DOCUMENTED',
    description: 'Root documentation for the AEGENTIX-CYBERNETICS-CORE workstation repository.'
  },
  {
    name: 'INSTALL.ps1',
    relativePath: 'INSTALL.ps1',
    fullPath: `${CYBERNETICS_CORE_BASE}\\INSTALL.ps1`,
    category: 'MISSION_CONTROL',
    type: 'SCRIPT',
    status: 'ENCLAVE_READY',
    description: 'PowerShell environment installer bootstrapping all dependencies, Python virtualenvs, and Node modules.'
  },
  {
    name: 'run-auto.bat',
    relativePath: 'run-auto.bat',
    fullPath: `${CYBERNETICS_CORE_BASE}\\run-auto.bat`,
    category: 'MISSION_CONTROL',
    type: 'SCRIPT',
    status: 'ENCLAVE_READY',
    description: 'Windows batch launcher executing automated cycle runs with zero manual prompts.'
  },

  // --- SOVEREIGN GOVERNANCE & PATENTS ---
  {
    name: 'AEGENTIX_CORPORATE_MANIFEST.md',
    relativePath: 'AEGENTIX_CORPORATE_MANIFEST.md',
    fullPath: `${CYBERNETICS_CORE_BASE}\\AEGENTIX_CORPORATE_MANIFEST.md`,
    category: 'GOVERNANCE_PATENTS',
    type: 'FILE',
    status: 'DOCUMENTED',
    description: 'Corporate charter, mission mandates, commercialization goals, and $1,000,000 ARR target specifications.'
  },
  {
    name: 'SOV_AE_Architecture_2026-06-23.md',
    relativePath: 'SOV_AE_Architecture_2026-06-23.md',
    fullPath: `${CYBERNETICS_CORE_BASE}\\SOV_AE_Architecture_2026-06-23.md`,
    category: 'GOVERNANCE_PATENTS',
    type: 'FILE',
    status: 'DOCUMENTED',
    description: 'Full sovereign architectural blueprint unifying True Swarm 9980B, AXL, and Aegis-7 coordinate ciphers.'
  },
  {
    name: 'Sovereign_Patent_Class_Analysis.md',
    relativePath: 'Sovereign_Patent_Class_Analysis.md',
    fullPath: `${CYBERNETICS_CORE_BASE}\\Sovereign_Patent_Class_Analysis.md`,
    category: 'GOVERNANCE_PATENTS',
    type: 'FILE',
    status: 'DOCUMENTED',
    description: 'USPTO patent classification mapping for autonomous AI trading execution, acoustic ciphers, and swarm consensus.'
  },
  {
    name: 'Sovereign_Audit_Script.ps1',
    relativePath: 'Sovereign_Audit_Script.ps1',
    fullPath: `${CYBERNETICS_CORE_BASE}\\Sovereign_Audit_Script.ps1`,
    category: 'GOVERNANCE_PATENTS',
    type: 'SCRIPT',
    status: 'ENCLAVE_READY',
    description: 'Audit runner hashing every local repository artifact against the immutable compliance ledger.'
  },
  {
    name: 'Military Defense Contract Funding Options Explained.zip',
    relativePath: 'Military Defense Contract Funding Options Explained.zip',
    fullPath: `${CYBERNETICS_CORE_BASE}\\Military Defense Contract Funding Options Explained.zip`,
    category: 'GOVERNANCE_PATENTS',
    type: 'ARCHIVE',
    status: 'DOCUMENTED',
    description: 'SBIR/STTR and defense funding pathway analysis for dual-use cybersecurity and autonomous swarm defense.'
  },
  {
    name: 'success_vault_protocol.md',
    relativePath: 'success_vault_protocol.md',
    fullPath: `${CYBERNETICS_CORE_BASE}\\success_vault_protocol.md`,
    category: 'GOVERNANCE_PATENTS',
    type: 'FILE',
    status: 'DOCUMENTED',
    description: 'Cryptographic vault protocol establishing cold-storage escrow locks for high-value sovereign assets.'
  },

  // --- BACKUPS & DATA RECOVERY ---
  {
    name: 'FULL_BACKUP',
    relativePath: 'FULL_BACKUP',
    fullPath: `${CYBERNETICS_CORE_BASE}\\FULL_BACKUP`,
    category: 'DATA_BACKUPS',
    type: 'DIRECTORY',
    status: 'SYNCED',
    description: 'Complete mirror backup of the Aegentix system state.'
  },
  {
    name: 'FullDeviceBackup',
    relativePath: 'FullDeviceBackup',
    fullPath: `${CYBERNETICS_CORE_BASE}\\FullDeviceBackup`,
    category: 'DATA_BACKUPS',
    type: 'DIRECTORY',
    status: 'SYNCED',
    description: 'Full device image and registry backup.'
  },
  {
    name: 'SOVEREIGN_ENDPOINTS_MASTER_BACKUP',
    relativePath: 'SOVEREIGN_ENDPOINTS_MASTER_BACKUP',
    fullPath: `${CYBERNETICS_CORE_BASE}\\SOVEREIGN_ENDPOINTS_MASTER_BACKUP`,
    category: 'DATA_BACKUPS',
    type: 'DIRECTORY',
    status: 'SYNCED',
    description: 'Master snapshot of all active sovereign API endpoints, RPC gateways, and WebSocket targets.'
  },
  {
    name: 'Manus Data Recovery - HEMPEROR JZS - task - 2026-08-11_14-42-19',
    relativePath: 'Manus Data Recovery - HEMPEROR JZS - task - 2026-08-11_14-42-19',
    fullPath: `${CYBERNETICS_CORE_BASE}\\Manus Data Recovery - HEMPEROR JZS - task - 2026-08-11_14-42-19`,
    category: 'DATA_BACKUPS',
    type: 'DIRECTORY',
    status: 'SYNCED',
    description: 'Recovered task artifacts and state snapshots from the Manus web agent session.'
  },
  {
    name: 'gdrive_imports',
    relativePath: 'gdrive_imports',
    fullPath: `${CYBERNETICS_CORE_BASE}\\gdrive_imports`,
    category: 'DATA_BACKUPS',
    type: 'DIRECTORY',
    status: 'SYNCED',
    description: 'Synchronized Google Drive research papers, financial spreadsheets, and presentation decks.'
  },
  {
    name: 'SovereignMaximumFleet.zip',
    relativePath: 'SovereignMaximumFleet.zip',
    fullPath: `${CYBERNETICS_CORE_BASE}\\SovereignMaximumFleet.zip`,
    category: 'DATA_BACKUPS',
    type: 'ARCHIVE',
    status: 'SYNCED',
    description: 'Full archived distribution bundle for the maximum autonomous fleet release.'
  },

  // =========================================================================
  // --- REPOSITORY: AEGENTIX-MISSION-CONTROL (C:\Users\eagle\AEGENTIX-MISSION-CONTROL) ---
  // =========================================================================
  {
    name: 'AEGENTIX-AGENT-MESH',
    relativePath: 'AEGENTIX-AGENT-MESH',
    fullPath: `${MISSION_CONTROL_BASE}\\AEGENTIX-AGENT-MESH`,
    repoId: 'AEGENTIX-MISSION-CONTROL',
    category: 'AGENT_SWARM',
    type: 'DIRECTORY',
    status: 'ONLINE',
    description: 'Master swarm coordination sub-mesh and cross-agent communication protocols linking all sovereign execution nodes.'
  },
  {
    name: 'cybergenetic-starship',
    relativePath: 'cybergenetic-starship',
    fullPath: `${MISSION_CONTROL_BASE}\\cybergenetic-starship`,
    repoId: 'AEGENTIX-MISSION-CONTROL',
    category: 'MISSION_CONTROL',
    type: 'DIRECTORY',
    status: 'ONLINE',
    description: 'Flagship UI/UX spatial command vessel, Three.js/WebGL bridge, and holographic cockpit telemetry.'
  },
  {
    name: 'sources',
    relativePath: 'sources',
    fullPath: `${MISSION_CONTROL_BASE}\\sources`,
    repoId: 'AEGENTIX-MISSION-CONTROL',
    category: 'MISSION_CONTROL',
    type: 'DIRECTORY',
    status: 'ONLINE',
    description: 'Mission Control operational telemetry sources, real-time data feeds, and flight recording pipes.'
  },
  {
    name: 'README.md',
    relativePath: 'README.md',
    fullPath: `${MISSION_CONTROL_BASE}\\README.md`,
    repoId: 'AEGENTIX-MISSION-CONTROL',
    category: 'MISSION_CONTROL',
    type: 'FILE',
    status: 'DOCUMENTED',
    description: 'Master Mission Control operations guide, deployment directives, and system flight checks.'
  },

  // =========================================================================
  // --- REPOSITORY: aegentix-omnichain-solver (C:\Users\eagle\aegentix-omnichain-solver) ---
  // =========================================================================
  {
    name: 'omnichain_300_node_mesh.py',
    relativePath: 'omnichain_300_node_mesh.py',
    fullPath: `${OMNICHAIN_SOLVER_BASE}\\omnichain_300_node_mesh.py`,
    repoId: 'aegentix-omnichain-solver',
    category: 'OMNICHAIN_SOLVER',
    type: 'SCRIPT',
    status: 'ONLINE',
    description: '300-node omnichain distributed consensus mesh and high-frequency multi-hop arbitrage pathfinder.',
    quickCommand: `python "${OMNICHAIN_SOLVER_BASE}\\omnichain_300_node_mesh.py"`
  },
  {
    name: 'orchestrator.js',
    relativePath: 'orchestrator.js',
    fullPath: `${OMNICHAIN_SOLVER_BASE}\\orchestrator.js`,
    repoId: 'aegentix-omnichain-solver',
    category: 'OMNICHAIN_SOLVER',
    type: 'SCRIPT',
    status: 'ONLINE',
    description: 'High-velocity Node.js orchestrator coordinating multi-chain execution engines and sub-millisecond atomic fills.',
    quickCommand: `node "${OMNICHAIN_SOLVER_BASE}\\orchestrator.js"`
  },
  {
    name: 'package.json',
    relativePath: 'package.json',
    fullPath: `${OMNICHAIN_SOLVER_BASE}\\package.json`,
    repoId: 'aegentix-omnichain-solver',
    category: 'OMNICHAIN_SOLVER',
    type: 'CONFIG',
    status: 'DOCUMENTED',
    description: 'Node runtime manifest, build scripts, and cross-chain solver dependencies.'
  },
  {
    name: 'package-lock.json',
    relativePath: 'package-lock.json',
    fullPath: `${OMNICHAIN_SOLVER_BASE}\\package-lock.json`,
    repoId: 'aegentix-omnichain-solver',
    category: 'OMNICHAIN_SOLVER',
    type: 'CONFIG',
    status: 'DOCUMENTED',
    description: 'Deterministic dependency tree lockfile ensuring reproducible enclave builds.'
  },
  {
    name: '.cursor',
    relativePath: '.cursor',
    fullPath: `${OMNICHAIN_SOLVER_BASE}\\.cursor`,
    repoId: 'aegentix-omnichain-solver',
    category: 'OMNICHAIN_SOLVER',
    type: 'DIRECTORY',
    status: 'DOCUMENTED',
    description: 'Cursor AI system prompt context, codebase rules, and autonomous instructions.'
  },
  {
    name: 'edge-c11',
    relativePath: 'edge-c11',
    fullPath: `${OMNICHAIN_SOLVER_BASE}\\edge-c11`,
    repoId: 'aegentix-omnichain-solver',
    category: 'OMNICHAIN_SOLVER',
    type: 'DIRECTORY',
    status: 'ONLINE',
    description: 'Ultra-low latency C11 compiled edge solver runtime for microsecond pathfinding and flash execution.'
  },
  {
    name: 'src',
    relativePath: 'src',
    fullPath: `${OMNICHAIN_SOLVER_BASE}\\src`,
    repoId: 'aegentix-omnichain-solver',
    category: 'OMNICHAIN_SOLVER',
    type: 'DIRECTORY',
    status: 'ONLINE',
    description: 'Omnichain solver source code containing DEX routers, mempool listeners, and gas optimizers.'
  },
  {
    name: 'tests',
    relativePath: 'tests',
    fullPath: `${OMNICHAIN_SOLVER_BASE}\\tests`,
    repoId: 'aegentix-omnichain-solver',
    category: 'OMNICHAIN_SOLVER',
    type: 'DIRECTORY',
    status: 'ONLINE',
    description: 'Automated unit, fuzz, and integration tests verifying slippage tolerance and multi-hop safety.'
  },
  {
    name: '.env.example',
    relativePath: '.env.example',
    fullPath: `${OMNICHAIN_SOLVER_BASE}\\.env.example`,
    repoId: 'aegentix-omnichain-solver',
    category: 'OMNICHAIN_SOLVER',
    type: 'CONFIG',
    status: 'DOCUMENTED',
    description: 'Environment template defining RPC URLs, enclave ports, and public contract addresses.'
  },
  {
    name: '.gitignore',
    relativePath: '.gitignore',
    fullPath: `${OMNICHAIN_SOLVER_BASE}\\.gitignore`,
    repoId: 'aegentix-omnichain-solver',
    category: 'OMNICHAIN_SOLVER',
    type: 'CONFIG',
    status: 'DOCUMENTED',
    description: 'Source control exclusions safeguarding private credentials and build artifacts.'
  },
  {
    name: 'AEGENTIX_CORPORATE_MANIFEST.md',
    relativePath: 'AEGENTIX_CORPORATE_MANIFEST.md',
    fullPath: `${OMNICHAIN_SOLVER_BASE}\\AEGENTIX_CORPORATE_MANIFEST.md`,
    repoId: 'aegentix-omnichain-solver',
    category: 'GOVERNANCE_PATENTS',
    type: 'FILE',
    status: 'DOCUMENTED',
    description: 'Omnichain solver corporate charter, yield-harvesting mandates, and risk policies.'
  },
  {
    name: 'AGENTS.md',
    relativePath: 'AGENTS.md',
    fullPath: `${OMNICHAIN_SOLVER_BASE}\\AGENTS.md`,
    repoId: 'aegentix-omnichain-solver',
    category: 'AGENT_SWARM',
    type: 'FILE',
    status: 'DOCUMENTED',
    description: 'Autonomous agent hierarchy, sub-agent capabilities, and task dispatch protocols.'
  },
  {
    name: 'Dockerfile',
    relativePath: 'Dockerfile',
    fullPath: `${OMNICHAIN_SOLVER_BASE}\\Dockerfile`,
    repoId: 'aegentix-omnichain-solver',
    category: 'OMNICHAIN_SOLVER',
    type: 'CONFIG',
    status: 'ENCLAVE_READY',
    description: 'Container enclave specification for isolated, reproducible omnichain solver deployments.'
  },
  {
    name: 'LICENSE',
    relativePath: 'LICENSE',
    fullPath: `${OMNICHAIN_SOLVER_BASE}\\LICENSE`,
    repoId: 'aegentix-omnichain-solver',
    category: 'GOVERNANCE_PATENTS',
    type: 'FILE',
    status: 'DOCUMENTED',
    description: 'Sovereign open-source software license for the omnichain solver platform.'
  },

  // =========================================================================
  // --- REPOSITORY: AEGENTIX-SECURITY-INTELLIGENCE (C:\Users\eagle\AEGENTIX-SECURITY-INTELLIGENCE) ---
  // =========================================================================
  {
    name: 'charts',
    relativePath: 'charts',
    fullPath: `${SECURITY_INTELLIGENCE_BASE}\\charts`,
    repoId: 'AEGENTIX-SECURITY-INTELLIGENCE',
    category: 'SECURITY_INTELLIGENCE',
    type: 'DIRECTORY',
    status: 'ONLINE',
    description: 'Interactive security analytics charts, attack vector diagrams, and mempool volatility visualizations.'
  },
  {
    name: 'osint_dfir_ml',
    relativePath: 'osint_dfir_ml',
    fullPath: `${SECURITY_INTELLIGENCE_BASE}\\osint_dfir_ml`,
    repoId: 'AEGENTIX-SECURITY-INTELLIGENCE',
    category: 'SECURITY_INTELLIGENCE',
    type: 'DIRECTORY',
    status: 'ONLINE',
    description: 'Open Source Intelligence & Digital Forensics Incident Response machine learning pipelines.'
  },
  {
    name: 'sources',
    relativePath: 'sources',
    fullPath: `${SECURITY_INTELLIGENCE_BASE}\\sources`,
    repoId: 'AEGENTIX-SECURITY-INTELLIGENCE',
    category: 'SECURITY_INTELLIGENCE',
    type: 'DIRECTORY',
    status: 'ONLINE',
    description: 'Curated cyber threat intelligence feeds, IOC tables, and security telemetry archives.'
  },
  {
    name: 'aggregate_gemini_chats.py',
    relativePath: 'aggregate_gemini_chats.py',
    fullPath: `${SECURITY_INTELLIGENCE_BASE}\\aggregate_gemini_chats.py`,
    repoId: 'AEGENTIX-SECURITY-INTELLIGENCE',
    category: 'SECURITY_INTELLIGENCE',
    type: 'SCRIPT',
    status: 'ONLINE',
    description: 'High-throughput parser aggregating multi-turn Gemini reasoning logs and operational directives.',
    quickCommand: `python "${SECURITY_INTELLIGENCE_BASE}\\aggregate_gemini_chats.py"`
  },
  {
    name: 'gemini_chat_data_goldmine_aggregation.ipynb',
    relativePath: 'gemini_chat_data_goldmine_aggregation.ipynb',
    fullPath: `${SECURITY_INTELLIGENCE_BASE}\\gemini_chat_data_goldmine_aggregation.ipynb`,
    repoId: 'AEGENTIX-SECURITY-INTELLIGENCE',
    category: 'SECURITY_INTELLIGENCE',
    type: 'NOTEBOOK',
    status: 'DOCUMENTED',
    description: 'Jupyter data mining goldmine extracting actionable intelligence and fine-tuning datasets from Gemini sessions.'
  },
  {
    name: 'inspect_chats.py',
    relativePath: 'inspect_chats.py',
    fullPath: `${SECURITY_INTELLIGENCE_BASE}\\inspect_chats.py`,
    repoId: 'AEGENTIX-SECURITY-INTELLIGENCE',
    category: 'SECURITY_INTELLIGENCE',
    type: 'SCRIPT',
    status: 'ONLINE',
    description: 'Interactive CLI inspection tool auditing LLM transcripts for security compliance and prompt leakage.',
    quickCommand: `python "${SECURITY_INTELLIGENCE_BASE}\\inspect_chats.py"`
  },
  {
    name: 'README.md',
    relativePath: 'README.md',
    fullPath: `${SECURITY_INTELLIGENCE_BASE}\\README.md`,
    repoId: 'AEGENTIX-SECURITY-INTELLIGENCE',
    category: 'SECURITY_INTELLIGENCE',
    type: 'FILE',
    status: 'DOCUMENTED',
    description: 'Security intelligence architectural overview, OSINT framework setup, and forensic methodology.'
  },
  {
    name: 'search_gemini_logs.py',
    relativePath: 'search_gemini_logs.py',
    fullPath: `${SECURITY_INTELLIGENCE_BASE}\\search_gemini_logs.py`,
    repoId: 'AEGENTIX-SECURITY-INTELLIGENCE',
    category: 'SECURITY_INTELLIGENCE',
    type: 'SCRIPT',
    status: 'ONLINE',
    description: 'Fast semantic and keyword indexing engine searching across all archived Gemini interaction transcripts.',
    quickCommand: `python "${SECURITY_INTELLIGENCE_BASE}\\search_gemini_logs.py"`
  }
];
