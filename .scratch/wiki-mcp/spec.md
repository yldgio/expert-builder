# Spec: Wiki MCP

**Status: Design settled (2026-10-01), pending implementation** — design produced by a grilling
session; the numbered tickets under `issues/` are the implementation plan. Canonical vocabulary is
in [`CONTEXT.md`](../../CONTEXT.md); the stack decision is recorded in
[ADR 0001](../../docs/adr/0001-wiki-mcp-stack.md).

## 1. Purpose & shape

**Wiki MCP** is a read-only MCP server vendored into every Expert Pack. It indexes the Pack's Wiki
(an OKF v0.2 bundle) and serves retrieval, update-state, and graph tools, so the Expert and its
tooling (including the `refresh` skill) can query the Wiki structurally instead of re-parsing
markdown by hand.

Hard requirements:

- **Portable**: vendored as a single self-contained file inside the Pack; no install step and no
  network access at run time.
- **Read-only**: it never writes to the Wiki. Mutation is the `refresh` skill's job; Wiki MCP
  informs, the skill acts.
- **OKF-native**: update state derives from the OKF v0.2 profile (`stale_after`, `verified`,
  `generated`), not from a parallel convention.

## 2. Stack & build

TypeScript source in `tools/wiki-mcp/`, bundled with esbuild into one self-contained ESM file,
`dist/wiki-server.mjs`. Dependencies: the MCP TypeScript SDK (`@modelcontextprotocol/sdk`, or the
server-scoped `@modelcontextprotocol/server` if it proves sufficient), MiniSearch (full-text),
gray-matter (YAML frontmatter). All are MIT/Apache-2.0, pure JS, no native modules; esbuild
bundling has no known blockers.

Run-time prerequisite for a Pack consuming Wiki MCP: **Node.js ≥ 20 on `PATH`** (documented in the
Pack README). The graph index needs no library at this corpus scale (tens to low-hundreds of
concepts).

```
tools/wiki-mcp/
  package.json           # engines: node >= 20
  src/                   # TypeScript source
  dist/wiki-server.mjs   # build artifact (the vendored file)
  test/                  # lite smoke tests + fixture wiki
```

## 3. Configuration & `.mcp.json` contract

One Wiki per server instance. Configuration is argv-only (explicit, visible in `.mcp.json`):

- `--wiki <path>` — **required**; the server fails fast at startup if the path does not exist.
- `--needs-review-days <n>` — threshold for the `needs_review` flag (default: `7`).

The Pack's `.mcp.json` (at Pack root) spawns it with paths relative to the Pack root:

```json
{
  "mcpServers": {
    "wiki": {
      "type": "stdio",
      "command": "node",
      "args": [".mcp/wiki-server.mjs", "--wiki", "./wiki"],
      "tools": ["*"]
    }
  }
}
```

## 4. Indexing

In-memory only; nothing persisted inside the Pack.

- **Concept set**: every `.md` file under `wiki/`, excluding the reserved files `index.md` and
  `log.md`. If the bundle-root `index.md` declares `okf_version`, an unsupported major version
  produces a startup warning, not a failure.
- **Lifecycle**: full index build at startup; on each tool call, a cheap mtime sweep re-parses only
  changed files (so the index is always current after a `refresh` run); the `wiki_reindex` tool
  forces a full rebuild.
- **Search index**: MiniSearch; `title`, `description`, and `tags` boosted over body text; `type`
  available as a filter. `sources[]` stay out of search (visible via `wiki_get_concept`).

## 5. Update-state semantics

Every retrieval response embeds, per concept, a derived update-state object (derived, never
stored — mirrors the OKF profile's trust-tier rule):

```json
{
  "stale": false,
  "stale_after": "2026-12-02T00:00:00Z",
  "trust_tier": "machine-confirmed",
  "last_verified_at": "2026-09-03T10:22:00Z",
  "days_since_verified": 28,
  "needs_review": true
}
```

- **stale**: `now >= stale_after` when `stale_after` is set (OKF-canonical staleness); `false`
  otherwise.
- **trust_tier**: `unverified` (no `verified` key) / `machine-confirmed` (non-`human:` verifiers
  only) / `human-reviewed` (any `human:<id>` verifier) — exactly as the OKF profile derives it.
- **days_since_verified**: days since the latest `verified[].at`, falling back to `generated.at`;
  `null` when neither exists.
- **needs_review**: `days_since_verified > needs_review_days` (default 7). A re-verification nudge,
  especially for concepts that carry no `stale_after`.

## 6. Graph index

- **Nodes**: concepts (identity = bundle path minus `.md`).
- **Edges**: (a) `link` — directed, from markdown cross-links in concept bodies
  (bundle-root-absolute and relative links resolved); broken links tolerated per OKF, recorded but
  pointing nowhere. (b) `shared-tag` — undirected, between concepts sharing a tag.
- Sources-as-nodes (concept→source citation edges for refresh impact analysis) are **deferred to
  v2**.

## 7. Tool surface

Seven tools. Response convention: **markdown for document-shaped answers, JSON for data-shaped
answers**.

| Tool | Shape | Returns |
|---|---|---|
| `wiki_search(query, type?, tag?, limit?)` | markdown | Ranked matches: path, title, snippet, one-line update state |
| `wiki_get_concept(path)` | markdown | Frontmatter summary + body + update-state block |
| `wiki_list(type?, tag?, stale?, needs_review?)` | JSON | Concept list: path, title, type, tags, update state |
| `wiki_status()` | JSON | Whole-wiki report: counts and lists by update state, `warnings` (skipped files + reasons), index metadata |
| `wiki_related(path, depth?=1)` | JSON | Graph neighbors with edge kind (`link` in/out, `shared-tag`) and each neighbor's update state |
| `wiki_graph()` | JSON | Full graph: `{ nodes, edges }` |
| `wiki_reindex()` | JSON | Rebuild report: files indexed, files skipped with reasons |

## 8. Error posture

Tolerate, never brick: a malformed concept file (bad YAML, missing mandatory fields) is skipped and
surfaced in `wiki_status` under `warnings`; the rest of the Wiki keeps working. The only fatal
error is a `--wiki` path that does not exist. Silent tolerance is not allowed — every skipped file
is visible exactly where a maintainer looks.

## 9. Vendoring into Packs (builder changes)

Wiki MCP is a **default component of every Pack**, like the `refresh` skill. Because the
expert-builder skill folder must stay self-contained, the built bundle lives at
`.agents/skills/expert-builder/assets/wiki-mcp/wiki-server.mjs` (refreshed from
`tools/wiki-mcp/dist/` by a build script). At scaffold time the builder:

1. Copies the bundle to `<pack>/.mcp/wiki-server.mjs`.
2. **Merges** the `wiki` entry (§3) into the Pack's `.mcp.json` — never overwrites entries that
   step 6 may already have emitted.
3. Documents the Node ≥ 20 prerequisite via the README template.
4. Checks the vendored file's presence in the Pack acceptance criteria (self-check step).
5. Updates `assets/templates/AGENTS.md.tmpl` so every generated Expert's wiki-reading and answering
   protocol prefers the Wiki MCP tools when the `wiki` server is running: search via `wiki_search`,
   read via `wiki_get_concept`, check freshness via `wiki_status`, and surface `stale` /
   `needs_review` state when citing a concept. The template must keep a **file-based fallback**
   (read `wiki/index.md`, then the concepts) for when the server is unavailable — Node is a
   prerequisite for the tooling, never for the Pack's basic function.

Main documentation follows suit: the root `README.md` (Pack contents, repository layout) and the
builder's `SKILL.md` (scaffold + self-check steps) both gain Wiki MCP as a default Pack component.

## 10. Validation

**Lite** smoke tests only: a small fixture wiki under `tools/wiki-mcp/test/fixtures/` (cross-links,
shared tags, a stale concept, an unverified concept, one malformed file) plus one test that indexes
[`samples/azure-ai-search-rag-expert/wiki/`](../../samples/azure-ai-search-rag-expert/wiki) and
exercises all seven tools. The two real Packs under `experts/` (`fabric-iq-expert`,
`github-devsecops-expert`) serve as manual validation targets.

## Out of scope (v1)

- Write tools of any kind (mutation stays with `refresh`).
- Sources-as-nodes graph edges (v2).
- Persisted/disk index, filesystem watchers.
- Per-OS compiled binaries (rejected: breaks cross-platform vendoring — see ADR 0001).
