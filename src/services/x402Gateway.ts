import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import os from 'os';
import path from 'path';
import fs from 'fs';

function loadX402SigningKey(): string {
    const fromEnv = (process.env.AEGENTIX_SOVEREIGN_HMAC_KEY || '').trim();
    if (fromEnv && fromEnv.length >= 32) return fromEnv;
    const keyPath = path.join(os.homedir(), '.aegentix-dev-keys', 'sovereign_hmac.key');
    if (fs.existsSync(keyPath)) {
        const key = fs.readFileSync(keyPath, 'utf-8').trim();
        if (key.length >= 32) return key;
    }
    throw new Error('CRITICAL: Missing sovereign_hmac.key for x402Gateway cryptographic verification.');
}
const X402_HMAC_KEY = loadX402SigningKey();
const MAX_VOUCHER_AGE_MS = 5 * 60 * 1000; // 5-minute replay window

const DATA_DIR = path.resolve(process.cwd(), 'data');
const NONCE_LEDGER_PATH = path.join(DATA_DIR, 'x402_used_nonces.jsonl');

/**
 * Aegentix x402 Micropayment & AP2 Agent Authorization Gateway
 * 
 * Spec: HTTP-Native Agent Payment Protocol (Coinbase / Cloudflare / Linux Foundation x402)
 * Purpose:
 * 1. Enables HTTP-native machine payments where autonomous AI agents pay per request / micro-tranche.
 * 2. Intercepts queries to premium agentic intelligence, models, and deep order book streams.
 * 3. Enforces AP2 (Agent Payment Authorization Protocol) spending limits and cryptographic vouchers.
 * 4. Persists all used voucher nonces to disk (`data/x402_used_nonces.jsonl` with fsync) so process
 *    restarts never reopen the 5-minute replay window.
 */

export interface X402PaymentVoucher {
    version: string;
    agentId: string;
    chainId: number; // 8453 (Base) or 101 (Solana)
    token: string; // 'USDC'
    amountUsd: number;
    nonce: string;
    signature: string;
    timestamp: number;
}

export interface AP2SpendingMandate {
    userId: string;
    mandateId: string;
    maxPerTxUsd: number;
    maxDailyUsd: number;
    approvedTokens: string[];
    allowedTargetContracts: string[];
    expiresAt: number;
}

export class X402Gateway {
    private baseUsdcContract = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
    private baseMasterVault = '0x650a1b4872606d15cb99833b5ec72b8e197ffa8a';
    private solanaUsdcMint = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
    private solanaVault = 'DWKfCGtjWRAU5ZuB4vHmkhfzjK7Q5vTVBoTxr5r5nSJ3';
    private usedNonces: Map<string, number> = new Map();

    constructor() {
        this.ensureDataDir();
        this.syncNoncesFromDisk(true);
    }

    private ensureDataDir(): void {
        if (!fs.existsSync(DATA_DIR)) {
            fs.mkdirSync(DATA_DIR, { recursive: true });
        }
    }

    /**
     * Synchronizes active nonces from `data/x402_used_nonces.jsonl` on disk.
     * Optionally compacts expired nonces older than 2x MAX_VOUCHER_AGE_MS on startup.
     */
    private syncNoncesFromDisk(compactExpired: boolean = false): void {
        const now = Date.now();
        // Prune expired in-memory nonces
        for (const [n, ts] of this.usedNonces.entries()) {
            if (now - ts > MAX_VOUCHER_AGE_MS * 2) {
                this.usedNonces.delete(n);
            }
        }
        if (!fs.existsSync(NONCE_LEDGER_PATH)) {
            return;
        }
        const raw = fs.readFileSync(NONCE_LEDGER_PATH, 'utf-8');
        const lines = raw.split(/\r?\n/).filter(Boolean);
        const retainedLines: string[] = [];
        for (const line of lines) {
            try {
                const parsed = JSON.parse(line);
                const nonce = typeof parsed?.nonce === 'string' ? parsed.nonce : '';
                const recordedAt = Number(parsed?.recordedAt || parsed?.voucherTimestamp || 0);
                if (nonce && recordedAt > 0 && (now - recordedAt) <= MAX_VOUCHER_AGE_MS * 2) {
                    this.usedNonces.set(nonce, recordedAt);
                    retainedLines.push(line);
                }
            } catch {
                // Ignore corrupted lines
            }
        }
        if (compactExpired && retainedLines.length !== lines.length) {
            const tempPath = `${NONCE_LEDGER_PATH}.tmp.${process.pid}`;
            const content = retainedLines.length > 0 ? retainedLines.join('\n') + '\n' : '';
            const fd = fs.openSync(tempPath, 'w', 0o600);
            try {
                fs.writeFileSync(fd, content, 'utf-8');
                fs.fsyncSync(fd);
            } finally {
                fs.closeSync(fd);
            }
            fs.renameSync(tempPath, NONCE_LEDGER_PATH);
        }
    }

    /**
     * Durably appends and fsyncs a consumed voucher nonce to `data/x402_used_nonces.jsonl`.
     * Fails closed (throws) if the nonce cannot be persisted to disk.
     */
    private persistNonceToLedger(voucher: X402PaymentVoucher, recordedAt: number): void {
        this.ensureDataDir();
        const entry = JSON.stringify({
            nonce: String(voucher.nonce),
            agentId: String(voucher.agentId),
            chainId: Number(voucher.chainId),
            amountUsd: Number(voucher.amountUsd),
            voucherTimestamp: Number(voucher.timestamp),
            recordedAt,
        }) + '\n';
        const fd = fs.openSync(NONCE_LEDGER_PATH, 'a', 0o600);
        try {
            fs.writeFileSync(fd, entry, 'utf-8');
            fs.fsyncSync(fd);
        } finally {
            fs.closeSync(fd);
        }
    }

    public verifyVoucherCryptographically(voucher: X402PaymentVoucher): { valid: boolean; reason?: string } {
        if (!voucher || typeof voucher !== 'object') {
            return { valid: false, reason: 'Malformed voucher payload' };
        }
        if (!voucher.agentId || !voucher.nonce || !voucher.signature || !voucher.timestamp) {
            return { valid: false, reason: 'Missing mandatory voucher fields (agentId, nonce, signature, timestamp)' };
        }
        const nonceStr = String(voucher.nonce).trim();
        if (nonceStr.length < 8 || nonceStr.length > 128) {
            return { valid: false, reason: 'Invalid voucher nonce length (must be 8..128 chars)' };
        }
        const now = Date.now();
        if (Math.abs(now - Number(voucher.timestamp)) > MAX_VOUCHER_AGE_MS) {
            return { valid: false, reason: 'Voucher timestamp expired or outside 5-minute window' };
        }
        // Sync persisted ledger from disk to catch nonces across restarts or multi-process workers
        try {
            this.syncNoncesFromDisk(false);
        } catch (err: any) {
            return { valid: false, reason: `Nonce ledger read failure: ${err?.message || 'disk error'}` };
        }
        if (this.usedNonces.has(nonceStr)) {
            return { valid: false, reason: 'Voucher nonce replay detected (persisted ledger)' };
        }
        const payloadToSign = `${voucher.agentId}:${voucher.chainId}:${voucher.token || 'USDC'}:${voucher.amountUsd}:${nonceStr}:${voucher.timestamp}`;
        const expectedSig = '0x' + crypto.createHmac('sha256', X402_HMAC_KEY).update(payloadToSign).digest('hex');
        const sigBuf = Buffer.from(String(voucher.signature), 'utf-8');
        const expBuf = Buffer.from(expectedSig, 'utf-8');
        if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
            return { valid: false, reason: 'Invalid x402 HMAC-SHA256 voucher signature' };
        }
        try {
            this.persistNonceToLedger(voucher, now);
        } catch (err: any) {
            return { valid: false, reason: `Failed to persist nonce to ledger: ${err?.message || 'disk write error'}` };
        }
        this.usedNonces.set(nonceStr, now);
        return { valid: true };
    }

    // Default AP2 Mandate for local autonomous agent operations
    private localMandate: AP2SpendingMandate = {
        userId: 'sovereign_operator',
        mandateId: 'ap2-mandate-01',
        maxPerTxUsd: 10.00,
        maxDailyUsd: 500.00,
        approvedTokens: ['USDC', 'USD', 'XRP', 'SOL'],
        allowedTargetContracts: ['Base_USDC', 'Solana_USDC', 'XRPL_Native'],
        expiresAt: Date.now() + (365 * 24 * 3600 * 1000)
    };

    public getGatewayConfig() {
        return {
            version: 'x402-v1.0',
            specOrigin: 'Coinbase/Cloudflare/Linux Foundation x402',
            status: 'ACTIVE_GATEWAY',
            noncePersistence: NONCE_LEDGER_PATH,
            settlementChains: [
                {
                    chain: 'Base Mainnet (8453)',
                    token: 'USDC',
                    contract: this.baseUsdcContract,
                    payTo: this.baseMasterVault
                },
                {
                    chain: 'Solana Mainnet (101)',
                    token: 'USDC',
                    mint: this.solanaUsdcMint,
                    payTo: this.solanaVault
                }
            ],
            ap2Mandate: this.localMandate,
            antiCentralizedRails: 'STRIPE_AND_FIAT_WRAPPERS_HARD_BLOCKED'
        };
    }

    /**
     * Express middleware enforcing HTTP 402 Payment Required for AI Agent queries.
     * @param priceUsd Micropayment required in USD/USDC (e.g. 0.001 USD per inference / depth query)
     * @param serviceId Target service identifier
     */
    public guard(priceUsd: number = 0.001, serviceId: string = 'a2a-service') {
        return (req: Request, res: Response, next: NextFunction) => {
            const authHeader = req.headers['authorization'] || '';
            const x402VoucherHeader = req.headers['x-402-voucher'] as string;

            // 1. Check for x402 Authorization Voucher
            let rawVoucher = '';
            if (x402VoucherHeader) {
                rawVoucher = x402VoucherHeader;
            } else if (authHeader.startsWith('x402 ') || authHeader.startsWith('X402 ')) {
                rawVoucher = authHeader.substring(5).trim();
            }

            // 2. If voucher missing, respond with standard HTTP 402 Payment Required
            if (!rawVoucher) {
                res.setHeader('X-402-Version', '1.0');
                res.setHeader('X-402-Price-USD', String(priceUsd));
                res.setHeader('X-402-Accepted-Tokens', 'USDC');
                res.setHeader('X-402-PayTo-Base', this.baseMasterVault);
                res.setHeader('X-402-PayTo-Solana', this.solanaVault);

                return res.status(402).json({
                    success: false,
                    error: 'PAYMENT_REQUIRED',
                    code: 402,
                    service: serviceId,
                    pricing: {
                        amount: priceUsd,
                        currency: 'USDC',
                        microCents: Math.round(priceUsd * 100000)
                    },
                    paymentRails: {
                        base: {
                            chainId: 8453,
                            tokenContract: this.baseUsdcContract,
                            recipient: this.baseMasterVault
                        },
                        solana: {
                            chainId: 101,
                            tokenMint: this.solanaUsdcMint,
                            recipient: this.solanaVault
                        }
                    },
                    ap2MandateRequired: true,
                    instructions: 'Attach signed x402 micropayment voucher via header: "X-402-Voucher: <payload>"'
                });
            }

            // 3. Verify and parse the voucher
            try {
                let voucher: X402PaymentVoucher;
                try {
                    voucher = JSON.parse(Buffer.from(rawVoucher, 'base64').toString('utf-8'));
                } catch {
                    voucher = JSON.parse(rawVoucher);
                }

                // Cryptographic HMAC signature, timestamp freshness, and persistent nonce replay check
                const cryptoCheck = this.verifyVoucherCryptographically(voucher);
                if (!cryptoCheck.valid) {
                    return res.status(401).json({
                        success: false,
                        error: 'INVALID_VOUCHER_SIGNATURE_OR_REPLAY',
                        message: cryptoCheck.reason
                    });
                }

                // Invariant checks
                if (voucher.amountUsd < priceUsd) {
                    return res.status(402).json({
                        success: false,
                        error: 'INSUFFICIENT_VOUCHER_AMOUNT',
                        required: priceUsd,
                        provided: voucher.amountUsd
                    });
                }

                // AP2 Spending Limit Check
                if (voucher.amountUsd > this.localMandate.maxPerTxUsd) {
                    return res.status(403).json({
                        success: false,
                        error: 'AP2_MANDATE_EXCEEDED',
                        message: `Transaction size $${voucher.amountUsd} exceeds AP2 maximum limit of $${this.localMandate.maxPerTxUsd}`
                    });
                }

                // Attach verified agent context to request
                (req as any).x402Auth = {
                    verified: true,
                    agentId: voucher.agentId || 'anonymous_autonomous_agent',
                    paidAmountUsd: voucher.amountUsd,
                    settledChain: voucher.chainId === 101 ? 'Solana' : 'Base',
                    timestamp: voucher.timestamp
                };

                next();
            } catch (err: any) {
                return res.status(400).json({
                    success: false,
                    error: 'INVALID_X402_VOUCHER',
                    message: err.message || 'Failed to parse x402 payment proof'
                });
            }
        };
    }
}

export const x402Gateway = new X402Gateway();
