---
name: summit-concept
description: Start or attach a concept track in a POC workspace (Report Writer
  skill). Scaffolds concepts/<name>/ (NOTES.md + cdr/ + promotion/) additively.
  The on-ramp for the summit-concept-* loop (submit → harvest → promote →
  handoff). Part of the Summit Concept Framework, sibling to the Summit Agentic
  Framework. Forward-only capture.
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
---

# Start / Attach a Concept Track

You stand up the **concept track** for a proof-of-concept: a namespaced
`concepts/<name>/` overlay where throwaway build work happens and the durable
concept spec (CDRs) is captured. The POC *code* is disposable; the records under
`cdr/` are the asset that is promoted and handed off to VI development under the
Summit Agentic Framework. You scaffold the home and hand the writer the loop —
you do not build the POC and you do not author CDRs.

> **Roles.** This is a **Report Writer** skill — RWs explore and build. What an
> RW produces stays in `concepts/<name>/` until it passes the submission gate:
> `summit-concept-submit` packages the concept and a **Concept Writer** triages
> it. Only Concept Writers author CDRs (harvest), and promotion authority sits
> with them — they run and approve the gate, then hand off. **IT** takes over
> from there under the Agentic Framework; IT's process (PRD, ADRs, build) is
> outside this framework.
>
> This is the on-ramp. Downstream: `summit-concept-submit` gates entry,
> `summit-concept-harvest` distils CDRs, `summit-concept-promote` runs the
> approval gate, `summit-concept-handoff` seeds the VI project. You only create
> the scaffold they operate on.

## 1. Resolve the concept name
- Take `<name>` from the invocation (e.g. `summit-concept uplift-cards`). Slugify it:
  lowercase, kebab-case, no spaces. If absent, ask for one short name — don't invent it.
- The target is always `concepts/<name>/` at the workspace root. Never any other root.

## 2. Detect context — never assume you own the workspace
- The workspace may already contain project code, other concept tracks, or files
  governed by another framework. You are **read-only** toward everything outside
  `concepts/<name>/`.
- If the workspace is junction-linked to the Summit Agentic Framework
  (`PROJECT.md` / `CONTEXT.md` / `adrs/` present), state that you detected it and
  confirm this is a *concept* track being added alongside — the governed project
  is untouched.

## 3. Guard against clobbering
```bash
ls -d "concepts/<name>" 2>/dev/null && echo "EXISTS" || echo "ok"
```
- If `concepts/<name>/` already exists, **stop**. Report what's there (NOTES, CDR
  count, any promotion artifacts) and do not overwrite. Offer a different name instead.
- Scaffolding is a one-shot. Re-running on an existing concept must never reset
  NOTES or CDRs.

## 4. Scaffold the overlay
Create exactly this, and nothing outside it:

```
concepts/<name>/
├── NOTES.md          ← frictionless scratch buffer (from framework NOTES_TEMPLATE.md)
├── cdr/
│   ├── README.md     ← what a CDR is / isn't (in-skill artifact doc, §6 below)
│   └── .harvest      ← harvest watermark, initialised empty
└── promotion/        ← created now, empty; summit-concept-promote fills it at the gate
```

- `NOTES.md` — copy from the framework's `templates/NOTES_TEMPLATE.md`.
- `cdr/README.md` — write the **in-skill artifact doc** (§6 below). Self-contained;
  no dependency on any external reference file.
- `cdr/.harvest` — initialise:
  ```
  last_harvest_commit: <none yet>
  last_harvest_date: <none yet>
  ```
- `promotion/` — create the empty dir (a `.gitkeep` is fine) so the gate has a home.

Templates resolve from the **Summit Concept Framework** repo (junction-linked or
`~/.claude/skills/summit-concept/templates/` fallback) — `SUBMISSION_TEMPLATE.md`,
`CDR_TEMPLATE.md`, `PROMOTION_TEMPLATE.md`, `NOTES_TEMPLATE.md`,
`PROMOTION_RECORD_TEMPLATE.html` are the Summit-owned canonical source the
submit, harvest, promote, and handoff skills draw from. (No PRD template — the
PRD is IT's artifact, outside this framework.)

## 5. Hand over the loop
After scaffolding, tell the writer how to run it — concisely:

**Yours (Report Writer):**
1. **Build the POC.** Code is throwaway; optimise for learning, not durability.
2. **Drop one-liners in `NOTES.md`** whenever something feels decided (`!`), is an
   open question (`?`), or is just an observation. No ceremony.
3. **Run `summit-concept-submit` when the concept is demonstrable.** It checks
   the completeness checklist before packaging — gaps surface to you first, not
   to the pipeline. A Concept Writer triages: Accepted / Returned / Rejected.

**Downstream (Concept Writer, once Accepted):**
4. `summit-concept-harvest` at natural breakpoints — distils settled decisions
   into CDRs, with your input on the "why".
5. `summit-concept-promote` at the gate — freezes the CDR set, produces
   PROMOTION.md + the HTML record, and approves (promotion authority sits with
   Concept Writers).
6. `summit-concept-handoff` after approval — seeds the VI development project.
   From there IT takes over under the Summit Agentic Framework; IT's process
   (PRD from the frozen CDRs, ADRs, build) is outside this framework.

Report: the path created, the writer's three steps, and where the baton passes.

## 6. The cdr/README.md to write (in-skill artifact doc)
Write this verbatim into `concepts/<name>/cdr/README.md`:

```markdown
# Concept Decision Records

Decisions that define this concept — what it does, how the user experiences
it, what's deliberately out, and what it assumes. This folder is the spec that
is promoted and handed to VI development. The POC *code* is throwaway; these
records are the durable asset.

## You do not write these by hand — ever
Report Writers never author CDRs. Just build, and drop the occasional one-liner
in NOTES.md if something feels decided. Once the concept passes submission
triage, CDRs are produced retrospectively by the harvest, curated by the
**Concept Writer** assigned to the concept — you'll be consulted for the "why"
behind decisions the evidence doesn't explain.

## What is and isn't a CDR
- A CDR captures a **settled, concept-level** decision: survived a few iterations,
  has a real rejected alternative, and reversing it now would cost rework.
- The test: **"would IT build a different product if they didn't know this?"**
  No → not a CDR.
- Roll up to **user-visible concepts**, not implementation choices. A concept has
  ~10–30 CDRs total. Past ~40, you're capturing at the wrong altitude.
- CDRs say **what and why**. ADRs (written by IT after handoff, in the Summit
  Agentic Framework) say **how**. Never prescribe stack or architecture here.

## Conventions
- One decision per file: `CDR-NNN-slug.md`, sequential, zero-padded, from the
  framework's CDR_TEMPLATE.md.
- Decision statements are coded (`DEC-001`) and individually traceable —
  downstream requirements (IT's PRD) reference `CDR-NNN:DEC-NNN`. Keep them atomic.
- Never edit a reversed decision in place — write a new CDR, mark the old one
  `Superseded`, cross-link with `supersedes` / `superseded_by`.
- Status lifecycle: `Proposed → Needs Review → Active → Frozen → Superseded`.
  `Active` records are the working spec; `Frozen` (set at promotion) is immutable.
  The trail of superseded ones is the reasoning history IT needs at rebuild — keep it.
```

## Guardrails
- **Additive only.** You write solely under `concepts/<name>/`. Never edit, move,
  or convert any other artifact. A governed project alongside keeps shipping untouched.
- **No clobber.** An existing concept dir stops you — never reset a live NOTES/CDR set.
- **Don't author CDRs or build the POC.** You make the home; the writer and the
  harvest fill it. Seeding fake CDRs defeats the "settled, human-curated" contract.
- **Forward-only.** Don't fabricate retrospective records from a mature project's
  history — retrofit is not this skill.
