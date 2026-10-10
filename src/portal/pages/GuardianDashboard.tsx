/**
 * Guardian Dashboard Page
 * 
 * Comprehensive monitoring interface for the Constitutional Governance system
 */

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GuardianStatus } from '@/components/GuardianStatus';
import { LedgerVisualization } from '@/components/LedgerVisualization';
import { RealtimeMonitoring } from '@/components/RealtimeMonitoring';
import { AuthorityHierarchy } from '@/components/AuthorityHierarchy';
import { EconomicTransactionFlow } from '@/components/EconomicTransactionFlow';

export const GuardianDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-cyan-400 mb-2">
          Guardian Dashboard
        </h1>
        <p className="text-slate-400">
          Real-time monitoring of the Constitutional Governance system
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-slate-900 border border-slate-700 rounded-lg p-1">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-slate-800 data-[state=active]:text-cyan-400"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="guardians"
            className="data-[state=active]:bg-slate-800 data-[state=active]:text-cyan-400"
          >
            Guardians
          </TabsTrigger>
          <TabsTrigger
            value="ledger"
            className="data-[state=active]:bg-slate-800 data-[state=active]:text-cyan-400"
          >
            Ledger
          </TabsTrigger>
          <TabsTrigger
            value="authority"
            className="data-[state=active]:bg-slate-800 data-[state=active]:text-cyan-400"
          >
            Authority
          </TabsTrigger>
          <TabsTrigger
            value="economy"
            className="data-[state=active]:bg-slate-800 data-[state=active]:text-cyan-400"
          >
            Economy
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-2 gap-6">
            <GuardianStatus />
            <RealtimeMonitoring />
          </div>
        </TabsContent>

        {/* Guardians Tab */}
        <TabsContent value="guardians" className="space-y-6 mt-6">
          <GuardianStatus />
        </TabsContent>

        {/* Ledger Tab */}
        <TabsContent value="ledger" className="space-y-6 mt-6">
          <LedgerVisualization />
        </TabsContent>

        {/* Authority Tab */}
        <TabsContent value="authority" className="space-y-6 mt-6">
          <AuthorityHierarchy />
        </TabsContent>

        {/* Economy Tab */}
        <TabsContent value="economy" className="space-y-6 mt-6">
          <EconomicTransactionFlow />
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <div className="mt-12 pt-6 border-t border-slate-700 text-center text-slate-400 text-sm">
        <p>
          Constitutional Governance System • Infrastructure enforces law • Guardian enforces truth • Economy obeys both
        </p>
      </div>
    </div>
  );
};
