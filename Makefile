NODE := node
NPM := npm
CADDY := caddy

.PHONY: dev check-fmt lint test

dev:
	$(CADDY) file-server --browse --listen :2016

check-fmt:
	$(NODE) scripts/check-format.mjs

lint:
	$(NODE) scripts/lint-site.mjs
	$(NODE) --check netsuke/assets/js/tailwind-config.js
	$(NODE) --check netsuke/assets/js/doc-search.js
	$(NODE) --check scripts/build-site.mjs
	$(NODE) --check scripts/check-format.mjs
	$(NODE) --check scripts/lint-site.mjs
	$(NODE) --check scripts/test-build.mjs

test:
	$(NPM) run build
	$(NODE) scripts/test-build.mjs
