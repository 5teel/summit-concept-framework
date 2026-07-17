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
takes from a Concept Writer's exploratory build to an approved handoff into the
VI development pipeline.

POC code is **throwaway**. The durable asset is the record set.

**The framework ends at the handoff.** Everything after it — the PRD, the ADRs,
the build — is the Agentic Engineers' process under the Summit Agentic Framework.

---

## Roles

Three roles, strictly separated.

| Role | Produces | Owns | Never does |
|---|---|---|---|
| **Concept Writers** | Concepts (registered early), POC build, `NOTES.md` capture, **Submission** | The Concept stage — sketch (`summit-new-canvas`), then register + build & capture + submit (`summit-concept`) | Author CDRs; run the strategy stage |
| **Strategists** | **CDRs**, promotion package, handoff | The Strategy stage — harvest, freeze, promote, handoff (`summit-cdr`) | Prescribe stack or architecture; author PRDs |
| **Agentic Engineers** | **PRD**, ADRs, the build — *all outside this framework* | Development under the Summit Agentic Framework | Edit frozen CDRs; treat POC code as a starting codebase |

**The quality filter is the submission self-check.** `summit-concept`'s submit
mode validates an explicit completeness checklist *before* packaging, so gaps
surface to the Concept Writer first — not mid-pipeline. A separate Strategist
**triage** (Accepted / Returned / Rejected) is *optional*: use it only when a
genuinely different person reviews before the strategy stage; skip it when the
Concept Writer and Strategist are the same person (self-review adds nothing but delay).

**Approval and prioritisation are cultural, not a machine gate.** The team decides
what moves forward and in what order **informally, by consensus in meetings** — the
tooling does not enforce an approval block, and the handoff never refuses for a
missing one. Commercialisation and Summit-fit claims must still be *sourced* from
product / commercial — not invented.

**The PRD does not sit within this framework.** Authoring a PRD is the
acknowledged next step *after* handoff, but it is the **Agentic Engineers' process**
— downstream of the requirements and standards defined by the ADRs in the Summit
Agentic Framework. This framework's job is to deliver a frozen, traceable CDR set
worth writing a PRD from.

---

## Artifacts

| Artifact | What it is | Authored by |
|---|---|---|
| `NOTES.md` | Frictionless scratch buffer during the build | Concept Writer |
| `SUBMISSION.md` | The concept submission — completeness checklist + optional triage verdict | Concept Writer submits; Strategist triages (if used) |
| **CDRs** (Concept Decision Records) | Settled, concept-level decisions — the *what* and *why* | Strategist (via harvest, Concept Writer consulted) |
| `PROMOTION.md` | Business case + freeze manifest (`status: Promoted`) | Strategist |
| **Promotion Record** (HTML) | Presentation of `PROMOTION.md` | Rendered, never hand-authored |
| **Handoff Package** | The Concept — frozen CDRs + seeds for the VI project's `PROJECT.md` / `CONTEXT.md` | Strategist emits; Agentic Engineers receive |

Downstream (Agentic-Engineer-owned, outside this framework): the **PRD**, ADRs, and the build.

The framework ships as **one Claude plugin** from this repo's marketplace. Update it
once and push — every Concept Writer picks it up on the next plugin refresh.

---

## Relationship to the Summit Agentic Framework

The two frameworks meet at the **handoff boundary**:

```
 CONCEPT FRAMEWORK                                    AGENTIC FRAMEWORK (Agentic Engineers)
┌─────────────────────────────┐                      ┌──────────────────────────────────┐
│ summit-new-canvas     (CW)  │                      │ Agentic Engineers — this side    │
│  sketch   → HTML canvas     │                      │                                  │
├─────────────────────────────┤                      │  PRD          (their process,    │
│ summit-concept        (CW)  │                      │                from frozen CDRs, │
│  register → dashboard entry │                      │                per ADR standards)│
│  build    → NOTES.md        │        hand          │                                  │
│  submit   → SUBMISSION.md   │  ────── off ───────▶ │  PROJECT.md   (seeded)           │
├─────────────────────────────┤                      │  CONTEXT.md   (seeded)           │
│ summit-cdr            (ST)  │                      │  ADRs         (they decide HOW)  │
│  harvest  → CDR-NNN records │                      │  DEPENDENCY-POLICY applies       │
│  freeze   → frozen CDRs  ⟵① │                      │  ① freeze = the one hard stop    │
│  promote  → PROMOTION.md    │                      │                                  │
│  handoff  → the Concept     │                      │                                  │
└─────────────────────────────┘                      └──────────────────────────────────┘
```

- **CDRs say WHAT and WHY. ADRs say HOW.** A CDR never prescribes architecture,
  framework, or stack — those are the Agentic Engineers' post-handoff ADR decisions,
  constrained by `DEPENDENCY-POLICY.md` in the Agentic Framework.
- CDRs and ADRs share conventions — frontmatter, coded items, supersession chains,
  status lifecycle — so AI tools traverse both record types the same way.
- **Frozen CDRs win.** The frozen CDR set is the source of truth for concept
  decisions. Whatever the Agentic Engineers derive from it downstream (PRD, backlog,
  ADRs) is derived — a conflict resolves toward the CDRs, always.
- **Approval is cultural.** What moves forward, and in what order, is agreed by team
  consensus in meetings — not a machine gate. The freeze is the only hard stop.

See `PIPELINE.md` for the full stage flow.

---

## Repo Layout

```
summit-concept-framework/              ← the Claude plugin MARKETPLACE (repo root)
├── .claude-plugin/marketplace.json    ← lists the summit-concepts plugin
├── summit-concepts/                   ← the PLUGIN (source "./summit-concepts")
│   ├── .claude-plugin/plugin.json
│   ├── references/                    ← shared, cross-skill references
│   │   ├── summit-context.md          ← Summit business & market context
│   │   └── client-packs.md            ← how client measure packs are located (names no client)
│   └── skills/
│       ├── summit-new-canvas/         ← CW: raw idea → designed HTML sketch (upstream of register)
│       ├── summit-concept/            ← CW: register + build & capture + submit (+ optional triage)
│       ├── summit-cdr/                ← ST: harvest → freeze → promote → handoff (one flow)
│       └── summit-vi-report-writer/   ← VI report JSON: build, extend, repair, validate
├── templates/
│   ├── SUBMISSION_TEMPLATE.md         ← concept submission + optional triage verdict
│   ├── CDR_TEMPLATE.md                ← Concept Decision Record
│   ├── PROMOTION_TEMPLATE.md          ← business case + freeze manifest
│   ├── NOTES_TEMPLATE.md              ← scratch buffer
│   └── PROMOTION_RECORD_TEMPLATE.html ← promotion record (rendered)
├── onboarding/                        ← one-click setup + quickstart for Concept Writers
├── .gitignore                         ← keeps the staff roster + client packs out of this repo
├── .gitattributes                     ← freezes the VI skill's line endings (sealed checksums)
├── README.md                          ← you are here
└── PIPELINE.md                        ← the concept → VI pipeline, stage by stage
```

The skills read their templates from `X:\Labs\summit-concept-framework\templates\`
(the framework working copy on the share), so `templates/` stays at the repo root.

**One plugin, four skills.** The pipeline itself is two — `summit-concept` (register,
capture, submit) and `summit-cdr` (harvest, freeze, promote, hand off).
`summit-new-canvas` sits *upstream* (sketching an idea before it is registered), and
`summit-vi-report-writer` ships alongside as the VI report tool rather than as a pipeline
stage. The only mandatory confirmation is the freeze.

No PRD template lives here — the PRD is the Agentic Engineers' artifact, produced
under the Agentic Framework.

---

## The Loop

1. **Concept Writer — `summit-concept`:** register the idea (the first dashboard
   entry, done early), build the POC, drop `NOTES.md` one-liners at each fork, then
   submit.
2. **Strategist — `summit-cdr`:** harvest CDRs, **freeze** them (the one hard stop —
   irreversible), write **`PROMOTION.md`**, and hand off the Concept. What moves
   forward and when is agreed by team consensus, not a machine gate.
3. **Agentic Engineers** (outside this framework): scaffold from the seeds, author the
   PRD from the frozen CDRs, then ADRs for the *how*, then build.

See **`PIPELINE.md`** for the stage-by-stage detail.
