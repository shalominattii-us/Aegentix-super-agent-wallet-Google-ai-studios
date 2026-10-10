import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { Link } from "wouter";

export default function Currency() {
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
          <h1 className="text-lg font-bold">THE SOVEREIGN LEDGER</h1>
          <div className="w-20"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-b from-primary/10 to-background">
          <div className="container">
            <h1 className="text-5xl font-bold mb-4">The Sovereign Ledger: National Currency</h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              The official currency of the Sovereign System, designed to embody the principles of integrity, resilience, and transparency. Both physical and digital, the Sovereign Ledger facilitates secure, transparent transactions throughout the system.
            </p>
          </div>
        </section>

        {/* Overview */}
        <section className="py-16 bg-card">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">Overview</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-background border-border p-6">
                <h3 className="text-xl font-bold mb-4">Physical Denominations</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• 1 Sovereign Ledger</li>
                  <li>• 5 Sovereign Ledgers</li>
                  <li>• 10 Sovereign Ledgers</li>
                  <li>• 20 Sovereign Ledgers</li>
                  <li>• 50 Sovereign Ledgers</li>
                  <li>• 100 Sovereign Ledgers</li>
                </ul>
              </Card>
              <Card className="bg-background border-border p-6">
                <h3 className="text-xl font-bold mb-4">Digital Units</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Digital Sovereign Ledgers operate on a secure, transparent blockchain with smart contract functionality. All transactions are immutable and verifiable.
                </p>
                <p className="text-sm text-muted-foreground">
                  Accessible via secure digital wallets with multi-factor authentication.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Physical Notes Design */}
        <section className="py-16 bg-background">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">Physical Notes Design</h2>
            <div className="space-y-6">
              <Card className="bg-card border-border p-6">
                <h3 className="text-xl font-bold mb-4">General Features</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li><strong>Material:</strong> Durable synthetic polymer blend with embedded security features</li>
                  <li><strong>Size:</strong> Standardized dimensions for ease of handling and machine processing</li>
                  <li><strong>Color Palette:</strong> Each denomination features a distinct primary color from the Sovereign System palette</li>
                  <li><strong>Finish:</strong> Matte with subtle sheen for security and durability</li>
                </ul>
              </Card>

              <Card className="bg-card border-border p-6">
                <h3 className="text-xl font-bold mb-4">Front Side Design</h3>
                <div className="space-y-3 text-muted-foreground">
                  <p><strong className="text-accent">Central Motif:</strong> The EagleShield emblem prominently displayed, with the Ledger Pillar subtly embossed behind it</p>
                  <p><strong className="text-accent">Portrait:</strong> Stylized, allegorical representation of the Spirit of Integrity or Architect of the Codex</p>
                  <p><strong className="text-accent">Inscriptions:</strong></p>
                  <ul className="ml-4 mt-2 space-y-1 text-sm">
                    <li>• SOVEREIGN IMPERIAL CODEX across the top</li>
                    <li>• Denomination in numerical and textual form</li>
                    <li>• INTEGRITAS SUPREMA along the bottom</li>
                  </ul>
                </div>
              </Card>

              <Card className="bg-card border-border p-6">
                <h3 className="text-xl font-bold mb-4">Security Features</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✓ Micro-printing with intricate patterns</li>
                  <li>✓ Holographic strips featuring the FRDH constellation</li>
                  <li>✓ Color-shifting ink for the EagleShield emblem</li>
                  <li>✓ Transparent security window with watermark of the Tri-Ring Halo</li>
                  <li>✓ Tactile marks for the visually impaired</li>
                  <li>✓ UV-reactive patterns of the Ledger Pillar and FRDH constellation</li>
                </ul>
              </Card>

              <Card className="bg-card border-border p-6">
                <h3 className="text-xl font-bold mb-4">Back Side Design</h3>
                <div className="space-y-3 text-muted-foreground">
                  <p><strong className="text-accent">Central Image:</strong> Depictions of key architectural marvels or natural landscapes within the Sovereign System</p>
                  <p><strong className="text-accent">Examples:</strong></p>
                  <ul className="ml-4 mt-2 space-y-1 text-sm">
                    <li>• Grand Hall of Governance (integrity)</li>
                    <li>• Resilience Towers (resilience)</li>
                    <li>• Crystal Archives (transparency)</li>
                  </ul>
                  <p className="mt-3"><strong className="text-accent">Inscriptions:</strong></p>
                  <ul className="ml-4 mt-2 space-y-1 text-sm">
                    <li>• THE SOVEREIGN LEDGER at the top</li>
                    <li>• Unique serial number</li>
                    <li>• Quote from the Sovereign Imperial Codex</li>
                  </ul>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Digital Integration */}
        <section className="py-16 bg-card">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">Digital Integration</h2>
            <div className="space-y-6">
              <Card className="bg-background border-border p-6">
                <h3 className="text-xl font-bold mb-4">Blockchain Technology</h3>
                <p className="text-muted-foreground mb-3">
                  The Sovereign Ledger digital units operate on a secure, transparent blockchain that ensures immutable records of all transactions. Every transaction is permanently recorded and cannot be altered or deleted.
                </p>
                <p className="text-muted-foreground">
                  The blockchain is maintained by the Ledger Engine, which continuously verifies the integrity of all transactions and ensures compliance with the Sovereign Imperial Codex.
                </p>
              </Card>

              <Card className="bg-background border-border p-6">
                <h3 className="text-xl font-bold mb-4">Smart Contracts</h3>
                <p className="text-muted-foreground mb-3">
                  Built-in smart contract functionality facilitates secure and automated transactions within the Sovereign System. Contracts can be programmed to execute specific conditions automatically.
                </p>
                <p className="text-muted-foreground">
                  All smart contracts are subject to review by the High Tribunal of Integrity to ensure compliance with the Codex.
                </p>
              </Card>

              <Card className="bg-background border-border p-6">
                <h3 className="text-xl font-bold mb-4">Privacy and Transparency</h3>
                <p className="text-muted-foreground mb-3">
                  While the system is transparent, advanced cryptographic techniques protect individual transaction privacy. Only necessary information is revealed, maintaining both security and accountability.
                </p>
                <p className="text-muted-foreground">
                  The system balances transparency (all transactions are recorded) with privacy (transaction details are encrypted and only accessible to authorized parties).
                </p>
              </Card>

              <Card className="bg-background border-border p-6">
                <h3 className="text-xl font-bold mb-4">Accessibility</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✓ Accessible via secure digital wallets on multiple devices</li>
                  <li>✓ Multi-factor authentication for security</li>
                  <li>✓ Compatible with all major operating systems</li>
                  <li>✓ Offline transaction capability with later synchronization</li>
                  <li>✓ Support for both individual and institutional accounts</li>
                </ul>
              </Card>
            </div>
          </div>
        </section>

        {/* Symbolism */}
        <section className="py-16 bg-background">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">Symbolism and Design Philosophy</h2>
            <div className="space-y-6">
              <Card className="bg-card border-border p-6">
                <h3 className="font-bold mb-3 text-accent">The EagleShield</h3>
                <p className="text-muted-foreground">
                  The central emblem on every note represents vigilance and protection. It assures citizens that their currency is backed by the full authority and security of the Sovereign System.
                </p>
              </Card>
              <Card className="bg-card border-border p-6">
                <h3 className="font-bold mb-3 text-accent">The Ledger Pillar</h3>
                <p className="text-muted-foreground">
                  Behind the emblem, the Ledger Pillar represents immutable truth and accountability. Every transaction is recorded in the eternal ledger of the system.
                </p>
              </Card>
              <Card className="bg-card border-border p-6">
                <h3 className="font-bold mb-3 text-accent">Architectural Imagery</h3>
                <p className="text-muted-foreground">
                  The back of each note features landmarks representing the system values: the Grand Hall (integrity), Resilience Towers (resilience), and Crystal Archives (transparency). These remind citizens of the system commitment to these principles.
                </p>
              </Card>
              <Card className="bg-card border-border p-6">
                <h3 className="font-bold mb-3 text-accent">The Motto</h3>
                <p className="text-muted-foreground italic">
                  INTEGRITAS SUPREMA (Integrity Supreme) appears on every note, reinforcing that integrity is the highest principle governing all transactions and the system itself.
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
