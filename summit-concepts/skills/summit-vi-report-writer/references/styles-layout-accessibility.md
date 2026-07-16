# Styles, layout, and accessibility

Knowledge snapshot: 2026-07-10.

## Design order

1. **[Contract]** Define the business hierarchy: heading/context → primary evidence → secondary detail → source/notes.
2. **[Contract]** Select the smallest view/panel set.
3. **[Schema invariant]** Size and place panels within the Dashboard grid.
4. **[Proven pattern]** Apply supplied preset colours/typography or a neutral accessible direction.
5. **[Contract]** Test target screens, keyboard use, contrast, clipping, and exports.

## Panel and grid rules

- **[Schema invariant]** Keep `Col + SizeX ≤ Columns`; reject unintended overlaps.
- **[Proven pattern]** SizeY clips silently and Dashboard panels do not automatically stack on resize.
- **[Contract]** Use measured grid/pixel relationships only as planning aids; validate actual target screens.
- **[Proven pattern]** Use transparent panel styling when the widget supplies its own card/background.

## Textbox CSS

- **[Proven pattern]** Scope IDs/classes to the panel/view. Bare utility names can collide with platform CSS.
- **[Proven pattern]** Flex, CSS Grid, gap/wrap, gradients, CSS variables, font weights, line height, and letter spacing work in proven contexts.
- **[Proven pattern]** `clamp(min, preferred, max)` is responsive. Wrap preferred multi-unit arithmetic in `calc()`.
- **[Proven pattern]** Middle/center alignment supports the safest pure-CSS fill. Top/left layouts need an explicitly proven sizing approach.
- **[Observed but unsafe / denied]** JS/inline-handler sizing is deprecation-risked; flag every use and require IT review.
- **[Proven pattern]** Avoid raw Unicode emoji; use text or entities.

## Colour and presets

- **[Proven pattern]** Use supplied generic configuration-preset colour/logo tokens when available.
- **[Contract]** Never invent a client colour, logo URL, or preset key.
- **[Contract]** Use colour plus text/shape/icon cues for status. Do not encode meaning by colour alone.
- **[Contract]** Verify text/background contrast and chart series distinguishability.

## Typography

- **[Contract]** Keep one clear view heading, concise labels, consistent weights, and readable data density.
- **[Proven pattern]** `rem` remains browser-root based; `vw`/`vh` follow the browser viewport, not the panel.
- **[Contract]** Avoid tiny labels, truncated titles, excessive rotation, and decorative text that competes with evidence.

## Controls and accessibility

- **[Contract]** Give controls visible captions and a logical order.
- **[Contract]** Preserve keyboard-safe native controls; custom JS must not trap focus.
- **[Contract]** Wider/Fullscreen controls need visible labels/ARIA and manual keyboard/fullscreen tests when applicable.
- **[Contract]** Tables need understandable headers; charts need titles/labels or adjacent explanation sufficient for the audience.

## Responsive/manual checks

Test smallest/largest target screen, first render, view navigation away/back, browser zoom, toolbar wrapping, panel clipping/scrollbars, Fullscreen/Wider, long labels, empty/null states, and PDF/PPT/Excel output requested by the contract.
