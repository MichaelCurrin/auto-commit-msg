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
 * This works for git status short output.
 * Modified takes preferences over the others. There is no way here to combine update and move.
 */
export function lookupStatusAction(x: string, y: string): string {
  // Lookup value from enum dynamically without getting a TS error.
  const actionX = (<any>ACTION)[x];
  const actionY = (<any>ACTION)[y];

  return actionY === ACTION.M ? actionY : actionX;
}

export function lookupDiffIndexAction(x: string): string {
  // Lookup value from enum dynamically without getting a TS error.
  // This was a hack I found - maybe there's a cleaner way that falls back
  // to a null value and not undefiend.
  return (<any>ACTION)[x];
}

/**
 * Return full message for move and/or renaming a file.
 * 
 * TODO: Update for modified as well or make a new function.
 */
export function moveRenamePath(oldPath: string, newPath: string): string {
  const oldP = splitPath(oldPath),
    newP = splitPath(newPath);

  if (oldP.name === newP.name) {
    const target = newP.dirPath;
    return `Move ${oldP.name} to ${target}`;
  }
  if (oldP.dirPath === newP.dirPath) {
    const target = newP.name;
    return `Rename ${oldP.name} to ${target}`;
  }

  const target = newP.dirPath === ROOT ? `${newP.name} at ${ROOT}` : newPath;
  return `Move and rename ${oldP.name} to ${target}`;
}
