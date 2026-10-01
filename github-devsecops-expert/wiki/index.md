---
okf_version: "0.2"
---

# GitHub DevSecOps Advisor - Wiki

The Wiki covers the scope in [brief.md](../brief.md). Licensing and pricing answers require a new check of the official commercial sources, regardless of a concept's `stale_after` date.

# Foundations

* [DevSecOps terminology](/foundations/glossary.md) - analysis, inventory, enforcement, licensing, and provenance definitions.

# Commercial

* [GitHub plans and deployment eligibility](/commercial/github-plans.md) - plans, visibility, version-specific deployment differences, and permission boundaries.
* [Security-product licensing and pricing](/commercial/security-products.md) - product units, committer counting, CodeQL terms, and commercial unknowns.
* [GitHub Actions cost model](/commercial/actions-cost-model.md) - allowances, runner/storage units, and effective-date reconciliation.
* Public commercial-source reconciliation - not yet written; planned path: `/commercial/commercial-source-reconciliation.md`; pointers: [GHAS billing](https://docs.github.com/en/billing/concepts/product-billing/github-advanced-security), [Code Quality billing](https://docs.github.com/en/billing/concepts/product-billing/github-code-quality), [CodeQL terms](https://github.com/github/codeql-cli-binaries/blob/main/LICENSE.md).
* Enterprise Server target-version matrix - not yet written; planned path: `/commercial/enterprise-server-version-matrix.md`; pointer: [versioned CodeQL documentation](https://docs.github.com/en/enterprise-server@3.20/code-security/concepts/code-scanning/codeql/codeql-code-scanning).

# SAST

* [SAST and code scanning](/sast/code-scanning.md) - setup/build constraints, native ingestion, and Semgrep component licenses.
* Alternative SAST release, pricing, and SARIF validation - not yet written; planned path: `/sast/alternative-release-and-sarif.md`; pointers: [Semgrep licensing](https://docs.semgrep.dev/licensing), [GitHub SARIF support](https://docs.github.com/en/code-security/reference/code-scanning/sarif-files/sarif-support).

# Supply chain

* [SCA and SBOM](/supply-chain/sca-sbom.md) - inventory, advisory matching, PR policy, SPDX export, and Syft output boundaries.
* External SCA and license-policy comparison - not yet written; planned path: `/supply-chain/external-sca-and-license-policy.md`; pointers: [Snyk docs](https://docs.snyk.io/), [OWASP Dependency-Track](https://dependencytrack.org/).
* SBOM API migration and released schema validation - not yet written; planned path: `/supply-chain/sbom-migration-and-schema.md`; pointers: [SBOM API](https://docs.github.com/en/rest/dependency-graph/sboms?apiVersion=2022-11-28), [Syft releases](https://github.com/anchore/syft/releases), [SPDX](https://spdx.dev/), [CycloneDX](https://cyclonedx.org/).

# DAST

* [DAST and external-tool integration](/dast/external-testing.md) - ZAP modes, authorized targets, authentication prerequisites, and outcome policies.
* Commercial and authenticated DAST details - not yet written; planned path: `/dast/commercial-and-authenticated-dast.md`; pointers: [Burp DAST](https://portswigger.net/burp/dast), [ZAP docs](https://www.zaproxy.org/docs/).

# Quality

* [Code quality and quality gates](/quality/quality-gates.md) - native GA and metering, preview rules, Sonar unit/edition differences, and enforcement.
* Sonar edition and released-version entitlements - not yet written; planned path: `/quality/sonar-edition-entitlements.md`; pointers: [Server pricing](https://www.sonarsource.com/plans-and-pricing/sonarqube/), [Cloud pricing](https://www.sonarsource.com/plans-and-pricing/).

# Automation

* [Workflow security and automation](/automation/workflow-security.md) - token, action, runner, untrusted-input, and required-check controls.
* Provider-specific OIDC, runner, and attestation details - not yet written; planned path: `/automation/oidc-runners-attestations.md`; pointers: [secure use](https://docs.github.com/en/actions/reference/security/secure-use), [supply chain security](https://docs.github.com/en/code-security/concepts/supply-chain-security/supply-chain-security).

# Governance

* [Tool-selection matrix and rollout baseline](/governance/baseline-and-selection.md) - selection constraints, proposed phase exit criteria, and versioned standards references.
* Standards edition selection and practice mapping - not yet written; planned path: `/governance/standards-version-and-practice-map.md`; pointers: [NIST SSDF publication](https://csrc.nist.gov/pubs/sp/800/218/final), [SLSA specifications](https://slsa.dev/spec/).
