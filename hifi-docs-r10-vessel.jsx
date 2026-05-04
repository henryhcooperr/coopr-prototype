/* global React, ReactDOM, window, document, requestAnimationFrame */
/* hifi-docs-r10-vessel.jsx — Docs R10 (Wave 5 / V1).

   ── What changes from R8 ──────────────────────────────────────────
   1. CARD CHROME RETIRES — the editable's 1px border, 4px radius, and
      surface-1 background go away. The doc body sits on the page bg
      directly; whitespace contains it, not a card outline.
   2. ACCENT KICKER REPOSITIONS — R8 floated a 3px moss/cocoa kicker at
      the top-left of the bordered vessel as "the only chrome flourish."
      With no border to sit on, we turn it into a 28px hairline
      indicator that lives ABOVE the eyebrow inside the heading block —
      a single editorial rule, no card lid.
   3. WIDTH HOLDS, MARGINS GROW — measure stays at 760px (the locked
      editor-measure decision; 920 in comfortable per R6). The outer
      vertical margin grows from 28px to 56px so whitespace does the
      containment work.
   4. HEADING-TO-PROSE RULE INTERNAL — R8's `.docs-r8-rule` (the hairline
      between heading and prose) was a 1px line set at 36px gutter.
      We keep it but soften: 0.5px height, --border-subtle stays, and
      it's now flush to the heading padding so it reads as a paragraph
      separator, not a card seam.

   This file is CSS-only. No DOM mutations, no observers.
   Loads AFTER hifi-docs-r8-canvas.jsx and r10-header-rhythm.

   Per anti-slop.md: no card hover lifts, no shadows, no purple, no
   true white. Whitespace is the only containment primitive.
*/

(function () {
  'use strict';
  if (window.__DOCS_R10_VESSEL_BOOTED__) return;
  window.__DOCS_R10_VESSEL_BOOTED__ = true;

  const CSS = `
    /* ─── 1. Strip card chrome from the editable vessel ──────────── */
    [data-shell-view="doc"] [contenteditable="true"] {
      /* Override every R8 card property on the editable. */
      border: 0 !important;
      border-radius: 0 !important;
      background: transparent !important;
      box-shadow: none !important;
      /* Margins grow — whitespace replaces the card. The Medium /
         Substack pattern: bordered by air, not by line. */
      margin: 56px auto 80px !important;
      max-width: 760px !important;
      min-height: calc(100vh - 240px) !important;
    }

    /* ─── 2. Retire R8's vessel kicker on the editable ──────────── */
    /* R8 painted a ::before kicker (3px moss/cocoa rule) at the top-left
       of the bordered card. With no border, it would float in space. */
    [data-shell-view="doc"] [contenteditable="true"]::before {
      display: none !important;
      content: none !important;
    }

    /* ─── 3. Reposition the kicker as an editorial rule above the eyebrow ─
       28px tall × 1.5px wide vertical hairline doesn't read editorial
       — keep the horizontal R8 dimensions (28×3px) but anchor it to the
       heading block, not the vessel. Sits 18px above the eyebrow. */
    .docs-r8-heading {
      padding: 36px 56px 14px !important;
      position: relative !important;
    }
    .docs-r8-heading::before {
      content: '' !important;
      display: block !important;
      width: 28px !important;
      height: 2px !important;
      background: var(--accent-primary) !important;
      margin-bottom: 18px !important;
      pointer-events: none !important;
    }

    /* ─── 4. Heading-to-prose hairline becomes a paragraph rule ──── */
    .docs-r8-rule {
      height: 0 !important;
      background: transparent !important;
      margin: 0 !important;
      border-bottom: 1px solid var(--border-subtle) !important;
      /* Pull it flush to the heading's left padding; prose padding
         already matches at 56px. */
      margin: 0 56px 28px !important;
      opacity: 0.6 !important;
    }

    /* ─── 5. Prose padding · the editable's children kept their 56px
       horizontal padding via R8 selectors. With the vessel un-carded,
       hold the same internal gutter so prose aligns with heading. The
       R8 selectors already do this; we just zero the right padding's
       last-of-type close so whitespace at the bottom feels open. */
    [data-shell-view="doc"] [contenteditable="true"] > p:last-of-type {
      padding-bottom: 80px !important;
    }

    /* ─── 6. Page bg stays warm-paper · ensure no panel chrome leaks ─
       Some R6 chrome paints a panel under the doc view. Force the
       shell-view doc background to the warm-paper base so the
       un-carded editable sits on consistent paper. */
    [data-shell-view="doc"] {
      background: var(--bg-base) !important;
    }
    /* Ditto on any R6/R5 wrapper that might have set surface-1 there. */
    [data-shell-view="doc"] > div[class*="docs-"][style*="background"] {
      background: var(--bg-base) !important;
    }
  `;

  function injectCSS() {
    if (document.getElementById('docs-r10-vessel-style')) return;
    const styleEl = document.createElement('style');
    styleEl.id = 'docs-r10-vessel-style';
    styleEl.textContent = CSS;
    document.head.appendChild(styleEl);
  }

  function boot() {
    if (!document.head) { requestAnimationFrame(boot); return; }
    injectCSS();
  }
  boot();

  Object.assign(window, {
    HF_DocsR10Vessel: {
      isApplied: () => !!document.getElementById('docs-r10-vessel-style'),
      containmentMode: 'whitespace',
    },
  });
})();
