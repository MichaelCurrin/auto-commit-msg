/**
 * Logic around semantic commit messages.
 *
 * This can be used to check if all changes in a commit are related
 * to 'chore' changes, 'docs' changes, 'test' changes and so on.
 */
import { splitPath } from './paths';
import { ACTION, CONVENTIONAL_TYPE } from './constants';

// Exclude package* files here for JS since those can be related to packages and sometimes to other metadata.
const PACKAGE_NAMES = [
    'dev-requirements.txt',
    'test-requirements.txt',
    'requirements.txt',
    'Gemfile',
    'Gemfile.lock',
    'package-lock.json',
    'yarn.lock'
  ],
  // This can be useful for multi-file changes e.g. "Creat 5 scripts"
  SCRIPT_EXTENSIONS = [
    '.py',
    '.rb',
    '.js',
    '.ts',
    '.tsx',
    '.rs',
    '.go'
  ],
  // For "Update 5 shell scripts"
  SHELL_SCRIPT_EXTENSION = '.sh',
  LICENSE_NAMES = [
    'LICENSE',
    'LICENSE.txt',
    'License.txt'
  ],
  // This may be too broad or clash with other areas such as CI or
  // package unless used close to last in the entire flow.
  CONFIG_EXTENSIONS = [
    '.yml',
    '.yaml',
    '.json',
    '.toml',
    '.ini',
    '.cfg'
  ],
  CONFIG_DIRS = [
    '.vscode'
  ],
  CONFIG_NAMES = [
    'Makefile',
    'setup.py',
    'package.json',
    '.gitignore',
    '.editorconfig',
    'tsconfig.json',
    'tslint.json'
  ],
  BUILD_NAMES = [
    'Dockerfile',
    'docker-compose.yml'
  ],
  CI_DIRS = [
    '.circleci',
    '.github/workflows'
  ],
  CI_NAMES = [
    'netlify.toml',
    'travis.yml',
    '.vscodeignore'
  ];

/**
 * Support conventional commit prefix for a given file path.
 *
 * This ignores the action such as create file.
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
   * For static sites, not all .md files are docs. But everything in docs directory is,
   * except perhaps for config files.
   */
  isDocRelated(): boolean {
    return this.name === 'README.md' || this.dirPath.startsWith('docs');
  }

  isTestRelated(): boolean {
    return (
      this.dirPath.includes('test/') ||
      this.name.includes('.test.') ||
      this.name.includes('.spec.') ||
      this.name.startsWith('test_') ||
      this.name === '.coveragerc'
    );
  }

  isCIRelated(): boolean {
    // Assume flat structure and don't check for nesting in subdirs of CI_DIRS.
    return CI_DIRS.includes(this.dirPath) || CI_NAMES.includes(this.name);
  }

  // Broadly match eslint configs https://eslint.org/docs/user-guide/configuring
  // And prettier configs https://prettier.io/docs/en/configuration.html
  isConfigRelated(): boolean {
    if (
      CONFIG_EXTENSIONS.includes(this.extension) ||
      CONFIG_DIRS.includes(this.dirPath) ||
      CONFIG_NAMES.includes(this.name) ||
      this.name.includes('.eslintrc') ||
      this.name.includes('.prettier')
    ) {
      return true;
    }
    return false;
  }

  isPackageRelated(): boolean {
    if (PACKAGE_NAMES.includes(this.name)) {
      return true;
    }
    return false;
  }

  isLicenseRelated() {
    return LICENSE_NAMES.includes(this.name);
  }

  getType() {
    if (this.isCIRelated()) {
      return CONVENTIONAL_TYPE.CI;
    }
    if (this.isLicenseRelated() || this.isPackageRelated() || this.isConfigRelated()) {
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
 * Don't handle ACTION.M or ACTION.C as it could be a fix or feature. So just use unknown/null value.
 */
export function getSemanticConvention(action: ACTION, filePath: string): CONVENTIONAL_TYPE {
  const semantic = new Semantic(filePath);

  if (
    action in
    [
      ACTION.R,
      ACTION.D
    ]
  ) {
    return CONVENTIONAL_TYPE.CHORE;
  }

  const semPathType = semantic.getType();
  if (action === ACTION.A) {
    return semPathType || CONVENTIONAL_TYPE.FEAT;
  }

  return semPathType;
}
