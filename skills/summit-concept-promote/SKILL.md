---
name: summit-concept-promote
description: Run the concept promotion gate. Freezes the CDR set, gathers the
  business case, and produces two consistent artifacts from one source — a PRD
  (IT's build spec, with coded REQ items tracing to CDR decision statements) and
  an HTML promotion record (the approval package). Owned by Report Writers;
  approved by product / leadership. Part of the Summit Concept Framework.
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
---

# Promote a Concept

You run the **promotion gate**: turn a proven concept into an approvable package and
a buildable spec. You produce two renderings from one source — never two truths.

- **HTML record** → product / leadership audience, to *approve* (visual, business-case-forward).
- **PRD** → IT audience, to *build from* (structured requirements, forward-looking, stack-agnostic).

Both derive from the **frozen CDR set + business case**, so they cannot drift. The CDR
`type` tag does double duty: it slices the HTML record AND structures the PRD.

## 0. Preconditions
- Run a **final harvest first** (`summit-concept-harvest`) so `cdr/` is current.
  Never promote a stale set.
- Every CDR reaching promotion must be `status: "Active"`. Anything still
  `Needs Review` must be human-confirmed to `Active` first, or excluded — ask,
  don't decide.
- Confirm there is at least one `Active` CDR. If none, stop — there's no concept
  to promote.

## 1. Freeze the spec
- Flip every `Active` CDR to `status: "Frozen"` — the set is now the **immutable
  spec**. Never edit a frozen CDR's content after this point.
- Record the freeze: write the current commit + date into `cdr/.harvest` under a
  `frozen_at:` line, and into the PRD frontmatter `cdr_freeze_ref`.
- Keep the `Superseded` trail untouched — it's the reasoning history IT needs at rebuild.

## 2. Gather the business case
Collect from the Report Writer (ask; do not invent):
- **Value to Summit** — the value-add argument.
- **Who uses it** — personas / jobs-to-be-done.
- **Summit fit** — positioning vs the existing product & service range.
- **Commercialisation** — **must be sourced from product / commercial, not guessed.**
  If it isn't available, write `TBD — pending product input` and flag it in the
  final report. Same for any Summit-fit claim you can't ground.

## 3. Derive structure from CDR types
Slice the frozen CDRs by `type`. This populates BOTH artifacts:

| type        | PRD section (coded items)              | HTML record section |
|-------------|----------------------------------------|---------------------|
| ux          | §4 Features & Experience (`REQ-*`)     | Core features       |
| scope       | §3 Scope In/Out (`SCP-*`)              | Scope               |
| data        | §5 Data Requirements (`DAT-*`)         | Data story          |
| integration | §6 Integration & Assumptions (`INT-*`) | Workflow fit        |

## 4. Generate the PRD (IT's build spec)
- Write `promotion/PRD.md` from the framework's `templates/PRD_TEMPLATE.md`.
- Forward-looking: *what to build*, not *what was decided*.
- **Sub-record traceability is mandatory.** Every coded requirement (`REQ-*`,
  `SCP-*`, `DAT-*`, `INT-*`) traces to a specific decision statement —
  `CDR-NNN:DEC-NNN`, not just the CDR id. One requirement per DEC statement is
  the default; merge only when statements are genuinely inseparable.
- **Back-fill the CDRs' Applies To tables** with the requirement ids each record
  produced (status-table update only — content stays frozen).
- Derive `SUC-*` success criteria from CDR `EVD-*` evidence where possible —
  validated behaviour in the POC is the best acceptance test for the rebuild.
- **Stack-agnostic** — do NOT prescribe architecture, framework, or folder
  structure. That's IT's post-handoff ADR call, constrained by the Agentic
  Framework's `DEPENDENCY-POLICY.md`. Fill PRD §8 (Explicitly Not Specified)
  and carry each CDR's `HND-003` latitude notes into it.
- Complete §9 (VI Onboarding Map) — `summit-concept-handoff` consumes it.
- Include the **POC baseline** (repo / live POC link) as the runnable reference
  IT evaluates against.

## 5. Render the HTML record (approval package)
- Render `promotion/promotion-record.html` from the framework's
  `templates/PROMOTION_RECORD_TEMPLATE.html`.
- Fill all eight sections, including the per-CDR `→ REQ-*` trace line. Generate
  from the same source as the PRD — never hand-author content that contradicts it.
- The approval section renders **pending** — the machine-readable approval lives
  in the PRD frontmatter, and it's blank at this stage.
- Link out to the live POC, the PRD, and the repo baseline.

## 6. Output
- Two files in `promotion/`: `PRD.md` and `promotion-record.html`.
- Set PRD status to `Ready for Approval`, and emit the **approval block blank**
  (`approved_by` / `approved_at` / `approval_record`) for product / leadership to
  complete. Never self-fill it — the packager is not the approver.
- Report: what was produced, the frozen-CDR count, the requirement count by
  section, and **any TBD / flagged gaps** — especially commercialisation. State
  plainly: producer = Report Writers, approver = product / leadership, next step =
  `summit-concept-handoff` once the approval block is filled.

## Guardrails
- **Single source of truth.** Both artifacts derive from the frozen CDR set +
  business case. If they disagree, you've made an error — **reconcile to the CDRs**
  (frozen CDRs are authoritative; the PRD is the derived request).
- **Only `Active` CDRs get frozen and reach a promotion.** `Needs Review` must be
  confirmed or excluded first.
- **Don't invent** commercialisation or Summit-fit. Source it or mark it `TBD` and flag it.
- **Don't promote stale.** If the harvest surfaces new settled decisions, capture
  them before freezing.
- **The PRD says what, not how.** Architecture is IT's decision after the gate, not yours.
- **Every requirement traces or it doesn't ship.** A PRD line with no
  `CDR-NNN:DEC-NNN` trace is either a missed CDR (harvest it) or an invention (cut it).
