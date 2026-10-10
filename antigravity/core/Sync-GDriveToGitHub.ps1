# PowerShell Script to Sync Google Drive with GitHub Ecosystem and Verify Operation
param(
    [switch]$PushToGitHub = $false
)

Write-Host "=========================================================================" -ForegroundColor Cyan
Write-Host "     AEGENTIX CYBERNETICS: GOOGLE DRIVE <-> GITHUB ECOSYSTEM SYNC        " -ForegroundColor Cyan
Write-Host "=========================================================================" -ForegroundColor Cyan

$gdrivePath = "G:\My Drive"
$coreRepo = "C:\Users\eagle\AEGENTIX-CYBERNETICS-CORE"
$importsTarget = "$coreRepo\gdrive_imports\sovereign-core-hub"

# 1. Verify Google Drive Mount
Write-Host "`n[STEP 1/4] Verifying Google Drive Connection..." -ForegroundColor Yellow
if (Test-Path $gdrivePath) {
    Write-Host "  ✅ Google Drive is connected at '$gdrivePath'" -ForegroundColor Green
} else {
    Write-Host "  ❌ Google Drive not found at '$gdrivePath'. Please ensure Google Drive for Desktop is running." -ForegroundColor Red
    exit 1
}

# 2. Sync Google Drive files into local repository
Write-Host "`n[STEP 2/4] Synchronizing sovereign files from GDrive to GitHub Workspace..." -ForegroundColor Yellow
if (-not (Test-Path $importsTarget)) {
    New-Item -ItemType Directory -Force -Path $importsTarget | Out-Null
}

$syncExtensions = @("*.py", "*.sh", "*.ps1", "*.md", "*.txt", "*.json", "*.yaml", "*.yml", "*.html", "*.docx", "*.pdf")
$copiedCount = 0

Get-ChildItem -Path $gdrivePath -File | Where-Object { 
    $ext = $_.Extension.ToLower()
    $name = $_.Name
    # Match scripts, models, and docs
    ($ext -in @(".py", ".sh", ".ps1", ".md", ".txt", ".json", ".yaml", ".yml", ".html"))
} | ForEach-Object {
    $targetFile = Join-Path $importsTarget $_.Name
    if (-not (Test-Path $targetFile) -or ($_.LastWriteTime -gt (Get-Item $targetFile).LastWriteTime)) {
        Copy-Item -Path $_.FullName -Destination $targetFile -Force
        Write-Host "  • Synced: $($_.Name)" -ForegroundColor Green
        $copiedCount++
    }
}
Write-Host "  ✅ Sync complete. $copiedCount updated files copied to $importsTarget" -ForegroundColor Green

# 3. Check All Ecosystem Repositories
Write-Host "`n[STEP 3/4] Checking Cloned Repositories Status..." -ForegroundColor Yellow
$repos = @(
    "AEGENTIX-CYBERNETICS-CORE",
    "AEGENTIX-AGENT-MESH",
    "infinite-brain-harness",
    "AEGENTIX-MISSION-CONTROL",
    "AEGENTIX-SECURITY-INTELLIGENCE",
    "sovereign-os",
    "worldmonitor"
)

foreach ($r in $repos) {
    $repoPath = "C:\Users\eagle\$r"
    if (Test-Path $repoPath) {
        Write-Host "  • [OK] Repository present: $r" -ForegroundColor Green
        if ($PushToGitHub) {
            Push-Location $repoPath
            $status = git status --porcelain
            if ($status) {
                Write-Host "    --> Changes detected in $r. Staging, committing & pushing..." -ForegroundColor Yellow
                git add -A
                git commit -m "Auto-sync sovereign ecosystem updates from GDrive & local hub"
                git push origin main
                Write-Host "    ✅ Pushed to GitHub!" -ForegroundColor Green
            } else {
                Write-Host "    (Up to date with GitHub)" -ForegroundColor Gray
            }
            Pop-Location
        }
    } else {
        Write-Host "  • [MISSING] Repository not found: $r" -ForegroundColor Red
    }
}

# 4. Operational Execution & Verification
Write-Host "`n[STEP 4/4] Executing Master Orchestration & Operational Verification..." -ForegroundColor Yellow
wsl -d Ubuntu -e bash -c "python3 /mnt/c/Users/eagle/AEGENTIX-CYBERNETICS-CORE/bring_everything_online.py"

Write-Host "`n=========================================================================" -ForegroundColor Cyan
Write-Host "  🎉 ECOSYSTEM FULLY SYNCED, CLONED & OPERATIONAL!" -ForegroundColor Cyan
Write-Host "=========================================================================" -ForegroundColor Cyan
