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

$appId = Require-Env "META_APP_ID"
$appSecret = Require-Env "META_APP_SECRET"
$pageToken = Require-Env "META_PAGE_ACCESS_TOKEN"
$appToken = "$appId|$appSecret"

$uri = "https://graph.facebook.com/$GraphVersion/debug_token?input_token=$([uri]::EscapeDataString($pageToken))&access_token=$([uri]::EscapeDataString($appToken))"
$debug = Invoke-RestMethod -Method Get -Uri $uri

$scopes = @()
if ($debug.data.scopes) {
  $scopes = @($debug.data.scopes)
}

$needed = @(
  "instagram_content_publish",
  "instagram_basic",
  "instagram_manage_comments",
  "instagram_business_manage_comments",
  "instagram_manage_messages",
  "pages_messaging",
  "pages_manage_metadata",
  "pages_read_engagement"
)

Write-Host "Meta permission check for current token" -ForegroundColor Cyan
Write-Host "Token valid: $($debug.data.is_valid)"
Write-Host "Expires at: $($debug.data.expires_at)"
Write-Host ""

foreach ($permission in $needed) {
  $status = if ($scopes -contains $permission) { "OK" } else { "MISSING" }
  Write-Host "$status`t$permission"
}
