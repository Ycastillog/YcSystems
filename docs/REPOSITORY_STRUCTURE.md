# YC Systems Repository Structure

This repository is the public corporate website for YC Systems LLC.

The public website lives in `site/`.

The repository root is reserved for company structure: documentation, quality scripts, workflow configuration, route configuration and security policy.

GitHub Pages deploys the static artifact produced from `site/`.

## Production Surface

- `site/index.html`: home page.
- `site/products/`, `site/solutions/`, `site/operating-systems/`, `site/industries/`, `site/case-studies/`, `site/process/`, `site/company/`, `site/contact/`, `site/trust-center/`, `site/documentation/`, `site/developers/`, `site/documents/`, `site/privacy/`, `site/terms/`: approved public route folders.
- `site/assets/`: public brand, client-proof and preview assets that are safe to publish with the website.
- `site/script.js`: public website behavior.
- `site/styles.css`: CSS manifest only.
- `site/styles/`: active modular CSS system.

## Route Source Of Truth

`config/routes-map.json` defines whether each route is canonical, private, legacy, support-only or excluded from the sitemap.

Before changing navigation, sitemap, noindex rules or redirects, update `config/routes-map.json` first.

## Legacy Compatibility

Legacy route folders remain only when they are required for redirects or backward compatibility:

- `about/`
- `brands/`
- `ghostwear/`
- `projects/`
- `services/`

These folders must not become new design surfaces. Client pages belong under canonical routes such as `case-studies/`. Product names, screenshots, prototypes, roadmaps and launch plans stay out of the public repository until they are approved for release.

## Internal Or Generated Material

The following should not become public website copy by accident:

- `.env`, tokens, app secrets, API keys, credentials or local config.
- `output/`, `dist/`, `tmp/`, `.cache/`.
- `content/`, social publishing queues, generated carousels, reels and campaign working files.
- private automations, unpublished scripts or local experiments.
- private product names, product screenshots, launch plans, roadmaps or unreleased customer-facing concepts.
- legal ownership details, EIN documents, operating agreements or personal addresses.

Use `.env.example` for variable names only. Never commit real values.

## Quality Gates

Run before commit:

```powershell
node scripts/quality/check-repo-structure.mjs
node scripts/quality/check-site.mjs
```
