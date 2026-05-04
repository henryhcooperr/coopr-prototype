/* global React, ReactDOM, window, document, requestAnimationFrame */
/* hifi-docs-r10-header-rhythm.jsx — Docs R10 (Wave 5 / V1).

   ── What changes from R8 ──────────────────────────────────────────
   1. TAIL JOINS TITLE — the italic tail is no longer a forced new line
      below the heading. It becomes an inline lyrical continuation in
      --fg-tertiary on the SAME paragraph as the title (Insights/Overview
      pattern: "+22% saves, +12% views. *One channel is going backwards.*").
      We achieve this by suppressing R8's `<br/>` between title and tail
      with `display:none` on `.docs-r8-title br`, and by rewriting tail
      to inline-flow with a hair-space lead-in.
   2. CANONICAL HEADLINE LADDER — apply the locked 48 / 36 / 28 ladder
      from colors_and_type.css (--text-4xl / --text-3xl / --text-2xl).
      The R8 default of 34px is replaced by 48px (spacious), with
      density-aware fallbacks via :root[data-doc-density] selectors.
   3. EYEBROW SITS ABOVE TITLE — kept (R8 already had this), but tightened
      letter-spacing and color, and the gap between eyebrow and title
      collapses from 8px to 6px so the eyebrow reads as a true kicker.
   4. TIGHTER LEADING — line-height 1.04 (was 1.06) and letter-spacing
      -0.035em (was -0.025em) to match the canonical .h1 from
      colors_and_type.css. Italic Literata at 48px wants this tracking.

   This file is CSS-only — no JSX overrides. Consumes HF_DocsR8Heading.
   Loads AFTER hifi-docs-r8-canvas.jsx.

   No MutationObservers in this file. (R8 inbound shipped 3 with
   childList:true,subtree:true on document.body that froze the renderer.)
*/

(function () {
  'use strict';
  if (window.__DOCS_R10_HEADER_RHYTHM_BOOTED__) return;
  window.__DOCS_R10_HEADER_RHYTHM_BOOTED__ = true;

  const CSS = `
    /* ─── 1. Tail joins title on the same flow ───────────────────── */
    /* R8 inserts a <br/> between {title} and the .docs-r8-title-tail
       <span>. Hide it; the tail will inline-flow after the title. */
    .docs-r8-title br { display: none !important; }

    .docs-r8-title {
      /* Re-flow the title as inline so the tail rides alongside. */
      display: block !important;
      text-wrap: pretty;
    }

    .docs-r8-title-tail {
      /* Inline continuation, not a subtitle. */
      display: inline !important;
      font-family: var(--font-serif) !important;
      font-style: italic !important;
      font-weight: 500 !important;
      color: var(--fg-tertiary) !important;
      /* Match the title's scale relationship — same family, same italic,
         half-step down. With title at 48px, tail at 32px reads as a
         lyrical breath, not a separate subtitle. */
      font-size: 0.66em !important;
      letter-spacing: -0.02em !important;
      line-height: 1 !important;
      /* The hair-space lead-in. A non-breaking space + em-dash creates
         the editorial cadence of "+22% saves, +12% views. *One channel
         is going backwards.*" without leaning on punctuation we don't
         control in source data. */
    }
    .docs-r8-title-tail::before {
      content: '\\00a0\\00a0';
    }

    /* ─── 2. Canonical 48 / 36 / 28 ladder ───────────────────────── */
    /* Default — spacious. Matches .h1 / .headline in colors_and_type.css. */
    .docs-r8-title {
      font-family: var(--font-serif) !important;
      font-style: italic !important;
      font-weight: 600 !important;
      font-size: var(--text-4xl, 48px) !important;
      line-height: 1.04 !important;
      letter-spacing: -0.035em !important;
      color: var(--fg-primary) !important;
      margin-bottom: 0 !important;
      max-width: 22ch;
    }

    /* Comfortable density (.h2 ladder rung — 36px). */
    [data-doc-density="comfortable"] .docs-r8-title,
    [data-doc-measure="comfortable"] .docs-r8-title {
      font-size: var(--text-3xl, 36px) !important;
      line-height: 1.06 !important;
      letter-spacing: -0.03em !important;
    }
    /* Comfortable tail follows down the ladder. */
    [data-doc-density="comfortable"] .docs-r8-title-tail,
    [data-doc-measure="comfortable"] .docs-r8-title-tail {
      font-size: 0.62em !important;
    }

    /* Compact density (.h3 ladder rung — 28px). */
    [data-doc-density="compact"] .docs-r8-title,
    [data-doc-measure="compact"] .docs-r8-title {
      font-size: var(--text-2xl, 28px) !important;
      line-height: 1.1 !important;
      letter-spacing: -0.02em !important;
    }
    [data-doc-density="compact"] .docs-r8-title-tail,
    [data-doc-measure="compact"] .docs-r8-title-tail {
      font-size: 0.6em !important;
    }

    /* ─── 3. Eyebrow tightens to a kicker ────────────────────────── */
    .docs-r8-eyebrow {
      font-family: var(--font-mono) !important;
      font-size: 9.5px !important;
      font-weight: 600 !important;
      letter-spacing: 0.14em !important;
      text-transform: uppercase !important;
      color: var(--fg-tertiary) !important;
      margin-bottom: 6px !important;
    }

    /* ─── 4. Heading block padding · breathes around the larger title ─
       R8 had 32px 56px 22px. With a 48px headline plus inline tail, we
       want 36px top / 14px bottom — the meta strip carries the close. */
    .docs-r8-heading {
      padding: 36px 56px 14px !important;
    }
  `;

  function injectCSS() {
    if (document.getElementById('docs-r10-header-rhythm-style')) return;
    const styleEl = document.createElement('style');
    styleEl.id = 'docs-r10-header-rhythm-style';
    styleEl.textContent = CSS;
    document.head.appendChild(styleEl);
  }

  function boot() {
    if (!document.head) { requestAnimationFrame(boot); return; }
    injectCSS();
  }
  boot();

  Object.assign(window, {
    HF_DocsR10HeaderRhythm: {
      ladder: { spacious: 48, comfortable: 36, compact: 28 },
      isApplied: () => !!document.getElementById('docs-r10-header-rhythm-style'),
    },
  });
})();
