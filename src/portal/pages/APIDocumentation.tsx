import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Copy, Code } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

export default function APIDocumentation() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const endpoints = [
    {
      category: "Authentication",
      endpoints: [
        {
          method: "POST",
          path: "/api/auth/login",
          description: "Authenticate and receive JWT token",
          request: '{\n  "username": "operator",\n  "password": "secure_password"\n}',
          response: '{\n  "token": "eyJhbGc...",\n  "expires_in": 3600\n}'
        },
        {
          method: "POST",
          path: "/api/auth/refresh",
          description: "Refresh expired JWT token",
          request: '{\n  "token": "eyJhbGc..."\n}',
          response: '{\n  "token": "eyJhbGc...",\n  "expires_in": 3600\n}'
        }
      ]
    },
    {
      category: "Intelligence Data",
      endpoints: [
        {
          method: "GET",
          path: "/api/intelligence/query",
          description: "Query intelligence database",
          request: 'GET /api/intelligence/query?term=threat&limit=50',
          response: '{\n  "results": [\n    {\n      "id": "intel_001",\n      "type": "threat_indicator",\n      "confidence": 0.95,\n      "timestamp": "2026-05-02T18:00:00Z"\n    }\n  ]\n}'
        },
        {
          method: "POST",
          path: "/api/intelligence/correlate",
          description: "Correlate multiple intelligence sources",
          request: '{\n  "sources": ["osint", "dfir", "behavioral"],\n  "timeframe": "7d"\n}',
          response: '{\n  "correlation_id": "corr_001",\n  "confidence": 0.87,\n  "entities": [...]\n}'
        }
      ]
    },
    {
      category: "Evidence Management",
      endpoints: [
        {
          method: "POST",
          path: "/api/evidence/submit",
          description: "Submit evidence to the system",
          request: '{\n  "type": "artifact",\n  "source": "forensic_collection",\n  "data": "base64_encoded_data",\n  "metadata": {...}\n}',
          response: '{\n  "evidence_id": "ev_001",\n  "chain_of_custody": "coc_001",\n  "status": "verified"\n}'
        },
        {
          method: "GET",
          path: "/api/evidence/:id/verify",
          description: "Verify evidence integrity",
          request: 'GET /api/evidence/ev_001/verify',
          response: '{\n  "evidence_id": "ev_001",\n  "hash": "sha256_hash",\n  "verified": true,\n  "timestamp": "2026-05-02T18:00:00Z"\n}'
        }
      ]
    },
    {
      category: "Adjudication",
      endpoints: [
        {
          method: "POST",
          path: "/api/adjudication/evaluate",
          description: "Evaluate evidence and make determination",
          request: '{\n  "evidence_ids": ["ev_001", "ev_002"],\n  "policy_context": "threat_assessment"\n}',
          response: '{\n  "determination": "threat_confirmed",\n  "confidence": 0.92,\n  "recommended_action": "escalate",\n  "reasoning": "..."\n}'
        },
        {
          method: "GET",
          path: "/api/adjudication/history",
          description: "Retrieve adjudication history",
          request: 'GET /api/adjudication/history?limit=100&offset=0',
          response: '{\n  "total": 1250,\n  "adjudications": [...]\n}'
        }
      ]
    },
    {
      category: "System Management",
      endpoints: [
        {
          method: "GET",
          path: "/api/system/status",
          description: "Get overall system status",
          request: 'GET /api/system/status',
          response: '{\n  "status": "operational",\n  "uptime": 99.98,\n  "components": {\n    "core": "healthy",\n    "fabric": "healthy",\n    "autonomy": "healthy"\n  }\n}'
        },
        {
          method: "POST",
          path: "/api/system/snapshot",
          description: "Create system snapshot",
          request: '{\n  "label": "pre_update_snapshot",\n  "include_evidence": true\n}',
          response: '{\n  "snapshot_id": "snap_001",\n  "created_at": "2026-05-02T18:00:00Z",\n  "size_gb": 245.3\n}'
        }
      ]
    }
  ];

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
          <h1 className="text-lg font-bold">API DOCUMENTATION</h1>
          <div className="w-20"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-b from-primary/10 to-background">
          <div className="container">
            <h1 className="text-5xl font-bold mb-4">API Documentation</h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Complete REST API reference for the Sovereign System with examples and integration guides.
            </p>
          </div>
        </section>

        {/* Authentication Section */}
        <section className="py-16 bg-card">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">Authentication</h2>
            <Card className="bg-background border-border p-6 mb-6">
              <h3 className="font-bold mb-3">API Key Authentication</h3>
              <p className="text-muted-foreground text-sm mb-4">
                All API requests require a valid JWT token in the Authorization header.
              </p>
              <div className="bg-black p-4 rounded font-mono text-sm text-accent mb-4 overflow-x-auto">
                Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
              </div>
            </Card>

            <Card className="bg-background border-border p-6">
              <h3 className="font-bold mb-3">cURL Example</h3>
              <div className="bg-black p-4 rounded font-mono text-sm text-accent mb-4 overflow-x-auto">
                <p>curl -X POST https://api.sovereignsystem.com/auth/login \</p>
                <p>  -H "Content-Type: application/json" \</p>
                <p>  -d '{'{'}\"username\":\"operator\",\"password\":\"pass\"{'}'}' </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard('curl -X POST https://api.sovereignsystem.com/auth/login -H "Content-Type: application/json" -d \'{"username":"operator","password":"pass"}\'')
                }
                className="gap-2"
              >
                <Copy className="w-4 h-4" />
                Copy
              </Button>
            </Card>
          </div>
        </section>

        {/* Endpoints */}
        <section className="py-16 bg-background">
          <div className="container">
            <h2 className="text-3xl font-bold mb-12">API Endpoints</h2>
            <div className="space-y-8">
              {endpoints.map((category, catIdx) => (
                <div key={catIdx}>
                  <h3 className="text-2xl font-bold mb-4">{category.category}</h3>
                  <div className="space-y-4">
                    {category.endpoints.map((endpoint, endIdx) => (
                      <Card key={endIdx} className="bg-card border-border p-6 hover:border-primary transition">
                        <div className="mb-4">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`px-3 py-1 rounded text-xs font-bold ${
                              endpoint.method === "GET" ? "bg-primary/20 text-primary" :
                              endpoint.method === "POST" ? "bg-accent/20 text-accent" :
                              "bg-muted/20 text-muted-foreground"
                            }`}>
                              {endpoint.method}
                            </span>
                            <code className="text-sm font-mono bg-black px-3 py-1 rounded text-accent">
                              {endpoint.path}
                            </code>
                          </div>
                          <p className="text-sm text-muted-foreground">{endpoint.description}</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs font-bold text-muted-foreground mb-2">Request</p>
                            <div className="bg-black p-3 rounded font-mono text-xs text-accent overflow-x-auto">
                              {endpoint.request}
                            </div>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-muted-foreground mb-2">Response</p>
                            <div className="bg-black p-3 rounded font-mono text-xs text-accent overflow-x-auto">
                              {endpoint.response}
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Code Examples */}
        <section className="py-16 bg-card">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">Code Examples</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-background border-border p-6">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  Python
                </h3>
                <div className="bg-black p-4 rounded font-mono text-xs text-accent overflow-x-auto mb-3">
                  <p>import requests</p>
                  <p className="mt-2">response = requests.post(</p>
                  <p>  'https://api.sovereignsystem.com/auth/login',</p>
                  <p>  json={'{'}username': 'operator', 'password': 'pass'{'}'},</p>
                  <p>  headers={'{'}Content-Type': 'application/json'{'}'})</p>
                  <p className="mt-2">token = response.json()['token']</p>
                </div>
              </Card>
              <Card className="bg-background border-border p-6">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  PowerShell
                </h3>
                <div className="bg-black p-4 rounded font-mono text-xs text-accent overflow-x-auto mb-3">
                  <p>$body = @{'{'}username="operator"; password="pass"{'}'}| ConvertTo-Json</p>
                  <p className="mt-2">$response = Invoke-WebRequest `</p>
                  <p>  -Uri 'https://api.sovereignsystem.com/auth/login' `</p>
                  <p>  -Method POST `</p>
                  <p>  -Body $body</p>
                  <p className="mt-2">$token = $response.Content | ConvertFrom-Json | Select -ExpandProperty token</p>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
