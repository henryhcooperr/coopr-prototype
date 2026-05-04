# Motion

## Easing vocabulary

| Curve | When |
|---|---|
| `cubic-bezier(0.2, 0.7, 0.2, 1)` | **Entry** (default) — content arriving, panels opening |
| `cubic-bezier(0.4, 0, 0.2, 1)` | **Exit** — content leaving, panels closing |
| `cubic-bezier(0.16, 1, 0.3, 1)` | **Pill toggle / spring-like** — segment switches, view toggles only |
| `linear` | Quick prep frames (~80ms) before a longer ease |

**Never:** `ease-out` / `ease-in` defaults (flat browser curves) · bounce · overshoot · spring-physics with rebound.

## Duration

| Range | Use |
|---|---|
| 80ms | Prep frames, hover state changes |
| 120ms | Fast cross-fades, toolbar tool hover |
| 180–220ms | Drawer reveals, popover slide-in |
| 250ms | **Default** — most state transitions |
| 280–360ms | Larger reconfigurations (chrome reframe, drawer full-open) |
| 700–900ms | Scoring animations (mock async work) |

**Cap at 360ms.** Anything longer feels demo-y.

## Patterns (canonical)

### Doc-mode chrome reconfiguration (R8)
- Master chrome: `opacity 1 → 0` + `translateY 0 → -12px` over **250ms** ease-out
- Doc-mode toolbar: slide down from `y=-40 → 0`, opacity `0 → 1`, **250ms** ease-out
- Canvas: `translateY 12 → 0`, opacity `0 → 1`, **250ms** ease-out (keyframed)

### Heading zone scroll-reveal
Heading + body scroll as one unified column. Heading scrolls out of view naturally — no fixed positioning, no compact-on-scroll switch (R9 lessons learned).

### Drawer (media drawer R6/S7)
Three states: closed (24px) → peek (48px) → open (360px). Height transition **280ms** cubic-bezier(0.2, 0.7, 0.2, 1).

### Hover transitions
- Background / border tint: **120ms** ease-out
- Color: **120ms**
- Transform (lift): **NEVER**

### Modal (image studio S6)
- Scrim: `opacity 0 → 1`, **200ms** ease-out
- Modal: `scale 0.96 → 1` + `opacity 0 → 1`, **220ms** ease-out

### Slash hover-preview (R6/S4)
- Trigger delay: **400ms** hover-hold before preview slides in
- Preview slide-in: **180ms** cubic-bezier(0.2, 0.7, 0.2, 1)

## Anti-patterns

- Bounce on segment toggles (use cubic-bezier(0.16, 1, 0.3, 1) — it's spring-like without rebound)
- Card hover lifts (`translateY -2px` + shadow grow) — use border + bg shift instead
- Overshoot on numerical scores
- Transform-origin shifts during animation
- Animation on initial mount unless explicit (no enter-from-bottom on first paint)
- Anything over 400ms unless mock-async (scoring, fake-fetch)

## Reduced-motion respect

The prototype doesn't currently honor `prefers-reduced-motion: reduce`. **Production must.** Reduce all transitions to `1ms` when set. (Decision pending lock — flag for design review.)
