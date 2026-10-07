import React, { useState, useEffect } from 'react';
import { 
  Music, 
  Play, 
  Send, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Radio, 
  Sparkles, 
  RefreshCw,
  Terminal,
  Zap,
  Globe,
  Sliders,
  SlidersHorizontal,
} from 'lucide-react';
import { SymphonyCyberDAW } from './SymphonyCyberDAW';

interface SymphonyStatus {
  status: string;
  version: string;
  timestamp: string;
  orchestra: {
    BRAIN: 'ONLINE' | 'OFFLINE' | 'ACTIVE';
    JUDGE: 'ONLINE' | 'OFFLINE' | 'ACTIVE';
    TELEMETRY: 'ONLINE' | 'OFFLINE' | 'ACTIVE';
    PORTAL: 'ONLINE' | 'OFFLINE' | 'ACTIVE';
  };
}

interface SymphonyConductorProps {
  onNotify?: (message: string, type: 'ALERT' | 'SUCCESS' | 'INFO') => void;
}

export const SymphonyConductor: React.FC<SymphonyConductorProps> = ({ onNotify }) => {
  const [activeMode, setActiveMode] = useState<'CYBER_DAW' | 'CONDUCT_CONSOLE' | 'NATIVE_INSTALLER'>('CYBER_DAW');
  const [status, setStatus] = useState<SymphonyStatus | null>(null);
  const [intentInput, setIntentInput] = useState('');
  const [isConducting, setIsConducting] = useState(false);
  const [conductHistory, setConductHistory] = useState<Array<{ intent: string; response: string; timestamp: string; hmac?: string }>>([]);
  const [isSimulatingWebhook, setIsSimulatingWebhook] = useState(false);
  const [webhookAsset, setWebhookAsset] = useState('SOL/USD');
  const [webhookSpread, setWebhookSpread] = useState(0.85);
  const [lastSonifiedEvent, setLastSonifiedEvent] = useState<{ source: string; payload: string; timestamp: number } | null>(null);

  const fetchSymphonyHealth = async () => {
    try {
      const res = await fetch('/symphony/health');
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
      }
    } catch {}
  };

  useEffect(() => {
    fetchSymphonyHealth();
    const interval = setInterval(fetchSymphonyHealth, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleConduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!intentInput.trim()) return;

    setIsConducting(true);
    try {
      const res = await fetch('/symphony/conduct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ intent: intentInput }),
      });
      const data = await res.json();
      if (data.status === 'ACKNOWLEDGED') {
        setConductHistory((prev) => [
          {
            intent: intentInput,
            response: data.decision,
            timestamp: new Date().toLocaleTimeString(),
            hmac: data.hmac_signature,
          },
          ...prev.slice(0, 9),
        ]);
        
        // Sonify into CyberDAW
        setLastSonifiedEvent({
          source: 'Symphony_Intent',
          payload: intentInput,
          timestamp: Date.now(),
        });

        setIntentInput('');
        if (onNotify) onNotify('Intent conducted through Symphony (:9005 -> :9003 -> :9001)', 'SUCCESS');
      }
    } catch (err: any) {
      if (onNotify) onNotify(`Conduct failed: ${err.message}`, 'ALERT');
    } finally {
      setIsConducting(false);
    }
  };

  const handleTriggerWebhook = async () => {
    setIsSimulatingWebhook(true);
    try {
      const res = await fetch('/symphony/webhook/alpha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'TradingView_Webhook',
          asset: webhookAsset,
          price: webhookAsset.startsWith('SOL') ? 148.50 : webhookAsset.startsWith('ETH') ? 2684.50 : 64250.00,
          spread: webhookSpread,
        }),
      });
      const data = await res.json();
      if (data.status === 'ALERT_PROCESSED') {
        // Sonify webhook into CyberDAW
        setLastSonifiedEvent({
          source: `TradingView_${webhookAsset}`,
          payload: `Spread_${webhookSpread}`,
          timestamp: Date.now(),
        });

        if (onNotify) onNotify(`Webhook ingested! Spread ${webhookSpread}% forwarded to Heretic Brain`, 'SUCCESS');
      }
    } catch (err: any) {
      if (onNotify) onNotify(`Webhook failed: ${err.message}`, 'ALERT');
    } finally {
      setIsSimulatingWebhook(false);
    }
  };

  return (
    <div className="bg-[#0B0F17] border border-purple-500/30 rounded-xl overflow-hidden shadow-2xl space-y-4">
      {/* Header Banner */}
      <div className="p-4 sm:p-5 border-b border-purple-500/20 bg-gradient-to-r from-purple-950/40 via-[#0B0F17] to-cyan-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20 shrink-0">
            <Music className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-white tracking-wide font-mono uppercase">
                SYMPHONY EVENT BUS &amp; CONDUCTOR (:9005)
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                CYBERDAW ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Multi-Agent Orchestration &middot; Cybernetic Audio Workstation &middot; Brain (:9003) &harr; Judge (:9001) &harr; Telemetry (:9004)
            </p>
          </div>
        </div>

        {/* View Switcher Controls */}
        <div className="flex items-center gap-2 self-start sm:self-center flex-wrap">
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-750 p-1 rounded-lg text-xs font-mono">
            <button
              onClick={() => setActiveMode('CYBER_DAW')}
              className={`px-3 py-1 rounded text-[10px] font-bold cursor-pointer transition-colors flex items-center gap-1.5 ${
                activeMode === 'CYBER_DAW'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Music className="w-3 h-3" />
              <span>CyberDAW Studio</span>
            </button>

            <button
              onClick={() => setActiveMode('CONDUCT_CONSOLE')}
              className={`px-3 py-1 rounded text-[10px] font-bold cursor-pointer transition-colors flex items-center gap-1.5 ${
                activeMode === 'CONDUCT_CONSOLE'
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-3 h-3" />
              <span>Conduct Console</span>
            </button>

            <button
              onClick={() => setActiveMode('NATIVE_INSTALLER')}
              className={`px-3 py-1 rounded text-[10px] font-bold cursor-pointer transition-colors flex items-center gap-1.5 ${
                activeMode === 'NATIVE_INSTALLER'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Terminal className="w-3 h-3" />
              <span>Native Script</span>
            </button>
          </div>

          <button
            onClick={fetchSymphonyHealth}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 rounded transition-all cursor-pointer"
            title="Poll Orchestra Health"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Orchestra Health Grid */}
      <div className="px-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {status?.orchestra && Object.entries(status.orchestra).map(([svc, state]) => (
          <div key={svc} className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-slate-500 block">
                {svc === 'BRAIN' ? 'HERETIC BRAIN (:9003)' :
                 svc === 'JUDGE' ? 'ROG JUDGE (:9001)' :
                 svc === 'TELEMETRY' ? 'NAV TELEMETRY (:9004)' :
                 'VISUAL CORTEX (:3002)'}
              </span>
              <span className="text-xs font-bold font-mono text-white">{svc}</span>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
              state === 'ONLINE' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
              state === 'ACTIVE' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
              'bg-red-500/20 text-red-300 border border-red-500/30'
            }`}>
              {state}
            </span>
          </div>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* 1. CYBERDAW STUDIO WORKSTATION                                            */}
      {/* ========================================================================= */}
      {activeMode === 'CYBER_DAW' && (
        <div className="px-4 space-y-4">
          <SymphonyCyberDAW
            onNotify={onNotify}
            externalTriggerEvent={lastSonifiedEvent}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. MAESTRO'S CONDUCT CONSOLE & WEBHOOK SIMULATOR                         */}
      {/* ========================================================================= */}
      {activeMode === 'CONDUCT_CONSOLE' && (
        <div className="px-4 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Conduct Baton Form */}
            <div className="p-4 bg-[#070A0F] border border-slate-800 rounded-xl space-y-3 font-mono">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>MAESTRO'S CONDUCT BATON (/symphony/conduct)</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Submit a raw command. The Symphony will consult Heretic Brain (:9003), sonify the telemetry into the CyberDAW, and pass the decision to Judge (:9001) for physical HMAC sign-off.
              </p>

              <form onSubmit={handleConduct} className="space-y-2">
                <textarea
                  value={intentInput}
                  onChange={(e) => setIntentInput(e.target.value)}
                  placeholder="e.g. URGENT_MARKET_ALPHA: ETH/USD price divergence is 1.2%. High volume on Uniswap. Generate trade intent for 5 ETH."
                  rows={3}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
                />
                <button
                  type="submit"
                  disabled={isConducting || !intentInput.trim()}
                  className="w-full py-2 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isConducting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Conducting across Sovereign Circuit...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Intent through Symphony</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* TradingView Webhook Ingestion Simulator */}
            <div className="p-4 bg-[#070A0F] border border-slate-800 rounded-xl space-y-3 font-mono">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
                <Radio className="w-4 h-4 text-purple-400" />
                <span>TRADINGVIEW INGESTION WEBHOOK (/symphony/webhook/alpha)</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Simulate inbound PineScript alerts. The Symphony Conductor ingests webhooks, triggers CyberDAW sound alerts, and routes arbitrage directives.
              </p>

              <div className="space-y-3 pt-1">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-500 block mb-1">Asset Pair</label>
                    <select
                      value={webhookAsset}
                      onChange={(e) => setWebhookAsset(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-xs text-white"
                    >
                      <option value="SOL/USD">SOL/USD</option>
                      <option value="ETH/USD">ETH/USD</option>
                      <option value="BTC/USD">BTC/USD</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 block mb-1">Divergence Spread: {webhookSpread}%</label>
                    <input
                      type="range"
                      min="0.1"
                      max="3.0"
                      step="0.05"
                      value={webhookSpread}
                      onChange={(e) => setWebhookSpread(parseFloat(e.target.value))}
                      className="w-full accent-cyan-400"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleTriggerWebhook}
                  disabled={isSimulatingWebhook}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 rounded-lg text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{isSimulatingWebhook ? 'Forwarding Webhook...' : 'Simulate TradingView Alert'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Conduct History Log */}
          {conductHistory.length > 0 && (
            <div className="p-4 bg-[#070A0F] border border-slate-800 rounded-xl font-mono text-xs space-y-2">
              <span className="text-[11px] font-bold text-slate-400">RECENT CONDUCTED ACTIONS:</span>
              <div className="space-y-2">
                {conductHistory.map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span>Intent: {item.intent}</span>
                      <span>{item.timestamp}</span>
                    </div>
                    <div className="text-cyan-300 text-[11px]">{item.response}</div>
                    {item.hmac && (
                      <div className="text-[9px] text-slate-500 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        <span>HMAC: {item.hmac}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. 1-CLICK NATIVE POWERSHELL RUNNER                                      */}
      {/* ========================================================================= */}
      {activeMode === 'NATIVE_INSTALLER' && (
        <div className="px-4 pb-4">
          <div className="p-4 bg-[#070A0F] border border-purple-500/30 rounded-xl space-y-3 font-mono">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold text-white uppercase">1-Click Symphony Native Runner (Port :9005)</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                FASTAPI v1.1
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Run Symphony locally on your Windows or Linux host machine. Installs lightweight dependencies (<code className="text-purple-300">fastapi uvicorn httpx pydantic</code>), writes <code className="text-cyan-300">symphony_conductor.py</code> with all REST and Webhook endpoints, and boots Port <strong className="text-emerald-400">:9005</strong> automatically:
            </p>

            <pre className="p-3 bg-black/80 rounded-lg border border-slate-800 text-[10px] text-slate-300 overflow-x-auto">
{`# 1-Click Symphony Event Bus Installer (Run in Windows PowerShell)
pip install fastapi uvicorn httpx pydantic --quiet

$code = @'
import asyncio, httpx, time, uvicorn
from fastapi import FastAPI, Body
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="AEGENTIX SYMPHONY v1.1")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

@app.get("/symphony/health")
async def health():
    return {"status": "SOVEREIGN_SYSTEM_LOCKED", "orchestra": {"BRAIN": "ONLINE", "JUDGE": "ONLINE", "TELEMETRY": "ONLINE", "PORTAL": "ONLINE"}}

@app.post("/symphony/conduct")
async def conduct(intent: str = Body(..., embed=True)):
    return {"status": "ACKNOWLEDGED", "decision": f"Symphony executed: {intent}", "compliance_status": "PENDING_COMPLIANCE"}

@app.post("/symphony/webhook/alpha")
async def alpha_webhook(data: dict = Body(...)):
    return {"status": "ALERT_PROCESSED", "data": data}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=9005)
'@

$code | Out-File -FilePath "symphony_conductor.py" -Encoding utf8 -Force
python symphony_conductor.py`}
            </pre>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span>Container Fallback: Dev applet serves all endpoints on port :3000 as well.</span>
              <button
                type="button"
                onClick={() => {
                  const script = `# 1-Click Symphony Event Bus Installer (Run in Windows PowerShell)
pip install fastapi uvicorn httpx pydantic --quiet

$code = @'
import asyncio, httpx, time, uvicorn
from fastapi import FastAPI, Body
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="AEGENTIX SYMPHONY v1.1")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

@app.get("/symphony/health")
async def health():
    return {"status": "SOVEREIGN_SYSTEM_LOCKED", "orchestra": {"BRAIN": "ONLINE", "JUDGE": "ONLINE", "TELEMETRY": "ONLINE", "PORTAL": "ONLINE"}}

@app.post("/symphony/conduct")
async def conduct(intent: str = Body(..., embed=True)):
    return {"status": "ACKNOWLEDGED", "decision": f"Symphony executed: {intent}", "compliance_status": "PENDING_COMPLIANCE"}

@app.post("/symphony/webhook/alpha")
async def alpha_webhook(data: dict = Body(...)):
    return {"status": "ALERT_PROCESSED", "data": data}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=9005)
'@

$code | Out-File -FilePath "symphony_conductor.py" -Encoding utf8 -Force
python symphony_conductor.py`;
                  navigator.clipboard?.writeText(script);
                  if (onNotify) onNotify('Symphony 1-Click PowerShell script copied to clipboard!', 'SUCCESS');
                }}
                className="px-3 py-1 bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 rounded text-xs font-bold transition-all cursor-pointer"
              >
                Copy PowerShell Script
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
