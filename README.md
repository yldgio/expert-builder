# Expert Builder

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Code of Conduct](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](CODE_OF_CONDUCT.md)

**Expert Builder** turns a domain you name into a portable, self-maintaining **Expert
Pack**: a folder an agent harness is launched inside to answer as an expert on that
domain. Its knowledge is a living wiki in the [Open Knowledge Format](#glossary); a
bundled `refresh` skill keeps that wiki current, and a default Wiki MCP server provides
structured retrieval when Node.js is available.

It ships as a single, self-contained skill that works with **any agent harness** —
Copilot CLI is the reference harness, but the skill and the Packs it produces are
harness-agnostic. No other installed skill is required.

## Installation

Add the skill to your project with the [`skills`](https://www.npmjs.com/package/skills)
CLI:

```bash
npx skills@latest add yldgio@expert-builder
```

This vendors the `expert-builder` skill into your project's `.agents/skills/`, ready to
invoke from your harness.

## How it works

Expert Builder is a skill that interviews you and scaffolds a Pack in eight steps:

1. **Take the seed** — the domain the expert should cover.
2. **Interview → Domain Brief** — a structured interview pins five dimensions
   (boundary, audience & tasks, design problems, knowledge sources, success
   criteria) and writes them to `brief.md`.
3. **Confirm the build plan** — Pack name, location, seeding budget, and any optional
   skills or additional MCP servers.
4. **Scaffold** — create the Pack skeleton, copy in the `refresh` skill verbatim, and
   vendor Wiki MCP with a merged `.mcp.json` entry.
5. **Seed the wiki** — research and write the top-priority concepts, each with full
   per-claim provenance, in Open Knowledge Format.
6. **Optional components** — vendor reusable domain skills and add any additional MCP
   servers with credential placeholders when the brief calls for them.
7. **Write `AGENTS.md`** — the Expert's role, scope, wiki-reading and answering
   protocol, and guardrails.
8. **Write `README`, self-check, and report** — verify the Pack against its
   acceptance criteria and hand you the launch command.

The full procedure lives in
[`.agents/skills/expert-builder/SKILL.md`](.agents/skills/expert-builder/SKILL.md).

## What a Pack contains

Every Expert Pack the builder produces is self-contained and launch-ready:

```
<expert-slug>/
  brief.md                 # the scoped domain — single source of truth for scope
  AGENTS.md                # the Expert's instructions (role, scope, protocol, guardrails)
  wiki/                    # the knowledge base (OKF bundle): index.md, log.md, topic folders
  .agents/skills/refresh/  # the bundled maintenance skill
  .mcp/
    wiki-server.mjs        # the default Wiki MCP server
  README.md                # what the expert is and how to launch it
  .mcp.json                # Wiki MCP plus any optional MCP server entries
```

Wiki MCP tools require **Node.js ≥ 20 on `PATH`**. Packs remain usable without Node.js through the
file-based Wiki-reading fallback in `AGENTS.md`; the bundled server needs no install or network
access at runtime.

## Requirements

- An agent harness that reads `AGENTS.md` and loads skills from `.agents/skills/`.
  Packs are authored harness-agnostic and validated against **Copilot CLI** as the
  reference harness.

## Quick start

**1. Build an expert.** Launch your harness in a project that has the skill installed
and invoke the `expert-builder` skill (it is explicitly invoked, never auto-triggered).
With Copilot CLI:

```bash
copilot
```

Then ask it to build an expert — for example, *"Build me an expert on Kubernetes
network policies."* The skill runs the interview and scaffolds a new Pack folder in
your working directory.

**2. Launch the expert.** Change into the generated Pack and launch the harness
again:

```bash
cd <expert-slug>
copilot
```

The harness reads the Pack's `AGENTS.md`; the Expert uses Wiki MCP when available, or reads
`wiki/index.md` and the relevant concept files directly as a fallback, then answers with a citation.

**3. Keep it current.** Inside a Pack, run the bundled `refresh` skill to re-verify
concepts against their sources and update whatever changed — a named concept, a gap,
or the whole wiki.

## Try the sample

[`samples/azure-ai-search-rag-expert/`](samples/azure-ai-search-rag-expert) is a
complete Expert Pack produced by the builder — an expert on Retrieval-Augmented
Generation on Azure AI Search, with a seeded OKF wiki, a `refresh` skill, the default Wiki MCP,
and a Microsoft Docs MCP server. See its
[README](samples/azure-ai-search-rag-expert/README.md) to launch it.

## Repository layout

```
.
├── .agents/skills/expert-builder/   # the Expert Builder skill and its assets
│   ├── SKILL.md                     # the eight-step build procedure
│   └── assets/                      # templates, OKF profile, Wiki MCP bundle, skill catalog, refresh skill
├── scripts/                         # maintainer scripts
├── tools/wiki-mcp/                  # Wiki MCP source and build output
├── samples/                         # a complete example Expert Pack
├── docs/agents/                     # how the engineering skills consume this repo
├── .scratch/                        # local issue tracker (specs and design tickets)
├── CONTEXT.md                       # project glossary — the shared vocabulary
├── AGENTS.md                        # working agreement for agents in this repo
└── skills-lock.json                # pinned versions of vendored development skills
```

## Refresh the vendored Wiki MCP bundle

After changing Wiki MCP, run the package's build and tests, then copy the build output from the
repository root:

```bash
cd tools/wiki-mcp
npm test
cd ../..
node scripts/refresh-wiki-mcp.mjs
```

## Glossary

This project uses a deliberate, consistent vocabulary — **Expert Builder**, **Expert
Pack**, **Expert**, **Wiki**, **Open Knowledge Format (OKF)**, **maintenance skill**,
**harness**, **Domain Brief**, **domain skill**, and **skill catalog**. Each term and
the synonyms to avoid are defined in [`CONTEXT.md`](CONTEXT.md). Please use it when
contributing.

## Contributing

Contributions are welcome. Please read [`CONTRIBUTING.md`](CONTRIBUTING.md) and follow
the [Code of Conduct](CODE_OF_CONDUCT.md). Security issues should be reported
privately per [`SECURITY.md`](SECURITY.md).

## License

Released under the [MIT License](LICENSE).
