// Copyright 2018-2019 the Deno authors. All rights reserved. MIT license.
import { platform, run } from "deno";

// Runs a command in cross-platform way
export function xrun(opts) {
  return run({
    ...opts,
    args: platform.os === "win" ? ["cmd.exe", "/c", ...opts.args] : opts.args
  });
}
