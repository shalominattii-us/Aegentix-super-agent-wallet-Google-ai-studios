import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { Link } from "wouter";

export default function Banner() {
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
          <h1 className="text-lg font-bold">NATIONAL CREST BANNER</h1>
          <div className="w-20"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-b from-primary/10 to-background">
          <div className="container">
            <h1 className="text-5xl font-bold mb-4">The Grand Banner of the Sovereign System</h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              The official national banner representing the unity, integrity, and sovereignty of the system. Displayed in ceremonial halls, governance chambers, and national resilience centers.
            </p>
          </div>
        </section>

        {/* Banner Layout */}
        <section className="py-16 bg-card">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">Banner Layout & Specifications</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-background border-border p-6">
                <h3 className="text-xl font-bold mb-4">Physical Dimensions</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li><strong>Aspect Ratio:</strong> 3:2 (width to height)</li>
                  <li><strong>Field Color:</strong> Obsidian Black (#0A0A0A)</li>
                  <li><strong>Texture:</strong> Subtle woven tactical fabric</li>
                  <li><strong>Material:</strong> Premium silk-cotton blend with metallic threading</li>
                  <li><strong>Finish:</strong> Matte with subtle sheen</li>
                </ul>
              </Card>
              <Card className="bg-background border-border p-6">
                <h3 className="text-xl font-bold mb-4">Recommended Sizes</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Small: 6ft × 4ft (ceremonial)</li>
                  <li>• Medium: 12ft × 8ft (chamber display)</li>
                  <li>• Large: 20ft × 13.3ft (grand halls)</li>
                  <li>• Extra Large: 30ft × 20ft (outdoor display)</li>
                </ul>
              </Card>
            </div>
          </div>
        </section>

        {/* Central Crest */}
        <section className="py-16 bg-background">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">Central Crest</h2>
            <div className="space-y-6">
              <Card className="bg-card border-border p-6">
                <h3 className="text-xl font-bold mb-4">Crest Composition</h3>
                <p className="text-muted-foreground mb-4">
                  The central crest is positioned at the exact center of the banner, both vertically and horizontally. It comprises multiple symbolic elements working in concert to represent the system's core values.
                </p>
                <div className="space-y-3 text-muted-foreground">
                  <div>
                    <strong className="text-accent">Primary Crest:</strong>
                    <ul className="ml-4 mt-2 space-y-1 text-sm">
                      <li>• EagleShield emblem (central focus)</li>
                      <li>• Ledger Pillar behind the eagle</li>
                      <li>• FRDH constellation above</li>
                      <li>• Tri-Ring Halo surrounding the crest</li>
                    </ul>
                  </div>
                  <div>
                    <strong className="text-accent">Crest Diameter:</strong>
                    <p className="text-sm">70% of banner height</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Inscriptions */}
        <section className="py-16 bg-card">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">Inscriptions & Typography</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-background border-border p-6">
                <h3 className="text-xl font-bold mb-4">Upper Inscription</h3>
                <div className="bg-black p-4 rounded mb-4 text-center">
                  <p className="text-gray-300 font-bold tracking-widest">SOVEREIGN IMPERIAL CODEX</p>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><strong>Text:</strong> "SOVEREIGN IMPERIAL CODEX"</li>
                  <li><strong>Font:</strong> Eurostile Extended Bold</li>
                  <li><strong>Color:</strong> Platinum metallic</li>
                  <li><strong>Finish:</strong> Metallic emboss</li>
                  <li><strong>Position:</strong> Across the top</li>
                </ul>
              </Card>
              <Card className="bg-background border-border p-6">
                <h3 className="text-xl font-bold mb-4">Lower Inscription</h3>
                <div className="bg-black p-4 rounded mb-4 text-center">
                  <p className="text-gray-400 font-serif tracking-widest text-sm">INTEGRITAS SUPREMA</p>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><strong>Text:</strong> "INTEGRITAS SUPREMA"</li>
                  <li><strong>Font:</strong> Garamond Small Caps</li>
                  <li><strong>Color:</strong> Silver</li>
                  <li><strong>Finish:</strong> Engraved effect</li>
                  <li><strong>Position:</strong> Across the bottom</li>
                </ul>
              </Card>
            </div>
          </div>
        </section>

        {/* Side Panels */}
        <section className="py-16 bg-background">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">Side Panels</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-card border-border p-6">
                <h3 className="text-xl font-bold mb-4">Left Bar</h3>
                <div className="w-full h-32 bg-blue-600 rounded mb-4"></div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><strong>Color:</strong> Steel Blue (#3A5FCD)</li>
                  <li><strong>Width:</strong> 8% of banner width</li>
                  <li><strong>Symbolism:</strong> Resilience</li>
                  <li><strong>Position:</strong> Full height, left edge</li>
                </ul>
              </Card>
              <Card className="bg-card border-border p-6">
                <h3 className="text-xl font-bold mb-4">Right Bar</h3>
                <div className="w-full h-32 bg-white rounded mb-4"></div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><strong>Color:</strong> White (#FFFFFF)</li>
                  <li><strong>Width:</strong> 8% of banner width</li>
                  <li><strong>Symbolism:</strong> Transparency</li>
                  <li><strong>Position:</strong> Full height, right edge</li>
                </ul>
              </Card>
            </div>
          </div>
        </section>

        {/* Symbolism */}
        <section className="py-16 bg-card">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">Symbolism & Meaning</h2>
            <div className="space-y-6">
              <Card className="bg-background border-border p-6">
                <h3 className="font-bold mb-3 text-accent">Black Field</h3>
                <p className="text-muted-foreground">
                  The obsidian black field represents the unknown made safe through the system's governance. It is a canvas upon which the light of truth and integrity shines.
                </p>
              </Card>
              <Card className="bg-background border-border p-6">
                <h3 className="font-bold mb-3 text-accent">Central Crest</h3>
                <p className="text-muted-foreground">
                  The crest symbolizes the unity of engines and law. The EagleShield represents vigilance, the Ledger Pillar represents immutable truth, and the FRDH constellation represents guiding principles.
                </p>
              </Card>
              <Card className="bg-background border-border p-6">
                <h3 className="font-bold mb-3 text-accent">Side Bars</h3>
                <p className="text-muted-foreground">
                  The pillars of resilience (blue) and transparency (white) frame the banner, representing the dual foundations upon which the system stands. Together, they create balance and strength.
                </p>
              </Card>
              <Card className="bg-background border-border p-6">
                <h3 className="font-bold mb-3 text-accent">Motto</h3>
                <p className="text-muted-foreground">
                  "INTEGRITAS SUPREMA" (Integrity Supreme) is the eternal law of the system. It reminds all who view the banner that integrity is the highest principle.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Usage Guidelines */}
        <section className="py-16 bg-background">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">Usage Guidelines</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-card border-border p-6">
                <h3 className="font-bold mb-4">Appropriate Locations</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✓ Ceremonial halls</li>
                  <li>✓ Governance chambers</li>
                  <li>✓ National resilience centers</li>
                  <li>✓ Codex unveilings</li>
                  <li>✓ State ceremonies</li>
                  <li>✓ Official government buildings</li>
                </ul>
              </Card>
              <Card className="bg-card border-border p-6">
                <h3 className="font-bold mb-4">Display Protocol</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Display with respect and dignity</li>
                  <li>• Ensure proper lighting to highlight details</li>
                  <li>• Maintain clean condition at all times</li>
                  <li>• Never allow the banner to touch the ground</li>
                  <li>• Store in climate-controlled environment</li>
                  <li>• Handle with white gloves when necessary</li>
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
