# Table widget

Snapshot: 2026-07-10. **[Schema invariant]** PRD support: 286 reports / 154 structural families / 459 occurrences.

## Purpose and report questions

Use for supported legacy tabular views, especially preservation or a simple dimension/measure table. Ask which dimensions form columns, which supplied measure tags display, whether paging/sorting/search/copy are needed, and whether TableV2 better fits new work.

## Exact grammar

- **[Schema invariant]** The panel has a resolving `Datasource` and `Table.Columns[]`.
- **[Proven pattern]** Use an explicit `Appearance` with filter, gridline, grouping, paging, sorting, copy, and toolbar choices.
- **[Schema invariant]** Column dimensions use canonical names; measure formatting names supplied tags.

```json
{
  "Key": "pLegacyTable",
  "Row": 26,
  "Col": 0,
  "SizeX": 60,
  "SizeY": 18,
  "Datasource": "dsSummary",
  "Table": {
    "Title": "Detailed results",
    "Appearance": {
      "FilterMenu": false,
      "GridLines": "Both",
      "Grouping": false,
      "Paging": true,
      "Sorting": true,
      "Copy": true,
      "Toolbar": {"ColumnChooser": true, "QuickSearch": true}
    },
    "Columns": [
      {"Dimension": "Product", "Caption": "Product", "TextAlign": "Left", "Width": 260},
      {
        "Dimension": "Measure",
        "TextAlign": "Right",
        "Formatting": [
          {"Tag": "SYNTHETIC_VALUE", "Type": "Caption", "TextAlign": "Right", "Width": 120}
        ]
      }
    ]
  }
}
```

## Data, sorting, and interactions

- **[Schema invariant]** Column dimensions and measure tags exist in the panel datasource.
- **[Proven pattern]** `SortIndex`/`SortOrder`, hidden/frozen columns, HeaderWrap, conditional formatting, and redirection are used only from confirmed requirements.
- **[Proven pattern]** Register the panel with relevant toolbars so filters update it.
- **[Contract]** Prefer TableV2 for most new ranked/detail needs; retain Table where its proven legacy behaviour is required.

## Style, layout, and export

- **[Proven pattern]** Set column widths/text alignment and paging intentionally; ensure SizeY supports the expected page/toolbar height.
- **[Proven pattern]** Use `ForgroundColour` in supported conditional formatting; never silently correct the schema spelling.
- **[Contract]** Verify copy/search/paging/sort and export output manually.

## Invalid example

```json
{
  "Datasource": "dsSummary",
  "Table": {
    "Columns": [
      {"Dimension": "UnknownDimension", "TextAlign": "Left"},
      {"Dimension": "Measure", "Formatting": [{"Tag": "GUESSED_TAG", "Type": "Text"}]}
    ]
  }
}
```

Failures: noncanonical dimension, guessed measure, and denied Text measure-cell formatting.

## Deterministic validation

Require datasource/columns; validate canonical dimensions, supplied tags, appearance types, widths/alignment/sorts, formatting types and spelling, toolbar sync, geometry, and exports. Reject unresolved Detail variants and unsupported/guessed fields.
