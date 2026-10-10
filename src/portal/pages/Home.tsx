import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { canvasAssets } from "@/lib/canvasAssets";
import { useState, useEffect } from "react";
import { Link } from "wouter";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Clean Header */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled ? "bg-white/95 backdrop-blur border-b border-gray-200" : "bg-white"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-2 font-bold text-xl">
            <img
              src={canvasAssets.logo}
              alt="Eagle Shield"
              className="w-7 h-7"
            />
            <span>SOVEREIGN</span>
          </div>
          <nav className="hidden md:flex gap-8 text-sm">
            <a href="#features" className="hover:text-gray-600 transition">
              Features
            </a>
            <a href="#docs" className="hover:text-gray-600 transition">
              Docs
            </a>
            <a href="#about" className="hover:text-gray-600 transition">
              About
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/vr">
              <Button size="sm" variant="outline">
                VR Portal
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section with Canvas Images */}
      <section className="pt-32 pb-24 px-6 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto mb-16">
          <img
            src={canvasAssets.hero}
            alt="Sovereign System Hero"
            className="w-full rounded-lg shadow-lg mb-8"
          />
        </div>
      </section>

      {/* Hero Section - Clean and Minimal */}
      <section className="pt-8 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight">
              Sovereign System.
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Autonomous trading, multi-chain treasury management, and real-time compliance—all
              powered by cryptographic verification and sovereign authority.
            </p>
          </div>

          <div className="flex gap-4 justify-center pt-4 flex-wrap">
            <Link href="/vr">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                Enter Portal
              </Button>
            </Link>
            <a href="#features">
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </a>
          </div>

          <div className="pt-8 text-sm text-gray-500">
            <p>Mainnet: rwB7JKKc5gJ47pPnWCFvQuhVW85mejYF1M</p>
          </div>
        </div>
      </section>

      {/* Architecture & Design Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">System Architecture</h2>
          <div className="space-y-8">
            <img
              src={canvasAssets.architecture}
              alt="Sovereign System Architecture"
              className="w-full rounded-lg border border-gray-200 shadow-md"
            />
            <img
              src={canvasAssets.components}
              alt="System Components"
              className="w-full rounded-lg border border-gray-200 shadow-md"
            />
            <img
              src={canvasAssets.stages}
              alt="Development Stages"
              className="w-full rounded-lg border border-gray-200 shadow-md"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-16 text-center">Core Features</h2>

          <div className="grid md:grid-cols-3 gap-12">
            {/* Treasury Management */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Treasury Management</h3>
              <p className="text-gray-600">
                Real-time portfolio monitoring, multi-chain custody, and autonomous capital
                generation with 35+ blockchain support.
              </p>
              <Link href="/treasury">
                <Button variant="link" className="p-0">
                  Explore →
                </Button>
              </Link>
            </div>

            {/* Autonomous Trading */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Autonomous Trading</h3>
              <p className="text-gray-600">
                Cross-DEX arbitrage, multi-chain execution, and real-time market monitoring with
                Moltbook agent swarm.
              </p>
              <Link href="/trading">
                <Button variant="link" className="p-0">
                  Explore →
                </Button>
              </Link>
            </div>

            {/* Compliance & Audit */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Compliance & Audit</h3>
              <p className="text-gray-600">
                Multi-chain compliance monitoring, KYC/AML tracking, and immutable audit trails
                with AI-powered investigation.
              </p>
              <Link href="/compliance">
                <Button variant="link" className="p-0">
                  Explore →
                </Button>
              </Link>
            </div>

            {/* Real-Time Events */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Real-Time Events</h3>
              <p className="text-gray-600">
                Live transaction monitoring, agent status tracking, and system-wide event
                streaming with Socket.io integration.
              </p>
              <Link href="/events">
                <Button variant="link" className="p-0">
                  Explore →
                </Button>
              </Link>
            </div>

            {/* Multi-Reality */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Multi-Reality Sync</h3>
              <p className="text-gray-600">
                Cross-reality persistence across 9 layers with causal event sourcing and harmonic
                convergence.
              </p>
              <Link href="/reality">
                <Button variant="link" className="p-0">
                  Explore →
                </Button>
              </Link>
            </div>

            {/* VR Portal */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Immersive VR Portal</h3>
              <p className="text-gray-600">
                WebXR-based immersive interface with Meta Quest 3 and Apple Vision Pro support for
                spatial computing.
              </p>
              <Link href="/vr">
                <Button variant="link" className="p-0">
                  Explore →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Documentation Preview */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Documentation</h2>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="space-y-4">
              <img
                src={canvasAssets.docsSpecification}
                alt="System Specification"
                className="w-full rounded-lg border border-gray-200"
              />
              <h3 className="font-bold">System Specification</h3>
            </div>
            <div className="space-y-4">
              <img
                src={canvasAssets.docsDoctrine}
                alt="Sovereign Doctrine"
                className="w-full rounded-lg border border-gray-200"
              />
              <h3 className="font-bold">Sovereign Doctrine</h3>
            </div>
            <div className="space-y-4">
              <img
                src={canvasAssets.docsOperator}
                alt="Operator Guide"
                className="w-full rounded-lg border border-gray-200"
              />
              <h3 className="font-bold">Operator Guide</h3>
            </div>
            <div className="space-y-4">
              <img
                src={canvasAssets.downloads}
                alt="Installer Manual"
                className="w-full rounded-lg border border-gray-200"
              />
              <h3 className="font-bold">Installer Manual</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Specs */}
      <section id="docs" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-16 text-center">Technical Stack</h2>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div>
                <h3 className="font-bold mb-2">Backend</h3>
                <p className="text-gray-600">
                  Express.js, tRPC, Socket.io, Drizzle ORM with MySQL/TiDB database, multi-chain
                  RPC integration
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-2">Blockchain</h3>
                <p className="text-gray-600">
                  XRPL (Mainnet), EVM chains, Solana, Hedera, Cosmos, DAG-based networks with
                  multi-sig support
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-2">Security</h3>
                <p className="text-gray-600">
                  Ed25519/ECDSA/RSA signatures, HSM support, cryptographic verification, authority
                  hierarchy enforcement
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-bold mb-2">Frontend</h3>
                <p className="text-gray-600">
                  React 19, Tailwind CSS 4, Shadcn/ui components, Wouter routing, real-time Socket.io
                  client
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-2">Infrastructure</h3>
                <p className="text-gray-600">
                  Docker, Kubernetes, AWS multi-region, CloudWatch monitoring, EventBridge routing,
                  S3 WORM compliance
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-2">AI Integration</h3>
                <p className="text-gray-600">
                  LLM for evidence analysis, voice transcription (Whisper), image generation,
                  autonomous agent decision-making
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Downloads Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Downloads & Deployment</h2>
          <div className="mb-12">
            <img
              src={canvasAssets.downloads}
              alt="Download Portal"
              className="w-full rounded-lg border border-gray-200 shadow-md"
            />
          </div>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <img
                src={canvasAssets.windowsInstaller}
                alt="Windows Installer"
                className="w-32 h-32 mx-auto mb-4 rounded-lg border border-gray-200"
              />
              <h3 className="font-bold">Windows Installer</h3>
            </div>
            <div className="text-center">
              <img
                src={canvasAssets.linuxInstaller}
                alt="Linux Installer"
                className="w-32 h-32 mx-auto mb-4 rounded-lg border border-gray-200"
              />
              <h3 className="font-bold">Linux Installer</h3>
            </div>
            <div className="text-center">
              <img
                src={canvasAssets.dockerDeployment}
                alt="Docker Deployment"
                className="w-32 h-32 mx-auto mb-4 rounded-lg border border-gray-200"
              />
              <h3 className="font-bold">Docker Deployment</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Status Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">System Status</h2>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-600 mb-2">Mainnet Account</div>
              <div className="font-mono text-sm break-all">rwB7JKKc5gJ47pPnWCFvQuhVW85mejYF1M</div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-600 mb-2">Balance</div>
              <div className="text-2xl font-bold">15.56 XRP</div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-600 mb-2">Portfolio</div>
              <div className="text-2xl font-bold">68 Assets</div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-600 mb-2">Status</div>
              <div className="text-2xl font-bold text-green-600">Active</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-bold">Ready to begin?</h2>
          <p className="text-xl text-gray-600">
            Access the sovereign system portal and start autonomous trading on Mainnet.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/vr">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                Enter Portal
              </Button>
            </Link>
            <a href="https://github.com">
              <Button size="lg" variant="outline">
                View on GitHub
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-200 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center text-sm text-gray-600">
          <p>© 2026 Sovereign System. INTEGRITAS SUPREMA.</p>
        </div>
      </footer>
    </div>
  );
}
