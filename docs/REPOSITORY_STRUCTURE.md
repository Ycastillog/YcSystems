# YC Systems Repository Structure

This repository is the public corporate website for YC Systems LLC.

The public website lives in `site/`.

The repository root is reserved for company structure: documentation, quality scripts, workflow configuration, route configuration and security policy.

GitHub Pages deploys the static artifact produced from `site/`.

## Production Surface

- `site/index.html`: home page.
- `site/products/`, `site/solutions/`, `site/operating-systems/`, `site/industries/`, `site/case-studies/`, `site/process/`, `site/company/`, `site/contact/`, `site/trust-center/`, `site/documentation/`, `site/developers/`, `site/documents/`, `site/privacy/`, `site/terms/`: approved public route folders.
- `site/assets/`: public brand, product and preview assets that are safe to publish with the website.
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
- `brokercontrol/`
- `cleanloop/`
- `ghostwear/`
- `projects/`
- `services/`
- `soc/`

These folders must not become new design surfaces. New product and client pages belong under canonical routes such as `products/` or `case-studies/`.

## Internal Or Generated Material

The following should not become public website copy by accident:

- `.env`, tokens, app secrets, API keys, credentials or local config.
- `output/`, `dist/`, `tmp/`, `.cache/`.
- `content/`, social publishing queues, generated carousels, reels and campaign working files.
- private automations, unpublished scripts or local experiments.
- legal ownership details, EIN documents, operating agreements or personal addresses.

Use `.env.example` for variable names only. Never commit real values.

## Quality Gates

Run before commit:

```powershell
node scripts/quality/check-repo-structure.mjs
node scripts/quality/check-site.mjs
```
