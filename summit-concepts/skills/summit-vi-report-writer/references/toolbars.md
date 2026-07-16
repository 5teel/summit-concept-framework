# Toolbars

Evidence snapshot: 2026-07-10. Wiring workflow updated 2026-07-15.

## Explain it to a report writer

Use ordinary language first:

- A **reader choice** is something such as product, location, or time that the reader can change.
- **Shown here?** answers whether that choice is visible on a particular screen.
- **What changes?** names the headline, trend, ranking, or detail items that must update after the choice changes.
- A hidden choice can still provide a starting value and drive report items. Out of sight does not mean switched off.

Only after the writer approves that behaviour should the build notes translate it to toolbar keys, `HiddenForViews[]`, `OnChangeSyncPanels[]`, and `OnChangeDisablePool[]`.

## Supported control

- **[Schema invariant]** New work uses an implicit dimension control: omit explicit `Type` and declare a canonical `Dimension`.
- **[Schema invariant]** Required fields are unique `Key`, `Caption`, `Datasource`, `Dimension`, `MinimumSelections`, `MaximumSelections`, `MultipleSelection`, and `OnChangeSyncPanels[]`.
- **[Schema invariant]** Use Product, Market, Date, Time, Promotion, Shopper, Basket, or Measure.
- **[Unresolved]** Explicit Dropdown and ViewSelector are not builder options.

```json
{
  "Key": "tbProduct",
  "Caption": "Product",
  "Dimension": "Product",
  "Datasource": "dsSummary",
  "MaximumSelections": 10,
  "MinimumSelections": 1,
  "MultipleSelection": true,
  "LockedSelections": [],
  "OnChangeSyncPanels": ["pSummaryChart"],
  "HiddenForViews": [],
  "OnChangeDisablePool": []
}
```

## Selection rules

- **[Schema invariant]** If `MultipleSelection` is false, minimum and maximum are one.
- **[Schema invariant]** Minimum is nonnegative and not greater than maximum.
- **[Proven pattern]** `LockedSelections[]` contains supplied label strings, not booleans.
- **[Schema invariant]** `SelectionStartIndex` is allowed only from a confirmed requirement and must be a nonnegative integer.
- **[Unresolved]** `MaximumVisibleSelections` and permissions are preserve-or-deny.

## Wiring

- **[Proven pattern]** New builds emit `OnChangeSyncPanels[]`; every key resolves to a panel across the report.
- **[Schema invariant]** `Datasource` resolves and its selections contain the toolbar dimension when data/label tokens need that state.
- **[Proven pattern]** Textbox tokens from multiple datasources require the panel to be synced by relevant toolbars for every referenced datasource.
- **[Proven pattern]** `OnChangeDisablePool[]` values are datasource keys.
- **[Unresolved]** `OnChangeSyncDatasource` and `OnChangeSyncToolbars` are not builder options.

## Wiring method for new work

Build a matrix before JSON:

| Reader choice | Datasource carrying the choice | Dimension | Visible views | Hidden views | Panels that refresh | Datasource pools discarded |
|---|---|---|---|---|---|---|
| `<caption>` | `<confirmed key>` | `<canonical dimension>` | `<view keys>` | `<view keys>` | `<globally unique panel keys>` | `<datasource keys or None>` |

Then check each direction:

1. Every toolbar `Datasource` exists and contains its `Dimension` selection.
2. Every `HiddenForViews[]` entry is an existing view key; visibility is reviewed separately from runtime behaviour.
3. Every `OnChangeSyncPanels[]` entry is an existing globally unique panel key and appears only once in that toolbar.
4. Every data-bearing new-build panel is refreshed by every reader choice that the approved interaction sketch says affects it.
5. A Textbox selected-state token is refreshed by the toolbar with the same datasource and dimension route.
6. Every `OnChangeDisablePool[]` entry is a datasource key with a real `Pool.Key`; never put the pool key itself in this list.
7. A toolbar with no panel refresh and no pool invalidation has no demonstrated effect. Remove it or record and test the supplied reason.
8. Test first render, each choice, every view switch, return-to-view behaviour, and a fresh retrieval after invalidation.

For modification work, do not apply this authoring form blindly. Inspect the supplied panel connection form first and preserve it as described in [connections-dataflow-runtime.md](connections-dataflow-runtime.md).

## Visibility versus execution

- **[Proven pattern]** `HiddenForViews[]` controls visibility only. A hidden toolbar can still initialise, supply token state, invalidate pools, and sync panels.
- **[Contract]** Document intentional hidden controls in the report contract and manual test list.

## Failures

- Missing/stale panel keys cause stale or disconnected displays.
- A token dimension with no matching synced toolbar can render null/invalid configuration.
- A grouped datasource may require separate controls for load triggering and grouped-label state; never infer that pattern without supplied evidence.
- Duplicate keys, unresolved datasources/views/panels, impossible bounds, and invalidation by pool name fail validation.
- Duplicate panel refresh targets, hidden-view entries, or invalidation targets fail validation. The dataflow result includes a toolbar-by-toolbar and panel-by-panel wiring audit for human review.
