import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Clock, AlertTriangle, Zap } from 'lucide-react';

interface Command {
  id: string;
  component: string;
  command: string;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  timestamp: Date;
  result?: string;
  error?: string;
}

interface ComponentStatus {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'degraded';
  health: number;
  lastCommand?: string;
}

export default function CommanderZK9() {
  const [commands, setCommands] = useState<Command[]>([]);
  const [componentStatuses, setComponentStatuses] = useState<ComponentStatus[]>([
    { id: 'sovereign', name: 'Sovereign OS', status: 'online', health: 95 },
    { id: 'aegentis', name: 'Aegentis Engine', status: 'online', health: 92 },
    { id: 'pantheon', name: 'Pantheon Deploy', status: 'online', health: 88 },
    { id: 'gold-dome', name: 'Gold Dome', status: 'online', health: 90 },
    { id: 'aura', name: 'Aura Commander', status: 'online', health: 94 },
    { id: 'resolute', name: 'ResoluteDesk', status: 'online', health: 91 },
    { id: 'sovereign-meta', name: 'Sovereign Meta', status: 'online', health: 89 },
    { id: 'tsl-minter', name: 'TSL Minter', status: 'online', health: 96 },
  ]);

  const [selectedComponent, setSelectedComponent] = useState<string>('sovereign');
  const [commandInput, setCommandInput] = useState<string>('');
  const [isExecuting, setIsExecuting] = useState(false);

  const executeCommand = async () => {
    if (!commandInput.trim()) return;

    const newCommand: Command = {
      id: `cmd-${Date.now()}`,
      component: selectedComponent,
      command: commandInput,
      status: 'pending',
      timestamp: new Date(),
    };

    setCommands((prev) => [newCommand, ...prev]);
    setIsExecuting(true);

    try {
      // Simulate command execution
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setCommands((prev) =>
        prev.map((cmd) =>
          cmd.id === newCommand.id
            ? {
                ...cmd,
                status: 'completed',
                result: JSON.stringify({
                  message: `Command executed successfully on ${selectedComponent}`,
                  timestamp: new Date().toISOString(),
                }),
              }
            : cmd
        )
      );

      // Update component last command
      setComponentStatuses((prev) =>
        prev.map((comp) =>
          comp.id === selectedComponent
            ? { ...comp, lastCommand: commandInput }
            : comp
        )
      );

      setCommandInput('');
    } catch (error) {
      setCommands((prev) =>
        prev.map((cmd) =>
          cmd.id === newCommand.id
            ? {
                ...cmd,
                status: 'failed',
                error: `Failed to execute command: ${error}`,
              }
            : cmd
        )
      );
    } finally {
      setIsExecuting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'degraded':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'offline':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getCommandStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'executing':
        return <Clock className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-gray-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">COMMANDER-ZK9</h1>
        <p className="text-gray-500">Unified command interface for Sovereign System</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Component Status Panel */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              System Components
            </CardTitle>
            <CardDescription>Real-time component health</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {componentStatuses.map((comp) => (
              <button
                key={comp.id}
                onClick={() => setSelectedComponent(comp.id)}
                className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                  selectedComponent === comp.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm">{comp.name}</span>
                  {getStatusIcon(comp.status)}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        comp.health >= 80
                          ? 'bg-green-500'
                          : comp.health >= 60
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${comp.health}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono text-gray-600">{comp.health}%</span>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Command Interface */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Command Interface</CardTitle>
            <CardDescription>
              Execute commands on {componentStatuses.find((c) => c.id === selectedComponent)?.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Command</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter command..."
                  value={commandInput}
                  onChange={(e) => setCommandInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && executeCommand()}
                  disabled={isExecuting}
                />
                <Button
                  onClick={executeCommand}
                  disabled={isExecuting || !commandInput.trim()}
                  className="px-6"
                >
                  {isExecuting ? 'Executing...' : 'Execute'}
                </Button>
              </div>
            </div>

            {/* Command History */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Command History</label>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {commands.length === 0 ? (
                  <p className="text-sm text-gray-500 py-4 text-center">No commands executed yet</p>
                ) : (
                  commands.map((cmd) => (
                    <div
                      key={cmd.id}
                      className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2 flex-1">
                          {getCommandStatusIcon(cmd.status)}
                          <div className="flex-1 min-w-0">
                            <p className="font-mono text-sm truncate">{cmd.command}</p>
                            <p className="text-xs text-gray-500">
                              {cmd.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant={
                            cmd.status === 'completed'
                              ? 'default'
                              : cmd.status === 'failed'
                              ? 'destructive'
                              : 'secondary'
                          }
                        >
                          {cmd.status}
                        </Badge>
                      </div>
                      {cmd.result && (
                        <div className="text-xs bg-white p-2 rounded border border-gray-200 overflow-x-auto whitespace-pre-wrap font-mono">
                          {cmd.result}
                        </div>
                      )}
                      {cmd.error && (
                        <p className="text-xs text-red-600 bg-red-50 p-2 rounded">{cmd.error}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Overview */}
      <Card>
        <CardHeader>
          <CardTitle>System Overview</CardTitle>
          <CardDescription>Complete system metrics and status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-600">Online Components</p>
              <p className="text-2xl font-bold text-blue-600">
                {componentStatuses.filter((c) => c.status === 'online').length}
              </p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-sm text-gray-600">Degraded</p>
              <p className="text-2xl font-bold text-yellow-600">
                {componentStatuses.filter((c) => c.status === 'degraded').length}
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-gray-600">Avg Health</p>
              <p className="text-2xl font-bold text-green-600">
                {Math.round(
                  componentStatuses.reduce((sum, c) => sum + c.health, 0) /
                    componentStatuses.length
                )}
                %
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-sm text-gray-600">Commands Executed</p>
              <p className="text-2xl font-bold text-purple-600">{commands.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
