# Anti-slop watchlist

Hard rejections across every COOPR surface. These are not preferences — they are decisions locked into the design system.

## Color rejections

- **No purple.** Every shade. Most AI tools default purple; rejecting it is part of how COOPR signals "not generic AI tool."
- **No vibrant gradients.** Surfaces are flat editorial.
- **No true white** (`#ffffff`). Use `--surface-1` (`#fefdf9`).
- **No pure black** (`#000000`). Use `--fg-primary` (`#1a1815`).
- **No neon accents.** Moss is the only saturated hue.

## Typography rejections

- **No sans-serif headlines** for editorial dispatches. Always Literata italic.
- **No emojis in UI strings.** Anywhere. Action chips, headlines, labels, toasts — none.
- **No mixed weights in body copy.** One weight per role.
- **No lining figures in serif.** All numbers tabular mono.
- **No letter-spacing on body sans.**
- **No decorative scripts** (Comic Sans, Pacifico, etc.).
- **No all-caps body text.**

## Iconography rejections

- **No "Magic" / sparkle / star / wand** branding. AI is COOPR — not "Magic Studio."
- **No crown icons.** No premium-looking gold/star/lock for tier-locked features. Subtle text-only mono caps "Pro" pill is fine.
- **No emoji icons** as wayfinding (use inline SVG instead).
- **No animated mascots** or marketing illustrations.
- **No skeuomorphic icons** (drop shadows, 3D effects, gloss).

## Interaction rejections

- **No card hover lifts** with deep shadows. Use border + 2% bg shift.
- **No bounce / spring-with-rebound** on transitions.
- **No "Welcome!" tooltips** that follow the user around.
- **No countdown auto-confirmations** ("Continuing in 3...2...").
- **No "deemed acceptance"** mechanisms.
- **No modal-on-mount** for marketing announcements.

## Copy rejections

- **No exclamation points** unless quoting data.
- **No "Hi there 👋"** style chatbot openers.
- **No "I'd love to help"** / "Hope this helps!" / "Let's get started!" filler.
- **No "you've got this"** encouragement phrases.
- **No marketing-y feature names** ("Smart Insights", "Pro Builder", "Instant Magic"). Coopr's verbs are functional ("Tighten this," "Score variants," "Pull a quote").

## Sticker / decoration rejections

- **No stickers** in image studio. Annotate, text, score, crop only.
- **No watermarks** on the editorial canvas.
- **No background patterns / textures** on surface-1 (clean paper only).
- **No color-shift shadows** (always neutral cocoa drop shadow at low alpha).

## Why these are locked

The user's directive ("editorial, not dashboard; not a generic AI tool") drives every entry. Each rejection traces to a specific anti-pattern observed in the user's reference space (Canva, Notion AI, ChatGPT canvas, Adobe Express, etc.) and explicitly rejected in design review.

When proposing changes, score against this list FIRST. A change that introduces any item here is a hard no, regardless of how good the rest of the change is.
