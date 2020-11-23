default: install

h help:
	@egrep '^\S|^$$' Makefile

i install:
	npm install

# Lint, clean, compile and run unit tests.
t test:
	npm run test

# Note - will not fix formatting issues.
l lint:
	npm run lint:fix


# Run tests and then tag and push.
tag:
	npm version minor


# Build and install extension globally.
b build:
	npm run ext
