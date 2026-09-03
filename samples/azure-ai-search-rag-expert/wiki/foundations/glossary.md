---
type: Glossary
title: Glossary
description: Core RAG and Azure AI Search vocabulary.
tags: [foundations]
generated: { by: expert-builder/v1, at: 2026-09-03T10:22:00Z }
stale_after: 2026-12-02T00:00:00Z
sources:
  - id: rag-overview
    resource: https://learn.microsoft.com/azure/search/retrieval-augmented-generation-overview
    title: "Retrieval-augmented generation (RAG) in Azure AI Search"
    last_modified: 2026-09-03T00:00:00Z
  - id: iv
    resource: https://learn.microsoft.com/azure/search/vector-search-integrated-vectorization
    title: "Integrated vector embedding in Azure AI Search"
    last_modified: 2026-09-03T00:00:00Z
  - id: hybrid
    resource: https://learn.microsoft.com/azure/search/hybrid-search-overview
    title: "Hybrid search using vectors and full-text search in Azure AI Search"
    last_modified: 2026-09-03T00:00:00Z
  - id: semantic
    resource: https://learn.microsoft.com/azure/search/semantic-search-overview
    title: "Semantic ranking in Azure AI Search"
    last_modified: 2026-09-03T00:00:00Z
  - id: agentic
    resource: https://learn.microsoft.com/azure/search/agentic-retrieval-overview
    title: "Agentic retrieval in Azure AI Search"
    last_modified: 2026-09-03T00:00:00Z
  - id: what-is
    resource: https://learn.microsoft.com/azure/search/search-what-is-azure-search
    title: "What is Azure AI Search?"
    last_modified: 2026-09-03T00:00:00Z
verified:
  - { by: expert-builder/v1, at: 2026-09-03T10:22:00Z }
---

# Glossary

Shared vocabulary for RAG on Azure AI Search. Terms link to the concept that develops them.

- **RAG (Retrieval-Augmented Generation)** — an architecture that adds an information-retrieval step
  in front of a large language model (LLM), so responses are grounded in your own indexed content
  rather than only the model's training data.[^rag-overview]
- **Azure AI Search** — the Azure service that provides the retrieval layer: it indexes content and
  serves keyword, vector, hybrid, semantic, and agentic queries over it.[^what-is]
- **Index** — the searchable store of documents with a defined schema of fields; a RAG index typically
  holds chunked text plus one or more vector fields.[^iv]
- **Indexer** — a crawler that retrieves raw data from a supported data source and drives the indexing
  pipeline.[^iv]
- **Skillset** — a set of enrichment/transformation steps (skills) attached to an indexer, e.g. a
  chunking skill and an embedding skill.[^iv]
- **Integrated vectorization** — built-in data chunking and vector conversion during indexing (and
  query-time vectorization), so you do not run a separate embedding pipeline.[^iv]
- **Embedding / vector** — a numeric vector representation of text (or images) produced by an embedding
  model; similarity between vectors approximates semantic similarity.[^iv]
- **Vector search** — retrieval by nearest-neighbor similarity over vector fields.[^hybrid]
- **Hybrid search** — a single request that runs keyword and vector queries in parallel and merges
  their results.[^hybrid]
- **Semantic ranker (semantic ranking)** — a second-stage reranker that re-scores an initial result
  set to promote the most relevant matches.[^semantic]
- **Agentic retrieval** — a multi-query pipeline that uses an LLM to plan and decompose a query into
  focused subqueries executed in parallel against a knowledge base.[^agentic]
- **Knowledge base / knowledge source** — the queryable object (knowledge base) that unifies one or
  more content pointers (knowledge sources) for agentic retrieval.[^agentic]
- **Grounding / grounding data** — the retrieved chunks passed to the LLM as context so its answer is
  supported by your content, with citations back to the source.[^rag-overview]

[^rag-overview]: "Retrieval-augmented generation (RAG) in Azure AI Search." https://learn.microsoft.com/azure/search/retrieval-augmented-generation-overview
[^iv]: "Integrated vector embedding in Azure AI Search." https://learn.microsoft.com/azure/search/vector-search-integrated-vectorization#using-integrated-vectorization-during-indexing
[^hybrid]: "Hybrid search using vectors and full-text search in Azure AI Search." https://learn.microsoft.com/azure/search/hybrid-search-overview#how-does-hybrid-search-work
[^semantic]: "Semantic ranking in Azure AI Search." https://learn.microsoft.com/azure/search/semantic-search-overview#what-is-semantic-ranking
[^agentic]: "Agentic retrieval in Azure AI Search." https://learn.microsoft.com/azure/search/agentic-retrieval-overview
[^what-is]: "What is Azure AI Search?" https://learn.microsoft.com/azure/search/search-what-is-azure-search#what-is-agentic-retrieval
