/**
 * Prepare commit message.
 *
 * This module ties together logic from modules in the `generate` module. So it is best kept outside
 * that.
 *
 * This module doesn't interact with the git CLI or the extension. It just deals with text.
 */
import { lookupDiffIndexAction } from "./generate/action";
import { namedFiles, oneChange } from "./generate/message";
import { getSemanticConvention } from "./generate/semantic";
import { parseDiffIndex } from "./git/parseOutput";
import { CONVENTIONAL_TYPE } from "./lib/constants";

/**
 * Determine what the prefix should be for a file change, using semantic conventions.
 */
function generatePrefixFromChanges(line: string) {
  const { x: actionChar, from: filePath } = parseDiffIndex(line);
  const action = lookupDiffIndexAction(actionChar);

  return getSemanticConvention(action, filePath);
}

export function _generateMsgOne(line: string) {
  // TODO: Should reduceActions go where generatePrefixFromChanges is and which should be used here?

  // TODO: Pass FileChanges to one and generatePrefix instead of string.
  // Don't unpack as {x, y, from, to}
  // const fileChanges = parseDiffIndex(line)
  const prefix = generatePrefixFromChanges(line),
    fileChangeMsg = oneChange(line);

  // TODO convert to interface.
  return { prefix, fileChangeMsg };
}

export function _generateMsgMulti(lines: string[]) {
  return { prefix: CONVENTIONAL_TYPE.UNKNOWN, fileChangeMsg: namedFiles(lines) };
}

/**
 * Generate message from changes.
 *
 * Return conventional commit prefix and a description of changed paths.
 */
export function generateMsgFromChanges(diffIndexLines: string[]) {
  if (diffIndexLines.length === 1) {
    const line = diffIndexLines[0];
    return _generateMsgOne(line);
  }

  return _generateMsgMulti(diffIndexLines);
}

/**
 * Output a readable conventional commit message.
 */
function formatMsg(prefix: CONVENTIONAL_TYPE, fileChangeMsg: string) {
  if (prefix === CONVENTIONAL_TYPE.UNKNOWN) {
    return fileChangeMsg;
  }
  return `${prefix}: ${fileChangeMsg}`;
}

/**
 * Generate a new commit message.
 */
function generateNewMsg(lines: string[]) {
  const { prefix, fileChangeMsg } = generateMsgFromChanges(lines);

  return formatMsg(prefix, fileChangeMsg);
}

/**
 * Format commit message using old and new messages.
 *
 * For now, assume old message is a commit message template prefix and can always go in front,
 * removing any existing twice on either side for flexibility.
 *
 * Dev note - must make sure prefix and fileChangeMsg come in separately here, not as a combined
 * message.
 *
 * TODO: Check if the old message is already a PREFIX form or a PREFIX FILECHANGE form. This changes
 * the new message form.
 */
function combineOldAndNew(prefix: CONVENTIONAL_TYPE, fileChangeMsg: string, oldMsg?: string) {
  const newMsg = formatMsg(prefix, fileChangeMsg);

  return oldMsg ? `${oldMsg.trim()} ${newMsg}` : newMsg;
}

/**
 * Generate commit message using existing message and new generated message.
 *
 * High-level function to process file changes and an old message to generate replacement commit
 * message. Old message must be given, but it can be an empty string.
 */
function generateMsgWithOld(fileChanges: string[], oldMsg: string) {
  if (oldMsg === "") {
    throw new Error("Either `oldMsg` must not be empty, or use `generateNewMsg` instead.");
  }
  const { prefix, fileChangeMsg } = generateMsgFromChanges(fileChanges);

  return combineOldAndNew(prefix, fileChangeMsg, oldMsg);
}

/**
 * Generate commit message.
 *
 * This is a public wrapper function to allow old message to be set or not.
 *
 * Old message could be the current commit message value in the UI box (which might be a commit
 * message template that VS Code has filled in), or a commit message template read from a file in
 * the case of a hook flow without VS Code.
 */
export function generateMsg(fileChanges: string[], oldMsg?: string): string {
  if (!oldMsg) {
    return generateNewMsg(fileChanges);
  } else {
    return generateMsgWithOld(fileChanges, oldMsg);
  }
}
