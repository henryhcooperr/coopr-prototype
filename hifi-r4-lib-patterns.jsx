/* global React, window, HfShell, R4PlatformCard, R4PillarDot, R4Stat, R4Chip, r4FmtViews */
/* hifi-r4-lib-patterns.jsx — Library round 4 · Patterns.

   Job: cross-cutting view of HOW Henry actually makes things. Not a feed,
   not a series — a meta-analysis. Three reading layers, picked via a
   left-rail switcher:

     1. PILLARS    — the four content pillars, each with their share of
                     output, performance, and characteristic posts.
     2. FORMATS    — long-form / short-form / carousel — what's working.
     3. HOOK DNA   — opening-line patterns that recur. Cold-open, declaration,
                     question, reply, list-of-N. Each pattern has examples
                     and a measured save-rate.

   Visual idea: an editorial split — a vertical "table of contents" rail on
   the left, and a long-scrolling, slightly looser layout on the right with
   serif headlines, mono captions, and a quiet stats strip. */

const R4P_DATA = window.HF_DATA;

// ─── Pattern definitions ─────────────────────────────────
const R4_PATTERNS = [
  {
    key: 'pillars',
    eyebrow: 'PATTERN · 01',
    title: 'Pillars.',
    sub: 'How your output splits across the four lanes, and which one is pulling weight.',
    blurb: 'You are mostly a safety educator who occasionally tells a wreck story. Story posts are the audience-builders; safety is the trust-builder. Gear teardowns are your highest save-per-view but smallest share. Replies are an opportunity.',
  },
  {
    key: 'formats',
    eyebrow: 'PATTERN · 02',
    title: 'Formats.',
    sub: 'Same idea, different shape. Long-form anchors, short-form pulls, carousels save.',
    blurb: 'Long-form (YT) is where audience commits. Short-form (TT/IG Reel) is where audience finds you. Carousels (IG) overweight on saves. The pattern: short-form to recruit, long-form to convert, carousel to retain.',
  },
  {
    key: 'hooks',
    eyebrow: 'PATTERN · 03',
    title: 'Hook DNA.',
    sub: 'Five opening shapes that recur in your library. Each has a measured retention curve.',
    blurb: 'Across 412 posts, five hook patterns account for 88% of openings. Cold-opens (start in the middle of action) outperform every other shape on 3-second retention by 9–14 points.',
  },
];

// ─── Pillar performance synthesized from data ────────────
const R4_PILLAR_BREAKDOWN = R4P_DATA.creator.pillars.map(p => {
  const postsInPillar = R4P_DATA.posts.filter(x => x.pillar === p.id);
  const avgWatch = postsInPillar.reduce((a, x) => a + x.watchPct, 0) / Math.max(1, postsInPillar.length);
  const totalSaves = postsInPillar.reduce((a, x) => a + x.saves, 0);
  const totalViews = postsInPillar.reduce((a, x) => a + x.views, 0);
  const saveRate = totalSaves / Math.max(1, totalViews);
  return {
    ...p,
    count: Math.round(p.share * 412),
    avgWatch,
    saveRate,
    samplePosts: postsInPillar.slice(0, 3),
    descriptor: {
      safety: 'The trust-builder. Cold-opens, 8-second rule cuts, primers. Where credibility lives.',
      gear:   'The save-magnet. Teardowns and gear comparisons. Lower volume, highest depth.',
      story:  'The audience-builder. Travel arcs and wreck stories. Where new viewers land.',
      reply:  'The community signal. Q&A and replies. Underweighted relative to engagement.',
    }[p.id],
  };
});

// ─── Format breakdown ────────────────────────────────────
const R4_FORMAT_BREAKDOWN = [
  {
    key: 'long', label: 'Long-form video', channels: 'YouTube',
    count: 186, share: 0.45,
    avgWatchPct: 0.55, avgSaveRate: 0.024,
    role: 'Conversion',
    samplePostId: '0042',
    note: 'Audience commits 5–12 minutes. Drop-offs cluster at disclaimers and at the 3-min mark — protect those.',
  },
  {
    key: 'short', label: 'Short-form vertical', channels: 'TikTok · IG Reels',
    count: 148, share: 0.36,
    avgWatchPct: 0.62, avgSaveRate: 0.012,
    role: 'Recruitment',
    samplePostId: '0039',
    note: 'Hooks must land ≤1.2s. Cold-opens beat declarations 9 points on 3-sec retention.',
  },
  {
    key: 'carousel', label: 'Carousel', channels: 'Instagram',
    count: 78, share: 0.19,
    avgWatchPct: null, avgSaveRate: 0.038,
    role: 'Retention',
    samplePostId: '0037',
    note: 'Saves 2× short-form; comments 0.4×. Use for travel arcs and gear comparisons; not for safety primers.',
  },
];

// ─── Hook DNA — 5 recurring opening shapes ───────────────
const R4_HOOK_PATTERNS = [
  {
    key: 'cold-open',
    title: 'The cold-open.',
    summary: 'Start in the middle of failure or action. Set up later.',
    example: '"My reg started free-flowing at 28 metres."',
    examplePostId: '0042',
    occurrences: 84,
    retention3s: 0.94,
    retention3sNote: '+9pts vs library average',
  },
  {
    key: 'declaration',
    title: 'The declaration.',
    summary: 'A confident opinion, stated plainly. Usually contrarian.',
    example: '"Why I trust my SPG over my dive computer."',
    examplePostId: '0045',
    occurrences: 96,
    retention3s: 0.86,
    retention3sNote: 'on par with library avg',
  },
  {
    key: 'list-of-n',
    title: 'List of N.',
    summary: 'Three things, two checks, eight breaths. Numbers earn attention.',
    example: '"Three things I check before every wreck dive."',
    examplePostId: '0046',
    occurrences: 71,
    retention3s: 0.91,
    retention3sNote: '+5pts',
  },
  {
    key: 'question',
    title: 'The question.',
    summary: 'A real question, not rhetorical. Invites the viewer to answer first.',
    example: '"Should you buy a rebreather in year two?"',
    examplePostId: '0036',
    occurrences: 38,
    retention3s: 0.79,
    retention3sNote: '−6pts; use sparingly',
  },
  {
    key: 'reply',
    title: 'The reply.',
    summary: 'Address another creator or a comment by name. Borrows their audience.',
    example: '"A reply to @marina.k on safety storytelling."',
    examplePostId: '0035',
    occurrences: 24,
    retention3s: 0.83,
    retention3sNote: 'low volume, opportunity',
  },
];

// ─── Main ────────────────────────────────────────────────
function HF_R4_LibraryPatterns({ state = 'happy' }) {
  // R10 · state variants — hooks first, returns after.
  const ovr = window.useSurfaceState && window.useSurfaceState('library', 'Patterns');
  const s = (ovr && ovr !== 'happy') ? ovr : state;
  const [focus, setFocus] = React.useState('pillars');
  if (s === 'loading') {
    return <HfShell workspace="library" subtab="Patterns" topbarRight={<R4PTopbar />}><window.HF_SkeletonHero shape="split" /></HfShell>;
  }
  if (s === 'empty') {
    return <HfShell workspace="library" subtab="Patterns" topbarRight={<R4PTopbar />}><window.HF_EmptyHero
      eyebrow="Patterns · 0 detected"
      title="No patterns yet. Coopr learns them once you ship a dozen posts."
      caption="Pillars, formats, and DNA emerge as the library grows."
      ctaLabel="Open Library"
    /></HfShell>;
  }
  if (s === 'error') {
    return <HfShell workspace="library" subtab="Patterns" topbarRight={<R4PTopbar />}><window.HF_ErrorHero
      title="Couldn't load the pattern lenses."
      body="The pattern engine timed out. Retry, or refresh the session."
    /></HfShell>;
  }
  return (
    <HfShell workspace="library" subtab="Patterns" topbarRight={<R4PTopbar />}>
      <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '260px 1fr', overflow: 'hidden', background: 'var(--bg-base)' }}>
        {/* Rail · TOC */}
        <aside style={{ borderRight: '1px solid var(--border-subtle)', background: 'var(--surface-1)', overflow: 'auto', padding: '24px 0' }}>
          <div style={{ padding: '0 22px 16px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--fg-tertiary)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Patterns</div>
            <h2 style={{ margin: '4px 0 0', fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 500, fontSize: 22, color: 'var(--fg-primary)', letterSpacing: '-0.015em' }}>The shape of your library.</h2>
            <p style={{ margin: '8px 0 0', fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--fg-tertiary)', lineHeight: 1.55 }}>Three lenses on the same 412 posts. Pick one.</p>
          </div>
          <div style={{ padding: '6px 0' }}>
            {R4_PATTERNS.map(p => (
              <R4P_RailItem key={p.key} pattern={p} active={p.key === focus} onSelect={() => setFocus(p.key)} />
            ))}
          </div>
        </aside>

        {/* Body · selected section only */}
        <main style={{ overflow: 'auto' }}>
          <R4P_DashboardBand activeKey={focus} onSelect={setFocus} />
          <div key={focus} style={{ animation: 'cv-fade-in 200ms ease' }}>
            {focus === 'pillars'  && <R4P_PillarsSection />}
            {focus === 'formats'  && <R4P_FormatsSection />}
            {focus === 'hooks'    && <R4P_HookDNASection />}
          </div>
          <div style={{ padding: '40px 48px 80px', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-tertiary)', letterSpacing: '0.1em', borderTop: '1px solid var(--border-subtle)' }}>
            END · PATTERNS · GENERATED FROM 412 POSTS · 18 MONTHS
          </div>
        </main>
      </div>
    </HfShell>
  );
}

// ─── Rail item with hover tint ───────────────────────────
function R4P_RailItem({ pattern, active, onSelect }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect && onSelect(); } }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: '12px 22px',
        borderLeft: active ? '3px solid var(--accent-primary)' : '3px solid transparent',
        background: active ? 'var(--surface-2)' : (hover ? 'var(--surface-2)' : 'transparent'),
        cursor: 'pointer',
        display: 'flex', flexDirection: 'column', gap: 2,
        transition: 'background 120ms ease',
      }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg-tertiary)', letterSpacing: '0.12em' }}>{pattern.eyebrow}</span>
      <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 16, fontWeight: 500, color: 'var(--fg-primary)', letterSpacing: '-0.01em' }}>{pattern.title}</span>
      <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--fg-tertiary)', lineHeight: 1.4 }}>{pattern.sub}</span>
    </div>
  );
}

// ─── DASHBOARD band — above-the-fold summary ─────────────
// Three cards, one per pattern, each surfaces a single killer stat.
// Anchored links jump to the matching section below. Stats hand-picked
// from the data the section computes — keep these in sync if you change
// R4_PILLAR_BREAKDOWN / R4_FORMAT_BREAKDOWN / R4_HOOK_PATTERNS.
const R4P_DASHBOARD = [
  {
    key: 'pillars',
    eyebrow: 'PATTERN · 01',
    title: 'Pillars.',
    statValue: '42%',
    statLabel: 'safety · pillar share · the trust-builder',
  },
  {
    key: 'formats',
    eyebrow: 'PATTERN · 02',
    title: 'Formats.',
    statValue: '3.8%',
    statLabel: 'carousel save rate · 2× short-form',
  },
  {
    key: 'hooks',
    eyebrow: 'PATTERN · 03',
    title: 'Hook DNA.',
    statValue: '+9pts',
    statLabel: 'cold-open over library 3-sec average',
  },
];

function R4P_DashboardBand({ activeKey, onSelect }) {
  return (
    <section style={{
      padding: '32px 48px 28px',
      borderBottom: '1px solid var(--border-subtle)',
      background: 'linear-gradient(180deg, var(--surface-2) 0%, var(--bg-base) 100%)',
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 18 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-tertiary)', letterSpacing: '0.14em' }}>OVERVIEW · THREE LENSES</div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-tertiary)', letterSpacing: '0.1em' }}>SELECT A LENS</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
        {R4P_DASHBOARD.map(c => (
          <R4P_DashboardCard key={c.key} card={c} active={c.key === activeKey} onSelect={() => onSelect && onSelect(c.key)} />
        ))}
      </div>
    </section>
  );
}

function R4P_DashboardCard({ card, active, onSelect }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      type="button"
      onClick={onSelect}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        textAlign: 'left',
        display: 'flex', flexDirection: 'column', gap: 10,
        padding: '20px 22px',
        border: active ? '1px solid var(--accent-primary)' : '1px solid var(--border-default)',
        background: active ? 'var(--surface-2)' : (hover ? 'var(--surface-2)' : 'var(--surface-1)'),
        borderRadius: 8,
        cursor: 'pointer',
        font: 'inherit',
        color: 'inherit',
        transition: 'border-color 120ms ease, background 120ms ease',
      }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent-primary)', letterSpacing: '0.14em' }}>{card.eyebrow}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: active ? 'var(--accent-primary)' : 'var(--fg-tertiary)' }}>{active ? 'ACTIVE' : 'OPEN →'}</span>
      </div>
      <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 500, fontSize: 28, color: 'var(--fg-primary)', letterSpacing: '-0.02em', lineHeight: 1 }}>
        {card.title}
      </div>
      <div style={{ marginTop: 4, paddingTop: 12, borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'baseline', gap: 10 }}>
        <span style={{ fontFamily: 'var(--font-serif)', fontSize: 36, fontWeight: 500, color: 'var(--accent-primary)', letterSpacing: '-0.025em', lineHeight: 1 }}>{card.statValue}</span>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11.5, color: 'var(--fg-secondary)', lineHeight: 1.4 }}>{card.statLabel}</span>
      </div>
    </button>
  );
}

// ─── PILLARS section ─────────────────────────────────────
// R5h upgrade: a comparison matrix at the top puts all 4 pillars on the same
// axes (volume / avg watch / save rate / cadence) so the relative performance
// reads at a glance. Below: the 2x2 detail cards, now enriched with a
// 6-month share-over-time sparkline and an italic-serif insight one-liner.
function R4P_PillarsSection() {
  const meta = R4_PATTERNS[0];
  return (
    <section id="pillars-section" style={{ padding: '36px 48px 28px', borderBottom: '1px solid var(--border-subtle)' }}>
      <R4P_SectionHead meta={meta} />
      <R4P_PillarMatrix />
      <div style={{ marginTop: 28, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {R4_PILLAR_BREAKDOWN.map(p => (
          <R4P_PillarCard key={p.id} p={p} />
        ))}
      </div>
    </section>
  );
}

// ─── Comparison matrix · 4 pillars × 4 metrics ───────────
// Each cell is a small bar showing the pillar's value on that metric,
// normalized to the metric's max across all 4 pillars so relative
// differences pop. The "leader" cell in each row gets a clay accent.
function R4P_PillarMatrix() {
  const metrics = [
    { key: 'volume',    label: 'VOLUME',          unit: '%',  fmt: v => `${(v * 100).toFixed(0)}%` },
    { key: 'avgWatch',  label: 'AVG WATCH',       unit: '%',  fmt: v => `${(v * 100).toFixed(0)}%` },
    { key: 'saveRate',  label: 'SAVE RATE',       unit: '%',  fmt: v => `${(v * 100).toFixed(2)}%` },
    { key: 'cadence',   label: 'POSTS / WEEK',    unit: '',   fmt: v => v.toFixed(1) },
  ];
  // Cadence is hard-coded here; the others come from the breakdown
  const cadenceMap = { safety: 1.4, gear: 0.8, story: 0.7, reply: 0.3 };
  const data = R4_PILLAR_BREAKDOWN.map(p => ({
    id: p.id,
    label: p.label,
    color: window.R4_PILLAR_COLORS ? window.R4_PILLAR_COLORS[p.id] : p.color,
    volume:   p.share,
    avgWatch: p.avgWatch,
    saveRate: p.saveRate,
    cadence:  cadenceMap[p.id] || 0,
  }));

  return (
    <div style={{
      marginTop: 24,
      padding: '20px 24px',
      border: '1px solid var(--border-default)',
      background: 'var(--surface-1)',
      borderRadius: 8,
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
        <h3 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 500, fontSize: 18, color: 'var(--fg-primary)', letterSpacing: '-0.012em' }}>The four pillars, side by side.</h3>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-tertiary)', letterSpacing: '0.12em' }}>LEADER · CLAY · PER METRIC</span>
      </div>
      {/* Header row · pillar names */}
      <div style={{
        display: 'grid', gridTemplateColumns: '160px repeat(4, 1fr)',
        gap: 14, paddingBottom: 12, borderBottom: '1px solid var(--border-subtle)',
        alignItems: 'baseline',
      }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--fg-tertiary)', letterSpacing: '0.14em' }}>METRIC ↓ · PILLAR →</div>
        {data.map(d => (
          <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ width: 9, height: 9, borderRadius: '50%', background: d.color, flexShrink: 0 }} />
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, fontWeight: 600, color: 'var(--fg-primary)', letterSpacing: '-0.005em' }}>{d.label}</span>
          </div>
        ))}
      </div>
      {/* Metric rows */}
      {metrics.map((m, mi) => {
        const values = data.map(d => d[m.key]);
        const max = Math.max(...values);
        return (
          <div key={m.key} style={{
            display: 'grid', gridTemplateColumns: '160px repeat(4, 1fr)',
            gap: 14, padding: '12px 0', alignItems: 'center',
            borderBottom: mi < metrics.length - 1 ? '1px solid var(--border-subtle)' : 'none',
          }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-tertiary)', letterSpacing: '0.14em' }}>{m.label}</div>
            {data.map(d => {
              const v = d[m.key];
              const pct = max > 0 ? (v / max) * 100 : 0;
              const isLeader = v === max && values.filter(x => x === max).length === 1;
              return (
                <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ flex: 1, height: 6, background: 'var(--surface-2)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: isLeader ? 'var(--accent-primary)' : d.color, borderRadius: 3 }} />
                  </div>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 11,
                    fontWeight: isLeader ? 700 : 500,
                    color: isLeader ? 'var(--accent-primary)' : 'var(--fg-secondary)',
                    width: 44, textAlign: 'right',
                    letterSpacing: '-0.01em',
                  }}>{m.fmt(v)}</span>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

// Per-pillar 6-month share trend (synthetic, hand-shaped per pillar's
// growth story). Index 0 = 6 months ago, last = current month.
const R4_PILLAR_SHARE_TREND = {
  safety: [0.30, 0.34, 0.36, 0.38, 0.40, 0.42],   // gradual climb — became the trust core
  gear:   [0.34, 0.32, 0.30, 0.30, 0.29, 0.28],   // mild decline as story grew
  story:  [0.16, 0.18, 0.20, 0.21, 0.22, 0.22],   // climb on Truk arc
  reply:  [0.20, 0.16, 0.14, 0.11, 0.09, 0.08],   // dropped — Henry posts less Q&A
};

const R4_PILLAR_INSIGHT = {
  safety: 'Pulling weight. The cold-open switch in March compounded — share is up 12 points over 6 months.',
  gear:   'Underweighted relative to its yield. Save rate is double Story, but you post half as often.',
  story:  'Climbing on the Truk arc. The audience-builder pillar — every flagship has come from here.',
  reply:  'Dropped from 20% to 8%. Q&A is the most scalable pillar but you stopped posting it.',
};

function R4P_ShareSpark({ pillarId, color }) {
  const data = R4_PILLAR_SHARE_TREND[pillarId] || [];
  if (data.length === 0) return null;
  const W = 200, H = 28;
  const max = Math.max(...data, 0.45);
  const min = 0;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - ((v - min) / (max - min)) * (H - 4) - 2;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  const areaPath = `M0,${H} L${pts.split(' ').join(' L')} L${W},${H} Z`;
  // Compute trend direction (last vs first sample)
  const trend = data[data.length - 1] - data[0];
  const trendLabel = trend > 0.02 ? `+${(trend * 100).toFixed(0)}pp` : trend < -0.02 ? `${(trend * 100).toFixed(0)}pp` : 'flat';
  const trendColor = trend > 0.02 ? 'var(--tone-success)' : trend < -0.02 ? 'var(--tone-warning)' : 'var(--fg-tertiary)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
        <path d={areaPath} fill={color} fillOpacity="0.18" />
        <polyline points={pts} fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: trendColor, letterSpacing: '-0.01em' }}>{trendLabel}</span>
    </div>
  );
}

function R4P_PillarCard({ p }) {
  return (
    <article style={{ border: '1px solid var(--border-subtle)', borderRadius: 8, background: 'var(--surface-1)', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <header style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
            <window.R4PillarDot pillar={p.id} size={9} />
            <h3 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 500, fontSize: 22, color: 'var(--fg-primary)', letterSpacing: '-0.015em' }}>{p.label}</h3>
          </div>
          <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--fg-secondary)', lineHeight: 1.55 }}>{p.descriptor}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 28, fontWeight: 500, color: 'var(--fg-primary)', lineHeight: 1, letterSpacing: '-0.02em' }}>{p.count}</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--fg-tertiary)', letterSpacing: '0.1em', marginTop: 2 }}>POSTS · {Math.round(p.share * 100)}%</div>
        </div>
      </header>

      {/* Share bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ flex: 1, height: 6, background: 'var(--surface-2)', borderRadius: 999, overflow: 'hidden' }}>
          <div style={{ width: `${Math.round(p.share * 100)}%`, height: '100%', background: window.R4_PILLAR_COLORS ? window.R4_PILLAR_COLORS[p.id] : p.color, borderRadius: 999 }} />
        </div>
      </div>

      {/* 6-month share-over-time sparkline + insight */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg-tertiary)', letterSpacing: '0.14em', marginBottom: 4 }}>SHARE · LAST 6 MONTHS</div>
          <R4P_ShareSpark pillarId={p.id} color={window.R4_PILLAR_COLORS ? window.R4_PILLAR_COLORS[p.id] : p.color} />
        </div>
        <div style={{
          padding: '8px 12px',
          borderLeft: '2px solid var(--accent-primary)',
          background: 'var(--surface-2)',
          fontFamily: 'var(--font-serif)', fontStyle: 'italic',
          fontSize: 12.5, color: 'var(--fg-primary)', lineHeight: 1.4,
          letterSpacing: '-0.005em',
          maxWidth: 240,
        }}>
          {R4_PILLAR_INSIGHT[p.id]}
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 24, padding: '10px 0', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <R4P_MiniStat label="AVG RETN." value={`${(p.avgWatch * 100).toFixed(0)}%`} />
        <R4P_MiniStat label="SAVE RATE" value={`${(p.saveRate * 100).toFixed(2)}%`} />
        <R4P_MiniStat label="POSTING / WK" value={p.id === 'safety' ? '1.4' : p.id === 'gear' ? '0.8' : p.id === 'story' ? '0.7' : '0.3'} />
      </div>

      {/* Sample posts */}
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--fg-tertiary)', letterSpacing: '0.1em', marginBottom: 8 }}>CHARACTERISTIC OF THIS PILLAR</div>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          {p.samplePosts.map(post => (
            <window.R4PlatformCard key={post.id} post={post} density="compact" perfMode="off" />
          ))}
        </div>
      </div>
    </article>
  );
}

// ─── FORMATS section ─────────────────────────────────────
function R4P_FormatsSection() {
  const meta = R4_PATTERNS[1];
  return (
    <section id="formats-section" style={{ padding: '36px 48px 28px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--surface-1)' }}>
      <R4P_SectionHead meta={meta} />
      <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 0, border: '1px solid var(--border-default)', borderRadius: 8, overflow: 'hidden', background: 'var(--bg-base)' }}>
        {R4_FORMAT_BREAKDOWN.map((f, i) => {
          const samplePost = R4P_DATA.posts.find(p => p.id === f.samplePostId);
          return (
            <div key={f.key} style={{
              display: 'grid', gridTemplateColumns: '180px 1fr 220px 220px',
              alignItems: 'stretch', gap: 0,
              borderTop: i === 0 ? 'none' : '1px solid var(--border-subtle)',
            }}>
              {/* Sample post */}
              <div style={{ padding: '20px 18px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid var(--border-subtle)' }}>
                {samplePost && <window.R4PlatformCard post={samplePost} density="compact" perfMode="off" />}
              </div>
              {/* Title + role + note */}
              <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 8, borderRight: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <h3 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 20, fontWeight: 500, color: 'var(--fg-primary)', letterSpacing: '-0.015em' }}>{f.label}</h3>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg-tertiary)', letterSpacing: '0.1em', padding: '3px 7px', border: '1px solid var(--border-subtle)', borderRadius: 999 }}>{f.role.toUpperCase()}</span>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-tertiary)', letterSpacing: '0.08em' }}>{f.channels.toUpperCase()} · {f.count} POSTS · {(f.share * 100).toFixed(0)}% OF LIBRARY</div>
                <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--fg-secondary)', lineHeight: 1.55, maxWidth: 460 }}>{f.note}</p>
              </div>
              {/* Watch */}
              <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 4, borderRight: '1px solid var(--border-subtle)' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--fg-tertiary)', letterSpacing: '0.12em' }}>AVG WATCH %</span>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: 32, fontWeight: 500, color: 'var(--fg-primary)', lineHeight: 1, letterSpacing: '-0.02em' }}>
                  {f.avgWatchPct === null ? '—' : `${(f.avgWatchPct * 100).toFixed(0)}%`}
                </span>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--fg-tertiary)' }}>{f.avgWatchPct === null ? 'N/A for carousel' : 'across all posts'}</span>
              </div>
              {/* Save rate */}
              <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 4, background: f.key === 'carousel' ? 'rgba(182,83,43,0.05)' : 'transparent' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--fg-tertiary)', letterSpacing: '0.12em' }}>SAVE RATE</span>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: 32, fontWeight: 500, color: f.key === 'carousel' ? 'var(--accent-primary)' : 'var(--fg-primary)', lineHeight: 1, letterSpacing: '-0.02em' }}>
                  {(f.avgSaveRate * 100).toFixed(2)}%
                </span>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'var(--fg-tertiary)' }}>{f.key === 'carousel' ? '2× short-form' : 'of viewers'}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ─── HOOK DNA section ────────────────────────────────────
function R4P_HookDNASection() {
  const meta = R4_PATTERNS[2];
  return (
    <section id="hooks-section" style={{ padding: '36px 48px 28px' }}>
      <R4P_SectionHead meta={meta} />
      <div style={{ marginTop: 28, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 18 }}>
        {R4_HOOK_PATTERNS.map(h => {
          const post = R4P_DATA.posts.find(p => p.id === h.examplePostId);
          const aboveAvg = h.retention3s >= 0.86;
          return (
            <article key={h.key} style={{
              border: '1px solid var(--border-subtle)', borderRadius: 8,
              background: 'var(--surface-1)',
              padding: '18px 18px 16px',
              display: 'flex', flexDirection: 'column', gap: 12,
              minHeight: 380,
            }}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg-tertiary)', letterSpacing: '0.12em' }}>{h.occurrences} OCCURRENCES</div>
                <h4 style={{ margin: '4px 0 0', fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 500, fontSize: 19, color: 'var(--fg-primary)', letterSpacing: '-0.015em' }}>{h.title}</h4>
                <p style={{ margin: '6px 0 0', fontFamily: 'var(--font-sans)', fontSize: 11.5, color: 'var(--fg-secondary)', lineHeight: 1.5 }}>{h.summary}</p>
              </div>

              {/* Pull-quote example */}
              <blockquote style={{ margin: 0, padding: '10px 12px', borderLeft: '3px solid var(--accent-primary)', background: 'var(--surface-2)', fontFamily: 'var(--font-serif)', fontSize: 13.5, fontStyle: 'italic', color: 'var(--fg-primary)', lineHeight: 1.45 }}>
                {h.example}
              </blockquote>

              {/* Retention number */}
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg-tertiary)', letterSpacing: '0.1em' }}>3-SECOND RETENTION</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ fontFamily: 'var(--font-serif)', fontSize: 28, fontWeight: 500, color: aboveAvg ? 'var(--tone-success)' : 'var(--tone-warning)', lineHeight: 1, letterSpacing: '-0.015em' }}>{(h.retention3s * 100).toFixed(0)}%</span>
                </div>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 10.5, color: aboveAvg ? 'var(--tone-success)' : 'var(--tone-warning)' }}>{h.retention3sNote}</span>
              </div>

              {/* Example post tile */}
              <div style={{ marginTop: 'auto' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg-tertiary)', letterSpacing: '0.1em', marginBottom: 8 }}>FROM</div>
                {post && <window.R4PlatformCard post={post} density="compact" perfMode="off" />}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

// ─── helpers ─────────────────────────────────────────────
function R4P_SectionHead({ meta }) {
  return (
    <header>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--fg-tertiary)', letterSpacing: '0.14em' }}>{meta.eyebrow}</div>
      <h2 style={{ margin: '4px 0 0', fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 500, fontSize: 36, color: 'var(--fg-primary)', letterSpacing: '-0.02em', lineHeight: 1.05 }}>{meta.title}</h2>
      <p style={{ margin: '10px 0 0', fontFamily: 'var(--font-sans)', fontSize: 13.5, color: 'var(--fg-secondary)', lineHeight: 1.6, maxWidth: 720 }}>{meta.blurb}</p>
    </header>
  );
}

function R4P_MiniStat({ label, value }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg-tertiary)', letterSpacing: '0.1em' }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 500, color: 'var(--fg-primary)', letterSpacing: '-0.01em' }}>{value}</span>
    </div>
  );
}

function R4PTopbar() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        height: 26, padding: '0 10px',
        border: '1px solid var(--border-subtle)', borderRadius: 6,
        background: 'var(--surface-2)',
        fontFamily: 'var(--font-sans)', fontSize: 11.5, color: 'var(--fg-tertiary)',
      }}>
        <span style={{ width: 9, height: 9, border: '1.4px solid var(--fg-tertiary)', borderRadius: '50%' }} />
        <span>Search hooks, titles, themes…</span>
      </span>
      <span style={{
        width: 24, height: 24, borderRadius: '50%',
        background: 'var(--accent-primary)', color: 'var(--fg-on-accent)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 700,
      }}>H</span>
    </div>
  );
}

Object.assign(window, { HF_R4_LibraryPatterns });
