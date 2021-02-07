import { walk } from "../../fs/walk.ts";
import { basename, dirname, fromFileUrl } from "../../path/mod.ts";
import { assertEquals, fail } from "../../testing/asserts.ts";
import { config, testList } from "./common.ts";

/**
 * This script will run the test files specified in the configuration file
 * 
 * Each test file will be run independently and wait until completion, if an abnormal
 * code for the test is reported, the test suite will fail inmediately
 */

const process = Deno.run({
  cwd: dirname(fromFileUrl(import.meta.url)),
  cmd: [
    Deno.execPath(),
    "run",
    "--allow-read",
    "--allow-net",
    "--allow-write",
    "./setup.ts",
  ],
});

const { code } = await process.status();
if (code !== 0) {
  fail(`Node tests generation process failed with code: "${code}"`);
}

const dir = walk(fromFileUrl(new URL(config.suitesFolder, import.meta.url)), {
  includeDirs: false,
  match: testList,
});

for await (const file of dir) {
  Deno.test({
    name: `Node test runner: ${basename(file.path)}`,
    fn: async () => {
      const process = Deno.run({
        cwd: dirname(fromFileUrl(import.meta.url)),
        cmd: [
          "deno",
          "run",
          "-A",
          "--unstable",
          "require.ts",
          file.path,
        ],
      });

      const { code } = await process.status();
      process.close();

      assertEquals(code, 0);
    },
  });
}
