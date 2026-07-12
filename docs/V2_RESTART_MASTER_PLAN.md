# YC Systems V2 Restart Master Plan

This document defines the full restart direction for the next version of the YC Systems public website.

It exists to prevent patch-on-patch work, visual drift, mixed taxonomies, duplicate copy and public exposure of information that should stay private.

The restart should treat this file as the main source of truth before rebuilding pages, content models, navigation and UI.

## Objective

Build a clean V2 that feels like a focused software company, not a collection of disconnected pages.

The new public experience must communicate one clear idea:

> YC Systems builds operational software for real businesses.

That promise should be supported by:

- clear navigation
- one visual system
- one product taxonomy
- one CTA system
- real software evidence
- verified trust surfaces
- strict control over what is public

## What We Keep

The restart keeps only the elements that still represent the brand correctly:

- the official YC Systems logo without slogan for primary navigation use
- the YC color family: navy, blue, cyan and restrained green accents
- Nexus as a visual language and brand character
- real products already part of the ecosystem:
  - CleanLoop
  - SOC
  - BrokerControl
  - CreditPilot
- real client proof already approved for publication
- the public corporate identity of YC Systems LLC

## What We Remove

The restart removes inconsistent, duplicated or risky patterns:

- different navigation menus depending on the page
- changing CTA labels for the same action
- mixed product naming and mixed product states
- mixed language in the same page or route
- repeated claims with slightly different wording
- old CSS behavior that overrides new CSS behavior
- public references to repositories, deployments, commits, GitHub or internal workflows
- unfinished or private business information that should not be exposed
- product listings or concepts that are not part of the approved public ecosystem

## Business Model We Must Present

The site must separate YC Systems into three clear layers.

### 1. Client Solutions

Services and systems we design for client operations:

- internal systems
- operational CRM
- dashboards
- automations
- portals
- platforms
- SaaS development

### 2. YC Systems Products

Public product ecosystem:

- CleanLoop
- SOC
- BrokerControl
- CreditPilot

No additional products should appear in public catalog or homepage unless they are intentionally approved for this ecosystem.

### 3. YC Systems Method

How we work:

- diagnosis
- architecture
- design
- development
- launch
- support

## Official Site Navigation

All canonical pages must use one navigation only.

Approved navigation:

- Soluciones
- Productos
- Casos
- Metodo
- Empresa
- Solicitar diagnostico
- ES / EN

The following belong in the footer, not the primary navigation:

- privacy
- terms
- trust center
- documents
- support
- social links

## Official CTA System

The site must standardize user actions across all pages.

| Context | Official CTA |
| --- | --- |
| Main site action | `Solicitar diagnostico` |
| Available product | `Solicitar demo` |
| Early product | `Solicitar acceso` |
| Case study | `Ver caso completo` |
| Secondary site action | `Ver productos` |

Do not introduce alternates like:

- Elegir solucion
- Diagnosticar operacion
- Disenar CRM
- Propuesta
- Definir producto

Those phrases create confusion and make the site feel like several different versions.

## Product Status System

Each product must have one official status only.

Approved statuses:

- `available`
- `early-access`
- `pilot`
- `prototype`
- `development`
- `internal-concept`

Spanish display labels:

- Disponible
- Acceso temprano
- Piloto seleccionado
- Prototipo
- En desarrollo
- Concepto interno

The same status must be reused automatically in:

- homepage
- product catalog
- product detail pages
- any product comparison modules

## Official Product Model

Every product should come from shared structured content, not manual repeated copy.

```ts
type ProductStatus =
  | "available"
  | "early-access"
  | "pilot"
  | "prototype"
  | "development"
  | "internal-concept";

interface Product {
  slug: string;
  name: string;
  status: ProductStatus;
  audience: string;
  problem: string;
  outcome: string;
  modules: string[];
  primaryAction: string;
  heroImage: string;
}
```

This model should feed:

- homepage product highlights
- `/products/`
- `/products/[slug]/`
- structured metadata

## Homepage Direction

The homepage must sell one idea in five seconds.

### Hero

Kicker:

`YC Systems LLC · Software operativo`

Headline:

`Convierte procesos dispersos en un sistema que tu equipo puede operar, medir y escalar`

Supporting copy:

`Disenamos CRM, plataformas internas, dashboards y automatizaciones para reemplazar operaciones fragmentadas por flujos claros y mantenibles`

Actions:

- `Solicitar diagnostico`
- `Ver casos reales`
- `Ver productos` as tertiary text link only

### Homepage Order

1. Hero with one clear proposition and real product evidence
2. Trust strip:
   - productos propios
   - implementacion por fases
   - soporte continuo
3. Problems YC Systems solves
4. Solutions for clients
5. Featured product: CleanLoop
6. Other YC Systems products
7. One deep client case
8. Six-step method
9. Trust and continuity
10. Final diagnosis CTA

### Homepage Rules

- no more than two primary actions above the fold
- no repeated sections saying the same thing with different styling
- no competing storylines in the first viewport
- software evidence must outweigh abstract brand language

## Nexus Direction

Nexus stays in the brand, but its function changes.

### Current Approved Positioning

Nexus is the visual language and character that represents the YC Systems method.

Nexus should not be presented as a functional AI assistant unless there is a real public workflow users can try.

### Visual Ratio

Use approximately:

- 70 to 80 percent product evidence, dashboards, interfaces and proof
- 20 to 30 percent Nexus illustration or branded support visuals

### Not Allowed

- presenting Nexus as a working assistant if no real assistant exists
- letting Nexus dominate the homepage more than the software itself
- using Nexus as a substitute for real product proof

## Visual System

The V2 should preserve the dark YC Systems identity.

### Color Tokens

```css
:root {
  --bg-950: #020817;
  --bg-900: #071225;
  --surface-800: #0B1426;
  --surface-700: #111F38;
  --border-600: #203451;
  --brand-600: #0B5ED7;
  --brand-400: #33C8FF;
  --success-500: #32D583;
  --text-primary: #F5F8FF;
  --text-muted: #A8B3C7;
  --danger-500: #F04438;
}
```

### Usage Ratio

- 70 percent navy and background tones
- 20 percent surfaces and cards
- 8 percent brand blue and cyan
- 2 percent status colors

### Visual Rules

- glow effects are reserved for high-value moments only
- do not apply neon treatments to all cards
- cyan should be used for accents, focus and selective emphasis
- major sections must align to the same container rhythm
- cards must share radius, padding and spacing rules

## Typography System

V2 should use one family only for consistency and performance.

Recommended family:

- Inter Variable

### Type Scale

| Element | Desktop | Mobile |
| --- | --- | --- |
| H1 | 64 to 72px | 38 to 44px |
| H2 | 42 to 48px | 30 to 34px |
| H3 | 26 to 30px | 22 to 26px |
| Large text | 20px | 18px |
| Body | 16 to 18px | 16px |
| Auxiliary | 14px | 14px |

### Type Rules

- H1 and H2 use weight `700`
- H3 uses weight `600` or `700`
- body uses weight `400`
- buttons and nav use weight `600`
- max paragraph width: `680px` to `720px`
- body line-height: `1.6`
- avoid decorative all-caps overload
- avoid tiny letter-spaced text for primary reading content

## Spacing System

Spacing must follow a consistent 8px rhythm.

Approved ranges:

- section padding desktop: `96px` to `120px`
- section padding mobile: `64px` to `80px`
- card padding: `24px` to `32px`
- card radius: `16px`
- input and button radius: `10px` to `12px`

No section should look like it belongs to a different site because of random height, margin or padding values.

## Content Rules

Public copy must be written from a shared source, not repeated by hand in multiple HTML files.

### Mandatory Content Structure

Create structured content for:

- products
- solutions
- cases
- company
- trust pages
- legal pages
- global CTA labels
- global nav labels

### Editorial Standards

- one route, one language
- one product, one description source
- one status, one display label
- one CTA per context
- no duplicated paragraphs
- no copy-paste between products unless intentionally templated
- no English and Spanish mixed in the same content block

## Language Strategy

The website must not continue with mixed-language routes or mixed-language copy.

Approved route structure:

```text
/es/
  soluciones/
  productos/
  casos/
  empresa/
  contacto/

/en/
  solutions/
  products/
  case-studies/
  company/
  contact/
```

### Language Requirements

- each page must have one language only
- set `lang` correctly per document
- add bidirectional `hreflang`
- keep translated content fully parallel
- avoid machine-like hybrid copy

## Product Evidence Standard

The site must show more real software and fewer generic statements.

Each public product should include:

- three to five real screenshots
- one primary workflow
- one mobile or operational view when relevant
- one reporting or status screen when relevant
- audience
- problem
- outcome
- stage
- next step CTA

Do not publish sensitive or legally risky material.

## Case Study Standard

Each case page should include:

- business context
- previous operating state
- specific problem
- scope delivered
- real screenshots
- before and after flow
- technologies when relevant
- project duration or phases if approved
- verifiable result
- authorized testimonial if available
- live link if approved

Do not invent financial or performance metrics.

If no revenue metric exists, use operational proof like:

- processes centralized
- roles implemented
- modules delivered
- automations created
- tools replaced
- dashboards created

## Diagnostic Form Direction

The diagnosis flow must become shorter and more controlled.

### Step 1: Fast Contact

- name
- company
- email or WhatsApp
- business type
- main problem

### Step 2: Optional Context

- current tools
- estimated users
- what they need to control
- budget range or stage
- contact preference

### Required Technical Controls

- accessible validation
- inline field errors
- top-level error summary
- clear success confirmation
- thank-you step
- honeypot
- rate limiting or Turnstile
- first-party endpoint or serverless function instead of loose form handling
- analytics events for start, error and completion

## Trust Center Direction

The trust center should remain public, but more structured and precise.

Add space for:

- last updated date
- security contact
- subprocessors
- retention and deletion policy
- vulnerability reporting process
- backup practices
- environment separation
- role-based access notes
- support and response expectations when approved
- control status:
  - active
  - partial
  - planned

Do not claim certifications, controls or legal guarantees that have not been verified.

## Public Exposure Rules

The V2 must remain strict about what cannot appear in customer-facing surfaces.

### Never Expose Publicly

- repository URLs
- commits
- deploy pipeline details
- GitHub actions
- prompts
- internal audits written as raw customer copy
- private product internals
- unfinished legal details
- ownership documents
- personal addresses
- EIN or tax records
- private screenshots
- local folders or local automation references

This rule applies to:

- pages
- footers
- metadata
- alt text
- downloadable files
- structured data

## Accessibility And Performance Requirements

V2 should launch only if these are treated as product requirements, not extras.

### Performance

- AVIF and WebP responsive assets
- explicit image dimensions
- only preload the primary hero image
- lazy load below the fold
- self-hosted variable font with subsets
- minimal JavaScript
- motion via transform and opacity only
- support `prefers-reduced-motion`
- versioned long-cache static assets

### Launch Targets

- LCP under 2.5s
- INP under 200ms
- CLS under 0.1

### Accessibility

Treat WCAG 2.2 AA as acceptance criteria:

- contrast
- keyboard navigation
- visible focus
- logical heading order
- proper form labels
- consistent navigation
- correct page language
- alt text
- touch target sizing

## Technical Architecture For The Restart

The restart should not keep growing from the current page-by-page duplication model.

Target structure:

```text
src/
  components/
    navigation/
    buttons/
    cards/
    forms/
    sections/
  content/
    products/
    solutions/
    cases/
    company/
  design-system/
    tokens.css
    typography.css
    spacing.css
    components.css
  locales/
    es/
    en/
  layouts/
  pages/
  assets/
```

If the site remains static-first, we should still mirror this logic inside the repo using a clean build or generation flow so content, layout and components do not keep diverging.

## Restart Rules

Before rebuilding:

1. Freeze official navigation
2. Freeze CTA system
3. Freeze product statuses
4. Freeze language strategy
5. Freeze public vs private content policy

After those are frozen, no new page should be created outside the approved system.

## Implementation Order

### Critical

1. freeze taxonomy, navigation and statuses
2. correct duplicate copy, language issues and editorial errors
3. build design tokens, typography and spacing system
4. rebuild header, footer and homepage
5. build one shared product template
6. simplify diagnostic form

### High

1. build complete case study template
2. split ES and EN routes cleanly
3. modernize trust center
4. optimize assets and Core Web Vitals
5. complete WCAG 2.2 AA review

### After Launch Foundation

1. microinteractions
2. deeper Nexus interactions
3. support center and product documentation
4. editorial content or blog only if strategy exists

## Acceptance Criteria For V2

V2 is ready only when all of the following are true:

- every canonical page uses the same navigation
- the homepage tells one clear story
- product states are consistent across all surfaces
- no page mixes Spanish and English
- no customer-facing page exposes internal or repository details
- the form flow is shorter and more controlled
- trust pages sound precise and credible
- desktop and mobile feel like one system, not separate design attempts
- Core Web Vitals are within target
- accessibility review passes at WCAG 2.2 AA working level

## Final Direction

The restart should make YC Systems feel less like a wide catalog of possibilities and more like a focused software company with:

- clear positioning
- real operating proof
- a repeatable method
- trustworthy public communication
- a brand strong enough to scale

The visual priority should always follow this order:

`client problem -> proposed system -> real evidence -> process -> trust -> diagnosis`

Everything else is secondary.
