# ExecPlan: Responsive Navigation — Mobile Menu & Icon-Only Buttons

## Context

The site's `#navbar` currently hides all navigation links below `lg` (1024px) and shows GitHub/Install as full-text buttons. There is no mobile menu — navigation links simply vanish. This plan adds two responsive tiers:

- **md–lg (768px–1023px):** Nav links visible (pinned right), GitHub + Install collapse to square icon-only buttons.
- **Below md (768px):** Everything collapses behind a hamburger menu with a dropdown pane.

## Big Picture

- One markup structure serves all three tiers (desktop, tablet, mobile)
- Duplicate nav links inside the mobile menu pane (standard industry pattern — reparenting the same DOM nodes between flex-row and dropdown is fragile)
- CSS handles icon-only collapse via `#navbar .hm-navbar-action` selector (specificity 1,1,0 beats Tailwind CDN's 0,1,0)
- Minimal vanilla JS for hamburger toggle, focus trap, Escape/click-outside

## Constraints

- No build-time Tailwind; CDN only — no `@apply`, specificity bumps required
- 18 source files under `netsuke/` contain the navbar
- Commit after each logical change, gate every commit (`git diff --check`, `make check-fmt`, `make lint`, `make test`)

---

## Inventory: 18 Navbar Files

### Group A — Standard pages (12 files, GitHub ghost button)

| Depth | Files | Path prefix |
|-------|-------|-------------|
| 0 | `netsuke/index.html` | (none) |
| 1 | `blog/`, `docs/index.html`, `examples/index.html`, `guides/`, `install/` | `../` |
| 2 | `docs/getting-started/`, `docs/manifest-reference/`, `docs/rules-and-targets/`, `docs/templating-and-standard-library/`, `docs/cli-security-and-configuration/`, `examples/basic-c-application/` | `../../` |

### Group B — Example detail pages (5 files, "Examples" back-arrow ghost button)

All depth-2 under `examples/`: `hello-world/`, `batch-photo-processing/`, `static-site-pipeline/`, `multi-format-documentation/`, `visual-design-assets/`

Ghost button: `<a href="../" ...><span data-icon="carbon:arrow-left"></span> Examples</a>`

### Group C — Design system (1 file)

`design/index.html` — branded "Himotoshi", in-page anchor nav links, uses `md:flex` (not `lg:flex`), GitHub button only (no Install). Needs bespoke treatment.

---

## Breakpoint Behaviour

| Viewport | Nav Links | GitHub | Install | Hamburger |
|----------|-----------|--------|---------|-----------|
| >= 1024px (lg+) | Flex row, centred | Full-text button | Full-text button | Hidden |
| 768–1023px (md–lg) | Flex row, pinned right | Icon-only square | Icon-only square | Hidden |
| < 768px (below md) | Hidden | Hidden | Hidden | Visible |

---

## Implementation Steps

### Step 1 — CSS: Add responsive navbar classes to `himotoshi.css`

New rules to add:

```css
/* Icon-only collapse: md to lg */
@media (min-width: 768px) and (max-width: 1023.98px) {
  #navbar .hm-navbar-action {
    height: 2.25rem;
    justify-content: center;
    padding: 0;
    width: 2.25rem;
  }

  #navbar .hm-navbar-action .hm-navbar-action__label {
    clip-path: inset(50%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    white-space: nowrap;
    width: 1px;
  }

  #navbar .hm-navbar-action .iconify {
    margin: 0;
  }
}

/* Mobile menu pane */
#navbar .hm-mobile-menu {
  background: color-mix(in srgb, var(--netsuke-boxwood-pale) 96%, transparent);
  backdrop-filter: blur(16px);
  border-top: 1px solid color-mix(in srgb, var(--netsuke-stone) 45%, transparent);
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  overflow-y: hidden;
  transition: max-height 300ms ease, opacity 200ms ease;
}

#navbar .hm-mobile-menu.is-open {
  max-height: min(32rem, calc(100vh - 4rem));
  opacity: 1;
  overflow-y: auto;
}

/* Mobile menu link styles */
#navbar .hm-mobile-menu__link { ... }
#navbar .hm-mobile-menu__link:hover { ... }
#navbar .hm-mobile-menu__link--active { border-left: 3px solid vermillion }
#navbar .hm-mobile-menu__link--primary { indigo bg, white text }
```

**Commit gate:** `make check-fmt`, `make lint`

### Step 2 — JS: Create `netsuke/assets/js/mobile-nav.js`

Vanilla JS IIFE:
- Toggle `is-open` / `hidden` classes on `#navbar-mobile-menu`
- Swap hamburger/close icons
- Update `aria-expanded` on toggle button
- Focus first link on open; return focus to toggle on close
- Focus trap (Tab cycles within menu + toggle button)
- Close on Escape key
- Close on click outside `#navbar`
- Close on resize past `md` breakpoint (`matchMedia`)

**Commit gate:** `make lint` (includes `node --check` on new JS file)

### Step 3 — Reference implementation: Update `netsuke/index.html`

Transform the existing navbar from:

```text
Logo | [hidden lg:flex nav links] | [GitHub btn] [Install btn]
```

To:

```text
Logo | [hidden md:flex nav links] | [GitHub .hm-navbar-action] [Install .hm-navbar-action] [hamburger md:hidden]
     | [mobile menu pane (hidden by default)]
```

Key HTML changes:
- Nav links wrapper: `hidden lg:flex` → `hidden md:flex`
- GitHub button: add `hm-navbar-action` class, wrap text in `.hm-navbar-action__label`, change visibility to `hidden md:inline-flex`
- Install button: add `hm-navbar-action` class, add `<span class="iconify" data-icon="carbon:download">` icon, wrap text in `.hm-navbar-action__label`, change visibility to `hidden md:inline-flex`
- Add hamburger `<button>` with `md:hidden`
- Add `<div id="navbar-mobile-menu" class="hm-mobile-menu hidden">` inside `<nav>`, after the `.site-container` div, containing duplicated nav links + GitHub + Install
- Add `<script src="assets/js/mobile-nav.js"></script>` in `<head>`

**Commit gate:** All gates + Playwright visual verification at 1280px, 900px, 375px

### Step 4 — Update Group A depth-1 pages (5 files)

`blog/`, `docs/index.html`, `examples/index.html`, `guides/`, `install/`

Same structural changes as Step 3, with `../` path prefix. Preserve each page's active link indicator.

**Commit gate:** All gates

### Step 5 — Update Group A depth-2 pages (6 files)

`docs/getting-started/`, `docs/manifest-reference/`, `docs/rules-and-targets/`, `docs/templating-and-standard-library/`, `docs/cli-security-and-configuration/`, `examples/basic-c-application/`

Same structural changes, with `../../` path prefix. Preserve active links.

**Commit gate:** All gates

### Step 6 — Update Group B pages (5 example detail pages)

`hello-world/`, `batch-photo-processing/`, `static-site-pipeline/`, `multi-format-documentation/`, `visual-design-assets/`

Same as Group A depth-2, except:
- Ghost button is "Examples" with `carbon:arrow-left` (not GitHub) — still gets `hm-navbar-action` treatment
- Mobile menu pane includes "Back to Examples" link instead of GitHub

**Commit gate:** All gates

### Step 7 — Update Group C (design system page)

`design/index.html` — bespoke treatment:
- Already uses `md:flex` for nav links (keep as-is)
- Icon-only range is `sm`–`md` (not `md`–`lg`) since this page's breakpoint is different
- Only has GitHub button (no Install) — mobile menu omits Install
- Mobile menu contains in-page anchor links (Introduction, Visual Design, Typography, Components, Tokens)

**Commit gate:** All gates

### Step 8 — Final visual QA

Use Playwright MCP at three widths (3-second Tailwind CDN delay each):
- **1280px** — full desktop: text buttons, centred nav links
- **900px** — tablet: icon-only squares, nav links visible and pinned right
- **375px** — mobile: hamburger visible, open menu, verify links and buttons appear

Check all pages: homepage, one docs page, one example detail page, design system page.

---

## Icons (Iconify `carbon:` set, already loaded)

| Element | Icon |
|---------|------|
| Hamburger open | `carbon:menu` |
| Hamburger close | `carbon:close` |
| Install (icon-only) | `carbon:download` |
| GitHub (icon-only) | `carbon:logo-github` (existing) |
| Back to Examples (icon-only) | `carbon:arrow-left` (existing) |

## Key Files

| File | Role |
|------|------|
| `netsuke/assets/css/himotoshi.css` | All new responsive CSS |
| `netsuke/assets/js/mobile-nav.js` | New — hamburger toggle JS |
| `netsuke/index.html` | Reference implementation |
| All 18 navbar files | Structural HTML updates |

## Risks

| Risk | Mitigation |
|------|-----------|
| Tailwind CDN `hidden` class fights JS toggle | JS removes `hidden` then uses `is-open` class; `hidden` is only the initial state |
| `max-height` transition looks choppy | Use a viewport-aware cap plus internal scrolling so short screens stay usable while the animation remains bounded |
| Iconify async icon load delay | Already loaded on all pages; `carbon:download` + `carbon:menu` + `carbon:close` are new but from same set |

## Progress

- [x] Step 1: CSS responsive navbar classes (24d5803)
- [x] Step 2: mobile-nav.js (e1e4369)
- [x] Step 3: Homepage reference implementation (e24ea42)
- [x] Step 4: Group A depth-1 (5 files) (4287e74)
- [x] Step 5: Group A depth-2 (6 files) (ee3c02b)
- [x] Step 6: Group B example detail (5 files) (2ffe0a1)
- [x] Step 7: Group C design system (1 file) (686d820)
- [x] Step 8: Final visual QA (5ff68ca — CSS specificity fix + Playwright verification)

## Lessons Learned

- **CSS specificity vs Tailwind CDN:** `#navbar .class` rules at specificity
  `(1,1,0)` beat Tailwind CDN utility classes at `(0,1,0)`. Similarly, the
  `.hm-button` rule at `(0,1,0)` beats same-specificity Tailwind rules because
  the stylesheet loads later in the cascade. Responsive show/hide logic must
  live in CSS media queries rather than relying on Tailwind utility
  classes like `md:hidden` or `hidden md:inline-flex`.

## Post-Plan Follow-up: Mobile Width Fixes

### Fix 1: Example pages overflow at <460px (08b286c)

CSS Grid `min-width: auto` on `lg:col-span-8` grid children prevented shrinking
below `<pre>` intrinsic width. Fix: `min-w-0` on grid child + `overflow-x: auto`
on `.hm-example-code-block pre`.

### Fix 2: Docs pages overflow at <460px (0283c7d)

Three interacting issues:
1. `.site-container`'s `margin-inline: auto` prevented flex stretch in the body's
   column layout — container sized to content instead of viewport.
2. Grid children with `min-width: auto` expanded beyond track size.
3. Two padding layers (site-container + main) vs one (manifest-reference) required
   targeted padding zeroing via `.site-container > main.hm-docs-content`.

CSS added to `@media (max-width: 459.98px)`:
- `.site-container { width: 100%; margin-inline: 0; }`
- `.site-container > main.hm-docs-content { padding-left: 0; padding-right: 0; }`
- `main.hm-docs-content .grid > * { min-width: 0; }`
- `main.hm-docs-content { overflow-wrap: break-word; }`

**Key insight:** Tailwind CDN injects its `<style>` AFTER the stylesheet in the
DOM (index 3 vs 1). At equal specificity Tailwind wins by source order. Must use
higher specificity (e.g. `main.hm-docs-content` at 0,1,1) to override `px-4`.
