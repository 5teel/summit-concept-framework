# Summit Concept Framework

> Concept-to-pipeline governance for Summit Insights Report Writers.
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

POC code is **throwaway**. The durable asset is the record set:

| Artifact | What it is | Who owns it |
|---|---|---|
| `NOTES.md` | Frictionless scratch buffer during the build | Report Writer |
| **CDRs** (Concept Decision Records) | Settled, concept-level decisions — the *what* and *why* | Report Writer (curated via harvest) |
| **PRD** (Product Requirements Document) | Forward-looking build spec derived from the frozen CDR set | Report Writers produce; product / leadership approve |
| **Promotion Record** | HTML approval package — business case + frozen decisions | Product / leadership approve |
| **Handoff Package** | Seeds the VI project's `PROJECT.md` / `CONTEXT.md` under the Agentic Framework | IT receives |

The framework lives here. Each POC workspace junction-links to it.
Update this repo once — every concept track benefits immediately.

---

## Relationship to the Summit Agentic Framework

The two frameworks meet at the **handoff boundary**:

```
 CONCEPT FRAMEWORK (Report Writers)          AGENTIC FRAMEWORK (IT / VI Dev)
┌──────────────────────────────────┐        ┌──────────────────────────────────┐
│ build POC → NOTES.md             │        │ PROJECT.md   (seeded from PRD)   │
│ harvest   → CDR-NNN records      │        │ CONTEXT.md   (seeded from PRD)   │
│ promote   → frozen CDRs          │  hand  │ ADRs         (IT decides HOW)    │
│           → PRD + Promotion Rec. │ ─off──▶│ TYPE_REGISTRY, HANDOFF, etc.     │
│ approve   → approval block filled│        │ DEPENDENCY-POLICY applies        │
└──────────────────────────────────┘        └──────────────────────────────────┘
```

- **CDRs say WHAT and WHY. ADRs say HOW.** A CDR never prescribes architecture,
  framework, or stack — those are IT's post-handoff ADR decisions, constrained by
  `DEPENDENCY-POLICY.md` in the Agentic Framework.
- CDRs and ADRs share conventions — frontmatter, coded items, supersession chains,
  status lifecycle — so AI tools traverse both record types the same way.
- **Frozen CDRs win.** The frozen CDR set is the source of truth for concept
  decisions; the PRD is the *derived* implementation request. If they conflict,
  the handoff refuses until the conflict is resolved.
- **Approval is authoritative, not cosmetic.** `status: "Approved"` requires
  `approved_by` + `approved_at` + `approval_record` in the PRD frontmatter; the
  handoff refuses without them. The HTML record is *presentation*; the PRD
  frontmatter is the machine-readable source of truth.

See `PIPELINE.md` for the full stage-gate flow.

---

## Repo Layout

```
summit-concept-framework/
├── README.md                          ← you are here
├── PIPELINE.md                        ← the concept → VI pipeline, stage by stage
├── templates/
│   ├── CDR_TEMPLATE.md                ← Concept Decision Record
│   ├── PRD_TEMPLATE.md                ← Product Requirements Document
│   ├── NOTES_TEMPLATE.md              ← scratch buffer
│   └── PROMOTION_RECORD_TEMPLATE.html ← approval package
└── skills/                            ← Claude Code skills (install to ~/.claude/skills/)
    ├── summit-concept/                ← start / attach a concept track
    ├── summit-concept-harvest/        ← distil settled decisions into CDRs
    ├── summit-concept-promote/        ← freeze, build PRD + promotion record
    └── summit-concept-handoff/        ← seed the VI project after approval
```

---

## The Loop (Report Writer's view)

1. **`summit-concept <name>`** — scaffold `concepts/<name>/` in your workspace.
2. **Build the POC.** Code is throwaway; optimise for learning. Drop one-liners
   in `NOTES.md` whenever something feels decided (`!`) or open (`?`).
3. **`summit-concept-harvest`** at natural breakpoints — a screen feels done,
   before a demo, end of a cycle, weekly. It proposes CDRs; you curate.
4. **`summit-concept-promote`** at the gate — freezes the CDR set, gathers the
   business case, produces the PRD + promotion record for approval.
5. **`summit-concept-handoff`** after approval — packages the frozen set and
   seeds the VI development project under the Agentic Framework.
