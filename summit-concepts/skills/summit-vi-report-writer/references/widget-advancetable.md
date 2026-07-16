# AdvanceTable widget

Snapshot: 2026-07-10. **[Schema invariant]** PRD support: 169 reports / 144 structural families / 186 occurrences.

## Purpose and report questions

Use for pivot/crosstab analysis where dimensions must be arranged as rows, columns, or filters. Ask which canonical dimensions occupy each location, which supplied measures display, paging/layout needs, locking, formatting, and whether the reader needs a pivot rather than a flat TableV2.

## Exact grammar

- **[Schema invariant]** Require panel `Datasource` and `AdvanceTable` with `Appearance`, `Dimensions[]`, `ClientSideProcessing`, and `ShowAttribute`.
- **[Proven pattern]** Each dimension has canonical `Dimension` and `Location` of Row, Column, or Filter.
- **[Proven pattern]** Appearance contains DimensionLayout, Paging, Spreadsheet colours, and Toolbar behaviour.

```json
{
  "Key": "pPivot",
  "Row": 44,
  "Col": 0,
  "SizeX": 60,
  "SizeY": 24,
  "Datasource": "dsSummary",
  "AdvanceTable": {
    "Title": "Pivot detail",
    "ClientSideProcessing": true,
    "ShowAttribute": false,
    "Appearance": {
      "DimensionLayout": {"MaximumSelectionsInColumn": 10},
      "Paging": {"DefaultOption": 25, "Options": [25, 50, 100], "Visible": true},
      "Spreadsheet": {
        "AttributeBackgroundColor": "#F3F4F6",
        "AttributeForegroundColor": "#111827",
        "HeaderBackgroundColor": "#E5E7EB",
        "HeaderForegroundColor": "#111827",
        "MeasureBackgroundColor": "#FFFFFF",
        "MeasureForegroundColor": "#111827",
        "SpreadsheetCellBorderColor": "#D1D5DB"
      },
      "Toolbar": {
        "AutoFitColumn": true,
        "AutoFitColumnToolbarItemVisible": true,
        "AutoUpdate": true,
        "AutoUpdateToolbarItemVisible": true,
        "DimensionLayoutToolbarItemVisible": true,
        "FixedColumnWidthPixel": 140,
        "GridlineToolbarItemVisible": true,
        "HeaderToolbarItemVisible": true,
        "ShowDimensionLayout": true,
        "ShowGridline": true,
        "ShowHeader": true,
        "ToolbarVisible": true
      }
    },
    "Dimensions": [
      {"Dimension": "Product", "Location": "Row", "IsLocked": false},
      {"Dimension": "Measure", "Location": "Column", "IsLocked": false}
    ]
  }
}
```

## Formatting and interactions

- **[Proven pattern]** Measure Formattings use supplied tags; Highlight is the proven AdvanceTable formatting type.
- **[Proven pattern]** Locking, freeze-pane, auto-fit, auto-update, grid/header toggles, and paging are explicit contract choices.
- **[Schema invariant]** Register the panel with relevant toolbars and validate its datasource dimensions/tags.
- **[Contract]** Verify pivot rearrangement, paging, toolbar controls, headers, export, and performance manually.

## Layout and risks

- **[Proven pattern]** Allocate enough width/height for row headers, column selections, and widget toolbar; clipping is silent.
- **[Contract]** Avoid heavy pivot shapes without a confirmed question and supplied data scope; validate spool/performance incrementally.
- **[Unresolved]** Undocumented conditional-format variants and noncanonical dimensions are not builder options.

## Invalid example

```json
{
  "Datasource": "dsSummary",
  "AdvanceTable": {
    "Dimensions": [
      {"Dimension": "UnknownDimension", "Location": "Diagonal"}
    ]
  }
}
```

Failures: missing required Appearance/flags, noncanonical dimension, and invalid location.

## Deterministic validation

Require the full shape; validate datasource/dimensions/locations, supplied measure tags, paging options/default, Spreadsheet and Toolbar field types, formatting allowlist, panel sync, geometry, performance risks, and export/manual controls.
