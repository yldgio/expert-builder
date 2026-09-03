# OKF v0.2 profile

The Wiki in every Expert Pack is an **Open Knowledge Format (OKF) v0.2** bundle: a directory of
markdown files with YAML frontmatter, one concept per file. This file pins the subset the builder
and the `refresh` skill author and maintain.

Canonical spec: `GoogleCloudPlatform/open-knowledge-format` `SPEC.md` (Version 0.2), pinned at blob
`c06e3eede0c910d0ecf12524c34204156f8795ac`
(https://github.com/GoogleCloudPlatform/open-knowledge-format/blob/c06e3eede0c910d0ecf12524c34204156f8795ac/SPEC.md).
Declare `okf_version: "0.2"` in the bundle-root `index.md`.

## Concept frontmatter

Every seeded concept carries this profile. `type` is the only field OKF itself requires; the rest are
this profile's mandatory additions so the Wiki is trustworthy and maintainable.

```yaml
---
type: Concept                 # one of the taxonomy below (extensible)
title: <display name>
description: <one-line summary>
resource: <canonical URI>     # only when the concept describes a concrete asset; omit otherwise
tags: [<topic>, ...]          # >=1 lowercase topic tag keyed to a brief scope area
generated: { by: expert-builder/v1, at: 2026-09-03T11:21:00Z }
stale_after: 2027-09-03T00:00:00Z   # set from the brief's volatility when a cadence is known
sources:
  - id: <stable-key>
    resource: <URL, bundle-relative path, or scope descriptor>
    title: <human label>
    last_modified: 2026-05-28T00:00:00Z
verified:                     # events appended on verification; seeding writes a machine event
  - { by: expert-builder/v1, at: 2026-09-03T11:21:00Z }
---
```

**Mandatory in this profile:** `type`, `title`, `description`, `generated`, `sources`.
**Producer rule:** every concept the builder or `refresh` writes also records a machine `verified`
event (`{ by: <tool>/v<n>, at: ... }`), which makes it machine-confirmed. `verified` stays
schema-optional in OKF — a concept without it is still conformant and never rejected — but our
producers always write one.
**Conditional:** `resource` (concrete-asset concepts only), `tags` (convention: ≥1 topic tag),
`stale_after` (when volatility gives a cadence), `status` (see below). A human appends further
`verified` events on review.

## Field rules (from the spec)

- **`type`** — freeform string; consumers tolerate unknown values. Starter taxonomy, extensible:
  `Concept`, `Guide`, `Reference`, `Glossary`, `FAQ`.
- **`generated`** — `by` (an actor, REQUIRED) + `at` (ISO 8601). Marks the content's last meaningful
  change. Move `at` only when content actually changes.
- **`sources`** — the materials a concept derives from. Each entry: `resource` (REQUIRED), optional
  `id` (present whenever the body cites it), `title`, and credibility signals `author`,
  `usage_count`, `last_modified`.
- **`verified`** — a list of `{ by, at }` events. **Never a tier string.** The trust tier is
  *derived* (see below). Omit until first verification.
- **`status`** — `draft | stable | deprecated`; absent means `stable`.
- **`stale_after`** — an absolute ISO 8601 instant. A concept is stale when `now >= stale_after`.

## Actor convention

`generated.by` and `verified[].by` use one form:
- `<producer>/<version>` for agents/tools, e.g. `expert-builder/v1`, `refresh/v1`.
- `human:<id>` for a person, e.g. `human:ada`.
- `process:<id>` for an automated process.

## Trust tiers (derived, not stored)

Read the tier from `verified`; do not write a tier field:
- no `verified` key → **unverified**
- `verified` by non-`human:` actors only → **machine-confirmed**
- any `human:<id>` verifier → **human-reviewed**

A concept written by `refresh` (or seeded) records a non-human `verified` event, so it is
machine-confirmed; a human promotes it to human-reviewed by appending a `human:` verification event.

## Timestamps

Every timestamp is an ISO 8601 datetime with an explicit UTC offset, e.g. `2026-09-03T11:21:00Z`.

## Bundle conventions

- **Concept identity** = the file's bundle path minus `.md`.
- **Cross-links** = standard markdown links; **bundle-root-absolute** preferred (`/topic/concept.md`)
  because it survives moves within a subdirectory. Broken links are tolerated (not-yet-written
  knowledge).
- **Per-claim citation** = markdown footnotes whose label is a `sources[].id`.
- **`index.md`** carries no frontmatter, except the bundle-root `index.md`, which MAY carry
  `okf_version`. Body groups concepts under `#` headings as `* [Title](/path.md) - description`.
- **`log.md`** is a flat list of `## YYYY-MM-DD` date groups, newest first; entries are prose with a
  conventional leading bold word (`**Creation**`, `**Seeding**`, `**Update**`, `**Deprecation**`).
- **`references/`** subdirectory conventionally mirrors external material as first-class concepts.
