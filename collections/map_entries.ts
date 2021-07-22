// Copyright 2018-2021 the Deno authors. All rights reserved. MIT license.

import { Selector } from "./types.ts";

/**
 * Applies the given transformer to all entries in the given record and returns a new record containing the results
 *
 * Example:
 *
 * ```ts
 * import { mapEntries } from "./map_entries.ts";
 *
 * const usersById = {
 *     'a2e': { name: 'Kim', age: 22 },
 *     'dfe': { name: 'Anna', age: 31 },
 *     '34b': { name: 'Tim', age: 58 },
 * } as const;
 *
 * const agesByNames = mapEntries(usersById,
 *     ([ id, { name, age } ]) => [ name, age ],
 * )
 *
 * console.assert(agesByNames === {
 *     'Kim': 22,
 *     'Anna': 31,
 *     'Tim': 58,
 * })
 * ```
 */
export function mapEntries<T, O>(
  record: Record<string, T>,
  transformer: Selector<[string, T], [string, O]>,
): Record<string, O> {
  const ret: Record<string, O> = {};
  const entries = Object.entries(record);

  for (const entry of entries) {
    const [mappedKey, mappedValue] = transformer(entry);

    ret[mappedKey] = mappedValue;
  }

  return ret;
}
