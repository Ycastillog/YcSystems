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
python -m http.server 3001 --bind 127.0.0.1
```

Open:

```text
http://127.0.0.1:3001/
```

## Production Structure

The website is served from the repository root because GitHub Pages publishes a static artifact from these folders.

Important files:

- `index.html`: home page.
- `styles.css`: stylesheet manifest only.
- `styles/`: modular CSS system and quarantined legacy CSS.
- `script.js`: public website behavior.
- `assets/`: public brand, product and approved marketing assets.
- `routes-map.json`: source of truth for routes, sitemap and noindex behavior.
- `scripts/quality/`: automated checks.
- `docs/`: repository architecture, CSS rules and public/private policy.

More detail:

- [Repository structure](docs/REPOSITORY_STRUCTURE.md)
- [CSS architecture](docs/CSS_ARCHITECTURE.md)
- [Public repository policy](docs/PUBLIC_REPOSITORY_POLICY.md)
- [Security policy](SECURITY.md)

## CSS Rule

Do not add new CSS to `styles/legacy-quarantine.css`.

New visual work belongs in:

```text
styles/tokens.css
styles/reset.css
styles/base.css
styles/layout.css
styles/components.css
styles/pages.css
styles/utilities.css
styles/responsive.css
```

If old CSS conflicts with new CSS, remove or migrate the old rule. Do not keep stacking stronger selectors.

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

Controlled-access product and client proof routes are intentionally excluded from the public sitemap while product positioning is reviewed:

```text
/products/cleanloop/
/products/soc/
/products/brokercontrol/
/brands/ghostwear/
```

Compatibility routes such as `/projects/`, `/about/`, `/brands/`, `/services/`, `/cleanloop/`, `/soc/`, `/brokercontrol/` and `/ghostwear/` are kept only as legacy redirects.

## Quality Gates

Run before commit:

```powershell
node scripts/quality/check-repo-structure.mjs
node scripts/quality/check-site.mjs
```

## Environment Variables

Use `.env.example` for variable names only.

Real `.env` files are local and ignored by Git.

## Corporate Contact

```text
contact@ycsystems.io
```
