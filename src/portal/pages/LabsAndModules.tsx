import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Code, Settings } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

export default function LabsAndModules() {
  const [expandedLab, setExpandedLab] = useState<string | null>(null);

  const labs = [
    {
      id: "osint",
      stage: 2,
      name: "OSINT Lab",
      description: "Open-source intelligence gathering and analysis",
      flag: "--enable-osint",
      codexAttr: '"lab.osint": "active"',
      psModule: "Install-SovereignModule osint",
      cliCmd: "sovereign osint analyze",
      capabilities: ["Web scraping", "Data aggregation", "Source correlation", "Intelligence indexing"]
    },
    {
      id: "dfir",
      stage: 2,
      name: "DFIR Lab",
      description: "Digital forensics and incident response",
      flag: "--enable-dfir",
      codexAttr: '"lab.dfir": "active"',
      psModule: "Install-SovereignModule dfir",
      cliCmd: "sovereign dfir investigate",
      capabilities: ["Artifact collection", "Timeline analysis", "Chain of custody", "Evidence preservation"]
    },
    {
      id: "behavioral",
      stage: 2,
      name: "Behavioral Lab",
      description: "Behavioral pattern analysis and threat modeling",
      flag: "--enable-behavioral",
      codexAttr: '"lab.behavioral": "active"',
      psModule: "Install-SovereignModule behavioral",
      cliCmd: "sovereign behavioral analyze",
      capabilities: ["Pattern detection", "Anomaly scoring", "Actor modeling", "Threat profiling"]
    },
    {
      id: "cognitive",
      stage: 3,
      name: "Cognitive Correlation Lab",
      description: "Cross-correlates OSINT, DFIR, behavioral, and network data",
      flag: "--enable-cognitive-correlation",
      codexAttr: '"lab.cognitive_correlation": "active"',
      psModule: "Install-SovereignModule cognitive-correlation",
      cliCmd: "sovereign fabric correlate",
      capabilities: ["Entity linking", "Temporal alignment", "Confidence scoring", "Intelligence synthesis"]
    },
    {
      id: "narrative",
      stage: 3,
      name: "Narrative Engine",
      description: "Transforms intelligence into structured adjudication narratives",
      flag: "--enable-narrative-engine",
      codexAttr: '"lab.narrative_engine": "active"',
      psModule: "Install-SovereignModule narrative-engine",
      cliCmd: "sovereign fabric summarize",
      capabilities: ["Report generation", "Evidence binding", "Chain-of-custody integration", "Summary synthesis"]
    },
    {
      id: "adjudication",
      stage: 3,
      name: "Adjudication Logic Lab",
      description: "Evaluates evidence and makes determinations",
      flag: "--enable-adjudication-logic",
      codexAttr: '"lab.adjudication_logic": "active"',
      psModule: "Install-SovereignModule adjudication-logic",
      cliCmd: "sovereign fabric adjudicate",
      capabilities: ["Evidence evaluation", "Determination logic", "Confidence assessment", "Escalation routing"]
    },
    {
      id: "memory",
      stage: 3,
      name: "Sovereign Memory Lab",
      description: "Maintains global index of all intelligence and evidence",
      flag: "--enable-sovereign-memory",
      codexAttr: '"lab.sovereign_memory": "active"',
      psModule: "Install-SovereignModule sovereign-memory",
      cliCmd: "sovereign memory query",
      capabilities: ["Vector indexing", "Metadata indexing", "Evidence indexing", "Timeline indexing"]
    },
    {
      id: "simulation",
      stage: 3,
      name: "Simulation Lab",
      description: "Runs what-if simulations for threat and evidence scenarios",
      flag: "--enable-simulation",
      codexAttr: '"lab.simulation": "active"',
      psModule: "Install-SovereignModule simulation",
      cliCmd: "sovereign fabric simulate",
      capabilities: ["Threat simulation", "Evidence modeling", "Network condition testing", "Outcome prediction"]
    },
    {
      id: "health",
      stage: 4,
      name: "Autonomous Health Lab",
      description: "System self-monitoring and self-healing",
      flag: "--enable-autonomous-health",
      codexAttr: '"autonomy.health": "active"',
      psModule: "Install-SovereignModule autonomous-health",
      cliCmd: "sovereign autonomy heal",
      capabilities: ["Service monitoring", "Auto-restart logic", "Dependency verification", "Drift detection"]
    },
    {
      id: "policy",
      stage: 4,
      name: "Policy Engine",
      description: "Defines and enforces governance rules across all labs",
      flag: "--enable-policy-engine",
      codexAttr: '"autonomy.policy_engine": "active"',
      psModule: "Install-SovereignModule policy-engine",
      cliCmd: "sovereign autonomy evaluate",
      capabilities: ["Policy evaluation", "Enforcement actions", "Conditional workflows", "Rule propagation"]
    },
    {
      id: "tuner",
      stage: 4,
      name: "Intelligence Tuner",
      description: "Automatically adjusts system parameters based on workload",
      flag: "--enable-intelligence-tuner",
      codexAttr: '"autonomy.intelligence_tuner": "active"',
      psModule: "Install-SovereignModule intelligence-tuner",
      cliCmd: "sovereign autonomy tune",
      capabilities: ["Dynamic scaling", "Resource tuning", "Threshold adjustment", "Auto-prioritization"]
    },
    {
      id: "decision",
      stage: 4,
      name: "Decision Engine",
      description: "Makes autonomous decisions based on evidence and policy",
      flag: "--enable-decision-engine",
      codexAttr: '"autonomy.decision_engine": "active"',
      psModule: "Install-SovereignModule decision-engine",
      cliCmd: "sovereign autonomy decide",
      capabilities: ["Evidence analysis", "Policy alignment", "Determination generation", "Action recommendation"]
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
          <h1 className="text-lg font-bold">LABS & MODULES</h1>
          <div className="w-20"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-b from-primary/10 to-background">
          <div className="container">
            <h1 className="text-5xl font-bold mb-4">Labs & Modules</h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Complete reference for all Sovereign System labs and modules with installation and integration details.
            </p>
          </div>
        </section>

        {/* Labs List */}
        <section className="py-16 bg-card">
          <div className="container">
            <h2 className="text-3xl font-bold mb-12">Available Labs</h2>
            <div className="space-y-4">
              {labs.map((lab) => (
                <Card
                  key={lab.id}
                  className="bg-background border-border p-6 cursor-pointer hover:border-primary transition"
                  onClick={() => setExpandedLab(expandedLab === lab.id ? null : lab.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-2 py-1 rounded text-xs font-bold bg-primary/20 text-primary">
                          Stage {lab.stage}
                        </span>
                        <h3 className="text-lg font-bold">{lab.name}</h3>
                      </div>
                      <p className="text-muted-foreground text-sm">{lab.description}</p>
                    </div>
                  </div>

                  {expandedLab === lab.id && (
                    <div className="mt-6 pt-6 border-t border-border space-y-4">
                      {/* Capabilities */}
                      <div>
                        <h4 className="font-bold mb-3 flex items-center gap-2">
                          <Settings className="w-4 h-4" />
                          Capabilities
                        </h4>
                        <div className="grid md:grid-cols-2 gap-2">
                          {lab.capabilities.map((cap, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm">
                              <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                              {cap}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Installation Methods */}
                      <div>
                        <h4 className="font-bold mb-3 flex items-center gap-2">
                          <Code className="w-4 h-4" />
                          Installation & Integration
                        </h4>
                        <div className="space-y-3">
                          <div className="p-3 bg-black rounded border border-border/50">
                            <p className="text-xs text-muted-foreground mb-1">Bootstrap Installer Flag:</p>
                            <code className="text-sm text-accent">{lab.flag}</code>
                          </div>
                          <div className="p-3 bg-black rounded border border-border/50">
                            <p className="text-xs text-muted-foreground mb-1">PowerShell Module:</p>
                            <code className="text-sm text-accent">{lab.psModule}</code>
                          </div>
                          <div className="p-3 bg-black rounded border border-border/50">
                            <p className="text-xs text-muted-foreground mb-1">Codex API Attribute:</p>
                            <code className="text-sm text-accent">{lab.codexAttr}</code>
                          </div>
                          <div className="p-3 bg-black rounded border border-border/50">
                            <p className="text-xs text-muted-foreground mb-1">CLI Command:</p>
                            <code className="text-sm text-accent">{lab.cliCmd}</code>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Integration Guide */}
        <section className="py-16 bg-background">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">Integration Methods</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-card border-border p-6">
                <h3 className="font-bold mb-3">Bootstrap Installation</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Enable labs during initial system installation using flags.
                </p>
                <code className="block bg-black p-3 rounded text-xs text-accent mb-3">
                  SovereignSystem.exe --enable-osint --enable-dfir --enable-behavioral
                </code>
              </Card>
              <Card className="bg-card border-border p-6">
                <h3 className="font-bold mb-3">Module Installation</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Install individual modules after system deployment.
                </p>
                <code className="block bg-black p-3 rounded text-xs text-accent mb-3">
                  Install-SovereignModule cognitive-correlation
                </code>
              </Card>
              <Card className="bg-card border-border p-6">
                <h3 className="font-bold mb-3">Codex API Configuration</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Enable labs through the Codex API for dynamic configuration.
                </p>
                <code className="block bg-black p-3 rounded text-xs text-accent mb-3">
                  POST /api/labs/enable {'{'}lab: "osint"{'}'}
                </code>
              </Card>
              <Card className="bg-card border-border p-6">
                <h3 className="font-bold mb-3">CLI Management</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Manage labs using the Sovereign CLI.
                </p>
                <code className="block bg-black p-3 rounded text-xs text-accent mb-3">
                  sovereign labs enable osint
                </code>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
