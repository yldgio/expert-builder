---
type: Guide
title: Code quality and quality gates
description: GitHub Code Quality availability and metering compared with Sonar licensing, metrics, and gates.
tags: [quality, code-quality, sonar, commercial]
generated: { by: refresh/v1, at: 2026-10-01T08:28:57Z }
stale_after: 2026-10-08T08:28:57Z
sources:
  - id: S09
    resource: https://docs.github.com/en/code-security/concepts/code-quality/code-quality
    title: GitHub Code Quality
  - id: S10
    resource: https://docs.github.com/en/billing/concepts/product-billing/github-code-quality
    title: GitHub Code Quality billing
  - id: S30
    resource: https://github.blog/changelog/2026-07-20-github-code-quality-is-now-generally-available/
    title: GitHub Code Quality general availability
    last_modified: 2026-08-04T17:45:51Z
  - id: S13
    resource: https://github.com/github/docs/blob/main/data/reusables/code-quality/codeql-supported-languages.md
    title: Code Quality supported languages
  - id: S15
    resource: https://docs.github.com/en/code-security/concepts/code-scanning/codeql/codeql-code-scanning
    title: CodeQL security-scanning languages
  - id: S40
    resource: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets
    title: Available rules for rulesets
  - id: S26
    resource: https://www.sonarsource.com/plans-and-pricing/sonarqube/
    title: SonarQube Server plans and pricing
    last_modified: 2026-09-28T22:18:56.324Z
  - id: S27
    resource: https://www.sonarsource.com/plans-and-pricing/
    title: Sonar plans and pricing
  - id: S39
    resource: https://github.com/SonarSource/sonarqube/blob/master/LICENSE.txt
    title: SonarQube source license
  - id: S33
    resource: https://docs.sonarsource.com/sonarqube-server/quality-standards-administration/managing-quality-gates/introduction-to-quality-gates
    title: SonarQube Server quality gates
verified:
  - { by: refresh/v1, at: 2026-10-01T08:28:57Z }
---

# Code quality and quality gates

**Inputs:** Language coverage, required metrics, test-report production, pull request workflow, deployment, edition, billing population/capacity, and enforcement policy.

## Native GitHub Code Quality

Code Quality became generally available on 2026-07-20 for Team and Enterprise Cloud, with billing beginning at GA. It is standalone rather than bundled into Advanced Security. [^S30]

| Cost component | Verified published unit |
| --- | --- |
| Base product | USD 10 per active committer/month, using a 90-day pushed-commit window and deduplication. [^S10] |
| Deterministic analysis | Actions consumption. [^S10] |
| AI detection/autofix | Shared-pool AI credits; USD 0.01 per AI credit. [^S10] |

The billing page identifies GitHub App bots as excluded from counting. AI detection/autofix does not require a Copilot subscription; optional delegation to Copilot does. Re-check units and eligibility before estimating. [^S10][^S09]

Pull requests receive deterministic CodeQL quality findings. Default-branch analysis additionally uses AI analysis of recently changed files. Coverage uses an uploaded Cobertura XML report and does not replace test execution. [^S09]

Rule-based quality languages are C#, Go, Java, JavaScript, Python, Ruby, and TypeScript. This is a different matrix from CodeQL security scanning; do not transfer the security language list to quality analysis. [^S13][^S15]

Code Quality-result rules can block incomplete, failed, or severity-exceeding analysis. The separate coverage restriction remains public preview in the fetched ruleset documentation. It evaluates available uploaded coverage and does not wait for an upload; the report-producing check must also be required. [^S40]

A free-public-repository exemption for Code Quality was not established by the fetched billing and GA sources. Do not infer it from another security product's treatment. [^S10][^S30]

## Sonar comparison

| Offering | Verified licensing or price snapshot | Boundary |
| --- | --- | --- |
| Community Build/source | Vendor describes a free/open-source build; the public SonarQube source license is LGPL 3 | Does not establish proprietary edition or plugin licenses. [^S26][^S39] |
| Server Developer, Enterprise, Data Center | Licensed per instance/year by analyzed LOC capacity | Numeric Server price was not established; obtain the applicable quote. [^S26] |
| Cloud Free | Private-project tier up to 50k LOC | Check feature-specific entitlements separately. [^S27] |
| Cloud Team | Starts at $34 monthly for up to 100k private LOC | The page's dollar display was verified; ISO currency, region, and tax treatment were not established. [^S27] |
| Cloud Enterprise | Custom pricing | No numeric price established. [^S27] |

Cloud billing counts private-project LOC using the largest branch when branches exist; repeated analyses do not multiply the LOC quantity. These units differ from GitHub's active-committer unit and Server's instance/year model. Do not compare the displayed monthly units without the corresponding inputs. [^S26][^S27][^S10]

Sonar quality gates can assess security, reliability, maintainability, coverage, complexity, and duplication. Pull request evaluation uses new-code conditions. A reported gate or PR decoration requires repository-side enforcement to block merging. [^S33][^S40]

The Sonar-way discussion documents 80.0% new-code coverage and 3.0% duplication conditions. They are vendor conditions, not universal enterprise requirements. The page also mixes deprecation discussion and a hotspot-review condition; confirm behavior against the selected release. [^S33]

## Recommendation and verification

**Recommendation:** Select the product against language/metric coverage, existing test-report production, verified PR/edition entitlement, operational ownership, and the appropriate cost unit. GitHub-native integration alone does not establish coverage of every language or metric; a Sonar source license does not establish commercial PR-analysis rights. [^S09][^S13][^S26][^S27][^S39]

**Recommendation:** Test the report upload, quality failure, missing/incomplete analysis, and required-check behavior before enforcing the gate. Set thresholds from the supplied policy and measured repository baseline rather than assigning an undocumented universal value. [^S33][^S40]

Exact Community Build versus commercial branch/PR entitlements, released-version boundaries, and full commercial terms remain follow-up topics. [^S26][^S27][^S39]

## Related concepts

* [Product licensing](/commercial/security-products.md)
* [Actions costs](/commercial/actions-cost-model.md)
* [Workflow enforcement](/automation/workflow-security.md)

[^S09]: [GitHub Code Quality](https://docs.github.com/en/code-security/concepts/code-quality/code-quality).
[^S10]: [GitHub Code Quality billing](https://docs.github.com/en/billing/concepts/product-billing/github-code-quality).
[^S30]: [GitHub Code Quality GA](https://github.blog/changelog/2026-07-20-github-code-quality-is-now-generally-available/).
[^S13]: [Code Quality supported languages](https://github.com/github/docs/blob/main/data/reusables/code-quality/codeql-supported-languages.md).
[^S15]: [CodeQL code scanning](https://docs.github.com/en/code-security/concepts/code-scanning/codeql/codeql-code-scanning).
[^S40]: [Available rules for rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets).
[^S26]: [SonarQube Server pricing](https://www.sonarsource.com/plans-and-pricing/sonarqube/).
[^S27]: [Sonar plans and pricing](https://www.sonarsource.com/plans-and-pricing/).
[^S39]: [SonarQube source license](https://github.com/SonarSource/sonarqube/blob/master/LICENSE.txt).
[^S33]: [SonarQube Server quality gates](https://docs.sonarsource.com/sonarqube-server/quality-standards-administration/managing-quality-gates/introduction-to-quality-gates).
