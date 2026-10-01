---
type: Glossary
title: DevSecOps terminology
description: Working definitions separating analysis, inventory, enforcement, licensing, and provenance.
tags: [foundations, devsecops, terminology]
generated: { by: refresh/v1, at: 2026-10-01T08:28:57Z }
stale_after: 2026-12-30T08:28:57Z
sources:
  - id: S14
    resource: https://github.com/security/advanced-security
    title: GitHub Advanced Security
  - id: S34
    resource: https://csrc.nist.gov/pubs/sp/800/218/final
    title: NIST SP 800-218 - SSDF Version 1.1
  - id: S15
    resource: https://docs.github.com/en/code-security/concepts/code-scanning/codeql/codeql-code-scanning
    title: Code scanning with CodeQL
  - id: S24
    resource: https://www.zaproxy.org/docs/docker/
    title: ZAP Docker documentation
  - id: S22
    resource: https://docs.github.com/en/code-security/concepts/supply-chain-security/dependency-review
    title: Dependency review
  - id: S21
    resource: https://docs.github.com/en/code-security/how-tos/secure-your-supply-chain/establish-provenance-and-integrity/export-dependencies-as-sbom
    title: Exporting a repository SBOM
  - id: S09
    resource: https://docs.github.com/en/code-security/concepts/code-quality/code-quality
    title: GitHub Code Quality
  - id: S33
    resource: https://docs.sonarsource.com/sonarqube-server/quality-standards-administration/managing-quality-gates/introduction-to-quality-gates
    title: SonarQube Server quality gates
  - id: S40
    resource: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets
    title: Available rules for rulesets
  - id: S16
    resource: https://docs.github.com/en/code-security/how-tos/find-and-fix-code-vulnerabilities/integrate-with-existing-tools/upload-sarif-file
    title: Uploading SARIF to GitHub
  - id: S38
    resource: https://docs.github.com/en/code-security/concepts/supply-chain-security/supply-chain-security
    title: Supply chain security
  - id: S35
    resource: https://slsa.dev/spec/v1.2/
    title: SLSA specification Version 1.2
  - id: S07
    resource: https://docs.github.com/en/get-started/learning-about-github/githubs-plans
    title: GitHub plans
  - id: S06
    resource: https://docs.github.com/en/billing/concepts/product-billing/github-advanced-security
    title: GitHub Advanced Security license billing
verified:
  - { by: refresh/v1, at: 2026-10-01T08:28:57Z }
---

# DevSecOps terminology

These definitions identify functions. Product eligibility and commercial terms are separate decisions.

| Term | Definition and boundary |
| --- | --- |
| DevSecOps | Integration of development, security, and operations practices into software delivery. SSDF describes secure-development practices that can be integrated into an SDLC. [^S14][^S34] |
| SAST | Static analysis of code for potential vulnerabilities or errors. CodeQL creates a code database and evaluates queries against it. [^S15] |
| DAST | Analysis of a running application or API through its exposed interfaces. ZAP documents crawling, passive analysis, and active analysis as distinct operations. [^S24] |
| SCA | Dependency analysis, including vulnerability and license-policy information. Dependency inventory, advisory matching, and pull request dependency review perform different parts of this function. [^S22][^S38] |
| SBOM | Inventory of software components and associated metadata. GitHub's export includes dependency versions, identifiers, license information, and relationships; it excludes downstream dependents. [^S21] |
| Code quality | Analysis of reliability, maintainability, coverage, and related metrics. The metric set and enforcement behavior depend on the selected product. [^S09][^S33] |
| Security or quality gate | A policy that makes acceptable check results a prerequisite for merging or deployment. A produced result requires a corresponding enforcement rule to block merging. [^S22][^S40] |
| SARIF | Analysis-result interchange accepted by GitHub code scanning. Ingestion does not perform the original analysis or establish repository entitlement. Exact schema and upload limits require a separate check. [^S16] |
| Provenance and attestation | Provenance identifies the source and workflow producing an artifact. An attestation is a signed claim about provenance or an associated SBOM; a verification policy must assess the claim. [^S38][^S35] |
| Platform plan and add-on | A platform subscription establishes base capabilities. Separately licensed products and metered consumption have their own eligibility and billing rules. [^S07][^S06] |

## Decision fields

**Recommendation:** Keep five fields separate in an assessment: platform entitlement, tool/component license, workflow or API permission, enforcement configuration, and consumption. A valid API permission does not establish a paid entitlement; a successful scan does not establish an enforced gate. [^S06][^S16][^S40]

## Related concepts

* [GitHub plans](/commercial/github-plans.md)
* [Security products](/commercial/security-products.md)
* [SCA and SBOM](/supply-chain/sca-sbom.md)
* [Selection and rollout](/governance/baseline-and-selection.md)

[^S14]: [GitHub Advanced Security](https://github.com/security/advanced-security).
[^S34]: [NIST SP 800-218, SSDF Version 1.1](https://csrc.nist.gov/pubs/sp/800/218/final).
[^S15]: [Code scanning with CodeQL](https://docs.github.com/en/code-security/concepts/code-scanning/codeql/codeql-code-scanning).
[^S24]: [ZAP Docker documentation](https://www.zaproxy.org/docs/docker/).
[^S22]: [Dependency review](https://docs.github.com/en/code-security/concepts/supply-chain-security/dependency-review).
[^S21]: [Exporting a repository SBOM](https://docs.github.com/en/code-security/how-tos/secure-your-supply-chain/establish-provenance-and-integrity/export-dependencies-as-sbom).
[^S09]: [GitHub Code Quality](https://docs.github.com/en/code-security/concepts/code-quality/code-quality).
[^S33]: [SonarQube Server quality gates](https://docs.sonarsource.com/sonarqube-server/quality-standards-administration/managing-quality-gates/introduction-to-quality-gates).
[^S40]: [Available rules for rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets).
[^S16]: [Uploading SARIF to GitHub](https://docs.github.com/en/code-security/how-tos/find-and-fix-code-vulnerabilities/integrate-with-existing-tools/upload-sarif-file).
[^S38]: [Supply chain security](https://docs.github.com/en/code-security/concepts/supply-chain-security/supply-chain-security).
[^S35]: [SLSA specification Version 1.2](https://slsa.dev/spec/v1.2/).
[^S07]: [GitHub plans](https://docs.github.com/en/get-started/learning-about-github/githubs-plans).
[^S06]: [GitHub Advanced Security license billing](https://docs.github.com/en/billing/concepts/product-billing/github-advanced-security).
