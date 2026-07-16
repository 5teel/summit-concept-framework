# Legacy report grammar

Knowledge snapshot: 2026-07-10. Use [Schema invariant], [Proven pattern], [Approved exception], [Observed but unsafe / denied], and [Unresolved] exactly as evidence labels.

## Root contract

- **[Schema invariant]** A buildable legacy definition is one JSON object with `General`, `Pages`, `Datasources`, and `Views`.
- **[Schema invariant]** `Pages` and `Datasources` are arrays. `Views` is an object containing `Toolbar[]` and `Views[]`.
- **[Schema invariant]** Every view contains one `Dashboard`; every Dashboard owns `Panels[]`.
- **[Contract]** Parse before inspection. Reject comments, trailing content, duplicate JSON keys, and non-object roots.
- **[Contract]** Use [schema-allowlist.json](schema-allowlist.json) for the complete portable path/type/evidence catalogue. New work may use only allowed paths.

```json
{
  "General": {
    "OnStartup": ""
  },
  "Pages": [],
  "Datasources": [],
  "Views": {
    "Toolbar": [],
    "Views": []
  }
}
```

## Identity and references

- **[Schema invariant]** Datasource, toolbar, view, panel, Page Input, and OptionalInput keys are unique in their own namespaces.
- **[Schema invariant]** References are case-sensitive and resolve exactly: datasource dependencies, toolbar datasource/panels/views, panel datasource/connections, input expressions, tokens, invalidation lists, and export exclusions.
- **[Contract]** Generate synthetic, descriptive keys for new work. Never reuse a key from unrelated supplied content.
- **[Contract]** Never guess report IDs, measures, tags, hierarchy values, datasource names, or defaults.

## Build sequence

1. **[Contract]** Show the writer-facing Report plan and receive `execute` for that exact current plan.
2. **[Schema invariant]** Create the shell and Pages/inputs.
3. **[Schema invariant]** Create datasources in dependency order.
4. **[Schema invariant]** Create toolbars and views/Dashboards.
5. **[Schema invariant]** Add panel bases, then exactly one approved widget per panel.
6. **[Proven pattern]** Wire new builds with `OnChangeSyncPanels[]`; add styles, tokens, interactions, and exports last.
7. **[Contract]** Validate after every block and run the full suite before delivery.

## Modes

- **[Contract] New:** use only approved paths and patterns; use `OnChangeSyncPanels[]` for connections.
- **[Contract] Copy:** explain why the supplied source fits, replace only confirmed data choices, and validate as new work.
- **[Contract] Modify:** inspect all source forms, preserve unapproved/unresolved fields unchanged outside scope, preserve `DataConnections[]` when present, and write a separate candidate.

## Denied and unresolved content

- **[Observed but unsafe / denied]** Do not emit IFrame, layout-only as content, `Textbox1`, `Views1`, malformed backup keys, or modern AI blocks.
- **[Unresolved]** Do not emit unknown paths, Dropdown/ViewSelector controls, UAT-only sync variants, or undocumented export/pool fields.
- **[Contract]** In modification mode an unresolved source field may remain only if the change comparator proves it is unchanged.

## Delivery artifacts

Produce a candidate JSON, inventory, schema report, dataflow report, Textbox security report, change report when modifying, and manual VI checklist. Validation reports contain the candidate SHA-256; preserve them with the handoff to Summit's separate local publisher process.
