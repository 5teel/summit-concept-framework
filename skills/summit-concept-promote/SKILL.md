---
name: summit-concept-promote
description: Run the concept promotion gate (Concept Writer skill). Freezes the
  CDR set, gathers the business case, and produces PROMOTION.md (machine-readable
  source of truth incl. the approval block) plus the HTML promotion record.
  Authors a PRD only on the exception path — by default IT authors the PRD after
  handoff. Produced by Concept Writers; approved by product / leadership. Part of
  the Summit Concept Framework.
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
---

# Promote a Concept

You run the **promotion gate**: turn a proven concept into an approvable package.

> **Roles.** This is a **Concept Writer** skill. Report Writers never run
> promotion — their involvement here is supplying business-case input. The
> approver is product / leadership; the packager is never the approver.

You produce:

- **`PROMOTION.md`** → the machine-readable promotion document: business case,
  freeze manifest, PRD-path declaration, approval block. **This is the source
  of truth** the handoff validates against.
- **HTML record** → product / leadership audience, to *approve*. Rendered from
  `PROMOTION.md` — presentation only, never hand-authored content.
- **PRD** → **exception path only** (see §4). By default IT authors the PRD
  after handoff, from the frozen CDR set.

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
  `PROMOTION.md` §5 and the final report. Same for any Summit-fit claim you
  can't ground.

## 3. Write PROMOTION.md
- From the framework's `templates/PROMOTION_TEMPLATE.md`, into
  `concepts/<name>/PROMOTION.md`.
- Fill: concept summary, business case (coded `VAL-*`/`USR-*`/`FIT-*`/`COM-*`),
  the **freeze manifest** (every Frozen CDR listed — the handoff validates
  `cdr/` against this table), the PRD path (§4), flagged gaps.
- Status `Ready for Approval`; approval block **blank** (`approved_by` /
  `approved_at` / `approval_record`). Never self-fill it.

## 4. PRD path — default is IT
Declare in `PROMOTION.md` frontmatter:

- **`prd_path: "IT"` (default).** No PRD is written now. IT authors it after
  handoff from the frozen CDR set — the team that builds writes the requirements
  it will build to.
- **`prd_path: "Concept Writer"` (exception).** Only when product / leadership
  want requirements fixed at approval time, or IT has requested a pre-authored
  PRD. Record who asked and why in `prd_exception_trigger` — an empty trigger
  with this path set is invalid.

**If (and only if) the exception path applies**, write `promotion/PRD.md` from
the framework's `templates/PRD_TEMPLATE.md`:
- `authored_by_role: "Concept Writer"`, `promotion_ref` pointing at PROMOTION.md.
- **Sub-record traceability is mandatory.** Every coded requirement (`REQ-*`,
  `SCP-*`, `DAT-*`, `INT-*`) traces to a specific decision statement —
  `CDR-NNN:DEC-NNN`, not just the CDR id.
- Back-fill the CDRs' Applies To tables with the requirement ids (status-table
  update only — content stays frozen).
- Derive `SUC-*` success criteria from CDR `EVD-*` evidence where possible.
- **Stack-agnostic** — never prescribe architecture, framework, or folder
  structure. Carry each CDR's `HND-003` latitude notes into §8.

## 5. Render the HTML record (approval package)
- Render `promotion/promotion-record.html` from the framework's
  `templates/PROMOTION_RECORD_TEMPLATE.html`, **from PROMOTION.md's content** —
  never hand-author content that isn't in the source.
- The approval section renders **pending** — approval lives in PROMOTION.md
  frontmatter and is blank at this stage.
- Include the PRD link only on the exception path.
- Link out to the live POC and the repo baseline.

## 6. Output
- `concepts/<name>/PROMOTION.md` + `promotion/promotion-record.html`
  (+ `promotion/PRD.md` on the exception path only).
- Report: what was produced, the frozen-CDR count, the declared PRD path and
  trigger (if exception), and **any TBD / flagged gaps** — especially
  commercialisation. State plainly: producer = Concept Writers, approver =
  product / leadership, next step = product / leadership fill the approval block
  in PROMOTION.md, then `summit-concept-handoff`.

## Guardrails
- **Single source of truth.** The HTML record renders from PROMOTION.md; any PRD
  derives from the frozen CDRs. If artifacts disagree, you've made an error —
  **reconcile toward the CDRs** (frozen CDRs > PROMOTION.md/PRD > HTML).
- **Only `Active` CDRs get frozen.** `Needs Review` must be confirmed or excluded first.
- **The default PRD path is IT.** Don't author a PRD "to be helpful" — an
  unrequested pre-authored PRD takes the build spec away from the team that
  builds. Exception requires a recorded trigger.
- **Don't invent** commercialisation or Summit-fit. Source it or mark it `TBD` and flag it.
- **Don't promote stale.** If the harvest surfaces new settled decisions, capture
  them before freezing.
- **Never self-approve.** The approval block is product / leadership's alone.
- **Every requirement traces or it doesn't ship** (exception-path PRD): a line
  with no `CDR-NNN:DEC-NNN` trace is either a missed CDR (harvest it) or an
  invention (cut it).
