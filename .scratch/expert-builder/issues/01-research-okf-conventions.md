# 01 — Research: pin OKF v0.1 conventions

Type: research
Status: open
Blocked by: —

## Question

Pin the exact **Open Knowledge Format (OKF) v0.1** conventions we must follow for the Expert Pack Wiki, from primary sources (the OKF spec / repo and the Google Cloud announcement).

Resolve specifically:
- The full YAML frontmatter schema: required vs optional fields, allowed values for `type`, and the meaning of `resource`, `tags`, `timestamp`.
- Directory/bundle conventions: is there a reserved index file, a manifest, a log file? How is a concept's identity derived from its file path?
- Cross-linking convention between concepts.
- Any versioning field for the bundle itself.
- Where the canonical spec lives (URL/repo) so the Pack can cite it as provenance.

Capture findings on a throwaway `research/okf-conventions` branch with a context pointer from this ticket. This unblocks the Wiki-structure decision.
