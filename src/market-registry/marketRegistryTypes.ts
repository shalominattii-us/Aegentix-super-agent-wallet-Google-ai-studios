/**
 * AEGENTIX U.S. EXCHANGE & INSTRUMENT MARKET-PAIR INTELLIGENCE REGISTRY
 * 
 * Strict Three-Domain Architectural Segregation:
 * 1. SPOT_CRYPTO: Actual physically settled cryptographic assets, segmented across all USD,
 *    USDC, USDT, PYUSD, RLUSD, DAI, GUSD, and other quote currencies.
 * 2. DERIVATIVES: Perpetual swaps, quarterly/monthly futures, and options contracts.
 *    Strictly segregated from spot ownership with zero co-mingling of balance/risk metrics.
 * 3. TRADITIONAL_AND_TOKENIZED: Equities, commodities, foreign exchange (FX), and tokenized
 *    Real World Assets (RWAs / US Treasuries). Each tagged with dedicated CFTC, SEC, or FINRA
 *    venue classifications.
 * 
 * Treasury Policy Invariant:
 * Market discovery catalogs all tradable pairs across all quote currencies; however,
 * AEGENTIX sovereign treasury operations enforce a separate strict approved-stablecoin policy
 * (e.g. USDC, PYUSD, RLUSD, GUSD approved; USDT/others restricted to discovery & arbitrage only).
 */

export type MarketCategory = 'SPOT_CRYPTO' | 'DERIVATIVES' | 'TRADITIONAL_AND_TOKENIZED';

export type DerivativeContractType = 'PERPETUAL' | 'CALENDAR_FUTURES' | 'VANILLA_OPTIONS' | 'BASIS_CONTRACT';

export type TraditionalAssetType = 'EQUITY' | 'COMMODITY' | 'FOREX' | 'TOKENIZED_US_TREASURY' | 'TOKENIZED_PRIVATE_CREDIT' | 'COMMODITY_BACKED_TOKEN';

export type JurisdictionTier = 
  | 'US_NATIONWIDE'          // Available to all eligible US residents
  | 'US_EXCLUDING_NY'        // Restricted in NY (lacks NYDFS BitLicense / Greenlist)
  | 'US_SELECT_STATES'       // State MTL approvals vary (e.g. WA, TX exclusions)
  | 'US_ACCREDITED_ONLY'     // Requires Reg D / Qualified Purchaser verification
  | 'US_INSTITUTIONAL_ONLY'  // Requires CFTC ECP (Eligible Contract Participant)
  | 'OFFSHORE_PROHIBITED';   // Banned for US persons

export type RegulatoryBody = 'SEC' | 'CFTC' | 'NYDFS' | 'FINCEN' | 'FINRA' | 'OCC' | 'STATE_BANKING_DEPT';

export type QuoteAssetCategory = 
  | 'FIAT_USD' 
  | 'APPROVED_TREASURY_STABLECOIN' 
  | 'NON_TREASURY_STABLECOIN' 
  | 'CRYPTO_QUOTE' 
  | 'FIAT_NON_USD';

export interface StablecoinMetadata {
  symbol: string;
  name: string;
  issuer: string;
  jurisdiction: string;
  regulatoryClassification: string;
  reserveAttestationStandard: string;
  pegTarget: 'USD' | 'EUR' | 'GOLD';
  isAegentixTreasuryApproved: boolean; // Policy gate: true = eligible for treasury reserves
  treasuryCustodyRationale: string;
  primarySettlementChains: string[];
}

export interface ExchangeVenueProfile {
  venueId: string;
  name: string;
  legalEntity: string;
  operatingJurisdiction: string;
  usRegulatoryLicenses: string[];
  regulatoryBodies: RegulatoryBody[];
  jurisdictionTier: JurisdictionTier;
  supportedMarketCategories: MarketCategory[];
  supportedQuoteCurrencies: string[];
  spotPairCountEst: number;
  stablecoinQuotedRatioEst: number; // e.g. 0.35 = 35% of pairs are stablecoin-quoted
  apiAccess: {
    restBaseUrl: string;
    wsBaseUrl: string;
    publicRateLimits: string;
    requiresAuthForL2Orderbook: boolean;
    supportsStreamingL2: boolean;
  };
  settlementAndCustody: {
    supportsFiatWithdrawal: boolean;
    fiatRails: string[];
    supportedCryptoWithdrawalNetworks: string[];
  };
  restrictionsNotes: string;
}

export interface MarketInstrument {
  instrumentId: string; // Canonical: `${venueId}:${baseAsset}-${quoteAsset}:${marketCategory}`
  venueId: string;
  marketCategory: MarketCategory;
  baseAsset: string;
  quoteAsset: string;
  quoteCategory: QuoteAssetCategory;
  pairSymbol: string; // Venue-specific representation, e.g. "BTC-USD" or "XBTUSDT"
  formattedDisplay: string; // e.g. "BTC / USD (Spot)"
  isTradableForUsCustomers: boolean;
  jurisdictionEligibility: JurisdictionTier;
  applicableRegulators: RegulatoryBody[];
  
  // Derivatives specific (undefined if Spot)
  derivativeDetails?: {
    contractType: DerivativeContractType;
    underlyingAsset: string;
    settlementAsset: string;
    expiryDate?: string; // null for PERPETUAL
    requiresEcpStatus: boolean; // CFTC Eligible Contract Participant
  };

  // Traditional & Tokenized specific (undefined if Crypto)
  traditionalDetails?: {
    tradType: TraditionalAssetType;
    isinOrCusip?: string;
    underlyingInstrument?: string;
    smartContractAddress?: string;
    issuanceChain?: string;
    transferAgentOrBroker: string;
  };

  // Order Book & Market Quality Microstructure
  microstructure: {
    hasLiveOrderBook: boolean;
    minOrderSize: number;
    priceTickSize: number;
    makerFeeBps: number;
    takerFeeBps: number;
    typicalSpreadBps: number;
    typicalDailyVolumeTier: 'HIGH_LIQUIDITY' | 'MEDIUM_LIQUIDITY' | 'LOW_LIQUIDITY';
  };

  // Treasury & Custody Policy
  aegentixPolicy: {
    isTreasurySettlementEligible: boolean;
    isArbitrageDiscoveryActive: boolean;
    riskClassification: 'LOW_RESERVE_GRADE' | 'MEDIUM_EXECUTION_ONLY' | 'HIGH_OFFSHORE_EXPOSURE';
  };
}
