PUBLISHER_NAME = MichaelCurrin


default: install

all: hooks install test build

h help:
	@grep '^[a-z#]' Makefile


.PHONY: hooks
hooks:
	cd .git/hooks && ln -s -f ../../hooks/pre-push pre-push

install:
	npm install

outdated:
	npm outdated

upgrade:
	npm upgrade

# Upgrade vscode types package and use it to set the engine version.
upgrade-engine:
	npm install @types/vscode@latest
	VS_CODE_VERSION=$$(npm view @types/vscode version) && \
		sed -i "s/\"vscode\": \"\^.*\"/\"vscode\": \"^$$VS_CODE_VERSION\"/" \
			package.json package-lock.json

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
# Build then install in VS Code.
e ext:
	npm run checks
	npm run ext

# Build and install the CLI tools only.
cli:
	npm run cli:install


### Deploy

login:
	npx vsce login $(PUBLISHER_NAME)

# Increment tag, publish to Marketplace, then install globally.
publish-M:
	npx vsce publish major
	npm run ext

publish-m:
	npx vsce publish minor
	npm run ext

publish-b:
	npx vsce publish patch
	npm run ext
