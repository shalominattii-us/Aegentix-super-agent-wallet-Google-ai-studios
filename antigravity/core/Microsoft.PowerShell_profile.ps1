# ============================================================
# AEGENTIX CYBERDECK - COMPLETE PROFILE
# ============================================================

# Workspace
if (Test-Path "C:\Aegentix") { Set-Location "C:\Aegentix" }
$env:LANG = "en_US.UTF-8"
$env:TZ = "America/Denver"

# Start daemon as background job (stays running)
Start-Job -Name "CyberdeckDaemon" -ScriptBlock { & "C:\Aegentix\jetpackbrains\jb-daemon.ps1" } 2>$null

# Load orchestrator & governance
. C:\Aegentix\orchestrator\workflow-engine.ps1 2>$null
. C:\Aegentix\orchestrator\task-scheduler.ps1 2>$null
. C:\Aegentix\orchestrator\event-broker.ps1 2>$null
. C:\Aegentix\governance\audit-logger.ps1 2>$null
. C:\Aegentix\governance\permission-manager.ps1 2>$null
. C:\Aegentix\governance\risk-assessor.ps1 2>$null
. C:\Aegentix\control\command-router.ps1 2>$null
. C:\Aegentix\management\system-configurator.ps1 2>$null

# AI command - checks daemon status
function ai {
    $job = Get-Job -Name "CyberdeckDaemon" -ErrorAction SilentlyContinue
    if ($job -and $job.State -eq "Running") {
        Write-Host "🦞 Cyberdeck: ✅ Running (Job $($job.Id))" -ForegroundColor Green
    } else {
        Write-Host "🦞 Cyberdeck: ❌ Not running - starting..." -ForegroundColor Yellow
        Start-Job -Name "CyberdeckDaemon" -ScriptBlock { & "C:\Aegentix\jetpackbrains\jb-daemon.ps1" } 2>$null
        Start-Sleep -Seconds 2
        $job = Get-Job -Name "CyberdeckDaemon"
        if ($job.State -eq "Running") { Write-Host "🦞 Cyberdeck: ✅ Started!" -ForegroundColor Green }
        else { Write-Host "🦞 Cyberdeck: ❌ Failed to start" -ForegroundColor Red }
    }
}

# Status command
function cyber-status {
    Write-Host "=== Cyberdeck Status ===" -ForegroundColor Cyan
    $job = Get-Job -Name "CyberdeckDaemon" -ErrorAction SilentlyContinue
    Write-Host "  Daemon: $(if ($job -and $job.State -eq 'Running') { '✅ Running' } else { '❌ Stopped' })" -ForegroundColor Yellow
    $node = Get-Process node -ErrorAction SilentlyContinue
    Write-Host "  Node: $(if ($node) { '✅ Running' } else { '❌ Not running' })" -ForegroundColor Yellow
    Write-Host "  Agents: $( (Get-ChildItem C:\Aegentix\agents\ -Directory -ErrorAction SilentlyContinue).Count )" -ForegroundColor Yellow
    Write-Host "  Location: $(Get-Location)" -ForegroundColor Yellow
    Write-Host "  Time: $(Get-Date)" -ForegroundColor Yellow
}

# Logs command
function cyber-logs {
    param([string]$Type = "daemon")
    $logFile = switch ($Type) {
        "daemon" { "C:\Aegentix\jetpackbrains\jb-daemon.log" }
        "agent" { "C:\Aegentix\logs\agent.log" }
        default { "C:\Aegentix\logs\$Type.log" }
    }
    if (Test-Path $logFile) { Get-Content $logFile -Tail 20 }
    else { Write-Host "Log not found: $logFile" -ForegroundColor Red }
}

# Agent shortcuts
function agent-coding { Write-Host "🔧 Coding agent" -ForegroundColor Cyan }
function agent-infra { Write-Host "🏗️ Infrastructure agent" -ForegroundColor Cyan }
function agent-research { Write-Host "🔬 Research agent" -ForegroundColor Cyan }
function agent-security { Write-Host "🛡️ Security agent" -ForegroundColor Cyan }
function agent-test { Write-Host "🧪 Testing agent" -ForegroundColor Cyan }

. C:\Aegentix\aegentix-liquid-mesh.ps1 2>$null

Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     🦞 AEGENTIX LIQUID CYBERDECK & SKYDIVE MESH - READY     ║" -ForegroundColor Cyan
Write-Host "║  Commands: mesh | ai | cyber-status | aegentix-sync | agent-*║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Set-Alias directive-send C:\Aegentix\cyberdeck\directive-send.ps1
Set-Alias directive-stream C:\Aegentix\cyberdeck\directive-stream.ps1
Set-Alias directive-ping C:\Aegentix\cyberdeck\directive-ping.ps1
Set-Alias directive-broadcast C:\Aegentix\cyberdeck\directive-broadcast.ps1
Set-Alias directive-invoke C:\Aegentix\cyberdeck\directive-invoke.ps1
Set-Alias directive-send C:\Aegentix\cyberdeck\directive-send.ps1
Set-Alias directive-stream C:\Aegentix\cyberdeck\directive-stream.ps1
Set-Alias directive-ping C:\Aegentix\cyberdeck\directive-ping.ps1
Set-Alias directive-broadcast C:\Aegentix\cyberdeck\directive-broadcast.ps1
Set-Alias directive-invoke C:\Aegentix\cyberdeck\directive-invoke.ps1

function claude-mem { & "bun" "C:\AEGENTIX-WORKSPACE\github-repos\AEGENTIX-DEVTOOLS\sources\claude-mem\plugin\scripts\worker-service.cjs" $args }
