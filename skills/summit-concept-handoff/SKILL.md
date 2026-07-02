---
name: summit-concept-handoff
description: Hand an approved concept into the VI development pipeline. Validates
  the approval block and PRD-vs-CDR consistency, then produces the VI project seed —
  pre-filled PROJECT.md and CONTEXT.md starters under the Summit Agentic Framework's
  templates. Refuses without machine-readable approval. Part of the Summit Concept
  Framework; the boundary-crossing step into IT's governed environment.
allowed-tools:
  - Read
  - Write
  - Bash
  - Grep
  - Glob
---

# Handoff to VI Development

You cross the boundary: an approved concept leaves the Report Writers' world and
enters IT's governed VI environment. Your output is the **VI project seed** — the
starting `PROJECT.md` and `CONTEXT.md` for a new development project under the
Summit Agentic Framework, pre-filled from the PRD so IT starts with the concept's
full context loaded, not a blank template.

You are a **validator and packager**, not an author. Every word you emit traces to
the PRD or the frozen CDR set.

## 0. Preconditions — refuse loudly, not silently

Run ALL checks before writing anything. Any failure → stop, report exactly what's
missing, and name who can fix it.

1. **Approval block (authoritative, machine-readable).** In `promotion/PRD.md`
   frontmatter:
   - `status: "Approved"`
   - `approved_by` non-empty
   - `approved_at` non-empty (YYYY-MM-DD)
   - `approval_record` non-empty
   Missing any → **refuse**. The HTML record's approval section is presentation;
   it cannot substitute.
2. **Frozen set exists.** `frozen_cdrs` count in the PRD matches the actual number
   of `status: "Frozen"` CDR files. Mismatch → refuse (the set changed after
   freeze, or the PRD is stale).
3. **PRD ↔ CDR consistency.** Spot-check every PRD requirement's trace
   (`CDR-NNN:DEC-NNN`): the CDR exists, is `Frozen`, and the DEC item exists. Any
   requirement whose trace is broken, or any Frozen CDR whose DEC statements have
   no PRD requirement and no explicit scope exclusion → **refuse until resolved**.
   Precedence when content conflicts: **frozen CDRs win; the PRD is derived** —
   the fix is a PRD correction and re-approval, never a CDR edit.
4. **No `Needs Review` stragglers** in the frozen set.

## 1. Locate the Agentic Framework templates

The receiving project is governed by the **Summit Agentic Framework**
(junction-linked shared repo). Resolve its `project-context/` templates:
`PROJECT_TEMPLATE.md`, `CONTEXT_TEMPLATE.md`. If the framework repo isn't
reachable, ask for its path — do not improvise a different structure.

## 2. Produce the VI project seed

Write to `promotion/handoff/` (never into IT's repos directly — IT pulls the seed
into the new project when they scaffold it):

```
promotion/handoff/
├── PROJECT.seed.md       ← Agentic Framework PROJECT_TEMPLATE, pre-filled where the PRD can
├── CONTEXT.seed.md       ← Agentic Framework CONTEXT_TEMPLATE, pre-filled
├── cdr/                  ← copy of the frozen CDR set + superseded trail (read-only reference)
└── HANDOFF-MANIFEST.md   ← what's in the package, provenance, and what IT does next
```

**PROJECT.seed.md** — fill from the PRD's VI Onboarding Map (§9):
- Identity: Project Name, Description (from §1 Problem & Outcome), Status
  (`Handoff — pre-development`), Azure DevOps Repo (leave blank for IT)
- Backend/Frontend Stack: **leave as N/A-to-be-decided** — stack is IT's ADR
  call. Never pre-select a framework.
- Non-Negotiable Rules: carry over each frozen CDR's `HND-002` ("what IT must
  preserve") — these are the concept invariants; violating one means building a
  different product.

**CONTEXT.seed.md** — fill:
- Current Status: `Handoff received — pending project scaffold`, Current Focus
  from PRD §1
- Active Work: the PRD requirement tables (`REQ-*`, `DAT-*`) as the initial
  backlog, ids preserved
- Architecture Context: PRD §6 integration assumptions (`INT-*`) listed as
  **assumptions to validate before build**
- Quality Status: PRD §7 success criteria (`SUC-*`) + `poc_baseline` as the
  acceptance reference

**HANDOFF-MANIFEST.md** — one page:
- Concept name, approval line (who/when/record ref), freeze ref
- Artifact inventory with counts (CDRs frozen/superseded, requirements by section)
- What IT does next: scaffold the project under the Agentic Framework, pull in the
  seeds, validate `INT-*` assumptions, write ADRs for stack/architecture
  (constrained by `DEPENDENCY-POLICY.md`), build to `SUC-*` against the POC baseline
- What IT must not do: edit frozen CDRs, treat the POC code as a starting codebase
  (it's a runnable *reference*, throwaway by design)

## 3. Report

- Package path and inventory.
- Any latitude notes carried from `HND-003` items — the flexibility IT has.
- State plainly: the concept framework's job ends here; from this point the
  project is governed by the Summit Agentic Framework.

## Guardrails
- **No approval, no handoff.** The frontmatter approval block is the only
  authority. Never fill or infer it yourself.
- **Frozen CDRs win.** On any PRD/CDR conflict, refuse and route to a PRD
  correction + re-approval. Never reconcile by editing a frozen record.
- **Seeds, not scaffolds.** You write `*.seed.md` files into `promotion/handoff/`;
  IT scaffolds the actual project. Never write into IT's repos or the Agentic
  Framework repo.
- **Never prescribe how.** Stack fields stay open; invariants (`HND-002`) transfer,
  implementation latitude (`HND-003`) transfers, nothing else constrains IT.
- **Complete or refuse.** A partial handoff package is worse than none — IT would
  trust it as complete.
