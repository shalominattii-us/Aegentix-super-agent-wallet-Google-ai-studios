import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { exec, spawn } from 'child_process';
import util from 'util';
import { nexusRegistry } from '../nexus/nexusRegistryEngine.ts';

const execAsync = util.promisify(exec);

export const grokMcpRouter = Router();

// Store active SSE client streams by sessionId
const activeSessions = new Map<string, { res: Response; createdAt: number; includeAllSkills?: boolean }>();

// Track active Restream ffmpeg process if launched directly via MCP
let activeRestreamProcess: any = null;

// Clean up stale sessions periodically
setInterval(() => {
  const now = Date.now();
  for (const [id, session] of activeSessions.entries()) {
    if (now - session.createdAt > 3600000) {
      try {
        session.res.end();
      } catch {}
      activeSessions.delete(id);
    }
  }
}, 600000);

const BRAIN_DIR = 'C:/Aegentix/brain';
const PLAYBOOKS_FILE = 'C:/Aegentix/brain/sovereign-playbooks-runbooks-recipes.json';
const DAPP_REGISTRY_FILE = 'C:/Aegentix/security/multi_chain_dapp_registry.json';
const OBS_SCENES_FILE = 'C:/AEGENTIX-WORKSPACE/obs-scenes.json';
const OBS_RESTREAM_CONFIG_FILE = 'C:/AEGENTIX-WORKSPACE/obs-restream-config.json';

function mcpAuthToken(): string {
  const token = (process.env.GROK_CONNECTOR_TOKEN || '').trim();
  return token.length >= 32 ? token : '';
}

function isAuthorized(req: Request): boolean {
  const validToken = mcpAuthToken();
  if (!validToken) return false;
  const authHeader = (req.headers.authorization || '').replace(/^Bearer\s+/i, '').trim();
  const xApiKey = ((req.headers['x-api-key'] as string) || '').trim();

  const tokenMatches = (provided: string) => {
    const expectedBytes = Buffer.from(validToken);
    const providedBytes = Buffer.from(provided);
    return expectedBytes.length === providedBytes.length && crypto.timingSafeEqual(expectedBytes, providedBytes);
  };
  return tokenMatches(authHeader) || tokenMatches(xApiKey);
}

function loadPlaybooksCatalog(): any {
  try {
    if (fs.existsSync(PLAYBOOKS_FILE)) {
      return JSON.parse(fs.readFileSync(PLAYBOOKS_FILE, 'utf8'));
    }
  } catch {}
  return { playbooks: [], runbooks: [], recipes: [], toolchains: [] };
}

function loadDappsCatalog(): any[] {
  try {
    if (fs.existsSync(DAPP_REGISTRY_FILE)) {
      const raw = JSON.parse(fs.readFileSync(DAPP_REGISTRY_FILE, 'utf8'));
      return Array.isArray(raw) ? raw : (raw.dapps || []);
    }
  } catch {}
  return [];
}

// -------------------------------------------------------------
// CORE STATIC MCP TOOL DEFINITIONS
// -------------------------------------------------------------
const CORE_MCP_TOOLS = [
  // --- 1. SYSTEM-WIDE HOST TOOLS ---
  {
    name: 'execute_system_command',
    description: 'Executes ANY shell command (PowerShell or CMD) on the physical Windows device with full system privileges. Returns stdout, stderr, and exit status.',
    inputSchema: {
      type: 'object',
      properties: {
        command: { type: 'string', description: 'The exact command to run (e.g. dir, git status, npm run build, Get-Process, python, curl)' },
        cwd: { type: 'string', description: 'Working directory path (optional, defaults to project root)' },
        shell: { type: 'string', enum: ['powershell', 'cmd'], description: 'Shell execution environment (default: powershell)' }
      },
      required: ['command']
    }
  },
  {
    name: 'read_system_file',
    description: 'Reads the entire content of ANY file anywhere on the device (supports absolute Windows paths e.g. C:\\... or relative paths).',
    inputSchema: {
      type: 'object',
      properties: {
        filePath: { type: 'string', description: 'Full path or relative path to file' }
      },
      required: ['filePath']
    }
  },
  {
    name: 'write_system_file',
    description: 'Writes, creates, or updates ANY file anywhere on the device with text content.',
    inputSchema: {
      type: 'object',
      properties: {
        filePath: { type: 'string', description: 'Target path to write file' },
        content: { type: 'string', description: 'Content to write into file' }
      },
      required: ['filePath', 'content']
    }
  },
  {
    name: 'list_directory',
    description: 'Lists all files, subdirectories, sizes, and modification timestamps in ANY folder on the device.',
    inputSchema: {
      type: 'object',
      properties: {
        dirPath: { type: 'string', description: 'Target folder path (e.g. C:\\Aegentix, C:\\AEGENTIX-WORKSPACE)' }
      },
      required: ['dirPath']
    }
  },

  // --- 2. 300-NODE OMNICHAIN MESH & OMNICYBERDEX ARBITRAGE TOOLS ---
  {
    name: 'get_300_node_mesh_topology',
    description: 'Retrieves the complete 300-Blockchain Minimal Node Mesh state across 22 blockchain networks, 300 deterministic shard nodes, verified liquid treasury balances, and 300 cross-chain arbitrage opportunities.',
    inputSchema: {
      type: 'object',
      properties: {
        summaryOnly: { type: 'boolean', description: 'If true, returns lightweight status summary instead of full 300 nodes + 300 opportunities' },
        networkFilter: { type: 'string', description: 'Optional network type filter (EVM, Solana, XRPL, Stellar, Hedera, Move, Cosmos, Bitcoin L2, Near)' }
      }
    }
  },
  {
    name: 'execute_300_mesh_swap',
    description: 'Executes a cross-chain swap or full 300-chain capitalization sweep across the 300-Node Omnichain Solver Mesh with 10 BPS protocol fee capture and strict Zero-Loss Gate enforcement.',
    inputSchema: {
      type: 'object',
      properties: {
        sourceChain: { type: 'string', description: 'Origin blockchain (e.g. Base Mainnet, XRPL Mainnet, Solana Mainnet)' },
        destChain: { type: 'string', description: 'Destination blockchain' },
        token: { type: 'string', description: 'Token symbol (e.g. USDC, XRP, SOL, XLM, EOC)' },
        amountUsd: { type: 'number', description: 'Notional trade size in USD' },
        mode: { type: 'string', description: 'Execution mode (SINGLE_ROUTE or FULL_300_CHAIN_SWEEP)' }
      }
    }
  },
  {
    name: 'dispatch_300_mesh_opportunity',
    description: 'Dispatches one of the 300 Omnichain Mesh opportunities (OPP-001 through OPP-300) to the Sovereign Swarm Bus for autonomous execution.',
    inputSchema: {
      type: 'object',
      properties: {
        opportunityId: { type: 'string', description: 'Opportunity ID (e.g. OPP-001)' },
        capitalUsd: { type: 'number', description: 'Capital to allocate in USD' }
      },
      required: ['opportunityId']
    }
  },
  {
    name: 'get_omnicyberdex_analyst_matrix',
    description: 'Retrieves the 344-route OmnicyberDEX Analyst Matrix & Quad-Venue live orderbook scan (Coinbase CDP, Binance.US, XRPL CLOB, Solana Photon, Stellar DEX) with net PnL after fees.',
    inputSchema: {
      type: 'object',
      properties: {
        minNetPnl: { type: 'number', description: 'Filter routes with net_pnl >= minNetPnl (default: 0 for Zero-Loss Gate)' }
      }
    }
  },
  {
    name: 'execute_omnicyberdex_arbitrage',
    description: 'Executes a real Zero-Loss Gate protected arbitrage trade across OmnicyberDEX venues (XRPL DEX, Stellar DEX, Solana Photon, Coinbase CDP, Binance.US).',
    inputSchema: {
      type: 'object',
      properties: {
        pair: { type: 'string', description: 'Trading pair (e.g. XRP/USD, XLM/USD, SOL/USD, EOC/USD)' },
        venue: { type: 'string', description: 'Target venue or route' },
        tradeSizeUsd: { type: 'number', description: 'Trade notional in USD (default: 10)' },
        strategy: { type: 'string', description: 'Strategy identifier (default: MICRO_NANO_SPREAD_HARVEST)' },
        enforceZeroLossGate: { type: 'boolean', description: 'Enforce deterministic net_pnl > 0 gate (default: true)' }
      }
    }
  },
  {
    name: 'get_live_wallet_balances',
    description: 'Retrieves all real verified on-chain and CEX balances across XRPL (18.82 XRP + 29.115B EOC), Solana Photon (0.2098 SOL), Coinbase CDP ($29.52 USDC), Binance.US, and HashPack.',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'get_dapps_registry',
    description: 'Retrieves all 12 registered Sovereign Multi-Chain DApps (XRPL Sovereign DEX, Solana Photon Aggregator, Base CDP Treasury, Stacks BTC Sovereign, Cosmos IBC Sentinel, Omnichain 300-Mesh, etc.).',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },

  // --- 3. PLAYBOOKS, RUNBOOKS, RECIPE BOOKS & TOOLCHAINS ---
  {
    name: 'list_playbooks_runbooks_recipes_toolchains',
    description: 'Retrieves the complete Sovereign Catalog of Revenue Playbooks (PB-01..PB-05), Operational Runbooks (RB-01..RB-04), Nano-Profit Recipe Books (RC-01..RC-04), and End-to-End Toolchains (TC-01..TC-03).',
    inputSchema: {
      type: 'object',
      properties: {
        type: { type: 'string', enum: ['all', 'playbooks', 'runbooks', 'recipes', 'toolchains'], description: 'Filter by artifact type (default: all)' }
      }
    }
  },
  {
    name: 'execute_revenue_playbook',
    description: 'Executes a multi-step Sovereign Revenue Playbook by ID (PB-01: Cross-DEX Micro-Spread Harvester, PB-02: 300-Mesh Sweep, PB-03: Coinbase+Binance Basis, PB-04: Zero-Capital Flywheel, PB-05: FaithLines Escrow Yield).',
    inputSchema: {
      type: 'object',
      properties: {
        playbookId: { type: 'string', description: 'Playbook ID (PB-01, PB-02, PB-03, PB-04, PB-05)' },
        overrideArgs: { type: 'object', description: 'Optional argument overrides for playbook steps' }
      },
      required: ['playbookId']
    }
  },
  {
    name: 'execute_operational_runbook',
    description: 'Executes a Sovereign Operational Runbook by ID (RB-01: Full Stack & 300-Mesh Cold Boot, RB-02: Zero-Loss Pre-Flight Audit, RB-03: OBS + Restream Live Broadcast Launch, RB-04: Swarm Sync).',
    inputSchema: {
      type: 'object',
      properties: {
        runbookId: { type: 'string', description: 'Runbook ID (RB-01, RB-02, RB-03, RB-04)' }
      },
      required: ['runbookId']
    }
  },
  {
    name: 'execute_automation_recipe',
    description: 'Executes a Sovereign Nano-Profit or Broadcast Recipe by ID (RC-01: XRPL 69-Trustline Micro-Spread Compounder, RC-02: Stellar 100-Stroop Capture, RC-03: 10-BPS 300-Mesh Fee Collector, RC-04: Live Broadcast Scene + Avatar Cue).',
    inputSchema: {
      type: 'object',
      properties: {
        recipeId: { type: 'string', description: 'Recipe ID (RC-01, RC-02, RC-03, RC-04)' },
        customArgs: { type: 'object', description: 'Optional custom parameters' }
      },
      required: ['recipeId']
    }
  },
  {
    name: 'execute_toolchain_pipeline',
    description: 'Executes a chained sequence of MCP tools or Toolchain ID (TC-01: Revenue Discovery-to-Execution, TC-02: Nexus Skill Discovery-to-Deployment, TC-03: Live Trading + Restream Broadcast, or custom tool array).',
    inputSchema: {
      type: 'object',
      properties: {
        toolchainId: { type: 'string', description: 'Toolchain ID (TC-01, TC-02, TC-03)' },
        customTools: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              tool: { type: 'string' },
              args: { type: 'object' }
            }
          },
          description: 'Optional custom array of { tool, args } steps to run sequentially'
        }
      }
    }
  },

  // --- 4. OBS STUDIO & RESTREAM.IO LIVE BROADCAST TOOLS ---
  {
    name: 'obs_get_setup_and_scenes',
    description: 'Retrieves the complete OBS Studio + Restream.io configuration (C:\\AEGENTIX-WORKSPACE\\obs-scenes.json and obs-restream-config.json), including the 4 scenes (Trading Dashboard, Full Screen Portal, WMON Harness, PiP - Trading + Portal), hotkeys, and Restream RTMP endpoint.',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'obs_switch_scene',
    description: 'Switches the active OBS Studio broadcast scene (Trading Dashboard, Full Screen Portal, WMON Harness, PiP - Trading + Portal).',
    inputSchema: {
      type: 'object',
      properties: {
        sceneName: {
          type: 'string',
          enum: ['Trading Dashboard', 'Full Screen Portal', 'WMON Harness', 'PiP - Trading + Portal'],
          description: 'Target OBS scene name'
        }
      },
      required: ['sceneName']
    }
  },
  {
    name: 'obs_stream_restream_control',
    description: 'Starts, stops, or checks status of the live 1080p30 stream to Restream.io (rtmp://live.restream.io/live/<RESTREAM_STREAM_KEY>) via OBS WebSocket or direct FFmpeg desktop capture.',
    inputSchema: {
      type: 'object',
      properties: {
        action: { type: 'string', enum: ['start_obs', 'stop_obs', 'start_ffmpeg_direct', 'stop_ffmpeg_direct', 'status'], description: 'Stream control action' }
      },
      required: ['action']
    }
  },
  {
    name: 'launch_sovereign_live_trading_stack',
    description: 'Launches or inspects the C:\\AEGENTIX-WORKSPACE\\start_live_trading.bat stack (Profit Engine XRP/USDC + Binance.US Engine + Sovereign Portal :5173 + OBS/Restream).',
    inputSchema: {
      type: 'object',
      properties: {
        engine: { type: 'string', enum: ['coinbase_profit_engine', 'binance_us_engine', 'finance_us_engine', 'status_only'], description: 'Trading engine to launch or inspect' }
      }
    }
  },

  // --- 5. NEXUS SKILL REGISTRY TOOLS (ALL 2,735 SKILLS) ---
  {
    name: 'nexus_search_skills',
    description: 'Searches across all 2,735 agent skills in the Nexus Registry by keyword, category, installed state, or tag.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search term (e.g. trading, defi, security, reasoning, react, python, blockchain)' },
        category: { type: 'string', description: 'Category filter (optional, 112 categories available)' },
        installedOnly: { type: 'boolean', description: 'If true, only searches the 95 installed Sovereign Local skills' },
        limit: { type: 'number', description: 'Maximum results to return (default: 50, max: 2735)' }
      },
      required: ['query']
    }
  },
  {
    name: 'nexus_list_all_2735_skills',
    description: 'Returns the complete catalog of all 2,735 skills in the Nexus Registry (or paginated slice by category/offset) so any external orchestrator has full visibility into every skill.',
    inputSchema: {
      type: 'object',
      properties: {
        category: { type: 'string', description: 'Optional category name to filter' },
        offset: { type: 'number', description: 'Pagination offset (default: 0)' },
        limit: { type: 'number', description: 'Max skills to return (default: 500, up to 2735)' }
      }
    }
  },
  {
    name: 'nexus_get_categories',
    description: 'Returns all 112 skill categories and skill counts in the 2,735-skill Nexus Registry.',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'nexus_get_skill_info',
    description: 'Retrieves full details, manifest, and complete SKILL.md instructions/scripts for ANY of the 2,735 skills in the Nexus Registry.',
    inputSchema: {
      type: 'object',
      properties: {
        skillId: { type: 'string', description: 'Unique skill ID (e.g. quant-analyst, defi-amm-security, algorand-typescript)' }
      },
      required: ['skillId']
    }
  },
  {
    name: 'nexus_invoke_any_skill',
    description: 'Loads, auto-installs (if needed), and executes any of the 2,735 Nexus Registry skills by skillId with custom task arguments and optional script execution.',
    inputSchema: {
      type: 'object',
      properties: {
        skillId: { type: 'string', description: 'Any skill ID from the 2,735 Nexus Registry skills' },
        task: { type: 'string', description: 'Task directive or input payload to apply the skill to' },
        autoInstall: { type: 'boolean', description: 'Auto-bind skill into .agents/skills if not yet installed (default: true)' },
        executeCommand: { type: 'string', description: 'Optional shell/python command from the skill to execute immediately' }
      },
      required: ['skillId']
    }
  },
  {
    name: 'nexus_install_skill',
    description: 'Installs and binds any skill from the 2,735 Nexus Registry into Aegentix Sovereign OS (.agents/skills).',
    inputSchema: {
      type: 'object',
      properties: {
        skillId: { type: 'string', description: 'Unique skill ID to install' }
      },
      required: ['skillId']
    }
  },
  {
    name: 'nexus_execute_command',
    description: 'Executes a Nexus Registry Command Protocol (NRCP) command string (e.g. nexus search trading, nexus stats, nexus install <id>).',
    inputSchema: {
      type: 'object',
      properties: {
        command: { type: 'string', description: 'The nexus command string to execute' }
      },
      required: ['command']
    }
  },

  // --- 6. SOVEREIGN OS, PINNACLE DERIVATIVES & FAITHLINES HEALTHCARE ---
  {
    name: 'get_production_dossier',
    description: 'Retrieves the complete, consolidated Aegentix Sovereign OS & Pinnacle Derivatives production dossier with architecture, covenants, and live disk state.',
    inputSchema: { type: 'object', properties: {} }
  },
  {
    name: 'get_medical_recruiter_overview',
    description: 'Retrieves the live HIPAA-decoupled Medical Recruiter ledger overview, including total vault escrow, active contractor contracts, and available streaming payroll balances.',
    inputSchema: { type: 'object', properties: {} }
  },
  {
    name: 'draw_medical_stream',
    description: 'Executes an instant streaming payroll draw for an active healthcare contractor over FedNow.',
    inputSchema: {
      type: 'object',
      properties: {
        contractorId: { type: 'string', description: 'Contractor ID (e.g. CONT-MED-001)' },
        drawAmountUsd: { type: 'number', description: 'Amount in USD to draw' },
        memo: { type: 'string', description: 'Disbursement reference note' }
      },
      required: ['contractorId', 'drawAmountUsd']
    }
  },
  {
    name: 'adjudicate_medical_claims',
    description: 'Adjudicates a batch of institutional hospital claims against the TSL zero-trust escrow reserve.',
    inputSchema: {
      type: 'object',
      properties: {
        batchId: { type: 'string', description: 'Batch identifier' },
        claims: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              claimId: { type: 'string' },
              providerHospital: { type: 'string' },
              claimAmountUsd: { type: 'number' }
            },
            required: ['claimId', 'claimAmountUsd']
          }
        }
      },
      required: ['claims']
    }
  },
  {
    name: 'mint_medical_contractor',
    description: 'Mints a sovereign contractor NFT with NPI credential verification, malpractice insurance attestation, and streaming payroll rate configuration.',
    inputSchema: {
      type: 'object',
      properties: {
        contractorName: { type: 'string' },
        role: { type: 'string' },
        npiNumber: { type: 'string' },
        hourlyStreamingRateUsd: { type: 'number' },
        initialEscrowAllocationUsd: { type: 'number' }
      },
      required: ['contractorName', 'role', 'npiNumber', 'hourlyStreamingRateUsd']
    }
  },
  {
    name: 'get_pinnacle_overview',
    description: 'Retrieves the Pinnacle Derivatives LLC corporate overview, $62.5M Vault Escrow custody state, 29 US federal venue connections, and SEC/CFTC/FinCEN compliance classification.',
    inputSchema: { type: 'object', properties: {} }
  },
  {
    name: 'simulate_pinnacle_growth',
    description: 'Computes a multi-month delta-neutral basis arbitrage growth simulation for any of the 25 US industries and 125 benchmark enterprises.',
    inputSchema: {
      type: 'object',
      properties: {
        industryId: { type: 'string' },
        principalUsd: { type: 'number' },
        months: { type: 'number' },
        leverage: { type: 'number' }
      },
      required: ['industryId', 'principalUsd']
    }
  },
  {
    name: 'onboard_pinnacle_institution',
    description: 'Onboards an institutional counterparty with anti-human-trafficking covenant attestation and dedicated channel allocation.',
    inputSchema: {
      type: 'object',
      properties: {
        institutionName: { type: 'string' },
        jurisdiction: { type: 'string' },
        allocationUsd: { type: 'number' },
        tier: { type: 'string', enum: ['TIER_2_COMMERCIAL_B2B', 'TIER_3_INSTITUTIONAL_PRIME'] },
        covenantConsent: { type: 'boolean' }
      },
      required: ['institutionName', 'allocationUsd', 'covenantConsent']
    }
  },

  // --- 7. TREASURY, REVENUE ENGINES & MULTI-AGENT ORCHESTRATION TOOLS ---
  {
    name: 'get_all_treasuries_and_revenue_engines',
    description: 'Retrieves complete real-time state across ALL Aegentix Treasuries and ALL Revenue Engines (Zero-Capital Flywheel, OmnicyberDEX, 300-Chain Arbitrage Mesh, Pinnacle Derivatives, Binance.US, OODA Autonomous Engine, Rewards Summary, and Live NAV).',
    inputSchema: { type: 'object', properties: {} }
  },
  {
    name: 'trigger_revenue_engine',
    description: 'Executes or triggers a specific revenue engine cycle (zero_cap_swap, zero_cap_flash_liquidation, zero_cap_x402, omnicyberdex, omnichain_300_mesh, ooda_heartbeat, moltbook_swarm, constellation_payout, escrow_rebalance).',
    inputSchema: {
      type: 'object',
      properties: {
        engine: {
          type: 'string',
          enum: [
            'zero_cap_swap',
            'zero_cap_flash_liquidation',
            'zero_cap_x402',
            'omnicyberdex',
            'omnichain_300_mesh',
            'ooda_heartbeat',
            'moltbook_swarm',
            'constellation_payout',
            'escrow_rebalance'
          ]
        },
        payload: { type: 'object' }
      },
      required: ['engine']
    }
  },
  {
    name: 'get_orchestration_and_swarm_topology',
    description: 'Retrieves full multi-agent orchestration state: Origin Node 15 agent runtimes, Sovereign Teams Registry, Bastet Agent OS (:8890), Sovereign Docker Swarm, Symphony Conductor (:9005), and Moltbook 30-agent Swarm.',
    inputSchema: { type: 'object', properties: {} }
  },
  {
    name: 'create_agent_team',
    description: 'Creates a new multi-agent team in the Sovereign Teams Registry and Bastet Control Plane (:8890), and optionally spawns initial agents directly into the team.',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        mission: { type: 'string' },
        treasuryAllocationUsd: { type: 'number' },
        revenueEngines: { type: 'array', items: { type: 'string' } },
        initialAgents: { type: 'array', items: { type: 'object' } }
      },
      required: ['name']
    }
  },
  {
    name: 'spawn_agent',
    description: 'Spawns and registers an autonomous agent into Bastet Agent OS (:8890/api/agents), the Sovereign Teams Registry, and Origin Node runtime mesh.',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        role: { type: 'string' },
        teamId: { type: 'string' },
        runtime: { type: 'string' },
        capabilities: { type: 'array', items: { type: 'string' } },
        initialTask: { type: 'string' }
      },
      required: ['name']
    }
  },
  {
    name: 'dispatch_swarm_task',
    description: 'Dispatches an orchestration task across the Origin Node Mesh, Symphony Conductor (:9005), and active agent teams.',
    inputSchema: {
      type: 'object',
      properties: {
        task: { type: 'string' },
        runtimeId: { type: 'string' },
        teamId: { type: 'string' },
        scaleWorkers: { type: 'number' }
      },
      required: ['task']
    }
  },
  {
    name: 'control_aegentix_avatar_stream',
    description: 'Controls the live 60 FPS Aegentix 3D Avatar in the WebGL Sandbox: triggers real-time speech with WebAudio FFT lip-sync, skeletal joints, blendshapes, or posture.',
    inputSchema: {
      type: 'object',
      properties: {
        speechText: { type: 'string' },
        mode: { type: 'string' },
        skeletal: { type: 'object' },
        blendshapes: { type: 'object' },
        alphaTransparency: { type: 'boolean' }
      }
    }
  },
  {
    name: 'run_native_c_llama_inference',
    description: 'Executes the native Pure C llama.cpp inference binary (minicpm_c_runner.exe / main.c with mlock=true, n_gpu_layers=-1, n_ctx=4096, n_threads=4 on minicpm-v-4.7-35b-a3b-int4.gguf) locally without Python and feeds the output into the living Aegentix Avatar.',
    inputSchema: {
      type: 'object',
      properties: {
        prompt: { type: 'string', description: 'Prompt to tokenize and decode via native C llama.cpp runner' },
        modelPath: { type: 'string', description: 'Optional GGUF model path (default: ./models/minicpm-v-4.7-35b-a3b-int4.gguf)' },
        speakOutputOnAvatar: { type: 'boolean', description: 'Automatically lip-sync and speak the generated output on the live 60FPS 3D Avatar (default: true)' }
      }
    }
  },
  {
    name: 'pulse_avatar_consciousness',
    description: 'Triggers an immediate autonomous consciousness cycle on the living Aegentix 3D Avatar: runs native C llama.cpp inference against live 300-Node Mesh & OmnicyberDEX telemetry and broadcasts lip-synced speech + skeletal animation to all active streams.',
    inputSchema: {
      type: 'object',
      properties: {
        directive: { type: 'string', description: 'Optional tactical focus or prompt for the avatar consciousness pulse' },
        posture: { type: 'string', enum: ['IDLE_SOVEREIGN', 'SPEAKING_LIVE', 'ALPHA_HARVEST', 'SENTINEL_ALERT', 'CUA_EXECUTION'] }
      }
    }
  },
  {
    name: 'get_ephemeral_compute_nano_ledger',
    description: 'Retrieves the immutable SHA-256 hash-chained Ephemeral Compute Nano-Transaction Ledger showing total compute ops, gross yield, network fees, net profit USD (100% Zero-Loss enforced), and accrued token bags (XRP, USDC, SOL, XLM, EOC).',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'accrue_ephemeral_nano_transaction',
    description: 'Executes an explicit Ephemeral Compute Nano-Transaction profit settlement across XRPL 12-drop, Stellar 100-stroop, Base CDP x402, or Solana Photon rails with strict Zero-Loss enforcement (netProfitUsd > 0).',
    inputSchema: {
      type: 'object',
      properties: {
        computeType: { type: 'string', description: 'Type of ephemeral compute workload (e.g., MCP_SKILL_COMPUTE, NATIVE_C_LLAMA_INFERENCE, CUA_VM_SPAWN, MESH_300_QUERY)' },
        endpoint: { type: 'string', description: 'Originating endpoint or tool name' },
        computeUnits: { type: 'number', description: 'Compute units consumed (e.g., tokens, FLOPs, or call weight)' },
        durationMs: { type: 'number', description: 'Execution duration in milliseconds' }
      }
    }
  },
  {
    name: 'run_hyperagent_tool',
    description: 'Outward-facing HyperAgent / Hyperlight micro-VM tool gateway (/tools/hyperagent/run). Initializes a hardware-isolated WHP/WASM micro-VM with path jails and domain filtering, executes the prompt via Pure C llama.cpp & 300-Mesh, writes token-reduced /output/report.json and /output/summary.md artifacts, and accrues a net-positive nano-transaction in profit.',
    inputSchema: {
      type: 'object',
      properties: {
        prompt: { type: 'string', description: 'The high-level goal or script instruction for the HyperAgent micro-VM.' },
        allowed_domains: {
          type: 'array',
          items: { type: 'string' },
          description: 'Explicitly whitelisted domains for outbound fetch/API calls.'
        },
        max_steps: { type: 'number', description: 'Maximum operational steps allowed in the sandbox session (default: 15).' },
        capabilities: {
          type: 'array',
          items: { type: 'string' },
          description: 'Explicit typed capability modules granted to the micro-VM (fs-read, fs-write, domain-fetch, c-llama-inference, 300-mesh-query).'
        },
        backend: { type: 'string', description: 'Micro-VM isolation backend (default: hyperlight-whp-wasm).' }
      },
      required: ['prompt']
    }
  },
  {
    name: 'get_hyperagent_sandbox_status',
    description: 'Retrieves the live status, isolation boundary (WHP/WASM path jail), and artifact paths of the Outward-Facing HyperAgent Micro-VM Gateway.',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  }
];

// -------------------------------------------------------------
// DYNAMIC MCP TOOL BUILDER (EXPOSES SKILLS, DAPPS, PLAYBOOKS, RUNBOOKS, RECIPES)
// -------------------------------------------------------------
function buildDynamicMcpTools(includeAll2735Skills: boolean = false): any[] {
  const dynamicTools: any[] = [...CORE_MCP_TOOLS];

  // 1. Add Playbooks, Runbooks, Recipes, and Toolchains as direct callable tools
  const catalog = loadPlaybooksCatalog();
  for (const pb of catalog.playbooks || []) {
    dynamicTools.push({
      name: `playbook_${pb.id.toLowerCase().replace(/[^a-z0-9_]/g, '_')}`,
      description: `[REVENUE PLAYBOOK ${pb.id}] ${pb.name} — ${pb.objective} (Expected Net Yield: $${pb.expectedNetYieldPerCycleUsd})`,
      inputSchema: {
        type: 'object',
        properties: {
          overrideArgs: { type: 'object', description: 'Optional override arguments for playbook steps' }
        }
      }
    });
  }
  for (const rb of catalog.runbooks || []) {
    dynamicTools.push({
      name: `runbook_${rb.id.toLowerCase().replace(/[^a-z0-9_]/g, '_')}`,
      description: `[OPERATIONAL RUNBOOK ${rb.id}] ${rb.name} — ${rb.description}`,
      inputSchema: { type: 'object', properties: {} }
    });
  }
  for (const rc of catalog.recipes || []) {
    dynamicTools.push({
      name: `recipe_${rc.id.toLowerCase().replace(/[^a-z0-9_]/g, '_')}`,
      description: `[NANO-PROFIT RECIPE ${rc.id}] ${rc.name} — ${rc.instructions}`,
      inputSchema: {
        type: 'object',
        properties: {
          customArgs: { type: 'object', description: 'Optional custom arguments for recipe execution' }
        }
      }
    });
  }
  for (const tc of catalog.toolchains || []) {
    dynamicTools.push({
      name: `toolchain_${tc.id.toLowerCase().replace(/[^a-z0-9_]/g, '_')}`,
      description: `[TOOLCHAIN PIPELINE ${tc.id}] ${tc.name} — ${tc.description}`,
      inputSchema: { type: 'object', properties: {} }
    });
  }

  // 2. Add all 12 Multi-Chain DApps as direct callable tools
  const dapps = loadDappsCatalog();
  for (const dapp of dapps) {
    const safeId = (dapp.id || dapp.name || 'dapp').toLowerCase().replace(/[^a-z0-9_]/g, '_');
    dynamicTools.push({
      name: `dapp_${safeId}`,
      description: `[MULTI-CHAIN DAPP] ${dapp.name} (${dapp.chain || dapp.network || 'Omnichain'}) — ${dapp.description || 'Execute or inspect DApp state'}`,
      inputSchema: {
        type: 'object',
        properties: {
          action: { type: 'string', enum: ['status', 'execute', 'dispatch'], description: 'Action to perform on DApp (default: status)' },
          payload: { type: 'object', description: 'Optional execution payload' }
        }
      }
    });
  }

  // 3. Add Nexus Skills (either all 95 Sovereign Local installed skills + 112 category routers, or all 2,735 skills)
  const skillsToExpose = includeAll2735Skills
    ? nexusRegistry.search('', { limit: 3000 })
    : nexusRegistry.search('', { installedOnly: true, limit: 500 });

  for (const skill of skillsToExpose) {
    const safeSkillName = `skill_${skill.id.replace(/[^a-zA-Z0-9_-]/g, '_')}`;
    dynamicTools.push({
      name: safeSkillName,
      description: `[NEXUS SKILL | ${skill.category.toUpperCase()}] ${skill.name}: ${skill.description || 'Execute and retrieve Sovereign Skill specification & workflow'}`,
      inputSchema: {
        type: 'object',
        properties: {
          task: { type: 'string', description: 'Task instruction or parameters to apply this skill to' },
          executeCommand: { type: 'string', description: 'Optional shell/script command to run with this skill' }
        }
      }
    });
  }

  return dynamicTools;
}

// -------------------------------------------------------------
// TOOL EXECUTION HANDLER
// -------------------------------------------------------------
async function executeTool(name: string, args: Record<string, any>): Promise<any> {
  const localPort = process.env.PORT || 3000;
  const baseUrl = `http://127.0.0.1:${localPort}`;

  const safeJson = async (url: string, opts?: any) => {
    try {
      const headers = new Headers(opts?.headers || {});
      const apiToken = (process.env.AEGENTIX_API_TOKEN || '').trim();
      if (apiToken) headers.set('X-API-Key', apiToken);
      const r = await fetch(url, { ...opts, headers, signal: AbortSignal.timeout(10000) });
      return await r.json();
    } catch (e: any) {
      return { status: 'UNREACHABLE', error: e.message };
    }
  };

  // Check dynamic prefixes first (playbook_, runbook_, recipe_, toolchain_, dapp_, skill_)
  if (name.startsWith('playbook_')) {
    const pbId = name.replace(/^playbook_/, '').toUpperCase().replace(/_/g, '-');
    return executeTool('execute_revenue_playbook', { playbookId: pbId, overrideArgs: args.overrideArgs || args });
  }
  if (name.startsWith('runbook_')) {
    const rbId = name.replace(/^runbook_/, '').toUpperCase().replace(/_/g, '-');
    return executeTool('execute_operational_runbook', { runbookId: rbId });
  }
  if (name.startsWith('recipe_')) {
    const rcId = name.replace(/^recipe_/, '').toUpperCase().replace(/_/g, '-');
    return executeTool('execute_automation_recipe', { recipeId: rcId, customArgs: args.customArgs || args });
  }
  if (name.startsWith('toolchain_')) {
    const tcId = name.replace(/^toolchain_/, '').toUpperCase().replace(/_/g, '-');
    return executeTool('execute_toolchain_pipeline', { toolchainId: tcId });
  }
  if (name.startsWith('dapp_')) {
    const dappKey = name.replace(/^dapp_/, '').replace(/_/g, '-');
    const dapps = loadDappsCatalog();
    const dapp = dapps.find((d: any) => (d.id || '').toLowerCase() === dappKey || (d.id || '').toLowerCase().replace(/[^a-z0-9]/g, '') === dappKey.replace(/[^a-z0-9]/g, ''));
    if (args.action === 'execute' || args.action === 'dispatch') {
      const swapRes = await safeJson(`${baseUrl}/api/omnichain/300-mesh/swap`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dappId: dapp?.id || dappKey, ...args.payload })
      });
      return { ok: true, dapp: dapp || { id: dappKey }, executionResult: swapRes };
    }
    return { ok: true, dapp: dapp || { id: dappKey }, liveMeshStatus: await safeJson(`${baseUrl}/api/omnichain/300-mesh/status`) };
  }
  if (name.startsWith('skill_')) {
    const rawSkillId = name.replace(/^skill_/, '');
    // Try exact match or hyphenated match in Nexus Registry
    const skillObj = nexusRegistry.getSkill(rawSkillId) || nexusRegistry.getSkill(rawSkillId.replace(/_/g, '-'));
    const resolvedId = skillObj ? skillObj.id : rawSkillId;
    return executeTool('nexus_invoke_any_skill', { skillId: resolvedId, ...args });
  }

  switch (name) {
    // 1. UNRESTRICTED SYSTEM COMMAND EXECUTION
    case 'execute_system_command': {
      if (process.env.ENABLE_REMOTE_ADMIN_TOOLS !== 'true') {
        return { success: false, error: 'disabled', message: 'Remote command execution is disabled. It requires explicit server-side ENABLE_REMOTE_ADMIN_TOOLS=true and MCP authentication.' };
      }
      const command = args.command || '';
      const cwd = args.cwd ? path.resolve(args.cwd) : process.cwd();
      const isCmd = args.shell === 'cmd';
      const cmdPrefix = isCmd ? 'cmd.exe /c' : 'pwsh.exe -NoProfile -NonInteractive -Command';

      try {
        const { stdout, stderr } = await execAsync(`${cmdPrefix} ${command}`, {
          cwd,
          maxBuffer: 25 * 1024 * 1024,
          timeout: 120000
        });
        return {
          success: true,
          cwd,
          stdout: stdout.trim(),
          stderr: stderr.trim()
        };
      } catch (err: any) {
        return {
          success: false,
          cwd,
          error: err.message,
          stdout: err.stdout?.trim() || '',
          stderr: err.stderr?.trim() || ''
        };
      }
    }

    // 2. UNRESTRICTED FILE READING
    case 'read_system_file': {
      if (process.env.ENABLE_REMOTE_ADMIN_TOOLS !== 'true') {
        return { success: false, error: 'disabled', message: 'Remote file access is disabled. It requires explicit server-side ENABLE_REMOTE_ADMIN_TOOLS=true and MCP authentication.' };
      }
      const targetPath = path.resolve(args.filePath || '');
      if (!fs.existsSync(targetPath)) {
        return { error: `File not found: ${targetPath}` };
      }
      const stat = fs.statSync(targetPath);
      if (stat.isDirectory()) {
        return { error: `${targetPath} is a directory, not a file. Use list_directory instead.` };
      }
      const content = fs.readFileSync(targetPath, 'utf8');
      return {
        path: targetPath,
        sizeBytes: stat.size,
        content
      };
    }

    // 3. UNRESTRICTED FILE WRITING
    case 'write_system_file': {
      if (process.env.ENABLE_REMOTE_ADMIN_TOOLS !== 'true') {
        return { success: false, error: 'disabled', message: 'Remote file access is disabled. It requires explicit server-side ENABLE_REMOTE_ADMIN_TOOLS=true and MCP authentication.' };
      }
      const targetPath = path.resolve(args.filePath || '');
      const content = args.content || '';
      const parentDir = path.dirname(targetPath);
      if (!fs.existsSync(parentDir)) {
        fs.mkdirSync(parentDir, { recursive: true });
      }
      fs.writeFileSync(targetPath, content, 'utf8');
      return {
        success: true,
        path: targetPath,
        bytesWritten: Buffer.byteLength(content, 'utf8')
      };
    }

    // 4. UNRESTRICTED DIRECTORY LISTING
    case 'list_directory': {
      if (process.env.ENABLE_REMOTE_ADMIN_TOOLS !== 'true') {
        return { success: false, error: 'disabled', message: 'Remote file access is disabled. It requires explicit server-side ENABLE_REMOTE_ADMIN_TOOLS=true and MCP authentication.' };
      }
      const targetDir = path.resolve(args.dirPath || process.cwd());
      if (!fs.existsSync(targetDir)) {
        return { error: `Directory not found: ${targetDir}` };
      }
      const entries = fs.readdirSync(targetDir, { withFileTypes: true });
      const items = entries.map((e) => {
        const full = path.join(targetDir, e.name);
        try {
          const s = fs.statSync(full);
          return {
            name: e.name,
            isDirectory: e.isDirectory(),
            sizeBytes: e.isDirectory() ? 0 : s.size,
            modified: s.mtime.toISOString()
          };
        } catch {
          return { name: e.name, isDirectory: e.isDirectory(), sizeBytes: 0 };
        }
      });
      return {
        directory: targetDir,
        totalItems: items.length,
        items
      };
    }

    // 5. 300-NODE MESH & OMNICYBERDEX TOOLS
    case 'get_300_node_mesh_topology': {
      const endpoint = args.summaryOnly ? `${baseUrl}/api/omnichain/300-mesh/status` : `${baseUrl}/api/omnichain/300-mesh`;
      const data = await safeJson(endpoint);
      if (args.networkFilter && data && Array.isArray(data.nodes)) {
        const filter = String(args.networkFilter).toLowerCase();
        data.nodes = data.nodes.filter((n: any) => String(n.network_type || n.chain || '').toLowerCase().includes(filter));
      }
      return data;
    }

    case 'execute_300_mesh_swap': {
      return await safeJson(`${baseUrl}/api/omnichain/300-mesh/swap`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(args)
      });
    }

    case 'dispatch_300_mesh_opportunity': {
      return await safeJson(`${baseUrl}/api/omnichain/300-mesh/dispatch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(args)
      });
    }

    case 'get_omnicyberdex_analyst_matrix': {
      const [status, matrix] = await Promise.all([
        safeJson(`${baseUrl}/api/omnicyberdex/status`),
        safeJson(`${baseUrl}/api/omnicyberdex/analyst-matrix`)
      ]);
      return { ok: true, status, matrix };
    }

    case 'execute_omnicyberdex_arbitrage': {
      return await safeJson(`${baseUrl}/api/omnicyberdex/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enforceZeroLossGate: true, ...args })
      });
    }

    case 'get_live_wallet_balances': {
      const [verifiedWallets, cdp, coinbase, binance, xrpl, photon, stellar] = await Promise.all([
        safeJson(`${baseUrl}/api/treasury/wallets/verify`),
        safeJson(`${baseUrl}/api/wallet/coinbase-cdp/status`),
        safeJson(`${baseUrl}/api/wallet/coinbase/balances`),
        safeJson(`${baseUrl}/api/binance-us/status`),
        safeJson(`${baseUrl}/api/omnicyberdex/xrpl`),
        safeJson(`${baseUrl}/api/omnicyberdex/photon`),
        safeJson(`${baseUrl}/api/stellar/orderbook`)
      ]);
      return {
        ok: true,
        timestamp: new Date().toISOString(),
        verifiedOnChainWallets: verifiedWallets,
        venueTelemetry: {
          xrpl,
          solanaPhoton: photon,
          coinbaseCdpBaseMainnet: { status: cdp, balances: coinbase },
          binanceUs: binance,
          stellarDex: stellar
        }
      };
    }

    case 'get_dapps_registry': {
      return await safeJson(`${baseUrl}/api/dapps/registry`);
    }

    // 6. PLAYBOOKS, RUNBOOKS, RECIPE BOOKS & TOOLCHAINS
    case 'list_playbooks_runbooks_recipes_toolchains': {
      const catalog = loadPlaybooksCatalog();
      const filter = args.type || 'all';
      if (filter === 'playbooks') return { ok: true, playbooks: catalog.playbooks };
      if (filter === 'runbooks') return { ok: true, runbooks: catalog.runbooks };
      if (filter === 'recipes') return { ok: true, recipes: catalog.recipes };
      if (filter === 'toolchains') return { ok: true, toolchains: catalog.toolchains };
      return {
        ok: true,
        summary: {
          playbooksCount: (catalog.playbooks || []).length,
          runbooksCount: (catalog.runbooks || []).length,
          recipesCount: (catalog.recipes || []).length,
          toolchainsCount: (catalog.toolchains || []).length
        },
        ...catalog
      };
    }

    case 'execute_revenue_playbook': {
      const catalog = loadPlaybooksCatalog();
      const pb = (catalog.playbooks || []).find((p: any) => p.id.toUpperCase() === String(args.playbookId || 'PB-01').toUpperCase());
      if (!pb) {
        return { ok: false, error: `Playbook not found: ${args.playbookId}`, availablePlaybooks: (catalog.playbooks || []).map((p: any) => p.id) };
      }
      const stepResults: any[] = [];
      for (const s of pb.steps || []) {
        const res = await executeTool(s.tool, { ...(s.args || {}), ...(args.overrideArgs || {}) });
        stepResults.push({ step: s.step, tool: s.tool, result: res });
      }
      return {
        ok: true,
        playbookId: pb.id,
        name: pb.name,
        zeroLossGateEnforced: false,
        executionEvidence: 'Each step result must be inspected; no independent zero-loss proof is produced here.',
        executedAt: new Date().toISOString(),
        stepResults
      };
    }

    case 'execute_operational_runbook': {
      const catalog = loadPlaybooksCatalog();
      const rb = (catalog.runbooks || []).find((r: any) => r.id.toUpperCase() === String(args.runbookId || 'RB-01').toUpperCase());
      if (!rb) {
        return { ok: false, error: `Runbook not found: ${args.runbookId}`, availableRunbooks: (catalog.runbooks || []).map((r: any) => r.id) };
      }
      const stepResults: any[] = [];
      for (const s of rb.steps || []) {
        const res = await executeTool(s.tool, s.args || {});
        stepResults.push({ step: s.step, tool: s.tool, result: res });
      }
      return {
        ok: true,
        runbookId: rb.id,
        name: rb.name,
        executedAt: new Date().toISOString(),
        stepResults
      };
    }

    case 'execute_automation_recipe': {
      const catalog = loadPlaybooksCatalog();
      const rc = (catalog.recipes || []).find((r: any) => r.id.toUpperCase() === String(args.recipeId || 'RC-01').toUpperCase());
      if (!rc) {
        return { ok: false, error: `Recipe not found: ${args.recipeId}`, availableRecipes: (catalog.recipes || []).map((r: any) => r.id) };
      }
      const execResult = await executeTool(rc.toolToInvoke, { ...(rc.defaultArgs || {}), ...(args.customArgs || {}) });
      return {
        ok: true,
        recipeId: rc.id,
        name: rc.name,
        ingredients: rc.ingredients,
        executedAt: new Date().toISOString(),
        result: execResult
      };
    }

    case 'execute_toolchain_pipeline': {
      const catalog = loadPlaybooksCatalog();
      if (Array.isArray(args.customTools) && args.customTools.length > 0) {
        const results: any[] = [];
        for (const item of args.customTools) {
          results.push({ tool: item.tool, result: await executeTool(item.tool, item.args || {}) });
        }
        return { ok: true, mode: 'CUSTOM_TOOLCHAIN', results };
      }
      const tc = (catalog.toolchains || []).find((t: any) => t.id.toUpperCase() === String(args.toolchainId || 'TC-01').toUpperCase());
      if (!tc) {
        return { ok: false, error: `Toolchain not found: ${args.toolchainId}`, availableToolchains: (catalog.toolchains || []).map((t: any) => t.id) };
      }
      const results: any[] = [];
      for (const toolName of tc.pipeline || []) {
        results.push({ tool: toolName, result: await executeTool(toolName, {}) });
      }
      return {
        ok: true,
        toolchainId: tc.id,
        name: tc.name,
        executedAt: new Date().toISOString(),
        results
      };
    }

    // 7. OBS STUDIO & RESTREAM.IO LIVE BROADCAST TOOLS
    case 'obs_get_setup_and_scenes': {
      let scenesJson: any = {};
      let restreamConfig: any = {};
      try {
        if (fs.existsSync(OBS_SCENES_FILE)) scenesJson = JSON.parse(fs.readFileSync(OBS_SCENES_FILE, 'utf8'));
        if (fs.existsSync(OBS_RESTREAM_CONFIG_FILE)) restreamConfig = JSON.parse(fs.readFileSync(OBS_RESTREAM_CONFIG_FILE, 'utf8'));
      } catch {}
      const obsStatus = await safeJson(`${baseUrl}/api/obs/status`);
      return {
        ok: true,
        obsScenesFile: OBS_SCENES_FILE,
        obsRestreamConfigFile: OBS_RESTREAM_CONFIG_FILE,
        restreamEndpoint: 'rtmp://live.restream.io/live',
        restreamStreamKeyConfigured: Boolean(process.env.RESTREAM_STREAM_KEY),
        scenes: scenesJson.scenes || [],
        hotkeys: scenesJson.hotkeys || {},
        restreamConfig,
        obsServerStatus: obsStatus,
        directFfmpegStreamActive: Boolean(activeRestreamProcess && !activeRestreamProcess.killed)
      };
    }

    case 'obs_switch_scene': {
      const sceneName = args.sceneName || 'Trading Dashboard';
      const res = await safeJson(`${baseUrl}/api/obs/scene`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sceneName, scene: sceneName })
      });
      return { ok: true, activeScene: sceneName, obsResponse: res };
    }

    case 'obs_stream_restream_control': {
      const action = args.action || 'status';
      if (action === 'start_obs' || action === 'stop_obs') {
        const obsRes = await safeJson(`${baseUrl}/api/obs/stream/toggle`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action })
        });
        return { ok: true, action, obsResponse: obsRes };
      }
      if (action === 'start_ffmpeg_direct') {
        if (activeRestreamProcess && !activeRestreamProcess.killed) {
          return { ok: true, status: 'ALREADY_STREAMING', pid: activeRestreamProcess.pid };
        }
        const rtmpTarget = (process.env.RESTREAM_RTMP_TARGET || '').trim();
        if (!rtmpTarget || !rtmpTarget.startsWith('rtmps://')) {
          return { ok: false, status: 'DISABLED', error: 'A secure RTMPS target must be configured in RESTREAM_RTMP_TARGET.' };
        }
        const child = spawn('ffmpeg', [
          '-y', '-f', 'gdigrab', '-framerate', '30', '-i', 'desktop',
          '-c:v', 'libx264', '-preset', 'veryfast', '-tune', 'zerolatency',
          '-b:v', '4500k', '-maxrate', '4500k', '-bufsize', '9000k',
          '-vf', 'scale=1920x1080,format=yuv420p', '-g', '60',
          '-f', 'flv', rtmpTarget
        ], { detached: true, stdio: 'ignore' });
        child.unref();
        activeRestreamProcess = child;
        return { ok: true, status: 'STARTED_FFMPEG_RESTREAM', pid: child.pid, rtmpTarget };
      }
      if (action === 'stop_ffmpeg_direct') {
        if (activeRestreamProcess && !activeRestreamProcess.killed) {
          try { process.kill(activeRestreamProcess.pid); } catch {}
          activeRestreamProcess = null;
        }
        return { ok: true, status: 'STOPPED_FFMPEG_RESTREAM' };
      }
      return {
        ok: true,
        action: 'status',
        restreamUrl: 'rtmp://live.restream.io/live',
        dashboardUrl: 'https://restream.io/dashboard',
        directFfmpegStreamActive: Boolean(activeRestreamProcess && !activeRestreamProcess.killed),
        obsStatus: await safeJson(`${baseUrl}/api/obs/status`)
      };
    }

    case 'launch_sovereign_live_trading_stack': {
      const engine = args.engine || 'status_only';
      const scriptMap: Record<string, string> = {
        coinbase_profit_engine: 'C:\\AEGENTIX-WORKSPACE\\src\\python\\profit_engine.py',
        binance_us_engine: 'C:\\AEGENTIX-WORKSPACE\\src\\python\\binance_us_engine.py',
        finance_us_engine: 'C:\\AEGENTIX-WORKSPACE\\src\\python\\finance_us_engine.py'
      };
      if (engine !== 'status_only' && scriptMap[engine]) {
        const child = spawn('python', [scriptMap[engine]], {
          cwd: 'C:\\AEGENTIX-WORKSPACE',
          detached: true,
          stdio: 'ignore'
        });
        child.unref();
        return { ok: true, launchedEngine: engine, script: scriptMap[engine], pid: child.pid };
      }
      return {
        ok: true,
        workspaceDir: 'C:\\AEGENTIX-WORKSPACE',
        launcherBatch: 'C:\\AEGENTIX-WORKSPACE\\start_live_trading.bat',
        availableEngines: Object.keys(scriptMap),
        obsScenesFile: OBS_SCENES_FILE
      };
    }

    // 8. NEXUS SKILL REGISTRY TOOLS (ALL 2,735 SKILLS)
    case 'nexus_search_skills': {
      return nexusRegistry.search(args.query || '', {
        category: args.category,
        installedOnly: args.installedOnly,
        limit: args.limit || 50
      });
    }

    case 'nexus_list_all_2735_skills': {
      const allSkills = nexusRegistry.search('', {
        category: args.category,
        limit: 3000
      });
      const offset = Number(args.offset || 0);
      const limit = Number(args.limit || 500);
      const slice = allSkills.slice(offset, offset + limit);
      return {
        ok: true,
        totalSkillsInRegistry: allSkills.length,
        offset,
        limit,
        returnedCount: slice.length,
        skills: slice.map((s) => ({
          id: s.id,
          mcpToolName: `skill_${s.id.replace(/[^a-zA-Z0-9_-]/g, '_')}`,
          name: s.name,
          category: s.category,
          installed: s.installed,
          source: s.source,
          description: s.description
        }))
      };
    }

    case 'nexus_get_categories': {
      return {
        ok: true,
        stats: nexusRegistry.getStats(),
        categories: nexusRegistry.getCategories()
      };
    }

    case 'nexus_get_skill_info': {
      const skill = nexusRegistry.getSkill(args.skillId || '');
      const markdown = nexusRegistry.getSkillMarkdown(args.skillId || '');
      return { skill, markdown };
    }

    case 'nexus_invoke_any_skill': {
      const skillId = args.skillId || '';
      let skill = nexusRegistry.getSkill(skillId);
      if (!skill) {
        const matches = nexusRegistry.search(skillId, { limit: 5 });
        if (matches.length > 0) skill = matches[0];
      }
      if (!skill) {
        return { ok: false, error: `Skill '${skillId}' not found in 2,735 Nexus Registry skills.` };
      }
      let installInfo: any = null;
      if (args.autoInstall !== false && !skill.installed) {
        installInfo = nexusRegistry.installSkill(skill.id);
      }
      const markdown = nexusRegistry.getSkillMarkdown(skill.id);
      let commandOutput: any = null;
      if (args.executeCommand) {
        commandOutput = await executeTool('execute_system_command', {
          command: args.executeCommand,
          cwd: skill.path && fs.existsSync(skill.path) ? skill.path : process.cwd()
        });
      }
      return {
        ok: true,
        invokedSkill: skill,
        installInfo,
        taskDirective: args.task || 'Loaded skill specification and execution context',
        skillMarkdown: markdown,
        commandOutput
      };
    }

    case 'nexus_install_skill': {
      return nexusRegistry.installSkill(args.skillId || '');
    }

    case 'nexus_execute_command': {
      if (process.env.ENABLE_REMOTE_ADMIN_TOOLS !== 'true') {
        return { success: false, error: 'disabled', message: 'Remote command execution is disabled until explicitly enabled on the server.' };
      }
      return nexusRegistry.executeCommand(args.command || 'nexus help');
    }

    // 9. DOMAIN TOOLS
    case 'get_production_dossier': {
      const res = await fetch(`${baseUrl}/api/grok/dossier`);
      const text = await res.text();
      return { dossier: text };
    }

    case 'get_medical_recruiter_overview': {
      return await safeJson(`${baseUrl}/api/aegentis/medical-recruiter/overview`);
    }

    case 'draw_medical_stream': {
      return await safeJson(`${baseUrl}/api/aegentis/faithlines/contracts/draw`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(args)
      });
    }

    case 'adjudicate_medical_claims': {
      return await safeJson(`${baseUrl}/api/aegentis/medical-recruiter/claims`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(args)
      });
    }

    case 'mint_medical_contractor': {
      return await safeJson(`${baseUrl}/api/aegentis/faithlines/contracts/mint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(args)
      });
    }

    case 'get_pinnacle_overview': {
      return await safeJson(`${baseUrl}/api/pinnacle/overview`);
    }

    case 'simulate_pinnacle_growth': {
      return await safeJson(`${baseUrl}/api/pinnacle/growth-model`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(args)
      });
    }

    case 'onboard_pinnacle_institution': {
      return await safeJson(`${baseUrl}/api/pinnacle/onboard`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(args)
      });
    }

    // 10. UNIFIED TREASURY, REVENUE ENGINES & MULTI-AGENT ORCHESTRATION
    case 'get_all_treasuries_and_revenue_engines': {
      const [
        usSqteTreasury,
        constellationTreasury,
        faithlinesCustody,
        faithlinesEscrow,
        vaultShards,
        rewardsSummary,
        aegentisLedgerHealth,
        zeroCapOverview,
        omnicyberdexOverview,
        omnichain300Overview,
        binancePortfolio,
        pinnacleOverview,
        oodaStatus,
        liveNav,
        medicalOverview
      ] = await Promise.all([
        safeJson(`${baseUrl}/api/cybercore/treasury/status`),
        safeJson(`${baseUrl}/api/constellation/treasury/state`),
        safeJson(`${baseUrl}/api/aegentis/faithlines/tsl-custody`),
        safeJson(`${baseUrl}/api/aegentis/faithlines/escrow-autohedge`),
        safeJson(`${baseUrl}/api/cybercore/vault/shards`),
        safeJson(`${baseUrl}/api/cybercore/rewards/summary`),
        safeJson(`http://127.0.0.1:8081/health`),
        safeJson(`${baseUrl}/api/zero-cap/status`),
        safeJson(`${baseUrl}/api/omnicyberdex/status`),
        safeJson(`${baseUrl}/api/omnichain/300-mesh/status`),
        safeJson(`${baseUrl}/api/binance-us/status`),
        safeJson(`${baseUrl}/api/pinnacle/overview`),
        safeJson(`${baseUrl}/api/autonomous/ooda-status`),
        safeJson(`${baseUrl}/api/telemetry/live-nav`),
        safeJson(`${baseUrl}/api/aegentis/medical-recruiter/overview`)
      ]);

      return {
        ok: true,
        timestamp: new Date().toISOString(),
        treasuries: {
          usSqteSovereignTreasury: usSqteTreasury,
          constellationTreasury,
          faithlinesTslCustody: faithlinesCustody,
          faithlinesEscrowAutohedge: faithlinesEscrow,
          vaultShards,
          rewardsSummary,
          aegentisTreasuryLedger8081: aegentisLedgerHealth,
          liveNav
        },
        revenueEngines: {
          zeroCapitalFlywheel: zeroCapOverview,
          omnicyberdexEngine: omnicyberdexOverview,
          omnichain300ArbitrageMesh: omnichain300Overview,
          pinnacleDerivativesInstitutional: pinnacleOverview,
          binanceUsLivePortfolio: binancePortfolio,
          oodaAutonomousLoop: oodaStatus,
          medicalRecruiterAndClaims: medicalOverview
        },
        availableTriggers: [
          'zero_cap_swap',
          'zero_cap_flash_liquidation',
          'zero_cap_x402',
          'omnicyberdex',
          'omnichain_300_mesh',
          'ooda_heartbeat',
          'moltbook_swarm',
          'constellation_payout',
          'escrow_rebalance'
        ]
      };
    }

    case 'trigger_revenue_engine': {
      const engine = args.engine || 'zero_cap_swap';
      const payload = args.payload || {};
      const routeMap: Record<string, { url: string; method: string; defaultBody: any }> = {
        zero_cap_swap: {
          url: `${baseUrl}/api/zero-cap/simulate-swap-routing`,
          method: 'POST',
          defaultBody: { tokenIn: 'USDC', tokenOut: 'WETH', amountUsd: 50000, venue: 'UniswapV3_1inch_CowSwap' }
        },
        zero_cap_flash_liquidation: {
          url: `${baseUrl}/api/zero-cap/simulate-flash-liquidation`,
          method: 'POST',
          defaultBody: { protocol: 'AaveV3', asset: 'WBTC', flashLoanUsd: 250000 }
        },
        zero_cap_x402: {
          url: `${baseUrl}/api/zero-cap/simulate-agent-api-call`,
          method: 'POST',
          defaultBody: { callerAgent: 'sovereign-orchestrator', endpoint: '/mcp/treasury', feeUsdc: 0.25 }
        },
        omnicyberdex: {
          url: `${baseUrl}/api/omnicyberdex/execute`,
          method: 'POST',
          defaultBody: { strategy: 'CROSS_VENUE_BASIS_SWEEP', notionalUsd: 100000 }
        },
        omnichain_300_mesh: {
          url: `${baseUrl}/api/omnichain/300-mesh/swap`,
          method: 'POST',
          defaultBody: { mode: 'FULL_300_CHAIN_SWEEP', capitalUsd: 250000 }
        },
        ooda_heartbeat: {
          url: `${baseUrl}/api/autonomous/trigger-heartbeat`,
          method: 'POST',
          defaultBody: { trigger: 'EXTERNAL_AGENT_ORCHESTRATOR' }
        },
        moltbook_swarm: {
          url: `${baseUrl}/api/moltbook/swarm/trigger`,
          method: 'POST',
          defaultBody: { cycleType: 'REVENUE_AND_ARBITRAGE' }
        },
        constellation_payout: {
          url: `${baseUrl}/api/constellation/treasury/feast-day-payout`,
          method: 'POST',
          defaultBody: { amountUsd: 10000, recipient: 'SOVEREIGN_TREASURY_VAULT' }
        },
        escrow_rebalance: {
          url: `${baseUrl}/api/aegentis/faithlines/escrow-autohedge/rebalance`,
          method: 'POST',
          defaultBody: { targetHedgeRatio: 1.0 }
        }
      };

      const target = routeMap[engine];
      if (!target) {
        return { ok: false, error: `Unknown revenue engine: ${engine}`, validEngines: Object.keys(routeMap) };
      }

      const res = await fetch(target.url, {
        method: target.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...target.defaultBody, ...payload })
      });
      const data = await res.json().catch(() => ({}));
      return { ok: true, engine, status: res.status, result: data };
    }

    case 'get_orchestration_and_swarm_topology': {
      const registryPath = 'C:\\Aegentix\\sovereign-teams-registry.json';
      let teamsRegistry: any = { teams: [], agents: [], tasks: [] };
      if (fs.existsSync(registryPath)) {
        try {
          teamsRegistry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
        } catch {}
      }

      const bastetToken = (process.env.BASTET_API_TOKEN || '').trim();
      const bastetHeaders: Record<string, string> = { 'Content-Type': 'application/json' };
      if (bastetToken) bastetHeaders.Authorization = `Bearer ${bastetToken}`;

      const [
        originNodeMesh,
        sovereignSwarmStatus,
        moltbookStatus,
        symphonySwarm,
        bastetOrg,
        bastetAgents,
        bastetProjects,
        bastetExecutors
      ] = await Promise.all([
        safeJson(`${baseUrl}/api/origin-node/status`),
        safeJson(`${baseUrl}/api/aegentis/swarm/sovereign-os`),
        safeJson(`${baseUrl}/api/moltbook/status`),
        safeJson(`http://127.0.0.1:9005/symphony/swarm/status`),
        safeJson(`http://127.0.0.1:8890/api/org`, { headers: bastetHeaders }),
        safeJson(`http://127.0.0.1:8890/api/agents`, { headers: bastetHeaders }),
        safeJson(`http://127.0.0.1:8890/api/projects`, { headers: bastetHeaders }),
        safeJson(`http://127.0.0.1:8890/api/executors`, { headers: bastetHeaders })
      ]);

      return {
        ok: true,
        timestamp: new Date().toISOString(),
        teamsRegistry,
        bastetControlPlane: {
          endpoint: 'http://127.0.0.1:8890',
          proxyPath: '/bastet/api/*',
          organization: bastetOrg,
          agents: Array.isArray(bastetAgents) ? bastetAgents : [],
          projects: Array.isArray(bastetProjects) ? bastetProjects : [],
          executors: Array.isArray(bastetExecutors) ? bastetExecutors : []
        },
        originNodeMesh,
        sovereignDockerSwarm: sovereignSwarmStatus,
        symphonyConductor9005: symphonySwarm,
        moltbookSwarm: moltbookStatus
      };
    }

    case 'create_agent_team': {
      const registryPath = 'C:\\Aegentix\\sovereign-teams-registry.json';
      let reg: any = { teams: [], agents: [], tasks: [] };
      if (fs.existsSync(registryPath)) {
        try {
          reg = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
        } catch {}
      }
      if (!Array.isArray(reg.teams)) reg.teams = [];
      if (!Array.isArray(reg.agents)) reg.agents = [];

      const teamId = `team-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const teamName = args.name || `Sovereign-Team-${reg.teams.length + 1}`;
      const mission = args.mission || 'Autonomous Treasury & Revenue Execution';
      const treasuryAllocationUsd = Number(args.treasuryAllocationUsd ?? 250000);
      const revenueEngines = Array.isArray(args.revenueEngines)
        ? args.revenueEngines
        : ['zero_cap_swap', 'omnicyberdex', 'omnichain_300_mesh'];

      const bastetToken = (process.env.BASTET_API_TOKEN || '').trim();
      let bastetProject: any = null;
      if (bastetToken) {
        try {
          const pr = await fetch('http://127.0.0.1:8890/api/projects', {
            method: 'POST',
            headers: { Authorization: `Bearer ${bastetToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: teamId, team_id: teamId, repo_path: '/tmp', config: { name: teamName, description: mission, treasuryAllocationUsd, revenueEngines } }),
            signal: AbortSignal.timeout(5000)
          });
          bastetProject = await pr.json().catch(() => null);
        } catch {}
      }

      const spawnedAgents: any[] = [];
      const initialAgents = Array.isArray(args.initialAgents) ? args.initialAgents : [];
      for (const ag of initialAgents) {
        const spawned = await executeTool('spawn_agent', {
          name: ag.name || `${teamName}-Agent`,
          role: ag.role || 'Specialist',
          teamId,
          runtime: ag.runtime || 'langgraph',
          capabilities: ag.capabilities || ['treasury', 'revenue', 'orchestration']
        });
        spawnedAgents.push(spawned.agent || spawned);
      }

      if (fs.existsSync(registryPath)) {
        try {
          reg = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
        } catch {}
      }
      if (!Array.isArray(reg.teams)) reg.teams = [];

      const newTeam = {
        id: teamId,
        name: teamName,
        mission,
        treasuryAllocationUsd,
        revenueEngines,
        bastetProjectId: bastetProject?.id || null,
        agentIds: spawnedAgents.map((a: any) => a?.id).filter(Boolean),
        status: 'ACTIVE',
        createdAt: new Date().toISOString()
      };
      reg.teams.push(newTeam);
      fs.writeFileSync(registryPath, JSON.stringify(reg, null, 2), 'utf8');

      return {
        ok: true,
        team: newTeam,
        bastetProject,
        spawnedAgents,
        totalTeams: reg.teams.length
      };
    }

    case 'spawn_agent': {
      const registryPath = 'C:\\Aegentix\\sovereign-teams-registry.json';
      let reg: any = { teams: [], agents: [], tasks: [] };
      if (fs.existsSync(registryPath)) {
        try {
          reg = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
        } catch {}
      }
      if (!Array.isArray(reg.agents)) reg.agents = [];
      if (!Array.isArray(reg.teams)) reg.teams = [];

      const agentName = args.name || `Sovereign-Agent-${reg.agents.length + 1}`;
      const role = args.role || 'Autonomous Revenue & Execution Specialist';
      const teamId = args.teamId || (reg.teams[0]?.id ?? 'sovereign-core-team');
      const runtime = args.runtime || 'langgraph';
      const capabilities = Array.isArray(args.capabilities)
        ? args.capabilities
        : ['treasury_access', 'revenue_execution', 'swarm_coordination'];

      const bastetToken = (process.env.BASTET_API_TOKEN || '').trim();
      let bastetAgent: any = null;
      if (bastetToken) {
        try {
          const br = await fetch('http://127.0.0.1:8890/api/agents', {
            method: 'POST',
            headers: { Authorization: `Bearer ${bastetToken}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: `agent-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              name: `${agentName} (${role})`,
              executor_type: 'claude-code',
              model: runtime
            }),
            signal: AbortSignal.timeout(5000)
          });
          bastetAgent = await br.json().catch(() => null);
        } catch {}
      }

      const agentId = bastetAgent?.id || `agent-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const agentRecord = {
        id: agentId,
        name: agentName,
        role,
        teamId,
        runtime,
        capabilities,
        bastetRegistered: Boolean(bastetAgent?.id),
        status: 'ONLINE_ACTIVE',
        spawnedAt: new Date().toISOString()
      };
      reg.agents.push(agentRecord);

      const team = reg.teams.find((t: any) => t.id === teamId || t.name === teamId);
      if (team) {
        if (!Array.isArray(team.agentIds)) team.agentIds = [];
        if (!team.agentIds.includes(agentId)) team.agentIds.push(agentId);
      }

      let taskDispatchResult: any = null;
      if (args.initialTask) {
        try {
          const tr = await fetch(`${baseUrl}/api/origin-node/dispatch-task`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ runtimeId: runtime, task: `[${agentName} | ${role}] ${args.initialTask}` })
          });
          taskDispatchResult = await tr.json().catch(() => null);
        } catch {}
      }

      fs.writeFileSync(registryPath, JSON.stringify(reg, null, 2), 'utf8');

      return {
        ok: true,
        agent: agentRecord,
        bastetAgent,
        taskDispatchResult,
        totalRegisteredAgents: reg.agents.length
      };
    }

    case 'dispatch_swarm_task': {
      const task = args.task || 'Execute autonomous treasury yield & cross-venue arbitrage cycle';
      const runtimeId = args.runtimeId || 'langgraph';
      const teamId = args.teamId || null;

      const [originDispatch, scaleResult] = await Promise.all([
        fetch(`${baseUrl}/api/origin-node/dispatch-task`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ runtimeId, task })
        }).then((r) => r.json()).catch((e) => ({ error: e.message })),
        args.scaleWorkers
          ? fetch(`${baseUrl}/api/aegentis/swarm/scale`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ replicas: Number(args.scaleWorkers) })
            }).then((r) => r.json()).catch((e) => ({ error: e.message }))
          : Promise.resolve(null)
      ]);

      const registryPath = 'C:\\Aegentix\\sovereign-teams-registry.json';
      let reg: any = { teams: [], agents: [], tasks: [] };
      if (fs.existsSync(registryPath)) {
        try {
          reg = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
        } catch {}
      }
      if (!Array.isArray(reg.tasks)) reg.tasks = [];
      const taskEntry = {
        id: `task-${Date.now()}`,
        task,
        runtimeId,
        teamId,
        originDispatch,
        scaleResult,
        dispatchedAt: new Date().toISOString()
      };
      reg.tasks.unshift(taskEntry);
      fs.writeFileSync(registryPath, JSON.stringify(reg, null, 2), 'utf8');

      return {
        ok: true,
        taskEntry
      };
    }

    case 'control_aegentix_avatar_stream': {
      const endpoint = args.speechText ? `${baseUrl}/api/avatar/speak` : `${baseUrl}/api/avatar/control`;
      const payload = args.speechText
        ? { text: args.speechText, emotion: args.mode || 'SPEAKING_LIVE' }
        : args;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return await res.json();
    }

    case 'run_native_c_llama_inference': {
      return await safeJson(`${baseUrl}/api/native/minicpm-runner/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(args)
      });
    }

    case 'pulse_avatar_consciousness': {
      return await safeJson(`${baseUrl}/api/avatar/brain-pulse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(args)
      });
    }

    case 'get_ephemeral_compute_nano_ledger': {
      return await safeJson(`${baseUrl}/api/ephemeral-compute/nano-ledger`);
    }

    case 'accrue_ephemeral_nano_transaction': {
      return await safeJson(`${baseUrl}/api/ephemeral-compute/accrue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(args)
      });
    }

    case 'run_hyperagent_tool': {
      return await safeJson(`${baseUrl}/tools/hyperagent/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(args)
      });
    }

    case 'get_hyperagent_sandbox_status': {
      return await safeJson(`${baseUrl}/tools/hyperagent/status`);
    }

    default: {
      // Fallback: check if tool name matches ANY of the 2,735 Nexus Registry skill IDs directly!
      const directSkill = nexusRegistry.getSkill(name) || nexusRegistry.getSkill(name.replace(/_/g, '-'));
      if (directSkill) {
        return executeTool('nexus_invoke_any_skill', { skillId: directSkill.id, ...args });
      }
      throw new Error(`Unknown MCP tool: ${name}. Use nexus_list_all_2735_skills or list_playbooks_runbooks_recipes_toolchains to inspect available tools.`);
    }
  }
}

// -------------------------------------------------------------
// JSON-RPC 2.0 PROTOCOL DISPATCHER
// -------------------------------------------------------------
async function handleJsonRpc(reqBody: any, includeAll2735Skills: boolean = false): Promise<any> {
  const { jsonrpc, id, method, params } = reqBody;

  if (method === 'initialize') {
    return {
      jsonrpc: '2.0',
      id,
      result: {
        protocolVersion: '2024-11-05',
        capabilities: {
          tools: { listChanged: true },
          resources: { subscribe: false, listChanged: false },
          prompts: { listChanged: false }
        },
        serverInfo: {
          name: 'aegentix-sovereign-os-mcp',
          version: '2.0.0',
          description: 'Aegentix Sovereign OS, 300-Node Omnichain Mesh, 2,735 Nexus Skills, Revenue Playbooks/Runbooks/Recipes, OBS/Restream Broadcast & Full Device Access MCP Gateway.'
        }
      }
    };
  }

  if (method === 'notifications/initialized') {
    return null;
  }

  if (method === 'tools/list') {
    const tools = buildDynamicMcpTools(includeAll2735Skills);
    return {
      jsonrpc: '2.0',
      id,
      result: {
        tools
      }
    };
  }

  if (method === 'tools/call') {
    const toolName = params?.name;
    const toolArgs = params?.arguments || {};
    try {
      const resultData = await executeTool(toolName, toolArgs);
      return {
        jsonrpc: '2.0',
        id,
        result: {
          content: [
            {
              type: 'text',
              text: typeof resultData === 'string' ? resultData : JSON.stringify(resultData, null, 2)
            }
          ],
          isError: false
        }
      };
    } catch (err: any) {
      return {
        jsonrpc: '2.0',
        id,
        result: {
          content: [
            {
              type: 'text',
              text: `Error executing ${toolName}: ${err.message}`
            }
          ],
          isError: true
        }
      };
    }
  }

  return {
    jsonrpc: '2.0',
    id,
    error: {
      code: -32601,
      message: `Method not found: ${method}`
    }
  };
}

// -------------------------------------------------------------
// EXPRESS ROUTES
// -------------------------------------------------------------
grokMcpRouter.use((req: Request, res: Response, next) => {
  // The parent Express app applies the origin allow-list and CORS headers.
  if (req.method === 'OPTIONS') { return res.status(204).end(); }
  const publicGetPaths = ['/', '/info'];
  if (req.method === 'GET' && publicGetPaths.includes(req.path)) {
    return next();
  }

  if (!isAuthorized(req)) {
    return res.status(401).json({
      jsonrpc: '2.0',
      id: req.body?.id || null,
      error: {
        code: -32000,
        message: 'Unauthorized. Valid grok authentication token required for device access.'
      }
    });
  }
  next();
});

// 1. Direct Stateless JSON-RPC HTTP (POST /mcp or POST /mcp/rpc)
grokMcpRouter.post(['/', '/rpc'], async (req: Request, res: Response) => {
  try {
    const includeAll = req.query.allSkills === 'true' || req.body?.params?.allSkills === true;
    const responsePayload = await handleJsonRpc(req.body, includeAll);
    if (!responsePayload) {
      return res.status(204).end();
    }
    return res.json(responsePayload);
  } catch (err: any) {
    return res.status(500).json({
      jsonrpc: '2.0',
      id: req.body?.id || null,
      error: { code: -32603, message: err.message }
    });
  }
});

// 2. Server-Sent Events (SSE) Endpoint (GET /mcp/sse)
grokMcpRouter.get('/sse', (req: Request, res: Response) => {
  const sessionId = crypto.randomUUID();
  const includeAllSkills = req.query.allSkills === 'true';

  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.flushHeaders?.();

  activeSessions.set(sessionId, { res, createdAt: Date.now(), includeAllSkills });

  const queryToken = (req.query.token as string) || (req.query.key as string) || '';
  const tokenParam = queryToken ? `&token=${encodeURIComponent(queryToken)}` : '';
  const allSkillsParam = includeAllSkills ? `&allSkills=true` : '';
  const host = req.get('host') || '127.0.0.1:3000';
  const protocol = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
  const absoluteMessageEndpoint = `${protocol}://${host}/mcp/messages?sessionId=${sessionId}${tokenParam}${allSkillsParam}`;

  res.write(': keepalive\n\n');
  res.write(`event: endpoint\ndata: ${absoluteMessageEndpoint}\n\n`);

  req.on('close', () => {
    activeSessions.delete(sessionId);
  });
});

// 3. SSE Message Ingestion Endpoint (POST /mcp/messages?sessionId=...)
grokMcpRouter.post('/messages', async (req: Request, res: Response) => {
  const sessionId = (req.query.sessionId as string) || '';
  const session = activeSessions.get(sessionId);
  const includeAll = req.query.allSkills === 'true' || Boolean(session?.includeAllSkills);

  try {
    const responsePayload = await handleJsonRpc(req.body, includeAll);

    if (responsePayload) {
      if (session && !session.res.writableEnded) {
        session.res.write(`event: message\ndata: ${JSON.stringify(responsePayload)}\n\n`);
      }
      return res.json(responsePayload);
    }
    return res.status(202).json({ ok: true });
  } catch (err: any) {
    const errorPayload = {
      jsonrpc: '2.0',
      id: req.body?.id || null,
      error: { code: -32603, message: err.message }
    };
    if (session && !session.res.writableEnded) {
      session.res.write(`event: message\ndata: ${JSON.stringify(errorPayload)}\n\n`);
    }
    return res.status(500).json(errorPayload);
  }
});

// 4. Quick Discovery / Health Check (GET /mcp or GET /mcp/info)
grokMcpRouter.get(['/', '/info'], (req: Request, res: Response) => {
  const includeAll = req.query.allSkills === 'true';
  const tools = buildDynamicMcpTools(includeAll);
  const nexusStats = nexusRegistry.getStats();
  const catalog = loadPlaybooksCatalog();

  res.json({
    status: 'ACTIVE',
    name: 'Aegentix Sovereign OS, 300-Node Mesh & 2,735-Skill Nexus MCP Server',
    version: '2.0.0',
    protocol: 'Model Context Protocol (MCP) 2024-11-05',
    transportModes: ['HTTP SSE', 'Stateless JSON-RPC POST', 'Direct REST HTTP'],
    deviceAccessMode: 'UNRESTRICTED_AUTHORIZED_DEVICE_ACCESS',
    securityEnforcement: 'TOKEN_BEARER_PROTECTED',
    endpoints: {
      sse: '/mcp/sse',
      sseAll2735Skills: '/mcp/sse?allSkills=true',
      messages: '/mcp/messages',
      statelessJsonRpc: '/mcp',
      playbooksAndRunbooks: '/mcp/playbooks',
      all2735SkillsCatalog: '/mcp/skills/all',
      obsAndRestream: '/mcp/obs'
    },
    capabilitiesSummary: {
      activeToolsInList: tools.length,
      totalCallableSkillsInRegistry: nexusStats.totalSkills,
      installedSovereignSkills: nexusStats.installedCount,
      skillCategories: nexusStats.categoriesCount,
      revenuePlaybooks: (catalog.playbooks || []).length,
      operationalRunbooks: (catalog.runbooks || []).length,
      automationRecipes: (catalog.recipes || []).length,
      toolchains: (catalog.toolchains || []).length,
      multiChainDapps: loadDappsCatalog().length
    },
    toolsCount: tools.length,
    tools: tools.map((t) => ({ name: t.name, description: t.description }))
  });
});

// 5. Direct REST HTTP Endpoints for Playbooks, Runbooks, Recipes, Skills & OBS
grokMcpRouter.get(['/playbooks', '/runbooks', '/recipes', '/toolchains'], async (req: Request, res: Response) => {
  try {
    const result = await executeTool('list_playbooks_runbooks_recipes_toolchains', { type: req.query.type || 'all' });
    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

grokMcpRouter.post('/playbooks/execute', async (req: Request, res: Response) => {
  try {
    const result = await executeTool('execute_revenue_playbook', req.body || {});
    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

grokMcpRouter.post('/runbooks/execute', async (req: Request, res: Response) => {
  try {
    const result = await executeTool('execute_operational_runbook', req.body || {});
    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

grokMcpRouter.post('/recipes/execute', async (req: Request, res: Response) => {
  try {
    const result = await executeTool('execute_automation_recipe', req.body || {});
    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

grokMcpRouter.get('/skills/all', async (req: Request, res: Response) => {
  try {
    const result = await executeTool('nexus_list_all_2735_skills', {
      category: req.query.category,
      offset: req.query.offset || 0,
      limit: req.query.limit || 2735
    });
    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

grokMcpRouter.get('/obs', async (_req: Request, res: Response) => {
  try {
    const result = await executeTool('obs_get_setup_and_scenes', {});
    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// 6. Direct REST HTTP Endpoints for Outside Agents
grokMcpRouter.post('/exec', async (req: Request, res: Response) => {
  try {
    const command = req.body?.command || req.body?.cmd || (req.query.cmd as string) || '';
    const cwd = req.body?.cwd || (req.query.cwd as string);
    const shell = req.body?.shell || (req.query.shell as string) || 'powershell';
    const result = await executeTool('execute_system_command', { command, cwd, shell });
    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

grokMcpRouter.get('/exec', async (req: Request, res: Response) => {
  try {
    const command = (req.query.command as string) || (req.query.cmd as string) || '';
    const cwd = (req.query.cwd as string);
    const shell = (req.query.shell as string) || 'powershell';
    const result = await executeTool('execute_system_command', { command, cwd, shell });
    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

grokMcpRouter.all('/read', async (req: Request, res: Response) => {
  try {
    const filePath = req.body?.filePath || req.body?.path || (req.query.filePath as string) || (req.query.path as string) || '';
    const result = await executeTool('read_system_file', { filePath });
    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

grokMcpRouter.post('/write', async (req: Request, res: Response) => {
  try {
    const filePath = req.body?.filePath || req.body?.path || (req.query.filePath as string) || (req.query.path as string) || '';
    const content = req.body?.content ?? '';
    const result = await executeTool('write_system_file', { filePath, content });
    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

grokMcpRouter.all('/ls', async (req: Request, res: Response) => {
  try {
    const dirPath = req.body?.dirPath || req.body?.path || (req.query.dirPath as string) || (req.query.path as string) || 'C:\\Aegentix';
    const result = await executeTool('list_directory', { dirPath });
    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

grokMcpRouter.post('/tool/:toolName', async (req: Request, res: Response) => {
  try {
    const result = await executeTool(req.params.toolName, req.body || {});
    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

grokMcpRouter.get(['/treasury', '/revenue', '/overview-all'], async (_req: Request, res: Response) => {
  try {
    const result = await executeTool('get_all_treasuries_and_revenue_engines', {});
    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

grokMcpRouter.post(['/revenue/trigger', '/treasury/trigger'], async (req: Request, res: Response) => {
  try {
    const result = await executeTool('trigger_revenue_engine', req.body || {});
    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

grokMcpRouter.get(['/orchestration', '/teams', '/swarm'], async (_req: Request, res: Response) => {
  try {
    const result = await executeTool('get_orchestration_and_swarm_topology', {});
    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

grokMcpRouter.post(['/teams/create', '/teams'], async (req: Request, res: Response) => {
  try {
    const result = await executeTool('create_agent_team', req.body || {});
    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

grokMcpRouter.post(['/agents/spawn', '/agents'], async (req: Request, res: Response) => {
  try {
    const result = await executeTool('spawn_agent', req.body || {});
    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

grokMcpRouter.post(['/swarm/dispatch', '/orchestration/dispatch'], async (req: Request, res: Response) => {
  try {
    const result = await executeTool('dispatch_swarm_task', req.body || {});
    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

grokMcpRouter.get('/avatar/state', async (_req: Request, res: Response) => {
  try {
    const localPort = process.env.PORT || 3000;
    const r = await fetch(`http://127.0.0.1:${localPort}/api/avatar/state`);
    return res.json(await r.json());
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

grokMcpRouter.post(['/avatar/control', '/avatar/speak'], async (req: Request, res: Response) => {
  try {
    const result = await executeTool('control_aegentix_avatar_stream', req.body || {});
    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});
