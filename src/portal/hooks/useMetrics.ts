import { useEffect, useState, useCallback } from 'react';
import metricsClient, { SovereignMetrics } from '@/lib/metrics-client';

/**
 * SOVEREIGN METRICS HOOKS
 * React hooks for consuming metrics throughout the application
 */

export interface UseMetricsOptions {
  interval?: number;
  onError?: (error: Error) => void;
}

/**
 * useMetrics - Fetch all metrics with auto-refresh
 */
export const useMetrics = (options: UseMetricsOptions = {}) => {
  const { interval = 5000, onError } = options;
  const [metrics, setMetrics] = useState<SovereignMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true);
      const data = await metricsClient.getAllMetrics();
      setMetrics(data);
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [onError]);

  useEffect(() => {
    fetchMetrics();
    const timer = setInterval(fetchMetrics, interval);
    return () => clearInterval(timer);
  }, [fetchMetrics, interval]);

  return { metrics, loading, error, refetch: fetchMetrics };
};

/**
 * useSovereignMetrics - Fetch Sovereign core metrics
 */
export const useSovereignMetrics = (options: UseMetricsOptions = {}) => {
  const { interval = 5000, onError } = options;
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true);
      const data = await metricsClient.getCoreMetrics();
      setMetrics(data);
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [onError]);

  useEffect(() => {
    fetchMetrics();
    const timer = setInterval(fetchMetrics, interval);
    return () => clearInterval(timer);
  }, [fetchMetrics, interval]);

  return { metrics, loading, error, refetch: fetchMetrics };
};

/**
 * useAegentisMetrics - Fetch Aegentis maturity metrics
 */
export const useAegentisMetrics = (options: UseMetricsOptions = {}) => {
  const { interval = 5000, onError } = options;
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true);
      const data = await metricsClient.getMaturityMetrics();
      setMetrics(data);
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [onError]);

  useEffect(() => {
    fetchMetrics();
    const timer = setInterval(fetchMetrics, interval);
    return () => clearInterval(timer);
  }, [fetchMetrics, interval]);

  return { metrics, loading, error, refetch: fetchMetrics };
};

/**
 * usePantheonMetrics - Fetch Pantheon deployment metrics
 */
export const usePantheonMetrics = (options: UseMetricsOptions = {}) => {
  const { interval = 5000, onError } = options;
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true);
      const data = await metricsClient.getInstallerMetrics();
      setMetrics(data);
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [onError]);

  useEffect(() => {
    fetchMetrics();
    const timer = setInterval(fetchMetrics, interval);
    return () => clearInterval(timer);
  }, [fetchMetrics, interval]);

  return { metrics, loading, error, refetch: fetchMetrics };
};

/**
 * useZK9Metrics - Fetch ZK9 telemetry metrics
 */
export const useZK9Metrics = (options: UseMetricsOptions = {}) => {
  const { interval = 5000, onError } = options;
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true);
      const data = await metricsClient.getTelemetryMetrics();
      setMetrics(data);
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [onError]);

  useEffect(() => {
    fetchMetrics();
    const timer = setInterval(fetchMetrics, interval);
    return () => clearInterval(timer);
  }, [fetchMetrics, interval]);

  return { metrics, loading, error, refetch: fetchMetrics };
};

/**
 * useMissionMetrics - Fetch mission metrics
 */
export const useMissionMetrics = (options: UseMetricsOptions = {}) => {
  const { interval = 5000, onError } = options;
  const [missions, setMissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true);
      const data = await metricsClient.getMissionMetrics();
      setMissions(data);
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [onError]);

  useEffect(() => {
    fetchMetrics();
    const timer = setInterval(fetchMetrics, interval);
    return () => clearInterval(timer);
  }, [fetchMetrics, interval]);

  return { missions, loading, error, refetch: fetchMetrics };
};

/**
 * useSystemHealth - Fetch system health metrics
 */
export const useSystemHealth = (options: UseMetricsOptions = {}) => {
  const { interval = 5000, onError } = options;
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true);
      const data = await metricsClient.getSystemHealth();
      setHealth(data);
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [onError]);

  useEffect(() => {
    fetchMetrics();
    const timer = setInterval(fetchMetrics, interval);
    return () => clearInterval(timer);
  }, [fetchMetrics, interval]);

  return { health, loading, error, refetch: fetchMetrics };
};
