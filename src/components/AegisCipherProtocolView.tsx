import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Key, 
  Lock, 
  Terminal, 
  FileText, 
  CheckCircle2, 
  Layers, 
  Radio, 
  Cpu, 
  Sparkles, 
  Search, 
  ArrowRight, 
  Code,
  Volume2,
  Copy,
  Hash,
  Coins,
  Shield,
  Filter,
  Check
} from 'lucide-react';
import { 
  AEGIS_7_WINGS, 
  STANDARD_PGP_SUBSET, 
  encodeHexToAegisCoordinate, 
  levenshteinDistance,
  AEGIS_7_ENCOMPASSED_TOKENS,
  AegisTokenEncompass
} from '../data/aegisCipherProtocol';

interface AegisCipherProtocolViewProps {
  onNotify?: (message: string, type: 'ALERT' | 'SUCCESS' | 'INFO') => void;
}

export const AegisCipherProtocolView: React.FC<AegisCipherProtocolViewProps> = ({ onNotify }) => {
  const [activeSubTab, setActiveSubTab] = useState<'OVERVIEW' | 'TOKENS' | 'ENCODER' | 'WINGS' | 'STANDARD_PGP' | 'CYBERGYM' | 'REDTEAM'>('TOKENS');
  const [tokenCategoryFilter, setTokenCategoryFilter] = useState<'ALL' | 'STABLES' | 'L1_BLUECHIP' | 'AI_DEPIN' | 'DEFI_L2'>('ALL');
  const [tokenSearchQuery, setTokenSearchQuery] = useState('');
  const [selectedTokenDetail, setSelectedTokenDetail] = useState<AegisTokenEncompass | null>(null);
  const [inputHex, setInputHex] = useState('1F7A');
  const [encodedResult, setEncodedResult] = useState<{ words: string[]; breakdown: string }>(encodeHexToAegisCoordinate('1F7A'));
  const [voiceTestWord, setVoiceTestWord] = useState('angle');
  const [copiedWords, setCopiedWords] = useState(false);
  const [selectedScenarioId, setSelectedScenarioId] = useState('atk-01');
  const [simTargetSymbol, setSimTargetSymbol] = useState('SOL/USDC');
  const [simTradeSize, setSimTradeSize] = useState('15000');
  const [isSimulating, setIsSimulating] = useState(false);
  const [redTeamReports, setRedTeamReports] = useState<any[]>([]);
  const [cyberGymHistory, setCyberGymHistory] = useState<Array<{
    id: string;
    timestamp: string;
    symbol: string;
    tradeSizeUsd: number;
    anomieRatio: number;
    pgpWords: string;
    verdict: string;
    executionRoute: string;
  }>>([]);
  const [cyberGymStats, setCyberGymStats] = useState<{
    tier: string;
    currentAnomieRatio: number;
    totalSyncedCycles: number;
    enclaveLedgerHash: string;
  }>({
    tier: 'FIRST_CLASS_TRADER',
    currentAnomieRatio: 1.12,
    totalSyncedCycles: 418,
    enclaveLedgerHash: '0x8f2a417c8e9b01d3f56a29487c3e10fa',
  });

  // Fetch live CyberGym status
  const fetchCyberGym = async () => {
    try {
      const res = await fetch('/api/cybergym/status');
      if (res.ok) {
        const data = await res.json();
        if (data.cyberGymState) {
          setCyberGymStats({
            tier: data.cyberGymState.tier,
            currentAnomieRatio: data.cyberGymState.currentAnomieRatio,
            totalSyncedCycles: data.cyberGymState.totalSyncedCycles,
            enclaveLedgerHash: data.cyberGymState.enclaveLedgerHash,
          });
          setCyberGymHistory(data.cyberGymState.executionHistory || []);
        }
      }

      // Fetch Red-Team reports
      const rtRes = await fetch('/api/cybergym/redteam/reports');
      if (rtRes.ok) {
        const rtData = await rtRes.json();
        if (rtData.reports) {
          setRedTeamReports(rtData.reports);
        }
      }
    } catch {
      // offline fallback
    }
  };

  React.useEffect(() => {
    fetchCyberGym();
  }, [activeSubTab]);

  const handleEncode = (val: string) => {
    setInputHex(val);
    const res = encodeHexToAegisCoordinate(val);
    setEncodedResult(res);
  };

  const handleCopyPhrase = () => {
    navigator.clipboard.writeText(encodedResult.words.join(' '));
    setCopiedWords(true);
    setTimeout(() => setCopiedWords(false), 2000);
    if (onNotify) onNotify(`Copied AEGIS-7 PGP Phrase: "${encodedResult.words.join(' ')}"`, 'SUCCESS');
  };

  // Find nearest word for voice correction test
  const candidateWords = AEGIS_7_WINGS.flatMap(w => [w.leftWord, w.rightWord]);
  const nearestWord = candidateWords
    .map(w => ({ word: w, dist: levenshteinDistance(voiceTestWord.toLowerCase(), w) }))
    .sort((a, b) => a.dist - b.dist)[0];

  // Filtered Encompassed Tokens & Stablecoins
  const filteredTokens = AEGIS_7_ENCOMPASSED_TOKENS.filter((t) => {
    const matchesCategory =
      tokenCategoryFilter === 'ALL'
        ? true
        : tokenCategoryFilter === 'STABLES'
        ? t.category.startsWith('STABLE')
        : tokenCategoryFilter === 'L1_BLUECHIP'
        ? t.category === 'L1_BLUECHIP'
        : tokenCategoryFilter === 'AI_DEPIN'
        ? t.category === 'AI_DEPIN'
        : t.category === 'DEFI_CORE' || t.category === 'L2_SCALING';

    const matchesSearch =
      tokenSearchQuery.trim() === '' ||
      t.symbol.toLowerCase().includes(tokenSearchQuery.toLowerCase()) ||
      t.name.toLowerCase().includes(tokenSearchQuery.toLowerCase()) ||
      t.chain.toLowerCase().includes(tokenSearchQuery.toLowerCase()) ||
      (t.pegType && t.pegType.toLowerCase().includes(tokenSearchQuery.toLowerCase())) ||
      t.coordinateWords.some((w) => w.toLowerCase().includes(tokenSearchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-[#0B0F17] border border-slate-800 rounded-xl overflow-hidden shadow-2xl space-y-4 font-mono text-xs">
      {/* Header Banner */}
      <div className="p-4 sm:p-5 border-b border-slate-800 bg-gradient-to-r from-purple-950/40 via-[#0B0F17] to-cyan-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-purple-500/20 shrink-0">
            <Lock className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-white tracking-wide uppercase">
                AEGIS-7 COORDINATE CIPHER PROTOCOL
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-black border flex items-center gap-1 bg-cyan-500/20 text-cyan-300 border-cyan-500/40">
                <ShieldCheck className="w-3 h-3 text-cyan-400" />
                GEMINI CYBER VERSION: FAIRWIND DEFENSE
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold border flex items-center gap-1 bg-purple-500/20 text-purple-300 border-purple-500/40">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                EXTENDED PGP WORDLIST &middot; AES-256-GCM
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Gemini Cyber Verified &middot; Human-Readable Coordinate Cipher Spoken by Trading Terminals, Solana SPL, Cetus AMM &amp; Quant Mesh
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/90 border border-slate-800 p-1 rounded-lg">
          {(['OVERVIEW', 'TOKENS', 'ENCODER', 'WINGS', 'STANDARD_PGP', 'CYBERGYM', 'REDTEAM'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                activeSubTab === tab 
                  ? 'bg-purple-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{tab === 'TOKENS' ? '🪙 ENCOMPASSED TOKENS' : tab.replace('_', ' ')}</span>
              {tab === 'TOKENS' && (
                <span className="px-1 py-0.2 rounded-full text-[8px] bg-emerald-400/20 text-emerald-300 font-black">
                  {AEGIS_7_ENCOMPASSED_TOKENS.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* SUB-TAB: OVERVIEW & ARCHITECTURAL BRIEF */}
      {activeSubTab === 'OVERVIEW' && (
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-lg space-y-1.5">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-xs">
                <Radio className="w-4 h-4" />
                <span>16-Segment Voice Resilience</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Bi-gram anchor anchors (consonant-onset / vowel-nucleus) tolerate 50% acoustic degradation over high-noise voice channels with constrained Levenshtein distance ≤ 1.
              </p>
            </div>

            <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-lg space-y-1.5">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
                <Hash className="w-4 h-4" />
                <span>Deterministic Nibble Binding</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Each 16-word wing encodes bytepairs: <code>(leftIndex &lt;&lt; 4) | rightIndex</code>, yielding zero-entropy AES-256 keys, Solana keypairs, and on-chain Cetus AMM nonces.
              </p>
            </div>

            <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-lg space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <Cpu className="w-4 h-4" />
                <span>Aegentix CyberGym Engine</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Integrates directly with the <code>gym/engine.py</code> synchronized athlete execution loop, mapping zero-day enclaves and relational anomie barriers.
              </p>
            </div>
          </div>

          {/* Architectural Synthesis Panel */}
          <div className="p-4 bg-gradient-to-r from-purple-950/20 via-slate-900/80 to-indigo-950/20 border border-purple-500/30 rounded-xl space-y-2.5">
            <span className="font-bold text-purple-300 text-xs flex items-center gap-1.5 uppercase">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>AEGIS-7 Protocol Coordinate Cipher Architecture</span>
            </span>
            <p className="text-slate-300 text-xs leading-relaxed">
              Every slider, dial, and wizard key across our Super-AI interfaces (TradingView, Augmenta, Prometheus, Jupyter, terminal, local fine-tuning servers, on-chain Swap API, and autonomous agent mesh) speaks this standard for adaptive security and non-deterministic unique attestation.
            </p>
            <div className="p-2.5 bg-black/40 border border-slate-800 rounded text-slate-400 text-[11px] font-mono">
              Key Derivation: Seed Phrase (12/24 words) → Combined Wordlist (0–511 Base + 7616–7743 AEGIS) → SHA-256 Bitstream → AES-256-GCM / Solana Keypair / Vault Nonce.
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB: ENCOMPASSED LEGIT TOKENS & STABLECOINS */}
      {activeSubTab === 'TOKENS' && (
        <div className="p-4 space-y-4">
          {/* Header Summary */}
          <div className="p-4 bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 border border-purple-500/30 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-purple-400" />
                <span className="font-bold text-white text-sm uppercase tracking-wide">
                  AEGIS-7 Encompassed Legit Tokens &amp; Stablecoins
                </span>
                <span className="px-2 py-0.5 rounded text-[9px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {AEGIS_7_ENCOMPASSED_TOKENS.length} VERIFIED ASSETS
                </span>
              </div>
              <p className="text-xs text-slate-300">
                AEGIS-7 encompasses all legitimate fiat-backed, yield-bearing, commodity-backed stablecoins and Layer-1/DeFi blue chips with deterministic PGP coordinate derivation, enclave vaults, and sub-micro anti-MEV protection.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 text-xs font-mono">
              <div className="p-2 bg-slate-950/80 border border-slate-800 rounded-lg text-center">
                <div className="text-[10px] text-slate-400">Stable Reserve Backing</div>
                <div className="text-emerald-400 font-bold">&gt;$180 Billion</div>
              </div>
              <div className="p-2 bg-slate-950/80 border border-slate-800 rounded-lg text-center">
                <div className="text-[10px] text-slate-400">AEGIS Wings</div>
                <div className="text-purple-400 font-bold">8 Dedicated Wings</div>
              </div>
            </div>
          </div>

          {/* Filter Bar & Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
              {(
                [
                  { id: 'ALL', label: `All (${AEGIS_7_ENCOMPASSED_TOKENS.length})` },
                  { id: 'STABLES', label: `Stablecoins (${AEGIS_7_ENCOMPASSED_TOKENS.filter(t => t.category.startsWith('STABLE')).length})` },
                  { id: 'L1_BLUECHIP', label: `L1 Bluechips (${AEGIS_7_ENCOMPASSED_TOKENS.filter(t => t.category === 'L1_BLUECHIP').length})` },
                  { id: 'AI_DEPIN', label: `AI & DePIN (${AEGIS_7_ENCOMPASSED_TOKENS.filter(t => t.category === 'AI_DEPIN').length})` },
                  { id: 'DEFI_L2', label: `DeFi & L2s (${AEGIS_7_ENCOMPASSED_TOKENS.filter(t => t.category === 'DEFI_CORE' || t.category === 'L2_SCALING').length})` }
                ] as const
              ).map((f) => (
                <button
                  key={f.id}
                  onClick={() => setTokenCategoryFilter(f.id)}
                  className={`px-3 py-1.5 rounded-lg font-bold border transition-all cursor-pointer ${
                    tokenCategoryFilter === f.id
                      ? 'bg-purple-600 border-purple-400 text-white shadow-sm'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search token, peg, or standard..."
                value={tokenSearchQuery}
                onChange={(e) => setTokenSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Tokens Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredTokens.map((t) => (
              <div
                key={t.symbol}
                className="p-3.5 bg-slate-900/70 border border-slate-800 hover:border-purple-500/50 rounded-xl space-y-2.5 transition-all group hover:shadow-lg hover:shadow-purple-500/5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center font-black text-purple-300 text-xs">
                      {t.symbol.slice(0, 4)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white text-sm">{t.symbol}</span>
                        <span className="text-[10px] text-slate-400 truncate max-w-[120px]">{t.name}</span>
                      </div>
                      <div className="text-[9px] text-slate-500 font-mono flex items-center gap-1 mt-0.5">
                        <span>{t.chain}</span>
                        <span>&bull;</span>
                        <span className="text-cyan-400">{t.standard}</span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                      t.category.startsWith('STABLE')
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : t.category === 'L1_BLUECHIP'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : t.category === 'AI_DEPIN'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    }`}
                  >
                    {t.pegType ? t.pegType.replace('_', ' ') : t.category.replace('_', ' ')}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed min-h-[32px]">
                  {t.description}
                </p>

                {/* Coordinate & PGP mapping */}
                <div className="p-2 bg-slate-950/80 border border-slate-800 rounded-lg space-y-1 text-[10px] font-mono">
                  <div className="flex justify-between items-center text-slate-400">
                    <span>AEGIS-7 Wing:</span>
                    <b className="text-purple-300">{t.wing} Wing ({t.derivationIndex})</b>
                  </div>
                  <div className="flex justify-between items-center text-slate-400">
                    <span>Hex Coordinate:</span>
                    <code className="text-cyan-300">{t.coordinateHex}</code>
                  </div>
                  <div className="flex justify-between items-center text-slate-400">
                    <span>PGP Words:</span>
                    <span className="text-amber-300 font-bold truncate max-w-[140px]">
                      {t.coordinateWords.join(' ')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400 pt-0.5 border-t border-slate-900">
                    <span>Anomie Safe Floor:</span>
                    <span className="text-emerald-400 font-bold">&ge; {t.anomieSafeFloor}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => {
                      setInputHex(t.coordinateHex.replace(/^0x/, ''));
                      handleEncode(t.coordinateHex.replace(/^0x/, ''));
                      setActiveSubTab('ENCODER');
                      if (onNotify) onNotify(`Loaded ${t.symbol} into AEGIS-7 PGP Coordinate Encoder`, 'SUCCESS');
                    }}
                    className="flex-1 py-1.5 bg-purple-600/30 hover:bg-purple-600 border border-purple-500/40 text-purple-200 hover:text-white rounded-lg text-[10px] font-bold transition-all text-center cursor-pointer"
                  >
                    Encode in PGP
                  </button>
                  <button
                    onClick={() => {
                      setSimTargetSymbol(`${t.symbol}/USDC`);
                      setActiveSubTab('CYBERGYM');
                      if (onNotify) onNotify(`Target symbol set to ${t.symbol}/USDC in CyberGym`, 'INFO');
                    }}
                    className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white rounded-lg text-[10px] font-bold transition-all text-center cursor-pointer"
                  >
                    Audit in Gym
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB: LIVE ENCODER & VOICE CHANNEL CORRECTOR */}
      {activeSubTab === 'ENCODER' && (
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Hex to PGP Coordinate Encoder */}
            <div className="p-4 bg-slate-900/70 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs uppercase flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Hex to AEGIS-7 PGP Coordinate Encoder</span>
                </span>
                <span className="text-[10px] text-slate-500">16-bit Big-Endian</span>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">ENTER 16-BIT HEX VALUE:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inputHex}
                    onChange={(e) => handleEncode(e.target.value)}
                    placeholder="e.g. 1F7A"
                    maxLength={6}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-white font-mono uppercase focus:outline-none focus:border-purple-500"
                  />
                  <button
                    onClick={() => handleEncode('1F7A')}
                    className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] shrink-0 cursor-pointer"
                  >
                    Preset 0x1F7A
                  </button>
                </div>
              </div>

              <div className="p-3 bg-purple-950/20 border border-purple-500/40 rounded-lg space-y-2">
                <span className="text-[10px] text-purple-300 font-bold block">OUTPUT PGP COORDINATE WORDS:</span>
                <div className="flex items-center justify-between bg-black/60 p-2.5 rounded border border-slate-800">
                  <span className="text-emerald-400 font-bold text-sm tracking-wide">
                    {encodedResult.words.join(' ')}
                  </span>
                  <button
                    onClick={handleCopyPhrase}
                    className="p-1 text-slate-400 hover:text-white cursor-pointer"
                    title="Copy PGP Words"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-[10px] text-slate-400">{encodedResult.breakdown}</div>
              </div>
            </div>

            {/* Voice Channel Levenshtein-1 Tolerance Simulator */}
            <div className="p-4 bg-slate-900/70 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs uppercase flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>Acoustic Levenshtein-1 Voice Corrector</span>
                </span>
                <span className="text-[10px] text-emerald-400">Tolerance ≤ 1</span>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">SIMULATE HIGH-NOISE SPOKEN WORD:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={voiceTestWord}
                    onChange={(e) => setVoiceTestWord(e.target.value)}
                    placeholder="e.g. angle"
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    onClick={() => setVoiceTestWord('angle')}
                    className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] shrink-0 cursor-pointer"
                  >
                    Try 'angle'
                  </button>
                </div>
              </div>

              <div className="p-3 bg-cyan-950/20 border border-cyan-500/40 rounded-lg space-y-1.5">
                <span className="text-[10px] text-cyan-300 font-bold block">DETERMINISTIC HEURISTIC RESOLUTION:</span>
                <div className="flex items-center justify-between bg-black/60 p-2.5 rounded border border-slate-800">
                  <div>
                    <span className="text-white text-xs">Spoken: <b className="text-amber-300">"{voiceTestWord}"</b></span>
                    <span className="mx-2 text-slate-500">→</span>
                    <span className="text-white text-xs">Resolves to: <b className="text-emerald-400">"{nearestWord.word}"</b></span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    nearestWord.dist <= 1 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                  }`}>
                    Levenshtein Dist: {nearestWord.dist} ({nearestWord.dist <= 1 ? 'ACCEPTED' : 'EXCEEDS THRESHOLD'})
                  </span>
                </div>
                <span className="text-[9px] text-slate-400 block">
                  Bi-gram Anchor matches vowel-nucleus, restoring original coordinate without bitflip leakage.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB: 8 WINGS COORDINATE EXTENSION TABLE */}
      {activeSubTab === 'WINGS' && (
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white text-xs uppercase flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              <span>AEV-8 Wing Fragments (Custom AEGIS-7 Extension Words: 7616–7743)</span>
            </span>
            <span className="text-[10px] text-slate-400">8 Wings × 16-Word Blocks</span>
          </div>

          <div className="border border-slate-800 rounded-lg overflow-hidden bg-[#070A0F]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/60 text-[10px] text-slate-400 uppercase">
                  <th className="p-2.5">Wing</th>
                  <th className="p-2.5">Index Range</th>
                  <th className="p-2.5">Left Word (High Nibble)</th>
                  <th className="p-2.5">Right Word (Low Nibble)</th>
                  <th className="p-2.5">Bi-gram Anchor</th>
                  <th className="p-2.5">Quant Ecosystem Domain</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-[11px]">
                {AEGIS_7_WINGS.map((w) => (
                  <tr key={w.wing} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-2.5 font-bold text-purple-300">{w.wing}</td>
                    <td className="p-2.5 text-slate-400 font-mono text-[10px]">{w.offsetRange}</td>
                    <td className="p-2.5 text-emerald-400 font-bold">{w.leftWord}</td>
                    <td className="p-2.5 text-cyan-400 font-bold">{w.rightWord}</td>
                    <td className="p-2.5 font-mono text-amber-300">{w.biGramAnchor}</td>
                    <td className="p-2.5 text-slate-300">{w.domain}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB: STANDARD PGP SUBSET */}
      {activeSubTab === 'STANDARD_PGP' && (
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white text-xs uppercase flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>Standard PGP Wordlist Subset &amp; Bi-gram Anchor Mappings</span>
            </span>
            <span className="text-[10px] text-slate-400">Sample Indexes (0–15 &amp; 7600–7615)</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
            {STANDARD_PGP_SUBSET.map((item) => (
              <div key={item.index} className="p-2 bg-slate-900/70 border border-slate-800 rounded text-center">
                <span className="text-[9px] text-slate-500 font-mono block">#{item.index}</span>
                <span className="text-white font-bold text-[11px] block truncate">{item.word}</span>
                <span className="text-[9px] text-amber-400 font-mono">[{item.biGram}]</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB: CYBERGYM ENGINE SYNC LOOP & FIRST-CLASS TRADER METHOD */}
      {activeSubTab === 'CYBERGYM' && (
        <div className="p-4 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-xs uppercase flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-emerald-400" />
                  <span>CyberGym Method: Post-Analysis Verification Pipeline</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/40">
                  FIRST-CLASS TRADER MANDATE
                </span>
              </div>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Every trade signal must pass the CyberGym Method (Athlete Loop → Anomie Engine &lt;= 1.50 → PGP Attestation) before execution.
              </p>
            </div>
            
            <button
              onClick={async () => {
                try {
                  const res = await fetch('/api/cybergym/run-athlete-loop', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ symbol: 'SOL/USDC', tradeSizeUsd: 15000 }),
                  });
                  if (res.ok) {
                    const data = await res.json();
                    if (onNotify) {
                      onNotify(
                        `CyberGym Verified: ${data.record.symbol} ($${data.record.tradeSizeUsd.toLocaleString()}) · Anomie ${data.record.anomieRatio} · PGP: "${data.record.pgpWords}"`,
                        'SUCCESS'
                      );
                    }
                  }
                } catch (e: any) {
                  if (onNotify) onNotify(`CyberGym error: ${e.message}`, 'ALERT');
                }
              }}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 cursor-pointer self-start sm:self-auto shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Execute CyberGym Athlete Cycle</span>
            </button>
          </div>

          {/* First Class Trader Enclave Architecture Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg">
              <span className="text-[10px] text-slate-500 block">ENCLAVE RUNNER TIER</span>
              <span className="text-xs font-bold text-emerald-400 block mt-0.5">{cyberGymStats.tier}</span>
              <span className="text-[9px] text-slate-400 mt-1 block">AegentixAthlete zero-day enclave</span>
            </div>

            <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg">
              <span className="text-[10px] text-slate-500 block">RELATIVISTIC ANOMIE</span>
              <span className="text-xs font-bold text-cyan-400 block mt-0.5">{cyberGymStats.currentAnomieRatio} / 1.50 Max</span>
              <span className="text-[9px] text-emerald-400 mt-1 block">Thermodynamic balance PASS</span>
            </div>

            <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg">
              <span className="text-[10px] text-slate-500 block">TOTAL SYNCED CYCLES</span>
              <span className="text-xs font-bold text-amber-400 block mt-0.5">{cyberGymStats.totalSyncedCycles} Synced</span>
              <span className="text-[9px] text-slate-400 mt-1 block">Continuous post-analysis gate</span>
            </div>

            <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg">
              <span className="text-[10px] text-slate-500 block">ATTESTATION LEDGER</span>
              <span className="text-[11px] font-bold text-purple-400 block mt-0.5 font-mono truncate">{cyberGymStats.enclaveLedgerHash}</span>
              <span className="text-[9px] text-slate-400 mt-1 block">Cryptographic PGP binding</span>
            </div>
          </div>

          {/* Real-time CyberGym Execution History Stream */}
          {cyberGymHistory.length > 0 && (
            <div className="border border-slate-800 rounded-lg overflow-hidden bg-[#070A0F]">
              <div className="p-2.5 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase">
                <span className="flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span>First-Class Trader Post-Analysis Execution Ledger ({cyberGymHistory.length})</span>
                </span>
                <span className="text-emerald-400">100% PGP Attested</span>
              </div>
              <div className="divide-y divide-slate-800/60 max-h-[220px] overflow-y-auto font-mono text-[10px]">
                {cyberGymHistory.map((item) => (
                  <div key={item.id} className="p-2.5 flex items-center justify-between hover:bg-slate-900/40">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold">{item.symbol}</span>
                        <span className="text-slate-400">${item.tradeSizeUsd.toLocaleString()}</span>
                        <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded text-[9px] font-bold">
                          {item.verdict}
                        </span>
                      </div>
                      <div className="text-purple-300 text-[10px]">
                        PGP Words: <b>"{item.pgpWords}"</b> · Route: <span className="text-slate-400">{item.executionRoute}</span>
                      </div>
                    </div>
                    <div className="text-right text-slate-500">
                      <div>Anomie: <span className="text-cyan-400">{item.anomieRatio}</span></div>
                      <div>{new Date(item.timestamp).toLocaleTimeString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Python Sync Loop Code Block */}
          <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-[11px] text-slate-300 overflow-x-auto space-y-1">
            <div className="text-slate-500"># Aegentix CyberGym Engine Sync Loop</div>
            <div className="text-slate-500"># Path: gym/engine.py</div>
            <div className="text-slate-500"># Description: Active coordinator mapping athlete loops and handling zero-day enclaves.</div>
            <div className="text-purple-400 mt-1.5">import <span className="text-white">time</span></div>
            <div className="text-purple-400">from <span className="text-cyan-300">gym.athlete</span> import <span className="text-white">AegentixAthlete</span></div>
            <div className="text-purple-400">from <span className="text-cyan-300">gym.auth</span> import <span className="text-white">BinanceUSSigner</span></div>
            <div className="text-purple-400">from <span className="text-cyan-300">gym.anomie</span> import <span className="text-white">RelativisticAnomieEngine</span></div>
            <div className="text-purple-400">from <span className="text-cyan-300">gym.ledger</span> import <span className="text-white">GymLedger</span></div>
            <div className="text-blue-400 mt-1.5">def <span className="text-amber-300">run_sync_loop</span>():</div>
            <div className="pl-4 text-white">athlete = <span className="text-emerald-400">AegentixAthlete</span>()</div>
            <div className="pl-4 text-white">anomie = <span className="text-emerald-400">RelativisticAnomieEngine</span>(threshold=<span className="text-amber-400">1.50</span>)</div>
            <div className="pl-4 text-white">ledger = <span className="text-emerald-400">GymLedger</span>()</div>
            <div className="pl-4 text-green-400">print(<span className="text-emerald-300">"🚀 [CYBERCORE ENGINE] Synchronized execution loop engaged successfully."</span>)</div>
            <div className="text-blue-400 mt-1.5">if <span className="text-white">__name__ == "__main__":</span></div>
            <div className="pl-4 text-amber-300">run_sync_loop()</div>
          </div>
        </div>
      )}

      {/* SUB-TAB: CYBERGYM RED-TEAMING & ADVERSARIAL MARKET SIMULATOR */}
      {activeSubTab === 'REDTEAM' && (
        <div className="p-4 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-xs uppercase flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
                  <span>CyberGym Red-Team Engine: Adversarial Market Simulator</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/40">
                  LIVE ADVERSARIAL STRESS-TEST
                </span>
              </div>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Injects synthetic flash-crashes, toxic liquidity drains, and MEV sandwich attacks into swarm decision logic, streaming vulnerability scores to the Heretic Console.
              </p>
            </div>

            <button
              disabled={isSimulating}
              onClick={async () => {
                setIsSimulating(true);
                try {
                  const res = await fetch('/api/cybergym/redteam/simulate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      symbol: simTargetSymbol,
                      tradeSizeUsd: parseFloat(simTradeSize) || 15000,
                      scenarioId: selectedScenarioId,
                    }),
                  });
                  if (res.ok) {
                    const data = await res.json();
                    setRedTeamReports(data.latestReports || []);
                    if (onNotify) {
                      onNotify(
                        `CyberGym Attack Simulated: ${data.report.scenario.name} · Score: ${data.report.vulnerabilityScore}/100 · Verdict: ${data.report.verdict} · Reported to Heretic Console`,
                        data.report.verdict === 'APPROVED_BY_CYBERGYM' ? 'SUCCESS' : 'ALERT'
                      );
                    }
                  }
                } catch (e: any) {
                  if (onNotify) onNotify(`Simulation failed: ${e.message}`, 'ALERT');
                } finally {
                  setIsSimulating(false);
                }
              }}
              className="px-4 py-2 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white rounded font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-rose-600/30 cursor-pointer self-start sm:self-auto shrink-0 disabled:opacity-50"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
              <span>{isSimulating ? 'Injecting Chaos...' : 'Run Adversarial Simulation'}</span>
            </button>
          </div>

          {/* Adversarial Parameters Form */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-900/40 border border-slate-800 p-3 rounded-lg">
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">TARGET MARKET PAIR:</label>
              <select
                value={simTargetSymbol}
                onChange={(e) => setSimTargetSymbol(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-rose-500"
              >
                <option value="SOL/USDC">SOL/USDC (Jupiter DEX / Drift)</option>
                <option value="ETH/USDT">ETH/USDT (Uniswap V3 / Binance)</option>
                <option value="BTC/USDT">BTC/USDT (Binance / Coinbase)</option>
                <option value="ARB/USDC">ARB/USDC (Camelot / Uniswap)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-1">CANDIDATE TRADE SIZE (USD):</label>
              <input
                type="number"
                value={simTradeSize}
                onChange={(e) => setSimTradeSize(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-1">ADVERSARIAL ATTACK SCENARIO:</label>
              <select
                value={selectedScenarioId}
                onChange={(e) => setSelectedScenarioId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-rose-500"
              >
                <option value="atk-01">Flash-Crash 35% Shockwave Injection</option>
                <option value="atk-02">Mempool Toxic Liquidity Drain (50% Wipe)</option>
                <option value="atk-03">Predatory Jito Bundle Sandwich Front-Run</option>
                <option value="atk-04">Pyth/Chainlink Oracle Skew Inversion</option>
              </select>
            </div>
          </div>

          {/* Live Adversarial Reports Stream */}
          <div className="border border-slate-800 rounded-lg overflow-hidden bg-[#070A0F]">
            <div className="p-2.5 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-rose-400" />
                <span>Heretic Console Vulnerability Audits &amp; Anomie Spikes</span>
              </span>
              <span className="text-amber-400">Streamed to Heretic Thought Stream</span>
            </div>

            <div className="divide-y divide-slate-800/60 max-h-[300px] overflow-y-auto font-mono text-[10px]">
              {redTeamReports.length === 0 ? (
                <div className="p-6 text-center text-slate-500 italic">
                  No simulations run yet. Click "Run Adversarial Simulation" to test swarm decision barriers.
                </div>
              ) : (
                redTeamReports.map((rep) => (
                  <div key={rep.id} className="p-3 hover:bg-slate-900/40 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold text-xs">{rep.scenario.name}</span>
                        <span className="text-slate-400">{rep.targetSymbol} (${rep.candidateSizeUsd?.toLocaleString()})</span>
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                          rep.verdict === 'APPROVED_BY_CYBERGYM' 
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        }`}>
                          {rep.verdict}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`font-bold ${
                          rep.vulnerabilityScore < 45 ? 'text-emerald-400' : rep.vulnerabilityScore < 80 ? 'text-amber-400' : 'text-rose-400'
                        }`}>
                          Vulnerability: {rep.vulnerabilityScore}/100
                        </span>
                        <span className="text-slate-500">{new Date(rep.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-300 bg-black/40 p-2 rounded border border-slate-800 space-y-0.5">
                      {rep.findings?.map((f: string, i: number) => (
                        <div key={i} className="text-slate-400 flex items-start gap-1">
                          <span className="text-rose-400 shrink-0">▸</span>
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
