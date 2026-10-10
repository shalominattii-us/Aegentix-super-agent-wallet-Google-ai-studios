import { useEffect, useState, useCallback, useRef } from 'react';
import { socketClient, SocketEvent, EventType } from '@/lib/socket-client';

/**
 * useSocket - Hook to manage Socket.io connection lifecycle
 */
export function useSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const connectionAttemptedRef = useRef(false);

  useEffect(() => {
    if (connectionAttemptedRef.current) return;
    connectionAttemptedRef.current = true;

    const connect = async () => {
      try {
        await socketClient.connect();
        setIsConnected(true);
        setError(null);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        console.error('[useSocket] Connection failed:', error);
      }
    };

    connect();

    return () => {
      // Don't disconnect on unmount - keep connection alive
      // socketClient.disconnect();
    };
  }, []);

  return { isConnected, error };
}

/**
 * useSocketEvent - Hook to listen for specific event types
 */
export function useSocketEvent(eventType: EventType | string, callback: (event: SocketEvent) => void) {
  useEffect(() => {
    const unsubscribe = socketClient.on(eventType, callback);
    return unsubscribe;
  }, [eventType, callback]);
}

/**
 * useSocketEvents - Hook to listen for multiple event types
 */
export function useSocketEvents(
  eventTypes: (EventType | string)[],
  callback: (event: SocketEvent) => void
) {
  useEffect(() => {
    const unsubscribers = eventTypes.map((eventType) => socketClient.on(eventType, callback));

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [eventTypes, callback]);
}

/**
 * useSocketSubscription - Hook to manage channel subscriptions
 */
export function useSocketSubscription(channel: 'ledger' | 'treasury' | 'agents' | 'all') {
  useEffect(() => {
    socketClient.subscribe(channel);

    return () => {
      socketClient.unsubscribe(channel);
    };
  }, [channel]);
}

/**
 * useRealTimeEvents - Hook to collect real-time events with state management
 */
export function useRealTimeEvents(
  eventType: EventType | string,
  maxEvents: number = 50
) {
  const [events, setEvents] = useState<SocketEvent[]>([]);
  const [latestEvent, setLatestEvent] = useState<SocketEvent | null>(null);

  const handleEvent = useCallback((event: SocketEvent) => {
    setLatestEvent(event);
    setEvents((prev) => {
      const updated = [event, ...prev];
      return updated.slice(0, maxEvents);
    });
  }, [maxEvents]);

  useSocketEvent(eventType, handleEvent);

  return { events, latestEvent };
}

/**
 * useRealTimeMetrics - Hook to track metrics from real-time events
 */
export function useRealTimeMetrics(eventType: EventType | string) {
  const [metrics, setMetrics] = useState({
    totalEvents: 0,
    lastEventTime: null as string | null,
    eventsByStatus: {} as Record<string, number>,
    eventsByType: {} as Record<string, number>,
  });

  const handleEvent = useCallback((event: SocketEvent) => {
    setMetrics((prev) => {
      const status = event.data?.status || 'unknown';
      const type = event.data?.type || 'unknown';

      return {
        totalEvents: prev.totalEvents + 1,
        lastEventTime: event.timestamp,
        eventsByStatus: {
          ...prev.eventsByStatus,
          [status]: (prev.eventsByStatus[status] || 0) + 1,
        },
        eventsByType: {
          ...prev.eventsByType,
          [type]: (prev.eventsByType[type] || 0) + 1,
        },
      };
    });
  }, []);

  useSocketEvent(eventType, handleEvent);

  return metrics;
}

export default useSocket;
