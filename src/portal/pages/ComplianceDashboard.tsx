import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Clock, XCircle, TrendingUp, Shield } from 'lucide-react';
import { socketClient } from '@/lib/socket-client';
import { trpc } from '@/lib/trpc';
import { Streamdown } from 'streamdown';

interface ComplianceAlert {
  id: number;
  alertId: string;
  transactionId?: string;
  chainId: string;
  from: string;
  to: string;
  amount?: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskScore: number;
  alertType: string;
  description: string;
  status: 'open' | 'investigating' | 'resolved' | 'false_positive' | 'escalated';
  createdAt: string;
}

interface ComplianceStats {
  totalAlerts: number;
  openAlerts: number;
  resolvedAlerts: number;
  averageRiskScore: number;
  criticalAlerts: number;
  investigatingAlerts: number;
}

export default function ComplianceDashboard() {
  const [alerts, setAlerts] = useState<ComplianceAlert[]>([]);
  const [stats, setStats] = useState<ComplianceStats>({
    totalAlerts: 0,
    openAlerts: 0,
    resolvedAlerts: 0,
    averageRiskScore: 0,
    criticalAlerts: 0,
    investigatingAlerts: 0,
  });
  const [selectedAlert, setSelectedAlert] = useState<ComplianceAlert | null>(null);
  const [filter, setFilter] = useState<'all' | 'open' | 'critical'>('all');
  const [isConnected, setIsConnected] = useState(false);

  // Fetch initial compliance data
  const { data: initialAlerts, isLoading } = trpc.compliance.getAlerts.useQuery({
    limit: 50,
    status: filter === 'all' ? undefined : filter === 'open' ? 'open' : undefined,
    riskLevel: filter === 'critical' ? 'critical' : undefined,
  });

  // Socket.io connection for real-time alerts
  useEffect(() => {
    const socket = socketClient.getSocket();
    if (!socket) return;

    setIsConnected(socket.connected);

    // Listen for new compliance alerts
    socket.on('compliance:alert', (alert: ComplianceAlert) => {
      console.log('[Compliance] New alert received:', alert);
      setAlerts((prev) => [alert, ...prev].slice(0, 100)); // Keep last 100

      // Update stats
      setStats((prev) => ({
        ...prev,
        totalAlerts: prev.totalAlerts + 1,
        openAlerts: alert.status === 'open' ? prev.openAlerts + 1 : prev.openAlerts,
        criticalAlerts: alert.riskLevel === 'critical' ? prev.criticalAlerts + 1 : prev.criticalAlerts,
      }));
    });

    // Listen for alert status updates
    socket.on('compliance:alert-updated', (update: { alertId: string; status: string; riskScore: number }) => {
      console.log('[Compliance] Alert updated:', update);
      setAlerts((prev) =>
        prev.map((a) =>
          a.alertId === update.alertId ? { ...a, status: update.status as any, riskScore: update.riskScore } : a
        )
      );
    });

    // Listen for compliance stats updates
    socket.on('compliance:stats', (newStats: ComplianceStats) => {
      console.log('[Compliance] Stats updated:', newStats);
      setStats(newStats);
    });

    socket.on('connect', () => {
      console.log('[Compliance] Socket connected');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('[Compliance] Socket disconnected');
      setIsConnected(false);
    });

    return () => {
      socket.off('compliance:alert');
      socket.off('compliance:alert-updated');
      socket.off('compliance:stats');
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  // Load initial alerts
  useEffect(() => {
    if (initialAlerts) {
      setAlerts(initialAlerts);
    }
  }, [initialAlerts]);

  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'bg-red-600 text-white';
      case 'high':
        return 'bg-orange-600 text-white';
      case 'medium':
        return 'bg-yellow-600 text-white';
      default:
        return 'bg-green-600 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'investigating':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'escalated':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    }
  };

  const filteredAlerts = alerts.filter((a) => {
    if (filter === 'open') return a.status === 'open';
    if (filter === 'critical') return a.riskLevel === 'critical' || a.riskScore >= 75;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-blue-400" />
              <h1 className="text-4xl font-bold text-white">Compliance Dashboard</h1>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm text-gray-400">{isConnected ? 'Connected' : 'Disconnected'}</span>
            </div>
          </div>
          <p className="text-gray-400">Real-time KYC/AML monitoring and compliance alerts</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card className="bg-slate-800 border-slate-700 p-4">
            <div className="text-gray-400 text-sm mb-2">Total Alerts</div>
            <div className="text-3xl font-bold text-white">{stats.totalAlerts}</div>
          </Card>
          <Card className="bg-slate-800 border-slate-700 p-4">
            <div className="text-gray-400 text-sm mb-2">Open</div>
            <div className="text-3xl font-bold text-yellow-400">{stats.openAlerts}</div>
          </Card>
          <Card className="bg-slate-800 border-slate-700 p-4">
            <div className="text-gray-400 text-sm mb-2">Investigating</div>
            <div className="text-3xl font-bold text-blue-400">{stats.investigatingAlerts}</div>
          </Card>
          <Card className="bg-slate-800 border-slate-700 p-4">
            <div className="text-gray-400 text-sm mb-2">Critical</div>
            <div className="text-3xl font-bold text-red-400">{stats.criticalAlerts}</div>
          </Card>
          <Card className="bg-slate-800 border-slate-700 p-4">
            <div className="text-gray-400 text-sm mb-2">Resolved</div>
            <div className="text-3xl font-bold text-green-400">{stats.resolvedAlerts}</div>
          </Card>
          <Card className="bg-slate-800 border-slate-700 p-4">
            <div className="text-gray-400 text-sm mb-2">Avg Risk</div>
            <div className="text-3xl font-bold text-orange-400">{stats.averageRiskScore.toFixed(0)}</div>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'bg-blue-600 hover:bg-blue-700' : ''}
          >
            All Alerts ({alerts.length})
          </Button>
          <Button
            variant={filter === 'open' ? 'default' : 'outline'}
            onClick={() => setFilter('open')}
            className={filter === 'open' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}
          >
            Open ({alerts.filter((a) => a.status === 'open').length})
          </Button>
          <Button
            variant={filter === 'critical' ? 'default' : 'outline'}
            onClick={() => setFilter('critical')}
            className={filter === 'critical' ? 'bg-red-600 hover:bg-red-700' : ''}
          >
            Critical ({alerts.filter((a) => a.riskLevel === 'critical').length})
          </Button>
        </div>

        {/* Alerts List */}
        <div className="space-y-4">
          {isLoading ? (
            <Card className="bg-slate-800 border-slate-700 p-8 text-center">
              <p className="text-gray-400">Loading compliance alerts...</p>
            </Card>
          ) : filteredAlerts.length === 0 ? (
            <Card className="bg-slate-800 border-slate-700 p-8 text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <p className="text-gray-400">No alerts to display</p>
            </Card>
          ) : (
            filteredAlerts.map((alert) => (
              <Card
                key={alert.alertId}
                className="bg-slate-800 border-slate-700 p-6 hover:border-slate-600 cursor-pointer transition"
                onClick={() => setSelectedAlert(alert)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    {getStatusIcon(alert.status)}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">{alert.alertType}</h3>
                        <Badge className={getRiskBadgeColor(alert.riskLevel)}>
                          Risk: {alert.riskScore}
                        </Badge>
                        <Badge variant="outline" className="text-gray-300">
                          {alert.status}
                        </Badge>
                      </div>
                      <p className="text-gray-400 mb-2">{alert.description}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">From:</span>
                          <p className="text-gray-300 font-mono text-xs">{alert.from.slice(0, 16)}...</p>
                        </div>
                        <div>
                          <span className="text-gray-500">To:</span>
                          <p className="text-gray-300 font-mono text-xs">{alert.to.slice(0, 16)}...</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Chain:</span>
                          <p className="text-gray-300">{alert.chainId}</p>
                        </div>
                        {alert.amount && (
                          <div>
                            <span className="text-gray-500">Amount:</span>
                            <p className="text-gray-300">{alert.amount}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    {new Date(alert.createdAt).toLocaleString()}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Alert Details Modal */}
        {selectedAlert && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="bg-slate-800 border-slate-700 max-w-2xl w-full max-h-96 overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-white">{selectedAlert.alertType}</h2>
                  <button
                    onClick={() => setSelectedAlert(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4 text-gray-300">
                  <div>
                    <span className="text-gray-500">Alert ID:</span>
                    <p className="font-mono text-sm">{selectedAlert.alertId}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Risk Score:</span>
                    <p className="text-lg font-semibold">{selectedAlert.riskScore}/100</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Description:</span>
                    <Streamdown>{selectedAlert.description}</Streamdown>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-500">From:</span>
                      <p className="font-mono text-xs break-all">{selectedAlert.from}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">To:</span>
                      <p className="font-mono text-xs break-all">{selectedAlert.to}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button className="flex-1 bg-green-600 hover:bg-green-700">
                      Mark as Resolved
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Escalate
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
