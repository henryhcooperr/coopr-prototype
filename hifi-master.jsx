/* global React, window */
/* hifi-master.jsx — top-level <HF_Master>.

   Orchestrates the two views and the floating view-toggle. Wraps everything
   in <MasterStateProvider> so the toggle and both views share one source of
   truth.

   The shared MasterState (defined in hifi-master-router.jsx) carries:
     - mode: 'layout' | 'interactive'
     - activeSurface: { ws, sub, detail?: { kind, id } }
     - lastInteractive: { ws, sub }
   Detail is the optional drill-in descriptor; the interactive view passes
   it down to the active surface and renders a back-chevron when set. The
   layout view ignores detail (it's an index-of-indexes by design). */

const M_EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

// ─── Floating view-toggle (top-right of viewport) ───────────
// Two-segment switch with a sliding clay pill. Mirrors the chrome's active
// indicator pattern at one-third scale. Persists via MasterStateCtx (which
// itself writes to localStorage). The shortcut hint sits below the switch in
// mono — same vocabulary as the rest of the chrome. */
function MasterViewToggle() {
  const { state, setMode } = window.useMasterState();
  const layoutRef = React.useRef(null);
  const interactiveRef = React.useRef(null);
  const containerRef = React.useRef(null);
  const [pill, setPill] = React.useState({ x: 0, w: 0, ready: false });

  React.useLayoutEffect(() => {
    const container = containerRef.current;
    const target = state.mode === 'layout' ? layoutRef.current : interactiveRef.current;
    if (!container || !target) return;
    const cRect = container.getBoundingClientRect();
    const tRect = target.getBoundingClientRect();
    setPill({ x: tRect.left - cRect.left, w: tRect.width, ready: true });
  }, [state.mode]);

  // Cohesion R9 · the floating Layout/Interactive toggle is absorbed into the
  // chrome's right anchor while the interactive view is mounted. Hide this
  // toggle entirely in interactive mode; it remains visible in layout mode,
  // which has no chrome shell of its own.
  if (state.mode === 'interactive') return null;

  function Segment({ id, label, ariaLabel, refEl }) {
    const isActive = state.mode === id;
    return (
      <span
        ref={refEl}
        role="tab"
        aria-selected={isActive}
        aria-label={ariaLabel}
        onClick={() => setMode(id)}
        style={{
          position: 'relative', zIndex: 1,
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '6px 12px',
          borderRadius: 999,
          fontFamily: isActive ? 'var(--font-serif)' : 'var(--font-sans)',
          fontStyle: isActive ? 'italic' : 'normal',
          fontSize: 12.5,
          fontWeight: isActive ? 600 : 500,
          color: isActive ? 'var(--accent-primary-press)' : 'var(--fg-secondary)',
          cursor: 'pointer', userSelect: 'none',
          transition: `color 240ms ${M_EASE}`,
          letterSpacing: isActive ? '-0.005em' : '0',
        }}>
        {label}
      </span>
    );
  }

  return (
    <div style={{
      position: 'fixed', top: 14, right: 16, zIndex: 50,
      display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4,
      pointerEvents: 'none',
    }}>
      <div
        ref={containerRef}
        role="tablist"
        aria-label="Master view mode"
        style={{
          position: 'relative',
          display: 'inline-flex', alignItems: 'center',
          padding: 4,
          background: 'var(--surface-1)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 999,
          boxShadow: '0 8px 22px -10px rgba(26,24,21,0.18), 0 1px 0 rgba(253,252,249,0.7) inset',
          pointerEvents: 'auto',
        }}>
        <span style={{
          position: 'absolute',
          left: pill.x, top: 4,
          width: pill.w, height: 'calc(100% - 8px)',
          background: 'linear-gradient(180deg, color-mix(in srgb, var(--accent-primary) 14%, transparent), color-mix(in srgb, var(--accent-primary) 4%, transparent))',
          border: '1px solid color-mix(in srgb, var(--accent-primary) 18%, transparent)',
          borderRadius: 999,
          boxShadow: '0 2px 6px -3px color-mix(in srgb, var(--accent-primary) 22%, transparent), 0 1px 0 rgba(253,252,249,0.5) inset',
          opacity: pill.ready ? 1 : 0,
          transition: `left 360ms ${M_EASE}, width 360ms ${M_EASE}, opacity 240ms ease`,
          pointerEvents: 'none', willChange: 'left, width', zIndex: 0,
        }} />
        <Segment id="layout" label="Layout" ariaLabel="Switch to layout view" refEl={layoutRef} />
        <Segment id="interactive" label="Interactive" ariaLabel="Switch to interactive view" refEl={interactiveRef} />
      </div>
      <span style={{
        fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '0.16em',
        textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600,
        pointerEvents: 'none',
      }}>
        Toggle · L
      </span>
      {/* Cross-link to the token-variant gallery. Lives outside the master
          state machine — it's a sibling page, not a third view — so it just
          navigates instead of flipping a mode flag. */}
      <a
        href="tweaks.html"
        style={{
          fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '0.16em',
          textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 600,
          textDecoration: 'none',
          pointerEvents: 'auto',
          display: 'inline-flex', alignItems: 'center', gap: 4,
          transition: 'color 200ms cubic-bezier(0.16,1,0.3,1)',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent-primary-press)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--fg-tertiary)'; }}
      >
        Tweaks
        <svg width="9" height="9" viewBox="0 0 10 10" aria-hidden="true">
          <path d="M3 7 L7 3 M4 3 L7 3 L7 6" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </a>
    </div>
  );
}

// ─── Inner switcher — picks layout OR interactive ───────────
function MasterViewSwitcher() {
  const { state } = window.useMasterState();
  if (state.mode === 'layout') return <window.HF_MasterLayoutView />;
  return <window.HF_MasterInteractiveView />;
}

function HF_Master() {
  // Docs R6 bridge — wires DOM events ('docs-r6-new-doc', 'docs-r6-open-doc')
  // and the toast pile to MasterStateProvider context. Null-rendering hook.
  const HookBridge = window.HF_DocsR6ToolbarHook;

  // Cohesion R9 / Wave 3 · boot reader for the unified tweaks → master
  // token-override channel. Reads BOTH localStorage['cb-locked-tokens'] and
  // locked-tokens.json, JSON file wins on key conflict, then injects a global
  // <style id="cb-locked-tokens-style"> at :root so every surface inherits the
  // lock. The channel script (hifi-cohesion-r9-tweaks-channel.jsx) loads
  // before this file via master.html script order, so the global is available.
  // Empty deps — runs once on mount; no cleanup needed since the <style> tag
  // is meant to live for the page's lifetime.
  React.useEffect(() => {
    const channel = window.cohesionR9TokensChannel;
    if (channel && typeof channel.bootApply === 'function') {
      channel.bootApply();
    }
  }, []);

  return (
    <window.MasterStateProvider>
      {HookBridge ? <HookBridge /> : null}
      <div style={{
        minHeight: '100vh',
        background: 'var(--bg-base)',
        fontFamily: 'var(--font-sans)',
        color: 'var(--fg-primary)',
      }}>
        <MasterViewToggle />
        <MasterViewSwitcher />
      </div>
    </window.MasterStateProvider>
  );
}

// ─── R10 · State-variant read helper ─────────────────────────
// Surfaces accept an optional `state` prop (`'happy' | 'loading' | 'empty' | 'error'`,
// default `'happy'`). The tweaks panel can override per-surface state via a
// `surfaceStateOverrides` map on MasterState, keyed by [ws][sub]. This helper is the
// READ side only — it returns the current override (or `'happy'` if unset) so a
// surface can prefer the panel override over its own prop.
//
// Usage inside a surface:
//   const override = window.useSurfaceState('library', 'Catalog');
//   const s = override || props.state || 'happy';
//
// The reducer and setter (`setSurfaceStateOverride`) ship in F2 (state-variant
// rollout wave). C3 only adds this read-side helper — until F2 lands the override
// map will always be undefined, so this helper returns `'happy'` for every surface.
// That's intentional: surfaces can adopt the branch pattern now, the panel UI
// arrives later, no flag-day refactor needed.
function useSurfaceState(wsId, subId) {
  const ctx = window.useMasterState && window.useMasterState();
  const state = ctx && ctx.state;
  const overrides = state && state.surfaceStateOverrides;
  const wsMap = overrides && overrides[wsId];
  return (wsMap && wsMap[subId]) || 'happy';
}

Object.assign(window, { HF_Master, MasterViewToggle, MasterViewSwitcher, useSurfaceState });
