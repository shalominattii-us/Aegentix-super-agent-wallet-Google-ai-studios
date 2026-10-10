# Xaman Integration Guide

## Overview

The Xaman SDK and Trading Daemon enable autonomous swarm trading on the XRP Ledger through the Sovereign System Portal. The daemon runs as a background service that executes trades based on market signals and swarm decisions.

## Architecture

```
┌─────────────────────────────────────────────────┐
│         Sovereign System Portal                 │
├─────────────────────────────────────────────────┤
│  tRPC Router (xaman-router.ts)                  │
│  - submitTrade()                                │
│  - startDaemon() / stopDaemon()                 │
│  - getStats() / getHealth()                     │
└──────────────────┬──────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────┐
│    Xaman Trading Daemon (xaman-daemon.ts)       │
│  - Event-driven trade execution                 │
│  - Automatic retry logic                        │
│  - Health monitoring                            │
└──────────────────┬──────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────┐
│      Xaman SDK (xaman-sdk.ts)                   │
│  - API authentication (HMAC-SHA256)             │
│  - Transaction signing                          │
│  - Order management                             │
└──────────────────┬──────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────┐
│    XRP Ledger / Xaman API                       │
│  - Transaction submission                       │
│  - Order execution                              │
│  - Ledger confirmation                          │
└─────────────────────────────────────────────────┘
```

## Setup

### 1. Environment Variables

Add Xaman credentials to `.env.local`:

```env
XAMAN_API_KEY=34e7c7d2-9c94-483e-8f21-460893077075
XAMAN_API_SECRET=bb62b56b-7082-4d9c-8be2-c3a3f45cc2e9
```

### 2. Initialize Daemon

The daemon is automatically initialized when the server starts. To manually initialize:

```typescript
import { initializeXamanDaemon } from 'server/xaman';

const daemon = await initializeXamanDaemon();
```

## API Usage

### Start Daemon

```typescript
// Via tRPC
const result = await trpc.xaman.startDaemon.mutate();
// { success: true, message: 'Daemon started' }
```

### Submit Single Trade

```typescript
const trade = await trpc.xaman.submitTrade.mutate({
  pair: 'XRP/USD',
  side: 'buy',
  amount: 100,
  price: 2.50,
});

// Returns:
// {
//   id: 'trade-1722873...',
//   pair: 'XRP/USD',
//   side: 'buy',
//   amount: 100,
//   price: 2.50,
//   status: 'pending',
//   retries: 0,
//   createdAt: 1722873...
// }
```

### Submit Batch Trades

```typescript
const result = await trpc.xaman.submitBatch.mutate({
  trades: [
    { pair: 'XRP/USD', side: 'buy', amount: 100, price: 2.50 },
    { pair: 'XRP/EUR', side: 'sell', amount: 50, price: 2.75 },
  ],
});

// Returns:
// {
//   success: true,
//   count: 2,
//   trades: [...]
// }
```

### Get Trade Status

```typescript
const trade = await trpc.xaman.getTrade.query({
  tradeId: 'trade-1722873...',
});

// Returns trade object or null
```

### Get All Trades

```typescript
const trades = await trpc.xaman.getAllTrades.query();
// Returns array of all trades
```

### Get Statistics

```typescript
const stats = await trpc.xaman.getStats.query();

// Returns:
// {
//   isRunning: true,
//   totalTrades: 42,
//   pendingTrades: 5,
//   completedTrades: 35,
//   failedTrades: 2,
//   executedTrades: [...]
// }
```

### Get Health Status

```typescript
const health = await trpc.xaman.getHealth.query();

// Returns:
// {
//   status: 'healthy',
//   isRunning: true,
//   pendingCount: 5
// }
```

## Trade Lifecycle

### States

1. **pending** - Trade submitted, waiting for execution
2. **executing** - Trade is being processed by daemon
3. **completed** - Trade executed successfully on XRP Ledger
4. **failed** - Trade failed after max retries

### Retry Logic

- **Max Retries**: 3 (configurable)
- **Retry Delay**: 2000ms (configurable)
- Failed trades are retried automatically
- After max retries, trade status is set to 'failed'

### Events

The daemon emits events for monitoring:

```typescript
daemon.on('started', () => {});
daemon.on('stopped', () => {});
daemon.on('trade_submitted', (trade) => {});
daemon.on('trade_completed', (trade) => {});
daemon.on('trade_failed', (trade) => {});
daemon.on('error', (error) => {});
```

## Security

### Authentication

All API requests are signed with HMAC-SHA256:

```
Signature = HMAC-SHA256(
  SECRET,
  METHOD + '\n' + PATH + '\n' + TIMESTAMP + '\n' + NONCE + '\n' + BODY
)
```

### Transaction Signing

Transactions are signed locally before submission to ensure private keys never leave the system.

### Rate Limiting

- Poll interval: 5 seconds (configurable)
- Max concurrent trades: Unlimited (configurable per deployment)

## Monitoring

### Dashboard Integration

The Portal includes a Xaman dashboard showing:

- Real-time trade status
- Execution history
- Daemon health
- Performance metrics

### Logs

Daemon logs are written to stdout:

```
[Xaman Daemon] Starting...
[Xaman Daemon] Processing 5 pending trades
[Xaman Daemon] Executing trade trade-1722873... (attempt 1/3)
[Xaman Daemon] Trade completed: trade-1722873...
```

### Metrics

Access daemon metrics via:

```typescript
const stats = daemon.getStats();
const health = daemon.getHealth();
```

## Troubleshooting

### Daemon Not Starting

**Issue**: Daemon fails to start
**Solution**: Check environment variables are set:
```bash
echo $XAMAN_API_KEY
echo $XAMAN_API_SECRET
```

### Trades Stuck in Pending

**Issue**: Trades remain pending indefinitely
**Solution**: Check daemon health:
```typescript
const health = await trpc.xaman.getHealth.query();
if (health.status !== 'healthy') {
  // Restart daemon
  await trpc.xaman.stopDaemon.mutate();
  await trpc.xaman.startDaemon.mutate();
}
```

### High Failure Rate

**Issue**: Many trades failing
**Solution**: Check XRP Ledger status and Xaman API connectivity:
```typescript
const stats = await trpc.xaman.getStats.query();
const failureRate = stats.failedTrades / stats.totalTrades;
if (failureRate > 0.2) {
  console.warn('High failure rate detected');
}
```

## Configuration

### Daemon Options

```typescript
const daemon = new XamanTradingDaemon({
  apiKey: 'YOUR_API_KEY',
  apiSecret: 'YOUR_API_SECRET',
  pollInterval: 5000,      // ms between trade checks
  maxRetries: 3,           // max retry attempts
  retryDelay: 2000,        // ms between retries
});
```

## Examples

### Auto-Trading Strategy

```typescript
// Submit trades based on market signals
async function executeStrategy(signals: Signal[]) {
  for (const signal of signals) {
    await trpc.xaman.submitTrade.mutate({
      pair: signal.pair,
      side: signal.side,
      amount: signal.amount,
      price: signal.price,
    });
  }
}
```

### Batch Execution

```typescript
// Execute multiple trades atomically
const trades = [
  { pair: 'XRP/USD', side: 'buy', amount: 100, price: 2.50 },
  { pair: 'XRP/EUR', side: 'buy', amount: 50, price: 2.75 },
];

const result = await trpc.xaman.submitBatch.mutate({ trades });
```

### Health Monitoring

```typescript
// Monitor daemon health
setInterval(async () => {
  const health = await trpc.xaman.getHealth.query();
  console.log(`Daemon: ${health.status}`);
  console.log(`Pending: ${health.pendingCount}`);
}, 10000);
```

## Support

For issues or questions:
1. Check logs: `docker logs sovereign-system-portal`
2. Review Xaman API docs: https://xaman.app/docs
3. Check XRP Ledger status: https://xrpcharts.ripple.com

---

**Last Updated**: August 5, 2026
