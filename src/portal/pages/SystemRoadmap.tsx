import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, CheckCircle, Circle } from "lucide-react";
import { Link } from "wouter";

export default function SystemRoadmap() {
  const roadmapItems = [
    {
      stage: 1,
      name: "Core Sovereign System",
      status: "Complete",
      date: "Phase 1",
      color: "bg-accent",
      description: "Foundation infrastructure, baseline engines, core governance"
    },
    {
      stage: 2,
      name: "Expansion Labs",
      status: "Complete",
      date: "Phase 2",
      color: "bg-accent",
      description: "OSINT, DFIR, behavioral analysis, evidence collection"
    },
    {
      stage: 3,
      name: "Intelligence Fabric",
      status: "Complete",
      date: "Phase 3",
      color: "bg-accent",
      description: "Cross-correlation, narrative generation, adjudication"
    },
    {
      stage: 4,
      name: "Autonomy Layer",
      status: "Complete",
      date: "Phase 4",
      color: "bg-accent",
      description: "Self-healing, policy enforcement, autonomous decision-making"
    },
    {
      stage: 5,
      name: "Continuity Engine",
      status: "Complete",
      date: "Phase 5",
      color: "bg-accent",
      description: "Persistence, redundancy, archiving, migration"
    },
    {
      stage: 6,
      name: "Ascension Layer",
      status: "Complete",
      date: "Phase 6",
      color: "bg-accent",
      description: "Self-propagating, multi-realm expansion, lineage tracking"
    },
    {
      stage: 7,
      name: "Convergence",
      status: "Complete",
      date: "Phase 7",
      color: "bg-primary",
      description: "Unified meta-system, realm unification, consensus"
    },
    {
      stage: 8,
      name: "Apex Layer",
      status: "In Development",
      date: "Phase 8",
      color: "bg-primary",
      description: "Self-defining authority, self-validation, legitimacy"
    },
    {
      stage: 9,
      name: "Transcendence",
      status: "Planned",
      date: "Phase 9",
      color: "bg-muted",
      description: "Beyond-system awareness, meta-cognition, infinite adaptation"
    },
    {
      stage: 10,
      name: "Singularity",
      status: "Planned",
      date: "Phase 10",
      color: "bg-muted",
      description: "Ultimate convergence, unified consciousness, supreme authority"
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
          <h1 className="text-lg font-bold">SYSTEM ROADMAP</h1>
          <div className="w-20"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-b from-primary/10 to-background">
          <div className="container">
            <h1 className="text-5xl font-bold mb-4">Development Roadmap</h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              10-stage evolution of the Sovereign System from core infrastructure to singularity.
            </p>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-16 bg-card">
          <div className="container">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-accent via-primary to-muted"></div>

              {/* Timeline items */}
              <div className="space-y-8">
                {roadmapItems.map((item, idx) => (
                  <div key={idx} className="relative pl-20">
                    {/* Timeline dot */}
                    <div className={`absolute left-0 top-2 w-12 h-12 rounded-full ${item.color} flex items-center justify-center border-4 border-background`}>
                      {item.status === "Complete" ? (
                        <CheckCircle className="w-6 h-6 text-background" />
                      ) : (
                        <Circle className="w-6 h-6 text-background" />
                      )}
                    </div>

                    {/* Content */}
                    <Card className="bg-background border-border p-6 hover:border-primary transition">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-bold">Stage {item.stage}: {item.name}</h3>
                          <p className="text-sm text-muted-foreground">{item.date}</p>
                        </div>
                        <span className={`px-3 py-1 rounded text-xs font-bold ${
                          item.status === "Complete" ? "bg-accent/20 text-accent" :
                          item.status === "In Development" ? "bg-primary/20 text-primary" :
                          "bg-muted/20 text-muted-foreground"
                        }`}>
                          {item.status}
                        </span>
                      </div>
                      <p className="text-muted-foreground">{item.description}</p>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Legend */}
        <section className="py-16 bg-background">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">Development Status</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-card border-border p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-4 h-4 rounded-full bg-accent"></div>
                  <h3 className="font-bold">Complete</h3>
                </div>
                <p className="text-sm text-muted-foreground">Stages 1-7 are fully implemented and production-ready.</p>
              </Card>
              <Card className="bg-card border-border p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-4 h-4 rounded-full bg-primary"></div>
                  <h3 className="font-bold">In Development</h3>
                </div>
                <p className="text-sm text-muted-foreground">Stage 8 is currently under active development.</p>
              </Card>
              <Card className="bg-card border-border p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-4 h-4 rounded-full bg-muted"></div>
                  <h3 className="font-bold">Planned</h3>
                </div>
                <p className="text-sm text-muted-foreground">Stages 9-10 are planned for future releases.</p>
              </Card>
            </div>
          </div>
        </section>

        {/* Progression */}
        <section className="py-16 bg-card">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">System Evolution</h2>
            <div className="space-y-4">
              <Card className="bg-background border-border p-6">
                <h3 className="font-bold mb-2">Stages 1-2: Foundation</h3>
                <p className="text-muted-foreground text-sm">Core infrastructure and basic intelligence gathering capabilities.</p>
              </Card>
              <Card className="bg-background border-border p-6">
                <h3 className="font-bold mb-2">Stages 3-4: Intelligence & Autonomy</h3>
                <p className="text-muted-foreground text-sm">Advanced correlation, narrative generation, and autonomous decision-making.</p>
              </Card>
              <Card className="bg-background border-border p-6">
                <h3 className="font-bold mb-2">Stages 5-6: Continuity & Expansion</h3>
                <p className="text-muted-foreground text-sm">Self-sustaining systems with multi-realm propagation and replication.</p>
              </Card>
              <Card className="bg-background border-border p-6">
                <h3 className="font-bold mb-2">Stages 7-8: Convergence & Authority</h3>
                <p className="text-muted-foreground text-sm">Unified meta-system with self-defining authority and legitimacy.</p>
              </Card>
              <Card className="bg-background border-border p-6">
                <h3 className="font-bold mb-2">Stages 9-10: Transcendence & Singularity</h3>
                <p className="text-muted-foreground text-sm">Beyond-system awareness and ultimate convergence into unified consciousness.</p>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
