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

/** Get the display value for one of the ACTION enum pairs. */
export function lookupDiffIndexAction(x: string): string {
  // Lookup value from enum dynamically without getting a TS error.
  // This was a hack I found - maybe there's a cleaner way that falls back
  // to a null value and not undefiend.
  return (<any>ACTION)[x];
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
