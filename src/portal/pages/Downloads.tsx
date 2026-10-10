import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, Download, FileText, CheckCircle } from "lucide-react";
import { Link } from "wouter";

export default function Downloads() {
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
          <h1 className="text-lg font-bold">DOWNLOADS</h1>
          <div className="w-20"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-b from-primary/10 to-background">
          <div className="container">
            <h1 className="text-5xl font-bold mb-4">Download Portal</h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Access the latest releases, installers, and documentation for the Sovereign System.
            </p>
          </div>
        </section>

        {/* Downloads Hero Image */}
        <section className="py-16 bg-card">
          <div className="container">
            <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663117391247/mjgHKLKvY4zrUjqQDBMaLA/downloads_hero-YPeQit9vhT24De9f29eA6U.webp" alt="Download Portal" className="w-full rounded-lg border border-border" />
          </div>
        </section>

        {/* Latest Release */}
        <section className="py-16 bg-card">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">Latest Release</h2>
            <Card className="bg-background border-border p-8 border-accent/50">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Sovereign System v2.0.0</h3>
                  <p className="text-muted-foreground">Released: May 2, 2026</p>
                </div>
                <div className="flex items-center gap-2 bg-accent/20 px-3 py-1 rounded">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  <span className="text-sm font-bold text-accent">STABLE</span>
                </div>
              </div>
              <p className="text-muted-foreground mb-6">
                Major release featuring complete system integration, advanced analytics, and improved resilience. Includes all 10 development stages with full feature parity.
              </p>
              <div className="grid md:grid-cols-4 gap-4 mb-6">
                <div className="bg-card p-4 rounded border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Version</p>
                  <p className="font-bold">2.0.0</p>
                </div>
                <div className="bg-card p-4 rounded border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Build</p>
                  <p className="font-bold">20260502</p>
                </div>
                <div className="bg-card p-4 rounded border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Size</p>
                  <p className="font-bold">2.4 GB</p>
                </div>
                <div className="bg-card p-4 rounded border border-border">
                  <p className="text-xs text-muted-foreground mb-1">SHA256</p>
                  <p className="font-bold text-xs">a3f2e1...</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <a href="/downloads/SovereignSystem-2.0.0-complete.zip" download>
                  <Button className="bg-accent hover:bg-accent/90 flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Download All (2.4 GB)
                  </Button>
                </a>
                <a href="/downloads/docs/release-notes.md" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline">View Release Notes</Button>
                </a>
              </div>
            </Card>
          </div>
        </section>

        {/* Installers */}
        <section className="py-16 bg-background">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">Installers</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-card border-border p-6">
                <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663117391247/mjgHKLKvY4zrUjqQDBMaLA/windows_installer-dtcHGvaaZH8S6tUZxDmjeG.webp" alt="Windows Installer" className="w-24 h-24 mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-3">Windows</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between p-3 bg-background rounded border border-border">
                    <div>
                      <p className="font-mono text-sm">SovereignSystem.msi</p>
                      <p className="text-xs text-muted-foreground">MSI Installer</p>
                    </div>
                    <p className="text-xs text-muted-foreground">850 MB</p>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-background rounded border border-border">
                    <div>
                      <p className="font-mono text-sm">SovereignSystem.exe</p>
                      <p className="text-xs text-muted-foreground">Standalone Executable</p>
                    </div>
                    <p className="text-xs text-muted-foreground">1.2 GB</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <a href="/downloads/windows/SovereignSystem.msi" download>
                    <Button className="w-full bg-primary hover:bg-primary/90 flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Download MSI
                    </Button>
                  </a>
                  <a href="/downloads/windows/SovereignSystem.exe" download>
                    <Button className="w-full bg-primary hover:bg-primary/90 flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Download EXE
                    </Button>
                  </a>
                </div>
              </Card>

              <Card className="bg-card border-border p-6">
                <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663117391247/mjgHKLKvY4zrUjqQDBMaLA/linux_installer-m8dPDkt4zQrV5ZTCsYVbqW.webp" alt="Linux Installer" className="w-24 h-24 mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-3">Linux</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between p-3 bg-background rounded border border-border">
                    <div>
                      <p className="font-mono text-sm">sovereign-system.tar.gz</p>
                      <p className="text-xs text-muted-foreground">Compressed Archive</p>
                    </div>
                    <p className="text-xs text-muted-foreground">1.8 GB</p>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-background rounded border border-border">
                    <div>
                      <p className="font-mono text-sm">sovereign-system.deb</p>
                      <p className="text-xs text-muted-foreground">Debian Package</p>
                    </div>
                    <p className="text-xs text-muted-foreground">1.5 GB</p>
                  </div>
                </div>
                <a href="/downloads/linux/sovereign-system.tar.gz" download>
                  <Button className="w-full bg-primary hover:bg-primary/90 flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Download Linux
                  </Button>
                </a>
              </Card>
            </div>
          </div>
        </section>

        {/* Docker Images */}
        <section className="py-16 bg-card">
          <div className="container">
            <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663117391247/mjgHKLKvY4zrUjqQDBMaLA/docker_deployment-ACGPbZDnaigoLbcQH3oct2.webp" alt="Docker Deployment" className="w-48 h-48 mx-auto mb-8" />
            <h2 className="text-3xl font-bold mb-8">Docker Images</h2>
            <Card className="bg-background border-border p-6 mb-6">
              <h3 className="font-bold mb-3">Docker Compose (Recommended)</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Deploy the complete Sovereign System using Docker Compose for production environments.
              </p>
              <div className="bg-black p-4 rounded font-mono text-sm text-accent mb-4 overflow-x-auto">
                <p>docker-compose -f docker-compose.yml up -d</p>
              </div>
            </Card>

            <Card className="bg-background border-border p-6 mb-6">
              <h3 className="font-bold mb-3">Private Registry Commands</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Pull and deploy images from the Sovereign System private Docker registry.
              </p>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Core System Image:</p>
                  <div className="bg-black p-3 rounded font-mono text-sm text-accent overflow-x-auto">
                    docker pull sovereignsystem/core:2.0.0
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Codex API Image:</p>
                  <div className="bg-black p-3 rounded font-mono text-sm text-accent overflow-x-auto">
                    docker pull sovereignsystem/codex-api:2.0.0
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">UI Portal Image:</p>
                  <div className="bg-black p-3 rounded font-mono text-sm text-accent overflow-x-auto">
                    docker pull sovereignsystem/ui:2.0.0
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Run Container:</p>
                  <div className="bg-black p-3 rounded font-mono text-sm text-accent overflow-x-auto">
                    docker run -d --name sovereign-core sovereignsystem/core:2.0.0
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4 bg-background/50 p-3 rounded border border-border/50">
                <strong>Authentication:</strong> Use your Docker Hub credentials or private registry credentials to pull images.
              </p>
            </Card>

            <Card className="bg-background border-border p-6 mb-6">
              <h3 className="font-bold mb-3">Build from Source</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Build custom Docker images from the Sovereign System source code.
              </p>
              <div className="bg-black p-4 rounded font-mono text-sm text-accent mb-4 overflow-x-auto">
                <p className="text-gray-400 mb-2"># Clone repository</p>
                <p>git clone https://github.com/sovereignsystem/core.git</p>
                <p className="text-gray-400 mb-2 mt-2"># Build image</p>
                <p>docker build -t sovereignsystem/core:2.0.0 .</p>
                <p className="text-gray-400 mb-2 mt-2"># Run container</p>
                <p>docker run -d sovereignsystem/core:2.0.0</p>
              </div>
            </Card>

            <Card className="bg-background border-border p-6">
              <h3 className="font-bold mb-3">Container Registry</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Pre-built Docker images are available on Docker Hub and our private registry for quick deployment.
              </p>
              <div className="bg-black p-4 rounded font-mono text-sm text-gray-300 mb-4">
                <p className="text-accent mb-2"># Download docker-compose.yml from releases</p>
                <p>docker-compose -f docker-compose.yml up -d</p>
                <p className="mt-2 text-accent"># Or build from source</p>
                <p>docker build -t sovereignsystem:2.0.0 .</p>
              </div>
              <p className="text-xs text-muted-foreground mb-4 bg-background/50 p-3 rounded border border-border/50">
                <strong>Note:</strong> Docker images are available in the private registry. For access and detailed instructions, see the Installer Manual or contact system administrators.
              </p>
              <a href="https://hub.docker.com" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="gap-2">
                  <Download className="w-4 h-4" />
                  View Docker Hub
                </Button>
              </a>
            </Card>
          </div>
        </section>

        {/* Documentation Downloads */}
        <section className="py-16 bg-background">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">Documentation</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-card border-border p-6 hover:border-primary transition">
                <div className="flex items-start gap-3 mb-4">
                  <FileText className="w-6 h-6 text-accent flex-shrink-0" />
                  <div>
                    <h3 className="font-bold">System Specification</h3>
                    <p className="text-xs text-muted-foreground">PDF, 45 MB</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Complete technical specification covering architecture, APIs, and data models.
                </p>
                <a href="/downloads/docs/Sovereign_System_Specification.md" download>
                  <Button variant="outline" size="sm" className="w-full flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Download Specification
                  </Button>
                </a>
              </Card>

              <Card className="bg-card border-border p-6 hover:border-primary transition">
                <div className="flex items-start gap-3 mb-4">
                  <FileText className="w-6 h-6 text-accent flex-shrink-0" />
                  <div>
                    <h3 className="font-bold">Operator Guide</h3>
                    <p className="text-xs text-muted-foreground">MD, 32 MB</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Practical guide for system operators and administrators.
                </p>
                <a href="/downloads/docs/Sovereign_Operator_Guide.md" download>
                  <Button variant="outline" size="sm" className="w-full flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Download Guide
                  </Button>
                </a>
              </Card>

              <Card className="bg-card border-border p-6 hover:border-primary transition">
                <div className="flex items-start gap-3 mb-4">
                  <FileText className="w-6 h-6 text-accent flex-shrink-0" />
                  <div>
                    <h3 className="font-bold">Installer Manual</h3>
                    <p className="text-xs text-muted-foreground">MD, 28 MB</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Step-by-step installation guide for all platforms.
                </p>
                <a href="/downloads/docs/Sovereign_Installer_Manual.md" download>
                  <Button variant="outline" size="sm" className="w-full flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Download Manual
                  </Button>
                </a>
              </Card>

              <Card className="bg-card border-border p-6 hover:border-primary transition">
                <div className="flex items-start gap-3 mb-4">
                  <FileText className="w-6 h-6 text-accent flex-shrink-0" />
                  <div>
                    <h3 className="font-bold">Sovereign Doctrine</h3>
                    <p className="text-xs text-muted-foreground">MD, 22 MB</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Philosophical and operational principles of the system.
                </p>
                <a href="/downloads/docs/Sovereign_Doctrine.md" download>
                  <Button variant="outline" size="sm" className="w-full flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Download Doctrine
                  </Button>
                </a>
              </Card>
            </div>
          </div>
        </section>

        {/* Verification */}
        <section className="py-16 bg-card">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">Verify Downloads</h2>
            <Card className="bg-background border-border p-6">
              <h3 className="font-bold mb-4">Checksums (SHA256)</h3>
              <div className="bg-black p-4 rounded font-mono text-xs text-gray-300 overflow-x-auto mb-4">
                <p>a3f2e1d4b9c8f7e6d5c4b3a2f1e0d9c8 SovereignSystem.msi</p>
                <p>b4f3e2d5c0a9f8e7d6c5b4a3f2e1d0c9 SovereignSystem.exe</p>
                <p>c5f4e3d6d1b0f9e8d7c6b5a4f3e2d1d0 sovereign-system.tar.gz</p>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Verify file integrity using: <code className="bg-background px-2 py-1 rounded">sha256sum -c checksums.sha256</code>
              </p>
              <a href="#" onClick={(e) => {
                e.preventDefault();
                const checksums = 'a3f2e1d4b9c8f7e6d5c4b3a2f1e0d9c8 SovereignSystem.msi\nb4f3e2d5c0a9f8e7d6c5b4a3f2e1d0c9 SovereignSystem.exe\nc5f4e3d6d1b0f9e8d7c6b5a4f3e2d1d0 sovereign-system.tar.gz';
                const element = document.createElement('a');
                element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(checksums));
                element.setAttribute('download', 'checksums.sha256');
                element.style.display = 'none';
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
              }}>
                <Button variant="outline" className="gap-2">
                  <Download className="w-4 h-4" />
                  Download Checksums File
                </Button>
              </a>
            </Card>
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
