// Copyright 2018-2021 the Deno authors. All rights reserved. MIT license.

/**
 * Builds two separate arrays from the given array of 2-tuples, with the first returned array holding all first
 * tuple elements and the second one holding all the second elements
 *
 * Example:
 *
 * ```ts
 * import { unzip } from "./unzip.ts";
 *
 * const parents = [
 *     [ 'Maria', 'Jeff' ],
 *     [ 'Anna', 'Kim' ],
 *     [ 'John', 'Leroy' ],
 * ] as [string, string][];
 *
 * const [ moms, dads ] = unzip(parents)
 *
 * console.assert(moms === [ 'Maria', 'Anna', 'John' ])
 * console.assert(moms === [ 'Jeff', 'Kim', 'Leroy' ])
 * ```
 */
export function unzip<T, U>(pairs: Array<[T, U]>): [Array<T>, Array<U>] {
  const { length } = pairs;
  const ret: [Array<T>, Array<U>] = [
    new Array(length),
    new Array(length),
  ];

  pairs.forEach(([first, second], index) => {
    ret[0][index] = first;
    ret[1][index] = second;
  });

  return ret;
}
