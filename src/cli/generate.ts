#!/usr/bin/env node
/**
 * CLI module to generate a commit message using given input.
 *
 * This script does not interact with VS Code or Git, it only processes text.
 * This works as a Git hook. See shell/README.md for hook usage.
 *
 * It simply receives text as an argument and prints output to `stdout` for use
 * in a hook flow. Or to `stderr`, in the case of a message not appropriate for
 * a commit message.
 */
import { generateMsg } from "../prepareCommitMsg";

import { shouldShowHelp } from "./utils";

const HELP_TEXT: string = `Usage: auto_commit_msg_generate DIFF_INDEX_OUTPUT

Generate a commit message from given input.

Arguments:
  DIFF_INDEX_OUTPUT   Text output from command like 'git diff-index --name-status HEAD'.

Options:
  --help, -h            Show this help and exit.`;

/**
 * Generate a commit message from Git diff-index output.
 *
 * Parses the provided diff-index output and generates a suitable commit message.
 * Throws an error if no arguments or no changes are found.
 *
 * @param args Command-line arguments. First argument should be the diff-index
 *   output.
 * @throws Error if no arguments provided or no file changes found in the
 *   output.
 */
function main(args: string[]): void {
  if (shouldShowHelp(args)) {
    console.log(HELP_TEXT);
    return;
  }

  if (!args.length) {
    throw new Error(
      "Exactly one argument is required - text output from diff-index command.",
    );
  }

  const linesArg = args[0];
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
