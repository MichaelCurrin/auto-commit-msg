/**
 * Parse `git` subcommand type defs.
 */

/**
 * Describe changes to a file at a low-level as key-value pairs.
 *
 * The variable names come from git's naming for git status and git diff-index.
 * The `x` and `y` parts are actions like 'M' and they correspond to `from` and
 * `to` respectively. When updating a single file, only `from` is filled. When
 * moving or renaming, then `from` is the old path and `to` is the new path.
 *
 * There can also be percentage value for renaming, such 'R100' which is 100%
 * similar. But we discard any percentage value for the purposes of this project
 * when parsing a line.
 *
 * TODO: Use `ACTION` (fewest compile errors otherwise `keyof typeof ACTION`)
 * for `x` and `y` to enforce 'M' etc. See action.d.ts module. And consider
 * making a second type where the `x` and `y` are ACTION types as `modified`
 * etc. To save using `lookupDiffIndexAction` call in multiple places.
 */
export type FileChange = {
  x: string;
  y: string;
  to: string;
  from: string;
};
