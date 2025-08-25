/**
 * Conventional Commit module.
 *
 * Process file paths and how they changed and generate a type like 'chore' or
 * 'docs'.
 */
import { ACTION, CONVENTIONAL_TYPE } from "../lib/constants";
import { splitPath } from "../lib/paths";
import {
  BUILD_EXTENSIONS,
  BUILD_NAMES,
  CI_DIRS,
  CI_NAMES,
  CONFIG_DIRS,
  CONFIG_EXTENSIONS,
  CONFIG_NAMES,
  DOC_NAMES,
  LICENSE_NAMES,
  PACKAGE_NAMES,
} from "./convCommitConstants";

/**
 * Evaluate conventional commit prefix for a given file.
 *
 * This ignores the action such as create/delete file.
 *
 * For move or rename cases, the input path is assumed to be the `to` path
 * as that would more useful than knowing the `from` path.
 */
export class ConventionalCommit {
  atRoot: boolean;
  dirPath: string;
  name: string;
  extension: string;

  constructor(filePath: string) {
    // TODO It is worth keeping splitPath on its own for separation of concerns,
    // but could it work better as a class? And then conv commit can inherit
    // from it.
    // The properties are actually all the same her as there (duplication), only
    // the conv commit methods get added here as new.
    //
    // Maybe a class is overkill as it is just a container of data.
    // Maybe the {} can be stored an object here. Or maybe combine that and this
    // at the risk of doing too much. But still easy to test attributes vs
    // methods.
    const { atRoot, dirPath, name, extension } = splitPath(filePath);
    this.atRoot = atRoot;
    this.dirPath = dirPath;
    this.name = name;
    this.extension = extension;
  }

  /**
   * Check if doc-related.
   *
   * Return true for `.rst`, README files, and anything in the docs directory.
   *
   * TODO: For static sites, not all `.md` files are docs but that could be
   * configured with a global flag. Or recognize presence of Jekyll config file.
   */
  isDocsRelated(): boolean {
    if (this.extension === ".rst") {
      return true;
    }
    const lowerName = this.name.toLowerCase();

    return DOC_NAMES.includes(lowerName) || this.dirPath.startsWith("docs");
  }

  isTestRelated(): boolean {
    const dir = this.dirPath;
    const name = this.name;
    const segments = dir.split("/");

    // Check for test-related directories at any level.
    const testDirs = [
      "test",
      "tests",
      "spec",
      "unit",
      "unit_tests",
      "__mocks__",
    ];
    if (segments.some(seg => testDirs.includes(seg))) {
      return true;
    }

    // Check for test-related file patterns using regex.
    if (name === ".coveragerc") {
      return true;
    }
    if (
      /^test_.*\.[^.]+$/.test(name) ||
      /^spec_.*\.[^.]+$/.test(name) ||
      /^.*\.test\.[^.]+$/.test(name) ||
      /^.*\.spec\.[^.]+$/.test(name)
    ) {
      return true;
    }

    return false;
  }

  isCIRelated(): boolean {
    // Assume flat structure and don't check for nesting in subdirs of
    // `CI_DIRS`.
    return CI_DIRS.includes(this.dirPath) || CI_NAMES.includes(this.name);
  }

  // Broadly match eslint configs with any extension e.g. `.json` or `.yml`.
  // See https://eslint.org/docs/user-guide/configuring
  // Same for prettier configs https://prettier.io/docs/en/configuration.html
  // And `tslint*` as JSON or YAML and `webpack*`.
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
 * Don't distinguish `ACTION.M` vs `ACTION.A`, as it could be a fix or feature.
 * So just use unknown/null value. Though it could be set as always feature or
 * docs as a general rule or config option on the project level or extension
 * level.
 */
export function getConventionType(
  action: ACTION,
  filePath: string,
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
