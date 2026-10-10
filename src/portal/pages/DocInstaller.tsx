import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { Link } from "wouter";

export default function DocInstaller() {
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
          <h1 className="text-lg font-bold">INSTALLER MANUAL</h1>
          <div className="w-20"></div>
        </div>
      </header>

      <main className="pt-20">
        <section className="py-12 bg-gradient-to-b from-primary/10 to-background">
          <div className="container">
            <h1 className="text-5xl font-bold mb-4">Installer Manual</h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Step-by-step guide for installing the Sovereign System on your infrastructure.
            </p>
          </div>
        </section>

        <section className="py-16 bg-card">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">Prerequisites</h2>
            <div className="space-y-4">
              <Card className="bg-background border-border p-6">
                <h3 className="font-bold mb-3 text-accent">System Requirements</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• CPU: 8 cores minimum (16 recommended)</li>
                  <li>• RAM: 16 GB minimum (32 GB recommended)</li>
                  <li>• Storage: 100 GB minimum (500 GB recommended)</li>
                  <li>• Network: 1 Gbps connection</li>
                  <li>• OS: Linux (Ubuntu 20.04+) or Windows Server 2019+</li>
                </ul>
              </Card>
              <Card className="bg-background border-border p-6">
                <h3 className="font-bold mb-3 text-accent">Required Software</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Docker 20.10 or later</li>
                  <li>• Docker Compose 1.29 or later</li>
                  <li>• Kubernetes 1.24 or later (optional)</li>
                  <li>• Git 2.30 or later</li>
                  <li>• PowerShell 7.0+ (Windows)</li>
                </ul>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 bg-background">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">Installation Steps</h2>
            <div className="space-y-6">
              <Card className="bg-card border-border p-6">
                <h3 className="text-lg font-bold mb-3">Step 1: Download Release</h3>
                <p className="text-muted-foreground text-sm mb-3">
                  Download the latest release from the Distribution Portal or GitHub.
                </p>
                <div className="bg-black p-3 rounded font-mono text-xs text-gray-300">
                  <p>wget https://releases.sovereignsystem.io/v2.0.0/sovereign-system.tar.gz</p>
                  <p>tar -xzf sovereign-system.tar.gz</p>
                </div>
              </Card>

              <Card className="bg-card border-border p-6">
                <h3 className="text-lg font-bold mb-3">Step 2: Verify Checksums</h3>
                <p className="text-muted-foreground text-sm mb-3">
                  Verify file integrity using SHA256 checksums.
                </p>
                <div className="bg-black p-3 rounded font-mono text-xs text-gray-300">
                  <p>sha256sum -c checksums.sha256</p>
                </div>
              </Card>

              <Card className="bg-card border-border p-6">
                <h3 className="text-lg font-bold mb-3">Step 3: Run Bootstrap</h3>
                <p className="text-muted-foreground text-sm mb-3">
                  Execute the bootstrap script to initialize the system.
                </p>
                <div className="bg-black p-3 rounded font-mono text-xs text-gray-300">
                  <p>chmod +x bootstrap.sh</p>
                  <p>./bootstrap.sh</p>
                </div>
              </Card>

              <Card className="bg-card border-border p-6">
                <h3 className="text-lg font-bold mb-3">Step 4: Configure System</h3>
                <p className="text-muted-foreground text-sm mb-3">
                  Edit configuration files to match your environment.
                </p>
                <div className="bg-black p-3 rounded font-mono text-xs text-gray-300">
                  <p>cp config.example.yml config.yml</p>
                  <p>nano config.yml</p>
                </div>
              </Card>

              <Card className="bg-card border-border p-6">
                <h3 className="text-lg font-bold mb-3">Step 5: Deploy Services</h3>
                <p className="text-muted-foreground text-sm mb-3">
                  Start all system services using Docker Compose.
                </p>
                <div className="bg-black p-3 rounded font-mono text-xs text-gray-300">
                  <p>docker-compose up -d</p>
                </div>
              </Card>

              <Card className="bg-card border-border p-6">
                <h3 className="text-lg font-bold mb-3">Step 6: Verify Installation</h3>
                <p className="text-muted-foreground text-sm mb-3">
                  Check that all services are running correctly.
                </p>
                <div className="bg-black p-3 rounded font-mono text-xs text-gray-300">
                  <p>docker-compose ps</p>
                  <p>curl http://localhost:8080/health</p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 bg-card">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">Post-Installation</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-background border-border p-6">
                <h3 className="font-bold mb-3 text-accent">Initial Setup</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Create admin user account</li>
                  <li>• Configure authentication</li>
                  <li>• Set up backup schedules</li>
                  <li>• Configure monitoring</li>
                </ul>
              </Card>
              <Card className="bg-background border-border p-6">
                <h3 className="font-bold mb-3 text-accent">Security Hardening</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Enable firewall rules</li>
                  <li>• Configure SSL certificates</li>
                  <li>• Set up VPN access</li>
                  <li>• Enable audit logging</li>
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
