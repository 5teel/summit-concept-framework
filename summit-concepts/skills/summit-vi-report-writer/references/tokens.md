# Token grammar

Knowledge snapshot: 2026-07-10.

## Approved render tokens

- **[Proven pattern]** `$LabelOfSelected(...)` — selected dimension labels.
- **[Proven pattern]** `$DataOfSelected(...)` — selected measure data.
- **[Proven pattern]** `$LabelOfAll(...)` — proven all-label forms.
- **[Proven pattern]** `$LabelOfTag(...)` — tag label in proven title/series contexts.
- **[Proven pattern]** `$Input(...)` — Page/OptionalInput value.
- **[Proven pattern]** Generic `ConfigurationPreset.Report.*` presentation tokens supplied by the runtime configuration.
- **[Schema invariant]** IQe/SQL variables such as `$Value` are legal only in their specific expression/script contexts, not as arbitrary Textbox tokens.

## Parameters and context

- **[Schema invariant]** Use `Dimension:`, never `DimensionName:`.
- **[Proven pattern]** Textbox label/data tokens name `Datasource:` explicitly.
- **[Schema invariant]** StandardChart series/title tokens inherit the panel datasource and omit `Datasource:`.
- **[Schema invariant]** `MeasureIndexOrTag`/`MeasureIndexOrTagList` uses a supplied measure tag for detailed/script-derived datasources.
- **[Schema invariant]** Datasource, Dimension, measure tag, input key, IndexList, sort tag, and referenced toolbar state are validated in context.
- **[Contract]** Preserve exact token case; deployed case variants are not emitted.

```text
$LabelOfSelected(Datasource:dsSummary,Dimension:Product)
$DataOfSelected(Datasource:dsSummary,MeasureIndexOrTag:SYNTHETIC_VALUE,DefaultValue:0)
$LabelOfAll(Datasource:dsSummary,Dimension:Date,Separator:~)
$Input(iScope)
```

## Selection-state requirement

- **[Proven pattern]** Label/data selection tokens can require a matching toolbar datasource/dimension synced to the panel.
- **[Proven pattern]** Hidden toolbars still provide state when properly wired.
- **[Proven pattern]** Multi-datasource Textboxes require relevant sync coverage for every referenced datasource.
- **[Contract]** Render tokens visibly during first wiring; hidden unresolved tokens can mask later failures.

## IndexList and separator

- **[Proven pattern]** IndexList/Separator behaviour is form-specific. Use only a supplied/proven form and a delimiter absent from values.
- **[Proven pattern]** Explicit pipe lists and no-IndexList all-label pulls are supported forms; ranged ranked pulls may require per-row tokens.
- **[Contract]** Reject guessed indices and test out-of-range/null behaviour.

## Literal-dollar rule

- **[Observed but unsafe / denied]** Any raw dollar not starting a recognised legal token is a hard spool risk, including currency text, CSS `$=`, and JavaScript identifiers.
- **[Proven pattern]** Use `&#36;` for static currency.
- **[Schema invariant]** Token-resolved output may contain currency; it is not reparsed.
- **[Contract]** There is no 62k hard Content limit. Report Content size but do not reject on length alone.

## Configuration presets

- **[Proven pattern]** Logo tokens can resolve to complete inline image HTML, not an image URL.
- **[Contract]** Use only supplied generic preset keys. Never invent or package a client-bearing preset name/value.

## Validation

Parse every token, enforce name/parameter/context allowlists, resolve datasource/input/dimension/measure references, confirm toolbar state, and flag every unmatched dollar with precise panel/path location.
