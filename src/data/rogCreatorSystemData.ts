// ROG Ally X Free Creator System & Creator Compatibility Adapter (CCA) Data Model
// Architectural definition for dual-boot (Windows 11 / Bazzite), OBS, CyberDAW Max,
// Offline AI Clipping pipeline, and Anti-Cheat Boundary Security.

export interface StoragePartition {
  name: string;
  suggestedSize: string;
  purpose: string;
  fileSystem: 'NTFS' | 'Btrfs / EXT4' | 'Fat32';
  usedFor: string[];
}

export interface CreatorLayer {
  layer: 'Gaming' | 'Streaming' | 'Editing' | 'AI Clipping' | 'Live Audio' | 'Device Management';
  windows11: string;
  bazzite: string;
  sharedResources: string;
  status: 'ACTIVE' | 'CONFIGURED' | 'READY';
}

export interface AntiCheatBoundaryRule {
  id: string;
  category: string;
  securityBoundary: string;
  proposedTreatment: string;
  status: 'COMPLIANT' | 'ISOLATED' | 'BLOCKED';
  auditProof: string;
}

export interface CyberDawPreset {
  id: string;
  name: string;
  purpose: string;
  chain: string[];
  bufferSize: number;
  cpuMode: 'LOW_LATENCY' | 'STREAM_SAFE' | 'OFFLINE_FINISH';
  peakSafetyCeilingDbfs: number;
}

export interface RogCreatorSystemConfig {
  architectureVersion: string;
  systemName: string;
  primaryOs: string;
  secondaryOs: string;
  currentMode: 'STRICT_MODE' | 'APPROVED_CAPTURE_MODE' | 'DIAGNOSTIC_MODE';
  hardware: {
    device: string;
    soc: string;
    display: string;
    storage: string;
    coolingProfile: string;
  };
  partitions: StoragePartition[];
  layers: CreatorLayer[];
  antiCheatRules: AntiCheatBoundaryRule[];
  cyberDawPresets: CyberDawPreset[];
  obsSettings: {
    canvas: string;
    streamOutput: string;
    recordingFormat: string;
    encoder: string;
    rateControl: string;
    bitrateKbps: number;
    replayBufferSec: number;
    audioSampleRateKhz: number;
  };
  aiClippingPipeline: {
    whisperModel: string;
    scoringAlgorithm: string;
    ffmpegAssembly: boolean;
    manualReviewGate: boolean;
    outputFolder: string;
  };
}

export const ROG_CREATOR_SYSTEM_DATA: RogCreatorSystemConfig = {
  architectureVersion: 'v2.4-Sovereign-CCA',
  systemName: 'ROG Ally X Free Creator System (CCA)',
  primaryOs: 'Windows 11 (Creator Hub & Live DAW)',
  secondaryOs: 'Bazzite (Handheld Game Mode)',
  currentMode: 'STRICT_MODE',
  hardware: {
    device: 'ASUS ROG Ally X Handheld',
    soc: 'AMD Ryzen Z1 Extreme (16 Threads, RDNA 3)',
    display: '1080p 120Hz VRR Touch Panel',
    storage: '1TB M.2 2280 NVMe SSD + USB-C High-Speed Media Drive',
    coolingProfile: 'Creator Balanced (25W-30W Plugged)',
  },
  partitions: [
    {
      name: 'Windows System Partition',
      suggestedSize: '180–220 GB',
      purpose: 'Windows 11, AMD drivers, OBS, CyberDAW Max, VSTs, launchers, tools',
      fileSystem: 'NTFS',
      usedFor: ['Windows 11', 'Armoury Crate SE', 'OBS Studio', 'CyberDAW Max', 'ReaPlugs'],
    },
    {
      name: 'Bazzite System Partition',
      suggestedSize: '100–140 GB',
      purpose: 'Linux gaming environment, Proton GE, console-like suspend/resume',
      fileSystem: 'Btrfs / EXT4',
      usedFor: ['Bazzite OS', 'Steam Deck UI', 'Handheld Daemon', 'Proton Runtime'],
    },
    {
      name: 'Shared NTFS Media Partition',
      suggestedSize: '350–500 GB',
      purpose: 'Clips, recordings, exports, assets, project files, local music',
      fileSystem: 'NTFS',
      usedFor: ['D:\\Creator\\Recordings', 'D:\\Creator\\Clips', 'D:\\Creator\\Montages', 'D:\\Creator\\Projects'],
    },
    {
      name: 'Recovery & Free Space',
      suggestedSize: 'Remaining (150–200 GB)',
      purpose: 'Shader caches, swap space, future game expansions, BitLocker recovery',
      fileSystem: 'NTFS',
      usedFor: ['Recovery Tools', 'Windows Recovery USB', 'Shader Cache Expansion'],
    },
  ],
  layers: [
    {
      layer: 'Gaming',
      windows11: 'Steam, Xbox Game Pass, Epic, Battle.net, anti-cheat competitive titles',
      bazzite: 'Steam Deck UI, native Linux titles, Proton single-player couch games',
      sharedResources: 'Shared library where practical; Windows games kept on NTFS',
      status: 'ACTIVE',
    },
    {
      layer: 'Streaming',
      windows11: 'OBS Studio, Replay Buffer, Advanced Scene Switcher, Streamer.bot, Aitum Vertical',
      bazzite: 'Optional OBS light capture only',
      sharedResources: 'OBS Scene Collections, overlays, sound alerts synced on D:\\Creator',
      status: 'CONFIGURED',
    },
    {
      layer: 'Editing',
      windows11: 'Kdenlive (default open source) + optional DaVinci Resolve Free',
      bazzite: 'Kdenlive portable if needed',
      sharedResources: 'D:\\Creator\\Projects, D:\\Creator\\Exports, D:\\Creator\\Assets',
      status: 'READY',
    },
    {
      layer: 'AI Clipping',
      windows11: 'Local Whisper.cpp, silence & loudness scoring, FFmpeg assembly, human approval',
      bazzite: 'Not recommended initially (batch post-process in Windows)',
      sharedResources: 'D:\\Creator\\Inbox, D:\\Creator\\Clips, D:\\Creator\\Montages',
      status: 'READY',
    },
    {
      layer: 'Live Audio',
      windows11: 'CyberDAW Max live layer, ReaPlugs VSTs, Equalizer APO, VB-CABLE virtual routing',
      bazzite: 'PipeWire only for basic game audio',
      sharedResources: 'Shared VST presets, samples, sound effects on D:\\Creator\\Audio',
      status: 'ACTIVE',
    },
    {
      layer: 'Device Management',
      windows11: 'Armoury Crate SE, AMD Adrenalin drivers, power targets (15W/25W/30W)',
      bazzite: 'Handheld Daemon (HHD) and Bazzite TDP sliders',
      sharedResources: 'BIOS update files, hardware profiles, documentation',
      status: 'ACTIVE',
    },
  ],
  antiCheatRules: [
    {
      id: 'CCA-RULE-001',
      category: 'OBS Capture & Hardware Encoder',
      securityBoundary: 'Outside Game Process (User Space)',
      proposedTreatment: 'Uses documented Windows Graphics Capture & AMD AMF hardware encoder; 0 game memory access.',
      status: 'COMPLIANT',
      auditProof: 'Zero memory read/write hooks. Independent OBS window source.',
    },
    {
      id: 'CCA-RULE-002',
      category: 'Replay Buffer Memory',
      securityBoundary: 'Outside Game Process',
      proposedTreatment: 'Ring buffer stores encoded video frames only from OS desktop surface; no process attachments.',
      status: 'COMPLIANT',
      auditProof: 'Encapsulated RAM ring buffer (30–90s) in OBS process.',
    },
    {
      id: 'CCA-RULE-003',
      category: 'CyberDAW Max Audio Routing',
      securityBoundary: 'Windows Core Audio / WASAPI',
      proposedTreatment: 'Standard audio endpoints & virtual cables; zero hooking of game audio engines or binaries.',
      status: 'COMPLIANT',
      auditProof: 'No DLL injection into game sound threads; uses standard VB-CABLE endpoint.',
    },
    {
      id: 'CCA-RULE-004',
      category: 'Offline AI Transcription & Clipping',
      securityBoundary: 'Post-Session Closed Media Files',
      proposedTreatment: 'Operates exclusively on closed MKV/MP4 files after recording stops; never runs in live memory.',
      status: 'ISOLATED',
      auditProof: 'Zero game process interaction; purely offline media pipeline.',
    },
    {
      id: 'CCA-RULE-005',
      category: 'Game Mods, Injections & Macros',
      securityBoundary: 'Protected Game Code Boundary',
      proposedTreatment: 'Strictly prohibited & out of scope. System enforces 0 DLL injection and 0 input emulation.',
      status: 'BLOCKED',
      auditProof: 'Adapter refuses execution if unauthorized hooks are detected.',
    },
  ],
  cyberDawPresets: [
    {
      id: 'PRESET-VOICE-LIVE',
      name: 'Voice Live',
      purpose: 'High-pass filter (80Hz), light opto-compression, de-esser, safety limiter & noise gate',
      chain: ['High-Pass Filter 80Hz', 'ReaGate (Conservative)', 'ReaComp (2:1 Ratio)', 'ReaXcomp De-Esser', 'Master Safety Limiter -1.0dBFS'],
      bufferSize: 128,
      cpuMode: 'LOW_LATENCY',
      peakSafetyCeilingDbfs: -1.0,
    },
    {
      id: 'PRESET-MUSIC-LIVE',
      name: 'Music Live',
      purpose: 'Low-latency synth & soundtrack playback chain with safety ceiling and no look-ahead',
      chain: ['Stereo Widener', 'Dynamic EQ', 'Fast Brickwall Limiter'],
      bufferSize: 128,
      cpuMode: 'LOW_LATENCY',
      peakSafetyCeilingDbfs: -1.5,
    },
    {
      id: 'PRESET-STREAM-MIX',
      name: 'Stream Mix Master',
      purpose: 'Sidechain music ducking under voice, game audio dynamic ceiling, broadcast master limiter',
      chain: ['Sidechain Ducking Bus (-4dB on voice)', 'Game Audio High-Shelf Trim', 'LUFS Metering (-14 LUFS Target)', 'True Peak Limiter -1.0dBFS'],
      bufferSize: 256,
      cpuMode: 'STREAM_SAFE',
      peakSafetyCeilingDbfs: -1.0,
    },
  ],
  obsSettings: {
    canvas: '1920x1080 (16:9)',
    streamOutput: '1280x720 @ 60fps (or 936x526 for heavy titles)',
    recordingFormat: 'MKV -> Auto-remux to MP4',
    encoder: 'AMD AMF Hardware H.264 / HEVC',
    rateControl: 'CBR',
    bitrateKbps: 6000,
    replayBufferSec: 60,
    audioSampleRateKhz: 48,
  },
  aiClippingPipeline: {
    whisperModel: 'whisper.cpp (base.en / tiny.en)',
    scoringAlgorithm: 'Speech density + audio peak delta + manual replay markers',
    ffmpegAssembly: true,
    manualReviewGate: true,
    outputFolder: 'D:\\Creator\\Montages',
  },
};
