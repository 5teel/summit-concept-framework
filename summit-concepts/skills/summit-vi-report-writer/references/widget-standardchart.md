# StandardChart widget

Snapshot: 2026-07-10. **[Schema invariant]** PRD support: 722 reports / 431 structural families / 8,538 occurrences.

## Purpose and report questions

Use for trends, comparisons, contributions, ranked bars, area views, and other proven native chart questions. Ask which dimension forms the category axis, which supplied measures are compared, desired order, label/legend needs, and whether the reader needs zoom or redirection.

## Exact grammar

- **[Schema invariant]** The panel has a resolving `Datasource` and `StandardChart.Axes[]`.
- **[Schema invariant]** Each axis declares `Location` and `Series`. Proven series types are `horizontalbar`, `verticalbar`, `verticalstackbar`, `line`, and `area`.
- **[Schema invariant]** `Legend` uses explicit `Visible` and top/bottom/left/right `Position`.
- **[Schema invariant]** Use the intentional `LabelAngel` object with `Angel` and `MinimumDataPoint`; do not emit `LabelAngle`.

```json
{
  "Key": "pTrend",
  "Row": 6,
  "Col": 0,
  "SizeX": 40,
  "SizeY": 20,
  "Datasource": "dsSummary",
  "StandardChart": {
    "Legend": {"Visible": false, "Position": "bottom"},
    "Margin": {"top": 8, "right": 8, "bottom": 8, "left": 8},
    "StaticPalette": ["#2563EB"],
    "Axes": [
      {
        "Location": "Bottom",
        "LabelVisible": true,
        "LabelAngel": {"Angel": 0, "MinimumDataPoint": 1},
        "Series": {
          "Data": "$LabelOfSelected(Dimension:Date)",
          "Type": "line",
          "LabelVisible": false
        }
      },
      {
        "Location": "left",
        "Title": "Confirmed measure",
        "LabelFormat": "Number",
        "DecimalPlaces": 0,
        "LabelVisible": true,
        "Series": {
          "Data": "$DataOfSelected(MeasureIndexOrTag:SYNTHETIC_VALUE,DefaultValue:0)",
          "Name": "Confirmed measure",
          "Type": "line",
          "LabelVisible": false
        }
      }
    ]
  }
}
```

## Data, sorting, and wiring

- **[Schema invariant]** Axis tokens inherit panel datasource wiring and omit `Datasource:`.
- **[Schema invariant]** Dimension/measure tags exist in the datasource; sort tokens use a supplied `SortMeasureTag`.
- **[Proven pattern]** New builds register the panel in relevant toolbar `OnChangeSyncPanels[]`.
- **[Contract]** Keep chart type, aggregation, order, labels, and measure formatting explicit in the contract.

## Styles and variations

- **[Schema invariant]** Use `StaticPalette[]` for confirmed colour order; use `DynamicPalette[]` only with confirmed value/row/attribute rules.
- **[Schema invariant]** Margin, legend, label visibility/font/format, data labels, and axis titles are explicit.
- **[Proven pattern]** Scatter, waterfall, zoom, label-wrap, and redirection exist but require a supplied proven pattern and matching question; do not improvise their nested configuration.
- **[Contract]** Use non-colour cues and verify axis readability at the target screen/export size.

## Invalid example

```json
{
  "Datasource": "missingDatasource",
  "StandardChart": {
    "Axes": [
      {
        "Location": "Bottom",
        "LabelAngle": {"Angle": 45},
        "Series": {"Data": "$LabelOfSelected(Dimension:Product)", "Type": "pie"}
      }
    ]
  }
}
```

Failures: datasource does not resolve; `LabelAngle` is denied; `pie` is not in the approved series allowlist; missing value axis/measure makes the display incomplete.

## Deterministic validation

Require panel datasource and nonempty axes; validate locations/types/tokens/tags; enforce `LabelAngel`; verify legend/palette/axis fields; reject unsupported series and unresolved references; check toolbar sync, geometry, label clipping, export controls, and connection ambiguity.
