/**
 * Parse `git` subcommand type defs.
 */

/**
 * Describe changes to a file at a low-level.
 *
 * The variable names come from git's naming for git status and git diff-index. The `x` and `y`
 * parts are actions like 'M' and they correspond to `from` and `to` respectively. When updating a
 * single file, only `from` is filled. When moving or renaming, then `from` is the old path and `to`
 * is the new path.
 *
 * There can also be percentage value for renaming, such 'R100' which is 100% similar. But we
 * discard any percentage value for the purposes of this project when parsing a line.
 */
// TODO convert x and y to ACTION types.
export interface FileChanges {
  x: string;
  y: string;
  to: string;
  from: string;
}
