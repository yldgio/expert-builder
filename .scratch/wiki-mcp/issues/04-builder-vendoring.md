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
- `assets/templates/AGENTS.md.tmpl`: the wiki-reading and answering protocol (§3–§4) teaches the
  Expert to **prefer the Wiki MCP tools** when the `wiki` server is available — `wiki_search` to
  find, `wiki_get_concept` to read and cite, `wiki_status` for freshness — and to **surface
  `stale` / `needs_review` state when citing a concept**. It must keep the current file-based
  protocol as the fallback for when the server is not running (a Pack works without Node; the
  tooling just degrades).
- The sample Pack (`samples/azure-ai-search-rag-expert/`) is aligned: vendored bundle under
  `.mcp/`, the `wiki` entry merged into its existing `.mcp.json` (keeping `microsoft.docs.mcp`),
  and its `AGENTS.md` refreshed from the updated template.
- `CONTEXT.md`, root `README.md` (Pack contents + repository layout), and the wayfinder map's Pack
  layout diagram are updated to show the new default component.

## Acceptance

- Building a fresh Pack (or re-running the scaffold steps by hand) produces
  `<pack>/.mcp/wiki-server.mjs` plus a merged `.mcp.json`; launching Copilot CLI in the Pack lists
  the `wiki` server and its seven tools.
- A Pack whose `.mcp.json` already has another server (e.g. the sample's `microsoft.docs.mcp`)
  keeps it after the merge.
- A generated Expert's `AGENTS.md` instructs Wiki-MCP-first wiki reading with the file-based
  fallback, and the sample Pack matches what the builder now produces.
