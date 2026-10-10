/**
 * useVRPortal Hook
 * 
 * React hook for VR Portal state management and AEGENTIS integration
 * - Real-time command execution
 * - Metrics tracking
 * - Identity verification
 * - Event streaming
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { getVRIntegration, initVRIntegration } from '@/lib/aegentis-vr-integration';
import type { VRCommand, VRMetrics } from '@/lib/aegentis-vr-integration';

interface UseVRPortalOptions {
  autoConnect?: boolean;
  metricsInterval?: number;
}

export function useVRPortal(options: UseVRPortalOptions = {}) {
  const { autoConnect = false, metricsInterval = 100 } = options;

  const [xrSupported, setXRSupported] = useState(false);
  const [xrActive, setXRActive] = useState(false);
  const [metrics, setMetrics] = useState<VRMetrics | null>(null);
  const [commandHistory, setCommandHistory] = useState<VRCommand[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<
    'disconnected' | 'connecting' | 'connected' | 'error'
  >('disconnected');
  const [error, setError] = useState<Error | null>(null);

  const vrRef = useRef(getVRIntegration());
  const metricsIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const fpsCounterRef = useRef({ frameCount: 0, lastTime: Date.now() });

  /**
   * Initialize VR integration
   */
  useEffect(() => {
    const checkXRSupport = async () => {
      try {
        const isSupported = await navigator.xr?.isSessionSupported('immersive-vr');
        setXRSupported(isSupported || false);

        if (!isSupported) {
          console.warn('[useVRPortal] WebXR not supported on this device');
        }
      } catch (err) {
        console.error('[useVRPortal] XR support check failed:', err);
        setError(err instanceof Error ? err : new Error('XR support check failed'));
      }
    };

    checkXRSupport();

    // Setup event listeners
    const vr = vrRef.current;
    const handleIdentityUpdate = (data: any) => {
      setMetrics(prev => prev ? { ...prev, ...data } : null);
    };

    const handleCommandSuccess = (cmd: VRCommand) => {
      setCommandHistory(prev => [cmd, ...prev.slice(0, 49)]);
    };

    const handleStreamConnected = () => {
      setConnectionStatus('connected');
    };

    const handleStreamError = (err: any) => {
      setConnectionStatus('error');
      setError(err instanceof Error ? err : new Error('Stream error'));
    };

    vr.on('identity:updated', handleIdentityUpdate);
    vr.on('command:success', handleCommandSuccess);
    vr.on('stream:connected', handleStreamConnected);
    vr.on('stream:error', handleStreamError);

    // Start metrics collection
    metricsIntervalRef.current = setInterval(() => {
      const currentMetrics = vr.getMetrics();
      setMetrics(currentMetrics);
    }, metricsInterval);

    return () => {
      vr.off('identity:updated', handleIdentityUpdate);
      vr.off('command:success', handleCommandSuccess);
      vr.off('stream:connected', handleStreamConnected);
      vr.off('stream:error', handleStreamError);

      if (metricsIntervalRef.current) {
        clearInterval(metricsIntervalRef.current);
      }
    };
  }, [metricsInterval]);

  /**
   * Auto-connect if enabled
   */
  useEffect(() => {
    if (autoConnect && xrSupported && !xrActive) {
      enterVR();
    }
  }, [autoConnect, xrSupported]);

  /**
   * Enter VR mode
   */
  const enterVR = useCallback(async () => {
    if (!xrSupported) {
      setError(new Error('WebXR not supported'));
      return;
    }

    try {
      setConnectionStatus('connecting');
      const session = await navigator.xr!.requestSession('immersive-vr', {
        requiredFeatures: ['local-floor', 'dom-overlay'],
        optionalFeatures: ['hand-tracking', 'eye-tracking'],
        domOverlay: { root: document.body },
      });

      setXRActive(true);
      setConnectionStatus('connected');

      // Connect to AEGENTIS event stream
      const vr = vrRef.current;
      vr.connectEventStream((event) => {
        console.log('[useVRPortal] Event:', event);
      });

      // Fetch initial identity
      await vr.fetchIdentity();

      console.log('[useVRPortal] Entered VR mode');
    } catch (err) {
      setConnectionStatus('error');
      setError(err instanceof Error ? err : new Error('Failed to enter VR'));
      console.error('[useVRPortal] Failed to enter VR:', err);
    }
  }, [xrSupported]);

  /**
   * Exit VR mode
   */
  const exitVR = useCallback(async () => {
    try {
      const vr = vrRef.current;
      vr.disconnectEventStream();
      setXRActive(false);
      setConnectionStatus('disconnected');
      console.log('[useVRPortal] Exited VR mode');
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to exit VR'));
      console.error('[useVRPortal] Failed to exit VR:', err);
    }
  }, []);

  /**
   * Execute VR command
   */
  const executeCommand = useCallback(
    async (action: string, authority: string, params: Record<string, any>) => {
      try {
        const vr = vrRef.current;
        const command = await vr.executeVRCommand(action, authority, params);
        setCommandHistory(prev => [command, ...prev.slice(0, 49)]);
        return command;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Command execution failed');
        setError(error);
        throw error;
      }
    },
    []
  );

  /**
   * Update FPS
   */
  const updateFPS = useCallback((fps: number) => {
    const vr = vrRef.current;
    vr.updateFPS(fps);
    setMetrics(prev => prev ? { ...prev, fps } : null);
  }, []);

  /**
   * Check AEGENTIS health
   */
  const checkHealth = useCallback(async () => {
    try {
      const vr = vrRef.current;
      const isHealthy = await vr.checkHealth();
      return isHealthy;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Health check failed'));
      return false;
    }
  }, []);

  /**
   * Clear command history
   */
  const clearHistory = useCallback(() => {
    const vr = vrRef.current;
    vr.clearCommandHistory();
    setCommandHistory([]);
  }, []);

  return {
    // State
    xrSupported,
    xrActive,
    metrics,
    commandHistory,
    connectionStatus,
    error,

    // Actions
    enterVR,
    exitVR,
    executeCommand,
    updateFPS,
    checkHealth,
    clearHistory,

    // Integration
    integration: vrRef.current,
  };
}
