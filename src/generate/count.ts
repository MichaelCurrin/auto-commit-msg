/**
 * Count module.
 *
 * Rather than dealing with individual file names, this module deals with grouping files by actions
 * and showing a count for each.
 *
 * e.g. 'create 5 files' (in different directories).
 * e.g. 'update 3 files in foo' (highest common directory).
 * e.g. 'update 16 files and delete 2 files'
 */

import { FileChanges } from "../git/parseOutput.d";
import { ACTION } from "../lib/constants";
import { moveOrRenameFromPaths, splitPath, _join } from "../lib/paths";
import { FileChangesByAction } from "./count.d";

/**
 * Determine if a file change is for move, rename, or both.
 */
export function _moveOrRenameFromChange(item: FileChanges): string {
  if (item.x !== ACTION.R) {
    return item.x;
  }

  const oldP = splitPath(item.from);
  const newP = splitPath(item.to);

  return moveOrRenameFromPaths(oldP, newP);
}

/**
 * Group changes by action and add counts within each.
 */
export function _countByAction(changes: FileChanges[]) {
  const result: FileChangesByAction = {};

  for (const item of changes) {
    const action: string = _moveOrRenameFromChange(item);

    result[action] = result[action] || { fileCount: 0 };
    result[action].fileCount++;
  }

  return result;
}

export function _pluralS(count: number) {
  return count === 1 ? "" : "s";
}

/**
 * Return a human-readable message a single action and count value.
 *
 * Anything works for action - it is not enforced to be one of ACTION or the MoveOrRename type.
 */
export function _formatOne(action: string, count: number) {
  return `${action} ${count} file${_pluralS(count)}`;
}

/**
 * Return full human-readable message using all actions and counts.
 */
export function _formatAll(actionCounts: FileChangesByAction) {
  const msgs = Object.entries(actionCounts).map(pair => {
    const [action, values] = pair;
    return _formatOne(action, values.fileCount);
  });

  return _join(msgs);
}
