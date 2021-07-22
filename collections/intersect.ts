// Copyright 2018-2021 the Deno authors. All rights reserved. MIT license.

import { filterInPlace } from "./_utils.ts";

/**
 * Returns all distinct elements that appear at least once in each of the given arrays
 *
 * Example:
 *
 * ```ts
 * import { intersect } from "./intersect.ts";
 *
 * const lisaInterests = [ 'Cooking', 'Music', 'Hiking' ]
 * const kimInterests = [ 'Music', 'Tennis', 'Cooking' ]
 * const commonInterests = intersect(lisaInterests, kimInterests)
 *
 * console.assert(commonInterests === [ 'Cooking', 'Music' ])
 * ```
 */
export function intersect<T>(...arrays: Array<Array<T>>): Array<T> {
  if (arrays.length === 0) {
    return [];
  }

  const [originalHead, ...tail] = arrays;
  const head = [...originalHead];
  const tailSets = tail.map((it) => new Set(it));

  for (const set of tailSets) {
    filterInPlace(head, (it) => set.has(it));
  }

  return head;
}
