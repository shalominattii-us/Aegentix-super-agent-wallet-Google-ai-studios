import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { 
  ShieldAlert, 
  TrendingDown, 
  Sliders, 
  CheckCircle2, 
  RefreshCw, 
  Lock, 
  Unlock, 
  Activity, 
  Flame, 
  ArrowDownRight,
  LineChart as LineChartIcon,
  Zap,
  AlertTriangle,
  PlayCircle,
  X,
  Grid
} from 'lucide-react';

interface StopLossRule {
  id: string;
  asset: string;
  triggerPriceUsd: number;
  currentPriceUsd: number;
  distancePct: number;
  action: string;
  venue: string;
  status: 'ARMED' | 'TRIGGERED' | 'DISARMED';
}

interface AssetRiskAllocation {
  symbol: string;
  name: string;
  valueUsd: number;
  sharePct: number;
  annualizedVolatilityPct: number;
  standaloneVaRUsd: number;
  marginalRiskContributionPct: number;
}

interface StressScenario {
  name: string;
  estimatedLossUsd: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

interface VaRDataPoint {
  timestamp: number;
  timeStr: string;
  var95Pct: number;
  var95Usd: number;
  var99Pct: number;
  var99Usd: number;
  thresholdLimitPct: number;
  thresholdLimitUsd: number;
}

export interface BreachAlert {
  id: string;
  asset: string;
  severity: 'CRITICAL' | 'ELEVATED' | 'MODERATE';
  triggeredAt: string;
  currentVaRPct: number;
  thresholdVaRPct: number;
  breachMarginPct: number;
  estimatedExcessRiskUsd: number;
  hedgingStrategy: string;
  recommendedVenue: string;
  recommendedHedgeSize: string;
  status: 'ACTIVE' | 'HEDGED' | 'DISMISSED';
  reason: string;
}

interface SimulationResult {
  marketDropPct: number;
  numTrials: number;
  baselinePortfolioUsd: number;
  simulatedVaR: {
    baselineVaR95Pct: number;
    simulatedVaR95Pct: number;
    deltaVaRPct: number;
    baselineVaR95Usd: number;
    simulatedVaR95Usd: number;
    deltaVaRUsd: number;
    simulatedVaR99Pct: number;
    simulatedVaR99Usd: number;
    simulatedCVaRUsd: number;
    wouldTripCircuitBreaker: boolean;
    circuitLimitPct: number;
  };
  assetImpacts: Array<{
    symbol: string;
    initialValueUsd: number;
    expectedDropPct: number;
    lossUsd: number;
    postDropValUsd: number;
    breachVaRTrigger: boolean;
  }>;
  timestamp: string;
}

export interface CorrelationMatrixData {
  assets: string[];
  matrix: number[][];
  description: string;
}

interface RiskDashboardData {
  success: boolean;
  totalPortfolioUsd: number;
  varTrajectory: VaRDataPoint[];
  correlationMatrix?: CorrelationMatrixData;
  varMetrics: {
    var95Pct: number;
    var95Usd: number;
    var99Pct: number;
    var99Usd: number;
    expectedShortfallUsd: number;
    betaToMarket: number;
    sharpeRatio: number;
    sortinoRatio: number;
    historicalMaxDrawdownPct: number;
    currentDrawdownPct: number;
    maxDrawdownLimitPct: number;
  };
  riskConfig: {
    confidenceLevel: number;
    timeHorizonDays: number;
    circuitBreakerTripped: boolean;
    autoStopLossEngaged: boolean;
    volatilityRegime: string;
    stressScenarios: StressScenario[];
    stopLossRules: StopLossRule[];
    breachAlerts: BreachAlert[];
  };
  assetRiskAllocations: AssetRiskAllocation[];
  timestamp: string;
}

interface RiskManagementDashboardProps {
  onNotify?: (message: string, type: 'ALERT' | 'SUCCESS' | 'INFO') => void;
}

export const RiskManagementDashboard: React.FC<RiskManagementDashboardProps> = ({ onNotify }) => {
  const [data, setData] = useState<RiskDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  const [newPrice, setNewPrice] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isTogglingBreaker, setIsTogglingBreaker] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState<VaRDataPoint | null>(null);
  const [displayMode, setDisplayMode] = useState<'PCT' | 'USD'>('PCT');
  const [hedgingAlertId, setHedgingAlertId] = useState<string | null>(null);

  // Monte Carlo Simulation States
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);

  // Correlation Matrix Hover state
  const [hoveredCorrelation, setHoveredCorrelation] = useState<{
    asset1: string;
    asset2: string;
    val: number;
  } | null>(null);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const matrixSvgRef = useRef<SVGSVGElement | null>(null);
  const matrixContainerRef = useRef<HTMLDivElement | null>(null);

  const fetchRiskData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/risk/dashboard');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err: any) {
      if (onNotify) onNotify(`Failed to fetch risk metrics: ${err.message}`, 'ALERT');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRiskData();
    const interval = setInterval(fetchRiskData, 4000);
    return () => clearInterval(interval);
  }, []);

  // Run Monte Carlo Simulation of 10% Drop
  const handleSimulateMarketEvent = async (dropPct = 10) => {
    setIsSimulating(true);
    try {
      const res = await fetch('/api/risk/simulate-market-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dropPct, numTrials: 1000 }),
      });
      const json = await res.json();
      if (json.success) {
        setSimulationResult(json);
        const tripMsg = json.simulatedVaR.wouldTripCircuitBreaker ? '⚠️ CIRCUIT BREAKER THRESHOLD BREACHED!' : 'Nominal headroom maintained.';
        if (onNotify) {
          onNotify(
            `Monte Carlo 1,000-Trial Simulation (-${dropPct}% drop complete): 95% VaR surged to ${json.simulatedVaR.simulatedVaR95Pct}% ($${json.simulatedVaR.simulatedVaR95Usd}). ${tripMsg}`,
            json.simulatedVaR.wouldTripCircuitBreaker ? 'ALERT' : 'INFO'
          );
        }
      } else {
        if (onNotify) onNotify(`Simulation failed: ${json.error}`, 'ALERT');
      }
    } catch (err: any) {
      if (onNotify) onNotify(`Simulation error: ${err.message}`, 'ALERT');
    } finally {
      setIsSimulating(false);
    }
  };

  // Real-time D3 24-Hour VaR Line Chart Renderer
  useEffect(() => {
    if (!data?.varTrajectory || data.varTrajectory.length === 0 || !svgRef.current || !containerRef.current) {
      return;
    }

    const trajectory = data.varTrajectory;
    const containerWidth = containerRef.current.clientWidth || 700;
    const height = 240;
    const margin = { top: 20, right: 35, bottom: 30, left: 45 };
    const width = containerWidth - margin.left - margin.right;

    // Clear previous elements
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3
      .select(svgRef.current)
      .attr('width', containerWidth)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // X Scale: Time
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(trajectory, (d) => new Date(d.timestamp)) as [Date, Date])
      .range([0, width]);

    // Y Scale: VaR (Percentage or USD)
    const isPct = displayMode === 'PCT';
    const yValues = trajectory.flatMap((d) => [
      isPct ? d.var95Pct : d.var95Usd,
      isPct ? d.var99Pct : d.var99Usd,
      isPct ? d.thresholdLimitPct : d.thresholdLimitUsd,
    ]);

    // If simulation active, include simulated VaR in scale
    if (simulationResult) {
      yValues.push(isPct ? simulationResult.simulatedVaR.simulatedVaR95Pct : simulationResult.simulatedVaR.simulatedVaR95Usd);
      yValues.push(isPct ? simulationResult.simulatedVaR.simulatedVaR99Pct : simulationResult.simulatedVaR.simulatedVaR99Usd);
    }

    const minY = Math.max(0, (d3.min(yValues) || 0) * 0.85);
    const maxY = (d3.max(yValues) || (isPct ? 4.0 : 2000)) * 1.1;

    const yScale = d3.scaleLinear().domain([minY, maxY]).range([height - margin.top - margin.bottom, 0]);

    // Background Gradient Grids
    const defs = svg.append('defs');

    // Gradient for 95% VaR Area
    const areaGradient = defs
      .append('linearGradient')
      .attr('id', 'var95-area-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    areaGradient.append('stop').attr('offset', '0%').attr('stop-color', '#F59E0B').attr('stop-opacity', 0.25);
    areaGradient.append('stop').attr('offset', '100%').attr('stop-color', '#F59E0B').attr('stop-opacity', 0.0);

    // Subtle Grid lines
    svg
      .append('g')
      .attr('class', 'grid')
      .call(
        d3
          .axisLeft(yScale)
          .ticks(5)
          .tickSize(-width)
          .tickFormat(() => '')
      )
      .selectAll('line')
      .attr('stroke', '#1E293B')
      .attr('stroke-dasharray', '3,3');

    // Axes
    const xAxis = d3
      .axisBottom(xScale)
      .ticks(Math.max(4, Math.floor(width / 90)))
      .tickFormat((d) => d3.timeFormat('%H:%M')(d as Date));

    const yAxis = d3
      .axisLeft(yScale)
      .ticks(5)
      .tickFormat((d) => (isPct ? `${d}%` : `$${d}`));

    svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.top - margin.bottom})`)
      .call(xAxis)
      .attr('color', '#64748B')
      .selectAll('text')
      .attr('fill', '#94A3B8')
      .attr('font-size', '10px');

    svg
      .append('g')
      .call(yAxis)
      .attr('color', '#64748B')
      .selectAll('text')
      .attr('fill', '#94A3B8')
      .attr('font-size', '10px');

    // Area Generator (95% VaR)
    const areaGenerator = d3
      .area<VaRDataPoint>()
      .x((d) => xScale(new Date(d.timestamp)))
      .y0(height - margin.top - margin.bottom)
      .y1((d) => yScale(isPct ? d.var95Pct : d.var95Usd))
      .curve(d3.curveMonotoneX);

    svg
      .append('path')
      .datum(trajectory)
      .attr('fill', 'url(#var95-area-gradient)')
      .attr('d', areaGenerator);

    // Line Generator (99% VaR Tail Risk - Red dashed line)
    const line99 = d3
      .line<VaRDataPoint>()
      .x((d) => xScale(new Date(d.timestamp)))
      .y((d) => yScale(isPct ? d.var99Pct : d.var99Usd))
      .curve(d3.curveMonotoneX);

    svg
      .append('path')
      .datum(trajectory)
      .attr('fill', 'none')
      .attr('stroke', '#EF4444')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '4,3')
      .attr('d', line99);

    // Line Generator (95% VaR - Solid Amber line)
    const line95 = d3
      .line<VaRDataPoint>()
      .x((d) => xScale(new Date(d.timestamp)))
      .y((d) => yScale(isPct ? d.var95Pct : d.var95Usd))
      .curve(d3.curveMonotoneX);

    svg
      .append('path')
      .datum(trajectory)
      .attr('fill', 'none')
      .attr('stroke', '#F59E0B')
      .attr('stroke-width', 2.5)
      .attr('d', line95);

    // Circuit Breaker Threshold Limit Line (Red Solid)
    const limitY = yScale(isPct ? 3.50 : (data.totalPortfolioUsd * 3.5) / 100);
    svg
      .append('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', limitY)
      .attr('y2', limitY)
      .attr('stroke', '#DC2626')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '6,4');

    svg
      .append('text')
      .attr('x', width - 5)
      .attr('y', limitY - 4)
      .attr('text-anchor', 'end')
      .attr('fill', '#EF4444')
      .attr('font-size', '9px')
      .attr('font-weight', 'bold')
      .text(isPct ? 'Circuit Breaker Ceiling: 3.50%' : 'Circuit Limit: $1,690');

    // If simulation active: render horizontal projection line for Simulated 95% VaR
    if (simulationResult) {
      const simVal = isPct ? simulationResult.simulatedVaR.simulatedVaR95Pct : simulationResult.simulatedVaR.simulatedVaR95Usd;
      const simY = yScale(simVal);

      svg
        .append('line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', simY)
        .attr('y2', simY)
        .attr('stroke', '#F43F5E')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '5,3');

      svg
        .append('text')
        .attr('x', 10)
        .attr('y', simY - 5)
        .attr('fill', '#FDA4AF')
        .attr('font-size', '9px')
        .attr('font-weight', 'bold')
        .text(`⚡ Monte Carlo -10% Shock Projection: ${simulationResult.simulatedVaR.simulatedVaR95Pct}% ($${simulationResult.simulatedVaR.simulatedVaR95Usd})`);
    }

    // Data points & Tooltip interaction overlay
    const bisectDate = d3.bisector<VaRDataPoint, Date>((d) => new Date(d.timestamp)).center;

    const focus = svg.append('g').style('display', 'none');

    // Vertical cursor line
    const cursorLine = focus
      .append('line')
      .attr('stroke', '#64748B')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '2,2')
      .attr('y1', 0)
      .attr('y2', height - margin.top - margin.bottom);

    // Amber Dot on 95% line
    const dot95 = focus
      .append('circle')
      .attr('r', 4.5)
      .attr('fill', '#F59E0B')
      .attr('stroke', '#0B0F17')
      .attr('stroke-width', 2);

    // Red Dot on 99% line
    const dot99 = focus
      .append('circle')
      .attr('r', 3.5)
      .attr('fill', '#EF4444')
      .attr('stroke', '#0B0F17')
      .attr('stroke-width', 2);

    svg
      .append('rect')
      .attr('width', width)
      .attr('height', height - margin.top - margin.bottom)
      .attr('fill', 'transparent')
      .style('cursor', 'crosshair')
      .on('mouseover', () => focus.style('display', null))
      .on('mouseout', () => {
        focus.style('display', 'none');
        setHoveredPoint(null);
      })
      .on('mousemove', (event) => {
        const [xm] = d3.pointer(event);
        const xDate = xScale.invert(xm);
        const i = bisectDate(trajectory, xDate, 1);
        const d0 = trajectory[i - 1];
        const d1 = trajectory[i];
        let d = d0;
        if (d0 && d1) {
          d = xDate.getTime() - d0.timestamp > d1.timestamp - xDate.getTime() ? d1 : d0;
        } else if (d1) {
          d = d1;
        }
        if (d) {
          const cx = xScale(new Date(d.timestamp));
          cursorLine.attr('x1', cx).attr('x2', cx);
          dot95.attr('cx', cx).attr('cy', yScale(isPct ? d.var95Pct : d.var95Usd));
          dot99.attr('cx', cx).attr('cy', yScale(isPct ? d.var99Pct : d.var99Usd));
          setHoveredPoint(d);
        }
      });
  }, [data, displayMode, simulationResult]);

  // Real-time D3 Asset Correlation Heatmap Matrix Renderer
  useEffect(() => {
    if (!data?.correlationMatrix || !matrixSvgRef.current || !matrixContainerRef.current) {
      return;
    }

    const { assets, matrix } = data.correlationMatrix;
    const n = assets.length;
    const containerWidth = matrixContainerRef.current.clientWidth || 400;
    const margin = { top: 32, right: 20, bottom: 20, left: 45 };
    const size = Math.min(containerWidth - margin.left - margin.right, 340);
    const cellSize = size / n;

    // Clear previous elements
    d3.select(matrixSvgRef.current).selectAll('*').remove();

    const svg = d3
      .select(matrixSvgRef.current)
      .attr('width', size + margin.left + margin.right)
      .attr('height', size + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Diverging Color Scale: Blue (Negative/Zero Correlation) -> Slate -> Amber -> Crimson Red (High Correlation)
    const colorScale = d3
      .scaleLinear<string>()
      .domain([-0.1, 0.0, 0.5, 0.8, 1.0])
      .range(['#38BDF8', '#1E293B', '#F59E0B', '#F97316', '#EF4444'])
      .interpolate(d3.interpolateRgb);

    // Column Headers (Top)
    svg
      .selectAll('.col-label')
      .data(assets)
      .enter()
      .append('text')
      .attr('class', 'col-label')
      .attr('x', (_d, i) => i * cellSize + cellSize / 2)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .attr('fill', '#94A3B8')
      .attr('font-size', '10px')
      .attr('font-weight', 'bold')
      .text((d) => d);

    // Row Headers (Left)
    svg
      .selectAll('.row-label')
      .data(assets)
      .enter()
      .append('text')
      .attr('class', 'row-label')
      .attr('x', -8)
      .attr('y', (_d, i) => i * cellSize + cellSize / 2 + 3)
      .attr('text-anchor', 'end')
      .attr('fill', '#94A3B8')
      .attr('font-size', '10px')
      .attr('font-weight', 'bold')
      .text((d) => d);

    // Draw Heatmap Cells
    for (let row = 0; row < n; row++) {
      for (let col = 0; col < n; col++) {
        const val = matrix[row][col];
        const cell = svg.append('g');

        cell
          .append('rect')
          .attr('x', col * cellSize + 1.5)
          .attr('y', row * cellSize + 1.5)
          .attr('width', cellSize - 3)
          .attr('height', cellSize - 3)
          .attr('rx', 4)
          .attr('fill', colorScale(val))
          .attr('stroke', '#0B0F17')
          .attr('stroke-width', 1.5)
          .style('cursor', 'pointer')
          .on('mouseover', function () {
            d3.select(this).attr('stroke', '#38BDF8').attr('stroke-width', 2);
            setHoveredCorrelation({
              asset1: assets[row],
              asset2: assets[col],
              val,
            });
          })
          .on('mouseout', function () {
            d3.select(this).attr('stroke', '#0B0F17').attr('stroke-width', 1.5);
            setHoveredCorrelation(null);
          });

        // Numeric text label in cell
        cell
          .append('text')
          .attr('x', col * cellSize + cellSize / 2)
          .attr('y', row * cellSize + cellSize / 2 + 3.5)
          .attr('text-anchor', 'middle')
          .attr('fill', Math.abs(val) > 0.65 ? '#FFFFFF' : '#CBD5E1')
          .attr('font-size', '9px')
          .attr('font-weight', 'bold')
          .attr('pointer-events', 'none')
          .text(val === 1.0 ? '1.0' : val.toFixed(2));
      }
    }
  }, [data]);

  const handleUpdateStopLoss = async (id: string) => {
    if (!newPrice) return;
    setIsUpdating(true);
    try {
      const res = await fetch('/api/risk/stop-loss/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, triggerPriceUsd: parseFloat(newPrice) }),
      });
      const json = await res.json();
      if (json.success) {
        if (onNotify) onNotify(`Stop loss for ${json.updatedRule.asset} updated to $${json.updatedRule.triggerPriceUsd}`, 'SUCCESS');
        setEditingRuleId(null);
        setNewPrice('');
        fetchRiskData();
      }
    } catch (err: any) {
      if (onNotify) onNotify(`Update failed: ${err.message}`, 'ALERT');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleCircuitBreaker = async () => {
    setIsTogglingBreaker(true);
    try {
      const res = await fetch('/api/risk/circuit-breaker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const json = await res.json();
      if (json.success) {
        const status = json.circuitBreakerTripped ? 'ENGAGED (TRADING HALTED)' : 'DISENGAGED (TRADING NORMAL)';
        if (onNotify) onNotify(`Emergency Circuit Breaker ${status}`, json.circuitBreakerTripped ? 'ALERT' : 'SUCCESS');
        fetchRiskData();
      }
    } catch (err: any) {
      if (onNotify) onNotify(`Circuit breaker toggle failed: ${err.message}`, 'ALERT');
    } finally {
      setIsTogglingBreaker(false);
    }
  };

  // One-Click Automated Hedging Handler
  const handleExecuteHedge = async (alertId: string) => {
    setHedgingAlertId(alertId);
    try {
      const res = await fetch('/api/risk/hedge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alertId }),
      });
      const json = await res.json();
      if (json.success) {
        if (onNotify) {
          onNotify(
            `One-Click Hedge executed for ${json.hedgedAlert.asset}! Tx: ${json.transaction.txHash.slice(0, 10)}... Chained to Block #${json.complianceBlock.height}.`,
            'SUCCESS'
          );
        }
        fetchRiskData();
      } else {
        if (onNotify) onNotify(`Hedging execution failed: ${json.error}`, 'ALERT');
      }
    } catch (err: any) {
      if (onNotify) onNotify(`Hedging error: ${err.message}`, 'ALERT');
    } finally {
      setHedgingAlertId(null);
    }
  };

  const isBreakerTripped = data?.riskConfig?.circuitBreakerTripped;
  const activeBreaches = data?.riskConfig?.breachAlerts?.filter((a) => a.status === 'ACTIVE') || [];
  const hedgedBreaches = data?.riskConfig?.breachAlerts?.filter((a) => a.status === 'HEDGED') || [];

  return (
    <div className="bg-[#0B0F17] border border-slate-800 rounded-xl overflow-hidden shadow-2xl space-y-4 font-mono text-xs">
      {/* Header Banner */}
      <div className="p-4 sm:p-5 border-b border-slate-800 bg-gradient-to-r from-red-950/40 via-[#0B0F17] to-amber-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-amber-600 flex items-center justify-center shadow-lg shadow-red-500/20 shrink-0">
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-wide uppercase">
                PORTFOLIO RISK &amp; VaR MANAGEMENT DASHBOARD
              </h2>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border flex items-center gap-1 ${
                isBreakerTripped 
                  ? 'bg-red-500/20 text-red-300 border-red-500/40 animate-pulse' 
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isBreakerTripped ? 'bg-red-400' : 'bg-emerald-400'}`} />
                {isBreakerTripped ? 'HALT INTERLOCK ACTIVE' : 'RISK GATES ARMED'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Parametric &amp; Historical VaR (95%/99%) · Conditional Tail Risk (CVaR) · Automated Stop-Loss Interlocks
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* SIMULATE MARKET EVENT BUTTON */}
          <button
            onClick={() => handleSimulateMarketEvent(10)}
            disabled={isSimulating}
            className="px-3 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/20 cursor-pointer disabled:opacity-50"
            title="Run 1,000-trial Monte Carlo simulation of a 10% market crash"
          >
            <PlayCircle className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? 'Simulating 1,000 Runs...' : 'Simulate -10% Crash'}</span>
          </button>

          <button
            onClick={handleToggleCircuitBreaker}
            disabled={isTogglingBreaker}
            className={`px-3 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 ${
              isBreakerTripped 
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white' 
                : 'bg-red-600/90 hover:bg-red-500 text-white shadow-lg shadow-red-600/20'
            }`}
          >
            {isBreakerTripped ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
            <span>{isBreakerTripped ? 'Disengage Breaker' : 'Engage Emergency Halt'}</span>
          </button>

          <button
            onClick={fetchRiskData}
            disabled={isLoading}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 rounded transition-all cursor-pointer"
            title="Refresh Risk Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* MONTE CARLO SIMULATION RESULT BANNER & IMPACT OVERLAY */}
      {simulationResult && (
        <div className="px-4">
          <div className="p-4 bg-gradient-to-br from-purple-950/40 via-[#0B0F17] to-red-950/30 border border-purple-500/40 rounded-xl space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-purple-900/40 pb-2">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-purple-400" />
                <span className="font-bold text-white uppercase text-xs">
                  Monte Carlo Stress Test: -{simulationResult.marketDropPct}% Market Liquidation Event ({simulationResult.numTrials.toLocaleString()} Iterations)
                </span>
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                  simulationResult.simulatedVaR.wouldTripCircuitBreaker ? 'bg-red-500/20 text-red-300 border border-red-500/40' : 'bg-emerald-500/20 text-emerald-300'
                }`}>
                  {simulationResult.simulatedVaR.wouldTripCircuitBreaker ? 'CIRCUIT LIMIT BREACHED' : 'TOLERANCE SECURE'}
                </span>
              </div>
              <button
                onClick={() => setSimulationResult(null)}
                className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 cursor-pointer"
                title="Dismiss Simulation"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Impact Metric Comparison Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-[11px]">
              <div className="p-2.5 bg-slate-900/90 border border-purple-900/40 rounded-lg">
                <span className="text-slate-400 text-[10px] block">SIMULATED 95% VaR</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-sm font-bold text-rose-400">
                    ${simulationResult.simulatedVaR.simulatedVaR95Usd.toLocaleString()}
                  </span>
                  <span className="text-rose-300 text-[10px]">({simulationResult.simulatedVaR.simulatedVaR95Pct}%)</span>
                </div>
                <span className="text-[9px] text-amber-400 block mt-0.5">
                  +{simulationResult.simulatedVaR.deltaVaRPct}% from baseline
                </span>
              </div>

              <div className="p-2.5 bg-slate-900/90 border border-purple-900/40 rounded-lg">
                <span className="text-slate-400 text-[10px] block">SIMULATED 99% TAIL VaR</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-sm font-bold text-red-400">
                    ${simulationResult.simulatedVaR.simulatedVaR99Usd.toLocaleString()}
                  </span>
                  <span className="text-red-300 text-[10px]">({simulationResult.simulatedVaR.simulatedVaR99Pct}%)</span>
                </div>
                <span className="text-[9px] text-slate-500 block mt-0.5">99th percentile loss</span>
              </div>

              <div className="p-2.5 bg-slate-900/90 border border-purple-900/40 rounded-lg">
                <span className="text-slate-400 text-[10px] block">STRESSED EXPECTED SHORTFALL</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-sm font-bold text-purple-300">
                    ${simulationResult.simulatedVaR.simulatedCVaRUsd.toLocaleString()}
                  </span>
                </div>
                <span className="text-[9px] text-slate-500 block mt-0.5">CVaR beyond 95% barrier</span>
              </div>

              <div className="p-2.5 bg-slate-900/90 border border-purple-900/40 rounded-lg">
                <span className="text-slate-400 text-[10px] block">CIRCUIT BREAKER STATUS</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className={`text-sm font-bold ${simulationResult.simulatedVaR.wouldTripCircuitBreaker ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
                    {simulationResult.simulatedVaR.wouldTripCircuitBreaker ? 'TRIPPED (>3.5%)' : 'NOMINAL (<3.5%)'}
                  </span>
                </div>
                <span className="text-[9px] text-slate-400 block mt-0.5">
                  Ceiling Limit: {simulationResult.simulatedVaR.circuitLimitPct}%
                </span>
              </div>
            </div>

            {/* Asset-by-Asset Impact Breakdown */}
            <div className="pt-1">
              <span className="text-[10px] text-slate-400 block mb-1 font-semibold">
                ASSET BREAKDOWN UNDER -10% MARKET SHOCK (BETA-WEIGHTED):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                {simulationResult.assetImpacts.map((a) => (
                  <div key={a.symbol} className="p-2 bg-slate-900/60 border border-slate-800 rounded text-[10px]">
                    <div className="flex justify-between items-center font-bold">
                      <span className="text-white">{a.symbol}</span>
                      <span className="text-red-400">-{a.expectedDropPct}%</span>
                    </div>
                    <div className="text-slate-500 mt-0.5">Loss: -${a.lossUsd}</div>
                    <div className="text-slate-300 text-[9px] mt-0.5">Post: ${a.postDropValUsd}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ACTIVE BREACH ALERTS SECTION */}
      <div className="px-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className={`w-4 h-4 ${activeBreaches.length > 0 ? 'text-red-400 animate-pulse' : 'text-slate-500'}`} />
            <span className="text-[11px] font-bold text-slate-200 uppercase tracking-wide">
              Active VaR Breach Alerts ({activeBreaches.length})
            </span>
            {activeBreaches.length > 0 && (
              <span className="px-1.5 py-0.2 bg-red-500/20 text-red-300 border border-red-500/40 rounded text-[9px] font-bold">
                IMMEDIATE ACTION RECOMMENDED
              </span>
            )}
          </div>
          <span className="text-[10px] text-slate-400">
            One-Click Hedging routes delta-neutral synthetic legs
          </span>
        </div>

        {activeBreaches.length === 0 ? (
          <div className="p-3 bg-[#070A0F] border border-emerald-900/40 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span className="font-semibold text-xs">All asset standalone VaRs are within safe tolerance limits.</span>
            </div>
            <span className="text-slate-500 text-[10px]">No active tail risk breaches detected</span>
          </div>
        ) : (
          <div className="space-y-2">
            {activeBreaches.map((alert) => {
              const isHedging = hedgingAlertId === alert.id;
              return (
                <div
                  key={alert.id}
                  className="p-3.5 bg-gradient-to-r from-red-950/30 via-[#070A0F] to-amber-950/20 border border-red-500/40 rounded-xl space-y-2.5 shadow-lg shadow-red-950/20"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-red-900/30 pb-2">
                    <div className="flex items-center gap-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        alert.severity === 'CRITICAL' ? 'bg-red-500 text-white animate-pulse' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}>
                        {alert.severity} BREACH
                      </span>
                      <span className="font-bold text-white text-sm">
                        {alert.asset} Standalone VaR Exceeded
                      </span>
                      <span className="text-slate-400 text-[10px]">
                        Triggered {new Date(alert.triggeredAt).toLocaleTimeString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-red-300">
                        Current VaR: <b className="text-red-400">{alert.currentVaRPct}%</b> (Limit: {alert.thresholdVaRPct}%)
                      </span>
                      <span className="px-1.5 py-0.5 bg-red-900/40 text-red-200 rounded text-[9px] font-mono">
                        +{alert.breachMarginPct}% Excess
                      </span>
                    </div>
                  </div>

                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {alert.reason}
                  </p>

                  <div className="p-2.5 bg-slate-900/80 border border-slate-800 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3 text-[11px]">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">Hedging Route:</span>
                        <code className="text-cyan-300 font-bold">{alert.hedgingStrategy}</code>
                        <span className="text-slate-500">via</span>
                        <span className="text-slate-200 font-semibold">{alert.recommendedVenue}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        <span>Recommended Sizing: <b className="text-amber-400">{alert.recommendedHedgeSize}</b></span>
                        <span>·</span>
                        <span>Estimated Excess Exposure: <b className="text-red-400">${alert.estimatedExcessRiskUsd}</b></span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleExecuteHedge(alert.id)}
                      disabled={isHedging}
                      className="px-3.5 py-1.5 bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white rounded font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-red-600/30 transition-all cursor-pointer disabled:opacity-50 shrink-0"
                    >
                      <Zap className={`w-3.5 h-3.5 ${isHedging ? 'animate-spin' : ''}`} />
                      <span>{isHedging ? 'Executing Hedge...' : '1-Click Auto-Hedge'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Recently Hedged Alerts Badge Tray */}
        {hedgedBreaches.length > 0 && (
          <div className="pt-1 flex items-center gap-2 flex-wrap">
            <span className="text-[10px] text-slate-500">Recently Hedged:</span>
            {hedgedBreaches.map((h) => (
              <span key={h.id} className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>{h.asset} VaR neutralized ({h.hedgingStrategy})</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Primary VaR Key Performance Metrics */}
      {data?.varMetrics && (
        <div className="px-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-slate-900/70 border border-slate-800 rounded-lg">
            <span className="text-[10px] text-slate-500 block">1-DAY VaR (95% CONFIDENCE)</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-sm font-bold text-amber-400">
                ${data.varMetrics.var95Usd.toLocaleString()}
              </span>
              <span className="text-[10px] text-amber-500/80">({data.varMetrics.var95Pct}%)</span>
            </div>
            <span className="text-[9px] text-slate-500 block mt-1">Maximum 24h expected loss</span>
          </div>

          <div className="p-3 bg-slate-900/70 border border-slate-800 rounded-lg">
            <span className="text-[10px] text-slate-500 block">1-DAY VaR (99% CONFIDENCE)</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-sm font-bold text-red-400">
                ${data.varMetrics.var99Usd.toLocaleString()}
              </span>
              <span className="text-[10px] text-red-500/80">({data.varMetrics.var99Pct}%)</span>
            </div>
            <span className="text-[9px] text-slate-500 block mt-1">Extreme tail risk threshold</span>
          </div>

          <div className="p-3 bg-slate-900/70 border border-slate-800 rounded-lg">
            <span className="text-[10px] text-slate-500 block">EXPECTED SHORTFALL (CVaR)</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-sm font-bold text-purple-300">
                ${data.varMetrics.expectedShortfallUsd.toLocaleString()}
              </span>
            </div>
            <span className="text-[9px] text-slate-500 block mt-1">Average loss beyond 95% VaR</span>
          </div>

          <div className="p-3 bg-slate-900/70 border border-slate-800 rounded-lg">
            <span className="text-[10px] text-slate-500 block">PORTFOLIO DRAWDOWN GATE</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-sm font-bold text-emerald-400">
                {data.varMetrics.currentDrawdownPct}%
              </span>
              <span className="text-[10px] text-slate-500">/ max {data.varMetrics.maxDrawdownLimitPct}%</span>
            </div>
            <span className="text-[9px] text-emerald-500 block mt-1">Under strict circuit limit</span>
          </div>
        </div>
      )}

      {/* D3 Real-Time 24-Hour VaR Trajectory Line Chart */}
      <div className="px-4">
        <div className="p-3.5 bg-[#070A0F] border border-slate-800 rounded-xl space-y-3" ref={containerRef}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
            <div className="flex items-center gap-2">
              <LineChartIcon className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-slate-200 text-xs uppercase tracking-wide">
                24-Hour Real-Time VaR (Value at Risk) Trajectory
              </span>
              <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded text-[9px] font-bold">
                D3 ENGINE
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Legend */}
              <div className="flex items-center gap-3 text-[10px] text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-0.5 bg-amber-400 rounded-full" />
                  <span>95% VaR</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-0.5 bg-red-400 rounded-full border-t border-dashed" />
                  <span>99% Extreme VaR</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-0.5 bg-red-600 rounded-full" />
                  <span>Circuit Trip Line (3.5%)</span>
                </span>
                {simulationResult && (
                  <span className="flex items-center gap-1.5 text-rose-300">
                    <span className="w-2.5 h-0.5 bg-rose-500 rounded-full border-t border-dotted" />
                    <span>-10% Simulation</span>
                  </span>
                )}
              </div>

              {/* Toggle Percentage vs USD */}
              <div className="flex items-center bg-slate-900 border border-slate-700 rounded p-0.5">
                <button
                  onClick={() => setDisplayMode('PCT')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                    displayMode === 'PCT' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  % VaR
                </button>
                <button
                  onClick={() => setDisplayMode('USD')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                    displayMode === 'USD' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  $ USD
                </button>
              </div>
            </div>
          </div>

          {/* D3 SVG Canvas */}
          <div className="relative w-full overflow-hidden">
            <svg ref={svgRef} className="w-full block" />

            {/* Hover Tooltip Card */}
            {hoveredPoint && (
              <div className="absolute top-2 right-4 bg-slate-900/95 border border-amber-500/40 rounded-lg p-2.5 shadow-xl backdrop-blur-md pointer-events-none text-[10px] space-y-1">
                <div className="text-slate-400 border-b border-slate-800 pb-1 flex justify-between gap-4 font-bold">
                  <span>Timestamp</span>
                  <span className="text-white">{hoveredPoint.timeStr}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-amber-400 font-semibold">95% VaR:</span>
                  <span className="text-white font-bold">
                    {hoveredPoint.var95Pct}% (${hoveredPoint.var95Usd.toLocaleString()})
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-red-400 font-semibold">99% Tail VaR:</span>
                  <span className="text-white font-bold">
                    {hoveredPoint.var99Pct}% (${hoveredPoint.var99Usd.toLocaleString()})
                  </span>
                </div>
                <div className="flex justify-between gap-4 text-slate-400">
                  <span>Ceiling Limit:</span>
                  <span className="text-red-400">3.50%</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* D3 ASSET CORRELATION MATRIX & STRESS TESTING SECTION */}
      <div className="px-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* D3 Asset Correlation Heatmap Widget (7 cols) */}
        <div className="lg:col-span-7 p-3.5 bg-[#070A0F] border border-slate-800 rounded-xl space-y-3" ref={matrixContainerRef}>
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <div className="flex items-center gap-2">
              <Grid className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-slate-200 text-xs uppercase tracking-wide">
                Asset Correlation Matrix (30-Day Pearson)
              </span>
              <span className="px-1.5 py-0.5 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded text-[9px] font-bold">
                D3 HEATMAP
              </span>
            </div>
            {hoveredCorrelation && (
              <span className="text-[10px] text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded font-bold">
                {hoveredCorrelation.asset1} ↔ {hoveredCorrelation.asset2}: {hoveredCorrelation.val.toFixed(2)}
              </span>
            )}
          </div>

          <p className="text-[10px] text-slate-400">
            Quantifies cross-venue co-movement and diversification risk during high-volatility drawdown cascades.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="overflow-x-auto flex justify-center">
              <svg ref={matrixSvgRef} className="block" />
            </div>

            {/* Correlation Legend and Interpretation */}
            <div className="space-y-2 text-[10px] text-slate-400 sm:max-w-[170px] self-center">
              <span className="font-bold text-slate-300 block text-[11px]">Correlation Scale:</span>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-[#EF4444] border border-slate-900 shrink-0" />
                <span>+0.80 to +1.00 (High Systemic)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-[#F59E0B] border border-slate-900 shrink-0" />
                <span>+0.50 to +0.79 (Moderate Beta)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-[#1E293B] border border-slate-900 shrink-0" />
                <span>0.00 to +0.49 (Low Sensitivity)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-[#38BDF8] border border-slate-900 shrink-0" />
                <span>Negative (Stable Hedge)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Macro Stress Testing & Tail Risk Scenarios (5 cols) */}
        <div className="lg:col-span-5 p-3.5 bg-[#070A0F] border border-slate-800 rounded-xl space-y-2.5 flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-300 uppercase block flex items-center gap-1.5 border-b border-slate-800/80 pb-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>MACRO STRESS TESTING &amp; TAIL RISK SCENARIOS</span>
            </span>
            <div className="space-y-1.5 mt-2.5">
              {data?.riskConfig.stressScenarios.map((sc, idx) => (
                <div key={idx} className="p-2.5 bg-slate-900/60 border border-slate-800 rounded-lg flex items-center justify-between text-[11px]">
                  <div>
                    <span className="text-slate-200 block font-semibold">{sc.name}</span>
                    <span className="text-[9px] text-slate-500">Simulated portfolio impact</span>
                  </div>
                  <div className="text-right">
                    <span className="text-red-400 font-bold block">-${sc.estimatedLossUsd.toLocaleString()}</span>
                    <span className={`text-[8px] font-bold px-1 rounded ${
                      sc.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-300' :
                      sc.severity === 'HIGH' ? 'bg-amber-500/20 text-amber-300' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {sc.severity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-2.5 bg-slate-900/80 border border-slate-800 rounded-lg text-[10px] text-slate-400">
            <span className="text-slate-300 font-bold block mb-0.5">Cross-Asset Hedging Advice:</span>
            High BTC/ETH correlation (0.82) confirms ETH perp short provides 91% beta protection during macro selloffs.
          </div>
        </div>
      </div>

      {/* Risk Metrics Visual Gauge Bar */}
      <div className="px-4">
        <div className="p-3.5 bg-[#070A0F] border border-slate-800 rounded-xl space-y-2">
          <div className="flex justify-between items-center text-[11px]">
            <span className="font-bold text-slate-300 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>PORTFOLIO VALUE AT RISK EXPOSURE (95% VaR vs LIMIT)</span>
            </span>
            <span className="text-slate-400">
              Allocated: <b className="text-amber-400">{data?.varMetrics.var95Pct}%</b> of 3.50% ceiling
            </span>
          </div>
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden flex">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-amber-500 h-full transition-all duration-500" 
              style={{ width: `${Math.min(100, ((data?.varMetrics.var95Pct || 2.14) / 3.5) * 100)}%` }} 
            />
            <div className="bg-red-500/40 h-full flex-1" />
          </div>
          <div className="flex justify-between text-[9px] text-slate-500">
            <span>0.00% Zero Risk</span>
            <span>2.14% Current 24h VaR</span>
            <span className="text-red-400">3.50% Circuit Breaker Trip Point</span>
          </div>
        </div>
      </div>

      {/* Automated Stop-Loss Interlock Thresholds Table */}
      <div className="px-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-300 uppercase flex items-center gap-1.5">
            <TrendingDown className="w-3.5 h-3.5 text-red-400" />
            <span>AUTOMATED STOP-LOSS INTERLOCK THRESHOLDS ({data?.riskConfig.stopLossRules.length || 0})</span>
          </span>
          <span className="text-[10px] text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Execution Protocol: Pre-authorized Atomic Routing</span>
          </span>
        </div>

        <div className="space-y-2">
          {data?.riskConfig.stopLossRules.map((rule) => {
            const isEditing = editingRuleId === rule.id;
            return (
              <div 
                key={rule.id} 
                className="p-3 bg-[#070A0F] border border-slate-800 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-white font-bold text-xs min-w-[50px] text-center">
                    {rule.asset}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs">
                        Current: ${rule.currentPriceUsd.toLocaleString()}
                      </span>
                      <span className="text-red-400 font-semibold text-[10px] flex items-center">
                        <ArrowDownRight className="w-3 h-3" />
                        Trigger: ${rule.triggerPriceUsd.toLocaleString()} ({rule.distancePct}%)
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Action: <code className="text-cyan-300">{rule.action}</code> via <span className="text-slate-300">{rule.venue}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  {isEditing ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        placeholder="New Stop Price"
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                        className="w-28 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white text-xs"
                      />
                      <button
                        onClick={() => handleUpdateStopLoss(rule.id)}
                        disabled={isUpdating}
                        className="px-2 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-[10px] font-bold cursor-pointer"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingRuleId(null)}
                        className="px-2 py-1 bg-slate-800 text-slate-400 rounded text-[10px] cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {rule.status}
                      </span>
                      <button
                        onClick={() => {
                          setEditingRuleId(rule.id);
                          setNewPrice(rule.triggerPriceUsd.toString());
                        }}
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Sliders className="w-3 h-3" />
                        <span>Adjust</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Holdings Risk Contribution Table */}
      <div className="px-4 space-y-2">
        <span className="text-[11px] font-bold text-slate-300 uppercase block">
          HOLDINGS MARGINAL RISK &amp; STANDALONE VaR ALLOCATION
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {data?.assetRiskAllocations.map((item) => (
            <div key={item.symbol} className="p-2.5 bg-[#070A0F] border border-slate-800 rounded-lg flex items-center justify-between text-[11px]">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-white">{item.symbol}</span>
                  <span className="text-slate-500 text-[10px]">({item.sharePct}%)</span>
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5">${item.valueUsd.toLocaleString()}</span>
              </div>
              <div className="text-right">
                <span className="text-amber-400 font-bold block text-[11px]">VaR: ${item.standaloneVaRUsd}</span>
                <span className="text-cyan-400 text-[10px] block">
                  Marginal: {item.marginalRiskContributionPct}% · Vol: {item.annualizedVolatilityPct}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
