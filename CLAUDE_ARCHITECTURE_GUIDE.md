# Aegentix Super-Agent-Wallet & Sovereign OS (Megacore)
## Complete Architectural Map for Claude / External AI Workspaces

Welcome to the **Aegentix Super-Agent-Wallet** codebase. This repository is an autonomous dual-exchange (CEX/DEX) trading engine, sovereign multi-agent mesh control plane, and diegetic spatial desktop suite running on port 3000.

---

### Key Entry Points
1. **Frontend Root**: `src/App.tsx`
   - Orchestrates all 48+ subsystems across 6 architectural pillars.
   - Manages triage viewports, active tab routing, and responsive scaling for handhelds/desktops.
2. **Backend Gateway**: `server.ts`
   - Express 5.0 backend with 385+ endpoints across FinOps, GovOps, SpatialOps, VoiceOps, and SwarmOps.
   - Integrated WebSocket Hub on `/ws/a2a` for bilateral Agent-to-Agent IPC.
3. **5 Native Deployment Zones**:
   - **OpenClaw**: Autonomous Execution Gateway & Sandbox (SparkX 2.6-1.7B on :8000).
   - **Nemotron**: High-Order Reasoning Mesh (Google DeepMind Gemini 3.8 Flash).
   - **Hermes**: Sub-10ms Micro-Execution Loop.
   - **Docker**: Hardened Container Enclaves.
   - **Manus**: Spatial Orchestrator & MJOLNIR Visor WebXR Bridge.

---

### Core Architectural Pillars & Subsystems in `src/components/`
- **Core & Spatial**:
  - `AegentisOSSuite.tsx`: 5-layer Sovereign OS, AXL engine, and gap inventory.
  - `HaloCeVisorFPV.tsx`: MJOLNIR Mark V Visor FPV desktop overlay, tactical radio, and acoustic vocoder.
  - `LiveTelemetryNavSuite.tsx`: Real-time Net Asset Value (NAV) and multi-asset price time series.
  - `RogCreatorSystemView.tsx`: Handheld (ROG Ally X) creator compatibility, 24GB LPDDR5X telemetry.
- **Autonomous AI & Frontier Superintelligence**:
  - `DesktopDeepmindSuite.tsx`: 7-Pod deliberation space, Argon & Carbon Cyber specs, $3.5M Google Grant proposal.
  - `JarvisAppBuilderStudio.tsx`: AI-assisted application builder and Apollo Voice OS (:8765) integration.
  - `OodaAutonomousSuite.tsx`: Continuous millisecond OODA (Observe-Orient-Decide-Act) cycle.
  - `HerdrClusterView.tsx`: P2P agent herd clustering, Raft consensus, and peer discovery.
  - `NexusSkillRegistrySuite.tsx`: 2,735 loaded agent skills and NRCP registry matrix.
- **Trading & DEX**:
  - `TradingCommandView.tsx` / `InstitutionalTradingSuite.tsx`: 29 CEX & DEX venues, cross-exchange arbitrage.
  - `AutoHedgeSuite.tsx`: Delta-neutral automated hedging desk.
  - `XamanRevenueBridgeView.tsx`: Non-custodial XRP Ledger (XRPL) revenue conduit.
  - `PinnacleDerivativesSuite.tsx`: Commercial treasury and zero-direction basis capture.
  - `LedgerView.tsx` / `TransactionLedger.tsx`: Double-entry cryptographic audit history.
- **Federal & Defense Governance**:
  - `FederalComplianceGovSuite.tsx`: SAM.gov, FedRAMP High, and CAGE code compliance.
  - `AntiTraffickingSentinelSuite.tsx`: FinCEN advisory (FIN-2020-A008) and human rights monitoring.
  - `DagFederalNodeStatus.tsx`: Directed Acyclic Graph federal full-node ledger.
- **Security & Post-Quantum Cryptography**:
  - `AegisCipherProtocolView.tsx`: ML-KEM / Kyber-1024 post-quantum key exchange.
  - `RiskManagementDashboard.tsx`: Monte Carlo VaR (95%/99%), CVaR, and automated circuit breakers.

---

### Autonomous Voice Avatars (`scripts/chatterbox_avatar_service.py`)
- **Optimus Prime (PRIME-01)**: Chatterbox-Turbo + SparkX 2.6-1.7B local edge engine.
- **Charlie Kirk (APOLLO-01)**: Apollo Voice OS (:8765) + Gemini 3.8 Flash.
- **Donald J. Trump (POTUS-47)**: Chatterbox Neural Voice + Gemini 3 Flash.

---

### Build & Run Commands
- `npm run dev`: Boots server via `tsx server.ts` on port 3000.
- `npm run build`: Compiles production assets with Vite & esbuild into `dist/`.
- `python scripts/chatterbox_avatar_service.py`: Starts Chatterbox neural voice daemon on port 8105.
