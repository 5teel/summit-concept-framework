---
title: "Promotion: [Concept Name]"
concept: "[concept-name]"
status: "Promoted"                # Draft | Promoted
date: "YYYY-MM-DD"
strategist: "[Strategist name]"
concept_writer: "[Concept Writer name]"
tags: ["concept", "promotion"]
frozen_cdrs: 0                    # count of Frozen CDRs in the manifest below
cdr_freeze_ref: ""                # commit SHA or date the CDR set was frozen at
poc_baseline: ""                  # repo / live POC link — the runnable reference
# --- optional 'agreed' note (informational). Approval & prioritisation are ---
# --- cultural — team consensus in meetings. summit-cdr does NOT gate handoff on this. ---
# --- Fill it only if the team wants the go-ahead recorded; leave blank otherwise.    ---
agreed_by: ""                     # who noted the team consensus (a Strategist)
agreed_at: ""                     # YYYY-MM-DD
agreed_context: ""                # optional: where it was agreed (meeting, thread)
---

# Promotion: [Concept Name]

> The machine-readable promotion document. The HTML promotion record is
> **rendered from this file** — presentation only, never the authority.
> Frozen CDRs remain the source of truth for concept decisions; this document
> carries the business case and the freeze manifest.

## Status

Draft | **Promoted**

---

## 1. Concept Summary

[One paragraph: the problem, the validated concept, the outcome. From the
accepted SUBMISSION.md, updated with what the build proved.]

---

## 2. Business Case

> Gathered from the Concept Writer and product — never invented by the packager.
> The packager does not invent business facts:
> commercialisation and Summit-fit claims are sourced, or marked TBD and flagged.

### Value to Summit

[The value-add argument.]

### Who Uses It

[Persona — job-to-be-done.]

### Summit Fit

[Positioning vs the existing product & service range — sourced, not guessed.]

### Commercialisation

[Must be sourced from product / commercial. If unavailable:
`TBD — pending product input` and flag it in §4.]

---

## 3. Freeze Manifest

> The immutable spec. `summit-cdr` validates the actual `cdr/`
> directory against this list — drift refuses the handoff.

| CDR | Title | Type |
|---|---|---|
| CDR-001 | | |

Superseded trail retained in `cdr/` (reasoning history — not part of the spec,
never deleted).

---

## 4. Flagged Gaps

> Anything marked TBD or unsourced above, listed plainly so the team sees
> exactly what's still outstanding.

- [e.g. "Commercialisation TBD — pending product input"]

---

## 5. Downstream (outside this framework)

On handoff, the Agentic Engineers own everything from here: the **PRD** (authored from the frozen
CDR set, under their process and the Agentic Framework's ADR standards), the
ADRs, and the build. This promotion places no requirements on that process
beyond the boundary rules: frozen CDRs win any conflict with derived artifacts,
and frozen records are never edited.

---

## 6. References

- Frozen CDR set: `cdr/`
- Submission: `SUBMISSION.md`
- POC baseline (runnable reference): [link]
- Rendered promotion record: `promotion/promotion-record.html`
