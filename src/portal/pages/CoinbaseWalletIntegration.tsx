/**
 * Coinbase Wallet Integration Page
 * Frontend UI for Coinbase MCP wallet operations with comprehensive error handling
 */

import { useState } from "react";
import { useCoinbaseErrorHandler } from "@/hooks/useCoinbaseErrorHandler";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AlertCircle, CheckCircle, Loader2, AlertTriangle } from "lucide-react";

export function CoinbaseWalletIntegration() {
  const { showError, showSuccess, showWarning, showInfo } = useCoinbaseErrorHandler();

  // Session state
  const [sessionId, setSessionId] = useState<string>("");
  const [agentId, setAgentId] = useState<string>("agent-001");
  const [isCreatingSession, setIsCreatingSession] = useState(false);

  // Payment state
  const [paymentService, setPaymentService] = useState<string>("");
  const [paymentAmount, setPaymentAmount] = useState<string>("10");
  const [paymentNetwork, setPaymentNetwork] = useState<"base" | "polygon" | "solana">("base");
  const [isExecutingPayment, setIsExecutingPayment] = useState(false);

  // Query hooks
  const sessionStatusQuery = trpc.coinbaseMCP.getSessionStatus.useQuery(
    { sessionId },
    { enabled: !!sessionId }
  );

  const discoverServicesQuery = trpc.coinbaseMCP.discoverServices.useQuery(undefined, {
    enabled: true,
  });

  const configQuery = trpc.coinbaseMCP.getConfig.useQuery(undefined, {
    enabled: true,
  });

  // Mutation hooks
  const createSessionMutation = trpc.coinbaseMCP.createSession.useMutation({
    onSuccess: (data) => {
      if (data.session) {
        setSessionId(data.session.sessionId);
        showSuccess(`Session created: ${data.session.sessionId.slice(0, 20)}...`, "Session Created");
      }
    },
    onError: (error) => {
      showError(error, "Failed to Create Session");
      setIsCreatingSession(false);
    },
  });

  const executePaymentMutation = trpc.coinbaseMCP.executePayment.useMutation({
    onSuccess: (data) => {
      if (data.payment) {
        showSuccess(
          `Payment executed: ${data.payment.transactionHash?.slice(0, 20)}...`,
          "Payment Successful"
        );
        setPaymentService("");
        setPaymentAmount("10");
      }
    },
    onError: (error) => {
      showError(error, "Payment Failed");
      setIsExecutingPayment(false);
    },
  });

  // Handlers
  const handleCreateSession = async () => {
    if (!agentId.trim()) {
      showWarning("Please enter an agent ID", "Validation Error");
      return;
    }

    try {
      setIsCreatingSession(true);
      await createSessionMutation.mutateAsync({
        agentId,
        durationMinutes: 60,
      });
    } catch (error) {
      showError(error, "Session Creation Error");
    } finally {
      setIsCreatingSession(false);
    }
  };

  const handleExecutePayment = async () => {
    if (!sessionId) {
      showWarning("Please create a session first", "No Active Session");
      return;
    }

    if (!paymentService.trim()) {
      showWarning("Please enter a service name", "Validation Error");
      return;
    }

    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      showWarning("Please enter a valid amount", "Validation Error");
      return;
    }

    try {
      setIsExecutingPayment(true);
      await executePaymentMutation.mutateAsync({
        sessionId,
        service: paymentService,
        amount,
        network: paymentNetwork,
        type: "service_payment",
      });
    } catch (error) {
      showError(error, "Payment Execution Error");
    } finally {
      setIsExecutingPayment(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Coinbase Wallet Integration</h1>
        <p className="text-muted-foreground">
          Manage autonomous agent payments with Coinbase MCP
        </p>
      </div>

      {/* Configuration Status */}
      {configQuery.data && (
        <Card className="p-4 border-blue-200 bg-blue-50">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-semibold text-blue-900">System Status</h3>
              <p className="text-sm text-blue-800">
                Networks: {configQuery.data.networks.join(", ")}
              </p>
              <p className="text-sm text-blue-800">
                Spending Limit: ${configQuery.data.spendingLimitPerCall} per call
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Session Management */}
      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">Session Management</h2>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-2">Agent ID</label>
            <Input
              value={agentId}
              onChange={(e) => setAgentId(e.target.value)}
              placeholder="e.g., agent-001"
              disabled={!!sessionId}
            />
          </div>

          <Button
            onClick={handleCreateSession}
            disabled={isCreatingSession || !!sessionId}
            className="w-full"
          >
            {isCreatingSession ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating Session...
              </>
            ) : sessionId ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Session Active
              </>
            ) : (
              "Create Session"
            )}
          </Button>
        </div>

        {sessionId && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm font-mono text-green-900">Session: {sessionId}</p>
          </div>
        )}

        {sessionStatusQuery.data && (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Spent:</span>
              <span className="font-semibold">${sessionStatusQuery.data.totalSpent}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Remaining:</span>
              <span className="font-semibold text-green-600">
                ${sessionStatusQuery.data.remaining}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Operations:</span>
              <span className="font-semibold">{sessionStatusQuery.data.operationCount}</span>
            </div>
          </div>
        )}
      </Card>

      {/* Payment Execution */}
      {sessionId && (
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Execute Payment</h2>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-2">Service</label>
              <Input
                value={paymentService}
                onChange={(e) => setPaymentService(e.target.value)}
                placeholder="e.g., news-api, crypto-data-api"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-2">Amount (USDC)</label>
                <Input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  min="0"
                  step="0.01"
                  placeholder="10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Network</label>
                <select
                  value={paymentNetwork}
                  onChange={(e) => setPaymentNetwork(e.target.value as any)}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                >
                  <option value="base">Base</option>
                  <option value="polygon">Polygon</option>
                  <option value="solana">Solana</option>
                </select>
              </div>
            </div>

            <Button
              onClick={handleExecutePayment}
              disabled={isExecutingPayment}
              className="w-full"
            >
              {isExecutingPayment ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Execute Payment"
              )}
            </Button>
          </div>
        </Card>
      )}

      {/* Available Services */}
      {discoverServicesQuery.data && (
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Available Services</h2>

          <div className="space-y-2">
            {discoverServicesQuery.data.services.length > 0 ? (
              discoverServicesQuery.data.services.map((service) => (
                <div
                  key={service.id}
                  className="p-3 border rounded-lg hover:bg-muted cursor-pointer"
                  onClick={() => {
                    setPaymentService(service.id);
                    setPaymentAmount(service.pricePerCall.toString());
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-sm">{service.name}</p>
                      <p className="text-xs text-muted-foreground">{service.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">${service.pricePerCall}</p>
                      <p className="text-xs text-muted-foreground">{service.network}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-yellow-800">No services available</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Error Display */}
      {executePaymentMutation.isError && (
        <Card className="p-4 border-red-200 bg-red-50">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-semibold text-red-900">Error</h3>
              <p className="text-sm text-red-800">
                {executePaymentMutation.error?.message || "An error occurred"}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
