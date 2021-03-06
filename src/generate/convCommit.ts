/**
 * Conventional Commit module.
 *
 * Process file paths and how they changed and generate a type like 'chore' or 'docs'.
 */
import { ACTION, CONVENTIONAL_TYPE } from "../lib/constants";
import { splitPath } from "../lib/paths";

// Package-related can be for 'build'.
const PACKAGE_DIRS = [
    // Rust
    ".cargo",
  ],
  PACKAGE_NAMES = [
    // Python
    "requirements.txt",
    "requirements-dev.txt",
    "dev-requirements.txt",
    "requirements-test.txt",
    "test-requirements.txt",
    "Pipfile",
    // Make Python package installable and manage external packages.
    "pyproject.toml",
    "setup.py",

    // Ruby
    "Gemfile",
    "Gemfile.lock",

    // NPM (Exclude package.json since it can be used for metadata and not package changes.)
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
const BUILD_NAMES = [
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
  ],
  BUILD_EXTENSIONS = [
    // Ruby installation
    ".gemspec",

    // Windows
    ".bat",

    // Java
    ".gradle",
  ];

// This may be too broad or clash with other areas such as CI or package, unless used close to LAST
// in the entire flow.
// Note also that prettier and ESLint configs with various extensions are handled in isConfigRelated
// so don't have to be listed explictly. Though those strings should be moved out of the function.
const CONFIG_EXTENSIONS = [".yml", ".yaml", ".json", ".toml", ".ini", ".cfg"],
  CONFIG_DIRS = [".vscode"],
  CONFIG_NAMES = [
    // Node
    ".npmignore",
    ".npmrc",

    // Git
    ".gitignore",

    // EditorConfig
    ".editorconfig",

    // Python
    "setup.cfg",

    // Node
    ".browserslistrc",
    "browserslist",
    "commitlint.config.js",

    // TypeScript
    "tsconfig.json",
    "tslint.json",

    // Dotenv
    ".env",
    ".env.dev",
    ".env.prod",
    ".env.tempate",
  ];

const CI_DIRS = [".circleci", ".github/workflows"],
  CI_NAMES = [
    "netlify.toml",
    "travis.yml",
    "tox.ini",

    ".vscodeignore",

    "codecov.yml",
    ".codecov.yml",
    ".codeclimate.yml",

    // Zeit
    "now.json",
    ".nowignore",
    "vercel.json",
    ".vercelignore",
  ];

// This can be useful for multi-file changes e.g. "Create 5 scripts"
// It might be easier to leave out this list and assume everything is a script
// unless it is a doc, markdown file or config.
const SCRIPT_EXTENSIONS = [
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
  ],
  // For "Update 5 shell scripts"
  SHELL_SCRIPT_EXTENSION = ".sh";

const LICENSE_NAMES = [
  "LICENSE",
  "LICENSE.txt",
  "License.txt",
  "LICENSE-source",
];

// TODO: Use.
const DOCS_DIRS = [
  "docs",
  ".github/ISSUE_TEMPLATE",
  ".github/PULL_REQUEST_TEMPLATE",
];
// Anything in `/docs` will be covered already so this is for the root and any subdirectories. Don't
// worry about .rst as those are already cover as always docs. While `.md` could be content for a
// static site or docs site.
const DOC_NAMES = [
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

/**
 * Evaluate conventional commit prefix for a given file.
 *
 * This ignores the action such as create/delete file.
 *
 * For move or rename cases, the input path is assumed to be the `to` path path as that would more
 * useful than knowing the `from` path.
 */
export class ConventionalCommit {
  atRoot: boolean;
  dirPath: string;
  name: string;
  extension: string;

  constructor(filePath: string) {
    // TODO It is worth keeping splitPath on its own for separation of concerns, but
    // could it work better as a class? And then conv commit can inherit from it.
    // The properties are actually all the same her as there (duplication), only the conv commit
    // methods get added here as new.
    // Maybe a class is overkill as it is just a container of data.
    // Maybe the {} can be stored an object here. Or maybe combine that and this at the risk
    // of doing too much. But still easy to test attributes vs methods.
    const { atRoot, dirPath, name, extension } = splitPath(filePath);
    this.atRoot = atRoot;
    this.dirPath = dirPath;
    this.name = name;
    this.extension = extension;
  }

  /**
   * Check if doc-related.
   *
   * Return true for `.rst`, README files and anything in the docs directory.
   *
   * TODO: For static sites, not all .md files are docs but that could be configured with a global
   * flag. Or recognize Jekyll config.
   */
  isDocsRelated(): boolean {
    if (this.extension === ".rst") {
      return true;
    }
    const lowerName = this.name.toLowerCase();

    return DOC_NAMES.includes(lowerName) || this.dirPath.startsWith("docs");
  }

  isTestRelated(): boolean {
    const dir = `${this.dirPath}/`;

    return (
      dir.includes("test/") ||
      dir.includes("tests/") ||
      dir.includes("spec/") ||
      dir.startsWith("unit") ||
      this.name.includes(".test.") ||
      this.name.includes(".spec.") ||
      this.name.startsWith("test_") ||
      this.name === ".coveragerc"
    );
  }

  isCIRelated(): boolean {
    // Assume flat structure and don't check for nesting in subdirs of CI_DIRS.
    return CI_DIRS.includes(this.dirPath) || CI_NAMES.includes(this.name);
  }

  // Broadly match eslint configs with any extension e.g. .json or .yml
  // See https://eslint.org/docs/user-guide/configuring
  // Same for prettier configs https://prettier.io/docs/en/configuration.html
  // And tslint* as JSON or YAML and webpack*.
  // See https://github.com/vscode-icons/vscode-icons/blob/master/src/iconsManifest/supportedExtensions.ts
  isConfigRelated(): boolean {
    return (
      CONFIG_EXTENSIONS.includes(this.extension) ||
      CONFIG_DIRS.includes(this.dirPath) ||
      CONFIG_NAMES.includes(this.name) ||
      this.name.includes(".eslintrc") ||
      this.name.includes(".eslintignore") ||
      this.name.includes(".eslintcache") ||
      this.name.includes(".prettier") ||
      this.name.includes("tslint") ||
      this.name.includes("webpack")
    );
  }

  isPackageRelated(): boolean {
    return PACKAGE_NAMES.includes(this.name);
  }

  isBuildRelated(): boolean {
    return (
      BUILD_NAMES.includes(this.name) ||
      BUILD_EXTENSIONS.includes(this.extension)
    );
  }

  isLicenseRelated(): boolean {
    return LICENSE_NAMES.includes(this.name);
  }

  isChoreRelated(): boolean {
    return this.isLicenseRelated() || this.isConfigRelated();
  }

  /**
   * Return Conventional Commit type.
   *
   * Order of checks is important here.
   *
   * Return the unknown/null value if no rule matches.
   */
  getType() {
    if (this.isCIRelated()) {
      return CONVENTIONAL_TYPE.CI;
    }
    if (this.isPackageRelated()) {
      return CONVENTIONAL_TYPE.BUILD_DEPENDENCIES;
    }
    if (this.isBuildRelated()) {
      return CONVENTIONAL_TYPE.BUILD;
    }
    if (this.isChoreRelated()) {
      return CONVENTIONAL_TYPE.CHORE;
    }
    if (this.isDocsRelated()) {
      return CONVENTIONAL_TYPE.DOCS;
    }
    if (this.isTestRelated()) {
      return CONVENTIONAL_TYPE.TEST;
    }

    return CONVENTIONAL_TYPE.UNKNOWN;
  }
}

/**
 * Get the Conventional Commit type.
 *
 * Relies on both the action performed and the path.
 *
 * Don't distinguish `ACTION.M` vs `ACTION.A`, as it could be a fix or feature. So just use
 * unknown/null value. Though it could be set as always feature or docs as a general rule or config
 * option on the project level or extension level.
 */
export function getConventionType(
  action: ACTION,
  filePath: string
): CONVENTIONAL_TYPE {
  if (action === ACTION.R || action === ACTION.D) {
    return CONVENTIONAL_TYPE.CHORE;
  }

  const convCommit = new ConventionalCommit(filePath);
  const commitType = convCommit.getType();

  if (action === ACTION.A) {
    return commitType || CONVENTIONAL_TYPE.FEAT;
  }

  return commitType;
}
