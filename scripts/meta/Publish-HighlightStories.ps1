param(
  [string]$BasePublicUrl = "https://ycsystems.io",
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

function Invoke-GraphPost($Path, $Body) {
  $uri = "https://graph.facebook.com/$GraphVersion/$Path"
  return Invoke-RestMethod -Method Post -Uri $uri -Body $Body
}

function Invoke-GraphGet($Path, $Query) {
  $pairs = @()
  foreach ($key in $Query.Keys) {
    $pairs += "$key=$([uri]::EscapeDataString([string]$Query[$key]))"
  }
  $uri = "https://graph.facebook.com/$GraphVersion/$Path`?$(($pairs -join '&'))"
  return Invoke-RestMethod -Method Get -Uri $uri
}

function Wait-InstagramContainer($ContainerId, $Token) {
  for ($attempt = 1; $attempt -le 12; $attempt++) {
    Start-Sleep -Seconds 5
    $status = Invoke-GraphGet $ContainerId @{
      fields       = "status_code,status"
      access_token = $Token
    }

    Write-Host "Story container $ContainerId attempt ${attempt}: $($status.status_code)"
    if ($status.status_code -eq "FINISHED") { return }
    if ($status.status_code -eq "ERROR" -or $status.status_code -eq "EXPIRED") {
      throw "Instagram story container failed with status $($status.status_code): $($status.status)"
    }
  }

  throw "Instagram story container was not ready after waiting."
}

Import-DotEnv

$igUserId = Require-Env "META_IG_USER_ID"
$token = Require-Env "META_PAGE_ACCESS_TOKEN"

$stories = @(
  "01-start-here-story.jpg",
  "02-webs-story.jpg",
  "03-sistemas-story.jpg",
  "04-automatizar-story.jpg",
  "05-tiendas-story.jpg",
  "06-saas-story.jpg",
  "07-mantenimiento-story.jpg",
  "08-contacto-story.jpg"
)

$published = @()

foreach ($story in $stories) {
  $imageUrl = "$BasePublicUrl/assets/social/client-acquisition-highlights/$story"
  Write-Host "Creating story container for $story" -ForegroundColor Cyan

  $container = Invoke-GraphPost "$igUserId/media" @{
    image_url    = $imageUrl
    media_type   = "STORIES"
    access_token = $token
  }

  if (-not $container.id) {
    throw "Instagram story container was not created for $story."
  }

  Wait-InstagramContainer $container.id $token

  Write-Host "Publishing story $story" -ForegroundColor Cyan
  $publish = Invoke-GraphPost "$igUserId/media_publish" @{
    creation_id  = $container.id
    access_token = $token
  }

  if (-not $publish.id) {
    throw "Instagram story publish did not return a media id for $story."
  }

  $published += [pscustomobject]@{
    Story = $story
    MediaId = $publish.id
  }
}

Write-Host "Published highlight stories successfully." -ForegroundColor Green
$published | Format-Table -AutoSize
