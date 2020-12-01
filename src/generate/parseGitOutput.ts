/**
 * Parse git status.
 *
 * Convert short git status into elements.
 */

export interface FileChanges {
  x: string;
  y: string;
  to: string;
  from: string;
}

/**
 * Parse a line coming from the git status short command.
 */
export function parseStatus(line: string): FileChanges {
  if (line.length <= 4) {
    throw new Error(`Input string must be at least 4 characters. Got: '${line}'`);
  }

  const x = line[0];
  const y = line[1];
  const paths = line.substring(3);

  const [from, to] = paths.includes('->') ? paths.split(' -> ') : [paths, ''];

  return {
    x: x,
    y: y,
    from: from,
    to: to
  };
}

/**
 * Parse a line produced by the git diff-index command.
 *
 * See the git docs for the meaning of `x`, `y`, `from` and `to`.
 *
 * Here we set `y` as the Unmodified symbol and keep it, so we can match the `git status` handling
 * where this function comes from. But this is actually not present in the text and it not used
 * elsewhere in this project.
 *
 * For a rename such as 'R100', discard the percentage similarity.
 */
export function parseDiffIndex(line: string): FileChanges {
  if (line.length <= 4) {
    throw new Error(`Input string must be at least 4 characters. Got: '${line}'`);
  }

  const x = line[0],
    y = ' ';

  const segments = line.split(/\s+/),
    from = segments[1];
  if (!from) {
    throw new Error(`Bad input - could not find first filename in line: ${line}`);
  }
  const to = segments.length === 3 ? segments[2] : '';

  // TODO: Convert to type.
  return {
    x: x,
    y: y,
    from: from,
    to: to
  };
}
