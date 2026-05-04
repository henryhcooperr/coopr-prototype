/* global React, ReactDOM, window, document, requestAnimationFrame */
/* hifi-design-system-overlay.jsx — R10 Bring-Over · C1 worker (2026-05-04).

   A self-mounting full-bleed overlay that opens an <iframe> over
   `design-system/index.html` so any prototype surface can pop the
   canonical token / type / component reference without leaving master.

   Opens via the R9 corner menu item "Design System · reference"
   (wired in hifi-master-interactive-view.jsx → MasterCornerMenu).

   Public API (window.HF_DesignSystemOverlay):
     .open()            — show overlay
     .close()           — hide overlay
     .isOpen()          — boolean current state
     .subscribe(cb)     — listener for state changes; returns unsubscribe

   Boot pattern: matches hifi-docs-r6-chrome.jsx — boot guard on
   window.__DESIGN_SYSTEM_OVERLAY_BOOTED__, self-mount via
   document.body.appendChild + ReactDOM.createRoot. NO MutationObservers
   (Pattern 7 hard rule — direct appendChild only). */

(function () {
  'use strict';
  if (window.__DESIGN_SYSTEM_OVERLAY_BOOTED__) return;
  window.__DESIGN_SYSTEM_OVERLAY_BOOTED__ = true;

  const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

  // ── State channel ──────────────────────────────────────────────────
  let isOpen = false;
  const listeners = new Set();
  function emit() {
    listeners.forEach((cb) => {
      try { cb(isOpen); } catch (_) { /* ignore */ }
    });
  }
  function open() {
    if (isOpen) return;
    isOpen = true;
    emit();
  }
  function close() {
    if (!isOpen) return;
    isOpen = false;
    emit();
  }
  function subscribe(cb) {
    if (typeof cb !== 'function') return () => {};
    listeners.add(cb);
    return () => { listeners.delete(cb); };
  }

  // ── Component ──────────────────────────────────────────────────────
  function HF_DesignSystemOverlayComponent() {
    const [open_, setOpen_] = React.useState(isOpen);
    const [mounted, setMounted] = React.useState(isOpen);
    const [shown, setShown] = React.useState(false);

    React.useEffect(() => {
      const unsub = subscribe((next) => setOpen_(next));
      return unsub;
    }, []);

    // Mount/unmount + animation phase coordination.
    React.useEffect(() => {
      if (open_) {
        setMounted(true);
        // Two RAFs: one to commit the mount + initial styles, one to
        // flip to the visible state so transitions actually run.
        const r1 = requestAnimationFrame(() => {
          requestAnimationFrame(() => setShown(true));
        });
        return () => cancelAnimationFrame(r1);
      }
      // Closing: drop visible state, then unmount after the transition.
      setShown(false);
      const t = setTimeout(() => setMounted(false), 240);
      return () => clearTimeout(t);
    }, [open_]);

    // ESC handler — only when overlay is open and focus is not in an
    // editable element. Skip if a modal of higher z-index is also open.
    React.useEffect(() => {
      if (!open_) return undefined;
      function onKey(e) {
        if (e.key !== 'Escape') return;
        const t = e.target;
        if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
        e.stopPropagation();
        e.preventDefault();
        close();
      }
      // Capture so we win over canvas-level Esc ladders.
      document.addEventListener('keydown', onKey, true);
      return () => document.removeEventListener('keydown', onKey, true);
    }, [open_]);

    if (!mounted) return null;

    function onBackdropClick(e) {
      if (e.target === e.currentTarget) close();
    }

    return (
      React.createElement('div', {
        role: 'dialog',
        'aria-modal': 'true',
        'aria-label': 'Design system reference',
        onClick: onBackdropClick,
        style: {
          position: 'fixed',
          inset: 0,
          zIndex: 14,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          background: 'color-mix(in srgb, var(--surface-0) 88%, transparent)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          opacity: shown ? 1 : 0,
          transition: `opacity 220ms ${EASE}`,
          pointerEvents: shown ? 'auto' : 'none',
        },
      },
        React.createElement('div', {
          role: 'document',
          style: {
            width: '100%',
            maxWidth: 1200,
            height: '90vh',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--surface-1)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 14,
            overflow: 'hidden',
            boxShadow: '0 24px 56px -20px rgba(26,24,21,0.32), 0 6px 18px -8px rgba(26,24,21,0.16), 0 1px 0 rgba(253,252,249,0.7) inset',
            transform: shown ? 'scale(1)' : 'scale(0.96)',
            opacity: shown ? 1 : 0,
            transition: `transform 220ms ${EASE}, opacity 220ms ${EASE}`,
          },
        },
          // ── Toolbar ───────────────────────────────────────────────
          React.createElement('div', {
            style: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 14,
              padding: '12px 16px',
              borderBottom: '1px solid var(--border-subtle)',
              background: 'var(--surface-1)',
              flexShrink: 0,
            },
          },
            // Left — close button (R6 doc-toolbar back chevron pattern)
            React.createElement('span', {
              role: 'button',
              tabIndex: 0,
              onClick: close,
              onKeyDown: (e) => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); close(); }
              },
              title: 'Close design system reference',
              style: {
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                height: 30,
                padding: '0 11px 0 9px',
                border: '1px solid var(--border-subtle)',
                borderRadius: 8,
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                fontSize: 9.5,
                fontWeight: 600,
                letterSpacing: '0.10em',
                textTransform: 'uppercase',
                color: 'var(--fg-secondary)',
                background: 'var(--surface-1)',
                transition: 'background 120ms, color 120ms, border-color 120ms',
                userSelect: 'none',
              },
              onMouseEnter: (e) => {
                e.currentTarget.style.background = 'var(--surface-2)';
                e.currentTarget.style.color = 'var(--fg-primary)';
              },
              onMouseLeave: (e) => {
                e.currentTarget.style.background = 'var(--surface-1)';
                e.currentTarget.style.color = 'var(--fg-secondary)';
              },
            },
              React.createElement('svg', {
                width: 11, height: 11, viewBox: '0 0 12 12', 'aria-hidden': 'true',
              },
                React.createElement('path', {
                  d: 'M8 2 L4 6 L8 10',
                  stroke: 'currentColor',
                  strokeWidth: 1.4,
                  fill: 'none',
                  strokeLinecap: 'round',
                  strokeLinejoin: 'round',
                })
              ),
              'Close'
            ),
            // Center — eyebrow
            React.createElement('span', {
              style: {
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--fg-tertiary)',
                whiteSpace: 'nowrap',
              },
            }, 'Design System Reference'),
            // Right — ESC key hint
            React.createElement('span', {
              style: {
                display: 'inline-flex',
                alignItems: 'center',
                height: 22,
                padding: '0 8px',
                border: '1px solid var(--border-default)',
                borderRadius: 4,
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '0.10em',
                textTransform: 'uppercase',
                color: 'var(--fg-secondary)',
                background: 'var(--surface-2)',
                userSelect: 'none',
              },
              'aria-label': 'Press Escape to close',
            }, 'ESC')
          ),
          // ── Body iframe ───────────────────────────────────────────
          React.createElement('iframe', {
            src: 'design-system/index.html',
            title: 'COOPR design system reference',
            style: {
              flex: '1 1 auto',
              width: '100%',
              minHeight: 0,
              border: 'none',
              background: 'var(--bg-base)',
              display: 'block',
            },
          })
        )
      )
    );
  }

  // ── Mount ──────────────────────────────────────────────────────────
  function mount() {
    if (!document.body) {
      requestAnimationFrame(mount);
      return;
    }
    if (typeof React === 'undefined' || typeof ReactDOM === 'undefined' || !ReactDOM.createRoot) {
      requestAnimationFrame(mount);
      return;
    }
    let host = document.getElementById('hf-design-system-overlay-host');
    if (!host) {
      host = document.createElement('div');
      host.id = 'hf-design-system-overlay-host';
      document.body.appendChild(host);
    }
    const root = ReactDOM.createRoot(host);
    root.render(React.createElement(HF_DesignSystemOverlayComponent));
  }
  mount();

  // ── Public API ─────────────────────────────────────────────────────
  window.HF_DesignSystemOverlay = {
    open,
    close,
    isOpen: () => isOpen,
    subscribe,
  };
})();
