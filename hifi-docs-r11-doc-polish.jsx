/* global React, ReactDOM, window, document, requestAnimationFrame */
/* hifi-docs-r11-doc-polish.jsx — Docs R11 (Wave 6 / V1).

   ── What changes from R10 ──────────────────────────────────────────
   1. R5 OUTER CRUMB HIDES — the < DOCS · STUDIO › DOCS · ... breadcrumb
      + autosaved corner that sits above the R8 vessel was redundant
      with the R8 inline tools row (which already has a back affordance
      and the doc title). Hidden via CSS in doc-mode only.
   2. EDITABLE MEASURE WIDENS — from 760 to 960 max-width inside the
      vessel. The R10 vessel chrome retire freed the bounding box;
      this pass uses that breath for actual reading-column width.
   3. EDITABLE GETS INSIDE PADDING — 56px horizontal so text never
      runs flush against the surface. R8 had 0 because the card chrome
      was the boundary; with R10 retiring the chrome, padding has to
      come from the editable itself.
   4. HEADING ZONE COMPRESSES — eyebrow→title→tail→meta vertical
      spacing trims ~30%. The R8 layout was sized for a vessel that
      no longer exists.
   5. WORDS INLINES WITH META — was wrapping to its own row when
      flex-wrap kicked in; now the meta strip is nowrap so the mono
      dateline stays one line.

   This file is CSS-only. No JSX overrides. No MutationObservers.
   Loads AFTER hifi-docs-r10-*.jsx.
*/

(function () {
  'use strict';
  if (window.__DOCS_R11_DOC_POLISH_BOOTED__) return;
  window.__DOCS_R11_DOC_POLISH_BOOTED__ = true;

  const CSS = `
    /* ─── 1. Hide R5 outer crumb in doc-mode ─────────────────────── */
    /* R5_DocCrumb (hifi-studio-r5-shell.jsx ~line 125) renders the first
       direct child of [data-shell-view="doc"] with these inline-style
       fingerprints: padding:'10px 24px' + borderBottom:'1px solid
       var(--border-subtle)' + background:'var(--surface-1)'.
       We hide via :first-child structural selector — the R8 inline
       tools row lives INSIDE the editable (mounted via portal as the
       first child of [contenteditable=true]), not at this level, so
       it's safe to retire the structural first child here. */
    [data-shell-view="doc"] > div:first-child {
      display: none !important;
    }
    /* Belt-and-suspenders · style-fingerprint match in case structural
       order shifts (e.g. an unrelated wrapper is injected ahead). The
       crumb is the only element at this level with surface-1 bg AND a
       border-bottom AND 10px 24px padding. */
    [data-shell-view="doc"] > div[style*="border-bottom"][style*="surface-1"] {
      display: none !important;
    }

    /* ─── 2. Widen editable measure to 960px ─────────────────────── */
    /* R10 vessel set max-width: 760px !important. We override with a
       higher specificity selector to lift to 960px in doc-mode only —
       Docs Home (R6) uses the same --docs-r6-measure var but a different
       shell-view, so that surface is untouched. */
    [data-shell-view="doc"] [contenteditable="true"] {
      max-width: 960px !important;
    }

    /* ─── 3. Inside padding · text breathes off the surface ──────── */
    /* R10 vessel stripped border/bg/shadow but left padding at 0 since
       the children carried their own per-block padding via R8 selectors.
       For the editable itself we add a horizontal gutter so the heading
       and prose share a consistent left/right rail. Top/bottom stay 0
       so the heading zone owns its own vertical padding. */
    [data-shell-view="doc"] [contenteditable="true"] {
      padding: 0 56px !important;
      box-sizing: border-box !important;
    }
    /* The heading block owns its own internal padding (R10 set it to
       36px 56px 14px). Since the editable now carries 56px sides, the
       heading's side padding would double up — collapse to 0 sides. */
    [data-shell-view="doc"] .docs-r8-heading {
      padding-left: 0 !important;
      padding-right: 0 !important;
    }
    /* Same collapse for the R10 hairline rule — it was offset by 56px
       to align with heading padding. With heading padding now 0 sides,
       the rule goes flush. */
    [data-shell-view="doc"] .docs-r8-rule {
      margin-left: 0 !important;
      margin-right: 0 !important;
    }
    /* Prose blocks (R8 set p/h2/h3/blockquote to padding-left/right 56px)
       now sit inside an already-padded editable. Zero their per-block
       horizontal padding so the gutter doesn't double. */
    [data-shell-view="doc"] [contenteditable="true"] > p,
    [data-shell-view="doc"] [contenteditable="true"] > h2,
    [data-shell-view="doc"] [contenteditable="true"] > h3,
    [data-shell-view="doc"] [contenteditable="true"] > blockquote {
      padding-left: 0 !important;
      padding-right: 0 !important;
    }

    /* ─── 4. Heading zone vertical compression (~30% off) ────────── */
    /* R10 header-rhythm set: padding 36px 56px 14px. We compress top
       to 20px (was 32 in R8 / 36 in R10), bottom to 14 (matches R10).
       Sides handled by step 3 above. */
    [data-shell-view="doc"] .docs-r8-heading {
      padding-top: 20px !important;
      padding-bottom: 14px !important;
    }
    /* Row1 (back + tools) margin-bottom: R8 had 14, R10 tools bumped
       to 22 for the 48px headline. Trim back to 10 — the larger title
       still has air above from the eyebrow's tightened margin. */
    [data-shell-view="doc"] .docs-r8-heading-row1 {
      margin-bottom: 10px !important;
    }
    /* Eyebrow → title gap: R10 set 6, we tighten to 5. */
    [data-shell-view="doc"] .docs-r8-eyebrow {
      margin-bottom: 5px !important;
    }
    /* Meta strip pull-up: R10 meta-strip set margin-top:12, padding-top:0.
       Trim margin-top to 10 so the dateline rides closer to the title
       block, reclaiming ~2px more vertical. */
    [data-shell-view="doc"] .docs-r8-meta-strip {
      margin-top: 10px !important;
      padding-top: 0 !important;
    }
    /* R10 vessel placed an editorial accent rule (28×2px ::before)
       above the eyebrow with margin-bottom:18px. With the heading
       compressed, pull that rule's gap down to 12px so it doesn't
       eat the saved vertical. */
    [data-shell-view="doc"] .docs-r8-heading::before {
      margin-bottom: 12px !important;
    }

    /* ─── 5. WORDS inlines with the meta strip dateline ──────────── */
    /* The Words key+value already lives inside .docs-r8-meta-strip
       (R8 canvas line ~428: <span class="k">Words</span><span class="v">…).
       It only LOOKS like a separate row because R8 set
       flex-wrap: wrap and the strip wraps when version pills bloom
       (or when the line just runs out of room at 760px). At 960px
       width with R10's pills hidden by default, we force nowrap so
       the dateline stays one line. */
    [data-shell-view="doc"] .docs-r8-meta-strip {
      flex-wrap: nowrap !important;
      white-space: nowrap !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
    }
    /* Words key + value get a small left-pad so they sit naturally at
       the right end of the dateline rather than crowding the channel. */
    [data-shell-view="doc"] .docs-r8-meta-strip .k:last-of-type,
    [data-shell-view="doc"] .docs-r8-meta-strip .v:last-of-type {
      flex-shrink: 0 !important;
    }
  `;

  function injectCSS() {
    if (document.getElementById('docs-r11-doc-polish-style')) return;
    const styleEl = document.createElement('style');
    styleEl.id = 'docs-r11-doc-polish-style';
    styleEl.textContent = CSS;
    document.head.appendChild(styleEl);
  }

  function boot() {
    if (!document.head) { requestAnimationFrame(boot); return; }
    injectCSS();
  }
  boot();

  Object.assign(window, {
    HF_DocsR11DocPolish: {
      mounted: true,
      isApplied: () => !!document.getElementById('docs-r11-doc-polish-style'),
      changes: ['r5-crumb-hide', 'editable-measure-960', 'editable-padding-56', 'heading-compress', 'meta-strip-nowrap'],
    },
  });
})();
