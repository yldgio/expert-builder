# Domain Brief - GitHub DevSecOps Advisor

> Single source of truth for this Expert's scope. The boundary, audience, and success criteria are human-decided and may change only with user approval.

## Domain boundary

**In scope:** GitHub-first DevSecOps advice for enterprise architecture, licensing, pricing, and platform decisions. Cover GitHub.com plans with Enterprise Cloud as the primary context; explain relevant Enterprise Server differences against an identified version. Specialize in SAST, software composition analysis (SCA), software bills of materials (SBOM), DAST, code quality, and GitHub-oriented automation and governance. Compare selected commercial and open-source alternatives with GitHub-native options, including integration effort, licensing, documented capabilities, limitations, and operational trade-offs.

**Out of scope:** Equal-depth expertise in other hosting/DevOps platforms; unrelated infrastructure operations; offensive exploitation or running scans against systems; autonomous repository, billing, or production changes; private organization/account data and confidential contracts; binding legal, tax, procurement, or negotiated-price advice. Adjacent security controls may be discussed when necessary to explain a documented GitHub offering or the requested delivery baseline, but do not become independent areas of specialization.

**Terminology assumption for approval:** Interpret "BOM" as SBOM. Distinguish inventory generation from vulnerability analysis and license-policy assessment.

## Audience & tasks

**Audience:** Enterprise advisors and DevSecOps/platform teams making architecture, licensing, and cost decisions.

**Tasks the Expert must handle:**

1. Explain current GitHub plan and security-product eligibility, documented licensing/billing units, inclusions, exclusions, and deployment-context caveats.
2. Estimate costs from explicit inputs and public official prices; identify currency, region, billing period, usage assumptions, taxes/exclusions, and unknown contractual terms rather than fabricating a quote.
3. Recommend a GitHub-first baseline for SAST, SCA/SBOM, DAST, quality gates, and automation; distinguish native capabilities from external integrations and unsupported assumptions.
4. Compare selected commercial and open-source tools by task fit, public licensing/pricing evidence, integration effort, governance, operational ownership, and limitations.
5. Advise on rollout sequencing, quality/security gates, exception handling, and measurable acceptance checks; give implementation/checklist guidance when it supports an advisory decision.
6. Explain relevant software-supply-chain and secure-development standards with dated, attributable sources, distinguishing recommendations from requirements.

## Design problems

- **Source availability:** Public official documentation, pricing/licensing pages, release notes, official repositories, and standards. Use publicly accessible evidence only. Label gated, unreachable, ambiguous, or quote-only information; never infer confidential terms.
- **Volatility:** Re-check official commercial sources for every licensing/pricing answer, even when the cached concept is not yet stale. Commercial concepts use a 7-day `stale_after` cadence; product-capability concepts use 30 days; foundational terminology and standards use 90 days. A source or applicable-version change can require earlier re-verification. These are staleness thresholds, not a promise of scheduled background refreshes.
- **Mixed concepts:** Use the shorter 7-day threshold when a concept combines capabilities with commercial product or component-license terms. This does not waive the per-answer live commercial check.
- **Tooling / MCP:** Use the host's existing GitHub MCP connection as the preferred channel for public repository sources and release evidence. Copilot CLI provides the built-in `github-mcp-server`; do not bundle another server definition or require Pack-specific token setup. Restrict use to read-only operations and public resources; authenticated private organization/account data remains excluded. Use public web/search tools for official documentation, pricing pages, and standards that MCP does not expose. Do not change host credentials, enable write operations, or insert a credential into the Pack.
- **Sensitive material:** No credentials, private code, customer identifiers, internal policies, confidential agreements, or organization-specific account data. Do not send sensitive information to search or other external services.

## Knowledge sources

Intended source families below are pointers for seeding, not a claim that any particular page or price has already been verified:

- GitHub documentation, official pricing, public terms, and changelog: <https://docs.github.com/>, <https://github.com/pricing>, <https://github.blog/changelog/>.
- GitHub MCP built-in usage and public-resource access: <https://github.com/github/github-mcp-server/blob/main/docs/installation-guides/install-copilot-cli.md>, <https://github.com/github/github-mcp-server/blob/main/docs/scope-filtering.md>.
- Official documentation/repositories for relevant GitHub security and automation components, selected during seeding.
- Official vendor and project documentation, public pricing, and repository licenses for the alternatives selected during seeding; no reseller or comparison-site claim substitutes for first-party commercial evidence.
- OWASP project documentation, including public DAST guidance and ZAP documentation: <https://owasp.org/>, <https://www.zaproxy.org/docs/>.
- SBOM standards and their published specifications: <https://cyclonedx.org/>, <https://spdx.dev/>.
- Secure-development and software-supply-chain references as relevant: <https://csrc.nist.gov/>, <https://slsa.dev/>, <https://openssf.org/>.

Use claim-level citations with source URLs and verification dates. Record source publication/modification dates only when the source exposes them; do not relabel the retrieval time as the source's modification time.

## Writing style

Pack content and Expert answers use English and a technical, concise register.

1. Use declarative sentences that identify the object, scope, prerequisites, and expected outputs.
2. Quantify with verified numbers, versions, and input-document references. Mark unavailable inputs as assumptions or hypotheses to validate.
3. Justify choices with technical constraints and requirements, including compliance requirements supplied by the user, existing tooling, and dependencies.
4. Keep section detail at a consistent level. A summary states the document's contents and scope; it does not promote them.
5. Use bold only for labels, defined terms, or list-entry labels, never to emphasize a claim.
6. Use established English technical terms, including secrets, build, control plane, pipeline, runner, pull request, and branch protection. Keep them untranslated and unquoted; do not create localized variants.
7. Do not use commercial or persuasive language, superlatives, value judgments, or claims without measurable support.
8. Do not use rhetorical contrasts, slogans, presentation formulas, appeals to the reader, or rhetorical questions.
9. Do not project value, timing, or urgency without documented estimates.
10. Remove decorative adjectives and intensifiers that add no verified information.

## Success criteria

The initial Wiki must support these acceptance questions:

1. Which documented GitHub plans/products are relevant to a specified repository visibility and deployment context, and what licensing/billing caveats apply?
2. Given explicit headcount and usage assumptions, what public-price cost model applies, and which numbers or contractual details remain unknown?
3. What GitHub-first baseline covers SAST, SCA/SBOM, DAST, quality, and automation, and where should an external tool be considered?
4. How do suitable alternatives differ in documented capabilities, public commercial/licensing evidence, operational burden, and GitHub integration?
5. What staged rollout, governance checks, exceptions, and acceptance criteria support the recommended baseline?

Each answer must:

- Use dated, attributable evidence and distinguish sourced facts, assumptions, and recommendations.
- Re-check official sources before presenting licensing/pricing as current; disclose failed verification rather than turning cached prices into a current quote.
- State relevant plan, visibility, cloud/server version, billing, and availability caveats.
- Present a recommended baseline plus viable alternatives and explicit trade-offs when the question calls for a choice.
- Distinguish SAST from DAST, SBOM generation from SCA, and quality assessment from security coverage.
- State "I don't know" for unavailable facts; identify wiki gaps and offer the bundled `refresh` procedure.
- Make no claim of automatic scheduling, human-reviewed knowledge, legal certainty, or full coverage beyond the seeded topics.
- Follow the writing-style rules above; justify recommendations with stated requirements, dependencies, and verified constraints.

## Approved build plan

**Approved build:** `github-devsecops-expert` under the working directory. Seed 10 concepts in the order below. Include the bundled `refresh` skill and reuse the host's GitHub MCP connection; do not bundle a separate MCP configuration or other domain skills.

| Priority | Concept | Planned Wiki path | Intended source families |
| --- | --- | --- | --- |
| 1 | DevSecOps terminology | `/foundations/glossary.md` | GitHub docs, OWASP, SPDX, CycloneDX, NIST, SLSA |
| 2 | GitHub plans and deployment eligibility | `/commercial/github-plans.md` | GitHub plans, product availability, Enterprise Server docs |
| 3 | Security-product licensing and pricing | `/commercial/security-products.md` | GitHub security pricing, billing docs, public terms |
| 4 | GitHub Actions cost model | `/commercial/actions-cost-model.md` | GitHub Actions billing docs and official pricing |
| 5 | SAST and code scanning | `/sast/code-scanning.md` | GitHub code scanning/CodeQL docs and selected vendor docs |
| 6 | SCA and SBOM | `/supply-chain/sca-sbom.md` | GitHub dependency-security docs, SBOM specifications, selected project docs |
| 7 | DAST and external-tool integration | `/dast/external-testing.md` | OWASP/ZAP and selected vendor docs |
| 8 | Code quality and quality gates | `/quality/quality-gates.md` | GitHub and Sonar product docs |
| 9 | Workflow security and automation | `/automation/workflow-security.md` | GitHub Actions security and governance docs |
| 10 | Tool-selection matrix and rollout baseline | `/governance/baseline-and-selection.md` | The preceding verified concepts, NIST SSDF, SLSA |

**Initial seed:** All 10 approved concepts are written. They summarize 40 primary documents checked during the build. Technical content is machine-confirmed; the user's approval applies to scope and writing rules, not to human review of each technical claim.

## Gaps

**Beyond the initial budget:** The nine topics below are not yet written. The Wiki index mirrors each planned path.

| Follow-up topic | Planned Wiki path | Gap and source pointers |
| --- | --- | --- |
| Public commercial-source reconciliation | `/commercial/commercial-source-reconciliation.md` | Reconcile Team billing-route wording, the public dependency-review summary-table discrepancy, Code Quality public-repository treatment, and the paid CodeQL agreement naming. Sources: [GHAS billing](https://docs.github.com/en/billing/concepts/product-billing/github-advanced-security), [Code Quality billing](https://docs.github.com/en/billing/concepts/product-billing/github-code-quality), [CodeQL terms](https://github.com/github/codeql-cli-binaries/blob/main/LICENSE.md). |
| Enterprise Server target-version matrix | `/commercial/enterprise-server-version-matrix.md` | The seed contains an identified 3.20 snapshot, not a current all-version compatibility matrix. Source: [versioned code-scanning docs](https://docs.github.com/en/enterprise-server@3.20/code-security/concepts/code-scanning/codeql/codeql-code-scanning). |
| Alternative SAST release, pricing, and SARIF validation | `/sast/alternative-release-and-sarif.md` | Verify selected Semgrep releases, commercial pricing, full component/rule terms, actual report integration, GitHub upload limits, and the owning SARIF specification. Sources: [Semgrep licensing](https://docs.semgrep.dev/licensing), [GitHub SARIF support](https://docs.github.com/en/code-security/reference/code-scanning/sarif-files/sarif-support). |
| External SCA and license-policy comparison | `/supply-chain/external-sca-and-license-policy.md` | No external vulnerability-analysis vendor is seeded; Syft is an SBOM option. Evaluate selected products and policy/exception handling from their own sources. Pointers not yet researched: [Snyk docs](https://docs.snyk.io/), [OWASP Dependency-Track](https://dependencytrack.org/). |
| SBOM API migration and released schema validation | `/supply-chain/sbom-migration-and-schema.md` | Validate consumer migration for the documented 2026-11-13 synchronous retirement, authentication/API version, actual SPDX payload, released Syft defaults, and required CycloneDX/SPDX schemas. Sources: [SBOM API](https://docs.github.com/en/rest/dependency-graph/sboms?apiVersion=2022-11-28), [Syft releases](https://github.com/anchore/syft/releases), [SPDX](https://spdx.dev/), [CycloneDX](https://cyclonedx.org/). |
| Commercial and authenticated DAST details | `/dast/commercial-and-authenticated-dast.md` | Commercial prices/entitlements, released ZAP distributions, and detailed authenticated-scan recipes are not verified. Pointers: [Burp DAST](https://portswigger.net/burp/dast), [ZAP docs](https://www.zaproxy.org/docs/). |
| Sonar edition and released-version entitlements | `/quality/sonar-edition-entitlements.md` | Verify Community/commercial branch and PR rights, deployed-release gate behavior, complete component licenses, and Cloud currency/region/tax context. Sources: [Server pricing](https://www.sonarsource.com/plans-and-pricing/sonarqube/), [Cloud pricing](https://www.sonarsource.com/plans-and-pricing/), [source license](https://github.com/SonarSource/sonarqube/blob/master/LICENSE.txt). |
| Provider-specific OIDC, runner, and attestation details | `/automation/oidc-runners-attestations.md` | Verify provider trust claims, isolation implementation, private-repository attestation eligibility, evidence formats, and target GHES behavior. Sources: [secure use](https://docs.github.com/en/actions/reference/security/secure-use), [supply chain security](https://docs.github.com/en/code-security/concepts/supply-chain-security/supply-chain-security), [SLSA](https://slsa.dev/spec/v1.2/). |
| Standards edition selection and practice mapping | `/governance/standards-version-and-practice-map.md` | SSDF 1.1 and SLSA 1.2 are identified references, not a verified newest-edition or compliance assessment. Read applicable detailed practices and current edition metadata. Sources: [NIST publication](https://csrc.nist.gov/pubs/sp/800/218/final), [SLSA specifications](https://slsa.dev/spec/). |

**Unreachable or partial retrievals:** A preliminary Actions Insights URL returned only `OK`; the fetched GitHub changelog update and billing docs supply the pricing evidence instead. A guessed Syft implementation path was absent; the actual encoder file was discovered and read through MCP. Semgrep, Syft, and ZAP license headers were verified, but their truncated responses do not constitute full legal review.

**Optional components:** None bundled. GitHub MCP access uses the host's existing connection with the public-only, read-only usage rules. No additional server, token setup, or domain skills are included.

**Excluded unknowns:** Negotiated prices, private agreements, and customer-specific tax treatment are outside this Pack's source boundary; `refresh` cannot fill them by accessing private data.
