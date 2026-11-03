import crypto from 'crypto';
import fs from 'fs';
import os from 'os';
import path from 'path';

function loadClientSigningKey(explicitKey?: string): string {
    if (explicitKey && explicitKey.length >= 32) return explicitKey.trim();
    const fromEnv = (process.env.AEGENTIX_SOVEREIGN_HMAC_KEY || '').trim();
    if (fromEnv && fromEnv.length >= 32) return fromEnv;
    const keyPath = path.join(os.homedir(), '.aegentix-dev-keys', 'sovereign_hmac.key');
    if (fs.existsSync(keyPath)) {
        const key = fs.readFileSync(keyPath, 'utf-8').trim();
        if (key.length >= 32) return key;
    }
    throw new Error('CRITICAL: Missing sovereign_hmac.key for x402Client voucher signing.');
}

/**
 * Aegentix Autonomous x402 Micropayment Client
 * 
 * Allows local AI agents to autonomously handle HTTP 402 Payment Required challenges,
 * sign AP2 spending vouchers on-the-fly, and settle micro-fees without human interaction.
 */

export interface X402ClientConfig {
    agentId: string;
    chainId: number; // 8453 for Base, 101 for Solana
    signingKey: string;
    maxPerTxUsd: number;
    logPath?: string;
}

export class X402Client {
    private agentId: string;
    private chainId: number;
    private signingKey: string;
    private maxPerTxUsd: number;
    private logPath: string;

    constructor(config?: Partial<X402ClientConfig>) {
        this.agentId = config?.agentId || 'Aegentix_Autonomous_Trader_01';
        this.chainId = config?.chainId || 8453;
        this.signingKey = loadClientSigningKey(config?.signingKey);
        this.maxPerTxUsd = config?.maxPerTxUsd || 10.00;
        this.logPath = config?.logPath || path.join(process.cwd(), 'public', 'x402_micropayment_receipts.jsonl');
    }

    /**
     * Executes an HTTP request with automated x402 402 Payment Required interception and retry.
     */
    public async fetch(url: string, init?: RequestInit): Promise<Response> {
        // 1. Initial attempt
        const response = await globalThis.fetch(url, init);

        // If resource doesn't require payment, return directly
        if (response.status !== 402) {
            return response;
        }

        console.log(`[x402 CLIENT] Caught HTTP 402 Payment Required from ${url}`);

        // 2. Parse 402 challenge parameters
        const priceHeader = response.headers.get('x-402-price-usd');
        let requiredPriceUsd = priceHeader ? parseFloat(priceHeader) : 0.001;

        // Try reading body for extra pricing metadata if available
        let bodyData: any = {};
        try {
            const clone = response.clone();
            bodyData = await clone.json();
            if (bodyData.pricing?.amount) {
                requiredPriceUsd = bodyData.pricing.amount;
            }
        } catch {}

        // AP2 Mandate safety check
        if (requiredPriceUsd > this.maxPerTxUsd) {
            throw new Error(`[x402 AP2 REJECTION] Price $${requiredPriceUsd} exceeds AP2 mandate limit of $${this.maxPerTxUsd}`);
        }

        // 3. Construct and sign cryptographic x402 payment voucher with HMAC-SHA256
        const nonce = crypto.randomBytes(12).toString('hex');
        const timestamp = Date.now();
        const payloadToSign = `${this.agentId}:${this.chainId}:USDC:${requiredPriceUsd}:${nonce}:${timestamp}`;
        const signature = crypto.createHmac('sha256', this.signingKey).update(payloadToSign).digest('hex');

        const voucher = {
            version: '1.0',
            agentId: this.agentId,
            chainId: this.chainId,
            token: 'USDC',
            amountUsd: requiredPriceUsd,
            nonce,
            signature: `0x${signature}`,
            timestamp
        };

        const voucherBase64 = Buffer.from(JSON.stringify(voucher)).toString('base64');
        console.log(`[x402 CLIENT] Generated valid AP2 voucher for $${requiredPriceUsd} USDC (Agent: ${this.agentId})`);

        // 4. Record local ledger receipt
        this.recordReceipt(requiredPriceUsd, url, nonce, signature);

        // 5. Retry request with x402 voucher attached
        const newHeaders = new Headers(init?.headers || {});
        newHeaders.set('X-402-Voucher', voucherBase64);
        newHeaders.set('Authorization', `x402 ${voucherBase64}`);

        const retryInit: RequestInit = {
            ...init,
            headers: newHeaders
        };

        return await globalThis.fetch(url, retryInit);
    }

    private recordReceipt(amountUsd: number, destinationUrl: string, nonce: string, signature: string) {
        try {
            const entry = {
                id: `x402-debit-${crypto.randomBytes(4).toString('hex')}`,
                agentId: this.agentId,
                destinationUrl,
                amountUsd: -amountUsd,
                token: 'USDC',
                chainId: this.chainId,
                nonce,
                signature: `0x${signature}`,
                status: 'SETTLED_AUTONOMOUS',
                timestamp: new Date().toISOString()
            };
            fs.mkdirSync(path.dirname(this.logPath), { recursive: true });
            fs.appendFileSync(this.logPath, JSON.stringify(entry) + '\n', 'utf-8');
        } catch {}
    }
}

export const x402Client = new X402Client();
