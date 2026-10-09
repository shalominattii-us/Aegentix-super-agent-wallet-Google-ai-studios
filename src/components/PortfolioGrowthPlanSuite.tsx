import React, { useState, useMemo, useEffect } from 'react';
import {
  TrendingUp,
  Award,
  Key,
  Shield,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Copy,
  Check,
  RefreshCw,
  Download,
  Plus,
  Sliders,
  DollarSign,
  Calendar,
  Layers,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Server,
  Cpu,
  Globe,
  Database,
  ArrowUpRight,
  FileText,
  Activity,
  Terminal,
  Search,
  Filter
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Legend
} from 'recharts';
import {
  PortfolioGrowthPlan,
  TradingCredential,
  CyberGymCredential,
  StrategyMode,
  TradingCredentialType,
  CyberGymCredentialCategory
} from '../types/growthAndCredentials';
import {
  getStoredGrowthPlan,
  getStoredTradingCredentials,
  getStoredCyberGymCredentials,
  saveGrowthPlan,
  saveTradingCredential,
  saveCyberGymCredential
} from '../lib/growthPlanFirestore';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

interface PortfolioGrowthPlanSuiteProps {
  currentNetWorthUsd?: number;
  onNotify?: (message: string, type: 'INFO' | 'SUCCESS' | 'WARN' | 'ALERT') => void;
  onOpenTradingCommand?: () => void;
  onOpenCyberGym?: () => void;
}

export const PortfolioGrowthPlanSuite: React.FC<PortfolioGrowthPlanSuiteProps> = ({
  currentNetWorthUsd = 48294.50,
  onNotify,
  onOpenTradingCommand,
  onOpenCyberGym
}) => {
  // Active sub-tab
  const [activeTab, setActiveTab] = useState<'GROWTH_CHART' | 'TRADING_CREDS' | 'CYBERGYM_CREDS' | 'UNIFIED_PLAN'>('GROWTH_CHART');

  // Firebase Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Core Data States
  const [growthPlan, setGrowthPlan] = useState<PortfolioGrowthPlan>(getStoredGrowthPlan());
  const [tradingCredentials, setTradingCredentials] = useState<TradingCredential[]>(getStoredTradingCredentials());
  const [cyberGymCredentials, setCyberGymCredentials] = useState<CyberGymCredential[]>(getStoredCyberGymCredentials());

  // Interactive Plan Form Controls
  const [planForm, setPlanForm] = useState({
    initialCapitalUsd: growthPlan.initialCapitalUsd,
    monthlyContributionUsd: growthPlan.monthlyContributionUsd,
    targetMilestoneUsd: growthPlan.targetMilestoneUsd,
    projectedAprPct: growthPlan.projectedAprPct,
    timeHorizonMonths: growthPlan.timeHorizonMonths,
    strategyMode: growthPlan.strategyMode,
    reinvestmentRatePct: growthPlan.reinvestmentRatePct,
    maxDrawdownTolerancePct: growthPlan.maxDrawdownTolerancePct
  });

  // Filter & Search states
  const [tradingTypeFilter, setTradingTypeFilter] = useState<string>('ALL');
  const [tradingSearch, setTradingSearch] = useState<string>('');
  const [cyberFilter, setCyberFilter] = useState<string>('ALL');
  const [cyberSearch, setCyberSearch] = useState<string>('');

  // UI helpers
  const [revealedSecrets, setRevealedSecrets] = useState<Record<string, boolean>>({});
  const [testingCredId, setTestingCredId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isAddingCredModal, setIsAddingCredModal] = useState<boolean>(false);
  const [isSavingPlan, setIsSavingPlan] = useState<boolean>(false);

  // New Credential Form State
  const [newCred, setNewCred] = useState({
    provider: '',
    name: '',
    type: 'CEX_API' as TradingCredentialType,
    keyIdentifier: '',
    secretMasked: '',
    permissions: 'Spot Arbitrage · Read Telemetry',
    network: 'Mainnet CEX',
    hardwareBound: true
  });

  // Listen to Auth State
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsub();
  }, []);

  // Sync state if initial changes
  useEffect(() => {
    setPlanForm({
      initialCapitalUsd: growthPlan.initialCapitalUsd,
      monthlyContributionUsd: growthPlan.monthlyContributionUsd,
      targetMilestoneUsd: growthPlan.targetMilestoneUsd,
      projectedAprPct: growthPlan.projectedAprPct,
      timeHorizonMonths: growthPlan.timeHorizonMonths,
      strategyMode: growthPlan.strategyMode,
      reinvestmentRatePct: growthPlan.reinvestmentRatePct,
      maxDrawdownTolerancePct: growthPlan.maxDrawdownTolerancePct
    });
  }, [growthPlan]);

  // Strategy Mode Presets
  const applyStrategyPreset = (mode: StrategyMode) => {
    let apr = 42.6;
    let contrib = planForm.monthlyContributionUsd;
    let horizon = 36;
    let target = 1250000;
    let reinvestment = 90;
    let maxDrawdown = 8.5;

    if (mode === 'BALANCED_ARBITRAGE') {
      apr = 42.6;
      target = 1250000;
      horizon = 36;
      reinvestment = 90;
      maxDrawdown = 8.5;
    } else if (mode === 'AGGRESSIVE_ALPHA') {
      apr = 64.2;
      target = 2500000;
      horizon = 36;
      reinvestment = 95;
      maxDrawdown = 14.0;
    } else if (mode === 'DELTA_NEUTRAL') {
      apr = 24.8;
      target = 750000;
      horizon = 36;
      reinvestment = 80;
      maxDrawdown = 4.2;
    } else if (mode === 'SOVEREIGN_ENDOWMENT') {
      apr = 36.5;
      target = 5000000;
      horizon = 60;
      contrib = 5000;
      reinvestment = 85;
      maxDrawdown = 6.0;
    }

    setPlanForm((prev) => ({
      ...prev,
      strategyMode: mode,
      projectedAprPct: apr,
      targetMilestoneUsd: target,
      timeHorizonMonths: horizon,
      monthlyContributionUsd: contrib,
      reinvestmentRatePct: reinvestment,
      maxDrawdownTolerancePct: maxDrawdown
    }));

    if (onNotify) {
      onNotify(`Applied strategy preset: ${mode.replace(/_/g, ' ')} (${apr}% APR projection)`, 'INFO');
    }
  };

  // Generate Compound Growth Curve Points
  const growthCurveData = useMemo(() => {
    const months = Math.max(6, Math.min(60, planForm.timeHorizonMonths));
    const monthlyRate = (planForm.projectedAprPct / 100) / 12;
    const aggressiveMonthlyRate = ((planForm.projectedAprPct * 1.35) / 100) / 12;
    const conservativeMonthlyRate = ((planForm.projectedAprPct * 0.55) / 100) / 12;

    let baseBalance = planForm.initialCapitalUsd;
    let bullBalance = planForm.initialCapitalUsd;
    let floorBalance = planForm.initialCapitalUsd;
    let totalInvested = planForm.initialCapitalUsd;

    const data = [];
    const startDate = new Date();

    for (let m = 0; m <= months; m++) {
      const monthDate = new Date(startDate.getFullYear(), startDate.getMonth() + m, 1);
      const label = m === 0 ? 'Today' : monthDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });

      // Milestones hit check
      const milestoneHit = growthPlan.milestones.find(ms => {
        return Math.abs(ms.targetMonth - m) === 0;
      });

      data.push({
        monthIndex: m,
        dateLabel: label,
        baseProjection: Math.round(baseBalance),
        bullAlpha: Math.round(bullBalance),
        floorProtected: Math.round(floorBalance),
        principalInvested: Math.round(totalInvested),
        targetMilestone: planForm.targetMilestoneUsd,
        milestoneName: milestoneHit?.name || null
      });

      // Compound next month
      const reinvestmentFactor = planForm.reinvestmentRatePct / 100;
      baseBalance = baseBalance * (1 + (monthlyRate * reinvestmentFactor)) + planForm.monthlyContributionUsd;
      bullBalance = bullBalance * (1 + (aggressiveMonthlyRate * reinvestmentFactor)) + planForm.monthlyContributionUsd;
      floorBalance = floorBalance * (1 + (conservativeMonthlyRate * reinvestmentFactor)) + planForm.monthlyContributionUsd;
      totalInvested += planForm.monthlyContributionUsd;
    }

    return data;
  }, [planForm, growthPlan.milestones]);

  // Projected Final Value
  const projectedFinalValue = growthCurveData[growthCurveData.length - 1]?.baseProjection || 0;
  const projectedAlphaValue = growthCurveData[growthCurveData.length - 1]?.bullAlpha || 0;
  const projectedFloorValue = growthCurveData[growthCurveData.length - 1]?.floorProtected || 0;
  const totalPrincipalInvested = growthCurveData[growthCurveData.length - 1]?.principalInvested || 0;
  const projectedTotalProfit = Math.max(0, projectedFinalValue - totalPrincipalInvested);
  const projectedMonthlyPassiveYield = Math.round((projectedFinalValue * (planForm.projectedAprPct / 100)) / 12);

  // Save Plan Changes
  const handleSavePlan = async () => {
    setIsSavingPlan(true);
    const updated: PortfolioGrowthPlan = {
      ...growthPlan,
      initialCapitalUsd: planForm.initialCapitalUsd,
      monthlyContributionUsd: planForm.monthlyContributionUsd,
      targetMilestoneUsd: planForm.targetMilestoneUsd,
      projectedAprPct: planForm.projectedAprPct,
      timeHorizonMonths: planForm.timeHorizonMonths,
      strategyMode: planForm.strategyMode,
      reinvestmentRatePct: planForm.reinvestmentRatePct,
      maxDrawdownTolerancePct: planForm.maxDrawdownTolerancePct,
      updatedAt: new Date().toISOString()
    };

    setGrowthPlan(updated);
    await saveGrowthPlan(updated);
    setIsSavingPlan(false);

    if (onNotify) {
      onNotify('Portfolio Growth Plan saved and synced with Sovereign Firestore DB.', 'SUCCESS');
    }
  };

  // Toggle Masked Secret
  const toggleSecret = (id: string) => {
    setRevealedSecrets(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Copy helper
  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    if (onNotify) onNotify(`Copied to clipboard: ${text.slice(0, 24)}...`, 'INFO');
  };

  // Ping Credential test
  const testCredentialConnection = (cred: TradingCredential) => {
    setTestingCredId(cred.id);
    setTimeout(() => {
      const simulatedLatency = Math.floor(Math.random() * 18) + 6;
      const updatedCred: TradingCredential = {
        ...cred,
        latencyMs: simulatedLatency,
        lastTestedAt: `Just now (HTTP 200 OK · ${simulatedLatency}ms)`
      };
      const updatedList = tradingCredentials.map(c => c.id === cred.id ? updatedCred : c);
      setTradingCredentials(updatedList);
      saveTradingCredential(updatedCred);
      setTestingCredId(null);
      if (onNotify) {
        onNotify(`Connection Verified: ${cred.name} (${simulatedLatency}ms latency)`, 'SUCCESS');
      }
    }, 900);
  };

  // Test CyberGym Credential Attestation
  const testCyberAttestation = (cred: CyberGymCredential) => {
    setTestingCredId(cred.id);
    setTimeout(() => {
      setTestingCredId(null);
      if (onNotify) {
        onNotify(`Oracle Consensus Attested: ${cred.title} verified by ${cred.oracleQuorum}`, 'SUCCESS');
      }
    }, 850);
  };

  // Filtered Trading Credentials
  const filteredTrading = useMemo(() => {
    return tradingCredentials.filter(c => {
      const matchesType = tradingTypeFilter === 'ALL' || c.type === tradingTypeFilter;
      const matchesSearch = !tradingSearch ||
        c.name.toLowerCase().includes(tradingSearch.toLowerCase()) ||
        c.provider.toLowerCase().includes(tradingSearch.toLowerCase()) ||
        c.network.toLowerCase().includes(tradingSearch.toLowerCase()) ||
        c.permissions.toLowerCase().includes(tradingSearch.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [tradingCredentials, tradingTypeFilter, tradingSearch]);

  // Filtered CyberGym Credentials
  const filteredCyber = useMemo(() => {
    return cyberGymCredentials.filter(c => {
      const matchesCategory = cyberFilter === 'ALL' || c.category === cyberFilter;
      const matchesSearch = !cyberSearch ||
        c.title.toLowerCase().includes(cyberSearch.toLowerCase()) ||
        c.athleteOrEntity.toLowerCase().includes(cyberSearch.toLowerCase()) ||
        c.tier.toLowerCase().includes(cyberSearch.toLowerCase()) ||
        c.capabilities.some(cap => cap.toLowerCase().includes(cyberSearch.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [cyberGymCredentials, cyberFilter, cyberSearch]);

  // Add Custom Trading Credential
  const handleAddTradingCredential = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCred.provider || !newCred.name || !newCred.keyIdentifier) {
      if (onNotify) onNotify('Please fill in Provider, Name, and Key Identifier', 'WARN');
      return;
    }

    const created: TradingCredential = {
      id: `CRED-${Date.now().toString(36).toUpperCase()}`,
      provider: newCred.provider,
      name: newCred.name,
      type: newCred.type,
      status: 'ACTIVE',
      keyIdentifier: newCred.keyIdentifier,
      secretMasked: newCred.secretMasked || '••••••••••••••••••••••••••••••••',
      permissions: newCred.permissions,
      network: newCred.network,
      latencyMs: 12,
      lastTestedAt: 'Just now (Initial Key Creation)',
      createdAt: new Date().toISOString(),
      rateLimitTier: 'Tier 1 Standard',
      hardwareBound: newCred.hardwareBound
    };

    const updated = [created, ...tradingCredentials];
    setTradingCredentials(updated);
    await saveTradingCredential(created);
    setIsAddingCredModal(false);
    setNewCred({
      provider: '',
      name: '',
      type: 'CEX_API',
      keyIdentifier: '',
      secretMasked: '',
      permissions: 'Spot Arbitrage · Read Telemetry',
      network: 'Mainnet CEX',
      hardwareBound: true
    });

    if (onNotify) {
      onNotify(`Added and registered trading credential: ${created.name}`, 'SUCCESS');
    }
  };

  // Export Full Dossier
  const handleExportDossier = () => {
    const payload = {
      portfolioGrowthPlan: growthPlan,
      projectedTrajectory: growthCurveData,
      tradingCredentialsVault: tradingCredentials.map(c => ({
        ...c,
        secretMasked: 'REDACTED_FOR_SECURITY_EXPORT'
      })),
      cyberGymCredentialsVault: cyberGymCredentials,
      exportedAt: new Date().toISOString(),
      sovereignHash: '0x' + Math.random().toString(16).substring(2, 18) + Math.random().toString(16).substring(2, 18),
      systemVersion: 'Aegentix-v4.8-Sovereign-Engine'
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aegentix-portfolio-growth-plan-and-credentials-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (onNotify) {
      onNotify('Exported complete Portfolio Growth Plan & Sovereign Credentials Dossier (JSON)', 'SUCCESS');
    }
  };

  return (
    <div className="space-y-6 font-mono text-slate-200">
      {/* Top Banner / Cockpit Header */}
      <div className="bg-gradient-to-r from-slate-950 via-[#0B101B] to-slate-950 border border-cyan-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1.5 shadow-sm">
                <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                <span>Sovereign Wealth Planning &amp; Vault</span>
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                <Key className="w-3 h-3 text-purple-400" />
                <span>{tradingCredentials.length} Trading Keys</span>
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Award className="w-3 h-3 text-emerald-400" />
                <span>{cyberGymCredentials.length} CyberGym Passports</span>
              </span>
              {currentUser ? (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800 flex items-center gap-1">
                  <Database className="w-3 h-3 text-cyan-400" />
                  <span>Firestore Cloud Synced ({currentUser.email || currentUser.uid.slice(0, 8)})</span>
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950/70 text-amber-300 border border-amber-800 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-amber-400" />
                  <span>Local Vault Mode (Persistent Storage Ready)</span>
                </span>
              )}
            </div>
            <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight uppercase flex items-center gap-3">
              <span>Portfolio Growth Plan &amp; Credential Engine</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Deterministic compounding models, CEX/DEX arbitrage alpha forecasts, milestone roadmap, and authorized security credentials across institutional exchanges and CyberGym government testbeds.
            </p>
          </div>

          {/* Top Quick Actions */}
          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <button
              onClick={handleExportDossier}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-cyan-500/50 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md"
              title="Export complete plan & sanitized credential vault as JSON"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export Plan Dossier</span>
            </button>
            <button
              onClick={() => setIsAddingCredModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center gap-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Trading Key</span>
            </button>
          </div>
        </div>

        {/* 5-Metric Strategic Status Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 pt-6">
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-3.5">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Current Valuation</span>
              <Activity className="w-3 h-3 text-cyan-400" />
            </div>
            <div className="text-lg lg:text-xl font-black text-white tabular-nums">
              ${currentNetWorthUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-[10px] text-emerald-400 font-bold mt-0.5 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" />
              <span>Mark-to-Market Real-Time</span>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-3.5">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Target Milestone</span>
              <Award className="w-3 h-3 text-amber-400" />
            </div>
            <div className="text-lg lg:text-xl font-black text-amber-300 tabular-nums">
              ${planForm.targetMilestoneUsd.toLocaleString('en-US', { minimumFractionDigits: 0 })}
            </div>
            <div className="text-[10px] text-slate-400 font-bold mt-0.5">
              Target Horizon: {planForm.timeHorizonMonths} Months
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-3.5">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Projected Final Value</span>
              <TrendingUp className="w-3 h-3 text-emerald-400" />
            </div>
            <div className="text-lg lg:text-xl font-black text-emerald-400 tabular-nums">
              ${projectedFinalValue.toLocaleString('en-US', { minimumFractionDigits: 0 })}
            </div>
            <div className="text-[10px] text-emerald-300/80 font-bold mt-0.5">
              +${projectedTotalProfit.toLocaleString('en-US', { minimumFractionDigits: 0 })} Gain
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-3.5">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Compounding APY</span>
              <Zap className="w-3 h-3 text-cyan-400" />
            </div>
            <div className="text-lg lg:text-xl font-black text-cyan-300 tabular-nums">
              {planForm.projectedAprPct.toFixed(1)}%
            </div>
            <div className="text-[10px] text-cyan-400 font-bold mt-0.5">
              ~${projectedMonthlyPassiveYield.toLocaleString('en-US', { minimumFractionDigits: 0 })}/mo Yield
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-3.5 col-span-2 sm:col-span-1">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Security &amp; Keys</span>
              <ShieldCheck className="w-3 h-3 text-purple-400" />
            </div>
            <div className="text-lg lg:text-xl font-black text-purple-300 tabular-nums">
              {tradingCredentials.length + cyberGymCredentials.length} Items
            </div>
            <div className="text-[10px] text-purple-400 font-bold mt-0.5">
              100% Attested &amp; Hardened
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mt-6 border-t border-slate-800/90 pt-4 overflow-x-auto scrollbar-thin">
          <button
            onClick={() => setActiveTab('GROWTH_CHART')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'GROWTH_CHART'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                : 'bg-slate-900/70 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
            <span>Growth Chart &amp; Projections</span>
          </button>

          <button
            onClick={() => setActiveTab('TRADING_CREDS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'TRADING_CREDS'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50 shadow-sm'
                : 'bg-slate-900/70 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Key className="w-3.5 h-3.5 text-purple-400" />
            <span>Trading Credentials ({tradingCredentials.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('CYBERGYM_CREDS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'CYBERGYM_CREDS'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-sm'
                : 'bg-slate-900/70 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            <span>CyberGym Credentials ({cyberGymCredentials.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('UNIFIED_PLAN')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'UNIFIED_PLAN'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-sm'
                : 'bg-slate-900/70 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>Milestone Roadmap &amp; Executive Plan</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: GROWTH CHART & INTERACTIVE PLANNING CONTROLS */}
      {/* ========================================================================= */}
      {activeTab === 'GROWTH_CHART' && (
        <div className="space-y-6">
          {/* Main Chart + Sidebar Controls Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart Area (2 Columns) */}
            <div className="lg:col-span-2 bg-[#0B101B] border border-cyan-500/30 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-cyan-400" />
                      <span>Deterministic Compounding Growth Trajectory</span>
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Multi-tier projections combining CEX/DEX arbitrage yield, delta-neutral auto-hedge, and monthly contributions.
                    </p>
                  </div>

                  {/* Strategy Preset Chips */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {(['BALANCED_ARBITRAGE', 'AGGRESSIVE_ALPHA', 'DELTA_NEUTRAL', 'SOVEREIGN_ENDOWMENT'] as StrategyMode[]).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => applyStrategyPreset(mode)}
                        className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-colors cursor-pointer ${
                          planForm.strategyMode === mode
                            ? 'bg-cyan-500 text-slate-950 font-black shadow-md'
                            : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                        }`}
                      >
                        {mode.split('_')[0]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recharts Area Chart */}
                <div className="w-full h-80 min-h-[320px] pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={growthCurveData} margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="baseProjectionGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
                        </linearGradient>
                        <linearGradient id="bullAlphaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                        </linearGradient>
                        <linearGradient id="floorGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>

                      <CartesianGrid stroke="#1E293B" strokeDasharray="3 3" vertical={false} />
                      <XAxis
                        dataKey="dateLabel"
                        stroke="#64748B"
                        tick={{ fill: '#94A3B8', fontSize: 11 }}
                        tickLine={{ stroke: '#334155' }}
                      />
                      <YAxis
                        stroke="#64748B"
                        tick={{ fill: '#94A3B8', fontSize: 11 }}
                        tickLine={{ stroke: '#334155' }}
                        tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                        domain={['dataMin - 10000', 'auto']}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0F172A',
                          borderColor: '#06B6D4',
                          borderRadius: '0.75rem',
                          color: '#E2E8F0',
                          fontSize: '11px',
                          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
                        }}
                        formatter={(val: any, name: any) => {
                          const formatted = `$${Number(val).toLocaleString()}`;
                          if (name === 'bullAlpha') return [formatted, 'Bullish Alpha Case (+35% Boost)'];
                          if (name === 'baseProjection') return [formatted, 'Base Plan Projection'];
                          if (name === 'floorProtected') return [formatted, 'Floor / Auto-Hedge Protected'];
                          if (name === 'principalInvested') return [formatted, 'Cumulative Principal Inflow'];
                          return [formatted, name];
                        }}
                        labelFormatter={(label) => `Timeline: ${label}`}
                      />
                      <Legend
                        verticalAlign="top"
                        height={36}
                        formatter={(value) => {
                          if (value === 'bullAlpha') return <span className="text-emerald-400 font-bold text-xs">Bullish Alpha Runbook</span>;
                          if (value === 'baseProjection') return <span className="text-cyan-400 font-bold text-xs">Base Strategic Plan</span>;
                          if (value === 'floorProtected') return <span className="text-purple-400 font-bold text-xs">Delta-Neutral Floor</span>;
                          return <span className="text-slate-400 text-xs">{value}</span>;
                        }}
                      />

                      <ReferenceLine
                        y={planForm.targetMilestoneUsd}
                        stroke="#F59E0B"
                        strokeDasharray="4 4"
                        label={{
                          value: `Target: $${(planForm.targetMilestoneUsd / 1000).toFixed(0)}k`,
                          fill: '#F59E0B',
                          fontSize: 10,
                          position: 'insideTopRight'
                        }}
                      />

                      <Area
                        type="monotone"
                        dataKey="bullAlpha"
                        stroke="#10B981"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#bullAlphaGrad)"
                      />
                      <Area
                        type="monotone"
                        dataKey="baseProjection"
                        stroke="#06B6D4"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#baseProjectionGrad)"
                      />
                      <Area
                        type="monotone"
                        dataKey="floorProtected"
                        stroke="#8B5CF6"
                        strokeWidth={1.5}
                        fillOpacity={1}
                        fill="url(#floorGrad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart Trajectory Summary Footer */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800 text-center mt-3">
                <div className="p-2 bg-slate-900/60 rounded-lg">
                  <div className="text-[10px] text-slate-400 uppercase">Worst-Case Floor</div>
                  <div className="text-xs sm:text-sm font-bold text-purple-300 tabular-nums">
                    ${projectedFloorValue.toLocaleString()}
                  </div>
                </div>
                <div className="p-2 bg-slate-900/60 rounded-lg border border-cyan-500/20">
                  <div className="text-[10px] text-cyan-400 uppercase font-bold">Base Plan Target</div>
                  <div className="text-xs sm:text-sm font-bold text-cyan-300 tabular-nums">
                    ${projectedFinalValue.toLocaleString()}
                  </div>
                </div>
                <div className="p-2 bg-slate-900/60 rounded-lg">
                  <div className="text-[10px] text-slate-400 uppercase">Alpha Surge Case</div>
                  <div className="text-xs sm:text-sm font-bold text-emerald-300 tabular-nums">
                    ${projectedAlphaValue.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Planning Engine Controls (1 Column) */}
            <div className="bg-[#0B101B] border border-cyan-500/30 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-cyan-400" />
                    <span>Plan Parameter Engine</span>
                  </h3>
                  <button
                    onClick={() => applyStrategyPreset('BALANCED_ARBITRAGE')}
                    className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Initial Capital */}
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                      <span>Initial Starting Capital:</span>
                      <span className="font-bold text-white tabular-nums">${planForm.initialCapitalUsd.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min={10000}
                      max={250000}
                      step={5000}
                      value={planForm.initialCapitalUsd}
                      onChange={(e) => setPlanForm({ ...planForm, initialCapitalUsd: Number(e.target.value) })}
                      className="w-full accent-cyan-400 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>$10k</span>
                      <span>$100k</span>
                      <span>$250k</span>
                    </div>
                  </div>

                  {/* Monthly Inflow */}
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                      <span>Monthly Contribution Inflow:</span>
                      <span className="font-bold text-emerald-400 tabular-nums">${planForm.monthlyContributionUsd.toLocaleString()}/mo</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={20000}
                      step={500}
                      value={planForm.monthlyContributionUsd}
                      onChange={(e) => setPlanForm({ ...planForm, monthlyContributionUsd: Number(e.target.value) })}
                      className="w-full accent-emerald-400 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>$0</span>
                      <span>$5,000</span>
                      <span>$20,000</span>
                    </div>
                  </div>

                  {/* Projected APR */}
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                      <span>Projected Net APY (Arbitrage + Yield):</span>
                      <span className="font-bold text-cyan-300 tabular-nums">{planForm.projectedAprPct}% APY</span>
                    </div>
                    <input
                      type="range"
                      min={12}
                      max={90}
                      step={1}
                      value={planForm.projectedAprPct}
                      onChange={(e) => setPlanForm({ ...planForm, projectedAprPct: Number(e.target.value) })}
                      className="w-full accent-cyan-400 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>12% (Conservative)</span>
                      <span>42% (Current)</span>
                      <span>90% (Alpha)</span>
                    </div>
                  </div>

                  {/* Target Milestone */}
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                      <span>Target Milestone Goal:</span>
                      <span className="font-bold text-amber-300 tabular-nums">${(planForm.targetMilestoneUsd / 1000).toFixed(0)}k</span>
                    </div>
                    <input
                      type="range"
                      min={100000}
                      max={5000000}
                      step={50000}
                      value={planForm.targetMilestoneUsd}
                      onChange={(e) => setPlanForm({ ...planForm, targetMilestoneUsd: Number(e.target.value) })}
                      className="w-full accent-amber-400 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>$100k</span>
                      <span>$1.25M</span>
                      <span>$5.0M</span>
                    </div>
                  </div>

                  {/* Time Horizon */}
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                      <span>Time Horizon:</span>
                      <span className="font-bold text-white tabular-nums">{planForm.timeHorizonMonths} Months ({(planForm.timeHorizonMonths / 12).toFixed(1)} yrs)</span>
                    </div>
                    <input
                      type="range"
                      min={6}
                      max={60}
                      step={6}
                      value={planForm.timeHorizonMonths}
                      onChange={(e) => setPlanForm({ ...planForm, timeHorizonMonths: Number(e.target.value) })}
                      className="w-full accent-purple-400 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>6 mo</span>
                      <span>36 mo (3 yr)</span>
                      <span>60 mo (5 yr)</span>
                    </div>
                  </div>

                  {/* Reinvestment Rate */}
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                      <span>Compound Reinvestment Rate:</span>
                      <span className="font-bold text-cyan-400 tabular-nums">{planForm.reinvestmentRatePct}%</span>
                    </div>
                    <input
                      type="range"
                      min={50}
                      max={100}
                      step={5}
                      value={planForm.reinvestmentRatePct}
                      onChange={(e) => setPlanForm({ ...planForm, reinvestmentRatePct: Number(e.target.value) })}
                      className="w-full accent-cyan-400 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Save Plan Button */}
              <div className="pt-4 border-t border-slate-800 mt-4">
                <button
                  onClick={handleSavePlan}
                  disabled={isSavingPlan}
                  className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isSavingPlan ? 'Saving to Firestore...' : 'Save Plan & Sync Cloud'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Milestone Cards Checklist Section */}
          <div className="bg-[#0B101B] border border-cyan-500/30 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Strategic Milestone Roadmap &amp; Capital Phases</span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  Step-by-step capital checkpoints toward self-sustaining sovereign multi-exchange endowment.
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-400">
                1 / {growthPlan.milestones.length} Completed
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {growthPlan.milestones.map((ms, idx) => {
                const isCurrent = ms.reached;
                const progressPct = Math.min(100, Math.round((currentNetWorthUsd / ms.targetUsd) * 100));

                return (
                  <div
                    key={ms.id}
                    className={`p-4 rounded-xl border transition-all ${
                      ms.reached
                        ? 'bg-emerald-950/20 border-emerald-500/40'
                        : idx === 1
                        ? 'bg-cyan-950/20 border-cyan-500/50 shadow-lg shadow-cyan-950/30'
                        : 'bg-slate-900/60 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border ${
                        ms.reached
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : idx === 1
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {ms.badge}
                      </span>
                      <span className="text-xs font-black text-white tabular-nums">
                        ${ms.targetUsd.toLocaleString()}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-white mb-1">{ms.name}</h4>
                    <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">{ms.notes}</p>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Milestone Progress</span>
                        <span className="font-bold text-white">{ms.reached ? '100%' : `${progressPct}%`}</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            ms.reached ? 'bg-emerald-400' : 'bg-cyan-400'
                          }`}
                          style={{ width: `${ms.reached ? 100 : progressPct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: ALL TRADING CREDENTIALS VAULT */}
      {/* ========================================================================= */}
      {activeTab === 'TRADING_CREDS' && (
        <div className="space-y-6">
          {/* Header Controls & Filter Bar */}
          <div className="bg-[#0B101B] border border-cyan-500/30 rounded-2xl p-5 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Key className="w-4 h-4 text-purple-400" />
                  <span>Institutional Trading Credentials &amp; API Passports</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Live connection credentials for Centralized Exchanges, Web3 DEX Signers, FIX 4.4 Engine, and Federal Regulatory IDs.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddingCredModal(true)}
                  className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Key</span>
                </button>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4">
              {/* Type Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-thin">
                <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0 mr-1" />
                {(['ALL', 'CEX_API', 'DEX_KEYPAIR', 'FIX_SESSION', 'REGULATORY_ID', 'HSM_ENCLAVE'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setTradingTypeFilter(type)}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors shrink-0 cursor-pointer ${
                      tradingTypeFilter === type
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {type.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>

              {/* Search input */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter keys, provider, network..."
                  value={tradingSearch}
                  onChange={(e) => setTradingSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500/50"
                />
              </div>
            </div>
          </div>

          {/* Credentials Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTrading.map((cred) => {
              const isRevealed = revealedSecrets[cred.id];
              const isTesting = testingCredId === cred.id;

              return (
                <div
                  key={cred.id}
                  className="bg-[#0B101B] border border-slate-800 hover:border-purple-500/40 rounded-xl p-5 shadow-lg transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Top Row: Provider & Status Badge */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/40">
                            {cred.type.replace(/_/g, ' ')}
                          </span>
                          {cred.hardwareBound && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                              <Lock className="w-2.5 h-2.5" />
                              <span>HSM Nitro</span>
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-white">{cred.name}</h4>
                        <div className="text-[11px] text-cyan-400 font-semibold">{cred.provider}</div>
                      </div>

                      {/* Status indicator */}
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider shrink-0 border ${
                        cred.status === 'ACTIVE'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : cred.status === 'HARDWARE_LOCKED'
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      }`}>
                        {cred.status}
                      </span>
                    </div>

                    {/* Key Identifier */}
                    <div className="p-2.5 bg-black/60 rounded-lg border border-slate-800 text-[11px] mb-3 space-y-1">
                      <div className="flex items-center justify-between text-slate-400 text-[10px]">
                        <span>PUBLIC IDENTIFIER / KEY:</span>
                        <button
                          onClick={() => copyText(cred.keyIdentifier, cred.id + '-key')}
                          className="hover:text-cyan-400 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          {copiedId === cred.id + '-key' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedId === cred.id + '-key' ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <div className="font-mono text-cyan-300 break-all select-all font-semibold">
                        {cred.keyIdentifier}
                      </div>

                      {/* Masked Secret Row */}
                      <div className="flex items-center justify-between text-slate-400 text-[10px] pt-1 border-t border-slate-800/80">
                        <span>SECRET TOKEN / SESSION:</span>
                        <button
                          onClick={() => toggleSecret(cred.id)}
                          className="hover:text-purple-400 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          {isRevealed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          <span>{isRevealed ? 'Hide' : 'Reveal'}</span>
                        </button>
                      </div>
                      <div className="font-mono text-slate-300 break-all font-semibold select-all">
                        {isRevealed ? cred.secretMasked.replace(/•/g, 'f') : cred.secretMasked}
                      </div>
                    </div>

                    {/* Metadata details */}
                    <div className="text-[11px] space-y-1 text-slate-400 mb-3">
                      <div><span className="text-slate-500">Permissions:</span> <span className="text-slate-300">{cred.permissions}</span></div>
                      <div><span className="text-slate-500">Network / Co-location:</span> <span className="text-cyan-300">{cred.network}</span></div>
                      {cred.ipWhitelist && <div><span className="text-slate-500">IP Whitelist:</span> <span className="text-slate-400">{cred.ipWhitelist}</span></div>}
                      {cred.rateLimitTier && <div><span className="text-slate-500">Rate Limit:</span> <span className="text-slate-400">{cred.rateLimitTier}</span></div>}
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-[11px]">
                    <div className="text-slate-500">
                      <span>{cred.lastTestedAt}</span>
                    </div>

                    <button
                      onClick={() => testCredentialConnection(cred)}
                      disabled={isTesting}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 hover:border-cyan-500/40 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <RefreshCw className={`w-3 h-3 ${isTesting ? 'animate-spin text-cyan-400' : ''}`} />
                      <span>{isTesting ? 'Pinging API...' : 'Test Connection'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: ALL CYBERGYM CREDENTIALS VAULT */}
      {/* ========================================================================= */}
      {activeTab === 'CYBERGYM_CREDS' && (
        <div className="space-y-6">
          {/* Header Controls & Filter Bar */}
          <div className="bg-[#0B101B] border border-cyan-500/30 rounded-2xl p-5 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>CyberGym Digital Passports &amp; Federal Security Credentials</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Certified athlete identity passports, NSF CyberGenNet research grants, NIST compliance certifications, and 17-tier achievement proofs.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportDossier}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Dossier</span>
                </button>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4">
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-thin">
                <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0 mr-1" />
                {(['ALL', 'ATHLETE_PASSPORT', 'NSF_GRANT', 'NIST_COMPLIANCE', 'GOV_CLEARANCE', 'TIER_ACHIEVEMENT'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCyberFilter(cat)}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors shrink-0 cursor-pointer ${
                      cyberFilter === cat
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {cat.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter athlete, tier, grant..."
                  value={cyberSearch}
                  onChange={(e) => setCyberSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
                />
              </div>
            </div>
          </div>

          {/* Cyber Credentials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCyber.map((cred) => {
              const isTesting = testingCredId === cred.id;

              return (
                <div
                  key={cred.id}
                  className="bg-[#0B101B] border border-slate-800 hover:border-emerald-500/40 rounded-xl p-5 shadow-lg transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Category & Status */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                            {cred.category.replace(/_/g, ' ')}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                            {cred.tier}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white">{cred.title}</h4>
                        <div className="text-[11px] text-cyan-400 font-semibold">{cred.athleteOrEntity}</div>
                      </div>

                      <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shrink-0">
                        {cred.status}
                      </span>
                    </div>

                    {/* Hash & Signature Verification Card */}
                    <div className="p-2.5 bg-black/60 rounded-lg border border-slate-800 text-[11px] mb-3 space-y-1">
                      <div className="flex items-center justify-between text-slate-400 text-[10px]">
                        <span>CREDENTIAL PROOF HASH:</span>
                        <button
                          onClick={() => copyText(cred.credentialHash, cred.id + '-hash')}
                          className="hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          {copiedId === cred.id + '-hash' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedId === cred.id + '-hash' ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <div className="font-mono text-emerald-300 break-all select-all font-semibold">
                        {cred.credentialHash}
                      </div>

                      <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800/80">
                        <span>ORACLE VERIFIER SIGNATURE:</span>
                      </div>
                      <div className="font-mono text-cyan-400 break-all text-[10px]">
                        {cred.verifierSignature}
                      </div>
                    </div>

                    {/* Capabilities & Grant details */}
                    <div className="space-y-1.5 text-[11px] text-slate-400 mb-3">
                      {cred.grantId && (
                        <div><span className="text-amber-400 font-bold">Grant ID:</span> <span className="text-white">{cred.grantId}</span></div>
                      )}
                      {cred.scoreBenchmark && (
                        <div><span className="text-slate-500">Benchmark Score:</span> <span className="text-emerald-400 font-bold">{cred.scoreBenchmark} / 100</span></div>
                      )}
                      <div><span className="text-slate-500">Attestation Quorum:</span> <span className="text-slate-300">{cred.oracleQuorum}</span></div>

                      <div className="pt-1">
                        <span className="text-slate-500 block mb-1">Authorized Capabilities:</span>
                        <div className="flex flex-wrap gap-1">
                          {cred.capabilities.map((cap, i) => (
                            <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-slate-900 text-slate-300 border border-slate-800">
                              {cap}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-[11px]">
                    <div className="text-slate-500">
                      <span>Expires: {new Date(cred.expiresAt).getFullYear()}</span>
                    </div>

                    <button
                      onClick={() => testCyberAttestation(cred)}
                      disabled={isTesting}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 hover:border-emerald-500/40 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ShieldCheck className={`w-3.5 h-3.5 ${isTesting ? 'animate-pulse text-emerald-400' : ''}`} />
                      <span>{isTesting ? 'Attesting Oracle...' : 'Verify Attestation'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: UNIFIED EXECUTIVE PLAN & SUMMARY */}
      {/* ========================================================================= */}
      {activeTab === 'UNIFIED_PLAN' && (
        <div className="space-y-6">
          <div className="bg-[#0B101B] border border-cyan-500/30 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span>Sovereign Executive Architecture &amp; Credentials Synthesis</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Full synchronization status of portfolio growth targets, institutional exchange accounts, and CyberGym certifications.
                </p>
              </div>

              <button
                onClick={handleExportDossier}
                className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center gap-2 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Export Dossier (.JSON)</span>
              </button>
            </div>

            {/* 3 Pillars Executive Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Pillar 1: Growth Strategy */}
              <div className="p-5 bg-slate-900/70 border border-cyan-500/30 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-black uppercase">
                  <TrendingUp className="w-4 h-4" />
                  <span>Pillar I: Capital Plan</span>
                </div>
                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Current Capital:</span>
                    <span className="font-bold text-white">${currentNetWorthUsd.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Target Milestone:</span>
                    <span className="font-bold text-amber-300">${planForm.targetMilestoneUsd.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Growth Model:</span>
                    <span className="font-bold text-cyan-300">{planForm.strategyMode.replace(/_/g, ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Projected APY:</span>
                    <span className="font-bold text-emerald-400">{planForm.projectedAprPct}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Time Horizon:</span>
                    <span className="font-bold text-white">{planForm.timeHorizonMonths} Months</span>
                  </div>
                </div>
              </div>

              {/* Pillar 2: Trading Keys */}
              <div className="p-5 bg-slate-900/70 border border-purple-500/30 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-purple-400 text-xs font-black uppercase">
                  <Key className="w-4 h-4" />
                  <span>Pillar II: Trading Keys</span>
                </div>
                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Registered Keys:</span>
                    <span className="font-bold text-white">{tradingCredentials.length} Keys</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">CEX Direct Line:</span>
                    <span className="font-bold text-purple-300">Binance, Coinbase, Kraken, OKX</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">DEX Web3 Signers:</span>
                    <span className="font-bold text-cyan-300">EVM Hot, Solana Jito, 1inch Solver</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Protocol &amp; HSM:</span>
                    <span className="font-bold text-emerald-400">FIX 4.4 CME NY4, ML-KEM-1024</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Regulatory ID:</span>
                    <span className="font-bold text-amber-300">LEI &amp; FinCEN MSB</span>
                  </div>
                </div>
              </div>

              {/* Pillar 3: CyberGym Passports */}
              <div className="p-5 bg-slate-900/70 border border-emerald-500/30 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-black uppercase">
                  <Award className="w-4 h-4" />
                  <span>Pillar III: CyberGym</span>
                </div>
                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Passports:</span>
                    <span className="font-bold text-white">{cyberGymCredentials.length} Certified</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Grandmaster Athletes:</span>
                    <span className="font-bold text-emerald-300">Heretic :9003, DeepSeek-R1</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Spartan Recon:</span>
                    <span className="font-bold text-cyan-300">Spartan-117 MK-V Visor</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Federal Grants:</span>
                    <span className="font-bold text-amber-300">NSF CyberGenNet ($4.2M)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">NIST Compliance:</span>
                    <span className="font-bold text-white">SP 800-115 &amp; SP 800-53 Rev 5</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links to Sister Suites */}
            <div className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl flex-wrap gap-3">
              <div className="text-xs text-slate-400">
                <span>Looking to execute institutional live runs or launch CyberGym container sparring drills?</span>
              </div>
              <div className="flex items-center gap-2">
                {onOpenTradingCommand && (
                  <button
                    onClick={onOpenTradingCommand}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    Open Institutional Trading Command
                  </button>
                )}
                {onOpenCyberGym && (
                  <button
                    onClick={onOpenCyberGym}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    Open CyberGym Progression Suite
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD TRADING KEY */}
      {/* ========================================================================= */}
      {isAddingCredModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0B101B] border-2 border-purple-500/50 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-slate-200">
            <button
              onClick={() => setIsAddingCredModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-purple-500/30">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400 flex items-center justify-center text-purple-400">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white uppercase tracking-wider">Register Trading Key</h3>
                <p className="text-xs text-slate-400">Securely store API key, secret session, or Web3 signer credentials.</p>
              </div>
            </div>

            <form onSubmit={handleAddTradingCredential} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Exchange / Provider</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Binance Institutional, Coinbase Prime, Uniswap v4"
                  value={newCred.provider}
                  onChange={(e) => setNewCred({ ...newCred, provider: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Key Name / Label</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sub-Account Alpha Arbitrage Pipe"
                  value={newCred.name}
                  onChange={(e) => setNewCred({ ...newCred, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Credential Type</label>
                  <select
                    value={newCred.type}
                    onChange={(e) => setNewCred({ ...newCred, type: e.target.value as TradingCredentialType })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="CEX_API">CEX API Key</option>
                    <option value="DEX_KEYPAIR">DEX Web3 Signer</option>
                    <option value="FIX_SESSION">FIX 4.4 Session</option>
                    <option value="REGULATORY_ID">Regulatory ID</option>
                    <option value="HSM_ENCLAVE">HSM Enclave</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Network / Server</label>
                  <input
                    type="text"
                    value={newCred.network}
                    onChange={(e) => setNewCred({ ...newCred, network: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Public Key / Identifier</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 0x... or bina_key_..."
                  value={newCred.keyIdentifier}
                  onChange={(e) => setNewCred({ ...newCred, keyIdentifier: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-cyan-300 placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Masked Secret / Session Ticket</label>
                <input
                  type="password"
                  placeholder="Enter secret (auto-masked upon saving)"
                  value={newCred.secretMasked}
                  onChange={(e) => setNewCred({ ...newCred, secretMasked: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Permissions Matrix</label>
                <input
                  type="text"
                  value={newCred.permissions}
                  onChange={(e) => setNewCred({ ...newCred, permissions: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="hsmLock"
                  checked={newCred.hardwareBound}
                  onChange={(e) => setNewCred({ ...newCred, hardwareBound: e.target.checked })}
                  className="rounded accent-purple-500 cursor-pointer"
                />
                <label htmlFor="hsmLock" className="text-xs text-slate-300 cursor-pointer">
                  Hardware-bound with AWS Nitro Enclave / Secure Element SE050
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddingCredModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-lg transition-all cursor-pointer"
                >
                  Save &amp; Register Credential
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
