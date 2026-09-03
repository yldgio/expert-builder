# 06 — Design the research bootstrap (scaffold + seed)

Type: grilling
Status: resolved
Blocked by: 02, 04

## Question

Design how a build session **bootstraps** the Wiki: scaffolding the empty OKF skeleton **and** firing an initial seeding research pass so the Pack is born useful.

Decide:
- The split: what gets scaffolded empty (structure, placeholders) vs. what the initial research pass actually fills.
- How the seeding pass is prioritized from the interview output (ticket 02): which concepts get seeded first, how much depth for v1.
- How research runs self-contained inside the builder (inlined technique, subagents or inline) and writes results as OKF concepts with provenance.
- The affordability boundary: how to avoid blocking the build on exhaustively researching everything.
- The handoff to the maintenance skill for everything not seeded now.

Depends on the interview design (02) and Wiki structure (04).

## Answer

Builds on the scaffold-vs-seed seam (ticket 04) and the embedded research + OKF write procedure (ticket 05).

- **Priority (task-driven):** seeding order is driven by the **Domain Brief's audience tasks/questions** — seed the concepts needed to answer the Expert's most important tasks first, with a foundational `Glossary` seeded early for shared vocabulary. (Tasks define "expert enough", so their supporting concepts come first.)
- **Depth, budget & approval:** **breadth-first and shallow** — one solid, well-sourced concept per priority item, not a deep-dive on a few. Bounded by a **budget: the top-N priority concepts, with the builder proposing the list + N and the user confirming**; the rest is deferred. "Born useful, not exhaustive."
- **Reuse the maintenance procedure:** seeding **is the `refresh` write-procedure in "create mode"** — same embedded (harness-tool) research, same OKF write (`sources` + `generated{by,at}` + `stale_after` from brief volatility), same `log.md` logging (a `Seeding` entry), same unreachable-source flagging (flag, never fabricate). Guarantees seeded concepts are identical in shape/provenance to maintained ones; the builder and the bundled `refresh` skill share one research procedure. Parallelize per-concept via subagents where the harness supports them, else inline.
- **Hand-off for the un-seeded:** priority topics below the budget line, plus the skill/knowledge **gaps** logged in ticket 03, are recorded in a **`Gaps` section of the Domain Brief** (carrying each item's intended sources from the brief) *and* surfaced as **"not yet written" entries in `index.md`**. The maintenance skill's "add in-scope concept" path consumes the brief's gaps list on later runs (an empty placeholder has no `sources` to re-fetch — the brief's source pointers are what maintenance needs). The builder may also offer to continue seeding in another pass.
