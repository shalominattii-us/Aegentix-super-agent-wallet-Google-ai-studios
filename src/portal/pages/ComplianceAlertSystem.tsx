import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, CheckCircle, Clock, TrendingDown, Filter } from 'lucide-react';
import ErrorBoundary from '@/components/ErrorBoundary';

interface ComplianceAlert {
  id: string;
  type: 'kyc' | 'aml' | 'sanctions' | 'jurisdiction' | 'risk';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  entity: string;
  entityType: 'wallet' | 'transaction' | 'user' | 'counterparty';
  status: 'open' | 'investigating' | 'resolved' | 'false-positive';
  createdAt: string;
  updatedAt: string;
  riskScore: number;
  evidence: string[];
  action?: string;
}

export default function ComplianceAlertSystem() {
  const [alerts, setAlerts] = useState<ComplianceAlert[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<ComplianceAlert[]>([]);
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  // Mock data initialization
  useEffect(() => {
    const mockAlerts: ComplianceAlert[] = [
      {
        id: 'alert-1',
        type: 'sanctions',
        severity: 'critical',
        title: 'Sanctioned Entity Transaction Detected',
        description: 'Transaction from wallet linked to OFAC sanctioned entity',
        entity: '0x' + 'a'.repeat(40),
        entityType: 'wallet',
        status: 'investigating',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        updatedAt: new Date(Date.now() - 1800000).toISOString(),
        riskScore: 98,
        evidence: ['OFAC SDN List Match', 'Transaction Pattern Analysis', 'Geographic Correlation'],
        action: 'Freeze wallet and escalate to compliance team',
      },
      {
        id: 'alert-2',
        type: 'aml',
        severity: 'high',
        title: 'Suspicious Transaction Pattern - Structuring',
        description: 'Multiple transactions below reporting threshold in short timeframe',
        entity: 'wallet_789',
        entityType: 'wallet',
        status: 'investigating',
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        updatedAt: new Date(Date.now() - 3600000).toISOString(),
        riskScore: 85,
        evidence: ['Pattern Matching: Structuring', 'Velocity Analysis', 'Cross-Chain Bridge Usage'],
        action: 'Enhanced due diligence required',
      },
      {
        id: 'alert-3',
        type: 'kyc',
        severity: 'high',
        title: 'KYC Verification Expired',
        description: 'User KYC verification expired and requires renewal',
        entity: 'user_456',
        entityType: 'user',
        status: 'open',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
        riskScore: 72,
        evidence: ['KYC Expiration: 2025-05-07', 'Account Age: 2 years', 'Transaction Volume: High'],
        action: 'Request KYC renewal',
      },
      {
        id: 'alert-4',
        type: 'jurisdiction',
        severity: 'medium',
        title: 'High-Risk Jurisdiction Transaction',
        description: 'Transaction involving high-risk jurisdiction',
        entity: 'tx_0x123',
        entityType: 'transaction',
        status: 'resolved',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
        riskScore: 65,
        evidence: ['Jurisdiction: North Korea', 'Counterparty Analysis', 'Transaction Amount: $50K'],
        action: 'Completed enhanced due diligence',
      },
      {
        id: 'alert-5',
        type: 'risk',
        severity: 'medium',
        title: 'Unusual Account Activity',
        description: 'Account showing unusual activity patterns compared to historical baseline',
        entity: 'user_789',
        entityType: 'user',
        status: 'investigating',
        createdAt: new Date(Date.now() - 10800000).toISOString(),
        updatedAt: new Date(Date.now() - 5400000).toISOString(),
        riskScore: 58,
        evidence: ['Behavioral Deviation: 3.2 sigma', 'New Device Login', 'Unusual Time Pattern'],
        action: 'Monitor account activity',
      },
      {
        id: 'alert-6',
        type: 'kyc',
        severity: 'low',
        title: 'KYC Information Update Recommended',
        description: 'User KYC information is outdated and update is recommended',
        entity: 'user_123',
        entityType: 'user',
        status: 'false-positive',
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        updatedAt: new Date(Date.now() - 172800000).toISOString(),
        riskScore: 25,
        evidence: ['Last Update: 1 year ago', 'Low Risk Profile', 'No Violations'],
        action: 'Routine update request',
      },
    ];

    setAlerts(mockAlerts);
    setFilteredAlerts(mockAlerts);
    setLoading(false);
  }, []);

  // Filter alerts
  useEffect(() => {
    let filtered = alerts;

    if (selectedSeverity !== 'all') {
      filtered = filtered.filter((alert) => alert.severity === selectedSeverity);
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter((alert) => alert.type === selectedType);
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter((alert) => alert.status === selectedStatus);
    }

    setFilteredAlerts(filtered);
  }, [alerts, selectedSeverity, selectedType, selectedStatus]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'investigating':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'false-positive':
        return <TrendingDown className="w-4 h-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const stats = {
    total: alerts.length,
    critical: alerts.filter((a) => a.severity === 'critical').length,
    investigating: alerts.filter((a) => a.status === 'investigating').length,
    resolved: alerts.filter((a) => a.status === 'resolved').length,
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="w-8 h-8 text-orange-400" />
              <h1 className="text-4xl font-bold text-white">Compliance Alert System</h1>
            </div>
            <p className="text-slate-400">KYC/AML monitoring and regulatory compliance</p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="pt-6">
                <div className="text-slate-400 text-sm mb-2">Total Alerts</div>
                <div className="text-3xl font-bold text-white">{stats.total}</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="pt-6">
                <div className="text-slate-400 text-sm mb-2">Critical</div>
                <div className="text-3xl font-bold text-red-400">{stats.critical}</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="pt-6">
                <div className="text-slate-400 text-sm mb-2">Investigating</div>
                <div className="text-3xl font-bold text-yellow-400">{stats.investigating}</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="pt-6">
                <div className="text-slate-400 text-sm mb-2">Resolved</div>
                <div className="text-3xl font-bold text-green-400">{stats.resolved}</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6 bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="flex gap-4 flex-wrap">
              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="px-4 py-2 bg-slate-700 border border-slate-600 text-white rounded-md"
              >
                <option value="all">All Severities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2 bg-slate-700 border border-slate-600 text-white rounded-md"
              >
                <option value="all">All Types</option>
                <option value="kyc">KYC</option>
                <option value="aml">AML</option>
                <option value="sanctions">Sanctions</option>
                <option value="jurisdiction">Jurisdiction</option>
                <option value="risk">Risk</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 bg-slate-700 border border-slate-600 text-white rounded-md"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="investigating">Investigating</option>
                <option value="resolved">Resolved</option>
                <option value="false-positive">False Positive</option>
              </select>
            </CardContent>
          </Card>

          {/* Alerts List */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Compliance Alerts ({filteredAlerts.length})</CardTitle>
              <CardDescription>Recent compliance and regulatory alerts</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-slate-400">Loading alerts...</div>
              ) : filteredAlerts.length === 0 ? (
                <div className="text-center py-8 text-slate-400">No alerts match the selected filters</div>
              ) : (
                <div className="space-y-4">
                  {filteredAlerts.map((alert) => (
                    <div key={alert.id} className={`border rounded-lg p-4 ${getSeverityColor(alert.severity)}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3 flex-1">
                          {getStatusIcon(alert.status)}
                          <div>
                            <h3 className="font-semibold">{alert.title}</h3>
                            <p className="text-sm mt-1">{alert.description}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Badge variant="outline">{alert.type}</Badge>
                          <Badge variant="outline">{alert.status}</Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-3 pt-3 border-t border-current border-opacity-20">
                        <div>
                          <span className="opacity-75">Entity:</span>
                          <p className="font-mono text-xs mt-1">{alert.entity.slice(0, 20)}...</p>
                        </div>
                        <div>
                          <span className="opacity-75">Risk Score:</span>
                          <p className="font-semibold mt-1">{alert.riskScore}/100</p>
                        </div>
                        <div>
                          <span className="opacity-75">Created:</span>
                          <p className="text-xs mt-1">{new Date(alert.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="opacity-75">Updated:</span>
                          <p className="text-xs mt-1">{new Date(alert.updatedAt).toLocaleDateString()}</p>
                        </div>
                      </div>

                      {alert.evidence.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-current border-opacity-20">
                          <p className="text-sm font-semibold mb-2">Evidence:</p>
                          <div className="flex gap-2 flex-wrap">
                            {alert.evidence.map((ev, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {ev}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {alert.action && (
                        <div className="mt-3 flex gap-2">
                          <Button size="sm" variant="outline">
                            {alert.action}
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ErrorBoundary>
  );
}
