/**
 * Prepare commit message.
 *
 * This module takes care of the high-level flow of the extension, after a repo is
 * selected in extension.ts module.
 *
 * This module handles reading git output, processes it with the logic in the generate module
 * and then finally sets it in the UI message box.
 */
import * as vscode from 'vscode';
import { Repository } from './api/git';
import { lookupDiffIndexAction } from './generate/action';
import { CONVENTIONAL_TYPE } from './generate/constants';
import { one } from './generate/message';
import { parseDiffIndex } from './generate/parseGitOutput';
import { getSemanticConvention } from './generate/semantic';
import { getChanges } from './gitCommands';

/**
 * Fetch Git Extension commit message.
 *
 * NOT USED.
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

function formatMsg(prefix: CONVENTIONAL_TYPE, subject: string) {
  if (prefix === CONVENTIONAL_TYPE.UNKNOWN) {
    return subject;
  }
  return `${prefix}: ${subject}`;
}

// TODO: Move this and formatMsg to generate module.
// Tie together piece of the generate module to create a full message for the UI.
function generateMsg(diffIndexLines: string[]) {
  const line = diffIndexLines[0],
    fileChangeMsg = one(line);

  // TODO refactor as this is done in `one` too.
  const { x: actionChar, from: filePath } = parseDiffIndex(line);
  const action = lookupDiffIndexAction(actionChar);
  const prefix = getSemanticConvention(action, filePath);

  return formatMsg(prefix, fileChangeMsg);
}

/**
 * Autofill commit message.
 *
 * Read git command output, process it to generate a commit message and then push the message to the input box UI.
 *
 * This function is based on prefixCommit from git-prefix extension.
 */
export async function prepareCommitMsg(repository: Repository) {
  const diffIndexLines = await getChanges();

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
      "This extension currently only supports working with *one* changed file at a time.\nStage just one file (or both it's old 'D' and new 'A' path) and try again. Or stash changes so that only one file change is left in the working tree."
    );
    return;
  }

  // Parse and process the git output fetched above.
  const msg = generateMsg(diffIndexLines);
  setCommitMsg(repository, msg);
}
