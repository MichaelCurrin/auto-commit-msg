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
import { splitPath } from "../lib/paths";

export type ActionKeys = keyof typeof ACTION;

/**
 * Extract single action from given X and Y actions.
 *
 * NOT USED. But keep for future use with git status short output.
 *
 * "Modified" must take preference over the others. There is no way here to combine update and move.
 */
export function lookupStatusAction(x: string, y: string): string {
  if (ACTION[y as ActionKeys] === ACTION.M) {
    return ACTION.M;
  }
  return ACTION[x as ActionKeys];
}

/**
 * Lookup the action for a given key (single character).
 */
export function lookupDiffIndexAction(x: string) {
  return ACTION[x as ActionKeys];
}

/**
 * Return full message for moving and/or renaming a file.
 *
 * TODO: Update to handle case modified as well, or make a new function.
 */
export function moveOrRenameFile(oldPath: string, newPath: string): string {
  const oldP = splitPath(oldPath),
    newP = splitPath(newPath);

  let msg;

  if (oldP.name === newP.name) {
    msg = `Move ${oldP.name} to ${newP.dirPath}`;
  } else if (oldP.dirPath === newP.dirPath) {
    msg = `Rename ${oldP.name} to ${newP.name}`;
  } else {
    const target = newP.dirPath === ROOT ? `${newP.name} at ${ROOT}` : newPath;
    msg = `Move and rename ${oldP.name} to ${target}`;
  }

  return msg;
}
