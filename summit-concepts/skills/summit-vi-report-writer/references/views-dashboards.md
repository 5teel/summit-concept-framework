# Views and Dashboards

Knowledge snapshot: 2026-07-10.

## View grammar

- **[Schema invariant]** The view list is `Views.Views[]`, not `Views.Dashboard[]`.
- **[Schema invariant]** Each view has unique `Index` and `Key`, plus `Title`, `ToolTip`, `Thumbnail`, and one `Dashboard`.
- **[Contract]** Give every view one business question and keep the set as small as possible.

```json
{
  "Index": 1,
  "Key": "vwOverview",
  "Title": "Overview",
  "ToolTip": "Summarises the confirmed analysis scope",
  "Thumbnail": "",
  "Dashboard": {
    "Columns": 60,
    "CellSpacing": [0, 0],
    "ShowGridLines": false,
    "AllowFloating": true,
    "AllowDragging": false,
    "AllowResizing": false,
    "Panels": []
  }
}
```

## Required Dashboard fields

- **[Schema invariant]** Require positive integer `Columns`, two-number `CellSpacing`, boolean `ShowGridLines`, `AllowFloating`, `AllowDragging`, `AllowResizing`, and `Panels[]`.
- **[Proven pattern]** Use `[0,0]`, floating true, dragging false, and resizing false as the safe delivered-report skeleton unless the contract requires otherwise.
- **[Observed but unsafe / denied]** Missing grid fields can leave a header/toolbar with a silently blank Dashboard.

## Geometry

- **[Schema invariant]** Panel `Row`, `Col`, `SizeX`, and `SizeY` are nonnegative/positive integers; `Col + SizeX` must not exceed `Columns`.
- **[Schema invariant]** Panels must not overlap unintentionally in the same view.
- **[Proven pattern]** `SizeY` is a hard clip; oversize instead of relying on hidden overflow.
- **[Proven pattern]** The grid does not automatically stack panels responsively; content inside panels must adapt.
- **[Contract]** Treat measured pixel conversions as design aids, not universal guarantees; verify target screens manually.

## View visibility

- **[Proven pattern]** `HiddenForViews[]` hides a toolbar from the UI but does not stop it initialising or syncing listed panels.
- **[Schema invariant]** Every hidden view key resolves.
- **[Unresolved]** Do not create an explicit ViewSelector. Native view-list switching is the supported pattern.

## Exports and variants

- **[Schema invariant]** `MultiViewExport` is configured at `Views` level; see [exports-controls.md](exports-controls.md).
- **[Unresolved]** Per-view `ExportEnabled` is set only when explicitly supplied/confirmed.
- **[Observed but unsafe / denied]** Root/view duplicate layout fields and spelling variants are preserve-only in modification mode; emit canonical Dashboard fields for new work.

## Validation

Reject duplicate/missing view keys, malformed Dashboard fields, out-of-bounds panels, unintended overlaps, invalid HiddenForViews/ExcludeViews references, and panels without exactly one supported widget in new work.
