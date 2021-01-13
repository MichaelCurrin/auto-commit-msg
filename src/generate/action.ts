/**
 * Phrase commit changes in words.
 */
import { ACTION, ROOT } from "../lib/constants";
import { splitPath } from "../lib/paths";

type ActionKeys = keyof typeof ACTION;

/**
 * Extract single action from given X and Y actions.
 *
 * NOT USED.
 *
 * This works for git status short output.
 *
 * "Modified" takes preferences over the others. There is no way here to combine update and move.
 */
export function lookupStatusAction(x: string, y: string): string {
  if (ACTION[y as ActionKeys] === ACTION.M) {
    return ACTION.M;
  }
  return ACTION[x as ActionKeys];
}

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
  }
  else if (oldP.dirPath === newP.dirPath) {
    msg = `Rename ${oldP.name} to ${newP.name}`;
  }
  else {
    const target = newP.dirPath === ROOT ? `${newP.name} at ${ROOT}` : newPath;
    msg = `Move and rename ${oldP.name} to ${target}`;
  }

  return msg;
}
