# YC Systems CSS Architecture

YC Systems uses a modular CSS system. New visual work must go into the modular files only.

## Entry Point

`site/styles.css` is a manifest. It should only import CSS files.

Current order:

1. `site/styles/reset.css`
2. `site/styles/tokens.css`
3. `site/styles/base.css`
4. `site/styles/layout.css`
5. `site/styles/components.css`
6. `site/styles/nexus.css`
7. `site/styles/pages.css`
8. `site/styles/utilities.css`
9. `site/styles/responsive.css`

## Ownership

- `tokens.css`: colors, typography, spacing, radii, shadows and shared values.
- `reset.css`: reset, box model, focus and reduced motion.
- `base.css`: body, headings, paragraphs, links and default text behavior.
- `layout.css`: containers, sections, page grids, header and footer structure.
- `components.css`: buttons, cards, badges, forms and reusable UI pieces.
- `nexus.css`: Nexus characters, faces, poses, guide cards, method explorer and reveal fallbacks.
- `pages.css`: page-specific layouts and high-value visual sections.
- `utilities.css`: small utility rules only.
- `responsive.css`: breakpoint rules and mobile/tablet ownership.

## Rules

- Do not add or import legacy CSS files.
- Do not fix layout by adding a stronger duplicate selector above an older rule.
- If a rule conflicts, move the active behavior into the correct modular file and delete the duplicate.
- Avoid `!important`. Use it only for accessibility or reduced-motion safeguards.
- Keep typography controlled by tokens. Do not create one-off hero sizes unless the page has a clear reason.
- Keep cards and panels on shared radii, spacing and grid rules.
- Keep Nexus modes, expressions, poses and asset status registered in `config/nexus-system.json`.
- Test desktop, tablet and mobile after touching layout or type.
