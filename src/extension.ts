import * as vscode from 'vscode';

import { GitExtension, Repository } from './api/git';
import { Git } from './gitCommands';

function getGitExtension() {
  const vscodeGit = vscode.extensions.getExtension<GitExtension>('vscode.git');
  const gitExtension = vscodeGit && vscodeGit.exports;

  return gitExtension && gitExtension.getAPI(1);
}

// Based on prefixCommit from git-prefix extension. This is the core logic from there
// and where the message is added for this repo.
// TODO break into functions
async function prepareCommitMsg(repository: Repository) {
  const originalMessage = repository.inputBox.value;

  const diffIndexLines = await Git.getChanges();

  if (diffIndexLines.length) {
    // Only support one line for now
    const result = diffIndexLines[0];
    repository.inputBox.value = result;
  } else {
    vscode.window.showErrorMessage('No message to set');
  }
}

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    'gitPrefix.setMessage',
    async (uri?) => {
      const git = getGitExtension();

      if (!git) {
        vscode.window.showErrorMessage('Unable to load Git Extension');
        return;
      }

      vscode.commands.executeCommand('workbench.view.scm');

      if (uri) {
        const selectedRepository = git.repositories.find((repository) => {
          return repository.rootUri.path === uri._rootUri.path;
        });

        if (selectedRepository) {
          await prepareCommitMsg(selectedRepository);
        }
      } else {
        // TODO As yet undefined behavior for multiple repos.
        for (const repo of git.repositories) {
          await prepareCommitMsg(repo);
        }
      }
    }
  );

  context.subscriptions.push(disposable);
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function deactivate() {}
