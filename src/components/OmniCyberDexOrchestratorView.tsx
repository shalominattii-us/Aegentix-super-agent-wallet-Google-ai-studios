import React from 'react';
import { Zap, Cpu, RefreshCw, CheckCircle2, AlertTriangle, Activity } from 'lucide-react';
import { useOrchestratorStatus, useBackendHealth, deriveHud } from '../hooks/useLiveOrchestrator';

interface OmniCyberDexOrchestratorViewProps {
  onNotify?: (message: string, type: 'ALERT' | 'SUCCESS' | 'INFO') => void;
  apiBase?: string;
}

/**
 * OMNICYBERDEX — MASTER ORCHESTRATOR (LIVE-WIRED EDITION)
 *
 * Changes vs. the previous version:
 *  1. Every status figure comes from the real backend via polling
 *     (/api/orchestrator/status, /api/health). No hard-coded engines,
 *     volumes, PnL or latencies.
 *  2. Metrics the backend does not yet expose render as "NOT WIRED"
 *     rather than invented numbers.
 *  3. The fake arbitrage-fill button (setTimeout + Math.random profit)
 *     is removed. Real execution belongs behind a backend endpoint
 *     (e.g. POST /api/omnicyberdex/arbitrage/execute) once it exists.
 *  4. "SIMULATED" badge removed since nothing here is simulated anymore.
 */
export const OmniCyberDexOrchestratorView: React.FC<OmniCyberDexOrchestratorViewProps> = ({
  onNotify,
  apiBase = '',
}) => {
  const { status, error: statusError, lastUpdated } = useOrchestratorStatus(apiBase);
  const { health, error: healthError } = useBackendHealth(apiBase);
  const hud = deriveHud(status, health);

  const research = status?.mode === 'RESEARCH_SIMULATION' || hud.executionEnabled === false;
  const connected = hud.isLive && !statusError && !healthError;
  const badgeLabel = research
    ? 'RESEARCH / SIMULATION'
    : connected
      ? 'LIVE — BACKEND ATTACHED'
      : statusError
        ? 'BACKEND UNREACHABLE'
        : 'SYNCING…';

  return (
    <div className="bg-[#030508] border border-cyan-500/30 rounded-xl overflow-hidden shadow-2xl space-y-4 font-mono text-xs text-slate-200">
      {/* HEADER */}
      <div className="p-4 sm:p-5 border-b border-cyan-500/20 bg-gradient-to-r from-[#030508] via-[#0A1420] to-[#040C18] flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-slate-900 border border-cyan-500/40 flex items-center justify-center shadow-lg shadow-cyan-500/20 shrink-0">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-cyan-300 tracking-wider uppercase font-sans">
                OMNICYBERDEX &middot; MASTER ORCHESTRATOR
              </h2>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-black border flex items-center gap-1 ${
                  connected
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                }`}
              >
                {connected ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                {badgeLabel}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-black border flex items-center gap-1 bg-cyan-500/20 text-cyan-300 border-cyan-500/40">
                <Cpu className="w-3 h-3 text-cyan-400" />
                {hud.pipelinesOnline}/{hud.pipelineCount} PIPELINES ONLINE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {research
                ? 'Research status. XAMAN_API_KEY belongs in the repository-root .env. Presence is a boolean from GET /api/xaman/readiness.'
                : 'Backend status. Unwired metrics stay unknown.'}
            </p>
          </div>
        </div>
      </div>

      {/* HUD STRIP — real values only */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 px-4 py-2 bg-[#060C14] border-y border-cyan-500/10 text-center">
        <HudCell
          label="Backend"
          value={hud.backendStatus ?? 'NOT WIRED'}
          tone={hud.backendStatus === 'ok' ? 'ok' : 'warn'}
        />
        <HudCell
          label="Backend Uptime"
          value={
            hud.backendUptimeSeconds != null
              ? `${(hud.backendUptimeSeconds / 3600).toFixed(1)} h`
              : 'NOT WIRED'
          }
          tone="neutral"
        />
        <HudCell
          label="Pipelines Online"
          value={`${hud.pipelinesOnline} / ${hud.pipelineCount}`}
          tone={hud.pipelineCount > 0 && hud.pipelinesOnline === hud.pipelineCount ? 'ok' : 'warn'}
        />
        <HudCell
          label="Last Sync"
          value={lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : '—'}
          tone="neutral"
        />
      </div>

      {/* ERROR BANNERS */}
      {(statusError || healthError) && (
        <div className="mx-4 p-3 rounded-lg border border-red-500/40 bg-red-500/10 text-red-300 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{statusError ? `Orchestrator endpoint: ${statusError}` : `Health endpoint: ${healthError}`}</span>
        </div>
      )}

      {research && (
        <div className="mx-4 p-3 rounded-lg border border-cyan-500/30 bg-cyan-500/5 text-cyan-100 space-y-1">
          <div>XAMAN_API_KEY: {hud.xamanApiKeyConfigured === null ? 'Not checked' : hud.xamanApiKeyConfigured ? 'Present' : 'Not set'}</div>
          <div>XAMAN_API_SECRET: {hud.xamanApiSecretConfigured === null ? 'Not checked' : hud.xamanApiSecretConfigured ? 'Present' : 'Not set'}</div>
          <div className="text-slate-400">Simulation for BTC-USD and XRP-USD does not need the secret. The key value is not shown.</div>
        </div>
      )}

      <div className="p-4 space-y-4">
        {/* REAL PIPELINE CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(status?.activePipelines ?? {}).map(([name, p]) => {
            const online = String(p.status).toUpperCase() === 'ONLINE';
            return (
              <div key={name} className="p-4 bg-[#060C14] border border-slate-800 rounded-xl space-y-3 relative overflow-hidden">
                <div className={`absolute top-0 left-0 right-0 h-1 ${online ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-cyan-400 text-xs font-bold">[Ω]</span>{' '}
                    <h3 className="font-bold text-white text-xs inline">{name}</h3>
                  </div>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-black border ${
                      online
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}
                  >
                    {String(p.status)}
                  </span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg text-[10px] space-y-1">
                  {Object.entries(p)
                    .filter(([k]) => k !== 'status')
                    .slice(0, 4)
                    .map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-2">
                        <span className="text-slate-500 truncate">{k}</span>
                        <span className="text-slate-200 truncate max-w-[60%]">{String(v)}</span>
                      </div>
                    ))}
                </div>
              </div>
            );
          })}
          {(!status || Object.keys(status.activePipelines ?? {}).length === 0) && !statusError && (
            <div className="p-4 text-slate-500">Awaiting first orchestrator poll…</div>
          )}
        </div>

        {/* ARBITRAGE MATRIX — awaiting a real backend endpoint */}
        <div className="bg-[#060C14] border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white text-xs flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-400" />
              Cross-Engine Arbitrage Spreads
            </span>
            <span className="text-[10px] text-amber-300 border border-amber-500/40 rounded px-1.5 py-0.5">
              NOT WIRED — needs backend endpoint
            </span>
          </div>
          <p className="text-[10px] text-slate-400">
            Previous version displayed hard-coded spreads and faked fills. Restore this panel
            once a real endpoint exists (e.g. GET /api/omnicyberdex/arbitrage/opportunities)
            and feed it through useOrchestratorStatus-style polling.
          </p>
        </div>
      </div>
    </div>
  );
};

const HudCell: React.FC<{ label: string; value: string; tone: 'ok' | 'warn' | 'neutral' }> = ({
  label, value, tone,
}) => (
  <div className="p-2 border-r border-slate-800 last:border-r-0">
    <div
      className={`text-xl font-bold font-sans ${
        tone === 'ok' ? 'text-emerald-400' : tone === 'warn' ? 'text-amber-300' : 'text-cyan-300'
      }`}
    >
      {value}
    </div>
    <div className="text-[10px] text-slate-400 uppercase">{label}</div>
  </div>
);

export default OmniCyberDexOrchestratorView;
