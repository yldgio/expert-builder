# 05 — Design the maintenance / refresh skill

Type: grilling
Status: resolved
Blocked by: 01, 04

## Question

Design the **maintenance skill** bundled into every Expert Pack — the on-demand loop that keeps the Wiki current.

Decide:
- The loop's steps: re-run research → diff against current concepts → update affected files → update provenance/timestamps → log what changed.
- Its inputs: what the Expert or user passes (a topic, a concept, "everything"?) and how scope is bounded so a refresh is affordable.
- How it decides a concept is stale or wrong (relies on provenance from ticket 04).
- Its output/report: what the user sees after a run.
- Self-containment: it must run inside the Pack with no dependency on the mattpocock skills — what research technique does it embed?
- Guardrails: no unverified claims written into the Wiki; every update carries provenance.

Depends on the Wiki structure (04) and OKF conventions (01).

## Answer

Working name: the `refresh` skill, bundled in every Pack's `.agents/skills/`.

**Invocation modes (default = stale-sweep), per-concept with a batch cap for affordability:**
- **targeted** — a named concept or topic folder.
- **stale-sweep** (default) — every concept whose `stale_after` has passed.
- **full** — re-verify everything (explicit opt-in).

**Staleness signals (a concept is a candidate if any hold):**
- `stale_after` has passed (time-based);
- an upstream `sources[].last_modified` is newer than the concept's `generated.at` (source changed);
- the user names it explicitly.

**Scope of change:** refreshes existing concepts **and** may **add** new ones conservatively — only when a refresh surfaces clearly in-scope new knowledge (checked against the Domain Brief boundary) or fills a gap the brief logged; every addition is logged. No off-domain drift.

**Write & trust model:** **auto-write.** Each updated concept is stamped `generated{by: maintenance, at: now}`, refreshed `sources`, and a machine-level `verified` tier; every change is appended to `log.md`. Git history + `log.md` make writes auditable/revertible; a human promotes a concept to the human-reviewed tier on review.

**Loop steps:**
1. Select targets by mode + staleness signals; build a batch-capped work list.
2. Per concept: read `sources`; re-fetch/verify each source (embedded research).
3. Diff fetched reality against current claims.
4. If content changed: rewrite affected sections, refresh `sources[].last_modified`, set `generated{by:maintenance,at:now}` + machine `verified` tier, and recompute `stale_after` from brief volatility. If unchanged: leave `generated.at`, but still recompute `stale_after` (so it isn't re-checked immediately).
5. In-scope new knowledge: add a boundary-checked concept or fill a logged gap.
6. Update `index.md` for added/removed concepts.
7. Append a dated entry to `log.md`.
8. Emit the run report.

Key subtlety: `stale_after` = "next check due", recomputed on **every** check; `generated.at` moves only on real content change — keeps both timestamps honest and prevents thrashing.

**Embedded (self-contained) research technique:** the `refresh` `SKILL.md` embeds the procedure inline and uses whatever tools the host harness exposes (web fetch, search, file read, re-running a captured command) to re-fetch each concept's `sources`; it may dispatch subagents if the harness supports them, degrading to single-threaded inline research otherwise. No dependency on the `research` skill. **Unreachable/paywalled source → flag the concept (log + `status`), never fabricate** — the concrete enforcement of "no unverified claims".

**Run report:** mode + scope; **N checked, M updated** (each with a one-line "what changed"), **K added**; **skipped/failed** (unreachable sources, out-of-scope findings not written); pointers to the `log.md` entry + git diff.

## Amendment (from ticket 07)

Maintenance scope **extends beyond `wiki/` to the Pack's instruction artifacts** — `brief.md` and `AGENTS.md` — so the instructions stay aligned and current as domain rules change:
- **Rule/fact-derived content** (descriptive parts of the brief; Wiki concepts) → **auto-update** (machine trust tier, logged, git-revertible).
- **`AGENTS.md` ↔ `brief.md` alignment** → **auto**: whenever `brief.md` changes, regenerate `AGENTS.md`'s inline scope snapshot from it.
- **Human-decided scope** (boundary, audience, success criteria in the brief) → **propose for review, never silently rewritten** (scope is an interview decision).
- **Trigger ("rules changed"):** a refresh finding that an authoritative/governing `Reference` concept's source was revised auto-updates affected concepts + the brief's descriptive content, re-aligns `AGENTS.md`, and routes any scope-affecting change to the review path.
