import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { Link } from "wouter";

export default function DocDoctrine() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="fixed top-0 w-full z-50 bg-card/80 backdrop-blur border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <Link href="/documentation">
            <Button variant="ghost" size="sm" className="gap-2">
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
          <h1 className="text-lg font-bold">SOVEREIGN DOCTRINE</h1>
          <div className="w-20"></div>
        </div>
      </header>

      <main className="pt-20">
        <section className="py-12 bg-gradient-to-b from-primary/10 to-background">
          <div className="container">
            <h1 className="text-5xl font-bold mb-4">Sovereign Doctrine</h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              The philosophical and operational principles that govern the Sovereign System.
            </p>
          </div>
        </section>

        <section className="py-16 bg-card">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">Core Principles</h2>
            <div className="space-y-6">
              <Card className="bg-background border-border p-6">
                <h3 className="text-xl font-bold mb-3 text-accent">Integrity Supreme</h3>
                <p className="text-muted-foreground">
                  Integrity is the highest principle. All operations must maintain the highest standards of truth, honesty, and ethical conduct. No exception overrides this principle.
                </p>
              </Card>
              <Card className="bg-background border-border p-6">
                <h3 className="text-xl font-bold mb-3 text-accent">Resilience Through Diversity</h3>
                <p className="text-muted-foreground">
                  The system draws strength from diversity of thought, perspective, and capability. Resilience is built through distributed decision-making and redundant systems.
                </p>
              </Card>
              <Card className="bg-background border-border p-6">
                <h3 className="text-xl font-bold mb-3 text-accent">Transparency in Action</h3>
                <p className="text-muted-foreground">
                  All operations are transparent and auditable. Citizens have the right to understand how decisions are made and how resources are allocated.
                </p>
              </Card>
              <Card className="bg-background border-border p-6">
                <h3 className="text-xl font-bold mb-3 text-accent">Sovereignty of Purpose</h3>
                <p className="text-muted-foreground">
                  The system exists to serve its citizens and uphold the principles of the Codex. No external force can override the sovereignty of the system.
                </p>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 bg-background">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">Governance Framework</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-card border-border p-6">
                <h3 className="font-bold mb-3 text-accent">Custodian Responsibilities</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Uphold the Sovereign Imperial Codex</li>
                  <li>• Protect citizen rights and freedoms</li>
                  <li>• Maintain system integrity</li>
                  <li>• Ensure transparent operations</li>
                  <li>• Serve the collective good</li>
                </ul>
              </Card>
              <Card className="bg-card border-border p-6">
                <h3 className="font-bold mb-3 text-accent">Citizen Rights</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Right to transparent governance</li>
                  <li>• Right to participate in decisions</li>
                  <li>• Right to audit all operations</li>
                  <li>• Right to appeal decisions</li>
                  <li>• Right to privacy within law</li>
                </ul>
              </Card>
            </div>
          </div>
        </section>

        <footer className="bg-background border-t border-border py-12">
          <div className="container text-center text-sm text-muted-foreground">
            <p>© 2026 The Sovereign System. INTEGRITAS SUPREMA.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
