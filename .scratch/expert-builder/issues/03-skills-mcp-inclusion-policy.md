# 03 — Decide the skills / MCP inclusion policy

Type: grilling
Status: resolved
Blocked by: —

## Question

Decide **when and how** the Expert Builder generates the domain-contingent parts of a Pack: extra domain skills and `.mcp.json`.

Decide:
- The decision rule: what signal from the interview means "this domain needs an MCP server" or "this domain needs a bespoke skill" vs. leaving them out.
- Whether the builder generates these itself, stubs them, or just records a recommendation for the user to wire.
- For MCP specifically: does the builder configure real servers (requiring credentials/setup — a `task`-type step) or only emit a template `.mcp.json`?
- How these optional parts are marked so a Pack with none is still valid and launch-ready.

Keeps the mandatory core (AGENTS.md + Wiki + maintenance skill) clean while allowing richer Packs.

## Answer

**Trigger (brief-driven, propose-then-confirm):** the builder proposes an optional component **only when the Domain Brief surfaced a concrete need** — a live data source needing an MCP server, or a recurring expert task needing a skill. No need in the brief → no component. The builder proposes; the user confirms before anything is added (HITL).

**Domain skills — reuse by discovery, never author:** when the brief calls for a task-specific skill, the builder **discovers existing skills rather than writing them**:
- Discovery mechanism: search a **curated catalog of known skill repositories bundled inside the builder** first, plus general GitHub/web search — the self-contained baseline. It degrades *up* to the `find-skills` skill opportunistically when that happens to be installed, but never depends on it.
- Matched skills are **vendored into the Pack's `.agents/skills/`** so the Pack stays self-contained at runtime.
- **No-match fallback:** record the unmet task as a **gap in the Domain Brief** and author nothing (no fabricating an unverifiable expert procedure). Additionally **prompt the user to supply or create the skill if they have one** — non-blocking; if declined, it stays logged as a gap for a later human/maintenance pass.
- **Licensing/provenance:** copy only clearly permissively-licensed skills; **record each vendored skill's source repo + license** (in the Domain Brief / README); **skip anything without a clear permissive license** and surface it to the user. (Respects the copyright guardrail.)

**MCP — template, not secrets:** when the brief identifies a live data source needing MCP, the builder **emits a template `.mcp.json`** with the server entry + credential **placeholders**, plus a "wire these credentials" checklist in the README. It **never embeds secrets**; real provisioning is a human `task` step.

**Empty case stays valid:** a Pack with no domain skills / no MCP **omits those files entirely** (no `.mcp.json`; `.agents/skills/` holds only the maintenance skill). Mandatory core alone is a valid, launch-ready Pack. The README documents what's present, and the **Domain Brief records which optional components were included and why** (build-decision provenance).
