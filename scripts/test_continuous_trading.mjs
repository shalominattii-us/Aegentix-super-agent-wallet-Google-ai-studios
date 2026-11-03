import fetch from 'node-fetch';

async function testContinuousTrading() {
  const res = await fetch('http://127.0.0.1:3000/api/xrpl/continuous-trading');
  const data = await res.json();
  console.log('=== LIVE CONTINUOUS TRADING TELEMETRY ===');
  console.log('Engine Active:       ', data.engine?.isActive);
  console.log('Active Strategy:     ', data.engine?.activeStrategy);
  console.log('Pulse Count:         ', data.engine?.pulseCount);
  console.log('Last Executed Signal:', data.engine?.lastExecutedSignal);
  console.log('Total XRP Stored:    ', data.engine?.totalXrpStored, 'XRP');
  console.log('EOC Circulated:      ', (data.engine?.eocCirculatedUnits || 0).toLocaleString(), 'EOC');
  console.log('Treasury Policy:     ', data.engine?.treasuryPolicy);
  console.log('\nVerified Pools Active in Continuous Rotator:');
  (data.engine?.verifiedXrplPools || []).forEach((p, i) => {
    console.log(`  [${i + 1}] ${p.pair.padEnd(16)} | Fee: ${p.tradingFee.padEnd(8)} | AMM: ${p.ammAccount.slice(0, 14)}... | Action: ${p.action}`);
  });
}

testContinuousTrading().catch(console.error);
