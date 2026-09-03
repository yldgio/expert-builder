# Map: Expert Builder

Label: `wayfinder:map`

## Destination

A locked mechanism decision **plus** a design spec / build-plan detailed enough to hand to a build session, defining the **Expert Builder**: a single self-contained skill that interviews a user, scopes a domain, and scaffolds a portable, self-maintaining **Expert Pack**. Reaching the end means: nothing left to *decide* before someone builds the `expert-builder` skill.

**Hand-off spec: [`spec.md`](./spec.md)** (produced by ticket 08). Remaining before the destination: the [ticket-09 prototype](issues/09-prototype-sample-pack.md) to validate the spec against reality.

## Notes

- **Domain**: authoring agent skills + portable knowledge ecosystems on the mattpocock/skills convention base (grilling, research, domain-modeling, wayfinder are installed here).
- **Skills every session should consult**: `grilling` and `domain-modeling` when resolving a decision ticket; `research` for research tickets; `prototype` for prototype tickets.
- **Standing decisions (settled while charting)**:
  - Destination = mechanism decision + spec/build-plan (not a working prototype of the builder).
  - Canonical names live in `CONTEXT.md`: **Expert Builder** (process/skill), **Expert Pack** (product folder), **Expert** (running instance), **Wiki** (OKF bundle), **Maintenance skill**.
  - v1 Expert Pack **mandatory core** = specialized `AGENTS.md` + Wiki + bundled maintenance skill. Domain skills and `.mcp.json` are **domain-contingent**, generated only when the domain demands them.
  - Expert Packs are **harness-agnostic**, validated against **Copilot CLI** as reference harness.
  - The Expert Builder ships as **one self-contained skill** that embeds its interview + research + domain-capture logic inline; it does **not** depend on the mattpocock skills being installed (it borrows their techniques, inlined).
  - Maintenance is a **skill bundled into each Pack**, run on demand.
  - Build bootstraps research by **both** scaffolding the Wiki skeleton **and** firing an initial seeding research pass.
  - Wiki uses the **Open Knowledge Format (OKF) v0.2** on-disk shape (settled in ticket 10), with a minimal mandatory profile and `index.md`/`log.md` required in every Pack.
  - Expert Pack layout (v1):
    ```
    <expert-name>/
      brief.md         # Domain Brief: scoped domain (single source of truth for scope)
      AGENTS.md
      wiki/            # OKF bundle: index + per-concept files + provenance/sources
      .agents/skills/  # bundled maintenance skill (+ any domain skills)
      .mcp.json        # only if the domain needs MCP servers
      README.md        # what the expert is, how to launch it
    ```
  - The builder is **developed here** as `.agents/skills/expert-builder/`, authored so its folder is self-sufficient and copy-pasteable elsewhere.

## Decisions so far

<!-- one line per resolved ticket: gist + link -->

- [01 — Research: pin OKF v0.1 conventions](issues/01-research-okf-conventions.md): OKF is a directory of markdown files; concept identity = file path minus `.md`; `type` is the only required frontmatter key (+ recommended `title/description/resource/tags/timestamp`); two optional reserved files `index.md`/`log.md`; markdown cross-links (bundle-root-absolute preferred); no manifest. **Spec has moved to v0.2 and all tooling targets v0.2** → surfaced ticket 10. Full findings: [asset](assets/01-okf-findings.md).
- [02 — Design the domain-scoping interview](issues/02-domain-scoping-interview.md): the builder inlines the grilling protocol (numbered rounds + recommended answers); accepts an optional seed else asks; pins five dimensions (boundary, audience & tasks, design problems, knowledge sources, success criteria); outputs a **Domain Brief** persisted as top-level `brief.md`; stops on grilling's rule (all pinned, frontier empty, user confirms), then hands off to scaffold + seeding research (06). No research→scope interleaving in v1.
- [03 — Skills / MCP inclusion policy](issues/03-skills-mcp-inclusion-policy.md): brief-driven trigger (propose only when the brief surfaced a concrete need, user confirms). **Domain skills are reused by discovery, never authored** — search a bundled **Skill catalog** + general search (degrade up to `find-skills` if present), vendor matches into `.agents/skills/`, record source+license, skip non-permissive; no match → log a gap in the brief and prompt the user to supply one. **MCP** → emit a template `.mcp.json` with credential placeholders + a README checklist, never secrets. Empty case omits the files entirely; mandatory core alone is a valid Pack.
- [10 — OKF target version](issues/10-okf-version-target.md): target **OKF v0.2 with a minimal mandatory profile** (superset of v0.1, ecosystem tooling, provenance/staleness fields the maintenance loop needs). Pin to `SPEC.md` blob sha `c06e3ee…`; declare `okf_version: "0.2"`. Mandatory per-concept frontmatter: `type`, `title`, `description`, `generated{by,at}`, `sources`; optional/conditional: `resource`, `tags`, `stale_after` (set from brief volatility), `verified`, `status`. `index.md` + `log.md` mandatory in every Pack.
- [04 — Pack Wiki structure](issues/04-pack-wiki-structure.md): `wiki/` uses **shallow topic subfolders from the brief's scope areas** (`wiki/<topic>/<concept>.md`) + optional `wiki/references/`; bundle-root-absolute cross-links. `type` starter taxonomy: `Concept`/`Guide`/`Reference`/`Glossary`/`FAQ` (extensible). Convention: ≥1 lowercase topic tag per concept. **Scaffold** creates `index.md` (okf_version + "not yet written" catalog), `log.md` (Creation entry), empty topic skeleton — valid before any seeding; **seeding (06)** writes concept files + updates `index.md`.
- [05 — Maintenance/refresh skill](issues/05-maintenance-skill-design.md): the bundled `refresh` skill. Modes: targeted / **stale-sweep (default)** / full, per-concept with a batch cap. Staleness = `stale_after` passed OR upstream `sources.last_modified` newer than `generated.at` OR user-named. **Auto-writes** (stamps `generated{by:maintenance}`, machine `verified` tier, appends `log.md`; git-revertible); may **add** in-scope concepts (boundary-checked) and fill logged gaps. `stale_after` recomputed every check, `generated.at` only on real change. Research technique **embedded inline** (uses harness tools, subagents optional); unreachable source → flag, never fabricate. Report: N checked / M updated / K added / skipped-failed + log & diff pointers.
- [06 — Research bootstrap](issues/06-research-bootstrap.md): seeding is **task-driven** (brief's audience tasks first, `Glossary` early), **breadth-first shallow**, bounded by a **user-confirmed top-N budget**. Seeding **= the `refresh` procedure in create-mode** (same research + OKF write + `log.md` `Seeding` entry + unreachable-source flagging), so seeded and maintained concepts are identical in shape/provenance. Un-seeded priority topics + ticket-03 gaps recorded in a **`Gaps` section of the Domain Brief** (with source pointers) and as "not yet written" `index.md` entries, consumed by later `refresh` runs.
- [07 — Expert AGENTS.md template](issues/07-expert-agents-md-template.md): six sections (Role · Scope & boundaries · Wiki as source · Answering protocol · Maintenance · Guardrails). Scope **inlined from the brief + "consult `brief.md`" pointer** (drift-safe). Answering: consult Wiki, cite concept + `sources`, say "not in my knowledge base" and offer `refresh` when uncovered. Mid-task staleness → **suggest `refresh`, opt-in**. `README.md` human-facing (launch), `AGENTS.md` agent-facing; single canonical convention file, no alias files in v1. **`brief.md` + `AGENTS.md` are maintained artifacts** → amended into ticket 05: facts auto-update, `AGENTS.md`↔`brief.md` auto-realign, human-decided scope changes proposed for review; trigger = an authoritative `Reference` source being revised.
- [08 — Build-workflow spec](issues/08-build-workflow-spec.md): the destination artifact, written as **[`spec.md`](spec.md)**. Output to `./<expert-slug>/` in CWD; `SKILL.md` is `disable-model-invocation: true` and inlines interview + OKF profile + refresh procedure; bundles `assets/` (the `refresh` skill + templates + Skill catalog + OKF profile). 8-step workflow (invoke → interview→brief → confirm → scaffold → seed → optional skills/MCP → AGENTS.md → self-check+report). Acceptance criteria enforce mandatory core + OKF conformance + every claim sourced + gaps recorded, with opportunistic OKF-validator use.

## Not yet specified

<!-- in-scope fog, graduates as the frontier advances -->

- **Pack versioning / upgrade**: how a Pack (and its embedded OKF/maintenance conventions) is migrated when OKF or the builder evolves.
- **Staleness triggers**: how/when maintenance decides the Wiki needs refreshing beyond a manual on-demand run.
- **Multi-expert composition**: whether/how Packs reference or compose with each other.
- **Distribution/export tooling**: turning the in-repo `expert-builder` skill folder into a portable, shippable artifact.
- **Copilot CLI validation harness**: concrete steps to prove a produced Pack launches and behaves correctly.
- **Research reopening scope**: whether seeding/maintenance research that contradicts the Domain Brief should be able to reopen the scoping interview (deferred out of v1's single interview→build flow).
- **Skill-catalog curation**: which known repositories populate the builder's bundled Skill catalog, and how that list is kept current.

## Out of scope

<!-- ruled beyond the destination; closed, never graduates -->

- **External scheduled maintenance jobs** (cron/CI): v1 maintenance is on-demand only (Q8).
- **A working, populated Expert for a real domain**: the destination is the builder's spec, not shipping real experts.
