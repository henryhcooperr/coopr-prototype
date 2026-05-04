/* global React, window */
/* hifi-master-router.jsx — URL hash router + MasterState context.

   Master state shape:
     { mode: 'layout' | 'interactive',
       activeSurface: { ws, sub, detail?: { kind, id } },
       lastInteractive: { ws, sub, detail?: { kind, id } }
     }

   `detail` is the optional drill-in descriptor. When unset (undefined), the
   surface renders its index. When set, the surface receives the descriptor
   as a prop and renders its drill-in view. The router only routes the
   descriptor — it does not validate kind or id; D-arms register the kinds.

   URL hash protocol:
     #                                          → interactive · MASTER_ENTRY
     #layout                                    → layout · no specific surface highlighted
     #layout/<ws>/<sub>                         → layout · highlight + scroll-to artboard
     #interactive                               → interactive · MASTER_ENTRY
     #interactive/<ws>/<sub>                    → interactive · render that surface (index)
     #interactive/<ws>/<sub>/<kind>/<id>        → interactive · render with detail descriptor

   Bidirectional:
     - On boot (and on every hashchange) hash → state.
     - On every state mutation hash → updated (replaceState — no history spam).

   Persistence:
     - localStorage key 'cv-master-mode' remembers the last mode across reloads.
       On boot, IF no explicit mode in the hash, fall back to localStorage,
       THEN to 'interactive' (spec acceptance #1).

   Sub-id encoding: subtabs may contain spaces (e.g. "Format DNA" or
   "Clip Lab"). Encode/decode with encodeURIComponent so the hash stays
   round-trippable. The same encoding applies to `kind` and `id`. */

const LS_KEY = 'cv-master-mode';
const HASH_FALLBACK_MODE = 'interactive';

function readHash() {
  // Strip the leading '#'.
  const raw = (window.location.hash || '').replace(/^#/, '').trim();
  if (!raw) return null;
  const parts = raw.split('/').filter(Boolean);
  const mode = parts[0];
  if (mode !== 'layout' && mode !== 'interactive') return null;
  if (parts.length === 1) return { mode, ws: null, sub: null, detail: null };
  const canonicalWs = (ws) => (window.masterCanonicalWorkspace && window.masterCanonicalWorkspace(ws)) || ws;
  const canonicalSub = (ws, sub) => (window.masterCanonicalSub && window.masterCanonicalSub(ws, sub)) || sub;
  if (parts.length >= 5) {
    // Five-part hash: mode/ws/sub/kind/id. Detail descriptor is set.
    const ws = canonicalWs(decodeURIComponent(parts[1]));
    const sub = canonicalSub(ws, decodeURIComponent(parts[2]));
    return {
      mode,
      ws,
      sub,
      detail: {
        kind: decodeURIComponent(parts[3]),
        id:   decodeURIComponent(parts[4]),
      },
    };
  }
  if (parts.length >= 3) {
    const ws = canonicalWs(decodeURIComponent(parts[1]));
    const sub = canonicalSub(ws, decodeURIComponent(parts[2]));
    return {
      mode,
      ws,
      sub,
      detail: null,
    };
  }
  // Two-part hash (e.g. #layout/insights) — partial. Treat ws as set, sub as null.
  return { mode, ws: canonicalWs(decodeURIComponent(parts[1])), sub: null, detail: null };
}

function writeHash(mode, ws, sub, detail) {
  const slug = window.masterRouteSlug || ((value) => String(value || '').trim());
  let next = '#' + mode;
  if (ws && sub) {
    next += '/' + encodeURIComponent(slug(ws)) + '/' + encodeURIComponent(slug(sub));
    if (detail && detail.kind && detail.id) {
      next += '/' + encodeURIComponent(slug(detail.kind)) + '/' + encodeURIComponent(detail.id);
    }
  } else if (ws) {
    next += '/' + encodeURIComponent(slug(ws));
  }
  if (window.location.hash !== next) {
    // replaceState avoids ballooning the history stack on every nav.
    history.replaceState(null, '', next);
  }
}

function readPersistedMode() {
  try {
    const m = window.localStorage.getItem(LS_KEY);
    if (m === 'layout' || m === 'interactive') return m;
  } catch (_) {
    // Private mode / disabled storage — fall through.
  }
  return null;
}

function writePersistedMode(mode) {
  try { window.localStorage.setItem(LS_KEY, mode); } catch (_) {}
}

function masterEntrySurface() {
  const ENTRY = window.MASTER_ENTRY || { ws: 'insights', sub: 'Overview' };
  return { ws: ENTRY.ws, sub: ENTRY.sub };
}

function masterHasSurface(surface) {
  return !!(surface && surface.ws && surface.sub);
}

function masterSurfaceFromHash(fromHash, fallbackSurface) {
  const entry = masterEntrySurface();
  if (!fromHash) return entry;
  if (fromHash.mode === 'layout' && (!fromHash.ws || !fromHash.sub)) {
    return { ws: fromHash.ws || null, sub: fromHash.sub || null };
  }
  const ws = fromHash.ws || (fallbackSurface && fallbackSurface.ws) || entry.ws;
  const sub = fromHash.sub || (ws && window.MASTER_DEFAULT_SUB && window.MASTER_DEFAULT_SUB[ws]) || (fallbackSurface && fallbackSurface.sub) || entry.sub;
  return fromHash.detail ? { ws, sub, detail: fromHash.detail } : { ws, sub };
}

// ─── Initial state resolution ───────────────────────────────
// Hash wins. Then localStorage. Then HASH_FALLBACK_MODE. `detail` is undefined
// unless the hash provided one (no persistence — drill-in is a transient view).
// `modalStack` is always seeded empty — modals are interrupting overlays and
// have no URL or persistence representation. F1 + D-arms register kinds onto
// `window['HF_' + kind]`; this arm registers zero kinds.
function resolveInitialState() {
  const fromHash = readHash();
  const ENTRY = masterEntrySurface();
  if (fromHash) {
    return {
      mode: fromHash.mode,
      activeSurface: masterSurfaceFromHash(fromHash, ENTRY),
      lastInteractive: ENTRY,
      modalStack: [],
    };
  }
  const persisted = readPersistedMode() || HASH_FALLBACK_MODE;
  return {
    mode: persisted,
    activeSurface: { ws: ENTRY.ws, sub: ENTRY.sub },
    lastInteractive: { ws: ENTRY.ws, sub: ENTRY.sub },
    modalStack: [],
  };
}

// ─── React context ──────────────────────────────────────────
const MasterStateCtx = React.createContext(null);

function useMasterState() {
  const v = React.useContext(MasterStateCtx);
  if (!v) throw new Error('useMasterState must be used inside MasterStateProvider');
  return v;
}

function MasterStateProvider({ children }) {
  const [state, setState] = React.useState(resolveInitialState);

  // Memoize action creators so consumers can use them as effect deps.
  // `lastInteractive` is intentionally tracked WITHOUT `detail` — it's a
  // workspace-coordinate memory for the layout-toggle, not a drill-in
  // memory. Re-entering interactive mode lands on the index, never on a
  // stale post detail.
  const actions = React.useMemo(() => ({
    setMode(mode) {
      setState(prev => {
        if (prev.mode === mode) return prev;
        const next = { ...prev, mode };
        if (mode === 'interactive') {
          const restored = masterHasSurface(prev.activeSurface)
            ? { ws: prev.activeSurface.ws, sub: prev.activeSurface.sub }
            : (masterHasSurface(prev.lastInteractive) ? prev.lastInteractive : masterEntrySurface());
          next.activeSurface = restored;
          next.lastInteractive = restored;
        }
        return next;
      });
    },
    toggleMode() {
      setState(prev => {
        if (prev.mode === 'layout') {
          const restored = masterHasSurface(prev.activeSurface)
            ? { ws: prev.activeSurface.ws, sub: prev.activeSurface.sub }
            : (masterHasSurface(prev.lastInteractive) ? prev.lastInteractive : masterEntrySurface());
          return {
            ...prev,
            mode: 'interactive',
            activeSurface: restored,
            lastInteractive: restored,
          };
        }
        return {
          ...prev,
          mode: 'layout',
          lastInteractive: masterHasSurface(prev.activeSurface)
            ? { ws: prev.activeSurface.ws, sub: prev.activeSurface.sub }
            : prev.lastInteractive,
        };
      });
    },
    setActiveSurface(ws, sub) {
      // Switching workspace or subtab clears any open detail — the
      // drill-in is by definition scoped to the prior surface.
      setState(prev => ({
        ...prev,
        activeSurface: { ws, sub },
        lastInteractive: prev.mode === 'interactive' ? { ws, sub } : prev.lastInteractive,
      }));
    },
    openSurfaceInInteractive(ws, sub) {
      setState(prev => ({
        ...prev,
        mode: 'interactive',
        activeSurface: { ws, sub },
        lastInteractive: { ws, sub },
      }));
    },
    setDetail(kind, id) {
      // No-op if the descriptor matches the current one (avoids re-renders
      // when callers redundantly re-set the same detail).
      setState(prev => {
        const cur = prev.activeSurface.detail;
        if (cur && cur.kind === kind && cur.id === id) return prev;
        return {
          ...prev,
          activeSurface: { ...prev.activeSurface, detail: { kind, id } },
        };
      });
    },
    clearDetail() {
      setState(prev => {
        if (!prev.activeSurface.detail) return prev;
        const { ws, sub } = prev.activeSurface;
        return {
          ...prev,
          activeSurface: { ws, sub },
        };
      });
    },
    // ─── Modal stack ───────────────────────────────────────────
    // pushModal(kind, props): push a new entry on top of the stack. The
    // top entry is what <MasterModalLayer> renders. Kinds are looked up
    // as window['HF_' + kind] at render time — this arm registers ZERO
    // kinds; F1 and the D-arms register them.
    pushModal(kind, props) {
      setState(prev => ({
        ...prev,
        modalStack: [...(prev.modalStack || []), { kind, props: props || {} }],
      }));
    },
    // popModal(): pop the top entry. No-op when the stack is empty.
    popModal() {
      setState(prev => {
        const stack = prev.modalStack || [];
        if (stack.length === 0) return prev;
        return { ...prev, modalStack: stack.slice(0, -1) };
      });
    },
    // clearModals(): drop the entire stack in one shot.
    clearModals() {
      setState(prev => {
        const stack = prev.modalStack || [];
        if (stack.length === 0) return prev;
        return { ...prev, modalStack: [] };
      });
    },
    // pushToast(text): convenience wrapper for the auto-dismissing pill.
    // Routes through pushModal so the toast shares the modal-stack
    // lifecycle (ESC pops it, popModal cleans up after the timer fires).
    // MasterModalLayer special-cases kind === 'ModalToast' to skip the
    // scrim, so toasts never block clicks on the underlying surface.
    pushToast(text) {
      setState(prev => ({
        ...prev,
        modalStack: [...(prev.modalStack || []), { kind: 'ModalToast', props: { text: String(text || '') } }],
      }));
    },
    // pushToastUndo(text, onUndo): toast variant for destructive interactions.
    // Renders an Undo chip in the toast pill; click → fires onUndo() and pops.
    // Same lifecycle as pushToast (auto-dismiss + ESC + popModal). Hold time
    // bumps to 3.4s so the user has reach to the chip; HF_ModalToast keys off
    // `undo` for the longer default duration.
    pushToastUndo(text, onUndo) {
      setState(prev => ({
        ...prev,
        modalStack: [
          ...(prev.modalStack || []),
          { kind: 'ModalToast', props: { text: String(text || ''), undo: true, onUndo: typeof onUndo === 'function' ? onUndo : null } },
        ],
      }));
    },
  }), []);

  // Hash → state
  React.useEffect(() => {
    function onHashChange() {
      const fromHash = readHash();
      if (!fromHash) return;
      setState(prev => {
        const surface = masterSurfaceFromHash(fromHash, prev.activeSurface);
        writeHash(fromHash.mode, surface.ws, surface.sub, surface.detail || null);
        return {
          ...prev,
          mode: fromHash.mode,
          activeSurface: surface,
        };
      });
    }
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // State → hash + state → localStorage. `detail` is serialized only when
  // both ws and sub are present (it has no meaning without a host surface).
  const detailKind = state.activeSurface.detail ? state.activeSurface.detail.kind : null;
  const detailId   = state.activeSurface.detail ? state.activeSurface.detail.id   : null;
  React.useEffect(() => {
    writeHash(
      state.mode,
      state.activeSurface.ws,
      state.activeSurface.sub,
      state.activeSurface.detail || null,
    );
    writePersistedMode(state.mode);
  }, [state.mode, state.activeSurface.ws, state.activeSurface.sub, detailKind, detailId]);

  // Keyboard: 'L' toggles between layout and interactive.
  // Skip when an editable target has focus so it doesn't fire while typing.
  React.useEffect(() => {
    function onKey(e) {
      if (e.defaultPrevented) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      if (e.key === 'l' || e.key === 'L') {
        actions.toggleMode();
        e.preventDefault();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [actions]);

  const value = React.useMemo(() => ({ state, ...actions }), [state, actions]);
  return (
    <MasterStateCtx.Provider value={value}>
      {children}
    </MasterStateCtx.Provider>
  );
}

Object.assign(window, {
  MasterStateProvider,
  useMasterState,
  // Expose for debug / smoke tests.
  __masterRouter: { readHash, writeHash, readPersistedMode, writePersistedMode, resolveInitialState },
});
