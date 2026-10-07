import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import {
  Globe,
  Radio,
  Server,
  Activity,
  ShieldCheck,
  Zap,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  CheckCircle2,
  Copy,
  ExternalLink,
  Layers,
  MapPin,
} from 'lucide-react';
import { FederalRegisteredNode } from '../data/federalCryptoRegistryData';

interface FederalNodesWorldMapProps {
  nodes: FederalRegisteredNode[];
  selectedNodeId?: string;
  onSelectNode?: (node: FederalRegisteredNode) => void;
  onNotify?: (message: string, type: 'ALERT' | 'SUCCESS' | 'INFO') => void;
}

// Inter-node network connections for RTGS transit corridors
const INTER_NODE_LINKS: Array<{ sourceId: string; targetId: string; activeBandwidthGbps: number }> = [
  { sourceId: 'FED-DAG-NODE-01', targetId: 'FED-DAG-NODE-02', activeBandwidthGbps: 250 }, // Pentagon <-> Cheyenne Mountain (DoD DAG Mesh)
  { sourceId: 'FED-DAG-NODE-01', targetId: 'FED-NODE-01', activeBandwidthGbps: 150 },     // Pentagon <-> Washington DC XRPL
  { sourceId: 'FED-DAG-NODE-01', targetId: 'FED-NODE-02', activeBandwidthGbps: 200 },     // Pentagon <-> New York FedNow
  { sourceId: 'FED-DAG-NODE-02', targetId: 'FED-NODE-10', activeBandwidthGbps: 150 },     // Cheyenne Mountain <-> San Francisco OCC
  { sourceId: 'FED-NODE-01', targetId: 'FED-NODE-02', activeBandwidthGbps: 100 }, // DC <-> NY
  { sourceId: 'FED-NODE-02', targetId: 'FED-NODE-03', activeBandwidthGbps: 80 },  // NY <-> Boston
  { sourceId: 'FED-NODE-02', targetId: 'FED-NODE-04', activeBandwidthGbps: 200 }, // NY <-> NY DTCC
  { sourceId: 'FED-NODE-02', targetId: 'FED-NODE-05', activeBandwidthGbps: 120 }, // NY <-> Jersey City
  { sourceId: 'FED-NODE-02', targetId: 'FED-NODE-06', activeBandwidthGbps: 150 }, // NY <-> London
  { sourceId: 'FED-NODE-06', targetId: 'FED-NODE-07', activeBandwidthGbps: 100 }, // London <-> Zurich
  { sourceId: 'FED-NODE-01', targetId: 'FED-NODE-10', activeBandwidthGbps: 150 }, // DC <-> San Francisco
  { sourceId: 'FED-NODE-10', targetId: 'FED-NODE-09', activeBandwidthGbps: 120 }, // SF <-> Tokyo
  { sourceId: 'FED-NODE-09', targetId: 'FED-NODE-08', activeBandwidthGbps: 100 }, // Tokyo <-> Singapore
  { sourceId: 'FED-NODE-08', targetId: 'FED-NODE-06', activeBandwidthGbps: 80 },  // Singapore <-> London
];

// Simplified stylized world continents GeoJSON for offline instant D3 rendering
const WORLD_CONTINENTS_GEOJSON: GeoJSON.FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    // North America
    {
      type: 'Feature',
      properties: { name: 'North America' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-168, 71], [-160, 60], [-140, 60], [-125, 48], [-124, 38], [-117, 32],
            [-105, 23], [-97, 18], [-87, 15], [-80, 8], [-77, 9], [-83, 10],
            [-86, 21], [-81, 25], [-80, 31], [-75, 35], [-71, 42], [-65, 45],
            [-60, 47], [-55, 52], [-62, 60], [-80, 62], [-95, 70], [-120, 72],
            [-140, 70], [-168, 71]
          ]
        ]
      }
    },
    // South America
    {
      type: 'Feature',
      properties: { name: 'South America' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-77, 9], [-72, 11], [-60, 9], [-50, 0], [-35, -5], [-37, -12],
            [-43, -22], [-50, -30], [-60, -38], [-68, -54], [-75, -50],
            [-72, -40], [-72, -30], [-76, -18], [-80, -5], [-78, 2], [-77, 9]
          ]
        ]
      }
    },
    // Europe
    {
      type: 'Feature',
      properties: { name: 'Europe' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-10, 36], [0, 38], [15, 38], [25, 36], [28, 41], [30, 47],
            [37, 47], [40, 55], [30, 60], [25, 71], [15, 65], [5, 62],
            [0, 52], [-5, 48], [-9, 43], [-10, 36]
          ]
        ]
      }
    },
    // Africa
    {
      type: 'Feature',
      properties: { name: 'Africa' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-17, 33], [0, 36], [15, 38], [32, 31], [40, 22], [51, 12],
            [43, -10], [35, -25], [26, -34], [18, -34], [12, -20], [8, 4],
            [-5, 5], [-15, 12], [-17, 22], [-17, 33]
          ]
        ]
      }
    },
    // Asia
    {
      type: 'Feature',
      properties: { name: 'Asia' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [30, 60], [40, 55], [50, 40], [60, 25], [75, 10], [85, 20],
            [100, 15], [105, 1], [115, 5], [120, 23], [125, 38], [130, 43],
            [142, 50], [155, 60], [175, 66], [180, 70], [140, 75], [90, 75],
            [60, 70], [40, 65], [30, 60]
          ]
        ]
      }
    },
    // Australia & Oceania
    {
      type: 'Feature',
      properties: { name: 'Australia' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [114, -22], [122, -15], [135, -12], [142, -10], [150, -22],
            [153, -28], [148, -38], [138, -35], [128, -32], [115, -34],
            [114, -22]
          ]
        ]
      }
    }
  ]
};

export const FederalNodesWorldMap: React.FC<FederalNodesWorldMapProps> = ({
  nodes,
  selectedNodeId,
  onSelectNode,
  onNotify,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeProtocolFilter, setActiveProtocolFilter] = useState<string>('ALL');
  const [activeRegionFilter, setActiveRegionFilter] = useState<string>('ALL');
  const [hoveredNode, setHoveredNode] = useState<FederalRegisteredNode | null>(null);
  const [zoomK, setZoomK] = useState<number>(1);
  const [zoomTransform, setZoomTransform] = useState<{ x: number; y: number; k: number }>({ x: 0, y: 0, k: 1 });
  const [lastPingTime, setLastPingTime] = useState<string>('0.4s ago');
  const [isPinging, setIsPinging] = useState<boolean>(false);

  // Filter nodes based on selected protocol and region
  const filteredNodes = useMemo(() => {
    return nodes.filter(n => {
      const matchProtocol = activeProtocolFilter === 'ALL' || n.protocol === activeProtocolFilter;
      const matchRegion = activeRegionFilter === 'ALL' || n.regionCode === activeRegionFilter;
      return matchProtocol && matchRegion;
    });
  }, [nodes, activeProtocolFilter, activeRegionFilter]);

  // Handle Map Rendering with D3.js
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 880;
    const height = Math.max(380, Math.floor(width * 0.48));

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    svg.attr('viewBox', `0 0 ${width} ${height}`);

    // D3 Projection: Natural Earth 1 for balanced global presentation
    const projection = d3
      .geoNaturalEarth1()
      .scale(width / 5.4)
      .translate([width / 2, height / 1.85]);

    const pathGenerator = d3.geoPath().projection(projection);

    // Zoom behavior
    const g = svg.append('g').attr('class', 'map-viewport');

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.8, 5])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
        setZoomTransform(event.transform);
        setZoomK(event.transform.k);
      });

    svg.call(zoom);

    // 1. Defs & Glow Filters
    const defs = svg.append('defs');

    // Radar Glow Filter
    const filter = defs.append('filter').attr('id', 'glow').attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%');
    filter.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'coloredBlur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Linear Gradients for Transit Arcs
    const arcGradient = defs.append('linearGradient').attr('id', 'arcGrad').attr('gradientUnits', 'userSpaceOnUse');
    arcGradient.append('stop').attr('offset', '0%').attr('stop-color', '#06b6d4').attr('stop-opacity', '0.8');
    arcGradient.append('stop').attr('offset', '50%').attr('stop-color', '#10b981').attr('stop-opacity', '0.9');
    arcGradient.append('stop').attr('offset', '100%').attr('stop-color', '#f59e0b').attr('stop-opacity', '0.8');

    // 2. Graticules (Latitude & Longitude Grid Lines)
    const graticule = d3.geoGraticule10();

    g.append('path')
      .datum(graticule)
      .attr('class', 'graticule')
      .attr('d', pathGenerator)
      .attr('fill', 'none')
      .attr('stroke', '#0F1E33')
      .attr('stroke-width', 0.5)
      .attr('stroke-dasharray', '2,3');

    // 3. World Landmass Continents
    g.append('g')
      .attr('class', 'continents-layer')
      .selectAll('path')
      .data(WORLD_CONTINENTS_GEOJSON.features)
      .enter()
      .append('path')
      .attr('d', pathGenerator)
      .attr('fill', '#07101E')
      .attr('stroke', '#1E3A5F')
      .attr('stroke-width', 1)
      .attr('opacity', 0.85);

    // 4. Inter-Node Settlement Arcs (Great Circles / Curved Bezier Bridges)
    const linksGroup = g.append('g').attr('class', 'links-layer');

    INTER_NODE_LINKS.forEach(link => {
      const source = nodes.find(n => n.id === link.sourceId);
      const target = nodes.find(n => n.id === link.targetId);

      if (source && target) {
        const sourcePt = projection([source.longitude, source.latitude]);
        const targetPt = projection([target.longitude, target.latitude]);

        if (sourcePt && targetPt) {
          // Calculate curved control point
          const dx = targetPt[0] - sourcePt[0];
          const dy = targetPt[1] - sourcePt[1];
          const dr = Math.sqrt(dx * dx + dy * dy);
          const midX = (sourcePt[0] + targetPt[0]) / 2;
          const midY = (sourcePt[1] + targetPt[1]) / 2 - Math.min(60, dr * 0.25);

          const arcPath = `M${sourcePt[0]},${sourcePt[1]} Q${midX},${midY} ${targetPt[0]},${targetPt[1]}`;

          // Background static arc
          linksGroup.append('path')
            .attr('d', arcPath)
            .attr('fill', 'none')
            .attr('stroke', '#0A2540')
            .attr('stroke-width', 1.2)
            .attr('stroke-dasharray', '3,4');

          // Active glowing animated transit line
          linksGroup.append('path')
            .attr('d', arcPath)
            .attr('fill', 'none')
            .attr('stroke', 'url(#arcGrad)')
            .attr('stroke-width', 1.5)
            .attr('stroke-dasharray', '6,14')
            .attr('opacity', 0.75)
            .append('animate')
            .attr('attributeName', 'stroke-dashoffset')
            .attr('from', '40')
            .attr('to', '0')
            .attr('dur', `${2.5 + (dr % 3)}s`)
            .attr('repeatCount', 'indefinite');
        }
      }
    });

    // 5. Node Pins & Radar Rings
    const nodesGroup = g.append('g').attr('class', 'nodes-layer');

    filteredNodes.forEach(node => {
      const coords = projection([node.longitude, node.latitude]);
      if (!coords) return;

      const [cx, cy] = coords;
      const isSelected = selectedNodeId === node.id;

      const nodeG = nodesGroup
        .append('g')
        .attr('class', 'node-marker')
        .attr('transform', `translate(${cx}, ${cy})`)
        .style('cursor', 'pointer');

      // Status colors
      const color =
        node.protocol === 'Federal Asynchronous DAG'
          ? '#818cf8' // DoD Federal DAG Indigo
          : node.status === 'SYNCHRONIZED'
          ? '#10b981' // emerald
          : node.status === 'CLEARING'
          ? '#06b6d4' // cyan
          : '#f59e0b'; // amber

      // Animated pulsing radar ripple
      nodeG.append('circle')
        .attr('r', isSelected ? 14 : 9)
        .attr('fill', 'none')
        .attr('stroke', color)
        .attr('stroke-width', 1)
        .attr('opacity', 0.8)
        .append('animate')
        .attr('attributeName', 'r')
        .attr('values', `${isSelected ? 10 : 6};${isSelected ? 24 : 18}`)
        .attr('dur', '2s')
        .attr('repeatCount', 'indefinite');

      nodeG.append('circle')
        .attr('r', isSelected ? 14 : 9)
        .attr('fill', 'none')
        .attr('stroke', color)
        .attr('stroke-width', 1)
        .attr('opacity', 0.8)
        .append('animate')
        .attr('attributeName', 'opacity')
        .attr('values', '0.8;0')
        .attr('dur', '2s')
        .attr('repeatCount', 'indefinite');

      // Outer Halo
      nodeG.append('circle')
        .attr('r', isSelected ? 8 : 5.5)
        .attr('fill', `${color}33`)
        .attr('stroke', color)
        .attr('stroke-width', isSelected ? 2 : 1.2)
        .attr('filter', 'url(#glow)');

      // Center Core
      nodeG.append('circle')
        .attr('r', isSelected ? 4.5 : 3)
        .attr('fill', '#ffffff')
        .attr('stroke', color)
        .attr('stroke-width', 1);

      // Node Label
      nodeG.append('text')
        .attr('x', 9)
        .attr('y', 3.5)
        .attr('fill', isSelected ? '#38bdf8' : '#e2e8f0')
        .attr('font-size', isSelected ? '10px' : '8.5px')
        .attr('font-weight', isSelected ? 'bold' : 'normal')
        .attr('font-family', 'ui-monospace, monospace')
        .attr('filter', 'drop-shadow(0 1px 2px rgba(0,0,0,0.9))')
        .text(node.name.split(' ')[0] + ' ' + (node.name.split(' ')[1] || ''));

      // Interactivity
      nodeG.on('mouseenter', () => {
        setHoveredNode(node);
      });

      nodeG.on('mouseleave', () => {
        setHoveredNode(null);
      });

      nodeG.on('click', () => {
        if (onSelectNode) onSelectNode(node);
        if (onNotify) onNotify(`Inspecting Federal Node: ${node.name} (${node.latencyMs}ms)`, 'INFO');
      });
    });

  }, [filteredNodes, selectedNodeId, onSelectNode, onNotify]);

  const handleSimulatePing = () => {
    setIsPinging(true);
    setLastPingTime('Pinging now...');
    if (onNotify) onNotify('⚡ Broadcasting ICMP & TLS handshake to all 10 Federal Nodes...', 'INFO');

    setTimeout(() => {
      setIsPinging(false);
      setLastPingTime('Just now (100% reachable)');
      if (onNotify) onNotify('✅ All Federal Nodes verified reachable. Global latency: 22.8ms avg.', 'SUCCESS');
    }, 900);
  };

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];

  return (
    <div className="bg-[#030508] border border-cyan-500/30 rounded-xl overflow-hidden shadow-2xl space-y-3 font-mono text-xs">
      {/* MAP HEADER HUD */}
      <div className="p-3.5 bg-gradient-to-r from-[#030508] via-[#081524] to-[#040E1B] border-b border-cyan-500/20 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shadow-md">
            <Globe className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-xs font-sans tracking-wide">
                GLOBAL FEDERAL CRYPTO NODES TOPOLOGY
              </span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                D3.JS CARTOGRAPHIC ENGINE
              </span>
            </div>
            <span className="text-[10px] text-slate-400 block">
              12 Global Verification Anchors (incl. DoD Federal DAG Full Nodes) &middot; RTGS Inter-Bank Arcs
            </span>
          </div>
        </div>

        {/* Map Tool Controls */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={handleSimulatePing}
            disabled={isPinging}
            className="px-2.5 py-1 rounded bg-cyan-600/30 hover:bg-cyan-600 text-cyan-200 hover:text-slate-950 border border-cyan-500/40 font-bold text-[10px] flex items-center gap-1 cursor-pointer transition-all disabled:opacity-50"
          >
            <Activity className={`w-3 h-3 ${isPinging ? 'animate-spin' : ''}`} />
            <span>{isPinging ? 'Pinging...' : 'Global Ping Test'}</span>
          </button>

          <div className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-400">
            Ping: <span className="text-emerald-400 font-bold">{lastPingTime}</span>
          </div>
        </div>
      </div>

      {/* FILTER & STATS BAR */}
      <div className="px-4 py-2 bg-[#060C14] border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[10px]">
        {/* Protocol Filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-slate-400 font-bold">Protocol:</span>
          {(['ALL', 'Federal Asynchronous DAG', 'XRPL dUNL', 'FedNow Interconnect', 'Circle CCTP', 'DTCC Composite', 'TSL Anchor'] as const).map(p => (
            <button
              key={p}
              onClick={() => setActiveProtocolFilter(p)}
              className={`px-2 py-0.5 rounded font-bold cursor-pointer transition-colors ${
                activeProtocolFilter === p
                  ? p === 'Federal Asynchronous DAG'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-cyan-600 text-white shadow-xs'
                  : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Region Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 font-bold">Region:</span>
          {(['ALL', 'US-EAST', 'US-WEST', 'EU-WEST', 'EU-CENTRAL', 'APAC-SE', 'APAC-EAST'] as const).map(r => (
            <button
              key={r}
              onClick={() => setActiveRegionFilter(r)}
              className={`px-1.5 py-0.5 rounded font-mono text-[9px] cursor-pointer transition-colors ${
                activeRegionFilter === r
                  ? 'bg-amber-600 text-white font-bold'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* D3 MAP CANVAS */}
      <div ref={containerRef} className="relative w-full overflow-hidden bg-[#02050B]">
        <svg
          ref={svgRef}
          className="w-full h-auto block select-none"
          style={{ minHeight: '380px', maxHeight: '520px' }}
        />

        {/* Map Legend Overlay */}
        <div className="absolute bottom-3 left-3 bg-slate-950/90 border border-slate-800 rounded-lg p-2 space-y-1 text-[9px] backdrop-blur-xs shadow-lg">
          <div className="font-bold text-slate-300 uppercase pb-0.5 border-b border-slate-850">
            Node Status &amp; Arcs
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300">SYNCHRONIZED (99.99%+)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="text-slate-300">CLEARING (FedNow/RTGS)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-slate-300">ATTESTING (Circle CCTP)</span>
          </div>
          <div className="flex items-center gap-1.5 pt-0.5 text-slate-500">
            <span className="w-4 h-0.5 bg-gradient-to-r from-cyan-500 via-emerald-500 to-amber-500" />
            <span>Inter-Node Transit Arcs</span>
          </div>
        </div>

        {/* Dynamic Tooltip on Node Hover */}
        {hoveredNode && (
          <div className="absolute top-3 right-3 bg-slate-950/95 border border-cyan-500/50 rounded-lg p-3 text-[10px] space-y-1.5 max-w-xs shadow-xl backdrop-blur-md pointer-events-none animate-fadeIn">
            <div className="flex items-center justify-between gap-2 border-b border-slate-850 pb-1">
              <span className="font-bold text-white text-xs">{hoveredNode.name}</span>
              <span className={`px-1.5 py-0.2 rounded text-[8px] font-black ${
                hoveredNode.status === 'SYNCHRONIZED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-cyan-500/20 text-cyan-300'
              }`}>
                {hoveredNode.status}
              </span>
            </div>
            <div className="text-slate-400">{hoveredNode.physicalLocation}</div>
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-900 font-mono">
              <div>
                <span className="text-slate-500 block">Latency:</span>
                <span className="text-emerald-400 font-bold">{hoveredNode.latencyMs} ms</span>
              </div>
              <div>
                <span className="text-slate-500 block">24h Settled:</span>
                <span className="text-amber-300 font-bold">${(hoveredNode.settled24hUsd / 1000000).toFixed(1)}M</span>
              </div>
            </div>
            <div className="text-[9px] text-cyan-300 font-mono truncate">
              {hoveredNode.regulatoryCharter}
            </div>
          </div>
        )}
      </div>

      {/* SELECTED NODE INSPECTOR CARD */}
      {selectedNode && (
        <div className="p-3.5 mx-4 mb-3 bg-[#060C14] border border-cyan-500/40 rounded-xl space-y-2">
          <div className="flex items-start justify-between flex-wrap gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-cyan-300 font-bold">{selectedNode.id}</span>
                <h4 className="font-bold text-white text-xs">{selectedNode.name}</h4>
                <span className="px-1.5 py-0.2 rounded text-[8px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  {selectedNode.protocol}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                {selectedNode.operator} &middot; {selectedNode.physicalLocation} ({selectedNode.latitude.toFixed(4)}&deg;N, {selectedNode.longitude.toFixed(4)}&deg;E)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded font-black text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                {selectedNode.uptimePct}% UPTIME
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(selectedNode.validatorPublicKey);
                  if (onNotify) onNotify(`Copied Validator Public Key for ${selectedNode.id}!`, 'SUCCESS');
                }}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold border border-slate-700 flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3 h-3" />
                <span>Copy PubKey</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-950 p-2 rounded-lg text-center text-[10px]">
            <div>
              <span className="text-slate-500 block">Latency</span>
              <span className="font-bold text-emerald-400 font-mono">{selectedNode.latencyMs} ms</span>
            </div>
            <div>
              <span className="text-slate-500 block">Consensus Vote</span>
              <span className="font-bold text-cyan-300 font-mono">{selectedNode.consensusVoteWeightPct}%</span>
            </div>
            <div>
              <span className="text-slate-500 block">24h Settled Vol</span>
              <span className="font-bold text-amber-300 font-mono">${(selectedNode.settled24hUsd / 1000000).toFixed(1)}M USD</span>
            </div>
            <div>
              <span className="text-slate-500 block">Masked IP</span>
              <span className="font-mono text-slate-300">{selectedNode.ipMasked}</span>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-850">
            <span>Charter: <b className="text-amber-300 font-mono">{selectedNode.regulatoryCharter}</b></span>
            <span>Jurisdiction: <b className="text-slate-300">{selectedNode.jurisdiction}</b></span>
          </div>
        </div>
      )}
    </div>
  );
};
