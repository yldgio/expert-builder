# 06 — Design the research bootstrap (scaffold + seed)

Type: grilling
Status: open
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
