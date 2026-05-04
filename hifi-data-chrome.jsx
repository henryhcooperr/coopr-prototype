/* global React */
// hifi-data-chrome.jsx — shared atoms for the data-rich pages.

// Backend annotation flag — visible only when ?annotate=1 in URL or
// data-annotate="true" on body. Default: visible. Toggle later with tweaks.
function BackendNote({ children, kind = 'gap' }) {
  const map = {
    gap:    { label: 'BACKEND',  color: 'var(--tone-warning)',  bg: 'var(--tone-warning-bg)' },
    new:    { label: 'NEW DATA', color: 'var(--accent-primary)', bg: 'var(--accent-soft)' },
    stale:  { label: 'STALE',    color: 'var(--tone-info)',     bg: 'var(--tone-info-bg)' },
  };
  const k = map[kind];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 600,
      letterSpacing: '0.08em',
      padding: '2px 6px', borderRadius: 3,
      background: k.bg, color: k.color,
      verticalAlign: 'middle',
    }}>
      <span>{k.label}</span>
      <span style={{ opacity: 0.7 }}>·</span>
      <span style={{ fontWeight: 500, letterSpacing: '0.04em' }}>{children}</span>
    </span>
  );
}

// Data freshness pill — shown in headers
function FreshnessPill({ at = '4 min ago', state = 'fresh' }) {
  const map = {
    fresh:    { dot: 'var(--tone-success)', label: 'live' },
    syncing:  { dot: 'var(--tone-info)',     label: 'syncing' },
    stale:    { dot: 'var(--tone-warning)',  label: 'stale' },
  };
  const k = map[state];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: 'var(--fg-tertiary)' }}>
      <span className="hf-dot" style={{ background: k.dot }} />
      <span style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>{k.label}</span>
      <span>·</span>
      <span style={{ fontFamily: 'var(--font-mono)' }}>{at}</span>
    </span>
  );
}

// Tabular metric cell — top-of-page KPIs.
function MetricCell({ label, value, unit, delta, deltaSub, sparkline, accent, annotate }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '0 18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span className="hf-byline" style={{ fontSize: 10 }}>{label}</span>
        {annotate && <BackendNote kind="gap">{annotate}</BackendNote>}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 2 }}>
        <span className="hf-num" style={{
          fontFamily: 'var(--font-serif)', fontSize: 26, fontWeight: 600,
          color: accent ? 'var(--accent-primary)' : 'var(--fg-primary)',
          letterSpacing: '-0.02em', lineHeight: 1,
        }}>{value}</span>
        {unit && <span style={{ fontSize: 11, color: 'var(--fg-tertiary)', fontFamily: 'var(--font-mono)' }}>{unit}</span>}
      </div>
      {(delta !== undefined || sparkline) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
          {delta !== undefined && (
            <span className="hf-num" style={{ fontSize: 11.5, color: delta >= 0 ? 'var(--tone-success)' : 'var(--tone-danger)', fontFamily: 'var(--font-mono)' }}>
              {delta >= 0 ? '↑' : '↓'} {Math.abs(delta).toFixed(1)}%
            </span>
          )}
          {deltaSub && <span style={{ fontSize: 11, color: 'var(--fg-tertiary)' }}>{deltaSub}</span>}
          {sparkline && <span style={{ flex: 1 }}>{sparkline}</span>}
        </div>
      )}
    </div>
  );
}

// Inline horizontal sparkline.
function Spark({ data, w = 80, h = 22, accent = false }) {
  const max = Math.max(...data) || 1;
  const min = Math.min(...data);
  const stepX = w / (data.length - 1);
  const range = (max - min) || 1;
  const pts = data.map((v, i) => `${(i * stepX).toFixed(1)},${(h - ((v - min) / range) * (h - 4) - 2).toFixed(1)}`).join(' ');
  return (
    <svg width={w} height={h} style={{ display: 'block' }}>
      <polyline points={pts} fill="none" stroke={accent ? 'var(--accent-primary)' : 'var(--fg-secondary)'} strokeWidth={1.25} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

// Sparkbar (mini bars) — for compact distributions.
function Sparkbar({ data, w = 80, h = 22, highlightIdx = -1 }) {
  const max = Math.max(...data) || 1;
  const barW = (w - (data.length - 1) * 1.5) / data.length;
  return (
    <svg width={w} height={h} style={{ display: 'block' }}>
      {data.map((v, i) => {
        const bh = (v / max) * (h - 2);
        const fill = i === highlightIdx ? 'var(--accent-primary)' : 'var(--fg-tertiary)';
        return <rect key={i} x={i * (barW + 1.5)} y={h - bh} width={barW} height={bh} fill={fill} rx={0.5} />;
      })}
    </svg>
  );
}

// Channel glyph — a tiny letter badge so we don't lean on emoji.
function ChannelGlyph({ id, size = 18 }) {
  const map = {
    yt: { letter: 'Y', bg: '#9a3838',         fg: '#fdfcf9' },
    ig: { letter: 'I', bg: 'var(--accent-primary)', fg: '#fdfcf9' },
    tt: { letter: 'T', bg: 'var(--surface-ink)',     fg: '#fdfcf9' },
  };
  const c = map[id] || { letter: '·', bg: 'var(--surface-2)', fg: 'var(--fg-tertiary)' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: size, height: size,
      borderRadius: 3,
      background: c.bg, color: c.fg,
      fontFamily: 'var(--font-mono)', fontSize: size * 0.55, fontWeight: 600,
      flexShrink: 0,
    }}>{c.letter}</span>
  );
}

// Section header — used inside data-rich pages (not the topbar).
function SectionHead({ kicker, title, right, rule = true, italic = false }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, paddingBottom: 6, borderBottom: rule ? '1px solid var(--fg-primary)' : 'none' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
          {kicker && <span className="hf-byline" style={{ fontSize: 10 }}>{kicker}</span>}
          <span style={{
            fontFamily: italic ? 'var(--font-serif)' : 'inherit',
            fontStyle: italic ? 'italic' : 'normal',
            fontSize: italic ? 18 : 14,
            fontWeight: italic ? 500 : 600,
            color: 'var(--fg-primary)',
            letterSpacing: italic ? '-0.01em' : '0',
          }}>{title}</span>
        </div>
        {right && <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{right}</div>}
      </div>
    </div>
  );
}

// Generic card-less row with leading rank, used in leaderboards.
function RankedRow({ rank, lead, body, trail, accent }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '36px 1fr auto', gap: 14,
      padding: '12px 0', alignItems: 'center',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      <span className="hf-num" style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 600, color: accent ? 'var(--accent-primary)' : 'var(--fg-tertiary)', letterSpacing: '0.02em' }}>
        {String(rank).padStart(2, '0')}
      </span>
      <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {typeof lead === 'string' ? <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--fg-primary)' }}>{lead}</span> : lead}
        {body && (typeof body === 'string' ? <span style={{ fontSize: 12, color: 'var(--fg-tertiary)', lineHeight: 1.4 }}>{body}</span> : body)}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>{trail}</div>
    </div>
  );
}

// Side rail — slim, for left navigation in data-rich pages.
function SlimRail({ groups, footer }) {
  return (
    <aside style={{
      width: 220,
      background: 'var(--surface-1)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex', flexDirection: 'column',
      flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '14px 14px 10px' }}>
        <span className="hf-logo" style={{ width: 22, height: 22 }}>C</span>
        <span style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: '0.06em', color: 'var(--fg-primary)' }}>COOPR</span>
      </div>
      <div style={{ padding: '0 8px 8px' }}>
        <div style={{ height: 30, padding: '0 10px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--fg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)' }}>
          <span style={{ width: 10, height: 10, border: '1.5px solid var(--fg-tertiary)', borderRadius: '50%' }} />
          <span style={{ flex: 1 }}>Search · jump</span>
          <span className="hf-key" style={{ fontSize: 10 }}>⌘K</span>
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'hidden', padding: '6px 0' }}>
        {groups.map((g, gi) => (
          <div key={gi} style={{ marginBottom: 12 }}>
            {g.label && (
              <div style={{ padding: '0 16px 6px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <span className="hf-byline" style={{ fontSize: 9.5 }}>{g.label}</span>
                {g.meta && <span className="hf-num" style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-tertiary)' }}>{g.meta}</span>}
              </div>
            )}
            <div>
              {g.items.map((it, i) => (
                <div key={i} style={{
                  height: 28,
                  padding: '0 16px',
                  display: 'flex', alignItems: 'center', gap: 8,
                  fontSize: 12.5,
                  fontWeight: it.active ? 600 : 500,
                  color: it.active ? 'var(--fg-primary)' : 'var(--fg-secondary)',
                  background: it.active ? 'var(--surface-2)' : 'transparent',
                  borderLeft: it.active ? '2px solid var(--accent-primary)' : '2px solid transparent',
                  cursor: 'default',
                }}>
                  <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.label}</span>
                  {it.meta != null && <span className="hf-num" style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--fg-tertiary)' }}>{it.meta}</span>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {footer && <div style={{ padding: '10px 14px 12px', borderTop: '1px solid var(--border-subtle)' }}>{footer}</div>}
    </aside>
  );
}

// Top tabs row (workspace switcher + status). Replaces full topbar in data pages.
function QuietTopbar({ active = 'studio', right }) {
  const tabs = [
    { id: 'home',     label: 'Home' },
    { id: 'studio',   label: 'Studio' },
    { id: 'library',  label: 'Library' },
    { id: 'insights', label: 'Insights' },
    { id: 'pulse',    label: 'Pulse' },
    { id: 'inbox',    label: 'Inbox' },
  ];
  return (
    <div style={{
      height: 50,
      padding: '0 24px',
      display: 'flex', alignItems: 'center',
      borderBottom: '1px solid var(--border-subtle)',
      background: 'var(--surface-1)',
      position: 'relative',
    }}>
      <div style={{ display: 'flex', gap: 24, position: 'absolute', left: '50%', transform: 'translateX(-50%)', height: 50, alignItems: 'center' }}>
        {tabs.map(t => (
          <span key={t.id} style={{
            fontSize: 12.5,
            fontWeight: active === t.id ? 600 : 400,
            color: active === t.id ? 'var(--fg-primary)' : 'var(--fg-tertiary)',
            cursor: 'default',
            position: 'relative',
            paddingBottom: 2,
            borderBottom: active === t.id ? '1.5px solid var(--fg-primary)' : 'none',
            height: 50,
            display: 'inline-flex', alignItems: 'center',
          }}>
            {t.label}
          </span>
        ))}
      </div>
      <span style={{ flex: 1 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {right}
      </div>
    </div>
  );
}

// User pill for sidebars
function UserPill({ density = 'default' }) {
  const data = window.HF_DATA;
  const handle = data ? data.creator.handle : '@henry.dives';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
      <span className="hf-avatar" style={{ width: 26, height: 26 }} />
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
        <span style={{ fontSize: 12.5, color: 'var(--fg-primary)', fontWeight: 600 }}>{handle}</span>
        <span style={{ fontSize: 10.5, color: 'var(--fg-tertiary)' }}>Pro · 7 scheduled</span>
      </div>
      <span style={{ fontSize: 13, color: 'var(--fg-tertiary)' }}>···</span>
    </div>
  );
}

Object.assign(window, {
  BackendNote, FreshnessPill, MetricCell, Spark, Sparkbar,
  ChannelGlyph, SectionHead, RankedRow, SlimRail, QuietTopbar, UserPill,
});
