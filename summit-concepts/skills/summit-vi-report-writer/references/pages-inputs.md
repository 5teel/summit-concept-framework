# Pages and inputs

Knowledge snapshot: 2026-07-10.

## Page shape

- **[Schema invariant]** `Pages[]` is ordered by numeric `Index`; common page fields are `Style`, `Title`, `Description`, `Header`, `Footer`, `Icon`, `Input`, and `OptionalInputs`.
- **[Schema invariant]** When present, `Input` is an object with a unique `Key` and `Options[]`; a bare string can blank the report and is invalid.
- **[Schema invariant]** `OptionalInputs[]` use unique keys and declared types/defaults.

```json
{
  "Index": 1,
  "Style": "Standard",
  "Title": "Choose the analysis scope",
  "Input": {
    "Key": "iScope",
    "Name": "Analysis scope",
    "Options": []
  },
  "OptionalInputs": []
}
```

## Button option

**[Schema invariant]** A Button option declares `Index`, `Caption`, `Selected`, `Type: "Button"`, and `Values[]`. Each value has an index and a supplied label/expression/type; FILTER values require `GroupBy` where the selected dimension must group rows.

```json
{
  "Index": 1,
  "Caption": "Use the supplied scope",
  "Selected": true,
  "Type": "Button",
  "Values": [
    {
      "Index": 1,
      "Caption": "Scope A",
      "Label": "Scope A",
      "Expression": "IQe.Input(@iSourceScope,1,Expression)",
      "Type": "FILTER",
      "GroupBy": "#[Product]"
    }
  ]
}
```

## Dimension option

- **[Schema invariant]** Dimension options use `Type: "Dimension[<canonical dimension>]"`.
- **[Schema invariant]** Confirm `Minimum`, `Maximum`, selection flags, and default selection. Do not attach Button `Values[]` to a Dimension option.

## DateRange exception

- **[Approved exception]** Use only as a Page `Input.Options[]` item with `Type: "DateRange"`, `IncludeOptions[]`, and a selected FILTER value containing `Attribute`, `StartDate`, and `EndDate`.
- **[Contract]** Require the user to supply all attributes and dates. Do not move these fields to OptionalInputs or other observed UAT-only placements.

```json
{
  "Index": 1,
  "Caption": "Choose a continuous period",
  "Selected": true,
  "Type": "DateRange",
  "IncludeOptions": ["Week", "Month"],
  "Values": [
    {
      "Type": "FILTER",
      "Attribute": "Week",
      "StartDate": "2026-01-01",
      "EndDate": "2026-03-31"
    }
  ]
}
```

## Defaults and dependencies

- **[Schema invariant]** Exactly one option is selected when the page requires a default.
- **[Schema invariant]** Every `IQe.Input(@key...)` resolves to Page Input or OptionalInput.
- **[Proven pattern]** `OnChangeDisablePool[]` values are datasource keys, never pool names.
- **[Contract]** Validate expressions, default indices, bounds, and downstream consumers together.

## Failure checks

- **[Observed but unsafe / denied]** `Groupby` is a legacy spelling; preserve unchanged only, emit `GroupBy`.
- **[Unresolved]** `SourceSelectionType`, alternate option-level Attribute/GroupBy/Security, and undocumented General inputs/scripts are not builder options.
- **[Schema invariant]** Missing defaults, duplicate keys, invalid indices, or unresolved input references fail validation.
