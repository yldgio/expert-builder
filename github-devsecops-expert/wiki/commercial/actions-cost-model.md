---
type: Reference
title: GitHub Actions cost model
description: Included allowances, runner and storage units, and effective-date caveats for Actions estimates.
tags: [commercial, actions, pricing]
generated: { by: refresh/v1, at: 2026-10-01T08:28:57Z }
stale_after: 2026-10-08T08:28:57Z
sources:
  - id: S03
    resource: https://docs.github.com/en/billing/concepts/product-billing/github-actions
    title: GitHub Actions billing
  - id: S04
    resource: https://docs.github.com/en/billing/reference/actions-runner-pricing
    title: Actions runner pricing
  - id: S05
    resource: https://github.blog/changelog/2025-12-16-coming-soon-simpler-pricing-and-a-better-experience-for-github-actions/
    title: Actions pricing announcement and postponement update
    last_modified: 2025-12-17T21:50:05Z
  - id: S10
    resource: https://docs.github.com/en/billing/concepts/product-billing/github-code-quality
    title: GitHub Code Quality billing
verified:
  - { by: refresh/v1, at: 2026-10-01T08:28:57Z }
---

# GitHub Actions cost model

**Inputs:** Account plan, repository visibility, runner SKU and architecture, rounded job durations, applicable allowances, retention, GB-hours, and billing month. Re-check rates and effective dates before producing an estimate.

## Included GitHub.com allowances

| Plan | Standard minutes/month | Artifact storage | Cache storage | Custom-image storage |
| --- | ---: | ---: | ---: | ---: |
| Free, personal | 2,000 | 500 MB | 10 GB/repository | Not applicable [^S03] |
| Free, organizations | 2,000 | 500 MB | 10 GB/repository | Not applicable [^S03] |
| Team | 3,000 | 2 GB | 10 GB/repository | 75 GB [^S03] |
| Enterprise Cloud | 50,000 | 50 GB | 10 GB/repository | 150 GB [^S03] |

These are account-plan allowances, not per-user multipliers. Artifacts share their storage allowance with GitHub Packages; cache and custom-image storage are separate. All rows are sourced from the billing table. [^S03]

## Selected runner rates

| Runner SKU | Published USD/minute |
| --- | ---: |
| Linux slim, 1-core x64 | 0.002 [^S04] |
| Linux standard, 2-core x64 | 0.006 [^S04] |
| Linux standard, 2-core arm64 | 0.005 [^S04] |
| Windows standard, 2-core x64 or arm64 | 0.010 [^S04] |
| macOS standard, 3-core or 4-core | 0.062 [^S04] |
| Larger Linux, 4-core x64 | 0.012 [^S04] |
| Larger Linux, 8-core x64 | 0.022 [^S04] |
| Larger macOS, 12-core | 0.077 [^S04] |

The table is a selected snapshot, not the full catalog. GitHub rounds each job upward to a whole minute. Larger runners require Team or Enterprise Cloud, do not consume included minutes, and remain chargeable for public repositories. [^S04]

The retrieved documentation states that standard hosted runners are free for public repositories and that self-hosted runner usage is free. The latter does not quantify the customer's infrastructure and operating costs. [^S03]

## Storage and other consumption

| Category | Published USD/GB-month |
| --- | ---: |
| Shared artifact/Packages storage | 0.25 [^S03] |
| Cache storage | 0.07 [^S03] |
| Custom-image storage | 0.07 [^S03] |

Storage accrues as GB-hours using binary GB, equivalent to GiB. Cache overage uses the hourly peak above each repository's included 10 GB where the configured limit permits excess. Deleting artifacts stops future accumulation but does not remove accrued usage. [^S03]

Deterministic Code Quality analysis consumes Actions minutes unless self-hosted runners are used. AI detection and autofix have separate AI-credit costs; they are not represented by a runner-minute rate. [^S10]

## Effective-date reconciliation

- Hosted-runner price reductions were announced for 2026-01-01 and retained by the announcement's update. Use the runner reference for the applicable rate, not a pre-change table. [^S04][^S05]
- A USD 0.002/minute self-hosted cloud-platform charge was initially announced for 2026-03-01, then explicitly postponed. The retrieved billing documentation still states that self-hosted usage is free; no replacement effective date was established. [^S03][^S05]
- Published hosted rates include the platform component. Do not add a second USD 0.002/minute charge. The announcement's GHES FAQ states that the announced change does not affect GHES pricing. [^S05]

## Calculation and output

**Recommendation:** Obtain provider-billable units after allowances and runner eligibility have been applied. Mixed-SKU allowance allocation must follow GitHub's billing rules; do not subtract a raw allowance independently from every SKU. [^S03][^S04]

```text
Hosted compute = sum(billable rounded minutes by SKU * verified SKU rate)

Storage = billable GB-hours / hours in the billing month
          * verified GB-month rate
```

GitHub's documentation example prices 3,000 additional Linux minutes and 2,000 additional Windows minutes at USD 38, using USD 0.006 and USD 0.010 respectively. This is a documented example, not a forecast. [^S03][^S04]

The estimate should list compute, shared storage, cache, custom images, AI consumption, customer-managed infrastructure, and unknown contractual adjustments separately. [^S03][^S10]

## Related concepts

* [Security product units](/commercial/security-products.md)
* [Workflow controls](/automation/workflow-security.md)
* [Code Quality costs](/quality/quality-gates.md)

[^S03]: [GitHub Actions billing](https://docs.github.com/en/billing/concepts/product-billing/github-actions).
[^S04]: [Actions runner pricing](https://docs.github.com/en/billing/reference/actions-runner-pricing).
[^S05]: [Actions pricing announcement and update](https://github.blog/changelog/2025-12-16-coming-soon-simpler-pricing-and-a-better-experience-for-github-actions/).
[^S10]: [GitHub Code Quality billing](https://docs.github.com/en/billing/concepts/product-billing/github-code-quality).
