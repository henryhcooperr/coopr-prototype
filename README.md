# COOPR · chat-first v2 hi-fi prototype

A creator-content workspace prototype. Babel-standalone React loaded in-browser via `master.html` — no build step, no npm.

**Live:** https://coopr-vercel-deploy.vercel.app

## Aesthetic

- **Surface**: ivory warmth (`#fbfaf6` / `#fefdf9`), cocoa single-hue depth, no white-on-white
- **Accent**: moss (`#5a6a3a`) — earth-tone, harmonizes with warm paper
- **Type**: Literata (editorial italic headlines) · Inter Tight (UI sans) · JetBrains Mono (captions, numbers, eyebrows)
- **Style**: editorial dispatch, not dashboard. Big serif italic headlines + lyrical italic tails + mono caps eyebrows + tabular mono numbers.

## Anti-slop watchlist

- No purple
- No "Magic" / sparkle / star branding
- No emojis in UI strings
- No marketing illustrations or animated mascots
- No premium upsell pills with gold/star/lock icons
- No vibrant accent gradients
- No card hover lifts with deep shadows
- All numerals tabular mono
- All eyebrow caps in mono
- All editorial titles in serif italic

## Architecture

- `master.html` — canonical entry; loads ~150 jsx files via `<script type="text/babel">`
- `tweaks.html` — token variant gallery
- Eight workspaces: Home · Docs · Clip Lab · Library · Insights · Intel · Inbox · Calendar
- Cross-file symbols via `Object.assign(window, { ... })` — no `import` / `export`
- Inline SVG only; no icon libraries
- All visual tokens in `hifi.css`
- Design decisions axis-keyed in `decisions.md` (append-only)

## Wave history

- R3 / R4 — initial library, blocks, chat primitives
- R5 — Studio Docs (frozen — read-only)
- R6 — Docs reframe (chrome reconfig on doc-entry, single vessel home, COOPR component blocks)
- R7 — interactive blocks expansion (caption A/B, pull-quote, stat callout, channels, series pin, comment poll)
- R8 — single-vessel canvas + inline heading tools + discoverability + scripted-hook/transcript
- R9 (cohesion) — IA collapse (Studio retired), chrome density, doc card real previews, tweaks→master channel, editorial-header primitive

## Quickstart

```bash
python3 -m http.server 8765
# open http://localhost:8765/master.html
```

## Open the doc surface directly

`master.html#interactive/docs/Home` → click any card

## Notes for design-system tooling

- `hifi.css` is the single source of truth for tokens
- `decisions.md` carries every locked design decision (axis-keyed, latest entry per axis wins)
- `HANDOFF-README-claude.md` (if present) has full orientation
- Each `hifi-cohesion-r9-*.jsx` is a self-contained module; safe to read in isolation
