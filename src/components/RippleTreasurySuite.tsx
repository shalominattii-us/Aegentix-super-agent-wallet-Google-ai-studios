import React, { useState, useEffect } from 'react';
import {
  Building2,
  Globe2,
  TrendingUp,
  ShieldCheck,
  Zap,
  Activity,
  Layers,
  ArrowRight,
  ArrowDownRight,
  CheckCircle2,
  Clock,
  RefreshCw,
  Sliders,
  DollarSign,
  Cpu,
  FileText,
  Lock,
  Workflow,
  Sparkles,
  Server,
  Network,
  Scale,
  Percent,
  Play,
  RotateCcw,
  Check,
} from 'lucide-react';
import {
  INITIAL_TREASURY_ACCOUNTS,
  INITIAL_LIQUIDITY_CORRIDORS,
  TMS_ARCHITECTURE_LAYERS,
  INITIAL_SIMULATION_HISTORY,
  TreasuryAccount,
  LiquidityCorridor,
  ArchitectureLayer,
  TreasurySimulationResult,
} from '../data/rippleTreasuryData';

interface RippleTreasurySuiteProps {
  onNotify?: (message: string, type: 'ALERT' | 'SUCCESS' | 'INFO') => void;
  onOpenInstitutionalTrading?: () => void;
}

export const RippleTreasurySuite: React.FC<RippleTreasurySuiteProps> = ({
  onNotify,
  onOpenInstitutionalTrading,
}) => {
  const [activeTab, setActiveTab] = useState<'TELEMETRY' | 'SIMULATION' | 'ARCHITECTURE' | 'CORRIDORS' | 'AUDIT_LOG'>('TELEMETRY');
  const [accounts, setAccounts] = useState<TreasuryAccount[]>(INITIAL_TREASURY_ACCOUNTS);
  const [corridors, setCorridors] = useState<LiquidityCorridor[]>(INITIAL_LIQUIDITY_CORRIDORS);
  const [history, setHistory] = useState<TreasurySimulationResult[]>(INITIAL_SIMULATION_HISTORY);
  const [runningSim, setRunningSim] = useState<string | null>(null);

  // Dynamic live liquidity metrics (no Math.random fake settlement ticker)
  const [totalCashUsd] = useState(182900000);
  const [dailySettledUsd] = useState(47800000);
  const [savingsCapturedUsd, setSavingsCapturedUsd] = useState(18670);

  const handleToggleAutoSweep = (accId: string) => {
    setAccounts(prev =>
      prev.map(acc => {
        if (acc.id === accId) {
          const nextVal = !acc.autoSweepEnabled;
          if (onNotify) {
            onNotify(`Auto-Sweep for ${acc.bankName} set to ${nextVal ? 'ENABLED' : 'PAUSED'}`, 'INFO');
          }
          return { ...acc, autoSweepEnabled: nextVal };
        }
        return acc;
      })
    );
  };

  const runSimulation = (type: 'LIQUIDITY_SWEEP' | 'ODL_PAYMENT' | 'FX_AUTO_HEDGE' | 'BANK_RECONCILIATION') => {
    setRunningSim(type);
    const simName =
      type === 'LIQUIDITY_SWEEP'
        ? 'Automated Zero-Balance Account (ZBA) Liquidity Sweep'
        : type === 'ODL_PAYMENT'
        ? 'Instant Cross-Border $500,000 Supplier Payout (ODL)'
        : type === 'FX_AUTO_HEDGE'
        ? 'Automated EUR/USD Delta-Neutral FX Micro-Hedge'
        : 'Continuous Multi-Bank camt.053 Statement Reconciliation';

    if (onNotify) onNotify(`⚡ Initiating Simulation: ${simName}...`, 'INFO');

    setTimeout(() => {
      setRunningSim(null);
      const simId = `DRILL-${type.split('_')[0]}-${Date.now()}`;
      const savings = type === 'ODL_PAYMENT' ? 9850 : type === 'LIQUIDITY_SWEEP' ? 3200 : 1500;
      const newEntry: TreasurySimulationResult = {
        simulationId: simId,
        name: `[DRILL] ${simName}`,
        type,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
        status: 'COMPLETED',
        executionTimeMs: type === 'ODL_PAYMENT' ? 3180 : 180,
        details:
          type === 'ODL_PAYMENT'
            ? {
                beneficiary: 'Munich Precision Industrial AG',
                dispatchedAmountUsd: 500000,
                settledAmountEur: 458715,
                effectiveFxRate: 1.0900,
                settlementRail: 'Ripple ODL -> SEPA Instant Rail',
                swiftLatencyComparison: '48h traditional wire -> 3.18 seconds instant',
              }
            : type === 'LIQUIDITY_SWEEP'
            ? {
                sourceAccount: 'BNP Paribas (EU Treasury)',
                targetAccount: 'JPMorgan Chase (US Hub Concentration)',
                sweptAmount: '€2,500,000 EUR ($2,725,000 USD)',
                triggerRule: 'ZBA_BALANCE_CAP_EXCEEDED',
              }
            : {
                hedgedPair: 'EUR/USD',
                notionalAmountUsd: 1250000,
                varianceReducedPct: 98.4,
                reconciledLedgers: 'SAP S/4HANA vs camt.053 (100% matched)',
              },
        costSavingsUsd: savings,
        auditHash: `DRILL-UNATTESTED-${Date.now()}`,
      };

      setHistory(prev => [newEntry, ...prev.slice(0, 19)]);
      setSavingsCapturedUsd(s => s + savings);
      if (onNotify) onNotify(`✅ ${simName} successfully executed and cryptographically sealed!`, 'SUCCESS');
    }, 1400);
  };

  return (
    <div className="bg-[#070B12] border border-cyan-500/30 rounded-xl overflow-hidden shadow-2xl space-y-4 font-mono text-xs text-slate-200">
      {/* Top Header */}
      <div className="p-4 sm:p-5 border-b border-cyan-500/20 bg-gradient-to-r from-[#070B12] via-[#0C1524] to-[#081220] flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-900 border border-cyan-400/40 flex items-center justify-center shadow-lg shadow-cyan-500/20 shrink-0">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-cyan-300 tracking-wider uppercase font-sans">
                RIPPLE TREASURY &middot; POWERED BY GTREASURY (TMS)
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-black border flex items-center gap-1 bg-cyan-500/20 text-cyan-300 border-cyan-500/40">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                TREASURY-NATIVE AI
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-black border flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border-emerald-500/40">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                ALWAYS-ON GLOBAL CORPORATE TREASURY
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-black border flex items-center gap-1 bg-blue-500/20 text-blue-300 border-blue-500/40">
                <ShieldCheck className="w-3 h-3 text-blue-400" />
                ISO 20022 &middot; RLUSD REGULATED
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Next-Gen Corporate Cash Visibility &middot; Multi-Entity Cash Sweeping &middot; On-Demand Liquidity (ODL) Settlement &middot; Predictive Risk Hedging
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {onOpenInstitutionalTrading && (
            <button
              onClick={onOpenInstitutionalTrading}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Institutional Trading Desk</span>
            </button>
          )}
          <button
            onClick={() => runSimulation('ODL_PAYMENT')}
            disabled={runningSim !== null}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer disabled:opacity-50"
          >
            <Zap className={`w-3.5 h-3.5 ${runningSim === 'ODL_PAYMENT' ? 'animate-spin' : ''}`} />
            <span>Simulate $500K ODL Payout</span>
          </button>
        </div>
      </div>

      {/* METRICS HUD STRIP */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 px-3 sm:px-4 py-2 bg-[#050910] border-y border-cyan-500/10 text-center">
        <div className="p-2 border-r border-slate-800">
          <div className="text-base sm:text-lg xl:text-xl font-bold text-cyan-300 font-sans truncate">
            ${(totalCashUsd / 1000000).toFixed(1)}M USD
          </div>
          <div className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-tight truncate">Global Consolidated Cash</div>
        </div>
        <div className="p-2 border-r md:border-r border-slate-800">
          <div className="text-base sm:text-lg xl:text-xl font-bold text-emerald-400 font-sans truncate">
            ${(dailySettledUsd / 1000000).toFixed(2)}M USD
          </div>
          <div className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-tight truncate">24h Corporate Settlements</div>
        </div>
        <div className="p-2 border-r border-slate-800">
          <div className="text-base sm:text-lg xl:text-xl font-bold text-amber-300 font-sans truncate">3.2 Seconds</div>
          <div className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-tight truncate">Median ODL Finality</div>
        </div>
        <div className="p-2">
          <div className="text-base sm:text-lg xl:text-xl font-bold text-purple-300 font-sans truncate">
            +${savingsCapturedUsd.toLocaleString()} USD
          </div>
          <div className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-tight truncate">Captured FX &amp; Wire Savings</div>
        </div>
      </div>

      {/* SUB-TABS */}
      <div className="px-4 border-b border-slate-800 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveTab('TELEMETRY')}
          className={`flex items-center gap-1.5 px-3 py-2 border-b-2 font-bold transition-colors cursor-pointer ${
            activeTab === 'TELEMETRY'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span>Cash Telemetry &amp; Accounts</span>
        </button>

        <button
          onClick={() => setActiveTab('SIMULATION')}
          className={`flex items-center gap-1.5 px-3 py-2 border-b-2 font-bold transition-colors cursor-pointer ${
            activeTab === 'SIMULATION'
              ? 'border-emerald-400 text-emerald-300 bg-emerald-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Play className="w-3.5 h-3.5 text-emerald-400" />
          <span>Interactive TMS Simulations</span>
        </button>

        <button
          onClick={() => setActiveTab('ARCHITECTURE')}
          className={`flex items-center gap-1.5 px-3 py-2 border-b-2 font-bold transition-colors cursor-pointer ${
            activeTab === 'ARCHITECTURE'
              ? 'border-purple-400 text-purple-300 bg-purple-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-purple-400" />
          <span>Engineering Model &amp; Architecture</span>
        </button>

        <button
          onClick={() => setActiveTab('CORRIDORS')}
          className={`flex items-center gap-1.5 px-3 py-2 border-b-2 font-bold transition-colors cursor-pointer ${
            activeTab === 'CORRIDORS'
              ? 'border-amber-400 text-amber-300 bg-amber-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Globe2 className="w-3.5 h-3.5 text-amber-400" />
          <span>Liquidity Corridors &amp; FX</span>
        </button>

        <button
          onClick={() => setActiveTab('AUDIT_LOG')}
          className={`flex items-center gap-1.5 px-3 py-2 border-b-2 font-bold transition-colors cursor-pointer ${
            activeTab === 'AUDIT_LOG'
              ? 'border-indigo-400 text-indigo-300 bg-indigo-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-indigo-400" />
          <span>Immutable Audit Ledger</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: CASH TELEMETRY & MULTI-BANK ACCOUNTS               */}
      {/* ========================================================= */}
      {activeTab === 'TELEMETRY' && (
        <div className="p-4 space-y-4">
          <div className="bg-[#050910] border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-xs font-bold text-white uppercase flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-cyan-400" />
                  <span>Real-Time Multi-Entity Bank Cash Positioning</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Automated camt.053 reconciliation across global clearing and liquidity reserve accounts.
                </p>
              </div>
              <button
                onClick={() => runSimulation('LIQUIDITY_SWEEP')}
                disabled={runningSim !== null}
                className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${runningSim === 'LIQUIDITY_SWEEP' ? 'animate-spin' : ''}`} />
                <span>Run Global Cash Sweep</span>
              </button>
            </div>

            <div className="overflow-x-auto border border-slate-800 rounded-lg">
              <table className="w-full min-w-[620px] text-left text-xs">
                <thead className="bg-[#0A121E] text-slate-400 text-[10px] uppercase border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Bank &amp; Account ID</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Jurisdiction</th>
                    <th className="py-2.5 px-3">Currency Balance</th>
                    <th className="py-2.5 px-3">USD Valuation</th>
                    <th className="py-2.5 px-3">Auto-Sweep (ZBA)</th>
                    <th className="py-2.5 px-3">Reconciliation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-950/60 font-mono">
                  {accounts.map(acc => (
                    <tr key={acc.id} className="hover:bg-slate-900/60 text-[11px]">
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-white block">{acc.bankName}</span>
                        <span className="text-[9px] text-slate-500">{acc.id}</span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-900 border border-slate-700 text-slate-300">
                          {acc.accountType}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-300 text-[10px]">{acc.jurisdiction}</td>
                      <td className="py-2.5 px-3 font-bold text-white">
                        {acc.balance.toLocaleString()} {acc.currency}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-cyan-300">
                        ${acc.balanceUsd.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3">
                        <button
                          onClick={() => handleToggleAutoSweep(acc.id)}
                          className={`px-2 py-0.5 rounded text-[9px] font-bold cursor-pointer transition-all ${
                            acc.autoSweepEnabled
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}
                        >
                          {acc.autoSweepEnabled ? 'ACTIVE (ZBA)' : 'OFF'}
                        </button>
                      </td>
                      <td className="py-2.5 px-3 text-[10px] text-emerald-400 flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>Verified</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: INTERACTIVE LIVE MODULE SIMULATIONS                */}
      {/* ========================================================= */}
      {activeTab === 'SIMULATION' && (
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
            {/* Sim 1: ZBA Liquidity Sweep */}
            <div className="p-4 rounded-xl bg-[#050910] border border-cyan-500/30 space-y-3 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-cyan-400" />
                  <h4 className="font-bold text-white text-xs">Zero-Balance Liquidity Sweep</h4>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Automatically sweeps excess operating balances from Europe B.V. into the global concentration treasury account.
                </p>
              </div>
              <button
                onClick={() => runSimulation('LIQUIDITY_SWEEP')}
                disabled={runningSim !== null}
                className="w-full py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50"
              >
                <Play className={`w-3.5 h-3.5 ${runningSim === 'LIQUIDITY_SWEEP' ? 'animate-spin' : ''}`} />
                <span>{runningSim === 'LIQUIDITY_SWEEP' ? 'Sweeping...' : 'Execute ZBA Sweep'}</span>
              </button>
            </div>

            {/* Sim 2: Cross-Border ODL Payment */}
            <div className="p-4 rounded-xl bg-[#050910] border border-emerald-500/30 space-y-3 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <h4 className="font-bold text-white text-xs">Cross-Border ODL Settlement</h4>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Dispatches $500,000 USD to European supplier with sub-5s instant settlement over Ripple ODL and SEPA Instant.
                </p>
              </div>
              <button
                onClick={() => runSimulation('ODL_PAYMENT')}
                disabled={runningSim !== null}
                className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50"
              >
                <Zap className={`w-3.5 h-3.5 ${runningSim === 'ODL_PAYMENT' ? 'animate-spin' : ''}`} />
                <span>{runningSim === 'ODL_PAYMENT' ? 'Settling...' : 'Dispatch $500K ODL'}</span>
              </button>
            </div>

            {/* Sim 3: FX Auto-Hedge */}
            <div className="p-4 rounded-xl bg-[#050910] border border-purple-500/30 space-y-3 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-purple-400" />
                  <h4 className="font-bold text-white text-xs">Automated FX Micro-Hedge</h4>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Evaluates 30-day corporate cash flows and places delta-neutral micro-hedges to neutralize currency volatility.
                </p>
              </div>
              <button
                onClick={() => runSimulation('FX_AUTO_HEDGE')}
                disabled={runningSim !== null}
                className="w-full py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50"
              >
                <Scale className={`w-3.5 h-3.5 ${runningSim === 'FX_AUTO_HEDGE' ? 'animate-spin' : ''}`} />
                <span>{runningSim === 'FX_AUTO_HEDGE' ? 'Hedging...' : 'Execute FX Hedge'}</span>
              </button>
            </div>

            {/* Sim 4: Multi-Bank Reconciliation */}
            <div className="p-4 rounded-xl bg-[#050910] border border-indigo-500/30 space-y-3 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                  <h4 className="font-bold text-white text-xs">camt.053 Reconciliation</h4>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Parses real-time XML statements against enterprise ERP general ledgers, achieving 99.8% automated reconciliation.
                </p>
              </div>
              <button
                onClick={() => runSimulation('BANK_RECONCILIATION')}
                disabled={runningSim !== null}
                className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50"
              >
                <CheckCircle2 className={`w-3.5 h-3.5 ${runningSim === 'BANK_RECONCILIATION' ? 'animate-spin' : ''}`} />
                <span>{runningSim === 'BANK_RECONCILIATION' ? 'Matching...' : 'Match Ledgers'}</span>
              </button>
            </div>
          </div>

          {/* Live Simulation Execution Feed */}
          <div className="bg-[#050910] border border-slate-800 rounded-xl p-4 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Real-Time Simulation Audit Trail</span>
            </h3>

            <div className="space-y-2">
              {history.map(sim => (
                <div key={sim.simulationId} className="p-3 bg-slate-950 border border-slate-850 rounded-lg space-y-2 text-[11px]">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{sim.name}</span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                        {sim.simulationId}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400 font-bold">
                        {sim.costSavingsUsd ? `+$${sim.costSavingsUsd.toLocaleString()} USD Saved` : 'Reconciled'}
                      </span>
                      <span className="text-[10px] text-slate-500">{sim.executionTimeMs} ms</span>
                    </div>
                  </div>

                  <div className="p-2 rounded bg-black/60 font-mono text-[10px] text-slate-300 overflow-x-auto space-y-1">
                    {Object.entries(sim.details).map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-4">
                        <span className="text-slate-500">{k}:</span>
                        <span className="text-cyan-300 font-bold text-right">{String(v)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-[9px] text-slate-500 pt-1 border-t border-slate-900 font-mono">
                    <span>Audit Seal: {sim.auditHash}</span>
                    <span>{sim.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: ENGINEERING MODEL & ARCHITECTURE SPECS             */}
      {/* ========================================================= */}
      {activeTab === 'ARCHITECTURE' && (
        <div className="p-4 space-y-4">
          <div className="space-y-4">
            {TMS_ARCHITECTURE_LAYERS.map(layer => (
              <div
                key={layer.id}
                className="p-4 rounded-xl bg-[#050910] border border-slate-800 space-y-3"
              >
                <div className="flex items-start justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center justify-center font-bold text-xs">
                      L{layer.layerNumber}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{layer.name}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{layer.tagline}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                    SLA: {layer.slaMetrics}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                  {/* Responsibilities */}
                  <div className="space-y-1 md:col-span-2 bg-slate-950/80 p-3 rounded-lg border border-slate-850">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                      Core Functional Responsibilities:
                    </span>
                    <ul className="space-y-1 text-[11px] text-slate-300">
                      {layer.responsibilities.map((r, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tech & Protocols */}
                  <div className="space-y-2 bg-slate-950/80 p-3 rounded-lg border border-slate-850">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                        Technologies:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {layer.technologies.map((t, i) => (
                          <span key={i} className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[9px] text-slate-300">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                        Protocols &amp; Standards:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {layer.protocols.map((p, i) => (
                          <span key={i} className="px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-800 text-[9px] text-cyan-300">
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: LIQUIDITY CORRIDORS & FX SPREADS                   */}
      {/* ========================================================= */}
      {activeTab === 'CORRIDORS' && (
        <div className="p-4 space-y-4">
          <div className="bg-[#050910] border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-xs flex items-center gap-1.5">
                <Globe2 className="w-4 h-4 text-amber-400" />
                <span>On-Demand Liquidity (ODL) vs Traditional Correspondent Banking</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-bold">● Active Settlement Rails</span>
            </div>

            <div className="overflow-x-auto border border-slate-800 rounded-lg">
              <table className="w-full min-w-[620px] text-left text-xs">
                <thead className="bg-[#0A121E] text-slate-400 text-[10px] uppercase border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Corridor</th>
                    <th className="py-2.5 px-3">Routing Architecture</th>
                    <th className="py-2.5 px-3">Settlement Speed</th>
                    <th className="py-2.5 px-3">Traditional Fee</th>
                    <th className="py-2.5 px-3">Ripple TMS Fee</th>
                    <th className="py-2.5 px-3">Cost Savings</th>
                    <th className="py-2.5 px-3">24h Flow</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-950/60 font-mono">
                  {corridors.map(c => (
                    <tr key={c.id} className="hover:bg-slate-900/60 text-[11px]">
                      <td className="py-2.5 px-3 font-bold text-cyan-300">
                        {c.sourceCurrency} &rarr; {c.targetCurrency}
                      </td>
                      <td className="py-2.5 px-3 text-slate-300 text-[10px]">{c.route}</td>
                      <td className="py-2.5 px-3 text-white font-bold">{c.averageLatency}</td>
                      <td className="py-2.5 px-3 text-rose-400">${c.traditionalCostUsd.toFixed(2)}</td>
                      <td className="py-2.5 px-3 text-emerald-400 font-bold">${c.rippleCostUsd.toFixed(2)}</td>
                      <td className="py-2.5 px-3">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          {c.costSavingsPct}% CHEAPER
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-300">
                        ${(c.volume24hUsd / 1000000).toFixed(1)}M
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: IMMUTABLE AUDIT LEDGER                             */}
      {/* ========================================================= */}
      {activeTab === 'AUDIT_LOG' && (
        <div className="p-4 space-y-4">
          <div className="bg-[#050910] border border-slate-800 rounded-xl p-4 space-y-3 font-mono">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-xs flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-indigo-400" />
                <span>Cryptographic Treasury Audit Log (SOC 1 &amp; ISO 20022 Compliant)</span>
              </span>
              <span className="text-[10px] text-slate-400">Continuous Block Verification</span>
            </div>

            <div className="divide-y divide-slate-800/80 border border-slate-800 rounded-lg overflow-hidden bg-slate-950">
              {history.map(item => (
                <div key={item.simulationId} className="p-3 text-[11px] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold">{item.name}</span>
                    <span className="text-emerald-400 font-bold">STATUS: {item.status}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>ID: {item.simulationId} &middot; Execution: {item.executionTimeMs}ms</span>
                    <span>Timestamp: {item.timestamp}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 truncate" title={item.auditHash}>
                    SHA-256 Seal: {item.auditHash}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
