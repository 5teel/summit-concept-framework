# Summit Concept Framework

> Concept-to-pipeline governance for Summit Insights.
> Sibling to the **Summit Agentic Framework** — same conventions, earlier lifecycle stage.

---

## About Summit Insights

Summit Insights is an Australian data analytics and business consultancy
company headquartered in North Sydney, NSW. We specialise in transaction
and loyalty data analytics for the retail sector, helping retailers and
suppliers make data-driven decisions.

---

## What This Repo Is

This is the **Summit Concept Framework** — the governed path a proof-of-concept
takes from a Report Writer's exploratory build to an approved development project
inside the VI environment.

POC code is **throwaway**. The durable asset is the record set.

---

## Roles

Three roles, strictly separated. The separation exists to keep low-quality or
incomplete concepts **out of the pipeline** — an unfiltered concept blocks every
stage behind it.

| Role | Produces | Owns | Never does |
|---|---|---|---|
| **Report Writers** | POC build, `NOTES.md` capture, **Concept Submission** | Exploration — `concepts/<name>/` build & capture | Author CDRs or PRDs; run harvest, promotion, or handoff |
| **Concept Writers** | **CDRs**, promotion package, PRD *(by exception)* | Submission triage, harvest, promotion, handoff | Approve their own promotions; prescribe stack or architecture |
| **IT** | **PRD** *(in most cases)*, ADRs, the build | Development under the Summit Agentic Framework | Edit frozen CDRs; treat POC code as a starting codebase |
| Product / leadership | Approval | The promotion decision | — |

**The quality filter is the Submission gate.** A Report Writer cannot put
anything into the pipeline directly — they *submit* a concept, and a Concept
Writer triages it (**Accepted / Returned / Rejected**) against an explicit
completeness checklist before any CDR work begins. Returned means named gaps,
not a dead end.

**PRD authorship — two paths:**

- **Default:** the handoff package carries the frozen CDR set only. **IT authors
  the PRD** from it (using this framework's `PRD_TEMPLATE.md`) as the first act
  of development — the team that builds writes the requirements it will build to.
- **Exception:** a **Concept Writer** authors the PRD before handoff — only when
  product/leadership want requirements fixed at approval time, or IT requests it.
  The exception is recorded in `PROMOTION.md`.

Either way: **frozen CDRs are the source of truth; every PRD is derived.**

---

## Artifacts

| Artifact | What it is | Authored by |
|---|---|---|
| `NOTES.md` | Frictionless scratch buffer during the build | Report Writer |
| `SUBMISSION.md` | The concept submission — completeness checklist + triage verdict | Report Writer submits; Concept Writer triages |
| **CDRs** (Concept Decision Records) | Settled, concept-level decisions — the *what* and *why* | Concept Writer (via harvest, Report Writer consulted) |
| `PROMOTION.md` | Business case + freeze manifest + **machine-readable approval block** | Concept Writer produces; product / leadership approve |
| **Promotion Record** (HTML) | Approval package — presentation of `PROMOTION.md` | Rendered, never hand-authored |
| **PRD** | Forward-looking build spec derived from frozen CDRs | IT *(default)* or Concept Writer *(exception)* |
| **Handoff Package** | Frozen CDRs + seeds for the VI project's `PROJECT.md` / `CONTEXT.md` | Concept Writer emits; IT receives |

The framework lives here. Each POC workspace junction-links to it.
Update this repo once — every concept track benefits immediately.

---

## Relationship to the Summit Agentic Framework

The two frameworks meet at the **handoff boundary**:

```
 CONCEPT FRAMEWORK                                    AGENTIC FRAMEWORK (IT / VI Dev)
┌─────────────────────────────┐                      ┌──────────────────────────────────┐
│ REPORT WRITER               │                      │ IT                               │
│  build POC → NOTES.md       │                      │  PRD          (authored from     │
│  submit    → SUBMISSION.md  │                      │                frozen CDRs)      │
├──────── triage gate ────────┤                      │  PROJECT.md   (seeded)           │
│ CONCEPT WRITER              │        hand          │  CONTEXT.md   (seeded)           │
│  harvest   → CDR-NNN records│  ────── off ───────▶ │  ADRs         (IT decides HOW)   │
│  promote   → frozen CDRs    │                      │  TYPE_REGISTRY, HANDOFF, etc.    │
│            → PROMOTION.md   │                      │  DEPENDENCY-POLICY applies       │
│  approval  → block filled   │                      │                                  │
└─────────────────────────────┘                      └──────────────────────────────────┘
```

- **CDRs say WHAT and WHY. ADRs say HOW.** A CDR never prescribes architecture,
  framework, or stack — those are IT's post-handoff ADR decisions, constrained by
  `DEPENDENCY-POLICY.md` in the Agentic Framework.
- CDRs and ADRs share conventions — frontmatter, coded items, supersession chains,
  status lifecycle — so AI tools traverse both record types the same way.
- **Frozen CDRs win.** The frozen CDR set is the source of truth for concept
  decisions; any PRD is the *derived* implementation request. If they conflict,
  the conflict resolves toward the CDRs — always.
- **Approval is authoritative, not cosmetic.** `status: "Approved"` requires
  `approved_by` + `approved_at` + `approval_record` in the `PROMOTION.md`
  frontmatter; the handoff refuses without them. The HTML record is
  *presentation*; `PROMOTION.md` is the machine-readable source of truth.

See `PIPELINE.md` for the full stage-gate flow.

---

## Repo Layout

```
summit-concept-framework/
├── README.md                          ← you are here
├── PIPELINE.md                        ← the concept → VI pipeline, stage by stage
├── templates/
│   ├── SUBMISSION_TEMPLATE.md         ← concept submission + triage verdict
│   ├── CDR_TEMPLATE.md                ← Concept Decision Record
│   ├── PROMOTION_TEMPLATE.md          ← business case + approval block (source of truth)
│   ├── PRD_TEMPLATE.md                ← Product Requirements Document
│   ├── NOTES_TEMPLATE.md              ← scratch buffer
│   └── PROMOTION_RECORD_TEMPLATE.html ← approval package (rendered)
└── skills/                            ← Claude Code skills (install to ~/.claude/skills/)
    ├── summit-concept/                ← RW: start / attach a concept track
    ├── summit-concept-submit/         ← RW: validate & package the submission; CW: triage
    ├── summit-concept-harvest/        ← CW: distil settled decisions into CDRs
    ├── summit-concept-promote/        ← CW: freeze, business case, promotion record
    └── summit-concept-handoff/        ← CW: seed the VI project after approval
```

---

## The Loop

**Report Writer:**

1. **`summit-concept <name>`** — scaffold `concepts/<name>/` in your workspace.
2. **Build the POC.** Code is throwaway; optimise for learning. Drop one-liners
   in `NOTES.md` whenever something feels decided (`!`) or open (`?`).
3. **`summit-concept-submit`** when the concept is demonstrable — it checks the
   completeness checklist *before* packaging, so gaps surface to you first, not
   to the pipeline.

**Concept Writer:**

4. **Triage the submission** — Accept, Return (named gaps), or Reject.
5. **`summit-concept-harvest`** on accepted concepts — propose CDRs, confirm
   with the Report Writer's input on the "why".
6. **`summit-concept-promote`** at the gate — freeze the CDR set, gather the
   business case, produce `PROMOTION.md` + the HTML record for approval.
   Author a PRD here only on the exception path.
7. **`summit-concept-handoff`** after approval — package the frozen set and
   seed the VI development project.

**IT:**

8. Scaffold the project under the Agentic Framework from the seeds, **author the
   PRD from the frozen CDR set** (most cases), write ADRs for the *how*, build.
