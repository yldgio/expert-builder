# 07 — Design the Expert AGENTS.md template

Type: grilling
Status: open
Blocked by: 02, 04

## Question

Design the **specialized `AGENTS.md`** template the builder writes into every Pack — the system instructions that make the running Expert behave as a domain expert.

Decide:
- The sections: the Expert's role/persona, the domain boundary (from the interview, ticket 02), how and when to consult the Wiki, when to run the maintenance skill, and behavioral guardrails (no unverified claims, cite the Wiki).
- How it points at the Wiki (OKF bundle) so the Expert reads before answering.
- What is templated vs. filled from the interview brief.
- How it stays harness-agnostic while validated on Copilot CLI.
- Its relationship to the README (launch instructions).

Depends on the interview output (02) and Wiki structure (04).
