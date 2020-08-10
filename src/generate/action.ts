/**
 * Phrase commit changes in words.
 */

import { splitPath } from './paths';

/** Map git status short symbols to preferred words for commit messages. */
export enum ACTION {
  ' ' = '',
  M = 'update',
  A = 'create',
  D = 'delete',
  R = 'rename',
  C = 'copy'
}

export type DescriptionStrings = keyof typeof ACTION;

export function describeAction(key: DescriptionStrings) {
  return ACTION[key];
}

/**
 * Extract single action from given X and Y actions.
 * 
 * Modified takes preferences over the others. There is no way here to combine update and move.
 */
export function lookupAction(x: string, y: string): string {
  // Lookup value from enum dynamically without getting a TS error.
  const actionX = (<any>ACTION)[x];
  const actionY = (<any>ACTION)[y];

  return actionY === ACTION.M ? actionY : actionX;
}

/**
 * Return statement as old path to new path, using just target directory
 * for new path if the file is not renamed.
 * 
 * New path with always be full, ignoring any common base.
 */
export function pathToPath(oldPath: string, newPath: string): string {
  return `${oldPath} to ${newPath}`;
}

/**
 * Return full message for move and/or renaming a file.
 * 
 * TODO: Update for modified as well.
 */
export function moveRenamePath(oldPath: string, newPath: string): string {
  const oldP = splitPath(oldPath);
  const newP = splitPath(newPath);

  if (oldP.name === newP.name) {
    return `Move ${oldP.name} to ${newP.dir}`;
  }
  if (oldP.dir === newP.dir) {
    return `Rename ${oldP.name} to ${newP.name}`;
  }

  return `Move and rename ${oldP.name} to ${newPath}`;
}
