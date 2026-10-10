/**
 * SOVEREIGN SYSTEM - useAgents Hook
 * 
 * React hook for managing agent data and operations
 */

import { useState, useEffect, useCallback } from 'react';
import { apiClient, Agent, ApiResponse } from '@/lib/api-client';

interface UseAgentsState {
  agents: Agent[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch and manage agents
 */
export function useAgents(tier?: number): UseAgentsState {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAgents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response: ApiResponse<Agent[]> = await apiClient.getAgents(tier);
      
      if (response.success && response.data) {
        setAgents(response.data);
      } else {
        setError(response.error || 'Failed to fetch agents');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [tier]);

  useEffect(() => {
    fetchAgents();
    
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchAgents, 30000);
    return () => clearInterval(interval);
  }, [fetchAgents]);

  return {
    agents,
    loading,
    error,
    refetch: fetchAgents,
  };
}

/**
 * Hook to manage a single agent
 */
export function useAgent(agentId: string) {
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAgent = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response: ApiResponse<Agent> = await apiClient.getAgent(agentId);
      
      if (response.success && response.data) {
        setAgent(response.data);
      } else {
        setError(response.error || 'Failed to fetch agent');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [agentId]);

  useEffect(() => {
    fetchAgent();
    
    // Poll for updates every 10 seconds
    const interval = setInterval(fetchAgent, 10000);
    return () => clearInterval(interval);
  }, [fetchAgent]);

  const startAgent = useCallback(async () => {
    try {
      await apiClient.startAgent(agentId);
      await fetchAgent();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start agent');
    }
  }, [agentId, fetchAgent]);

  const stopAgent = useCallback(async () => {
    try {
      await apiClient.stopAgent(agentId);
      await fetchAgent();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to stop agent');
    }
  }, [agentId, fetchAgent]);

  return {
    agent,
    loading,
    error,
    refetch: fetchAgent,
    startAgent,
    stopAgent,
  };
}
