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
