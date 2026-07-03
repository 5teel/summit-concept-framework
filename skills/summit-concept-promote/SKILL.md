---
name: summit-concept-promote
description: Run the concept promotion gate (Concept Writer skill). Freezes the
  CDR set, gathers the business case, and produces PROMOTION.md (machine-readable
  source of truth incl. the approval block) plus the HTML promotion record.
  Promotion authority sits with Concept Writers — the CW can approve in the same
  session, recorded attributably in the approval block. No PRD is produced —
  that is IT's downstream process under the Agentic Framework. Part of the
  Summit Concept Framework.
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
---

# Promote a Concept

You run the **promotion gate**: turn a proven concept into an approved,
handoff-ready package.

> **Roles.** This is a **Concept Writer** skill. Report Writers never run
> promotion — their involvement here is supplying business-case input.
> **Promotion authority sits with Concept Writers**: the CW who runs this gate
> may also approve it, recorded attributably in the approval block. Authority
> covers the promotion decision — it does not extend to inventing business
> facts (commercialisation and Summit-fit are sourced or TBD).

You produce:

- **`PROMOTION.md`** → the machine-readable promotion document: business case,
  freeze manifest, flagged gaps, approval block. **This is the source of
  truth** the handoff validates against.
- **HTML record** → the visual promotion package. Rendered from `PROMOTION.md`
  — presentation only, never hand-authored content.

You do **not** produce a PRD — at this stage or any other. The PRD is IT's
process after handoff, downstream of the Agentic Framework's ADRs.

## 0. Preconditions
- `SUBMISSION.md` exists with `status: "Accepted"` — a concept that never passed
  triage cannot be promoted, regardless of CDR count. Refuse otherwise.
- Run a **final harvest first** (`summit-concept-harvest`) so `cdr/` is current.
  Never promote a stale set.
- Every CDR reaching promotion must be `status: "Active"`. Anything still
  `Needs Review` must be confirmed to `Active` by the Concept Writer first, or
  excluded — ask, don't decide.
- Confirm there is at least one `Active` CDR. If none, stop — there's no concept
  to promote.

## 1. Freeze the spec
- Flip every `Active` CDR to `status: "Frozen"` — the set is now the **immutable
  spec**. Never edit a frozen CDR's content after this point.
- Record the freeze: current commit + date into `cdr/.harvest` under a
  `frozen_at:` line, and into `PROMOTION.md` frontmatter `cdr_freeze_ref`.
- Keep the `Superseded` trail untouched — it's the reasoning history IT needs at rebuild.

## 2. Gather the business case
Collect from the Report Writer and product (ask; do not invent):
- **Value to Summit** — the value-add argument.
- **Who uses it** — personas / jobs-to-be-done.
- **Summit fit** — positioning vs the existing product & service range.
- **Commercialisation** — **must be sourced from product / commercial, not guessed.**
  If it isn't available, write `TBD — pending product input` and flag it in
  `PROMOTION.md` §4 and the final report. Same for any Summit-fit claim you
  can't ground.

## 3. Write PROMOTION.md
- From the framework's `templates/PROMOTION_TEMPLATE.md`, into
  `concepts/<name>/PROMOTION.md`.
- Fill: concept summary, business case (coded `VAL-*`/`USR-*`/`FIT-*`/`COM-*`),
  the **freeze manifest** (every Frozen CDR listed — the handoff validates
  `cdr/` against this table), flagged gaps.
- Status `Ready for Approval`; approval block blank until step 5.

## 4. Render the HTML record (promotion package)
- Render `promotion/promotion-record.html` from the framework's
  `templates/PROMOTION_RECORD_TEMPLATE.html`, **from PROMOTION.md's content** —
  never hand-author content that isn't in the source.
- Link out to the live POC and the repo baseline.
- If approval happens in this session (step 5), re-render so the approval
  section shows it; otherwise it renders pending.

## 5. Approval — Concept Writer authority
- Ask the Concept Writer whether they are approving now.
- **Approving now:** fill the approval block in `PROMOTION.md` frontmatter —
  `approved_by` (the CW's name — a person, attributable), `approved_at`,
  `approval_record` (thread / ticket / sign-off reference), and flip status to
  `"Approved"`. Surface the §4 flagged gaps first — the CW approves *around*
  them knowingly, never blindly.
- **Holding:** leave the block blank at `Ready for Approval` — for another CW,
  or for product / leadership input on commercially significant concepts. The
  framework permits same-CW approval; it doesn't mandate it.
- Never fill the block with anything other than a named person who actually
  made the call in this session or is referenced in the approval record.

## 6. Output
- `concepts/<name>/PROMOTION.md` + `promotion/promotion-record.html`.
- Report: what was produced, the frozen-CDR count, approval state (approved by
  whom, or held and for whom), and **any TBD / flagged gaps** — especially
  commercialisation. Next step: `summit-concept-handoff` (which refuses unless
  the approval block is complete). After handoff, the PRD and build are IT's —
  outside this framework.

## Guardrails
- **Single source of truth.** The HTML record renders from PROMOTION.md. If
  artifacts disagree, you've made an error — **reconcile toward the CDRs**
  (frozen CDRs > PROMOTION.md > HTML).
- **Only `Active` CDRs get frozen.** `Needs Review` must be confirmed or excluded first.
- **No PRD, ever.** Not as a "draft for IT", not as an appendix. The PRD is
  IT's artifact, produced under the Agentic Framework's ADR standards.
- **Don't invent** commercialisation or Summit-fit. Source it or mark it `TBD`
  and flag it — approval authority is not authorship of business facts.
- **Don't promote stale.** If the harvest surfaces new settled decisions,
  capture them before freezing.
- **Approval is recorded, never implied.** A verbal or in-chat OK without the
  block filled is not an approval — the handoff will refuse it.
