/**
 * Parse output module.
 *
 * Handle text output from a `git` subcommand.
 */
import { FileChanges } from "./parseOutput.d";

// This is not worth moving to constants because the space is a value while the DESCRIPTION enum has
// it as a key.
const UNMODIFIED = " ";

/**
 * Parse status.
 *
 * Parse a line produced by the `git status --short` command.
 */
export function parseStatus(line: string): FileChanges {
  if (line.length <= 4) {
    throw new Error(
      `Input string must be at least 4 characters. Got: '${line}'`
    );
  }
  const x = line[0];
  const y = line[1];

  const paths = line.substring(3);
  const [from, to] = paths.includes("->") ? paths.split(" -> ") : [paths, ""];

  return {
    x,
    y,
    from,
    to,
  };
}

/**
 * Parse diff index.
 *
 * Parse a line produced by the `git diff-index` command.
 *
 * We keep `x` as a single letter here, even though the input might be include a percentage that we
 * ignore, as in 'R100 ...'.
 *
 * Unlike for `git status`, the `y` value will be missing here so we set it to Unmodified (a space).
 *
 * The `to` field will not always be set so null string is fine (and better than undefined).
 */
export function parseDiffIndex(line: string): FileChanges {
  if (line.length <= 4) {
    throw new Error(
      `Invalid input. Input string must be at least 4 characters. Got: '${line}'`
    );
  }
  const x = line[0];
  const y = UNMODIFIED;

  const [_, from, to] = line.split(/\s+/);
  if (!from) {
    // Unlikely in real life but this helps in development.
    throw new Error(`Invalid input - could not find 'from' path: ${line}`);
  }

  return {
    x,
    y,
    from,
    to: to ?? "",
  };
}
