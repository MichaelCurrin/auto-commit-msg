/**
 * Phrase commit changes in words.
 */

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

export function lookupAction(x: string, y: string): string {
  // Lookup value from enum dynamically without getting a TS error.
  const actionX = (<any>ACTION)[x];
  const actionY = (<any>ACTION)[y];

  return actionY === ACTION.M ? actionY : actionX;
}

export function pathToPath(oldPath: string, newPath: string): string {
  // TODO Check common base dir for move vs rename
  return `${oldPath} to ${newPath}`;
}
