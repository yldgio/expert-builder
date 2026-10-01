---
type: Reference
title: GitHub plans and deployment eligibility
description: Plan, visibility, deployment, and permission boundaries for GitHub-first security decisions.
tags: [commercial, plans, eligibility]
generated: { by: refresh/v1, at: 2026-10-01T08:28:57Z }
stale_after: 2026-10-08T08:28:57Z
sources:
  - id: S01
    resource: https://github.com/pricing
    title: GitHub pricing
  - id: S07
    resource: https://docs.github.com/en/get-started/learning-about-github/githubs-plans
    title: GitHub plans
  - id: S02
    resource: https://docs.github.com/en/get-started/learning-about-github/about-github-advanced-security
    title: About GitHub Advanced Security
  - id: S06
    resource: https://docs.github.com/en/billing/concepts/product-billing/github-advanced-security
    title: GitHub Advanced Security license billing
  - id: S11
    resource: https://github.com/github/docs/blob/main/data/reusables/gated-features/code-quality-availability.md
    title: Code Quality plan availability
  - id: S12
    resource: https://github.com/github/docs/blob/main/data/features/code-quality.yml
    title: Code Quality deployment metadata
  - id: S28
    resource: https://docs.github.com/en/enterprise-server@3.20/code-security/concepts/code-scanning/codeql/codeql-code-scanning
    title: Code scanning with CodeQL on GHES 3.20
  - id: S16
    resource: https://docs.github.com/en/code-security/how-tos/find-and-fix-code-vulnerabilities/integrate-with-existing-tools/upload-sarif-file
    title: Uploading SARIF to GitHub
  - id: S22
    resource: https://docs.github.com/en/code-security/concepts/supply-chain-security/dependency-review
    title: Dependency review
  - id: S37
    resource: https://docs.github.com/en/rest/dependency-graph/sboms?apiVersion=2022-11-28
    title: SBOM REST API
verified:
  - { by: refresh/v1, at: 2026-10-01T08:28:57Z }
---

# GitHub plans and deployment eligibility

**Inputs:** Deployment domain, organization plan, repository visibility, requested feature, and target Enterprise Server version. Re-check official commercial sources before answering eligibility or pricing questions.

## GitHub.com plans

| Plan | Published platform price snapshot | Relevant boundary |
| --- | --- | --- |
| Free | USD 0 per user/month | Public and private repositories are available; private collaboration features are limited. This is not entitlement to every security product. [^S01][^S07] |
| Team | USD 4 per user/month | Adds private-repository collaboration controls. Organizations can purchase Code Security, Secret Protection, and Code Quality separately. [^S01][^S07][^S02][^S11] |
| Enterprise | Starting at USD 21 per user/month | Identify Cloud versus Server and the applicable agreement. Enterprise Cloud adds enterprise identity, policy, and organization-management capabilities; security products remain separate purchases. [^S01][^S07][^S02] |

Dependency graph and documented Dependabot functions do not require a Code Security purchase. GitHub.com public repositories have documented free code-scanning and secret-scanning treatment, but the exact product capability still needs an eligibility check. [^S06][^S07]

## Deployment differences

| Context | Verified boundary |
| --- | --- |
| GitHub.com public repositories | A documented subset of security capabilities is free. Do not infer that every premium feature or standalone product shares that exemption. [^S02][^S06] |
| GHE.com and Enterprise Server | Advanced Security licensing applies to all repositories, including repositories labelled public. Do not transfer GitHub.com's public-repository exemption. [^S06] |
| Enterprise Server 3.20 | A site administrator must enable code scanning. This version's documentation identifies CodeQL CLI 2.23.9 as the default action version and recommended external-CI version. It is not a universal or latest-release claim. [^S28] |
| Enterprise Server 3.13 onward | The billing documentation describes GHAS metering through GitHub Connect and a linked Enterprise Cloud account. Validate the selected feature against the actual appliance version. [^S06] |
| GitHub Code Quality | Availability is documented for Team and Enterprise Cloud. The retrieved deployment metadata excludes Enterprise Server. [^S11][^S12] |

## Entitlement versus permission

Private/internal third-party SARIF ingestion requires Code Security enablement. The documented upload workflow uses `security-events: write`; its private-repository example also uses `actions: read` and `contents: read`. These permissions do not replace the product entitlement. [^S16]

SBOM export requires at least repository read access. That prerequisite does not enable unrelated security products. [^S37]

## Source inconsistency

The general Advanced Security availability table marks public dependency review as unavailable without Code Security. The billing and dependency-review documentation explicitly describe public-repository availability. Both statements were retrieved; use the feature-specific sources and confirm eligibility before a purchase or enforcement decision. [^S02][^S06][^S22]

## Recommendation

Produce an eligibility record with deployment, visibility, platform plan, product SKU, tool license, version, and required permissions. Keep the commercial decision separate from the workflow-permission decision. For Enterprise Server, do not generalize the 3.20 snapshot to another release. [^S06][^S07][^S16][^S28]

## Related concepts

* [Security products](/commercial/security-products.md)
* [Actions costs](/commercial/actions-cost-model.md)
* [Code scanning](/sast/code-scanning.md)
* [Code quality](/quality/quality-gates.md)

[^S01]: [GitHub pricing](https://github.com/pricing).
[^S07]: [GitHub plans](https://docs.github.com/en/get-started/learning-about-github/githubs-plans).
[^S02]: [About GitHub Advanced Security](https://docs.github.com/en/get-started/learning-about-github/about-github-advanced-security).
[^S06]: [GitHub Advanced Security license billing](https://docs.github.com/en/billing/concepts/product-billing/github-advanced-security).
[^S11]: [Code Quality plan availability](https://github.com/github/docs/blob/main/data/reusables/gated-features/code-quality-availability.md).
[^S12]: [Code Quality deployment metadata](https://github.com/github/docs/blob/main/data/features/code-quality.yml).
[^S28]: [Code scanning with CodeQL on GHES 3.20](https://docs.github.com/en/enterprise-server@3.20/code-security/concepts/code-scanning/codeql/codeql-code-scanning).
[^S16]: [Uploading SARIF to GitHub](https://docs.github.com/en/code-security/how-tos/find-and-fix-code-vulnerabilities/integrate-with-existing-tools/upload-sarif-file).
[^S22]: [Dependency review](https://docs.github.com/en/code-security/concepts/supply-chain-security/dependency-review).
[^S37]: [SBOM REST API](https://docs.github.com/en/rest/dependency-graph/sboms?apiVersion=2022-11-28).
