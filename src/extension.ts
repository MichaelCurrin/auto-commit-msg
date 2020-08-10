import * as vscode from 'vscode';

import { GitExtension, Repository } from './api/git';

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
        for (const repo of git.repositories) {
          await prefixCommit(repo);
        }
      }
    }
  );

  context.subscriptions.push(disposable);
}

async function prefixCommit(repository: Repository) {
  const prefixPattern: string =
    vscode.workspace.getConfiguration().get('gitPrefix.pattern') || '(.*)';
  const ignoreCase: boolean =
    vscode.workspace.getConfiguration().get('gitPrefix.patternIgnoreCase') ||
    false;
  const replacementIsFunction: boolean =
    vscode.workspace
      .getConfiguration()
      .get('gitPrefix.replacementIsFunction') || false;
  const branchRegEx = ignoreCase
    ? new RegExp(prefixPattern, 'i')
    : new RegExp(prefixPattern);
  const prefixReplacement: string =
    vscode.workspace.getConfiguration().get('gitPrefix.replacement') || '[$1] ';
  const branchName =
    (repository.state.HEAD && repository.state.HEAD.name) || '';

  if (branchRegEx.test(branchName)) {
    let ticket;
    if (replacementIsFunction) {
      ticket = branchName.replace(
        branchRegEx,
        (_substring: string, ...args: any[]) =>
          Function(
            ...Array(args.length).fill(1).map((x, y) => `p${x + y}`), // Build args 'p1', 'p2', 'p3'....
            `return ${prefixReplacement}`
          )(...args)
      );
    } else {
      ticket = branchName.replace(branchRegEx, prefixReplacement);
    }
    repository.inputBox.value = `${ticket}${repository.inputBox.value}`;
  } else {
    const message = `Pattern ${prefixPattern} not found in branch ${branchName}`;
    const editPattern = 'Edit Pattern';
    const result = await vscode.window.showErrorMessage(
      message,
      { modal: false },
      editPattern
    );
    if (result === editPattern) {
      vscode.commands.executeCommand('workbench.action.openSettings');
      vscode.commands.executeCommand('settings.action.clearSearchResults');
    }
  }
}

function getGitExtension() {
  const vscodeGit = vscode.extensions.getExtension<GitExtension>('vscode.git');
  const gitExtension = vscodeGit && vscodeGit.exports;

  return gitExtension && gitExtension.getAPI(1);
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function deactivate() {}
