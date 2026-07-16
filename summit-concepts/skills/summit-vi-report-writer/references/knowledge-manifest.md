# Knowledge manifest

Knowledge snapshot: 2026-07-14. Core report evidence snapshot: 2026-07-14. Classification: internal Summit use only.

This skill ships no client measures. Confirmed client measure packs are supplied at build time from the connected Summit Labs `client-packs/<client-key>/` store; a report for a client requires that client's pack or supplied measure exports.

This packaged knowledge is a redacted, synthesized legacy Visual Insights authoring contract. It contains no raw report definitions, evidence-record identifiers, source-system exports, or vault links. Client identifiers are forbidden outside the exact measure-pack disclaimer line.

## Authority order

When references appear to conflict, apply this order:

1. verified code schema and eligible production deployment evidence;
2. binding platform and security facts;
3. accepted current documentation and resolved defects;
4. supporting UAT2 evidence for diagnosis and reviewed exceptions;
5. unresolved or preserve-only observations.

Never promote frequency into safety or invent a missing rule.

## Evidence labels

- **[Schema invariant]** Confirmed by binding facts or code schema.
- **[Proven pattern]** Repeatedly deployed and consistent with higher authority.
- **[Approved exception]** Narrowly approved at human review; do not generalise.
- **[Observed but unsafe / denied]** Seen but unsafe or contradicted.
- **[Unresolved]** Insufficiently evidenced; preserve supplied instances only or deny for new work.
- **[Contract]** Builder workflow/safety requirement rather than a VI feature claim.

## Snapshot coverage

The normalized snapshot contains:

- 1,715 enumerated legacy-record candidates across production-authoritative and supporting UAT2 entities;
- 1,476 eligible parsed legacy reports;
- 237 excluded records, including empty definitions and out-of-scope types;
- 2 malformed definitions retained as explicit failures;
- 72,250 analysed panels;
- 1,214 classified schema paths;
- 898 builder-allowed, 82 denied, and 234 unresolved/preserve-only schema entries in `schema-allowlist.json`.

Production evidence governs approval. UAT2 evidence supports diagnosis and the narrow approved exceptions; it does not independently promote a new builder option.

The sanctioned measure pack contains 635 exact tags: 283 corpus-proven, 350 dictionary-listed, and 2 dataFoundry-listed caution entries. It contains 51 source-workbook dataset rows and a 53-dataset reconciled inventory, but no source proves per-measure dataset compatibility. The pack therefore leaves every per-measure dataset list unverified and requires writer confirmation.

The sanctioned client pack also contains nine sanitized Golden Report structural blueprints refreshed from entity 10 on 2026-07-14. They retain only business-question routing, story sequence, supported-widget mix, structural counts, and one-way definition fingerprints. They are planning aids, not copy-ready definitions; raw source definitions and record metadata remain outside the skill and release.

## Supported authoring surface

The five builder-supported widgets are Textbox, StandardChart, Table, TableV2, and AdvanceTable. Every other panel type is denied or preserve-only unless a later reviewed snapshot changes the allowlist.

Key reviewed decisions:

- new work emits `toolbar.OnChangeSyncPanels[]`; modification mode inspects `DataConnections[]` first, preserves the supplied format, and never dual-writes;
- code defines `DataConnections[]`, but zero eligible production reports deployed it in this snapshot;
- builder-emitted IQe RuleScope enumerates Product, Market, Date, Time, Promotion, Shopper, and Basket using First/Last, with all-First as the safe default;
- TableV2 measure cells deny Text and Number formatting; Bar, Circle, and Status are allowed, with Caption only in its documented context;
- DateRange Page Input is a narrow exact-shape approved exception;
- CSV Import is advanced and requires a user-supplied schema plus confirmed import workflow.

## What the snapshot does not prove

- generic spool internals;
- a generic Textbox-content size limit;
- unresolved multi-view/export flags;
- preserve-only toolbar and connection fields as safe new-work options;
- runtime rendering, measure correctness, data availability, export fidelity, or accessibility for a newly built candidate.

Those limits require fail-closed static validation and mandatory manual VI testing.

## Runtime compatibility

- Packaged validators use only the Node.js standard library.
- Minimum supported Node.js: 20.
- Verified build runtime: Node.js 24.15.0 on macOS, 2026-07-10.
- No validator needs npm or network access.
- The Claude-upload variant contains no network-capable script and no publisher. Delivery ends at the validated candidate; publishing uses Summit's separate local publisher process.

## Reference integrity

Core routed references live one level below `SKILL.md`; the binding client-pack addendum uses the nested sanctioned client directory. `verify-portability.mjs` checks metadata, routed links, forbidden absolute/source paths, client-bearing identifiers, the exact client exception, and broken relative links. Run it after any packaged-file change.
