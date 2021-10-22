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
import { splitMsg } from "./generate/parseExisting";
import { parseDiffIndex } from "./git/parseOutput";
import { AGGREGATE_MIN, CONVENTIONAL_TYPE } from "./lib/constants";
import { equal } from "./lib/utils";
import { ConvCommitMsg } from "./prepareCommitMsg.d";

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
 * Determine the Conventional Commit type prefix for a file change.
 *
 * @param line Description of a file change from Git output. e.g. "A    baz.txt"
 */
export function _prefixFromChange(line: string) {
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
  const prefixType = _prefixFromChange(line),
    description = oneChange(line);

  return { prefixType, description };
}

/**
 * Get single Conventional Commit type prefix from multiple items.
 *
 * @returns Inferred overall prefix type.
 *   - Unknown if zero items - not likely in real life but covered anyway.
 *   - The first item if they are equal.
 *   - Use unknown if they are different.
 *   - If at least one item is build dependencies even if the others are
 *     different, then use that. This covers the case where `package.json` may
 *     have non-deps changes, but the `package-lock.json` is enough to want to
 *     use the deps scope.
 */
export function _collapse(types: CONVENTIONAL_TYPE[]) {
  let result = CONVENTIONAL_TYPE.UNKNOWN;

  if (!types.length) {
    return result;
  }

  if (equal(types)) {
    result = types[0];
  } else if (types.includes(CONVENTIONAL_TYPE.BUILD_DEPENDENCIES)) {
    result = CONVENTIONAL_TYPE.BUILD_DEPENDENCIES;
  }

  return result;
}

/**
 * Generate prefix and named description for multiple file changes.
 *
 * This finds a common Conventional Commit prefix if one is appropriate and
 * returns a message listing all the file names.
 */
export function _msgNamed(lines: string[]): ConvCommitMsg {
  const conventions = lines.map(_prefixFromChange);
  const prefixType = _collapse(conventions);

  const changes = lines.map(parseDiffIndex);
  const description = namedFilesDesc(changes);

  return { prefixType, description };
}

/**
 * Generate prefix and count description for multiple file changes.
 *
 * TODO: Use prefix.
 */
export function _msgCount(lines: string[]): ConvCommitMsg {
  const prefix = CONVENTIONAL_TYPE.UNKNOWN;

  const changes = lines.map(parseDiffIndex);
  const description = countFilesDesc(changes);

  return { prefixType: prefix, description };
}

/**
 * Generate message from changes to one or more files.
 *
 * @param lines Lines from the `git diff-index` function, describing changes to
 * files.
 *
 * @returns Conventional Commit prefix and a description of changed paths.
 */
export function _msgFromChanges(lines: string[]) {
  let result: ConvCommitMsg;

  if (lines.length === 1) {
    const line = lines[0];
    result = _msgOne(line);
  } else if (lines.length < AGGREGATE_MIN) {
    result = _msgNamed(lines);
  } else {
    result = _msgCount(lines);
  }

  return result;
}

/**
 * Output a readable conventional commit message.
 */
export function _formatMsg(convCommitMsg: ConvCommitMsg) {
  if (convCommitMsg.prefixType === CONVENTIONAL_TYPE.UNKNOWN) {
    return convCommitMsg.description;
  }
  return `${convCommitMsg.prefixType}: ${convCommitMsg.description}`;
}

/**
 * Generate a new commit message and format it as a string.
 */
export function _newMsg(lines: string[]) {
  const convCommitMsg = _msgFromChanges(lines);

  return _formatMsg(convCommitMsg);
}

/**
 * Create a commit message using an existing message and generated pieces.
 *
 * The point is to always use the new description, but respect the old description.
 *
 * An old type (possibly manually generated) must take preference over a
 * generated one.
 *
 * See the "common scenarios" part of `prepareCommitMsg.test.ts` test spec.
 *
 * @param autoType The Conventional Commit type to use, as auto-generated by the
 *   extension, based on changed files.
 * @param autoDesc A description of file changes, also auto-generated.
 * @param oldMsg What exists in the commit message box at the time the extension
 *   is run, whether typed manually or generated previously by the extension. It
 *   could be a mix of custom prefix, type and description.
 */
export function _combineOldAndNew(
  autoType: CONVENTIONAL_TYPE,
  autoDesc: string,
  oldMsg?: string
) {
  if (!oldMsg) {
    const convCommitMsg: ConvCommitMsg = {
      prefixType: autoType,
      description: autoDesc,
    };

    return _formatMsg(convCommitMsg);
  }

  const {
    customPrefix: oldCustomPrefix,
    typePrefix: oldType,
    description: oldDesc,
  } = splitMsg(oldMsg);

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
 * High-level function to process file changes and an old message, to generate a
 * replacement commit message.
 */
export function _generateMsgWithOld(lines: string[], oldMsg: string) {
  if (!oldMsg) {
    throw new Error(
      "`oldMsg` must be non-empty - or use `generateNewMsg` instead."
    );
  }
  const { prefixType, description } = _msgFromChanges(lines);

  return _combineOldAndNew(prefixType, description, oldMsg);
}

/**
 * Generate commit message.
 *
 * This is a public wrapper function to allow an existing message to be set or not.
 *
 * Old message could be the current commit message value in the UI box (which
 * might be a commit message template that VS Code has filled in), or a commit
 * message template read from a file in the case of a hook flow without VS Code.
 *
 * @param lines A list of text values describing how files changes.
 */
export function generateMsg(lines: string[], oldMsg?: string): string {
  if (!oldMsg) {
    return _newMsg(lines);
  }

  return _generateMsgWithOld(lines, oldMsg);
}
