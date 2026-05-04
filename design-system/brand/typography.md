# Typography

## Stack

| Role | Family | Token | Source |
|---|---|---|---|
| Editorial headlines | **Literata** | `var(--font-serif)` | Google Fonts |
| Long-form body serif (alternate) | **Newsreader** | (alt serif) | Google Fonts |
| UI sans (primary) | **Inter Tight** | `var(--font-sans)` | Google Fonts |
| UI sans (fallback) | **Plus Jakarta Sans** | (within --font-sans stack) | Google Fonts |
| Captions, eyebrows, numbers, code | **JetBrains Mono** | `var(--font-mono)` | Google Fonts |

Loaded via Google Fonts CDN in `master.html`.

## Editorial headlines (Literata italic)

```
font-family: var(--font-serif);
font-style: italic;
font-weight: 600;
font-size: 36-48px (density-driven);
line-height: 1.06;
letter-spacing: -0.02em;
color: var(--fg-primary);
```

The lyrical second line ("italic tail") uses the same family but `var(--fg-tertiary)`:

```
The drafting set. <span class="tail">A few projects in motion, a couple still finding their hook.</span>
```

## Eyebrows (mono caps)

```
font-family: var(--font-mono);
font-size: 9.5-10.5px;
font-weight: 600;
letter-spacing: 0.10-0.12em;
text-transform: uppercase;
color: var(--fg-tertiary);
```

Examples: `INSIGHTS · OVERVIEW · LAST 30 DAYS` · `TRUK LAGOON · EP. 1 HOOK` · `DOCS · 7 PROJECTS`

## Datelines / right-meta (mono regular)

```
font-family: var(--font-mono);
font-size: 11px;
color: var(--fg-secondary | --fg-tertiary);
```

Examples: `SINCE MON 09:00 · +1.4K FOLLOWERS` · `4D AGO` · `1,842 / 2,400`

## UI sans body

```
font-family: var(--font-sans);
font-size: 13-14.5px;
line-height: 1.5-1.55;
color: var(--fg-secondary);
max-width: 60ch (for editorial body paragraphs);
```

## Tabular numerals

Always use `var(--font-mono)` or class `.hf-num` for any digit display. Never lining figures in serif.

**Yes:** `1,842 / 2,400` (mono) · `+340% saves` (mono) · `00:18` (mono)
**No:** `1,842 / 2,400` (Literata) · spelled-out numbers in UI

## Type pairings (canonical)

### Editorial dispatch (Insights, Docs Home post-R9)
- Mono caps eyebrow
- Mono regular dateline
- Literata italic 40px headline
- Literata italic tail in `--fg-tertiary`
- Inter Tight 14.5px body, max-width 60ch

### Doc heading (R8 single vessel)
- Mono caps eyebrow
- Literata italic 36px title
- Literata italic 18-20px tail (smaller)
- Mono dateline strip with version pills

### Card thumbnails
- Mono caps eyebrow at top
- Literata italic 18-22px title
- Mono caps status pill at bottom

## Forbidden combinations

- Sans-serif headlines (use Literata italic)
- Mixed weights in body copy (one weight per role)
- Letter-spacing on body sans (only on mono caps + headline italic)
- Decorative scripts, monospace as primary body, all-caps body text
