import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Agent {
  id: string;
  name: string;
  type: string;
  capabilities: string[];
  status: 'active' | 'inactive' | 'suspended';
  integrity_score: number;
  approvals_required: number;
  last_action: string | null;
  created_at: string;
  metadata: Record<string, any>;
}

interface AgentAction {
  action_id: string;
  agent_id: string;
  agent_name: string;
  action_type: string;
  payload: Record<string, any>;
  integrity_score: number;
  risk_level: 'low' | 'medium' | 'high';
  timestamp: string;
  status: 'pending_approval' | 'approved' | 'rejected' | 'executed';
}

interface LedgerEntry {
  index: number;
  timestamp: string;
  event: Record<string, any>;
  prevHash: string;
  hash: string;
}

export default function GoldDomeAgents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [pendingActions, setPendingActions] = useState<AgentAction[]>([]);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE = process.env.VITE_GOLD_DOME_API || 'http://localhost:3001/api/gold-dome';

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  async function loadData() {
    try {
      const [agentsRes, actionsRes, ledgerRes] = await Promise.all([
        fetch(`${API_BASE}/agents`),
        fetch(`${API_BASE}/agents/actions/pending`),
        fetch(`${API_BASE}/ledger?limit=50`),
      ]);

      if (!agentsRes.ok || !actionsRes.ok || !ledgerRes.ok) throw new Error('API error');

      setAgents(await agentsRes.json());
      setPendingActions(await actionsRes.json());
      setLedger(await ledgerRes.json());
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  async function approveAction(actionId: string) {
    try {
      const res = await fetch(`${API_BASE}/agents/action/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action_id: actionId,
          executor: 'portal-executive',
          reason: 'Approved via Portal',
        }),
      });
      if (!res.ok) throw new Error('Approval failed');
      loadData();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Approval failed');
    }
  }

  async function rejectAction(actionId: string) {
    try {
      const res = await fetch(`${API_BASE}/agents/action/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action_id: actionId,
          executor: 'portal-executive',
          reason: 'Rejected via Portal',
        }),
      });
      if (!res.ok) throw new Error('Rejection failed');
      loadData();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Rejection failed');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading Gold Dome Agents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">🏛️ Gold Dome Agents</h1>
          <p className="text-text-secondary">Executive Control Panel — Aura AI + ResoluteDesk Integration</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-700 rounded-lg text-red-200">
            {error}
          </div>
        )}

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-text-secondary">Active Agents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">{agents.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-text-secondary">Pending Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">{pendingActions.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-text-secondary">Ledger Entries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">{ledger.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-text-secondary">System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">✓ LIVE</div>
            </CardContent>
          </Card>
        </div>

        {/* Agents Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Registered Agents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {agents.map((agent) => (
              <Card key={agent.id} className="hover:border-accent transition-colors">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{agent.name}</CardTitle>
                    <Badge variant={agent.status === 'active' ? 'default' : 'secondary'}>
                      {agent.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-text-secondary mb-1">Type</p>
                    <p className="font-mono text-sm">{agent.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary mb-1">Integrity Score</p>
                    <div className="w-full bg-background rounded-full h-2">
                      <div
                        className="bg-accent h-2 rounded-full transition-all"
                        style={{ width: `${agent.integrity_score}%` }}
                      />
                    </div>
                    <p className="text-sm mt-1">{agent.integrity_score}/100</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary mb-2">Capabilities</p>
                    <div className="flex flex-wrap gap-1">
                      {agent.capabilities.slice(0, 3).map((cap) => (
                        <Badge key={cap} variant="outline" className="text-xs">
                          {cap}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Pending Actions */}
        {pendingActions.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Pending Actions</h2>
            <div className="space-y-4">
              {pendingActions.map((action) => (
                <Card key={action.action_id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg">{action.agent_name}</h3>
                        <p className="text-sm text-text-secondary">{action.action_type}</p>
                        <div className="mt-2 flex gap-2">
                          <Badge variant="outline">{action.risk_level}</Badge>
                          <Badge variant="outline">Integrity: {action.integrity_score}</Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-accent hover:bg-accent/90"
                          onClick={() => approveAction(action.action_id)}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => rejectAction(action.action_id)}
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                    <div className="bg-background p-3 rounded text-sm font-mono text-text-secondary overflow-auto max-h-32">
                      {JSON.stringify(action.payload, null, 2)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Ledger */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Governance Ledger</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {ledger.length === 0 ? (
                  <p className="text-text-secondary">No ledger entries yet</p>
                ) : (
                  ledger.map((entry) => (
                    <div key={entry.index} className="p-3 bg-background rounded border border-border text-sm">
                      <div className="flex justify-between mb-1">
                        <span className="font-bold text-accent">{entry.event.type}</span>
                        <span className="text-text-secondary text-xs">
                          {new Date(entry.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="text-text-secondary text-xs">
                        Agent: {entry.event.agent || 'N/A'} | Integrity: {entry.event.integrity || 'N/A'}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
