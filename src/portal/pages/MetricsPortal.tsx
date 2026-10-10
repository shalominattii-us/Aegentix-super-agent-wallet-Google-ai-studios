import { useMetrics, useSystemHealth } from '@/hooks/useMetrics';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, TrendingUp, Activity } from 'lucide-react';
import ErrorBoundary from '@/components/ErrorBoundary';
import MetricsErrorFallback from '@/components/MetricsErrorFallback';

function MetricsPortalContent() {
  const { metrics, loading, error } = useMetrics({ interval: 3000 });
  const { health, loading: healthLoading } = useSystemHealth({ interval: 3000 });

  if (loading || healthLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-foreground/60">Loading system metrics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="w-5 h-5" />
              Metrics Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground/60">{error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!metrics || !health) return null;

  const getHealthColor = (value: number) => {
    if (value >= 90) return 'text-green-500';
    if (value >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getHealthBadge = (value: number) => {
    if (value >= 90) return 'bg-green-500/20 text-green-700';
    if (value >= 70) return 'bg-yellow-500/20 text-yellow-700';
    return 'bg-red-500/20 text-red-700';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">System Metrics Portal</h1>
              <p className="text-foreground/60 mt-1">Real-time operational intelligence</p>
            </div>
            <Badge variant="outline" className={getHealthBadge(health.overallHealth)}>
              {health.overallHealth}% Healthy
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* System Health Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-foreground/60">Overall Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{health.overallHealth}%</div>
              <p className="text-xs text-foreground/40 mt-1">System operational</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-foreground/60">Active Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-500">{health.activeAlerts}</div>
              <p className="text-xs text-foreground/40 mt-1">Requiring attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-foreground/60">Critical Issues</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${health.criticalIssues > 0 ? 'text-red-500' : 'text-green-500'}`}>
                {health.criticalIssues}
              </div>
              <p className="text-xs text-foreground/40 mt-1">Immediate action needed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-foreground/60">Last Updated</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-mono">
                {new Date(health.timestamp).toLocaleTimeString()}
              </div>
              <p className="text-xs text-foreground/40 mt-1">Real-time data</p>
            </CardContent>
          </Card>
        </div>

        {/* Component Health */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Component Health Status</CardTitle>
            <CardDescription>Individual component operational status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(health.componentHealth).map(([component, value]) => {
                const numValue = typeof value === 'number' ? value : 0;
                return (
                <div key={component} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/40">
                  <span className="text-sm font-medium capitalize">{component}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-lg font-bold ${getHealthColor(numValue)}`}>{numValue}%</span>
                    {numValue >= 90 ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-yellow-500" />
                    )}
                  </div>
                </div>
              );
                          })
            }
            </div>
          </CardContent>
        </Card>

        {/* Sovereign Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Sovereign Core</CardTitle>
              <CardDescription>Kernel and subsystem metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-foreground/60 mb-1">Uptime</p>
                  <p className="text-lg font-bold">{Math.floor(metrics.sovereign.kernel.uptime / 3600)}h</p>
                </div>
                <div>
                  <p className="text-xs text-foreground/60 mb-1">Processes</p>
                  <p className="text-lg font-bold">{metrics.sovereign.kernel.processes}</p>
                </div>
                <div>
                  <p className="text-xs text-foreground/60 mb-1">CPU Usage</p>
                  <p className="text-lg font-bold">{metrics.sovereign.kernel.cpuUsage}%</p>
                </div>
                <div>
                  <p className="text-xs text-foreground/60 mb-1">Memory Usage</p>
                  <p className="text-lg font-bold">{metrics.sovereign.kernel.memoryUsage}%</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-foreground/60 mb-2">Subsystems</p>
                <div className="space-y-1">
                  {metrics.sovereign.subsystems.map((sub: any) => (
                    <div key={sub.name} className="flex items-center justify-between text-sm">
                      <span>{sub.name}</span>
                      <Badge variant="outline">{sub.health}%</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Aegentis Engine</CardTitle>
              <CardDescription>Agent maturity and performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-foreground/60 mb-1">Maturity Level</p>
                  <p className="text-lg font-bold">{metrics.aegentis.maturityField.level}</p>
                </div>
                <div>
                  <p className="text-xs text-foreground/60 mb-1">Active Agents</p>
                  <p className="text-lg font-bold">{metrics.aegentis.agents.active}/{metrics.aegentis.agents.total}</p>
                </div>
                <div>
                  <p className="text-xs text-foreground/60 mb-1">Throughput</p>
                  <p className="text-lg font-bold">{metrics.aegentis.performance.throughput}/s</p>
                </div>
                <div>
                  <p className="text-xs text-foreground/60 mb-1">Error Rate</p>
                  <p className="text-lg font-bold">{metrics.aegentis.performance.errorRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pantheon & ZK9 Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Pantheon Deployment</CardTitle>
              <CardDescription>Installation and infrastructure metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-foreground/60 mb-1">Successful</p>
                  <p className="text-lg font-bold text-green-500">{metrics.pantheon.installers.successful}</p>
                </div>
                <div>
                  <p className="text-xs text-foreground/60 mb-1">Failed</p>
                  <p className="text-lg font-bold text-red-500">{metrics.pantheon.installers.failed}</p>
                </div>
                <div>
                  <p className="text-xs text-foreground/60 mb-1">Active Deployments</p>
                  <p className="text-lg font-bold">{metrics.pantheon.deployments.active}</p>
                </div>
                <div>
                  <p className="text-xs text-foreground/60 mb-1">Nodes Online</p>
                  <p className="text-lg font-bold">{metrics.pantheon.infrastructure.nodesOnline}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Commander ZK9</CardTitle>
              <CardDescription>Telemetry and operations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-foreground/60 mb-1">Events Processed</p>
                  <p className="text-lg font-bold">{(metrics.zk9.telemetry.eventsProcessed / 1000000).toFixed(1)}M</p>
                </div>
                <div>
                  <p className="text-xs text-foreground/60 mb-1">Commands Executed</p>
                  <p className="text-lg font-bold">{metrics.zk9.telemetry.commandsExecuted}</p>
                </div>
                <div>
                  <p className="text-xs text-foreground/60 mb-1">Latency P95</p>
                  <p className="text-lg font-bold">{metrics.zk9.performance.latencyP95}ms</p>
                </div>
                <div>
                  <p className="text-xs text-foreground/60 mb-1">Active Operations</p>
                  <p className="text-lg font-bold">{metrics.zk9.operations.activeOperations}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Missions */}
        {metrics.missions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Active Missions</CardTitle>
              <CardDescription>Current operational missions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.missions.map((mission) => (
                  <div key={mission.id} className="p-4 rounded-lg bg-background/50 border border-border/40">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-foreground">{mission.name}</h4>
                        <p className="text-xs text-foreground/60">{mission.agents} agents • {mission.tasks} tasks</p>
                      </div>
                      <Badge variant="outline">{mission.status}</Badge>
                    </div>
                    <div className="w-full bg-background rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${mission.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-foreground/60 mt-2">{mission.progress}% complete</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

/**
 * MetricsPortal Component
 * Wrapped with ErrorBoundary for graceful error handling
 */
export default function MetricsPortal() {
  return (
    <ErrorBoundary
      componentName="Metrics Portal"
      fallback={
        <MetricsErrorFallback
          componentName="Metrics Portal"
          isNetworkError={true}
        />
      }
      onError={(error, errorInfo) => {
        console.error('MetricsPortal error:', error, errorInfo);
      }}
    >
      <MetricsPortalContent />
    </ErrorBoundary>
  );
}
