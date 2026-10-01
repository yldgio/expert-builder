---
type: Guide
title: DAST and external-tool integration
description: ZAP scan modes, authorization prerequisites, outcome policy, and unverified commercial alternatives.
tags: [dast, zap, integration]
generated: { by: refresh/v1, at: 2026-10-01T08:28:57Z }
stale_after: 2026-10-08T08:28:57Z
sources:
  - id: S24
    resource: https://www.zaproxy.org/docs/docker/
    title: ZAP Docker documentation
  - id: S32
    resource: https://www.zaproxy.org/docs/docker/baseline-scan/
    title: ZAP baseline scan
  - id: S25
    resource: https://github.com/zaproxy/zaproxy/blob/main/LICENSE
    title: ZAP license
  - id: S29
    resource: https://docs.github.com/en/actions/reference/security/secure-use
    title: GitHub Actions secure use
  - id: S02
    resource: https://docs.github.com/en/get-started/learning-about-github/about-github-advanced-security
    title: About GitHub Advanced Security
verified:
  - { by: refresh/v1, at: 2026-10-01T08:28:57Z }
---

# DAST and external-tool integration

**Inputs:** Written target authorization, running application/API, scope, network reachability, test identities, reset procedure, scan mode, and gate policy.

The reviewed GitHub security documentation describes static code, dependency, and secret-protection functions. This guide recommends an external runtime-testing stage; it does not claim that GitHub has no DAST capability. [^S02][^S24]

## ZAP modes

| Mode | Documented behavior | Required input |
| --- | --- | --- |
| Baseline | Default one-minute spider followed by passive scanning; no active attack phase | Reachable URL and discovered traffic. [^S24][^S32] |
| Full | Full spider, optional Ajax spider, active and passive scanning | Running target and approved active-test scope. [^S24] |
| API | API scan using OpenAPI/Swagger or documented GraphQL support | API definition, reachable endpoints, and authentication where required. [^S24] |

Mode descriptions are published in the packaged-scan documentation. The baseline details and authentication options are documented separately. A floating `stable` image does not identify a verified numeric ZAP release. [^S24][^S32]

## Outcome and authentication policy

Baseline findings default to WARN. Configuration can classify rules as FAIL or IGNORE. Documented exit codes are 0 for success, 1 for at least one FAIL, 2 for warnings without FAIL, and 3 for another failure. The CI gate must map each result deliberately instead of treating every nonzero outcome as an equivalent vulnerability decision. [^S32]

Authenticated baseline scanning requires a configured context and a user in that context. The documentation labels the user option and GraphQL-era support by historical release boundaries; verify the selected released distribution rather than assuming a current image version. [^S32][^S24]

ZAP's source-license header identifies Apache 2.0. Complete license obligations and distribution-specific packaging were not assessed in this seed. [^S25]

## Recommended integration

**Recommendation:** Define the target owner, authorized URL/scope, reachable environment, test credentials, pinned distribution, report retention, and failure policy before integrating the scan with Actions. These are operating prerequisites, not claims that the scanner enforces target authorization. [^S24][^S29][^S32]

**Recommendation:** Use a representative nonproduction environment with resettable data for active/full/API testing. Baseline can provide passive observations; the documentation's potential production-use description still requires a target-owner and operational assessment. [^S24][^S32]

## Expected outputs and gaps

**Recommendation:** Retain the tested scope, scanner version, authentication coverage, scan report, classified findings, and execution outcome. Verify that the intended fail condition is enforced by the pipeline and that tool failures are reported as failures. [^S32][^S29]

Commercial DAST prices and entitlements were not verified. Burp DAST procurement and detailed authenticated-scanning recipes are recorded as follow-up topics, not priced or tested integrations.

## Related concepts

* [Workflow controls](/automation/workflow-security.md)
* [Rollout baseline](/governance/baseline-and-selection.md)

[^S24]: [ZAP Docker documentation](https://www.zaproxy.org/docs/docker/).
[^S32]: [ZAP baseline scan](https://www.zaproxy.org/docs/docker/baseline-scan/).
[^S25]: [ZAP license](https://github.com/zaproxy/zaproxy/blob/main/LICENSE).
[^S29]: [GitHub Actions secure use](https://docs.github.com/en/actions/reference/security/secure-use).
[^S02]: [About GitHub Advanced Security](https://docs.github.com/en/get-started/learning-about-github/about-github-advanced-security).
