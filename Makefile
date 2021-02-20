default: install

all: install test

h help:
	@grep '^[a-z]' Makefile


install:
	npm install


# Note - the linter will not fix formatting issues, but IDE or Prettier can.
l lint:
	npm run lint:fix

# Lint, clean, compile and run unit tests.
t test:
	npm run test


# Run tests and then tag and push.
tag: #ext
	npm version minor
	$(MAKE) ext

# Build and install the extension globally.
e ext:
	npm run ext
