/**
 * Check if all items in an array have the same value or not.
 */
export function equal<Type>(items: Array<Type>) {
  return items.every(i => i === items[0]);
}
