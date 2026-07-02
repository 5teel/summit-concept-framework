---
name: summit-concept-harvest
description: Retrospectively distil settled concept decisions into Concept Decision
  Records (CDRs). Run at natural breakpoints during POC development. Proposes
  candidates from the diff since the last harvest; the writer curates. Never
  auto-writes without confirmation. Part of the Summit Concept Framework.
---

# Harvest CDRs

You surface decisions that have **settled** since the last harvest and propose them
as CDRs. You do not invent decisions, and you do not capture churn. The writer
curates your proposals; you only write files they confirm.

## 1. Establish the window
- Read `concepts/<name>/cdr/.harvest` for `last_harvest_commit`. If none, use the
  repo's first commit. If multiple concept tracks exist and none was named, ask which.
- Diff working state against that ref: `git log` + `git diff` since the ref.
- Read `NOTES.md` (if present) and the existing `cdr/CDR-*.md` set so you don't
  re-propose what's already recorded and so you can detect supersessions.

## 2. Identify candidate decisions
From the diff and notes, find decisions that meet ALL of:
- **Settled** — the relevant code/UX has stabilised, not still churning across commits.
- **Concept-level** — a user-visible choice, not an implementation detail. Roll
  clusters of micro-changes into one concept (e.g. all of a results view = one CDR).
- **Load-bearing** — passes the filter: *would IT build a different product without
  knowing this?* If no, drop it.

Discard aggressively. Most early decisions don't survive — that's expected. A typical
harvest yields a handful, sometimes zero.

## 3. Classify and check against existing CDRs
For each candidate:
- Assign `type`: ux | scope | data | integration (dominant one; don't split).
- Draft the **coded items** the template requires:
  - `DEC-*` — atomic decision statements (these are what the PRD will trace to;
    one statement per user-observable commitment)
  - `EVD-*` — evidence it settled (iterations survived, demo feedback, usage)
  - `ALT-*` — the rejected alternative(s) and why
  - `IMP-*` — impact on the user's workflow
  - `HND-*` — handoff notes: which PRD section it feeds (from `type`), what IT
    must preserve, what IT may vary
- If it reverses an existing `Active` CDR, propose marking that one `Superseded`
  and linking the pair (`supersedes` / `superseded_by`).
- Infer rationale and the rejected alternative from the evidence. Mark anything you
  inferred rather than read directly, so the writer can correct it — this is the
  step where they supply the "why" that wasn't known earlier.

## 4. Present for curation — do not write yet
Show a compact table:

| # | Proposed title | type | key DEC statements | basis (commit/note) | inferred why |
|---|----------------|------|--------------------|---------------------|--------------|

Then ask the writer to **confirm / edit / discard** per row. For supersessions, show
the old→new pair explicitly.

## 5. Write confirmed CDRs
- Create `cdr/CDR-NNN-slug.md` from the framework's `templates/CDR_TEMPLATE.md`
  for each confirmed candidate, continuing the sequence.
- Confirmed-by-writer records get `status: "Active"`. Anything the writer accepted
  but wants to revisit gets `status: "Needs Review"` — it cannot reach promotion
  until confirmed.
- Apply confirmed supersessions to existing files (status flip + cross-links only —
  never rewrite their content).
- Clear the NOTES.md lines you consumed; leave the rest.
- Update `cdr/.harvest` with the current commit SHA and date.
- Report: N written, M superseded, K discarded.

## Guardrails
- Never write a CDR the writer didn't confirm.
- Never capture a decision that's still actively changing — defer it to the next harvest.
- If a candidate has no rejected alternative, it's not a decision — drop it.
- Never touch a `Frozen` CDR. If new evidence contradicts one, that's a
  post-promotion change — flag it; it needs a new promotion cycle, not an edit.
- CDRs record **what and why**, never **how** — no stack, framework, or
  architecture prescriptions. Those are IT's ADRs after handoff.
