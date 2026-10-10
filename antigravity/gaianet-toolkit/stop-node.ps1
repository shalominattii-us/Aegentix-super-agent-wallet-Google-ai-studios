# PowerShell Script to Stop GaiaNet Node
Write-Host "=========================================" -ForegroundColor Yellow
Write-Host "       Stopping GaiaNet Node...          " -ForegroundColor Yellow
Write-Host "=========================================" -ForegroundColor Yellow

wsl -d Ubuntu -e bash -i -c "gaianet stop"
Write-Host "✅ GaiaNet Node stopped successfully." -ForegroundColor Green
