/**
 * Map Git status short symbols to long description
 */
// Human-friendly description of path for use in commit messages.
export const ROOT = 'repo root';

// Mapping of change description in git status (or diff-index).
// The keys are for --short output.
export enum DESCRIPTION {
  ' ' = 'unmodified',
  M = 'modified',
  A = 'added',
  D = 'deleted',
  R = 'renamed',
  C = 'copied',
  U = 'unmerged',
  '?' = 'untracked',
  '!' = 'ignored'
}

/** 
 * Labels to describe actions in commit messages.
 * 
 * These were setup for this extension, based on GitHub syntax.
 * Note move is included in rename, unless behavior is used to determine a move with
 * different logic.
 */
export enum ACTION {
  M = 'update',
  A = 'create',
  D = 'delete',
  R = 'rename',
  C = 'copy'
}
