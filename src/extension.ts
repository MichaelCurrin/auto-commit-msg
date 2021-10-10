/**
 * Extension module.
 *
 * This sets up the VS Code extension's command entry-point and applies logic in
 * the prepareCommitMsg module to a target branch.
 */
import * as vscode from "vscode";
import { TextDocument } from "vscode";
import { API } from "./api/git";
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
 * Run autofill against one of multiples in the workspace.
 *
 * This is a rare flow.
 */
async function _handleRepos(git: API, uri: any) {
  // FIXME: Unfortunately this seems to only pick up the first repo and not find
  // second, etc.
  const selectedRepository = git.repositories.find(repository => {
    console.debug({ uri, _rootUri: uri._rootUri });
    if (!uri._rootUri) {
      console.warn("_rootUri not set");
    }
    return repository.rootUri.path === uri._rootUri.path;
  });

  if (selectedRepository) {
    await makeAndFillCommitMsg(selectedRepository);
  } else {
    vscode.window.showErrorMessage("No repos found");
  }
}

/**
 * Run autofill flow for a single repo in the workspace.
 */
async function _handleRepo(git: API) {
  const targetRepo = git.repositories[0];
  await makeAndFillCommitMsg(targetRepo);
}

/**
 * Choose the relevant repo and apply autofill logic on files there.
 */
async function _chooseRepoForAutofill(uri?: vscode.Uri) {
  const git = getGitExtension()!;
  _validateFoundRepos(git);

  vscode.commands.executeCommand("workbench.view.scm");

  if (uri) {
    _handleRepos(git, uri);
  } else {
    _handleRepo(git);
  }
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
  context.subscriptions.push(
    vscode.workspace.onDidSaveTextDocument((e: TextDocument) => {
      vscode.window.showInformationMessage(
        `Generating commit message because file was saved - ${e.fileName}`
      );
      _chooseRepoForAutofill();
    })
  );
}

// prettier-ignore
// eslint-disable-next-line @typescript-eslint/no-empty-function
export function deactivate() { }
