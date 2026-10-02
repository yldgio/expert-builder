import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { buildIndex } from "../dist/wiki-server.mjs";

const serverPath = fileURLToPath(new URL("../dist/wiki-server.mjs", import.meta.url));

test("exports the indexer API from the built server bundle", () => {
  assert.equal(typeof buildIndex, "function");
});

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
