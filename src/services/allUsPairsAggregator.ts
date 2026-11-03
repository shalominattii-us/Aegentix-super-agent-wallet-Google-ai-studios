import https from 'https';
import fs from 'fs';
import path from 'path';

export interface OrderBookLevel {
    price: number;
    size: number;
}

export interface ExchangeMarketDepth {
    exchange: string;
    pair: string;
    bids: OrderBookLevel[];
    asks: OrderBookLevel[];
    timestamp: number;
}

export interface UniversalCatalogSummary {
    timestamp: string;
    totalExchanges: number;
    totalPairsAcrossAllVenues: number;
    exchangeBreakdown: { [exchange: string]: number };
    samplePairs: { [exchange: string]: string[] };
}

export class AllUSPairsAggregator {
    private exchanges = ['Coinbase', 'Kraken', 'Gemini', 'BinanceUS'];

    constructor() {
        console.log('[UNIVERSAL GRID] Initializing full-market discovery across US lawful venues...');
    }

    public httpGet(url: string, headers: Record<string, string> = {}): Promise<string> {
        return new Promise((resolve, reject) => {
            const req = https.get(url, { headers: { 'User-Agent': 'Aegentix-Execution-Engine/1.0', ...headers } }, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => resolve(data));
            });
            req.on('error', err => reject(err));
            req.setTimeout(8000, () => {
                req.destroy();
                reject(new Error(`Timeout fetching ${url}`));
            });
            req.end();
        });
    }

    // 1. Discover all active pairs across all US exchanges
    public async discoverAllPairs(): Promise<Map<string, string[]>> {
        const marketMap = new Map<string, string[]>();

        // Coinbase Pairs
        try {
            const res = await this.httpGet('https://api.exchange.coinbase.com/products');
            const products = JSON.parse(res);
            const cbPairs = products.filter((p: any) => p.status === 'online' || !p.trading_disabled).map((p: any) => p.id);
            marketMap.set('Coinbase', cbPairs);
            console.log(`[Coinbase] Successfully cataloged ${cbPairs.length} lawful US trading pairs.`);
        } catch (e: any) {
            console.error(`[Coinbase Discovery Error]: ${e.message}`);
            marketMap.set('Coinbase', []);
        }

        // Kraken Pairs
        try {
            const res = await this.httpGet('https://api.kraken.com/0/public/AssetPairs');
            const data = JSON.parse(res);
            const krakenPairs = Object.keys(data.result || {}).filter(k => !k.includes('.dark'));
            marketMap.set('Kraken', krakenPairs);
            console.log(`[Kraken] Successfully cataloged ${krakenPairs.length} lawful US trading pairs.`);
        } catch (e: any) {
            console.error(`[Kraken Discovery Error]: ${e.message}`);
            marketMap.set('Kraken', []);
        }

        // Gemini Pairs
        try {
            const res = await this.httpGet('https://api.gemini.com/v1/symbols');
            const symbols = JSON.parse(res);
            const geminiPairs = symbols.map((s: string) => s.toUpperCase());
            marketMap.set('Gemini', geminiPairs);
            console.log(`[Gemini] Successfully cataloged ${geminiPairs.length} lawful US trading pairs.`);
        } catch (e: any) {
            console.error(`[Gemini Discovery Error]: ${e.message}`);
            marketMap.set('Gemini', []);
        }

        // Binance.US Pairs
        try {
            const res = await this.httpGet('https://api.binance.us/api/v3/exchangeInfo');
            const data = JSON.parse(res);
            const binancePairs = (data.symbols || []).filter((s: any) => s.status === 'TRADING').map((s: any) => s.symbol);
            marketMap.set('BinanceUS', binancePairs);
            console.log(`[BinanceUS] Successfully cataloged ${binancePairs.length} lawful US trading pairs.`);
        } catch (e: any) {
            console.error(`[BinanceUS Discovery Error]: ${e.message}`);
            marketMap.set('BinanceUS', []);
        }

        return marketMap;
    }

    // 2. Fetch order book depth for a specific pair on an exchange
    public async fetchOrderBook(exchange: string, pair: string, limit: number = 5): Promise<ExchangeMarketDepth | null> {
        try {
            if (exchange === 'Coinbase') {
                const data = await this.httpGet(`https://api.exchange.coinbase.com/products/${pair}/book?level=2`);
                const parsed = JSON.parse(data);
                if (!parsed.bids || !parsed.asks) return null;
                return {
                    exchange,
                    pair,
                    bids: parsed.bids.slice(0, limit).map((b: any) => ({ price: parseFloat(b[0]), size: parseFloat(b[1]) })),
                    asks: parsed.asks.slice(0, limit).map((a: any) => ({ price: parseFloat(a[0]), size: parseFloat(a[1]) })),
                    timestamp: Date.now()
                };
            } else if (exchange === 'Kraken') {
                const data = await this.httpGet(`https://api.kraken.com/0/public/Depth?pair=${pair}&count=${limit}`);
                const parsed = JSON.parse(data);
                const key = Object.keys(parsed.result || {})[0];
                if (!key) return null;
                const book = parsed.result[key];
                return {
                    exchange,
                    pair,
                    bids: (book.bids || []).slice(0, limit).map((b: any) => ({ price: parseFloat(b[0]), size: parseFloat(b[1]) })),
                    asks: (book.asks || []).slice(0, limit).map((a: any) => ({ price: parseFloat(a[0]), size: parseFloat(a[1]) })),
                    timestamp: Date.now()
                };
            } else if (exchange === 'Gemini') {
                const formattedPair = pair.replace('/', '').replace('-', '').toLowerCase();
                const data = await this.httpGet(`https://api.gemini.com/v1/book/${formattedPair}?limit_bids=${limit}&limit_asks=${limit}`);
                const parsed = JSON.parse(data);
                if (!parsed.bids) return null;
                return {
                    exchange,
                    pair,
                    bids: (parsed.bids || []).slice(0, limit).map((b: any) => ({ price: parseFloat(b.price), size: parseFloat(b.amount) })),
                    asks: (parsed.asks || []).slice(0, limit).map((a: any) => ({ price: parseFloat(a.price), size: parseFloat(a.amount) })),
                    timestamp: Date.now()
                };
            } else if (exchange === 'BinanceUS') {
                const sym = pair.replace('/', '').replace('-', '').toUpperCase();
                const data = await this.httpGet(`https://api.binance.us/api/v3/depth?symbol=${sym}&limit=${limit}`);
                const parsed = JSON.parse(data);
                if (!parsed.bids) return null;
                return {
                    exchange,
                    pair,
                    bids: (parsed.bids || []).slice(0, limit).map((b: any) => ({ price: parseFloat(b[0]), size: parseFloat(b[1]) })),
                    asks: (parsed.asks || []).slice(0, limit).map((a: any) => ({ price: parseFloat(a[0]), size: parseFloat(a[1]) })),
                    timestamp: Date.now()
                };
            }
        } catch (e) {
            // Non-critical network retry
        }
        return null;
    }
}

export const allPairsAggregator = new AllUSPairsAggregator();
