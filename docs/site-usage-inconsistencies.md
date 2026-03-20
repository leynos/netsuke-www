# Site Usage Inconsistencies

## Scope

This document compares the user interface and usage model presented by the
website against the interfaces and usage patterns described in:

- `docs/developers-guide.md`
- `docs/netsuke-cli-design-document.md`
- `docs/netsuke-design.md`
- `docs/roadmap.md`
- `docs/users-guide.md`

It focuses on inconsistencies in the way the site documents user interaction,
command-line interface (CLI) surface area, terminology, and documented behaviour.

## Executive Summary

The main inconsistency is that the site presents a smoother, more settled, and
sometimes different user interface than the reference set actually specifies.
Some of those differences are simple omissions. Others are substantive:

- commands are renamed or regrouped
- undocumented flags are shown as if they exist
- prototype pages invent foreign application programming interface (API) terminology
- output examples use user interface (UI) conventions that do not line up with the documented
  accessible/localizable CLI model
- navigation promises pages and workflows that are placeholders or absent

The result is that a reader could come away with the wrong mental model for how
to use Netsuke, even when the broader product story feels plausible.

## Inconsistencies

### 1. The site invents a `query` command grouping

The CLI/config page presents a `query` category containing `manifest` and
`graph`. The user guide documents `manifest` and `graph` as top-level commands,
not as a `query` umbrella.

Why this matters:

- it changes the documented command model
- it implies a command taxonomy not described in the user guide or roadmap
- it may cause users to search for a `netsuke query ...` flow that the
  references do not define

### 2. The site shows `clean --expunge`, but the references do not

The CLI/config page documents `netsuke clean --expunge` and describes removing
the entire output directory. The user guide only documents `clean` as a wrapper
around `ninja -t clean`. The roadmap likewise records `clean` but not
`--expunge`.

This is a direct usage inconsistency, not merely a missing detail.

### 3. The site shows `build ... --watch`, but the references do not

The CLI/config page has a "Pro Tip: Watch Mode" block advertising
`netsuke build ... --watch`. None of the supplied references document this
mode.

This materially changes the expected UI surface for iterative development.

### 4. The site's configuration user interface looks final even though major config work is still tracked as incomplete

The site presents concrete config sections:

- `[build]`
- `[ui]`
- `[locale]`

The roadmap still treats significant configuration work as incomplete,
including broader `CliConfig` rollout, config-file selection, and precedence
testing. The CLI design document also frames many config fields as illustrative
or likely rather than fully settled.

The inconsistency is not that configuration exists in principle. It is that the
site presents a finished configuration interface where the reference set still
shows active design/implementation movement.

### 5. The site's output examples omit the documented accessible-mode user experience (UX)

The user guide documents an explicit accessible-mode interface:

- `Stage 1/6`, `Stage 2/6`, and so on
- static labelled status lines
- `Task 1/2`, `Task 2/2`
- semantic text prefixes and emoji controls

The site's terminal mockups instead favour a visually polished default shell
output with:

- `INFO` lines
- transient-looking progress snippets
- colour-coded success/error emphasis

That is not wrong for one possible mode, but the site does not teach that this
is only one UI mode among several documented output modes. The reference set
defines a more explicit accessibility contract than the site reveals.

### 6. The site under-documents the documented `stdout`/`stderr` contract

The reference interface is intentionally scriptable:

- status and diagnostics on `stderr`
- subprocess output on `stdout`

The site's usage examples do not communicate this division. As a result, the
site documents Netsuke as a human-facing CLI, but not as the scriptable CLI
described by the user guide.

### 7. The manifest reference page uses the wrong field vocabulary

The prototype manifest reference mixes correct Netsuke fields with foreign ones:

- documented correctly elsewhere: `rules`, `targets`, `command`, `sources`,
  `defaults`
- introduced incorrectly on the page: `srcs`, `outs`, `cmd`, `tools`

The design and user guides describe a YAML schema using Netsuke's own field
names. The site therefore gives users a mismatched interface description for
the manifest itself.

### 8. The templating page documents a different programming model

The templating page introduces interface elements such as:

- `ctx.actions.run`
- `ctx.actions.write`
- `ctx.file.expand`
- `select`
- `depset`

Those are not part of the documented Netsuke Jinja interface. The user guide
describes a Jinja-based standard library of functions, filters, and tests such
as `env`, `glob`, `fetch`, `shell`, `grep`, and `which`.

This is one of the clearest UI/documentation mismatches in the whole site:
users are shown an interaction model that belongs to something other than the
reference-set Netsuke.

### 9. The guides page promises contribution UX that the site does not provide

The guides page advertises:

- contribution guidelines
- translation guidance
- pull request etiquette

But the actual `contributing/` page is a placeholder saying the contribution
workflow details were not part of the exported HTML set.

This is a user-journey inconsistency inside the site itself:

- discovery UI says the workflow exists
- destination page says it does not

### 10. The blog/release UI conflicts with the rest of the site's version story

The site uses multiple incompatible version/interface cues:

- home page: `v0.8.2 Stable Release`
- install page: `netsuke 0.x.y`, plus a specific install example `2.3.0`
- blog page: release-history item `v2.3.1`

That inconsistency affects usage because install, upgrade, and release-note
expectations depend on a coherent version model.

### 11. The install page presents a broader platform/install UX than the references document

The install page visually presents:

- macOS
- Linux
- Windows
- Cargo
- Manual

The actual getting-started documentation in the user guide is more conservative
and source-oriented, and the site's own getting-started page foregrounds a
Unix-like environment. The references do support cross-platform ambition, but
the website's install UX reads as more concretely productized than the
reference set justifies.

### 12. The site's CLI examples use undocumented conventions as if they were standard

Examples across the site show patterns such as:

- `INFO` prefixes in terminal transcripts
- immediate "Build completed successfully in 0.8s"
- graph output rendered as simple edges in-page
- version placeholders mixed with concrete version claims

The user guide does document progress and timing summaries, but it also
documents:

- accessible-mode stage labels
- `stderr`/`stdout` separation
- explicit progress suppression
- locale-aware, semantic output behaviour

The site examples therefore show only one glossy variant of the interface,
while suppressing the documented operational variants.

## Navigation-Level Inconsistencies

### Docs navigation implies a fuller reference system than is actually shipped

The docs hub sidebar looks like a mature documentation system with:

- Getting Started
- Manifest Reference
- Rules & Targets
- Templating
- CLI Commands
- Configuration
- Security Model

Some of those pages are real, but parts of their content are still prototype or
invented. The navigation pattern communicates authority and completeness that
the actual page content does not consistently earn.

### Guides and blog navigation imply a living content system

The guides and blog hubs present:

- featured articles
- filter chips
- newsletter signup
- release history
- topic browsing

But the reference set does not support that level of content-system maturity,
and the site contains placeholders and internal contradictions around actual
content availability.

## Severity Assessment

### Highest-severity inconsistencies

- Foreign manifest/API terminology on the docs pages
- `--watch` and `--expunge` presented as active CLI surface
- `query` command grouping not present in the references
- contribution UX advertised but unresolved in destination content

These issues can directly mislead users about how to operate Netsuke.

### Medium-severity inconsistencies

- incomplete representation of accessibility and stream-separation behaviour
- configuration UI presented as more settled than the roadmap indicates
- inconsistent versioning across pages

These are less likely to break first use immediately, but they still distort the
documented product model.

## Conclusion

The site presents a coherent visual experience, but not yet a coherent usage
model. The reference set describes a specific CLI, manifest schema, and runtime
behaviour; the website sometimes simplifies that model and sometimes replaces it
with a different one. The most urgent corrections are the invented command
surface, the wrong schema vocabulary, and the mismatch between prominent
navigation promises and the actual content shipped in the prototype.
