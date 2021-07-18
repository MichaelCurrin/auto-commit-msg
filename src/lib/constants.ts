/**
 * Map Git status short symbols to a long description.
 */
// Use file names up to a point and after than using file counts.
export const AGGREGATE_MIN = 5;

// Human-friendly description of path, for use in commit messages.
export const ROOT = "repo root";

/**
 * Mapping of change descriptions.
 *
 * See documentation:
 *   docs/development/advanced/changes.md
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
 * See documentation:
 *   docs/development/advanced/changes.md
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
 * Conventional Commit types.
 *
 * The scope is mixed in here because refactoring a few modules to handle scope alone is too much
 * effort for one use-case.
 *
 See documentation:
 *   docs/manual/conventional-commits.md
 */
export enum CONVENTIONAL_TYPE {
  BUILD = "build",
  BUILD_DEPENDENCIES = "build(deps)",
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
