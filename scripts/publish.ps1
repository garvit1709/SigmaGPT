# SigmaGPT — Push to GitHub and deploy
# Run: powershell -ExecutionPolicy Bypass -File scripts\publish.ps1

$ErrorActionPreference = "Stop"
$Root = Split-Path $PSScriptRoot -Parent
Set-Location $Root

Write-Host "`n=== SigmaGPT Publish ===`n" -ForegroundColor Cyan

# 1. GitHub login
$ghPath = Get-Command gh -ErrorAction SilentlyContinue
if (-not $ghPath) {
    Write-Host "Installing GitHub CLI..." -ForegroundColor Yellow
    winget install --id GitHub.cli -e --accept-source-agreements --accept-package-agreements
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
}

gh auth status 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Log in to GitHub (browser will open)..." -ForegroundColor Yellow
    gh auth login -p https -w
}

# 2. Create repo and push
$repoName = Read-Host "GitHub repo name (default: SigmaGPT)"
if ([string]::IsNullOrWhiteSpace($repoName)) { $repoName = "SigmaGPT" }

$visibility = Read-Host "Public or private? (public/private, default: public)"
if ([string]::IsNullOrWhiteSpace($visibility)) { $visibility = "public" }

git branch -M main 2>$null
$remote = git remote get-url origin 2>$null
if (-not $remote) {
    gh repo create $repoName --$visibility --source=. --remote=origin --push
} else {
    git push -u origin main
}

Write-Host "`nGitHub push done! Repo:" -ForegroundColor Green
gh repo view --web 2>$null

Write-Host @"

=== Deploy (one-time setup) ===

BACKEND (Render):
  1. https://dashboard.render.com -> New Web Service -> Connect GitHub repo
  2. Root Directory: Backend | Start: node server.js
  3. Add env: OPENAI_API_KEY, MONGODB_URI, JWT_SECRET, FRONTEND_URL (after frontend deploy)

FRONTEND (Vercel):
  1. https://vercel.com/new -> Import GitHub repo
  2. Root Directory: Frontend
  3. Env: VITE_API_URL = https://YOUR-RENDER-URL.onrender.com/api
  4. Deploy, then set FRONTEND_URL on Render to your Vercel URL

Or use render.yaml in repo root for Blueprint deploy on Render.

"@ -ForegroundColor Cyan
