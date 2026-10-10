import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { Link } from "wouter";

export default function DocOperator() {
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
          <h1 className="text-lg font-bold">OPERATOR GUIDE</h1>
          <div className="w-20"></div>
        </div>
      </header>

      <main className="pt-20">
        <section className="py-12 bg-gradient-to-b from-primary/10 to-background">
          <div className="container">
            <h1 className="text-5xl font-bold mb-4">Operator Guide</h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Practical guide for system operators and administrators managing the Sovereign System.
            </p>
          </div>
        </section>

        <section className="py-16 bg-card">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">System Administration</h2>
            <div className="space-y-6">
              <Card className="bg-background border-border p-6">
                <h3 className="text-lg font-bold mb-3">Startup and Shutdown</h3>
                <p className="text-muted-foreground text-sm mb-3">
                  Proper startup and shutdown procedures ensure data integrity and system stability.
                </p>
                <div className="bg-black p-3 rounded font-mono text-xs text-gray-300">
                  <p>docker-compose up -d</p>
                  <p>docker-compose down</p>
                </div>
              </Card>
              <Card className="bg-background border-border p-6">
                <h3 className="text-lg font-bold mb-3">Monitoring and Health Checks</h3>
                <p className="text-muted-foreground text-sm mb-3">
                  Continuously monitor system health and performance metrics.
                </p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Check container status: docker ps</li>
                  <li>• View logs: docker logs [container]</li>
                  <li>• Health endpoint: GET /health</li>
                  <li>• Metrics: GET /metrics</li>
                </ul>
              </Card>
              <Card className="bg-background border-border p-6">
                <h3 className="text-lg font-bold mb-3">Backup and Recovery</h3>
                <p className="text-muted-foreground text-sm mb-3">
                  Regular backups ensure data protection and disaster recovery capability.
                </p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Daily automated backups to secure storage</li>
                  <li>• Weekly full system snapshots</li>
                  <li>• Monthly off-site backup replication</li>
                  <li>• Quarterly recovery testing</li>
                </ul>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 bg-background">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">Troubleshooting</h2>
            <div className="space-y-4">
              <Card className="bg-card border-border p-6">
                <h3 className="font-bold mb-2 text-accent">Service Not Responding</h3>
                <p className="text-sm text-muted-foreground">
                  Check container status, review logs for errors, and verify network connectivity. Restart the affected service if necessary.
                </p>
              </Card>
              <Card className="bg-card border-border p-6">
                <h3 className="font-bold mb-2 text-accent">High CPU Usage</h3>
                <p className="text-sm text-muted-foreground">
                  Monitor process activity, check for runaway queries, and review recent deployments. Scale horizontally if load is legitimate.
                </p>
              </Card>
              <Card className="bg-card border-border p-6">
                <h3 className="font-bold mb-2 text-accent">Database Connection Issues</h3>
                <p className="text-sm text-muted-foreground">
                  Verify database is running, check connection strings, and review firewall rules. Restart database service if needed.
                </p>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 bg-card">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">Best Practices</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-background border-border p-6">
                <h3 className="font-bold mb-3 text-accent">Security</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Rotate credentials regularly</li>
                  <li>• Enable MFA for all accounts</li>
                  <li>• Review access logs weekly</li>
                  <li>• Keep systems patched</li>
                </ul>
              </Card>
              <Card className="bg-background border-border p-6">
                <h3 className="font-bold mb-3 text-accent">Performance</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Monitor resource utilization</li>
                  <li>• Optimize database queries</li>
                  <li>• Scale proactively</li>
                  <li>• Cache frequently accessed data</li>
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
