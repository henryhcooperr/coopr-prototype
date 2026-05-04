/* global React */
// wf-v3-chrome.jsx — shared chrome for v3 (both directions).
// 12 consolidated surfaces. Top centered tabs + LEFT side rail scoped to active top-tab.

const { Fragment: V3Fragment } = React;

// ─── Surface registry (12, post-consolidation) ──────────────
const V3_SURFACES = {
  // WORKSPACE (5)
  home:    { label: 'Home',     group: 'workspace', mode: 'make' },
  chat:    { label: 'Chat',     group: 'workspace', mode: 'make' },
  studio:  { label: 'Studio',   group: 'workspace', mode: 'make' },
  library: { label: 'Library',  group: 'workspace', mode: 'make' },  // absorbs Stories
  feed:    { label: 'Feed',     group: 'workspace', mode: 'make' },  // merges Media + Inbox

  // INTELLIGENCE (4)
  insights: { label: 'Insights', group: 'intelligence', mode: 'look' },
  signal:   { label: 'Signal',   group: 'intelligence', mode: 'look' },  // Trends + Radar
  creator:  { label: 'Creator',  group: 'intelligence', mode: 'look' },  // DNA + Memory + Studies
  patterns: { label: 'Patterns', group: 'intelligence', mode: 'look' },  // Formats + Inspiration

  // OUTPUT (3)
  cliplab:  { label: 'Clip Lab', group: 'output', mode: 'ship' },
  release:  { label: 'Release',  group: 'output', mode: 'ship' },        // Repurpose + Publishing
  presence: { label: 'Presence', group: 'output', mode: 'ship' },        // Link in Bio + Media Kit
};

const V3_GROUPS = {
  workspace:    ['home', 'chat', 'studio', 'library', 'feed'],
  intelligence: ['insights', 'signal', 'creator', 'patterns'],
  output:       ['cliplab', 'release', 'presence'],
};

const V3_MODES = {
  make: { label: 'Make', surfaces: ['home', 'chat', 'studio', 'library', 'feed'] },
  look: { label: 'Look', surfaces: ['insights', 'signal', 'creator', 'patterns'] },
  ship: { label: 'Ship', surfaces: ['cliplab', 'release', 'presence'] },
};

// ─── Top centered tabs ──────────────────────────────────────
function V3TopBar({ tabs, active, onTab, leading, trailing, showCmdK = true, accent = false }) {
  return (
    <div className="wf-topbar" style={{ position: 'relative', justifyContent: 'flex-start' }}>
      {/* leading slot — logo / breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 180 }}>
        {leading || (
          <>
            <div className="wf-box" style={{ width: 22, height: 22, background: '#1a1a1a', color: '#fafaf7', border: 'none', fontSize: 10, fontWeight: 700 }}>C</div>
            <span className="wf-title" style={{ fontSize: 12 }}>COOPR</span>
          </>
        )}
      </div>

      {/* CENTERED tabs — absolutely positioned to the center of the topbar */}
      <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', display: 'flex', gap: 4, padding: 3, background: 'var(--wf-paper-2)', borderRadius: 99, border: '1px solid var(--wf-line)' }}>
        {tabs.map(t => (
          <button
            key={t.id}
            type="button"
            className={`wf-tab ${active === t.id ? 'is-active' : ''}`}
            onClick={onTab ? () => onTab(t.id) : undefined}
            style={accent && active === t.id ? { borderColor: 'var(--wf-accent)', color: 'var(--wf-accent)' } : undefined}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ flex: 1 }} />
      {/* trailing slot — search/cmdk + creator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {trailing}
        {showCmdK && (
          <div className="wf-box" style={{ height: 26, padding: '0 8px', gap: 6, background: 'var(--wf-paper-2)', borderColor: 'var(--wf-line-2)', fontSize: 10, color: 'var(--wf-ink-3)' }}>
            <span>Search · ask · jump</span>
            <span className="wf-key">⌘</span><span className="wf-key">K</span>
          </div>
        )}
        <Creator label="@henry.dives" compact={false} />
      </div>
    </div>
  );
}

// ─── Scoped LEFT side rail (only shows surfaces relevant to active top-tab) ──
function V3SideRail({ surfaces, active, header, footer, showChatLauncher = false, showSubLabels }) {
  return (
    <aside className="wf-sidebar wf-sidebar-default" style={{ width: 168 }}>
      {header && <div style={{ marginBottom: 4 }}>{header}</div>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {surfaces.map(id => {
          const s = V3_SURFACES[id];
          return (
            <div key={id} className={`wf-nav-item ${active === id ? 'is-active' : ''}`}>
              <span className="wf-glyph" />
              <span style={{ flex: 1 }}>{s.label}</span>
              {showSubLabels && showSubLabels[id] && (
                <span className="wf-meta" style={{ fontSize: 9 }}>{showSubLabels[id]}</span>
              )}
            </div>
          );
        })}
      </div>

      {showChatLauncher && (
        <>
          <div style={{ height: 8 }} />
          <div className="wf-sketch wf-sketch-thin" style={{ padding: '6px 8px', background: 'var(--wf-paper)', display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: 'var(--wf-ink-2)' }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--wf-accent)' }} />
            <span style={{ flex: 1 }}>Ask anything…</span>
            <span className="wf-key">⌘</span><span className="wf-key">K</span>
          </div>
        </>
      )}

      <div style={{ flex: 1 }} />
      {footer}
      <div className="wf-nav-item" style={{ opacity: 0.7 }}>
        <span className="wf-glyph" />
        <span>Settings</span>
      </div>
    </aside>
  );
}

// ─── Sub-tabs (inline inside a surface's content area, e.g. Library: All/Published/Drafts/Stories)
function V3SubTabs({ tabs, active, accent }) {
  return (
    <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--wf-line)', padding: '0 14px', background: 'var(--wf-paper)' }}>
      {tabs.map((t, i) => {
        const isActive = active === t || active === i;
        return (
          <div
            key={t}
            style={{
              padding: '8px 12px',
              fontSize: 11,
              fontWeight: isActive ? 600 : 400,
              color: isActive ? 'var(--wf-ink)' : 'var(--wf-ink-2)',
              borderBottom: isActive ? `2px solid ${accent ? 'var(--wf-accent)' : 'var(--wf-ink)'}` : '2px solid transparent',
              marginBottom: -1,
              cursor: 'default',
            }}
          >{t}</div>
        );
      })}
    </div>
  );
}

// ─── Anchored composer (Direction 1 only — Intelligence pages) ──
function V3AnchoredComposer({ context = '@studio/dive-safety', mode = 'Look', placeholder }) {
  return (
    <div className="wf-anchor-chat" style={{ padding: '10px 16px 12px' }}>
      <div className="wf-composer" style={{ flex: 1, padding: '8px 10px' }}>
        <div style={{ color: 'var(--wf-ink-3)', fontSize: 11 }}>
          {placeholder || `Ask about retention, hooks, audience — scoped to current view`}
        </div>
        <div className="wf-composer-chips">
          <span className="wf-chip wf-chip-accent">Mode: {mode}</span>
          <span className="wf-chip">{context}</span>
          <span className="wf-chip">@library</span>
          <span className="wf-chip">Sonnet</span>
          <span style={{ flex: 1 }} />
          <span className="wf-chip">↑</span>
        </div>
      </div>
    </div>
  );
}

// ─── ⌘J chat peer pane (Direction 2 — closed by default; rendered docked when open)
function V3CmdJPane({ open = false, scope = 'this view', height = '100%' }) {
  if (!open) {
    // closed-state launcher — small affordance pinned to the right edge
    return (
      <div style={{ width: 28, flex: '0 0 28px', borderLeft: '1px solid var(--wf-line)', background: 'var(--wf-paper-2)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 0', gap: 8 }}>
        <div style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontSize: 9, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--wf-ink-3)' }}>Chat · ⌘J</div>
      </div>
    );
  }
  return (
    <aside style={{ width: 320, flex: '0 0 320px', borderLeft: '1px solid var(--wf-line)', background: 'var(--wf-paper-2)', display: 'flex', flexDirection: 'column', height }}>
      <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--wf-line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className="wf-label">CHAT · scoped to</span>
          <span className="wf-tag wf-tag-panel" style={{ fontSize: 10 }}>{scope}</span>
        </div>
        <span className="wf-meta">⌘J close</span>
      </div>
      <div style={{ flex: 1, padding: 12, display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden' }}>
        <div className="wf-msg-user" style={{ alignSelf: 'flex-end', fontSize: 10.5 }}>What's the retention floor on the dive-safety carousels?</div>
        <div className="wf-msg-coopr" style={{ fontSize: 10.5 }}>
          Floors at 41% by slide 4. The hook-frame in posts <strong>#0042 / #0051</strong> retains best — both open with rule-of-three text-on-image. Two recent posts dropped that frame.
        </div>
        <ChatBlock kind="CHART" title="Retention floor 7d">
          <MiniChart bars={7} accentIndex={3} />
        </ChatBlock>
        <ChatBlock kind="CLIPS" title="2 examples">
          <div style={{ display: 'flex', gap: 6 }}>
            <PhoneMini w={36} h={66} />
            <PhoneMini w={36} h={66} />
          </div>
        </ChatBlock>
      </div>
      <div style={{ padding: 10, borderTop: '1px solid var(--wf-line)' }}>
        <Composer placeholder="Reply…" compact chips={['@view', 'Sonnet']} />
      </div>
    </aside>
  );
}

// ─── ⌘K modal (Direction 2 — overlay, hero of chat-everywhere story)
function V3CmdKModal({ query = 'dive safety retention' }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'rgba(26,26,26,0.35)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 110, zIndex: 10 }}>
      <div style={{ width: 540, background: 'var(--wf-paper)', border: '1.5px solid var(--wf-ink-2)', borderRadius: 8, padding: 0, boxShadow: '0 14px 32px rgba(0,0,0,0.18)' }}>
        <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--wf-line)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 10, height: 10, border: '1.25px solid var(--wf-ink-2)', borderRadius: '50%' }} />
          <span style={{ fontSize: 13, color: 'var(--wf-ink)', flex: 1, fontWeight: 500 }}>{query}</span>
          <span className="wf-meta">esc</span>
        </div>
        <div style={{ padding: '6px 0' }}>
          <div className="wf-label" style={{ padding: '6px 14px' }}>ASK COOPR</div>
          <div style={{ padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 8, background: 'var(--wf-accent-soft)' }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--wf-accent)' }} />
            <span style={{ fontSize: 11, color: 'var(--wf-ink)', flex: 1 }}>Start chat — "Why did dive-safety retention drop this week?"</span>
            <span className="wf-key">↵</span>
          </div>
          <div className="wf-label" style={{ padding: '10px 14px 6px' }}>JUMP TO</div>
          {[
            ['Library', 'Stories · Fiji series · clip 0042'],
            ['Insights', 'Retention · Dive safety carousels'],
            ['Studio',   'Project: Dive safety — Script step'],
          ].map((r, i) => (
            <div key={i} style={{ padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 11 }}>
              <span style={{ width: 8, height: 8, border: '1px solid var(--wf-ink-3)', borderRadius: 2 }} />
              <span style={{ color: 'var(--wf-ink-3)', minWidth: 60 }}>{r[0]}</span>
              <span style={{ color: 'var(--wf-ink)', flex: 1 }}>{r[1]}</span>
            </div>
          ))}
          <div className="wf-label" style={{ padding: '10px 14px 6px' }}>ACTIONS</div>
          {['Run a study on retention', 'Dock chat on this view (⌘J)', 'Open new conversation'].map((a, i) => (
            <div key={i} style={{ padding: '6px 14px', fontSize: 11, color: 'var(--wf-ink-2)' }}>{a}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Topbar pin annotation (numbered callout positioned absolute) ──
function V3Pin({ n, text, top, left, right, bottom, width = 'auto', arrowDir = 'down' }) {
  return (
    <div style={{ position: 'absolute', top, left, right, bottom, width, zIndex: 5, pointerEvents: 'none' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: arrowDir === 'left' ? 'flex-start' : arrowDir === 'right' ? 'flex-end' : 'center' }}>
        <span className="wf-pin" style={{ position: 'relative', top: 0, left: 0 }}>
          <span className="wf-pin-num">{n}</span>
          {text}
        </span>
      </div>
    </div>
  );
}

Object.assign(window, {
  V3_SURFACES, V3_GROUPS, V3_MODES,
  V3TopBar, V3SideRail, V3SubTabs, V3AnchoredComposer, V3CmdJPane, V3CmdKModal, V3Pin,
});
