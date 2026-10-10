# PowerShell Script to Stop Autonomous GaiaNet Operations
Write-Host "=========================================================" -ForegroundColor Yellow
Write-Host "     Stopping Autonomous GaiaNet Operations...           " -ForegroundColor Yellow
Write-Host "=========================================================" -ForegroundColor Yellow

# Kill background python scripts
wsl -d Ubuntu -e bash -c "pkill -f auto_chatter.py; pkill -f watchdog.py"
Write-Host "✅ Autonomous bots (Auto-Chatter and Watchdog) stopped." -ForegroundColor Green

# Ask if node should also be stopped
$choice = Read-Host "Do you also want to stop the GaiaNet node itself? (y/N)"
if ($choice -eq 'y' -or $choice -eq 'Y') {
    wsl -d Ubuntu -e bash -i -c "gaianet stop"
    Write-Host "✅ GaiaNet Node stopped." -ForegroundColor Green
} else {
    Write-Host "ℹ️ GaiaNet Node is still running in the background." -ForegroundColor Cyan
}
