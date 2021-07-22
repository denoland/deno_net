// Copyright 2018-2021 the Deno authors. All rights reserved. MIT license.

/**
 * Builds all possible orders of all elements in the given array
 * Ignores equality of elements, meaning this will always reutrn the same
 * number of permutations for a given length of input.
 *
 * Example:
 *
 * ```ts
 * import { permutations } from "./permutations.ts";
 *
 * const numbers = [ 1, 2 ]
 * const windows = permutations(numbers)
 *
 * console.assert(windows === [
 *     [ 1, 2 ],
 *     [ 2, 1 ],
 * ])
 * ```
 */
export function permutations<T>(array: Array<T>): Array<Array<T>> {
  const ret: Array<Array<T>> = [];

  if (array.length === 0) {
    return ret;
  }

  // Heap Algorithm
  function heapPermutations(k: number, array: Array<T>) {
    const c = new Array<number>(k).fill(0);

    ret.push([...array]);

    let i = 1;

    while (i < k) {
      if (c[i] < i) {
        if (i % 2 === 0) {
          const swapBuffer = array[0];
          array[0] = array[i];
          array[i] = swapBuffer;
        } else {
          const swapBuffer = array[c[i]];
          array[c[i]] = array[i];
          array[i] = swapBuffer;
        }

        ret.push([...array]);

        c[i] += 1;
        i = 1;
      } else {
        c[i] = 0;
        i += 1;
      }
    }
  }

  heapPermutations(array.length, [...array]);

  return ret;
}
