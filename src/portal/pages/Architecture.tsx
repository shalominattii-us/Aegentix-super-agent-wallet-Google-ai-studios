import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, Database, Shield, Zap, Network } from "lucide-react";
import { Link } from "wouter";

export default function Architecture() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-card/80 backdrop-blur border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
          <h1 className="text-lg font-bold">SYSTEM ARCHITECTURE</h1>
          <div className="w-20"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-b from-primary/10 to-background">
          <div className="container">
            <h1 className="text-5xl font-bold mb-4">System Architecture Overview</h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              The Sovereign System is built on a modular, resilient architecture featuring the Codex API, EagleShield Engine, and distributed governance infrastructure.
            </p>
          </div>
        </section>

        {/* Architecture Diagram */}
        <section className="py-16 bg-card">
          <div className="container">
            <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663117391247/mjgHKLKvY4zrUjqQDBMaLA/architecture_diagram-KfeWMjrZQd6AuLbK97zFSE.webp" alt="Sovereign System Architecture" className="w-full rounded-lg border border-border" />
          </div>
        </section>

        {/* Core Components */}
        <section className="py-16 bg-card">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">Core Components</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-background border-border p-6 hover:border-primary transition">
                <div className="flex items-start gap-4">
                  <Shield className="w-8 h-8 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold mb-2">EagleShield Engine</h3>
                    <p className="text-muted-foreground text-sm">
                      The core security and vigilance system. Monitors system integrity, detects anomalies, and enforces access control policies across all components.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="bg-background border-border p-6 hover:border-primary transition">
                <div className="flex items-start gap-4">
                  <Database className="w-8 h-8 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold mb-2">Codex API</h3>
                    <p className="text-muted-foreground text-sm">
                      RESTful interface for accessing the Sovereign Imperial Codex. Provides endpoints for querying principles, laws, and governance directives.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="bg-background border-border p-6 hover:border-primary transition">
                <div className="flex items-start gap-4">
                  <Zap className="w-8 h-8 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold mb-2">Baseline Engine</h3>
                    <p className="text-muted-foreground text-sm">
                      Computational foundation for truth verification. Processes facts, validates data integrity, and maintains immutable records.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="bg-background border-border p-6 hover:border-primary transition">
                <div className="flex items-start gap-4">
                  <Network className="w-8 h-8 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold mb-2">Ledger Engine</h3>
                    <p className="text-muted-foreground text-sm">
                      Accountability and ethics framework. Records all transactions, maintains audit trails, and ensures compliance with the Codex.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* System Layers */}
        <section className="py-16 bg-background">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">System Layers</h2>
            <div className="space-y-4">
              <Card className="bg-card border-border p-6">
                <h3 className="font-bold mb-2 text-accent">Presentation Layer (UI)</h3>
                <p className="text-muted-foreground text-sm">
                  Web-based interface for citizens and administrators. Provides dashboards, reporting tools, and access to system functions.
                </p>
              </Card>
              <Card className="bg-card border-border p-6">
                <h3 className="font-bold mb-2 text-accent">Application Layer (APIs)</h3>
                <p className="text-muted-foreground text-sm">
                  RESTful and event-driven APIs for system integration. Handles business logic, authentication, and authorization.
                </p>
              </Card>
              <Card className="bg-card border-border p-6">
                <h3 className="font-bold mb-2 text-accent">Engine Layer (Processing)</h3>
                <p className="text-muted-foreground text-sm">
                  Baseline and Ledger Engines process transactions, verify integrity, and maintain accountability records.
                </p>
              </Card>
              <Card className="bg-card border-border p-6">
                <h3 className="font-bold mb-2 text-accent">Data Layer (Storage)</h3>
                <p className="text-muted-foreground text-sm">
                  Distributed ledger and database infrastructure. Ensures data redundancy, immutability, and high availability.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* System Components Overview */}
        <section className="py-16 bg-background">
          <div className="container">
            <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663117391247/mjgHKLKvY4zrUjqQDBMaLA/system_components-k2iATJeY9HJfZxLWPgJ2Pj.webp" alt="System Components Overview" className="w-full rounded-lg border border-border" />
          </div>
        </section>

        {/* Development Stages */}
        <section className="py-16 bg-card">
          <div className="container">
            <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663117391247/mjgHKLKvY4zrUjqQDBMaLA/development_stages-KDfTF7wbJEwQygA86grwte.webp" alt="10 Development Stages" className="w-full rounded-lg border border-border mb-12" />
            <h2 className="text-3xl font-bold mb-8">Development Stages</h2>
            <p className="text-muted-foreground mb-8">
              The Sovereign System evolves through ten progressive stages, each building upon the previous to enhance capability and resilience.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { stage: 1, name: "Core", desc: "Foundation systems and core engines" },
                { stage: 2, name: "Expansion", desc: "Extended API and service capabilities" },
                { stage: 3, name: "Fabric", desc: "Network infrastructure and distribution" },
                { stage: 4, name: "Autonomy", desc: "Self-governing mechanisms and automation" },
                { stage: 5, name: "Continuity", desc: "Disaster recovery and resilience" },
                { stage: 6, name: "Ascension", desc: "Advanced analytics and intelligence" },
                { stage: 7, name: "Convergence", desc: "Multi-system integration and federation" },
                { stage: 8, name: "Apex", desc: "Peak performance and optimization" },
                { stage: 9, name: "Transcendence", desc: "Emergent capabilities and evolution" },
                { stage: 10, name: "Singularity", desc: "Ultimate integration and consciousness" }
              ].map((item) => (
                <Card key={item.stage} className="bg-background border-border p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-accent">{item.stage}</span>
                    </div>
                    <div>
                      <h4 className="font-bold">{item.name}</h4>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Infrastructure */}
        <section className="py-16 bg-background">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">Infrastructure</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-card border-border p-6">
                <h3 className="text-xl font-bold mb-4">Deployment</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✓ Docker containerization for all services</li>
                  <li>✓ Kubernetes orchestration for scaling</li>
                  <li>✓ Multi-region deployment capability</li>
                  <li>✓ Automated failover and recovery</li>
                </ul>
              </Card>
              <Card className="bg-card border-border p-6">
                <h3 className="text-xl font-bold mb-4">Security</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✓ End-to-end encryption for all data</li>
                  <li>✓ Multi-factor authentication</li>
                  <li>✓ Role-based access control (RBAC)</li>
                  <li>✓ Continuous security monitoring</li>
                </ul>
              </Card>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-background border-t border-border py-12">
          <div className="container text-center text-sm text-muted-foreground">
            <p>© 2026 The Sovereign System. INTEGRITAS SUPREMA.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
