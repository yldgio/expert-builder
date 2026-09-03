# Security Policy

## Reporting a vulnerability

If you discover a security issue, please **do not open a public issue**. Instead,
report it privately using GitHub's [private vulnerability reporting](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing-information-about-vulnerabilities/privately-reporting-a-security-vulnerability)
("Report a vulnerability" under the repository's **Security** tab).

We will acknowledge your report as soon as possible and keep you informed of the
progress toward a fix.

## Scope

This repository contains documentation and a Copilot CLI skill (markdown and
templates). It ships **no runtime secrets**.

- The Expert Builder skill and the generated Expert Packs never write credentials
  into files. Any `.mcp.json` emitted for a Pack uses **placeholders** only.
- If you find a secret, token, or credential committed anywhere in this repo,
  treat it as a security issue and report it as described above.

Please do not commit real credentials when contributing. Use placeholders and
rely on your harness's own authentication.
