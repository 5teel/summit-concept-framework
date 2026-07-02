# The Concept Pipeline

> How a proof-of-concept becomes a governed VI development project.
> Six stages, four gates, one source of truth at every step.
>
> Roles: **RW** = Report Writer · **CW** = Concept Writer · **IT** = VI development.
> The role separation is the pipeline's quality mechanism: RWs explore freely,
> CWs filter and formalise, IT builds. No stage accepts unfiltered input from
> the stage before it.

---

## Stage Map

| Stage | Role | Skill | Input | Output | Gate |
|---|---|---|---|---|---|
| 1. Explore | RW | `summit-concept` | An idea | `concepts/<name>/` scaffold | — |
| 2. Build & Capture | RW | (none — just build) | Scaffold | POC code + `NOTES.md` lines | — |
| 3. Submit | RW → CW | `summit-concept-submit` | Demonstrable POC | `SUBMISSION.md` | **Triage — CW accepts / returns / rejects** |
| 4. Harvest | CW | `summit-concept-harvest` | Accepted submission + diff | Curated `CDR-NNN` records | **CW confirms every CDR** |
| 5. Promote | CW | `summit-concept-promote` | Active CDR set + business case | Frozen CDRs, `PROMOTION.md`, HTML record *(+ PRD by exception)* | **Product / leadership approve** |
| 6. Handoff | CW → IT | `summit-concept-handoff` | Approved promotion | VI project seed; **IT authors PRD** *(default)* | **Handoff validation — refuses on conflict** |

---

## Stage 1 — Explore (RW)

`summit-concept <name>` scaffolds the concept track in the POC workspace:

```
concepts/<name>/
├── NOTES.md          ← scratch buffer
├── cdr/
│   ├── README.md     ← what a CDR is / isn't
│   └── .harvest      ← harvest watermark
└── promotion/        ← empty until Stage 5
```

Additive only. If the workspace already has other tracked work, nothing else is touched.

---

## Stage 2 — Build & Capture (RW)

No skill. Build the POC however is fastest. The only discipline asked of the
Report Writer is the **one-liner habit**: when a fork in the road gets chosen,
drop a line in `NOTES.md`. Optional tags:

- `!` feels decided — harvest prioritises
- `?` open question — harvest ignores until resolved
- (no tag) observation — harvest weighs as context

Nothing in NOTES is durable. If it matters it becomes a CDR at the next harvest.

---

## Stage 3 — Submit (gate: Concept Writer triage)

**This is the pipeline's quality filter.** Report Writers do not put concepts
into the pipeline — they submit them, and a Concept Writer decides what enters.

`summit-concept-submit` (run by the RW) validates the completeness checklist
**before** packaging — an incomplete submission is stopped at the Report
Writer's desk, not discovered mid-pipeline:

- **Problem & outcome** articulated — one paragraph each
- **Runnable POC baseline** — a link, and it must actually run
- **Validation evidence** — demo feedback, usage observation, anything real
- **Decision trail** — `NOTES.md` has capture (an empty buffer after weeks of
  building means the trail is unrecoverable)
- **Known gaps declared** — declared incompleteness is triage information;
  *undeclared* incompleteness is a Return

It writes `concepts/<name>/SUBMISSION.md` with checklist state and
`status: "Submitted"`.

**Triage (CW):** the Concept Writer reviews and sets the verdict in the
SUBMISSION frontmatter:

| Verdict | Meaning | Effect |
|---|---|---|
| `Accepted` | Complete enough to formalise | Harvest may run; CW assigned |
| `Returned` | Named gaps — fixable | Back to RW with a gap list; resubmit when closed |
| `Rejected` | Not viable as a concept | Track closes; rationale recorded |

**No skill downstream of this gate runs against a concept that is not
`Accepted`.** Harvest checks and refuses.

---

## Stage 4 — Harvest (gate: Concept Writer curation)

`summit-concept-harvest` (run by the **CW**) diffs the workspace since the last
harvest watermark, reads NOTES, and proposes candidate CDRs. Every candidate
must pass three tests:

1. **Settled** — stabilised across iterations, not still churning.
2. **Concept-level** — user-visible choice, not an implementation detail.
3. **Load-bearing** — *would IT build a different product without knowing this?*

The **Concept Writer** confirms / edits / discards each proposal — consulting
the Report Writer for the "why" behind decisions the evidence doesn't explain.
Nothing is written unconfirmed. Confirmed records get sequential IDs and typed
classification (`ux | scope | data | integration`) — the type drives PRD
structure downstream.

Decisions that reverse an earlier CDR **supersede** it — the old record is never
edited in place. The supersession trail is the reasoning history IT needs at rebuild.

---

## Stage 5 — Promote (gate: product / leadership approval)

`summit-concept-promote` (run by the **CW**) runs the promotion gate:

1. **Final harvest** — never promote a stale set.
2. **Freeze** — every `Active` CDR flips to `Frozen`; the set is now immutable.
3. **Business case** — gathered from the RW and product; commercialisation
   claims must be sourced from product / commercial or marked `TBD` and flagged.
4. **`PROMOTION.md`** — the machine-readable promotion document: business case,
   freeze manifest, PRD-path declaration, and the **approval block** (blank at
   this stage). The HTML record renders from it — presentation only.
5. **PRD — exception path only.** By default no PRD is written here; IT authors
   it after handoff. A Concept Writer authors it now *only* when product /
   leadership want requirements fixed at approval time, or IT requests it —
   and records which trigger applied in `PROMOTION.md`.

**Approval:** product / leadership fill the approval block in `PROMOTION.md`
frontmatter (`approved_by`, `approved_at`, `approval_record`, status →
`"Approved"`). The packager is never the approver.

**Traceability rule (both PRD paths):** every PRD requirement carries a trace to
a specific decision statement — `CDR-004:DEC-002`, not just `CDR-004`.
Sub-record tracing is what lets IT (and AI code review) answer "why does this
requirement exist?" without re-reading the whole record set.

---

## Stage 6 — Handoff (gate: validation)

`summit-concept-handoff` (run by the **CW**) runs only when:

- `PROMOTION.md` frontmatter `status: "Approved"` **and** `approved_by` +
  `approved_at` + `approval_record` are all filled. Missing any → refuse.
- The frozen CDR set matches the freeze manifest. Drift → refuse.
- If an exception-path PRD exists: it is consistent with the frozen CDR set.
  Conflict → refuse until resolved (**frozen CDRs are authoritative; every PRD
  is derived**).

It then produces the **VI project seed** — pre-filled starters for the Agentic
Framework's project-context files:

| Source | Seeds |
|---|---|
| PROMOTION.md problem & outcome | `PROJECT.md` → Identity block |
| Frozen CDR `HND-002` invariants | `PROJECT.md` → Non-Negotiable Rules |
| Frozen `scope` / `ux` CDRs | `CONTEXT.md` → Current Focus + Active Work |
| Frozen `integration` CDRs | `CONTEXT.md` → assumptions to validate first |
| POC baseline + `EVD-*` evidence | `CONTEXT.md` → Quality Status (acceptance reference) |

**Then IT takes over.** In most cases IT's first act is **authoring the PRD**
from the frozen CDR set using this framework's `PRD_TEMPLATE.md` — the team
that builds writes the requirements it will build to. From there development
runs entirely under the Summit Agentic Framework: ADRs for the *how*,
`DEPENDENCY-POLICY.md` for libraries, project-context files kept current.

What the handoff **never** does:

- Never chooses architecture, framework, or stack.
- Never fills approval fields itself.
- Never rewrites a frozen CDR.

---

## Precedence & Authority (locked)

1. The gate into the pipeline is **Submission triage** — Report Writers submit;
   Concept Writers admit. Nothing bypasses it.
2. The gate out is **promotion approval** (`summit-concept-promote`) — one gate,
   one name.
3. **Frozen CDRs win** over any PRD (whichever role authored it); the PRD wins
   over the promotion record (which is presentation only).
4. **Approval is machine-readable** — `PROMOTION.md` frontmatter, not the HTML,
   not the PRD.
5. **Additive only** — the concept track never edits files owned by another
   framework or project. New files only.
6. **Role separation is enforced by the skills**: submit refuses an incomplete
   checklist; harvest refuses an un-triaged concept; handoff refuses an
   unapproved promotion. A skill that can't verify its gate, refuses.
7. `summit-concept-promote` is permanently distinct from any other "promote" in
   Summit tooling — never merged, never aliased.
