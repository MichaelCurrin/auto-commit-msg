import * as vscode from 'vscode';

import { GitExtension, Repository } from './api/git';

function getGitExtension() {
  const vscodeGit = vscode.extensions.getExtension<GitExtension>('vscode.git');
  const gitExtension = vscodeGit && vscodeGit.exports;

  return gitExtension && gitExtension.getAPI(1);
}

// Based on prefixCommit from git-prefix extension. This is the core logic from there
// and where the message is added for this repo.
async function prefixCommit(repository: Repository) {
  const originalMessage = repository.inputBox.value;

  repository.inputBox.value = `PREFIX ${originalMessage}`;
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
          await prefixCommit(selectedRepository);
        }
      } else {
        // TODO As yet undefined behavior for multiple repos.
        for (const repo of git.repositories) {
          await prefixCommit(repo);
        }
      }
    }
  );

  context.subscriptions.push(disposable);
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function deactivate() {}
