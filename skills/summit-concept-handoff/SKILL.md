---
name: summit-concept-handoff
description: Hand an approved concept into the VI development pipeline (Concept
  Writer skill). Validates the PROMOTION.md approval block and frozen-set
  integrity, then produces the VI project seed — pre-filled PROJECT.md and
  CONTEXT.md starters under the Summit Agentic Framework's templates. IT authors
  the PRD from the frozen CDR set in most cases. Refuses without machine-readable
  approval. The boundary-crossing step into IT's governed environment.
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
> After this, ownership is IT's: in most cases IT's first act is **authoring the
> PRD** from the frozen CDR set (framework `PRD_TEMPLATE.md`,
> `authored_by_role: "IT"`), then ADRs for the *how*, then the build. Report
> Writers have no role at this stage.

You are a **validator and packager**, not an author. Every word you emit traces
to `PROMOTION.md` or the frozen CDR set.

## 0. Preconditions — refuse loudly, not silently

Run ALL checks before writing anything. Any failure → stop, report exactly what's
missing, and name who can fix it.

1. **Approval block (authoritative, machine-readable).** In
   `concepts/<name>/PROMOTION.md` frontmatter:
   - `status: "Approved"`
   - `approved_by` non-empty
   - `approved_at` non-empty (YYYY-MM-DD)
   - `approval_record` non-empty
   Missing any → **refuse**. The HTML record's approval section is presentation;
   it cannot substitute. Fixer: product / leadership.
2. **Frozen set matches the freeze manifest.** Every CDR in PROMOTION.md §3
   exists in `cdr/` with `status: "Frozen"`, and no Frozen CDR exists that the
   manifest omits. Drift → refuse (the set changed after freeze, or the
   promotion is stale). Fixer: Concept Writer — re-promote.
3. **No `Needs Review` stragglers** in `cdr/`.
4. **PRD-path consistency.**
   - `prd_path: "IT"` → there must be **no** `promotion/PRD.md`. One present →
     refuse (an undeclared exception-path PRD is an unapproved artifact).
   - `prd_path: "Concept Writer"` → `prd_exception_trigger` non-empty, and
     `promotion/PRD.md` exists. Then spot-check every requirement's trace
     (`CDR-NNN:DEC-NNN`): the CDR exists, is `Frozen`, and the DEC item exists.
     Any broken trace, or any Frozen CDR whose DEC statements have no
     requirement and no explicit scope exclusion → **refuse until resolved**.
     Precedence: **frozen CDRs win; the PRD is derived** — the fix is a PRD
     correction, never a CDR edit.

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
├── PRD.md                ← exception path only — the pre-authored, trace-checked PRD
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
- Active Work: **default path** — the frozen CDRs' `DEC-*` statements grouped by
  type, as the raw material for IT's PRD; **exception path** — the PRD
  requirement tables (`REQ-*`, `DAT-*`) as the initial backlog, ids preserved
- Architecture Context: frozen `integration` CDRs listed as **assumptions to
  validate before build**
- Quality Status: `EVD-*` evidence + `poc_baseline` as the acceptance reference

**HANDOFF-MANIFEST.md** — one page:
- Concept name, approval line (who/when/record ref), freeze ref, PRD path
  (+ exception trigger if applicable)
- Artifact inventory with counts (CDRs frozen/superseded; requirements by
  section on the exception path)
- What IT does next: scaffold the project under the Agentic Framework, pull in
  the seeds, **author the PRD from the frozen CDR set** (default path — framework
  `PRD_TEMPLATE.md`, every requirement tracing `CDR-NNN:DEC-NNN`), validate the
  integration assumptions, write ADRs for stack/architecture (constrained by
  `DEPENDENCY-POLICY.md`), build to the success evidence against the POC baseline
- What IT must not do: edit frozen CDRs, treat the POC code as a starting
  codebase (it's a runnable *reference*, throwaway by design)

## 3. Report

- Package path and inventory.
- The PRD path: who authors it and from what.
- Any latitude notes carried from `HND-003` items — the flexibility IT has.
- State plainly: the concept framework's job ends here; from this point the
  project is governed by the Summit Agentic Framework.

## Guardrails
- **No approval, no handoff.** The PROMOTION.md frontmatter approval block is
  the only authority. Never fill or infer it yourself.
- **Frozen CDRs win.** On any conflict (PRD, promotion text, HTML), refuse and
  route to a correction of the derived artifact. Never reconcile by editing a
  frozen record.
- **Respect the declared PRD path.** Never author a PRD during handoff — on the
  default path that's IT's first act; on the exception path it already exists.
- **Seeds, not scaffolds.** You write into `promotion/handoff/`; IT scaffolds
  the actual project. Never write into IT's repos or the Agentic Framework repo.
- **Never prescribe how.** Stack fields stay open; invariants (`HND-002`)
  transfer, implementation latitude (`HND-003`) transfers, nothing else
  constrains IT.
- **Complete or refuse.** A partial handoff package is worse than none — IT
  would trust it as complete.
