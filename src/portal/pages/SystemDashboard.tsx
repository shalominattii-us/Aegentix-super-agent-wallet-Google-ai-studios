import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, AlertCircle, CheckCircle, TrendingUp, Zap, Database, Shield, Globe } from 'lucide-react';
import ErrorBoundary from '@/components/ErrorBoundary';
import MetricsErrorFallback from '@/components/MetricsErrorFallback';

interface MetricCard {
  title: string;
  value: string | number;
  unit?: string;
  icon: React.ReactNode;
  trend?: number;
  status: 'good' | 'warning' | 'critical';
}

interface ComponentMetric {
  name: string;
  status: 'online' | 'offline' | 'degraded';
  uptime: number;
  requests: number;
  latency: number;
  errors: number;
}

function SystemDashboardContent() {
  const [metrics, setMetrics] = useState<MetricCard[]>([
    {
      title: 'System Health',
      value: 94,
      unit: '%',
      icon: <Activity className="w-6 h-6" />,
      trend: 2,
      status: 'good',
    },
    {
      title: 'Active Agents',
      value: 24,
      icon: <Zap className="w-6 h-6" />,
      trend: 3,
      status: 'good',
    },
    {
      title: 'Transactions/Min',
      value: 1247,
      icon: <TrendingUp className="w-6 h-6" />,
      trend: -5,
      status: 'good',
    },
    {
      title: 'Data Processed',
      value: 2.4,
      unit: 'TB',
      icon: <Database className="w-6 h-6" />,
      trend: 12,
      status: 'good',
    },
  ]);

  const [components, setComponents] = useState<ComponentMetric[]>([
    { name: 'Sovereign OS', status: 'online', uptime: 99.98, requests: 45230, latency: 12, errors: 2 },
    { name: 'Aegentis Engine', status: 'online', uptime: 99.95, requests: 38920, latency: 18, errors: 5 },
    { name: 'Pantheon Deploy', status: 'online', uptime: 99.92, requests: 28450, latency: 24, errors: 8 },
    { name: 'Commander-ZK9', status: 'online', uptime: 100.0, requests: 12340, latency: 8, errors: 0 },
    { name: 'Gold Dome', status: 'online', uptime: 99.97, requests: 35670, latency: 15, errors: 3 },
    { name: 'Aura Commander', status: 'online', uptime: 99.99, requests: 42100, latency: 10, errors: 1 },
    { name: 'ResoluteDesk', status: 'online', uptime: 99.94, requests: 29340, latency: 22, errors: 6 },
    { name: 'Sovereign Meta', status: 'online', uptime: 99.96, requests: 33210, latency: 16, errors: 4 },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-100 text-green-800';
      case 'degraded':
        return 'bg-yellow-100 text-yellow-800';
      case 'offline':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'degraded':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'offline':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">System Dashboard</h1>
        <p className="text-gray-500">Real-time monitoring of all Sovereign System components</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => (
          <Card key={idx}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">{metric.title}</p>
                  <div className="flex items-baseline gap-1">
                    <p className="text-2xl font-bold">
                      {metric.value}
                      {metric.unit && <span className="text-lg ml-1">{metric.unit}</span>}
                    </p>
                    {metric.trend !== undefined && (
                      <span className={`text-sm ${metric.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {metric.trend >= 0 ? '↑' : '↓'} {Math.abs(metric.trend)}%
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-gray-400">{metric.icon}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Component Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Component Status
          </CardTitle>
          <CardDescription>Real-time status of all system components</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Component</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-right py-3 px-4 font-semibold">Uptime</th>
                  <th className="text-right py-3 px-4 font-semibold">Requests</th>
                  <th className="text-right py-3 px-4 font-semibold">Latency</th>
                  <th className="text-right py-3 px-4 font-semibold">Errors</th>
                </tr>
              </thead>
              <tbody>
                {components.map((comp, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{comp.name}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(comp.status)}
                        <Badge className={getStatusColor(comp.status)}>{comp.status}</Badge>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="font-mono text-green-600">{comp.uptime.toFixed(2)}%</span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono">{comp.requests.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right font-mono">{comp.latency}ms</td>
                    <td className="py-3 px-4 text-right">
                      <span className={comp.errors === 0 ? 'text-green-600' : 'text-red-600'}>
                        {comp.errors}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* System Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Deployment Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Deployment Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <span className="font-medium">Production</span>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                <span className="font-medium">Staging</span>
                <Badge className="bg-blue-100 text-blue-800">Ready</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <span className="font-medium">Development</span>
                <Badge className="bg-gray-100 text-gray-800">Idle</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Recent Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm font-medium">High latency detected</p>
                <p className="text-xs text-gray-600">Pantheon Deploy - 2 minutes ago</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-medium">Component update completed</p>
                <p className="text-xs text-gray-600">Aegentis Engine - 15 minutes ago</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm font-medium">System health improved</p>
                <p className="text-xs text-gray-600">Overall system - 1 hour ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/**
 * SystemDashboard Component
 * Wrapped with ErrorBoundary for graceful error handling
 */
export default function SystemDashboard() {
  return (
    <ErrorBoundary
      componentName="System Dashboard"
      fallback={
        <MetricsErrorFallback
          componentName="System Dashboard"
          isNetworkError={false}
        />
      }
      onError={(error, errorInfo) => {
        console.error('SystemDashboard error:', error, errorInfo);
      }}
    >
      <SystemDashboardContent />
    </ErrorBoundary>
  );
}
