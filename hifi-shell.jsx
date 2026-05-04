/* global React, window */
/* hifi-shell.jsx — the canonical app chrome.
   New IA: 6 top-level workspaces, secondary tab strip, NO side rail.
   Every hi-fi screen uses <HfShell workspace="..." subtab="..."> as its outer wrapper. */

// Wave 3 IA collapse: 8 top-level workspaces. Studio retired entirely (its
// sub-tabs collapse into Docs Home + a top-level Clip Lab; Workspace becomes
// a Pinned filter on Docs Home, handled separately). Block Catalog is
// layout-view-only — never appears in the interactive shell.
const HF_SHELL_WORKSPACES = [
  { id: 'home',     label: 'Home' },          // = Chat (cold-open + briefing)
  { id: 'docs',     label: 'Docs' },          // top-level docs (replaces studio.docs)
  { id: 'cliplab',  label: 'Clip Lab' },      // top-level Clip Lab (5-step state machine)
  { id: 'library',  label: 'Library' },       // published + drafted posts
  { id: 'insights', label: 'Insights' },      // own perf · retention · DNA · audience
  { id: 'intel',    label: 'Intel' },         // outward-facing: trends/radar/inspiration/memory
  { id: 'inbox',    label: 'Inbox' },         // comments / dms / mentions
  { id: 'calendar', label: 'Calendar' },      // top-level cross-platform schedule
];

// Sub-tabs per workspace. Empty array = no sub-tab strip rendered.
// Wave 3 IA: docs has Home (card grid) + List (sortable table); cliplab has
// the 5-step state machine. blocks is layout-view-only and intentionally
// absent from this map.
const HF_SHELL_SUBTABS = {
  home:     [],
  docs:     ['Home', 'List'],
  cliplab:  ['Empty', 'Import', 'AutoClips', 'Review', 'Export'],
  calendar: [],
  library:  ['Catalog', 'Series', 'Patterns', 'Timeline', 'Pairings', 'Compare'],
  insights: ['Overview', 'Retention', 'Formats', 'Audience', 'Posting'],
  intel:    ['Trends', 'Radar', 'Inspiration', 'DNA', 'Memory', 'Studies'],
  inbox:    ['Comments', 'DMs', 'Mentions', 'Replies'],
};

// ─── Top bar (workspace tabs, centered) ────────────────────
function HfShellTopbar({ workspace = 'home', right = null }) {
  return (
    <div style={{
      height: 52,
      padding: '0 22px',
      display: 'flex',
      alignItems: 'center',
      borderBottom: '1px solid var(--border-subtle)',
      background: 'var(--surface-1)',
      flexShrink: 0,
      gap: 18,
    }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, minWidth: 130 }}>
        <span style={{
          width: 24, height: 24, borderRadius: 5,
          background: 'var(--surface-ink)', color: 'var(--fg-on-ink)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 14, lineHeight: 1,
        }}>C</span>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 700, letterSpacing: '0.06em', color: 'var(--fg-primary)' }}>COOPR</span>
      </div>

      {/* Centered workspace tabs */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 30 }}>
        {HF_SHELL_WORKSPACES.map(w => {
          const active = w.id === workspace;
          return (
            <span key={w.id} style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 13.5,
              fontWeight: active ? 600 : 500,
              color: active ? 'var(--fg-primary)' : 'var(--fg-tertiary)',
              borderBottom: active ? '2px solid var(--fg-primary)' : '2px solid transparent',
              padding: '15px 2px',
              marginBottom: -1,
              letterSpacing: '-0.005em',
              cursor: 'default',
            }}>{w.label}</span>
          );
        })}
      </div>

      {/* Right utilities */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 130, justifyContent: 'flex-end' }}>
        {right || <>
          <HF_ActivityTrayPill />
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            height: 26, padding: '0 10px',
            border: '1px solid var(--border-subtle)',
            borderRadius: 6,
            background: 'var(--surface-2)',
            fontFamily: 'var(--font-sans)', fontSize: 11.5, color: 'var(--fg-tertiary)',
          }}>
            <span style={{ width: 9, height: 9, border: '1.4px solid var(--fg-tertiary)', borderRadius: '50%' }} />
            <span>Search · ⌘K</span>
          </span>
          <span style={{
            width: 24, height: 24, borderRadius: '50%',
            background: 'var(--accent-primary)', color: 'var(--fg-on-accent)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 700,
          }}>H</span>
        </>}
      </div>
    </div>
  );
}

// ─── Secondary tab strip (sub-views) ──────────────────────
function HfShellSubtabs({ workspace, active, right = null }) {
  const items = HF_SHELL_SUBTABS[workspace] || [];
  if (items.length === 0) return null;
  return (
    <div style={{
      height: 40,
      padding: '0 22px',
      display: 'flex',
      alignItems: 'center',
      borderBottom: '1px solid var(--border-subtle)',
      background: 'var(--surface-1)',
      flexShrink: 0,
      gap: 22,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 22, height: '100%' }}>
        {items.map(label => {
          const isActive = label === active;
          return (
            <span key={label} style={{
              display: 'inline-flex', alignItems: 'center',
              height: '100%',
              fontFamily: 'var(--font-sans)',
              fontSize: 12.5,
              fontWeight: isActive ? 600 : 500,
              color: isActive ? 'var(--fg-primary)' : 'var(--fg-secondary)',
              borderBottom: isActive ? '2px solid var(--fg-primary)' : '2px solid transparent',
              marginBottom: -1,
              cursor: 'default',
            }}>{label}</span>
          );
        })}
      </div>
      <div style={{ flex: 1 }} />
      {right}
    </div>
  );
}

// ─── Activity tray (running tasks indicator) ─────────────────
function HF_ActivityTrayPill() {
  const [open, setOpen] = React.useState(false);
  const [, setTick] = React.useState(0);
  const masterState = (window.useMasterState && window.useMasterState()) || null;

  const running = (window.JOB_REGISTRY && window.JOB_REGISTRY.listRunning()) || [];
  const hasRunning = running.length > 0;

  React.useEffect(() => {
    if (!hasRunning) return;
    const t = window.setInterval(() => setTick((n) => n + 1), 1000);
    return () => window.clearInterval(t);
  }, [hasRunning]);

  React.useEffect(() => {
    if (!open) return;
    function onDocClick(e) {
      const root = document.getElementById('hf-activity-tray-root');
      if (!root || root.contains(e.target)) return;
      setOpen(false);
    }
    function onKey(e) { if (e.key === 'Escape') setOpen(false); }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (!hasRunning) return null;

  const first = running[0];
  const elapsed = Math.floor((Date.now() - first.startedAt) / 1000);
  const m = Math.floor(elapsed / 60); const r = elapsed - m * 60;

  function fmtElapsed(startedAt) {
    const e = Math.floor((Date.now() - startedAt) / 1000);
    const mm = Math.floor(e / 60); const rr = e - mm * 60;
    return `${mm}:${rr < 10 ? '0' : ''}${rr}`;
  }

  return (
    <span id="hf-activity-tray-root" style={{ position: 'relative', display: 'inline-flex' }}>
      <button type="button" onClick={() => setOpen(!open)} style={{
        display: 'inline-flex', alignItems: 'center', gap: 8, height: 26, padding: '0 12px',
        borderRadius: 999,
        background: 'var(--accent-soft)',
        border: '1px solid transparent',
        color: 'var(--accent-primary-press)',
        fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', fontWeight: 700,
        cursor: 'pointer',
      }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-primary)', animation: 'blk-step-pulse 1.4s ease-in-out infinite' }} />
        {running.length} running · {`${m}:${r < 10 ? '0' : ''}${r}`}
      </button>
      {open && (
        <div role="dialog" style={{
          position: 'absolute', right: 0, top: 'calc(100% + 8px)',
          width: 360, background: 'var(--surface-1)',
          border: '1px solid var(--border-default)',
          borderRadius: 12, padding: 6,
          display: 'flex', flexDirection: 'column', gap: 2,
          zIndex: 1000,
          boxShadow: '0 10px 32px rgba(26,24,21,0.08)',
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '10px 12px 4px',
            fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--fg-tertiary)', fontWeight: 700,
          }}>
            <span>Running · {running.length}</span>
          </div>
          {running.map((j, i) => {
            const step = j.steps[j.activeStep];
            return (
              <button type="button" key={j.id} onClick={() => {
                if (j.gatesThreadId && masterState && typeof masterState.setActiveSurface === 'function') {
                  masterState.setActiveSurface('home', 'threads');
                }
                setOpen(false);
              }} style={{
                display: 'grid', gridTemplateColumns: '1fr auto', gap: 10, alignItems: 'baseline',
                padding: '10px 12px', borderRadius: 8, background: 'transparent', border: 0,
                borderTop: i > 0 ? '1px solid var(--border-subtle)' : 0,
                textAlign: 'left', cursor: 'pointer',
                width: '100%',
              }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 500, fontSize: 14.5, color: 'var(--fg-primary)', letterSpacing: '-.005em' }}>{j.label}</div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: 11.5, color: 'var(--fg-tertiary)', marginTop: 2 }}>
                    {step ? step.name : '—'}
                  </div>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--fg-secondary)', fontWeight: 700, alignSelf: 'center' }}>
                  {fmtElapsed(j.startedAt)}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </span>
  );
}

// ─── Outer shell wrapper (use on every page) ──────────────
function HfShell({ workspace = 'home', subtab = null, subtabRight = null, topbarRight = null, children, style = {} }) {
  return (
    <div className="hf" style={{
      width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column',
      background: 'var(--bg-base)',
      fontFamily: 'var(--font-sans)',
      color: 'var(--fg-primary)',
      overflow: 'hidden',
      ...style,
    }}>
      <HfShellTopbar workspace={workspace} right={topbarRight} />
      <HfShellSubtabs workspace={workspace} active={subtab} right={subtabRight} />
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  );
}

Object.assign(window, {
  HF_SHELL_WORKSPACES,
  HF_SHELL_SUBTABS,
  HfShell,
  HfShellTopbar,
  HfShellSubtabs,
});
