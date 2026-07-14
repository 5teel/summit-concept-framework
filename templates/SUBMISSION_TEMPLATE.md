---
title: "Submission: [Concept Name]"
concept: "[concept-name]"
status: "Draft"                   # Draft | Submitted | Accepted | Returned | Rejected
date: "YYYY-MM-DD"                # date submitted
concept_writer: "[Concept Writer name]"
tags: ["concept", "submission"]
# --- triage block: filled by the Strategist, never the submitter ---
triaged_by: ""                    # Strategist name
triaged_at: ""                    # YYYY-MM-DD
strategist: ""                    # Strategist assigned to the concept if Accepted
---

# Submission: [Concept Name]

> The concept's entry into the strategy stage. A Concept Writer submits; a
> Strategist triages **only when a genuinely different person reviews** — triage is
> optional and off by default. `summit-cdr` runs on a `Submitted` concept (or an
> `Accepted` one, when triage is on).
>
> `summit-concept` (submit) refuses to set `status: "Submitted"` while any
> checklist item is unmet — gaps surface at the Concept Writer's desk, not
> mid-pipeline.

## Status

Draft | **Submitted** | Accepted | Returned | Rejected

---

## 1. Problem

[The user problem this concept addresses. One paragraph. Who has it, when, and
what it costs them today.]

---

## 2. Outcome

[What "working" looks like for the user. One paragraph. Observable, not
aspirational.]

---

## 3. POC Baseline

| Field | Value |
|---|---|
| Repo / location | |
| Live POC (if hosted) | |
| How to run it | |
| Last verified running | YYYY-MM-DD |

---

## 4. Validation Evidence

> Anything real: demo feedback, usage observation, a stakeholder reaction.
> "I think it's good" is not evidence.

- **EVD-001**: [What was shown, to whom, and what happened]
- **EVD-002**: [ ]

---

## 5. Known Gaps

> Declared incompleteness is triage information — it helps the Concept Writer
> scope the harvest. **Undeclared** incompleteness discovered at triage is a
> Return. When in doubt, declare it.

- **GAP-001**: [What's missing or rough, and whether it's concept-level or just polish]
- **GAP-002**: [ ]

---

## 6. Completeness Checklist

> All items must be checked before `summit-concept` (submit) will package this.

- [ ] **CHK-001**: Problem articulated (§1 — one real paragraph, not a placeholder)
- [ ] **CHK-002**: Outcome articulated (§2)
- [ ] **CHK-003**: POC baseline runs (§3 — verified within the last week)
- [ ] **CHK-004**: At least one piece of validation evidence (§4)
- [ ] **CHK-005**: `NOTES.md` has a decision trail (non-empty buffer or prior harvest)
- [ ] **CHK-006**: Known gaps declared (§5 — or explicitly "none known")

---

## 7. Triage Verdict (Strategist only — optional)

| Verdict | Meaning |
|---|---|
| `Accepted` | Complete enough to formalise — harvest may run |
| `Returned` | Named gaps below — resubmit when closed |
| `Rejected` | Not viable as a concept — rationale below |

**Verdict:** [ ]

**Rationale / gap list:**

- **TRI-001**: [If Returned: the specific gap and what closing it looks like.
  If Rejected: why, so the effort isn't repeated.]
- **TRI-002**: [ ]
