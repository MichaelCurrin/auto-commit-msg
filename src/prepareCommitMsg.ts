/**
 * Prepare commit message.
 */
import { lookupDiffIndexAction } from './generate/action';
import { one } from './generate/message';
import { getSemanticConvention } from './generate/semantic';
import { parseDiffIndex } from './git/parseOutput';
import { CONVENTIONAL_TYPE } from './lib/constants';

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
 * Tie together pieces to create a full message for the UI.
 */
export function generateMsgFromChanges(diffIndexLines: string[]) {
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
export function generateMsg(prefix: CONVENTIONAL_TYPE, fileChangeMsg: string, oldMsg?: string) {
  const newMsg = formatMsg(prefix, fileChangeMsg);

  return oldMsg ? `${oldMsg} ${newMsg}` : newMsg;
}
