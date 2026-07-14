---
name: summit-cdr
description: The Strategist's skill (formerly summit-concept). Turns a submitted
  Concept into a frozen, handoff-ready spec — harvest CDRs, freeze them, write the
  promotion record, and hand off to the Agentic Engineers, in one flow. One hard
  stop only — the irreversible freeze. Approval and prioritisation are handled
  informally, by team consensus, not a machine gate. Part of the Summit Concept
  Framework; everything downstream (PRD, ADRs, build) is the Agentic Engineers'.
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
---

# CDRs — Harvest, Freeze, Promote, Handoff

This is the **Strategist's** single skill that turns a submitted **Concept** into a
frozen CDR set and carries it across the boundary to the **Agentic Engineers**. Run
it as one flow — the aim is throughput. There is **one hard stop**, because it guards
an expensive downstream failure, not ceremony:

1. **Freeze confirmation** — freezing CDRs is irreversible and the Agentic Engineers
   build on it. A spec that changes after they start is the costliest slowdown in the
   pipeline.

Everything else runs straight through. **Approval and prioritisation are not a hard
gate** — they're managed informally and culturally, by team consensus in meetings.
Record who/when it was agreed in `PROMOTION.md` if you like, but the handoff never
refuses for a missing approval block.

> **Roles.** Strategists author CDRs. Concept Writers supply the "why" behind
> decisions the evidence doesn't explain, and the business-case input. After handoff,
> ownership is the Agentic Engineers' under the Summit Agentic Framework; they author
> the PRD from the frozen CDR set — outside this framework.
>
> **Templates.** Every `*_TEMPLATE.md` / `*_TEMPLATE.html` referenced below lives at
> `X:\Labs\summit-concept-framework\templates\` — read it from there
> (the same share the dashboard lives on).

---

## 0. Precondition
- Read `concepts/<name>/SUBMISSION.md`. It must be `status: "Submitted"` (triage
  off) or `status: "Accepted"` (triage on). Anything else — `Draft`, `Returned`,
  `Rejected`, or missing — **refuse** and point back to `summit-concept` (submit).
- If multiple concept tracks exist and none was named, ask which.

---

## Phase A — Harvest the CDRs

### A1. Window
- Read `cdr/.harvest` for `last_harvest_commit` (if none, the repo's first commit).
- Diff working state against it (`git log` + `git diff`). Read `NOTES.md` and the
  existing `cdr/CDR-*.md` set so you don't re-propose recorded decisions and can
  detect supersessions.

### A2. Identify candidates — meet ALL of:
- **Settled** — stabilised, not still churning across commits.
- **Concept-level** — a user-visible choice, not an implementation detail. Roll
  micro-changes into one concept.
- **Load-bearing** — *would the Agentic Engineers build a different product without knowing this?* If no, drop it.

Discard aggressively; a typical harvest yields a handful, sometimes zero.

### A3. Classify each candidate
- `type`: ux | scope | data | integration (the dominant one).
- Coded items per `CDR_TEMPLATE.md`: `DEC-*` (atomic decision statements the PRD's
  requirements trace to), `EVD-*` (evidence it settled), `ALT-*` (rejected
  alternative + why), `IMP-*` (impact on the user's workflow), `HND-*` (handoff:
  what the Agentic Engineers must preserve = `HND-001`, what may vary = `HND-002`;
  the requirement area is derived from `type`).
- Mark anything you inferred rather than read directly, so the Concept Writer can
  correct it.

### A4. Curate — present, don't auto-write
Show a compact table (`# | title | type | key DEC | basis | inferred why`) and ask
the Concept Writer to **confirm / edit / discard** each row (you, the Strategist,
consult them where the "why" is inferred). Show any supersession as an old→new pair.

### A5. Write confirmed CDRs
- Create `cdr/CDR-NNN-slug.md` from `CDR_TEMPLATE.md`, continuing the sequence.
  Confirmed → `status: "Active"`; accept-but-revisit → `status: "Needs Review"`
  (cannot reach freeze until confirmed).
- Apply confirmed supersessions to existing files (status flip + cross-links only;
  never rewrite content). Never touch a `Frozen` CDR.
- Clear consumed `NOTES.md` lines; update `cdr/.harvest` (commit SHA + date).

---

## Phase B — Freeze  ⟵ THE ONE HARD STOP

- Confirm there is ≥1 `Active` CDR and **no `Needs Review` stragglers** (confirm
  them to `Active` or exclude — ask, don't decide).
- **Stop and confirm explicitly with the Strategist:** "Freeze N CDRs? This is
  irreversible — the set becomes the immutable spec the Agentic Engineers build on."
  Proceed only on an explicit yes.
- On yes: flip every `Active` CDR to `Frozen`. Record the freeze — commit + date
  into `cdr/.harvest` (`frozen_at:`) and `PROMOTION.md` frontmatter
  (`cdr_freeze_ref`). Leave the `Superseded` trail untouched.

---

## Phase C — Business case + PROMOTION.md
Collect from the Concept Writer and product (ask; never invent):
- **Value to Summit**, **who uses it** (personas / JTBD), **Summit fit** (vs the
  product & service range), **commercialisation** — **sourced from product /
  commercial, not guessed.** If unavailable, write `TBD — pending product input`
  and flag it.

Write `concepts/<name>/PROMOTION.md` from `PROMOTION_TEMPLATE.md`: concept summary,
business case (value, users, Summit fit, commercialisation — plain prose), the **freeze manifest**
(every Frozen CDR listed — handoff validates `cdr/` against this), flagged gaps.
Set `status: "Promoted"`. If the team has agreed to take it forward (consensus in a
meeting), you may note who/when in the frontmatter — but this is informational, not a
required gate.

Then render `promotion/promotion-record.html` from `PROMOTION_RECORD_TEMPLATE.html`
**from PROMOTION.md's content** (presentation only), linking the live POC and repo
baseline. Reconcile any disagreement toward the source: frozen CDRs > PROMOTION.md > HTML.

---

## Phase D — Handoff (validate, then package)

### D1. Validate — refuse loudly, not silently
Run ALL before writing the package; any failure stops the handoff:
1. **Frozen set matches the freeze manifest** — every CDR in PROMOTION.md's manifest
   exists in `cdr/` as `Frozen`, and no Frozen CDR is omitted. Drift → refuse.
2. **No `Needs Review` stragglers.**
3. **No PRD in the package** — a `promotion/PRD.md` or similar must not exist; it's
   the Agentic Engineers' downstream artifact.

(No approval-block check — approval is cultural, not a machine gate.)

### D2. Package the Concept for handoff
Resolve the Agentic Framework's `project-context/` templates (`PROJECT_TEMPLATE.md`,
`CONTEXT_TEMPLATE.md`; ask for the path if unreachable). Write to `promotion/handoff/`
(never into the Agentic Engineers' repos):
```
promotion/handoff/
├── PROJECT.seed.md       ← PROJECT_TEMPLATE, pre-filled from the Concept
├── CONTEXT.seed.md       ← CONTEXT_TEMPLATE, pre-filled from the Concept
├── PROMOTION.md          ← copy of the promotion record
├── cdr/                  ← copy of the frozen set + superseded trail (read-only)
└── HANDOFF-MANIFEST.md   ← inventory, provenance, what the Agentic Engineers do next
```
- **PROJECT.seed.md** — Identity from §1; Status `Handoff — pre-development`; stack
  fields **N/A-to-be-decided** (the Agentic Engineers' ADR call); Non-Negotiable
  Rules = each frozen CDR's `HND-001` invariant.
- **CONTEXT.seed.md** — Current Status `Handoff received — pending project scaffold`;
  Active Work = frozen `DEC-*` grouped by requirement area (ids preserved for
  `CDR-NNN:DEC-NNN` tracing); Architecture Context = frozen `integration` CDRs as
  assumptions to validate first; Quality Status = `EVD-*` + `poc_baseline` as the
  acceptance reference.
- **HANDOFF-MANIFEST.md** — concept name, freeze ref, artifact inventory, and the
  Agentic Engineers' next steps (scaffold under the Agentic Framework, pull the
  seeds, author the PRD from the frozen CDRs, validate integration assumptions, write
  ADRs, build to the evidence). Boundary rules they inherit: frozen CDRs are never
  edited and win any conflict; the POC code is a throwaway reference, never a starting
  codebase.

---

## Report
Package path + inventory, frozen-CDR count, any `HND-002` latitude notes and
TBD/flagged gaps. State plainly: the concept framework's job ends here — the PRD,
ADRs, and build are the Agentic Engineers' under the Summit Agentic Framework.

## Guardrails
- **One stop, no more.** Only the irreversible **freeze** gets an explicit
  confirmation. Everything else runs straight through — don't add gates. Approval and
  prioritisation are decided informally, by team consensus.
- **Only `Active` CDRs freeze**; `Needs Review` must be confirmed or excluded first.
- **Never touch a `Frozen` CDR.** New contradicting evidence is a fresh cycle, not an edit.
- **Frozen CDRs win** every conflict; reconcile derived artifacts toward them, never the reverse.
- **No PRD, ever** — not authored, not packaged. The Agentic Engineers own that after handoff.
- **Don't invent** commercialisation or Summit-fit — source it or mark `TBD` and flag it.
- **Package, don't scaffold** — write into `promotion/handoff/`; the Agentic Engineers scaffold the real project.
- **Complete or refuse.** A partial handoff is worse than none.

---

## Concept Dashboard (final step)

Update `X:\Labs\concepts\<name>.json`, then run
`powershell -ExecutionPolicy Bypass -NoProfile -File X:\Labs\generate.ps1`:

- **While harvesting / freezing / promoting:** set `stage: "graduate"`, populate
  `cdrs[]` (`{ id, title, type, status }`, flipping to `Frozen` at Phase B), and set
  `promotion: { status }` (`Promoted`; add `agreedBy`/`agreedAt` only if the team noted it).
- **After handoff (package emitted):** set `stage: "handoff"` and
  `handoff: { seedDelivered:true, viProject }`.

This is the concept side's last manifest write — everything after handoff is the
Agentic Framework's to update (PRD, build, review). Bump `updated`. Contract:
`X:\Labs\SKILL_INTEGRATION.md`.
