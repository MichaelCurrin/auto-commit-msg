/**
 * Logic around semantic commit messages.
 * 
 * This can be used to check if all changes in a commit are related
 * to 'chore' changes, 'docs' changes, 'test' changes and so on.
 */
import * as path from 'path';

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
  LICENSE_NAMES = [ 'LICENSE', 'LICENSE.txt' ],
  // This may be too broad or clash with other areas such as CI or package unless used close to last in the entire flow.
  CONFIG_EXTENSIONS = [ 'yml', 'yaml', 'json', 'toml', 'ini', 'cfg' ],
  CONFIG_DIRS = [ '.vscode' ],
  CONFIG_NAMES = [
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
  dir: string;
  name: string;

  constructor(filePath: string) {
    const { dir, name } = splitPath(filePath);
    this.dir = dir;
    this.name = name;
  }

  /**
   * Check if file a doc - for semantic commits.
   *
   * For static sites, not all .md files are docs. But everything in docs directory is,
   * except perhaps for config files.
   */
  isDocRelated(): boolean {
    return this.name === 'README.md' || this.dir.startsWith('docs');
  }

  isTestRelated(): boolean {
    return (
      this.dir.includes('test/') ||
      this.name.includes('.test.') ||
      this.name.includes('.spec.') ||
      this.name.startsWith('test_') ||
      this.name === '.coveragerc'
    );
  }

  isCIRelated(): boolean {
    return this.dir in CI_DIRS || this.name in CI_NAMES;
  }
  
  // Broadly match eslint configs https://eslint.org/docs/user-guide/configuring
  // And prettier configs https://prettier.io/docs/en/configuration.html
  isConfigRelated(): boolean {
    if (
      path.extname(this.name) in CONFIG_EXTENSIONS ||
      this.dir in CONFIG_DIRS ||
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

  // TODO: Move to enum
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
