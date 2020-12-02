/**
 * Parse git command output.
 */
import { FileChanges } from './parseGitOutput.d';

/**
 * Parse a value of one or two filepaths and return as `from`.
 */
function splitStatusPaths(line: string) {
  const paths = line.substring(3);
  const [from, to] = paths.includes('->') ? paths.split(' -> ') : [paths, ''];

  return { from, to };
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
  const { from, to } = splitStatusPaths(line);

  return {
    x,
    y,
    from,
    to,
  };
}

/**
 * Split output from `git diff-index` into `from` and `to`.
 */
function splitDiffIndexPaths(line: string) {
  const segments = line.split(/\s+/),
    from = segments[1];

  if (!from) {
    throw new Error(`Bad input - could not find first filename in line: ${line}`);
  }
  const to = segments.length === 3 ? segments[2] : '';

  return { from, to };
}

/**
 * Parse a line produced by the `git diff-index` command.
 *
 * Unlike `git status`, the `y` value will be missing so we set it to unmodified.
 */
export function parseDiffIndex(line: string): FileChanges {
  if (line.length <= 4) {
    throw new Error(`Input string must be at least 4 characters. Got: '${line}'`);
  }

  const x = line[0];
  const y = ' '; // TODO replace with unmodified from.
  const { from, to } = splitDiffIndexPaths(line);

  return {
    x,
    y,
    from,
    to,
  };
}
