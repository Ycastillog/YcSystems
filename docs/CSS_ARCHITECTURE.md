# YC Systems CSS Architecture

YC Systems uses a modular CSS system. New visual work must go into the modular files, not into legacy quarantine.

## Entry Point

`site/styles.css` is a manifest. It should only import CSS files.

Current order:

1. `site/styles/legacy-quarantine.css`
2. `site/styles/tokens.css`
3. `site/styles/reset.css`
4. `site/styles/base.css`
5. `site/styles/layout.css`
6. `site/styles/components.css`
7. `site/styles/pages.css`
8. `site/styles/utilities.css`
9. `site/styles/responsive.css`

## Ownership

- `tokens.css`: colors, typography, spacing, radii, shadows and shared values.
- `reset.css`: reset, box model, focus and reduced motion.
- `base.css`: body, headings, paragraphs, links and default text behavior.
- `layout.css`: containers, sections, page grids, header and footer structure.
- `components.css`: buttons, cards, badges, forms and reusable UI pieces.
- `pages.css`: page-specific layouts and high-value visual sections.
- `utilities.css`: small utility rules only.
- `responsive.css`: breakpoint rules and mobile/tablet ownership.
- `legacy-quarantine.css`: frozen compatibility only.

## Rules

- Do not add new CSS to `legacy-quarantine.css`.
- Do not fix layout by adding a stronger duplicate selector above an older rule.
- If a legacy rule conflicts, move the active behavior into the right modular file and delete the matching legacy rule.
- Avoid `!important`. Use it only for accessibility or when removing it would require a verified larger migration.
- Keep typography controlled by tokens. Do not create one-off hero sizes unless the page has a clear reason.
- Keep cards and panels on shared radii, spacing and grid rules.
- Test desktop, tablet and mobile after touching layout or type.

## Why Legacy Is Still Imported

The legacy file is imported only to preserve existing public pages while the site is migrated safely. It must shrink over time.
