PUBLISHER_NAME = MichaelCurrin


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
	npm run cover:check

q test-quick:
	npx tsc -p .
	npm run test:unit


### Deploy

# Build and install the extension globally.
e ext:
	npm run lint:check
	npm run ext

ls:
	npx vsce ls

# Run checks, tag and push (to GitHub only) then install the tagged version as clean-up.
tag:
	npm version minor
	$(MAKE) ext

login:
	npx vsce login $(PUBLISHER_NAME)

publish:
	npx vsce publish minor
