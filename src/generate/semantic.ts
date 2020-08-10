import { splitPath } from './paths';

/**
 * Logic around semantic commit messages.
 * 
 * This can be used to check if all changes in a commit are related
 * to 'chore' changes, 'docs' changes, 'test' changes and so on.
 */
const PACKAGE_RELATED = [
  'dev-requirements.txt',
  'requirements.txt',
  'Gemfile',
  'Gemfile.lock',
  'package.json',
  'package-lock.json'
];

export class Semantic {
  filepath: string;
  dir: string;
  name: string;

  constructor(filepath: string) {
    this.filepath = filepath;
    const { dir, name } = splitPath(filepath);
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
    return this.name === 'README.md' || this.filepath.startsWith('docs');
  }

  isTestRelated(): boolean {
    return (
      this.name.includes('.test.') ||
      this.filepath.includes('test/') ||
      this.name.startsWith('test_')
    );
  }

  isPackageRelated(): boolean {
    if (this.name in PACKAGE_RELATED) {
      return true;
    }
    return false;
  }
}
