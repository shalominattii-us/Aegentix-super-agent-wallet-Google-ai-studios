import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, Zap, Shield, BarChart3, Clock } from "lucide-react";

export default function Tier1Agents() {
  const agents = [
    {
      name: "Data Collection Agent",
      description: "Gathers information from specified sources with validation",
      capabilities: ["Source aggregation", "Data validation", "Error handling", "Logging"],
      resources: "256 MB RAM, Single-threaded",
      successRate: "99.2%",
      avgTime: "2.3s",
    },
    {
      name: "Notification Agent",
      description: "Routes alerts and communications to appropriate recipients",
      capabilities: ["Multi-channel routing", "Priority handling", "Delivery confirmation", "Retry logic"],
      resources: "256 MB RAM, Single-threaded",
      successRate: "99.8%",
      avgTime: "1.1s",
    },
    {
      name: "Scheduling Agent",
      description: "Executes tasks at predetermined times or intervals",
      capabilities: ["Cron scheduling", "Event triggering", "Time zone handling", "Missed task recovery"],
      resources: "512 MB RAM, Single-threaded",
      successRate: "99.5%",
      avgTime: "0.8s",
    },
    {
      name: "Report Generation Agent",
      description: "Compiles data into standardized formats",
      capabilities: ["Data aggregation", "Format conversion", "Template rendering", "Distribution"],
      resources: "512 MB RAM, Single-threaded",
      successRate: "98.9%",
      avgTime: "3.5s",
    },
    {
      name: "Compliance Agent",
      description: "Verifies adherence to organizational policies",
      capabilities: ["Policy checking", "Audit logging", "Violation detection", "Escalation"],
      resources: "256 MB RAM, Single-threaded",
      successRate: "99.7%",
      avgTime: "1.4s",
    },
  ];

  const metrics = [
    { label: "Task Completion Rate", value: "99%+", icon: CheckCircle2 },
    { label: "Average Execution Time", value: "< 5s", icon: Clock },
    { label: "Error Rate", value: "< 1%", icon: Shield },
    { label: "Data Quality", value: "99%+", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="border-b border-border bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 py-16">
        <div className="container">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-8 h-8 text-cyan-400" />
            <Badge className="bg-cyan-900 text-cyan-100">Tier 1: Foundational</Badge>
          </div>
          <h1 className="text-4xl font-bold mb-4">Tier 1: Foundational Agents</h1>
          <p className="text-lg text-slate-300 max-w-2xl">
            Core autonomy for well-defined, repetitive tasks. Tier 1 agents operate within bounded domains with minimal cross-system dependencies, providing reliable task automation with simple rule-based decision making.
          </p>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="border-b border-border py-12">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8">Performance Targets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric, idx) => {
              const Icon = metric.icon;
              return (
                <Card key={idx} className="bg-slate-900 border-slate-700">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-slate-400 mb-2">{metric.label}</p>
                        <p className="text-2xl font-bold text-cyan-400">{metric.value}</p>
                      </div>
                      <Icon className="w-6 h-6 text-cyan-400 opacity-50" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Agent Types */}
      <section className="border-b border-border py-12">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8">Agent Types</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {agents.map((agent, idx) => (
              <Card key={idx} className="bg-slate-900 border-slate-700 hover:border-cyan-600 transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg">{agent.name}</CardTitle>
                  <CardDescription className="text-slate-400">{agent.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-300 mb-2">Capabilities</p>
                    <div className="flex flex-wrap gap-2">
                      {agent.capabilities.map((cap, i) => (
                        <Badge key={i} variant="outline" className="border-slate-600 text-slate-300">
                          {cap}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-700">
                    <div>
                      <p className="text-xs text-slate-400">Resources</p>
                      <p className="text-sm font-semibold text-slate-200">{agent.resources}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Success Rate</p>
                      <p className="text-sm font-semibold text-green-400">{agent.successRate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Avg Time</p>
                      <p className="text-sm font-semibold text-cyan-400">{agent.avgTime}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture & Implementation */}
      <section className="border-b border-border py-12">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8">Architecture & Implementation</h2>
          <Tabs defaultValue="framework" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-slate-900 border border-slate-700">
              <TabsTrigger value="framework">Framework</TabsTrigger>
              <TabsTrigger value="lifecycle">Lifecycle</TabsTrigger>
              <TabsTrigger value="integration">Integration</TabsTrigger>
            </TabsList>

            <TabsContent value="framework" className="space-y-4">
              <Card className="bg-slate-900 border-slate-700">
                <CardHeader>
                  <CardTitle>Execution Framework</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-slate-950 p-4 rounded font-mono text-sm text-cyan-400 overflow-x-auto">
                    Input → Validation → Processing → Output → Logging
                  </div>
                  <p className="text-slate-300">
                    Tier 1 agents follow a linear execution model with clear input validation, deterministic processing, and comprehensive logging. This ensures predictability and auditability for all operations.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="lifecycle" className="space-y-4">
              <Card className="bg-slate-900 border-slate-700">
                <CardHeader>
                  <CardTitle>Agent Lifecycle</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {["Initialization", "Activation", "Operation", "Monitoring", "Deactivation"].map((phase, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-cyan-900 text-cyan-400 flex items-center justify-center font-semibold text-sm flex-shrink-0">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-200">{phase}</p>
                        <p className="text-sm text-slate-400">
                          {idx === 0 && "Configure agent and allocate resources"}
                          {idx === 1 && "Start agent and verify health"}
                          {idx === 2 && "Execute assigned tasks continuously"}
                          {idx === 3 && "Track performance and handle errors"}
                          {idx === 4 && "Graceful shutdown and cleanup"}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="integration" className="space-y-4">
              <Card className="bg-slate-900 border-slate-700">
                <CardHeader>
                  <CardTitle>Integration Points</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <p className="font-semibold text-slate-200">External Systems</p>
                    <ul className="text-sm text-slate-400 space-y-1 ml-4">
                      <li>• RESTful APIs for data collection</li>
                      <li>• Database connectors for persistence</li>
                      <li>• Notification services (email, SMS, webhooks)</li>
                      <li>• Scheduling systems (cron, event streams)</li>
                    </ul>
                  </div>
                  <div className="space-y-2 pt-4 border-t border-slate-700">
                    <p className="font-semibold text-slate-200">Internal Components</p>
                    <ul className="text-sm text-slate-400 space-y-1 ml-4">
                      <li>• Sovereign CLI for agent management</li>
                      <li>• Lab Simulator for testing</li>
                      <li>• Deployment Scripts for automation</li>
                      <li>• Audit logging system</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Deployment Guide */}
      <section className="py-12">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8">Deployment Guide</h2>
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle>Quick Start: Deploy a Tier 1 Agent</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-slate-950 p-4 rounded font-mono text-sm text-cyan-400 overflow-x-auto">
                <div>$ sovereign agent deploy tier1 --type data-collection</div>
                <div>$ sovereign agent configure --agent-id dc-001 --source api.example.com</div>
                <div>$ sovereign agent activate --agent-id dc-001</div>
                <div>$ sovereign agent monitor --agent-id dc-001 --interval 30s</div>
              </div>
              <p className="text-slate-300 text-sm">
                Tier 1 agents are deployed through the Sovereign CLI with simple configuration. Monitor performance through the dashboard and adjust parameters as needed.
              </p>
              <div className="flex gap-3 pt-4">
                <Button className="bg-cyan-600 hover:bg-cyan-700">View CLI Docs</Button>
                <Button variant="outline" className="border-slate-600">Deploy Agent</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
