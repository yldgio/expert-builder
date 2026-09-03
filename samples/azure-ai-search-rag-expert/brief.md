# Domain Brief — Azure AI Search RAG Expert

> Single source of truth for this Expert's scope. `refresh` may update the descriptive parts, but the
> boundary, audience, and success criteria below are human-decided and are only changed with your
> review.

## Domain boundary

**In scope:** End-to-end Retrieval-Augmented Generation (RAG) where **Azure AI Search is the retrieval
layer**. Covers: data ingestion and indexing (indexers, skillsets, integrated vectorization), chunking
and embeddings, index schema design, retrieval (vector, hybrid, and semantic ranking), agentic
retrieval (knowledge bases / knowledge sources), integration with Azure OpenAI and Azure AI Foundry
models, orchestration options (Foundry, prompt flow, Semantic Kernel, LangChain), security (RBAC,
private endpoints, document-level access and security trimming), evaluation, monitoring, and
cost/performance tuning.

**Out of scope:** Non-Azure vector stores (Pinecone, Weaviate, Elasticsearch, etc.) except brief
comparison; LLM fine-tuning or model training; non-RAG enterprise/site search; other clouds
(AWS/GCP). Questions outside this boundary are flagged, not answered as fact.

## Audience & tasks

**Audience:** Azure solution architects and developers building enterprise RAG solutions.

**Tasks the Expert must handle:**
- Recommend a defensible end-to-end RAG reference architecture on Azure AI Search.
- Design an index schema (fields, vector fields, analyzers, semantic configuration).
- Choose a chunking strategy and embedding model, and configure integrated vectorization.
- Configure and tune retrieval: vector, hybrid, semantic ranking, and agentic retrieval.
- Design security and data-access controls (RBAC, private networking, document-level trimming).
- Set up evaluation, relevance tuning, and monitoring.
- Troubleshoot relevance, latency, and cost issues.

## Design problems

- **Source availability:** Authoritative sources are public (Microsoft Learn, Azure Architecture
  Center, GitHub sample repos). No paywalled or proprietary material required.
- **Volatility:** High — Azure AI Search RAG features ship rapidly (integrated vectorization, semantic
  ranker, agentic retrieval, document-level access all recent, several in preview). → `stale_after`
  cadence: **quarterly (~90 days)**.
- **Tooling / MCP:** Template `.mcp.json` wires the **Microsoft Docs MCP** server for live grounding in
  Microsoft Learn. Azure MCP tooling (e.g. `search`, `foundry`) may also be present in the host
  harness. `refresh` uses these plus web fetch.
- **Sensitive material:** None. No secrets are stored in the Pack; MCP credentials (if any) stay as
  placeholders.

## Knowledge sources

- Microsoft Learn — **Retrieval-augmented generation (RAG) in Azure AI Search** overview and the AI
  Search docs (vector, hybrid, semantic, integrated vectorization, agentic retrieval, security).
- Microsoft Learn — **Azure OpenAI** and **Azure AI Foundry** RAG/evaluation docs.
- **Azure Architecture Center** — "Design and develop a RAG solution" guidance.
- **`Azure-Samples/azure-search-openai-demo`** — reference implementation on GitHub.

## Success criteria

The Expert can propose a defensible end-to-end Azure AI Search RAG architecture, justify chunking /
embedding / hybrid-semantic / agentic choices, and answer security and evaluation questions — with
**every claim cited to Microsoft Learn or a named repo**. When a question falls outside the boundary
or the Wiki does not cover it, it says so rather than guessing.

## Gaps

<!-- Un-seeded priority topics and un-filled skill/knowledge gaps, each with its intended source
     pointers. `refresh` consumes this list to create concepts on later runs. -->
- **Cost & performance optimization** (service tiers, replicas/partitions, vector storage/quantization,
  latency) — sources: `learn.microsoft.com/azure/search/search-sku-tier`,
  `learn.microsoft.com/azure/search/vector-search-how-to-quantization`,
  `learn.microsoft.com/azure/search/search-performance-tips`.
- **Orchestration frameworks** (Azure AI Foundry, prompt flow, Semantic Kernel, LangChain integration
  patterns) — sources: `learn.microsoft.com/azure/ai-foundry/concepts/retrieval-augmented-generation`,
  `learn.microsoft.com/semantic-kernel`.
- **Multimodal / image RAG** (Azure Vision vectorizer, Content Understanding skill) — sources:
  `learn.microsoft.com/azure/search/search-how-to-semantic-chunking-content-understanding`,
  `learn.microsoft.com/azure/search/vector-search-vectorizer-ai-services-vision`.
- **Query rewriting & scoring profiles** — sources:
  `learn.microsoft.com/azure/search/search-get-started-rag`,
  `learn.microsoft.com/azure/search/index-add-scoring-profiles`.
- **Comparison with non-Azure vector stores** (scope-boundary comparison only) — sources: vendor docs.
- **Domain skill:** no bundled domain skill vendored; none matched in the catalog. If a curated
  "Azure AI Search" authoring skill appears, vendor it with provenance.
