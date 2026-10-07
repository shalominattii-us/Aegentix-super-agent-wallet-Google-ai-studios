import React from 'react';
import { Radio, ArrowRight, Zap, CheckCircle2, Copy, Play, ShieldCheck, Clock } from 'lucide-react';
import { AutonomousSignal } from '../types';

interface AutonomousSignalsFeedProps {
  signals: AutonomousSignal[];
  onExecuteSignal: (signalId: string) => void;
  isExecuting: boolean;
}

export const AutonomousSignalsFeed: React.FC<AutonomousSignalsFeedProps> = ({
  signals,
  onExecuteSignal,
  isExecuting,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopyPayload = (signal: AutonomousSignal) => {
    navigator.clipboard.writeText(JSON.stringify(signal, null, 2));
    setCopiedId(signal.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-[#0D121D] border border-slate-800 rounded-lg p-5 font-mono shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Autonomous Signals Broadcaster
          </h3>
        </div>
        <span className="text-[11px] text-slate-400">
          {signals.filter((s) => s.status === 'PENDING').length} Pending Dispatch
        </span>
      </div>

      {signals.length === 0 ? (
        <div className="p-8 text-center text-slate-400 text-xs">
          No autonomous signals currently queued. Trigger a scan from the left panel or enable Autopilot mode.
        </div>
      ) : (
        <div className="space-y-3">
          {signals.map((sig, idx) => {
            const isPending = sig.status === 'PENDING';
            const isExecuted = sig.status === 'EXECUTED';
            const uniqueKey = sig.id ? `${sig.id}-${idx}` : `sig-${idx}`;

            return (
              <div
                key={uniqueKey}
                className={`p-4 rounded-lg border transition-all ${
                  isPending
                    ? 'bg-slate-900/70 border-emerald-500/40 shadow-sm shadow-emerald-500/5'
                    : 'bg-slate-900/30 border-slate-800/60 opacity-80'
                }`}
              >
                {/* Top Row: Action & Badges */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        sig.action === 'ARBITRAGE'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      }`}
                    >
                      {sig.action} · {sig.pair}
                    </span>
                    <span className="text-slate-400 text-[10px]">
                      {new Date(sig.timestamp).toLocaleTimeString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="text-slate-400">Confidence:</span>
                    <span className="text-cyan-400 font-bold">{(sig.confidence * 100).toFixed(0)}%</span>
                  </div>
                </div>

                {/* Routing & Profit Projection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-2.5 bg-slate-950/70 rounded border border-slate-800/80 mb-2.5 text-xs">
                  <div>
                    <div className="text-[10px] text-slate-400 mb-0.5">Execution Route:</div>
                    <div className="flex items-center gap-1.5 text-slate-200 font-medium">
                      <span>{sig.sourceVenue}</span>
                      <ArrowRight className="w-3 h-3 text-cyan-400" />
                      <span>{sig.targetVenue}</span>
                    </div>
                  </div>

                  <div className="sm:text-right">
                    <div className="text-[10px] text-slate-400 mb-0.5">Est. Net Alpha:</div>
                    <div className="text-sm font-bold text-emerald-400 tabular-nums">
                      +${sig.estimatedProfitUsd.toFixed(2)}{' '}
                      <span className="text-[10px] text-slate-400 font-normal">
                        (Spread: {sig.spreadPct}%)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Rationale */}
                <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
                  {sig.rationale}
                </p>

                {/* Bottom Row: Compliance Hash & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-800/60 text-[10px]">
                  <div className="flex items-center gap-1.5 text-slate-400 truncate max-w-xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">HMAC: {sig.complianceHash || 'Signed by actor-001'}</span>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    <button
                      onClick={() => handleCopyPayload(sig)}
                      className="flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors"
                      title="Copy Signal JSON Payload"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedId === sig.id ? 'Copied' : 'JSON'}</span>
                    </button>

                    {isPending && (
                      <button
                        onClick={() => onExecuteSignal(sig.id)}
                        disabled={isExecuting}
                        className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded transition-colors disabled:opacity-50"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Execute Now</span>
                      </button>
                    )}

                    {isExecuted && (
                      <div className="flex items-center gap-1 text-emerald-400 font-medium px-2 py-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Executed</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
