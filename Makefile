default: install

all: hooks install test

h help:
	@grep '^[a-z]' Makefile


.PHONY: hooks
hooks:
	cd .git/hooks && ln -s -f ../../hooks/pre-push pre-push

install:
	npm install


# Note - the linter will not fix formatting issues, but IDE or Prettier can.
l lint:
	npm run lint:fix

# Lint, clean, compile and run unit tests.
t test:
	npm test


# Run tests and then tag and push. Install the tagged version afterwards.
tag:
	npm version minor
	$(MAKE) ext

# Build and install the extension globally.
e ext:
	npm run lint:check
	npm run ext
