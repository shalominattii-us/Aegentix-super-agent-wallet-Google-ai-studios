/**
 * Coinbase Agent Matrices Dashboard
 * Displays transaction, agent coordination, and deployment matrices
 */

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, TrendingUp, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface TransactionMatrix {
  operationId: string;
  type: string;
  status: string;
  amount?: string;
  destinationAddress?: string;
  requiredSignatures: number;
  currentSignatures: number;
  createdAt: string;
  executedAt?: string;
  transactionHash?: string;
}

interface AgentCoordinationMatrix {
  totalOperations: number;
  pendingApproval: number;
  executing: number;
  completed: number;
  failed: number;
  successRate: number;
  averageExecutionTime: number;
  totalValueTransferred: string;
}

interface DeploymentMatrix {
  replicas: number;
  ready: number;
  updated: number;
  available: number;
  cpuUsage: number;
  memoryUsage: number;
  uptime: string;
  lastDeployed: string;
}

export default function CoinbaseAgentMatrices() {
  // Fetch data via tRPC hooks
  const { data: allMatrices, isLoading } = trpc.coinbaseMatrices.getAllMatrices.useQuery(undefined, {
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  const [transactions, setTransactions] = useState<TransactionMatrix[]>([]);
  const [coordination, setCoordination] = useState<AgentCoordinationMatrix | null>(null);
  const [deployment, setDeployment] = useState<DeploymentMatrix | null>(null);

  // Update state when data arrives
  useEffect(() => {
    if (allMatrices) {
      setTransactions(allMatrices.transactions);
      setCoordination(allMatrices.coordination);
      setDeployment(allMatrices.deployment);
    }
  }, [allMatrices]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-700 border-green-500/30";
      case "executing":
        return "bg-blue-500/20 text-blue-700 border-blue-500/30";
      case "approved":
        return "bg-yellow-500/20 text-yellow-700 border-yellow-500/30";
      case "pending":
        return "bg-gray-500/20 text-gray-700 border-gray-500/30";
      case "failed":
        return "bg-red-500/20 text-red-700 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-700 border-gray-500/30";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "executing":
        return <Clock className="w-4 h-4 animate-spin" />;
      case "failed":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading matrices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Coinbase Agent Matrices</h1>
        <p className="text-muted-foreground mt-2">
          Real-time monitoring of transaction, coordination, and deployment matrices
        </p>
      </div>

      <Tabs defaultValue="coordination" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="coordination">Agent Coordination</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="deployment">Deployment</TabsTrigger>
        </TabsList>

        {/* Agent Coordination Matrix */}
        <TabsContent value="coordination" className="space-y-4">
          {coordination && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Operations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{coordination.totalOperations}</div>
                  <p className="text-xs text-muted-foreground mt-1">All-time operations</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Pending Approval</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-yellow-600">{coordination.pendingApproval}</div>
                  <p className="text-xs text-muted-foreground mt-1">Awaiting signatures</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Executing</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">{coordination.executing}</div>
                  <p className="text-xs text-muted-foreground mt-1">In progress</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Success Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{coordination.successRate.toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground mt-1">Completion rate</p>
                </CardContent>
              </Card>
            </div>
          )}

          {coordination && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Completed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{coordination.completed}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Failed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{coordination.failed}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Total Value Transferred</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${parseFloat(coordination.totalValueTransferred).toLocaleString()}</div>
                </CardContent>
              </Card>
            </div>
          )}

          {coordination && (
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Average Execution Time</span>
                      <span className="text-sm font-bold">{(coordination.averageExecutionTime / 1000).toFixed(2)}s</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${Math.min((coordination.averageExecutionTime / 60000) * 100, 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Success Rate</span>
                      <span className="text-sm font-bold">{coordination.successRate.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${coordination.successRate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Transaction Matrix */}
        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Multi-sig coordinated transfers and operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {transactions.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No transactions yet</p>
                ) : (
                  transactions.map((tx) => (
                    <div key={tx.operationId} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(tx.status)}
                          <div>
                            <p className="font-medium text-sm">{tx.type.toUpperCase()}</p>
                            <p className="text-xs text-muted-foreground">{tx.operationId.slice(0, 8)}...</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(tx.status)}>{tx.status}</Badge>
                      </div>

                      {tx.amount && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Amount</span>
                          <span className="font-bold">${parseFloat(tx.amount).toLocaleString()}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Signatures</span>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {Array.from({ length: tx.requiredSignatures }).map((_, i) => (
                              <div
                                key={i}
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                  i < tx.currentSignatures
                                    ? "bg-green-500 text-white"
                                    : "bg-gray-300 text-gray-600"
                                }`}
                              >
                                {i + 1}
                              </div>
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {tx.currentSignatures}/{tx.requiredSignatures}
                          </span>
                        </div>
                      </div>

                      {tx.transactionHash && (
                        <div className="text-xs text-muted-foreground">
                          <p>Tx: {tx.transactionHash.slice(0, 16)}...</p>
                        </div>
                      )}

                      <div className="text-xs text-muted-foreground">
                        {new Date(tx.createdAt).toLocaleString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Deployment Matrix */}
        <TabsContent value="deployment" className="space-y-4">
          {deployment && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Pod Replicas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{deployment.ready}/{deployment.replicas}</div>
                  <p className="text-xs text-muted-foreground mt-1">Ready pods</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">CPU Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{deployment.cpuUsage.toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground mt-1">Average utilization</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Memory Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{deployment.memoryUsage.toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground mt-1">Average utilization</p>
                </CardContent>
              </Card>
            </div>
          )}

          {deployment && (
            <Card>
              <CardHeader>
                <CardTitle>Deployment Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Replicas</p>
                    <p className="text-2xl font-bold">{deployment.replicas}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Updated</p>
                    <p className="text-2xl font-bold text-blue-600">{deployment.updated}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Available</p>
                    <p className="text-2xl font-bold text-green-600">{deployment.available}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Uptime</p>
                    <p className="text-lg font-bold">{deployment.uptime}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground mb-2">Last Deployed</p>
                  <p className="text-sm">{new Date(deployment.lastDeployed).toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
