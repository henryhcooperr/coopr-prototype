/* global React, ReactDOM, window, document, requestAnimationFrame */
/* hifi-docs-r10-meta-strip.jsx — Docs R10 (Wave 5 / V1).

   ── What changes from R8 ──────────────────────────────────────────
   1. STRIP COLLAPSES TO A QUIET DATELINE — the loud row of (active
      version pill + parent + branches + add + Target/Channel/Words)
      compresses to a single mono dateline:
        v3 · drafting · ⌥ · TRUK LAGOON  ·  TUE · 1,842 / 2,400
      Numbers stay tabular mono. Pills retire from default view.
   2. VERSION PILLS HIDE-BY-DEFAULT — the version pill row only shows
      on hover of the heading block, or when the heading has focus
      (caret inside title or eyebrow), or after a 200ms hover dwell on
      the dateline itself. Default state is silent.
   3. NO TOP HAIRLINE OVER THE STRIP — R8 separated the meta strip from
      the title with a `border-top: 1px var(--border-subtle)`. With the
      vessel unbordered (R10 vessel) the extra rule reads as a card
      seam. We drop it; vertical rhythm holds the relationship.
   4. SEPARATORS BECOME MIDDLE DOTS — the 1×11px `.sep` divider lines
      were architectural; in a quiet dateline a `·` reads more like a
      published byline ("MAY 2026 · TRUK · 1,842 WORDS").

   This file is CSS-only. No JSX overrides. Reveal is pure :hover —
   no MutationObserver, no JS state.
   Loads AFTER hifi-docs-r10-vessel.jsx.
*/

(function () {
  'use strict';
  if (window.__DOCS_R10_META_STRIP_BOOTED__) return;
  window.__DOCS_R10_META_STRIP_BOOTED__ = true;

  const CSS = `
    /* ─── 1. Strip retires top hairline + tightens density ─────── */
    .docs-r8-meta-strip {
      margin-top: 12px !important;
      padding-top: 0 !important;
      border-top: 0 !important;
      gap: 0 10px !important;
      font-family: var(--font-mono) !important;
      font-size: 10.5px !important;
      letter-spacing: 0.04em !important;
      color: var(--fg-tertiary) !important;
      align-items: baseline !important;
      transition: opacity 180ms var(--ease-entry, cubic-bezier(0.2,0.7,0.2,1));
    }

    /* ─── 2. Hide pill row by default · reveal on hover/focus ──── */
    /* The pills (current version + parent + branches + add) collectively
       carry the version dimension. They retire to opacity:0 + 0-width
       so the dateline collapses cleanly; on hover we ease them back. */
    .docs-r8-meta-strip .docs-r8-pill {
      opacity: 0 !important;
      transform: translateX(-4px);
      max-width: 0 !important;
      padding: 0 !important;
      margin: 0 !important;
      border: 0 !important;
      overflow: hidden !important;
      white-space: nowrap;
      pointer-events: none;
      transition:
        opacity 180ms var(--ease-entry, cubic-bezier(0.2,0.7,0.2,1)),
        transform 180ms var(--ease-entry, cubic-bezier(0.2,0.7,0.2,1)),
        max-width 220ms var(--ease-entry, cubic-bezier(0.2,0.7,0.2,1)),
        padding 180ms var(--ease-entry, cubic-bezier(0.2,0.7,0.2,1)),
        border-color 180ms var(--ease-entry, cubic-bezier(0.2,0.7,0.2,1));
    }
    /* On heading hover OR focus-within, pills bloom back. */
    .docs-r8-heading:hover .docs-r8-meta-strip .docs-r8-pill,
    .docs-r8-heading:focus-within .docs-r8-meta-strip .docs-r8-pill,
    .docs-r8-meta-strip:hover .docs-r8-pill {
      opacity: 1 !important;
      transform: translateX(0);
      max-width: 200px !important;
      padding: 0 10px !important;
      border: 1px solid var(--border-subtle) !important;
      pointer-events: auto;
    }
    /* Keep the active version pill visible always — it's the byline
       version stamp ("v3 · drafting"). Restore its shape unconditionally. */
    .docs-r8-meta-strip .docs-r8-pill.is-active {
      opacity: 1 !important;
      transform: translateX(0) !important;
      max-width: 240px !important;
      padding: 0 10px !important;
      border: 1px solid var(--border-subtle) !important;
      background: transparent !important;
      color: var(--fg-secondary) !important;
      pointer-events: auto !important;
      /* Subtler than R8's accent-soft fill — it's data, not a CTA. */
      font-family: var(--font-mono) !important;
      font-size: 10px !important;
      font-weight: 600 !important;
      letter-spacing: 0.06em !important;
      height: 22px !important;
      display: inline-flex !important;
      align-items: center !important;
      border-radius: 999px !important;
    }
    /* Active pill stays neutral on hover; it's not a button at rest. */
    .docs-r8-meta-strip .docs-r8-pill.is-active:hover {
      background: var(--surface-2) !important;
      color: var(--fg-primary) !important;
    }

    /* ─── 3. Separators become middle-dots ──────────────────────── */
    .docs-r8-meta-strip .sep {
      width: auto !important;
      height: auto !important;
      background: transparent !important;
      display: inline !important;
      color: var(--fg-tertiary) !important;
      opacity: 0.7;
    }
    .docs-r8-meta-strip .sep::before {
      content: '·';
      margin: 0 4px;
    }

    /* ─── 4. Quiet the keys; let values carry the line ──────────── */
    .docs-r8-meta-strip .k {
      text-transform: uppercase !important;
      font-weight: 600 !important;
      letter-spacing: 0.10em !important;
      color: var(--fg-tertiary) !important;
      opacity: 0.85;
      font-size: 9.5px !important;
    }
    .docs-r8-meta-strip .v {
      color: var(--fg-secondary) !important;
      font-variant-numeric: tabular-nums !important;
      font-feature-settings: "tnum" !important;
    }
    /* Drop the serif-italic treatment R8 used on the Target value —
       in a quiet dateline it reads as a foreign body. Mono-only. */
    .docs-r8-meta-strip .v.serif {
      font-family: var(--font-mono) !important;
      font-style: normal !important;
      font-size: 10.5px !important;
      color: var(--fg-secondary) !important;
    }

    /* ─── 5. Hover affordance hint · a 1px micro-rule appears under
       the dateline on hover, telling the user there's more. */
    .docs-r8-meta-strip {
      position: relative;
    }
    .docs-r8-meta-strip::after {
      content: '';
      position: absolute;
      left: 0; bottom: -6px;
      width: 18px; height: 1px;
      background: var(--border-default);
      opacity: 0;
      transition: opacity 180ms var(--ease-entry, cubic-bezier(0.2,0.7,0.2,1));
    }
    .docs-r8-heading:hover .docs-r8-meta-strip::after,
    .docs-r8-heading:focus-within .docs-r8-meta-strip::after {
      opacity: 1;
    }
  `;

  function injectCSS() {
    if (document.getElementById('docs-r10-meta-strip-style')) return;
    const styleEl = document.createElement('style');
    styleEl.id = 'docs-r10-meta-strip-style';
    styleEl.textContent = CSS;
    document.head.appendChild(styleEl);
  }

  function boot() {
    if (!document.head) { requestAnimationFrame(boot); return; }
    injectCSS();
  }
  boot();

  Object.assign(window, {
    HF_DocsR10MetaStrip: {
      isApplied: () => !!document.getElementById('docs-r10-meta-strip-style'),
      defaultMode: 'quiet',
      revealMode: 'hover-or-focus',
    },
  });
})();
