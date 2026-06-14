param(
  [Parameter(Mandatory = $true)]
  [string]$UserAccessToken,

  [string]$GraphVersion = "v25.0",
  [string]$EnvPath = ".env"
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

function Set-EnvFileValue([string]$Path, [string]$Name, [string]$Value) {
  $content = ""
  if (Test-Path $Path) {
    $content = Get-Content $Path -Raw
  }

  $line = "$Name=$Value"
  if ($content -match "(?m)^$Name=.*$") {
    $content = $content -replace "(?m)^$Name=.*$", $line
  } else {
    $content = $content.TrimEnd() + [Environment]::NewLine + $line + [Environment]::NewLine
  }

  Set-Content -Path $Path -Value $content -Encoding UTF8
}

Import-DotEnv $EnvPath

$appId = Require-Env "META_APP_ID"
$appSecret = Require-Env "META_APP_SECRET"
$pageId = Require-Env "META_PAGE_ID"

$baseUrl = "https://graph.facebook.com/$GraphVersion"

Write-Host "Exchanging user token for long-lived token..." -ForegroundColor Cyan
$exchangeUrl = "$baseUrl/oauth/access_token?grant_type=fb_exchange_token&client_id=$([uri]::EscapeDataString($appId))&client_secret=$([uri]::EscapeDataString($appSecret))&fb_exchange_token=$([uri]::EscapeDataString($UserAccessToken))"
$exchange = Invoke-RestMethod -Method Get -Uri $exchangeUrl

if (-not $exchange.access_token) {
  throw "Meta did not return a long-lived user token."
}

Write-Host "Fetching long-lived Page token..." -ForegroundColor Cyan
$accountsUrl = "$baseUrl/me/accounts?fields=id,name,access_token,instagram_business_account{id,username}&access_token=$([uri]::EscapeDataString($exchange.access_token))"
$accounts = Invoke-RestMethod -Method Get -Uri $accountsUrl
$page = $accounts.data | Where-Object { $_.id -eq $pageId } | Select-Object -First 1

if (-not $page -or -not $page.access_token) {
  throw "Could not find YC Systems Page token in /me/accounts."
}

$igId = $page.instagram_business_account.id
if (-not $igId) {
  throw "The YC Systems Page did not return a connected Instagram Business account."
}

Set-EnvFileValue $EnvPath "META_PAGE_ACCESS_TOKEN" $page.access_token
Set-EnvFileValue $EnvPath "META_IG_USER_ID" $igId

Write-Host "Renewed Meta Page token successfully." -ForegroundColor Green
Write-Host "Page: $($page.name) ($($page.id))"
Write-Host "Instagram: @$($page.instagram_business_account.username) ($igId)"
