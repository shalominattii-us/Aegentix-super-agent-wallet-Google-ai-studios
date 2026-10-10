/**
 * SOVEREIGN SYSTEM - useCommunicationLogs Hook
 * 
 * React hook for managing real-time communication logs
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { apiClient, CommunicationLog, ApiResponse } from '@/lib/api-client';

interface UseCommunicationLogsState {
  logs: CommunicationLog[];
  loading: boolean;
  error: string | null;
  isLive: boolean;
  setIsLive: (live: boolean) => void;
  clearLogs: () => void;
  refetch: () => Promise<void>;
}

/**
 * Hook to stream real-time communication logs
 */
export function useCommunicationLogs(maxLogs: number = 100): UseCommunicationLogsState {
  const [logs, setLogs] = useState<CommunicationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(true);
  const eventSourceRef = useRef<EventSource | null>(null);

  const fetchInitialLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response: ApiResponse<CommunicationLog[]> = await apiClient.getCommunicationLogs({
        limit: maxLogs,
      });
      
      if (response.success && response.data) {
        setLogs(response.data);
      } else {
        setError(response.error || 'Failed to fetch logs');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [maxLogs]);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  useEffect(() => {
    // Fetch initial logs
    fetchInitialLogs();

    // Only stream if live mode is enabled
    if (!isLive) return;

    try {
      // Stream new logs
      eventSourceRef.current = apiClient.streamCommunicationLogs(
        (newLog: CommunicationLog) => {
          setLogs((prevLogs) => {
            const updated = [newLog, ...prevLogs];
            // Keep only the most recent maxLogs
            return updated.slice(0, maxLogs);
          });
        },
        (err: Error) => {
          setError(err.message);
          console.error('Stream error:', err);
        }
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start streaming');
    }

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [isLive, fetchInitialLogs, maxLogs]);

  return {
    logs,
    loading,
    error,
    isLive,
    setIsLive,
    clearLogs,
    refetch: fetchInitialLogs,
  };
}

/**
 * Hook to filter communication logs
 */
export function useFilteredCommunicationLogs(
  logs: CommunicationLog[],
  filters: {
    priority?: string;
    status?: string;
    agentId?: string;
    searchText?: string;
  }
) {
  return logs.filter((log) => {
    if (filters.priority && log.priority !== filters.priority) return false;
    if (filters.status && log.status !== filters.status) return false;
    if (filters.agentId && log.source_agent_id !== filters.agentId && log.target_agent_id !== filters.agentId) {
      return false;
    }
    if (filters.searchText && !JSON.stringify(log.payload).includes(filters.searchText)) {
      return false;
    }
    return true;
  });
}
