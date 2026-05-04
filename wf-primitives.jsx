/* global React */
// wf-primitives.jsx — reusable low-fi atoms for all directions.
// Exported to window so each direction file can consume them.

const { Fragment } = React;

// ─── Generic atoms ───────────────────────────────────────────

function Pin({ n, children, style }) {
  return (
    <span className="wf-pin" style={style}>
      <span className="wf-pin-num">{n}</span>
      {children}
    </span>
  );
}

function AbEdge({ children }) {
  return <div className="wf-ab-edge">{children}</div>;
}

function Textlines({ lines = 3, style }) {
  return (
    <div className="wf-textlines" style={style}>
      {Array.from({ length: lines }, (_, i) => <span key={i} />)}
    </div>
  );
}

function Hatch({ style, className = '', children }) {
  return <div className={`wf-hatch ${className}`} style={style}>{children}</div>;
}

function Squiggle({ style }) {
  return <div className="wf-squiggle" style={style} />;
}

// ─── Shell chrome ────────────────────────────────────────────

function Creator({ label = '@henry.dives', compact = false }) {
  return (
    <div className="wf-creator" title="Active creator scope">
      <span className="wf-creator-dot">H</span>
      {!compact && <span>{label}</span>}
    </div>
  );
}

function KeyCombo({ keys }) {
  return (
    <span className="wf-row" style={{ gap: 3 }}>
      {keys.map((k, i) => <span key={i} className="wf-key">{k}</span>)}
    </span>
  );
}

// Sidebar with COOPR's real nav structure.
function Sidebar({ width = 'default', active = 'chat', showIcons = true, compactHeader = true }) {
  const klass = `wf-sidebar wf-sidebar-${width}`;
  const sections = [
    { label: 'WORKSPACE', items: [
      { id: 'home', label: 'Home', kind: 'panel' },
      { id: 'chat', label: 'Chat', kind: 'both' },
      { id: 'studio', label: 'Studio', kind: 'panel' },
      { id: 'library', label: 'Library', kind: 'panel' },
      { id: 'media', label: 'Media', kind: 'panel' },
      { id: 'inbox', label: 'Inbox', kind: 'panel' },
    ]},
    { label: 'INTELLIGENCE', items: [
      { id: 'insights', label: 'Insights', kind: 'panel' },
      { id: 'trends', label: 'Trends', kind: 'route' },
      { id: 'radar', label: 'Radar', kind: 'route' },
      { id: 'inspiration', label: 'Inspiration', kind: 'panel' },
      { id: 'dna', label: 'DNA', kind: 'panel' },
      { id: 'memory', label: 'Memory', kind: 'panel' },
      { id: 'studies', label: 'Studies', kind: 'route' },
    ]},
    { label: 'OUTPUT', items: [
      { id: 'formats', label: 'Formats', kind: 'panel' },
      { id: 'clip-lab', label: 'Clip Lab', kind: 'panel' },
      { id: 'repurpose', label: 'Repurpose', kind: 'route' },
      { id: 'stories', label: 'Stories', kind: 'panel' },
      { id: 'publishing', label: 'Publishing', kind: 'panel' },
      { id: 'linkinbio', label: 'Link in Bio', kind: 'panel' },
      { id: 'mediakit', label: 'Media Kit', kind: 'panel' },
    ]},
  ];

  if (width === 'narrow') {
    // icon-only rail
    const allItems = sections.flatMap(s => s.items);
    return (
      <aside className={klass}>
        <div className="wf-box" style={{ width: 22, height: 22, background: '#1a1a1a', color: '#fafaf7', border: 'none', fontSize: 10, fontWeight: 700 }}>C</div>
        <div style={{ height: 8 }} />
        {allItems.map(it => (
          <div key={it.id} className={`wf-nav-item ${active === it.id ? 'is-active' : ''}`} style={{ padding: 5, width: 28, justifyContent: 'center' }}>
            <span className="wf-glyph" />
          </div>
        ))}
      </aside>
    );
  }

  return (
    <aside className={klass}>
      {compactHeader && (
        <div className="wf-row" style={{ marginBottom: 6 }}>
          <div className="wf-box" style={{ width: 22, height: 22, background: '#1a1a1a', color: '#fafaf7', border: 'none', fontSize: 10, fontWeight: 700 }}>C</div>
          <span className="wf-title" style={{ fontSize: 12 }}>COOPR</span>
        </div>
      )}
      {sections.map(sec => (
        <div key={sec.label}>
          <div className="wf-section-header">{sec.label}</div>
          {sec.items.map(it => (
            <div key={it.id} className={`wf-nav-item ${active === it.id ? 'is-active' : ''}`}>
              {showIcons && <span className="wf-glyph" />}
              <span style={{ flex: 1 }}>{it.label}</span>
            </div>
          ))}
        </div>
      ))}
      <div style={{ flex: 1 }} />
      <div className="wf-nav-item" style={{ opacity: 0.7 }}>
        <span className="wf-glyph" />
        <span>Settings</span>
      </div>
      <Creator />
    </aside>
  );
}

// Chat composer — the persistent input
function Composer({ placeholder = 'Ask, search, or start something…', compact = false, chips = ['@library', '@dna', 'Model: Sonnet'], accent = false }) {
  return (
    <div className="wf-composer" style={compact ? { padding: '8px 10px' } : undefined}>
      <div style={{ color: 'var(--wf-ink-3)', fontSize: compact ? 10 : 11 }}>{placeholder}</div>
      <div className="wf-composer-chips">
        {chips.map((c, i) => (
          <span key={i} className={`wf-chip ${i === 0 && accent ? 'wf-chip-accent' : ''}`}>{c}</span>
        ))}
        <span style={{ flex: 1 }} />
        <span className="wf-chip">↑</span>
      </div>
    </div>
  );
}

// conversation rail
function ConvoRail({ width = 180, active = 1, highlight = true }) {
  const items = [
    'New conversation',
    'Dive safety Reels batch',
    'Carousel retention audit',
    'March Clip Lab scores',
    'Hook review — Fiji series',
    'Repurpose Q2 calendar',
  ];
  return (
    <div style={{ width, flex: `0 0 ${width}px`, borderRight: '1px solid var(--wf-line)', background: 'var(--wf-paper-2)', padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div className="wf-section-header">CONVERSATIONS</div>
      {items.map((t, i) => (
        <div key={i} className={`wf-rail-item ${highlight && i === active ? 'is-active' : ''}`}>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{i === 0 ? '+ ' + t : t}</span>
        </div>
      ))}
    </div>
  );
}

// placeholder surface stubs rendered inside chat ("typed blocks")
function ChatBlock({ kind, title, children, style }) {
  return (
    <div className="wf-sketch wf-sketch-thin" style={{ padding: '8px 10px', background: 'var(--wf-paper-2)', borderRadius: 6, ...style }}>
      <div className="wf-row" style={{ justifyContent: 'space-between', marginBottom: 6 }}>
        <span className="wf-label">{kind}</span>
        <span className="wf-meta">{title}</span>
      </div>
      {children}
    </div>
  );
}

function MiniChart({ bars = 9, accentIndex = -1 }) {
  const heights = [14, 22, 18, 28, 36, 26, 34, 40, 30];
  return (
    <div className="wf-chart">
      {Array.from({ length: bars }, (_, i) => (
        <span
          key={i}
          style={{
            height: heights[i % heights.length],
            opacity: accentIndex === i ? 1 : 0.55,
            background: accentIndex === i ? 'var(--wf-note)' : 'var(--wf-accent)',
          }}
        />
      ))}
    </div>
  );
}

// table row for library / insights list placeholders
function TableRows({ rows = 4, cols = 4 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {Array.from({ length: rows }, (_, r) => (
        <div key={r} className="wf-row" style={{ padding: '6px 8px', borderBottom: '1px solid var(--wf-line)', fontSize: 10, color: 'var(--wf-ink-2)' }}>
          {Array.from({ length: cols }, (_, c) => (
            <div key={c} className="wf-grow" style={{ maxWidth: c === 0 ? '40%' : '25%' }}>
              <span style={{ display: 'block', height: 5, background: 'var(--wf-line)', borderRadius: 2, width: `${60 + ((r + c) * 7) % 30}%` }} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// phone frame (tiny) for library in-flight context
function PhoneMini({ w = 52, h = 95 }) {
  return (
    <div style={{ width: w, height: h, border: '1.5px solid var(--wf-ink-2)', borderRadius: 10, background: 'var(--wf-paper-2)', position: 'relative', flex: `0 0 ${w}px` }}>
      <div style={{ position: 'absolute', top: 3, left: '50%', transform: 'translateX(-50%)', width: 14, height: 3, background: 'var(--wf-ink-2)', borderRadius: 2 }} />
      <div className="wf-hatch-fine" style={{ position: 'absolute', top: 10, bottom: 6, left: 4, right: 4, borderRadius: 4 }} />
    </div>
  );
}

Object.assign(window, {
  Pin, AbEdge, Textlines, Hatch, Squiggle,
  Creator, KeyCombo, Sidebar, Composer, ConvoRail,
  ChatBlock, MiniChart, TableRows, PhoneMini,
});
