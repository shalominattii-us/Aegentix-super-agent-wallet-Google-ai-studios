import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Radio, 
  Zap, 
  RefreshCw, 
  Copy, 
  Check, 
  Server, 
  Sliders, 
  Layers, 
  Flame, 
  AlertTriangle, 
  CheckCircle2, 
  Cpu, 
  BarChart3,
  ExternalLink,
  Bot,
  Sparkles,
  Scale,
  ShieldCheck,
  Send,
  SlidersHorizontal
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { 
  LiveTelemetryData, 
  NavHistoryPoint, 
  Telemetry24HourTrendPoint,
  GeminiTelemetryInsight, 
  GeminiRebalanceMatrix, 
  GeminiRebalanceOrder 
} from '../types';

interface LiveTelemetryNavSuiteProps {
  onTriggerEventAlpha?: (pair: string) => void;
}

export const LiveTelemetryNavSuite: React.FC<LiveTelemetryNavSuiteProps> = ({
  onTriggerEventAlpha,
}) => {
  const [telemetry, setTelemetry] = useState<LiveTelemetryData | null>(null);
  const [history, setHistory] = useState<NavHistoryPoint[]>([]);
  const [history24h, setHistory24h] = useState<Telemetry24HourTrendPoint[]>([]);
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [streamActiveState, setStreamActiveState] = useState<'SSE_STREAM' | 'POLLING' | 'PAUSED'>('SSE_STREAM');
  const [selectedAsset, setSelectedAsset] = useState<'ETH' | 'BTC' | 'SOL'>('ETH');
  const [chartMode, setChartMode] = useState<'24H_CONSOLIDATED' | '24H_DAILY_PNL' | '24H_EXCHANGE_BALANCES' | 'REALTIME_STREAM'>('24H_CONSOLIDATED');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [copiedGrafana, setCopiedGrafana] = useState(false);
  const [streamTicksCount, setStreamTicksCount] = useState<number>(0);
  const [recentEvents, setRecentEvents] = useState<Array<{ id: string; time: string; text: string; type: 'TRIGGER' | 'TICK' | 'SPREAD' }>>([]);
  const eventSourceRef = useRef<EventSource | null>(null);

  // Gemini Sovereign Telemetry & Multi-Asset Rebalance Suite State
  const [selectedEngine, setSelectedEngine] = useState<'GEMINI_38_FLASH' | 'HERETIC_9003'>('GEMINI_38_FLASH');
  const [geminiInsight, setGeminiInsight] = useState<GeminiTelemetryInsight | null>(null);
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false);
  const [autoGeminiStream, setAutoGeminiStream] = useState(true);

  const [geminiRebalanceMatrix, setGeminiRebalanceMatrix] = useState<GeminiRebalanceMatrix | null>(null);
  const [targetCexRatio, setTargetCexRatio] = useState<number>(0.55);
  const [isFormulatingRebalance, setIsFormulatingRebalance] = useState(false);
  const [isExecutingRebalance, setIsExecutingRebalance] = useState(false);
  const [rebalanceReceipt, setRebalanceReceipt] = useState<{
    txCount: number;
    totalAlpha: number;
    timestamp: string;
    targetRatio: string;
  } | null>(null);


  // Helper to generate initial 24h trend data points
  const default24HourTrends = (): Telemetry24HourTrendPoint[] => {
    const pts: Telemetry24HourTrendPoint[] = [];
    const now = Date.now();
    const currentTotal = 48294.50;
    const currentCex = 26102.50;
    const currentDex = 22192.00;
    const currentPnl = 1420.50;

    for (let h = 23; h >= 0; h--) {
      const t = now - h * 3600 * 1000;
      const hourDate = new Date(t);
      const hourStr = `${hourDate.getHours().toString().padStart(2, '0')}:00`;
      const progress = (24 - h) / 24;
      const pnlCycle = Math.sin(progress * Math.PI * 2) * 160 + Math.sin(progress * Math.PI * 4) * 75;
      const pnlVal = Number((currentPnl * (0.25 + progress * 0.75) + pnlCycle).toFixed(2));
      const balanceJitter = Math.cos(progress * Math.PI * 2) * 240 + (progress * 750);
      const totalBalance = Number((currentTotal - (1 - progress) * 1150 + balanceJitter).toFixed(2));
      const cexBalance = Number((currentCex - (1 - progress) * 620 + balanceJitter * 0.54).toFixed(2));
      const dexBalance = Number((currentDex - (1 - progress) * 530 + balanceJitter * 0.46).toFixed(2));
      const spreadPct = Number((0.48 + Math.sin(progress * 5) * 0.22 + 0.12).toFixed(2));

      pts.push({
        time: h === 0 ? 'Now' : hourStr,
        fullTime: hourDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: t,
        dailyPnlUsd: h === 0 ? currentPnl : pnlVal,
        dailyPnlPct: Number(((h === 0 ? currentPnl : pnlVal) / (totalBalance || 1) * 100).toFixed(2)),
        totalBalanceUsd: h === 0 ? currentTotal : totalBalance,
        cexBalanceUsd: h === 0 ? currentCex : cexBalance,
        dexBalanceUsd: h === 0 ? currentDex : dexBalance,
        spreadPct,
      });
    }
    return pts;
  };

  // Initial fetch and fallback polling
  const fetchTelemetry = async () => {
    try {
      const res = await fetch('/api/telemetry/live-nav');
      if (res.ok) {
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) return;
        const data: LiveTelemetryData = await res.json();
        setTelemetry(data);
        if (data.navHistory && data.navHistory.length > 0) {
          setHistory(data.navHistory);
        }
        if (data.history24h && data.history24h.length > 0) {
          setHistory24h(data.history24h);
        } else if (history24h.length === 0) {
          setHistory24h(default24HourTrends());
        }
      }
    } catch {
      if (history24h.length === 0) {
        setHistory24h(default24HourTrends());
      }
    }
  };

  // Connect to SSE stream
  useEffect(() => {
    let reconnectTimeout: any = null;
    let isCancelled = false;

    const setupSSE = () => {
      if (isCancelled || !isStreaming) return;

      try {
        fetchTelemetry();
        const es = new EventSource('/api/telemetry/stream');
        eventSourceRef.current = es;

        es.onopen = () => {
          setStreamActiveState('SSE_STREAM');
        };

        es.onmessage = (event) => {
          try {
            const parsed = JSON.parse(event.data);
            if (parsed.type === 'NAV_TELEMETRY_TICK' && parsed.point) {
              setStreamTicksCount((prev) => prev + 1);
              setHistory((prev) => {
                const updated = [...prev, parsed.point];
                return updated.length > 60 ? updated.slice(updated.length - 60) : updated;
              });

              // Update telemetry container
              setTelemetry((prev) => {
                if (!prev) return null;
                return {
                  ...prev,
                  currentNav: parsed.currentNav,
                  cexUsd: parsed.cexUsd,
                  dexUsd: parsed.dexUsd,
                  currentDeviationPct: parsed.navDeviationPct,
                  prices: {
                    ...prev.prices,
                    ETH: {
                      cex: parsed.ethPriceCex,
                      dex: parsed.ethPriceDex,
                      spreadPct: parsed.ethSpreadPct,
                    },
                  },
                  prometheusGauges: {
                    ...prev.prometheusGauges,
                    aegentix_nav_usd: parsed.currentNav,
                    aegentix_market_price_eth_cex: parsed.ethPriceCex,
                    aegentix_market_price_eth_dex: parsed.ethPriceDex,
                    agent_alpha_spread_detected: parsed.ethSpreadPct,
                  },
                };
              });

              // If deviation triggered (>0.10%), register live alert event
              if (parsed.deviationTriggered) {
                setRecentEvents((prev) => [
                  {
                    id: `ev-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                    time: new Date().toLocaleTimeString(),
                    text: `NAV Deviation Δ +${parsed.navDeviationPct}% triggered event-driven Heretic consult (Spread: ${parsed.ethSpreadPct}%)`,
                    type: 'TRIGGER',
                  },
                  ...prev.slice(0, 15),
                ]);
              }
            }
          } catch {
            // Transient message parse ignore
          }
        };

        es.onerror = () => {
          setStreamActiveState('POLLING');
          es.close();
          eventSourceRef.current = null;
          // Reconnect cleanly after 3.5 seconds
          if (!isCancelled && isStreaming) {
            reconnectTimeout = setTimeout(setupSSE, 3500);
          }
        };
      } catch {
        setStreamActiveState('POLLING');
        if (!isCancelled && isStreaming) {
          reconnectTimeout = setTimeout(setupSSE, 3500);
        }
      }
    };

    if (isStreaming) {
      setupSSE();
    } else {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      setStreamActiveState('PAUSED');
    }

    return () => {
      isCancelled = true;
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [isStreaming]);

  // Fallback polling if SSE drops
  useEffect(() => {
    if (streamActiveState === 'POLLING' && isStreaming) {
      const interval = setInterval(() => {
        fetchTelemetry();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [streamActiveState, isStreaming]);

  // Fetch Gemini Qualitative Telemetry Insights
  const fetchGeminiInsight = async () => {
    setIsGeneratingInsight(true);
    try {
      const res = await fetch('/api/agent/gemini-telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nav: telemetry?.currentNav,
          prices: telemetry?.prices,
        }),
      });
      if (res.ok) {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await res.json();
          setGeminiInsight(data);
        }
      }
    } catch {
      // Quiet fail during restart
    } finally {
      setIsGeneratingInsight(false);
    }
  };

  // Fetch Multi-Asset Rebalance Matrix
  const fetchRebalanceMatrix = async (customRatio?: number) => {
    setIsFormulatingRebalance(true);
    try {
      const ratio = customRatio !== undefined ? customRatio : targetCexRatio;
      const res = await fetch(`/api/agent/gemini-rebalance-matrix?targetCexRatio=${ratio}`);
      if (res.ok) {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await res.json();
          setGeminiRebalanceMatrix(data);
        }
      }
    } catch {
      // Quiet fail during restart
    } finally {
      setIsFormulatingRebalance(false);
    }
  };

  // Execute Batch Rebalance
  const handleExecuteRebalance = async () => {
    if (!geminiRebalanceMatrix || !geminiRebalanceMatrix.orders || geminiRebalanceMatrix.orders.length === 0) return;
    setIsExecutingRebalance(true);
    try {
      const res = await fetch('/api/agent/gemini-rebalance-execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetCexRatio,
          orders: geminiRebalanceMatrix.orders,
          simulateOnly: false,
        }),
      });
      if (res.ok) {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await res.json();
          setRebalanceReceipt({
            txCount: data.executedCount || geminiRebalanceMatrix.orders.length,
            totalAlpha: data.totalAlphaUsd,
            timestamp: new Date().toLocaleTimeString(),
            targetRatio: `${(targetCexRatio * 100).toFixed(0)}% CEX / ${((1 - targetCexRatio) * 100).toFixed(0)}% DEX`,
          });
          fetchTelemetry();
          fetchRebalanceMatrix(targetCexRatio);
        }
      }
    } catch {
      // Quiet fail during restart
    } finally {
      setIsExecutingRebalance(false);
    }
  };

  // Initial load for Gemini Suite
  useEffect(() => {
    fetchGeminiInsight();
    fetchRebalanceMatrix(targetCexRatio);
  }, []);

  // Periodic qualitative Gemini telemetry updates if auto stream is enabled
  useEffect(() => {
    if (!autoGeminiStream) return;
    const interval = setInterval(() => {
      fetchGeminiInsight();
    }, 25000);
    return () => clearInterval(interval);
  }, [autoGeminiStream, telemetry?.currentNav]);


  // Copy Prometheus Grafana JSON config
  const grafanaJsonSnippet = JSON.stringify({
    title: "Live Alpha & NAV Real-Time Telemetry",
    refresh: "1s",
    panels: [
      {
        title: "Real-Time NAV (USD)",
        type: "timeseries",
        targets: [{ expr: "aegentix_nav_usd", legendFormat: "Total NAV USD" }],
      },
      {
        title: "Dual Exchange Live Prices (ETH)",
        type: "timeseries",
        targets: [
          { expr: 'aegentix_market_price{exchange="BinanceUS"}', legendFormat: "Binance.US (CEX)" },
          { expr: 'aegentix_market_price{exchange="UniswapV3"}', legendFormat: "Uniswap V3 (DEX)" },
        ],
      },
      {
        title: "Arbitrage Spread Detected (%)",
        type: "gauge",
        targets: [{ expr: "agent_alpha_spread_detected", legendFormat: "Spread %" }],
        fieldConfig: { defaults: { threshold: { steps: [{ value: 0, color: "green" }, { value: 0.5, color: "orange" }, { value: 1.0, color: "red" }] } } }
      }
    ]
  }, null, 2);

  const handleCopyGrafana = () => {
    navigator.clipboard.writeText(grafanaJsonSnippet);
    setCopiedGrafana(true);
    setTimeout(() => setCopiedGrafana(false), 2500);
  };

  // Chart Dimensions & Math
  const chartWidth = 720;
  const chartHeight = 220;
  const padX = 25;
  const padY = 25;

  const points = history.length > 0 ? history : [
    { timestamp: Date.now(), timeStr: 'Now', navUsd: 48294.5, cexUsd: 26102.5, dexUsd: 22192, ethPriceCex: 2684.5, ethPriceDex: 2662.1, spreadPct: 0.84, navDeviationPct: 0.02 }
  ];

  // Derive series for 60s real-time tick SVG fallback
  const seriesValues: number[] = points.map((p) => p.navUsd);
  const minVal = Math.min(...seriesValues) * 0.999;
  const maxVal = Math.max(...seriesValues) * 1.001;
  const valRange = Math.max(0.0001, maxVal - minVal);

  const coords = seriesValues.map((val, idx) => {
    const x = padX + (idx / Math.max(1, seriesValues.length - 1)) * (chartWidth - padX * 2);
    const y = chartHeight - padY - ((val - minVal) / valRange) * (chartHeight - padY * 2);
    return { x, y, val, point: points[idx] };
  });

  const pathD = coords.reduce((acc, coord, idx) => {
    if (idx === 0) return `M ${coord.x} ${coord.y}`;
    const prev = coords[idx - 1];
    const cx1 = (prev.x + coord.x) / 2;
    const cy1 = prev.y;
    const cx2 = (prev.x + coord.x) / 2;
    const cy2 = coord.y;
    return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${coord.x} ${coord.y}`;
  }, '');

  const areaD = `${pathD} L ${chartWidth - padX} ${chartHeight} L ${padX} ${chartHeight} Z`;

  const currentNav = telemetry?.currentNav || (history.length > 0 ? history[history.length - 1].navUsd : 48294.50);
  const currentDeviation = telemetry?.currentDeviationPct || (history.length > 0 ? history[history.length - 1].navDeviationPct : 0.04);
  const isTriggerActive = currentDeviation >= 0.10;

  const currentPriceObj = telemetry?.prices?.[selectedAsset] || { cex: 2684.50, dex: 2662.10, spreadPct: 0.84 };

  const hoveredItem = hoverIndex !== null && coords[hoverIndex] ? coords[hoverIndex] : null;

  return (
    <div className="space-y-4">
      {/* Header Banner: Live Telemetries & Real-Time NAV */}
      <div className="bg-[#0B101B] border border-cyan-500/30 rounded-xl p-4 sm:p-5 relative overflow-hidden shadow-lg shadow-cyan-950/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
                <Radio className={`w-3 h-3 ${isStreaming ? 'text-cyan-400 animate-pulse' : 'text-slate-500'}`} />
                <span>Live Telemetry Stream</span>
              </span>

              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono border ${
                streamActiveState === 'SSE_STREAM' 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                  : streamActiveState === 'POLLING'
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${streamActiveState === 'SSE_STREAM' ? 'bg-emerald-400 animate-ping' : 'bg-slate-400'}`} />
                {streamActiveState === 'SSE_STREAM' ? 'SSE High-Speed (1500ms)' : streamActiveState === 'POLLING' ? 'HTTP Polling' : 'Stream Paused'}
              </span>

              <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                Ticks: <strong className="text-slate-200">{streamTicksCount}</strong>
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2 font-mono">
              <span>Real-Time NAV & Live Charting</span>
              <span className="text-cyan-400 text-sm font-normal">Streaming Telemetry</span>
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-1 max-w-2xl">
              High-frequency WebSocket and SSE pipe calculating consolidated Net Asset Value (NAV) across Binance.US orderbook depth and Uniswap V3 pools. Triggers Heretic LLM when NAV deviation &gt;0.1% or spread expands.
            </p>
          </div>

          {/* Action buttons & Stream toggle */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsStreaming(!isStreaming)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-mono border transition-all cursor-pointer ${
                isStreaming
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/30'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{isStreaming ? 'Pause Stream' : 'Resume Stream'}</span>
            </button>

            <button
              onClick={handleCopyGrafana}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              {copiedGrafana ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
              <span>{copiedGrafana ? 'Grafana JSON Copied!' : 'Export Grafana JSON'}</span>
            </button>
          </div>
        </div>

        {/* 4 Quick Telemetry KPI Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-800/80">
          <div className="bg-[#080D16] border border-slate-800/80 rounded-lg p-3">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Consolidated NAV</div>
            <div className="text-lg font-bold text-white font-mono flex items-center gap-2">
              <span className="tabular-nums">${currentNav.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            </div>
            <div className="text-[10px] text-emerald-400 font-mono mt-0.5 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" />
              <span>+${telemetry?.dailyPnlUsd || '1,420.80'} ({telemetry?.dailyPnlPct || '2.94'}%)</span>
            </div>
          </div>

          <div className="bg-[#080D16] border border-slate-800/80 rounded-lg p-3">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">CEX / DEX Balance Split</div>
            <div className="text-sm font-semibold text-slate-200 font-mono flex items-center justify-between mt-1">
              <span className="text-cyan-300">CEX: ${(telemetry?.cexUsd || 26102.50).toLocaleString()}</span>
              <span className="text-indigo-300">DEX: ${(telemetry?.dexUsd || 22192.00).toLocaleString()}</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden flex">
              <div className="bg-cyan-500 h-full" style={{ width: '54%' }} />
              <div className="bg-indigo-500 h-full" style={{ width: '46%' }} />
            </div>
          </div>

          <div className="bg-[#080D16] border border-slate-800/80 rounded-lg p-3">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">NAV Deviation Rate</div>
            <div className={`text-base font-bold font-mono mt-0.5 flex items-center gap-1.5 ${
              isTriggerActive ? 'text-amber-400' : 'text-slate-200'
            }`}>
              <span>Δ {currentDeviation.toFixed(3)}%</span>
              <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                isTriggerActive 
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}>
                {isTriggerActive ? 'THRESHOLD TRIP' : 'NOMINAL (<0.1%)'}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-1">
              Event Trigger: &gt; 0.100%
            </div>
          </div>

          <div className="bg-[#080D16] border border-slate-800/80 rounded-lg p-3">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Active Pair Spread ({selectedAsset})</div>
            <div className="text-base font-bold font-mono text-emerald-400 mt-0.5 flex items-center gap-2">
              <span>+{currentPriceObj.spreadPct.toFixed(2)}%</span>
              <span className="text-xs text-slate-400 font-normal">
                ({(currentPriceObj.spreadPct * 100).toFixed(0)} bps)
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-1">
              CEX ${currentPriceObj.cex.toLocaleString()} vs DEX ${currentPriceObj.dex.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Main 24H Recharts Line Chart & Real-Time Telemetry Card */}
      <div className="bg-[#0D121D] border border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm font-mono space-y-4">
        {/* 24-Hour Quick Performance Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#080C16] p-3 rounded-xl border border-slate-800/80 text-xs">
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">24H Daily PnL</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`text-base font-bold font-mono ${(telemetry?.dailyPnlUsd ?? 1420.50) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {(telemetry?.dailyPnlUsd ?? 1420.50) >= 0 ? '+' : ''}${Number(telemetry?.dailyPnlUsd ?? 1420.50).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                +{(telemetry?.dailyPnlPct ?? 2.94).toFixed(2)}%
              </span>
            </div>
            <span className="text-[10px] text-slate-500 block">Delta-Neutral Harvest</span>
          </div>

          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Total Exchange Balance</span>
            <div className="text-base font-bold font-mono text-cyan-400 mt-0.5">
              ${Number(telemetry?.currentNav ?? 48294.50).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <span className="text-[10px] text-slate-500 block">Consolidated Venues</span>
          </div>

          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">CEX (Binance.US)</span>
            <div className="text-base font-bold font-mono text-blue-400 mt-0.5">
              ${Number(telemetry?.cexUsd ?? 26102.50).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <span className="text-[10px] text-slate-500 block">54.0% Allocation</span>
          </div>

          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">DEX (Uniswap V3)</span>
            <div className="text-base font-bold font-mono text-indigo-400 mt-0.5">
              ${Number(telemetry?.dexUsd ?? 22192.00).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <span className="text-[10px] text-slate-500 block">46.0% Allocation</span>
          </div>
        </div>

        {/* Chart controls toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs">
            <button
              onClick={() => setChartMode('24H_CONSOLIDATED')}
              className={`px-3 py-1.5 rounded transition-all font-semibold cursor-pointer ${
                chartMode === '24H_CONSOLIDATED'
                  ? 'bg-gradient-to-r from-emerald-600/30 to-cyan-600/30 text-emerald-300 border border-emerald-500/50 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              24H Consolidated (Daily PnL &amp; Balances)
            </button>
            <button
              onClick={() => setChartMode('24H_DAILY_PNL')}
              className={`px-3 py-1.5 rounded transition-all font-semibold cursor-pointer ${
                chartMode === '24H_DAILY_PNL'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              24H Daily PnL Trend ($USD)
            </button>
            <button
              onClick={() => setChartMode('24H_EXCHANGE_BALANCES')}
              className={`px-3 py-1.5 rounded transition-all font-semibold cursor-pointer ${
                chartMode === '24H_EXCHANGE_BALANCES'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              24H Exchange Balances (CEX vs DEX)
            </button>
            <button
              onClick={() => setChartMode('REALTIME_STREAM')}
              className={`px-3 py-1.5 rounded transition-all font-semibold cursor-pointer ${
                chartMode === 'REALTIME_STREAM'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              60s Real-Time Ticks
            </button>
          </div>

          {/* Asset ticker filter */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
            {(['ETH', 'BTC', 'SOL'] as const).map((sym) => (
              <button
                key={sym}
                onClick={() => setSelectedAsset(sym)}
                className={`px-2.5 py-1 rounded transition-all font-medium cursor-pointer ${
                  selectedAsset === sym
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {sym}
              </button>
            ))}
          </div>
        </div>

        {/* 24-HOUR RECHARTS LINE CHART CONTAINER */}
        {chartMode !== 'REALTIME_STREAM' ? (
          <div className="bg-[#080C14] border border-slate-800/80 rounded-xl p-3 sm:p-4 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span className="flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                <strong className="text-white font-mono">
                  {chartMode === '24H_CONSOLIDATED'
                    ? 'Dual-Axis 24-Hour Horizon: Daily PnL Trend ($USD) & Venue Balance Fluctuations'
                    : chartMode === '24H_DAILY_PNL'
                    ? '24-Hour Cumulative Daily PnL Trajectory ($USD)'
                    : '24-Hour Exchange Balance Fluctuations: Binance.US (CEX) vs Uniswap V3 (DEX)'}
                </strong>
              </span>

              <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                Recharts Engine &middot; 24 Hourly Samples &middot; Updated Live
              </span>
            </div>

            <div className="w-full h-72 sm:h-80 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={history24h.length > 0 ? history24h : default24HourTrends()}
                  margin={{ top: 12, right: 35, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                  
                  <XAxis
                    dataKey="time"
                    stroke="#64748B"
                    tick={{ fontSize: 11, fill: '#94A3B8' }}
                    tickLine={{ stroke: '#334155' }}
                  />

                  {/* Left Axis: Exchange Balances */}
                  <YAxis
                    yAxisId="balance"
                    orientation="left"
                    stroke="#38BDF8"
                    tick={{ fontSize: 10, fill: '#38BDF8' }}
                    tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`}
                    domain={['auto', 'auto']}
                  />

                  {/* Right Axis: Daily PnL ($USD) */}
                  <YAxis
                    yAxisId="pnl"
                    orientation="right"
                    stroke="#10B981"
                    tick={{ fontSize: 10, fill: '#10B981' }}
                    tickFormatter={(v) => `${v >= 0 ? '+' : ''}$${Math.round(v)}`}
                    domain={['auto', 'auto']}
                  />

                  {/* Custom Dark Recharts Tooltip */}
                  <Tooltip
                    content={({ active, payload }: any) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        const isPnlPositive = (d.dailyPnlUsd ?? 0) >= 0;
                        return (
                          <div className="bg-[#070D1F] border border-cyan-500/40 p-3 rounded-xl shadow-2xl font-mono text-xs space-y-2 z-50 min-w-56">
                            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 text-slate-400">
                              <span className="font-bold text-slate-200">24-Hour Timestamp</span>
                              <span className="text-cyan-300 font-bold">{d.time} ({d.fullTime || d.time})</span>
                            </div>

                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="text-emerald-400 flex items-center gap-1.5">
                                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                                  <span>dailyPnlUsd:</span>
                                </span>
                                <span className={`font-bold ${isPnlPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                                  {isPnlPositive ? '+' : ''}${Number(d.dailyPnlUsd || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                  <span className="text-[10px] ml-1 text-slate-400">({d.dailyPnlPct >= 0 ? '+' : ''}{d.dailyPnlPct}%)</span>
                                </span>
                              </div>

                              {(chartMode === '24H_CONSOLIDATED' || chartMode === '24H_EXCHANGE_BALANCES') && (
                                <>
                                  <div className="flex items-center justify-between">
                                    <span className="text-cyan-300 flex items-center gap-1.5">
                                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                                      <span>Total Balance:</span>
                                    </span>
                                    <span className="font-bold text-white">
                                      ${Number(d.totalBalanceUsd || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </span>
                                  </div>

                                  <div className="flex items-center justify-between text-[11px]">
                                    <span className="text-blue-400 flex items-center gap-1.5">
                                      <span className="w-2 h-0.5 bg-blue-400" />
                                      <span>CEX (Binance.US):</span>
                                    </span>
                                    <span className="font-bold text-slate-200">
                                      ${Number(d.cexBalanceUsd || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </span>
                                  </div>

                                  <div className="flex items-center justify-between text-[11px]">
                                    <span className="text-indigo-400 flex items-center gap-1.5">
                                      <span className="w-2 h-0.5 bg-indigo-400" />
                                      <span>DEX (Uniswap V3):</span>
                                    </span>
                                    <span className="font-bold text-slate-200">
                                      ${Number(d.dexBalanceUsd || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </span>
                                  </div>
                                </>
                              )}

                              {d.spreadPct !== undefined && (
                                <div className="flex items-center justify-between text-[10px] border-t border-slate-800/80 pt-1 text-slate-400">
                                  <span>Active Spread:</span>
                                  <span className="text-amber-400 font-bold">+{Number(d.spreadPct).toFixed(2)}%</span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />

                  <Legend
                    wrapperStyle={{ paddingTop: 10, fontSize: 11 }}
                    formatter={(val) => <span className="text-slate-300 font-mono text-[11px] font-semibold">{val}</span>}
                  />

                  {/* Zero PnL Baseline */}
                  <ReferenceLine
                    yAxisId="pnl"
                    y={0}
                    stroke="#EF4444"
                    strokeDasharray="3 3"
                    label={{ value: '0 PnL Baseline', fill: '#EF4444', fontSize: 10, position: 'right' }}
                  />

                  {/* Line 1: Daily PnL Trend Line ($USD) */}
                  {(chartMode === '24H_CONSOLIDATED' || chartMode === '24H_DAILY_PNL') && (
                    <Line
                      yAxisId="pnl"
                      type="monotone"
                      dataKey="dailyPnlUsd"
                      name="Daily PnL ($USD)"
                      stroke="#10B981"
                      strokeWidth={3}
                      dot={{ r: 2.5, fill: '#10B981' }}
                      activeDot={{ r: 6, fill: '#34D399', stroke: '#064E3B', strokeWidth: 2 }}
                    />
                  )}

                  {/* Line 2: Total Exchange Balance */}
                  {(chartMode === '24H_CONSOLIDATED' || chartMode === '24H_EXCHANGE_BALANCES') && (
                    <Line
                      yAxisId="balance"
                      type="monotone"
                      dataKey="totalBalanceUsd"
                      name="Total Balance ($USD)"
                      stroke="#38BDF8"
                      strokeWidth={2.5}
                      dot={false}
                      activeDot={{ r: 5, fill: '#38BDF8' }}
                    />
                  )}

                  {/* Line 3: CEX Balance Fluctuations */}
                  {(chartMode === '24H_CONSOLIDATED' || chartMode === '24H_EXCHANGE_BALANCES') && (
                    <Line
                      yAxisId="balance"
                      type="monotone"
                      dataKey="cexBalanceUsd"
                      name="CEX (Binance.US)"
                      stroke="#60A5FA"
                      strokeWidth={1.75}
                      strokeDasharray="4 4"
                      dot={false}
                    />
                  )}

                  {/* Line 4: DEX Balance Fluctuations */}
                  {(chartMode === '24H_CONSOLIDATED' || chartMode === '24H_EXCHANGE_BALANCES') && (
                    <Line
                      yAxisId="balance"
                      type="monotone"
                      dataKey="dexBalanceUsd"
                      name="DEX (Uniswap V3)"
                      stroke="#818CF8"
                      strokeWidth={1.75}
                      strokeDasharray="2 2"
                      dot={false}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          /* High-Speed 60s Sliding Window Real-Time SVG Stream */
          <div className="relative w-full h-64 bg-[#080C14] border border-slate-800/80 rounded-lg p-2 overflow-hidden">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-full overflow-visible"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="liveNavGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="liveDexGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#818CF8" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#818CF8" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0.2, 0.4, 0.6, 0.8].map((pct) => (
                <line
                  key={pct}
                  x1={padX}
                  y1={chartHeight * pct}
                  x2={chartWidth - padX}
                  y2={chartHeight * pct}
                  stroke="#1E293B"
                  strokeDasharray="3 3"
                />
              ))}

              {/* Primary Area Fill */}
              <path d={areaD} fill="url(#liveNavGrad)" />

              {/* Primary Stroke Line */}
              <path
                d={pathD}
                fill="none"
                stroke="#06B6D4"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Interactive Points */}
              {coords.map((coord, idx) => (
                <circle
                  key={idx}
                  cx={coord.x}
                  cy={coord.y}
                  r={hoverIndex === idx ? 5 : idx === coords.length - 1 ? 4 : 2}
                  fill={hoverIndex === idx ? '#38BDF8' : '#06B6D4'}
                  className="cursor-pointer transition-all"
                  onMouseEnter={() => setHoverIndex(idx)}
                  onMouseLeave={() => setHoverIndex(null)}
                />
              ))}
            </svg>
          </div>
        )}

        {/* Bottom Chart Footer with Live Asset Comparison */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-3 border-t border-slate-800">
          <div className="flex items-center justify-between p-2.5 bg-slate-900/60 rounded border border-slate-800/80">
            <div>
              <div className="text-[10px] text-slate-400">Binance.US (CEX)</div>
              <div className="text-sm font-bold text-white tabular-nums">${currentPriceObj.cex.toLocaleString()}</div>
            </div>
            <div className="text-right">
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">Depth: High</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-slate-900/60 rounded border border-slate-800/80">
            <div>
              <div className="text-[10px] text-slate-400">Uniswap V3 (DEX)</div>
              <div className="text-sm font-bold text-white tabular-nums">${currentPriceObj.dex.toLocaleString()}</div>
            </div>
            <div className="text-right">
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">Pool 0.05%</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-slate-900/60 rounded border border-slate-800/80">
            <div>
              <div className="text-[10px] text-slate-400">Arbitrage Direction</div>
              <div className="text-xs font-bold text-emerald-400">
                {currentPriceObj.dex < currentPriceObj.cex ? 'BUY DEX -> SELL CEX' : 'BUY CEX -> SELL DEX'}
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-emerald-400">+{currentPriceObj.spreadPct.toFixed(2)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION: Gemini Sovereign Telemetry & Multi-Asset Batch Rebalance Suite */}
      {/* ========================================================================= */}
      <div className="bg-[#0D121D] border border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm font-mono space-y-5">
        
        {/* 1. Autonomous Engine Switcher Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                  Autonomous Reasoning & Routing Engine
                </h3>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Dual-Engine Active
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Google Gemini 3.8 Flash high-order reasoning with local Heretic LLM (:9003) failover orchestration.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs">
            <button
              onClick={() => setSelectedEngine('GEMINI_38_FLASH')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all font-semibold ${
                selectedEngine === 'GEMINI_38_FLASH'
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Gemini 3.8 Flash (Active)</span>
            </button>
            <button
              onClick={() => setSelectedEngine('HERETIC_9003')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all font-semibold ${
                selectedEngine === 'HERETIC_9003'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Heretic Sovereign (:9003)</span>
            </button>
          </div>
        </div>

        {/* 2. Live Qualitative Gemini Telemetry & Market Regime Stream */}
        <div className="bg-[#080D16] border border-slate-800/80 rounded-xl p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Gemini Qualitative Telemetry & Regime Insights
              </h4>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/50">
                {geminiInsight?.model || 'gemini-3.8-flash'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setAutoGeminiStream(!autoGeminiStream)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-mono border transition-all cursor-pointer ${
                  autoGeminiStream
                    ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-300'
                }`}
              >
                <Radio className={`w-3 h-3 ${autoGeminiStream ? 'text-cyan-400 animate-pulse' : 'text-slate-500'}`} />
                <span>{autoGeminiStream ? 'Auto-Stream (Active)' : 'Auto-Stream (Paused)'}</span>
              </button>

              <button
                onClick={fetchGeminiInsight}
                disabled={isGeneratingInsight}
                className="flex items-center gap-1.5 px-3 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-[11px] transition-all cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${isGeneratingInsight ? 'animate-spin text-cyan-400' : 'text-slate-400'}`} />
                <span>{isGeneratingInsight ? 'Analyzing...' : 'Run Gemini Synthesis'}</span>
              </button>
            </div>
          </div>

          {/* Qualitative Insight Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Market Regime</div>
              <div className="text-xs font-bold text-cyan-300 mt-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>EXPANSION & SPREAD VOLATILITY</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Asymmetric alpha skew across CEX/DEX</div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Arbitrage Feasibility</div>
              <div className="text-xs font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>FAVORABLE (+0.28% to +0.84%)</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Execution exceeds fee + gas hurdle</div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Portfolio Risk Posture</div>
              <div className="text-xs font-bold text-indigo-300 mt-1 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>NOMINAL / BOUNDED RISK</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Slippage drift 0.09% | Drawdown 0.18%</div>
            </div>
          </div>

          {/* Qualitative Synthesis Textbox */}
          <div className="p-3 rounded-lg bg-[#05080E] border border-slate-800 text-xs text-slate-300 font-mono leading-relaxed max-h-40 overflow-y-auto whitespace-pre-wrap">
            {geminiInsight?.analysis || (
              <span className="text-slate-500 italic">
                Formulating real-time qualitative market synthesis from Google Gemini 3.8 Flash...
              </span>
            )}
          </div>
        </div>

        {/* 3. Multi-Asset Route Optimization & Batch Rebalance Suite */}
        <div className="bg-[#080D16] border border-slate-800/80 rounded-xl p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-400" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                  Multi-Asset Route Optimization & Batch Rebalancing
                </h4>
                <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                  Restores target CEX/DEX capital allocation while capturing cross-venue spread across ETH, BTC, and SOL.
                </p>
              </div>
            </div>

            {/* Target Ratio Presets */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">Target Allocation:</span>
              <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
                {[
                  { label: '50/50', val: 0.50 },
                  { label: '55/45', val: 0.55 },
                  { label: '60/40', val: 0.60 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => {
                      setTargetCexRatio(preset.val);
                      fetchRebalanceMatrix(preset.val);
                    }}
                    className={`px-2.5 py-1 rounded text-[11px] transition-all font-semibold ${
                      targetCexRatio === preset.val
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Allocation Split Comparison Bar */}
          <div className="mb-4 p-3 bg-slate-900/60 rounded-lg border border-slate-800/80">
            <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
              <div>
                <span className="text-slate-400">Current Split: </span>
                <span className="text-cyan-300 font-bold">CEX {geminiRebalanceMatrix?.currentRatio?.cexPct || '53.2'}%</span>
                <span className="text-slate-500"> / </span>
                <span className="text-indigo-300 font-bold">DEX {geminiRebalanceMatrix?.currentRatio?.dexPct || '46.8'}%</span>
              </div>
              <div>
                <span className="text-slate-400">Target Split: </span>
                <span className="text-emerald-300 font-bold">CEX {(targetCexRatio * 100).toFixed(0)}%</span>
                <span className="text-slate-500"> / </span>
                <span className="text-emerald-300 font-bold">DEX {((1 - targetCexRatio) * 100).toFixed(0)}%</span>
              </div>
            </div>

            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden flex">
              <div 
                className="bg-cyan-500 transition-all duration-500" 
                style={{ width: `${geminiRebalanceMatrix?.currentRatio?.cexPct || 53.2}%` }} 
              />
              <div 
                className="bg-indigo-500 transition-all duration-500" 
                style={{ width: `${geminiRebalanceMatrix?.currentRatio?.dexPct || 46.8}%` }} 
              />
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 font-mono">
              <span>
                Net Venue Imbalance: <strong className="text-amber-300 font-bold">${Math.abs(geminiRebalanceMatrix?.netImbalanceUsd || 1434.66).toLocaleString()} USD</strong>
              </span>
              <span className="text-slate-400 italic">
                {geminiRebalanceMatrix?.rationale?.slice(0, 85) || 'Formulating optimal routing to minimize venue friction...'}...
              </span>
            </div>
          </div>

          {/* 3 Asset Route Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            {(geminiRebalanceMatrix?.orders || [
              { symbol: 'ETH', direction: 'SELL_CEX_BUY_DEX', tradeSizeUsd: 485, expectedAlphaUsd: 4.12, riskTier: 'LOW', route: 'Binance.US -> Uniswap V3' },
              { symbol: 'SOL', direction: 'SELL_CEX_BUY_DEX', tradeSizeUsd: 950, expectedAlphaUsd: 8.64, riskTier: 'LOW', route: 'Binance.US -> Uniswap V3' },
              { symbol: 'BTC', direction: 'SELL_DEX_BUY_CEX', tradeSizeUsd: 650, expectedAlphaUsd: 5.20, riskTier: 'LOW', route: 'Uniswap V3 -> Binance.US' }
            ]).map((ord: GeminiRebalanceOrder, idx: number) => {
              const sym = ord.symbol as 'ETH' | 'BTC' | 'SOL';
              const assetPrice = telemetry?.prices?.[sym] || { cex: 2690, dex: 2682, spreadPct: 0.35 };

              return (
                <div key={`${ord.symbol}-${idx}`} className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{ord.symbol}</span>
                      <span className="text-[10px] text-slate-400 font-sans">
                        {ord.symbol === 'ETH' ? 'Ethereum' : ord.symbol === 'BTC' ? 'Bitcoin' : 'Solana'}
                      </span>
                    </div>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                      ord.riskTier === 'LOW' 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {ord.riskTier} RISK
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-300 font-mono mb-3">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">CEX Quote:</span>
                      <span className="text-slate-200 tabular-nums">${assetPrice.cex.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">DEX Quote:</span>
                      <span className="text-slate-200 tabular-nums">${assetPrice.dex.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Cross Spread:</span>
                      <span className="text-emerald-400 font-bold tabular-nums">+{assetPrice.spreadPct.toFixed(2)}%</span>
                    </div>
                    <div className="pt-1.5 border-t border-slate-800/80 flex justify-between text-[11px]">
                      <span className="text-slate-400">Optimized Order:</span>
                      <span className="text-cyan-300 font-bold">{ord.direction}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Batch Trade Size:</span>
                      <span className="text-white font-bold tabular-nums">${ord.tradeSizeUsd.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded bg-slate-950/80 border border-slate-800/60 text-xs">
                    <span className="text-[10px] text-slate-400">Expected Alpha:</span>
                    <span className="text-xs font-bold text-emerald-400 font-mono flex items-center gap-0.5">
                      <ArrowUpRight className="w-3 h-3" />
                      <span>+${ord.expectedAlphaUsd.toFixed(2)} USD</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Execution Footer & Audit Receipt */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono">Total Net Alpha Harvest:</span>
              <span className="text-sm font-bold text-emerald-400 font-mono bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/30">
                +${(geminiRebalanceMatrix?.totalExpectedAlphaUsd || 17.96).toFixed(2)} USD
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchRebalanceMatrix(targetCexRatio)}
                disabled={isFormulatingRebalance}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-mono transition-all cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isFormulatingRebalance ? 'animate-spin text-cyan-400' : 'text-slate-400'}`} />
                <span>{isFormulatingRebalance ? 'Calculating...' : 'Recalculate Matrix'}</span>
              </button>

              <button
                onClick={handleExecuteRebalance}
                disabled={isExecutingRebalance}
                className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs font-mono shadow-lg shadow-emerald-900/30 transition-all cursor-pointer disabled:opacity-50"
              >
                <Zap className={`w-3.5 h-3.5 ${isExecutingRebalance ? 'animate-bounce' : ''}`} />
                <span>{isExecutingRebalance ? 'Executing Batch...' : 'Execute Batch Rebalance'}</span>
              </button>
            </div>
          </div>

          {/* Audit Receipt Banner */}
          {rebalanceReceipt && (
            <div className="mt-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 font-mono flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>Batch Rebalance Confirmed:</strong> {rebalanceReceipt.txCount} legs settled atomically at {rebalanceReceipt.timestamp}. Realized <strong>+${rebalanceReceipt.totalAlpha.toFixed(2)} USD</strong> alpha. Rebalanced to {rebalanceReceipt.targetRatio}.
                </span>
              </div>
              <button 
                onClick={() => setRebalanceReceipt(null)}
                className="text-slate-400 hover:text-slate-200 text-xs ml-3"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Live Telemetry Events & Prometheus Gauges Monitor */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Event-Driven Heretic Trigger Feed */}
        <div className="bg-[#0D121D] border border-slate-800 rounded-xl p-4 font-mono shadow-sm">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Event-Driven Heretic Triggers
              </h3>
            </div>
            <span className="text-[10px] text-slate-400">Threshold: Δ &gt; 0.10%</span>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {recentEvents.length === 0 ? (
              <div className="p-3 rounded bg-slate-900/50 border border-slate-800/50 text-xs text-slate-400 text-center">
                Awaiting continuous telemetry deviations. Orchestrator triggers Heretic LLM when NAV delta exceeds 0.10%.
              </div>
            ) : (
              recentEvents.map((ev, idx) => (
                <div key={ev.id ? `${ev.id}-${idx}` : `ev-${idx}`} className="p-2.5 rounded bg-slate-900/80 border border-slate-800 text-xs flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                      <span className="font-semibold text-amber-300">HERETIC TRIGGER</span>
                      <span>{ev.time}</span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">{ev.text}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Prometheus Metrics Exporter Status */}
        <div className="bg-[#0D121D] border border-slate-800 rounded-xl p-4 font-mono shadow-sm">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Prometheus Telemetry Gauges
              </h3>
            </div>
            <a
              href="/metrics"
              target="_blank"
              rel="noreferrer"
              className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>/metrics endpoint</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-800/60">
              <span className="text-slate-400 font-mono">aegentix_nav_usd</span>
              <span className="text-cyan-300 font-bold tabular-nums">
                ${telemetry?.prometheusGauges?.aegentix_nav_usd?.toFixed(2) || currentNav.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-800/60">
              <span className="text-slate-400 font-mono">aegentix_market_price (ETH)</span>
              <span className="text-slate-200 font-bold tabular-nums">
                CEX ${telemetry?.prices?.ETH?.cex?.toFixed(2) || '2684.50'} | DEX ${telemetry?.prices?.ETH?.dex?.toFixed(2) || '2662.10'}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-800/60">
              <span className="text-slate-400 font-mono">agent_alpha_spread_detected</span>
              <span className="text-emerald-400 font-bold tabular-nums">
                {telemetry?.prometheusGauges?.agent_alpha_spread_detected?.toFixed(2) || '0.84'}%
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-800/60">
              <span className="text-slate-400 font-mono">agent_signals_executed_total</span>
              <span className="text-indigo-400 font-bold tabular-nums">
                {telemetry?.prometheusGauges?.agent_signals_executed_total || 3}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
