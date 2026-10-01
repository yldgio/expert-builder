---
type: Guide
title: SAST and code scanning
description: CodeQL setup, language and build constraints, SARIF ingestion, and Semgrep licensing distinctions.
tags: [sast, codeql, semgrep]
generated: { by: refresh/v1, at: 2026-10-01T08:28:57Z }
stale_after: 2026-10-08T08:28:57Z
sources:
  - id: S15
    resource: https://docs.github.com/en/code-security/concepts/code-scanning/codeql/codeql-code-scanning
    title: Code scanning with CodeQL
  - id: S16
    resource: https://docs.github.com/en/code-security/how-tos/find-and-fix-code-vulnerabilities/integrate-with-existing-tools/upload-sarif-file
    title: Uploading SARIF to GitHub
  - id: S17
    resource: https://codeql.github.com/docs/codeql-overview/supported-languages-and-frameworks/
    title: CodeQL supported languages and frameworks
  - id: S36
    resource: https://docs.github.com/en/code-security/how-tos/find-and-fix-code-vulnerabilities/manage-your-configuration/codeql-for-compiled-languages
    title: CodeQL for compiled languages
  - id: S18
    resource: https://docs.semgrep.dev/licensing
    title: Semgrep licensing
  - id: S19
    resource: https://github.com/semgrep/semgrep/blob/develop/LICENSE
    title: Semgrep engine license
  - id: S08
    resource: https://github.com/github/codeql-cli-binaries/blob/main/LICENSE.md
    title: GitHub CodeQL Terms and Conditions
verified:
  - { by: refresh/v1, at: 2026-10-01T08:28:57Z }
---

# SAST and code scanning

**Inputs:** Languages, frameworks, build method, generated code, deployment, repository visibility, selected scanner/component, and commercial entitlement.

## Native routes

| Route | Documented behavior | Decision prerequisite |
| --- | --- | --- |
| CodeQL default setup | Selects languages, query suite, and trigger events | Verify that the observed analysis represents the repository. [^S15] |
| CodeQL advanced setup | Creates a configurable workflow | Define build steps and analysis configuration where defaults do not represent the project. [^S15] |
| External CI with CodeQL CLI | Generates analysis and uploads results | Verify CLI terms, execution prerequisites, and repository entitlement. [^S15][^S16][^S08] |
| Third-party SARIF ingestion | Displays compatible externally generated results | Validate the producer's output and GitHub ingestion entitlement. [^S16] |

The native setup routes and external-CI route are documented by GitHub. Private/internal third-party ingestion still requires Code Security enablement. [^S15][^S16][^S08]

## Languages and build requirements

The GitHub.com matrix lists C/C++, C#, Go, Java/Kotlin, JavaScript/TypeScript, Python, Ruby, Rust, Swift, and GitHub Actions workflows. It explicitly excludes unsupported languages including PHP and Scala. Use the applicable deployment/version matrix rather than treating this list as universal. [^S15]

Current default setup documents no-build analysis for C/C++, C#, Java, and Rust. Kotlin requires a build; Java no-build analysis does not analyze Kotlin found in the repository. Generated sources and inferred dependencies can change analysis completeness. [^S36]

**Recommendation:** Use advanced setup when a pilot demonstrates that default/autobuild behavior does not represent the build, generated sources, or configuration. Confirm framework support and add modeling only where the documented models and observed results require it. [^S15][^S17][^S36]

## SARIF boundary

GitHub can ingest compatible third-party SARIF. Categories distinguish analyses; reuse of the same tool/category can replace earlier results. Verify categories for multi-language or multi-configuration submissions. [^S16]

The exact SARIF schema, upload limits, and a selected Semgrep release's integration are unseeded. Do not infer that an arbitrary report format or scanner release is compatible.

## Semgrep comparison

| Component | Verified license boundary |
| --- | --- |
| Community Edition engine | LGPL 2.1 open-source engine. [^S18][^S19] |
| Semgrep Code and AppSec Platform | Proprietary products. [^S18] |
| Semgrep-maintained Community and Pro rules | Semgrep Rules License v1.0, including internal-business-use and competing-product/SaaS restrictions. [^S18] |
| Third-party registry rules | License inherited from the source repository. [^S18] |

The vendor's licensing page distinguishes these components. The engine's LGPL 2.1 header was also read from its source repository; the full source-license body was not reviewed in this seed. No hosted-product price or unrestricted rule-use conclusion was established. [^S18][^S19]

**Recommendation:** Evaluate Semgrep CE for a self-operated analysis requirement, subject to the chosen engine and rule licenses. Validate language/framework coverage on representative code and verify the chosen release's result integration before replacing an existing gate. Comparative detection performance has not been measured here. [^S18][^S16]

CodeQL's binary terms have separate open-source-code and paid-customer conditions. Public repository visibility alone is not a license clearance. [^S08]

## Expected pilot outputs

**Recommendation:** Record the scanner version, analyzed languages, build/extraction outcome, representative findings, missing coverage, report categories, license decision, and job duration. Define a required-check policy only after analysis failures and result attribution have been tested. [^S15][^S16][^S36]

## Related concepts

* [Security licensing](/commercial/security-products.md)
* [Workflow controls](/automation/workflow-security.md)
* [Selection baseline](/governance/baseline-and-selection.md)

[^S15]: [Code scanning with CodeQL](https://docs.github.com/en/code-security/concepts/code-scanning/codeql/codeql-code-scanning).
[^S16]: [Uploading SARIF to GitHub](https://docs.github.com/en/code-security/how-tos/find-and-fix-code-vulnerabilities/integrate-with-existing-tools/upload-sarif-file).
[^S17]: [CodeQL supported languages and frameworks](https://codeql.github.com/docs/codeql-overview/supported-languages-and-frameworks/).
[^S36]: [CodeQL for compiled languages](https://docs.github.com/en/code-security/how-tos/find-and-fix-code-vulnerabilities/manage-your-configuration/codeql-for-compiled-languages).
[^S18]: [Semgrep licensing](https://docs.semgrep.dev/licensing).
[^S19]: [Semgrep engine license](https://github.com/semgrep/semgrep/blob/develop/LICENSE).
[^S08]: [GitHub CodeQL Terms and Conditions](https://github.com/github/codeql-cli-binaries/blob/main/LICENSE.md).
