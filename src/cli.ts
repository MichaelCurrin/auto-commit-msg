/**
 * CLI module.
 *
 * This is the entry-point for the Auto Commit Message tool when running as an STANDALONE
 * command-line script.
 *
 * This script does NOT interact with VS Code or any Git commands. It just receives text as an
 * argument and prints output to `stdout` for use in a hook flow. Or `stderr` in the case of a
 * message not appropriate for a commit message.
 *
 * See `shell/README.md` docs.
 */
import { generateMsg } from "./prepareCommitMsg";

/**
 * Command-line entry-point.
 *
 * Expect multi-line text from `git diff-index` command as the first item in the shell arguments.
 *
 * Returns a suitable generated commit message as text.
 */
function main(args: string[]) {
  const linesArg = args[0];

  if (typeof linesArg === "undefined") {
    throw new Error("Exactly one argument is required - text from diff-index.");
  }

  const lines = linesArg.split("\n");

  if (!lines.length) {
    throw new Error("No file changes found");
  }

  const msg = generateMsg(lines);
  console.log(msg);
}

const args = process.argv.slice(2);
main(args);
