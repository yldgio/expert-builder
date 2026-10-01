# Expert Builder

The project builds a process that produces self-maintaining, portable "expert" agent ecosystems from a domain the user names, runnable inside a harness like Copilot CLI.

## Language

**Expert Builder**:
The process (delivered as a single self-contained skill) that interviews the user, scopes a domain, and scaffolds an Expert Pack. Embeds its own interview and research logic inline; does not depend on other skills being installed.
_Avoid_: generator, factory, wizard

**Expert Pack**:
The portable folder the Expert Builder produces: specialized `AGENTS.md`, a living wiki, a bundled maintenance skill, and optional domain skills / MCP config. Self-contained and launch-ready in any compatible harness.
_Avoid_: expert folder, ecosystem, knowledge base, expertise

**Expert**:
The running agent instance launched inside an Expert Pack — the specialized assistant that answers as a domain expert.
_Avoid_: agent, bot, assistant

**Wiki**:
The Expert Pack's living knowledge, stored as an Open Knowledge Format bundle (a directory of markdown files with YAML frontmatter). The wiki is what the maintenance loop keeps current.
_Avoid_: docs, knowledge base, notes

**Open Knowledge Format (OKF)**:
Vendor-neutral open specification (v0.1) representing knowledge as a directory of markdown files with YAML frontmatter (fields such as `type, title, description, resource, tags, timestamp`), one concept per file. The chosen on-disk shape for the Wiki.
_Avoid_: OKM, LLM-wiki (the pattern OKF formalizes)

**Maintenance skill**:
A skill bundled inside every Expert Pack that refreshes the Wiki on demand: re-runs research, diffs against current knowledge, updates the affected concepts, and logs provenance.
_Avoid_: updater, refresher, cron job

**Harness**:
The agent runtime an Expert Pack is launched inside (e.g. Copilot CLI). Expert Packs are authored harness-agnostic and validated against Copilot CLI as the reference harness.
_Avoid_: runtime, host, engine

**Domain Brief**:
The structured artifact the Expert Builder's interview produces, capturing the scoped domain across five dimensions (boundary, audience & tasks, design problems, knowledge sources, success criteria). Persisted as a top-level `brief.md` in the Pack and used as the single source of truth for scope by `AGENTS.md` and the maintenance skill.
_Avoid_: charter, scope doc, spec

**Domain skill**:
A task-specific skill included in an Expert Pack beyond the mandatory maintenance skill. Sourced by **discovery and reuse** (searching a bundled catalog of known skill repositories, plus search), vendored into the Pack's `.agents/skills/`, never authored from scratch by the builder.
_Avoid_: custom skill, bespoke skill, generated skill

**Skill catalog**:
The curated list of known skill repositories bundled inside the Expert Builder, searched first when discovering candidate Domain skills.
_Avoid_: registry, index, skill store

**Wiki MCP**:
The read-only MCP server vendored into an Expert Pack that indexes the Wiki and serves retrieval, update-state, and graph tools. The Pack's `.mcp.json` spawns it with the Wiki path as an argument.
_Avoid_: wiki server, indexer, knowledge server
