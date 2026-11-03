import { unifiedDiscoveryEngine } from '../unifiedDiscoveryEngine.ts';
import fs from 'fs';
import path from 'path';

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(`SECURITY ISOLATION TEST ASSERTION FAILED: ${msg}`);
}

export async function runSecurityIsolationTests(): Promise<{ passed: number; failed: number }> {
  console.log('--- [SUITE 4/5] SECURITY & ISOLATION TESTS: Static Analysis & Runtime Treasury Isolation ---');
  let passed = 0;

  await unifiedDiscoveryEngine.awaitReady();

  // 1. Static Import Boundary Analysis: Scan all files in src/market-registry/
  // Enforce that discovery engine NEVER imports from wallet, treasury, signers, or private keys
  const registryDir = path.resolve('src/market-registry');
  const filesToCheck: string[] = [];

  function collectTsFiles(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const ent of entries) {
      const fullPath = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        if (!ent.name.includes('tests')) {
          collectTsFiles(fullPath);
        }
      } else if (ent.name.endsWith('.ts')) {
        filesToCheck.push(fullPath);
      }
    }
  }
  collectTsFiles(registryDir);

  const forbiddenImportPatterns = [
    /from\s+['"][^'"]*wallet[^'"]*['"]/i,
    /from\s+['"][^'"]*treasury[^'"]*['"]/i,
    /from\s+['"][^'"]*signer[^'"]*['"]/i,
    /from\s+['"][^'"]*ledger-integrity[^'"]*['"]/i,
    /from\s+['"]ethers['"]/i,
    /from\s+['"]web3['"]/i,
    /createSigner/i,
    /privateKey/i,
    /walletMnemonic/i,
    /signTransaction/i,
    /sendTransaction/i,
  ];

  for (const filePath of filesToCheck) {
    const content = fs.readFileSync(filePath, 'utf-8');
    for (const pattern of forbiddenImportPatterns) {
      if (pattern.test(content)) {
        throw new Error(`SECURITY BOUNDARY VIOLATION in ${path.basename(filePath)}: Matched forbidden execution pattern: ${pattern}`);
      }
    }
    // Also verify no private key environment variable references
    if (/process\.env\.(PRIVATE_KEY|MNEMONIC|WALLET_KEY|TREASURY_SECRET|OMEGA_KEY)/.test(content)) {
      throw new Error(`CREDENTIAL LEAK in ${path.basename(filePath)}: Accesses execution private key env variable`);
    }
  }
  passed++;
  console.log(`  [PASS] 4.1: Static AST/code boundary scan passed across ${filesToCheck.length} registry files (zero execution imports).`);

  // 2. Audit 100% of instrument records in memory
  const allInstruments = unifiedDiscoveryEngine.queryInstruments();
  assert(allInstruments.length > 0, 'Registry must contain instruments to audit');
  
  const violations = allInstruments.filter(i => (i.execution_authorized as any) !== false);
  assert(violations.length === 0, `CRITICAL VIOLATION: Found ${violations.length} instruments with execution_authorized !== false`);
  passed++;
  console.log(`  [PASS] 4.2: Audited ${allInstruments.length} canonical records; 100% enforce execution_authorized: false.`);

  // 3. Engine Interface Method Audit
  const engineMethods = Object.getOwnPropertyNames(Object.getPrototypeOf(unifiedDiscoveryEngine));
  const forbiddenTerms = ['sign', 'execute', 'transfer', 'withdraw', 'privatekey', 'seed', 'keystore', 'order', 'trade'];
  
  for (const method of engineMethods) {
    const lower = method.toLowerCase();
    for (const term of forbiddenTerms) {
      if (lower.includes(term) && !lower.includes('orderbook')) {
        throw new Error(`SECURITY LEAK: UnifiedMarketDiscoveryEngine exposes forbidden execution method: ${method}`);
      }
    }
  }
  passed++;
  console.log('  [PASS] 4.3: Engine interface verified: zero execution, signing, or key extraction methods exposed.');

  // 4. Dynamic Treasury Isolation Audit in Coverage Report
  const report = unifiedDiscoveryEngine.generateCoverageReport();
  assert(report.treasury_invariant_enforced === true, 'treasury_invariant_enforced must be dynamically computed as true');
  assert(report.invariant_audit.discovery_isolation_verified === true, 'discovery_isolation_verified must be true');
  assert(report.invariant_audit.unauthorized_execution_count === 0, 'unauthorized_execution_count must be 0');
  passed++;
  console.log('  [PASS] 4.4: Dynamic runtime isolation verification audit passed.');

  console.log(`  Summary: ${passed} Security & Isolation Tests Passed.\n`);
  return { passed, failed: 0 };
}
