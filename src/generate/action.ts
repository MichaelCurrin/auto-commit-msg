/**
 * Phrase commit changes in words.
 */
export enum ACTION {
  ' ' = '',
  M = 'update',
  A = 'create',
  D = 'delete',
  R = 'rename',
  C = 'copy'
}

export function lookupAction(x: string, y: string): string {
  // Lookup value from enum dynamically without getting a TS error.
  const actionX = (<any>ACTION)[x];
  const actionY = (<any>ACTION)[y];

  let result = '';
  if (actionY === ACTION.M) {
    result = actionY;
  } else {
    return actionX;
  }

  return result;
}

export function pathToPath(oldPath: string, newPath: string): string {
  // TODO Check common base dir for move vs rename
  return `${oldPath} to ${newPath}`;
}
