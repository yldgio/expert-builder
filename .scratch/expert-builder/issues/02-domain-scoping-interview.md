# 02 — Design the domain-scoping interview

Type: grilling
Status: open
Blocked by: —

## Question

Design the **interview** the Expert Builder runs at invocation — the grilling-style, breadth-then-depth conversation that turns the user's first sentence about a domain into a precise, bounded scope.

Decide:
- The opening move: what the builder does with the user's initial domain seed (if any) vs. a cold start.
- The question strategy: how it grills like `grilling` (rounds, recommended answers) while staying **inlined** (no dependency on the grilling skill).
- What it must pin before scaffolding: the domain **boundary** (in/out of scope), the intended Expert's audience and tasks, known **design problems** to solve up front, and success criteria for "expert enough".
- The output artifact of the interview: a domain brief / charter that drives scaffolding — its shape and where it lands in the Pack.
- Stop condition: when the interview is "done enough" to start building.

This is the heart of the builder; its output feeds the AGENTS.md template and the research bootstrap.
