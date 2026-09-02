# 03 — Decide the skills / MCP inclusion policy

Type: grilling
Status: open
Blocked by: —

## Question

Decide **when and how** the Expert Builder generates the domain-contingent parts of a Pack: extra domain skills and `.mcp.json`.

Decide:
- The decision rule: what signal from the interview means "this domain needs an MCP server" or "this domain needs a bespoke skill" vs. leaving them out.
- Whether the builder generates these itself, stubs them, or just records a recommendation for the user to wire.
- For MCP specifically: does the builder configure real servers (requiring credentials/setup — a `task`-type step) or only emit a template `.mcp.json`?
- How these optional parts are marked so a Pack with none is still valid and launch-ready.

Keeps the mandatory core (AGENTS.md + Wiki + maintenance skill) clean while allowing richer Packs.
