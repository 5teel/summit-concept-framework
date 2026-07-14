# Concept Writer Onboarding

Everything you need to add **concepts** from Claude — one-time setup, then two
commands. (A concept is any idea → visual POC, up to the point you submit it.)

The skills ship as a **Claude plugin** (`summit-concepts`) from a marketplace on
GitHub (`5teel/summit-concept-framework`) — so there's nothing to copy around, and
updates reach everyone from one place.

> **Quickstart diagram:** open [`report-writer-quickstart.html`](report-writer-quickstart.html)
> — the four steps, minimal fuss.

---

## 1. One-time setup

### First, map the drive + (for Claude Code) install the plugin

From the mapped **X:** drive, go to
`X:\Labs\summit-concept-framework\onboarding\` and **double-click**:

```
Install-ReportWriter.bat
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
3. Install the **`summit-concepts`** plugin, then start a new chat.

That's the whole install. It gives you two skills: **`summit-concept`** (add / build /
submit a concept) and **`summit-cdr`** (for Strategists — harvest CDRs → freeze →
promote → hand off).

---

## 2. Use it (two commands to Claude)

| Step | Say to Claude | Why |
|---|---|---|
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

Every concept publishes to the shared **Concept Dashboard** at `X:\Labs`. Open it two
ways:

- **Double-click `X:\Labs\Dashboard.bat`** — opens in your browser; rename and
  re-rank save automatically, no prompts.
- Or double-click `X:\Labs\index.html` (you'll be asked once to connect the folder so
  edits can save).

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
  the plugin, or re-run `Install-ReportWriter.bat`.
- **"X:\Labs not reachable"** — the drive map hasn't taken; **sign out and back in** (or
  reconnect the drive), then re-run the installer.
- **Updating to the latest skill** — run `/plugin update summit-concepts` (Cowork) or
  re-run `Install-ReportWriter.bat` (Code). New versions come from the GitHub marketplace.
- **Skills stored somewhere unusual** — the installer targets the standard locations;
  if yours differ, tell IT and we'll adjust.

---

## Why a plugin (not a copied file)?

Claude Cowork only loads skills that arrive as an **installed plugin from a git
marketplace** — it doesn't read a hand-copied skills folder or a local path. Serving the
framework as a marketplace **on GitHub** means one governed source of truth: install
once, update centrally (push → `/plugin update`), and the exact same skill runs for every
Concept Writer in both Cowork and Claude Code.

---

*Concept Writers explore and build; Strategists harvest and promote; Agentic Engineers
build. You own the concept — register it early, even rough. The dashboard's value grows
with every concept on it.*
