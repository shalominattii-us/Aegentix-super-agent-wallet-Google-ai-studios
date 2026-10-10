import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, AlertCircle, Lock, Unlock, Send, X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import ErrorBoundary from '@/components/ErrorBoundary';
import { trpc } from '@/lib/trpc';

export default function MultiSigApprovals() {
  const [selectedApproval, setSelectedApproval] = useState<number | null>(null);
  const [signatureInput, setSignatureInput] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showSignDialog, setShowSignDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  // Fetch pending approvals
  const { data: approvals, isLoading, refetch } = trpc.multiSig.getPendingApprovals.useQuery();

  // Fetch selected approval details
  const { data: selectedApprovalDetails, refetch: refetchDetails } = trpc.multiSig.getApproval.useQuery(
    { approvalId: selectedApproval || 0 },
    { enabled: !!selectedApproval }
  );

  // Fetch approval progress
  const { data: approvalProgress, refetch: refetchProgress } = trpc.multiSig.getApprovalProgress.useQuery(
    { approvalId: selectedApproval || 0 },
    { enabled: !!selectedApproval }
  );

  // Mutations
  const signMutation = trpc.multiSig.signApproval.useMutation({
    onSuccess: () => {
      toast.success('Approval signed successfully');
      setSignatureInput('');
      setShowSignDialog(false);
      refetch();
      refetchDetails();
      refetchProgress();
    },
    onError: (error) => {
      toast.error(`Failed to sign: ${error.message}`);
    },
  });

  const rejectMutation = trpc.multiSig.rejectApproval.useMutation({
    onSuccess: () => {
      toast.success('Approval rejected');
      setRejectionReason('');
      setShowRejectDialog(false);
      refetch();
      refetchDetails();
    },
    onError: (error) => {
      toast.error(`Failed to reject: ${error.message}`);
    },
  });

  const executeMutation = trpc.multiSig.executeApproval.useMutation({
    onSuccess: () => {
      toast.success('Approval executed successfully');
      refetch();
      refetchDetails();
    },
    onError: (error) => {
      toast.error(`Failed to execute: ${error.message}`);
    },
  });

  const handleSign = async () => {
    if (!selectedApproval || !signatureInput) {
      toast.error('Please enter a signature');
      return;
    }

    signMutation.mutate({
      approvalId: selectedApproval,
      signature: signatureInput,
      ipAddress: window.location.hostname,
      userAgent: navigator.userAgent,
    });
  };

  const handleReject = async () => {
    if (!selectedApproval || !rejectionReason) {
      toast.error('Please provide a rejection reason');
      return;
    }

    rejectMutation.mutate({
      approvalId: selectedApproval,
      reason: rejectionReason,
    });
  };

  const handleExecute = async () => {
    if (!selectedApproval) return;

    executeMutation.mutate({
      approvalId: selectedApproval,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-600';
      case 'in_progress':
        return 'bg-blue-600';
      case 'approved':
        return 'bg-green-600';
      case 'executed':
        return 'bg-emerald-600';
      case 'rejected':
        return 'bg-red-600';
      case 'expired':
        return 'bg-gray-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'transaction':
        return 'bg-blue-100 text-blue-800';
      case 'custody_transfer':
        return 'bg-emerald-100 text-emerald-800';
      case 'governance':
        return 'bg-purple-100 text-purple-800';
      case 'parameter_change':
        return 'bg-orange-100 text-orange-800';
      case 'security_update':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Lock className="w-8 h-8 text-purple-400" />
              <h1 className="text-4xl font-bold text-white">Multi-Sig Approvals</h1>
            </div>
            <p className="text-slate-400">Governance and custody approval workflows</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Approvals List */}
            <div className="lg:col-span-2">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Pending Approvals</CardTitle>
                  <CardDescription>Multi-signature approval requests</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-8 text-slate-400">Loading approvals...</div>
                  ) : !approvals || approvals.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">No pending approvals</div>
                  ) : (
                    <div className="space-y-4">
                      {approvals.map((approval) => (
                        <div
                          key={approval.id}
                          onClick={() => setSelectedApproval(approval.id)}
                          className={`border rounded-lg p-4 cursor-pointer transition ${
                            selectedApproval === approval.id
                              ? 'border-purple-500 bg-slate-700'
                              : 'border-slate-700 hover:bg-slate-700/50'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-white font-semibold">{approval.title}</h3>
                              <p className="text-sm text-slate-400 mt-1">{approval.description}</p>
                            </div>
                            <Badge className={getStatusColor(approval.status)}>{approval.status}</Badge>
                          </div>

                          <div className="flex items-center gap-4 mb-3">
                            <Badge className={getTypeColor(approval.type)}>{approval.type}</Badge>
                            <span className="text-sm text-slate-400">
                              {approval.currentSignatures} / {approval.requiredSignatures} signatures
                            </span>
                          </div>

                          <Progress value={(approval.currentSignatures / approval.requiredSignatures) * 100} className="h-2" />
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Approval Details */}
            {selectedApprovalDetails && approvalProgress && (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Approval Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Progress */}
                  <div>
                    <p className="text-slate-400 text-sm mb-2">Signature Progress</p>
                    <Progress value={approvalProgress.signed / approvalProgress.required * 100} className="h-3 mb-2" />
                    <p className="text-xs text-slate-500">
                      {approvalProgress.signed} of {approvalProgress.required} required signatures
                    </p>
                  </div>

                  {/* Signers */}
                  <div>
                    <p className="text-slate-400 text-sm mb-3">Signers</p>
                    <div className="space-y-2">
                      {approvalProgress.signers.map((signer) => (
                        <div key={signer.id} className="flex items-center justify-between p-2 bg-slate-700/50 rounded">
                          <div className="flex items-center gap-2">
                            {signer.signed ? (
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            ) : (
                              <Clock className="w-4 h-4 text-yellow-400" />
                            )}
                            <span className="text-sm text-slate-300">{signer.role}</span>
                          </div>
                          {signer.signed && (
                            <span className="text-xs text-slate-500">
                              {new Date(signer.signedAt!).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-slate-400">Type:</span>
                      <p className="text-white">{selectedApprovalDetails.type}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Created:</span>
                      <p className="text-white">{new Date(selectedApprovalDetails.createdAt).toLocaleString()}</p>
                    </div>
                    {selectedApprovalDetails.expiresAt && (
                      <div>
                        <span className="text-slate-400">Expires:</span>
                        <p className="text-white">{new Date(selectedApprovalDetails.expiresAt).toLocaleString()}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 pt-4 border-t border-slate-700">
                    <Dialog open={showSignDialog} onOpenChange={setShowSignDialog}>
                      <DialogTrigger asChild>
                        <Button className="w-full bg-green-600 hover:bg-green-700">
                          <Send className="w-4 h-4 mr-2" />
                          Sign Approval
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-slate-800 border-slate-700">
                        <DialogHeader>
                          <DialogTitle className="text-white">Sign Approval</DialogTitle>
                          <DialogDescription>Enter your digital signature</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Textarea
                            placeholder="Enter your Ed25519 signature (hex or base64)"
                            value={signatureInput}
                            onChange={(e) => setSignatureInput(e.target.value)}
                            className="bg-slate-700 border-slate-600 text-white"
                            rows={4}
                          />
                          <Button
                            onClick={handleSign}
                            disabled={signMutation.isPending}
                            className="w-full bg-green-600 hover:bg-green-700"
                          >
                            {signMutation.isPending ? 'Signing...' : 'Submit Signature'}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full">
                          <X className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-slate-800 border-slate-700">
                        <DialogHeader>
                          <DialogTitle className="text-white">Reject Approval</DialogTitle>
                          <DialogDescription>Provide a reason for rejection</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Textarea
                            placeholder="Rejection reason"
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            className="bg-slate-700 border-slate-600 text-white"
                            rows={3}
                          />
                          <Button
                            onClick={handleReject}
                            disabled={rejectMutation.isPending}
                            className="w-full bg-red-600 hover:bg-red-700"
                          >
                            {rejectMutation.isPending ? 'Rejecting...' : 'Reject Approval'}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {approvalProgress.signed >= approvalProgress.required && (
                      <Button
                        onClick={handleExecute}
                        disabled={executeMutation.isPending}
                        className="w-full bg-emerald-600 hover:bg-emerald-700"
                      >
                        {executeMutation.isPending ? 'Executing...' : 'Execute'}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
