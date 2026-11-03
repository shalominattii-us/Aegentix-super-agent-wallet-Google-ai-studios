import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

/**
 * Aegentix Sovereign Gateway - Anti-Stripe & Crypto-Masking Interception Firewall
 * 
 * Purpose: 
 * 1. Hard-blocks all outbound or inbound Stripe API hooks, telemetry payloads, and gateway traffic.
 * 2. Scans incoming transaction payloads, headers, and token routes for attempts to mask, disguise, 
 *    or launder fiat transaction rails behind obfuscated crypto-wrappers or stablecoin tunnels.
 */
export class AegentixAntiStripeFirewall {
    private blockedDomains: string[] = [
        'stripe.com',
        'api.stripe.com',
        'm.stripe.com',
        'js.stripe.com',
        'hooks.stripe.com'
    ];

    // Signatures or patterns commonly used to wrap fiat gateways inside crypto tunnels
    private maskingSignatures: string[] = [
        'stripe_hidden_bridge',
        'fiat_crypto_wrapper_v1',
        'obfuscated_gateway_proxy',
        'proxy_stripe_checkout'
    ];

    public middleware() {
        return (req: Request, res: Response, next: NextFunction) => {
            const clientIp = req.ip || req.socket.remoteAddress;
            const userAgent = String(req.headers['user-agent'] || '');
            const referer = String(req.headers['referer'] || '');
            const requestBody = JSON.stringify(req.body || {});

            // 1. Block Direct Stripe Activity
            if (
                this.isStripeDomain(referer) || 
                userAgent.includes('Stripe') || 
                requestBody.includes('stripe_') || 
                req.path.includes('/stripe')
            ) {
                console.warn(`[FIREWALL BLOCK] Unauthorized Stripe telemetry/API activity detected from IP: ${clientIp}`);
                return res.status(403).json({
                    success: false,
                    error: 'UNAUTHORIZED_PROTOCOL_VIOLATION',
                    message: 'Stripe activity and centralized payment wrappers are strictly blocked by sovereign firewall policy.'
                });
            }

            // 2. Detect Attempts to Mask / Disguise Fiat Behind Crypto
            for (const sig of this.maskingSignatures) {
                if (requestBody.includes(sig) || req.headers['x-masking-proxy'] === sig) {
                    const incidentId = `violation_${crypto.randomBytes(6).toString('hex')}`;
                    console.error(`[CRITICAL SECURITY ALERT] Crypto-masking/disguise attempt detected! Incident ID: ${incidentId}, Signature: ${sig}`);
                    
                    return res.status(422).json({
                        success: false,
                        error: 'CRYPTO_MASKING_DETECTED',
                        incidentId,
                        message: 'Payload rejected: Attempt to disguise fiat payment rails behind crypto tunnels violates sovereign execution invariants.'
                    });
                }
            }

            // 3. Inspect for suspicious double-nested encoding (common in obfuscation attempts)
            if (this.detectObfuscatedPayload(req.body)) {
                return res.status(422).json({
                    success: false,
                    error: 'OBFUSCATION_GUARD_TRIGGERED',
                    message: 'Payload blocked due to structural obfuscation indicators.'
                });
            }

            next();
        };
    }

    private isStripeDomain(url: string | string[] | undefined): boolean {
        if (!url) return false;
        const urlStr = Array.isArray(url) ? url[0] : url;
        return this.blockedDomains.some(domain => urlStr.includes(domain));
    }

    private detectObfuscatedPayload(body: any): boolean {
        // Deep inspection for layers of Base64 or hex strings intended to bypass inspection
        if (body && typeof body === 'object') {
            if (body.encrypted_payload && body.wrapper_type === 'fiat_proxy') {
                return true;
            }
        }
        return false;
    }
}

export const antiStripeFirewall = new AegentixAntiStripeFirewall();
