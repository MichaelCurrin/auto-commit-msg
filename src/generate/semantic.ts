/**
 * Logic around semantic commit messages.
 * 
 * This can be used to check if all changes in a commit are related
 * to 'chore' changes, 'docs' changes, 'test' changes and so on.
 */
import * as path from 'path';

import { splitPath } from './paths';

// Exclude package* files here for JS since those can be related to packages and sometimes to other metadata.
const PACKAGE_RELATED = [ 'dev-requirements.txt', 'requirements.txt', 'Gemfile', 'Gemfile.lock' ],
  CONFIG_EXTENSIONS = [ 'yml', 'yaml', 'json', 'toml' ],
  CONFIG_NAMES = [
    'package.json',
    'package-lock.json',
    '.gitignore',
    '.eslintrc.js',
    '.editorconfig',
    '.prettierrc',
    'tsconfig.json',
    'tslint.json'
  ],
  CI_RELATED = [ 'netlify.toml' ];

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
    return this.dir === '.github/workflows' || this.name in CI_RELATED;
  }

  isConfigRelated(): boolean {
    if (
      path.extname(this.name) in CONFIG_EXTENSIONS ||
      this.name in CONFIG_NAMES ||
      this.dir.startsWith('.vscode')
    ) {
      return true;
    }
    return false;
  }

  isPackageRelated(): boolean {
    if (this.name in PACKAGE_RELATED) {
      return true;
    }
    return false;
  }

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
