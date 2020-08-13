/**
 * Paths module.
 * 
 * Helper functiosn dealing with file paths.
 */
import * as path from 'path';

import { ROOT } from './constants';

interface SplitPathResult {
  atRoot: boolean;
  dir: string;
  name: string;
  extension: string;
}

/**
 * Get metadata about a path.
 *
 * Info is derived based on the input value string whether the path to a file that 
 * exists or not.
 * 
 * Note that .extname is already smart enough to detect only the last extension
 * if there are multiple dots as see extension as empty string if it is '.filename'. 
 * Note that extension the dot.
 */
export function splitPath(filePath: string): SplitPathResult {
  const dir = path.dirname(filePath),
    isAtRepoRoot = dir === '.';

  return {
    atRoot: isAtRepoRoot,
    dir: isAtRepoRoot ? ROOT : dir,
    name: path.basename(filePath),
    extension: path.extname(filePath)
  };
}
