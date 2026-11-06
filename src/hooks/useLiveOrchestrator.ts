import { useEffect, useRef, useState } from 'react';
import { deriveHud as deriveResearchHud } from '../research/xamanOmniResearchMode';

/**
 * Live data hooks for the OmniCyberDex decks.
 * Replaces hard-coded INITIAL_ENGINES / INITIAL_ARBITRAGE mock data.
 * All figures rendered through these hooks come from the real backend;
 * anything the backend does not expose yet renders as "NOT WIRED" instead
 * of a fabricated number (Aegentix principle: simulated figures are never
 * presented as settled value).
 */

export interface OrchestratorPipeline {
  status: string;
  [key: string]: unknown;
}

export interface OrchestratorStatus {
  timestamp: string;
  mode?: string;
  liveExecutionEnabled?: boolean;
  xamanSetup?: {
    xamanApiKeyConfigured?: boolean;
    xamanApiSecretConfigured?: boolean;
    destination?: {
      fileName?: string;
      variable?: string;
      secretVariable?: string;
      pathRelativeToRepoRoot?: string;
    };
  };
  activePipelines: Record<string, OrchestratorPipeline>;
}

export interface HealthStatus {
  status: string;
  service: string;
  uptime: number;
  timestamp: string;
}

function jsonFetch<T>(url: string, signal: AbortSignal): Promise<T> {
  return fetch(url, { signal, headers: { Accept: 'application/json' } }).then(res => {
    if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}`);
    return res.json() as Promise<T>;
  });
}

/**
 * Polls the real orchestrator status endpoint.
 * @param apiBase e.g. 'https://api.aegentixcybernetics.com' (defaults to same origin)
 * @param intervalMs default 5000
 */
export function useOrchestratorStatus(apiBase = '', intervalMs = 5000) {
  const [status, setStatus] = useState<OrchestratorStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    let cancelled = false;
    const poll = async () => {
      abortRef.current?.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      try {
        const data = await jsonFetch<{ success: boolean; orchestrator: OrchestratorStatus }>(
          `${apiBase}/api/orchestrator/status`, ctrl.signal);
        if (cancelled) return;
        setStatus(data.orchestrator);
        setError(null);
        setLastUpdated(new Date().toISOString());
      } catch (e) {
        if (cancelled || ctrl.signal.aborted) return;
        setError(e instanceof Error ? e.message : String(e));
      }
    };
    poll();
    const t = setInterval(poll, intervalMs);
    return () => { cancelled = true; clearInterval(t); abortRef.current?.abort(); };
  }, [apiBase, intervalMs]);

  return { status, error, lastUpdated };
}

/** Polls backend health/uptime. */
export function useBackendHealth(apiBase = '', intervalMs = 15000) {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const ctrl = new AbortController();
    const poll = async () => {
      try {
        const data = await jsonFetch<HealthStatus>(`${apiBase}/api/health`, ctrl.signal);
        if (cancelled) return;
        setHealth(data);
        setError(null);
      } catch (e) {
        if (!cancelled && !ctrl.signal.aborted) setError(e instanceof Error ? e.message : String(e));
      }
    };
    poll();
    const t = setInterval(poll, intervalMs);
    return () => { cancelled = true; clearInterval(t); ctrl.abort(); };
  }, [apiBase, intervalMs]);

  return { health, error };
}

/** Computes the deck HUD from reported data. Unknowns stay null. Research mode is not live. */
export function deriveHud(status: OrchestratorStatus | null, health: HealthStatus | null) {
  return deriveResearchHud(status, health);
}
