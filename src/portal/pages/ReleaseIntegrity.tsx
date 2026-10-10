import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, CheckCircle, AlertCircle, Copy, Download, Shield } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

interface Artifact {
  file: string;
  path: string;
  sha256: string;
  size: number;
}

interface ReleaseData {
  sovereign_release: string;
  build_id: string;
  generated_on: string;
  artifacts: Artifact[];
  signing: {
    certificate_thumbprint: string;
    signature_timestamp: string;
    signtool_version: string;
  };
}

const mockReleaseData: ReleaseData = {
  sovereign_release: "ASCENDED-1.0.0",
  build_id: "SOV-PRIME",
  generated_on: "2026-05-02 19:30:00 UTC",
  signing: {
    certificate_thumbprint: "A1B2C3D4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B",
    signature_timestamp: "2026-05-02T19:30:00Z",
    signtool_version: "6.3.9600.16384"
  },
  artifacts: [
    {
      file: "SovereignSystem.msi",
      path: "downloads/windows/SovereignSystem.msi",
      sha256: "a7f3e8c2d9b1f4e6a8c3d5b7f9e1a3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5",
      size: 524288000,
    },
    {
      file: "SovereignSystem.exe",
      path: "downloads/windows/SovereignSystem.exe",
      sha256: "b8g4f9d3e0c5h7i2j6k1l4m8n3o6p9q2r5s8t1u4v7w0x3y6z9a2b5c8d1e4f7",
      size: 456192000,
    },
    {
      file: "sovereignsystem.tar.gz",
      path: "downloads/linux/sovereignsystem.tar.gz",
      sha256: "c9h5g0e4f1d6i3j7k2l5m9n4o7p0q3r6s9t2u5v8w1x4y7z0a3b6c9d2e5f8a1",
      size: 387072000,
    },
    {
      file: "Sovereign_System_Specification.md",
      path: "downloads/docs/Sovereign_System_Specification.md",
      sha256: "d0i6h1f5g2e7j4k8l3m6n0o3p6q9r2s5t8u1v4w7x0y3z6a9b2c5d8e1f4g7h0",
      size: 2048576,
    },
    {
      file: "Sovereign_Operator_Guide.md",
      path: "downloads/docs/Sovereign_Operator_Guide.md",
      sha256: "e1j7i2g6h3f8k5l9m4n7o0p3q6r9s2t5u8v1w4x7y0z3a6b9c2d5e8f1g4h7i0",
      size: 1572864,
    },
  ],
};

export default function ReleaseIntegrity() {
  const [verificationInput, setVerificationInput] = useState("");
  const [verificationResult, setVerificationResult] = useState<{
    status: "match" | "mismatch" | "none";
    file?: string;
  }>({ status: "none" });

  const verifyChecksum = () => {
    const input = verificationInput.toLowerCase().trim();
    const found = mockReleaseData.artifacts.find(
      (a) => a.sha256.toLowerCase() === input
    );

    if (found) {
      setVerificationResult({ status: "match", file: found.file });
    } else if (input.length === 64) {
      setVerificationResult({ status: "mismatch" });
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ["B", "KB", "MB", "GB"];
    if (bytes === 0) return "0 B";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

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
          <h1 className="text-lg font-bold">RELEASE & INTEGRITY</h1>
          <div className="w-20"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-b from-primary/10 to-background">
          <div className="container">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-8 h-8 text-accent" />
              <h1 className="text-5xl font-bold">Release & Integrity Verification</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Verify the authenticity and integrity of Sovereign System releases using checksums and digital signatures.
            </p>
          </div>
        </section>

        <div className="container py-16 space-y-12">
          {/* Release Information */}
          <section>
            <h2 className="text-3xl font-bold mb-6">Release Information</h2>
            <Card className="bg-card border-border p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Release Version</p>
                  <p className="text-2xl font-bold text-accent">
                    {mockReleaseData.sovereign_release}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Build ID</p>
                  <p className="text-2xl font-bold text-accent">
                    {mockReleaseData.build_id}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Generated On</p>
                  <p className="text-lg font-mono text-accent">
                    {mockReleaseData.generated_on}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Status</p>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="font-bold">COMPLETE</span>
                  </div>
                </div>
              </div>
            </Card>
          </section>

          {/* Digital Signatures */}
          <section>
            <h2 className="text-3xl font-bold mb-6">Digital Signatures</h2>
            <Card className="bg-card border-border p-8">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Certificate Thumbprint</p>
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-black p-3 rounded flex-1 font-mono text-accent overflow-auto">
                      {mockReleaseData.signing.certificate_thumbprint || "INSERT_THUMBPRINT"}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        copyToClipboard(
                          mockReleaseData.signing.certificate_thumbprint
                        )
                      }
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Signature Timestamp</p>
                  <p className="text-lg font-mono text-accent">
                    {mockReleaseData.signing.signature_timestamp || "AUTO"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">SignTool Version</p>
                  <p className="text-lg font-mono text-accent">
                    {mockReleaseData.signing.signtool_version || "AUTO"}
                  </p>
                </div>
              </div>
            </Card>
          </section>

          {/* Checksum Verification Tool */}
          <section>
            <h2 className="text-3xl font-bold mb-6">Verify Download Integrity</h2>
            <Card className="bg-card border-border p-8">
              <p className="text-muted-foreground mb-4">
                Paste the SHA256 checksum of your downloaded file to verify its authenticity.
              </p>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={verificationInput}
                    onChange={(e) => setVerificationInput(e.target.value)}
                    placeholder="Paste SHA256 checksum here..."
                    className="font-mono text-sm"
                  />
                  <Button onClick={verifyChecksum} className="gap-2">
                    <Shield className="w-4 h-4" />
                    Verify
                  </Button>
                </div>

                {verificationResult.status === "match" && (
                  <div className="bg-green-500/10 border border-green-500/30 rounded p-4 flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-green-400">Checksum Verified</p>
                      <p className="text-sm text-green-300">
                        File matches: <span className="font-mono">{verificationResult.file}</span>
                      </p>
                    </div>
                  </div>
                )}

                {verificationResult.status === "mismatch" && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded p-4 flex items-center gap-3">
                    <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-red-400">Checksum Mismatch</p>
                      <p className="text-sm text-red-300">
                        This checksum does not match any artifact in this release.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </section>

          {/* Artifact Manifest */}
          <section>
            <h2 className="text-3xl font-bold mb-6">Artifact Manifest</h2>
            <div className="space-y-4">
              {mockReleaseData.artifacts.map((artifact, idx) => (
                <Card key={idx} className="bg-card border-border p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-bold text-lg">{artifact.file}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(artifact.size)}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(artifact.sha256)}
                        className="gap-2"
                      >
                        <Copy className="w-4 h-4" />
                        Copy SHA256
                      </Button>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground mb-2">SHA256 Checksum</p>
                      <code className="text-xs bg-black p-3 rounded block font-mono text-accent overflow-auto break-all">
                        {artifact.sha256}
                      </code>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-2"
                        onClick={() => copyToClipboard(artifact.sha256)}
                      >
                        <Copy className="w-4 h-4" />
                        Copy Checksum
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-2"
                        onClick={() => {
                          const element = document.createElement("a");
                          element.setAttribute(
                            "href",
                            `data:text/plain;charset=utf-8,${encodeURIComponent(
                              `${artifact.sha256}  ${artifact.file}`
                            )}`
                          );
                          element.setAttribute("download", `${artifact.file}.sha256`);
                          element.style.display = "none";
                          document.body.appendChild(element);
                          element.click();
                          document.body.removeChild(element);
                        }}
                      >
                        <Download className="w-4 h-4" />
                        Download SHA256
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Verification Instructions */}
          <section>
            <h2 className="text-3xl font-bold mb-6">How to Verify</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-card border-border p-6">
                <h3 className="font-bold text-lg mb-4">Windows (PowerShell)</h3>
                <pre className="bg-black p-4 rounded text-xs font-mono text-accent overflow-auto">
{`# Calculate checksum
$file = "SovereignSystem.msi"
$hash = (Get-FileHash $file -Algorithm SHA256).Hash
Write-Host $hash

# Compare with manifest
$manifest_hash = "a7f3e8c2..."
if ($hash -eq $manifest_hash) {
  Write-Host "✓ Verified"
} else {
  Write-Host "✗ Mismatch"
}`}
                </pre>
              </Card>

              <Card className="bg-card border-border p-6">
                <h3 className="font-bold text-lg mb-4">Linux/macOS (Terminal)</h3>
                <pre className="bg-black p-4 rounded text-xs font-mono text-accent overflow-auto">
{`# Calculate checksum
sha256sum sovereignsystem.tar.gz

# Verify against manifest
sha256sum -c checksums.sha256

# Expected output:
# sovereignsystem.tar.gz: OK`}
                </pre>
              </Card>
            </div>
          </section>

          {/* Release History */}
          <section>
            <h2 className="text-3xl font-bold mb-6">Release History</h2>
            <div className="space-y-4">
              {[
                {
                  version: "ASCENDED-1.0.0",
                  date: "2026-05-02",
                  status: "Current",
                  notes: "Initial ASCENDED release",
                },
                {
                  version: "BETA-0.9.8",
                  date: "2026-04-28",
                  status: "Archived",
                  notes: "Final beta release",
                },
                {
                  version: "BETA-0.9.5",
                  date: "2026-04-20",
                  status: "Archived",
                  notes: "Stage 8 integration",
                },
              ].map((release, idx) => (
                <Card key={idx} className="bg-card border-border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold">{release.version}</p>
                      <p className="text-sm text-muted-foreground">
                        {release.date} • {release.notes}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-3 py-1 rounded text-xs font-bold ${
                          release.status === "Current"
                            ? "bg-accent/20 text-accent"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {release.status}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
