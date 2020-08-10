/**
 * Logic around semantic commit messages.
 */

/**
 * Check if file a doc - for semantic commits.
 *
 * For static sites, not all .md files are docs. But everything in docs directory is,
 * except perhaps for config files.
 */
export function isDoc(filepath: string): boolean {
  return filepath === 'README.md' || filepath.startsWith('docs');
}
