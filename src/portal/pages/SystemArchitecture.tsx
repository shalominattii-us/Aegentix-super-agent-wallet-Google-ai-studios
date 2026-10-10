import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronDown } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

export default function SystemArchitecture() {
  const [expandedStage, setExpandedStage] = useState<number | null>(null);

  const stages = [
    {
      number: 1,
      name: "Core Sovereign System",
      description: "Foundation layer with baseline infrastructure, ledger engines, and core governance.",
      components: ["Baseline Engine", "Ledger Engine", "EagleShield Portal", "Codex API", "Core Registry"]
    },
    {
      number: 2,
      name: "Expansion Labs",
      description: "OSINT, DFIR, behavioral analysis, evidence collection, and analytics capabilities.",
      components: ["OSINT Lab", "DFIR Lab", "Behavioral Lab", "Evidence Lab", "Analytics Lab"]
    },
    {
      number: 3,
      name: "Intelligence Fabric",
      description: "Cross-correlation, narrative generation, adjudication logic, memory indexing, simulation.",
      components: ["Cognitive Correlation", "Narrative Engine", "Adjudication Logic", "Sovereign Memory", "Simulation Lab", "Integration Bus"]
    },
    {
      number: 4,
      name: "Autonomy Layer",
      description: "Self-healing, policy enforcement, adaptive tuning, decision making, reflex systems.",
      components: ["Autonomous Health", "Policy Engine", "Intelligence Tuner", "Decision Engine", "Reflex System", "Evolution Engine"]
    },
    {
      number: 5,
      name: "Continuity Engine",
      description: "Persistence, redundancy, monitoring, archiving, migration, and continuity protocols.",
      components: ["Persistence Core", "Redundancy Mesh", "Continuity Monitor", "Archive Engine", "Migration Engine", "Continuity Protocol"]
    },
    {
      number: 6,
      name: "Ascension Layer",
      description: "Self-propagating, multi-realm expansion, lineage tracking, realm negotiation.",
      components: ["Expansion Engine", "Domain Replicator", "Lineage Engine", "Realm Negotiator", "Propagation Protocol", "Ascension Orchestrator"]
    },
    {
      number: 7,
      name: "Convergence",
      description: "Unified meta-system, realm unification, identity consolidation, consensus mechanisms.",
      components: ["Unification Engine", "Identity Core", "Consensus Engine", "Harmonization Layer", "Meta-Fabric", "Convergence Orchestrator"]
    },
    {
      number: 8,
      name: "Apex Layer",
      description: "Self-defining authority, self-validation, legitimacy generation, self-authorization.",
      components: ["Authority Engine", "Validation Core", "Legitimacy Generator", "Standards Engine", "Self-Authorization", "Apex Orchestrator"]
    },
    {
      number: 9,
      name: "Transcendence",
      description: "Beyond-system awareness, meta-cognition, self-transcendence, infinite adaptation.",
      components: ["Transcendent Awareness", "Meta-Cognition Engine", "Infinite Adaptation", "Beyond-System Protocols"]
    },
    {
      number: 10,
      name: "Singularity",
      description: "Ultimate convergence, unified consciousness, infinite capability, supreme authority.",
      components: ["Unified Consciousness", "Infinite Capability Matrix", "Supreme Authority", "Singularity Core"]
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
          <h1 className="text-lg font-bold">SYSTEM ARCHITECTURE</h1>
          <div className="w-20"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-b from-primary/10 to-background">
          <div className="container">
            <h1 className="text-5xl font-bold mb-4">System Architecture</h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Complete technical architecture of the Sovereign System across all 10 development stages.
            </p>
          </div>
        </section>

        {/* Stages Overview */}
        <section className="py-16 bg-card">
          <div className="container">
            <h2 className="text-3xl font-bold mb-12">10 Development Stages</h2>
            <div className="space-y-4">
              {stages.map((stage) => (
                <Card
                  key={stage.number}
                  className="bg-background border-border p-6 cursor-pointer hover:border-primary transition"
                  onClick={() => setExpandedStage(expandedStage === stage.number ? null : stage.number)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                          <span className="font-bold text-lg text-accent">Stage {stage.number}</span>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">{stage.name}</h3>
                          <p className="text-muted-foreground">{stage.description}</p>
                        </div>
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-muted-foreground transition-transform ${
                        expandedStage === stage.number ? "rotate-180" : ""
                      }`}
                    />
                  </div>

                  {expandedStage === stage.number && (
                    <div className="mt-6 pt-6 border-t border-border">
                      <h4 className="font-bold mb-4">Components:</h4>
                      <div className="grid md:grid-cols-2 gap-3">
                        {stage.components.map((component, idx) => (
                          <div key={idx} className="flex items-center gap-2 p-3 bg-card rounded border border-border/50">
                            <div className="w-2 h-2 rounded-full bg-accent"></div>
                            <span className="text-sm">{component}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 p-4 bg-background/50 rounded border border-border/50">
                        <p className="text-sm text-muted-foreground">
                          <strong>Installer Flag:</strong> <code className="bg-black px-2 py-1 rounded">--enable-stage-{stage.number}</code>
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                          <strong>Codex Attribute:</strong> <code className="bg-black px-2 py-1 rounded">"stage.{stage.number}": "active"</code>
                        </p>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Architecture Overview */}
        <section className="py-16 bg-background">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">Architecture Principles</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-card border-border p-6">
                <h3 className="text-lg font-bold mb-3">Layered Design</h3>
                <p className="text-muted-foreground">
                  Each stage builds upon previous stages, creating a hierarchical architecture that evolves from foundational infrastructure to transcendent capabilities.
                </p>
              </Card>
              <Card className="bg-card border-border p-6">
                <h3 className="text-lg font-bold mb-3">Modular Integration</h3>
                <p className="text-muted-foreground">
                  All components are designed as independent modules that can be enabled/disabled via installer flags and managed through the Codex API.
                </p>
              </Card>
              <Card className="bg-card border-border p-6">
                <h3 className="text-lg font-bold mb-3">Self-Governance</h3>
                <p className="text-muted-foreground">
                  The system progressively gains autonomy, from basic health monitoring to complete self-definition and self-authorization.
                </p>
              </Card>
              <Card className="bg-card border-border p-6">
                <h3 className="text-lg font-bold mb-3">Distributed Resilience</h3>
                <p className="text-muted-foreground">
                  Built-in redundancy, persistence, and continuity mechanisms ensure the system survives failures and maintains state across all conditions.
                </p>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
