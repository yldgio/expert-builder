# 04 — Decide the Pack Wiki structure on OKF

Type: grilling
Status: resolved
Blocked by: 10

## Question

Using the pinned OKF conventions (ticket 01 findings) and the chosen OKF target version (ticket 10), decide the **concrete Wiki structure** every Expert Pack ships with.

Decide:
- The starting file set the builder scaffolds (index/entry file, per-concept files, a provenance/sources file, a change log?).
- The frontmatter schema instances used for this use case (which `type` values, how `tags` are used to make the Wiki queryable by the Expert).
- The provenance model: how each concept records where its knowledge came from (URLs, commands, timestamps) so "continuous update" is trustworthy.
- Naming/foldering rules so the maintenance skill can update one concept without rewriting the whole Wiki.
- How much structure is scaffolded empty vs. seeded (hand-off boundary to ticket 06).

Unblocks the maintenance skill, research bootstrap, and AGENTS.md template.

## Answer

Builds on ticket 10 (OKF v0.2 minimal profile; `sources` provenance; `index.md`/`log.md` mandatory; `okf_version: "0.2"`).

- **Folder layout:** `wiki/` uses **shallow (one-level) topic subfolders derived from the Domain Brief's scope areas** — `wiki/<topic>/<concept>.md` — plus an optional `wiki/references/` for mirrored external material (v0.2 convention). Concept identity = file path minus `.md`; cross-links use bundle-root-absolute form (`/<topic>/<concept>.md`) so files move within subdirs safely. Shallow depth avoids link/identity churn and lets the maintenance skill update one topic in isolation.
- **`type` starter taxonomy** (freeform/extensible, consumers tolerate unknowns): `Concept` (core domain idea), `Guide` (how-to/playbook), `Reference` (mirrored external doc/spec), `Glossary` (a term), `FAQ` (a Q&A). Domains may add their own.
- **`tags` convention:** at least **one lowercase topic-facet tag per concept, keyed to the brief's scope areas**, plus freeform tags. `tags` stays optional in the OKF profile; the builder's convention is "≥1 topic tag" for reliable filtering, no controlled vocabulary in v1.
- **Provenance model** (from ticket 10, applied): every seeded concept carries `sources` frontmatter (per-source id/author/last_modified) with per-claim markdown footnotes keyed to `sources[].id`; `generated{by,at}` records authorship+timestamp; `stale_after` set when the brief's volatility gives a cadence.
- **Scaffold-vs-seed boundary** (hand-off to ticket 06):
  - **Scaffold (ticket 04 owns):** `wiki/index.md` (frontmatter `okf_version: "0.2"`; body = progressive-disclosure catalog, one section per brief topic, each marked "not yet written"); `wiki/log.md` (a `## <date>` **Creation** entry); the empty topic-folder skeleton. A Pack is structurally valid even before any concept is seeded.
  - **Seed (ticket 06 owns):** writes the actual concept files (full frontmatter + `sources`) and updates `index.md`; decides which concepts are seeded first.
