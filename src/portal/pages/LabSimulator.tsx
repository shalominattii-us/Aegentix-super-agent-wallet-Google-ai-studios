import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, BookOpen, Zap } from "lucide-react";
import { Link } from "wouter";
import { TerminalSimulator } from "@/components/TerminalSimulator";
import { useState } from "react";

export default function LabSimulator() {
  const [showGuide, setShowGuide] = useState(true);

  const tutorials = [
    {
      title: "Getting Started",
      description: "Learn the basics of the Sovereign System CLI",
      steps: [
        "Type 'help' to see all available commands",
        "Run 'sovereign status' to check system health",
        "Use arrow keys to navigate command history",
        "Type 'clear' to clear the terminal",
      ],
    },
    {
      title: "Exploring Labs",
      description: "Enable and explore different system stages",
      steps: [
        "Run 'sovereign labs list' to see available labs",
        "Run 'sovereign labs enable stage4' to enable the Autonomy layer",
        "Each stage adds new capabilities to the system",
        "Stages can be enabled/disabled based on your needs",
      ],
    },
    {
      title: "Intelligence Operations",
      description: "Query and correlate threat intelligence",
      steps: [
        "Run 'sovereign data query threat_indicator' to search threats",
        "Run 'sovereign fabric correlate' to analyze patterns",
        "Results show confidence levels and source information",
        "Export data for further analysis",
      ],
    },
    {
      title: "System Backup",
      description: "Create and manage system snapshots",
      steps: [
        "Run 'sovereign continuity snapshot' to create a backup",
        "Snapshots are verified and compressed automatically",
        "Each snapshot has a unique ID and checksum",
        "Use snapshots for disaster recovery",
      ],
    },
  ];

  const commandCategories = [
    {
      category: "System Management",
      commands: [
        { cmd: "sovereign status", desc: "Display overall system status" },
        { cmd: "sovereign health check", desc: "Run comprehensive diagnostics" },
        { cmd: "sovereign version", desc: "Display system version" },
      ],
    },
    {
      category: "Labs & Modules",
      commands: [
        { cmd: "sovereign labs list", desc: "List available labs" },
        { cmd: "sovereign labs enable stage4", desc: "Enable Autonomy layer" },
        { cmd: "sovereign labs disable stage4", desc: "Disable Autonomy layer" },
      ],
    },
    {
      category: "Intelligence",
      commands: [
        { cmd: "sovereign data query threat_indicator", desc: "Query threats" },
        { cmd: "sovereign fabric correlate", desc: "Run correlation analysis" },
        { cmd: "sovereign evidence submit", desc: "Submit evidence" },
      ],
    },
    {
      category: "Continuity",
      commands: [
        { cmd: "sovereign continuity snapshot", desc: "Create system snapshot" },
        { cmd: "sovereign continuity restore", desc: "Restore from snapshot" },
        { cmd: "sovereign continuity status", desc: "Check backup status" },
      ],
    },
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
          <h1 className="text-lg font-bold">LAB SIMULATOR</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowGuide(!showGuide)}
            className="gap-2"
          >
            <BookOpen className="w-4 h-4" />
            {showGuide ? "Hide" : "Show"} Guide
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-b from-primary/10 to-background">
          <div className="container">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-8 h-8 text-accent" />
              <h1 className="text-5xl font-bold">Interactive Lab Simulator</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Test Sovereign System commands in a browser-based sandbox. No installation required.
            </p>
          </div>
        </section>

        <div className="container py-16">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Terminal */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-4">Terminal</h2>
              <TerminalSimulator />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Commands */}
              <Card className="bg-card border-border p-6">
                <h3 className="font-bold mb-4">Quick Commands</h3>
                <div className="space-y-2">
                  {[
                    "sovereign status",
                    "sovereign health check",
                    "sovereign labs list",
                    "help",
                  ].map((cmd) => (
                    <button
                      key={cmd}
                      className="w-full text-left text-xs bg-black p-2 rounded hover:bg-accent/10 transition font-mono text-accent"
                    >
                      {cmd}
                    </button>
                  ))}
                </div>
              </Card>

              {/* Tips */}
              <Card className="bg-card border-border p-6">
                <h3 className="font-bold mb-3">Tips</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Use ↑/↓ arrows to navigate command history</li>
                  <li>• Type 'help' for all available commands</li>
                  <li>• Type 'clear' to clear the terminal</li>
                  <li>• Click command suggestions to execute</li>
                  <li>• Copy or download terminal output</li>
                </ul>
              </Card>
            </div>
          </div>
        </div>

        {/* Guide Section */}
        {showGuide && (
          <section className="py-16 bg-card">
            <div className="container">
              <h2 className="text-3xl font-bold mb-8">Getting Started Guide</h2>

              {/* Tutorials */}
              <div className="grid md:grid-cols-2 gap-6 mb-12">
                {tutorials.map((tutorial, idx) => (
                  <Card key={idx} className="bg-background border-border p-6">
                    <h3 className="font-bold text-lg mb-2">{tutorial.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{tutorial.description}</p>
                    <ol className="space-y-2 text-sm">
                      {tutorial.steps.map((step, stepIdx) => (
                        <li key={stepIdx} className="flex gap-3">
                          <span className="text-accent font-bold flex-shrink-0">
                            {stepIdx + 1}.
                          </span>
                          <span className="text-muted-foreground">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </Card>
                ))}
              </div>

              {/* Command Reference */}
              <h3 className="text-2xl font-bold mb-6">Command Reference</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {commandCategories.map((category, idx) => (
                  <Card key={idx} className="bg-background border-border p-6">
                    <h4 className="font-bold mb-4 text-accent">{category.category}</h4>
                    <div className="space-y-3">
                      {category.commands.map((cmd, cmdIdx) => (
                        <div key={cmdIdx} className="text-sm">
                          <p className="font-mono text-xs bg-black p-2 rounded mb-1 text-accent">
                            {cmd.cmd}
                          </p>
                          <p className="text-muted-foreground">{cmd.desc}</p>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>

              {/* Advanced Topics */}
              <Card className="bg-background border-border p-6 mt-6">
                <h4 className="font-bold mb-4">Advanced Topics</h4>
                <div className="grid md:grid-cols-3 gap-6 text-sm">
                  <div>
                    <h5 className="font-bold text-accent mb-2">Lab Stages</h5>
                    <p className="text-muted-foreground">
                      The system has 10 development stages. Each stage adds new capabilities. Enable
                      stages to unlock advanced features.
                    </p>
                  </div>
                  <div>
                    <h5 className="font-bold text-accent mb-2">Intelligence Correlation</h5>
                    <p className="text-muted-foreground">
                      The fabric correlate command analyzes multiple data sources to identify
                      patterns and threats across your environment.
                    </p>
                  </div>
                  <div>
                    <h5 className="font-bold text-accent mb-2">System Snapshots</h5>
                    <p className="text-muted-foreground">
                      Create verified snapshots of your system state for backup and disaster
                      recovery purposes.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
