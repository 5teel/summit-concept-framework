# Textbox security policy

Knowledge snapshot: 2026-07-10. **[Observed but unsafe / denied]** These are hard delivery gates for every Textbox Content field.

## Strategy

- **[Contract] Tier 1 — prefer:** native widgets and pure HTML/scoped CSS/token Textboxes.
- **[Observed but unsafe / denied] Tier 2 — deprecating:** JavaScript/inline-handler Textboxes work today but may break under future CSP tightening. Flag every use; automated verification and IT sign-off are required before PRD.
- **[Observed but unsafe / denied] Tier 3:** hosted/IFrame apps are outside this skill.

## Nine rules

1. **No network calls.** Reject fetch, XMLHttpRequest, ajax/axios, sendBeacon, WebSocket/EventSource, and network-capable equivalents, including same-origin API calls.
2. **No credentials or secrets.** Reject recognised token/key/bearer/password patterns, plain or obfuscated. Treat exposed credentials as compromised.
3. **No storage/cookies.** Reject document.cookie, local/session storage, indexedDB, and navigator credentials.
4. **No dynamic code.** Reject eval, Function constructors, document.write, and string-form timers.
5. **No external code/resources.** Reject external script/link/import/worker loads and base64/atob-injected loaders.
6. **Images use the environment CDN.** Reject blob/raw-storage/external image hosts. Generic preset-rendered inline image HTML is permitted when supplied.
7. **Iframes require approved HTTPS hosts.** Even permitted host shapes require IT approval; IFrame work remains outside this builder.
8. **Navigation is relative same-origin.** Reject absolute location changes, javascript URIs, external form actions, and meta refresh.
9. **No debug code in PRD.** Reject alert/confirm/prompt, console methods, and debugger. Non-PRD findings remain warnings that must be removed before promotion.

## CSP additions

- **[Observed but unsafe / denied]** External images, stylesheets/icon-font CDNs, CSS imports, and blob URLs are blocked.
- **[Observed but unsafe / denied]** Inline event handlers/javascript URIs remain functional only temporarily; warn and prefer delegated listeners or CSS/native interactions.
- **[Contract]** Any JavaScript Content sets `requiresItSignoff: true` in validation output.

## Literal dollars

- **[Observed but unsafe / denied]** A raw dollar outside recognised tokens can silently spool, including currency text, CSS `$=`, and JavaScript identifiers.
- **[Proven pattern]** Use `&#36;` for static currency.
- **[Contract]** Do not enforce a Content-length limit; size is informational.

## HTML/event safety

- **[Observed but unsafe / denied]** Double quotes inside a double-quoted inline event attribute can terminate the attribute and render script text visibly.
- **[Proven pattern]** Prefer no inline handler. If an approved exception remains, validate delimiter integrity and use delegated/document-level listeners where possible.
- **[Proven pattern]** Direct panel listeners may disappear after SPA view navigation; delegated listeners persist.

## Process

1. Validate every Content field locally.
2. Fix all errors and review every warning.
3. Test in DEV/UAT/UAT2; never author directly in PRD.
4. For any JavaScript, run IT's verification process and obtain sign-off.
5. After the separate local publisher process writes to UAT2, verify rendering/interactions in the browser; IT owns PRD promotion.

See [widget-textbox.md](widget-textbox.md), [tokens.md](tokens.md), and [validation-contract.md](validation-contract.md).
