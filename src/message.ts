import { parseStatus } from './generate/parse-git-status';

import { lookupAction, pathToPath } from './generate/action';

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
  const paths = from ? pathToPath(to, from) : to;

  return `${title(verb)} ${paths}`;
}
