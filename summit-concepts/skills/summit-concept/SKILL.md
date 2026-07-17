---
name: summit-concept
description: The Concept Writer's skill for registering and submitting. A Concept is
  everything from a raw idea to a working visual POC, up to the point it is submitted
  for the strategy stage. Start a fresh concept, or IMPORT one a Concept Writer already
  built — point it at a folder, an HTML file, a URL, or a runnable app and it reads
  through and captures the richest representation available (metadata, visual POC,
  key features). Writes the FIRST Concept Dashboard entry so reviewers spot
  cross-concept synergies early. Sibling to summit-cdr (the Strategist's skill).
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
---

# Concept — Register / Import, Build & Capture, Submit

A **Concept** is the whole Concept-Writer phase: **everything from a raw idea to a
working visual POC**, up until it is **submitted** for the strategy stage (where
`summit-cdr` takes over). This skill owns that phase.

Two ways in:

- **Register** — start a fresh concept (`summit-concept <name>`).
- **Import** — point the skill at a concept a Concept Writer **already produced**
  (`summit-concept import <path-or-url>`) and it reads through and captures it.

Either way, the skill writes the **first Concept Dashboard entry**. Capture early
and often — even a barely-developed idea. The payoff: reviewers scanning the
dashboard spot **patterns, synergies and duplication across concepts** and merge or
broaden several thin ones into a stronger single concept *before* build effort is
spent. A concept costs nothing.

> **Roles.** Concept Writers explore and build. What a Concept Writer produces stays
> a concept until it is submitted and a **Strategist** runs **`summit-cdr`** (harvest →
> freeze → promote → handoff). Only Strategists author CDRs. **Agentic Engineers**
> take over after handoff under the Summit Agentic Framework.
>
> Note: approval and prioritisation are **not** a hard gate — they're managed
> informally and culturally, by team consensus in meetings.
>
> **Templates.** Every `*_TEMPLATE.md` referenced below lives at
> `X:\Labs\summit-concept-framework\templates\` — read it from there
> (the same share the dashboard lives on).

---

## What can be a concept input

The framework captures the **idea, its benefit, a pointer to the visual POC, and
the key features** — **not** the source code. A concept input can be anything on the
maturity spectrum:

| Input | What gets captured |
|---|---|
| A raw idea / one-liner | `name`, `benefit`, `stage: concept` |
| Notes, a mockup, a spike, a data pull | + `notes`, rough `benefitDetail` |
| An **HTML file** or **URL** showing working features | + `poc` (the visual), `features[]`, usually `stage: explore` |
| A **runnable app** (the tool itself) | + `poc` (how to run it), extracted `features[]`, `stage: explore` |

The code stays where it is — `poc` just **points at** it (a path or URL). Importing
captures the concept *as-is*; it never fabricates CDRs or a decision trail (that is
`summit-cdr`'s job later, and needs the real "why").

---

## Mode A — Register (start a fresh concept)

Run `summit-concept <name>` as soon as an idea is worth capturing.

1. **Resolve the name** — slugify `<name>` (lowercase, kebab-case). Target is
   `concepts/<name>/` at the workspace root.
2. **Detect context** — you are **read-only** outside `concepts/<name>/`. If the
   workspace is junction-linked to the Agentic Framework, say so; the governed
   project is untouched.
3. **Guard against clobbering** — `ls -d "concepts/<name>"` — if it exists, stop and
   offer a different name. Never reset a live track.
4. **Scaffold the overlay** — create exactly:
   ```
   concepts/<name>/
   ├── NOTES.md          ← scratch buffer (NOTES_TEMPLATE.md)
   ├── cdr/{README.md,.harvest}
   └── promotion/        ← empty; summit-cdr fills it later
   ```
5. **Publish to the dashboard** — write the manifest at `stage: "concept"` with a
   one-line `benefit` (see **Concept Dashboard**, below), then regenerate.

Then the writer's loop: **build the POC**, drop `NOTES.md` one-liners at each fork
(`!` decided · `?` open), and run **submit** when demonstrable.

---

## Mode B — Import (capture a concept that already exists)

Run `summit-concept import <path-or-url>` (a project folder, an HTML file, a live
URL, or a runnable app). **Read through the target and extract the most complete
representation available**, in this priority — take the richest evidence you find,
don't stop at the first:

### B1. Identity & benefit
Read, richest-source-first, and draft `name`, `owner`, a one-line `benefit`
(+ a short `benefitDetail`), and — where evidenced — `project` (VI / Datafoundry /
other) and `area` (frontend / backend / both):
- GSD planning: `.planning/PROJECT.md`, `.planning/DEVELOPMENT_STATE.md`,
  `.planning/ROADMAP.md`
- Then `README.md`, then `package.json` / project config / stack files.

### B2. Visual POC — find the thing that shows it working
Locate the best runnable/visual artefact and capture it as **`poc`**
(`{ type, ref, label }`):
- a **deployment URL** (Railway, a preview/demo link) → `type: "url"`,
  `label: "preview deployment for stakeholder feedback"`. It exists so Summit
  stakeholders can view the concept and comment — it is **not** production and never
  labelled "live" / "in production" (see B4), even if the source says so.
- a built or standalone **HTML** demo (`index.html`, `dist/`, a demo page) → `type: "html"`
- the **app itself** (has a start script / entry point) → `type: "app"`, and note
  *how to run it* in `label` (e.g. `"npm run dev"` / the entry file)
- otherwise a screenshot / recording → `type: "html"` with the file path
- nothing runnable → omit `poc`; it's an idea-stage concept.

### B3. Key features — what the concept does
Extract the **key features** into `features[]` from whatever is most concrete:
routes / pages / components, the ROADMAP's completed items, or the README feature
list. Keep them user-visible and short (a handful, not exhaustive).

### B4. Stage — honestly (and what "production" means at Summit)
- `concept` — only an idea / notes, nothing runnable.
- `explore` — there is a working visual POC or app, **including one deployed to a
  preview URL** (the common case for imports).
- **Never auto-`submit`** — submission is a deliberate self-check the Concept Writer runs.
- **Never infer `shipped` / `build` / "production" / "finalised" from a deployment URL.**
  At Summit, **production means integrated into the Visual Insights (VI) code
  environment, or another Summit-hosted project environment (e.g. DataFoundry)** — which
  only happens *after handoff*, on the Agentic Engineers' side (`build` → `shipped`). A
  standalone Railway or preview URL is a **feedback deployment**; the concept is still
  `explore`. Treat any "live in production" / "finalised" wording in the source as the
  project's own GSD phrasing, **not** Summit production — reframe it, don't copy it.

### B5. Confirm, then write — never fabricate
Present the drafted manifest (name, benefit, stage, `poc`, `features`) and ask the
Concept Writer to **confirm / edit**. If a field isn't evidenced, leave it blank or
ask — don't invent it. **Reframe any "live" / "in production" / "finalised" wording
from the source as a preview deployment for feedback** — a concept is never in
production (B4). Then write the manifest and regenerate (see **Concept Dashboard**).

**Import is read-only toward the source** — never modify the imported project. By
default it **registers only** (writes the dashboard manifest, `poc` pointing at the
source); it does **not** drop a `concepts/<name>/` overlay into someone else's
project. Scaffold an overlay only if the Concept Writer wants to keep building it
*under the framework* from here.

---

## Build & Capture (fresh concepts)

Just build. The only discipline is the **one-liner habit** in `NOTES.md` at each
fork. Nothing in NOTES is durable; if it matters it becomes a CDR when the concept
graduates. On the dashboard this reads as `stage: "explore"`.

---

## Submit (the completeness self-check)

Run when the concept is demonstrable — validates completeness **before** packaging.

1. **Locate** `concepts/<name>/`. A prior `status: "Returned"` → read its `TRI-*`
   gaps first.
2. **Validate the checklist** against reality: CHK-001/002 problem & outcome (one
   real paragraph each), CHK-003 POC baseline runs, CHK-004 ≥1 `EVD-*` (something
   that *happened*), CHK-005 decision trail non-empty, CHK-006 gaps declared.
3. **Refuse or package** — any item unmet → leave `status: "Draft"` and report which
   `CHK-*` failed. All met → write `SUBMISSION.md` from `SUBMISSION_TEMPLATE.md`,
   `status: "Submitted"`.
4. **Triage — optional, off by default.** A submitted concept is ready for
   `summit-cdr`; self-review adds nothing when the Concept Writer and Strategist are
   the same person. Turn triage on only when a genuinely different person reviews: a
   Strategist records `Accepted` / `Returned` / `Rejected` in the frontmatter;
   submitter and triager must differ.

---

## cdr/README.md to write (verbatim, into `concepts/<name>/cdr/README.md`)

```markdown
# Concept Decision Records

Decisions that define this concept — what it does, how the user experiences it,
what's deliberately out, and what it assumes. This folder is the spec that is
promoted and handed to VI development. The POC *code* is throwaway; these records
are the durable asset.

## You do not write these by hand — ever
Concept Writers never author CDRs. Just build, and drop the occasional one-liner in
NOTES.md if something feels decided. CDRs are produced retrospectively when the
concept graduates (via summit-cdr), curated by the Strategist.

## What is and isn't a CDR
- A CDR captures a settled, concept-level decision: survived a few iterations, has
  a real rejected alternative, and reversing it now would cost rework.
- The test: "would the Agentic Engineers build a different product if they didn't know this?" No → not a CDR.
- Roll up to user-visible concepts, not implementation choices (~10–30 CDRs total).
- CDRs say what and why. ADRs (the Agentic Engineers', after handoff) say how. Never prescribe stack here.

## Conventions
- One decision per file: CDR-NNN-slug.md, sequential, from CDR_TEMPLATE.md.
- Decision statements are coded (DEC-001) and individually traceable — the PRD
  references CDR-NNN:DEC-NNN. Keep them atomic.
- Status lifecycle: Needs Review → Active → Frozen → Superseded.
```

---

## Guardrails
- **A deployment URL is not production.** At Summit, production = integrated into the
  VI code environment or another Summit-hosted env (e.g. DataFoundry), which only
  happens after handoff on the Agentic Engineers' side. A Railway / preview URL is a
  stakeholder-feedback deployment — the concept stays `explore`. Never attribute
  "production", "shipped", or "finalised" to a concept because it has a URL, even if its own docs say so.
- **Import captures as-is — never fabricates.** Metadata, a visual POC pointer, and
  key features are fair game to extract. A CDR / decision trail / the "why" is not —
  that is distilled later by `summit-cdr` from a real trail.
- **Read-only toward the source.** Import never edits the imported project. It writes
  only the dashboard manifest (and, for fresh concepts, the `concepts/<name>/` overlay).
- **Capture early.** A concept entry is cheap; register/import before an idea is
  "worth" formalising, so cross-concept synergies surface.
- **No clobber.** An existing concept dir stops a fresh register — never reset a live
  NOTES/CDR set.
- **Self-check, don't gate.** Submit validates completeness so gaps surface to the
  Concept Writer; it's not a bureaucratic stop. Import never auto-submits.

---

## Concept Dashboard (final step — every mode)

Update `X:\Labs\concepts\<name>.json`, then run
`powershell -ExecutionPolicy Bypass -NoProfile -File X:\Labs\generate.ps1`:

- **Register / Import (first write):** create the manifest — `id`, `name`, `owner`
  (Concept Writer), `stage` (`concept` for an idea, `explore` when a working POC exists),
  `created`, `updated`, and **`benefit`** (one line). Add what the source yielded:
  - **`poc`** = `{ "type": "app|html|url|folder", "ref": "<path or URL>", "label": "how to open/run" }`
    — the visual POC or the app itself.
  - **`features`** = `[ "key feature", ... ]` — the concept's user-visible features.
  - `benefitDetail`, `notes`, `project`, `area` where evidenced.
- **Build & capture:** advance to `stage: "explore"`.
- **Submit:** set `stage: "submit"` and
  `submission: { status:"Submitted", problem, baselineRunnable, evidence, gaps }`.
- **Triage (if used):** set `submission.status`; on **Returned** set `stage:"returned"`; assign the Strategist as `cw`.

Bump `updated` to today. Full contract: `X:\Labs\SKILL_INTEGRATION.md`.
