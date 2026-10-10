export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-cyan-400 mb-4">Privacy Policy</h1>
        <p className="text-sm text-gray-400 mb-8"><strong>Effective Date:</strong> August 2026</p>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">1. Introduction</h2>
          <p>Welcome to the Omnicyberdex Sovereign OS ("we," "our," or "us"). We respect your privacy and are committed to protecting it through our compliance with this policy. This policy describes the types of information we may collect from you or that you may provide when you use the Omnicyberdex xApp via the Xaman ecosystem.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">2. Decentralized Architecture & Data Collection</h2>
          <p>The Sovereign OS is built on a decentralized architecture. As an xApp interfacing with the XRP Ledger via Xaman, we do <strong>not</strong> collect, store, or process personal identifiable information (PII) such as your name, email, or physical address. Authentication is handled implicitly through cryptographic signatures on your local device.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">3. Blockchain Telemetry</h2>
          <p>Any interactions made through the xApp (such as yield tracking, swaps, or liquidity provision) are broadcasted directly to the public XRP Ledger. This data is permanently and publicly recorded on the blockchain. We do not maintain proprietary off-chain databases of your transaction history.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">4. Third-Party Services</h2>
          <p>Our xApp relies on the Xaman (XRPL Labs) infrastructure for wallet authentication. We encourage you to review the <a href="https://xrpl-labs.com/static/documents/XRPL-Labs-Privacy-Statement-V1.pdf" target="_blank" className="text-cyan-400 hover:underline">Xaman Privacy Statement</a> regarding how they handle your device data.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">5. Contact Information</h2>
          <p>If you have any questions about this privacy policy or our privacy practices, please contact the Sovereign OS governance node at our official support URL.</p>
        </section>
      </div>
    </div>
  );
}
