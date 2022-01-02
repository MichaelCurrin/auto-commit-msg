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
import { moveOrRenameFromPaths, splitPath, _quoteForSpaces } from "../lib/paths";
import { ActionKeys } from "./action.d";

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

  const from = _quoteForSpaces(oldP.name)

  if (moveDesc === "move") {
    const to = _quoteForSpaces(newP.dirPath)
    msg = `move ${from} to ${to}`;
  } else if (moveDesc === "rename") {
    const to = _quoteForSpaces(newP.name)
    msg = `rename ${from} to ${to}`;
  } else {
    const to = _quoteForSpaces(newP.name)
    const target = newP.dirPath === ROOT ? `${to} at ${ROOT}` : newPath;
    msg = `move and rename ${from} to ${target}`;
  }

  return msg;
}
