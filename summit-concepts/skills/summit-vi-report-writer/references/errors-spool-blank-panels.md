# Errors, spool failures, blank panels, and stale data

Knowledge snapshot: 2026-07-10.

## Evidence labels

- **[Schema invariant]** Required by the code schema or binding platform facts.
- **[Proven pattern]** Repeatedly deployed and consistent with the schema.
- **[Observed but unsafe / denied]** Seen in evidence but unsafe to author.
- **[Unresolved]** Preserve only when supplied; never emit for new work.

## Diagnose in this order

1. Parse the JSON and run all packaged validators.
2. Confirm the root, Page, Datasources, Views, Dashboards, panel bases, and Textbox required fields.
3. Resolve every datasource, toolbar, panel, view, dependency, token, and pool reference.
4. Check literal-dollar and Textbox security failures.
5. Check chart axes, TableV2 formatting, and grid geometry.
6. Render in VI and repeat the interaction, export, wider, and fullscreen tests from the contract.

Do not repair a silent failure by deleting unknown supplied fields. In modification mode, preserve supplied unknowns outside scope and make the smallest validated change.

## Failure catalogue

| Symptom | Likely cause | Required response |
|---|---|---|
| Whole view is blank | Page input is a bare string instead of an object | **[Schema invariant]** Restore the object form and validate required fields. |
| Dashboard panel disappears | Dashboard entry lacks a required base field | **[Schema invariant]** Restore `Key`, `ViewKey`, `SizeX`, `SizeY`, `Row`, and `Column` as applicable. |
| Textbox is blank | One of its five required fields is absent | **[Schema invariant]** Supply `Content`, `TextColor`, `BackgroundColor`, `VerticalAlign`, and `HorizontalAlign`. |
| Report silently spools | Unrecognised literal `$` in content or script | **[Schema invariant]** Use a recognised token or encode static currency as `&#36;`. Never invent a token. |
| Script text appears on screen | Attribute quoting is broken | **[Proven pattern]** Correct quoting; prefer scoped listeners over complex inline handlers. |
| Chart is blank or siblings misbehave | Category axis omits intentional `LabelAngel` | **[Schema invariant]** Add the exact proven key, including its spelling, and rerun validation. |
| TableV2 measure cells are blank | Measure uses `Formatting.Type: Text` | **[Observed but unsafe / denied]** Use Bar, Circle, or Status; use Caption only in its documented context. |
| Panel is blank or stale | Datasource, toolbar, panel, token, or view reference is missing/dangling | **[Schema invariant]** Fix the reference graph; do not mask it with fallback HTML. |
| Hidden toolbar behaves unexpectedly | Visibility was confused with execution | **[Schema invariant]** Validate each view; hidden toolbars can still initialise and synchronise panels. |
| Data does not refresh | Pool invalidation is absent or mismatched | **[Schema invariant]** Align datasource pool keys and invalidation targets. |
| Script fails, data is stale, or panel is blank | Datasource dependency is missing or cyclic | **[Schema invariant]** Add the confirmed edge or remove the cycle. |
| Content clips or overlays another panel | Grid geometry overlaps, exceeds bounds, or is undersized | **[Schema invariant]** Reflow the dashboard and test each responsive state. |
| Export leaks a field | Datasource export exclusions are incomplete | **[Proven pattern]** Add confirmed `ExcludeAttributes[]` and test the produced export. |

## Stale Textbox content

**[Schema invariant]** A copied panel can retain obsolete labels, links, scripts, token references, or data assumptions in `Textbox.Content`. A legacy panel-level `Content` beside `Textbox` is not the canonical content location and is rejected for new work.

For every modification, inspect `Textbox.Content`, apply the full security/token checks, fail dangling references, and keep its language consistent with the current report contract. Preserve an unrelated supplied panel-level `Content` only when the change comparator proves it is unchanged outside scope.

## Known limits

- **[Unresolved]** There is no confirmed generic spool-mechanics model and no confirmed 62k Textbox `Content` limit. Do not encode either as fact.
- Static validation cannot prove VI rendering, backend measure semantics, export fidelity, responsive behaviour, or pool timing.
- A clean validator result is necessary but never replaces the mandatory VI rendering checklist.

## Validation handoff

Run the full validator for the candidate and retain its SHA-bound result. Review every warning. A failure blocks candidate delivery and the separate publisher handoff; a warning requires a recorded disposition or human test. See [validation-contract.md](validation-contract.md).

## Evidence note

Snapshot 2026-07-10 covers 1,476 eligible deployed legacy reports and 72,250 panels across production-authoritative and supporting UAT2 evidence. The listed silent-failure mechanisms are binding facts or deterministic reference-graph checks; frequency does not make an unsafe pattern approved.
