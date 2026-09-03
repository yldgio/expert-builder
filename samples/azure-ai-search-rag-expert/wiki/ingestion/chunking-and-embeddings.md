---
type: Guide
title: Chunking and embeddings
description: Chunking strategies and embedding-model choices for RAG quality.
tags: [ingestion]
generated: { by: expert-builder/v1, at: 2026-09-03T10:22:00Z }
stale_after: 2026-12-02T00:00:00Z
sources:
  - id: chunk-doc
    resource: https://learn.microsoft.com/azure/search/vector-search-how-to-chunk-documents
    title: "Chunk large documents for RAG and vector search in Azure AI Search"
    last_modified: 2026-09-03T00:00:00Z
  - id: layout
    resource: https://learn.microsoft.com/azure/search/search-how-to-semantic-chunking
    title: "Chunk and vectorize with the Document Layout skill"
    last_modified: 2026-09-03T00:00:00Z
  - id: embeddings
    resource: https://learn.microsoft.com/azure/search/vector-search-how-to-generate-embeddings
    title: "Generate embeddings for search queries and documents"
    last_modified: 2026-09-03T00:00:00Z
verified:
  - { by: expert-builder/v1, at: 2026-09-03T10:22:00Z }
---

# Chunking and embeddings

Text chunking strategies play a key role in optimizing RAG responses and performance: because LLMs
work over multiple chunks, higher-quality, semantically coherent chunks improve the overall relevance
of the query.[^layout]

## Why chunk

Long documents must be split so that each chunk fits model context limits and so that retrieval
returns focused, on-topic passages rather than whole documents. Azure AI Search documents common
chunking techniques and trade-offs for RAG and vector search.[^chunk-doc]

## Chunking strategies

- **Structure-aware (Document Layout skill)** — chunks content by document structure, capturing
  headings and splitting the body on semantic coherence such as paragraphs and sentences. It calls the
  Document Intelligence **layout model**, which expresses structure as Markdown (headings + content).
  This preserves context and is well suited to complex documents.[^layout]
- **Fixed-size / overlapping (Text Split skill)** — split by token or character length, usually with
  overlap so context is not lost at boundaries; simple and predictable.[^chunk-doc]
- **Choosing** — match the strategy to content type and downstream model; the chunking guidance covers
  the common techniques and how to decide.[^chunk-doc]

## Embeddings

An embedding model converts each chunk (and each query) into a vector. The key rule is consistency:
use the **same embedding model** to generate document vectors and query vectors, since similarity is
only meaningful within one model's vector space.[^embeddings] Practical tips from the docs cover model
selection and integration into the pipeline; use these when wiring the embedding skill.[^embeddings]
When you use integrated vectorization, this embedding step runs inside the skillset — see
[Data ingestion and indexing](/ingestion/data-ingestion-and-indexing.md).

## Practical defaults

- Prefer structure-aware chunking for headed/technical documents; fixed-size with overlap for flat
  text.[^layout][^chunk-doc]
- Keep the embedding model identical across indexing and query (integrated vectorization enforces
  this).[^embeddings]
- Tune chunk size and overlap against retrieval quality using the evaluation loop in
  [Evaluation, monitoring, and relevance tuning](/evaluation/evaluation-monitoring-and-tuning.md).

[^chunk-doc]: "Chunk large documents for RAG and vector search in Azure AI Search." https://learn.microsoft.com/azure/search/vector-search-how-to-chunk-documents#common-chunking-techniques
[^layout]: "Chunk and vectorize with the Document Layout skill." https://learn.microsoft.com/azure/search/search-how-to-semantic-chunking
[^embeddings]: "Generate embeddings for search queries and documents." https://learn.microsoft.com/azure/search/vector-search-how-to-generate-embeddings#tips-for-embedding-model-integration
