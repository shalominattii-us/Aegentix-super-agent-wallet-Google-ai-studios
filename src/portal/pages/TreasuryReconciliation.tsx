import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertCircle, Clock, TrendingUp, Download } from 'lucide-react';
import ErrorBoundary from '@/components/ErrorBoundary';

interface ChainReconciliation {
  chain: string;
  symbol: string;
  expectedBalance: number;
  actualBalance: number;
  difference: number;
  status: 'reconciled' | 'pending' | 'discrepancy' | 'error';
  lastVerified: string;
  verificationHash: string;
  walletAddress: string;
}

interface ReconciliationReport {
  id: string;
  date: string;
  totalExpected: number;
  totalActual: number;
  discrepancies: number;
  status: 'completed' | 'in-progress' | 'failed';
  chains: ChainReconciliation[];
}

export default function TreasuryReconciliation() {
  const [reports, setReports] = useState<ReconciliationReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<ReconciliationReport | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock data initialization
  useEffect(() => {
    const mockReports: ReconciliationReport[] = [
      {
        id: 'recon-1',
        date: new Date().toISOString(),
        totalExpected: 125500000,
        totalActual: 125500000,
        discrepancies: 0,
        status: 'completed',
        chains: [
          {
            chain: 'Ethereum',
            symbol: 'ETH',
            expectedBalance: 50000000,
            actualBalance: 50000000,
            difference: 0,
            status: 'reconciled',
            lastVerified: new Date().toISOString(),
            verificationHash: '0x' + 'a'.repeat(64),
            walletAddress: '0x' + 'b'.repeat(40),
          },
          {
            chain: 'Solana',
            symbol: 'SOL',
            expectedBalance: 35000000,
            actualBalance: 35000000,
            difference: 0,
            status: 'reconciled',
            lastVerified: new Date().toISOString(),
            verificationHash: '0x' + 'c'.repeat(64),
            walletAddress: 'So1ana' + 'd'.repeat(34),
          },
          {
            chain: 'Bitcoin',
            symbol: 'BTC',
            expectedBalance: 25000000,
            actualBalance: 25000000,
            difference: 0,
            status: 'reconciled',
            lastVerified: new Date().toISOString(),
            verificationHash: '0x' + 'e'.repeat(64),
            walletAddress: '1' + 'f'.repeat(33),
          },
          {
            chain: 'Polygon',
            symbol: 'MATIC',
            expectedBalance: 15500000,
            actualBalance: 15500000,
            difference: 0,
            status: 'reconciled',
            lastVerified: new Date().toISOString(),
            verificationHash: '0x' + 'g'.repeat(64),
            walletAddress: '0x' + 'h'.repeat(40),
          },
        ],
      },
      {
        id: 'recon-2',
        date: new Date(Date.now() - 86400000).toISOString(),
        totalExpected: 125000000,
        totalActual: 124999500,
        discrepancies: 1,
        status: 'completed',
        chains: [
          {
            chain: 'Ethereum',
            symbol: 'ETH',
            expectedBalance: 50000000,
            actualBalance: 49999800,
            difference: -200,
            status: 'discrepancy',
            lastVerified: new Date(Date.now() - 86400000).toISOString(),
            verificationHash: '0x' + 'i'.repeat(64),
            walletAddress: '0x' + 'j'.repeat(40),
          },
          {
            chain: 'Solana',
            symbol: 'SOL',
            expectedBalance: 35000000,
            actualBalance: 35000000,
            difference: 0,
            status: 'reconciled',
            lastVerified: new Date(Date.now() - 86400000).toISOString(),
            verificationHash: '0x' + 'k'.repeat(64),
            walletAddress: 'So1ana' + 'l'.repeat(34),
          },
          {
            chain: 'Bitcoin',
            symbol: 'BTC',
            expectedBalance: 25000000,
            actualBalance: 25000000,
            difference: 0,
            status: 'reconciled',
            lastVerified: new Date(Date.now() - 86400000).toISOString(),
            verificationHash: '0x' + 'm'.repeat(64),
            walletAddress: '1' + 'n'.repeat(33),
          },
          {
            chain: 'Polygon',
            symbol: 'MATIC',
            expectedBalance: 15000000,
            actualBalance: 15000000,
            difference: 0,
            status: 'reconciled',
            lastVerified: new Date(Date.now() - 86400000).toISOString(),
            verificationHash: '0x' + 'o'.repeat(64),
            walletAddress: '0x' + 'p'.repeat(40),
          },
        ],
      },
      {
        id: 'recon-3',
        date: new Date(Date.now() - 172800000).toISOString(),
        totalExpected: 124500000,
        totalActual: 124500000,
        discrepancies: 0,
        status: 'completed',
        chains: [
          {
            chain: 'Ethereum',
            symbol: 'ETH',
            expectedBalance: 49500000,
            actualBalance: 49500000,
            difference: 0,
            status: 'reconciled',
            lastVerified: new Date(Date.now() - 172800000).toISOString(),
            verificationHash: '0x' + 'q'.repeat(64),
            walletAddress: '0x' + 'r'.repeat(40),
          },
          {
            chain: 'Solana',
            symbol: 'SOL',
            expectedBalance: 35000000,
            actualBalance: 35000000,
            difference: 0,
            status: 'reconciled',
            lastVerified: new Date(Date.now() - 172800000).toISOString(),
            verificationHash: '0x' + 's'.repeat(64),
            walletAddress: 'So1ana' + 't'.repeat(34),
          },
          {
            chain: 'Bitcoin',
            symbol: 'BTC',
            expectedBalance: 25000000,
            actualBalance: 25000000,
            difference: 0,
            status: 'reconciled',
            lastVerified: new Date(Date.now() - 172800000).toISOString(),
            verificationHash: '0x' + 'u'.repeat(64),
            walletAddress: '1' + 'v'.repeat(33),
          },
          {
            chain: 'Polygon',
            symbol: 'MATIC',
            expectedBalance: 15000000,
            actualBalance: 15000000,
            difference: 0,
            status: 'reconciled',
            lastVerified: new Date(Date.now() - 172800000).toISOString(),
            verificationHash: '0x' + 'w'.repeat(64),
            walletAddress: '0x' + 'x'.repeat(40),
          },
        ],
      },
    ];

    setReports(mockReports);
    setSelectedReport(mockReports[0]);
    setLoading(false);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'reconciled':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'discrepancy':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const reconciliationRate = selectedReport
    ? ((selectedReport.chains.length - selectedReport.discrepancies) / selectedReport.chains.length) * 100
    : 0;

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-8 h-8 text-emerald-400" />
              <h1 className="text-4xl font-bold text-white">Treasury Reconciliation</h1>
            </div>
            <p className="text-slate-400">Multi-chain balance verification and audit trail</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Reports List */}
            <div className="lg:col-span-2">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Reconciliation Reports</CardTitle>
                  <CardDescription>Historical treasury reconciliation records</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8 text-slate-400">Loading reports...</div>
                  ) : (
                    <div className="space-y-4">
                      {reports.map((report) => (
                        <div
                          key={report.id}
                          onClick={() => setSelectedReport(report)}
                          className={`border rounded-lg p-4 cursor-pointer transition ${
                            selectedReport?.id === report.id
                              ? 'border-emerald-500 bg-slate-700'
                              : 'border-slate-700 hover:bg-slate-700/50'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-white font-semibold">
                                {new Date(report.date).toLocaleDateString()} - {new Date(report.date).toLocaleTimeString()}
                              </h3>
                              <p className="text-sm text-slate-400 mt-1">
                                {report.chains.length} chains verified
                              </p>
                            </div>
                            <Badge
                              className={
                                report.status === 'completed'
                                  ? 'bg-green-600'
                                  : report.status === 'in-progress'
                                    ? 'bg-yellow-600'
                                    : 'bg-red-600'
                              }
                            >
                              {report.status}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-slate-400">Expected</span>
                              <p className="text-white font-semibold">${(report.totalExpected / 1000000).toFixed(2)}M</p>
                            </div>
                            <div>
                              <span className="text-slate-400">Actual</span>
                              <p className="text-white font-semibold">${(report.totalActual / 1000000).toFixed(2)}M</p>
                            </div>
                            <div>
                              <span className="text-slate-400">Discrepancies</span>
                              <p className={report.discrepancies === 0 ? 'text-green-400 font-semibold' : 'text-red-400 font-semibold'}>
                                {report.discrepancies}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Report Details */}
            {selectedReport && (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Report Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Reconciliation Rate */}
                  <div>
                    <p className="text-slate-400 text-sm mb-2">Reconciliation Rate</p>
                    <Progress value={reconciliationRate} className="h-3" />
                    <p className="text-xs text-slate-500 mt-2">{reconciliationRate.toFixed(1)}% reconciled</p>
                  </div>

                  {/* Totals */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Expected Total</span>
                      <span className="text-white font-semibold">
                        ${(selectedReport.totalExpected / 1000000).toFixed(2)}M
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Actual Total</span>
                      <span className="text-white font-semibold">
                        ${(selectedReport.totalActual / 1000000).toFixed(2)}M
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-slate-700">
                      <span className="text-slate-400">Variance</span>
                      <span className={selectedReport.totalExpected === selectedReport.totalActual ? 'text-green-400 font-semibold' : 'text-red-400 font-semibold'}>
                        ${((selectedReport.totalActual - selectedReport.totalExpected) / 1000000).toFixed(2)}M
                      </span>
                    </div>
                  </div>

                  {/* Chain Summary */}
                  <div>
                    <p className="text-slate-400 text-sm mb-3">Chain Status</p>
                    <div className="space-y-2">
                      {selectedReport.chains.map((chain) => (
                        <div key={chain.chain} className="flex items-center justify-between p-2 bg-slate-700/50 rounded">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(chain.status)}
                            <span className="text-sm text-slate-300">{chain.chain}</span>
                          </div>
                          <span className="text-xs text-slate-400">${(chain.actualBalance / 1000000).toFixed(2)}M</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t border-slate-700">
                    <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Verify
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Chain Details Table */}
          {selectedReport && (
            <Card className="mt-6 bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Chain Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-slate-700">
                      <tr>
                        <th className="text-left py-3 px-4 text-slate-400">Chain</th>
                        <th className="text-right py-3 px-4 text-slate-400">Expected</th>
                        <th className="text-right py-3 px-4 text-slate-400">Actual</th>
                        <th className="text-right py-3 px-4 text-slate-400">Difference</th>
                        <th className="text-left py-3 px-4 text-slate-400">Status</th>
                        <th className="text-left py-3 px-4 text-slate-400">Verified</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedReport.chains.map((chain) => (
                        <tr key={chain.chain} className="border-b border-slate-700 hover:bg-slate-700/30">
                          <td className="py-3 px-4 text-white">{chain.chain}</td>
                          <td className="text-right py-3 px-4 text-slate-300">${(chain.expectedBalance / 1000000).toFixed(2)}M</td>
                          <td className="text-right py-3 px-4 text-slate-300">${(chain.actualBalance / 1000000).toFixed(2)}M</td>
                          <td className={`text-right py-3 px-4 font-semibold ${chain.difference === 0 ? 'text-green-400' : 'text-red-400'}`}>
                            ${(chain.difference / 1000000).toFixed(2)}M
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(chain.status)}
                              <span className="text-slate-300 capitalize">{chain.status}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-xs text-slate-500">
                            {new Date(chain.lastVerified).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}
