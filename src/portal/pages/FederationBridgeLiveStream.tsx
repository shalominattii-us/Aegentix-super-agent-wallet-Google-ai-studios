import { useEffect, useState } from 'react';
import { trpc } from '@/lib/trpc';

interface FederationEvent {
  timestamp: number;
  source: string;
  target: string;
  command: string;
  status: string;
  dataTransferred: number;
}

export function FederationBridgeLiveStream() {
  const [events, setEvents] = useState<FederationEvent[]>([]);
  const [isStreaming, setIsStreaming] = useState(true);
  const [stats, setStats] = useState({
    totalEvents: 0,
    dataTransferred: 0,
    uptime: 0,
    syncRate: 0,
  });

  // Simulate live stream updates
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      const newEvent: FederationEvent = {
        timestamp: Date.now(),
        source: 'sovereign-portal-us-west-1',
        target: 'ae-hub-rog',
        command: 'SYNC_ORBITAL_NEXUS',
        status: 'active',
        dataTransferred: Math.floor(Math.random() * 1024 * 1024), // 0-1MB
      };

      setEvents((prev) => [newEvent, ...prev.slice(0, 99)]);
      setStats((prev) => ({
        totalEvents: prev.totalEvents + 1,
        dataTransferred: prev.dataTransferred + newEvent.dataTransferred,
        uptime: prev.uptime + 1,
        syncRate: Math.floor(Math.random() * 100) + 50, // 50-150 ops/sec
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [isStreaming]);

  return (
    <div className="min-h-screen bg-black text-cyan-400 font-mono p-8">
      {/* Header */}
      <div className="border-2 border-cyan-400 p-4 mb-8 bg-black/50">
        <h1 className="text-3xl font-bold mb-2">🛰️ FEDERATION BRIDGE LIVE STREAM</h1>
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <div>
              <span className="text-cyan-300">SOURCE:</span> sovereign-portal-us-west-1
            </div>
            <div className="text-green-400">→</div>
            <div>
              <span className="text-cyan-300">TARGET:</span> ae-hub-rog
            </div>
          </div>
          <div className={`text-xl font-bold ${isStreaming ? 'text-green-400 animate-pulse' : 'text-red-400'}`}>
            {isStreaming ? '🔴 LIVE' : '⚫ OFFLINE'}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="border border-cyan-400 p-4 bg-black/50">
          <div className="text-cyan-300 text-sm mb-2">TOTAL EVENTS</div>
          <div className="text-3xl font-bold text-green-400">{stats.totalEvents}</div>
        </div>
        <div className="border border-cyan-400 p-4 bg-black/50">
          <div className="text-cyan-300 text-sm mb-2">DATA TRANSFERRED</div>
          <div className="text-3xl font-bold text-green-400">{(stats.dataTransferred / 1024 / 1024).toFixed(2)} MB</div>
        </div>
        <div className="border border-cyan-400 p-4 bg-black/50">
          <div className="text-cyan-300 text-sm mb-2">UPTIME (SEC)</div>
          <div className="text-3xl font-bold text-green-400">{stats.uptime}</div>
        </div>
        <div className="border border-cyan-400 p-4 bg-black/50">
          <div className="text-cyan-300 text-sm mb-2">SYNC RATE (OPS/SEC)</div>
          <div className="text-3xl font-bold text-green-400">{stats.syncRate}</div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="border border-cyan-400 p-4 mb-8 bg-black/50">
        <button
          onClick={() => setIsStreaming(!isStreaming)}
          className={`px-6 py-2 font-bold text-lg border-2 ${
            isStreaming
              ? 'border-red-500 text-red-500 hover:bg-red-500/20'
              : 'border-green-500 text-green-500 hover:bg-green-500/20'
          }`}
        >
          {isStreaming ? '⏹ STOP STREAM' : '▶ START STREAM'}
        </button>
      </div>

      {/* Live Event Feed */}
      <div className="border-2 border-cyan-400 p-4 bg-black/50 max-h-96 overflow-y-auto">
        <div className="text-cyan-300 font-bold mb-4">📡 LIVE EVENT FEED</div>
        <div className="space-y-2">
          {events.length === 0 ? (
            <div className="text-gray-500">Waiting for events...</div>
          ) : (
            events.map((event, idx) => (
              <div
                key={idx}
                className="border-l-2 border-green-400 pl-4 py-2 text-sm hover:bg-green-400/10 transition"
              >
                <div className="flex justify-between">
                  <span className="text-green-400">[{new Date(event.timestamp).toLocaleTimeString()}]</span>
                  <span className="text-cyan-300">{event.command}</span>
                  <span className="text-yellow-400">{(event.dataTransferred / 1024).toFixed(2)} KB</span>
                </div>
                <div className="text-gray-400 text-xs mt-1">
                  {event.source} → {event.target} | Status: {event.status}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-gray-500 text-sm">
        <div>Federation Bridge Live Stream • EAGLE_OVERWATCH_COMMAND • us-west-1</div>
        <div>Nexus Registry • Orbital Command Active</div>
      </div>
    </div>
  );
}

export default FederationBridgeLiveStream;
