---
type: Reference
title: Security-product licensing and pricing
description: Published security and quality prices, counting rules, CodeQL terms, and commercial unknowns.
tags: [commercial, licensing, pricing]
generated: { by: refresh/v1, at: 2026-10-01T08:28:57Z }
stale_after: 2026-10-08T08:28:57Z
sources:
  - id: S02
    resource: https://docs.github.com/en/get-started/learning-about-github/about-github-advanced-security
    title: About GitHub Advanced Security
  - id: S14
    resource: https://github.com/security/advanced-security
    title: GitHub Advanced Security product pricing
  - id: S06
    resource: https://docs.github.com/en/billing/concepts/product-billing/github-advanced-security
    title: GitHub Advanced Security license billing
  - id: S08
    resource: https://github.com/github/codeql-cli-binaries/blob/main/LICENSE.md
    title: GitHub CodeQL Terms and Conditions
  - id: S10
    resource: https://docs.github.com/en/billing/concepts/product-billing/github-code-quality
    title: GitHub Code Quality billing
  - id: S30
    resource: https://github.blog/changelog/2026-07-20-github-code-quality-is-now-generally-available/
    title: GitHub Code Quality general availability
    last_modified: 2026-08-04T17:45:51Z
verified:
  - { by: refresh/v1, at: 2026-10-01T08:28:57Z }
---

# Security-product licensing and pricing

**Inputs:** Deployment, visibility, eligible platform plan, selected products, qualifying active-committer counts per product, billing route, currency, and agreement. The values below are source snapshots, not a current customer quote.

## Published products

| Product | Published base unit | Documented scope |
| --- | --- | --- |
| GitHub Code Security | USD 30 per active committer/month | Includes code scanning, CodeQL CLI, dependency review, and documented premium dependency/security capabilities. [^S02][^S14] |
| GitHub Secret Protection | USD 19 per active committer/month | Separate secret-detection and prevention product. [^S02][^S14] |
| GitHub Code Quality | USD 10 per active committer/month | Standalone product, not bundled into Advanced Security. GA began on 2026-07-20 with billing enabled at GA. [^S10][^S30] |

Advanced Security remains an umbrella and a documented legacy contractual/license name. The documentation identifies separate Code Security and Secret Protection SKUs and also describes volume/subscription Advanced Security purchases. No current bundled price was established. [^S02][^S06]

## Counting and billing

- An active committer has a qualifying commit pushed to an enabled repository in the preceding 90 days, regardless of the commit's original authorship date. Counting is deduplicated within the applicable organization or enterprise scope. [^S06]
- The documented counting population includes members, enterprise-managed users, external collaborators, and pending invitees with qualifying platform licenses. GitHub App bots are ignored; do not automatically exempt ordinary machine accounts. Repository count is not the billing unit. [^S06]
- Metered billing uses consumed active-committer licenses. Volume/subscription purchases specify a quantity and period, typically at least a year, and are documented for Enterprise plans. Team purchase eligibility is established, but the retrieved metered-billing paragraph's deployment wording does not fully reconcile Team's billing route. [^S02][^S06]
- An Advanced Security hard budget prevents additional product enablement. It does not stop billing for active committers in already-enabled repositories; additional qualifying committers can increase charges. [^S06]
- GitHub Code Quality also documents a 90-day counting window and deduplication. Its additional usage charges include deterministic Actions analysis and AI consumption at USD 0.01 per AI credit. [^S10]

## Cost model

**Recommendation:** Re-check the rates and derive each SKU's qualifying population before calculating. Do not substitute employee headcount or repository count for an active-committer count. [^S06][^S10]

```text
Security and quality base estimate =
  Code Security qualifying count * verified Code Security unit price
  + Secret Protection qualifying count * verified Secret Protection unit price
  + Code Quality qualifying count * verified Code Quality unit price

Additional estimate components =
  platform subscription + billable Actions compute/storage + AI consumption
```

The selected products can have different enabled-repository populations. A shared headcount does not establish identical qualifying counts for every SKU. Apply each product's documented enabled-repository counting scope. [^S06][^S10]

## CodeQL terms

The CLI terms permit specified academic, demonstration, query-testing, and OSI-licensed Open Source Codebase uses. Automated database generation under the free terms is limited to qualifying code hosted and maintained on GitHub.com. Public visibility alone does not establish an OSI license. [^S08]

The terms restrict other private/non-open-source analysis and automated CI/CD database generation, with specified restrictions waived under a paid GitHub Advanced Security customer license. Code Security documentation lists the CLI, while the binary terms retain the Advanced Security name. Validate the applicable agreement and intended external-CI/private-code use; do not classify the CLI as unrestricted open-source software. [^S02][^S08]

## Unknowns and checks

- Reconcile Team's billing route and the relevant agreement before a binding procurement decision. [^S02][^S06]
- Do not inherit Code Security's public-repository treatment for Code Quality; its free-public exemption was not established by the retrieved billing and GA sources. [^S06][^S10][^S30]
- Contractual discounts, taxes, regional currency, and negotiated terms are not established by these public list units. This Pack does not retrieve private agreements.

## Related concepts

* [Platform plans](/commercial/github-plans.md)
* [Actions costs](/commercial/actions-cost-model.md)
* [Code Quality and Sonar](/quality/quality-gates.md)

[^S02]: [About GitHub Advanced Security](https://docs.github.com/en/get-started/learning-about-github/about-github-advanced-security).
[^S14]: [GitHub Advanced Security](https://github.com/security/advanced-security).
[^S06]: [GitHub Advanced Security license billing](https://docs.github.com/en/billing/concepts/product-billing/github-advanced-security).
[^S08]: [GitHub CodeQL Terms and Conditions](https://github.com/github/codeql-cli-binaries/blob/main/LICENSE.md).
[^S10]: [GitHub Code Quality billing](https://docs.github.com/en/billing/concepts/product-billing/github-code-quality).
[^S30]: [GitHub Code Quality GA](https://github.blog/changelog/2026-07-20-github-code-quality-is-now-generally-available/).
