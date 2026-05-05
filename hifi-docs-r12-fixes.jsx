/* global React, ReactDOM, window, document */
/* hifi-docs-r12-fixes.jsx — Docs R12 (Wave 7 / V1).

   Two bugs reported by the user via screenshot after R11 polish:

   ── Bug 1 · Duplicate heading ─────────────────────────────────────
   ROOT CAUSE: the R5 body autosaves `editable.innerHTML` to
   localStorage every ~800ms. By the time autosave runs, R8's portal
   has already injected `[data-r8-heading-mount]` with a fully-rendered
   `.docs-r8-heading` inside it as the editable's first child. So the
   saved HTML contains the heading markup. On reopen, R5's
   useLayoutEffect restores `editable.innerHTML = saved` BEFORE R8's
   tick() runs — that materialises the stale heading-mount + heading
   as a non-React DOM orphan. Then R8's tick() finds the existing
   mount via `:scope > [data-r8-heading-mount]`, reuses it as the
   portal host, and React appends ITS heading as a NEW child. Net:
   one mount, two `.docs-r8-heading` children — the first an orphan
   (no React fiber), the second the live React-managed portal.
   Verified in DevTools: child[0] has 0 fibers; child[1] has fibers.

   FIX: CSS-only. Hide all but the last `.docs-r8-heading` inside any
   `[data-r8-heading-mount]`. React appends its portal child at the
   end, so `:last-of-type` is always the live one and the orphan(s)
   above it collapse to display:none. Robust against further
   accumulation (each reopen-save cycle could in principle add more
   orphans; nth-from-last selector keeps only the live render).

   ── Bug 2 · Top whitespace gap ────────────────────────────────────
   ROOT CAUSE: the master canvas (`.cv-master-canvas`) is absolutely
   positioned with `top: var(--mv-surface-top)`, where
   `--mv-surface-top: calc(12px + 48px + 12px)` = 72px — reserving
   space for the floating chrome. R6 chrome's doc-active mode fades
   `.cv-master-chrome-shell` to opacity:0 but the 72px reservation
   stays (the canvas top isn't reclaimed). Stack-up to first heading:
   72px (canvas top) + 56px (R10 vessel editable margin-top) = 128px.
   The user sees the 72px patch — empty paper above the back button.

   FIX: CSS-only. When body has `.docs-r6-chrome-doc-active`, override
   `--mv-surface-top` to 12px (just the original `--mv-chrome-top`
   gap, no chrome row). The canvas slides up by 60px and the doc
   surface starts almost flush with the viewport. The faded chrome
   stays in the same absolute position — its host wrapper isn't
   anchored to the canvas — so the chrome reveal-on-hover behaviour
   from R6 still works. We also trim the editable's margin-top from
   56px to 24px so the back button isn't crammed against the top edge
   but doesn't waste the space either.

   This file is CSS-only. No JSX overrides. No MutationObservers.
   Loads AFTER all R10 + R11 files.
*/

(function () {
  'use strict';
  if (window.__DOCS_R12_FIXES_BOOTED__) return;
  window.__DOCS_R12_FIXES_BOOTED__ = true;

  // CSS string assembled via concatenation rather than a template literal —
  // the in-browser Babel transformer is configured to also parse template
  // literals as JSX-adjacent code, and choked on the comment block above
  // when CSS lived inside a backtick string. Plain-string concat with
  // newlines side-steps that.
  const CSS = [
    '/* 1. Dedupe heading -- hide all but the last .docs-r8-heading */',
    '/* inside any [data-r8-heading-mount]. React appends the live   */',
    '/* portal child at the end, so :last-of-type is always live;    */',
    '/* the orphan(s) above (materialised by R5 innerHTML hydration) */',
    '/* collapse to display:none.                                    */',
    '[data-r8-heading-mount] > .docs-r8-heading:not(:last-of-type) {',
    '  display: none !important;',
    '}',
    '',
    '/* 2. Reclaim top whitespace in doc-mode -- override the canvas top  */',
    '/* directly. R6 chrome fades cv-master-chrome-shell to opacity:0 in  */',
    '/* doc-mode but cv-master-canvas still anchors at top:72px (= the   */',
    '/* faded chrome reservation). Pin the canvas to top:12px while in   */',
    '/* doc-mode so the doc surface rides up close to the viewport top.  */',
    '/* (Setting --mv-surface-top on body alone wouldn\'t cascade past the */',
    '/* cv-master-root that already declares the var on itself.)         */',
    'body.docs-r6-chrome-doc-active .cv-master-canvas {',
    '  top: 12px !important;',
    '}',
    '/* Trim the editable top margin from R10\'s 56px down to 24px so the  */',
    '/* back-button row sits a small breath below the new canvas top.     */',
    'body.docs-r6-chrome-doc-active [data-shell-view="doc"] [contenteditable="true"] {',
    '  margin-top: 24px !important;',
    '}'
  ].join('\n');

  const styleEl = document.createElement('style');
  styleEl.id = 'docs-r12-fixes-style';
  styleEl.textContent = CSS;
  document.head.appendChild(styleEl);

  Object.assign(window, {
    HF_DocsR12Fixes: {
      mounted: true,
      isApplied: function () { return !!document.getElementById('docs-r12-fixes-style'); },
      changes: ['heading-dedupe-last-of-type', 'mv-surface-top-12-in-doc-mode', 'editable-margin-top-24'],
    },
  });
})();
