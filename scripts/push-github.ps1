# Push SigmaGPT to GitHub using a Personal Access Token (no device code)
# Run in PowerShell:
#   cd d:\SigmaGPT
#   powershell -ExecutionPolicy Bypass -File scripts\push-github.ps1

$ErrorActionPreference = "Stop"
Set-Location (Split-Path $PSScriptRoot -Parent)

Write-Host ""
Write-Host "=== Push SigmaGPT to GitHub (Token method) ===" -ForegroundColor Cyan
Write-Host ""

# --- Step 1: Create repo on GitHub (browser) ---
Write-Host "STEP 1: Create an empty repo on GitHub" -ForegroundColor Yellow
Write-Host "  1. Open: https://github.com/new"
Write-Host "  2. Repository name: SigmaGPT (or your choice)"
Write-Host "  3. Do NOT add README, .gitignore, or license"
Write-Host "  4. Click Create repository"
Write-Host ""

$githubUser = Read-Host "Your GitHub username"
$repoName = Read-Host "Repository name (default: SigmaGPT)"
if ([string]::IsNullOrWhiteSpace($repoName)) { $repoName = "SigmaGPT" }

Write-Host ""
Write-Host "STEP 2: Create a Personal Access Token" -ForegroundColor Yellow
Write-Host "  1. Open: https://github.com/settings/tokens/new"
Write-Host "  2. Note: SigmaGPT deploy"
Write-Host "  3. Expiration: 90 days (or your choice)"
Write-Host "  4. Scopes: check 'repo' (full control of private repositories)"
Write-Host "  5. Generate token and COPY it (shown only once)"
Write-Host ""

$token = Read-Host "Paste your token here" -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($token)
$plainToken = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
[System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($BSTR)

if ([string]::IsNullOrWhiteSpace($plainToken)) {
    Write-Host "No token entered. Exiting." -ForegroundColor Red
    exit 1
}

$remoteUrl = "https://${githubUser}:${plainToken}@github.com/${githubUser}/${repoName}.git"

git branch -M main 2>$null

$existing = git remote get-url origin 2>$null
if ($existing) {
    git remote remove origin
}
git remote add origin $remoteUrl

Write-Host ""
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push -u origin main

# Remove token from remote URL (keep origin without password in config)
git remote set-url origin "https://github.com/${githubUser}/${repoName}.git"

Write-Host ""
Write-Host "Success! Repository:" -ForegroundColor Green
Write-Host "  https://github.com/${githubUser}/${repoName}"
Write-Host ""
Write-Host "Next: Deploy with Render + Vercel (see README.md section 4)" -ForegroundColor Cyan
