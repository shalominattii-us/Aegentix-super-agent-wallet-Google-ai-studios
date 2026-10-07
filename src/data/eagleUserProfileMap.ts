export interface EagleProfileItem {
  name: string;
  fullPath: string;
  category: 
    | 'RYZEN_DNA' 
    | 'JARVIS_VOICE' 
    | 'AI_INFERENCE' 
    | 'AEGENTIX_SWARM' 
    | 'PRODUCTION_SCRIPTS' 
    | 'DOT_ENV_CONFIG' 
    | 'SYSTEM_STORAGE';
  type: 'DIRECTORY' | 'FILE' | 'SCRIPT' | 'AUDIO' | 'CONFIG' | 'LOG' | 'MODEL';
  status: 'ACTIVE' | 'CALIBRATED' | 'SYNTHESIZED' | 'INDEXED' | 'STANDBY';
  description: string;
  quickCommand?: string;
  sizeOrDetails?: string;
}

export const EAGLE_USER_BASE = 'C:\\Users\\eagle';

export const EAGLE_USER_PROFILE_CATALOG: EagleProfileItem[] = [
  // --- 1. SYSTEM CALIBRATION & MASTER PROFILE ---
  {
    name: 'USER_PROFILE_MAP.md',
    fullPath: `${EAGLE_USER_BASE}\\USER_PROFILE_MAP.md`,
    category: 'PRODUCTION_SCRIPTS',
    type: 'FILE',
    status: 'ACTIVE',
    description: 'Master workstation profile map inventorying all 140+ components, AI agents, audio pipelines, and hardware DNA stages.',
    sizeOrDetails: 'Master Inventory'
  },
  {
    name: 'tuned.cact',
    fullPath: `${EAGLE_USER_BASE}\\tuned.cact`,
    category: 'RYZEN_DNA',
    type: 'CONFIG',
    status: 'CALIBRATED',
    description: 'AMD Ryzen / NeedleHub hardware auto-tuning profile and cache calibration matrix.',
    sizeOrDetails: 'NeedleHub Tuner'
  },

  // --- 2. AMD RYZEN DNA HARDWARE CONTINUUM (18 STAGES) ---
  {
    name: 'AMD_RYZEN_DNA',
    fullPath: `${EAGLE_USER_BASE}\\AMD_RYZEN_DNA`,
    category: 'RYZEN_DNA',
    type: 'DIRECTORY',
    status: 'CALIBRATED',
    description: 'AMD Ryzen multi-core architecture driver optimization engine and NPU neural pipeline.',
    sizeOrDetails: 'Hardware Engine'
  },
  {
    name: 'AMD_RYZEN_DNA_FULL',
    fullPath: `${EAGLE_USER_BASE}\\AMD_RYZEN_DNA_FULL`,
    category: 'RYZEN_DNA',
    type: 'DIRECTORY',
    status: 'CALIBRATED',
    description: 'Full-tier unified Ryzen DNA image compiling all microarchitecture acceleration profiles.',
    sizeOrDetails: 'Stage 1-18 Combined'
  },
  {
    name: 'AMD_RYZEN_DNA_STAGE1',
    fullPath: `${EAGLE_USER_BASE}\\AMD_RYZEN_DNA_STAGE1`,
    category: 'RYZEN_DNA',
    type: 'DIRECTORY',
    status: 'CALIBRATED',
    description: 'Stage 1: Core affinity locking and L1/L2 instruction cache prefetch tuning.',
    sizeOrDetails: 'Stage 1'
  },
  {
    name: 'AMD_RYZEN_DNA_STAGE2',
    fullPath: `${EAGLE_USER_BASE}\\AMD_RYZEN_DNA_STAGE2`,
    category: 'RYZEN_DNA',
    type: 'DIRECTORY',
    status: 'CALIBRATED',
    description: 'Stage 2: L3 cache boundary partitioning for high-frequency algorithmic arbitrage loops.',
    sizeOrDetails: 'Stage 2'
  },
  {
    name: 'AMD_RYZEN_DNA_STAGE3',
    fullPath: `${EAGLE_USER_BASE}\\AMD_RYZEN_DNA_STAGE3`,
    category: 'RYZEN_DNA',
    type: 'DIRECTORY',
    status: 'CALIBRATED',
    description: 'Stage 3: AVX-512 SIMD vectorization paths for matrix operations and cryptanalysis.',
    sizeOrDetails: 'Stage 3'
  },
  {
    name: 'AMD_RYZEN_DNA_STAGE4',
    fullPath: `${EAGLE_USER_BASE}\\AMD_RYZEN_DNA_STAGE4`,
    category: 'RYZEN_DNA',
    type: 'DIRECTORY',
    status: 'CALIBRATED',
    description: 'Stage 4: Memory bus clock interleaving and low-latency DDR5 sub-timing profile.',
    sizeOrDetails: 'Stage 4'
  },
  {
    name: 'AMD_RYZEN_DNA_STAGE5',
    fullPath: `${EAGLE_USER_BASE}\\AMD_RYZEN_DNA_STAGE5`,
    category: 'RYZEN_DNA',
    type: 'DIRECTORY',
    status: 'CALIBRATED',
    description: 'Stage 5: PCIe Gen5 direct peer-to-peer DMA buffer binding for NVMe mempool recording.',
    sizeOrDetails: 'Stage 5'
  },
  {
    name: 'AMD_RYZEN_DNA_STAGE5_FULL',
    fullPath: `${EAGLE_USER_BASE}\\AMD_RYZEN_DNA_STAGE5_FULL`,
    category: 'RYZEN_DNA',
    type: 'DIRECTORY',
    status: 'CALIBRATED',
    description: 'Stage 5 Full image incorporating extended thermal governor profiles.',
    sizeOrDetails: 'Stage 5 Full'
  },
  {
    name: 'AMD_RYZEN_DNA_STAGE6',
    fullPath: `${EAGLE_USER_BASE}\\AMD_RYZEN_DNA_STAGE6`,
    category: 'RYZEN_DNA',
    type: 'DIRECTORY',
    status: 'CALIBRATED',
    description: 'Stage 6: ROG Ally X modular controller bridge and handheld edge offloading hooks.',
    sizeOrDetails: 'Stage 6'
  },
  {
    name: 'AMD_RYZEN_DNA_STAGE7',
    fullPath: `${EAGLE_USER_BASE}\\AMD_RYZEN_DNA_STAGE7`,
    category: 'RYZEN_DNA',
    type: 'DIRECTORY',
    status: 'CALIBRATED',
    description: 'Stage 7: Threadripper / Zen architecture multi-CCX IPC synchronization.',
    sizeOrDetails: 'Stage 7'
  },
  {
    name: 'AMD_RYZEN_DNA_STAGE8',
    fullPath: `${EAGLE_USER_BASE}\\AMD_RYZEN_DNA_STAGE8`,
    category: 'RYZEN_DNA',
    type: 'DIRECTORY',
    status: 'CALIBRATED',
    description: 'Stage 8: Neural network inference vector registers allocation on Ryzen AI NPU.',
    sizeOrDetails: 'Stage 8'
  },
  {
    name: 'AMD_RYZEN_DNA_STAGE9',
    fullPath: `${EAGLE_USER_BASE}\\AMD_RYZEN_DNA_STAGE9`,
    category: 'RYZEN_DNA',
    type: 'DIRECTORY',
    status: 'CALIBRATED',
    description: 'Stage 9: Non-volatile memory caching for real-time orderbook snapshotting.',
    sizeOrDetails: 'Stage 9'
  },
  {
    name: 'AMD_RYZEN_DNA_STAGE10',
    fullPath: `${EAGLE_USER_BASE}\\AMD_RYZEN_DNA_STAGE10`,
    category: 'RYZEN_DNA',
    type: 'DIRECTORY',
    status: 'CALIBRATED',
    description: 'Stage 10: Zero-copy kernel bypass networking for sub-microsecond WebSocket frame handling.',
    sizeOrDetails: 'Stage 10'
  },
  {
    name: 'AMD_RYZEN_DNA_STAGE11',
    fullPath: `${EAGLE_USER_BASE}\\AMD_RYZEN_DNA_STAGE11`,
    category: 'RYZEN_DNA',
    type: 'DIRECTORY',
    status: 'CALIBRATED',
    description: 'Stage 11: Real-time hardware performance counter (PMC) monitoring loop.',
    sizeOrDetails: 'Stage 11'
  },
  {
    name: 'AMD_RYZEN_DNA_STAGE12',
    fullPath: `${EAGLE_USER_BASE}\\AMD_RYZEN_DNA_STAGE12`,
    category: 'RYZEN_DNA',
    type: 'DIRECTORY',
    status: 'CALIBRATED',
    description: 'Stage 12: Precision Boost Overdrive (PBO2) automated undervolting curve.',
    sizeOrDetails: 'Stage 12'
  },
  {
    name: 'AMD_RYZEN_DNA_STAGE13',
    fullPath: `${EAGLE_USER_BASE}\\AMD_RYZEN_DNA_STAGE13`,
    category: 'RYZEN_DNA',
    type: 'DIRECTORY',
    status: 'CALIBRATED',
    description: 'Stage 13: Quantum simulation acceleration pipeline using AMD ROCm / MIOpen.',
    sizeOrDetails: 'Stage 13'
  },
  {
    name: 'AMD_RYZEN_DNA_STAGE14',
    fullPath: `${EAGLE_USER_BASE}\\AMD_RYZEN_DNA_STAGE14`,
    category: 'RYZEN_DNA',
    type: 'DIRECTORY',
    status: 'CALIBRATED',
    description: 'Stage 14: FPGA / C11 edge co-processor offload profile.',
    sizeOrDetails: 'Stage 14'
  },
  {
    name: 'AMD_RYZEN_DNA_STAGE15',
    fullPath: `${EAGLE_USER_BASE}\\AMD_RYZEN_DNA_STAGE15`,
    category: 'RYZEN_DNA',
    type: 'DIRECTORY',
    status: 'CALIBRATED',
    description: 'Stage 15: Cryogenic-stable thermal governor profile for sustained full-load bursts.',
    sizeOrDetails: 'Stage 15'
  },
  {
    name: 'AMD_RYZEN_DNA_STAGE16',
    fullPath: `${EAGLE_USER_BASE}\\AMD_RYZEN_DNA_STAGE16`,
    category: 'RYZEN_DNA',
    type: 'DIRECTORY',
    status: 'CALIBRATED',
    description: 'Stage 16: Zero-day exploit hardware memory tag checking (MTE).',
    sizeOrDetails: 'Stage 16'
  },
  {
    name: 'AMD_RYZEN_DNA_STAGE17',
    fullPath: `${EAGLE_USER_BASE}\\AMD_RYZEN_DNA_STAGE17`,
    category: 'RYZEN_DNA',
    type: 'DIRECTORY',
    status: 'CALIBRATED',
    description: 'Stage 17: Autonomous overclock throttle mitigation during peak market volatility.',
    sizeOrDetails: 'Stage 17'
  },
  {
    name: 'AMD_RYZEN_DNA_STAGE18',
    fullPath: `${EAGLE_USER_BASE}\\AMD_RYZEN_DNA_STAGE18`,
    category: 'RYZEN_DNA',
    type: 'DIRECTORY',
    status: 'CALIBRATED',
    description: 'Stage 18: Sovereign Swarm hardware master state integration.',
    sizeOrDetails: 'Stage 18'
  },

  // --- 3. JARVIS & MULTI-MODAL VOICE SYNTHESIS ENGINES ---
  {
    name: 'J.A.R.V.I.S.2.0',
    fullPath: `${EAGLE_USER_BASE}\\J.A.R.V.I.S.2.0`,
    category: 'JARVIS_VOICE',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'Next-generation Jarvis executive autonomous assistant brain and context orchestrator.',
    sizeOrDetails: 'AI Assistant Core'
  },
  {
    name: 'Jarvis_Stark_Core',
    fullPath: `${EAGLE_USER_BASE}\\Jarvis_Stark_Core`,
    category: 'JARVIS_VOICE',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'Stark Core module providing tactical audio feedback, telemetry synthesis, and command parsing.',
    sizeOrDetails: 'Tactical Core'
  },
  {
    name: 'PersonalJarvis',
    fullPath: `${EAGLE_USER_BASE}\\PersonalJarvis`,
    category: 'JARVIS_VOICE',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'Custom fine-tuned personal assistant environment with private workflow automations.',
    sizeOrDetails: 'Personal Agent'
  },
  {
    name: 'PersonalJarvis.bak',
    fullPath: `${EAGLE_USER_BASE}\\PersonalJarvis.bak`,
    category: 'JARVIS_VOICE',
    type: 'DIRECTORY',
    status: 'INDEXED',
    description: 'Immutable backup snapshot of the PersonalJarvis state and weights.',
    sizeOrDetails: 'Backup Image'
  },
  {
    name: 'Captain-Kirk-AI-Voice',
    fullPath: `${EAGLE_USER_BASE}\\Captain-Kirk-AI-Voice`,
    category: 'JARVIS_VOICE',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'Neural voice dataset and fine-tuned checkpoints for Captain Kirk acoustic command synthesis.',
    sizeOrDetails: 'Voice Model'
  },
  {
    name: 'jarvis_kirk_audio',
    fullPath: `${EAGLE_USER_BASE}\\jarvis_kirk_audio`,
    category: 'JARVIS_VOICE',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'Rendered audio repository containing high-fidelity Captain Kirk vocal responses and prompt clips.',
    sizeOrDetails: 'Audio Bank'
  },
  {
    name: 'jarvis_kirk_temp',
    fullPath: `${EAGLE_USER_BASE}\\jarvis_kirk_temp`,
    category: 'JARVIS_VOICE',
    type: 'DIRECTORY',
    status: 'STANDBY',
    description: 'Temporary buffer directory for live zero-latency audio synthesis and chunk streaming.',
    sizeOrDetails: 'Stream Cache'
  },
  {
    name: 'jarvis_kirk_voice.py',
    fullPath: `${EAGLE_USER_BASE}\\jarvis_kirk_voice.py`,
    category: 'JARVIS_VOICE',
    type: 'SCRIPT',
    status: 'ACTIVE',
    description: 'Real-time Captain Kirk neural voice synthesis generator with zero-latency streaming playback.',
    quickCommand: `python "${EAGLE_USER_BASE}\\jarvis_kirk_voice.py"`
  },
  {
    name: 'jarvis_pipe.py',
    fullPath: `${EAGLE_USER_BASE}\\jarvis_pipe.py`,
    category: 'JARVIS_VOICE',
    type: 'SCRIPT',
    status: 'ACTIVE',
    description: 'Inter-process audio pipeline streaming text tokens to neural vocoder audio output.',
    quickCommand: `python "${EAGLE_USER_BASE}\\jarvis_pipe.py"`
  },
  {
    name: 'jarvis_real.py',
    fullPath: `${EAGLE_USER_BASE}\\jarvis_real.py`,
    category: 'JARVIS_VOICE',
    type: 'SCRIPT',
    status: 'ACTIVE',
    description: 'Production real-time Jarvis agent loop integrating speech recognition, reasoning, and speech synthesis.',
    quickCommand: `python "${EAGLE_USER_BASE}\\jarvis_real.py"`
  },
  {
    name: 'jarvis_server.py',
    fullPath: `${EAGLE_USER_BASE}\\jarvis_server.py`,
    category: 'JARVIS_VOICE',
    type: 'SCRIPT',
    status: 'ACTIVE',
    description: 'FastAPI / WebSocket server serving Jarvis voice endpoints to web clients and spatial cockpits.',
    quickCommand: `python "${EAGLE_USER_BASE}\\jarvis_server.py"`
  },
  {
    name: 'jarvis_voice_loop.py',
    fullPath: `${EAGLE_USER_BASE}\\jarvis_voice_loop.py`,
    category: 'JARVIS_VOICE',
    type: 'SCRIPT',
    status: 'ACTIVE',
    description: 'Continuous microphone listener loop with wake-word detection and voice biometric verification.',
    quickCommand: `python "${EAGLE_USER_BASE}\\jarvis_voice_loop.py"`
  },
  {
    name: 'JarvisInfiniteBrain.ps1',
    fullPath: `${EAGLE_USER_BASE}\\JarvisInfiniteBrain.ps1`,
    category: 'JARVIS_VOICE',
    type: 'SCRIPT',
    status: 'ACTIVE',
    description: 'PowerShell bootstrap launching the infinite memory harness and cognitive agent pipeline.',
    quickCommand: `powershell -ExecutionPolicy Bypass -File "${EAGLE_USER_BASE}\\JarvisInfiniteBrain.ps1"`
  },
  {
    name: 'trump_voice.py',
    fullPath: `${EAGLE_USER_BASE}\\trump_voice.py`,
    category: 'JARVIS_VOICE',
    type: 'SCRIPT',
    status: 'ACTIVE',
    description: 'Voice synthesis inference script running targeted acoustic models.',
    quickCommand: `python "${EAGLE_USER_BASE}\\trump_voice.py"`
  },
  {
    name: 'trump_voice_audio',
    fullPath: `${EAGLE_USER_BASE}\\trump_voice_audio`,
    category: 'JARVIS_VOICE',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'Synthesized voice master audio tracks for multi-persona conversational testing.',
    sizeOrDetails: 'Audio Bank'
  },
  {
    name: 'trump_voice_samples',
    fullPath: `${EAGLE_USER_BASE}\\trump_voice_samples`,
    category: 'JARVIS_VOICE',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'Training and reference acoustic sample library for zero-shot voice cloning.',
    sizeOrDetails: 'Sample Dataset'
  },
  {
    name: 'trump_voice_temp',
    fullPath: `${EAGLE_USER_BASE}\\trump_voice_temp`,
    category: 'JARVIS_VOICE',
    type: 'DIRECTORY',
    status: 'STANDBY',
    description: 'Scratch space for voice chunk alignment and audio normalization.',
    sizeOrDetails: 'Temp Buffer'
  },
  {
    name: 'edge_voice_tests',
    fullPath: `${EAGLE_USER_BASE}\\edge_voice_tests`,
    category: 'JARVIS_VOICE',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'Benchmark suite testing Microsoft Edge neural voice latency and quality under high concurrency.',
    sizeOrDetails: 'Test Suite'
  },
  {
    name: 'piper_models',
    fullPath: `${EAGLE_USER_BASE}\\piper_models`,
    category: 'JARVIS_VOICE',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'Local on-device Piper neural TTS models running with ultra-fast sub-20ms inference.',
    sizeOrDetails: 'ONNX Models'
  },
  {
    name: 'voices',
    fullPath: `${EAGLE_USER_BASE}\\voices`,
    category: 'JARVIS_VOICE',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'Master directory of all configured voice profiles and speaker embeddings.',
    sizeOrDetails: 'Voice Profiles'
  },
  {
    name: 'voice-memos',
    fullPath: `${EAGLE_USER_BASE}\\voice-memos`,
    category: 'JARVIS_VOICE',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'Recorded executive voice directives, trading rationale notes, and system memos.',
    sizeOrDetails: 'Voice Notes'
  },
  {
    name: 'tts-server',
    fullPath: `${EAGLE_USER_BASE}\\tts-server`,
    category: 'JARVIS_VOICE',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'Dedicated high-throughput local text-to-speech HTTP microservice.',
    sizeOrDetails: 'Microservice'
  },
  {
    name: 'fish_speak.py',
    fullPath: `${EAGLE_USER_BASE}\\fish_speak.py`,
    category: 'JARVIS_VOICE',
    type: 'SCRIPT',
    status: 'ACTIVE',
    description: 'Fish Speech zero-shot multi-lingual voice synthesizer client.',
    quickCommand: `python "${EAGLE_USER_BASE}\\fish_speak.py"`
  },
  {
    name: 'edge_final_en_US_AndrewNeural.mp3',
    fullPath: `${EAGLE_USER_BASE}\\edge_final_en_US_AndrewNeural.mp3`,
    category: 'JARVIS_VOICE',
    type: 'AUDIO',
    status: 'SYNTHESIZED',
    description: 'Master render: Andrew Neural voice sample.',
    sizeOrDetails: 'Audio Clip'
  },
  {
    name: 'edge_final_en_US_ChristopherNeural.mp3',
    fullPath: `${EAGLE_USER_BASE}\\edge_final_en_US_ChristopherNeural.mp3`,
    category: 'JARVIS_VOICE',
    type: 'AUDIO',
    status: 'SYNTHESIZED',
    description: 'Master render: Christopher Neural voice sample.',
    sizeOrDetails: 'Audio Clip'
  },
  {
    name: 'edge_final_en_US_GuyNeural.mp3',
    fullPath: `${EAGLE_USER_BASE}\\edge_final_en_US_GuyNeural.mp3`,
    category: 'JARVIS_VOICE',
    type: 'AUDIO',
    status: 'SYNTHESIZED',
    description: 'Master render: Guy Neural voice sample.',
    sizeOrDetails: 'Audio Clip'
  },
  {
    name: 'edge_kirk_test.mp3',
    fullPath: `${EAGLE_USER_BASE}\\edge_kirk_test.mp3`,
    category: 'JARVIS_VOICE',
    type: 'AUDIO',
    status: 'SYNTHESIZED',
    description: 'Test render: Edge TTS Captain Kirk voice prototype.',
    sizeOrDetails: 'Audio Clip'
  },
  {
    name: 'test_glory.mp3',
    fullPath: `${EAGLE_USER_BASE}\\test_glory.mp3`,
    category: 'JARVIS_VOICE',
    type: 'AUDIO',
    status: 'SYNTHESIZED',
    description: 'Operational validation audio clip for audio DAC and speakers.',
    sizeOrDetails: 'Audio Clip'
  },
  {
    name: 'piper_kirk_output.wav',
    fullPath: `${EAGLE_USER_BASE}\\piper_kirk_output.wav`,
    category: 'JARVIS_VOICE',
    type: 'AUDIO',
    status: 'SYNTHESIZED',
    description: 'Uncompressed WAV render from Piper Captain Kirk voice synthesis.',
    sizeOrDetails: 'Audio Clip'
  },
  {
    name: 'piper_kirk_ryan.mp3',
    fullPath: `${EAGLE_USER_BASE}\\piper_kirk_ryan.mp3`,
    category: 'JARVIS_VOICE',
    type: 'AUDIO',
    status: 'SYNTHESIZED',
    description: 'Synthesized voice dialogue between Kirk and Ryan.',
    sizeOrDetails: 'Audio Clip'
  },
  {
    name: 'piper_kirk_ryan.wav',
    fullPath: `${EAGLE_USER_BASE}\\piper_kirk_ryan.wav`,
    category: 'JARVIS_VOICE',
    type: 'AUDIO',
    status: 'SYNTHESIZED',
    description: 'Master uncompressed WAV of the Kirk-Ryan conversational turn.',
    sizeOrDetails: 'Audio Clip'
  },
  {
    name: 'piper_input.txt',
    fullPath: `${EAGLE_USER_BASE}\\piper_input.txt`,
    category: 'JARVIS_VOICE',
    type: 'FILE',
    status: 'ACTIVE',
    description: 'Input text queue consumed by the Piper synthesis daemon.',
    sizeOrDetails: 'Text Buffer'
  },

  // --- 4. AI INFERENCE FRAMEWORKS & MODEL HUBS ---
  {
    name: 'antigravity-sdk-python',
    fullPath: `${EAGLE_USER_BASE}\\antigravity-sdk-python`,
    category: 'AI_INFERENCE',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'Python SDK client for interacting with the Antigravity agent and sovereign computing enclaves.',
    sizeOrDetails: 'Python SDK'
  },
  {
    name: 'Brahma-AI---Lite',
    fullPath: `${EAGLE_USER_BASE}\\Brahma-AI---Lite`,
    category: 'AI_INFERENCE',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'Compact multimodal reasoning core designed for real-time edge decision loops.',
    sizeOrDetails: 'Inference Engine'
  },
  {
    name: 'checkpoints',
    fullPath: `${EAGLE_USER_BASE}\\checkpoints`,
    category: 'AI_INFERENCE',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'Model checkpoint storage for fine-tuned LoRA adapters and quantization weights.',
    sizeOrDetails: 'Model Weights'
  },
  {
    name: 'CyberCore',
    fullPath: `${EAGLE_USER_BASE}\\CyberCore`,
    category: 'AI_INFERENCE',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'Core cybersecurity intelligence and sovereign defense orchestration repository.',
    sizeOrDetails: 'Defense Core'
  },
  {
    name: 'CyberGym',
    fullPath: `${EAGLE_USER_BASE}\\CyberGym`,
    category: 'AI_INFERENCE',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'Reinforcement learning athletic gym for algorithmic trading and adversarial anomie simulations.',
    sizeOrDetails: 'RL Training'
  },
  {
    name: 'Foundry',
    fullPath: `${EAGLE_USER_BASE}\\Foundry`,
    category: 'AI_INFERENCE',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'Web3 smart contract compiler, fuzzer, and EVM execution simulator.',
    sizeOrDetails: 'Web3 Dev'
  },
  {
    name: 'gaia-cookbook',
    fullPath: `${EAGLE_USER_BASE}\\gaia-cookbook`,
    category: 'AI_INFERENCE',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'GaiaNet decentralized AI deployment recipes, knowledge base indexing, and node setup.',
    sizeOrDetails: 'Recipes'
  },
  {
    name: 'gaianet.js',
    fullPath: `${EAGLE_USER_BASE}\\gaianet.js`,
    category: 'AI_INFERENCE',
    type: 'SCRIPT',
    status: 'ACTIVE',
    description: 'Node.js driver connecting local apps to GaiaNet decentralized intelligence nodes.',
    quickCommand: `node "${EAGLE_USER_BASE}\\gaianet.js"`
  },
  {
    name: 'gaianet-agent.js',
    fullPath: `${EAGLE_USER_BASE}\\gaianet-agent.js`,
    category: 'AI_INFERENCE',
    type: 'SCRIPT',
    status: 'ACTIVE',
    description: 'Autonomous agent interacting with GaiaNet decentralized LLM endpoints.',
    quickCommand: `node "${EAGLE_USER_BASE}\\gaianet-agent.js"`
  },
  {
    name: 'gym',
    fullPath: `${EAGLE_USER_BASE}\\gym`,
    category: 'AI_INFERENCE',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'Custom gym environments for quantitative trading models and automated market making.',
    sizeOrDetails: 'Gym Envs'
  },
  {
    name: 'infinite-brain-harness',
    fullPath: `${EAGLE_USER_BASE}\\infinite-brain-harness`,
    category: 'AI_INFERENCE',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'Long-context memory harness enabling continuous multi-session agent reasoning.',
    sizeOrDetails: 'Memory Harness'
  },
  {
    name: 'LLM_CYBERCORE',
    fullPath: `${EAGLE_USER_BASE}\\LLM_CYBERCORE`,
    category: 'AI_INFERENCE',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'Local LLM serving stack with quant security guardrails and low-latency inference endpoints.',
    sizeOrDetails: 'Model Stack'
  },
  {
    name: 'model_cache',
    fullPath: `${EAGLE_USER_BASE}\\model_cache`,
    category: 'AI_INFERENCE',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'Local neural network weight cache for HuggingFace, GGUF, and ONNX models.',
    sizeOrDetails: 'Weights Cache'
  },
  {
    name: 'NeedleHub',
    fullPath: `${EAGLE_USER_BASE}\\NeedleHub`,
    category: 'AI_INFERENCE',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'Context retrieval evaluation hub and needle-in-a-haystack benchmarking framework.',
    sizeOrDetails: 'Retrieval Hub'
  },
  {
    name: 'SWE-bench',
    fullPath: `${EAGLE_USER_BASE}\\SWE-bench`,
    category: 'AI_INFERENCE',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'Software Engineering benchmark validating autonomous code-generation capability.',
    sizeOrDetails: 'Benchmark'
  },
  {
    name: 'TradingAgents',
    fullPath: `${EAGLE_USER_BASE}\\TradingAgents`,
    category: 'AI_INFERENCE',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'Multi-agent simulation environment for algorithmic market-making and orderbook strategies.',
    sizeOrDetails: 'Agent Swarm'
  },
  {
    name: 'load_qwen_into_ollama.py',
    fullPath: `${EAGLE_USER_BASE}\\load_qwen_into_ollama.py`,
    category: 'AI_INFERENCE',
    type: 'SCRIPT',
    status: 'ACTIVE',
    description: 'Automated script fetching, quantizing, and registering Qwen 2.5 models into local Ollama.',
    quickCommand: `python "${EAGLE_USER_BASE}\\load_qwen_into_ollama.py"`
  },
  {
    name: 'Modelfile',
    fullPath: `${EAGLE_USER_BASE}\\Modelfile`,
    category: 'AI_INFERENCE',
    type: 'CONFIG',
    status: 'ACTIVE',
    description: 'Ollama custom model specification defining system prompts, temperature, and context length.',
    sizeOrDetails: 'Ollama Spec'
  },
  {
    name: 'test_needle.py',
    fullPath: `${EAGLE_USER_BASE}\\test_needle.py`,
    category: 'AI_INFERENCE',
    type: 'SCRIPT',
    status: 'ACTIVE',
    description: 'Retrieval benchmark script testing context recall across 128k+ token horizons.',
    quickCommand: `python "${EAGLE_USER_BASE}\\test_needle.py"`
  },
  {
    name: 'test_jev.py',
    fullPath: `${EAGLE_USER_BASE}\\test_jev.py`,
    category: 'AI_INFERENCE',
    type: 'SCRIPT',
    status: 'ACTIVE',
    description: 'Jevons paradox quantitative modeling script examining compute resource allocation.',
    quickCommand: `python "${EAGLE_USER_BASE}\\test_jev.py"`
  },
  {
    name: 'adapter.pkl',
    fullPath: `${EAGLE_USER_BASE}\\adapter.pkl`,
    category: 'AI_INFERENCE',
    type: 'MODEL',
    status: 'CALIBRATED',
    description: 'Serialized PyTorch LoRA adapter weights for specialized domain reasoning.',
    sizeOrDetails: 'LoRA Adapter'
  },
  {
    name: 'analysis-report.json',
    fullPath: `${EAGLE_USER_BASE}\\analysis-report.json`,
    category: 'AI_INFERENCE',
    type: 'FILE',
    status: 'INDEXED',
    description: 'Detailed JSON benchmark output recording inference latency, accuracy, and memory consumption.',
    sizeOrDetails: 'Benchmark Data'
  },
  {
    name: 'build-everything.js',
    fullPath: `${EAGLE_USER_BASE}\\build-everything.js`,
    category: 'AI_INFERENCE',
    type: 'SCRIPT',
    status: 'ACTIVE',
    description: 'Master Node.js build pipeline compiling all modules, bridges, and frontends.',
    quickCommand: `node "${EAGLE_USER_BASE}\\build-everything.js"`
  },
  {
    name: 'check_cache.py',
    fullPath: `${EAGLE_USER_BASE}\\check_cache.py`,
    category: 'AI_INFERENCE',
    type: 'SCRIPT',
    status: 'ACTIVE',
    description: 'Diagnostics utility verifying integrity and cache freshness across model weights.',
    quickCommand: `python "${EAGLE_USER_BASE}\\check_cache.py"`
  },
  {
    name: 'config.yaml',
    fullPath: `${EAGLE_USER_BASE}\\config.yaml`,
    category: 'AI_INFERENCE',
    type: 'CONFIG',
    status: 'ACTIVE',
    description: 'Master workstation configuration defining active model endpoints, RPCs, and ports.',
    sizeOrDetails: 'YAML Config'
  },
  {
    name: 'data.jsonl',
    fullPath: `${EAGLE_USER_BASE}\\data.jsonl`,
    category: 'AI_INFERENCE',
    type: 'FILE',
    status: 'ACTIVE',
    description: 'Structured JSONL training/fine-tuning dataset containing multi-turn expert trading dialogues.',
    sizeOrDetails: 'Dataset'
  },
  {
    name: 'output.jsonl',
    fullPath: `${EAGLE_USER_BASE}\\output.jsonl`,
    category: 'AI_INFERENCE',
    type: 'FILE',
    status: 'ACTIVE',
    description: 'Generated synthetic model outputs and reasoning traces ready for quality filtering.',
    sizeOrDetails: 'Traces'
  },

  // --- 5. AEGENTIX & SOVEREIGN SWARM REPOSITORIES ---
  {
    name: 'aegentis-local',
    fullPath: `${EAGLE_USER_BASE}\\aegentis-local`,
    category: 'AEGENTIX_SWARM',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'Local Aegentis OS development node and offline dashboard mirror.',
    sizeOrDetails: 'Local App'
  },
  {
    name: 'aegentix',
    fullPath: `${EAGLE_USER_BASE}\\aegentix`,
    category: 'AEGENTIX_SWARM',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'Root Aegentix codebase including agent definitions and core protocols.',
    sizeOrDetails: 'Core Code'
  },
  {
    name: 'aegentix_swarm',
    fullPath: `${EAGLE_USER_BASE}\\aegentix_swarm`,
    category: 'AEGENTIX_SWARM',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'Distributed swarm directory managing multi-process agent coordination and state.',
    sizeOrDetails: 'Swarm Cluster'
  },
  {
    name: 'AEGENTIX-AGENT-MESH',
    fullPath: `${EAGLE_USER_BASE}\\AEGENTIX-AGENT-MESH`,
    category: 'AEGENTIX_SWARM',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'Peer-to-peer agent communications mesh linking all autonomous workers across ports 5001-7001.',
    sizeOrDetails: 'Mesh Network'
  },
  {
    name: 'AEGENTIX-CYBERNETICS-CORE',
    fullPath: `${EAGLE_USER_BASE}\\AEGENTIX-CYBERNETICS-CORE`,
    category: 'AEGENTIX_SWARM',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'Workstation nucleus housing XRPL trading bots, hardware drivers, and compliance engines.',
    sizeOrDetails: 'Nucleus Repo'
  },
  {
    name: 'AEGENTIX-MISSION-CONTROL',
    fullPath: `${EAGLE_USER_BASE}\\AEGENTIX-MISSION-CONTROL`,
    category: 'AEGENTIX_SWARM',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'Mission Control center hosting Starship spatial 3D deck and fleet telemetry.',
    sizeOrDetails: 'Control Deck'
  },
  {
    name: 'aegentix-omnichain-solver',
    fullPath: `${EAGLE_USER_BASE}\\aegentix-omnichain-solver`,
    category: 'AEGENTIX_SWARM',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: '300-node omnichain distributed consensus and cross-chain atomic arbitrage solver.',
    sizeOrDetails: 'Solver Engine'
  },
  {
    name: 'AEGENTIX-SECURITY-INTELLIGENCE',
    fullPath: `${EAGLE_USER_BASE}\\AEGENTIX-SECURITY-INTELLIGENCE`,
    category: 'AEGENTIX_SWARM',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'Automated threat hunting, OSINT ML pipelines, and Gemini chat data goldmine aggregation.',
    sizeOrDetails: 'Threat Intel'
  },
  {
    name: 'agent-tools',
    fullPath: `${EAGLE_USER_BASE}\\agent-tools`,
    category: 'AEGENTIX_SWARM',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'Utility tools, sandboxes, and execution harnesses for autonomous agents.',
    sizeOrDetails: 'Tooling Library'
  },
  {
    name: 'SOVEREIGN_CORE',
    fullPath: `${EAGLE_USER_BASE}\\SOVEREIGN_CORE`,
    category: 'AEGENTIX_SWARM',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'True Swarm 9980B sovereign nexus and consensus state repository.',
    sizeOrDetails: 'True Swarm'
  },
  {
    name: 'sovereign-os',
    fullPath: `${EAGLE_USER_BASE}\\sovereign-os`,
    category: 'AEGENTIX_SWARM',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'Sovereign operating system layer managing local cryptographic enclaves and process boundaries.',
    sizeOrDetails: 'OS Enclave'
  },
  {
    name: 'agent.js',
    fullPath: `${EAGLE_USER_BASE}\\agent.js`,
    category: 'AEGENTIX_SWARM',
    type: 'SCRIPT',
    status: 'ACTIVE',
    description: 'Base autonomous agent class providing decision loops, telemetry reporting, and tool execution.',
    quickCommand: `node "${EAGLE_USER_BASE}\\agent.js"`
  },
  {
    name: 'corporate-agent.js',
    fullPath: `${EAGLE_USER_BASE}\\corporate-agent.js`,
    category: 'AEGENTIX_SWARM',
    type: 'SCRIPT',
    status: 'ACTIVE',
    description: 'Corporate executive agent executing compliance checks and ARR milestone tracking.',
    quickCommand: `node "${EAGLE_USER_BASE}\\corporate-agent.js"`
  },
  {
    name: 'enhanced-agent.js',
    fullPath: `${EAGLE_USER_BASE}\\enhanced-agent.js`,
    category: 'AEGENTIX_SWARM',
    type: 'SCRIPT',
    status: 'ACTIVE',
    description: 'Enhanced agent with integrated memory retrieval and tool reflection capabilities.',
    quickCommand: `node "${EAGLE_USER_BASE}\\enhanced-agent.js"`
  },
  {
    name: 'free-agent.js',
    fullPath: `${EAGLE_USER_BASE}\\free-agent.js`,
    category: 'AEGENTIX_SWARM',
    type: 'SCRIPT',
    status: 'ACTIVE',
    description: 'Unconstrained exploratory agent probing alternative arbitrage pathways and new liquidity pools.',
    quickCommand: `node "${EAGLE_USER_BASE}\\free-agent.js"`
  },
  {
    name: 'processor.js',
    fullPath: `${EAGLE_USER_BASE}\\processor.js`,
    category: 'AEGENTIX_SWARM',
    type: 'SCRIPT',
    status: 'ACTIVE',
    description: 'High-frequency message processor parsing event queues between agents.',
    quickCommand: `node "${EAGLE_USER_BASE}\\processor.js"`
  },

  // --- 6. PRODUCTION SCRIPTS & POWERSHELL ORCHESTRATORS ---
  {
    name: 'aegentix_omega_full.py',
    fullPath: `${EAGLE_USER_BASE}\\aegentix_omega_full.py`,
    category: 'PRODUCTION_SCRIPTS',
    type: 'SCRIPT',
    status: 'ACTIVE',
    description: 'Comprehensive Omega agent bootstrap mounting all sovereign modules, vaults, and models.',
    quickCommand: `python "${EAGLE_USER_BASE}\\aegentix_omega_full.py"`
  },
  {
    name: 'aegentix_omega_live.py',
    fullPath: `${EAGLE_USER_BASE}\\aegentix_omega_live.py`,
    category: 'PRODUCTION_SCRIPTS',
    type: 'SCRIPT',
    status: 'ACTIVE',
    description: 'Live production runner of the Omega sovereign agent executing paper-safe transactions.',
    quickCommand: `python "${EAGLE_USER_BASE}\\aegentix_omega_live.py"`
  },
  {
    name: 'aegentix_swarm.py',
    fullPath: `${EAGLE_USER_BASE}\\aegentix_swarm.py`,
    category: 'PRODUCTION_SCRIPTS',
    type: 'SCRIPT',
    status: 'ACTIVE',
    description: 'Python master controller spawning and monitoring the 14-node sovereign worker cluster.',
    quickCommand: `python "${EAGLE_USER_BASE}\\aegentix_swarm.py"`
  },
  {
    name: 'AegentixAutonomousAgent.ps1',
    fullPath: `${EAGLE_USER_BASE}\\AegentixAutonomousAgent.ps1`,
    category: 'PRODUCTION_SCRIPTS',
    type: 'SCRIPT',
    status: 'ACTIVE',
    description: 'PowerShell supervisory watchdog monitoring background agent processes and auto-restarting crashed tasks.',
    quickCommand: `powershell -ExecutionPolicy Bypass -File "${EAGLE_USER_BASE}\\AegentixAutonomousAgent.ps1"`
  },
  {
    name: 'AgentsOfChaosMoE.ps1',
    fullPath: `${EAGLE_USER_BASE}\\AgentsOfChaosMoE.ps1`,
    category: 'PRODUCTION_SCRIPTS',
    type: 'SCRIPT',
    status: 'ACTIVE',
    description: 'Mixture-of-Experts adversarial stress-testing harness introducing network jitter and market flashes.',
    quickCommand: `powershell -ExecutionPolicy Bypass -File "${EAGLE_USER_BASE}\\AgentsOfChaosMoE.ps1"`
  },
  {
    name: 'Invoke-SystemOne.ps1',
    fullPath: `${EAGLE_USER_BASE}\\Invoke-SystemOne.ps1`,
    category: 'PRODUCTION_SCRIPTS',
    type: 'SCRIPT',
    status: 'ACTIVE',
    description: 'PowerShell master bootstrapper launching System One components in synchronized dependency order.',
    quickCommand: `powershell -ExecutionPolicy Bypass -File "${EAGLE_USER_BASE}\\Invoke-SystemOne.ps1"`
  },
  {
    name: 'Mitigate-LayaBaking.ps1',
    fullPath: `${EAGLE_USER_BASE}\\Mitigate-LayaBaking.ps1`,
    category: 'PRODUCTION_SCRIPTS',
    type: 'SCRIPT',
    status: 'ACTIVE',
    description: 'Automated remediation script releasing file locks and clearing stale cache during baking runs.',
    quickCommand: `powershell -ExecutionPolicy Bypass -File "${EAGLE_USER_BASE}\\Mitigate-LayaBaking.ps1"`
  },
  {
    name: 'Route-Orchestrator.ps1',
    fullPath: `${EAGLE_USER_BASE}\\Route-Orchestrator.ps1`,
    category: 'PRODUCTION_SCRIPTS',
    type: 'SCRIPT',
    status: 'ACTIVE',
    description: 'Dynamic network route orchestrator balancing API traffic across available local bridges.',
    quickCommand: `powershell -ExecutionPolicy Bypass -File "${EAGLE_USER_BASE}\\Route-Orchestrator.ps1"`
  },
  {
    name: 'scan_drives.ps1',
    fullPath: `${EAGLE_USER_BASE}\\scan_drives.ps1`,
    category: 'PRODUCTION_SCRIPTS',
    type: 'SCRIPT',
    status: 'ACTIVE',
    description: 'PowerShell hardware storage auditor verifying SMART status, free space, and mount paths.',
    quickCommand: `powershell -ExecutionPolicy Bypass -File "${EAGLE_USER_BASE}\\scan_drives.ps1"`
  },
  {
    name: 'scan_h.ps1',
    fullPath: `${EAGLE_USER_BASE}\\scan_h.ps1`,
    category: 'PRODUCTION_SCRIPTS',
    type: 'SCRIPT',
    status: 'ACTIVE',
    description: 'Dedicated scanner for drive H:\\ verifying backup archive integrity and replication state.',
    quickCommand: `powershell -ExecutionPolicy Bypass -File "${EAGLE_USER_BASE}\\scan_h.ps1"`
  },
  {
    name: 'symphony_conductor.py',
    fullPath: `${EAGLE_USER_BASE}\\symphony_conductor.py`,
    category: 'PRODUCTION_SCRIPTS',
    type: 'SCRIPT',
    status: 'ACTIVE',
    description: 'Master Symphony conductor coordinating multi-agent loops and timing synchronization.',
    quickCommand: `python "${EAGLE_USER_BASE}\\symphony_conductor.py"`
  },
  {
    name: 'server_with_guardrails.py',
    fullPath: `${EAGLE_USER_BASE}\\server_with_guardrails.py`,
    category: 'PRODUCTION_SCRIPTS',
    type: 'SCRIPT',
    status: 'ACTIVE',
    description: 'Hardened HTTP/REST API server enforcing strict compliance guardrails on all outgoing actions.',
    quickCommand: `python "${EAGLE_USER_BASE}\\server_with_guardrails.py"`
  },
  {
    name: 'omega_sovereign.py',
    fullPath: `${EAGLE_USER_BASE}\\omega_sovereign.py`,
    category: 'PRODUCTION_SCRIPTS',
    type: 'SCRIPT',
    status: 'ACTIVE',
    description: 'Sovereign runtime anchoring local operations to consensus topics and immutable ledgers.',
    quickCommand: `python "${EAGLE_USER_BASE}\\omega_sovereign.py"`
  },
  {
    name: 'heretic_server.py',
    fullPath: `${EAGLE_USER_BASE}\\heretic_server.py`,
    category: 'PRODUCTION_SCRIPTS',
    type: 'SCRIPT',
    status: 'ACTIVE',
    description: 'Local uncensored model inference server providing high-latitude reasoning capabilities.',
    quickCommand: `python "${EAGLE_USER_BASE}\\heretic_server.py"`
  },
  {
    name: 'run_decision.py',
    fullPath: `${EAGLE_USER_BASE}\\run_decision.py`,
    category: 'PRODUCTION_SCRIPTS',
    type: 'SCRIPT',
    status: 'ACTIVE',
    description: 'Quantitative decision analysis utility executing expected utility matrix calculations.',
    quickCommand: `python "${EAGLE_USER_BASE}\\run_decision.py"`
  },
  {
    name: 'AEGENTIX-PRODUCTION-LOG_20260907_222409.log',
    fullPath: `${EAGLE_USER_BASE}\\AEGENTIX-PRODUCTION-LOG_20260907_222409.log`,
    category: 'PRODUCTION_SCRIPTS',
    type: 'LOG',
    status: 'INDEXED',
    description: 'Production execution audit log capturing system boot and component initialization.',
    sizeOrDetails: 'Production Log'
  },
  {
    name: 'AEGENTIX-PRODUCTION-LOG_20260907_222430.log',
    fullPath: `${EAGLE_USER_BASE}\\AEGENTIX-PRODUCTION-LOG_20260907_222430.log`,
    category: 'PRODUCTION_SCRIPTS',
    type: 'LOG',
    status: 'INDEXED',
    description: 'Production execution log recording agent mesh registration and WebSocket handshakes.',
    sizeOrDetails: 'Production Log'
  },
  {
    name: 'AEGENTIX-PRODUCTION-LOG_20260907_222447.log',
    fullPath: `${EAGLE_USER_BASE}\\AEGENTIX-PRODUCTION-LOG_20260907_222447.log`,
    category: 'PRODUCTION_SCRIPTS',
    type: 'LOG',
    status: 'INDEXED',
    description: 'Production execution log verifying compliance checks and paper-safe trading cycles.',
    sizeOrDetails: 'Production Log'
  },

  // --- 7. RUNTIME DOT-DIRECTORIES & ENCLAVE CONFIGS ---
  {
    name: '.docker',
    fullPath: `${EAGLE_USER_BASE}\\.docker`,
    category: 'DOT_ENV_CONFIG',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'Docker container configuration, credential store, and buildkit state.',
    sizeOrDetails: 'Container Config'
  },
  {
    name: '.dotnet',
    fullPath: `${EAGLE_USER_BASE}\\.dotnet`,
    category: 'DOT_ENV_CONFIG',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: '.NET Core SDKs, runtime environments, and global tooling caches.',
    sizeOrDetails: 'Framework'
  },
  {
    name: '.ethereum',
    fullPath: `${EAGLE_USER_BASE}\\.ethereum`,
    category: 'DOT_ENV_CONFIG',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'Main Ethereum client chain data, state trie, and local keystores.',
    sizeOrDetails: 'Web3 Chain'
  },
  {
    name: '.ethereum-custom',
    fullPath: `${EAGLE_USER_BASE}\\.ethereum-custom`,
    category: 'DOT_ENV_CONFIG',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'Custom private Ethereum testnet and EVM enclave state.',
    sizeOrDetails: 'Private EVM'
  },
  {
    name: '.ethereum-geth',
    fullPath: `${EAGLE_USER_BASE}\\.ethereum-geth`,
    category: 'DOT_ENV_CONFIG',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'Go-Ethereum (Geth) node database, IPC socket, and peer tables.',
    sizeOrDetails: 'Geth Node'
  },
  {
    name: '.flm',
    fullPath: `${EAGLE_USER_BASE}\\.flm`,
    category: 'DOT_ENV_CONFIG',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'Fast Language Model runtime configuration and quantization layers.',
    sizeOrDetails: 'Fast LM'
  },
  {
    name: '.gemini',
    fullPath: `${EAGLE_USER_BASE}\\.gemini`,
    category: 'DOT_ENV_CONFIG',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'Gemini CLI configurations, authentication tokens, and session context.',
    sizeOrDetails: 'Gemini Auth'
  },
  {
    name: '.grokbot',
    fullPath: `${EAGLE_USER_BASE}\\.grokbot`,
    category: 'DOT_ENV_CONFIG',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'Grok LLM integration client configurations and conversational history.',
    sizeOrDetails: 'Grok Client'
  },
  {
    name: '.herdr',
    fullPath: `${EAGLE_USER_BASE}\\.herdr`,
    category: 'DOT_ENV_CONFIG',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'Agent herd clustering configuration and peer discovery state.',
    sizeOrDetails: 'Herd Cluster'
  },
  {
    name: '.heretic',
    fullPath: `${EAGLE_USER_BASE}\\.heretic`,
    category: 'DOT_ENV_CONFIG',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'Heretic uncensored local inference daemon configuration and socket bindings.',
    sizeOrDetails: 'Heretic Core'
  },
  {
    name: '.hermes',
    fullPath: `${EAGLE_USER_BASE}\\.hermes`,
    category: 'DOT_ENV_CONFIG',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'Hermes trading engine nonces, DEX connections, and ORB strategy state.',
    sizeOrDetails: 'Hermes State'
  },
  {
    name: '.kaggle',
    fullPath: `${EAGLE_USER_BASE}\\.kaggle`,
    category: 'DOT_ENV_CONFIG',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'Kaggle API keys for dataset fetching and model benchmarking.',
    sizeOrDetails: 'Kaggle Keys'
  },
  {
    name: '.kimi-code',
    fullPath: `${EAGLE_USER_BASE}\\.kimi-code`,
    category: 'DOT_ENV_CONFIG',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'Kimi AI coding assistant context memory and active code workspace indices.',
    sizeOrDetails: 'Kimi Cache'
  },
  {
    name: '.kube',
    fullPath: `${EAGLE_USER_BASE}\\.kube`,
    category: 'DOT_ENV_CONFIG',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'Kubernetes cluster contexts, kubeconfig credentials, and namespaces.',
    sizeOrDetails: 'K8s Config'
  },
  {
    name: '.lmstudio',
    fullPath: `${EAGLE_USER_BASE}\\.lmstudio`,
    category: 'DOT_ENV_CONFIG',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'LM Studio model repository, server configurations, and quantization manifests.',
    sizeOrDetails: 'LM Studio'
  },
  {
    name: '.lmstudio-home-pointer',
    fullPath: `${EAGLE_USER_BASE}\\.lmstudio-home-pointer`,
    category: 'DOT_ENV_CONFIG',
    type: 'FILE',
    status: 'ACTIVE',
    description: 'Filesystem pointer linking LM Studio default directory to high-speed NVMe storage.',
    sizeOrDetails: 'Pointer File'
  },
  {
    name: '.local',
    fullPath: `${EAGLE_USER_BASE}\\.local`,
    category: 'DOT_ENV_CONFIG',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'User local binaries, pip package installs, and virtual environment bindings.',
    sizeOrDetails: 'Local Bins'
  },
  {
    name: '.mcp-auth',
    fullPath: `${EAGLE_USER_BASE}\\.mcp-auth`,
    category: 'DOT_ENV_CONFIG',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'Model Context Protocol server authentication keys and permission scopes.',
    sizeOrDetails: 'MCP Auth'
  },
  {
    name: '.miopen',
    fullPath: `${EAGLE_USER_BASE}\\.miopen`,
    category: 'DOT_ENV_CONFIG',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'AMD ROCm MIOpen GPU convolution kernel cache accelerating local neural networks.',
    sizeOrDetails: 'ROCm Cache'
  },
  {
    name: '.npm',
    fullPath: `${EAGLE_USER_BASE}\\.npm`,
    category: 'DOT_ENV_CONFIG',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'Global Node Package Manager registry cache and module index.',
    sizeOrDetails: 'NPM Cache'
  },
  {
    name: '.ollama',
    fullPath: `${EAGLE_USER_BASE}\\.ollama`,
    category: 'DOT_ENV_CONFIG',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'Ollama local model weights (Llama 3, Qwen, Mistral) and quantization manifests.',
    sizeOrDetails: 'Ollama Models'
  },
  {
    name: '.openjarvis',
    fullPath: `${EAGLE_USER_BASE}\\.openjarvis`,
    category: 'DOT_ENV_CONFIG',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'OpenJarvis autonomous assistant configuration and active task memory.',
    sizeOrDetails: 'OpenJarvis'
  },
  {
    name: '.pm2',
    fullPath: `${EAGLE_USER_BASE}\\.pm2`,
    category: 'DOT_ENV_CONFIG',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'Process Manager 2 runtime state, logs, and cluster management files.',
    sizeOrDetails: 'PM2 Cluster'
  },
  {
    name: '.pytest_cache',
    fullPath: `${EAGLE_USER_BASE}\\.pytest_cache`,
    category: 'DOT_ENV_CONFIG',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'Pytest test execution cache and failure regression tracking.',
    sizeOrDetails: 'Pytest Cache'
  },
  {
    name: '.rustup',
    fullPath: `${EAGLE_USER_BASE}\\.rustup`,
    category: 'DOT_ENV_CONFIG',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'Rust programming language toolchains, cargo binaries, and architecture profiles.',
    sizeOrDetails: 'Rustup'
  },
  {
    name: '.secrets',
    fullPath: `${EAGLE_USER_BASE}\\.secrets`,
    category: 'DOT_ENV_CONFIG',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'Encrypted enclave credential storage, hardware key seeds, and access tokens.',
    sizeOrDetails: 'Encrypted Vault'
  },
  {
    name: '.ssh',
    fullPath: `${EAGLE_USER_BASE}\\.ssh`,
    category: 'DOT_ENV_CONFIG',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'SSH keypairs, known_hosts, and secure tunnel gateway configurations.',
    sizeOrDetails: 'SSH Keys'
  },
  {
    name: '.ubuntupro',
    fullPath: `${EAGLE_USER_BASE}\\.ubuntupro`,
    category: 'DOT_ENV_CONFIG',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'Ubuntu Pro security maintenance license and extended security maintenance tokens.',
    sizeOrDetails: 'Ubuntu Pro'
  },
  {
    name: '.vscode',
    fullPath: `${EAGLE_USER_BASE}\\.vscode`,
    category: 'DOT_ENV_CONFIG',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'Visual Studio Code workspace settings, debugging launch profiles, and tasks.',
    sizeOrDetails: 'VS Code'
  },
  {
    name: '.vscode-shared',
    fullPath: `${EAGLE_USER_BASE}\\.vscode-shared`,
    category: 'DOT_ENV_CONFIG',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'Shared Visual Studio Code extensions and settings synchronized across machines.',
    sizeOrDetails: 'Shared Settings'
  },
  {
    name: '__pycache__',
    fullPath: `${EAGLE_USER_BASE}\\__pycache__`,
    category: 'DOT_ENV_CONFIG',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'Compiled Python bytecode accelerating execution startup time.',
    sizeOrDetails: 'PyCache'
  },
  {
    name: '.claude.json',
    fullPath: `${EAGLE_USER_BASE}\\.claude.json`,
    category: 'DOT_ENV_CONFIG',
    type: 'CONFIG',
    status: 'ACTIVE',
    description: 'Claude desktop authentication tokens and Model Context Protocol server registrations.',
    sizeOrDetails: 'Claude Config'
  },
  {
    name: '.env',
    fullPath: `${EAGLE_USER_BASE}\\.env`,
    category: 'DOT_ENV_CONFIG',
    type: 'CONFIG',
    status: 'ACTIVE',
    description: 'Root environment variables defining private endpoints, enclave keys, and API tokens.',
    sizeOrDetails: 'Root Secrets'
  },
  {
    name: '.gitconfig',
    fullPath: `${EAGLE_USER_BASE}\\.gitconfig`,
    category: 'DOT_ENV_CONFIG',
    type: 'CONFIG',
    status: 'ACTIVE',
    description: 'Global Git configuration, commit signing GPG keys, and branch preferences.',
    sizeOrDetails: 'Git Config'
  },
  {
    name: '.lesshst',
    fullPath: `${EAGLE_USER_BASE}\\.lesshst`,
    category: 'DOT_ENV_CONFIG',
    type: 'CONFIG',
    status: 'ACTIVE',
    description: 'Terminal pager command execution history.',
    sizeOrDetails: 'History'
  },
  {
    name: '.node_repl_history',
    fullPath: `${EAGLE_USER_BASE}\\.node_repl_history`,
    category: 'DOT_ENV_CONFIG',
    type: 'CONFIG',
    status: 'ACTIVE',
    description: 'Interactive Node.js REPL command history.',
    sizeOrDetails: 'History'
  },
  {
    name: '.python_history',
    fullPath: `${EAGLE_USER_BASE}\\.python_history`,
    category: 'DOT_ENV_CONFIG',
    type: 'CONFIG',
    status: 'ACTIVE',
    description: 'Interactive Python interpreter command history.',
    sizeOrDetails: 'History'
  },
  {
    name: '.wslconfig',
    fullPath: `${EAGLE_USER_BASE}\\.wslconfig`,
    category: 'DOT_ENV_CONFIG',
    type: 'CONFIG',
    status: 'ACTIVE',
    description: 'Windows Subsystem for Linux (WSL2) resource limits: CPU cores, RAM allocation, and swap size.',
    sizeOrDetails: 'WSL Config'
  },

  // --- 8. SYSTEM DIRECTORIES & STORAGE VOLUMES ---
  {
    name: 'Desktop',
    fullPath: `${EAGLE_USER_BASE}\\Desktop`,
    category: 'SYSTEM_STORAGE',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'Windows primary desktop containing active application shortcuts and Halo CE Web link.',
    sizeOrDetails: 'System Folder'
  },
  {
    name: 'Documents',
    fullPath: `${EAGLE_USER_BASE}\\Documents`,
    category: 'SYSTEM_STORAGE',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'Primary documents directory containing corporate manifests, patents, and contracts.',
    sizeOrDetails: 'System Folder'
  },
  {
    name: 'Downloads',
    fullPath: `${EAGLE_USER_BASE}\\Downloads`,
    category: 'SYSTEM_STORAGE',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'System downloads directory holding incoming packages, models, and tarballs.',
    sizeOrDetails: 'System Folder'
  },
  {
    name: 'OneDrive',
    fullPath: `${EAGLE_USER_BASE}\\OneDrive`,
    category: 'SYSTEM_STORAGE',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'Microsoft OneDrive cloud storage synchronization mount.',
    sizeOrDetails: 'Cloud Sync'
  },
  {
    name: 'iCloudDrive',
    fullPath: `${EAGLE_USER_BASE}\\iCloudDrive`,
    category: 'SYSTEM_STORAGE',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'Apple iCloud Drive cloud synchronization mount.',
    sizeOrDetails: 'Cloud Sync'
  },
  {
    name: 'iCloudPhotos',
    fullPath: `${EAGLE_USER_BASE}\\iCloudPhotos`,
    category: 'SYSTEM_STORAGE',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'Apple iCloud Photos media stream.',
    sizeOrDetails: 'Cloud Media'
  },
  {
    name: 'Archives',
    fullPath: `${EAGLE_USER_BASE}\\Archives`,
    category: 'SYSTEM_STORAGE',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'Long-term immutable archive directory storing frozen releases and historical backups.',
    sizeOrDetails: 'Archive Vault'
  },
  {
    name: 'Projects',
    fullPath: `${EAGLE_USER_BASE}\\Projects`,
    category: 'SYSTEM_STORAGE',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'Active software development projects repository workspace.',
    sizeOrDetails: 'Workspaces'
  },
  {
    name: 'github',
    fullPath: `${EAGLE_USER_BASE}\\github`,
    category: 'SYSTEM_STORAGE',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'Cloned GitHub open-source repositories and contribution branches.',
    sizeOrDetails: 'Git Workspace'
  },
  {
    name: 'laya',
    fullPath: `${EAGLE_USER_BASE}\\laya`,
    category: 'SYSTEM_STORAGE',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'Laya baking engine workspace and caching directory.',
    sizeOrDetails: 'Baking Workspace'
  },
  {
    name: 'ledger',
    fullPath: `${EAGLE_USER_BASE}\\ledger`,
    category: 'SYSTEM_STORAGE',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'Local ledger records, transaction history, and cryptographic audit proofs.',
    sizeOrDetails: 'Ledger Records'
  },
  {
    name: 'logs',
    fullPath: `${EAGLE_USER_BASE}\\logs`,
    category: 'SYSTEM_STORAGE',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'Central workstation log repository tracking daemon activity and errors.',
    sizeOrDetails: 'Log Directory'
  },
  {
    name: 'osint-engine',
    fullPath: `${EAGLE_USER_BASE}\\osint-engine`,
    category: 'SYSTEM_STORAGE',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'Open source intelligence scraping engine and correlation graph.',
    sizeOrDetails: 'OSINT Engine'
  },
  {
    name: 'outputs',
    fullPath: `${EAGLE_USER_BASE}\\outputs`,
    category: 'SYSTEM_STORAGE',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'Output directory for generated artifacts, charts, reports, and builds.',
    sizeOrDetails: 'Output Vault'
  },
  {
    name: 'public-apis',
    fullPath: `${EAGLE_USER_BASE}\\public-apis`,
    category: 'SYSTEM_STORAGE',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'Collection of public API definitions, OpenAPI specs, and SDK connectors.',
    sizeOrDetails: 'API Specs'
  },
  {
    name: 'reference_audio',
    fullPath: `${EAGLE_USER_BASE}\\reference_audio`,
    category: 'SYSTEM_STORAGE',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'Reference audio recordings for voice model calibration and frequency tuning.',
    sizeOrDetails: 'Reference Audio'
  },
  {
    name: 'scripts',
    fullPath: `${EAGLE_USER_BASE}\\scripts`,
    category: 'SYSTEM_STORAGE',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'Workstation operational automation scripts and maintenance tools.',
    sizeOrDetails: 'Scripts Bank'
  },
  {
    name: 'terminals',
    fullPath: `${EAGLE_USER_BASE}\\terminals`,
    category: 'SYSTEM_STORAGE',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'Dedicated terminal profiles, window layouts, and multi-pane session managers.',
    sizeOrDetails: 'Terminal Layouts'
  },
  {
    name: 'worldmonitor',
    fullPath: `${EAGLE_USER_BASE}\\worldmonitor`,
    category: 'SYSTEM_STORAGE',
    type: 'DIRECTORY',
    status: 'ACTIVE',
    description: 'Global geopolitical and financial news sentiment monitoring feeds.',
    sizeOrDetails: 'World Monitor'
  }
];
