---
type: Guide
title: Evaluation, monitoring, and relevance tuning
description: RAG evaluators, observability, and tuning levers.
tags: [evaluation]
generated: { by: expert-builder/v1, at: 2026-09-03T10:22:00Z }
stale_after: 2026-12-02T00:00:00Z
sources:
  - id: rag-evaluators
    resource: https://learn.microsoft.com/azure/foundry/concepts/evaluation-evaluators/rag-evaluators
    title: "Retrieval-Augmented Generation (RAG) evaluators"
    last_modified: 2026-09-03T00:00:00Z
  - id: observability
    resource: https://learn.microsoft.com/azure/ai-foundry/concepts/observability
    title: "Observability in generative AI"
    last_modified: 2026-09-03T00:00:00Z
  - id: arch-guide
    resource: https://learn.microsoft.com/azure/architecture/ai-ml/guide/rag/rag-solution-design-and-evaluation-guide
    title: "Design and develop a RAG solution (Azure Architecture Center)"
    last_modified: 2026-09-03T00:00:00Z
  - id: relevance
    resource: https://learn.microsoft.com/azure/search/search-relevance-overview
    title: "Relevance in Azure AI Search"
    last_modified: 2026-09-03T00:00:00Z
verified:
  - { by: expert-builder/v1, at: 2026-09-03T10:22:00Z }
---

# Evaluation, monitoring, and relevance tuning

A RAG system tries to generate the most relevant answer consistent with grounding documents in
response to a user's query; a query triggers a retrieval step that provides grounding context for the
model.[^rag-evaluators] Evaluating both halves — retrieval and generation — is how you know the system
is "good enough" and where to tune.

## Evaluate retrieval and generation separately

Azure AI Foundry provides **RAG evaluators** that separate the two concerns:[^rag-evaluators]

- **Document Retrieval** — a process evaluation that measures search quality (Fidelity, NDCG, XDCG, Max
  Relevance, Holes) by comparing retrieved documents against **ground-truth query-relevance labels**.
  Use it when retrieval quality is a bottleneck and you have labels for precise, debuggable
  metrics.[^rag-evaluators]
- **Retrieval** and generation-side evaluators (e.g. groundedness/relevance) assess whether retrieved
  context and the final answer are on-target.[^rag-evaluators]

Evaluate retrieval first: if the right chunks are not retrieved, no prompt fixes the answer.

## Observability across the lifecycle

Azure AI Foundry frames evaluation across the **GenAIOps lifecycle** and provides evaluators and
observability tooling to run them, so you can measure quality in development and monitor it in
production.[^observability] Use these to track regressions after index, chunking, or prompt
changes.[^observability]

## Design and evaluation guidance

The Azure Architecture Center **"Design and develop a RAG solution"** guide pairs design decisions with
an evaluation methodology end to end, and is the authoritative reference for structuring a RAG
evaluation program.[^arch-guide]

## Relevance tuning levers

Once you can measure quality, tune it. Relevance options vary by query type:[^relevance]

- Scoring profiles (weighted fields, freshness, proximity) and the semantic ranker for text/hybrid.
- Vector-field weighting within a hybrid query.
- HNSW vs. exhaustive KNN for pure vector queries.

Change one lever at a time and re-run the evaluators to confirm the change helped. See
[Vector, hybrid, and semantic ranking](/retrieval/vector-hybrid-semantic-ranking.md) for the levers and
[Chunking and embeddings](/ingestion/chunking-and-embeddings.md) for upstream quality.

[^rag-evaluators]: "Retrieval-Augmented Generation (RAG) evaluators." Azure AI Foundry. https://learn.microsoft.com/azure/foundry/concepts/evaluation-evaluators/rag-evaluators
[^observability]: "Observability in generative AI." Azure AI Foundry. https://learn.microsoft.com/azure/ai-foundry/concepts/observability#what-are-evaluators
[^arch-guide]: "Design and develop a RAG solution." Azure Architecture Center. https://learn.microsoft.com/azure/architecture/ai-ml/guide/rag/rag-solution-design-and-evaluation-guide
[^relevance]: "Relevance in Azure AI Search." https://learn.microsoft.com/azure/search/search-relevance-overview#relevance-tuning
