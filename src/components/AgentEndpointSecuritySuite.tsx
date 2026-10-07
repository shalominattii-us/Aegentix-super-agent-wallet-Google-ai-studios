import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Unlock, 
  Radio, 
  AlertTriangle, 
  Terminal, 
  CheckCircle2, 
  Cpu, 
  RefreshCw, 
  Key, 
  Sliders,
  Zap,
  Activity,
  Layers,
  Sparkles,
  TrendingDown,
  AlertOctagon,
  RotateCw,
  Eye
} from 'lucide-react';

export interface AgentEndpoint {
  id: string;
  name: string;
  role: string;
  serviceTier: 'ENCLAVE_FIRST_CLASS' | 'EXECUTION_GATEWAY' | 'ORCHESTRATOR' | 'QUANT_MESH';
  ipAddress: string;
  port: number;
  protocol: 'mTLS' | 'HMAC_SHA256' | 'REST_RESTRICTED' | 'WEBSOCKET_SECURE';
  securityPosture: 'HARDENED' | 'MONITORED' | 'ISOLATED' | 'COMPROMISED';
  decisionRatePerSec: number;
  rateLimitPerSec: number;
  tamperProofTapeStatus: 'VERIFIED' | 'TAMPER_DETECTED' | 'DESYNC';
  zeroTrustSignatureHash: string;
  quarantineActive: boolean;
  lastHeartbeatMsAgo: number;
  blockedViolationsCount: number;
}

export interface TelemetrySnapshot {
  timestamp: string;
  agentId: string;
  agentName: string;
  cpuPct: number;
  memoryMb: number;
  consensusVote: string;
  consensusConfidence: number;
  driftDeltaPct: number;
  anomalyScore?: number;
  executionPattern: 'NOMINAL' | 'BURST_ACCELERATION' | 'UNAUTHORIZED_TRIGGER_RISK' | 'OUT_OF_SEQUENCE';
  threatStatus: 'SAFE' | 'ELEVATED' | 'CRITICAL_ALERT';
}

export interface EndpointSecurityTelemetry {
  globalSecurityScore: number;
  totalWorkforceAgents: number;
  hardenedEndpointsCount: number;
  quarantinedEndpointsCount: number;
  blockedExploitAttempts: number;
  lastAttestationTimestamp: string;
  endpoints: AgentEndpoint[];
}

interface AgentEndpointSecuritySuiteProps {
  onNotify?: (message: string, type: 'ALERT' | 'SUCCESS' | 'INFO') => void;
}

export const AgentEndpointSecuritySuite: React.FC<AgentEndpointSecuritySuiteProps> = ({ onNotify }) => {
  const [telemetry, setTelemetry] = useState<EndpointSecurityTelemetry | null>(null);
  const [liveSnapshots, setLiveSnapshots] = useState<TelemetrySnapshot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterTier, setFilterTier] = useState<string>('ALL');
  const [isAuditing, setIsAuditing] = useState(false);
  const [driftThreshold, setDriftThreshold] = useState<number>(15.0);
  const [isInjectingThreat, setIsInjectingThreat] = useState(false);

  // Threat Evasion State
  const [threatEvasionActive, setThreatEvasionActive] = useState<boolean>(true);
  const [threatEvasionThreshold, setThreatEvasionThreshold] = useState<number>(7.0);
  const [exchangeApiKeys, setExchangeApiKeys] = useState<Record<string, { keyId: string; lastRotated: string; status: string }>>({});
  const [maxAnomalyScore, setMaxAnomalyScore] = useState<number>(4.8);
  const [isRotatingManually, setIsRotatingManually] = useState<boolean>(false);

  // Fetch Endpoint Inventory
  const fetchEndpointSecurity = async () => {
    try {
      const res = await fetch('/api/security/endpoints');
      if (res.ok) {
        const data = await res.json();
        setTelemetry(data);
      }
    } catch {}
  };

  // Fetch Real-Time Process Telemetry & Consensus Drift
  const fetchLiveProcessTelemetry = async () => {
    try {
      const res = await fetch('/api/security/telemetry/live');
      if (res.ok) {
        const data = await res.json();
        if (data.telemetrySnapshots) {
          setLiveSnapshots(data.telemetrySnapshots);
        }
        if (data.sensitivityConfig?.driftThresholdPct) {
          setDriftThreshold(data.sensitivityConfig.driftThresholdPct);
        }
        if (data.sensitivityConfig?.threatEvasionActive !== undefined) {
          setThreatEvasionActive(data.sensitivityConfig.threatEvasionActive);
        }
        if (data.sensitivityConfig?.threatEvasionAnomalyThreshold) {
          setThreatEvasionThreshold(data.sensitivityConfig.threatEvasionAnomalyThreshold);
        }
        if (data.exchangeApiKeys) {
          setExchangeApiKeys(data.exchangeApiKeys);
        }
        if (data.maxAnomalyScore !== undefined) {
          setMaxAnomalyScore(data.maxAnomalyScore);
        }
      }
    } catch {}
  };

  useEffect(() => {
    fetchEndpointSecurity();
    fetchLiveProcessTelemetry();
    const interval = setInterval(() => {
      fetchEndpointSecurity();
      fetchLiveProcessTelemetry();
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const handleToggleQuarantine = async (agentId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/security/endpoints/${agentId}/quarantine`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quarantine: !currentStatus }),
      });
      if (res.ok) {
        const data = await res.json();
        if (onNotify) {
          onNotify(
            `${data.agentName} ${!currentStatus ? 'QUARANTINED from execution mesh' : 'RESTORED to active cluster'}`,
            !currentStatus ? 'ALERT' : 'SUCCESS'
          );
        }
        fetchEndpointSecurity();
      }
    } catch (e: any) {
      if (onNotify) onNotify(`Quarantine action failed: ${e.message}`, 'ALERT');
    }
  };

  const handleAuditAllEndpoints = async () => {
    setIsAuditing(true);
    try {
      const res = await fetch('/api/security/endpoints/audit-all', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (onNotify) {
          onNotify(
            `Endpoint Zero-Trust Audit Complete: ${data.totalAudited} agent nodes verified. Posture Score: ${data.globalSecurityScore}/100.`,
            'SUCCESS'
          );
        }
        fetchEndpointSecurity();
      }
    } catch (e: any) {
      if (onNotify) onNotify(`Audit failed: ${e.message}`, 'ALERT');
    } finally {
      setIsAuditing(false);
    }
  };

  const handleUpdateDriftThreshold = async (newVal: number) => {
    setDriftThreshold(newVal);
    try {
      await fetch('/api/security/telemetry/sensitivity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ driftThresholdPct: newVal }),
      });
      if (onNotify) {
        onNotify(`Consensus Drift Sensitivity updated to ${newVal}% threshold. Alerting synchronized to Heretic Console.`, 'INFO');
      }
    } catch {}
  };

  const handleToggleThreatEvasion = async () => {
    const nextState = !threatEvasionActive;
    setThreatEvasionActive(nextState);
    try {
      const res = await fetch('/api/security/telemetry/threat-evasion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: nextState, anomalyThreshold: threatEvasionThreshold }),
      });
      if (res.ok) {
        const data = await res.json();
        if (onNotify) {
          onNotify(
            `Threat Evasion Protocol ${nextState ? 'ACTIVATED (Auto-rotates exchange API keys when anomaly > 7.0)' : 'DEACTIVATED'}`,
            nextState ? 'SUCCESS' : 'INFO'
          );
        }
      }
    } catch (err: any) {
      if (onNotify) onNotify(`Failed to update Threat Evasion: ${err.message}`, 'ALERT');
    }
  };

  const handleSimulateThreat = async () => {
    setIsInjectingThreat(true);
    try {
      const res = await fetch('/api/security/telemetry/simulate-anomaly', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: 'ep-exec-solana',
          anomalyType: 'UNAUTHORIZED_TRIGGER_RISK',
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (onNotify) {
          const evasionMsg = data.threatEvasionEngaged 
            ? ' Threat Evasion engaged: Exchange API keys rotated automatically!' 
            : '';
          onNotify(
            `ALERT: High Anomaly Score (${data.simulatedThreat.anomalyScore || 8.6}) on ${data.simulatedThreat.agentName}!${evasionMsg}`,
            'ALERT'
          );
        }
        fetchLiveProcessTelemetry();
        fetchEndpointSecurity();
      }
    } catch (e: any) {
      if (onNotify) onNotify(`Simulation failed: ${e.message}`, 'ALERT');
    } finally {
      setIsInjectingThreat(false);
    }
  };

  const filteredEndpoints = telemetry?.endpoints.filter(e => {
    if (filterTier === 'ALL') return true;
    return e.serviceTier === filterTier;
  }) || [];

  return (
    <div className="bg-[#0B0F17] border border-slate-800 rounded-xl overflow-hidden shadow-2xl space-y-4 font-mono text-xs">
      {/* Header Banner */}
      <div className="p-4 sm:p-5 border-b border-slate-800 bg-gradient-to-r from-rose-950/40 via-[#0B0F17] to-cyan-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-rose-600 via-amber-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-rose-500/20 shrink-0">
            <ShieldAlert className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-white tracking-wide uppercase">
                AGENT WORKFORCE ENDPOINT SECURITY SUITE
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-black border flex items-center gap-1 bg-cyan-500/20 text-cyan-300 border-cyan-500/40">
                <ShieldCheck className="w-3 h-3 text-cyan-400" />
                GEMINI CYBER VERSION: FAIRWIND SENTINEL
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold border flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border-emerald-500/40">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                REAL-TIME TELEMETRY &middot; HERETIC CONSOLE INTERLOCKED
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Gemini 4 Argon Cyber Defense &middot; Continuous Process Telemetry &middot; Consensus Drift Auditing &amp; Zero-Trust Evasion
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Threat Evasion Active Badge / Button */}
          <button
            onClick={handleToggleThreatEvasion}
            className={`px-3 py-1.5 rounded font-bold text-xs flex items-center gap-1.5 border transition-all cursor-pointer ${
              threatEvasionActive
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
            title="When active, if anomaly scores exceed 7.0, automatically rotate API keys for connected exchanges as a preventative measure against potential exfiltration."
          >
            <Key className={`w-3.5 h-3.5 ${threatEvasionActive ? 'text-amber-400 animate-pulse' : 'text-slate-500'}`} />
            <span>Threat Evasion: {threatEvasionActive ? 'ARMED (>7.0)' : 'OFF'}</span>
          </button>

          <button
            onClick={handleSimulateThreat}
            disabled={isInjectingThreat}
            className="px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-500/50 rounded font-bold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Simulate high anomaly score (8.6 > 7.0) to trigger automatic API key rotation"
          >
            <AlertOctagon className={`w-3.5 h-3.5 text-rose-400 ${isInjectingThreat ? 'animate-spin' : ''}`} />
            <span>{isInjectingThreat ? 'Testing...' : 'Test Anomaly Trigger'}</span>
          </button>

          <button
            onClick={handleAuditAllEndpoints}
            disabled={isAuditing}
            className="px-3 py-1.5 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white rounded font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-rose-600/30 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
            <span>{isAuditing ? 'Auditing Mesh...' : 'Audit All Endpoints'}</span>
          </button>
        </div>
      </div>

      {/* Aggregate Telemetry Metric Cards */}
      {telemetry && (
        <div className="px-4 grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg">
            <span className="text-[10px] text-slate-500 block">GLOBAL POSTURE SCORE</span>
            <span className={`text-base font-bold block mt-0.5 ${
              telemetry.globalSecurityScore >= 90 ? 'text-emerald-400' : telemetry.globalSecurityScore >= 75 ? 'text-amber-400' : 'text-rose-400'
            }`}>
              {telemetry.globalSecurityScore} / 100
            </span>
            <span className="text-[9px] text-slate-400 block mt-0.5">Zero-Trust Metric</span>
          </div>

          <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg">
            <span className="text-[10px] text-slate-500 block">PEAK ANOMALY SCORE</span>
            <span className={`text-base font-bold block mt-0.5 ${
              maxAnomalyScore >= 7.0 ? 'text-rose-400 animate-pulse' : maxAnomalyScore >= 5.0 ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {maxAnomalyScore.toFixed(1)} / 10.0
            </span>
            <span className="text-[9px] text-slate-400 block mt-0.5">Threshold: {threatEvasionThreshold}.0</span>
          </div>

          <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg">
            <span className="text-[10px] text-slate-500 block">HARDENED ENCLAVES</span>
            <span className="text-base font-bold text-emerald-400 block mt-0.5">
              {telemetry.hardenedEndpointsCount} Verified
            </span>
            <span className="text-[9px] text-slate-400 block mt-0.5">Hardware HMAC tape</span>
          </div>

          <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg">
            <span className="text-[10px] text-slate-500 block">THREAT EVASION</span>
            <span className={`text-base font-bold block mt-0.5 ${
              threatEvasionActive ? 'text-amber-400' : 'text-slate-500'
            }`}>
              {threatEvasionActive ? 'ARMED' : 'DISABLED'}
            </span>
            <span className="text-[9px] text-slate-400 block mt-0.5">Auto-rotate key mesh</span>
          </div>

          <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg">
            <span className="text-[10px] text-slate-500 block">BLOCKED BREACHES</span>
            <span className="text-base font-bold text-amber-400 block mt-0.5">
              {telemetry.blockedExploitAttempts} Blocked
            </span>
            <span className="text-[9px] text-slate-400 block mt-0.5">Unauthorized triggers</span>
          </div>
        </div>
      )}

      {/* THREAT EVASION & CONNECTED EXCHANGES KEY STATUS BAR */}
      <div className="px-4">
        <div className="p-3 bg-gradient-to-r from-amber-950/20 via-slate-900/80 to-purple-950/20 border border-amber-500/30 rounded-lg space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-400" />
              <div>
                <span className="text-xs font-bold text-amber-300 uppercase">
                  THREAT EVASION: AUTOMATIC API KEY ROTATION SHIELD
                </span>
                <span className="text-[10px] text-slate-400 block">
                  Prevents potential credential exfiltration: if anomaly scores exceed 7.0, all exchange API keys rotate automatically.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={threatEvasionActive}
                  onChange={handleToggleThreatEvasion}
                  className="rounded bg-slate-800 border-slate-700 text-amber-500 focus:ring-amber-500 cursor-pointer"
                />
                <span className="text-xs font-bold text-slate-200">
                  {threatEvasionActive ? 'Auto-Rotation Armed' : 'Auto-Rotation Disarmed'}
                </span>
              </label>
            </div>
          </div>

          {/* Connected Exchange Keys Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-slate-800/80 text-[10px]">
            {Object.entries(exchangeApiKeys).map(([exch, info]) => (
              <div key={exch} className="p-2 bg-slate-950/60 rounded border border-slate-800 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-300 uppercase">{exch.replace(/-/g, ' ')}</span>
                  <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                    info.status === 'ROTATED' 
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}>
                    {info.status}
                  </span>
                </div>
                <div className="mt-1 text-slate-400 truncate font-mono">
                  Key: <code className="text-cyan-300">{info.keyId}</code>
                </div>
                <div className="text-[9px] text-slate-500 mt-0.5 truncate">
                  Rotated: {new Date(info.lastRotated).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Real-time Consensus Drift & Abnormal Execution Telemetry Feed */}
      <div className="px-4 space-y-2">
        <div className="p-3 bg-slate-900/50 border border-slate-800 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
            <div>
              <span className="text-xs font-bold text-white uppercase block">
                REAL-TIME PROCESS TELEMETRY &amp; ANOMALY SCORE GAUGE
              </span>
              <span className="text-[10px] text-slate-400">
                Continuous telemetry, anomaly score evaluation (&gt;7.0 triggers Threat Evasion), and drift limits.
              </span>
            </div>
          </div>

          {/* Drift Sensitivity Slider */}
          <div className="flex items-center gap-3 bg-slate-950 px-3 py-1.5 rounded border border-slate-800">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[10px] text-slate-400 font-bold">DRIFT SENSITIVITY:</span>
            <input
              type="range"
              min="5"
              max="35"
              step="1"
              value={driftThreshold}
              onChange={(e) => handleUpdateDriftThreshold(parseFloat(e.target.value))}
              className="w-24 accent-rose-500 cursor-pointer"
            />
            <span className="text-[11px] font-bold text-rose-400 w-10 text-right">{driftThreshold}%</span>
          </div>
        </div>

        {/* Live Snapshots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {liveSnapshots.map((snap) => {
            const isCritical = snap.threatStatus === 'CRITICAL_ALERT';
            const isElevated = snap.threatStatus === 'ELEVATED';
            const anomalyScoreVal = snap.anomalyScore || (isCritical ? 8.6 : isElevated ? 6.8 : 3.8);

            return (
              <div 
                key={snap.agentId} 
                className={`p-3 rounded-lg border transition-all ${
                  isCritical
                    ? 'bg-rose-950/20 border-rose-500/50 text-rose-200 shadow-sm shadow-rose-950/40'
                    : isElevated
                    ? 'bg-amber-950/20 border-amber-500/40 text-amber-200'
                    : 'bg-[#070A0F] border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-white truncate max-w-[180px]">{snap.agentName}</span>
                  <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                    isCritical
                      ? 'bg-rose-600 text-white'
                      : isElevated
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}>
                    {snap.executionPattern}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 mb-2">
                  <div>
                    <span className="text-slate-500 block text-[9px]">ANOMALY SCORE</span>
                    <span className={`font-bold ${anomalyScoreVal > threatEvasionThreshold ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`}>
                      {anomalyScoreVal.toFixed(1)} / 10.0 {anomalyScoreVal > threatEvasionThreshold ? '(>7.0 BREACH)' : '(NOMINAL)'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px]">CONSENSUS DRIFT</span>
                    <span className={snap.driftDeltaPct > driftThreshold ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                      {snap.driftDeltaPct}% {snap.driftDeltaPct > driftThreshold ? '(BREACH)' : '(SAFE)'}
                    </span>
                  </div>
                </div>

                <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[9px] text-slate-400">
                  <span>CPU: <b className="text-white">{snap.cpuPct}%</b> &middot; {snap.memoryMb}MB</span>
                  <span className={isCritical ? 'text-rose-400 font-bold' : 'text-slate-500'}>
                    {anomalyScoreVal > threatEvasionThreshold && threatEvasionActive ? 'THREAT EVASION ENGAGED' : (isCritical ? 'HERETIC ALERT STREAMED' : 'MONITORED')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-4 flex items-center gap-2 text-[10px] pt-1">
        <span className="text-slate-500">FILTER TIER:</span>
        {['ALL', 'ENCLAVE_FIRST_CLASS', 'EXECUTION_GATEWAY', 'ORCHESTRATOR', 'QUANT_MESH'].map(t => (
          <button
            key={t}
            onClick={() => setFilterTier(t)}
            className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
              filterTier === t
                ? 'bg-rose-600 text-white font-bold shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {t.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* Endpoints Inventory Table */}
      <div className="px-4 space-y-3 pb-4">
        <div className="border border-slate-800 rounded-xl bg-[#070A0F] overflow-hidden">
          <div className="divide-y divide-slate-800/70">
            {filteredEndpoints.map((ep) => (
              <div 
                key={ep.id} 
                className={`p-3.5 transition-colors ${ep.quarantineActive ? 'bg-rose-950/20' : 'hover:bg-slate-900/40'}`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs">{ep.name}</span>
                      <span className="text-[10px] text-slate-400">({ep.role})</span>
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                        ep.securityPosture === 'HARDENED'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : ep.securityPosture === 'ISOLATED'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {ep.securityPosture}
                      </span>
                      {ep.quarantineActive && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-600 text-white flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5" />
                          QUARANTINED
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-400">
                      <span>Endpoint: <code className="text-cyan-300">{ep.ipAddress}:{ep.port}</code></span>
                      <span>Protocol: <code className="text-purple-300">{ep.protocol}</code></span>
                      <span>Tier: <span className="text-slate-300">{ep.serviceTier}</span></span>
                      <span>Tape: <span className={ep.tamperProofTapeStatus === 'VERIFIED' ? 'text-emerald-400' : 'text-rose-400'}>{ep.tamperProofTapeStatus}</span></span>
                    </div>

                    <div className="text-[9px] text-slate-500 font-mono flex items-center gap-2">
                      <span>SHA-256 Enclave Binding:</span>
                      <code className="text-purple-400">{ep.zeroTrustSignatureHash}</code>
                    </div>
                  </div>

                  {/* Velocity Gauge & Quarantine Action */}
                  <div className="flex items-center gap-4 self-end md:self-auto shrink-0">
                    <div className="text-right">
                      <span className="text-[9px] text-slate-500 block">DECISION VELOCITY</span>
                      <span className={`text-xs font-bold ${
                        ep.decisionRatePerSec > ep.rateLimitPerSec ? 'text-rose-400' : 'text-cyan-300'
                      }`}>
                        {ep.decisionRatePerSec} / {ep.rateLimitPerSec} ops/s
                      </span>
                      <span className="text-[9px] text-slate-500 block">
                        Heartbeat: {ep.lastHeartbeatMsAgo}ms ago
                      </span>
                    </div>

                    <button
                      onClick={() => handleToggleQuarantine(ep.id, ep.quarantineActive)}
                      className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        ep.quarantineActive
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                          : 'bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-500/40'
                      }`}
                    >
                      {ep.quarantineActive ? (
                        <>
                          <Unlock className="w-3 h-3" />
                          <span>Release Node</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3 h-3" />
                          <span>Quarantine</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
