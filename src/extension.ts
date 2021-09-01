/**
 * Extension module.
 *
 * This sets up the extension's command entry point and applies the prepare commit message module to
 * a target branch.
 */
import * as vscode from "vscode";
import { API } from "./api/git";
import { makeAndFillCommitMsg } from "./autofill";
import { getGitExtension } from "./gitExtension";

/**
 * Flow for multiple repos in workspace and selecting just one. This is a rare flow.
 */
async function handleRepos(git: API, uri: any) {
  // FIXME: Unfortunately this seems to only pick up the first repo and not find second etc.
  const selectedRepository = git.repositories.find(repository => {
    return repository.rootUri.path === uri._rootUri.path;
  });

  if (selectedRepository) {
    await makeAndFillCommitMsg(selectedRepository);
  } else {
    vscode.window.showErrorMessage("No repos found");
  }
}

/**
 * Flow for a single or zero repos in the workspace.
 */
async function handleRepo(git: API) {
  const targetRepo = git.repositories[0];
  await makeAndFillCommitMsg(targetRepo);
}

/**
 * Setup this extension's autofill command to run when triggered.
 */
export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "commitMsg.autofill",
    async (uri?) => {
      const git = getGitExtension();

      if (!git) {
        vscode.window.showErrorMessage("Unable to load Git Extension");
        return;
      }

      if (git.repositories.length === 0) {
        vscode.window.showErrorMessage(
          "No repos found. Please open a repo or run git init then try this extension again."
        );
        return;
      }

      vscode.commands.executeCommand("workbench.view.scm");

      if (uri) {
        handleRepos(git, uri);
      } else {
        handleRepo(git);
      }
    }
  );

  context.subscriptions.push(disposable);
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function deactivate() {}
