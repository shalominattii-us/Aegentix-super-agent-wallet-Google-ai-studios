import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { Link } from "wouter";

export default function Ceremony() {
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
          <h1 className="text-lg font-bold">THE RITE OF INTEGRITY</h1>
          <div className="w-20"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-b from-primary/10 to-background">
          <div className="container">
            <h1 className="text-5xl font-bold mb-4">The Rite of Integrity: State Ceremony</h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              An annual ceremony held to reaffirm the foundational principles of the Sovereign System. All citizens are encouraged to attend, bearing witness and participating in the collective reaffirmation of the Sovereign Imperial Codex.
            </p>
          </div>
        </section>

        {/* Purpose */}
        <section className="py-16 bg-card">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">Purpose of the Ceremony</h2>
            <Card className="bg-background border-border p-6">
              <p className="text-muted-foreground mb-4">
                The Rite of Integrity is a solemn and profound ceremony held annually to reaffirm the foundational principles of the Sovereign System: Integrity, Resilience, Transparency, and Sovereignty. It serves to honor the Architects of Order, acknowledge the Custodians of the System, and rededicate all citizens to the enduring wisdom of the Sovereign Imperial Codex.
              </p>
              <p className="text-muted-foreground">
                This ceremony reinforces unity, purpose, and the collective commitment to a just and balanced society.
              </p>
            </Card>
          </div>
        </section>

        {/* Participants */}
        <section className="py-16 bg-background">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">Participants</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-card border-border p-6">
                <h3 className="font-bold mb-3 text-accent">Leadership</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><strong>The Hemperor:</strong> Supreme ceremonial head, presiding over the Rite</li>
                  <li><strong>High Council of Custodians:</strong> Representatives from all branches</li>
                  <li><strong>Architects of Order:</strong> Descendants embodying the original spirit</li>
                </ul>
              </Card>
              <Card className="bg-card border-border p-6">
                <h3 className="font-bold mb-3 text-accent">Citizens</h3>
                <p className="text-sm text-muted-foreground">
                  All citizens of the Sovereign System are encouraged to attend, either physically in the Grand Hall of Governance or through holographic projection. Participation is voluntary but deeply encouraged as a sign of commitment to the system.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Setting */}
        <section className="py-16 bg-card">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">Setting</h2>
            <Card className="bg-background border-border p-6">
              <p className="text-muted-foreground mb-4">
                The ceremony takes place in the <strong>Grand Hall of Governance</strong>, a structure renowned for its architectural grandeur and symbolic significance. The hall is adorned with the Grand Banner of the Sovereign System, and the Constitutional Court Emblem is prominently displayed.
              </p>
              <p className="text-muted-foreground">
                The atmosphere is one of reverence and unity, with subtle lighting and resonant acoustics that create a sense of profound solemnity and shared purpose.
              </p>
            </Card>
          </div>
        </section>

        {/* Ceremony Flow */}
        <section className="py-16 bg-background">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">Ceremony Flow</h2>
            <div className="space-y-6">
              <Card className="bg-card border-border p-6">
                <h3 className="text-xl font-bold mb-4 text-accent">I. The Procession of Principles (Opening)</h3>
                <div className="space-y-3 text-muted-foreground">
                  <p><strong>1. Fanfare of Unity:</strong> A majestic musical fanfare signifies the convergence of all elements of the Sovereign System.</p>
                  <p><strong>2. Entry of the High Council:</strong> The High Council of Custodians processes into the Grand Hall, each member carrying a symbolic representation of their branch.</p>
                  <p><strong>3. Entry of the Hemperor:</strong> The Hemperor enters, clad in the ceremonial variant of the Sovereign Uniform, accompanied by an honor guard.</p>
                </div>
              </Card>

              <Card className="bg-card border-border p-6">
                <h3 className="text-xl font-bold mb-4 text-accent\">II. The Invocation of the Codex (Reading and Reflection)</h3>
                <div className="space-y-3 text-muted-foreground">
                  <p><strong>1. Recitation of the Founding Myth:</strong> A designated Custodian recites the Genesis of the Sovereign System, reminding all of the origins and purpose of the Codex.</p>
                  <p><strong>2. Reading from the Sovereign Imperial Codex:</strong> The Hemperor reads a selected passage, emphasizing one of the core principles relevant to the current year.</p>
                  <p><strong>3. Moment of Silent Reflection:</strong> A period of silence allows participants to reflect on the meaning of the Codex and its application in their lives.</p>
                </div>
              </Card>

              <Card className="bg-card border-border p-6">
                <h3 className="text-xl font-bold mb-4 text-accent\">III. The Affirmation of Engines (Symbolic Act)</h3>
                <div className="space-y-3 text-muted-foreground">
                  <p><strong>1. Presentation of the Engines:</strong> Symbolic representations of the Baseline Engine and Ledger Engine are brought forward and placed on a central altar.</p>
                  <p><strong>2. The Hemperor Address:</strong> The Hemperor highlights the importance of the Engines in maintaining balance and truth within the System.</p>
                  <p><strong>3. Activation of the Scales:</strong> The Hemperor and a representative from the High Tribunal perform a symbolic activation of the Scales of Integrity.</p>
                </div>
              </Card>

              <Card className="bg-card border-border p-6">
                <h3 className="text-xl font-bold mb-4 text-accent\">IV. The Pledge of Custodians (Commitment)</h3>
                <div className="space-y-3 text-muted-foreground">
                  <p><strong>1. Oath of Service:</strong> The High Council of Custodians collectively renews their Oath of Service, pledging to uphold the Codex and protect the System.</p>
                  <p><strong>2. Presentation of the EagleShield:</strong> Each Custodian is presented with a ceremonial EagleShield emblem, symbolizing their individual and collective vigilance.</p>
                </div>
              </Card>

              <Card className="bg-card border-border p-6">
                <h3 className="text-xl font-bold mb-4 text-accent\">V. The Unison of Citizens (Collective Reaffirmation)</h3>
                <div className="space-y-3 text-muted-foreground">
                  <p><strong>1. Citizen Vow:</strong> All citizens present and remote join in a collective vow, reaffirming their commitment to the principles of the Sovereign System.</p>
                  <p><strong>2. Hymn of Sovereignty:</strong> A powerful hymn celebrating the unity and strength of the Sovereign System is sung by all.</p>
                </div>
              </Card>

              <Card className="bg-card border-border p-6">
                <h3 className="text-xl font-bold mb-4 text-accent\">VI. The Benediction of Balance (Closing)</h3>
                <div className="space-y-3 text-muted-foreground">
                  <p><strong>1. The Hemperor Benediction:</strong> The Hemperor offers a final benediction, invoking continued balance, prosperity, and integrity for the Sovereign System.</p>
                  <p><strong>2. Recessional:</strong> The Hemperor and High Council process out of the Grand Hall, followed by the citizens.</p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Post-Ceremony */}
        <section className="py-16 bg-card">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">Post-Ceremony Activities</h2>
            <Card className="bg-background border-border p-6">
              <p className="text-muted-foreground mb-4">
                Following the Rite, community gatherings are held throughout the Sovereign System, fostering dialogue and reinforcing the bonds of citizenship. These gatherings provide opportunities for citizens to discuss the principles of the Codex and share their commitment to the system.
              </p>
              <p className="text-muted-foreground mb-4">
                Educational programs are launched to further disseminate the principles discussed during the ceremony, ensuring that the spirit of the Rite of Integrity resonates throughout the year.
              </p>
              <p className="text-muted-foreground">
                The ceremony concludes with a grand feast celebrating the unity and strength of the Sovereign System, bringing together citizens from all walks of life.
              </p>
            </Card>
          </div>
        </section>

        {/* Significance */}
        <section className="py-16 bg-background">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">Significance and Impact</h2>
            <div className="space-y-6">
              <Card className="bg-card border-border p-6">
                <h3 className="font-bold mb-3 text-accent\">Collective Identity</h3>
                <p className="text-muted-foreground">
                  The Rite of Integrity reinforces the collective identity of the Sovereign System. By gathering together and reaffirming shared principles, citizens strengthen their sense of belonging and purpose within the system.
                </p>
              </Card>
              <Card className="bg-card border-border p-6">
                <h3 className="font-bold mb-3 text-accent\">Renewal of Commitment</h3>
                <p className="text-muted-foreground">
                  The ceremony provides an opportunity for all citizens to renew their personal commitment to the principles of the Codex. This annual reaffirmation ensures that the system remains grounded in its foundational values.
                </p>
              </Card>
              <Card className="bg-card border-border p-6">
                <h3 className="font-bold mb-3 text-accent\">Institutional Continuity</h3>
                <p className="text-muted-foreground">
                  By honoring the Architects of Order and acknowledging the Custodians of the System, the ceremony ensures the continuity of institutional knowledge and authority. It links past, present, and future generations in a chain of commitment.
                </p>
              </Card>
              <Card className="bg-card border-border p-6">
                <h3 className="font-bold mb-3 text-accent\">Social Cohesion</h3>
                <p className="text-muted-foreground">
                  The ceremony fosters social cohesion by bringing together citizens from all backgrounds and levels of society. It demonstrates that all are equal before the principles of the Codex and united in their commitment to the system.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-background border-t border-border py-12">
          <div className="container text-center text-sm text-muted-foreground">
            <p>© 2026 The Sovereign System. INTEGRITAS SUPREMA.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
