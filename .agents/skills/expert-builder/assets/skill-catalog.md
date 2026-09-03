# Skill catalog

Known repositories to search first when discovering candidate **Domain skills** for a Pack. Search
these before general web/GitHub search; if the `find-skills` skill is installed, use it too. This
list is a starting point, not exhaustive — extend it as new sources prove useful.

## Discovery rules

- **Reuse, never author.** Find an existing skill that fits the task; do not write a domain skill from
  scratch.
- **Vendor with provenance.** Copy a matched skill into the Pack's `.agents/skills/` and record its
  source repo and license.
- **Permissive licenses only.** Vendor a skill only when its license is clearly permissive (e.g. MIT,
  Apache-2.0, BSD). Skip anything unlicensed or ambiguous and surface it to the user.
- **No match → log a gap.** Record the unmet task in the brief's Gaps section and ask the user whether
  they can supply one. Do not fabricate a skill.

## Known repositories

- `mattpocock/skills` — engineering and productivity skills (the base convention this ecosystem
  follows).
- `anthropics/skills` — reference/example skills.
- `github/awesome-copilot` — curated Copilot customizations and skills.

<!-- Add entries as `- <owner>/<repo> — <what it offers>`. Verify the license before vendoring. -->
