import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, BookOpen, Wrench, Users, Download } from "lucide-react";
import { Link } from "wouter";

export default function Documentation() {
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
          <h1 className="text-lg font-bold">DOCUMENTATION</h1>
          <div className="w-20"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-b from-primary/10 to-background">
          <div className="container">
            <h1 className="text-5xl font-bold mb-4">Documentation Hub</h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Comprehensive guides and specifications for understanding, installing, and operating the Sovereign System.
            </p>
          </div>
        </section>

        {/* Documentation Categories */}
        <section className="py-16 bg-card">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">Documentation Categories</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Specification */}
              <Card className="bg-background border-border p-6 hover:border-primary transition">
                <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663117391247/mjgHKLKvY4zrUjqQDBMaLA/docs_specification_hero-XMW4f3TiT2j4vGPi3kDGQi.webp" alt="System Specification" className="w-full h-32 object-cover rounded mb-4" />
                <div className="flex items-start gap-4 mb-4">
                  <BookOpen className="w-8 h-8 text-accent flex-shrink-0" />
                  <h3 className="text-xl font-bold">System Specification</h3>
                </div>
                <p className="text-muted-foreground text-sm mb-4">
                  Complete technical specification of the Sovereign System, including architecture, components, APIs, and data structures.
                </p>
                <Link href="/docs/specification">
                  <Button variant="outline" size="sm" className="w-full">
                    Read Specification
                  </Button>
                </Link>
              </Card>

              {/* Doctrine */}
              <Card className="bg-background border-border p-6 hover:border-primary transition">
                <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663117391247/mjgHKLKvY4zrUjqQDBMaLA/docs_doctrine_hero-ecNUsmoeCdLNeUb2pzv9zK.webp" alt="Sovereign Doctrine" className="w-full h-32 object-cover rounded mb-4" />
                <div className="flex items-start gap-4 mb-4">
                  <BookOpen className="w-8 h-8 text-accent flex-shrink-0" />
                  <h3 className="text-xl font-bold">Sovereign Doctrine</h3>
                </div>
                <p className="text-muted-foreground text-sm mb-4">
                  Philosophical and operational principles governing the Sovereign System. Covers governance, ethics, and core values.
                </p>
                <Link href="/docs/doctrine">
                  <Button variant="outline" size="sm" className="w-full">
                    Read Doctrine
                  </Button>
                </Link>
              </Card>

              {/* Operator Guide */}
              <Card className="bg-background border-border p-6 hover:border-primary transition">
                <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663117391247/mjgHKLKvY4zrUjqQDBMaLA/docs_operator_hero-P9Jn2jaGLBvxn22LGXdR9G.webp" alt="Operator Guide" className="w-full h-32 object-cover rounded mb-4" />
                <div className="flex items-start gap-4 mb-4">
                  <Wrench className="w-8 h-8 text-accent flex-shrink-0" />
                  <h3 className="text-xl font-bold">Operator Guide</h3>
                </div>
                <p className="text-muted-foreground text-sm mb-4">
                  Practical guide for system operators and administrators. Covers configuration, maintenance, troubleshooting, and best practices.
                </p>
                <Link href="/docs/operator">
                  <Button variant="outline" size="sm" className="w-full">
                    Read Operator Guide
                  </Button>
                </Link>
              </Card>

              {/* Installer Manual */}
              <Card className="bg-background border-border p-6 hover:border-primary transition">
                <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663117391247/mjgHKLKvY4zrUjqQDBMaLA/docs_installer_hero-edWkK3vmCszCS9T6K3eZiD.webp" alt="Installer Manual" className="w-full h-32 object-cover rounded mb-4" />
                <div className="flex items-start gap-4 mb-4">
                  <Download className="w-8 h-8 text-accent flex-shrink-0" />
                  <h3 className="text-xl font-bold">Installer Manual</h3>
                </div>
                <p className="text-muted-foreground text-sm mb-4">
                  Step-by-step installation guide for the Sovereign System. Covers prerequisites, deployment options, and post-installation setup.
                </p>
                <Link href="/docs/installer">
                  <Button variant="outline" size="sm" className="w-full">
                    Read Installer Manual
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        </section>

        {/* Quick Reference */}
        <section className="py-16 bg-background">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">Quick Reference</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-card border-border p-6">
                <h3 className="font-bold mb-3 text-accent">System Requirements</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Docker 20.10+</li>
                  <li>• Kubernetes 1.24+</li>
                  <li>• 16GB RAM minimum</li>
                  <li>• 100GB storage</li>
                </ul>
              </Card>
              <Card className="bg-card border-border p-6">
                <h3 className="font-bold mb-3 text-accent">Default Ports</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• API: 8080</li>
                  <li>• UI: 3000</li>
                  <li>• Database: 5432</li>
                  <li>• Registry: 5000</li>
                </ul>
              </Card>
              <Card className="bg-card border-border p-6">
                <h3 className="font-bold mb-3 text-accent">Key Commands</h3>
                <ul className="space-y-2 text-sm text-muted-foreground font-mono text-xs">
                  <li>• docker-compose up</li>
                  <li>• kubectl apply -f</li>
                  <li>• sovereign-cli status</li>
                  <li>• ./bootstrap.ps1</li>
                </ul>
              </Card>
            </div>
          </div>
        </section>

        {/* Getting Started */}
        <section className="py-16 bg-card">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">Getting Started</h2>
            <div className="space-y-6">
              <Card className="bg-background border-border p-6">
                <h3 className="text-lg font-bold mb-3">1. Prerequisites</h3>
                <p className="text-muted-foreground text-sm">
                  Ensure your system meets the minimum requirements. Install Docker, Kubernetes, and required dependencies as outlined in the Installer Manual.
                </p>
              </Card>
              <Card className="bg-background border-border p-6">
                <h3 className="text-lg font-bold mb-3">2. Download & Extract</h3>
                <p className="text-muted-foreground text-sm">
                  Download the latest release from the Distribution Portal. Extract the archive and verify checksums to ensure integrity.
                </p>
              </Card>
              <Card className="bg-background border-border p-6">
                <h3 className="text-lg font-bold mb-3">3. Run Bootstrap</h3>
                <p className="text-muted-foreground text-sm">
                  Execute the bootstrap script (bootstrap.ps1 for Windows, bootstrap.sh for Linux) to initialize the system and configure components.
                </p>
              </Card>
              <Card className="bg-background border-border p-6">
                <h3 className="text-lg font-bold mb-3">4. Verify Installation</h3>
                <p className="text-muted-foreground text-sm">
                  Use the sovereign-cli tool to verify all components are running correctly. Check system status and review logs for any issues.
                </p>
              </Card>
              <Card className="bg-background border-border p-6">
                <h3 className="text-lg font-bold mb-3">5. Configure & Deploy</h3>
                <p className="text-muted-foreground text-sm">
                  Follow the Operator Guide to configure the system for your environment. Deploy to production using the provided deployment scripts.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Support & Resources */}
        <section className="py-16 bg-background">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">Support & Resources</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-card border-border p-6">
                <h3 className="font-bold mb-3 text-accent">Documentation</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• API Reference</li>
                  <li>• Architecture Diagrams</li>
                  <li>• Configuration Guide</li>
                  <li>• Troubleshooting Guide</li>
                </ul>
              </Card>
              <Card className="bg-card border-border p-6">
                <h3 className="font-bold mb-3 text-accent">Community</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• GitHub Repository</li>
                  <li>• Issue Tracker</li>
                  <li>• Discussion Forums</li>
                  <li>• Security Reports</li>
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
