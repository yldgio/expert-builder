# 08 — Assemble the Expert Builder build-workflow spec

Type: grilling
Status: resolved
Blocked by: 02, 03, 04, 05, 06, 07

## Question

Synthesize the resolved decisions into the **build-plan / spec for the `expert-builder` skill** — the destination artifact of this map.

Decide / assemble:
- The ordered workflow the skill runs: interview → scope brief → scaffold Pack → seed research → write AGENTS.md → bundle maintenance skill → emit optional skills/MCP → README → validate.
- The `SKILL.md` frontmatter and structure for the self-contained builder (embedding interview + research inline, `disable-model-invocation` as appropriate).
- The exact files the skill emits and their templates (referencing tickets 04, 05, 07).
- Invocation contract: what the user passes, what a completed build looks like.
- Acceptance criteria for a v1 Pack, and how the builder self-checks before declaring done.

This ticket produces the hand-off spec; resolving it clears the way to the destination.

## Answer

The hand-off deliverable is written as **[`spec.md`](../spec.md)** — the full build-plan a build session implements. Key decisions locked here:

- **Output location:** a new `./<expert-slug>/` in the CWD (slug from the domain, user-overridable at the confirm gate).
- **`SKILL.md`:** `name: expert-builder`, `disable-model-invocation: true` (user-invoked only), inlining the grilling protocol + OKF v0.2 profile + create/refresh procedure + build workflow.
- **Bundled assets:** `assets/refresh/` (the maintenance skill copied verbatim into each Pack), `templates/` (AGENTS.md, README, brief, wiki index/log), `skill-catalog.md`, `okf-profile.md`.
- **Workflow (8 steps):** invoke → interview→brief → confirm build plan → scaffold → seed (refresh in create-mode) → optional skills/MCP → write AGENTS.md → self-check + report.
- **Acceptance criteria & self-check:** mandatory core present; OKF conformance with every claim sourced; index honesty; gaps recorded; run the OKF v0.2 validator opportunistically if available. Runtime launch validation deferred to ticket 09.
- **Invocation contract:** input = optional seed; interaction = interview rounds + one confirm gate; output = a Pack passing §10 + report + launch instructions.

See [`spec.md`](../spec.md) for the complete specification.
