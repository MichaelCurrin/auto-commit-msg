/**
 * Message module.
 *
 * Create a commit message using output from a git command.
 */
import { parseDiffIndex } from "../git/parseOutput";
import { ACTION } from "../lib/constants";
import { formatPath } from "../lib/paths";
import { ActionKeys, lookupDiffIndexAction, moveOrRenameFile, reduceActions } from "./action";

/**
 * Convert to titlecase.
 *
 * i.e. Make first letter of a string uppercase and return the new string.
 *
 * This is no titlecase method in JS. This fills that gap, but, only care about the first letter,
 * ignoring multiple words. This also doesn't care about downcasing.
 */
export function _title(value: string) {
  if (!value.length) {
    throw new Error("Cannot have empty string for applying title");
  }
  return `${value[0].toUpperCase()}${value.substring(1)}`;
}

/**
 * Prepare a commit message based on a single changed file.
 *
 * A rename can be handled too - it just requires both the paths to be staged so that git collapses
 * D and A to a single R action.
 *
 * Using the variable name as 'from' is not really descriptive here but the logic works. It's also
 * possible to reverse 'from' and 'to' in `git status` and `git diff-index` output or handle just
 * the parseDiffIndex function to make sure 'to' is always set and 'from' is null if it is not a
 * move.
 *
 * Expects a single line string that came from a git command and returns a value like 'Update
 * foo.txt'.
 */
export function oneChange(line: string) {
  const { x: actionChar, from, to } = parseDiffIndex(line);

  const action = lookupDiffIndexAction(actionChar);
  if (action === ACTION.R) {
    return moveOrRenameFile(from, to);
  }

  const outputPath = formatPath(from);

  return `${_title(action)} ${outputPath}`;
}

/**
 * Prepare a commit message using the names of a few changed files.
 *
 * Expects lines that came from a git command and returns a value like 'Update
 * foo.txt and bar.txt'.
 */
export function namedFiles(lines: string[]) {
  const actions = lines.map(line => line[0]);
  const reducedAction = reduceActions(actions as ActionKeys[]);

  const fileList = "foo.txt and bar.txt";

  if (reducedAction === ACTION.UNKNOWN) {
    return `Various changes to ${fileList}`;
  }

  return `${title(reducedAction)} ${fileList}`;
}
