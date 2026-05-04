/* global window, document */
/* hifi-cohesion-r9-livemode.jsx — Cohesion R9 · live-mode keystroke helper.

   Self-mounting Babel-standalone module. Owns three responsibilities:

     1. Bind a global ⌘\ / Ctrl+\ keystroke that toggles between layout and
        interactive views. Calls window.cohesionR9ToggleViewMode() when
        present (the interactive canvas registers it on mount); otherwise
        dispatches a 'cohesion-r9-toggle-view-mode' CustomEvent so any
        listener — including the canvas — can pick it up.

     2. Expose window.HF_CohesionR9LiveMode = { install, uninstall, isLiveMode }.
        isLiveMode() reads <body data-cohesion-mode> (set by the interactive
        view's useEffect) and returns true when the value is 'interactive'.
        install/uninstall are idempotent — the IIFE auto-installs once.

     3. Stay pure utility: no React mount, no JSX. The bookend to R8's
        discoverability layer — that arm binds '?'; this arm binds ⌘\.

   Loaded as a <script type="text/babel"> alongside the other hifi modules.
   The IIFE runs at module-load and binds the global keydown listener so
   the chord works on both views (layout view has no React-side ⌘\ binding).
*/

(function HF_CohesionR9LiveMode_IIFE() {
  if (typeof window === 'undefined') return;
  if (window.__COHESION_R9_LIVEMODE_BOOTED__) return;
  window.__COHESION_R9_LIVEMODE_BOOTED__ = true;

  const TOGGLE_EVENT = 'cohesion-r9-toggle-view-mode';

  function isEditableTarget(t) {
    if (!t) return false;
    const tag = t.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
    if (t.isContentEditable) return true;
    return false;
  }

  function fireToggle() {
    if (typeof window.cohesionR9ToggleViewMode === 'function') {
      try { window.cohesionR9ToggleViewMode(); return; } catch (_) { /* fall through */ }
    }
    try {
      const ev = new CustomEvent(TOGGLE_EVENT);
      window.dispatchEvent(ev);
    } catch (_) {
      // Older runtimes — fall back to a plain Event so the listener still fires.
      const fallback = document.createEvent ? document.createEvent('Event') : null;
      if (fallback && fallback.initEvent) {
        fallback.initEvent(TOGGLE_EVENT, true, true);
        window.dispatchEvent(fallback);
      }
    }
  }

  function onKeyDown(e) {
    if (!e || e.defaultPrevented) return;
    if (!(e.metaKey || e.ctrlKey)) return;
    // Match ⌘\ / Ctrl+\. Some keyboard layouts surface the backslash via
    // e.code='Backslash' even when e.key reports a modified glyph, so check
    // both. Ignore if any modal text input is focused.
    const isBackslash = e.key === '\\' || e.code === 'Backslash';
    if (!isBackslash) return;
    if (isEditableTarget(e.target)) return;
    e.preventDefault();
    e.stopPropagation();
    fireToggle();
  }

  let installed = false;
  function install() {
    if (installed) return;
    window.addEventListener('keydown', onKeyDown);
    installed = true;
  }
  function uninstall() {
    if (!installed) return;
    window.removeEventListener('keydown', onKeyDown);
    installed = false;
  }
  function isLiveMode() {
    if (typeof document === 'undefined' || !document.body) return false;
    return document.body.getAttribute('data-cohesion-mode') === 'interactive';
  }

  install();

  window.HF_CohesionR9LiveMode = { install, uninstall, isLiveMode };
})();
