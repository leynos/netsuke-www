# Site Claims Benchmark

## Scope

This document benchmarks the claims made by the website rooted at
`netsuke/index.html` against the current source references:

- `docs/developers-guide.md`
- `docs/netsuke-cli-design-document.md`
- `docs/netsuke-design.md`
- `docs/roadmap.md`
- `docs/users-guide.md`

The benchmark distinguishes between:

- `Aligned`: the site claim matches the design/reference set.
- `Partially aligned`: the site simplifies or omits important qualifiers.
- `Overstated or unsupported`: the site claims more than the references support,
  or presents planned/speculative behaviour as established product behaviour.

## Executive Summary

The site gets the core architectural story broadly right: Netsuke is described
as a YAML Ain't Markup Language (YAML)-plus-Jinja build-system compiler that produces a static Ninja plan,
and the six-stage pipeline is generally represented faithfully. The prototype
also reflects the documented emphasis on readable manifests, explicit graph
structure, deterministic planning, and validation before execution.

The largest problems are not with the core compiler story. They are with
product maturity and command-line interface (CLI) capability framing. Several site pages market Netsuke
as a polished, stable, broadly adopted product with concrete release history,
continuous integration / continuous delivery (CI/CD) integrations, configuration surfaces, and command options that the design
documents either leave as future work or do not define at all. The site also
injects some foreign terminology and API shapes that do not belong to the
documented Netsuke model.

## Benchmark

| Site claim | Evidence on site | Benchmark vs references | Notes |
| --- | --- | --- | --- |
| Netsuke is a build-system compiler that turns YAML-plus-Jinja into a static Ninja plan. | `netsuke/index.html` says Netsuke "turns a YAML-plus-Jinja Netsukefile into a static Ninja plan". | `Aligned` | This matches `docs/netsuke-design.md`, which defines Netsuke as a high-level build-system compiler over Ninja and describes the static-plan boundary after dynamic expansion. |
| Netsuke uses a six-stage pipeline with YAML validated before templating and Ninja execution last. | Home page pipeline cards; docs and guides pages repeat the same flow. | `Aligned` | The six-stage narrative matches `docs/netsuke-design.md` and `docs/users-guide.md`. The site shortens some stage names, but the semantics remain recognisable. |
| The manifest is plain YAML with controlled Jinja expansion, `foreach`, `when`, and string-only rendering. | Home page, docs hub, templating page, examples. | `Aligned` | This is consistent with the design and user guide, which emphasise YAML-first parsing, explicit `foreach`/`when`, and final rendering in string fields only. |
| Netsuke is safe by default because builds are hermetic, dependencies are explicit, and structure is validated early. | Home page safety card, rules page, CLI/security page. | `Partially aligned` | The references strongly support explicit structure, YAML-first validation, deterministic graph construction, and shell escaping. They do not establish a full hermetic-build model; the user guide explicitly documents impure helpers such as `env`, `fetch`, `shell`, and `grep`, which weakens any broad "hermetic" claim. |
| Netsuke is cross-platform and Windows is a first-class citizen. | Home page comparison table; install page shows macOS, Linux, and Windows badges. | `Partially aligned` | The references do discuss Windows behaviour, PowerShell fallback for scripts, Windows config discovery, and Windows executable lookup. However, parts of the roadmap remain unfinished for terminal/render validation across Windows shells, so the site presents stronger completion and polish than the roadmap supports. |
| Netsuke provides a friendly, localisable, accessible CLI. | Home page terminal section; docs page; install and guides pages. | `Aligned` | The CLI design document and roadmap explicitly prioritise friendliness, Fluent localisation, accessibility, progress reporting, and clear diagnostics. |
| The documented CLI/configuration surface on the site is current and authoritative. | `netsuke/docs/cli-security-and-configuration/index.html`. | `Overstated or unsupported` | The page advertises `query`, `--expunge`, `--watch`, and a specific layered config model as active product features. The user guide documents `build`, `manifest`, `clean`, and `graph`, but not `query`, `--expunge`, or `--watch`. The roadmap still marks large parts of configuration, themes, and diagnostic output as incomplete. |
| Netsuke has stable release maturity. | Home page says `v0.8.2 Stable Release`; install/blog pages mention `v2.3.1`, `2.3.0`, and generic `0.x.y`. | `Overstated or internally inconsistent` | The site does not present a single, document-backed release story. It mixes incompatible version claims across pages, so even if some version number were correct elsewhere, the prototype as published does not benchmark cleanly against itself. |
| Netsuke is already broadly adopted. | Install page claims `12k+ Downloads`, `5.2k Stars`, `180+ Contributors`. | `Unsupported` | None of the supplied design, roadmap, user, or developer documents establish adoption metrics. These numbers are marketing claims without support in the reference set. |
| Netsuke already provides CI/CD integrations such as `netsuke/setup-netsuke@v1` and Docker images. | Install FAQ. | `Unsupported` | The supplied references do not document those integrations. The CLI design discusses CI use cases and JSON diagnostics conceptually, but does not establish these named delivery artefacts as present. |
| The site's docs and guides describe the feature set more accurately than the marketing pages. | Blog page says the design docs, CLI guidance, and examples currently define Netsuke "more accurately than any marketing page should". | `Aligned` | This is broadly true. The design/user/roadmap documents are materially more precise than the prototype website. |

## Major Mismatches

### 1. The site treats planned or speculative CLI capabilities as shipped

The most serious overstatement is the command-and-config story. The user guide
defines the concrete CLI around `build`, `manifest`, `clean`, and `graph`, plus
documented options such as `--locale`, network-policy flags, accessible-mode
controls, and output-stream rules. The roadmap still leaves several major
pieces incomplete, including:

- `graph --html`
- machine-readable `--diag-json`
- the broader `CliConfig` / OrthoConfig rollout
- configuration precedence regression coverage
- theme-system validation across terminals
- parts of the novice-journey and CI documentation

By contrast, the site already markets:

- a `query` command category
- `netsuke clean --expunge`
- `netsuke build ... --watch`
- concrete config tables that look final rather than provisional

That is not just simplification. It changes the documented product boundary.

### 2. The site imports non-Netsuke concepts into the product story

Two pages introduce terminology that does not match the references:

- `netsuke/docs/manifest-reference/index.html` documents `srcs`, `outs`, `cmd`,
  and `tools`, which do not match the YAML schema described in
  `docs/netsuke-design.md` and `docs/users-guide.md`.
- `netsuke/docs/templating-and-standard-library/index.html` documents
  `ctx.actions.run`, `ctx.actions.write`, `ctx.file.expand`, `select`, and
  `depset`-style ideas that are not part of the documented Netsuke Jinja
  standard library.

These are not benign aliases. They describe a different interface model.

### 3. The site over-claims product maturity and public footprint

The references document architecture, roadmap status, usage, and testing
strategy. They do not support:

- named release trains on the site
- the `Stable Release` label
- large adoption metrics
- named GitHub Action and Docker-image integration deliverables

Those claims should be treated as unsupported by the reference set until they
are anchored to real product documentation.

## Claim-by-Claim Notes

### Core compiler story

The site is strongest when it stays close to the central Netsuke architecture:

- YAML manifest
- controlled Jinja expansion
- explicit build graph
- static Ninja plan
- validation before execution
- deterministic output generation

Those points consistently benchmark well against `docs/netsuke-design.md` and
`docs/users-guide.md`.

### Safety story

The site correctly leans on explicit dependencies, validation, and shell
escaping. The overreach comes from the word `hermetic`. The user guide's
standard-library section documents impure helpers including `fetch`, `shell`,
and `grep`, and the security section tells users to be careful with them. That
means the safer benchmark is "structured and safer by default", not "hermetic"
without qualification.

### User experience (UX) and diagnostics

The site's "clear feedback" positioning is directionally correct. The CLI
design and user guide both support:

- labelled status output
- accessible mode
- Fluent-based localization
- textual fallbacks for non-TTY or screen-reader-friendly use
- source-aware diagnostics and hints

The benchmark issue is not that these themes are wrong. It is that some pages
present specific UI shapes and options as settled product surface when the
roadmap still marks adjacent areas as incomplete.

## Conclusion

The website is reliable as a high-level description of Netsuke's architecture
and language model. It is not yet reliable as a precise account of the shipped
CLI surface, release maturity, or ecosystem footprint.

If this site is intended as a prototype marketing/documentation layer, the
reference set suggests a stricter boundary:

- keep the core compiler story
- keep YAML-first and static-plan messaging
- keep the examples-based explanation of `foreach`, `when`, rules, targets, and
  defaults
- remove or qualify unsupported maturity claims, speculative CLI capabilities,
  and foreign interface terminology
