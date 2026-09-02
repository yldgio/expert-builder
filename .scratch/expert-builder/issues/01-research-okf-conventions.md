# 01 — Research: pin OKF v0.1 conventions

Type: research
Status: resolved
Blocked by: —

## Question

Pin the exact **Open Knowledge Format (OKF) v0.1** conventions we must follow for the Expert Pack Wiki, from primary sources (the OKF spec / repo and the Google Cloud announcement).

Resolve specifically:
- The full YAML frontmatter schema: required vs optional fields, allowed values for `type`, and the meaning of `resource`, `tags`, `timestamp`.
- Directory/bundle conventions: is there a reserved index file, a manifest, a log file? How is a concept's identity derived from its file path?
- Cross-linking convention between concepts.
- Any versioning field for the bundle itself.
- Where the canonical spec lives (URL/repo) so the Pack can cite it as provenance.

Capture findings on a throwaway `research/okf-conventions` branch with a context pointer from this ticket. This unblocks the Wiki-structure decision.

## Answer

Full findings (with citations) saved as asset: [01-okf-findings.md](../assets/01-okf-findings.md).

**Key verified facts (OKF, Apache-2.0, © Google LLC):**

- **Spec has moved to v0.2.** Canonical home is `github.com/GoogleCloudPlatform/open-knowledge-format` → `SPEC.md` (states "Version 0.2"). **There is no standalone v0.1 tag/release/file** — v0.1 survives only as §13 "Changes from v0.1" + Appendix A inside the v0.2 spec. All ecosystem tooling (validators, the reference agent, sample bundles, third-party toolkits like `scaccogatto/okf-skills`, `zosmaai/pi-llm-wiki`) is **v0.2**. → **surfaces new decision, ticket 10.**
- **Frontmatter (v0.1 baseline):** six queryable fields — `type` (the ONLY always-required key), plus recommended `title`, `description`, `resource`, `tags`, `timestamp`. `resource` = URI of the underlying asset (absent for abstract concepts). `timestamp` = ISO-8601 datetime **with explicit offset**. Unknown `type` values MUST be tolerated; extra keys MUST be preserved on round-trip.
- **Bundle = directory tree of markdown files.** Concept identity = **file path minus `.md`**. Only **two reserved filenames**, both optional: `index.md` (progressive-disclosure catalog) and `log.md` (chronological update history, `## YYYY-MM-DD` headings, newest first). **No manifest file.**
- **Cross-links = standard markdown links.** Recommended form is bundle-root-absolute (`/tables/customers.md`); relationships are untyped (conveyed by prose). Broken links MUST be tolerated (not-yet-written knowledge).
- **Versioning:** spec is `<major>.<minor>`; bundles MAY declare `okf_version: "0.2"` in the bundle-root `index.md` (only place frontmatter is allowed in an index). No git release tags exist.
- **v0.2 deltas (if targeted):** BREAKING `timestamp` → `generated.at`; BREAKING body `# Citations` → `sources` frontmatter (per-source credibility + per-claim footnotes); additive optional `verified`/trust-tiers, `status` (draft|stable|deprecated), `stale_after`, new `Attested Computation` type. "Their absence yields a plain v0.1 concept."
- **Provenance:** announcement = Google Cloud blog (June 2026); canonical spec blob sha `c06e3eede0c910d0ecf12524c34204156f8795ac`. Recommended worked example to mirror: the `acme_retail` sample bundle in the canonical repo.

**Uncertainty:** whether `okf_version` existed in v0.1 could not be verified (documented only in the v0.2 spec).
