# Overhaul Netsuke website copy, examples, and inline code

This ExecPlan (execution plan) is a living document. The sections
`Constraints`, `Tolerances`, `Risks`, `Progress`, `Surprises & Discoveries`,
`Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work
proceeds.

Status: COMPLETE

## Purpose / big picture

The current prototype website does not describe the same product as the design
and usage documents in `docs/`. Large parts of the site still present Netsuke
as a Starlark-style, hermetic, Bazel-adjacent system with versioned release
marketing, while the reviewed source documents define a YAML-first
`Netsukefile`, Jinja-based templating, a six-stage compiler pipeline, and a
CLI whose primary job is to compile to Ninja and execute builds. The goal of
this overhaul is to bring the website copy, examples, and inline code back
into alignment with those reviewed documents without changing layout, visual
style, component structure, or page flow.

Success is observable in three ways. First, a reviewer can compare site copy in
`netsuke/` against `docs/netsuke-design.md`,
`docs/netsuke-cli-design-document.md`, `docs/users-guide.md`,
`docs/developers-guide.md`, and `docs/examples/*` and find no major product
story contradictions. Second, every inline manifest snippet on the site uses
the YAML-plus-Jinja `Netsukefile` language rather than Starlark or Bazel-like
syntax. Third, examples and onboarding steps describe supported concepts from
the reviewed docs rather than speculative features or invented release
narratives.

## Constraints

- Do not make visual style, layout, navigation structure, or component
  hierarchy changes. Text content, inline code, captions, labels, and example
  payloads may change; page structure should remain intact.
- Treat `netsuke/` as the source of truth for website content. Do not attempt
  to regenerate from `example_html/` or any deployment artefact.
- Anchor all product claims to the reviewed documentation set only:
  `docs/netsuke-design.md`, `docs/netsuke-cli-design-document.md`,
  `docs/users-guide.md`, `docs/developers-guide.md`, and `docs/examples/*`.
- Apply the `df12-copy` voice rules to public-facing prose: British English,
  compressed phrasing, evidence before commentary, and no startup vocabulary.
- Preserve semantic HTML and existing semantic class names.
- Do not invent unsupported capabilities. If the reviewed docs describe an item
  as future work, optional work, or merely a possible extension, the website
  must not present it as shipped behaviour.
- Keep example code internally consistent. Snippets on landing, docs, install,
  examples, and guides pages must all describe the same manifest language and
  command surface.

## Tolerances (exception triggers)

- Scope: if aligning the content requires new pages, route changes, or asset
  additions beyond lightweight illustrative text files, stop and escalate.
- Interface: if preserving page layout proves impossible without HTML
  structural edits beyond localized text-bearing elements, stop and escalate.
- Evidence: if a desired website claim cannot be substantiated from the
  reviewed docs, cut it instead of guessing. Escalate only if the claim is
  critical to the page purpose.
- Ambiguity: if the reviewed docs materially disagree about current behaviour,
  stop and document the conflict before writing site copy that chooses one side.
- Examples: if any example cannot be made both accurate and short enough for
  the existing page slots, prefer accuracy and simplify the scenario rather
  than compressing it into misleading pseudo-code.

## Risks

    - Risk: The reviewed docs themselves include a mix of current contracts and
      aspirational design material, especially in the CLI design document.
      Severity: high
      Likelihood: medium
      Mitigation: prefer behaviour described consistently across the design
      doc, user guide, and examples; avoid marketing unsupported CLI verbs.

    - Risk: The prototype site contains many repeated claims across pages, so
      partial editing can leave contradictory remnants behind.
      Severity: high
      Likelihood: high
      Mitigation: perform a terminology sweep after the main rewrite for
      strings such as `Starlark`, `hermetic`, `v2.4.0`, `netsuke init`, and
      Bazel-style target syntax.

    - Risk: Existing docs/examples include stale placeholder syntax such as
      `{ins}` and `{outs}` that conflict with the reviewed design docs.
      Severity: medium
      Likelihood: high
      Mitigation: normalize examples to `{{ ins }}` and `{{ outs }}` where the
      reviewed docs define those placeholders.

    - Risk: The current site relies on release-note style copy to fill entire
      sections, especially the blog and install pages.
      Severity: medium
      Likelihood: high
      Mitigation: replace speculative release marketing with evergreen product
      education, version-neutral usage notes, or clearly labelled placeholders
      that do not claim unsupported functionality.

## Orientation

The reviewed source documents define Netsuke as a build system compiler:
`Netsukefile` input, YAML validation first, Jinja expansion second, typed
deserialisation, IR generation and validation, then Ninja synthesis and
execution. The website currently drifts from that model in several places.

Concrete drift already verified in this repository:

- `netsuke/index.html` says the `Netsukefile` uses a Starlark-inspired syntax
  and mentions parsing "YAML/Starlark syntax". The reviewed design docs define
  YAML plus Jinja, not Starlark.
- `netsuke/docs/manifest-reference/index.html` presents package declarations,
  `load(...)`, Bazel-style labels, and Python-like syntax that do not belong to
  the reviewed `Netsukefile`.
- `netsuke/docs/templating-and-standard-library/index.html` explains Starlark
  and why Netsuke chose it, which directly conflicts with the Jinja-based
  design.
- `netsuke/docs/rules-and-targets/index.html` uses Bazel-style target labels
  and sandboxing claims not established by the reviewed docs.
- `netsuke/install/index.html` claims a single-binary installer experience,
  references `netsuke init`, shows `netsuke 2.4.0 (stable)`, and promises graph
  visualisation. The reviewed CLI docs do not establish those exact shipped
  behaviours.
- `netsuke/blog/index.html` contains fictional release posts for remote caching,
  Starlark debugging, and watch mode; those are not grounded in the reviewed
  documents.
- `netsuke/examples/index.html` and
  `netsuke/examples/basic-c-application/index.html` show Starlark/Bazel-like
  examples instead of YAML manifests.
- `docs/examples/basic_c.yml`, `docs/examples/photo_edit.yml`,
  `docs/examples/visual_design.yml`, and `docs/examples/website.yml` still use
  `{ins}` and `{outs}` placeholders even though the reviewed design docs define
  `{{ ins }}` and `{{ outs }}`.

## Plan of work

### Phase 1: Establish the canonical content model

Create a short content matrix inside this ExecPlan mapping the website’s core
claims to the reviewed docs. The matrix should cover the landing page value
proposition, install/onboarding flow, manifest language description, rules and
targets terminology, templating/standard library terminology, and examples
taxonomy. This step exists to stop the rewrite from oscillating between the
design doc’s architectural language and the user guide’s practical usage
language.

The output of this phase is a stable editorial baseline:

- Netsuke is described as a YAML-plus-Jinja build system compiler for Ninja.
- The site explains dynamic logic as controlled Jinja expansion inside an
  otherwise declarative manifest.
- Copy avoids unsupported claims about hermetic sandboxes, remote caching,
  Starlark debugging, watch mode, package loading, or invented stable releases.

### Phase 2: Rewrite the high-traffic product story pages

Update the landing page, docs hub, install page, guides hub, and blog page so
the first impression matches the reviewed docs. The key work is editorial, not
structural:

- Replace Starlark/Bazel vocabulary with YAML, Jinja, targets, rules, actions,
  defaults, and the build-to-Ninja pipeline.
- Rework install/onboarding copy so it describes verified paths from the
  reviewed docs. Avoid shipping claims that are only suggested future work in
  `docs/netsuke-cli-design-document.md`.
- Replace fictional version marketing with evergreen educational copy or
  clearly neutral placeholders.
- Keep buttons, cards, and section placement unchanged; only change the words
  inside them.

### Phase 3: Rewrite the documentation pages in `netsuke/docs/`

Bring the documentation pages into line with the reviewed docs while preserving
their current layouts.

- `netsuke/docs/getting-started/index.html` should teach the minimal working
  path: create a `Netsukefile`, run `netsuke`, build defaults or named targets,
  and understand the role of Ninja.
- `netsuke/docs/manifest-reference/index.html` should describe the reviewed
  top-level keys: `netsuke_version`, `vars`, `macros`, `rules`, `targets`,
  `actions`, and `defaults`.
- `netsuke/docs/rules-and-targets/index.html` should explain rules, targets,
  actions, `phony`, `always`, `deps`, and `order_only_deps` using YAML
  manifests, not Bazel labels.
- `netsuke/docs/templating-and-standard-library/index.html` should explain
  MiniJinja usage, `foreach`, `when`, macros, and the reviewed helper surface.
- `netsuke/docs/cli-security-and-configuration/index.html` must be checked for
  unsupported language around versioning, sandboxing, or configuration
  behaviour and revised to match the CLI design document.

### Phase 4: Rebuild the examples narrative

Align `docs/examples/*` and the website examples pages so they reinforce the
same story rather than splitting into "real docs" and "marketing docs".

- Normalize the example manifests to the reviewed syntax and placeholder
  conventions.
- Rewrite example summaries so they describe what the manifest demonstrates:
  inline commands, reusable rules, macros, `foreach`, `when`, `glob`, actions,
  and defaults.
- Replace the basic C example page’s Bazel-like narrative with a YAML-based C
  example that mirrors `docs/examples/basic_c.yml` after it is corrected.
- Ensure every showcased example is small enough to fit the existing layout but
  realistic enough to teach a documented feature.

### Phase 5: Consistency sweep and proof

After the page rewrites, run a repository-wide terminology sweep across
`netsuke/` and `docs/examples/` for drift markers:

- `Starlark`
- `load(`
- `package(`
- `//app:`
- `v2.4.0`
- `v2.3.0`
- `netsuke init`
- `remote cache`
- `watch mode`
- `{ins}`
- `{outs}`

Resolve each hit or explicitly justify it in this plan if it remains as a
future placeholder. Then run the documentation gates and record the exact
commands and log paths in `Outcomes & Retrospective`.

## Implementation notes

Use the existing HTML page structures as fixed shells. Treat each rewrite as a
content transplant rather than a redesign. If a code window currently displays
Starlark syntax, replace only the snippet body and any adjacent annotations.
If a card currently advertises a fictional feature, replace its headline and
copy with a supported concept of similar length instead of moving or removing
the card.

For copy style, prefer short claims followed by a grounded sentence. Example
pattern for the landing page:

`Readable graphs.` Netsuke validates YAML, expands Jinja into a static plan,
then hands execution to Ninja.

Do not let df12 voice become theatrical. This is product copy for a build
system, not a manifesto.

## Validation

Before implementation starts, use the reviewed docs to create a before/after
checklist for these questions:

1. Does every page describe the language as YAML plus Jinja?
2. Do all inline manifests use current placeholder syntax and reviewed keys?
3. Do install and getting-started flows avoid unsupported commands?
4. Do examples teach documented features rather than speculative ones?
5. Does the copy stay within existing layout constraints without truncation or
   obvious overflow?

During implementation, validate with at least these commands, capturing logs
with `tee`:

    set -o pipefail
    markdownlint-cli2 "docs/**/*.md" "AGENTS.md" 2>&1 | tee /tmp/markdownlint-netsuke-www-initial-content.out

    set -o pipefail
    nixie 2>&1 | tee /tmp/nixie-netsuke-www-initial-content.out

If additional repo-specific commands are discovered later, add them here before
running them and record the results in `Outcomes & Retrospective`.

## Progress

- [x] 2026-03-09 17:00 GMT: Reviewed the governing documents named by the user
  and sampled the current website content under `netsuke/`.
- [x] 2026-03-09 17:00 GMT: Verified major terminology and product-story drift
  between the reviewed docs and the current prototype pages.
- [x] 2026-03-09 17:00 GMT: Drafted this ExecPlan for the website copy,
  examples, and inline-code overhaul.
- [x] 2026-03-09 17:25 GMT: Approval received; implementation started and the
  plan status moved to `IN PROGRESS`.
- [x] 2026-03-09 17:30 GMT: Built the page-by-page content matrix implicitly
  through the verified drift list and the phased rewrite targets in this plan.
- [x] 2026-03-09 17:35 GMT: Normalized `docs/examples/*` to the reviewed
  manifest syntax and placeholder style.
- [x] 2026-03-09 18:05 GMT: Rewrote the high-traffic product-story pages in
  `netsuke/` without changing layout structure.
- [x] 2026-03-09 18:05 GMT: Rewrote the core docs pages in `netsuke/docs/` to
  align with the reviewed YAML-plus-Jinja design.
- [x] 2026-03-09 18:05 GMT: Rewrote the examples hub and the basic C example
  page to match the normalized examples.
- [x] 2026-03-09 18:15 GMT: Ran the terminology sweep, removed the final drift
  stragglers, and captured gate output under `/tmp/`.
- [x] 2026-03-09 18:15 GMT: Updated this ExecPlan with implementation outcomes
  and retrospective notes.

## Surprises & Discoveries

- 2026-03-09 17:00 GMT: `grepai` is installed, but the `Projects` workspace
  does not currently include `netsuke-www`, and direct semantic search failed
  because the configured Qdrant endpoint on `127.0.0.1:6334` was unavailable.
  Exploration fell back to exact file reads and `rg`.
- 2026-03-09 17:00 GMT: `leta` is not configured for this repository yet, so
  it could not be used for navigation in this turn.
- 2026-03-09 17:00 GMT: Several repository examples still carry outdated
  placeholder syntax (`{ins}` / `{outs}`), so the docs set itself needs minor
  normalization as part of the website alignment work.
- 2026-03-09 17:00 GMT: The prototype site drift is not limited to tone; it
  includes a different language model, different CLI shape, and fictional
  release/version framing.
- 2026-03-09 18:05 GMT: The docs hub and examples pages contained additional
  secondary drift beyond the obvious Starlark references, including Bazel-style
  labels, custom rule APIs, and sandbox claims embedded in side cards and
  related-topic summaries.

## Decision Log

- 2026-03-09 17:00 GMT: Chose to anchor the overhaul to the four reviewed docs
  plus `docs/examples/*`, not to the existing website copy. Reason: the current
  site contradicts those documents in core product-definition areas.
- 2026-03-09 17:00 GMT: Chose to include `docs/examples/*` normalization in the
  overhaul scope. Reason: the user explicitly asked for examples and inline
  code, and the current examples contain syntax drift that would otherwise leak
  back into the site rewrite.
- 2026-03-09 17:00 GMT: Chose to keep the plan at `docs/execplans/initial-content.md`
  because the governing `AGENTS.md` requires the branch-name path
  `docs/execplans/${GIT_BRANCH_NAME##*/}.md`.
- 2026-03-09 18:05 GMT: Chose to replace fictional release content in the blog
  with evergreen design-note style copy instead of leaving a release-shaped
  shell. Reason: the reviewed docs provide architecture and usage guidance but
  do not establish the featured release claims as shipped behaviour.

## Outcomes & Retrospective

Implementation completed in three slices:

- `a1f2f80` normalized the canonical example manifests under `docs/examples/`
  and moved this plan to `IN PROGRESS`.
- `63af7e4` rewrote the main site HTML pages so the prototype consistently
  describes YAML-plus-Jinja manifests compiled to Ninja.
- `d0fa9d7` closes the remaining drift stragglers and finalizes this plan.

Changed files across the overhaul:

- `docs/examples/basic_c.yml`
- `docs/examples/photo_edit.yml`
- `docs/examples/visual_design.yml`
- `docs/examples/website.yml`
- `docs/examples/writing.yml`
- `docs/execplans/initial-content.md`
- `netsuke/index.html`
- `netsuke/install/index.html`
- `netsuke/blog/index.html`
- `netsuke/docs/index.html`
- `netsuke/docs/getting-started/index.html`
- `netsuke/docs/manifest-reference/index.html`
- `netsuke/docs/rules-and-targets/index.html`
- `netsuke/docs/templating-and-standard-library/index.html`
- `netsuke/docs/cli-security-and-configuration/index.html`
- `netsuke/examples/index.html`
- `netsuke/examples/basic-c-application/index.html`
- `netsuke/guides/index.html`
- `netsuke/icon-replacements/index.html`

Validation commands run for the final pass:

    set -o pipefail
    rg -n -e "Starlark|netsuke init|remote cache|remote caching|watch mode" \
      -e "v2\.4\.0|v2\.3\.0|single binary|graph visual|YAML/Starlark" \
      -e "Python-like syntax|hermetic|cc_binary|cc_library|genrule" \
      -e "select\(|@repo//|//src|//app|http_archive|\{ins\}|\{outs\}" \
      netsuke docs/examples | tee /tmp/rg-drift-netsuke-www-initial-content-final.out

    set -o pipefail
    git diff --check 2>&1 | tee /tmp/git-diff-check-netsuke-www-initial-content-final.out

    set -o pipefail
    markdownlint-cli2 docs/execplans/initial-content.md \
      docs/examples/hello-world/README.md 2>&1 | tee \
      /tmp/markdownlint-netsuke-www-initial-content-final.out

    set -o pipefail
    nixie 2>&1 | tee /tmp/nixie-netsuke-www-initial-content-final.out

Additional gate and sweep logs captured earlier in the rollout:

- `/tmp/markdownlint-netsuke-www-initial-content.out`
- `/tmp/markdownlint-netsuke-www-initial-content-file.out`
- `/tmp/markdownlint-netsuke-www-initial-content-examples.out`
- `/tmp/markdownlint-netsuke-www-initial-content-sitepass.out`
- `/tmp/nixie-netsuke-www-initial-content.out`
- `/tmp/nixie-netsuke-www-initial-content-examples.out`
- `/tmp/nixie-netsuke-www-initial-content-sitepass.out`
- `/tmp/git-diff-check-netsuke-www-initial-content-examples.out`
- `/tmp/git-diff-check-netsuke-www-initial-content-sitepass.out`
- `/tmp/rg-drift-netsuke-www-initial-content-sitepass.out`

Unsupported claims intentionally removed rather than preserved:

- fictional release version marketing and release-note claims,
- Starlark/Bazel language and label syntax,
- `netsuke init` onboarding,
- undocumented remote caching, remote execution, watch mode, and sandbox
  guarantees.

Follow-up gaps outside this overhaul:

- The repo still contains many untracked source documents and assets that were
  already present before this work; they were left untouched.
- The repo-wide markdownlint baseline is still red if the large design docs are
  included, because those documents contain pre-existing `MD013` line-length
  violations outside this task’s write set.
