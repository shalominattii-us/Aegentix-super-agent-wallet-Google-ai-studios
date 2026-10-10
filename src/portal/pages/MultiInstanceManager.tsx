import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Plus, Trash2, Settings, Play, Pause, Copy, Server } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

interface Instance {
  id: string;
  name: string;
  harness: string;
  status: "running" | "stopped" | "error";
  deployment: string;
  endpoints: number;
  uptime: string;
  lastHealthCheck: string;
  cpu: number;
  memory: number;
}

const mockInstances: Instance[] = [
  {
    id: "inst-001",
    name: "Primary Installation Harness",
    harness: "Installation Validation",
    status: "running",
    deployment: "Production",
    endpoints: 24,
    uptime: "12h 34m",
    lastHealthCheck: "2 min ago",
    cpu: 15,
    memory: 42,
  },
  {
    id: "inst-002",
    name: "Secondary Installation Harness",
    harness: "Installation Validation",
    status: "running",
    deployment: "Production",
    endpoints: 24,
    uptime: "12h 32m",
    lastHealthCheck: "1 min ago",
    cpu: 12,
    memory: 38,
  },
  {
    id: "inst-003",
    name: "Operational Integrity - Instance 1",
    harness: "Operational Integrity",
    status: "running",
    deployment: "Production",
    endpoints: 18,
    uptime: "14h 22m",
    lastHealthCheck: "30 sec ago",
    cpu: 22,
    memory: 56,
  },
  {
    id: "inst-004",
    name: "Operational Integrity - Instance 2",
    harness: "Operational Integrity",
    status: "running",
    deployment: "Staging",
    endpoints: 18,
    uptime: "8h 15m",
    lastHealthCheck: "45 sec ago",
    cpu: 18,
    memory: 48,
  },
  {
    id: "inst-005",
    name: "Security Validation - Primary",
    harness: "Security Validation",
    status: "running",
    deployment: "Production",
    endpoints: 22,
    uptime: "11h 45m",
    lastHealthCheck: "1 min ago",
    cpu: 28,
    memory: 64,
  },
  {
    id: "inst-006",
    name: "Security Validation - Secondary",
    harness: "Security Validation",
    status: "stopped",
    deployment: "Staging",
    endpoints: 22,
    uptime: "0h 0m",
    lastHealthCheck: "2h 15m ago",
    cpu: 0,
    memory: 0,
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "running":
      return "text-green-500";
    case "stopped":
      return "text-gray-500";
    case "error":
      return "text-red-500";
    default:
      return "text-gray-500";
  }
};

const getStatusBgColor = (status: string) => {
  switch (status) {
    case "running":
      return "bg-green-500/10 border-green-500/30";
    case "stopped":
      return "bg-gray-500/10 border-gray-500/30";
    case "error":
      return "bg-red-500/10 border-red-500/30";
    default:
      return "bg-gray-500/10 border-gray-500/30";
  }
};

export default function MultiInstanceManager() {
  const [selectedInstance, setSelectedInstance] = useState<string | null>(null);
  const [filterDeployment, setFilterDeployment] = useState<string | null>(null);

  const deployments = Array.from(new Set(mockInstances.map(i => i.deployment)));
  const filteredInstances = filterDeployment
    ? mockInstances.filter(i => i.deployment === filterDeployment)
    : mockInstances;

  const runningCount = mockInstances.filter(i => i.status === "running").length;
  const stoppedCount = mockInstances.filter(i => i.status === "stopped").length;
  const totalEndpoints = mockInstances.reduce((sum, i) => sum + i.endpoints, 0);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-card/80 backdrop-blur border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
          <h1 className="text-lg font-bold">MULTI-INSTANCE MANAGER</h1>
          <Button size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            New Instance
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-b from-primary/10 to-background">
          <div className="container">
            <div className="flex items-center gap-3 mb-4">
              <Server className="w-8 h-8 text-accent" />
              <h1 className="text-5xl font-bold">Multi-Instance Manager</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Deploy, monitor, and manage multiple test harness instances across production and staging environments.
            </p>
          </div>
        </section>

        <div className="container py-16 space-y-12">
          {/* Summary Metrics */}
          <section>
            <h2 className="text-3xl font-bold mb-6">Deployment Summary</h2>
            <div className="grid md:grid-cols-4 gap-4">
              <Card className="bg-card border-border p-6">
                <p className="text-sm text-muted-foreground mb-2">Total Instances</p>
                <p className="text-4xl font-bold text-accent">{mockInstances.length}</p>
              </Card>

              <Card className="bg-card border-border p-6">
                <p className="text-sm text-muted-foreground mb-2">Running</p>
                <p className="text-4xl font-bold text-green-500">{runningCount}</p>
              </Card>

              <Card className="bg-card border-border p-6">
                <p className="text-sm text-muted-foreground mb-2">Stopped</p>
                <p className="text-4xl font-bold text-gray-500">{stoppedCount}</p>
              </Card>

              <Card className="bg-card border-border p-6">
                <p className="text-sm text-muted-foreground mb-2">Total Endpoints</p>
                <p className="text-4xl font-bold text-accent">{totalEndpoints}</p>
              </Card>
            </div>
          </section>

          {/* Deployment Filter */}
          <section>
            <h2 className="text-3xl font-bold mb-6">Filter by Deployment</h2>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filterDeployment === null ? "default" : "outline"}
                onClick={() => setFilterDeployment(null)}
              >
                All ({mockInstances.length})
              </Button>
              {deployments.map(dep => (
                <Button
                  key={dep}
                  variant={filterDeployment === dep ? "default" : "outline"}
                  onClick={() => setFilterDeployment(dep)}
                >
                  {dep} ({mockInstances.filter(i => i.deployment === dep).length})
                </Button>
              ))}
            </div>
          </section>

          {/* Instances Grid */}
          <section>
            <h2 className="text-3xl font-bold mb-6">Instances ({filteredInstances.length})</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {filteredInstances.map((instance) => (
                <Card
                  key={instance.id}
                  className={`bg-card border-border p-6 cursor-pointer transition hover:border-accent ${
                    selectedInstance === instance.id ? "border-accent" : ""
                  }`}
                  onClick={() => setSelectedInstance(selectedInstance === instance.id ? null : instance.id)}
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-1">{instance.name}</h3>
                        <p className="text-sm text-muted-foreground">{instance.harness}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded text-xs font-bold uppercase ${getStatusBgColor(
                          instance.status
                        )} ${getStatusColor(instance.status)}`}
                      >
                        {instance.status}
                      </span>
                    </div>

                    {/* Deployment Info */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Deployment:</span>
                      <span className="text-accent font-mono">{instance.deployment}</span>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border">
                      <div>
                        <p className="text-xs text-muted-foreground">Endpoints</p>
                        <p className="text-lg font-bold text-accent">{instance.endpoints}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Uptime</p>
                        <p className="text-lg font-bold text-accent">{instance.uptime}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Health</p>
                        <p className="text-xs text-muted-foreground">{instance.lastHealthCheck}</p>
                      </div>
                    </div>

                    {/* Resource Usage */}
                    <div className="space-y-2 pt-3 border-t border-border">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-muted-foreground">CPU</span>
                          <span className="text-xs text-accent">{instance.cpu}%</span>
                        </div>
                        <div className="w-full bg-black rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-accent h-full"
                            style={{ width: `${instance.cpu}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-muted-foreground">Memory</span>
                          <span className="text-xs text-accent">{instance.memory}%</span>
                        </div>
                        <div className="w-full bg-black rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-accent h-full"
                            style={{ width: `${instance.memory}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-3 border-t border-border">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 gap-2"
                        disabled={instance.status === "running"}
                      >
                        <Play className="w-4 h-4" />
                        Start
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 gap-2"
                        disabled={instance.status === "stopped"}
                      >
                        <Pause className="w-4 h-4" />
                        Stop
                      </Button>
                      <Button size="sm" variant="outline" className="gap-2">
                        <Settings className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="gap-2">
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Expanded Details */}
                    {selectedInstance === instance.id && (
                      <div className="pt-4 border-t border-border space-y-4">
                        <div className="bg-black p-4 rounded">
                          <p className="text-sm font-bold mb-3 text-accent">Instance Details</p>
                          <div className="space-y-2 text-xs font-mono text-muted-foreground">
                            <div className="flex justify-between">
                              <span>Instance ID:</span>
                              <span className="text-accent">{instance.id}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Harness Type:</span>
                              <span className="text-accent">{instance.harness}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Deployment:</span>
                              <span className="text-accent">{instance.deployment}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Last Health Check:</span>
                              <span className="text-accent">{instance.lastHealthCheck}</span>
                            </div>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <Button className="gap-2">
                            <Settings className="w-4 h-4" />
                            Configure
                          </Button>
                          <Button variant="outline" className="gap-2">
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Deployment Strategies */}
          <section>
            <h2 className="text-3xl font-bold mb-6">Deployment Strategies</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-card border-border p-6">
                <h3 className="font-bold text-lg mb-4">Production Deployment</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• High availability configuration</li>
                  <li>• Load balancing across instances</li>
                  <li>• Automated failover</li>
                  <li>• Real-time monitoring</li>
                  <li>• 99.99% uptime SLA</li>
                </ul>
              </Card>

              <Card className="bg-card border-border p-6">
                <h3 className="font-bold text-lg mb-4">Staging Deployment</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Test environment isolation</li>
                  <li>• Canary deployments</li>
                  <li>• Performance benchmarking</li>
                  <li>• Integration testing</li>
                  <li>• Pre-production validation</li>
                </ul>
              </Card>

              <Card className="bg-card border-border p-6">
                <h3 className="font-bold text-lg mb-4">Scaling Options</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Horizontal scaling</li>
                  <li>• Vertical resource allocation</li>
                  <li>• Auto-scaling policies</li>
                  <li>• Load distribution</li>
                  <li>• Resource optimization</li>
                </ul>
              </Card>

              <Card className="bg-card border-border p-6">
                <h3 className="font-bold text-lg mb-4">Monitoring & Alerts</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Real-time metrics</li>
                  <li>• Health checks</li>
                  <li>• Alert thresholds</li>
                  <li>• Incident response</li>
                  <li>• Performance analytics</li>
                </ul>
              </Card>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
