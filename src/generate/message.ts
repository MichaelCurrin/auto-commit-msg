/**
 * Create a commit message from a string which is formatted as a short git status.
 */
import * as path from 'path';
import { lookupDiffIndexAction, moveOrRenameFile } from './action';
import { ACTION } from './constants';
import { parseDiffIndex } from './parse-git-output';

/**
 * This is no titlecase method in JS. This is fills that gap,
 * but only care about the first letter, ignoring multiple words.
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
 * A rename can be handled, it just requires both the paths to be staged
 * so that git collapses D and A to a single R action.
 */
export function one(line: string): string {
  const { x, from, to } = parseDiffIndex(line);

  const action = lookupDiffIndexAction(x);
  if (action === ACTION.R) {
    // `to` will be set because it is a rename.
    return moveOrRenameFile(from, to);
  }

  // Stringify the action to get 'Update' etc.
  // from is not really descriptive here but the logic works.
  // It's also possible to reverse from and to in git status and git diff-index output
  // or handle just the parseDiffIndex function to make sure to is always set and from
  // is null if it is not a move.
  return `${title(action)} ${path.basename(from)}`;
}
