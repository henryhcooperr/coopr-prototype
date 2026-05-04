# CODING AGENTS: READ THIS FIRST

This is a **handoff bundle** from Claude Design (claude.ai/design).

A user mocked up designs in HTML/CSS/JS using an AI design tool, then exported this bundle so a coding agent can implement the designs for real.

## What you should do — IMPORTANT

**Open `master.html` in a browser.** It's the canonical entry — a single document with two views (layout + interactive) over the full surface inventory. Press `L` to swap modes. URL-hash deep-links work in both modes (e.g. `#interactive/insights/overview`).

To understand surface contents directly from source: read `hifi-master-registry.jsx` (the `(workspace, subtab) → component` map), then `hifi-master.jsx` (top-level orchestrator), then any specific `HF_*` you care about.

`Hi-fi round 4.html` and `chrome-v10.html` are preserved entry points for archeology. Don't treat them as canonical.

**If anything is ambiguous, ask the user to confirm before you start implementing.** It's much cheaper to clarify scope up front than to build the wrong thing.

## About the design files

The design medium is **HTML/CSS/JS** — these are prototypes, not production code. Your job is to **recreate them pixel-perfectly** in whatever technology makes sense for the target codebase (React, Vue, native, whatever fits). Match the visual output; don't copy the prototype's internal structure unless it happens to fit.

**Don't render these files in a browser or take screenshots unless the user asks you to.** Everything you need — dimensions, colors, layout rules — is spelled out in the source. Read the HTML and CSS directly; a screenshot won't tell you anything they don't.

## Bundle contents

- `coopr-chat-first-v2/README.md` — this file
- `coopr-chat-first-v2/project/` — the `Coopr-chat first v2` project files (HTML prototypes, assets, components)
