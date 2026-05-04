/* global React, ReactDOM, window, document, requestAnimationFrame */
/* hifi-docs-r8-discoverability.jsx — Docs R8 discoverability primitives.

   Three primitives, no tour:
     1. Empty-doc serif italic margin guide as content (drops on first keystroke)
     2. 1.4s mono "next time · ⌘X" gutter hint after equivalent menu actions
     3. Full-bleed editorial Shortcuts page on `?` keystroke

   Public API (window):
     HF_DocsR8Discoverability.flashHint(text)   // (3) shows a 1.4s gutter pill
     HF_DocsR8Discoverability.openShortcuts()
     HF_DocsR8Discoverability.closeShortcuts()
*/

(function () {
  'use strict';
  if (window.__DOCS_R8_DISCO_BOOTED__) return;
  window.__DOCS_R8_DISCO_BOOTED__ = true;

  const CSS = `
    /* ── Empty-doc margin guide ────────────────────────────────── */
    .docs-r8-empty-guide {
      font-family: var(--font-serif);
      font-style: italic;
      color: var(--fg-tertiary);
      font-size: 15px;
      line-height: 1.55;
      border-left: 2px solid var(--accent-soft);
      padding: 4px 0 4px 14px;
      margin: 18px 56px;
      max-width: 42ch;
    }
    .docs-r8-empty-guide kbd {
      font-family: var(--font-mono);
      font-style: normal;
      font-size: 10.5px;
      font-weight: 600;
      padding: 1px 5px;
      border: 1px solid var(--border-default);
      border-radius: 3px;
      color: var(--fg-secondary);
      background: var(--surface-2);
      margin: 0 1px;
    }
    /* ── Gutter hint pill ──────────────────────────────────────── */
    .docs-r8-gutter-hint {
      position: fixed;
      right: 24px;
      bottom: 24px;
      padding: 8px 14px;
      background: var(--fg-primary);
      color: var(--fg-on-accent);
      border-radius: 999px;
      font-family: var(--font-mono);
      font-size: 10px; font-weight: 700;
      letter-spacing: 0.10em; text-transform: uppercase;
      box-shadow: 0 8px 20px -8px rgba(26,24,21,0.45);
      z-index: 50;
      opacity: 0;
      transform: translateY(8px);
      pointer-events: none;
      transition: opacity 220ms cubic-bezier(0.2,0.7,0.2,1),
                  transform 220ms cubic-bezier(0.2,0.7,0.2,1);
    }
    .docs-r8-gutter-hint.is-visible { opacity: 1; transform: translateY(0); }
    .docs-r8-gutter-hint::before {
      content: '←';
      color: var(--accent-soft);
      margin-right: 8px;
      font-weight: 700;
    }
    /* ── Shortcuts modal · full-bleed editorial spread ─────────── */
    .docs-r8-shortcuts-overlay {
      position: fixed; inset: 0;
      background: rgba(26,24,21,0.55);
      backdrop-filter: blur(2px);
      z-index: 100;
      display: flex; align-items: center; justify-content: center;
      opacity: 0; pointer-events: none;
      transition: opacity 220ms;
    }
    .docs-r8-shortcuts-overlay.is-open {
      opacity: 1; pointer-events: auto;
    }
    .docs-r8-shortcuts-spread {
      width: min(960px, calc(100vw - 48px));
      max-height: calc(100vh - 48px);
      background: var(--surface-1);
      border: 1px solid var(--border-default);
      border-radius: 4px;
      overflow: auto;
      padding: 48px 56px 56px;
      position: relative;
      transform: translateY(8px);
      transition: transform 220ms cubic-bezier(0.2,0.7,0.2,1);
    }
    .docs-r8-shortcuts-overlay.is-open .docs-r8-shortcuts-spread { transform: translateY(0); }
    .docs-r8-shortcuts-spread::before {
      content: '';
      position: absolute;
      left: 56px; top: 0;
      width: 28px; height: 3px;
      background: var(--accent-primary);
    }
    .docs-r8-shortcuts-spread .eb {
      font-family: var(--font-mono);
      font-size: 9.5px; font-weight: 600;
      letter-spacing: 0.14em; text-transform: uppercase;
      color: var(--fg-tertiary);
      margin-bottom: 8px;
    }
    .docs-r8-shortcuts-spread h1 {
      font-family: var(--font-serif);
      font-style: italic;
      font-weight: 600;
      font-size: 44px;
      letter-spacing: -0.025em;
      line-height: 1.04;
      margin: 0 0 24px;
    }
    .docs-r8-shortcuts-cols {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 36px;
      column-gap: 56px;
    }
    .docs-r8-shortcut-section h2 {
      font-family: var(--font-mono);
      font-size: 10px; font-weight: 700;
      letter-spacing: 0.14em; text-transform: uppercase;
      color: var(--fg-tertiary);
      border-bottom: 1px solid var(--fg-primary);
      padding-bottom: 6px;
      margin: 14px 0 10px;
    }
    .docs-r8-shortcut-row {
      display: flex; align-items: baseline;
      padding: 7px 0;
      border-bottom: 1px solid var(--border-subtle);
      gap: 12px;
    }
    .docs-r8-shortcut-row .label {
      font-family: var(--font-serif);
      font-size: 14.5px;
      color: var(--fg-primary);
      flex: 1;
    }
    .docs-r8-shortcut-row kbd {
      font-family: var(--font-mono);
      font-size: 11px; font-weight: 600;
      padding: 2px 7px;
      border: 1px solid var(--border-default);
      border-radius: 3px;
      color: var(--fg-secondary);
      background: var(--surface-2);
      letter-spacing: 0.04em;
    }
    .docs-r8-shortcuts-close {
      position: absolute;
      top: 18px; right: 18px;
      width: 30px; height: 30px;
      border-radius: 5px;
      display: inline-flex; align-items: center; justify-content: center;
      cursor: pointer;
      color: var(--fg-tertiary);
      font-family: var(--font-mono);
      font-size: 16px;
    }
    .docs-r8-shortcuts-close:hover { color: var(--fg-primary); background: var(--surface-2); }

    /* ── Hide guide once user starts typing prose ─────────────── */
    [data-shell-view="doc"] [contenteditable="true"][data-r8-has-typed="1"] .docs-r8-empty-guide {
      display: none;
    }
  `;

  function injectCSS() {
    if (document.getElementById('docs-r8-disco-style')) return;
    const styleEl = document.createElement('style');
    styleEl.id = 'docs-r8-disco-style';
    styleEl.textContent = CSS;
    document.head.appendChild(styleEl);
  }

  // ── 1. Empty-doc margin guide ──────────────────────────────────────
  // Watches the editable; if there's no prose (only the heading mount and
  // optionally an empty <p>), inserts the guide as the second child. Drops
  // on first keypress.
  function maintainEmptyGuide() {
    const ed = document.querySelector('[data-shell-view="doc"] [contenteditable="true"]');
    if (!ed) return;
    if (ed.getAttribute('data-r8-has-typed') === '1') return;
    // Count non-heading-mount, non-empty children
    const realChildren = Array.from(ed.children).filter(c => {
      if (c.hasAttribute('data-r8-heading-mount')) return false;
      if (c.classList.contains('docs-r8-empty-guide')) return false;
      const txt = (c.textContent || '').trim();
      return txt.length > 0;
    });
    let guide = ed.querySelector(':scope > .docs-r8-empty-guide');
    if (realChildren.length === 0) {
      if (!guide) {
        guide = document.createElement('div');
        guide.className = 'docs-r8-empty-guide';
        guide.setAttribute('contenteditable', 'false');
        guide.innerHTML = 'Press <kbd>/</kbd> for blocks. <kbd>[ ]</kbd> for a task. <kbd>?</kbd> for shortcuts. — <em>Coopr, in the margin.</em>';
        const heading = ed.querySelector(':scope > [data-r8-heading-mount]');
        if (heading && heading.nextSibling) ed.insertBefore(guide, heading.nextSibling);
        else ed.appendChild(guide);
      }
    } else if (guide) {
      guide.remove();
    }
  }

  document.addEventListener('input', (e) => {
    const ed = e.target && e.target.closest && e.target.closest('[data-shell-view="doc"] [contenteditable="true"]');
    if (!ed) return;
    ed.setAttribute('data-r8-has-typed', '1');
    const guide = ed.querySelector(':scope > .docs-r8-empty-guide');
    if (guide) guide.remove();
  }, true);

  // ── 2. Gutter hint ─────────────────────────────────────────────────
  let hintEl = null;
  let hintTimer = null;
  function flashHint(text) {
    if (!hintEl) {
      hintEl = document.createElement('div');
      hintEl.className = 'docs-r8-gutter-hint';
      document.body.appendChild(hintEl);
    }
    hintEl.textContent = text;
    requestAnimationFrame(() => { hintEl.classList.add('is-visible'); });
    if (hintTimer) clearTimeout(hintTimer);
    hintTimer = setTimeout(() => {
      hintEl.classList.remove('is-visible');
    }, 1400);
  }

  // ── 3. Shortcuts modal ─────────────────────────────────────────────
  let modalEl = null;
  function buildModal() {
    if (modalEl) return modalEl;
    modalEl = document.createElement('div');
    modalEl.className = 'docs-r8-shortcuts-overlay';
    modalEl.innerHTML = `
      <div class="docs-r8-shortcuts-spread" role="dialog" aria-label="Keyboard shortcuts">
        <span class="docs-r8-shortcuts-close" aria-label="Close">×</span>
        <div class="eb">Coopr · Docs · keyboard</div>
        <h1>Shortcuts.<br/><span style="color:var(--fg-tertiary);">All of them.</span></h1>
        <div class="docs-r8-shortcuts-cols">
          <div class="docs-r8-shortcut-section">
            <h2>Move</h2>
            <div class="docs-r8-shortcut-row"><span class="label">Back to Docs home</span><kbd>Esc</kbd></div>
            <div class="docs-r8-shortcut-row"><span class="label">Open command bar</span><kbd>⌘ K</kbd></div>
            <div class="docs-r8-shortcut-row"><span class="label">This panel</span><kbd>?</kbd></div>
            <h2>Write</h2>
            <div class="docs-r8-shortcut-row"><span class="label">Block menu</span><kbd>/</kbd></div>
            <div class="docs-r8-shortcut-row"><span class="label">Bold · italic</span><kbd>⌘ B</kbd><kbd>⌘ I</kbd></div>
            <div class="docs-r8-shortcut-row"><span class="label">Duplicate line</span><kbd>⌘ D</kbd></div>
            <div class="docs-r8-shortcut-row"><span class="label">Task</span><kbd>[ ]</kbd></div>
          </div>
          <div class="docs-r8-shortcut-section">
            <h2>Version</h2>
            <div class="docs-r8-shortcut-row"><span class="label">New version</span><kbd>⌘ ⇧ V</kbd></div>
            <div class="docs-r8-shortcut-row"><span class="label">Branch (trial)</span><kbd>⌘ ⇧ B</kbd></div>
            <div class="docs-r8-shortcut-row"><span class="label">Compare</span><kbd>⌘ \\</kbd></div>
            <h2>Share</h2>
            <div class="docs-r8-shortcut-row"><span class="label">Share dialog</span><kbd>⌘ ⇧ S</kbd></div>
            <div class="docs-r8-shortcut-row"><span class="label">Export · channel</span><kbd>⌘ E</kbd></div>
            <h2>Coopr</h2>
            <div class="docs-r8-shortcut-row"><span class="label">Hand to Coopr</span><kbd>⌘ J</kbd></div>
            <div class="docs-r8-shortcut-row"><span class="label">Margin guide</span><kbd>⌘ '</kbd></div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modalEl);
    modalEl.addEventListener('click', (e) => {
      if (e.target === modalEl) closeShortcuts();
    });
    modalEl.querySelector('.docs-r8-shortcuts-close').addEventListener('click', closeShortcuts);
    return modalEl;
  }
  function openShortcuts() {
    buildModal();
    requestAnimationFrame(() => { modalEl.classList.add('is-open'); });
  }
  function closeShortcuts() {
    if (modalEl) modalEl.classList.remove('is-open');
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === '?' && !e.metaKey && !e.ctrlKey) {
      const t = e.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      e.preventDefault();
      openShortcuts();
    }
    if (e.key === 'Escape' && modalEl && modalEl.classList.contains('is-open')) {
      closeShortcuts();
    }
  });

  // ── Boot ───────────────────────────────────────────────────────────
  function boot() {
    if (!document.body) { requestAnimationFrame(boot); return; }
    injectCSS();
    // PATCH (orchestrator · 2026-05-04): the original observer used
    // childList:true + subtree:true, which fired on every editable mutation
    // and caused renderer freezes via maintainEmptyGuide → DOM mutation →
    // observer fires → maintainEmptyGuide. Drop childList; only respond
    // to attribute changes for data-shell-view / data-active-doc-id.
    const obs = new MutationObserver((mutations) => {
      let attrChanged = false;
      for (const m of mutations) {
        if (m.type === 'attributes') { attrChanged = true; break; }
      }
      if (attrChanged) maintainEmptyGuide();
    });
    obs.observe(document.body, {
      attributes: true, subtree: true,
      attributeFilter: ['data-shell-view','data-active-doc-id'],
    });
    // Also re-run on every keyup inside the editable so the guide drops
    // when the user types — cheaper than observing childList globally.
    document.addEventListener('keyup', (e) => {
      const t = e.target;
      if (t && t.closest && t.closest('[data-shell-view="doc"] [contenteditable="true"]')) {
        const ed = t.closest('[contenteditable="true"]');
        if (ed && ed.getAttribute('data-r8-has-typed') !== '1') {
          // Mark typed and remove the guide once
          if (e.key && e.key.length === 1) {
            ed.setAttribute('data-r8-has-typed', '1');
            const guide = ed.querySelector(':scope > .docs-r8-empty-guide');
            if (guide) guide.remove();
          }
        }
      }
    }, true);
    maintainEmptyGuide();
  }
  boot();

  Object.assign(window, {
    HF_DocsR8Discoverability: { flashHint, openShortcuts, closeShortcuts },
  });
})();
