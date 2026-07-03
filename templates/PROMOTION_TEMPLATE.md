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
# --- approval block: THE machine-readable source of truth for the whole promotion. ---
# --- summit-concept-handoff refuses unless status is "Approved" AND all three filled. ---
# --- Promotion authority sits with Concept Writers — the approving CW fills this.    ---
# --- Always attributable: name, date, and a record reference, never a verbal OK.     ---
approved_by: ""                   # the Concept Writer granting promotion
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
> Approval authority does not extend to inventing business facts:
> commercialisation and Summit-fit claims are sourced, or marked TBD and flagged.

### Value to Summit

- **VAL-001**: [The value-add argument]

### Who Uses It

- **USR-001**: [Persona — job-to-be-done]

### Summit Fit

- **FIT-001**: [Positioning vs the existing product & service range — sourced, not guessed]

### Commercialisation

- **COM-001**: [Must be sourced from product / commercial. If unavailable:
  `TBD — pending product input` and flag it in §4.]

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

## 4. Flagged Gaps

> Anything marked TBD or unsourced above, listed plainly so the approving
> Concept Writer sees exactly what they are approving around.

- **FLG-001**: [e.g. "Commercialisation TBD — pending product input"]

---

## 5. Downstream (outside this framework)

On handoff, IT owns everything from here: the **PRD** (authored from the frozen
CDR set, under IT's process and the Agentic Framework's ADR standards), the
ADRs, and the build. This promotion places no requirements on that process
beyond the boundary rules: frozen CDRs win any conflict with derived artifacts,
and frozen records are never edited.

---

## 6. References

- **REF-001**: Frozen CDR set: `cdr/`
- **REF-002**: Accepted submission: `SUBMISSION.md`
- **REF-003**: POC baseline (runnable reference): [link]
- **REF-004**: Rendered approval package: `promotion/promotion-record.html`
