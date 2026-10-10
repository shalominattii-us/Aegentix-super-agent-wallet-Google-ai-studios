import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Copy, Code, CheckCircle, AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

interface APIEndpoint {
  method: string;
  path: string;
  harness: string;
  status: "active" | "testing" | "deprecated";
  description: string;
  parameters?: string[];
  responseCode: number;
}

const mockEndpoints: APIEndpoint[] = [
  // Installation Harness
  {
    method: "POST",
    path: "/api/v1/install/validate",
    harness: "Installation Validation",
    status: "active",
    description: "Validate system requirements before installation",
    parameters: ["os", "architecture", "memory"],
    responseCode: 200,
  },
  {
    method: "POST",
    path: "/api/v1/install/begin",
    harness: "Installation Validation",
    status: "active",
    description: "Initiate installation process",
    parameters: ["package_id", "target_path", "operator_id"],
    responseCode: 202,
  },
  {
    method: "GET",
    path: "/api/v1/install/status",
    harness: "Installation Validation",
    status: "active",
    description: "Get current installation status",
    parameters: ["session_id"],
    responseCode: 200,
  },
  {
    method: "POST",
    path: "/api/v1/install/verify",
    harness: "Installation Validation",
    status: "active",
    description: "Verify installation integrity",
    parameters: ["installation_id", "checksum"],
    responseCode: 200,
  },

  // Operational Integrity Harness
  {
    method: "GET",
    path: "/api/v1/system/health",
    harness: "Operational Integrity",
    status: "active",
    description: "Get system health status",
    parameters: [],
    responseCode: 200,
  },
  {
    method: "GET",
    path: "/api/v1/system/components",
    harness: "Operational Integrity",
    status: "active",
    description: "List all system components and their status",
    parameters: [],
    responseCode: 200,
  },
  {
    method: "POST",
    path: "/api/v1/system/test",
    harness: "Operational Integrity",
    status: "active",
    description: "Run system diagnostic test",
    parameters: ["test_type", "verbose"],
    responseCode: 200,
  },
  {
    method: "GET",
    path: "/api/v1/system/metrics",
    harness: "Operational Integrity",
    status: "active",
    description: "Get real-time system metrics",
    parameters: ["metric_type"],
    responseCode: 200,
  },

  // Uninstallation Verification Harness
  {
    method: "POST",
    path: "/api/v1/uninstall/prepare",
    harness: "Uninstallation Verification",
    status: "active",
    description: "Prepare system for uninstallation",
    parameters: ["installation_id"],
    responseCode: 200,
  },
  {
    method: "POST",
    path: "/api/v1/uninstall/execute",
    harness: "Uninstallation Verification",
    status: "active",
    description: "Execute uninstallation process",
    parameters: ["installation_id", "force"],
    responseCode: 202,
  },
  {
    method: "POST",
    path: "/api/v1/uninstall/verify",
    harness: "Uninstallation Verification",
    status: "active",
    description: "Verify complete uninstallation",
    parameters: ["installation_id"],
    responseCode: 200,
  },
  {
    method: "POST",
    path: "/api/v1/uninstall/cleanup",
    harness: "Uninstallation Verification",
    status: "active",
    description: "Clean up residual artifacts",
    parameters: ["installation_id"],
    responseCode: 200,
  },

  // Portal Integration Harness
  {
    method: "GET",
    path: "/api/v1/portal/pages",
    harness: "Portal Integration",
    status: "active",
    description: "List all portal pages",
    parameters: [],
    responseCode: 200,
  },
  {
    method: "GET",
    path: "/api/v1/portal/documentation",
    harness: "Portal Integration",
    status: "active",
    description: "Get documentation content",
    parameters: ["doc_id"],
    responseCode: 200,
  },
  {
    method: "GET",
    path: "/api/v1/portal/downloads",
    harness: "Portal Integration",
    status: "active",
    description: "List available downloads",
    parameters: ["category"],
    responseCode: 200,
  },
  {
    method: "POST",
    path: "/api/v1/portal/search",
    harness: "Portal Integration",
    status: "active",
    description: "Search portal content",
    parameters: ["query"],
    responseCode: 200,
  },

  // API Compliance Harness
  {
    method: "GET",
    path: "/api/v1/compliance/status",
    harness: "API Compliance",
    status: "active",
    description: "Get API compliance status",
    parameters: [],
    responseCode: 200,
  },
  {
    method: "POST",
    path: "/api/v1/compliance/validate",
    harness: "API Compliance",
    status: "active",
    description: "Validate API compliance",
    parameters: ["endpoint", "version"],
    responseCode: 200,
  },
  {
    method: "GET",
    path: "/api/v1/compliance/report",
    harness: "API Compliance",
    status: "active",
    description: "Generate compliance report",
    parameters: ["format"],
    responseCode: 200,
  },

  // Security Validation Harness
  {
    method: "POST",
    path: "/api/v1/security/scan",
    harness: "Security Validation",
    status: "active",
    description: "Execute security scan",
    parameters: ["scan_type", "depth"],
    responseCode: 202,
  },
  {
    method: "GET",
    path: "/api/v1/security/results",
    harness: "Security Validation",
    status: "active",
    description: "Get security scan results",
    parameters: ["scan_id"],
    responseCode: 200,
  },
  {
    method: "POST",
    path: "/api/v1/security/verify",
    harness: "Security Validation",
    status: "active",
    description: "Verify security integrity",
    parameters: ["component"],
    responseCode: 200,
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "text-green-500";
    case "testing":
      return "text-yellow-500";
    case "deprecated":
      return "text-red-500";
    default:
      return "text-gray-500";
  }
};

const getMethodColor = (method: string) => {
  switch (method) {
    case "GET":
      return "bg-blue-500/20 text-blue-400";
    case "POST":
      return "bg-green-500/20 text-green-400";
    case "PUT":
      return "bg-yellow-500/20 text-yellow-400";
    case "DELETE":
      return "bg-red-500/20 text-red-400";
    default:
      return "bg-gray-500/20 text-gray-400";
  }
};

export default function APIEndpointRegistry() {
  const [expandedEndpoint, setExpandedEndpoint] = useState<string | null>(null);
  const [filterHarness, setFilterHarness] = useState<string | null>(null);

  const harnessTypes = Array.from(new Set(mockEndpoints.map(e => e.harness)));
  const filteredEndpoints = filterHarness
    ? mockEndpoints.filter(e => e.harness === filterHarness)
    : mockEndpoints;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
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
          <h1 className="text-lg font-bold">API ENDPOINT REGISTRY</h1>
          <div className="w-20"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-b from-primary/10 to-background">
          <div className="container">
            <div className="flex items-center gap-3 mb-4">
              <Code className="w-8 h-8 text-accent" />
              <h1 className="text-5xl font-bold">API Endpoint Registry</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Complete inventory of all API endpoints across test harnesses with status, parameters, and integration details.
            </p>
          </div>
        </section>

        <div className="container py-16 space-y-12">
          {/* Summary */}
          <section>
            <h2 className="text-3xl font-bold mb-6">Registry Summary</h2>
            <div className="grid md:grid-cols-4 gap-4">
              <Card className="bg-card border-border p-6">
                <p className="text-sm text-muted-foreground mb-2">Total Endpoints</p>
                <p className="text-4xl font-bold text-accent">{mockEndpoints.length}</p>
              </Card>
              <Card className="bg-card border-border p-6">
                <p className="text-sm text-muted-foreground mb-2">Active Endpoints</p>
                <p className="text-4xl font-bold text-green-500">
                  {mockEndpoints.filter(e => e.status === "active").length}
                </p>
              </Card>
              <Card className="bg-card border-border p-6">
                <p className="text-sm text-muted-foreground mb-2">Harness Types</p>
                <p className="text-4xl font-bold text-accent">{harnessTypes.length}</p>
              </Card>
              <Card className="bg-card border-border p-6">
                <p className="text-sm text-muted-foreground mb-2">Coverage</p>
                <p className="text-4xl font-bold text-accent">100%</p>
              </Card>
            </div>
          </section>

          {/* Harness Filter */}
          <section>
            <h2 className="text-3xl font-bold mb-6">Filter by Harness</h2>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filterHarness === null ? "default" : "outline"}
                onClick={() => setFilterHarness(null)}
              >
                All ({mockEndpoints.length})
              </Button>
              {harnessTypes.map(harness => (
                <Button
                  key={harness}
                  variant={filterHarness === harness ? "default" : "outline"}
                  onClick={() => setFilterHarness(harness)}
                >
                  {harness} ({mockEndpoints.filter(e => e.harness === harness).length})
                </Button>
              ))}
            </div>
          </section>

          {/* Endpoints List */}
          <section>
            <h2 className="text-3xl font-bold mb-6">Endpoints ({filteredEndpoints.length})</h2>
            <div className="space-y-3">
              {filteredEndpoints.map((endpoint, idx) => {
                const key = `${endpoint.method}-${endpoint.path}`;
                const isExpanded = expandedEndpoint === key;

                return (
                  <Card
                    key={idx}
                    className="bg-card border-border p-4 cursor-pointer transition hover:border-accent"
                    onClick={() =>
                      setExpandedEndpoint(isExpanded ? null : key)
                    }
                  >
                    <div className="space-y-3">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1 flex items-center gap-3">
                          <span
                            className={`px-3 py-1 rounded text-xs font-bold uppercase ${getMethodColor(
                              endpoint.method
                            )}`}
                          >
                            {endpoint.method}
                          </span>
                          <code className="text-sm font-mono text-accent flex-1">
                            {endpoint.path}
                          </code>
                        </div>
                        <span
                          className={`px-3 py-1 rounded text-xs font-bold uppercase ${getStatusColor(
                            endpoint.status
                          )}`}
                        >
                          {endpoint.status}
                        </span>
                      </div>

                      {/* Description and Harness */}
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            {endpoint.description}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Harness: <span className="text-accent">{endpoint.harness}</span>
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Response</p>
                          <p className="text-lg font-bold text-accent">
                            {endpoint.responseCode}
                          </p>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <div className="pt-4 border-t border-border space-y-4">
                          {endpoint.parameters && endpoint.parameters.length > 0 && (
                            <div>
                              <p className="text-sm font-bold mb-2 text-accent">Parameters</p>
                              <div className="bg-black p-3 rounded">
                                <ul className="space-y-1 text-xs font-mono text-muted-foreground">
                                  {endpoint.parameters.map((param, i) => (
                                    <li key={i}>• {param}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}

                          <div className="bg-black p-3 rounded">
                            <p className="text-xs font-bold mb-2 text-accent">Full Path</p>
                            <code className="text-xs font-mono text-accent break-all">
                              {endpoint.method} {endpoint.path}
                            </code>
                          </div>

                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full gap-2"
                            onClick={() => copyToClipboard(`${endpoint.method} ${endpoint.path}`)}
                          >
                            <Copy className="w-4 h-4" />
                            Copy Endpoint
                          </Button>
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* Integration Guide */}
          <section>
            <h2 className="text-3xl font-bold mb-6">Integration Guide</h2>
            <Card className="bg-card border-border p-6">
              <div className="space-y-4">
                <div>
                  <p className="font-bold mb-2">Base URL</p>
                  <code className="text-sm bg-black p-3 rounded block font-mono text-accent">
                    https://api.sovereignsystem.local/v1
                  </code>
                </div>
                <div>
                  <p className="font-bold mb-2">Authentication</p>
                  <p className="text-sm text-muted-foreground">
                    All endpoints require Bearer token in Authorization header:
                  </p>
                  <code className="text-sm bg-black p-3 rounded block font-mono text-accent mt-2">
                    Authorization: Bearer {"{"}token{"}"} 
                  </code>
                </div>
                <div>
                  <p className="font-bold mb-2">Example Request</p>
                  <pre className="text-xs bg-black p-3 rounded font-mono text-accent overflow-auto">
{`curl -X GET \\
  https://api.sovereignsystem.local/v1/system/health \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json"`}
                  </pre>
                </div>
              </div>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
}
