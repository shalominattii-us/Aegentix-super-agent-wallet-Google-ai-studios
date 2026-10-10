import { useEffect, useState } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Zap } from 'lucide-react';
import { getAEGENTIS, useAEGENTISIdentity } from '@/lib/aegentis';

interface HealthMetrics {
  drift: number;
  seal: 'GREEN' | 'YELLOW' | 'RED';
  nodes: number;
  headTx: string;
  uptime: number;
  txLag: number;
}

export function Identity() {
  const { user, isAuthenticated } = useAuth();
  const { identity, loading: identityLoading, error: identityError } = useAEGENTISIdentity();
  const [health, setHealth] = useState<HealthMetrics>({
    drift: 0,
    seal: 'GREEN',
    nodes: 1,
    headTx: 'local_mock_tx_001',
    uptime: 0,
    txLag: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wsConnected, setWsConnected] = useState(false);

  // Set JWT token when user authenticates
  useEffect(() => {
    if (isAuthenticated && user) {
      try {
        const aegentis = getAEGENTIS();
        // In production, get JWT from OAuth context
        const token = localStorage.getItem('auth_token') || 'mock_jwt_token';
        aegentis.setJWT(token);
        setLoading(false);
      } catch (err) {
        console.error('[Identity] Failed to set JWT:', err);
        setError('Failed to initialize AEGENTIS client');
        setLoading(false);
      }
    }
  }, [isAuthenticated, user]);

  // WebSocket for live health metrics
  useEffect(() => {
    if (!isAuthenticated) return;

    try {
      const aegentis = getAEGENTIS();
      aegentis.connectStream(
        (event: any) => {
          try {
            if (event.type === 'event' && event.data) {
              const data = event.data;
              setHealth((prev) => ({
                ...prev,
                drift: data.drift || prev.drift,
                seal: data.seal || prev.seal,
                nodes: data.nodes || prev.nodes,
                headTx: data.head_tx || prev.headTx,
              }));
            }
          } catch (err) {
            console.error('[Identity] Failed to parse event:', err);
          }
        },
        (err: any) => {
          console.error('[Identity] WebSocket error:', err);
          setWsConnected(false);
        }
      );
      setWsConnected(true);

      return () => {
        aegentis.disconnectStream();
      };
    } catch (err) {
      console.error('[Identity] Failed to connect to WebSocket:', err);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="p-8 max-w-md">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="text-muted-foreground">Please log in to view your identity.</p>
        </Card>
      </div>
    );
  }

  if (loading || identityLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="p-8 max-w-md">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded mb-4"></div>
            <div className="h-4 bg-muted rounded mb-2"></div>
            <div className="h-4 bg-muted rounded"></div>
          </div>
        </Card>
      </div>
    );
  }

  if (error || identityError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="p-8 max-w-md border-red-500">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="text-red-500" />
            <h1 className="text-2xl font-bold">Error</h1>
          </div>
          <p className="text-muted-foreground">{error || (identityError instanceof Error ? identityError.message : identityError) || 'Unknown error'}</p>
        </Card>
      </div>
    );
  }

  const getAuthorityColor = (authority: string) => {
    switch (authority) {
      case 'SOVEREIGN':
        return 'bg-yellow-500';
      case 'ADMIN':
        return 'bg-purple-500';
      case 'OPERATOR':
        return 'bg-blue-500';
      case 'OBSERVER':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getSealColor = (seal: string) => {
    switch (seal) {
      case 'GREEN':
        return 'text-green-500';
      case 'YELLOW':
        return 'text-yellow-500';
      case 'RED':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getDriftStatus = (drift: number) => {
    if (drift < 5) return { status: 'Optimal', color: 'text-green-500' };
    if (drift < 16) return { status: 'Good', color: 'text-blue-500' };
    if (drift < 32) return { status: 'Degraded', color: 'text-yellow-500' };
    return { status: 'Critical', color: 'text-red-500' };
  };

  const driftStatus = getDriftStatus(health.drift);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Sovereign Identity</h1>
          <p className="text-muted-foreground">Live AEGENTIS operational status and authority</p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Operator Authority Card */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Operator Authority</h2>
              <div
                className={`w-3 h-3 rounded-full ${getAuthorityColor(
                  identity?.authority || 'OBSERVER'
                )}`}
              ></div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">
                {identity?.authority || 'UNKNOWN'}
              </div>
              <p className="text-sm text-muted-foreground">
                Authority Mode: {identity?.authority || 'N/A'}
              </p>
            </div>
          </Card>

          {/* Seal Status Card */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Seal Status</h2>
              <CheckCircle className={`w-5 h-5 ${getSealColor(health.seal)}`} />
            </div>
            <div className="space-y-2">
              <div className={`text-3xl font-bold ${getSealColor(health.seal)}`}>
                {health.seal}
              </div>
              <p className="text-sm text-muted-foreground">
                {health.seal === 'GREEN'
                  ? 'System operational'
                  : health.seal === 'YELLOW'
                    ? 'Degraded performance'
                    : 'Critical alert'}
              </p>
            </div>
          </Card>

          {/* Drift Metrics Card */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Continuity Drift</h2>
              <Zap className={`w-5 h-5 ${driftStatus.color}`} />
            </div>
            <div className="space-y-2">
              <div className={`text-3xl font-bold ${driftStatus.color}`}>
                {health.drift.toFixed(1)}ms
              </div>
              <p className="text-sm text-muted-foreground">{driftStatus.status}</p>
            </div>
          </Card>

          {/* Node Count Card */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Cluster Nodes</h2>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">{health.nodes}</div>
              <p className="text-sm text-muted-foreground">
                {health.nodes === 1 ? 'Single node' : `${health.nodes}-node cluster`}
              </p>
            </div>
          </Card>

          {/* TX Lag Card */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Transaction Lag</h2>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">{health.txLag}ms</div>
              <p className="text-sm text-muted-foreground">Average latency</p>
            </div>
          </Card>

          {/* Uptime Card */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Uptime</h2>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">
                {Math.floor(health.uptime / 3600)}h {Math.floor((health.uptime % 3600) / 60)}m
              </div>
              <p className="text-sm text-muted-foreground">Continuous operation</p>
            </div>
          </Card>
        </div>

        {/* Live Data Section */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Live Transaction Stream</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Head Transaction</span>
              <code className="bg-muted px-3 py-1 rounded font-mono text-sm">
                {health.headTx}
              </code>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">WebSocket Status</span>
              <Badge variant={wsConnected ? 'default' : 'destructive'}>
                {wsConnected ? 'Connected' : 'Disconnected'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">AEGENTIS Seal</span>
              <Badge variant="outline">{identity?.seal || 'UNKNOWN'}</Badge>
            </div>
          </div>
        </Card>

        {/* Identity Details */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Identity Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Current User</p>
              <p className="font-mono">{user?.email || 'Anonymous'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Authority Mode</p>
              <p className="font-mono">{identity?.authority || 'OBSERVER'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Core System</p>
              <p className="font-mono">AEGENTIS (cogn8tives gateway)</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Portal Mode</p>
              <p className="font-mono">2D Dashboard + WebXR</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Head Transaction</p>
              <p className="font-mono text-xs">{health.headTx}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">System Drift</p>
              <p className="font-mono">{health.drift.toFixed(2)}ms</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Identity;
