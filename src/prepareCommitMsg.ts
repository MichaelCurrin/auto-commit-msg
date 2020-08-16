/**
 * Prepare commit message.
 *
 * This module ties together the extension's UI and git output code with
 * the interal processing logic of the generate module.
 */
import * as vscode from 'vscode';

import { Repository } from './api/git';
import { Git } from './gitCommands';
import { one } from './generate/message';

/**
 * Fetch Git Extension commit message.
 *
 * This will be useful when doing semantic commits, as the initial 'feat' or 'feat: ' portion
 * or similar can be kept as a prefix while the generate message can be a suffix.
 * Or if left out it can be generated if possible such as for 'chore' or 'docs'.
 */
function getCommitMsg(repository: Repository): string {
  return repository.inputBox.value;
}

/** Replace Git Extension commit message. */
function setCommitMsg(repository: Repository, value: string): void {
  repository.inputBox.value = value;
}
/**
 * Generate a commit message based on file changes and set it in the message box in the Git extension tab.
 *
 * This based on prefixCommit from git-prefix extension.
 */
export async function prepareCommitMsg(repository: Repository) {
  const diffIndexLines = await Git.getChanges();

  // Check the VS Code debug console - to help find issues.
  console.debug(diffIndexLines);

  if (!diffIndexLines.length) {
    vscode.window.showErrorMessage(
      'Unable to generate message as no changes files can be seen.\nTry saving your files or stage any new untracked files.'
    );
    return;
  }

  if (diffIndexLines.length > 1) {
    vscode.window.showErrorMessage(
      "This extension only supports working with *one* changed file at a time.Stage just one file (or both it's old 'D' and new 'A' path) and try again. Or stash changes so that only one file change is left in the working tree."
    );
    return;
  }

  const line = diffIndexLines[0];
  const msg = one(line);
  setCommitMsg(repository, msg);
}
