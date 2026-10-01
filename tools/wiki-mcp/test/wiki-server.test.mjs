import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import test from "node:test";

const serverPath = fileURLToPath(new URL("../dist/wiki-server.mjs", import.meta.url));

test("prints CLI usage for --help", () => {
  const result = spawnSync(process.execPath, [serverPath, "--help"], {
    encoding: "utf8",
  });

  assert.equal(result.error, undefined);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Usage:/);
  assert.match(result.stdout, /--wiki\s+<path>/);
  assert.match(result.stdout, /--needs-review-days\s+<n>/);
});
