import { WebSocketServer, WebSocket } from 'ws';
import { Server as HttpServer } from 'http';
import crypto from 'crypto';
import { x402Gateway } from './x402Gateway.ts';

/**
 * Aegentix Real-Time Agent-to-Agent (A2A) WebSocket Hub
 * 
 * Sub-second, peer-to-peer event loop for autonomous AI agents:
 * - Live agent discovery and capability advertising
 * - Instant Request-for-Quote (RFQ) broadcasts
 * - Automated x402 micropayment negotiation & receipt verification
 */

export interface A2AAgentPeer {
    id: string;
    name: string;
    capabilities: string[];
    socket: WebSocket;
    lastPing: number;
}

export interface A2AMessage {
    type: 'AGENT_HELLO' | 'RFQ_REQUEST' | 'OFFER_TERMS' | 'VOUCHER_PAY' | 'DELIVERY_RECEIPT' | 'ERROR';
    agentId: string;
    payload: any;
    timestamp: number;
}

export class A2AWebSocketHub {
    private wss: WebSocketServer | null = null;
    private peers: Map<string, A2AAgentPeer> = new Map();

    public attach(server: HttpServer) {
        this.wss = new WebSocketServer({ noServer: true, maxPayload: 64 * 1024 });

        server.on('upgrade', (request, socket, head) => {
            const pathname = request.url ? new URL(request.url, 'http://localhost').pathname : '';
            if (pathname === '/ws/a2a') {
                this.wss?.handleUpgrade(request, socket, head, (ws) => {
                    this.wss?.emit('connection', ws, request);
                });
            }
        });

        this.wss.on('connection', (ws: WebSocket) => {
            let registeredAgentId: string | null = null;

            ws.on('message', (data: string) => {
                try {
                    const msg: A2AMessage = JSON.parse(data.toString());
                    if (msg.type !== 'AGENT_HELLO') {
                        if (!registeredAgentId || msg.agentId !== registeredAgentId) {
                            ws.send(JSON.stringify({ type: 'ERROR', message: 'Sender agentId mismatch or unregistered peer; send AGENT_HELLO first.' }));
                            return;
                        }
                    }
                    this.handleMessage(ws, msg, (id) => { registeredAgentId = id; });
                } catch (e: any) {
                    ws.send(JSON.stringify({ type: 'ERROR', message: e.message }));
                }
            });

            ws.on('close', () => {
                if (registeredAgentId) {
                    this.peers.delete(registeredAgentId);
                    this.broadcast({
                        type: 'AGENT_HELLO',
                        agentId: 'A2A_HUB',
                        payload: { event: 'AGENT_OFFLINE', agentId: registeredAgentId },
                        timestamp: Date.now()
                    });
                }
            });
        });

        console.log('[A2A SOCKET HUB] Initialized and mounted on /ws/a2a');
    }

    private handleMessage(ws: WebSocket, msg: A2AMessage, setRegisteredId: (id: string) => void) {
        switch (msg.type) {
            case 'AGENT_HELLO': {
                const { name, capabilities } = msg.payload || {};
                const peer: A2AAgentPeer = {
                    id: msg.agentId,
                    name: name || msg.agentId,
                    capabilities: capabilities || ['GENERAL_REASONING'],
                    socket: ws,
                    lastPing: Date.now()
                };
                this.peers.set(msg.agentId, peer);
                setRegisteredId(msg.agentId);

                ws.send(JSON.stringify({
                    type: 'AGENT_HELLO',
                    agentId: 'A2A_HUB',
                    payload: {
                        status: 'REGISTERED',
                        activePeerCount: this.peers.size,
                        peers: Array.from(this.peers.values()).map(p => ({ id: p.id, name: p.name, capabilities: p.capabilities }))
                    },
                    timestamp: Date.now()
                }));
                break;
            }

            case 'RFQ_REQUEST': {
                // Broadcast RFQ to all peers with matching capabilities
                const { requiredCapability, targetAsset, maxBudgetUsdc } = msg.payload || {};
                this.broadcastExcept(msg.agentId, {
                    type: 'RFQ_REQUEST',
                    agentId: msg.agentId,
                    payload: { rfqId: `rfq-${crypto.randomBytes(4).toString('hex')}`, requiredCapability, targetAsset, maxBudgetUsdc },
                    timestamp: Date.now()
                });
                break;
            }

            case 'OFFER_TERMS': {
                // Route offer back to requesting agent with x402 price specifications
                const { targetAgentId, priceUsdc, settlementChain } = msg.payload || {};
                const targetPeer = this.peers.get(targetAgentId);
                if (targetPeer && targetPeer.socket.readyState === WebSocket.OPEN) {
                    targetPeer.socket.send(JSON.stringify({
                        type: 'OFFER_TERMS',
                        agentId: msg.agentId,
                        payload: {
                            offerId: `offer-${crypto.randomBytes(4).toString('hex')}`,
                            priceUsdc,
                            settlementChain: settlementChain || 'Base (8453)',
                            x402Terms: { token: 'USDC', rateMicroCents: Math.round(priceUsdc * 100000) }
                        },
                        timestamp: Date.now()
                    }));
                }
                break;
            }

            case 'VOUCHER_PAY': {
                // Verify cryptographic x402 voucher before forwarding settlement receipt
                const { providerAgentId, voucher, contractId } = msg.payload || {};
                const verification = x402Gateway.verifyVoucherCryptographically(voucher);
                if (!verification.valid) {
                    ws.send(JSON.stringify({
                        type: 'ERROR',
                        agentId: 'A2A_HUB',
                        payload: { contractId, status: 'VOUCHER_REJECTED', reason: verification.reason },
                        timestamp: Date.now()
                    }));
                    break;
                }
                const provider = this.peers.get(providerAgentId);
                if (provider && provider.socket.readyState === WebSocket.OPEN) {
                    provider.socket.send(JSON.stringify({
                        type: 'DELIVERY_RECEIPT',
                        agentId: msg.agentId,
                        payload: { contractId, status: 'VOUCHER_SETTLED', voucherVerified: true },
                        timestamp: Date.now()
                    }));
                }
                break;
            }
        }
    }

    private broadcast(msg: A2AMessage) {
        const payload = JSON.stringify(msg);
        for (const peer of this.peers.values()) {
            if (peer.socket.readyState === WebSocket.OPEN) {
                peer.socket.send(payload);
            }
        }
    }

    private broadcastExcept(senderId: string, msg: A2AMessage) {
        const payload = JSON.stringify(msg);
        for (const [id, peer] of this.peers.entries()) {
            if (id !== senderId && peer.socket.readyState === WebSocket.OPEN) {
                peer.socket.send(payload);
            }
        }
    }

    public getActivePeers() {
        return Array.from(this.peers.values()).map(p => ({
            id: p.id,
            name: p.name,
            capabilities: p.capabilities,
            lastPing: p.lastPing
        }));
    }
}

export const a2aWebSocketHub = new A2AWebSocketHub();
