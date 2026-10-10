import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Play, Pause, RotateCcw, Activity, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

interface HarnessInstance {
  id: string;
  name: string;
  status: "running" | "paused" | "idle" | "error";
  progress: number;
  endpoints: number;
  testsRun: number;
  testsPassed: number;
  testsFailed: number;
  uptime: string;
  lastRun: string;
}

const mockHarnessInstances: HarnessInstance[] = [
  {
    id: "harness-001",
    name: "Installation Validation Harness",
    status: "running",
    progress: 78,
    endpoints: 24,
    testsRun: 156,
    testsPassed: 152,
    testsFailed: 4,
    uptime: "12h 34m",
    lastRun: "2026-05-02 19:15:00 UTC",
  },
  {
    id: "harness-002",
    name: "Operational Integrity Harness",
    status: "running",
    progress: 92,
    endpoints: 18,
    testsRun: 234,
    testsPassed: 234,
    testsFailed: 0,
    uptime: "14h 22m",
    lastRun: "2026-05-02 19:12:00 UTC",
  },
  {
    id: "harness-003",
    name: "Uninstallation Verification Harness",
    status: "idle",
    progress: 0,
    endpoints: 16,
    testsRun: 89,
    testsPassed: 89,
    testsFailed: 0,
    uptime: "0h 0m",
    lastRun: "2026-05-02 18:45:00 UTC",
  },
  {
    id: "harness-004",
    name: "Portal Integration Harness",
    status: "running",
    progress: 45,
    endpoints: 32,
    testsRun: 78,
    testsPassed: 74,
    testsFailed: 4,
    uptime: "8h 15m",
    lastRun: "2026-05-02 19:18:00 UTC",
  },
  {
    id: "harness-005",
    name: "API Compliance Harness",
    status: "paused",
    progress: 62,
    endpoints: 28,
    testsRun: 145,
    testsPassed: 143,
    testsFailed: 2,
    uptime: "6h 30m",
    lastRun: "2026-05-02 19:10:00 UTC",
  },
  {
    id: "harness-006",
    name: "Security Validation Harness",
    status: "running",
    progress: 88,
    endpoints: 22,
    testsRun: 198,
    testsPassed: 195,
    testsFailed: 3,
    uptime: "11h 45m",
    lastRun: "2026-05-02 19:16:00 UTC",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "running":
      return "text-green-500";
    case "paused":
      return "text-yellow-500";
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
    case "paused":
      return "bg-yellow-500/10 border-yellow-500/30";
    case "error":
      return "bg-red-500/10 border-red-500/30";
    default:
      return "bg-gray-500/10 border-gray-500/30";
  }
};

export default function TestHarnessDashboard() {
  const [selectedHarness, setSelectedHarness] = useState<string | null>(null);

  const totalEndpoints = mockHarnessInstances.reduce((sum, h) => sum + h.endpoints, 0);
  const totalTests = mockHarnessInstances.reduce((sum, h) => sum + h.testsRun, 0);
  const totalPassed = mockHarnessInstances.reduce((sum, h) => sum + h.testsPassed, 0);
  const totalFailed = mockHarnessInstances.reduce((sum, h) => sum + h.testsFailed, 0);
  const passRate = ((totalPassed / totalTests) * 100).toFixed(1);

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
          <h1 className="text-lg font-bold">TEST HARNESS DASHBOARD</h1>
          <div className="w-20"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-b from-primary/10 to-background">
          <div className="container">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-8 h-8 text-accent" />
              <h1 className="text-5xl font-bold">Test Harness Dashboard</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Monitor and manage multiple test harness instances with real-time status, endpoint tracking, and integrity verification.
            </p>
          </div>
        </section>

        <div className="container py-16 space-y-12">
          {/* Summary Metrics */}
          <section>
            <h2 className="text-3xl font-bold mb-6">System Summary</h2>
            <div className="grid md:grid-cols-4 gap-4">
              <Card className="bg-card border-border p-6">
                <p className="text-sm text-muted-foreground mb-2">Active Harnesses</p>
                <p className="text-4xl font-bold text-accent">
                  {mockHarnessInstances.filter(h => h.status === "running").length}
                </p>
                <p className="text-xs text-muted-foreground mt-2">of {mockHarnessInstances.length} total</p>
              </Card>

              <Card className="bg-card border-border p-6">
                <p className="text-sm text-muted-foreground mb-2">Total Endpoints</p>
                <p className="text-4xl font-bold text-accent">{totalEndpoints}</p>
                <p className="text-xs text-muted-foreground mt-2">across all harnesses</p>
              </Card>

              <Card className="bg-card border-border p-6">
                <p className="text-sm text-muted-foreground mb-2">Pass Rate</p>
                <p className="text-4xl font-bold text-green-500">{passRate}%</p>
                <p className="text-xs text-muted-foreground mt-2">{totalPassed}/{totalTests} tests</p>
              </Card>

              <Card className="bg-card border-border p-6">
                <p className="text-sm text-muted-foreground mb-2">Failed Tests</p>
                <p className="text-4xl font-bold text-red-500">{totalFailed}</p>
                <p className="text-xs text-muted-foreground mt-2">requiring attention</p>
              </Card>
            </div>
          </section>

          {/* Harness Instances */}
          <section>
            <h2 className="text-3xl font-bold mb-6">Test Harness Instances</h2>
            <div className="space-y-4">
              {mockHarnessInstances.map((harness) => (
                <Card
                  key={harness.id}
                  className={`bg-card border-border p-6 cursor-pointer transition hover:border-accent ${
                    selectedHarness === harness.id ? "border-accent" : ""
                  }`}
                  onClick={() => setSelectedHarness(selectedHarness === harness.id ? null : harness.id)}
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-lg">{harness.name}</h3>
                          <span
                            className={`px-3 py-1 rounded text-xs font-bold uppercase ${getStatusBgColor(
                              harness.status
                            )} ${getStatusColor(harness.status)}`}
                          >
                            {harness.status}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">ID: {harness.id}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Play className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Pause className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-foreground">Progress</span>
                        <span className="text-sm font-mono text-accent">{harness.progress}%</span>
                      </div>
                      <div className="w-full bg-black rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-accent h-full transition-all"
                          style={{ width: `${harness.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid md:grid-cols-6 gap-4 pt-4 border-t border-border">
                      <div>
                        <p className="text-xs text-muted-foreground">Endpoints</p>
                        <p className="text-lg font-bold text-accent">{harness.endpoints}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Tests Run</p>
                        <p className="text-lg font-bold text-accent">{harness.testsRun}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Passed</p>
                        <p className="text-lg font-bold text-green-500">{harness.testsPassed}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Failed</p>
                        <p className="text-lg font-bold text-red-500">{harness.testsFailed}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Uptime</p>
                        <p className="text-lg font-bold text-accent">{harness.uptime}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Last Run</p>
                        <p className="text-xs font-mono text-muted-foreground">{harness.lastRun}</p>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {selectedHarness === harness.id && (
                      <div className="pt-4 border-t border-border space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="bg-black p-4 rounded">
                            <p className="text-sm font-bold mb-2 text-accent">Test Results</p>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Pass Rate:</span>
                                <span className="text-green-500">
                                  {((harness.testsPassed / harness.testsRun) * 100).toFixed(1)}%
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Failure Rate:</span>
                                <span className="text-red-500">
                                  {((harness.testsFailed / harness.testsRun) * 100).toFixed(1)}%
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="bg-black p-4 rounded">
                            <p className="text-sm font-bold mb-2 text-accent">Endpoint Status</p>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Total:</span>
                                <span className="text-accent">{harness.endpoints}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Active:</span>
                                <span className="text-green-500">{Math.floor(harness.endpoints * 0.95)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <Button className="w-full gap-2">
                          <CheckCircle className="w-4 h-4" />
                          View Detailed Report
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Quick Actions */}
          <section>
            <h2 className="text-3xl font-bold mb-6">Quick Actions</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <Button className="h-12 gap-2">
                <Play className="w-5 h-5" />
                Start All Harnesses
              </Button>
              <Button variant="outline" className="h-12 gap-2">
                <Pause className="w-5 h-5" />
                Pause All Harnesses
              </Button>
              <Button variant="outline" className="h-12 gap-2">
                <RotateCcw className="w-5 h-5" />
                Reset All Harnesses
              </Button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
