import {
  MarketCategory,
  JurisdictionTier,
  RegulatoryBody,
  QuoteAssetCategory,
  StablecoinMetadata,
  ExchangeVenueProfile,
  MarketInstrument,
} from './marketRegistryTypes.ts';

// ============================================================================
// 1. STABLECOIN TAXONOMY & AEGENTIX TREASURY POLICY
// ============================================================================
export const STABLECOIN_REGISTRY: Record<string, StablecoinMetadata> = {
  USDC: {
    symbol: 'USDC',
    name: 'USD Coin',
    issuer: 'Circle Internet Financial LLC',
    jurisdiction: 'United States (Boston, MA)',
    regulatoryClassification: 'State MTL Licensed Money Transmitter / NYDFS Virtual Currency Approved',
    reserveAttestationStandard: 'Monthly Deloitte & Touche LLP Attestation; 100% Cash & Short-dated US Treasuries (Circle Reserve Fund BNY Mellon)',
    pegTarget: 'USD',
    isAegentixTreasuryApproved: true,
    treasuryCustodyRationale: 'Primary sovereign reserve currency. Direct multi-chain mint/burn with Circle CCTP and bankruptcy-remote US Treasury reserves.',
    primarySettlementChains: ['Base', 'Ethereum', 'Solana', 'Avalanche', 'Arbitrum', 'Polygon'],
  },
  PYUSD: {
    symbol: 'PYUSD',
    name: 'PayPal USD',
    issuer: 'Paxos Trust Company LLC',
    jurisdiction: 'United States (New York, NY)',
    regulatoryClassification: 'NYDFS Limited Purpose Trust Charter (Supervised by New York State Department of Financial Services)',
    reserveAttestationStandard: 'Monthly Independent WithumSmith+Brown PC Attestation; 100% US Dollar Deposits, US Treasuries, and Overnight Repos',
    pegTarget: 'USD',
    isAegentixTreasuryApproved: true,
    treasuryCustodyRationale: 'Approved for secondary settlement and automated disbursement. Institutional trust company oversight under NYDFS regulations.',
    primarySettlementChains: ['Ethereum', 'Solana'],
  },
  RLUSD: {
    symbol: 'RLUSD',
    name: 'Ripple USD',
    issuer: 'Ripple Markets / Standard Custody & Trust Company',
    jurisdiction: 'United States (New York, NY)',
    regulatoryClassification: 'NYDFS Limited Purpose Trust Charter / Federal Banking Trust Standard',
    reserveAttestationStandard: 'Monthly Third-Party Independent Accounting Audit; 100% Cash Equivalents & Government T-Bills',
    pegTarget: 'USD',
    isAegentixTreasuryApproved: true,
    treasuryCustodyRationale: 'Approved for institutional enterprise settlement on XRPL & Ethereum. High-throughput ledger rails with strict regulatory segregation.',
    primarySettlementChains: ['XRPL', 'Ethereum'],
  },
  GUSD: {
    symbol: 'GUSD',
    name: 'Gemini Dollar',
    issuer: 'Gemini Trust Company LLC',
    jurisdiction: 'United States (New York, NY)',
    regulatoryClassification: 'NYDFS Limited Purpose Trust Charter / FDIC Pass-Through Eligible Cash Deposits',
    reserveAttestationStandard: 'Monthly BPM LLP Public Examination; Strict 1:1 USD Reserves',
    pegTarget: 'USD',
    isAegentixTreasuryApproved: true,
    treasuryCustodyRationale: 'Approved for exchange margin and liquidity bridge operations on Gemini marketplace.',
    primarySettlementChains: ['Ethereum'],
  },
  DAI: {
    symbol: 'DAI',
    name: 'MakerDAO Sky USDS / DAI',
    issuer: 'MakerDAO / Sky Protocol Decentralized Autonomous Organization',
    jurisdiction: 'Decentralized / Multi-jurisdictional RWA SPVs',
    regulatoryClassification: 'Decentralized Overcollateralized Algorithmic / RWA-Backed Stablecoin',
    reserveAttestationStandard: 'On-chain verifiable real-time Maker Core Ledger; US Treasury RWA vaults + Crypto Collateral (ETH, WBTC)',
    pegTarget: 'USD',
    isAegentixTreasuryApproved: false,
    treasuryCustodyRationale: 'Tracked for cross-venue order-book discovery and DEX arbitrage. Excluded from primary sovereign cash reserves due to governance and liquidation volatility.',
    primarySettlementChains: ['Ethereum', 'Base', 'Arbitrum', 'Optimism'],
  },
  USDT: {
    symbol: 'USDT',
    name: 'Tether USD',
    issuer: 'Tether Operations Limited',
    jurisdiction: 'British Virgin Islands / Offshore',
    regulatoryClassification: 'Foreign Non-Bank Commercial Paper & US Treasury Holder (BDO Italia Audited)',
    reserveAttestationStandard: 'Quarterly BDO Attestation; Majority US T-Bills, Overnight Reverse Repos, Secured Loans, and Bitcoin',
    pegTarget: 'USD',
    isAegentixTreasuryApproved: false,
    treasuryCustodyRationale: 'MANDATORY FOR PAIR DISCOVERY & ARBITRAGE (dominant liquidity quote currency on Binance.US, Kraken, Bitstamp, and CEX.IO). RESTRICTED from permanent AEGENTIX treasury holding due to lack of US domestic trust charter.',
    primarySettlementChains: ['Tron', 'Ethereum', 'Solana', 'Avalanche', 'Near'],
  },
  USD: {
    symbol: 'USD',
    name: 'United States Dollar (Fiat)',
    issuer: 'Federal Reserve System / Commercial Banks',
    jurisdiction: 'United States',
    regulatoryClassification: 'Legal Tender Fiat Currency (FDIC insured commercial bank deposits)',
    reserveAttestationStandard: 'Federal Reserve Central Bank Sovereign Currency',
    pegTarget: 'USD',
    isAegentixTreasuryApproved: true,
    treasuryCustodyRationale: 'Primary fiat liquidity baseline across all US exchange order-books.',
    primarySettlementChains: ['Fedwire', 'ACH', 'RTP', 'FedNow'],
  },
};

// ============================================================================
// 2. VENUE PROFILES (Mapped U.S. Exchange Universe)
// ============================================================================
export const US_EXCHANGE_VENUES: Record<string, ExchangeVenueProfile> = {
  COINBASE: {
    venueId: 'COINBASE',
    name: 'Coinbase Exchange',
    legalEntity: 'Coinbase, Inc.',
    operatingJurisdiction: 'United States (Delaware corporation, remote headquarters)',
    usRegulatoryLicenses: ['NYDFS BitLicense', 'NYDFS Money Transmitter License', 'FinCEN Registered MSB (31000159750098)', '45+ State MTLs'],
    regulatoryBodies: ['NYDFS', 'FINCEN', 'STATE_BANKING_DEPT', 'SEC'],
    jurisdictionTier: 'US_NATIONWIDE',
    supportedMarketCategories: ['SPOT_CRYPTO', 'DERIVATIVES'],
    supportedQuoteCurrencies: ['USD', 'USDC', 'USDT', 'EUR', 'GBP', 'BTC'],
    spotPairCountEst: 380,
    stablecoinQuotedRatioEst: 0.18, // Significant majority of pairs on Coinbase are USD-quoted, not stablecoin-quoted
    apiAccess: {
      restBaseUrl: 'https://api.exchange.coinbase.com',
      wsBaseUrl: 'wss://ws-feed.exchange.coinbase.com',
      publicRateLimits: '10 req/s public, 30 req/s private (burst 50)',
      requiresAuthForL2Orderbook: false,
      supportsStreamingL2: true,
    },
    settlementAndCustody: {
      supportsFiatWithdrawal: true,
      fiatRails: ['Fedwire', 'ACH', 'SEPA', 'SWIFT'],
      supportedCryptoWithdrawalNetworks: ['Ethereum', 'Base', 'Solana', 'Bitcoin', 'Avalanche', 'Polygon'],
    },
    restrictionsNotes: 'Coinbase Derivatives (CFTC-regulated DCM) trades nano Bitcoin/Ether/Oil futures. Spot retail/institutional available in all 50 states.',
  },
  KRAKEN: {
    venueId: 'KRAKEN',
    name: 'Kraken Pro',
    legalEntity: 'Payward, Inc.',
    operatingJurisdiction: 'United States (San Francisco, CA) / Wyoming Special Purpose Depository Institution (SPDI)',
    usRegulatoryLicenses: ['Wyoming SPDI Bank Charter (Kraken Bank)', 'FinCEN MSB (31000176593821)', 'Comprehensive State MTLs (except NY and WA)'],
    regulatoryBodies: ['FINCEN', 'STATE_BANKING_DEPT'],
    jurisdictionTier: 'US_EXCLUDING_NY',
    supportedMarketCategories: ['SPOT_CRYPTO'],
    supportedQuoteCurrencies: ['USD', 'USDC', 'USDT', 'DAI', 'PYUSD', 'EUR', 'GBP', 'CAD', 'JPY'],
    spotPairCountEst: 640,
    stablecoinQuotedRatioEst: 0.44, // Broad multi-stablecoin markets (USDT, USDC, DAI, PYUSD, RLUSD)
    apiAccess: {
      restBaseUrl: 'https://api.kraken.com',
      wsBaseUrl: 'wss://ws.kraken.com/v2',
      publicRateLimits: 'Tier-based counter: 15-20 points decay 1/s',
      requiresAuthForL2Orderbook: false,
      supportsStreamingL2: true,
    },
    settlementAndCustody: {
      supportsFiatWithdrawal: true,
      fiatRails: ['Fedwire', 'ACH (Plaid/MVB)', 'SWIFT', 'SEPA'],
      supportedCryptoWithdrawalNetworks: ['Ethereum', 'Bitcoin', 'Solana', 'Tron', 'Arbitrum', 'Polygon', 'Optimism'],
    },
    restrictionsNotes: 'Unavailable to residents of New York and Washington state. Derivatives products are strictly restricted for US retail customers under CFTC enforcement.',
  },
  BINANCE_US: {
    venueId: 'BINANCE_US',
    name: 'Binance.US',
    legalEntity: 'BAM Trading Services Inc.',
    operatingJurisdiction: 'United States (Miami, FL)',
    usRegulatoryLicenses: ['FinCEN Registered MSB', 'State MTLs across ~40 states'],
    regulatoryBodies: ['FINCEN', 'STATE_BANKING_DEPT'],
    jurisdictionTier: 'US_SELECT_STATES',
    supportedMarketCategories: ['SPOT_CRYPTO'],
    supportedQuoteCurrencies: ['USDT', 'USDC', 'USD'],
    spotPairCountEst: 160,
    stablecoinQuotedRatioEst: 0.78, // Overwhelming majority are USDT quoted pairs; selected USDC/USD pairs
    apiAccess: {
      restBaseUrl: 'https://api.binance.us',
      wsBaseUrl: 'wss://stream.binance.us:9443/ws',
      publicRateLimits: '1200 req/min (IP weight based)',
      requiresAuthForL2Orderbook: false,
      supportsStreamingL2: true,
    },
    settlementAndCustody: {
      supportsFiatWithdrawal: false, // Transitioned to crypto-only & third-party fiat onramp partners (MoonPay)
      fiatRails: ['MoonPay / Third-Party Partner Onramp'],
      supportedCryptoWithdrawalNetworks: ['BNB Chain', 'Ethereum', 'Solana', 'Bitcoin', 'Polygon', 'Tron'],
    },
    restrictionsNotes: 'Unavailable in NY, TX, VT, HI. Essential for USDT market-pair discovery and deep altcoin order-book monitoring.',
  },
  GEMINI: {
    venueId: 'GEMINI',
    name: 'Gemini Marketplace',
    legalEntity: 'Gemini Trust Company, LLC',
    operatingJurisdiction: 'United States (New York, NY)',
    usRegulatoryLicenses: ['NYDFS Limited Purpose Trust Charter (Pioneer NY Trust)', 'FinCEN MSB', 'All 50 US States Approved'],
    regulatoryBodies: ['NYDFS', 'FINCEN', 'STATE_BANKING_DEPT'],
    jurisdictionTier: 'US_NATIONWIDE',
    supportedMarketCategories: ['SPOT_CRYPTO', 'DERIVATIVES'],
    supportedQuoteCurrencies: ['USD', 'GUSD', 'USDC', 'USDT', 'RLUSD', 'EUR', 'GBP', 'SGD', 'BTC', 'ETH'],
    spotPairCountEst: 125,
    stablecoinQuotedRatioEst: 0.32, // Strong USD base plus GUSD, USDT, USDC, and new RLUSD markets
    apiAccess: {
      restBaseUrl: 'https://api.gemini.com',
      wsBaseUrl: 'wss://api.gemini.com/v2/marketdata',
      publicRateLimits: '120 req/min standard public, 600 req/min private',
      requiresAuthForL2Orderbook: false,
      supportsStreamingL2: true,
    },
    settlementAndCustody: {
      supportsFiatWithdrawal: true,
      fiatRails: ['Fedwire', 'ACH', 'SWIFT', 'Debit Card'],
      supportedCryptoWithdrawalNetworks: ['Ethereum', 'Bitcoin', 'Solana', 'Zcash', 'Litecoin'],
    },
    restrictionsNotes: 'Fully compliant with NYDFS Greenlist assets. Gemini Foundation (Derivatives) is offshore only; US users have access to spot and OTC blocks.',
  },
  CRYPTO_COM: {
    venueId: 'CRYPTO_COM',
    name: 'Crypto.com US Exchange',
    legalEntity: 'Foris DAX Markets, Inc.',
    operatingJurisdiction: 'United States (Dover, DE / Miami, FL)',
    usRegulatoryLicenses: ['CFTC Registered Designated Contract Market (DCM) / DCO (Nadex Acquisition)', 'FinCEN MSB', 'State MTLs across 40+ states'],
    regulatoryBodies: ['CFTC', 'FINCEN', 'STATE_BANKING_DEPT'],
    jurisdictionTier: 'US_SELECT_STATES',
    supportedMarketCategories: ['SPOT_CRYPTO', 'DERIVATIVES'],
    supportedQuoteCurrencies: ['USD', 'USDC', 'USDT', 'EUR'],
    spotPairCountEst: 290,
    stablecoinQuotedRatioEst: 0.52,
    apiAccess: {
      restBaseUrl: 'https://api.crypto.com/exchange/v1',
      wsBaseUrl: 'wss://stream.crypto.com/exchange/v1/market',
      publicRateLimits: '100 req/s public IP pool',
      requiresAuthForL2Orderbook: false,
      supportsStreamingL2: true,
    },
    settlementAndCustody: {
      supportsFiatWithdrawal: true,
      fiatRails: ['Fedwire', 'ACH'],
      supportedCryptoWithdrawalNetworks: ['Cronos', 'Ethereum', 'Solana', 'Polygon', 'Bitcoin'],
    },
    restrictionsNotes: 'Institutional and accredited exchange accessible in US; retail access primarily via App. Derivatives available via Nadex CFTC structure.',
  },
  BITSTAMP: {
    venueId: 'BITSTAMP',
    name: 'Bitstamp USA',
    legalEntity: 'Bitstamp USA, Inc.',
    operatingJurisdiction: 'United States (New York, NY)',
    usRegulatoryLicenses: ['NYDFS BitLicense (granted 2019)', 'FinCEN MSB', 'State MTLs nationwide'],
    regulatoryBodies: ['NYDFS', 'FINCEN', 'STATE_BANKING_DEPT'],
    jurisdictionTier: 'US_NATIONWIDE',
    supportedMarketCategories: ['SPOT_CRYPTO'],
    supportedQuoteCurrencies: ['USD', 'USDC', 'USDT', 'EUR', 'GBP', 'BTC', 'ETH'],
    spotPairCountEst: 110,
    stablecoinQuotedRatioEst: 0.28,
    apiAccess: {
      restBaseUrl: 'https://www.bitstamp.net/api/v2',
      wsBaseUrl: 'wss://ws.bitstamp.net',
      publicRateLimits: '800 req/10 min',
      requiresAuthForL2Orderbook: false,
      supportsStreamingL2: true,
    },
    settlementAndCustody: {
      supportsFiatWithdrawal: true,
      fiatRails: ['ACH', 'Fedwire', 'SEPA', 'International Wire'],
      supportedCryptoWithdrawalNetworks: ['Ethereum', 'Bitcoin', 'Ripple/XRPL', 'Litecoin'],
    },
    restrictionsNotes: 'Established European and US institutional gateway with long-standing NYDFS BitLicense authorization.',
  },
  CEX_IO: {
    venueId: 'CEX_IO',
    name: 'CEX.IO US',
    legalEntity: 'CEX.IO Corp.',
    operatingJurisdiction: 'United States (Jersey City, NJ)',
    usRegulatoryLicenses: ['FinCEN MSB (31000142981395)', 'Money Transmitter Licenses in 30+ US States'],
    regulatoryBodies: ['FINCEN', 'STATE_BANKING_DEPT'],
    jurisdictionTier: 'US_SELECT_STATES',
    supportedMarketCategories: ['SPOT_CRYPTO'],
    supportedQuoteCurrencies: ['USD', 'USDT', 'EUR', 'GBP'],
    spotPairCountEst: 95,
    stablecoinQuotedRatioEst: 0.45,
    apiAccess: {
      restBaseUrl: 'https://trade.cex.io/api/spot/rest-public',
      wsBaseUrl: 'wss://ws.cex.io/ws',
      publicRateLimits: '60 req/min',
      requiresAuthForL2Orderbook: false,
      supportsStreamingL2: true,
    },
    settlementAndCustody: {
      supportsFiatWithdrawal: true,
      fiatRails: ['Domestic Wire', 'ACH', 'Visa/Mastercard'],
      supportedCryptoWithdrawalNetworks: ['Ethereum', 'Bitcoin', 'Tron', 'Solana'],
    },
    restrictionsNotes: 'Available to eligible US customers across participating MTL states. Highly disciplined pair listing standards.',
  },
  UPHOLD: {
    venueId: 'UPHOLD',
    name: 'Uphold',
    legalEntity: 'Uphold HQ Inc.',
    operatingJurisdiction: 'United States (San Francisco, CA / New York, NY)',
    usRegulatoryLicenses: ['FinCEN Registered MSB (31000165565507)', 'State MTLs across 40+ states'],
    regulatoryBodies: ['FINCEN', 'STATE_BANKING_DEPT'],
    jurisdictionTier: 'US_SELECT_STATES',
    supportedMarketCategories: ['SPOT_CRYPTO', 'TRADITIONAL_AND_TOKENIZED'],
    supportedQuoteCurrencies: ['USD', 'USDC', 'USDT', 'EUR', 'GBP', 'CAD', 'XRP', 'BTC'],
    spotPairCountEst: 260,
    stablecoinQuotedRatioEst: 0.35,
    apiAccess: {
      restBaseUrl: 'https://api.uphold.com/v0',
      wsBaseUrl: 'wss://api.uphold.com/v0/ticker',
      publicRateLimits: '300 req/min',
      requiresAuthForL2Orderbook: true,
      supportsStreamingL2: false, // RFQ aggregator model with internal book
    },
    settlementAndCustody: {
      supportsFiatWithdrawal: true,
      fiatRails: ['ACH', 'Fedwire', 'Debit Card'],
      supportedCryptoWithdrawalNetworks: ['XRPL', 'Ethereum', 'Bitcoin', 'Polygon', 'Solana'],
    },
    restrictionsNotes: 'Unique hybrid multi-asset platform bridging spot crypto, precious metals (Gold, Silver, Platinum), and national currencies in a single unified ledger.',
  },
  CME_GROUP: {
    venueId: 'CME_GROUP',
    name: 'CME Group (Chicago Mercantile Exchange)',
    legalEntity: 'Chicago Mercantile Exchange Inc.',
    operatingJurisdiction: 'United States (Chicago, IL)',
    usRegulatoryLicenses: ['CFTC Registered Designated Contract Market (DCM)', 'CFTC Derivatives Clearing Organization (DCO)'],
    regulatoryBodies: ['CFTC'],
    jurisdictionTier: 'US_NATIONWIDE',
    supportedMarketCategories: ['DERIVATIVES', 'TRADITIONAL_AND_TOKENIZED'],
    supportedQuoteCurrencies: ['USD'],
    spotPairCountEst: 0, // Zero spot crypto; purely cash-settled futures & options
    stablecoinQuotedRatioEst: 0.0,
    apiAccess: {
      restBaseUrl: 'https://cmegroup.com/market-data-api',
      wsBaseUrl: 'wss://cmegroup.com/market-depth-ws',
      publicRateLimits: 'Institutional FIX / ITCH direct market data protocol',
      requiresAuthForL2Orderbook: true,
      supportsStreamingL2: true,
    },
    settlementAndCustody: {
      supportsFiatWithdrawal: true,
      fiatRails: ['Fedwire Commercial Bank Member Clearing'],
      supportedCryptoWithdrawalNetworks: [], // Cash-settled at reference rate (CME CF Reference Rates)
    },
    restrictionsNotes: 'The premier US regulated derivatives venue. Standard and Micro Bitcoin, Ether, and cross-commodity/equity futures. Requires institutional broker/FCM membership.',
  },
  ONDO_FINANCE: {
    venueId: 'ONDO_FINANCE',
    name: 'Ondo Finance & Tokenized Markets',
    legalEntity: 'Ondo Finance, Inc. / Flux Finance Foundation',
    operatingJurisdiction: 'United States / Cayman Islands Structure',
    usRegulatoryLicenses: ['SEC Registered Transfer Agent / Reg S & Reg D Compliant SPV Issuance'],
    regulatoryBodies: ['SEC'],
    jurisdictionTier: 'US_ACCREDITED_ONLY',
    supportedMarketCategories: ['TRADITIONAL_AND_TOKENIZED'],
    supportedQuoteCurrencies: ['USDC', 'USD'],
    spotPairCountEst: 15,
    stablecoinQuotedRatioEst: 1.0, // 100% USDC / USD settled
    apiAccess: {
      restBaseUrl: 'https://api.ondo.finance/v1',
      wsBaseUrl: 'wss://api.ondo.finance/v1/stream',
      publicRateLimits: '60 req/min',
      requiresAuthForL2Orderbook: false,
      supportsStreamingL2: false,
    },
    settlementAndCustody: {
      supportsFiatWithdrawal: true,
      fiatRails: ['Fedwire (through partner custodian BNY Mellon / Morgan Stanley)'],
      supportedCryptoWithdrawalNetworks: ['Ethereum', 'Solana', 'Base', 'Mantle'],
    },
    restrictionsNotes: 'Tokenized US Treasuries (OUSG, USDY) and institutional cash management. Categorized strictly under TRADITIONAL_AND_TOKENIZED.',
  },
};

// ============================================================================
// 3. MASTER INSTRUMENT INVENTORY (Spot, Derivatives, Traditional/Tokenized)
// ============================================================================
export const MASTER_INSTRUMENTS_CATALOG: MarketInstrument[] = [
  // ── DOMAIN 1: SPOT CRYPTO (USD Quoted) ────────────────────────────────────
  {
    instrumentId: 'COINBASE:BTC-USD:SPOT',
    venueId: 'COINBASE',
    marketCategory: 'SPOT_CRYPTO',
    baseAsset: 'BTC',
    quoteAsset: 'USD',
    quoteCategory: 'FIAT_USD',
    pairSymbol: 'BTC-USD',
    formattedDisplay: 'Bitcoin / US Dollar (Coinbase Spot)',
    isTradableForUsCustomers: true,
    jurisdictionEligibility: 'US_NATIONWIDE',
    applicableRegulators: ['NYDFS', 'FINCEN'],
    microstructure: {
      hasLiveOrderBook: true,
      minOrderSize: 0.0001,
      priceTickSize: 0.01,
      makerFeeBps: 25.0,
      takerFeeBps: 40.0,
      typicalSpreadBps: 0.5,
      typicalDailyVolumeTier: 'HIGH_LIQUIDITY',
    },
    aegentixPolicy: {
      isTreasurySettlementEligible: true,
      isArbitrageDiscoveryActive: true,
      riskClassification: 'LOW_RESERVE_GRADE',
    },
  },
  {
    instrumentId: 'COINBASE:ETH-USD:SPOT',
    venueId: 'COINBASE',
    marketCategory: 'SPOT_CRYPTO',
    baseAsset: 'ETH',
    quoteAsset: 'USD',
    quoteCategory: 'FIAT_USD',
    pairSymbol: 'ETH-USD',
    formattedDisplay: 'Ethereum / US Dollar (Coinbase Spot)',
    isTradableForUsCustomers: true,
    jurisdictionEligibility: 'US_NATIONWIDE',
    applicableRegulators: ['NYDFS', 'FINCEN'],
    microstructure: {
      hasLiveOrderBook: true,
      minOrderSize: 0.001,
      priceTickSize: 0.01,
      makerFeeBps: 25.0,
      takerFeeBps: 40.0,
      typicalSpreadBps: 1.0,
      typicalDailyVolumeTier: 'HIGH_LIQUIDITY',
    },
    aegentixPolicy: {
      isTreasurySettlementEligible: true,
      isArbitrageDiscoveryActive: true,
      riskClassification: 'LOW_RESERVE_GRADE',
    },
  },
  {
    instrumentId: 'COINBASE:XRP-USD:SPOT',
    venueId: 'COINBASE',
    marketCategory: 'SPOT_CRYPTO',
    baseAsset: 'XRP',
    quoteAsset: 'USD',
    quoteCategory: 'FIAT_USD',
    pairSymbol: 'XRP-USD',
    formattedDisplay: 'XRP / US Dollar (Coinbase Spot)',
    isTradableForUsCustomers: true,
    jurisdictionEligibility: 'US_NATIONWIDE',
    applicableRegulators: ['NYDFS', 'FINCEN'],
    microstructure: {
      hasLiveOrderBook: true,
      minOrderSize: 1.0,
      priceTickSize: 0.0001,
      makerFeeBps: 25.0,
      takerFeeBps: 40.0,
      typicalSpreadBps: 2.0,
      typicalDailyVolumeTier: 'HIGH_LIQUIDITY',
    },
    aegentixPolicy: {
      isTreasurySettlementEligible: true,
      isArbitrageDiscoveryActive: true,
      riskClassification: 'LOW_RESERVE_GRADE',
    },
  },

  // ── DOMAIN 1: SPOT CRYPTO (Approved Stablecoin Quoted: USDC, PYUSD, RLUSD, GUSD) ───
  {
    instrumentId: 'KRAKEN:BTC-USDC:SPOT',
    venueId: 'KRAKEN',
    marketCategory: 'SPOT_CRYPTO',
    baseAsset: 'BTC',
    quoteAsset: 'USDC',
    quoteCategory: 'APPROVED_TREASURY_STABLECOIN',
    pairSymbol: 'XBTUSDC',
    formattedDisplay: 'Bitcoin / Circle USD Coin (Kraken Spot)',
    isTradableForUsCustomers: true,
    jurisdictionEligibility: 'US_EXCLUDING_NY',
    applicableRegulators: ['FINCEN', 'STATE_BANKING_DEPT'],
    microstructure: {
      hasLiveOrderBook: true,
      minOrderSize: 0.0001,
      priceTickSize: 0.1,
      makerFeeBps: 16.0,
      takerFeeBps: 26.0,
      typicalSpreadBps: 1.2,
      typicalDailyVolumeTier: 'HIGH_LIQUIDITY',
    },
    aegentixPolicy: {
      isTreasurySettlementEligible: true,
      isArbitrageDiscoveryActive: true,
      riskClassification: 'LOW_RESERVE_GRADE',
    },
  },
  {
    instrumentId: 'KRAKEN:ETH-PYUSD:SPOT',
    venueId: 'KRAKEN',
    marketCategory: 'SPOT_CRYPTO',
    baseAsset: 'ETH',
    quoteAsset: 'PYUSD',
    quoteCategory: 'APPROVED_TREASURY_STABLECOIN',
    pairSymbol: 'ETHPYUSD',
    formattedDisplay: 'Ethereum / PayPal USD (Kraken Spot)',
    isTradableForUsCustomers: true,
    jurisdictionEligibility: 'US_EXCLUDING_NY',
    applicableRegulators: ['FINCEN', 'STATE_BANKING_DEPT'],
    microstructure: {
      hasLiveOrderBook: true,
      minOrderSize: 0.005,
      priceTickSize: 0.05,
      makerFeeBps: 16.0,
      takerFeeBps: 26.0,
      typicalSpreadBps: 3.5,
      typicalDailyVolumeTier: 'MEDIUM_LIQUIDITY',
    },
    aegentixPolicy: {
      isTreasurySettlementEligible: true,
      isArbitrageDiscoveryActive: true,
      riskClassification: 'LOW_RESERVE_GRADE',
    },
  },
  {
    instrumentId: 'GEMINI:XRP-RLUSD:SPOT',
    venueId: 'GEMINI',
    marketCategory: 'SPOT_CRYPTO',
    baseAsset: 'XRP',
    quoteAsset: 'RLUSD',
    quoteCategory: 'APPROVED_TREASURY_STABLECOIN',
    pairSymbol: 'XRPRLUSD',
    formattedDisplay: 'XRP / Ripple USD (Gemini Marketplace)',
    isTradableForUsCustomers: true,
    jurisdictionEligibility: 'US_NATIONWIDE',
    applicableRegulators: ['NYDFS', 'FINCEN'],
    microstructure: {
      hasLiveOrderBook: true,
      minOrderSize: 1.0,
      priceTickSize: 0.0001,
      makerFeeBps: 10.0,
      takerFeeBps: 20.0,
      typicalSpreadBps: 2.2,
      typicalDailyVolumeTier: 'HIGH_LIQUIDITY',
    },
    aegentixPolicy: {
      isTreasurySettlementEligible: true,
      isArbitrageDiscoveryActive: true,
      riskClassification: 'LOW_RESERVE_GRADE',
    },
  },
  {
    instrumentId: 'GEMINI:BTC-GUSD:SPOT',
    venueId: 'GEMINI',
    marketCategory: 'SPOT_CRYPTO',
    baseAsset: 'BTC',
    quoteAsset: 'GUSD',
    quoteCategory: 'APPROVED_TREASURY_STABLECOIN',
    pairSymbol: 'BTCGUSD',
    formattedDisplay: 'Bitcoin / Gemini Dollar (Gemini Marketplace)',
    isTradableForUsCustomers: true,
    jurisdictionEligibility: 'US_NATIONWIDE',
    applicableRegulators: ['NYDFS', 'FINCEN'],
    microstructure: {
      hasLiveOrderBook: true,
      minOrderSize: 0.0001,
      priceTickSize: 0.01,
      makerFeeBps: 20.0,
      takerFeeBps: 40.0,
      typicalSpreadBps: 1.8,
      typicalDailyVolumeTier: 'MEDIUM_LIQUIDITY',
    },
    aegentixPolicy: {
      isTreasurySettlementEligible: true,
      isArbitrageDiscoveryActive: true,
      riskClassification: 'LOW_RESERVE_GRADE',
    },
  },

  // ── DOMAIN 1: SPOT CRYPTO (Non-Treasury Quote: USDT, DAI for Arbitrage Discovery) ─
  {
    instrumentId: 'BINANCE_US:SOL-USDT:SPOT',
    venueId: 'BINANCE_US',
    marketCategory: 'SPOT_CRYPTO',
    baseAsset: 'SOL',
    quoteAsset: 'USDT',
    quoteCategory: 'NON_TREASURY_STABLECOIN',
    pairSymbol: 'SOLUSDT',
    formattedDisplay: 'Solana / Tether USD (Binance.US Spot)',
    isTradableForUsCustomers: true,
    jurisdictionEligibility: 'US_SELECT_STATES',
    applicableRegulators: ['FINCEN', 'STATE_BANKING_DEPT'],
    microstructure: {
      hasLiveOrderBook: true,
      minOrderSize: 0.01,
      priceTickSize: 0.01,
      makerFeeBps: 10.0,
      takerFeeBps: 10.0,
      typicalSpreadBps: 1.5,
      typicalDailyVolumeTier: 'HIGH_LIQUIDITY',
    },
    aegentixPolicy: {
      isTreasurySettlementEligible: false, // Disallowed for treasury reserves
      isArbitrageDiscoveryActive: true,    // Monitored for cross-venue alpha
      riskClassification: 'HIGH_OFFSHORE_EXPOSURE',
    },
  },
  {
    instrumentId: 'KRAKEN:XRP-USDT:SPOT',
    venueId: 'KRAKEN',
    marketCategory: 'SPOT_CRYPTO',
    baseAsset: 'XRP',
    quoteAsset: 'USDT',
    quoteCategory: 'NON_TREASURY_STABLECOIN',
    pairSymbol: 'XRPUSDT',
    formattedDisplay: 'XRP / Tether USD (Kraken Spot)',
    isTradableForUsCustomers: true,
    jurisdictionEligibility: 'US_EXCLUDING_NY',
    applicableRegulators: ['FINCEN', 'STATE_BANKING_DEPT'],
    microstructure: {
      hasLiveOrderBook: true,
      minOrderSize: 5.0,
      priceTickSize: 0.0001,
      makerFeeBps: 16.0,
      takerFeeBps: 26.0,
      typicalSpreadBps: 2.1,
      typicalDailyVolumeTier: 'HIGH_LIQUIDITY',
    },
    aegentixPolicy: {
      isTreasurySettlementEligible: false,
      isArbitrageDiscoveryActive: true,
      riskClassification: 'HIGH_OFFSHORE_EXPOSURE',
    },
  },

  // ── DOMAIN 2: DERIVATIVES (Futures, Perpetuals, Options — Zero Spot Co-mingling) ─
  {
    instrumentId: 'CME_GROUP:BTC-FUT-2026M11:DERIVATIVE',
    venueId: 'CME_GROUP',
    marketCategory: 'DERIVATIVES',
    baseAsset: 'BTC',
    quoteAsset: 'USD',
    quoteCategory: 'FIAT_USD',
    pairSymbol: 'BTCX26',
    formattedDisplay: 'CME Micro Bitcoin Futures (Nov 2026 Monthly)',
    isTradableForUsCustomers: true,
    jurisdictionEligibility: 'US_NATIONWIDE',
    applicableRegulators: ['CFTC'],
    derivativeDetails: {
      contractType: 'CALENDAR_FUTURES',
      underlyingAsset: 'BTC',
      settlementAsset: 'USD',
      expiryDate: '2026-11-27T16:00:00Z',
      requiresEcpStatus: false, // Micro futures retail-accessible via FCM
    },
    microstructure: {
      hasLiveOrderBook: true,
      minOrderSize: 0.1, // 0.1 BTC multiplier
      priceTickSize: 5.0,
      makerFeeBps: 8.0,
      takerFeeBps: 12.0,
      typicalSpreadBps: 1.0,
      typicalDailyVolumeTier: 'HIGH_LIQUIDITY',
    },
    aegentixPolicy: {
      isTreasurySettlementEligible: false,
      isArbitrageDiscoveryActive: true,
      riskClassification: 'MEDIUM_EXECUTION_ONLY',
    },
  },
  {
    instrumentId: 'COINBASE:ETH-NANO-FUT:DERIVATIVE',
    venueId: 'COINBASE',
    marketCategory: 'DERIVATIVES',
    baseAsset: 'ETH',
    quoteAsset: 'USD',
    quoteCategory: 'FIAT_USD',
    pairSymbol: 'ET-FUT',
    formattedDisplay: 'Coinbase Nano Ether Futures Contract',
    isTradableForUsCustomers: true,
    jurisdictionEligibility: 'US_NATIONWIDE',
    applicableRegulators: ['CFTC'],
    derivativeDetails: {
      contractType: 'CALENDAR_FUTURES',
      underlyingAsset: 'ETH',
      settlementAsset: 'USD',
      requiresEcpStatus: false,
    },
    microstructure: {
      hasLiveOrderBook: true,
      minOrderSize: 0.1,
      priceTickSize: 0.50,
      makerFeeBps: 5.0,
      takerFeeBps: 10.0,
      typicalSpreadBps: 2.0,
      typicalDailyVolumeTier: 'MEDIUM_LIQUIDITY',
    },
    aegentixPolicy: {
      isTreasurySettlementEligible: false,
      isArbitrageDiscoveryActive: true,
      riskClassification: 'MEDIUM_EXECUTION_ONLY',
    },
  },

  // ── DOMAIN 3: TRADITIONAL & TOKENIZED MARKETS (Equities, RWAs, Forex, Gold) ──
  {
    instrumentId: 'ONDO_FINANCE:OUSG-USDC:RWA',
    venueId: 'ONDO_FINANCE',
    marketCategory: 'TRADITIONAL_AND_TOKENIZED',
    baseAsset: 'OUSG',
    quoteAsset: 'USDC',
    quoteCategory: 'APPROVED_TREASURY_STABLECOIN',
    pairSymbol: 'OUSG-USDC',
    formattedDisplay: 'Ondo Short-Term US Government Bond Fund (Tokenized)',
    isTradableForUsCustomers: true,
    jurisdictionEligibility: 'US_ACCREDITED_ONLY',
    applicableRegulators: ['SEC'],
    traditionalDetails: {
      tradType: 'TOKENIZED_US_TREASURY',
      isinOrCusip: 'US68234L1098',
      underlyingInstrument: 'BlackRock BVI Fed Fund (BUIDL) / US T-Bills',
      smartContractAddress: '0x1B19C555D23487FCa295BA2244C3F037D974a625',
      issuanceChain: 'Ethereum',
      transferAgentOrBroker: 'Securitize LLC / Ondo Finance Inc.',
    },
    microstructure: {
      hasLiveOrderBook: false, // Daily continuous mint/redeem at NAV
      minOrderSize: 10000.0,
      priceTickSize: 0.0001,
      makerFeeBps: 0.0,
      takerFeeBps: 0.0,
      typicalSpreadBps: 0.0,
      typicalDailyVolumeTier: 'HIGH_LIQUIDITY',
    },
    aegentixPolicy: {
      isTreasurySettlementEligible: true, // Sovereign cash reserve yield vehicle
      isArbitrageDiscoveryActive: false,
      riskClassification: 'LOW_RESERVE_GRADE',
    },
  },
  {
    instrumentId: 'UPHOLD:XAU-USD:COMMODITY',
    venueId: 'UPHOLD',
    marketCategory: 'TRADITIONAL_AND_TOKENIZED',
    baseAsset: 'XAU',
    quoteAsset: 'USD',
    quoteCategory: 'FIAT_USD',
    pairSymbol: 'XAU-USD',
    formattedDisplay: 'Physical Allocated Gold (Troy Ounce) / US Dollar',
    isTradableForUsCustomers: true,
    jurisdictionEligibility: 'US_SELECT_STATES',
    applicableRegulators: ['CFTC', 'STATE_BANKING_DEPT'],
    traditionalDetails: {
      tradType: 'COMMODITY',
      underlyingInstrument: 'London Bullion Market Association (LBMA) Good Delivery Bar',
      transferAgentOrBroker: 'Brinks Vaults / Uphold HQ Inc.',
    },
    microstructure: {
      hasLiveOrderBook: true,
      minOrderSize: 0.001,
      priceTickSize: 0.01,
      makerFeeBps: 20.0,
      takerFeeBps: 40.0,
      typicalSpreadBps: 4.5,
      typicalDailyVolumeTier: 'HIGH_LIQUIDITY',
    },
    aegentixPolicy: {
      isTreasurySettlementEligible: true,
      isArbitrageDiscoveryActive: true,
      riskClassification: 'LOW_RESERVE_GRADE',
    },
  },
];

// ============================================================================
// 4. REGISTRY ENGINE QUERY INTERFACE
// ============================================================================
export class MarketRegistryEngine {
  private venues = US_EXCHANGE_VENUES;
  private stablecoins = STABLECOIN_REGISTRY;
  private instruments = MASTER_INSTRUMENTS_CATALOG;

  public getVenues(): ExchangeVenueProfile[] {
    return Object.values(this.venues);
  }

  public getVenue(venueId: string): ExchangeVenueProfile | undefined {
    return this.venues[venueId.toUpperCase()];
  }

  public getStablecoins(): StablecoinMetadata[] {
    return Object.values(this.stablecoins);
  }

  public getTreasuryApprovedStablecoins(): StablecoinMetadata[] {
    return Object.values(this.stablecoins).filter(s => s.isAegentixTreasuryApproved);
  }

  public queryInstruments(filter?: {
    category?: MarketCategory;
    venueId?: string;
    quoteAsset?: string;
    treasuryEligibleOnly?: boolean;
    usTradableOnly?: boolean;
  }): MarketInstrument[] {
    return this.instruments.filter(inst => {
      if (filter?.category && inst.marketCategory !== filter.category) return false;
      if (filter?.venueId && inst.venueId.toUpperCase() !== filter.venueId.toUpperCase()) return false;
      if (filter?.quoteAsset && inst.quoteAsset.toUpperCase() !== filter.quoteAsset.toUpperCase()) return false;
      if (filter?.treasuryEligibleOnly && !inst.aegentixPolicy.isTreasurySettlementEligible) return false;
      if (filter?.usTradableOnly && !inst.isTradableForUsCustomers) return false;
      return true;
    });
  }

  public getRegistryOverview() {
    const totalVenues = Object.keys(this.venues).length;
    const totalInstruments = this.instruments.length;
    const spotCount = this.instruments.filter(i => i.marketCategory === 'SPOT_CRYPTO').length;
    const derivCount = this.instruments.filter(i => i.marketCategory === 'DERIVATIVES').length;
    const tradCount = this.instruments.filter(i => i.marketCategory === 'TRADITIONAL_AND_TOKENIZED').length;
    const treasuryApprovedQuotes = this.getTreasuryApprovedStablecoins().map(s => s.symbol);

    const quoteDistribution: Record<string, number> = {};
    for (const inst of this.instruments) {
      quoteDistribution[inst.quoteAsset] = (quoteDistribution[inst.quoteAsset] || 0) + 1;
    }

    return {
      status: 'ONLINE',
      systemVersion: 'AEGENTIX_US_MARKET_REGISTRY_v1.0',
      totalVenuesTracked: totalVenues,
      venues: Object.keys(this.venues),
      totalInstrumentsCataloged: totalInstruments,
      marketDomainSegregation: {
        spotCryptoInstruments: spotCount,
        derivativesContracts: derivCount,
        traditionalAndTokenizedAssets: tradCount,
      },
      treasuryPolicy: {
        approvedReserveStablecoins: treasuryApprovedQuotes,
        nonReserveDiscoveryCurrencies: ['USDT', 'DAI', 'FDUSD', 'EUR'],
        invariant: 'ZERO_COMMINGLING_OF_DERIVATIVE_MARGIN_WITH_SPOT_OR_TREASURY_RESERVES',
      },
      quoteCurrencyInventoryBreakdown: quoteDistribution,
      lastUpdatedAt: new Date().toISOString(),
    };
  }
}

export const marketRegistryEngine = new MarketRegistryEngine();
