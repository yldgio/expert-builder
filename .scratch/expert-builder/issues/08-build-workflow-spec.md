# 08 — Assemble the Expert Builder build-workflow spec

Type: grilling
Status: open
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
