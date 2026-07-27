NODE := node
NPM := npm
CADDY := caddy

.PHONY: dev check-fmt fmt lint spelling test

TYPOS_VERSION ?= 1.48.0
TYPOS := uv tool run typos@$(TYPOS_VERSION)

dev:
	$(CADDY) file-server --browse --listen :2016

fmt:
	mdformat-all

check-fmt:
	$(NODE) scripts/check-format.mjs

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
