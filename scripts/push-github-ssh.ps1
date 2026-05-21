# Push SigmaGPT using SSH (if you already have a GitHub SSH key)
# Run: powershell -ExecutionPolicy Bypass -File scripts\push-github-ssh.ps1

$ErrorActionPreference = "Stop"
Set-Location (Split-Path $PSScriptRoot -Parent)

$pubKey = "$env:USERPROFILE\.ssh\id_ed25519.pub"
if (-not (Test-Path $pubKey)) { $pubKey = "$env:USERPROFILE\.ssh\id_rsa.pub" }

if (-not (Test-Path $pubKey)) {
    Write-Host "No SSH key found. Create one:" -ForegroundColor Yellow
    Write-Host '  ssh-keygen -t ed25519 -C "your@email.com" -f "$env:USERPROFILE\.ssh\id_ed25519" -N ""'
    Write-Host "Then add the public key at: https://github.com/settings/keys"
    exit 1
}

Write-Host "Your public key (add at https://github.com/settings/keys if not already):" -ForegroundColor Cyan
Get-Content $pubKey
Write-Host ""

$githubUser = Read-Host "GitHub username"
$repoName = Read-Host "Repository name (default: SigmaGPT)"
if ([string]::IsNullOrWhiteSpace($repoName)) { $repoName = "SigmaGPT" }

Read-Host "Press Enter after you created empty repo at https://github.com/new"

git branch -M main 2>$null
$remote = "git@github.com:${githubUser}/${repoName}.git"

if (git remote get-url origin 2>$null) { git remote remove origin }
git remote add origin $remote

git push -u origin main

Write-Host "Done: https://github.com/${githubUser}/${repoName}" -ForegroundColor Green
