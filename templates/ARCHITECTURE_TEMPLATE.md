# Solution Architecture — <Concept Name>

> Drafted by the Strategist during `summit-cdr`, after harvest and before freeze.
> This is a **concept-level buildability sketch**, not a design document — it says
> what VI surface the concept lands on, what gets built vs reused, and what data it
> needs. The Agentic Engineers' ADRs (after handoff) decide the *how*; nothing here
> prescribes stack or implementation detail. Keep every entry evidenced — if it's a
> guess, mark it as a risk instead.

## VI integration

One of: **new report** · **panel in existing report** · **backend service** ·
**DataFoundry job**

<How the concept lands in the product, one short paragraph. Name the existing
report if it extends one.>

## Components

| Kind | Component | Notes |
|---|---|---|
| reuse | <existing engine / asset from the shelf> | <why it fits> |
| adapt | <existing asset that needs modification> | <what changes> |
| build | <net-new component> | <what it does> |

`kind` vocabulary: **build** (net-new) · **reuse** (as-is from the asset shelf) ·
**adapt** (existing, needs modification). Check the shelf catalogue before marking
anything `build`.

## Data dependencies

- <cube / pool / table / external feed — one per line, prefix with its type,
  e.g. `cube: sales_weekly`>

Flag any dependency that does not exist yet — data work gates the build.

## Effort

**S | M | L** — one t-shirt size for the whole concept, judged from the components
table (an all-reuse concept is S; multiple `build` rows with new data is L).

## Risks & assumptions

- <open assumption or risk, one per line — anything above that was inferred rather
  than evidenced belongs here>

---

*Manifest mirror:* this file's content is summarised into the concept manifest's
`architecture` block (see `X:\Labs\SKILL_INTEGRATION.md`) so the dashboard renders
it; the file is the readable source, the manifest is the render feed. Keep them in
step — update both or neither.
