/* global React, ReactDOM, window, document, requestAnimationFrame */
/* hifi-docs-r10-tools.jsx — Docs R10 (Wave 5 / V1).

   ── What changes from R8 ──────────────────────────────────────────
   1. SHARE DEMOTES TO A LABELLED LINK — R8 painted Share as a black pill
      pulling all the eye. The black pill (var(--fg-primary) bg) is
      retired; Share becomes a labelled mono-caps link with a hairline
      under it on hover. SHARE no longer pretends to be the page CTA.
   2. INSERT GETS A LABEL — the `+` icon read ambiguously next to the
      hamburger; we relabel it "INSERT" in mono caps. Format and Version
      retire to a single overflow menu (the `⋯` at the right) since
      they're keystroke-discoverable (⌘B / ⌘I / ⌘⇧V) and the empty-doc
      gutter hint already surfaces them.
   3. ICON-ONLY → ONE PRIMARY VERB + OVERFLOW — the row at rest reads:
        [← DOCS]   ·   INSERT  ·  ⋯  ·  SHARE
      Three labelled glyphs, one disclosure. No black pill.
   4. BACK AFFORDANCE TIGHTENS — the back chevron + "DOCS" mono caps row
      stays at row-1-left, but the chevron grows to 12×12 and gets a 4px
      gap to the word so it reads as a single hit target.

   This file is CSS-only. We don't replace HF_DocsR8Heading. We hide
   the Format/Version inline tools (`display:none`) and re-skin the
   primary Share span so it stops looking like a black pill. Insert
   gets a labelled `::after` content treatment.
   Loads AFTER hifi-docs-r10-meta-strip.jsx.
*/

(function () {
  'use strict';
  if (window.__DOCS_R10_TOOLS_BOOTED__) return;
  window.__DOCS_R10_TOOLS_BOOTED__ = true;

  const CSS = `
    /* ─── 1. Hide Format + Version inline icons · keystroke-only ─── */
    /* They survive in the source tree (HF_DocsR8Heading still renders
       them), so accessibility names + dispatcher contracts hold. */
    .docs-r8-tool[title="Format"],
    .docs-r8-tool[title="Version"] {
      display: none !important;
    }

    /* ─── 2. Tools row · reflow as a quiet meta line ─────────────── */
    .docs-r8-tools {
      gap: 14px !important;
      align-items: center !important;
    }

    /* ─── 3. Insert · icon retires, label takes over ─────────────── */
    .docs-r8-tool[title="Insert"] {
      width: auto !important;
      height: auto !important;
      padding: 4px 0 !important;
      border-radius: 0 !important;
      background: transparent !important;
      color: var(--fg-tertiary) !important;
      font-family: var(--font-mono) !important;
      font-size: 9.5px !important;
      font-weight: 600 !important;
      letter-spacing: 0.14em !important;
      text-transform: uppercase !important;
      position: relative;
      transition: color 120ms var(--ease-entry, cubic-bezier(0.2,0.7,0.2,1));
    }
    .docs-r8-tool[title="Insert"] svg {
      display: none !important;
    }
    .docs-r8-tool[title="Insert"]::after {
      content: 'Insert';
      letter-spacing: inherit;
    }
    .docs-r8-tool[title="Insert"]:hover {
      background: transparent !important;
      color: var(--fg-primary) !important;
    }
    .docs-r8-tool[title="Insert"]::before {
      content: '+';
      margin-right: 6px;
      font-family: var(--font-mono);
      font-size: 12px;
      font-weight: 500;
      letter-spacing: 0;
      color: var(--fg-tertiary);
      vertical-align: -1px;
    }
    .docs-r8-tool[title="Insert"]:hover::before {
      color: var(--accent-primary);
    }

    /* ─── 4. Overflow · stays as the single disclosure ───────────── */
    .docs-r8-tool[title="More"] {
      width: 24px !important;
      height: 24px !important;
      border-radius: 4px !important;
      color: var(--fg-tertiary) !important;
      transition: color 120ms, background 120ms;
    }
    .docs-r8-tool[title="More"]:hover {
      color: var(--fg-primary) !important;
      background: var(--surface-2) !important;
    }

    /* ─── 5. Share retires the black pill ────────────────────────── */
    .docs-r8-tool.is-primary {
      width: auto !important;
      height: auto !important;
      padding: 4px 0 !important;
      background: transparent !important;
      color: var(--fg-secondary) !important;
      font-family: var(--font-mono) !important;
      font-size: 9.5px !important;
      font-weight: 700 !important;
      letter-spacing: 0.14em !important;
      text-transform: uppercase !important;
      border-radius: 0 !important;
      border-bottom: 1px solid transparent !important;
      margin-left: 0 !important;
      transition:
        color 120ms var(--ease-entry, cubic-bezier(0.2,0.7,0.2,1)),
        border-color 120ms var(--ease-entry, cubic-bezier(0.2,0.7,0.2,1));
    }
    .docs-r8-tool.is-primary:hover {
      background: transparent !important;
      color: var(--fg-primary) !important;
      border-bottom-color: var(--accent-primary) !important;
    }
    /* Subtle accent dot before SHARE — replaces the loud pill with a
       single piece of editorial punctuation. */
    .docs-r8-tool.is-primary::before {
      content: '';
      display: inline-block;
      width: 4px; height: 4px;
      border-radius: 999px;
      background: var(--accent-primary);
      margin-right: 8px;
      vertical-align: 2px;
    }

    /* ─── 6. Back affordance · chevron + word read as one hit target ─ */
    .docs-r8-back {
      gap: 6px !important;
      padding: 4px 6px 4px 0 !important;
      font-size: 10px !important;
      letter-spacing: 0.14em !important;
      color: var(--fg-tertiary) !important;
      transition: color 120ms;
    }
    .docs-r8-back:hover {
      color: var(--fg-primary) !important;
    }
    .docs-r8-back svg {
      width: 10px;
      height: 10px;
    }

    /* ─── 7. Row-1 vertical alignment with the larger title ──────── */
    /* With the title at 48px and an editorial rule above the eyebrow,
       the tools row visually wants more breathing space below. */
    .docs-r8-heading-row1 {
      margin-bottom: 22px !important;
    }
  `;

  function injectCSS() {
    if (document.getElementById('docs-r10-tools-style')) return;
    const styleEl = document.createElement('style');
    styleEl.id = 'docs-r10-tools-style';
    styleEl.textContent = CSS;
    document.head.appendChild(styleEl);
  }

  function boot() {
    if (!document.head) { requestAnimationFrame(boot); return; }
    injectCSS();
  }
  boot();

  Object.assign(window, {
    HF_DocsR10Tools: {
      isApplied: () => !!document.getElementById('docs-r10-tools-style'),
      surfaced: ['Insert', 'Overflow', 'Share'],
      retired: ['Format', 'Version'],
    },
  });
})();
