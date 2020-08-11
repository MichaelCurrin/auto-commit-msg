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
    'requirements.txt',
    'Gemfile',
    'Gemfile.lock',
    'package-lock.json',
    'yarn.lock'
  ],
  CONFIG_EXTENSIONS = [ 'yml', 'yaml', 'json', 'toml' ],
  CONFIG_DIRS = [ '.vscode' ],
  CONFIG_NAMES = [
    'package.json',
    '.gitignore',
    '.eslintrc.js', // TODO add other forms
    '.editorconfig',
    '.prettierrc',
    'tsconfig.json',
    'tslint.json'
  ],
  BUILD_NAMES = [ 'Dockerfile', 'docker-compose.yml' ],
  CI_DIRS = [ '.circleci', '.github/workflows' ],
  CI_NAMES = [ 'netlify.toml', 'travis.yml' ];

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
      this.name.includes('.test.') ||
      this.name.includes('.spec.') ||
      this.dir.includes('test/') ||
      this.name.startsWith('test_')
    );
  }

  isCIRelated(): boolean {
    return this.dir in CI_DIRS || this.name in CI_NAMES;
  }

  isConfigRelated(): boolean {
    if (
      path.extname(this.name) in CONFIG_EXTENSIONS ||
      this.dir in CONFIG_DIRS ||
      this.name in CONFIG_NAMES
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

  // TODO: Move to enum
  getType(): string {
    if (this.isCIRelated()) {
      return 'ci';
    }

    if (this.name === 'LICENSE' || this.isPackageRelated() || this.isConfigRelated()) {
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
