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


fmt-check:
	npm run fmt:check
fmt:
	npm run fmt:fix

l lint:
	npm run lint:fix

t test: fmt lint
	npm run test:coverage
	npm run test:report


# Run tests and then tag and push. Install the tagged version afterwards.
tag:
	npm version minor
	$(MAKE) ext

# Build and install the extension globally.
e ext:
	npm run lint:check
	npm run ext
