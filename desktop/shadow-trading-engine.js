/**
 * Shadow Trading Engine - REAL DATA EDITION
 *
 * Replaces the previous version, which fabricated every field: random pairs,
 * random venues, a spread drawn from a range biased positive, a fee rate ~10x
 * below reality, and a hardcoded "FILLED_SETTLED" status. That is why its P&L
 * always looked positive. It measured nothing.
 *
 * This version:
 *   - reads live order books from real venues (kraken, binance_us, coinbase, okx, bitstamp)
 *   - uses real pairs that actually trade
 *   - charges the real taker fee for each leg
 *   - records a NO_TRADE result with the measured edge when fees exceed it
 *   - fails closed: if no book can be read, it reports NO_DATA and never invents a fill
 *
 * No Math.random, no hardcoded prices, no synthetic P&L.
 */
const fs = require('fs');
const path = require('path');

const VENUES = {
  kraken:     { taker: 0.0026, maker: 0.0016, pairs: { 'BTC/USD': 'XXBTZUSD', 'ETH/USD': 'XETHZUSD', 'SOL/USD': 'SOLUSD', 'XRP/USD': 'XXRPZUSD' } },
  binance_us: { taker: 0.0010, maker: 0.0010, pairs: { 'BTC/USD': 'BTCUSD',   'ETH/USD': 'ETHUSD',   'SOL/USD': 'SOLUSD', 'XRP/USD': 'XRPUSD' } },
  coinbase:   { taker: 0.0060, maker: 0.0040, pairs: { 'BTC/USD': 'BTC-USD',  'ETH/USD': 'ETH-USD',  'SOL/USD': 'SOL-USD','XRP/USD': 'XRP-USD' } },
  okx:        { taker: 0.0010, maker: 0.0008, pairs: { 'BTC/USD': 'BTC-USDT', 'ETH/USD': 'ETH-USDT', 'SOL/USD': 'SOL-USDT','XRP/USD': 'XRP-USDT' } },
  bitstamp:   { taker: 0.0020, maker: 0.0010, pairs: { 'BTC/USD': 'btcusd',   'ETH/USD': 'ethusd',   'SOL/USD': 'solusd', 'XRP/USD': 'xrpusd' } },
};

const PAIRS = ['BTC/USD', 'ETH/USD', 'SOL/USD', 'XRP/USD'];
const DEFAULT_NOTIONAL_USD = parseFloat(process.env.SHADOW_NOTIONAL_USD || '25');
const BOOK_TTL_MS = 5000;

async function jget(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'aegentix-shadow/2' } });
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  return res.json();
}

class ShadowTradingEngine {
  constructor(options = {}) {
    this.notionalUsd = options.notionalUsd || DEFAULT_NOTIONAL_USD;
    this.logDir = options.logDir || path.join(__dirname, 'logs');
    this.bookCache = { at: 0, books: null };
    this.cumulativePnlUsd = 0;
    this.totalTrades = 0;
    this.winCount = 0;
    this.noTradeCount = 0;
    this.dataFailures = 0;
    this.memoryVault = options.memoryVault || null;
  }

  ensureLogDir() {
    try { if (!fs.existsSync(this.logDir)) fs.mkdirSync(this.logDir, { recursive: true }); } catch {}
  }

  logTrade(trade) {
    try {
      this.ensureLogDir();
      fs.appendFileSync(path.join(this.logDir, 'shadow-trades.jsonl'), JSON.stringify(trade) + '\n');
    } catch {}
  }

  /** Read live two-sided books. Throws only if EVERY venue fails. */
  async getBooks(force = false) {
    if (!force && this.bookCache.books && Date.now() - this.bookCache.at < BOOK_TTL_MS) return this.bookCache.books;

    const books = {};
    const errors = {};

    const tasks = Object.entries(VENUES).map(async ([venue, cfg]) => {
      try {
        if (venue === 'kraken') {
          const data = await jget(`https://api.kraken.com/0/public/Ticker?pair=${Object.values(cfg.pairs).join(',')}`);
          for (const [pair, sym] of Object.entries(cfg.pairs)) {
            const e = data.result?.[sym];
            if (e?.b?.[0] && e?.a?.[0]) (books[pair] ||= []).push({ venue, bid: +e.b[0], ask: +e.a[0] });
          }
        } else if (venue === 'binance_us') {
          const syms = Object.values(cfg.pairs);
          const data = await jget(`https://api.binance.us/api/v3/ticker/bookTicker?symbols=${encodeURIComponent(JSON.stringify(syms))}`);
          for (const [pair, sym] of Object.entries(cfg.pairs)) {
            const row = data.find(r => r.symbol === sym);
            if (row) (books[pair] ||= []).push({ venue, bid: +row.bidPrice, ask: +row.askPrice });
          }
        } else if (venue === 'coinbase') {
          for (const [pair, sym] of Object.entries(cfg.pairs)) {
            const d = await jget(`https://api.exchange.coinbase.com/products/${sym}/ticker`);
            if (d.bid && d.ask) (books[pair] ||= []).push({ venue, bid: +d.bid, ask: +d.ask });
          }
        } else if (venue === 'okx') {
          for (const [pair, sym] of Object.entries(cfg.pairs)) {
            const d = await jget(`https://www.okx.com/api/v5/market/ticker?instId=${sym}`);
            const row = d.data?.[0];
            if (row) (books[pair] ||= []).push({ venue, bid: +row.bidPx, ask: +row.askPx });
          }
        } else if (venue === 'bitstamp') {
          for (const [pair, sym] of Object.entries(cfg.pairs)) {
            const d = await jget(`https://www.bitstamp.net/api/v2/ticker/${sym}/`);
            if (d.bid && d.ask) (books[pair] ||= []).push({ venue, bid: +d.bid, ask: +d.ask });
          }
        }
      } catch (err) {
        errors[venue] = err.message;
      }
    });

    await Promise.allSettled(tasks);

    if (!Object.keys(books).length) {
      this.dataFailures += 1;
      throw new Error('NO_DATA: no venue returned a book (' + JSON.stringify(errors) + ')');
    }

    this.bookCache = { at: Date.now(), books };
    return books;
  }

  /**
   * Evaluate one pair against live books and execute a PAPER fill only if the
   * route clears real fees. Otherwise record NO_TRADE with the measured numbers.
   */
  async executeShadowTrade(pairSymbol = null) {
    const pair = pairSymbol && PAIRS.includes(pairSymbol) ? pairSymbol : PAIRS[0];
    const now = new Date().toISOString();

    let books;
    try {
      books = await this.getBooks();
    } catch (err) {
      const failed = {
        id: `shadow-${Date.now()}`,
        at: now, pair, status: 'NO_DATA', netPnlUsd: 0,
        reason: String(err.message).slice(0, 200), dataSource: 'none',
      };
      this.logTrade(failed);
      return failed;
    }

    const quotes = books[pair] || [];
    if (quotes.length < 2) {
      const thin = { id: `shadow-${Date.now()}`, at: now, pair, status: 'NO_DATA', netPnlUsd: 0,
        reason: `only ${quotes.length} venue(s) quoting`, dataSource: 'live-orderbook' };
      this.logTrade(thin);
      return thin;
    }

    // Best executable route: buy at a real ask, sell at a real bid, both legs charged.
    let best = null;
    for (const buy of quotes) for (const sell of quotes) {
      if (buy.venue === sell.venue) continue;
      if (!(sell.bid > buy.ask)) continue;
      const grossPct = ((sell.bid - buy.ask) / buy.ask) * 100;
      const feePct = (VENUES[buy.venue].taker + VENUES[sell.venue].taker) * 100;
      const netPct = grossPct - feePct;
      if (!best || netPct > best.netPct) best = { buy, sell, grossPct, feePct, netPct };
    }

    if (!best) {
      const none = { id: `shadow-${Date.now()}`, at: now, pair, status: 'NO_TRADE', netPnlUsd: 0,
        reason: 'no venue pair had a sellable bid above a buyable ask', dataSource: 'live-orderbook' };
      this.logTrade(none);
      this.noTradeCount += 1;
      return none;
    }

    if (best.netPct <= 0) {
      const noEdge = {
        id: `shadow-${Date.now()}`, at: now, pair, status: 'NO_TRADE', netPnlUsd: 0,
        buyVenue: best.buy.venue, sellVenue: best.sell.venue,
        buyPrice: best.buy.ask, sellPrice: best.sell.bid,
        grossPct: +best.grossPct.toFixed(4), feePct: +best.feePct.toFixed(4), netPct: +best.netPct.toFixed(4),
        reason: `best live edge ${best.netPct.toFixed(4)}% after fees - fails the floor`,
        dataSource: 'live-orderbook',
      };
      this.logTrade(noEdge);
      this.noTradeCount += 1;
      return noEdge;
    }

    const notional = this.notionalUsd;
    const netPnlUsd = +(notional * best.netPct / 100).toFixed(4);
    const trade = {
      id: `shadow-${Date.now()}`,
      at: now,
      pair,
      status: 'PAPER_FILLED',
      buyVenue: best.buy.venue,
      sellVenue: best.sell.venue,
      buyPrice: best.buy.ask,
      sellPrice: best.sell.bid,
      grossPct: +best.grossPct.toFixed(4),
      feePct: +best.feePct.toFixed(4),
      netPct: +best.netPct.toFixed(4),
      notionalUsd: notional,
      netPnlUsd,
      dataSource: 'live-orderbook',
      quoteTimestamp: new Date(this.bookCache.at).toISOString(),
      note: 'paper fill against live prices; no order was sent to any exchange',
    };

    this.totalTrades += 1;
    if (netPnlUsd > 0) this.winCount += 1;
    this.cumulativePnlUsd = +(this.cumulativePnlUsd + netPnlUsd).toFixed(4);
    this.logTrade(trade);

    if (this.memoryVault?.saveMemory) {
      try {
        this.memoryVault.saveMemory({
          title: `Shadow paper fill ${pair}`,
          kind: 'trade',
          tags: ['shadow-trading', 'paper-trade'],
          content: `Paper fill ${pair} ${best.buy.venue}->${best.sell.venue} net ${netPnlUsd} USD on live prices.`,
          data: { pair, netPnlUsd, netPct: trade.netPct, dataSource: 'live-orderbook' },
        });
      } catch {}
    }

    return trade;
  }

  /** Sequential real-data cycles. No synthesized "hum". */
  async runBatch(count = 10) {
    const results = [];
    for (let i = 0; i < count; i++) {
      results.push(await this.executeShadowTrade());
      await new Promise(r => setTimeout(r, 250));
    }
    const filled = results.filter(t => t.status === 'PAPER_FILLED');
    return {
      cycles: results.length,
      fills: filled.length,
      noTrade: results.filter(t => t.status === 'NO_TRADE').length,
      noData: results.filter(t => t.status === 'NO_DATA').length,
      netPnlUsd: +filled.reduce((a, t) => a + t.netPnlUsd, 0).toFixed(4),
      results,
    };
  }

  getMetrics() {
    const decided = this.totalTrades + this.noTradeCount;
    return {
      dataSource: 'live-orderbook',
      fills: this.totalTrades,
      noTrade: this.noTradeCount,
      dataFailures: this.dataFailures,
      cumulativePnlUsd: this.cumulativePnlUsd,
      winRate: this.totalTrades ? `${((this.winCount / this.totalTrades) * 100).toFixed(1)}%` : 'n/a',
      evaluated: decided,
    };
  }
}

const shadowTradingEngine = new ShadowTradingEngine();
module.exports = { ShadowTradingEngine, shadowTradingEngine, PAIRS, VENUES };
