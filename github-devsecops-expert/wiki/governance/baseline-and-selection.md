---
type: Guide
title: Tool-selection matrix and rollout baseline
description: Constraint-based tool selection, proposed rollout exit criteria, and versioned standards references.
tags: [governance, selection, standards, rollout]
generated: { by: refresh/v1, at: 2026-10-01T08:28:57Z }
stale_after: 2026-10-31T08:28:57Z
sources:
  - id: S15
    resource: https://docs.github.com/en/code-security/concepts/code-scanning/codeql/codeql-code-scanning
    title: Code scanning with CodeQL
  - id: S18
    resource: https://docs.semgrep.dev/licensing
    title: Semgrep licensing
  - id: S20
    resource: https://docs.github.com/en/code-security/concepts/supply-chain-security/dependabot-alerts
    title: Dependabot alerts
  - id: S22
    resource: https://docs.github.com/en/code-security/concepts/supply-chain-security/dependency-review
    title: Dependency review
  - id: S37
    resource: https://docs.github.com/en/rest/dependency-graph/sboms?apiVersion=2022-11-28
    title: SBOM REST API
  - id: S31
    resource: https://github.com/anchore/syft/blob/main/syft/format/encoders.go
    title: Syft encoder implementation
  - id: S24
    resource: https://www.zaproxy.org/docs/docker/
    title: ZAP Docker documentation
  - id: S09
    resource: https://docs.github.com/en/code-security/concepts/code-quality/code-quality
    title: GitHub Code Quality
  - id: S33
    resource: https://docs.sonarsource.com/sonarqube-server/quality-standards-administration/managing-quality-gates/introduction-to-quality-gates
    title: SonarQube Server quality gates
  - id: S40
    resource: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets
    title: Available rules for rulesets
  - id: S29
    resource: https://docs.github.com/en/actions/reference/security/secure-use
    title: GitHub Actions secure use
  - id: S06
    resource: https://docs.github.com/en/billing/concepts/product-billing/github-advanced-security
    title: GitHub Advanced Security license billing
  - id: S03
    resource: https://docs.github.com/en/billing/concepts/product-billing/github-actions
    title: GitHub Actions billing
  - id: S10
    resource: https://docs.github.com/en/billing/concepts/product-billing/github-code-quality
    title: GitHub Code Quality billing
  - id: S38
    resource: https://docs.github.com/en/code-security/concepts/supply-chain-security/supply-chain-security
    title: Supply chain security
  - id: S34
    resource: https://csrc.nist.gov/pubs/sp/800/218/final
    title: NIST SP 800-218 - SSDF Version 1.1
  - id: S35
    resource: https://slsa.dev/spec/v1.2/
    title: SLSA specification Version 1.2
verified:
  - { by: refresh/v1, at: 2026-10-01T08:28:57Z }
---

# Tool-selection matrix and rollout baseline

**Inputs:** Repository cohort, deployment/version, languages/builds, existing tools, supplied compliance requirements, operational owners, and commercial constraints.

## Selection matrix

| Requirement | Documented native coverage | Selected alternative or complement | Selection constraint |
| --- | --- | --- | --- |
| Supported-language SAST | CodeQL setup and analysis | Semgrep CE; proprietary products assessed separately | Validate language/build coverage, component licenses, and result integration. [^S15][^S18] |
| Dependency vulnerability management | Dependency inventory and Dependabot alerts/updates | No external vulnerability-analysis vendor seeded | Validate ecosystem inventory and advisory coverage. [^S20][^S38] |
| Pull request dependency gate | Dependency review with required checks | External policy requires its own verified integration | Validate entitlement, snapshot ordering, severity/license policy, and enforcement. [^S22][^S40] |
| SBOM | Native SPDX JSON export | Syft SPDX/CycloneDX encoder families | Validate released output schema and the documented API transition. [^S37][^S31] |
| Runtime web/API assessment | External integration recommended | ZAP baseline/full/API | Supply target authorization, reachability, authentication, and failure policy. [^S24] |
| Maintainability and coverage gates | Code Quality and its report-based coverage behavior | SonarQube gates | Validate language/metrics, report production, edition rights, and separate costs. [^S09][^S33][^S40] |
| Delivery controls | Actions security guidance and rulesets | Tool-specific outputs as required checks | Validate trusted producer, target branch, workflow trust, and bypass policy. [^S29][^S40] |
| Release provenance | Explicitly generated artifact attestations documented for public repositories | SLSA-guided build assessment | Validate signing/verification and deployment-specific eligibility before asserting an assurance level. [^S38][^S35] |

## Proposed rollout

The phases below are recommendations. Their exit criteria are proposed checks, not vendor requirements, measured customer outcomes, or implementation time estimates.

| Phase | Scope and prerequisites | Expected output and exit criteria |
| --- | --- | --- |
| 1. Inventory and entitlement | Identify the repository cohort, owners, visibility, deployment/version, languages/builds, ecosystems, and selected SKUs | Every in-scope repository has an owner and recorded entitlement decision; platform users and product-active-committer quantities are separate. [^S06][^S15] |
| 2. Observe analysis | Pilot representative builds and pull requests before enforcement | Record successful analysis, missing inventory, report producer, durations, and dispositions; each incomplete analysis has an owner. [^S15][^S22] |
| 3. Enforce changes | Define the intended branches, severity/quality policy, trusted checks, and bypass ownership | Exercise successful, missing, failed, and in-progress analysis; verify the intended blocking behavior and report-upload prerequisite. [^S40] |
| 4. Add runtime and release evidence | Establish an authorized nonproduction target, test identities, reset procedure, SBOM consumer, and provenance policy | Reports and generated evidence are attributable to the release, retrievable, and validated against the intended schema/policy. [^S24][^S37][^S38] |
| 5. Review operation and cost | Collect provider-billable units and operational outcomes | Reconcile SKU minutes, GB-hours, AI credits, product counts, exceptions, and remediation ownership against the documented estimate. [^S03][^S06][^S10] |

**Recommendation:** Set severity, coverage, and remediation thresholds from the supplied requirements and measured baseline. Do not label a proposed threshold as a regulatory requirement or claim cost reduction without a documented comparison. [^S33][^S34]

## Versioned standards references

NIST SP 800-218, SSDF Version 1.1, was published on 2022-02-03. It defines high-level secure-development practices for integration into SDLC implementations and supplier communication. This seed read publication metadata and the abstract, not the detailed practice mappings. [^S34]

SLSA Version 1.2 describes supply-chain guarantees through build/source tracks and attestation formats. This is the verified referenced edition; this seed does not establish that it is the newest October 2026 publication or that a particular workflow meets a level. [^S35]

**Recommendation:** Validate the required edition and detailed practices before claiming compliance, certification, or a SLSA level. Treat the rollout as an assessment plan with recorded evidence and unresolved dependencies. [^S34][^S35]

## Related concepts

* [Plans and eligibility](/commercial/github-plans.md)
* [Product licensing](/commercial/security-products.md)
* [Actions costs](/commercial/actions-cost-model.md)
* [SAST](/sast/code-scanning.md)
* [SCA and SBOM](/supply-chain/sca-sbom.md)
* [DAST](/dast/external-testing.md)
* [Code quality](/quality/quality-gates.md)
* [Workflow controls](/automation/workflow-security.md)

[^S15]: [Code scanning with CodeQL](https://docs.github.com/en/code-security/concepts/code-scanning/codeql/codeql-code-scanning).
[^S18]: [Semgrep licensing](https://docs.semgrep.dev/licensing).
[^S20]: [Dependabot alerts](https://docs.github.com/en/code-security/concepts/supply-chain-security/dependabot-alerts).
[^S22]: [Dependency review](https://docs.github.com/en/code-security/concepts/supply-chain-security/dependency-review).
[^S37]: [SBOM REST API](https://docs.github.com/en/rest/dependency-graph/sboms?apiVersion=2022-11-28).
[^S31]: [Syft encoder implementation](https://github.com/anchore/syft/blob/main/syft/format/encoders.go).
[^S24]: [ZAP Docker documentation](https://www.zaproxy.org/docs/docker/).
[^S09]: [GitHub Code Quality](https://docs.github.com/en/code-security/concepts/code-quality/code-quality).
[^S33]: [SonarQube Server quality gates](https://docs.sonarsource.com/sonarqube-server/quality-standards-administration/managing-quality-gates/introduction-to-quality-gates).
[^S40]: [Available rules for rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets).
[^S29]: [GitHub Actions secure use](https://docs.github.com/en/actions/reference/security/secure-use).
[^S06]: [GitHub Advanced Security license billing](https://docs.github.com/en/billing/concepts/product-billing/github-advanced-security).
[^S03]: [GitHub Actions billing](https://docs.github.com/en/billing/concepts/product-billing/github-actions).
[^S10]: [GitHub Code Quality billing](https://docs.github.com/en/billing/concepts/product-billing/github-code-quality).
[^S38]: [Supply chain security](https://docs.github.com/en/code-security/concepts/supply-chain-security/supply-chain-security).
[^S34]: [NIST SP 800-218, SSDF Version 1.1](https://csrc.nist.gov/pubs/sp/800/218/final).
[^S35]: [SLSA specification Version 1.2](https://slsa.dev/spec/v1.2/).
