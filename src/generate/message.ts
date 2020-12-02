/**
 * Create a commit message from a string which is formatted as a short git status.
 */
import { ACTION } from '../lib/constants';
import { lookupDiffIndexAction, moveOrRenameFile } from './action';
import { parseDiffIndex } from './parseGitOutput';
import { formatPath } from './paths';

/**
 * Make first letter of a string uppercase.
 *
 * This is no titlecase method in JS. This is fills that gap, but, only care about the first letter,
 * ignoring multiple words. This also doesn't care about downcasing.
 */
function title(value: string) {
  if (!value.length) {
    throw new Error('Cannot have empty string for applying title');
  }
  return `${value[0].toUpperCase()}${value.substring(1)}`;
}

/**
 * Prepare a commit message based on a single file change.
 *
 * A rename can be handled too - it just requires both the paths to be staged so that git collapses
 * D and A to a single R action.
 *
 * The output will be like 'Update foo.txt'.
 *
 * Using the variable name as 'from' is not really descriptive here but the logic works. It's also
 * possible to reverse 'from' and 'to' in `git status` and `git diff-index` output or handle just the
 * parseDiffIndex function to make sure 'to' is always set and 'from' is null if it is not a move.
 */
export function one(line: string) {
  const { x: actionChar, from, to } = parseDiffIndex(line);

  const action = lookupDiffIndexAction(actionChar);
  if (action === ACTION.R) {
    return moveOrRenameFile(from, to);
  }

  const outputPath = formatPath(from);

  return `${title(action)} ${outputPath}`;
}
