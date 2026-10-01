---
type: Guide
title: SCA and SBOM
description: Dependency inventory, advisory matching, PR policy, SPDX export, and Syft format boundaries.
tags: [supply-chain, sca, sbom]
generated: { by: refresh/v1, at: 2026-10-01T08:28:57Z }
stale_after: 2026-10-08T08:28:57Z
sources:
  - id: S38
    resource: https://docs.github.com/en/code-security/concepts/supply-chain-security/supply-chain-security
    title: Supply chain security
  - id: S20
    resource: https://docs.github.com/en/code-security/concepts/supply-chain-security/dependabot-alerts
    title: Dependabot alerts
  - id: S22
    resource: https://docs.github.com/en/code-security/concepts/supply-chain-security/dependency-review
    title: Dependency review
  - id: S21
    resource: https://docs.github.com/en/code-security/how-tos/secure-your-supply-chain/establish-provenance-and-integrity/export-dependencies-as-sbom
    title: Exporting a repository SBOM
  - id: S37
    resource: https://docs.github.com/en/rest/dependency-graph/sboms?apiVersion=2022-11-28
    title: SBOM REST API
  - id: S23
    resource: https://github.com/anchore/syft/blob/main/LICENSE
    title: Syft license
  - id: S31
    resource: https://github.com/anchore/syft/blob/main/syft/format/encoders.go
    title: Syft encoder implementation
verified:
  - { by: refresh/v1, at: 2026-10-01T08:28:57Z }
---

# SCA and SBOM

**Inputs:** Dependency ecosystems, manifests/lockfiles, build-submitted inventory, repository visibility and entitlement, required SBOM format/version, and the receiving system.

## Native functions

| Function | Documented behavior | Limitation or prerequisite |
| --- | --- | --- |
| Dependency graph | Uses supported manifests/lockfiles and submitted build-time dependencies | Missing inventory limits subsequent analysis. [^S38] |
| Dependabot alerts | Matches default-branch dependencies against GitHub-reviewed advisories | Archived repositories are not scanned; the advisory coverage does not represent every security issue. [^S20] |
| Security updates | Respond to alerts with an update addressing the vulnerability | Depends on the supported ecosystem and available remediation. [^S38] |
| Version updates | Run on a configured schedule toward a version matching the configuration | Configuration is required; version updates do not rely on the dependency graph. [^S38] |
| Dependency review | Assesses dependencies introduced or changed in a pull request | Private use requires eligible organization/product enablement; a required check is needed to block merging. [^S22][^S38] |

The dependency-review action can enforce vulnerability-severity and license allow/deny policies. Build-submitted dependency data must be available before review, or the documented retry behavior must handle missing snapshots. [^S22]

## Native SBOM and API transition

GitHub exports dependency inventory as SPDX JSON. Its export article links SPDX 2.3; this seed did not retrieve a generated payload and does not guarantee a fixed output version for every deployment. No native CycloneDX export was established by the retrieved export/API sources. [^S21][^S37]

The synchronous `GET /repos/{owner}/{repo}/dependency-graph/sbom` operation is documented to become inaccessible after 2026-11-13. The replacement requests generation and then retrieves the report. [^S37]

The asynchronous fetch can return HTTP 202 while processing and HTTP 302 when ready. Reports may be retained for up to one week; the temporary download URL has its own expiry. The retrieved guidance displayed API version 2026-03-10 despite the requested URL's older query parameter. Verify the configured API version and documented operation before implementing a consumer. [^S37]

## Syft as a format option

Syft's source-license header identifies Apache 2.0. GitHub's export documentation identifies Anchore's Syft-based SBOM Action as an integration. This seed reviewed the license header, not a complete legal obligation assessment. [^S23][^S21]

The encoder implementation contains separate SPDX JSON/tag-value and CycloneDX JSON/XML families. That branch-level implementation does not establish a selected released binary's default schema version. GitHub's integration table mentions SPDX 2.2 compatibility; do not treat that table as an exclusive current Syft version matrix. [^S31][^S21]

**Recommendation:** Use native export where the consumer accepts the tested SPDX payload. Evaluate a released Syft distribution where another supported format, including CycloneDX, is required. Validate the actual schema and receiving-system behavior before selecting the integration. [^S21][^S31][^S37]

## Inventory versus assessment

An SBOM supplies dependency metadata. Vulnerability evaluation and license-policy review require additional matching, rules, and review; inventory generation alone does not establish vulnerability coverage or legal clearance. [^S21][^S22][^S38]

**Recommendation:** Measure inventory coverage by ecosystem and build path, confirm review ordering, test policy checks, and retain the release-associated SBOM and schema-validation result. An external SCA product comparison is an unseeded follow-up; Syft is the selected SBOM generator, not a verified replacement vulnerability-analysis service. [^S20][^S22][^S31]

## Related concepts

* [Commercial eligibility](/commercial/github-plans.md)
* [Required checks and workflow controls](/automation/workflow-security.md)
* [Selection baseline](/governance/baseline-and-selection.md)

[^S38]: [Supply chain security](https://docs.github.com/en/code-security/concepts/supply-chain-security/supply-chain-security).
[^S20]: [Dependabot alerts](https://docs.github.com/en/code-security/concepts/supply-chain-security/dependabot-alerts).
[^S22]: [Dependency review](https://docs.github.com/en/code-security/concepts/supply-chain-security/dependency-review).
[^S21]: [Exporting a repository SBOM](https://docs.github.com/en/code-security/how-tos/secure-your-supply-chain/establish-provenance-and-integrity/export-dependencies-as-sbom).
[^S37]: [SBOM REST API](https://docs.github.com/en/rest/dependency-graph/sboms?apiVersion=2022-11-28).
[^S23]: [Syft license](https://github.com/anchore/syft/blob/main/LICENSE).
[^S31]: [Syft encoder implementation](https://github.com/anchore/syft/blob/main/syft/format/encoders.go).
