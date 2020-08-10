/**
 * Map Git status short symbols to long description
 */
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
