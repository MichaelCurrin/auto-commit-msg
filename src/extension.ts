import * as vscode from 'vscode';

import { GitExtension } from './api/git';
import { prepareCommitMsg } from './prepareCommitMsg';

/**
 * Return VS Code's builtin Git extension.
 */
function getGitExtension() {
  const vscodeGit = vscode.extensions.getExtension<GitExtension>('vscode.git');
  const gitExtension = vscodeGit && vscodeGit.exports;

  return gitExtension && gitExtension.getAPI(1);
}

/**
 * Run the autofill command when extension is triggered.
 *
 * This is mostly copied from the git-prefix extension so some flows have not been
 * directly tested.
 */
export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('commitMsg.autofill', async (uri?) => {
    const git = getGitExtension();

    if (!git) {
      vscode.window.showErrorMessage('Unable to load Git Extension');
      return;
    }

    vscode.commands.executeCommand('workbench.view.scm');

    if (uri) {
      // Flow for multiple repos in workspace and selecting just one.

      // FIXME: Unfortunately this seems to only pick up the first repo.
      const selectedRepository = git.repositories.find(repository => {
        return repository.rootUri.path === uri._rootUri.path;
      });

      if (selectedRepository) {
        await prepareCommitMsg(selectedRepository);
      }
    }
    else {
      // One repo in workspace.

      if (git.repositories.length === 0) {
        vscode.window.showErrorMessage(
          'No repos found. Please open a repo or run git init then try this extension again.'
        );
        return;
      }
      if (git.repositories.length > 1) {
        // This flow is unlikely as I haven't experienced it yet, but log anyway just in case,
        // without aborting.
        vscode.window.showWarningMessage('Unable to select a repo as multiple repos are open and none was specified.');
      }
      await prepareCommitMsg(git.repositories[0]);
    }
  });

  context.subscriptions.push(disposable);
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function deactivate() {}
