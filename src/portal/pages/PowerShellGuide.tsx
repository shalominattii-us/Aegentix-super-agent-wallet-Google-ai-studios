import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Copy, Terminal } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

export default function PowerShellGuide() {
  const [copiedScript, setCopiedScript] = useState<string | null>(null);

  const copyToClipboard = (script: string) => {
    navigator.clipboard.writeText(script);
    setCopiedScript(script);
    setTimeout(() => setCopiedScript(null), 2000);
  };

  const scripts = [
    {
      category: "Installation & Setup",
      scripts: [
        {
          name: "Bootstrap Installation",
          description: "Initial system setup and environment configuration",
          code: `# Run as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force

# Download bootstrap script
$bootstrapUrl = "https://releases.sovereignsystem.com/bootstrap.ps1"
$bootstrapPath = "$env:TEMP\\bootstrap.ps1"
Invoke-WebRequest -Uri $bootstrapUrl -OutFile $bootstrapPath

# Execute bootstrap
& $bootstrapPath -InstallPath "C:\\SovereignSystem" -EnableLabs @("osint", "dfir", "behavioral")`
        },
        {
          name: "Module Installation",
          description: "Install and configure PowerShell modules",
          code: `# Install from PSGallery
Install-Module -Name SovereignSystem -Repository PSGallery -Force

# Import module
Import-Module SovereignSystem

# Verify installation
Get-Module SovereignSystem | Select-Object Name, Version`
        }
      ]
    },
    {
      category: "System Management",
      scripts: [
        {
          name: "Health Check & Diagnostics",
          description: "Comprehensive system health assessment",
          code: `# Run full health check
$healthCheck = Invoke-SovereignCommand -Command "health check" -Verbose

# Parse results
$healthCheck | Select-Object Component, Status, LastCheck | Format-Table

# Generate health report
$healthCheck | Export-Csv -Path "health_report_$(Get-Date -Format 'yyyyMMdd_HHmmss').csv"`
        },
        {
          name: "Automated Backup Routine",
          description: "Schedule daily system snapshots",
          code: `# Create scheduled task for daily snapshots
$action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument @"
  -Command "Invoke-SovereignCommand -Command 'continuity snapshot' -Label 'daily_$(Get-Date -Format 'yyyyMMdd')'"
"@

$trigger = New-ScheduledTaskTrigger -Daily -At 2:00AM

Register-ScheduledTask -TaskName "SovereignDailySnapshot" -Action $action -Trigger $trigger -RunLevel Highest`
        }
      ]
    },
    {
      category: "Intelligence Operations",
      scripts: [
        {
          name: "Threat Intelligence Query",
          description: "Search and correlate threat indicators",
          code: `# Query threat database
$threats = Invoke-SovereignCommand -Command "data query threat_indicator" -Limit 100

# Filter by confidence level
$highConfidence = $threats | Where-Object { $_.confidence -gt 0.85 }

# Export to CSV
$highConfidence | Export-Csv -Path "threats_$(Get-Date -Format 'yyyyMMdd').csv"

# Send alert email
Send-MailMessage -To "soc@company.com" -Subject "High Confidence Threats Detected" -Body "Found $($highConfidence.Count) threats"`
        },
        {
          name: "Correlation Analysis",
          description: "Run multi-source correlation",
          code: `# Execute correlation across sources
$correlation = Invoke-SovereignCommand -Command "fabric correlate" -Sources @("osint", "dfir", "behavioral") -Timeframe "7d"

# Extract correlation results
$results = $correlation.Results | Sort-Object -Property Confidence -Descending

# Display top correlations
$results | Select-Object -First 10 | Format-Table Entity, CorrelationType, Confidence

# Archive results
$correlation | ConvertTo-Json | Out-File -FilePath "correlation_$(Get-Date -Format 'yyyyMMdd_HHmmss').json"`
        }
      ]
    },
    {
      category: "Evidence Management",
      scripts: [
        {
          name: "Batch Evidence Submission",
          description: "Submit multiple evidence items",
          code: `# Get all forensic artifacts
$artifacts = Get-ChildItem -Path "C:\\Forensics\\*" -Recurse -File

# Submit each artifact
foreach ($artifact in $artifacts) {
  $evidenceData = [Convert]::ToBase64String([IO.File]::ReadAllBytes($artifact.FullName))
  
  $result = Invoke-SovereignCommand -Command "evidence submit" -Type "forensic_artifact" -Data $evidenceData -Metadata @{
    SourcePath = $artifact.FullName
    FileHash = (Get-FileHash -Path $artifact.FullName -Algorithm SHA256).Hash
    SubmissionTime = Get-Date
  }
  
  Write-Host "Submitted: $($artifact.Name) - Evidence ID: $($result.EvidenceId)"
}`
        },
        {
          name: "Evidence Verification",
          description: "Verify evidence chain of custody",
          code: `# Get all evidence items
$evidence = Invoke-SovereignCommand -Command "evidence list" -Limit 1000

# Verify each item
$verificationResults = @()
foreach ($item in $evidence) {
  $verification = Invoke-SovereignCommand -Command "evidence verify" -EvidenceId $item.Id
  $verificationResults += $verification
}

# Report on failures
$failures = $verificationResults | Where-Object { -not $_.Verified }
if ($failures.Count -gt 0) {
  Write-Warning "Found $($failures.Count) failed verifications"
  $failures | Export-Csv -Path "verification_failures.csv"
}`
        }
      ]
    },
    {
      category: "Automation Workflows",
      scripts: [
        {
          name: "Continuous Monitoring Loop",
          description: "Real-time system monitoring and alerting",
          code: `# Continuous monitoring loop
$monitoringInterval = 300 # 5 minutes

while ($true) {
  try {
    # Get current status
    $status = Invoke-SovereignCommand -Command "status"
    
    # Check for alerts
    $alerts = Invoke-SovereignCommand -Command "alerts list" -Severity "high"
    
    if ($alerts.Count -gt 0) {
      # Send notification
      Send-Notification -Title "Sovereign System Alert" -Message "Found $($alerts.Count) high-severity alerts" -Severity Critical
      
      # Log alerts
      $alerts | Add-Content -Path "alerts_$(Get-Date -Format 'yyyyMMdd').log"
    }
    
    # Wait before next check
    Start-Sleep -Seconds $monitoringInterval
  }
  catch {
    Write-Error "Monitoring error: $_"
    Start-Sleep -Seconds 60
  }
}`
        },
        {
          name: "Automated Remediation",
          description: "Automatic response to detected threats",
          code: `# Define threat response policies
$threatPolicies = @{
  "malware_detected" = { Invoke-SovereignCommand -Command "autonomy heal" }
  "unauthorized_access" = { Invoke-SovereignCommand -Command "autonomy quarantine" }
  "data_exfiltration" = { Invoke-SovereignCommand -Command "autonomy isolate" }
}

# Monitor and respond
while ($true) {
  $threats = Invoke-SovereignCommand -Command "data query active_threats"
  
  foreach ($threat in $threats) {
    if ($threatPolicies.ContainsKey($threat.Type)) {
      Write-Host "Executing remediation for: $($threat.Type)"
      & $threatPolicies[$threat.Type]
      
      # Log remediation
      $threat | Add-Member -NotePropertyName RemediationTime -NotePropertyValue (Get-Date)
      $threat | Export-Csv -Path "remediation_log.csv" -Append
    }
  }
  
  Start-Sleep -Seconds 60
}`
        }
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
          <h1 className="text-lg font-bold">POWERSHELL & AUTOMATION</h1>
          <div className="w-20"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-b from-primary/10 to-background">
          <div className="container">
            <h1 className="text-5xl font-bold mb-4">PowerShell & Automation Guide</h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Automate Sovereign System operations with PowerShell scripts and workflows.
            </p>
          </div>
        </section>

        {/* Scripts */}
        <section className="py-16 bg-card">
          <div className="container">
            <div className="space-y-12">
              {scripts.map((category, catIdx) => (
                <div key={catIdx}>
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Terminal className="w-6 h-6 text-accent" />
                    {category.category}
                  </h2>
                  <div className="space-y-4">
                    {category.scripts.map((script, scriptIdx) => (
                      <Card key={scriptIdx} className="bg-background border-border p-6 hover:border-primary transition">
                        <div className="mb-4">
                          <h3 className="font-bold text-lg mb-1">{script.name}</h3>
                          <p className="text-sm text-muted-foreground">{script.description}</p>
                        </div>
                        <div className="bg-black p-4 rounded font-mono text-xs text-accent overflow-x-auto mb-4 max-h-64 overflow-y-auto">
                          <pre>{script.code}</pre>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(script.code)}
                          className="gap-2"
                        >
                          <Copy className="w-4 h-4" />
                          {copiedScript === script.code ? "Copied!" : "Copy Script"}
                        </Button>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Best Practices */}
        <section className="py-16 bg-background">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">Best Practices</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-card border-border p-6">
                <h3 className="font-bold mb-3">Error Handling</h3>
                <div className="bg-black p-3 rounded font-mono text-xs text-accent overflow-x-auto">
                  <p>try {'{'}  </p>
                  <p>  $result = Invoke-SovereignCommand ...</p>
                  <p>{'}'}  </p>
                  <p>catch {'{'}  </p>
                  <p>  Write-Error "Command failed: $_"</p>
                  <p>{'}'}  </p>
                </div>
              </Card>
              <Card className="bg-card border-border p-6">
                <h3 className="font-bold mb-3">Logging</h3>
                <div className="bg-black p-3 rounded font-mono text-xs text-accent overflow-x-auto">
                  <p>$logPath = "logs_$(Get-Date -Format 'yyyyMMdd').log"</p>
                  <p className="mt-2">Add-Content -Path $logPath -Value "[$(Get-Date)] Operation completed"</p>
                </div>
              </Card>
              <Card className="bg-card border-border p-6">
                <h3 className="font-bold mb-3">Credentials</h3>
                <div className="bg-black p-3 rounded font-mono text-xs text-accent overflow-x-auto">
                  <p>$cred = Get-Credential</p>
                  <p className="mt-2">$result = Invoke-SovereignCommand -Credential $cred ...</p>
                </div>
              </Card>
              <Card className="bg-card border-border p-6">
                <h3 className="font-bold mb-3">Scheduling</h3>
                <div className="bg-black p-3 rounded font-mono text-xs text-accent overflow-x-auto">
                  <p>$trigger = New-ScheduledTaskTrigger -Daily -At 2:00AM</p>
                  <p className="mt-2">Register-ScheduledTask -TaskName "Task" -Trigger $trigger</p>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
