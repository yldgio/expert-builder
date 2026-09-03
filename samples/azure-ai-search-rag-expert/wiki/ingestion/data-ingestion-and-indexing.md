---
type: Guide
title: Data ingestion and indexing pipeline
description: Indexers, skillsets, and integrated vectorization that load and enrich content.
tags: [ingestion]
generated: { by: expert-builder/v1, at: 2026-09-03T10:22:00Z }
stale_after: 2026-12-02T00:00:00Z
sources:
  - id: iv-concept
    resource: https://learn.microsoft.com/azure/search/vector-search-integrated-vectorization
    title: "Integrated vector embedding in Azure AI Search"
    last_modified: 2026-09-03T00:00:00Z
  - id: iv-howto
    resource: https://learn.microsoft.com/azure/search/search-how-to-integrated-vectorization
    title: "Set up integrated vectorization in Azure AI Search using REST"
    last_modified: 2026-09-03T00:00:00Z
  - id: skillset
    resource: https://learn.microsoft.com/azure/search/cognitive-search-working-with-skillsets
    title: "Skillset concepts in Azure AI Search"
    last_modified: 2026-09-03T00:00:00Z
  - id: create-index
    resource: https://learn.microsoft.com/azure/search/vector-search-how-to-create-index
    title: "Create a vector index in Azure AI Search"
    last_modified: 2026-09-03T00:00:00Z
verified:
  - { by: expert-builder/v1, at: 2026-09-03T10:22:00Z }
---

# Data ingestion and indexing pipeline

RAG quality starts with the pipeline that gets content into a searchable index. Azure AI Search's
**integrated vectorization** performs data chunking and vector conversion during indexing (and can
also vectorize the query at search time), so you avoid running a separate embedding pipeline.[^iv-concept]

## Pipeline components

Integrated vectorization during indexing depends on three objects:[^iv-concept]

1. **An indexer** — retrieves raw data from a supported data source and drives the pipeline engine.[^iv-concept]
2. **A search index** — receives the chunked and vectorized content; it must define the vector field(s)
   and a `vectorSearch` configuration.[^create-index]
3. **A skillset** — configured for a chunking strategy (e.g. the **Text Split** skill, the **Document
   Layout** skill, or the **Azure Content Understanding** skill) plus an embedding step.[^iv-concept]

The skillset is where enrichment happens: skills execute in sequence to chunk, embed, and optionally
extract structure from each document before the results are projected into the index.[^skillset]

## Query-time vectorization

To vectorize queries automatically, you **add a vectorizer to the index**. The vectorizer uses the
same embedding model that indexed the data to decode a search string (or image) into a vector at query
time — so callers can send plain text and let the service embed it.[^iv-howto] Add the **Azure OpenAI
vectorizer** (or the preview **Azure Vision vectorizer**) after `vectorSearch.profiles` and reference
it from the profile.[^iv-howto]

## Design guidance

- Prefer integrated vectorization to keep indexing and query embedding consistent (same model on both
  sides).[^iv-concept]
- Choose the chunking skill by content type — see
  [Chunking and embeddings](/ingestion/chunking-and-embeddings.md).
- Define the vector field, dimensions, and algorithm (HNSW vs. exhaustive KNN) when you
  [create the index](/retrieval/vector-hybrid-semantic-ranking.md).[^create-index]

[^iv-concept]: "Integrated vector embedding in Azure AI Search." https://learn.microsoft.com/azure/search/vector-search-integrated-vectorization#using-integrated-vectorization-during-indexing
[^iv-howto]: "Set up integrated vectorization in Azure AI Search using REST." https://learn.microsoft.com/azure/search/search-how-to-integrated-vectorization#add-a-vectorizer-to-the-index
[^skillset]: "Skillset concepts in Azure AI Search." https://learn.microsoft.com/azure/search/cognitive-search-working-with-skillsets
[^create-index]: "Create a vector index in Azure AI Search." https://learn.microsoft.com/azure/search/vector-search-how-to-create-index#load-vector-data-for-indexing
