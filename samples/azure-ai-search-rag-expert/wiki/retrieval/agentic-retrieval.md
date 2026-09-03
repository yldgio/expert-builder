---
type: Reference
title: Agentic retrieval
description: Knowledge bases, query planning, and multi-query retrieval.
tags: [retrieval]
generated: { by: expert-builder/v1, at: 2026-09-03T10:22:00Z }
stale_after: 2026-12-02T00:00:00Z
sources:
  - id: agentic-overview
    resource: https://learn.microsoft.com/azure/search/agentic-retrieval-overview
    title: "Agentic retrieval in Azure AI Search"
    last_modified: 2026-09-03T00:00:00Z
  - id: what-is
    resource: https://learn.microsoft.com/azure/search/search-what-is-azure-search
    title: "What is Azure AI Search?"
    last_modified: 2026-09-03T00:00:00Z
  - id: rag-overview
    resource: https://learn.microsoft.com/azure/search/retrieval-augmented-generation-overview
    title: "Retrieval-augmented generation (RAG) in Azure AI Search"
    last_modified: 2026-09-03T00:00:00Z
  - id: pipeline-howto
    resource: https://learn.microsoft.com/azure/search/agentic-retrieval-how-to-create-pipeline
    title: "Build an end-to-end agentic retrieval solution using Azure AI Search"
    last_modified: 2026-09-03T00:00:00Z
verified:
  - { by: expert-builder/v1, at: 2026-09-03T10:22:00Z }
---

# Agentic retrieval

Agentic retrieval is a **multi-query pipeline** designed for complex agent-to-agent workflows. Each
query targets a **knowledge base** that represents a complete domain of knowledge: the agent references
the knowledge base for *what* to ground on, while the knowledge base handles *how* to perform
grounding.[^what-is]

## The objects

- **Knowledge source** — points to searchable content, such as a search index or a remote SharePoint
  site.[^rag-overview]
- **Knowledge base** — the queryable object that unifies one or more knowledge sources, plus an
  optional LLM for query planning and answer synthesis, and parameters that govern retrieval
  behavior.[^what-is]
- **Retrieve action** — called from application code (for example, as a tool used by an AI agent) to
  run a query against the knowledge base.[^rag-overview]

## How a query flows

Each query undergoes **planning, decomposition into focused subqueries, parallel retrieval from
knowledge sources, semantic reranking**, and (optionally) answer synthesis.[^what-is] Because subqueries
run in **parallel rather than sequentially**, agentic retrieval targets fast responses even when it
queries multiple sources with complex processing.[^rag-overview] Reasoning effort is adjustable to
trade thoroughness against latency and cost.[^rag-overview]

## Output

The retrieve action returns **structured responses with grounding data, citations, and execution
metadata**, and can include an **LLM-formulated answer** when answer synthesis is enabled.[^rag-overview]

## When to use it

The docs recommend **starting with agentic retrieval for new RAG implementations**, and considering
migration for existing solutions to gain improved accuracy and context understanding.[^rag-overview] It
is the preferred choice when queries are complex, span multiple sources, or benefit from LLM-assisted
query planning; a single-index classic pattern (see
[Vector, hybrid, and semantic ranking](/retrieval/vector-hybrid-semantic-ranking.md)) can be simpler
and cheaper for straightforward cases. Follow the end-to-end pipeline tutorial to build and control the
costs of an agentic solution.[^pipeline-howto]

[^agentic-overview]: "Agentic retrieval in Azure AI Search." https://learn.microsoft.com/azure/search/agentic-retrieval-overview#why-use-agentic-retrieval
[^what-is]: "What is Azure AI Search?" https://learn.microsoft.com/azure/search/search-what-is-azure-search#what-is-agentic-retrieval
[^rag-overview]: "Retrieval-augmented generation (RAG) in Azure AI Search." https://learn.microsoft.com/azure/search/retrieval-augmented-generation-overview#how-azure-ai-search-meets-rag-challenges
[^pipeline-howto]: "Build an end-to-end agentic retrieval solution using Azure AI Search." https://learn.microsoft.com/azure/search/agentic-retrieval-how-to-create-pipeline#control-costs-and-limit-operations
