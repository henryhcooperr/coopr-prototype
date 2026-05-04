/* global React, Creator, KeyCombo, Composer */
// wf-d1cf-chrome.jsx — Direction 1 (chat-first → workspace model).
// 4 workspaces: Studio · Audience · Library · Pulse. Chat is the interaction
// model present EVERYWHERE, not a tab. Sub-tabs sit just above content,
// Perplexity-style. Side rail is optional + collapsible per sub-view.

const D1CF_TABS = [
  { id: 'studio',   label: 'Studio',   hint: 'make' },
  { id: 'audience', label: 'Audience', hint: 'who + how' },
  { id: 'library',  label: 'Library',  hint: 'artifacts' },
  { id: 'pulse',    label: 'Pulse',    hint: 'signal' },
];

// Sub-tabs per workspace. First is the default.
const D1CF_SUBTABS = {
  studio:   ['Threads', 'Drafts', 'Schedule', 'Brand voice'],
  audience: ['Overview', 'Retention', 'Comments', 'Followers', 'Segments'],
  library:  ['All', 'Posts', 'Drafts', 'Charts', 'Notes', 'Decisions'],
  pulse:    ['For you', 'Creator niche', 'Your audience', 'Mentions'],
};

// ─── Topbar ─────────────────────────────────────────────────
// Logo · centered tabs · ⌘K · creator. Chat tab gets a tiny "·" dot
// to imply "you are home" when active.
function D1cfTopbar({ active, onTab, showCmdK = true, accent = false }) {
  return (
    <div className="wf-topbar" style={{ position: 'relative', justifyContent: 'flex-start', height: 48 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 180 }}>
        <div className="wf-box" style={{ width: 22, height: 22, background: '#1a1a1a', color: '#fafaf7', border: 'none', fontSize: 10, fontWeight: 700 }}>C</div>
        <span className="wf-title" style={{ fontSize: 12 }}>COOPR</span>
      </div>

      <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', display: 'flex', gap: 22 }}>
        {D1CF_TABS.map(t => {
          const isActive = active === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={onTab ? () => onTab(t.id) : undefined}
              style={{
                background: 'transparent',
                border: 'none',
                padding: '14px 0 12px',
                fontSize: 12.5,
                fontWeight: isActive ? 600 : 500,
                color: isActive ? 'var(--wf-ink)' : 'var(--wf-ink-3)',
                borderBottom: isActive ? '2px solid var(--wf-ink)' : '2px solid transparent',
                fontFamily: 'inherit',
                cursor: 'default',
                letterSpacing: '0.005em',
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <div style={{ flex: 1 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 10.5, color: 'var(--wf-accent)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--wf-accent)' }} />
          Posting · 7 scheduled
        </span>
        <span style={{ fontSize: 10.5, color: 'var(--wf-ink-3)' }}>Wed · Apr 24</span>
        {showCmdK && (
          <div className="wf-box" style={{ height: 26, padding: '0 8px', gap: 6, background: 'transparent', borderColor: 'var(--wf-line)', fontSize: 10, color: 'var(--wf-ink-3)' }}>
            <span>Search · jump · ask</span>
            <span className="wf-key">⌘</span><span className="wf-key">K</span>
          </div>
        )}
        <Creator label="@henry.dives" compact={false} />
      </div>
    </div>
  );
}

// ─── Threaded chat sidebar ──────────────────────────────────
// Used on the /chat route. Sections: Today · This week · Older.
// "+ New conversation" pinned at top. Active item highlighted.
function D1cfThreadRail({ active = 0, width = 220 }) {
  // Flat list, Perplexity-quiet. Soft section dividers via a tiny date label
  // on the FIRST item of each cluster — no all-caps group headers.
  const items = [
    { title: 'Why dive-safety retention dropped', when: 'Today',     meta: '3m' },
    { title: 'Hook lines for Fiji series',         when: null,       meta: '1h' },
    { title: 'Reply ideas for @marina.k thread',   when: 'Yesterday',meta: '4:12p' },
    { title: 'Repurpose 0042 → carousel',          when: null,       meta: '11:08a' },
    { title: 'Audience deep-dive · safety lens',   when: 'This week',meta: 'Mon' },
    { title: 'Caption tone · darker?',             when: null,       meta: 'Mon' },
    { title: 'Wreck-dive script outline',          when: null,       meta: 'Sun' },
    { title: 'Series brainstorm · Q3',             when: 'Earlier',  meta: 'Apr 18' },
    { title: 'Bio refresh',                        when: null,       meta: 'Apr 12' },
  ];

  return (
    <aside className="wf-sidebar wf-sidebar-default" style={{ width, padding: '12px 6px 10px', borderRight: '1px solid var(--wf-line)', background: 'var(--wf-paper)' }}>
      {/* New conversation — quiet, no border */}
      <button type="button" style={{ width: '100%', height: 28, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', padding: '0 10px', gap: 8, background: 'transparent', border: 'none', fontSize: 11.5, color: 'var(--wf-ink)', fontWeight: 500, cursor: 'default', fontFamily: 'inherit', marginBottom: 4 }}>
        <span style={{ fontSize: 14, lineHeight: 1, color: 'var(--wf-ink-3)' }}>+</span>
        <span>New thread</span>
        <span style={{ flex: 1 }} />
        <KeyCombo keys={['⌘', 'N']} />
      </button>

      {/* Search threads — also quiet */}
      <div style={{ display: 'flex', alignItems: 'center', height: 28, padding: '0 10px', gap: 8, fontSize: 11, color: 'var(--wf-ink-3)', marginBottom: 14 }}>
        <span style={{ width: 9, height: 9, border: '1px solid var(--wf-ink-3)', borderRadius: '50%' }} />
        <span style={{ flex: 1 }}>Search threads</span>
      </div>

      {/* Flat list with tiny when-labels */}
      <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1 }}>
        {items.map((it, i) => {
          const isActive = i === active;
          return (
            <React.Fragment key={i}>
              {it.when && (
                <div style={{ fontSize: 9.5, color: 'var(--wf-ink-3)', padding: '10px 10px 4px', letterSpacing: '0.04em' }}>
                  {it.when}
                </div>
              )}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '5px 10px',
                  borderRadius: 3,
                  background: isActive ? 'var(--wf-paper-2)' : 'transparent',
                }}
              >
                <span style={{ flex: 1, fontSize: 11.5, color: 'var(--wf-ink)', fontWeight: isActive ? 500 : 400, lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {it.title}
                </span>
                <span style={{ fontSize: 9.5, color: 'var(--wf-ink-3)', flexShrink: 0 }}>{it.meta}</span>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Footer — single quiet row, Perplexity-style */}
      <div style={{ paddingTop: 10, marginTop: 6, borderTop: '1px solid var(--wf-line)', display: 'flex', alignItems: 'center', gap: 8, padding: '10px 10px 0' }}>
        <span style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--wf-ink-2)' }} />
        <span style={{ flex: 1, fontSize: 11, color: 'var(--wf-ink-2)' }}>@henry.dives</span>
        <span style={{ fontSize: 10, color: 'var(--wf-ink-3)' }}>···</span>
      </div>
    </aside>
  );
}

// ─── Full-bottom composer (Chat route) ──────────────────────
// Big, centered, the primary affordance of the page.
function D1cfFullComposer({ context = '@henry.dives · Sonnet', placeholder, suggestions = [] }) {
  return (
    <div style={{ padding: '12px 24px 18px', borderTop: '1px solid var(--wf-line)', background: 'var(--wf-paper)' }}>
      {suggestions.length > 0 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 760, margin: '0 auto 10px' }}>
          {suggestions.map((s, i) => (
            <span key={i} className="wf-chip" style={{ fontSize: 10.5, color: 'var(--wf-ink-2)' }}>{s}</span>
          ))}
        </div>
      )}
      <div className="wf-composer" style={{ maxWidth: 760, margin: '0 auto', padding: '12px 14px', borderColor: 'var(--wf-ink-2)', borderWidth: 1.5, background: 'var(--wf-paper)' }}>
        <div style={{ color: 'var(--wf-ink-3)', fontSize: 13, paddingBottom: 8, minHeight: 18 }}>
          {placeholder || 'Ask anything · or paste a link, brief, or post idea…'}
        </div>
        <div className="wf-composer-chips">
          <span className="wf-chip">{context}</span>
          <span className="wf-chip">@library</span>
          <span className="wf-chip">@audience</span>
          <span style={{ flex: 1 }} />
          <span className="wf-chip">+ attach</span>
          <span className="wf-chip wf-chip-accent">↑ Send</span>
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: 6, fontSize: 9.5, color: 'var(--wf-ink-3)' }}>
        Drafts and charts created here auto-save to <strong style={{ color: 'var(--wf-ink-2)' }}>Library</strong>. Edits stay in sync.
      </div>
    </div>
  );
}

// ─── Slim-pill composer (Library / Audience routes) ─────────
// Anchored bottom-center. Tells the user chat is one click away,
// without crowding the analytical surface.
function D1cfPillComposer({ scope = 'this view', expanded = false, hint }) {
  if (expanded) {
    return (
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '12px 24px 14px', borderTop: '1px solid var(--wf-line)', background: 'var(--wf-paper)', boxShadow: '0 -8px 24px rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span className="wf-label" style={{ fontSize: 9 }}>SCOPED TO</span>
          <span className="wf-tag wf-tag-panel" style={{ fontSize: 10 }}>{scope}</span>
          <span style={{ flex: 1 }} />
          <span className="wf-meta" style={{ fontSize: 10 }}>esc to close</span>
        </div>
        <div className="wf-composer" style={{ maxWidth: 760, margin: '0 auto', padding: '10px 12px', borderColor: 'var(--wf-ink-2)', background: 'var(--wf-paper)' }}>
          <div style={{ color: 'var(--wf-ink-3)', fontSize: 12, paddingBottom: 6, minHeight: 16 }}>
            {hint || `Ask about ${scope} — replies go to a new thread in Chat`}
          </div>
          <div className="wf-composer-chips">
            <span className="wf-chip">@henry.dives</span>
            <span className="wf-chip">Sonnet</span>
            <span style={{ flex: 1 }} />
            <span className="wf-chip wf-chip-accent">↑</span>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div style={{ position: 'absolute', left: '50%', bottom: 16, transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 0, background: 'var(--wf-paper)', border: '1.5px solid var(--wf-ink-2)', borderRadius: 99, boxShadow: '0 6px 18px rgba(0,0,0,0.10)', overflow: 'hidden' }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', fontSize: 11.5, color: 'var(--wf-ink-2)' }}>
        <span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--wf-accent)' }} />
        Ask about {scope}…
      </span>
      <span style={{ width: 1, alignSelf: 'stretch', background: 'var(--wf-line)' }} />
      <span style={{ padding: '8px 12px', fontSize: 10, color: 'var(--wf-ink-3)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        <span className="wf-key">⌘</span><span className="wf-key">L</span>
      </span>
    </div>
  );
}

// ─── Library side rail (Library route) ──────────────────────
// Sub-views (sub-tabs) within Library. "Schedule" lives here.
function D1cfLibraryRail({ active = 'all', width = 168 }) {
  const items = [
    { id: 'all',        label: 'All',         meta: '1,284' },
    { id: 'drafts',     label: 'Drafts',      meta: '12' },
    { id: 'scheduled',  label: 'Scheduled',   meta: '7' },
    { id: 'published',  label: 'Published',   meta: '847' },
    { id: 'charts',     label: 'Charts',      meta: '34' },
    { id: 'studies',    label: 'Studies',     meta: '5' },
  ];
  const lenses = [
    { id: 'series',     label: 'Series', count: 4 },
    { id: 'pillars',    label: 'Pillars', count: 3 },
    { id: 'formats',    label: 'Formats', count: 6 },
  ];
  return (
    <aside className="wf-sidebar wf-sidebar-default" style={{ width, padding: '10px 8px', borderRight: '1px solid var(--wf-line)', background: 'var(--wf-paper-2)' }}>
      <div className="wf-label" style={{ fontSize: 9, padding: '0 6px 6px' }}>VIEWS</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {items.map(it => {
          const isActive = active === it.id;
          return (
            <div key={it.id} className={`wf-nav-item ${isActive ? 'is-active' : ''}`} style={{ borderRadius: 4 }}>
              <span className="wf-glyph" />
              <span style={{ flex: 1 }}>{it.label}</span>
              <span style={{ fontSize: 9.5, color: 'var(--wf-ink-3)' }}>{it.meta}</span>
            </div>
          );
        })}
      </div>

      <div className="wf-label" style={{ fontSize: 9, padding: '12px 6px 6px' }}>LENSES</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {lenses.map(l => (
          <div key={l.id} className="wf-nav-item" style={{ borderRadius: 4, opacity: 0.85 }}>
            <span className="wf-glyph" />
            <span style={{ flex: 1 }}>{l.label}</span>
            <span style={{ fontSize: 9.5, color: 'var(--wf-ink-3)' }}>{l.count}</span>
          </div>
        ))}
      </div>

      <div style={{ flex: 1 }} />
      <div className="wf-nav-item" style={{ opacity: 0.7 }}>
        <span className="wf-glyph" />
        <span>Settings</span>
      </div>
    </aside>
  );
}

// ─── Audience side rail ─────────────────────────────────────
function D1cfAudienceRail({ active = 'overview', width = 168 }) {
  const items = [
    { id: 'overview',   label: 'Overview' },
    { id: 'segments',   label: 'Segments',   meta: '6' },
    { id: 'comments',   label: 'Comments',   meta: '142' },
    { id: 'mentions',   label: 'Mentions',   meta: '23' },
    { id: 'retention',  label: 'Retention' },
    { id: 'voices',     label: 'Voices',     meta: '8' },
  ];
  return (
    <aside className="wf-sidebar wf-sidebar-default" style={{ width, padding: '10px 8px', borderRight: '1px solid var(--wf-line)', background: 'var(--wf-paper-2)' }}>
      <div className="wf-label" style={{ fontSize: 9, padding: '0 6px 6px' }}>VIEWS</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {items.map(it => {
          const isActive = active === it.id;
          return (
            <div key={it.id} className={`wf-nav-item ${isActive ? 'is-active' : ''}`} style={{ borderRadius: 4 }}>
              <span className="wf-glyph" />
              <span style={{ flex: 1 }}>{it.label}</span>
              {it.meta && <span style={{ fontSize: 9.5, color: 'var(--wf-ink-3)' }}>{it.meta}</span>}
            </div>
          );
        })}
      </div>
      <div style={{ flex: 1 }} />
      <div className="wf-nav-item" style={{ opacity: 0.7 }}>
        <span className="wf-glyph" />
        <span>Settings</span>
      </div>
    </aside>
  );
}

// ─── Annotation pin (re-used from earlier vocabulary) ───────
function D1cfPin({ n, text, top, left, right, bottom, width = 'auto' }) {
  return (
    <div style={{ position: 'absolute', top, left, right, bottom, width, zIndex: 5, pointerEvents: 'none' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <span className="wf-pin" style={{ position: 'relative', top: 0, left: 0 }}>
          <span className="wf-pin-num">{n}</span>
          {text}
        </span>
      </div>
    </div>
  );
}

// ─── Sub-tab row ────────────────────────────────────────────
// Horizontal row that sits directly under the topbar. Light underline for
// active item — Perplexity-style. Optional right-side content (filter chips,
// rail toggle, etc). Use across every workspace for consistency.
function D1cfSubTabs({ workspace, active, right = null, leftAccessory = null }) {
  const items = D1CF_SUBTABS[workspace] || [];
  return (
    <div style={{ height: 40, borderBottom: '1px solid var(--wf-line)', background: 'var(--wf-paper)', display: 'flex', alignItems: 'center', padding: '0 24px', gap: 20 }}>
      {leftAccessory}
      <div style={{ display: 'flex', gap: 18, alignItems: 'stretch', height: '100%' }}>
        {items.map(label => {
          const isActive = label === active;
          return (
            <div
              key={label}
              style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: 12,
                fontWeight: isActive ? 600 : 500,
                color: isActive ? 'var(--wf-ink)' : 'var(--wf-ink-2)',
                borderBottom: isActive ? '2px solid var(--wf-ink)' : '2px solid transparent',
                marginBottom: -1,
                cursor: 'default',
              }}
            >
              {label}
            </div>
          );
        })}
      </div>
      <span style={{ flex: 1 }} />
      {right}
    </div>
  );
}

// ─── Scoped inline composer ─────────────────────────────────
// Perplexity-pattern composer, scoped to the workspace. Sits INLINE with
// content (usually near the top of the main area, or centered in empty states).
// Placeholder adapts to workspace. Size variants: 'hero' (landing), 'bar' (top).
function D1cfScopedComposer({ workspace = 'studio', variant = 'bar', onAsk }) {
  const scopes = {
    studio:   { placeholder: 'Draft anything, or ask to make something…', chip: '@library', hint: '↵ to send' },
    audience: { placeholder: 'Ask anything about your audience…',          chip: 'all series · 30d', hint: '↵ to ask' },
    library:  { placeholder: 'Search your library, or ask…',               chip: 'all artifacts', hint: '↵' },
    pulse:    { placeholder: '',                                            chip: '', hint: '' }, // no composer on Pulse
  };
  const { placeholder, chip, hint } = scopes[workspace] || scopes.studio;

  if (variant === 'hero') {
    return (
      <div style={{ width: 680, border: '1px solid var(--wf-ink-2)', borderRadius: 14, background: 'var(--wf-paper)', boxShadow: '0 1px 0 rgba(0,0,0,0.02), 0 8px 24px -16px rgba(0,0,0,0.08)' }}>
        <div style={{ padding: '18px 20px 12px', minHeight: 64, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 14, color: 'var(--wf-ink-3)' }}>{placeholder}</span>
        </div>
        <div style={{ padding: '8px 12px', borderTop: '1px solid var(--wf-line)', display: 'flex', alignItems: 'center', gap: 6 }}>
          {chip && <span className="wf-chip" style={{ fontSize: 10.5 }}>＠ <span style={{ color: 'var(--wf-ink-2)' }}>{chip.replace('@', '')}</span></span>}
          <span className="wf-chip" style={{ fontSize: 10.5 }}>+ Attach</span>
          <span className="wf-chip" style={{ fontSize: 10.5 }}>Sonnet</span>
          <span style={{ flex: 1 }} />
          <span style={{ fontSize: 10, color: 'var(--wf-ink-3)' }}>{hint}</span>
          <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--wf-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--wf-paper)', fontSize: 11 }}>↑</span>
        </div>
      </div>
    );
  }

  // 'bar' — full-width horizontal search/ask bar, sits at top of content
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 38, padding: '0 12px', border: '1px solid var(--wf-line-2)', borderRadius: 10, background: 'var(--wf-paper)' }}>
      <span style={{ width: 12, height: 12, border: '1.5px solid var(--wf-ink-3)', borderRadius: '50%', flexShrink: 0 }} />
      <span style={{ flex: 1, fontSize: 12.5, color: 'var(--wf-ink-3)' }}>{placeholder}</span>
      {chip && <span className="wf-chip" style={{ fontSize: 10.5 }}>{chip}</span>}
      <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--wf-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--wf-paper)', fontSize: 10 }}>↑</span>
    </div>
  );
}

Object.assign(window, {
  D1CF_TABS,
  D1CF_SUBTABS,
  D1cfTopbar,
  D1cfThreadRail,
  D1cfFullComposer,
  D1cfPillComposer,
  D1cfLibraryRail,
  D1cfAudienceRail,
  D1cfPin,
  D1cfSubTabs,
  D1cfScopedComposer,
});
