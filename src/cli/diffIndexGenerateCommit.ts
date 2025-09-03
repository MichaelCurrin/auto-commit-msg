#!/usr/bin/env node
/**
 * Git commit AutoCommitMsg script.
 *
 * Wrapper around acm.ts to generate a message and commit it in edit mode.
 */
import { execFileSync } from "child_process";
import { generateCommitMessage } from "./diffIndexGenerate";
import { shouldShowHelp } from "./utils";

/**
 * CLI usage help text.
 */
const HELP_TEXT: string = `Usage: gacm [--cached] [--help|-h]

Check Git changes, generate a commit message, and run Git commit.

Options:
  --cached        Use only staged changes (equivalent to git --cached).
  --help, -h      Show this help and exit.`;

/**
 * Command-line entry-point.
 */
function main(argv: string[]): void {
  if (shouldShowHelp(argv)) {
    console.log(HELP_TEXT);
    return;
  }

  const useCached: boolean = argv.includes("--cached");
  const passthrough: string[] = argv.filter(
    (arg: string) => arg !== "--cached",
  );

  const msg: string = generateCommitMessage(useCached);

  const commitArgs: string[] = ["commit", "--edit", "-m", msg, ...passthrough];
  execFileSync("git", commitArgs, { stdio: "inherit" });
}

if (require.main === module) {
  try {
  main(process.argv.slice(2));
  } catch (err) {
    const message: string = err instanceof Error ? err.message : String(err);
    console.error(`Error: ${message}`);
    process.exit(1);
  }
}
