/**
 * Map Git status short symbols to long description
 */
// Human-friendly description of path for use in commit messages.
export const ROOT = 'repo root';

export enum DESCRIPTION {
  ' ' = 'unmodified',
  M = 'modified',
  A = 'added',
  D = 'deleted',
  R = 'renamed',
  C = 'copied',
  U = 'umerged',
  '?' = 'untracked',
  '!' = 'ignored'
}

/** Map git status short symbols to preferred words for commit messages. */
export enum ACTION {
  ' ' = '',
  M = 'update',
  A = 'create',
  D = 'delete',
  R = 'rename',
  C = 'copy'
}
