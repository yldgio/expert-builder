# 07 — Design the Expert AGENTS.md template

Type: grilling
Status: resolved
Blocked by: 02, 04

## Question

Design the **specialized `AGENTS.md`** template the builder writes into every Pack — the system instructions that make the running Expert behave as a domain expert.

Decide:
- The sections: the Expert's role/persona, the domain boundary (from the interview, ticket 02), how and when to consult the Wiki, when to run the maintenance skill, and behavioral guardrails (no unverified claims, cite the Wiki).
- How it points at the Wiki (OKF bundle) so the Expert reads before answering.
- What is templated vs. filled from the interview brief.
- How it stays harness-agnostic while validated on Copilot CLI.
- Its relationship to the README (launch instructions).

Depends on the interview output (02) and Wiki structure (04).

## Answer

**Section skeleton (six sections):**
1. **Role** — "You are an expert in `<domain>`" (filled from the brief).
2. **Scope & boundaries** — what's in/out (from the brief).
3. **The Wiki as knowledge source** — read `wiki/index.md` first; navigate by topic/tag/`type`; `Reference` concepts are authoritative.
4. **Answering protocol** — consult the Wiki before answering; ground every claim in concepts and cite the concept + its `sources`; if the Wiki doesn't cover it, say so plainly and offer to run `refresh`/seed rather than guessing; visibly distinguish Wiki-grounded answers from general reasoning.
5. **Maintenance** — when/how to run the `refresh` skill.
6. **Guardrails** — no unverified claims, cite provenance, stay in scope, don't fabricate.

**Scope handling (inline + reference):** `AGENTS.md` inlines the essential role + boundary (a self-sufficient system prompt, generated from the brief at build time) **and** instructs the Expert to consult `brief.md` for the authoritative version — drift-safe redundancy.

**Maintenance trigger from within the Expert:** when it hits a stale (`stale_after` passed) or missing concept mid-task, it **suggests `refresh` and waits** (opt-in); the user can say "keep yourself updated" to enable auto-refresh. Bulk maintenance stays the explicit `refresh` invocation.

**README split (human vs agent):** `README.md` is human-facing (what the expert is, scope summary, how to **launch** it with a Copilot CLI reference command, how to run `refresh`, what's in the Pack); `AGENTS.md` is agent-facing (behavior only). Harness-agnostic: `AGENTS.md` is the single canonical convention file, no harness-specific tool names in the instructions, validated on Copilot CLI, **no alias files** (`CLAUDE.md` etc.) in v1.

**`AGENTS.md` and `brief.md` are maintained artifacts** (per user requirement; policy also amended into ticket 05). The `refresh` loop keeps the instructions aligned and current:
- **Rule/fact-derived content** (descriptive parts of the brief; Wiki concepts) → **auto-update** (machine trust tier, logged, git-revertible).
- **`AGENTS.md` ↔ `brief.md` alignment** → **auto**: whenever `brief.md` changes, regenerate `AGENTS.md`'s inline scope snapshot from it.
- **Human-decided scope** (boundary, audience, success criteria) → **propose for review, never silent**.
- **Trigger ("rules changed"):** when a refresh finds an authoritative/governing `Reference` concept's source was revised, it auto-updates affected concepts + the brief's descriptive content, re-aligns `AGENTS.md`, and if scope may be affected, routes it to the review path.
