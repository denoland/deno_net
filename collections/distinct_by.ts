// Copyright 2018-2021 the Deno authors. All rights reserved. MIT license.

import { Selector } from "./types.ts";

/**
 * Returns all elements in the given array that produce a distinct value using the given selector, preserving order by first occurence
 *
 * Example:
 *
 * ```ts
 * import { distinctBy } from "./distinct_by.ts";
 *
 * const names = [ 'Anna', 'Kim', 'Arnold', 'Kate' ]
 * const exampleNamesByFirstLetter = distinctBy(names, it => it.charAt(0))
 *
 * console.assert(exampleNamesByFirstLetter === [ 'Anna', 'Kim' ])
 * ```
 */
export function distinctBy<T, D>(
  array: Array<T>,
  selector: Selector<T, D>,
): Array<T> {
  const selectedValues = new Set<D>();
  const ret = new Array<T>();

  for (const element of array) {
    const currentSelectedValue = selector(element);

    if (!selectedValues.has(currentSelectedValue)) {
      selectedValues.add(currentSelectedValue);
      ret.push(element);
    }
  }

  return ret;
}
