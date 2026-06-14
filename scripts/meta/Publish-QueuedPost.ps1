param(
  [switch]$DryRun,
  [string]$QueuePath = "content/yc-systems-facebook-30-day-3x-queue.tsv",
  [string]$BasePublicUrl = "https://ycastillog.github.io/YcSystems",
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

function Convert-ToSpanishCaption($row) {
  return @"
$($row.caption)

$($row.cta)

Smart Solutions. Real Results.

#YCSystems #SoftwareParaNegocios #SaaS #Automatizacion #BusinessSystems #RepublicaDominicana
"@
}

function Invoke-GraphPost($Path, $Body) {
  $uri = "https://graph.facebook.com/$GraphVersion/$Path"
  return Invoke-RestMethod -Method Post -Uri $uri -Body $Body
}

if (-not (Test-Path $QueuePath)) {
  throw "Queue not found: $QueuePath"
}

$rows = Import-Csv $QueuePath -Delimiter "`t" -Encoding UTF8
$row = $rows | Where-Object { $_.status -eq "Ready" } | Select-Object -First 1
if (-not $row) {
  throw "No Ready row found in queue."
}

$imageUrl = "$BasePublicUrl/$($row.visual -replace '\\','/')"
$caption = Convert-ToSpanishCaption $row

Write-Host "Selected post:" -ForegroundColor Cyan
Write-Host "Topic: $($row.topic)"
Write-Host "Slot: $($row.slot) $($row.time)"
Write-Host "Image: $imageUrl"
Write-Host ""
Write-Host $caption
Write-Host ""

if ($DryRun) {
  Write-Host "Dry run only. Nothing published." -ForegroundColor Yellow
  exit 0
}

$pageId = Require-Env "META_PAGE_ID"
$igUserId = Require-Env "META_IG_USER_ID"
$token = Require-Env "META_PAGE_ACCESS_TOKEN"

Write-Host "Creating Instagram media container..." -ForegroundColor Cyan
$igContainer = Invoke-GraphPost "$igUserId/media" @{
  image_url    = $imageUrl
  caption      = $caption
  access_token = $token
}

if (-not $igContainer.id) {
  throw "Instagram container was not created."
}

Write-Host "Publishing Instagram container $($igContainer.id)..." -ForegroundColor Cyan
$igPublish = Invoke-GraphPost "$igUserId/media_publish" @{
  creation_id  = $igContainer.id
  access_token = $token
}

if (-not $igPublish.id) {
  throw "Instagram publish did not return a media id."
}

Write-Host "Publishing Facebook Page photo..." -ForegroundColor Cyan
$fbPublish = Invoke-GraphPost "$pageId/photos" @{
  url          = $imageUrl
  caption      = $caption
  published    = "true"
  access_token = $token
}

if (-not $fbPublish.post_id -and -not $fbPublish.id) {
  throw "Facebook publish did not return a post id."
}

$row.status = "Posted"
$rows | Export-Csv $QueuePath -Delimiter "`t" -NoTypeInformation -Encoding UTF8

Write-Host "Published successfully." -ForegroundColor Green
Write-Host "Instagram media id: $($igPublish.id)"
Write-Host "Facebook post id: $($fbPublish.post_id)"
