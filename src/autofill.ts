/**
 * Autofill module.
 */
import * as vscode from 'vscode';
import { Repository } from './api/git';
import { getChanges } from './git/cli';
import { getCommitMsg, setCommitMsg } from './gitExtension';
import { generateMsg } from './prepareCommitMsg';

export const NO_LINES = 'Unable to generate message as no changes files can be seen.\nTry saving your files or stage any new untracked files.';

export const TOO_MANY_FILES = 'This extension currently only supports working with *one* changed file at a time.\nStage just one file (or both it\'s old \'D\' and new \'A\' path) and try again. Or stash changes so that only one file change is left in the working tree.';

/**
 * Generate and fill a commit message.
 *
 * Steps:
 *   1. Reading git commands output and currently filled message.
 *   2. Generate a message.
 *   3. Push message to the Git Extension UI box.
 *
 * This is based on `prefixCommit` from the `git-prefix` extension.
 */
export async function makeAndFillCommitMsg(repository: Repository) {
  const fileChanges = await getChanges();

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

  const newMsg = generateMsg(fileChanges, oldMsg);
  console.debug('New message: ', newMsg);

  setCommitMsg(repository, newMsg);
}
