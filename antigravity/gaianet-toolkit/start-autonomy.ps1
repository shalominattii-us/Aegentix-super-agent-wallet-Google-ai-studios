# PowerShell Script to Launch Fully Autonomous GaiaNet Operation
Write-Host "=========================================================" -ForegroundColor Green
Write-Host "     Launching Fully Autonomous GaiaNet Operation        " -ForegroundColor Green
Write-Host "=========================================================" -ForegroundColor Green

# 1. Check if node is already online, otherwise cleanly start it
Write-Host "`n[1/3] Checking GaiaNet Node health..." -ForegroundColor Yellow
$isOnline = $false
try {
    $models = Invoke-RestMethod -Uri "http://localhost:8080/v1/models" -TimeoutSec 3 -ErrorAction SilentlyContinue
    if ($models.data) {
        $isOnline = $true
        Write-Host "  ✅ GaiaNet Node is already running and responsive!" -ForegroundColor Green
    }
} catch {
    $isOnline = $false
}

if (-not $isOnline) {
    Write-Host "  Node not running or needs clean start. Initializing..." -ForegroundColor Cyan
    wsl -d Ubuntu -e bash -i -c "gaianet stop"
    Start-Sleep -Seconds 2
    wsl -d Ubuntu -e bash -i -c "gaianet start --local-only"
    
    # Wait for ready
    Write-Host "  Waiting for node to become ready..." -ForegroundColor Yellow
    for ($i = 0; $i -lt 15; $i++) {
        Start-Sleep -Seconds 2
        try {
            $check = Invoke-RestMethod -Uri "http://localhost:8080/v1/models" -TimeoutSec 2 -ErrorAction SilentlyContinue
            if ($check.data) {
                Write-Host "  ✅ GaiaNet Node is ONLINE!" -ForegroundColor Green
                break
            }
        } catch {}
    }
}

# 2. Start Watchdog Supervisor in background inside WSL
Write-Host "`n[2/3] Starting Watchdog Supervisor..." -ForegroundColor Yellow
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$wslScriptDir = "/mnt/" + $scriptDir.Substring(0,1).ToLower() + "/" + $scriptDir.Substring(3).Replace('\', '/')

wsl -d Ubuntu -e bash -c "pkill -f watchdog.py; nohup python3 $wslScriptDir/scripts/watchdog.py > $wslScriptDir/scripts/watchdog.log 2>&1 &"
Write-Host "  ✅ Watchdog supervisor running in background." -ForegroundColor Green

# 3. Start Auto-Chatter in background inside WSL
Write-Host "`n[3/3] Starting Autonomous Auto-Chatter Bot..." -ForegroundColor Yellow
wsl -d Ubuntu -e bash -c "pkill -f auto_chatter.py; nohup python3 $wslScriptDir/scripts/auto_chatter.py > $wslScriptDir/scripts/auto_chatter.log 2>&1 &"
Write-Host "  ✅ Auto-Chatter bot running in background." -ForegroundColor Green

Write-Host "`n=========================================================" -ForegroundColor Cyan
Write-Host "  Autonomous Mode is ACTIVE!" -ForegroundColor Cyan
Write-Host "  * Continuous AI requests generated to simulate traffic" -ForegroundColor Cyan
Write-Host "  * Auto-healing watchdog monitoring node uptime" -ForegroundColor Cyan
Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host "`nTo view live auto-chatting activity:" -ForegroundColor Yellow
Write-Host "  Get-Content -Wait C:\Users\eagle\.gemini\antigravity\scratch\gaianet-toolkit\scripts\auto_chatter.log" -ForegroundColor White
Write-Host "`nTo stop all autonomous processes:" -ForegroundColor Yellow
Write-Host "  .\stop-autonomy.ps1" -ForegroundColor White
