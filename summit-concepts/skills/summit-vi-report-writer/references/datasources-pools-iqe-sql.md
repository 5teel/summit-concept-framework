# Datasources, pools, IQe, and SQL

Knowledge snapshot: 2026-07-10.

## Datasource grammar

- **[Schema invariant]** Each `Datasources[]` entry has unique `Index`, `Key`, and boolean `Output`.
- **[Schema invariant]** Data selections use canonical dimensions and nested `Selections[]` rows. Measure rows use supplied tags; never manufacture a measure.
- **[Schema invariant]** `Scripts.Dependencies[]` references existing datasource keys and forms an acyclic graph.
- **[Contract]** Build in topological order and validate each datasource before panels consume it.

```json
{
  "Index": 1,
  "Key": "dsSummary",
  "Output": true,
  "Selections": [
    {
      "Dimension": "Product",
      "Security": "enforce",
      "Selections": [
        {
          "Index": 1,
          "Expression": "IQe.Input(@iScope,1,Expression)",
          "Type": "FILTER",
          "GroupBy": "#[Product]"
        }
      ]
    },
    {
      "Dimension": "Measure",
      "Selections": [
        {
          "Index": 1,
          "Caption": "Confirmed measure",
          "Label": "Confirmed measure",
          "Tag": "SYNTHETIC_MEASURE_TAG",
          "Type": "SUM"
        }
      ]
    }
  ]
}
```

## RuleScope

- **[Schema invariant]** Every builder-emitted `IQe.RuleScope` enumerates Product, Market, Date, Time, Promotion, Shopper, and Basket.
- **[Approved exception]** Use `First` or `Last` per confirmed intent; all-First is the safe default.
- **[Observed but unsafe / denied]** Partial RuleScope can silently nullify sorting and is rejected.

`IQe.RuleScope(Product:First,Market:First,Date:First,Time:First,Promotion:First,Shopper:First,Basket:First)`

## Pools

- **[Schema invariant]** Canonical datasource pool fields include `Key`, `Name`, `Scope`, `Mode`, `DaysValid`, and `Renewal`.
- **[Schema invariant]** Canonical shared settings live under `General.RequestPool`; each pooled datasource still has its own `Pool.Key`.
- **[Proven pattern]** Invalidation lists contain datasource keys.
- **[Proven pattern]** Definition changes do not guarantee cached-output invalidation. Change `Pool.Key` intentionally during development when computed output changes; freeze it for delivery.
- **[Unresolved]** `Pool.Mounts` and suffixed backup keys are preserve-or-deny.

## Dependencies and scripts

- **[Schema invariant]** Script dependencies resolve before any `IQe.Datasource(...)` reference.
- **[Schema invariant]** Keep SQL-like segments inside `Scripts.Segments[]`; do not put SQL in labels, tokens, or arbitrary fields.
- **[Contract]** Treat supplied scripts as sensitive logic. Preserve unchanged outside scope and review joins, row expansion, sorting, and spool risk block by block.
- **[Observed but unsafe / denied]** Missing/cyclic dependencies, guessed fields, or unbounded heavy joins fail validation.

## CSV Import

- **[Proven pattern]** `Type: "Import"` with `Import.Fields[]` is an advanced supported path.
- **[Contract]** Require confirmed file workflow, field order, names, roles/types, and downstream dependencies. Never guess columns or hosting.

```json
{
  "Index": 2,
  "Key": "dsImported",
  "Output": true,
  "Type": "Import",
  "Import": {
    "FieldQuote": "\"",
    "Fields": [
      {"Index": 1, "Name": "SortOrder", "Type": "SortOrder"},
      {"Index": 2, "Name": "Product", "Type": "Dimension", "Dimension": "Product"},
      {"Index": 3, "Name": "Value", "Type": "Fact", "Tag": "SYNTHETIC_VALUE"}
    ]
  }
}
```

## Validation

Reject duplicate keys/indices, noncanonical dimensions, missing measure tags, unresolved inputs/dependencies, cycles, invalid pool references, partial RuleScope, unknown IQe functions/contexts, and imports without a supplied schema.
