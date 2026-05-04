# Palette

Source of truth: `hifi.css` `:root` block.

## Surfaces (warm-paper ladder, no white-on-white)

| Token | Hex | Usage |
|---|---|---|
| `--bg-base` | `#fbfaf6` | Page background (warmest) |
| `--surface-1` | `#fefdf9` | Cards, vessels, panels |
| `--surface-2` | `#f4f0e5` | Hover, secondary surfaces, embeds |
| `--surface-ink` | `#1a1815` | Inverse surface (toasts, brand mark) |

## Foreground (cocoa single-hue, no dark gray)

| Token | Hex | Usage |
|---|---|---|
| `--fg-primary` | `#1a1815` | Headlines, primary text |
| `--fg-secondary` | `#4a4640` | Body text |
| `--fg-tertiary` | `#8a8478` | Captions, dimmed labels, italic continuations |
| `--fg-on-ink` | `#fdfcf9` | Text on dark surfaces |
| `--fg-on-accent` | `#fefdf9` | Text on accent fills |

## Borders

| Token | Hex | Usage |
|---|---|---|
| `--border-subtle` | `#ebe7dc` | Card edges, subtle dividers |
| `--border-default` | `#d4cdb8` | Hover edges, input borders |

## Accent · moss

| Token | Hex | Usage |
|---|---|---|
| `--accent-primary` | `#5a6a3a` | Primary CTA, active pills, key affordances |
| `--accent-primary-press` | (~10% darker) | Pressed/hover state |
| `--accent-soft` | `rgba(90, 106, 58, 0.10)` | Active pill background, accent tint |

**Why moss:** earth-tone harmonizes with warm-paper surface. Clay tested too saturated next to JetBrains Mono blocks. Locked 2026-04-28.

## State accents (sparingly)

| Purpose | Token | Hex | Usage |
|---|---|---|---|
| Warning | `--accent-warning` | `#c98a3e` | Approaching deadline, soft warnings |
| Error | `--accent-error` | `#b34a3a` | Over-limit char counts, destructive confirms |

## Rejected colors (never use)

- **Purple** — every shade. AI-tool default; rejects the editorial palette.
- **True white** (`#ffffff`) — too cold against warm paper
- **Pure black** (`#000000`) — too harsh; use `--fg-primary` (`#1a1815`)
- **Vibrant gradients** (any direction) — flat surfaces only
- **Neon accents** — moss is the only saturated hue; everything else is tonal

## Hover treatment

Card / row hover: border-subtle → border-default + bg surface-1 → surface-2. **No** lifts. **No** deep shadows. Subtle is the point.
