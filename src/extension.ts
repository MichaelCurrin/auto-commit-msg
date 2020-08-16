import * as vscode from 'vscode';

import { GitExtension } from './api/git';
import { prepareCommitMsg } from './prepareCommitMsg';

/**
 * Return the VS Code builtin Git extension.
 */
function getGitExtension() {
  const vscodeGit = vscode.extensions.getExtension<GitExtension>('vscode.git');
  const gitExtension = vscodeGit && vscodeGit.exports;

  return gitExtension && gitExtension.getAPI(1);
}

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('commitMsg.autofill', async (uri?) => {
    const git = getGitExtension();

    if (!git) {
      vscode.window.showErrorMessage('Unable to load Git Extension');
      return;
    }

    vscode.commands.executeCommand('workbench.view.scm');

    if (uri) {
      const selectedRepository = git.repositories.find(repository => {
        return repository.rootUri.path === uri._rootUri.path;
      });

      if (selectedRepository) {
        await prepareCommitMsg(selectedRepository);
      }
    }
    else {
      if (git.repositories.length === 0) {
        vscode.window.showErrorMessage('No repos found');
        return;
      }
      // Behavior for multiple repos is not implemented yet. Just handle one.
      if (git.repositories.length > 1) {
        vscode.window.showWarningMessage('This extension is only intended to work for one repo - taking the first');
      }

      prepareCommitMsg(git.repositories[0]);
    }
  });

  context.subscriptions.push(disposable);
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function deactivate() {}
