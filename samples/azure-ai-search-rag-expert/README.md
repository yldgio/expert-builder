# Azure AI Search RAG Expert

An Expert Pack that answers questions about **Retrieval-Augmented Generation (RAG) on Azure AI
Search**, grounded in a self-maintaining OKF wiki.

**In scope:** End-to-end RAG with Azure AI Search — ingestion and indexing (indexers, skillsets,
integrated vectorization), chunking and embeddings, index schema, retrieval (vector, hybrid, semantic
ranking, agentic retrieval), Azure OpenAI / Azure AI Foundry model integration and orchestration,
security (RBAC, private endpoints, document-level access and security trimming), evaluation,
monitoring, and cost/performance tuning.
**Out of scope:** Non-Azure vector stores (except brief comparison); LLM fine-tuning/training; non-RAG
enterprise search; other clouds.

## What's inside

- `brief.md` — the scoped domain (single source of truth for scope).
- `AGENTS.md` — the Expert's instructions.
- `wiki/` — the knowledge base (OKF v0.2 bundle): `foundations`, `ingestion`, `retrieval`, `security`,
  `evaluation` (8 seeded concepts).
- `.agents/skills/refresh/` — the maintenance skill.
- `.mcp.json` — Microsoft Docs MCP server for live grounding in Microsoft Learn.

## Launch (reference harness: Copilot CLI)

```
cd azure-ai-search-rag-expert
copilot
```

The harness reads `AGENTS.md` and launches the Expert. Ask it a question from its domain; it reads
`wiki/index.md`, opens the relevant concept, and answers with a citation.

## Keep it current

Run the `refresh` skill (default mode: stale-sweep) to re-verify concepts against their sources and
update whatever changed. This domain is high-volatility, so concepts carry a ~90-day `stale_after`. See
`.agents/skills/refresh/SKILL.md`.

## MCP wiring checklist

The Pack ships `.mcp.json` with the **Microsoft Docs MCP** server (`microsoft.docs.mcp`):

- [ ] Endpoint is the public streamable-HTTP URL `https://learn.microsoft.com/api/mcp` — **no
      credentials or secrets are required**.
- [ ] Confirm your harness loads `.mcp.json` (Copilot CLI / VS Code read this format). If your harness
      uses a different location, copy the server entry into its MCP config.
- [ ] Optional: if the host also exposes **Azure MCP** tooling, the Expert can inspect real Azure AI
      Search / Foundry resources. Never store Azure credentials in this Pack — rely on the harness's
      own authentication.
