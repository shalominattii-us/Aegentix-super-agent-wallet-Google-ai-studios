import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { Link } from "wouter";

export default function DocSpecification() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-card/80 backdrop-blur border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <Link href="/documentation">
            <Button variant="ghost" size="sm" className="gap-2">
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
          <h1 className="text-lg font-bold">SYSTEM SPECIFICATION</h1>
          <div className="w-20"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-b from-primary/10 to-background">
          <div className="container">
            <h1 className="text-5xl font-bold mb-4">Sovereign System Specification</h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Complete technical specification of the Sovereign System architecture, components, interfaces, and data models.
            </p>
          </div>
        </section>

        {/* Table of Contents */}
        <section className="py-16 bg-card">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">Table of Contents</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-background border-border p-6">
                <h3 className="font-bold mb-4">Core Sections</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>1. System Overview</li>
                  <li>2. Architecture Design</li>
                  <li>3. Core Components</li>
                  <li>4. API Specification</li>
                  <li>5. Data Models</li>
                  <li>6. Security Framework</li>
                </ul>
              </Card>
              <Card className="bg-background border-border p-6">
                <h3 className="font-bold mb-4">Technical Sections</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>7. Deployment Architecture</li>
                  <li>8. Integration Patterns</li>
                  <li>9. Performance Characteristics</li>
                  <li>10. Scalability Considerations</li>
                  <li>11. Disaster Recovery</li>
                  <li>12. Appendices and References</li>
                </ul>
              </Card>
            </div>
          </div>
        </section>

        {/* System Overview */}
        <section className="py-16 bg-background">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">1. System Overview</h2>
            <div className="space-y-6">
              <Card className="bg-card border-border p-6">
                <h3 className="font-bold mb-3 text-accent">Purpose</h3>
                <p className="text-muted-foreground">
                  The Sovereign System is a distributed governance platform designed to provide secure, transparent, and accountable administration of complex systems. It integrates computational integrity (Baseline Engine) with ethical accountability (Ledger Engine) to ensure all operations maintain the highest standards of governance.
                </p>
              </Card>
              <Card className="bg-card border-border p-6">
                <h3 className="font-bold mb-3 text-accent">Key Characteristics</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✓ Distributed architecture for high availability</li>
                  <li>✓ Immutable audit trails for accountability</li>
                  <li>✓ Cryptographic security for data protection</li>
                  <li>✓ Modular design for extensibility</li>
                  <li>✓ Multi-stage development framework</li>
                </ul>
              </Card>
            </div>
          </div>
        </section>

        {/* Architecture */}
        <section className="py-16 bg-card">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">2. Architecture Design</h2>
            <div className="space-y-6">
              <Card className="bg-background border-border p-6">
                <h3 className="font-bold mb-3 text-accent">Layered Architecture</h3>
                <p className="text-muted-foreground mb-3">
                  The system employs a four-layer architecture:
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground ml-4">
                  <li><strong>Presentation Layer:</strong> Web UI and client interfaces</li>
                  <li><strong>Application Layer:</strong> Business logic and API endpoints</li>
                  <li><strong>Engine Layer:</strong> Baseline and Ledger Engines</li>
                  <li><strong>Data Layer:</strong> Distributed ledger and persistent storage</li>
                </ul>
              </Card>
              <Card className="bg-background border-border p-6">
                <h3 className="font-bold mb-3 text-accent">Microservices Pattern</h3>
                <p className="text-muted-foreground">
                  Core components are deployed as independent microservices, enabling horizontal scaling, independent deployment, and fault isolation. Services communicate via REST APIs and asynchronous message queues.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Components */}
        <section className="py-16 bg-background">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">3. Core Components</h2>
            <div className="space-y-4">
              <Card className="bg-card border-border p-6">
                <h3 className="font-bold mb-2 text-accent">EagleShield Engine</h3>
                <p className="text-sm text-muted-foreground">
                  Security and vigilance system providing threat detection, access control, and policy enforcement. Implements role-based access control (RBAC) and continuous monitoring.
                </p>
              </Card>
              <Card className="bg-card border-border p-6">
                <h3 className="font-bold mb-2 text-accent">Baseline Engine</h3>
                <p className="text-sm text-muted-foreground">
                  Computational foundation for truth verification. Processes facts, validates data integrity, and maintains immutable records. Implements cryptographic hashing and verification protocols.
                </p>
              </Card>
              <Card className="bg-card border-border p-6">
                <h3 className="font-bold mb-2 text-accent">Ledger Engine</h3>
                <p className="text-sm text-muted-foreground">
                  Accountability and ethics framework. Records all transactions, maintains audit trails, and ensures compliance with governance rules. Implements distributed consensus mechanisms.
                </p>
              </Card>
              <Card className="bg-card border-border p-6">
                <h3 className="font-bold mb-2 text-accent">Codex API</h3>
                <p className="text-sm text-muted-foreground">
                  RESTful interface for accessing governance rules and principles. Provides endpoints for querying the Sovereign Imperial Codex and executing authorized operations.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* API Specification */}
        <section className="py-16 bg-card">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">4. API Specification</h2>
            <Card className="bg-background border-border p-6 mb-6">
              <h3 className="font-bold mb-3">Base URL</h3>
              <p className="font-mono text-sm bg-black p-3 rounded text-gray-300">https://api.sovereignsystem.io/v2</p>
            </Card>
            <div className="space-y-4">
              <Card className="bg-background border-border p-6">
                <h3 className="font-bold mb-3 text-accent">Authentication</h3>
                <p className="text-sm text-muted-foreground mb-2">All API requests require Bearer token authentication:</p>
                <p className="font-mono text-xs bg-black p-2 rounded text-gray-300">Authorization: Bearer token</p>
              </Card>
              <Card className="bg-background border-border p-6">
                <h3 className="font-bold mb-3 text-accent">Core Endpoints</h3>
                <ul className="space-y-2 text-sm text-muted-foreground font-mono">
                  <li>GET /codex/principles - Retrieve governance principles</li>
                  <li>POST /transactions - Submit new transaction</li>
                  <li>GET /status - System health check</li>
                  <li>GET /audit/logs - Retrieve audit trail</li>
                </ul>
              </Card>
            </div>
          </div>
        </section>

        {/* Security */}
        <section className="py-16 bg-background">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">6. Security Framework</h2>
            <div className="space-y-4">
              <Card className="bg-card border-border p-6">
                <h3 className="font-bold mb-2 text-accent">Encryption</h3>
                <p className="text-sm text-muted-foreground">
                  All data in transit uses TLS 1.3 encryption. Data at rest uses AES-256 encryption with hardware security module (HSM) key management.
                </p>
              </Card>
              <Card className="bg-card border-border p-6">
                <h3 className="font-bold mb-2 text-accent">Authentication and Authorization</h3>
                <p className="text-sm text-muted-foreground">
                  Multi-factor authentication (MFA) required for all administrative access. Role-based access control (RBAC) enforces least-privilege principle.
                </p>
              </Card>
              <Card className="bg-card border-border p-6">
                <h3 className="font-bold mb-2 text-accent">Audit and Compliance</h3>
                <p className="text-sm text-muted-foreground">
                  Immutable audit logs record all operations. Compliance monitoring ensures adherence to governance rules. Regular security assessments and penetration testing.
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
