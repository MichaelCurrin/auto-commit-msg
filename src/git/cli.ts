/**
 * Git CLI module.
 *
 * Run Git CLI commands within the extension and capture the text output.
 */
import { exec as _exec } from "child_process";
import * as util from "util";
import { Repository } from "../api/git";

const exec = util.promisify(_exec);

/**
 * Run a `git` subcommand and return the result, with stdout and stderr available.
 */
function _execute(cwd: string, subcommand: string, options: string[] = []) {
  const command = `git -c 'core.quotePath=false' ${subcommand} ${options.join(" ")}`;

  console.debug(`Running command: ${command}, cwd: ${cwd}`);

  return exec(command, { cwd });
}

/**
 * Run `git diff-index` with given flags and return the output.
 *
 * This will return both staged and unstaged changes. Pass '--cached' in
 * `options` param to use staged changes only. Always excludes untracked files.
 *
 * Empty lines will be dropped, because of no changes or just the way the
 * command-line data comes in or got split.
 *
 * The output already seems to never have color info, from testing, but the
 * no-color flagged is added still to be safe.
 */
async function _diffIndex(
  repository: Repository,
  options: string[] = [],
): Promise<Array<string>> {
  const cwd = repository.rootUri.fsPath;
  const cmd = "diff-index";
  const fullOptions = [
    "--name-status",
    "--find-renames",
    "--find-copies",
    "--no-color",
    ...options,
    "HEAD",
  ];

  const { stdout, stderr } = await _execute(cwd, cmd, fullOptions);

  if (stderr) {
    console.debug(`stderr for 'git ${cmd}' command:`, stderr);
  }

  const lines = stdout.split("\n");

  return lines.filter(line => line !== "");
}

/**
 * List files changed and how they changed.
 *
 * Look for diff description of staged files, otherwise fall back to all files.
 * Always excludes untracked files - make sure to stage a file so it becomes
 * tracked, especially in the case of a rename.
 *
 * Returns an array of strings.
 */
export async function getChanges(repository: Repository) {
  const stagedChanges = await _diffIndex(repository, ["--cached"]);

  if (stagedChanges.length) {
    console.debug("Found staged changes");

    return stagedChanges;
  }

  console.debug(
    "Staging area is empty. Using unstaged files (tracked files only still).",
  );

  const allChanges = await _diffIndex(repository);

  if (!allChanges.length) {
    console.debug("No changes found");
  }
  return allChanges;
}
