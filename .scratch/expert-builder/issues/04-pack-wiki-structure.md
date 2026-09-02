# 04 — Decide the Pack Wiki structure on OKF

Type: grilling
Status: open
Blocked by: 01

## Question

Using the pinned OKF v0.1 conventions (ticket 01), decide the **concrete Wiki structure** every Expert Pack ships with.

Decide:
- The starting file set the builder scaffolds (index/entry file, per-concept files, a provenance/sources file, a change log?).
- The frontmatter schema instances used for this use case (which `type` values, how `tags` are used to make the Wiki queryable by the Expert).
- The provenance model: how each concept records where its knowledge came from (URLs, commands, timestamps) so "continuous update" is trustworthy.
- Naming/foldering rules so the maintenance skill can update one concept without rewriting the whole Wiki.
- How much structure is scaffolded empty vs. seeded (hand-off boundary to ticket 06).

Unblocks the maintenance skill, research bootstrap, and AGENTS.md template.
