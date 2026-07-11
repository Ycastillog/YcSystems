# YC Systems LLC Corporate Website

Corporate website for YC Systems LLC, a software company building business operating systems, SaaS products, client portals, automation and digital infrastructure for modern companies.

## Local Preview

```powershell
C:\Users\Yeica\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe -m http.server 3001 --bind 127.0.0.1
```

Open:

```text
http://127.0.0.1:3001/index.html
```

## Public IA

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

Private product and client proof routes remain available, but are intentionally excluded from the public sitemap while legal/product positioning is still controlled:

```text
/products/cleanloop/
/products/soc/
/products/brokercontrol/
/brands/ghostwear/
```

Compatibility routes such as `/projects/`, `/about/`, `/brands/` and `/services/` are kept only as legacy redirects. The route policy is declared in `routes-map.json`; `sitemap.xml`, navigation and deployment should match that file.

## Route And SEO Source Of Truth

`routes-map.json` is the canonical map for:

- public indexable URLs
- private product URLs
- client proof URLs
- legacy redirects
- support pages that should not be in the sitemap yet

Before changing navigation, sitemap, noindex rules or redirects, update `routes-map.json` first.

## Deployment

This is a static website deployed to GitHub Pages through `.github/workflows/deploy-pages.yml`.

GitHub Pages is the only active production deployment source of truth. `netlify.toml` and `vercel.json` are retained only as legacy compatibility references and must not be treated as the production deploy path unless explicitly reactivated.

## Public URL

Current public URL:

```text
https://ycsystems.io/
```

## Corporate Contact

```text
contact@ycsystems.io
```

## Contact Values To Finalize

- Public WhatsApp number, when ready
- Public LinkedIn company/founder profile, when ready
