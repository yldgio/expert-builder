---
type: Guide
title: Workflow security and automation
description: Token, action, runner, pull request, and required-check controls for GitHub-oriented pipelines.
tags: [automation, actions, governance]
generated: { by: refresh/v1, at: 2026-10-01T08:28:57Z }
stale_after: 2026-10-31T08:28:57Z
sources:
  - id: S29
    resource: https://docs.github.com/en/actions/reference/security/secure-use
    title: GitHub Actions secure use
  - id: S40
    resource: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets
    title: Available rules for rulesets
  - id: S38
    resource: https://docs.github.com/en/code-security/concepts/supply-chain-security/supply-chain-security
    title: Supply chain security
verified:
  - { by: refresh/v1, at: 2026-10-01T08:28:57Z }
---

# Workflow security and automation

**Inputs:** Workflow trust boundary, token operations, action sources, runner ownership, deployment identities, target branches, check producers, and bypass policy.

## Control baseline

| Control | Recommendation and documented constraint |
| --- | --- |
| Token permissions | Default `GITHUB_TOKEN` to minimal read access and elevate only the job needing a privileged operation. Actions can access `github.token` even without an explicit token input. [^S29] |
| Action and reusable-workflow references | Pin full-length commit SHAs and verify the intended repository. Tags can move; review reference updates and workflow changes. [^S29] |
| OIDC | Configure an OIDC-supporting provider and a narrowly scoped workflow-to-provider trust relationship. Validate the trust policy before removing static credentials. Provider-specific claims are not seeded. [^S29] |
| Untrusted pull requests | Do not check out untrusted PR code in privileged `pull_request_target` or `workflow_run` contexts. Treat artifacts from untrusted workflows as untrusted inputs. [^S29] |
| Secrets | Avoid plaintext/structured bundles and register transformed sensitive values for masking. Redaction is not guaranteed; exposed credentials require rotation. [^S29] |
| Runner isolation | Separate trusted workloads and runner groups. JIT runners execute at most one job, but reused hardware still needs a clean environment; self-hosted runners can retain compromise. [^S29] |
| Workflow governance | Require review for workflow changes, permission increases, and action updates. Environment approval does not establish isolation of an untrusted runner. [^S29] |
| Required checks | Apply checks to the intended branch/ruleset, use an expected GitHub App where its prerequisites are met, and define bypass ownership. [^S40] |

## Result production versus enforcement

Code-scanning rules can block a missing configured tool, analysis in progress, or an alert exceeding the selected severity. Code Quality-result rules can also block analysis failures, including an exhausted Actions budget. [^S40]

The expected-source App option has documented installation, permission, recent-check, and pre-existing-check prerequisites. Validate those prerequisites and the check producer before relying on a check's name. [^S40]

Secret-scanning merge protection and coverage restrictions are marked public preview in the fetched ruleset documentation. Record a rule's release state separately from the parent product's GA state. Coverage restrictions do not wait for a report upload; require the upload-producing check as well. [^S40]

## Configuration uncertainty

The supply-chain overview describes the dependency graph as not enabled by default, while the secure-use reference describes public-repository default enablement. Verify the repository configuration rather than assuming a universal default. [^S29][^S38]

## Expected verification

**Recommendation:** Test the intended branch, expected check producer, analysis success/failure/missing/in-progress states, upload completion, and authorized bypass. Record each result, owner, and expiry condition. A notification or published report without enforcement is not a verified merge gate. [^S40]

**Recommendation:** Measure required token operations and review untrusted input paths before changing permissions or runner access. This Pack advises on the design; it does not apply repository settings or execute workflows. [^S29]

## Related concepts

* [Code scanning](/sast/code-scanning.md)
* [SCA and SBOM](/supply-chain/sca-sbom.md)
* [Quality gates](/quality/quality-gates.md)
* [Rollout baseline](/governance/baseline-and-selection.md)

[^S29]: [GitHub Actions secure use](https://docs.github.com/en/actions/reference/security/secure-use).
[^S40]: [Available rules for rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets).
[^S38]: [Supply chain security](https://docs.github.com/en/code-security/concepts/supply-chain-security/supply-chain-security).
