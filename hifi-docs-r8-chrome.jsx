/* global React, ReactDOM, window, document, requestAnimationFrame */
/* hifi-docs-r8-chrome.jsx — Docs R8 chrome (Wave 4 / V1).

   Loads AFTER hifi-docs-r6-chrome.jsx. The R6 chrome already manages:
     · 'docs-r6-chrome-doc-active' body class on doc-mode entry/exit
     · Master chrome fade
     · ESC-to-back keystroke
     · MasterState toolbar bridge (toasts, new-doc modal, open-doc event)

   We KEEP all of that — it's load-bearing. We RETIRE the floating toolbar
   (handled in r8-canvas.jsx via `display: none` on .docs-r6-toolbar) and
   we DELETE the compact-on-scroll machinery's behavior — since the bar is
   hidden anyway, the scroll listener does nothing harmful, but to be tidy
   we no longer wire any new compact behavior here.

   Heading inline tools live inside r8-canvas's HF_DocsR8Heading. The chrome
   layer is deliberately quiet in R8 — it manages MODE (doc vs home) only.

   Public API (window):
     HF_DocsR8Chrome.isToolbarRetired()  // always true in R8
*/

(function () {
  'use strict';
  if (window.__DOCS_R8_CHROME_BOOTED__) return;
  window.__DOCS_R8_CHROME_BOOTED__ = true;

  // The R6 chrome's MutationObserver + setChromeMode + backToHome are still
  // running underneath us. We just declare the toolbar retired for any
  // consumer that asks.
  Object.assign(window, {
    HF_DocsR8Chrome: {
      isToolbarRetired: () => true,
    },
  });
})();
