import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { Link } from "wouter";

export default function CourtEmblem() {
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
          <h1 className="text-lg font-bold">CONSTITUTIONAL COURT EMBLEM</h1>
          <div className="w-20"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-b from-primary/10 to-background">
          <div className="container">
            <h1 className="text-5xl font-bold mb-4">The Emblem of the High Tribunal of Integrity</h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              The official seal of the Constitutional Court, representing the judicial authority that interprets the Sovereign Imperial Codex and ensures justice is administered with impartiality and wisdom.
            </p>
          </div>
        </section>

        {/* Shape & Structure */}
        <section className="py-16 bg-card">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">Shape & Structure</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-background border-border p-6">
                <h3 className="text-xl font-bold mb-4">Geometric Form</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li><strong>Primary Shape:</strong> Perfect circle</li>
                  <li><strong>Border Style:</strong> Double-ring configuration</li>
                  <li><strong>Outer Ring Color:</strong> Platinum (#E5E4E2)</li>
                  <li><strong>Inner Ring Color:</strong> Deep Black (#000000)</li>
                  <li><strong>Ring Width:</strong> Proportional to overall diameter</li>
                  <li><strong>Center Field:</strong> Obsidian black with metallic accents</li>
                </ul>
              </Card>
              <div className="flex items-center justify-center">
                <div className="relative w-64 h-64">
                  <div className="absolute inset-0 rounded-full border-8 border-gray-300"></div>
                  <div className="absolute inset-4 rounded-full border-4 border-black"></div>
                  <div className="absolute inset-12 rounded-full bg-black flex items-center justify-center">
                    <span className="text-gray-400 text-sm">Emblem Center</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Center Symbol */}
        <section className="py-16 bg-background">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">Center Symbol: The Scales of Integrity</h2>
            <div className="space-y-6">
              <Card className="bg-card border-border p-6">
                <h3 className="text-xl font-bold mb-4">Scales Composition</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold mb-3 text-accent">Left Scale Pan</h4>
                    <p className="text-sm text-muted-foreground">
                      Represents the <strong>Baseline Engine</strong> – the computational foundation of truth and fact. This side weighs evidence and establishes objective reality.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold mb-3 text-accent">Right Scale Pan</h4>
                    <p className="text-sm text-muted-foreground">
                      Represents the <strong>Ledger Engine</strong> – the ethical and accountability framework. This side ensures all actions are recorded and justified.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="bg-card border-border p-6">
                <h3 className="text-xl font-bold mb-4">The Eagle Above</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold mb-3 text-accent">Eagle Symbolism</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Wings raised in vigilance</li>
                      <li>• Color: Signal Red (#D40000)</li>
                      <li>• Meaning: Watchfulness over justice</li>
                      <li>• Position: Surmounting the scales</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold mb-3 text-accent">Heraldic Description</h4>
                    <p className="text-sm text-muted-foreground italic">
                      "An eagle gules displayed, wings raised in eternal vigilance, surmounting the Scales of Integrity."
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="bg-card border-border p-6">
                <h3 className="text-xl font-bold mb-4">The Ledger Pillar</h3>
                <p className="text-muted-foreground mb-3">
                  Behind the scales stands the <strong>Ledger Pillar</strong>, a classical column representing immutable truth as the foundation of law. The pillar is rendered in platinum, symbolizing its eternal and unchanging nature.
                </p>
                <p className="text-sm text-muted-foreground">
                  The pillar's presence behind the scales reminds all that justice must be built upon a foundation of truth that cannot be altered or corrupted.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Inscriptions */}
        <section className="py-16 bg-card">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">Inscriptions</h2>
            <Card className="bg-background border-border p-6">
              <h3 className="text-xl font-bold mb-4">Lower Arc Inscription</h3>
              <div className="bg-black p-6 rounded mb-6 text-center">
                <p className="text-gray-300 font-serif tracking-widest text-lg">TRIBUNAL SUPREMA INTEGRITATIS</p>
              </div>
              <div className="space-y-3 text-muted-foreground">
                <p><strong>Latin Translation:</strong> "Supreme Tribunal of Integrity"</p>
                <p><strong>Font:</strong> Garamond, all capitals</p>
                <p><strong>Color:</strong> Platinum metallic</p>
                <p><strong>Position:</strong> Along the lower arc of the emblem</p>
                <p><strong>Meaning:</strong> Declares the emblem's authority and purpose in the system</p>
              </div>
            </Card>
          </div>
        </section>

        {/* Heraldic Description */}
        <section className="py-16 bg-background">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">Heraldic Description</h2>
            <Card className="bg-card border-border p-6">
              <div className="bg-background p-6 rounded border-l-4 border-accent">
                <p className="text-muted-foreground italic">
                  "Sable, a pillar argent supporting scales of judgment, surmounted by an eagle gules displayed, all within a double ring of platinum and night."
                </p>
              </div>
              <div className="mt-6 space-y-3 text-sm text-muted-foreground">
                <p><strong>Sable:</strong> Black field (representing sovereignty and justice)</p>
                <p><strong>Pillar argent:</strong> Silver/platinum pillar (immutable truth)</p>
                <p><strong>Scales of judgment:</strong> The instruments of balanced justice</p>
                <p><strong>Eagle gules:</strong> Red eagle (vigilance and protection)</p>
                <p><strong>Double ring:</strong> Platinum outer and black inner (authority and solemnity)</p>
              </div>
            </Card>
          </div>
        </section>

        {/* Usage & Authority */}
        <section className="py-16 bg-card">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">Usage & Authority</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-background border-border p-6">
                <h3 className="font-bold mb-4 text-accent">Official Uses</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✓ Constitutional rulings and decrees</li>
                  <li>✓ Judicial seals on official documents</li>
                  <li>✓ Codex interpretation documents</li>
                  <li>✓ Oversight adjudications</li>
                  <li>✓ Court chamber displays</li>
                  <li>✓ Official correspondence</li>
                </ul>
              </Card>
              <Card className="bg-background border-border p-6">
                <h3 className="font-bold mb-4 text-accent">Authority & Jurisdiction</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  The emblem represents the absolute authority of the High Tribunal to interpret the Sovereign Imperial Codex and render binding judgments on matters of constitutional importance.
                </p>
                <p className="text-sm text-muted-foreground">
                  Any document bearing this emblem carries the full weight and authority of the Tribunal and must be honored throughout the Sovereign System.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Symbolism & Meaning */}
        <section className="py-16 bg-background">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">Symbolism & Meaning</h2>
            <div className="space-y-6">
              <Card className="bg-card border-border p-6">
                <h3 className="font-bold mb-3 text-accent">The Scales</h3>
                <p className="text-muted-foreground">
                  The scales represent the fundamental principle of balanced justice. Neither the Baseline Engine (facts) nor the Ledger Engine (ethics) can outweigh the other. Justice requires both truth and accountability in perfect equilibrium.
                </p>
              </Card>
              <Card className="bg-card border-border p-6">
                <h3 className="font-bold mb-3 text-accent">The Eagle</h3>
                <p className="text-muted-foreground">
                  The red eagle in flight symbolizes constant vigilance. The High Tribunal watches over all matters of justice, ensuring that the scales remain balanced and that no corruption undermines the system's integrity.
                </p>
              </Card>
              <Card className="bg-card border-border p-6">
                <h3 className="font-bold mb-3 text-accent">The Pillar</h3>
                <p className="text-muted-foreground">
                  The platinum pillar represents immutable truth as the foundation of all law. It cannot be moved, altered, or corrupted. All judgments rest upon this unshakeable foundation of truth.
                </p>
              </Card>
              <Card className="bg-card border-border p-6">
                <h3 className="font-bold mb-3 text-accent">The Double Ring</h3>
                <p className="text-muted-foreground">
                  The platinum outer ring represents the light of justice and truth. The black inner ring represents the solemnity and gravity of the tribunal's work. Together, they create a boundary between the sacred work of justice and the outside world.
                </p>
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
