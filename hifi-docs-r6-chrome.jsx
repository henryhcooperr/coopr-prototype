/* global React, ReactDOM, window, document, requestAnimationFrame */
/* hifi-docs-r6-chrome.jsx — Docs R6 chrome state machine (Wave 2 / I1).

   Watches the page for the R5 shell's `data-shell-view="doc"` marker via a
   MutationObserver. On entry to doc-mode the master chrome (`.cv-master-chrome-shell`)
   fades and slides up; an R6 doc-mode toolbar slides into the same vertical
   slot — back chevron, doc eyebrow + title, and visual placeholders for
   Format / Insert / Version / Share / overflow. Exits via the back chevron,
   the underlying R5 crumb back, or Escape.

   Owns no doc content. Owns no editor logic. Owns the chrome reconfiguration
   only. Public API (window):
     docsR6SetChromeMode(mode, opts?)   // 'home' | 'doc'; opts: { docId }
     docsR6OnChromeModeChange(cb)       // returns unsubscribe fn
     docsR6BackToHome()                 // dispatches click on R5 crumb back
     docsR6GetChromeMode()              // { mode, docId }

   Self-mounts a portal at document.body once React + ReactDOM are ready.
   Self-injects its CSS once. Idempotent under hot reload via a window flag. */

(function () {
  'use strict';
  if (window.__DOCS_R6_CHROME_BOOTED__) return;
  window.__DOCS_R6_CHROME_BOOTED__ = true;

  // ── CSS injection ─────────────────────────────────────────────────
  const CSS = `
    .cv-master-chrome-shell {
      transition: opacity 250ms cubic-bezier(0.2,0.7,0.2,1),
                  transform 250ms cubic-bezier(0.2,0.7,0.2,1) !important;
    }
    .docs-r6-chrome-doc-active .cv-master-chrome-shell {
      opacity: 0 !important;
      pointer-events: none !important;
      transform: translateY(-12px) !important;
    }
    .cv-master-canvas {
      transition: filter 250ms ease-out, background-color 250ms ease-out;
    }
    .docs-r6-chrome-doc-active .cv-master-canvas {
      background-color: color-mix(in srgb, var(--surface-2) 100%, transparent);
    }
    .docs-r6-toolbar {
      position: fixed;
      top: 14px;
      left: 50%;
      width: min(calc(100vw - 28px), 1100px);
      height: 52px;
      box-sizing: border-box;
      background: var(--surface-1);
      border: 1px solid var(--border-subtle);
      border-radius: 12px;
      box-shadow:
        0 16px 32px -18px rgba(26,24,21,0.18),
        0 2px 6px -3px rgba(26,24,21,0.08),
        0 1px 0 rgba(253,252,249,0.7) inset;
      display: flex;
      align-items: center;
      padding: 0 16px;
      gap: 12px;
      z-index: 11;
      opacity: 0;
      pointer-events: none;
      transform: translateX(-50%) translateY(-40px);
      transition: opacity 250ms cubic-bezier(0.2,0.7,0.2,1),
                  transform 250ms cubic-bezier(0.2,0.7,0.2,1),
                  width 280ms cubic-bezier(0.2,0.7,0.2,1),
                  height 280ms cubic-bezier(0.2,0.7,0.2,1);
    }
    .docs-r6-chrome-doc-active .docs-r6-toolbar {
      opacity: 1;
      pointer-events: auto;
      transform: translateX(-50%) translateY(0);
    }
    /* Compact mode — kicks in when the doc canvas has scrolled past the
       in-doc heading zone. Toolbar shrinks horizontally + the verbose
       eyebrow/title pair collapses to a single mono breadcrumb. */
    .docs-r6-toolbar.is-compact {
      width: min(calc(100vw - 28px), 720px);
      height: 44px;
    }
    .docs-r6-toolbar .docs-r6-toolbar-title-pair {
      display: flex;
      align-items: baseline;
      gap: 10px;
      min-width: 0; flex: 0 1 auto;
      transition: opacity 220ms cubic-bezier(0.2,0.7,0.2,1);
    }
    .docs-r6-toolbar.is-compact .docs-r6-toolbar-title-pair {
      display: none;
    }
    .docs-r6-toolbar .docs-r6-toolbar-compact-crumb {
      display: none;
      font-family: var(--font-mono); font-size: 10px; font-weight: 600;
      letter-spacing: 0.10em; text-transform: uppercase;
      color: var(--fg-secondary);
      min-width: 0; flex: 0 1 auto;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .docs-r6-toolbar.is-compact .docs-r6-toolbar-compact-crumb {
      display: inline;
    }
    /* In compact mode also tighten the right-side tools so the bar feels
       like a focused breadcrumb, not a duplicate of the heading zone. */
    .docs-r6-toolbar.is-compact .docs-r6-toolbar-tool-label {
      display: none;
    }
    .docs-r6-toolbar.is-compact .docs-r6-toolbar-tool {
      width: 30px; padding: 0;
      justify-content: center;
    }
    /* Tiny canvas slide-up so the body re-flows in concert with the chrome swap */
    [data-shell-view="doc"] {
      transition: transform 250ms cubic-bezier(0.2,0.7,0.2,1),
                  opacity 250ms cubic-bezier(0.2,0.7,0.2,1);
    }
    .docs-r6-chrome-doc-active [data-shell-view="doc"] {
      animation: docs-r6-canvas-in 250ms cubic-bezier(0.2,0.7,0.2,1) both;
    }
    @keyframes docs-r6-canvas-in {
      0%   { opacity: 0; transform: translateY(12px); }
      100% { opacity: 1; transform: translateY(0); }
    }
  `;

  function injectCSS() {
    if (document.getElementById('docs-r6-chrome-style')) return;
    const styleEl = document.createElement('style');
    styleEl.id = 'docs-r6-chrome-style';
    styleEl.textContent = CSS;
    document.head.appendChild(styleEl);
  }

  // ── State + listeners ─────────────────────────────────────────────
  let mode = 'home';      // 'home' | 'doc'
  let docId = null;
  const listeners = new Set();

  function notify() {
    listeners.forEach(cb => {
      try { cb(mode, docId); } catch (e) { /* swallow listener errors */ }
    });
  }

  function setChromeMode(next, opts) {
    if (next !== 'home' && next !== 'doc') return;
    const nextDocId = (opts && opts.docId) || null;
    if (next === mode && nextDocId === docId) return;
    mode = next;
    docId = nextDocId;
    if (mode === 'doc') {
      document.body.classList.add('docs-r6-chrome-doc-active');
    } else {
      document.body.classList.remove('docs-r6-chrome-doc-active');
    }
    notify();
  }

  function findR5BackButton() {
    return document.querySelector('[data-shell-view="doc"] span[title="Back to docs"]');
  }

  function backToHome() {
    const el = findR5BackButton();
    if (el && typeof el.click === 'function') {
      el.click();
    } else {
      // Fallback: just toggle our chrome state. The R5 shell may not be mounted
      // (e.g. user navigated away from studio) — chrome stays out of doc-mode.
      setChromeMode('home');
    }
  }

  // ── DOM observer for shell view changes ──────────────────────────
  function readShellView() {
    const el = document.querySelector('[data-shell-view]');
    if (!el) return null;
    return el.getAttribute('data-shell-view');
  }

  function syncFromShell() {
    const view = readShellView();
    if (view === 'doc') {
      const docEl = document.querySelector('[data-shell-view="doc"]');
      const id = (docEl && docEl.getAttribute('data-active-doc-id')) || null;
      setChromeMode('doc', { docId: id });
    } else if (view === 'home' || view == null) {
      setChromeMode('home');
    }
  }

  function bootObserver() {
    if (!document.body) {
      requestAnimationFrame(bootObserver);
      return;
    }
    const observer = new MutationObserver(() => {
      // Coarse-grained: any DOM mutation triggers a sync. Cheap because
      // syncFromShell does a single querySelector and a class-toggle.
      syncFromShell();
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-shell-view', 'data-active-doc-id'],
    });
    syncFromShell();
  }

  // ── Toolbar component ─────────────────────────────────────────────
  // NOTE: this component renders into a portal at document.body, OUTSIDE the
  // MasterStateProvider tree. Do NOT call useMasterState() here — it would
  // throw because the context is null. Use the window toast bridge instead.
  function HF_DocsR6Toolbar() {
    const [m, setM] = React.useState(mode);
    const [d, setD] = React.useState(docId);
    const [compact, setCompact] = React.useState(false);

    React.useEffect(() => {
      const cb = (nextMode, nextDocId) => { setM(nextMode); setD(nextDocId); };
      listeners.add(cb);
      return () => { listeners.delete(cb); };
    }, []);

    // Scroll detection — walk up from the contentEditable to find the
    // closest ancestor that actually scrolls (R5's shell wraps the editable
    // in an unnamed flex column with overflow: auto). When scrolled past
    // the heading zone (~140px sentinel) the toolbar collapses to compact.
    React.useEffect(() => {
      if (m !== 'doc') { setCompact(false); return; }
      const SCROLL_THRESHOLD = 140;
      let ticking = false;
      let scroller = null;
      let scheduledHandler = null;

      function findScroller() {
        const ed = document.querySelector('[data-shell-view="doc"] [contenteditable="true"]');
        if (!ed) return null;
        let cur = ed.parentElement;
        while (cur && cur !== document.body) {
          const cs = window.getComputedStyle(cur);
          if ((cs.overflowY === 'auto' || cs.overflowY === 'scroll') && cur.scrollHeight > cur.clientHeight + 4) {
            return cur;
          }
          cur = cur.parentElement;
        }
        return document.scrollingElement || document.documentElement;
      }

      function update() {
        ticking = false;
        if (!scroller) return;
        const top = scroller.scrollTop || 0;
        setCompact(top > SCROLL_THRESHOLD);
      }
      function schedule() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(update);
      }

      // Wait for the doc-mode DOM to stabilize before attaching, since the
      // shell mounts asynchronously after the chrome state flips.
      let attachAttempts = 0;
      function attach() {
        scroller = findScroller();
        if (!scroller || (scroller.scrollHeight <= scroller.clientHeight + 4)) {
          if (attachAttempts++ < 20) {
            setTimeout(attach, 100);
          }
          return;
        }
        scheduledHandler = schedule;
        scroller.addEventListener('scroll', scheduledHandler, { passive: true });
        schedule();
      }
      attach();

      return () => {
        if (scroller && scheduledHandler) {
          scroller.removeEventListener('scroll', scheduledHandler);
        }
      };
    }, [m, d]);

    const docMeta = React.useMemo(() => {
      const docs = window.R5H_DOCS || [];
      return docs.find(x => x.id === d) || null;
    }, [d]);

    const eyebrow = (docMeta && docMeta.eyebrow) || 'Docs';
    const title = (docMeta && docMeta.title) || '';
    const italicTail = (docMeta && docMeta.italicTail) || '';

    function handleAction(action) {
      const toaster =
        window.__DOCS_R6_PUSH_TOAST ||
        ((t) => { try { console.log(t); } catch (e) { /* ignore */ } });
      toaster('R6 toolbar · ' + action + ' · phase-2');
    }

    const fontMono = 'var(--font-mono)';
    const fontSans = 'var(--font-sans)';
    const fontSerif = 'var(--font-serif)';

    // Build a tight breadcrumb for compact mode (e.g. "Truk Lagoon · The Fujikawa")
    const compactCrumb = (() => {
      const lead = (eyebrow || '').split(' · ')[0] || eyebrow || '';
      if (title && lead) return lead + ' · ' + title;
      if (title) return title;
      return eyebrow || 'Docs';
    })();

    return (
      <div
        className={'docs-r6-toolbar' + (compact ? ' is-compact' : '')}
        aria-hidden={m !== 'doc'}>
        {/* Back chevron */}
        <span
          onClick={backToHome}
          title="Back to Docs home"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            height: 30, padding: '0 11px 0 9px',
            border: '1px solid var(--border-subtle)',
            borderRadius: 8, cursor: 'pointer',
            fontFamily: fontMono, fontSize: 9.5, fontWeight: 600,
            letterSpacing: '0.10em', textTransform: 'uppercase',
            color: 'var(--fg-secondary)', background: 'var(--surface-1)',
            transition: 'background 120ms, color 120ms, border-color 120ms',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--surface-2)';
            e.currentTarget.style.color = 'var(--fg-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--surface-1)';
            e.currentTarget.style.color = 'var(--fg-secondary)';
          }}
        >
          <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true">
            <path d="M8 2 L4 6 L8 10" stroke="currentColor" strokeWidth="1.4"
              fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Docs
        </span>

        <span style={{ width: 1, height: 18, background: 'var(--border-subtle)', flexShrink: 0 }} />

        {/* Compact crumb — only visible in compact mode */}
        <span className="docs-r6-toolbar-compact-crumb" title={compactCrumb}>
          {compactCrumb}
        </span>

        {/* Eyebrow + title — visible in expanded mode */}
        <div className="docs-r6-toolbar-title-pair">
          <span style={{
            fontFamily: fontMono, fontSize: 9.5, fontWeight: 600,
            letterSpacing: '0.10em', textTransform: 'uppercase',
            color: 'var(--fg-tertiary)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            maxWidth: 200,
            flexShrink: 1,
          }}>{eyebrow}</span>
          {title && (
            <span style={{
              fontFamily: fontSerif, fontSize: 14, fontStyle: 'italic',
              color: 'var(--fg-primary)', lineHeight: 1.1,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              minWidth: 0,
              flexShrink: 1,
            }}>
              {title}
              {italicTail && (
                <span style={{ color: 'var(--fg-tertiary)', marginLeft: 4 }}>
                  {italicTail}
                </span>
              )}
            </span>
          )}
        </div>

        <span style={{ flex: 1 }} />

        {/* Right tools — visual placeholders for Wave 2 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {[
            { label: 'Format',  glyph: <svg width="13" height="13" viewBox="0 0 14 14" aria-hidden="true"><path d="M3 4 L11 4 M3 7 L9 7 M3 10 L11 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg> },
            { label: 'Insert',  glyph: <svg width="13" height="13" viewBox="0 0 14 14" aria-hidden="true"><line x1="7" y1="3" x2="7" y2="11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><line x1="3" y1="7" x2="11" y2="7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg> },
            { label: 'Version', glyph: <svg width="13" height="13" viewBox="0 0 14 14" aria-hidden="true"><circle cx="4" cy="4" r="1.6" fill="none" stroke="currentColor" strokeWidth="1.2"/><circle cx="10" cy="10" r="1.6" fill="none" stroke="currentColor" strokeWidth="1.2"/><path d="M4 5.6 Q4 10 9 10" fill="none" stroke="currentColor" strokeWidth="1.2"/></svg> },
            { label: 'Share',   glyph: <svg width="13" height="13" viewBox="0 0 14 14" aria-hidden="true"><circle cx="3.5" cy="7" r="1.6" fill="none" stroke="currentColor" strokeWidth="1.2"/><circle cx="10.5" cy="3.5" r="1.6" fill="none" stroke="currentColor" strokeWidth="1.2"/><circle cx="10.5" cy="10.5" r="1.6" fill="none" stroke="currentColor" strokeWidth="1.2"/><line x1="5" y1="6.2" x2="9" y2="4.3" stroke="currentColor" strokeWidth="1.2"/><line x1="5" y1="7.8" x2="9" y2="9.7" stroke="currentColor" strokeWidth="1.2"/></svg> },
          ].map(t => (
            <span
              key={t.label}
              className="docs-r6-toolbar-tool"
              onClick={() => handleAction(t.label)}
              title={t.label}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                height: 28, padding: '0 11px',
                border: '1px solid transparent',
                borderRadius: 7, cursor: 'pointer',
                fontFamily: fontSans, fontSize: 12, fontWeight: 500,
                color: 'var(--fg-secondary)',
                transition: 'background 100ms, color 100ms, border-color 100ms',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--surface-2)';
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.color = 'var(--fg-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.color = 'var(--fg-secondary)';
              }}
            >
              {t.glyph}
              <span className="docs-r6-toolbar-tool-label">{t.label}</span>
            </span>
          ))}
          <span style={{ width: 1, height: 18, background: 'var(--border-subtle)', margin: '0 4px' }} />
          <span
            onClick={() => handleAction('Overflow')}
            title="More"
            style={{
              width: 28, height: 28, display: 'inline-flex',
              alignItems: 'center', justifyContent: 'center',
              borderRadius: 7, cursor: 'pointer',
              color: 'var(--fg-tertiary)',
              transition: 'background 100ms, color 100ms',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--surface-2)';
              e.currentTarget.style.color = 'var(--fg-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--fg-tertiary)';
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <circle cx="3" cy="7" r="1.2" fill="currentColor"/>
              <circle cx="7" cy="7" r="1.2" fill="currentColor"/>
              <circle cx="11" cy="7" r="1.2" fill="currentColor"/>
            </svg>
          </span>
        </div>
      </div>
    );
  }

  // ── MasterState bridge ───────────────────────────────────────────
  // A null-rendering hook component that bridges DOM-level R6 events to
  // the React MasterStateProvider context. Mount inside the provider tree
  // (hifi-master.jsx HF_Master). Wires:
  //   1. window.__DOCS_R6_PUSH_TOAST = ctx.pushToast    (toolbar buttons + toasts)
  //   2. 'docs-r6-new-doc' event → ctx.pushModal('ModalNewDoc', {})
  //   3. 'docs-r6-open-doc' event → routes through R5 home card click; if
  //      we're already in doc, navigate back to home first then click the
  //      target card on the next tick.
  function HF_DocsR6ToolbarHook() {
    const ctx = window.useMasterState ? window.useMasterState() : null;
    React.useEffect(() => {
      if (!ctx) return;
      if (ctx.pushToast) {
        window.__DOCS_R6_PUSH_TOAST = ctx.pushToast;
      }
      function onNewDoc() {
        if (ctx.pushModal) ctx.pushModal('ModalNewDoc', {});
        else if (ctx.pushToast) ctx.pushToast('Modal · ModalNewDoc · not registered');
      }
      function onOpenDoc(e) {
        const docId = e && e.detail && e.detail.id || (e && e.detail && e.detail.docId);
        if (!docId) return;
        function tryOpen() {
          // Fast path: if the home has exposed its onOpen prop, call it
          // directly. Works for any doc id including child branches.
          if (typeof window.__DOCS_R6_HOME_OPEN_DOC === 'function') {
            window.__DOCS_R6_HOME_OPEN_DOC(docId);
            return true;
          }
          // Fallback: click a top-level card with this id (won't work for
          // child branches that aren't expanded, hence the fast path above).
          const card = document.querySelector('[data-r6-doc-id="' + docId + '"]');
          if (card) { card.click(); return true; }
          return false;
        }
        if (mode === 'doc') {
          // Exit doc-mode first so the home view mounts, then call onOpen
          // on the next animation frame.
          backToHome();
          let tries = 0;
          const tick = () => {
            if (tryOpen() || tries++ > 30) return;
            requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        } else {
          if (!tryOpen()) {
            let tries = 0;
            const tick = () => {
              if (tryOpen() || tries++ > 30) return;
              requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }
        }
      }
      document.addEventListener('docs-r6-new-doc', onNewDoc);
      document.addEventListener('docs-r6-open-doc', onOpenDoc);
      return () => {
        document.removeEventListener('docs-r6-new-doc', onNewDoc);
        document.removeEventListener('docs-r6-open-doc', onOpenDoc);
      };
    }, [ctx]);
    return null;
  }

  // ── Mount ─────────────────────────────────────────────────────────
  function mount() {
    if (!document.body) {
      requestAnimationFrame(mount);
      return;
    }
    if (typeof React === 'undefined' || typeof ReactDOM === 'undefined' || !ReactDOM.createRoot) {
      requestAnimationFrame(mount);
      return;
    }
    injectCSS();
    let host = document.getElementById('docs-r6-chrome-host');
    if (!host) {
      host = document.createElement('div');
      host.id = 'docs-r6-chrome-host';
      document.body.appendChild(host);
    }
    const root = ReactDOM.createRoot(host);
    root.render(<HF_DocsR6Toolbar />);
    bootObserver();
  }
  mount();

  // ── ESC handler ──────────────────────────────────────────────────
  document.addEventListener('keydown', (e) => {
    if (mode !== 'doc') return;
    if (e.key !== 'Escape') return;
    const t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
    backToHome();
  });

  // ── Public API ───────────────────────────────────────────────────
  Object.assign(window, {
    docsR6SetChromeMode: setChromeMode,
    docsR6OnChromeModeChange: (cb) => {
      if (typeof cb !== 'function') return () => {};
      listeners.add(cb);
      return () => { listeners.delete(cb); };
    },
    docsR6BackToHome: backToHome,
    docsR6GetChromeMode: () => ({ mode, docId }),
    HF_DocsR6Toolbar,
    HF_DocsR6ToolbarHook,
  });
})();
