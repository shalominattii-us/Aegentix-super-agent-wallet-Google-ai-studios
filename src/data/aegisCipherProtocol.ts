export interface AegisWing {
  wing: 'Alpha' | 'Bravo' | 'Charlie' | 'Delta' | 'Echo' | 'Foxtrot' | 'Golf' | 'Hotel';
  offsetRange: string;
  leftWord: string;
  rightWord: string;
  biGramAnchor: string;
  domain: string;
}

export const AEGIS_7_WINGS: AegisWing[] = [
  { wing: 'Alpha', offsetRange: '0–15 (7616–7631)', leftWord: 'angel', rightWord: 'anchor', biGramAnchor: 'an', domain: 'Sovereign Genesis & Inception' },
  { wing: 'Bravo', offsetRange: '16–31 (7632–7647)', leftWord: 'bullion', rightWord: 'beacon', biGramAnchor: 'be', domain: 'Balance & Bullion Reserves' },
  { wing: 'Charlie', offsetRange: '32–47 (7648–7663)', leftWord: 'cipher', rightWord: 'coinage', biGramAnchor: 'ci', domain: 'Cipher & Crypto Nonces' },
  { wing: 'Delta', offsetRange: '48–63 (7664–7679)', leftWord: 'datum', rightWord: 'dividend', biGramAnchor: 'da', domain: 'Data Feeds & Arb Dividends' },
  { wing: 'Echo', offsetRange: '64–79 (7680–7695)', leftWord: 'epoch', rightWord: 'equinox', biGramAnchor: 'ep', domain: 'Epoch Clock & Synchrony' },
  { wing: 'Foxtrot', offsetRange: '80–95 (7696–7711)', leftWord: 'forge', rightWord: 'frontier', biGramAnchor: 'fo', domain: 'Forge & Execution Routing' },
  { wing: 'Golf', offsetRange: '96–111 (7712–7727)', leftWord: 'grid', rightWord: 'gantry', biGramAnchor: 'gr', domain: 'Grid Liquidity & AMM Bands' },
  { wing: 'Hotel', offsetRange: '112–127 (7728–7743)', leftWord: 'hedge', rightWord: 'horizon', biGramAnchor: 'he', domain: 'Hedge & Delta Neutrality' },
];

export const STANDARD_PGP_SUBSET: Array<{ index: number; word: string; biGram: string }> = [
  { index: 0, word: 'aardvark', biGram: 'ar' },
  { index: 1, word: 'absinthe', biGram: 'ab' },
  { index: 2, word: 'acne', biGram: 'ac' },
  { index: 3, word: 'admiral', biGram: 'ad' },
  { index: 4, word: 'adobe', biGram: 'ad' },
  { index: 5, word: 'affirmative', biGram: 'af' },
  { index: 6, word: 'agate', biGram: 'ag' },
  { index: 7, word: 'agora', biGram: 'ag' },
  { index: 8, word: 'albatross', biGram: 'al' },
  { index: 9, word: 'algorithm', biGram: 'al' },
  { index: 10, word: 'alpine', biGram: 'al' },
  { index: 11, word: 'amazon', biGram: 'am' },
  { index: 12, word: 'amber', biGram: 'am' },
  { index: 13, word: 'ambulance', biGram: 'am' },
  { index: 14, word: 'amoeba', biGram: 'am' },
  { index: 15, word: 'ampersand', biGram: 'am' },
  { index: 7600, word: 'zither', biGram: 'zi' },
  { index: 7601, word: 'zombify', biGram: 'zo' },
  { index: 7602, word: 'zygote', biGram: 'zy' },
  { index: 7603, word: 'zymurgy', biGram: 'zy' },
  { index: 7604, word: 'zephyr', biGram: 'ze' },
  { index: 7605, word: 'zenith', biGram: 'ze' },
  { index: 7606, word: 'zodiac', biGram: 'zo' },
  { index: 7607, word: 'zeppelin', biGram: 'ze' },
  { index: 7608, word: 'zombie', biGram: 'zo' },
  { index: 7609, word: 'zymotic', biGram: 'zy' },
  { index: 7610, word: 'zinc', biGram: 'zi' },
  { index: 7611, word: 'zillion', biGram: 'zi' },
  { index: 7612, word: 'zip', biGram: 'zi' },
  { index: 7613, word: 'zebra', biGram: 'ze' },
  { index: 7614, word: 'zonked', biGram: 'zo' },
  { index: 7615, word: 'zoomorphism', biGram: 'zo' },
];

// Levenshtein distance helper
export function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

// Encode 16-bit hex into 2 AEGIS-7 PGP coordinate words
export function encodeHexToAegisCoordinate(hexStr: string): { words: string[]; breakdown: string } {
  const cleanHex = hexStr.replace(/^0x/i, '').padStart(4, '0').slice(-4);
  const highByte = parseInt(cleanHex.slice(0, 2), 16) || 0;
  const lowByte = parseInt(cleanHex.slice(2, 4), 16) || 0;

  const leftNibble1 = (highByte >> 4) & 0x0F;
  const rightNibble1 = highByte & 0x0F;
  const leftNibble2 = (lowByte >> 4) & 0x0F;
  const rightNibble2 = lowByte & 0x0F;

  const wing1 = AEGIS_7_WINGS[leftNibble1 % AEGIS_7_WINGS.length];
  const wing2 = AEGIS_7_WINGS[leftNibble2 % AEGIS_7_WINGS.length];

  const word1 = rightNibble1 % 2 === 0 ? wing1.leftWord : wing1.rightWord;
  const word2 = rightNibble2 % 2 === 0 ? wing2.leftWord : wing2.rightWord;

  return {
    words: [wing1.leftWord, wing1.rightWord, wing2.leftWord, wing2.rightWord],
    breakdown: `Hex 0x${cleanHex} → High Byte 0x${cleanHex.slice(0, 2)} (${wing1.wing} Wing), Low Byte 0x${cleanHex.slice(2, 4)} (${wing2.wing} Wing)`,
  };
}

export interface AegisTokenEncompass {
  symbol: string;
  name: string;
  category: 'STABLE_USD' | 'STABLE_YIELD' | 'STABLE_FIAT' | 'STABLE_COMMODITY' | 'L1_BLUECHIP' | 'L2_SCALING' | 'DEFI_CORE' | 'AI_DEPIN';
  chain: string;
  standard: 'ERC-20' | 'SPL' | 'BEP-20' | 'NATIVE' | 'TSL-ZKP';
  pegType?: 'USD_FIAT' | 'USD_YIELD' | 'EUR_FIAT' | 'SGD_FIAT' | 'JPY_FIAT' | 'GOLD_PHYSICAL' | 'CRYPTO_BACKED';
  wing: 'Alpha' | 'Bravo' | 'Charlie' | 'Delta' | 'Echo' | 'Foxtrot' | 'Golf' | 'Hotel';
  derivationIndex: number;
  coordinateHex: string;
  coordinateWords: string[];
  anomieSafeFloor: number;
  mevProtectionTier: 'TIER-1 ENCLAVE' | 'TIER-2 ZERO-MEMPOOL' | 'TIER-3 MPC-COORDINATE';
  description: string;
}

export const AEGIS_7_ENCOMPASSED_TOKENS: AegisTokenEncompass[] = [
  // --- 1. LEGIT USD STABLECOINS (FIAT & TREASURY BACKED) ---
  {
    symbol: 'USDC',
    name: 'USD Coin',
    category: 'STABLE_USD',
    chain: 'Multi-Chain (Ethereum, Solana, Arbitrum, Base)',
    standard: 'ERC-20',
    pegType: 'USD_FIAT',
    wing: 'Alpha',
    derivationIndex: 7616,
    coordinateHex: '0x1A01',
    coordinateWords: ['angel', 'anchor', 'angel', 'anchor'],
    anomieSafeFloor: 0.9995,
    mevProtectionTier: 'TIER-1 ENCLAVE',
    description: '100% backed by cash and short-dated US Treasuries with monthly public attestations (Circle/Coinbase).'
  },
  {
    symbol: 'USDT',
    name: 'Tether USD',
    category: 'STABLE_USD',
    chain: 'Multi-Chain (Tron, Ethereum, Solana, Avalanche)',
    standard: 'ERC-20',
    pegType: 'USD_FIAT',
    wing: 'Bravo',
    derivationIndex: 7632,
    coordinateHex: '0x2B10',
    coordinateWords: ['bullion', 'beacon', 'bullion', 'beacon'],
    anomieSafeFloor: 0.9985,
    mevProtectionTier: 'TIER-1 ENCLAVE',
    description: 'The global liquidity standard for stable dollar value transfer with multi-billion reserve backing.'
  },
  {
    symbol: 'USDS',
    name: 'Sky Dollar (fka DAI)',
    category: 'STABLE_USD',
    chain: 'Ethereum / Arbitrum',
    standard: 'ERC-20',
    pegType: 'USD_FIAT',
    wing: 'Delta',
    derivationIndex: 7664,
    coordinateHex: '0x4D20',
    coordinateWords: ['datum', 'dividend', 'datum', 'dividend'],
    anomieSafeFloor: 0.9990,
    mevProtectionTier: 'TIER-1 ENCLAVE',
    description: 'Decentralized multi-collateral stablecoin governed by Sky (formerly MakerDAO) with native savings rate.'
  },
  {
    symbol: 'PYUSD',
    name: 'PayPal USD',
    category: 'STABLE_USD',
    chain: 'Ethereum / Solana',
    standard: 'SPL',
    pegType: 'USD_FIAT',
    wing: 'Alpha',
    derivationIndex: 7618,
    coordinateHex: '0x1A03',
    coordinateWords: ['angel', 'anchor', 'bullion', 'beacon'],
    anomieSafeFloor: 0.9998,
    mevProtectionTier: 'TIER-1 ENCLAVE',
    description: 'Issued by Paxos Trust Company under NYDFS regulation, backed 1:1 by dollar deposits and US Treasuries.'
  },
  {
    symbol: 'FDUSD',
    name: 'First Digital USD',
    category: 'STABLE_USD',
    chain: 'BNB Chain / Ethereum',
    standard: 'BEP-20',
    pegType: 'USD_FIAT',
    wing: 'Bravo',
    derivationIndex: 7635,
    coordinateHex: '0x2B14',
    coordinateWords: ['bullion', 'beacon', 'cipher', 'coinage'],
    anomieSafeFloor: 0.9992,
    mevProtectionTier: 'TIER-2 ZERO-MEMPOOL',
    description: 'Regulated reserve-backed digital dollar managed by First Digital Labs with custodian segregation.'
  },
  {
    symbol: 'USDe',
    name: 'Ethena Synthetic Dollar',
    category: 'STABLE_YIELD',
    chain: 'Ethereum / L2s',
    standard: 'ERC-20',
    pegType: 'USD_YIELD',
    wing: 'Hotel',
    derivationIndex: 7728,
    coordinateHex: '0x8H10',
    coordinateWords: ['hedge', 'horizon', 'hedge', 'horizon'],
    anomieSafeFloor: 0.9960,
    mevProtectionTier: 'TIER-1 ENCLAVE',
    description: 'Delta-neutral synthetic dollar backed by stETH collateral and short perpetual futures funding yield.'
  },
  {
    symbol: 'sUSDe',
    name: 'Staked USDe',
    category: 'STABLE_YIELD',
    chain: 'Ethereum',
    standard: 'ERC-20',
    pegType: 'USD_YIELD',
    wing: 'Hotel',
    derivationIndex: 7730,
    coordinateHex: '0x8H12',
    coordinateWords: ['hedge', 'horizon', 'epoch', 'equinox'],
    anomieSafeFloor: 0.9960,
    mevProtectionTier: 'TIER-1 ENCLAVE',
    description: 'Yield-bearing staked USDe accumulating funding and basis yields directly inside the AEGIS-7 vault.'
  },
  {
    symbol: 'USDY',
    name: 'Ondo US Dollar Yield',
    category: 'STABLE_YIELD',
    chain: 'Solana / Ethereum / Aptos',
    standard: 'SPL',
    pegType: 'USD_YIELD',
    wing: 'Delta',
    derivationIndex: 7668,
    coordinateHex: '0x4D24',
    coordinateWords: ['datum', 'dividend', 'bullion', 'beacon'],
    anomieSafeFloor: 0.9990,
    mevProtectionTier: 'TIER-1 ENCLAVE',
    description: 'Tokenized note secured by short-term US Treasuries and bank demand deposits, offering native institutional yield.'
  },
  {
    symbol: 'OUSG',
    name: 'Ondo Short-Term US Government Treasuries',
    category: 'STABLE_YIELD',
    chain: 'Ethereum',
    standard: 'ERC-20',
    pegType: 'USD_YIELD',
    wing: 'Bravo',
    derivationIndex: 7638,
    coordinateHex: '0x2B18',
    coordinateWords: ['bullion', 'beacon', 'datum', 'dividend'],
    anomieSafeFloor: 0.9995,
    mevProtectionTier: 'TIER-1 ENCLAVE',
    description: 'Direct institutional access to BlackRock BUIDL fund and short-duration liquid US government bond yields.'
  },
  {
    symbol: 'crvUSD',
    name: 'Curve Finance crvUSD',
    category: 'STABLE_USD',
    chain: 'Ethereum / Arbitrum',
    standard: 'ERC-20',
    pegType: 'CRYPTO_BACKED',
    wing: 'Golf',
    derivationIndex: 7712,
    coordinateHex: '0x7G01',
    coordinateWords: ['grid', 'gantry', 'grid', 'gantry'],
    anomieSafeFloor: 0.9970,
    mevProtectionTier: 'TIER-2 ZERO-MEMPOOL',
    description: 'Overcollateralized stablecoin utilizing LLAMMA (Lending-Liquidating AMM Algorithm) continuous soft liquidations.'
  },
  {
    symbol: 'GHO',
    name: 'Aave Protocol GHO',
    category: 'STABLE_USD',
    chain: 'Ethereum / Arbitrum',
    standard: 'ERC-20',
    pegType: 'CRYPTO_BACKED',
    wing: 'Charlie',
    derivationIndex: 7648,
    coordinateHex: '0x3C10',
    coordinateWords: ['cipher', 'coinage', 'cipher', 'coinage'],
    anomieSafeFloor: 0.9980,
    mevProtectionTier: 'TIER-1 ENCLAVE',
    description: 'Decentralized multi-collateral stablecoin minted against diversified crypto collateral supplied to Aave v3.'
  },
  {
    symbol: 'FRAX',
    name: 'Frax Finance USD',
    category: 'STABLE_USD',
    chain: 'Fraxtal / Ethereum',
    standard: 'ERC-20',
    pegType: 'USD_FIAT',
    wing: 'Echo',
    derivationIndex: 7680,
    coordinateHex: '0x5E01',
    coordinateWords: ['epoch', 'equinox', 'epoch', 'equinox'],
    anomieSafeFloor: 0.9985,
    mevProtectionTier: 'TIER-2 ZERO-MEMPOOL',
    description: '100% collateralized algorithmic-transitioned digital currency utilizing protocol-owned liquidity.'
  },
  {
    symbol: 'LUSD',
    name: 'Liquity LUSD',
    category: 'STABLE_USD',
    chain: 'Ethereum',
    standard: 'ERC-20',
    pegType: 'CRYPTO_BACKED',
    wing: 'Charlie',
    derivationIndex: 7652,
    coordinateHex: '0x3C14',
    coordinateWords: ['cipher', 'coinage', 'angel', 'anchor'],
    anomieSafeFloor: 0.9970,
    mevProtectionTier: 'TIER-1 ENCLAVE',
    description: 'Immutable, zero-interest decentralized stablecoin fully backed by ETH alone with hard-peg recovery mechanisms.'
  },
  {
    symbol: 'TUSD',
    name: 'TrueUSD',
    category: 'STABLE_USD',
    chain: 'Multi-Chain',
    standard: 'ERC-20',
    pegType: 'USD_FIAT',
    wing: 'Bravo',
    derivationIndex: 7640,
    coordinateHex: '0x2B1A',
    coordinateWords: ['bullion', 'beacon', 'hedge', 'horizon'],
    anomieSafeFloor: 0.9975,
    mevProtectionTier: 'TIER-3 MPC-COORDINATE',
    description: 'Real-time Chainlink Proof of Reserve attested USD stablecoin with institutional escrow isolation.'
  },
  {
    symbol: 'RLUSD',
    name: 'Ripple USD',
    category: 'STABLE_USD',
    chain: 'XRPL / Ethereum',
    standard: 'ERC-20',
    pegType: 'USD_FIAT',
    wing: 'Alpha',
    derivationIndex: 7620,
    coordinateHex: '0x1A06',
    coordinateWords: ['angel', 'anchor', 'grid', 'gantry'],
    anomieSafeFloor: 0.9998,
    mevProtectionTier: 'TIER-1 ENCLAVE',
    description: 'Enterprise-grade 100% USD-backed stablecoin issued under NYDFS trust company charter by Ripple Labs on XRPL and Ethereum.'
  },
  {
    symbol: 'GUSD',
    name: 'Gemini Dollar',
    category: 'STABLE_USD',
    chain: 'Ethereum',
    standard: 'ERC-20',
    pegType: 'USD_FIAT',
    wing: 'Bravo',
    derivationIndex: 7641,
    coordinateHex: '0x2B1B',
    coordinateWords: ['bullion', 'beacon', 'datum', 'dividend'],
    anomieSafeFloor: 0.9995,
    mevProtectionTier: 'TIER-1 ENCLAVE',
    description: 'NYDFS-regulated stablecoin held 1:1 with State Street custody and monthly independent audit attestations.'
  },

  // --- 2. FOREIGN FIAT & COMMODITY STABLECOINS ---
  {
    symbol: 'EURC',
    name: 'Circle Euro',
    category: 'STABLE_FIAT',
    chain: 'Ethereum / Solana / Base',
    standard: 'ERC-20',
    pegType: 'EUR_FIAT',
    wing: 'Alpha',
    derivationIndex: 7622,
    coordinateHex: '0x1A08',
    coordinateWords: ['angel', 'anchor', 'epoch', 'equinox'],
    anomieSafeFloor: 0.9990,
    mevProtectionTier: 'TIER-1 ENCLAVE',
    description: 'MiCA-compliant regulated Euro stablecoin backed 100% by Euro-denominated bank deposits (Circle).'
  },
  {
    symbol: 'EURT',
    name: 'Tether Euro',
    category: 'STABLE_FIAT',
    chain: 'Ethereum',
    standard: 'ERC-20',
    pegType: 'EUR_FIAT',
    wing: 'Bravo',
    derivationIndex: 7642,
    coordinateHex: '0x2B1C',
    coordinateWords: ['bullion', 'beacon', 'grid', 'gantry'],
    anomieSafeFloor: 0.9975,
    mevProtectionTier: 'TIER-2 ZERO-MEMPOOL',
    description: 'Tether Euro-pegged token for cross-border European arbitrage and forex liquidity settlements.'
  },
  {
    symbol: 'XSGD',
    name: 'StraitsX Singapore Dollar',
    category: 'STABLE_FIAT',
    chain: 'Polygon / Ethereum',
    standard: 'ERC-20',
    pegType: 'SGD_FIAT',
    wing: 'Delta',
    derivationIndex: 7672,
    coordinateHex: '0x4D28',
    coordinateWords: ['datum', 'dividend', 'epoch', 'equinox'],
    anomieSafeFloor: 0.9990,
    mevProtectionTier: 'TIER-2 ZERO-MEMPOOL',
    description: 'MAS-regulated Singapore Dollar stablecoin for ASEAN settlement channels and sovereign treasury routing.'
  },
  {
    symbol: 'GYEN',
    name: 'GMO Japanese Yen',
    category: 'STABLE_FIAT',
    chain: 'Ethereum / Solana',
    standard: 'ERC-20',
    pegType: 'JPY_FIAT',
    wing: 'Delta',
    derivationIndex: 7674,
    coordinateHex: '0x4D2A',
    coordinateWords: ['datum', 'dividend', 'hedge', 'horizon'],
    anomieSafeFloor: 0.9990,
    mevProtectionTier: 'TIER-2 ZERO-MEMPOOL',
    description: 'The first regulated Japanese Yen digital currency under NYDFS jurisdiction issued by GMO-Z.com Trust.'
  },
  {
    symbol: 'PAXG',
    name: 'Paxos Gold',
    category: 'STABLE_COMMODITY',
    chain: 'Ethereum',
    standard: 'ERC-20',
    pegType: 'GOLD_PHYSICAL',
    wing: 'Bravo',
    derivationIndex: 7644,
    coordinateHex: '0x2B20',
    coordinateWords: ['bullion', 'beacon', 'bullion', 'beacon'],
    anomieSafeFloor: 0.9995,
    mevProtectionTier: 'TIER-1 ENCLAVE',
    description: 'Each PAXG token is backed by one fine troy ounce of London Good Delivery gold stored in Brink vaults.'
  },
  {
    symbol: 'XAUT',
    name: 'Tether Gold',
    category: 'STABLE_COMMODITY',
    chain: 'Ethereum',
    standard: 'ERC-20',
    pegType: 'GOLD_PHYSICAL',
    wing: 'Bravo',
    derivationIndex: 7646,
    coordinateHex: '0x2B22',
    coordinateWords: ['bullion', 'beacon', 'forge', 'frontier'],
    anomieSafeFloor: 0.9990,
    mevProtectionTier: 'TIER-2 ZERO-MEMPOOL',
    description: 'Physical allocated gold ownership tracked via unique serial numbers in Swiss vault custody.'
  },

  // --- 3. L1 & SOVEREIGN BLUE-CHIP TOKENS ---
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    category: 'L1_BLUECHIP',
    chain: 'Bitcoin Native (UTXO)',
    standard: 'NATIVE',
    wing: 'Bravo',
    derivationIndex: 7633,
    coordinateHex: '0x2B11',
    coordinateWords: ['bullion', 'beacon', 'angel', 'anchor'],
    anomieSafeFloor: 0.9950,
    mevProtectionTier: 'TIER-1 ENCLAVE',
    description: 'The premier decentralized digital reserve asset and planetary immutable monetary energy anchor.'
  },
  {
    symbol: 'wBTC',
    name: 'Wrapped Bitcoin',
    category: 'L1_BLUECHIP',
    chain: 'Ethereum',
    standard: 'ERC-20',
    wing: 'Bravo',
    derivationIndex: 7634,
    coordinateHex: '0x2B12',
    coordinateWords: ['bullion', 'beacon', 'cipher', 'coinage'],
    anomieSafeFloor: 0.9980,
    mevProtectionTier: 'TIER-1 ENCLAVE',
    description: 'ERC-20 representation of Bitcoin held 1:1 in institutional custody for high-speed DeFi execution.'
  },
  {
    symbol: 'cbBTC',
    name: 'Coinbase Wrapped Bitcoin',
    category: 'L1_BLUECHIP',
    chain: 'Base / Ethereum / Solana',
    standard: 'ERC-20',
    wing: 'Bravo',
    derivationIndex: 7636,
    coordinateHex: '0x2B15',
    coordinateWords: ['bullion', 'beacon', 'datum', 'dividend'],
    anomieSafeFloor: 0.9990,
    mevProtectionTier: 'TIER-1 ENCLAVE',
    description: 'Coinbase-backed wrapped Bitcoin natively integrated across Base and Ethereum L2 ecosystems.'
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    category: 'L1_BLUECHIP',
    chain: 'Ethereum Native',
    standard: 'NATIVE',
    wing: 'Alpha',
    derivationIndex: 7617,
    coordinateHex: '0x1A02',
    coordinateWords: ['angel', 'anchor', 'cipher', 'coinage'],
    anomieSafeFloor: 0.9950,
    mevProtectionTier: 'TIER-1 ENCLAVE',
    description: 'Sovereign programmable settlement layer for smart contracts, rollup proofs, and decentralized finance.'
  },
  {
    symbol: 'wstETH',
    name: 'Wrapped Lido Staked ETH',
    category: 'L1_BLUECHIP',
    chain: 'Ethereum / Arbitrum / Optimism',
    standard: 'ERC-20',
    wing: 'Alpha',
    derivationIndex: 7619,
    coordinateHex: '0x1A04',
    coordinateWords: ['angel', 'anchor', 'datum', 'dividend'],
    anomieSafeFloor: 0.9975,
    mevProtectionTier: 'TIER-1 ENCLAVE',
    description: 'Non-rebasing yield-accumulating wrapped liquid staking token tracking Ethereum consensus rewards.'
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    category: 'L1_BLUECHIP',
    chain: 'Solana Native',
    standard: 'NATIVE',
    wing: 'Foxtrot',
    derivationIndex: 7696,
    coordinateHex: '0x6F01',
    coordinateWords: ['forge', 'frontier', 'forge', 'frontier'],
    anomieSafeFloor: 0.9940,
    mevProtectionTier: 'TIER-1 ENCLAVE',
    description: 'High-throughput proof-of-history layer-1 optimized for sub-millisecond atomic trading executions.'
  },
  {
    symbol: 'JitoSOL',
    name: 'Jito Staked SOL',
    category: 'L1_BLUECHIP',
    chain: 'Solana',
    standard: 'SPL',
    wing: 'Foxtrot',
    derivationIndex: 7698,
    coordinateHex: '0x6F04',
    coordinateWords: ['forge', 'frontier', 'grid', 'gantry'],
    anomieSafeFloor: 0.9960,
    mevProtectionTier: 'TIER-1 ENCLAVE',
    description: 'Solana liquid staking token yielding both validator consensus rewards and MEV blockspace tips.'
  },
  {
    symbol: 'BNB',
    name: 'BNB',
    category: 'L1_BLUECHIP',
    chain: 'BNB Smart Chain',
    standard: 'BEP-20',
    wing: 'Golf',
    derivationIndex: 7714,
    coordinateHex: '0x7G04',
    coordinateWords: ['grid', 'gantry', 'bullion', 'beacon'],
    anomieSafeFloor: 0.9940,
    mevProtectionTier: 'TIER-2 ZERO-MEMPOOL',
    description: 'Native gas and governance token of the high-volume BNB Chain and CeFi-DeFi liquidity corridors.'
  },
  {
    symbol: 'AVAX',
    name: 'Avalanche',
    category: 'L1_BLUECHIP',
    chain: 'Avalanche C-Chain',
    standard: 'ERC-20',
    wing: 'Foxtrot',
    derivationIndex: 7700,
    coordinateHex: '0x6F08',
    coordinateWords: ['forge', 'frontier', 'cipher', 'coinage'],
    anomieSafeFloor: 0.9930,
    mevProtectionTier: 'TIER-2 ZERO-MEMPOOL',
    description: 'Subnet-enabled consensus platform offering sub-second finality for institutional sovereign chains.'
  },
  {
    symbol: 'LINK',
    name: 'Chainlink',
    category: 'DEFI_CORE',
    chain: 'Multi-Chain',
    standard: 'ERC-20',
    wing: 'Delta',
    derivationIndex: 7665,
    coordinateHex: '0x4D21',
    coordinateWords: ['datum', 'dividend', 'forge', 'frontier'],
    anomieSafeFloor: 0.9960,
    mevProtectionTier: 'TIER-1 ENCLAVE',
    description: 'Industry-standard decentralized computing platform powering price feeds, CCIP cross-chain, and automation.'
  },
  {
    symbol: 'NEAR',
    name: 'Near Protocol',
    category: 'L1_BLUECHIP',
    chain: 'Near Native',
    standard: 'NATIVE',
    wing: 'Golf',
    derivationIndex: 7716,
    coordinateHex: '0x7G08',
    coordinateWords: ['grid', 'gantry', 'epoch', 'equinox'],
    anomieSafeFloor: 0.9930,
    mevProtectionTier: 'TIER-2 ZERO-MEMPOOL',
    description: 'Sharded proof-of-stake layer-1 built for chain abstraction and high-scale user sovereign applications.'
  },
  {
    symbol: 'SUI',
    name: 'Sui Network',
    category: 'L1_BLUECHIP',
    chain: 'Sui Native (Move)',
    standard: 'NATIVE',
    wing: 'Foxtrot',
    derivationIndex: 7702,
    coordinateHex: '0x6F10',
    coordinateWords: ['forge', 'frontier', 'datum', 'dividend'],
    anomieSafeFloor: 0.9920,
    mevProtectionTier: 'TIER-2 ZERO-MEMPOOL',
    description: 'Object-centric Move-based L1 offering parallel transaction execution and ultra-low latency.'
  },
  {
    symbol: 'APT',
    name: 'Aptos',
    category: 'L1_BLUECHIP',
    chain: 'Aptos Native (Move)',
    standard: 'NATIVE',
    wing: 'Foxtrot',
    derivationIndex: 7704,
    coordinateHex: '0x6F12',
    coordinateWords: ['forge', 'frontier', 'hedge', 'horizon'],
    anomieSafeFloor: 0.9920,
    mevProtectionTier: 'TIER-2 ZERO-MEMPOOL',
    description: 'Move language smart contract platform featuring Block-STM parallel execution engine.'
  },
  {
    symbol: 'XRP',
    name: 'XRP Ledger Native',
    category: 'L1_BLUECHIP',
    chain: 'XRPL Native',
    standard: 'NATIVE',
    wing: 'Charlie',
    derivationIndex: 7656,
    coordinateHex: '0x3C1A',
    coordinateWords: ['cipher', 'coinage', 'bullion', 'beacon'],
    anomieSafeFloor: 0.9950,
    mevProtectionTier: 'TIER-1 ENCLAVE',
    description: 'Premier enterprise bridge asset providing 3-second deterministic finality, built-in DEX, and high-velocity cross-border liquidity corridors.'
  },
  {
    symbol: 'HBAR',
    name: 'Hedera',
    category: 'L1_BLUECHIP',
    chain: 'Hedera Native',
    standard: 'NATIVE',
    wing: 'Delta',
    derivationIndex: 7676,
    coordinateHex: '0x4D2C',
    coordinateWords: ['datum', 'dividend', 'grid', 'gantry'],
    anomieSafeFloor: 0.9940,
    mevProtectionTier: 'TIER-1 ENCLAVE',
    description: 'Asynchronous Byzantine Fault Tolerant (ABFT) DAG consensus layer-1 powering the Grove Hedera Orchards consensus service.'
  },
  {
    symbol: 'ADA',
    name: 'Cardano',
    category: 'L1_BLUECHIP',
    chain: 'Cardano Native (eUTXO)',
    standard: 'NATIVE',
    wing: 'Echo',
    derivationIndex: 7686,
    coordinateHex: '0x5E0A',
    coordinateWords: ['epoch', 'equinox', 'bullion', 'beacon'],
    anomieSafeFloor: 0.9930,
    mevProtectionTier: 'TIER-2 ZERO-MEMPOOL',
    description: 'Peer-reviewed evidence-based proof-of-stake sovereign blockchain designed for formal smart contract verification.'
  },
  {
    symbol: 'DOGE',
    name: 'Dogecoin',
    category: 'L1_BLUECHIP',
    chain: 'Dogecoin Native (PoW)',
    standard: 'NATIVE',
    wing: 'Golf',
    derivationIndex: 7722,
    coordinateHex: '0x7G14',
    coordinateWords: ['grid', 'gantry', 'forge', 'frontier'],
    anomieSafeFloor: 0.9920,
    mevProtectionTier: 'TIER-2 ZERO-MEMPOOL',
    description: 'Decentralized Scrypt-based peer-to-peer monetary network for instant, low-fee global digital transactions.'
  },
  {
    symbol: 'DOT',
    name: 'Polkadot',
    category: 'L1_BLUECHIP',
    chain: 'Polkadot Relay Chain',
    standard: 'NATIVE',
    wing: 'Hotel',
    derivationIndex: 7734,
    coordinateHex: '0x8H16',
    coordinateWords: ['hedge', 'horizon', 'angel', 'anchor'],
    anomieSafeFloor: 0.9930,
    mevProtectionTier: 'TIER-2 ZERO-MEMPOOL',
    description: 'Shared security heterogeneous multichain network connecting specialized sovereign parachains.'
  },

  // --- 4. AI & DEPIN BLUE-CHIP ASSETS ---
  {
    symbol: 'TAO',
    name: 'Bittensor',
    category: 'AI_DEPIN',
    chain: 'Subtensor Native',
    standard: 'NATIVE',
    wing: 'Charlie',
    derivationIndex: 7650,
    coordinateHex: '0x3C12',
    coordinateWords: ['cipher', 'coinage', 'forge', 'frontier'],
    anomieSafeFloor: 0.9910,
    mevProtectionTier: 'TIER-1 ENCLAVE',
    description: 'Decentralized peer-to-peer intelligence protocol commoditizing AI training, inference, and fine-tuning.'
  },
  {
    symbol: 'RENDER',
    name: 'Render Network',
    category: 'AI_DEPIN',
    chain: 'Solana',
    standard: 'SPL',
    wing: 'Echo',
    derivationIndex: 7682,
    coordinateHex: '0x5E04',
    coordinateWords: ['epoch', 'equinox', 'grid', 'gantry'],
    anomieSafeFloor: 0.9920,
    mevProtectionTier: 'TIER-1 ENCLAVE',
    description: 'Decentralized GPU rendering and AI compute network bridging high-density graphics and machine learning.'
  },
  {
    symbol: 'FET',
    name: 'ASI Alliance (Fetch.ai)',
    category: 'AI_DEPIN',
    chain: 'Ethereum / Cosmos',
    standard: 'ERC-20',
    wing: 'Echo',
    derivationIndex: 7684,
    coordinateHex: '0x5E08',
    coordinateWords: ['epoch', 'equinox', 'cipher', 'coinage'],
    anomieSafeFloor: 0.9910,
    mevProtectionTier: 'TIER-2 ZERO-MEMPOOL',
    description: 'Artificial Superintelligence Alliance token empowering autonomous economic agents and machine intelligence.'
  },

  // --- 5. DEFI & LAYER-2 ECOSYSTEM TOKENS ---
  {
    symbol: 'UNI',
    name: 'Uniswap',
    category: 'DEFI_CORE',
    chain: 'Multi-Chain',
    standard: 'ERC-20',
    wing: 'Golf',
    derivationIndex: 7718,
    coordinateHex: '0x7G10',
    coordinateWords: ['grid', 'gantry', 'cipher', 'coinage'],
    anomieSafeFloor: 0.9950,
    mevProtectionTier: 'TIER-1 ENCLAVE',
    description: 'Leading decentralized automated market maker governance token with multi-hundred billion cumulative trade volume.'
  },
  {
    symbol: 'AAVE',
    name: 'Aave',
    category: 'DEFI_CORE',
    chain: 'Multi-Chain',
    standard: 'ERC-20',
    wing: 'Charlie',
    derivationIndex: 7654,
    coordinateHex: '0x3C18',
    coordinateWords: ['cipher', 'coinage', 'hedge', 'horizon'],
    anomieSafeFloor: 0.9950,
    mevProtectionTier: 'TIER-1 ENCLAVE',
    description: 'Decentralized non-custodial liquidity protocol enabling instant flash loans and cross-collateral lending.'
  },
  {
    symbol: 'MKR',
    name: 'Maker',
    category: 'DEFI_CORE',
    chain: 'Ethereum',
    standard: 'ERC-20',
    wing: 'Delta',
    derivationIndex: 7666,
    coordinateHex: '0x4D22',
    coordinateWords: ['datum', 'dividend', 'cipher', 'coinage'],
    anomieSafeFloor: 0.9950,
    mevProtectionTier: 'TIER-1 ENCLAVE',
    description: 'Governance token of the Maker/Sky protocol backing decentralized stablecoin creation and treasury allocations.'
  },
  {
    symbol: 'ARB',
    name: 'Arbitrum',
    category: 'L2_SCALING',
    chain: 'Arbitrum One',
    standard: 'ERC-20',
    wing: 'Foxtrot',
    derivationIndex: 7706,
    coordinateHex: '0x6F15',
    coordinateWords: ['forge', 'frontier', 'angel', 'anchor'],
    anomieSafeFloor: 0.9930,
    mevProtectionTier: 'TIER-1 ENCLAVE',
    description: 'Ethereum Nitro optimistic rollup governance token providing scalable, low-fee smart contract compute.'
  },
  {
    symbol: 'OP',
    name: 'Optimism',
    category: 'L2_SCALING',
    chain: 'OP Mainnet',
    standard: 'ERC-20',
    wing: 'Foxtrot',
    derivationIndex: 7708,
    coordinateHex: '0x6F18',
    coordinateWords: ['forge', 'frontier', 'bullion', 'beacon'],
    anomieSafeFloor: 0.9930,
    mevProtectionTier: 'TIER-1 ENCLAVE',
    description: 'OP Stack foundational token powering the Superchain ecosystem across Base, Zora, Mode, and Optimism.'
  },
  {
    symbol: 'POL',
    name: 'Polygon Ecosystem Token',
    category: 'L2_SCALING',
    chain: 'Polygon',
    standard: 'ERC-20',
    wing: 'Golf',
    derivationIndex: 7720,
    coordinateHex: '0x7G12',
    coordinateWords: ['grid', 'gantry', 'datum', 'dividend'],
    anomieSafeFloor: 0.9940,
    mevProtectionTier: 'TIER-2 ZERO-MEMPOOL',
    description: 'Next-generation hyperproductive token securing the AggLayer cross-chain zero-knowledge liquidity network.'
  },
  {
    symbol: 'PENDLE',
    name: 'Pendle Finance',
    category: 'DEFI_CORE',
    chain: 'Multi-Chain',
    standard: 'ERC-20',
    wing: 'Hotel',
    derivationIndex: 7732,
    coordinateHex: '0x8H14',
    coordinateWords: ['hedge', 'horizon', 'datum', 'dividend'],
    anomieSafeFloor: 0.9930,
    mevProtectionTier: 'TIER-1 ENCLAVE',
    description: 'Yield-trading protocol splitting assets into Principal (PT) and Yield (YT) tokens for fixed-rate DeFi strategies.'
  },
  {
    symbol: 'JUP',
    name: 'Jupiter',
    category: 'DEFI_CORE',
    chain: 'Solana',
    standard: 'SPL',
    wing: 'Foxtrot',
    derivationIndex: 7710,
    coordinateHex: '0x6F1A',
    coordinateWords: ['forge', 'frontier', 'datum', 'dividend'],
    anomieSafeFloor: 0.9940,
    mevProtectionTier: 'TIER-1 ENCLAVE',
    description: 'Premier Solana liquidity aggregator, perpetual DEX router, and limit order protocol.'
  },
  {
    symbol: 'ONDO',
    name: 'Ondo Finance',
    category: 'DEFI_CORE',
    chain: 'Ethereum / Solana',
    standard: 'ERC-20',
    wing: 'Bravo',
    derivationIndex: 7643,
    coordinateHex: '0x2B1D',
    coordinateWords: ['bullion', 'beacon', 'angel', 'anchor'],
    anomieSafeFloor: 0.9950,
    mevProtectionTier: 'TIER-1 ENCLAVE',
    description: 'Institutional real-world asset (RWA) tokenization protocol backing USDY Treasury Yield and tokenized fixed-income securities.'
  },
  {
    symbol: 'ENA',
    name: 'Ethena Governance',
    category: 'DEFI_CORE',
    chain: 'Ethereum',
    standard: 'ERC-20',
    wing: 'Hotel',
    derivationIndex: 7736,
    coordinateHex: '0x8H18',
    coordinateWords: ['hedge', 'horizon', 'cipher', 'coinage'],
    anomieSafeFloor: 0.9940,
    mevProtectionTier: 'TIER-1 ENCLAVE',
    description: 'Governance token orchestrating the synthetic dollar USDe protocol, reserve allocations, and basis yield distribution.'
  },
  {
    symbol: 'LDO',
    name: 'Lido DAO',
    category: 'DEFI_CORE',
    chain: 'Ethereum',
    standard: 'ERC-20',
    wing: 'Alpha',
    derivationIndex: 7624,
    coordinateHex: '0x1A0A',
    coordinateWords: ['angel', 'anchor', 'hedge', 'horizon'],
    anomieSafeFloor: 0.9950,
    mevProtectionTier: 'TIER-1 ENCLAVE',
    description: 'Liquid staking protocol governing planetary validator infrastructure behind stETH and wstETH.'
  }
];
