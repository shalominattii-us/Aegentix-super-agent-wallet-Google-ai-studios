import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';
import { CheckCircle2, AlertCircle, RefreshCw, Zap, Shield, Layers } from 'lucide-react';

type RealityLayer = 'origin' | 'meta' | 'hyperreality' | 'omniverse' | 'reality' | 'multiverse' | 'immersion' | 'portal' | 'primordium';

export default function RealityLayersVerification() {
  const [verificationResults, setVerificationResults] = useState<any[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [allOperational, setAllOperational] = useState(false);

  // Fetch all layer status
  const { data: allLayers, refetch, isLoading } = trpc.reality.getAllLayerStatus.useQuery();

  // Fetch sovereign seals charters
  const { data: chartersData } = trpc.sovereignSeals.getAllLayerCharters.useQuery();

  useEffect(() => {
    if (allLayers) {
      setVerificationResults(allLayers as any[]);
      const allOp = allLayers.every((layer: any) => layer.operational);
      setAllOperational(allOp);
    }
  }, [allLayers]);

  const handleVerifyAll = async () => {
    setIsVerifying(true);
    try {
      await refetch();
      // Simulate verification delay
      await new Promise(resolve => setTimeout(resolve, 1000));
    } finally {
      setIsVerifying(false);
    }
  };

  const getLayerIcon = (layer: string) => {
    const icons: Record<RealityLayer, React.ReactNode> = {
      origin: <Shield className="w-5 h-5" />,
      meta: <Zap className="w-5 h-5" />,
      hyperreality: <Layers className="w-5 h-5" />,
      omniverse: <Zap className="w-5 h-5" />,
      reality: <Shield className="w-5 h-5" />,
      multiverse: <Layers className="w-5 h-5" />,
      immersion: <Zap className="w-5 h-5" />,
      portal: <Layers className="w-5 h-5" />,
      primordium: <Shield className="w-5 h-5" />,
    };
    return icons[layer as RealityLayer] || <Zap className="w-5 h-5" />;
  };

  const getLayerColor = (layer: string) => {
    const colors: Record<RealityLayer, string> = {
      origin: 'from-purple-600 to-indigo-600',
      meta: 'from-blue-600 to-cyan-600',
      hyperreality: 'from-pink-600 to-rose-600',
      omniverse: 'from-orange-600 to-amber-600',
      reality: 'from-green-600 to-emerald-600',
      multiverse: 'from-yellow-600 to-lime-600',
      immersion: 'from-red-600 to-pink-600',
      portal: 'from-teal-600 to-cyan-600',
      primordium: 'from-gray-600 to-slate-600',
    };
    return colors[layer as RealityLayer] || 'from-gray-600 to-slate-600';
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading reality layers verification...</div>;
  }

  if (!allLayers || allLayers.length === 0) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-lg p-6 border border-slate-700">
          <h1 className="text-3xl font-bold text-white mb-2">Reality Layers Verification</h1>
          <p className="text-slate-300">Verify operational status of all 9 Sovereign reality layers</p>
        </div>
        <div className="bg-red-900/20 border border-red-700 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-red-400 mb-2">No Reality Layers Found</h3>
          <p className="text-red-300">Unable to retrieve reality layer status. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-lg p-6 border border-slate-700">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Reality Layers Verification</h1>
            <p className="text-slate-300">Verify operational status of all 9 Sovereign reality layers</p>
          </div>
          <Button
            onClick={handleVerifyAll}
            disabled={isVerifying}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isVerifying ? 'animate-spin' : ''}`} />
            {isVerifying ? 'Verifying...' : 'Verify All'}
          </Button>
        </div>
      </div>

      {/* Overall Status */}
      <Card className="border-slate-700 bg-slate-900">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Overall System Status</CardTitle>
            <Badge variant={allOperational ? 'default' : 'destructive'}>
              {allOperational ? '✓ All Operational' : '⚠ Issues Detected'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800 p-4 rounded-lg">
              <div className="text-slate-400 text-sm">Operational Layers</div>
              <div className="text-3xl font-bold text-white">
                {verificationResults.filter(l => l.operational).length}/9
              </div>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg">
              <div className="text-slate-400 text-sm">Average Compliance</div>
              <div className="text-3xl font-bold text-white">
                {verificationResults.length > 0
                  ? (verificationResults.reduce((sum, l) => sum + l.complianceScore, 0) / verificationResults.length).toFixed(1)
                  : 0}%
              </div>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg">
              <div className="text-slate-400 text-sm">Total Transactions</div>
              <div className="text-3xl font-bold text-white">
                {verificationResults.reduce((sum, l) => sum + l.transactionCount, 0)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Layer Status */}
      <Card className="border-slate-700 bg-slate-900">
        <CardHeader>
          <CardTitle className="text-white">Layer Status Details</CardTitle>
          <CardDescription>Detailed verification for each reality layer</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {verificationResults.map(layer => {
            const charter = chartersData?.find(c => c.layer === layer.layer);
            return (
              <div key={layer.layer} className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`bg-gradient-to-br ${getLayerColor(layer.layer)} p-2 rounded-lg`}>
                      {getLayerIcon(layer.layer)}
                    </div>
                    <div>
                      <div className="font-semibold text-white capitalize">{layer.layer} Layer</div>
                      <div className="text-xs text-slate-400">Kernel v{layer.kernelVersion}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {layer.operational ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    )}
                    <Badge variant={layer.operational ? 'default' : 'destructive'}>
                      {layer.operational ? 'Online' : 'Offline'}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                  <div className="bg-slate-700 p-2 rounded">
                    <div className="text-xs text-slate-400">Compliance</div>
                    <div className="text-lg font-bold text-white">{layer.complianceScore}%</div>
                  </div>
                  <div className="bg-slate-700 p-2 rounded">
                    <div className="text-xs text-slate-400">Transactions</div>
                    <div className="text-lg font-bold text-white">{layer.transactionCount}</div>
                  </div>
                  <div className="bg-slate-700 p-2 rounded">
                    <div className="text-xs text-slate-400">Consensus</div>
                    <div className="text-xs text-white capitalize">{layer.consensusType}</div>
                  </div>
                  <div className="bg-slate-700 p-2 rounded">
                    <div className="text-xs text-slate-400">Last Update</div>
                    <div className="text-xs text-white">
                      {new Date(layer.lastHeartbeat).toLocaleTimeString()}
                    </div>
                  </div>
                </div>

                {/* Charter Status */}
                {charter && (
                  <div className="bg-slate-700 p-2 rounded text-xs">
                    <div className="text-slate-400 mb-1">Charter Status</div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">{charter.charter?.title}</span>
                      <Badge variant={charter.compliance?.compliant ? 'default' : 'destructive'}
                        className={charter.compliance?.compliant ? 'bg-green-600 text-white' : 'bg-amber-600 text-white'}>
                        {charter.compliance?.compliant ? 'ACTIVE' : 'PENDING'}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Verification Summary */}
      <Card className="border-slate-700 bg-slate-900">
        <CardHeader>
          <CardTitle className="text-white">Verification Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">All 9 layers initialized</span>
              <Badge variant={verificationResults.length === 9 ? 'default' : 'destructive'}>
                {verificationResults.length === 9 ? '✓' : '✗'} {verificationResults.length}/9
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">All layers operational</span>
              <Badge variant={allOperational ? 'default' : 'destructive'}>
                {allOperational ? '✓' : '✗'} {verificationResults.filter(l => l.operational).length}/9
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Minimum compliance score (80%)</span>
              <Badge variant={verificationResults.every(l => l.complianceScore >= 80) ? 'default' : 'secondary'}>
                {verificationResults.every(l => l.complianceScore >= 80) ? '✓' : '⚠'} Pass
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Charters established</span>
              <Badge variant={chartersData && chartersData.length === 9 ? 'default' : 'secondary'}>
                {chartersData?.length || 0}/9
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">All charters compliant</span>
              <Badge variant={chartersData?.every(c => c.compliance?.compliant) ? 'default' : 'secondary'}>
                {chartersData?.filter(c => c.compliance?.compliant).length || 0}/{chartersData?.length || 0}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Final Status */}
      {allOperational && verificationResults.length === 9 && (
        <div className="bg-green-900/20 border border-green-700 rounded-lg p-6 text-center">
          <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-green-400 mb-2">All 9 Reality Layers Verified</h3>
          <p className="text-green-300">
            The Sovereign System Portal is fully operational with all 9 reality layers active and compliant.
          </p>
        </div>
      )}
    </div>
  );
}
