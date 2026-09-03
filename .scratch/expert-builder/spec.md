# Spec: The `expert-builder` skill

Build-plan for a single, self-contained skill that interviews a user, scopes a domain, and scaffolds a portable, self-maintaining **Expert Pack**. This spec is the hand-off artifact of the [Expert Builder wayfinder map](./map.md); the numbered tickets under `issues/` are its decision record. Canonical vocabulary is in [`CONTEXT.md`](../../CONTEXT.md).

## 1. Purpose & shape

`/expert-builder` produces an **Expert Pack**: a folder a harness (reference: Copilot CLI) can be launched inside to answer as a domain **Expert**. The Pack's knowledge is a self-maintaining **Wiki** in Open Knowledge Format (OKF) v0.2; a bundled **`refresh`** skill keeps it (and the Pack's own instructions) current.

The builder ships as **one self-contained skill**: it inlines its interview, research, and OKF-write procedures and does **not** depend on the mattpocock skills (`grilling`/`research`/`domain-modeling`) being installed. It borrows their techniques by copying them.

## 2. The builder skill folder

```
.agents/skills/expert-builder/
  SKILL.md                 # the builder's logic (see §3)
  assets/
    refresh/               # the maintenance skill, copied verbatim into every Pack (§7)
      SKILL.md
    templates/
      AGENTS.md.tmpl       # six-section Expert instructions (§6.2)
      README.md.tmpl       # human-facing launch doc (§6.3)
      brief.md.tmpl        # Domain Brief structure (§5)
      wiki-index.md.tmpl   # OKF index.md skeleton (§6.1)
      wiki-log.md.tmpl     # OKF log.md skeleton (§6.1)
    skill-catalog.md       # curated list of known skill repositories (§8)
    okf-profile.md         # the OKF v0.2 mandatory profile + conventions (§4)
```

## 3. `SKILL.md` metadata & structure

Frontmatter:
- `name: expert-builder`
- `description:` one line — "Interview a user, scope a domain, and scaffold a portable, self-maintaining Expert Pack."
- `disable-model-invocation: true` — explicitly user-invoked only (like `wayfinder`); never auto-triggered.

Body inlines: the **grilling protocol** (numbered rounds, one recommended answer per question, breadth-first then depth, wait each round), the **OKF v0.2 profile & conventions** (§4), the **create/refresh research+write procedure** (shared with the `refresh` skill, §7), and the **build workflow** (§9).

## 4. OKF v0.2 profile (the Wiki format)

Target **OKF v0.2** (superset of v0.1; ecosystem-tooling compatible). Pin provenance to `GoogleCloudPlatform/open-knowledge-format` `SPEC.md` blob sha `c06e3ee…`; declare `okf_version: "0.2"` in the bundle-root `index.md`. (Full findings: [asset](./assets/01-okf-findings.md).)

**Per-concept frontmatter — mandatory:** `type`, `title`, `description`, `generated: { by, at }`, `sources`.
**Optional / conditional:** `resource` (only for concepts describing a concrete asset), `tags` (convention: ≥1 lowercase topic tag), `stale_after` (set from the brief's volatility when a cadence is known), `verified` (trust tier), `status` (default `stable`).

**Conventions:** concept identity = file path minus `.md`; cross-links are standard markdown, **bundle-root-absolute** preferred (`/topic/concept.md`); broken links tolerated. `type` starter taxonomy (extensible): `Concept`, `Guide`, `Reference`, `Glossary`, `FAQ`. Every claim cites a `source` (per-claim footnotes keyed to `sources[].id`).

> **Pre-build task (from the ticket-09 prototype):** the exact YAML sub-schemas of `generated`, `sources` (per-source fields such as `id`/`author`/`last_modified`), and `verified` (allowed trust-tier values) were **not** pinned by the ticket-01 research and were only approximated when hand-building the prototype. Before authoring the templates in `assets/`, **read `SPEC.md` at the pinned blob sha and lock these sub-schemas** so the builder emits spec-conformant frontmatter (validate a sample against the OKF v0.2 validator).


**Reserved files, mandatory in every Pack:** `index.md` (carries `okf_version: "0.2"`; progressive-disclosure catalog) and `log.md` (append-only history, `## YYYY-MM-DD` headings, newest first).

## 5. The interview → Domain Brief

The interview inlines the grilling protocol. It accepts an optional domain **seed** at invocation, else asks for one. It runs **once, up front**, breadth-then-depth, and is done only when all five dimensions are pinned, the frontier is empty, **and the user explicitly confirms**. No research→scope interleaving in v1.

**Five dimensions it must pin:**
1. **Domain boundary** — in scope and explicitly out.
2. **Audience & tasks** — who the Expert serves; the concrete questions/tasks it must handle.
3. **Design problems** — source availability (paywalled/proprietary?), knowledge **volatility** (staleness rate → maintenance cadence), tooling/**MCP** needs, sensitive material.
4. **Knowledge sources** — where the material lives (docs, repos, standards, internal wikis).
5. **Success criteria** — the "expert enough" test.

**Output = the Domain Brief**, written to top-level `brief.md`. It is the single source of truth for scope, read by `AGENTS.md` and the `refresh` skill. It also carries a **`Gaps` section** (un-seeded priority topics + un-filled skill/knowledge gaps, each with its intended source pointers).

## 6. The Expert Pack (emitted files)

```
<expert-slug>/
  brief.md            # Domain Brief (§5)
  AGENTS.md           # six-section Expert instructions (§6.2)
  wiki/               # OKF v0.2 bundle (§6.1)
    index.md
    log.md
    <topic>/<concept>.md ...
    references/       # optional: mirrored external material
  .agents/skills/
    refresh/          # bundled maintenance skill (§7)
    <domain-skill>/   # optional, discovered & vendored (§8)
  .mcp.json           # optional, template only (§8)
  README.md           # human-facing launch doc (§6.3)
```

Output location: a new `./<expert-slug>/` in the current working directory, slug proposed from the domain, user-overridable at the confirm gate.

### 6.1 Wiki layout
Shallow (one-level) topic subfolders derived from the brief's scope areas. **Scaffold** creates `index.md` (with `okf_version`, a catalog listing each topic marked "not yet written"), `log.md` (a `## <date>` **Creation** entry), and the empty topic-folder skeleton — a structurally valid Pack before any concept is seeded. **Seeding** (§9 step 5) writes concept files and updates `index.md`.

### 6.2 `AGENTS.md` — six sections
1. **Role** — "You are an expert in `<domain>`" (from the brief).
2. **Scope & boundaries** — in/out (inlined from the brief) + "consult `brief.md` for the authoritative scope".
3. **The Wiki as knowledge source** — read `wiki/index.md` first; navigate by topic/tag/`type`; `Reference` concepts are authoritative.
4. **Answering protocol** — consult the Wiki before answering; ground every claim in concepts and cite the concept + its `sources`; if uncovered, say "not in my knowledge base" and offer to run `refresh`/seed rather than guessing; distinguish Wiki-grounded answers from general reasoning.
5. **Maintenance** — how to run `refresh`; on hitting a stale/missing concept mid-task, **suggest `refresh` and wait** (opt-in; user may enable auto with "keep yourself updated").
6. **Guardrails** — no unverified claims; cite provenance; stay in scope; don't fabricate.

Harness-agnostic: single canonical `AGENTS.md`, no harness-specific tool names, no alias files (`CLAUDE.md`, …) in v1.

### 6.3 `README.md` — human-facing
What the expert is, a scope summary, how to **launch** it (Copilot CLI reference command), how to run `refresh`, what's in the Pack, and (if MCP present) the credential-wiring checklist.

## 7. The `refresh` maintenance skill (bundled in every Pack)

A self-contained skill copied verbatim from the builder's `assets/refresh/`. It shares the builder's embedded research+write procedure.

**Modes:** `targeted` (a concept/topic) · **`stale-sweep` (default)** · `full`; per-concept, batch-capped.
**Staleness signals:** `stale_after` passed · upstream `sources[].last_modified` newer than `generated.at` · user-named.
**Loop:** select targets → per concept re-fetch its `sources` (embedded research) → diff → if changed, rewrite + refresh `sources[].last_modified` + set `generated{by:refresh,at:now}` + machine `verified` tier + recompute `stale_after`; if unchanged, recompute `stale_after` only → optionally add a boundary-checked in-scope concept / fill a logged gap → update `index.md` → append a `log.md` entry → emit report.

**Create-mode atomicity (from the ticket-09 prototype):** when a concept is **added** (seeding or gap-fill), three artifacts update together, or the Wiki desyncs — (1) write the concept file, (2) update `index.md` (link it, drop its "not yet written" line), (3) **clear the filled item from `brief.md`'s `Gaps` section**, then append the `log.md` entry. Treat this as one unit of work.
**Write model:** auto-write, logged, git-revertible; humans promote to the human-reviewed trust tier.
**Guardrail:** unreachable/paywalled source → flag the concept (log + `status`), never fabricate.
**Report:** N checked / M updated / K added / skipped-failed + log & diff pointers.

**Instruction-artifact maintenance:** the loop also covers `brief.md` and `AGENTS.md`. Rule/fact-derived content auto-updates; `AGENTS.md` auto-realigns to `brief.md` whenever the brief changes; **human-decided scope (boundary, audience, success criteria) is proposed for review, never silently rewritten**. Trigger for touching instructions: an authoritative/governing `Reference` concept's source being revised.

## 8. Optional components (domain-contingent)

Triggered only when the Domain Brief surfaced a concrete need; the builder **proposes, the user confirms**.

**Domain skills — reuse by discovery, never authored:** search the bundled **Skill catalog** + general search (degrade *up* to `find-skills` if installed, never depend on it); **vendor** matches into `.agents/skills/`, recording each skill's **source repo + license**; **skip anything without a clear permissive license** and surface it. No match → log the gap in the brief's `Gaps` section and prompt the user to supply one. (Never fabricate a skill.)

**MCP:** emit a **template `.mcp.json`** with the server entry + credential **placeholders** and a README wiring checklist. **Never embed secrets**; real provisioning is a human task.

**Empty case:** omit the files entirely; the mandatory core alone is a valid Pack.

## 9. Build workflow

1. **Invoke** `/expert-builder [optional seed]`.
2. **Interview** (§5) → write `brief.md`; stop on confirm.
3. **Confirm build plan** → propose Pack name/location, seeding priority list + top-N budget, and any optional skills/MCP the brief implies; user confirms.
4. **Scaffold** (§6.1) → folder, `brief.md`, empty OKF `wiki/` skeleton, `.agents/skills/refresh/`, `README.md`.
5. **Seed** (refresh in create-mode) → **task-driven** priority (brief's audience tasks first, `Glossary` early), **breadth-first shallow**, bounded by the confirmed top-N budget; write concepts with full provenance; update `index.md`; log a `Seeding` entry; record un-seeded items + gaps in the brief's `Gaps` section.
6. **Optional components** (§8) → discover/vendor domain skills; emit template `.mcp.json` + checklist if needed.
7. **Write `AGENTS.md`** (§6.2) from the brief.
8. **Self-check** (§10) → **report** + launch instructions.

## 10. Acceptance criteria & self-check (definition of done)

Before declaring done, the builder verifies:
1. **Mandatory core present:** `brief.md`, `AGENTS.md`, a valid OKF `wiki/` (`index.md` with `okf_version` + `log.md`), `.agents/skills/refresh/`, `README.md`.
2. **OKF conformance:** every seeded concept carries the mandatory profile (§4) and **every claim has a `source`**.
3. **Index honesty:** `index.md` lists all seeded concepts plus "not yet written" entries for the rest.
4. **Gaps recorded** for everything un-seeded.
Self-check runs this checklist and, **if an OKF v0.2 validator is available in the environment, runs it too** (degrading to the built-in checklist otherwise). Full *runtime* launch validation is the ticket-09 prototype's job.

## 11. Invocation contract

- **Input:** optional domain seed sentence.
- **Interaction:** the interview (rounds), then a single build-plan confirmation gate.
- **Output:** a `./<expert-slug>/` Expert Pack that passes §10, plus a run report and launch instructions.

## 12. Deferred / out of scope (v1)

Deferred (fog): Pack versioning/upgrade; staleness triggers beyond on-demand; multi-expert composition; distribution/export tooling for the builder folder; a concrete Copilot CLI validation harness; research reopening scope; Skill-catalog curation policy. Out of scope: external scheduled maintenance jobs; shipping a populated Expert for a real domain (that's downstream of this spec).
