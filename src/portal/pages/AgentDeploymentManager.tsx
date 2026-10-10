import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Play, Pause, Trash2, Settings, Plus, CheckCircle, AlertCircle } from "lucide-react";

export default function AgentDeploymentManager() {
  const deployedAgents = [
    {
      id: "tier1-dc-001",
      name: "Data Collection Agent",
      tier: "1",
      status: "running",
      version: "1.2.3",
      deployment: "2026-04-15",
      resources: "512MB RAM",
      uptime: "99.2%",
    },
    {
      id: "tier1-notif-001",
      name: "Notification Agent",
      tier: "1",
      status: "running",
      version: "1.1.8",
      deployment: "2026-04-10",
      resources: "256MB RAM",
      uptime: "99.8%",
    },
    {
      id: "tier2-wo-001",
      name: "Workflow Orchestration",
      tier: "2",
      status: "running",
      version: "2.0.1",
      deployment: "2026-04-18",
      resources: "1.5GB RAM",
      uptime: "94.5%",
    },
    {
      id: "tier3-sp-001",
      name: "Strategic Planning Agent",
      tier: "3",
      status: "paused",
      version: "3.0.0",
      deployment: "2026-05-01",
      resources: "4GB RAM, GPU",
      uptime: "98.1%",
    },
  ];

  const deploymentTemplates = [
    {
      name: "Tier 1 Foundational",
      description: "Basic data processing and notification agents",
      agents: 2,
      resources: "768MB RAM",
      deploymentTime: "2 min",
    },
    {
      name: "Tier 2 Intermediate",
      description: "Workflow orchestration and anomaly detection",
      agents: 3,
      resources: "3.5GB RAM",
      deploymentTime: "5 min",
    },
    {
      name: "Tier 3 Advanced",
      description: "Strategic planning and governance agents",
      agents: 2,
      resources: "8GB RAM, GPU",
      deploymentTime: "10 min",
    },
    {
      name: "Full Stack Deployment",
      description: "Complete multi-tier agent ecosystem",
      agents: 7,
      resources: "12GB RAM, GPU",
      deploymentTime: "15 min",
    },
  ];

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "1":
        return "bg-cyan-900 text-cyan-100";
      case "2":
        return "bg-blue-900 text-blue-100";
      case "3":
        return "bg-purple-900 text-purple-100";
      default:
        return "bg-slate-700 text-slate-100";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "bg-green-900 text-green-100";
      case "paused":
        return "bg-yellow-900 text-yellow-100";
      case "failed":
        return "bg-red-900 text-red-100";
      default:
        return "bg-slate-700 text-slate-100";
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="border-b border-border bg-gradient-to-r from-slate-900 via-green-900 to-slate-900 py-16">
        <div className="container">
          <div className="flex items-center gap-3 mb-4">
            <Download className="w-8 h-8 text-green-400" />
            <Badge className="bg-green-900 text-green-100">Deployment Manager</Badge>
          </div>
          <h1 className="text-4xl font-bold mb-4">Agent Deployment Manager</h1>
          <p className="text-lg text-slate-300 max-w-2xl">
            Deploy, configure, monitor, and manage autonomous agents across all tiers. Control agent lifecycle, resource allocation, and system-wide coordination.
          </p>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="border-b border-border py-8 bg-slate-950">
        <div className="container">
          <div className="flex flex-wrap gap-3">
            <Button className="bg-green-600 hover:bg-green-700 gap-2">
              <Plus className="w-4 h-4" />
              Deploy New Agent
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
              <Download className="w-4 h-4" />
              Deploy Template
            </Button>
            <Button variant="outline" className="border-slate-600 gap-2">
              <Settings className="w-4 h-4" />
              System Configuration
            </Button>
          </div>
        </div>
      </section>

      {/* Deployed Agents */}
      <section className="border-b border-border py-12">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8">Active Deployments</h2>
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle>Deployed Agents</CardTitle>
              <CardDescription>{deployedAgents.length} agents currently deployed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {deployedAgents.map((agent, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-slate-950 rounded border border-slate-700 hover:border-green-600 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-3 h-3 rounded-full ${agent.status === "running" ? "bg-green-500 animate-pulse" : "bg-yellow-500"}`} />
                        <p className="font-semibold text-slate-200">{agent.name}</p>
                        <Badge className={getTierColor(agent.tier)}>Tier {agent.tier}</Badge>
                        <Badge className={getStatusColor(agent.status)}>{agent.status}</Badge>
                      </div>
                      <div className="flex flex-wrap gap-4 text-xs text-slate-400">
                        <span>ID: {agent.id}</span>
                        <span>v{agent.version}</span>
                        <span>Deployed: {agent.deployment}</span>
                        <span>{agent.resources}</span>
                        <span>Uptime: {agent.uptime}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="border-slate-600 h-8 w-8 p-0">
                        {agent.status === "running" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                      <Button size="sm" variant="outline" className="border-slate-600 h-8 w-8 p-0">
                        <Settings className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="border-slate-600 h-8 w-8 p-0 text-red-400 hover:text-red-300">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Deployment Templates */}
      <section className="border-b border-border py-12">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8">Deployment Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {deploymentTemplates.map((template, idx) => (
              <Card key={idx} className="bg-slate-900 border-slate-700 hover:border-green-600 transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-slate-400">Agents</p>
                      <p className="font-semibold text-slate-200">{template.agents}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Resources</p>
                      <p className="font-semibold text-slate-200">{template.resources}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Deploy Time</p>
                      <p className="font-semibold text-slate-200">{template.deploymentTime}</p>
                    </div>
                  </div>
                  <Button className="w-full bg-green-600 hover:bg-green-700">Deploy Template</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Lifecycle Management */}
      <section className="border-b border-border py-12">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8">Agent Lifecycle Management</h2>
          <Tabs defaultValue="deployment" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-slate-900 border border-slate-700">
              <TabsTrigger value="deployment">Deployment</TabsTrigger>
              <TabsTrigger value="configuration">Configuration</TabsTrigger>
              <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
              <TabsTrigger value="termination">Termination</TabsTrigger>
            </TabsList>

            <TabsContent value="deployment" className="space-y-4">
              <Card className="bg-slate-900 border-slate-700">
                <CardHeader>
                  <CardTitle>Agent Deployment Process</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {[
                      { step: 1, title: "Select Agent Type", desc: "Choose tier and agent type to deploy" },
                      { step: 2, title: "Configure Resources", desc: "Allocate CPU, memory, and GPU resources" },
                      { step: 3, title: "Set Parameters", desc: "Configure agent-specific parameters and models" },
                      { step: 4, title: "Validate Configuration", desc: "System validates configuration for compatibility" },
                      { step: 5, title: "Deploy Agent", desc: "Agent is deployed and initialized" },
                      { step: 6, title: "Health Check", desc: "Verify agent is running and responsive" },
                    ].map((item) => (
                      <div key={item.step} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-900 text-green-400 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                          {item.step}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-200">{item.title}</p>
                          <p className="text-sm text-slate-400">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-slate-950 p-4 rounded font-mono text-sm text-green-400 overflow-x-auto mt-6">
                    <div>$ sovereign agent deploy tier2 --type workflow-orchestration \</div>
                    <div>    --resources 1.5GB --gpu enabled \</div>
                    <div>    --name "workflow-prod-01"</div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="configuration" className="space-y-4">
              <Card className="bg-slate-900 border-slate-700">
                <CardHeader>
                  <CardTitle>Agent Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-300 text-sm">
                    Configure agent behavior, resource limits, coordination protocols, and integration settings.
                  </p>
                  <div className="bg-slate-950 p-4 rounded font-mono text-sm text-green-400 overflow-x-auto">
                    <div>$ sovereign agent config tier2-wo-001 \</div>
                    <div>    --max-memory 2GB \</div>
                    <div>    --coordination-mode hierarchical \</div>
                    <div>    --enable-ml-models true \</div>
                    <div>    --logging-level debug</div>
                  </div>
                  <div className="space-y-2 pt-4 border-t border-slate-700">
                    <p className="font-semibold text-slate-200">Configuration Options</p>
                    <ul className="text-sm text-slate-400 space-y-1 ml-4">
                      <li>• Resource limits (CPU, memory, GPU)</li>
                      <li>• Coordination mode and protocols</li>
                      <li>• ML model selection and parameters</li>
                      <li>• Logging and monitoring settings</li>
                      <li>• Integration endpoints and credentials</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="monitoring" className="space-y-4">
              <Card className="bg-slate-900 border-slate-700">
                <CardHeader>
                  <CardTitle>Real-Time Monitoring</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-300 text-sm">
                    Monitor agent health, performance metrics, and resource utilization in real-time.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { metric: "CPU Usage", value: "45%", status: "normal" },
                      { metric: "Memory Usage", value: "1.2GB / 2GB", status: "normal" },
                      { metric: "Message Queue", value: "234 msgs", status: "normal" },
                      { metric: "Error Rate", value: "0.02%", status: "excellent" },
                    ].map((item, idx) => (
                      <div key={idx} className="bg-slate-950 p-3 rounded border border-slate-700">
                        <p className="text-xs text-slate-400">{item.metric}</p>
                        <p className="text-lg font-semibold text-slate-200">{item.value}</p>
                        <p className="text-xs text-green-400 mt-1">Status: {item.status}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-slate-950 p-4 rounded font-mono text-sm text-green-400 overflow-x-auto">
                    <div>$ sovereign agent monitor tier2-wo-001 --realtime</div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="termination" className="space-y-4">
              <Card className="bg-slate-900 border-slate-700">
                <CardHeader>
                  <CardTitle>Agent Termination</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-300 text-sm">
                    Gracefully shut down agents, clean up resources, and archive operational data.
                  </p>
                  <div className="space-y-3">
                    {[
                      { step: 1, title: "Graceful Shutdown", desc: "Agent completes current tasks and transitions to idle" },
                      { step: 2, title: "State Archival", desc: "Agent state and logs are archived for analysis" },
                      { step: 3, title: "Resource Cleanup", desc: "Allocated resources are released and reallocated" },
                      { step: 4, title: "Coordination Update", desc: "Other agents are notified of termination" },
                      { step: 5, title: "Verification", desc: "Confirm all resources have been released" },
                    ].map((item) => (
                      <div key={item.step} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-900 text-red-400 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                          {item.step}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-200">{item.title}</p>
                          <p className="text-sm text-slate-400">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-slate-950 p-4 rounded font-mono text-sm text-red-400 overflow-x-auto">
                    <div>$ sovereign agent terminate tier2-wo-001 --graceful --archive</div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Resource Allocation */}
      <section className="border-b border-border py-12">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8">System Resource Allocation</h2>
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle>Current Resource Usage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-300">Total CPU</span>
                  <span className="text-green-400 font-semibold">6.8 / 16 cores (42.5%)</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
                  <div className="bg-green-500 h-full" style={{ width: "42.5%" }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-300">Total Memory</span>
                  <span className="text-green-400 font-semibold">7.3 / 16 GB (45.6%)</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
                  <div className="bg-green-500 h-full" style={{ width: "45.6%" }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-300">GPU Utilization</span>
                  <span className="text-green-400 font-semibold">2.1 / 4 GPUs (52.5%)</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
                  <div className="bg-green-500 h-full" style={{ width: "52.5%" }} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Deployment History */}
      <section className="py-12">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8">Recent Deployment Activity</h2>
          <Card className="bg-slate-900 border-slate-700">
            <CardContent className="pt-6">
              <div className="space-y-3">
                {[
                  { time: "2026-05-03 14:32", action: "Deployed", agent: "tier3-sp-001", status: "success" },
                  { time: "2026-05-03 12:15", action: "Updated", agent: "tier2-wo-001", status: "success" },
                  { time: "2026-05-02 18:45", action: "Scaled", agent: "tier1-dc-001", status: "success" },
                  { time: "2026-05-02 10:20", action: "Restarted", agent: "tier1-notif-001", status: "success" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-950 rounded border border-slate-700">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <div>
                        <p className="font-semibold text-slate-200">{item.action}</p>
                        <p className="text-xs text-slate-400">{item.agent}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-300">{item.time}</p>
                      <Badge className="bg-green-900 text-green-100 text-xs mt-1">{item.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
