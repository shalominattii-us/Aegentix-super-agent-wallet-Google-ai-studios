import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, GitBranch, TrendingUp, Zap, AlertCircle } from "lucide-react";

export default function Tier2Agents() {
  const agents = [
    {
      name: "Workflow Orchestration Agent",
      description: "Coordinates complex multi-step processes across systems",
      capabilities: ["Multi-step workflows", "Cross-system coordination", "State management", "Error recovery"],
      resources: "1 GB RAM, Multi-threaded",
      accuracy: "94.2%",
      resolution: "2.3 hours",
    },
    {
      name: "Anomaly Detection Agent",
      description: "Identifies unusual patterns in operational data",
      capabilities: ["Pattern analysis", "Statistical modeling", "Real-time detection", "Alert generation"],
      resources: "1.5 GB RAM, Multi-threaded",
      accuracy: "92.8%",
      resolution: "1.1 hours",
    },
    {
      name: "Optimization Agent",
      description: "Improves resource allocation and operational efficiency",
      capabilities: ["Resource analysis", "Optimization algorithms", "Cost modeling", "Performance tuning"],
      resources: "2 GB RAM, Multi-threaded",
      accuracy: "91.5%",
      resolution: "3.5 hours",
    },
    {
      name: "Recommendation Agent",
      description: "Suggests actions based on historical analysis and patterns",
      capabilities: ["Historical analysis", "Pattern matching", "Scoring algorithms", "Confidence ranking"],
      resources: "1.2 GB RAM, Multi-threaded",
      accuracy: "89.7%",
      resolution: "1.4 hours",
    },
    {
      name: "Validation Agent",
      description: "Performs complex integrity and consistency checking",
      capabilities: ["Multi-source validation", "Consistency checking", "Integrity verification", "Audit trails"],
      resources: "1 GB RAM, Multi-threaded",
      accuracy: "97.3%",
      resolution: "0.8 hours",
    },
  ];

  const metrics = [
    { label: "Workflow Success Rate", value: "95%+", icon: TrendingUp },
    { label: "Decision Accuracy", value: "90%+", icon: Brain },
    { label: "Time-to-Resolution", value: "50% ↓", icon: Zap },
    { label: "Cost Optimization", value: "20%+ ↓", icon: AlertCircle },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="border-b border-border bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 py-16">
        <div className="container">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-8 h-8 text-blue-400" />
            <Badge className="bg-blue-900 text-blue-100">Tier 2: Intermediate</Badge>
          </div>
          <h1 className="text-4xl font-bold mb-4">Tier 2: Intermediate Agents</h1>
          <p className="text-lg text-slate-300 max-w-2xl">
            Contextual intelligence for multi-system operations. Tier 2 agents operate across multiple systems with contextual awareness, making decisions based on current state, historical patterns, and organizational context.
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
                        <p className="text-2xl font-bold text-blue-400">{metric.value}</p>
                      </div>
                      <Icon className="w-6 h-6 text-blue-400 opacity-50" />
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
              <Card key={idx} className="bg-slate-900 border-slate-700 hover:border-blue-600 transition-colors">
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
                      <p className="text-xs text-slate-400">Accuracy</p>
                      <p className="text-sm font-semibold text-blue-400">{agent.accuracy}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Resolution</p>
                      <p className="text-sm font-semibold text-purple-400">{agent.resolution}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Capabilities */}
      <section className="border-b border-border py-12">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8">Advanced Capabilities</h2>
          <Tabs defaultValue="context" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-slate-900 border border-slate-700">
              <TabsTrigger value="context">Context Awareness</TabsTrigger>
              <TabsTrigger value="learning">Learning</TabsTrigger>
              <TabsTrigger value="coordination">Coordination</TabsTrigger>
              <TabsTrigger value="recovery">Recovery</TabsTrigger>
            </TabsList>

            <TabsContent value="context" className="space-y-4">
              <Card className="bg-slate-900 border-slate-700">
                <CardHeader>
                  <CardTitle>Context Awareness Framework</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-slate-950 p-4 rounded font-mono text-sm text-blue-400 overflow-x-auto">
                    Input → Context Retrieval → Analysis → Decision Making → Action
                  </div>
                  <p className="text-slate-300">
                    Tier 2 agents access organizational knowledge bases and historical data to make context-aware decisions. They understand system state, user preferences, and operational constraints.
                  </p>
                  <div className="space-y-2 pt-4 border-t border-slate-700">
                    <p className="font-semibold text-slate-200">Context Sources</p>
                    <ul className="text-sm text-slate-400 space-y-1 ml-4">
                      <li>• Real-time system state and metrics</li>
                      <li>• Historical operational data</li>
                      <li>• User preferences and profiles</li>
                      <li>• Organizational policies and constraints</li>
                      <li>• External market and environmental data</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="learning" className="space-y-4">
              <Card className="bg-slate-900 border-slate-700">
                <CardHeader>
                  <CardTitle>Adaptive Learning Mechanisms</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-300">
                    Tier 2 agents continuously improve through feedback loops and performance analysis.
                  </p>
                  <div className="space-y-3">
                    {["Feedback Collection", "Pattern Recognition", "Model Refinement", "Performance Validation"].map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-blue-900 text-blue-400 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                          {idx + 1}
                        </div>
                        <p className="text-slate-300">{item}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="coordination" className="space-y-4">
              <Card className="bg-slate-900 border-slate-700">
                <CardHeader>
                  <CardTitle>Cross-System Coordination</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-300">
                    Tier 2 agents coordinate with multiple external systems and other agents through standardized protocols.
                  </p>
                  <div className="bg-slate-950 p-4 rounded font-mono text-sm text-blue-400 overflow-x-auto">
                    <div>Integration Points:</div>
                    <div>├─ REST APIs (data retrieval)</div>
                    <div>├─ GraphQL (complex queries)</div>
                    <div>├─ Event Streams (real-time updates)</div>
                    <div>├─ Database Connectors (persistence)</div>
                    <div>└─ RPA Bridges (legacy systems)</div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recovery" className="space-y-4">
              <Card className="bg-slate-900 border-slate-700">
                <CardHeader>
                  <CardTitle>Exception Handling & Recovery</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-300">
                    Intelligent recovery mechanisms ensure workflow continuity under adverse conditions.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <div className="text-blue-400 font-semibold">→</div>
                      <div>
                        <p className="font-semibold text-slate-200">Automatic Retry</p>
                        <p className="text-sm text-slate-400">Exponential backoff with jitter</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="text-blue-400 font-semibold">→</div>
                      <div>
                        <p className="font-semibold text-slate-200">Fallback Paths</p>
                        <p className="text-sm text-slate-400">Alternative execution routes</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="text-blue-400 font-semibold">→</div>
                      <div>
                        <p className="font-semibold text-slate-200">Escalation</p>
                        <p className="text-sm text-slate-400">Human intervention when needed</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Deployment & Management */}
      <section className="py-12">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8">Deployment & Management</h2>
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader>
              <CardTitle>Deploy a Tier 2 Agent</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-slate-950 p-4 rounded font-mono text-sm text-blue-400 overflow-x-auto">
                <div>$ sovereign agent deploy tier2 --type workflow-orchestration</div>
                <div>$ sovereign agent configure --agent-id wo-001 \</div>
                <div>    --knowledge-base production \</div>
                <div>    --learning-enabled true</div>
                <div>$ sovereign agent activate --agent-id wo-001</div>
                <div>$ sovereign agent monitor --agent-id wo-001 --detailed</div>
              </div>
              <p className="text-slate-300 text-sm">
                Tier 2 agents require knowledge base configuration and learning parameter setup. Monitor decision accuracy and adjust learning rates based on performance metrics.
              </p>
              <div className="flex gap-3 pt-4">
                <Button className="bg-blue-600 hover:bg-blue-700">View Configuration Guide</Button>
                <Button variant="outline" className="border-slate-600">Deploy Agent</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
