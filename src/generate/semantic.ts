/**
 * Logic around semantic commit messages.
 *
 * This can be used to check if all changes in a commit are related to 'chore' changes, 'docs'
 * changes, 'test' changes and so on.
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
    "pyproject.toml",
    "setup.py",

    // Ruby
    "Gemfile",
    "Gemfile.lock",

    // JavaScript (Exclude package.json since it can be used for metadata and not package changes.)
    "package-lock.json",
    "shrinkwrap.json",
    "yarn.lock",
    ".npmignore",
    ".npmrc",

    // PHP
    "composer.json",
    "composer.lock",

    // GO
    "go.mod",
    "go.sum",

    // RUST
    "Cargo.toml",
    "Cargo.lock",
  ];

// Build system (scripts, configurations or tools) and package dependencies.
const BUILD_NAMES = [
  "Dockerfile",
  "docker-compose.yml",

  "Makefile",
  "Rakefile",

  "package.json", // Not necessarily package-related but always build-related.

  // JAVA
  "gradlew",
  "grailsw",
  "micronaut-cli.yml",
],
  BUILD_EXTENSIONS = [
    ".gemspec", // Ruby installation
    ".bat",
    ".gradle",
  ];

// This may be too broad or clash with other areas such as CI or package unless used close to last
// in the entire flow.
const CONFIG_EXTENSIONS = [
  ".yml",
  ".yaml",
  ".json",
  ".toml",
  ".ini",
  ".cfg", // Python config but also for other systems maybe
],
  CONFIG_DIRS = [
    ".vscode",
  ],
  CONFIG_NAMES = [
    ".gitignore",
    ".editorconfig",

    "setup.cfg",

    "tsconfig.json",
    "tslint.json",
    ".browserslistrc",
    "browserslist",
    "commitlint.config.js",
  ];

const CI_DIRS = [
  ".circleci",
  ".github/workflows",
],
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

// This can be useful for multi-file changes e.g. "Creat 5 scripts"
const SCRIPT_EXTENSIONS = [
  ".html",
  ".css",
  ".scss",

  ".py",

  ".rb",

  ".js",
  ".jsx",
  ".ts",
  ".tsx",

  ".java",
  ".jar",

  ".c",
  ".h",

  ".rs",
  ".go",
],
  // For "Update 5 shell scripts"
  SHELL_SCRIPT_EXTENSION = ".sh";

const LICENSE_NAMES = [
  "LICENSE",
  "LICENSE.txt",
  "License.txt",
  "LICENSE-source",
];

/**
 * Support conventional commit prefix for a given file path.
 *
 * This ignores the action such as create/delete file.
 *
 * For move or rename cases, the input path is assumed to be the `to` path path as that would more
 * useful than knowing the `from` path.
 */
export class Semantic {
  atRoot: boolean;
  dirPath: string;
  name: string;
  extension: string;

  constructor(filePath: string) {
    // TODO It is worth keeping splitPath on its own for separation of concerns, but
    // could it work better as a class? And then semantic can inherit from it.
    // The properties are actually all the same her as there (duplication), only the semantic
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
   * Check if file a doc - for semantic commits.
   *
   * Return true for `.rst`, README files and anything in the docs directory.
   *
   * TODO: For static sites, not all .md files are docs but that could be configured with a global
   * flag. Or recognize Jekyll config.
   */
  isDocRelated(): boolean {
    if (this.extension === ".rst") {
      return true;
    }
    const lowerName = this.name.toLowerCase();

    return lowerName.startsWith("readme")
      || lowerName.startsWith("contributing")
      || lowerName.startsWith("changelog")
      || lowerName.startsWith("releases")
      || this.dirPath.startsWith("docs");
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

  isBuildRelated(): boolean {
    return BUILD_NAMES.includes(this.name) ||
      BUILD_EXTENSIONS.includes(this.extension) ||
      this.isPackageRelated();
  }

  isPackageRelated(): boolean {
    return PACKAGE_NAMES.includes(this.name);
  }

  isLicenseRelated(): boolean {
    return LICENSE_NAMES.includes(this.name);
  }

  isChoreRelated(): boolean {
    return this.isLicenseRelated() || this.isConfigRelated();
  }

  /**
   * Return conventional commit type.
   *
   * If rules can't be used to match a known one, return the unknown form of the enum.
   */
  getType() {
    if (this.isCIRelated()) {
      return CONVENTIONAL_TYPE.CI;
    }
    if (this.isBuildRelated()) {
      return CONVENTIONAL_TYPE.BUILD;
    }
    if (this.isChoreRelated()) {
      return CONVENTIONAL_TYPE.CHORE;
    }
    if (this.isDocRelated()) {
      return CONVENTIONAL_TYPE.DOCS;
    }
    if (this.isTestRelated()) {
      return CONVENTIONAL_TYPE.TEST;
    }

    return CONVENTIONAL_TYPE.UNKNOWN;
  }
}

/**
 * Get the semantic conventional commit type.
 *
 * Relies on both the action type and the path-based logic.
 *
 * Don't handle ACTION.M or ACTION.C as it could be a fix or feature. So just use unknown/null
 * value. Though it could be set as always feature or docs as a general rule or config option on the
 * project level or extension level.
 */
export function getSemanticConvention(action: ACTION, filePath: string): CONVENTIONAL_TYPE {
  if (action === ACTION.R || action === ACTION.D) {
    return CONVENTIONAL_TYPE.CHORE;
  }

  const semantic = new Semantic(filePath);
  const semPathType = semantic.getType();

  if (action === ACTION.A) {
    return semPathType || CONVENTIONAL_TYPE.FEAT;
  }

  return semPathType;
}
