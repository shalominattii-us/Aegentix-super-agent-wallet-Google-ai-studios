import React, { useState } from 'react';
import { ResoluteDesk } from '@/components/ResoluteDesk';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export const ResoluteDeskPage: React.FC = () => {
  const [activeAction, setActiveAction] = useState<any>(null);
  const [approvalHistory, setApprovalHistory] = useState<any[]>([]);

  const handleApprove = (payload: any) => {
    console.log('✅ APPROVED:', payload);
    setApprovalHistory([...approvalHistory, { ...payload, status: 'APPROVED' }]);
  };

  const handleRevise = (payload: any) => {
    console.log('📝 REVISED:', payload);
    setApprovalHistory([...approvalHistory, { ...payload, status: 'REVISED' }]);
  };

  const handleCancel = (payload: any) => {
    console.log('❌ CANCELLED:', payload);
    setApprovalHistory([...approvalHistory, { ...payload, status: 'CANCELLED' }]);
  };

  const mockAction = {
    id: 'sovereign-agent-001',
    title: 'Autonomous Trading Authorization',
    subtitle: 'Execute cross-DEX arbitrage strategy on Mainnet',
    integrityScore: 87,
    impactForecast: 'Low → Moderate',
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Resolute Desk</h1>
        <p className="text-muted-foreground mb-8">Executive Integrity Layer for Sovereign System</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Component */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <ResoluteDesk
                action={mockAction}
                onApprove={handleApprove}
                onRevise={handleRevise}
                onCancel={handleCancel}
                wsEndpoint="ws://localhost:9444"
              />
            </Card>
          </div>

          {/* Approval History */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Approval History</h2>
              <div className="space-y-4">
                {approvalHistory.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No approvals yet</p>
                ) : (
                  approvalHistory.map((entry, idx) => (
                    <div key={idx} className="border-l-4 border-accent pl-4 py-2">
                      <p className="text-sm font-semibold">{entry.status}</p>
                      <p className="text-xs text-muted-foreground">{entry.timestamp}</p>
                      <p className="text-xs">Integrity: {entry.integrity}%</p>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
