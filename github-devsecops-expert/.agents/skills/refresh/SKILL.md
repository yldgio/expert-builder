---
name: refresh
description: Re-verify this Expert Pack's wiki concepts against their sources and update whatever changed, with provenance. Invoke to refresh a stale or named concept, fill a knowledge gap, or sweep the whole wiki.
disable-model-invocation: true
---

# refresh

Keep this Pack's OKF wiki (and its instruction artifacts) current. Self-contained: use whatever
research tools the host harness exposes (web fetch, search, file read, re-running a captured command)
and, where the harness offers subagents, fan the per-concept work out across them; otherwise research
inline. Depend on no other skill.

The **guardrail** governs every write: each claim in the wiki cites a `source`, and a source you
cannot reach is flagged, never guessed around. When you cannot verify a fact, write nothing for it,
set the concept's `status: draft` with `status_reason: source-unreachable`, note it in the run
report, and record it in `log.md`.

## Modes

Pick the mode from how you were invoked:

- **`targeted <concept|topic>`** — refresh one concept or one topic folder.
- **`stale-sweep`** (default) — refresh every concept that is stale (see signals below).
- **`full`** — re-verify every concept.

Work per concept, and cap the batch: process the most-overdue concepts first — those with the oldest
`stale_after` — then any undated fallback candidates (no `stale_after`, no live metadata) ordered by
oldest latest-`verified.at`, then oldest `generated.at`, then concept path. Confirm before a run
larger than 20 concepts, so a refresh stays affordable.

## Staleness signals

A concept is a refresh candidate when any hold:

- `now >= stale_after`, or
- a **live metadata check** on a source (e.g. an HTTP `Last-Modified`, an API timestamp, a repo
  commit date) reports the source is newer than the concept's `generated.at` — check this cheap
  signal during selection where the source exposes it, or
- the concept has **no `stale_after` and no usable live-metadata signal** — its freshness cannot be
  proven, so a stale-sweep re-fetches it (bounded by the batch cap, most-overdue first), or
- the user named it.

## Loop

Run these steps for each concept in the batch:

1. Read the concept's `sources`.
2. Re-fetch and verify each source with the harness's tools.
3. Diff what the sources now say against the concept's current claims.
4. **Content changed** → rewrite the affected sections; refresh each touched `sources[].last_modified`;
   set `generated: { by: refresh/v1, at: <now> }`; set `verified: [{ by: refresh/v1, at: <now> }]`
   (a machine-confirmed event — this drops any prior human sign-off, which no longer applies to
   changed content); recompute `stale_after` from the domain's cadence in `brief.md`. **Content
   unchanged** → leave `generated.at`; append a `{ by: refresh/v1, at: <now> }` event to `verified`
   (re-confirmed) and recompute `stale_after` only, so a just-checked concept is not re-checked
   immediately. In either case, once every source verifies again, **clear a `status: draft` that
   carries `status_reason: source-unreachable`** (drop both keys to restore `stable`); leave a `draft`
   set for any other reason untouched.
5. Optionally add one in-scope concept (see create-mode) or fill a `brief.md` **Gaps** item.
6. Reflect any additions or removals in `wiki/index.md`.
7. Append one dated entry to `wiki/log.md`.
8. Emit the run report.

## Create-mode (adding a concept)

Seeding a new concept and filling a gap are the same write. Adding a concept touches **four**
artifacts as one unit of work, or the wiki desyncs:

1. Write the concept file with the full OKF profile (below).
2. Link it in `wiki/index.md` and drop any "not yet written" line for it.
3. Clear the filled item from the **Gaps** section of `brief.md`.
4. Append a `**Seeding**` or `**Update**` entry to `wiki/log.md`.

Only add a concept whose subject is inside the boundary in `brief.md`. Anything outside stays out.

## Instruction-artifact maintenance

The wiki is not the only thing that goes stale. This loop also maintains `brief.md` and `AGENTS.md`:

- **Facts and rules** (the descriptive parts of `brief.md`; every wiki concept) → update them like any
  concept.
- **`AGENTS.md` ↔ `brief.md` alignment** → whenever `brief.md` changes, regenerate `AGENTS.md`'s
  inline scope snapshot from it, so the instructions never drift from the brief.
- **Human-decided scope** — the boundary, audience, and success criteria in `brief.md` — **propose the
  change and wait for the user**; these are the human's to set, so surface "the domain's rules changed
  in a way that may affect scope" rather than rewriting them.

The trigger for touching instructions is a governing `Reference` concept whose source was revised: a
standard, spec, or policy the domain depends on changed. Auto-update the facts, re-align `AGENTS.md`,
and route any scope question to the user.

## OKF write rules (reference)

Every concept file is markdown with this YAML frontmatter:

```yaml
---
type: Concept                 # Concept | Guide | Reference | Glossary | FAQ (extensible)
title: <display name>
description: <one-line summary>
resource: <canonical URI>     # only for a concrete-asset concept; omit otherwise
tags: [<topic>, ...]          # >=1 lowercase topic tag
generated: { by: refresh/v1, at: 2026-09-03T11:21:00Z }
stale_after: 2027-09-03T00:00:00Z
sources:
  - id: <stable-key>
    resource: <URL, bundle-relative path, or scope descriptor>
    title: <human label>
    last_modified: 2026-05-28T00:00:00Z
verified:                     # seeding/refresh writes a machine event; humans append their own
  - { by: refresh/v1, at: 2026-09-03T11:21:00Z }
---
```

- **Mandatory:** `type`, `title`, `description`, `generated`, `sources`. Within each `sources` entry,
  `resource` is required (a URL, a bundle-relative path, or a scope descriptor).
- **Actors** use `<producer>/<version>`, `human:<id>`, or `process:<id>`. Content you write carries
  `generated.by: refresh/v1` and a `verified` event `{ by: refresh/v1, at: ... }`; a human promotes
  trust by appending a `human:` entry to `verified`.
- **Trust tier is derived, never stored:** no `verified` → unverified; only non-human verifiers →
  machine-confirmed; any `human:` verifier → human-reviewed. Content you write is machine-confirmed
  because you record a non-human `verified` event.
- **Cite per claim** with a markdown footnote whose label is a `sources[].id`.
- **Cross-link** with bundle-root-absolute markdown links (`/topic/concept.md`).
- **Timestamps** are ISO 8601 with an explicit UTC offset.

## Run report

Close every run with: mode and scope; **N checked, M updated** (one line each on what changed),
**K added**; **skipped** (unreachable sources, out-of-scope findings left unwritten); and pointers to
the new `log.md` entry and the git diff.
