/**
 * Find common parent directory of paths.
 * 
 * From: http://rosettacode.org/wiki/Find_common_directory_path#JavaScript
 * 
 * JS does not have a builtin function like Python does.
 */

/**
 * Given an array of strings, return an array of arrays, containing the
 * strings split at the given separator
 * 
 * @param {!Array<!string>} a
 * @param {string} sep
 * @returns {!Array<!Array<string>>}
 */
const splitStrings = (a: any[], sep = '/') =>
  a.map((i: string) => i.split(sep));

/**
 * Given an index number, return a function that takes an array and returns the
 * element at the given index
 * 
 * @param {number} i
 * @return {function(!Array<*>): *}
 */
function elAt(i: number) {
  return (a: { [x: string]: any }) => a[i];
}

/**
 * Transpose an array of arrays:
 * 
 * Example:
 *   [['a', 'b', 'c'], ['A', 'B', 'C'], [1, 2, 3]] ->
 *   [['a', 'A', 1], ['b', 'B', 2], ['c', 'C', 3]]
 * 
 * @param {!Array<!Array<*>>} a
 * @return {!Array<!Array<*>>}
 */
function rotate(a: any[]) {
  return a[0].map((e: any, i: any) => a.map(elAt(i)));
}

/**
 * Checks of all the elements in the array are the same.
 * 
 * @param {!Array<*>} arr
 * @return {boolean}
 */
function allElementsEqual(arr: any[]) {
  return arr.every((e: any) => e === arr[0]);
}

export function commonPath(input: string[], sep = '/') {
  return rotate(splitStrings(input, sep))
    .filter(allElementsEqual)
    .map(elAt(0))
    .join(sep);
}
