/**
 * Logic around semantic commit messages.
 * 
 * This can be used to check if all changes in a commit are related
 * to 'chore' changes, 'docs' changes, 'test' changes and so on.
 */
import { splitPath } from './paths';

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
  SCRIPT_EXTENSIONS = [ '.py', '.rb', '.js', '.ts', '.tsx', '.rs', '.go' ],
  // For "Update 5 shell scripts"
  SHELL_SCRIPT_EXTENSION = '.sh',
  LICENSE_NAMES = [ 'LICENSE', 'LICENSE.txt', 'License.txt' ],
  // This may be too broad or clash with other areas such as CI or
  // package unless used close to last in the entire flow.
  CONFIG_EXTENSIONS = [ '.yml', '.yaml', '.json', '.toml', '.ini', '.cfg' ],
  CONFIG_DIRS = [ '.vscode' ],
  CONFIG_NAMES = [
    'Makefile',
    'setup.py',
    'package.json',
    '.gitignore',
    '.editorconfig',
    'tsconfig.json',
    'tslint.json'
  ],
  BUILD_NAMES = [ 'Dockerfile', 'docker-compose.yml' ],
  CI_DIRS = [ '.circleci', '.github/workflows' ],
  CI_NAMES = [ 'netlify.toml', 'travis.yml', '.vscodeignore' ];

/**
 * Support conventional commit message for a given file path.
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
    return this.dirPath in CI_DIRS || this.name in CI_NAMES;
  }

  // Broadly match eslint configs https://eslint.org/docs/user-guide/configuring
  // And prettier configs https://prettier.io/docs/en/configuration.html
  isConfigRelated(): boolean {
    if (
      this.extension in CONFIG_EXTENSIONS ||
      this.dirPath in CONFIG_DIRS ||
      this.name in CONFIG_NAMES ||
      this.name.includes('.eslintrc') ||
      this.name.includes('.prettier')
    ) {
      return true;
    }
    return false;
  }

  isPackageRelated(): boolean {
    if (this.name in PACKAGE_NAMES) {
      return true;
    }
    return false;
  }

  isLicenseRelated() {
    return this.name in LICENSE_NAMES;
  }

  // TODO: Move values to enum and reference here e.g. SEMANTIC.CI
  getType(): string {
    if (this.isCIRelated()) {
      return 'ci';
    }
    if (this.isLicenseRelated() || this.isPackageRelated() || this.isConfigRelated()) {
      return 'chore';
    }
    if (this.isDocRelated()) {
      return 'docs';
    }
    if (this.isTestRelated()) {
      return 'test';
    }

    return '';
  }
}
