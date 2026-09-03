---
type: Reference
title: Security and data access
description: RBAC, private networking, document-level access, and security trimming.
tags: [security]
generated: { by: expert-builder/v1, at: 2026-09-03T10:22:00Z }
stale_after: 2026-12-02T00:00:00Z
sources:
  - id: doc-access
    resource: https://learn.microsoft.com/azure/search/search-document-level-access-overview
    title: "Document-level access control in Azure AI Search"
    last_modified: 2026-09-03T00:00:00Z
  - id: trimming
    resource: https://learn.microsoft.com/azure/search/search-security-trimming-for-azure-search
    title: "Security filters for trimming results in Azure AI Search"
    last_modified: 2026-09-03T00:00:00Z
  - id: best-practices
    resource: https://learn.microsoft.com/azure/search/search-security-best-practices
    title: "Secure an Azure AI Search service"
    last_modified: 2026-09-03T00:00:00Z
  - id: rbac-enforce
    resource: https://learn.microsoft.com/azure/search/search-query-access-control-rbac-enforcement
    title: "Query-time RBAC enforcement for document-level permissions"
    last_modified: 2026-09-03T00:00:00Z
  - id: faq
    resource: https://learn.microsoft.com/azure/search/search-faq-frequently-asked-questions
    title: "Azure AI Search Frequently Asked Questions"
    last_modified: 2026-09-03T00:00:00Z
verified:
  - { by: expert-builder/v1, at: 2026-09-03T10:22:00Z }
---

# Security and data access

Enterprise RAG must ensure that a user only sees answers grounded in content they are allowed to read.
Azure AI Search provides service-level controls plus **document-level access control** so retrieval is
security-trimmed per caller.

## Document-level access control

Azure AI Search supports enforcing per-document permissions **at query time**, so each search only
returns documents the caller is authorized to see.[^doc-access] A newer pattern provides native support
for **POSIX-like ACLs and RBAC scope permissions** (preview), and the docs help you **choose an
approach** based on where authorization data lives.[^doc-access] Document-level access control is the
recommended way to implement authorization for search results.[^best-practices]

## Security trimming (filter-based)

For solutions that cannot use built-in ACL support, Azure AI Search supports **security trimming**:
you store each document's allowed identities/groups in a field and add a filter that trims results to
the caller's identities.[^trimming] This is the classic pattern when authorization data must be modeled
in the index itself.[^trimming]

## Forwarding caller identity

When a knowledge source uses document-level permissions and results must be trimmed per caller,
retrieval **forwards the signed-in caller's Microsoft Entra identity** (separately from the application
credential that connects to the search service), and the service enforces permissions for that
identity at query time.[^rbac-enforce] This is how agentic retrieval stays permission-aware — see
[Agentic retrieval](/retrieval/agentic-retrieval.md).

## Service-level controls

- **Data residency:** applied-AI processing (vectorization, skills, model calls) runs in the Geo that
  hosts the subservices you choose (Foundry Tools, custom-skill hosts, or the Azure OpenAI / Foundry
  region), so you control where processing happens; data sent to external non-Azure services is
  processed by that service.[^faq]
- **General hardening:** follow the "Secure an Azure AI Search service" best-practices guide for
  network isolation (private endpoints), authentication (RBAC / keys), and encryption.[^best-practices]

## Guidance

Prefer **built-in document-level access control** for new solutions; fall back to **security trimming**
when authorization must be modeled in the index; and always **forward caller identity** for
permission-aware retrieval in agentic pipelines.[^doc-access][^trimming][^rbac-enforce]

[^doc-access]: "Document-level access control in Azure AI Search." https://learn.microsoft.com/azure/search/search-document-level-access-overview#choose-an-approach
[^trimming]: "Security filters for trimming results in Azure AI Search." https://learn.microsoft.com/azure/search/search-security-trimming-for-azure-search
[^best-practices]: "Secure an Azure AI Search service." https://learn.microsoft.com/azure/search/search-security-best-practices#implement-document-level-access-control
[^rbac-enforce]: "Query-time RBAC enforcement for document-level permissions." https://learn.microsoft.com/azure/search/search-query-access-control-rbac-enforcement
[^faq]: "Azure AI Search Frequently Asked Questions." https://learn.microsoft.com/azure/search/search-faq-frequently-asked-questions#does-azure-ai-search-process-customer-data-in-other-regions
