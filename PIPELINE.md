# The Concept Pipeline

> How a proof-of-concept becomes a governed VI development project.
> Five stages, three gates, one source of truth at every step.

---

## Stage Map

| Stage | Skill | Input | Output | Gate |
|---|---|---|---|---|
| 1. Explore | `summit-concept` | An idea | `concepts/<name>/` scaffold | — |
| 2. Build & Capture | (none — just build) | Scaffold | POC code + `NOTES.md` lines | — |
| 3. Harvest | `summit-concept-harvest` | NOTES + diff since last harvest | Curated `CDR-NNN` records | **Writer confirms every CDR** |
| 4. Promote | `summit-concept-promote` | Active CDR set + business case | Frozen CDRs, `PRD.md`, `promotion-record.html` | **Product / leadership approve** |
| 5. Handoff | `summit-concept-handoff` | Approved PRD + frozen CDRs | VI project seed (`PROJECT.md`, `CONTEXT.md` starters) | **Handoff validation — refuses on conflict** |

---

## Stage 1 — Explore

`summit-concept <name>` scaffolds the concept track in the POC workspace:

```
concepts/<name>/
├── NOTES.md          ← scratch buffer
├── cdr/
│   ├── README.md     ← what a CDR is / isn't
│   └── .harvest      ← harvest watermark
└── promotion/        ← empty until Stage 4
```

Additive only. If the workspace already has other tracked work, nothing else is touched.

---

## Stage 2 — Build & Capture

No skill. Build the POC however is fastest. The only discipline asked of the
Report Writer is the **one-liner habit**: when a fork in the road gets chosen,
drop a line in `NOTES.md`. Optional tags:

- `!` feels decided — harvest prioritises
- `?` open question — harvest ignores until resolved
- (no tag) observation — harvest weighs as context

Nothing in NOTES is durable. If it matters it becomes a CDR at the next harvest.

---

## Stage 3 — Harvest (gate: writer curation)

`summit-concept-harvest` diffs the workspace since the last harvest watermark,
reads NOTES, and proposes candidate CDRs. Every candidate must pass three tests:

1. **Settled** — stabilised across iterations, not still churning.
2. **Concept-level** — user-visible choice, not an implementation detail.
3. **Load-bearing** — *would IT build a different product without knowing this?*

The writer confirms / edits / discards each proposal. Nothing is written
unconfirmed. Confirmed records get sequential IDs and typed classification
(`ux | scope | data | integration`) — the type drives PRD structure at Stage 4.

Decisions that reverse an earlier CDR **supersede** it — the old record is never
edited in place. The supersession trail is the reasoning history IT needs at rebuild.

---

## Stage 4 — Promote (gate: product / leadership approval)

`summit-concept-promote` runs the promotion gate:

1. **Final harvest** — never promote a stale set.
2. **Freeze** — every `Active` CDR flips to `Frozen`; the set is now immutable.
3. **Business case** — gathered from the Report Writer; commercialisation claims
   must be sourced from product / commercial or marked `TBD` and flagged.
4. **Derive both artifacts from one source** — the frozen CDR set slices by type:

   | CDR type | PRD section | Promotion record section |
   |---|---|---|
   | `ux` | Features & Experience (`REQ-*`) | The Concept |
   | `scope` | Scope In / Out (`SCP-*`) | What's In / Out |
   | `data` | Data Requirements (`DAT-*`) | Data Story |
   | `integration` | Integration & Assumptions (`INT-*`) | Workflow Fit |

5. **Emit for approval** — PRD status `Ready for Approval`, approval block blank.
   The packager is never the approver.

**Traceability rule:** every PRD requirement carries a trace to a specific
decision statement — `CDR-004:DEC-002`, not just `CDR-004`. Sub-record tracing is
what lets IT (and AI code review) answer "why does this requirement exist?"
without re-reading the whole record set.

---

## Stage 5 — Handoff (gate: validation)

`summit-concept-handoff` runs only when:

- PRD frontmatter `status: "Approved"` **and** `approved_by` + `approved_at` +
  `approval_record` are all filled. Missing any → refuse.
- PRD content is consistent with the frozen CDR set. Conflict → refuse until
  resolved (**frozen CDRs are authoritative; the PRD is derived**).

It then produces the **VI project seed** — pre-filled starters for the Agentic
Framework's project-context files:

| PRD source | Seeds |
|---|---|
| Identity + Problem & Outcome | `PROJECT.md` → Identity block |
| Scope + Requirements tables | `CONTEXT.md` → Current Status + Active Work |
| Integration assumptions | `CONTEXT.md` → Architecture Context (assumptions to validate) |
| Success criteria + POC baseline | `CONTEXT.md` → Quality Status (acceptance reference) |

What the handoff **never** does:

- Never chooses architecture, framework, or stack — IT records those as **ADRs**
  in the Agentic Framework after handoff, constrained by `DEPENDENCY-POLICY.md`.
- Never fills approval fields itself.
- Never rewrites a frozen CDR.

---

## Precedence & Authority (locked)

1. The gate is **promotion** (`summit-concept-promote`) — one gate, one name.
2. **Frozen CDRs win** over the PRD; the PRD wins over the promotion record
   (which is presentation only).
3. **Approval is machine-readable** — PRD frontmatter, not the HTML.
4. **Additive only** — the concept track never edits files owned by another
   framework or project. New files only.
5. `summit-concept-promote` is permanently distinct from any other "promote" in
   Summit tooling — never merged, never aliased.
