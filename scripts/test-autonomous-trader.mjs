#!/usr/bin/env node

import { AutonomousTraderAgent } from '../server/autonomous-trader-agent.ts';

const agent = new AutonomousTraderAgent();
agent.start();

// Make some trading decisions and execute
for (let i = 0; i < 5; i++) {
  const trends = ['up', 'down', 'neutral'];
  const decision = agent.makeDecision({
    signal_source: 'AEGENTIS-X',
    asset_pair: 'ETH/USDC',
    market_price: 2500 + Math.random() * 100,
    market_volume: 1000000 + Math.random() * 500000,
    volatility: 0.02 + Math.random() * 0.03,
    trend: trends[Math.floor(Math.random() * 3)],
    rsi: 30 + Math.random() * 40,
    macd: -0.5 + Math.random() * 1.0,
  });
  
  await agent.executeDecision(decision, 10 + Math.random() * 50, decision.market_conditions.price);
}

// Get status
console.log('\n=== AUTONOMOUS TRADER STATUS ===');
console.log(JSON.stringify(agent.getStatus(), null, 2));

console.log('\n=== EXECUTION STATISTICS ===');
console.log(JSON.stringify(agent.getExecutionStats(), null, 2));

console.log('\n=== EXECUTION HISTORY (Last 5) ===');
const history = agent.getExecutionHistory(5);
history.forEach((record, idx) => {
  console.log(`\n[${idx + 1}] ${record.asset_pair} - ${record.action.toUpperCase()}`);
  console.log(`    Status: ${record.status}`);
  console.log(`    Amount: ${record.amount.toFixed(2)}`);
  console.log(`    Price: $${record.executed_price.toFixed(2)}`);
  console.log(`    TxHash: ${record.transaction_hash}`);
});

console.log('\n=== MOLTBOOK SNAPSHOT ===');
const snapshot = agent.createSnapshot();
console.log(JSON.stringify(snapshot, null, 2));

console.log('\n=== SNAPSHOT VERIFICATION ===');
const verified = agent.verifySnapshot(snapshot);
console.log(`Snapshot Valid: ${verified}`);
