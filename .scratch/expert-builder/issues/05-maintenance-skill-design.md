# 05 — Design the maintenance / refresh skill

Type: grilling
Status: open
Blocked by: 01, 04

## Question

Design the **maintenance skill** bundled into every Expert Pack — the on-demand loop that keeps the Wiki current.

Decide:
- The loop's steps: re-run research → diff against current concepts → update affected files → update provenance/timestamps → log what changed.
- Its inputs: what the Expert or user passes (a topic, a concept, "everything"?) and how scope is bounded so a refresh is affordable.
- How it decides a concept is stale or wrong (relies on provenance from ticket 04).
- Its output/report: what the user sees after a run.
- Self-containment: it must run inside the Pack with no dependency on the mattpocock skills — what research technique does it embed?
- Guardrails: no unverified claims written into the Wiki; every update carries provenance.

Depends on the Wiki structure (04) and OKF conventions (01).
