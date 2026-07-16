# Textbox widget

Snapshot: 2026-07-10. **[Proven pattern]** PRD support: 847 reports / 502 structural families / 36,508 occurrences.

## Purpose and report questions

Use for headings, explanatory text, KPI/benchmark summaries, source notes, and policy-compliant token-driven layouts. Ask what the reader must understand, which supplied datasource values are needed, and whether static content/native widgets can answer the question before considering JavaScript.

## Exact grammar

- **[Schema invariant]** Require all five fields: `Content`, `TextColor`, `BackgroundColor`, `VerticalAlign`, `HorizontalAlign`.
- **[Schema invariant]** Vertical alignment: top/middle/bottom. Horizontal alignment: left/center/right.
- **[Proven pattern]** Keep panel-level `Content` absent; use `Textbox.Content` only.
- **[Contract]** Run literal-dollar and nine-rule security validation for every Content string.

```json
{
  "Key": "pNarrative",
  "Row": 0,
  "Col": 0,
  "SizeX": 60,
  "SizeY": 6,
  "Styles": [
    {"Property": "background", "Value": "transparent"}
  ],
  "Textbox": {
    "Content": "<section id='syn-summary'><h2>Performance overview</h2><p>$LabelOfSelected(Datasource:dsSummary,Dimension:Product)</p><p>$DataOfSelected(Datasource:dsSummary,MeasureIndexOrTag:SYNTHETIC_VALUE,DefaultValue:0)</p></section>",
    "TextColor": "#1F2937",
    "BackgroundColor": "transparent",
    "VerticalAlign": "middle",
    "HorizontalAlign": "center"
  }
}
```

## Data, tokens, and wiring

- **[Proven pattern]** Textbox data/label tokens name their datasource explicitly.
- **[Schema invariant]** Datasource, dimension, measure tag, input, and toolbar references resolve exactly.
- **[Proven pattern]** Sync this panel from relevant toolbars for every datasource whose selection-state tokens it uses.
- **[Proven pattern]** Use measure tags for script/detailed datasources; do not guess numeric indices.
- **[Contract]** Test each token visibly before hiding it or letting JavaScript consume it.

## Style and layout

- **[Proven pattern]** Prefer pure HTML/scoped CSS with middle/center alignment. Use panel-specific IDs/classes to avoid platform collisions.
- **[Proven pattern]** Responsive `clamp()` works when multi-unit arithmetic is wrapped in `calc()`.
- **[Proven pattern]** SizeY clips silently. Use explicit inner heights where a nested percentage height would collapse.
- **[Observed but unsafe / denied]** Inline handlers/JS sizing still work but are on a deprecation runway; flag them and require IT verification/sign-off.

## Interactions and exports

- **[Proven pattern]** Prefer native toolbar/view interactions and CSS-only disclosure.
- **[Proven pattern]** If JavaScript is genuinely required, prefer document-level delegated listeners so SPA view navigation does not destroy behaviour.
- **[Contract]** Confirm Textbox rendering in browser and exports; do not assume complex DOM/CSS exports identically.

## Invalid example

```json
{
  "Textbox": {
    "Content": "<p>Sales of $1.2M</p><script>fetch('/api/example')</script>",
    "TextColor": "#111111",
    "BackgroundColor": "#FFFFFF",
    "HorizontalAlign": "left"
  }
}
```

Failures: missing `VerticalAlign` can render blank; the raw currency dollar can spool; fetch violates Rule 1; script-bearing content requires IT review even after correction.

## Deterministic validation

Require all five fields; validate known tokens and literal dollars; prohibit network/secrets/storage/dynamic code/external resources/invalid images/iframes/navigation; apply PRD debug rules; reject stale panel Content; check datasource/measure/dimension/toolbars; warn on inline handlers and mark IT sign-off required. See [textbox-security.md](textbox-security.md) and [tokens.md](tokens.md).
