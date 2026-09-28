# Netsuke Website Agent Guidance

## Scope

This repository contains a prototype design for a website that will later be
incorporated into a larger site.

## Source of Truth

- `netsuke/` is the source of truth for the website content, structure, classes,
  imagery, and CSS.
- Treat any deployment output as secondary to `netsuke/`.

## Current Priorities

Until the prototype is folded into the full site, focus on getting these parts
correct:

- CSS
- copy
- imagery
- semantic HTML
- semantic class names

## What Not to Optimize Yet

Do not invest effort in build automation, build pipeline work, or large-scale
refactoring for this prototype. That work will be handled later by the CMS
pipeline used by the full site.

## Deployment Context

Deployment to GitHub Pages is temporary. It exists only so the prototype can be
shared before it is incorporated into the larger website.

## Makefile Targets

Use the `Makefile` as the primary entry point for repository checks.

- `make dev`
  - Runs `caddy file-server --browse --listen :2016`.
  - Starts the local preview server on port `2016` for manual browsing.
  - Do not invoke it unless the user explicitly requests starting the preview
    server; the normal workflow is for the user to run Caddy.
- `make check-fmt`
  - Runs `node scripts/check-format.mjs`.
  - Verifies whitespace, trailing-newline, and related formatting hygiene for
    the checked-in site files.
  - Then runs `mdtablefix --check --git --include-untracked --wrap --renumber
    --breaks --ellipsis --fences` over the Markdown Git tracks, plus untracked
    Markdown Git does not ignore. Install mdtablefix 0.6.0 or later with
    `cargo binstall --no-confirm mdtablefix@0.6.0` (or
    `cargo install --locked mdtablefix@0.6.0`).
- `make fmt`
  - Rewrites Markdown with `mdtablefix --in-place` using the same selection and
    rules, then runs `markdownlint-cli2 --fix "**/*.md"`.
  - `.markdownlint-cli2.jsonc` carries the estate's canonical markdownlint
    configuration; CI lints Markdown with the pinned
    `DavidAnson/markdownlint-cli2-action` in `markdownlint.yml`.
- `make lint`
  - Runs `node scripts/lint-site.mjs`.
  - Verifies site links and fragments across the HTML source files.
  - Also runs `node --check` against the repository JavaScript files and build
    scripts to catch syntax errors.
- `make test`
  - Runs `npm run build` to regenerate `dist/`.
  - Then runs `node scripts/test-build.mjs` as a smoke test over the generated
    site output.
- `make spelling`
  - Refreshes the shared en-GB-oxendict dictionary only when its published
    source is newer, regenerates `typos.toml`, and checks Markdown prose.
  - Put narrow repository-only exceptions in `typos.local.toml`; do not edit
    the generated configuration by hand.

For commit gating in this repository, run `git diff --check`, `make check-fmt`,
`make lint`, and `make test`, using `tee` logs under `/tmp/` as described in
the root agent instructions.

## Preview Workflow

- The user will start a `caddy file-server` instance on port `2016` when a live
  preview is needed.
- Do not attempt to start Caddy yourself.
- When using Playwright for previewing, point it at the existing server on port
  `2016`.

## CSS Debugging

The `css-view` command is available for debugging. It produces a JSON dump of
the computed and de-duped CSS cascade for the site. See the `$css-view` skill.

## Imagery

Use the `$nanobanana` skill for generation of non-SVG imagery.
