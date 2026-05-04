/* global React */
// hifi-chrome.jsx — shared chrome for all hi-fi screens.
// Topbar, sub-tabs, side rails, scoped composer, building-block atoms.

const HF_TABS = [
  { id: 'studio',   label: 'Studio' },
  { id: 'audience', label: 'Audience' },
  { id: 'library',  label: 'Library' },
  { id: 'pulse',    label: 'Pulse' },
];

const HF_SUBTABS = {
  studio:   ['Threads', 'Drafts', 'Schedule', 'Brand voice'],
  audience: ['Overview', 'Retention', 'Comments', 'Followers', 'Segments'],
  library:  ['All', 'Posts', 'Drafts', 'Charts', 'Notes', 'Decisions'],
  pulse:    ['For you', 'Creator niche', 'Your audience', 'Mentions'],
};

function HfTopbar({ active = 'studio' }) {
  return (
    <div className="hf-topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 200 }}>
        <span className="hf-logo">C</span>
        <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.04em', color: 'var(--fg-primary)' }}>COOPR</span>
      </div>
      <div style={{ display: 'flex', gap: 28, position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
        {HF_TABS.map(t => (
          <span key={t.id} className={`hf-tab ${active === t.id ? 'is-active' : ''}`}>{t.label}</span>
        ))}
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 12, color: 'var(--fg-secondary)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span className="hf-dot" style={{ background: 'var(--tone-success)' }} />
          7 scheduled
        </span>
        <span style={{ fontSize: 12, color: 'var(--fg-tertiary)' }}>Wed · Apr 24</span>
        <span className="hf-cmdk">
          <span style={{ width: 10, height: 10, border: '1.5px solid var(--fg-tertiary)', borderRadius: '50%' }} />
          <span style={{ flex: 1 }}>Search · jump · ask</span>
          <span className="hf-key">⌘</span><span className="hf-key">K</span>
        </span>
        <span className="hf-avatar" />
      </div>
    </div>
  );
}

function HfSubtabs({ workspace, active, right = null }) {
  const items = HF_SUBTABS[workspace] || [];
  return (
    <div className="hf-subtabs">
      <div style={{ display: 'flex', gap: 22, height: '100%' }}>
        {items.map(label => (
          <span key={label} className={`hf-subtab ${label === active ? 'is-active' : ''}`}>{label}</span>
        ))}
      </div>
      <span style={{ flex: 1 }} />
      {right}
    </div>
  );
}

// Side rail per workspace. Lists same items as wireframe rails.
function HfRail({ workspace, active }) {
  const setups = {
    studio: {
      label: 'WORKSPACE',
      items: [
        { id: 'threads',  label: 'Threads',     meta: '6' },
        { id: 'pinned',   label: 'Pinned',      meta: '2' },
        { id: 'drafts',   label: 'Drafts',      meta: '12' },
        { id: 'schedule', label: 'Schedule',    meta: '7' },
      ],
      label2: 'SERIES',
      items2: [
        { id: 'fiji',     label: 'Fiji wreck series',   meta: '4' },
        { id: 'safety',   label: 'Dive-safety primers', meta: '3' },
        { id: 'gear',     label: 'Gear teardowns',      meta: '5' },
      ],
    },
    audience: {
      label: 'VIEWS',
      items: [
        { id: 'overview',   label: 'Overview' },
        { id: 'retention',  label: 'Retention' },
        { id: 'comments',   label: 'Comments',   meta: '142' },
        { id: 'followers',  label: 'Followers' },
        { id: 'segments',   label: 'Segments',   meta: '6' },
      ],
      label2: 'SAVED',
      items2: [
        { id: 'safety-cohort', label: 'Safety-curious cohort' },
        { id: 'mentions-30d',  label: 'Mentions · 30d' },
      ],
    },
    library: {
      label: 'VIEWS',
      items: [
        { id: 'all',        label: 'All',         meta: '1,284' },
        { id: 'posts',      label: 'Posts',       meta: '847' },
        { id: 'drafts',     label: 'Drafts',      meta: '12' },
        { id: 'charts',     label: 'Charts',      meta: '34' },
        { id: 'notes',      label: 'Notes',       meta: '58' },
        { id: 'decisions',  label: 'Decisions',   meta: '11' },
      ],
      label2: 'LENSES',
      items2: [
        { id: 'series',  label: 'Series',  meta: '4' },
        { id: 'pillars', label: 'Pillars', meta: '3' },
        { id: 'formats', label: 'Formats', meta: '6' },
      ],
    },
    pulse: {
      label: 'VIEWS',
      items: [
        { id: 'foryou',   label: 'For you' },
        { id: 'niche',    label: 'Creator niche' },
        { id: 'audience', label: 'Your audience' },
        { id: 'mentions', label: 'Mentions',  meta: '23' },
      ],
      label2: 'TRACKING',
      items2: [
        { id: 'creators', label: 'Creators',   meta: '14' },
        { id: 'topics',   label: 'Topics',     meta: '9' },
      ],
    },
  };
  const s = setups[workspace];
  if (!s) return null;
  return (
    <aside className="hf-rail">
      <div className="hf-rail-label">{s.label}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {s.items.map(it => (
          <div key={it.id} className={`hf-rail-item ${active === it.id ? 'is-active' : ''}`}>
            <span style={{ width: 14, height: 14, borderRadius: 3, background: 'var(--surface-2)', border: '1px solid var(--border-subtle)' }} />
            <span>{it.label}</span>
            {it.meta && <span className="hf-rail-meta hf-num">{it.meta}</span>}
          </div>
        ))}
      </div>
      <div className="hf-rail-label" style={{ marginTop: 18 }}>{s.label2}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {s.items2.map(it => (
          <div key={it.id} className="hf-rail-item">
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--border-strong)' }} />
            <span>{it.label}</span>
            {it.meta && <span className="hf-rail-meta hf-num">{it.meta}</span>}
          </div>
        ))}
      </div>
      <div style={{ flex: 1 }} />
      <div className="hf-rail-item" style={{ opacity: 0.7 }}>
        <span style={{ width: 14, height: 14, borderRadius: 3, background: 'var(--surface-2)', border: '1px solid var(--border-subtle)' }} />
        <span>Settings</span>
      </div>
    </aside>
  );
}

// Scoped composer — bar variant (top of content) + hero variant (empty state).
function HfComposerBar({ workspace = 'audience' }) {
  const placeholders = {
    studio:   'Draft anything, or ask to make something.',
    audience: 'Ask anything about your audience.',
    library:  'Search your library, or ask.',
  };
  const chips = {
    studio:   ['@library', 'Sonnet'],
    audience: ['scope · all series · 30d', 'Sonnet'],
    library:  ['all artifacts', 'Sonnet'],
  };
  return (
    <div className="hf-composer-bar">
      <span style={{ width: 12, height: 12, border: '1.5px solid var(--fg-tertiary)', borderRadius: '50%', flexShrink: 0 }} />
      <span style={{ flex: 1, fontSize: 13, color: 'var(--fg-tertiary)' }}>{placeholders[workspace]}</span>
      {chips[workspace].map(c => <span key={c} className="hf-tag">{c}</span>)}
      <span className="hf-send">↑</span>
    </div>
  );
}

function HfComposerHero({ workspace = 'studio', suggestions = [] }) {
  const placeholders = {
    studio: 'Draft anything, or ask to make something.',
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
      <div className="hf-composer-hero">
        <div style={{ padding: '20px 22px 14px', minHeight: 64, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span style={{ fontSize: 16, color: 'var(--fg-tertiary)' }}>{placeholders[workspace]}</span>
        </div>
        <div style={{ padding: '10px 14px', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface-2)' }}>
          <span className="hf-tag">＠ library</span>
          <span className="hf-tag">＠ audience</span>
          <span className="hf-tag">+ Attach</span>
          <span className="hf-tag">Sonnet</span>
          <span style={{ flex: 1 }} />
          <span style={{ fontSize: 11, color: 'var(--fg-tertiary)' }}>↵ to send</span>
          <span className="hf-send">↑</span>
        </div>
      </div>
      {suggestions.length > 0 && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 720 }}>
          {suggestions.map((s, i) => (
            <span key={i} className="hf-tag" style={{ background: 'var(--surface-1)', borderColor: 'var(--border-default)', color: 'var(--fg-primary)' }}>{s}</span>
          ))}
        </div>
      )}
    </div>
  );
}

// Pill composer for analytical surfaces — chat, one click away.
function HfPillComposer({ scope = 'this view' }) {
  return (
    <div style={{
      position: 'absolute', left: '50%', bottom: 24, transform: 'translateX(-50%)',
      display: 'flex', alignItems: 'center',
      background: 'var(--surface-1)',
      border: '1px solid var(--border-default)',
      borderRadius: 999,
      boxShadow: 'var(--shadow-md)',
      overflow: 'hidden',
    }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '9px 16px', fontSize: 12.5, color: 'var(--fg-secondary)' }}>
        <span className="hf-dot" style={{ background: 'var(--accent-primary)' }} />
        Ask about <span style={{ color: 'var(--fg-primary)', fontWeight: 600 }}>{scope}</span>
      </span>
      <span style={{ width: 1, alignSelf: 'stretch', background: 'var(--border-subtle)' }} />
      <span style={{ padding: '9px 14px', fontSize: 11, color: 'var(--fg-tertiary)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        <span className="hf-key">⌘</span><span className="hf-key">L</span>
      </span>
    </div>
  );
}

// Tiny atoms ──────────────────────────────────────────────────
function HfDelta({ value, sub }) {
  // Restrained delta — no green pill. Uses arrow + secondary color.
  const positive = value > 0;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--fg-secondary)', fontWeight: 500 }} className="hf-num">
      <span style={{ color: positive ? 'var(--tone-success)' : 'var(--tone-danger)' }}>{positive ? '↑' : '↓'}</span>
      {Math.abs(value)}%
      {sub && <span style={{ color: 'var(--fg-tertiary)', fontWeight: 400 }}>{sub}</span>}
    </span>
  );
}

function HfStat({ label, value, unit, delta, deltaSub }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontSize: 11.5, color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span className="hf-num" style={{ fontSize: 26, fontWeight: 700, color: 'var(--fg-primary)', letterSpacing: '-0.01em' }}>{value}</span>
        {unit && <span style={{ fontSize: 13, color: 'var(--fg-tertiary)' }}>{unit}</span>}
      </div>
      {delta !== undefined && <HfDelta value={delta} sub={deltaSub} />}
    </div>
  );
}

// Sparkline — thin line, tabular, no gradient fill.
function HfSparkline({ data, width = 120, height = 32, accent = false, dual = false }) {
  const max = Math.max(...data) || 1;
  const min = Math.min(...data);
  const stepX = width / (data.length - 1);
  const pts = data.map((v, i) => `${i * stepX},${height - ((v - min) / (max - min || 1)) * (height - 4) - 2}`).join(' ');
  const color = accent ? 'var(--accent-primary)' : 'var(--fg-secondary)';
  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

// Bar mini-chart — restrained two-tone option supports the variant pressure-test.
function HfMiniBars({ data, width = 200, height = 60, palette = 'mono' }) {
  // palette: 'mono' (single accent), 'two-tone' (accent + ink), 'monochrome' (warm clay scale)
  const max = Math.max(...data) || 1;
  const barW = (width - (data.length - 1) * 3) / data.length;
  return (
    <svg width={width} height={height}>
      {data.map((v, i) => {
        const h = (v / max) * (height - 4);
        let fill = 'var(--accent-primary)';
        if (palette === 'two-tone') fill = i % 2 === 0 ? 'var(--accent-primary)' : 'var(--fg-primary)';
        if (palette === 'monochrome') {
          const opacity = 0.35 + (v / max) * 0.65;
          fill = `rgba(182, 83, 43, ${opacity.toFixed(2)})`;
        }
        return <rect key={i} x={i * (barW + 3)} y={height - h - 2} width={barW} height={h} fill={fill} rx={1.5} />;
      })}
    </svg>
  );
}

Object.assign(window, {
  HF_TABS, HF_SUBTABS,
  HfTopbar, HfSubtabs, HfRail,
  HfComposerBar, HfComposerHero, HfPillComposer,
  HfDelta, HfStat, HfSparkline, HfMiniBars,
});
