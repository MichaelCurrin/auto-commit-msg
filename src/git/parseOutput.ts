/**
 * Parse Git output module.
 *
 * Parse text output created by Git subcommands.
 */
import { FileChange } from "./parseOutput.d";

// This is NOT worth moving to constants, because this space is a value, while
// the `DESCRIPTION` enum has it as a key.
const UNMODIFIED = " ";

const GIT_STATUS_SPLIT = " -> ";

/**
 * Parse Git status output.
 *
 * Parse a line which was produced by the `git status --short` command.
 */
export function parseStatus(line: string): FileChange {
  if (line.length < 4) {
    throw new Error(
      `Input string must be at least 4 characters. Got: '${line}'`,
    );
  }
  const x = line[0];
  const y = line[1];

  const paths = line.substring(3);
  const [from, to] = paths.includes(GIT_STATUS_SPLIT)
    ? paths.split(GIT_STATUS_SPLIT)
    : [paths, ""];

  return {
    x,
    y,
    from,
    to,
  };
}

/**
 * Parse Git diff index subcommand output.
 *
 * Expect a line produced by the `git diff-index` subcommand and parse it into
 * an object describing the file changes.
 *
 * We keep `x` as a single letter here, even though the input might be include a
 * percentage that we ignore, as in 'R100 ...'.
 *
 * Unlike for `git status`, the `y` value will be missing here, so we set it to
 * Unmodified (a space).
 *
 * The `to` field will not always be set, so a null string is fine (and better
 * than `undefined`).
 */
export function parseDiffIndex(line: string): FileChange {
  if (line.length < 4) {
    const errorMsg = `Invalid input. Input string must be at least 4 characters. Got: '${line}'`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
  const x = line[0];
  const y = UNMODIFIED;

  const [_, from, to] = line.split("\t");
  if (!from) {
    // Unlikely in real life, but this helps in development.
    throw new Error(`Invalid input - could not find 'from' path: ${line}`);
  }

  return {
    x,
    y,
    from,
    to: to ?? "",
  };
}
