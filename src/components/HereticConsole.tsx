import React, { useState } from 'react';
import { Terminal, Shield, AlertCircle, Trash2, Cpu, CheckCircle } from 'lucide-react';
import { ThoughtLog } from '../types';

interface HereticConsoleProps {
  logs: ThoughtLog[];
  onClearLogs: () => void;
  isAutopilot: boolean;
}

export const HereticConsole: React.FC<HereticConsoleProps> = ({
  logs,
  onClearLogs,
  isAutopilot,
}) => {
  const [filterLevel, setFilterLevel] = useState<'ALL' | 'ALERT' | 'SECURITY' | 'COMPLIANCE'>('ALL');

  const filteredLogs = logs.filter((l) => {
    if (filterLevel === 'ALL') return true;
    return l.level === filterLevel;
  });

  return (
    <div className="bg-[#0D121D] border border-slate-800 rounded-lg p-4 font-mono text-xs flex flex-col h-full shadow-sm">
      {/* Console Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Heretic Thought Stream
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {/* Status Indicator */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-900 rounded border border-slate-800 text-[10px]">
            <span
              className={`w-2 h-2 rounded-full ${
                isAutopilot ? 'bg-cyan-400 animate-pulse' : 'bg-slate-500'
              }`}
            />
            <span className="text-slate-300">{isAutopilot ? 'OODA LOOP ACTIVE' : 'IDLE'}</span>
          </div>

          <button
            onClick={onClearLogs}
            className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
            title="Clear Console Output"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 mb-3 text-[10px]">
        {(['ALL', 'ALERT', 'SECURITY', 'COMPLIANCE'] as const).map((lvl) => (
          <button
            key={lvl}
            onClick={() => setFilterLevel(lvl)}
            className={`px-2 py-0.5 rounded transition-colors ${
              filterLevel === lvl
                ? 'bg-slate-800 text-cyan-300 font-bold border border-slate-700'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            {lvl}
          </button>
        ))}
      </div>

      {/* Terminal Output Body */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[560px]">
        {filteredLogs.length === 0 ? (
          <div className="text-slate-400 text-xs py-8 text-center italic">
            Waiting for autonomous cycle execution...
          </div>
        ) : (
          filteredLogs.map((log, idx) => {
            const isAlert = log.level === 'ALERT';
            const isSecurity = log.level === 'SECURITY';
            const isCompliance = log.level === 'COMPLIANCE';
            const uniqueKey = log.id ? `${log.id}-${idx}` : `log-${idx}`;

            return (
              <div
                key={uniqueKey}
                className={`p-2.5 rounded border text-[11px] leading-relaxed transition-all ${
                  isAlert
                    ? 'bg-cyan-950/20 border-cyan-500/40 text-cyan-200'
                    : isSecurity
                    ? 'bg-amber-950/20 border-amber-500/30 text-amber-200'
                    : isCompliance
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                    : 'bg-slate-900/40 border-slate-800/60 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-[9px] opacity-70 mb-1">
                  <div className="flex items-center gap-1.5">
                    <span>[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                    {log.step && (
                      <span className="font-semibold text-white bg-slate-800/80 px-1 rounded">
                        {log.step}
                      </span>
                    )}
                  </div>
                  <span className="font-bold">{log.level}</span>
                </div>
                <p className="font-mono">{log.message}</p>
              </div>
            );
          })
        )}
      </div>

      {/* Terminal Footer */}
      <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span>Gemini 3.8 Flash / Heretic Orchestrator</span>
        </div>
        <span>Buffer: {filteredLogs.length} events</span>
      </div>
    </div>
  );
};
