# Read this first

You're being onboarded to design the **chat-first interaction system** and full **in-line block library** for COOPR — a creative engine for creators. The product is chat-first; the chat IS the home page.

## Folder contents

| File | What it is | When to read |
|---|---|---|
| **`00-START-HERE.md`** | This file. | Now. |
| **`01-BRIEF.md`** | The actual design brief. Two-phase: interaction system first, then block library. Voice rules, motion budget, anti-patterns, acceptance criteria. | Before doing anything. Read end-to-end. |
| **`02-tokens.css`** | The committed design tokens. Surfaces, foreground, borders, accent, tone, type, space, radius, shadow. **Match these exactly — don't invent new colors or fonts.** | Reference whenever you need a token value. |
| **`03-chat-shell-reference.jsx`** | The current chat surface (composer, sidebar, turns, three states: cold-start / default / active). React component source — read it for layout, structure, role labels. | When designing anything in the chat shell. |
| **`04-fixture-data.js`** | Realistic fixture data — posts, threads, voice samples, channels. Use these names/numbers/snippets in your prototypes so the copy reads true. | When you need example content for a block. |
| **`05-block-catalog.md`** | Flat list of every in-line block type with its one-line job. Use this to pick which block to design next. | When iterating block-by-block in Phase 2. |

## How to work this

1. **Phase 1 first.** Design the interaction system (composer, streaming, reasoning trail, tool runs, scope picker, save-to-workspace, voice, sidebar, three chat states). Don't touch blocks until the choreography is locked.
2. **Phase 2 second.** One block at a time. Use `05-block-catalog.md` as the worklist. Each block needs idle / hover / loading / empty / error states + a unique visual treatment (no template-mode).
3. **Phase 3 last.** Three interactive prototypes that string Phase 1 + Phase 2 together — listed in the brief's acceptance criteria.

## Hard rules (these cannot be deviated from — full list in 01-BRIEF.md § 3)

- **No emojis** anywhere. Status conveyed by tone tokens.
- **No "AI" language.** COOPR is a creative engine, not an AI assistant. No sparkles, no wand glyphs.
- **No external icon libraries.** Inline SVG only.
- **No shadows.** Cards live by border alone. Flat editorial.
- **All numbers tabular mono.** Always.
- **All headlines serif italic 600.** (Literata / Newsreader, never Inter, never sans for display.)
- **Niche-agnostic copy.** Fixture data is dive-flavored on purpose; UI strings must not assume diving.
- **No Claude-style chat tells.** No "Great question!", no em-dash asides, no closer boilerplate.

## When to ask

If anything in `01-BRIEF.md` is ambiguous — ask before designing. Cheaper to clarify than to redesign. The user is the creator (Henry) — he'll respond with crisp direction.
