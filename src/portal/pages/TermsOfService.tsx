export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-cyan-400 mb-4">Terms of Service</h1>
        <p className="text-sm text-gray-400 mb-8"><strong>Effective Date:</strong> August 2026</p>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">1. Agreement to Terms</h2>
          <p>By accessing or using the Omnicyberdex Sovereign OS xApp, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, then you may not access the service.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">2. Decentralized Financial Protocols</h2>
          <p>The Omnicyberdex is a decentralized application (xApp) operating on the XRP Ledger. You acknowledge that all transactions executed via the xApp are immutable and irreversible. We do not have custody of your funds at any time. You are solely responsible for the security of your cryptographic keys and hardware devices.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">3. Moltbook Swarm & Yield Representation</h2>
          <p>Data presented within the xApp, including Moltbook Swarm telemetry and yield estimates, are provided for informational and audit purposes only. They do not constitute financial advice or a guarantee of returns.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">4. Limitation of Liability</h2>
          <p>In no event shall the creators, operators, or contributors of the Sovereign OS be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the xApp.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">5. Changes to Terms</h2>
          <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.</p>
        </section>
      </div>
    </div>
  );
}
