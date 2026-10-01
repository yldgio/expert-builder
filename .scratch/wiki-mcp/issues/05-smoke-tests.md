# 05 — Lite smoke tests

Type: task
Status: open
Blocked by: 03

## Scope

**Lite** validation only, per [spec §10](../spec.md) — no exhaustive suite:

- `tools/wiki-mcp/test/fixtures/wiki/`: a minimal OKF v0.2 bundle with cross-links, shared tags, a
  stale concept (`stale_after` passed), an unverified concept (no `verified` key), a concept past
  the 7-day review threshold, and one malformed file.
- `node --test` smoke: index the fixture; call all seven tools; assert the key fields of each
  response shape and that the malformed file appears in `wiki_status().warnings`.
- One test indexes `samples/azure-ai-search-rag-expert/wiki/` and asserts all eight seeded concepts
  are indexed without warnings.
- Manual pass: run the built server against `experts/fabric-iq-expert/wiki/` and
  `experts/github-devsecops-expert/wiki/`.

## Acceptance

- `npm test` in `tools/wiki-mcp/` passes.
- No test requires network access.
