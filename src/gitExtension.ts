/**
 * Git extension module.
 *
 * Perform tasks related to the builtin Git extension.
 */
import * as vscode from 'vscode';
import { Repository } from './api/git';
import { getChanges } from './git/cli';
import { generateMsg, generateMsgFromChanges } from './prepareCommitMsg';

/**
 * Fetch the commit message in the Git Extension.
 *
 * This could useful when doing semantic commits, as the initial 'feat' or 'feat: ' portion
 * or similar can be kept as a prefix while the generated message added on.
 * Or if left out, it can be generated if possible such as for 'chore' or 'docs'.
 */
function getCommitMsg(repository: Repository): string {
  return repository.inputBox.value;
}

/**
 * Set the commit message in the Git Extension.
 */
function setCommitMsg(repository: Repository, msg: string) {
  repository.inputBox.value = msg;
}



export const NO_LINES = 'Unable to generate message as no changes files can be seen.\nTry saving your files or stage any new untracked files.';

export const TOO_MANY_FILES = 'This extension currently only supports working with *one* changed file at a time.\nStage just one file (or both it\'s old \'D\' and new \'A\' path) and try again. Or stash changes so that only one file change is left in the working tree.';

/**
 * Generate and fill the commit message.
 *
 * Read file changes using a git command output, process the output to generate a commit message and
 * then push the message to the input box UI.
 *
 * This is based on prefixCommit from the git-prefix extension.
 */
export async function makeAndFillCommitMsg(repository: Repository) {
  const fileChanges = await getChanges();

  // Send to the VS Code debug console to help find issues.
  console.debug('diff-index:', fileChanges);

  if (!fileChanges.length) {
    vscode.window.showErrorMessage(NO_LINES);
    return;
  }
  if (fileChanges.length > 1) {
    vscode.window.showErrorMessage(TOO_MANY_FILES);
    return;
  }

  const oldMsg = getCommitMsg(repository);
  console.debug('Old message: ', oldMsg);

  const { prefix, fileChangeMsg } = generateMsgFromChanges(fileChanges);
  const newMsg = generateMsg(prefix, fileChangeMsg, oldMsg);
  console.debug('New message: ', newMsg);

  setCommitMsg(repository, newMsg);
}
