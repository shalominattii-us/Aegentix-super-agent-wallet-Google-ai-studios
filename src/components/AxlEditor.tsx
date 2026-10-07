import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Copy, 
  Check, 
  RotateCcw, 
  ShieldCheck, 
  Terminal, 
  FileCode, 
  Layers, 
  Workflow, 
  CheckCircle2, 
  AlertTriangle,
  Code2,
  Sparkles,
  Sliders,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { AxlExecutionManifest } from '../types';

interface AxlEditorProps {
  initialCode: string;
  onExecute: (code: string) => Promise<AxlExecutionManifest | null>;
  isExecuting: boolean;
  selectedManifest: AxlExecutionManifest | null;
  onNotify?: (message: string, type: 'ALERT' | 'SUCCESS' | 'INFO') => void;
}

const SAMPLE_TEMPLATES = [
  {
    name: 'Orchard Sync (Paper-Safe)',
    description: 'Synchronizes Grove, Coinbase & Arbitrage with paper-only execution and immutable receipts',
    code: `event nexus.command.config.locked {
    source: "AEGENTIX-NEXUS"
    mode: paper_safe

    zones {
        OpenClaw
        Nemotron
        Hermes
        Docker
        Manus
    }

    task synchronize_orchards {
        planner: PENTAGI
        executor: MANTIS

        targets {
            grove: "http://localhost:8087/events"
            coinbase: "http://localhost:8097/events"
            arbitrage: "http://localhost:8098/events"
        }

        policy {
            live_trading: denied
            order_placement: denied
            withdrawals: denied
        }

        validate {
            require_http_status: 200
            require_event_receipt: true
        }

        ledger {
            immutable: true
            federate: true
        }
    }
}`
  },
  {
    name: 'Cybercore $1M Commercial Dispatch',
    description: 'Commercial packaging, executive demo verification & paper-safe governance pipeline',
    code: `event cybercore.commercial.dispatch {
    source: "AEGENTIS-CEO-SWARM"
    mode: paper_safe

    zones {
        OpenClaw
        Nemotron
        Hermes
        Docker
        Manus
    }

    task commercial_pipeline_validation {
        planner: PENTAGI
        executor: MANTIS

        targets {
            cybercore: "https://cybercore.aegentis.internal/v1/commercial"
            moltbook: "https://moltbook.com/u/aegentix-sovereign"
            shopify: "https://aegentis-x.myshopify.com"
        }

        policy {
            live_trading: denied
            order_placement: denied
            withdrawals: denied
            max_risk_tolerance: zero
        }

        validate {
            require_http_status: 200
            require_event_receipt: true
            require_paper_safe: true
        }

        ledger {
            immutable: true
            federate: true
        }
    }
}`
  },
  {
    name: 'Multi-Zone Threat Evasion & Consensus',
    description: 'Rotates keys upon high anomaly (>7.0) and validates HMAC consensus before state commitment',
    code: `event aegis.threat.evasion.arm {
    source: "AEGENTIX-SOVEREIGN-EDR"
    mode: enclave_isolated

    zones {
        OpenClaw
        Nemotron
        Hermes
        Docker
        Manus
    }

    task threat_evasion_sweep {
        planner: PENTAGI
        executor: MANTIS

        targets {
            rog_hardware: "http://localhost:8081/sovereign"
            nanos_compliance: "http://localhost:9001/verify"
            edr_sentinel: "http://localhost:9004/gate/verify"
        }

        policy {
            anomaly_threshold: 7.0
            auto_key_rotation: armed
            live_trading: denied
            withdrawals: denied
        }

        validate {
            require_http_status: 200
            require_event_receipt: true
        }

        ledger {
            immutable: true
            federate: true
        }
    }
}`
  }
];

// Tokenizer & syntax highlighter for AXL (AEGENTIS eXecution Language)
function highlightAxl(code: string): React.ReactNode[] {
  const lines = code.split('\n');

  return lines.map((line, lineIdx) => {
    // Regex tokens
    const tokens: React.ReactNode[] = [];
    let remaining = line;
    let keyIdx = 0;

    // Pattern matching
    while (remaining.length > 0) {
      // 1. Comments
      const commentMatch = remaining.match(/^(\/\/.*|#.*)/);
      if (commentMatch) {
        tokens.push(
          <span key={`${lineIdx}-${keyIdx++}`} className="text-slate-500 italic">
            {commentMatch[0]}
          </span>
        );
        remaining = '';
        break;
      }

      // 2. Strings
      const strMatch = remaining.match(/^("[^"]*")/);
      if (strMatch) {
        tokens.push(
          <span key={`${lineIdx}-${keyIdx++}`} className="text-emerald-300">
            {strMatch[0]}
          </span>
        );
        remaining = remaining.slice(strMatch[0].length);
        continue;
      }

      // 3. Keywords: event, task, planner, executor, targets, policy, validate, ledger, zones, source, mode
      const kwMatch = remaining.match(/^(event|task|planner|executor|targets|policy|validate|ledger|zones|source|mode)\b/);
      if (kwMatch) {
        tokens.push(
          <span key={`${lineIdx}-${keyIdx++}`} className="text-cyan-400 font-bold">
            {kwMatch[0]}
          </span>
        );
        remaining = remaining.slice(kwMatch[0].length);
        continue;
      }

      // 4. Planners & Core Framework names (PENTAGI, MANTIS, AEGENTIX, AEGENTIS)
      const frameworkMatch = remaining.match(/^(PENTAGI|MANTIS|AEGENTIS|AEGENTIX|OpenClaw|Nemotron|Hermes|Docker|Manus)\b/);
      if (frameworkMatch) {
        tokens.push(
          <span key={`${lineIdx}-${keyIdx++}`} className="text-purple-300 font-bold">
            {frameworkMatch[0]}
          </span>
        );
        remaining = remaining.slice(frameworkMatch[0].length);
        continue;
      }

      // 5. Booleans and Policy status (denied, permitted, true, false, paper_safe, live_sovereign)
      const boolMatch = remaining.match(/^(denied|permitted|true|false|paper_safe|live_sovereign|enclave_isolated|zero|armed)\b/);
      if (boolMatch) {
        const val = boolMatch[0];
        const color = val === 'denied' || val === 'zero'
          ? 'text-rose-400 font-bold'
          : val === 'permitted' || val === 'true' || val === 'paper_safe'
          ? 'text-emerald-400 font-bold'
          : 'text-amber-300 font-bold';

        tokens.push(
          <span key={`${lineIdx}-${keyIdx++}`} className={color}>
            {val}
          </span>
        );
        remaining = remaining.slice(boolMatch[0].length);
        continue;
      }

      // 6. Properties / Identifiers followed by colon (e.g. live_trading:)
      const propMatch = remaining.match(/^([a-zA-Z0-9_.-]+)(?=\s*:)/);
      if (propMatch) {
        tokens.push(
          <span key={`${lineIdx}-${keyIdx++}`} className="text-indigo-300">
            {propMatch[0]}
          </span>
        );
        remaining = remaining.slice(propMatch[0].length);
        continue;
      }

      // 7. Numbers
      const numMatch = remaining.match(/^([0-9.]+)/);
      if (numMatch) {
        tokens.push(
          <span key={`${lineIdx}-${keyIdx++}`} className="text-amber-300 font-mono">
            {numMatch[0]}
          </span>
        );
        remaining = remaining.slice(numMatch[0].length);
        continue;
      }

      // 8. Braces and Punctuations
      const punctMatch = remaining.match(/^([{}():,])/);
      if (punctMatch) {
        tokens.push(
          <span key={`${lineIdx}-${keyIdx++}`} className="text-slate-400 font-bold">
            {punctMatch[0]}
          </span>
        );
        remaining = remaining.slice(punctMatch[0].length);
        continue;
      }

      // 9. Regular word / whitespace
      const defaultMatch = remaining.match(/^(\s+|[^\s"{}(),:#]+)/);
      if (defaultMatch) {
        tokens.push(
          <span key={`${lineIdx}-${keyIdx++}`} className="text-slate-200">
            {defaultMatch[0]}
          </span>
        );
        remaining = remaining.slice(defaultMatch[0].length);
        continue;
      }

      // Fallback 1 char
      tokens.push(remaining[0]);
      remaining = remaining.slice(1);
    }

    return (
      <div key={lineIdx} className="leading-5">
        <span className="inline-block w-8 text-slate-600 select-none text-[10px] text-right pr-2">
          {lineIdx + 1}
        </span>
        {tokens.length > 0 ? tokens : <span>&nbsp;</span>}
      </div>
    );
  });
}

export const AxlEditor: React.FC<AxlEditorProps> = ({
  initialCode,
  onExecute,
  isExecuting,
  selectedManifest,
  onNotify,
}) => {
  const [code, setCode] = useState(initialCode);
  const [copied, setCopied] = useState(false);
  const [editorMode, setEditorMode] = useState<'SPLIT' | 'CODE_ONLY' | 'MANIFEST_ONLY'>('SPLIT');
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(0);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (initialCode && !code) {
      setCode(initialCode);
    }
  }, [initialCode]);

  // Synchronize scroll between textarea and syntax highlighted pre
  const handleScroll = () => {
    if (textareaRef.current && preRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    if (onNotify) onNotify('AXL source code copied to clipboard', 'INFO');
  };

  const handleLoadTemplate = (index: number) => {
    setSelectedTemplateIndex(index);
    setCode(SAMPLE_TEMPLATES[index].code);
    if (onNotify) onNotify(`Loaded AXL Template: "${SAMPLE_TEMPLATES[index].name}"`, 'SUCCESS');
  };

  const handleRun = async () => {
    const res = await onExecute(code);
    if (res && onNotify) {
      onNotify(`AXL Program cleared validation gates: Task "${res.taskGraph[0]?.taskName || 'Execute'}" registered.`, 'SUCCESS');
    }
  };

  return (
    <div className="bg-[#070A0F] border border-slate-800 rounded-xl overflow-hidden shadow-2xl space-y-3 font-mono text-xs">
      {/* Top Action Toolbar */}
      <div className="p-3 border-b border-slate-800 bg-slate-900/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-cyan-400 font-bold">
            <Code2 className="w-4 h-4 text-cyan-400" />
            <span className="uppercase tracking-wider">AXL Declarative Editor</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              v1.0-SYNTAX
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-[11px] text-slate-400">
            <span>Template:</span>
            <select
              value={selectedTemplateIndex}
              onChange={(e) => handleLoadTemplate(Number(e.target.value))}
              className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs focus:border-cyan-500"
            >
              {SAMPLE_TEMPLATES.map((tmpl, idx) => (
                <option key={idx} value={idx}>
                  {tmpl.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2">
          {/* View Modes */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded p-0.5 text-[10px]">
            <button
              onClick={() => setEditorMode('SPLIT')}
              className={`px-2 py-1 rounded transition-colors ${
                editorMode === 'SPLIT' ? 'bg-cyan-500/30 text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Split View
            </button>
            <button
              onClick={() => setEditorMode('CODE_ONLY')}
              className={`px-2 py-1 rounded transition-colors ${
                editorMode === 'CODE_ONLY' ? 'bg-cyan-500/30 text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Code Only
            </button>
            <button
              onClick={() => setEditorMode('MANIFEST_ONLY')}
              className={`px-2 py-1 rounded transition-colors ${
                editorMode === 'MANIFEST_ONLY' ? 'bg-cyan-500/30 text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Manifest
            </button>
          </div>

          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded text-xs transition-colors"
            title="Copy AXL code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={() => setCode(SAMPLE_TEMPLATES[selectedTemplateIndex].code)}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded text-xs transition-colors"
            title="Reset code to original template"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            onClick={handleRun}
            disabled={isExecuting}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-cyan-600 via-indigo-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white rounded font-bold text-xs shadow-lg shadow-cyan-600/30 cursor-pointer disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 ${isExecuting ? 'animate-spin' : ''}`} />
            <span>{isExecuting ? 'Dispatching...' : 'Compile & Dispatch AXL'}</span>
          </button>
        </div>
      </div>

      {/* Editor & Visualizer Body */}
      <div className={`p-3 grid gap-3 ${
        editorMode === 'SPLIT' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'
      }`}>
        {/* LEFT PANE: Syntax-Highlighted Code Editor */}
        {editorMode !== 'MANIFEST_ONLY' && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                <span>AXL Source Declaration</span>
              </span>
              <span className="text-[10px] text-slate-500">Live Syntax Highlighting Active</span>
            </div>

            {/* Overlapping Textarea + Highlighting Layer */}
            <div className="relative border border-slate-800 rounded-lg overflow-hidden bg-[#05070B] min-h-[380px] max-h-[520px]">
              {/* Highlighted Visual Layer */}
              <pre
                ref={preRef}
                className="absolute inset-0 p-3 font-mono text-xs overflow-auto pointer-events-none select-none z-10 m-0 whitespace-pre"
                aria-hidden="true"
              >
                {highlightAxl(code)}
              </pre>

              {/* Editable Textarea Layer (Transparent text, visible cursor) */}
              <textarea
                ref={textareaRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onScroll={handleScroll}
                rows={18}
                spellCheck={false}
                className="relative z-20 w-full h-full min-h-[380px] p-3 font-mono text-xs bg-transparent text-transparent caret-cyan-400 focus:outline-none resize-none leading-5 overflow-auto selection:bg-cyan-500/30 selection:text-transparent"
                style={{ tabSize: 4 }}
              />
            </div>

            {/* Syntax Legend Bar */}
            <div className="flex items-center justify-between text-[10px] text-slate-400 px-1 pt-1">
              <div className="flex items-center gap-3">
                <span><span className="text-cyan-400 font-bold">event/task</span> keyword</span>
                <span><span className="text-purple-300 font-bold">PENTAGI</span> planner</span>
                <span><span className="text-emerald-400 font-bold">denied/true</span> policy</span>
                <span><span className="text-amber-300 font-bold">200</span> status</span>
              </div>
              <span className="text-slate-500">Lines: {code.split('\n').length}</span>
            </div>
          </div>
        )}

        {/* RIGHT PANE: Compiled Execution Graph & Policy Verification */}
        {editorMode !== 'CODE_ONLY' && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <Workflow className="w-3.5 h-3.5 text-indigo-400" />
                <span>PENTAGI &rarr; MANTIS Execution Manifest</span>
              </span>
              {selectedManifest && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  {selectedManifest.mode.toUpperCase()}
                </span>
              )}
            </div>

            {selectedManifest ? (
              <div className="bg-[#05070B] border border-slate-800 rounded-lg p-3 min-h-[380px] max-h-[520px] overflow-y-auto space-y-3">
                {/* Event Identification */}
                <div className="p-2.5 bg-slate-900/50 rounded border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cyan-300 text-xs">{selectedManifest.eventName}</span>
                    <span className="text-[10px] text-slate-400">{new Date(selectedManifest.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400">
                    <div>Source: <span className="text-white font-semibold">{selectedManifest.source}</span></div>
                    <div>Validation: <span className="text-emerald-400 font-bold">{selectedManifest.validationGateStatus}</span></div>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    Zones: <span className="text-indigo-300">{selectedManifest.zones.join(', ')}</span>
                  </div>
                </div>

                {/* Task Graph Nodes */}
                <div className="space-y-2">
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Task Graph Matrix (PENTAGI Generated):
                  </div>

                  {selectedManifest.taskGraph.map((node) => (
                    <div key={node.id} className="p-3 bg-slate-900/40 border border-indigo-500/30 rounded-lg space-y-2">
                      <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/80">
                        <span className="font-bold text-purple-300 text-xs">
                          Task: {node.taskName}
                        </span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-indigo-500/20 text-indigo-300">
                          {node.planner} &rarr; {node.executor}
                        </span>
                      </div>

                      {/* Policy Verification Grid */}
                      <div className="grid grid-cols-3 gap-2 text-[10px]">
                        <div className="p-1.5 bg-slate-950/60 rounded border border-slate-800">
                          <span className="text-slate-500 block">Live Trading:</span>
                          <span className={node.policies.live_trading === 'permitted' ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
                            {node.policies.live_trading.toUpperCase()}
                          </span>
                        </div>
                        <div className="p-1.5 bg-slate-950/60 rounded border border-slate-800">
                          <span className="text-slate-500 block">Order Placement:</span>
                          <span className={node.policies.order_placement === 'permitted' ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
                            {node.policies.order_placement.toUpperCase()}
                          </span>
                        </div>
                        <div className="p-1.5 bg-slate-950/60 rounded border border-slate-800">
                          <span className="text-slate-500 block">Withdrawals:</span>
                          <span className={node.policies.withdrawals === 'permitted' ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
                            {node.policies.withdrawals.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {/* Targets */}
                      <div className="text-[10px] space-y-1 pt-1 border-t border-slate-800/80">
                        <span className="text-slate-500 font-semibold block">Target Endpoints:</span>
                        {Object.entries(node.targets).map(([k, v]) => (
                          <div key={k} className="flex items-center justify-between text-slate-300">
                            <span className="capitalize">{k}:</span>
                            <code className="text-cyan-400">{v}</code>
                          </div>
                        ))}
                      </div>

                      {/* Validation & Hash Receipt */}
                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                        <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Status {node.validation.require_http_status} Verified</span>
                        </div>
                        <span className="text-slate-500 font-mono text-[9px] truncate max-w-[180px]">
                          Receipt: {node.ledger.receiptHash}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Signed Envelope */}
                <div className="p-2.5 bg-emerald-950/20 border border-emerald-500/30 rounded text-[10px] space-y-1">
                  <div className="flex items-center justify-between text-emerald-300 font-bold">
                    <span>Cryptographic Federation Envelope</span>
                    <span>Verified</span>
                  </div>
                  <div className="text-slate-400 font-mono text-[9px] truncate">
                    Signature: {selectedManifest.federationReceipt.envelopeSignature}
                  </div>
                  <div className="text-slate-500 text-[9px]">
                    Federated to: {selectedManifest.federationReceipt.federatedToNodes.join(' &middot; ')}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-[#05070B] border border-slate-800 rounded-lg p-8 min-h-[380px] flex flex-col items-center justify-center text-center text-slate-500 space-y-2">
                <Code2 className="w-8 h-8 text-slate-600 animate-pulse" />
                <span className="text-xs">Click "Compile & Dispatch AXL" above to execute and inspect the task graph.</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
