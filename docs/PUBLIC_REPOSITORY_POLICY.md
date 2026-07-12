# Public Repository Policy

This repository is public-facing brand infrastructure for YC Systems LLC.

The public website should build trust without exposing internal operations, credentials or sensitive legal details.

## Allowed

- Public brand positioning.
- Public contact channels.
- Public service and product positioning.
- Public case studies and client proof already approved for publication.
- Public legal pages such as privacy, terms, company information and trust center content.
- Website preview assets used by public meta tags.

## Not Allowed

- API keys, access tokens, app secrets, passwords or private credentials.
- `.env` files with real values.
- EIN letters, operating agreements, ownership percentages or private legal documents.
- personal addresses, private phone numbers or private identity documents.
- source-control links, repository URLs, deployment internals or GitHub workflow details in customer-facing pages.
- product internals that should remain private before legal, trademark or launch readiness.
- unapproved screenshots, dashboards, customer data or private product modules.
- social publishing queues, reels, carousels, campaign working files, generated exports or local QA screenshots.
- ZIP backups, `.bak` files, temporary folders or generated output folders.

## Environment Variables

Use `.env.example` to document required variable names.

Real values stay local or in the secure provider where the automation runs. They must never be committed.

## Website Copy Standard

Customer-facing copy should talk about outcomes, trust, products, implementation and support.

It should not talk about repositories, commits, deployment tools, internal prompts, experiments or unfinished legal work.

## Before Publishing

Run:

```powershell
node scripts/quality/check-repo-structure.mjs
node scripts/quality/check-site.mjs
```
