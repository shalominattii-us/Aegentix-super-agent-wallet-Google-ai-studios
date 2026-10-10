import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, TrendingUp, Lock, Globe, CheckCircle, Clock } from 'lucide-react';
import ErrorBoundary from '@/components/ErrorBoundary';

interface WalletCustody {
  id: string;
  name: string;
  chain: string;
  address: string;
  balance: number;
  status: 'active' | 'locked' | 'pending';
  kycStatus: 'verified' | 'pending' | 'rejected';
  lastUpdated: string;
}

interface ComplianceAlert {
  id: string;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  timestamp: string;
  resolved: boolean;
}

interface CBDCTransaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: string;
  kycVerified: boolean;
}

export default function TreasuryDashboard() {
  const [wallets, setWallets] = useState<WalletCustody[]>([]);
  const [alerts, setAlerts] = useState<ComplianceAlert[]>([]);
  const [transactions, setTransactions] = useState<CBDCTransaction[]>([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  // Mock data initialization
  useEffect(() => {
    const mockWallets: WalletCustody[] = [
      {
        id: 'wallet-1',
        name: 'Ethereum Custody',
        chain: 'Ethereum',
        address: '0x' + 'a'.repeat(40),
        balance: 50000.00,
        status: 'active',
        kycStatus: 'verified',
        lastUpdated: new Date(Date.now() - 300000).toISOString(),
      },
      {
        id: 'wallet-2',
        name: 'Solana Custody',
        chain: 'Solana',
        address: 'Sol' + 'b'.repeat(40),
        balance: 75000.00,
        status: 'active',
        kycStatus: 'verified',
        lastUpdated: new Date(Date.now() - 600000).toISOString(),
      },
      {
        id: 'wallet-3',
        name: 'Polygon Custody',
        chain: 'Polygon',
        address: '0x' + 'c'.repeat(40),
        balance: 30000.00,
        status: 'active',
        kycStatus: 'verified',
        lastUpdated: new Date(Date.now() - 900000).toISOString(),
      },
      {
        id: 'wallet-4',
        name: 'Bitcoin Custody',
        chain: 'Bitcoin',
        address: '1' + 'd'.repeat(33),
        balance: 120000.00,
        status: 'locked',
        kycStatus: 'verified',
        lastUpdated: new Date(Date.now() - 1800000).toISOString(),
      },
      {
        id: 'wallet-5',
        name: 'Cosmos Custody',
        chain: 'Cosmos',
        address: 'cosmos' + 'e'.repeat(40),
        balance: 45000.00,
        status: 'pending',
        kycStatus: 'pending',
        lastUpdated: new Date(Date.now() - 3600000).toISOString(),
      },
    ];

    const mockAlerts: ComplianceAlert[] = [
      {
        id: 'alert-1',
        severity: 'warning',
        title: 'High-Risk Jurisdiction Transaction',
        description: 'Transaction from wallet-3 to sanctioned jurisdiction detected',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        resolved: false,
      },
      {
        id: 'alert-2',
        severity: 'info',
        title: 'KYC Verification Pending',
        description: 'Cosmos Custody wallet pending KYC verification',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        resolved: false,
      },
      {
        id: 'alert-3',
        severity: 'critical',
        title: 'Multi-Sig Threshold Alert',
        description: 'Bitcoin Custody requires 3 of 5 signatures for withdrawal',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        resolved: true,
      },
    ];

    const mockTransactions: CBDCTransaction[] = [
      {
        id: 'cbdc-1',
        from: 'wallet-1',
        to: 'recipient-001',
        amount: 5000.00,
        status: 'confirmed',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        kycVerified: true,
      },
      {
        id: 'cbdc-2',
        from: 'wallet-2',
        to: 'recipient-002',
        amount: 10000.00,
        status: 'pending',
        timestamp: new Date(Date.now() - 600000).toISOString(),
        kycVerified: true,
      },
      {
        id: 'cbdc-3',
        from: 'wallet-3',
        to: 'recipient-003',
        amount: 7500.00,
        status: 'confirmed',
        timestamp: new Date(Date.now() - 900000).toISOString(),
        kycVerified: true,
      },
    ];

    setWallets(mockWallets);
    setAlerts(mockAlerts);
    setTransactions(mockTransactions);
    setTotalBalance(mockWallets.reduce((sum, w) => sum + w.balance, 0));
    setLoading(false);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'locked':
        return <Lock className="w-4 h-4 text-yellow-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const activeWallets = wallets.filter((w) => w.status === 'active').length;
  const verifiedKYC = wallets.filter((w) => w.kycStatus === 'verified').length;
  const pendingAlerts = alerts.filter((a) => !a.resolved).length;

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Globe className="w-8 h-8 text-emerald-400" />
              <h1 className="text-4xl font-bold text-white">Treasury Dashboard</h1>
            </div>
            <p className="text-slate-400">Multi-chain custody, CBDC operations, and compliance monitoring</p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="pt-6">
                <div className="text-slate-400 text-sm mb-2">Total Balance</div>
                <div className="text-3xl font-bold text-white">${totalBalance.toLocaleString('en-US', { maximumFractionDigits: 2 })}</div>
                <div className="text-xs text-slate-500 mt-2">Across all chains</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="pt-6">
                <div className="text-slate-400 text-sm mb-2">Active Wallets</div>
                <div className="text-3xl font-bold text-emerald-400">{activeWallets}</div>
                <div className="text-xs text-slate-500 mt-2">of {wallets.length} total</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="pt-6">
                <div className="text-slate-400 text-sm mb-2">KYC Verified</div>
                <div className="text-3xl font-bold text-blue-400">{verifiedKYC}</div>
                <div className="text-xs text-slate-500 mt-2">Wallets verified</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="pt-6">
                <div className="text-slate-400 text-sm mb-2">Compliance Alerts</div>
                <div className={`text-3xl font-bold ${pendingAlerts > 0 ? 'text-red-400' : 'text-green-400'}`}>
                  {pendingAlerts}
                </div>
                <div className="text-xs text-slate-500 mt-2">Pending review</div>
              </CardContent>
            </Card>
          </div>

          {/* Main Tabs */}
          <Tabs defaultValue="custody" className="w-full">
            <TabsList className="bg-slate-800 border-b border-slate-700 w-full justify-start rounded-none">
              <TabsTrigger value="custody" className="rounded-none">
                Multi-Chain Custody
              </TabsTrigger>
              <TabsTrigger value="cbdc" className="rounded-none">
                CBDC Transactions
              </TabsTrigger>
              <TabsTrigger value="treasury-labs" className="rounded-none">
                Treasury Labs
              </TabsTrigger>
              <TabsTrigger value="compliance" className="rounded-none">
                Compliance & Alerts
              </TabsTrigger>
            </TabsList>

            {/* Custody Tab */}
            <TabsContent value="custody" className="mt-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Wallet Custody Accounts</CardTitle>
                  <CardDescription>Multi-chain custody with KYC/AML verification</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8 text-slate-400">Loading wallets...</div>
                  ) : (
                    <div className="space-y-4">
                      {wallets.map((wallet) => (
                        <div key={wallet.id} className="border border-slate-700 rounded-lg p-4 hover:bg-slate-700/50 transition">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="text-white font-semibold">{wallet.name}</h3>
                              <code className="text-xs text-slate-400 font-mono">{wallet.address.slice(0, 20)}...</code>
                            </div>
                            <div className="flex gap-2">
                              <Badge variant="outline">{wallet.chain}</Badge>
                              <Badge className={wallet.status === 'active' ? 'bg-green-600' : wallet.status === 'locked' ? 'bg-yellow-600' : 'bg-blue-600'}>
                                {wallet.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-slate-400 mb-1">Balance</p>
                              <p className="text-white font-semibold">${wallet.balance.toLocaleString('en-US', { maximumFractionDigits: 2 })}</p>
                            </div>
                            <div>
                              <p className="text-slate-400 mb-1">KYC Status</p>
                              <div className="flex items-center gap-2">
                                {wallet.kycStatus === 'verified' && <CheckCircle className="w-4 h-4 text-green-500" />}
                                <span className="text-white">{wallet.kycStatus}</span>
                              </div>
                            </div>
                            <div>
                              <p className="text-slate-400 mb-1">Last Updated</p>
                              <p className="text-slate-300 text-xs">{new Date(wallet.lastUpdated).toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* CBDC Tab */}
            <TabsContent value="cbdc" className="mt-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">CBDC Transactions</CardTitle>
                  <CardDescription>Central Bank Digital Currency operations</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8 text-slate-400">Loading transactions...</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-700">
                            <th className="text-left py-3 px-4 text-slate-300 font-semibold">From</th>
                            <th className="text-left py-3 px-4 text-slate-300 font-semibold">To</th>
                            <th className="text-left py-3 px-4 text-slate-300 font-semibold">Amount</th>
                            <th className="text-left py-3 px-4 text-slate-300 font-semibold">Status</th>
                            <th className="text-left py-3 px-4 text-slate-300 font-semibold">KYC</th>
                            <th className="text-left py-3 px-4 text-slate-300 font-semibold">Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          {transactions.map((tx) => (
                            <tr key={tx.id} className="border-b border-slate-700 hover:bg-slate-700/50 transition">
                              <td className="py-3 px-4 text-slate-300">{tx.from}</td>
                              <td className="py-3 px-4 text-slate-300">{tx.to}</td>
                              <td className="py-3 px-4 text-white font-semibold">${tx.amount.toFixed(2)}</td>
                              <td className="py-3 px-4">
                                <Badge className={tx.status === 'confirmed' ? 'bg-green-600' : tx.status === 'pending' ? 'bg-yellow-600' : 'bg-red-600'}>
                                  {tx.status}
                                </Badge>
                              </td>
                              <td className="py-3 px-4">
                                {tx.kycVerified ? (
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                ) : (
                                  <AlertCircle className="w-4 h-4 text-yellow-500" />
                                )}
                              </td>
                              <td className="py-3 px-4 text-slate-400 text-xs">{new Date(tx.timestamp).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Treasury Labs Tab */}
            <TabsContent value="treasury-labs" className="mt-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">AEGENTIX Treasury Labs</CardTitle>
                  <CardDescription>Autonomous rebalancing, multi-exchange trading, and atomic settlement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Portfolio Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="border border-slate-700 rounded-lg p-4">
                        <p className="text-slate-400 text-sm mb-2">Total Portfolio Value</p>
                        <p className="text-2xl font-bold text-cyan-400">$8.94M</p>
                        <p className="text-xs text-green-400 mt-2">+2.73% (24h)</p>
                      </div>
                      <div className="border border-slate-700 rounded-lg p-4">
                        <p className="text-slate-400 text-sm mb-2">Daily Volume</p>
                        <p className="text-2xl font-bold text-purple-400">$1.25M</p>
                        <p className="text-xs text-slate-500 mt-2">Across exchanges</p>
                      </div>
                      <div className="border border-slate-700 rounded-lg p-4">
                        <p className="text-slate-400 text-sm mb-2">Active Operations</p>
                        <p className="text-2xl font-bold text-orange-400">15</p>
                        <p className="text-xs text-slate-500 mt-2">Swaps & rebalances</p>
                      </div>
                    </div>

                    {/* Rebalancing Status */}
                    <div className="border border-slate-700 rounded-lg p-4">
                      <h4 className="font-semibold text-white mb-3">Rebalancing Engine Status</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Strategy</span>
                          <Badge className="bg-blue-600">Balanced Allocation</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Signal Source</span>
                          <span className="text-white">AEGENTIS-X Signal Bus</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Rebalance Mode</span>
                          <Badge className="bg-green-600">Trigger-Based</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Last Rebalance</span>
                          <span className="text-white">2 hours ago</span>
                        </div>
                      </div>
                    </div>

                    {/* Exchange Integration */}
                    <div className="border border-slate-700 rounded-lg p-4">
                      <h4 className="font-semibold text-white mb-3">Exchange Integration</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="bg-slate-700/50 rounded p-3">
                          <p className="text-slate-400 text-xs mb-1">Kraken</p>
                          <Badge className="bg-green-600 text-xs">Connected</Badge>
                        </div>
                        <div className="bg-slate-700/50 rounded p-3">
                          <p className="text-slate-400 text-xs mb-1">Binance</p>
                          <Badge className="bg-green-600 text-xs">Connected</Badge>
                        </div>
                        <div className="bg-slate-700/50 rounded p-3">
                          <p className="text-slate-400 text-xs mb-1">CDP DEX (Base)</p>
                          <Badge className="bg-green-600 text-xs">Connected</Badge>
                        </div>
                      </div>
                    </div>

                    {/* Atomic Settlement */}
                    <div className="border border-slate-700 rounded-lg p-4">
                      <h4 className="font-semibold text-white mb-3">Atomic Settlement</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Active Swaps</span>
                          <span className="text-white font-semibold">3</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Completed (24h)</span>
                          <span className="text-green-400">12</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Gas Sponsored</span>
                          <span className="text-white">45 transactions</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Settlement Priority</span>
                          <span className="text-white text-xs">Base → Solana → Ethereum</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Compliance Tab */}
            <TabsContent value="compliance" className="mt-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Compliance & Alerts</CardTitle>
                  <CardDescription>KYC/AML monitoring and regulatory compliance</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8 text-slate-400">Loading alerts...</div>
                  ) : alerts.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">No alerts</div>
                  ) : (
                    <div className="space-y-4">
                      {alerts.map((alert) => (
                        <div
                          key={alert.id}
                          className={`border rounded-lg p-4 ${getSeverityColor(alert.severity)} ${alert.resolved ? 'opacity-60' : ''}`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                              <AlertCircle className="w-5 h-5" />
                              <h3 className="font-semibold">{alert.title}</h3>
                            </div>
                            {alert.resolved && <Badge variant="outline">Resolved</Badge>}
                          </div>
                          <p className="text-sm mb-2">{alert.description}</p>
                          <p className="text-xs opacity-75">{new Date(alert.timestamp).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ErrorBoundary>
  );
}
