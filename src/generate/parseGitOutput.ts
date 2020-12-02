/**
 * Parse git status.
 *
 * Convert short git status into elements.
 */

/**
 * Describe a change of a file.
 *
 * The variable names come from git's naming for git status and git diff-index.
 * The `x` and `y` parts are actions like 'M' and they correspond to `from` and `to` respectively. When updating a single file, only `from` is filled. When moving or renaming, then `from` is the old path and `to` is the new path.
 *
 * There can also be percentage value for renaming, such 'R100' which is 100% similar. But we discard any percentage value for the purposes of this project when parsing a line.
 */
export interface FileChanges {
  x: string;
  y: string;
  to: string;
  from: string;
}

/**
 * Parse a line coming from the `git status --short` command.
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
 * Parse a line produced by the `git diff-index` command.
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
