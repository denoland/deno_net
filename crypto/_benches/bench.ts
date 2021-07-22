#!/usr/bin/env -S deno run
import {
  bench,
  runBenchmarks,
} from "https://deno.land/std@0.102.0/testing/bench.ts";
import { createHash } from "https://deno.land/std@0.102.0/hash/mod.ts";
import { assert, assertEquals } from "../../testing/asserts.ts";

import stdCrypto from "../mod.ts";

const webCrypto = globalThis.crypto;

// WASM is limited to 32-bit operations, which SHA-256 is optimized for, while
// SHA-512 is optimized for 64-bit operations and may be slower.
for (const algorithm of ["SHA-256", "SHA-512"] as const) {
  for (
    const length of [
      64,
      262_144,
      4_194_304,
      67_108_864,
      524_291_328,
    ] as const
  ) {
    // Create a test input buffer and do some operations to hopefully ensure
    // it's fully initialized and not optimized away.
    const buffer = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      buffer[i] = ((i + i % 13) + i % 31) % 255;
    }
    let sum = 0;
    for (const byte of buffer) {
      sum += byte;
    }
    assert(sum > 0);

    for (
      const implementation of [
        "runtime WebCrypto (target)",
        "std@0.102.0/hash WASM (baseline)",
        "std/crypto WASM   (you are here)",
      ] as const
    ) {
      let lastDigest: ArrayBuffer | undefined;

      bench({
        name: `${algorithm.padEnd(12)} ${
          length.toString().padStart(12)
        }B ${implementation}`,
        async func(timer) {
          timer.start();

          let digest;
          if (implementation === "std/crypto WASM   (you are here)") {
            digest = stdCrypto.subtle.digestSync(algorithm, buffer);
          } else if (implementation === "runtime WebCrypto (target)") {
            digest = await webCrypto.subtle.digest(algorithm, buffer);
          } else if (implementation === "std@0.102.0/hash WASM (baseline)") {
            digest = createHash(
              algorithm.toLowerCase().replace("-", "") as "sha256" | "sha512",
            ).update(buffer).digest();
          } else {
            throw new Error(`Unknown implementation ${implementation}`);
          }

          timer.stop();

          assert(digest.byteLength > 0);
          if (lastDigest) {
            assertEquals(lastDigest, digest);
          }
          lastDigest = digest;
        },
        runs: 10,
      });
    }
  }
}

await runBenchmarks();
