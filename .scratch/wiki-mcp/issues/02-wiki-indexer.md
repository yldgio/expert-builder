# 02 — OKF indexer, update-state derivation, and graph index

Type: task
Status: open
Blocked by: 01

## Scope

The in-memory indexing core of Wiki MCP, per [spec §4–§6](../spec.md):

- **Concept set**: all `.md` under `--wiki`, excluding reserved `index.md` / `log.md`; read
  `okf_version` from the bundle-root `index.md` when present and warn on unsupported major version.
- **Parsing**: gray-matter frontmatter + body. Malformed files (bad YAML, missing mandatory fields)
  are skipped and collected as warnings — never fatal (spec §8).
- **Update state**: derive per concept the object in spec §5 (`stale`, `trust_tier`,
  `last_verified_at`, `days_since_verified`, `needs_review` with the `--needs-review-days`
  threshold, default 7).
- **Search index**: MiniSearch — `title`/`description`/`tags` boosted over body; `type` filterable.
- **Graph**: nodes = concepts; edges = directed markdown cross-links (bundle-root-absolute and
  relative resolved) + undirected shared-tag pairs. Broken links tolerated, recorded as dangling.
- **Lifecycle**: full build at startup; per-call mtime sweep re-parsing only changed files;
  explicit full rebuild entry point for `wiki_reindex`.

## Acceptance

- Unit tests over the fixture wiki (ticket 05) cover: frontmatter parsing, update-state derivation
  for a stale / an unverified / a needs-review concept, link and shared-tag edges, malformed-file
  warning collection, and mtime-sweep re-parse of a changed file.
