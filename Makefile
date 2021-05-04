default: install

all: hooks install test

h help:
	@grep '^[a-z]' Makefile


.PHONY: hooks
hooks:
	cd .git/hooks && ln -s -f ../../hooks/pre-push pre-push

install:
	npm install

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

test-quick:
	npx tsc -p .
	npm run test:unit


# Run checks, tag and push then install the tagged version as cleanup.
tag:
	npm version minor
	$(MAKE) ext

# Build and install the extension globally.
e ext:
	npm run lint:check
	npm run ext
