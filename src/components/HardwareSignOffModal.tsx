import React, { useState } from 'react';
import { ShieldAlert, Cpu, CheckCircle2, XCircle, Usb, ArrowRight } from 'lucide-react';

interface HardwareSignOffModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onReject: () => void;
  tradeDetails: {
    pair: string;
    amount: number;
    action: string;
    targetVenue: string;
    estimatedValueUsd: number;
  } | null;
}

export const HardwareSignOffModal: React.FC<HardwareSignOffModalProps> = ({
  isOpen,
  onConfirm,
  onReject,
  tradeDetails,
}) => {
  const [signingStep, setSigningStep] = useState<'READY' | 'PROMPTING_DEVICE' | 'SIGNED'>('READY');

  if (!isOpen || !tradeDetails) return null;

  const handleDeviceSign = () => {
    setSigningStep('PROMPTING_DEVICE');
    setTimeout(() => {
      setSigningStep('SIGNED');
      setTimeout(() => {
        onConfirm();
        setSigningStep('READY');
      }, 700);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 font-mono">
      <div className="bg-[#0B0F17] border-2 border-amber-500/50 rounded-lg w-full max-w-md p-5 shadow-2xl shadow-amber-500/10 text-xs">
        {/* Header */}
        <div className="flex items-center gap-2.5 pb-3 mb-4 border-b border-slate-800 text-amber-400 font-bold uppercase tracking-wider text-xs">
          <ShieldAlert className="w-5 h-5 text-amber-400 animate-pulse" />
          <span>Guardian Hardware Sign-Off Required</span>
        </div>

        {/* Notice */}
        <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded mb-4 text-amber-200 leading-relaxed text-[11px]">
          Trade value exceeds <strong>$1,000.00 USD</strong> threshold ($
          {tradeDetails.estimatedValueUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}).
          Sovereign policy mandates physical hardware signer authorization before broadcasting to exchange bridges.
        </div>

        {/* Transaction Summary */}
        <div className="space-y-2 p-3 bg-slate-900/60 rounded border border-slate-800 mb-4 text-[11px]">
          <div className="flex justify-between text-slate-400">
            <span>Action:</span>
            <span className="text-white font-bold">{tradeDetails.action}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Asset Pair:</span>
            <span className="text-cyan-400 font-bold">{tradeDetails.pair}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Amount:</span>
            <span className="text-white font-semibold">{tradeDetails.amount}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Target Venue:</span>
            <span className="text-emerald-400 font-semibold">{tradeDetails.targetVenue}</span>
          </div>
        </div>

        {/* Device Status */}
        <div className="flex items-center justify-center gap-2 p-3 bg-slate-950 rounded border border-slate-800/80 mb-5 text-slate-300">
          <Usb className="w-4 h-4 text-cyan-400" />
          {signingStep === 'READY' && <span>Ledger Nano X connected on USB-0</span>}
          {signingStep === 'PROMPTING_DEVICE' && (
            <span className="text-amber-400 animate-pulse">
              Please review & confirm on your physical device...
            </span>
          )}
          {signingStep === 'SIGNED' && (
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Cryptographic Sign Complete
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onReject}
            disabled={signingStep !== 'READY'}
            className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-medium transition-colors disabled:opacity-50"
          >
            Reject / Abort
          </button>
          <button
            onClick={handleDeviceSign}
            disabled={signingStep !== 'READY'}
            className="flex-1 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            <span>Sign on Device</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
