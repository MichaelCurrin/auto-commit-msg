/**
 * Git CLI module.
 *
 * Run `git` commands in the shell internally and capture the output.
 */
import util = require("util");
import childProcess = require("child_process");

import { getWorkspaceFolder } from "../workspace";

const exec = util.promisify(childProcess.exec);

/**
 * Run a given `git` command and return output.
 */
function execute(cwd: string, subcommand: string, options: string[] = []) {
  const command = `git ${subcommand} ${options.join(" ")}`;

  return exec(command, { cwd });
}

/**
 * Run `git diff-index` with given flags and return output.
 *
 * This will return both staged and unstaged changes. Pass '--cached' to use staged changes only.
 * Always excludes untracked files.
 *
 * Empty lines will be dropped - because of no changes or just the way the command-line data comes
 * in or got split.
 *
 * The output already seems to never have color info, from my testing, but the no-color flagged is
 * added still to be safe.
 */
async function diffIndex(options: string[] = []): Promise<Array<string>> {
  const fullOptions = [
    "--name-status",
    "--find-renames",
    "--find-copies",
    "--no-color",
    ...options,
    "HEAD",
  ];
  const { stdout, stderr } = await execute(
    getWorkspaceFolder(),
    "diff-index",
    fullOptions
  );

  if (stderr) {
    console.debug("stderror for `git diff-index` command:", stderr);
  }

  const lines = stdout.split("\n");

  return lines.filter((line) => line !== "");
}

/**
 * List files changed and how they changed.
 *
 * Look for diff description of staged files, otherwise fall back to all files.
 * Always excludes untracked files - make sure to stage a file so it becomes tracked, especially
 * in the case of a rename.
 *
 * Returns an array of strings, coming from the `diffIndex` function.
 */
export async function getChanges() {
  const stagedChanges = await diffIndex(["--cached"]);
  if (stagedChanges.length) {
    console.debug("Found staged changes");

    return stagedChanges;
  }

  console.debug(
    "Staging area is empty. Using unstaged files (tracked files only still)."
  );

  const allChanges = await diffIndex();
  if (!allChanges.length) {
    console.debug("No changes found");
  }
  return allChanges;
}

/**
 * Run git status short and return output.
 *
 * Ignore untracked and remove color.
 *
 * UNUSED - This was used before diffIndex was introduced to this project.
 */
async function status(options: string[] = []) {
  return execute(getWorkspaceFolder(), "status", [
    "--short",
    "-uno",
    "--porcelain",
    ...options,
  ]);
}
