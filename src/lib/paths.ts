/**
 * Paths module.
 *
 * Helper functions dealing with file paths.
 */
import * as path from 'path';
import { ROOT } from '../lib/constants';
import { SplitPathResult } from './paths.d';

/**
 * Get metadata about a given path.
 *
 * This is done in one function call to save having to do separate calls or having to the builtin
 * string methods all over the project.
 *
 * Info is derived based on the input value as string, not whether the path to a file that exists or
 * not.
 *
 * Note that path.extname is already smart enough to detect only the last extension if there are
 * multiple dots as see extension as empty string if it is '.filename'. Note that extension has a
 * dot.
 */
export function splitPath(filePath: string): SplitPathResult {
  const dir = path.dirname(filePath),
    isAtRepoRoot = dir === '.';

  return {
    atRoot: isAtRepoRoot,
    dirPath: isAtRepoRoot ? ROOT : dir,
    name: path.basename(filePath),
    extension: path.extname(filePath),
  };
}

/**
 * Change file path to be more readable format.
 *
 * Index files stay as a full path, but otherwise reduce the filename.
 */
export function formatPath(filePath: string) {
  let { name } = splitPath(filePath);
  name = name.toLowerCase();

  if (name.startsWith('readme') || name.startsWith('index')) {
    return filePath;
  }
  return name;
}
