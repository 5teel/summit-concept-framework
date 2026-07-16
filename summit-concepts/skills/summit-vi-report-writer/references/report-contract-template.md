# Report contract template

Evidence snapshot: 2026-07-13. Planning workflow updated 2026-07-15.

Use this template before authoring any report JSON. Fill every section; write “None” only after confirming it. Present the writer-facing Report plan first and keep exact tags, keys, and schema terms in the technical build appendix. JSON authoring is forbidden until the writer replies `execute` to the current complete plan.

Labels used for platform claims: **[Schema invariant]**, **[Proven pattern]**, **[Approved exception]**, **[Observed but unsafe / denied]**, **[Unresolved]**. Workflow requirements are marked **[Contract]**.

---

## Contents

- [Contract status](#contract-status)
- [1. Plain-language confirmation summary](#1-plain-language-confirmation-summary)
- [2. Starting point and preservation boundary](#2-starting-point-and-preservation-boundary)
- [3. View, toolbar, and filter plan](#3-view-toolbar-and-filter-plan)
- [4. Data and dependency plan](#4-data-and-dependency-plan)
- [5. Panel and widget plan](#5-panel-and-widget-plan)
- [6. Layout, style, and accessibility](#6-layout-style-and-accessibility)
- [7. Interactions and exports](#7-interactions-and-exports)
- [8. Validation and review](#8-validation-and-review)
- [9. Confirmed gaps and decisions](#9-confirmed-gaps-and-decisions)
- [10. Confirmation block](#10-confirmation-block)

## Contract status

| Field | Decision |
|---|---|
| Plan status | Draft / Ready for execute / Executed / Reopened |
| Working title | `<plain-language title>` |
| Mode | New / Copy supplied proven report / Modify supplied JSON |
| Contract version | `<integer>` |
| Source JSON received | Yes / No / Not applicable |
| Measure/data context received | `<list supplied artifacts or unresolved>` |
| Client measure route | Supplied export / Matching packaged client pack `<key>` / No matching pack |
| Current plan shown | No / Yes — `<date/time or conversation turn>` |
| Execute received | No / Yes — `<exact reply and conversation turn>` |

**[Contract]** `execute` authorises creation and validation of a separate local candidate only. It does not authorise dataFoundry paste, record selection, network access, UAT2 publishing, or PRD promotion.

## 1. Plain-language confirmation summary

### Purpose

- Decision this report supports: `<decision/action>`
- Why the report is needed: `<short reason>`
- Success looks like: `<what the reader can understand or decide>`

### Audience

- Primary audience: `<role>`
- Data familiarity: Low / Medium / High
- Use cadence: Ad hoc / Weekly / Monthly / Other confirmed cadence
- Accessibility or device constraints: `<constraints or None>`

### Story

1. First, the reader should understand: `<question/insight>`
2. Next: `<question/insight>`
3. Last: `<question/action>`

### Examples supplied by the writer

| Example | What it clarifies | Used / still unresolved |
|---|---|---|
| `<source report, screenshot, rough sketch, sample table, or named pattern>` | `<story, layout, wording, data meaning, or interaction>` | `<decision>` |

### Proposed views

| Order | View | Question answered | Why it needs its own view |
|---:|---|---|---|
| 1 | `<view name>` | `<business question>` | `<reason>` |

### Writer-facing screen sketch

```text
VIEW: <name>
[reader choices]
[headline or context]
[primary evidence]
[supporting detail]
```

**[Contract]** Ask the writer to correct the sketch. It records intent; it is not proof of final VI rendering.

**[Contract]** Use the smallest coherent view set. Every view must answer a named question.

## 2. Starting point and preservation boundary

| Item | Decision |
|---|---|
| Chosen source/template | `<new proven pattern or supplied local file>` |
| Why this source fits | `<story/data/widget similarity>` |
| Source risks or known defects | `<list or None>` |
| Must preserve unchanged | `<sections, views, behaviours, fields>` |
| Confirmed change scope | `<exact requested changes>` |
| Explicitly out of scope | `<items>` |

**[Contract]** In copy/modify mode, preserve everything outside the confirmed scope and write a separate candidate file. Never overwrite the source.

## 3. View, toolbar, and filter plan

| View | Writer's choice | Starts on | What the reader can do | Shown here? | What changes |
|---|---|---|---|---|---|
| `<view>` | `<plain caption>` | `<confirmed plain-language default>` | One / Several / Fixed | Yes / Out of sight | `<headline, trend, ranking, detail, etc.>` |

Technical mapping (not the lead explanation):

| Writer's choice | Confirmed dimension/input | Bounds/default expression | Toolbar key | Panels refreshed | HiddenForViews | Pools invalidated |
|---|---|---|---|---|---|---|
| `<plain caption>` | `<confirmed mapping>` | `<technical detail>` | `<assigned during build>` | `<panel roles/keys>` | `<view keys>` | `<datasource keys or None>` |

Checklist:

- **[Schema invariant]** Use only Product, Market, Date, Time, Promotion, Shopper, Basket, and Measure as canonical dimension-control names.
- **[Schema invariant]** Set minimum, maximum, and multiple-selection behaviour explicitly.
- **[Proven pattern]** Treat toolbar visibility and execution separately; hidden controls can still synchronise panels.
- **[Contract]** Any default label/value is supplied or derived from the supplied source definition, never guessed.
- **[Unresolved]** Explicit Dropdown/ViewSelector and unresolved toolbar fields are excluded from new work.

### Page/input plan

| Page order | Purpose | Input key/name source | Option type | Defaults | Downstream consumers | Pool invalidation |
|---:|---|---|---|---|---|---|
| 1 | `<business selection>` | `<supplied/new synthetic key plan>` | Button / Dimension / approved DateRange | `<confirmed>` | `<datasources/toolbars>` | `<datasource keys or None>` |

DateRange details, if selected:

| IncludeOptions | Attribute | StartDate | EndDate | User confirmation |
|---|---|---|---|---|
| `<supplied list>` | `<supplied attribute>` | `<supplied date>` | `<supplied date>` | Yes / No |

**[Approved exception]** Use DateRange only in the documented Page Input shape with `Type: DateRange`, `IncludeOptions`, and a FILTER value containing `Attribute`, `StartDate`, and `EndDate`.

## 4. Datasource, measure, and dependency plan

| Datasource role | Source/type | Dimensions | Measures/tags | Inputs/selections | Dependencies | Pool plan | Output consumers |
|---|---|---|---|---|---|---|---|
| `<role>` | Native IQe / CSV Import | `<confirmed>` | `<confirmed exact names/tags>` | `<confirmed>` | `<roles/keys or None>` | None / `<scope, key strategy, renewal>` | `<panels/tokens>` |

Rules:

- **[Contract]** Every measure/tag/datasource/input name is supplied by the user/source artifact or chosen by the writer from up to three candidates in a matching client pack. Unavailable names remain gaps.
- **[Contract]** Record the writer's phrase, proposed candidates and differences, chosen exact tag, evidence label, and explicit confirmation. Never silently pick a tag or use a client pack with another client's datasource.
- **[Contract]** Record dictionary/dataFoundry cautions and per-dataset compatibility gaps explicitly.
- **[Schema invariant]** Every reference resolves and the dependency graph is acyclic.
- **[Proven pattern]** `OnChangeDisablePool` values are datasource keys.
- **[Schema invariant]** Each builder-emitted `IQe.RuleScope` enumerates Product, Market, Date, Time, Promotion, Shopper, and Basket.
- **[Approved exception]** Record intentional per-dimension `First`/`Last`; all-First is the safe default.

### RuleScope plan

| Datasource/rule | Product | Market | Date | Time | Promotion | Shopper | Basket | Reason for any Last |
|---|---|---|---|---|---|---|---|---|
| `<role>` | First | First | First | First | First | First | First | `<reason or None>` |

### CSV Import plan, if selected

| File/workflow confirmed | Column order supplied | Column names/types supplied | Hosting/location confirmed | Downstream dependency plan |
|---|---|---|---|---|
| Yes / No | Yes / No | `<schema or missing>` | `<confirmed workflow or missing>` | `<plan>` |

**[Proven pattern]** `Type: Import` is advanced support only. If any required import fact is missing, do not author the import datasource.

## 5. Widget and panel plan

| View | Panel role | Business question | Approved widget | Displayed dimensions | Displayed measures/tags | Datasource role | Priority |
|---|---|---|---|---|---|---|---|
| `<view>` | `<heading/chart/ranking/detail/pivot>` | `<question>` | Textbox / StandardChart / Table / TableV2 / AdvanceTable | `<confirmed>` | `<confirmed>` | `<role>` | Primary / Secondary |

Selection notes:

- **[Proven pattern]** Textbox: heading, explanation, KPI text, or token summary; static HTML/scoped CSS preferred.
- **[Schema invariant]** StandardChart: native trend/comparison/contribution chart.
- **[Schema invariant]** Table: supported legacy table, especially for preservation.
- **[Schema invariant]** TableV2: preferred native ranked/detail table for new work.
- **[Schema invariant]** AdvanceTable: pivot/crosstab question.
- **[Observed but unsafe / denied]** IFrame, layout-only as content, Textbox1, and unlisted widgets are excluded.
- **[Observed but unsafe / denied]** TableV2 measure-cell Text/Number are excluded. Bar/Circle/Status are allowed; Caption is contextual; use `ForgroundColour` exactly.

## 6. Connection and runtime plan

| View/panel role | Datasource binding | Toolbar connections | Visibility/runtime notes | Source format preserved? |
|---|---|---|---|---|
| `<panel>` | `<datasource role/key>` | `<controls>` | `<hidden/initialising/dependency notes>` | Yes / Not applicable |

- **[Proven pattern]** New builds emit `toolbar.OnChangeSyncPanels[]`; every target resolves.
- **[Schema invariant]** Modification inspection order is `DataConnections[]` → `ConnectedToolbars[]` → reverse `OnChangeSyncPanels[]`.
- **[Schema invariant]** Preserve `DataConnections[]` when present in a source report; never dual-write.
- **[Schema invariant]** Code defines `DataConnections[]`, but the 2026-07-10 deployed snapshot contains zero PRD reports using it. It is not the new-build default.
- **[Contract]** Record expected loading order, invalidation, hidden-control behaviour, and blank/stale-data risks for every data-bearing panel.

### Plain-English interaction check

```text
<reader choice> ──updates──> <named report items>
<reader choice> ──leaves───> <items that must not change>
```

The writer approves this behaviour before the technical toolbar matrix is finalised.

## 7. Interaction and export plan

| Capability | Decision | Scope | Notes/test |
|---|---|---|---|
| View switching | Native view list / None | `<views>` | `<expected behaviour>` |
| Selection updates | `<which controls update which panels>` | `<views>` | `<hidden-control notes>` |
| Wider | Yes / No / Required by pattern | `<panels>` | `<test>` |
| Fullscreen | Yes / No / Required by pattern | `<panels>` | `<test>` |
| Redirection/drill | `<proven supplied pattern or None>` | `<panel>` | `<target facts supplied?>` |
| Per-view export | `<explicit requirement or None>` | `<views>` | `<test>` |
| Multi-view PPT/export | Enabled / Disabled | `<included/excluded views>` | `<render wait requirement>` |

- **[Schema invariant]** Use `MultiViewExport` only from the confirmed export plan.
- **[Unresolved]** Do not infer per-view `ExportEnabled`; set it only from an explicit supplied requirement.

## 8. Design direction

| Area | Decision |
|---|---|
| Density | Compact analytical / Balanced / Presentation-led |
| Hierarchy | `<heading → primary evidence → detail → notes>` |
| Colour source | Supplied configuration preset / Neutral accessible palette |
| Typography | `<responsive scale and hierarchy>` |
| Panel spacing | `<confirmed approach>` |
| Responsive behaviour | `<priority at smaller/larger screens>` |
| Accessibility | `<contrast, non-colour cues, labels, keyboard considerations>` |

- **[Proven pattern]** Use only supplied generic configuration-preset tokens; never invent a client-specific preset.
- **[Proven pattern]** Scoped Textbox CSS and responsive `clamp()` are allowed; use `calc()` for multi-unit arithmetic.
- **[Schema invariant]** All geometry stays within dashboard columns without unintended overlaps or clipping.

## 9. Assumptions, gaps, and alternatives

### Confirmed assumptions

| Assumption | Evidence/source | User confirmed? |
|---|---|---|
| `<assumption>` | `<supplied artifact or explicit answer>` | Yes / No |

### Unresolved gaps

| Gap | Why it matters | Exact information needed | Work that can continue safely |
|---|---|---|---|
| `<gap>` | `<impact>` | `<smallest useful request>` | `<safe branch>` |

### Unsupported requests and alternatives

| Requested capability | Evidence status | Nearest proven alternative | User decision |
|---|---|---|---|
| `<request>` | Denied / Unresolved | `<alternative>` | Accepted / Removed / Pending |

**[Contract]** An unresolved or denied item never becomes a builder option through user preference alone.

## 10. Validation and human-test plan

### Deterministic validation

- [ ] JSON and complete top-level grammar.
- [ ] Required/conditional fields and allowed enums.
- [ ] Unique view, panel, datasource, toolbar, and input keys.
- [ ] All references resolve; datasource graph is acyclic.
- [ ] Defaults/selections, measures, dimensions, tokens, pools, and invalidation are coherent.
- [ ] Toolbar visibility/execution and every data-bearing panel connection are coherent.
- [ ] Dashboard geometry is in bounds without unintended overlap/clipping.
- [ ] Widget-specific rules, Wider/Fullscreen, interactions, and exports match this contract.
- [ ] Textbox literal-dollar, nine-rule security, CSP, secret, and external-resource checks pass.
- [ ] Modification diff changes only confirmed scope.

### Manual VI tests

| Test | Environment | Expected result | Owner/status |
|---|---|---|---|
| `<first retrieval/defaults>` | UAT2/local inspection | `<result>` | Pending |
| `<each toolbar/view interaction>` | UAT2 | `<result>` | Pending |
| `<responsive/export/security check>` | UAT2 | `<result>` | Pending |

## 11. Publishing handoff

| Field | Decision |
|---|---|
| Candidate JSON path/name | `<record after validation>` |
| Validation JSON/Markdown | `<record exact SHA-bound artifacts>` |
| Warning dispositions | `<attach or None>` |
| Manual VI checklist | `<attach with owner/status>` |
| Publisher route | Summit's separate local publisher process |

- **[Contract]** This Claude-upload variant ends at the validated candidate and makes no network request.
- **[Contract]** An authorised publisher owns the separate local process; IT owns PRD promotion.

## 12. Confirmation

Present the writer-facing plan, sketches, gaps, and relevant technical appendix from Sections 1–10, then ask:

> If anything is wrong, tell me what to change. When this exact plan is right and every blocking gap is resolved, reply `execute` and I will build the separate JSON candidate.

Record the answer:

- Plan response: `<requested edits, general approval, or exact execute>`
- Executed scope: `<short restatement of the exact visible plan>`
- Remaining gaps accepted for later resolution: `<list or None>`
- Blocking gaps resolved: Yes / No
- JSON authoring may begin: Yes only when the exact current reply is `execute` / No

**[Contract]** General approval is not execution authority. If purpose, views, filters, data, panels, interactions, or scope changes materially, increment the contract version, reopen the relevant Q&A stage, cancel the previous execute, and show the revised plan before requesting `execute` again.
