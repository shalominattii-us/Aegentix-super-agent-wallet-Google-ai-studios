# PowerShell Script to Remove Auto-Start Service
$startupFolder = [System.Environment]::GetFolderPath([System.Environment+SpecialFolder]::Startup)
$startupTarget = Join-Path $startupFolder "AEGENTIX_GaiaNet_Autostart.vbs"

if (Test-Path $startupTarget) {
    Remove-Item $startupTarget -Force
    Write-Host "✅ Removed Startup hook." -ForegroundColor Green
}

Unregister-ScheduledTask -TaskName "AEGENTIX_GaiaNet_Autostart" -Confirm:$false -ErrorAction SilentlyContinue
Write-Host "✅ Unregistered Scheduled Task." -ForegroundColor Green
Write-Host "Auto-start persistence has been disabled." -ForegroundColor Yellow
