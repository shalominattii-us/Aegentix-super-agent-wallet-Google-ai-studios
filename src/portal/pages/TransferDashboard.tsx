import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, Loader2, Zap } from 'lucide-react';

export function TransferDashboard() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [transactionId, setTransactionId] = useState<string>('');
  const [auditHash, setAuditHash] = useState<string>('');
  const [error, setError] = useState<string>('');

  const executeTransfer = async () => {
    setStatus('loading');
    setError('');
    setTransactionId('');
    setAuditHash('');

    try {
      const response = await fetch('/api/trpc/treasury.executeTransfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: '1000',
          destinationAddress: '0x6e7EAcc64eFC1f38f26eF88689D04770400627dd',
          description: 'AEGENTIS Browser Transfer',
        }),
      });

      const data = await response.json();

      if (data.result?.ok) {
        const result = data.result.data;
        setTransactionId(result.transactionId || 'pending');
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
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-cyan-400 mb-2 flex items-center gap-2">
            <Zap className="w-8 h-8" />
            AEGENTIS Treasury Transfer
          </h1>
          <p className="text-slate-300">Execute $1,000 USDC transfer to Polygon wallet</p>
        </div>

        {/* Transfer Card */}
        <Card className="bg-slate-800 border-slate-700 mb-6 p-6">
          <div className="space-y-4">
            {/* Configuration */}
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
              <div className="col-span-2">
                <p className="text-sm text-slate-400">Multi-Sig</p>
                <p className="text-lg font-bold text-cyan-400">1-of-5</p>
              </div>
            </div>

            {/* Status Messages */}
            {status === 'loading' && (
              <div className="flex items-center gap-2 p-4 bg-blue-900/30 border border-blue-700 rounded">
                <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
                <p className="text-blue-300">Executing transfer...</p>
              </div>
            )}

            {status === 'success' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 p-4 bg-green-900/30 border border-green-700 rounded">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <p className="text-green-300">Transfer successful!</p>
                </div>

                {transactionId && (
                  <div className="p-4 bg-slate-700 rounded">
                    <p className="text-sm text-slate-400 mb-1">Transaction ID</p>
                    <p className="font-mono text-cyan-300 text-sm break-all">{transactionId}</p>
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
                  Executing Transfer...
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
          <h3 className="text-lg font-bold text-cyan-400 mb-3">Transfer Details</h3>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>✅ Amount: $1,000 USDC</li>
            <li>✅ Network: Polygon (MATIC)</li>
            <li>✅ Multi-Sig: 1-of-5 federation nodes</li>
            <li>✅ Destination: Your Polygon wallet</li>
            <li>✅ Status: Ready to execute</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
