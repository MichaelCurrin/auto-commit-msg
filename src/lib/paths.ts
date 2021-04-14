/**
 * Paths module.
 *
 * Helper functions dealing with file paths.
 */
import * as path from "path";
import { ROOT } from "../lib/constants";
import { SplitPathResult } from "./paths.d";

/**
 * Get metadata for a given path.
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
    isAtRepoRoot = dir === ".";

  return {
    atRoot: isAtRepoRoot,
    dirPath: isAtRepoRoot ? ROOT : dir,
    name: path.basename(filePath),
    extension: path.extname(filePath),
  };
}

/**
 * Change file path to a more readable format.
 *
 * Index files stay as a full path, but otherwise reduce the filename.
 */
export function formatPath(filePath: string) {
  const { name } = splitPath(filePath);

  const nameLower = name.toLowerCase();
  if (nameLower.startsWith("readme") || nameLower.startsWith("index")) {
    return filePath;
  }
  return name;
}

/**
 * Convert an array of paths to a human-readable sentence listing all the paths.
 */
export function humanList(paths: string[]) {
  if (!paths.length) {
    return "";
  }
  if (paths.length === 1) {
    return paths[0];
  }
  const firstItems = paths.slice(0, paths.length - 1);
  const lastItem = paths.slice(-1);

  const start = firstItems.join(", ");

  return `${start} and ${lastItem}`;
}
