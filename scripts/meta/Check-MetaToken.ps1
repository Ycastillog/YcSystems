param(
  [string]$GraphVersion = "v25.0",
  [string]$LogPath = "content/meta-token-checks.log"
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

function Write-CheckLog([string]$Message) {
  $stamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss zzz"
  $line = "[$stamp] $Message"
  Add-Content -Path $LogPath -Value $line -Encoding UTF8
  Write-Host $line
}

Import-DotEnv

$pageId = Require-Env "META_PAGE_ID"
$igUserId = Require-Env "META_IG_USER_ID"
$token = Require-Env "META_PAGE_ACCESS_TOKEN"
$baseUrl = "https://graph.facebook.com/$GraphVersion"

try {
  $pageUrl = "$baseUrl/${pageId}?fields=id,name,instagram_business_account&access_token=$([uri]::EscapeDataString($token))"
  $page = Invoke-RestMethod -Method Get -Uri $pageUrl

  $igUrl = "$baseUrl/${igUserId}?fields=id,username,name&access_token=$([uri]::EscapeDataString($token))"
  $ig = Invoke-RestMethod -Method Get -Uri $igUrl

  $connectedIg = $page.instagram_business_account.id
  if ($connectedIg -ne $igUserId) {
    throw "Instagram mismatch. Page returns $connectedIg but .env has $igUserId."
  }

  Write-CheckLog "OK - Facebook Page '$($page.name)' and Instagram '@$($ig.username)' are ready."
}
catch {
  Write-CheckLog "FAILED - $($_.Exception.Message)"
  throw
}
