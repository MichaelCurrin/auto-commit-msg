/**
 * Prepare commit message.
 *
 * This module ties together logic from independent modules in the `generate` module. So it is best
 * kept on the outside here.
 *
 * The "message" is the full commit message. The "file change description" is the description
 * portion, which describes how the files changed.
 *
 * This module doesn't interact with the git CLI or the extension. It just deals with text.
 */
import { lookupDiffIndexAction } from "./generate/action";
import { getConventionType } from "./generate/convCommit";
import { countFilesDesc } from "./generate/count";
import { namedFilesDesc, oneChange } from "./generate/message";
import { parseDiffIndex } from "./git/parseOutput";
import { AGGREGATE_MIN, CONVENTIONAL_TYPE } from "./lib/constants";
import { equal } from "./lib/utils";

/**
 * Join two strings together with a space.
 *
 * Use only one string if only one is set, or if they are identical.
 *
 * Trimming on the outside is necessary, in case only one item is set.
 */
export function _cleanJoin(first: string, second: string) {
  first = first.trim();
  second = second.trim();

  if (first === second) {
    return first;
  }
  return `${first} ${second}`.trim();
}

/**
 * Separate a message into a Conventional Commit type, if any, and the description.
 *
 * Require a colon to exist to detect type prefix. i.e. 'ci' will be considered a description, but
 * 'ci:' will be considered a prefix. This keeps the check simpler as we don't have to match against
 * every type and we don't have to check if we are part of a word e.g. 'circus'.
 */
export function _splitMsg(msg: string) {
  const [prefix, description] = msg.includes(":") ? msg.split(":") : ["", msg];

  const [customPrefix, typePrefix] = prefix.includes(" ")
    ? prefix.split(" ", 2)
    : ["", prefix];

  return { customPrefix, typePrefix, description: description.trim() };
}

/**
 * Determine the Conventional Commit type prefix for a file change.
 */
function _prefixFromChange(line: string) {
  const { x: actionChar, from: filePath } = parseDiffIndex(line);
  const action = lookupDiffIndexAction(actionChar);

  return getConventionType(action, filePath);
}

/**
 * Generate message for a single file change.
 */
export function _msgOne(line: string) {
  // TODO: Pass FileChanges to oneChange and _prefixFromChange instead of string.
  // Don't unpack as {x, y, from, to}
  // const fileChanges = parseDiffIndex(line)
  const prefix = _prefixFromChange(line),
    description = oneChange(line);

  return { prefix, description };
}

/**
 * Get single Conventional Commit type prefix from multiple items given.
 *
 * If at least one item is build dependencies even if the others are different, then use that.
 * This covers the case where `package.json` may have non-package changes but you know it does
 * in this case because it changed with the lock file.
 */
function _collapse(types: CONVENTIONAL_TYPE[]) {
  if (equal(types)) {
    return types[0];
  }
  if (types.includes(CONVENTIONAL_TYPE.BUILD_DEPENDENCIES)) {
    return CONVENTIONAL_TYPE.BUILD_DEPENDENCIES;
  }

  return CONVENTIONAL_TYPE.UNKNOWN;
}

/**
 * Generate prefix and description for multiple file changes.
 *
 * This finds a common Conventional Commit prefix if one is appropriate and returns a message
 * listing all the file names.
 */
export function _msgNamed(lines: string[]) {
  if (lines.length < AGGREGATE_MIN) {
    const conventions = lines.map(_prefixFromChange);
    const prefix = _collapse(conventions);
    const description = namedFilesDesc(lines);
    return { prefix, description };
  } else {
    const prefix = CONVENTIONAL_TYPE.UNKNOWN;
    const changes = lines.map(line => parseDiffIndex(line));
    const description = countFilesDesc(changes);

    return { prefix, description };
  }
}

/**
 * Generate message from changes to one or more files.
 *
 * @param lines Lines from the `git diff-index` function, describing changes to files.
 *
 * @returns Conventional Commit prefix and a description of changed paths.
 */
export function _msgFromChanges(lines: string[]) {
  let result: { prefix: CONVENTIONAL_TYPE; description: string };

  if (lines.length === 1) {
    const line = lines[0];
    result = _msgOne(line);
  } else {
    result = _msgNamed(lines);
  }

  return result;
}

/**
 * Output a readable conventional commit message.
 */
export function _formatMsg(prefix: CONVENTIONAL_TYPE, description: string) {
  if (prefix === CONVENTIONAL_TYPE.UNKNOWN) {
    return description;
  }
  return `${prefix}: ${description}`;
}

/**
 * Generate a new commit message and format it as a string.
 */
export function _newMsg(lines: string[]) {
  const { prefix, description } = _msgFromChanges(lines);

  return _formatMsg(prefix, description);
}

/**
 * Create a commit message using an existing message and generated pieces.
 *
 * The point is to always use the new description, but respect the old description.
 *
 * An old type (possibly manually generated) must take preference over a generated one.
 *
 * See the "common scenarios" part of `prepareCommitMsg.test.ts` test spec.
 *
 * @param autoType The Conventional Commit type to use, as auto-generated by the extension, based on
 *   changed files.
 * @param autoDesc A description of file changes, also auto-generated.
 * @param oldMsg What exists in the commit message box at the time the extension is run, whether
 *   typed manually or generated previously by the extension. It could be a mix of custom prefix,
 *   type and description.
 */
export function _combineOldAndNew(
  autoType: CONVENTIONAL_TYPE,
  autoDesc: string,
  oldMsg?: string
) {
  if (!oldMsg) {
    return _formatMsg(autoType, autoDesc);
  }

  const {
    customPrefix: oldCustomPrefix,
    typePrefix: oldType,
    description: oldDesc,
  } = _splitMsg(oldMsg);

  const descResult = _cleanJoin(autoDesc, oldDesc);

  if (oldType) {
    return `${_cleanJoin(oldCustomPrefix, oldType)}: ${descResult}`;
  }

  if (autoType !== CONVENTIONAL_TYPE.UNKNOWN) {
    return `${_cleanJoin(oldCustomPrefix, autoType)}: ${descResult}`;
  }

  return descResult;
}

/**
 * Generate commit message using existing message and new generated message.
 *
 * High-level function to process file changes and an old message, to generate a replacement commit
 * message.
 */
export function _generateMsgWithOld(lines: string[], oldMsg: string) {
  if (!oldMsg) {
    throw new Error(
      "`oldMsg` must be non-empty - or use `generateNewMsg` instead."
    );
  }
  const { prefix, description } = _msgFromChanges(lines);

  return _combineOldAndNew(prefix, description, oldMsg);
}

/**
 * Generate commit message.
 *
 * This is a public wrapper function to allow an existing message to be set or not.
 *
 * Old message could be the current commit message value in the UI box (which might be a commit
 * message template that VS Code has filled in), or a commit message template read from a file in
 * the case of a hook flow without VS Code.
 *
 * @param lines A list of text values describing how files changes.
 */
export function generateMsg(lines: string[], oldMsg?: string): string {
  if (!oldMsg) {
    return _newMsg(lines);
  }

  return _generateMsgWithOld(lines, oldMsg);
}
