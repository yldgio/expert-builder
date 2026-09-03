# 09 — Prototype a sample Expert Pack to validate the design

Type: prototype
Status: resolved
Blocked by: 08

## Question

Hand-build one small **Expert Pack** for a throwaway domain to react to the design before committing to building the skill — a cheap, concrete artifact that stress-tests the shape.

Validate:
- Does the OKF Wiki + AGENTS.md + maintenance skill layout actually feel expert when launched in Copilot CLI?
- Are the frontmatter/provenance conventions workable by hand (a proxy for whether an agent can maintain them)?
- Does the maintenance loop meaningfully update a concept?
- What in the ticket-08 spec breaks on contact with reality?

Link the prototype as an asset. Feed findings back into the spec (08) before the build session begins.

## Answer

**Verdict: the design holds.** A full sample Pack — a **Conventional Commits expert** — was hand-built (grounded in the real spec, no fabricated facts) and passed the spec §10 acceptance checklist mechanically: mandatory core present; `okf_version: "0.2"` in `index.md`; every concept carries the mandatory OKF profile; all bundle-root-absolute cross-links resolve; every claim-bearing concept has a footnote citation.

**Prototype artifact:** captured on throwaway branch `prototype/sample-pack` (context pointer below); not kept on `main`.

**What was validated:**
- **Hand-buildable = agent-buildable (proxy).** The layout + OKF v0.2 profile is regular enough that a mechanical self-check (the §10 checklist) passes — a good sign the builder can emit and self-verify it.
- **Seeding = refresh-in-create-mode is real.** Filling the `faq/semver-mapping` gap used the identical write shape (frontmatter + `sources` + footnotes) and flowed through `index.md`, the brief `Gaps`, and `log.md` — seeded and maintained concepts came out identical.
- **Provenance model works by hand.** `sources` frontmatter + per-claim footnotes made "no unverified claims" concrete — only fetched facts could be written.
- **Six-section `AGENTS.md`** reads as genuinely expert-guiding; `brief.md` as scope source + `log.md` as audit trail + `Gaps` as the create-mode worklist all cohere.
- **`stale_after` from brief volatility** ("check ~yearly" → +1y) worked exactly as intended.

**Findings folded into `spec.md`:**
1. **Pin the exact v0.2 sub-schemas before authoring templates.** The precise YAML of `generated`, `sources` (per-source fields), and `verified` (trust-tier values) was never pinned by the ticket-01 research; the prototype used plausible approximations (`verified: machine-confirmed`, `sources[].version`, `generated.by: expert-builder@seed`). Added as a **pre-build task** in spec §4 (read `SPEC.md` at the pinned sha; validate a sample).
2. **Create-mode is a three-place atomic update** (concept file + `index.md` + brief `Gaps`, then `log.md`) — easy to desync if done piecemeal. Made explicit in spec §7.

Neither finding invalidates any decision; both are refinements to the build-plan. No new tickets required.
