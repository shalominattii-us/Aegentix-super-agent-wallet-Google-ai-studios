import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Activity, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { Link } from "wouter";
import { useState, useEffect } from "react";

export default function SystemStatus() {
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setLastUpdate(new Date());
    }, 30000); // Update every 30 seconds
    return () => clearInterval(timer);
  }, []);

  const components = [
    {
      name: "Core Engine",
      status: "operational",
      uptime: 99.98,
      latency: "12ms",
      lastCheck: "2 seconds ago",
      details: "All systems nominal"
    },
    {
      name: "Intelligence Fabric",
      status: "operational",
      uptime: 99.95,
      latency: "45ms",
      lastCheck: "5 seconds ago",
      details: "Correlation engines running at 87% capacity"
    },
    {
      name: "Autonomy Layer",
      status: "operational",
      uptime: 99.99,
      latency: "8ms",
      lastCheck: "1 second ago",
      details: "Self-healing systems active"
    },
    {
      name: "Continuity Engine",
      status: "operational",
      uptime: 100.0,
      latency: "3ms",
      lastCheck: "3 seconds ago",
      details: "Backup systems synchronized"
    },
    {
      name: "Codex API",
      status: "operational",
      uptime: 99.97,
      latency: "28ms",
      lastCheck: "4 seconds ago",
      details: "API responding normally"
    },
    {
      name: "Data Storage",
      status: "operational",
      uptime: 99.99,
      latency: "15ms",
      lastCheck: "2 seconds ago",
      details: "Storage utilization: 67%"
    }
  ];

  const metrics = [
    { label: "Requests/sec", value: "2,847", trend: "+12%" },
    { label: "Avg Latency", value: "24ms", trend: "-3%" },
    { label: "Error Rate", value: "0.02%", trend: "-0.01%" },
    { label: "Uptime", value: "99.97%", trend: "Stable" }
  ];

  const incidents = [
    {
      time: "2 hours ago",
      severity: "info",
      title: "Scheduled Maintenance",
      description: "Routine database optimization completed successfully"
    },
    {
      time: "1 day ago",
      severity: "warning",
      title: "High Load Event",
      description: "System handled 5x normal traffic load without degradation"
    },
    {
      time: "3 days ago",
      severity: "info",
      title: "Security Patch Applied",
      description: "Zero-day vulnerability patched across all components"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "text-green-500";
      case "degraded":
        return "text-yellow-500";
      case "offline":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "degraded":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case "offline":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Activity className="w-5 h-5" />;
    }
  };

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
          <h1 className="text-lg font-bold">SYSTEM STATUS</h1>
          <Button variant="outline" size="sm" onClick={() => setLastUpdate(new Date())}>
            Refresh
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-b from-primary/10 to-background">
          <div className="container">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-5xl font-bold mb-4">System Status</h1>
                <p className="text-xl text-muted-foreground">
                  Real-time monitoring of Sovereign System health and performance
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span className="text-2xl font-bold text-green-500">All Systems Operational</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Last updated: {lastUpdate.toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Key Metrics */}
        <section className="py-16 bg-card">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">Key Metrics</h2>
            <div className="grid md:grid-cols-4 gap-6">
              {metrics.map((metric, idx) => (
                <Card key={idx} className="bg-background border-border p-6">
                  <p className="text-sm text-muted-foreground mb-2">{metric.label}</p>
                  <div className="flex items-baseline justify-between">
                    <p className="text-3xl font-bold">{metric.value}</p>
                    <span className="text-sm text-accent">{metric.trend}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Component Status */}
        <section className="py-16 bg-background">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">Component Status</h2>
            <div className="space-y-4">
              {components.map((component, idx) => (
                <Card key={idx} className="bg-card border-border p-6 hover:border-primary transition">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(component.status)}
                      <div>
                        <h3 className="font-bold text-lg">{component.name}</h3>
                        <p className="text-xs text-muted-foreground">{component.details}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold capitalize ${getStatusColor(component.status)}`}>
                        {component.status}
                      </p>
                      <p className="text-xs text-muted-foreground">{component.lastCheck}</p>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Uptime</p>
                      <p className="font-bold">{component.uptime}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Latency</p>
                      <p className="font-bold">{component.latency}</p>
                    </div>
                    <div>
                      <div className="w-full bg-background rounded h-2">
                        <div
                          className="bg-accent h-2 rounded"
                          style={{ width: `${component.uptime}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Incidents */}
        <section className="py-16 bg-card">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">Recent Activity</h2>
            <div className="space-y-4">
              {incidents.map((incident, idx) => (
                <Card key={idx} className="bg-background border-border p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {incident.severity === "info" && (
                        <CheckCircle className="w-5 h-5 text-blue-500" />
                      )}
                      {incident.severity === "warning" && (
                        <AlertCircle className="w-5 h-5 text-yellow-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline justify-between mb-1">
                        <h3 className="font-bold">{incident.title}</h3>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {incident.time}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{incident.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* SLA Information */}
        <section className="py-16 bg-background">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">Service Level Agreement</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-card border-border p-6">
                <h3 className="font-bold mb-3">Availability SLA</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  The Sovereign System guarantees 99.95% uptime across all components.
                </p>
                <div className="bg-black p-3 rounded font-mono text-xs text-accent">
                  Current: 99.97% ✓
                </div>
              </Card>
              <Card className="bg-card border-border p-6">
                <h3 className="font-bold mb-3">Response Time SLA</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Average response time must not exceed 100ms for 99% of requests.
                </p>
                <div className="bg-black p-3 rounded font-mono text-xs text-accent">
                  Current: 24ms ✓
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
