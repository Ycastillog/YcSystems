# YC Systems V2 Restart Backlog

This backlog converts the V2 restart strategy into an execution plan.

Use this document together with:

- `C:\Dev\YcSystems\docs\V2_RESTART_MASTER_PLAN.md`
- `C:\Dev\YcSystems\docs\CSS_ARCHITECTURE.md`
- `C:\Dev\YcSystems\docs\PUBLIC_REPOSITORY_POLICY.md`
- `C:\Dev\YcSystems\docs\REPOSITORY_STRUCTURE.md`

The goal is not to patch the current experience. The goal is to rebuild the public website on a cleaner foundation while keeping the approved YC Systems identity.

## Working Rules

1. No new public page should be created before navigation, CTA rules and product status rules are frozen.
2. No new CSS should be added as an override to preserve old behavior if the old behavior is wrong.
3. No page should mix languages.
4. No customer-facing copy should mention repositories, deploy pipelines or internal tooling.
5. All canonical pages must follow the same system for:
   - nav
   - footer
   - spacing
   - CTA labels
   - status labels
   - metadata

## Phase 0 - Freeze The System

Purpose:

Lock the business and brand decisions before implementation starts.

### Tasks

- Freeze the official navigation:
  - Soluciones
  - Productos
  - Casos
  - Metodo
  - Empresa
  - Solicitar diagnostico
  - ES / EN
- Freeze the official CTA set
- Freeze the official product status set
- Freeze which products are public:
  - CleanLoop
  - SOC
  - BrokerControl
  - CreditPilot
- Freeze which routes are canonical and which are legacy
- Freeze what Nexus means in V2
- Freeze public exposure rules

### Deliverables

- approved nav labels
- approved CTA labels
- approved status labels
- approved product list
- approved route map adjustments

### Definition of Done

- every team decision above is written in the master plan or route source of truth
- no unresolved naming conflict remains between pages
- no product appears publicly without status and owner copy

## Phase 1 - Content Architecture

Purpose:

Move copy and product facts out of duplicated page markup and into shared content sources.

### Tasks

- Create shared content model for products
- Create shared content model for solutions
- Create shared content model for cases
- Create shared content model for company and trust pages
- Create shared nav and footer data
- Create shared CTA label definitions
- Create shared language dictionaries for ES and EN
- Audit and remove duplicate product descriptions
- Audit and remove repeated claims with minor wording changes

### Deliverables

- product content source
- solution content source
- case content source
- company content source
- locale dictionaries

### Definition of Done

- homepage, product catalog and product pages can pull from the same product source
- no product status is hard-coded in multiple places
- no page relies on manual copy duplication for nav or footer

## Phase 2 - Design System

Purpose:

Build the visual foundation once so every page feels like the same company.

### Tasks

- Finalize color tokens
- Finalize typography tokens
- Finalize spacing tokens
- Finalize radii, shadows and borders
- Define container widths and section rhythm
- Define button system
- Define badge system
- Define card system
- Define form system
- Define table or stat block system if needed
- Define image treatment rules
- Define responsive breakpoints

### Deliverables

- `tokens.css`
- `typography.css` or equivalent token ownership
- spacing standards
- reusable component classes

### Definition of Done

- there is one approved H1 scale, H2 scale, body scale and button scale
- cards share one radius family and one spacing system
- primary and secondary buttons look consistent across all pages
- desktop, tablet and mobile layouts use the same container logic

## Phase 3 - Global Layout Shell

Purpose:

Rebuild the frame of the site before touching individual page details.

### Tasks

- Rebuild global header
- Rebuild desktop navigation
- Rebuild mobile navigation
- Rebuild language switch pattern
- Rebuild footer
- Rebuild global section spacing behavior
- Rebuild shared meta and social image structure
- Rebuild shared route templates for canonical pages

### Deliverables

- shared header component
- shared footer component
- shared page shell

### Definition of Done

- every canonical page uses the same header and footer
- no page has a different nav taxonomy
- mobile nav works without overlay collisions
- header state, active states and language switch are consistent

## Phase 4 - Homepage Rebuild

Purpose:

Turn the homepage into a clear conversion surface instead of a mixed catalog.

### Tasks

- Rebuild hero around one message only
- Reduce above-the-fold actions to two primary choices
- Add real software evidence to the hero
- Build trust strip
- Build "problems we solve" section
- Build client solutions section
- Build featured product section for CleanLoop
- Build supporting product section for the rest of the ecosystem
- Build one deep case highlight
- Build six-step method section
- Build trust and continuity section
- Build final CTA block

### Deliverables

- complete V2 homepage

### Definition of Done

- a first-time visitor can understand what YC Systems does within five seconds
- the homepage does not repeat the same promise in multiple sections
- the homepage does not present three equal primary actions above the fold
- product proof is stronger than abstract brand language

## Phase 5 - Product System

Purpose:

Standardize how products are listed and explained.

### Tasks

- Build shared product card template
- Build shared product detail page template
- Connect each product to the shared content model
- Standardize status display
- Standardize CTA display by status
- Standardize image gallery behavior
- Add structured metadata for product pages
- Remove mixed labels like OS, line of product, pilot and concept if not official

### Deliverables

- product listing template
- product detail template
- cleaned product copy

### Definition of Done

- every product page has the same information structure
- every product has one official status only
- CTA label matches product status rules
- no product page repeats another product description by mistake

## Phase 6 - Case Study System

Purpose:

Replace vague proof with credible, structured case pages.

### Tasks

- Build one case study template
- Define case study sections:
  - business context
  - previous state
  - problem
  - scope delivered
  - screenshots
  - before/after
  - technologies if relevant
  - phase or duration if approved
  - verifiable result
  - testimonial if approved
  - live link if approved
- Rewrite existing public cases into the template
- Remove generic claims that do not prove outcomes

### Deliverables

- case study template
- rewritten case pages

### Definition of Done

- each case page has specific operational proof
- no case page depends only on vague branding language
- no fake metrics are introduced

## Phase 7 - Method And Solutions Pages

Purpose:

Clarify how YC Systems works and what types of systems it builds for clients.

### Tasks

- Rebuild solutions page around client problem categories
- Rebuild method page around the six-step process
- Rebuild operating systems and related pages using the same taxonomy
- Remove conflicting service labels between pages
- Connect all solution pages to the same CTA logic

### Deliverables

- solutions page
- method page
- aligned supporting pages

### Definition of Done

- solution pages describe client outcomes, not random feature buckets
- method page supports trust and sales, not filler
- no route introduces a second vocabulary for the same business line

## Phase 8 - Diagnostic Form Rebuild

Purpose:

Make contact easier while improving control and credibility.

### Tasks

- redesign form into two-step flow
- define required fields for step one
- define optional context fields for step two
- add accessible validation
- add inline errors
- add top summary errors
- add thank-you state
- add anti-spam protection
- add analytics events
- replace loose submission handling with a controlled endpoint or serverless flow

### Deliverables

- new diagnosis flow
- confirmation state
- submission handling spec

### Definition of Done

- the form is shorter and easier to complete
- users can understand errors without guessing
- submission flow is controlled and measurable
- customer-facing success state explains the next step clearly

## Phase 9 - Trust, Legal And Company Surfaces

Purpose:

Make corporate pages feel precise, current and credible.

### Tasks

- modernize company page
- modernize trust center
- modernize privacy page
- modernize terms page
- modernize documents page
- add update dates where appropriate
- add security contact details where approved
- remove generic or mixed-language legal copy
- ensure corporate pages match the same design language

### Deliverables

- updated company page
- updated trust center
- updated legal pages

### Definition of Done

- legal pages do not feel like placeholders
- trust page does not overclaim
- company page sounds like a real software company, not unfinished internal notes

## Phase 10 - Bilingual Structure

Purpose:

Separate Spanish and English properly.

### Tasks

- define canonical ES route tree
- define canonical EN route tree
- create shared translation keys
- map shared page templates to both languages
- set `lang` attributes correctly
- add `hreflang`
- remove mixed-language copy

### Deliverables

- ES route structure
- EN route structure
- translation mapping

### Definition of Done

- each page is fully Spanish or fully English
- route structure is predictable
- no customer-facing page contains spanglish or half-translated sections

## Phase 11 - Performance And Accessibility

Purpose:

Launch V2 on a stronger technical baseline.

### Tasks

- generate WebP and AVIF assets
- add `srcset` and `sizes`
- set explicit image dimensions
- review font loading
- remove unnecessary JavaScript
- support reduced motion
- audit keyboard navigation
- audit focus states
- audit contrast
- audit touch targets
- review heading order
- review form labels
- measure Core Web Vitals

### Deliverables

- optimized assets
- accessibility fixes
- performance report

### Definition of Done

- LCP target is under 2.5 seconds on target pages
- CLS target is under 0.1
- INP target is under 200ms
- WCAG 2.2 AA issues are addressed at working launch level

## Phase 12 - Cleanup And Migration

Purpose:

Prevent the old site structure from damaging the new one.

### Tasks

- identify legacy folders needed only for redirects
- identify obsolete assets
- identify obsolete CSS rules
- identify obsolete page-specific copy blocks
- remove duplicate selectors after migration
- remove dead routes from active navigation
- keep backup or archive strategy outside the active public surface

### Deliverables

- cleaned active CSS
- cleaned active route map
- archived legacy references

### Definition of Done

- old code is not actively controlling the new layout
- legacy routes exist only when needed for redirects or compatibility
- active public pages do not depend on obsolete assets or selectors

## Canonical V2 Page Order

The rebuild should prioritize pages in this order:

1. homepage
2. solutions
3. products index
4. CleanLoop
5. SOC
6. BrokerControl
7. CreditPilot
8. one flagship case study
9. method
10. company
11. contact
12. trust center
13. privacy
14. terms
15. documents

## Technical Checkpoints

At the end of every major block, validate:

- route consistency
- nav consistency
- CTA consistency
- language consistency
- responsive behavior
- visual rhythm
- public exposure policy

## Release Gates

Do not replace production until all of these are true:

- homepage is complete
- nav and footer are unified
- product template is complete
- one strong case study is live
- contact flow is rebuilt
- trust and legal pages are aligned
- no mixed-language pages remain in canonical surfaces
- old CSS is no longer overriding V2 behavior
- quality scripts pass
- visual QA passes on desktop and mobile

## Immediate Restart Task List

When the restart begins, the first implementation block should be:

1. update route source of truth
2. create content source files
3. create final token layer
4. rebuild shared header and footer
5. rebuild homepage shell

That block creates the base. Everything else becomes easier after that.
