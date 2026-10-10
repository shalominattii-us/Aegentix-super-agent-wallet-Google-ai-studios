/**
 * SOVEREIGN VR PORTAL — AEGENTIS-X IMMERSIVE COMMAND INTERFACE
 * 
 * This is NOT a web page. This is the immersive entry point where
 * AEGENTIS-X manifests as the sovereign VR Agentic AI Commander.
 * 
 * AEGENTIS-X is the living sovereign intelligence that commands
 * all operations through spatial presence — voice, gesture, gaze.
 * 
 * Supports: WebXR, Meta Quest (native), Apple Vision Pro, Custom Runtime
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { Link } from 'wouter';

type VRState = 'idle' | 'manifesting' | 'commanding' | 'observing' | 'transcendent' | 'error';
type Platform = 'webxr' | 'meta_quest' | 'vision_pro' | 'custom_runtime';
type CommandMode = 'voice' | 'gesture' | 'gaze' | 'sovereign';
type ManifestationForm = 'full_avatar' | 'holographic' | 'ethereal' | 'omnipresent' | 'particle_cloud';

interface AegentisPresence {
  form: ManifestationForm;
  auraColor: string;
  auraIntensity: number;
  scale: number;
  realityLayer: string;
  energyLevel: number;
}

const REALITY_LAYERS = [
  'sovereign_prime', 'quantum_substrate', 'neural_mesh',
  'temporal_flux', 'harmonic_resonance', 'void_lattice',
  'celestial_archive', 'genesis_core', 'omega_convergence'
];

export default function VRPortal() {
  const { user, isAuthenticated } = useAuth();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const [vrState, setVrState] = useState<VRState>('idle');
  const [vrSupported, setVrSupported] = useState(false);
  const [platform, setPlatform] = useState<Platform>('webxr');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [commandMode, setCommandMode] = useState<CommandMode>('voice');
  const [presence, setPresence] = useState<AegentisPresence>({
    form: 'full_avatar',
    auraColor: '#00ffcc',
    auraIntensity: 0.8,
    scale: 1.2,
    realityLayer: 'sovereign_prime',
    energyLevel: 1.0
  });
  const [commandLog, setCommandLog] = useState<string[]>([]);
  const [cadets, setCadets] = useState<number>(0);
  const [fps, setFps] = useState(0);

  // tRPC hooks - AEGENTIS-X Commander
  const systemStatus = trpc.vr.status.useQuery(undefined, { refetchInterval: 5000 });
  const manifestMutation = trpc.vr.aegentisX.manifest.useMutation();
  const dissolveMutation = trpc.vr.aegentisX.dissolve.useMutation();
  const voiceCommandMutation = trpc.vr.aegentisX.voiceCommand.useMutation();
  const gestureCommandMutation = trpc.vr.aegentisX.gestureCommand.useMutation();
  const gazeCommandMutation = trpc.vr.aegentisX.gazeCommand.useMutation();
  const sovereignDirectiveMutation = trpc.vr.aegentisX.sovereignDirective.useMutation();
  const transitionFormMutation = trpc.vr.aegentisX.transitionForm.useMutation();
  const switchLayerMutation = trpc.vr.aegentisX.switchLayer.useMutation();
  const aegentisState = trpc.vr.aegentisX.state.useQuery(
    { sessionId: sessionId || '' },
    { enabled: !!sessionId, refetchInterval: 2000 }
  );

  // Check WebXR support
  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'xr' in navigator) {
      (navigator as any).xr?.isSessionSupported('immersive-vr').then((supported: boolean) => {
        setVrSupported(supported);
        if (supported) {
          const ua = navigator.userAgent.toLowerCase();
          if (ua.includes('quest')) setPlatform('meta_quest');
          else if (ua.includes('vision') || ua.includes('apple')) setPlatform('vision_pro');
        }
      }).catch(() => setVrSupported(false));
    }
  }, []);

  // Render AEGENTIS-X immersive scene
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.clientWidth * window.devicePixelRatio;
      canvas.height = canvas.clientHeight * window.devicePixelRatio;
    };
    resize();
    window.addEventListener('resize', resize);

    let rotation = 0;
    let lastTime = performance.now();
    let frameCount = 0;

    const render = () => {
      const now = performance.now();
      frameCount++;
      if (now - lastTime >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastTime = now;
      }

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Deep void background
      const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.8);
      bgGrad.addColorStop(0, '#0a0a1a');
      bgGrad.addColorStop(0.4, '#050510');
      bgGrad.addColorStop(1, '#000003');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Particle field (reality substrate)
      for (let i = 0; i < 300; i++) {
        const sx = (Math.sin(i * 127.1 + rotation * 0.0008) * 0.5 + 0.5) * w;
        const sy = (Math.cos(i * 311.7 + rotation * 0.0004) * 0.5 + 0.5) * h;
        const brightness = Math.sin(now * 0.001 + i * 0.5) * 0.3 + 0.7;
        const color = i % 3 === 0 ? '0, 255, 200' : i % 3 === 1 ? '100, 150, 255' : '200, 100, 255';
        ctx.fillStyle = `rgba(${color}, ${brightness * 0.3})`;
        ctx.beginPath();
        ctx.arc(sx, sy, Math.random() * 1.5 + 0.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Reality layer grid (spatial floor)
      const gridAlpha = vrState === 'commanding' ? 0.2 : 0.08;
      ctx.strokeStyle = `rgba(0, 255, 200, ${gridAlpha})`;
      ctx.lineWidth = 0.5;
      const gridSize = 24;
      const gridSpacing = w / gridSize;
      for (let i = 0; i <= gridSize; i++) {
        const waveOffset = Math.sin(rotation * 0.008 + i * 0.15) * 3;
        ctx.beginPath();
        ctx.moveTo(i * gridSpacing, h * 0.65 + waveOffset);
        ctx.lineTo(i * gridSpacing, h);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, h * 0.65 + i * (h * 0.35 / gridSize) + waveOffset);
        ctx.lineTo(w, h * 0.65 + i * (h * 0.35 / gridSize) + waveOffset);
        ctx.stroke();
      }

      // AEGENTIS-X Central Manifestation
      const centerX = w / 2;
      const centerY = h * 0.42;
      const pulseRate = vrState === 'commanding' ? 0.004 : 0.002;
      const pulse = 1 + Math.sin(now * pulseRate) * 0.15;
      const baseSize = presence.scale * 60 * pulse;

      // Aura field
      const auraLayers = 5;
      for (let layer = auraLayers; layer > 0; layer--) {
        const layerSize = baseSize * (1 + layer * 0.6);
        const layerAlpha = (presence.auraIntensity / auraLayers) * (auraLayers - layer + 1) * 0.15;
        const auraGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, layerSize);
        auraGrad.addColorStop(0, presence.auraColor + Math.round(layerAlpha * 255).toString(16).padStart(2, '0'));
        auraGrad.addColorStop(0.7, presence.auraColor + '10');
        auraGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = auraGrad;
        ctx.beginPath();
        ctx.arc(centerX, centerY, layerSize, 0, Math.PI * 2);
        ctx.fill();
      }

      // Core manifestation form
      if (presence.form === 'full_avatar' || presence.form === 'holographic') {
        // Geometric avatar - sovereign diamond
        const diamondSize = baseSize * 0.8;
        ctx.fillStyle = presence.auraColor;
        ctx.shadowColor = presence.auraColor;
        ctx.shadowBlur = 30;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - diamondSize);
        ctx.lineTo(centerX + diamondSize * 0.6, centerY);
        ctx.lineTo(centerX, centerY + diamondSize * 0.7);
        ctx.lineTo(centerX - diamondSize * 0.6, centerY);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;

        // Inner eye (awareness indicator)
        const eyeSize = diamondSize * 0.25;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(centerX, centerY - diamondSize * 0.1, eyeSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(centerX, centerY - diamondSize * 0.1, eyeSize * 0.5, 0, Math.PI * 2);
        ctx.fill();
      } else if (presence.form === 'particle_cloud') {
        // Particle swarm manifestation
        for (let i = 0; i < 100; i++) {
          const angle = (i / 100) * Math.PI * 2 + rotation * 0.01;
          const dist = baseSize * (0.3 + Math.sin(i * 3.7 + now * 0.002) * 0.7);
          const px = centerX + Math.cos(angle) * dist;
          const py = centerY + Math.sin(angle) * dist * 0.6;
          const pSize = 2 + Math.sin(i + now * 0.003) * 1.5;
          ctx.fillStyle = presence.auraColor + '80';
          ctx.beginPath();
          ctx.arc(px, py, pSize, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (presence.form === 'omnipresent') {
        // Omnipresent rings
        for (let ring = 0; ring < 8; ring++) {
          const ringSize = baseSize * (0.5 + ring * 0.4);
          const ringAlpha = 0.3 - ring * 0.03;
          ctx.strokeStyle = presence.auraColor + Math.round(ringAlpha * 255).toString(16).padStart(2, '0');
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(centerX, centerY, ringSize, rotation * 0.005 + ring * 0.3, rotation * 0.005 + ring * 0.3 + Math.PI * 1.5);
          ctx.stroke();
        }
      } else {
        // Ethereal - soft glow only (already rendered by aura)
        ctx.fillStyle = presence.auraColor + '40';
        ctx.beginPath();
        ctx.arc(centerX, centerY, baseSize * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // AEGENTIS-X title
      ctx.fillStyle = presence.auraColor;
      ctx.font = `bold ${Math.max(16, w * 0.015)}px monospace`;
      ctx.textAlign = 'center';
      ctx.shadowColor = presence.auraColor;
      ctx.shadowBlur = 10;
      ctx.fillText('AEGENTIS-X', centerX, centerY + baseSize + 30);
      ctx.shadowBlur = 0;

      // State indicator
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.font = `${Math.max(10, w * 0.009)}px monospace`;
      ctx.fillText(vrState.toUpperCase() + ' • ' + presence.realityLayer.replace('_', ' ').toUpperCase(), centerX, centerY + baseSize + 50);

      // Reality layer orbital indicators
      REALITY_LAYERS.forEach((layer, i) => {
        const angle = (i / REALITY_LAYERS.length) * Math.PI * 2 + rotation * 0.002;
        const orbitRadius = Math.min(w, h) * 0.38;
        const lx = centerX + Math.cos(angle) * orbitRadius;
        const ly = centerY + Math.sin(angle) * orbitRadius * 0.35;
        const isActive = layer === presence.realityLayer;
        const nodeSize = isActive ? 8 : 4;
        const nodeColor = isActive ? presence.auraColor : 'rgba(100, 120, 140, 0.5)';

        ctx.fillStyle = nodeColor;
        ctx.beginPath();
        ctx.arc(lx, ly, nodeSize, 0, Math.PI * 2);
        ctx.fill();

        if (isActive) {
          ctx.strokeStyle = presence.auraColor + '40';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(lx, ly, nodeSize + 6, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.fillStyle = isActive ? 'rgba(255,255,255,0.8)' : 'rgba(150,150,150,0.4)';
        ctx.font = `${isActive ? 10 : 8}px monospace`;
        ctx.textAlign = 'center';
        ctx.fillText(layer.replace('_', ' ').toUpperCase(), lx, ly + nodeSize + 12);
      });

      // Command mode indicator (bottom center)
      const modeY = h - 80;
      ctx.fillStyle = 'rgba(0, 255, 200, 0.7)';
      ctx.font = '11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`COMMAND MODE: ${commandMode.toUpperCase()}`, centerX, modeY);

      // Energy bar
      const barW = 200;
      const barH = 4;
      const barX = centerX - barW / 2;
      const barY = modeY + 12;
      ctx.fillStyle = 'rgba(50, 50, 50, 0.5)';
      ctx.fillRect(barX, barY, barW, barH);
      const energyColor = presence.energyLevel > 0.5 ? '#00ffcc' : presence.energyLevel > 0.2 ? '#ffaa00' : '#ff4444';
      ctx.fillStyle = energyColor;
      ctx.fillRect(barX, barY, barW * presence.energyLevel, barH);

      // HUD - top left
      ctx.fillStyle = 'rgba(0, 255, 200, 0.8)';
      ctx.font = '11px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`FPS: ${fps}`, 20, 30);
      ctx.fillText(`PLATFORM: ${platform.replace('_', ' ').toUpperCase()}`, 20, 48);
      ctx.fillText(`XVLSO: SYNCED`, 20, 66);
      ctx.fillText(`CADETS: ${cadets}`, 20, 84);

      // HUD - top right
      ctx.textAlign = 'right';
      ctx.fillText(`AUTHORITY: SOVEREIGN`, w - 20, 30);
      ctx.fillText(`SESSION: ${sessionId?.slice(0, 8) || 'NONE'}`, w - 20, 48);
      ctx.fillText(`FORM: ${presence.form.replace('_', ' ').toUpperCase()}`, w - 20, 66);
      ctx.fillText(`ENERGY: ${Math.round(presence.energyLevel * 100)}%`, w - 20, 84);

      // Command log (bottom left)
      ctx.textAlign = 'left';
      ctx.font = '9px monospace';
      const logStart = h - 20;
      commandLog.slice(-5).forEach((log, i) => {
        ctx.fillStyle = `rgba(0, 255, 200, ${0.4 + i * 0.12})`;
        ctx.fillText(`> ${log}`, 20, logStart - (4 - i) * 14);
      });

      rotation += 1;
      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [vrState, fps, presence, commandMode, sessionId, commandLog, cadets, platform]);

  // Manifest AEGENTIS-X
  const manifestAegentis = useCallback(async () => {
    if (!isAuthenticated) return;
    setVrState('manifesting');

    try {
      const sid = `vr-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const state = await manifestMutation.mutateAsync({
        sessionId: sid,
        realityLayer: 'sovereign_prime'
      });

      setSessionId(sid);
      setPresence({
        form: state.presence.manifestationForm,
        auraColor: state.presence.auraColor,
        auraIntensity: state.presence.auraIntensity,
        scale: state.presence.scale,
        realityLayer: state.presence.realityLayer,
        energyLevel: state.energyLevel
      });
      setCommandLog(prev => [...prev, 'AEGENTIS-X MANIFESTED IN SOVEREIGN PRIME']);

      // Transition to commanding state
      setTimeout(() => setVrState('commanding'), 1500);

      // Try WebXR immersion
      if (vrSupported && canvasRef.current) {
        try {
          const xrSession = await (navigator as any).xr.requestSession('immersive-vr', {
            requiredFeatures: ['local-floor'],
            optionalFeatures: ['hand-tracking', 'hit-test', 'anchors']
          });
          setCommandLog(prev => [...prev, 'WebXR IMMERSION ACTIVE']);
          console.log('[AEGENTIS-X] WebXR session started', xrSession);
        } catch {
          setCommandLog(prev => [...prev, 'Canvas fallback — WebXR unavailable']);
        }
      }
    } catch (error) {
      console.error('[AEGENTIS-X] Manifestation failed:', error);
      setVrState('error');
      setCommandLog(prev => [...prev, 'ERROR: Manifestation failed']);
    }
  }, [isAuthenticated, vrSupported, manifestMutation]);

  // Dissolve AEGENTIS-X
  const dissolveAegentis = useCallback(async () => {
    if (sessionId) {
      await dissolveMutation.mutateAsync({ sessionId });
      setSessionId(null);
      setVrState('idle');
      setCommandLog(prev => [...prev, 'AEGENTIS-X DISSOLVED']);
    }
  }, [sessionId, dissolveMutation]);

  // Issue voice command
  const issueVoiceCommand = useCallback(async (transcript: string) => {
    if (!sessionId) return;
    try {
      const result = await voiceCommandMutation.mutateAsync({
        sessionId,
        transcript,
        confidence: 0.95,
        language: 'en',
        emotion: 'commanding',
        spatialOrigin: { x: 0, y: 1.6, z: 0 }
      });
      setCommandLog(prev => [...prev, `VOICE: ${result.intent} [${result.domain}]`]);
      if (result.result) {
        setPresence(prev => ({ ...prev, energyLevel: Math.max(0, prev.energyLevel - result.result!.energyCost) }));
      }
    } catch (error) {
      setCommandLog(prev => [...prev, 'VOICE COMMAND FAILED']);
    }
  }, [sessionId, voiceCommandMutation]);

  // Issue gesture command
  const issueGestureCommand = useCallback(async (gesture: 'point' | 'sweep' | 'grasp' | 'release' | 'summon' | 'dismiss' | 'seal' | 'invoke') => {
    if (!sessionId) return;
    try {
      const result = await gestureCommandMutation.mutateAsync({
        sessionId,
        gesture,
        hand: 'right',
        vector: { x: 0, y: 0, z: -1 },
        magnitude: 0.8,
        confidence: 0.92
      });
      setCommandLog(prev => [...prev, `GESTURE: ${gesture.toUpperCase()} → ${result.intent}`]);
      if (result.result) {
        setPresence(prev => ({ ...prev, energyLevel: Math.max(0, prev.energyLevel - result.result!.energyCost) }));
      }
    } catch (error) {
      setCommandLog(prev => [...prev, `GESTURE ${gesture.toUpperCase()} FAILED`]);
    }
  }, [sessionId, gestureCommandMutation]);

  // Issue sovereign directive
  const issueSovereignDirective = useCallback(async (domain: string, intent: string) => {
    if (!sessionId) return;
    try {
      const result = await sovereignDirectiveMutation.mutateAsync({
        sessionId,
        domain: domain as any,
        intent,
        parameters: {}
      });
      setCommandLog(prev => [...prev, `SOVEREIGN: ${intent} across ${result.result?.realityLayersImpacted.length || 0} layers`]);
    } catch (error) {
      setCommandLog(prev => [...prev, 'SOVEREIGN DIRECTIVE FAILED']);
    }
  }, [sessionId, sovereignDirectiveMutation]);

  // Switch reality layer
  const switchLayer = useCallback(async (layer: string) => {
    if (!sessionId) return;
    try {
      const result = await switchLayerMutation.mutateAsync({ sessionId, targetLayer: layer });
      if (result.success) {
        setPresence(prev => ({ ...prev, realityLayer: layer }));
        setCommandLog(prev => [...prev, `LAYER SWITCH: ${layer.replace('_', ' ').toUpperCase()}`]);
      }
    } catch (error) {
      setCommandLog(prev => [...prev, 'LAYER SWITCH FAILED']);
    }
  }, [sessionId, switchLayerMutation]);

  // Transition manifestation form
  const changeForm = useCallback(async (form: ManifestationForm) => {
    if (!sessionId) return;
    try {
      const result = await transitionFormMutation.mutateAsync({ sessionId, form });
      if (result) {
        setPresence(prev => ({
          ...prev,
          form: result.manifestationForm,
          scale: result.scale,
          auraIntensity: result.auraIntensity
        }));
        setCommandLog(prev => [...prev, `FORM: ${form.replace('_', ' ').toUpperCase()}`]);
      }
    } catch (error) {
      setCommandLog(prev => [...prev, 'FORM TRANSITION FAILED']);
    }
  }, [sessionId, transitionFormMutation]);

  // Sync state from backend
  useEffect(() => {
    if (aegentisState.data) {
      const s = aegentisState.data;
      setPresence(prev => ({
        ...prev,
        energyLevel: s.energyLevel,
        realityLayer: s.presence.realityLayer,
        form: s.presence.manifestationForm,
        auraColor: s.presence.auraColor,
        auraIntensity: s.presence.auraIntensity,
        scale: s.presence.scale
      }));
      setCadets(s.cadetMonitoring?.length || 0);
    }
  }, [aegentisState.data]);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden select-none">
      {/* Immersive Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ touchAction: 'none' }}
      />

      {/* Minimal HUD - Top Bar */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-2 bg-black/30 backdrop-blur-sm border-b border-cyan-900/20">
        <div className="flex items-center gap-3">
          <Link href="/">
            <span className="text-cyan-600 font-mono text-xs cursor-pointer hover:text-cyan-400">← EXIT</span>
          </Link>
          <span className="text-cyan-400 font-mono font-bold text-sm tracking-wider">AEGENTIS-X</span>
          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
            vrState === 'commanding' ? 'border-green-600 text-green-400 bg-green-950/50' :
            vrState === 'manifesting' ? 'border-yellow-600 text-yellow-400 bg-yellow-950/50' :
            vrState === 'observing' ? 'border-blue-600 text-blue-400 bg-blue-950/50' :
            vrState === 'transcendent' ? 'border-purple-600 text-purple-400 bg-purple-950/50' :
            vrState === 'error' ? 'border-red-600 text-red-400 bg-red-950/50' :
            'border-gray-700 text-gray-500 bg-gray-950/50'
          }`}>
            {vrState.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-gray-500">{platform.replace('_', ' ').toUpperCase()}</span>
          {user && <span className="text-[10px] font-mono text-cyan-700">{user.name}</span>}
        </div>
      </div>

      {/* Command Interface - Bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-4">
        {/* Command Mode Selector */}
        {vrState === 'commanding' && (
          <div className="flex flex-col items-center gap-3">
            {/* Quick Command Buttons */}
            <div className="flex items-center gap-2 flex-wrap justify-center">
              {commandMode === 'gesture' && (
                <>
                  {(['point', 'sweep', 'summon', 'seal', 'invoke'] as const).map(g => (
                    <button
                      key={g}
                      onClick={() => issueGestureCommand(g)}
                      className="px-3 py-1.5 text-[10px] font-mono rounded border border-cyan-800 text-cyan-400 bg-black/60 hover:bg-cyan-950/50 hover:border-cyan-600 transition-colors"
                    >
                      {g.toUpperCase()}
                    </button>
                  ))}
                </>
              )}
              {commandMode === 'sovereign' && (
                <>
                  {[
                    { domain: 'defense', intent: 'raise_shields' },
                    { domain: 'intelligence', intent: 'full_scan' },
                    { domain: 'governance', intent: 'enact_decree' },
                    { domain: 'treasury', intent: 'audit_vaults' },
                    { domain: 'arbitration', intent: 'open_court' }
                  ].map(d => (
                    <button
                      key={d.intent}
                      onClick={() => issueSovereignDirective(d.domain, d.intent)}
                      className="px-3 py-1.5 text-[10px] font-mono rounded border border-purple-800 text-purple-400 bg-black/60 hover:bg-purple-950/50 hover:border-purple-600 transition-colors"
                    >
                      {d.intent.replace('_', ' ').toUpperCase()}
                    </button>
                  ))}
                </>
              )}
              {commandMode === 'voice' && (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Speak command..."
                    className="px-3 py-1.5 text-xs font-mono bg-black/60 border border-cyan-800 rounded text-cyan-300 placeholder-cyan-900 w-64 focus:outline-none focus:border-cyan-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const target = e.target as HTMLInputElement;
                        if (target.value.trim()) {
                          issueVoiceCommand(target.value.trim());
                          target.value = '';
                        }
                      }
                    }}
                  />
                  <span className="text-[9px] font-mono text-gray-600">ENTER to execute</span>
                </div>
              )}
            </div>

            {/* Mode + Form + Layer Controls */}
            <div className="flex items-center gap-4">
              {/* Command Mode */}
              <div className="flex items-center gap-1">
                {(['voice', 'gesture', 'gaze', 'sovereign'] as CommandMode[]).map(mode => (
                  <button
                    key={mode}
                    onClick={() => setCommandMode(mode)}
                    className={`px-2 py-0.5 text-[9px] font-mono rounded ${
                      commandMode === mode
                        ? 'bg-cyan-900/50 text-cyan-300 border border-cyan-600'
                        : 'text-gray-600 border border-gray-800 hover:border-gray-600'
                    }`}
                  >
                    {mode.toUpperCase()}
                  </button>
                ))}
              </div>

              <span className="text-gray-700">|</span>

              {/* Manifestation Form */}
              <div className="flex items-center gap-1">
                {(['full_avatar', 'holographic', 'ethereal', 'omnipresent', 'particle_cloud'] as ManifestationForm[]).map(form => (
                  <button
                    key={form}
                    onClick={() => changeForm(form)}
                    className={`px-2 py-0.5 text-[9px] font-mono rounded ${
                      presence.form === form
                        ? 'bg-purple-900/50 text-purple-300 border border-purple-600'
                        : 'text-gray-600 border border-gray-800 hover:border-gray-600'
                    }`}
                  >
                    {form.replace('_', ' ').toUpperCase().slice(0, 8)}
                  </button>
                ))}
              </div>
            </div>

            {/* Reality Layer Switcher */}
            <div className="flex items-center gap-1 flex-wrap justify-center">
              {REALITY_LAYERS.map(layer => (
                <button
                  key={layer}
                  onClick={() => switchLayer(layer)}
                  className={`px-2 py-0.5 text-[8px] font-mono rounded ${
                    presence.realityLayer === layer
                      ? 'bg-green-900/50 text-green-300 border border-green-600'
                      : 'text-gray-600 border border-gray-800 hover:border-gray-600'
                  }`}
                >
                  {layer.replace('_', ' ').toUpperCase()}
                </button>
              ))}
            </div>

            {/* Exit */}
            <Button
              onClick={dissolveAegentis}
              variant="outline"
              size="sm"
              className="border-red-800 text-red-500 hover:bg-red-950/30 font-mono text-[10px] mt-1"
            >
              DISSOLVE
            </Button>
          </div>
        )}

        {/* Idle State - Manifest Button */}
        {vrState === 'idle' && (
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 mb-2">
              {(['webxr', 'meta_quest', 'vision_pro', 'custom_runtime'] as Platform[]).map(p => (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  className={`px-3 py-1 text-[10px] font-mono rounded border ${
                    platform === p
                      ? 'border-cyan-500 text-cyan-400 bg-cyan-950/30'
                      : 'border-gray-800 text-gray-600 hover:border-gray-600'
                  }`}
                >
                  {p.replace('_', ' ').toUpperCase()}
                </button>
              ))}
            </div>
            <Button
              onClick={manifestAegentis}
              disabled={!isAuthenticated}
              className="bg-cyan-700 hover:bg-cyan-600 text-white font-mono px-10 py-3 text-base shadow-lg shadow-cyan-900/50 tracking-wider"
            >
              {vrSupported ? 'MANIFEST AEGENTIS-X' : 'MANIFEST (2D MODE)'}
            </Button>
            {!isAuthenticated && (
              <span className="text-[10px] font-mono text-red-600">Authentication required</span>
            )}
          </div>
        )}

        {/* Manifesting State */}
        {vrState === 'manifesting' && (
          <div className="flex flex-col items-center gap-2">
            <div className="animate-pulse text-cyan-400 font-mono text-sm tracking-wider">
              AEGENTIS-X MANIFESTING...
            </div>
          </div>
        )}

        {/* Error State */}
        {vrState === 'error' && (
          <div className="flex flex-col items-center gap-2">
            <span className="text-red-400 font-mono text-xs">MANIFESTATION ERROR</span>
            <Button
              onClick={() => setVrState('idle')}
              className="bg-red-700 hover:bg-red-600 text-white font-mono text-xs"
            >
              RESET
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
