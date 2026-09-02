# 02 — Design the domain-scoping interview

Type: grilling
Status: resolved
Blocked by: —

## Question

Design the **interview** the Expert Builder runs at invocation — the grilling-style, breadth-then-depth conversation that turns the user's first sentence about a domain into a precise, bounded scope.

Decide:
- The opening move: what the builder does with the user's initial domain seed (if any) vs. a cold start.
- The question strategy: how it grills like `grilling` (rounds, recommended answers) while staying **inlined** (no dependency on the grilling skill).
- What it must pin before scaffolding: the domain **boundary** (in/out of scope), the intended Expert's audience and tasks, known **design problems** to solve up front, and success criteria for "expert enough".
- The output artifact of the interview: a domain brief / charter that drives scaffolding — its shape and where it lands in the Pack.
- Stop condition: when the interview is "done enough" to start building.

This is the heart of the builder; its output feeds the AGENTS.md template and the research bootstrap.

## Answer

- **Opening move:** accept an optional domain **seed** if the user passed one at invocation; otherwise open by asking for it. Then grill either way — one flow, two entry points.
- **Interview format:** the builder **inlines the full grilling protocol** verbatim into its own `SKILL.md` — numbered rounds, one recommended answer per question, breadth-first then depth, wait for the user each round. No dependency on the installed `grilling` skill (self-containment). It borrows the technique by copying it.
- **The five dimensions the interview must pin before scaffolding:**
  1. **Domain boundary** — what's in scope and explicitly out.
  2. **Audience & tasks** — who the Expert serves and the concrete questions/tasks it must handle.
  3. **Design problems to solve up front** — source availability (paywalled/proprietary?), knowledge **volatility** (staleness rate → maintenance cadence), tooling/**MCP** needs, sensitive/confidential material.
  4. **Knowledge sources to seed from** — where the material actually lives (docs sites, repos, standards, internal wikis).
  5. **Success criteria** — the "expert enough" test.
- **Output artifact = the Domain Brief** (canonical term, added to `CONTEXT.md`): a structured capture of the five dimensions, persisted as a **dedicated top-level `brief.md` in the Pack root**. It is the single source of truth for scope, read by both `AGENTS.md` and the maintenance skill. It lives **outside** `wiki/` so the OKF bundle stays purely domain knowledge, not config. → **adds `brief.md` to the settled Pack layout.**
- **Stop condition:** the interview follows grilling's own rule — done only when all five dimensions are pinned, the frontier is empty, **and the user explicitly confirms shared understanding**. It then runs **once, up front**, and hands the Domain Brief to scaffolding + the seeding research pass (ticket 06). No interleaving of research back into scoping in v1 (if seeding later contradicts the brief, that's the maintenance loop's concern → noted in fog).
