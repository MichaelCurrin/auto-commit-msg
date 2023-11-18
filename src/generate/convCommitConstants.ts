/**
 * Conventional Commit constants module.
 */

// Package-related can be for 'build'.
export const PACKAGE_DIRS = [
  // Rust
  ".cargo",
];

export const PACKAGE_NAMES = [
  // Python
  "requirements.txt",
  "requirements-dev.txt",
  "dev-requirements.txt",
  "requirements-test.txt",
  "test-requirements.txt",

  "Pipfile",
  "Pipefile.lock",

  "poetry.toml",
  "poetry.lock",

  // Make Python package installable and manage external packages.
  "pyproject.toml",
  "setup.py",
  "setup.cfg",

  // Ruby
  "Gemfile",
  "Gemfile.lock",

  // NPM (Exclude package.json since it can be used for metadata and not
  // package always changes.)
  "package-lock.json",
  "shrinkwrap.json",
  "yarn.lock",

  // PHP
  "composer.json",
  "composer.lock",

  // Go
  "go.mod",
  "go.sum",

  // Rust
  "Cargo.toml",
  "Cargo.lock",

  // Deno
  "deps.ts",
  "test_deps.ts",
  "dev_deps.ts",
  "import_map.json",
];

// Build system (scripts, configurations or tools) and package dependencies.
export const BUILD_NAMES = [
  // Docker
  ".dockerignore",
  "Dockerfile",
  "docker-compose.yml",

  // Make
  "GNUmakefile",
  "makefile",
  "Makefile",

  // Ruby Rake - based on rake CLI message.
  "rakefile",
  "Rakefile",
  "rakefile.rb",
  "Rakefile.rb",

  "package.json", // Not necessarily package-related but always build-related.

  // Java
  "gradlew",
  "grailsw",
  "micronaut-cli.yml",
];
export const BUILD_EXTENSIONS = [
  // Ruby installation
  ".gemspec",

  // Windows
  ".bat",

  // Java
  ".gradle",
];

// This may be too broad or clash with other areas such as CI or package, unless
// used close to LAST in the entire flow.
// Note also that prettier and ESLint configs with various extensions are
// handled in isConfigRelated so don't have to be listed explictly. Though those
// strings should be moved out of the function.
export const CONFIG_EXTENSIONS = [
  ".yml",
  ".yaml",
  ".json",
  ".toml",
  ".ini",
  ".cfg",
  ".config.js", // e.g. for rollup, jest and commitlint
];
export const CONFIG_DIRS = [".vscode"];
export const CONFIG_NAMES = [
  // Git
  ".gitignore",

  // EditorConfig
  ".editorconfig",

  // Python
  ".pylintrc",
  ".isort.cfg",
  ".flake8",
  "pytest.ini",
  '.coveragerc',
  '.pylintrc',

  // Node
  ".npmignore",
  ".npmrc",
  '.babelrc',
  '.eslintrc',
  ".browserslistrc",
  "browserslist",
  "rollup.config.js",
  'webpack.config.js',
  'npm-shrinkwrap.json',
  "tsconfig.json",
  "tslint.json",

  // Dotenv
  ".env",
  ".env.dev",
  ".env.prod",
  ".env.tempate",
];

export const CI_DIRS = [".circleci", ".github/workflows"];
export const CI_NAMES = [
  "netlify.toml",
  "travis.yml",
  "tox.ini",

  ".vscodeignore",

  "codecov.yml",
  ".codecov.yml",
  ".codeclimate.yml",

  // Zeit / Vercel
  "now.json",
  ".nowignore",
  "vercel.json",
  ".vercelignore",

  'Procfile',
];

// This can be useful for multi-file changes e.g. "Create 5 scripts"
// It might be easier to leave out this list and assume everything is a script
// unless it is a doc, markdown file or config.
export const SCRIPT_EXTENSIONS = [
  ".html",

  ".css",
  ".less",
  ".scss",

  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".mjs",

  ".py",

  ".rb",

  ".java",
  ".jar",

  ".c",
  ".h",

  ".rs",

  ".go",

  ".php",
];
// For "Update 5 shell scripts"
export const SHELL_SCRIPT_EXTENSION = ".sh";

export const LICENSE_NAMES = [
  "LICENSE",
  "LICENSE.txt",
  "License.txt",
  "LICENSE-source",
];

// TODO: Use.
export const DOCS_DIRS = [
  "docs",
  ".github/ISSUE_TEMPLATE",
  ".github/PULL_REQUEST_TEMPLATE",
];

// Anything in `/docs` will be covered already so this is for the root and any
// subdirectories. Don't worry about .rst as those are already cover as always
// docs. While `.md` could be content for a static site or docs site.
export const DOC_NAMES = [
  "README",
  "README.md",
  "README.txt",

  "installation.md",
  "usage.md",
  "development.md",
  "deploy.md",

  // GitHub docs.
  "SECURITY.md",
  "CONTRIBUTING.md",
  "CHANGELOG.md",
  "RELEASES.md",
  "FUNDING.md",
  "PULL_REQUEST_TEMPLATE.md",
  "ISSUE_TEMPLATE.md",
  "CODE_OF_CONDUCT.md",

  "MAINTAINERS.txt",
  "CODEOWNERS",

  // Images.
  "sample.png",
  "sample-1.png",
  "sample-2.png",
  "screenshot.png",
  "preview.png",
].map(name => name.toLowerCase());
