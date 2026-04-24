#!/usr/bin/env node
/**
 * AutoCommitMsg CLI script - to check Git changes and generate a commit message.
 */
import { execFileSync } from "child_process";
import { Repository } from "../api/git";
import { getChanges } from "../git/cli";
import { NO_LINES_MSG } from "../lib/constants";
import { generateMsg } from "../prepareCommitMsg";
import { shouldShowHelp } from "./utils";

const HELP_TEXT: string = `Usage: acm [--help|-h]

Check Git changes and output a generated commit message.

Options:
  --help, -h      Show this help and exit.
  --verbose       Show debug output for this run.
`;

function _getCurrentRepository(): Repository {
  return {
    rootUri: {
      fsPath: execFileSync("git", ["rev-parse", "--show-toplevel"], {
        encoding: "utf8",
      }).trim(),
    },
  } as Repository;
}

/**
 * Generate a commit message from the current repository diff.
 *
 * @returns Generated commit message text.
 */
export async function generateCommitMessage(): Promise<string> {
  const repo = _getCurrentRepository();
  const fileChanges: string[] = await getChanges(repo);
  if (!fileChanges.length) {
    // todo how to handle elegantly at next level here and other script
    throw new Error(NO_LINES_MSG);
  }

  return generateMsg(fileChanges);
}

/**
 * Command-line entry-point.
 *
 * Prints the generated commit message to stdout.
 */
async function main(argv: string[]): Promise<void> {
  if (shouldShowHelp(argv)) {
    console.log(HELP_TEXT);
    return;
  }

  const verbose: boolean = argv.includes("--verbose");
  if (verbose) {
    process.env.ACM_DEBUG = "1";
  }

  const msg: string = await generateCommitMessage();
  console.log(msg);
}

if (require.main === module) {
  main(process.argv.slice(2)).catch((err: unknown) => {
    const message: string = err instanceof Error ? err.message : String(err);
    console.error(`Error: ${message}`);
    process.exit(1);
  });
}
