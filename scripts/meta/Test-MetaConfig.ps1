param(
  [string]$GraphVersion = "v25.0"
)

$ErrorActionPreference = "Stop"

function Import-DotEnv([string]$Path = ".env") {
  if (-not (Test-Path $Path)) { return }

  Get-Content $Path | ForEach-Object {
    $line = $_.Trim()
    if ([string]::IsNullOrWhiteSpace($line) -or $line.StartsWith("#")) { return }

    $parts = $line -split "=", 2
    if ($parts.Count -ne 2) { return }

    $name = $parts[0].Trim()
    $value = $parts[1].Trim().Trim('"').Trim("'")
    [Environment]::SetEnvironmentVariable($name, $value, "Process")
  }
}

function Require-Env([string]$Name) {
  $value = [Environment]::GetEnvironmentVariable($Name, "Process")
  if ([string]::IsNullOrWhiteSpace($value)) {
    throw "Missing required environment variable: $Name"
  }
  return $value
}

Import-DotEnv

$pageId = Require-Env "META_PAGE_ID"
$token = Require-Env "META_PAGE_ACCESS_TOKEN"
$igUserId = [Environment]::GetEnvironmentVariable("META_IG_USER_ID", "Process")

$baseUrl = "https://graph.facebook.com/$GraphVersion"

Write-Host "Checking Facebook Page..." -ForegroundColor Cyan
$pageUrl = "$baseUrl/${pageId}?fields=id,name,instagram_business_account&access_token=$([uri]::EscapeDataString($token))"
$page = Invoke-RestMethod -Method Get -Uri $pageUrl

Write-Host "Page: $($page.name) ($($page.id))" -ForegroundColor Green

if ($page.instagram_business_account -and $page.instagram_business_account.id) {
  Write-Host "Connected Instagram Business ID: $($page.instagram_business_account.id)" -ForegroundColor Green
  if ([string]::IsNullOrWhiteSpace($igUserId)) {
    Write-Host "Tip: set `$env:META_IG_USER_ID = `"$($page.instagram_business_account.id)`"" -ForegroundColor Yellow
  }
} else {
  Write-Host "No instagram_business_account returned for this Page." -ForegroundColor Yellow
}

if (-not [string]::IsNullOrWhiteSpace($igUserId)) {
  Write-Host "Checking Instagram account..." -ForegroundColor Cyan
  $igUrl = "$baseUrl/${igUserId}?fields=id,username,name&access_token=$([uri]::EscapeDataString($token))"
  $ig = Invoke-RestMethod -Method Get -Uri $igUrl
  Write-Host "Instagram: @$($ig.username) ($($ig.id))" -ForegroundColor Green
}

Write-Host "Meta API configuration check completed." -ForegroundColor Green
