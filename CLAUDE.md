# Prototype directory — coopr-chat-first-v2 (WIP)

You are working inside a **standalone HTML/CSS/JSX prototype**. This is NOT the real frontend. The real frontend lives at `frontend/src/` — never edit it from here unless Henry explicitly says "promote to v3" or "ship to the real frontend."

## Read first
**`DESIGN-SYSTEM.md` (in this directory) is the spec.** It contains the file map, design tokens, IA contract, R4 component primitives, and the current to-do list. Read it before any non-trivial change.

`HANDOFF-README.md` is the original claude.ai/design handoff; useful background.

## What this prototype is
- A static design canvas. **Canonical entry: `master.html`** — single document with two views (layout + interactive) that share one URL-hash-driven state and a single `SURFACE_REGISTRY`. Press `L` or click the floating top-right toggle to swap views.
- `Hi-fi round 4.html`, `chrome-v10.html`, `tweaks.html` are kept as archeology entry points. Don't edit them as the canonical surface — edit `master.html` and its `hifi-master-*.jsx` modules.
- New surfaces go in their own `hifi-<name>.jsx` file (registered via `Object.assign(window, { HF_X })`), referenced from `master.html`'s script load list, AND added to `hifi-master-registry.jsx`'s `SURFACE_REGISTRY` for the right `(workspace, subtab)` slot.
- The **R4 library upgrade** lives in `hifi-r4-lib-*.jsx`. New library work goes here, not into `hifi-library.jsx` (which is the R3 baseline).

## Running it
A local server is typically already running on **port 8765** during a session. If not:
```
cd "/Users/henrycooper/Developer/content-brain/data/prototypes/coopr-chat-first-v2-wip"
python3 -m http.server 8765
```
Then `http://localhost:8765/master.html` (canonical) or `http://localhost:8765/master.html#layout/library/series` for a deep link. Hard-refresh (⌘⇧R) after any JSX edit to bust the Babel cache.

## Hard rules
1. **No imports/exports.** Babel-standalone runtime only. Cross-file sharing via `Object.assign(window, { X })`. Function declarations are global at top level (Babel-standalone executes scripts in non-strict global scope).
2. **No npm packages.** No icon libraries — every icon is inline SVG. No CSS frameworks — only `hifi.css` tokens.
3. **No emojis** in any UI string. (Persistent user preference.)
4. **Fonts are committed**: Plus Jakarta Sans (sans/UI/buttons), Newsreader (serif/italic editorial headlines), JetBrains Mono (eyebrows/numbers/captions). Never reach for Inter, Space Grotesk, or system-ui as a primary.
5. **Numbers always tabular.** `font-family: var(--font-mono)` or class `.hf-num`.
6. **Surfaces cap at 1440 × 900.** Scroll within the surface, don't grow the canvas.
7. **`R4_LIB_VISUALS` keys must match `posts` in `hifi-data.js`.** When you add a post, also add its visuals row.
8. **R4 visuals primitives must load FIRST.** `hifi-r4-lib-visuals.jsx` exposes R4PlatformCard / R4PillarDot / R4ChannelChip / R4Stat / R4Chip / R4ThumbBackdrop / R4Chrome* / r4FmtViews. Every other R4 file reads off `window`. The HTML script order already handles this — don't reorder.

## When extending
- **Add a new R4 surface**: `hifi-r4-lib-<name>.jsx` next to its siblings, exposed via `Object.assign(window, { HF_R4_LibraryName })`. Add a `<script type="text/babel" src="hifi-r4-lib-<name>.jsx">` to `Hi-fi round 4.html` AFTER visuals. Add a `<DCArtboard>` in `app-hifi-r4.jsx`.
- **Add a Library subtab**: edit `HF_SHELL_SUBTABS.library` in `hifi-shell.jsx` AND update both `HF_R3IATable` and `HF_ChromeAudit` in `hifi-r3-audit.jsx` so the IA contract stays consistent. (The audit's job is to prove the IA — let it.)
- **Per-post copy/data**: extend `R4_LIB_VISUALS` (in `hifi-r4-lib-visuals.jsx`) for visuals; extend `R4D_COPY` (in `hifi-r4-lib-detail.jsx`) for Detail-specific overrides. Don't fork these — both maps are keyed by post id.
- **Add a detail kind, modal, or surface state**: read **DESIGN-SYSTEM.md § R10 + R11**. R10 covers the `state` prop convention (happy/loading/empty/error). R11 covers the modal stack (`pushModal`/`popModal`/`pushToast`), the detail-route extension (`SURFACE_REGISTRY[ws].subs[i].detail`), the dead-click invariant, and the canonical hash-deep-link recipe. The `coopr-master-prototype-completeness-v1` fleet shipped these contracts together — extend them, don't reinvent.

## What NOT to do here
- Don't run `git reset --hard` against this dir; it's not a git working tree boundary.
- Don't touch `frontend/`, `dashboard_api/`, or any Python from this dir.
- Don't generate screenshots unless explicitly asked — read the HTML/CSS source instead (per the HANDOFF-README).
- Don't add backwards-compat shims — when refactoring (e.g., the postId prop on R4 Detail), just change the call sites in `app-hifi-r4.jsx` directly.

## Higher-level rules
The repo-wide `CLAUDE.md` (at `/Users/henrycooper/Developer/content-brain/CLAUDE.md`) and `MEMORY.md` still apply — niche-agnostic copy in any new shipped UI strings, no hardcoded data patterns, etc. But for this prototype directory, the rules in `DESIGN-SYSTEM.md` take priority on tokens / typography / IA / file conventions.
