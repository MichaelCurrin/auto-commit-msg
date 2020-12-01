/**
 * Extension module.
 *
 * This sets up the extension command entry point and applies the
 * prepare commit message module to a target branch.
 */
import * as vscode from 'vscode';
import { API, GitExtension } from './api/git';
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
 * Flow for multiple repos in workspace and selecting just one. This is a rare flow.
 */
async function handleRepos(git: API, uri: any) {
  // FIXME: Unfortunately this seems to only pick up the first repo and not find second etc.
  const selectedRepository = git.repositories.find(repository => {
    return repository.rootUri.path === uri._rootUri.path;
  });

  if (selectedRepository) {
    await prepareCommitMsg(selectedRepository);
  }
}

/**
 * Flow for a single or zero repos in the workspace.
 */
async function handleRepo(git: API) {
  if (git.repositories.length === 0) {
    vscode.window.showErrorMessage(
      'No repos found. Please open a repo or run git init then try this extension again.'
    );
    return;
  }

  const targetRepo = git.repositories[0];
  await prepareCommitMsg(targetRepo);
}
/**
 * Run the autofill command when the extension is triggered.
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
      handleRepos(git, uri);
    }
    else {
      handleRepo(git);
    }
  });

  context.subscriptions.push(disposable);
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function deactivate() { }
