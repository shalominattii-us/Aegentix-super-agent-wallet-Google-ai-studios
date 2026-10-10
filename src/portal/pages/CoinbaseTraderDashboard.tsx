import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, Loader2, Zap, Wallet } from 'lucide-react';
import { trpc } from '@/lib/trpc';

export function CoinbaseTraderDashboard() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [jobId, setJobId] = useState<string>('');
  const [transactionHash, setTransactionHash] = useState<string>('');
  const [auditHash, setAuditHash] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [walletAddress, setWalletAddress] = useState<string>('');

  // Get wallet address on mount
  useEffect(() => {
    const getWallet = async () => {
      try {
        const response = await fetch('/api/trpc/coinbaseTrader.getWalletAddress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        if (data.result?.data?.walletAddress) {
          setWalletAddress(data.result.data.walletAddress);
        }
      } catch (err) {
        console.error('Failed to get wallet address:', err);
      }
    };
    getWallet();
  }, []);

  const executeTransfer = async () => {
    setStatus('loading');
    setError('');
    setJobId('');
    setTransactionHash('');
    setAuditHash('');

    try {
      const response = await fetch('/api/trpc/coinbaseTrader.executeUSDCTransfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          destinationAddress: '0x6e7EAcc64eFC1f38f26eF88689D04770400627dd',
          amount: '1000',
        }),
      });

      const data = await response.json();

      if (data.result?.data?.success) {
        const result = data.result.data;
        setJobId(result.jobId || '');
        setTransactionHash(result.transactionHash || '');
        setAuditHash(result.auditHash || '');
        setStatus('success');
      } else {
        setError(data.result?.error?.message || 'Transfer failed');
        setStatus('error');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-cyan-400 mb-2 flex items-center gap-2">
            <Zap className="w-8 h-8" />
            Coinbase Trader Agent
          </h1>
          <p className="text-slate-300">Autonomous USDC transfer via Coinbase CDP API</p>
        </div>

        {/* Agent Status Card */}
        <Card className="bg-slate-800 border-slate-700 mb-6 p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-cyan-400">Agent Status</h2>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400">Active</span>
              </div>
            </div>

            {walletAddress && (
              <div className="p-4 bg-slate-700 rounded">
                <p className="text-sm text-slate-400 mb-1 flex items-center gap-2">
                  <Wallet className="w-4 h-4" />
                  Agent Wallet
                </p>
                <p className="font-mono text-cyan-300 text-sm break-all">{walletAddress}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Transfer Configuration Card */}
        <Card className="bg-slate-800 border-slate-700 mb-6 p-6">
          <h2 className="text-xl font-bold text-cyan-400 mb-4">Transfer Configuration</h2>

          <div className="space-y-4">
            {/* Configuration Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-400">Amount</p>
                <p className="text-2xl font-bold text-cyan-400">$1,000</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Currency</p>
                <p className="text-2xl font-bold text-cyan-400">USDC</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-slate-400">Destination</p>
                <p className="text-sm font-mono text-cyan-300 break-all">
                  0x6e7EAcc64eFC1f38f26eF88689D04770400627dd
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-slate-400">Network</p>
                <p className="text-lg font-bold text-cyan-400">Polygon (MATIC)</p>
              </div>
            </div>

            {/* Status Messages */}
            {status === 'loading' && (
              <div className="flex items-center gap-2 p-4 bg-blue-900/30 border border-blue-700 rounded">
                <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
                <p className="text-blue-300">Agent executing transfer...</p>
              </div>
            )}

            {status === 'success' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 p-4 bg-green-900/30 border border-green-700 rounded">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <p className="text-green-300">Transfer successful!</p>
                </div>

                {jobId && (
                  <div className="p-4 bg-slate-700 rounded">
                    <p className="text-sm text-slate-400 mb-1">Job ID</p>
                    <p className="font-mono text-cyan-300 text-sm break-all">{jobId}</p>
                  </div>
                )}

                {transactionHash && (
                  <div className="p-4 bg-slate-700 rounded">
                    <p className="text-sm text-slate-400 mb-1">Transaction Hash</p>
                    <p className="font-mono text-cyan-300 text-sm break-all">{transactionHash}</p>
                  </div>
                )}

                {auditHash && (
                  <div className="p-4 bg-slate-700 rounded">
                    <p className="text-sm text-slate-400 mb-1">Audit Hash</p>
                    <p className="font-mono text-cyan-300 text-sm break-all">{auditHash}</p>
                  </div>
                )}
              </div>
            )}

            {status === 'error' && (
              <div className="flex items-center gap-2 p-4 bg-red-900/30 border border-red-700 rounded">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <p className="text-red-300">{error}</p>
              </div>
            )}

            {/* Execute Button */}
            <Button
              onClick={executeTransfer}
              disabled={status === 'loading'}
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 rounded"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Agent Executing...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Execute $1,000 Transfer
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Info Card */}
        <Card className="bg-slate-800 border-slate-700 p-6">
          <h3 className="text-lg font-bold text-cyan-400 mb-3">Agent Capabilities</h3>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>✅ Autonomous USDC transfer execution</li>
            <li>✅ Coinbase CDP API integration</li>
            <li>✅ Non-custodial wallet management</li>
            <li>✅ Real-time transaction tracking</li>
            <li>✅ Immutable audit trail</li>
            <li>✅ Multi-sig coordination ready</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
