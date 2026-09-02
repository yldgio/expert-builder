# Map: Expert Builder

Label: `wayfinder:map`

## Destination

A locked mechanism decision **plus** a design spec / build-plan detailed enough to hand to a build session, defining the **Expert Builder**: a single self-contained skill that interviews a user, scopes a domain, and scaffolds a portable, self-maintaining **Expert Pack**. Reaching the end means: nothing left to *decide* before someone builds the `expert-builder` skill.

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
  - Wiki uses the **Open Knowledge Format (OKF)** on-disk shape. Which version (v0.1 vs the current ecosystem-standard v0.2) is an open decision — see ticket 10.
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

## Not yet specified

<!-- in-scope fog, graduates as the frontier advances -->

- **Pack versioning / upgrade**: how a Pack (and its embedded OKF/maintenance conventions) is migrated when OKF or the builder evolves.
- **Staleness triggers**: how/when maintenance decides the Wiki needs refreshing beyond a manual on-demand run.
- **Multi-expert composition**: whether/how Packs reference or compose with each other.
- **Distribution/export tooling**: turning the in-repo `expert-builder` skill folder into a portable, shippable artifact.
- **Copilot CLI validation harness**: concrete steps to prove a produced Pack launches and behaves correctly.
- **Research reopening scope**: whether seeding/maintenance research that contradicts the Domain Brief should be able to reopen the scoping interview (deferred out of v1's single interview→build flow).

## Out of scope

<!-- ruled beyond the destination; closed, never graduates -->

- **External scheduled maintenance jobs** (cron/CI): v1 maintenance is on-demand only (Q8).
- **A working, populated Expert for a real domain**: the destination is the builder's spec, not shipping real experts.
