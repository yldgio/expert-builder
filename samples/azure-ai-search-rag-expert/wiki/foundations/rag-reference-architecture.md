---
type: Reference
title: RAG reference architecture on Azure AI Search
description: End-to-end classic and agentic RAG patterns and when to use each.
tags: [foundations]
generated: { by: expert-builder/v1, at: 2026-09-03T10:22:00Z }
stale_after: 2026-12-02T00:00:00Z
sources:
  - id: rag-overview
    resource: https://learn.microsoft.com/azure/search/retrieval-augmented-generation-overview
    title: "Retrieval-augmented generation (RAG) in Azure AI Search"
    last_modified: 2026-09-03T00:00:00Z
  - id: arch-guide
    resource: https://learn.microsoft.com/azure/architecture/ai-ml/guide/rag/rag-solution-design-and-evaluation-guide
    title: "Design and develop a RAG solution (Azure Architecture Center)"
    last_modified: 2026-09-03T00:00:00Z
  - id: foundry-rag
    resource: https://learn.microsoft.com/azure/ai-foundry/concepts/retrieval-augmented-generation
    title: "Retrieval augmented generation (RAG) and indexes (Azure AI Foundry)"
    last_modified: 2026-09-03T00:00:00Z
  - id: sample
    resource: https://github.com/Azure-Samples/azure-search-openai-demo
    title: "Azure-Samples/azure-search-openai-demo"
    last_modified: 2026-09-03T00:00:00Z
verified:
  - { by: expert-builder/v1, at: 2026-09-03T10:22:00Z }
---

# RAG reference architecture on Azure AI Search

RAG combines an information-retrieval step with an LLM so that answers are grounded in your own indexed
content instead of only the model's training data.[^rag-overview] Azure AI Search provides the
retrieval layer; an Azure OpenAI / Azure AI Foundry model provides generation.

## The two shapes

Azure AI Search supports two RAG shapes, and the docs recommend starting with agentic retrieval for
new solutions while migrating existing classic solutions when the accuracy gain justifies it.[^rag-overview]

### Classic RAG (app-orchestrated)

The application orchestrates a single retrieve-then-generate loop:

1. A user query is sent to a search index.
2. **Semantic ranking identifies the top 50 most relevant results**, with configurable result limits
   (top-k for vectors, top-n for text), minimum thresholds, scoring profiles to boost critical content,
   and a `select` statement to control returned fields.[^rag-overview]
3. The top chunks are passed to the LLM as grounding data; the response includes **built-in citation
   tracking** that shows provenance.[^rag-overview]

### Agentic RAG (search-orchestrated)

A newer pipeline introduces three objects — one or more **knowledge sources** (each points to
searchable content such as a search index or a remote SharePoint site), a **knowledge base** (the
queryable object that unifies those sources), and a **retrieve action** the app calls from code, e.g.
as a tool for an AI agent.[^rag-overview] It returns structured responses with grounding data,
citations, and execution metadata, plus optional LLM answer synthesis.[^rag-overview] See
[Agentic retrieval](/retrieval/agentic-retrieval.md).

## End-to-end components

A production RAG solution on Azure AI Search assembles:

- **Ingestion & indexing** — an indexer + skillset (optionally with integrated vectorization) that
  chunk, embed, and load content into an index. See
  [Data ingestion and indexing](/ingestion/data-ingestion-and-indexing.md).[^rag-overview]
- **Retrieval** — vector, hybrid, and semantic ranking (classic) or agentic retrieval. See
  [Vector, hybrid, and semantic ranking](/retrieval/vector-hybrid-semantic-ranking.md).
- **Generation** — an Azure OpenAI / Azure AI Foundry chat model that consumes the grounding
  data.[^foundry-rag]
- **Orchestration** — app code, Azure AI Foundry, prompt flow, or an agent framework that wires
  retrieval to generation.[^foundry-rag]
- **Security, evaluation, and monitoring** — cross-cutting concerns covered in their own concepts.

The Azure Architecture Center "Design and develop a RAG solution" guide is the authoritative
end-to-end design reference,[^arch-guide] and `Azure-Samples/azure-search-openai-demo` is a working
reference implementation.[^sample]

## Choosing between them

Use classic RAG when the app already owns orchestration and a single index answers most questions; use
agentic retrieval when queries are complex, span multiple sources, or need LLM-assisted query planning
and answer synthesis. For new implementations the docs recommend starting with agentic
retrieval.[^rag-overview]

[^rag-overview]: "Retrieval-augmented generation (RAG) in Azure AI Search." https://learn.microsoft.com/azure/search/retrieval-augmented-generation-overview#how-azure-ai-search-meets-rag-challenges
[^arch-guide]: "Design and develop a RAG solution." Azure Architecture Center. https://learn.microsoft.com/azure/architecture/ai-ml/guide/rag/rag-solution-design-and-evaluation-guide
[^foundry-rag]: "Retrieval augmented generation (RAG) and indexes." Azure AI Foundry. https://learn.microsoft.com/azure/ai-foundry/concepts/retrieval-augmented-generation#rag-workflow-in-foundry
[^sample]: "Azure-Samples/azure-search-openai-demo." GitHub. https://github.com/Azure-Samples/azure-search-openai-demo
