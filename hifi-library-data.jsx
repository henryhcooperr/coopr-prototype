/* global React, BackendNote, FreshnessPill, MetricCell, Spark, Sparkbar, ChannelGlyph, SectionHead, RankedRow, SlimRail, QuietTopbar, UserPill */
// hifi-library-data.jsx — data-rich Library: archive grid + sortable table view.

const LD = window.HF_DATA;

function HF_LibraryArchive() {
  const railGroups = [
    { label: 'Workspace', items: [
      { label: 'Home' },
      { label: 'Studio',   meta: '8' },
      { label: 'Inbox',    meta: '23' },
      { label: 'Library',  meta: '142', active: true },
      { label: 'Insights' },
      { label: 'Pulse' },
    ]},
    { label: 'Library · views', items: [
      { label: 'Archive · grid',   active: true },
      { label: 'Table · sortable', meta: '142' },
      { label: 'By format' },
      { label: 'By pillar' },
      { label: 'By series' },
    ]},
    { label: 'Series', items: [
      { label: 'Fiji wreck',     meta: '1' },
      { label: 'Safety primers', meta: '14' },
      { label: 'Gear teardowns', meta: '8' },
      { label: 'Truk Lagoon',    meta: '6' },
    ]},
  ];

  const posts = LD.posts;

  return (
    <HfShell workspace="library" subtab="All" subtabRight={<FreshnessPill at="6m ago" state="fresh" />}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, background: 'var(--bg-base)', overflow: 'auto' }}>

        {/* Header */}
        <div style={{ padding: '18px 28px 14px', background: 'var(--surface-1)', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div>
              <span className="hf-byline" style={{ fontSize: 10, marginBottom: 4, display: 'block' }}>Library · published archive</span>
              <h2 className="hf-headline" style={{ fontSize: 26, margin: 0 }}>142 posts. <span style={{ color: 'var(--fg-tertiary)', fontStyle: 'italic', fontWeight: 400 }}>Eighteen months of work.</span></h2>
            </div>
            <div style={{ display: 'flex', gap: 16, alignItems: 'baseline' }}>
              <span className="hf-byline" style={{ fontSize: 9.5 }}>filter</span>
              <span className="hf-tag hf-tag-accent">all channels</span>
              <span className="hf-tag">all pillars</span>
              <span className="hf-tag">last 12mo</span>
              <span style={{ width: 1, height: 14, background: 'var(--border-subtle)' }} />
              <span className="hf-byline" style={{ fontSize: 9.5 }}>sort</span>
              <span style={{ fontSize: 12, fontWeight: 600 }}>retention ↓</span>
            </div>
          </div>
        </div>

        {/* Sub-strip · KPIs across library */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', padding: '12px 0', background: 'var(--surface-1)', borderBottom: '1px solid var(--border-subtle)' }}>
          <MetricCell label="Total posts" value="142" deltaSub="all-time" />
          <div style={{ borderLeft: '1px solid var(--border-subtle)' }}><MetricCell label="Top quartile" value="36" delta={+2.1} deltaSub="vs prev qtr" accent /></div>
          <div style={{ borderLeft: '1px solid var(--border-subtle)' }}><MetricCell label="Avg retention" value="58.7%" delta={+1.8} /></div>
          <div style={{ borderLeft: '1px solid var(--border-subtle)' }}><MetricCell label="Saves · all-time" value="186K" delta={+28.4} /></div>
          <div style={{ borderLeft: '1px solid var(--border-subtle)' }}><MetricCell label="In repurpose queue" value="4" deltaSub="from 0042, 0044" annotate="repurpose engine" /></div>
        </div>

        {/* Body grid · post cards */}
        <div style={{ flex: 1, padding: '20px 28px', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <span className="hf-byline" style={{ fontSize: 10 }}>Last 12 · ranked by retention</span>
            <span className="hf-byline" style={{ fontSize: 10 }}>showing 1–12 of 142</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, flex: 1, overflow: 'hidden' }}>
            {posts.map((p, i) => <PostCard key={p.id} p={p} rank={i + 1} />)}
          </div>
        </div>
      </div>
    </HfShell>
  );
}

function PostCard({ p, rank }) {
  const isTop = p.watchPct >= 0.65;
  const channelMap = { yt: 'YouTube', ig: 'Instagram', tt: 'TikTok' };
  return (
    <div style={{
      background: 'var(--surface-1)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      padding: '12px 14px',
      display: 'flex', flexDirection: 'column', gap: 10,
      borderTop: isTop ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <ChannelGlyph id={p.channel} size={18} />
        <span className="hf-num" style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-tertiary)' }}>{p.id}</span>
        <span style={{ fontSize: 10, color: 'var(--fg-tertiary)' }}>· {channelMap[p.channel]} · {p.format}</span>
        <span style={{ flex: 1 }} />
        <span className="hf-num" style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--fg-tertiary)' }}>#{String(rank).padStart(2,'0')}</span>
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-primary)', lineHeight: 1.4, minHeight: 36 }}>{p.title}</div>

      {/* mini retention preview */}
      <div style={{ background: 'var(--bg-base)', borderRadius: 4, padding: '6px 8px' }}>
        <Spark data={p.retention} w={200} h={24} accent={isTop} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
        <Stat label="watched" val={`${(p.watchPct * 100).toFixed(0)}%`} accent={isTop} />
        <Stat label="views" val={LD.fmtNum(p.views)} />
        <Stat label="saves" val={LD.fmtNum(p.saves)} accent={p.saves >= 4000} />
      </div>
      <div style={{ fontSize: 10.5, fontFamily: 'var(--font-mono)', color: 'var(--fg-tertiary)' }}>
        {p.publishedAt} · hook {p.hookLen}s · {p.comments} comments
      </div>
    </div>
  );
}

function Stat({ label, val, accent }) {
  return (
    <div>
      <div className="hf-byline" style={{ fontSize: 8.5, marginBottom: 1 }}>{label}</div>
      <div className="hf-num" style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: accent ? 'var(--accent-primary)' : 'var(--fg-primary)' }}>{val}</div>
    </div>
  );
}


// ─── Library · sortable table view ─────────────────────────
function HF_LibraryTable() {
  const railGroups = [
    { label: 'Workspace', items: [
      { label: 'Home' },
      { label: 'Studio',   meta: '8' },
      { label: 'Inbox',    meta: '23' },
      { label: 'Library',  meta: '142', active: true },
      { label: 'Insights' },
      { label: 'Pulse' },
    ]},
    { label: 'Library · views', items: [
      { label: 'Archive · grid' },
      { label: 'Table · sortable', meta: '142', active: true },
      { label: 'By format' },
    ]},
  ];

  const sorted = [...LD.posts].sort((a, b) => b.watchPct - a.watchPct);

  return (
    <HfShell workspace="library" subtab="All" subtabRight={<FreshnessPill at="6m ago" state="fresh" />}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, background: 'var(--bg-base)', overflow: 'auto' }}>

        <div style={{ padding: '18px 28px 14px', background: 'var(--surface-1)', borderBottom: '1px solid var(--border-subtle)' }}>
          <span className="hf-byline" style={{ fontSize: 10, marginBottom: 4, display: 'block' }}>Library · table · all 142</span>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <h2 className="hf-headline" style={{ fontSize: 24, margin: 0 }}>Sortable archive</h2>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="hf-btn hf-btn-secondary hf-btn-sm">+ column</button>
              <button className="hf-btn hf-btn-secondary hf-btn-sm">Export CSV</button>
            </div>
          </div>
        </div>

        <div style={{ flex: 1, padding: '0 28px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--fg-primary)', background: 'var(--bg-base)' }}>
                {['#','id','channel','title','pillar','format','published','views','watch%','retention','saves','comments','hook'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '12px 8px', fontFamily: 'var(--font-mono)', fontSize: 9.5, fontWeight: 600, color: 'var(--fg-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((p, i) => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={tdStyle()}><span className="hf-num" style={{ fontFamily: 'var(--font-mono)', color: 'var(--fg-tertiary)' }}>{String(i+1).padStart(2,'0')}</span></td>
                  <td style={tdStyle()}><span className="hf-num" style={{ fontFamily: 'var(--font-mono)', color: 'var(--fg-tertiary)' }}>{p.id}</span></td>
                  <td style={tdStyle()}><ChannelGlyph id={p.channel} size={14} /></td>
                  <td style={{ ...tdStyle(), fontWeight: 500, color: 'var(--fg-primary)', maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</td>
                  <td style={tdStyle()}><span className="hf-tag" style={{ height: 18, fontSize: 10 }}>{p.pillar}</span></td>
                  <td style={{ ...tdStyle(), fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--fg-tertiary)' }}>{p.format}</td>
                  <td style={{ ...tdStyle(), fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--fg-tertiary)' }}>{p.publishedAt}</td>
                  <td style={{ ...tdStyle(), fontFamily: 'var(--font-mono)', textAlign: 'right' }}>{LD.fmtNum(p.views)}</td>
                  <td style={{ ...tdStyle(), fontFamily: 'var(--font-mono)', textAlign: 'right', color: p.watchPct >= 0.6 ? 'var(--tone-success)' : 'var(--fg-secondary)', fontWeight: 600 }}>{(p.watchPct*100).toFixed(0)}%</td>
                  <td style={tdStyle()}><Spark data={p.retention} w={70} h={18} accent={p.watchPct >= 0.6} /></td>
                  <td style={{ ...tdStyle(), fontFamily: 'var(--font-mono)', textAlign: 'right' }}>{LD.fmtNum(p.saves)}</td>
                  <td style={{ ...tdStyle(), fontFamily: 'var(--font-mono)', textAlign: 'right', color: 'var(--fg-tertiary)' }}>{p.comments}</td>
                  <td style={{ ...tdStyle(), fontFamily: 'var(--font-mono)', textAlign: 'right', color: 'var(--fg-tertiary)' }}>{p.hookLen}s</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </HfShell>
  );
}

function tdStyle() { return { padding: '8px 8px', verticalAlign: 'middle' }; }

Object.assign(window, { HF_LibraryArchive, HF_LibraryTable });
