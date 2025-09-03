#!/usr/bin/env node
/**
 * CLI module to generate a commit message using given input.
 *
 * This script does not interact with VS Code or Git, it only processes text.
 *
 * It simply receives text as an argument and prints output to `stdout` for use
 * in a hook flow. Or to `stderr`, in the case of a message not appropriate for
 * a commit message.
 */
import { generateMsg } from "../prepareCommitMsg";

const HELP_TEXT: string = `Usage: auto_commit_msg_generate DIFF_INDEX_OUTPUT

Generate a commit message from given input.

Arguments:
  DIFF_INDEX_OUTPUT   Text output from 'git diff-index --name-status HEAD'.

Options:
  --help, -h            Show this help and exit.`;

/**
 * Command-line entry-point.
 *
 * Returns a suitable generated commit message as text.
 */
import { shouldShowHelp } from "./utils";

/**
 * Entry-point for the CLI. Handles help flag and input validation.
 */
function main(args: string[]): void {
  if (shouldShowHelp(args)) {
    console.log(HELP_TEXT);
    return;
  }
  const linesArg = args[0];

  if (typeof linesArg === "undefined") {
    throw new Error(
      "Exactly one argument is required - text output from diff-index command.",
    );
  }

  const lines = linesArg.split("\n");

  if (!lines.length) {
    throw new Error("No file changes found");
  }

  const msg = generateMsg(lines);
  console.log(msg);
}

const args = process.argv.slice(2);
try {
main(args);
} catch (err) {
  const message: string = err instanceof Error ? err.message : String(err);
  console.error(message);
  process.exit(1);
}
