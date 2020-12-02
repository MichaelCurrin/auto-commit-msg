/**
 * Prepare commit message.
 *
 * This module ties together logic in the generate modules.
 *
 * This module doesn't interact with the git CLI or the extension. It just deals with text.
 */
import { lookupDiffIndexAction } from './generate/action';
import { oneChange } from './generate/message';
import { getSemanticConvention } from './generate/semantic';
import { parseDiffIndex } from './git/parseOutput';
import { CONVENTIONAL_TYPE } from './lib/constants';

/**
 * Determine what the prefix should be for a file change, using semantic conventions.
 */
function generatePrefixFromChanges(line: string) {
  const { x: actionChar, from: filePath } = parseDiffIndex(line);
  const action = lookupDiffIndexAction(actionChar);

  return getSemanticConvention(action, filePath);
}

/**
 * Generate message from changes.
 *
 * Create semantic convention prefix and description of change paths and return a combined message.
 */
export function generateMsgFromChanges(diffIndexLines: string[]) {
  const line = diffIndexLines[0];

  // TODO: Pass FileChanges to one and generatePrefix instead of string.
  // Don't unpack as {x, y, from, to}
  // const fileChanges = parseDiffIndex(line)
  const fileChangeMsg = oneChange(line),
    prefix = generatePrefixFromChanges(line);

  return { prefix, fileChangeMsg };
}

/**
 * Output a readable semantic git commit message.
 */
function formatMsg(prefix: CONVENTIONAL_TYPE, subject: string) {
  if (prefix === CONVENTIONAL_TYPE.UNKNOWN) {
    return subject;
  }
  return `${prefix}: ${subject}`;
}

/**
 * Generate commit message using old and new message.
 *
 * Use the current file changes and the old message to create a new message.
 *
 * For now, assume old message is a commit message template prefix and can always go in front,
 * removing any existing twice on either side for flexibility.
 *
 * TODO: Check if the old message is already a PREFIX form or a PREFIX FILECHANGE form. This changes the new message form.
 */
function combineOldAndNew(prefix: CONVENTIONAL_TYPE, fileChangeMsg: string, oldMsg?: string) {
  const newMsg = formatMsg(prefix, fileChangeMsg);

  return oldMsg ? `${oldMsg.trim()} ${newMsg}` : newMsg;
}

/**
 * Generate commit message.
 *
 * High-level function to process file changes and an old message to generate replacement commit
 * message.
 */
export function generateMsg(fileChanges: string[], oldMsg?: string) {
  const { prefix, fileChangeMsg } = generateMsgFromChanges(fileChanges);

  return combineOldAndNew(prefix, fileChangeMsg, oldMsg);
}
