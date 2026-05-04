# COOPR Design System

COOPR is an AI-native workspace for video creators — one product replacing the five tools they juggle today (docs + editor + Notion + spreadsheet + clip cutter). The aesthetic is **editorial, not dashboard**: closer to a New York Times Magazine layout than a SaaS app. **Coopr** (the agent) is always-on — drafts, scores, and scaffolds inline. Voice is producer, not chatbot.

**Audience:** Solo and small-team creators with established channels (50k+ subs typical), shipping 1–3 pieces of content per week.

**Eight surfaces:** Home (chat-first agent) · Docs (editorial canvas — scripts, hook tests, shot lists) · Clip Lab (auto-detected vertical cuts) · Library (catalog of shipped work) · Insights (perf · retention · format DNA · audience) · Intel (trends, competitor radar) · Inbox (cross-platform comments + DMs) · Calendar (cross-platform publish schedule).

## Source materials

- **GitHub:** `henryhcooperr/coopr-prototype` (default branch `main`)
- **Live deploy:** https://coopr-vercel-deploy.vercel.app
- **Order of authority** for any change:
  1. `brand/anti-slop.md` — hard rejections (never violate)
  2. `decisions.md` — axis-keyed locked decisions, latest entry wins
  3. `brand/voice.md` + `palette.md` + `typography.md` + `motion.md` — universal layer
  4. `hifi.css` — token implementation
  5. Wave-specific JSX modules (R6 → R9)

The brand layer is universal; R6/R7/R8/R9 wave decisions are Docs-surface specific.

---

## Index

| File / folder | What's in it |
|---|---|
| `colors_and_type.css` | CSS variables — surfaces, fg, borders, accent, tones, type families, scale, spacing, radius, motion |
| `hifi.css` | Original token source from the prototype (kept verbatim for reference) |
| `brand/` | Universal layer — `voice.md`, `palette.md`, `typography.md`, `motion.md`, `anti-slop.md` |
| `assets/library-thumbs/` | Editorial cover thumbnails from the Library surface |
| `preview/` | Design system cards (Type, Colors, Spacing, Components, Brand) |
| `ui_kits/coopr-app/` | High-fidelity UI kit — chrome, Home, Docs, Insights, Library card primitives |
| `SKILL.md` | Agent Skill manifest (cross-compatible with Claude Code) |

---

## CONTENT FUNDAMENTALS

The voice rule that drives every other rule: **producer, not chatbot.** Coopr (the agent) speaks like someone reading the room — confident, dry, useful. Body copy is editorial-functional; dry-witty when it lands the punchline.

### Tone

- Confident · dry · useful. Functional first; wit only when it sticks the landing.
- No filler. No marketing. No encouragement phrases.
- Em-dashes are fine for editorial rhythm. Em-dashes that read as "AI tells" — strings of self-correction or hedging — are not.

### Casing & person

- Sentence case for everything except mono caps eyebrows.
- Coopr the agent uses imperative + observational ("Tightened hook 3 — kept the picks alone." "Eight-breaths phrase should land twice.").
- The user is "you" only when needed; most UI strings are written impersonally ("Drafting · v3", "Schedule approval only").
- Brand is COOPR (all caps) when standing alone as a wordmark; Coopr (titlecase) when referring to the agent inside copy.

### What's allowed

- Editorial italic headlines with a lyrical second line — the "italic tail" pattern: `+22% saves, +12% views. *One channel is going backwards.*`
- Mono caps eyebrows: `INSIGHTS · OVERVIEW · LAST 30 DAYS`
- Mono datelines: `SINCE MON 09:00 · +1.4K FOLLOWERS`, `4D AGO`
- Tabular mono numerals everywhere: `1,842 / 2,400`, `+340% saves`, `00:18`
- Italic serif empty states in `--fg-tertiary`: *"Start writing."* · *"No comments yet."*

### What's banned

- **No emojis** in UI strings. Action chips, headlines, labels, toasts — none.
- **No exclamation points** unless quoting data verbatim.
- **No "Hi there 👋"** chatbot openers · no "Great question!" · no "Hope this helps!" · no "you've got this".
- **No marketing-y feature names** ("Smart Insights", "Pro Builder", "Instant Magic"). Coopr's verbs are functional: *Tighten · Score · Pull · Pin · Draft.*
- **No sans-serif headlines** for editorial dispatches. Always Literata italic.
- **No lining figures in serif.** All numbers tabular mono.

### Reference dispatch (the gold standard)

> **INSIGHTS · OVERVIEW · LAST 30 DAYS**
> *+22% saves, +12% views.* ***One channel is going backwards.***
> YouTube carries the volume; TikTok cadence collapsed; Instagram is flat. Two pillars (safety + story) account for 64% of yield.

Mono caps eyebrow + Literata italic headline + italic tail in `fg-tertiary` + Inter Tight body, max-width 60ch. Every surface should rhyme with this.

---

## VISUAL FOUNDATIONS

### Surface — warm paper, no white-on-white

A four-step ivory ladder: `--bg-base #fbfaf6` (page) → `--surface-1 #fefdf9` (cards) → `--surface-2 #f5f3ec` (hover, embeds) → `--surface-3 #ece9df` (input fields). Inverse for toasts is `--surface-ink #1a1815`. **No `#ffffff` anywhere.** True white reads cold against the ivory and breaks the magazine character.

### Foreground — cocoa single-hue

`--fg-primary #1a1815` for headlines · `--fg-secondary #5c5a55` for body · `--fg-tertiary #8a8782` for captions, dimmed labels, italic continuations. Pure black is forbidden — `1a1815` is the deepest value in the system.

### Accent — Single Hue Depth (cocoa-only, R8 v3 lock 2026-04-29)

`--accent-primary #5a371f` (deep cocoa) is the only saturated hue. No purple anywhere — every shade rejected. No vibrant gradients. No neon. The moss `#5b7a4c` token is opt-in via `[data-accent="moss"]` for legacy reference only; current default is cocoa.

State accents are still cocoa-family by value: success `#5a4a26`, warning `#a07346`, info `#806750`, danger `#7a3a24` (all paired with tinted ivory backgrounds).

### Type — three families, three roles

- **Literata** — editorial italic headlines (the COOPR signature). Always italic, weight 600, tracking −0.02 to −0.035em, line-height 1.06.
- **Inter Tight** — UI sans, primary. 13–14.5px body, 1.5–1.55 line-height. Plus Jakarta Sans is the system fallback inside the stack.
- **JetBrains Mono** — captions, eyebrows, datelines, all numerals. Caps eyebrows tracked 0.10–0.12em.
- Newsreader is held as an alternate long-form serif, currently unused.

Forbidden combinations: sans-serif headlines for editorial dispatches · mixed weights in body · letter-spacing on body sans · all-caps body · lining figures in serif.

### Spacing & radius

8-step spacing scale: `4 · 8 · 12 · 16 · 24 · 32 · 48 · 72px`. Five-step radius: `sm 4 · md 8 · lg 12 · xl 16 · 2xl 20`. Cards default to `--radius-lg` (12px); composer hero uses `--radius-xl` (16px). No fully-rounded pills except the small mono caps "Pro" pill and message-action pills.

### Shadow & elevation

**None.** `--shadow-sm/-md/-lg` are all set to `none`. Cards live by border alone (`--border-subtle #ebe7dc`, hover → `--border-default #d8d3c4`). This is the print-magazine character lock — flat editorial elevation. The only "depth" is the surface ladder.

### Borders

`subtle #ebe7dc` for card edges and dividers · `default #d8d3c4` for inputs and hover edges · `strong #b3aea2` for active inputs. Hairlines use `1px` solid; editorial rules use `var(--fg-primary)` for emphasis (single, double, or 3px thick — these are decorative, not structural).

### Hover & press

- **Hover:** background shifts `surface-1 → surface-2` and border `subtle → default`. **No lifts. No deep shadows.** Color/border transition `120ms ease-out`.
- **Press:** color deepens (e.g. `--accent-primary` → `--accent-primary-press`). No scale/shrink — "subtle is the point."
- **Focus:** `2px solid var(--accent-ring)` outline at `0` offset, no glow.

### Backgrounds & imagery

- No background patterns or textures on `--surface-1`. Clean paper only.
- Imagery is editorial photo (warm, slightly desaturated, magazine-cover feel) used at full-bleed inside cards. Library thumbnails are 4:5 cover ratios. No grain filters, no gradient overlays, no duotone treatments.
- No marketing illustrations · no animated mascots · no skeuomorphic icons · no decorative SVGs.

### Animation

- Easing vocabulary: `entry cubic-bezier(0.2, 0.7, 0.2, 1)` · `exit cubic-bezier(0.4, 0, 0.2, 1)` · `pill/spring cubic-bezier(0.16, 1, 0.3, 1)`. Never browser `ease-in/out` defaults. Never bounce or rebound.
- Duration: 80ms prep · 120ms hover · 180–220ms drawers · **250ms default** · 280–360ms larger reframes. Cap at 360ms (700–900ms only for mock-async scoring).
- Reduced-motion: production must honor `prefers-reduced-motion: reduce` (decision pending lock).

### Transparency & blur

Used sparingly. The only canonical blur is `--accent-soft #e8dcc8` (a tinted ivory, not actually transparent) for active pills and accent tints. Modal scrims fade `opacity 0 → 1` at 200ms — no backdrop-filter blur. No glassmorphism.

### Layout rules

- 1440 × 900 design canvas for the app shell.
- Topbar 52px · sub-tabs 42px · side rail 200px wide. Topbar and rail are fixed; canvas scrolls.
- Editorial body paragraphs cap at `60ch` for readability.
- Heading + body scroll as one unified column (R9 lesson — no fixed/compact-on-scroll switches).

### Component anatomy

- **Cards:** `--surface-1` bg + `1px solid --border-subtle` + `--radius-lg` + `--space-4` padding. No shadow.
- **Buttons:** 32px tall (28px small), `--radius-md`, weight 600 13px. Primary = `--accent-primary` fill. Secondary = `--surface-1` + `--border-default`. Ghost = transparent.
- **Inputs:** 36px tall, `--surface-1` bg, `1px solid --border-default`, `--radius-md`, 13px sans.
- **Tags / chips:** 22px tall, `--surface-2` bg, `1px solid --border-subtle`, 11.5px sans 500.
- **Eyebrow + dateline strip:** mono caps left + mono regular right, 10.5–11px, both in `--fg-tertiary`.

---

## ICONOGRAPHY

The codebase ships **no icon library and no icon font** — every glyph is **inline SVG**, hand-rolled or copied from a tiny in-house set. This is a deliberate constraint: it keeps stroke weight, terminal style, and grid consistent with the editorial type system, and it slams the door on emoji wayfinding (which is banned outright in `anti-slop.md`).

### Rules

- **Inline SVG only.** No icon fonts. No icon libraries (no Lucide, Heroicons, Feather, Material — none).
- **No emoji** as wayfinding or in UI strings. Anywhere.
- **No unicode arrows or symbols** in place of real icons (no `→`, `↑`, `★` standing in as a button glyph).
- **Stroke-based**, not filled. Stroke width `1.5–1.75`. Square or round line caps; no decorative terminals.
- **No "Magic" / sparkle / star / wand / crown** iconography. AI is *Coopr* — not "Magic Studio." (See anti-slop.)
- **No skeuomorphic** icons (drop shadows, 3D, gloss).
- **No animated mascots** or marketing illustrations.

### Substitutions used in this kit

Where the prototype's hand-drawn SVG isn't available, this kit uses minimal inline SVG drawn at the same stroke weight (1.5px) and 16/20px viewbox. **Flag for the user:** if a production icon set lands later, replace these inline glyphs and keep the stroke/grid contract.

### When you need a logo or wordmark

Use the typed COOPR wordmark — Inter Tight 700, tracking +0.02em, all caps. The brand mark `--surface-ink` block (24px, `--radius-sm`) with the letter "C" (Inter Tight 700, 11px) is the avatar form used in the topbar.

---

## Caveats & flags

- **No web font files attached.** Literata, Inter Tight, Plus Jakarta Sans, Newsreader, JetBrains Mono are all loaded from the Google Fonts CDN — same as the live prototype. No `fonts/` ttf/woff files exist in this system.
- **No icon assets shipped with the prototype.** All icons in this kit are minimal inline SVG drawn to the brand's stroke contract. Flag for replacement when a production icon set lands.
- **No logo file** in the prototype repo — wordmark is type-only (Inter Tight 700 caps). The "C" brand-mark avatar is type-on-ink, not a graphic.
- **Library thumbnails imported** under `assets/library-thumbs/` — the editorial cover photography used on the Library surface.
