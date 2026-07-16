# The design bar

This is the bar. Every canvas, every version, no exceptions. The test: would Summit's best designer put their name on this sketch? If someone could glance at it and say "AI made that", it failed.

## A. Design Direction

Before drawing v1, state this in chat in no more than three lines:

1. **The read:** `Reading this as: <shape> for <audience>, <vibe>, leaning <layout paradigm>.` Example: `Reading this as: a weekly category dashboard for a 7-Eleven category manager, calm and confident, leaning decomposition-hero + supporting cards.`
2. **The dials:** `VARIANCE / MOTION / DENSITY` on 1–10. Default a data product to `4–5 / 2–3 / 5–6`. Default a story-first or pitch concept to `6–7 / 3–4 / 3–4`. Never exceed MOTION 4 in a sketch.
3. **One signature move:** give every sketch exactly one distinctive compositional idea, such as a decomposition hero, map-first layout, big-number wall, scroll story, or comparison spine. Name one, not three.

## B. Foundations

- **Type:** use the system stack only. Keep type-scale steps at a ratio of at least 1.25. Build hierarchy through size, weight, and colour together, never size alone. Use 14–16px body text, line-height around 1.5, and a 65–75ch maximum line length. Never use all-caps body copy; reserve uppercase for short labels. Keep display-heading letter spacing no tighter than `-0.04em`.
- **Numbers:** apply `font-variant-numeric: tabular-nums` to every data figure, table, and KPI. This is non-negotiable in a data sketch.
- **Spacing:** use an 8px grid and 4px for tight clusters. Keep section rhythm consistent. Vary it deliberately for emphasis, never accidentally.
- **Colour:** choose one accent and lock it for the whole page. Use neutrals from one grey family, with no warm/cool drift. Use off-black ink, never `#000`. Let the accent carry meaning, such as the focal series or active state. If everything is accented, nothing is.
- **Contrast:** mechanically check body text at 4.5:1 or better and large text at 3:1 or better against its background. Apply the same standard to text on chips, badges, and buttons. Muted-grey-on-tinted-white is the most common readability failure; move it toward ink.
- **Shape:** use one corner-radius scale page-wide. Add cards only when grouping needs a container; prefer borders, hairlines, or whitespace where they are enough. Never nest cards.
- **Shadows:** use subtle shadows tinted toward the background hue, or none. Never use pure-black drop shadows or glows.
- **Theme:** use a light product surface with navy chrome. Keep one theme across the canvas; never flip sections between themes.

## C. Summit house style

- Use a slim navy header bar, white `summit` text wordmark, working title, and `FAKE DATA` badge.
- Use cyan sparingly for the focal data series, active pill, or one number that matters.
- Use pill toggles for view and mode switches: the Cam pattern is navy header plus pills.
- Show status as coloured text, such as green `ON TRACK`, never as a lozenge badge.
- Lead with the hero insight: the headline finding at the top with the number in it, supporting evidence below, and detail last. Follow a hero → story → cards cadence.
- Use click-to-expand drawers for row detail. Never use hover-replace overlays.

## D. Charts

- Make every chart answer one question. Write its title as the answer: blunt, declarative, with a number in it. Use `Impulse baskets fell 4.1% after the reset`, never `Basket Analysis`.
- Use no more than about four hairline gridlines. Keep axis labels small and grey. Omit the axis spine unless it aids reading.
- For three or fewer series, label lines or bars directly at their ends and omit the legend. For more series, use a tight legend, then ask whether the chart is trying to say too much.
- Use the accent for the focal series and greys for everything else. Make bars flat-colour and square-ended: no gradients, rounded tops, or 3D. Use 2px lines and dots only on points the story needs.
- Use tabular numerals for big numbers and add a one-line `so what` underneath.

## E. Motion

Keep sketches calm. Add motion only when it communicates feedback, state change, or draws the eye to the single thing that matters.

- On interactive rows and cards, use a background tint or border shift at about 150ms with `ease-out`.
- On buttons and pills, add press feedback with `transform: scale(0.97)` on `:active` at about 150ms.
- Expand drawers over 200–250ms with `cubic-bezier(0.23, 1, 0.32, 1)`.
- Never use `ease-in` on UI. Never animate for more than 300ms. Never animate from `scale(0)`; start at `0.95` plus opacity. Use entrance staggers only when they aid the story, in 30–80ms steps, once.
- Transition specific properties, never `transition: all`.
- Respect `prefers-reduced-motion`.
- Ban marquees, scroll-hijacking, parallax, infinite loops, and kinetic type.

## F. Banned

- **Em-dash and en-dash anywhere visible.** Use a hyphen, comma, colon, or period. Zero tolerance: one visible em-dash is a Pre-Flight fail.
- AI-purple gradients, neon glows, glassmorphism-by-default, gradient text, and mesh blobs.
- Side-stripe accent borders, including a 3px `border-left` card; the hero-metric template of big number plus gradient accent plus icon; identical icon-card grids.
- Tiny uppercase tracked eyebrows above every section. Allow at most one eyebrow per three sections. Ban numbered section labels such as `01 / 02 / 03` unless the content is genuinely sequential.
- Decorative status dots, middle-dot separator chains, version stamps, locale/weather strips, and scroll cues.
- Generic content such as `John Doe`, `Acme`, lorem ipsum, fake-perfect numbers like `50%` or `99.9%`, and filler verbs such as `elevate`, `seamless`, `unleash`, or `empower`. Use plausible AU retail names, the user's own store/client names, and messy organic figures.
- Centered-everything symmetry; three equal cards as a reflex; `border-top` plus `border-bottom` hairlines on every row of a long table. Group rows or card the specs.
- Fake browser chrome or fake device frames. The canvas is the product surface.

## G. Copy

- Write every title as a finding, not a topic. Write every action label as verb plus object.
- Keep one voice per canvas. Ban marketing buzzwords, aphorism cadence, and AI-cute wordplay.
- Audit every visible string before sending. Rewrite broken grammar, unclear referents, and LLM-poetic filler as plain functional sentences.

## H. Pre-Flight

Run this before showing every canvas version. Fix every failure silently, then send.

1. Confirm zero em-dashes and en-dashes are visible anywhere.
2. Confirm zero external requests, a fully offline open, and no console errors.
3. Confirm contrast passes: body 4.5:1, large text 3:1, and every chip, badge, and button checked.
4. Confirm one accent, one grey family, and one radius scale with no drift.
5. Confirm every data figure uses tabular numerals, every value is plausibly messy, and `FAKE DATA` is present.
6. Confirm eyebrow count is no more than `ceil(sections ÷ 3)` and no numbered-section scaffolding appears.
7. Confirm nothing from the banned list in section F is visible.
8. Confirm each chart has no more than four gridlines, direct labels or a tight legend, and a title that states the insight.
9. Run the squint test: exactly one thing dominates and the page answers `so what?` in five seconds.
10. Run the slop test: could anyone glance at this and say `AI made that`? Find the tell and kill it.
