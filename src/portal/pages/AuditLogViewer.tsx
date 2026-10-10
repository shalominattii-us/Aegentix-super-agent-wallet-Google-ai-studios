import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Search, Download, Filter, Eye } from 'lucide-react';
import ErrorBoundary from '@/components/ErrorBoundary';

interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  category: 'transaction' | 'custody' | 'governance' | 'compliance' | 'system' | 'user';
  actor: string;
  actorId: string;
  resource: string;
  resourceId: string;
  status: 'success' | 'failed' | 'pending';
  details: Record<string, unknown>;
  ipAddress: string;
  userAgent: string;
  signature: string;
  blockHash?: string;
}

export default function AuditLogViewer() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLogEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock data initialization
  useEffect(() => {
    const mockLogs: AuditLogEntry[] = [
      {
        id: 'audit-1',
        timestamp: new Date().toISOString(),
        action: 'TRANSFER_INITIATED',
        category: 'transaction',
        actor: 'Treasury Director',
        actorId: 'user_123',
        resource: 'Ethereum Wallet',
        resourceId: '0x' + 'a'.repeat(40),
        status: 'success',
        details: {
          amount: 500000,
          recipient: '0x' + 'b'.repeat(40),
          chain: 'Ethereum',
          txHash: '0x' + 'c'.repeat(64),
        },
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        signature: '0x' + 'd'.repeat(128),
        blockHash: '0x' + 'e'.repeat(64),
      },
      {
        id: 'audit-2',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        action: 'CUSTODY_TRANSFER_APPROVED',
        category: 'custody',
        actor: 'Chief Security Officer',
        actorId: 'user_456',
        resource: 'Bitcoin Holdings',
        resourceId: 'wallet_btc_001',
        status: 'success',
        details: {
          amount: 15.5,
          source: 'Cold Storage',
          destination: 'Multi-Chain Bridge',
          approvalCount: 4,
          requiredApprovals: 4,
        },
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        signature: '0x' + 'f'.repeat(128),
        blockHash: '0x' + 'g'.repeat(64),
      },
      {
        id: 'audit-3',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        action: 'COMPLIANCE_ALERT_TRIGGERED',
        category: 'compliance',
        actor: 'System',
        actorId: 'system_001',
        resource: 'AML Monitor',
        resourceId: 'aml_check_789',
        status: 'success',
        details: {
          alertType: 'STRUCTURING',
          riskScore: 85,
          walletAddress: '0x' + 'h'.repeat(40),
          transactionCount: 12,
          timeWindow: '24h',
        },
        ipAddress: '10.0.0.1',
        userAgent: 'System/1.0',
        signature: '0x' + 'i'.repeat(128),
      },
      {
        id: 'audit-4',
        timestamp: new Date(Date.now() - 10800000).toISOString(),
        action: 'GOVERNANCE_VOTE_CAST',
        category: 'governance',
        actor: 'Board Member',
        actorId: 'user_789',
        resource: 'Protocol Upgrade v2.1',
        resourceId: 'proposal_001',
        status: 'success',
        details: {
          vote: 'YES',
          votingPower: 1000000,
          proposalTitle: 'Enhanced Security Controls',
          votingPeriod: '7 days',
        },
        ipAddress: '192.168.1.102',
        userAgent: 'Mozilla/5.0 (X11; Linux x86_64)',
        signature: '0x' + 'j'.repeat(128),
        blockHash: '0x' + 'k'.repeat(64),
      },
      {
        id: 'audit-5',
        timestamp: new Date(Date.now() - 14400000).toISOString(),
        action: 'USER_LOGIN',
        category: 'user',
        actor: 'Portal User',
        actorId: 'user_101',
        resource: 'Portal Session',
        resourceId: 'session_001',
        status: 'success',
        details: {
          loginMethod: 'OAuth',
          mfaUsed: true,
          sessionDuration: '8h',
        },
        ipAddress: '203.0.113.45',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)',
        signature: '0x' + 'l'.repeat(128),
      },
      {
        id: 'audit-6',
        timestamp: new Date(Date.now() - 18000000).toISOString(),
        action: 'SYSTEM_CONFIGURATION_CHANGED',
        category: 'system',
        actor: 'System Administrator',
        actorId: 'admin_001',
        resource: 'Security Settings',
        resourceId: 'config_security_001',
        status: 'failed',
        details: {
          changeType: 'PARAMETER_UPDATE',
          parameter: 'transaction_limit',
          oldValue: 1000000,
          newValue: 500000,
          reason: 'Risk mitigation',
          error: 'Insufficient permissions',
        },
        ipAddress: '192.168.1.103',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        signature: '0x' + 'm'.repeat(128),
      },
    ];

    setLogs(mockLogs);
    setFilteredLogs(mockLogs);
    setLoading(false);
  }, []);

  // Filter logs
  useEffect(() => {
    let filtered = logs;

    if (searchTerm) {
      filtered = filtered.filter(
        (log) =>
          log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.resource.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((log) => log.category === selectedCategory);
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter((log) => log.status === selectedStatus);
    }

    setFilteredLogs(filtered);
  }, [logs, searchTerm, selectedCategory, selectedStatus]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'transaction':
        return 'bg-blue-100 text-blue-800';
      case 'custody':
        return 'bg-emerald-100 text-emerald-800';
      case 'governance':
        return 'bg-purple-100 text-purple-800';
      case 'compliance':
        return 'bg-orange-100 text-orange-800';
      case 'system':
        return 'bg-slate-100 text-slate-800';
      case 'user':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-600';
      case 'failed':
        return 'bg-red-600';
      case 'pending':
        return 'bg-yellow-600';
      default:
        return 'bg-gray-600';
    }
  };

  const stats = {
    total: logs.length,
    success: logs.filter((l) => l.status === 'success').length,
    failed: logs.filter((l) => l.status === 'failed').length,
    pending: logs.filter((l) => l.status === 'pending').length,
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-8 h-8 text-cyan-400" />
              <h1 className="text-4xl font-bold text-white">Audit Log Viewer</h1>
            </div>
            <p className="text-slate-400">Immutable transaction and operation history</p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="pt-6">
                <div className="text-slate-400 text-sm mb-2">Total Events</div>
                <div className="text-3xl font-bold text-white">{stats.total}</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="pt-6">
                <div className="text-slate-400 text-sm mb-2">Successful</div>
                <div className="text-3xl font-bold text-green-400">{stats.success}</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="pt-6">
                <div className="text-slate-400 text-sm mb-2">Failed</div>
                <div className="text-3xl font-bold text-red-400">{stats.failed}</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="pt-6">
                <div className="text-slate-400 text-sm mb-2">Pending</div>
                <div className="text-3xl font-bold text-yellow-400">{stats.pending}</div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card className="mb-6 bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Search className="w-5 h-5" />
                Search & Filter
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Input
                  placeholder="Search by action, actor, or resource..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                />
                <Button variant="outline" size="icon">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex gap-4 flex-wrap">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 bg-slate-700 border border-slate-600 text-white rounded-md"
                >
                  <option value="all">All Categories</option>
                  <option value="transaction">Transaction</option>
                  <option value="custody">Custody</option>
                  <option value="governance">Governance</option>
                  <option value="compliance">Compliance</option>
                  <option value="system">System</option>
                  <option value="user">User</option>
                </select>

                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-2 bg-slate-700 border border-slate-600 text-white rounded-md"
                >
                  <option value="all">All Status</option>
                  <option value="success">Success</option>
                  <option value="failed">Failed</option>
                  <option value="pending">Pending</option>
                </select>

                <Button variant="outline" size="sm" className="ml-auto">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Logs Table */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Audit Logs ({filteredLogs.length})</CardTitle>
              <CardDescription>Recent system and user activity</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-slate-400">Loading logs...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-slate-700">
                      <tr>
                        <th className="text-left py-3 px-4 text-slate-400">Timestamp</th>
                        <th className="text-left py-3 px-4 text-slate-400">Action</th>
                        <th className="text-left py-3 px-4 text-slate-400">Category</th>
                        <th className="text-left py-3 px-4 text-slate-400">Actor</th>
                        <th className="text-left py-3 px-4 text-slate-400">Resource</th>
                        <th className="text-left py-3 px-4 text-slate-400">Status</th>
                        <th className="text-left py-3 px-4 text-slate-400">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLogs.map((log) => (
                        <tr key={log.id} className="border-b border-slate-700 hover:bg-slate-700/30">
                          <td className="py-3 px-4 text-slate-300 text-xs">
                            {new Date(log.timestamp).toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-white font-mono text-xs">{log.action}</td>
                          <td className="py-3 px-4">
                            <Badge className={getCategoryColor(log.category)}>{log.category}</Badge>
                          </td>
                          <td className="py-3 px-4 text-slate-300">{log.actor}</td>
                          <td className="py-3 px-4 text-slate-300">{log.resource}</td>
                          <td className="py-3 px-4">
                            <Badge className={getStatusColor(log.status)}>{log.status}</Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setSelectedLog(log)}
                              className="text-cyan-400 hover:text-cyan-300"
                            >
                              <Eye className="w-4 h-4" />
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

          {/* Log Details Modal */}
          {selectedLog && (
            <Card className="mt-6 bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Log Details - {selectedLog.action}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-slate-400 text-sm mb-1">Timestamp</p>
                    <p className="text-white">{new Date(selectedLog.timestamp).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm mb-1">Status</p>
                    <Badge className={getStatusColor(selectedLog.status)}>{selectedLog.status}</Badge>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm mb-1">Actor</p>
                    <p className="text-white">{selectedLog.actor}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm mb-1">Resource</p>
                    <p className="text-white">{selectedLog.resource}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm mb-1">IP Address</p>
                    <p className="text-white font-mono text-sm">{selectedLog.ipAddress}</p>
                  </div>
                  {selectedLog.blockHash && (
                    <div>
                      <p className="text-slate-400 text-sm mb-1">Block Hash</p>
                      <p className="text-white font-mono text-xs break-all">{selectedLog.blockHash}</p>
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-slate-400 text-sm mb-2">Details</p>
                  <div className="bg-slate-700 p-4 rounded-lg font-mono text-sm text-slate-300 overflow-x-auto">
                    <pre>{JSON.stringify(selectedLog.details, null, 2)}</pre>
                  </div>
                </div>

                <div>
                  <p className="text-slate-400 text-sm mb-2">Signature</p>
                  <div className="bg-slate-700 p-4 rounded-lg font-mono text-xs text-slate-300 break-all">
                    {selectedLog.signature}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}
