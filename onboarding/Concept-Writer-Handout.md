# Concept Writer — How to Add a Concept

*A concept = any idea → visual POC, up to the point you submit it. Adding one takes one command and publishes it to the team dashboard on `X:\Labs`.*

---

## Set up once (per PC)

1. On the **X:** drive, open `X:\Labs\summit-concept-framework\onboarding\` and
   double-click **`Install-ReportWriter.bat`**.
   *(Maps `X:` and, for Claude Code, installs the plugin.)*
2. **In Claude Cowork:** Plugins panel → **Add marketplace** →
   `X:\Labs` → install **`summit-concepts`**.
   *(Start a new chat afterwards.)*

That's it — you now have `summit-concept` in Claude.

---

## Add a concept (the everyday flow)

In Claude Cowork or Claude Code:

**You already built something** (a folder, an HTML page, a demo URL, or a running app):
```
summit-concept import "C:\path\to\your\project"
```

**Starting from a fresh idea:**
```
summit-concept my-idea
```

Claude reads it, drafts the **name, benefit, a link to your POC, and the key features**,
and shows you the draft to **confirm or tweak**. It never changes your project — it only
publishes a card to the dashboard.

**When it's demonstrable, submit it:**
```
summit-concept submit
```
A quick completeness check, then it's ready for a Strategist. You're done.

---

## See it / manage it

Open the **Concept Dashboard**: double-click **`X:\Labs\Dashboard.bat`** (or `X:\Labs\index.html`).

- Your concept appears instantly with its stage and benefit.
- **Rename** inline (hover a row → pencil). **Drag** to re-rank the queue.
- Everything you and the team add shows up here — that's the point: shared visibility so
  duplicates and synergies surface early.

---

## Good habits

- **Register early** — even a rough idea. A concept card is free; the dashboard's value is coverage.
- **Drop one-liners** in `NOTES.md` while you build (`!` decided · `?` open) — that's the raw
  material a Strategist harvests into decisions later.
- **A preview/Railway URL is not "production."** Production = built into VI or another Summit
  environment, which happens *after* handoff. Your POC stays a concept.

---

## Stuck?

- Skill not showing in **Cowork** → the plugin isn't installed there; do step 2 above, then a new chat.
- Skill not showing in **Code** → restart Claude Code, or re-run `Install-ReportWriter.bat`.
- `X:\Labs` not reachable → sign out/in so the mapped drive reconnects.
- Full guide: `onboarding\ONBOARDING.md` · Pipeline: `PIPELINE.md`
