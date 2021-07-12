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
import { CountResult } from "./count.d";

export function count(changes: FileChanges[]) {
  const result: CountResult = {};

  const item: FileChanges = changes[0];

  let k: string
  if (item.x === ACTION.R) {
    const oldP = splitPath(item.from)
    const newP = splitPath(item.to)
    k = moveOrRename(oldP, newP)
  }
  else {
    k = item.x;
  }

  result[k] = { fileCount: 1 }

  return result;
}
