# COOPR · Chat-First v2 · Design System

**Status:** Active prototype · pre-implementation
**Last touched:** 2026-04-29 (master entry shipped · layout ↔ interactive)
**Why this folder exists:** Henry was mid-prompt on a Library upgrade in claude.ai/design when usage capped out. This is the consolidated working prototype so we can keep iterating in Claude Code (the CLI) without losing context. **DO NOT** port any of this into `frontend/` until Henry says so.

---

## Open it

**Canonical entry: `master.html`.** One document, two views, every surface:

- **Interactive view (default)** — the v10 floating pill + hover drawer + click-through navigation. The whole prototype walks like a real app. Press `L` (or click the toggle) to flip to layout.
- **Layout view** — the figma-ish "every surface at once" canvas. One DCSection per workspace, one DCArtboard per subtab. Click any artboard to enter the v10 chrome on that surface. The active surface is framed clay.

URL hash deep-links work in both modes:
- `#interactive/insights/overview` · `#layout/library/series` · `#layout` · `#interactive`
- View mode and active surface persist via URL hash; mode also persists across reloads via `localStorage` (key `cv-master-mode`).

The surface registry is `hifi-master-registry.jsx` — a single source of truth keyed by `(workspace, subtab)` that both views consume.

### Archeology — kept for reference

- `Hi-fi round 4.html` — the canvas-only baseline. Native `HfShell` chrome. Use when you want to see every surface as-is.
- `chrome-v10.html` — the v10 chrome ideation page. Single surface at a time inside the floating pill.
- `tweaks.html` — token-variant gallery for one surface at a time.
- `Hi-fi round 1/2/3.html` — earlier rounds. Don't delete them.

---

## File map

```
coopr-chat-first-v2-wip/
├── Hi-fi round 4.html           ← open this
├── Hi-fi round 3.html           ← prior baseline
├── Hi-fi round 1/2.html         ← earlier rounds
├── Direction 1.html             ← original direction set
├── Shell explore.html           ← shell experiments
│
├── hifi.css                     ← TOKENS + BASE CLASSES (single source of truth)
├── wireframe.css                ← wireframe-mode tokens (less polished)
├── hifi-data.js                 ← single source of truth for ALL fixture data
│                                  (creator, posts, drafts, channels, voice, etc)
│
├── design-canvas.jsx            ← <DesignCanvas>/<DCSection>/<DCArtboard>/<DCPostIt>
│                                  Figma-ish layout. Drag/rename/focus.
├── hifi-shell.jsx               ← <HfShell> — canonical app chrome (topbar + subtabs)
│                                  HF_SHELL_WORKSPACES + HF_SHELL_SUBTABS define IA.
├── hifi-chrome.jsx              ← Round 1 chrome (kept for old artboards)
├── hifi-data-chrome.jsx         ← Data-rich chrome variant
├── hifi-charts.jsx              ← chart primitives
├── hifi-screens.jsx             ← misc screen helpers
│
│ ── Round 3 surfaces (keep as-is unless redesigning) ──
├── hifi-home.jsx                ← Home/Chat (default · cold-open · active · empty · collapsed)
├── hifi-home-command.jsx        ← Home · command-center alt
├── hifi-chat.jsx                ← chat blocks/composer
├── hifi-studio.jsx              ← Studio (round 1 — partly superseded by r3)
├── hifi-studio-r3.jsx           ← Studio R3 — pipeline + 3 doc shapes + slash + list/cal/shipped
├── hifi-library.jsx             ← Library R3 — platform-faithful grid + detail modal
├── hifi-library-data.jsx        ← Library R3 — archive grid + sortable table
├── hifi-insights-data.jsx       ← Insights · Overview/Retention/FormatDNA/Audience/Posting
├── hifi-intel.jsx               ← Intel · Pulse broadsheet
├── hifi-inbox.jsx               ← Inbox · 4 tabs
├── hifi-more.jsx                ← Calendar + Settings + Switcher + Onboarding
├── hifi-r3-audit.jsx            ← R3 cover · chrome audit · IA contract
├── hifi-tokens.jsx              ← Token proposals · chart palette · inventory
│
│ ── Round 4 · Library upgrade (in progress) ──
├── hifi-r4-lib-visuals.jsx      ← FOUNDATION · MUST LOAD FIRST. Exposes:
│                                    R4PlatformCard · R4PillarDot · R4ChannelChip
│                                    R4ThumbBackdrop · R4ChromeLongYT/ReelIG/ShortTT/CarouselIG
│                                    R4PerfOverlay · R4RetentionSpark · R4Chip · R4Stat
│                                    R4_LIB_VISUALS (per-post overrides) · R4_TONE_PALETTES
│                                    r4FmtViews · r4PlatformLabel · r4CardDims
├── hifi-r4-lib-catalog.jsx      ← HF_R4_LibraryCatalog — sectioned grid front door
├── hifi-r4-lib-detail.jsx       ← HF_R4_LibraryDetail — content-first post view
├── hifi-r4-lib-series.jsx       ← HF_R4_LibrarySeries — case file per multi-part project
├── hifi-r4-lib-patterns.jsx     ← HF_R4_LibraryPatterns — pillars · formats · hook DNA
├── hifi-r4-lib-timeline.jsx     ← HF_R4_LibraryTimeline — the journal (1 row/month)
├── hifi-r4-lib-pairing.jsx     ← HF_R4_LibraryPairing — one idea × three channels
│
│ ── Entry points ──
├── app-hifi-r3.jsx              ← prior R3 entry (don't edit, just here for reference)
├── app-hifi-r4.jsx              ← CURRENT entry — extends R3 with Library·R4 section
├── app.jsx · app-hifi.jsx · app-d1cf.jsx ← older entries kept for archeology
│
├── HANDOFF-README.md            ← original claude.ai/design handoff README
└── DESIGN-SYSTEM.md             ← this file
```

---

## Design tokens (hifi.css)

**Palette is committed. Don't reinvent. Reach for variables.**

| Token group | Variables | Use |
|---|---|---|
| **Surfaces** (IVORY · R8 v3 default · Ivory warmth) | `--bg-base #fbfaf6` · `--surface-1 #fefdf9` · `--surface-2 #f5f3ec` · `--surface-3 #ece9df` · `--surface-ink #1a1815` | Almost-white but still warm (W-D from tweaks gallery). Pairs with the cocoa-only palette. Page bg · cards · pressed states · inputs · dark slabs. |
| **Foreground** | `--fg-primary #1a1815` · `--fg-secondary #5c5a55` · `--fg-tertiary #8a8782` · `--fg-on-accent` · `--fg-on-ink` | Body · meta · captions · text-on-fill |
| **Borders** (R8 v3 ivory-tuned) | `--border-subtle #ebe7dc` · `--border-default #d8d3c4` · `--border-strong #b3aea2` | Hairlines · cards · emphasis. Tuned to pair with `--bg-base #fbfaf6`. |
| **Accent** (COCOA · R8 v3 default · Single Hue Depth) | `--accent-primary #5a371f` · `-hover #48291a` · `-press #371e13` · `--accent-soft #e8dcc8` · `--accent-ring rgba(90,55,31,0.25)` | Single Hue Depth palette (P-H from tweaks gallery). All 4 tones are also cocoa shades — depth via value, not hue. R4 inherits via `:root`. |
| **Accent variants** (opt-in via `<body data-accent="...">`) | `ink #1a1815` · `moss #5b7a4c` · `cocoa #6b4226` (each with `-hover`, `-press`, `-soft`, `-ring`) | Side-by-side comparison + earlier-round fallback. Tweaks gallery uses these. The legacy `[data-accent-proposed="true"]` alias was retired in R8 v3 — Hi-fi round 1/2/3 now inherit `:root` directly. |
| **Tone** (Single Hue Depth · cocoa shades only) | `--tone-success #5a4a26` · `--tone-warning #a07346` · `--tone-info #806750` · `--tone-danger #7a3a24` (each with `-bg` companion) | Status · charts · semantic. Every tone shares the cocoa hue family — discipline via monochromatic depth. |
| **Type** (R8 v3 baseline) | `--font-sans 'Inter Tight'` (Plus Jakarta fallback) · `--font-serif 'Literata'` (Newsreader fallback, italic at 600 + tight tracking for headlines · `.hf-headline` / `h1` / `h2` lock applied globally) · `--font-mono 'JetBrains Mono'` (`.hf-byline` / `.hf-folio` lock at 0.06em letter-spacing) | UI · editorial headlines · captions/keys/numbers. T-E variant from tweaks gallery; HW-E + ET-B globally applied. |
| **Type scale** | `--text-xs 12` → `--text-3xl 36` (px) | |
| **Space** | `--space-1 4` → `--space-12 72` (px) | |
| **Radius** | `--radius-sm 4` · `-md 8` · `-lg 12` · `-xl 16` · `-2xl 20` | |
| **Shadow** (R8 v3 default · None) | `--shadow-sm: none` · `--shadow-md: none` · `--shadow-lg: none` | SH-B None lock. Cards live by border alone — flat editorial · zero elevation · print-magazine character. |

**Aesthetic in one line:** ivory warmth · cocoa-only palette + cocoa-only tones (Single Hue Depth, R8 v3) · flat editorial — zero shadow, cards by border alone · Literata italic-600 display headlines at −0.035em · Inter Tight body · mono captions tracked at 0.06em on `.hf-byline` / `.hf-folio` · tabular nums on every figure.

**Things NOT in the palette and shouldn't be:** any blue gradients, any AI-purple, any pure white (`#fff`), any pure black (`#000`), any sans-serif headlines (use Newsreader italic), any system fonts.

---

## Information architecture (the IA contract)

Defined in `hifi-shell.jsx`:

```
TOP-LEVEL WORKSPACES (centered tabs in topbar)
  Home · Studio · Library · Insights · Intel · Inbox · Calendar

SUB-TABS (per workspace, left-aligned in second strip)
  home:     []                                   ← chat is the workspace
  studio:   Pipeline · Docs · List · Calendar · Shipped
  library:  Catalog · Series · Patterns · Timeline · Pairings
  insights: Overview · Retention · Format DNA · Audience · Posting
  intel:    Trends · Radar · Inspiration · DNA · Memory · Studies
  inbox:    Comments · DMs · Mentions · Replies
  calendar: []                                   ← single surface
```

**Settings is NOT a workspace** — it's reached from the avatar dropdown.
**Calendar at top-level is distinct from Studio · Calendar** — top-level shows cross-platform post schedule, Studio · Calendar shows project due-dates only.

---

## Component primitives — Round 4 visuals

These are the building blocks Round 4 introduced. Use them everywhere new in Library · Round 4 land:

| Primitive | Signature | Notes |
|---|---|---|
| `R4PlatformCard` | `({ post, density, perfMode, selectable, selected, onClick })` | The hero. Density = `compact \| regular \| lush`. perfMode = `off \| curve \| numbers`. Picks chrome from `R4_LIB_VISUALS[post.id].display` (`reel-ig` · `short-tt` · `long-yt` · `carousel-ig`). Aspect-correct per platform. |
| `R4ThumbBackdrop` | `({ tone, children })` | Per-tone gradient + speckles; the "thumbnail vibe". Tones in `R4_TONE_PALETTES`. |
| `R4Chrome*` (4 variants) | `({ hook, durationS })` | Platform-faithful overlay — IG reel, TT short, YT long, IG carousel. |
| `R4PerfOverlay` | `({ post, mode })` | Bottom strip — sparkline + watch% + saves, OR big numbers. |
| `R4RetentionSpark` | `({ data, w, h, accent })` | Tiny inline curve. |
| `R4PillarDot` | `({ pillar, size })` | 4 colors: safety=clay · gear=info · story=success · reply=warning. |
| `R4ChannelChip` | `({ ch })` | 18×14 px platform tile (yt=red, ig/tt=ink). |
| `R4Chip` | `({ active, size, accent })` | Filter pill. |
| `R4Stat` | `({ label, value, sub, big })` | Mono-eyebrow + serif-italic figure. |

**All primitives are already on `window`** — call directly (e.g. `<R4PlatformCard ...>`) or via `window.R4PlatformCard`. Both work because Babel-standalone scripts execute at top level.

**Per-post visual overrides live in `R4_LIB_VISUALS` (in hifi-r4-lib-visuals.jsx).** When you add a post to `hifi-data.js`, also add its visuals row (`display`, `tone`, `hook`, `cooprScore`, `lifecycle`, `velocity`, `improve`, `trial`, `series`).

---

## How to extend the prototype

### Add a new artboard to an existing section
Edit `app-hifi-r4.jsx`. Pattern:

```jsx
<DCArtboard id="r4-lib-newview" label="R4 · NewView · what it shows" width={SW} height={SH}>
  <HF_R4_LibraryNewView />
</DCArtboard>
```

`SW = 1440`, `SH = 900` is the canonical screen size. Use `width={1440} height={760}` for non-screen artboards (audits, tables, etc).

### Add a new R4 surface
1. Create `hifi-r4-lib-newview.jsx` next to its siblings.
2. Top of file: `/* global React, window, HfShell, R4PlatformCard, ... */`
3. Pattern:
   ```jsx
   function HF_R4_LibraryNewView() {
     return (
       <HfShell workspace="library" subtab="<MatchingSubtabName>" topbarRight={<...>}>
         { /* whatever */ }
       </HfShell>
     );
   }
   Object.assign(window, { HF_R4_LibraryNewView });
   ```
4. Add a `<script type="text/babel" src="hifi-r4-lib-newview.jsx">` to `Hi-fi round 4.html` AFTER `hifi-r4-lib-visuals.jsx` and BEFORE `app-hifi-r4.jsx`.
5. Add the artboard in `app-hifi-r4.jsx`.

### Add a brand-new workspace section
Add `HF_SHELL_WORKSPACES` and `HF_SHELL_SUBTABS` entries in `hifi-shell.jsx`, then build surfaces and a `<DCSection>` in `app-hifi-r4.jsx`.

### Edit fixture data
`hifi-data.js`. Single source of truth. Posts, drafts, voice, channels — all here. **Don't fork** — every new surface should consume `window.HF_DATA`.

### Toggle accent color
`<body data-accent-proposed="true">` in the HTML applies the moss alternative (`hifi.css` lines 80-86). Remove it to fall back to clay default.

---

## Conventions Claude Code must follow when iterating

1. **Babel-standalone runtime, not a build.** No imports/exports — every file is `<script type="text/babel">`. Use `window.X = X` or `Object.assign(window, { X })` to share. Don't reach for npm packages or JSX modules.

2. **Never use external icon libraries.** All icons in this prototype are inline SVG (4–12 viewBox). Match that.

3. **No emojis** in any UI strings. (Persistent user preference — see global memory.) Status/intent are conveyed by color + tone tokens.

4. **Newsreader italic for editorial headlines, JetBrains Mono UPPERCASE 0.1em-tracked for eyebrows/captions/numbers.** Plus Jakarta Sans for body, labels, buttons. **Never** mix in Inter, system-ui as a primary, or any other display font.

5. **Numbers always tabular.** `font-family: var(--font-mono)` or class `.hf-num`. Watch percentages, view counts, scores — all mono.

6. **Mixed aspect ratios are the point.** `R4PlatformCard` is intentionally not the same height across platforms. Use `gap: '28px 18px'` + `align-items: flex-start` for sectioned grids.

7. **Surfaces cap at width 1440, height 900.** This matches the design canvas screen frame. If you need more, scroll within the surface (`overflow: auto`).

8. **Don't normalize the layouts.** R4 surfaces deliberately use different grids (catalog = sectioned flex-wrap; pairing = strict 5-col grid; series = 300+1fr split; timeline = 1fr+280 with gutter). The variety IS the design system here.

9. **Niche-agnostic in any new surface text.** Henry's identity is dive-creator, but the COPY in shipped product is creator-agnostic. The fixture data (`hifi-data.js`) is dive-flavored on purpose — but new strings should not assume dive specifically. (Example: catalog masthead says "412 posts across 3 platforms", not "412 dive posts".)

10. **When the user asks to "ship to v3" or "promote to the real frontend",** stop and confirm. This folder is prototype. The real path is `frontend/src/` and goes through the drafts system in `data/drafts/`. Don't conflate.

---

## Round 4/5 status (where we are right now)

**Closed in R7 (2026-04-28, massive systematic loop · cull v3/R3 cruft + axis-level review):**
- ~~**Cull library-r3 DCSection** (4 artboards: HF_LibraryGrid · HF_LibraryDetail · HF_LibraryArchive · HF_LibraryTable). Library R4 (Catalog/Detail/Series/Patterns/Timeline/Pairing/Compare · 9 artboards) has fully superseded it. Components stay on disk for legacy `app-hifi-r3.jsx` and `app-hifi.jsx` entries; only the script tags + DCArtboard wiring removed from Round 4.~~
- ~~**Cull settings-conn artboard** (HF_Settings, R1 connections-only). Settings R2 set (6 surfaces) provides full coverage including `HF_SettingsConnections_R2` with re-auth + scope chips. `HF_Settings` stays defined in `hifi-more.jsx` (legacy entry consumers); only the DCArtboard removed.~~
- ~~**Unwire `hifi-library.jsx` + `hifi-library-data.jsx` script tags** from `Hi-fi round 4.html`. Both files survive on disk for `app-hifi-r3.jsx` / `app-hifi.jsx` references. Removed from Round 4 load order so the cache is leaner.~~
- ~~**Token / anti-slop sweep across active surfaces** — applied per-axis improvements (composite score deltas captured in `/tmp/r7-massive-loop-report.md`).~~

**Drafted (7 surfaces wired into Hi-fi round 4 · 8 artboards · subtab list now 6):**
- Catalog · sectioned grid (Best of 30d · Recent · Trials) · with filter-active strip + hover-state on first pinned card
- Detail · content-first post view · **two artboards**: long-form YT (post 0042) + short-form TT (post 0039)
- Series · case file (Truk Lagoon) · **rail now weights cooking series** with soft-accent stripe + pill
- Patterns · pillars + formats + hook DNA · **dashboard band above the fold** with anchor links into each section
- Timeline · the journal
- Pairing · one idea × three channels · 9 ideas
- **Compare** (R5 · NEW) · 3 posts side-by-side · overlaid retention curves · comparison table · synthesis rail

**Closed in R8 · LOCK-IN v3 (2026-04-29, expanded tweak suite committed · 5 axes flipped at once):**
- ~~**Palette flip: P-B Editorial Magazine → P-H Single Hue Depth.** Cocoa shades only · depth via value not hue · monochromatic earth · maximum discipline. New `:root --accent-primary #5a371f`, `--accent-soft #e8dcc8`, plus harmonized cocoa-shade tones (`--tone-success #5a4a26`, `--tone-warning #a07346`, `--tone-info #806750`, `--tone-danger #7a3a24`). Replaces the clay primary committed in R8 v2; the warm-earth chromatic mix (moss/amber/slate-blue/brick) is gone. The chromatic floor is the cocoa hue family — every "loud" element across the surface set still reads as warm-earth, never red or saturated.~~
- ~~**Warmth lock: W-D Ivory.** Almost-white but still warm. New `:root --bg-base #fbfaf6`, `--surface-1 #fefdf9`, `--surface-2 #f5f3ec`, `--surface-3 #ece9df`. Borders retuned to match (`--border-subtle #ebe7dc`, `--border-default #d8d3c4`). Replaces the warm-paper baseline; pairs cleanly with the cocoa palette and lifts the page out of the slightly-toasted feel into something closer to a magazine spread on coated stock.~~
- ~~**Shadow lock: SH-B None.** All `--shadow-*` tokens set to `none` at `:root`. Maximum editorial flatness · zero elevation · cards live by border alone. Reinforces the print-magazine character of the locked palette + warmth. Surfaces that wrote shadows via `var(--shadow-sm)` / `var(--shadow-md)` / `var(--shadow-lg)` now read flat; surfaces with hardcoded `box-shadow` declarations are unchanged (anti-slop sweep already converted most active surfaces in R7).~~
- ~~**Headline treatment lock: HW-E Display.** New global CSS rule applies `font-weight: 600` + `letter-spacing: -0.035em` to `.hf-headline`, `.hf-headline span`, `h1`, `h2`. Magazine-cover italic feel — the editorial headline class now carries display-grade tracking by default; surfaces that wrote `.hf-headline` no longer need to set tracking inline. Existing inline `letterSpacing` declarations in surface JSX still win where present (CSS specificity), so this lock is additive rather than disruptive.~~
- ~~**Eyebrow tracking lock: ET-B Tight.** New global CSS rule applies `letter-spacing: 0.06em` to `.hf-byline` and `.hf-folio`. Closer-to-readable tracking · less typewriter-y on the small mono-uppercase metadata strips. Inline-style mono uppercase (most eyebrows in the active surfaces, written with explicit `letterSpacing: '0.14em'` etc.) stays at its declared value — the lock applies only to the canonical `.hf-byline` / `.hf-folio` classes.~~
- ~~**Tweaks gallery presets re-locked.** P-H, W-D, SH-B, HW-E, ET-B all carry the `LOCKED` suffix and empty token/rule overrides (matching new `:root`). P-B Editorial Magazine, W-A Warm paper, SH-A Standard, HW-A Standard, ET-A Standard each lose LOCKED status and gain explicit tokens or rules so users exploring still see the prior baseline correctly when toggled. P-A Ink Monochrome retains its explicit ink tokens. Default state on page load: T-E + P-H + D-A + W-D + R-A + SH-B + B-A + HW-E + ET-B + NS-A + S-A. Status line at panel bottom updated to `T-E + P-H + W-D + SH-B + HW-E + ET-B committed to hifi.css. Other axes are exploration-only.`~~
- ~~**Legacy `[data-accent-proposed="true"]` alias retired.** With Single Hue Depth (cocoa-only) as `:root`, the historical moss mapping no longer matched the lock direction. Hi-fi round 1/2/3 HTML files that set this attribute now inherit `:root` directly. Cleaner than maintaining a moss-flavored alias against a cocoa-only baseline.~~
- ~~**DESIGN-SYSTEM.md tokens table updated.** Surfaces row swapped from warm-paper → ivory. Borders row updated with new ivory-tuned values. Accent row swapped from clay-default → cocoa-default. Tone row swapped from warm-earth chromatic mix → Single Hue Depth cocoa shades. Type row notes the global HW-E and ET-B locks. Shadow row swapped from "subtle warm-ink ladder" → "None". Aesthetic-in-one-line rewritten to reflect the locked R8 v3 state.~~
- **Note · D-F density not committable.** D-F Editorial density (+28% scale) was selected as a preview but did NOT commit to source. Surfaces use raw inline px values (not `--space-*` tokens), so a CSS-var override has near-zero visible effect — the gallery's density axis is a `transform: scale()` approximation, not a real density refactor. Documented as exploration-only; a real density commit needs a separate spacing-token refactor pass.
- **Note · surface (S-A), radius (R-A), borders (B-A), numbers (NS-A) axes had no committable changes.** S-A is the preview-surface selector and isn't a token at all. R-A, B-A, NS-A were already the baseline — no token shift needed.

**Closed in R8 · LOCK-IN v2 (2026-04-28, palette flip from ink → Editorial Magazine):**
- ~~**Tweaks gallery v4 — palette axis added.** Replaced the single-accent axis (4 chips) with a multi-color palette axis (8 coordinated sets). Each palette overrides primary accent + 4 semantic tones together — `--accent-primary` + `--tone-success/-warning/-info/-danger`. Section colors stay coherent because they all draw from one curated set: header bands use accent, pillar yield rows use tone-info/success/warning, wins/laggards uses tone-success/warning, channel chart uses tone-info/-warning/-danger. Surfaces never modified — every palette swap cascades via CSS-var inheritance through the wrapper. Eight palettes shipped: P-A Ink Monochrome, P-B Editorial Magazine, P-C Field Notes, P-D Bauhaus, P-E Newspaper, P-F Soft Editorial, P-G Cool Mineral, P-H Single Hue Depth. Palette chips show 5-dot multi-swatch preview. Density axis expanded to 6 variants (D-A through D-F, range −10% Linear-tight → +28% editorial). Warmth axis kept at 4. Total combinations: 7 typo × 8 palette × 6 density × 4 warmth = 1,344 surface variations on one page.~~
- ~~**Palette flip: P-A Ink → P-B Editorial Magazine.** Reversal of the previous ink lock-in. After seeing the multi-color palette context, picked P-B (clay primary) instead. `:root --accent-primary` flipped from `#1a1815` (ink) to `#b6532b` (clay), with `-hover/-press/-soft/-ring` updated to match. Tones preserved as the existing warm-earth set in `:root` (moss success / amber warning / slate-blue info / brick danger) — already harmonize with clay. The `[data-accent="ink"]` selector added so the previous lock can be opt-in restored via `<body data-accent="ink">` (or via the tweaks gallery). Existing `[data-accent="moss|clay|cocoa"]` and legacy `[data-accent-proposed="true"]` selectors retained. The `data-accent="clay"` selector is now redundant with `:root` but kept for explicit opt-in clarity.~~
- ~~**Tweaks gallery presets re-locked.** P-B now carries the "LOCKED" subtitle and empty token override (matches new `:root`). P-A Ink loses LOCKED status, gains explicit ink token override so users exploring still see ink correctly when toggled. Default state on page load: T-E + P-B + D-A + W-A.~~
- ~~**DESIGN-SYSTEM.md updated.** Tokens table accent row swapped from ink-default to clay-default (with ink/moss/cocoa as variants). Aesthetic-in-one-line updated to "warm off-white paper · clay accent + warm-earth tones (Editorial Magazine, R8 v2) · Literata italic headlines · Inter Tight body".~~

**Closed in R8 · LOCK-IN (2026-04-28, typography + accent decision committed via tweaks gallery):**
- ~~**Tweaks gallery shipped** (`tweaks.html` + `hifi-tweaks.jsx` + `app-hifi-tweaks.jsx`). Standalone interactive page at `http://localhost:8765/tweaks.html`. Renders `HF_InsightsOverview` (sourced from `hifi-more.jsx`) inside a token-overriding wrapper div. Click chips to swap typography (7 variants across `originals` + `cleaner+` groups) and accent (4 swatches: clay / moss / ink / cocoa). CSS custom-property inheritance cascades the tokens through every nested element — surfaces never modified. Round 4 untouched during exploration. Pattern is reusable for future variant explorations (density, chrome, warmth) once those axes are refactor-ready.~~
- ~~**Typography decision: T-E Literata + Inter Tight.** Picked from the cleaner+ group. Literata is Google Books' default — designed for screen reading, with a slightly heavier feel and more uniform stroke contrast than Source Serif 4. Italic at 500 carries the editorial headlines; upright at 400 carries body. Inter Tight replaces Plus Jakarta Sans for UI/body — tighter spacing, sharper terminals, reads as more contemporary at small sizes. JetBrains Mono retained. `--font-serif` and `--font-sans` in `hifi.css :root` updated; Newsreader + Plus Jakarta retained as fallbacks for legacy contexts. New fonts added to Round 4 HTML's Google Fonts link.~~
- ~~**Accent decision: C-C Ink monochrome.** No chromatic accent. `--accent-primary` = `#1a1815` (near-black ink). Italic, weight, and size now do the work that color used to do. R4's `<body data-accent-proposed="true">` attribute removed — page inherits ink directly from `:root`. The previous moss / clay / cocoa palettes preserved as opt-in variants via `<body data-accent="moss|clay|cocoa">` for side-by-side comparison and legacy-round fallback. The `[data-accent-proposed="true"]` selector mapped to moss as a legacy alias so Hi-fi round 1/2/3 still render as designed.~~
- ~~**Tweaks gallery presets updated** post-lock to reflect the new baseline: T-E and C-C now have empty token overrides (matching defaults); T-A "Newsreader" and C-B "Moss" gained explicit token overrides so users exploring still see the original surfaces correctly. Both T-E and C-C labeled "LOCKED" in their chips with R8-baseline subtitles.~~
- ~~**DESIGN-SYSTEM.md tokens table updated**: Type row reflects Literata + Inter Tight + JetBrains Mono with old fonts as fallbacks; Accent row reflects ink-as-default + clay/moss/cocoa as variants; aesthetic-in-one-line updated to "warm off-white paper · ink monochrome (R8) · Literata italic headlines · Inter Tight body".~~

**Closed in R8 (2026-04-28, deferred-backlog cleanup · 10 surfaces lifted to promotion-bar):**
- ~~**Fleet R8A · Studio R3 doc surfaces editorial polish** (`hifi-studio-r3.jsx`, +102 lines net). 5 surfaces lifted past 90: `HF_StudioList` 85→94 (+9 — added editorial header band kicker+serif-italic+deck, 5-cell KPI strip with totalWords/dueThisWk/overdue derived stats, FreshnessPill in subtabRight), `HF_StudioCalendar` 85→93 (+8 — editorial header band, 4-cell KPI strip, warm-ink card shadows, tabular-nums on day numbers, per-day count pill), `HF_StudioDocHooks` 88→93 (+5 — R_DocAgentPresence band reused, inline R_AgentRewrite chip on hook 3 "Tightened by Coopr -8 words", "Just hooks." reframed as italic-serif eyebrow), `HF_StudioDocNotes` 84→92 (+8 — R_DocAgentPresence "Indexed for retrieval — won't shape it unless asked", two mono date sub-headers framing prose vs shot-list), `HF_StudioDocFull` 92→93 (+1 audit pass — eyebrow tabular-nums, meta-strip values tabular-nums, title closing period). Composite 86.8 → 93.0 (+6.2). All 5 within 80-line cap. Anti-slop zero hits. Reused R_DocAgentPresence / R_AgentRewrite / R_MM / R_ML / FreshnessPill — no redefinitions.~~
- ~~**Fleet R8B · Home secondary variants polish** (`hifi-more.jsx` + `hifi-home-command.jsx`, +110 lines net across 3 surfaces). `HF_HomeEmpty` 86→92 (+6 — declarative "Start anywhere. *I'll keep up.*" replaces question-style headline; full HomeComposer-pattern card replaces bare placeholder; 4 chip-style connector affordances (Paste a YouTube link · Connect Instagram · Drop a script · Describe what you make) mirror HomeColdOpen; killed loud accent-primary "Connect →" SaaS slop notification; closing italic-serif deferral line). `HF_HomeBriefingCollapsed` 86→91 (+5 — removed legacy multi-stat pill row that was the briefing in lipstick; added editorial masthead with mono Wed·Apr·24·Thread open·12m + thin rule + italic-serif "Since you started this thread:" recap with 3 fact clauses; trimmed BTF layer scrolls below docked composer with 7-col WeekAhead and 4-up LibraryPulse). `HF_HomeCommand` 86→92 (+6 — editorial header band parity with HomeChat: mono eyebrow at 0.18em + Newsreader-italic title with `<Henry>` italic-break + serif-italic deck with #01 in mono-clay; killed `.hf-headline` sans on H1 and replaced with explicit serif; new inline `<N>` helper wraps every body numeric in tabular-mono+600; KPI accent flag flipped on Comments/post→false so only Saves·7d retains clay accent matching the Priority #01 saves-velocity story). Composite 86.0 → 91.7 (+5.7). Note: HomeEmpty + HomeBriefingCollapsed actually live in `hifi-more.jsx` (the prompt assumed `hifi-home.jsx`); fleet found and edited correctly.~~
- ~~**Fleet R8C · Inbox · Mentions + Replies promotion-bar lift** (`hifi-inbox.jsx`, +73 lines net). Both surfaces brought to the editorial template that Comments_R2 / DMs_R2 already established (header band + 5-cell KPI strip + serif-italic mixed-italic headline + italic deck + closing "one thing to do today" callout in accent-soft). `HF_InboxMentions` 88→92.5 (+4.5 — added 5-cell KPI strip with new sentiment cell, dropped legacy 28px serif headline, wrapped 920-wide content in body container; 3 mention groups + BTF extensions UNCHANGED, no queue-logic regression). `HF_InboxReplies` 86→93 (+7 — added 5-cell KPI strip with new "within·24h" cell, demoted "What's working · synthesis" callout from accent-soft → surface-1+border so the imperative closing CTA owns the loudest accent block, 5 sent-reply rows + BTF older-replies UNCHANGED). Composite 87.0 → 92.75 (+5.75). Both clear the 90+ promotion bar. Anti-slop zero new hits.~~

**Closed in R7 (2026-04-28, massive systematic loop · cull v3 cruft + warm-ink shadow sweep):**
- ~~**Library R3 baseline cull.** 4 artboards retired from app-hifi-r4 wiring: `library-grid` (HF_LibraryGrid), `library-detail` (HF_LibraryDetail), `library-archive` (HF_LibraryArchive), `library-table` (HF_LibraryTable). Round 4 Library stack (Catalog + Catalog masonry + Detail YT + Detail TT + Series + Patterns + Timeline + Pairing + Compare = 9 artboards across 7 surface concepts) is the canonical Library now. Source files `hifi-library.jsx` and `hifi-library-data.jsx` preserved on disk + unwired from `Hi-fi round 4.html` script tags; `app-hifi.jsx` / `app-hifi-r3.jsx` legacy entries can still reference them for archeology. Settings R1 `settings-conn` artboard culled too — Settings R2 (`HF_SettingsConnections_R2` + 5 sibling surfaces) is the sole Settings IA owner.~~
- ~~**Warm-ink shadow sweep.** Hidden 13th anti-slop category — pure-black `rgba(0,0,0,X)` shadows on warm-paper surfaces — went 4 → 0 in active surfaces. Fixed: `hifi-calendar-r2.jsx:308` (drawer shadow → `var(--shadow-sm)`), `hifi-calendar-r2.jsx:654` (`rgba(0,0,0,0.05)` → `rgba(26,24,21,0.05)`), `hifi-calendar-r2.jsx:1017` (modal shadow → `var(--shadow-lg)`), `hifi-search.jsx:465` (dead-fallback `var(--shadow-lg, …rgba(0,0,0,0.22))` → `var(--shadow-lg)`), `Hi-fi round 4.html:22` (WIP banner → `rgba(26,24,21,0.18)`). Calendar Day/Month/Slot all jumped +4 (88→92) from this alone — subtle on screen but eliminates the "neutral-gray drop shadow on warm paper" disharmony.~~
- ~~**IA contract proof truthfulness.** `r3-iatable` artboard now ships an R7 retirements footnote so the canonical IA proof reflects current state (Library R3 + R1 Settings unwired). Without it, the next reviewer would see Library entries that don't match the artboard list and chase a phantom drift bug.~~
- ~~**Composite delta.** 72 active surfaces (post-cull) audited via /cb-hifi-critique. BEFORE 89.4/100 → AFTER 89.7/100. Localized gains of +4 on Calendar Day/Month/Slot and +4 on r3-iatable carried the system delta; most surfaces already scored 9+ on every axis and the loop confirmed that.~~

**Closed in R6 (2026-04-28, Studio recast · pipeline → workspace · agent in the doc):**
- ~~**Home BTF extension** — Home was a single-column 720px chat-first surface that ended at "recent threads". Extended below the fold with a wider 1248px editorial layer (`surface-1` band, separated by a thin top rule + dateline byline strip): `HomeWeekAhead` (7-day horizontal strip · today highlighted · per-day scheduled count + serif-italic post title), `HomeLibraryPulse` (4-up of recent posts that are still moving · channel glyph + watch% + serif-italic title + spark + view/save count, top-card clay-tinted), and `HomeOneThing` (italic-serif closing "trim Fujikawa cold-open from 1.92s to 1.2s" + single CTA, separated by a 6px double-rule). Artboard height bumped from `SH` to `SH * 2` so the desk view is visible on canvas. Composer / suggestions / briefing / threads stay above the fold unchanged.~~
- ~~**Studio: pipeline metaphor killed.** The 6-stage kanban (Spark / Outline / Hook / Voice pass / Rewrite / Ship-ready) implied a forced creative process. It's gone. Subtab `Pipeline` is now `Workspace`. IA contract updated in `hifi-shell.jsx` (`HF_SHELL_SUBTABS.studio`), `hifi-r3-audit.jsx` (`HF_R3IATable` + `HF_ChromeAudit` + decisions list). Legacy alias `HF_StudioPipeline = HF_StudioWorkspace` exported so Hi-fi round 1/2/3 still load. Status is now a tag on a card (drafting / outlining / rewrite / scratch / scheduled / shipped — order doesn't imply progression), not a column you have to pass through.~~
- ~~**`HF_StudioWorkspace` = free-form gallery** (replaces `HF_StudioPipeline` in `hifi-more.jsx`). Editorial header band ("What you're working on.") + hero action bar (`+ New doc` clay primary + 5 lighter "starting shapes": Blank doc, Hook list, Loose notes, Shot list, From a post — all empty starting points, none of them templates that force a structure) + filter row (status chips · group-by chips: Last touched / Pillar / Channel / Due / Status) + Pinned 3-up hero cards (large, with a clay-soft "Coopr is here" agent activity hint inside each) + Recent 4-up grid (compact cards) + closing italic-serif callout "What a project can be" explaining adaptive shape. Card primitives: `StudioHeroCard`, `StudioCompactCard`, `StudioStatusPill`, `StudioShapeGlyph` (doc / notes / hooks / carousel / shotlist svg glyphs). Artboard at `SH * 2` (1800px). `STUDIO_STATUS` token map shipped: each status carries bg/fg/border colors so the pill is consistent across cards.~~
- ~~**Slash menu → block atoms** (`HF_StudioSlash` in `hifi-studio.jsx`). The old `/idea /opener /script /list /brief /ship` linear-template menu is gone — those commands disguised the stage pipeline as autocomplete. New menu groups atoms by how the user thinks: **Write** (`/h1 /h2 /text /quote /callout`), **Plan** (`/hook /scene /beat /shot /checklist`), **Schedule** (`/caption /slot`), **Drop in** (`/image /clip /voice /post`), **Ask Coopr** (`/draft /edit /brainstorm /extract`). Agent items get the sparkle glyph; block items get a small square. Footer pill reads "Type anything · Coopr will do its best" — the agent prompt fall-through. Menu width 360px (was 320), max-height 540 with overflow.~~
- ~~**DocFull · agent as co-editor** (`HF_StudioDocFull` in `hifi-studio-r3.jsx`). Coopr is a participant in the doc, not a chatbot beside it. Five new primitives:~~
  - ~~`R_DocAgentPresence` — pinned strip at top of doc body in `accent-soft` rounded pill: clay sparkle avatar + "Coopr is in this doc." + italic-serif current activity + mono timestamp + "SEE 3 EDITS →".~~
  - ~~`R_AgentRewrite` — inline diff chip showing BEFORE (strikethrough fg-tertiary) / AFTER (italic clay) of an agent rewrite. Footer: clay sparkle + "Tightened by Coopr · -7 words" + Keep / Revert mono pills. Used inline in §02 Script for beat 2.~~
  - ~~`R_AgentSelectionBar` — dark floating Linear-style command bar above selected text. 4 quick verbs (Rewrite tighter / Extract as caption / Shorten by 30% / Make question) + "or ask…" fall-through. Anchored above §01 paragraph, which is rendered with a clay-tinted highlight to mimic an active text selection.~~
  - ~~`R_AgentAddedRow` — `accent-soft` row with clay sparkle, used in §03 Shot list to show 2 Coopr-added shots with mono "NEW" caption + batch "Keep both / Drop" affordance below the list.~~
  - ~~Inline "COOPR CAN DO IT" pills on unchecked Prep checklist items (§04). Side chat upgraded to feel like a co-editor's running commentary: "Done — dropped a tightened version inline (-7 words). Keep or revert from the diff chip in §02. I also pulled 2 more shots from your transcript that fit the rhythm."~~
- ~~**`HF_R3Cover` decisions list updated** to reflect the recast: decision 02 ("Studio is a workspace, not a pipeline"), decision 04 (subtab order: Workspace · Docs · List · Calendar · Shipped). `HF_R3IATable` and `HF_ChromeAudit` rows updated.~~
- ~~**Calendar R2 surface set** (`hifi-calendar-r2.jsx`). Five new artboards under the existing `calendar` DCSection — companions to the R1 `HF_Calendar` week view, not replacements. **Day** (`HF_CalendarDay`) — vertical hour-spine 06:00→22:00 with a "now" line, scheduled posts as channel-striped cards, 280px library drawer left, 360px right rail "one thing to do" CTA. **Month** (`HF_CalendarMonth`) — 5×7 April grid, today highlighted in `accent-soft`, weekends tinted, scheduled count + top-slot title per cell. **SlotDrawer** (`HF_CalendarSlotDrawer`) — week view at 1fr + 480px right drawer editing the Thu · 6:30 PM slot (asset preview · channel chips · time + best-window hint · caption box · approve/skip). **Conflict** (`HF_CalendarConflict`) — week view with an IG double-book inside 30 min flagged on the spine; clay alert band + 360px resolve drawer with three options (Re-time · Split · Merge), Option A pre-selected. **Empty** (`HF_CalendarEmpty`) — day-one state, faded grid behind a centered surface-1 panel with serif-italic pull-quote + clay "Connect a channel to schedule" hero CTA. Subtabs deferred — fleet recommended `['Week', 'Day', 'Month']` follow-up. Score 90/100.~~
- ~~**Settings R2 · six surfaces drafted** (`hifi-settings-r2.jsx` · `HF_SettingsAccount` · `HF_SettingsBrandVoice` · `HF_SettingsPlan` · `HF_SettingsNotifications` · `HF_SettingsConnections_R2` · `HF_SettingsData`). The R1 prototype only had Connections; R2 closes the loop. Editorial cue intentionally restrained — thinner header band (kicker + serif-italic title only, no deck), dense form rows on the 8pt grid, two-column 1fr/280px body grid with sidebar "danger zone" / "what COOPR pulls" / preset cards. Brand voice surfaces a credibility band ("Coopr studied 412 of your posts"), 5 weighted voice-sample cards, 4-pillar weight grid, removable forbidden-tones chip list. Plan uses an ink-surface "Pro" hero card and 4-row usage matrix. Notifications is a 3-channel × 8-category toggle matrix plus quiet-hours + three opinionated presets. Connections R2 stripes a re-auth row in tone-warning + scope chips + "what COOPR can see" disclosure. Data offers full export (ZIP/CSV/JSON), 4-step retention chip, 5 privacy toggles, audit log, split "erase library" vs "delete account" zones. Stance: stays flat (no shell subtabs); the in-surface 220px section nav handles navigation. Score 91/100.~~
- ~~**Inbox · Comments + DMs · editorial template parity** (`hifi-inbox-comments-r2.jsx` · `HF_InboxComments_R2`; `hifi-inbox-dms-r2.jsx` · `HF_InboxDMs_R2`). Brought the two remaining inbox tabs up to the same editorial template Mentions / Replies got. Each surface stacks: byline + "since last visit" newsticker + serif-italic mixed-italic headline + italic deck → 5-metric KPI strip → 3-pane intent-grouped queue (Sprout pattern for Comments; brand-priority queue with `IDR_FitPill` 0-100 score for DMs) → BTF extension (older queue · sentiment-over-time bars · most-active threads / accounts) → italic-serif "one thing to do today" closing CTA in `accent-soft` callout. Comments closes with the 0042 narcosis correction (factual challenge recovery); DMs closes with the Aqualung first-contact at fit 88 (brand priority). Both artboards bumped from `SH` to `SH * 2`. New primitive `IDR_FitPill` (brand-fit 0-100 with three-tier color: ≥80 success, 60-79 clay, <60 tertiary). Local `ICR_*` / `IDR_*` prefixes prevent collision with `hifi-inbox.jsx` helpers. IA contract unchanged. Scores 9.0 / 9.2 (composite).~~
- ~~**Search lands as overlay-only (stance B)** (`hifi-search.jsx`). No new workspace tab; no edit to `HF_SHELL_WORKSPACES` / `HF_SHELL_SUBTABS`. The "Search · ⌘K" chip already lives in every topbar; promoting Search would duplicate it. Modern command-palette UX (Linear, Notion, Raycast) treats search as modal-over-context. Four surfaces shipped: `HF_SearchOverlay` (720px floating palette over blurred Home backdrop · 8 grouped results across 6 scopes · show-all-34 footer), `HF_SearchEmpty` (cold state · 64px italic-serif "What are you looking for?" hero · 6 serif-italic suggestion chips · 5-row recent rail + 1 saved-search "My Tuesday review"), `HF_SearchResults` (280px filter rail with Type · Date · Pillar · Channel · Status — pillar rows reuse `R4PillarDot`, channel rows reuse `R4ChannelChip` — main column with editorial header band + 6 grouped result scopes · 17 items), `HF_SearchHistory` (resumed query "hook < 1.5s" with active-query block + 5 recents + 1 saved-highlight pinned in left rail · 3 NEW Inbox results since last run). Six-scope index model: Library posts · Studio docs · Inbox items · Intel signals · Settings · Coopr asks. `SearchPageChrome` helper mimics shell topbar but mutes every workspace tab to 45% opacity — visually "above the workspaces" without touching the IA contract. Score 92/100.~~
- ~~**Clip Lab — Studio sub-tab** (`hifi-cliplab.jsx`). Five surfaces for the un-parked Clip Lab feature (`.claude/specs/clip-lab-chat-first.md`): `HF_ClipLabEmpty` (day-one · italic-serif "Drop footage. Coopr finds the moments." + 3 affordances), `HF_ClipLabImport` (drop-zone band + 4-row upload ladder color-coded by stage `extracting → transcribing → analyzing → queued`), `HF_ClipLabAutoClips` (4×3 grid of 12 auto-detected 9:16 vertical clips · per-card "Coopr suggests" badge · predicted-score pill · use/skip pills · 1-line rationale), `HF_ClipLabReview` (1280×720 player on left with Coopr cut markers on the scrubber + AI tighten/loosen verbs + 3 cut-suggestion rows; transcript + lineage + decision actions on right; SH*2), `HF_ClipLabExport` (queue list with per-clip target-channel chips IG/TT/YT, bulk-caption affordance, dark `surface-ink` ship-all summary footer). IA stance: Studio sub-tab between `Workspace` and `Docs`. `HF_SHELL_SUBTABS.studio` extended to 6 entries; `HF_R3IATable` + `HF_ChromeAudit` synced. Local primitive `CL_AgentBand` mirrors `R_DocAgentPresence`. Reuses `R4ThumbBackdrop` + `R4_TONE_PALETTES` + `R4Chip`. Spec gaps surfaced (4): raw-footage flow not in spec (T0/T1 missing), "rank historical" Out-of-Scope conflict, no source-take lineage data shape, no drive/paste-link contract. Score 89/100.~~

**Closed in R5h (2026-04-28, ninth loop · timeline / pillars / pairing / compare):**
- ~~**Timeline rewrite** — replaced the month-row + annotation-rail layout with a true vertical date-node timeline. Continuous spine at x=142px from page edge. Each date with a post: filled node circle on the spine, mono-stacked date label (MON · DD italic-serif at 32px) to the left of the spine, branched content to the right (160×~285px uniform vertical thumb + meta strip + italic-serif title + sans subtitle + 5-stat row). Flagship dates (CScore ≥ 80) get a clay-fill node with `accent-soft` halo and a "FLAGSHIP" mono caption under the date. Month transitions break the spine with a 3-column band: month label + ctx (left), location + notes (center), the month's "what it taught the next" learning highlighted in `accent-soft` panel (right). End cap with hollow node + "EARLIER · 326 POSTS · LOAD MORE" affordance. Artboard height bumped to `SH * 3` (2700px) so the chronology scrolls cleanly. `R4TMonthHeader` / `R4TDateRow` / `R4TMediaThumb` / `R4TStat`.~~
- ~~**Pillars upgrade** — added `R4P_PillarMatrix` at the top of the Pillars section. 4 metrics × 4 pillars in a normalized-bar grid; the leader cell in each row gets a clay accent (bar + value). Below: existing 2x2 cards now include a 6-month share-over-time sparkline (per-pillar synthetic trend + ±pp delta in moss/warning) and an italic-serif insight one-liner. Per-pillar trends + insights live in `R4_PILLAR_SHARE_TREND` and `R4_PILLAR_INSIGHT`.~~
- ~~**Pairing update** — replaced `R4PlatformCard density="compact"` (mixed aspects) in the YT/IG/TT cells with a uniform `R4XVerticalThumb` (9:16 portrait, full-bleed thumbnail with score top-left, format pill top-right, handle bottom-left, format-aware hook treatment). Empty cells redesigned: now also 9:16 frame with NOT-PORTED chip top, italic-serif format suggestion centered, and a prominent full-width clay "+ Draft port →" CTA at bottom (was a small inline pill).~~
- ~~**Compare update** — replaced `R4PlatformCard density="compact" perfMode="curve"` in the 3-up post columns with a uniform `R4CVerticalThumb` (9:16 portrait, slightly larger than pairing's). Added an `R4CCommonStrip` between the 3-up columns and the overlaid retention curves: three vertical clay nubs joining a horizontal bracket that joins a centered `accent-soft` callout with the shared attributes ("all cold-open · all 3-sec retention > 90% · all clear library median save rate · same creator-voice index 80+"). Visualizes "what these three share" instead of forcing the reader to derive it from the table.~~

**Closed in R5g (2026-04-27, eighth loop · feed gone, Detail goes deep):**
- ~~**Removed Feed variant entirely** — `hifi-r4-lib-catalog-feed.jsx` deleted. Removed script tag from HTML. Removed `r4-lib-catalog-feed` artboard. View toggle in chrome reverted to `[Grid · Masonry]`.~~
- ~~**Detail page now ships 5 deep-analysis sections** in a new file `hifi-r4-lib-detail-analysis.jsx`. Per-post analysis data lives in `window.R4D_ANALYSIS` keyed by post id (rich data for `0042` and `0039`):~~
  - ~~**01 Hook DNA** — frame-by-frame breakdown of the opening 3 seconds. 11 frame cards in a horizontal strip; each card is a tone-palette gradient mini-thumb with timestamp (mono), 1-word descriptor (logo / title / cut / face / scene), and per-frame retention % colored by threshold (success / secondary / warning). Italic-serif takeaway paragraph below. `R4DHookDNA`.~~
  - ~~**02 Retention** — existing curve, now framed as ANALYSIS · 02 with the editorial header style. Followed inline by `R4DDropoffCards`: 1-3 callout cards per detected drop, each showing time-stamp, ±pp delta, italic-serif cause description, dashed-rule fix suggestion, and INSTRUCTIVE/FIXABLE kind tag.~~
  - ~~**03 Audience** — 4-quadrant cohort breakdown: WHO (new vs returning split bar), WHEN (timeline first 24h / 24-72h / 3-7d / 7-30d), WHERE (top 5 countries with bar list), DISCOVERY (followers vs algorithmic surface split). `R4DAudience`.~~
  - ~~**04 What people said** — comment cluster + sentiment. Sentiment band (positive / curious / critical / spam in moss / slate / amber / grey). 4 detected theme cards each with count, percentage, and pull-quote. Top thread by reply count rendered as a clay-soft accent callout with the comment, author, and reply count in serif italic. `R4DCommentCluster`.~~
  - ~~**05 Performance, in context** — 3-bar comparison per metric (COOPR SCORE, WATCH %, SAVE / VIEW): THIS POST in clay (emphasized 12px bar), CLUSTER AVG in slate, LIBRARY MEDIAN in tertiary grey. `R4DPerformanceVsCluster`.~~
- ~~Detail artboards bumped to `SH * 3` (2700px) so the full deep-analysis stack is visible on the canvas without internal scroll.~~

**Closed in R5f (2026-04-27, seventh loop · catalog grid as default):**
- ~~**New default Catalog = uniform vertical Grid view** (`hifi-r4-lib-catalog-grid.jsx` · `HF_R4_LibraryCatalogGrid`). Reference: creator-profile feel (Instagram / TikTok profile). Many pieces of content visible at once. CSS grid 7 columns at 1440 viewport · 12px gutter · 24px row gap. Each card is a full-bleed 9:16 portrait thumbnail (aspect-ratio: 9/16, width fluid from grid column) regardless of underlying format. Chrome on the card: clay score badge top-left (mono number) · white-glass format pill top-right (`VIDEO` · `REEL` · `SHORT` · `CAROUSEL` mono uppercase) · `@henry.dives` handle bottom-left in white sans · `TRIAL` flag bottom-right when applicable. Caption row below: `Apr 25 · 3.0K` mono. Hook treatment varies by format (serif italic for long-yt, sans-bold-lowercase for short-tt, sans-bold-uppercase for reel-ig) so the thumb still reads platform-flavored.~~
- ~~**View toggle in chrome reshuffled to `[Grid · Masonry · Feed]`** with Grid as the default. Masonry (former default) demoted to a variant — still available for browse-by-rhythm. Feed unchanged.~~
- ~~Updated app-hifi-r4 artboards: `r4-lib-catalog` (GRID, primary), `r4-lib-catalog-masonry` (former default, kept as variant), `r4-lib-catalog-feed` (magazine spread, kept as variant).~~

**Closed in R5e (2026-04-27, sixth loop · catalog vertical variant):**
- ~~Extracted `R4CatalogChrome` helper from `hifi-r4-lib-catalog.jsx` so the 3-band chrome (identity / filter / control) is reused across both catalog variants. Added a `view` prop that controls the new "View · Masonry / Feed" SegSwitch state in the control band.~~
- ~~Built **Catalog vertical feed variant** (`hifi-r4-lib-catalog-feed.jsx` · `HF_R4_LibraryCatalogFeed`). Magazine-spread layout: vertical stack of `R4FeedRow` components, alternating thumb-left / thumb-right with an oversize italic-serif numeric ("01", "02", "03"...) on the outer edge. Each row: 480px platform-faithful thumb + rich metadata panel (mono meta strip · 32px italic-serif title · italic blockquote of the post's improvement insight · 5-stat strip · 3-CTA action row · series/lineage hint). Different *purpose* than the masonry browse — this is the READ view.~~
- ~~Wired as the second Catalog artboard at twice the canvas height (`SH * 2`) so all 12 posts render in a single visible scroll. Subtab stays "Catalog" — both variants share the IA position; the View toggle in the control band is what switches them.~~
- Note on R5d: the `home-rail` artboard (chat + library rail on Home) was a misinterpretation of "vertical variant for the home page" — the actual ask was for a vertical variant of Catalog. Keeping the Home rail artboard as a reference design exploration; rip it out via app-hifi-r4 and `hifi-home-rail.jsx` if it's getting in the way.

**Closed in R5d (2026-04-27, fifth loop · density + drama + capability):**
- ~~**Catalog lush default** — masonry dropped from 4 cols to 3 cols at 1440 viewport. Column width 446px (was 330). Hero stays at fixed 660px independent of column count so it doesn't dominate when columns get wider.~~
- ~~**Pinned section gets warm-paper background** — `surface-1` background bleeds to body padding edges with thin top/bottom rules; other sections sit on `bg-base`. Visual frame around the curated picks.~~
- ~~**Thumbnail drama** — `R4ThumbBackdrop` now applies `filter: saturate(1.18) contrast(1.04)` to the gradient layer + a tiled SVG `fractalNoise` data-URL at `mix-blend-mode: overlay, opacity: 0.16`. Reads as film grain. Dot-speckle was static; this is procedural texture per thumb.~~
- ~~**Home vertical variant** — new artboard `home-rail` shows the chat workspace with a 320px library rail pinned to the right edge. Rail header ("YOUR LIBRARY · What you've made, recently."), vertical stack of 6 most-recent posts as compact cards with mono date + italic-serif title clamped to 2 lines + Coopr Score on the right, footer link to open Library. Reuses `HomeComposer / TodayBriefing / RecentThreads` from `hifi-home.jsx`. Proves Library scales into other workspaces.~~
- ~~**Detail · Reuse Moments section** — after the transcript, a 3-up grid of auto-detected high-retention timestamps. Each card: 3-frame clip-strip preview with the post's tone palette + saturation, mono time range, italic-serif caption ("The bow-shot scene"), 1-line `why` rationale, predicted CScore in clay, "Spawn as reel/carousel" CTA. Per-post moments live in `R4D_COPY[postId].reuseMoments`.~~
- ~~**Detail · Trajectory sparkline in score block** — 30-day cumulative-views growth at 70×18px, area-filled in moss + line. Replaced the old "TOP QUARTILE · +6% / day" caption. Per-post growth array in `R4D_COPY[postId].trajectory`.~~
- ~~**Detail · Kin posts** in right rail — 3 mini-cards under Lineage. Each: 52×52 tone-palette thumb (with post id in mono caption), italic-serif post title clamped 1 line, `why` rationale, similarity % in moss/grey. Adds a "see related" entry into the library knowledge graph from any Detail.~~

**Closed in R5c (2026-04-27, fourth loop · density + rhythm):**
- ~~**Catalog masonry pack** — switched from `flex-wrap` (which left ~140px of dead space below 16:9 cards next to 9:16 cards) to round-robin column distribution. 4 columns @ 1440px viewport, ~330px column width. Cards adopt column width via the new `colWidth` prop on R4PlatformCard; height is driven by aspect ratio, so platform-faithfulness is preserved while mixed aspects pack nose-to-tail.~~
- ~~**Hero card in "Best of last 30 days"** — first post (Truk flagship) becomes a 2-col-wide editorial spread: large thumbnail on the left, title + opening-line blockquote + 4-stat row on the right. Remaining posts flow below in masonry. Section starts with rhythm.~~
- ~~**Editorial section headers** — oversize italic-serif numerals ("01", "02", "03") at 76px in clay accent on the left, title + sub stacked beside. Bottom-bordered with a thin clay-soft accent rule. The "see all" link mono-uppercased to match.~~
- ~~**Detail short-form embed spread** — phone canvas was centered with ~600px of horizontal dead space on either side. Now 2-col grid: 340×605 phone on the left, **Scene Scan** widget on the right. Scene Scan pulls 4 moments from the retention curve at 0% / 25% / 50% / end, with timestamp + 5-sample local retention spark + italic-serif caption + hold-rate percentage. Editorial parallel content instead of empty padding.~~
- ~~Added `r4AspectHW(display)` helper to visuals (h/w ratio) for column-fluid card sizing.~~

**Closed in R5b (2026-04-27, third loop · Catalog chrome diet):**
- ~~Catalog chrome collapsed from ~260px (4 bands) → ~132px (3 bands). Killed the "Everything you've made, in one place." italic headline + the affordance-explaining body paragraph + the four tall stat blocks. Replaced with a single 52px identity strip: italic-serif "Library" wordmark + mono meta line on the left, four inline mono stats (`404 LIVE · 6 TRIAL · 38 GRADUATED · +18% 30D`) on the right.~~
- ~~Two-row filter block collapsed to one row. Pillars · State · Channel separated by thin vertical rules instead of stacked rows. Counts inline on each chip.~~
- ~~View bar + filter-active strip merged into a single 36px control band — filter-active state on the left ("47 of 412 · safety · live · YT · clear"), density/perf/sort/compare on the right.~~
- ~~`R4MastStat` (stacked label/serif-value/sub) replaced by `R4InlineStat` (inline mono pair). Old helper deleted.~~
- ~~Ratified load-bearing trio for v3: **Catalog · Series · Compare**.~~

**Closed in R5 (2026-04-27, second loop):**
- ~~Built **Compare surface** (`hifi-r4-lib-compare.jsx`) — the catalog's "Compare 2-3 posts" chip finally lands somewhere. Three default posts (0042 long YT · 0039 TT short · 0046 IG reel) overlaid on one chart, comparison table with BEST marker per row, synthesis rail with three observation cards.~~
- ~~Added **Patterns dashboard band** — 3-up summary above the fold. Each card shows eyebrow + italic title + one killer stat. Anchor-linked to the section below (`#pillars-section`, `#formats-section`, `#hooks-section`).~~
- ~~Added **filter-active strip** to Catalog — "SHOWING 47 OF 412 · 3 FILTERS ACTIVE · DIVE SAFETY · LIVE · YOUTUBE" + clear-filters action, between view bar and sections.~~
- ~~Added **hoverHint prop** to `R4PlatformCard` — accent ring + 2px lift + "OPEN ↗" pill at bottom-right. Catalog applies it to the first pinned card so the click affordance is visible on the static prototype.~~
- ~~Series rail now stripes **cooking series** with a 3px `accent-soft` left border (vs 3px `accent-primary` for active) AND replaces the inline "·N COOKING" caption with a pill-style badge (accent-soft fill, dot + count).~~
- ~~`HF_SHELL_SUBTABS.library` extended to 6 (added `Compare`). `HF_R3IATable` and `HF_ChromeAudit` synced.~~
- ~~Dropped a `CLAUDE.md` in this directory so future Claude Code sessions auto-load context. References this `DESIGN-SYSTEM.md`, the file map, the hard rules, and the extension recipes.~~

**Closed in R4 (earlier same day):**
- ~~`HF_R3IATable` / `HF_ChromeAudit` Library row used stale subtabs — re-synced to the new IA.~~
- ~~`hifi-r4-lib-pairing.jsx` `subtab="Pairing"` vs `HF_SHELL_SUBTABS.library` `"Pairings"` mismatch — fixed.~~
- ~~`hifi-r4-lib-detail.jsx` hardcoded post `0042` — refactored to accept a `postId` prop. Per-post copy in `R4D_COPY`. Embed branches on display type.~~
- ~~`R4_IDEAS` extended from 5 → 9.~~

**Round 4 vs Round 5 split:**
R4 was *inventory + correctness* (six surfaces drafted, IA accuracy fixed, Detail parameterized). R5 is *closing the loops* (Compare lands the catalog chip, Patterns gets a summary view, polish where the design promised something it didn't deliver).

**What's NOT done (to-do for next session):**
- Decide which subset is LOAD-BEARING for v3. **Recommendation: Catalog + Series + Compare.** Three surfaces, each with a distinct user job (browse · remember · analyze). Patterns + Timeline + Pairing are bonus depth and can live behind the same subtab strip without being core.
- Detail's per-post copy currently has only 2 entries in `R4D_COPY`. When promoting, generate from KB lineage data (memory + series tables) instead of hand-authoring per post.
- `R4_IDEAS` (Pairing) still represents only 9 of 124 ideas. Real implementation pulls from the niche/idea clustering over the embedding index — punt to backend.
- Compare's three posts and `R4C_SCORES` are hardcoded. Real implementation: 2-3 selected post ids passed in as state, sub-scores computed from each post's actual scoreboard.
- Catalog → Detail click is visually a hover affordance but doesn't navigate (DesignCanvas artboards are parallel). When promoting, wire URL state so `/library/post/0042` resolves.
- Color review: prototype defaults to `data-accent-proposed="true"` (moss). Round 3 originally shipped clay. Pick one for v3 before promoting anywhere.

**What "round 5" might bring (open questions):**
- A "Compare 2-3 posts" overlay (catalog already has the chip; nothing wired yet).
- Drag-from-catalog → drop-on-Calendar rebuild.
- Inline editing on Series memory entries (currently read-only).
- Mobile / responsive treatment — the entire prototype assumes 1440 desktop.

---

## R10 · State variants

The master prototype is a **functioning product walkthrough**, not a single-happy-path
catalog. Every surface authors its own *empty* / *loading* / *error* branches alongside
its *happy* render. The tweaks panel can dial any one surface into any one state for
side-by-side review in layout view. The contract below is what every surface in the
registry must honor.

### The four states

| Value | When it renders | What the surface shows |
|---|---|---|
| `'happy'` | Default. Real fixture data is present and complete. | The body that exists today — the figure, the grid, the table. Untouched by the variant work. |
| `'loading'` | Async dependency resolving. Skeleton placeholder phase. | Skeleton blocks on the 8pt grid. Animated shimmer (`var(--surface-2)` → `var(--surface-1)` sweep, 1400ms). No copy. |
| `'empty'` | The surface has no rows yet (day-one creator, fresh connection). | Newsreader-italic hero in `--fg-secondary`, one mono-eyebrow line above, one accent-primary CTA below. No illustration. |
| `'error'` | An async dependency failed. Reserved for surfaces that fetch (Insights, Inbox, Intel). | `tone-warning-bg` panel with mono-eyebrow `Couldn't load`, one italic-serif body line, one mono retry chip. |

Default is `'happy'`. Surfaces that don't pass `state` are unaffected — this is purely
additive.

### Recipe for surface authors

Surface bodies branch on `state` early and return a different render per branch. The
shell chrome stays identical across all four — the variant lives inside `<HfShell>`,
not around it.

```jsx
function HF_R4_LibraryCatalogGrid({ state = 'happy' }) {
  const posts = window.HF_DATA.posts;

  // Read tweaks override (R10 helper). Falls back to the prop, then 'happy'.
  // ws/sub literals must match HF_SHELL_SUBTABS — see INV-002 / INV-004.
  const ovr = window.useSurfaceState && window.useSurfaceState('library', 'Catalog');
  const s = ovr || state;

  return (
    <window.HfShell workspace="library" subtab="Catalog">
      {s === 'loading' && (
        <CatalogSkeleton rows={3} />            /* shimmer blocks, no text */
      )}
      {s === 'empty' && (
        <CatalogEmptyHero
          eyebrow="LIBRARY · 0 POSTS"
          title="Your first post will land here."
          cta="Connect a channel"
        />
      )}
      {s === 'error' && (
        <CatalogErrorPanel onRetry={…} />        /* tone-warning, mono retry */
      )}
      {s === 'happy' && (
        <CatalogBody posts={posts} />            /* the existing render */
      )}
    </window.HfShell>
  );
}
```

The skeleton, empty-hero, and error-panel components are surface-local — no shared
primitive (yet). When a pattern emerges across 4+ surfaces, lift it; until then,
duplication is cheaper than the wrong abstraction.

### Tweaks-panel override

The tweaks panel (layout view) reads from a `surfaceStateOverrides` map on
`MasterState`, keyed by `[ws][sub]`. A row of four chips in the panel for the focused
artboard cycles `state` through happy / loading / empty / error without touching the
surface itself. F2 (state-variant rollout) ships the reducer + setter; C3 ships the
read-side helper.

```jsx
// After F2 ships, the panel writes:
setSurfaceStateOverride('library', 'Catalog', 'empty');
```

### Cross-references

- **C1 · Detail-route layer** (shipped) — `activeSurface.detail = { kind, id }`. State
  variants compose with detail: a Library/Catalog post detail can itself be
  `loading` or `error` while its parent index is `happy`. Surfaces handle their own
  state independently.
- **C2 · Modal stack** (in progress) — modals will document their own state-handling
  conventions when C2 ships its DESIGN-SYSTEM.md update.
- **F2 / F3 · State-variant rollout** — F2 ships the reducer for `surfaceStateOverrides`
  + the panel UI. F3 brings the secondary surfaces in. C3 only ships the contract +
  the read-side helper so authors can start writing branches now.

### Dead-click invariant

Adjacent to the state-variant work: **every actionable element gets `onClick` by default.**
Card, row, list item, button, chip — if it visually reads as clickable, it must have a
handler. Where no destination exists yet, fire a `console.log` + a toast naming the
would-be route (`HF_ModalToast`). This is enforced by the V1 dead-click scanner. A
surface that ships with a card whose `onClick` is undefined fails the V1 gate.

State variants and the dead-click invariant earn their keep together: a `loading`
skeleton shouldn't render clickable affordances; an `empty` hero's CTA must navigate
or toast; an `error` panel's retry chip must call its handler. Every state, every
affordance, accountable.

---

## R11 · Modal stack + detail-route + dead-click invariant

The `coopr-master-prototype-completeness-v1` fleet shipped three durable contracts
that sit alongside the registry and IA contract. Read this section before adding a
new modal, a new detail surface, or a new actionable card.

### Detail-route extension

`MasterState.activeSurface` is `{ ws, sub, detail?: { kind, id } }`. URL hash:
`#interactive/<ws>/<sub>/<kind>/<id>`. Every workspace × subtab can declare an
optional `detail` field in `SURFACE_REGISTRY`:

```js
// Single-kind shape (Library/Catalog, Inbox/Comments):
detail: { kind: 'post', component: 'HF_R4_LibraryDetail' }

// Multi-kind shape (Studio/Clip Lab — step state machine):
detail: { kind: 'step', steps: { empty: 'HF_ClipLabEmpty', import: 'HF_ClipLabImport',
          auto: 'HF_ClipLabAutoClips', review: 'HF_ClipLabReview', export: 'HF_ClipLabExport' } }
```

`MasterActiveSurface` dispatches: when `detail` is set and matches the registered
kind, it mounts the detail component with a `kind`-specific prop (`postId`,
`commentId`, etc — extend `detailProps` in `hifi-master-interactive-view.jsx`).

The chrome renders a `MasterDetailBackChevron` left of the workspace pills when
`detail` is set. ESC, the chevron, and any in-surface "back" affordance call
`clearDetail()`.

### Modal stack

`MasterState.modalStack: Array<{ kind, props }>`. Actions: `pushModal(kind, props)`,
`popModal()`, `clearModals()`. The `<MasterModalLayer>` renders only the **top**
modal at zIndex 12, with a clay-tinted ink scrim. Click on scrim = `popModal`.
ESC priority: modal → detail → drawer.

Modal kinds register on `window.HF_<Kind>` and are looked up at render time. The
fleet shipped seven canonical kinds:

| Kind             | File                          | Used for |
|------------------|-------------------------------|----------|
| ModalCompose     | hifi-modal-compose.jsx        | Cmd/Ctrl+N — global compose |
| ModalSearch      | hifi-modal-search.jsx         | Cmd/Ctrl+K — global search |
| ModalSettings    | hifi-modal-settings.jsx       | Account icon — settings nav + 6 sub-pages |
| ModalSlotEdit    | hifi-calendar-r2.jsx          | Calendar slot click — edit drawer |
| ModalNewProject  | hifi-modal-new-project.jsx    | Studio "+ new project" |
| ModalNewDoc      | hifi-modal-new-doc.jsx        | Studio "+ new doc" |
| ModalConfirm     | hifi-modal-confirm.jsx        | Generic destructive-action gate |
| ModalToast       | hifi-modal-toast.jsx          | 2s pill, special-cased to bypass scrim |

`HF_ModalToast` is special-cased in `MasterModalLayer`: when `top.kind ===
'ModalToast'`, the layer renders the toast bare (no scrim, no pointer trap), so
toasts never block interaction. Use the convenience `pushToast(text)` action — it
pushes a `ModalToast` with the right shape.

### Dead-click invariant

Every actionable element in a master-mounted surface must have an `onClick`. The
V1 dead-click scanner enforces this against `<button>` (and clickable `<article>`
patterns) across all files registered in `master.html`'s script load. Where a
real destination doesn't yet exist, fire `pushToast('<destination name>')` — never
ship a clickable affordance with no feedback.

### Hash deep-link recipe

```
#                                              → layout view, no surface
#layout                                        → layout, default
#layout/insights/Overview                      → layout, scroll-into-view
#interactive                                   → interactive, default surface
#interactive/library/Catalog                   → interactive, no detail
#interactive/library/Catalog/post/0046         → interactive, with detail
#interactive/studio/Clip Lab/step/auto         → interactive, multi-kind detail
#interactive/inbox/Comments/thread/c-2417      → interactive, comment thread
```

Hash is round-trippable. The router's `readHash` and `writeHash` are bidirectional;
edits to `MasterState` update the hash, hash changes update state.

### Why this all exists together

A surface that drills in (detail) likely also opens modals (compose, confirm) and
likely has empty/error variants (R10). The three contracts compose: a Library
detail surface with `state="error"` renders the error hero inside the detail
frame; a confirm modal pushed during a detail view stacks above the detail with
ESC popping the modal first.

The fleet shipped these contracts together so authors of new surfaces have a
single mental model: register the surface in `SURFACE_REGISTRY`, declare any
`detail` kinds, accept a `state` prop, and wire every actionable element. Three
moves, one prototype.

---

## R12 · In-thread block lifecycle

The `coopr-chat-block-library-v1` fleet adds a second R4 system beside the
full-page Library surfaces: **in-thread blocks**. These are working-size cards
rendered inside chat turns, cataloged in a new `Block Catalog` workspace, and
registered independently from `SURFACE_REGISTRY`.

### Public block registry

The block foundation lives in `hifi-r4-blocks-shared.jsx` and exposes:

```jsx
window.BLOCK_REGISTRY
window.registerBlock(id, meta)
window.HF_R4B_<ID>
```

Every block ID is stable and uses the Claude Design taxonomy:

`A01` through `A14`, `B01` through `B07`, `C01` through `C09`,
`D01` through `D08`, `E01` through `E08`, `F01` through `F06`,
`G01` through `G06`, `H01` through `H06`, `I01` through `I08`,
`J01` through `J07`, `K01` through `K05`, `L01` through `L06`.

Every component is exposed as `window.HF_R4B_<ID>` and registered once:

```jsx
registerBlock('A01', {
  name: 'Retention curve',
  family: 'A',
  familyTitle: 'Measurement',
  span: 8,
  target: 'AUDIENCE',
  component: HF_R4B_A01,
});
```

### Family files

```
hifi-r4-blocks-shared.jsx        Frame / Eyebrow / Footer / icons / registry
hifi-r4-chat-demo-primitives.jsx Composer / playback controls / streaming / tool-run primitives
hifi-r4-blocks-A-B-C.jsx         A Measurement, B Comparison, C Draft
hifi-r4-blocks-D-E-F-G.jsx       D Audience, E Schedule, F Hook tests, G Voice
hifi-r4-blocks-H-I-J.jsx         H Inbox, I Intel, J Workspace
hifi-r4-blocks-K-L.jsx           K Library, L System
hifi-r4-blocks-thread-demo.jsx   in-thread composition proof
```

`master.html` loads shared first, then the chat demo primitives, then family
files, then the thread demo, before `hifi-master-registry.jsx`.

### Phase model

| Phase | Contract | v1 expectation |
|---|---|---|
| Phase 1 · interaction polish | Streaming caret, reasoning trail, tool-run morph, save feedback | Ported into chat/demo surfaces, voice waveform out of scope |
| Phase 2 · per-block lifecycle | `idle`, `hover`, `loading`, `empty`, `error` | Shared `Frame` controls expose `idle`, `loading`, `empty`, and `error` on every block; controls are quiet by default and reveal on hover/focus or family-page State lab |
| Phase 3 · in-thread composition | Multiple registered blocks inside realistic chat turns | `Thread Demo` is playable, with composer, controls, streaming, tool runs, and at least 30 distinct blocks across at least 10 turns |

### Block chrome

Normal blocks use:

- `<Frame id name purpose target span>`
- `<Eyebrow left right>`
- `<Footer openIn extra>`
- Optional shared primitives: `FooterChip`, `Icon`, `ProgressBar`,
  `DashedHRule`, `AvatarDisc`, `ChannelChip`, `DonutSegments`,
  `RetentionCurve`, `TimeAxis`, `DeltaText`.

`Frame` owns the catalog wrapper, grid span, and shared lifecycle control strip.
The lifecycle strip stays hidden at rest so catalog cards read cleanly; hover,
keyboard focus, or the family-page `State lab` toggle exposes `Idle / Load /
Empty / Error` for verification.
`Footer` owns the standard chip protocol and preserves old call compatibility:
existing calls like `<Footer openIn="Studio" extra={...} />` still work.
`FooterChip` renders as a clickable chip with transient busy/saved feedback.

### Target normalization

Claude Design's block targets are normalized to the master IA:

| Source target | Runtime destination |
|---|---|
| `PULSE` | Insights |
| `AUDIENCE` | Insights · Audience |
| `MEMORY` | Intel · Memory |
| `WORKSPACE` | Studio · Workspace |
| `SETTINGS` | Settings modal target |
| `ANYWHERE` | no Open-in chip |

Direct destinations stay direct: Studio, Library, Inbox, Calendar, Intel.

### Glyph and icon policy

Decorative glyphs are not allowed as string literals in block files. Use inline
SVG via `<Icon />` and `<FooterChip />` for intent icons. Math and typography
symbols remain Unicode when they are part of the data vocabulary.

Decorative strings to remove include: arrow-up-right, sparkle/star, check,
pencil, retry, play triangle, up/down arrows, multiply/cross, pin, warning,
horizontal arrows, box-x, solid dot, and overflow dots.

Allowed text symbols include: `·`, `—`, `–`, `−`, `…`, `Δ`, `≤`, `≥`, `≈`,
`α`, `β`, `μ`, `±`, and `§`.

### Thread composition

The thread demo is not a landing page. It must render blocks at working size
inside a chat transcript:

- At least 10 turns.
- At least 30 distinct block IDs.
- `window.R4B_CHAT_BEATS` is the scripted source of truth. `R4B_THREAD_TURNS`
  and `R4B_DEMO_EVENTS` are derived compatibility exports.
- Playback follows micro-beats: reasoning, streamed paragraph, tool-run
  skeleton, inline block result, follow-up paragraph, then action chips.
- Blocks grouped under tool/reasoning context when appropriate.
- Block reveal groups use `single`, `stack`, `compare`, or rare `grid` mode;
  no group should reveal more than 4 blocks at once.
- Role gutter and timeline rhythm are stable at 1440px.
- Adjacent tool results can stack, but the stack must not look like a generic
  dashboard grid.
- Playback controls include Play, Pause, Step, Restart, and speed.
- Composer Send starts the scripted run and the composer stays docked while
  playback runs. The standalone Claude Design `app.jsx` is not loaded into
  `master.html`; master uses `hifi-r4-chat-demo-primitives.jsx` instead.

### R4G draft/edit loop

`r4g-draft-edit-loop-v1` extends the outcome loop from retrieval/receipt into
creation realism. The shared file `hifi-r4-draft-edit-loop.jsx` loads after
`hifi-r4-outcome-loop.jsx` and before block family files. It exposes
`R4G_DRAFT_EDIT_LOOP`, `R4GDraftCanvas`, `R4GDraftVariantStack`,
`R4GDraftInlinePatch`, `R4GDraftSourceTrace`, `R4GDraftRevisionControls`,
`R4GDraftApprovalPackage`, `R4GDraftReceipt`, `R4GDraftStudioArtifact`,
`r4gDraftNavigate`, and `r4gDraftRecord` on `window`.

The loop contract is: thread ask -> own/source proof -> editable draft ->
variant choice -> inline revision -> Studio save -> approval hold -> receipt.
Approval is schedule-hold only; publishing remains manually gated. Source chips
route to `0042~thread` and `0045~feed`, while Studio Docs shows the chat-created
artifact with version, source, revision, and approval state.

### Verification

Every block-library pass must prove:

- Babel parse succeeds for every `hifi-r4-blocks-*.jsx` file.
- `registerBlock(` count across family files matches the registered family metadata.
- Every `window.HF_R4B_<ID>` exists.
- `BLOCK_REGISTRY` contains every registered family entry.
- `Block Catalog` has A-Q family subtabs plus `Thread Demo`.
- No decorative glyph string literals remain in new block JSX files.

---

## R13 · Layout view as honest mirror

The `coopr-master-prototype-layout-states-v1` fleet shipped the layout view's
contract as **"every screen, every state, every drill-in"**. Earlier the layout
was half-true: 32 surface artboards, but only the happy state and zero detail
artboards. R12 closes that.

### State-band per artboard

Every artboard in `hifi-master-layout-view.jsx` renders a small mono strip
above the surface body with 4 buttons: `happy | loading | empty | error`.
Default `happy`. Clicking switches that artboard's render via local
`useState(surfaceState)` — the surface mounts with `state={surfaceState}` and
its R10 branches do the rest. State is per-artboard, doesn't bleed into
interactive view, and doesn't write to MasterState.

### Detail-band per artboard

When `SURFACE_REGISTRY[ws].subs[i].detail` is set, a second strip renders
listing the detail kinds. Two shapes:

- **Single-kind** (`{ kind: 'post', component: 'HF_R4_LibraryDetail' }`) →
  options are `Index` + `post · 0046` (or whatever `exampleId` is).
- **Multi-kind** (`{ kind: 'step', steps: { auto: 'HF_X', review: 'HF_Y' } }`) →
  options are `Index` + one entry per step.

Click an option to swap the artboard's render to the detail surface with
`postId` / `commentId` props.

To surface multiple example ids per single-kind, populate `detail.exampleIds:
['0046', '0044', '0040']` on the registry entry — the detail-band lists each.

### Modals · Overlays section

A 7th synthetic `<DCSection>` named "Modals · Overlays" sits after Calendar in
the layout. It renders 8 frozen modal artboards (Compose, Search, Settings,
SlotEdit, NewProject, NewDoc, Confirm, Toast). Each renders inline (NOT
through `MasterModalLayer`), inside a soft scrim background, so the artboard
**is** the modal. Useful for figma-ish "show me everything" review without
clicking through.

### When extending

- **Adding a new surface state**: extend `MLV_STATES` at the top of
  `hifi-master-layout-view.jsx`. The state-band auto-renders the new option.
- **Adding a new modal kind**: append an entry to `MLV_MODALS_LIST` with
  `{ kind, label, dim, props }`. The Modals section auto-renders it.
- **Adding multi-example detail support**: set `detail.exampleIds` on the
  registry entry; teach `MasterArtboardDetailStrip` to spread them.

The layout view is the single source of truth for "what exists in this
prototype." If a surface, state, or detail kind is real, it renders here.

---

## R14 · Interaction model — drag, multi-select, context, tooltip, undo

The `coopr-master-prototype-completeness-v3` fleet shipped 6 reusable
interaction primitives that surfaces import via `window`. Every new surface
should reach for these before reinventing.

### Drag affordance (`hifi-drag-affordance.jsx`)

`window.DragHandle / DragGhost / DropMarker / DragStatusPill`. Used to model
visual drag-in-progress without real DnD physics. Mark ONE item as the
"lifted" candidate and render a faded placeholder + status pill so the
prototype reads "this is draggable". Wired on Library/Catalog cards,
Calendar/Week events, Studio/List rows.

### Multi-select (`hifi-multi-select-bar.jsx`)

`window.MultiSelectActionBar / HF_Checkbox`. Sticky bottom action bar that
appears when ≥1 item selected. Wired on Library/Compare (3-select to
compare), Inbox/Comments (bulk reply / archive / delete), Inbox/DMs (bulk
archive / snooze). The bar is `position: absolute, bottom: 24, left: 50%`
so it stays inside the artboard frame in layout view.

### Context menu (`hifi-context-menu.jsx`)

`window.HF_ContextMenu / HF_SortPopover / HF_FilterChip / HF_AddFilterChip /
HF_KebabHandle`. Popover primitive with absolute positioning, ESC + scrim
dismissal, "frozen open" mode for layout-view demos. Wired on Library/Catalog
cards (kebab → 5 options), Studio/List rows (kebab → 6 options), Library/
Catalog sort dropdown (frozen open), Studio/Shipped sort (click toggle),
Library/Catalog filter chips, Inbox/Comments filter chips.

### Tooltip + chrome keyboard hints (`hifi-tooltip.jsx`)

`window.HF_Tooltip({ label, children, side })`. 350ms hover delay,
opacity-only fade, mono-cased pill, 4 sides. The chrome bottom-right also
renders a 4-hint strip (`⌘K Search · ⌘N Compose · Esc Close · L Layout`)
with each hint wrapped in HF_Tooltip.

### Toast undo (`hifi-modal-toast.jsx` extended)

`HF_ModalToast` accepts `props.undo` + `props.onUndo`. Renders an Undo chip
that fires the callback before popping. Routed via the new
`pushToastUndo(text, onUndo)` action on `MasterStateProvider`. Used for
destructive flows like Briefing dismiss.

### Pre-existing decorative glyphs (allowed exception)

R4 platform cards in `hifi-r4-lib-visuals.jsx` use `♡ ◯ ↗ ↙ ♥ ⤴ ☆ ♪` glyphs
as IG-style metric icons (likes, comments, reach, sound). These are
load-bearing visual fixtures that render as part of the platform-card
preview, not chrome UI. They predate all completeness fleets. Anti-slop
will report them as warnings; treat them as known-allowed (same class as
R15 fixture tones / avatar gradients).

R3-archive files (`hifi-chat.jsx`, `hifi-library.jsx`, `hifi-studio.jsx`,
`hifi-chrome-variants.jsx`) also contain `✎ ✕ ✉` glyphs but are NOT in the
master registry and not mounted by `master.html`'s active surface set.
They are kept loaded for archeology only.

---

## R15 · Fixture-data raw gradients (allowed exception)

The "no raw clay rgba" rule applies to **chrome and surface UI**, not to
fixture-level visual identifiers. Two intentional exceptions exist:

1. **Per-asset thumbnail tones** (`tone: 'linear-gradient(...)'` on calendar
   slots, library posts, etc.) — each fixture asset gets a distinct hex
   gradient as a visual placeholder for "what this video looks like." These
   are creator-agnostic-friendly and read as variety. Keep them as raw hex
   in fixture data.
2. **Decorative avatar fills** (`linear-gradient(135deg, #c8b08c, #8a7252)`
   and warm-tone variants) — used for inbox / studio / settings avatar
   circles. These are not on chrome and don't drift the design language.
   Allowed.

Any new chrome surface must still use tokens. Anti-slop will report these
fixture/avatar gradients as warnings; treat them as known-allowed and don't
"fix" them.

---

## R16 · Redesign loop v1 — what landed

The `coopr-master-prototype-redesign-v1` fleet (2026-04-30) shipped 17 design
fixes against Henry's walkthrough notes. Use this section as a quick map of
what changed where, and which v3 affordances are still intact under the
redesigns.

### Chrome (B1)

- `MasterBrandLockup` replaces the bare sea-lion crop. Sea-lion + COOPR
  wordmark in Plus Jakarta Sans 13.5pt 700 weight, clay-soft hover, click
  routes to home/Today.
- `MasterDrawerPreview` keyed on `wsId` — every workspace has its own
  preview body (Home → composer + threads, Studio → project chips, Library →
  4-thumb mini-strip, Insights → sparkline + KPIs, Intel → trend rows,
  Inbox → unread chips, Calendar → slots).
- Pill row: padding 8×20 → 10×24, gap 24 → 32, label 14pt → 13.5pt, indicator
  height 32 → 36, chrome row height 48 → 56, surface body top 80 → 88.
- Keyboard hint strip moved INSIDE the chrome (right anchor), compacted to
  ⌘K · ⌘N · Esc with HF_Tooltip exposing the full table.
- Account chip is a labeled pill (avatar + serif italic "Settings" label +
  HF_Tooltip), no longer icon-only — Henry's walkthrough flagged Settings
  as not findable.

### Home / Today (C1)

- `HomeBriefingHeader` defines what "Briefing" means: eyebrow `TODAY'S
  BRIEFING · TUE APR 30`, serif italic answer, sub explaining source +
  cadence.
- `HomeDeskRow` renders 3 cards with explicit visual states (active /
  in-progress / closed) so the desk reads its lifecycle without copy.

### Studio (D1, D2, D3)

- **Clip Lab redefined**: empty becomes "Drop a clip. Get a verdict in 30
  seconds." Import is a 3-task picker (Diagnose retention / Find best
  moments / Suggest edits). Auto: "12 usable moments found." Review: "5
  edits to sharpen." Export: "3 ways the clip could land." Hard-drive-sync
  language gone. Step-machine wiring (D2 v1) preserved.
- **Studio Docs (D2 v3 redesign)**: 3-column layout — Outline rail (left
  ~200px) + Doc body (center, with v3-B1 inline interactions) + Versions
  panel (right ~240px). Bottom: Agent activity log strip. Mid-doc Jump-ToC
  inline anchors. Doc-state pill at top.
- **Studio/Calendar removed** from registry (had 6 subs, now 5: Workspace /
  Clip Lab / Docs / List / Shipped). The Calendar workspace covers
  scheduling.
- **Studio/Shipped reframed** as ship log: hero verdict + 14-row publish-
  receipt timeline + cross-platform spread + wins-above-the-line + +
  Schedule next ship CTA. Kicker now reads `SHIP LOG · 30 DAYS`.

### Library (E1, E2, E3, E4)

- **Catalog (E1)**: 5 platform thumbnail variants (`R4Thumb_Reel` 9:16 /
  `R4Thumb_Carousel` 1:1 / `R4Thumb_Feed` 4:5 / `R4Thumb_Thread` text card /
  `R4Thumb_YouTube` 16:9). Column-count masonry layout mixes aspect ratios
  on one page. 16 cards distributed across all 5 variants. B1 lifted-card
  drag affordance + B3 frozen-open kebab + filter chips + sort popover all
  preserved.
- **Series (E2)**: + Start a new series CTA + in-place edit panel (name,
  description, pillar, cadence, post-id checklist with 2 pre-checked).
  Per-row kebab → context menu (edit / add post / archive).
- **Timeline (E3)**: 2 stacked-day clusters (Apr 14 = 3 posts, Apr 19 = 2
  posts) demonstrate same-day density. Sparse months keep a thin row;
  dense months get a tall row with a vertical clay line connecting same-
  day stack.
- **Pairings (E4)**: triple sparkline diptych chart redesign. Per pairing,
  3 stacked rows (one per channel) with `R4ChannelChip` + retention
  sparkline + view-magnitude bar + saves/coopr-score. Winner derivation
  by watchPct (true 'won' signal). 3-of-3 / 2-of-3 / 1-of-3 truth bars in
  the masthead.

### Insights (F1, F2, F3)

- **Overview (F1)**: KPI gutter padding fixes the 410.5k floating-left
  issue. Hero metadata moved to top-right pill. Channel table densified.
  Pillar bars capped at 1.3× parity. Wins (3 hero cards) + Watchouts (2
  warning cards) sections added.
- **Retention (F2)**: full rework. Side-annotate widget gone. Hero verdict
  band answers "is my retention good?" as a sentence. Big curve with 3-5
  clickable annotation pins. Channel 3-up. Per-post drill grid (6-8 cards
  with mini-curves vs median). Surface dimension bumped to h=1500.
- **Formats (F3)**: registry renamed `Format DNA → Formats` (kicker `WHAT
  FORMATS WORK FOR YOU`). Surface reframes around "what formats work for
  me?" — hero verdict ("Two formats account for 71% of your wins"), top-
  format hero card, top-10 formats ranked, format×channel heatmap, hook
  structures, emerging formats.

### Intel (G1, G2)

- **Memory (G1)**: hero verdict, top-5 most-cited lessons, what-changed-
  this-week strip, lineage timeline (4 horizontal flows), 5×5 cross-
  reference matrix, search-with-suggestions.
- **Studies (G1)**: active studies as case files (kicker + serif-italic
  title + abstract + chart preview + dual CTAs), done studies dense list
  with citation sparklines, reading queue, study templates, citations
  panel.
- **DNA (G2)**: floating "The Educator" constellation hero preserved.
  Added: signal sources breakdown (stacked bar by source), fingerprint
  drift over 90 days (line chart with annotation pins), what's-emerging
  3-card section.

### Inbox + Settings (A0, A1)

- **Inbox/Comments dimension fix**: h 1200 → 1500 to handle B2 multi-
  select + B3 filter chips + 12+ comment rows.
- **Settings discoverability**: account chip is now a labeled pill with
  avatar + serif italic "Settings" + tooltip — far more discoverable
  than the icon-only v1.

### Registry dimension changes (D wave + redesign loop)

- Studio/Calendar: REMOVED
- Studio/Shipped: 900 → 1500
- Insights/Retention: 1500 (preserved from v3)
- Insights/Formats (renamed): 900 → 1800 (post-rework)
- Inbox/Comments: 1500 (preserved from v3 was 1200)

### Preserved from earlier fleets

- v1 modal kinds (Compose / Search / Settings / SlotEdit / NewProject /
  NewDoc / Confirm / Toast)
- v1 detail kinds (post / step / thread)
- v1/v2 state variants (happy / loading / empty / error) per surface
- v2 layout view state-band + detail-band + Modals · Overlays section
- v3 interaction primitives (DragHandle / MultiSelectActionBar / HF_Checkbox /
  HF_ContextMenu / HF_SortPopover / HF_FilterChip / HF_KebabHandle /
  HF_Tooltip / pushToastUndo)
- v3 surface depth content (~1700 LOC across 11 surfaces)

---

## When in doubt

- Read **HANDOFF-README.md** — it's the original claude.ai/design instructions.
- The **R3 entry point** (`app-hifi-r3.jsx`) is the reference for how DCSections / DCArtboards stack.
- The **shell** (`hifi-shell.jsx`) is the IA contract — read it before adding a workspace tab.
- The **visuals primitive** (`hifi-r4-lib-visuals.jsx`) is the fixed point for Library R4. Don't fork it; extend it.
