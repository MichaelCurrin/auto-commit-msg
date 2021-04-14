/**
 * Map Git status short symbols to long description
 */
// Human-friendly description of path for use in commit messages.
export const ROOT = "repo root";

/**
 * Mapping of change description.
 *
 * Based on the git docs for using `git status` or `git diff-index`. The keys are for `--short`
 * output. The values are the human-readable values from the standard long output.
 *
 * I've never seen 'copied' in real life I don't think but it is included anyway for completeness.
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
  "!" = "ignored"
}

/**
 * Describe actions in commit message sentences.
 *
 * These are based on GitHub syntax as in DESCRIPTION above. But in the active voice here and they
 * will be used for the message for the extension output.
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
  UNKNOWN = ""
}

/**
 * Conventional commits mapping.
 *
 * Based on `<type>` from the conventional commits specification.
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
