# Wiki MCP: purpose-built TypeScript server, vendored as a single bundled file

Status: accepted (2026-10-01)

Wiki MCP indexes an Expert Pack's Wiki and serves retrieval, update-state, and graph tools. We
decided to **purpose-build** it in TypeScript, bundle it with esbuild into one self-contained
`.mjs`, and **vendor that file into every Pack** (`.mcp/wiki-server.mjs`, spawned by the Pack's
`.mcp.json`), accepting **Node.js ≥ 20 as a documented Pack prerequisite** — because no existing
MCP server implements OKF v0.2 semantics (`stale_after`, derived trust tiers, `sources`), which is
the component's whole reason to exist.

## Considered Options

- **Adapt an existing markdown/wiki MCP server** — rejected: the closest functional analog
  (`basic-memory`) is AGPL-3.0, which blocks vendoring into an MIT Pack; the Obsidian servers are
  write-oriented or coupled to a running Obsidian app; none know OKF staleness/trust semantics.
- **Python + FastMCP via PEP 723 (`uv run server.py`)** — rejected: requires `uv` installed and
  network access on first run, breaking the Pack's self-containment.
- **Python stdlib-only (sqlite3 FTS5, hand-rolled MCP protocol)** — rejected: FTS5's built-in BM25
  is genuinely credible, but hand-rolling the protocol trades away the officially maintained SDK
  for no portability gain (Python is no more guaranteed on Windows than Node).
- **Go single binary** — rejected: zero user prerequisites, but binaries are per-OS, so a vendored
  Pack would only work on the OS it was built on; also adds a second toolchain to this repo.
- **FlexSearch instead of MiniSearch** — rejected: both fit; MiniSearch is smaller (5.8 KB gz),
  zero-dependency, MIT, and its `boost` + `filter` API maps directly onto our search spec.

## Consequences

- Packs gain a documented Node ≥ 20 prerequisite (standard for MCP servers; Copilot CLI itself can
  be installed without Node, so this must be visible in the Pack README).
- This repo gains a TypeScript toolchain under `tools/wiki-mcp/`; the vendored artifact is a build
  output, refreshed into `.agents/skills/expert-builder/assets/wiki-mcp/`.
- The builder must **merge** (never overwrite) the Pack's `.mcp.json` when adding the `wiki` entry.
- If the Node prerequisite ever proves too heavy, the fallback is per-OS binaries or a `uv` variant
  — the tool surface and index semantics (spec) are unaffected by the runtime choice.
