NODE := node
NPM := npm
CADDY := caddy

.PHONY: dev check-fmt fmt lint spelling test

TYPOS_VERSION ?= 1.48.0
TYPOS := uv tool run typos@$(TYPOS_VERSION)

MDLINT ?= $(shell command -v markdownlint-cli2 2>/dev/null || printf '%s' "$$HOME/.bun/bin/markdownlint-cli2")
# `make fmt` and `make check-fmt` call mdtablefix directly. `--git` selects the
# Markdown files Git tracks and `--include-untracked` adds the untracked files
# Git does not ignore, so a new document is formatted before it is staged.
# Both modes need mdtablefix 0.6.0 or later; CI pins the version at the
# install-mdtablefix step.
MDTABLEFIX ?= mdtablefix
MDTABLEFIX_SELECT = --git --include-untracked
MDTABLEFIX_RULES = --wrap --renumber --breaks --ellipsis --fences

dev:
	$(CADDY) file-server --browse --listen :2016

fmt:
	$(MDTABLEFIX) --in-place $(MDTABLEFIX_SELECT) $(MDTABLEFIX_RULES)
	$(MDLINT) --fix "**/*.md"

check-fmt:
	$(NODE) scripts/check-format.mjs
	$(MDTABLEFIX) --check $(MDTABLEFIX_SELECT) $(MDTABLEFIX_RULES)

lint:
	$(NODE) scripts/lint-site.mjs
	$(NODE) --check netsuke/assets/js/tailwind-config.js
	$(NODE) --check netsuke/assets/js/doc-search.js
	$(NODE) --check netsuke/assets/js/mobile-nav.js
	$(NODE) --check scripts/build-site.mjs
	$(NODE) --check scripts/check-format.mjs
	$(NODE) --check scripts/lint-site.mjs
	$(NODE) --check scripts/test-build.mjs

test:
	$(NPM) run build
	$(NODE) scripts/test-build.mjs

spelling: ## Enforce en-GB-oxendict spelling in Markdown prose
	uv run scripts/generate_typos_config.py
	find . -type f -name '*.md' -not -path './node_modules/*' -print0 | \
		xargs -0 -r $(TYPOS) --config typos.toml --force-exclude
