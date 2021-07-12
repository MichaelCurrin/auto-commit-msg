/**
 * Count module.
 *
 * Rather than dealing with individual file names, this module deals with grouping files by actions
 * and showing a count for each.
 *
 * e.g. 'create 5 files' (in different directories).
 * e.g. 'update 3 files in foo' (highest common directory).
 * e.g. 'update 16 files and delete 2 files'
 */

import { FileChanges } from "../git/parseOutput.d";
import { ACTION } from "../lib/constants";
import { moveOrRename, splitPath } from "../lib/paths";
import { FileChangesByAction } from "./count.d";

function determineAction(item: FileChanges): string {
  if (item.x !== ACTION.R) {
    return item.x
  }

  const oldP = splitPath(item.from);
  const newP = splitPath(item.to);

  return moveOrRename(oldP, newP);
}

export function count(changes: FileChanges[]) {
  const result: FileChangesByAction = {};

  const item: FileChanges = changes[0];

  let action: string = determineAction(item);

  result[action] = { fileCount: 1 }

  return result;
}
