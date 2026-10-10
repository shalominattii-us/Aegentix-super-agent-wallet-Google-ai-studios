import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Download, Shield, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import ErrorBoundary from '@/components/ErrorBoundary';

interface LedgerTransaction {
  id: string;
  txHash: string;
  type: 'transaction' | 'verification' | 'attestation' | 'signing';
  status: 'pending' | 'confirmed' | 'failed';
  from: string;
  to: string;
  amount: number;
  chain: string;
  timestamp: string;
  signature: string;
  blockHeight?: number;
  confirmations?: number;
}

interface VerificationResult {
  txHash: string;
  isValid: boolean;
  sha256: string;
  signatureValid: boolean;
  timestamp: string;
  verifier: string;
}

export default function SovereignLedger() {
  const [transactions, setTransactions] = useState<LedgerTransaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<LedgerTransaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChain, setSelectedChain] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [verificationResults, setVerificationResults] = useState<Map<string, VerificationResult>>(new Map());
  const [loading, setLoading] = useState(true);

  // Mock ledger data
  useEffect(() => {
    const mockTransactions: LedgerTransaction[] = [
      {
        id: 'ledger-1',
        txHash: '0x' + 'a'.repeat(64),
        type: 'transaction',
        status: 'confirmed',
        from: '0x' + 'b'.repeat(40),
        to: '0x' + 'c'.repeat(40),
        amount: 1000.50,
        chain: 'Ethereum',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        signature: 'sig_' + 'a'.repeat(32),
        blockHeight: 18500000,
        confirmations: 12,
      },
      {
        id: 'ledger-2',
        txHash: '0x' + 'd'.repeat(64),
        type: 'attestation',
        status: 'confirmed',
        from: '0x' + 'e'.repeat(40),
        to: '0x' + 'f'.repeat(40),
        amount: 500.00,
        chain: 'Solana',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        signature: 'sig_' + 'b'.repeat(32),
        blockHeight: 250000000,
        confirmations: 50,
      },
      {
        id: 'ledger-3',
        txHash: '0x' + '1'.repeat(64),
        type: 'signing',
        status: 'pending',
        from: '0x' + '2'.repeat(40),
        to: '0x' + '3'.repeat(40),
        amount: 250.75,
        chain: 'Polygon',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        signature: 'sig_' + 'c'.repeat(32),
      },
      {
        id: 'ledger-4',
        txHash: '0x' + '4'.repeat(64),
        type: 'verification',
        status: 'confirmed',
        from: '0x' + '5'.repeat(40),
        to: '0x' + '6'.repeat(40),
        amount: 2000.00,
        chain: 'Bitcoin',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        signature: 'sig_' + 'd'.repeat(32),
        blockHeight: 850000,
        confirmations: 100,
      },
    ];

    setTransactions(mockTransactions);
    setFilteredTransactions(mockTransactions);
    setLoading(false);
  }, []);

  // Filter transactions
  useEffect(() => {
    let filtered = transactions;

    if (selectedChain !== 'all') {
      filtered = filtered.filter((tx) => tx.chain === selectedChain);
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter((tx) => tx.status === selectedStatus);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (tx) =>
          tx.txHash.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tx.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tx.to.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTransactions(filtered);
  }, [transactions, searchTerm, selectedChain, selectedStatus]);

  const verifyTransaction = (tx: LedgerTransaction) => {
    // Simulate verification
    const result: VerificationResult = {
      txHash: tx.txHash,
      isValid: tx.status === 'confirmed',
      sha256: 'sha256_' + Math.random().toString(36).substr(2, 16),
      signatureValid: true,
      timestamp: new Date().toISOString(),
      verifier: 'SOVEREIGN_LEDGER_VERIFIER_V1',
    };

    setVerificationResults(new Map(verificationResults).set(tx.id, result));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'transaction':
        return 'bg-blue-100 text-blue-800';
      case 'attestation':
        return 'bg-purple-100 text-purple-800';
      case 'signing':
        return 'bg-orange-100 text-orange-800';
      case 'verification':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const chains = ['all', ...Array.from(new Set(transactions.map((tx) => tx.chain)))];
  const statuses = ['all', 'confirmed', 'pending', 'failed'];

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-8 h-8 text-blue-400" />
              <h1 className="text-4xl font-bold text-white">Sovereign Ledger</h1>
            </div>
            <p className="text-slate-400">Immutable transaction history and verification</p>
          </div>

          {/* Search and Filters */}
          <Card className="mb-6 bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Search & Filter</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4 flex-wrap">
                <div className="flex-1 min-w-64">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                    <Input
                      placeholder="Search by tx hash, address..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-slate-500"
                    />
                  </div>
                </div>
                <select
                  value={selectedChain}
                  onChange={(e) => setSelectedChain(e.target.value)}
                  className="px-4 py-2 bg-slate-700 border border-slate-600 text-white rounded-md"
                >
                  {chains.map((chain) => (
                    <option key={chain} value={chain}>
                      {chain === 'all' ? 'All Chains' : chain}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-2 bg-slate-700 border border-slate-600 text-white rounded-md"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Transactions Table */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-white">Transactions ({filteredTransactions.length})</CardTitle>
                  <CardDescription>Complete immutable ledger of all operations</CardDescription>
                </div>
                <Button variant="outline" className="gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-slate-400">Loading ledger...</div>
              ) : filteredTransactions.length === 0 ? (
                <div className="text-center py-8 text-slate-400">No transactions found</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left py-3 px-4 text-slate-300 font-semibold">TX Hash</th>
                        <th className="text-left py-3 px-4 text-slate-300 font-semibold">Type</th>
                        <th className="text-left py-3 px-4 text-slate-300 font-semibold">Status</th>
                        <th className="text-left py-3 px-4 text-slate-300 font-semibold">Amount</th>
                        <th className="text-left py-3 px-4 text-slate-300 font-semibold">Chain</th>
                        <th className="text-left py-3 px-4 text-slate-300 font-semibold">Time</th>
                        <th className="text-left py-3 px-4 text-slate-300 font-semibold">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTransactions.map((tx) => (
                        <tr key={tx.id} className="border-b border-slate-700 hover:bg-slate-700/50 transition">
                          <td className="py-3 px-4">
                            <code className="text-xs text-blue-400 font-mono">{tx.txHash.slice(0, 16)}...</code>
                          </td>
                          <td className="py-3 px-4">
                            <Badge className={getTypeColor(tx.type)}>{tx.type}</Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(tx.status)}
                              <span className="text-slate-300">{tx.status}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-slate-300">{tx.amount.toFixed(2)}</td>
                          <td className="py-3 px-4">
                            <Badge variant="outline">{tx.chain}</Badge>
                          </td>
                          <td className="py-3 px-4 text-slate-400 text-xs">
                            {new Date(tx.timestamp).toLocaleString()}
                          </td>
                          <td className="py-3 px-4">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => verifyTransaction(tx)}
                              className="text-xs"
                            >
                              Verify
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Verification Results */}
          {verificationResults.size > 0 && (
            <Card className="mt-6 bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Verification Results</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue={Array.from(verificationResults.keys())[0]} className="w-full">
                  <TabsList className="bg-slate-700">
                    {Array.from(verificationResults.entries()).map(([txId, result]) => (
                      <TabsTrigger key={txId} value={txId} className="text-xs">
                        {result.txHash.slice(0, 8)}...
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {Array.from(verificationResults.entries()).map(([txId, result]) => (
                    <TabsContent key={txId} value={txId} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-700 p-4 rounded-lg">
                          <p className="text-slate-400 text-sm mb-2">TX Hash</p>
                          <code className="text-blue-400 font-mono text-xs break-all">{result.txHash}</code>
                        </div>
                        <div className="bg-slate-700 p-4 rounded-lg">
                          <p className="text-slate-400 text-sm mb-2">Verification Status</p>
                          <div className="flex items-center gap-2">
                            {result.isValid ? (
                              <>
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                <span className="text-green-400">Valid</span>
                              </>
                            ) : (
                              <>
                                <AlertCircle className="w-5 h-5 text-red-500" />
                                <span className="text-red-400">Invalid</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="bg-slate-700 p-4 rounded-lg">
                          <p className="text-slate-400 text-sm mb-2">SHA256 Hash</p>
                          <code className="text-green-400 font-mono text-xs break-all">{result.sha256}</code>
                        </div>
                        <div className="bg-slate-700 p-4 rounded-lg">
                          <p className="text-slate-400 text-sm mb-2">Signature Valid</p>
                          <div className="flex items-center gap-2">
                            {result.signatureValid ? (
                              <>
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                <span className="text-green-400">Yes</span>
                              </>
                            ) : (
                              <>
                                <AlertCircle className="w-5 h-5 text-red-500" />
                                <span className="text-red-400">No</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="col-span-2 bg-slate-700 p-4 rounded-lg">
                          <p className="text-slate-400 text-sm mb-2">Verified By</p>
                          <p className="text-slate-300">{result.verifier}</p>
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}
