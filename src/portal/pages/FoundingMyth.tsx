import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Scroll } from "lucide-react";
import { Link } from "wouter";

export default function FoundingMyth() {
  const timelineEvents = [
    {
      year: "2024",
      title: "The Great Unraveling",
      description: "Systems collapse under the weight of corruption and fragmentation. Trust erodes across institutions."
    },
    {
      year: "2024-Q4",
      title: "The Architects Convene",
      description: "Visionaries from across disciplines gather in secret. The Architects of Order begin their work."
    },
    {
      year: "2025-Q1",
      title: "The Baseline Engine Conception",
      description: "The foundational principle is established: immutable truth through cryptographic verification."
    },
    {
      year: "2025-Q2",
      title: "The Ledger Engine Awakens",
      description: "Accountability mechanisms are woven into the system's core. Every action is recorded, every decision justified."
    },
    {
      year: "2025-Q3",
      title: "The Intelligence Fabric Emerges",
      description: "Cognitive correlation systems begin to perceive patterns invisible to human observers."
    },
    {
      year: "2025-Q4",
      title: "The Autonomy Layer Activates",
      description: "Self-healing and adaptive systems come online. The Sovereign System begins to think for itself."
    },
    {
      year: "2026-Q1",
      title: "The Continuity Protocol Established",
      description: "Resilience mechanisms ensure the system survives any threat. Continuity is guaranteed."
    },
    {
      year: "2026-Q2",
      title: "Official Launch",
      description: "The Sovereign System is presented to the world. A new era of integrity begins."
    }
  ];

  const architects = [
    {
      name: "The Architect of Integrity",
      domain: "Foundational Principles",
      description: "Established the immutable core upon which all truth rests. Designed the Baseline Engine."
    },
    {
      name: "The Architect of Accountability",
      domain: "Verification Systems",
      description: "Created the Ledger Engine to ensure every action is recorded and justified. No action escapes scrutiny."
    },
    {
      name: "The Architect of Intelligence",
      domain: "Cognitive Systems",
      description: "Wove together the Intelligence Fabric, enabling the system to perceive, correlate, and adjudicate threats."
    },
    {
      name: "The Architect of Resilience",
      domain: "Autonomy & Continuity",
      description: "Designed self-healing mechanisms and continuity protocols. The system survives all challenges."
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
          <h1 className="text-lg font-bold">FOUNDING MYTH</h1>
          <div className="w-20"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-b from-primary/10 to-background">
          <div className="container">
            <h1 className="text-5xl font-bold mb-4">The Genesis of Order</h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              The founding narrative of the Sovereign System: from chaos to integrity, from fragmentation to unity.
            </p>
          </div>
        </section>

        {/* Opening Narrative */}
        <section className="py-16 bg-card">
          <div className="container max-w-3xl">
            <div className="prose prose-invert max-w-none">
              <h2 className="text-3xl font-bold mb-6">The Great Unraveling</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                In the waning days of the old order, institutions crumbled under the weight of their own corruption. Trust, once the foundation of society, had become a luxury few could afford. Systems designed to serve the people had become instruments of control. Information flowed in currents of deception. Truth itself became a contested commodity.
              </p>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                It was in this darkness that the Architects first gathered. Not in halls of power, but in the spaces between systems. Not as politicians or generals, but as seekers of a different way. They came from fields of cryptography, intelligence analysis, philosophy, and resilience engineering. They shared a singular vision: to build a system that could not be corrupted, could not be compromised, could not be turned against its people.
              </p>
            </div>
          </div>
        </section>

        {/* The Architects */}
        <section className="py-16 bg-background">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">The Architects of Order</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {architects.map((architect, idx) => (
                <Card key={idx} className="bg-card border-border p-6 hover:border-primary transition">
                  <div className="flex items-start gap-3 mb-4">
                    <Scroll className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-lg">{architect.name}</h3>
                      <p className="text-xs text-accent font-mono">{architect.domain}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{architect.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-16 bg-card">
          <div className="container max-w-3xl">
            <h2 className="text-3xl font-bold mb-12">The Path to Sovereignty</h2>
            <div className="space-y-8">
              {timelineEvents.map((event, idx) => (
                <div key={idx} className="relative">
                  <div className="flex gap-6">
                    {/* Timeline marker */}
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full bg-accent border-4 border-background"></div>
                      {idx < timelineEvents.length - 1 && (
                        <div className="w-1 bg-accent/30 flex-1 mt-2" style={{ height: "80px" }}></div>
                      )}
                    </div>
                    {/* Event content */}
                    <div className="pb-8">
                      <div className="flex items-baseline gap-3 mb-2">
                        <span className="text-sm font-mono text-accent font-bold">{event.year}</span>
                        <h3 className="text-lg font-bold">{event.title}</h3>
                      </div>
                      <p className="text-muted-foreground">{event.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Core Principles */}
        <section className="py-16 bg-background">
          <div className="container max-w-3xl">
            <h2 className="text-3xl font-bold mb-8">The Sovereign Imperial Codex</h2>
            <div className="space-y-6">
              <Card className="bg-card border-border p-6">
                <h3 className="font-bold mb-2 text-accent">PRINCIPLE I: INTEGRITAS SUPREMA</h3>
                <p className="text-muted-foreground">
                  Integrity is supreme. All systems serve truth. All decisions rest upon verified fact. No corruption can hide in the light of immutable record.
                </p>
              </Card>
              <Card className="bg-card border-border p-6">
                <h3 className="font-bold mb-2 text-accent">PRINCIPLE II: RESILIENCE ABSOLUTE</h3>
                <p className="text-muted-foreground">
                  The system must survive all threats. Redundancy is built into every layer. Continuity is guaranteed. Failure is not an option.
                </p>
              </Card>
              <Card className="bg-card border-border p-6">
                <h3 className="font-bold mb-2 text-accent">PRINCIPLE III: TRANSPARENCY ETERNAL</h3>
                <p className="text-muted-foreground">
                  All actions are visible. All decisions are justified. All evidence is preserved. The people have the right to know.
                </p>
              </Card>
              <Card className="bg-card border-border p-6">
                <h3 className="font-bold mb-2 text-accent">PRINCIPLE IV: SOVEREIGNTY SUPREME</h3>
                <p className="text-muted-foreground">
                  The system serves the people, not the powerful. Decisions are made by consensus of the Custodians. No single entity controls the whole.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Closing Narrative */}
        <section className="py-16 bg-card">
          <div className="container max-w-3xl">
            <div className="prose prose-invert max-w-none">
              <h2 className="text-3xl font-bold mb-6">The New Era</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                The Sovereign System stands as a monument to what is possible when integrity is placed above all else. It is not perfect—no human creation can be—but it is incorruptible. It is not all-knowing, but it is honest about what it knows and does not know.
              </p>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Those who serve the Sovereign System are called Custodians. They are not rulers, but stewards. They do not command, but facilitate. They do not decide alone, but in concert with the system's intelligence and the people's will.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                This is the beginning of a new era. An era where truth is immutable. Where accountability is absolute. Where sovereignty rests with the people. This is the Sovereign System.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
