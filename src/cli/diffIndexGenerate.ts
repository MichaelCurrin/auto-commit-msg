#!/usr/bin/env node
/**
 * AutoCommitMsg CLI scirpt.
 *
 * Mirrors the behavior of `shell/acm.sh` in TypeScript.
 */
import { execFileSync } from "child_process";
import { generateMsg } from "../prepareCommitMsg";
import { shouldShowHelp } from "./utils";

/**
 * CLI usage help text.
 */
const HELP_TEXT: string = `Usage: acm [--cached] [--help|-h]

Check Git changes and generate a commit message.

Options:
  --cached        Use only staged changes (equivalent to git --cached).
  --help, -h      Show this help and exit.`;

/**
 * Run `git diff-index` and return its stdout as a string.
 *
 * TODO: Use _diffIndex instead after refactoring for flags.
 * @param useCached When true, include only staged changes using `--cached`.
 *
 * @returns output Diff output from git.
 */
function runGitDiff(useCached: boolean): string {
  const flags: string[] = [
    "diff-index",
    "--name-status",
    "--find-renames",
    "--find-copies",
    "--no-color",
  ];

  if (useCached) {
    flags.push("--cached");
  }

  flags.push("HEAD");

  const output: string = execFileSync("git", flags, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });

  return output.trim();
}

/**
 * Generate a commit message from the current repository diff.
 *
 * @param useCached When true, include only staged changes using `--cached`.
 * @returns Generated commit message text.
 */
export function generateCommitMessage(useCached: boolean): string {
  const diffOutput: string = runGitDiff(useCached);
  if (!diffOutput) {
    throw new Error("No file changes found");
  }

  const lines: string[] = diffOutput.split("\n");
  return generateMsg(lines);
}

/**
 * Command-line entry-point.
 *
 * Accepts an optional `--cached` flag to use staged changes only.
 * Prints the generated commit message to stdout.
 */
function main(argv: string[]): void {
  if (shouldShowHelp(argv)) {
    console.log(HELP_TEXT);
    return;
  }
  const useCached: boolean = argv.includes("--cached");
  const msg: string = generateCommitMessage(useCached);
  console.log(msg);
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
