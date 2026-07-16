# Connections, dataflow, and runtime

Evidence snapshot: 2026-07-10. Wiring workflow updated 2026-07-15.

## End-to-end flow

**[Schema invariant]** Model each display as:

`Page/OptionalInput → datasource selections/dependencies/pool → toolbar selection state → active view → panel → widget/tokens`

Validate every arrow. A resolving datasource alone does not prove toolbar selection state or token availability.

Writer-facing version:

`opening choice → data work → reader choice → current screen → report item`

Ask the writer only what the reader chooses and what should change. Translate that approved intent into the technical path internally.

## Connection precedence

1. **[Schema invariant]** Inspect panel `DataConnections[]` first.
2. **[Schema invariant]** Otherwise inspect `ConnectedToolbars[]`.
3. **[Proven pattern]** Otherwise reverse-map toolbar `OnChangeSyncPanels[]`.
4. **[Schema invariant]** Track direct `panel.Datasource` separately.

- **[Proven pattern]** New builds emit `OnChangeSyncPanels[]`.
- **[Schema invariant]** Modification mode preserves `DataConnections[]` when present and never dual-writes.
- **[Schema invariant]** Code defines `DataConnections[]`; the 2026-07-10 deployed evidence contains zero PRD reports using it. It is not the new-build default.
- **[Schema invariant]** `ConnectedToolbars[]` is compatibility-only because current snapshots contain no occurrences.

## Reference requirements

- **[Schema invariant]** Every datasource, input, dependency, toolbar, view, panel, token datasource/dimension/measure, pool invalidation key, and export exclusion resolves exactly.
- **[Schema invariant]** Datasource dependencies are acyclic.
- **[Proven pattern]** Each data-bearing new-build panel is listed by relevant toolbars.
- **[Proven pattern]** A Textbox using multiple datasources is synced from appropriate toolbars for each datasource.
- **[Proven pattern]** DataConnections stores copies; toolbar datasource/dimension fields are authoritative when inspecting an existing report.

## Complete wiring audit

The dataflow validator emits two review tables in its JSON result:

- `wiringAudit.toolbars[]`: each control's datasource/dimension route, visible and hidden views, panel refresh targets, invalidated datasources, duplicate targets, and whether it has any demonstrated runtime effect;
- `wiringAudit.panels[]`: each panel's view, widget/data role, direct datasource, effective connection shape, and the toolbar keys that refresh it.

Review the audit against the writer-approved interaction sketch. Static resolution proves that keys join up; it cannot prove that the writer wanted the right displays to change.

For each path, check all five layers separately:

1. **Visibility:** should the reader see the control on this view?
2. **Selection state:** which datasource and canonical dimension carry the choice?
3. **Refresh:** which exact panels update after a change?
4. **Data binding:** which datasource supplies each native widget or Textbox token?
5. **Retrieval:** which datasource pools must be discarded so refreshed panels do not reuse stale results?

Never infer one layer from another. `HiddenForViews[]` does not disable execution, `panel.Datasource` does not refresh the panel, `OnChangeSyncPanels[]` does not by itself invalidate a pool, and invalidating a datasource does not prove the intended panel was refreshed.

## Visibility and execution

- **[Proven pattern]** `Hidden`/`HiddenForViews[]` control UI visibility, not initialisation.
- **[Proven pattern]** A hidden control may supply default state, drive tokens, invalidate pools, and refresh panels.
- **[Contract]** Record every intentional hidden control and manually test first render plus view changes.

## Pool/runtime coherence

- **[Proven pattern]** `OnChangeDisablePool[]` names datasource keys.
- **[Proven pattern]** Definition edits do not necessarily invalidate cached output; intentional output changes need a deliberate pool-key plan.
- **[Schema invariant]** Missing/cyclic script dependencies fail before the panel layer.
- **[Contract]** Test datasource changes with a new retrieval; presentation-only changes normally need reload/definition refresh, not a data rerun.

## Failure signatures

| Symptom | First checks |
|---|---|
| Spinner/spool | literal dollar, datasource/script/pool failure, dependency graph |
| Blank panel | required widget fields, datasource/connection, geometry/SizeY, unsupported formatting |
| Null/invalid token | token grammar, datasource/tag/dimension, matching synced toolbar |
| Stale values | pool key/invalidation, hidden toolbar execution, wrong source connection form |
| Alphabetical instead of measure sort | complete seven-dimension RuleScope and supplied sort tag |
| Only first ranked row | datasource ranking/grouping pattern and IndexList form |

## Validation modes

- **[Contract] New:** dangling/ambiguous references are errors; OnChangeSyncPanels is mandatory for data-bearing panels.
- **[Contract] Modify:** unchanged legacy defects can be warnings only when the source comparator proves preservation; new defects are errors.
- **[Contract]** Validation reports connection choice, resolving keys, hidden/runtime state, dependency order, and all diagnostics.
