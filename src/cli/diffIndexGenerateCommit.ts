#!/usr/bin/env node
/**
 * Git commit AutoCommitMsg script - to generate a commit message and commit it.
 */
import { execFileSync } from "child_process";
import { generateCommitMessage } from "./diffIndexGenerate";
import { shouldShowHelp } from "./utils";

const HELP_TEXT: string = `Usage: gacm [--dry-run] [--no-edit|-n] [--help|-h]

Check Git changes, generate a commit message, and run Git commit.

As with standard git commit behavior, staged files will be used if there are any,
then it falls back to unstaged files (like \`git commit .\`) and as per standard
git behavior the untracked files will be ignored.

Options:
  --help, -h      Show this help and exit.
  --dry-run       Do not commit, just print what would be sent to git commit.
  --no-edit -n    Do not edit the commit message manually - commit directly.
`;

/**
 * Command-line entry-point.
 */
async function main(argv: string[]): Promise<void> {
  if (shouldShowHelp(argv)) {
    console.log(HELP_TEXT);
    return;
  }

  const dryRun: boolean = argv.includes("--dry-run");
  const noEdit: boolean = argv.includes("--no-edit") || argv.includes("-n");

  // Note that this should to be escaped/quoted. Even though it looks weird in
  // the dry-run output, it works correctly (otherwise quotes appear in the
  // commit message).
  const msg = await generateCommitMessage();
  const commitArgs: string[] = ["commit", "-m", msg];
  if (!noEdit) {
    commitArgs.push("--edit");
  }

  let command: string;
  let args: string[];

  if (dryRun) {
    command = "echo";
    args = ["git", ...commitArgs];
  } else {
    command = "git";
    args = commitArgs;
  }

  try {
    execFileSync(command, args, { stdio: "inherit" });
  } catch (err: unknown) {
    // Retry current directory for unstaged files. Note passing specific paths
    // here does not make sense as it wouldn't match the message generation
    // logic.
    execFileSync("git", [...commitArgs, "."], { stdio: "inherit" });
  }
}

if (require.main === module) {
  main(process.argv.slice(2)).catch((err: unknown) => {
    const message: string = err instanceof Error ? err.message : String(err);
    console.error(`Error: ${message}`);
    process.exit(1);
  });
}
