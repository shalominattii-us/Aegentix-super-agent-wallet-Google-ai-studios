import crypto from 'crypto';

export interface TreasuryAuditEvent {
    eventType: 'NETTING_CYCLE' | 'ZBA_SWEEP' | 'ODL_PAYOUT' | 'RECONCILIATION';
    timestamp: string;
    entityId: string;
    volumeUSD: number;
    payloadHash: string;
    signature?: string;
}

export class AegentixTreasuryEngine {
    private auditSecretKey: string;

    constructor(auditKey?: string) {
        this.auditSecretKey = auditKey || process.env.TREASURY_SECRET_KEY || crypto.randomBytes(32).toString('hex');
    }

    public sealEvent(event: Omit<TreasuryAuditEvent, 'payloadHash' | 'signature'>, rawPayload: any): TreasuryAuditEvent {
        const payloadHash = crypto.createHash('sha256').update(JSON.stringify(rawPayload)).digest('hex');
        const signaturePayload = `${event.eventType}:${event.timestamp}:${event.entityId}:${event.volumeUSD}:${payloadHash}`;
        
        const signature = crypto.createHmac('sha256', this.auditSecretKey)
            .update(signaturePayload)
            .digest('hex');

        return { ...event, payloadHash, signature };
    }

    public verifyEvent(event: TreasuryAuditEvent, rawPayload: any): boolean {
        if (!event.signature) return false;
        const computedHash = crypto.createHash('sha256').update(JSON.stringify(rawPayload)).digest('hex');
        if (computedHash !== event.payloadHash) return false;

        const signaturePayload = `${event.eventType}:${event.timestamp}:${event.entityId}:${event.volumeUSD}:${computedHash}`;
        const expectedSignature = crypto.createHmac('sha256', this.auditSecretKey)
            .update(signaturePayload)
            .digest('hex');

        return crypto.timingSafeEqual(Buffer.from(event.signature), Buffer.from(expectedSignature));
    }
}
