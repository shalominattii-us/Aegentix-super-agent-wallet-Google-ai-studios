/**
 * SOVEREIGN AGENTIC DEBUGGER
 * 
 * Real-time debugging and fine-tuning interface for Gentis AI.
 * Allows operators to monitor decisions, replay interactions,
 * adjust parameters, and trigger manual healing.
 */

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { Link } from 'wouter';

export default function AgenticDebugger() {
  const { user } = useAuth();
  const [healingSubsystem, setHealingSubsystem] = useState('vr_sessions');
  const [healingAction, setHealingAction] = useState('restart');
  const [gentisInput, setGentisInput] = useState('');
  const [gentisResponse, setGentisResponse] = useState<any>(null);

  const systemStatus = trpc.vr.status.useQuery(undefined, { refetchInterval: 5000 });
  const healingStatus = trpc.vr.healing.status.useQuery(undefined, { refetchInterval: 5000 });
  const gentisMetrics = trpc.vr.gentis.getMetrics.useQuery(undefined, { refetchInterval: 5000 });

  const healMutation = trpc.vr.healing.heal.useMutation();
  const gentisMutation = trpc.vr.gentis.message.useMutation();

  const subsystems = ['vr_sessions', 'gentis_ai', 'geogentic', 'agent_mesh', 'arbitration', 'diplomacy', 'metrics', 'websocket', 'database', 'cache'] as const;
  const actions = ['restart', 'rollback', 'isolate', 'escalate', 'circuit_break', 'failover'] as const;

  const handleHeal = async () => {
    try {
      await healMutation.mutateAsync({
        subsystem: healingSubsystem as any,
        action: healingAction as any,
        severity: 'medium',
        reason: `Manual trigger from debugger by ${user?.name || 'operator'}`
      });
    } catch (e) {
      console.error('Healing failed:', e);
    }
  };

  const handleGentisTest = async () => {
    if (!gentisInput.trim()) return;
    try {
      const response = await gentisMutation.mutateAsync({
        sessionId: 'debug-session',
        content: gentisInput
      });
      setGentisResponse(response);
    } catch (e) {
      setGentisResponse({ error: String(e) });
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white">
      {/* Header */}
      <div className="border-b border-cyan-900/30 bg-black/40 backdrop-blur-sm">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <span className="text-cyan-400 font-mono text-sm cursor-pointer hover:text-cyan-300">← PORTAL</span>
            </Link>
            <h1 className="text-lg font-mono font-bold text-white">AGENTIC DEBUGGER</h1>
            <span className="text-xs font-mono text-red-400 px-2 py-0.5 border border-red-800 rounded bg-red-900/20">
              OPERATOR ONLY
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/vr/metrics">
              <Button variant="outline" className="border-cyan-700 text-cyan-400 hover:bg-cyan-900/30 font-mono text-xs">
                METRICS
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container py-6 space-y-6">
        {/* System Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-black/40 border-cyan-800 p-4">
            <div className="text-xs font-mono text-gray-500 mb-1">SYSTEM HEALTH</div>
            <div className={`text-xl font-mono font-bold ${
              systemStatus.data?.health?.status === 'healthy' ? 'text-green-400' : 'text-yellow-400'
            }`}>
              {systemStatus.data?.health?.status?.toUpperCase() || 'LOADING'}
            </div>
            <div className="text-xs font-mono text-gray-400 mt-2">
              Healthy: {systemStatus.data?.health?.healthy || 0} | 
              Degraded: {systemStatus.data?.health?.degraded || 0} | 
              Critical: {systemStatus.data?.health?.critical || 0}
            </div>
          </Card>
          <Card className="bg-black/40 border-purple-800 p-4">
            <div className="text-xs font-mono text-gray-500 mb-1">GENTIS METRICS BUFFER</div>
            <div className="text-xl font-mono font-bold text-purple-400">
              {gentisMetrics.data?.length || 0}
            </div>
            <div className="text-xs font-mono text-gray-400 mt-2">
              Buffered decision records
            </div>
          </Card>
          <Card className="bg-black/40 border-green-800 p-4">
            <div className="text-xs font-mono text-gray-500 mb-1">CIRCUIT BREAKERS</div>
            <div className="text-xl font-mono font-bold text-green-400">
              {healingStatus.data?.circuitBreakers?.filter((cb: any) => cb.isOpen).length || 0} OPEN
            </div>
            <div className="text-xs font-mono text-gray-400 mt-2">
              of {healingStatus.data?.circuitBreakers?.length || 0} total
            </div>
          </Card>
        </div>

        {/* Manual Healing Controls */}
        <Card className="bg-black/40 border-red-900/50 p-6">
          <h2 className="text-sm font-mono text-red-400 font-bold mb-4">MANUAL HEALING CONTROLS</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-mono text-gray-400 block mb-2">SUBSYSTEM</label>
              <select
                value={healingSubsystem}
                onChange={e => setHealingSubsystem(e.target.value)}
                className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-sm font-mono text-white"
              >
                {subsystems.map(s => (
                  <option key={s} value={s}>{s.replace('_', ' ').toUpperCase()}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-mono text-gray-400 block mb-2">ACTION</label>
              <select
                value={healingAction}
                onChange={e => setHealingAction(e.target.value)}
                className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-sm font-mono text-white"
              >
                {actions.map(a => (
                  <option key={a} value={a}>{a.replace('_', ' ').toUpperCase()}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleHeal}
                disabled={healMutation.isPending}
                className="w-full bg-red-700 hover:bg-red-600 text-white font-mono"
              >
                {healMutation.isPending ? 'EXECUTING...' : 'EXECUTE HEAL'}
              </Button>
            </div>
          </div>
          {healMutation.data && (
            <div className="mt-4 p-3 bg-green-900/20 border border-green-800 rounded text-xs font-mono text-green-400">
              ✓ {healMutation.data.result}
            </div>
          )}
        </Card>

        {/* Gentis AI Testing */}
        <Card className="bg-black/40 border-purple-900/50 p-6">
          <h2 className="text-sm font-mono text-purple-400 font-bold mb-4">GENTIS AI INTERACTION TEST</h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={gentisInput}
              onChange={e => setGentisInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleGentisTest()}
              placeholder="Enter command for Gentis AI..."
              className="flex-1 bg-black border border-gray-700 rounded px-4 py-2 text-sm font-mono text-white placeholder:text-gray-600"
            />
            <Button
              onClick={handleGentisTest}
              disabled={gentisMutation.isPending}
              className="bg-purple-700 hover:bg-purple-600 text-white font-mono"
            >
              {gentisMutation.isPending ? 'PROCESSING...' : 'SEND'}
            </Button>
          </div>
          {gentisResponse && (
            <div className="mt-4 p-4 bg-gray-900/50 border border-gray-700 rounded">
              <pre className="text-xs font-mono text-gray-300 whitespace-pre-wrap overflow-auto max-h-64">
                {JSON.stringify(gentisResponse, null, 2)}
              </pre>
            </div>
          )}
        </Card>

        {/* Circuit Breaker Status */}
        <Card className="bg-black/40 border-gray-800 p-6">
          <h2 className="text-sm font-mono text-cyan-400 font-bold mb-4">CIRCUIT BREAKER STATUS</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {(healingStatus.data?.circuitBreakers || []).map((cb: any) => (
              <div key={cb.subsystem} className={`p-3 rounded border ${
                cb.isOpen ? 'border-red-800 bg-red-900/10' : 'border-green-800 bg-green-900/10'
              }`}>
                <div className="text-xs font-mono text-gray-400">{cb.subsystem.replace('_', ' ')}</div>
                <div className={`text-sm font-mono font-bold mt-1 ${
                  cb.isOpen ? 'text-red-400' : 'text-green-400'
                }`}>
                  {cb.isOpen ? 'OPEN' : 'CLOSED'}
                </div>
                <div className="text-xs font-mono text-gray-600 mt-1">
                  Failures: {cb.failureCount}/{cb.failureThreshold}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
