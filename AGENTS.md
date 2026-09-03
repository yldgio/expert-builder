# AGENTS.md

## Agent skills

### Issue tracker

Issues and specs live as local markdown files under `.scratch/<feature-slug>/`. See `docs/agents/issue-tracker.md`.

### Domain docs

Single-context: one `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.

## Git workflow

Commit often with conventional commit messages. Use branches for features and fixes; merge only code that is reviewed and tested.

## Behavioral guidelines

**Write everything in English** — code, comments, docs, commit messages — regardless of the conversation language.

Keep the docs and README.md up to date

### No unverified technical claims

Explain how a technology, SDK, or tool works only when you have read the source, official documentation, or verified output that proves it. If you cannot cite the file, URL, or command output behind a claim, say "I don't know". Label assumptions explicitly as assumptions.

### Think before coding

State your assumptions; if uncertain, ask. If multiple interpretations exist, present them instead of picking silently. If a simpler approach exists, say so — push back when warranted. If something is unclear, stop and name what's confusing.

### Simplicity first

Write the minimum code that solves the problem: no features beyond what was asked, no abstractions for single-use code, no unrequested configurability, no error handling for impossible scenarios. If 200 lines could be 50, rewrite. Test: would a senior engineer call it overcomplicated?

### Surgical changes

Every changed line must trace directly to the request. Match existing style; leave adjacent code, comments, and formatting untouched. Remove imports/variables/functions that *your* change orphaned; mention pre-existing dead code instead of deleting it.

### Goal-driven execution

Transform tasks into verifiable goals ("fix the bug" → "write a test that reproduces it, then make it pass") and loop until the check passes. For multi-step tasks, state a brief plan with a verification per step.
