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
import { one } from './generate/message';
import { getSemanticConvention } from './generate/semantic';
import { getChanges } from './git/cli';
import { parseDiffIndex } from './git/parseOutput';
import { getCommitMsg, setCommitMsg } from './gitExtension';
import { CONVENTIONAL_TYPE } from './lib/constants';

const NO_LINES = 'Unable to generate message as no changes files can be seen.\nTry saving your files or stage any new untracked files.'
const TOO_MANY_FILES = 'This extension currently only supports working with *one* changed file at a time.\nStage just one file (or both it\'s old \'D\' and new \'A\' path) and try again. Or stash changes so that only one file change is left in the working tree.'

/**
 * Output a readable semantic git commit message.
 */
function formatMsg(prefix: CONVENTIONAL_TYPE, subject: string) {
  if (prefix === CONVENTIONAL_TYPE.UNKNOWN) {
    return subject;
  }
  return `${prefix}: ${subject}`;
}

function generatePrefixFromChanges(line: string) {
  const { x: actionChar, from: filePath } = parseDiffIndex(line);
  const action = lookupDiffIndexAction(actionChar);

  return getSemanticConvention(action, filePath);
}

/**
 * Tie together pieces of the generate module to create a full message for the UI.
 */
function generateMsgFromChanges(diffIndexLines: string[]) {
  const line = diffIndexLines[0];

  // TODO: Pass FileChanges to one and generatePrefix instead of string.
  // Don't unpack as {x, y, from, to}
  // const fileChanges = parseDiffIndex(line)
  const fileChangeMsg = one(line),
    prefix = generatePrefixFromChanges(line);

  return { prefix, fileChangeMsg };
}

/**
 * Generate commit message.
 *
 * Use the current file changes and the old message to create a new message.
 *
 * For now, assume old message is a commit message template prefix and can always go in front.
 * TODO: Check if the old message is already a PREFIX form or a PREFIX FILECHANGE form.
 */
function generateMsg(prefix: CONVENTIONAL_TYPE, fileChangeMsg: string, oldMsg?: string) {
  const newMsg = formatMsg(prefix, fileChangeMsg);

  return oldMsg ? `${oldMsg} ${newMsg}` : newMsg;
}

/**
 * Generate and use a commit message.
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
