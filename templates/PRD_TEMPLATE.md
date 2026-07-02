---
title: "PRD: [Concept Name]"
concept: "[concept-name]"
status: "Draft"                   # Draft | Active | Superseded
date: "YYYY-MM-DD"
authors: "[Name]"
authored_by_role: "IT"            # IT (default — authored after handoff, from the frozen CDR set)
                                  # | Concept Writer (exception — authored pre-handoff; the trigger
                                  #   is recorded in PROMOTION.md `prd_exception_trigger`)
tags: ["prd", "concept"]
frozen_cdrs: 0                    # count of Frozen CDRs this PRD derives from
cdr_freeze_ref: ""                # commit SHA or date the CDR set was frozen at
promotion_ref: "PROMOTION.md"     # the approved promotion this PRD derives from —
                                  # approval lives THERE (machine-readable), never here
poc_baseline: ""                  # repo / live POC link — the runnable reference IT evaluates against
---

# PRD: [Concept Name]

> Forward-looking build spec. Says **what** to build, never **how**.
> **Derived, never authoritative**: every requirement traces to a Concept
> Decision Record statement (`CDR-NNN:DEC-NNN`); on any conflict the frozen
> CDRs win. Authored by **IT in most cases** (after handoff, as the first act
> of development) or by a **Concept Writer by exception** (pre-handoff, when
> the trigger recorded in `PROMOTION.md` applies). Report Writers never author
> PRDs. Architecture, framework, and stack are IT's ADR decisions, constrained
> by the Agentic Framework's `DEPENDENCY-POLICY.md`.

## Status

**Draft** | Active | Superseded

> A PRD needs no approval of its own — it derives from an already-approved
> promotion (`promotion_ref`). It becomes `Active` when its authoring role
> confirms every requirement traces cleanly to the frozen CDR set.

---

## 1. Problem & Outcome

[The user problem, and the outcome that defines "done". One short section.]

---

## 2. Users & Jobs-to-be-Done

[Who uses it and the job they're hiring it for. From the business case.]

| Persona | Job-to-be-done |
|---|---|
| | |

---

## 3. Scope

> Derived from `type: scope` CDRs. An absence from "In Scope" that appears in
> "Out of Scope" is a *decision*, not a gap — listing it stops IT reading it
> as an oversight.

### In Scope

- **SCP-001**: [What's in] — *trace: CDR-NNN:DEC-NNN*
- **SCP-002**: [What's in] — *trace: CDR-NNN:DEC-NNN*

### Out of Scope

- **SCP-101**: [Explicitly out, and deliberately so] — *trace: CDR-NNN:DEC-NNN*
- **SCP-102**: [Explicitly out] — *trace: CDR-NNN:DEC-NNN*

---

## 4. Features & Experience

> Derived from `type: ux` CDRs. One requirement per decision statement.

| ID | Requirement | Trace |
|---|---|---|
| REQ-001 | [What the user sees / does] | CDR-NNN:DEC-NNN |
| REQ-002 | | |

---

## 5. Data Requirements & Constraints

> Derived from `type: data` CDRs — sources, grain, known limits.

| ID | Requirement / Constraint | Trace |
|---|---|---|
| DAT-001 | [Data need or hard constraint] | CDR-NNN:DEC-NNN |
| DAT-002 | | |

---

## 6. Integration & Assumptions

> Derived from `type: integration` CDRs — what must already exist in the
> user's workflow. IT validates each assumption during project setup; a false
> assumption here is a blocker, not a surprise.

| ID | Assumption | Trace |
|---|---|---|
| INT-001 | [Assumed context or system] | CDR-NNN:DEC-NNN |
| INT-002 | | |

---

## 7. Success Criteria

> How IT knows the rebuild matches the validated concept. Evaluate the native
> build against the POC baseline (frontmatter `poc_baseline`).

- **SUC-001**: [Observable criterion — user-facing, testable] — *trace: CDR-NNN:EVD-NNN where applicable*
- **SUC-002**: [Criterion]
- **SUC-003**: [Parity check against POC baseline — which flows must match]

---

## 8. Explicitly Not Specified (IT's Domain)

This PRD deliberately does not specify:

- Architecture, framework, stack, or folder structure — IT records these as
  **ADRs** in the Summit Agentic Framework after handoff
- Library choices — governed by `DEPENDENCY-POLICY.md`
- Internal data model, naming, or types — governed by the project's
  `TYPE_REGISTRY.md` once scaffolded

Where a CDR grants explicit implementation latitude, it is recorded in that
CDR's `HND-003` item.

---

## 9. VI Onboarding Map

> Consumed by `summit-concept-handoff` to seed the Agentic Framework's
> project-context files. Keep the mapping current if sections move.

| This PRD | Seeds |
|---|---|
| §1 Problem & Outcome + frontmatter | `PROJECT.md` → Identity (Name, Description, Status: "Handoff — pre-development") |
| §3 Scope + §4 Features | `CONTEXT.md` → Current Focus + Active Work (initial backlog) |
| §6 Integration & Assumptions | `CONTEXT.md` → Architecture Context (assumptions to validate first) |
| §7 Success Criteria + `poc_baseline` | `CONTEXT.md` → Quality Status (acceptance reference) |

---

## 10. References

- **REF-001**: Frozen CDR set (the why behind each requirement): `cdr/`
- **REF-002**: Approved promotion (business case + machine-readable approval): `PROMOTION.md`
- **REF-003**: POC baseline (runnable reference): [link]
- **REF-004**: Promotion record, rendered (presentation only): `promotion/promotion-record.html`
- **REF-005**: Summit Agentic Framework (governs the receiving project): [repo link]
