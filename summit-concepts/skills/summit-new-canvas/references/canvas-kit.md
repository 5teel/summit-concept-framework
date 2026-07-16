# Canvas kit

Use these mechanics for every canvas. Read `design-bar.md` separately for taste and quality.

## Container

- Build **one self-contained HTML file** with inline CSS and inline JS only.
- Make zero external requests: no CDNs, web fonts, remote images, imported CSS, or imported JS. Summit's platform enforces CSP; build the habit at sketch stage.
- Use the system font stack: `-apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`.
- Work desktop-first in a 1280px frame, while letting the page compress sensibly on narrower screens.

## Design tokens

Treat these as placeholders until the Summit Design System is bundled with the plugin:

- Navy `#0E2A47`: header and primary
- Cyan `#2FB8E8`: accent, used sparingly
- Light grey `#F5F7FA`: page background
- White: cards
- Ink `#1A2733`
- Mid-grey text `#5B6B7B`
- Good `#1E8E5A`
- Bad `#C9403A`

## Fixed chrome

Put the following on every canvas:

- A slim navy header bar with a white `summit` text wordmark and the concept's working title. Use text, not an image.
- A `FAKE DATA` badge in the top-right corner, on every version.

## Fidelity ladder

Design from day one. Canvas v1 needs real layout, real type hierarchy, a real spacing rhythm, and navy chrome. Keep colour restrained to navy, greys, and the accent on the single focal element so the user still feels safe tearing it up. Firm up only what the user confirms. Give the final version full Summit skin and micro-interactions where they earn their place, per `design-bar.md`.

Never ship a lorem-ipsum wireframe. Never let early polish outrun what is understood.

## Annotation layer

Design annotations into the canvas rather than sticking them on afterward.

### Question pins

- Place small navy numbered circles (`1`, `2`, `3`...) absolutely on regions in doubt.
- Mirror them in an **Open questions** strip along the bottom: pin number plus the exact question.
- Match the pin numbers to the numbered chat questions so the user can reply `pin 2: weekly`.

### Assumption chips

- Put one slim strip directly under the header.
- Use red-outlined `GUESS` chips for anything filled in by the skill.
- Use green `CONFIRMED` chips once the user validates something.
- Fast progress means more visible red chips, never silent assumptions or missing chips.

### Notes toggle

- Put a small **Notes** button at the top-right.
- Toggle the whole annotation layer: pins, chips, and open-questions strip.
- Default annotations ON while iterating and OFF in the final packaged `canvas.html`.
- Remove resolved pins in the next version. Move parked pins into the brief's open-questions list.

## Data and charts

- Use obviously fake but plausible data. Real retailer and client names are fine when the user named them.
- Invent messy, organic figures such as `47.2%`, never fake-perfect `50%` values.
- Hand-write charts as inline SVG. Do not use chart libraries.
- Follow all chart rules in `design-bar.md`.

## File naming

Save versions as `Canvas/canvas-v1.html`, `Canvas/canvas-v2.html`, and so on. Save the final approved copy as `Canvas/canvas.html`.
