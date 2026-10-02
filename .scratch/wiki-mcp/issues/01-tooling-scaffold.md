# 01 — Scaffold `tools/wiki-mcp` with a single-file bundle build

Type: task
Status: done
Resolved in: feat/wiki-mcp @ fa2a1bc (wave 1, session ecd010d7)

## Scope

Create the `tools/wiki-mcp/` package: TypeScript source layout, `package.json` (`engines:
node >= 20`), and an esbuild build script that emits **one self-contained ESM file**,
`dist/wiki-server.mjs`.

Dependencies: MCP TypeScript SDK (`@modelcontextprotocol/sdk`, or the server-scoped
`@modelcontextprotocol/server` if sufficient), `minisearch`, `gray-matter`; `esbuild` and
`typescript` as dev dependencies. All runtime deps must be pure JS with no native modules (see
[ADR 0001](../../../docs/adr/0001-wiki-mcp-stack.md)).

Set up `node --test` as the lite test runner.

## Acceptance

- `npm run build` in `tools/wiki-mcp/` emits a single `dist/wiki-server.mjs` with all dependencies
  inlined.
- `node dist/wiki-server.mjs --help` runs and prints usage (including `--wiki` and
  `--needs-review-days`).
- No native modules anywhere in the dependency tree.
