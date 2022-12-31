/**
 * Extension module.
 *
 * This sets up the VS Code extension's command entry-point and applies logic in
 * the prepareCommitMsg module to a target branch.
 */
import * as vscode from "vscode";
import { API, Repository } from "./api/git";
import { makeAndFillCommitMsg } from "./autofill";
import { getGitExtension } from "./gitExtension";

function _validateFoundRepos(git: API) {
  let msg = "";

  if (!git) {
    msg = "Unable to load Git Extension";
  } else if (git.repositories.length === 0) {
    msg =
      "No repos found. Please open a repo or run `git init` then try again.";
  }

  if (msg) {
    vscode.window.showErrorMessage(msg);

    throw new Error(msg);
  }
}

/**
 * Get current repo when using multiples in the workspace (or when using GitLens on a single repo).
 */
async function _handleRepos(
  git: API,
  sourceControl: vscode.SourceControl
): Promise<Repository | undefined> {
  const selectedRepo = git.repositories.find(repository => {
    const uri = sourceControl.rootUri;
    if (!uri) {
      console.warn("rootUri not set for current repo");
      return false;
    }
    const repoPath = repository.rootUri.path;

    return repoPath === uri.path;
  });

  return selectedRepo;
}

/**
 * Return a repo for single repo in the workspace.
 */
async function _handleRepo(git: API): Promise<Repository> {
  return git.repositories[0];
}

/**
 * Choose the relevant repo and apply autofill logic on files there.
 */
async function _chooseRepoForAutofill(sourceControl?: vscode.SourceControl) {
  const git = getGitExtension()!;
  _validateFoundRepos(git);

  vscode.commands.executeCommand("workbench.view.scm");

  const selectedRepo = sourceControl
    ? await _handleRepos(git, sourceControl)
    : await _handleRepo(git);

  if (!selectedRepo) {
    const msg = "No repos found";
    vscode.window.showErrorMessage(msg);
    throw new Error(msg);
  }

  await makeAndFillCommitMsg(selectedRepo);
}

/**
 * Set up the extension activation.
 *
 * The autofill command as configured in `package.json` will be triggered
 * and run the autofill logic for a repo.
 */
export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "commitMsg.autofill",
    _chooseRepoForAutofill
  );

  context.subscriptions.push(disposable);
}

// prettier-ignore
// eslint-disable-next-line @typescript-eslint/no-empty-function
export function deactivate() { }
