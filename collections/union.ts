// Copyright 2018-2021 the Deno authors. All rights reserved. MIT license.

/**
 * Returns all distinct elements that appear in any of the given arrays
 *
 * Example:
 *
 * ```ts
 * import { union } from "./union.ts";
 *
 * const soupIngredients = [ 'Pepper', 'Carrots', 'Leek' ]
 * const saladIngredients = [ 'Carrots', 'Radicchio', 'Pepper' ]
 * const shoppingList = union(soupIngredients, saladIngredients)
 *
 * console.assert(shoppingList === [ 'Pepper', 'Carrots', 'Leek', 'Radicchio' ])
 * ```
 */
export function union<T>(...arrays: Array<Array<T>>): Array<T> {
  const set = new Set<T>();

  for (const array of arrays) {
    for (const element of array) {
      set.add(element);
    }
  }

  return Array.from(set);
}
