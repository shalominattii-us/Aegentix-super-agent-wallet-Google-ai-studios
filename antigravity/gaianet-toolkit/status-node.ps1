# PowerShell Script to Check GaiaNet Node Status
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "       GaiaNet Node Status Check         " -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# Show node info
wsl -d Ubuntu -e bash -i -c "gaianet info"

# Check port 8080
Write-Host "`nTesting local API endpoint (http://localhost:8080)..." -ForegroundColor Yellow
try {
    $models = Invoke-RestMethod -Uri "http://localhost:8080/v1/models" -TimeoutSec 3
    Write-Host "✅ Status: ONLINE and accepting requests" -ForegroundColor Green
    Write-Host "Available Models: $(($models.data | ForEach-Object { $_.id }) -join ', ')" -ForegroundColor Green
} catch {
    Write-Host "❌ Status: OFFLINE or initializing" -ForegroundColor Red
}

Write-Host "`nRunning Services:" -ForegroundColor Yellow
wsl -d Ubuntu -e bash -c "ps aux | grep -E 'wasmedge|qdrant|gaia-nexus' | grep -v grep"
