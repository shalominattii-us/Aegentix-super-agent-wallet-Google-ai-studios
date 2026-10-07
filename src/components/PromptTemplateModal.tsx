import React, { useState } from 'react';
import { X, Copy, Check, Sparkles, Terminal, Code2, Play } from 'lucide-react';
import { MarketAsset } from '../types';

interface PromptTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTestInference: (assetSymbol: string) => void;
  assets: MarketAsset[];
  isTesting: boolean;
}

export const PromptTemplateModal: React.FC<PromptTemplateModalProps> = ({
  isOpen,
  onClose,
  onTestInference,
  assets,
  isTesting,
}) => {
  const [copied, setCopied] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<string>(assets[0]?.symbol || 'ETH/USDT');

  if (!isOpen) return null;

  const promptTemplateText = `[SYSTEM CONTEXT: AEGENTIX CYBERNETIC CORE - HERETIC LLM v3.5-SOVEREIGN]
Role: High-frequency autonomous quantitative trading and cross-exchange arbitrage analyst.
Authority: actor-001 [SOVEREIGN]
Strategy Objective: Maximize risk-adjusted alpha while enforcing strict capital preservation.

[MATHEMATICAL EVALUATION RULES]
1. Arbitrage Spread Metric:
   SpreadPct = (|P_cex - P_dex| / min(P_cex, P_dex)) * 100
   - If SpreadPct >= MinimumSpreadThreshold (default: 0.50%), formulate an ARBITRAGE or CROSS_REBALANCE signal.
   - Routing:
     * If P_dex < P_cex: Direction = BUY_DEX_SELL_CEX (Source = DEX, Target = CEX).
     * If P_cex < P_dex: Direction = BUY_CEX_SELL_DEX (Source = CEX, Target = DEX).
2. Net Alpha Yield:
   NetAlpha = (SpreadValue * TradeQuantity) - (GasCost_DEX + TakerFee_CEX + SlippageBuffer)
   - If NetAlpha <= 0, ABORT execution and output HOLD.
3. Volatility & Trend Invariants:
   - High Volatility: Require higher confidence threshold (>= 0.90) and limit slippage to <= 0.30%.
   - RSI Divergence: If RSI > 70 with elevated spread, favor selling overbought leg. If RSI < 30, favor accumulation.

[INPUT MARKET CONTEXT]
{{MARKET_CONTEXT_JSON}}

[AGENT PARAMETERS]
Strategy: arbitrage_balanced
Min Spread Threshold: 0.50%
Max Slippage Tolerance: 0.25%
Gas Price Ceiling: 25 Gwei

[OUTPUT DIRECTIVE]
Output strictly a valid JSON object matching the following structure without markdown wrappers:
{
  "signal": "BUY" | "SELL" | "ARBITRAGE" | "REBALANCE" | "HOLD",
  "asset": string,
  "pair": string,
  "spreadPct": number,
  "netAlphaUsd": number,
  "confidence": number,
  "sourceVenue": string,
  "targetVenue": string,
  "tradeQuantity": number,
  "slippageLimitPct": number,
  "estimatedGasUsd": number,
  "reason": string,
  "executionStepSequence": [string, string, string]
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(promptTemplateText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-mono">
      <div className="bg-[#0B0F17] border border-cyan-500/30 rounded-lg w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl shadow-cyan-500/10">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Heretic LLM Inference Prompt Template
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4 text-xs">
          <div className="flex items-center justify-between text-slate-300 bg-slate-900/60 p-2.5 rounded border border-slate-800">
            <div>
              <span className="font-semibold text-white">Target Model:</span> Gemini 3.8 Flash / Heretic Qwen-3.5-4B
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400">Context Window: 1M tokens</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Template'}</span>
              </button>
            </div>
          </div>

          {/* Template Code Box */}
          <div className="relative">
            <pre className="p-4 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 text-[11px] leading-relaxed overflow-x-auto whitespace-pre-wrap font-mono max-h-[380px]">
              {promptTemplateText}
            </pre>
          </div>

          {/* Direct Execution Testing */}
          <div className="p-3 bg-cyan-950/20 border border-cyan-500/30 rounded flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-300">Live Test Asset:</span>
              <select
                value={selectedAsset}
                onChange={(e) => setSelectedAsset(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white text-xs"
              >
                {assets.map((a) => (
                  <option key={a.symbol} value={a.symbol}>
                    {a.symbol} (Spread: {a.spreadPct}%)
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => onTestInference(selectedAsset)}
              disabled={isTesting}
              className="flex items-center gap-2 px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded text-xs transition-colors disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isTesting ? 'Synthesizing...' : 'Run Test Prompt with Gemini 3.8 Flash'}</span>
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
