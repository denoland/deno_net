// Copyright 2018-2021 the Deno authors. All rights reserved. MIT license.

import { Grouping, Selector } from "./types.ts";

/**
 * Applies the given selector to each element in the given array, returning a Record containing the results as keys
 * and all values that produced that key as values.
 *
 * Example:
 *
 * ```ts
 * import { groupBy } from "./group_by.ts";
 *
 * type Person = {
 *   name: string;
 * };
 *
 * const people: Person[] = [
 *     { name: 'Anna' },
 *     { name: 'Arnold' },
 *     { name: 'Kim' },
 * ];
 * const peopleByFirstLetter = groupBy(people, it => it.name.charAt(0))
 *
 * console.assert(peopleByFirstLetter === {
 *     'A': [ { name: 'Anna' }, { name: 'Arnold' } ],
 *     'K': [ { name: 'Kim' } ],
 * })
 * ```
 */
export function groupBy<T>(
  array: Array<T>,
  selector: Selector<T, string>,
): Grouping<T> {
  const ret: { [key: string]: Array<T> } = {};

  for (const element of array) {
    const key = selector(element);

    if (ret[key] === undefined) {
      ret[key] = [element];

      continue;
    }

    ret[key].push(element);
  }

  return ret;
}
