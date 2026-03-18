# Action Site Gap Analysis: Expand Documentation to Match Reference Docs

This ExecPlan (execution plan) is a living document. The sections
`Constraints`, `Tolerances`, `Risks`, `Progress`, `Surprises & Discoveries`,
`Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work
proceeds.

Status: IN PROGRESS

## Purpose / big picture

`docs/site-gap-analysis.md` identifies twelve areas where the live website
(`netsuke/`) does not reflect what the reference documents (`docs/`) specify.
After this work, a reader of the website will understand Netsuke's
accessibility model, localization support, output-stream contract, network
policy controls, full standard library surface, contributor workflow, and
roadmap status — none of which the site currently explains adequately.

Observable success: Load the three changed HTML pages in a browser and confirm
each new section is present, readable, and consistent with the reference docs.
Run `make check-fmt lint test` with no failures.

## Constraints

- Do not modify `netsuke/assets/css/himotoshi.css` beyond what is strictly
  required by new HTML (prefer Tailwind utilities already in use).
- Do not introduce new JavaScript dependencies or new JS files.
- Do not break existing page structure, navigation, or in-page anchor IDs
  that are already referenced in sidebar links.
- All HTML must remain valid and use the existing design tokens and component
  patterns already present in the file.
- Content must be grounded strictly in `docs/users-guide.md`,
  `docs/netsuke-cli-design-document.md`, and `docs/roadmap.md`.
  Do not invent features or behaviours not documented there.

## Tolerances

- Scope: changes are bounded to three HTML files and one new HTML file.
  If more than four files need editing, stop and escalate.
- Iterations: if `make lint` or `make test` fail after two attempts, escalate.
- Ambiguity: if reference docs contradict each other on a specific detail,
  prefer the user guide and note it in Decision Log.

## Risks

- Risk: New sections make pages very long, harming usability.
  Severity: low
  Likelihood: medium
  Mitigation: Use collapsible patterns already present on other pages;
  group new content into discrete sections with clear headings.

- Risk: HTML copy errors (unclosed tags) break layout.
  Severity: medium
  Likelihood: medium
  Mitigation: Validate with `make lint` after each file write.

- Risk: Content diverges from reference docs.
  Severity: high
  Likelihood: low
  Mitigation: Every fact must be traceable to a line in the reference docs.

## Progress

- [x] (2026-03-18) Read and summarized all source files.
- [x] (2026-03-18) Created ExecPlan.
- [x] (2026-03-18) Expanded CLI/config page (accessible mode, locale, progress, stream separation, config discovery, network policy).
- [x] (2026-03-18) Updated sidebar nav links on CLI page to include new anchors.
- [x] (2026-03-18) Expanded templating/standard library page (time helpers, file content filters, path filters, collection filters, command filters, which, filesystem tests).
- [x] (2026-03-18) Updated stdlib chart to reflect broader function set.
- [x] (2026-03-18) Replaced contributing placeholder with real content (contributor workflow, translation guide, developer testing story).
- [ ] Run `make check-fmt lint test` and gate commit.
- [ ] Commit changes.

## Surprises & discoveries

- The contributing page has no navbar, no iconify script, and no Plotly — it
  uses a stripped-down layout. The new contributing page must follow the same
  minimal layout, or adopt the full layout consistently.
- The CLI page sidebar links (`#cli`, `#configuration`, `#security`) are
  hardcoded. New anchors must be added to the sidebar nav.

## Decision log

- Decision: Expand the existing three pages rather than create new pages.
  Rationale: The gap analysis recommends expanding existing pages first.
  Adding new pages would require updating all sidebar navigation on all docs
  pages and is out of scope for this pass.
  Date/Author: 2026-03-18

- Decision: The contributing page adopts the full site layout (with navbar,
  sidebar, footer) to match the other docs pages.
  Rationale: The placeholder used a stripped-down layout. Real contributor
  content is substantial enough to warrant the full docs layout.
  Date/Author: 2026-03-18

- Decision: The stdlib chart will be updated to show a wider set of functions
  reflecting the full documented surface.
  Rationale: The current chart only shows 6 functions; the reference lists
  ~25 functions. An updated chart better represents reality.
  Date/Author: 2026-03-18

## Outcomes & retrospective

_To be completed after work is done._

## Context and orientation

The website lives under `netsuke/`. Three files are being modified:

1. `netsuke/docs/cli-security-and-configuration/index.html` — The CLI
   reference page. Currently covers `build`, `manifest`, `graph`, `clean`
   commands, a shallow `[build]`/`[ui]`/`[locale]` config block, and a
   generic security section. Missing: accessible mode, locale details, output
   stream contract, network policy, configuration discovery, progress control.

2. `netsuke/docs/templating-and-standard-library/index.html` — The template
   reference. Currently shows 6 stdlib cards. Missing: ~20 additional
   documented functions/filters.

3. `netsuke/contributing/index.html` — A placeholder. Needs a real
   contribution and translation guide.

Reference documents:
- `docs/users-guide.md` — Section 7 (stdlib), Section 8 (CLI/config)
- `docs/netsuke-cli-design-document.md` — Localization, accessibility,
  output channels, configuration
- `docs/roadmap.md` — Roadmap status for "implemented vs planned" framing

## Plan of work

### Stage A: CLI/config page expansion

Add four new sections after the existing `#configuration` section, before
`#security`:

1. **`#output-streams`** — Explain stdout/stderr separation, stream contract,
   piping examples, `--progress` flag.

2. **`#accessible-output`** — Explain auto-detection (`TERM=dumb`, `NO_COLOR`),
   `--accessible`, `NETSUKE_ACCESSIBLE`, static stage labels, emoji
   suppression (`NETSUKE_NO_EMOJI`).

3. **`#localization`** — Explain Fluent, `--locale`, `NETSUKE_LOCALE`, locale
   precedence, supported locales (`en-US`, `es-ES`).

4. **`#network-policy`** — Explain `--fetch-allow-scheme`, `--fetch-allow-host`,
   `--fetch-block-host`, `--fetch-default-deny`.

Also expand the `#configuration` section with the actual discovery and
precedence rules (XDG, `NETSUKE_CONFIG_PATH`, `$HOME/.netsuke.toml`,
`NETSUKE_` env var prefix, `__` nesting).

Update the sidebar nav to add links to the new sections.

Add `--progress`, `--accessible`, and `--locale` flags to the `build` command
card.

### Stage B: Templating/stdlib page expansion

Add a new `#stdlib-extended` section with function cards grouped as:

- Time helpers: `now()`, `timedelta()`
- File content filters: `contents`, `size`, `linecount`, `hash`, `digest`
- Path filters: `relative_to`, `realpath`, `expanduser`
- Collection filters: `uniq`, `flatten`, `group_by`
- Command filters: `shell()`, `grep()`
- Executable discovery: `which()` with keyword args and diagnostic codes
- Filesystem tests: `file`, `dir`, `symlink`, `readable`, `writable`

Update the stdlib usage chart data to include a broader set of functions.

### Stage C: Contributing page

Replace the placeholder with a full contributing page using the full docs
layout. Sections:

1. Ways to contribute (code, docs, translations)
2. Development workflow (Cargo, quality gates, `make check-fmt lint test`)
3. Translation workflow (Fluent `.ftl` files, locale identifiers, testing)
4. Code style and commit conventions

## Concrete steps

All commands run from `/data/leynos/Projects/netsuke-www`.

```plaintext
# After each file is written:
make check-fmt lint test
```

## Validation and acceptance

Quality criteria:
- `make check-fmt lint test` passes with zero errors.
- Each new section is reachable via the sidebar anchor links.
- No content is present that contradicts the reference docs.
- The contributing page no longer shows the "Prototype" placeholder banner.

## Idempotence and recovery

Each HTML file write is idempotent. If interrupted, re-run the write step.

## Artifacts and notes

Key anchors added to CLI page: `#output-streams`, `#accessible-output`,
`#localization`, `#network-policy`.

Key section added to stdlib page: `#stdlib-extended`.

## Interfaces and dependencies

No new external dependencies. Uses existing Tailwind CDN, Iconify, and
Plotly already loaded on each page.
