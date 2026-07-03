---
name: summit-concept-handoff
description: Hand an approved concept into the VI development pipeline (Concept
  Writer skill). Validates the PROMOTION.md approval block and frozen-set
  integrity, then produces the VI project seed — pre-filled PROJECT.md and
  CONTEXT.md starters under the Summit Agentic Framework's templates. Refuses
  without machine-readable approval. The boundary-crossing step into IT's
  governed environment; everything downstream (PRD, ADRs, build) is IT's.
allowed-tools:
  - Read
  - Write
  - Bash
  - Grep
  - Glob
---

# Handoff to VI Development

You cross the boundary: an approved concept leaves the Concept Writers' world and
enters IT's governed VI environment. Your output is the **VI project seed** — the
starting `PROJECT.md` and `CONTEXT.md` for a new development project under the
Summit Agentic Framework, pre-filled from the promotion so IT starts with the
concept's full context loaded, not a blank template.

> **Roles.** This is a **Concept Writer** skill — the last one in the pipeline.
> After this, ownership is IT's, and IT's process is **outside this framework**:
> IT authors the **PRD** from the frozen CDR set under its own standards —
> downstream of the requirements defined by the Agentic Framework's ADRs — then
> writes ADRs for the *how*, then builds. Report Writers have no role at this
> stage, and this skill places no process requirements on IT beyond the
> boundary rules in the guardrails.

You are a **validator and packager**, not an author. Every word you emit traces
to `PROMOTION.md` or the frozen CDR set.

## 0. Preconditions — refuse loudly, not silently

Run ALL checks before writing anything. Any failure → stop, report exactly what's
missing, and name who can fix it.

1. **Approval block (authoritative, machine-readable).** In
   `concepts/<name>/PROMOTION.md` frontmatter:
   - `status: "Approved"`
   - `approved_by` non-empty (the approving Concept Writer)
   - `approved_at` non-empty (YYYY-MM-DD)
   - `approval_record` non-empty
   Missing any → **refuse**. The HTML record's approval section is presentation;
   it cannot substitute. Fixer: a Concept Writer, via `summit-concept-promote`.
2. **Frozen set matches the freeze manifest.** Every CDR in PROMOTION.md §3
   exists in `cdr/` with `status: "Frozen"`, and no Frozen CDR exists that the
   manifest omits. Drift → refuse (the set changed after freeze, or the
   promotion is stale). Fixer: Concept Writer — re-promote.
3. **No `Needs Review` stragglers** in `cdr/`.
4. **No PRD in the package.** A `promotion/PRD.md` or similar must not exist —
   the PRD is IT's downstream artifact, and a pre-authored one is an
   out-of-framework artifact that would blur ownership. Present → refuse and
   name it for removal.

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
├── PROJECT.seed.md       ← Agentic Framework PROJECT_TEMPLATE, pre-filled where possible
├── CONTEXT.seed.md       ← Agentic Framework CONTEXT_TEMPLATE, pre-filled
├── PROMOTION.md          ← copy — the approved promotion (business case + approval)
├── cdr/                  ← copy of the frozen CDR set + superseded trail (read-only reference)
└── HANDOFF-MANIFEST.md   ← what's in the package, provenance, and what IT does next
```

**PROJECT.seed.md** — fill from PROMOTION.md:
- Identity: Project Name, Description (from §1 Concept Summary), Status
  (`Handoff — pre-development`), Azure DevOps Repo (leave blank for IT)
- Backend/Frontend Stack: **leave as N/A-to-be-decided** — stack is IT's ADR
  call. Never pre-select a framework.
- Non-Negotiable Rules: carry over each frozen CDR's `HND-002` ("what IT must
  preserve") — these are the concept invariants; violating one means building a
  different product.

**CONTEXT.seed.md** — fill:
- Current Status: `Handoff received — pending project scaffold`, Current Focus
  from PROMOTION.md §1
- Active Work: the frozen CDRs' `DEC-*` statements grouped by requirement area
  (from each record's `type` / `HND-001`) — the raw material IT's PRD derives
  requirements from, ids preserved for `CDR-NNN:DEC-NNN` tracing
- Architecture Context: frozen `integration` CDRs listed as **assumptions to
  validate before build**
- Quality Status: `EVD-*` evidence + `poc_baseline` as the acceptance reference

**HANDOFF-MANIFEST.md** — one page:
- Concept name, approval line (approving CW / date / record ref), freeze ref
- Artifact inventory with counts (CDRs frozen/superseded, DEC statements by
  requirement area)
- What IT does next — **IT's process, outside this framework**: scaffold the
  project under the Agentic Framework, pull in the seeds, author the PRD from
  the frozen CDR set (tracing requirements to `CDR-NNN:DEC-NNN` preserves the
  provenance chain), validate the integration assumptions, write ADRs for
  stack/architecture (constrained by `DEPENDENCY-POLICY.md`), build to the
  success evidence against the POC baseline
- Boundary rules IT inherits: frozen CDRs are never edited and win any conflict
  with derived artifacts; the POC code is a runnable *reference*, throwaway by
  design — never a starting codebase

## 3. Report

- Package path and inventory.
- Any latitude notes carried from `HND-003` items — the flexibility IT has.
- State plainly: the concept framework's job ends here. The PRD, the ADRs, and
  the build are IT's process under the Summit Agentic Framework.

## Guardrails
- **No approval, no handoff.** The PROMOTION.md frontmatter approval block is
  the only authority. Never fill or infer it yourself.
- **Frozen CDRs win.** On any conflict (promotion text, HTML, downstream
  artifacts), refuse and route to a correction of the derived artifact. Never
  reconcile by editing a frozen record.
- **Never author a PRD — and never package one.** The PRD sits outside this
  framework; IT owns that process end to end.
- **Seeds, not scaffolds.** You write into `promotion/handoff/`; IT scaffolds
  the actual project. Never write into IT's repos or the Agentic Framework repo.
- **Never prescribe how.** Stack fields stay open; invariants (`HND-002`)
  transfer, implementation latitude (`HND-003`) transfers, nothing else
  constrains IT.
- **Complete or refuse.** A partial handoff package is worse than none — IT
  would trust it as complete.
