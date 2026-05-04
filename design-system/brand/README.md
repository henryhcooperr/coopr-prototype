# Brand · design system layer

Concise design-system docs split out from the prototype. Read these before
reading the codebase — they encode the **universal layer** that applies to
every surface (Home, Docs, Clip Lab, Library, Insights, Intel, Inbox,
Calendar).

| File | What's in it |
|---|---|
| `voice.md` | Coopr's agent voice + body copy rules + headline rhythm + empty-state copy |
| `palette.md` | Full color spec with usage rules + rejected colors |
| `typography.md` | Type stack with role-by-role specs + canonical pairings |
| `motion.md` | Easing + timing vocabulary + canonical patterns |
| `anti-slop.md` | Hard rejections — what NOT to do, with rationale |

## What's universal vs. wave-specific

The brand layer (these 5 docs) is universal — it defines COOPR across every surface.

The wave-tagged decisions in `decisions.md` (R6/R7/R8/R9) are specific to the Docs surface family. The universal brand layer carries through unchanged.

## Where the tokens live

- `hifi.css` is the single source of truth for CSS variables
- `decisions.md` is the axis-keyed locked-decisions log (latest entry per axis wins)

When making design changes, the order of authority is:

1. `brand/anti-slop.md` (hard rejections — never violate)
2. `decisions.md` (locked axes — revise by appending a new dated entry, never edit prior ones)
3. `brand/voice.md` + `palette.md` + `typography.md` + `motion.md` (universal layer — change requires explicit lock)
4. `hifi.css` (token implementation)
5. Wave-specific JSX modules (R6/R7/R8/R9 etc.)
