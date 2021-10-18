/**
 * Get a common path of paths.
 *
 * The code comes from:
 *    http://rosettacode.org/wiki/Find_common_directory_path#JavaScript
 * Since JS does not have a built-in function like Python does.
 *
 * This module is kept separate from `paths.ts` as all the code here is tightly
 * related.
 */
import { ROOT } from "../lib/constants";

/**
 * Split strings.
 *
 * For an array of strings, split each string into an array using the given
 * separator.
 */
export function _splitStrings(items: string[], sep = "/") {
  return items.map((item: string) => item.split(sep));
}

/**
 * Get an element at a position.
 *
 * Given an index number, return a function that takes an array and returns the
 * element at the given index.
 */
function _elAt(index: number) {
  return (arr: { [x: string]: any }) => arr[index];
}

/**
 * Transpose an array of arrays:
 *
 * Example:
 *   [['a', 'b', 'c'], ['A', 'B', 'C'], [1, 2, 3]] ->
 *   [['a', 'A', 1],   ['b', 'B', 2],   ['c', 'C', 3]]
 */
function _rotate(arr: string[][]): string[][] {
  return arr[0]
    .map((_el: any, index: number) => arr.map(_elAt(index)));
}

/**
 * Check whether all the elements in an array are the same or not.
 */
function _allElementsEqual(arr: any[]) {
  const firstEl = arr[0]

  return arr.every((el: any) => el === firstEl);
}

/**
 * Return common directory for an array of paths.
 *
 * This can be useful for one file going from source to destination. Or finding
 * the top-most directory that is common to a few files that all changed.
 */
export function commonPath(input: string[], sep = "/"): string {
  const s = _splitStrings(input, sep)

  const common = _rotate(s)
    .filter(_allElementsEqual)
    .map(_elAt(0))
    .join(sep);

  return common === "" ? ROOT : common;
}
