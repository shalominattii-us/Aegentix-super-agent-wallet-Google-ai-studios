import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { Link } from "wouter";

export default function Uniforms() {
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
          <h1 className="text-lg font-bold">SOVEREIGN UNIFORM</h1>
          <div className="w-20"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-b from-primary/10 to-background">
          <div className="container">
            <h1 className="text-5xl font-bold mb-4">The Official Uniform of Custodians</h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              A military-grade, ceremonial-functional hybrid uniform designed for Governance Officers, Integrity Custodians, EagleShield Commanders, FRDH Analysts, and Transparency Wardens.
            </p>
          </div>
        </section>

        {/* Color Scheme */}
        <section className="py-16 bg-card">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">Color Scheme</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="bg-background border-border p-6">
                <div className="w-full h-24 bg-black rounded mb-4"></div>
                <h3 className="font-bold mb-2">Obsidian Black</h3>
                <p className="text-sm text-muted-foreground">#0A0A0A - Primary color representing sovereignty</p>
              </Card>
              <Card className="bg-background border-border p-6">
                <div className="w-full h-24 bg-blue-600 rounded mb-4"></div>
                <h3 className="font-bold mb-2">Steel Blue</h3>
                <p className="text-sm text-muted-foreground">#3A5FCD - Secondary color representing resilience</p>
              </Card>
              <Card className="bg-background border-border p-6">
                <div className="w-full h-24 bg-gray-300 rounded mb-4"></div>
                <h3 className="font-bold mb-2">Platinum</h3>
                <p className="text-sm text-muted-foreground">#E5E4E2 - Trim and accents representing truth</p>
              </Card>
              <Card className="bg-background border-border p-6">
                <div className="w-full h-24 bg-red-600 rounded mb-4"></div>
                <h3 className="font-bold mb-2">Signal Red</h3>
                <p className="text-sm text-muted-foreground">#D40000 - Accent color representing vigilance</p>
              </Card>
            </div>
          </div>
        </section>

        {/* Fabric & Materials */}
        <section className="py-16 bg-background">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">Fabric & Materials</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">Technical Specifications</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="text-accent">•</span>
                    <span><strong>Material:</strong> Tactical weave with advanced fiber composition</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-accent">•</span>
                    <span><strong>Fire-Resistant:</strong> Meets international safety standards</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-accent">•</span>
                    <span><strong>Anti-Static:</strong> Protects against electromagnetic interference</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-accent">•</span>
                    <span><strong>Finish:</strong> Matte non-reflective coating</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-accent">•</span>
                    <span><strong>Durability:</strong> Reinforced stitching and stress points</span>
                  </li>
                </ul>
              </div>
              <Card className="bg-card border-border p-6">
                <h3 className="font-bold mb-4">Maintenance</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  The uniform is designed for durability and ease of maintenance. Regular cleaning with mild detergent and air drying is recommended. The tactical weave resists staining and maintains its integrity through extended use.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Jacket Details */}
        <section className="py-16 bg-card">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">Jacket</h2>
            <div className="space-y-6">
              <Card className="bg-background border-border p-6">
                <h3 className="text-xl font-bold mb-3">Design Features</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• High-collar design for formal and tactical versatility</li>
                  <li>• Tri-Ring Halo embroidered on collar tips</li>
                  <li>• Crest patch on left chest (EagleShield emblem)</li>
                  <li>• Division insignia on right arm</li>
                  <li>• Ledger Pillar vertical stripe down the spine (subtle emboss)</li>
                  <li>• Reinforced shoulder seams for insignia placement</li>
                  <li>• Functional pockets with platinum zipper pulls</li>
                </ul>
              </Card>
            </div>
          </div>
        </section>

        {/* Trousers Details */}
        <section className="py-16 bg-background">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">Trousers</h2>
            <div className="space-y-6">
              <Card className="bg-card border-border p-6">
                <h3 className="text-xl font-bold mb-3">Design Features</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Straight-leg tactical cut for mobility and formality</li>
                  <li>• Steel Blue side stripe running the full length</li>
                  <li>• Reinforced knee panels for durability</li>
                  <li>• Hidden utility pockets for secure storage</li>
                  <li>• Platinum button and zipper hardware</li>
                  <li>• Adjustable waist with internal belt loops</li>
                  <li>• Tapered ankle opening for boot compatibility</li>
                </ul>
              </Card>
            </div>
          </div>
        </section>

        {/* Boots Details */}
        <section className="py-16 bg-card">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">Boots</h2>
            <div className="space-y-6">
              <Card className="bg-background border-border p-6">
                <h3 className="text-xl font-bold mb-3">Design Features</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Black tactical leather construction</li>
                  <li>• Steel Blue stitching throughout</li>
                  <li>• Platinum eyelets for secure lacing</li>
                  <li>• Non-reflective finish for operational security</li>
                  <li>• Reinforced sole for extended wear</li>
                  <li>• Oil and water resistant treatment</li>
                  <li>• Comfortable break-in period with arch support</li>
                </ul>
              </Card>
            </div>
          </div>
        </section>

        {/* Headgear */}
        <section className="py-16 bg-background">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">Headgear Options</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-card border-border p-6">
                <h3 className="text-xl font-bold mb-4">Ceremonial Variant</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Black peaked cap</li>
                  <li>• Platinum band around the crown</li>
                  <li>• EagleShield crest centered on the front</li>
                  <li>• Used for formal ceremonies and official functions</li>
                </ul>
              </Card>
              <Card className="bg-card border-border p-6">
                <h3 className="text-xl font-bold mb-4">Operational Variant</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Tactical beret in obsidian black</li>
                  <li>• Crest pin on left side</li>
                  <li>• Flexible and practical for field operations</li>
                  <li>• Worn during active duty and training</li>
                </ul>
              </Card>
            </div>
          </div>
        </section>

        {/* Insignia Placement */}
        <section className="py-16 bg-card">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">Insignia & Placement</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">Rank & Division Insignia</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li><strong>Rank Insignia:</strong> Shoulders (epaulettes)</li>
                  <li><strong>Division Insignia:</strong> Right arm</li>
                  <li><strong>Sovereign Custodian Emblem:</strong> Left chest</li>
                  <li><strong>Motto Ribbon:</strong> Above left breast pocket</li>
                </ul>
              </div>
              <Card className="bg-background border-border p-6">
                <h3 className="font-bold mb-4">Insignia Symbolism</h3>
                <p className="text-sm text-muted-foreground">
                  Each insignia placement reflects the hierarchy and specialization within the Sovereign System. Shoulder ranks denote authority level, while division insignia identifies the officer's primary responsibility within the system's governance structure.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Ceremonial Accessories */}
        <section className="py-16 bg-background">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">Ceremonial Accessories</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="bg-card border-border p-6 text-center">
                <div className="w-full h-20 bg-gradient-to-b from-gray-300 to-gray-400 rounded mb-4"></div>
                <h3 className="font-bold mb-2">Silver Sash</h3>
                <p className="text-sm text-muted-foreground">Governance Officers</p>
              </Card>
              <Card className="bg-card border-border p-6 text-center">
                <div className="w-full h-20 bg-gradient-to-b from-red-600 to-red-700 rounded mb-4"></div>
                <h3 className="font-bold mb-2">Red Sash</h3>
                <p className="text-sm text-muted-foreground">Defense Officers</p>
              </Card>
              <Card className="bg-card border-border p-6 text-center">
                <div className="w-full h-20 bg-gradient-to-b from-blue-500 to-blue-600 rounded mb-4"></div>
                <h3 className="font-bold mb-2">Blue Sash</h3>
                <p className="text-sm text-muted-foreground">Resilience Officers</p>
              </Card>
              <Card className="bg-card border-border p-6 text-center">
                <div className="w-full h-20 bg-gradient-to-b from-white to-gray-200 rounded mb-4"></div>
                <h3 className="font-bold mb-2">White Sash</h3>
                <p className="text-sm text-muted-foreground">Transparency Officers</p>
              </Card>
            </div>
          </div>
        </section>

        {/* Symbolism */}
        <section className="py-16 bg-card">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">Symbolism & Meaning</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-background border-border p-6">
                <h3 className="font-bold mb-3 text-accent">Color Meanings</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><strong>Black:</strong> Sovereignty and authority</li>
                  <li><strong>Blue:</strong> Resilience and trust</li>
                  <li><strong>Red:</strong> Vigilance and protection</li>
                  <li><strong>Platinum:</strong> Truth and integrity</li>
                  <li><strong>White:</strong> Transparency and openness</li>
                </ul>
              </Card>
              <Card className="bg-background border-border p-6">
                <h3 className="font-bold mb-3 text-accent">Design Philosophy</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  The uniform embodies the ethos of the Sovereign Imperial Codex through every element. The combination of military functionality and ceremonial elegance reflects the dual nature of the Custodians: protectors of the system and guardians of its principles.
                </p>
                <p className="text-sm text-muted-foreground">
                  Wearing the uniform is a solemn commitment to uphold Integrity, Resilience, Transparency, and Sovereignty.
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
