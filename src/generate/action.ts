/**
 * Action module.
 *
 * Phrase commit changes in words.
 *
 * This follows the git style of using `x` and `y`. See this project's docs for more info. Note that
 * `first` and `second` are not appropriate names as `git status` and `git diff-index` behave
 * differently.
 */
import { ACTION, ROOT } from "../lib/constants";
import { splitPath } from "../lib/paths";
import { SplitPathResult } from "../lib/paths.d";


export type ActionKeys = keyof typeof ACTION;
export type MoveAndOrRename = 'move' | 'rename' | 'move and rename'

/**
 * Extract single action from given X and Y actions.
 *
 * NOT USED.
 *
 * Keep for future use with `git status` short output if needed.
 *
 * "Modified" must take preference over the others. Unfortunately, there is no way here to combine
 * update and move.
 */
function _lookupStatusAction(x: string, y: string): string {
  if (ACTION[y as ActionKeys] === ACTION.M) {
    return ACTION.M;
  }
  return ACTION[x as ActionKeys];
}

/**
 * Lookup the action for a given key (single character).
 */
export function lookupDiffIndexAction(x: string) {
  return ACTION[x as ActionKeys];
}


function moveType(oldP: SplitPathResult, newP: SplitPathResult): MoveAndOrRename {
  let result: MoveAndOrRename;

  if (oldP.name === newP.name) {
    result = 'move'
  }
  else if (oldP.dirPath === newP.dirPath) {
    result = 'rename'
  } else {
    result = 'move and rename'
  }

  return result
}

/**
 * Return full message for moving and/or renaming a file.
 *
 * TODO: Update to handle case modified as well, or make a new function.
 */
export function moveOrRenameFile(oldPath: string, newPath: string): string {
  const oldP = splitPath(oldPath),
    newP = splitPath(newPath);

  const moveDesc = moveType(oldP, newP)

  let msg;

  if (moveDesc === 'move') {
    msg = `move ${oldP.name} to ${newP.dirPath}`;
  } else if (moveDesc === 'rename') {
    msg = `rename ${oldP.name} to ${newP.name}`;
  } else {
    const target = newP.dirPath === ROOT ? `${newP.name} at ${ROOT}` : newPath;
    msg = `move and rename ${oldP.name} to ${target}`;
  }

  return msg;
}
