# Overhaul the Netsuke website brand system and shared styling

This ExecPlan (execution plan) is a living document. The sections
`Constraints`, `Tolerances`, `Risks`, `Progress`, `Surprises & Discoveries`,
`Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work
proceeds.

Status: DRAFT

## Purpose / big picture

The prototype site in `netsuke/` already borrows parts of the Himotoshi design
language, but it does so unevenly. Some pages follow the warm paper-and-ink
visual system, some pages drift into darker marketing treatments, and almost
every page duplicates the same Tailwind theme and shared utility CSS inline.
The result is a site that feels related to the design system without feeling
governed by it.

This plan defines how to review the current site against
`docs/himotoshi-design-system.html`, identify internal inconsistency and
design-system drift, apply a brand overhaul across `netsuke/`, and extract the
common visual primitives into shared files that do not require new build
automation. Success is observable when the live preview on
`http://127.0.0.1:2016/netsuke/` presents a consistent Himotoshi identity
across the homepage, hubs, docs, and example pages, and when repeated theme
definitions and utility classes no longer have to be maintained separately in
every HTML file.

## Constraints

- Treat `netsuke/` as the source of truth. Do not regenerate from
  `example_html/` or from any deployment artefact.
- Keep this work scoped to the prototype priorities named in `AGENTS.md`: CSS,
  copy, imagery, semantic HTML, and semantic class names.
- Do not introduce build automation, pipeline changes, or large-scale
  refactors. The prototype currently ships as static HTML served directly by
  Caddy and later copied by `scripts/build-site.mjs`.
- Use the existing preview contract. Do not start Caddy. Validate against the
  server the user already runs on port `2016`.
- Keep page routes and overall content architecture stable. A brand overhaul
  may restyle or rewrite sections, but it must not require inventing a new site
  map.
- Preserve the current homepage hero-banner format. The full-bleed banner
  layout, dark overlay, and hero-first structure may be refined to better fit
  the Himotoshi system, but this plan must not replace the homepage with the
  lighter split-layout hero used in the design-system showcase.
- Preserve accessibility semantics while overhauling visual treatment. Heading
  order, button/link intent, alt text, focus visibility, and sufficient
  contrast remain mandatory.
- Keep the implementation buildless unless the user explicitly approves
  tooling changes. A shared Tailwind style layer must therefore be compatible
  with the current static-site setup.
- Do not touch unrelated untracked documentation or exports already present in
  the working tree.

## Tolerances (exception triggers)

- Tooling: if extracting shared Tailwind-backed styles requires adding a CSS
  build step, Tailwind CLI, PostCSS, or another dependency, stop and escalate
  instead of sneaking in pipeline work.
- Scope: if the overhaul requires touching more than the global shell plus the
  high-traffic hubs before any visual consistency is achieved, stop and present
  a staged rollout option.
- Content authority: if the design system and existing product copy point in
  materially different directions, prefer the design system for visual rules
  and current site/docs copy for product facts; escalate if a choice affects
  structure rather than presentation.
- Interaction: if a visual fix requires rewriting substantial JavaScript beyond
  local component behaviour, stop and reassess rather than turning the overhaul
  into an application rewrite.
- Validation: if Playwright or `css-view` cannot observe a claimed improvement,
  do not mark the milestone complete.

## Risks

    - Risk: The design system file is a showcase, not a production site map,
      so some of its elements are illustrative rather than directly reusable.
      Severity: medium
      Likelihood: high
      Mitigation: use it as the authority for tokens, typography, surfaces,
      button families, and editorial mood, not for literal navigation labels
      or placeholder links.

    - Risk: Repeated inline Tailwind config and CSS appear on nearly every page,
      so partial extraction could leave the site in a half-shared state where
      one edited page diverges from the rest.
      Severity: high
      Likelihood: high
      Mitigation: move global tokens and shared component classes first, then
      sweep every page to consume the shared layer before any page-specific
      polish.

    - Risk: The current site mixes at least two visual directions: the lighter
      editorial Himotoshi system and a darker marketing-hero treatment.
      Severity: high
      Likelihood: high
      Mitigation: choose one primary art direction per page type and document
      the exceptions explicitly in this plan before implementation.

    - Risk: Some current calls to action labelled as GitHub do not point to a
      GitHub destination at all.
      Severity: medium
      Likelihood: high
      Mitigation: treat CTA semantics as part of the brand overhaul, not as
      incidental copy cleanup.

    - Risk: A truly shared Tailwind component file normally wants `@apply` or
      a compile step, which conflicts with the prototype constraint against
      build-pipeline work.
      Severity: high
      Likelihood: high
      Mitigation: keep the shared layer buildless by using one shared Tailwind
      config script plus one shared static CSS file of semantic classes. If the
      user specifically wants compiled Tailwind source, escalate for approval.

## Orientation

The current site is a static HTML prototype rooted at `netsuke/`. The live
preview currently responds at `http://127.0.0.1:2016/netsuke/`. The design
reference is `docs/himotoshi-design-system.html`, which defines the core visual
language: paper-textured background, charcoal/indigo/vermillion/boxwood token
palette, Fraunces headings, Source Sans 3 body copy, JetBrains Mono metadata,
glass-panel navigation, warm bordered cards, and a small family of button and
badge treatments.

The site already imports many of those same tokens, but the implementation is
fragmented:

- `tailwind.config` is duplicated inline in 18 `netsuke/**/index.html` files.
- `.texture-paper` is duplicated inline in the same 18 pages.
- `.glass-panel` is duplicated inline in the same 18 pages.
- The site-wide container utility
  `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` is repeated across the same 18
  pages.
- Plotly is still loaded in 8 pages even though the design need for it is not
  universal.
- The homepage introduces a full-bleed photographic hero with a dark overlay,
  while the design system hero is a lighter editorial split layout with token
  callouts and framed imagery. Per user direction, the implementation should
  keep the homepage banner format and harmonise it rather than replacing it.

Playwright review of the live homepage confirmed additional drift that matters
to the overhaul:

- The primary nav only exposes `GitHub` and `Install`, while the underlying
  HTML also contains a hidden desktop nav. Brand hierarchy and navigation
  emphasis need review together.
- The header CTA labelled `GitHub` points to `examples/`, and the hero CTA
  labelled `View on GitHub` also points to `examples/`. This is both a brand
  credibility problem and a link-semantics problem.
- The homepage still claims a `Gentle (Python-like)` learning curve in its
  comparison table even though the site otherwise presents YAML plus Jinja,
  which suggests copy and visual overhaul should proceed together where the
  brand depends on clarity.

The design-system file itself also contains non-production placeholders such as
`href="#"` links and Font Awesome icons. Those placeholders should not be
copied literally into the website. The website should inherit its visual
language, not its dummy destinations.

## Findings to preserve in the implementation

### Internal stylistic and design inconsistency already verified

1. The homepage hero uses a dark photographic billboard and white text, while
   the design system and most hub pages rely on light surfaces, framed cards,
   and charcoal text on paper tones. This is now treated as a deliberate
   homepage exception that should be brought closer to Himotoshi, not removed.
2. CTA families are inconsistent. The site mixes indigo solid buttons,
   vermillion solid buttons, translucent white buttons, bordered ghost buttons,
   and plain text links without a stable mapping to action priority.
3. Card treatments vary page to page. Some cards are `rounded-xl`, some
   `rounded-lg`; some use `p-8`, others `p-6`; some hover on shadow, others on
   border colour, others do neither.
4. Badge and metadata styling drift across pages. Release pills, tags, filters,
   and info chips all read as related but are not governed by one component
   family.
5. Navigation and footer actions are visually consistent enough to look global
   but semantically inconsistent in where they go and how they are labelled.
6. Some pages, especially `netsuke/index.html` and
   `netsuke/install/index.html`, carry bespoke page-local utility classes
   (`.code-window`, `.pipeline-connector`, `.tab-btn`) without a shared
   extraction story.

### Deviation from the design system already verified

1. The design system emphasises a light editorial hero with boxed imagery and
   token callouts; the homepage currently leads with a cinematic photo splash.
2. The design system defines explicit button families: primary, accent, and
   ghost. The site uses ad hoc button variants that do not map cleanly to that
   family.
3. The design system foregrounds semantic token application and tactile paper
   surfaces. Several live pages still use generic Tailwind utility groupings
   rather than shared semantic component classes.
4. The design system frames tokens as reusable implementation primitives, but
   the site repeats the same token definitions inline instead of consuming a
   shared source.
5. The design system uses component demonstrations with consistent spacing and
   typographic rhythm. Current hub pages use similar ingredients but not a
   single spacing system.

### Common style elements and utilities that should be extracted

The following items are already repeated enough to justify a shared layer:

- Shared Tailwind theme tokens: colour palette, fonts, spacing extension,
  shared shadows, and any future radius/letter-spacing tokens.
- Global utility classes: `.texture-paper`, `.glass-panel`, and the scrollbar
  treatment.
- Global layout primitives: a semantic site shell/container class instead of
  repeating `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` in every page.
- Shared component classes for primary, accent, and ghost buttons.
- Shared component classes for warm bordered cards, metadata badges, section
  kickers, code/terminal surfaces, and footer icon buttons.
- Shared docs/example affordances such as filter chips, side navigation links,
  tab headers, and callout/admonition shells.

## Plan of work

### Phase 1: Create the brand inventory and target component map

Review `docs/himotoshi-design-system.html` alongside the live pages at:

- `/netsuke/`
- `/netsuke/install/`
- `/netsuke/docs/`
- `/netsuke/examples/`
- `/netsuke/guides/`
- `/netsuke/blog/`

For each page, record:

- which design-system motifs it already uses well,
- which motifs it omits,
- which page-specific treatments should survive, and
- which treatments should be normalised or removed.

The output of this phase is a short brand matrix added back into this
ExecPlan before implementation starts. It should name the approved global shell
patterns, CTA hierarchy, card families, typography scale, and imagery rules.

### Phase 2: Introduce shared brand sources without adding a build pipeline

Create one shared script for the Tailwind theme configuration and one shared
stylesheet for semantic brand classes. A practical target shape is:

- `netsuke/assets/js/tailwind-config.js` for `window.tailwind.config`
- `netsuke/assets/css/himotoshi.css` for semantic classes and shared CSS

This is the key design decision of the plan. The shared CSS file should carry
the extracted global classes and semantic components, while the shared
Tailwind-config script should centralise token definitions that are currently
redeclared on every page. This keeps the prototype static and buildless while
still eliminating the duplicated theme layer.

Do not attempt to introduce compiled Tailwind component source unless the user
approves a tooling expansion.

### Phase 3: Unify the global shell first

Apply the shared brand layer to the global navigation, footer, base body
texture, page container, section kickers, and default CTA hierarchy across all
pages before page-level redesign begins. The purpose of this phase is to make
every route unmistakably part of the same site even before detailed hero or
content restyling lands.

This phase must also correct semantic CTA drift:

- every GitHub-labelled link should go to the intended GitHub destination or be
  relabelled,
- install actions should not visually compete with primary product-discovery
  actions unless intentionally promoted,
- footer social/resource icons should point to the right destinations or be
  removed from the prototype.

### Phase 4: Overhaul the high-traffic pages to match the approved art direction

Restyle the homepage, install page, docs hub, examples hub, guides hub, and
blog hub using the shared primitives.

Expected outcomes by page type:

- Homepage: keep the existing hero-banner format, but align its typography,
  CTA hierarchy, overlay treatment, supporting metadata, and transition into
  the next sections with the Himotoshi language so it feels like a deliberate
  front door rather than a separate campaign page.
- Install: restyle the tabbed install widget, quick links, and FAQ surfaces so
  they read as part of the same component family as the homepage and docs.
- Docs hub: normalise sidebar links, search surfaces, callouts, topic cards,
  and footer treatment.
- Examples hub: unify feature cards, filter chips, repository/open-source CTA
  patterns, and metadata badges.
- Guides/blog hubs: bring editorial cards, supporting metadata, and community
  modules into the same spacing and component system.

### Phase 5: Sweep the leaf documentation and example pages

Once the global shell and hubs are stable, update the deeper pages in
`netsuke/docs/**` and `netsuke/examples/**` to consume the same shared classes.
The goal is not to make every page look identical. The goal is to ensure every
page uses the same vocabulary of surfaces, buttons, badges, headings, code
blocks, and supporting navigation.

This sweep should explicitly replace duplicated inline theme blocks and shared
utility definitions in each leaf page with references to the shared files.

### Phase 6: Validate behaviour, visual consistency, and CSS extraction

Validation has to prove three things:

1. The shared files are actually in use.
2. The brand system is visually consistent across the live routes.
3. The overhaul did not break navigation or basic interaction.

Run the validation commands with `tee` logs so the evidence survives output
truncation.

Suggested command sequence:

    set -o pipefail
    npm run build | tee /tmp/build-netsuke-www-$(git branch --show).out

    set -o pipefail
    markdownlint-cli2 docs/execplans/brand-overhaul.md | \
      tee /tmp/markdownlint-netsuke-www-$(git branch --show).out

Use Playwright against the running preview on port `2016` to verify:

- global navigation and footer appear on the key routes,
- CTA labels match their destinations,
- the shared button families appear consistently,
- the page shells no longer jump between unrelated art directions,
- interactive pieces such as install tabs and docs search still function.

Use `css-view` to verify computed-style consistency for a few representative
elements across routes. The first implementation should at minimum inspect:

- nav background and blur treatment,
- primary CTA colour, radius, and typography,
- warm card surfaces on hub pages,
- heading font family and body font family,
- badge/chip treatments in examples and docs.

Representative `css-view` patterns to keep in the implementation notes:

    css-view http://127.0.0.1:2016/netsuke/ | \
      jq '.payload.tree | recurse(.children[]) |
          select(.tag == "nav" and .id == "navbar")'

    css-view http://127.0.0.1:2016/netsuke/examples/ | \
      jq '[.payload.tree | recurse(.children[]) |
           select(.classes | index("chip") or index("tag"))]'

If those selectors need adjusting during implementation, update this plan with
the exact working queries.

## Acceptance criteria

The overhaul is complete only when all of the following are true:

1. The live preview routes under `netsuke/` share one recognisable Himotoshi
   brand language rather than mixing unrelated visual directions.
2. The repeated inline Tailwind theme definition is replaced by one shared
   source.
3. The repeated global utility CSS is replaced by shared files loaded by every
   applicable page.
4. CTA semantics are consistent. Links labelled `GitHub` no longer point to
   unrelated local routes.
5. Playwright validation across the key routes passes without broken nav,
   hidden critical actions, or obvious layout regressions.
6. `css-view` spot checks show consistent computed values for the shared
   component families across routes.

## Progress

- [x] 2026-03-09T23:35:57+00:00: Verified branch `brand-overhaul`, loaded the
  repo guidance, and confirmed the required plan path
  `docs/execplans/brand-overhaul.md`.
- [x] 2026-03-09T23:36:00+00:00: Reviewed
  `docs/himotoshi-design-system.html`, `netsuke/index.html`, and the live
  preview at `http://127.0.0.1:2016/netsuke/`.
- [x] 2026-03-09T23:36:00+00:00: Confirmed repeated inline brand definitions:
  `tailwind.config`, `.texture-paper`, and `.glass-panel` each appear in 18
  site pages.
- [x] 2026-03-09T23:36:00+00:00: Confirmed the live homepage contains GitHub
  CTAs pointing to `examples/`, which must be corrected during the overhaul.
- [x] 2026-03-09T23:36:00+00:00: Drafted the execution plan with phased
  implementation and Playwright/`css-view` validation requirements.
- [x] 2026-03-09T23:39:00+00:00: Updated the plan to preserve the existing
  homepage hero-banner format while minimising its inconsistencies with the
  Himotoshi system.
- [ ] Await user approval before implementation.
- [ ] Add the implementation-phase brand matrix once execution begins.
- [ ] Record route-by-route validation evidence and any deviations accepted as
  intentional exceptions.

## Surprises & Discoveries

- The live preview server on `127.0.0.1:2016` is already running and serving
  the prototype successfully, so implementation can validate against the real
  preview contract without starting infrastructure.
- The design system still contains Font Awesome and placeholder `#` links, so
  it is a visual authority but not a direct source of production link targets.
- The homepage’s hidden desktop nav means some route structure already exists
  in the source but is not the dominant experience seen in the current rendered
  page.
- Plotly is still imported by 8 website pages, which should be audited as part
  of the shared-brand cleanup so decorative dependencies do not linger
  accidentally.

## Decision Log

- 2026-03-09: Treat this as a plan-only task. The user explicitly asked to
  plan the overhaul using the `execplans` skill, so the deliverable for this
  turn is the draft plan, not implementation.
- 2026-03-09: Use the Himotoshi design system as the authority for visual
  language, token selection, and component hierarchy, but not for literal site
  structure or placeholder destinations.
- 2026-03-09: Interpret “extract to a shared Tailwind CSS file” in a buildless
  way unless the user approves tooling expansion. The current repo guidance
  explicitly says not to invest in build automation for this prototype.
- 2026-03-09: Preserve the existing homepage hero-banner format as a project
  constraint. Harmonise that banner with Himotoshi tokens and component logic
  instead of replacing it with the showcase hero pattern from the design
  system file.
- 2026-03-09: Include link semantics in the brand overhaul. A brand refresh
  that leaves misleading `GitHub` actions in place is incomplete.
- 2026-03-09: Require both Playwright and `css-view` evidence before calling
  the implementation complete, because source-level cleanup alone does not
  prove rendered consistency.

## Outcomes & Retrospective

Execution has not started yet. This draft captures the current site drift, the
shared-style extraction strategy that fits the repository constraints, and the
validation standard required before implementation can be considered complete.
Update this section after implementation with the actual routes changed, the
shared files introduced, validation evidence, and any intentional exceptions to
the design system.
