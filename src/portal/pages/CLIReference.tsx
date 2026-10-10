import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Terminal, Copy } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

export default function CLIReference() {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const copyToClipboard = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const cliCommands = [
    {
      category: "System Management",
      commands: [
        { cmd: "sovereign status", desc: "Display overall system status and health" },
        { cmd: "sovereign version", desc: "Show Sovereign System version" },
        { cmd: "sovereign health check", desc: "Run comprehensive health diagnostics" },
        { cmd: "sovereign restart", desc: "Restart all services" },
        { cmd: "sovereign stop", desc: "Stop all services" }
      ]
    },
    {
      category: "Labs & Modules",
      commands: [
        { cmd: "sovereign labs list", desc: "List all available labs" },
        { cmd: "sovereign labs enable osint", desc: "Enable OSINT lab" },
        { cmd: "sovereign labs disable dfir", desc: "Disable DFIR lab" },
        { cmd: "sovereign labs status", desc: "Show status of all labs" },
        { cmd: "sovereign modules install cognitive-correlation", desc: "Install cognitive correlation module" }
      ]
    },
    {
      category: "Intelligence Fabric",
      commands: [
        { cmd: "sovereign fabric status", desc: "Show fabric status and connections" },
        { cmd: "sovereign fabric correlate", desc: "Run correlation analysis" },
        { cmd: "sovereign fabric simulate", desc: "Run threat simulations" },
        { cmd: "sovereign fabric adjudicate", desc: "Execute adjudication logic" },
        { cmd: "sovereign fabric summarize", desc: "Generate narrative summaries" }
      ]
    },
    {
      category: "Autonomy Layer",
      commands: [
        { cmd: "sovereign autonomy status", desc: "Show autonomy layer status" },
        { cmd: "sovereign autonomy heal", desc: "Trigger self-healing procedures" },
        { cmd: "sovereign autonomy evaluate", desc: "Evaluate policies" },
        { cmd: "sovereign autonomy tune", desc: "Run adaptive tuning" },
        { cmd: "sovereign autonomy decide", desc: "Execute decision engine" },
        { cmd: "sovereign autonomy evolve", desc: "Trigger evolution cycles" }
      ]
    },
    {
      category: "Continuity Engine",
      commands: [
        { cmd: "sovereign continuity status", desc: "Show continuity status" },
        { cmd: "sovereign continuity snapshot", desc: "Create system snapshot" },
        { cmd: "sovereign continuity restore <snapshot>", desc: "Restore from snapshot" },
        { cmd: "sovereign continuity migrate", desc: "Prepare system for migration" },
        { cmd: "sovereign continuity archive", desc: "Archive evidence and intelligence" },
        { cmd: "sovereign continuity enforce", desc: "Enforce continuity protocols" }
      ]
    },
    {
      category: "Ascension Layer",
      commands: [
        { cmd: "sovereign ascension status", desc: "Show ascension status" },
        { cmd: "sovereign ascension expand", desc: "Expand to new nodes" },
        { cmd: "sovereign ascension replicate", desc: "Replicate system to new realm" },
        { cmd: "sovereign ascension lineage", desc: "Show system lineage" },
        { cmd: "sovereign ascension negotiate", desc: "Negotiate with other realms" },
        { cmd: "sovereign ascension propagate", desc: "Propagate system updates" }
      ]
    },
    {
      category: "Convergence Layer",
      commands: [
        { cmd: "sovereign convergence status", desc: "Show convergence status" },
        { cmd: "sovereign convergence unify", desc: "Unify realms" },
        { cmd: "sovereign convergence identity", desc: "Show unified identity" },
        { cmd: "sovereign convergence consensus", desc: "Execute consensus protocol" },
        { cmd: "sovereign convergence harmonize", desc: "Harmonize all components" },
        { cmd: "sovereign convergence orchestrate", desc: "Run convergence orchestration" }
      ]
    },
    {
      category: "Data & Evidence",
      commands: [
        { cmd: "sovereign data query <term>", desc: "Query intelligence database" },
        { cmd: "sovereign evidence list", desc: "List all evidence items" },
        { cmd: "sovereign evidence verify <id>", desc: "Verify evidence integrity" },
        { cmd: "sovereign memory search <query>", desc: "Search Sovereign Memory" },
        { cmd: "sovereign memory index", desc: "Rebuild memory indexes" }
      ]
    },
    {
      category: "Configuration",
      commands: [
        { cmd: "sovereign config show", desc: "Display current configuration" },
        { cmd: "sovereign config set <key> <value>", desc: "Set configuration value" },
        { cmd: "sovereign config export", desc: "Export configuration" },
        { cmd: "sovereign config import <file>", desc: "Import configuration" },
        { cmd: "sovereign policy list", desc: "List all policies" }
      ]
    },
    {
      category: "Monitoring & Logs",
      commands: [
        { cmd: "sovereign logs show", desc: "Display system logs" },
        { cmd: "sovereign logs filter <pattern>", desc: "Filter logs by pattern" },
        { cmd: "sovereign metrics show", desc: "Display system metrics" },
        { cmd: "sovereign alerts list", desc: "List active alerts" },
        { cmd: "sovereign audit trail", desc: "Show audit trail" }
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
          <h1 className="text-lg font-bold">CLI REFERENCE</h1>
          <div className="w-20"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-b from-primary/10 to-background">
          <div className="container">
            <h1 className="text-5xl font-bold mb-4">CLI Reference</h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Complete command reference for the Sovereign CLI tool.
            </p>
          </div>
        </section>

        {/* Commands */}
        <section className="py-16 bg-card">
          <div className="container">
            <div className="space-y-8">
              {cliCommands.map((category, catIdx) => (
                <div key={catIdx}>
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Terminal className="w-6 h-6 text-accent" />
                    {category.category}
                  </h2>
                  <div className="space-y-3">
                    {category.commands.map((cmd, cmdIdx) => (
                      <Card key={cmdIdx} className="bg-background border-border p-4 hover:border-primary transition">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <code className="block bg-black p-3 rounded text-sm text-accent mb-2 font-mono">
                              {cmd.cmd}
                            </code>
                            <p className="text-sm text-muted-foreground">{cmd.desc}</p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(cmd.cmd)}
                            className="flex-shrink-0"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Usage Tips */}
        <section className="py-16 bg-background">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">Usage Tips</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-card border-border p-6">
                <h3 className="font-bold mb-3">Getting Help</h3>
                <code className="block bg-black p-3 rounded text-sm text-accent mb-3 font-mono">
                  sovereign --help<br/>
                  sovereign &lt;command&gt; --help
                </code>
              </Card>
              <Card className="bg-card border-border p-6">
                <h3 className="font-bold mb-3">Version Information</h3>
                <code className="block bg-black p-3 rounded text-sm text-accent mb-3 font-mono">
                  sovereign --version<br/>
                  sovereign version
                </code>
              </Card>
              <Card className="bg-card border-border p-6">
                <h3 className="font-bold mb-3">Verbose Output</h3>
                <code className="block bg-black p-3 rounded text-sm text-accent mb-3 font-mono">
                  sovereign --verbose &lt;command&gt;<br/>
                  sovereign -v &lt;command&gt;
                </code>
              </Card>
              <Card className="bg-card border-border p-6">
                <h3 className="font-bold mb-3">JSON Output</h3>
                <code className="block bg-black p-3 rounded text-sm text-accent mb-3 font-mono">
                  sovereign --json &lt;command&gt;<br/>
                  sovereign -j &lt;command&gt;
                </code>
              </Card>
              <Card className="bg-card border-border p-6">
                <h3 className="font-bold mb-3">Piping Commands</h3>
                <code className="block bg-black p-3 rounded text-sm text-accent mb-3 font-mono">
                  sovereign data query term | grep pattern<br/>
                  sovereign logs show | tail -n 100
                </code>
              </Card>
              <Card className="bg-card border-border p-6">
                <h3 className="font-bold mb-3">Scheduled Execution</h3>
                <code className="block bg-black p-3 rounded text-sm text-accent mb-3 font-mono">
                  sovereign-scheduler --cron "0 * * * *" "sovereign health check"
                </code>
              </Card>
            </div>
          </div>
        </section>

        {/* Common Workflows */}
        <section className="py-16 bg-card">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">Common Workflows</h2>
            <div className="space-y-6">
              <Card className="bg-background border-border p-6">
                <h3 className="font-bold mb-3">System Initialization</h3>
                <div className="space-y-2">
                  <code className="block bg-black p-2 rounded text-sm text-accent font-mono">sovereign status</code>
                  <code className="block bg-black p-2 rounded text-sm text-accent font-mono">sovereign labs enable osint dfir behavioral</code>
                  <code className="block bg-black p-2 rounded text-sm text-accent font-mono">sovereign health check</code>
                </div>
              </Card>
              <Card className="bg-background border-border p-6">
                <h3 className="font-bold mb-3">Intelligence Analysis</h3>
                <div className="space-y-2">
                  <code className="block bg-black p-2 rounded text-sm text-accent font-mono">sovereign data query threat_indicator</code>
                  <code className="block bg-black p-2 rounded text-sm text-accent font-mono">sovereign fabric correlate</code>
                  <code className="block bg-black p-2 rounded text-sm text-accent font-mono">sovereign fabric adjudicate</code>
                </div>
              </Card>
              <Card className="bg-background border-border p-6">
                <h3 className="font-bold mb-3">System Backup & Recovery</h3>
                <div className="space-y-2">
                  <code className="block bg-black p-2 rounded text-sm text-accent font-mono">sovereign continuity snapshot</code>
                  <code className="block bg-black p-2 rounded text-sm text-accent font-mono">sovereign continuity archive</code>
                  <code className="block bg-black p-2 rounded text-sm text-accent font-mono">sovereign continuity restore snapshot_id</code>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
