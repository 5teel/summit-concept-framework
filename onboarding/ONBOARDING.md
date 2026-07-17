# Concept Writer Onboarding

Everything you need to add **concepts** from Claude — one-time setup, then a couple of
commands. (A concept is any idea → visual POC, up to the point you submit it.)

The skills ship as a **Claude plugin** (`summit-concepts`) from a marketplace on
GitHub (`5teel/summit-concept-framework`) — so there's nothing to copy around, and
updates reach everyone from one place.

> **Quickstart diagram:** open [`concept-writer-quickstart.html`](concept-writer-quickstart.html)
> — the four steps, minimal fuss.

---

## 1. One-time setup

### First, map the drive + (for Claude Code) install the plugin

From the mapped **X:** drive, go to
`X:\Labs\summit-concept-framework\onboarding\` and **double-click**:

```
Setup-ConceptWriter.bat
```

That maps the DATA share to **`X:`** (so the dashboard write-back works) and, if you
use **Claude Code**, registers the marketplace and installs the `summit-concepts`
plugin for you. No admin, no prompts.

### Then, in Claude Cowork (desktop app) — once

Cowork uses its own **Plugins** panel (it doesn't read Claude Code's skills), so add
the plugin there:

1. Open the **Plugins** panel → **Add marketplace**.
2. Paste the marketplace repo:
   `5teel/summit-concept-framework`
   *(or the full URL `https://github.com/5teel/summit-concept-framework`)*
3. Install the **`summit-concepts`** plugin.
4. **Connect BOTH folders.** Cowork runs in a sandbox, so this is the only way the skills
   reach your data:
   - **Add folder → `X:\Labs`** — the dashboard, templates, and client measure packs (read).
   - **Add folder → your local workspace** — use the **exact path the installer printed**
     (the `local workspace ready: ...` line). It is a `Summit` folder under *your* Documents,
     so the path differs from PC to PC — if your Documents are OneDrive-redirected it looks
     like `C:\Users\<you>\OneDrive - Summit Insights Pty Ltd\Documents\Summit`. Your report
     outputs are written here (read/write).
5. **Start a new chat.**

(If concepts aren't showing up on the dashboard, a missing `X:\Labs` connection is almost
always the reason — re-connect it.)

That's the whole install. It gives you the plugin's skills: **`summit-new-canvas`**
(sketch a raw idea into a designed HTML canvas), **`summit-concept`** (add / build /
submit a concept), **`summit-cdr`** (for Strategists — harvest CDRs → freeze → promote →
hand off), and **`summit-vi-report-writer`** (build & validate VI report JSON).

---

## 2. Use it

| Step | Say to Claude | Why |
|---|---|---|
| **0. Sketch a raw idea** | `sketch this` / `new canvas` | Fleshes a half-formed idea into a designed HTML canvas, grounded in Summit's business, data and asset shelf (`summit-new-canvas`). Optional — skip to step 1 if you've already built something |
| **1. Add your concept** | `summit-concept import "C:\path\to\your\project"` <br>*(or `summit-concept my-idea` for a brand-new idea)* | Reads the project and registers it on the Concept Dashboard so the team can see it |
| **2. Build & iterate** | just keep building your POC | Explore freely; it stays visible |
| **3. Submit** | `summit-concept submit` | A quick completeness check, then it's ready for a Strategist |
| **4. Done** | — | A **Strategist** takes it from here |

Import reads your project folder (or an HTML file / URL / app) and captures the
benefit, a link to your working POC, and the key features automatically — so you
rarely type metadata by hand. It's **read-only** toward your project — it never
modifies the source.

---

## 3. See your concepts — the dashboard

Every concept publishes to the shared **Concept Dashboard** at `X:\Labs`. **Open it by
double-clicking `X:\Labs\Dashboard.bat`** — it opens in your browser, rebuilds itself on
open/refresh (so concepts added from Cowork show up straight away), and saves renames /
re-ranking automatically with no prompts.

*(Double-clicking the raw `X:\Labs\index.html` also works, but it only shows the last
saved snapshot — use `Dashboard.bat` so you always see the latest.)*

---

## If you get stuck

- **What the concept skill does** — [`summit-concepts/skills/summit-concept/SKILL.md`](../summit-concepts/skills/summit-concept/SKILL.md)
- **The whole pipeline** — [`PIPELINE.md`](../PIPELINE.md)
- **Concept Dashboard** — `X:\Labs\index.html`

### Troubleshooting

- **`summit-concept` doesn't appear in Cowork** — the plugin isn't installed there yet.
  Cowork is separate from Claude Code: add the marketplace + install the plugin in the
  **Plugins** panel (step 1 above), then start a new Cowork chat.
- **`summit-concept` doesn't appear in Claude Code** — restart Claude Code so it loads
  the plugin, or re-run `Setup-ConceptWriter.bat`.
- **The skill runs in Cowork but can't write the concept** — Cowork can't see `X:\Labs`
  until you connect it: **Add folder → `X:\Labs`** in Cowork, then re-run the command.
- **Concept written but not on the dashboard** — open the dashboard with
  **`Dashboard.bat`** (not the raw `index.html`); it rebuilds on open so new concepts appear.
- **"X:\Labs not reachable"** — the drive map hasn't taken; **sign out and back in** (or
  reconnect the drive), then re-run the installer.
- **The VI report skill can't write its output** — your local workspace isn't connected:
  **Add folder → the workspace path the installer printed**, then re-run the command.
- **Updating to the latest skill — or a skill is missing entirely** — refresh the
  marketplace **first**, then update the plugin. The two apps do this differently —
  **Cowork has no typed plugin commands** (typing `/plugin ...` there just errors with
  "Unknown skill"); everything happens in its **Plugins panel**:

  | | Cowork (Plugins panel — no typed commands) | Claude Code (terminal) |
  |---|---|---|
  | 1. Refresh the marketplace | Open **Plugins** → **remove** the `summit-insights` marketplace → **Add marketplace** → `5teel/summit-concept-framework` again (the panel has no refresh action — remove + re-add IS the refresh) | `claude plugin marketplace update summit-insights` |
  | 2. Update the plugin | Install **`summit-concepts`** from the re-added marketplace | `claude plugin update summit-concepts@summit-insights` |
  | 3. Then | start a **new chat** | restart Claude Code — **open sessions keep the old skills until restarted** |

  **Why step 1 is not optional:** Claude keeps its own clone of the marketplace repo and
  never re-fetches it on its own. It stays pinned at whatever commit you first installed
  from, so updating the plugin alone finds nothing newer and reports you're already
  up to date. Any skill added to the marketplace *after* your install date stays invisible
  until you refresh. If a colleague has skills you don't, this is almost always why.
  Cowork and Code keep **separate clones** — updating one does not update the other.

  (For Claude Code, re-running `Setup-ConceptWriter.bat` also works — it performs both
  steps. It cannot update Cowork; only the Plugins panel can.)
- **Skills stored somewhere unusual** — the installer targets the standard locations;
  if yours differ, tell IT and we'll adjust.

---

## Why a plugin (not a copied file)?

Claude Cowork only loads skills that arrive as an **installed plugin from a git
marketplace** — it doesn't read a hand-copied skills folder or a local path. Serving the
framework as a marketplace **on GitHub** means one governed source of truth: install
once, update centrally (admin pushes → each writer refreshes the marketplace and updates
the plugin), and the exact same skill runs for every Concept Writer in both Cowork and
Claude Code.

---

*Concept Writers explore and build; Strategists harvest and promote; Agentic Engineers
build. You own the concept — register it early, even rough. The dashboard's value grows
with every concept on it.*
