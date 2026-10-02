# Contributing to Expert Builder

Thanks for your interest in improving Expert Builder. This repository is
primarily documentation- and skill-based (Markdown, templates, and a sample
Expert Pack). The `tools/wiki-mcp/` package also has a Node.js build and test
toolchain; see the [Wiki MCP bundle refresh instructions](README.md#refresh-the-vendored-wiki-mcp-bundle)
when changing it.

## Ground rules

- **Write everything in English** — code, comments, docs, and commit messages.
- **No unverified technical claims.** Only describe how a technology, SDK, or
  tool works when you can cite the source, official documentation, or verified
  output. Label assumptions as assumptions.
- **Simplicity first.** Prefer the smallest change that solves the problem.
- **Surgical changes.** Every changed line should trace to the stated goal;
  leave unrelated code and formatting untouched.
- **Keep the docs current.** If your change affects behavior, update the
  affected `README.md`, `CONTEXT.md`, or skill files in the same pull request.

## Project layout

See the [Repository layout](README.md#repository-layout) section of the README
for what lives where. The two files you will most often touch:

- `.agents/skills/expert-builder/` — the Expert Builder skill and its assets.
- `CONTEXT.md` — the project glossary. Use its vocabulary and avoid the listed
  synonyms; if a concept is missing, that is a signal to add it.

## Workflow

1. **Fork** the repository and create a branch from `main`:
   `git checkout -b feat/<short-slug>` or `fix/<short-slug>`.
2. **Make your change**, keeping it focused on a single concern.
3. **Use the project's terminology** as defined in [`CONTEXT.md`](CONTEXT.md).
4. **Commit** using [Conventional Commits](https://www.conventionalcommits.org/)
   (for example `feat: ...`, `fix: ...`, `docs: ...`, `chore: ...`).
5. **Open a pull request** against `main` with a clear description of the change
   and its motivation. Fill in the pull request template.

## Reporting issues

Use the issue templates under the **Issues** tab. For security-sensitive
reports, follow [`SECURITY.md`](SECURITY.md) instead of opening a public issue.

## Code of Conduct

By participating, you agree to abide by our
[Code of Conduct](CODE_OF_CONDUCT.md).
