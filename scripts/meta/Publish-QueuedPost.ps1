param(
  [switch]$DryRun,
  [string]$Slot = "",
  [string]$QueuePath = "content/yc-systems-facebook-30-day-3x-queue.tsv",
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

function Invoke-GraphGet($Path, $Query) {
  $pairs = @()
  foreach ($key in $Query.Keys) {
    $pairs += "$key=$([uri]::EscapeDataString([string]$Query[$key]))"
  }
  $uri = "https://graph.facebook.com/$GraphVersion/$Path`?$(($pairs -join '&'))"
  return Invoke-RestMethod -Method Get -Uri $uri
}

function Wait-InstagramContainer($ContainerId, $Token) {
  $lastStatus = "UNKNOWN"
  for ($attempt = 1; $attempt -le 12; $attempt++) {
    Start-Sleep -Seconds 5
    $status = Invoke-GraphGet $ContainerId @{
      fields       = "status_code,status"
      access_token = $Token
    }
    $lastStatus = $status.status_code
    Write-Host "Instagram container status attempt ${attempt}: $lastStatus"

    if ($status.status_code -eq "FINISHED") { return }
    if ($status.status_code -eq "ERROR" -or $status.status_code -eq "EXPIRED") {
      throw "Instagram container failed with status $($status.status_code): $($status.status)"
    }
  }

  throw "Instagram container was not ready after waiting. Last status: $lastStatus"
}

if (-not (Test-Path $QueuePath)) {
  throw "Queue not found: $QueuePath"
}

$rows = Import-Csv $QueuePath -Delimiter "`t" -Encoding UTF8
$readyRows = @($rows | Where-Object { $_.status -eq "Ready" })

if ([string]::IsNullOrWhiteSpace($Slot)) {
  $hour = (Get-Date).Hour
  if ($hour -ge 18) {
    $Slot = "NIGHT"
  } elseif ($hour -ge 12) {
    $Slot = "PM"
  } else {
    $Slot = "AM"
  }
}

$row = $readyRows | Where-Object { $_.slot -eq $Slot } | Select-Object -First 1
if (-not $row) {
  $row = $readyRows | Select-Object -First 1
}
if (-not $row) {
  throw "No Ready row found in queue."
}

$visuals = @(
  ([string]$row.visual -split ";") |
    ForEach-Object { $_.Trim() } |
    Where-Object { -not [string]::IsNullOrWhiteSpace($_) }
)
if ($visuals.Count -eq 0) {
  throw "Selected row does not include a visual asset."
}

$mediaUrls = @($visuals | ForEach-Object { "$BasePublicUrl/$($_ -replace '\\','/')" })
$mediaExtensions = @($visuals | ForEach-Object { [System.IO.Path]::GetExtension($_).ToLowerInvariant() })
$videoExtensions = @(".mp4", ".mov", ".m4v")
$isVideo = $visuals.Count -eq 1 -and ($videoExtensions -contains $mediaExtensions[0])
$isCarousel = $visuals.Count -gt 1

if ($isCarousel -and @($mediaExtensions | Where-Object { $videoExtensions -contains $_ }).Count -gt 0) {
  throw "Carousel rows currently support image assets only."
}

$mediaUrl = $mediaUrls[0]
$caption = Convert-ToSpanishCaption $row

Write-Host "Selected post:" -ForegroundColor Cyan
Write-Host "Topic: $($row.topic)"
Write-Host "Slot: $($row.slot) $($row.time)"
Write-Host "Media: $($mediaUrls -join ', ')"
Write-Host "Type: $(if ($isCarousel) { 'Carousel' } elseif ($isVideo) { 'Video/Reel' } else { 'Image' })"
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
if ($isCarousel) {
  $igChildren = @()
  foreach ($url in $mediaUrls) {
    $child = Invoke-GraphPost "$igUserId/media" @{
      image_url        = $url
      is_carousel_item = "true"
      access_token     = $token
    }
    if (-not $child.id) {
      throw "Instagram carousel child container was not created for $url."
    }
    $igChildren += $child.id
  }

  $igContainer = Invoke-GraphPost "$igUserId/media" @{
    media_type   = "CAROUSEL"
    children     = ($igChildren -join ",")
    caption      = $caption
    access_token = $token
  }
} elseif ($isVideo) {
  $igContainer = Invoke-GraphPost "$igUserId/media" @{
    media_type    = "REELS"
    video_url     = $mediaUrl
    caption       = $caption
    share_to_feed = "true"
    access_token  = $token
  }
} else {
  $igContainer = Invoke-GraphPost "$igUserId/media" @{
    image_url    = $mediaUrl
    caption      = $caption
    access_token = $token
  }
}

if (-not $igContainer.id) {
  throw "Instagram container was not created."
}

Wait-InstagramContainer $igContainer.id $token

Write-Host "Publishing Instagram container $($igContainer.id)..." -ForegroundColor Cyan
$igPublish = Invoke-GraphPost "$igUserId/media_publish" @{
  creation_id  = $igContainer.id
  access_token = $token
}

if (-not $igPublish.id) {
  throw "Instagram publish did not return a media id."
}

if ($isCarousel) {
  Write-Host "Publishing Facebook Page carousel-style feed post..." -ForegroundColor Cyan
  $attachedMedia = @()
  foreach ($url in $mediaUrls) {
    $fbPhoto = Invoke-GraphPost "$pageId/photos" @{
      url          = $url
      published    = "false"
      access_token = $token
    }

    if (-not $fbPhoto.id) {
      throw "Facebook unpublished photo was not created for $url."
    }

    $attachedMedia += @{ media_fbid = $fbPhoto.id }
  }

  $fbPublish = Invoke-GraphPost "$pageId/feed" @{
    message        = $caption
    attached_media = ($attachedMedia | ConvertTo-Json -Compress)
    published      = "true"
    access_token   = $token
  }

  if (-not $fbPublish.id) {
    throw "Facebook carousel feed publish did not return a post id."
  }
} elseif ($isVideo) {
  Write-Host "Publishing Facebook Page video..." -ForegroundColor Cyan
  $fbPublish = Invoke-GraphPost "$pageId/videos" @{
    file_url     = $mediaUrl
    description  = $caption
    published    = "true"
    access_token = $token
  }

  if (-not $fbPublish.id) {
    throw "Facebook video publish did not return a video id."
  }
} else {
  Write-Host "Publishing Facebook Page photo..." -ForegroundColor Cyan
  $fbPublish = Invoke-GraphPost "$pageId/photos" @{
    url          = $mediaUrl
    caption      = $caption
    published    = "true"
    access_token = $token
  }

  if (-not $fbPublish.post_id -and -not $fbPublish.id) {
    throw "Facebook photo publish did not return a post id."
  }
}

$row.status = "Posted"
$rows | Export-Csv $QueuePath -Delimiter "`t" -NoTypeInformation -Encoding UTF8

Write-Host "Published successfully." -ForegroundColor Green
Write-Host "Instagram media id: $($igPublish.id)"
Write-Host "Facebook id: $(if ($fbPublish.post_id) { $fbPublish.post_id } else { $fbPublish.id })"

