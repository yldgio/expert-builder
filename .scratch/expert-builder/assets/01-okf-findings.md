Agent is idle (waiting for messages). agent_id: okf-research, agent_type: research, status: idle, description: Research OKF v0.1 conventions, elapsed: 380s, total_turns: 1

[Turn 0]
I now have everything needed from primary sources. Here are my findings.

---

# OKF Investigation — Findings

## Summary

The **Open Knowledge Format (OKF)** was announced by Google Cloud in **June 2026** as **v0.1**: "a directory of markdown files with YAML frontmatter." The canonical specification is Google-owned and Apache-2.0 licensed. **Critically, the published spec has already advanced to v0.2** — the canonical repo's `SPEC.md` is v0.2, and v0.1 survives only as a documented baseline *inside* the v0.2 spec (§13 "Changes from v0.1" + Appendix A "v0.1 form"). There is **no v0.1 git tag, release, or standalone v0.1 file**. Below I give the v0.1 facts (your target) and flag every v0.2 delta so you can choose which to author against.

**Provenance chain (verified):**
- Announcement (v0.1): Google Cloud blog, June 2026.
- Canonical spec repo (current): `github.com/GoogleCloudPlatform/open-knowledge-format` → `SPEC.md` (blob sha `c06e3eede0c910d0ecf12524c34204156f8795ac`, states "**Version 0.2**").
- Frozen mirror (same sha): `github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md`; its README declares OKF "**now lives in its own repository**" and this copy is "a frozen snapshot, no longer maintained."
- A widely-used third-party toolkit (`scaccogatto/okf-skills`, ~353★) vendors the spec verbatim and cites source commit `3fcbb9f828c2f23d109c855ee403c3a4c81f3a96`.

---

## 1. Repositories discovered

- `GoogleCloudPlatform/open-knowledge-format` — **the canonical home** of the spec, reference agent, and sample bundles (current: v0.2). Source: `GoogleCloudPlatform/knowledge-catalog:okf/README.md:1-13`.
- `GoogleCloudPlatform/knowledge-catalog` (path `okf/`) — original location, **now a frozen v0.2 snapshot**. Contains `SPEC.md`, `README.md`, `LICENSE.md`, and `bundles/` (`ga4`, `stackoverflow`, `crypto_bitcoin`, `acme_retail` sample bundles). Source: `GoogleCloudPlatform/knowledge-catalog:okf/README.md:35-49`.
- `scaccogatto/okf-skills` — third-party Claude Code toolkit; vendors the verbatim spec + a conformance validator (`skills/validate/scripts/okf_validate.py`). Built for **v0.2**. Source: `scaccogatto/okf-skills:skills/okf/reference/SPEC.md:1-10`.
- `zosmaai/pi-llm-wiki` — third-party npm package with "Native OKF **v0.2** support." Source: `zosmaai/pi-llm-wiki:README.md` (Native Open Knowledge Format section).
- `github.com/OpenKnowledgeFormat` — org exists (created 2026-06-18) but has **0 public repos** (verified via API); **not** the canonical home.

Canonical spec file: `GoogleCloudPlatform/open-knowledge-format:SPEC.md` (37,748 bytes). Mirror: `GoogleCloudPlatform/knowledge-catalog:okf/SPEC.md` (identical sha).

---

## 2. YAML frontmatter schema

### v0.1 (your target — from the announcement + spec's v0.1 baseline)

The Google blog lists exactly six queryable frontmatter fields for v0.1: "**type, title, description, resource, tags, and timestamp**" (Google Cloud blog, "How OKF works / Just YAML frontmatter" section). The spec's Appendix A "v0.1 form" confirms this exact set in a worked example:

```yaml
---
type: Metric
title: Income statement (fiscal year)
description: Headline income-statement figures for a fiscal year.
tags: [finance, income-statement]
timestamp: '2026-05-28T22:53:05+00:00'
---
```
Citation: `GoogleCloudPlatform/open-knowledge-format:SPEC.md` §Appendix A "v0.1 form" (fetched lines ~ "### v0.1 form").

**Required vs optional (v0.1):**
- **`type` is the ONLY always-required key.** The spec states "`type` is the only always-required key; a concept carrying just `type` is fully conformant," and §13.2 confirms "the required `type`, recommended `title`/`description`/`resource`/`tags`, … carried forward unchanged" from v0.1. Citation: `…:SPEC.md` §4.1 and §13.2.
- **Optional/recommended:** `title`, `description`, `resource`, `tags`, `timestamp`.

**Field meanings (v0.1, carried into v0.2 except `timestamp`):**
- `type` — short string identifying the kind of concept; used for routing/filtering/presentation. **Not centrally registered.** Producers SHOULD pick descriptive values; consumers MUST tolerate unknown types (treat as generic). Example values given in spec: `BigQuery Table`, `BigQuery Dataset`, `API Endpoint`, `Metric`, `Playbook`, `Reference` (plus v0.2-only `Attested Computation`). The blog's v0.1 examples of concept kinds: "tables, datasets, metrics, playbooks, runbooks, and APIs." Citation: `…:SPEC.md` §4.1 (Required); Google Cloud blog "How OKF works."
- `title` — human-readable display name; if omitted, consumers MAY derive one from the filename. `…:SPEC.md` §4.1 (Recommended).
- `description` — a single sentence summarizing the concept; used by `index.md` generators, search snippets, previews. §4.1.
- `resource` — a **URI that uniquely identifies the underlying asset** the concept describes; **absent for abstract concepts** (ideas, not physical resources). §4.1 and §6.2 (it is a "path-valued field": absolute URL, bundle-relative `/…`, or relative path).
- `tags` — a YAML list of short strings for cross-cutting categorization. §4.1.
- `timestamp` — **v0.1 field** recording the concept's last content change, an ISO 8601 datetime with explicit offset (e.g. `'2026-05-28T22:53:05+00:00'`). §Appendix A v0.1 form.

**Extensibility:** Producers MAY include any additional keys; consumers SHOULD preserve unknown keys on round-trip and MUST NOT reject documents with unrecognized fields. `…:SPEC.md` §4.1 (Extensions).

### v0.2 deltas (if you target the current spec instead)

- **BREAKING: `timestamp` → `generated.at`.** Last content change now recorded as `generated: { by: <actor>, at: <ISO8601 datetime> }`. Consumers MAY fall back to legacy `timestamp` when `generated` is absent. §13.1, §5.2.
- **BREAKING: body `# Citations` list → `sources` frontmatter** (per-source credibility signals `author`, `usage_count`, `last_modified`; per-claim attribution via markdown footnotes keyed to `sources[].id`). §13.1, §5.1.
- **Additive optional families:** `generated`, `verified` (→ trust tiers: unverified / machine-confirmed / human-reviewed), `status` (`draft|stable|deprecated`, default `stable`), `stale_after` (absolute ISO-8601 instant). New type `Attested Computation` with `runtime`/`parameters`/`computation`/`executor`/`attester`. §5, §10, §13.2. "Their absence yields a plain v0.1 concept." §13.2.
- Note: as of commit `62432a0` (2026-08-21), **all v0.2 timestamp-valued keys must be ISO 8601 datetimes with an explicit UTC offset** (date-only values are rejected by consumers). `GoogleCloudPlatform/knowledge-catalog` commit `62432a095456147ee71e70ac6e4dc0d2dea3ac30`.

---

## 3. Bundle / directory conventions

- A bundle is a **directory tree of markdown files**; structure is domain-independent (organize concepts however makes sense). May be distributed as a git repo (recommended), a tarball/zip, or a subdirectory of a larger repo. `…:SPEC.md` §3.
- **Reserved filenames (both OPTIONAL, MUST NOT be used for concept docs):**
  - `index.md` — directory listing for progressive disclosure (§8).
  - `log.md` — chronological history of updates (§9).
  These are the only two reserved names; all other `.md` files are concept documents. Carried forward from v0.1 unchanged. `…:SPEC.md` §3.1, §13.2.
- **No manifest file exists.** There is no manifest/registry; the only structured bundle-level metadata is an optional `okf_version` key in the root `index.md` (see §4 below). Verified by absence in §3/§3.1 and confirmed by §12.
- **Concept identity = file path.** "**Concept ID: The path of the concept's file within the bundle, with the `.md` suffix removed.**" (`…:SPEC.md` §2 Terminology). The blog states the same: "The file path is the concept's identity" (Google Cloud blog, "How OKF works: The design in one screen").
- **`index.md` format (§8):** no frontmatter *except* the bundle-root `index.md` MAY carry an `okf_version` key. Body is one or more `#` sections listing entries as `* [Title](relative-url) - short description`. Entries SHOULD reuse the linked concept's `description`. Auto-generatable; consumers MAY synthesize one on the fly.
- **`log.md` format (§9):** flat list of date-grouped entries, newest first. Date headings MUST be ISO 8601 `YYYY-MM-DD` (e.g. `## 2026-05-22`). Entries are prose; a leading bold word (`**Update**`, `**Creation**`, `**Deprecation**`) is convention, not required.
- **`references/` convention (v0.2, §6.3):** a `references/` subdirectory conventionally mirrors external material/code as first-class concepts. A naming convention, not a requirement. (Primarily used by v0.2 provenance/attestation.)

Origin note: `index.md` and `log.md` come directly from Karpathy's gist — `index.md` = "content-oriented … catalog of everything," `log.md` = "chronological … append-only record," with the tip to prefix entries (`## [2026-04-02] ingest | Article Title`) for grep-ability (Karpathy gist, "Two special files"). OKF formalized the log heading as `## YYYY-MM-DD`.

---

## 4. Cross-linking convention (§6.1)

- Concepts link to each other using **standard markdown links**, in two forms:
  - **Absolute (bundle-relative)** — begins with `/`, interpreted from the bundle root. **This is the recommended form** (stable when docs move within a subdirectory). Example: `[customers table](/tables/customers.md)`.
  - **Relative** — a normal markdown relative path, e.g. `[neighboring concept](./other.md)`.
- A link A→B asserts an **untyped relationship**; the kind (parent/child, references, joins-with, depends-on) is conveyed by surrounding prose, not the link. Graph consumers treat links as directed edges.
- **Broken links MUST be tolerated** — a link to a nonexistent target is not malformed (may be not-yet-written knowledge).
- Links point to the `.md` file (targets include the `.md` extension in the examples).
Citation: `…:SPEC.md` §6.1. Carried forward from v0.1 unchanged (§13.2). The blog also notes "cross-links" as a core v0.1 property.

---

## 5. Versioning (§12)

- The spec is versioned `<major>.<minor>`; current document is **Version 0.2**. Minor = backward-compatible additions; major = breaking changes (renaming required fields, changing reserved filenames). `…:SPEC.md` §12 and header ("**Version 0.2**").
- **Bundle-level version declaration:** "Bundles MAY declare the version they target with `okf_version: \"0.2\"` in a bundle-root `index.md` frontmatter block (the only place frontmatter is permitted in an `index.md`)." Consumers that don't understand the declared version SHOULD attempt best-effort consumption. `…:SPEC.md` §12, §8.
  - ⚠️ **Uncertainty:** `okf_version` is documented in the **v0.2** spec (§12). I could **not** verify from a primary source whether `okf_version` existed in v0.1, since no standalone v0.1 spec file/tag exists. If targeting v0.1 strictly, treat `okf_version` as unverified for v0.1.
- **No release tags or GitHub Releases** exist in either canonical repo (`.../tags` returns `[]` for both; `git/refs/tags` → 404). So version is asserted only by the `Version` line in `SPEC.md` and the optional `okf_version` bundle key — not by git tags.

---

## 6. Canonical spec location to cite as provenance

- **Primary announcement (v0.1):** Google Cloud blog — "How the Open Knowledge Format can improve data sharing" — https://cloud.google.com/blog/products/data-analytics/how-the-open-knowledge-format-can-improve-data-sharing (states "As published, **OKF v0.1** represents knowledge as a directory of markdown files with YAML frontmatter"). `scaccogatto/okf-skills:README.md` dates the announcement "Google Cloud, June 2026."
- **Canonical spec (current, v0.2):** https://github.com/GoogleCloudPlatform/open-knowledge-format/blob/main/SPEC.md — blob sha `c06e3eede0c910d0ecf12524c34204156f8795ac`, Apache-2.0 © Google LLC.
- **Frozen mirror (identical content):** https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md (same sha).
- **Verbatim-vendored reference commit:** `3fcbb9f828c2f23d109c855ee403c3a4c81f3a96` (cited by `scaccogatto/okf-skills:skills/okf/reference/SPEC.md:1-10` as the OKF reference-repo source).
- **v0.1 baseline text** (no standalone file/tag) is documented inside the v0.2 spec: `…:SPEC.md` §13 "Changes from v0.1" and Appendix A "v0.1 form."

---

## 7. Gaps, uncertainties & recommendations

- **v0.1 vs v0.2 is the biggest decision.** The task specifies v0.1, but the canonical spec, reference agent, sample bundles, and both major third-party toolkits are all **v0.2**. If Expert Packs want ecosystem/tooling compatibility (validators, visualizers, MCP servers), author **v0.2**; if you want the minimal announced baseline, **v0.1** = `{type (required), title, description, resource, tags, timestamp}` + `index.md`/`log.md` + markdown cross-links, with body `# Citations` for provenance.
- **No standalone v0.1 spec artifact.** No v0.1 tag/release/file exists; v0.1 is only reconstructable from §13 + Appendix A of the v0.2 spec, or from git history of `okf/SPEC.md` (I did not pin the exact pre-v0.2 commit — history is available at `GoogleCloudPlatform/knowledge-catalog/commits?path=okf/SPEC.md` if precise v0.1 provenance is required).
- **`okf_version` in v0.1 unverified** (see §5).
- **Blog body truncated at a code/image block** in the fetched markdown (the "design in one screen" frontmatter example is an image), so the blog's inline spec-link target could not be extracted directly; provenance to the canonical repo was instead established via the frozen mirror's README and the verbatim-vendored copy — both primary/Google-owned sources.
- **Reserved-heading conventions (non-normative but useful):** `# Schema`, `# Examples` (v0.1-compatible), and v0.2-only `# Computation`. `…:SPEC.md` §4.2.
- **Recommended concrete model to copy:** the `acme_retail` sample bundle (`GoogleCloudPlatform/open-knowledge-format/tree/main/bundles/…` or the mirror's `okf/bundles/acme_retail/`) is a real, spec-conformant bundle you can mirror for your wiki's directory layout — I did not fetch its files but they are the canonical worked examples referenced by the README.