# Panel base grammar

Knowledge snapshot: 2026-07-10.

## Base fields

- **[Schema invariant]** Each panel has a unique `Key`, integer `Row`/`Col`, positive integer `SizeX`/`SizeY`, and exactly one supported widget object in new work.
- **[Schema invariant]** Native data-bearing panels declare a resolving `Datasource` when required by the widget.
- **[Proven pattern]** `Styles[]` and `HoverStyles[]` use `{Property, Value}` objects; keep styling scoped and compatible with the selected widget.

```json
{
  "Key": "pSummaryChart",
  "Row": 4,
  "Col": 0,
  "SizeX": 40,
  "SizeY": 20,
  "Datasource": "dsSummary",
  "Styles": [
    {"Property": "background", "Value": "transparent"}
  ],
  "StandardChart": {}
}
```

## Widget exclusivity

Approved widget objects:

- **[Proven pattern]** `Textbox`.
- **[Schema invariant]** `StandardChart`.
- **[Schema invariant]** `Table`.
- **[Schema invariant]** `TableV2`.
- **[Schema invariant]** `AdvanceTable`.

- **[Observed but unsafe / denied]** A panel with no widget is layout-only and is not created for new work.
- **[Observed but unsafe / denied]** IFrame is outside this skill.
- **[Unresolved]** Textbox1, Chart, datasource-display panels, and unknown widget objects are not new-build choices.

## Connections

- **[Proven pattern]** New panel synchronisation is registered from toolbars via `OnChangeSyncPanels[]`.
- **[Schema invariant]** Inspect existing `DataConnections[]` first in modification mode and preserve it; never add both connection forms.
- **[Schema invariant]** Direct `panel.Datasource` is distinct from toolbar connection state; validate both.

## Layout

- **[Schema invariant]** `Col + SizeX` remains within Dashboard columns.
- **[Schema invariant]** Panel rectangles do not overlap unless the contract explicitly identifies an intentional supported overlay.
- **[Proven pattern]** SizeY clips silently; allocate enough rows for content and labels.
- **[Contract]** Put view heading/context first, primary evidence next, and detail/notes later in row order.

## Compatibility

- **[Observed but unsafe / denied]** Preserve legacy `Column` or duplicate spelling variants only when unchanged outside modification scope; emit canonical `Col`.
- **[Contract]** Never copy panel keys, datasource names, or client-specific styles from unrelated examples.

## Validation

Reject missing/duplicate keys, noninteger geometry, out-of-bounds/overlapping panels, multiple/no supported widgets, widget/base field conflicts, unresolved datasources, ambiguous connection formats, and Textbox security violations.
