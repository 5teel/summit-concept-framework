# Report-shaping Q&A and build workflow

Evidence snapshot: 2026-07-13. Conversation workflow updated 2026-07-15.

## Labels

- **[Contract]** — mandatory workflow or safety policy.
- **[Schema invariant]**, **[Proven pattern]**, **[Approved exception]**, **[Observed but unsafe / denied]**, **[Unresolved]** — evidence labels for VI capabilities.

## Contents

- [Conversation rules](#conversation-rules)
- [Working state](#working-state)
- [Stage 1 — Outcome, audience, starting point](#stage-1--outcome-audience-starting-point)
- [Stage 2 — Story and views](#stage-2--story-and-views)
- [Stage 3 — Filters](#stage-3--filters)
- [Stage 4 — Data](#stage-4--data)
- [Stage 5 — Presentation](#stage-5--presentation)
- [Stage 6 — Layout and style](#stage-6--layout-and-style)
- [Stage 7 — Interactions and exports](#stage-7--interactions-and-exports)
- [Stage 8 — Report plan and execute gate](#stage-8--report-plan-and-execute-gate)
- [After execute](#after-execute)

## Conversation rules

1. **[Contract]** Start with the report writer's decision and audience, never JSON, widget keys, datasource syntax, tags, or schema terminology.
2. **[Contract]** Ask no more than three short questions in one message. Use fewer when an answer changes the next branch.
3. **[Contract]** Offer two or three proven choices when useful, put the recommendation first, and explain the practical difference in one sentence.
4. **[Contract]** Mirror the request back in the writer's words before translating it. Say “the sales number,” “the product choice,” “the trend,” or “the ranking” in conversation; keep “measure,” “tag,” “datasource,” “dimension,” “panel,” and exact keys in internal build notes unless a technical distinction affects the decision.
5. **[Contract]** Reuse information already supplied. Do not ask the user to repeat a measure, view, audience, or source choice.
6. **[Contract]** Never guess a measure, tag, datasource, input key, report ID, hierarchy, data value, or client-specific configuration. A matching client pack may propose up to three measures in plain language; the writer must confirm one before the exact tag is used.
7. **[Contract]** Ask for evidence from the writer when intent is ambiguous: an existing report, screenshot, rough drawing, similar report name, sample table, or example of the decision they want to make. Do not make them translate that evidence into VI terminology.
8. **[Contract]** Show a small labelled sketch when screen structure or control behaviour is unclear. The sketch is for agreement, not decoration.
9. **[Contract]** Show the complete writer-facing Report plan before JSON. Authoring starts only when the writer replies `execute` to that current plan; “yes,” “approved,” or “looks good” may approve the direction but do not trigger JSON.
10. **[Contract]** If an unsupported request appears, explain the limitation and offer the closest proven alternatives. Never invite arbitrary custom code in a Textbox.

## Working state

Maintain these fields while talking. Show only the parts relevant to the current question.

| State | Values |
|---|---|
| Mode | new / copy supplied proven report / modify supplied JSON |
| Outcome | decision, action, or question the report supports |
| Audience | role, data familiarity, review cadence |
| Story | ordered questions: first → next → last |
| Views | smallest coherent set; one question per view |
| Filters | dimensions, defaults, selection bounds, visibility by view |
| Data | confirmed client/client-pack route, supplied inputs, datasources, measures/tags, dimensions, dependencies, pools |
| Presentation | approved widget purpose per panel |
| Design | hierarchy, density, colour source, responsive behaviour, accessibility |
| Interactions | selections, view switching, Wider/Fullscreen, redirection if proven |
| Exports | per-view/export-all need and exclusions |
| Gaps | unknowns, assumptions, human tests, unsupported requests |
| Evidence/examples | supplied report, screenshot, sketch, sample output, named proven pattern, or still needed |
| Plan/execution | draft / ready for execute / executed / reopened after material change |

## Stage 1 — Outcome, audience, starting point

Ask up to three questions:

1. “What decision should this report help someone make?”
2. “Who is the main audience, and how familiar are they with the data?”
3. “Are we modifying an existing report, copying a supplied proven report, or starting a new one?”

Then ask for the most useful example if one has not already been supplied: “Can you show me a report, screenshot, rough sketch, or sample output that is close to what you mean?” Do not ask this merely as ceremony; explain which open design question the example will settle.

Starting-point guidance:

- **Modify supplied JSON — recommended when the report already exists.** Preserve everything outside confirmed scope and write a separate candidate. **[Contract]**
- **Copy a supplied proven report — recommended when the requested story closely matches it.** Record why the source is suitable; replace identifiers/data choices only from supplied facts. **[Contract]**
- **New report.** Use a proven internal pattern assembled from the packaged references, never fragile boilerplate recalled from memory. **[Contract]**

Exit when purpose, audience, and mode are explicit. If modifying/copying, request the source JSON before technical planning.

## Stage 2 — Story and views

Ask:

1. “What should the reader understand first, next, and last?”
2. “Would you prefer one focused screen, or separate views for genuinely different questions?”

Offer:

- **Smallest coherent set — recommended.** One view for one tightly related story, or two to four views when questions differ materially. **[Contract]**
- **Single focused view.** Best for one decision and a small number of panels. **[Contract]**
- **Multi-view story.** Use only when each view has a named question; do not create tabs merely to spread out clutter. **[Contract]**

Translate each story beat into a provisional view name and one plain-language question. Do not select widgets yet.

When the shape is not obvious, show a structure sketch such as:

```text
VIEW: Performance overview
[Product choice] [Location choice] [Time choice]

[Headline: what changed?]
[Trend across time................]
[Top contributors....] [Detail list........]
```

Ask the writer to move, remove, or add blocks. Do not imply that a sketch proves the final VI layout.

## Stage 3 — Filters

Ask no more than three:

1. “What should readers be able to choose while using the report—for example product, location, or period?”
2. “For each choice, can they pick one, several, or should it be fixed or out of sight on some screens?”
3. “What should the report start on before they change anything?”

Rules:

- **[Schema invariant]** Canonical filter dimensions are Product, Market, Date, Time, Promotion, Shopper, Basket, and Measure.
- **[Contract]** Ask for any non-standard dimension rather than translating it to a guessed canonical name.
- **[Schema invariant]** New legacy builds use implicit dimension controls with explicit minimum, maximum, and multiple-selection behaviour.
- **[Schema invariant]** If multiple selection is false, minimum and maximum are one.
- **[Proven pattern]** A control hidden for a view can still initialise and synchronise panels; visibility and execution are separate.
- **[Proven pattern]** `LockedSelections` contains supplied label strings; never invent a locked label.
- **[Schema invariant]** `SelectionStartIndex` may be used only when the requested initial focus is confirmed.
- **[Unresolved]** Explicit `Dropdown`, `ViewSelector`, `MaximumVisibleSelections`, permissions, and UAT-only sync variants are not new-build choices.

Date-range branch:

- Ask whether the writer needs a continuous start/end period and which date attributes may be offered.
- **[Approved exception]** Route only the documented Page Input shape: `Type: DateRange`, `IncludeOptions`, a FILTER value with `Attribute`, `StartDate`, and `EndDate`.
- **[Approved exception]** Require the user to supply/confirm the allowed attributes and dates. Do not generalise DateRange fields to alternate placements.

## Stage 4 — Data

Ask:

1. “Which client and existing data source is this report for?”
2. “In everyday words, what number or comparison should the reader see?”
3. “Can you show me an existing report, data extract, or approved list that already contains it?”

Rules:

- **[Contract]** If the confirmed client matches a packaged pack, open only that pack's `measure-guide.md` and `measures.json`. Map the writer's phrase to no more than three candidates. Present each as an everyday name, what it means, and why it may fit; do not lead with raw tags. Ask the writer to choose. Never silently select a tag.
- **[Contract]** Put only the writer-confirmed exact tag into the contract. Run validation with the matching `--client-pack` key.
- **[Contract]** Never apply a client pack to another client's datasource. When no matching pack exists, retain the existing fallback: require a supplied measure export, datasource excerpt, or source definition.
- **[Contract]** A dictionary-listed or dataFoundry-listed candidate carries an explicit caution; corpus-proven means observed use, not universal datasource compatibility.
- **[Schema invariant]** Every datasource/input/dependency reference in the contract must resolve before JSON authoring.
- **[Schema invariant]** Datasource dependencies form an acyclic graph; a missing parent or cycle is a stop condition.
- **[Proven pattern]** Pool invalidation arrays contain datasource keys, not pool names.
- **[Schema invariant]** Builder-emitted `IQe.RuleScope` lists Product, Market, Date, Time, Promotion, Shopper, and Basket every time.
- **[Approved exception]** Choose `First` or `Last` per confirmed report intent; use all `First` as the safe default when no exception is justified.
- **[Proven pattern]** When datasource output changes during development, plan an intentional pool-key change; do not assume definition edits invalidate cached output.

CSV import branch:

- **[Proven pattern]** Offer `Type: Import` only as an advanced option when the user supplies the file schema and confirms the import workflow.
- **[Contract]** Require confirmed column order, names, roles/types, file location/hosting workflow, and downstream dependencies. Never guess any of them.

If required data facts are missing, pause that branch and show the smallest useful request: measure export, datasource excerpt, import schema, or source report JSON.

## Stage 5 — Presentation

Ask in plain language:

1. “For each screen, do you need a headline, a trend or comparison, a ranked/detail list, or a cross-tab breakdown?”
2. “What named number and grouping should each item show?”
3. “What should the reader notice or compare in each item?”

Translate only to the approved catalogue:

| User need | Proven choice | Notes |
|---|---|---|
| Heading, explanation, KPI text, token-based summary | Textbox | **[Proven pattern]** Prefer static HTML and scoped CSS. JavaScript is exceptional and policy-gated. |
| Trend, comparison, contribution, native chart | StandardChart | **[Schema invariant]** Use only proven series/axis forms and supplied measures. |
| Existing/simple legacy tabular view | Table | **[Schema invariant]** Prefer preservation in modification mode when it already meets the question. |
| Ranked, detailed, filterable native table | TableV2 | **[Schema invariant]** Recommended native table for most new ranked/detail needs. |
| Pivot/crosstab analysis | AdvanceTable | **[Schema invariant]** Use when the question genuinely requires pivot-style dimensions. |

Restrictions:

- **[Observed but unsafe / denied]** Layout-only panels are preservation shells, not presentation choices.
- **[Observed but unsafe / denied]** IFrame/hosted-app work is outside this skill.
- **[Unresolved]** Textbox1, Chart, and unlisted widgets are not choices.
- **[Observed but unsafe / denied]** TableV2 measure-cell `Text` and `Number` are denied. Allow Bar, Circle, Status, and contextual Caption; preserve `ForgroundColour` spelling.

## Stage 6 — Layout and style

Ask:

1. “Should the report feel compact and analytical, balanced, or presentation-led?”
2. “Is there a supplied brand/configuration reference, or should the report use neutral accessible styling?”
3. “Are there accessibility or screen-size constraints we must prioritise?”

Rules:

- **[Contract]** Define visual hierarchy before decoration: view heading, context, primary evidence, secondary detail, source/notes.
- **[Proven pattern]** Use supplied configuration-preset colour/logo tokens where available; never invent a client-specific token or value.
- **[Proven pattern]** Scoped Textbox CSS and responsive `clamp()` are permitted. Wrap multi-unit arithmetic in `calc()`.
- **[Contract]** Require readable contrast, non-colour cues for status, keyboard-safe controls, legible labels, and responsive text/panel sizing.
- **[Schema invariant]** Keep dashboard geometry within columns and prevent unintended overlap. Treat clipping as a validation failure, not a style preference.

## Stage 7 — Interactions and exports

Ask:

1. “When a reader changes each choice, what on the screen should change—and what should stay put?”
2. “Do readers need Wider, Fullscreen, drill/redirection, or only standard view switching?”
3. “Which views must export individually or together, and should any be excluded from PPT/export-all?”

Rules:

- **[Proven pattern]** New builds emit `toolbar.OnChangeSyncPanels[]` and every target panel key must resolve.
- **[Schema invariant]** In modification mode inspect `DataConnections[]` first when present, preserve the source connection form, and never dual-write.
- **[Schema invariant]** Code defines `DataConnections[]`, but deployed evidence is zero PRD reports as of 2026-07-10; it is not the new-build default.
- **[Schema invariant]** Inspect connection precedence as `DataConnections[]` → `ConnectedToolbars[]` → reverse `OnChangeSyncPanels[]`.
- **[Schema invariant]** Wider and Fullscreen controls must be included when required by the selected panel/view pattern.
- **[Schema invariant]** `MultiViewExport` may enable export-all, set a render wait, and exclude confirmed view keys.
- **[Unresolved]** Set per-view `ExportEnabled` only from an explicit supplied requirement; do not infer its behaviour.

Show an interaction sketch before the plan whenever the answer is not obvious:

```text
Product choice ──updates──> headline, trend, ranking
Time choice ─────updates──> headline, trend, ranking, detail
Location choice ─updates──> trend, ranking
                    leaves──> explanatory note unchanged
```

Translate this into toolbar, panel, datasource, visibility, and invalidation wiring only in the technical build contract.

## Stage 8 — Report plan and execute gate

Build the full contract using [report-contract-template.md](report-contract-template.md), but lead with a **Report plan** written for the report writer. Present:

1. What the report is for, who uses it, and what they should understand first, next, and last.
2. The screens and simple sketches, the choices readers can make, and exactly what changes after each choice.
3. The named business numbers/groupings, examples used, layout, exports, accessibility needs, assumptions, gaps, and human checks.
4. A short technical build appendix containing exact confirmed tags/keys and wiring—not mixed into the writer-facing explanation.

End with: “If anything is wrong, tell me what to change. When this exact plan is right and every blocking gap is resolved, reply `execute` and I will build the separate JSON candidate.”

- **[Contract]** Accept `execute` only after the current complete plan is visible in the conversation. An earlier or ambiguous use does not count.
- **[Contract]** A material change reopens the relevant stages, increments the plan version, and cancels prior execution authority.
- **[Contract]** `execute` authorises local candidate generation and validation only, not a paste, record selection, network request, or deployment.

## After execute — build order

Build and validate block by block:

1. report shell;
2. Pages and inputs;
3. datasources, pools, IQe/SQL, dependencies;
4. toolbars;
5. views and dashboard grids;
6. panels and approved widgets;
7. connections/synchronisation;
8. styles, tokens, interactions, controls, exports;
9. full schema/dataflow/security/change validation.

**[Contract]** In modification mode write a separate candidate and preserve everything outside confirmed scope. Emit schema, dataflow, security, and change reports plus a manual VI test checklist.

After validation, give the writer one complete pretty-printed candidate JSON plus a plain-English validation summary. The writer may save or paste that candidate through their authorised process. The skill does not paste it into dataFoundry.

## Publishing handoff

Delivery ends after the candidate and SHA-bound validation artifacts pass review. Do not ask for a record ID or attempt network access. State that publishing is handled by Summit's separate local publisher process and hand the authorised publisher the exact candidate, validation JSON/Markdown, warning dispositions, and manual-test checklist.

- **[Contract]** This Claude-upload variant contains no publishing implementation.
- **[Contract]** PRD promotion remains an IT process.

## Unsupported-request responses

| Request | Response pattern |
|---|---|
| Unknown business number or source | “I can suggest up to three plain-English matches from the approved client pack, but you must choose what the number means. Otherwise, please show me an existing report, approved list, or data extract so I do not invent it.” |
| Unlisted widget | “That widget is not proven for this builder. The closest supported options are …” |
| Hosted app/IFrame | “This skill is limited to legacy native reports. I can reproduce the question with native chart/table/Textbox patterns where possible.” |
| Arbitrary Textbox JavaScript/network call | “That conflicts with the Textbox security policy. I can use a native interaction, static HTML/CSS, or a policy-compliant supported alternative.” |
| Any deployment request | “This Claude-upload workflow ends at a validated candidate. Publishing uses Summit's separate local publisher process, and production promotion remains with IT.” |
| Unresolved field or behaviour | “The field exists in limited evidence but is not approved as a builder option. I can preserve it in an existing report or use the proven alternative …” |
