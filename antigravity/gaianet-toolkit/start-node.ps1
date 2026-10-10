# PowerShell Script to Start GaiaNet Node
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "       Starting GaiaNet Node...          " -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# Start GaiaNet inside WSL Ubuntu
wsl -d Ubuntu -e bash -i -c "gaianet start"

# Verify health
Write-Host "`nVerifying node readiness on http://localhost:8080..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/v1/models" -TimeoutSec 5
    Write-Host "✅ GaiaNet Node is running and ready!" -ForegroundColor Green
    Write-Host "Chatbot UI: http://localhost:8080/chatbot-ui/index.html" -ForegroundColor Green
    Write-Host "Dashboard:  http://localhost:8080" -ForegroundColor Green
    
    # Open Dashboard in default browser
    Start-Process "http://localhost:8080/chatbot-ui/index.html"
} catch {
    Write-Host "⚠️ Node started but API is still initializing. Please wait a few seconds." -ForegroundColor Yellow
}
