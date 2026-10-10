/**
 * EAGLESHIELD.GOV - CYBERNETIC COMMAND CENTER
 * Advanced neural network interface with quantum visualization
 */

import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Zap, Brain, Network, Cpu, Gauge, Signal } from 'lucide-react';
import { useEffect, useRef } from 'react';

export default function EagleShieldPortal() {
  const { user, isAuthenticated, logout } = useAuth();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Neural network visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
    }> = [];

    // Create particles
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: Math.random() * 2 + 1,
      });
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.1)';
      ctx.lineWidth = 0.5;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Update and draw particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.fillStyle = 'rgba(34, 211, 238, 0.8)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 relative overflow-hidden">
      {/* Neural Network Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-40"
      />

      {/* Animated grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_24%,rgba(34,211,238,.05)_25%,rgba(34,211,238,.05)_26%,transparent_27%,transparent_74%,rgba(34,211,238,.05)_75%,rgba(34,211,238,.05)_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,rgba(34,211,238,.05)_25%,rgba(34,211,238,.05)_26%,transparent_27%,transparent_74%,rgba(34,211,238,.05)_75%,rgba(34,211,238,.05)_76%,transparent_77%,transparent)] bg-[length:50px_50px]" />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-cyan-500/20 bg-slate-950/40 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Cybernetic Logo */}
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg opacity-20 blur-lg animate-pulse" />
                <div className="absolute inset-0 flex items-center justify-center border border-cyan-400/50 rounded-lg">
                  <Brain className="w-6 h-6 text-cyan-400" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                  EAGLESHIELD
                </h1>
                <p className="text-xs text-cyan-300/60">.CYBER | Neural Command</p>
              </div>
            </div>

            <nav className="hidden md:flex gap-6 text-sm">
              <a href="#neural" className="text-cyan-300/70 hover:text-cyan-300 transition">
                Neural Net
              </a>
              <a href="#quantum" className="text-cyan-300/70 hover:text-cyan-300 transition">
                Quantum
              </a>
              <a href="#systems" className="text-cyan-300/70 hover:text-cyan-300 transition">
                Systems
              </a>
            </nav>

            <div className="flex gap-3">
              {isAuthenticated ? (
                <>
                  <span className="text-xs text-cyan-300/60 py-2">{user?.email}</span>
                  <Button variant="outline" size="sm" onClick={() => logout()}>
                    Logout
                  </Button>
                </>
              ) : (
                <Button variant="default" size="sm">
                  Access
                </Button>
              )}
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <div className="mb-8">
            <div className="inline-block px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/30 mb-4 backdrop-blur">
              <span className="text-cyan-300 text-sm font-mono">⚡ NEURAL NETWORK ACTIVE</span>
            </div>
          </div>

          <h2 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-cyan-300 mb-6 leading-tight font-mono">
            CYBER
            <br />
            CONSCIOUSNESS
          </h2>

          <p className="text-lg text-cyan-200/80 mb-8 max-w-2xl mx-auto font-mono">
            Quantum-neural distributed intelligence. Autonomous economic actors. Constitutional governance at machine speed.
          </p>

          <div className="flex gap-4 justify-center mb-12">
            <Button size="lg" className="bg-cyan-600 hover:bg-cyan-700 font-mono">
              INITIALIZE SYSTEM
            </Button>
            <Button size="lg" variant="outline" className="border-cyan-400/50 text-cyan-300 font-mono">
              NEURAL DOCS
            </Button>
          </div>

          {/* Pulsing indicator */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/5 border border-cyan-500/30 backdrop-blur">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs text-cyan-300 font-mono">SYSTEM COHERENCE: 99.97%</span>
          </div>
        </section>

        {/* Neural Systems Grid */}
        <section id="neural" className="container mx-auto px-4 py-16">
          <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-12 text-center font-mono">
            NEURAL SYSTEMS
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Quantum Treasury */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg opacity-0 group-hover:opacity-10 blur-xl transition duration-500" />
              <Card className="relative bg-slate-900/50 border-cyan-500/20 hover:border-cyan-400/50 p-6 transition backdrop-blur">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-400/30">
                    <Zap className="w-6 h-6 text-cyan-400" />
                  </div>
                  <h4 className="text-lg font-mono font-semibold text-cyan-300">QUANTUM TREASURY</h4>
                </div>
                <p className="text-cyan-200/60 text-sm mb-4 font-mono">
                  D-Wave quantum annealing. Tesseract topology optimization. Multi-sig authority gates.
                </p>
                <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300 font-mono">
                  ACCESS →
                </Button>
              </Card>
            </div>

            {/* Neural Agents */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg opacity-0 group-hover:opacity-10 blur-xl transition duration-500" />
              <Card className="relative bg-slate-900/50 border-blue-500/20 hover:border-blue-400/50 p-6 transition backdrop-blur">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-400/30">
                    <Brain className="w-6 h-6 text-blue-400" />
                  </div>
                  <h4 className="text-lg font-mono font-semibold text-blue-300">NEURAL AGENTS</h4>
                </div>
                <p className="text-blue-200/60 text-sm mb-4 font-mono">
                  Autonomous economic actors. Federated coordination. Real-time decision matrices.
                </p>
                <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 font-mono">
                  DEPLOY →
                </Button>
              </Card>
            </div>

            {/* Constitutional Net */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg opacity-0 group-hover:opacity-10 blur-xl transition duration-500" />
              <Card className="relative bg-slate-900/50 border-purple-500/20 hover:border-purple-400/50 p-6 transition backdrop-blur">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-400/30">
                    <Network className="w-6 h-6 text-purple-400" />
                  </div>
                  <h4 className="text-lg font-mono font-semibold text-purple-300">CONSTITUTIONAL NET</h4>
                </div>
                <p className="text-purple-200/60 text-sm mb-4 font-mono">
                  10 Constitutional Orders. Quantum-modeled governance. Federated policy mesh.
                </p>
                <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300 font-mono">
                  GOVERN →
                </Button>
              </Card>
            </div>
          </div>
        </section>

        {/* Quantum Metrics */}
        <section id="quantum" className="container mx-auto px-4 py-16">
          <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-12 text-center font-mono">
            QUANTUM METRICS
          </h3>

          <div className="grid md:grid-cols-4 gap-4">
            {[
              { label: 'COHERENCE', value: '99.97%', icon: Cpu },
              { label: 'THROUGHPUT', value: '2.48 TB/s', icon: Gauge },
              { label: 'ENTANGLEMENT', value: '98%', icon: Signal },
              { label: 'UPTIME', value: '99.99%', icon: Zap },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <Card key={i} className="bg-slate-900/50 border-cyan-500/20 p-6 backdrop-blur">
                  <div className="flex items-center gap-2 mb-3">
                    <Icon className="w-4 h-4 text-cyan-400" />
                    <p className="text-cyan-300/60 text-xs font-mono">{stat.label}</p>
                  </div>
                  <p className="text-2xl font-bold text-cyan-300 font-mono">{stat.value}</p>
                </Card>
              );
            })}
          </div>
        </section>

        {/* System Status */}
        <section id="systems" className="container mx-auto px-4 py-16">
          <div className="bg-slate-900/50 border border-cyan-500/20 rounded-lg p-8 backdrop-blur">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-mono font-bold text-cyan-300">SYSTEM STATUS</h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-green-300 font-mono">OPERATIONAL</span>
              </div>
            </div>

            <div className="space-y-3 text-sm font-mono">
              <div className="flex justify-between text-cyan-200/60">
                <span>Neural Network Status:</span>
                <span className="text-cyan-300">SYNCHRONIZED</span>
              </div>
              <div className="flex justify-between text-cyan-200/60">
                <span>Quantum Processors:</span>
                <span className="text-cyan-300">16,384 QUBITS</span>
              </div>
              <div className="flex justify-between text-cyan-200/60">
                <span>Constitutional Orders:</span>
                <span className="text-cyan-300">10/10 ACTIVE</span>
              </div>
              <div className="flex justify-between text-cyan-200/60">
                <span>Autonomous Agents:</span>
                <span className="text-cyan-300">24,887 ONLINE</span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-cyan-500/10 bg-slate-950/40 mt-20 py-8 backdrop-blur">
          <div className="container mx-auto px-4 text-center text-cyan-300/60 text-xs font-mono">
            <p>EAGLESHIELD.CYBER | AEGENTIS-X NEURAL COMMAND CENTER</p>
            <p className="mt-2 text-cyan-400/40">
              QUANTUM-SECURED | ZERO-TRUST | AUTONOMOUS GOVERNANCE
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
