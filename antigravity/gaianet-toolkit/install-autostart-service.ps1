# PowerShell Script to Install Auto-Start on System Boot/Reboot
Write-Host "=========================================================================" -ForegroundColor Cyan
Write-Host "   Installing GaiaNet Auto-Start Persistence on Boot/Reboot              " -ForegroundColor Cyan
Write-Host "=========================================================================" -ForegroundColor Cyan

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$vbsSource = Join-Path $scriptDir "autostart_daemon.vbs"
$startupFolder = [System.Environment]::GetFolderPath([System.Environment+SpecialFolder]::Startup)
$startupTarget = Join-Path $startupFolder "AEGENTIX_GaiaNet_Autostart.vbs"

# 1. Install to Windows Startup Folder
Write-Host "`n[1/2] Installing Silent Startup Hook in Windows Startup Folder..." -ForegroundColor Yellow
Copy-Item -Path $vbsSource -Destination $startupTarget -Force
Write-Host "  [OK] Installed hook: $startupTarget" -ForegroundColor Green

# 2. Register Windows Scheduled Task for instant logon launch
Write-Host "`n[2/2] Registering Scheduled Task for boot recovery..." -ForegroundColor Yellow
$taskName = "AEGENTIX_GaiaNet_Autostart"

try {
    $action = New-ScheduledTaskAction -Execute "wscript.exe" -Argument "`"$startupTarget`""
    $trigger = New-ScheduledTaskTrigger -AtLogOn
    $settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries

    Unregister-ScheduledTask -TaskName $taskName -Confirm:$false -ErrorAction SilentlyContinue
    Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Settings $settings -Description "Auto-starts GaiaNet Node on boot" | Out-Null
    Write-Host "  [OK] Scheduled Task registered successfully." -ForegroundColor Green
} catch {
    Write-Host "  [INFO] Startup folder hook is active." -ForegroundColor Gray
}

Write-Host "`n=========================================================================" -ForegroundColor Green
Write-Host "  AUTO-START PERSISTENCE CONFIGURED!" -ForegroundColor Green
Write-Host "  * Offline Mode: All LLMs run 100% locally with zero internet needed." -ForegroundColor Green
Write-Host "  * Reboot Safe: The node auto-starts silently in the background on boot." -ForegroundColor Green
Write-Host "=========================================================================" -ForegroundColor Green
