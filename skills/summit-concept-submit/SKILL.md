---
name: summit-concept-submit
description: Submit a concept to the pipeline (Report Writer) or triage a
  submission (Concept Writer). The pipeline's quality gate — validates the
  completeness checklist BEFORE packaging so incomplete concepts stop at the
  Report Writer's desk, not mid-pipeline. Nothing downstream runs against a
  concept that is not Accepted. Part of the Summit Concept Framework.
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
---

# Submit / Triage a Concept

You operate the **entry gate** to the concept pipeline. Two modes, two roles:

- **Submit** (Report Writer): validate the concept's completeness and package
  `SUBMISSION.md`. You are the filter that keeps low-quality and incomplete
  concepts out of the pipeline — a gap caught here costs minutes; the same gap
  discovered at harvest or promotion blocks every stage behind it.
- **Triage** (Concept Writer): record the verdict — `Accepted` / `Returned` /
  `Rejected` — with rationale.

Detect the mode from the invocation and the SUBMISSION state: no `SUBMISSION.md`
or `status: "Draft"`/`"Returned"` → submit mode; `status: "Submitted"` and the
user is triaging → triage mode. If ambiguous, ask which hat they're wearing.

## Submit mode (Report Writer)

### 1. Locate the concept
- Target is `concepts/<name>/`. If multiple tracks exist and none was named, ask.
- If `SUBMISSION.md` exists with `status: "Returned"`, this is a **resubmission**:
  read the `TRI-*` gap list first — every named gap must be addressed or
  explicitly answered before you re-validate.

### 2. Validate the checklist — BEFORE writing anything
Check each item against reality, not against claims:

- **CHK-001 / CHK-002** — Problem and outcome: ask the writer for them if not
  already drafted. One real paragraph each. A placeholder or a restated feature
  list fails.
- **CHK-003** — POC baseline runs: ask for the location and when it last ran.
  If it can't be verified as running within the last week, fail the item.
- **CHK-004** — Validation evidence: at least one `EVD-*` item that describes
  something that *happened* (demo, usage, stakeholder reaction). Opinion fails.
- **CHK-005** — Decision trail: `NOTES.md` buffer is non-empty **or** a prior
  harvest exists (`cdr/.harvest` has a watermark). An empty trail after weeks of
  building fails — the "why" is unrecoverable and the writer should reconstruct
  key forks into NOTES before submitting.
- **CHK-006** — Known gaps declared: press once — "what's rough that you haven't
  listed?" Undeclared gaps found at triage are a Return.

### 3. Refuse or package
- **Any item unmet → refuse to submit.** Report exactly which `CHK-*` failed and
  what closing it looks like. Leave `SUBMISSION.md` at `status: "Draft"` with the
  checklist state saved — the writer fixes and re-runs.
- **All items met → package.** Write `concepts/<name>/SUBMISSION.md` from the
  framework's `templates/SUBMISSION_TEMPLATE.md`, checklist ticked, evidence and
  gaps filled, `status: "Submitted"`, triage block **blank**.
- Report: submitted, and that a Concept Writer now triages — nothing downstream
  runs until the verdict is `Accepted`.

## Triage mode (Concept Writer)

### 1. Review the submission
Read `SUBMISSION.md` and spot-check it against the workspace — the checklist
records the writer's claims; triage verifies the ones that matter:
- Does the POC baseline actually run?
- Is the evidence real?
- Do NOTES/commits show a decision trail deep enough to harvest?
- Are the declared gaps concept-level holes or just polish?

### 2. Record the verdict
Fill the triage block (`triaged_by`, `triaged_at`) and set status:

- **`Accepted`** — complete enough to formalise. Set `concept_writer` (the CW
  taking ownership). Harvest may now run.
- **`Returned`** — fixable gaps. Write a `TRI-*` line per gap: the specific gap
  and what closing it looks like. Never return without naming the gaps.
- **`Rejected`** — not viable as a concept. Record the rationale so the effort
  isn't repeated.

### 3. Report
State the verdict, who owns the concept now, and the next step
(`summit-concept-harvest` if Accepted; the gap list if Returned).

## Guardrails
- **Never self-triage.** The submitter and the triager must be different people.
  If asked to do both in one session, refuse the triage half.
- **Never package an unmet checklist** — "we'll fix it after submission" defeats
  the gate's purpose.
- **Never soften a Return into an Accept** because the writer is keen. Named
  gaps + fast resubmission is faster than a blocked pipeline.
- **Verdicts are recorded, not implied.** No verbal accepts — the frontmatter is
  what harvest checks.
- **Additive only.** You write `SUBMISSION.md` inside `concepts/<name>/` and
  nothing else.
