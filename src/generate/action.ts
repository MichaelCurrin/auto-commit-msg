/**
 * Phrase commit changes in words.
 */
import { splitPath } from './paths';
import { ACTION, ROOT } from './constants';

type DescriptionStrings = keyof typeof ACTION;

export function describeAction(key: DescriptionStrings) {
  return ACTION[key];
}

/**
 * Extract single action from given X and Y actions.
 *
 * This works for git status short output - currently not used.
 * Modified takes preferences over the others. There is no way here to combine update and move.
 */
export function lookupStatusAction(x: string, y: string): string {
  // Lookup value from enum dynamically without getting a TS error.
  const actionX = (<any>ACTION)[x];
  const actionY = (<any>ACTION)[y];

  return actionY === ACTION.M ? actionY : actionX;
}

/** Return ACTION enum for a given string. */
export function lookupDiffIndexAction(x: string) {
  // Lookup value from enum dynamically without getting a TS error.
  // This prevents an error on ACTION[x], because x may not be in.
  // This could return undefined which is caught next.
  const action = (<any>ACTION)[x];

  if (typeof action === 'undefined') {
    throw new Error(`Could not find value in ACTION enum: ${x}`);
  }

  return action;
}

/**
 * Return full message for moving and/or renaming a file.
 *
 * TODO: Update for modified as well, or make a new function.
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
