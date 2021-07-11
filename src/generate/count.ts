/**
 * Count module.
 *
 * Rather than dealing with individual file names, this module deals with grouping files by actions and showing a count for each.
 *
 * e.g. 'create 5 files'
 * e.g. 'update 3 files in foo'
 * e.g. 'update 16 files and delete 2 files'
*/

import { FileChanges } from "../git/parseOutput.d"

type CountResult = { [key: string]: number }

export function count(changes: FileChanges[]) {
  const result: CountResult = {}

  const item: FileChanges = changes[0]
  const k: string = item.x
  result[k] = 1

  return result
}