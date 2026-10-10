/**
 * SOVEREIGN VR METRICS DASHBOARD
 * 
 * Real-time observability dashboard for the Sovereign VR system.
 * Displays: session metrics, Gentis AI decisions, GeoGentic queries,
 * self-healing events, arbitration throughput, and network health.
 */

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { Link } from 'wouter';

type TabId = 'overview' | 'sessions' | 'gentis' | 'geogentic' | 'healing' | 'network';

export default function VRMetricsDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  // Real-time data
  const dashboard = trpc.vr.metrics.dashboard.useQuery(undefined, { refetchInterval: 3000 });
  const healingStatus = trpc.vr.healing.status.useQuery(undefined, { refetchInterval: 5000 });
  const healingHistory = trpc.vr.healing.history.useQuery({ limit: 20 }, { refetchInterval: 10000 });
  const anomalies = trpc.vr.healing.anomalies.useQuery({ limit: 20 }, { refetchInterval: 10000 });
  const geoEntities = trpc.vr.geogentic.getEntities.useQuery(undefined, { refetchInterval: 10000 });
  const systemStatus = trpc.vr.status.useQuery(undefined, { refetchInterval: 5000 });

  const tabs: { id: TabId; label: string }[] = [
    { id: 'overview', label: 'OVERVIEW' },
    { id: 'sessions', label: 'VR SESSIONS' },
    { id: 'gentis', label: 'GENTIS AI' },
    { id: 'geogentic', label: 'GEOGENTIC' },
    { id: 'healing', label: 'SELF-HEALING' },
    { id: 'network', label: 'NETWORK' }
  ];

  const data = dashboard.data;

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white">
      {/* Header */}
      <div className="border-b border-cyan-900/30 bg-black/40 backdrop-blur-sm">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <span className="text-cyan-400 font-mono text-sm cursor-pointer hover:text-cyan-300">← PORTAL</span>
            </Link>
            <h1 className="text-lg font-mono font-bold text-white">METRICS DASHBOARD</h1>
            <span className={`text-xs font-mono px-2 py-0.5 rounded ${
              systemStatus.data?.health?.status === 'healthy' ? 'bg-green-900/50 text-green-400 border border-green-800' :
              'bg-yellow-900/50 text-yellow-400 border border-yellow-800'
            }`}>
              {systemStatus.data?.health?.status?.toUpperCase() || 'LOADING'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/vr">
              <Button variant="outline" className="border-cyan-700 text-cyan-400 hover:bg-cyan-900/30 font-mono text-xs">
                ENTER VR
              </Button>
            </Link>
            <span className="text-xs font-mono text-gray-500">{user?.name || 'Operator'}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-800 bg-black/20">
        <div className="container flex gap-1 py-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-xs font-mono rounded-t ${
                activeTab === tab.id
                  ? 'bg-cyan-900/30 text-cyan-400 border border-cyan-800 border-b-0'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="container py-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* VR Sessions */}
            <MetricCard
              title="VR SESSIONS"
              value={data?.vrSessions?.active || 0}
              subtitle={`${data?.vrSessions?.avgFrameRate || 90} FPS avg`}
              color="cyan"
              detail={`Latency: ${data?.vrSessions?.avgLatency || 0}ms`}
            />
            {/* Gentis AI */}
            <MetricCard
              title="GENTIS AI"
              value={data?.gentisAI?.activeInstances || 0}
              subtitle={`${(data?.gentisAI?.avgConfidence || 0) * 100}% confidence`}
              color="purple"
              detail={`${data?.gentisAI?.decisionsPerMin || 0} decisions/min`}
            />
            {/* GeoGentic */}
            <MetricCard
              title="GEOGENTIC"
              value={data?.geoGentic?.activeEntities || 0}
              subtitle={`${data?.geoGentic?.avgResponseTime || 0}ms response`}
              color="green"
              detail={`${data?.geoGentic?.queriesPerMin || 0} queries/min`}
            />
            {/* Self-Healing */}
            <MetricCard
              title="SELF-HEALING"
              value={data?.selfHealing?.circuitBreakersOpen || 0}
              subtitle={data?.selfHealing?.status || 'nominal'}
              color={data?.selfHealing?.circuitBreakersOpen ? 'red' : 'green'}
              detail={`${data?.selfHealing?.anomaliesDetected || 0} anomalies`}
            />
            {/* Arbitration */}
            <MetricCard
              title="ARBITRATION"
              value={data?.arbitration?.activeEscrows || 0}
              subtitle="Active Escrows"
              color="yellow"
              detail={`${data?.arbitration?.settlementsPerHour || 0} settlements/hr`}
            />
            {/* Diplomacy */}
            <MetricCard
              title="DIPLOMACY"
              value={data?.diplomacy?.activeCourts || 0}
              subtitle={`${data?.diplomacy?.marketListings || 0} listings`}
              color="orange"
              detail={`${data?.diplomacy?.tradesPerHour || 0} trades/hr`}
            />
            {/* Network */}
            <MetricCard
              title="MESH NETWORK"
              value={data?.network?.connectedNodes || 0}
              subtitle={`${data?.network?.meshLatency || 0}ms latency`}
              color="blue"
              detail={`${data?.network?.bandwidth || 0} Mbps`}
            />
            {/* System */}
            <MetricCard
              title="SYSTEM"
              value={`${Math.round((data?.system?.cpuUsage || 0) * 100)}%`}
              subtitle="CPU Usage"
              color="gray"
              detail={`Memory: ${Math.round((data?.system?.memoryUsage || 0) * 100)}%`}
            />
          </div>
        )}

        {activeTab === 'healing' && (
          <div className="space-y-6">
            {/* Subsystem Health Grid */}
            <div>
              <h2 className="text-sm font-mono text-cyan-400 mb-4">SUBSYSTEM HEALTH</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {healingStatus.data?.subsystems?.map((sub: any) => (
                  <Card key={sub.name} className={`bg-black/40 border p-3 ${
                    sub.status === 'healthy' ? 'border-green-800' :
                    sub.status === 'degraded' ? 'border-yellow-800' :
                    sub.status === 'critical' ? 'border-red-800' :
                    'border-gray-800'
                  }`}>
                    <div className="text-xs font-mono text-gray-400">{sub.name.replace('_', ' ').toUpperCase()}</div>
                    <div className={`text-sm font-mono font-bold mt-1 ${
                      sub.status === 'healthy' ? 'text-green-400' :
                      sub.status === 'degraded' ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      {sub.status.toUpperCase()}
                    </div>
                    <div className="text-xs font-mono text-gray-500 mt-1">
                      Errors: {sub.errorCount} | {sub.latency}ms
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Healing Events */}
            <div>
              <h2 className="text-sm font-mono text-cyan-400 mb-4">RECENT HEALING EVENTS</h2>
              <div className="space-y-2">
                {(healingHistory.data || []).length === 0 && (
                  <div className="text-gray-500 font-mono text-sm">No healing events recorded</div>
                )}
                {(healingHistory.data || []).map((event: any) => (
                  <Card key={event.id} className="bg-black/40 border-gray-800 p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-mono px-2 py-0.5 rounded ${
                        event.severity === 'critical' ? 'bg-red-900/50 text-red-400' :
                        event.severity === 'high' ? 'bg-orange-900/50 text-orange-400' :
                        'bg-yellow-900/50 text-yellow-400'
                      }`}>
                        {event.severity.toUpperCase()}
                      </span>
                      <span className="text-xs font-mono text-white">{event.subsystem}</span>
                      <span className="text-xs font-mono text-gray-400">{event.action}</span>
                    </div>
                    <span className={`text-xs font-mono ${
                      event.status === 'completed' ? 'text-green-400' : 'text-yellow-400'
                    }`}>
                      {event.status.toUpperCase()}
                    </span>
                  </Card>
                ))}
              </div>
            </div>

            {/* Anomalies */}
            <div>
              <h2 className="text-sm font-mono text-cyan-400 mb-4">DETECTED ANOMALIES</h2>
              <div className="space-y-2">
                {(anomalies.data || []).length === 0 && (
                  <div className="text-gray-500 font-mono text-sm">No anomalies detected — system nominal</div>
                )}
                {(anomalies.data || []).map((anomaly: any) => (
                  <Card key={anomaly.id} className="bg-black/40 border-gray-800 p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-gray-400">{anomaly.subsystem}</span>
                      <span className="text-xs font-mono text-white">{anomaly.type.replace('_', ' ')}</span>
                    </div>
                    <span className="text-xs font-mono text-gray-500">
                      {anomaly.value.toFixed(2)} / {anomaly.threshold}
                    </span>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'geogentic' && (
          <div className="space-y-6">
            <h2 className="text-sm font-mono text-cyan-400 mb-4">SPATIAL ENTITIES ({geoEntities.data?.length || 0})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(geoEntities.data || []).map((entity: any) => (
                <Card key={entity.id} className="bg-black/40 border-gray-800 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-mono font-bold text-white">{entity.label}</span>
                    <span className={`text-xs font-mono px-2 py-0.5 rounded ${
                      entity.active ? 'bg-green-900/50 text-green-400' : 'bg-gray-900/50 text-gray-500'
                    }`}>
                      {entity.active ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </div>
                  <div className="space-y-1 text-xs font-mono text-gray-400">
                    <div>Type: <span className="text-cyan-400">{entity.type.toUpperCase()}</span></div>
                    <div>Position: ({entity.spatialPosition?.x}, {entity.spatialPosition?.y}, {entity.spatialPosition?.z})</div>
                    <div>Coords: {entity.coordinates?.latitude?.toFixed(4)}, {entity.coordinates?.longitude?.toFixed(4)}</div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'sessions' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MetricCard title="ACTIVE" value={data?.vrSessions?.active || 0} subtitle="Sessions" color="cyan" detail="" />
              <MetricCard title="AVG FPS" value={data?.vrSessions?.avgFrameRate || 90} subtitle="Frames/sec" color="green" detail="" />
              <MetricCard title="LATENCY" value={`${data?.vrSessions?.avgLatency || 0}ms`} subtitle="Input delay" color="yellow" detail="" />
            </div>
          </div>
        )}

        {activeTab === 'gentis' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MetricCard title="INSTANCES" value={data?.gentisAI?.activeInstances || 0} subtitle="Active" color="purple" detail="" />
              <MetricCard title="CONFIDENCE" value={`${Math.round((data?.gentisAI?.avgConfidence || 0) * 100)}%`} subtitle="Average" color="cyan" detail="" />
              <MetricCard title="DECISIONS" value={data?.gentisAI?.decisionsPerMin || 0} subtitle="Per minute" color="green" detail="" />
            </div>
          </div>
        )}

        {activeTab === 'network' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <MetricCard title="NODES" value={data?.network?.connectedNodes || 0} subtitle="Connected" color="blue" detail="" />
              <MetricCard title="LATENCY" value={`${data?.network?.meshLatency || 0}ms`} subtitle="Mesh avg" color="cyan" detail="" />
              <MetricCard title="BANDWIDTH" value={`${data?.network?.bandwidth || 0}`} subtitle="Mbps" color="green" detail="" />
              <MetricCard title="PACKET LOSS" value={`${data?.network?.packetLoss || 0}%`} subtitle="Rate" color="red" detail="" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MetricCard({ title, value, subtitle, color, detail }: {
  title: string;
  value: string | number;
  subtitle: string;
  color: string;
  detail: string;
}) {
  const colorMap: Record<string, string> = {
    cyan: 'border-cyan-800 text-cyan-400',
    purple: 'border-purple-800 text-purple-400',
    green: 'border-green-800 text-green-400',
    red: 'border-red-800 text-red-400',
    yellow: 'border-yellow-800 text-yellow-400',
    orange: 'border-orange-800 text-orange-400',
    blue: 'border-blue-800 text-blue-400',
    gray: 'border-gray-700 text-gray-400'
  };

  const classes = colorMap[color] || colorMap.gray;
  const [borderClass, textClass] = classes.split(' ');

  return (
    <Card className={`bg-black/40 ${borderClass} border p-4`}>
      <div className="text-xs font-mono text-gray-500 mb-1">{title}</div>
      <div className={`text-2xl font-mono font-bold ${textClass}`}>{value}</div>
      <div className="text-xs font-mono text-gray-400 mt-1">{subtitle}</div>
      {detail && <div className="text-xs font-mono text-gray-600 mt-2">{detail}</div>}
    </Card>
  );
}
