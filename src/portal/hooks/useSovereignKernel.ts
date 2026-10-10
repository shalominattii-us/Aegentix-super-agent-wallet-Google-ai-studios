/**
 * React Hooks for SOVEREIGN Kernel Integration
 * 
 * Provides React hooks for cluster management, deployment control, and monitoring.
 * Handles loading states, error handling, and automatic retries.
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import {
  getSovereignKernel,
  ClusterStatus,
  DeploymentStatus,
  ServiceMetrics,
  DeploymentEvent,
  FailoverRequest,
  FailoverStatus,
} from '@/lib/sovereign-kernel-client';

/**
 * Hook for fetching cluster statuses with real-time updates
 */
export function useClusters() {
  const [clusters, setClusters] = useState<ClusterStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchClusters = async () => {
      try {
        setLoading(true);
        // Try to get kernel, but handle gracefully if not initialized
        try {
          const kernel = getSovereignKernel();
          const data = await kernel.getClusters();
          if (isMounted) {
            setClusters(data);
            setError(null);
          }
        } catch (kernelError) {
          // Kernel not initialized yet - set empty state
          if (isMounted) {
            setClusters([]);
            setError(null); // Don't show error for uninitialized kernel
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch clusters'));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchClusters();

    // Subscribe to cluster status updates
    try {
      try {
        const kernel = getSovereignKernel();
        unsubscribeRef.current = kernel.on('cluster-status', (event: DeploymentEvent) => {
          if (isMounted) {
            setClusters((prev) =>
              prev.map((c) => (c.id === event.clusterId ? { ...c, ...event.data } : c))
            );
          }
        });
      } catch (kernelError) {
        // Kernel not initialized - silently skip
      }
    } catch (err) {
      console.error('Failed to subscribe to cluster updates:', err);
    }

    return () => {
      isMounted = false;
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  return { clusters, loading, error };
}

/**
 * Hook for fetching specific cluster details
 */
export function useCluster(clusterId: string) {
  const [cluster, setCluster] = useState<ClusterStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!clusterId) return;

    let isMounted = true;

    const fetchCluster = async () => {
      try {
        setLoading(true);
        try {
          const kernel = getSovereignKernel();
          const data = await kernel.getCluster(clusterId);
          if (isMounted) {
            setCluster(data);
            setError(null);
          }
        } catch (kernelError) {
          // Kernel not initialized - set null state
          if (isMounted) {
            setCluster(null);
            setError(null);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch cluster'));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCluster();
    const interval = setInterval(fetchCluster, 5000); // Poll every 5 seconds

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [clusterId]);

  return { cluster, loading, error };
}

/**
 * Hook for fetching cluster metrics
 */
export function useClusterMetrics(clusterId: string) {
  const [metrics, setMetrics] = useState<ServiceMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!clusterId) return;

    let isMounted = true;

    const fetchMetrics = async () => {
      try {
        setLoading(true);
        try {
          const kernel = getSovereignKernel();
          const data = await kernel.getClusterMetrics(clusterId);
          if (isMounted) {
            setMetrics(data);
            setError(null);
          }
        } catch (kernelError) {
          if (isMounted) {
            setMetrics([]);
            setError(null);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch metrics'));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 15000); // Poll every 15 seconds

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [clusterId]);

  return { metrics, loading, error };
}

/**
 * Hook for fetching deployments
 */
export function useDeployments(clusterId: string, namespace?: string) {
  const [deployments, setDeployments] = useState<DeploymentStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!clusterId) return;

    let isMounted = true;

    const fetchDeployments = async () => {
      try {
        setLoading(true);
        const kernel = getSovereignKernel();
        const data = await kernel.getDeployments(clusterId, namespace);
        if (isMounted) {
          setDeployments(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch deployments'));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDeployments();
    const interval = setInterval(fetchDeployments, 10000); // Poll every 10 seconds

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [clusterId, namespace]);

  return { deployments, loading, error };
}

/**
 * Hook for scaling deployment
 */
export function useScaleDeployment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const scale = useCallback(
    async (clusterId: string, namespace: string, deploymentName: string, replicas: number) => {
      try {
        setLoading(true);
        setError(null);
        const kernel = getSovereignKernel();
        const result = await kernel.scaleDeployment(clusterId, namespace, deploymentName, replicas);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to scale deployment');
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { scale, loading, error };
}

/**
 * Hook for restarting deployment
 */
export function useRestartDeployment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const restart = useCallback(
    async (clusterId: string, namespace: string, deploymentName: string) => {
      try {
        setLoading(true);
        setError(null);
        const kernel = getSovereignKernel();
        const result = await kernel.restartDeployment(clusterId, namespace, deploymentName);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to restart deployment');
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { restart, loading, error };
}

/**
 * Hook for updating deployment image
 */
export function useUpdateDeploymentImage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const update = useCallback(
    async (clusterId: string, namespace: string, deploymentName: string, image: string) => {
      try {
        setLoading(true);
        setError(null);
        const kernel = getSovereignKernel();
        const result = await kernel.updateDeploymentImage(
          clusterId,
          namespace,
          deploymentName,
          image
        );
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to update deployment image');
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { update, loading, error };
}

/**
 * Hook for initiating failover
 */
export function useFailover() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [failoverStatus, setFailoverStatus] = useState<FailoverStatus | null>(null);

  const initiate = useCallback(async (request: FailoverRequest) => {
    try {
      setLoading(true);
      setError(null);
      const kernel = getSovereignKernel();
      const result = await kernel.initiateFailover(request);
      setFailoverStatus(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to initiate failover');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { initiate, loading, error, failoverStatus };
}

/**
 * Hook for monitoring failover status
 */
export function useFailoverStatus(failoverId: string | null) {
  const [status, setStatus] = useState<FailoverStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!failoverId) return;

    let isMounted = true;

    const fetchStatus = async () => {
      try {
        setLoading(true);
        const kernel = getSovereignKernel();
        const result = await kernel.getFailoverStatus(failoverId);
        if (isMounted) {
          setStatus(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch failover status'));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 2000); // Poll every 2 seconds

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [failoverId]);

  return { status, loading, error };
}

/**
 * Hook for federation status
 */
export function useFederationStatus() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchStatus = async () => {
      try {
        setLoading(true);
        const kernel = getSovereignKernel();
        const data = await kernel.getFederationStatus();
        if (isMounted) {
          setStatus(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch federation status'));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // Poll every 30 seconds

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return { status, loading, error };
}

/**
 * Hook for mesh status
 */
export function useMeshStatus() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchStatus = async () => {
      try {
        setLoading(true);
        const kernel = getSovereignKernel();
        const data = await kernel.getMeshStatus();
        if (isMounted) {
          setStatus(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch mesh status'));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // Poll every 30 seconds

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return { status, loading, error };
}

/**
 * Hook for observability status
 */
export function useObservabilityStatus() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchStatus = async () => {
      try {
        setLoading(true);
        const kernel = getSovereignKernel();
        const data = await kernel.getObservabilityStatus();
        if (isMounted) {
          setStatus(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err : new Error('Failed to fetch observability status')
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // Poll every 30 seconds

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return { status, loading, error };
}
