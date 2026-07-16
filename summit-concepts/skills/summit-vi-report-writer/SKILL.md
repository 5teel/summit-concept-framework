---
name: summit-vi-report-writer
description: Builds, extends, repairs, and validates legacy Visual Insights report definition JSON safely. Use when the user wants to create, build, extend, repair, or modify a legacy Visual Insights report definition JSON, shape a report from business requirements, validate a supplied legacy VI report, diagnose blank or stale panels, or compare a candidate with its source.
---

# Summit VI Report Writer

Build only from the packaged contract and confirmed user inputs. Speak to the report writer in ordinary report-writing language; keep tags, keys, datasource syntax, and schema terms in internal build notes unless the writer asks to see them. Never guess measures, tags, datasource names, inputs, report IDs, defaults, hierarchy values, or client presets. A matching packaged client measure pack may propose candidates, but the writer must choose before an exact tag enters the contract. Never overwrite a supplied source file.

This skill ships no client measures. Confirmed client measure packs are supplied at build time from the connected Summit Labs `client-packs/<client-key>/` store (see the client-packs index); a report for a client requires that client's pack or supplied measure exports.

## Start here

1. Resolve the installed skill root from this `SKILL.md` path. Resolve every bundled script/reference from that root; never assume the user's working directory is the skill directory.
2. Read [references/qa-and-build-workflow.md](references/qa-and-build-workflow.md).
3. Shape the request in business language, asking no more than three questions at once. Ask for an example, screenshot, source report, hand sketch, or sample output whenever words alone leave the intended result unclear.
4. Use simple screen and interaction sketches when they will expose ambiguity, then fill [references/report-contract-template.md](references/report-contract-template.md).
5. Show the writer-facing **Report plan** first. It must state what each screen answers, what the reader can choose, what changes after each choice, the proposed layout, the confirmed business meanings, assumptions, gaps, and human checks.
6. Do not write any report JSON until all blocking gaps are resolved and the writer replies `execute` to the current plan. A general approval such as “looks good” is not execution authority. Any material plan change cancels the earlier execution authority.
7. After `execute`, read only the routed references needed for the confirmed build, create a separate candidate, and validate it.

If the user supplies an existing definition, inventory it first. Use modification mode when changing it; preserve everything outside confirmed scope and create a separate candidate. Use copy mode only when the supplied pattern genuinely matches the new story and data shape.

## Evidence rules

Use these labels exactly when explaining platform support:

- **[Schema invariant]** binding fact or verified code schema.
- **[Proven pattern]** repeated deployed pattern consistent with higher authority.
- **[Approved exception]** narrow reviewed exception; never generalise.
- **[Observed but unsafe / denied]** reject for authoring.
- **[Unresolved]** preserve unchanged in modification mode or deny for new work.
- **[Contract]** builder workflow/safety requirement.

Read [references/knowledge-manifest.md](references/knowledge-manifest.md) when authority, snapshot coverage, compatibility, or a conflict matters. Do not promote a frequent unsafe field. Record missing platform facts as gaps; do not probe a live system.

## Route the build

Read the smallest applicable set:

| Need | Reference |
|---|---|
| Root, modes, identity, build order | [references/report-grammar.md](references/report-grammar.md) |
| Page inputs and DateRange exception | [references/pages-inputs.md](references/pages-inputs.md) |
| Datasources, pools, IQe, SQL, CSV Import | [references/datasources-pools-iqe-sql.md](references/datasources-pools-iqe-sql.md) |
| Confirmed client-specific measures | The skill ships none. When the datasource's client is confirmed, resolve that client's pack from the connected Summit Labs share (`client-packs/<client-key>/`) and open its `measure-guide.md` and `measures.json` |
| Confirmed client-specific Golden patterns | From the same `client-packs/<client-key>/` pack, open `golden-report-guide.md` and the sanitized blueprint JSON, when present |
| Views, Dashboards, grid geometry | [references/views-dashboards.md](references/views-dashboards.md) |
| Filter controls and visibility | [references/toolbars.md](references/toolbars.md) |
| Panel base and widget exclusivity | [references/panel-base.md](references/panel-base.md) |
| Connections, dependencies, refresh runtime | [references/connections-dataflow-runtime.md](references/connections-dataflow-runtime.md) |
| Token syntax and literal dollars | [references/tokens.md](references/tokens.md) |
| Styles, responsive layout, accessibility | [references/styles-layout-accessibility.md](references/styles-layout-accessibility.md) |
| Export and controls | [references/exports-controls.md](references/exports-controls.md) |
| Textbox security/CSP | [references/textbox-security.md](references/textbox-security.md) |
| Blank, spool, stale, and clipping failures | [references/errors-spool-blank-panels.md](references/errors-spool-blank-panels.md) |
| Validation commands and manual checklist | [references/validation-contract.md](references/validation-contract.md) |
| Complete path/type catalogue | [references/schema-allowlist.json](references/schema-allowlist.json) |

## Route each supported widget one-to-one

| Approved widget | Reference | Use |
|---|---|---|
| Textbox | [references/widget-textbox.md](references/widget-textbox.md) | Narrative, headings, KPI text, safe token-driven HTML/CSS |
| StandardChart | [references/widget-standardchart.md](references/widget-standardchart.md) | Native trends and comparisons |
| Table | [references/widget-table.md](references/widget-table.md) | Supplied legacy table patterns |
| TableV2 | [references/widget-tablev2.md](references/widget-tablev2.md) | Preferred ranked/detail table |
| AdvanceTable | [references/widget-advancetable.md](references/widget-advancetable.md) | Pivot/crosstab questions |

Do not offer Chart, IFrame, datasource-display panels, Textbox1, layout-only panels, or any unknown widget. Unsupported requests get the closest approved alternative.

## Author in dependency order

1. Create the root shell, Pages, Page Inputs, and OptionalInputs.
2. Create datasources in topological dependency order using only supplied measures/tags or writer-confirmed tags from the matching client pack, plus canonical dimensions.
3. Create toolbars and the smallest coherent set of views/Dashboards.
4. Add each panel base and exactly one routed widget.
5. Wire tokens, datasource references, pool invalidation, view visibility, and refresh connections.
6. Add styles, accessibility, interactions, Wider/Fullscreen, and export controls from the confirmed contract.
7. Pretty-print the candidate JSON and keep the source unchanged.

Before authoring the wiring, draw a control-to-display matrix from the confirmed plan. For every control record where it is shown, which panels it refreshes, which datasource state it carries, and which datasource pools it invalidates. Treat visibility, initialisation, refresh, direct panel data binding, and pool invalidation as separate decisions.

For new work, emit `toolbar.OnChangeSyncPanels[]`. In modification mode inspect panel `DataConnections[]` first, preserve the supplied source format, and never dual-write. Code defines `DataConnections[]`, but the 2026-07-10 deployed evidence has zero production reports using it.

Every builder-emitted `IQe.RuleScope` must enumerate Product, Market, Date, Time, Promotion, Shopper, and Basket with First/Last; use all-First when intent supplies no alternative. TableV2 measure cells allow Bar, Circle, and Status; Caption only in its documented context; deny Text/Number and keep the intentional `ForgroundColour` spelling. DateRange and CSV Import are only the narrow routed exceptions.

## Validate fail-closed

Require Node.js 20 or newer. Validators use the Node standard library and no network.

```text
node "<absolute-skill-root>/scripts/inventory-report.mjs" source.json --out-dir results/inventory
node "<absolute-skill-root>/scripts/validate-report.mjs" candidate.json --mode new --environment prd --out-dir results/validation
node "<absolute-skill-root>/scripts/validate-report.mjs" candidate.json --mode modify --source source.json --allowed-file allowed-changes.json --environment prd --out-dir results/validation
```

When the contract confirms a client, validate against that client's pack directory: add `--client-pack-dir <absolute path to the connected client-packs/<client-key>>`. The validator rejects unknown tags and warns when a tag is not corpus-proven. Never use one client's pack for another client's datasource.

Full validation must pass schema, dataflow, and Textbox security on the same candidate SHA-256. Modification mode must also pass change-scope comparison. Inspect both JSON and Markdown results; resolve warnings explicitly.

After static PASS, execute the complete manual VI checklist in [references/validation-contract.md](references/validation-contract.md). Static success cannot prove rendering, data meaning, pool timing, export fidelity, responsive layout, or accessibility.

Deliver the validated JSON as one complete pretty-printed candidate for the writer's authorised manual handoff or paste process. Do not paste it into dataFoundry, choose a record, or make a network request as part of candidate creation.

If scripts cannot run, use the reference checklist manually and state plainly that script validation is unavailable. Do not claim PASS.

## Diagnose and repair

Inventory and validate before changing anything. Trace root grammar, required fields, references, security/tokens, widget grammar, then geometry. Use [references/errors-spool-blank-panels.md](references/errors-spool-blank-panels.md) for symptom routing. Make the smallest in-scope change, compare it with the source, and rerun the full suite.

Never delete an unknown supplied field merely to make validation quiet. Preserve it unchanged outside scope or stop and request reviewed evidence.

## Publishing

Delivery ends at the validated candidate JSON and its SHA-bound validation artifacts. This Claude-upload variant cannot publish and requires no network access. Publishing happens through Summit's separate local publisher process after an authorised publisher receives the exact candidate and validation handoff.

## Delivery

Deliver:

- writer-approved report plan and execution record;
- technical build contract kept behind the plain-language plan;
- separate candidate JSON;
- inventory when a source was supplied;
- machine and Markdown validation results bound to the candidate hash;
- change comparison for modification mode;
- warning dispositions and manual VI checklist;
- a publishing handoff note directing the authorised recipient to Summit's separate local publisher process.

Before redistributing the skill itself, run `node "<absolute-skill-root>/scripts/verify-portability.mjs"`.
