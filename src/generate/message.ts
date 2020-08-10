/**
 * Create a commit message from a string which is formatted as a short git status. 
 */

import { parseStatus } from './parse-git-output';

import { lookupAction, pathToPath } from './action';

// This is no titlecase method in JS. This works, but just for first letter.
function title(value: string) {
  if (!value.length) {
    throw new Error('Cannot have empty string for applying title');
  }
  return `${value[0].toUpperCase()}${value.substring(1)}`;
}

export function one(status: string): string {
  const { x, y, to, from } = parseStatus(status);

  const verb = lookupAction(x, y);
  // TODO Use moveRenamePath.
  const paths = to ? pathToPath(from, to) : from;

  return `${title(verb)} ${paths}`;
}
