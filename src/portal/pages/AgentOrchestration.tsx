import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, GitBranch, MessageSquare, TrendingUp, AlertTriangle, Download, Pause, Play, Trash2, Filter } from "lucide-react";
import { useState, useEffect } from "react";
import { ClusterStatusDashboard } from "@/components/ClusterStatusDashboard";
import { DeploymentControls } from "@/components/DeploymentControls";
import { useClusters } from "@/hooks/useSovereignKernel";

// Real-time log entry type
interface LogEntry {
  id: string;
  timestamp: string;
  sourceAgent: string;
  targetAgent: string;
  messageType: string;
  priority: "low" | "normal" | "high" | "critical";
  status: "sent" | "received" | "error" | "pending";
  payload: string;
  latency: number;
}

// Generate mock log entries for demonstration
const generateMockLogs = (): LogEntry[] => {
  const agents = ["tier1-dc-001", "tier1-notif-001", "tier2-wo-001", "tier2-anom-001", "tier3-sp-001", "tier3-gov-001"];
  const messageTypes = ["request", "response", "notification", "broadcast", "query", "update"];
  const priorities = ["low", "normal", "high", "critical"] as const;
  const statuses = ["sent", "received", "error", "pending"] as const;

  const logs: LogEntry[] = [];
  const now = new Date();

  for (let i = 0; i < 50; i++) {
    const timestamp = new Date(now.getTime() - Math.random() * 60000);
    logs.push({
      id: `log-${i}`,
      timestamp: timestamp.toISOString(),
      sourceAgent: agents[Math.floor(Math.random() * agents.length)],
      targetAgent: agents[Math.floor(Math.random() * agents.length)],
      messageType: messageTypes[Math.floor(Math.random() * messageTypes.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      payload: `{"action": "execute", "params": {...}}`,
      latency: Math.floor(Math.random() * 200) + 10,
    });
  }

  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export default function AgentOrchestration() {
  const [logs, setLogs] = useState<LogEntry[]>(generateMockLogs());
  const [isLive, setIsLive] = useState(true);
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterAgent, setFilterAgent] = useState<string>("all");
  const [searchText, setSearchText] = useState("");
  const { clusters } = useClusters();
  const [selectedClusterId, setSelectedClusterId] = useState<string | null>(null);

  // Simulate real-time log updates
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setLogs((prevLogs) => {
        const agents = ["tier1-dc-001", "tier1-notif-001", "tier2-wo-001", "tier2-anom-001", "tier3-sp-001", "tier3-gov-001"];
        const messageTypes = ["request", "response", "notification", "broadcast", "query", "update"];
        const priorities = ["low", "normal", "high", "critical"] as const;
        const statuses = ["sent", "received", "error", "pending"] as const;

        const newLog: LogEntry = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          sourceAgent: agents[Math.floor(Math.random() * agents.length)],
          targetAgent: agents[Math.floor(Math.random() * agents.length)],
          messageType: messageTypes[Math.floor(Math.random() * messageTypes.length)],
          priority: priorities[Math.floor(Math.random() * priorities.length)],
          status: statuses[Math.floor(Math.random() * statuses.length)],
          payload: `{"action": "execute", "params": {...}}`,
          latency: Math.floor(Math.random() * 200) + 10,
        };

        return [newLog, ...prevLogs.slice(0, 99)];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isLive]);

  const orchestrationAgents = [
    { id: "tier1-dc-001", name: "Data Collection Agent", tier: "1", status: "active", uptime: "99.2%", tasks: 1247 },
    { id: "tier1-notif-001", name: "Notification Agent", tier: "1", status: "active", uptime: "99.8%", tasks: 3891 },
    { id: "tier2-wo-001", name: "Workflow Orchestration", tier: "2", status: "active", uptime: "94.5%", tasks: 156 },
    { id: "tier2-anom-001", name: "Anomaly Detection", tier: "2", status: "active", uptime: "96.2%", tasks: 89 },
    { id: "tier3-sp-001", name: "Strategic Planning", tier: "3", status: "active", uptime: "98.1%", tasks: 12 },
    { id: "tier3-gov-001", name: "Governance Agent", tier: "3", status: "active", uptime: "100%", tasks: 4 },
  ];

  const coordinationMetrics = [
    { metric: "Total Agents", value: "6", status: "active" },
    { metric: "Message Throughput", value: "2.3K/s", status: "normal" },
    { metric: "Avg Latency", value: "45ms", status: "optimal" },
    { metric: "Coordination Success", value: "99.7%", status: "excellent" },
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-900 text-red-100";
      case "high":
        return "bg-orange-900 text-orange-100";
      case "normal":
        return "bg-blue-900 text-blue-100";
      case "low":
        return "bg-slate-700 text-slate-100";
      default:
        return "bg-slate-700 text-slate-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return "✓";
      case "received":
        return "◄";
      case "error":
        return "✕";
      case "pending":
        return "⧗";
      default:
        return "•";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "text-green-400";
      case "received":
        return "text-blue-400";
      case "error":
        return "text-red-400";
      case "pending":
        return "text-yellow-400";
      default:
        return "text-slate-400";
    }
  };

  // Filter logs based on current filters
  const filteredLogs = logs.filter((log) => {
    if (filterPriority !== "all" && log.priority !== filterPriority) return false;
    if (filterStatus !== "all" && log.status !== filterStatus) return false;
    if (filterAgent !== "all" && log.sourceAgent !== filterAgent && log.targetAgent !== filterAgent) return false;
    if (searchText && !log.payload.includes(searchText) && !log.messageType.includes(searchText)) return false;
    return true;
  });

  const downloadLogs = () => {
    const csv = [
      ["Timestamp", "Source Agent", "Target Agent", "Message Type", "Priority", "Status", "Latency (ms)"],
      ...filteredLogs.map((log) => [
        log.timestamp,
        log.sourceAgent,
        log.targetAgent,
        log.messageType,
        log.priority,
        log.status,
        log.latency.toString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `agent-logs-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  useEffect(() => {
    if (clusters.length > 0 && !selectedClusterId) {
      setSelectedClusterId(clusters[0]?.id || null);
    }
  }, [clusters, selectedClusterId]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="border-b border-border bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 py-16">
        <div className="container">
          <div className="flex items-center gap-3 mb-4">
            <GitBranch className="w-8 h-8 text-indigo-400" />
            <Badge className="bg-indigo-900 text-indigo-100">Agent Orchestration</Badge>
          </div>
          <h1 className="text-4xl font-bold mb-4">Agent Orchestration Dashboard</h1>
          <p className="text-lg text-slate-300 max-w-2xl">
            Real-time coordination and monitoring of autonomous agents across all tiers. Visualize agent interactions, communication patterns, and system-wide performance metrics.
          </p>
        </div>
      </section>

      {/* Cluster Status */}
      <section className="border-b border-border py-12">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8">Infrastructure Status</h2>
          <ClusterStatusDashboard />
        </div>
      </section>

      {/* Deployment Controls */}
      {selectedClusterId && (
        <section className="border-b border-border py-12">
          <div className="container">
            <h2 className="text-2xl font-bold mb-8">Deployment Management</h2>
            <DeploymentControls clusterId={selectedClusterId} />
          </div>
        </section>
      )}

      {/* Live Metrics */}
      <section className="border-b border-border py-12">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8">Live Coordination Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {coordinationMetrics.map((metric, idx) => (
              <Card key={idx} className="bg-slate-900 border-slate-700">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-slate-400 mb-2">{metric.metric}</p>
                      <p className="text-2xl font-bold text-indigo-400">{metric.value}</p>
                      <p className="text-xs text-green-400 mt-2">Status: {metric.status}</p>
                    </div>
                    <Activity className="w-6 h-6 text-indigo-400 opacity-50" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Real-Time Log Viewer */}
      <section className="border-b border-border py-12">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8">Real-Time Inter-Agent Communication Log</h2>
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Live Message Stream</CardTitle>
                  <CardDescription>Monitoring {filteredLogs.length} messages in real-time</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-slate-600 gap-2"
                    onClick={() => setIsLive(!isLive)}
                  >
                    {isLive ? (
                      <>
                        <Pause className="w-4 h-4" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Resume
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-slate-600 gap-2"
                    onClick={() => setLogs([])}
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-slate-600 gap-2"
                    onClick={downloadLogs}
                  >
                    <Download className="w-4 h-4" />
                    Export CSV
                  </Button>
                </div>
              </div>
            </CardHeader>

            {/* Filters */}
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-4 p-4 bg-slate-950 rounded border border-slate-700">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-400">Filters:</span>
                </div>
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="px-3 py-1 bg-slate-800 border border-slate-600 rounded text-sm text-slate-200 hover:border-slate-500"
                >
                  <option value="all">All Priorities</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="normal">Normal</option>
                  <option value="low">Low</option>
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-1 bg-slate-800 border border-slate-600 rounded text-sm text-slate-200 hover:border-slate-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="sent">Sent</option>
                  <option value="received">Received</option>
                  <option value="error">Error</option>
                  <option value="pending">Pending</option>
                </select>
                <select
                  value={filterAgent}
                  onChange={(e) => setFilterAgent(e.target.value)}
                  className="px-3 py-1 bg-slate-800 border border-slate-600 rounded text-sm text-slate-200 hover:border-slate-500"
                >
                  <option value="all">All Agents</option>
                  {orchestrationAgents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Search payload..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="px-3 py-1 bg-slate-800 border border-slate-600 rounded text-sm text-slate-200 placeholder-slate-500 hover:border-slate-500"
                />
              </div>

              {/* Log Entries */}
              <div className="space-y-2 max-h-96 overflow-y-auto font-mono text-xs">
                {filteredLogs.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    No logs match the current filters
                  </div>
                ) : (
                  filteredLogs.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-start gap-2 p-2 bg-slate-950 rounded border border-slate-700 hover:border-slate-600 transition-colors"
                    >
                      <span className={`w-4 text-center flex-shrink-0 ${getStatusColor(log.status)}`}>
                        {getStatusIcon(log.status)}
                      </span>
                      <span className="text-slate-500 w-20 flex-shrink-0">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                      <span className="text-indigo-400 min-w-fit">{log.sourceAgent}</span>
                      <span className="text-slate-500">→</span>
                      <span className="text-indigo-400 min-w-fit">{log.targetAgent}</span>
                      <Badge className={`text-xs flex-shrink-0 ${getPriorityColor(log.priority)}`}>
                        {log.priority}
                      </Badge>
                      <span className="text-slate-400 flex-shrink-0">[{log.messageType}]</span>
                      <span className="text-slate-500 flex-shrink-0">({log.latency}ms)</span>
                      <span className="text-slate-600 truncate flex-1">{log.payload}</span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Agent Network */}
      <section className="border-b border-border py-12">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8">Agent Network Status</h2>
          <Card className="bg-slate-900 border-slate-700 mb-6">
            <CardHeader>
              <CardTitle>Active Agents</CardTitle>
              <CardDescription>Real-time status of all deployed agents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {orchestrationAgents.map((agent, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-950 rounded border border-slate-700 hover:border-indigo-600 transition-colors">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                      <div className="flex-1">
                        <p className="font-semibold text-slate-200">{agent.name}</p>
                        <p className="text-xs text-slate-400">{agent.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <Badge className={getTierColor(agent.tier)}>Tier {agent.tier}</Badge>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-slate-200">{agent.uptime}</p>
                        <p className="text-xs text-slate-400">{agent.tasks} tasks</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Coordination Patterns */}
      <section className="border-b border-border py-12">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8">Coordination Patterns</h2>
          <Tabs defaultValue="hierarchical" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-slate-900 border border-slate-700">
              <TabsTrigger value="hierarchical">Hierarchical</TabsTrigger>
              <TabsTrigger value="peertopeer">Peer-to-Peer</TabsTrigger>
              <TabsTrigger value="broadcast">Broadcast</TabsTrigger>
              <TabsTrigger value="pubsub">Pub/Sub</TabsTrigger>
            </TabsList>

            <TabsContent value="hierarchical" className="space-y-4">
              <Card className="bg-slate-900 border-slate-700">
                <CardHeader>
                  <CardTitle>Hierarchical Coordination</CardTitle>
                  <CardDescription>Tier 3 agents coordinate Tier 2, which coordinate Tier 1</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-slate-950 p-4 rounded font-mono text-sm text-indigo-400 overflow-x-auto">
                    <div>Tier 3 (Strategic)</div>
                    <div>    ↓</div>
                    <div>Tier 2 (Contextual)</div>
                    <div>    ↓</div>
                    <div>Tier 1 (Foundational)</div>
                  </div>
                  <p className="text-slate-300 text-sm">
                    Strategic agents at Tier 3 issue directives to Tier 2 agents, which decompose them into specific tasks for Tier 1 agents. Results flow back up the hierarchy.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="peertopeer" className="space-y-4">
              <Card className="bg-slate-900 border-slate-700">
                <CardHeader>
                  <CardTitle>Peer-to-Peer Coordination</CardTitle>
                  <CardDescription>Same-tier agents communicate directly</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-300 text-sm">
                    Agents at the same tier can communicate directly for collaborative problem-solving and resource sharing. This enables horizontal scaling and distributed decision-making.
                  </p>
                  <div className="bg-slate-950 p-4 rounded font-mono text-sm text-indigo-400 overflow-x-auto">
                    <div>Agent A ↔ Agent B (same tier)</div>
                    <div>Direct message passing</div>
                    <div>Shared state synchronization</div>
                    <div>Collaborative decision-making</div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="broadcast" className="space-y-4">
              <Card className="bg-slate-900 border-slate-700">
                <CardHeader>
                  <CardTitle>Broadcast Communication</CardTitle>
                  <CardDescription>Critical notifications to all agents</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-300 text-sm">
                    Critical system events, policy changes, or emergency directives are broadcast to all agents simultaneously. Ensures immediate awareness and coordinated response.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <div className="text-indigo-400 font-semibold">→</div>
                      <div>
                        <p className="font-semibold text-slate-200">System Alerts</p>
                        <p className="text-sm text-slate-400">Security incidents, resource constraints</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="text-indigo-400 font-semibold">→</div>
                      <div>
                        <p className="font-semibold text-slate-200">Policy Updates</p>
                        <p className="text-sm text-slate-400">New compliance requirements, governance changes</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="text-indigo-400 font-semibold">→</div>
                      <div>
                        <p className="font-semibold text-slate-200">Emergency Directives</p>
                        <p className="text-sm text-slate-400">Immediate action required across all agents</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pubsub" className="space-y-4">
              <Card className="bg-slate-900 border-slate-700">
                <CardHeader>
                  <CardTitle>Publish-Subscribe Pattern</CardTitle>
                  <CardDescription>Event-driven asynchronous communication</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-300 text-sm">
                    Agents subscribe to relevant event topics and react to published events. Enables loose coupling and scalable event processing.
                  </p>
                  <div className="bg-slate-950 p-4 rounded font-mono text-sm text-indigo-400 overflow-x-auto">
                    <div>Topics:</div>
                    <div>├─ system.health</div>
                    <div>├─ policy.updated</div>
                    <div>├─ resource.alert</div>
                    <div>└─ agent.status</div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Message Protocol */}
      <section className="border-b border-border py-12">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8">Message Protocol</h2>
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle>Standard Message Format</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-slate-950 p-4 rounded font-mono text-sm text-indigo-400 overflow-x-auto">
                <div>{"{"}</div>
                <div>  "agent_id": "tier2-wo-001",</div>
                <div>  "agent_tier": "2",</div>
                <div>  "message_type": "request",</div>
                <div>  "priority": "high",</div>
                <div>  "payload": {"{"}</div>
                <div>    "action": "execute_workflow",</div>
                <div>    "workflow_id": "wf-123",</div>
                <div>    "parameters": {"{"} ... {"}"}</div>
                <div>  {"}"},</div>
                <div>  "timestamp": "2026-05-03T12:34:56Z",</div>
                <div>  "correlation_id": "corr-abc123"</div>
                <div>{"}"}</div>
              </div>
              <p className="text-slate-300 text-sm">
                All inter-agent communication follows this standardized JSON-RPC format, enabling reliable message routing, tracking, and audit logging.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Performance Monitoring */}
      <section className="py-12">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8">Performance Monitoring</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-400" />
                  Message Throughput
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Tier 1 → Tier 2</span>
                    <span className="text-indigo-400 font-semibold">1.2K msg/s</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Tier 2 → Tier 3</span>
                    <span className="text-indigo-400 font-semibold">450 msg/s</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Peer-to-Peer</span>
                    <span className="text-indigo-400 font-semibold">650 msg/s</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-indigo-400" />
                  Coordination Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Message Delivery Rate</span>
                    <span className="text-green-400 font-semibold">99.98%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Avg Response Time</span>
                    <span className="text-indigo-400 font-semibold">42ms</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Conflict Resolution</span>
                    <span className="text-green-400 font-semibold">100%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
