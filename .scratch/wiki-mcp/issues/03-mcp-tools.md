# 03 — MCP stdio server and the seven tools

Type: task
Status: open
Blocked by: 02

## Scope

Wire the indexer (ticket 02) into an MCP server over stdio, per [spec §3, §7](../spec.md):

- argv parsing: `--wiki <path>` required (fail fast when the path does not exist),
  `--needs-review-days <n>` (default 7).
- Tools with input schemas: `wiki_search`, `wiki_get_concept`, `wiki_list`, `wiki_status`,
  `wiki_related`, `wiki_graph`, `wiki_reindex`.
- Response convention: markdown for document-shaped answers (`wiki_get_concept`, `wiki_search`),
  JSON for data-shaped answers (`wiki_list`, `wiki_status`, `wiki_related`, `wiki_graph`,
  `wiki_reindex`).
- Every retrieval response embeds the per-concept update state (spec §5); `wiki_status` carries the
  `warnings` section (spec §8).

## Acceptance

- Scripted smoke over stdio against the fixture wiki: all seven tools respond with the documented
  shapes.
- `node dist/wiki-server.mjs --wiki ./does-not-exist` exits non-zero with a clear message.
