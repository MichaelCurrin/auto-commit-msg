/**
 * Map Git status short symbols to long description
 */
// Human-friendly description of path for use in commit messages.
export const ROOT = "repo root";

// Mapping of change description in git status (or diff-index).
// The keys are for --short output.
export enum DESCRIPTION {
  " " = "unmodified",
  M = "modified",
  A = "added",
  D = "deleted",
  R = "renamed",
  C = "copied",
  U = "unmerged",
  "?" = "untracked",
  "!" = "ignored"
}

/**
 * Labels to describe actions in commit message sentences.
 *
 * These were setup for this extension, based on GitHub syntax.
 * Note move is included in rename, unless behavior is used to determine a move with
 * different logic.
 */
export enum ACTION {
  M = "update",
  A = "create",
  D = "delete",
  R = "rename",
  C = "copy"
}

/**
 * Based on <type> from conventional commits specification.
 *
 * e.g. 'feat: Add foo'
 *
 * See ConventionalCommits homepage:
 *    https://www.conventionalcommits.org
 * See the `commitlint` repo, which is linked from there:
 *    https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional#type-enum
 */
export enum CONVENTIONAL_TYPE {
  BUILD = "build",
  CI = "ci",
  CHORE = "chore",
  DOCS = "docs",
  FEAT = "feat",
  FIX = "fix",
  PERF = "perf",
  REFACTOR = "refactor",
  REVERT = "revert",
  STYLE = "style",
  TEST = "test",
  UNKNOWN = ""
}
