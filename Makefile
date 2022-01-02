PUBLISHER_NAME = MichaelCurrin
INCREMENT ?= minor


default: install

all: hooks install test build

h help:
	@grep '^[a-z]' Makefile


.PHONY: hooks
hooks:
	cd .git/hooks && ln -s -f ../../hooks/pre-push pre-push

install:
	npm install

outdated:
	npm outdated

upgrade:
	npm upgrade


fmt:
	npm run fmt:fix

l lint:
	npm run lint:fix

fix: fmt lint

t test: fix
	npm run cover
	npm run cover:report
	npm run cover:check

q test-quick:
	npx tsc -p .
	npm run test:unit

### Build

.PHONY: build
build:
	npm run build

# Global install.
e ext:
	npm run checks
	npm run ext

### Deploy

login:
	npx vsce login $(PUBLISHER_NAME)

# Increment tag, publish to Marketplace, then install globally.
publish:
	npx vsce publish $(INCREMENT)
	npm run ext

# Tag and push to GitHub, then install globally. Not used so much since
# publishing is set up.
tag:
	npm version $(INCREMENT)
	npm run ext
