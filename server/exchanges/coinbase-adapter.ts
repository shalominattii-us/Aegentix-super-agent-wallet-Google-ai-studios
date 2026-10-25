/**
 * Aegentix Coinbase Advanced Trade Adapter
 * Scoped to Super Agent Wallet portfolio
 */

import { randomUUID } from "crypto";
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
}

export default CoinbaseAdapter;
