# 04 — Vendor Wiki MCP into every Expert Pack

Type: task
Status: open
Blocked by: 03

## Scope

Builder-side changes making Wiki MCP a default Pack component, per [spec §9](../spec.md):

- A build/refresh step copies `tools/wiki-mcp/dist/wiki-server.mjs` to
  `.agents/skills/expert-builder/assets/wiki-mcp/wiki-server.mjs` so the builder skill folder stays
  self-contained.
- `SKILL.md` scaffold step: copy the bundle to `<pack>/.mcp/wiki-server.mjs` and **merge** the
  `wiki` entry (spec §3) into the Pack's `.mcp.json` — never overwrite entries already emitted for
  optional MCP servers.
- Pack skeleton gains `.mcp/`; README template documents the Node ≥ 20 prerequisite; the build
  self-check asserts the vendored file and `.mcp.json` entry exist.
- `CONTEXT.md`, root `README.md` (Pack contents + repository layout), and the wayfinder map's Pack
  layout diagram are updated to show the new default component.

## Acceptance

- Building a fresh Pack (or re-running the scaffold steps by hand) produces
  `<pack>/.mcp/wiki-server.mjs` plus a merged `.mcp.json`; launching Copilot CLI in the Pack lists
  the `wiki` server and its seven tools.
- A Pack whose `.mcp.json` already has another server (e.g. the sample's `microsoft.docs.mcp`)
  keeps it after the merge.
