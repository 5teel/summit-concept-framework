# Client measure packs — index & load rule

Client measure packs are **Summit-internal client data**. They live **only** on the connected
Summit Labs share under `client-packs/<client-key>/` (and the private mono-repo) — **never in
this marketplace repo**. Never copy pack contents into a skill, a reference, or a commit.

## When to load one

Load a client pack **only** when the user's need is tied to a specific client **and** a matching
pack folder exists on the connected share. If no share is connected or no matching pack exists,
work generically and ask for the client's pack or a supplied measure export — never invent
measures, tags, or client patterns.

## What a pack contains

`client-packs/<client-key>/`:
- `measures.json` — exact measure tags, meanings, and aliases (the measure dictionary)
- `measure-guide.md` — how to route everyday wording to exact tags
- `golden-report-guide.md` + `golden-report-blueprints.json` — sanitized report patterns (when present)

## Which skills use this

- **summit-vi-report-writer** — ships no client measures; resolves the confirmed client's pack at
  build time (`--client-pack-dir <path to client-packs/<client-key>>`).
- **summit-new-canvas** — when a sketch is explicitly grounded in a specific client's data, may
  consult the matching pack to ground measures/patterns; otherwise stays generic.

Discover available packs by **listing the connected `client-packs/` store at runtime**. This index
deliberately names no client, so nothing client-identifying is published in this repo.
