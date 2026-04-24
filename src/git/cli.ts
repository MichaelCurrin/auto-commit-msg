/**
 * Git CLI module.
 *
 * Run Git CLI commands within the extension and capture the text output.
 */
import { exec as _exec } from "child_process";
import * as util from "util";
import { Repository } from "../api/git";

const exec = util.promisify(_exec);

// Ensure Git will show special characters literally without quoting the string
// and escaping characters.
const QUOTE_PATH = '-c "core.quotePath=false"';

const DIFF_INDEX_CMD = "diff-index";
const DIFF_INDEX_OPTIONS = [
  "--name-status",
  "--find-renames",
  "--find-copies",
  "--no-color",
];

// Allow debug messages to be shown (VS Code extension) or hidden (CLI tool).
/**
 * Log debug messages when debugging is enabled via environment variable.
 *
 * @param args Arguments to log.
 */
function debug(...args: unknown[]): void {
  if (process.env.ACM_DEBUG === "1") {
    console.debug(...args);
  }
}

/**
 * Run a `git` subcommand and return the result, with stdout and stderr available.
 *
 * @param cwd The working directory to run the command in.
 * @param subcommand The git subcommand to execute (e.g., 'diff-index').
 * @param options Optional array of command-line options to pass to the subcommand.
 * @returns A promise resolving to the execution result with stdout and stderr.
 */
function _execute(cwd: string, subcommand: string, options: string[] = []) {
  const command = `git ${QUOTE_PATH} ${subcommand} ${options.join(" ")}`;

  debug(`Running command: ${command}, cwd: ${cwd}`);

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
 * no-color flag is added still to be safe.
 *
 * @param repository The repository to run the command in.
 * @param options Optional array of additional git options (e.g., ['--cached']).
 * @returns A promise resolving to an array of non-empty output lines from the
 *   git diff-index command.
 */
async function _diffIndex(
  repository: Repository,
  options: string[] = [],
): Promise<Array<string>> {
  const cwd = repository.rootUri.fsPath;
  const fullOptions = [...DIFF_INDEX_OPTIONS, ...options, "HEAD"];

  const { stdout, stderr } = await _execute(cwd, DIFF_INDEX_CMD, fullOptions);

  if (stderr) {
    debug(`stderr for 'git ${DIFF_INDEX_CMD}' command:`, stderr);
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
 * @param repository The repository to get changes for.
 * @returns A promise resolving to an array of strings describing file changes.
 */
export async function getChanges(repository: Repository) {
  const stagedChanges = await _diffIndex(repository, ["--cached"]);

  if (stagedChanges.length) {
    debug("Found staged changes");

    return stagedChanges;
  }

  debug(
    "Staging area is empty. Using unstaged files (tracked files only still).",
  );

  const allChanges = await _diffIndex(repository);

  if (!allChanges.length) {
    debug("No changes found");
  }
  return allChanges;
}
