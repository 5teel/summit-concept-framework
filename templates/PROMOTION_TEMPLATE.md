---
title: "Promotion: [Concept Name]"
concept: "[concept-name]"
status: "Ready for Approval"      # Draft | Ready for Approval | Approved | Rejected
date: "YYYY-MM-DD"
concept_writer: "[Concept Writer name]"
report_writer: "[Report Writer name]"
tags: ["concept", "promotion"]
frozen_cdrs: 0                    # count of Frozen CDRs in the manifest below
cdr_freeze_ref: ""                # commit SHA or date the CDR set was frozen at
poc_baseline: ""                  # repo / live POC link — the runnable reference
prd_path: "IT"                    # IT (default — IT authors the PRD after handoff)
                                  # | Concept Writer (exception — PRD authored pre-handoff)
prd_exception_trigger: ""         # required if prd_path is "Concept Writer":
                                  # who requested it (product / leadership / IT) and why
# --- approval block: THE machine-readable source of truth for the whole promotion. ---
# --- summit-concept-handoff refuses unless status is "Approved" AND all three filled. ---
# --- Filled by product / leadership — never by the Concept Writer who packaged this. ---
approved_by: ""                   # who granted promotion (product / leadership)
approved_at: ""                   # YYYY-MM-DD
approval_record: ""               # link/ref to approval evidence (thread, ticket, sign-off)
---

# Promotion: [Concept Name]

> The machine-readable promotion document. The HTML promotion record is
> **rendered from this file** — presentation only, never the authority.
> Frozen CDRs remain the source of truth for concept decisions; this document
> carries the business case, the freeze manifest, and the approval.

## Status

Draft | **Ready for Approval** | Approved | Rejected

---

## 1. Concept Summary

[One paragraph: the problem, the validated concept, the outcome. From the
accepted SUBMISSION.md, updated with what the build proved.]

---

## 2. Business Case

> Gathered from the Report Writer and product — never invented by the packager.

### Value to Summit

- **VAL-001**: [The value-add argument]

### Who Uses It

- **USR-001**: [Persona — job-to-be-done]

### Summit Fit

- **FIT-001**: [Positioning vs the existing product & service range — sourced, not guessed]

### Commercialisation

- **COM-001**: [Must be sourced from product / commercial. If unavailable:
  `TBD — pending product input` and flag it in the promotion report.]

---

## 3. Freeze Manifest

> The immutable spec. `summit-concept-handoff` validates the actual `cdr/`
> directory against this list — drift refuses the handoff.

| CDR | Title | Type |
|---|---|---|
| CDR-001 | | |

Superseded trail retained in `cdr/` (reasoning history — not part of the spec,
never deleted).

---

## 4. PRD Path

**Path:** `IT` *(default)* | `Concept Writer` *(exception)*

- **Default (`IT`)**: the handoff package carries the frozen CDR set only. IT
  authors the PRD from it (framework `PRD_TEMPLATE.md`) as the first act of
  development.
- **Exception (`Concept Writer`)**: the PRD is authored before handoff and
  included in the package. Requires `prd_exception_trigger` in frontmatter —
  who asked for it and why. The PRD remains *derived*: frozen CDRs win any
  conflict.

---

## 5. Flagged Gaps

> Anything marked TBD or unsourced above, listed plainly so approvers see it.

- **FLG-001**: [e.g. "Commercialisation TBD — pending product input"]

---

## 6. References

- **REF-001**: Frozen CDR set: `cdr/`
- **REF-002**: Accepted submission: `SUBMISSION.md`
- **REF-003**: POC baseline (runnable reference): [link]
- **REF-004**: Rendered approval package: `promotion/promotion-record.html`
- **REF-005**: PRD *(exception path only)*: `promotion/PRD.md`
