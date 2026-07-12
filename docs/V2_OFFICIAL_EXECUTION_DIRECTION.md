# YC Systems V2 Official Execution Direction

This document is the official execution direction for YC Systems V2.

It consolidates:

- the restart vision
- the visual and structural audit
- the immediate implementation order
- the frozen commercial and product decisions

If another note, draft or chat idea conflicts with this document, this document wins unless explicitly replaced.

Use it together with:

- `C:\Dev\YcSystems\docs\V2_RESTART_MASTER_PLAN.md`
- `C:\Dev\YcSystems\docs\V2_RESTART_BACKLOG.md`
- `C:\Dev\YcSystems\docs\V2_DESKTOP_MOBILE_REVIEW_GUIDE.md`

## 1. Official Positioning

Every public page must support this idea:

> YC Systems builds operational software for businesses that need to control, measure and grow.

This positioning does not change page by page.

Interior pages may add context, but they may not replace the main business story.

## 2. Frozen Navigation

The official primary navigation is:

- Soluciones
- Productos
- Casos
- Metodo
- Empresa
- Solicitar diagnostico
- EN

This navigation must come from one shared source.

Approved primary navigation model:

```ts
export const primaryNavigation = [
  { label: "Soluciones", href: "/solutions/" },
  { label: "Productos", href: "/products/" },
  { label: "Casos", href: "/case-studies/" },
  { label: "Metodo", href: "/process/" },
  { label: "Empresa", href: "/company/" },
];
```

### Not Allowed In Main Nav

These labels should not return to the primary navigation:

- Clientes
- Servicios
- Trabajo de clientes
- Proyectos de clientes
- Tecnologia
- Nosotros
- Contacto
- Propuesta

## 3. Frozen CTA System

The official CTA set is:

```ts
export const CTA = {
  diagnostic: "Solicitar diagnostico",
  demo: "Solicitar demo",
  access: "Solicitar acceso",
  caseStudy: "Ver caso completo",
  products: "Ver productos",
};
```

### Not Allowed

Do not publish variants like:

- Cotizar CleanLoop
- Quiero un sistema como este
- Disenar CRM
- Diagnosticar operacion
- Automatizar proceso
- Hablar de una solucion
- Propuesta
- Elegir solucion

## 4. Frozen Product Status Model

The official status type is:

```ts
export type ProductStatus =
  | "available"
  | "early-access"
  | "selected-pilot"
  | "prototype"
  | "in-development"
  | "internal-concept";
```

Public display labels:

- Disponible
- Acceso temprano
- Piloto seleccionado
- Prototipo
- En desarrollo
- Concepto interno

## 5. Initial Product Exposure Decision

Pending only final commercial confirmation before full public enforcement:

| Product | Proposed V2 status | Exposure |
| --- | --- | --- |
| CleanLoop | Acceso temprano | Publico |
| SOC | Prototipo | Publico |
| BrokerControl | Piloto seleccionado | Publico |
| CreditPilot | En desarrollo | Publico limitado |
| DebtZero | Concepto interno | No mostrar |

No internal concept should be shown publicly until intentionally approved.

## 6. Execution Order

This is the exact build order for the new branch.

1. Create global V2 tokens
2. Create central site configuration
3. Create official navigation source
4. Build `SiteHeader` desktop
5. Build accessible `MobileNavigation`
6. Build `SiteFooter`
7. Build `PageShell` and `PageHero`
8. Migrate all canonical pages to the shell
9. Delete local headers and footers from canonical pages
10. Correct page titles, H1s and CTA labels across all routes
11. Create central product model
12. Approve product status and exposure
13. Create one `ProductCard`
14. Create one `ProductPage` template
15. Migrate CleanLoop
16. Migrate SOC
17. Migrate BrokerControl
18. Migrate CreditPilot
19. Hide internal concepts not approved
20. Rebuild home with the new hierarchy
21. Rewrite Soluciones
22. Rewrite Metodo
23. Create one full case-study template
24. Publish the two strongest case studies first
25. Rebuild Empresa and Trust Center
26. Align Privacidad, Terminos and Documentos
27. Rebuild the two-step diagnosis flow
28. Separate ES and EN content
29. Optimize images and fonts
30. Run desktop QA
31. Run mobile QA
32. Run keyboard and form audit
33. Measure LCP, INP and CLS
34. Fix regressions
35. Prepare final V2 preview

## 7. First Deliverable Scope

The first real deliverable of V2 must stop here:

- global tokens
- site configuration
- official navigation
- footer
- shell
- CTA model
- product model

Until that base is complete, do not spend time on:

- decorative motion
- isolated polish on one page
- experimental hero variations
- advanced Nexus interactions

## 8. Shared Component Foundation

The first system layer should create:

- `SiteHeader`
- `DesktopNavigation`
- `MobileNavigation`
- `LanguageSelector`
- `SiteFooter`
- `PageShell`
- `PageHero`
- `Breadcrumb`
- `Section`
- `Container`
- `Button`
- `TextLink`
- `StatusBadge`
- `ProductCard`
- `CaseCard`
- `FormField`

### Canonical Acceptance For Foundation

- no canonical page writes its own header
- no canonical page writes its own footer
- header CTA has the same size, position and text on every canonical page
- mobile navigation uses the same data model as desktop
- header, nav and footer work without late injection being required for basic visibility
- page content remains visible even if non-critical JavaScript fails

## 9. Visual Direction

V2 keeps the dark YC Systems identity with less glow and stronger structural contrast.

### Official Token Direction

```css
:root {
  --color-bg-950: #020817;
  --color-bg-900: #071225;

  --color-surface-800: #0b1426;
  --color-surface-700: #111f38;
  --color-border-600: #203451;

  --color-brand-600: #0b5ed7;
  --color-brand-400: #33c8ff;

  --color-success-500: #32d583;
  --color-danger-500: #f04438;
  --color-warning-500: #f5b942;

  --color-text-primary: #f5f8ff;
  --color-text-secondary: #a8b3c7;
  --color-text-inverse: #020817;
}
```

### Visual Rules

- glow is reserved for hero image, focus states, Nexus and selected highlights
- there should not be permanent glow on every card
- software proof must carry more weight than decorative aura
- desktop should be refined first, mobile immediately after

## 10. Typography Direction

One family only:

```css
--font-sans: "Inter Variable", Inter, system-ui, sans-serif;
```

### Scale

- Display / H1 desktop: `64px`
- H1 interior desktop: `52px`
- H1 mobile: `40px`
- H2 desktop: `42px`
- H2 mobile: `30px` to `34px`
- H3: `24px` to `28px`
- Large body: `20px`
- Base body: `16px` to `18px`
- Auxiliary text: `14px`

### Rules

- one H1 per page
- H1 should stay roughly within 12 words
- no paragraph should depend on decorative all-caps styling
- headings should not rely on manual line breaks to look correct

## 11. Spacing Direction

Spacing must follow the shared system:

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-6: 24px;
--space-8: 32px;
--space-12: 48px;
--space-16: 64px;
--space-24: 96px;
--space-30: 120px;
```

Usage:

- desktop sections: `96px` to `120px`
- mobile sections: `64px` to `80px`
- card padding: `24px` to `32px`
- grid gap: `24px` to `32px`
- header height: `72px` to `80px`

## 12. Homepage Direction

The homepage should stop behaving like a broad catalog.

### Hero V2

Eyebrow:

`YC Systems - Software operativo`

H1:

`Convierte una operacion dispersa en un sistema que tu equipo puede controlar`

Description:

`Disenamos CRM, sistemas internos, dashboards, portales y automatizaciones para reemplazar tareas sueltas por flujos claros, medibles y mantenibles`

Actions:

- `Solicitar diagnostico`
- `Ver casos`
- tertiary text link: `Ver productos`

### Homepage Order

1. Hero
2. Short trust signals
3. Problems YC Systems solves
4. Primary solutions
5. Featured product: CleanLoop
6. Other products
7. One featured case
8. Six-step method
9. Trust and continuity
10. Final CTA

### Remove Or Combine

- merge “why companies choose YC Systems” into trust signals
- integrate “product company mindset” into the method
- do not let Nexus compete with the commercial close
- show only one deep case on the homepage

## 13. Product Catalog Direction

Each product card should include:

- status
- name
- one-line description
- audience
- result
- real screenshot
- CTA

### Catalog Rules

- no “Nexus recommends” framing on cards
- no repeated copy from the product detail page
- only approved products in the public catalog
- screenshots must keep consistent aspect ratio
- products are ordered by maturity, not decoration

## 14. Shared Product Page Direction

Product pages must use one model:

```ts
interface Product {
  slug: string;
  name: string;
  status: ProductStatus;
  category: string;
  headline: string;
  summary: string;
  audience: string[];
  problems: string[];
  outcomes: string[];
  modules: ProductModule[];
  screenshots: ProductScreenshot[];
  availability: string;
  primaryCta: "demo" | "access";
  public: boolean;
}
```

### Product Page Order

1. Breadcrumb
2. Status and category
3. H1 and summary
4. Primary CTA
5. Main product visual
6. Audience, problem and result
7. Modules
8. Operational flow
9. Screenshots
10. Current availability
11. Related product or case
12. Final CTA

### Product Rules

- use `Solicitar demo` only when the product is actually demonstrable
- use `Solicitar acceso` for early access and selected pilot
- do not use `Cotizar producto`
- separate “available now” from “future direction”
- one page, one language
- no product description should live directly as isolated hard-coded page copy long term

## 15. Solutions Direction

Solutions must connect to commercial situations, not abstract labels.

Official taxonomy:

- CRM y operaciones comerciales
- Sistemas internos
- Dashboards y reportes
- Automatizacion e integraciones
- Portales para clientes
- Plataformas y productos SaaS

Each solution block should explain:

- common problem
- system built
- what phase one includes
- what result it enables
- related case or product
- `Solicitar diagnostico`

## 16. Cases Direction

First build two full case studies with the strongest available evidence.

Each full case should include:

- business summary
- previous state
- specific problem
- goal
- scope delivered
- real screenshots
- before / after flow
- verifiable result
- technologies only when useful
- live link
- diagnosis CTA

### Visual Separation

Owned products and client cases must not use the same card logic.

Owned product:

- product label
- status
- availability
- demo / access CTA

Client case:

- case study label
- industry
- deliverable
- `Ver caso completo`

## 17. Method Direction

The six official steps are:

| Step | Deliverable | Risk Reduced |
| --- | --- | --- |
| Diagnostico | problem map and priorities | building the wrong thing |
| Arquitectura | modules, roles, data and phases | uncontrolled scope |
| Diseno | flow and screen prototype | usability and direction problems |
| Desarrollo | first functional version | technical debt and improvisation |
| Lanzamiento | QA, publishing and documentation | adoption failure |
| Soporte | maintenance and future phases | abandonment after launch |

This page must explain what the client receives at each stage.

## 18. Company Direction

The company page should be rebuilt around:

1. what YC Systems is
2. what it builds
3. what type of operations it serves
4. how it works
5. principles
6. trust and continuity
7. contact

Replace “Nexus first” with “Claridad operativa”.

Nexus is part of the brand language, not the customer’s main buying principle.

## 19. Trust, Privacy And Legal Direction

Trust Center should keep its honest distinction between:

- active controls
- partial controls
- planned controls

Do not publish:

- internal configurations
- credentials
- recovery methods
- sensitive architecture
- private client details
- certifications not obtained

Privacy, Terms and Documents must be aligned with:

- final form behavior
- actual tools in use
- real retention expectations
- real processing channels

## 20. Diagnosis Flow Direction

### Step 1

- Nombre
- Empresa
- Email o WhatsApp
- Problema principal

Button:

`Continuar`

### Step 2

- Industria
- Como se maneja actualmente
- Cantidad aproximada de usuarios
- Resultado deseado
- Canal de respuesta
- Contexto adicional

Button:

`Solicitar diagnostico`

### Behavior

- WhatsApp is only required if that response channel is selected
- progress must announce “Paso 1 de 2”
- errors must show below the field
- a summary of errors must appear at the top
- focus must move to the first error
- duplicate submissions must be blocked
- a clear success confirmation must appear
- no sensitive data should be requested

## 21. Language Migration Direction

The migration happens in two stages.

### Stage One

- rewrite and approve everything in Spanish
- separate content sources by language immediately
- remove mixed text
- do not link incomplete English pages

### Stage Two

```text
/es/
  soluciones/
  productos/
  casos/
  metodo/
  empresa/
  diagnostico/

/en/
  solutions/
  products/
  case-studies/
  process/
  company/
  diagnostic/
```

Do not change every URL in the first visual lot.

First stabilize V2 on current routes, then run the language migration with redirects, canonical tags and alternates.

## 22. Desktop-First, Mobile-Immediately-After

Desktop review widths:

- 1280px
- 1440px
- 1920px

Mobile review widths:

- 360px
- 390px
- 430px
- 768px

### Desktop Goals

- balanced hero
- interiors as refined as the homepage
- consistent max widths
- regular card grid
- stable nav
- no excessively wide content blocks
- no section heading that feels like another hero

### Mobile Goals

- first viewport shows proposition, support and CTA
- menu does not cover content awkwardly
- H1 does not consume nearly the full screen
- cards avoid unnecessary paragraph length
- buttons keep consistent width and priority
- images keep defined proportions
- no horizontal scroll
- focus remains visible in the open menu
- menu closes with Escape and returns focus to the trigger

## 23. Performance And Accessibility

### Performance

- AVIF/WebP with fallback
- `srcset` and `sizes`
- explicit dimensions
- one priority image per page
- lazy loading below first viewport
- self-hosted variable font
- no animation libraries for simple effects
- only animate transform and opacity
- minimal JavaScript for static pages
- versioned cached assets

Targets:

- `LCP <= 2.5s`
- `INP <= 200ms`
- `CLS <= 0.1`

### Accessibility

Definition of done is WCAG 2.2 AA working level, including:

- contrast
- alt text
- consistent navigation
- keyboard support
- focus order
- focus not hidden by sticky UI
- labels and instructions
- error identification and suggestions
- touch target sizing
- page language
- status messages
- reduced motion

## 24. Final Definition Of Done

V2 is not done until:

- all canonical pages share the same header and footer
- only the five approved CTAs exist
- each page has one H1
- no page mixes Spanish and English
- all products come from one source
- each product has one status
- no duplicate descriptions remain
- Nexus is not presented as a feature users cannot actually use
- products and client cases are clearly separated
- the form has two steps, validation and confirmation
- public copy does not mention internal processes
- no local CSS rule contradicts the design tokens
- the site works with keyboard
- images have optimized formats and dimensions
- Core Web Vitals targets are met
- desktop and mobile feel like the same design system

## 25. Official Build Principle

The first delivery of the branch must stay focused on:

- shell
- tokens
- navigation
- footer
- CTA model
- product model

Until that foundation is complete, avoid spending time on decorative polish.
