# TableV2 widget

Snapshot: 2026-07-10. **[Schema invariant]** PRD support: 172 reports / 112 structural families / 590 occurrences.

## Purpose and report questions

Use as the preferred native ranked/detail table for new work. Ask which dimensions and exact measure tags display, desired ranking/sort, paging/search/copy needs, contextual formatting, and whether a proven detail drill is supplied.

## Exact grammar

- **[Schema invariant]** Require panel `Datasource`, `TableV2.Appearance`, and nonempty `Columns[]`.
- **[Schema invariant]** Appearance fields include `FilterMenu`, `GridLines` (None/Horizontal/Vertical/Both), `Grouping`, `Paging`, `Sorting`, `Copy`, and `Toolbar` with ColumnChooser/QuickSearch.
- **[Schema invariant]** Columns declare canonical `Dimension`; Measure columns use `Formatting[]` with supplied `Tag`.

```json
{
  "Key": "pRanking",
  "Row": 6,
  "Col": 40,
  "SizeX": 20,
  "SizeY": 20,
  "Datasource": "dsSummary",
  "TableV2": {
    "Appearance": {
      "FilterMenu": false,
      "GridLines": "Horizontal",
      "Grouping": false,
      "Paging": true,
      "Sorting": true,
      "Copy": true,
      "Toolbar": {"ColumnChooser": true, "QuickSearch": true}
    },
    "Columns": [
      {"Dimension": "Product", "Caption": "Product", "TextAlign": "Left", "Width": 220},
      {
        "Dimension": "Measure",
        "TextAlign": "Right",
        "Formatting": [
          {
            "Tag": "SYNTHETIC_VALUE",
            "Type": "Status",
            "TextAlign": "Right",
            "SortIndex": 1,
            "SortOrder": "DESC",
            "Condition": [
              {"From": "*", "Value": "$(Measure)", "ForgroundColour": "#1F2937", "BackgroundColour": "#F3F4F6"}
            ]
          }
        ]
      }
    ]
  }
}
```

## Formatting decision

- **[Schema invariant]** Allowed new measure-cell types are Bar, Circle, and Status.
- **[Approved exception]** Caption is allowed only in its documented contextual role.
- **[Observed but unsafe / denied]** Text and Number are denied for measure cells; Text can render blank.
- **[Schema invariant]** Use the intentional `ForgroundColour` spelling. `ForegroundColour` is denied.
- **[Schema invariant]** Bar formatting supplies numeric Min/Max; condition rows supply From/Value and confirmed colours.

## Data, sorting, drill, and export

- **[Schema invariant]** All dimensions/tags/aggregate datasource fields resolve.
- **[Proven pattern]** SortIndex/SortOrder, RankOnSort, frozen/hidden columns, filterability, chooser inclusion, and header wrapping are explicit choices.
- **[Schema invariant]** `Detail` and aggregate datasource forms are supported only when copied from a supplied proven shape and fully resolved.
- **[Proven pattern]** Register the panel with relevant toolbars; verify paging/search/copy/sort, drill, and export.

## Invalid example

```json
{
  "Datasource": "dsSummary",
  "TableV2": {
    "Appearance": {"GridLines": "Diagonal"},
    "Columns": [
      {"Dimension": "Measure", "Formatting": [{"Tag": "SYNTHETIC_VALUE", "Type": "Text", "ForegroundColour": "#000000"}]}
    ]
  }
}
```

Failures: incomplete Appearance, invalid GridLines, denied Text, and wrong colour-key spelling.

## Deterministic validation

Require complete Appearance/Columns; validate datasource/dimensions/tags, formatting allowlist/spelling/conditions/bar bounds, sort fields, detail/aggregate references, toolbar sync, geometry, interactions, and exports. Treat blank cells as a formatting diagnostic before a data diagnosis.
