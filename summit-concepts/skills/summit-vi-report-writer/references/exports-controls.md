# Exports and controls

Knowledge snapshot: 2026-07-10.

## Multi-view export

- **[Schema invariant]** Configure under `Views.MultiViewExport`.
- **[Proven pattern]** Fields are boolean `Enabled`, numeric `RenderWaitTimeMS`, and resolving `ExcludeViews[]`.
- **[Contract]** Enable only from a confirmed export requirement; list every excluded view explicitly.

```json
{
  "MultiViewExport": {
    "Enabled": true,
    "RenderWaitTimeMS": 2000,
    "ExcludeViews": []
  }
}
```

## Per-view and datasource export

- **[Unresolved]** Per-view `ExportEnabled` is code-supported but behaviour is insufficiently documented. Set only from an explicit supplied requirement and test manually.
- **[Proven pattern]** Datasource Export/ExcludeAttributes can minimise exported data when supplied by a proven source shape.
- **[Unresolved]** Undocumented Excel-label and export variants are preserve-or-deny.
- **[Contract]** Do not claim custom Textbox content exports like native charts/tables without a manual proof.

## Wider and Fullscreen

- **[Contract]** Include Wider/Fullscreen where the selected pattern requires them and name each manual test in the report contract.
- **[Proven pattern]** Native controls are preferred.
- **[Observed but unsafe / denied]** Custom Textbox fullscreen/sizing JavaScript is deprecation-risked. If unavoidable, flag it, provide a visible/accessible exit, rerun sizing after SPA navigation, pass security validation, and obtain IT sign-off.

## Redirection and drill

- **[Schema invariant]** Redirection is available only through documented widget fields and requires a supplied target report/input mapping.
- **[Contract]** Never guess a target ID, source toolbar, target input, selection conversion, or datasource clone.
- **[Contract]** Validate target facts and test foreground/new-tab behaviour in UAT2.

## Validation and manual tests

Validate view exclusions and target references, data minimisation fields, control/widget compatibility, and absence of unsupported export fields. Manually test each requested format, all views, long rendering, hidden/empty panels, Wider/Fullscreen, source notes, table headers, and chart labels.
