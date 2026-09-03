---
okf_version: "0.2"
---

# Azure AI Search RAG Expert — Wiki

Progressive-disclosure catalog. `Reference` concepts are authoritative.

## Foundations

* [Glossary](/foundations/glossary.md) - Core RAG and Azure AI Search vocabulary.
* [RAG reference architecture on Azure AI Search](/foundations/rag-reference-architecture.md) - End-to-end classic and agentic RAG patterns and when to use each.

## Ingestion

* [Data ingestion and indexing pipeline](/ingestion/data-ingestion-and-indexing.md) - Indexers, skillsets, and integrated vectorization that load and enrich content.
* [Chunking and embeddings](/ingestion/chunking-and-embeddings.md) - Chunking strategies and embedding-model choices for RAG quality.

## Retrieval

* [Vector, hybrid, and semantic ranking](/retrieval/vector-hybrid-semantic-ranking.md) - Query types and the two-stage relevance model.
* [Agentic retrieval](/retrieval/agentic-retrieval.md) - Knowledge bases, query planning, and multi-query retrieval.

## Security

* [Security and data access](/security/security-and-data-access.md) - RBAC, private networking, document-level access, and security trimming.

## Evaluation

* [Evaluation, monitoring, and relevance tuning](/evaluation/evaluation-monitoring-and-tuning.md) - RAG evaluators, observability, and tuning levers.

## Not yet written

<!-- Recorded as Gaps in brief.md; a future build or refresh fills these. -->
* Cost & performance optimization — not yet written.
* Orchestration frameworks (Foundry, prompt flow, Semantic Kernel, LangChain) — not yet written.
* Multimodal / image RAG — not yet written.
* Query rewriting & scoring profiles — not yet written.
* Comparison with non-Azure vector stores — not yet written.
