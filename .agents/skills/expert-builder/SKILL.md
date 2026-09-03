---
name: expert-builder
description: Interview a user, scope a domain, and scaffold a portable, self-maintaining Expert Pack (specialized AGENTS.md + an OKF wiki + a bundled refresh skill) that a harness like Copilot CLI can be launched inside. Invoke to build an expert on a domain.
disable-model-invocation: true
---

# expert-builder

Turn a domain the user names into an **Expert Pack**: a folder a harness (reference: Copilot CLI) is
launched inside to answer as an expert on that domain. The Pack's knowledge is a self-maintaining
wiki in Open Knowledge Format; a bundled `refresh` skill keeps it current.

This skill is **self-contained**: it inlines the interview and research it needs and reads its own
`assets/`. It depends on no other installed skill.

Build a Pack in eight steps. Each step below ends on a bar you can check before moving on.

## 1. Take the seed

If the user gave a domain at invocation, treat it as the seed. Otherwise ask what domain the expert
should cover. **Bar:** you have a one-line domain to interview against.

## 2. Interview → Domain Brief

Interview the user with the grilling protocol (below) until the five dimensions are pinned and the
user confirms shared understanding. Write the result to `brief.md` using
`assets/templates/brief.md.tmpl`.

**Five dimensions to pin:**
1. **Domain boundary** — what is in scope and explicitly out.
2. **Audience & tasks** — who the expert serves, and the concrete questions/tasks it must handle.
3. **Design problems** — source availability (paywalled? proprietary?), knowledge **volatility**
   (how fast it goes stale → the `stale_after` cadence), tooling/**MCP** needs, sensitive material.
4. **Knowledge sources** — where the material actually lives (docs, repos, standards, wikis).
5. **Success criteria** — the test for "expert enough".

**Bar:** all five dimensions are written into `brief.md` and the user has confirmed. Do not scaffold
before the confirmation.

### The grilling protocol

Interview in **rounds**. The frontier is every question whose prerequisites are already settled — the
ones you can ask now without guessing at an answer you have not heard. Ask the whole frontier in one
round; number each question and give your recommended answer:

```
❓ **Q1 — <title>**: <question, with options>
➡️ <your recommended answer>
```

Then wait. Each round's answers settle decisions and push the frontier outward; recompute it and ask
the next round. A question that depends on another still-open question belongs to a later round. Look
things up yourself to *frame* questions — check the environment and what sources exist, rather than
asking the user what you can find — but defer substantive domain research to seeding (step 5); the
interview settles scope first. Put decisions to the user. Stop when the frontier is empty and the user
confirms.

## 3. Confirm the build plan

Propose, and get the user's confirmation on: the Pack name and location (default: a new
`./<expert-slug>/` in the working directory, slug from the domain); the seeding priority list and its
**top-N budget** (see step 5); and any optional domain skills or MCP the brief implies (see step 6).
**Bar:** the user has approved name, seeding budget, and the optional-component list.

## 4. Scaffold

Create the Pack skeleton — valid before any concept is seeded:

```
<expert-slug>/
  brief.md                 # from step 2
  AGENTS.md                # written in step 7
  wiki/
    index.md               # from wiki-index.md.tmpl; carries okf_version: "0.2"
    log.md                 # from wiki-log.md.tmpl; a Creation entry
    <topic>/               # one shallow folder per brief scope area
  .agents/skills/refresh/  # copy assets/refresh/ verbatim
  README.md                # written in step 8
```

Copy `assets/refresh/` into the Pack **verbatim**. Derive the topic folders from the brief's scope
areas. **Bar:** the skeleton exists, `index.md` carries `okf_version: "0.2"`, and `refresh` is
present.

## 5. Seed the wiki

Seed the wiki with the `refresh` create-mode procedure (`assets/refresh/SKILL.md`), which shares one
research-and-write path with maintenance so seeded and maintained concepts come out identical.

Seed **task-first**: the concepts the brief's top-priority tasks depend on come first, with a
`Glossary` concept early for shared vocabulary. Go **breadth-first and shallow** — one solid,
well-sourced concept per priority item — and stop at the confirmed top-N budget. Record everything
below the line, plus any skill/knowledge gaps, in the brief's **Gaps** section with their source
pointers, and as "not yet written" lines in `index.md`.

Write every concept to the OKF v0.2 profile in [`assets/okf-profile.md`](assets/okf-profile.md): the
mandatory frontmatter, the actor convention, per-claim footnote citations. A source you cannot reach
is flagged, never fabricated. **Bar:** the top-N concepts exist with full provenance, `index.md` and
`log.md` reflect them, and the Gaps section lists the rest.

## 6. Optional components

Add these only when the brief surfaced a concrete need, and only after the user confirmed them in
step 3.

- **Domain skills** — discover and reuse; never author. Follow
  [`assets/skill-catalog.md`](assets/skill-catalog.md): search the catalog, vendor a permissively
  licensed match into `.agents/skills/` with its source and license recorded, and log a gap when
  nothing fits.
- **MCP** — when the brief names a live data source needing a server, emit a template `.mcp.json`
  with the server entry and credential **placeholders**, and add a wiring checklist to the README.
  Never write a secret into the Pack.

**Bar:** each confirmed component is present with provenance, or its absence is recorded as a gap. A
Pack with no optional components is valid.

## 7. Write AGENTS.md

Fill `assets/templates/AGENTS.md.tmpl` from the brief: role, the in/out scope inlined from the brief
plus the "consult `brief.md`" pointer, the Wiki-reading and answering protocol, the maintenance
trigger, and the guardrails. **Bar:** `AGENTS.md` names the domain, states the boundary, and points
the Expert at `wiki/index.md` and at `refresh`.

## 8. Write README, self-check, and report

Fill `assets/templates/README.md.tmpl` from the brief and the built Pack: what the expert is, the
in/out scope summary, how to launch it, how to run `refresh`, what the Pack contains, and — when MCP
was added — the credential-wiring checklist. Then verify the Pack against the acceptance criteria and
report to the user with launch instructions.

**Acceptance criteria:**
1. Mandatory core present: `brief.md`, `AGENTS.md`, a valid `wiki/` (`index.md` with `okf_version` +
   `log.md`), `.agents/skills/refresh/`, `README.md`.
2. Every seeded concept carries the mandatory OKF profile, and every claim has a `source`.
3. `index.md` lists every seeded concept plus a "not yet written" line for each un-seeded one.
4. Gaps are recorded for everything un-seeded.

Run this checklist yourself; if an OKF v0.2 validator is available in the environment, run it too.
Fix any failure before declaring done. **Bar:** all four criteria hold, `README.md` carries the scope
summary and launch command, and the user has that launch command.

## Notes

- Write everything in English.
- The Pack is self-contained: at runtime it depends only on its own files and the host harness.
- One interview per build; if seeding later contradicts the brief, that is a job for `refresh`, not a
  reason to reopen scope mid-build.
