/**
 * Aegentix Coinbase Advanced Trade Adapter
 * Scoped to Super Agent Wallet portfolio
 * Expanded for Zero-Cap Flywheel treasury sink readiness
 */

import { loadSuperAgentWalletFromFile, CoinbaseRuntimeConfig } from "../types/coinbase-wallet";

// Lightweight JWT helper – replace with @coinbase/cdp-sdk generateJwt in production
async function buildAuthHeaders(
  method: string,
  path: string,
  apiKeyName: string,
  privateKey: string
): Promise<Record<string, string>> {
  // Production: use official CDP JWT generation
  // import { generateJwt } from "@coinbase/cdp-sdk";
  // const jwt = await generateJwt({ apiKeyId: apiKeyName, apiKeySecret: privateKey, requestMethod: method, requestPath: path });
  return {
    Authorization: `Bearer ${process.env.COINBASE_JWT || ""}`,
    "Content-Type": "application/json",
    "CB-ACCESS-KEY": apiKeyName,
  };
}

export class CoinbaseAdapter {
  private config: CoinbaseRuntimeConfig;
  private baseUrl = "https://api.coinbase.com";

  constructor(config: CoinbaseRuntimeConfig) {
    this.config = config;
  }

  static async fromConfigFile(path = "./config/super-agent-wallet.json") {
    const config = await loadSuperAgentWalletFromFile(path);
    return new CoinbaseAdapter(config);
  }

  get portfolioUuid() {
    return this.config.portfolioUuid;
  }

  get payload() {
    return this.config.payload;
  }

  /** Return current snapshot from the loaded payload (no network call) */
  getLocalBalances() {
    return this.config.payload.balances;
  }

  getLocalAccounts() {
    return this.config.payload.accounts;
  }

  /**
   * Zero-Cap Flywheel integration:
   * Returns the account UUID that should receive treasury / profit deposits.
   * Prefer USDC for stable settlement.
   */
  getTreasuryAccountUuid(): string {
    return this.config.payload.accounts.usdc.uuid;
  }

  /**
   * Placeholder for future live deposit / transfer into the Super Agent Wallet.
   * When CDP credentials + transfer permissions are live, this becomes the
   * on-ramp from on-chain Gas Tank / Treasury into Coinbase.
   */
  async prepareTreasuryDeposit(amountUsd: number, memo?: string) {
    return {
      ready: true,
      portfolioUuid: this.portfolioUuid,
      accountUuid: this.getTreasuryAccountUuid(),
      currency: "USDC",
      amount: amountUsd.toFixed(6),
      memo: memo || "zero-cap-treasury-inflow",
      note: "Execution requires live CDP key with transfer scope. Currently advisory only.",
    };
  }
}

export default CoinbaseAdapter;
