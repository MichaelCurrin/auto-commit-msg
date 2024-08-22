/**
 * Paths module.
 *
 * Helper functions dealing with file paths.
 */
import * as path from "path";
import { ROOT } from "../lib/constants";
import { MoveOrRename, SplitPathResult } from "./paths.d";

// The starts of filenames which might be repeated as files in a repo. Kept as
// all lowercase here.
const REPEAT_FILENAMES = ["readme", "index", "__init__.py"];

/**
 * Get metadata for a given path.
 *
 * This is done in one function call to save having to do separate calls or
 * having to the built-in string methods all over the project.
 *
 * Info is derived based on the input value as string, not whether the path to a
 * file that exists or not.
 *
 * Note that `path.extname` is already smart enough to detect only the last
 * extension if there are multiple dots as see extension as empty string if it
 * is '.filename'. Note that extension will have a dot.
 */
export function splitPath(filePath: string): SplitPathResult {
  const dir = path.dirname(filePath),
    isAtRepoRoot = dir === ".";

  return {
    atRoot: isAtRepoRoot,
    dirPath: isAtRepoRoot ? ROOT : dir,
    name: path.basename(filePath),
    extension: path.extname(filePath),
  };
}

/** Format to add quotes if the values contains spaces. */
export function quoteForSpaces(value: string) {
  if (value.includes(" ") && value !== ROOT) {
    return `'${value}'`;
  }

  return value;
}

/**
 * Change file path to a more readable format.
 *
 * The idea is to show just the filename and take out the directory path, to
 * keep things short. The README- and index-related files can be confusing as
 * there might be be a few in a project, so those are kept as full paths.
 */
export function friendlyFile(filePath: string) {
  const { name } = splitPath(filePath);

  const nameLower = name.toLowerCase();

  for (const p of REPEAT_FILENAMES) {
    if (nameLower.startsWith(p)) {
      return quoteForSpaces(filePath);
    }
  }
  return quoteForSpaces(name);
}

/**
 * Join a list of items using commas and an "and" word.
 *
 * These don't have to be file paths but usually are for this project.
 */
export function _join(items: string[]) {
  if (!items.length) {
    return "";
  }

  if (items.length === 1) {
    return items[0];
  }

  const firstItems = items.slice(0, items.length - 1);
  const lastItem = items.slice(-1);

  const start = firstItems.join(", ");

  return `${start} and ${lastItem}`;
}

/**
 * Express a list in plain English.
 *
 * Convert an array of paths to a human-readable sentence listing all the paths.
 * To keep things sane, filenames will be used without paths where possible.
 *
 * Leave order as in comes it - though sorting could be added if needed. Git
 * might already be doing some useful sorting.
 */
export function humanList(paths: string[]) {
  if (!paths.length) {
    throw new Error("Expected at least one path, got zero");
  }
  paths = paths.map(path => friendlyFile(path));

  if (paths.length === 1) {
    return paths[0];
  }

  return _join(paths);
}

/**
 * Determine if a pair of paths represents a move, rename, or both.
 */
export function moveOrRenameFromPaths(
  oldP: SplitPathResult,
  newP: SplitPathResult,
) {
  let result: MoveOrRename;

  if (oldP.name === newP.name) {
    result = "move";
  } else if (oldP.dirPath === newP.dirPath) {
    result = "rename";
  } else {
    result = "move and rename";
  }

  return result;
}
