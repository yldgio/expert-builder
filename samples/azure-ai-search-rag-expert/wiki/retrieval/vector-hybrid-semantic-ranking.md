---
type: Reference
title: Vector, hybrid, and semantic ranking
description: Query types and the two-stage relevance model.
tags: [retrieval]
generated: { by: expert-builder/v1, at: 2026-09-03T10:22:00Z }
stale_after: 2026-12-02T00:00:00Z
sources:
  - id: vector
    resource: https://learn.microsoft.com/azure/search/vector-search-overview
    title: "Vector search in Azure AI Search"
    last_modified: 2026-09-03T00:00:00Z
  - id: hybrid
    resource: https://learn.microsoft.com/azure/search/hybrid-search-overview
    title: "Hybrid search using vectors and full-text search in Azure AI Search"
    last_modified: 2026-09-03T00:00:00Z
  - id: semantic
    resource: https://learn.microsoft.com/azure/search/semantic-search-overview
    title: "Semantic ranking in Azure AI Search"
    last_modified: 2026-09-03T00:00:00Z
  - id: relevance
    resource: https://learn.microsoft.com/azure/search/search-relevance-overview
    title: "Relevance in Azure AI Search"
    last_modified: 2026-09-03T00:00:00Z
  - id: vector-ranking
    resource: https://learn.microsoft.com/azure/search/vector-search-ranking
    title: "Relevance in vector search"
    last_modified: 2026-09-03T00:00:00Z
verified:
  - { by: expert-builder/v1, at: 2026-09-03T10:22:00Z }
---

# Vector, hybrid, and semantic ranking

Azure AI Search offers several query types, and the docs identify two strategies as the best approaches
for highly relevant results: **hybrid search with the semantic ranker**, and **agentic retrieval with
LLM-assisted query planning and answer synthesis**.[^relevance] This concept covers the first; see
[Agentic retrieval](/retrieval/agentic-retrieval.md) for the second.

## The query types

- **Vector search** — retrieves by nearest-neighbor similarity over vector fields, matching on meaning
  rather than exact terms.[^vector]
- **Keyword (full-text) search** — matches the verbatim query terms with the BM25-style text scorer.[^hybrid]
- **Hybrid search** — a single request that combines the precision of keyword queries with the semantic
  similarity of vector queries. Keyword and vector queries **execute in parallel**; their results are
  **merged, ranked, and then rescored using the semantic ranker** to promote the most relevant
  matches.[^relevance][^hybrid]

## Two-stage relevance model

Relevance is best understood as levels of ranking: an initial retrieval score, then optional
reranking.[^relevance]

1. **Initial ranking** — text uses the similarity scorer; vector queries score by similarity, with a
   choice between **HNSW** (approximate, fast) and **exhaustive KNN** for the nearest-neighbor
   search.[^relevance][^vector-ranking]
2. **Semantic ranking** — a second-stage reranker re-scores an initial result set to surface the most
   relevant results; in classic RAG it identifies the top results fed to the LLM.[^semantic]

## Relevance tuning levers

Tuning options vary by query type:[^relevance]

- **Text / numeric (keyword or hybrid):** scoring profiles (weighted fields, freshness, proximity) and
  the semantic ranker.[^relevance]
- **Vector component of a hybrid query:** weight the vector field to boost it relative to the text
  component.[^relevance]
- **Pure vector queries:** experiment between HNSW and exhaustive KNN.[^relevance][^vector-ranking]

## Guidance

Default to **hybrid + semantic ranker** for classic RAG: it gives keyword precision, vector recall, and
a relevance-focused rerank in one request.[^relevance] Tune with scoring profiles and vector weighting,
and validate changes with the evaluation loop in
[Evaluation, monitoring, and relevance tuning](/evaluation/evaluation-monitoring-and-tuning.md).

[^vector]: "Vector search in Azure AI Search." https://learn.microsoft.com/azure/search/vector-search-overview#how-does-vector-search-work
[^hybrid]: "Hybrid search using vectors and full-text search in Azure AI Search." https://learn.microsoft.com/azure/search/hybrid-search-overview#how-does-hybrid-search-work
[^semantic]: "Semantic ranking in Azure AI Search." https://learn.microsoft.com/azure/search/semantic-search-overview#what-is-semantic-ranking
[^relevance]: "Relevance in Azure AI Search." https://learn.microsoft.com/azure/search/search-relevance-overview#strategies-for-highly-relevant-results
[^vector-ranking]: "Relevance in vector search." https://learn.microsoft.com/azure/search/vector-search-ranking#tips-for-relevance-tuning
