# YC Systems LLC Corporate Website

Public corporate website for YC Systems LLC.

YC Systems builds operating software, SaaS products, internal systems, CRM, dashboards, automation and digital infrastructure for real businesses.

## Public URL

```text
https://ycsystems.io/
```

## Repository Purpose

This repository is public brand infrastructure. It should contain only customer-safe website code, public copy, approved assets and quality scripts.

It must not contain private credentials, legal ownership records, EIN documents, operating agreements, personal addresses, private customer data or source-control details exposed in customer-facing pages.

## Local Preview

```powershell
node scripts/build-site.mjs
node scripts/local-preview-server.js --port 3001
```

Open:

```text
http://127.0.0.1:3001/
```

## Production Structure

The repository root is reserved for company-grade project structure: documentation, quality scripts, workflow configuration and security policy.

The public website lives in `site/`. GitHub Pages publishes a static artifact generated from that folder.

Important files:

- `site/index.html`: home page.
- `site/data/site-content.json`: shared brand, navigation, product and case-study content.
- `site/styles.css`: stylesheet manifest only.
- `site/styles/`: active modular CSS system.
- `site/script.js`: public website behavior.
- `site/nexus-controller.js`: state, interaction and accessibility behavior for Nexus.
- `site/styles.bundle.css`: generated public CSS bundle; edit the modules under `site/styles/` instead.
- `site/assets/`: public brand, product and approved marketing assets.
- `site/.well-known/security.txt`: public security and privacy reporting contact.
- `config/routes-map.json`: source of truth for routes, sitemap and noindex behavior.
- `config/nexus-system.json`: source of truth for Nexus modes, expressions, poses and asset status.
- `scripts/build-site.mjs`: static page generator for the shared header, footer and page system.
- `scripts/quality/`: automated checks.
- `docs/`: repository architecture, CSS rules and public/private policy.

More detail:

- [Repository structure](docs/REPOSITORY_STRUCTURE.md)
- [CSS architecture](docs/CSS_ARCHITECTURE.md)
- [Nexus visual system](docs/NEXUS_SYSTEM.md)
- [Public repository policy](docs/PUBLIC_REPOSITORY_POLICY.md)
- [Security policy](SECURITY.md)

## CSS Rule

Do not add new CSS to `site/styles/legacy-quarantine.css`.

New visual work belongs in:

```text
site/styles/tokens.css
site/styles/reset.css
site/styles/base.css
site/styles/layout.css
site/styles/components.css
site/styles/nexus.css
site/styles/pages.css
site/styles/utilities.css
site/styles/responsive.css
```

If old CSS conflicts with new CSS, remove or migrate the old rule. Do not keep stacking stronger selectors.

## Repository Hygiene

Generated content, social publishing assets, local screenshots, temporary files and backups do not belong in this public repository.

Keep these outside Git:

```text
content/
output/
tmp/
*.zip
*.bak
```

Use a local backup outside the project when old material must be preserved.

## Approved Public Routes

```text
/
/products/
/operating-systems/
/solutions/
/industries/
/case-studies/
/process/
/company/
/contact/
/trust-center/
/documentation/
/developers/
/documents/
/privacy/
/terms/
```

Client proof routes can remain excluded from the public sitemap when they are approved for limited sharing:

```text
/brands/ghostwear/
```

`/nexus-lab/` is a noindex visual QA surface. It is excluded from the sitemap and crawler rules, but it is not an authentication or privacy boundary.

Unreleased product names, screenshots, routes, launch plans and roadmaps must stay outside the public repository until they are approved for release.

Compatibility routes such as `/projects/`, `/about/`, `/brands/`, `/services/` and `/ghostwear/` are kept only as legacy redirects.

With the current GitHub Pages deployment, these compatibility files are client-side fallbacks built with `meta refresh` and JavaScript. They are served as HTML responses rather than edge-level HTTP redirects. A real `301` or `308` requires an explicit rule at the CDN, proxy or hosting edge; the route map intentionally records only the destination while that layer is unavailable.

## Quality Gates

Run before commit:

```powershell
node scripts/build-site.mjs
node scripts/quality/check-repo-structure.mjs
node scripts/quality/check-site.mjs
```

## Corporate Contact

```text
contact@ycsystems.io
```
