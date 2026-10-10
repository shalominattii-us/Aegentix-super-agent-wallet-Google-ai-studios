import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Upload, CheckCircle, AlertCircle, Shield, Download } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

interface VerificationResult {
  id: string;
  timestamp: string;
  harness: string;
  status: "verified" | "failed" | "pending";
  checksumMatch: boolean;
  signatureValid: boolean;
  integrityScore: number;
  details: string;
}

const mockVerificationResults: VerificationResult[] = [
  {
    id: "VER-001",
    timestamp: "2026-05-02 19:15:00 UTC",
    harness: "Installation Validation",
    status: "verified",
    checksumMatch: true,
    signatureValid: true,
    integrityScore: 100,
    details: "All components verified successfully",
  },
  {
    id: "VER-002",
    timestamp: "2026-05-02 19:12:00 UTC",
    harness: "Operational Integrity",
    status: "verified",
    checksumMatch: true,
    signatureValid: true,
    integrityScore: 100,
    details: "System operational integrity confirmed",
  },
  {
    id: "VER-003",
    timestamp: "2026-05-02 19:10:00 UTC",
    harness: "Portal Integration",
    status: "verified",
    checksumMatch: true,
    signatureValid: true,
    integrityScore: 98,
    details: "Minor cache inconsistency detected but resolved",
  },
  {
    id: "VER-004",
    timestamp: "2026-05-02 19:08:00 UTC",
    harness: "Security Validation",
    status: "verified",
    checksumMatch: true,
    signatureValid: true,
    integrityScore: 100,
    details: "Security scan passed all checks",
  },
  {
    id: "VER-005",
    timestamp: "2026-05-02 19:05:00 UTC",
    harness: "API Compliance",
    status: "verified",
    checksumMatch: true,
    signatureValid: true,
    integrityScore: 99,
    details: "API compliance verified with 1 deprecation warning",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "verified":
      return "text-green-500";
    case "failed":
      return "text-red-500";
    case "pending":
      return "text-yellow-500";
    default:
      return "text-gray-500";
  }
};

const getStatusBgColor = (status: string) => {
  switch (status) {
    case "verified":
      return "bg-green-500/10 border-green-500/30";
    case "failed":
      return "bg-red-500/10 border-red-500/30";
    case "pending":
      return "bg-yellow-500/10 border-yellow-500/30";
    default:
      return "bg-gray-500/10 border-gray-500/30";
  }
};

export default function IntegrityVerificationPortal() {
  const [selectedResult, setSelectedResult] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");

  const verifiedCount = mockVerificationResults.filter(r => r.status === "verified").length;
  const failedCount = mockVerificationResults.filter(r => r.status === "failed").length;
  const avgIntegrityScore =
    (mockVerificationResults.reduce((sum, r) => sum + r.integrityScore, 0) /
      mockVerificationResults.length).toFixed(1);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadStatus("uploading");
      setTimeout(() => {
        setUploadStatus("success");
        setTimeout(() => setUploadStatus("idle"), 3000);
      }, 2000);
    }
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
          <h1 className="text-lg font-bold">INTEGRITY VERIFICATION PORTAL</h1>
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
              <h1 className="text-5xl font-bold">Integrity Verification Portal</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Load, verify, and validate test results from multiple harness instances with cryptographic integrity checks.
            </p>
          </div>
        </section>

        <div className="container py-16 space-y-12">
          {/* Upload Section */}
          <section>
            <h2 className="text-3xl font-bold mb-6">Load Verification Results</h2>
            <Card className="bg-card border-border p-8">
              <div className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-accent transition cursor-pointer">
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="font-bold mb-2">Upload Verification Results</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Drag and drop your verification JSON file or click to browse
                  </p>
                  <Input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <Button onClick={() => document.getElementById("file-upload")?.click()}>
                    Select File
                  </Button>
                </div>

                {uploadStatus === "uploading" && (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-4 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                    <p className="text-sm">Processing verification file...</p>
                  </div>
                )}

                {uploadStatus === "success" && (
                  <div className="bg-green-500/10 border border-green-500/30 rounded p-4 flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <p className="text-sm">Verification results loaded successfully</p>
                  </div>
                )}
              </div>
            </Card>
          </section>

          {/* Summary Metrics */}
          <section>
            <h2 className="text-3xl font-bold mb-6">Verification Summary</h2>
            <div className="grid md:grid-cols-4 gap-4">
              <Card className="bg-card border-border p-6">
                <p className="text-sm text-muted-foreground mb-2">Total Results</p>
                <p className="text-4xl font-bold text-accent">{mockVerificationResults.length}</p>
              </Card>

              <Card className="bg-card border-border p-6">
                <p className="text-sm text-muted-foreground mb-2">Verified</p>
                <p className="text-4xl font-bold text-green-500">{verifiedCount}</p>
              </Card>

              <Card className="bg-card border-border p-6">
                <p className="text-sm text-muted-foreground mb-2">Failed</p>
                <p className="text-4xl font-bold text-red-500">{failedCount}</p>
              </Card>

              <Card className="bg-card border-border p-6">
                <p className="text-sm text-muted-foreground mb-2">Avg Integrity Score</p>
                <p className="text-4xl font-bold text-accent">{avgIntegrityScore}%</p>
              </Card>
            </div>
          </section>

          {/* Verification Results */}
          <section>
            <h2 className="text-3xl font-bold mb-6">Verification Results</h2>
            <div className="space-y-4">
              {mockVerificationResults.map((result) => (
                <Card
                  key={result.id}
                  className={`bg-card border-border p-6 cursor-pointer transition hover:border-accent ${
                    selectedResult === result.id ? "border-accent" : ""
                  }`}
                  onClick={() => setSelectedResult(selectedResult === result.id ? null : result.id)}
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-mono text-sm text-muted-foreground">{result.id}</span>
                          <span
                            className={`px-3 py-1 rounded text-xs font-bold uppercase ${getStatusBgColor(
                              result.status
                            )} ${getStatusColor(result.status)}`}
                          >
                            {result.status}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{result.harness}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">{result.timestamp}</p>
                        <p className="text-2xl font-bold text-accent mt-1">{result.integrityScore}%</p>
                      </div>
                    </div>

                    {/* Quick Status */}
                    <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-border">
                      <div className="flex items-center gap-2">
                        {result.checksumMatch ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-red-500" />
                        )}
                        <span className="text-sm">
                          {result.checksumMatch ? "Checksum Valid" : "Checksum Invalid"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {result.signatureValid ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-red-500" />
                        )}
                        <span className="text-sm">
                          {result.signatureValid ? "Signature Valid" : "Signature Invalid"}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">{result.details}</p>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {selectedResult === result.id && (
                      <div className="pt-4 border-t border-border space-y-4">
                        <div className="bg-black p-4 rounded">
                          <p className="text-sm font-bold mb-3 text-accent">Verification Details</p>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Harness:</span>
                              <span className="text-accent">{result.harness}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Timestamp:</span>
                              <span className="text-accent">{result.timestamp}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Checksum Match:</span>
                              <span className={result.checksumMatch ? "text-green-500" : "text-red-500"}>
                                {result.checksumMatch ? "Yes" : "No"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Signature Valid:</span>
                              <span className={result.signatureValid ? "text-green-500" : "text-red-500"}>
                                {result.signatureValid ? "Yes" : "No"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Integrity Score:</span>
                              <span className="text-accent">{result.integrityScore}%</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-black p-4 rounded">
                          <p className="text-sm font-bold mb-2 text-accent">Status Message</p>
                          <p className="text-sm text-muted-foreground">{result.details}</p>
                        </div>

                        <div className="flex gap-2">
                          <Button className="flex-1 gap-2">
                            <Download className="w-4 h-4" />
                            Export Result
                          </Button>
                          <Button variant="outline" className="flex-1">
                            View Full Report
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Verification Standards */}
          <section>
            <h2 className="text-3xl font-bold mb-6">Verification Standards</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-card border-border p-6">
                <h3 className="font-bold text-lg mb-4">Checksum Verification</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• SHA256 hash validation</li>
                  <li>• File integrity confirmation</li>
                  <li>• Manifest cross-reference</li>
                  <li>• Corruption detection</li>
                </ul>
              </Card>

              <Card className="bg-card border-border p-6">
                <h3 className="font-bold text-lg mb-4">Signature Verification</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Digital signature validation</li>
                  <li>• Certificate chain verification</li>
                  <li>• Timestamp authority checks</li>
                  <li>• Revocation status verification</li>
                </ul>
              </Card>

              <Card className="bg-card border-border p-6">
                <h3 className="font-bold text-lg mb-4">Integrity Scoring</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• 100%: All checks passed</li>
                  <li>• 95-99%: Minor warnings</li>
                  <li>• 80-94%: Recoverable issues</li>
                  <li>• &lt;80%: Critical failures</li>
                </ul>
              </Card>

              <Card className="bg-card border-border p-6">
                <h3 className="font-bold text-lg mb-4">Operator Actions</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Load verification results</li>
                  <li>• Export reports</li>
                  <li>• Archive results</li>
                  <li>• Compare versions</li>
                </ul>
              </Card>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
