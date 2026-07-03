---
title: "CDR-NNN: [Decision Title — short, present tense]"
concept: "[concept-name]"
type: "ux"                        # ux | scope | data | integration — drives PRD structure
status: "Proposed"                # Proposed | Needs Review | Active | Frozen | Superseded
date: "YYYY-MM-DD"                # date the decision was taken (not recorded)
authors: "[Concept Writer name]"  # CDRs are authored by Concept Writers only —
report_writer: "[Report Writer]"  # the RW who built the POC and supplied the "why"
tags: ["concept", "decision"]
supersedes: ""                    # CDR id this replaces, if any (e.g. "CDR-004")
superseded_by: ""                 # filled in only when a later CDR overrides this one
---

# CDR-NNN: [Decision Title]

## Status

**Proposed** | Needs Review | Active | Frozen | Superseded

> `Needs Review` = harvest-inferred, not yet human-confirmed.
> `Active` = confirmed spec. `Frozen` = immutable, set by promotion.
> Never edit a reversed decision in place — write a new CDR and cross-link.

---

## Context

[The user problem or job-to-be-done that forced a choice. One short paragraph.
Why did this decision come up? What was the user trying to do?]

---

## Decision

> One statement per DEC item. Each is individually traceable — downstream
> requirements (IT's PRD) reference `CDR-NNN:DEC-NNN`, so keep statements
> atomic and present tense.

- **DEC-001**: [Primary decision statement — "Results render as a card grid."]
- **DEC-002**: [Consequential decision bundled with it, if genuinely inseparable]

---

## Evidence

> How this decision was validated in the POC. This is what separates a settled
> decision from a preference — and it feeds the business case at promotion.

- **EVD-001**: [User feedback, demo reaction, usage observation, or A/B within the POC]
- **EVD-002**: [Iterations survived — e.g. "unchanged across 3 build cycles"]

---

## Alternatives Rejected

### [Alternative 1 Name]

- **ALT-001**: **Description**: [The path not taken — brief]
- **ALT-002**: **Rejection Reason**: [Why — usually a user or feasibility reason]

### [Alternative 2 Name]

- **ALT-003**: **Description**: [Brief]
- **ALT-004**: **Rejection Reason**: [Why]

---

## Impact

> Who this affects and how it fits their workflow.
> ux: what the user sees/does differently. scope: what's deliberately in/out.
> data: the constraint and its consequence. integration: what is assumed to
> already exist in the user's flow.

- **IMP-001**: [Primary impact]
- **IMP-002**: [Secondary impact or downstream consequence]

---

## References

- **REF-001**: [Related CDR — relative path]
- **REF-002**: [Mockup, screenshot, Loom, sample output, or live POC screen]

---

## Handoff

> The Enforcement analog for concept records: how this decision is consumed
> downstream. Filled at harvest; checked at promotion and handoff.

- **HND-001**: **Requirement area**: [Which downstream requirement area this feeds —
  derived from `type`: ux → features & experience · scope → in/out of scope ·
  data → data requirements & constraints · integration → integration & assumptions.
  IT's PRD (authored outside this framework) groups by these areas.]
- **HND-002**: **What IT must preserve**: [The invariant a rebuild cannot violate —
  the thing that, if changed, means a different product was built]
- **HND-003**: **What IT may vary**: [Explicitly negotiable — implementation latitude.
  Stack, architecture, and internals are always IT's ADR call; list anything
  concept-adjacent that is also flexible]

---

## Applies To

| Concept | Downstream Requirement(s) | Status |
|---|---|---|
| [concept-name] | [optional back-reference, filled by IT once their PRD exists] | [Active / Frozen] |
