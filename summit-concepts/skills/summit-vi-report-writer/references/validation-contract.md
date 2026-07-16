# Validation contract

Knowledge snapshot: 2026-07-13.

## Contents

- [Required sequence](#required-sequence)
- [Runtime requirements](#runtime-requirements)
- [Commands](#commands)
- [Full validation result](#full-validation-result)
- [Diagnostic shape](#diagnostic-shape)
- [Schema validation](#schema-validation)
- [Dataflow validation](#dataflow-validation)
- [Textbox security validation](#textbox-security-validation)
- [Change-scope comparison](#change-scope-comparison)
- [Manual VI checklist](#manual-vi-checklist)
- [Fail-closed rule](#fail-closed-rule)

## Required sequence

1. Build a separate candidate JSON only after the writer has replied `execute` to the current complete Report plan and its technical build contract.
2. In modification mode, compare source and candidate against the confirmed change scope.
3. Run the schema, dataflow, and Textbox security validators through `validate-report.mjs`.
4. Fix every error. Record a disposition for every warning.
5. Review both the machine-readable JSON result and the plain-language Markdown result.
6. Render and test the candidate in VI. Static validation cannot replace this step.
7. Deliver the exact candidate and SHA-bound result to Summit's separate local publisher process only when an authorised publisher requests the handoff.

## Runtime requirements

- Node.js 20 or newer; verified with Node.js 24.15.0 on 2026-07-10.
- Node standard library only: no package install and no network access for validation.
- Commands may run from any working directory; use explicit file paths.

## Commands

```text
node "<absolute-skill-root>/scripts/inventory-report.mjs" candidate.json --out-dir results/inventory
node "<absolute-skill-root>/scripts/validate-report.mjs" candidate.json --mode new --out-dir results/validation
node "<absolute-skill-root>/scripts/validate-report.mjs" candidate.json --mode new --require-wider-panel pDetail --require-fullscreen-panel pDetail --out-dir results/validation
node "<absolute-skill-root>/scripts/validate-report.mjs" candidate.json --mode modify --source source.json --allowed-file allowed-changes.json --out-dir results/validation
node "<absolute-skill-root>/scripts/compare-report-change.mjs" source.json candidate.json --allowed-file allowed-changes.json --out-dir results/compare
```

`--mode` is required. Modification validation requires both `--source` and `--allowed-file`. New mode rejects preserve-only connection shapes and unknown fields; modification mode may preserve unknown supplied paths but may not introduce them.

Add `--client-pack <confirmed-client-key>` only when the contract confirms that client/datasource route. Client-pack validation rejects unknown or numeric-index measures, checks required measure inputs, and warns for non-corpus-proven tags.

Pass `--require-wider-panel <panel-key>` and/or `--require-fullscreen-panel <panel-key>` for every panel marked Required by the confirmed report contract. Repeat each flag as needed. The schema validator then requires a visibly or ARIA-named control on that panel; manual keyboard/browser testing remains mandatory.

## Full validation result

The full runner writes:

- `<candidate>.validation.json`: machine-readable result containing schema version, candidate absolute input at runtime, candidate SHA-256, timestamps, session identifier, mode, validator results, counts, and overall pass/fail;
- `<candidate>.validation.md`: concise human-readable result with every diagnostic and next action.

Input paths in runtime results are local execution metadata; they are never copied into a packaged skill or report definition.

A passing result means all three component validators returned no errors for the exact candidate hash. It does not approve warnings, business meaning, browser rendering, or any later publishing decision.

## Diagnostic shape

Each diagnostic contains:

```json
{
  "severity": "error",
  "code": "DATAFLOW_DANGLING_DATASOURCE",
  "path": "Views[0].Panels[1].Datasource",
  "message": "Panel references an unknown datasource key.",
  "remediation": "Use a confirmed Datasources[].Key or remove the panel."
}
```

Severity meanings:

- `error`: fail closed; candidate delivery and any later publisher handoff are blocked.
- `warning`: requires an explicit disposition and usually a manual VI test.
- `info`: inventory or confirmation evidence.

## Schema validation

`validate-report-schema.mjs` checks, at minimum:

- valid JSON; required root and nested structures;
- required Page Input, Datasource, View, Dashboard, panel-base, Toolbar, and Textbox fields;
- allowed widget types and widget-specific grammars;
- exact DateRange exception shape;
- advanced CSV Import prerequisites;
- all seven standard IQe `RuleScope` dimensions and First/Last values;
- TableV2 measure formatting denial and the intentional `ForgroundColour` spelling;
- unique keys, numeric grid geometry, bounds, and overlaps;
- new-work allowlist enforcement and modification-mode preservation.

## Dataflow validation

`validate-dataflow.mjs` checks, at minimum:

- datasource, toolbar, panel, view, input, token, dependency, and pool references;
- dependency cycles;
- panel-to-datasource and toolbar-to-panel synchronisation;
- connection precedence and preservation in modification mode;
- no connection dual-write;
- every data-bearing panel has an intentional refresh route;
- hidden-toolbar visibility is not mistaken for execution;
- stale references in Textbox content and noncanonical panel-level Content.
- exact measure-tag membership when a confirmed `--client-pack` is supplied, with evidence cautions preserved as warnings.

## Textbox security validation

`validate-textbox-security.mjs` applies all nine binding gates to every `Textbox.Content` field:

1. no network calls;
2. no secrets, credentials, or obfuscated keys;
3. no storage or cookies;
4. no dynamic code execution;
5. no external script, style, worker, or module loading;
6. images only from the correct environment CDN;
7. no builder-authored iframe; preserve-only iframe needs separate policy approval;
8. navigation is relative and same-origin;
9. no alert, confirm, prompt, console, or debugger in production candidates.

It also rejects unrecognised literal dollars, detects high-risk inline handlers, and reports stale state content.

## Change-scope comparison

The allowed-change file is a JSON array of dot/bracket path prefixes:

```json
[
  "Title",
  "Views[0].Panels[2]",
  "Dashboards[0].Panels[2]"
]
```

Any source-to-candidate change outside those prefixes is an error. Array reordering can create broad diffs; keep keys and order stable when modification scope is narrow.

## Manual VI checklist

After a static PASS, confirm in the target non-production environment:

- each view opens without blank/spool failures;
- every visible and hidden toolbar initialises correctly;
- every selection refreshes exactly the intended panels;
- Textbox content and token-driven empty/error presentation are safe and current;
- chart labels/axes/legends and table formatting render as intended;
- panel geometry works at target viewport sizes;
- Wider and Fullscreen controls work where included;
- per-view and multi-view exports contain only intended data;
- accessibility labels, focus order, keyboard use, and contrast are acceptable;
- browser console/network behaviour matches the security contract.

## Fail-closed rule

Never suppress, downgrade, or bypass a validator error to meet a deadline. If an allowed platform behaviour is not represented by the packaged evidence, record it as a gap and obtain new accepted evidence before changing the allowlist.
