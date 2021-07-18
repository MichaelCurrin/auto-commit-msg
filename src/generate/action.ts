/**
 * Action module.
 *
 * Phrase commit changes in words.
 *
 * This follows the git style of using `x` and `y`. See this project's docs for more info. Note that
 * `first` and `second` are not appropriate names as `git status` and `git diff-index` behave
 * differently.
 */
import { ACTION, ROOT } from "../lib/constants";
import { moveOrRenameFromPaths, splitPath } from "../lib/paths";
import { ActionKeys } from "./action.d";

/**
 * Extract single action from given X and Y actions.
 *
 * UNUSED.
 *
 * Keep for future use with `git status` short output if needed.
 *
 * "Modified" must take preference over the others. Unfortunately, there is no way here to combine
 * update and move.
 */
function _lookupStatusAction(x: string, y: string): string {
  if (ACTION[y as ActionKeys] === ACTION.M) {
    return ACTION.M;
  }
  return ACTION[x as ActionKeys];
}

/**
 * Lookup the action (e.g. 'modified') for a given key (e.g. 'M').
 */
export function lookupDiffIndexAction(x: string): ACTION {
  const action = ACTION[x as ActionKeys];

  if (typeof action === "undefined") {
    throw new Error(`Unknown ACTION key: ${x}`);
  }

  return action;
}

/**
 * Return full message for moving and/or renaming a file.
 */
export function moveOrRenameMsg(oldPath: string, newPath: string): string {
  const oldP = splitPath(oldPath),
    newP = splitPath(newPath);

  const moveDesc = moveOrRenameFromPaths(oldP, newP);

  let msg;

  if (moveDesc === "move") {
    msg = `move ${oldP.name} to ${newP.dirPath}`;
  } else if (moveDesc === "rename") {
    msg = `rename ${oldP.name} to ${newP.name}`;
  } else {
    const target = newP.dirPath === ROOT ? `${newP.name} at ${ROOT}` : newPath;
    msg = `move and rename ${oldP.name} to ${target}`;
  }

  return msg;
}
