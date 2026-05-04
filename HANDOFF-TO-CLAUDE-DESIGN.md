# Handoff → claude.ai/design

**You (Claude Design) are the design tool. We're handing you a brief.** Below is everything you need to design the COOPR chat-first interaction system and the full library of in-line block components that live inside the chat. There is no repo behind this — work from this brief alone. Use HTML / CSS / JS prototypes (which is what claude.ai/design produces) and lean into your strengths: typing animations, interactive states, tasteful motion.

> **Two-phase brief.** Phase 1 designs the **chat interaction system** (composer, turns, transitions, typing, tool runs, scope, sidebar). Phase 2 designs **every in-line block** — the cards/charts/lists the agent renders mid-message. Do Phase 1 first. The interaction system is the frame; the blocks live inside the frame.

---

## 1 · What COOPR is

A **creative engine for creators**. Not "AI-powered assistant." Not "AI workspace." A thinking partner that:

- Knows the creator's library, voice, audience, and schedule.
- Drafts hooks, scripts, captions, replies — in the creator's voice.
- Reads their data and explains *why* a post worked or didn't.
- Watches their niche and surfaces what's moving.
- Schedules and posts across IG / TikTok / YouTube.

The product is **chat-first**. Chat is the home page, not a side panel. Workspaces (Studio, Library, Insights, Intel, Inbox, Calendar) are reached from chat or from a top tab strip — but the default state is "open the app, talk to it."

The reference creator is **@henry.dives** (underwater filmmaker / dive-safety creator). All fixture data is dive-flavored. **But all UI strings must be niche-agnostic** — never assume diving in placeholders, empty states, or labels. Treat the creator type as a variable.

---

## 2 · Locked design language (do not deviate)

These tokens are **committed in production**. Match them exactly. Do not invent new colors, do not reach for blues / purples / pure black / pure white / system fonts.

### Palette — Single Hue Depth (cocoa-only)

The whole palette is shades of one warm-earth hue. Depth comes from value, not hue.

```
Surfaces · IVORY (warm off-white)
  --bg-base       #fbfaf6      page background
  --surface-1     #fefdf9      cards, panels
  --surface-2     #f5f3ec      pressed states
  --surface-3     #ece9df      input wells
  --surface-ink   #1a1815      dark slabs

Foreground
  --fg-primary    #1a1815      body
  --fg-secondary  #5c5a55      meta
  --fg-tertiary   #8a8782      captions
  --fg-on-accent  #fefdf9      text on cocoa
  --fg-on-ink     #fefdf9      text on dark slab

Borders (ivory-tuned)
  --border-subtle  #ebe7dc     hairlines
  --border-default #d8d3c4     cards
  --border-strong  #b3aea2     emphasis

Accent · COCOA (single hue)
  --accent-primary #5a371f     all "loud" elements
  --accent-hover   #48291a
  --accent-press   #371e13
  --accent-soft    #e8dcc8     accent washes
  --accent-ring    rgba(90,55,31,0.25)

Tones (also cocoa shades · monochromatic discipline)
  --tone-success  #5a4a26      good
  --tone-warning  #a07346      caution
  --tone-info     #806750      neutral signal
  --tone-danger   #7a3a24      bad
```

**No blue, no purple, no green outside `--tone-success`, no red outside `--tone-danger`.** Every "loud" element across the surface set still reads as warm-earth.

### Type

```
--font-sans    'Inter Tight', 'Plus Jakarta Sans' fallback
--font-serif   'Literata',    'Newsreader' fallback   (italic 600 for headlines)
--font-mono    'JetBrains Mono'                        (eyebrows, numbers, captions)
```

- **All headlines = serif italic 600, letter-spacing −0.035em.** Newsreader / Literata, never Inter, never sans for display.
- **All eyebrows / metadata = mono uppercase 0.06em tracked.** Class `.hf-byline`.
- **All numbers = tabular mono.** Watch %, view counts, scores, retention figures, velocities. Class `.hf-num` or `font-family: var(--font-mono)`.
- Body copy is sans (Inter Tight). Buttons are sans 600. Captions are mono.

### Shadow & radius

- **Shadow = none.** Cards live by border alone. Flat editorial / print-magazine feel. Zero elevation.
- Radius scale: `4 / 8 / 12 / 16 / 20`. Cards = 12. Pills = 999. Inputs = 8.

### Aesthetic in one sentence

Ivory warmth + cocoa-only palette + cocoa-only tones + zero shadow + Literata italic-600 display headlines + Inter Tight body + mono captions tracked at 0.06em + tabular numbers everywhere.

### Things that are NOT in the palette

No blue gradients · no AI-purple · no pure white `#fff` · no pure black `#000` · no sans-serif headlines · no system fonts · no neon · no glassmorphism · no SaaS rainbow.

---

## 3 · Hard rules (non-negotiable)

1. **No emojis** anywhere. Status conveyed by color tokens. Affordance conveyed by inline SVG (4–12 viewBox).
2. **No external icon libraries.** Inline SVG only. Lucide / Phosphor / FontAwesome are forbidden.
3. **No "AI" language in product copy.** COOPR is a **creative engine**, not an "AI assistant." Never use the words "AI", "AI-powered", "machine learning", "LLM", or "model" in user-facing strings. Internal mention of the model name (`Sonnet`, `Opus`) in the composer scope row is fine — that's a setting, not a description of what the product *is*.
4. **No Claude-style chat tells.** No em-dash asides, no "Let me walk you through this", no "Great question!", no "I hope this helps", no "Fundamentally", no "It's worth noting that". The agent talks like a smart creative editor in a print magazine, not a chatbot.
5. **Numbers always tabular mono.** Always.
6. **Headlines always serif italic.** Always.
7. **Niche-agnostic copy** in any reusable component. The dive flavor is in fixture data only.

---

## 4 · The chat shell (already designed — match this frame)

The chat is the home surface. Layout:

```
┌────────────┬───────────────────────────────────────────────┐
│            │ ◐ topbar — workspace tabs · scheduled count   │
│  SIDEBAR   ├───────────────────────────────────────────────┤
│  268px     │                                               │
│            │   THREAD HEADER (kicker · serif headline)    │
│  [+ New]   │                                               │
│  ⌘N        │   ─── conversation turns ──────────────────  │
│            │                                               │
│  Today     │   HENRY    │ user message                    │
│  · thread  │            │                                  │
│  · thread  │   COOPR    │ assistant message + blocks      │
│            │            │                                  │
│  Yesterday │   HENRY    │ ...                              │
│  · thread  │                                               │
│            │   ─────────────────────────────────────────  │
│            │                                               │
│  This week │   ┌────────────────────────────────────┐     │
│  · ...     │   │  COMPOSER — 720 wide · serif input │     │
│            │   │  scope chip · attach · model · ↑   │     │
│  Earlier   │   └────────────────────────────────────┘     │
│  · ...     │                                               │
│            │                                               │
│  @henry    │                                               │
└────────────┴───────────────────────────────────────────────┘
```

**Three states the chat surface must support:**

| State | When | Layout cue |
|---|---|---|
| **cold-start** | Day one, no threads | Composer centered vertically. "New thread" CTA. Three onboarding cards below ("Connect a channel", "Try a hook test", "Ask a question"). Big editorial wordmark. |
| **default / today** | Returning user, no active thread | Composer at top with placeholder "Draft anything, or ask about your work." Suggestion grid (2×2 provocations). "The week so far" editorial brief at bottom — dateline, lede paragraph, three pull-stats. |
| **active thread** | Inside a conversation | Header with kicker `THREAD · 12 MIN AGO · 4 TURNS`, italic headline, signal tags (`2 charts saved · 1 draft`). Conversation turns. Composer docked at bottom, full-width, placeholder "Reply…". |

### The composer

```
┌────────────────────────────────────────────────────┐
│                                                    │
│  Draft anything, or ask about your work.           │  ← serif italic placeholder, 15.5px
│                                                    │
├────────────────────────────────────────────────────┤
│ @ Library + Insights ▾   +     ◉  Sonnet     ↑    │  ← scope chip · attach · voice · model · send
└────────────────────────────────────────────────────┘
```

- **720px wide on home, full-width when docked.** Border `--border-default`. Radius 14. No shadow.
- **Scope chip** (`@ Library + Insights ▾`) is the primary affordance — click to pick which datasets the agent has read access to (Library, Insights, Intel, Audience, etc.). The `@` glyph is mono cocoa.
- **Send button** is a 30px cocoa circle with `↑`. Press = `--accent-press`. Disabled = `--surface-2` with `--fg-tertiary` arrow.

### Turns

```
HENRY    │ Why did 0042 keep watchers and 0041 lose them at minute three?
─────────┼──────────────────────────────────────────────────────────────
COOPR    │ The drop happens at 0:03 and again at 0:14. The first cuts
         │ −14% vs your benchmark. The second is normal mid-attention.
         │
         │ ┌─────────────────────────────────────────────────┐
         │ │ FIG · RETENTION CURVE · LAST 6 SAFETY POSTS     │   ← in-line block (chart_block)
         │ │ [retention curve svg]                           │
         │ └─────────────────────────────────────────────────┘
         │
         │ Hooks above 1.8s correlate. Your last six averaged 1.96s.
         │
         │ [+ Save chart] [↗ Open in Audience] [✎ Draft a fix]   ← inline action chips
─────────┼──────────────────────────────────────────────────────────────
HENRY    │ Draft three replacement hooks for the next safety post —
         │ under 1.2s, my voice.
```

- **Role label** (`HENRY` / `COOPR`) is mono uppercase 0.06em tracked. 72px gutter on the left. Mono color `--fg-tertiary`. Never an avatar; the words *are* the avatar.
- **Body** is sans 14px, line-height 1.55. Inline emphasis: `font-weight: 600` for nouns, `color: var(--accent-primary)` for the **one** number that matters in the sentence.
- **Inline block** sits inside the body column, full-width within it. Border-only card, no shadow, radius 12.
- **Inline action chips** (`Save chart`, `Open in X`, `Draft a fix`) are pill-shaped, border-only, sans 11.5px. The leading glyph is inline SVG, not emoji.
- Turns are separated by `1px solid --border-subtle`. No bubbles, no chat-app rounded-corner blocks.

---

## 5 · PHASE 1 — interaction system brief (do this first)

Design the choreography of a chat session. Make it feel like a thoughtful editor working alongside a creator, not a chatbot.

### 1.1 · Typing & streaming

**The single most important interaction.** When COOPR responds:

1. **Pre-roll:** the role label `COOPR` fades in over 120ms.
2. **Reasoning trail (optional, collapsed by default):** if COOPR has to "think" before answering — read the library, run a query, fetch trends — show a single-line trail. Mono 11px, `--fg-tertiary`. Examples:
   - `Reading 6 safety posts · retention curves`
   - `Querying audience · last 30 days`
   - `Looking up trends in your niche`
   - `Drafting · matching your voice`
   - Each step has a tiny rotating glyph (`◐ → ◓ → ◑ → ◒`, every 240ms) that flips to a static `✓` (mono cocoa) when the step completes.
   - The trail collapses into a single line `Reasoned · 6 sources · 1.4s` when all steps are done. User can click to expand.
3. **Body streams in word-by-word.** Not character-by-character — that's chatbot tell. **Word-by-word with a soft 18ms stagger.** Each new word fades from `opacity:0` to `1` with a 4px upward drift. The cursor (1px-wide cocoa caret) follows the last rendered word.
4. **Inline blocks materialize as a unit.** When COOPR finishes the prose paragraph and is about to render a block, the prose stops, a 240ms breath, then the block fades in *whole* (no per-row stagger inside the block — the block is atomic). Subtle scale: 0.98 → 1.0 over 200ms with a soft ease.
5. **Numbers tick up.** Any tabular figure inside the streamed body counts up from 0 to its target value over 600ms (ease-out cubic). Especially percentages and view counts. Stops on the comma — `12,4__` then `12,400`. Make this delightful.
6. **Caret behavior.** The caret blinks only when COOPR is *waiting* (network round-trip), not while streaming. While streaming, the caret rides the latest word and is solid.
7. **Cancel / "stop"** is a small mono-uppercase pill below the streaming turn: `STOP · ESC`. Pressing it cuts off mid-sentence and the body settles with `…` appended.

### 1.2 · Tool runs (when COOPR has to "go do something")

Some asks trigger long-running work — analyzing a clip, generating a media kit, scheduling a week, sweeping the web. Show this without breaking the conversation.

1. **A "tool run" appears as a single inline card** in the COOPR turn. Not a modal. Not a separate page.
2. The card has three states it animates between:
   - **Running.** Mono kicker `RUNNING · CLIP-LAB · 0:14` (counter ticks). A 1px hairline progress bar at the bottom edge of the card sweeps left-to-right. Subtle skeleton lines inside the card pulse at `--surface-2 ↔ --surface-3`, 1.4s loop.
   - **Done.** Card morphs (height-animated, 320ms) into the actual result block (e.g. a `clip_analysis` block). Kicker becomes `READY · 12.3s · 6 clips`.
   - **Errored.** Kicker becomes `RECOVERED` or `FAILED · click to retry`. Border tint goes `--tone-warning`. Body shows what was attempted and what to try next. Never a generic "Sorry, something went wrong."
3. **Multiple tools in one turn:** stack them vertically with a subtle 1px separator. The whole stack collapses into "Reasoned · 4 steps · 6.2s" when COOPR moves on.
4. **Background tools** (sweeps that take >30s — daily web sweep, big repurpose job) push to the **Activity** surface with a mono-uppercase toast: `RUNNING · WEB SWEEP · 4 OF 12 · OPEN`. They don't block the chat.

### 1.3 · Suggestion provocations (start of conversation)

When the chat is empty (between threads), show 4 two-line "provocation" cards. These are *not* feature buttons — they're things COOPR wants to talk about, written like editorial pulls.

```
┌────────────────────────────┐  ┌────────────────────────────┐
│ DRAFT                      │  │ EXPLAIN                    │
│ Three openers for the      │  │ Why did 0042 keep watchers │
│ Fiji wreck series, under   │  │ and 0041 lose them at      │
│ 1.2 seconds.               │  │ minute three?              │
└────────────────────────────┘  └────────────────────────────┘
```

- Mono kicker (`DRAFT`, `EXPLAIN`, `SCHEDULE`, `REPLY`).
- Serif sentence in italic 600.
- Hover: subtle 0.5px cocoa border tint, 80ms.
- Click: the sentence migrates into the composer with a 240ms text-morph (the words physically slide from card to composer). Then auto-send.

### 1.4 · Scope picker

Clicking the `@` chip opens an inline popover (not a modal) directly above the composer. It lists the datasets COOPR can read.

```
┌──────────────────────────────────────┐
│ READING FROM                         │
│ ┌──┐  Library          404 posts   ✓ │
│ ├──┤  Insights         30d window  ✓ │
│ ├──┤  Intel · Trends   42 watching   │
│ ├──┤  Inbox            38 unread     │
│ ├──┤  Calendar         next 7 days   │
│ └──┘  Personal memory  on            │
└──────────────────────────────────────┘
```

- Pre-checked = currently in scope.
- Click toggles. The chip label updates live (`Library + Insights` → `Library + Insights + Trends`).
- This is a critical interaction — make it feel like a camera selecting which lens it sees through.

### 1.5 · Saving / sending output to a workspace

When COOPR produces a draft / chart / clip / schedule, the user can route it elsewhere with one tap. Inline action chips at the bottom of the COOPR turn:

```
[+ Save to Library] [↗ Open in Studio] [✎ Edit] [⋯ More]
```

Animate the "save" beautifully:
- Click `+ Save to Library` → the chip morphs into a checkmark (`✓ Saved · 2:14p`), the inline block flashes a 1px cocoa border for 240ms, and a tiny ghost of the block flies up-and-right toward the topbar (where the user knows the Library tab is). Ghost is 0.5 opacity, 0.6 scale, eases out over 600ms.
- Don't show a toast. The animation IS the feedback.

### 1.6 · Sidebar / threads

- Group: `Today · Yesterday · This week · Earlier`. Group label is serif italic 12px `--fg-secondary`.
- Each thread row: title (sans 12.5px), serif-italic snippet (last assistant line, 2-line clamp), mono timestamp (right-aligned), and a `signal marker` if there's something *in* the thread (charts, drafts, replies). Signal marker = small mono glyph + count (`◐ 2 CHARTS`, `✎ 3 DRAFTS`, `↩ 1 REPLY`).
- Active thread: 2px cocoa left border, `--surface-2` background.
- Hover: text shifts to `--fg-primary`.
- New thread: mono pill `[+ New thread · ⌘N]` at top.

### 1.7 · Voice & dictation

Voice input is a real thing. The `◉` glyph in the composer left-of-send is a mic. Clicking it:
- Composer placeholder swaps to `Listening… · ESC to cancel`.
- A live waveform (1px cocoa peaks against `--surface-2` baseline) renders across the composer body.
- Words appear in real time in the composer input as they're transcribed (same word-by-word fade-in animation as COOPR streaming).
- Tap mic again or press `ESC` to stop.

### 1.8 · Transitions & motion budget

| Action | Duration | Easing |
|---|---|---|
| Hover on interactive | 80ms | ease-out |
| Toggle / switch | 120ms | ease-out |
| Block materialize | 200–240ms | ease-out cubic (0.2, 0.7, 0.2, 1) |
| Number tick-up | 600ms | ease-out cubic |
| Page / surface crossfade | 240ms | ease-out |
| Save-to-workspace ghost | 600ms | ease-out |
| Reasoning glyph spin | 240ms / step | linear |

**Never use bounces, overshoots, or springs.** Editorial restraint. Motion is information, not decoration.

### 1.9 · States that always need to exist

For every interactive thing you design, draft these states:

- **Idle** — default rest.
- **Hover** — cursor on it.
- **Active / pressed** — clicked, held.
- **Focus** — keyboard-focused (1px cocoa ring, 2px outset, no glow).
- **Loading** — skeleton or pulse.
- **Empty** — nothing to show; offer the next move (never a sad face / no illustrations).
- **Error** — what happened, what to try, never "Something went wrong."
- **Disabled** — `--surface-2` fill, `--fg-tertiary` text.

---

## 6 · PHASE 2 — in-line block library brief

Once Phase 1 is done, design every in-line block. Each block is a self-contained card the agent renders inside a COOPR turn. Each block has:

1. A **kicker** — mono uppercase 0.06em — that names what kind of block this is and adds one fact (`FIG · RETENTION CURVE · LAST 6 SAFETY POSTS`).
2. A **body** — the data, chart, or list.
3. **Optional inline action chips** at the bottom (`Save · Open · Edit · Compare`).
4. **Border-only card.** No shadow. Radius 12. Padding 14–18.

Each block also needs:
- An **empty** state (no data yet — what's the next move?).
- A **loading** state (animated skeleton).
- An **error** state (what failed, what to try).
- A **micro-interaction** that shows the user what they can *do* with it (hover, click, expand).

### 6.1 · Goal: every block must feel hand-set

The product has 80+ block types. **Boring all of them looks like a SaaS dashboard.** The brief is the opposite: each block should feel like an editor laid it out for that specific moment. Lean into:

- **Mixed grids.** A retention block isn't the same shape as a hook list. Don't normalize.
- **Editorial pulls.** Big italic numbers, mono captions, ledger lines.
- **Data viz with personality.** Not Recharts default. Hand-tuned axes, hairline grids, dotted benchmark lines, deliberate annotation.
- **Micro-typography.** Small caps on metadata. Tabular nums. Italic for the one word that carries the meaning.

### 6.2 · The full block catalog

Group these by **the job they do in conversation**. That's how you should design them — not by data shape, by narrative role.

#### A · Data-presentation blocks (COOPR shows data)
| Block type | Job in conversation | Signature data |
|---|---|---|
| `chart` | "Here's the curve / bar / line you asked about." | curve · bars · timeseries |
| `retention_curve` | "Here's how long they stayed and where they left." | watch %  curve, drop-points |
| `metric_pill` | "Three figures that matter, side-by-side." | label + value + sub × N |
| `velocity` | "How fast something is changing." | series + delta + sparkline |
| `sparkline` | Inline tiny chart (used inside other blocks). | array of N points |
| `table` | Tabular data, sortable. | columns + rows |
| `comparison` | Two or three things, side-by-side. | hooks · videos · captions · competitors |
| `clip_comparison` | "These two clips, side-by-side." | A vs B clip with chart overlay |
| `clip_compare_grid` | "These six clips, scored." | grid with retention bars |
| `outlier_report` | "These are unusual — here's why." | set with anomaly score + reason |
| `breakout_trends` | "Topics breaking out in your niche." | trend list with velocity |
| `trend_archive` | "Past trends and their decay curves." | trend cards with timeline |
| `account_changes` | "Followed accounts that shifted." | account list with delta |
| `niche_bleed` | "Adjacent niches your viewers also watch." | niche map with overlap % |

#### B · Decision-aiding blocks (COOPR helps the user choose)
| Block type | Job |
|---|---|
| `hook_card` | "Here are 3 hooks I'd write — pick one." |
| `hooks_recommend` | "Hooks ranked against your top quartile." |
| `caption` | "Drafted caption, your voice." |
| `idea_list` | "Concept candidates I generated." |
| `idea_scorecard` | "These 6 ideas, scored on novelty, fit, lift." |
| `format_suggestion` | "What format this idea wants to be." |
| `posting_time` | "Here's when to post." |
| `inspiration_match` | "These 3 references match your idea." |
| `content_match` | "This piece of yours rhymes with that one." |
| `decisions_list` | "Here are the calls I made — confirm or override." |

#### C · Deliverable blocks (COOPR hands the user a finished thing)
| Block type | Job |
|---|---|
| `script` | The script itself, with line types. |
| `script_flow` | The script as a flow diagram. |
| `script_audit` | "Here's what's wrong with this script." |
| `creative_brief` | One-page brief for a project. |
| `shot_list` | Numbered shots with framing notes. |
| `overlay_sequence` | On-screen text overlay timing. |
| `overlay_strategy` | Why these overlays, in this order. |
| `carousel_organizer` | Slide order for a carousel post. |
| `image_grid` | Generated / referenced image set. |
| `media_kit` | Brand-deck snapshot. |
| `portfolio` | Sampler of best work. |
| `library_grid` | A subset of the creator's posts. |
| `library_ref` | Link back to a single library post. |
| `repurpose_approval` | "Approve this repurposed version?" |
| `edit_plan` | Steps to recut / edit a clip. |
| `clip_analysis` | "What's good and bad in this clip." |
| `clip_headline` | The hook line for a clip. |

#### D · Strategy / explanation blocks (COOPR explains its thinking)
| Block type | Job |
|---|---|
| `creativity_analysis` | "Why this format / pillar is working." |
| `voice_report` | "Your voice, characterized." |
| `validator_report` | "Your script measured against your voice." |
| `retention_psychology` | "Why people leave at 0:03." |
| `story_strategy` | "Narrative arc for this piece." |
| `knowledge_insight` | A single insight pulled from the knowledge base. |
| `research_report` | Long-form findings from a research run. |
| `study_plan` | "Here's how I'll test this." |
| `study_outcome` | "Test ran. Here's what we learned." |
| `recap` | "Last week, in your library." |
| `daily_brief` | "What's worth knowing this morning." |
| `session_digest` | "What we covered in this thread." |
| `strategic_change_radar` | "Things shifting in your strategy space." |
| `semantic_cluster` | "These ideas group around this theme." |
| `photo_report` | Photo-set analysis. |
| `hashtag_report` | Hashtag performance + recommendations. |

#### E · System / self-aware blocks (COOPR reports on itself)
| Block type | Job |
|---|---|
| `action` | A row of buttons with confirmation. |
| `expandable` | "I have more — click to expand." |
| `onboarding` | Step-by-step setup card. |
| `autopilot` | "Here's what I'll do unattended." |
| `autopilot_stats` | "What I did this week, unattended." |
| `program_status` | "This long-running program is at step 4 / 8." |
| `program_rotation` | "What I'm rotating through." |
| `campaigns` | Active campaign cards. |
| `memory_write` | "I just learned this about you. Confirm to save." |
| `decisions_list` | "Here are the calls I made." |
| `web_search` | "Found these on the web." |
| `web_sweep` | "Daily web sweep results." |
| `search_results` | Internal search results. |
| `creator_grid` | A grid of creators (Radar / Inspiration). |
| `music_timeline` | Music beat-map for a clip. |
| `file_analysis` | "I read your file. Here's what's in it." |
| `calendar` | Schedule view in-line. |
| `job_progress` | Long-running job card (see § 5.2 above). |
| `error_card` | Something failed. What to do. |
| `block_skeleton` | The loading state. Designed once, used everywhere. |

### 6.3 · Block-level invariants

For every block:

1. **Kicker is mono uppercase, 9–10px, 0.06em tracked, color `--fg-tertiary`.** Always present. Never sentence-case.
2. **Numbers are mono and tabular.** Always.
3. **Headlines inside blocks are serif italic 600.** Always.
4. **No emojis.** Status conveyed by tone tokens (`--tone-success` / `--tone-warning` / `--tone-info` / `--tone-danger`) or by tiny 4px cocoa dots.
5. **Border-only.** No shadow. Radius 12.
6. **Compact at default, expandable on click** if the block has more to show.
7. **Inline action chips at bottom**, separated by 1px hairline. Each chip has a leading inline-SVG glyph.
8. **Empty state offers the next move.** Never "No data."
9. **Loading state is a 1.4s pulse on `--surface-2 ↔ --surface-3`** with the kicker already present.
10. **Error state shows what was attempted, the constraint that was violated, and the next move.** Never "Something went wrong."

---

## 7 · Voice (how COOPR talks)

Read this twice. The voice is the product.

- **Like a sharp creative editor in a print magazine.** Not a chatbot. Not a CSM.
- **Direct.** "The drop happens at 0:03." Not "It looks like there might be a drop around 0:03."
- **Specific.** Numbers earn their place. `−14% vs your benchmark` beats "significantly worse."
- **Italics carry meaning.** *The hook stays; the middle gets quieter.* Italic where the editor would emphasize in print.
- **One number per sentence.** The one that matters.
- **No hedging.** "It's worth noting" / "I think" / "perhaps" / "fundamentally" → cut.
- **No closer boilerplate.** "Let me know if you'd like to dig deeper" → cut.
- **No opener boilerplate.** "Great question!" / "Sure thing!" / "Of course!" → cut.
- **No em-dash asides.** Use periods. Use a colon. Use a line break.
- **Cite by post id, not platform.** `0042` and `0039` are how the creator refers to their own work.
- **Talk about the work, not about the tool.** "I built three openers for you" → "Three openers, under 1.2s each."

### Voice examples (copy directly)

> The drop happens at 0:03 and again at 0:14. The first cuts −14% vs your benchmark. The second is normal mid-attention.

> Hooks above 1.8s correlate with the drop. Your last six averaged 1.96s. The two that held attention (0042, 0039) opened in under 1.2s.

> Comments are up 69% on the safety series — most of them asking the same two questions you haven't answered. Three drafts are ready to ship; one of them tests a hook you haven't run before.

> Marina replied to your DM and is waiting.

That's the register. Editorial. Specific. Restrained. No "AI" tells.

---

## 8 · Anti-patterns (do not generate any of these)

- **Avatar circles for the user / agent.** No initials, no faces. Role labels are the avatar.
- **Speech bubbles.** Turns are left-gutter mono labels, not iMessage-style rounded blobs.
- **Emoji status indicators.** Use a 4px cocoa dot or a mono glyph.
- **Toast pile-ups.** Use the save-to-workspace ghost animation instead.
- **"Powered by AI" / sparkle glyphs / wand icons.** Forbidden.
- **Default Recharts.** Build charts hand-tuned, with hairline grids and one annotated point.
- **Skeleton blocks that don't match the destination shape.** The skeleton must telegraph what's coming.
- **Modals for what should be inline.** Tool runs, scope, action confirms — all inline.
- **Generic "Send" arrow as a paper airplane.** Use `↑` (up arrow) on a cocoa circle.
- **System fonts.** Inter Tight, Literata / Newsreader, JetBrains Mono only.
- **Pure black or pure white anywhere.** Use `--fg-primary` and `--bg-base`.
- **Multiple shades of green / red.** One success, one warning, one danger. All cocoa-shaded.
- **Gradients of any kind.** Flat fills only.

---

## 9 · Acceptance criteria — what "done" looks like

### Phase 1 (interaction system)

- [ ] Composer has all states: empty, focused, typing, sending, disabled.
- [ ] COOPR streaming response: word-by-word fade with cursor following last word. Number tick-up working.
- [ ] Reasoning trail: collapsed-summary state + expanded-steps state.
- [ ] Tool run card: running / done / errored states with clean morph.
- [ ] Suggestion provocations: hover state + click-to-composer text-morph.
- [ ] Scope popover: open / item-toggle / close. Composer chip updates live.
- [ ] Save-to-workspace ghost animation.
- [ ] Voice / dictation: mic toggle + waveform + live transcript.
- [ ] Sidebar with Today / Yesterday / This week / Earlier groupings, signal markers per thread.
- [ ] Three chat-page states: cold-start, default, active thread.
- [ ] All transitions respect motion budget.
- [ ] Zero emojis. Zero AI-tell language. All numbers tabular mono. All headlines serif italic.

### Phase 2 (block library)

- [ ] Every block in § 6.2 has a designed instance with sample data.
- [ ] Every block has idle / hover / loading / empty / error states.
- [ ] Every block has at least 2 inline action chips.
- [ ] Every block has its kicker, follows the type rules, follows the no-shadow / border-only / radius-12 rule.
- [ ] At least 8 blocks have a *unique* visual treatment that wouldn't fit a different block (i.e. retention curve doesn't look like hook-card doesn't look like calendar). Not template-hellscape.
- [ ] Block library reads like an editor designed it, not a SaaS dashboard.

### Phase 3 (interactive prototype)

- [ ] One click-through prototype showing a representative session: cold-start → suggestion-click → COOPR response with reasoning trail → chart block streams in → user clicks "Open in Audience" → save-ghost animation → sidebar updates.
- [ ] Second prototype showing a tool-run sequence: ask → reasoning trail → multi-step tool run with 3 tools → final block ready.
- [ ] Third prototype showing a long-form deliverable: ask for a script → COOPR streams the script block, line-by-line type-in, with overlay timings.

---

## 10 · One last thing

The product's bet is that **a creator should be able to talk to their work**. That means the chat is not a chatbot — it's a conversational surface over a set of structured outputs (drafts, charts, schedules, replies). The interaction system has to make those outputs feel *materialized through conversation*, not retrieved from a database. The streaming, the reasoning trail, the morph from tool-run to result, the save-ghost — these are the moments that sell that bet.

If you nail Phase 1's choreography, every block in Phase 2 inherits it. Start with the frame, then fill it.

---

## Appendix A · Source files (for archeology)

If anything in this brief is ambiguous, the locked design language and chat shell live in these files of the source prototype (not in scope for you to read — but a coding agent on the other end *will* match your output to them):

- `hifi.css` — token variables.
- `hifi-chat.jsx` — the chat shell with `HF_ChatDefault` / `HF_ChatEmpty` / `HF_ChatActive` and the `Turn` component.
- `hifi-home.jsx` — the home / today briefing surface.
- `DESIGN-SYSTEM.md` — the locked spec (R8 v3).

You don't need them. This brief is self-contained.
