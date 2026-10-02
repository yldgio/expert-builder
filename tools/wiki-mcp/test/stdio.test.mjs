import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import { once } from "node:events";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { createInterface } from "node:readline";
import { fileURLToPath } from "node:url";
import test from "node:test";

const serverPath = fileURLToPath(new URL("../dist/wiki-server.mjs", import.meta.url));
const fixturePath = fileURLToPath(new URL("./fixtures/wiki/", import.meta.url));

function createClient(child) {
  const pending = new Map();
  const lines = createInterface({ input: child.stdout });

  lines.on("line", (line) => {
    const message = JSON.parse(line);
    if (message.id !== undefined) {
      pending.get(message.id)?.(message);
      pending.delete(message.id);
    }
  });
  child.once("close", (code, signal) => {
    for (const [id, resolve] of pending) {
      pending.delete(id);
      resolve({
        error: { message: `Server closed (${code ?? signal}) before replying to ${id}.` },
      });
    }
  });

  return {
    notify(method, params) {
      child.stdin.write(`${JSON.stringify({ jsonrpc: "2.0", method, params })}\n`);
    },
    request(id, method, params = {}) {
      return new Promise((resolve, reject) => {
        pending.set(id, (message) => {
          clearTimeout(timeout);
          if (message.error) {
            reject(new Error(message.error.message));
          } else {
            resolve(message.result);
          }
        });
        const timeout = setTimeout(() => {
          pending.delete(id);
          reject(new Error(`Timed out waiting for ${method}.`));
        }, 5000);
        child.stdin.write(`${JSON.stringify({ jsonrpc: "2.0", id, method, params })}\n`);
      });
    },
  };
}

async function closeServer(child) {
  if (child.exitCode === null && child.signalCode === null) {
    child.kill();
    await once(child, "close");
  }
}

test("serves all seven tools over stdio with documented response shapes", async () => {
  const child = spawn(process.execPath, [serverPath, "--wiki", fixturePath], {
    stdio: ["pipe", "pipe", "pipe"],
  });
  const client = createClient(child);

  try {
    const initialized = await client.request(1, "initialize", {
      protocolVersion: "2024-11-05",
      capabilities: {},
      clientInfo: { name: "wiki-mcp-smoke", version: "0.1.0" },
    });
    assert.ok(initialized.serverInfo);
    client.notify("notifications/initialized");

    const { tools } = await client.request(2, "tools/list");
    assert.deepEqual(
      tools.map(({ name }) => name).sort(),
      [
        "wiki_get_concept",
        "wiki_graph",
        "wiki_list",
        "wiki_reindex",
        "wiki_related",
        "wiki_search",
        "wiki_status",
      ],
    );
    const toolByName = new Map(tools.map((tool) => [tool.name, tool]));
    assert.deepEqual(toolByName.get("wiki_search").inputSchema.required, ["query"]);
    assert.deepEqual(toolByName.get("wiki_get_concept").inputSchema.required, ["path"]);
    assert.deepEqual(toolByName.get("wiki_related").inputSchema.required, ["path"]);
    assert.equal(toolByName.get("wiki_search").inputSchema.properties.query.type, "string");
    assert.equal(toolByName.get("wiki_search").inputSchema.properties.type.type, "string");
    assert.equal(toolByName.get("wiki_search").inputSchema.properties.tag.type, "string");
    assert.equal(toolByName.get("wiki_search").inputSchema.properties.limit.type, "integer");
    assert.equal(
      toolByName.get("wiki_get_concept").inputSchema.properties.path.type,
      "string",
    );
    assert.equal(toolByName.get("wiki_related").inputSchema.properties.depth.type, "integer");
    assert.equal(toolByName.get("wiki_related").inputSchema.properties.depth.default, 1);
    assert.deepEqual(toolByName.get("wiki_list").inputSchema.required ?? [], []);
    assert.equal(toolByName.get("wiki_list").inputSchema.properties.type.type, "string");
    assert.equal(toolByName.get("wiki_list").inputSchema.properties.tag.type, "string");
    assert.equal(toolByName.get("wiki_list").inputSchema.properties.stale.type, "boolean");
    assert.equal(
      toolByName.get("wiki_list").inputSchema.properties.needs_review.type,
      "boolean",
    );
    for (const name of ["wiki_status", "wiki_graph", "wiki_reindex"]) {
      assert.deepEqual(toolByName.get(name).inputSchema.required ?? [], []);
    }

    const call = async (id, name, arguments_) =>
      client.request(id, "tools/call", { name, arguments: arguments_ });
    const search = await call(3, "wiki_search", { query: "stale retrieval" });
    assert.equal(search.content[0].type, "text");
    assert.match(search.content[0].text, /retrieval\/stale/);
    assert.match(search.content[0].text, /stale=true/);
    assert.match(search.content[0].text, /snippet/i);

    const concept = await call(4, "wiki_get_concept", { path: "retrieval/stale" });
    assert.equal(concept.content[0].type, "text");
    assert.match(concept.content[0].text, /Frontmatter/i);
    assert.match(concept.content[0].text, /# Stale retrieval/);
    assert.match(concept.content[0].text, /Update state/i);

    const listResult = JSON.parse((await call(5, "wiki_list", {})).content[0].text);
    assert.ok(Array.isArray(listResult));
    assert.ok(listResult.some(({ path, update_state }) =>
      path === "retrieval/stale" && update_state.stale === true));

    const status = JSON.parse((await call(6, "wiki_status", {})).content[0].text);
    assert.ok(status.counts);
    assert.ok(status.by_update_state);
    assert.ok(status.warnings.some(({ path }) => path === "retrieval/malformed.md"));
    assert.ok(status.index);

    const related = JSON.parse(
      (await call(7, "wiki_related", { path: "retrieval/stale" })).content[0].text,
    );
    assert.ok(
      related.neighbors.some(
        ({ path, edge_kind, update_state }) =>
          path === "retrieval/needs-review" &&
          edge_kind === "link" &&
          update_state.needs_review === true,
      ),
    );
    assert.ok(
      related.neighbors.some(
        ({ path, edge_kind }) =>
          path === "retrieval/needs-review" && edge_kind === "shared-tag",
      ),
    );

    const graph = JSON.parse((await call(8, "wiki_graph", {})).content[0].text);
    assert.ok(Array.isArray(graph.nodes));
    assert.ok(Array.isArray(graph.edges));
    assert.ok(graph.nodes.every(({ update_state }) => update_state));

    const reindex = JSON.parse((await call(9, "wiki_reindex", {})).content[0].text);
    assert.ok(reindex.indexed > 0);
    assert.ok(reindex.skipped.some(({ path }) => path === "retrieval/malformed.md"));
  } finally {
    await closeServer(child);
  }
});

test("sweeps changed Wiki files before serving a tool call", async () => {
  const wikiPath = await mkdtemp(path.join(os.tmpdir(), "wiki-mcp-stdio-"));
  const conceptDirectory = path.join(wikiPath, "pages");
  const child = spawn(process.execPath, [serverPath, "--wiki", wikiPath], {
    stdio: ["pipe", "pipe", "pipe"],
  });
  const client = createClient(child);

  try {
    await mkdir(conceptDirectory);
    await writeFile(
      path.join(conceptDirectory, "initial.md"),
      `---
type: Reference
title: Initial concept
description: Initial integration fixture.
generated: { by: test/v1, at: 2026-10-01T10:00:00Z }
sources: []
---
Initial concept.
`,
    );
    await client.request(1, "initialize", {
      protocolVersion: "2024-11-05",
      capabilities: {},
      clientInfo: { name: "wiki-mcp-sweep-smoke", version: "0.1.0" },
    });
    client.notify("notifications/initialized");

    await writeFile(
      path.join(conceptDirectory, "added-after-start.md"),
      `---
type: Reference
title: Added after startup
description: Verifies the tool call mtime sweep.
generated: { by: test/v1, at: 2026-10-01T10:00:00Z }
sources: []
---
The integrationfreshnessmarker is available after startup.
`,
    );
    const result = await client.request(2, "tools/call", {
      name: "wiki_search",
      arguments: { query: "integrationfreshnessmarker" },
    });
    assert.match(result.content[0].text, /pages\/added-after-start/);
  } finally {
    await closeServer(child);
    await rm(wikiPath, { recursive: true, force: true });
  }
});

test("fails fast when the wiki path does not exist", () => {
  const result = spawnSync(process.execPath, [serverPath, "--wiki", "./does-not-exist"], {
    cwd: fileURLToPath(new URL("..", import.meta.url)),
    encoding: "utf8",
  });

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /wiki.*(does not exist|not found|directory)/i);
});
