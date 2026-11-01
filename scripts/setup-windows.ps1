$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "AI Video Studio - Windows setup" -ForegroundColor Cyan
Write-Host "This script installs prerequisites using Windows Package Manager (winget)." -ForegroundColor Gray
Write-Host ""

if (-not (Get-Command winget -ErrorAction SilentlyContinue)) {
  throw "winget was not found. Install or update App Installer from Microsoft Store, then run this script again."
}

$packages = @(
  @{ Id = "OpenJS.NodeJS.LTS"; Name = "Node.js LTS" },
  @{ Id = "Python.Python.3.11"; Name = "Python 3.11" },
  @{ Id = "Gyan.FFmpeg"; Name = "FFmpeg" }
)

foreach ($package in $packages) {
  Write-Host "Installing/checking $($package.Name)..." -ForegroundColor Yellow
  winget install --id $package.Id --exact --accept-package-agreements --accept-source-agreements --silent
  if ($LASTEXITCODE -ne 0) {
    Write-Warning "winget returned exit code $LASTEXITCODE for $($package.Name). It may already be installed or may need manual installation."
  }
}

Write-Host ""
Write-Host "Setup command finished." -ForegroundColor Green
Write-Host "Close and reopen PowerShell, then verify: node --version; npm --version; py --version; ffmpeg -version" -ForegroundColor Cyan
