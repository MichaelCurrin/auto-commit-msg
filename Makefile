default: install

all: install test

h help:
	@egrep '^\S|^$$' Makefile


install:
	npm install


# Note - the linter will not fix formatting issues, but IDE or Prettier can.
l lint:
	npm run lint:fix

# Lint, clean, compile and run unit tests.
t test:
	npm run test


# Run tests and then tag and push.
tag:
	npm version minor

# Build and install the extension globally.
e ext:
	npm run ext
