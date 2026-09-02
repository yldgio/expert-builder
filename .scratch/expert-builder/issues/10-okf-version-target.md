# 10 — Decide OKF target version: v0.1 vs v0.2

Type: grilling
Status: resolved
Blocked by: —

## Question

Surfaced by ticket 01. The user named **OKF v0.1**, but the research found the canonical spec has advanced to **v0.2**, and the entire tooling ecosystem (conformance validators, the reference agent, sample bundles, third-party toolkits) targets **v0.2**. v0.1 no longer exists as a standalone spec artifact — only as a documented baseline inside the v0.2 spec.

Decide which version Expert Pack Wikis are authored against:
- **v0.1** — minimal announced baseline: `type` (required) + `title/description/resource/tags/timestamp`, `index.md`/`log.md`, markdown cross-links, provenance via a body `# Citations` list. Simplest to hand-author; matches the original intent.
- **v0.2** — ecosystem-compatible: `generated.at` instead of `timestamp`, `sources` frontmatter with per-source credibility + per-claim footnotes, optional `verified` trust-tiers / `status` / `stale_after`. Unlocks off-the-shelf validators and MCP servers, and the richer provenance/trust model that directly serves the maintenance loop's "no unverified claims" guardrail.

Trade-off: v0.2's `sources`/`verified`/`stale_after` machinery is a strong fit for the self-maintaining Wiki (tickets 04, 05), at the cost of more structure per concept. A v0.2 bundle with the optional families omitted degrades to a plain v0.1 concept, so v0.2 is a superset, not a fork.

Recommendation to put to the user: **target v0.2** (superset, ecosystem tooling, provenance/staleness fields the maintenance loop wants), authoring the optional families only where they earn their place. Blocks the Wiki-structure decision (04).

## Answer

**Target = OKF v0.2, with a minimal mandatory profile** (option c). v0.2 is a superset that degrades to v0.1, so nothing is lost; it unlocks the ecosystem tooling (validators, MCP servers), and its `sources`/`generated`/`stale_after` model directly serves the "no unverified claims" guardrail and the maintenance loop.

**Provenance pin:** author against `GoogleCloudPlatform/open-knowledge-format` `SPEC.md` at blob sha `c06e3ee…` (the verified v0.2), and declare `okf_version: "0.2"` in the bundle-root `index.md`. No git release tag exists, so the sha is the citable reference.

**Minimal mandatory profile — per concept frontmatter:**
- **Mandatory:** `type`; `title`; `description`; `generated: { by, at }` (authorship + timestamp); `sources` (provenance for every factual claim).
- **Optional / conditional:** `resource` (only when the concept describes a concrete asset); `tags` (recommended for queryability); `stale_after` (the builder **sets it from the Domain Brief's volatility dimension** when a cadence is known, else omitted); `verified` trust tier (set on human review); `status` (defaults `stable`, set only for `draft`/`deprecated`).

**Reserved files mandatory in every Pack** (a deliberate tightening — the spec leaves them optional): `index.md` (carrying `okf_version: "0.2"`, the Expert's progressive-disclosure entry point) and `log.md` (the maintenance loop's append-only audit trail).
