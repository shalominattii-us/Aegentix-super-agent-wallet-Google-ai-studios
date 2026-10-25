/**
 * Aegentix Super Agent Wallet – Coinbase Connection Payload
 * Generated for CyberCore / Antigravity integration
 */

export interface CoinbaseAccount {
  uuid: string;
  currency: string;
  available: string;
  type: "crypto" | "fiat";
}

export interface CoinbaseBalances {
  total_usd: string;
  cash_equivalent_usd: string;
  crypto_usd: string;
}

export interface CoinbaseAuth {
  method: "cdp_jwt_or_oauth" | "cdp_jwt" | "oauth";
  notes?: string;
}

export interface AegentixMeta {
  target: string;
  integration_mode: "exchange_gateway" | "treasury_source" | "agent_wallet";
  authority_level: "cadet" | "operator" | "operator+" | "commander" | "sovereign";
  event_namespace: string;
}

export interface SuperAgentWalletPayload {
  source: "coinbase-advanced-trade";
  wallet_name: string;
  status: "ready" | "funding" | "disabled" | "error";
  ready_for_transactions: boolean;
  portfolio: {
    uuid: string;
    name: string;
    type: "DEFAULT" | "CONSUMER";
  };
  accounts: {
    usdc: CoinbaseAccount;
    btc: CoinbaseAccount;
    usd_cash: CoinbaseAccount;
  };
  balances: CoinbaseBalances;
  capabilities: string[];
  auth: CoinbaseAuth;
  aegentix: AegentixMeta;
  timestamp: string;
  version: string;
}

/** Runtime config loaded from environment + payload */
export interface CoinbaseRuntimeConfig {
  portfolioUuid: string;
  apiKeyName?: string;
  privateKey?: string;
  payload: SuperAgentWalletPayload;
}

/**
 * Load and validate the Super Agent Wallet payload.
 * Prefer loading from a JSON file or env-injected object — never hard-code secrets.
 */
export function loadSuperAgentWallet(
  payload: SuperAgentWalletPayload | string
): CoinbaseRuntimeConfig {
  const data: SuperAgentWalletPayload =
    typeof payload === "string" ? JSON.parse(payload) : payload;

  if (data.source !== "coinbase-advanced-trade") {
    throw new Error("Invalid source – expected coinbase-advanced-trade");
  }
  if (!data.portfolio?.uuid) {
    throw new Error("Missing portfolio.uuid");
  }
  if (!data.ready_for_transactions) {
    console.warn("[SuperAgentWallet] ready_for_transactions is false");
  }

  return {
    portfolioUuid: data.portfolio.uuid,
    apiKeyName: process.env.COINBASE_API_KEY_NAME,
    privateKey: process.env.COINBASE_API_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    payload: data,
  };
}

/**
 * Convenience: load from a JSON file path (for Antigravity / local server)
 */
export async function loadSuperAgentWalletFromFile(
  filePath: string
): Promise<CoinbaseRuntimeConfig> {
  const fs = await import("fs/promises");
  const raw = await fs.readFile(filePath, "utf-8");
  return loadSuperAgentWallet(raw);
}
