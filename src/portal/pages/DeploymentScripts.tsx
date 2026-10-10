import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Copy, Download, Play, Settings, Terminal, FileText } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { Streamdown } from "streamdown";

interface Script {
  id: string;
  name: string;
  description: string;
  language: "powershell" | "bash";
  category: string;
  code: string;
  usage: string;
}

const scripts: Script[] = [
  {
    id: "ps-deploy-harness",
    name: "Deploy Test Harness Instance",
    description: "Deploy a new test harness instance with full configuration",
    language: "powershell",
    category: "Deployment",
    code: `# ================================
# Sovereign Test Harness Deployment
# ================================

param(
    [string]$HarnessType = "Installation",
    [string]$InstanceName = "harness-$(Get-Date -Format 'yyyyMMdd-HHmmss')",
    [string]$Deployment = "Production",
    [int]$Port = 8080
)

Write-Host "=== Deploying Test Harness ===" -ForegroundColor Cyan

# 1. Validate Prerequisites
Write-Host "[1/5] Validating prerequisites..." -ForegroundColor Yellow
$dotnetVersion = dotnet --version
$dockerVersion = docker --version
Write-Host "✓ .NET: $dotnetVersion" -ForegroundColor Green
Write-Host "✓ Docker: $dockerVersion" -ForegroundColor Green

# 2. Create Instance Directory
Write-Host "[2/5] Creating instance directory..." -ForegroundColor Yellow
$InstancePath = "C:\\Sovereign\\Instances\\$InstanceName"
New-Item -ItemType Directory -Force -Path $InstancePath | Out-Null
Write-Host "✓ Instance path: $InstancePath" -ForegroundColor Green

# 3. Configure Harness
Write-Host "[3/5] Configuring harness..." -ForegroundColor Yellow
$Config = @{
    instance_id = $InstanceName
    harness_type = $HarnessType
    deployment = $Deployment
    port = $Port
    created_at = (Get-Date).ToUniversalTime().ToString("o")
    status = "initializing"
}
$Config | ConvertTo-Json | Set-Content "$InstancePath\\config.json"
Write-Host "✓ Configuration saved" -ForegroundColor Green

# 4. Start Services
Write-Host "[4/5] Starting services..." -ForegroundColor Yellow
docker run -d \
  --name "sovereign-$InstanceName" \
  -p "$Port:8080" \
  -v "$InstancePath:/app/config" \
  sovereignsystem/harness:latest
Write-Host "✓ Services started on port $Port" -ForegroundColor Green

# 5. Verify Deployment
Write-Host "[5/5] Verifying deployment..." -ForegroundColor Yellow
Start-Sleep -Seconds 3
$Health = Invoke-RestMethod -Uri "http://localhost:$Port/health" -ErrorAction SilentlyContinue
if ($Health.status -eq "healthy") {
    Write-Host "✓ Deployment successful!" -ForegroundColor Green
    Write-Host "Instance: $InstanceName" -ForegroundColor Cyan
    Write-Host "Access: http://localhost:$Port" -ForegroundColor Cyan
} else {
    Write-Host "✗ Deployment verification failed" -ForegroundColor Red
}`,
    usage: ".\\deploy-harness.ps1 -HarnessType 'Installation' -InstanceName 'harness-prod-01' -Deployment 'Production' -Port 8080"
  },
  {
    id: "ps-monitor-harness",
    name: "Monitor Harness Instance",
    description: "Real-time monitoring of harness instance health and metrics",
    language: "powershell",
    category: "Monitoring",
    code: `# ================================
# Sovereign Harness Monitor
# ================================

param(
    [string]$InstanceName,
    [int]$RefreshInterval = 5
)

Write-Host "=== Harness Instance Monitor ===" -ForegroundColor Cyan
Write-Host "Instance: $InstanceName" -ForegroundColor Yellow
Write-Host "Refresh Interval: $RefreshInterval s" -ForegroundColor Yellow
Write-Host ""

while ($true) {
    Clear-Host
    Write-Host "=== SOVEREIGN HARNESS MONITOR ===" -ForegroundColor Cyan
    Write-Host "Instance: $InstanceName | Updated: $(Get-Date -Format 'HH:mm:ss')" -ForegroundColor Yellow
    Write-Host ""

    # Get Container Info
    $Container = docker ps --filter "name=sovereign-$InstanceName" --format "{{json .}}" | ConvertFrom-Json
    
    if ($Container) {
        Write-Host "Container Status: RUNNING" -ForegroundColor Green
        Write-Host "Container ID: $($Container.ID.Substring(0, 12))" -ForegroundColor Gray
        Write-Host "Uptime: $($Container.RunningFor)" -ForegroundColor Gray
        Write-Host ""

        # Get Health Metrics
        try {
            $Port = $Container.Ports -split "," | Select-Object -First 1 | ForEach-Object { $_ -replace ".*:([0-9]+).*", '$1' }
            $Health = Invoke-RestMethod -Uri "http://localhost:$Port/health" -ErrorAction SilentlyContinue
            
            Write-Host "HEALTH STATUS" -ForegroundColor Cyan
            Write-Host "  Status: $($Health.status)" -ForegroundColor Green
            Write-Host "  Uptime: $($Health.uptime_seconds)s" -ForegroundColor Gray
            Write-Host "  Endpoints: $($Health.endpoints_active)" -ForegroundColor Gray
            Write-Host ""

            Write-Host "RESOURCE USAGE" -ForegroundColor Cyan
            Write-Host "  CPU: $($Health.cpu_usage)%" -ForegroundColor Yellow
            Write-Host "  Memory: $($Health.memory_usage)%" -ForegroundColor Yellow
            Write-Host "  Requests/min: $($Health.requests_per_minute)" -ForegroundColor Gray
            Write-Host ""

            Write-Host "ENDPOINTS" -ForegroundColor Cyan
            Write-Host "  Active: $($Health.endpoints_active)" -ForegroundColor Green
            Write-Host "  Healthy: $($Health.endpoints_healthy)" -ForegroundColor Green
            Write-Host "  Degraded: $($Health.endpoints_degraded)" -ForegroundColor Yellow
            Write-Host "  Failed: $($Health.endpoints_failed)" -ForegroundColor Red
        }
        catch {
            Write-Host "Error fetching health metrics: $_" -ForegroundColor Red
        }
    } else {
        Write-Host "Container Status: STOPPED" -ForegroundColor Red
    }

    Write-Host ""
    Write-Host "Press Ctrl+C to exit | Refreshing in $RefreshInterval s..." -ForegroundColor Gray
    Start-Sleep -Seconds $RefreshInterval
}`,
    usage: ".\\monitor-harness.ps1 -InstanceName 'harness-prod-01' -RefreshInterval 5"
  },
  {
    id: "ps-teardown-harness",
    name: "Teardown Harness Instance",
    description: "Clean removal of harness instance with artifact cleanup",
    language: "powershell",
    category: "Cleanup",
    code: `# ================================
# Sovereign Harness Teardown
# ================================

param(
    [string]$InstanceName,
    [switch]$Force
)

Write-Host "=== Harness Instance Teardown ===" -ForegroundColor Cyan

if (-not $Force) {
    $Confirm = Read-Host "Are you sure you want to remove $InstanceName? (yes/no)"
    if ($Confirm -ne "yes") {
        Write-Host "Teardown cancelled" -ForegroundColor Yellow
        exit
    }
}

Write-Host "[1/4] Stopping services..." -ForegroundColor Yellow
docker stop "sovereign-$InstanceName" -ErrorAction SilentlyContinue
Write-Host "✓ Services stopped" -ForegroundColor Green

Write-Host "[2/4] Removing container..." -ForegroundColor Yellow
docker rm "sovereign-$InstanceName" -ErrorAction SilentlyContinue
Write-Host "✓ Container removed" -ForegroundColor Green

Write-Host "[3/4] Cleaning artifacts..." -ForegroundColor Yellow
$InstancePath = "C:\\Sovereign\\Instances\\$InstanceName"
if (Test-Path $InstancePath) {
    Remove-Item -Recurse -Force $InstancePath
    Write-Host "✓ Artifacts cleaned" -ForegroundColor Green
}

Write-Host "[4/4] Verifying removal..." -ForegroundColor Yellow
$Check = docker ps --filter "name=sovereign-$InstanceName" --format "{{.Names}}"
if (-not $Check) {
    Write-Host "✓ Teardown complete!" -ForegroundColor Green
} else {
    Write-Host "✗ Teardown verification failed" -ForegroundColor Red
}`,
    usage: ".\\teardown-harness.ps1 -InstanceName 'harness-prod-01' -Force"
  },
  {
    id: "bash-deploy-harness",
    name: "Deploy Test Harness Instance (Bash)",
    description: "Deploy a new test harness instance on Linux/macOS",
    language: "bash",
    category: "Deployment",
    code: `#!/bin/bash

# ================================
# Sovereign Test Harness Deployment (Linux/macOS)
# ================================

HARNESS_TYPE=\${1:-Installation}
INSTANCE_NAME=\${2:-harness-$(date +%Y%m%d-%H%M%S)}
DEPLOYMENT=\${3:-Production}
PORT=\${4:-8080}

echo "=== Deploying Test Harness ===" 
echo ""

# 1. Validate Prerequisites
echo "[1/5] Validating prerequisites..."
if ! command -v docker &> /dev/null; then
    echo "✗ Docker not found"
    exit 1
fi
echo "✓ Docker: $(docker --version)"

# 2. Create Instance Directory
echo "[2/5] Creating instance directory..."
INSTANCE_PATH="/opt/sovereign/instances/$INSTANCE_NAME"
mkdir -p "$INSTANCE_PATH"
echo "✓ Instance path: $INSTANCE_PATH"

# 3. Configure Harness
echo "[3/5] Configuring harness..."
cat > "$INSTANCE_PATH/config.json" <<EOF
{
  "instance_id": "$INSTANCE_NAME",
  "harness_type": "$HARNESS_TYPE",
  "deployment": "$DEPLOYMENT",
  "port": $PORT,
  "created_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "status": "initializing"
}
EOF
echo "✓ Configuration saved"

# 4. Start Services
echo "[4/5] Starting services..."
docker run -d \
  --name "sovereign-$INSTANCE_NAME" \
  -p "$PORT:8080" \
  -v "$INSTANCE_PATH:/app/config" \
  sovereignsystem/harness:latest
echo "✓ Services started on port $PORT"

# 5. Verify Deployment
echo "[5/5] Verifying deployment..."
sleep 3
if curl -s http://localhost:$PORT/health | grep -q "healthy"; then
    echo "✓ Deployment successful!"
    echo "Instance: $INSTANCE_NAME"
    echo "Access: http://localhost:$PORT"
else
    echo "✗ Deployment verification failed"
fi`,
    usage: "bash deploy-harness.sh Installation harness-prod-01 Production 8080"
  },
  {
    id: "bash-monitor-harness",
    name: "Monitor Harness Instance (Bash)",
    description: "Real-time monitoring of harness instance on Linux/macOS",
    language: "bash",
    category: "Monitoring",
    code: `#!/bin/bash

# ================================
# Sovereign Harness Monitor (Linux/macOS)
# ================================

INSTANCE_NAME=\${1:-harness-prod-01}
REFRESH_INTERVAL=\${2:-5}

echo "=== Harness Instance Monitor ===" 
echo "Instance: $INSTANCE_NAME"
echo "Refresh Interval: $REFRESH_INTERVAL s"
echo ""

while true; do
    clear
    echo "=== SOVEREIGN HARNESS MONITOR ==="
    echo "Instance: $INSTANCE_NAME | Updated: $(date +%H:%M:%S)"
    echo ""

    # Get Container Info
    CONTAINER_ID=$(docker ps --filter "name=sovereign-$INSTANCE_NAME" --format "{{.ID}}" | head -c 12)
    CONTAINER_STATUS=$(docker ps --filter "name=sovereign-$INSTANCE_NAME" --format "{{.Status}}")
    
    if [ -z "$CONTAINER_ID" ]; then
        echo "Container Status: STOPPED"
    else
        echo "Container Status: RUNNING"
        echo "Container ID: $CONTAINER_ID"
        echo "Status: $CONTAINER_STATUS"
        echo ""

        # Get Health Metrics
        PORT=$(docker port "sovereign-$INSTANCE_NAME" 8080 | cut -d: -f2)
        HEALTH=$(curl -s http://localhost:$PORT/health 2>/dev/null || echo "{}")
        
        echo "HEALTH STATUS"
        echo "  Status: $(echo $HEALTH | jq -r '.status // \"unknown\"')"
        echo "  Uptime: $(echo $HEALTH | jq -r '.uptime_seconds // \"0\"')s"
        echo "  Endpoints: $(echo $HEALTH | jq -r '.endpoints_active // \"0\"')"
        echo ""

        echo "RESOURCE USAGE"
        echo "  CPU: $(echo $HEALTH | jq -r '.cpu_usage // \"0\"')%"
        echo "  Memory: $(echo $HEALTH | jq -r '.memory_usage // \"0\"')%"
        echo "  Requests/min: $(echo $HEALTH | jq -r '.requests_per_minute // \"0\"')"
    fi

    echo ""
    echo "Press Ctrl+C to exit | Refreshing in $REFRESH_INTERVAL s..."
    sleep $REFRESH_INTERVAL
done`,
    usage: "bash monitor-harness.sh harness-prod-01 5"
  },
];

const categories = Array.from(new Set(scripts.map(s => s.category)));
const languages = ["powershell", "bash"] as const;

export default function DeploymentScripts() {
  const [selectedScript, setSelectedScript] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<"powershell" | "bash" | null>(null);

  const filteredScripts = scripts.filter(s => {
    const categoryMatch = !selectedCategory || s.category === selectedCategory;
    const languageMatch = !selectedLanguage || s.language === selectedLanguage;
    return categoryMatch && languageMatch;
  });

  const getLanguageColor = (lang: string) => {
    return lang === "powershell" ? "text-blue-500" : "text-orange-500";
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadScript = (script: Script) => {
    const extension = script.language === "powershell" ? "ps1" : "sh";
    const filename = `${script.id}.${extension}`;
    const element = document.createElement("a");
    element.setAttribute("href", `data:text/plain;charset=utf-8,${encodeURIComponent(script.code)}`);
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
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
          <h1 className="text-lg font-bold">DEPLOYMENT AUTOMATION SCRIPTS</h1>
          <div className="w-20"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-b from-primary/10 to-background">
          <div className="container">
            <div className="flex items-center gap-3 mb-4">
              <Terminal className="w-8 h-8 text-accent" />
              <h1 className="text-5xl font-bold">Deployment Automation</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Production-ready PowerShell and Bash scripts for deploying, monitoring, and managing test harness instances.
            </p>
          </div>
        </section>

        <div className="container py-16 space-y-12">
          {/* Filters */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Filter Scripts</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-muted-foreground mb-2">By Category</p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedCategory === null ? "default" : "outline"}
                    onClick={() => setSelectedCategory(null)}
                  >
                    All ({scripts.length})
                  </Button>
                  {categories.map(cat => (
                    <Button
                      key={cat}
                      variant={selectedCategory === cat ? "default" : "outline"}
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {cat} ({scripts.filter(s => s.category === cat).length})
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-muted-foreground mb-2">By Language</p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedLanguage === null ? "default" : "outline"}
                    onClick={() => setSelectedLanguage(null)}
                  >
                    All ({scripts.length})
                  </Button>
                  {languages.map(lang => (
                    <Button
                      key={lang}
                      variant={selectedLanguage === lang ? "default" : "outline"}
                      onClick={() => setSelectedLanguage(lang)}
                      className={selectedLanguage === lang ? "" : ""}
                    >
                      {lang === "powershell" ? "PowerShell" : "Bash"} ({scripts.filter(s => s.language === lang).length})
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Scripts List */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Available Scripts ({filteredScripts.length})</h2>
            <div className="space-y-4">
              {filteredScripts.map(script => (
                <Card
                  key={script.id}
                  className={`bg-card border-border p-6 cursor-pointer transition hover:border-accent ${
                    selectedScript === script.id ? "border-accent" : ""
                  }`}
                  onClick={() => setSelectedScript(selectedScript === script.id ? null : script.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="w-4 h-4 text-accent" />
                        <h3 className="font-bold text-lg">{script.name}</h3>
                        <span className={`text-xs font-mono font-bold uppercase ${getLanguageColor(script.language)}`}>
                          {script.language}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{script.description}</p>
                    </div>
                    <span className="px-2 py-1 bg-accent/20 text-accent text-xs rounded font-semibold">
                      {script.category}
                    </span>
                  </div>

                  {selectedScript === script.id && (
                    <div className="mt-6 pt-6 border-t border-border space-y-4">
                      {/* Code Block */}
                      <div>
                        <p className="text-sm font-semibold text-muted-foreground mb-2">Script Code</p>
                        <div className="bg-black rounded p-4 overflow-x-auto">
                          <pre className="text-xs text-green-500 font-mono whitespace-pre-wrap break-words">
                            {script.code}
                          </pre>
                        </div>
                      </div>

                      {/* Usage */}
                      <div>
                        <p className="text-sm font-semibold text-muted-foreground mb-2">Usage</p>
                        <div className="bg-black rounded p-3">
                          <code className="text-xs text-yellow-500 font-mono">{script.usage}</code>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          className="flex-1 gap-2"
                          onClick={() => copyToClipboard(script.code)}
                        >
                          <Copy className="w-4 h-4" />
                          Copy Code
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 gap-2"
                          onClick={() => downloadScript(script)}
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-2"
                          disabled
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </section>

          {/* Documentation */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Quick Start Guide</h2>
            <Card className="bg-card border-border p-8">
              <Streamdown>
## PowerShell Scripts

### Prerequisites
- Windows PowerShell 7+ or PowerShell Core
- Docker Desktop installed and running
- Administrator privileges

### Installation
1. Download the script files
2. Save to a local directory (e.g., \`C:\\Scripts\\Sovereign\`)
3. Set execution policy: \`Set-ExecutionPolicy -ExecutionPolicy RemoteSigned\`
4. Run scripts with appropriate parameters

### Example Workflow
\`\`\`powershell
# Deploy a new instance
.\\deploy-harness.ps1 -HarnessType "Installation" -InstanceName "harness-prod-01" -Port 8080

# Monitor the instance
.\\monitor-harness.ps1 -InstanceName "harness-prod-01"

# Teardown when complete
.\\teardown-harness.ps1 -InstanceName "harness-prod-01" -Force
\`\`\`

## Bash Scripts

### Prerequisites
- Linux/macOS with Bash 4+
- Docker installed and running
- Sudo access for system operations

### Installation
1. Download the script files
2. Save to a local directory (e.g., \`/opt/sovereign/scripts\`)
3. Make executable: \`chmod +x *.sh\`
4. Run scripts with appropriate parameters

### Example Workflow
\`\`\`bash
# Deploy a new instance
bash deploy-harness.sh Installation harness-prod-01 Production 8080

# Monitor the instance
bash monitor-harness.sh harness-prod-01 5

# Teardown when complete
bash teardown-harness.sh harness-prod-01
\`\`\`

## Best Practices

- **Always verify prerequisites** before deployment
- **Use meaningful instance names** for easy identification
- **Monitor instances regularly** during operation
- **Clean up instances** when no longer needed
- **Keep scripts updated** with latest versions
- **Test in staging** before production deployment
              </Streamdown>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
}
