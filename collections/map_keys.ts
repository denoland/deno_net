// Copyright 2018-2021 the Deno authors. All rights reserved. MIT license.

import { Selector } from "./types.ts";

/**
 * Applies the given transformer to all keys in the given record's entries and returns a new record containing the
 * transformed entries.
 *
 * If the transformed entries contain the same key multiple times, only the last one will appear in the returned record.
 *
 * Example:
 *
 * ```ts
 * import { mapKeys } from "./map_keys.ts";
 *
 * const counts = { a: 5, b: 3, c: 8 }
 *
 * console.assert(mapKeys(counts, it => it.toUpperCase()) === {
 *     A: 5,
 *     B: 3,
 *     C: 8,
 * })
 * ```
 */
export function mapKeys<T>(
  record: Record<string, T>,
  transformer: Selector<string, string>,
): Record<string, T> {
  const ret: Record<string, T> = {};
  const keys = Object.keys(record);

  for (const key of keys) {
    const mappedKey = transformer(key);

    ret[mappedKey] = record[key];
  }

  return ret;
}
