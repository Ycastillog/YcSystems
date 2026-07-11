# YC Systems Repository Structure

This repository is the public corporate website for YC Systems LLC.

The site is intentionally served from the repository root because GitHub Pages deploys the static artifact from these public files. Do not move public routes into a private source folder unless the deployment workflow is changed at the same time.

## Production Surface

- `index.html`: home page.
- `products/`, `solutions/`, `operating-systems/`, `industries/`, `case-studies/`, `process/`, `company/`, `contact/`, `trust-center/`, `documentation/`, `developers/`, `documents/`, `privacy/`, `terms/`: approved public route folders.
- `assets/`: public brand, product, preview and social media assets that are safe to publish.
- `script.js`: public website behavior.
- `styles.css`: CSS manifest only.
- `styles/`: active modular CSS system plus quarantined legacy CSS.

## Route Source Of Truth

`routes-map.json` defines whether each route is canonical, private, legacy, support-only or excluded from the sitemap.

Before changing navigation, sitemap, noindex rules or redirects, update `routes-map.json` first.

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
- private automations, unpublished scripts or local experiments.
- legal ownership details, EIN documents, operating agreements or personal addresses.

Use `.env.example` for variable names only. Never commit real values.

## Quality Gates

Run before commit:

```powershell
node scripts/quality/check-repo-structure.mjs
node scripts/quality/check-site.mjs
```
