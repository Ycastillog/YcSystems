# YC Systems Meta Publishing

This folder contains the official Meta API publishing flow for YC Systems.

It publishes one queued post to:

- Facebook Page: YC Systems
- Instagram Business account: @yc.systems

## Required Meta setup

Create or use a Meta developer app with permissions for publishing:

- `pages_manage_posts`
- `pages_read_engagement`
- `pages_show_list`
- `instagram_basic`
- `instagram_content_publish`

The Instagram account must be connected to the Facebook Page in Meta Business Suite.

## Required environment variables

Set these in PowerShell or in a local `.env` file before running:

```powershell
$env:META_PAGE_ID = "1078101082062602"
$env:META_IG_USER_ID = "YOUR_INSTAGRAM_BUSINESS_ACCOUNT_ID"
$env:META_PAGE_ACCESS_TOKEN = "YOUR_LONG_LIVED_PAGE_ACCESS_TOKEN"
```

Do not commit tokens.

## Verify configuration

```powershell
.\scripts\meta\Test-MetaConfig.ps1
```

## Publish the next queued post

Dry run first:

```powershell
.\scripts\meta\Publish-QueuedPost.ps1 -DryRun
```

Publish:

```powershell
.\scripts\meta\Publish-QueuedPost.ps1
```

## Important notes

Instagram publishing requires a public image URL. This repo uses GitHub Pages URLs such as:

```text
https://ycastillog.github.io/YcSystems/assets/social/commercial-kit/08-internal-systems-offer.jpg
```

The script does not publish Facebook-only. If Instagram fails, the queued row stays `Ready`.
