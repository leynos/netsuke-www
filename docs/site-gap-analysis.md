# Site Gap Analysis

## Scope

This document identifies functionality and documentation themes that are
prominent in the design and reference documents but are missing, materially
underrepresented, or only lightly touched in the website under `netsuke/`.

The focus is intentionally on features and behaviours not properly covered by
the site, rather than on features the site already discusses well.

## Executive Summary

The website covers the architectural headline story reasonably well:

- Netsuke compiles YAML-plus-Jinja manifests into Ninja
- the graph stays explicit
- `foreach`, `when`, rules, targets, and defaults matter
- examples exist for several workflow types

What the site does not cover well is the actual breadth of the documented
command-line interface (CLI), runtime, security, accessibility, localization,
and diagnostic model. The design and user documents describe Netsuke as a
localizable, accessibility-aware, scriptable CLI with explicit output-channel
behaviour, network-policy controls, Jinja standard-library semantics, and a
richer operational story than the site currently exposes.

## Gaps By Area

### 1. Localization and translation workflows are barely documented on the site

The reference set gives localization substantial weight:

- the CLI design document devotes a major section to Fluent-based
  internationalization
- the roadmap marks localization items complete
- the user guide documents `--locale`, `NETSUKE_LOCALE`, locale precedence, and
  English/Spanish fallback behaviour

The site only gestures at localization:

- the guides page mentions "Translating Documentation"
- the CLI/config page shows a toy `[locale]` config block

What is missing from the site:

- Fluent as the underlying localization system
- localization of help text, status lines, and diagnostics
- locale resolution precedence
- supported locale examples such as `en-US` and `es-ES`
- translation workflow and translator-facing guidance

### 2. Accessibility and Section 508 behaviour are underrepresented

The references describe a concrete accessibility model:

- accessible mode
- `TERM=dumb` and `NO_COLOR` auto-detection
- static labelled status lines
- semantic text prefixes
- emoji suppression
- screen-reader-friendly fallbacks

The site mostly does not document these user-facing behaviours. It talks about
"clear feedback" and sometimes nods at accessibility, but it does not explain:

- `--accessible true|false`
- `NETSUKE_ACCESSIBLE`
- `NETSUKE_NO_EMOJI`
- how progress output changes in accessible mode
- how output stays meaningful without colour
- how screen-reader-friendly operation fits the CLI

Given how prominent accessibility is in the CLI design and roadmap, this is one
of the clearest documentation gaps.

### 3. Output-channel and automation behaviour are mostly absent

The user guide documents scriptability in concrete terms:

- `stderr` for status, progress, and diagnostics
- `stdout` for subprocess output
- `netsuke graph > build.dot`
- `netsuke manifest - | grep ...`
- `--progress false`

The site does not currently teach this operational model. It shows terminal
mockups, but not the stream-separation contract or why it matters for:

- continuous integration (CI) pipelines
- shell composition
- editor integration
- automation and log capture

This omission is important because the reference set treats stream separation
as a first-class behavioural contract, not a minor implementation detail.

### 4. Network-policy controls for `fetch` are not surfaced

The user guide documents a non-trivial network-policy feature set around
`fetch()`:

- `--fetch-allow-scheme`
- `--fetch-allow-host`
- `--fetch-block-host`
- `--fetch-default-deny`

The site does not explain that Netsuke has a documented network-policy model at
all. This leaves a gap between the marketed safety story and the actual
mechanisms documented for controlling network access in templates.

### 5. Much of the documented Jinja standard library is missing from the site

The website gives a narrow picture of the template/runtime surface. It covers:

- `glob`
- `env`
- `foreach`
- `when`
- macros
- sorting

The user guide documents a much richer standard library, including:

- `fetch`
- `now`
- `timedelta`
- `contents`
- `size`
- `linecount`
- `hash`
- `digest`
- `relative_to`
- `realpath`
- `expanduser`
- `uniq`
- `flatten`
- `group_by`
- `shell`
- `grep`
- `which`
- filesystem tests such as `file`, `dir`, and `symlink`

The site currently leaves a reader with an incomplete understanding of what the
templating layer can actually do.

### 6. The executable-discovery feature is missing

The roadmap and user guide document the `which` filter/function as implemented,
including:

- keyword arguments such as `all`, `canonical`, `fresh`, and `cwd_mode`
- cross-platform behaviour
- actionable diagnostic codes

This feature is entirely absent from the site, despite being a concrete,
implemented part of the documented template surface.

### 7. Diagnostics are under-documented beyond generic friendliness

The site shows friendly terminal mockups and a cycle example, but the reference
set goes much further:

- `miette`-style contextual diagnostics
- localized error text
- diagnostic codes for some failures
- parse/schema/template/intermediate representation (IR)/build error categories
- explicit hints and next-step guidance

Missing site coverage includes:

- the taxonomy of error classes
- the relationship between diagnostics and localization
- when diagnostics occur in the pipeline
- how verbose mode interacts with error context

### 8. Configuration precedence and discovery details are mostly absent

The site gestures at layered configuration, but it does not cover the actual
discovery and precedence rules documented in the user guide:

- defaults < config files < environment < CLI
- `NETSUKE_CONFIG_PATH`
- XDG Base Directory locations (XDG)
- Windows application-data lookup
- `$HOME/.netsuke.toml`
- project-root discovery
- nested `NETSUKE_` env var naming with `__`

For a tool whose CLI design makes layered configuration a major part of the
story, the site's treatment is currently too shallow.

### 9. The site barely covers accessible/quiet/progress preferences

The user guide documents:

- `--progress true|false`
- `NETSUKE_PROGRESS`
- config-file `progress`
- completion timing summaries in verbose mode
- suppression rules when progress is disabled

The site does not explain any of these interactions. Readers see terminal
previews, but they do not learn how Netsuke's output is intentionally shaped
for different environments and preferences.

### 10. Advanced usage for automation and CI is missing

The CLI design's user-journey section explicitly discusses:

- CI-focused JSON output concepts
- quiet/verbose workflow choices
- using introspection commands in automation
- machine-readable diagnostics as a future goal

The roadmap separately calls out CI-focused guidance and advanced user
documentation as still-needed work. The site does not bridge that gap. It shows
marketing-friendly terminal windows, but not the operational story for teams
using Netsuke in scripts, editors, or build infrastructure.

### 11. The developer/testing story is almost entirely absent

`docs/developers-guide.md` is not aimed at end users, but it is still a major
reference for the project. The website currently does not surface:

- quality gates
- test-suite structure
- behavioural testing strategy
- compile-time step validation
- expectations for contributors updating docs alongside behaviour

That omission matters because the guides page actively invites contribution and
translation, yet the only shipped `contributing/` page is a placeholder.

### 12. The site does not explain roadmap status and implementation boundaries

The roadmap is one of the most important references because it distinguishes:

- completed work
- pending work
- evaluated but not yet delivered features

The site does not communicate those boundaries well. This creates two related
gaps:

- readers are not told which areas are complete vs still in flight
- some site pages fill the silence by implying functionality that the roadmap
  still marks incomplete

A site-facing "current status" or "what is implemented vs planned" section
would close this gap significantly.

## Feature Coverage Missing From The Website

The following documented features are either absent or too lightly covered to
count as proper site documentation:

- Fluent-based localization and locale precedence
- translator guidance and localization workflow
- accessible mode and screen-reader-oriented output rules
- emoji suppression and semantic text prefixes
- output stream separation (`stdout` vs `stderr`)
- progress control (`--progress`, env, config)
- verbose timing summaries
- network-policy controls for `fetch`
- most of the documented standard library
- `which` and its diagnostics
- error-category documentation across parse/schema/template/IR/build phases
- concrete configuration discovery and precedence rules
- developer/testing workflow for contributors
- roadmap-state framing for implemented vs planned features

## Recommended Direction

If the website is meant to reflect the current references more faithfully, the
highest-value additions are:

1. Expand the CLI/config page to cover accessible mode, locale handling,
   progress/output preferences, and stream separation.
2. Replace shallow standard-library coverage with a real reference slice that
   includes `fetch`, `which`, `shell`, `grep`, time helpers, and file/path
   filters.
3. Add a "current status" or "implemented vs planned" page so the site stops
   collapsing roadmap items into implied present-tense features.
4. Replace the placeholder contributing page with real contributor and
   translation guidance, or stop advertising those routes prominently.

## Conclusion

The site explains what Netsuke is, but not yet enough of how the documented
tool actually behaves for real users. The biggest gaps are in localization,
accessibility, diagnostics, automation contracts, and the broader standard
library and configuration model. Those are not peripheral features in the
reference set; they are central to the documented CLI story.
