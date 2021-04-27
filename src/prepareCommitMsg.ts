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
import { equal } from "./lib/utils";

/**
 * Determine what the prefix should be for a file change, using semantic conventions.
 */
function _prefixFromChanges(line: string) {
  const { x: actionChar, from: filePath } = parseDiffIndex(line);
  const action = lookupDiffIndexAction(actionChar);

  return getSemanticConvention(action, filePath);
}

/**
 * Generate message for a single file change.
 */
export function _msgOne(line: string) {
  // TODO: Pass FileChanges to one and generatePrefix instead of string.
  // Don't unpack as {x, y, from, to}
  // const fileChanges = parseDiffIndex(line)
  const prefix = _prefixFromChanges(line),
    fileChangeMsg = oneChange(line);

  return { prefix, fileChangeMsg };
}

/**
 * Generate message for multiple file changes.
 *
 * This finds a common conventional commit prefix if one is appropriate and returns a message
 * listing all the names.
 *
 * This was added onto this extension later in development, while `_msgOne` was the core behavior
 * up to then.
 */
export function _msgMulti(lines: string[]) {
  const conventions = lines.map(_prefixFromChanges);
  const prefix = equal(conventions) ? conventions[0] : CONVENTIONAL_TYPE.UNKNOWN;

  return { prefix, fileChangeMsg: namedFiles(lines) };
}

/**
 * Generate message from changes to one or more files.
 *
 * Return conventional commit prefix and a description of changed paths.
 */
export function _msgFromChanges(diffIndexLines: string[]) {
  if (diffIndexLines.length === 1) {
    const line = diffIndexLines[0];
    return _msgOne(line);
  }

  return _msgMulti(diffIndexLines);
}

/**
 * Output a readable conventional commit message.
 */
function _formatMsg(prefix: CONVENTIONAL_TYPE, fileChangeMsg: string) {
  if (prefix === CONVENTIONAL_TYPE.UNKNOWN) {
    return fileChangeMsg;
  }
  return `${prefix}: ${fileChangeMsg}`;
}

/**
 * Generate a new commit message and format is as a string.
 */
function _newMsg(lines: string[]) {
  const { prefix, fileChangeMsg } = _msgFromChanges(lines);

  return _formatMsg(prefix, fileChangeMsg);
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
function _combineOldAndNew(prefix: CONVENTIONAL_TYPE, fileChangeMsg: string, oldMsg?: string) {
  const newMsg = _formatMsg(prefix, fileChangeMsg);

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
  const { prefix, fileChangeMsg } = _msgFromChanges(fileChanges);

  return _combineOldAndNew(prefix, fileChangeMsg, oldMsg);
}

/**
 * Generate commit message.
 *
 * This is a public wrapper function to allow an existing message to be set or not.
 *
 * Old message could be the current commit message value in the UI box (which might be a commit
 * message template that VS Code has filled in), or a commit message template read from a file in
 * the case of a hook flow without VS Code.
 */
export function generateMsg(fileChanges: string[], oldMsg?: string): string {
  if (!oldMsg) {
    return _newMsg(fileChanges);
  } else {
    return generateMsgWithOld(fileChanges, oldMsg);
  }
}
