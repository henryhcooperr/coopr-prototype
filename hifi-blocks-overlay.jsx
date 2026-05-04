/* global React, ReactDOM, window, document, requestAnimationFrame, IntersectionObserver */
/* hifi-blocks-overlay.jsx — Blocks Reference overlay (2026-05-03).

   A self-mounting full-bleed overlay that scrolls through every R4
   in-thread block family in sequence — a "library card" view of all
   17 family components rendered at canonical 1440 width, with a
   sticky family-selector chip strip that scroll-spies the active
   family via IntersectionObserver.

   Mirrors the structural pattern of hifi-design-system-overlay.jsx
   exactly: same IIFE boot guard, same self-mount portal, same
   220ms ease-out animation, same ESC + click-outside dismiss.

   Opens via the R9 corner menu item "Blocks · reference" (wired in
   hifi-master-interactive-view.jsx → MasterCornerMenu).

   Public API (window.HF_BlocksOverlay):
     .open(familyId?)   — show overlay; optional family ID jumps to that family
     .close()           — hide overlay
     .isOpen()          — boolean current state
     .subscribe(cb)     — listener for state changes; returns unsubscribe

   Boot pattern: matches hifi-design-system-overlay.jsx — boot guard on
   window.__BLOCKS_OVERLAY_BOOTED__, self-mount via
   document.body.appendChild + ReactDOM.createRoot. NO MutationObservers
   (Pattern 7 hard rule). IntersectionObserver is used for the
   scroll-spy chip strip ONLY (it's a different API; no infinite-loop
   risk). */

(function () {
  'use strict';
  if (window.__BLOCKS_OVERLAY_BOOTED__) return;
  window.__BLOCKS_OVERLAY_BOOTED__ = true;

  const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

  // ── State channel ──────────────────────────────────────────────────
  let isOpen = false;
  let pendingFamilyId = null;
  const listeners = new Set();
  function emit() {
    listeners.forEach((cb) => {
      try { cb(isOpen); } catch (_) { /* ignore */ }
    });
  }
  function open(familyId) {
    if (typeof familyId === 'string' && familyId.length) pendingFamilyId = familyId;
    if (isOpen) {
      // Already open — still re-emit so a fresh jump can happen.
      emit();
      return;
    }
    isOpen = true;
    emit();
  }
  function close() {
    if (!isOpen) return;
    isOpen = false;
    pendingFamilyId = null;
    emit();
  }
  function subscribe(cb) {
    if (typeof cb !== 'function') return () => {};
    listeners.add(cb);
    return () => { listeners.delete(cb); };
  }

  // ── Helpers ────────────────────────────────────────────────────────
  function readFamilies() {
    const reg = window.SURFACE_REGISTRY;
    if (!reg || !reg.blocks || !Array.isArray(reg.blocks.subs)) return [];
    return reg.blocks.subs;
  }
  function familySlug(id) {
    return String(id || '')
      .trim()
      .toLowerCase()
      .replace(/·/g, '-')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]+/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  // ── Component ──────────────────────────────────────────────────────
  function HF_BlocksOverlayComponent() {
    const [open_, setOpen_] = React.useState(isOpen);
    const [mounted, setMounted] = React.useState(isOpen);
    const [shown, setShown] = React.useState(false);
    const [families, setFamilies] = React.useState(() => readFamilies());
    const [activeId, setActiveId] = React.useState(null);
    const bodyRef = React.useRef(null);
    const sectionRefs = React.useRef({});
    const chipRefs = React.useRef({});

    React.useEffect(() => {
      const unsub = subscribe((next) => {
        setOpen_(next);
        if (next) {
          // Re-read registry on each open in case it was populated late.
          setFamilies(readFamilies());
        }
      });
      return unsub;
    }, []);

    // Mount/unmount + animation phase coordination.
    React.useEffect(() => {
      if (open_) {
        setMounted(true);
        const r1 = requestAnimationFrame(() => {
          requestAnimationFrame(() => setShown(true));
        });
        return () => cancelAnimationFrame(r1);
      }
      setShown(false);
      const t = setTimeout(() => setMounted(false), 240);
      return () => clearTimeout(t);
    }, [open_]);

    // ESC handler — only when overlay is open and focus is not in editable.
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
      document.addEventListener('keydown', onKey, true);
      return () => document.removeEventListener('keydown', onKey, true);
    }, [open_]);

    // Default active to first family on open.
    React.useEffect(() => {
      if (!open_ || !families.length) return;
      setActiveId((cur) => cur || families[0].id);
    }, [open_, families]);

    // Honor pending jump-to-family on open.
    React.useEffect(() => {
      if (!shown || !pendingFamilyId) return;
      const target = sectionRefs.current[pendingFamilyId];
      if (target && bodyRef.current) {
        // Scroll into view inside the overlay body, no smooth (instant on open).
        try {
          target.scrollIntoView({ block: 'start', behavior: 'auto' });
        } catch (_) { /* ignore */ }
        setActiveId(pendingFamilyId);
      }
      pendingFamilyId = null;
    }, [shown, families]);

    // IntersectionObserver — scroll-spy active chip.
    React.useEffect(() => {
      if (!shown || !bodyRef.current || !families.length) return undefined;
      const root = bodyRef.current;
      const seen = new Map();
      let raf = 0;
      function pick() {
        // Choose the entry with the smallest positive top relative to root.
        let bestId = null;
        let bestTop = Infinity;
        seen.forEach((rect, id) => {
          if (!rect) return;
          // Use top relative to viewport of the scroll container.
          const top = rect.top;
          if (top <= 80 && top > -1 * (rect.height || 0)) {
            // Section header is at or above the spy line and not fully past.
            // We want the one with the largest (least-negative) top under the line.
            if (Math.abs(top) < bestTop || bestId === null) {
              bestTop = Math.abs(top);
              bestId = id;
            }
          }
        });
        if (!bestId) {
          // Fallback: closest to the top edge.
          let closest = null;
          let closestDist = Infinity;
          seen.forEach((rect, id) => {
            if (!rect) return;
            const dist = Math.abs(rect.top);
            if (dist < closestDist) { closestDist = dist; closest = id; }
          });
          bestId = closest;
        }
        if (bestId) setActiveId(bestId);
      }
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const id = entry.target && entry.target.dataset && entry.target.dataset.familyId;
          if (!id) return;
          seen.set(id, entry.boundingClientRect);
        });
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(pick);
      }, {
        root,
        // Header band: top 0..120px of the body acts as the spy line.
        rootMargin: '0px 0px -80% 0px',
        threshold: [0, 0.01, 0.5, 1],
      });
      families.forEach((fam) => {
        const el = sectionRefs.current[fam.id];
        if (el) io.observe(el);
      });
      return () => {
        io.disconnect();
        if (raf) cancelAnimationFrame(raf);
      };
    }, [shown, families]);

    // Auto-scroll the chip strip to keep the active chip visible.
    React.useEffect(() => {
      if (!activeId) return;
      const chip = chipRefs.current[activeId];
      if (chip && typeof chip.scrollIntoView === 'function') {
        try {
          chip.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
        } catch (_) { /* ignore */ }
      }
    }, [activeId]);

    if (!mounted) return null;

    function onBackdropClick(e) {
      if (e.target === e.currentTarget) close();
    }

    function jumpToFamily(id) {
      const target = sectionRefs.current[id];
      if (target) {
        try {
          target.scrollIntoView({ block: 'start', behavior: 'smooth' });
        } catch (_) { /* ignore */ }
      }
      setActiveId(id);
    }

    return (
      React.createElement('div', {
        role: 'dialog',
        'aria-modal': 'true',
        'aria-label': 'Blocks reference',
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
            maxWidth: 1480,
            height: '92vh',
            maxHeight: '92vh',
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--surface-1)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 14,
            overflow: 'hidden',
            boxShadow: '0 24px 56px -20px rgba(26,24,21,0.32), 0 6px 18px -8px rgba(26,24,21,0.16), 0 1px 0 rgba(253,252,249,0.7) inset',
            transform: shown ? 'scale(1)' : 'scale(0.97)',
            opacity: shown ? 1 : 0,
            transition: `transform 220ms ${EASE}, opacity 220ms ${EASE}`,
          },
        },
          // ── Toolbar (52px) ────────────────────────────────────────
          React.createElement('div', {
            style: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 14,
              height: 52,
              padding: '0 16px',
              borderBottom: '1px solid var(--border-subtle)',
              background: 'var(--surface-1)',
              flexShrink: 0,
            },
          },
            // Left — close button (mirror design-system overlay)
            React.createElement('span', {
              role: 'button',
              tabIndex: 0,
              onClick: close,
              onKeyDown: (e) => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); close(); }
              },
              title: 'Close blocks reference',
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
            }, 'Blocks Reference · In-Thread Library'),
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
          // ── Family selector strip (40px) ─────────────────────────
          React.createElement('div', {
            style: {
              height: 40,
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '0 16px',
              borderBottom: '1px solid var(--border-subtle)',
              background: 'var(--surface-1)',
              overflowX: 'auto',
              overflowY: 'hidden',
              whiteSpace: 'nowrap',
              scrollbarWidth: 'thin',
            },
          },
            families.length
              ? families.map((fam) => {
                const active = fam.id === activeId;
                return React.createElement('span', {
                  key: fam.id,
                  ref: (n) => { if (n) chipRefs.current[fam.id] = n; },
                  role: 'button',
                  tabIndex: 0,
                  onClick: () => jumpToFamily(fam.id),
                  onKeyDown: (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      jumpToFamily(fam.id);
                    }
                  },
                  style: {
                    display: 'inline-flex',
                    alignItems: 'center',
                    height: 26,
                    padding: '0 10px',
                    borderRadius: 6,
                    cursor: 'pointer',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 9.5,
                    fontWeight: 600,
                    letterSpacing: '0.10em',
                    textTransform: 'uppercase',
                    color: active ? 'var(--accent-primary)' : 'var(--fg-tertiary)',
                    background: active ? 'var(--accent-soft)' : 'transparent',
                    border: '1px solid ' + (active ? 'color-mix(in srgb, var(--accent-primary) 22%, transparent)' : 'transparent'),
                    transition: `background 140ms ${EASE}, color 140ms ${EASE}, border-color 140ms ${EASE}`,
                    userSelect: 'none',
                    flexShrink: 0,
                  },
                }, fam.id);
              })
              : React.createElement('span', {
                style: {
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--fg-tertiary)',
                },
              }, 'Registry not loaded')
          ),
          // ── Body ──────────────────────────────────────────────────
          React.createElement('div', {
            ref: bodyRef,
            style: {
              flex: '1 1 auto',
              minHeight: 0,
              overflowY: 'auto',
              overflowX: 'auto',
              background: 'var(--bg-base)',
              padding: '24px 24px 96px',
            },
          },
            families.length === 0
              ? React.createElement('div', {
                style: {
                  padding: 32,
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  letterSpacing: '0.10em',
                  textTransform: 'uppercase',
                  color: 'var(--fg-tertiary)',
                  border: '1px dashed var(--border-subtle)',
                  borderRadius: 10,
                  background: 'var(--surface-1)',
                },
              }, 'Block registry not yet loaded · check master.html script order')
              : families.map((fam) => {
                const Comp = window[fam.component];
                const slug = familySlug(fam.id);
                return React.createElement('section', {
                  key: fam.id,
                  ref: (n) => { if (n) sectionRefs.current[fam.id] = n; },
                  'data-family-id': fam.id,
                  'data-family-slug': slug,
                  style: {
                    marginBottom: 48,
                    scrollMarginTop: 12,
                  },
                },
                  // Section header
                  React.createElement('div', {
                    style: {
                      display: 'flex',
                      alignItems: 'baseline',
                      justifyContent: 'space-between',
                      gap: 16,
                      padding: '0 0 10px',
                      marginBottom: 16,
                      borderBottom: '1px solid var(--border-subtle)',
                    },
                  },
                    React.createElement('span', {
                      style: {
                        fontFamily: 'var(--font-mono)',
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: '0.16em',
                        textTransform: 'uppercase',
                        color: 'var(--fg-primary)',
                      },
                    }, fam.id),
                    React.createElement('span', {
                      style: {
                        fontFamily: 'var(--font-mono)',
                        fontSize: 9.5,
                        fontWeight: 500,
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        color: 'var(--fg-tertiary)',
                      },
                    }, (fam.kicker || '') + (fam.component ? '  ·  ' + fam.component : ''))
                  ),
                  // Section body — render component at canonical 1440 width.
                  typeof Comp === 'function'
                    ? React.createElement('div', {
                      style: {
                        transformOrigin: 'top left',
                        minWidth: 1440,
                      },
                    },
                      React.createElement(Comp, null)
                    )
                    : React.createElement('div', {
                      style: {
                        padding: 24,
                        fontFamily: 'var(--font-mono)',
                        fontSize: 11,
                        letterSpacing: '0.10em',
                        textTransform: 'uppercase',
                        color: 'var(--fg-tertiary)',
                        border: '1px dashed var(--border-subtle)',
                        borderRadius: 10,
                        background: 'var(--surface-1)',
                      },
                    }, fam.id + ' not loaded · check master.html script order')
                );
              })
          )
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
    let host = document.getElementById('hf-blocks-overlay-host');
    if (!host) {
      host = document.createElement('div');
      host.id = 'hf-blocks-overlay-host';
      document.body.appendChild(host);
    }
    const root = ReactDOM.createRoot(host);
    root.render(React.createElement(HF_BlocksOverlayComponent));
  }
  mount();

  // ── Public API ─────────────────────────────────────────────────────
  window.HF_BlocksOverlay = {
    open,
    close,
    isOpen: () => isOpen,
    subscribe,
  };
})();
