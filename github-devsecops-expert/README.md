# GitHub DevSecOps Advisor

This Expert Pack supports enterprise decisions about GitHub licensing, pricing, security tooling, code quality, and automation. Its Wiki contains 10 initial concepts and the bundled `refresh` skill maintains them on request.

**In scope:** GitHub.com plans with Enterprise Cloud as the primary context; relevant, version-specific Enterprise Server differences; SAST; SCA/SBOM; DAST; code quality; GitHub-oriented automation and governance; selected commercial and open-source alternatives.

**Out of scope:** Equal-depth coverage of other DevOps platforms, private account data and contracts, binding legal or negotiated-price advice, offensive exploitation, running scans, and autonomous changes to repositories or deployed systems.

The [Domain Brief](brief.md) defines the scope and acceptance criteria. [AGENTS.md](AGENTS.md) defines the evidence, writing, access, and maintenance rules.

## Contents

| Artifact | Purpose |
| --- | --- |
| [brief.md](brief.md) | Human-approved scope, audience, tasks, writing rules, and gaps |
| [AGENTS.md](AGENTS.md) | Expert instructions and public-only access boundary |
| [wiki/index.md](wiki/index.md) | OKF v0.2 concept catalog and unseeded topics |
| [wiki/log.md](wiki/log.md) | Creation, seeding, and maintenance history |
| [.agents/skills/refresh/SKILL.md](.agents/skills/refresh/SKILL.md) | Bundled maintenance procedure, copied without modification |

## Initial Wiki

| Topic | Concept |
| --- | --- |
| Terminology | [DevSecOps glossary](wiki/foundations/glossary.md) |
| Plans and deployment | [GitHub plans and eligibility](wiki/commercial/github-plans.md) |
| Security licensing | [Security products and pricing](wiki/commercial/security-products.md) |
| Automation costs | [GitHub Actions cost model](wiki/commercial/actions-cost-model.md) |
| SAST | [Code scanning and alternatives](wiki/sast/code-scanning.md) |
| SCA and SBOM | [Dependency analysis and inventory](wiki/supply-chain/sca-sbom.md) |
| DAST | [External testing integration](wiki/dast/external-testing.md) |
| Code quality | [Quality gates](wiki/quality/quality-gates.md) |
| Automation | [Workflow security](wiki/automation/workflow-security.md) |
| Governance | [Selection matrix and rollout baseline](wiki/governance/baseline-and-selection.md) |

Each concept records its sources, machine verification event, and staleness threshold. These events do not constitute human review of technical facts. Unseeded follow-up topics appear in both the index and the Domain Brief.

## Launch with Copilot CLI

From the directory containing the Pack:

```powershell
Set-Location .\github-devsecops-expert
copilot
```

The Pack uses Copilot CLI's built-in `github-mcp-server`, with read-only tools enabled by default. No additional MCP server or PAT setup is required by this Pack; the host's normal authentication requirements still apply.[^mcp-install]

Confirm folder trust when the CLI requests it. The Expert uses the Pack instructions and public-source policy. Do not request account listings, private repositories, or billing records.

## GitHub MCP access

Reuse the GitHub MCP connection provided by the host. In Copilot CLI, inspect the built-in server from the launched session:

```text
/mcp show github-mcp-server
```

Use only read operations on confirmed public resources. Read-only access limits operations, not repository visibility; broader host permissions do not authorize private-resource queries.[^mcp-scopes]

Other harnesses should reuse their existing GitHub MCP connection. This Pack does not bundle server definitions or credentials. If MCP is unavailable, report the failure and use public web retrieval of the same official source as permitted by [AGENTS.md](AGENTS.md); do not automatically add another server.

## Answer and freshness rules

Answers use English and a technical, concise register. They identify scope, prerequisites, assumptions, source-backed facts, recommendations, and expected outputs. Recommendations are justified by supplied requirements, tooling constraints, and dependencies.

| Knowledge category | Staleness threshold | Additional rule |
| --- | --- | --- |
| Licensing, pricing, paid-feature eligibility | 7 days | Re-check official commercial sources for every relevant answer |
| Product capabilities and implementation behavior | 30 days | Re-check earlier when the relevant version or source changes |
| Foundational terminology and standards | 90 days | Re-check earlier when the applicable specification changes |

These thresholds do not install a scheduled task. If live commercial verification fails, the Expert reports that the current licensing or price is unknown. Cached prices are dated historical information, not a current quote.

Mixed concepts that include commercial or component-license terms use the shorter 7-day threshold. The concept's frontmatter supplies its actual `stale_after`.

## Maintenance

Invoke the bundled skill in the launched session:

```text
/refresh targeted commercial/security-products
/refresh stale-sweep
/refresh full
```

If a harness does not expose skills as slash commands, ask it to run the procedure in [.agents/skills/refresh/SKILL.md](.agents/skills/refresh/SKILL.md).

The procedure re-fetches sources, updates changed claims, records verification, recomputes staleness, and appends a log entry. A new concept also updates the index and removes the corresponding gap. Unreachable sources are flagged rather than replaced with assumptions.

Source checks for an answer are read-only. Wiki edits require approval unless the user has explicitly granted standing maintenance permission. Scope, audience, writing rules, and success criteria remain human-decided.

## Acceptance questions

- Identify the plan and security-product prerequisites for private repositories on GitHub.com; state Enterprise Server caveats separately.
- Estimate security and Actions costs from supplied billing quantities and runner usage; show current official sources, formulas, allowances, and unknowns.
- Compare documented native SAST/SCA/SBOM coverage with selected alternatives; separate an engine's open-source license from a hosted subscription.
- Define a DAST stage with an authorized target, authentication assumptions, scan type, evidence output, and measurable gate.
- Compare code-quality options by documented metrics, pull request integration, availability, and commercial prerequisites.
- Propose a rollout with repository cohort, language/build coverage, exceptions, owners, and phase exit criteria.

## Build verification

The initial seed was checked on 2026-10-01: 10 concepts, 40 primary documents, 83 source-footnote definitions, and 9 mirrored follow-up topics.

Offline checks passed for core files, OKF v0.2 profile metadata, explicit-offset timestamps, actor/verification events, freshness intervals, row-level citations, source/footnote reciprocity, local links, gap consistency, and the unchanged `refresh` copy. Selected regression checks covered pricing units, Actions effective-date reconciliation and arithmetic, Code Quality GA versus preview rules, SBOM API states, and ZAP exit-code classifications.

Copilot CLI 1.0.90-2 instruction discovery identified the Pack's `AGENTS.md`. The Pack reuses the built-in GitHub MCP connection and has no Pack-specific server configuration or credential setup. Customer product enablement is not tested by these offline checks.

## MCP references

[^mcp-install]: GitHub MCP Server, [Install in Copilot CLI](https://github.com/github/github-mcp-server/blob/main/docs/installation-guides/install-copilot-cli.md), read during this build.
[^mcp-scopes]: GitHub MCP Server, [PAT scope filtering](https://github.com/github/github-mcp-server/blob/main/docs/scope-filtering.md), including public repository access and API permission enforcement.
