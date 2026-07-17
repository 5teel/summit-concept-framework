# The Concept Pipeline

> How an idea becomes a handoff into VI development.
> **Two stages, one hard stop** — built for throughput, not ceremony.
>
> Roles: **CW** = Concept Writer · **ST** = Strategist · **AE** = Agentic Engineer.
> Concept Writers explore and build; Strategists formalise, freeze, and hand off;
> Agentic Engineers build.
>
> **Scope boundary:** this framework ends at the handoff. The PRD is the
> acknowledged next step, but it is the **Agentic Engineers' process** — downstream
> of the requirements and standards defined by the ADRs in the Summit Agentic
> Framework. Nothing here authors, templates, or gates a PRD.

---

## Stage Map

| Stage | Role | Skill | Input | Output |
|---|---|---|---|---|
| 0. **Sketch** *(optional, upstream)* | CW | `summit-new-canvas` | A raw or half-formed idea | A designed HTML canvas + concept brief — ready to register or import |
| 1. **Concept** | CW | `summit-concept` | An idea (even barely developed) | Concept Dashboard entry + `concepts/<name>/` scaffold, POC, `NOTES.md`, `SUBMISSION.md` |
| 2. **Strategy** | ST → AE | `summit-cdr` | A submitted Concept | Frozen CDRs, `PROMOTION.md`, HTML record, **the Concept handoff package** |

After Stage 2, ownership is the Agentic Engineers': PRD, ADRs, and build under the
Summit Agentic Framework.

Two skills carry the pipeline: `summit-concept` registers, captures and submits;
`summit-cdr` harvests, freezes, promotes and hands off. Few commands, one durable record
set. `summit-new-canvas` is optional and sits *before*
Stage 1 — sketch first when an idea is still half-formed, or go straight to registering it.
(`summit-vi-report-writer` also ships in the plugin, but it builds VI reports rather than
moving a concept through this pipeline.)

---

## Stage 1 — Concept (CW · `summit-concept`)

One skill, run in three modes over a Concept's life:

1. **Register** — `summit-concept <name>` scaffolds `concepts/<name>/` (`NOTES.md`,
   `cdr/`, `promotion/`) **and writes the first Concept Dashboard entry**. Do this
   early — even for a barely-developed idea. The dashboard's value is coverage: when
   every concept is visible, reviewers can spot **patterns, synergies and duplication
   across concepts**, and merge or broaden several thin ones into a single stronger
   concept *before* build effort is spent. On the dashboard this is `stage: "concept"`.
2. **Build & Capture** — build the POC (code is throwaway); drop `NOTES.md`
   one-liners at each fork (`!` decided · `?` open). No ceremony. `stage: "explore"`.
3. **Submit** — a fast completeness self-check (problem, runnable baseline,
   evidence, decision trail, declared gaps) **before** packaging `SUBMISSION.md`,
   so gaps surface to the Concept Writer, not mid-pipeline. `stage: "submit"`.

**Optional triage.** When the Concept Writer and Strategist are the same person, a
submitted concept goes straight to the strategy stage — self-review adds nothing.
Turn triage *on* only when a genuinely different person reviews first; then a
Strategist records `Accepted` / `Returned` / `Rejected` in the SUBMISSION frontmatter.

---

## Stage 2 — Strategy (ST → AE · `summit-cdr`)

One flow that turns a submitted Concept into a frozen, handoff-ready spec — harvest,
freeze, promote, hand off — with **one hard stop**:

- **A. Harvest** — diff since the last watermark; propose CDRs (settled,
  concept-level, load-bearing); the Strategist confirms/edits/discards each; write
  the confirmed set. Reversals supersede, never edit in place.
- **B. Freeze — THE HARD STOP.** Explicit confirmation before flipping `Active` CDRs
  to `Frozen`. Freezing is irreversible and the Agentic Engineers build on it; a spec
  that changes after they start is the costliest slowdown there is.
- **C. Promote** — gather the (sourced) business case; write `PROMOTION.md`
  (freeze manifest + flagged gaps, `status: "Promoted"`) and render the HTML record.
- **D. Handoff** — validate (frozen set matches manifest, no `Needs Review`, no
  PRD), then emit **the Concept handoff package** (`PROJECT.seed.md` /
  `CONTEXT.seed.md` + frozen CDR copy + manifest) into `promotion/handoff/`.

**Approval and prioritisation are not a machine gate** — the team decides what moves
forward and in what order informally, by consensus in meetings. Then the Agentic
Engineers take over — outside this framework: they author the PRD from the frozen CDR
set under their own process, downstream of the Agentic Framework's ADRs. What the
strategy stage **never** does: choose architecture/stack, rewrite a frozen CDR, or
author/package a PRD.

---

## Precedence & Authority (locked)

1. **One stop, not many gates.** The only mandatory confirmation is the irreversible
   **freeze**. Approval and prioritisation are cultural — decided by team consensus,
   not enforced by the tooling. Everything else runs straight through.
2. **Capture concepts early.** A concept entry is cheap; register ideas before
   they're "worth" formalising, so cross-concept synergies surface on the dashboard.
3. **Frozen CDRs win** over anything derived from them — the PRD, backlog, or any
   downstream artifact. `PROMOTION.md` wins over the HTML record (presentation only).
4. **The PRD is outside the framework.** The Agentic Engineers own it, downstream of
   the Agentic Framework's ADRs. This framework delivers the frozen CDR set it derives from.
5. **Additive only** — the concept track never edits files owned by another
   framework or project. New files only.
6. **Optional triage is the one conditional check** — on only for genuine
   second-person review; off by default for speed.
