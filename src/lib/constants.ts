/**
 * Map Git status short symbols to a long description.
 */
// Human-friendly description of path,  for use in commit messages.
export const ROOT = "repo root";

/**
 * Mapping of change descriptions.
 *
 * Based on the git docs for using `git status` or `git diff-index`. The keys are for `--short`
 * output. The values are the human-readable values from the standard long output.
 *
 * I've never noticed 'copied' in real life, but it is included anyway for completeness.
 */
export enum DESCRIPTION {
  " " = "unmodified",
  M = "modified",
  A = "added",
  D = "deleted",
  R = "renamed",
  C = "copied",
  U = "unmerged",
  "?" = "untracked",
  "!" = "ignored",
}

/**
 * Describe actions in commit message sentences.
 *
 * These are based on GitHub syntax as in DESCRIPTION above, except the values are in the active
 * voice and not past tense, to fit the conventional commit style. Plus 'update' is used as a more
 * natural word than 'modify'.
 *
 * Note that 'move' will be included in 'rename', unless behavior is used later in this project to
 * determine a move with different logic.
 */
export enum ACTION {
  M = "update",
  A = "create",
  D = "delete",
  R = "rename",
  C = "copy",
  UNKNOWN = "",
}

/**
 * Conventional commit types.
 *
 * See convention-commits.md doc for more info.
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
  UNKNOWN = "",
}
